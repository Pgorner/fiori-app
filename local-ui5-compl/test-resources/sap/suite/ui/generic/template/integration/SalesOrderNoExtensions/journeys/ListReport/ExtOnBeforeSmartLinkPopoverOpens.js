sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
	function (opaTest, Opa5) {
		"use strict";

		QUnit.module("Sales Order No Extensions - List Report/Object Page : onBeforeSmartLinkPopoverOpensExtension testing");

		opaTest("ListReport onBeforeSmartLinkPopoverOpens extension testing ", function (Given, When, Then) {
			Given.iStartMyAppInSandboxWithNoParams("#STTASOWD20-STTASOWD20");
			When.onTheListReportPage
				.iWaitForThePageToLoad("ListReport", "C_STTA_SalesOrder_WD_20");
			When.onTheGenericListReport
				.iClickTheShowDetailsButtonOnTheTableToolBar();
			When.onTheGenericListReport
				.iClickTheLink("100000000", 2);
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Yes");
			Then.onTheGenericObjectPage
				.iSeeShellHeaderWithTitle("Business Partner");
			When.onTheGenericObjectPage
				.iNavigateBack();
			When.onTheGenericListReport
				.iClickTheShowDetailsButtonOnTheTableToolBar();
			When.onTheGenericListReport
				.iClickTheLink("100000000", 2);
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("No");
			Then.onTheGenericListReport
				.iSeeShellHeaderWithTitle("Sales Order w/o Extensions");

		});

		opaTest("ObjectPage onBeforeSmartLinkPopoverOpens extension testing ", function (Given, When, Then) {
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iNavigateFromListItemByLineNo(0);
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000000")
			When.onTheGenericObjectPage
				.iClickTheShowDetailsButtonOnTheTableToolBar("to_Item");
			When.onTheGenericListReport
				.iClickTheLink("HT-1010", 2);
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Yes");
			Then.onTheGenericObjectPage
				.iSeeShellHeaderWithTitle("Product");
			When.onTheGenericObjectPage
				.iNavigateBack();
			When.onTheGenericObjectPage
				.iClickTheShowDetailsButtonOnTheTableToolBar("to_Item");
			When.onTheGenericListReport
				.iClickTheLink("HT-1010", 2);
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("No");
			Then.onTheGenericObjectPage
				.iSeeShellHeaderWithTitle("Sales Order");
			Then.iTeardownMyApp();
		});


	}
);
