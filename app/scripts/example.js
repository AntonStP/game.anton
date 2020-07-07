import $ from 'jquery';
import "../components/framework/modal/modal";
import "../components/framework/subpage/subpage";
import "../components/framework/template-engine/template-engine";
import "../components/project/p-example/p-example";

import '../components/project/gui/form/form';

import '../components/project/gui/custom-scroll/custom-scroll';


window.jQuery = window.$ = $;

$.when(isDocumentReady())
  .done(onDocumentReady);

function onDocumentReady() {
  $(document.body).initPlugins();
  $(document.documentElement).trigger("document:ready");
}

function isDocumentReady() {
  let def = $.Deferred();

  $(document).ready(init);

  return def.promise();

  function init() {
    def.resolve();
  }
}
