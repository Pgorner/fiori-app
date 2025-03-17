sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("List Report Page Rendering");

		opaTest("The Filter Bar is rendered correctly", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("EPMManageProduct-displayFactSheet,EPMProduct-manage_st#EPMProduct-manage_st");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			When.onTheListReportPage
				.iLookAtTheScreen();
			Then.onTheListReportPage
				.theFilterBarIsRenderedCorrectly()
				.and
				.iCheckComboboxValues("editStateFilter", 6, ["All", "All (Hiding Drafts)", "Own Draft", "Locked by Another User", "Unsaved Changes by Another User", "Unchanged"])
				.and
				.iCheckComboboxValues("CustomFilter-Price-combobox", 5, ["", "Price between 0-100", "Price between 100-500", "Price between 500-1000", "Price: Over 1000"])
				.and
				.thePageVariantShouldBeMarked(false);
			When.onTheGenericListReport
				.iSetTheFilter({Field: "Product", Value: "HT-1000"});
			Then.onTheListReportPage
				.thePageVariantShouldBeMarked(true);
			Then.onTheGenericListReport
				.iShouldSeeTheControlWithId("template::Share-internalBtn")
				.and
				.iShouldSeeTheControlWithId("template:::ListReportPage:::DynamicPageTitle");
		});

		opaTest("Check the filter fields from the specified navigation properties are available in the SmartFilterBar", function (Given, When, Then) {
			When.onTheListReportPage
				.iLookAtTheScreen();
			Then.onTheListReportPage
				.iCheckControlPropertiesById("listReportFilter", {"useProvidedNavigationProperties": true, "navigationProperties": "to_Currency,to_Supplier,DraftAdministrativeData"})
		});

		opaTest("The Table is rendered correctly and \"PopinDisplay\"=\"WithoutHeader\" for columns checked", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSetTheFilter({Field: "Product", Value: ""})
				.and
				.iExecuteTheSearch();
			When.onTheListReportPage
				.iLookAtTheScreen();
			Then.onTheListReportPage
				.theSmartTableIsRenderedCorrectly()
				.and
				.theCustomToolbarForTheSmartTableIsRenderedCorrectly()
				.and
				.iCheckControlPropertiesById("responsiveTable", {"fixedLayout": "Strict", "growing": true, "growingScrollToLoad": true, "growingThreshold": 20})
				.and
				.theResponsivetableHasColumnsWithPopinDisplay("WithoutHeader");
		});

		opaTest("Check the importance of the Semantic Key Field column - 'Product' is set to HIGH", function (Given, When, Then) {
			When.onTheListReportPage
				.iLookAtTheScreen();
			Then.onTheListReportPage
				.iCheckControlPropertiesById("listReport-ProductForEdit", { "visible": true, "importance": "High" });
		});

		opaTest("Check the width of FE rendered column having field groups", function (Given, When, Then) {
			When.onTheListReportPage
				.iLookAtTheScreen();
			Then.onTheListReportPage
				.iCheckControlPropertiesById("FieldGroup:23FieldGroupColumn", { "visible": true, "width": "20rem" });
		});

		opaTest("Check sort options on the column header menu for the Field Control columns on the table", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickOnColumnHeaderWithId("com.sap.vocabularies.UI.v1.FieldGroup:23FieldGroupColumn");
			Then.onTheListReportPage
				.iCheckTheOptionInTableColumnHeaderMenu("Sort By: FieldGroupColumn")
				.and
				.iCheckTheOptionInTableColumnHeaderMenu("Sort By: Availability");
		});

		opaTest("Check the Show Details button on the Table and None, Low and Medium importance columns are hidden from the table popin", function (Given, When, Then) {
			When.onTheListReportPage
				.iLookAtTheScreen();
			Then.onTheListReportPage
				.iCheckControlPropertiesById("listReport-btnShowHideDetails", {"visible": true, "enabled": true, "selectedKey": "hideDetails"})
				.and
				.iCheckTheCoulmnsHiddenInPoppinForTheTable(["None", "Low", "Medium"])
				.and
				.iCheckTheColumnDisplayedInTheTablePopin("Image", false)
				.and
				.iCheckTheColumnDisplayedInTheTablePopin("Sales", false)
				.and
				.iCheckTheColumnDisplayedInTheTablePopin("Revenue", false);
		});

		opaTest("Click on the Show Details button and check None, Low and Medium importance columns are displayed as table popin", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheShowDetailsButtonOnTheTableToolBar();
			Then.onTheListReportPage
				.iCheckControlPropertiesById("listReport-btnShowHideDetails", {"visible": true, "enabled": true, "selectedKey": "showDetails"})
				.and
				.iCheckTheCoulmnsHiddenInPoppinForTheTable("")
				.and
				.iCheckTheColumnDisplayedInTheTablePopin("Image", true)
				.and
				.iCheckTheColumnDisplayedInTheTablePopin("Sales", true)
				.and
				.iCheckTheColumnDisplayedInTheTablePopin("Revenue", true);
		});

		opaTest("Determining Actions, Micro Charts, Rating & Progress Indicator, Image icon, Title, row highlight are rendered correctly", function (Given, When, Then) {
			When.onTheListReportPage
				.iLookAtTheScreen();
			Then.onTheListReportPage
				.thePageShouldContainTheCorrectDeterminingActions()
				.and
				.theSmartTableContainsMicroCharts()
				.and
				.theSmartTableContainsRatingIndicator()
				.and
				.theSmartTableContainsProgressIndicator()
				.and
				.theObjectMarkerContainsUserInfo()
				.and
				.iCheckControlPropertiesByControlType("sap.m.Avatar", {"visible": true, "displayShape": "Square", "displaySize": "S"})
				.and
				.checkRowHighlight()
				.and
				.checkDefaultTitle();
		});

		opaTest("Check the presence and the Keyboard shortcut command of Global action in toolbar", function (Given, When, Then) {
			Then.onTheGenericListReport
				.iShouldSeeTheButtonWithLabel("Global Action");
			Then.onTheListReportPage
				.iCheckTheCommandExecutionPropertiesForTheControl("page", { "command": "GlobalActionCommand", "visible": true, "shortcut": "Ctrl+B" });
			When.onTheGenericListReport
				.iClickTheButtonWithId("action::GlobalAction");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithContent("Global Action triggered");
		});

		opaTest("Check the Keyboard shortcut command for custom action on the table toolbar", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("OK");
			Then.onTheListReportPage
				.iCheckTheCommandExecutionPropertiesForTheControl("listReport", { "command": "ChangePriceCommand", "visible": false, "shortcut": "Ctrl+G" });
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([3]);
			Then.onTheListReportPage
				.iCheckTheCommandExecutionPropertiesForTheControl("listReport", { "command": "ChangePriceCommand", "visible": true, "shortcut": "Ctrl+G" });
			When.onTheGenericListReport
				.iClickTheButtonWithId("ChangePrice");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Change Price");
		});

		opaTest("The Contact Information popup should open when a contact Quick View is clicked", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Cancel")
				.and
				.iClickTheLink("SAP");
			Then.onTheListReportPage
				.theContactInformationShouldBeDisplayedFor("SAP", "Waldorf, Germany");
		});

		opaTest("Verify whitespace in LR table cell", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSetTheFilter({ Field: "Product", Value: "HT-1064" })
				.and
				.iExecuteTheSearch();
			Then.onTheListReportPage
				.iCheckWhitespaceInLRTableCell("responsiveTable", 0, 1, 2, "Internet    Keyboard", true);
		});

		opaTest("Verify whitespace in Delete confirmation dialog in LR", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([0])
				.and
				.iClickTheButtonWithId("deleteEntry");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Delete")
				.and
				.iShouldSeeTheDialogWithContent("Delete object Internet    Keyboard?");
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Cancel");
		});

		opaTest("Open the QV pop up from the LR table", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSetTheFilter({ Field: "Product", Value: "" })
				.and
				.iExecuteTheSearch();
			When.onTheGenericListReport
				.iClickTheShowDetailsButtonOnTheTableToolBar();
			When.onTheListReportPage
				.iClickOnACellInTheTable(2, 6);
			Then.onTheListReportPage
				.theSmLiQvPopoverOpensAndContainsExtraContent("Label: FieldGroup_1");
		});

		opaTest("Click the QV link to navigate to external application", function (Given, When, Then) {
			When.onTheObjectPage
				.iClickTheTitleAreaLinkOnTheSmLiQvPopover();
			Then.onTheGenericListReport
				.theResultListIsVisible();
			Then.iTeardownMyApp();
		});
	}
);
