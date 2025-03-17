// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
	"sap/ui/test/opaQunit",
	"sap/ui/test/Opa5",
	"sap/ushell/test/opaTests/rta/Common",
	"sap/ushell/test/opaTests/rta/VariantsNavigationPage"
], function (
	opaTest,
	Opa5,
	Common
) {
	"use strict";

	/* global QUnit */

	Opa5.extendConfig({
		arrangements: new Common(),
		autoWait: true,
		asyncPolling: true,
		timeout: 90
	});

	QUnit.module("Variants Navigation");
	const sTitleId = "application-Worklist-display-component---object--ObjectPageHeaderTitle";
	const sVMControlId = "application-Worklist-display-component---object--variantManagementPage";
	const sNewVariantName = "NewVariantName";

	opaTest("Load the app and navigate to detail screen", function (Given, When, Then) {
		const sEncodedConnectorValue = encodeURI('[{"connector": "SessionStorageConnector"}]');
		// Arrangements
		Given.iStartTheApp({
			urlParameters: "sap-ui-flexibilityServices=" + sEncodedConnectorValue
		});
		Given.onPageWithRTA.clearRtaRestartSessionStorage(true);

		// Actions
		When.onPageWithVariantsNavigation.iSelectTheFirstObject();
		When.onPageWithRTA.iWaitUntilTheBusyIndicatorIsGone("mainShell", undefined);

		// Assertions
		Then.onPageWithVariantsNavigation.iShouldSeeTheAppElement(sTitleId);
	});

	opaTest("Start RTA on detail screen", function (Given, When, Then) {
		// Actions
		When.onPageWithRTA.iGoToMeArea()
		.and.iPressOnAdaptUi()
		.and.iWaitUntilTheBusyIndicatorIsGone("mainShell", undefined);

		// Assertions
		Then.onPageWithRTA.iShouldSeeTheToolbarAndTheLogo()
		.and.iShouldSeeTheOverlayForTheApp("application-Worklist-display-component---app", undefined);
	});

	opaTest("Duplicate variant and Exit RTA", function (Given, When, Then) {
		var sVMId = "application-Worklist-display-component---object--variantManagementPage";
		// Actions
		When.onPageWithRTA.iRightClickOnAnElementOverlay(sVMId)
		.and.iClickOnAContextMenuEntry(3);

		When.onPageWithVariantsNavigation.iEnterANewName(sNewVariantName)
		.and.iPressSave();

		When.onPageWithRTA.iExitRtaMode()
		.and.iWaitUntilTheBusyIndicatorIsGone("mainShell", undefined);

		// Assertions
		Then.onPageWithRTA.iShouldSeeTheVariantURLParameter();
		Then.iTeardownMyAppFrame();
	});

	opaTest("Restart the app, navigate to detail screen and check the Variant URL parameter is not present", function (Given, When, Then) {
		// Arrangements
		var sEncodedConnectorValue = encodeURI('[{"connector": "SessionStorageConnector"}]');
		Given.iStartTheApp({
			urlParameters: "sap-ui-flexibilityServices=" + sEncodedConnectorValue
		});

		// Actions
		When.onPageWithVariantsNavigation.iSelectTheFirstObject();
		When.onPageWithRTA.iWaitUntilTheBusyIndicatorIsGone("mainShell", undefined);

		// Assertions
		Then.onPageWithVariantsNavigation.iShouldSeeTheAppElement(sTitleId);
		Then.onPageWithRTA.iShouldNotSeeTheVariantURLParameter();
	});

	opaTest("Switch to duplicated view", function (Given, When, Then) {
		// Actions
		When.onPageWithVariantsNavigation.iClickOnAnElement(sVMControlId);
		When.onPageWithVariantsNavigation.iSwitchToView(1);

		// Assertions
		Then.onPageWithRTA.iShouldSeeTheVariantURLParameter();
	});

	// Waiting for incident 1880428993
	opaTest("Switch to default view - URL parameter should disappear", function (Given, When, Then) {
		// Actions
		When.onPageWithVariantsNavigation.iClickOnAnElement(sVMControlId);
		When.onPageWithVariantsNavigation.iSwitchToView(0);

		// Assertions
		Then.onPageWithRTA.iShouldNotSeeTheVariantURLParameter();
	});

	opaTest("Switch back to duplicated view", function (Given, When, Then) {
		// Actions
		When.onPageWithVariantsNavigation.iClickOnAnElement(sVMControlId);
		When.onPageWithVariantsNavigation.iSwitchToView(1);

		// Assertions
		Then.onPageWithRTA.iShouldSeeTheVariantURLParameter();
	});

	opaTest("Navigate back to list report screen and again forward to detail screen", function (Given, When, Then) {
		// Actions
		When.onPageWithVariantsNavigation.iClickOnAnElement("backBtn");
		When.onPageWithVariantsNavigation.iTriggerTheBrowserForwardEvent("application-Worklist-display-component---app");

		// Assertions
		Then.onPageWithVariantsNavigation.iShouldSeeTheAppElement(sTitleId)
		.and.iShouldSeeTheVariantName(sNewVariantName);
	});

	opaTest("Return to list report screen", function (Given, When, Then) {
		const oUShell = Opa5.getWindow().sap.ushell;
		oUShell._reloadChecker = true;
		// Actions
		When.onPageWithVariantsNavigation.iClickOnAnElement("backBtn");

		// Assertions
		Then.onPageWithVariantsNavigation.noReloadShouldHaveHappened();

		Then.iTeardownMyAppFrame();
	});

	opaTest("Restart the app with Variant URL parameter, navigate to detail screen and check the Variant URL parameter is present", function (Given, When, Then) {
		// Arrangements
		Given.iAddTheVariantURLParameter();
		Given.iStartTheApp({
			hash: "?sap-ui-fl-control-variant-id=" + Opa5.getContext().variantId,
			urlParameters: "sap-rta-lrep-storage-type=sessionStorage"
		});

		// Actions
		When.onPageWithVariantsNavigation.iSelectTheFirstObject();
		When.onPageWithRTA.iWaitUntilTheBusyIndicatorIsGone("mainShell", undefined);

		// Assertions
		Then.onPageWithVariantsNavigation.iShouldSeeTheAppElement(sTitleId);
		Then.onPageWithRTA.iShouldSeeTheVariantURLParameter();

		Then.iTeardownMyAppFrame();
	});
});
