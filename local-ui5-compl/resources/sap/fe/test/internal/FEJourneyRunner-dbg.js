/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(
	["sap/fe/test/JourneyRunner", "sap/fe/test/Utils", "./FEArrangements", "sap/base/Log"],
	function (JourneyRunner, Utils, FEArrangements) {
		"use strict";

		var FERunner = JourneyRunner.extend("sap.fe.test.internal.FEJourneyRunner", {
			constructor: function (mSettings) {
				if (window.QUnit) {
					const fn = window.QUnit.test;
					window.QUnit.test = function (name, options, callback) {
						if (callback === undefined) {
							callback = options;
						}
						return fn(name, callback);
					};
				}

				var defaultSettings = {
					launchUrl: "test-resources/sap/fe/templates/internal/demokit/flpSandbox.html",
					launchParameters: {
						"sap-ui-xx-csp-policy": "sap-target-level-3:ro"
					}
				};

				mSettings = Object.assign(defaultSettings, mSettings);

				try {
					if (window.__karma__.config.ui5.config.usetenants) {
						var sTenantID = window.__karma__.config.ui5.shardIndex;
						if (sTenantID !== undefined && sTenantID !== null) {
							mSettings.launchParameters["sap-client"] = sTenantID;
						}
					}
				} catch (e) {
					delete mSettings.launchParameters["sap-client"];
				}
				JourneyRunner.apply(this, [mSettings]);
			},

			getBaseArrangements: function (mSettings) {
				return new FEArrangements(mSettings);
			}
		});

		var DEFAULT_RUNNER = new FERunner({
			opaConfig: {
				frameWidth: 1300,
				frameHeight: 1000
			}
		});
		var WIDE_RUNNER = new FERunner({
			opaConfig: {
				frameWidth: 1700,
				frameHeight: 1000
			}
		});
		var FCL_RUNNER = new FERunner({
			opaConfig: {
				frameWidth: 1900,
				frameHeight: 1440,
				timeout: 90 // unstable FCL OPA tests in case of deep linking
			}
		});

		FERunner.run = DEFAULT_RUNNER.run.bind(DEFAULT_RUNNER);
		FERunner.runWide = WIDE_RUNNER.run.bind(WIDE_RUNNER);
		FERunner.runFCL = FCL_RUNNER.run.bind(FCL_RUNNER);

		return FERunner;
	}
);
