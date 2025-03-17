/*global QUnit */

sap.ui.define([
	"sap/ui/test/opaQunit",
	"sap/ui/test/Opa5",
	"sap/ui/core/Lib",
	"./../pages/Common",
	"sap/ui/rta/test/integration/pages/ChangeVisualization"
], (
	opaTest,
	Opa5,
	Lib,
	Common
) => {
	"use strict";

	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "sap.ui.demoapps.rta.freestyle.view.",
		autoWait: true,
		asyncPolling: true,
		timeout: 90
	});

	QUnit.module("ChangeVisualization");

	const oRtaResourceBundle = Lib.getResourceBundleFor("sap.ui.rta");
	const sCVizDropDownId = "application-masterDetail-display-component---changeVisualization_changesList--popover";

	// Show the master view with product list
	opaTest("Start RTA", function(Given, When, Then) {
		const sEncodedConnectorValue = encodeURI('[{"connector": "SessionStorageConnector"}]');

		// Cleanup
		When.onPageWithRTA.clearRtaRestartSessionStorage();

		// Arrangements
		Given.iStartTheApp({
			hash: "product/HT-1000",
			urlParameters: "sap-ui-flexibilityServices=" + sEncodedConnectorValue
		});

		// Actions
		When.onPageWithRTA.iWaitUntilTheBusyIndicatorIsGone("idAppControl", "Root")
		.and.iGoToMeArea()
		.and.iPressOnAdaptUi();

		// Assertions
		Then.onPageWithRTA.iShouldSeeTheToolbar()
			.and.iShouldSeeTheOverlayForTheApp("idAppControl", "Root");
	});

	opaTest("I switch to the Visualization Mode with no changes", function(Given, When, Then) {
		const oChangesCount = {
			all: 0,
			add: 0,
			move: 0,
			rename: 0,
			combineSplit: 0,
			remove: 0,
			other: 0
		};

		// Actions
		When.onPageWithRTA.iSwitchToVisualizationMode();
		When.onPageWithCViz.iClickOnTheChangesDropDownMenuButton();


		// Assertion
		Then.onPageWithCViz.iShouldSeeTheDisabledSegmentedButton(sCVizDropDownId, 2)
		.and.iShouldSeeTheDisabledSegmentedButton(sCVizDropDownId, 1)
		.and.iShouldNotSeeAChangeIndicator()
		.and.iShouldSeeTheCorrectChangesCategoriesCount(sCVizDropDownId, oChangesCount);
	});

	opaTest("I rename a Label in a smart form", function(Given, When, Then) {
		const sElementId = "application-masterDetail-display-component---ProductDetail--SupplierForm--SupplierFormGeneral.FaxNumber";
		const sLabel = "Smart Rename";
		const iVisibleIndicators = 1;

		// Actions
		When.onPageWithRTA.iSwitchToAdaptationMode()
		.and.iRightClickOnAnElementOverlay(sElementId)
		.and.iClickOnAContextMenuEntry(0)
		.and.iEnterANewName(sLabel)
		.and.iSwitchToVisualizationMode();
		When.onPageWithCViz.iClickOnTheChangeIndicator(sElementId);

		//Assertions
		Then.onPageWithCViz.iShouldSeeTheChangeIndicatorPopover()
		.and.iShouldSeeTheCorrectPopupInformation(oRtaResourceBundle.getText("TXT_CHANGEVISUALIZATION_OVERVIEW_RENAME"), 0)
		.and.iShouldSeeTheChangeIndicators(iVisibleIndicators);
	});

	opaTest("I revert a change in a smart form", function(Given, When, Then) {
		// Actions
		When.onPageWithRTA.iSwitchToAdaptationMode()
		.and.iClickTheUndoButton()
		.and.iSwitchToVisualizationMode();

		//Assertions
		Then.onPageWithCViz.iShouldNotSeeAChangeIndicator();
	});

	opaTest("I rename a Label in a simple form", function(Given, When, Then) {
		const sElementId = "application-masterDetail-display-component---ProductDetail--GeneralForm--generalForm--application-masterDetail-display-component---ProductDetail--GeneralForm--descriptionLabel--FE";
		const sLabel = "Simple Rename";
		const iVisibleIndicators = 1;

		// Actions
		When.onPageWithRTA.iSwitchToAdaptationMode()
		.and.iRightClickOnAnElementOverlay(sElementId)
		.and.iClickOnAContextMenuEntry(0)
		.and.iEnterANewName(sLabel)
		.and.iSwitchToVisualizationMode();
		When.onPageWithCViz.iClickOnTheChangeIndicator(sElementId);

		//Assertions
		Then.onPageWithCViz.iShouldSeeTheChangeIndicatorPopover()
		.and.iShouldSeeTheCorrectPopupInformation(oRtaResourceBundle.getText("TXT_CHANGEVISUALIZATION_OVERVIEW_RENAME"), 0)
		.and.iShouldSeeTheChangeIndicators(iVisibleIndicators);
	});

	opaTest("I revert a change in a simple form", function(Given, When, Then) {
		// Actions
		When.onPageWithRTA.iSwitchToAdaptationMode()
		.and.iClickTheUndoButton()
		.and.iSwitchToVisualizationMode();

		//Assertions
		Then.onPageWithCViz.iShouldNotSeeAChangeIndicator();
	});

	opaTest("I create a new group in a smart form", function(Given, When, Then) {
		const sTitle = oRtaResourceBundle.getText("TITLE_CREATE_CONTAINER","Group");
		const sGroupId = "application-masterDetail-display-component---ProductDetail--SupplierForm--SupplierFormGeneralGroup";

		// Actions
		When.onPageWithRTA.iSwitchToAdaptationMode();
		When.onPageWithRTA.iRightClickOnAnElementOverlay(sGroupId)
		.and.iClickOnAContextMenuEntry(2)
		.and.iSwitchToVisualizationMode();

		//Assertions
		Then.onPageWithRTA.iShouldSeeTheElementWithTitle(sTitle);
	});

	opaTest("I click the change indicator on the new group", function(Given, When, Then) {
		const Element = Opa5.getWindow().sap.ui.require("sap/ui/core/Element");
		const sSectionId = "application-masterDetail-display-component---ProductDetail--SupplierForm--supplierForm--Form";
		const sElementId = Element.getElementById(sSectionId).getFormContainers()[1].getId();
		const iVisibleIndicators = 1;

		// Actions
		When.onPageWithCViz.iClickOnTheChangeIndicator(sElementId);

		//Assertions
		Then.onPageWithCViz.iShouldSeeTheChangeIndicatorPopover()
		.and.iShouldSeeTheCorrectPopupInformation(oRtaResourceBundle.getText("TXT_CHANGEVISUALIZATION_OVERVIEW_ADD"), 0)
		.and.iShouldSeeTheChangeIndicators(iVisibleIndicators);
	});

	opaTest("Add a field in the smart form", function(Given, When, Then) {
		const Element = Opa5.getWindow().sap.ui.require("sap/ui/core/Element");
		const sSectionId = "application-masterDetail-display-component---ProductDetail--SupplierForm--supplierForm--Form";
		const sElementId = Element.getElementById(sSectionId).getFormContainers()[1].getId();
		const iVisibleIndicators = 2;

		//Actions
		When.onPageWithRTA.iSwitchToAdaptationMode();
		When.onPageWithRTA.iRightClickOnAnElementOverlay(sElementId)
		.and.iClickOnAContextMenuEntry(1)
		.and.iSelectAFieldByBindingPathInTheAddDialog("EmailAddress")
		.and.iPressOK()
		.and.iSwitchToVisualizationMode();

		// Assertions
		Then.onPageWithCViz.iShouldSeeTheChangeIndicators(iVisibleIndicators);
	});

	opaTest("I click the indicator on the newly added field", function(Given, When, Then) {
		const Element = Opa5.getWindow().sap.ui.require("sap/ui/core/Element");
		const sSectionId = "application-masterDetail-display-component---ProductDetail--SupplierForm--supplierForm--Form";
		const sElementId = Element.getElementById(sSectionId).getFormContainers()[1].getFormElements()[0].getId();

		//Actions
		When.onPageWithCViz.iClickOnTheChangeIndicator(sElementId);

		// Assertions
		Then.onPageWithCViz.iShouldSeeTheChangeIndicatorPopover()
		.and.iShouldSeeTheCorrectPopupInformation(oRtaResourceBundle.getText("TXT_CHANGEVISUALIZATION_OVERVIEW_ADD"), 0);
	});

	opaTest("I Move a field in a smart form via Drag and Drop", function(Given, When, Then) {
		const Element = Opa5.getWindow().sap.ui.require("sap/ui/core/Element");
		const sDragElementLabel = "application-masterDetail-display-component---ProductDetail--SupplierForm--SupplierFormGeneral.CompanyName";
		const sSectionId = "application-masterDetail-display-component---ProductDetail--SupplierForm--supplierForm--Form";
		const sDropElementLabel = Element.getElementById(sSectionId).getFormContainers()[1].getFormElements()[0].getId();
		const iVisibleIndicators = 3;

		//Actions
		When.onPageWithRTA.iSwitchToAdaptationMode()
		.and.iDragAndDropAnElement(sDragElementLabel, sDropElementLabel)
		.and.iSwitchToVisualizationMode();
		When.onPageWithCViz.iClickOnTheChangeIndicator(sDragElementLabel);

		// Assertions
		Then.onPageWithCViz.iShouldSeeTheChangeIndicatorPopover()
		.and.iShouldSeeTheCorrectPopupInformation(oRtaResourceBundle.getText("TXT_CHANGEVISUALIZATION_OVERVIEW_MOVE"), 0)
		.and.iShouldSeeTheChangeIndicators(iVisibleIndicators);
	});

	opaTest("I show the depending element in a smart form", function(Given, When, Then) {
		//Actions
		When.onPageWithCViz.iClickOnTheShowSourceButton();

		// Assertions
		Then.onPageWithCViz.iShouldSeeTheSourceElementOverlay();
	});

	opaTest("I create a new group in a simple form", function(Given, When, Then) {
		const sTitle = oRtaResourceBundle.getText("TITLE_CREATE_CONTAINER","Group");
		const sGroupId = "application-masterDetail-display-component---ProductDetail--GeneralForm--generalForm--FC-NoHead";

		//Actions
		When.onPageWithRTA.iSwitchToAdaptationMode();
		When.onPageWithRTA.iRightClickOnAnElementOverlay(sGroupId)
		.and.iClickOnAContextMenuEntry(2)
		.and.iSwitchToVisualizationMode();

		// Assertions
		Then.onPageWithRTA.iShouldSeeTheElementWithTitle(sTitle);
	});

	opaTest("I click the change indicator on the new group", function(Given, When, Then) {
		const Element = Opa5.getWindow().sap.ui.require("sap/ui/core/Element");
		const sSectionId = "application-masterDetail-display-component---ProductDetail--GeneralForm--generalForm--Form";
		const sElementId = Element.getElementById(sSectionId).getFormContainers()[1].getId();
		const iVisibleIndicators = 4;

		//Actions
		When.onPageWithCViz.iClickOnTheChangeIndicator(sElementId);

		// Assertions
		Then.onPageWithCViz.iShouldSeeTheChangeIndicatorPopover()
		.and.iShouldSeeTheCorrectPopupInformation(oRtaResourceBundle.getText("TXT_CHANGEVISUALIZATION_OVERVIEW_ADD"), 0)
		.and.iShouldSeeTheChangeIndicators(iVisibleIndicators);
	});

	opaTest("Add a Field in the simple form", function(Given, When, Then) {
		const Element = Opa5.getWindow().sap.ui.require("sap/ui/core/Element");
		const sSectionId = "application-masterDetail-display-component---ProductDetail--GeneralForm--generalForm--Form";
		const sGroupId = Element.getElementById(sSectionId).getFormContainers()[1].getId();
		const iVisibleIndicators = 5;
		const sElementId = "application-masterDetail-display-component---ProductDetail--GeneralForm--generalForm--application-masterDetail-display-component---ProductDetail--GeneralForm--generalForm_SEPMRA_C_PD_ProductType_ProductBaseUnit-label--FE";

		//Actions
		When.onPageWithRTA.iSwitchToAdaptationMode();
		When.onPageWithRTA.iRightClickOnAnElementOverlay(sGroupId)
		.and.iClickOnAContextMenuEntry(1)
		.and.iSelectAFieldByBindingPathInTheAddDialog("ProductBaseUnit")
		.and.iPressOK()
		.and.iSwitchToVisualizationMode();
		When.onPageWithCViz.iClickOnTheChangeIndicator(sElementId);

		// Assertions
		Then.onPageWithCViz.iShouldSeeTheChangeIndicatorPopover()
		.and.iShouldSeeTheCorrectPopupInformation(oRtaResourceBundle.getText("TXT_CHANGEVISUALIZATION_OVERVIEW_ADD"), 0)
		.and.iShouldSeeTheChangeIndicators(iVisibleIndicators);
	});

	opaTest("I Move a field in a simple form via Drag and Drop", function(Given, When, Then) {
		const sDragElementLabel = "application-masterDetail-display-component---ProductDetail--GeneralForm--generalForm--application-masterDetail-display-component---ProductDetail--GeneralForm--productLabel--FE";
		const sDropElementLabel = "application-masterDetail-display-component---ProductDetail--GeneralForm--generalForm--application-masterDetail-display-component---ProductDetail--GeneralForm--generalForm_SEPMRA_C_PD_ProductType_ProductBaseUnit-label--FE";
		const iVisibleIndicators = 6;

		//Actions
		When.onPageWithRTA.iSwitchToAdaptationMode()
		.and.iDragAndDropAnElement(sDragElementLabel, sDropElementLabel)
		.and.iSwitchToVisualizationMode();
		When.onPageWithCViz.iClickOnTheChangeIndicator(sDragElementLabel);

		// Assertions
		Then.onPageWithCViz.iShouldSeeTheChangeIndicatorPopover()
		.and.iShouldSeeTheCorrectPopupInformation(oRtaResourceBundle.getText("TXT_CHANGEVISUALIZATION_OVERVIEW_MOVE"), 0)
		.and.iShouldSeeTheChangeIndicators(iVisibleIndicators);
	});

	opaTest("I open the visualization dropdown", function(Given, When, Then) {
		const oChangesCount = {
			all: 6,
			add: 4,
			move: 2,
			rename: 0,
			combineSplit: 0,
			remove: 0,
			other: 0
		};

		//Actions
		When.onPageWithCViz.iClickOnTheChangesDropDownMenuButton();

		// Assertions
		Then.onPageWithCViz.iShouldSeeTheChangesDropDownMenu(sCVizDropDownId)
		.and.iShouldSeeTheCorrectChangesCategoriesCount(sCVizDropDownId, oChangesCount);
	});

	opaTest("I click on one change category in the visualization dropdown menu", function(Given, When, Then) {
		const sChangeCategoryTitle = oRtaResourceBundle.getText("TXT_CHANGEVISUALIZATION_OVERVIEW_MOVE");

		//Actions
		When.onPageWithCViz.iClickOnTheChangeCategory(sChangeCategoryTitle);

		// Assertions
		Then.onPageWithCViz.iShouldSeeTheChangeIndicators(2);
	});

	opaTest("I update the visualization model by switching back and forth", function(Given, When, Then) {
		const oChangesCount = {
			all: 6,
			add: 4,
			move: 2,
			rename: 0,
			combineSplit: 0,
			remove: 0,
			other: 0
		};

		//Actions
		When.onPageWithRTA.iSwitchToAdaptationMode()
		.and.iSwitchToVisualizationMode();
		When.onPageWithCViz.iClickOnTheChangesDropDownMenuButton();

		// Assertions
		Then.onPageWithCViz.iShouldSeeTheChangesDropDownMenu(sCVizDropDownId)
		.and.iShouldSeeTheCorrectChangesCategoriesCount(sCVizDropDownId, oChangesCount)
		.and.iShouldSeeTheChangeIndicators(2);

		// Actions
		When.onPageWithRTA.iSwitchToAdaptationMode();
	});

	opaTest("Restarting RTA", function(Give, When, Then) {
		//Actions
		When.onPageWithRTA.iExitRtaMode();
		When.onPageWithRTA.iWaitUntilTheBusyIndicatorIsGone("idAppControl", "Root")
		.and.iGoToMeArea()
		.and.iPressOnAdaptUi();

		// Assertions
		Then.onPageWithRTA.iShouldSeeTheToolbar().
		and.iShouldSeeTheOverlayForTheApp("idAppControl", "Root");
	});

	opaTest("I make new changes and switch between All and draft mode", function(Given, When, Then) {
		const oDraftChangesCount = {
			all: 1,
			add: 0,
			move: 0,
			rename: 1,
			combineSplit: 0,
			remove: 0,
			other: 0
		};
		const sElementId = "application-masterDetail-display-component---ProductDetail--GeneralForm--generalForm--application-masterDetail-display-component---ProductDetail--GeneralForm--descriptionLabel--FE";
		const sLabel = "New Simple Rename";

		//Actions
		When.onPageWithRTA.iSwitchToAdaptationMode()
		.and.iRightClickOnAnElementOverlay(sElementId)
		.and.iClickOnAContextMenuEntry(0)
		.and.iEnterANewName(sLabel)
		.and.iSwitchToVisualizationMode();
		When.onPageWithCViz.iClickOnTheChangesDropDownMenuButton()
		.and.iClickOnTheUnsavedButton();

		// Assertions
		Then.onPageWithCViz.iShouldSeeTheChangesDropDownMenu(sCVizDropDownId)
		.and.iShouldSeeTheCorrectChangesCategoriesCount(sCVizDropDownId, oDraftChangesCount);
	});

	opaTest("I save the change via the save button ", function(Given, When, Then) {
		const oChangesCount = {
			all: 7,
			add: 4,
			move: 2,
			rename: 1,
			combineSplit: 0,
			remove: 0,
			other: 0
		};

		//Actions
		When.onPageWithRTA.iClickTheSaveButton();
		When.onPageWithCViz.iClickOnTheChangesDropDownMenuButton();

		// Assertions
		Then.onPageWithCViz.iShouldSeeTheDisabledSegmentedButton(sCVizDropDownId, 2)
		.and.iShouldSeeTheChangesDropDownMenu(sCVizDropDownId)
		.and.iShouldSeeTheCorrectChangesCategoriesCount(sCVizDropDownId, oChangesCount)
		.and.iShouldSeeTheChangeIndicators(7);
	});

	opaTest("Reset the App", function(Given, When, Then) {
		//Actions
		When.onPageWithRTA.clearChangesFromSessionStorage();

		// Assertions
		Then.onPageWithRTA.iShouldSeeChangesInLRepWhenTheBusyIndicatorIsGone("idAppControl", "Root", 0, "sap.ui.demoapps.rta.freestyle.Component");

		Given.iTeardownTheAppFrame("idAppControl", "Root", true, true);
	});
});