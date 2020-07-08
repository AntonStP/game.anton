/* eslint-disable */
// ---------------------------------------------------------------
// JQ COMPONENT
/*
  Example:
  p Суперприз:
    span( data-stoloto-api="7x49|draw.superPrize|| {{number value}} ₽")
  p Билеты от:
    span( data-stoloto-api="7x49|draw.betCost|| Билеты от {{number value}} ₽")
  p Старт:
    p( data-stoloto-api="7x49|draw.date|countdown| через {{zero-first hours}} {{get-end hours 'час' 'часа' 'часов'}}")
    p( data-stoloto-api="7x49|draw.date|countdown| {{zero-first minutes}} {{get-end minutes 'минуту' 'минуты' 'минут'}}")
    p( data-stoloto-api="7x49|draw.date|countdown| {{zero-first seconds}} {{get-end seconds 'секунду' 'секунды' 'секунд'}}")

  TODO: show date and countdown
*/

import StolotoApi from './StolotoApi';
import {registerPlugins, Plugin} from '../../framework/jquery/plugins/plugins.js';

//
const getFirstAttrs = ( str, delimeter, attrCount )=>{
  const attrs = [];
  for( var i=0; i<attrCount; i++) {
    const pos = str.indexOf(delimeter);
    if (pos === -1) {
      break;
    }
    attrs.push( str.substr(0, pos) );
    str = str.substr(pos + 1, str.length);
  }
  attrs.push(str);
  return attrs;
}



//
class StolotoApiHandler extends Plugin {

  static JSON_PATH = "./data/content.json";

  constructor($element) {
    super($element);

    var data = $element.data('stoloto-api');
    console.log('stolotoapi', data );
    if( !data ) return;

    data = getFirstAttrs( data, '|', 3 );

    switch( data[0] ){

      case '@countdown':
        data.shift();
        StolotoApi.createVirtualCountDown( ...data );
        return;

      case '@show':
        data.shift();
        StolotoApi.addConditionalElement( $element, 'show', ...data );
        return;

      case '@hide':
        data.shift();
        StolotoApi.addConditionalElement( $element, 'hide', ...data );
        return;

    }

    const lotteryName = data[0];
    const data_path = data[1];
    const type = data[2];
    const template = data[3];
    // console.log('data-dtoloto-api->', lotteryName, data_path, template, type);
    StolotoApi.bindElement( $element, lotteryName, data_path, template, type );
  }
}

registerPlugins(
  {
    "name": "stolotoApiHandler",
    "Constructor": StolotoApiHandler,
    "selector": "[data-stoloto-api]"
  }
);
