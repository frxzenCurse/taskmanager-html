document.addEventListener('DOMContentLoaded', () => {
  const comments = document.querySelectorAll('.comment')

  if (comments.length) {
    //comment edit
    window.addEventListener('click', event => {
      const target = event.target.closest('[data-comment-edit]')

      if (target) {
        const parent = target.closest('[data-entity]')
        const text = parent.querySelector('[data-entity-filed=body]')
        const col = parent.querySelector('[data-comment-col]')
        const area = parent.querySelector('textarea')

        if (target.classList.contains('active')) {
          if (!area.value || !area.value.match(/\S/gi)) {
            area.classList.add('error')
            return
          }

          if (area.classList.contains('error')) {
            area.classList.remove('error')
          }

          const data = {
            id: parent.getAttribute('data-entity-id'),
            body: area.value,
            taskId: parent.closest('[data-entity=tasks]').getAttribute('data-entity-id')
          }

          console.log(data);

          $.ajax({
            method: 'POST',
            url: `${window.location.origin}/comments/save`,
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(r) {
              console.log(r);
            }
          })

          text.textContent = area.value
          col.classList.remove('active')
        } else {
          col.classList.add('active')
          area.value = text.textContent
        }

        target.classList.toggle('active')
      }
    })
  }
})