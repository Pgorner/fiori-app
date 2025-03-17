sap.ui.define(["sap/ui/test/Opa5", "sap/suite/ui/generic/template/integration/Common/Common",
	"sap/suite/ui/generic/template/integration/ManageProductsTreeTable/pages/PageObjects",
	"sap/suite/ui/generic/template/integration/testLibrary/ListReport/pages/ListReport",
	"sap/suite/ui/generic/template/integration/testLibrary/ObjectPage/pages/ObjectPage",
	"sap/suite/ui/generic/template/integration/ManageProductsTreeTable/journeys/ListReport/ListReportAndObjectPageNavigation",
	"sap/suite/ui/generic/template/integration/ManageProductsTreeTable/journeys/ObjectPage/ObjectPage",
	"sap/suite/ui/generic/template/integration/ManageProductsTreeTable/journeys/ListReport/ListReportSapKeepAlive",
	"sap/suite/ui/generic/template/integration/ManageProductsTreeTable/journeys/ListReport/ListReportResponsiveTable"
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
						appId: 'STTAMPTT',
						entitySet: 'STTA_C_MP_Product'
					}
				}
			}
		});
		QUnit.start();
	}
);
