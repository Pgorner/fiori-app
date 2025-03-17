sap.ui.define([	"sap/ui/test/Opa5",
				"sap/ui/base/Object",
				"sap/ui/test/matchers/PropertyStrictEquals",
                "sap/ui/test/matchers/AggregationFilled",
                "sap/ui/test/actions/Press",
                "sap/ui/test/actions/EnterText",
                "sap/suite/ui/generic/template/integration/testLibrary/utils/ApplicationSettings",
                "sap/suite/ui/generic/template/integration/testLibrary/utils/Common" ],
	function(Opa5, BaseObject, PropertyStrictEquals, AggregationFilled, Press, EnterText, ApplicationSettings, Common) {
		"use strict";
		return function (sViewNameObjectPage, sViewNamespaceObjectPage) {

			return {

				/**
				* Click on a specific line within an ObjectPage table.
				* Examples:
				* Navigate from main-ObjectPage of SaleOrder to SalesOrderItems
				* iClickTheItemInTheObjectPageTable("to_Item", 3)
				* Navigate from sub-ObjectPage of SaleOrderItems to ScheduleLines
				* iClickTheItemInTheObjectPageTable("to_SalesOrderItemSL", 0, "C_STTA_SalesOrderItem_WD_20")
				*
				* @param {string} sNavigationProperty Name of the NavigationProperty of the current EntitySet from the $metadata file.
				* This defines the target where the navigation should go to.
				* @param {int} iIndex The line number which will be used for navigation (0-based)
				* @param {string} sEntitySet The EntitySet where you navigate from (you only have to provide this
				* parameter when you navigate from a sub-ObjectPage)
				* @param {string} sTableID Depending on the way your table is defined you need to provide this parameter
				* Table has its own ID: provide the ID (e.g. defined as property in the facet annotations) and leave parameter sNavigationProperty empty
				* Table does not have its own ID: leave this parameter empty and provide parameter sNavigationProperty as explained above
				* @throws {Error} Throws an error if the smart table could not be found
				* @return {*} success or failure
				* @public
				*/
				iNavigateFromObjectPageTableByLineNo: function(sNavigationProperty, iIndex, sEntitySet, sTableID) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sID;
					if (sTableID && sTableID.length) {
						sID = oAppParams.OPNavigation + ApplicationSettings.getNavigationPart(sTableID, sEntitySet) + "::Table";
					} else {
						sID = oAppParams.OPNavigation + ApplicationSettings.getNavigationPart(sNavigationProperty, sEntitySet) + "::com.sap.vocabularies.UI.v1.LineItem::Table";
					}
					return this.waitFor({
						id: sID,
						success: function (oSmartTable) {
							var oTable = oSmartTable.getTable();
							if (oTable.isA("sap.m.Table")) {
								if (oTable.getItems().length === 0) {
									Opa5.assert.NotOk(true, "Table does not have any items");
									return null;
								}
								var oItem = oTable.getItems()[iIndex];
								oTable.fireItemPress({ listItem: oItem });
								Opa5.assert.ok(true, "The item '" + oTable.getItems()[iIndex].getBindingContext().sPath + "' was clicked successfully");
								return null;
							} else {
								if (oTable.getRows().length === 0) {
									Opa5.assert.NotOk(true, "Table does not have any items");
									return null;
								}
								var oRow = oTable.getRows()[iIndex];
								var oRowActionItem = oRow.getRowAction().getItems()[0];
								oRowActionItem.firePress({ row: oRow, item: oRowActionItem });
								Opa5.assert.ok(true, "The item '" + oTable.getRows()[iIndex].getBindingContext().sPath + "' was clicked successfully");
								return null;
							}
						},
						errorMessage: "The Smart Table is not rendered correctly"
					});
				},

				/**
				* Navigate to the sub-ObjectPage of a Fiori Elements application by using a field/value combination.
				* This simulates the click on an item in a table of the ObjectPage.
				* Examples:
				* Navigate from main-ObjectPage of SaleOrder to SalesOrderItems
				* iNavigateFromObjectPageTableByFieldValue("to_Item", {Field:"SalesOrderItem", Value:"50"})
				* Navigate from sub-ObjectPage of SaleOrderItems to ScheduleLines
				* iNavigateFromObjectPageTableByFieldValue("to_SalesOrderItemSL", {Field:"ScheduleLine", Value:"10"}, "C_STTA_SalesOrderItem_WD_20")
				*
				* @param {string} sNavigationProperty Name of the NavigationProperty from the metadata. This is the
				* target where the navigation should end in.
				* @param {object} oItem This object must be filled with the field/value information to locate the line in table.
				* oItem.Field (string):	The field to be checked for. Choose the name of the field as shown in the $metadata file
				* of the your odata-service.
				* oItem.Value (string): The value to be searched for.
				* @param {string} sEntitySet The EntitySet where you navigate from (you only have to provide this
				* parameter when you navigate from a sub-ObjectPage)
				* @param {string} sTableID Depending on the way your table is defined you need to provide this parameter
				* Table has its own ID: provide the ID (e.g. defined as property in the facet annotations) and leave parameter sNavigationProperty empty
				* Table does not have its own ID: leave this parameter empty and provide parameter sNavigationProperty as explained above
				* @throws {Error} Throws an error if the field/value combination could not be found in the ObjectPage table.
				* @return {*} success or failure
				* @public
				*/
				iNavigateFromObjectPageTableByFieldValue: function(sNavigationProperty, oItem, sEntitySet, sTableID) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sID;
					if (sTableID && sTableID.length) {
						sID = oAppParams.OPNavigation + ApplicationSettings.getNavigationPart(sTableID, sEntitySet) + "::responsiveTable";
					} else {
						sID = oAppParams.OPNavigation + ApplicationSettings.getNavigationPart(sNavigationProperty, sEntitySet) + "::com.sap.vocabularies.UI.v1.LineItem::responsiveTable";
					}
					return this.waitFor({
						id: sID,
						matchers: [
							new AggregationFilled({
								name: "items"
							})
						],
						success: function(oControl) {
							var oTableLine = {};
							var oTableLineItem = {};
							var sFound = false;
							var aTableLineItems = oControl.getItems();
							for (var i = 0; i < aTableLineItems.length && !sFound; i++) {
								oTableLineItem = aTableLineItems[i];
								oTableLine = oTableLineItem.getBindingContext().getObject();
								sFound = oTableLine[oItem.Field] === oItem.Value;
							}

							if (sFound) {
								Opa5.assert.equal(sFound, true, "The item '" + oTableLineItem.getBindingContext().sPath + "' was clicked successfully");
								oControl.fireItemPress({listItem:oTableLineItem});
							} else {
								Opa5.assert.notOk(sFound, "The item " + oItem.Field + "=" + oItem.Value + " could not be found in the table");
							}
						},
						errorMessage: "The Smart Table is not rendered correctly"
					});
				},

				/**
				 * Navigate to the sub-objectPage of a Fiori Elements application by using a field/value combination.
				 * This simulates the click on an item in the ObjectPage.
				 *
				 * @param {object} oItem This object must be filled with the field/value information to locate the line in the ListReport.
				 * oItem.Field (string):	The field to be checked for. Choose the name of the field as shown in the $metadata file
				 * of the your odata-service.
				 * oItem.Value (string): The value to be searched for.
				 * @throws {Error} Throws an error if the field/value combination could not be found in the ListReport
				 * @return {*} success or failure
				 * @public
				 */
				iNavigateFromOPListItemByFieldValue: function(oItem) {
					return this.waitFor({
						controlType: "sap.m.ColumnListItem",
						viewName: sViewNameObjectPage,
						viewNamespace: sViewNamespaceObjectPage,
						matchers: [function(oCandidateListItem) {
							var oTableLine = {};
							oTableLine = oCandidateListItem.getBindingContext().getObject();
							var sFound = false;
							for (var sName in oTableLine) {
								if ((sName === oItem.Field) && (oTableLine[sName] === oItem.Value)) {
									Opa5.assert.ok(true, "Navigate from list item '" + sName + "' with value '" + oItem.Value + "' to the Object Page");
									sFound = true;
									break;
								}
							}
							return sFound;
						}],
						actions: new Press(),
						errorMessage: "Field " + oItem.Field + " with value " + oItem.Value + " could not be located in the ListReport"
					});
				},

				/**
				* Navigate back to the previous screen
				* If the Shell back button is available then navigate back by clicking on the same otherwise a browser back navigation is performed
				* @return {*} success or failure
				* @public
				*/
				iNavigateBack: function () {
					return this.waitFor({
						controlType: "sap.ui.core.Control",
						success: function (aControls) {
							for (var i = 0; i < aControls.length; i++) {
								if (aControls[i].sId === "backBtn") {
									this.iClickTheBackBtnOnFLP();
									return null;
								}
							}
							this.navigateBack();
							return null;
						}
					});
				},

				/**
				 * Navigate to the Related app from the list of related apps 
				 *
				 * @param {int} iIndex The line number which will be used for navigation (0-based)
				 * @throws {Error} Throws an error if the related app link cannot be found on the ObjectPage header
				 * @return {*} success or failure
				 * @public
				 */
				iNavigateToRelatedApp: function(iIndex) {
					var sRelatedAppsButtonId = ApplicationSettings.getAppParameters().OPPrefixID + "--relatedApps";
					var sRelatedAppsMenuId = sRelatedAppsButtonId + "Button-" + ApplicationSettings.getAppParameters().OPPrefixID + "--realtedAppsSheet-" + iIndex;
					return this.waitFor({
						id: new RegExp(".*(objectPageHeader|template::ObjectPage::ObjectPageHeader)$"),
						success: function (aControl) {
							var aActions = aControl[0].getActions();
							for (var i = 0; i < aActions.length; i++) {
								if (aActions[i].getId() === sRelatedAppsButtonId) {
									aActions[i].firePress();
									return this.iClickTheRelatedAppMenuButton(sRelatedAppsMenuId);
								}
							}
							return null;
						},
						errorMessage: "Did not find the related app Link"
					});
				},

				/**
				 * Navigate to the Related app from the list of related apps 
				 *
				 * @param {String} sId The id of the item to be selected from the list
				 * @throws {Error} Throws an error if the related app link cannot be found with the id provided
				 * @return {*} success or failure
				 * @public
				 */
				iClickTheRelatedAppMenuButton: function(sId) {
					return this.waitFor({
						id: sId,
						matchers: new PropertyStrictEquals({
							name: "enabled",
							value: true
						}),
						success: function (oButton) {
							oButton.firePress();
							Opa5.assert.ok(true, "The Related App link was clicked successfully");
						},
						errorMessage: "The Related App link could not be found"
					});
				},


				/**
				* Click the most-right breadcrumb link to navigate back to the previous screen. Keep in mind that clicking a breadcrumb link is
				* a forward navigation - it´s not the same as clicking the browser back button.
				*
				* @throws {Error} Throws an error if the ObjectPage header could not be found.
				* @return {*} success or failure
				* @public
				*/
				iClickTheLastBreadCrumbLink: function() {
					return this.waitFor({
						id: new RegExp(".*(objectPageHeader|template::ObjectPage::ObjectPageHeader)$"),
						success: function(oCandidate) {
							var oBreadCrumb = oCandidate[oCandidate.length - 1].getBreadcrumbs && oCandidate[oCandidate.length - 1].getBreadcrumbs().getLinks();
							if (oBreadCrumb.length > 0) {
								oBreadCrumb[oBreadCrumb.length - 1].firePress();
								Opa5.assert.ok(true, "Breadcrumb link pressed successfully");
							} else {
								Opa5.assert.notOk(true, "Did not find a BreadCrumb link on the UI");
							}
						},
						errorMessage: "Did not find an object page header"
					});
				},

				/**
				* Click on the Edit button to edit an active item.
				* Precondition: The mockserver of your application has to be prepared to handle edit requests.
				*
				* @throws {Error} Throws an error if the button for editing an item could not be found on the UI
				* @return {*} success or failure
				* @public
				*/
				iClickTheEditButton: function () {
					var sEditButtonId = ApplicationSettings.getAppParameters().OPPrefixID + "--edit";
					return this.waitFor({
						/*controlType: "sap.uxap.ObjectPageHeader",*/
						 id: new RegExp(".*(objectPageHeader|template::ObjectPage::ObjectPageHeader)$"),
						 success: function (aControl) {
							var aActions = aControl[0].getActions();
							for (var i = 0; i < aActions.length; i++) {
								if (aActions[i].getId() === sEditButtonId && aActions[i].getVisible() && aActions[i].getEnabled()) {
									aActions[i].firePress();
									Opa5.assert.ok(true, "The Edit button was clicked successfully");
									return;
								}
							}
							Opa5.assert.notOk(true, "The Edit button is either not visible or enabled");
						},
						errorMessage: "The button to edit an item could not be found"
					});
				},

				/**
				 * Set the property value in a given table.
				 *
				 * @param {String} sTableId: The id of the table in which the property value will be applied. You have to pass the most right part after the "--" only.
				 * @param {string} sPropertyName: Property name for which the value would be set. You have to pass the most right part after the "--" only.
				 * @param {string/int/boolean} sPropertyValue: Actual value(string, boolean, int etc..) of the property that will be passed and applied for sPropertyName.
				 * @return {*} success or failure
				 * @public
				 **/
				iSetThePropertyInTable: function(sTableId, sPropertyName, sPropertyValue){
					var oAppParams = ApplicationSettings.getAppParameters();
					sTableId = oAppParams.OPPrefixID + "--" + sTableId;
					return this.iSetThePropertyValueInTable(sTableId,sPropertyName,sPropertyValue);
				},
				/**
				* Cancel a draft. This function clicks on the Cancel button in a draft object and then it commits the discard action of the popup.
				*
				* @param {Boolean} bNoChanges true (does not commits discard action of the popup) or false (commits discard action of the popup)
				* @param {string} sId Id of the button to be clicked. No need to pass this parameter when you call this function from the test
				* @throws {Error} Throws an errors if the Cancel or Discard button could not be found
				* @return {*} success or failure
				* @public
				*/
				iCancelTheDraft: function (bNoChanges, sId) {
					var sCancelButtonId = ApplicationSettings.getAppParameters().OPPrefixID + "--discard";
					var sDiscardButtonId = ApplicationSettings.getAppParameters().OPPrefixID + "--DiscardDraftConfirmButton";
					if (!sId) {
						sId = sCancelButtonId;
					}
					return this.waitFor({
						id: sId,
						matchers: new PropertyStrictEquals({
							name: "enabled",
							value: true
						}),
						success: function (oButton) {
							oButton.firePress();
							if (sId === sCancelButtonId) {
								Opa5.assert.ok(true, "The Cancel button was clicked successfully");
								if (!bNoChanges) {
									this.iCancelTheDraft(false, sDiscardButtonId);
								}
							} else {
								Opa5.assert.ok(true, "Cancelling the draft was confirmed successfully");
							}
						},
						errorMessage: "The " + sId + " button could not be found"
					});
				},

				/**
				* Save a draft. This function does a click on the Save button
				*
				* @param {Boolean} bNonDraft false (draft enabled application) or true (non-draft application).Default case is draft enabled application.
				* @throws {Error} Throws an errors if the Save button could not be found
				* @return {*} success or failure
				* @public
				*/
				iSaveTheDraft: function (bNonDraft) {
					var sSaveButtonId = ApplicationSettings.getAppParameters().OPPrefixID + "--activate";
					if (bNonDraft) {
						sSaveButtonId = ApplicationSettings.getAppParameters().OPPrefixID + "--save";
					}
					return this.iClickTheBtnWithId(sSaveButtonId);
				},

				/**
				 * Click on a link (sap.m.Link) in the ObjectPage.
				 *
				 * @param {String} sText The displayed link text of the link to be clicked. The test fragment will click on all links
				 * found on the UI which contain the string sText.
			 	 * @param {int} index index of the occurrence of the link. Default value is 1 if index is not provided
				 * @throws {Error} Throws an error if the link cannot be found
				 * @return {*} success or failure
				 * @public
				 **/
				iClickTheLink: function(sText, index) {
					return this.iClickTheLinkWithLabel(sText, index);
				},
				
				/**
				 * Click on a link (sap.ui.comp.navpopover.SmartLink) in the ObjectPage.
				 *
				 * @param {String} sLabel The displayed text of the SmartLink to be clicked
				 * @throws {Error} Throws an error if the link cannot be found
				 * @return {*} success or failure
				 * @public
				 **/
				iClickTheSmartLinkWithLabel: function (sLabel) {
					return this.iClickOnASmartLinkWithLabel(sLabel);
				},

				/**
				 * Click a button on a dialog (sap.m.Dialog).
				 *
				 * @param {String} sText The displayed label text of the button to be clicked.
				 * @throws {Error} Throws an error if the dialog containing the button is not shown
				 * @return {*} success or failure
				 * @public
				 **/
				iClickTheButtonOnTheDialog: function (sText) {
					return this.iClickTheDialogButtonWithLabel(sText);
				},

				/**
				 * Set a field within a FieldGroup of the ObjectPage to a new value.
				 * Precondition is that the ObjectPage is in Edit mode.
				 *
				 * @param {String} sFieldGroup Name of the FieldGroup which contains the field to be changed. This is the field group name as it is defined in the
				 * target property of the faced definition of your annotations.
				 * @param {String} sFieldName Name of the field to be changed. The name of the field as defined in your metadata file.
				 * @param {String} sValue New value to be set for the field
				 * @param {String} sFieldGroupID Unique ID of the FieldGroup. If you set this parameter it will overrule the sFieldGroup defined as first parameter.
				 * In this case you should have defined a unique ID for the FieldGroup within your application.
				 * @throws {Error} Throws an error if the field could not be identified.
				 * @return {*} success or failure
				 * @public
				 **/
				iSetTheObjectPageDataField: function (sFieldGroup, sFieldName, sValue, sFieldGroupID) {
					var sID;
					if (sFieldGroupID && sFieldGroupID.length) {
						sID = ApplicationSettings.getAppParameters().OPPrefixID + "--" + sFieldGroupID + "::" + sFieldName + "::Field";
					} else {
						sID = ApplicationSettings.getAppParameters().OPPrefixID + "--com.sap.vocabularies.UI.v1.FieldGroup::" + sFieldGroup + "::" + sFieldName + "::Field";
					}
					return this.waitFor({
						id: sID,
						matchers: new PropertyStrictEquals({
							name: "editable",
							value: true
						}),
						actions: new EnterText({
							text: sValue
						}),
						success: function() {
								Opa5.assert.ok(true, "Field '" + sFieldName + "' in Field-Group '" + sFieldGroup + "' was changed successfully to new value '" + sValue + "'");
							},
						errorMessage: "The field " + sFieldName + " is not rendered correctly"
					});
				},

				/**
				 * Set an input field within the ObjectPage to a new value.
				 *
				 * @param {String} sFieldID The id of the field to be set to a new value. You have to pass the most right part after the "--" only.
				 * @param {String} sValue New value of the field.
				 * @throws {Error} Throws an error if the field could not be identified.
				 * @return {*} success or failure
				 * @public
				 **/
				iSetTheInputFieldWithId: function (sFieldID, sValue) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sId = oAppParams.OPPrefixID + "--" + sFieldID;
					return this.iSetInputFieldWithId(sId, sValue);
				},

				 /**
				 * This test can be used to close the current ObjectPage. If your application runs under Flexible Column Layout the test tries to find the Close button
				 * in the ObjectPage-Header. Otherwise the test just navigates back to the previous UI by Windows/Back.
				 *
				 * @throws {Error} Throws an error if closing the ObjectPage fails.
				 * @return {*} success or failure
				 * @public
				 **/
				iCloseTheObjectPage: function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						success: function(aButtons) {
							//Find overflow button of ObjectPage header
							var oMoreButton;
							aButtons.forEach(function(oButton) {
								if (oButton.getId() === ApplicationSettings.getAppParameters().OPPrefixID + "--objectPageHeader-overflow" ||
										oButton.getId() === ApplicationSettings.getAppParameters().OPPrefixID + "--template::ObjectPage::ObjectPageHeader-_actionsToolbar-overflowButton") {
									oMoreButton = oButton;
								}
							});
							// If there is more button fire press event
							if (oMoreButton) {
								oMoreButton.firePress();
							}
							this.waitFor({
								controlType: "sap.m.Button",
								success: function(aInnerButtons) {
									var oCloseButton;
									var oNavBackButton;
									aInnerButtons.forEach(function(oButton) {
										if (oButton.getText() === "Close") {
											oCloseButton = oButton;
										} else if (oButton.getIcon() === "sap-icon://nav-back") {
											oNavBackButton = oButton;
										}
									});

									if (oCloseButton) {
										oCloseButton.firePress();
										Opa5.assert.ok(true, "Closing the ObjectPage was successful by clicking the Close button");
									} else if (oNavBackButton) {
										oNavBackButton.firePress();
										Opa5.assert.ok(true, "Closing the ObjectPage was successful by clicking the Back button");
									} else {
										this.iNavigateBack();
										Opa5.assert.ok(true, "Closing the ObjectPage was successful by back navigation");
									}
								},
								errorMessage: "Error on closing the ObjectPage or navigating back to ListReport"
							});
						},
						errorMessage: "Error on identifying overflow button"
					});
				},

				/**
				 * Click a link (sap.m.Link) which has a specific id.
				 *
 				 * @param {String} sId The id of the link as listed in the DOM. You have to pass the most right part after the "--" only.
				 * @throws {Error} Throws an error if the link is not rendered or clicked
				 * @return {*} success or failure
				 * @public
				 **/
				iClickTheLinkWithId: function (sId) {
					var sLinkId = ApplicationSettings.getAppParameters().OPPrefixID + "--" + sId;
					return this.iClickTheLnkWithId(sLinkId);
				},

				/**
				 * Click a button (sap.m.Button) which has a specific id.
				 *
 				 * @param {String} sId The id of the button as listed in the DOM. You have to pass the most right part after the "--" only.
				 * @param {string} sEntitySet The EntitySet of the currently visible UI (you only have to provide this
				 * parameter when you are on a sub-ObjectPage)
				 * @throws {Error} Throws an error if the button is not rendered or clicked
				 * @return {*} success or failure
				 * @public
				 **/
				iClickTheButtonWithId: function (sId, sEntitySet) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sIntId = (sEntitySet) ? (oAppParams.OPNavigation + sEntitySet + "--" + sId) : (oAppParams.OPPrefixID + "--" + sId);

					return this.iClickTheBtnWithId(sIntId);
				},

				/**
				 * Click a button (sap.m.Button) having a specific icon.
				 *
 				 * @param {String} sIcon The icon assigned to the button.
				 * @throws {Error} Throws an error if the button is not rendered or clicked
				 * @return {*} success or failure
				 * @public
				 **/
				iClickTheButtonWithIcon: function (sIcon) {
					return this.iClickTheBtnWithIcon(sIcon);
				},

				/**
				 * Click a button (sap.m.Button).
				 *
				 * @param {String} sLabelText The displayed label text of the button to be clicked.
				 * @param {int} iIndex The index of the button having label in case there are multiple matches. Default is 0 for backward compatibility
				 * @throws {Error} Throws an error if the button is not rendered or clicked
				 * @return {*} success or failure
				 * @public
				 **/
				iClickTheButtonHavingLabel: function (sLabelText, iIndex) {
					return this.iClickTheButtonWithLabel(sLabelText, iIndex);
				},

				/**
				 * Click Overflow Toolbar Button, ex: Click on + on table, click on settings/personalization button on table.
				 *
				 * @param {String} sButtonName The displayed label text of the button to be clicked.
				 * @throws {Error} Throws an error if the Overflow Toolbar Button with visible label sButtonName is not rendered/clicked
				 * @return {*} success or failure
				 * @public
				 **/
				iClickTheOverflowToolbarButton: function (sButtonName) {
					return this.iSelectTheOverflowToolbarButton(sButtonName);
				},

				/**
				 * Select Item from Combo Box Dropdown, ex: Choose Item under Table Personalisation->Group->Combo Box to set the Group By.
				 *
				 * @param {String} sItem is the Item to be chosen from the Combo Box Dropdown.
				 * @param {String} sLabel is the Label of the Combo Box Filter. If not passed, latest found Combobox control will be selected.
				 * @throws {Error} Throws an error if the sItem could not be selected
				 * @throws {Error} Throws an error if the Combo Box is not found
				 * @return {*} success or failure
				 * @public
				 **/
				iChoosetheItemInComboBox: function (sItem, sLabel) {
					return this.iChoosetheItemFromComboBox(sItem, sLabel);
				},

				/**
				 * Click a control which has a specific id.
				 *
 				 * @param {String} sId The id of the control as listed in the DOM. You have to pass the most right part after the "--" only.
				 * @param {string} sEntitySet The EntitySet of the currently visible UI (you only have to provide this
				 * parameter when you are on a sub-ObjectPage)
				 * @throws {Error} Throws an error if the control is not rendered or clicked
				 * @return {*} success or failure
				 * @public
				 **/
				iClickTheControlWithId: function (sId, sEntitySet) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sIntId = (sEntitySet) ? (oAppParams.OPNavigation + sEntitySet + "--" + sId) : (oAppParams.OPPrefixID + "--" + sId);

					return this.iClickTheCtrlWithId(sIntId);
				},

				/**
				 * Click a control which contains the given id.
				 * The function uses RegEx to find the control with the given id part. The first control which matches partially with the given id will be considered.
					 * @param {String} sId The part of the id of the control as listed in the DOM.
				 * @throws {Error} Throws an error if the control is not rendered or clicked
				 * @return {*} success or failure
				 * @public
				 **/
				iClickTheControlWhichContainsId: function (sId) {
					return this.iClickTheCtrlWhichContainsId(sId);
				},

				/**
				 * Check a list item (sap.m.CustomListItem).
				 *
				 * @param {String} sLabelText The displayed label text of the list item to be clicked.
				 * @param {String} bState CheckBox of list item should be checked (true) or unchecked (false).
				 * @throws {Error} Throws an error if the list item is not rendered or clicked
				 * @return {*} success or failure
				 * @public
				 **/
				iClickTheListItemWithLabel: function (sLabelText, bState) {
					return this.iClickTheLstItemWithLabel(sLabelText, bState);
				},

				/**
				 * Click the arrow icon of a MultiComboBox to open the list of selectable items
				 *
				 * @param {String} sFieldName Name of field (as shown in the $metadata file) the MultiComboBox is assigned to
				 * @throws {Error} Throws an error if the MultiComboBox could not be found
				 * @return {*} success or failure
				 * @public
				 **/
				iClickTheMultiComboBoxArrow: function (sFieldName) {
					return this.iClickTheMultiCboBoxArrow(sFieldName);
				},

				/**
				 * Select an item within a MultiComboBox item list
				 *
				 * @param {String} sFieldName Name of field (as shown in the $metadata file) the MultiComboBox is assigned to
				 * @param {String} sItem Item of the list to be selected. Choose the name of the item as it is shown on the UI.
				 * @throws {Error} Throws an error if the item could not be found in the list
				 * @return {*} success or failure
				 * @public
				 **/
				iSelectItemsFromMultiComboBox: function (sFieldName, sItem) {
					return this.iSelectItemsFromMultiCboBox(sFieldName, sItem);
				},


				/**
				* Select items in ObjectPage tables by LineNumber
				*
				* @param {array} aItemIndex An array of line numbers (0-based) to be selected
				* @param {boolean} bSelect Select (true: default) or Unselect (false) the lines
				* @param {String} sOPTableId is the part of the table's DOM id starting after --, for example "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable"
				* @param {string} sEntitySet The EntitySet of the currently visible UI (you only have to provide this
				* parameter when you are on a sub-ObjectPage)
				* @throws {Error} Throws an error if the responsive table could not be found
				* @return {*} success or failure
				* @public
				*/
				iSelectListItemsByLineNo: function(aItemIndex, bSelect, sOPTableId, sEntitySet) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sId = (sEntitySet) ? (oAppParams.OPNavigation + sEntitySet + "--" + sOPTableId) : (oAppParams.OPPrefixID + "--" + sOPTableId);
					return this.iChooseListItemsByLineNo(sId, aItemIndex, bSelect);
				},

				/**
				 * Switches the view based on the passed key when segmented button is used by configuring views via
				 * quickVariantSelection.variants in manifest. Uses the keys of the buttons that are defined in manifest.json.
				 *
				 * @param {String} sKey Key of the button, should correspond to the key defined in manifest quickVariantSelection.variants item
				 * @param {String} sNavigationProperty Name of the NavigationProperty of the table.
				 * @param {String} sEntitySet The EntitySet of the currently visible UI (you only have to provide this
				 * parameter when you are on a sub-ObjectPage)
				 * @throws {Error} Throws an error if the segmented button is not found
				 * @return {*} success or failure
				 * @public
				 **/
				iClickOnSegmentedButton: function(sKey, sNavigationProperty, sEntitySet) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sSegmentedBtnIdPrefix = sEntitySet ? oAppParams.OPNavigation + sEntitySet : oAppParams.OPPrefixID;
					var sSegmentedBtnId = sSegmentedBtnIdPrefix + "--template:::ObjectPageTable:::SegmentedButton:::sFacet::" + sNavigationProperty + ":3a:3acom.sap.vocabularies.UI.v1.LineItem";
					return this.waitFor({
						id: sSegmentedBtnId,
						actions: function(oSegmentedButton) {
							var aButtons = oSegmentedButton.getItems();
							for (var i = 0; i < aButtons.length; i++) {
								if (aButtons[i].getKey() === sKey) {
									new Press().executeOn(aButtons[i]);
									Opa5.assert.ok(true, "Segmented button with the key '" + sKey + "' is clicked");
									return null;
								}
							}
							Opa5.assert.notOk(true, "Segmented button with the key '" + sKey + "' is not found");
						},
						errorMessage: "Icon tab bar could not be found with, expected ID: " + sSegmentedBtnId
					});
				},

				/**
				 * Clicks on sap.uxap.ObjectPageHeaderActionButton Up or Down arrow based on sUpOrDown value.
				 *
				 * @param {String} sUpOrDown corresponds to the two possible values "NavigationUp" and "NavigationDown"
				 * @param {String} sEntitySet corresponds to the entityset in case the tests is meant for sub-object pages
				 * No need to maintain this in case if the tests are for main object page
				 * @throws {Error} Throws an error if the respective Navigation Action is not seen on the UI
				 * @return {*} success or failure
				 * @public
				 **/
				iNavigateUpOrDownUsingObjectPageHeaderActionButton: function(sUpOrDown, sEntitySet) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sNavigationActionId = (sEntitySet) ? (oAppParams.OPNavigation + sEntitySet + "--template::" + sUpOrDown) : (oAppParams.OPPrefixID + "--template::" + sUpOrDown);
					return this.waitFor({
						id: sNavigationActionId,
						controlType: "sap.uxap.ObjectPageHeaderActionButton",
						actions: new Press(),
						success: function () {
							Opa5.assert.ok(true, "Clicked on ObjectPageHeaderActionButton '" + sUpOrDown + "' successfully");
						},
						errorMessage: "The Up or Down Navigation ObjectPageHeaderActionButton: " + sUpOrDown + " is not rendered correctly."
					});
				},

				/**
				 * Click a the back button in an application started by using Fiori-Launchpad.
				 *
				 * @throws {Error} Throws an error if the back button could not be found
				 * @return {*} success or failure
				 * @public
				 **/
				iClickTheBackButtonOnFLP: function () {
					return this.iClickTheBackBtnOnFLP();
				},

				/**
				 * Select the Smart Variant View selection on Object Page tables
				 *
				 * @param {String} sSelectionButtonId: The id of the button representing the drop-down of the Smart Variant selection. You have to pass the most right part after the "--" only.
				 * @throws {Error} Throws an error if the back button could not be found
				 * @return {*} success or failure
				 * @public
				 **/
				iClickOnSmartVariantViewSelection: function (sSelectionButtonId) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sId = oAppParams.OPPrefixID + "--" + sSelectionButtonId;
					return this.iClickOnSmVarViewSelection(sId);
				},

				/**
			 	* Select Item from Select Dropdown, ex: Choose Item under sap.m.Select control
				*
				* @param {String} sItem is the Item to be chosen from the Select Dropdown.
			 	* @param {String} sLabel is the label of the Select Filter. If not passed, latest found Select control will be selected.
			 	* @throws {Error} Throws an error if the sItem could not be selected
				* @throws {Error} Throws an error if the Select control is not found
				* @return {*} success or failure
			 	* @public
			 	**/
				 iChoosetheItemInSelect: function (sItem, sLabel) {
					return this.iChoosetheItemFromSelectControl(sItem, sLabel);
				},
				
				/**
				 * Open the Shell Navigation Menu and click on an item from the menu items
				 *
				 * @param {String} sText: The title of the item to be clicked from the Shell Navigation Menu
				 * @throws {Error} Throws an error if the Shell Navigation Menu or item inside the Shell Navigation Menu is not found
				 * @return {*} success or failure
				 * @public
				 **/
				iClickOnItemFromTheShellNavigationMenu: function (sText) {
					return this.iClickOnItemFromShellNavigationMenu(sText);
				},
				
				/**
				* Select the Section or Subsection on the Object page with the given name
				* If only need to select Section then only pass Section name
				* If you want to select a Sub Section then pass Section name (in which that sub Section exist) along with Sub Section name.
				* @param {String} sSectionText - Section name
				* @param {String} sSubSectionText - Sub Section name
				* @param {int} iNthOP - Nth OP on which selection need to be done
				* Pass this parameter only if you are in FCL screen. If you want to do selection in 2nd OP, pass iNthOP=2
				* @return {*} success or failure of test
				**/
				iSelectSectionOrSubSectionByName: function(sSectionText, sSubSectionText, iNthOP) {
					iNthOP = iNthOP ? iNthOP - 1 : 0;
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageLayout",
						matchers: new PropertyStrictEquals({
								name: "visible",
								value: true
							}),
						success: function(oControl) {
							if (oControl && oControl.length < iNthOP + 1) {
								Opa5.assert.notOk(true, "Trying to access to \"" + (iNthOP + 1) + "\" OP not permissible as max available OP is: \"" + oControl.length + "\"");
								return null;
							}
							var aSection = oControl[iNthOP].getSections();
							for (var i = 0; i < aSection.length; i++) {
								var sTitle = aSection[i].getTitle();
								if (aSection[i].getVisible() && sTitle === sSectionText) {
									var aSubSection = aSection[i].getSubSections();
									if (!sSubSectionText) {
										oControl[iNthOP].setSelectedSection(aSection[i]);
										oControl[iNthOP].fireNavigate({
											section: aSection[i]
										});
										Opa5.assert.ok(true, "Section with name '" + sSectionText + "' is selected");
										return null;
									} else if (sSubSectionText && aSubSection.length === 1) {
										Opa5.assert.notOk(true, "Parameter invalid. Don't provide sub-section text if only one sub-section");
										return null;
									} else {
										for (var j = 0; j < aSubSection.length; j++) {
											if (aSubSection[j].getVisible() && aSubSection[j].getTitle() === sSubSectionText) {
												oControl[iNthOP].setSelectedSection(aSubSection[j]);
												oControl[iNthOP].fireNavigate({
													subSection: aSubSection[j]
												});
												Opa5.assert.ok(true, "Subsection with name '" + sSubSectionText + "' is selected in section '" + sSectionText + "'");
												return null;
											}
										}
									}
								}
							}
							Opa5.assert.notOk(true, "Object Page Layout section or subsection is either not visible or not found");
							return null;
						},
						errorMessage: "The Object Page Layout couldn't be found on the page or is not visible"
					});
				},

				/**
				* Select the Section or Subsection on the Object page with the given index
				* If only need to select Section then only pass Section index
				* If you want to select a Sub Section then pass Section index (in which that sub Section exist) along with Sub Section index.
				* @param {int} iSectionIndex - Section index
				* @param {int} iSubSectionIndex - Sub Section index
				* @param {int} iNthOP - Nth OP on which selection need to be done
				* Pass this parameter only if you are in FCL screen. If you want to do selection in 2nd OP, pass iNthOP=2
				* @return {*} success or failure of test
				**/
				iSelectSectionOrSubSectionByIndex: function(iSectionIndex, iSubSectionIndex, iNthOP) {
					iNthOP = iNthOP ? iNthOP - 1 : 0;
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageLayout",
						matchers: new PropertyStrictEquals({
								name: "visible",
								value: true
							}),
						success: function(oControl) {
							if (oControl && oControl.length < iNthOP + 1) {
								Opa5.assert.notOk(true, "Trying to access to \"" + (iNthOP + 1) + "\" OP not permissible as max available OP is: \"" + oControl.length + "\"");
								return null;
							}
							var aSection = oControl[iNthOP].getSections();
							if (aSection[iSectionIndex].getVisible()) {
								var aSubSection = aSection[iSectionIndex].getSubSections();
								if (!iSubSectionIndex) {
									oControl[iNthOP].setSelectedSection(aSection[iSectionIndex]);
									oControl[iNthOP].fireNavigate({
										section: aSection[iSectionIndex]
									});
									Opa5.assert.ok(true, "Section with index '" + iSectionIndex + "' is selected");
									return null;
								} else if (iSubSectionIndex && aSubSection.length === 1) {
									Opa5.assert.notOk(true, "Parameter invalid. Don't provide sub-section text if only one sub-section");
									return null;
								} else if (aSubSection[iSubSectionIndex].getVisible()){
									oControl[iNthOP].setSelectedSection(aSubSection[iSubSectionIndex]);
									oControl[iNthOP].fireNavigate({
										subSection: aSubSection[iSubSectionIndex]
									});
									Opa5.assert.ok(true, "Subsection with index '" + iSubSectionIndex + "' is selected in section with index '" + iSectionIndex + "'");
									return null;
								}
							}
							Opa5.assert.notOk(true, "Object Page Layout section or subsection is either not visible or not found");
							return null;
						},
						errorMessage: "The Object Page Layout couldn't be found on the page or is not visible"
					});
				},

				/**
				* Check for the Show Details button on the table toolbar and click on it if available.
				*
				* @param {string} sNavigationProperty Name of the NavigationProperty of the table.
				* @param {string} sEntitySet The EntitySet for which table belongs to (you only have to provide this
				* parameter when you are trying to click the Show Details button on a Sub Object page table)
				* @throws {Error} Throws an error if the Show details button cannot be pressed
				* @return {*} success or failure
				**/
				iClickTheShowDetailsButtonOnTheTableToolBar: function (sNavigationProperty, sEntitySet) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sSmartTableId = oAppParams.OPNavigation + ApplicationSettings.getNavigationPart(sNavigationProperty, sEntitySet) + "::com.sap.vocabularies.UI.v1.LineItem::Table";
					return this.iClickTheShowDetailsButtonOnTableToolBar(sSmartTableId);
				},

				/**
				* Select a radio button against a given option available in the Discard Draft Pop up
				* @param {string} sOption - Option for which the radio button to be selected.
				* @return {*} success or failure
				**/
				iSelectTheOptionFromDiscardDraftPopUp: function (sOption) {
					return this.waitFor({
						controlType: "sap.m.RadioButton",
						searchOpenDialogs: true,
						success: function (oRadioButtons) {
							for (var i = 0; i < oRadioButtons.length; i++) {
								if (oRadioButtons[i].getParent().getContent()[0].getItems()[0].getText() === sOption) {
									oRadioButtons[i].setSelected(true);
									oRadioButtons[i].fireSelect({ selected: true });
									Opa5.assert.ok(true, "Radio button for the option '" + sOption + "' is selected from the Discard Draft pop up");
									return null;
								}
							}
							Opa5.assert.notOk(true, "Radio button for the option '" + sOption + "' is not found on the Discard Draft pop up");
							return null;
						},
						errorMessage: "The RadioButton not found on the screen"
					});
				}
			};
		};
	}
);
