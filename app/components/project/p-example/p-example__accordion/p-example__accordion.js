/* eslint-disable */
(function(factory) {
  if (typeof exports === "object") {
    module.exports = factory(
      require("jquery"),
      require("../../../framework/jquery/plugins/plugins.js"),
      require("../../../framework/template-engine/template-engine"),
      require("../../gui/accordion/accordion")
    );
  } else {
    factory(jQuery, peppers.plugins);
  }
})(function($, plugins) {
  plugins.registerPlugins({
    name: "pExampleAccordion",
    Constructor: PExampleAccordion,
    selector: ".p-example__accordion"
  });

  function PExampleAccordion($element) {
    this.init = function(params) {
      if (["destroy", "dispose"].indexOf(params) >= 0) {
        destroy();
      }
    };

    $element.find(".p-example__accordion-template").templateEngine({
      items: [
        {
          title: "Заголовок 1",
          body:
            "<p>Аккордеон сгененированный с помощью свойства <i>accordion</i></p>",
          accordion: {
            items: [
              { title: "Заголовок 1.1", body: "Тело 1.1" },
              { title: "Заголовок 1.2", body: "Тело 1.2" },
              { title: "Заголовок 1.3", body: "Тело 1.3" }
            ],
            params: {
              type: "radio",
              name: "handlebars_acc2"
            }
          }
        },
        { title: "Заголовок 2", body: "Тело 2" },
        { title: "Заголовок 3", body: "Тело 3" }
      ],
      params: {
        type: "radio",
        name: "handlebars_acc"
      }
    });

    function destroy() {}
  }
});
