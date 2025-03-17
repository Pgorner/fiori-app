sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Non Draft List Report - Data Loss Navigation");

			opaTest("Starting the app checking the initial no data text for the table", function (Given, When, Then) {
				// arrangements
				Given.iStartMyAppInSandbox("SalesOrder-nondraft#SalesOrder-nondraft");
				Then.onTheListReportPage
					.theSmartTableIsVisible("STTA_C_SO_SalesOrder_ND--listReport");
				Then.onTheListReportPage
					.iCheckControlPropertiesById("responsiveTable", { "visible": true, "noDataText": "To start, set the relevant filters and choose \"Go\"." });
			});

			opaTest("Checking the custom message over the LR", function (Given, When, Then) {
				When.onTheGenericListReport
					.iExecuteTheSearch();
				Then.onTheListReportPage
					.theSmartTableIsVisible("STTA_C_SO_SalesOrder_ND--listReport");
				Then.onTheListReportPage
					.iCheckMessageStripValueOnTable("STTA_C_SO_SalesOrder_ND--responsiveTable", "Information", "custom message above list report");
			});

			opaTest("Enter Search field value then trigger search and check the No data text for the table", function (Given, When, Then) {
				When.onTheGenericListReport
					.iSetTheSearchField("Test");
				Then.onTheListReportPage
					.iCheckControlPropertiesById("responsiveTable", { "visible": true, "noDataText": "No data found. Try adjusting the search or filter criteria." });
			});

			opaTest("Check the MultiSelect and SelectAll button for the responsive table on LR", function (Given, When, Then) {
				Then.onTheListReportPage
					.iCheckTableProperties({"visible": true, "mode": "MultiSelect", "multiSelectMode": "SelectAll"});
			});

			opaTest("Navigate to Object Page and press 'Edit' button, change a value and navigate back to the List Report", function (Given, When, Then) {
				When.onTheGenericListReport
					.iSetTheSearchField("")
			 		.and
					.iNavigateFromListItemByLineNo(2);
				When.onTheGenericObjectPage
					.iClickTheButtonHavingLabel("Edit")
					.and
					.iSetTheObjectPageDataField("GeneralInformation", "OpportunityID", "1111");
				When.onTheObjectPage
					.iClickTheControlWithId("backBtn", "Back");
				Then.onTheGenericObjectPage
					.iShouldSeeTheDialogWithTitle("Warning");
			});

			opaTest("Click button 'Leave Page' in dialog and navigate back to the List Report", function (Given, When, Then) {
				When.onTheGenericObjectPage
					.iClickTheButtonOnTheDialog("Leave Page");

				Then.onTheGenericListReport
					.theResultListFieldHasTheCorrectValue({Line:2, Field:"OpportunityID", Value:"JAMILA"})

			});

			opaTest("Set the BusinessPartnerID and Click On  Create Filter Dialog", function (Given, When, Then) {
				When.onTheGenericListReport
				.iSetTheFilter({Field:"BusinessPartnerID", Value:"100000000"})
				.and
				.iExecuteTheSearch();
				When.onTheGenericListReport
				.iClickTheButtonWithId("template::ListReport::TableToolbar-overflowButton")
				When.onTheListReportPage
					.iClickTheControlWithId("STTA_SO_ND::sap.suite.ui.generic.template.ListReport.view.ListReport::STTA_C_SO_SalesOrder_ND--template::ListReport::AddEntry")
					.and
					.iClickTheControlWithId("STTA_SO_ND::sap.suite.ui.generic.template.ListReport.view.ListReport::STTA_C_SO_SalesOrder_ND--template::addEntryWithFilter-unifiedmenu");
				Then.onTheListReportPage
					.iCheckFieldsAndTitleOfCreateObjectDialog("New Object", ["Business Partner ID", "Opportunity ID"]);
				Then.onTheGenericListReport
					.iShouldSeeTheButtonOnTheDialog("Create")
					.and
					.iShouldSeeTheButtonOnTheDialog("Cancel");
				Then.onTheListReportPage
					.iCheckTheFieldValuesInsideCreateDialogIsCorrect({"Business Partner ID":"100000000"});
				});

			opaTest("Create an Object through Create Filter Dialog", function (Given, When, Then) {
				When.onTheObjectPage
					.iSetTheFieldValuesInsideCreateObjectDialog({"Opportunity ID":"1234"});
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("Create");
				Then.onTheGenericListReport
					.iShouldSeeTheMessageToastWithText("Object was created.")
					.and
					.theAvailableNumberOfItemsIsCorrect(22);
			});

			opaTest("Check if the create buttons are rendered properly", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonWithId("template::ListReport::TableToolbar-overflowButton")
				When.onTheListReportPage
					.iClickTheControlWithId("STTA_SO_ND::sap.suite.ui.generic.template.ListReport.view.ListReport::STTA_C_SO_SalesOrder_ND--template::ListReport::AddEntry");
				Then.onTheGenericListReport
					.iShouldSeeTheMenuItemWithLabel("Create Object")
					.and
					.iShouldSeeTheMenuItemWithLabel("Create with Filters");
			});

			opaTest("Check if the Filter value is set in Create Dialog and Create Object", function (Given, When, Then) {
				When.onTheListReportPage
					.iClickTheControlWithId("STTA_SO_ND::sap.suite.ui.generic.template.ListReport.view.ListReport::STTA_C_SO_SalesOrder_ND--addEntry-unifiedmenu");
				Then.onTheListReportPage
					.iCheckFieldsAndTitleOfCreateObjectDialog("New Object", ["Business Partner ID", "Opportunity ID"]);
				Then.onTheListReportPage
					.iCheckTheFieldValuesInsideCreateDialogIsCorrect({"Business Partner ID":""});
				When.onTheObjectPage
					.iSetTheFieldValuesInsideCreateObjectDialog({"Business Partner ID":"100000000", "Opportunity ID":"5678"});
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("Create");
				Then.onTheGenericListReport
					.iShouldSeeTheMessageToastWithText("Object was created.")
					.and
					.theAvailableNumberOfItemsIsCorrect(23);
			});

		opaTest("Launch the Multi Edit Dialog and validate custom and standard fields and save via extension", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([1, 2]);
			When.onTheGenericListReport
				.iClickTheButtonWithId("template::ListReport::TableToolbar-overflowButton")
			When.onTheGenericListReport
				.iClickTheButtonWithId("template:::ListReportAction:::MultiEdit");
			Then.onTheListReportPage
				.iCheckControlPropertiesById("STTA_C_SO_SalesOrder_ND--RI_default", { "visible": true, "enabled": true, "value": 4 });
			When.onTheGenericListReport
				.iSetInputFieldWithId("STTA_SO_ND::sap.suite.ui.generic.template.ListReport.view.ListReport::STTA_C_SO_SalesOrder_ND--CustomInput", "Custom input value");
			When.onTheListReportPage
				.iSetSmartMultiEditField([
					{ Choice: "Replace", PropertyName: "BusinessPartnerID", Value: "100000011" },
					{ Choice: "Keep", PropertyName: "CurrencyCode" },
					{ Choice: "Index", PropertyName: "GrossAmount", Value: 3 },
					{ Choice: "Index", PropertyName: "NetAmount", Value: 3 },
				]);
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Save");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("BeforeMultiEditSaveExtension");
			Then.onTheGenericListReport
				.iSeeTheDialogWithContent("The value from custom input field is:Custom input value");
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Close");
			Then.onTheListReportPage
				.iCheckTheRowSelectionInTheTable([
					{ Index: 1, Selected: true },
					{ Index: 2, Selected: true }
				]);
			Then.onTheListReportPage
				.iCheckRenderedColumnTextOnNthRowOfTable(1, [1, 2, 4, 5, 6],
					["500000010", "100000000", "Peseta (777)", "15,637.790", "13,141.000"])
				.and
				.iCheckRenderedColumnTextOnNthRowOfTable(2, [1, 2, 4, 5, 6],
					["500000019", "100000000", "Peseta (EUR)", "3,972.220", "3,338.000"])
			Then.iTeardownMyApp();
		});

	}
);
