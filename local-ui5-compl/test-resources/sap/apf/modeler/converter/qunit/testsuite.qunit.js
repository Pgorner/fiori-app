sap.ui.define(function() {
	"use strict";

	return {
		name: "apf.modeler converter TestSuite",
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
			bootCore: true,
			module: "test-resources/sap/apf/modeler/converter/{name}",
			page: "test-resources/sap/apf/modeler/converter/{name}.html"
		},
		tests: {
			"tConvertAnalyticalConfiguration": {}
		}
	};
});
