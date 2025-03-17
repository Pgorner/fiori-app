sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/suite/ui/generic/template/integration/Common/Common",
	"sap/ui/test/opaQunit", //Don't move this item up or down, this will break everything!
	"sap/suite/ui/generic/template/integration/demoFilterSettings/pages/PageObjects",
	"sap/suite/ui/generic/template/integration/testLibrary/ListReport/pages/ListReport",
	"sap/suite/ui/generic/template/integration/testLibrary/ObjectPage/pages/ObjectPage",
	"sap/suite/ui/generic/template/integration/demoFilterSettings/journeys/ListReport/ListReport",
],
	function (Opa5, Common) {
		"use strict";

		Opa5.extendConfig({
			arrangements: new Common(),
			autoWait: true,
			timeout: 30,
			appParams: {
				"sap-ui-animation": false
			},
			testLibs: {
				fioriElementsTestLibrary: {
					Common: {
						appId: 'demoFilterSettings',
						entitySet: 'RootEntity'
					}
				}
			}
		});

		QUnit.start();
	}
);
