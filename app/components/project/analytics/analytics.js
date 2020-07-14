/* eslint-disable */
import {registerPlugins, Plugin} from '../../framework/jquery/plugins/plugins.js';
require('../utils/swipe/swipe');
import isMobile from 'ismobilejs';

/*
    Parse data attributes like: data-analytics="<analytics name>|<events>|<analytics params>|<event>|<platform restrictions>|<selector>;<next events...>"
    - <analytics name> - default: 'ga'
    - <events> - separated by space. default: 'click'
    - <analytics params> - default or 'button: 'send', 'event', 'button', 'click'
    - <event> - required: unique event name for the analytics platform
    - <platform restrictions> - optional: 'mobile'|'m', 'desktop'|'d', 'all'=(default)
    - <selector> - optional: relative selector

    For example:
    - "ga|click|button|logo-top|all|.button"
    - "|||logo-top" - Short version equivalent "ga|click|button|logo-top|all"
    - |change.flickity||2-swipe-video|mobile - Flickity
*/

class Analytics extends Plugin {
  constructor($element) {
    super($element);

    const data = $element.data('analytics');
    if( !data ) return;
    console.log('analytics!', data, isMobile );

    const _events = data.split(';');
    console.log('events', _events);

    _events.forEach(function(e,i){

      const params = e.split('|');

      // target
      let target = params[0] || 'ga';

      // events
      let events = (params[1] || 'click').replace(/,/gi,' ');

      // params
      let a_params = params[2];
      switch( target ){
        case 'ga':
          if( !a_params || a_params=='button' ) a_params = 'send,event,button,click';
          break;
      }

      if( typeof a_params === 'string' ) {
        if(a_params.charAt(0)==='{') {
          a_params = a_params.replace(/'/gi,'"');
          // console.log('parse params: ', a_params );
          a_params = JSON.parse(a_params);
        }else a_params = a_params.split(',');
      }

      // event_name
      if( target==='ga'){
        let event_name = params[3];
        a_params.push( event_name );
        if( !event_name ) {
          console.warn('@Analytics: INIT-FAIL: event required for element', e, $element );
          return;
        }
      }

      // platform restriction
      const platform = params[4];

      // selector
      const selector = params[5];
      const $target = selector ? $( selector, $element ) : $element;

      // console.log('@Analytics: INIT-SUCCESS: '+e, { target, events, a_params, platform, selector, $target, $element } );

      // if( events.indexOf('swipe')!=-1 ){
      //  $target.on('change.flickity', function(e){
      //      console.log('swipe', e );
      //  })
      // }

      $target.on( events, function(){

        const firstLetterOfPlatform = platform && platform.charAt(0).toLowerCase();
        if( firstLetterOfPlatform === 'd' ){
          if( !isMobile.any ) {
            _send( target, a_params, 'desktop');
          }
        }else if( firstLetterOfPlatform === 'm' ){
          if( isMobile.any ) {
            _send( target, a_params, 'mobile');
          }
        }else{
          _send( target, a_params, 'all');
        }

      });

    });

    function _send( target, params, platform ){

      console.log('@Analytics: '+platform+':', target, params );

      // !!! НЕНУЖНЫЕ АНАЛИТИКИ ЗАКОМЕНТИРОВАТЬ !!!
      switch(target){

        // case 'geti':
        //   if( window.__GetI ) window.__GetI.push(params);
        //   else console.warn('GetI code is not installed');
        //   break;

        // case 'dsp':
        //   if( window.DSPCounter ) window.DSPCounter('send',params);
        //   else console.warn('DSP code is not installed');
        //   break;

        case 'txq':
          if( window._txq ) window._txq.push(params);
          else console.warn('TXQ code is not installed');
          break;

        // case 'ym':
        //   if( window.ym ) window.ym(...params);
        //   else console.warn('YM code is not installed');
        //   break;

        case 'ga':
        default:
          if( window.ga ) window.ga( ...params );
          else console.warn('GA code is not installed');
          break;
      }
      // alert('@Analytics: '+platform+params );
    }

    // let = action
  }
}

registerPlugins(
  {
    "name": "analytics",
    "Constructor": Analytics,
    "selector": "[data-analytics]"
  }
);
