sap.ui.define(function() {
	"use strict";

	return {
		name: "Global APF QUnit TestSuite",
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
			bootCore: true,
			module: "test-resources/sap/apf/cloudFoundry/ui/{name}.qunit",
			page: "test-resources/sap/apf/cloudFoundry/ui/{name}.qunit.html"
		},
		tests: {
			"bookmarkconfirmation/tShowBookmarkConfirmation": {
				title: "Cloud Foundry UI - Share Dialog"
			},
			"sharedialog/tShareDialog": {
				title: "Cloud Foundry UI - Share Dialog",
				module: [
					"test-resources/sap/apf/cloudFoundry/ui/sharedialog/tShareDialogController.qunit",
					"test-resources/sap/apf/cloudFoundry/ui/sharedialog/tShowShareDialog.qunit"
				]
			},
			"utils/tComponentCorrector": {
				title: "Cloud Foundry UI - Component Corrector",
				loader: {
					paths: {
						"test": "test-resources/"
					}
				}
			},
			"utils/tLaunchPageUtils": {
				title: "Cloud Foundry UI - Launch Page Utils"
			},
			"utils/tODataServiceUtils": {
				title: "Cloud Foundry UI - OData Service Utils"
			},
			"valuehelp/tValueHelp": {
				title: "Cloud Foundry UI - Value Help",
				module: [
					"test-resources/sap/apf/cloudFoundry/ui/valuehelp/tCatalogBrowserController.qunit",
					"test-resources/sap/apf/cloudFoundry/ui/valuehelp/tShowValueHelp.qunit"
				]
			}
		}
	};
});
