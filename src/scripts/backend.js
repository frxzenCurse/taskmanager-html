import { customSelect2 } from './select'
import {errorChangeHandler} from './utils'

$(() => {
  addTask()
  windowClickHandler()
  addEntity()
  addUserInWorkspace()
  searchTasks()
  showMore()
})

function addTask() {
  const form = $('[data-type]')
  
  form.on('submit', function(e) {
    e.preventDefault()
    const path = window.location.pathname.split('/')
    let data = {
      subtasks: [],
      workspaceId: path[2],
    }
    const select = form.find('[data-select]')
    const file = form.find('[data-form-file]')

    if (!select.val()) {
      select.closest('.select').addClass('select--error')
      select.one('change', errorChangeHandler)
      return
    }

    data.status = select.val().toUpperCase()
    
    form.find('[data-type=get-field]').each(function() {
      const field = $(this).attr('data-uf')
      const value = $(this).val()
      
      if (field === 'subtasks') {
        if (value) {
          data[field].push(value) 
        }
      } else {
        data[field] = value ? value : null
      }
    })

    const formData = new FormData()

    for (let key in data) {
      if (data[key]) {
        formData.append(key, data[key])
      }
    }

    if (file[0].files.length) {
      $.each(file[0].files, function (key, input) {
        formData.append('files', input);
      });
    }

    $.ajax({
      method: 'POST',
      url: `${window.location.origin}/tasks/add`,
      // contentType: 'multipart/form-data',
      contentType: false,
      processData: false,
      data: formData,
      success: function(r) {
        form.closest('.modal').modal('hide')
        form[0].reset()
        form.find('[data-select]').val(null).trigger('change')
        $('#accordion').append($(r))

        const id = $(r).attr('data-entity-id')
        customSelect2($(`[data-entity=tasks][data-entity-id=${id}]`).find('[data-select]'))
      }
    })
  })
}

function windowClickHandler() {
  window.addEventListener('click', event => {
    const target = $(event.target)

    if (target.closest('[data-save-task]').length) {
      updateTask(target)
    }

    if (target.closest('[data-delete-entity]').length) {
      deleteEntity(target)
    }

    if (target.closest('[data-delete-workspace]').length) {
      deleteWorkspace()
    }

    if (target.closest('[data-workspace-exit]').length) {
      workspaceExit()
    }
  })
}

function updateTask(target) {
  const task = target.closest('[data-entity=tasks]')
  const data = {
    id: task.attr('data-entity-id'),
    status: task.find('[data-select]').val().toUpperCase(),
    subtasks: [],
    comments: [],
  }

  task.find('[data-task-field=text]').each(function() {
    const property = $(this).attr('data-uf')
    data[property] = $(this).text()
  })

  if (data.expectedTime === 'Без времени') {
    data.expectedTime = null
  }

  const subtasks = task.find('[data-entity=subtasks]')
  if (subtasks.length) {
    task.find('[data-entity=subtasks]').each(function() {
      const subtask = {
        id: $(this).attr('data-entity-id'),
        complete: $(this).find('[data-entity-field=complete]')[0].checked,
        name: $(this).find('[data-entity-field=name]').text(),
      }
      data.subtasks.push(subtask)
    })
  }

  console.log(data);

  $.ajax({
    method: 'POST',
    url: `${window.location.origin}/tasks/update`,
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: function(r) {
      console.log(r);
      if (r.status.toLowerCase() === 'complete') {
        task.addClass('completed')
        task.find('[data-accordion-dropdown]').slideUp()
        task.removeClass('active')
      }
      showAlert('success', 'Задача успшено обновлена')
    }
  })
}

function deleteEntity(target) {
  const element = target.closest('[data-entity]')
  const entity = element.attr('data-entity')
  const id = element.attr('data-entity-id')

  $.ajax({
    type: 'POST',
    url: `${window.location.origin}/${entity}/delete/${id}`,
    success: function(r) {
      console.log(r);
      element.remove()
      showAlert('success', r);
    }
  })
}

function deleteWorkspace() {
  const path = window.location.pathname.split('/')

  $.ajax({
    method: 'POST',
    url: `${window.location.origin}/workspace/delete/${path[2]}`,
  })
}

