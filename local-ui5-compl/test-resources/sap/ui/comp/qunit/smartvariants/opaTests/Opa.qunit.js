/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/test/actions/Press",
	"test-resources/sap/ui/rta/integration/pages/Adaptation",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function (
	Opa5,
	opaTest,
	Press,
	Adaptation,
	testLibrary
) {
	"use strict";

	var SVM_ID = "__component0---IDView--__SVM01";


	Opa5.extendConfig({
		viewNamespace: "sap.ui.comp.sample.smartfilterbar_dialog",
		autoWait: true,
		enabled: false,
		async: true,
		asyncPolling: true,
		arrangements: new Opa5({
			iStartMyApp: function () {

				var sUrl = sap.ui.require.toUrl("sap/ui/comp/qunit/smartvariants/opaTests/applicationUnderTest/SmartFilterBar_Dialog.html");
				sUrl += "?sap-ui-rta-skip-flex-validation=true";
				sUrl += "&sap-ui-language=en";

				return this.iStartMyAppInAFrame(sUrl);
			},
			iEnsureMyAppIsRunning: function () {
				if (!this._myApplicationIsRunning) {
					this.iStartMyApp();
					this._myApplicationIsRunning = true;
				}
			},
			iClearTheSessionLRep: function () {
				window.sessionStorage.removeItem("sap.ui.rta.restart.CUSTOMER");
				window.sessionStorage.removeItem("sap.ui.rta.restart.USER");
			}
		}),
		actions: new Opa5({
			iPressTheAdaptUiButton: function () {
				return this.waitFor({
					id: "__component0---IDView--rtaAdaption",
					controlType: "sap.m.Button",
					actions: new Press()
				});
			}
		})
	});


	QUnit.module("SmartVariants key user perso");
	opaTest("1. start the app in RTA", function(Given, When, Then) {
		// Arrange
		Given.onPageWithRTA.clearChangesFromSessionStorage();
		Given.iClearTheSessionLRep();
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iPressTheAdaptUiButton();

		Then.onPageWithRTA.iShouldSeeTheToolbar();
		Then.onPageWithRTA.iShouldSeeTheElement(SVM_ID);
	});

	opaTest("2. check the context menue for Standard variant", function(Given, When, Then) {

		When.onPageWithRTA.iRightClickOnAnElementOverlay(SVM_ID);
		Then.onPageWithRTA.iShouldSeetheContextMenu();
		Then.onPageWithRTA.iShouldSeetheContextMenuEntries(["Save View As", "Manage Views", "Switch Views"]);
	});

	opaTest("3. create new variant and check context menu", function(Given, When, Then) {
		When.onPageWithRTA.iRightClickOnAnElementOverlay(SVM_ID);
		When.onPageWithRTA.iClickOnAContextMenuEntry(0); //save as
		Then.onSmartVariantManagement.theOpenSaveViewDialog(SVM_ID);

		// Act
		When.onSmartVariantManagement.iCreateNewVariant(SVM_ID, "KUVariant1", true, true);
		Then.onSmartVariantManagement.theVariantShouldBeDisplayed(SVM_ID, "KUVariant1");

		When.onPageWithRTA.iRightClickOnAnElementOverlay(SVM_ID);
		Then.onPageWithRTA.iShouldSeetheContextMenu();
		Then.onPageWithRTA.iShouldSeetheContextMenuEntries(["Rename", "Save View", "Save View As", "Manage Views", "Switch Views"]);
	});

	opaTest("4. open Manage views and check content", function(Given, When, Then) {
		When.onPageWithRTA.iRightClickOnAnElementOverlay(SVM_ID);
		When.onPageWithRTA.iClickOnAContextMenuEntry(3); //manage views
		Then.onSmartVariantManagement.theOpenManageViewsDialog(SVM_ID);
		Then.onSmartVariantManagement.theOpenManageViewsDialogDefaultShouldBe("KUVariant1");
		Then.onSmartVariantManagement.theOpenManageViewsDialogTitleShouldContain(["Standard", "EntityType", "KUVariant1"]);
		Then.onSmartVariantManagement.theOpenManageViewsDialogFavoritesShouldContain([true, true, true]);
		Then.onSmartVariantManagement.theOpenManageViewsDialogApplyAutomaticallyShouldContain([true, false, true]);
	});

	opaTest("5. unfavoure the EntityType, rename KUVariant1 variant, change apply auto and save changes", function(Given, When, Then) {
		When.onSmartVariantManagement.iSetFavoriteVariant("EntityType", false);
		When.onSmartVariantManagement.iRenameVariant("KUVariant1", "KURenameVariant1");
		When.onSmartVariantManagement.iApplyAutomaticallyVariant("KURenameVariant1", false);

		// Assertion
		Then.onSmartVariantManagement.theOpenManageViewsDialogTitleShouldContain(["Standard", "EntityType", "KURenameVariant1"]);
		Then.onSmartVariantManagement.theOpenManageViewsDialogDefaultShouldBe("KUVariant1");
		Then.onSmartVariantManagement.theOpenManageViewsDialogFavoritesShouldContain([true, false, true]);
		Then.onSmartVariantManagement.theOpenManageViewsDialogApplyAutomaticallyShouldContain([true, false, false]);

		When.onSmartVariantManagement.iPressTheManageViewsSave(SVM_ID);

		Then.onSmartVariantManagement.theVariantShouldBeDisplayed(SVM_ID, "KURenameVariant1");

		When.onPageWithRTA.iExitRtaMode();
	});


//------------------------------------------------------------------------------

	QUnit.module("SmartVariants end user perso");

	opaTest("1. start the app and check the initial 'My View' content", function(Given, When, Then) {
		// Arrange
		//Given.iClearTheSessionLRep();
		Given.iEnsureMyAppIsRunning();

		Then.onSmartVariantManagement.theVariantShouldBeDisplayed(SVM_ID, "KURenameVariant1");

		// Act
		When.onSmartVariantManagement.iOpenMyView(SVM_ID);

		// Assertion
		Then.onSmartVariantManagement.theMyViewShouldContain(SVM_ID, ["Standard", "KURenameVariant1"]);
	});

	opaTest("2. create a new variant and check the 'My View' Content", function(Given, When, Then) {
		// Act
		When.onSmartVariantManagement.iOpenSaveView(SVM_ID);

		// Assertion
		Then.onSmartVariantManagement.theOpenSaveViewDialog(SVM_ID);

		// Act
		When.onSmartVariantManagement.iCreateNewVariant(SVM_ID, "OpaVariant1", true, true);
		Then.onSmartVariantManagement.theVariantShouldBeDisplayed(SVM_ID, "OpaVariant1");

		When.onSmartVariantManagement.iOpenMyView(SVM_ID);

		// Assertion
		Then.onSmartVariantManagement.theMyViewShouldContain(SVM_ID, ["Standard", "KURenameVariant1", "OpaVariant1"]);

		When.onSmartVariantManagement.iOpenMyView(SVM_ID); // closes
	});

	opaTest("3. open the 'Manage View' and check content", function(Given, When, Then) {

		// Act
		When.onSmartVariantManagement.iOpenMyView(SVM_ID);
		When.onSmartVariantManagement.iOpenManageViews(SVM_ID);

		// Assertion
		Then.onSmartVariantManagement.theOpenManageViewsDialog(SVM_ID);
		Then.onSmartVariantManagement.theOpenManageViewsDialogTitleShouldContain(["Standard", "EntityType", "KURenameVariant1", "OpaVariant1"]);
		Then.onSmartVariantManagement.theOpenManageViewsDialogFavoritesShouldContain([true, false, true, true]);
		Then.onSmartVariantManagement.theOpenManageViewsDialogApplyAutomaticallyShouldContain([true, false, false, true]);
		Then.onSmartVariantManagement.theOpenManageViewsDialogDefaultShouldBe("OpaVariant1");
	});

	opaTest("4. unfavoure the KURenameVariant1, rename OpaVariant1 variant, change apply auto and save changes", function(Given, When, Then) {
		// Act
		When.onSmartVariantManagement.iSetFavoriteVariant("KURenameVariant1", false);
		When.onSmartVariantManagement.iRenameVariant("OpaVariant1", "AOpaRenameVariant1");
		When.onSmartVariantManagement.iApplyAutomaticallyVariant("AOpaRenameVariant1", false);

		// Assertion
		Then.onSmartVariantManagement.theOpenManageViewsDialogTitleShouldContain(["Standard", "EntityType", "KURenameVariant1", "AOpaRenameVariant1"]);
		Then.onSmartVariantManagement.theOpenManageViewsDialogFavoritesShouldContain([true, false, false, true]);
		Then.onSmartVariantManagement.theOpenManageViewsDialogApplyAutomaticallyShouldContain([true, false, false, false]);

		When.onSmartVariantManagement.iPressTheManageViewsSave(SVM_ID);

		Then.onSmartVariantManagement.theVariantShouldBeDisplayed(SVM_ID, "AOpaRenameVariant1");
	});

	opaTest("5. check the 'My Views'", function(Given, When, Then) {

		// Act
		When.onSmartVariantManagement.iOpenMyView(SVM_ID);

		// Assertion
		Then.onSmartVariantManagement.theMyViewShouldContain(SVM_ID, ["Standard", "AOpaRenameVariant1"]);

		When.onSmartVariantManagement.iOpenMyView(SVM_ID); // closes
	});

	opaTest("6. reopen the 'Manage View' and check content", function(Given, When, Then) {

		// Act
		When.onSmartVariantManagement.iOpenMyView(SVM_ID);
		When.onSmartVariantManagement.iOpenManageViews(SVM_ID);

		// Assertion
		Then.onSmartVariantManagement.theOpenManageViewsDialog(SVM_ID);
		Then.onSmartVariantManagement.theOpenManageViewsDialogTitleShouldContain(["Standard",  "AOpaRenameVariant1", "EntityType", "KURenameVariant1"]);
		Then.onSmartVariantManagement.theOpenManageViewsDialogFavoritesShouldContain([true, true, false, false]);
		Then.onSmartVariantManagement.theOpenManageViewsDialogApplyAutomaticallyShouldContain([true, false, false, false]);
		Then.onSmartVariantManagement.theOpenManageViewsDialogDefaultShouldBe("AOpaRenameVariant1");
	});

	opaTest("7. remove OpaRenameVariant1 variant and save change", function(Given, When, Then) {

		// Act
		When.onSmartVariantManagement.iRemoveVariant("AOpaRenameVariant1");

		// Assertion
		Then.onSmartVariantManagement.theOpenManageViewsDialogTitleShouldContain(["Standard", "EntityType", "KURenameVariant1"]);
		Then.onSmartVariantManagement.theOpenManageViewsDialogFavoritesShouldContain([true, false, false]);
		Then.onSmartVariantManagement.theOpenManageViewsDialogDefaultShouldBe("Standard");

		When.onSmartVariantManagement.iPressTheManageViewsSave(SVM_ID);
		Then.onSmartVariantManagement.theVariantShouldBeDisplayed(SVM_ID, "Standard");
	});

	opaTest("8. check the 'My Views'", function(Given, When, Then) {

		// Act
		When.onSmartVariantManagement.iOpenMyView(SVM_ID);

		// Assertion
		Then.onSmartVariantManagement.theMyViewShouldContain(SVM_ID, ["Standard"]);

		When.onSmartVariantManagement.iOpenMyView(SVM_ID); // closes
	});
});
