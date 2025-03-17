sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order with Segmented Buttons - Create Dialog");

		opaTest("Starting the app - Check Data is loaded on App launch", function (Given, When, Then) {
            Given.iStartMyAppInDemokit("sttasalesordersb");
			When.onTheGenericListReport
				.iExecuteTheSearch()
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(7)
				.and
				.iShouldSeeTheSegmentedButtonWithLabel("Expensive (7)");	
		});

		opaTest("LR Create with Dialog - Enter the field values and create new object", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheControlWithId("ManageSalesOrderWithSegButtons::sap.suite.ui.generic.template.ListReport.view.ListReport::C_STTA_SalesOrder_WD_20--addEntry")
			Then.onTheListReportPage
				.iCheckFieldsAndTitleOfCreateObjectDialog("New Object", ["Sales Order ID", "ISO Currency Code", "Total Gross Amount"]);
			Then.onTheListReportPage
				.iCheckTheFieldValuesInsideCreateDialogIsCorrect({"Sales Order ID":"4711"});
			When.onTheListReportPage
				.iSetTheFieldValuesInsideCreateObjectDialog({"ISO Currency Code":"EUR", "Total Gross Amount":"6000"});
			Then.onTheListReportPage
				.iCheckTheFieldValuesInsideCreateDialogIsCorrect({"Sales Order ID":"4711", "ISO Currency Code":"EUR", "Total Gross Amount":"6,000.00"});
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Create");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("Object was created.")
				.and
				.theResultListContainsTheCorrectNumberOfItems(8);
		});

		opaTest("ApplicablePath - Select 1st sales order and check extension button enablement", function (Given, When, Then) {
			Then.onTheGenericListReport
				.theResultListFieldHasTheCorrectValue({ Line: 1, Field: "EnabledStatus", Value: false });
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([1]);
			Then.onTheGenericListReport
				.theButtonWithIdIsEnabled("EnableExt")
				.and
				.theOverflowToolBarButtonIsEnabled("Disable via Extension", false);
		});

		opaTest("ApplicablePath - Press Enable via Extension and check buttons and field", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithId("EnableExt");
			Then.onTheListReportPage
				.iCheckControlPropertiesById("DisableExt", { "text": "Disable via Extension", "visible": true, "enabled": true })
				.and
				.iCheckControlPropertiesById("EnableExt", { "text": "Enable via Extension", "visible": true, "enabled": false });
			Then.onTheGenericListReport
				.theResultListFieldHasTheCorrectValue({ Line: 1, Field: "EnabledStatus", Value: true });
			Then.iTeardownMyApp();
		});
	}
);