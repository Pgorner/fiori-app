/* global QUnit */
sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'sap/ui/comp/qunit/personalization/opaTests/Arrangement',
	'sap/ui/comp/qunit/personalization/opaTests/Action',
	'sap/ui/comp/qunit/personalization/opaTests/Assertion',
	"applicationUnderTestContactAnnotation/test/pages/ContactAnnotation",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function(
	Opa5,
	opaTest,
	Arrangement,
	Action,
	Assertion

) {
	'use strict';

	if (window.blanket) {
		//window.blanket.options("sap-ui-cover-only", "sap/ui/comp");
		window.blanket.options("sap-ui-cover-never", "sap/viz");
	}

	Opa5.extendConfig({
		arrangements: new Arrangement(),
		actions: new Action(),
		assertions: new Assertion()
	});

	QUnit.module("ContactAnnotation");

	opaTest("When I look at the screen, a table with SmartLinks should appear", function(Given, When, Then) {
		Given.iStartMyUIComponentInViewMode("applicationUnderTestContactAnnotation");

		When.iLookAtTheScreen();

		Then.iShouldSeeVisibleColumnsInOrder("sap.m.Column", [
			"Product ID", "Product Name", "Supplier ID", "Empty ID"
		]);
		Then.onTheContactAnnotationPage.iShouldSeeTheColumnInATable("Product ID");
		Then.onTheContactAnnotationPage.iShouldSeeTheColumnInATable("Product Name");
		Then.onTheContactAnnotationPage.iShouldSeeTheColumnInATable("Supplier ID");
		Then.onTheContactAnnotationPage.iShouldSeeTheColumnInATable("Empty ID");
	});

	opaTest("When I click on '1239102' link in the 'Product ID' column, popover should show contact annotation", function(Given, When, Then) {
		When.onTheSmartLink.iPressTheLink({text: "1239102"});

		Then.onTheSmartLink.iShouldSeeAPopover({text: "1239102"});
		Then.onTheContactAnnotationPage.contactInformationExists();
		Then.onTheSmartLink.iShouldSeeLinksOnPopover({text: "1239102"}, [
			"Alpha", "Beta"
		]);

		When.onTheSmartLink.iCloseThePopover();
	});

	opaTest("When I click on 'Power Projector 4713' link in the 'Product Name' column, popover should show contact annotation", function(Given, When, Then) {
		When.onTheSmartLink.iPressTheLink({text: "Power Projector 4713"});

		Then.onTheSmartLink.iShouldSeeAPopover({text: "Power Projector 4713"});
		Then.onTheContactAnnotationPage.contactInformationExists();
		Then.onTheSmartLink.iShouldSeeLinksOnPopover({text: "Power Projector 4713"}, [
			"Alpha", "Beta"
		]);

		When.onTheSmartLink.iCloseThePopover();
	});

	opaTest("When I click on '1234567890.0' link in the 'Supplier ID' column, popover should show contact annotation", function(Given, When, Then) {
		When.onTheSmartLink.iPressTheLink({text: "1234567890.0"});

		Then.onTheSmartLink.iShouldSeeAPopover({text: "1234567890.0"});
		Then.onTheContactAnnotationPage.contactInformationExists();
		Then.onTheSmartLink.iShouldSeeLinksOnPopover({text: "1234567890.0"}, [
			"Alpha", "Beta"
		]);

		When.onTheSmartLink.iCloseThePopover();
	});

	opaTest("When I click on 'ABC' link in the 'Empty ID' column, popover should not show contact annotation", function(Given, When, Then) {
		When.onTheSmartLink.iPressTheLink({text: "ABC"});

		Then.onTheSmartLink.iShouldSeeAPopover({text: "ABC"});
		Then.onTheSmartLink.iShouldSeeLinksOnPopover({text: "ABC"}, [
			"Alpha", "Beta"
		]);

		When.onTheSmartLink.iCloseThePopover();
		Then.iTeardownMyUIComponent();
	});
});
