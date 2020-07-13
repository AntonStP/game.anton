/* eslint-disable */
import {
  registerPlugins,
  Plugin
} from "../../../framework/jquery/plugins/plugins";

import { addTransitionEndEvent, removeTransitionEndEvent, addAnimationEndEvent, removeAnimationEndEvent } from '../utils.js';

/*
Работает с аттибутом - data-inviewport

Data Format: {
  <condition1>: [
    "<repeat>|<action>|<action value>|<action data>|<delay>",
    .. more actions
  ],
  <condition2>...
}

- <condition>: >.5[,<=.8] (default = <.5)
- <repeat>
  - "once"|"" - срабатывает один раз при входе
  - "trigger"|"t" - срабатывает каждый раз при отличном от предыдущего результата condition
  - "???" - срабатывает только при выходе // TODO: Дописать!
- <delay> - задержка сработки экшена в секундах

Генерация события
  - <action> = "event"
  - <action value> - event name
  - <action data> - event data [optional]

Добавление класса
  - <action> = "addclass"|"ac"
  - <action value> - <class name>[;<class name after prev animation is completed>]
  - <action data> - target selector (Relative to element owned the data-inviewport attribute) [optional]

Пимер: data-inviewport="data-inviewport": {
          ">0,<0.8": [
            "once|event|animator.initPrize",
            "|addclass|added_class|.selector_to", // relative selector
            "|addclass|added_class|body;.selector_to", // absolute selector
          ]
        }"

TODO:
*/

const tracked_elements = [];
var is_inited;
var viewport_height;
var $win;
// var transitionEvent, animationEvent;

class Inviewport extends Plugin {

  // eslint-disable-next-line no-useless-constructor
  constructor($element) {
    super($element);

    const scope = this;

    if( !is_inited ){
      // console.log('SCROLL!!!');

      // transitionEvent = whichTransitionEvent();
      // animationEvent = whichAnimationEvent();

      is_inited = true;

      $win = $(window);
      $win
        .on('scroll', function(){ scope.update() })
        .resize(function(){
          console.log('resize');
          viewport_height = window.innerHeight;
        })
        .trigger('resize');
    }

    /*
    - element
    - condition1
      - enabled
      - action1
      - action2
    - condition2
      - action1
      - action2
    */
    // const tracking_data = [];
    var data = $element.data('inviewport');
    console.log('viewport data: ', data );

    const conditions = [];
    const element_data = {
      conditions: conditions,
      element: $element
    };
    tracked_elements.push( element_data );

    for( var condition_name in data ){ // parse conditions
      const condition = data[condition_name];
      if( !condition ) return;

      const o ={};
      conditions.push( o );

      // condition
      o.condition = [];
      const _condition = condition_name.split(',');
      _condition.forEach(function(e){

        var s = e.split('<='); if( s.length>1 ){
          o.condition.push( [_conditionLessEqual, parseFloat(s[1]) ]);
        }

        s = e.split('<'); if( s.length>1 ){
          o.condition.push( [_conditionLess, parseFloat(s[1]) ]);
        }

        s = e.split('>='); if( s.length>1 ){
          o.condition.push( [_conditionMoreEqual, parseFloat(s[1]) ]);
        }

        s = e.split('>'); if( s.length>1 ){
          o.condition.push( [_conditionMore, parseFloat(s[1]) ]);
        }

      });

      // console.log('COND:', o );

      // parse actions
      o.actions = [];
      condition.forEach(function( _action_data ){
        const action = {
          enabled: true
        };
        o.actions.push( action );
        _action_data = _action_data.split('|');

        action.repeat = !_action_data[0] || _action_data[0]=='once' ? false : _action_data[0];

        action.previous_state = false;

        action.action = _action_data[1];

        action.delay = _action_data[4];
        if( action.delay ) action.delay = ~~(parseFloat(action.delay)*1000);

        // event
        switch( action.action ){

          case '':
          case 'event':
            action.action = 'event';
            action.event_name = _action_data[2];
            action.event_data = _action_data[3];
            break;

          case 'addclass':
          case 'ac':
          case 'removeclass':
          case 'rc':
            action.action = action.action == 'addclass' || action.action == 'ac' ? 'ac' : 'rc';
            const _class_name = _action_data[2].split(';');
            action.class_name = _class_name[0];
            action.class_name_next = _class_name[1];
            action.selector = _action_data[3].split(';');
            if( action.selector.length>1 ){
              action.parent = action.selector[0] || 'body';
              action.selector = action.selector[1];
            }else{
              action.selector = action.selector[0];
            }
            break;

        }

        // console.log('act: ', _action_data, action );
      });

    };



    console.log('parsed tracking elements', tracked_elements );

    function _conditionLessEqual ( v1, v2 ) { return v1 <= v2; }
    function _conditionLess ( v1, v2 ) { return v1 < v2; }
    function _conditionMoreEqual ( v1, v2 ) { return v1 >= v2; }
    function _conditionMore ( v1, v2 ) { return v1 > v2; }

    setTimeout(function(){
      // console.log('update TRACK!', $element );
      scope.updateElement( element_data );
    });

  }


