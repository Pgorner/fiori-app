// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview
 * This module tries to transfer several parameters to the Help Plugin aka. SAP Companion.
 * These parameters can be used as conditions for hotspots and dialogs, e.g. to control their
 * visibility based on the "environment" (e.g. "Spaces Mode active?" or "Productive System?").
 */
sap.ui.define([
	"sap/base/Log",
    "sap/base/util/Deferred"
], function (
    Log,
    Deferred
	) {
		"use strict";

        var Setter = {};
        Setter._timeoutCounter = 120;
        Setter._ushellConfig = undefined;

        Setter.run = function () {
            var counter = 0;
            var oDeferred = new Deferred();

            // The ushell config is not yet prepared when the module is loaded, therefore set only on "run", not earlier
            if (Setter._ushellConfig === undefined) {
                Setter._ushellConfig = window["sap-ushell-config"];
            }

            var fnTryToSetConditions = function () {
                if (window.Help4 !== undefined) {
                    const oSpacesConfig = Setter._ushellConfig.ushell.spaces;
                    var oConditions = {};

                    // Classic Homepage is active for the current user
                    oConditions.FLPClassicHPActiveCurrentUser = !oSpacesConfig.enabled;
                    // Classic Homepage is possibly active for any user (either because it is enforced for every user or because it can be configured by the users themselves)
                    oConditions.FLPClassicHPPossActiveAllUsers = (oSpacesConfig.configurable === false && oSpacesConfig.enabled === false) || oSpacesConfig.configurable === true;
                    // Role of the used system client. Possible values: p = Production, t = Test, c = Customizing, d = Demonstration, e = Education, s = SAP reference
                    oConditions.FLPClientRole = Setter._ushellConfig.startupConfig.clientRole;

                    window.Help4.API.setConditions(oConditions);
                    Log.info("Conditions transferred to SAP Compagnion / SAP Help: " + JSON.stringify(oConditions));
                    return true;
                }
                return false;
            };

            var fnKeepTrying = function () {
                if (counter < Setter._timeoutCounter) {
                    counter++;
                    if (!fnTryToSetConditions()) {
                        setTimeout(fnKeepTrying, 1000);
                    } else {
                        oDeferred.resolve();
                        return;
                    }
                } else {
                    oDeferred.reject();
                }
            };
            fnKeepTrying();
            return oDeferred.promise;
        };
        return Setter;
});
