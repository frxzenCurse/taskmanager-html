import { Datepicker } from "vanillajs-datepicker";
import ru from "vanillajs-datepicker/locales/ru";

document.addEventListener("DOMContentLoaded", () => {
  const picker = document.querySelector("[data-date-picker]");

  if (picker) {
    Object.assign(Datepicker.locales, ru);

    new Datepicker(picker, {
      autohide: true,
      format: 'dd.mm.yyyy',
      language: "ru",
    });
  }
});