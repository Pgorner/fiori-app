sap.ui.define([
		"sap/ui/test/Opa5",
		"sap/suite/ui/generic/template/integration/Common/Common",
		"sap/ui/test/opaQunit", //Don't move this item up or down, this will break everything!
		"sap/suite/ui/generic/template/integration/testLibrary/FCL/pages/FCL",
		"sap/suite/ui/generic/template/integration/SalesOrderSegButtons/pages/PageObjects",
		"sap/suite/ui/generic/template/integration/testLibrary/ListReport/pages/ListReport",
		"sap/suite/ui/generic/template/integration/testLibrary/ObjectPage/pages/ObjectPage",
		"sap/suite/ui/generic/template/integration/SalesOrderSegButtons/journeys/ListReport/FlexibleColumnLayoutNavigation",
		"sap/suite/ui/generic/template/integration/SalesOrderSegButtons/journeys/ListReport/ListReportFallBackNavigation",
		"sap/suite/ui/generic/template/integration/SalesOrderSegButtons/journeys/ListReport/ListReportFallBackNavigationWith_sap_keep_alive"
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
						appId: 'ManageSalesOrderWithSegButtons',
						entitySet: 'C_STTA_SalesOrder_WD_20'
					}
				}
			}
		});
		QUnit.start();
	}
);
