sap.ui.define(function() {
	"use strict";

	return {
		name: "apf.modeler TestSuite",
		defaults: {
			loader: {
				paths: {
					"sap/apf/integration": "test-resources/sap/apf/integration/",
					"sap/apf/internal/server": "test-resources/sap/apf/internal/server/",
					"sap/apf/testhelper": "test-resources/sap/apf/testhelper/"
				}
			},
			qunit: {
				version: 2
			},
			sinon: {
				version: 1,
				qunitBridge: true,
				useFakeTimer: false
			},
			bootCore: true,
			module: "test-resources/sap/apf/modeler/integration/{name}.qunit",
			page: "test-resources/sap/apf/modeler/integration/{name}.qunit.html"
		},
		tests: {
			"tApplicationHandler": {
				title: "Application Handler"
			},
			"tConfigurationModeler": {
				title: "Clean up text elements"
			},
			"tCleanUpTextPool": {
				title: "Configuration Modeler"
			}
		}
	};
});