function workspaceExit() {
  const path = window.location.pathname.split('/')

  $.ajax({
    method: 'POST',
    url: `${window.location.origin}/workspace/exit/${path[2]}`,
  })
}

function addUserInWorkspace() {
  const form = $('[data-add-user]')
  const path = window.location.pathname.split('/')
  
  form.on('submit', event => {
    event.preventDefault()
    const data = {
      workspaceId: path[2],
      email: form.find('[data-uf=email]').val(),
      role: form.find('[data-select]').val()
    }
    console.log(data);
    $.ajax({
      method: 'POST',
      url: `${window.location.origin}/role/add`,
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function(r) {
        console.log(r);
        $("[data-roles-container]").append($(r))
        form[0].reset()
      },
      error: function(r) {
        console.log(r);
        showAlert("error", r.responseText)
      }
    })
  })
}

function addEntity() {
  document.addEventListener('submit', event => {

    if (event.target.hasAttribute('data-add-form')) {
      event.preventDefault()
      const data = {}
      const form = $(event.target)
      const entity = form.attr('data-add-form')
      const cloneParent = form.closest('[data-clone-parent]')

      form.find('[data-form-field]').each(function() {
        const property = $(this).attr('data-form-field')

        data[property] = $(this).val()
      })

      if (cloneParent.length) {
        const task = form.closest('[data-entity=tasks]')
        data.taskId = task.attr('data-entity-id')
      }

      console.log(data);

      const name = form.attr('data-form-name')

      $.ajax({
        method: 'POST',
        url: `${window.location.origin}/${entity}/add`,
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(r) {
          console.log(r);
          event.target.reset()

          if (cloneParent.length) {
            cloneParent.find('[data-clone-container]').append($(r))
          }

          showAlert('success', `${name} успешно добавлен`);
        }
      })
    }
  })
}

function showAlert(className, message) {
  const alert = $('.panel')
  const text = $('[data-alert-message]')

  text.text(message)

  alert.addClass(className)
  alert.addClass('show')

  setTimeout(() => {
    alert.removeClass("show")
    setTimeout(() => {
      alert.removeClass(className)
    }, 500);
  }, 2000);
}

function searchTasks() {
  const form = $('[data-search-form]')
  const path = window.location.pathname.split('/')

  form.on("submit", function(event) {
    event.preventDefault()

    const query = form.find('input').val()

    if (query) {
      $.ajax({
        method: 'GET',
          url: `${window.location.origin}/tasks/search?workspaceId=${path[2]}&query=${query}`,
          success: function(r) {
            $('[data-tasks-container]').empty()
            const res = $(r)
            $('[data-tasks-container]').append(res)
            console.log(res.find('[data-select]'));
            customSelect2(res.find('[data-select]'))
            $('[data-show-container]').addClass('hidden')
          }
      })
    } else {
      getPaginationTasks()
    }
  })

  const button = form.find('[data-search-clear]')

  button.on('click', function() {
    getPaginationTasks()
  })

  function getPaginationTasks() {
    $.ajax({
      method: 'GET',
        url: `${window.location.origin}/tasks/?workspaceId=${path[2]}&page=0`,
        success: function(r) {
          form.find('input').val('').trigger('change')
          $('[data-tasks-container]').empty()
          const items = $(r).find('#accordion').children()
          $('[data-tasks-container]').append(items)

          if (items.length === 10) {
            $('[data-show-container]').removeClass('hidden')
          }
        }
    })
  }
}

function showMore() {
  let page = 1
  const path = window.location.pathname.split('/')

  const button = $('[data-show-button]')

  button.on('click', function() {
    $.ajax({
      method: 'GET',
        url: `${window.location.origin}/tasks/?workspaceId=${path[2]}&page=${page}`,
        success: function(r) {
          const children = $(r).find('#accordion').children()
          $('[data-tasks-container]').append(children)

          customSelect2(children.find('[data-select]'))

          if ($(r).find('[data-show-container]').length) {
            page++
          } else {
            button.closest('[data-show-container]').addClass('hidden')
          }
        }
    })
  })
}
