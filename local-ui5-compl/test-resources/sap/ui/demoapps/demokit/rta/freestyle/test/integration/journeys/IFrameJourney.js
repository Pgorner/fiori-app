/*global QUnit */

sap.ui.define([
	"sap/ui/test/opaQunit",
	"sap/ui/test/Opa5",
	"sap/ui/demoapps/rta/test/integration/IFrameContent/Common",
	"./../pages/Common",
	"sap/ui/demoapps/rta/test/integration/pages/IFrame",
	"sap/ui/demoapps/rta/test/integration/pages/Shared"
], function(
	opaTest,
	Opa5,
	IFrameCommon,
	Common
) {
	"use strict";

	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "sap.ui.demoapps.rta.freestyle.view.",
		autoWait: true,
		asyncPolling: true,
		timeout: 90
	});


	QUnit.module("IFrame");

	const sSectionTitle = "My New Section";
	const sAnchorBarId = "application-masterDetail-display-component---ProductDetail--ProductDetailLayout-anchBar";
	const sObjectPageLayoutId = "application-masterDetail-display-component---ProductDetail--ProductDetailLayout";
	let aSandboxProperties = ["allow-forms", "allow-popups", "allow-scripts", "allow-modals", "allow-same-origin"];


	// Show the master view with product list
	opaTest("Start RTA", function(Given, When, Then) {
		var sEncodedConnectorValue = encodeURI('[{"connector": "SessionStorageConnector"}]');

		// Arrangements
		Given.iStartTheApp({
			hash: "product/" + IFrameCommon.product1,
			urlParameters: "sap-ui-flexibilityServices=" + sEncodedConnectorValue
		});

		// Actions
		When.onPageWithRTA.clearChangesFromSessionStorage();
		When.onPageWithRTA.iWaitUntilTheBusyIndicatorIsGone("idAppControl", "Root")
			.and.iGoToMeArea()
			.and.iPressOnAdaptUi();

		// Assertions
		Then.onPageWithRTA.iShouldSeeTheToolbar()
			.and.iShouldSeeTheOverlayForTheApp("idAppControl", "Root");
	});

	opaTest("I press on Embed Content: as header", function(Given, When, Then) {
		var sHeaderElementID = "application-masterDetail-display-component---ProductDetail--DetailHeaderContent";

		// Actions
		When.onPageWithRTA.iSwitchToAdaptationMode()
			.and.iRightClickOnAnElementOverlay(sHeaderElementID)
			.and.iClickOnAContextMenuEntry(1);

		//Assertions
		Then.onPageWithIFrame.iShouldSeeTheIFrameDialog();
	});

	opaTest("On the Dialog, I enter a URL with parameter (Product) and press Preview", function(Given, When, Then) {
		// Actions
		When.onIFrameDialog.iEnterUrlOnTextArea(IFrameCommon.URLTextAreaId, IFrameCommon.productParameterURL);
		When.onIFrameDialog.iEnterHeightOnInputField(IFrameCommon.heightFieldId, "10");
		When.onIFrameDialog.iClickOnTheShowPreviewButton();

		//Assertions
		Then.onIFrameDialog.iShouldSeeThePreview(IFrameCommon.product1URL, IFrameCommon.product1);
	});

	opaTest("On Iframe sandbox default parameter change", function(Given, When, Then) {
		const oAdvancedSettingsPanelButtonId = "sapUiRtaAddIFrameDialog_AdvancedSettingsPanel-expandButton";
		const oAllowFormsSwitchId = "sapUiRtaAddIFrameDialog_allowFormsSwitch";
		aSandboxProperties = aSandboxProperties.filter((sProperty) => sProperty !== "allow-forms");

		// Actions
		When.onPageWithIFrame.iClickOnButton(oAdvancedSettingsPanelButtonId);
		When.onIFrameDialog.iToggleASandboxPropertySwitch(oAllowFormsSwitchId);
		When.onIFrameDialog.iClickOnTheShowPreviewButton();

		//Assertions
		Then.onPageWithIFrame.iShouldSeeTheIFrameSandboxProperties(IFrameCommon.product1URL, aSandboxProperties.join(" "));
	});

	opaTest("On Iframe sandbox input field parameter change", function(Given, When, Then) {
		aSandboxProperties.push("allow-presentation");

		// Actions
		When.onIFrameDialog.iEnterASandboxPropertyInMultiInput("allow-presentation");
		When.onIFrameDialog.iClickOnTheShowPreviewButton();

		//Assertions
		Then.onPageWithIFrame.iShouldSeeTheIFrameSandboxProperties(IFrameCommon.product1URL, aSandboxProperties.join(" "));
	});

	opaTest("I press Save on the New IFrame dialog", function(Given, When, Then) {
		// Actions
		When.onIFrameDialog.iClickOnTheSaveButton();

		//Assertions
		Then.onPageWithIFrame.iShouldSeeTheIFrame(IFrameCommon.product1URL, IFrameCommon.product1);
		Then.onPageWithIFrame.iShouldSeeTheIFrameSandboxProperties(IFrameCommon.product1URL, aSandboxProperties.join(" "));
	});

	opaTest("I press on Embed Content: as section", function(Given, When, Then) {
		var sOPLayoutID = "application-masterDetail-display-component---ProductDetail--ProductDetailLayout";

		// Actions
		When.onPageWithRTA.iSwitchToAdaptationMode()
			.and.iRightClickOnAnElementOverlay(sOPLayoutID)
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
		// Actions
		When.onIFrameDialog.iClickOnTheSaveButton();

		//Assertions
		Then.onPageWithIFrame.iShouldSeeTheIFrame(IFrameCommon.genericURL, IFrameCommon.testPageTitle);
		Then.onPageWithIFrame.iShouldSeeTheNewTitle(sAnchorBarId, sSectionTitle);
	});

	opaTest("I press undo", function(Given, When, Then) {
		var sUndoButtonPartialId = "sapUiRta_undo";

		// Actions
		When.onPageWithIFrame.iClickOnButton(sUndoButtonPartialId);

		//Assertions
		Then.onPageWithIFrame.iShouldNotSeeTheIFrameAnymore(sAnchorBarId);
	});

	opaTest("I press redo", function(Given, When, Then) {
		var sUndoButtonPartialId = "sapUiRta_redo";

		// Actions
		When.onPageWithIFrame.iClickOnButton(sUndoButtonPartialId);

		//Assertions
		Then.onPageWithIFrame.iShouldSeeTheIFrame(IFrameCommon.genericURL, IFrameCommon.testPageTitle);
		Then.onPageWithIFrame.iShouldSeeTheNewTitle(sAnchorBarId, sSectionTitle);
	});

	opaTest("Exiting RTA", function(Given, When, Then) {
		// Two AddIFrame changes, one Rename change for the section
		var nNumberOfChanges = 3;

		//Actions
		When.onPageWithRTA.iExitRtaMode();

		// Assertions
		Then.onPageWithRTA.iShouldSeeTheFLPToolbarAndChangesInLRep(nNumberOfChanges, "sap.ui.demoapps.rta.freestyle.Component");
	});

	opaTest("Click on second product and check IFrame update", function(Given, When, Then) {
		var sProductItemId = "application-masterDetail-display-component---ProductMaster--objectListItem-__clone0-__clone2";

		//Actions
		When.onPageWithIFrame.iScrollUp(sObjectPageLayoutId);
		When.onPageWithIFrame.iClickOnProduct(sProductItemId);

		// Assertions
		Then.onPageWithIFrame.iShouldSeeTheIFrame(IFrameCommon.product2URL, IFrameCommon.product2);
	});

	opaTest("Restarting App", function(Given, When, Then) {
		Given.iTeardownTheAppFrame("idAppControl", "Root", true, true);

		var sEncodedConnectorValue = encodeURI('[{"connector": "SessionStorageConnector"}]');

		// Arrangements
		Given.iStartTheApp({
			hash: "product/" + IFrameCommon.product1,
			urlParameters: "sap-ui-flexibilityServices=" + sEncodedConnectorValue
		});
		Given.onPageWithIFrame.iScrollUp(sObjectPageLayoutId);

		// Assertions
		Then.onPageWithIFrame.iShouldSeeTheIFrame(IFrameCommon.genericURL, IFrameCommon.testPageTitle);
		Then.onPageWithIFrame.iShouldSeeTheIFrame(IFrameCommon.product1URL, IFrameCommon.product1);
		Then.onPageWithIFrame.iShouldSeeTheNewTitle(sAnchorBarId, sSectionTitle);
		Then.onPageWithIFrame.iShouldSeeTheIFrameSandboxProperties(IFrameCommon.product1URL, aSandboxProperties.join(" "));
	});

	opaTest("I clear the Session Storage and tear down the app", function(Given, When, Then) {
		//Actions
		When.onPageWithRTA.clearChangesFromSessionStorage();

		// Assertions
		Then.onPageWithRTA.iShouldSeeTheFLPToolbarAndChangesInLRep(0, "sap.ui.demoapps.rta.freestyle.Component");

		Given.iTeardownTheAppFrame("idAppControl", "Root", true, true);
	});
});