"use strict";

sap.ui.define(["sap/feedback/ui/flpplugin/controller/ControllerFactory", "sap/feedback/ui/flpplugin/controller/InitController", "sap/feedback/ui/flpplugin/controller/PluginController"], function (ControllerFactory, InitController, PluginController) {
  "use strict";

  var __exports = function __exports() {
    QUnit.module('ControllerFactory unit tests', {});
    QUnit.test('createPluginController - shall return the instance of the PluginController', function (assert) {
      var pluginController = ControllerFactory.createPluginController({}, {});
      assert.ok(pluginController instanceof PluginController);
    });
    QUnit.test('createInitController - shall return the instance of the InitController', function (assert) {
      var initController = ControllerFactory.createInitController({});
      assert.ok(initController instanceof InitController);
    });
  };
  return __exports;
});
//# sourceMappingURL=ControllerFactory.test.js.map