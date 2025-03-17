sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
	function (opaTest, Opa5) {
		"use strict";

		QUnit.module("Object Page Summarize option");
		if (sap.ui.Device.browser.safari) {
			opaTest("Safari detected - SKIPPED", function (Given, When, Then) {
				Opa5.assert.expect(0);
			});
		} else {

		opaTest("Start the app and navigate to the active object page and check the Summarize button on the OP header", function (Given, When, Then) {
			Given.iStartMyAppInSandboxWithNoParams("#EPMProduct-manage_st");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({ Field: "ProductForEdit", Value: "HT-1000" });
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("Notebook Basic 15");
			Then.onTheObjectPage
				.iCheckControlPropertiesById("STTA_C_MP_Product--summarize", { "visible": true, "enabled": true, "importance": "High", "text": "Summarize", "icon": "sap-icon://ai", "type": "Ghost" });
		});

		opaTest("Navigate to sub object page and check the Summarize button on the OP header", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("General Information", "Product Texts")
				.and
				.iNavigateFromObjectPageTableByLineNo("to_ProductText", 0);
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("Notebook Basic 15");
			Then.onTheObjectPage
				.iCheckControlPropertiesById("STTA_C_MP_ProductText--summarize", { "visible": true, "enabled": true, "importance": "High", "text": "Summarize", "icon": "sap-icon://ai", "type": "Ghost" });
		});

		opaTest("Navigate to a draft object page and check the Summarize button on the OP header in edit mode", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iCloseTheObjectPage()
				.and
				.iCloseTheObjectPage();
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({ Field: "ProductForEdit", Value: "HT-1001" });
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("基础版笔记本电脑 17");
			Then.onTheObjectPage
				.iCheckControlPropertiesById("summarize", { "visible": true, "enabled": true, "importance": "High", "text": "Summarize", "icon": "sap-icon://ai", "type": "Ghost" });
		});

		opaTest("Navigate to sub object page and check the Summarize button on the OP header in edit mode", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("General Information", "Product Texts")
				.and
				.iNavigateFromObjectPageTableByLineNo("to_ProductText", 0);
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("Notebook Basic 17");
			Then.onTheObjectPage
				.iCheckControlPropertiesById("STTA_C_MP_ProductText--summarize", { "visible": true, "enabled": true, "importance": "High", "text": "Summarize", "icon": "sap-icon://ai", "type": "Ghost" });
			Then.iTeardownMyApp();
		});
	}
	}
);
