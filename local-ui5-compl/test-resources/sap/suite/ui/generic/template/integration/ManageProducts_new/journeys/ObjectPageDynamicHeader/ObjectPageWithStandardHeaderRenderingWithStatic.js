sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
	function(opaTest, Opa5) {
		"use strict";

		QUnit.module("ObjectPageHeaderType Static Irrespective of Layer:");

		if (sap.ui.Device.browser.safari) {
			opaTest("Safari detected - SKIPPED", function (Given, When, Then) {
				Opa5.assert.expect(0);
			});
		} else {

		opaTest("The Dynamic header is rendered correctly", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttaproducts#/STTA_C_MP_Product(Product='HT-1000',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)", "manifest_objectPageHeaderType_Static_IrrespectiveOfLayer", {"sapUiLayer": "VENDOR"});
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("Notebook Basic 15")
				.and
				.iShouldNotSeeTheControlWithId("template::ObjectPage::ObjectPageHeader")
				.and
				.iShouldNotSeeTheControlWithId("template::ObjectPage::ObjectPageVariant");
			Then.iTeardownMyApp();
		});
	}
	}
);
