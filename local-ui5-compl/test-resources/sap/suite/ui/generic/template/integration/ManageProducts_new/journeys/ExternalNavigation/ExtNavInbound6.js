sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
	function (opaTest, Opa5) {
		"use strict";

		QUnit.module("External Navigation Inbound 6");

		if (sap.ui.Device.browser.safari) {
			opaTest("Safari detected - SKIPPED", function (Given, When, Then) {
				Opa5.assert.expect(0);
			});
		} else {

		opaTest("Check the dedicated actions defined in the Related Apps settings and UnavailableActions on Object Page", function(Given, When, Then) {
			Given.iStartMyAppInSandbox("SalesOrder-SegButtons,SalesOrder-TableTabs,EPMProduct-displayFactSheet,SalesOrder-nondraft,STTASOWD20-STTASOWD20,SalesOrder-itemaggregation,EPMProduct-manage_st#EPMProduct-manage_st");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			When.onTheListReportPage
				.iClickTheItemInResponsiveTable(0);
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "STTA_C_MP_Product");
			When.onTheGenericObjectPage
				.iClickTheRelatedAppMenuButton("STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--relatedApps");
			Then.onTheObjectPage
				.iCheckRelatedAppsSheetList(true, ["Manage Products", "Sales Order Items Aggregation", "Sales Order Non Draft", "Sales Order with Draft", "Trace Navigation Parameters"])
				.and
				.iCheckRelatedAppsSheetList(false, ["Trace Navigation Parameters - Beta Version", "Sales Order with Table Tabs", "Sales Order with Segmented Buttons in FCL"]);
		});

		opaTest("Check no discard draft confirmation popup appears on external navigation when set to 'restricted' mode", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateToRelatedApp(3)
			Then.onTheGenericListReport
				.iSeeShellHeaderWithTitle("Sales Order w/o Extensions");
			When.onTheGenericListReport
				.iClickTheBackButtonOnFLP();
			Then.onTheObjectPage
				.iCheckObjectPageEntitySet("STTA_C_MP_Product");
		});

		opaTest("Check the dedicated actions defined in the Related Apps settings and UnavailableActions on Sub-object Page", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateBack();
			When.onTheGenericObjectPage
				.iSelectTheOptionFromDiscardDraftPopUp("Keep Draft")
				.and
				.iClickTheButtonOnTheDialog("OK");
			Then.onTheGenericListReport
				.theListReportPageIsVisible();
			When.onTheListReportPage
				.iClickTheItemInResponsiveTable(3);
			When.onTheObjectPage
				.iScrollViewToPosition("STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product", 0, 500);
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("General Information", "Product Texts")
				.and
				.iNavigateFromObjectPageTableByLineNo("to_ProductText", 0)
				.and
				.iClickTheRelatedAppMenuButton("STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_ProductText--relatedApps");
			Then.onTheObjectPage
				.iCheckRelatedAppsSheetList(false, ["Trace Navigation Parameters"])
				.and
				.iCheckRelatedAppsSheetList(true, ["Manage Products", "Sales Order Non Draft", "Sales Order with Draft", "Trace Navigation Parameters - Beta Version"]);
			Then.iTeardownMyApp();
		});
	}
	}
);
