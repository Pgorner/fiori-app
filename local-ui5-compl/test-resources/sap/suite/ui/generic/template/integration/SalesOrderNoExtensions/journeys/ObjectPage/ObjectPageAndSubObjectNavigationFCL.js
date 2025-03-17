sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Navigations For Object Page and Sub Object Page - FCL");

		opaTest("Starting the app and loading the OP", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("STTASOWD20-STTASOWD20#STTASOWD20-STTASOWD20", "manifestFCL");
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iNavigateFromListItemByFieldValue({ Field: "SalesOrder", Value: "500000001" });
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000001");
		});

		opaTest("No discard draft popup appears on closing the OP in FCL when set to never in manifest", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iCloseTheObjectPage();
			Then.onTheGenericListReport
				.theListReportPageIsVisible();
		});

		opaTest("No discard draft popup appears on back navigation from OP to LR when set to never in manifest", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({ Field: "SalesOrder", Value: "500000001" });
			When.onTheGenericObjectPage
				.iClickTheBackButtonOnFLP();
			Then.onTheGenericListReport
				.theListReportPageIsVisible();
		});

		opaTest("ApplyButton: Navigate to Sub-Object page in 3 column layout and check the Apply button", function (Given, When, Then) {
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iNavigateFromListItemByFieldValue({ Field: "SalesOrder", Value: "500000001" });
			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByFieldValue("to_Item", {Field:"SalesOrderItem", Value:"20"});
			Then.onTheGenericObjectPage
				.iShouldSeeTheSections(["General Information","Schedule Lines"])
				.and
				.iShouldSeeTheButtonWithLabel("Apply");
		});

		opaTest("ApplyButton: Navigate Back to Object Page from Sub-Object Page", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonHavingLabel("Apply")
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsMidExpanded")
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000001");
		});

		opaTest("Check the Delete Item Dialog text when the item is deleted from the OP table", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectListItemsByLineNo([0],true, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			When.onTheObjectPage
				.iClickTheButtonOnTableToolBar("Delete", "to_Item::com.sap.vocabularies.UI.v1.LineItem::Table");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Delete item 20 (SalesOrderItem)?");
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel");
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("fullScreen");
			When.onTheObjectPage
				.iClickTheButtonOnTableToolBar("Delete", "to_Item::com.sap.vocabularies.UI.v1.LineItem::Table");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Delete item 20?");
		});


		opaTest("Check the Delete Item Dialog text when the item is deleted from the Sub Object page", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel");
			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByFieldValue("to_Item", {Field:"SalesOrderItem", Value:"20"})
				.and
				.iClickTheButtonWithId("delete", "C_STTA_SalesOrderItem_WD_20");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Delete item 20?");
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel");
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("exitFullScreen");
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("delete", "C_STTA_SalesOrderItem_WD_20");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Delete item 20 (SalesOrderItem)?");
		});

		opaTest("Check the Delete Object Dialog text when the Object is deleted from the Object page", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel");
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("closeColumn");
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("discard")
				.and
				.iClickTheButtonWithId("delete");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Delete this object (500000001 SalesOrder)?");
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel");
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("fullScreen");
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("delete");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Delete object 500000001?");
			Then.iTeardownMyApp();
		});

	}
);
