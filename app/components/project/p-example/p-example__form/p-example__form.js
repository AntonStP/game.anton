/* eslint-disable */
import { registerPlugins } from "../../../framework/jquery/plugins/plugins.js";

class PExampleForm {
  constructor($element) {
    $element.find(".p-example__form-form").on("form:submit", function(event) {
      // event.preventDefault();
      // console.log(event.form.params);
      //
      // setTimeout(function(){
      //  event.form.deferred.resolve();
      // }, 1000);
    });
  }

  init(action, ...args) {
    if (action && typeof this[action] === "function") {
      return this[action].apply(this, args);
    }
  }

  destroy() {}
}
registerPlugins({
  name: "pExampleForm",
  Constructor: PExampleForm,
  selector: ".p-example__form"
});
