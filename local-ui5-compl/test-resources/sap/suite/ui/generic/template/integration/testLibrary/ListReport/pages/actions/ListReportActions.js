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
		return function (sViewNameListReport, sViewNamespaceListReport) {
			return {

				/**
				* Press the Go button within a Fiori Elements List Report UI to start the search for the ListReport data.
				* Looks for filterbar collapsed. If collapsed, it will expand.
				*
				* @throws {Error} Throws an error if the Go button could not be found on the UI
				* @return {*} success or failure
				* @public
				*/
				iExecuteTheSearch: function () {
					var sGoButtonId = ApplicationSettings.getAppParameters().LRPrefixID + "--listReportFilter-btnGo";
					return this.waitFor({
						controlType: "sap.f.DynamicPage",
						success: function(oDynamicPage) {
							if (oDynamicPage[0].getHeaderExpanded() != true) {
								oDynamicPage[0].setHeaderExpanded(true);
							}
							this.waitFor({
								id: sGoButtonId,
								matchers: new PropertyStrictEquals({
										name: "enabled",
										value: true
									}),
								actions: new Press(),
								success: function () {
									Opa5.assert.ok(true,"The Go Button is pressed successfully");
								},
								errorMessage: "The Go Button did not render correctly"
			                });
						},
						errorMessage: "Dynamic Page is not loaded correctly"
					});
				},

				/**
				* Click on the create button to execute the creation of a new item in the ListReport.
				* Precondition: The mockserver of your application has to be prepared to handle create requests.
				*
				* @throws {Error} Throws an error if the button for creation of an item could not be found on the UI
				* @return {*} success or failure
				* @public
				*/
				iClickTheCreateButton: function () {
					var sCreateButtonId = ApplicationSettings.getAppParameters().LRPrefixID + "--addEntry";
					return this.waitFor({
						id: sCreateButtonId,
						matchers: new PropertyStrictEquals({
							name: "enabled",
							value: true
						}),
						success: function (oButton) {
							oButton.firePress();
							Opa5.assert.ok(true, "The creation of a new item was triggered successfully");
						},
						errorMessage: "The button for creating a new item could not be found"
					});
				},

				/**
				* Check the current UI. Function just returns this as a result.
				*
				* @return {*} success or failure
				* @public
				*/
				iLookAtTheScreen : function () {
					return this;
				},

				/**
				* Navigate to the ObjectPage of a Fiori Elements application by LineNo. This simulates the click on
				* an item in the ListReport.
				*
				* @param {int} iIndex The line number which will be used for navigation (0-based)
				* @param {String} sTableId corresponds to the Smart table id of the List report table. Provide this in case you have
				* multiple tabs in your List report. You have to pass the most right part after the "--" only.
				* @throws {Error} Throws an error if the responsive table could not be found
				* @return {*} success or failure
				* @public
				*/
				iNavigateFromListItemByLineNo: function(iIndex, sTableId) {
					var sLineItemId = (sTableId) ? (ApplicationSettings.getAppParameters().LRPrefixID + "--" + sTableId) : (ApplicationSettings.getAppParameters().LRPrefixID + "--listReport");
					return this.waitFor({
						id: sLineItemId,
						success: function(oSmartTableObject) {
							var oTable = oSmartTableObject.getTable();
							switch (oTable.getMetadata().getElementName()) {
							case "sap.ui.table.Table":
							case "sap.ui.table.AnalyticalTable":
								var Rows = oTable.getRows();
								var RowAction = Rows[iIndex].getRowAction();
								var RowActionItem = RowAction.getItems()[0];
								RowActionItem.firePress();
								Opa5.assert.ok(true, "The item '" + oTable.getRows()[iIndex].getBindingContext().sPath + "' was clicked successfully");
								break;
							case "sap.m.Table":
								var oItem = oTable.getItems()[iIndex];
								oTable.fireItemPress({listItem:oItem});
								Opa5.assert.ok(true, "The item '" + oTable.getItems()[iIndex].getBindingContext().sPath + "' was clicked successfully");
								break;
							default:
								break;
							}
						},
						errorMessage: "The Smart Table is not rendered correctly sID:" + sLineItemId
					});
				},

				/**
				* Navigate to the ObjectPage of a Fiori Elements application by using a field/value combination.
				* This simulates the click on an item in the ListReport.
				* In case of multiple items, first matching record is selected.

				* @param {object} oItem This object must be filled with the field/value information to locate the line in the ListReport.
				* oItem.Field (string):	The field to be checked for. Choose the name of the field as shown in the $metadata file
				* of the your odata-service.
				* oItem.Value (string): The value to be searched for.
				* @throws {Error} Throws an error if the field/value combination could not be found in the ListReport
				* @return {*} success or failure
				* @public
				*/
				iNavigateFromListItemByFieldValue: function (oItem) {
					return this.waitFor({
						controlType: "sap.m.ColumnListItem",
						viewName: sViewNameListReport,
						viewNamespace: sViewNamespaceListReport,
						success: function (oCandidateListItem) {
							var oTableLine;
							for (var i = 0; i < oCandidateListItem.length; i++) {
								oTableLine = oCandidateListItem[i].getBindingContext().getObject();
								for (var sName in oTableLine) {
									if ((sName === oItem.Field) && (oTableLine[sName] === oItem.Value)) {
										new Press().executeOn(oCandidateListItem[i]);
										Opa5.assert.ok(true, "Navigate from list item '" + oItem.Field + "' with value '" + oItem.Value + "' to the Object Page");
										return null;
									}
								}
							}
							Opa5.assert.notOk(true, "Field " + oItem.Field + " with value " + oItem.Value + " could not be located in the ListReport");
							return null;
						},
						errorMessage: "Field " + oItem.Field + " with value " + oItem.Value + " could not be located in the ListReport"
					});
				},

				/**
				* Set the search field and execute the search.
				*
				* @param {String} sSearchText The text to fill in the search field. Looks for filterbar collapsed. If collapsed, it will expand.
				* @throws {Error} Throws an error if the search field control could not be found
				* @return {*} success or failure
				* @public
				*/
				iSetTheSearchField: function (sSearchText) {
					return this.waitFor({
						controlType: "sap.f.DynamicPage",
						success: function(oDynamicPage) {
							if (oDynamicPage[0].getHeaderExpanded() != true) {
								oDynamicPage[0].setHeaderExpanded(true);
							}
							this.waitFor({
								controlType: "sap.m.SearchField",
								actions: new EnterText({
										text: sSearchText,
										pressEnterKey: true
									}),
								success: function () {
									Opa5.assert.ok(true, "The smartfilterbar search triggered successfully");
								},
								errorMessage: "The Search Field did not render correctly"
			                });
						},
						errorMessage: "Dynamic Page is not loaded correctly"
					});
				},

				/**
				* Set a value within a field of the Smart Filter Bar.
				* This function can be used to load a filtered list when afterwards the search is executed.
				* Looks for filterbar collapsed. If collapsed, it will expand.
				*
				* @param {object} oItem This object must be filled with the data needed to set a specific filter field value
				* oItem.Field (string):	The field to be set. Choose the name of the field as shown in the metadata of the service. If you
				* want to search via Editing Status, choose "editStateFilter" for this parameter.
				* oItem.Value: The value to be filtered. If you want to search via Editing Status, choose values 0-4 for the options.
				* @throws {Error} Throws an error if the Smart Filter Bar could not be identified.
				* @return {*} success or failure
				* @public
				*/
				iSetTheFilter: function(oItem) {
					return this.waitFor({
						controlType: "sap.f.DynamicPage",
						success: function(oDynamicPage) {
							if (oDynamicPage[0].getHeaderExpanded() != true) {
								oDynamicPage[0].setHeaderExpanded(true);
							}
							this.waitFor({
								controlType: "sap.ui.comp.smartfilterbar.SmartFilterBar",
								viewName: sViewNameListReport,
								viewNamespace: sViewNamespaceListReport,
								success: function (aControl) {
									var oSmartFilterBar = aControl[0];
									var aFilterGroupItems = oSmartFilterBar.getFilterGroupItems();
									//Using the private aggregation '_parameters' to get the parameter filter items. This can be modified later
									if (oSmartFilterBar.getAggregation("_parameters")) {
										oSmartFilterBar.getAggregation("_parameters").forEach(function (oParameterFilterItem) {
											aFilterGroupItems.push(oParameterFilterItem);
										});
									}
									for (var i = 0; i < aFilterGroupItems.length; i++) {
										var oSearchFieldControl = aFilterGroupItems[i].getControl();
										var sSearchFieldName = oSearchFieldControl.getId();
										var aStringParts = sSearchFieldName.split("-");
										sSearchFieldName = aStringParts[aStringParts.length - 1];
										if (sSearchFieldName === oItem.Field) {
											var sFieldControlTypeName = oSearchFieldControl.getMetadata().getName();
											if (typeof oItem.Value === "string") {
												if (oItem.Value === "" && sFieldControlTypeName === "sap.m.ComboBox") { // special handling to remove field content
													oSearchFieldControl.clearSelection();
												}
												switch (sFieldControlTypeName) {
													case "sap.ui.comp.smartfilterbar.SFBMultiInput":
													case "sap.ui.comp.smartfilterbar.SFBMultiComboBox":
														var iTokenCount = sFieldControlTypeName === "sap.ui.comp.smartfilterbar.SFBMultiInput" ? oSearchFieldControl.getTokens().length : oSearchFieldControl.getAggregation("tokenizer").getTokens().length;
														var oToken;
														for (i = 0; i < iTokenCount; i++) {
															oToken = sFieldControlTypeName === "sap.ui.comp.smartfilterbar.SFBMultiInput" ? oSearchFieldControl.getTokens()[0] : oSearchFieldControl.getAggregation("tokenizer").getTokens()[0]; //After removing a token, the next token is always at '0' position
															oToken.getAggregation("deleteIcon").firePress(); /*Smart FilterBar colleagues told that using removeAllTokens() is not the right approach and hence this change to firePress on deleteIcon*/
														}
														if (oItem.Value !== "") {
															var sField = oItem.Field, sValue = oItem.Value;
															var oJSONData = {}, oItems = {};
															oItems.items = [{ "key": sValue }];
															oJSONData[sField] = oItems;
															oSmartFilterBar.setFilterData(oJSONData);
														}
														break;
													case "sap.m.DynamicDateRange":
														var sInputFieldId = oSearchFieldControl.getId() + "-input";
														this.iSetInputFieldWithId(sInputFieldId, oItem.Value);
														break;
													case "sap.m.Input":
														var sInputFieldId = oSearchFieldControl.getId();
														this.iSetInputFieldWithId(sInputFieldId, oItem.Value);
														break;
													default:
														oSearchFieldControl.setValue(oItem.Value);
														break;
												}
											} else if (typeof oItem.Value === "number") {
												oSearchFieldControl.setSelectedKey(oItem.Value);
											}
											Opa5.assert.ok(true, "The value '" + oItem.Value + "' is set to the Filter field '" + oItem.Field + "'");
											oSmartFilterBar.fireFilterChange(); // Update filter count (required when setting filters programmatically)
											return null;
										}
									}
									Opa5.assert.ok(false, "The Filter field '" + oItem.Field + "' not found on the FilterBar");
								},
								errorMessage: "The Smart Filter Bar was not found"
							});
						},
						errorMessage: "Dynamic Page is not loaded correctly"
					});
				},

				/**
				 * Switches the tab based on the passed key when Icon tab bar is used by configuring views via
				 * quickVariantSelectionX.variants in manifest. Uses the keys of the buttons that are defined in manifest.json.
				 *
				 * @param {String} sKey Key of the tab, should correspond to the key defined in manifest quickVariantSelectionX.variants item
				 * @throws {Error} Throws an error if the Icon Tab Bar is not found
				 * @return {*} success or failure
				 * @public
				 **/
				iClickOnIconTabFilter: function(sKey) {
					var sIconTabBarId = ApplicationSettings.getAppParameters().LRPrefixID + "--template::IconTabBar";
					return this.waitFor({
						id: sIconTabBarId,
						actions: function(oIconTabBar) {
							oIconTabBar.setSelectedKey(sKey);
							oIconTabBar.fireSelect();
						},
						success: function () {
							Opa5.assert.ok(true, "Icon tab bar with key '" + sKey + "' is clicked");
						},
						errorMessage: "Icon tab bar could not be found with, expected ID: " + sIconTabBarId
					});
				},
				/**
				 * Switches the view based on the passed key when segmented button is used by configuring views via
				 * quickVariantSelection.variants in manifest. Uses the keys of the buttons that are defined in manifest.json.
				 *
				 * @param {String} sKey Key of the button, should correspond to the key defined in manifest quickVariantSelection.variants item
				 * @throws {Error} Throws an error if the segmented button is not found
				 * @return {*} success or failure
				 * @public
				 **/
				iClickOnSegmentedButton: function(sKey) {
					var sSegmentedBtnId = ApplicationSettings.getAppParameters().LRPrefixID + "--template::SegmentedButton";
					return this.waitFor({
						id: sSegmentedBtnId,
						actions: function(oSegmentedButton) {
							var aButtons = oSegmentedButton.getItems();
							for (var i = 0; i < aButtons.length; i++) {
								if (aButtons[i].getKey() === sKey) {
									new Press().executeOn(aButtons[i]);
									return;
								}
							}
						},
						success: function () {
							Opa5.assert.ok(true, "Segmented button with the key '" + sKey + "' is clicked");
						},
						errorMessage: "Icon tab bar could not be found with, expected ID: " + sSegmentedBtnId
					});
				},

				/**
				 * Click on a link (sap.m.Link) in the ListReport.
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
				 * Click a link (sap.m.Link) which has a specific id.
				 *
 				 * @param {String} sId The id of the link as listed in the DOM. You have to pass the most right part after the "--" only.
				 * @throws {Error} Throws an error if the link is not rendered or clicked
				 * @return {*} success or failure
				 * @public
				 **/
				iClickTheLinkWithId: function (sId) {
					var sLinkId = ApplicationSettings.getAppParameters().LRPrefixID + "--" + sId;
					return this.iClickTheLnkWithId(sLinkId);
				},

				/**
				 * Click a button (sap.m.Button) which has a specific id.
				 *
 				 * @param {String} sId The id of the button as listed in the DOM. You have to pass the most right part after the "--" only.
				 * @throws {Error} Throws an error if the button is not rendered or clicked
				 * @return {*} success or failure
				 * @public
				 **/
				iClickTheButtonWithId: function (sId) {
					var sButtonId = ApplicationSettings.getAppParameters().LRPrefixID + "--" + sId;
					return this.iClickTheBtnWithId(sButtonId);
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
			 	* Select the first available combobox (Perform a click on the first available sap.m.ComboBox control)
				* @throws {Error} Throws an error if the ComboBox control is not found
				* @return {*} success or failure
			 	* @public
			 	**/
				iSelectTheFirstComboBox: function () {
					return this.iSelectTheFirstCboBox();
				},

				/**
				* Select an item from the combobox
				* @param {String} sItem is the Item to be chosen from the Combo Box Dropdown.
				* @throws {Error} Throws an error if the sItem could not be selected
				* @return {*} success or failure
			 	* @public
			 	**/
				iSelectTheItemFromFirstComboBox: function (sItem) {
					return this.iSelectTheItemFromFirstCboBox(sItem);
				},

				/**
				 * Select Items from a Multi-Select ComboBox dropdown list.
				 *
				 * @param {String} sComboBox Name of the ComboBox where the values have to be selected.
				 * @param {Object} oItems contains the list of items to be selected.
				 * @throws {Error} Throws an error if the sItem could not be selected
				 * @throws {Error} Throws an error if the Combo Box is not found
				 * @public
				 **/
/* not yet working this way, MultiComboBox to be checked
				iChooseItemsFromMultiComboBox: function (sFieldName, oItems) {
					var oAppParams = ApplicationSettings.getAppParameters();
					return this.iChooseItmsFromMultiComboBox(oAppParams, sFieldName, oItems);
				},
*/

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
				* Select items in the ListReport by LineNumber
				*
				* @param {array} aItemIndex An array of line numbers (0-based) to be selected
				* @param {boolean} bSelect Select (true: default) or Unselect (false) the lines
				* @param {string} sTabKey Index of tab in case you are using TableTabs, MultipleViews in the ListReport
				* @throws {Error} Throws an error if the responsive table could not be found
				* @return {*} success or failure
				* @public
				*/
				iSelectListItemsByLineNo: function(aItemIndex, bSelect, sTabKey) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sId = sTabKey ? oAppParams.LRPrefixID + "--listReport" + "-" + sTabKey : oAppParams.LRPrefixID + "--listReport";
					return this.iChooseListItemsByLineNo(sId, aItemIndex, bSelect);
				},

				/**
				* Select items in a table by line number interval (not for responsive table)
				*
				* @param {int} iFirst first item to select
				* @param {int} iLast last item to select
				* @param {string} sTabKey Index of tab in case you are using TableTabs, MultipleViews in the ListReport
				* @throws {Error} Throws an error if the table could not be found
				* @return {*} success or failure
				* @public
				*/
				iSelectListItemRange: function(iFirst, iLast, sTabKey) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sId = sTabKey ? oAppParams.LRPrefixID + "--listReport" + "-" + sTabKey : oAppParams.LRPrefixID + "--listReport";
					return this.iSelectItemRange(sId, iFirst, iLast);
				},

				/**
				* Select all items in the ListReport (not for responsive table)
				*
				* @param {string} sTabKey Index of tab in case you are using TableTabs, MultipleViews in the ListReport
				* @throws {Error} Throws an error if the table could not be found
				* @return {*} success or failure
				* @public
				*/
				iSelectAllListItems: function(sTabKey) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sId = sTabKey ? oAppParams.LRPrefixID + "--listReport" + "-" + sTabKey : oAppParams.LRPrefixID + "--listReport";
					return this.iSelectAllItems(sId);
				},

				/**
				* Deselect all items in a table (not for responsive table)
				*
				* @param {string} sTabKey Index of tab in case you are using TableTabs, MultipleViews in the ListReport
				* @throws {Error} Throws an error if the table could not be found
				* @return {*} success or failure
				* @public
				*/
				iDeselectAllListItems: function(sTabKey) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sId = sTabKey ? oAppParams.LRPrefixID + "--listReport" + "-" + sTabKey : oAppParams.LRPrefixID + "--listReport";
					return this.iDeselectAllItems(sId);
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
					sTableId = oAppParams.LRPrefixID + "--" + sTableId;
					return this.iSetThePropertyValueInTable(sTableId,sPropertyName,sPropertyValue);
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
				 * Select the Smart Variant View selection on List Report
				 *
				 * @param {String} sSelectionButtonId: The id of the button representing the drop-down of the Smart Variant selection. You have to pass the most right part after the "--" only.
				 * @throws {Error} Throws an error if the back button could not be found
				 * @return {*} success or failure
				 * @public
				 **/
				iClickOnSmartVariantViewSelection: function (sSelectionButtonId) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sId = oAppParams.LRPrefixID + "--" + sSelectionButtonId;
					return this.iClickOnSmVarViewSelection(sId);
				},

				/**
                * Looks for the sap.f.DynamicPage control and calls the setter function of HeaderExpanded property
                * @param {boolean} bExpansionValue The boolean value true/false to set the headerExpanded property
                * @throws {Error} Throws an error if the DynamicPage control could not be found
				* @return {*} success or failure
                * @public
                */
			    iSetTheHeaderExpanded: function (bExpansionValue) {
					   return this.waitFor({
					   controlType: "sap.f.DynamicPage",
					   success: function(oDynamicPage) {
						   if (oDynamicPage[0].getHeaderExpanded() != bExpansionValue) {
							   oDynamicPage[0].setHeaderExpanded(bExpansionValue);
							   Opa5.assert.ok(true,"The HeaderExpanded property is set to: " + bExpansionValue);
							   return null;
							}
							Opa5.assert.ok(true,"The HeaderExpanded property was already set to: " + bExpansionValue);
							return null;
						},
						errorMessage: "DynamicPage control is not loaded/rendered correctly"
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
				* Check for the Show Details button on the table toolbar and click on it if available.
				*
				* @param {string} sTabKey Index of tab in case you are using TableTabs, MultipleViews in the ListReport
				* @throws {Error} Throws an error if the Show details button cannot be pressed
				* @return {*} success or failure
				* @public
				**/
				iClickTheShowDetailsButtonOnTheTableToolBar: function (sTabKey) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sSmartTableId = sTabKey ? oAppParams.LRPrefixID + "--listReport-" + sTabKey : oAppParams.LRPrefixID + "--listReport";
					return this.iClickTheShowDetailsButtonOnTableToolBar(sSmartTableId);
				},

				/**
				 * Click a control which has a specific id.
				 *
					 * @param {String} sId The id of the control as listed in the DOM. You have to pass the most right part after the "--" only.
				 * @throws {Error} Throws an error if the control is not rendered or clicked
				 * @return {*} success or failure
				 * @public
				 **/
				iClickTheControlWithId: function (sId) {
					var sIntId = ApplicationSettings.getAppParameters().LRPrefixID + "--" + sId;
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
				}
			};
		};
	}
);
