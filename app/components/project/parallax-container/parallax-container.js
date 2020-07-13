/* eslint-disable */
import {registerPlugins, Plugin} from '../../framework/jquery/plugins/plugins.js';
// import 'gsap';
import {settings} from './settings'

class ParallaxContainer extends Plugin {

  constructor($element) {
    super($element);

    this.onMouseMove = this.onMouseMove.bind(this);
    this.update = this.update.bind(this);

    this.$element = $element;
    this.settings = this.getSettings();
    this.$items = $element.find('[data-parallax]');
    this._toParallax = {x: 0, y: 0};
    this.parallax = {x: 0, y: 0};

    $($element).on('mousemove', this.onMouseMove);

    this.update();

    // requestAnimationFrame(this.update);

    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", (event) => {
        this.tilt([event.beta * 2, event.gamma * 2]);
      }, true);
    } else if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', (event) => {
        this.tilt([event.acceleration.x * 2, event.acceleration.y * 2]);
      }, true);
    } else {
      window.addEventListener("MozOrientation", () => {
        this.tilt([orientation.x * 50, orientation.y * 50]);
      }, true);
    }
  }

  tilt(pos) {
    if (!this.firstPos) {
      this.firstPos = {x: pos[0], y: pos[1]};
    }
    pos[0] = this.firstPos.x - pos[0];
    pos[1] = this.firstPos.y - pos[1];
    window.innerHeight > window.innerWidth && pos.reverse();

    this._toParallax.x = Math.max(-1, Math.min(this._toParallax.x + 0.1 * Math.sign(pos[0]), 1));
    this._toParallax.y = Math.max(-1, Math.min(this._toParallax.y + 0.1 * Math.sign(pos[1]), 1));
  }

  getSettings() {
    const args = String(this.$element.data('parallax-settings')).split(':');
    let min, max;
    min = args[1] && Number(args[1].split(';')[0]) || Number.MIN_VALUE;
    max = args[1] && Number(args[1].split(';')[1]) || Number.MAX_VALUE;
    return {
      maxDistance: Number(args[0]),
      min,
      max
    }
  }


  update() {

    if (window.innerWidth > this.settings.max || window.innerWidth < this.settings.min) {
      this._toParallax.x = this._toParallax.y = 0;
    }

    const parallax = this.parallax;
    const delta = {};

    // console.log('pp', parallax.x, this._toParallax.x );

    // delta.x = Math.abs(this._toParallax.x - parallax.x) < 1 ? this._toParallax.x - parallax.x : (this._toParallax.x - parallax.x) * 0.05;
    // delta.y = Math.abs(this._toParallax.y - parallax.y) < 1 ? this._toParallax.y - parallax.y : (this._toParallax.y - parallax.y) * 0.05;
    // parallax.x += delta.x;
    // parallax.y += delta.y;
    parallax.x += (this._toParallax.x - parallax.x ) / 20;
    parallax.y += (this._toParallax.y - parallax.y ) / 20;

    this.$items.each((index, element) => {

      const $element = $(element);

      /*
      if ($element.data('parallax-enabled') === undefined) {
        const arr = $element.css('transform').split(',');
        if (arr[0] === 'none' || Number(arr[4]) === 0 && Number(arr[5].replace(')', '')) === 0) {
          $element.attr('data-parallax-enabled', 'true');
          $element.css('transition', 'unset');
        }
        return;
      }
*/
      /*
      const distance = -(Number($element.data('parallax')) - this.settings.maxDistance * 0.5);
      const current = {
        x: (element._gsTransform && element._gsTransform.x) || 0,
        y: (element._gsTransform && element._gsTransform.y) || 0,
      };
      const end = {
        x: parallax.x * distance * settings.parallax.x * window.innerWidth * devicePixelRatio,
        y: parallax.y * distance * settings.parallax.y * window.innerHeight * devicePixelRatio,
      };
       */
/*
      TweenMax.set(element, {
        force3D: true,
        x: current.x + (end.x - current.x) * 0.05,
        y: current.y + (end.y - current.y) * 0.05,
      });
*/
      const distance = $element.data('parallax') * .5;
      $element.css({
        transition: "unset",
        // transform: `translate3d(${current.x + (end.x - current.x) * 0.1}px, ${current.y + (end.y - current.y) * 0.1}px, 0px)`
        transform: `translate3d(${-parallax.x * distance}px, ${-parallax.y * distance}px, 0px)`
      });



    });

    requestAnimationFrame(this.update);

  }

  onMouseMove(e) {
    const origEvent = e.originalEvent;
    if (origEvent.touches && !origEvent.touches.length) {
      return;
    }
    const x = origEvent.touches ? origEvent.touches[0].clientX : origEvent.clientX;
    const y = origEvent.touches ? origEvent.touches[0].clientY : origEvent.clientY;

    this._toParallax.x = (x / window.innerWidth - 0.5) * 2;
    this._toParallax.y = (y / window.innerHeight - 0.5) * 2;
  }

  init(action, ...args) {
    if (action && typeof this[action] === 'function') {
      return this[action].apply(this, args);
    }
  }

  destroy() {

  }
}

registerPlugins(
  {
    "name": "parallaxContainer",
    "Constructor": ParallaxContainer,
    "selector": ".parallax-container"
  }
);
