sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Non Draft Object Page: Data Loss Popup");

		opaTest("Starting the Object Page directly", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernd#/STTA_C_SO_SalesOrder_ND('500000011')");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000011");
		});

		opaTest("Checking the variant management for OP table", function (Given, When, Then) {
			Then.onTheObjectPage
				.iCheckVariantManagementIsDisabledForTable("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table")
		});
		
		opaTest("Navigating down to the Items Object Page", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheItemInResponsiveTable(3);
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("80", "STTA_C_SO_SalesOrderItem_ND");
			When.onTheSubObjectPage
				.iClickOnButtonWithText("Edit");
			Then.onTheGenericObjectPage
				.theObjectPageIsInEditMode();
		});

		opaTest("Navigating down to the Items Object Page and check data loss popup", function (Given, When, Then) {
			When.onTheSubObjectPage
				.iEnterValueInField("HT-1003", "com.sap.vocabularies.UI.v1.Identification::ProductID::Field");
			When.onTheGenericObjectPage
				.iClickTheControlWhichContainsId("NavigationDown");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Warning")
				.and
				.iShouldSeeTheButtonsOnTheDialog(["Leave Page", "Cancel"])
				.and
				.iShouldSeeTheDialogWithContent("Your entries will be lost when you leave this page.");
			Then.iTeardownMyApp();
		});
	});
