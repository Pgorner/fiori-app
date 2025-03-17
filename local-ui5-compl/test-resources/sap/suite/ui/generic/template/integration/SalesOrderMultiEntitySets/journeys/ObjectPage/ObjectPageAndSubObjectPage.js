sap.ui.define([
	"sap/ui/test/opaQunit"
],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order Multi EntitySets- Sub-Object Page");

		opaTest("Start the SOP and check edit button is not present due to update restrictions", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordermultientity#/C_STTA_SalesOrderItem_WD_20(SalesOrder='500000002',SalesOrderItem='10',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("10");
			Then.onTheObjectPage
				.iCheckTheControlWithIdIsVisible("sap.uxap.ObjectPageHeaderActionButton", "SOMULTIENTITY::sap.suite.ui.generic.template.ObjectPage.view.Details::C_STTA_SalesOrderItem_WD_20--edit", false);
			Then.iTeardownMyApp();
		});
	}
);

