sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
	function (opaTest, Opa5) {
		"use strict";

		QUnit.module("Object Page - Persistency checks");

		if (sap.ui.Device.browser.safari) {
			opaTest("Safari detected - SKIPPED", function (Given, When, Then) {
				Opa5.assert.expect(0);
			});
		} else {

		opaTest("Starting the FCL app and loading the OP of draft item", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttaproducts", "manifestDynamicHeaderInFCL", null, { width: "1400", height: "600" });
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iNavigateFromListItemByFieldValue({ Field: "ProductForEdit", Value: "HT-1022" });
			Then.onTheGenericObjectPage
				.theObjectPageIsInEditMode();
		});

		opaTest("Check for discard draft confirmation popup on closing the OP in FCL when set to restricted in manifest", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iCloseTheObjectPage();
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Warning")
				.and
				.iShouldSeeTheDialogWithContent("You've made changes to this object.\nWhat would you like to do?");
			When.onTheGenericObjectPage
				.iSelectTheOptionFromDiscardDraftPopUp("Keep Draft")
				.and
				.iClickTheButtonOnTheDialog("OK");
			Then.onTheGenericListReport
				.theListReportPageIsVisible();
		});

		opaTest("Open the OP of active object and select the Sales Data tab and make changes from the chart", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({ Field: "ProductForEdit", Value: "HT-1000" });
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("Notebook Basic 15");
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Sales Data");
			When.onTheGenericObjectPage
				.iClickTheControlWithId("to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::ChartbtnLegend")
				.and
				.iClickTheControlWithId("to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart-btnChartType");
			When.onTheObjectPage
				.iClickTheControlByControlType("sap.m.StandardListItem", { "title": "Bar Chart" });
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart-btnDrillDownText-drillDown");
			When.onTheObjectPage
				.iClickTheControlByControlType("sap.m.StandardListItem", { "title": "Currency" });
			Then.onTheObjectPage
				.iCheckTheAggregationItemPropertiesForSmartChart({ "chartType": "bar", "currentLocationText": "Currency" }, "to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart")
				.and
				.iCheckControlPropertiesById("to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart", { "visible": true, "legendVisible": false });
		});

		opaTest("Select the Sales Revenue tab and click on Show File button to load the side content", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Sales Revenue")
				.and
				.iClickTheButtonHavingLabel("Show File");
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.ui.layout.DynamicSideContent", {"showSideContent": true});
		});

		opaTest("Open another record from LR and check the tab selection and side content are persisted", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({ Field: "ProductForEdit", Value: "HT-1002" });
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("基础版笔记本电脑 18");
			Then.onTheGenericObjectPage
				.iCheckSelectedSectionByIdOrName("Sales Revenue");
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.ui.layout.DynamicSideContent", {"showSideContent": true});
		});

		opaTest("Check the chart changes are persisted", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Sales Data");
			Then.onTheObjectPage
				.iCheckTheAggregationItemPropertiesForSmartChart({ "chartType": "bar", "currentLocationText": "Currency" }, "to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart")
				.and
				.iCheckControlPropertiesById("to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart", { "visible": true, "legendVisible": false });
		});

		opaTest("Save a new variant for Product Sales Data chart", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickOnSmartVariantViewSelection("to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart-variant-vm-trigger")
				.and
				.iClickTheButtonWithId("to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart-variant-vm-saveas")
				.and
				.iSetTheInputFieldWithId("to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart-variant-vm-name", "Test")
				.and
				.iClickTheButtonOnTheDialog("Save");
			Then.onTheObjectPage
				.theCorrectSmartVariantIsSelected("Test", "to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart-variant-vm");
		});

		opaTest("Open another record from LR and check the chart variant selection is persisted", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({ Field: "ProductForEdit", Value: "HT-1003" });
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("基础版笔记本电脑 19")
			Then.onTheObjectPage
				.theCorrectSmartVariantIsSelected("Test", "to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart-variant-vm");
			Then.onTheObjectPage
				.iCheckTheAggregationItemPropertiesForSmartChart({ "chartType": "bar", "currentLocationText": "Currency" }, "to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart")
				.and
				.iCheckControlPropertiesById("to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart", { "visible": true, "legendVisible": false });
		});

		opaTest("Delete the newly created variant", function (Given, When, Then) {
			When.onTheObjectPage
				.iClickOnVariantById("to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart-variant-vm");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Manage")
				.and
				.iClickTheButtonWithIcon("sap-icon://decline")
				.and
				.iClickTheButtonHavingLabel("Save");
			Then.onTheObjectPage
				.theCorrectSmartVariantIsSelected("Standard", "to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart-variant-vm");
			Then.iTeardownMyApp();
		});
	}
	}
);
