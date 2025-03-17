"use strict";

sap.ui.define(["sap/feedback/ui/thirdparty/sap-px/pxapi", "sap/feedback/ui/flpplugin/pxapi/PxApiFactory"], function (___sap_px_pxapi, PxApiFactory) {
  "use strict";

  var PxApi = ___sap_px_pxapi["PxApi"];
  var __exports = function __exports() {
    QUnit.module('PxApiFactory unit tests');
    QUnit.test('createPxApi - shall create the instance of PxApi', function (assert) {
      var pxApi = PxApiFactory.createPxApi();
      assert.ok(pxApi instanceof PxApi);
    });
  };
  return __exports;
});
//# sourceMappingURL=PxApiFactory.test.js.map