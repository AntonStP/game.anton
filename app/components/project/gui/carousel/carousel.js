/* eslint-disable */
import $ from 'jquery';
import {registerPlugins, Plugin} from '../../../framework/jquery/plugins/plugins.js';

import Swiper from "swiper";

const PRESETS = {
  default: {
    // preloadImages: false,
    // // Enable lazy loading
    // lazy: true,
    // watchSlidesProgress: true,
    // watchSlidesVisibility: true,
    slidesPerView: "auto",
    centeredSlides: "true",
    loop: "true",
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    }
  },
  free_scroll: {
    freeMode: true
  }
};

export class Carousel extends Plugin {
  constructor($element) {
    super($element);
    let data = $element.data('carousel');
    if (typeof data === 'string') {
      data = PRESETS[data];
    }

    this.carousel = new Swiper(
      $element.get(0),
      $.extend({}, PRESETS.default, data)
    );
  }

  destroy(){
    super.destroy()
    if (this.carousel)
      this.carousel.destroy();
    this.carousel = null;
  }

}

registerPlugins(
  {
    'name': 'carousel',
    'Constructor': Carousel,
    'selector': '.carousel'
  }
);
