import '../components/project/project';
import {mobileLinksManager} from "../components/project/utils/mobileLinksManager";
import {fixLinks, getBaseUrlParams} from "../components/project/utils/url";

import $ from 'jquery';

global.jQuery = global.$ = $;

$.when(isDocumentReady())
  .done(onDocumentReady);

function onDocumentReady() {
  if ($.fn.initPlugins) {
    $(document.body).initPlugins();

    // URL AND LINKS
    setTimeout(()=>{
      mobileLinksManager();
      getBaseUrlParams();
      fixLinks( "m.stoloto.ru" );
      fixLinks( "stoloto.ru", true );
    }, 600 );
  }
  $(document.documentElement).trigger("document:ready");
}


function isDocumentReady() {
  let def = $.Deferred();

  $(document).ready(()=>def.resolve());

  return def.promise();
}
