sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Flexible Column Layout Mid Column FullScreen Navigation");

		opaTest("Starting the app and checking the initial no data text for the table with segmented button", function (Given, When, Then) {
			// arrangements
			Given.iStartMyAppInDemokit("sttasalesordersb", "manifestMidColumnFullScreen");
			Then.onTheListReportPage
				.iCheckControlPropertiesById("responsiveTable", { "visible": true, "noDataText": "To start, set the relevant filters and choose \"Go\"." });
		});

		opaTest("Apply some filter and check the no-data text for the table with segmented button", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSetTheFilter({ Field: "SalesOrder", Value: "500000050" })
				.and
				.iExecuteTheSearch();
			Then.onTheListReportPage
				.iCheckControlPropertiesById("responsiveTable", { "visible": true, "noDataText": "There is no data for the selected filter criteria and table view." });
			When.onTheGenericListReport
				.iClickOnSegmentedButton("_tab2");
			Then.onTheListReportPage
				.iCheckControlPropertiesById("responsiveTable", { "visible": true, "noDataText": "There is no data for the selected filter criteria and table view." });
		});

		opaTest("Navigate to OP and check the OP is in full screen", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSetTheFilter({ Field: "SalesOrder", Value: "" })
				.and
				.iExecuteTheSearch()
				.and
				.iClickOnSegmentedButton("_tab1");
			Then.onTheGenericListReport
				.iShouldSeeTheExcelButton();
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000012"});
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000012")
				.and
				.iShouldSeeTheSections(["Sales Order Items", "ProductTableReuse"]);
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("MidColumnFullScreen")
				.and
				.iCheckFCLHeaderActionButtonsVisibility({"exitFullScreen": true});
		});

		opaTest("Check for confirmation popup prompting user to keep/discard draft on closing the OP in fullscreen", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("closeColumn");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Warning")
				.and
				.iShouldSeeTheDialogWithContent("You've made changes to this object.\nWhat would you like to do?");
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel")
				.and
				.iClickTheButtonWithIcon("sap-icon://nav-back");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("You've made changes to this object.\nWhat would you like to do?");
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel");			
		});

		opaTest("Verify sap.m.Select Control when number of quickVariantSelection is more than 3", function (Given, When, Then) {
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheObjectPage
				.iCheckComboboxSelectedValue("ObjectPageTable:::VariantSelection:::sFacet::to_Item:3a:3acom.sap.vocabularies.UI.v1.LineItem", "Greater than 3000 and Less than 5000 (2)")
				.and
				.iCheckRenderedColumnTextOnNthRowOfTable(1, [4], ["3,998.00 EUR"], "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("Verify sap.m.Select Control when number of quickVariantSelection is more than 3 and selected Item Changed", function (Given, When, Then) {
			When.onTheObjectPage
				.iSelectComboboxValue("ObjectPageTable:::VariantSelection:::sFacet::to_Item:3a:3acom.sap.vocabularies.UI.v1.LineItem", 5);
			Then.onTheObjectPage
				.iCheckComboboxSelectedValue("ObjectPageTable:::VariantSelection:::sFacet::to_Item:3a:3acom.sap.vocabularies.UI.v1.LineItem", "Net Amount greater than  1000 and Tax Amount less than equal to 600 (3)")
				.and
				.iCheckRenderedColumnTextOnNthRowOfTable(1, [3, 4], ["3,736.60 USD", "3,140.00 USD"], "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("Minimize the ObjectPage", function (Given, When, Then) {
			Then.onTheGenericFCLApp
				.iCheckForFCLLayoutAppStateInUrl();
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("exitFullScreen");
			Then.onTheGenericFCLApp
				.iCheckFCLHeaderActionButtonsVisibility({"fullScreen": true, "exitFullScreen": false});
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsMidExpanded");
		});

		opaTest("Check for confirmation popup prompting user to keep/discard draft on closing the FCL second column or OP", function (Given, When, Then) {
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("closeColumn");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Warning")
				.and
				.iShouldSeeTheDialogWithContent("You've made changes to this object.\nWhat would you like to do?");
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel")
		});

		opaTest("Expand the ObjectPage", function (Given, When, Then) {
			Then.onTheGenericFCLApp
				.iCheckForFCLLayoutAppStateInUrl("TwoColumnsMidExpanded");
			When.onTheGenericFCLApp
				.iSetTheFCLLayout("TwoColumnsBeginExpanded");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsBeginExpanded");
		});

		opaTest("Collapse the ObjectPage", function (Given, When, Then) {
			When.onTheGenericFCLApp
				.iSetTheFCLLayout("TwoColumnsMidExpanded");
			Then.onTheGenericFCLApp
				.iCheckForFCLLayoutAppStateInUrl("TwoColumnsMidExpanded");
		});

		opaTest("Navigate to items Sub-ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByFieldValue("to_Item", {Field:"SalesOrderItem", Value:"30"});

			Then.onTheGenericObjectPage
				.iShouldSeeTheSections(["Schedule Lines"]);
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("ThreeColumnsEndExpanded");
		});

		opaTest("Expand the Sub-ObjectPage", function (Given, When, Then) {
			Then.onTheGenericFCLApp
				.iCheckForFCLLayoutAppStateInUrl();
			When.onTheGenericFCLApp
				.iSetTheFCLLayout("ThreeColumnsMidExpanded");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("ThreeColumnsMidExpanded");
			Then.onTheGenericFCLApp
				.iCheckForFCLLayoutAppStateInUrl();
		});

		opaTest("Collapse the Sub-ObjectPage", function (Given, When, Then) {
			When.onTheGenericFCLApp
				.iSetTheFCLLayout("ThreeColumnsEndExpanded");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("ThreeColumnsEndExpanded");
			Then.onTheGenericFCLApp
				.iCheckForFCLLayoutAppStateInUrl();
		});

		opaTest("Check FCL Layout", function (Given, When, Then) {
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("ThreeColumnsEndExpanded");
			Then.iTeardownMyApp();
		});
	}
);
