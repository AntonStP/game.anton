/* eslint-disable */
import {getNestedByString} from '../utils/utils';
import Handlebars from 'handlebars';
import $ from 'jquery';
require('../../framework/template-engine/template-engine__helpers');

//
var $win;


// ---------------------------------------------------------------
// CLASS
class StolotoApi{

  //
  #countdownInterval;
  #lottery_data = {};
  #countdownConditionalElements = {};
  #isUpdating = false;
  #lastUpdateTime;

  //
  lottery_name = "";
  api_url = "https://api.stoloto.ru/mobile/api/v27/service/games/info-new";
  binded_elements = [];
  countdowns = {};
  countdownIsStarted = false;
  virtualCountdowns = {};
  //


  //
  constructor() {
    $win = $(window);
    $win
      .on('stolotoapi.update', ()=>{
        this.update();
      })
    ;
  }


  //
  update(){



    if( this.#isUpdating || Date.now() - this.#lastUpdateTime < 10000 ) return;
    this.#isUpdating = true;

    console.log('update', this.api_url );

    /*
    if( !this.lottery_name ) {
      console.warn('lottery name required');
      return;
    }
     */

    $.get(
      this.api_url,
      {},
      (result)=>{

        // get particular lottery
        // if( this.lottery_name ) {

        const lottery_data = this.#lottery_data = {};
        for (var i in result.games) {
          const gameData = result.games[i];
          lottery_data[gameData.name] = gameData;
        }

        for( var i in this.virtualCountdowns ){
          lottery_data[i] = this.virtualCountdowns[i];
        }

        // >>> dispatch data
        console.log('STOLOTO API. updated:', result, lottery_data, this );
        $win.trigger('stolotoapi.updated', lottery_data);

        // >>> Fill binded elements >>>
        this.binded_elements.forEach((e,i)=>{
          if(e.type === 'countdown') return;
          var value = getNestedByString( lottery_data[e.lotteryName], e.data_path );
          // console.log('->', e, value, e.template({value}) );
          if( !value ) {
            console.warn('can\'t find data by path"'+e.data_path+'".');
            return;
          }
          const _data = {value:value};
          $(e.$el).html(e.template(_data));
        });
        // <<< Fill binded elements <<<

        this.contdownUpdate();
        this.#lastUpdateTime = Date.now();
        this.#isUpdating = false;
      }
    );
  }

  //
  bindElement( $el, lotteryName, data_path, template, type ){
    // console.log('bindElement', $el, lotteryName, data_path, template, type, this.binded_elements );

    if( !template ){
      console.warn("Not enought data to initialize:", $el, lotteryName, data_path, template, type );
      return;
    }

    const element = {
      $el,
      lotteryName,
      data_path,
      type: type,
      template: template === true ? Handlebars.compile($el.html()) : Handlebars.compile(template)
    };

    this.binded_elements.push(element);
    if( type === 'countdown' ){
      const countdownName = lotteryName+'|'+data_path;
      var countdown = this.countdowns[countdownName];
      if( !countdown ){
        countdown = this.countdowns[countdownName] = {
          lotteryName,
          data_path,
          elements: [],
          current: {}
        }
      }
      // console.log('COUNT!', this.countdowns );
      countdown.elements.push(element);
      this.startCountdown();
    }
  }

  //
  startCountdown() {
    if( this.countdownIsStarted ) return;
    this.countdownIsStarted = true;
    this.#countdownInterval = setInterval( this.contdownUpdate.bind(this), 1000 );
  }

  //
  contdownUpdate(){

    var needUpdateData = false;

    const _now = Date.now();
    const now = Math.round(_now/1000);
    const secs_in_hour = 60*60;
    const secs_in_day = secs_in_hour*24;
    const lottery_data = this.#lottery_data;

    // console.log('contdownUpdate', now );

    var delta, days, hours, minutes, seconds;

    for( var i in this.countdowns ){

      const countdown = this.countdowns[i];

      // console.log( i, countdown.lastUpdate, (_now - countdown.lastUpdate) );

      if( !countdown.lastUpdate || (_now - countdown.lastUpdate) > 40  ) {
        var value = getNestedByString(lottery_data[countdown.lotteryName], countdown.data_path || 'time');

        // if( value === undefined ) continue;

        if (value) {
          delta = value - now;
          if (delta <= 0) delta = 0;
          days = ~~(delta / secs_in_day);
          delta -= days * secs_in_day;

          hours = ~~(delta / secs_in_hour);
          delta -= hours * secs_in_hour;

          minutes = ~~(delta / 60);
          delta -= minutes * 60;

          seconds = delta;

          if( delta <= 0 ) needUpdateData = true;
          // console.log('contdownUpdate', now, value, days);

        } else {
          value = hours = minutes = seconds = 0;
        }

        // console.log('------', value, delta, hours, minutes, seconds );

        countdown.current.value = value;
        countdown.current.days = days;
        countdown.current.hours = hours;
        countdown.current.minutes = minutes;
        countdown.current.seconds = seconds;
        countdown.lastUpdate = _now;

      }

      // apply values
      countdown.elements.forEach((e)=>{
        $(e.$el).html(e.template(countdown.current));
      });


      this.update();

    }

    // check conditional elements
    for( var i in this.#countdownConditionalElements){
      const countdown = this.countdowns[i];
      const elements = this.#countdownConditionalElements[i];
      elements.forEach((e)=>{
        // console.log('=>', i, countdown );
        let condition = countdown.current && !!countdown.current[e.timerParam];
        if( e.action === 'hide' ) condition = !condition;
        // console.log( i, condition, e.timerParam, e, countdown );
        if( condition ) e.element.show();
        else e.element.hide();
      });

    }

  }


  //
  createVirtualCountDown( id, _finish ) {
    var finish = _finish.split(' ');
    var date = finish[0].split('.');
    finish = date[2]+'/'+date[1]+'/'+date[0]+' '+finish[1];
    var timestamp = new Date(finish);
    if( !timestamp ) {
      console.warn('Wrang date format', _finish)
      return;
    }
    timestamp = ~~(timestamp.getTime()/1000);
    console.log('createVirtualCountDown', id, _finish, finish, timestamp  );
    this.virtualCountdowns[id] = {time:timestamp};
  }


  //
  addConditionalElement( $el, action, id, dataPath, timerParam ) {
    const countdownName = id+'|'+dataPath;
    if( !this.#countdownConditionalElements[countdownName] ) this.#countdownConditionalElements[countdownName] = [];
    this.#countdownConditionalElements[countdownName].push( {
      id,
      action,
      countdownName,
      element: $el,
      timerParam
    });
  }


}


module.exports = new StolotoApi();
