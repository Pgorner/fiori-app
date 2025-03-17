sap.ui.define(function() {
	"use strict";

	return {
		name: "APF TestSuite",
		defaults: {
			skip: true, // tests are not suitable for automated test execution
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
			ui5: {
				noConflict: true
			},
			bootCore: true,
			module: "test-resources/sap/apf/integration/withServer/{name}",
			page: "test-resources/sap/apf/integration/withServer/{name}.qunit.html"
		},
		tests: {
			tMetadata: {},
			tMetadataFacade: {},
			tPathFilterHandling: {},
			tPathPersistenceOData: {},
			tReadRequest: {},
			tReadRequestByRequiredFilter: {},
			tRequest: {},
			tSessionHandler: {},
			tViewParameterProvisioning: {},
		}
	};
});
