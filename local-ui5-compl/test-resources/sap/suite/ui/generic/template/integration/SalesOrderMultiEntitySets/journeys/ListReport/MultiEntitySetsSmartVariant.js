sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order Multi EntitySets - List Report: Smart Variant");

		opaTest("Smart Variant - rendering on start-up", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("SalesOrder-MultiViews#SalesOrder-MultiViews");
			When.onTheGenericListReport
				.iLookAtTheScreen();
            Then.onTheGenericListReport
				.theHeaderExpandedPropertyIsCorrectlySet(true);
			Then.onTheListReportPage
				.iCheckTheSelectedVariantIsModified(true, "PageVariant");
			When.onTheGenericListReport
				.iSetTheFilter({ Field: "CreatedDate", Value: "Jan 1, 2020 - Dec 31, 2020" })
				.and
				.iSetTheFilter({Field: "DeliveryDate", Value: ""})
				.and
				.iSetTheFilter({Field: "UpdatedDate", Value: ""})
				.and
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListContainsTheCorrectNumberOfItems(8, 1);
			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.ui.comp.smartvariants.SmartVariantManagement", {"visible": true})
				.and
				.theCorrectSmartVariantIsSelected("Standard", "PageVariant-vm");
		});

		opaTest("Check if Semantic date range is successfully stored in iappstate", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSetTheFilter({ Field: "CreatedDate", Value: "" })
				.and
				.iSetTheFilter({Field: "DeliveryDate", Value: "Today -1 / +1 Days"})
				.and
				.iExecuteTheSearch();
			When.onTheGenericListReport
				.iClickOnItemFromTheShellNavigationMenu("Home");
			Then.onTheFLPPage
				.iCheckControlPropertiesByControlType("sap.ushell.ui.shell.ShellAppTitle", { "visible": true, "text": "Home" });
			When.onTheGenericListReport
				.iNavigateBack();
			When.onTheListReportPage
				.iWaitForThePageToLoad("ListReport", "C_STTA_SalesOrder_WD_20");
			When.onTheGenericListReport
				.iSetTheHeaderExpanded(true);
			Then.onTheListReportPage
				.iCheckControlPropertiesById("listReportFilter-filterItemControl_BASIC-DeliveryDate-input", {"value": "Today -1 / +1 Days"});
		});

		opaTest("Save as Tile - Dynamic tile is created when Semantic date range value passed from smartfilterBar", function (Given, When, Then) {
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iClickTheButtonWithId("template::Share-internalBtn");
			When.onTheListReportPage
				.iClickMenuItem("Save as Tile");	
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Save as Tile");
			Then.onTheListReportPage
				.iCheckTheTileType("Dynamic");
			When.onTheListReportPage
				.iClickOnPagesMultiInputOnSaveAsTileDialog();
			When.onTheListReportPage
				.iClickOnCheckboxWithText("", "SelectedNodesComboBox-ValueHelpDialog--ContentNodesTree-1-selectMulti");
			When.onTheListReportPage
				.iClickTheButtonOnTheDialog("Apply");
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Save");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("The tile was created and added to your page.")
		});

		opaTest("Save as Tile - Dynamic tile created when Semantic date range value is not passed from smartfilterBar", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSetTheFilter({ Field: "CreatedDate", Value: "" })
				.and
				.iSetTheFilter({Field: "DeliveryDate", Value: ""})
				.and
				.iExecuteTheSearch()
				.and
				.iClickTheButtonWithId("template::Share-internalBtn");
			When.onTheListReportPage
				.iClickMenuItem("Save as Tile");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Save as Tile");
			Then.onTheListReportPage
				.iCheckTheTileType("Dynamic");
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel");
			When.onTheListReportPage
				.iClickTheButtonOnTheDialog("Discard");
		});

		opaTest("Save as Tile - Dynamic tile is created when custom field date range value passed from smartfilterBar", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSetTheFilter({ Field: "LastChangedDateTime", Value: "Jan 1, 2017 - Dec 31, 2017" })
				.and
				.iExecuteTheSearch()
				.and
				.iClickTheButtonWithId("template::Share-internalBtn");
			When.onTheListReportPage
				.iClickMenuItem("Save as Tile");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Save as Tile");
			Then.onTheListReportPage
				.iCheckTheTileType("Dynamic");
			Then.iTeardownMyApp();
		});

		opaTest("Save as Tile - Static tile created when custom date range value is passed from smartfilterBar", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("SalesOrder-MultiViews#SalesOrder-MultiViews", "manifestCustomDateRange");
			When.onTheListReportPage
				.iClickTheControlWithId("filterItemControl_BASIC-CreatedDate-input")
				.and
				.iClickTheControlByControlType("sap.m.StandardListItem", {"title": "nowFromTo"})
				.and
				.iClickTheButtonOnTheDialog("Apply");
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iClickTheButtonWithId("template::Share-internalBtn");
			When.onTheListReportPage
				.iClickMenuItem("Save as Tile");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Save as Tile");
			Then.onTheListReportPage
				.iCheckTheTileType("Static");
			Then.iTeardownMyApp();
		});

		opaTest("Save as Tile - Dynamic tile created when date range(field is coming from another entity) value is passed from smartfilterBar ", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("SalesOrder-MultiViews#SalesOrder-MultiViews", "manifestWithUseDateRange");
			When.onTheGenericListReport
				.iSetTheFilter({ Field: "to_BillingStatus.ChangedDate", Value: "Jan 1, 2020 - Dec 31, 2020" })
				.and
				.iExecuteTheSearch()
				.and
				.iClickTheButtonWithId("template::Share-internalBtn");
			When.onTheListReportPage
				.iClickMenuItem("Save as Tile");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Save as Tile");
			Then.onTheListReportPage
				.iCheckTheTileType("Dynamic");
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel");
			When.onTheListReportPage
				.iClickTheButtonOnTheDialog("Discard");
		});

		opaTest("Save as Tile - Dynamic  tile created when date range(field is coming from another entity) value not passed from smartfilterBar", function (Given, When, Then) {
			When.onTheListReportPage
				.iEnterValueInField("", "listReportFilter-filterItemControl_BASIC-to_BillingStatus.ChangedDate-input");
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iClickTheButtonWithId("template::Share-internalBtn");
			When.onTheListReportPage
				.iClickMenuItem("Save as Tile");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Save as Tile");
			Then.onTheListReportPage
				.iCheckTheTileType("Dynamic");
			Then.iTeardownMyApp();
		});
	}
);
