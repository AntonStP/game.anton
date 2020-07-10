import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";

class Statistic extends Plugin {
  // eslint-disable-next-line no-useless-constructor
  constructor($element) {
    super($element);
  }
}

registerPlugins({
  name: "statistic",
  Constructor: Statistic,
  selector: ".statistic"
});
