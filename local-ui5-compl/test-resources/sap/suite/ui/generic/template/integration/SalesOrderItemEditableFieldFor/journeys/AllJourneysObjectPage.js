sap.ui.define(["sap/ui/test/Opa5",
	"sap/suite/ui/generic/template/integration/Common/Common",
	"sap/suite/ui/generic/template/integration/SalesOrderItemEditableFieldFor/pages/PageObjects",
	"sap/suite/ui/generic/template/integration/testLibrary/ListReport/pages/ListReport",
	"sap/suite/ui/generic/template/integration/testLibrary/ObjectPage/pages/ObjectPage",
	"sap/suite/ui/generic/template/integration/SalesOrderItemEditableFieldFor/journeys/ObjectPage/ExternalNavigationInbound"],
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
						appId: 'SalesOrderItemEditableFieldFor',
						entitySet: 'C_STTA_SalesOrderItem_WD_20'
					}
				}
			}
		});

		QUnit.start();
	});
