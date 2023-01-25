import 'select2';

// select
{
  $(() => {
    // const select = $('.select__select');
    customSelect2($('.select__select'));
  });
}

export function customSelect2 (select) {
  select.each(function () {
    const select = $(this);
    const selectWrapper = select.closest('.select-wrapper');
    const selectWrapperStyles = getComputedStyle(selectWrapper[0]);
    const selectPlaceholder = $(this).data('select-placeholder')
    if (selectWrapperStyles.position === 'static') {
      selectWrapper.css('position', 'relative');
    }

    select.select2({
      dropdownParent: selectWrapper,
      selectOnClose: true,
      minimumResultsForSearch: Infinity,
      placeholder: selectPlaceholder,
    });

    select.on('select2:open', () => {
      selectWrapper.css('z-index', '100000');

      const selectDropdown = selectWrapper.find('.select2-dropdown');

      selectDropdown.hide();
      const timeout = setTimeout(() => {
        selectDropdown.slideDown({ duration: 500, });

        clearTimeout(timeout);
      }, 0);
    });

    select.on('select2:closing', event => {
      event.preventDefault();

      const selectDropdown = selectWrapper.find('.select2-dropdown');

      const timeout = setTimeout(() => {
        selectWrapper.css('z-index', '');

        const select2 = selectWrapper.find('.select2');

        select2.addClass('closing');
        select2.removeClass('select2-container--open');
        selectDropdown.slideUp(500, () => {
          const timeout2 = setTimeout(() => {
            select.select2('destroy');
            select.select2({
              dropdownParent: selectWrapper,
              selectOnClose: true,
              minimumResultsForSearch: Infinity,
              placeholder: selectPlaceholder,
            });
            select.removeClass('closing');

            selectWrapper.css('z-index', '');

            clearTimeout(timeout2);
          }, 300);
        });
        clearTimeout(timeout);
      }, 0);
    });
  });
}
