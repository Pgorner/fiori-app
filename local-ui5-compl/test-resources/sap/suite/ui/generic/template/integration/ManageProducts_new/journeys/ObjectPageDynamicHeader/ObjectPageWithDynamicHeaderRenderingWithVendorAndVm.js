sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
	function(opaTest, Opa5) {
		"use strict";

		QUnit.module("ObjectPageHeaderType Dynamic with VendorLayer with VM");

		if (sap.ui.Device.browser.safari) {
			opaTest("Safari detected - SKIPPED", function (Given, When, Then) {
				Opa5.assert.expect(0);
			});
		} else {

		opaTest("The Dynamic header & pin header button is rendered correctly", function(Given, When, Then) {
			Given.iStartMyAppInDemokit("sttaproducts#/STTA_C_MP_Product(Product='HT-1000',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)", "manifest_objectPageHeaderType_Dynamic_VendorLayer", {"sapUiLayer": "VENDOR"});
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheObjectPage
				.iCheckControlPropertiesById("objectImage", {"displayShape": "Square"})
				.and
				.theObjectMarkerIsInContentAggregation()
				.and
				.theLayoutActionsShouldBeSeparatedFromGlobalActions()
				.and
				.iCheckControlPropertiesById("objectPage", {"toggleHeaderOnTitleClick": true});
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("Notebook Basic 15")
				.and
				.iShouldSeeTheControlWithId("template::ObjectPage::ObjectPageVariant")
				.and
				.iShouldSeeTheButtonWithId("objectPage-OPHeaderContent-collapseBtn")
				.and
				.iShouldSeeTheButtonWithId("objectPage-OPHeaderContent-pinBtn");
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
