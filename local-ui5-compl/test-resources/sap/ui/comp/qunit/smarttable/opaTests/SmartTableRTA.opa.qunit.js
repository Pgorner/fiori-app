sap.ui.define([
	"sap/ui/core/Lib",
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary",
	"test-resources/sap/ui/rta/integration/pages/Adaptation",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/test/matchers/Matcher",
	"sap/ui/test/actions/Press",
	"sap/ui/comp/qunit/personalization/opaTests/Assertion"
], function(
	Library,
	Opa5,
	opaTest,
	testLibrary,
	Adaptation,
	PropertyStrictEquals,
	Matcher,
	Press,
	Assertion
) {
	'use strict';


	var SmartTableRTAOpaUtils = {};


	// *** Arrangement *****************************************

	SmartTableRTAOpaUtils.Arrangement = Opa5.extend("sap.ui.comp.qunit.personalization.test.Arrangement", {});


	// *** Actions *********************************************

	SmartTableRTAOpaUtils.Action = Opa5.extend("sap.ui.comp.qunit.personalization.test.Action", {

		iPressAButton : function (oSettings) {
			oSettings = oSettings || {};
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: oSettings.property || "text",
					value: oSettings.value
				}),
				actions: new Press()
			});
		},

		iPressAnEntryInTheList : function (oSettings) {
			oSettings = oSettings || {};

			var oMatcher = new Matcher();
			oMatcher.isMatching = function(oControl) {
				return oControl.getParent().indexOfItem(oControl) === oSettings.index || 0;
			};

			return this.waitFor({
				controlType: "sap.m.ColumnListItem",
				matchers: oMatcher,
				actions: new Press()
			});
		}

	});


	// *** Assertions ******************************************

	SmartTableRTAOpaUtils.Assertion = Opa5.extend("sap.ui.comp.qunit.personalization.test.Assertion", {

		iShouldSeeAControl: function(sControlType, oSettings) {
			var aCtrl;
			return this.waitFor({
				controlType: sControlType,
				check: function() {
					var frameJQuery = Opa5.getJQuery();
					var fnCtrl = Opa5.getPlugin().getControlConstructor(sControlType);
					aCtrl = Opa5.getPlugin().getAllControlsInContainer(frameJQuery('body'), fnCtrl);
					return aCtrl.length > 0;
				},
				success: function() {
					Opa5.assert.ok(aCtrl.length > 0);
					if (oSettings.success) {
						oSettings.success(aCtrl);
					}
				}
			});
		},

		theDialogShouldBeClosed: function() {
			var aDomDialogs;
			return this.waitFor({
				check: function() {
					var frameJQuery = Opa5.getJQuery();
					var fnDialog = Opa5.getPlugin().getControlConstructor('sap.m.Dialog');
					aDomDialogs = Opa5.getPlugin().getAllControlsInContainer(frameJQuery('body'), fnDialog);
					return !aDomDialogs.length;
				},
				success: function() {
					Opa5.assert.ok(!aDomDialogs.length, "The dialog is closed");
				}
			});
		}

	});


	// *** Utils ************************************************

	SmartTableRTAOpaUtils.Utils = {

		findContentItemsInRTADialog : function(oDialog, iExpectedLength) {
			Opa5.assert.ok(oDialog && oDialog.getTitle() === Library.getResourceBundleFor("sap.ui.comp").getText("SMARTTABLE_RTA_REARRANGE_TOOLBAR_CONTENT_TITLE"));

			var aTables = oDialog.findAggregatedObjects(true, function(oControl) {
				return oControl.isA("sap.m.Table");
			}, false);

			Opa5.assert.ok(aTables.length === 1 && aTables[0].getItems().length === iExpectedLength);
			return aTables[0].getItems();
		}

	};



	// *** Tests ************************************************

	Opa5.extendConfig({
		timeout: 30,
		autoWait: true,
		arrangements: new SmartTableRTAOpaUtils.Arrangement(),
		actions: new SmartTableRTAOpaUtils.Action(),
		assertions: new SmartTableRTAOpaUtils.Assertion(),
		viewNamespace: "."
	});

	var ST_ID = "application---IDView--smarttable";

	var aToolbarContent = [
		{id: "application---IDView--sf", text: "SearchField - application---IDView--sf"},
		{id: "application---IDView--spacer", text: "ToolbarSpacer - application---IDView--spacer"},
		{id: "application---IDView--rta", text: "Button - RTA"},
		{id: "application---IDView--recr", text: "Button - Recreate TB"},
		{id: "application---IDView--menu", text: "MenuButton - My Menu"}
	];

	opaTest("Start the test application", function(Given, When, Then) {
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("test/sap/ui/comp/smarttable/SmartTableRTA.html"));

		Then.iShouldSeeAControl("sap.ui.comp.smarttable.SmartTable", {
			success: function(aCtrl){
				Opa5.assert.ok(aCtrl.length === 1 && aCtrl[0].getId() === ST_ID);

				var oToolbar = aCtrl[0].getCustomToolbar();
				Opa5.assert.ok(!!oToolbar);

				var aContent = oToolbar.getContent();
				Opa5.assert.ok(aContent.length == aToolbarContent.length + 7);
				for (var i = 3; i < aToolbarContent.length + 3; i++) {
					Opa5.assert.equal(aContent[i].getId(), aToolbarContent[i - 3].id);
				}
			}
		});
	});

	opaTest("Switch into RTA mode", function(Given, When, Then){
		When.iPressAButton({property: "tooltip", value: "RTA"});

		Then.onPageWithRTA.iShouldSeeTheToolbar();
	});

	opaTest("Check rearranging dialog in SmartTable", function(Given, When, Then) {
		When.onPageWithRTA.iRightClickOnAnElementOverlay(ST_ID);
		When.onPageWithRTA.iClickOnAContextMenuEntry(0); //Rearrange Toolbar Content

		Then.iShouldSeeAControl("sap.m.Dialog", {
			success: function(aCtrl){
				var aItems = SmartTableRTAOpaUtils.Utils.findContentItemsInRTADialog(aCtrl.length === 1 ? aCtrl[0] : null, aToolbarContent.length);

				Opa5.assert.ok(aItems.length == aToolbarContent.length);

				for (var i = 0; i < aItems.length; i++) {
					Opa5.assert.equal(aItems[i].getCells()[0].$().text(), aToolbarContent[i].text);
				}
			}
		});
	});

	opaTest("Rearrange some toolbar content", function(Given, When, Then) {
		When.iPressAnEntryInTheList({index: 2});
		When.iPressAButton({property: "icon", value: "sap-icon://expand-group"});

		aToolbarContent.push(aToolbarContent.splice(2,1)[0]);

		Then.iShouldSeeAControl("sap.m.Dialog", {
			success: function(aCtrl){
				var aItems = SmartTableRTAOpaUtils.Utils.findContentItemsInRTADialog(aCtrl.length === 1 ? aCtrl[0] : null, aToolbarContent.length);

				for (var i = 0; i < aItems.length; i++) {
					Opa5.assert.equal(aItems[i].getCells()[0].$().text(), aToolbarContent[i].text);
				}
			}
		});

	});

	opaTest("Check and close the Dialog and cleanup", function(Given, When, Then) {
		When.iPressAButton({property: "text", value: Library.getResourceBundleFor("sap.m").getText("P13NDIALOG_OK")});

		Then.theDialogShouldBeClosed();

		Then.iShouldSeeAControl("sap.ui.comp.smarttable.SmartTable", {
			success: function(aCtrl){
				Opa5.assert.ok(aCtrl.length === 1 && aCtrl[0].getId() === ST_ID);

				var oToolbar = aCtrl[0].getCustomToolbar();
				Opa5.assert.ok(!!oToolbar);

				var aContent = oToolbar.getContent();
				Opa5.assert.ok(aContent.length == aToolbarContent.length + 7);
				for (var i = 3; i < aToolbarContent.length + 3; i++) {
					Opa5.assert.equal(aContent[i].getId(), aToolbarContent[i - 3].id);
				}
			}
		});

		Then.iTeardownMyAppFrame();
	});
});

