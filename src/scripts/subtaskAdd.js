document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('[data-add-container]')

  if (container) {
    const button = document.querySelector('[data-add-button]')
    const item = container.querySelector('[data-add-item]')

    button.onclick = function() {
      const clone = item.cloneNode(true)
      clone.querySelector('input').value = ''
      container.append(clone)
    }
  }
})