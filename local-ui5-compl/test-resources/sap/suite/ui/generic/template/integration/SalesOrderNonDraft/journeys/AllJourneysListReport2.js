sap.ui.define([
		"sap/ui/test/Opa5",
		"sap/suite/ui/generic/template/integration/Common/Common",
		"sap/suite/ui/generic/template/integration/SalesOrderNonDraft/pages/PageObjects",
		"sap/suite/ui/generic/template/integration/testLibrary/ListReport/pages/ListReport",
		"sap/suite/ui/generic/template/integration/testLibrary/ObjectPage/pages/ObjectPage",
		"sap/suite/ui/generic/template/integration/testLibrary/FCL/pages/FCL",
		"sap/suite/ui/generic/template/integration/SalesOrderNonDraft/journeys/ListReport/ListReportAndCreateObjectPageNavigation",
		"sap/suite/ui/generic/template/integration/SalesOrderNonDraft/journeys/ListReport/ListReportAndObjectPageDataLossNavigation",
		"sap/suite/ui/generic/template/integration/SalesOrderNonDraft/journeys/ListReport/ListReportWithTableTabsAndMultiEdit",
		"sap/suite/ui/generic/template/integration/SalesOrderNonDraft/journeys/ListReport/ListReportWithSegmentedButtonAndMultiEdit",
		"sap/suite/ui/generic/template/integration/SalesOrderNonDraft/journeys/ListReport/ListReportAddCardsToInsights",
		"sap/suite/ui/generic/template/integration/SalesOrderNonDraft/journeys/ListReport/ListReportShareCardsToCM"
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
						appId: 'STTA_SO_ND',
						entitySet: 'STTA_C_SO_SalesOrder_ND'
					}
				}
			}
		});
		QUnit.start();
	}
);
