sap.ui.define(["sap/ui/test/Opa5",
                "sap/suite/ui/generic/template/integration/Common/Common",
                "sap/suite/ui/generic/template/integration/SalesOrderItemAggregation/pages/PageObjects",
                "sap/ui/test/opaQunit", //Don't move this item up or down, this will break everything!
                "sap/suite/ui/generic/template/integration/testLibrary/ListReport/pages/ListReport",
                "sap/suite/ui/generic/template/integration/testLibrary/ObjectPage/pages/ObjectPage",
                "sap/suite/ui/generic/template/integration/SalesOrderItemAggregation/journeys/ListReport/ItemAggregation",
				"sap/suite/ui/generic/template/integration/SalesOrderItemAggregation/journeys/ListReport/MultiSelectForAnalyticalTable",
				"sap/suite/ui/generic/template/integration/SalesOrderItemAggregation/journeys/ListReport/MultiSelectForGridTable"
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
						appId: 'SOITMAGGR',
						entitySet: 'STTA_C_SO_ItemAggr'
					}
				}
			}
		});
		QUnit.start();
	}
);
