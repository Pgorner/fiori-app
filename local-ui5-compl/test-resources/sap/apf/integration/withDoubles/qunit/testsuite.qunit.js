sap.ui.define(function() {
	"use strict";

	return {
		name: "APF TestSuite",
		defaults: {
			loader: {
				paths: {
					"sap/apf/integration": "test-resources/sap/apf/integration/",
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
			module: "test-resources/sap/apf/integration/withDoubles/{name}.qunit",
			page: "test-resources/sap/apf/integration/withDoubles/{name}.qunit.html"
		},
		tests: {
			tApi: {
				title: "APF Api"
			},
			tComponent: {
				title: "Component with double for token access of session handler"
			},
			tComponentStartupSequence: {
				title: "Component startup sequence"
			},
			tComponentWithStep: {
				title: "Add Initial Analysis Step on Start Up",
				ui5: {
					libs: "sap.m,sap.viz"
				}
			},
			tInstance: {
				title: "Multi Instance for APF UI"
			},
			tPathFilterHandling: {
				title: "Path filter handling with doubles for request, metadata and session handler",
				ui5: {
					libs: "sap.m,sap.ui.comp,sap.viz,sap.ui.layout"
				}
			},
			tPathFilterStartFilter: {
				title: "Path Filter with isolated request, metadata and representation",
				ui5: {
					libs: "sap.m,sap.viz"
				}
			},
			tSerializationMediator: {
				title: "SerializationMediator with session handler and persistence double"
			},
			tSmartFilterBar: {
				title: "SmartFilterBar Integration"
			},
			tStepGallery: {
				// disabled as it has errors
				skip: true,
				title: "Step Gallery Integration Test"
			},
			tStepToolbarAndContainer: {
				// disabled as it has errors
				skip: true,
				title: "Step Toolbar Integration Test"
			},
			tWrongUsageOfApf: {
				title: "Wrong Usage of APF results in Errors"
			},

			"platforms/tCloudFoundryRuntimeComponent": {
				title: "Cloud Foundry Runtime Test for the Component",
				ui5: {
					libs: "sap.m,sap.ui.layout"
				}
			},
			"platforms/tLrepComponent": {
				title: "Runtime Test for the Component - lrep switch",
				ui5: {
					libs: "sap.m,sap.ui.layout"
				}
			},
			"platforms/tODataRuntimeComponent": {
				title: "Runtime Test for the Component - OData Proxy for reading analytical configuration is used",
				ui5: {
					libs: "sap.m,sap.ui.layout"
				}
			}
		}
	};
});
