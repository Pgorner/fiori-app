sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order with Segmented Buttons - List Report");

		opaTest("Starting the app and check default filters coming from Selection Variant", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("SalesOrder-MultiViews,SalesOrder-SegButtons#SalesOrder-SegButtons");
			When.onTheListReportPage
				.iLookAtTheScreen();
			Then.onTheListReportPage
			    .iCheckTheMultiInputFieldValues("listReportFilter-filterItemControl_BASIC-CurrencyCode",  ["=EUR"])
				.and
				.iCheckTheSelectedVariantIsModified(false);	
		});
		
		opaTest("Check the width of FE rendered column having field groups", function (Given, When, Then) {
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheListReportPage
				.iCheckControlPropertiesById("FieldGroup:23FieldGroupColumn", { "visible": true, "width": "14rem" });
		});

		opaTest("Click on segmented button 2", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnSegmentedButton("_tab2");
			Then.onTheGenericListReport
				.theResultListContainsTheCorrectNumberOfItems(13);
		});

		opaTest("Click on segmented button 1", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnSegmentedButton("_tab1");
			Then.onTheGenericListReport
				.theResultListContainsTheCorrectNumberOfItems(7);
		});

		opaTest("Click a draft link in the ListReport", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheControlByControlType("sap.m.Link", { "visible": true, "text": "Draft" });
			Then.onTheGenericListReport
				.iShouldSeeThePopoverWithTitle("Draft");
		});

		opaTest("Click the unsaved changes link in the ListReport", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithIcon("sap-icon://decline")
				.and
				.iClickTheLink("Unsaved Changes by Cristian Croitoru");
			Then.onTheGenericListReport
				.iShouldSeeThePopoverWithTitle("Unsaved Changes");
		});

		opaTest("Create a new variant for the same filter field Currency Code, make it default with apply automatically set", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithIcon("sap-icon://decline")
				.and
				.iSetTheFilter({Field: "CurrencyCode", Value: "USD"})
				.and
				.iExecuteTheSearch();
		    Then.onTheGenericListReport
				.theResultListContainsTheCorrectNumberOfItems(0);
			Then.onTheListReportPage
				.iCheckTheSelectedVariantIsModified(true);	
			When.onTheListReportPage
				.iClickOnVariantById("PageVariant-vm");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Save As");
			When.onTheListReportPage
				.iEnterValueInField("Test", "template::PageVariant-vm-name")
				.and
				.iClickOnCheckboxWithText("Set as Default", "PageVariant-vm-default")
				.and
				.iClickOnCheckboxWithText("Apply Automatically", "PageVariant-vm-execute");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Save");
			Then.onTheListReportPage
				.theCorrectSmartVariantIsSelected("Test", "PageVariant-vm")
				.and
				.iCheckTheSelectedVariantIsModified(false);
		});

		opaTest("Navigate back to FLP and relaunch the app and check the custom variant and the filter selection", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheBackButtonOnFLP();
			When.onTheFLPPage
				.iClickTheControlByControlType("sap.m.GenericTile", { "visible": true, "header": "Sales Order with Segmented Buttons in FCL" });
			Then.onTheListReportPage
				.theCorrectSmartVariantIsSelected("Test", "PageVariant-vm")
				.and
				.iCheckTheSelectedVariantIsModified(false)
				.and
				.iCheckTheMultiInputFieldValues("listReportFilter-filterItemControl_BASIC-CurrencyCode", ["USD"]);
			Then.onTheGenericListReport
				.theHeaderExpandedPropertyIsCorrectlySet(true)
				.and
				.theResultListContainsTheCorrectNumberOfItems(0);
		});

		opaTest("Switch back to Standard variant and check the filter field Currency Code", function (Given, When, Then) {
		    When.onTheListReportPage
				.iClickOnVariantById("PageVariant-vm")
				.and
				.iSelectVariantByName("Standard", "PageVariant-vm")
				.and
				.iCheckTheSelectedVariantIsModified(false);
			When.onTheGenericListReport
				.iSetTheHeaderExpanded(true);
			When.onTheListReportPage
				.iCheckTheMultiInputFieldValues("listReportFilter-filterItemControl_BASIC-CurrencyCode", ["=EUR"]);
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible()
			    .and
				.theResultListContainsTheCorrectNumberOfItems(7)
				.and
				.iShouldSeeTheSegmentedButtonWithLabel("Expensive (7)");
		});

		opaTest("Delete the newly created variant", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickOnVariantById("PageVariant-vm");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Manage")
				.and
				.iClickTheButtonWithIcon("sap-icon://decline")
				.and
				.iClickTheButtonHavingLabel("Save");
			Then.onTheListReportPage
				.theCorrectSmartVariantIsSelected("Standard", "PageVariant-vm");
		});

		opaTest("Create a new page variant for the table personalisation changes", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Settings", "listReport")
				.and
				.iAddColumnFromP13nDialog("Changed At");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("OK");
			Then.onTheListReportPage
				.iCheckTableColumnVisibility("Changed At", true, "responsiveTable")
				.and
				.iCheckTheSelectedVariantIsModified(true);
			When.onTheListReportPage
				.iClickOnVariantById("PageVariant-vm");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Save As");
			When.onTheListReportPage
				.iEnterValueInField("Table_Changes", "template::PageVariant-vm-name")
				.and
				.iClickOnCheckboxWithText("Apply Automatically", "PageVariant-vm-execute");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Save");
			Then.onTheListReportPage
				.iCheckTheSelectedVariantIsModified(false)
				.and
				.theCorrectSmartVariantIsSelected("Table_Changes", "PageVariant-vm");
		});

		opaTest("Switch between standard and custom variant and check changes are reflecting", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickOnVariantById("PageVariant-vm")
				.and
				.iSelectVariantByName("Standard", "PageVariant-vm");
			Then.onTheListReportPage
				.iCheckTheSelectedVariantIsModified(false)
				.and
				.iCheckTableColumnVisibility("Changed At", false, "responsiveTable");
			When.onTheListReportPage
				.iClickOnVariantById("PageVariant-vm")
				.and
				.iSelectVariantByName("Table_Changes", "PageVariant-vm");
			Then.onTheListReportPage
				.iCheckTheSelectedVariantIsModified(false)
				.and
				.iCheckTableColumnVisibility("Changed At", true, "responsiveTable");
		});

		opaTest("Do an external navigation and come back and check the custom variant and the table personalisation changes", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickOnButtonWithText("To MultiEntity OP");
			Then.onTheGenericObjectPage
				.iSeeShellHeaderWithTitle("Sales Orders");
			When.onTheGenericObjectPage
				.iClickTheBackButtonOnFLP();
			When.onTheListReportPage
				.iWaitForThePageToLoad("ListReport", "C_STTA_SalesOrder_WD_20");
			Then.onTheListReportPage
				.iCheckTheSelectedVariantIsModified(false)
				.and
				.theCorrectSmartVariantIsSelected("Table_Changes", "PageVariant-vm");
			Then.onTheListReportPage
				.iCheckTableColumnVisibility("Changed At", true, "responsiveTable");
		});

		opaTest("Delete the newly created variant", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickOnVariantById("PageVariant-vm");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Manage")
				.and
				.iClickTheButtonWithIcon("sap-icon://decline")
				.and
				.iClickTheButtonHavingLabel("Save");
			Then.onTheListReportPage
				.theCorrectSmartVariantIsSelected("Standard", "PageVariant-vm");
		});

		opaTest("Navigate to MultiEntity App LR and check the default DynamicDateRange values are not retained", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickOnButtonWithText("To MultiEntity OP");
			Then.onTheGenericObjectPage
				.iSeeShellHeaderWithTitle("Sales Orders");
			Then.onTheListReportPage
				.iCheckControlPropertiesById("listReportFilter-filterItemControl_BASIC-DeliveryDate-input", { "visible": true, "value": "" })
				.and
				.iCheckControlPropertiesById("listReportFilter-filterItemControl_BASIC-UpdatedDate-input", { "visible": true, "value": "" });
		});

		opaTest("Navigate from LR to MultiEntity App OP", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheBackButtonOnFLP();
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iSelectListItemsByLineNo([3])
			When.onTheListReportPage
				.iClickOnButtonWithText("To MultiEntity OP");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000005");
			Then.onTheObjectPage
				.iCheckObjectPageEntitySet("C_STTA_SalesOrder_WD_20");
		});

		opaTest("Navigate from Sub-OP to MultiEntity App - OP of Item entity set", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheBackButtonOnFLP();
			Then.onTheGenericListReport
				.theResultListIsVisible();
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({ Field: "SalesOrder", Value: "500000000" });
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000000")
				.and
				.iShouldSeeTheSections(["Sales Order Items", "ProductTableReuse"]);
			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByFieldValue("to_Item", { Field: "SalesOrderItem", Value: "30" });
			Then.onTheGenericObjectPage
				.iShouldSeeTheSections(["General Information", "Schedule Lines"]);
			When.onTheGenericObjectPage
				.iSelectListItemsByLineNo([0], true, "to_SalesOrderItemSL::com.sap.vocabularies.UI.v1.LineItem::responsiveTable","C_STTA_SalesOrderItem_WD_20");
			When.onTheObjectPage
				.iClickOnButtonWithText("To MultiEntity OP(Item Entity)");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("30");
			Then.onTheObjectPage
				.iCheckObjectPageEntitySet("C_STTA_SalesOrderItem_WD_20");
			Then.iTeardownMyApp();
		});
	}
);
