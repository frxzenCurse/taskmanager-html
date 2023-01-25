import "./styles/app";

import "./scripts/forms";
import "./scripts/accordion";
import "./scripts/fancybox";
import "./scripts/select";
import "./scripts/subtaskAdd";
import "./scripts/comment";
import "./scripts/backend";
import bootstrap from  'bootstrap/dist/js/bootstrap.min.js';
import './scripts/datepicker'

$(() => {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
})