sap.ui.define([	"sap/ui/test/Opa5",
				"sap/ui/base/Object",
				"sap/ui/test/matchers/PropertyStrictEquals",
                "sap/ui/test/matchers/AggregationFilled",
                "sap/ui/test/actions/Press",
                "sap/suite/ui/generic/template/integration/testLibrary/utils/ApplicationSettings",
                "sap/suite/ui/generic/template/integration/testLibrary/utils/Common" ],
	function(Opa5, BaseObject, PropertyStrictEquals, AggregationFilled, Press, ApplicationSettings, Common) {
		"use strict";
		return function (sViewNameAnalyticalListPage, sViewNamespaceAnalyticalListPage, ALPAssertion) {
			return {

				/**
				* Check for the visibility of the result list
				*
				* @throws {Error} Throws an error if the Smart Table could not be found
				* @return {*} success or failure
				* @public
				*/
				theTableIsVisible: function() {
					return this.waitFor({
						controlType: "sap.ui.comp.smarttable.SmartTable",
						success: function() {
							Opa5.assert.ok(true, "The Table is shown correctly on the Analytical List Page");
						},
						errorMessage: "The Smart Table couldn't be found on the Analytical List Page"
					});
				},

				/**
				* Check the number of items loaded in the AnalyticalListPage
				*
				* @param {int} iItems The number of items you expect to be loaded in the AnalyticalListPage
				* @throws {Error} Throws an error if the wrong number of items are loaded or if the table could not be found
				* @public
				*/
				//theResultListContainsTheCorrectNumberOfItems: function(iItems) {
					// Please change this function with respect to smarttable
					// var aMatchers = [
					// 	new AggregationFilled({
					// 		name: "items"
					// 	})
					// ];
					// var fnSuccess = function(oControl) {
					// 	var actualItems = oControl.getItems();
					// 	Opa5.assert.equal(actualItems.length, iItems, "All the " + iItems + " items are present in the result list");
					// };
					// return this.iWaitForResponsiveTableInAnalyticalListPage(aMatchers, fnSuccess);
				//},

				// AnalyticalListPage common assertion function
				// Please change this function with respect to smarttable
				//iWaitForTableInAnalyticalListPage: function(aMatchers, fnSuccess) {
					// var oAppParams = ApplicationSettings.getAppParameters();
					// return this.waitFor({
					// 	id: oAppParams.ALPPrefixID + "--responsiveTable",
					// 	viewName: sViewNameAnalyticalListPage,
					// 	viewNamespace: sViewNamespaceAnalyticalListPage,
					// 	matchers: aMatchers,
					// 	success: fnSuccess,
					// 	errorMessage: "The Responsive Table is not rendered correctly"
					// });
				//},

				/**
				* Check a field within the responsive table for correct values.
				*
				* @param {object} oItem This object must be filled with the data needed to find the field in the table and
				* to compare the content against a given value
				* oItem.Line (int):		Line number of table containing the field to search for (0 based)
				* oItem.Field (string):	Field name
				* oItem.Value:			Expected value of field to be compared
				* Example: theResultListFieldHasTheCorrectValue({Line:1, Field:"GrossAmount", Value:"411.50"})
				* @throws {Error} Throws an error if responsive table could not be found or if the actual value in the table
				* is not equal to the expected field value
				* @public
				*/
				//theResultListFieldHasTheCorrectValue: function (oItem) {
					// please change this function with respect to smarttable
					// var oAppParams = ApplicationSettings.getAppParameters();
					// return this.waitFor({
					// 	id: oAppParams.ALPPrefixID + "--responsiveTable",
					// 	viewName: sViewNameAnalyticalListPage,
					// 	viewNamespace: sViewNamespaceAnalyticalListPage,
					// 	matchers: [
					// 		new AggregationFilled({
					// 			name: "items"
					// 		})
					// 	],
					// 	actions: function(oControl) {
					// 		var aTableItems = oControl.getItems();
					// 		var nValue = aTableItems[oItem.Line].getBindingContext().getProperty(oItem.Field);
					// 		Opa5.assert.equal(nValue, oItem.Value, "Checking field " + oItem.Field + " with value " + nValue);
					// 	},
					// 	errorMessage: "The Smart Table is not rendered correctly"
					// });
				//},
				/**
				 * Check if currently a dialog (sap.m.Dialog) is visible.
				 *
				 * @param {String} sTitle The displayed header title of the dialog to be checked.
				 * @throws {Error} Throws an error if the dialog is not shown
				 * @return {*} success or failure
				 * @public
				 **/
				iShouldSeeTheDialogWithTitle: function(sTitle) {
					return this.iSeeTheDialogWithTitle(sTitle);
				},

				/**
				 * Check if currently a dialog (sap.m.Dialog) containing a specific content is visible.
				 *
				 * @param {String} sContent The displayed message Content of the dialog to be checked.
				 * @throws {Error} Throws an error if the dialog is not shown
				 * @return {*} success or failure
				 * @public
				 **/
				iShouldSeeTheDialogWithContent: function (sContent) {
					return this.iSeeTheDialogWithContent(sContent);
				},

				/**
				*Checks if currently a button is visible
				*
				* @param {String} sLabel The label of the button.
				* @throws {Error} Throws an error if the button is not rendered
				* @public
				*/
				iShouldSeeTheButtonWithLabel: function(sLabel){
					this.iSeeTheButtonWithLabel(sLabel);
				},

				/**
				* Check if currently a button (sap.m.button) is visible.
				*
				* @param {String} sId The id of the button as listed in the DOM. You have to pass the most right part after the "--" only.
				* @throws {Error} Throws an error if the button is not shown
				* @return {*} success or failure
				* @public
				**/
				iShouldSeeTheButtonWithId: function(sId) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sIntId = oAppParams.ALPPrefixID + "--" + sId;
					return this.waitFor({
						id: sIntId,
						matchers: new PropertyStrictEquals({
							name: "visible",
							value: true
						}),
						success: function () {
							Opa5.assert.ok(true, "The button with id" + sIntId + "is present");
						},
						errorMessage: "The button with id " + sIntId + " is not present"
					});

				},

				/**
				* Check if currently a button having a specific icon is visible.
				*
				* @param {String} sIcon The icon-id of the button as listed in the DOM.
				* @throws {Error} Throws an error if the button is not shown
				* @return {*} success or failure
				* @public
				**/
				iShouldSeeTheButtonWithIcon: function(sIcon) {
					return this.iSeeTheButtonWithIcon(sIcon);
				},

				/**
				 * Check for the count in the IconTabBar
				 *
				 * @param {int} iTabIndex The index of the tab in the IconTabBar.
				 * @param {int} iItems Expected number of counts in the text of the IconTab.
				 * @throws {Error} Throws an error if the IconTabBar could not be found
				 * @return {*} success or failure
				 * @public
				 */
				 theCountInTheIconTabBarHasTheCorrectValue: function(iTabIndex, iItems) {
					return this.waitFor({
						controlType: "sap.m.IconTabBar",
						success: function(oIconTabBar) {
							var oIconTabBarItem = oIconTabBar[0].getItems()[iTabIndex - 1];
							Opa5.assert.ok((oIconTabBarItem.getText().indexOf("(" + iItems.toString() + ")") > 0), "The count of " + iItems.toString() + " items is displayed correctly for Icon Tab Bar Item " + iTabIndex);
						},
						errorMessage: "The IconTabBar couldn't be found."
					});
				},

				/**
				* Check if currently a button is enabled or disabled
				*
				* @param {String} sId Id of the button
				* @param {String} bEnabled Whether button is enabled or disabled
				* @throws {Error} Throws an error if the button is not 'bEnabled'
				* @return {*} success or failure
				* @public
				**/
				checkButtonEnablement: function(sId, bEnabled) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sIntId = oAppParams.ALPPrefixID + "--" + sId;
					return this.waitFor({
						id: sIntId,
						visible: !!bEnabled,
						matchers: new PropertyStrictEquals({
							name: "enabled",
							value: !!bEnabled
						}),
						check: function(oButton) {
							if (oButton) {
								return true;
							}
							return false;
						},
						success: function() {
							Opa5.assert.ok(true, "Button is " + (bEnabled ? "enabled" : "disabled"));
						},
						errorMessage: "Button is " + (bEnabled ? "enabled" : "disabled")
					});
				},

				/**
				 * Check if the title is displayed on the Shell header
				 *
				 * @param {String} sTitle The displayed  title of the Shell header
				 * @throws {Error} Throws an error if the title is not seen
				 * @return {*} success or failure
				 * @public
				 **/
				 iSeeShellHeaderWithTitle: function (sTitle) {
					return this.iCheckShellHeaderWithTitle(sTitle);
				},

				/**
				 * Check if the message toast is shown with a correct text
				 *
				 * @param {String} sExpectedText: The text which should appear in message toast
				 * @return {*} success or failure
				 * @public
				 **/
				iShouldSeeTheMessageToastWithText: function (sExpectedText) {
					return this.iSeeTheMessageToastWithText(sExpectedText, "sap.f.DynamicPage");
				},

				/**
				 * Check if the button with provided id is not visible in the given toolbar.
				 *
				 * @param {String} sToolBarId The id of the toolbar. You have to pass the most right part after the "--" only.
				 * @param {string} sButtonId Button id with any of CRUD disabled operation. You have to pass the most right part after the "--" only.
				 * @return {*} success or failure
				 * @public
				 **/
				iShouldNotSeeTheButtonWithIdInToolbar: function(sToolBarId, sButtonId){
					var oAppParams = ApplicationSettings.getAppParameters();
					sToolBarId = oAppParams.ALPPrefixID + "--" + sToolBarId;
					sButtonId = oAppParams.ALPPrefixID + "--" + sButtonId;
					return this.iDoNotSeeTheButtonWithIdInToolbar(sToolBarId, sButtonId);
				}
			};
		};
	}
);
