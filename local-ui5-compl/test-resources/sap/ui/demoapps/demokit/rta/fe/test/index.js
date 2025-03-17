(function () {
	"use strict";

	window["sap-ushell-config"] = {
		defaultRenderer : "fiori2",
		bootstrapPlugins: {
			"RuntimeAuthoringPlugin" : {
				component: "sap.ushell.plugins.rta",
				config: {
					validateAppVersion: false
				}
			}
		},
		renderers: {
			fiori2: {
				componentData: {
					config: {
						enableMergeAppAndShellHeaders: true,
						search: "hidden"
					}
				}
			}
		},
		applications: {
			"masterDetail-display": {
				"additionalInformation": "SAPUI5.Component=sap.ui.demoapps.rta.fe",
				"applicationType": "URL",
				"url": "../",
				"description": "UI Adaptation at Runtime for SAP Fiori Elements",
				"title": "Products Manage",
				"applicationDependencies": {
					"self": { name: "sap.ui.demoapps.rta.fe" },
					"manifest": true,
					"asyncHints": {
						"libs": [
							{ "name": "sap.ui.core" },
							{ "name": "sap.m" },
							{ "name": "sap.ui.comp" },
							{ "name": "sap.uxap" },
							{ "name": "sap.suite.ui.generic.template" },
							{ "name": "sap.ui.generic.app" },
							{ "name": "sap.ui.layout" },
							{ "name": "sap.ui.suite" },
							{ "name": "sap.ui.rta" }
						]
					}
				}
			}
		}
	};

	window.onInit = function() {
		sap.ui.require(["sap/ushell/Container"], async (oContainer) => {
			const oContent = await oContainer.createRendererInternal(null);
			oContent.placeAt("content");
		});
	};

	var __aPrefixMatches = document.location.pathname.match(/(.*)\/test-resources\//);
	var __sPathPrefix = __aPrefixMatches &&  __aPrefixMatches[1] || "";

	document.write('<script src="' + __sPathPrefix + '/resources/sap/ushell/bootstrap/sandbox2.js" id="sap-ushell-bootstrap"><' + '/script>');
	document.write('<script src="' + __sPathPrefix + '/resources/sap-ui-core.js"' +
			' id="sap-ui-bootstrap"' +
			' data-sap-ui-theme="sap_horizon"' +
			' data-sap-ui-language="en"' +
			' data-sap-ui-libs="sap.m,sap.ushell,sap.ui.rta,sap.ui.fl"' +
			' data-sap-ui-compatVersion="edge"' +
			' data-sap-ui-frameOptions="allow"' +
			' data-sap-ui-preload="async"' +
			' data-sap-ui-flexibilityServices=\'[{"connector": "LocalStorageConnector"}]\'' +
			' data-sap-ui-resourceroots=\'{"sap.ui.demoapps.rta.fe": "../", "sap.ui.demoapps.rta.fe.lib.reuse": "../lib/reuse"}\'' +
			' data-sap-ui-onInit="onInit"' + '<' + '/script>');
	document.write('<script src="' + __sPathPrefix + '/test-resources/sap/ushell/bootstrap/standalone.js"><' + '/script>');
})();