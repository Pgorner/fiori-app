sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
	function (opaTest, Opa5) {
		"use strict";

		QUnit.module("Object Page Delete");

		if (sap.ui.Device.browser.safari) {
			opaTest("Safari detected - SKIPPED", function (Given, When, Then) {
				Opa5.assert.expect(0);
			});
		} else {

		opaTest("Start the app and check the number of items", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttaproducts");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theAvailableNumberOfItemsIsCorrect(125);
		});

		opaTest("Click on Create button and check the No data text for the chart on OP create page", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Create")
			Then.onTheGenericObjectPage
				.theObjectPageIsInEditMode();
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Sales Data");
			Then.onTheObjectPage
				.iCheckSmartChartNoDataText("No items available.", "to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart");
		});

		opaTest("Check for Draft discard Popup on navigating back to LR from OP when set to restricted in manifest", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("back");
				Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Warning")
				.and
				.iShouldSeeTheDialogWithContent("You haven't created this object yet.\nWhat would you like to do?");
			When.onTheGenericObjectPage
				.iSelectTheOptionFromDiscardDraftPopUp("Discard Draft")
				.and
				.iClickTheButtonOnTheDialog("OK");
		});

		opaTest("Navigate to the ObjectPage", function(Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByLineNo(3);
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "STTA_C_MP_Product");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("Notebook Basic 15")
				.and
				.iShouldSeeTheSections(["General Information","Sales Data","Sales Revenue"]);
		});
		
		opaTest("Scroll down to table and check for sticky header and toolbar", function(Given, When, Then) {
			When.onTheObjectPage
				.iScrollViewToPosition("STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product", 0, 1100);
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.m.OverflowToolbar", {"visible": true})
				.and
				.iCheckControlPropertiesByControlType("sap.m.Column", {"visible": true});
		});

		opaTest("Check user defined input field in toolbar breakout - Language filter", function(Given, When, Then) {
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheObjectPage
				.iCheckControlPropertiesById("CustomFilter-Language", {"visible": true, "enabled":true});
			When.onTheGenericObjectPage
				.iChoosetheItemInSelect("EN","Language Filter");
			Then.onTheObjectPage
				.iCheckRenderedColumnTextOnNthRowOfTable(1, [1], ["English (EN)"], "to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			When.onTheGenericObjectPage
				.iChoosetheItemInSelect("ZH","Language Filter");
			Then.onTheObjectPage
				.iCheckRenderedColumnTextOnNthRowOfTable(1, [1], ["Chinese (ZH)"], "to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("to_ProductText::com.sap.vocabularies.UI.v1.LineItem::Table::Toolbar-overflowButton");
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.m.DatePicker", {"visible": true, "enabled":true, "editable": true});
		});

		opaTest("Click the Delete button", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("delete");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Delete");
		});

		opaTest("Confirm the delete action", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Delete");
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(124);
		});

		opaTest("Table toolbar Create button controlled via NavigationRestrictions - Path", function(Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByLineNo(0);
			Then.onTheObjectPage
				.iCheckTableToolbarControlProperty({"AddEntry": [true, true], "DeleteEntry": [true, false], "Validate": [true, false]}, "to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("Create Button visibility on the OP during Edit Draft object which is not yet activated", function(Given, When, Then) {
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheGenericObjectPage
				.theButtonWithLabelIsEnabled("Create", true);
		});

		opaTest("Check the Edit button not visible on the OP - Object with update restriction", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iCloseTheObjectPage();
			When.onTheGenericObjectPage
				.iSelectTheOptionFromDiscardDraftPopUp("Discard Draft")
				.and
				.iClickTheButtonOnTheDialog("OK");
			When.onTheGenericListReport
			.iNavigateFromListItemByFieldValue({ Field: "ProductForEdit", Value: "HT-1010" });
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("专业版笔记本电脑 15");
			Then.onTheObjectPage
				.iCheckTheControlWithIdIsVisible("sap.uxap.ObjectPageHeaderActionButton", "STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--edit", false);
		});

		opaTest("Check the Edit button is not visible on the SubOP - Main Object with update restriction", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("General Information", "Product Texts")
				.and
				.iNavigateFromObjectPageTableByLineNo("to_ProductText", 0);
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("专业版笔记本电脑 15");
			Then.onTheObjectPage
				.iCheckTheControlWithIdIsVisible("sap.uxap.ObjectPageHeaderActionButton", "STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_ProductText--edit", false);
			Then.iTeardownMyApp();
		});
	}
	}
);
