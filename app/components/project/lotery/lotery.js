import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";

class Lotery extends Plugin {
  // eslint-disable-next-line no-useless-constructor
  constructor($element) {
    super($element);
  }
}

registerPlugins({
  name: "lotery",
  Constructor: Lotery,
  selector: ".lotery"
});
