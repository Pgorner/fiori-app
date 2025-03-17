sap.ui.define(function() {
	"use strict";

	return {
		name: "APF TestSuite",
		defaults: {
			loader: {
				paths: {
					"test": "test-resources/"
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
			module: "test-resources/sap/apf/integration/cloudFoundry/{name}.opa",
			page: "test-resources/sap/apf/integration/cloudFoundry/{name}.opa.html"
		},
		tests: {
			"tShareDialog": {
				title: "Cloud Foundry UI - OPA 5 - Share Dialog"
			},
			"tValueHelp": {
				title: "Cloud Foundry UI - OPA 5 - Value Help"
			}
		}
	};
});
