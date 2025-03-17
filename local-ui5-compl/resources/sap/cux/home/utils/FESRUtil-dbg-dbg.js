/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/ui/performance/trace/FESRHelper"], function (FESRHelper) {
  "use strict";

  var FESR_EVENTS = /*#__PURE__*/function (FESR_EVENTS) {
    FESR_EVENTS["PRESS"] = "press";
    FESR_EVENTS["CHANGE"] = "change";
    FESR_EVENTS["SELECT"] = "select";
    return FESR_EVENTS;
  }(FESR_EVENTS || {});
  const addFESRId = (control, fesrId) => {
    control.data("fesr-id", fesrId);
    return control;
  };
  const getFESRId = control => {
    return control.data("fesr-id");
  };
  const addFESRSemanticStepName = (element, eventName, stepName) => {
    if (stepName) {
      FESRHelper.setSemanticStepname(element, eventName, stepName);
    }
  };
  var __exports = {
    __esModule: true
  };
  __exports.FESR_EVENTS = FESR_EVENTS;
  __exports.addFESRId = addFESRId;
  __exports.getFESRId = getFESRId;
  __exports.addFESRSemanticStepName = addFESRSemanticStepName;
  return __exports;
});
//# sourceMappingURL=FESRUtil-dbg-dbg.js.map
