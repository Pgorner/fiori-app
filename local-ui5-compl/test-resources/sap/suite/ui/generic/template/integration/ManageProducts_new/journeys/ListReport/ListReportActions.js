sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Journey - ManageProducts - List Report Actions");

		opaTest("#1 Check if the Main Page shows a table", function (Given, When, Then) {
			// Arrangements
			Given.iStartMyAppInDemokit("sttaproducts");

			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheListReportPage
				.iWaitForThePageToLoad("ListReport", "STTA_C_MP_Product")
				.and
				.theSmartTableIsRenderedCorrectly()
				.and
				.iCheckControlPropertiesByControlType("sap.m.Button", {"visible": true, "icon": "sap-icon://action-settings"});
		});

		opaTest("#2 Check Settings Popup Dialog Comes Up", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithIcon("sap-icon://action-settings");
			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.m.Title", {"text": "View Settings"})
		});

		opaTest("#3 Check button enablement for requiresSelection - disabled buttons", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Cancel");
			Then.onTheGenericListReport
				.theButtonWithLabelIsEnabled("Copy with new Supplier", true)
				.and
				.theButtonWithIdIsEnabled("addEntry", true)
				.and
				.theOverflowToolBarButtonIsEnabled("Change price", false)
				.and
				.theOverflowToolBarButtonIsEnabled("Delete", false);
		});

		opaTest("#4 Check button enablement for requiresSelection - enabled buttons", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([3]);

			Then.onTheGenericListReport
				.theOverflowToolBarButtonIsEnabled("Change price", true)
				.and
				.theOverflowToolBarButtonIsEnabled("Delete", true);
		});

		opaTest("#5 Critical Action Confirmation Pop-Up Custom Message", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([3], false);
			When.onTheListReportPage
				.iSelectAnItemOnLRTableWithStatus("Draft");
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({"STTA_C_MP_ProductActivation": [true, true]});
			When.onTheGenericListReport
				.iClickTheButtonWithLabel("Activate");
			Then.onTheGenericListReport
				.iSeeTheDialogWithContent("Are you sure you want to Activate this product ?");
			Then.iTeardownMyApp();
		});
	}
);
