import 'parsleyjs';

// validation
$(() => {
  $("form").parsley();

  Parsley.addMessages('ru', {
    defaultMessage: "Некорректное значение.",
    type: {
      email: "Формат email-адреса некорректный",
      url: "Введите URL адрес.",
      number: "Введите число.",
      integer: "Введите целое число.",
      digits: "Введите только цифры.",
      alphanum: "Введите буквенно-цифровое значение."
    },
    notblank: "Это поле должно быть заполнено.",
    required: "Поле не заполнено",
    pattern: "Не использовать символы или цифры",
    min: "Это значение должно быть не менее чем %s.",
    max: "Это значение должно быть не более чем %s.",
    range: "Это значение должно быть от %s до %s.",
    minlength: "Пароль меньше %s символов",
    maxlength: "Это значение должно содержать не более %s символов.",
    length: "Неверный формат",
    mincheck: "Выберите не менее %s значений.",
    maxcheck: "Выберите не более %s значений.",
    check: "Выберите от %s до %s значений.",
    equalto: "Пароли не совпадают"
  });

  Parsley.setLocale('ru');
});

// search input change handler
$(() => {
  const form = $('[data-search-form]')

  if (form.length) {
    const input = form.find('input')

    input.on("change", function() {
      if ($(this).val()) {
        form.addClass('filled')
      } else {
        form.removeClass('filled')
      }
    })
  }
})