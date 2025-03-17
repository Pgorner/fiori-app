sap.ui.define(["sap/ui/test/opaQunit", "sap/f/FlexibleColumnLayout"],
	function (opaTest) {
		"use strict";

		QUnit.module("Flexible Column Layout: LR is not part of the FCL");

		opaTest("Starting the app,loading data and checking description & icon ", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("SalesOrder-SegButtons#SalesOrder-SegButtons",
				"manifestFCLObjectPageOnly");
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iNavigateFromListItemByFieldValue({ Field: "SalesOrder", Value: "500000012" });
			When.onTheObjectPage
				.iClickTheControlWithId("shellAppTitle");
			Then.onTheObjectPage
				.iCheckShellNavigationMenuItemDescriptionIcon("ManageSalesOrderWithSegButtons description", "sap-icon://simple-payment");  
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000012")
				.and
				.iShouldSeeTheSections(["Sales Order Items","ProductTableReuse"]);
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("OneColumn");
		});

		opaTest("Navigate to items Sub-ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByFieldValue("to_Item", {Field:"SalesOrderItem", Value:"20"});

			Then.onTheGenericObjectPage
				.iShouldSeeTheSections(["Schedule Lines"]);
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsMidExpanded");				
		});

		opaTest("Navigate to schedule lines Sub-Sub-ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByFieldValue("to_SalesOrderItemSL", {Field:"QuantityUnitCode", Value:"EA"}, "C_STTA_SalesOrderItem_WD_20");
			Then.onTheGenericObjectPage
				.iShouldSeeTheSections(["Schedule Lines"]);
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("ThreeColumnsEndExpanded");
			Then.iTeardownMyApp();
		});
	}
);
