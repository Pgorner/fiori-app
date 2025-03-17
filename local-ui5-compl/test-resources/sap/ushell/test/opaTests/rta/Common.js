// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/thirdparty/jquery",
	"sap/ushell/opa/utils/OpaUtils",
	// imports the resources needed for the Opa tests from the openui5 repo
	"test-resources/sap/ui/rta/integration/pages/Adaptation"
], function (
	Opa5,
	jQuery,
	OpaUtils
) {
	"use strict";

	function getFrameUrl (sHash, sUrlParameters) {
		var sUrl = "../../demoapps/RTATestApp/test/flpSandbox.html";
		sHash = sHash || "";
		sUrlParameters = sUrlParameters ? "?" + sUrlParameters : "";

		if (sHash) {
			sHash = "#Worklist-display" + sHash;
		} else {
			sHash = "#Worklist-display";
		}

		if (document.getElementsByTagName("base")[0]) { // new test suite with <base>
			sUrl = OpaUtils.normalizeConfigPath("../demoapps/RTATestApp/test/flpSandbox.html");
		}

		return sUrl + sUrlParameters + sHash;
	}

	return Opa5.extend("sap.ushell.test.opaTests.rta.Common", {
		iStartTheApp: function (oOptions) {
			oOptions = oOptions || {};
			this.iStartMyAppInAFrame({
				source: getFrameUrl(oOptions.hash, oOptions.urlParameters),
				autoWait: true
			});
		},
		iAddTheVariantURLParameter: function () {
			Object.keys(window.sessionStorage).some(function (key) {
				if (key.indexOf("sap.ui.fl.variant.id") > -1) {
					Opa5.getContext().variantId = jQuery.parseJSON(window.sessionStorage[key]).fileName;
					return true;
				}
				return false;
			});
		},
		iShouldSeeTheSectionAfterReload (sId, oRTAPluginBeforeReload) {
			return this.waitFor({
				controlType: "sap.ui.dt.ElementOverlay",
				visible: false,
				matchers (oOverlay) {
					return oOverlay.getElement().getId() === sId;
				},
				success (aOverlays) {
					var oOpa5Window = Opa5.getWindow();
					Opa5.assert.ok(aOverlays[0].getElement().getVisible(), "The section is not shown on the UI");
					Opa5.assert.ok(
						oRTAPluginBeforeReload === oOpa5Window.sap.ushell.plugins.rta,
						"The plugin was not loaded again - soft reload"
					);
				},
				errorMessage: "Did not find the element or it is still visible"
			});
		}
	});
});
