/*global QUnit*/

sap.ui.define([
	"sap/ui/test/opaQunit"
], function(
	opaTest
) {
	"use strict";

	QUnit.module("Variants");

	const sEncodedConnectorValue = encodeURI('[{"connector": "SessionStorageConnector"}]');
	const sAppContentId = "application-product-display-component---appRootView--appContent";
	const sVMControlId = "sap.ui.demoapps.rta.fev4::ProductsList--fe::PageVariantManagement";
	const sFilterBarId = "sap.ui.demoapps.rta.fev4::ProductsList--fe::FilterBar::Products";
	const sStandardVariantName = "Standard";
	const sFirstVariantName = "myFirstVariant";
	const sSecondVariantName = "mySecondVariant";
	const sEndUserVariantName = "End User Variant";

	opaTest("Load the app and start RTA", (Given, When, Then) => {
		Given.iStartTheApp({
			hash: "",
			urlParameters: "sap-ui-flexibilityServices=" + sEncodedConnectorValue
		});
		Given.onPageWithRTA.clearRtaRestartSessionStorage();
		Given.onPageWithRTA.clearChangesFromSessionStorage();

		When.onPageWithRTA.iGoToMeArea()
		.and.iPressOnAdaptUi()
		.and.iWaitUntilTheBusyIndicatorIsGone("mainShell", undefined);

		Then.onPageWithRTA.iShouldSeeTheToolbar()
		.and.iShouldSeeTheOverlayForTheApp(sAppContentId, undefined);
	});

	opaTest("Open the Manage Filters Dialog", (Given, When, Then) => {
		When.onPageWithRTA.iRightClickOnAnElementOverlay(sFilterBarId)
		.and.iClickOnAContextMenuEntry(0);
		When.iChangeAdaptFiltersView("sap-icon://group-2");

		Then.iShouldSeeP13nFilterItem({
			itemText: "Category",
			index: 0
		});
		Then.iShouldSeeP13nFilterItem({
			itemText: "Preferred Product",
			index: 1
		});
		Then.iShouldSeeP13nFilterItem({
			itemText: "Supplier",
			index: 2
		});
	});

	opaTest("Change some filters", (Given, When, Then) => {
		When.iSelectColumn("Category", null, undefined, true, true)
		.and.iTogglePanelInDialog("Product")
		.and.iSelectColumn("Currency", null, undefined, true, true)
		.and.iPressButtonWithText("OK");

		Then.thePersonalizationDialogShouldBeClosed()
		.and.iShouldSeeVisibleFiltersInOrderInFilterBar(["Supplier", "Preferred Product", "Currency"]);
		Then.onFlVariantManagement.theModifiedIndicatorShouldBeDisplayed();
	});

	opaTest("Create a Variant and make it default", (Given, When, Then) => {
		const sVariantName = sFirstVariantName;
		When.onPageWithRTA.iRightClickOnAnElementOverlay(sVMControlId)
		.and.iClickOnAContextMenuEntry(2);
		When.onFlVariantManagement.iCreateNewVariant(sVMControlId, sVariantName, true);

		Then.onFlVariantManagement.theVariantShouldBeDisplayed(sVMControlId, sVariantName)
		.and.theModifiedIndicatorShouldBeHidden();
	});

	opaTest("Change some filters again", (Given, When, Then) => {
		When.onPageWithRTA.iRightClickOnAnElementOverlay(sFilterBarId)
		.and.iClickOnAContextMenuEntry(0);

		When.iChangeAdaptFiltersView("sap-icon://group-2")
		.and.iSelectColumn("Star Ratings", null, undefined, true, true)
		.and.iPressButtonWithText("OK");

		Then.thePersonalizationDialogShouldBeClosed()
		.and.iShouldSeeVisibleFiltersInOrderInFilterBar(["Supplier", "Preferred Product", "Currency", "Star Ratings"]);
		Then.onFlVariantManagement.theModifiedIndicatorShouldBeDisplayed();
	});

	opaTest("Create a second variant based on the first one", (Given, When, Then) => {
		const sVariantName = sSecondVariantName;

		When.onPageWithRTA.iRightClickOnAnElementOverlay(sVMControlId)
		.and.iClickOnAContextMenuEntry(2);
		When.onFlVariantManagement.iCreateNewVariant(sVMControlId, sVariantName);

		Then.onFlVariantManagement.theVariantShouldBeDisplayed(sVMControlId, sVariantName)
		.and.theModifiedIndicatorShouldBeHidden();
	});

	opaTest("Save Changes", (Given, When, Then) => {
		When.onPageWithRTA.iExitRtaMode();
		Then.onPageWithRTA.iShouldSeeTheFLPToolbarAndChangesInLRep(8, "sap.ui.demoapps.rta.fev4.Component");
	});

	opaTest("Navigate back to Home Screen", (Given, When, Then) => {
		Given.iNavigateToFlpHomeScreen();
		Then.onAnyPage.iShouldSeeTheFLPHomeScreen();
	});

	opaTest("Navigate back to Application", (Given, When, Then) => {
		Given.iNavigateToApp("Display Product Catalog");

		Then.onFlVariantManagement.theVariantShouldBeDisplayed(sVMControlId, sFirstVariantName)
		.and.theModifiedIndicatorShouldBeHidden();
		Then.iShouldSeeVisibleFiltersInOrderInFilterBar(["Supplier", "Preferred Product", "Currency"]);
	});

	opaTest("Create Public End User variant based on Standard variant", (Given, When, Then) => {
		When.onFlVariantManagement.iOpenMyView(sVMControlId);
		When.onAnyPage.iSelectVariant(sStandardVariantName);
		When.onFlVariantManagement.iOpenMyView(sVMControlId)
		.and.iOpenSaveView(sVMControlId)
		.and.iCreateNewVariant(sVMControlId, sEndUserVariantName, false, false, /* public */true);

		Then.onFlVariantManagement.theVariantShouldBeDisplayed(sVMControlId, sEndUserVariantName)
		.and.theModifiedIndicatorShouldBeHidden();
	});

	opaTest("Start RTA and make Change on Standard Variant", (Given, When, Then) => {
		When.onPageWithRTA.iGoToMeArea()
		.and.iPressOnAdaptUi()
		.and.iPressOK()
		.and.iWaitUntilTheBusyIndicatorIsGone("mainShell", undefined);

		Then.onPageWithRTA.iShouldSeeTheToolbar()
		.and.iShouldSeeTheOverlayForTheApp(sAppContentId, undefined);

		When.onPageWithRTA.iRightClickOnAnElementOverlay(sVMControlId)
		.and.iClickOnAContextMenuEntry(4)
		.and.iClickOnAContextMenuEntryWithText(sStandardVariantName);

		When.onPageWithRTA.iRightClickOnAnElementOverlay(sFilterBarId)
		.and.iClickOnAContextMenuEntry(0);

		When.iChangeAdaptFiltersView("sap-icon://group-2")
		.and.iSelectColumn("Supplier", null, undefined, true, true)
		.and.iPressButtonWithText("OK");

		Then.thePersonalizationDialogShouldBeClosed()
		.and.iShouldSeeVisibleFiltersInOrderInFilterBar(["Category", "Preferred Product"]);
		Then.onFlVariantManagement.theModifiedIndicatorShouldBeDisplayed();
	});

	opaTest("Save the change to the Standard Variant", (Given, When, Then) => {
		When.onPageWithRTA.iRightClickOnAnElementOverlay(sVMControlId)
		.and.iClickOnAContextMenuEntry(1);

		Then.onFlVariantManagement.theModifiedIndicatorShouldBeHidden();
	});

	opaTest("Save Changes", (Given, When, Then) => {
		When.onPageWithRTA.iExitRtaMode()
		.and.iPressOK();
		Then.onPageWithRTA.iShouldSeeTheFLPToolbarAndChangesInLRep(11, "sap.ui.demoapps.rta.fev4.Component");
	});

	opaTest("Select all variants and check their content", (Given, When, Then) => {
		Then.onFlVariantManagement.theVariantShouldBeDisplayed(sVMControlId, sFirstVariantName)
		.and.theModifiedIndicatorShouldBeHidden();
		Then.iShouldSeeVisibleFiltersInOrderInFilterBar(["Supplier", "Preferred Product", "Currency"]);

		When.onFlVariantManagement.iOpenMyView(sVMControlId);
		When.onAnyPage.iSelectVariant(sStandardVariantName);
		Then.onFlVariantManagement.theVariantShouldBeDisplayed(sVMControlId, sStandardVariantName)
		.and.theModifiedIndicatorShouldBeHidden();
		Then.iShouldSeeVisibleFiltersInOrderInFilterBar(["Category", "Preferred Product"]);

		When.onFlVariantManagement.iOpenMyView(sVMControlId);
		When.onAnyPage.iSelectVariant(sEndUserVariantName);
		Then.onFlVariantManagement.theVariantShouldBeDisplayed(sVMControlId, sEndUserVariantName)
		.and.theModifiedIndicatorShouldBeHidden();
		Then.iShouldSeeVisibleFiltersInOrderInFilterBar(["Category", "Preferred Product"]);

		When.onFlVariantManagement.iOpenMyView(sVMControlId);
		When.onAnyPage.iSelectVariant(sSecondVariantName);
		Then.onFlVariantManagement.theVariantShouldBeDisplayed(sVMControlId, sSecondVariantName)
		.and.theModifiedIndicatorShouldBeHidden();
		Then.iShouldSeeVisibleFiltersInOrderInFilterBar(["Supplier", "Preferred Product", "Currency", "Star Ratings"]);
	});

	opaTest("Delete Public Variant", (Given, When, Then) => {
		When.onFlVariantManagement.iOpenMyView(sVMControlId);
		When.onAnyPage.iSelectVariant(sEndUserVariantName);
		When.onFlVariantManagement.iOpenMyView(sVMControlId)
		.and.iOpenManageViews(sVMControlId)
		.and.iRemoveVariant(sEndUserVariantName)
		.and.iPressTheManageViewsSave(sVMControlId);

		Then.onFlVariantManagement.theVariantShouldBeDisplayed(sVMControlId, sStandardVariantName);
	});

	opaTest("Restart the App and Clean Up", (Given, When, Then) => {
		Given.iTeardownTheAppFrame("mainShell", undefined, true, true);

		Given.iStartTheApp({
			hash: "",
			urlParameters: "sap-ui-flexibilityServices=" + sEncodedConnectorValue
		});
		Then.onFlVariantManagement.theVariantShouldBeDisplayed(sVMControlId, sFirstVariantName)
		.and.theModifiedIndicatorShouldBeHidden();
		When.onFlVariantManagement.iOpenMyView(sVMControlId);
		Then.onFlVariantManagement.theMyViewShouldContain(sVMControlId, [sStandardVariantName, sFirstVariantName, sSecondVariantName]);
		Then.iShouldSeeVisibleFiltersInOrderInFilterBar(["Supplier", "Preferred Product", "Currency"]);

		Given.iTeardownTheAppFrame("mainShell", undefined, true, true);
	});
});
