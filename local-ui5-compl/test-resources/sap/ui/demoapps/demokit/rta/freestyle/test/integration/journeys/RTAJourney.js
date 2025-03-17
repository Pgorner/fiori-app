/* global QUnit */
sap.ui.define([
	"sap/ui/test/opaQunit",
	"sap/ui/test/Opa5",
	"./../pages/Common"
	],function(
		opaTest,
		Opa5,
		Common
		) {
		"use strict";

		QUnit.module("RTA");

		// Show the master view with product list
		opaTest("Start RTA", function(Given, When, Then) {
			var sEncodedConnectorValue = encodeURI('[{"connector": "SessionStorageConnector"}]');

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

		opaTest("Rename a Label in the SimpleForm with double-click", function(Given, When, Then) {
			var sGroupElementId = "application-masterDetail-display-component---ProductDetail--GeneralForm--generalForm--application-masterDetail-display-component---ProductDetail--GeneralForm--productLabel--FE";
			var sLabelId = "application-masterDetail-display-component---ProductDetail--GeneralForm--productLabel";
			var sLabel = "Changed by double-click";

			// Actions
			When.onPageWithRTA.iClickOnAnElementOverlay(sGroupElementId);
			When.onPageWithRTA.iClickOnAnElementOverlay(sGroupElementId)
				.and.iEnterANewName(sLabel);
			When.onPageWithRTA.iPressOnEscape();

			//Assertions
			Then.onAnyPage.iShouldSeeTheElementByText(sLabel, sLabelId);
		});

		opaTest("Rename a Label in the SmartForm via context menu", function(Given, When, Then) {
			var sId = "application-masterDetail-display-component---ProductDetail--SupplierForm--SupplierFormPerson.FirstName";
			var sId2 = "application-masterDetail-display-component---ProductDetail--SupplierForm--SupplierFormPerson.LastName";
			var sLabel = "New Value - Test";

			// Actions
			When.onAnyPage.iScrollDown("application-masterDetail-display-component---ProductDetail--ObjectSectionSupplier");
			When.onPageWithRTA.iRightClickOnAnElementOverlay(sId)
				.and.iClickOnAContextMenuEntry(0)
				.and.iEnterANewName(sLabel)
				.and.iClickOnAnElementOverlay(sId2);

			//Assertions
			Then.onAnyPage.iShouldSeeTheGroupElementByLabel(sLabel, sId);
		});

		opaTest("Delete a Field in the SmartForm", function(Given, When, Then) {
			//Actions
			var sId = "application-masterDetail-display-component---ProductDetail--SupplierForm--SupplierFormPerson.LastName";
			When.onPageWithRTA.iRightClickOnAnElementOverlay(sId)
				.and.iClickOnAContextMenuEntry(2);

			// Assertions
			Then.onPageWithRTA.iShouldNotSeeTheElement(sId);
		});

		opaTest("Add a Field in the SmartForm - addODataProperty", function(Given, When, Then) {
			//Actions
			var sId = "application-masterDetail-display-component---ProductDetail--SupplierForm--SupplierFormPerson.PhoneNumber";
			var sId2 = "application-masterDetail-display-component---ProductDetail--SupplierForm--SupplierFormPersonGroup_SEPMRA_I_ContactPersonType_FormattedContactName";
			When.onPageWithRTA.iRightClickOnAnElementOverlay(sId)
				.and.iClickOnAContextMenuEntry(1)
				.and.iSelectAFieldByBindingPathInTheAddDialog("FormattedContactName")
				.and.iPressOK();

			// Assertions
			Then.onPageWithRTA.iShouldSeeTheElement(sId2);
			Then.onAnyPage.theGroupElementHasTheCorrectIndex(sId, sId2, false);
		});

		opaTest("Add a Field in the SmartForm - reveal", function(Given, When, Then) {
			//Actions
			var sId = "application-masterDetail-display-component---ProductDetail--SupplierForm--SupplierFormPerson.PhoneNumber";
			var sId2 = "application-masterDetail-display-component---ProductDetail--SupplierForm--SupplierFormPerson.LastName";
			When.onPageWithRTA.iRightClickOnAnElementOverlay(sId)
				.and.iClickOnAContextMenuEntry(1)
				.and.iSelectAFieldByBindingPathInTheAddDialog("LastName")
				.and.iPressOK();

			// Assertions
			Then.onPageWithRTA.iShouldSeeTheElement(sId2);
			Then.onAnyPage.theGroupElementHasTheCorrectIndex(sId, sId2, false);
		});

		opaTest("Moving a Field via Cut and Paste to a GroupElement", function(Given, When, Then) {
			//Actions
			var sId = "application-masterDetail-display-component---ProductDetail--SupplierForm--SupplierFormPerson.EmailAddress";
			var sId2 = "application-masterDetail-display-component---ProductDetail--SupplierForm--SupplierFormPerson.FirstName";
			When.onPageWithRTA.iRightClickOnAnElementOverlay(sId)
				.and.iClickOnAContextMenuEntry(3)
				.and.iRightClickOnAnElementOverlay(sId2)
				.and.iClickOnAContextMenuEntry(4);

			// Assertions
			Then.onAnyPage.theGroupElementHasTheCorrectIndex(sId2, sId, false);
		});

		opaTest("Moving a Field via Cut and Paste to a Group", function(Given, When, Then) {
			//Actions
			var sId = "application-masterDetail-display-component---ProductDetail--SupplierForm--SupplierFormPerson.EmailAddress";
			var sId2 = "application-masterDetail-display-component---ProductDetail--SupplierForm--SupplierFormPersonGroup";
			When.onPageWithRTA.iRightClickOnAnElementOverlay(sId)
				.and.iClickOnAContextMenuEntry(3)
				.and.iRightClickOnAnAggregationOverlay(sId2, "formElements")
				.and.iClickOnAContextMenuEntry(5);

			// Assertions
			Then.onAnyPage.theGroupElementHasTheFirstIndex(sId);
		});

		opaTest("Exiting RTA", function(Give, When, Then) {
			var nNumberOfChanges = 6;

			//Actions
			When.onPageWithRTA.iExitRtaMode();

			// Assertions
			Then.onPageWithRTA.iShouldSeeTheFLPToolbarAndChangesInLRep(nNumberOfChanges, "sap.ui.demoapps.rta.freestyle.Component");
		});

		opaTest("Reloading the App", function(Given, When, Then) {
			var sGroupId = "application-masterDetail-display-component---ProductDetail--SupplierForm--SupplierFormPersonGroup";
			var sId = "application-masterDetail-display-component---ProductDetail--SupplierForm--SupplierFormPerson.EmailAddress";
			var sId2 = "application-masterDetail-display-component---ProductDetail--SupplierForm--SupplierFormPersonGroup_SEPMRA_I_ContactPersonType_FormattedContactName";
			var sId3 = "application-masterDetail-display-component---ProductDetail--SupplierForm--SupplierFormPerson.FirstName";
			var nNumberOfChanges = 6;

			Given.iTeardownTheAppFrame("idAppControl", "Root", true, true);

			var sEncodedConnectorValue = encodeURI('[{"connector": "SessionStorageConnector"}]');

			// Arrangements
			Given.iStartTheApp({
				hash: "product/HT-1000",
				urlParameters: "sap-ui-flexibilityServices=" + sEncodedConnectorValue
			});

			When.onAnyPage.iScrollDown("application-masterDetail-display-component---ProductDetail--ObjectSectionSupplier");

			Then.onPageWithRTA.iShouldSeeChangesInLRepWhenTheBusyIndicatorIsGone("idAppControl", "Root", nNumberOfChanges, "sap.ui.demoapps.rta.freestyle.Component");
			Then.onAnyPage.iShouldSeeTheGroupElementByLabel("New Value - Test", sId3)
				.and.theChangesToTheGroupShouldStillBeThere(sGroupId, sId, sId2, 5);
		});
		opaTest("I clear the Session Storage and tear down the app", function(Given, When, Then) {
			//Actions
			When.onPageWithRTA.clearChangesFromSessionStorage();

			// Assertions
			Then.onPageWithRTA.iShouldSeeTheFLPToolbarAndChangesInLRep(0, "sap.ui.demoapps.rta.freestyle.Component");

			Given.iTeardownTheAppFrame("idAppControl", "Root", true, true);
		});
	}
);