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
    name: "pExamplePage",
    Constructor: PExamplePage,
    selector: ".p-example__page"
  });

  function PExamplePage($element) {
    this.init = function(params) {
      if (["destroy", "dispose"].indexOf(params) >= 0) {
        destroy();
      }
    };

    function destroy() {}
  }
});
