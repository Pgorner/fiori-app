sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
	function(opaTest, Opa5) {
		"use strict";

		QUnit.module("ObjectPageHeaderType Dynamic with No VendorLayer");

		if (sap.ui.Device.browser.safari) {
			opaTest("Safari detected - SKIPPED", function (Given, When, Then) {
				Opa5.assert.expect(0);
			});
		} else {

		opaTest("The save button is not rendered in Adapt filters", function(Given, When, Then) {
			Given.iStartMyAppInDemokit("sttaproducts#/STTA_C_MP_Product(Product='HT-1000',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)", "manifest_objectPageHeaderType_Dynamic_NoVendorLayer", {"sapUiLayer": "VENDOR"});
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iClickTheButtonWithId("listReportFilter-btnFilters");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Adapt Filters");
			Then.onTheListReportPage
				.theButtonWithIdInControlTypeIsNotVisible("listReportFilter-btnSaveFilterDialog", "sap.m.AssociativeOverflowToolbar");

		});

		opaTest("Click cancel to close adapt filters Dialog and check Dynamic header & pin header is rendered correctly", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Cancel");
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(125);
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("Notebook Basic 15")
				.and
				.iShouldNotSeeTheControlWithId("template::ObjectPage::ObjectPageVariant")
				.and
				.iShouldSeeTheButtonWithId("objectPage-OPHeaderContent-collapseBtn")
				.and
				.iShouldSeeTheButtonWithId("objectPage-OPHeaderContent-pinBtn");
			Then.onTheObjectPage
				.iCheckControlPropertiesById("objectImage", {"displayShape": "Square"})
				.and
				.theObjectMarkerIsInContentAggregation()
				.and
				.theLayoutActionsShouldBeSeparatedFromGlobalActions()
				.and
				.iCheckControlPropertiesById("objectPage", {"toggleHeaderOnTitleClick": true});

		});

		opaTest("The Expand Header Button is correctly rendered", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("objectPage-OPHeaderContent-collapseBtn");
			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithId("template::ObjectPage::ObjectPageHeader-expandBtn");
			Then.iTeardownMyApp();
		});
	}
	}
);
