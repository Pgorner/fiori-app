sap.ui.define([	"sap/ui/test/Opa5",
				"sap/ui/test/matchers/PropertyStrictEquals",
                "sap/ui/test/matchers/AggregationFilled",
                "sap/suite/ui/generic/template/integration/testLibrary/utils/ApplicationSettings"],
	function(Opa5, PropertyStrictEquals, AggregationFilled, ApplicationSettings) {
		"use strict";
		return function (sViewNameObjectPage, sViewNamespaceObjectPage) {
			return {

				/**
				* Check the header title within the ObjectPage of your application, checks in both Standard Header and Dynamic Header Cases
				*
				* @param {string} sTitle The title of the header you expect for an item loaded in the ObjectPage
				* @param {string} sEntitySet The EntitySet of the currently visible UI where you are checking the Object page title
				* (you only have to provide this parameter when you are on a sub-ObjectPage in FCL mode)
				* @throws {Error} Throws an error if the expected header title was not found
				* @return {*} success or failure
				* @public
				*/
				theObjectPageHeaderTitleIsCorrect: function(sTitle, sEntitySet) {
					var sActualHeaderText;
					sEntitySet = sEntitySet ? sEntitySet + "--" : "";
					return this.waitFor({
						id: new RegExp(".*" + sEntitySet + "(objectPageHeader|template::ObjectPage::ObjectPageDynamicHeaderTitle)$"),
						success: function(oTitle) {
							if (oTitle[0].getId().match(/template::ObjectPage::ObjectPageDynamicHeaderTitle/) != null) {
								sActualHeaderText = oTitle[0].getText(); /*dynamic header*/
							} else {
								sActualHeaderText = oTitle[0].getProperty("objectTitle");	/*standard header*/
							}
							Opa5.assert.equal(sActualHeaderText,sTitle, "The Object Page header was found: " + sTitle);
						},
						errorMessage: "Did not find the expected title: " + sTitle
					});
				},

				/**
				* Check if the Object Page is in Edit mode. This assertion can be used for Create and Update scenarios
				* to check the status of the Object Page.
				*
				* @throws {Error} Throws an error if the Object Page is not in Edit mode
				* @return {*} success or failure
				* @public
				*/
				theObjectPageIsInEditMode: function() {
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageLayout",
						//viewName: sViewNameObjectPage,
						//viewNamespace: sViewNamespaceObjectPage,
						matchers:[
							function(oControl) {
								return (oControl.getModel("ui").getProperty("/editable"));
							}],
						success: function() {
							Opa5.assert.ok(true, "The Object Page is in Edit mode");
						},
						errorMessage: "The Object Page is not in Edit mode"
					});
				},

				/**
				* Check if the Object Page is in Display mode. This assertion can be used for Create and Update scenarios
				* to check the status of the Object Page.
				*
				* @throws {Error} Throws an error if the Object Page is not in Display mode
				* @return {*} success or failure
				* @public
				*/
				theObjectPageIsInDisplayMode: function() {
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageLayout",
						viewName: sViewNameObjectPage,
						viewNamespace: sViewNamespaceObjectPage,
						matchers:[
							function(oControl) {
								return (!oControl.getModel("ui").getProperty("/editable"));
							}],
						success: function() {
							Opa5.assert.ok(true, "The Object Page is in Display mode");
						},
						errorMessage: "The Object Page is not in Display mode"
					});
				},

				/**
				* Check the sections within the Object Page.
				*
				* @param {array} aSections Array of sections to be checked. You can check all or only some of the sections.
				* The sections are identified by their label, so you have to pass the i18n content of the sections within the array.
				* @throws {Error} Throws errors if a section could not be found
				* @return {*} success or failure
				* @public
				*/
				iShouldSeeTheSections: function(aSections) {
					return this.waitFor({
						timeout: 90,
						controlType: "sap.uxap.ObjectPageSection",

						success: function(aObjectPageSections) {
							var bFound = false;
							if (aObjectPageSections.length >= aSections.length) {
								Opa5.assert.ok(true, "Number of sections in the ObjectPage: " + aObjectPageSections.length + ", Number of sections to be checked: " + aSections.length);
							} else {
								Opa5.assert.ok(false, "Number of sections to be checked (" + aSections.length + ") cannot be higher than number of sections available in the ObjectPage (" + aObjectPageSections.length + ")");
							}
							for (var i = 0; i < aSections.length; i++) {
								for (var j = 0; j < aObjectPageSections.length; j++) {
									if (aObjectPageSections[j].getTitle() === aSections[i]) {
										bFound = true;
										Opa5.assert.ok(true, "Section " + aSections[i] + " found.");
										break;
									}
								}
								if (!bFound) {
									Opa5.assert.ok(false, "Section " + aSections[i] + " not found on the ObjectPage.");
								} else {
									bFound = false;
								}
							}
						},
						errorMessage: "Did not find object page section "
					});
				},

				/**
				* Check the index of the section within the Object Page.
				*
				* @param {int} iIndex index of the section within the Object page layout
				* @param {String} sTitle Title of the section. The section is identified by the title, so you have to pass the i18n content of the section.
				* @param {string} sEntitySet The EntitySet of the Object page where you are checking the section.  
				* You only have to provide this parameter when more than one Object Page is active at same time. Eg: FCL mode
				* @throws {Error} Throws errors if a section could not be found
				* @return {*} success or failure
				* @public
				*/
				iCheckTheIndexOfTheSectionIsCorrect: function(iIndex, sTitle, sEntitySet) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sId = sEntitySet ? oAppParams.OPNavigation + sEntitySet + "--objectPage" : oAppParams.OPPrefixID + "--objectPage";
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageLayout",
						id: sId,
						success: function(oObjectPage) {
							var aObjectPageSections = oObjectPage.getSections();
							for (var i = 0; i < aObjectPageSections.length; i++) {
								if (aObjectPageSections[i].getTitle() === sTitle && iIndex === i) {
									Opa5.assert.ok(true, "The Section '" + sTitle + "' is found at the position with index " + iIndex);
									return null;
								}
							}
							Opa5.assert.notOk(true, "The Section '" + sTitle + "' is not found at the position with index " + iIndex);
							return null;
						},
						errorMessage: "Object Page Layout not found"
					});
				},

				/**
				* Check if a field exists on the ObjectPage and compare properties.
				* Example:
				* .iShouldSeeTheDataField("OpportunityID", {
				* 	Enabled   : true,
				*	Editable  : true,
				*	Mandatory : false
				* })
				*
				* @param {string} sField Name of the field from the $metadata file.
				* @param {object} oSettings Object containing properties to be checked.
				*	oSettings.Enabled (boolean): Expected setting for property Enabled (true/false)
				*	oSettings.Editable (boolean): Expected setting for property Editable (true/false)
				*	oSettings.Mandatory (boolean): Expected setting for property Mandatory (true/false)
				* @throws {Error} Throws an error if the field could not be found or if the property values are not as expected
				* @return {*} success or failure
				* @public
				*/
				iShouldSeeTheDataField: function(sField, oSettings) {
					return this.waitFor({
						id: new RegExp("::" + sField + "::Field$"),
						controlType: "sap.ui.comp.smartfield.SmartField",
						viewName: sViewNameObjectPage,
						viewNamespace: sViewNamespaceObjectPage,
						success: function(aInputs) {
							Opa5.assert.strictEqual(aInputs.length, 1, "Exactly one Input result found as expected");
							var oInput = aInputs[0];
							var oExpectedSettings = oSettings;
							if (!oExpectedSettings) {
								oExpectedSettings = {
									Enabled   : true,
									Editable  : true,
									Mandatory : false
								};
							}
							Opa5.assert.ok(true, sField + " input is shown");
							Opa5.assert.strictEqual(oInput.getEnabled(), oExpectedSettings.Enabled, sField + " Enabled State");
							Opa5.assert.strictEqual(oInput.getEditable(), oExpectedSettings.Editable, sField + " Editable State");
							Opa5.assert.strictEqual(oInput.getMandatory(), oExpectedSettings.Mandatory, sField + " Mandatory State");
						},
						errorMessage: "Did not find input " + sField
					});
				},

				/**
				* Check a field within the responsive table of the ObjectPage for correct values.
				*
				* @param {string} sTable The table containing the field which shall be checked. Please use the navigation-property of the $metadata
				* file to identify the table.
				* @param {object} oItem This object must be filled with the data needed to find the field in the table and
				* to compare the content against a given value
				* oItem.Line (int):		Line number of table containing the field to search for (0 based)
				* oItem.Field (string):	Field name
				* oItem.Value:			Expected value of field to be compared
				* @param {string} sEntitySet The EntitySet of the currently visible UI (you only have to provide this
				* parameter when you are on a sub-ObjectPage)
				* @param {string} sTableID Depending on the way your table is defined you need to provide this parameter
				* Table has its own ID: provide the ID (e.g. defined as property in the facet annotations) and leave parameter sTable empty
				* Table does not have its own ID: leave this parameter empty and provide parameter sTable as explained above
				* Example:
				* @throws {Error} Throws an error if responsive table could not be found or if the actual value in the table
				* is not equal to the expected field value
				* @return {*} success or failure
				* @public
				*/
				theObjectPageTableFieldHasTheCorrectValue: function (sTable, oItem, sEntitySet, sTableID) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sID;
					if (sTableID && sTableID.length) {
						sID = oAppParams.OPNavigation + ApplicationSettings.getNavigationPart(sTableID, sEntitySet) + "::responsiveTable";
					} else {
						sID = oAppParams.OPNavigation + ApplicationSettings.getNavigationPart(sTable, sEntitySet) + "::com.sap.vocabularies.UI.v1.LineItem::responsiveTable";
					}
					return this.waitFor({
						id: sID,
						matchers: [
							new AggregationFilled({
								name: "items"
							})
						],
						success: function(oControl) {
							var aTableItems = oControl.getItems();
							var nValue = aTableItems[oItem.Line].getBindingContext().getProperty(oItem.Field);
							Opa5.assert.equal(nValue, oItem.Value, "Checking field " + oItem.Field + " with value " + nValue + " in table " + sTable);
						},
						errorMessage: "The Smart Table is not rendered correctly"
					});
				},


				/**
				* Check a field within the ObjectPage for correct values.
				*
				* @param {object} oItem This object must be filled with the data needed to find the field on the ObjectPage and
				* to compare the content against a given value
				* oItem.Field (string):	Field name as defined in the $metadata file
				* oItem.Value:			Expected value of field to be compared
				* @throws {Error} Throws an error if the field could not be found or if the actual value
				* is not equal to the expected field value
				* @return {*} success or failure
				* @public
				*/
				theObjectPageDataFieldHasTheCorrectValue: function (oItem) {
					return this.waitFor({
						id: new RegExp("::" + oItem.Field + "::Field$"),
						controlType: "sap.ui.comp.smartfield.SmartField",
						//viewName: sViewNameObjectPage,
						//viewNamespace: sViewNamespaceObjectPage,
						success: function(aInputs) {
							//Opa5.assert.strictEqual(aInputs.length, 1, "Exactly one Input result found as expected");
							var oInput = aInputs[0];
							var sValue = oInput.getBindingContext().getProperty(oItem.Field);
							Opa5.assert.equal(sValue, oItem.Value, "Checking field " + oItem.Field + " with value " + sValue);
						},
						errorMessage: "Did not find input " + oItem.Field
					});
				},

				/**
				 * Check a field with stableId within the ObjectPage for correct values.
				 *
				 * @param {object} oItem This object must be filled with the data needed to find the field on the ObjectPage and
				 * to compare the content against a given value
				 * oItem.StableId (string): part of the stableId
				 * oItem.Field (string):	Field name as defined in the $metadata file
				 * oItem.Value:			Expected value of field to be compared
				 * @throws {Error} Throws an error if the field could not be found or if the actual value
				 * is not equal to the expected field value
				 * @return {*} success or failure
				 * @public
				 */
				theObjectPageDataFieldWithStableIdHasTheCorrectValue: function (oItem) {
					return this.waitFor({
						id: new RegExp(oItem.StableId + oItem.Field),
						controlType: "sap.ui.comp.smartfield.SmartField",
						success: function(aInputs) {
							Opa5.assert.strictEqual(aInputs.length, 1, oItem.Field + "Exactly one Input result found as expected");
							var oInput = aInputs[0];
							var sValue = oInput.getValue();
							Opa5.assert.equal(sValue, oItem.Value, "Checking field " + oItem.Field + " with value \"" + sValue + "\"");
						},
						errorMessage: "Did not find input " + oItem.Field
					});
				},

				/**
				 * Check if currently a dialog (sap.m.Dialog) containing a specific title is visible.
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
				iShouldSeeTheDialogWithContent: function(sContent) {
					return this.iSeeTheDialogWithContent(sContent);
				},

				/**
				 * Check if currently a specific button is visible on a dialog (sap.m.Dialog).
				 *
				 * @param {String} sButton The displayed button label to be checked.
				 * @throws {Error} Throws an error if the button is not shown
				 * @return {*} success or failure
				 * @public
				 **/
				iShouldSeeTheButtonOnTheDialog: function(sButton) {
					return this.iSeeTheButtonOnTheDialog(sButton);
				},

				/**
				 * Check if currently a popover (sap.m.Popover) with given title is visible.
				 *
				 * @param {String} sTitle The displayed header title of the popover to be checked.
				 * @throws {Error} Throws an error if the popover is not shown
				 * @return {*} success or failure
				 * @public
				 **/
				iShouldSeeThePopoverWithTitle: function(sTitle) {
					return this.iSeeThePopoverWithTitle(sTitle);
				},

				/**
				 * Check if currently a popover (sap.m.Popover) is visible which is having a button with a given label
				 *
				 * @param {String} sButtonlabel The displayed Button in the popover to be checked.
				 * @throws {Error} Throws an error if the popover is not shown
				 * @return {*} success or failure
				 * @public
				 **/
				iShouldSeeThePopoverWithButtonLabel: function(sButtonlabel) {
					return this.iSeeThePopoverWithButtonLabel(sButtonlabel);
				},

				/**
				 * Check if currently a specific buttons are visible on a dialog (sap.m.Dialog).
				 *
				 * @param {Array} aButton The displayed button label to be checked.
				 * @throws {Error} Throws an error if the button is not shown
				 * @return {*} success or failure
				 * @public
				 **/
				iShouldSeeTheButtonsOnTheDialog: function(aButton) {
					return this.iCheckTheButtonsOnTheDialog(aButton);
				},

				/**
				/**
				* Check if currently a button (sap.m.button) is visible.
				*
				* @param {String} sId The id of the button as listed in the DOM. You have to pass the most right part after the "--" only.
				* @param {string} sEntitySet The EntitySet of the currently visible UI (you only have to provide this
				* parameter when you are on a sub-ObjectPage)
				* @throws {Error} Throws an error if the button is not shown
				* @return {*} success or failure
				* @public
				**/
				iShouldSeeTheButtonWithId: function(sId, sEntitySet) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sIntId = (sEntitySet) ? (oAppParams.OPNavigation + sEntitySet + "--" + sId) : (oAppParams.OPPrefixID + "--" + sId);
					return this.iSeeTheButtonWithId(sIntId);
				},

				/**
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
					sToolBarId = oAppParams.OPPrefixID + "--" + sToolBarId;
					sButtonId = oAppParams.OPPrefixID + "--" + sButtonId;
					return this.iDoNotSeeTheButtonWithIdInToolbar(sToolBarId, sButtonId);
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
				* Check if currently a control is visible.
				*
				* @param {String} sId The id of the control as listed in the DOM. You have to pass the most right part after the "--" only.
				* @param {string} sEntitySet The EntitySet of the currently visible UI (you only have to provide this
				* parameter when you are on a sub-ObjectPage)
				* @throws {Error} Throws an error if the control is not shown
				* @return {*} success or failure
				* @public
				**/
				iShouldSeeTheControlWithId: function(sId, sEntitySet) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sIntId = (sEntitySet) ? (oAppParams.OPNavigation + sEntitySet + "--" + sId) : (oAppParams.OPPrefixID + "--" + sId);
					return this.iSeeTheControlWithId(sIntId);
				},

				/**
				* Check by ID if a specific button is enabled or not.
				*
				* @param {String} sId The id of the button as listed in the DOM. You have to pass the most right part after the "--" only.
				* @param {Boolean} bEnabled Check if the button is enabled (true) or not enabled (false).
				* @throws {Error} Throws an error if the button could not be found
				* @return {*} success or failure
				* @public
				**/
				theButtonWithIdIsEnabled: function(sId, bEnabled) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sIntId = oAppParams.OPPrefixID + "--" + sId;
					//following check is to handle case of undefined, because when this function was created bEnabled was not passed, so there will be apps that don't send second parameter and expect the function to work for enabled buttons.
					bEnabled = (bEnabled !== false) ? true : false;
					return this.theBtnWithIdIsEnabled(sIntId, bEnabled);
				},

				/**
				* Check by label if a specific button is enabled or not.
				*
				* @param {String} sLabel The label of the button as shown on the UI.
				* @param {Boolean} bEnabled Check if the button is enabled (true) or not enabled (false).
				* @throws {Error} Throws an error if the button could not be found
				* @return {*} success or failure
				* @public
				**/
				theButtonWithLabelIsEnabled: function(sLabel, bEnabled) {
					return this.theBtnWithLabelIsEnabled(sLabel, bEnabled);
				},

				/**
				 * Checks if currently a button is visible
				 *
				 * @param {String} sLabel The label of the button.
				 * @throws {Error} Throws an error if the button is not rendered
				 * @public
				**/
				iShouldSeeTheButtonWithLabel: function(sLabel){
					return this.iSeeTheButtonWithLabel(sLabel);
				},

				/**
				*Checks if currently a MenuItem is visible
				*
				* @param {String} sLabel The label of the MenuItem.
				* @throws {Error} Throws an error if the MenuItem is not rendered
				* @public
				*/
				iShouldSeeTheMenuItemWithLabel: function (sLabel) {
					return this.iSeeTheMenuItemWithLabel(sLabel);
				},

				/**
				 * Check if a specific list item is selected in a given table.
				 *
				 * @param {String} sTableId: The id of the table in which the ListItem property 'selected' will be checked.
				 * @param {int} iListItemIndex: The index of the ListItem in table for which the property 'selected' will be checked.
				 * @return {*} success or failure
				 * @public
				 **/
				theListItemIsSelected:function(sTableId, iListItemIndex){
					var oAppParams = ApplicationSettings.getAppParameters();
					sTableId = oAppParams.OPPrefixID + "--" + sTableId;
					return this.theListItemIsSelectedInTable(sTableId, iListItemIndex);
				},

				/**
				 * Check if the message toast is shown with a correct text
				 *
				 * @param {String} sExpectedText: The text which should appear in message toast
				 * @return {*} success or failure
				 * @public
				 **/
				iShouldSeeTheMessageToastWithText: function(sExpectedText) {
					return this.iSeeTheMessageToastWithText(sExpectedText, "sap.uxap.ObjectPageLayout");
				},

				/**
				 * Check the control with given ID is not visible on the UI
				 *
				 * @param {String} sControlId: The id of the control as listed in the DOM. You have to pass the most right part after the "--" only.
				 * @return {*} success or failure
				 * @public
				 */
				iShouldNotSeeTheControlWithId: function (sControlId) {
					var oAppParams = ApplicationSettings.getAppParameters();
					sControlId = oAppParams.OPPrefixID + "--" + sControlId;
					return this.iShouldNotSeeControlWithId(sControlId);
				},

				/**
				 * Check if section is selected or not.
				 * Pass section id or name and if it is selected section then true,
				 * else function will fail.
				 *
				 * @param {String} sSectionText: Section name or id
				 * @param {boolean} isSectionId: Should be true if passing section id
				 * @param {int} iNthOP - Nth OP on which section to be checked
				 * Pass this parameter only if you are in FCL screen. If you want check section in 2nd OP, pass iNthOP=2
				 * @return {*} success or failure
				 * @public
				 **/
				iCheckSelectedSectionByIdOrName: function(sSectionText, isSectionId, iNthOP) {
					iNthOP = iNthOP ? iNthOP - 1 : 0;
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageLayout",
						success: function(oObjectPageControl) {
							var sSelectedSectionId = oObjectPageControl[iNthOP].getSelectedSection();
							if (isSectionId) {
								Opa5.assert.equal(sSectionText, sSelectedSectionId, sSectionText + " is selected section");
								return null;
							} else {
								var aSections = oObjectPageControl[iNthOP].getSections();
								for (var i = 0; i < aSections.length; i++) {
									if ((aSections[i].getTitle() === sSectionText) && aSections[i].getId() === sSelectedSectionId) {
										Opa5.assert.equal(sSectionText, aSections[i].getTitle(), sSectionText + " is selected section");
										return null;
									}
								}
								Opa5.assert.notOk(true, sSectionText + " is not selected section");
								return null;
							}
						},
						errorMessage: "Object Page Layout not found"
					});
				},

				/**
				 * Check if focus is set on provided sId control.
				 * If focus is not set then function will fail.
				 *
				 * @param {String} sId: Id of control on which focus has to be checked
				 * @return {*} success or failure
				 * @public
				 **/
				iExpectFocusSetOnControlById: function(sId) {
					var oAppParams = ApplicationSettings.getAppParameters();
					sId = oAppParams.OPPrefixID + "--" + sId;
					return this.waitFor({
						id: sId,
						success: function (oControl) {
							var focusedDomNode = document.getElementById("OpaFrame").contentWindow.document.activeElement;
							if (focusedDomNode.id === oControl.getFocusDomRef().id) {
								Opa5.assert.ok(true, "Control with id " + sId + " is focused");
							} else {
								Opa5.assert.notOk(true, "Control with id " + sId + " is not focused");
							}
						},
						errorMessage: "Control with id " + sId + " not found"
					});
				},

				/**
				 * Check if Object Page layout is in IconTabBar mode or not.
				 * @param {boolean} bIconTabBar: Pass "true" to check if ObjectPage is in IconTabBar mode and 
				 * "false" to check if ObjectPage is not in IconTabBar mode
				 * @param {string} sEntitySet The EntitySet of the Object page where you are checking the IconTabBar value.  
				 * You only have to provide this parameter if more than one Object Page is active at same time
				 * @return {*} success or failure
				 * @public
				 **/
				iCheckObjectPageIconTabBarValue: function(bIconTabBar, sEntitySet) {
					sEntitySet = sEntitySet ? sEntitySet : "";
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageLayout",
						id: new RegExp(sEntitySet + "--objectPage$"),
						matchers: new PropertyStrictEquals({
							name: "useIconTabBar",
							value: bIconTabBar
						}),
						success: function() {
							Opa5.assert.ok(true, "The Object Page iconTabBar value is: " + bIconTabBar);
						},
						errorMessage: "The Object Page iconTabBar value is not as expected"
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
				}
			};
		};
	}
);
