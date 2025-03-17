sap.ui.define([
		"sap/ui/test/Opa5",
		"sap/suite/ui/generic/template/integration/Common/Common",
		"sap/suite/ui/generic/template/integration/SalesOrderTableTabs/pages/PageObjects",
		"sap/ui/test/opaQunit", //Don't move this item up or down, this will break everything!
		"sap/suite/ui/generic/template/integration/testLibrary/ListReport/pages/ListReport",
		"sap/suite/ui/generic/template/integration/testLibrary/ObjectPage/pages/ObjectPage",
		"sap/suite/ui/generic/template/integration/SalesOrderTableTabs/journeys/ListReport/IconTabFilter",
		"sap/suite/ui/generic/template/integration/SalesOrderTableTabs/journeys/ListReport/GhostApp",
		"sap/suite/ui/generic/template/integration/SalesOrderTableTabs/journeys/ListReport/ListReportCreateDialog"
	],
	function (Opa5, Common) {
		"use strict";

		Opa5.extendConfig({
			arrangements: new Common(),
			autoWait: true,
			appParams: {
				"sap-ui-animation": false
			},
			timeout: 30,
			testLibs: {
				fioriElementsTestLibrary: {
					Common: {
						appId: 'ManageSalesOrderWithTableTabs',
						entitySet: 'C_STTA_SalesOrder_WD_20'
					}
				}
			}
		});
		QUnit.start();
	}
);
