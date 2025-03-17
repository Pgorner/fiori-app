/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */
sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/matchers/Matcher"
], function(Opa5, Matcher) {
    "use strict";


    return function waitForP13nDialog(oSettings) {
        oSettings = oSettings || {};

        oSettings.errorMessage = oSettings.errorMessage || "sap.m.Dialog for personalization not found";

        var oMatcher = new Matcher();
        oMatcher.isMatching = function(oControl) {
            return (oControl.hasStyleClass("sapMP13nPopup") || oControl.hasStyleClass("sapUiMdcPersonalizationDialog"));
        };

        return this.waitFor({
            controlType: "sap.m.Dialog",
            matchers: oMatcher,
            success: function(aP13nDialogs) {
                Opa5.assert.ok(aP13nDialogs.length, 'Personalization Dialog found');
                if (oSettings.success) {
                    oSettings.success.call(this, aP13nDialogs[0]);
                }
            },
            errorMessage: oSettings.errorMessage
        });
    };

});