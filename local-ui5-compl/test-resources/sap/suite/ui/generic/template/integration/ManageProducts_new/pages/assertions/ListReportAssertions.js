/*** List Report Assertions ***/
sap.ui.define(
	["sap/ui/test/Opa5", "sap/ui/test/matchers/PropertyStrictEquals", "sap/ui/test/matchers/AggregationFilled",
	 "sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaResourceBundle", "sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaModel", "sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaManifest", "sap/suite/ui/generic/template/integration/Common/OpaDataStore"],

	function (Opa5, PropertyStrictEquals, AggregationFilled, OpaResourceBundle, OpaModel, OpaManifest, OpaDataStore) {

	return function (prefix, viewName, viewNamespace, entityType, entitySet) {

		function matchInSubTree(oControl, fnMatch) {
			if (fnMatch(oControl)) {
				return true;
			}
			var oAggregations = oControl.getMetadata().getAllAggregations();
			for (var sAggregation in oAggregations) {
				if (oAggregations[sAggregation].multiple && oControl.getAggregation(sAggregation)
					&& oControl.getAggregation(sAggregation).some(function (oItem) {
						return matchInSubTree(oItem, fnMatch);
					})) {
					return true;
				}
			}
			return false;
		}

		return {

			// check if the filter bar is rendered correctly:
			// i. find the filter bar & match against the property "enableBasicSearch" and aggregation "controlConfiguration"
			// ii. for each controlConfiguration get the key and check against the term "com.sap.vocabularies.UI.v1.SelectionFields" for the entity type
			theFilterBarIsRenderedCorrectly: function() {
				return this.waitFor({
					id: prefix + "listReportFilter",
					viewName: viewName,
					viewNamespace: viewNamespace,
					matchers: [
						new PropertyStrictEquals({
							name: "enableBasicSearch",
							value: !(entitySet["sap:searchable"] === 'false')
						}),
						new AggregationFilled({
							name: "controlConfiguration"
						})
					],
					success: function(oControl) {
						Opa5.assert.ok(true, "The Smart Filter Bar has basic search enabled");

						// check the control configurations
						var oSmartFilterBar = oControl;
						var aSelectionField = entityType["com.sap.vocabularies.UI.v1.SelectionFields"];
						var iExpectedControlConfigurations = aSelectionField.length + 2; // EditState and CustomPriceFilter selection fields.
						var aConfiguration = oSmartFilterBar.getAggregation("controlConfiguration").filter(function(oConfiguration) {
							var sKey = oConfiguration.getProperty("key");
							// check the selection fields
							for (var i = 0; i < aSelectionField.length; i++) {
								if (sKey === aSelectionField[i].PropertyPath.replace('/', '.')) {
									return true;
								}
							}
							return (sKey === "EditState" || sKey === "CustomPriceFilter" /*breakout*/);
						});

						Opa5.assert.equal(aConfiguration.length, iExpectedControlConfigurations, "The Smart Filter Bar has " + iExpectedControlConfigurations + " control configurations");

						// ToDo: deepEqual does show different content - WHY ???
						//deepEqual(aConfiguration, oSmartFilterBar.getAggregation("controlConfiguration"), "The Smart Filter Bar has the correct control configurations");
					},
					errorMessage: "The Smart Filter Bar is not rendered correctly"
				});
			},

			// check if the Smart Table is rendered correctly:
			// i. find the Smart Table by its id
			// ii. check each column name against the annotations
			theSmartTableIsRenderedCorrectly: function() {
				return this.waitFor({
					id: prefix + "listReport",
					viewName: viewName,
					viewNamespace: viewNamespace,
					success: function(oControl) {
						var oTable = oControl.getTable();
						var aColumn = oTable.getColumns();
						var iColumnCount = 0;

						// columns from annotations
						var aAnnotationColumn = entityType["com.sap.vocabularies.UI.v1.LineItem"].filter(function(oRecord){
							return (oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataField" ||
							oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" ||
							oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation" ||
							((oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAction" || oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") && oRecord.Inline));
						});

						for(var i = 0; i < aAnnotationColumn.length; i++) {
							if ( ((aAnnotationColumn[i].RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAction") || (aAnnotationColumn[i].RecordType === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation")) && (aAnnotationColumn[i].Inline.Bool === "false") ){
								iColumnCount++;
								continue;
							}

							var sExpectedLabel = "";
							if (aAnnotationColumn[i].RecordType === "com.sap.vocabularies.UI.v1.DataField" &&
								!(aAnnotationColumn[i].Label && aAnnotationColumn[i].Label.String)) { //if a label is directly specified it has to be used
								sExpectedLabel = OpaModel.getEntityProperty(entityType, aAnnotationColumn[i].Value.Path)["com.sap.vocabularies.Common.v1.Label"].String;
							} else {
								sExpectedLabel = aAnnotationColumn[i].Label.String;
								if (sExpectedLabel.search("@i18n") > -1) {
									sExpectedLabel = sExpectedLabel.substring(7,sExpectedLabel.length-1);
									sExpectedLabel = OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty(sExpectedLabel)
								}
							}

							var sActualLabel = aColumn[i-iColumnCount].getHeader().getText();
							Opa5.assert.equal(sActualLabel, sExpectedLabel, "The label " + sActualLabel + " is correctly displayed");
						}

						// columns from breakouts
						var sExpectedBreakoutColumnLabel = OpaResourceBundle.demokit.stta_manage_products.ListReport.getProperty("xfld.BreakoutColumn");
						Opa5.assert.equal(aColumn[aColumn.length-2].getHeader().getText(), sExpectedBreakoutColumnLabel, "The breakout column is correctly displayed");
						var sExpectedBreakoutColumnLabel = OpaResourceBundle.demokit.stta_manage_products.ListReport.getProperty("xfld.BreakoutColumnLinkNavigation");
						Opa5.assert.equal(aColumn[aColumn.length-1].getHeader().getText(), sExpectedBreakoutColumnLabel, "The breakout column link navigation is correctly displayed");
						Opa5.assert.equal("Top", oTable.getItems()[0].getProperty("vAlign"), "The vAlign property of ColumnListItem is correctly set");

					},
					errorMessage: "The Smart Table is not rendered correctly"
				});
			},

			// check if the Smart Table contains the micro charts:
			// i. find the Smart Table by its id
			// ii. check each column against the annotations
			theSmartTableContainsMicroCharts: function() {
				return this.waitFor({
					id: prefix + "responsiveTable",
					viewName: viewName,
					viewNamespace: viewNamespace,
					matchers: [
								new AggregationFilled({
									name: "items"
								})
							],
					success: function(oControl) {
						var aItems = oControl.getItems();

						// columns from annotations
						var aAnnotationColumns = entityType["com.sap.vocabularies.UI.v1.LineItem"].filter(function(oRecord){
							return (oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataField" ||
							oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" ||
							((oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAction" || oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") && oRecord.Inline));
						});

						var iAnnotatedChartColumns = 0;
						var iRenderedChartColumns = 0;
						var aFirstRowCells =  aItems[0].getCells();
						var oCellItem;
						var sAnnotationPath;

						for(var i = 0; i < aAnnotationColumns.length; i++) {
							if (aAnnotationColumns[i].RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation") {
								sAnnotationPath =  aAnnotationColumns[i].Target.AnnotationPath;
								if (sAnnotationPath.indexOf('com.sap.vocabularies.UI.v1.Chart') >= 0){
									iAnnotatedChartColumns++;
									oCellItem = aFirstRowCells[i+1].getItems()[0];  //aFirstRowCells index changed to "i+1" because after semantically connected fields example, the position of Chart in aFirstRowCells and aAnnotationColumns is different
									if(oCellItem.getChartType()){
										iRenderedChartColumns++;
									}
								}
							}
						}

						Opa5.assert.equal(iAnnotatedChartColumns, iRenderedChartColumns, "All Columns annotated for micro charts render micro charts");

					},
					errorMessage: "Not all Columns that are annotated for micro charts render micro charts"
				});
			},


			theSmartTableContainsRatingIndicator: function() {
				return this.waitFor({
					id: prefix + "responsiveTable",
					viewName: viewName,
					viewNamespace: viewNamespace,
					matchers: [
						new AggregationFilled({
							name: "items"
						})
					],
					success: function(oControl) {
						Opa5.assert.ok(matchInSubTree(oControl, function(oControl) {
							return oControl.isA("sap.m.RatingIndicator");
						}), "Rating Indicator found");
//						assert.equal("sap.m.RatingIndicator",oControl.getItems()[0].getCells()[8].getItems()[0].getMetadata().getElementName(),"The Rating Indicator is rendered correctly")

					},
					errorMessage: "Rating Indicator is not rendered correctly."
				});
			},

			theSmartTableContainsProgressIndicator: function() {
				return this.waitFor({
					id: prefix + "responsiveTable",
					viewName: viewName,
					viewNamespace: viewNamespace,
					matchers: [
						new AggregationFilled({
							name: "items"
						})
					],
					success: function(oControl) {
						Opa5.assert.ok(matchInSubTree(oControl, function(oControl) {
							return oControl.isA("sap.m.ProgressIndicator");
						}), "Progress Indicator found");
//						assert.equal("sap.m.ProgressIndicator",oControl.getItems()[0].getCells()[9].getItems()[0].getMetadata().getElementName(),"The Progress Indicator is rendered correctly")
					},
					errorMessage: "Progress Indicator is not rendered correctly."
				});
			},

			// check if the Object Marker in the Smart Table contains user information for locked objects or objects with unsaved changes:
			// i. find the Smart Table by its id
			// ii. check for draft and locked or unsaved changes
			// iii. if it contains entries check object marker for user info
			theObjectMarkerContainsUserInfo: function() {
				return this.waitFor({
					id: prefix + "responsiveTable",
					viewName: viewName,
					viewNamespace: viewNamespace,
					matchers: [
								new AggregationFilled({
									name: "items"
								})
							],
					success: function(oControl) {
						var aItems = oControl.getItems();
						var oDraft, oLockedOrUnsaved, sErrorMessage = "", sDraftAdditional;

						for (var i = 0; i < aItems.length; i++){
							//don't check image column or others but only ProductForEdit
							if (!aItems[i] &&
								!aItems[i].getCells() &&
								!aItems[i].getCells()[1] &&
								!aItems[i].getCells()[1].getItems){
								continue;
							}
							var oProductForEditColumn = aItems[i].getCells()[1].getItems()[2].getType ? aItems[i].getCells()[1].getItems()[2] : aItems[i].getCells()[1].getItems()[3];
							if (oProductForEditColumn && (oProductForEditColumn.getType() === "Unsaved" || oProductForEditColumn.getType() === "Locked")){
								oLockedOrUnsaved = aItems[i];
							}
							if (oProductForEditColumn && oProductForEditColumn.getType() === "Draft"){
								oDraft = aItems[i];
							}
							if(oDraft && oLockedOrUnsaved){
								break;
							}
						}
						if(oLockedOrUnsaved){
						//Locked objects oder objects with unsaved changes should display either the full user name or the user id, this means AdditionalInfo for the ObjectMarker should be set
							sDraftAdditional = oLockedOrUnsaved.getCells()[1].getItems()[2].getAdditionalInfo ? oLockedOrUnsaved.getCells()[1].getItems()[2].getAdditionalInfo() : oLockedOrUnsaved.getCells()[1].getItems()[3].getAdditionalInfo();
							if(sDraftAdditional !== undefined && sDraftAdditional !== ""){
								Opa5.assert.ok(true, "User information is shown for locked items or items with unsaved changes.");
							} else {
								Opa5.assert.ok(false, "User information is not shown for locked items or items with unsaved changes.");
							}
						} else {
							Opa5.assert.ok(true, "No object with status locked or unsaved changes found");
						}

						if(oDraft){
							//own drafts should not display either the full user name or the user id, this means AdditionalInfo for the ObjectMarker should not be set
							sDraftAdditional = oLockedOrUnsaved.getCells()[1].getItems()[2].getAdditionalInfo ? oLockedOrUnsaved.getCells()[1].getItems()[2].getAdditionalInfo() : oLockedOrUnsaved.getCells()[1].getItems()[3].getAdditionalInfo();
							if(sDraftAdditional !== undefined && sDraftAdditional !== ""){
								Opa5.assert.ok(true, "User information is not shown for own drafts.");
							} else {
								Opa5.assert.ok(false, "User information is shown for own drafts.");
							}
						} else {

							Opa5.assert.ok(true, "No object with status draft found");
						}
					},
					errorMessage: "Draft additional information is not displayed properly."
				});
			},

			//Check and validate row highlight functionality in smart table.
			checkRowHighlight: function(){
				return this.waitFor({
					id: prefix + "responsiveTable",
					viewName: viewName,
					viewNamespace: viewNamespace,
					matchers: [
								new AggregationFilled({
									name: "items"
								})
							],
					success: function(oControl) {
						var aItems = oControl.getItems();
						var sCriticality;
						for (var i = 0; i < aItems.length; i++){
							if (aItems.length != 0 && aItems[i] != undefined)
							    {
								var oRowContext = aItems[i].getBindingContext();
								var sHighlight = aItems[i].mProperties.highlight;
								var oModel = aItems[i].getModel()
								var oMetaModel = oModel.getMetaModel();
								var oControl = oControl.getParent();
								var oEntitySet = oMetaModel.getODataEntitySet(oControl.getEntitySet());
								var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
								var oCriticalityAnnotation = oEntityType["com.sap.vocabularies.UI.v1.LineItem@com.sap.vocabularies.UI.v1.Criticality"];
								var isActiveEntity  = oRowContext.getObject("IsActiveEntity");
								var hasActiveEntity = oRowContext.getObject("HasActiveEntity");
								if (isActiveEntity === false && hasActiveEntity === false){
									sCriticality = "Information";
								}
								else if(oCriticalityAnnotation && oCriticalityAnnotation.Path){
									var sCriticalityPath = oCriticalityAnnotation.Path ;
									if (oRowContext) {
										var sRowCriticalityValue = oRowContext.getObject(sCriticalityPath);
										if (sRowCriticalityValue) {
											switch (sRowCriticalityValue.toString()) {
												case "0":
												sCriticality = "None"; break;
												case "1":
												sCriticality = "Error"; break;
												case "2":
												sCriticality = "Warning"; break;
												case "3":
												sCriticality = "Success"; break;
											}
										} else {
											sCriticality = "None";
										}
									}
								}
								if(sHighlight === sCriticality){
									Opa5.assert.ok(true, "Row highlight is working fine");
									break;
								}
								else{
									Opa5.assert.ok(false, "Row highlight is not found");
									break;
								}
							}
							else{
								Opa5.assert.ok(false, "Rows are not rendered");
								break;
							}
						}
					},
					errorMessage: "Information is not displayed properly."
				});
			},

			// check if the Object Marker in the Smart Table contains user information for locked objects or objects with unsaved changes:
			// i. find the Smart Table by its id
			// ii. Check if Default Title is shown or not.
			checkDefaultTitle: function() {
				return this.waitFor({
					id: prefix + "responsiveTable",
					viewName: viewName,
					viewNamespace: viewNamespace,
					matchers: [
								new AggregationFilled({
									name: "items"
								})
							],
					success: function(oControl) {
						var aItems = oControl.getItems();
						var sdefaultTitle = "<em>Unnamed&#x20;Object</em>";
						for (var i = 0; i < aItems.length; i++){
							//don't check image column or others but only Product
							if (!aItems[i] ||
							    !aItems[i].getCells() ||
							    !aItems[i].getCells()[1] ||
						            !aItems[i].getCells()[1].getItems){
							    continue;
							  }
							else if(aItems[i].getCells()[1].getItems()[1].getHtmlText() === sdefaultTitle){
								Opa5.assert.ok(true, "Default Title is found");
								break;
							}
							else{
								Opa5.assert.ok(false, "Default Title is not found");
							}
						}
					},
					errorMessage: "Information is not displayed properly."
				});
			},

			// check if the Custom Toolbar (e.g. "Copy with new Supplier (Ext)", "Delete", etc...) in the Smart Table is rendered correctly:
			// i. find the toolbar by its control type and match against the property "design"
			// ii. get all "sap.m.Button" and match the button's text against the annotations or manifest
			// iii. get all "sap.m.OverflowToolbarButton" and check the text
			theCustomToolbarForTheSmartTableIsRenderedCorrectly: function() {
				return this.waitFor({
					controlType: "sap.m.OverflowToolbar",
					matchers: [
						new PropertyStrictEquals({
							name: "design",
							value: "Transparent"
						})
					],
					success: async function(aControl) {
						Opa5.assert.ok(true, "The OverflowToolbar has its design set to 'Transparent'");

						var iButtonIndex = 0;

						var aButton = aControl[0].getContent().filter(function(oControl) {
							return oControl.isA("sap.m.Button");
						});

						// Wait until the manifest data is loaded
						await this.iWaitForPromise(OpaManifest.loadManifestData());
						
						var mProductBreakoutActions = OpaManifest.getManifestModel()
							.getProperty("/sap.ui5/extends/extensions/sap.ui.controllerExtensions/sap.suite.ui.generic.template.ListReport.view.ListReport/sap.ui.generic.app/STTA_C_MP_Product/Actions/");

						for (var sAction in mProductBreakoutActions) {
							if (!mProductBreakoutActions[sAction].determining && !mProductBreakoutActions[sAction].global) {
								Opa5.assert.equal(aButton[iButtonIndex].getText(), mProductBreakoutActions[sAction].text, "The " + mProductBreakoutActions[sAction].text + " button is rendered correctly");
								iButtonIndex++;
							}
						}

						// buttons from annotations
						var aExpectedButton = entityType["com.sap.vocabularies.UI.v1.LineItem"].filter(function(oRecord){
							return ((oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAction" || oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") && !oRecord.Inline && !oRecord.Determining);
						});
						for (var i = 0; i < aExpectedButton.length; i++) {
							Opa5.assert.equal(aButton[iButtonIndex + i].getText(), aExpectedButton[i].Label.String, "The " + aExpectedButton[i].Label.String + " button is rendered correctly");
						}

						// button for variant management
						var aSmartVariantManagement = aControl[0].getContent().filter(function(oControl) {
							return oControl.isA("sap.ui.comp.smartvariants.SmartVariantManagement");
						});
						Opa5.assert.ok(aSmartVariantManagement.length === 0, "The Variant is rendered correctly");

						// button for settings
						var aOverflowToolbarButton = aControl[0].getContent().filter(function(oControl) {
							return oControl.isA("sap.m.OverflowToolbarButton");
						});

						// For Fiori 3, the button is changed to sap.m.button with text 'Create'. Below test fails
						// when it runs on Fiori 3. This test has to be adapted when Fiori 3 switch is removed.
						// Opa5.assert.equal(aOverflowToolbarButton[0].getText(), "Create New Product", "The Create New Product button is rendered correctly");
					},
					errorMessage: "The Smart Table Toolbar is not rendered correctly"
				});
			},

			// check if the responsive table inside the Smart Table has items:
			// i. find the table by matching against the property "items"
			// ii. check the table has the correctly # of items
			theResponsiveTableIsFilledWithItems: function(iItems, sTabId) {
				var aMatchers = [
					new AggregationFilled({
						name: "items"
					})
				];
				var fnSuccess = function(oControl) {
					var actualItems = oControl.getItems();
					Opa5.assert.equal(actualItems.length, iItems, "All the items are present in the table");
				};

				return this.waitForResponsiveTableInListReport(aMatchers, fnSuccess, sTabId);
			},

			// check if the responsive table has the correct items:
			// i. find the table by matching against the property "items"
			theResponsiveTableContainsTheCorrectItems: function(mSelection) {
				var aMatchers = [
					new AggregationFilled({
						name: "items"
					})
				];
				var fnSuccess = function(oControl) {
					var actualItems = oControl.getItems();

					for(var i = 0; i < actualItems.length; i++) {
						var bValid = true;
						var oContext = actualItems[i].getBindingContext();
						var oObject = oContext.getObject(oContext.sPath);

						for(var propertyName in mSelection) {
							switch (propertyName) {
								case "EditingStatus":
									// Editing Status: 0-All 1-Own Draft 2-Locked by Another User 3-Unsaved Changes by Another User 4-No Changes
									switch(mSelection[propertyName]) {
										case 0:
											break;
										case 1:
											// if (!oObject["DraftAdministrativeData"] || oObject["DraftAdministrativeData"] === null ) {
											if (!oObject["DraftAdministrativeData"]) {
												bValid = false;
											}
											break;
										default:
											break;
									}
									break;
								case "Supplier":
									if (oObject.to_Supplier.__ref.indexOf(mSelection[propertyName]) < 0) {
										bValid = false;
										Opa5.assert.ok(false, "Item [" + i + "] does not have the property '" + propertyName + "' = " + mSelection[propertyName]);
									}
									break;
								default:
									if(oObject[propertyName] != mSelection[propertyName]) {
										bValid = false;
										Opa5.assert.ok(false, "Item [" + i + "] has property '" + propertyName + "' = " + oObject[propertyName] + " instead of " + mSelection[propertyName]);
									}
									break;
							}
						}
						Opa5.assert.ok(bValid, "Item [" + i + "] meets the Filter selection criteria");
					}
				};

				return this.waitForResponsiveTableInListReport(aMatchers, fnSuccess);
			},

			// check that the page contains the correct determining actions:
			// i. find the page by the controlType
			// ii. check the determining actions buttons text against the annotations
			thePageShouldContainTheCorrectDeterminingActions: function() {
				return this.waitFor({
					controlType: "sap.f.DynamicPage",
					viewName: viewName,
					viewNamespace: viewNamespace,
					success: async function (listReportPage) {
						var aButton, aIdentificationAnnotations, aActionTextsThatAppear = [], aActionTextThatShouldAppear = [];
						// Wait until the manifest data is loaded
						await this.iWaitForPromise(OpaManifest.loadManifestData());
						// get the custom actions text from the manifest
						oManifestJSONModel = OpaManifest.getManifestModel();
						mCustomActions = oManifestJSONModel.getProperty("/sap.ui5/extends/extensions/sap.ui.controllerExtensions/sap.suite.ui.generic.template.ListReport.view.ListReport/sap.ui.generic.app/STTA_C_MP_Product/Actions/");
						for (var customAction in mCustomActions) {
							if (mCustomActions.hasOwnProperty(customAction)) {
								if (mCustomActions[customAction].determining && !mCustomActions[customAction].global) {
									aActionTextThatShouldAppear.push(mCustomActions[customAction].text);
								}
							}
						}

						// get the action buttons' text from the object footer
						aButton = listReportPage[0].getFooter().getContent();
						for (var i = 0; i < aButton.length; i++) {
							if (aButton[i].isA("sap.m.Button")) {
								aActionTextsThatAppear.push(aButton[i].getText());
							}
						}

						// get the annotated actions text from the metamodel
						aLineItemAnnotations = entityType["com.sap.vocabularies.UI.v1.LineItem"];
						for (var i = 0; i < aLineItemAnnotations.length; i++) {
							if ((aLineItemAnnotations[i].RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAction" || aLineItemAnnotations[i].RecordType === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") &&
									aLineItemAnnotations[i].Determining && aLineItemAnnotations[i].Determining.Bool === "true") {
								aActionTextThatShouldAppear.push(aLineItemAnnotations[i].Label.String);
							}
						}

						// compare the actions' text that should appear vs. the actions' text that actually appear
						for (var i = 0; i < aActionTextThatShouldAppear.length; i++) {
							for (var j =0; j < aActionTextsThatAppear.length; j++) {
								if (aActionTextsThatAppear[i] === aActionTextThatShouldAppear[i]) {
									Opa5.assert.ok(true, "Determining Action '" + aActionTextThatShouldAppear[i] + "' is rendered correctly.");
									break;
								}
								else if (j === aActionTextsThatAppear.length - 1) {
									Opa5.assert.ok(false, "Determining Action '" + aActionTextThatShouldAppear[i] + "' is not rendered correctly.");
								}
							}
						}
					},
					errorMessage: "The Determining Actions in the List Report Footer are not rendered correctly"
				});
			},

			/************************************************
			 NAVIGATION ASSERTIONS
			 *************************************************/
			// check if the smart table is in the same state as before:
			// i. find the table by matching against the property "items"
			// ii. get the stored items from the OpaDataStore and check if items in the table are the same
			theTableIsInTheSameStateAsBefore: function() {
				var aMatchers = [
					new AggregationFilled({
						name: "items"
					})
				];
				var fnSuccess = function(oControl) {
					var expectedItems = OpaDataStore.getData("tableItems");
					var actualItems = oControl.getItems();
					Opa5.assert.deepEqual(actualItems, expectedItems, "The items in the table are the same as before");
				};

				return this.waitForResponsiveTableInListReport(aMatchers, fnSuccess);
			},

			/************************************************
			 UTILITY FUNCTIONS
			*************************************************/
			// ListReport common assertion function
			waitForResponsiveTableInListReport: function(aMatchers, fnSuccess, sTabId) {
				return this.waitFor({
					id: prefix + "responsiveTable" + (sTabId ? "-" + sTabId : ""),
					viewName: viewName,
					viewNamespace: viewNamespace,
					matchers: aMatchers,
					success: fnSuccess,
					errorMessage: "The Responsive Table is not rendered correctly"
				});
			},

			theResponsivetableHasColumnsWithPopinDisplay: function (sPopinDisplay) {
				return this.waitFor({
					id: prefix + "responsiveTable",
					check: function(oTable) {
						for (var i=0;i<=oTable.getColumns().length-1;i++) {
							if (oTable.getColumns()[i].getPopinDisplay() === sPopinDisplay) {
								return true;
							}
						}
						return false;
					},
					success: function() {
						Opa5.assert.ok(true, "The sap.m.Table has columns with PopinDisplay as "+sPopinDisplay);
					},
					errorMessage: "The sap.m.Table has columns with incorrect PopinDisplay"
				});

			},

			theButtonWithIdInControlTypeIsNotVisible: function(sButtonId, sControlType) {
				var aButtons = null;
				var bButtonVisibility = false;
				return this.waitFor({
					controlType: sControlType,
					success: function(oControl) {
						aButtons = oControl[0].getContent();
						for (var i=0; i < aButtons.length; i++ ) {
							if (aButtons[i].sId === sButtonId) {
								bButtonVisibility = true;
								break;
							}
						}
						if (bButtonVisibility) {
							Opa5.assert.notOk(bButtonVisibility, "Button with id: "+ sButtonId.split("--")[1] + " is available");
						}
						else {
							Opa5.assert.notOk(bButtonVisibility, "Button with id: " + sButtonId.split("--")[1] + " is not available");
						}
					},
					errorMessage: "The " + sControlType + " could not be rendered correctly."
				});
			},

			/*
			* Checks if the Editing Status is the first filter field in the smart filter bar
			*
			* @param {object} oItem This object must be filled with the data needed to set a specific filter field value
			* oItem.Field (string):	The field to be set. Choose the key of the field as used in its corresponding fragment
			* @throws {Error} Throws an error if the Smart Filter Bar could not be identified.
			* @public
			*/
			EditingStatusShouldBeTheFirstFilter: function(oItem) {
				return this.waitFor({
					controlType: "sap.f.DynamicPage",
					viewName: viewName,
					viewNamespace: viewNamespace,
					success: function(oDynamicPage) {
						if (oDynamicPage[0].getHeaderExpanded() != true) {
							oDynamicPage[0].setHeaderExpanded(true);
					}
					this.waitFor({
						controlType: "sap.ui.comp.smartfilterbar.SmartFilterBar",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (aControl) {
							var oSmartFilterBar = aControl[0];
							var aSmartFilterBarFilters = oSmartFilterBar.mAggregations.filterGroupItems;
							// Editing Status must always be the first item of the smart filter bar array.
							// The array only contains the filters present in the basic group.
							var oFilterField = aSmartFilterBarFilters[0];
							Opa5.assert.ok(oFilterField.mProperties.name === oItem.Field, "Editing status is the first field");
						},
						errorMessage: "The Smart Filter Bar was not found"
					});
					},
					errorMessage: "Dynamic Page is not loaded correctly"
				});
			},

	/************************************************
	 CONTACT INFORMATION POPOUP ASSERTIONS
	 *************************************************/
			theContactInformationShouldBeDisplayedFor: function (sExpectedName, sAddress) {
				return this.waitFor({
					controlType: "sap.m.Popover",
					success: function (oPopover) {
						var aPopoverItems = oPopover[0].getContent()[0].getItems();
						var sActualName = aPopoverItems[0].getItems()[1].getItems()[0].getText();
						var bPageAddrCheck = false;
						for (var i = 2; i < aPopoverItems.length; i++) {
							if (sAddress === aPopoverItems[i].getItems()[1].getText()) {
								bPageAddrCheck = true;
							}
						}
						Opa5.assert.ok(sActualName === sExpectedName, "The Contact Information popup is opened with the correct data for name: \"" + sExpectedName + "\"");
						Opa5.assert.ok(bPageAddrCheck, "The Contact Information popup is opened with the correct data for address: \"" + sAddress + "\"");
					},
					errorMessage: "Contact Information Popup is not rendered correctly or expected name not matched as \"" + sExpectedName + "\" or expected address not matched as \"" + sAddress + "\""
				});
			},

			iCheckWhitespaceInLRTableCell: function (sTableId, iRowIndex, iCellIndex, iAggrItemIndex, sText, bExpected) {
				return this.waitFor({
					id: new RegExp(sTableId + "$"),
					success: function (oControl) {
						var aItems = oControl[0].getItems()[iRowIndex].getCells()[iCellIndex].getAggregation("items")[iAggrItemIndex];
						if (aItems.getProperty("text") === sText && aItems.getProperty("renderWhitespace") === bExpected) {
							Opa5.assert.ok(true, "whitespace is rendered");
							return null;
						}
						else {
							Opa5.assert.notOk(true, "whitespace is not rendered");
							return null;

						}
					},
					errorMessage: "Whitespace is not rendered"
				});
			},

			thePageVariantShouldBeMarked: function(bExpected) {
				return this.waitFor({
					controlType: "sap.ui.comp.smartvariants.SmartVariantManagement",
					viewName: viewName,
					viewNamespace: viewNamespace,
					success: function (oPageVariant) {
						Opa5.assert.ok(oPageVariant[0].currentVariantGetModified() === bExpected, "Variant is marked as expected");
					},
					errorMessage: "The smart variant has not marked as expected."
				});
			},

			iCheckTheOptionInTableColumnHeaderMenu: function (sOption) {
				return this.waitFor({
					controlType: "sap.m.table.columnmenu.Menu",
					success: function (aColumnMenus) {
						var aFormElements = aColumnMenus[0].getDependents()[1].getFormContainers()[0].getFormElements();
						var bFlag = false;
						for (var i = 0; i < aFormElements.length; i++) {
							if (aFormElements[i].getLabel().getText() === sOption) {
								bFlag = true;
							}
						}
						Opa5.assert.ok(bFlag, "The option '" + sOption + "' is available in the Table Column Header Menu");
					},
					errorMessage: "Table Column Header Menu is not rendered properly on the screen"
				});
			}
		};
	};
});
