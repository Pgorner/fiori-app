/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define([
  "sap/ui/fl/changeHandler/Base",
  "sap/ui/fl/changeHandler/condenser/Classification"
], function (BaseChangeHandler, Classification) {
  "use strict";
  return {
    "ModelChange": {
      "applyChange": function (oChange, oControl) {
        return oControl.applyModelChange(oChange);
      },
      "revertChange": function (oChange, oControl) {
        return oControl.revertModelChange(oChange);
      },
      "completeChangeContent": function () {
      },
      "getCondenserInfo": function (oChange) {
        return {
          affectedControl: oChange.getSelector(),
          classification: Classification.Update,
          uniqueKey: "ModelChange",
          updateContent: oChange.getContent()
        };
      }
    }
  };
});
