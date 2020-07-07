/* eslint-disable */
import {registerPlugins, Plugin} from '../../../framework/jquery/plugins/plugins.js';
import isMobile from 'ismobilejs';

class DelayedAttr extends Plugin {
  constructor($element) {
    super($element);

    // ----------------------------------------
    // DELAYED SETUP OF ATTRIBUTES
    // IMG example: <img data-delayed-attr="src|/images/image.jpg" data-delayed-attr-delay="1000" >
    // PICTURE example: <picture data-delayed-attr="src|image/1px.png;;images/image1.webp;(min-width: 320px);images/image1.png;(min-width: 1024px)" data-delayed-attr-delay="2000" style="visibility:hidden">

    const d = $element.data('delayed-attr');
    const t = d.indexOf('|');
    const attr = d.substr(0,t);
    const val = d.substr(t+1,d.length);
    let delay = ($element.data('delayed-attr-delay')+'' || '0').split('|');
    delay = parseInt( !isMobile.any ? delay[0] : delay[1] || delay[0] );
    const tagName = $element.prop("tagName").toLowerCase();
    var innerHTML = '';
    // console.log('data-delayed-attr', $element, tagName, attr, val, delay, isMobile.any );

    var prevOpacity = null;

    if( ['img'].indexOf(tagName) !== -1 ? true : false ){

      prevOpacity = $element.css('opacity');
      $element.css('opacity',0);

    }else if( ['picture'].indexOf(tagName) !== -1 ? true : false ){

      prevOpacity = $element.css('opacity');
      $element.css('opacity',0);

      const images = val.split(";");
      let tt, format;

      // console.log("picture", images );
      for( var i=0; i<images.length; i+=2){
        const e = images[i];
        const mediaq = images[i+1];
        let _innerHTML = '';
        // console.log("picture => ", i,e, mediaq );
        if(i==0){
          _innerHTML = `<img src="${e}"`;
        }else{
          tt = e.split(',');
          if(tt.length>1){
            tt = tt[0].split('.');
          }else{
            tt = e.split('.');
          }
          format = (tt[tt.length-1].split(' ')[0] || '').trim();
          if(format==='svg') format += '+xml';
          _innerHTML = `<source srcset="${e}" type="image/${format}"`;
        }
        innerHTML = _innerHTML+` ${mediaq ? 'media="'+mediaq+'" ' : ''}>`+ innerHTML;
      };
      // console.log('=>', srcs );

    }

    // $element.on('load',()=>{
    // console.log('loaded');
    // });
    // return;
    const fadeInElement = ()=>{
      // console.log('loadComplete', innerHTML );
      $element
        .css('visibility','')
        .animate({
          opacity: prevOpacity
        }, 400, ()=>{
          $element.css('opacity','')
        })
      ;
      if( innerHTML ) {
        $element.children().each((i,e)=>{
          const $e = $(e)
            .css('visibility', '')
            .css('opacity', 0)
            .animate({
              opacity: prevOpacity
            }, 400, (e,b) => {
              $e.css('opacity', '')
            })
          ;
        });

      }

    };

    setTimeout(function(){

      if( !innerHTML && prevOpacity !== null ){
        // console.log('waitForLoad');
        $element.on('load', fadeInElement );
      }
      if( innerHTML ){
        // console.log('innerHTML', innerHTML );
        $element.append(innerHTML);
        $element.children().each((i,e)=>{
          $(e).on('load', fadeInElement );
        });
        // $element.on('load', fadeInElement );
      }else $element.attr(attr, val);
      // console.log('data-delayed-attr', i, e, d, attr, val );
      // e = $(e);
      // e.attr('src', e.data('delayed-image') );
    }, delay );

    // ----------------------------------------

  }
}

registerPlugins(
  {
    "name": "delayedAttr",
    "Constructor": DelayedAttr,
    "selector": "[data-delayed-attr]"
  }
);
