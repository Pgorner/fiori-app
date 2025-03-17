/*global QUnit*/

sap.ui.define(
	["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";

		QUnit.module("RTA");

		const sProductHash = "/Products(ID=7be6d296-9e7a-3505-b72e-4c7b98783578,IsActiveEntity=true)";
		const sAppContentId = "application-product-display-component---appRootView--appContent";
		const sRenamedLabel = "New Value - Test";
		const sIdentifierFieldId = "sap.ui.demoapps.rta.fev4::ProductsObjectPage--fe::FormContainer::FieldGroup::GeneralInformation::FormElement::DataField::identifier";
		const sNameFieldId = "sap.ui.demoapps.rta.fev4::ProductsObjectPage--fe::FormContainer::FieldGroup::GeneralInformation::FormElement::DataField::name";
		const sDescriptionFieldId = "sap.ui.demoapps.rta.fev4::ProductsObjectPage--fe::FormContainer::FieldGroup::GeneralInformation::FormElement::DataField::description";
		const sAvailabilityFieldId = "sap.ui.demoapps.rta.fev4::ProductsObjectPage--fe::Form::GeneralInformation::Content_sap.capire.officesupplies.CatalogAdminService.Products_stock_FormElement";
		const sTechnicalDataGroupId = "sap.ui.demoapps.rta.fev4::ProductsObjectPage--fe::FormContainer::FieldGroup::TechnicalData";
		const sNewGroupTitle = "New: Group";
		const iNumberOfChanges = 5;

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

		opaTest("Rename a Label in the Form", function(Given, When, Then) {
			// Actions
			When.onPageWithRTA.iRightClickOnAnElementOverlay(sIdentifierFieldId)
				.and.iClickOnAContextMenuEntry(0)
				.and.iEnterANewName(sRenamedLabel)
				.and.iClickOnAnElementOverlay(sNameFieldId);
			//Assertions
			Then.onAnyPage.iShouldSeeTheGroupElementLabel(sRenamedLabel, sIdentifierFieldId);
		});

		opaTest("Delete a Field in the Form", function(Given, When, Then) {
			//Actions
			When.onPageWithRTA.iClickOnAnElementOverlay(sNameFieldId)
				.and.iRightClickOnAnElementOverlay(sNameFieldId)
				.and.iClickOnAContextMenuEntry(2);

			// Assertions
			Then.onPageWithRTA.iShouldNotSeeTheElement(sNameFieldId);
		});

		opaTest("Add a Field in the Form - addODataProperty", function(Given, When, Then) {
			//Actions
			const sId = "sap.ui.demoapps.rta.fev4::ProductsObjectPage--fe::FormContainer::FieldGroup::TechnicalData::FormElement::DataField::width";
			When.onPageWithRTA.iRightClickOnAnElementOverlay(sId)
				.and.iClickOnAContextMenuEntry(1)
				.and.iSelectAFieldByBindingPathInTheAddDialog("stock")
				.and.iPressOK();

			// Assertions
			Then.onPageWithRTA.iShouldSeeTheElement(sAvailabilityFieldId);
			Then.onAnyPage.theGroupElementHasTheCorrectIndex(sId, sAvailabilityFieldId, false, "formElements");
		});

		opaTest("Add a Field in the Form - reveal", function(Given, When, Then) {
			//Actions
			When.onPageWithRTA.iRightClickOnAnElementOverlay(sIdentifierFieldId)
				.and.iClickOnAContextMenuEntry(1)
				.and.iSelectAFieldByBindingPathInTheAddDialog("name")
				.and.iPressOK();

			// Assertions
			Then.onPageWithRTA.iShouldSeeTheElement(sNameFieldId);
			Then.onAnyPage.theGroupElementHasTheCorrectIndex(sIdentifierFieldId, sNameFieldId, false, "formElements");
		});

		opaTest("Moving a Field via Cut and Paste to a GroupElement", function(Given, When, Then) {
			//Actions
			When.onPageWithRTA.iRightClickOnAnElementOverlay(sNameFieldId)
				.and.iClickOnAContextMenuEntry(3)
				.and.iRightClickOnAnElementOverlay(sDescriptionFieldId)
				.and.iClickOnAContextMenuEntry(4);

			// Assertions
			Then.onAnyPage.theGroupElementHasTheCorrectIndex(sDescriptionFieldId, sNameFieldId, false, "formElements");
		});

		opaTest("Moving a Field via Cut and Paste to a Group", function(Given, When, Then) {
			//Actions
			When.onPageWithRTA.iRightClickOnAnElementOverlay(sNameFieldId)
				.and.iClickOnAContextMenuEntry(3)
				.and.iRightClickOnAnElementOverlay(sTechnicalDataGroupId)
				.and.iClickOnAContextMenuEntry(5);

			// Assertions
			Then.onAnyPage.theGroupElementHasTheFirstIndex(sNameFieldId, "formElements");
		});

		opaTest("Creating a new Group", function(Given, When, Then) {
			//Actions
			When.onPageWithRTA.iRightClickOnAnElementOverlay(sTechnicalDataGroupId)
				.and.iClickOnAContextMenuEntry(2);

			// Assertions
			Then.onAnyPage.iShouldSeeTheGroupByTitle(sNewGroupTitle);
		});

		opaTest("Exiting RTA", function(Give, When, Then) {
			//Actions
			When.onPageWithRTA.iExitRtaMode();

			// Assertions
			Then.onPageWithRTA.iShouldSeeTheFLPToolbarAndChangesInLRep(iNumberOfChanges, "sap.ui.demoapps.rta.fev4.Component");
		});

		opaTest("Reloading the App", function(Given, When, Then) {
			const sEncodedConnectorValue = encodeURI('[{"connector": "SessionStorageConnector"}]');

			// Arrangements
			Given.iTeardownTheAppFrame("mainShell", undefined, true, true);
			Given.iStartTheApp({
				hash: sProductHash,
				urlParameters: "sap-ui-flexibilityServices=" + sEncodedConnectorValue
			});

			// Assertions
			Then.onPageWithRTA.iShouldSeeChangesInLRepWhenTheBusyIndicatorIsGone("mainShell", undefined, iNumberOfChanges, "sap.ui.demoapps.rta.fev4.Component");
			Then.onAnyPage.iShouldSeeTheGroupElementLabel(sRenamedLabel, sIdentifierFieldId)
				.and.theChangesToTheGroupShouldStillBeThere(sTechnicalDataGroupId, sNameFieldId, sAvailabilityFieldId, 6);

			Given.iTeardownTheAppFrame("mainShell", undefined, true, true);
		});
	}
);