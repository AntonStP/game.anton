import $ from "jquery";

export default function onScreen(elem, center) {
  // if the element doesn't exist, abort
  if( elem.length === 0 ) {
    return false;
  }
  const $window = $(window);
  const viewportTop = $window.scrollTop();
  const viewportHeight = $window.height();
  const viewportBottom = viewportTop + viewportHeight;
  const $elem = $(elem);
  const {top} = $elem.offset();
  const height = $elem.height();
  const bottom = top + height;

  return (top >= viewportTop && top < (center ? viewportBottom - viewportHeight / 2 : viewportBottom )) ||
    (bottom > viewportTop && bottom <= viewportBottom) ||
    (height > viewportHeight && top <= viewportTop && bottom >= viewportBottom)
}
