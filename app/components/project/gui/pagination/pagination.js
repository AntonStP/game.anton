/* eslint-disable */
import {
  registerPlugins,
  Plugin
} from "../../../framework/jquery/plugins/plugins";
import $ from "jquery";
import onScreen from "../../utils/on-screen";

class Pagination  {
  // eslint-disable-next-line no-useless-constructor
  constructor($element) {

    const $html = $('html, body');

    const $items = $element.find(".pagination__item");

    const $number = $element.find(".pagination__index").find("span");

    const $sections =  $element.parent().find(".section");

    const $window = $(window);

    let current = 0;

    // смена по клику на элемент
    $items.each(index=>{
      $items.eq(index).click(()=>{select(index)});
    });

    // смена по клику на стрелки
    const $arrowTop = $element.find(".pagination__arrow_top").click(()=>{select(current - 1)});
    const $arrowBottom = $element.find(".pagination__arrow_bottom").click(()=>{select(current + 1)});

    // смена на скролл и ресайз
    $window.on('scroll resize', checkPosition);

    function select(index, noAnimation){
      if (index < 0 || index >= $items.length) return;
      current = index;

      // меняем номер текущего раздела
      $number.text(addZeroIfNeeded(index+1));
      const $current = $items.eq(index);
      const dest = $current.attr('href');
      if (!noAnimation){
        if(dest !== undefined && dest !== ''){
          $html.animate({
              scrollTop: $(dest).offset().top
            }, 500
          );
        }
      }
      // передача текущего index
      $element.find('.pagination__index span').html($element.attr('data-index'));
      // удаление у всех элементов списка активного класса
      $element.find('.pagination__item').removeClass("pagination__item_active");
      // передача активного класса
      $current.addClass("pagination__item_active");

      // проверка для стрелок (скрывать/открывать в зависимости от последнего элемента)
      $arrowTop.toggleClass('pagination__arrow_hidden', index === 0);
      $arrowBottom.toggleClass('pagination__arrow_hidden', index === $items.length - 1);
    }

    checkPosition();

    function checkPosition(){
      const scroll = $window.scrollTop();
      $sections.each(index=>{
        const $item = $sections.eq(index);
        if (scroll === 0){
          select(0, true);
        }else{
          if (onScreen($item, true)){
            select(index, true);
          }
        }
      });
    }

    function addZeroIfNeeded(number){
      if (number < 10){
        return `0${number}`
      }
      return number;
    }
  }
}


registerPlugins({
  name: "pagination",
  Constructor: Pagination,
  selector: ".pagination"
});
