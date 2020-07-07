/* eslint-disable */
(function(factory) {
  if (typeof exports === "object") {
    module.exports = factory(
      require("jquery"),
      require("../../../framework/jquery/plugins/plugins.js")
    );
  } else {
    factory(jQuery, peppers.plugins);
  }
})(function($, plugins) {
  plugins.registerPlugins({
    name: "pExampleIndex",
    Constructor: PExampleIndex,
    selector: ".p-example__index"
  });

  function PExampleIndex($element) {
    this.init = function(action) {
      switch (action) {
        case "destroy":
        case "dispose":
          destroy();

        default:
          break;
      }
    };

    function destroy() {}
  }
});
