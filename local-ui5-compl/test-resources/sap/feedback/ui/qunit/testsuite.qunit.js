"use strict";

sap.ui.define([], function () {
  "use strict";

  var __exports = {
    name: 'QUnit TestSuite for sap.feedback.ui',
    defaults: {
      bootCore: true,
      ui5: {
        libs: 'sap.ui.core,sap.ushell,sap.m,sap.feedback.ui',
        theme: 'sap_horizon',
        noConflict: true,
        preload: 'auto'
      },
      qunit: {
        version: 2,
        reorder: false
      },
      sinon: {
        version: 4,
        qunitBridge: true,
        useFakeTimers: false
      }
    },
    tests: {
      AllTests: {
        title: 'QUnit Test for sap.feedback.ui',
        _alternativeTitle: 'QUnit tests: sap.feedback.ui'
      }
    }
  };
  return __exports;
});
//# sourceMappingURL=testsuite.qunit.js.map