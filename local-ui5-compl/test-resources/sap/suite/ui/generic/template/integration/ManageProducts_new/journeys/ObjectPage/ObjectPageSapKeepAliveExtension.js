sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";
//This OPA 1st checks the Rating Indicator value and once the external navigation is done, value of Rating Indicator is changed
//These changes are done to make sure onLeaveAppExtension is called when the user comes back from external navigation when sap-keep-alive is set to true.
		QUnit.module("onLeaveAppExtension check with sap-keep-alive");

		opaTest("Start the Object page", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("STTASOWD20-STTASOWD20,EPMProduct-manage_st#EPMProduct-manage_st&/STTA_C_MP_Product(Product='HT-1003',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)", null, { sapKeepAlive: true });
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "STTA_C_MP_Product");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("基础版笔记本电脑 19");
		});
	
		opaTest("onLeaveAppExtension: Check Rating indicator Value change after external navigation", function (Given, When, Then) {
			When.onTheObjectPage
				.iScrollViewToPosition("STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product", 0, 0);
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.m.RatingIndicator",{ "visible": true, "enabled": true ,"value":4});
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("General Information", "Product Texts")
				.and
				.iClickTheShowDetailsButtonOnTheTableToolBar("to_ProductText")
				.and
				.iClickTheLink("Notebook Basic 19");
			Then.onTheGenericListReport
				.iSeeShellHeaderWithTitle("Sales Order w/o Extensions");
			When.onTheGenericListReport
				.iClickTheBackButtonOnFLP();
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "STTA_C_MP_Product")
				.and
				.iScrollViewToPosition("STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product", 0, 0);
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.m.RatingIndicator",{ "visible": true, "enabled": true ,"value":1});		
			Then.iTeardownMyApp();
		});
	}
);
