/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(
	["sap/ui/test/OpaBuilder", "sap/ui/test/Opa5", "sap/fe/test/Utils", "sap/ui/test/actions/Press"],
	function (OpaBuilder, Opa5, Utils, Press) {
		"use strict";

		/**
		 * Constructs a test page definition for the shell.
		 * @class Provides a test page definition for the shell.
		 *
		 * When using {@link sap.fe.test.JourneyRunner}, this page is made available by default via <code>onTheShell</code>.
		 * @param {...object} [aAdditionalPageDefinitions] Additional custom page functions, provided in an object containing <code>actions</code> and <code>assertions</code>
		 * @returns {sap.fe.test.Shell} A shell page definition
		 * @name sap.fe.test.Shell
		 * @public
		 */
		function ShellPage(aAdditionalPageDefinitions) {
			aAdditionalPageDefinitions = Array.isArray(arguments[0]) ? arguments[0] : Array.prototype.slice.call(arguments, 0);
			return Utils.mergeObjects.apply(
				Utils,
				[
					{
						actions: {
							/**
							 * Navigates back via shell back button.
							 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
							 * @function
							 * @name sap.fe.test.Shell#iNavigateBack
							 * @public
							 */
							iNavigateBack: function () {
								return OpaBuilder.create(this)
									.hasId("backBtn")
									.doPress()
									.description("Navigating back via shell")
									.execute();
							},
							/**
							 * Navigates to the launch pad via the home button.
							 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
							 * @function
							 * @name sap.fe.test.Shell#iNavigateHome
							 * @public
							 */
							iNavigateHome: function () {
								return OpaBuilder.create(this)
									.hasId("shell-header")
									.do(function () {
										// the logo is not a UI5 control
										var oTestWindow = Opa5.getWindow();
										oTestWindow.document.getElementById("shell-header-logo").click();
									})
									.description("Pressing Home button in Shell header")
									.execute();
							},
							/**
							 * Opens the navigation menu in the shell header.
							 * @param {string} [NavigationTitle] The title of the navigation menu to be clicked. If undefined the menu is identified by the internal id only.
							 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
							 * @function
							 * @name sap.fe.test.Shell#iOpenNavigationMenu
							 * @public
							 */
							iOpenNavigationMenu: function (NavigationTitle) {
								return OpaBuilder.create(this)
									.pollingInterval(1000) // the shell needs some time to prepare the navigation menu
									.hasId("shellAppTitle")
									.has(function (oShellObject) {
										return NavigationTitle ? oShellObject.getText() === NavigationTitle : true;
									})
									.doPress()
									.description("Expanding Shell Navigation Menu")
									.execute();
							},
							/**
							 * Navigates via a navigation item in the shell's navigation menu.
							 * @param {string} sItem The label of the navigation item
							 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
							 * @function
							 * @name sap.fe.test.Shell#iNavigateViaMenu
							 * @public
							 */
							iNavigateViaMenu: function (sItem) {
								return OpaBuilder.create(this)
									.hasId("sapUshellNavHierarchyItems")
									.doOnAggregation("items", OpaBuilder.Matchers.properties({ title: sItem }), OpaBuilder.Actions.press())
									.description(Utils.formatMessage("Navigating to '{0}' via Shell Navigation Menu", sItem))
									.execute();
							},
							/**
							 * Selecting a tile in the launchpad by its target app, for example <code>iPressTile("SalesOrder-manage")</code>.
							 * @param {string} sTarget The target application (hash)
							 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
							 * @function
							 * @name sap.fe.test.Shell#iPressTile
							 * @public
							 */
							iPressTile: function (sTarget) {
								return this.waitFor({
									controlType: "sap.ushell.ui.launchpad.VizInstanceCdm",
									matchers: function (oTile) {
										return oTile.getTargetURL() === "#" + sTarget;
									},
									actions: new Press(),
									success: function () {
										Opa5.assert.ok(true, Utils.formatMessage("Clicking on tile with target '{0}'", sTarget));
									},
									errorMessage: "Could not find the tile"
								});
							},
							iOpenDefaultValues: function () {
								return OpaBuilder.create(this)
									.hasId("userActionsMenuHeaderButton")
									.doPress()
									.description("Opening FLP Default Values dialog")
									.execute();
							},
							iEnterAValueForUserDefaults: function (oField, vValue) {
								return OpaBuilder.create(this)
									.hasProperties({
										name: oField.field
									})
									.isDialogElement()
									.doEnterText(vValue)
									.description("Entering text in the field '" + oField.field + "' with value '" + oField + "'")
									.execute();
							},
							iSelectAListItem: function (sOption) {
								return OpaBuilder.create(this)
									.hasType("sap.m.StandardListItem")
									.hasProperties({ title: sOption })
									.doPress()
									.description("Selecting item: " + sOption)
									.execute();
							},
							iLaunchExtendedParameterDialog: function () {
								return OpaBuilder.create(this)
									.hasType("sap.m.Button")
									.isDialogElement()
									.hasProperties({
										text: "Additional Values"
									})
									.doPress()
									.description("Launching Extended Parameter Dialog")
									.execute();
							},
							iClickOnButtonWithText: function (sText) {
								return OpaBuilder.create(this)
									.hasType("sap.m.Button")
									.hasProperties({
										text: sText
									})
									.doPress()
									.description("Clicking on button with text: " + sText)
									.execute();
							},
							iClickOnButtonWithIcon: function (sIcon) {
								return OpaBuilder.create(this)
									.hasType("sap.m.Button")
									.hasProperties({
										icon: "sap-icon://" + sIcon
									})
									.doPress()
									.description("Clicking on button with icon: " + sIcon)
									.execute();
							}
						},
						assertions: {
							iSeeFlpDashboard: function () {
								return OpaBuilder.create(this).hasId("mainShell").description("Seeing FLP Dashboard").execute();
							},
							iShouldSeeTheAppTile: function (sTitle) {
								return OpaBuilder.create(this)
									.hasType("sap.ushell.ui.launchpad.VizInstanceCdm")
									.hasProperties({
										targetURL: sTitle
									})
									.description("Seeing Tile " + sTitle)
									.execute();
							},
							iSeeNavigateBack: function () {
								return OpaBuilder.create(this).hasId("backBtn").description("I see the back navigation button").execute();
							},
							iSeeShellNavHierarchyItem: function (sItemTitle, iItemPosition, iItemNumbers, sItemDesc) {
								return OpaBuilder.create(this)
									.viewId(null)
									.hasId("backBtn")
									.hasId("sapUshellNavHierarchyItems")
									.hasAggregationLength("items", iItemNumbers)
									.has(OpaBuilder.Matchers.aggregationAtIndex("items", iItemPosition - 1))
									.hasProperties({ title: sItemTitle, description: sItemDesc })
									.description(
										Utils.formatMessage(
											"Checking Navigation Hierarchy Items ({2}): Name={0}, Position={1}, Description={3}",
											sItemTitle,
											iItemPosition,
											iItemNumbers,
											sItemDesc
										)
									)
									.execute();
							},
							iSeeShellAppTitle: function (sTitle) {
								return OpaBuilder.create(this)
									.viewId(null)
									.hasId("shellAppTitle")
									.hasProperties({ text: sTitle })
									.description(sTitle + " is the Shell App Title")
									.execute();
							},
							/**
							 * Check an intent-based navigation.
							 * The function checks the semantic object and the action within the URL of an application.
							 * Optionally, further URL parameters can be checked.
							 * @param {string} sSemanticObject The semantic object of the application
							 * @param {string} sAction The action of the application
							 * @param {Array} [aURLParams] More URL parameters to be checked. The pattern is:
							 * <code><pre>
							 * 	[{
							 * 		property: &lt;expected name of URL parameter>,
							 * 		value: &lt;expected value of URL parameter>
							 *  }]
							 * </pre></code>
							 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
							 * @function
							 * @name sap.fe.test.Shell#iCheckIntentBasedNavigation
							 * @public
							 */
							iCheckIntentBasedNavigation: function (sSemanticObject, sAction, aURLParams) {
								function _hasAllURLParameters(oURLParams, aInputURLParams) {
									try {
										aInputURLParams.forEach(function (oParam) {
											if (oURLParams.hasOwnProperty(oParam.property)) {
												if (oURLParams[oParam.property][0] !== oParam.value) {
													throw "input parameter not equal to actual URL parameter";
												}
											} else {
												throw "input parameter not found in URL";
											}
										});
										return true;
									} catch (error) {
										return false;
									}
								}

								return OpaBuilder.create(this)
									.check(function () {
										var oParsedHash = Opa5.getWindow()
											.sap.ushell.Container.getService("URLParsing")
											.parseShellHash(Opa5.getWindow().document.location.hash);
										if (oParsedHash.semanticObject === sSemanticObject && oParsedHash.action === sAction) {
											return !aURLParams || _hasAllURLParameters(oParsedHash.params, aURLParams) ? true : false;
										} else {
											return false;
										}
									})
									.error(function () {
										var sHash = Opa5.getWindow().document.location.hash,
											sLogErr = "Expected properties/values: ";
										Opa5.assert.ok(false, "Current hash value: " + sHash);
										Opa5.assert.ok(false, "Expected semantic object: " + sSemanticObject);
										Opa5.assert.ok(false, "Expected action: " + sAction);
										if (aURLParams) {
											aURLParams.forEach(function (oParam) {
												sLogErr = sLogErr + oParam.property + "=" + oParam.value + ",";
											});
											Opa5.assert.ok(false, sLogErr);
										}
									})
									.success(
										"Navigation successful. SemanticObject: " +
											sSemanticObject +
											", Action: " +
											sAction +
											" and all URL parameters are valid."
									)
									.execute();
							}
						}
					}
				].concat(aAdditionalPageDefinitions)
			);
		}

		return ShellPage;
	}
);
