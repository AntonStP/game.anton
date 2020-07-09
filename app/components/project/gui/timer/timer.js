import {
  registerPlugins,
  Plugin
} from "../../../framework/jquery/plugins/plugins";

class Timer extends Plugin {
  // eslint-disable-next-line no-useless-constructor
  constructor($element) {
    super($element);
  }
}

registerPlugins({
  name: "timer",
  Constructor: Timer,
  selector: ".timer"
});
