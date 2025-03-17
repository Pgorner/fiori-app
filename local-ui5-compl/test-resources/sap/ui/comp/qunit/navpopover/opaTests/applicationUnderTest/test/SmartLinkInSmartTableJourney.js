/* globals QUnit */

sap.ui.define([
	'sap/ui/test/opaQunit',
	'applicationUnderTest/test/Util',
	'test-resources/sap/ui/comp/testutils/opa/smartlink/Assertions',
	'test-resources/sap/ui/comp/testutils/opa/TestLibrary'
], function(
	opaTest,
	ApplicationUnderTestUtil,
	SmartLinkAssertions
) {
	"use strict";

	ApplicationUnderTestUtil.windowBlanket();
	ApplicationUnderTestUtil.extendConfig({
		assertions: SmartLinkAssertions
	});

	QUnit.module("SmartLink in SmartTable: SemanticObject as Path");

	opaTest("I should see a disabled link 'Webcam'", (Given, When, Then) => {
		Given.iStartMyUIComponentInViewMode("applicationUnderTest");
		Given.iClearTheLocalStorageFromRtaRestart();

		Then.iShouldSeeDisabledLink({ text: "Webcam" });
	});

	opaTest("I should see a 'No content available' Title when I click on the 'USB Stick 16 GByte' link", (Given, When, Then) => {
		When.onTheSmartLink.iPressTheLink({ text: "USB Stick 16 GByte" });

		Then.iShouldSeeAPopover({ text: "USB Stick 16 GByte" });
		Then.iShouldSeeNoContentAvailable({ text: "USB Stick 16 GByte" });
	});

	opaTest("I should see links of the SemanticObject 'Name' when I click on the 'Power Projector 4713' link", (Given, When, Then) => {
		When.onTheSmartLink.iPressTheLink({ text: "Power Projector 4713" });

		Then.iShouldSeeAPopover({ text: "Power Projector 4713" });
		Then.onTheSmartLink.iShouldSeeLinksOnPopover({ text: "Power Projector 4713" }, [
			"Name Link2"
		]);
	});

	opaTest("I should see links of the SemanticObject 'Category' when I click on the 'Hurricane GX' link", (Given, When, Then) => {
		When.onTheSmartLink.iPressTheLink({ text: "Hurricane GX" });

		Then.iShouldSeeAPopover({ text: "Hurricane GX" });
		Then.onTheSmartLink.iShouldSeeLinksOnPopover({ text: "Hurricane GX" }, [
			"Category Link2"
		]);

		Then.iTeardownMyUIComponent();
	});

});