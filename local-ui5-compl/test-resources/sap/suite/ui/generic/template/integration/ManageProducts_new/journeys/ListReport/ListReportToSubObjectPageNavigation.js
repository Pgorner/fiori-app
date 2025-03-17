sap.ui.define(["sap/ui/test/opaQunit",
	"sap/ui/test/Opa5"],
	function (opaTest) {
		"use strict";

		QUnit.module("Journey - ManageProducts - Direct Navigation from List Report to SubObject Page");

		if (sap.ui.Device.browser.safari) {
			opaTest("Safari detected - SKIPPED", function (Given, When, Then) {
				Opa5.assert.expect(0);
			});
		} else {

		opaTest("Navigation not configured message is displayed", function (Given, When, Then) {
            Given.iStartMyAppInSandboxWithNoParams("#EPMProduct-manage_st");
			When.onTheGenericListReport
				.iSetTheFilter({
					Field: "Product",
					Value: "HT-1002"
				})
				.and
				.iExecuteTheSearch();

			Then.onTheListReportPage
				.theResponsiveTableContainsTheCorrectItems({
					Product: "HT-1002"
				});

			When.onTheGenericListReport
				.iClickTheLink("NavToSubObjectPage");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithContent("Navigation has not been configured");
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Close");

		});

		opaTest("Navigate directly to SubObject page", function (Given, When, Then) {
			// clear the exiting filter and set new value
			When.onTheGenericListReport
				.iSetTheFilter({
					Field: "Product",
					Value: "HT-1000"
				}).and
				.iExecuteTheSearch();

			Then.onTheListReportPage
				.theResponsiveTableContainsTheCorrectItems({
					Product: "HT-1000"
				});

			When.onTheGenericListReport
				.iClickTheLink("NavToSubObjectPage");

			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("Notebook Basic 15")
				.and
				.iShouldSeeTheSections(["General Information", "Technical reuse component for state testing"]);

		});

		opaTest("Navigate back to the List Report", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateBack(); // Navigate from Sub Object page to List Report
			Then.onTheGenericListReport
				.theResultListIsVisible();
		});

		opaTest("Check for DataFieldWithNavigationPath Record navigation ", function (Given, When, Then) {
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iNavigateFromListItemByLineNo(0);
			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByLineNo("to_ProductText", 0);
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("Notebook Basic 15")
				.and
				.iSeeShellHeaderWithTitle("Product Text");
			Then.onTheObjectPage
				.iCheckObjectPageEntitySet("STTA_C_MP_ProductText");
			When.onTheGenericObjectPage
				.iClickTheLink("Notebook Basic 15 (HT-1000)");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("Notebook Basic 15")
				.and
				.iSeeShellHeaderWithTitle("Product");
			Then.onTheObjectPage
				.iCheckObjectPageEntitySet("STTA_C_MP_Product");
			Then.iTeardownMyApp();

		});
		opaTest("ForwardNavigationProperty navigate to NavigationProperty defined in manifest", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttaproducts","manifestForwardNavigationProperty");
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iNavigateFromListItemByLineNo(3);
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("Notebook Basic 15")
				.and
				.iShouldSeeTheSections(["General Information", "Technical reuse component for state testing"]);
			Then.onTheObjectPage
				.iCheckObjectPageEntitySet("STTA_C_MP_ProductText");
		});

		opaTest("Navigate back to the List Report", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateBack();
			Then.onTheGenericListReport
				.theListReportPageIsVisible();
			Then.iTeardownMyApp();
		});

		opaTest("ForwardNavigationProperty 1toN navigate to NavigationProperty defined in manifest", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttaproducts","manifestForward1ToNNavigationProperty");
			When.onTheGenericListReport
				.iClickTheButtonWithLabel("Go");
			When.onTheListReportPage
				.iClickTheItemInResponsiveTable(0);

			Then.onTheObjectPage
				.iCheckObjectPageEntitySet("STTA_C_MP_Product");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("基础版笔记本电脑 17")
				.and
				.iShouldSeeTheSections(["General Information", "Sales Data"]);

			When.onTheGenericObjectPage
				.iNavigateBack();

			When.onTheListReportPage
				.iClickTheItemInResponsiveTable(1);

			Then.onTheObjectPage
				.iCheckObjectPageEntitySet("STTA_C_MP_Product");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("基础版笔记本电脑 17")
				.and
				.iShouldSeeTheSections(["General Information", "Sales Data"]);
		});

		opaTest("Navigate back to the List Report", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateBack();
			Then.onTheGenericListReport
				.theResultListIsVisible();
			Then.iTeardownMyApp();
		});
	}
	}
);
