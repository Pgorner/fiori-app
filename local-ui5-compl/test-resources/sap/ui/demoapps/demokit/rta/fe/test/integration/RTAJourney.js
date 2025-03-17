/*global QUnit*/

sap.ui.define(
	["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";

		QUnit.module("RTA");

		const sProductHash = "/SEPMRA_C_PD_Product(Product='AR-FB-1013',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)";
		const sAppContentId = "application-masterDetail-display-component-appContent";

		opaTest("Load the app and start RTA", function(Given, When, Then) {
			const sEncodedConnectorValue = encodeURI('[{"connector": "SessionStorageConnector"}]');

			// Arrangements
			Given.iStartTheApp({
				hash: sProductHash,
				urlParameters: "sap-ui-flexibilityServices=" + sEncodedConnectorValue
			});
			Given.onPageWithRTA.clearRtaRestartSessionStorage();
			Given.onPageWithRTA.clearChangesFromSessionStorage();

			// Actions
			When.onPageWithRTA.iGoToMeArea()
				.and.iPressOnAdaptUi()
				.and.iWaitUntilTheBusyIndicatorIsGone("mainShell", undefined);

			// Assertions
			Then.onPageWithRTA.iShouldSeeTheToolbar()
				.and.iShouldSeeTheOverlayForTheApp(sAppContentId, undefined);
		});

		opaTest("Rename a Label in the SmartForm", function(Given, When, Then) {
			// Actions
			const sId = "sap.ui.demoapps.rta.fe::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--com.sap.vocabularies.UI.v1.FieldGroup::TechnicalData::ProductBaseUnit::GroupElement";
			const sId2 = "sap.ui.demoapps.rta.fe::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--com.sap.vocabularies.UI.v1.FieldGroup::TechnicalData::Depth::GroupElement";
			const sRenamedLabel = "New Value - Test";
			When.onPageWithRTA.iRightClickOnAnElementOverlay(sId)
				.and.iClickOnAContextMenuEntry(0)
				.and.iEnterANewName(sRenamedLabel)
				.and.iClickOnAnElementOverlay(sId2);
			//Assertions
			Then.onAnyPage.iShouldSeeTheGroupElementByLabel(sRenamedLabel, sId);
		});

		opaTest("Delete a Field in the SmartForm", function(Given, When, Then) {
			//Actions
			const sId = "sap.ui.demoapps.rta.fe::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--com.sap.vocabularies.UI.v1.FieldGroup::TechnicalData::Height::GroupElement";
			When.onPageWithRTA.iClickOnAnElementOverlay(sId)
				.and.iRightClickOnAnElementOverlay(sId)
				.and.iClickOnAContextMenuEntry(2);

			// Assertions
			Then.onPageWithRTA.iShouldNotSeeTheElement(sId);
		});

		opaTest("Add a Field in the SmartForm - addODataProperty", function(Given, When, Then) {
			//Actions
			const sId = "sap.ui.demoapps.rta.fe::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--com.sap.vocabularies.UI.v1.FieldGroup::TechnicalData::Width::GroupElement";
			const sId2 = "sap.ui.demoapps.rta.fe::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--com.sap.vocabularies.UI.v1.FieldGroup::TechnicalData::FormGroup_SEPMRA_C_PD_ProductType_MainProductCategory";
			When.onPageWithRTA.iRightClickOnAnElementOverlay(sId)
				.and.iClickOnAContextMenuEntry(1)
				.and.iSelectAFieldByBindingPathInTheAddDialog("MainProductCategory")
				.and.iPressOK();

			// Assertions
			Then.onPageWithRTA.iShouldSeeTheElement(sId2);
			Then.onAnyPage.theGroupElementHasTheCorrectIndex(sId, sId2, false);
		});

		opaTest("Add a Field in the SmartForm - reveal", function(Given, When, Then) {
			//Actions
			const sId = "sap.ui.demoapps.rta.fe::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--com.sap.vocabularies.UI.v1.FieldGroup::TechnicalData::Width::GroupElement";
			const sId2 = "sap.ui.demoapps.rta.fe::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--com.sap.vocabularies.UI.v1.FieldGroup::TechnicalData::Height::GroupElement";
			When.onPageWithRTA.iRightClickOnAnElementOverlay(sId)
				.and.iClickOnAContextMenuEntry(1)
				.and.iSelectAFieldByBindingPathInTheAddDialog("Height")
				.and.iPressOK();

			// Assertions
			Then.onPageWithRTA.iShouldSeeTheElement(sId2);
			Then.onAnyPage.theGroupElementHasTheCorrectIndex(sId, sId2, false);
		});

		opaTest("Moving a Field via Cut and Paste to a GroupElement", function(Given, When, Then) {
			//Actions
			const sId = "sap.ui.demoapps.rta.fe::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--com.sap.vocabularies.UI.v1.FieldGroup::TechnicalData::ProductBaseUnit::GroupElement";
			const sId2 = "sap.ui.demoapps.rta.fe::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--com.sap.vocabularies.UI.v1.FieldGroup::TechnicalData::Depth::GroupElement";
			When.onPageWithRTA.iRightClickOnAnElementOverlay(sId)
				.and.iClickOnAContextMenuEntry(3)
				.and.iRightClickOnAnElementOverlay(sId2)
				.and.iClickOnAContextMenuEntry(4);

			// Assertions
			Then.onAnyPage.theGroupElementHasTheCorrectIndex(sId2, sId, false);
		});

		opaTest("Moving a Field via Cut and Paste to a Group", function(Given, When, Then) {
			const sId = "sap.ui.demoapps.rta.fe::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--com.sap.vocabularies.UI.v1.FieldGroup::TechnicalData::Height::GroupElement";
			const sId2 = "sap.ui.demoapps.rta.fe::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--com.sap.vocabularies.UI.v1.FieldGroup::TechnicalData::FormGroup";

			//Actions
			When.onPageWithRTA.iRightClickOnAnElementOverlay(sId)
				.and.iClickOnAContextMenuEntry(3)
				.and.iRightClickOnAnAggregationOverlay(sId2, "formElements")
				.and.iClickOnAContextMenuEntry(4);

			// Assertions
			Then.onAnyPage.theGroupElementHasTheFirstIndex(sId);
		});

		opaTest("Creating a new Group", function(Given, When, Then) {
			const sId = "sap.ui.demoapps.rta.fe::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--com.sap.vocabularies.UI.v1.FieldGroup::TechnicalData::FormGroup";
			const sNewTitle = "New: Group";

			//Actions
			When.onPageWithRTA.iRightClickOnAnElementOverlay(sId)
				.and.iClickOnAContextMenuEntry(2);

			// Assertions
			Then.onAnyPage.iShouldSeeTheGroupByTitle(sNewTitle);
		});

		opaTest("Exiting RTA", function(Give, When, Then) {
			const nNumberOfChanges = 6;

			//Actions
			When.onPageWithRTA.iExitRtaMode();

			// Assertions
			Then.onPageWithRTA.iShouldSeeTheFLPToolbarAndChangesInLRep(nNumberOfChanges, "sap.ui.demoapps.rta.fe.Component");
		});

		opaTest("Reloading the App", function(Given, When, Then) {
			const sGroupId = "sap.ui.demoapps.rta.fe::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--com.sap.vocabularies.UI.v1.FieldGroup::TechnicalData::FormGroup";
			const sId = "sap.ui.demoapps.rta.fe::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--com.sap.vocabularies.UI.v1.FieldGroup::TechnicalData::Height::GroupElement";
			const sId2 = "sap.ui.demoapps.rta.fe::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--com.sap.vocabularies.UI.v1.FieldGroup::TechnicalData::FormGroup_SEPMRA_C_PD_ProductType_MainProductCategory";
			const sId3 = "sap.ui.demoapps.rta.fe::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--com.sap.vocabularies.UI.v1.FieldGroup::TechnicalData::ProductBaseUnit::GroupElement";
			const sEncodedConnectorValue = encodeURI('[{"connector": "SessionStorageConnector"}]');
			const nNumberOfChanges = 6;


			// Arrangements
			Given.iTeardownTheAppFrame("mainShell", undefined, true, true);
			Given.iStartTheApp({
				hash: sProductHash,
				urlParameters: "sap-ui-flexibilityServices=" + sEncodedConnectorValue
			});

			// Assertions
			Then.onPageWithRTA.iShouldSeeChangesInLRepWhenTheBusyIndicatorIsGone("mainShell", undefined, nNumberOfChanges, "sap.ui.demoapps.rta.fe.Component");
			Then.onAnyPage.iShouldSeeTheGroupElementByLabel("New Value - Test", sId3)
				.and.theChangesToTheGroupShouldStillBeThere(sGroupId, sId, sId2, 6);

			Given.iTeardownTheAppFrame("mainShell", undefined, true, true);
		});
	}
);