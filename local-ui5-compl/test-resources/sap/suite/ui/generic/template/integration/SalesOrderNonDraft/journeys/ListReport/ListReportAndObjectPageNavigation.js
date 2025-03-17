sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Non Draft List Report: LR & OP Navigation");

		opaTest("Starting the app loading the data", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("SalesOrder-nondraft#SalesOrder-nondraft", "manifestReuse");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible();
		});

		opaTest("Check Add Card to Insights button is hidden on the LR table toolbar", function (Given, When, Then) {
			Then.onTheGenericListReport
				.iShouldNotSeeTheButtonWithIdInToolbar("template::ListReport::TableToolbar", "template::AddCardtoInsights");
		});

		opaTest("Check the heading level value for the LR page variant", function (Given, When, Then) {
			Then.onTheListReportPage
				.iCheckControlPropertiesById("PageVariant", { "visible": true, "headerLevel": "H2" });
		});

		opaTest("Check the heading level value for the LR table", function (Given, When, Then) {
			Then.onTheListReportPage
				.iCheckControlPropertiesById("listReport", { "visible": true, "header": "Sales Orders", "headerLevel": "H3" });
		});

		opaTest("Check the Delete button is not available on the table toolbar in case of in-line delete", function (Given, When, Then) {
			When.onTheListReportPage
				.iLookAtTheScreen();
			Then.onTheGenericListReport
				.iShouldNotSeeTheButtonWithIdInToolbar("template::ListReport::TableToolbar","deleteEntry");
		});

		opaTest("Check the width of FE rendered column having field groups", function (Given, When, Then) {
			When.onTheListReportPage
				.iLookAtTheScreen();
			Then.onTheListReportPage
				.iCheckControlPropertiesById("FieldGroup:23FieldGroupColumn", { "visible": true, "width": "auto" });
		});

		opaTest("Check the in-line delete action", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickDeleteButtonOnNthRowOfTable(1);
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithContent("Delete object 500000010?");
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Delete");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("Object was deleted.")
				.and
				.theAvailableNumberOfItemsIsCorrect("1,079");
		});

		opaTest("Navigating to the Object Page", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheItemInResponsiveTable(1);
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000012");
		});

		opaTest("Navigating to the Sub-ObjectPage and check the Object Page table selection is retained", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectListItemsByLineNo([0], true, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iNavigateFromObjectPageTableByLineNo("to_Item", 0)
				.and
				.iNavigateUpOrDownUsingObjectPageHeaderActionButton("NavigationDown","STTA_C_SO_SalesOrderItem_ND")
				.and
				.iClickTheLastBreadCrumbLink();
			Then.onTheGenericObjectPage
				.theListItemIsSelected("to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable", 0);

		});

		opaTest("Enter Edit mode of Non Draft object", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			Then.onTheGenericObjectPage
				.theObjectPageIsInEditMode();
			Then.onTheGenericObjectPage
				.theObjectPageDataFieldHasTheCorrectValue({
					Field  : "OpportunityID",
					Value : "JAMILA"
				})
				.and
				.theButtonWithLabelIsEnabled("Save", true);
		});

		opaTest("Discard Changes in Non Draft", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSetTheObjectPageDataField("GeneralInformation","OpportunityID","2222")
				.and
				.iClickTheButtonWithId("cancel")
				.and
				.iClickTheButtonWithId("DiscardDraftConfirmButton");
			Then.onTheGenericObjectPage
				.theObjectPageDataFieldHasTheCorrectValue({
					Field  : "OpportunityID",
					Value : "JAMILA"
				});
		});

		opaTest("Navigating back to the List Report", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iCloseTheObjectPage();
			Then.onTheListReportPage
				.theSmartTableIsVisible("STTA_C_SO_SalesOrder_ND--listReport");
		});

		opaTest("Share Button Rendering on List Report", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheControlWithId("template::Share-internalBtn");
			Then.onTheListReportPage
				.iCheckControlPropertiesById("shareEmailButton-unifiedmenu", {"visible": true});
		});

		opaTest("Click Create focus should set on first editable Input Field ", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Create");
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "STTA_C_SO_SalesOrder_ND");
			Then.onTheGenericObjectPage
				.iShouldSeeTheSections(["General Information"])
				.and
				.iExpectFocusSetOnControlById("com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformation::BusinessPartnerID::Field-input");
		});

		opaTest("Check Create button on the OP create page", function (Given, When, Then) {
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheGenericObjectPage
				.theButtonWithLabelIsEnabled("Create", true);
		});

		opaTest("Check the toast message and navigation to LR after save", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSetTheObjectPageDataField("GeneralInformation", "BusinessPartnerID", "100000000")
				.and
				.iSetTheObjectPageDataField("GeneralInformation", "CurrencyCode", "EUR")
				.and
				.iSaveTheDraft(true);
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("Object was created.")
				.and
				.theListReportPageIsVisible()
				.and
				.theResultListIsVisible();
			Then.iTeardownMyApp();
		});

		opaTest("External navigation in create mode", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("SalesOrder-nondraft,SalesOrder-MultiViews#SalesOrder-nondraft");
			When.onTheListReportPage
				.iClickOnButtonWithText("Sales Order-MES(Ext nav to createMode)");
			Then.onTheObjectPage
				.iCheckObjectPageEntitySet("C_STTA_SO_BPAContact");
			Then.iTeardownMyApp();
		});
	}
);
