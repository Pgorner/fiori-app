sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("LR page with Grid Table");

		opaTest("Start the app and check the Info toolbar text on the Grid table", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernd", "manifestLRGridTable");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect("1,080");
			Then.onTheListReportPage
				.iCheckControlPropertiesById("listReport", { "Visible": true, "useInfoToolbar": "On" });
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Settings", "listReport")
				.and
				.iClickTheControlByControlType("sap.m.IconTabFilter", { "text": "Filter" });
			When.onTheGenericListReport
				.iChoosetheItemInComboBox("Business Partner ID");
			When.onTheListReportPage
				.iEnterValueInField("100000000", "BusinessPartnerID")
				.and
				.iClickOnButtonWithText("OK");
			Then.onTheListReportPage
				.iCheckInfoToolbarTextOnTheTable("1 table filter active: Business Partner ID", "GridTable");
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(21);
		});

		opaTest("Navigate to OP and check the Info toolbar text on the Grid table", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByLineNo(0);
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000010");
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Sales Order Items");
			Then.onTheObjectPage
				.iCheckNumberOfItemsInTable(7, "to_Item::com.sap.vocabularies.UI.v1.LineItem::gridTable", "gridTable")
				.and
				.iCheckControlPropertiesById("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table", { "Visible": true, "useInfoToolbar": "On" });
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Settings", "to_Item::com.sap.vocabularies.UI.v1.LineItem::Table")
				.and
				.iClickTheControlByControlType("sap.m.IconTabFilter", { "text": "Filter" });
			When.onTheGenericListReport
				.iChoosetheItemInComboBox("Currency");
			When.onTheListReportPage
				.iEnterValueInField("EUR", "CurrencyCode")
				.and
				.iClickOnButtonWithText("OK");
			Then.onTheListReportPage
				.iCheckInfoToolbarTextOnTheTable("1 table filter active: Currency", "to_Item::com.sap.vocabularies.UI.v1.LineItem::gridTable")
				.and
				.iCheckNumberOfItemsInTable(3, "to_Item::com.sap.vocabularies.UI.v1.LineItem::gridTable", "gridTable");
			Then.iTeardownMyApp();
		});
	}
);