  //
  update( e ){
    // const viewport_top = window.pageYOffset || document.documentElement.scrollTop;
    // const viewport_bottom = viewport_top + window.innerHeight;
    // console.log('SCROLL', viewport_top, viewport_bottom );
    const scope = this;
    tracked_elements.forEach(function(o,i){
      scope.updateElement(o);
    });
  }

  //
  updateElement( o ){

    const scope = this;
    const bounds = o.element[0].getBoundingClientRect();
    // console.log('updateElement',bounds, o, viewport_height);

    o.conditions.forEach(function(condition_data){

      var result = true;
      condition_data.condition.forEach(function(cond){
        if( !cond[0]( bounds.y || bounds.top, viewport_height * cond[1] ) ) result = false;
      });

      condition_data.actions.forEach(function(action_data){

        if( !action_data.enabled  ) return;
        // console.log( condition_data ); // !!!

        if( !action_data.repeat && !result ) return; // if is Repeat once type

        if(  result == action_data.previous_state ) return; // if is Trigger type
        action_data.previous_state = result;

        // console.log('trigger state', result );

        // action is an event
        if( action_data.event_name ){

          _trigger( action_data, function(){
            console.log('event!', action_data.event_name, action_data.event_data ); // !!!
            $win.trigger( action_data.event_name, action_data.event_data )
          });

          // action add class
        }else if( action_data.action == 'ac' || action_data.action == 'rc' ){

          _trigger( action_data, function(){

            const el = action_data.selector ? $( action_data.selector, action_data.parent || o.element ) : o.element;

            // console.log( action_data.action+'!', action_data.class_name, action_data.selector, el, o.element, action_data.parent ); // !!!

            if( action_data.action == 'ac' && result ) el.addClass( action_data.class_name ); // TODO: Вариант для removeclass - инвертировать
            else el.removeClass( action_data.class_name );

            // Если передали 2 класса через ";" ждем завершения текущей анимации и применяем следующую
            if( action_data.class_name_next ){
              // console.log('action_data.class_name_next!', action_data.class_name_next );

              var el_ = el[0];

              function _onAnimComplete() {
                // el[0].removeEventListener( transitionEvent, _onAnimComplete );
                // el[0].removeEventListener( animationEvent, _onAnimComplete );
                removeTransitionEndEvent( el_, _onAnimComplete );
                removeAnimationEndEvent( el_, _onAnimComplete );
                // console.log('Transition complete!  This is the callback, no library needed!');
                el.removeClass( action_data.class_name );
                el.addClass( action_data.class_name_next );
              }

              // el[0].addEventListener(transitionEvent, _onAnimComplete );
              // el[0].addEventListener(animationEvent, _onAnimComplete );
              addTransitionEndEvent( el_, _onAnimComplete );
              addAnimationEndEvent( el_, _onAnimComplete );
            }

          });
        }

      });

    });

    function _trigger( action_data, _func ){
      if( action_data.repeat === false ) action_data.enabled = false;
      setTimeout( _func, action_data.delay || 0 );
    }

  }

}

registerPlugins({
  name: "inviewport",
  Constructor: Inviewport,
  selector: "[data-inviewport]"
});
