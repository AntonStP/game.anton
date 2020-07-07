/* eslint-disable */
import $ from "jquery";
import { registerPlugins } from "../../framework/jquery/plugins/plugins.js";
import "./p-example__accordion/p-example__accordion";
import "./p-example__carousel/p-example__carousel";
import "./p-example__form/p-example__form";

class PExample {
  constructor($element) {
    $element.on("click", ".p-example__btn_modal", function() {
      $("#custom-modal").modal();
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
  name: "pExample",
  Constructor: PExample,
  selector: ".p-example"
});
