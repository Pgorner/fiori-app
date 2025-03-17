sap.ui.define([
    "sap/ui/test/opaQunit"],

function (opaTest) {
    "use strict";

    QUnit.module("Sales Order with Table Tabs - Create Dialog");

    opaTest("Starting the app and loading data", function (Given, When, Then) {
        Given.iStartMyAppInDemokit("sttasalesordertt");
        Then.onTheGenericListReport
            .theResultListIsVisible()
            .and
            .theResultListContainsTheCorrectNumberOfItems(3, 1);
        Then.onTheListReportPage
            .iCheckControlPropertiesByControlType("sap.m.IconTabHeader", {"selectedKey": "1"})
    });

    opaTest("Check the heading level value for the LR page title", function (Given, When, Then) {
        Then.onTheListReportPage
            .iCheckControlPropertiesByControlType("sap.m.Title", { "visible": true, "text": "List Report Custom Title", "level": "H2" });
    });

    opaTest("Check the heading level value for the LR table", function (Given, When, Then) {
        Then.onTheListReportPage
            .iCheckControlPropertiesById("listReport-1", { "visible": true, "header": "Sales Orders", "headerLevel": "H3" });
    });

    opaTest("Enter Search field value and trigger search and check the No data text for the tables in each tab", function (Given, When, Then) {
        When.onTheGenericListReport
            .iSetTheSearchField("Test");
        Then.onTheListReportPage
            .iCheckControlPropertiesById("responsiveTable-1", { "visible": true, "noDataText": "No Sales Order records found for the selected filter criteria and table view." });
        When.onTheGenericListReport
			.iClickOnIconTabFilter("2");
		Then.onTheListReportPage
            .iCheckControlPropertiesById("responsiveTable-2", { "visible": true, "noDataText": "No Sales Order records found for the selected filter criteria and table view." });
		When.onTheGenericListReport
			.iClickOnIconTabFilter("3");
		Then.onTheListReportPage
            .iCheckControlPropertiesById("responsiveTable-3", { "visible": true, "noDataText": "No Sales Order records found for the selected filter criteria and table view." });
    });

    opaTest("LR Create with Dialog - Enter the field values and create new object in tab 1", function (Given, When, Then) {
        When.onTheGenericListReport
            .iSetTheSearchField("")
            .and
            .iClickOnIconTabFilter("1");
        When.onTheListReportPage
             .iClickTheControlWithId("ManageSalesOrderWithTableTabs::sap.suite.ui.generic.template.ListReport.view.ListReport::C_STTA_SalesOrder_WD_20--addEntry-1")
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
            .theResultListContainsTheCorrectNumberOfItems(4, 1);
        Then.onTheListReportPage
            .iCheckControlPropertiesByControlType("sap.m.IconTabHeader", {"selectedKey": "1"});
        Then.iTeardownMyApp();

    });

    opaTest("LR Create with Dialog - Start the app again to check create new object in tab 2", function (Given, When, Then) {
        Given.iStartMyAppInDemokit("sttasalesordertt");
        When.onTheGenericListReport
			.iClickOnIconTabFilter("2");
        When.onTheListReportPage
             .iClickTheControlWithId("ManageSalesOrderWithTableTabs::sap.suite.ui.generic.template.ListReport.view.ListReport::C_STTA_SalesOrder_WD_20--addEntry-2")
        Then.onTheListReportPage
            .iCheckFieldsAndTitleOfCreateObjectDialog("New Object", ["Sales Order ID", "ISO Currency Code","Opportunity ID", "Total Gross Amount"]);
        Then.onTheListReportPage
            .iCheckTheFieldValuesInsideCreateDialogIsCorrect({"Sales Order ID":"4711"});
        When.onTheListReportPage
            .iSetTheFieldValuesInsideCreateObjectDialog({"ISO Currency Code":"EUR","Opportunity ID":"1234", "Total Gross Amount":"1000"});
        Then.onTheListReportPage
            .iCheckTheFieldValuesInsideCreateDialogIsCorrect({"Sales Order ID":"4711", "ISO Currency Code":"EUR", "Opportunity ID":"1234", "Total Gross Amount":"1,000.00"});
        When.onTheGenericListReport
            .iClickTheButtonOnTheDialog("Create");
        Then.onTheGenericListReport
            .iShouldSeeTheMessageToastWithText("Object was created.")
            .and
            .theResultListContainsTheCorrectNumberOfItems(7, 2);
        Then.onTheListReportPage
            .iCheckControlPropertiesByControlType("sap.m.IconTabHeader", {"selectedKey": "2"});
        Then.iTeardownMyApp();

    });
}
);
