sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
	function (opaTest, Opa5) {
		"use strict";

		QUnit.module("Sales Order No Extensions - List Report: External Navigation to FCL app");

		opaTest("Launching the app and navigate to OP", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("STTASOWD20-STTASOWD20,BusinessPartner-displayFactSheet#STTASOWD20-STTASOWD20", null, { "bWithPlaceHolder": true });
			When.onTheGenericListReport
				.iLookAtTheScreen();
			// Then.onTheListReportPage
			// 	.iCheckPlaceholderIsPresent("sap.fe.placeholder.view.PlaceholderLR"); 
			When.onTheGenericListReport
				.iExecuteTheSearch();
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({ Field: "SalesOrder", Value: "500000001" });
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000001");
		});

		opaTest("Check for discard draft confirmation popup on making an external navigation", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheLink("100000004");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Warning")
				.and
				.iShouldSeeTheDialogWithContent("You've made changes to this object.\nWhat would you like to do?");
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel");
			Then.onTheGenericObjectPage
				.theObjectPageIsInEditMode();
		});
		opaTest("Keep the Draft from the discard draft confirmation pop up and check the draft is retained", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheBackButtonOnFLP();
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Warning")
				.and
				.iShouldSeeTheDialogWithContent("You've made changes to this object.\nWhat would you like to do?");
			When.onTheGenericObjectPage
				.iSelectTheOptionFromDiscardDraftPopUp("Keep Draft")
				.and
				.iClickTheButtonOnTheDialog("OK");
			Then.onTheGenericListReport
				.theListReportPageIsVisible()
				.and
				.theResultListFieldHasTheCorrectObjectMarkerEditingStatus({
					Line: 1,
					Field: "SalesOrder",
					Value: "Draft"
				});
		});

		opaTest("Check Destination app loads in fullscreen when FCL configured when navigated from a source app and check Placeholder", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSetTheSearchField("500000000")
				.and
				.iClickTheLink("100000000");
			// Then.onTheObjectPage
			// 	.iCheckPlaceholderIsPresent("sap.fe.placeholder.view.PlaceholderOP");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("100000000");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("MidColumnFullScreen");
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("exitFullScreen");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsBeginExpanded");
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("closeColumn");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("OneColumn");
			Then.iTeardownMyApp();
		});
	}
);
