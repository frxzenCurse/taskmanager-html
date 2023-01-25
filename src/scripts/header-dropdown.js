
document.addEventListener('DOMContentLoaded', () => {
  const parent = document.querySelector('[data-header-parent]')
  const button = parent.querySelector('[data-header-button]')

  button.onclick = function() {
    parent.classList.toggle('active')
    button.classList.toggle('active')
  }
})