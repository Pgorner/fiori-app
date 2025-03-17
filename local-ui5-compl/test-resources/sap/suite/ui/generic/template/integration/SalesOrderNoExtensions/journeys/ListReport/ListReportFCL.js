sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order No Extensions - FCL");

		opaTest("Starting the app and loading data and check placeholders", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("STTASOWD20-STTASOWD20#STTASOWD20-STTASOWD20", "manifestFCL", { "bWithPlaceHolder": true });
			// Then.onTheListReportPage
			// 	.iCheckPlaceholderIsPresent("sap.fe.placeholder.view.PlaceholderLR");
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iNavigateFromListItemByLineNo(3);
			// Then.onTheObjectPage
			// 	.iCheckPlaceholderIsPresent("sap.fe.placeholder.view.PlaceholderOP");
			Then.onTheListReportPage
				.iShouldSeeTheNavigatedRowHighlighted(3, true)
				.and
				.iShouldSeeTheNavigatedRowHighlighted(2, false);
		});

		opaTest("Check the Delete Object Dialog text in When the App is in Split Screen mode", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([0])
				.and
				.iClickTheButtonWithId("template::ListReport::TableToolbar-overflowButton")
				.and
				.iClickTheButtonWithId("deleteEntry");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithContent("Delete this object (500000000 SalesOrder)?");
		});

		opaTest("Check the Delete Object Dialog text in When the App is in Full Screen mode", function (Given, When, Then) {

			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Cancel");
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("closeColumn");
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Delete", "listReport");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithContent("Delete object 500000000?");
			Then.iTeardownMyApp();
		});
	}
);
