sap.ui.define(function() {
	"use strict";

	return {
		name: "APF TestSuite",
		defaults: {
			skip: true, // tests are not suitable for automated test execution
			loader: {
				paths: {
					"sap/apf/internal/server": "test-resources/sap/apf/internal/server/",
					"sap/apf/testhelper": "test-resources/sap/apf/testhelper/",
					"sap/apf/withServer": "test-resources/sap/apf/withServer/"
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
			module: "test-resources/sap/apf/withServer/{name}",
			page: "test-resources/sap/apf/withServer/{name}.qunit.html"
		},
		tests: {
			tAnalyticalConfiguration: {},
			tAnalyticalConfigurationWithLRep: {},
			tDeletePath: {},
			tInsertPath: {},
			tMetadata: {},
			tMetadataFactory: {},
			tReadCdsView: {
				module: "test-resources/sap/apf/withServer/{name}.qunit",
			},
			tReadPath: {},
			tUpdatePath: {},
			"gateway/tNavHandler": {},
		}
	};
});
