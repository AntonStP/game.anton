/* eslint-disable */
(function(factory) {
  if (typeof exports === "object") {
    module.exports = factory(
      require("jquery"),
      require("../../../framework/jquery/plugins/plugins"),
      require("../../gui/carousel/carousel")
    );
  } else {
    factory(jQuery, peppers.plugins);
  }
})(function($, plugins) {
  plugins.registerPlugins({
    name: "pExampleCarousel",
    Constructor: PExampleCarousel,
    selector: ".p-example__carousel"
  });

  function PExampleCarousel($element) {
    this.init = function(params) {
      if (["destroy", "dispose"].indexOf(params) >= 0) {
        destroy();
      }
    };

    function destroy() {}
  }
});
