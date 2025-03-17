/*global QUnit */

sap.ui.define([
	"sap/ui/demoapps/rta/test/integration/IFrameContent/Common",
	"sap/ui/test/opaQunit",
	"sap/ui/test/Opa5"
], function(
	IFrameCommon,
	opaTest,
	Opa5
) {
	"use strict";

	QUnit.module("IFrame");

	const sAppContentId = "application-product-display-component---appRootView--appContent";
	const sSearchFieldId = "sap.ui.demoapps.rta.fev4::ProductsList--fe::FilterBar::Products::BasicSearchField-inner";
	const sProductPageId = "application-product-display-component---appRootView";
	const sSectionTitle = "My New Title";

	opaTest("Load the app and navigate to product page", function(Given, When, Then) {
		const sProductHash = "";
		const sEncodedConnectorValue = encodeURI('[{"connector": "SessionStorageConnector"}]');

		// Arrangements
		Given.iStartTheApp({
			hash: sProductHash,
			urlParameters: "sap-ui-flexibilityServices=" + sEncodedConnectorValue
		});
		Given.onPageWithRTA.clearRtaRestartSessionStorage();
		Given.onPageWithRTA.clearChangesFromSessionStorage();

		// Actions
		When.onFioriElementsPage.iClickOnMDCTableLineItem(IFrameCommon.product1OfficeSupplies)
			.and.iWaitUntilTheBusyIndicatorIsGone("mainShell", undefined);

		// Assertions
		Then.onFioriElementsPage.iAmOnProductPage(sProductPageId);
	});

	opaTest("Start RTA", function(Given, When, Then) {
		// Actions
		When.onPageWithRTA.iGoToMeArea()
			.and.iPressOnAdaptUi()
			.and.iWaitUntilTheBusyIndicatorIsGone("mainShell", undefined);

		// Assertions
		Then.onPageWithRTA.iShouldSeeTheToolbar()
			.and.iShouldSeeTheOverlayForTheApp(sAppContentId, undefined);
	});

	opaTest("I press on Embed Content: as header", function(Given, When, Then) {
		const sHeaderElementID = "sap.ui.demoapps.rta.fev4::ProductsObjectPage--fe::HeaderContentContainer";

		// Actions
		When.onPageWithRTA.iSwitchToAdaptationMode()
			.and.iRightClickOnAnElementOverlay(sHeaderElementID)
			.and.iClickOnAContextMenuEntry(1);

		//Assertions
		Then.onPageWithIFrame.iShouldSeeTheIFrameDialog();
	});

	opaTest("On the Dialog, I add a boolean parameter (isPreferred) to an URL and press Preview", function(Given, When, Then) {
		// Actions
		When.onIFrameDialog.iEnterUrlOnTextArea(IFrameCommon.URLTextAreaId, "https://www.example.com/");
		When.onIFrameDialog.iClickOnAParameterInTheTable("isPreferred");
		When.onIFrameDialog.iClickOnTheShowPreviewButton();

		//Assertions
		//In V4 Models, a boolean parameter is automatically resolved to e.g. "yes/no" if the system is in English
		//This test ensures that we resolve to the technical value on the URL
		Then.onIFrameDialog.iShouldSeeThePreviewURL("https://www.example.com/false");
	});

	opaTest("On the Dialog, I enter a URL with parameter (Product) and press Preview", function(Given, When, Then) {
		// Actions
		When.onIFrameDialog.iEnterUrlOnTextArea(IFrameCommon.URLTextAreaId, IFrameCommon.identifierParameterURL);
		When.onIFrameDialog.iEnterHeightOnInputField(IFrameCommon.heightFieldId, "10");
		When.onIFrameDialog.iClickOnTheShowPreviewButton();

		//Assertions
		Then.onIFrameDialog.iShouldSeeThePreview(IFrameCommon.product1OfficeSuppliesURL, IFrameCommon.product1OfficeSupplies);
	});

	opaTest("I press Save on the New IFrame dialog", function(Given, When, Then) {
		// Actions
		When.onIFrameDialog.iClickOnTheSaveButton();

		//Assertions
		Then.onPageWithIFrame.iShouldSeeTheIFrame(IFrameCommon.product1OfficeSuppliesURL, IFrameCommon.product1OfficeSupplies);
	});

	opaTest("I press on Embed Content: as section", function(Given, When, Then) {
		const sObjectPageID = "sap.ui.demoapps.rta.fev4::ProductsObjectPage--fe::ObjectPage";

		// Actions
		When.onPageWithRTA.iSwitchToAdaptationMode()
			.and.iRightClickOnAnElementOverlay(sObjectPageID)
			.and.iClickOnAContextMenuEntry(1);

		//Assertions
		Then.onPageWithIFrame.iShouldSeeTheIFrameDialog();
	});

	opaTest("On the Dialog, I enter a new title, URL and press Preview", function(Given, When, Then) {
		// Actions
		When.onIFrameDialog.iEnterUrlOnTextArea(IFrameCommon.URLTextAreaId, IFrameCommon.genericURL);
		When.onIFrameDialog.iEnterTitleOnInputField(IFrameCommon.titleFieldId, sSectionTitle);
		When.onIFrameDialog.iEnterHeightOnInputField(IFrameCommon.heightFieldId, "10");
		When.onIFrameDialog.iClickOnTheShowPreviewButton();

		//Assertions
		Then.onIFrameDialog.iShouldSeeThePreview(IFrameCommon.genericURL, IFrameCommon.testPageTitle);
	});

	opaTest("I press Save on the New IFrame dialog", function(Given, When, Then) {
		const sAnchorBarId = "sap.ui.demoapps.rta.fev4::ProductsObjectPage--fe::ObjectPage-anchBar";

		// Actions
		When.onIFrameDialog.iClickOnTheSaveButton();

		//Assertions
		Then.onPageWithIFrame.iShouldSeeTheIFrame(IFrameCommon.genericURL, IFrameCommon.testPageTitle);
		Then.onPageWithIFrame.iShouldSeeTheNewTitle(sAnchorBarId, sSectionTitle);
	});

	opaTest("Exiting RTA", function(Given, When, Then) {
		// Two AddIFrame changes, one Rename change for the section
		const nNumberOfChanges = 3;

		//Actions
		When.onPageWithRTA.iExitRtaMode();

		// Assertions
		Then.onPageWithRTA.iShouldSeeTheFLPToolbarAndChangesInLRep(nNumberOfChanges, "sap.ui.demoapps.rta.fev4.Component");
		Then.onPageWithIFrame.iShouldSeeTheIFrame(IFrameCommon.genericURL, IFrameCommon.testPageTitle);
	});

	opaTest("Go back to List Report", function(Given, When, Then) {
		When.onPageWithIFrame.iClickOnBackButton();

		// Assertions
		Then.onFioriElementsPage.iAmOnListReport(sSearchFieldId);
	});

	opaTest("Click on second product and check IFrame update", function(Given, When, Then) {
		//Actions
		When.onFioriElementsPage.iClickOnMDCTableLineItem(IFrameCommon.product2OfficeSupplies)
			.and.iWaitUntilTheBusyIndicatorIsGone("mainShell", undefined);

		// Assertion
		Then.onPageWithIFrame.iShouldSeeTheIFrame(IFrameCommon.product2OfficeSuppliesURL, IFrameCommon.product2OfficeSupplies);
	});

	opaTest("Restarting App", function(Given, When, Then) {
		Given.iTeardownTheAppFrame("mainShell", undefined, true, true);

		const sEncodedConnectorValue = encodeURI('[{"connector": "SessionStorageConnector"}]');

		// Arrangements
		Given.iStartTheApp({
			hash: "",
			urlParameters: "sap-ui-flexibilityServices=" + sEncodedConnectorValue
		});

		// Actions
		When.onFioriElementsPage.iClickOnMDCTableLineItem(IFrameCommon.product1OfficeSupplies)
			.and.iWaitUntilTheBusyIndicatorIsGone("mainShell", undefined);

		// Assertions
		Then.onFioriElementsPage.iAmOnProductPage(sProductPageId);
		Then.onPageWithIFrame.iShouldSeeTheIFrame(IFrameCommon.genericURL, IFrameCommon.testPageTitle);
		Then.onPageWithIFrame.iShouldSeeTheIFrame(IFrameCommon.product1OfficeSuppliesURL, IFrameCommon.product1OfficeSupplies);
	});

	opaTest("I clear the Session Storage and tear down the app", function(Given, When, Then) {
		// Actions
		When.onPageWithRTA.clearChangesFromSessionStorage();

		// Assertions
		Then.onPageWithRTA.iShouldSeeTheFLPToolbarAndChangesInLRep(0, "sap.ui.demoapps.rta.fev4.Component");

		Given.iTeardownTheAppFrame("mainShell", undefined, true, true);
	});
});