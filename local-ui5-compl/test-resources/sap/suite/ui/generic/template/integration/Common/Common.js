sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/test/matchers/AggregationFilled",
	"sap/suite/ui/generic/template/integration/Common/OpaDataStore",
	"sap/suite/ui/generic/template/integration/testLibrary/utils/Common",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/matchers/Ancestor",
	"sap/ui/core/message/Message",
	"sap/ui/table/plugins/MultiSelectionPlugin"
], function (Opa5, Press, PropertyStrictEquals, AggregationFilled, OpaDataStore, TestLibraryCommon, EnterText, Ancestor, Message, MultiSelectionPlugin) {
		"use strict";

		function fnGetSelectionPluginForUITable (oUiTable) {
			return MultiSelectionPlugin.findOn(oUiTable);
		}

		var calculateAppParamsUrl = function (oAppParams) {
			var sAppParamsUrl = "responderOn=true";
			var bServerDelay = true;
			if (oAppParams && typeof oAppParams === "object") {
				var keys = Object.keys(oAppParams);
				// for...of not used because IE doesn't support
				for (var i = 0; i < keys.length; i++) {
					var key = keys[i];
					switch (key) {
						case "bWithPlaceHolder":
							sAppParamsUrl += "&sap-ui-xx-placeholder=" + oAppParams[key];
							break;
						case "bWithChange":
							sAppParamsUrl += (oAppParams[key] === true) ? "&sap-ui-xx-componentPreload=off" : "";
							break;
						case "sapUiLanguage":
							sAppParamsUrl += "&sap-ui-language=" + oAppParams[key];
							break;
						case "sapTheme":
							sAppParamsUrl += "&sap-theme=" + oAppParams[key];
							break;
						case "sapUiLayer":
							sAppParamsUrl += "&sap-ui-layer=" + oAppParams[key];
							break;
						case "sapKeepAlive":
							sAppParamsUrl += "&sap-keep-alive=" + oAppParams[key];
							break;
						case "serverDelay":
							bServerDelay = oAppParams[key];
							break;
						default:
							sAppParamsUrl += "&" + key + "=" + oAppParams[key];
							break;
					}
				}
			}
			if (bServerDelay){
				sAppParamsUrl += "&serverDelay=0";
			}
			return sAppParamsUrl.indexOf("sap-ui-language") !== -1 ? sAppParamsUrl : sAppParamsUrl + "&sap-ui-language=EN";
		};

		var createMatchers = function (oProperty) {
			var aMatchers = [];
			var aProperty = Object.keys(oProperty);
			for (var i = 0; i < aProperty.length; i++) {
				aMatchers.push(new PropertyStrictEquals({
					name: aProperty[i],
					value: oProperty[aProperty[i]]
				}));
			}
			return aMatchers;
		};

		var getTableControlType = function (sTableType) {
			var aTableTypes = ["responsiveTable", "analyticalTable", "gridTable", "treeTable"];
			var aTableControlTypes = ["sap.m.Table", "sap.ui.table.AnalyticalTable", "sap.ui.table.Table", "sap.ui.table.TreeTable"];
			var iIndex = aTableTypes.indexOf(sTableType);
			return ~iIndex ? {"controlType": aTableControlTypes[iIndex], "tableType": aTableTypes[iIndex]} : new Error("Table control not found for '" + sTableType + "'");
		};

		// {"controlId": [bVisible, bEnabled, sText]}
		var checkToolBarControlProperty = function (sControlType, sId, oProperty, self) {
			return self.waitFor({
				controlType: sControlType,
				id: new RegExp(sId + "$", "i"),
				matchers: new PropertyStrictEquals({
					name: "visible",
					value: true
				}),
				success: function (oControl) {
					oControl = Array.isArray(oControl) ? oControl[0] : oControl;
					var oToolbar = null;
					while (oControl && !oToolbar) {
						oToolbar = oControl.getToolbar ? oControl.getToolbar() : null;
						oControl = oControl.getParent();
					}
					var aToolbarContent = oToolbar && oToolbar.getAggregation("content");
					var aButton = Object.keys(oProperty);
					for (var i = 0; i < aButton.length; i++) {
						var toolbarButtonIdRegex = new RegExp(aButton[i] + "$", "i");
						var bFound = false;
						for (var j = 0; j < aToolbarContent.length; j++) {
							if (toolbarButtonIdRegex.test(aToolbarContent[j].getId())) {
								bFound = true;
								var aButtonProperty = oProperty[aButton[i]];
								if ((aToolbarContent[j].getVisible() !== aButtonProperty[0]) || (aToolbarContent[j].getEnabled && aToolbarContent[j].getEnabled() !== aButtonProperty[1]) || (aButtonProperty[2] && aButtonProperty[2] !== aToolbarContent[j].getText())) {
									Opa5.assert.notOk(true, "Toolbar Button: \"" + aButton[i] + "\" didn't match expectation for property: " + JSON.stringify(oProperty));
									return null;
								}
								break;
							}
						}
						if (!bFound) {
							Opa5.assert.notOk(true, "Toolbar Button: \"" + aButton[i] + "\" not found in toolbar");
							return null;
						}
					}
					Opa5.assert.ok(true, "Toolbar buttons visibility did match the expectation for " + JSON.stringify(oProperty));
					return null;
				},
				errorMessage: "\"" + sControlType + "\" with id: \"" + sId + "\" not found"
			});
		};

		var privateMethods = {
			calculateAppParamsUrl: calculateAppParamsUrl,
			testLibraryCommonMethods: new TestLibraryCommon(),
			getTableControlType: getTableControlType,
			getMatchers: createMatchers,
			iCheckToolBarControlProperty: checkToolBarControlProperty
		};

		return Opa5.extend("sap.suite.ui.generic.template.integration.Common.Common", {

			/**
			 * @param {String} sAppName - name of app or appname along with starting parameters
			 * Example: sAppName="SalesOrder-nondraft#SalesOrder-nondraft"
			 * @param {String} sManifestName - provide manifest name if you want to start your application with dynamic manifest
			 * @param {Object} oAppParams - In this object you can send multiple parameter such as if you want your app to load with change
			 * or in particular language or particular theme or with any dynamic key & value.
			 * Example: oAppParams={bWithChange: true, sapUiLanguage="DE", sapTheme="sap_belize"}
			 * @return {*} success or failure
			 */
			iStartMyAppInSandbox: function (sAppName, sManifestName, oAppParams) {
				var sOpaFrame = "test-resources/sap/suite/ui/generic/template/demokit/flpSandbox.html?";
				var sOpaFrameUrlParameters = privateMethods.calculateAppParamsUrl(oAppParams);
				sOpaFrame = sOpaFrame + sOpaFrameUrlParameters + "&flpApps=" + sAppName;
				if (sManifestName) {
					sOpaFrame = sOpaFrame + (~sAppName.indexOf("?") ? "&" : "?") + "manifest=" + sManifestName;
				}
				/* eslint-disable */
				console.log("OPA5::Common.js::iStartMyAppInSandbox" + " sOpaFrame: " + sOpaFrame);
				/* eslint-enable */
				return this.iStartMyAppInAFrame(sOpaFrame);
			},

			iStartMyAppInSandboxWithNoParams: function (sAppName, oDimWidthHeight) {
				var sOpaFrame = "test-resources/sap/suite/ui/generic/template/demokit/flpSandbox.html" + sAppName;
				/* eslint-disable */
				console.log("OPA5::Common.js::iStartMyAppInSandboxWithNoParams" + " sOpaFrame: " + sOpaFrame);
				/* eslint-enable */
				if (oDimWidthHeight && oDimWidthHeight.width && oDimWidthHeight.height) {
					return this.iStartMyAppInAFrame({
						source: sOpaFrame,
						width: oDimWidthHeight.width,
						height: oDimWidthHeight.height
					});
				} else {
					return this.iStartMyAppInAFrame(sOpaFrame);
				}
			},

			/**
			 * @param {String} sAppNameWithOrWithoutParams - name of app or appname along with starting parameters
			 * Example: sAppNameWithOrWithoutParams="sttasalesordernd" or "sttasalesordernd#/STTA_C_SO_SalesOrder_ND('500000011')"
			 * @param {String} sManifestName - provide manifest name if you want to start your application with dynamic manifest
			 * @param {Object} oAppParams - In this object you can send multiple parameter such as if you want your app to load with change
			 * or in particular language or particular theme or with any dynamic key & value.
			 * Example: oAppParams={bWithChange: true, sapUiLanguage="DE", sapTheme="sap_belize"}
			 * @param {object} oDimWidthHeight - provide the width and height if you want to start your application with different iframe width and height
			 * 	Example: oDimWidthHeight={width: "1500", height:"900"}
 			 * @return {*} success or failure
			 */
			iStartMyAppInDemokit: function (sAppNameWithOrWithoutParams, sManifestName, oAppParams, oDimWidthHeight) {
				var sOpaFrame = "test-resources/sap/suite/ui/generic/template/demokit/demokit.html";
				var urlParams = privateMethods.calculateAppParamsUrl(oAppParams);
				var sOpaFrameUrlParameters = urlParams + "&demoApp=" + sAppNameWithOrWithoutParams;
				if (sManifestName) {
					sOpaFrame = sOpaFrame + "?manifest=" + sManifestName + "&" + sOpaFrameUrlParameters;
				} else {
					sOpaFrame = sOpaFrame + "?" + sOpaFrameUrlParameters;
				}
				/* eslint-disable */
				console.log("OPA5::Common.js::iStartMyAppInDemokit" + " sOpaFrame: " + sOpaFrame);
				/* eslint-enable */
				if (oDimWidthHeight && oDimWidthHeight.width && oDimWidthHeight.height) {
					return this.iStartMyAppInAFrame({
						source: sOpaFrame,
						width: oDimWidthHeight.width,
						height: oDimWidthHeight.height
					});
				} else {
				return this.iStartMyAppInAFrame(sOpaFrame);
				}
			},

			iTeardownMyApp: function () {
				/* eslint-disable */
				console.log("OPA5::Common.js::iTeardownMyApp");
				/* eslint-enable */
				if (OpaDataStore && Object.keys(OpaDataStore).length) {
					OpaDataStore.clearData();
				}
				return this.iTeardownMyAppFrame();
			},

			iLookAtTheScreen: function () {
				return this;
			},

			/**
			 *
			 * @param {string} viewId - view id on which scroll will be performed.
			 * @param {string} positionX - scroll position x
			 * @param {string} positionY - scroll position y
			 * @return {*} success or failure
			 */
			iScrollViewToPosition: function(viewId, positionX, positionY) {
				if (arguments.length < 3) {
					Opa5.assert.notOk(true, "viewId, positionX & positionY parameter is must");
					return null;
				}
				return this.waitFor({
					autoWait: false,
					id: new RegExp(viewId + "$"),
					success: function (oView) {
						setTimeout(function() {
							oView[0].getContent()[0].getScrollDelegate().scrollTo(positionX, positionY);
							Opa5.assert.ok(true, "Window scrolled to position x: " +  positionX + ", y: " + positionY + " successfully");
						});
					},
					errorMessage: "Window scroll failed"
				});
			},

			iClickTheControlWithId: function (sId) {
				return this.waitFor({
					id: new RegExp(sId + "$"),
					matchers: privateMethods.getMatchers({"visible": true, "enabled": true}),
					success: function (oControl) {
						new Press().executeOn(oControl[0]);
						Opa5.assert.ok(true, "The Control with id: \"" + sId + "\" was clicked successfully");
					},
					errorMessage: "The Control with id: \"" + sId + "\" could not be found"
				});
			},

			iClickTheControlByControlType: function (sControlType, oProperty) {
				if (arguments.length < 2) {
					Opa5.assert.notOk(true, "There must be 2 parameters");
					return null;
				}
				return this.waitFor({
					controlType: sControlType,
					matchers: privateMethods.getMatchers(oProperty),
					success: function (oControl) {
						new Press().executeOn(oControl[0]);
						Opa5.assert.ok(true, "The Control with type: \"" + sControlType + "\" was clicked successfully");
					},
					errorMessage: "The Control with type: \"" + sControlType + "\" could not be found"
				});
			},

			iClickOnButtonWithText: function (sBtnText, bOpenDialog) {
				return this.waitFor({
					searchOpenDialogs: !!bOpenDialog,
					controlType: "sap.m.Button",
					matchers: privateMethods.getMatchers({"visible": true, "enabled": true, "text": sBtnText}),
					success: function (oButton) {
						new Press().executeOn(oButton[0]);
						Opa5.assert.ok(true, "The button with text: \"" + sBtnText + "\" was clicked successfully");
					},
					errorMessage: "The Button with text: \"" + sBtnText + "\" could not be found"
				});
			},

			iClickTheButtonWithIcon: function(sIcon) {
				return this.waitFor({
					controlType: "sap.m.Button",
					matchers: privateMethods.getMatchers({"visible": true, "enabled": true, "icon": sIcon}),
					success: function (oButton) {
						new Press().executeOn(oButton[0]);
						Opa5.assert.ok(true, "Button with icon: \"" + sIcon + "\" was successfully clicked");
					},
					errorMessage: "Button with icon: \"" + sIcon + "\" not found or enabled"
				});
			},

			iClickMenuItem: function(sText) {
                return this.waitFor({
                    controlType: "sap.ui.unified.Menu",
                    success: function (oUnifiedMenu) {
                        var aItems = oUnifiedMenu[0].getItems();
                        for (var i = 0; i < aItems.length; i++) {
                            if (aItems[i].getText() === sText) {
                                new Press().executeOn(aItems[i]);
                                Opa5.assert.ok(true, "MenuItem '" + sText + "' is clicked successfully");
                                return null;
                            }
                        }
						Opa5.assert.ok(false, "MenuItem '" + sText + "' is not found");
                    },
                    errorMessage: "Menu Item " + sText + " not found on page or correct parameter not passed"
                });
            },

			iClickOnButtonWithTooltip: function(sTooltip) {
				return this.waitFor({
					controlType: "sap.m.Button",
					matchers: privateMethods.getMatchers({"visible": true, "enabled": true, "tooltip": sTooltip}),
					success: function (oButton) {
						new Press().executeOn(oButton[0]);
						Opa5.assert.ok(true, "Button with tooltip: \"" + sTooltip + "\" was successfully clicked");
					},
					errorMessage: "Button with tooltip: \"" + sTooltip + "\" not found or enabled"
				});
			},

			iClickTheSegmentedButton: function(sKey, bOpenDialog) {
				return this.waitFor({
					searchOpenDialogs: !!bOpenDialog,
					controlType: "sap.m.SegmentedButton",
					success: function(aSegmentedButton) {
						var bFlag=false
						aSegmentedButton.forEach(function (oSegmentedButton) {
							var aButtons = oSegmentedButton.getItems();
							for (var i = 0; i < aButtons.length; i++) {
								if (aButtons[i].getKey() === sKey) {
									new Press().executeOn(aButtons[i]);
									bFlag=true;
									return null;
								}
							}
						});
						Opa5.assert.ok(bFlag, "Segmented button with the key '" + sKey + "' is clicked");
						return null;
					},
					errorMessage: "SegmentedButton not found on the screen"
				});
			},

			iClickTheButtonOnTheDialog: function (sButtonName, sDialogTitle) {
				var oDialogButton = null;
				return this.waitFor({
					searchOpenDialogs: true,
					controlType: "sap.m.Button",
					check: function (aButtons) {
						var bSuccess = false;
						aButtons.forEach(function (oButton) {
							var oDialog = oButton.getParent();
							if (sDialogTitle && oButton.getText() === sButtonName && oDialog.getTitle() === sDialogTitle) {
								oDialogButton = oButton;
								bSuccess = true;
							} else if (oButton.getText() === sButtonName) {
								oDialogButton = oButton;
								bSuccess = true;
							}
						});
						return bSuccess;
					},
					success: function () {
						oDialogButton.firePress();
						Opa5.assert.ok(true, "'" + sButtonName + "' is clicked on the Dialog");
					},
					errorMessage: "Not able to click the dialog button"
				});
			},
			iClickOnASmartLink: function (sName) {
				return this.waitFor({
					controlType: "sap.ui.comp.navpopover.SmartLink",
					matchers: privateMethods.getMatchers({"visible": true, "enabled": true, "text": sName}),
					success: function(oLink) {
						new Press().executeOn(oLink[0]);
						Opa5.assert.ok(true, "The Smart link with name: \"" + sName + "\" was clicked successfully");
					},
					errorMessage: "Smart link with name: '" + sName + "' is either not visible/enabled or not found"
				});
			},

			// Click on checkbox/radio having label as sText. Default control type is: "sap.m.CheckBox"
			iClickOnCheckboxWithText: function(sText, sId, bCheckBox) {
				var sControlType = (bCheckBox !== false) ? "sap.m.CheckBox" : "sap.m.RadioButton";
				var sControlId = sId ? sId : "";
				return this.waitFor({
					controlType: sControlType,
					id: new RegExp(sControlId + "$"),
					matchers: privateMethods.getMatchers({"visible": true, "enabled": true, "text": sText}),
					success: function(aControl) {
						aControl[0].setSelected(!aControl[0].getSelected());
						aControl[0].fireSelect({selected : aControl[0].getSelected()});
						Opa5.assert.ok(true, "Control type: \"" + sControlType + "\" with text: \"" + sText + "\" and id: \"" + sId + "\" got selected with value: \"" + aControl[0].getSelected() + "\"");
					},
					errorMessage: "Failed to get control type: \"" + sControlType + "\" with text: \"" + sText + "\" and id: \"" + sId + "\""
				});
			},

			iClickOnPagesMultiInputOnSaveAsTileDialog: function () {
                return this.waitFor({
                    controlType: "sap.ushell.ui.ContentNodeSelector",
					id: new RegExp("SelectedNodesComboBox$"),
                    success: function(aContentNodeSelectors) {
                        var oContentNodeSelector = aContentNodeSelectors[0];
                        var oMultiInput = oContentNodeSelector.getAggregation("content");
                        new Press().executeOn(oMultiInput);
                        Opa5.assert.ok(true, "The 'Pages' multi input on the bookmark dialog was clicked successfully");
                    },
                    errorMessage: "The 'Pages' multi input on the bookmark dialog is either not visible/enabled or not found"
                });
            },

			// Check value on checkbox/radio button having label as sText. Default control type is: "sap.m.CheckBox"
			iCheckCheckboxSelectedValue: function(sText, sId, bSelected, bCheckBox) {
				bCheckBox = bCheckBox !== false;
				var sControlType = (bCheckBox !== false) ? "sap.m.CheckBox" : "sap.m.RadioButton";
				return this.waitFor({
					controlType: sControlType,
					id: new RegExp(sId + "$"),
					matchers: privateMethods.getMatchers({"visible": true, "enabled": true, "text": sText}),
					success: function(aControl) {
						var bActualValue = aControl[0].getSelected();
						Opa5.assert.equal(bActualValue, bSelected, "Control type: \"" + sControlType + "\" expected selected value is: \"" + bSelected + "\"");
					},
					errorMessage: "Failed to get control type: \"" + sControlType + "\" with id: \"" + sId + "\""
				});
			},

			/**
			 * Don't use setValue method to set value in field as in some cases it doesn't trigger OData property change
			 * @param {String} sValue - value to be set
			 * @param {String} sId - id of field
			 * @param {boolean} bEnter - true if the action needs Enter key , by default this is false
			 * @return {*} success or failure
			 */
			iEnterValueInField: function (sValue, sId, bEnter) {
				bEnter =  bEnter ? bEnter : false;
				return this.waitFor({
					id: new RegExp(sId + "$"),
					matchers: privateMethods.getMatchers({ "visible": true, "enabled": true }),
					actions: [new EnterText({ text: sValue, pressEnterKey:bEnter })],
					success: function () {
						Opa5.assert.ok(true, "Value '" + sValue + "' is set for the field with id '" + sId + "'");
					},
					errorMessage: "Field with id: '" + sId + "' is either not visible/enabled or not found"
				});
			},

			/**
			 * Check custom data value of any control
			 * @param {String} sControlType - UI5 control type
			 * @param {String} sId - id of control
			 * @param {Object} oCustomData - object with property name as custom data key and value as custom data value
			 * Example: {"presentationVariantQualifier": "Chart1", "chartQualifier": "Chart1"}
			 * @return {*} - success or failure
			 */
			iCheckCustomDataOfControl: function(sControlType, sId, oCustomData) {
				return this.waitFor({
					controlType: sControlType,
					id: new RegExp(sId + "$"),
					success: function(aNodes) {
						var aCustomData = aNodes[0].getCustomData();
						var aCustomKeys = Object.keys(oCustomData);
						var iCount = 0;
						for (var i = 0; i < aCustomData.length; i++) {
							var sKey = aCustomData[i].getProperty("key");
							var iIndex = aCustomKeys.indexOf(sKey);
							if (iIndex !== -1) {
								iCount++;
								Opa5.assert.equal(aCustomData[i].getProperty("value"), oCustomData[aCustomKeys[iIndex]], "Custom key: \"" + sKey + "\" is set correctly");
							}
						}
						if (iCount !== aCustomKeys.length) {
							Opa5.assert.notOk(true, "Some custom data not found or not set for control: \"" + sControlType +"\"");
						}
					},
					errorMessage: "The SmartChart with Id containing 'tab2' could not be found "
				});
			},

			/**
			 * If control can be focused then it will set focus and test case succeeds
			 * @param {String} sId - id of control on which you want to set focus
			 * @return {*} success or failure
			 */
			iSetFocusOnControlWithId: function(sId) {
				return this.waitFor({
					id: new RegExp(sId + "$"),
					matchers: privateMethods.getMatchers({"visible": true, "enabled": true}),
					success: function(aInputField) {
						if (aInputField[0] && aInputField[0].focus) {
							aInputField[0].focus();
							Opa5.assert.ok(true, "The Smart Field value should be: \"" + sId + "\"");
							return null;
						}
						Opa5.assert.notOk(true, "Please send the correct focusable control id");
					},
					errorMessage: "Field with id: '" + sId + "' is either not visible/enabled or not found"
				});
			},

			/**
			 *
			 * @param {String} sComboboxId - sap.m.Select control id
			 * @param {Number} iNthItem - Item number to be selected
			 * @return {*} success or failure
			 */
			iSelectComboboxValue: function (sComboboxId, iNthItem) {
				if (arguments.length < 2) {
					Opa5.assert.notOk(true, "Expected number of arguments is 2");
					return null;
				}
				return this.waitFor({
					controlType: "sap.m.Select",
					id: new RegExp(sComboboxId + "$"),
					success: function(oControl) {
						var aItems = oControl[0].getAggregation("items");
						if (aItems && aItems[iNthItem - 1]) {
							oControl[0].setSelectedItem(aItems[iNthItem - 1]);
							Opa5.assert.ok(true, "Items with text: \"" + aItems[iNthItem - 1].getText() + "\" got selected");
							return null;
						}
						Opa5.assert.notOk(true, "Items in a combobox is: \"" + aItems.length + "\" but tried to select item: \"" + iNthItem + "\"");
					},
					errorMessage: "Combobox with id: \"" + sComboboxId + "\" not found"
				});
			},

			/**
			 * Check length & items of combobox
			 * @param {String} sComboboxId - id of combobox
			 * @param {Number} iLength - Number of items expected in combobox
			 * @param {Array} aValue - pass expected values of combobox
			 * @return {*} success or failure
			 */
			iCheckComboboxValues: function(sComboboxId, iLength, aValue) {
				if (arguments.length < 3) {
					Opa5.assert.notOk(true, "Expected number of arguments is 3");
					return null;
				}
				return this.waitFor({
					id: new RegExp(sComboboxId + "$"),
					success: function(oControl) {
						var aItems = oControl[0].getAggregation("items");
						Opa5.assert.equal(aItems.length, iLength, "Expected items in a combobox to be: \"" + iLength + "\"");
						for(var i = 0; i < aItems.length; i++) {
							Opa5.assert.equal(aItems[i].getText(), aValue[i], "Nth item in combobox expected to be: Item number: " + (i + 1) + ", Expected Value: \"" + aValue[i] + "\"");
						}
					},
					errorMessage: "Combobox with id: \"" + sComboboxId + "\" not found"
				});
			},

			iCheckComboboxSelectedValue: function(sComboboxId, sSelectedValue) {
				if (arguments.length < 2) {
					Opa5.assert.notOk(true, "Expected number of arguments is 2");
					return null;
				}
				return this.waitFor({
					controlType: "sap.m.Select",
					id: new RegExp(sComboboxId + "$"),
					success: function (oControl) {
						Opa5.assert.equal(oControl[0].getSelectedItem().getText(), sSelectedValue, "Expected selected value in combobox is: \"" + sSelectedValue + "\"");
					},
					errorMessage: "Combobox with id: \"" + sComboboxId + "\" not found"
				});
			},

			/**
			* Check if intended value is present in the DropDown menu
			* @param {String} sSelectDropDownId - id of DropDown menu
			* @param {String} sValue - Value to be searched in DropDown menu
			* @param {Boolean} bPresent - pass true/false to check if sValue should be present or not
			* @return {*} success or failure
			*/
			iCheckTheItemPresentIntheSelectDropDown: function(sSelectDropDownId, sValue, bPresent) {
				return this.waitFor({
					controlType: "sap.m.Select",
					id: new RegExp(sSelectDropDownId + "$"),
					success: function (oControl) {
						for(var i = 0; i < oControl[0].getItems().length; i++){
							var bFound = false;
							if(oControl[0].getItems()[i].getText() === sValue){
								bFound = true;
								break;
							}
						}
						if(bPresent){
							Opa5.assert.ok(bFound, sValue + " is present in the dropdown");
						}
						else{
							Opa5.assert.ok(!bFound, sValue + " is not present in the dropdown");
						}
					},
					errorMessage: "DropDown with id: \"" + sSelectDropDownId + "\" not found"
				});
			},

			theMessagePageShouldBeOpened: function() {
				return this.waitFor({
					controlType: "sap.m.IllustratedMessage",
					autoWait: true,
					matchers: privateMethods.getMatchers({"visible": true}),
					success: function() {
						Opa5.assert.ok(true, "The Message Page has been reached");
					},
					errorMessage: "Message Page not found "
				});
			},

			/**
			 *
			 * @param {String} sSectionText - section name for which grouped section need to be checked
			 * @param {Array} aGroupedSubSectionText - Array of sub-section name to be checked
			 * @param {Number} iNthOP - Nth OP on which selection need to be done
			 * @return {*} -Success or failure
			 */
			iCheckSubsectionNameGroupedUnderSection: function(sSectionText, aGroupedSubSectionText, iNthOP) {
				iNthOP = iNthOP ? iNthOP - 1 : 0;
				return this.waitFor({
					controlType: "sap.uxap.ObjectPageLayout",
					matchers: privateMethods.getMatchers({"visible": true}),
					success: function(oControl) {
						if (oControl && oControl.length < iNthOP + 1) {
							Opa5.assert.notOk(true, "Trying to access to \"" + (iNthOP + 1) + "\" OP not permissible as max available OP is: \"" + oControl.length + "\"");
							return null;
						}
						var aSection = oControl[iNthOP].getSections();
						var iCount = 0;
						for (var i = 0; i < aSection.length; i++) {
							var sTitle = aSection[i].getTitle();
							if (aSection[i].getVisible() && sTitle === sSectionText) {
								var aSubSection = aSection[i].getSubSections();
								for (var j = 0; j < aSubSection.length; j++) {
									if (aSubSection[j].getVisible() && aGroupedSubSectionText.indexOf(aSubSection[j].getTitle()) !== -1) {
										iCount++;
									}
								}
								if (iCount === aGroupedSubSectionText.length) {
									Opa5.assert.ok(true, "Section: \"" + sSectionText + "\" found with proper grouped subsection: " + JSON.stringify(aGroupedSubSectionText));
									return null;
								}
								iCount = 0;
							}
						}
						Opa5.assert.notOk(true, "Section: \"" + sSectionText + "\" not found with proper grouped subsection: " + JSON.stringify(aGroupedSubSectionText));
					},
					errorMessage: "The Object Page Layout couldn't be found on the page or is not visible"
				});
			},

			/**
			 * Pass OP/LR XMLView entity set name to check if page is loaded or not.
			 * @param {string} sComponentName - Name of component (ListReport, ObjectPage)
			 * @param {string} sEntitySet - Entity Set name to which OP/LR is bound
			 * @return {*} success or failure
			 */
			iWaitForThePageToLoad: function(sComponentName, sEntitySet) {
				if (!sEntitySet || !sComponentName) {
					Opa5.assert.notOk(true, "Entity set name and component name must be provided");
					return null;
				}
				var aValidComponent = ["ListReport", "ObjectPage", "AnalyticalListPage"];
				var iIndex = aValidComponent.indexOf(sComponentName);
				if (iIndex === -1) {
					Opa5.assert.notOk(true, "Please provide the valid component name (ListReport/ObjectPage)");
					return null;
				}
				var sId;
				switch (iIndex) {
					case 0:
						sId = "view.ListReport::" + sEntitySet;
						break;
					case 1:
						sId = "view.Details::" + sEntitySet;
						break;
					case 2:
						sId = "view.AnalyticalListPage::" + sEntitySet;
						break;
					default:
						break;
				}
				return this.waitFor({
					controlType: "sap.ui.core.mvc.XMLView",
					id: new RegExp(sId + "$"),
					autoWait: false,
					matchers: function (oView) {
						oView = Array.isArray(oView) ? oView[0] : oView;
						var oComponentContainer = oView.getParent().getComponentContainer();
						var oAppComponent = oComponentContainer.getParent();
						return !oAppComponent.getBusy();
					},
					success: function() {
						Opa5.assert.ok(true, "The '" + sComponentName + "' is loaded");
					},
					errorMessage: "XML view for '" + sComponentName + "' not found"
				});
			},

			// check OP is bound to which entity set
			iCheckObjectPageEntitySet: function (sEntitySet) {
				var sId = sEntitySet ? "view.Details::" + sEntitySet + "--objectPage" : "--objectPage";
				return this.waitFor({
					controlType: "sap.uxap.ObjectPageLayout",
					id: new RegExp(sId + "$"),
					autoWait: true,
					success: function(oControl) {
						var sControlPath = oControl[0].getBindingContext().getPath();
						var sOPEntitySet = sControlPath.substring(1, sControlPath.indexOf("("));
						Opa5.assert.equal(sOPEntitySet, sEntitySet, "Object Page is bound to entitySet: \"" + sOPEntitySet + "\"");
					},
					errorMessage: "The Object Page does not have the correct entity set bound"
				});
			},

			theSmartTableIsVisible: function(sId) {
				return this.waitFor({
					controlType: "sap.ui.comp.smarttable.SmartTable",
					id: new RegExp(sId + "$"),
					matchers: privateMethods.getMatchers({"visible": true}),
					success: function() {
						Opa5.assert.ok(true, "The Smart Table with id: \"" + sId + "\" is visible on the screen");
					},
					errorMessage: "The Smart Table couldn't be found on the page"
				});
			},

			// click an item in the responsive table - will navigate to Object Page
			iClickTheItemInResponsiveTable: function (iIndex, tab, sId) {
				var sMultiViewId = tab ? "responsiveTable-" + tab : "responsiveTable";
				sId = sId ? sId : sMultiViewId;
				return this.waitFor({
					controlType: "sap.m.Table",
					id: new RegExp(sId + "$"),
					matchers: [
						new AggregationFilled({
							name: "items"
						})
					],
					actions: function (oControl) {
						var oItem = oControl.getItems()[iIndex];
						OpaDataStore.setData("tableItems", oControl.getItems());
						OpaDataStore.setData("navContextPath", oItem.getBindingContext().getPath());
						OpaDataStore.setData("selectedItem", oItem);
						oControl.fireItemPress({
							listItem: oItem
						});
					},
					success: function() {
						Opa5.assert.ok(true, "sap.m.Table row index: \"" + iIndex + "\" clicked successfully");
					},
					errorMessage: "sap.m.Table is not rendered correctly"
				});
			},

			// This method is only applicable for UI table
			iNavigateUsingUITable: function (iRow, sTableId) {
				return this.waitFor({
					id: new RegExp(sTableId + "$"),
					success: function (aTables) {
						var oRowActionItem = aTables[0].getRows()[iRow - 1].getRowAction().getItems()[0];
						oRowActionItem.firePress({ item: oRowActionItem });
						Opa5.assert.ok(true, "Row clicked successfully");
					},
					errorMessage: "Table is not rendered correctly"
				});
			},

			iOpenTheContextMenuForNthRowOfTable: function (iRow, sTableId) {
				return this.waitFor({
					id: new RegExp(sTableId + "$"),
					success: function (aTables) {
						var aRows = aTables[0].isA("sap.m.Table") ? aTables[0].getItems() : aTables[0].getRows();
						aRows[iRow - 1].informList("ContextMenu", {
							preventDefault: function () { },
							setMarked: function () { }
						});
						Opa5.assert.ok(true, "ContextMenu Opened successfully");
					},
					errorMessage: "Table is not rendered correctly"
				});
			},

			iClickTheItemOnTheContextMenu: function (sItem) {
				return this.waitFor({
					controlType: "sap.ui.unified.Menu",
					success: function (aMenus) {
						var aItems = aMenus[0].getItems()
						for (var i = 0; i < aItems.length; i++) {
							if (aItems[i].getText() === sItem) {
								new Press().executeOn(aItems[i]);
								Opa5.assert.ok(true, "Item '" + sItem + "' clicked from the ContextMenu");
								return null;
							}
						}
						Opa5.assert.notOk(true, "Item '" + sItem + "' not found in the ContextMenu");
					},
					errorMessage: "ContextMenu is not rendered correctly"
				});
			},

			iCheckTheItemsOnTheContextMenu: function (aItems) {
				return this.waitFor({
					controlType: "sap.ui.unified.Menu",
					success: function (aMenus) {
						var aMenuItems = aMenus[0].getItems()
						var bFlag;
						for (var i = 0; i < aItems.length; i++) {
							bFlag = false;
							for (var j = 0; j < aMenuItems.length; j++) {
								if (aMenuItems[j].getText() === aItems[i].text) {
									this.iCheckControlPropertiesById(aMenuItems[j].getId(), aItems[i]);
									bFlag = true
									break;
								}
							}
							Opa5.assert.ok(bFlag, "Item '" + aItems[i].text + "'found in the ContextMenu");
						}
					},
					errorMessage: "ContextMenu is not rendered correctly"
				});
			},

			iShouldSeeNoSupportAssistantErrors: function() {
				return this.waitFor({
					success: function() {
						Opa5.assert.noRuleFailures({
							failOnHighIssues: false,
							rules: [{
								libName: "sap.ui.core",
								ruleId: "libraryUsage"
							}],
							executionScope: {
								type: 'components',
								selectors: [
									"__component0"
								]
							}
						});
					}
				});
			},

			iShouldGetSupportRuleReport: function() {
				return this.waitFor({
					success: function() {
						Opa5.assert.getFinalReport();
					}
				});
			},

			/**
			 *
			 * @param {boolean} bCheckAvailableAction - true, if you want to check available action. false if you want to check for
			 * unavailable actions.
			 * @param {Array} aAction - Array of action name. Pass available action name if bCheckAvailableAction is true,
			 * else pass unavailable actions list.
			 * @param {String} sId - Id of related app sheet if more than once is visible at a time.
			 * @return {*} - success or failure
			 */
			iCheckRelatedAppsSheetList: function(bCheckAvailableAction, aAction, sId) {
				sId = sId ? sId : "realtedAppsSheet";
				return this.waitFor({
					id: new RegExp(sId + "$"),
					autoWait: false,
					success: function(oRelatedApps) {
						var aRelatedAppButton = oRelatedApps[0].getButtons();
						for (var i = 0; i < aAction.length; i++) {
							for (var j = 0; j < aRelatedAppButton.length; j++) {
								var sButtonText = aRelatedAppButton[j].getText();
								if (!bCheckAvailableAction && (sButtonText === aAction[i])) {
									Opa5.assert.notOk(true, "\"" + aAction[i] + "\" found in related app sheet list but it shouldn't be available");
									return null;
								} else if (bCheckAvailableAction) {
									if (sButtonText === aAction[i]) {
										break;
									} else if (j === aRelatedAppButton.length - 1) {
										Opa5.assert.notOk(true, "\"" + aAction[i] + "\" not found in related app sheet list");
										return null;
									}
								} else if (i === aAction.length - 1 && j === aRelatedAppButton.length - 1) {
									Opa5.assert.ok(true, "Related app sheet list not available as expected");
									return null;
								}
							}
						}
						Opa5.assert.ok(true, "Related app sheet list found as expected");
					},
					errorMessage: "The Related Apps Sheet control not found"
				});
			},

			/**
			 * To search in search input field, sId is must. By default it will search in table toolbar.
			 * @param {string} sSearchText - text to search
			 * @param {string} sId - id of table toolbar search or search input field
			 * @return {*}
			 */
			iSearchInTableToolbarOrSearchInputField: function (sSearchText, sId) {
				sId = sId ? sId : "Table::Toolbar::SearchField";
				return this.waitFor({
					controlType: "sap.m.SearchField",
					id: new RegExp(sId + "$"),
					matchers: privateMethods.getMatchers({"visible": true, "enabled": true}),
					actions: new EnterText({
						text: sSearchText,
						pressEnterKey: true
					}),
					success: function () {
						Opa5.assert.ok(true, "Table has search field in toolbar");
					},
					errorMessage: "Search field not found, check for visibility or enablement of search field"
				});
			},

			/**
			 * @param {Object} oProperty - Pass table property as key value pair in object form
			 * @param {string} sTableType - pass table type. Default is "responsiveTable"
			 * @param {string} sId - table id
			 * @return {*} success or failure
			 */
			iCheckTableProperties: function(oProperty, sTableType, sId) {
				var oTableProp = privateMethods.getTableControlType(sTableType || "responsiveTable");
				sId = sId ? sId : oTableProp["tableType"];
				return this.waitFor({
					controlType: oTableProp["controlType"],
					id: new RegExp(sId + "$", "i"),
					matchers: privateMethods.getMatchers(oProperty),
					success: function() {
						Opa5.assert.ok(true, "Table control type: '" + oTableProp["controlType"] + "' found with property: '" + JSON.stringify(oProperty) + "'");
					},
					errorMessage: "Table control type: '" + oTableProp["controlType"] + "' not found with visibility: '" + JSON.stringify(oProperty) + "'"
				});
			},

			/**
			 * Check the visibility of the custom column on the table
			 * @param {string} sColumnName - name of the custom column
			 * @param {boolean} bVisibility - Pass true/false to check table visibility
			 * @param {string} sTableType - pass table type. Default is "responsiveTable"
			 * @param {string} sId - table id
			 * @return {*} success or failure
			 */
			iCheckTableCustomColumnVisibility: function(sColumnName, bVisibility, sTableType, sId) {
				var oTableProp = privateMethods.getTableControlType(sTableType || "responsiveTable");
				sId = sId ? sId : oTableProp["tableType"];
				return this.waitFor({
					controlType: oTableProp["controlType"],
					id: new RegExp(sId + "$", "i"),
					matchers: privateMethods.getMatchers({"visible": true}),
					success: function (table){
						var oTable = Array.isArray(table) ? table[0] : table;
						var aColumns = oTable.getAggregation("columns");
						for (var i = 0; i < aColumns.length; i++) {
							if (aColumns[i].getLabel().getText() === sColumnName && aColumns[i].getLabel().getVisible() === bVisibility){
								Opa5.assert.ok(true, "Column: '" + sColumnName +  "' visibility '" + bVisibility + "' found as expected");
								return null;
							}
						}
						Opa5.assert.notOk(true, "Column: '" + sColumnName +  "' visibility '" + bVisibility + "' not found as expected");
					},
					errorMessage: "The table not found on the screen with the given id"
				});
			},

			/**
			 * Check the visibility of the column on the table
			 * @param {string} sColumnName - Name of the column
			 * @param {boolean} bVisibility - Pass true/false to check table visibility
			 * @param {string} sId - Full or last part of the table id
			 * @return {*} success or failure
			 */
			iCheckTableColumnVisibility: function (sColumnName, bVisibility, sId) {
				return this.waitFor({
					id: new RegExp(sId + "$"),
					matchers: privateMethods.getMatchers({ "visible": true }),
					success: function (oTable) {
						oTable = Array.isArray(oTable) ? oTable[0] : oTable;
						var aColumns = oTable.getAggregation("columns");
						var tableType = oTable.getMetadata().getElementName();
						for (var i = 0; i < aColumns.length; i++) {
							var sActualColumnName = tableType === "sap.m.Table" ? aColumns[i].getHeader().getText() : aColumns[i].getLabel().getText();
							if (sActualColumnName === sColumnName && aColumns[i].getVisible() === bVisibility) {
								Opa5.assert.ok(true, "Column: '" + sColumnName + "' visibility '" + bVisibility + "' found as expected");
								return null;
							}
						}
						Opa5.assert.notOk(true, "Column: '" + sColumnName + "' visibility '" + bVisibility + "' not found as expected");
					},
					errorMessage: "The table not found on the screen with the given id"
				});
			},

			/**
			 * Click on the column header to open the column header menu
			 * @param {string} sId - Full or last part of the table column id
			 * @return {*} success or failure
			 */
			iClickOnColumnHeaderWithId: function (sId) {
				return this.waitFor({
					id: new RegExp(sId + "$"),
					success: function (aColumns) {
						new Press().executeOn(aColumns[0]);
						Opa5.assert.ok(true, "Column header for the column with id '" + sId + "' clicked");
					},
					errorMessage: "The column with id " + sId + "is not available"
				});
			},

			/**
			 * @param {string} sColumn - name of column
			 * @return {*} success or failure
			 */
			iAddColumnFromP13nDialog: function(sColumn) {
				var bSuccess = false, oCheckBox;
				return this.waitFor({
					controlType:"sap.m.CheckBox",
					searchOpenDialogs: true,
					check: function (aCheckBox) {
						for (var i = 0; i < aCheckBox.length; i++) {
							if (aCheckBox[i].getParent().getCells && aCheckBox[i].getParent().getCells()[0].getItems()[0].getText() === sColumn) {
								oCheckBox = aCheckBox[i];
								bSuccess = true;
								break;
							}
						}
						return bSuccess;
					},
					success: function () {
						oCheckBox.setSelected(!oCheckBox.getSelected());
						oCheckBox.fireSelect({ selected: oCheckBox.getSelected() });
						Opa5.assert.ok(true, "Selected '" + sColumn + "' in p13n dialog");
					},
					errorMessage: "Failed to select column in p13n dialog"
				});
			},
			/**
			 * Check the AutoColumnWidth Custom Data for the given column (sap.m.column)
			 * @param {Object} oData - Pass AutoColumnWidth custom data property as key value pair in object form. Eg: { "min": 3, "max": 20 }
			 * @param {String} sColumnId - Full or last part of the id of the Column
			 * @return {*} - success or failure
			 */
			iCheckTheAutoColumnWidthCustomDataForTheColumn: function (oData, sColumnId) {
				return this.waitFor({
					controlType: "sap.m.Column",
					id: new RegExp(sColumnId + "$"),
					success: function (oColumn) {
						var oAutoColumnWidthData = oColumn[0].getCustomData()[0].getValue().autoColumnWidth;
						if (!oAutoColumnWidthData) {
							Opa5.assert.notOk(true, "The AutoColumnWidth custom data not available for the Column with id '" + sColumnId + "'");
							return null;
						}
						var aAutoColumnWidthDataKeys = Object.keys(oAutoColumnWidthData);
						var aDataKeys = Object.keys(oData);
						var bFlag;
						for (var i = 0; i < aDataKeys.length; i++) {
							bFlag = false;
							for (var j = 0; j < aAutoColumnWidthDataKeys.length; j++) {
								if (aDataKeys[i] === aAutoColumnWidthDataKeys[j] && oData[aDataKeys[i]] === oAutoColumnWidthData[aAutoColumnWidthDataKeys[j]]) {
									bFlag = true;
									break;
								}
							}
							Opa5.assert.ok(bFlag, "The AutoColumnWidth custom data value '" + oData[aDataKeys[i]] + "' for the key '" + aDataKeys[i] + "' is matched for Column with id '" + sColumnId + "'");
						}
						return null;
					},
					errorMessage: "Column with id '" + sColumnId + "' not found on the screen"
				});
			},

			/*
			 * @param oButton - provide a list of button whose visible and enable property you want to check.
			 * Structure of oButton: {"key1": [bVisible, bEnabled, sText], "key2": [bVisible, bEnabled, sText]}
			 * key1 & key2 is the last part of button id which uniquely identifies that button.
			 * it is case insensitive.
			 * To check visibility on table different than responsive, you must need to pass table type.
			 * Possible values are: sTableType="responsiveTable" or "analyticalTable" or "gridTable" or "treeTable"
			 * @param sId - Full id of sap.m.Table
			 */
			iCheckTableToolbarControlProperty: function (oButton, sId, sTableType) {
				var oTableProp = privateMethods.getTableControlType(sTableType || "responsiveTable");
				sId = sId ? sId : oTableProp["tableType"];
				return privateMethods.iCheckToolBarControlProperty(oTableProp["controlType"], sId, oButton, this);
			},

			iCheckChartToolbarControlProperty: function (oButton, sId, sControlType) {
				if (arguments.length < 2) {
					Opa5.assert.notOk(true, "At least 2 parameters are expected");
					return null;
				}
				sControlType = sControlType ? sControlType : "sap.ui.comp.smartchart.SmartChart";
				return privateMethods.iCheckToolBarControlProperty(sControlType, sId, oButton, this);
			},

			/**
			* Click on the Table toolbar button with the given Label text.
			* Can be used to click on the tool bar button even if its moved to overflow area
			* @param {string} sLabel Label of table toolbar button
			* @param {string} sSmartTableId - Full id or last part of the id of the table
			* @return {*} success or failure
			**/
			iClickTheButtonOnTableToolBar: function (sLabel, sSmartTableId) {
				return this.waitFor({
					controlType: "sap.ui.comp.smarttable.SmartTable",
					id: new RegExp(sSmartTableId + "$"),
					success: function (oControl) {
						var aToolBarContents = oControl[0].getToolbar().getContent();
						for (var i = 0; i < aToolBarContents.length; i++) {
							if (aToolBarContents[i].getText && aToolBarContents[i].getText() === sLabel && aToolBarContents[i].getEnabled() === true) {
								aToolBarContents[i].firePress();
								Opa5.assert.ok(true, "'" + sLabel + "' button on the table toolbar clicked successfully");
								return null;
							}
						}
						Opa5.assert.notOk(true, "'" + sLabel + "' button not found/ not enabled on the table toolbar");
						return null;
					},
					errorMessage: "Smart table with given id not rendered on the screen"
				});
			},
			// Check number of items in table
			iCheckNumberOfItemsInTable: function (iItems, sId, sTableType) {
				var oTableProp = privateMethods.getTableControlType(sTableType || "responsiveTable");
				sId = sId ? sId : oTableProp["tableType"];
				return this.waitFor({
					controlType: oTableProp["controlType"],
					id: new RegExp(sId + "$", "i"),
					matchers: privateMethods.getMatchers({"visible": true}),
					success: function (aTable){
						switch (aTable[0].getMetadata().getElementName()) {
							case "sap.m.Table":
								Opa5.assert.equal(aTable[0].getItems().length, iItems, "Expected number of items in table with id: \"" + sId + "\" to be: \"" + iItems + "\"");
								break;
							case "sap.ui.table.Table":
								Opa5.assert.equal(aTable[0].getBinding().getLength(), iItems, "Expected number of items in table with id: \"" + sId + "\" to be: \"" + iItems + "\"");
								break;
							case "sap.ui.table.AnalyticalTable":
								Opa5.assert.equal(aTable[0].getBinding().getCount(), iItems, "Expected number of items in table with id: \"" + sId + "\" to be: \"" + iItems + "\"");
								break;
							default:
								break;
						}

					},
					errorMessage: "Table with id: \"" + sId + "\" and control type: \"" + oTableProp["controlType"] + "\" not found"
				});
			},

			/**
			 * Only applicable for responsive table. For multi view pass sId
			 * @param {String} sStatus - status
			 * @param {String} sId - id of responsive table
			 * @return {*} - success or failure
			 */
			iSelectAnItemOnLRTableWithStatus: function (sStatus, sId) {
				sId = sId ? sId : "responsiveTable";
				return this.waitFor({
					controlType: "sap.m.Table",
					id: new RegExp(sId + "$"),
					matchers: [
						new AggregationFilled({
							name: "items"
						})
					],
					actions: function (oTable) {
						oTable = Array.isArray(oTable) ? oTable[0] : oTable;
						var aItems = oTable.getItems(), oModel = aItems[0].getModel();
						var iIndex;
						for (var i = 0; i < aItems.length; i++) {
							var oEntity = oModel.getProperty(aItems[i].getBindingContext().getPath());
							if (sStatus === "Draft" && !oEntity.IsActiveEntity) {
								iIndex = i;
								break;
							} else if (oEntity.HasDraftEntity) {
								var sLockedBy = oModel.getProperty("/" + oEntity.DraftAdministrativeData.__ref).InProcessByUserDescription;
								if ((sStatus === "Unsaved Changes" && sLockedBy === "") || (sStatus === "Locked" && sLockedBy !== "")) {
									iIndex = i;
									break;
								}
							}
						}
						if (iIndex !== undefined) {
							oTable.setSelectedItem(aItems[iIndex]);
							oTable.fireSelectionChange({
								listItems: oTable.getSelectedItems(),
								selected: true
							});
						}
					},
					success: function() {
						Opa5.assert.ok(true, "Item with status: \"" + sStatus + "\" found and selected on table with id: \"" + sId + "\"");
					},
					errorMessage: "Table with id: \"" + sId + "\" not found"
				});
			},

			/*
			 * Checks P13nDialog title and using bEnabled we can check whether dialog is
			 * intractable or not.
			 */
			iCheckSmartTableViewSettingsDialogProperty: function (sDialogTitle) {
				return this.waitFor({
					controlType: "sap.m.Dialog",
					matchers: privateMethods.getMatchers({"visible": true, "title": sDialogTitle}),
					success: function () {
						Opa5.assert.ok(true, "Smart table P13nDialog setting dialog has title: \"" + sDialogTitle + "\"");
					},
					errorMessage: "Sorting Dialog not opened with a title."
				});
			},

			/**
			 * Check the group header title on table
			 * @param {String} sGroupHeaderText - Group header text
			 * @param {Number} iCheckNthHeader - Nth group header to match (staring from 1)
			 * @param {String} sTableId - partial/full table id
			 * @param {String} sTableType - table type like gridTable, treeTable (Default is responsiveTable)
			 * @return {*} success or failure
			 */
			iCheckGroupHeaderTitleOnTable: function(sGroupHeaderText, iCheckNthHeader, sTableId, sTableType) {
				var oTableProp = privateMethods.getTableControlType(sTableType || "responsiveTable");
				sTableId = sTableId ? sTableId : oTableProp["tableType"];
				return this.waitFor({
					controlType: oTableProp["controlType"],
					id: new RegExp(sTableId + "$"),
					matchers: privateMethods.getMatchers({"visible": true}),
					success: function(aTable) {
						if (!sGroupHeaderText && !aTable[0].getGroupedColumns().length) {
							Opa5.assert.ok(true, "Group header not found");
							return null;
						}
						var aItems = oTableProp["controlType"] === "sap.m.Table" ? aTable[0].getItems() : aTable[0].getRows();
						var iCount = iCheckNthHeader;
						for(var i = 0; i < aItems.length; i++) {
							var bGroupHeader = aItems[i].isGroupHeader();
							if (bGroupHeader) {
								if (iCount > 1) {
									iCount--;
								} else if (iCount === 1 && aItems[i].getTitle().startsWith(sGroupHeaderText)) {
									Opa5.assert.ok(true, "The Group Header with title: \"" + sGroupHeaderText + "\" found on header number: \"" + iCheckNthHeader + "\"");
									return null;
								} else {
									break;
								}
							}
						}
						Opa5.assert.notOk(true, "The Group Header with title: \"" + sGroupHeaderText + "\" not found on header number: \"" + iCheckNthHeader + "\"");
					},
					errorMessage: "Control type: \"" + oTableProp["controlType"] + "\" not found with id: \"" + sTableId + "\""
				});
			},

			iCheckInfoToolbarTextOnTheTable: function (sInfoToolbarText, sTableId) {
				return this.waitFor({
					id: new RegExp(sTableId + "$"),
					success: function (aTable) {
						var sText;
						if (aTable[0].isA("sap.m.Table")) {
							sText = aTable[0].getInfoToolbar().getContent()[0].getText();
						} else {
							var aExtensions = aTable[0].getExtension();
							for (var i = 0; i < aExtensions.length; i++) {
								if (aExtensions[i].getDesign() === 'Info') {
									sText = aExtensions[i].getContent()[0].getText();
									break;
								}
							}
						}
						Opa5.assert.equal(sInfoToolbarText, sText, "InfoToolbar text '" + sInfoToolbarText + "' is found as expected");
					},
					errorMessage: "The table not found on the screen"
				});
			},
			/**
			 * Enter the value into the cells in Nth row of the table which is in edit mode
			 * @param {Number} iNthRow - Nth row number of table(starting from 1)
			 * @param {Array} aCells - Array of cell number to which the value to be entered for iNthRow
			 * @param {Array} aCellTexts - Array of text to be entered corresponding to aCells in row iNthRow
			 * @param {String} sTableId - table id
			 * @param {String} sTableType - table type
			 * @return {*} success or failure
			 */
			iEnterValuesInCellsOnNthRowOfTable: function(iNthRow, aCells, aCellTexts, sTableId, sTableType) {
				var oTableProp = privateMethods.getTableControlType(sTableType || "responsiveTable");
				sTableId = sTableId ? sTableId : oTableProp["tableType"];
				return this.waitFor({
					controlType: oTableProp["controlType"],
					id: new RegExp(sTableId + "$"),
					matchers: privateMethods.getMatchers({"visible": true}),
					success: function(aTable) {
						var aItems = oTableProp["controlType"] === "sap.m.Table" ? aTable[0].getItems() : aTable[0].getRows();
						var oNthRow = aItems && aItems[iNthRow - 1];
						if (oNthRow.isGroupHeader()) {
							Opa5.assert.notOk(true, "Row number: \"" + iNthRow + "\" must not be a group header");
							return null;
						}
						var aTableCells = oNthRow.getCells();
						for(var i = 0; i < aCells.length; i++) {
							var bFlag = false;
							var oTableCell = aTableCells[aCells[i] - 1];
							if (oTableCell.getEdit && oTableCell.getEdit().getEditable()) {
								this.iEnterValueInField(aCellTexts[i], oTableCell.getEdit().getId(), true);
								bFlag = true;
							}
							Opa5.assert.ok(bFlag, "The value on row number: \"" + iNthRow + "\" and cell number: \"" + aCells[i] + "\" is set to \"" + aCellTexts[i] + "\"");
						}
						return null;
					},
					errorMessage: "Editable table with type \"" + oTableProp["controlType"] + "\" not found with id: \"" + sTableId + "\""
				});
			},

			/**
			 *
			 * @param {Number} iCheckNthRow - Nth row number of table(starting from 1)
			 * @param {Array} aCheckNthColumn - Array of column number to be checked for iCheckNthRow
			 * @param {Array} aColumnText - Array of text corresponding to aCheckNthColumn in row iCheckNthRow
			 * @param {String} sTableId - table id
			 * @param {String} sTableType - table type
			 * @return {*} success or failure
			 */
			iCheckRenderedColumnTextOnNthRowOfTable: function(iCheckNthRow, aCheckNthColumn, aColumnText, sTableId, sTableType) {
				var oTableProp = privateMethods.getTableControlType(sTableType || "responsiveTable");
				sTableId = sTableId ? sTableId : oTableProp["tableType"];
				return this.waitFor({
					controlType: oTableProp["controlType"],
					id: new RegExp(sTableId + "$"),
					matchers: privateMethods.getMatchers({"visible": true}),
					success: function(aTable) {
						var aItems =  oTableProp["controlType"] === "sap.m.Table" ? aTable[0].getItems() : aTable[0].getRows();
						var oNthRow = aItems && aItems[iCheckNthRow - 1];
						if (oNthRow.isGroupHeader()) {
							Opa5.assert.notOk(true, "Row number: \"" + iCheckNthRow + "\" must not be a group header");
							return null;
						}
						var aTableCells = oNthRow.getCells();
						for(var i = 0; i < aCheckNthColumn.length; i++) {
							var sActualValue = null;
							var oTableCell = aTableCells[aCheckNthColumn[i] - 1];
							if (oTableCell.getTitle) {
								sActualValue = oTableCell.getTitle();
							} else if (oTableCell.getText) {
								sActualValue = oTableCell.getText();
							} else if (oTableCell.getItems) {
								sActualValue = oTableCell.getItems()[0].getTitle ? oTableCell.getItems()[0].getTitle() : oTableCell.getItems()[0].getText();
							}else if (oTableCell.getDisplay && oTableCell.getDisplay().getText) {
								sActualValue = oTableCell.getAggregation("display").getText();
							} else {
								sActualValue = "";
								for (var j = 0; j < oTableCell.getDisplay().getItems().length; j++) {
									sActualValue += oTableCell.getDisplay().getItems()[j].getText();
								}
							}
							Opa5.assert.equal(sActualValue, aColumnText[i], "Expected value on row number: \"" + iCheckNthRow + "\" and column number: \"" + aCheckNthColumn[i] + "\" is \"" + aColumnText[i] + "\"");
						}
						return null;
					},
					errorMessage: "Control type: \"" + oTableProp["controlType"] + "\" not found with id: \"" + sTableId + "\""
				});
			},

			/**
			 *
			 * @param {Number} iCheckNthRow - Nth row number of table(starting from 1)
			 * @param {Number} iCheckNthColumn - Column number to be checked for iCheckNthRow
			 * @param {Array} aColumnIconLink - Array of icon/link corresponding to aCheckNthColumn in row iCheckNthRow
			 * @param {String} sTableId - table id
			 * @param {String} sTableType - table type
			 * @return {*} success or failure
			 */
			iCheckRenderedColumnIconLinkOnNthRowOfTableFileUpload: function (iCheckNthRow, iCheckNthColumn, aColumnIconLink, sTableId, sTableType) {
				var oTableProp = privateMethods.getTableControlType(sTableType || "responsiveTable");
				sTableId = sTableId ? sTableId : oTableProp["tableType"];
				return this.waitFor({
					controlType: oTableProp["controlType"],
					id: new RegExp(sTableId + "$"),
					matchers: privateMethods.getMatchers({ "visible": true }),
					success: function (aTable) {
						var aItems = oTableProp["controlType"] === "sap.m.Table" ? aTable[0].getItems() : aTable[0].getRows();
						var oNthRow = aItems && aItems[iCheckNthRow - 1];
						var aTableCells = oNthRow.getCells();
						var sActualValue = null;
						var sAttachment = null;
						var oTableCell = aTableCells[iCheckNthColumn - 1];
						if (oTableCell.getItems && oTableCell.getItems()[1].getItems() != "null") {
							sAttachment = oTableCell.getItems()[1].getItems()[0].getItems()[0].getSrc();
							sActualValue = oTableCell.getItems()[1].getItems()[0].getItems()[1].getText();
						}
						Opa5.assert.equal(sAttachment, aColumnIconLink[0], "Expected icon on row number: \"" + iCheckNthRow + "\" and column number: \"" + iCheckNthColumn + "\" is \"" + aColumnIconLink[0] + "\"");
						Opa5.assert.equal(sActualValue, aColumnIconLink[1], "Expected value on row number: \"" + iCheckNthRow + "\" and column number: \"" + iCheckNthColumn + "\" is \"" + aColumnIconLink[1] + "\"");

					},
					errorMessage: "Control type: \"" + oTableProp["controlType"] + "\" not found with id: \"" + sTableId + "\""
				});
			},
			/**
			 *
			 * @param {Number} iCheckNthRow - Nth row number of table(starting from 1)
			 * @param {Array} aCheckNthColumn - Array of column number to be checked for iCheckNthRow
			 * @param {Array} aColumnControlType - Array of control type corresponding to aCheckNthColumn in row iCheckNthRow
			 * @param {String} sTableId - table id
			 * @param {String} sTableType - table type
			 * @return {*} success or failure
			 */
			iCheckRenderedColumnControlTypeOnNthRowOfTable: function(iCheckNthRow, aCheckNthColumn, aColumnControlType, sTableId, sTableType) {
				var oTableProp = privateMethods.getTableControlType(sTableType || "responsiveTable");
				sTableId = sTableId ? sTableId : oTableProp["tableType"];
				return this.waitFor({
					controlType: oTableProp["controlType"],
					id: new RegExp(sTableId + "$"),
					matchers: privateMethods.getMatchers({"visible": true}),
					success: function(aTable) {
						var aItems = aTable[0].getItems();
						var oNthRow = aItems && aItems[iCheckNthRow - 1];
						if (oNthRow.isGroupHeader()) {
							Opa5.assert.notOk(true, "Row number: \"" + iCheckNthRow + "\" must not be a group header");
							return null;
						}
						var aTableCells = oNthRow.getCells();
						for(var i = 0; i < aCheckNthColumn.length; i++) {
							Opa5.assert.ok(aTableCells[aCheckNthColumn[i] - 1].isA(aColumnControlType[i]), "Expected control on column number: \"" + aCheckNthColumn[i] + "\" and row number: \"" + iCheckNthRow + "\" is \"" + aColumnControlType[i] + "\"");
						}
					},
					errorMessage: "Control type: \"" + oTableProp["controlType"] + "\" not found with id: \"" + sTableId + "\""
				});
			},

			iCheckTheCellVisibilityOfNthColumnOnNthRowOfTable: function (iCheckNthRow, iCheckNthColumn, bVisible, sTableId, sTableType) {
				var oTableProp = privateMethods.getTableControlType(sTableType || "responsiveTable");
				sTableId = sTableId ? sTableId : oTableProp["tableType"];
				return this.waitFor({
					controlType: oTableProp["controlType"],
					id: new RegExp(sTableId + "$"),
					matchers: privateMethods.getMatchers({ "visible": true }),
					success: function (aTable) {
						var aItems = oTableProp["controlType"] === "sap.m.Table" ? aTable[0].getItems() : aTable[0].getRows();
						var oNthRow = aItems && aItems[iCheckNthRow - 1];
						if (oNthRow.isGroupHeader()) {
							Opa5.assert.notOk(true, "Row number: \"" + iCheckNthRow + "\" must not be a group header");
							return null;
						}
						var oTableCell = oNthRow.getCells()[iCheckNthColumn - 1];
						Opa5.assert.ok(oTableCell.getVisible() === bVisible, "Visibility of the cell of column '" + iCheckNthColumn + "' on the row '" + iCheckNthRow + "' is found as '" + bVisible + "'");
					},
					errorMessage: "Control type: \"" + oTableProp["controlType"] + "\" not found with id: \"" + sTableId + "\""
				});
			},

			/**
			 *
			 * @param {Number} iCheckNthRow - Nth row number of table(starting from 1)
			 * @param {Number} iCheckNthColumn -  Nth column number to be checked for iCheckNthRow
			 * @param {Array} aColumnControlType - Array of control type corresponding to aCheckNthColumn in row iCheckNthRow
			 * @param {String} sTableId - table id
			 * @param {String} sTableType - table type
			 * @return {*} success or failure
			 */
			iCheckTheFocusOnNthColumnOnNthRowOfTable: function (iCheckNthRow, iCheckNthColumn, sTableId, sTableType) {
				var oTableProp = privateMethods.getTableControlType(sTableType || "responsiveTable");
				sTableId = sTableId ? sTableId : oTableProp["tableType"];
				return this.waitFor({
					controlType: oTableProp["controlType"],
					id: new RegExp(sTableId + "$"),
					matchers: privateMethods.getMatchers({ "visible": true }),
					success: function (aTable) {
						var aItems =  oTableProp["controlType"] === "sap.m.Table" ? aTable[0].getItems() : aTable[0].getRows();
						var oNthRow = aItems && aItems[iCheckNthRow - 1];
						if (oNthRow.isGroupHeader()) {
							Opa5.assert.notOk(true, "Row number: \"" + iCheckNthRow + "\" must not be a group header");
							return null;
						}
						var aTableCells = oNthRow.getCells();
						var focusedDomNode = document.getElementById("OpaFrame").contentWindow.document.activeElement;
						Opa5.assert.ok(focusedDomNode.id === aTableCells[iCheckNthColumn - 1].getFocusDomRef().id, "Focus is set on the cell on column number: \"" + iCheckNthColumn + "\" and row number: \"" + iCheckNthRow + "\"");
					},
					errorMessage: "Control type: \"" + oTableProp["controlType"] + "\" not found with id: \"" + sTableId + "\""
				});
			},

			/**
			 * Check the properties of a given row of responsive table
			 * @param {Number} iNthRow - Nth row number of table(starting from 1)
			 * @param {Object} oProperty - Pass table property to be checked for iNthRow as key value pair in object form
			 * @param {String} sId - table id. No need to pass if the table is in Single view LR
			 * @return {*} success or failure
			 */
			iCheckThePropertiesOfNthRowOfTable: function (iNthRow, oProperty, sId) {
				sId = sId ? sId : "--responsiveTable";
				return this.waitFor({
					controlType: "sap.m.Table",
					id: new RegExp(sId + "$"),
					success: function (oTable) {
						var oRowId = oTable[0].getItems()[iNthRow - 1].getId();
						this.waitFor({
							id: oRowId,
							matchers: privateMethods.getMatchers(oProperty),
							success: function () {
								Opa5.assert.ok(true, "Table row '" + iNthRow + "' with property: " + JSON.stringify(oProperty) + " matched");
							},
							errorMessage: "Table row not rendered correctly"
						});
					},
					errorMessage: "The Responsive table not found on the screen"
				});
			},

			/**
			 * Click on a cell with the given row and column in a responsive table
			 * @param {Number} iNthRow - Nth row number of table(starting from 1)
			 * @param {Number} iNthRow - Nth Column number of table(starting from 1)
			 * @param {String} sId - table id. No need to pass if the table is in Single view LR
			 * @return {*} success or failure
			 */
			iClickOnACellInTheTable: function (iNthRow, iNthColumn, sId) {
				sId = sId ? sId : "--responsiveTable";
				return this.waitFor({
					id: new RegExp(sId + "$"),
					matchers: [
						new AggregationFilled({
							name: "items"
						})
					],
					success: function (oTable) {
						var oCell = oTable[0].getItems()[iNthRow - 1].getCells()[iNthColumn - 1];
						new Press().executeOn(oCell);
						Opa5.assert.ok(true, "Cell on row number '" + iNthRow + "' and column number '" + iNthColumn + "' is clicked");
					},
					errorMessage: "Couldn't click on the link in the table"
				});
			},

			/************* Smart Variant Methods Start *******************/

			/**
			 *
			 * @param {String} sVariantId - variant id
			 * @param {Boolean} bSmartVariant - pass true if you want to click on smart variant
			 * @return {*} success or failure
			 */
			iClickOnVariantById: function(sVariantId) {
				sVariantId = sVariantId ? sVariantId : "(listReport-variant-vm|Table-variant-vm|Chart-variant-vm)";
				return this.waitFor({
					controlType: "sap.m.VariantManagement",
					id: new RegExp(sVariantId + "$"),
					success: function(aControl) {
						new Press().executeOn(aControl[0]);
						Opa5.assert.ok(true, "Click on Variant is successful");
					},
					errorMessage: "The Variant not found on the screen for control type sap.m.VariantManagement"
				});
			},

			/**
			 *
			 * @param {String} sVariantName - variant name to be selected
			 * @param {String} sVariantId - variant id on which selection need to be done
			 * @param {Boolean} bSmartVariant - pass true if you want selection on smart variant to be done
			 * @return {*} success or failure
			 */
			iSelectVariantByName: function(sVariantName, sVariantId) {
				sVariantId = sVariantId ? sVariantId : "(listReport-variant-vm|Table-variant-vm|Chart-variant-vm)";
				return this.waitFor({
					controlType: "sap.m.VariantManagement",
					id: new RegExp(sVariantId + "$"),
					success: function(aControl) {
						var aVariant = aControl[0].oVariantList.getItems();
						for (var i = 0; i < aVariant.length; i++) {
							if (aVariant[i].getText() === sVariantName) {
								new Press().executeOn(aVariant[i]);
								Opa5.assert.ok(true, "Variant Name: '" + sVariantName + "' found and selected for variant id: \"" + sVariantId + "\"");
								return null;
							}
						}
						Opa5.assert.notOk(true, "Variant Name: '" + sVariantName + "' not found for of variant id: \"" + sVariantId + "\"");

					},
					errorMessage: "The Variant not found on the screen for control type sap.m.VariantManagement"
				});
			},

			/**
			 * @param {String} sExpectedVariantName - Provide the name of the expected Variant name to be checked
			 * @param {String} sVariantId - full or last part of the id of smart variant
			 * on the screen and you want to check for a particular table/chart
			 * @return {*} success or failure
			 */
			theCorrectSmartVariantIsSelected: function(sExpectedVariantName, sVariantId) {
				sVariantId = sVariantId ? sVariantId : "(listReport-variant-vm|Table-variant-vm|Chart-variant-vm)";
				return this.waitFor({
					controlType: "sap.m.VariantManagement",
					id: new RegExp(sVariantId + "$"),
					success: function(aControl) {
						var sVariantName = aControl[0].getAggregation("dependents")[0].getAggregation("content")[0].getText();
						Opa5.assert.equal(sVariantName, sExpectedVariantName, "Expected selected SmartVariant to be \"" + sExpectedVariantName + "\"");
					},
					errorMessage: "The VariantManagement control not found on the screen"
				});
			},

			/**
			 * @param {Boolean} bModified - pass true if you want to check variant is dirty (modified) or false (not modified)
			 * @param {String} sVariantId - full or last part of the id of smart variant - Pass this in case there are multiple smartvariant controls present on the UI
			 * @return {*} success or failure
			 */
			iCheckTheSelectedVariantIsModified: function(bModified, sVariantId) {
				sVariantId = sVariantId ? sVariantId : "(PageVariant|listReport-variant|Table-variant|Chart-variant)";
				return this.waitFor({
					controlType: "sap.ui.comp.smartvariants.SmartVariantManagement",
					id: new RegExp(sVariantId + "$"),
					success: function (aControl) {
						var bVarinatModified = aControl[0].currentVariantGetModified();
						Opa5.assert.equal(bVarinatModified, bModified, "The selected variant " + (bModified ? "is modified" : "is not modified"));
					},
					errorMessage: "SmartVariant control not found on the screen"
				});
			},

			/**
			 * Remove all the custom variants for the given SmartTable and set the Standard variant
			 * No action will be performed in case there is no custom variant available
			 * @param {String} sTableId - full or last part of the id of smartTable
			 * @return {*} success or failure
			 */
			iRemoveAllTheCustomVariantsForTheTable: function (sTableId) {
				return this.waitFor({
					controlType: "sap.ui.comp.smarttable.SmartTable",
					id: new RegExp(sTableId + "$"),
					success: function (aTable) {
						var oVariantManagement = aTable[0].getVariantManagement();
						var iVariantItems = oVariantManagement.getVariantItems();
						if (iVariantItems.length > 1) {
							for (var i = 1; i < iVariantItems.length; i++) {
								oVariantManagement.removeVariantItem(i);
							}
							oVariantManagement.fireSave();
							aTable[0].setCurrentVariantId();
							Opa5.assert.ok(true, "All the custom variants are removed from the table with id '" + sTableId + "'");
							return null;
						}
						Opa5.assert.ok(true, "No custom variant found for the table with id '" + sTableId + "'");
					},
					errorMessage: "SmartTable control not found on the screen"
				});
			},

			/**
			 * Checks if the variant management is disabled for the smart table
			 * @param {String} sTableId - full or last part of the id of smartTable
			 * @return {*} success or failure
			 */
			iCheckVariantManagementIsDisabledForTable: function (sTableId) {
				return this.waitFor({
					controlType: "sap.ui.comp.smarttable.SmartTable",
					id: new RegExp(sTableId + "$"),
					success: function (aTable) {
						var oVariantManagement = aTable[0].getVariantManagement();
						if (!oVariantManagement) {
							Opa5.assert.ok(true, "Table with" + sTableId + " does not have variant management enabled");
							return null;
						}
						Opa5.assert.notOk(true, "Table with" + sTableId + " has variant management enabled");
					},
					errorMessage: "Smart table control not found on the screen"
				});
			},

			/************* Smart Variant Methods End *******************/


			/**
			 * One exception is that never pass visible property as false as Opa5 won't be able to check this
			 * @param {string} sId - full id of control or last part of control id
			 * @param {Object} oProperty - {"visible: true, "enabled": false}
			 * @return {*} success or failure
			 */
			iCheckControlPropertiesById: function (sId, oProperty) {
				return this.waitFor({
					id: new RegExp(sId + "$"),
					matchers: privateMethods.getMatchers(oProperty),
					visible: false,
					success: function() {
						Opa5.assert.ok(true, "Control Id: \"" + sId + "\" with property: " + JSON.stringify(oProperty) + " matched");
					},
					errorMessage: "Control Id: \"" + sId + "\" with property: " + JSON.stringify(oProperty) + " not found"
				});
			},

			/**
			 * One exception is that never pass visible property as false as Opa5 won't be able to check this
			 * @param {string} sControlType - full id of control or last part of control id
			 * @param {Object} oProperty - {"visible: true, "enabled": false}
			 * @return {*} success or failure
			 */
			iCheckControlPropertiesByControlType: function (sControlType, oProperty) {
				return this.waitFor({
					controlType: sControlType,
					matchers: privateMethods.getMatchers(oProperty),
					success: function() {
						Opa5.assert.ok(true, "Control Type: \"" + sControlType + "\" with property: " + JSON.stringify(oProperty) + " matched");
					},
					errorMessage: "Control Type: \"" + sControlType + "\" with property: " + JSON.stringify(oProperty) + " not found"
				});
			},

			/**
			 *
			 * @param {String} sPropOrAssociationName - property name or any association of of dynamic page object
			 * @param {String/Boolean} sExpected - expected value of property or method
			 * @param {Boolean} bAssociation - true, if first parameter sent is association name
			 * @return {*} success or failure
			 */
			iCheckDynamicPageProperty: function (sPropOrAssociationName, sExpected, bAssociation) {
				return this.waitFor({
					controlType: "sap.f.DynamicPage",
					id: new RegExp("page$"),
					success: function (aDynamicPage) {
						var sActualValue = bAssociation ? aDynamicPage[0].getAssociation(sPropOrAssociationName) : aDynamicPage[0].getProperty(sPropOrAssociationName);
						Opa5.assert.equal(sActualValue, sExpected, "Current dynamic page property: '" + sPropOrAssociationName + "' is '" + sActualValue + "'");
					},
					errorMessage: "The Dynamic Page is not set with correct Property Values"
				});
			},

			theCssClassesAndTablePropertiesAreCorrectlySet: function(sId) {
				return this.waitFor({
					id: new RegExp(sId + "$"),
					success: function (oTable) {
						oTable = oTable[0];
						var oGridLayout = oTable.getParent();
						var oSubSection = oGridLayout.getParent().getParent();
						var oGridTable = oTable.getTable();

						Opa5.assert.equal(oGridLayout.hasStyleClass("sapSmartTemplatesObjectPageSubSectionGridExpand"),true, "The Correct Css Class is applied to GridLayout");
						Opa5.assert.equal(oSubSection.hasStyleClass("sapUxAPObjectPageSubSectionFitContainer"),true, "The Correct Css Class is applied to SubSection");
						Opa5.assert.equal(oTable.getProperty("fitContainer"),true, "The fitContainer property is correctly applied");
						Opa5.assert.equal(oGridTable.hasStyleClass("sapUiSizeCondensed"),true, "The Correct Css Class is applied to Grid Table");
					},
					errorMessage: "The Css Classes Could not be verified"
				});
			},

			theCssClassCorrectlySetForTheControlWithId: function (sCssClass, sId) {
				return this.waitFor({
					id: new RegExp(sId + "$"),
					success: function (oControl) {
						Opa5.assert.ok(oControl[0].hasStyleClass(sCssClass), "The Correct Css Class \"" + sCssClass + "\" is applied to the control with id\"" + sId + "\"");
					},
					errorMessage: "The Css Classes Could not be verified"
				});
			},
			/*********** POPOVER METHODS *********/

			theSmLiQvPopoverOpensAndContainsExtraContent: function(sFieldGroupName) {
				return this.waitFor({
					controlType: "sap.m.Popover",
					success: function(aPopovers) {
						Opa5.assert.equal(aPopovers.length, 1, "There is one open sap.m.Popover");
						var oPopover = aPopovers[0];

						return this.waitFor({
							controlType: "sap.ui.core.mvc.XMLView",
							matchers: [
								new Ancestor(oPopover, false)
							],
							success: function (aXMLViews) {
								Opa5.assert.equal(aXMLViews.length, 1, "There is one sap.ui.core.mvc.XMLView on the sap.m.Popover");
								var oXMLView = aXMLViews[0];
								var aControls = oXMLView.getContent();
								var bResult = false
								for(var i = 0; i < aControls.length; i++){
									var oControl = aControls[i];
									oControl = oControl && oControl.getItems && oControl.getItems() && oControl.getItems()[0];
									if (oControl && oControl.isA("sap.ui.comp.smartform.SmartForm")) {
										var aGroups = oControl && oControl.getGroups();
										var oGroup = aGroups[0];
										if (oGroup && oGroup.getTitle && oGroup.getTitle() === sFieldGroupName) {
											bResult = true;
											break;
										}
									}
									if (oControl && oControl.isA("sap.m.VBox")){
										var vbox = oControl.getItems() && oControl.getItems()[0];
										var oLabel = vbox && vbox.getItems()[0];
										var sText = oLabel && oLabel.getHtmlText();
										if (sText && sText.indexOf(sFieldGroupName) > -1 ){
											bResult = true;
											break;
										}
									}
								}

								Opa5.assert.ok(bResult, "The SmLiQvPopover is opened with content");
							},
							errorMessage: "There is no sap.ui.core.mvc.XMLView on the sap.m.Popover"
						});
					},
					errorMessage: "There is no open sap.m.Popover"
				});
			},

			iClickTheTitleAreaLinkOnTheSmLiQvPopover: function() {
				return this.waitFor({
					controlType: "sap.m.Popover",
					success: function (aPopovers) {
						Opa5.assert.equal(aPopovers.length, 1, "There is one open sap.m.Popover");
						var oPopover = aPopovers[0];
						return this.waitFor({
							controlType: "sap.ui.core.mvc.XMLView",
							matchers: [
								new Ancestor(oPopover, false)
							],
							success: function (aXMLViews) {
								Opa5.assert.equal(aXMLViews.length, 1, "There is one sap.ui.core.mvc.XMLView on the sap.m.Popover");
								var oXMLView = aXMLViews[0];
								var sId = oXMLView.byId("title").getId();

								return this.waitFor({
									id: sId,
									actions: [
										new Press()
									],
									success: function () {
										Opa5.assert.ok(true, "The SmLiQvPopover title with link is clicked successfully");
									},
									errorMessage: "There is no title link with id '" + sId + "' on the sap.m.Popover"
								});
							},
							errorMessage: "There is no sap.ui.core.mvc.XMLView on the sap.m.Popover"
						});
					},
					errorMessage: "Couldn't click on a link in the SmLiQvPopover."
				});
			},

			/**
			 * To check the title and the sub-title of the lightbox control
			 * @param {string} title - title that is displayed in the lightbox control
			 * @param {string} subtitle - sub-title that is displayed in the lightbox control
			 */
			iCheckTheTitleAndSubtitleOfLightBoxControl: function (title, subtitle) {
				return this.waitFor({
					controlType: "sap.m.LightBox",
					success: function (oControl) {
						if (title === oControl[0].getImageContent()[0].getTitle()) {
							Opa5.assert.ok(true, "The title " + title + " is displayed in the light box control");
						}
						if (!(oControl[0].getImageContent()[0].getSubtitle() == "")) {
							if (subtitle === oControl[0].getImageContent()[0].getSubtitle()) {
								Opa5.assert.ok(true, "The sub-title " + subtitle + " is displayed in the light box control");
							}
						}
					},
					errorMessage: "The light box control is not available"
				});
			},

			/**
			* To check the title and the field contents of a quick view contact
			* @param {Object} oContactQuickViewContent - Pass the quick view contact properties to be checked as key value pair in object form
			* Eg: { "Title": "Talpa", "Phone": "511403266", "Fax": "511403004", "Address": "Waldorf, Germany" }
			*/
			iCheckTheQuickViewContactCard: function (oContactQuickViewContent) {
				return this.waitFor({
					controlType: "sap.m.Popover",
					success: function (oPopover) {
						var bTitleMatch = false, bContentMatch = false;
						var aFields = Object.keys(oContactQuickViewContent);
						var sFieldLabel;
						var aPopoverItems = oPopover[0].getContent()[0].getItems();
						var sPopoverTitle = aPopoverItems[0].getItems()[1].getItems()[0].getText();
						if (sPopoverTitle === oContactQuickViewContent["Title"]) {
							bTitleMatch = true;
						}
						Opa5.assert.ok(bTitleMatch, "Quick View Card title '" + oContactQuickViewContent["Title"] + "' is displayed correctly");
						for (var i = 1; i < aFields.length; i++) {
							sFieldLabel = aFields[i];
							for (var j = 2; j < aPopoverItems.length; j++) {
								if (aPopoverItems[j].getItems()[0].getText() === (sFieldLabel + ':') &&
									aPopoverItems[j].getItems()[1].getText() === oContactQuickViewContent[sFieldLabel]) {
									bContentMatch = true;
									break;
								}
							}
							Opa5.assert.ok(bContentMatch, "The field '" + sFieldLabel + "' with value '" + oContactQuickViewContent[sFieldLabel] + "' found on the contact quickview");
						}
					},
					errorMessage: "Quick View Card does not display correct fields"
				});
			},

			/************ Message Popover Methods  Start **********/

			/**
			 * To add the messages to the message model in order to display in the message dialogs on the Object Page
			 * Message Popover (sap.m.MessagePopover) should be already present on the page
			 * @param {string} sMessageDialogType - Pass Either "sap.m.Dialog" or "sap.m.PopOver"
			 * @param {Object} oMessage - Array of objects containing the message details.
			 * Eg: {"msg": "Invalid price", "msgType": "Warning", "description": "Check whether the price is correct", "target": "/Price", "fullTarget": "/Price", "persistent": false}
			 * @return {*} success or failure
			 */
			iAddMessagesToMessageDialogOrPopOver: function (sMessageDialogType, oMessage) {
				var sControlType = sMessageDialogType === "sap.m.Dialog" ? "sap.m.Dialog" : "sap.uxap.ObjectPageLayout";
				return this.waitFor({
					//In case of Message dialog, ObjectPageLayout control is not accessible since it is not in focus
					controlType: sControlType,
					success: function (oControl) {
						// BindingContext is not available with Error Message dialog control. For Message dialog scenario, empty target property values are passed.
						var sTarget = sControlType === "sap.uxap.ObjectPageLayout" ? oControl[0].getBindingContext().getPath() : "";
						var oModel = oControl[0].getModel();
						var aMessages = [];
						for (var i = 0; i < oMessage.length; i++) {
							aMessages.push({
								message: oMessage[i].msg,
								type: oMessage[i].msgType,
								description: oMessage[i].description,
								target: sTarget + oMessage[i].target,
								fullTarget: sTarget + oMessage[i].fullTarget,
								persistent: oMessage[i].persistent,
								processor: oModel
							});
						}
						if (sMessageDialogType === "sap.m.Dialog") {
							this.waitFor({
								controlType: "sap.m.Dialog",
								success: function (oMessageDialog) {
									var oModelData = oMessageDialog[0].getModel("settings").getData();
									for (var i = 0; i < aMessages.length; i++) {
										oModelData.messages.push(new Message(aMessages[i]));
									}
									oMessageDialog[0].getModel("settings").setData(oModelData);
									Opa5.assert.ok(true, "Messages Successfully Added To MessageDialog");
								},
								errorMessage: "MessageDialog not found on page"
							});
						} else {
							this.waitFor({
								controlType: "sap.m.MessagePopover",
								success: function (oMessagePopover) {
									var aMsgs = [];
									for (var i = 0; i < aMessages.length; i++) {
										aMsgs.push(new Message(aMessages[i]));
									}
									var oMessageManager = Opa5.getWindow().sap.ui.require("sap/ui/core/Messaging");
									oMessageManager.removeAllMessages();
									oMessageManager.addMessages(aMsgs);
									Opa5.assert.ok(true, "Messages Successfully Added To MessagePopover");
								},
								errorMessage: "MessagePopover not found on page"
							});
						}
					},
					errorMessage: "Control '" + sControlType + "' not found on the screen"
				});
			},

			/**
			 * This function closes or open popover if clicked. If already opened then it closes.
			 * @param {String} sId - id of message popover button
			 * @param {Number} iNthOP - index of OP like 1 if you want to click on 2nd OP popover if 2 popover are
			 * visible on different OP's.
			 * @return {*} success or failure
			 */
			iToggleMessagePopoverDialog: function (sId, iNthOP) {
				sId = sId ? sId : "showMessages";
				iNthOP = iNthOP ? iNthOP : 0;
				return this.waitFor({
					controlType: "sap.m.Button",
					id: new RegExp(sId + "$"),
					success: function (oButton) {
						new Press().executeOn(oButton[iNthOP]);
						Opa5.assert.ok(true, "The button with id: \"" + sId + "\" was clicked successfully");
					},
					errorMessage: "MessagePopover button not found on page"
				});
			},

			iCloseMessagePopover: function (iNthOP) {
				iNthOP = iNthOP ? iNthOP : 0;
				return this.waitFor({
					controlType: "sap.m.MessagePopover",
					matchers: new PropertyStrictEquals({
						name: "visible",
						value: true
					}),
					success: function (oMessagePopover) {
						oMessagePopover[iNthOP].close();
						Opa5.assert.ok(true, "Message popover closed");
					},
					errorMessage: "MessagePopover not found on page"
				});
			},

			// Click on segmented button of popover by passing either "message-error", "message-all", "message-warning"
			iClickOnPopoverButton: function(sBtnType) {
				var sIcon = "sap-icon://" + sBtnType.toLowerCase();
				return this.iClickTheButtonWithIcon(sIcon);
			},

			/**
			 *
			 * @param {Number} position - position of message starting from 1
			 * @param {Number} iNthOP - if 2 popover is visible at same time(like in FCL) then pass 1 or 2
			 * @return {*} Success or failure
			 */
			iClickOnNthMessageInMessagePopover : function(position, iNthOP) {
				iNthOP = iNthOP ? iNthOP : 0;
				return this.waitFor({
					controlType: "sap.m.MessagePopover",
					matchers: new PropertyStrictEquals({
						name: "visible",
						value: true
					}),
					success: function (oMessagePopover) {
						var aItems = oMessagePopover[iNthOP].getAggregation("items");
						if (aItems && aItems.length) {
							if (aItems[position - 1] && aItems[position - 1].getActiveTitle()) {
								var title = aItems[position - 1].getTitle();
								privateMethods.testLibraryCommonMethods.iClickTheLinkWithLabel(title);
							} else {
								Opa5.assert.notOk(true, "Message not clickable");
							}
						}
					},
					errorMessage: "Message Popover not found on page or correct parameter not passed"
				});
			},

			// Check if button (that opens message popover) in overflow toolbar is visible and shows expected count
			iCheckMessageCountForMessagePopover: function(count, sId) {
				sId = sId ? sId : "showMessages";
				return this.waitFor({
					id: new RegExp(sId + "$"),
					matchers: privateMethods.getMatchers({"visible": true, "text": String(count)}),
					success: function () {
						Opa5.assert.ok(true, "Found control with count " + count + " and is visible");
					},
					errorMessage: "Couldn't find control with count " + count
				});
			},

			// Here sTableId is sap.m.Table id.
			// sMessageStripType & sMessageStripText is optional. Default value is provided.
			// If multiple message strip is present then messageStrip type will be array.
			iCheckMessageStripValueOnTable: function (sTableId, sMessageStripType, sMessageStripText) {
				return this.waitFor({
					controlType: "sap.m.MessageStrip",
					success: function (messageStrip) {
						sMessageStripType = sMessageStripType ? sMessageStripType : "Error";
						sMessageStripText = sMessageStripText ? sMessageStripText : "The table contains errors.";
						if(Array.isArray(messageStrip)) {
							for (var i = 0; i < messageStrip.length; i++) {
								var isCorrectMessageFound = messageStrip[i].getVisible() && messageStrip[i].getType() === sMessageStripType && messageStrip[i].getText() === sMessageStripText && (messageStrip[i].getParent().getId()).indexOf(sTableId) !== -1;
								if(isCorrectMessageFound) {
									Opa5.assert.ok(true, "Found Message Strip with correct value");
									return null;
								}
							}
						}
						Opa5.assert.notOk(true, "Message Strip or Message Strip with correct value not found");
					},
					errorMessage: "Couldn't find message strip"
				});
			},

			// Provide message tile to click on message list item
			iClickTheMessageListItem: function(sMessageTitle) {
				return this.waitFor({
					controlType: "sap.m.MessageListItem",
					matchers: privateMethods.getMatchers({"visible": true, "title": sMessageTitle, "type": "Navigation"}),
					success: function (oMessageItem) {
						new Press().executeOn(oMessageItem[0]);
						Opa5.assert.ok(true, "Message with title: \"" + sMessageTitle + "\"  clicked successfully");
					},
					errorMessage: "No message with title " + sMessageTitle + " is rendered or not clickable"
				});
			},

			// Check total number of message shown in transient message dialog
			iCheckMessageCountInTransientMessagesDialog: function(iNumberOfMessages) {
				return this.waitFor({
					controlType: "sap.m.Dialog",
					matchers: privateMethods.getMatchers({"visible": true}),
					success: function(oControl) {
						Opa5.assert.equal(oControl[0].getContent()[0].getAggregation("items").length, iNumberOfMessages, "Expected number of message in dialog is: \"" + iNumberOfMessages + "\"");
					},
					errorMessage: "The Transient Message Dialog is not rendered correctly"
				});
			},

			/**
			 * Check message detail in details page of message
			 * @param {String} sMessageTitle - message title in message detail page
			 * @param {String} sMessageDescription - message description
			 * @param {String} sMessageType - message type like error, warning, info
			 * @param {String} sId - id of message detail page
			 * @return {*} success or failure
			 */
			iCheckTheMessagePropertyInDetailedMessagesPage: function(sMessageTitle, sMessageDescription, sMessageType, sId) {
				sId = sId ? sId : "-detailsPage";
				return this.waitFor({
					controlType: "sap.m.Page",
					id: new RegExp(sId + "$"),
					success: function (oMessageDetailPage) {
						var aMessagePageContent = oMessageDetailPage[0].getAggregation("content");
						Opa5.assert.equal(aMessagePageContent[0].getText(), sMessageTitle, "The Message Title in Detailed Screen is rendered correctly");
						Opa5.assert.equal(aMessagePageContent[1].getText(), sMessageDescription, "The Message Description in Detailed Screen is rendered correctly");
						Opa5.assert.equal(aMessagePageContent[2].getSrc(), "sap-icon://" + sMessageType, "The Message Icon in Detailed Screen is rendered correctly");
					},
					errorMessage: "Detailed message page not found with id: \"" + sId + "\""
				});
			},

			/************ Message Popover Methods  End **********/

			/**
			 * Check the column is displayed as a popin inside a table (sap.m.Table)
			 * @param {String} sColumnName - Column name
			 * @param {Boolean} bVisibility - Pass true/false to check column visibility as a table popin
			 * @param {String} sId - full id or last part of the id of the table
			 * @return {*} success or failure
			 */
			iCheckTheColumnDisplayedInTheTablePopin: function(sColumnName, bVisibility, sId) {
				sId = sId ? sId : "--responsiveTable";
				return this.waitFor({
					controlType: "sap.m.Table",
					id: new RegExp(sId + "$"),
					matchers: privateMethods.getMatchers({"visible": true}),
					success: function (oTable){
						oTable = Array.isArray(oTable) ? oTable[0] : oTable;
						var aColumns = oTable.getAggregation("columns");
						for (var i = 0; i < aColumns.length; i++) {
							if (aColumns[i].getHeader().getText() === sColumnName && aColumns[i].isPopin() === bVisibility) {
								Opa5.assert.ok(true, "Column '" + sColumnName +  "' is " + (bVisibility ? "displayed" : "not displayed") + " in popin as expected");
								return null;
							}
						}
						Opa5.assert.notOk(true, "Column '" + sColumnName +  "' is " + (bVisibility ? "displayed" : "not displayed") + " in popin not as expected");
					},
					errorMessage: "The column is not found or table not found"
				});
			},

			/**
			 * Check the current value of table property 'hiddenInPopin' which defines which columns
			 * should be hidden instead of moved into the pop-in area depending on their importance
			 * @param {String} aImportances - Array of importance of the column
			 * @param {String} sId - full id or last part of the id of the table
			 * @return {*} success or failure
			 */
			iCheckTheCoulmnsHiddenInPoppinForTheTable: function (aImportances, sId) {
				sId = sId ? sId : "--responsiveTable";
				return this.waitFor({
					controlType: "sap.m.Table",
					id: new RegExp(sId + "$"),
					matchers: privateMethods.getMatchers({"visible": true}),
					success: function (oTable){
						oTable = Array.isArray(oTable) ? oTable[0] : oTable;
						var aHiddenInPopin = oTable.getHiddenInPopin();
						if (aImportances.length != aHiddenInPopin.length) {
							Opa5.assert.notOk(true, "The column importance set for HiddenInPopin property of sap.m.Table is not same as the passed importance");
							return null;
						}
						if (aImportances.length === 0) {
							Opa5.assert.ok(aHiddenInPopin.length === 0, "The HiddenInPopin property of sap.m.Table is not set to hide any columns");
							return null;
						}
						var bFound;
						for (var i = 0; i < aImportances.length; i++) {
							bFound = false;
							for (var j = 0; j < aHiddenInPopin.length; j++) {
								if (aImportances[i] === aHiddenInPopin[j]) {
									bFound = true;
									break;
								}
							}
							Opa5.assert.ok(bFound, "The HiddenInPopin property of sap.m.Table is set to hide columns with importance '" + aImportances[i] + "'");
						}
					},
					errorMessage: "The table not found on the page"
				});
			},

			/**
			* Check the control with given control type and id is currently not visible on the screen
			* This function will work if atleast one control is available on the UI with the given control type
			* @param {String} sControlType - Type of the control
			* @param {String} sId - id of the control
			* @param {Boolean} bVisibility - Check if the control is visible (true) or not visible (false).
			* @return {*} success or failure
			*/
			iCheckTheControlWithIdIsVisible: function (sControlType, sId, bVisibility) {
			 	return this.waitFor({
			 		controlType: sControlType,
			 		visible: false,
			 		success: function (aControl) {
			 			for (var i = 0; i < aControl.length; i++) {
			 			 	if ( aControl[i].getId() === sId && aControl[i].getVisible() === bVisibility) {
			 					Opa5.assert.ok(true, "'" + sControlType + "' Control with Id '" + sId + "'" + (bVisibility ? " is visible" : " is not visible") + " on the screen");
			 					return null;
			 				}
			 			}
			 			Opa5.assert.notOk(true, "'" + sControlType + "' Control with Id '" + sId + "'" + (bVisibility ? " is not visible" : " is visible") + " on the screen");
			 		},
			 		errorMessage: "Couldn't find any control with type '" + sControlType + "' on the screen"
			 	});
			},

			/**
			* Check for the message content in the message pop up or message pop over
			* @param {string} sDialogType - Type of the error message dialog - "sap.m.Popover" for Message Popover and "sap.m.Dialog" for Message Pop up
			* @param {Array} aMessages - Array of objects containing the message properies such as type, title, subtitle, description and groupName (In case of message pop over)
			* Eg: for sDialogType is "sap.m.Dialog", {"type":"Error", "title":"New error Message", "subTitle":"Error subtitle", "description": "This is the Description"}
			* for sDialogType is "sap.m.Popover", {"type":"Error", "title":"New error Message", "subTitle":"Error subtitle", "description": "This is the Description", "groupName": "General Information"}
			* @return {*} success or failure
			*/
			iShouldSeeTheMessagesInsideTheMessagePopUpOrMessagePopOver: function (sDialogType, aMessages) {
				return this.waitFor({
					controlType: sDialogType,
					matchers: privateMethods.getMatchers({"visible": true}),
					success: function (oDialog) {
						var aItems = oDialog[0].getContent()[0].getItems();
						for (var i = 0; i < aMessages.length; i++) {
							var bFlag = false;
							for (var j = 0; j < aItems.length; j++) {
								if (aItems[j].getType() === aMessages[i].type &&
									aItems[j].getTitle() === aMessages[i].title &&
									aItems[j].getSubtitle() === aMessages[i].subTitle &&
									aItems[j].getDescription() === aMessages[i].description) {
									switch (sDialogType) {
										case "sap.m.Dialog":
											bFlag = true;
											break;
										case "sap.m.Popover":
											if (aItems[j].getGroupName() === aMessages[i].groupName) {
												bFlag = true;
											}
											break;
										default:
											break;
									}
								}
							}
							sDialogType === "sap.m.Dialog" ? Opa5.assert.ok(bFlag, aMessages[i].type + " message with title '" + aMessages[i].title + "', subtitle '" + aMessages[i].subTitle + "' and description '" + aMessages[i].description + "' found on the message popup") :
															Opa5.assert.ok(bFlag, aMessages[i].type + " message with title '" + aMessages[i].title + "', subtitle '" + aMessages[i].subTitle + "', and description '" + aMessages[i].description + "' found under the group '" + aMessages[i].groupName + "' on the message popover");
						}
					},
					errorMessage: "Couldn't find the message pop up / message pop over on the screen"
				});
			},

			/**
			* Check for the title of the message pop up dialog
			* @param {String} sTitle - Title of the message pop up dialog
			* @return {*} success or failure
			*/
			iShouldSeeTheMessagePopUpWithTitle: function (sTitle) {
				return this.waitFor({
					controlType: "sap.m.Dialog",
					matchers: privateMethods.getMatchers({"visible": true}),
					success: function (oDialog) {
						var sActualTitle = oDialog[0].getCustomHeader().getContentMiddle()[0].getText();
						Opa5.assert.ok(sActualTitle === sTitle, "MessagePopUp with title '" + sTitle + "' found on the screen");
					},
					errorMessage: "Couldn't find the message pop up on the screen"
				});
			},

			/**
			* To check the title and the fields inside the Create Object Dialog
			* @param {object} sTitle - Title of the dialog
			* @param {Array} aFields - Array of Labels of the fields inside the dialog
			* @return {*} success or failure
			*/
			iCheckFieldsAndTitleOfCreateObjectDialog: function (sTitle, aFields) {
				return this.waitFor({
					controlType: "sap.m.Dialog",
					matchers: privateMethods.getMatchers({ "visible": true}),
					success: function (oDialog) {
						var sActualTitle = oDialog[0].getContent()[0].getTitle();
						var aGroupElements = oDialog[0].getContent()[0].getGroups()[0].getGroupElements();
						Opa5.assert.ok(sActualTitle === sTitle, "Title of the Create Dialog is correct");
						for (var i = 0; i < aFields.length; i++) {
							var sField = aFields[i];
							var bFlag = false;
							for (var j = 0; j < aGroupElements.length; j++) {
								if (aGroupElements[j].getLabelText() === sField) {
									bFlag = true;
									break;
								}
							}
							Opa5.assert.ok(bFlag, "Field with label " + sField + " found on the Dialog");
						}
					},
					errorMessage: "Dialog is not visible"
				});
			},

			/**
			* To set the field values inside the Create Object Dialog
			* @param {object} oValue - Object containing the key (Label of the field) and value (value to be entered to the field)
			* Eg: {"Business Partner ID":"100000008", "ISO Currency Code":"EUR"}
			* @return {*} success or failure
			*/
			iSetTheFieldValuesInsideCreateObjectDialog: function (oValue) {
				return this.waitFor({
					controlType: "sap.m.Dialog",
					matchers: privateMethods.getMatchers({ "visible": true}),
					success: function (oDialog) {
						var aGroupElements = oDialog[0].getContent()[0].getGroups()[0].getGroupElements();
						var keys = Object.keys(oValue);
						for (var i = 0; i < keys.length; i++) {
							var key = keys[i];
							var bFlag = false;
							for (var j = 0; j < aGroupElements.length; j++) {
								if (aGroupElements[j].getLabelText() === key) {
									aGroupElements[j].getFields()[0].setValue(oValue[key]);
									bFlag = true;
									break;
								}
							}
							Opa5.assert.ok(bFlag, "The value in the field " + key + " is successfully set");
						}
					},
					errorMessage: "Dialog is not visible"
				});
			},

			/**
			* To check the field errors inside the Create Object Dialog
			* @param {object} oErrorField - Object containing the key (Label of the field) and value (error state text for the field)
			* Eg: {"Product ID":"Enter valid value", "Int.Measurement Unit":"Enter valid value"}
			* @return {*} success or failure
			*/
			iCheckTheFieldErrorInsideCreateObjectDialog: function (oErrorField) {
				return this.waitFor({
					controlType: "sap.m.Dialog",
					matchers: privateMethods.getMatchers({ "visible": true }),
					success: function (oDialog) {
						var aGroupElements = oDialog[0].getContent()[0].getGroups()[0].getGroupElements();
						var keys = Object.keys(oErrorField);
						for (var i = 0; i < keys.length; i++) {
							var key = keys[i];
							var bFlag = false;
							for (var j = 0; j < aGroupElements.length; j++) {
								var aInnerControls = aGroupElements[j].getFields()[0].getInnerControls();
								if (aGroupElements[j].getLabelText() === key &&
									aInnerControls[0].getValueState() === "Error" &&
									aInnerControls[0].getValueStateText() === oErrorField[key]) {
									bFlag = true;
									break;
								}
							}
							Opa5.assert.ok(bFlag, "The field '" + key + "' is having error state and having the error state text '" + oErrorField[key] + "'");
						}
					},
					errorMessage: "Dialog is not visible"
				});
			},

			/**
			* To check the field values inside the Create Object Dialog
			* @param {object} oValue - Object containing the key (Label of the field) and value (value to be checked in the field)
			* Eg: {"Business Partner ID":"100000008", "ISO Currency Code":"EUR"}
			* @return {*} success or failure
			*/
			iCheckTheFieldValuesInsideCreateDialogIsCorrect: function (oValue) {
				return this.waitFor({
					controlType: "sap.m.Dialog",
					matchers: privateMethods.getMatchers({ "visible": true}),
					success: function (oDialog) {
						var aGroupElements = oDialog[0].getContent()[0].getGroups()[0].getGroupElements();
						var keys = Object.keys(oValue);
						for (var i = 0; i < keys.length; i++) {
							var key = keys[i];
							var bFlag = false;
							for (var j = 0; j < aGroupElements.length; j++) {
								if (aGroupElements[j].getLabelText() === key && aGroupElements[j].getFields()[0].getValue() === oValue[key]) {
									bFlag = true;
									break;
								}
							}
							Opa5.assert.ok(bFlag, "The value in the field " + key + " is found correctly");
						}
					},
					errorMessage: "Dialog is not visible"
				});
			},

			/**
			* To click the delete button against a particular row of a table (sap.m.Table) in case of inline delete
			* @param {Number} iNthRow - Nth row number of table (starting from 1)
			* @param {String} sTableId - Full id or last part of the id of the table
			* @return {*} success or failure
			*/
			iClickDeleteButtonOnNthRowOfTable: function (iNthRow, sTableId) {
				sTableId = sTableId ? sTableId : "--responsiveTable";
				return this.waitFor({
					controlType: "sap.m.Table",
					id: new RegExp(sTableId + "$"),
					matchers: privateMethods.getMatchers({ "visible": true, "mode": "Delete"}),
					success: function (aTables) {
						var oDeleteControl = aTables[0].getItems()[iNthRow - 1].getDeleteControl();
						new Press().executeOn(oDeleteControl);
						Opa5.assert.ok(true, "Delete button on row number '" + iNthRow + "' clicked successfully");
					},
					errorMessage: "Table with inline delete is not found"
				})
			},

			/**
			* Check whether tile created tile is static or dynamic
			* Count shows as 0 if the tile is dynamic and count  is set to empty in case of static tile
			* @param {Boolean} sTitletype "Dynamic" - Count is set to zero , "Static" - count is empty
			* @return {*} success or failure
			*/
			iCheckTheTileType: function (sTitletype) {
				return this.waitFor({
					controlType: "sap.m.GenericTile",
					searchOpenDialogs: true,
					success: function (oTiles) {
						var bFlag = false;
						var oTileContent = oTiles[0].getTileContent()[0].getContent();
						if (sTitletype === "Dynamic") {
							if (oTileContent.isA("sap.m.NumericContent") && oTileContent.getValue() === "0") {
								bFlag = true;
							}
							Opa5.assert.ok(bFlag, "Dynamic Tile: Count is set to zero");
						} else {
							if (oTileContent.isA("sap.m.ImageContent") && oTileContent.getSrc() === "") {
								bFlag = true;
							}
							Opa5.assert.ok(bFlag, "Static Tile: Count is set to empty");
						}
					},
					errorMessage: "Not able to determine the static/dynamic tile"
				});
			},

			/**
			* Check ExportToExcel Button is not available on the screen
 			* @return {*} success or failure
 			*/
 			iShouldNotSeeTheExportToExcelButton: function() {
				return this.waitFor({
					controlType: "sap.m.Button",
					success: function (aControl) {
						for (var i = 0; i < aControl.length; i++) {
							if (aControl[i].getIcon() === "sap-icon://excel-attachment" && aControl[i].getVisible() === true) {
								Opa5.assert.notOk(true, "Export to excel button is visible on the screen");
								return null;
							}
						}
						Opa5.assert.ok(true, "Export to excel button is not visible on the screen");
						return null;
					},
					errorMessage: "The page has an excel export button."
				});
			},

			/**
			* Expand Tree table rows
			* @param {Int} iRow - Row to be expanded(starts from 0th row)
            * @param {String} sId - id or part of the id of the table
 			* @return {*} success or failure
 			*/
 			iExpandTreeTableRows: function(iRow, sId) {
				sId = sId ? sId : "--TreeTable";
				return this.waitFor({
					id: new RegExp(sId + "$"),
					success: function (aControl) {
								aControl[0].expand(iRow);
								Opa5.assert.ok(true, "The row expanded");
					},
					errorMessage: "Tree Table not found."
				});
			},

			/**
			* To check if the row used to navigate to OP/Sub-OP is highlighted in the responsive table
			* @param {Number} iRowIndex - index of the row used to navigate
			* @param {Boolean} bExpectedHighlight - determines whether the row should be highlighted
			* @param {String} sId - full id or last part of the id of the table
			* @return {*} success or failure
			*/
			iShouldSeeTheNavigatedRowHighlighted: function (iRowIndex, bExpectedHighlight, sId) {
				sId = sId ? sId : "--responsiveTable";
				return this.waitFor({
					id: new RegExp(sId + "$"),
					success: function (oTable) {
						var bHighlighted = oTable[0].getItems()[iRowIndex].getNavigated();
						Opa5.assert.equal(bHighlighted, bExpectedHighlight, "The Row Item Highlight for the item at index: " + iRowIndex + " is " + bHighlighted + " which is correct");
					},
					errorMessage: "The table with id '" + sId + "' not found on the screen"
				});
			},

			/**
			* To check if the row used to navigate to OP/Sub-OP is highlighted in the sap.ui.table
			* @param {Number} iRowIndex - index of the row used to navigate
			* @param {Boolean} bExpectedHighlight - determines whether the row should be highlighted
			* @param {String} sId - full id or last part of the id of the table
			* @return {*} success or failure
			*/
			iShouldSeeTheNavigatedRowHighlightedInUITables: function (iRowIndex, bExpectedHighlight, sId) {
				var sTableId = new RegExp(sId + "$");
				return this.waitFor({
					controlType: "sap.ui.table.RowSettings",
					visible: false,
					success: function (aRowSettings) {
						for (var i = 0; i < aRowSettings.length; i++) {
							var oParentRow = aRowSettings[i].getParent();
							var oParentTable = oParentRow.getParent();
							if ((oParentTable && sTableId.test(oParentTable.getId()) && oParentRow === oParentTable.getRows()[iRowIndex])) {
								var bHighlighted = aRowSettings[i].getNavigated();
								Opa5.assert.equal(bExpectedHighlight, bHighlighted, "The Row Item Highlight for the item '" + bHighlighted + "' which is correct");
								return null;
							}
						}
						Opa5.assert.notOk(true, "The Row Item Highlight for the item is not correct");
					},
					errorMessage: "RowSettings not found on the screen"
				});
			},

			/**
			* To expand a panel inside the Adapt filter dialog with the given label.
			* If the panel is already expanded, does nothing
			* @param {String} sLabel - Label of the Panel
			* @return {*} success or failure
			*/
			iExpandThePaneltInAdpatFilterDialog: function (sLabel) {
				return this.waitFor({
					controlType: "sap.m.Panel",
					searchOpenDialogs: true,
					success: function (aPanels) {
						for (var i = 0; i < aPanels.length; i++) {
							if (aPanels[i].getHeaderToolbar().getContent()[0].getText() === sLabel) {
								if (!aPanels[i].getExpanded()) {
									aPanels[i].setExpanded(true);
									Opa5.assert.ok(true, "The panel with label '" + sLabel + "' is set to expanded in the Adpat Filter Dialog");
									return null;
								}
								Opa5.assert.ok(true, "The panel with label '" + sLabel + "' is already set to expanded in the Adpat Filter Dialog");
								return null;
							}
						}
						Opa5.assert.notOk(true, "The panel with label '" + sLabel + "' is not found in the Adpat Filter Dialog");
						return null;
					},
					errorMessage: "Panels not found on the Dialog"
				});
			},

			/**
			* To uncheck the selected rows in the table based on Index.
			* @param {Array} aItemIndex - Array of Indices of the table rows to be deselected ex: ([0, 1])
			* @param {String} sId - full id or last part of the id of the table
			* @return {*} success or failure
			*/
			iDeselectItemsInTheTable: function (aItemIndex, sId) {
				sId = sId ? sId : "--responsiveTable";
				return this.waitFor({
					id: new RegExp(sId + "$"),
					matchers: [
						new AggregationFilled({
							name: "items"
						})
					],
					actions: function(oTable) {
						var aTableItems = oTable.getItems();
						for (var i = 0; i < aItemIndex.length; i++) {
							oTable.setSelectedItem(aTableItems[aItemIndex[i]], false);
							oTable.fireSelectionChange({
								listItems: 	oTable.getSelectedItems(),
								selected: false
							});
						}
					},
					errorMessage: "The Smart Table is not rendered correctly"
				});
			},

			/**
			* To select the rows on the UI table for the given index range.
			* @param {int} IndexFrom - 	Index from which the selection starts
			* @param {int} iIndexTo - Index up to which to select
			* @param {String} sId - full id or last part of the id of the table
			* @return {*} success or failure
			*/
			iSelectTheItemsInUITable: function (iIndexFrom, iIndexTo, sId) {
				return this.waitFor({
					id: new RegExp(sId + "$"),
					success: function (oTable) {
						var oSelectionPlugin = fnGetSelectionPluginForUITable(oTable[0]);
						(oSelectionPlugin || oTable).setSelectionInterval(iIndexFrom, iIndexTo);
						var rowIndices = [];
						for (var i = iIndexFrom; i <= iIndexTo; i++) {
							rowIndices.push(i);
						}
						oTable[0].fireRowSelectionChange(rowIndices);
						Opa5.assert.ok(true, "Rows from index '" + iIndexFrom + "' to '" + iIndexTo + "' is selected");
					},
					errorMessage: "The Table is not rendered correctly"
				});
			},

			/**
			* To check if the row with the given index is selected or deselected in the table.
			* @param {Array} aIndexSelection - Index,Selected are the key value pairs to be passed, ex: {Index:0,Selected:true}
			* @param {String} sId - full id or last part of the id of the table, if not passed, it will consider responsiveTable
			* @return {*} success or failure
			*/
			iCheckTheRowSelectionInTheTable: function(aIndexSelection, sId) {
				sId = sId ? sId : "--responsiveTable";
				return this.waitFor({
					id: new RegExp(sId + "$"),
					success: function (oTable) {
						var oCurrentTable = oTable[0];
						if (oCurrentTable.isA("sap.ui.table.Table")) {
							var oSelectionPlugin = fnGetSelectionPluginForUITable(oCurrentTable);
							var aSelectedIndices = oSelectionPlugin.getSelectedIndices();
							for (var i = 0; i < aIndexSelection.length; i++) {
								Opa5.assert.equal(aSelectedIndices.indexOf(aIndexSelection[i].Index) > -1, aIndexSelection[i].Selected,
									"The index: " + aIndexSelection[i].Index + " has Selection " + aIndexSelection[i].Selected + ".");
							}
						} else {
							for (var i = 0; i < aIndexSelection.length; i++) {
								Opa5.assert.equal(oCurrentTable.getItems()[aIndexSelection[i].Index].getSelected(), aIndexSelection[i].Selected,
									"The index: " + aIndexSelection[i].Index + " has Selection " + aIndexSelection[i].Selected + ".");
							}
						}
					},
					errorMessage: "The Smart Table is not rendered correctly"
				});
			},

			/**
			* To check The Multi Edit Dialog Title and Property Field Names
			* @param {String} sDialogTitle - The Title of the Mass Edit Dialog
			* @param {Array} aPropertyNames - Array of expected Property Names inside the Mass Edit Dialog
			* ex: ("Edit 2 Objects",["BusinessPartnerID", "CurrencyCode"])
			* @return {*} success or failure
			*/
			iVerifyTheMultiEditDialogAttributesAreCorrect: function (sDialogTitle, aPropertyNames) {
                return this.waitFor({
                    controlType: "sap.m.Dialog",
                    matchers: privateMethods.getMatchers({"title": sDialogTitle}),
                    success: function(oDialog) {
                        var bFlag;
                        var oDialogFields = oDialog[0].getContent()[0].getFields();
                        Opa5.assert.ok(true, "The multi edit dialog has correct Title");
                        Opa5.assert.equal(aPropertyNames.length, oDialogFields.length, "The multi edit dialog has correct number of property names");
                        for (var i = 0; i <= oDialogFields.length - 1; i++) {
                            bFlag = false;
                            if (aPropertyNames.indexOf(oDialogFields[i].getPropertyName()) > -1) {
                                bFlag = true;
                            }
                            Opa5.assert.ok(bFlag, "The multi edit dialog has correct property: " + oDialogFields[i].getPropertyName());
                        }
                    },
                    errorMessage: "The Dialog with title " + sDialogTitle + " is not rendered correctly"
                });
            },

			/**
			* To set the Property Field values inside the Multi Edit Dialog
			* @param {Array} aFieldNameValuePair - Array of key value pairs containing the Choice to change the field, Property Name and the Value
			* ex: {Choice:"Replace",PropertyName:"BusinessPartnerID",Value:"100000011"}
			* @return {*} success or failure
			*/
			iSetSmartMultiEditField: function (aFieldNameValuePair) {
				return this.waitFor({
					controlType: "sap.m.Dialog",
					matchers: privateMethods.getMatchers({"visible": true}),
					actions: function(oDialog) {
						var oDialogFields = oDialog.getContent()[0].getFields();
						for (var i = 0; i < aFieldNameValuePair.length; i++) {
							var bFlag = false;
							for (var j = 0; j < oDialogFields.length; j++) {
								if (aFieldNameValuePair[i].PropertyName === oDialogFields[j].getPropertyName()) {
									switch (aFieldNameValuePair[i].Choice) {
										case "Keep":
											//Do Nothing
											break;
										case "Replace":
											oDialogFields[j].setSelectedIndex(1);
											oDialogFields[j].fireChange();
											oDialogFields[j].getSmartField().getInnerControls()[0].setValue(aFieldNameValuePair[i].Value);
											oDialogFields[j].getSmartField().getInnerControls()[0].fireChange();
											break;
										case "Index":
											oDialogFields[j].setSelectedIndex(aFieldNameValuePair[i].Value);
											oDialogFields[j].fireChange();
											break;
										case "Clear":
											oDialogFields[j].setSelectedIndex(2);
											oDialogFields[j].fireChange();
											break;
										default:
											break;
									}
									bFlag = true;
									break;
								}
							}
							Opa5.assert.ok(bFlag, "The field value " +aFieldNameValuePair[i].PropertyName+ " is successfully set");
						}
					},
					errorMessage: "The Smart Multi Edit Dialog is not rendered correctly."
				});
			},

			/**
			* To check the token values in the MultiInput fields
			* If the panel is already expanded, does nothing
			* @param {String} sId - Id of the field. Need to pass the last part of the id which is unique
			* @param {Array} aValues - Array of token values. Pass the empty array to check the field is empty.
			* @return {*} success or failure
			*/
			iCheckTheMultiInputFieldValues: function (sId, aValues) {
				return this.waitFor({
					id: new RegExp(sId + "$"),
					success: function (oControl) {
						if(oControl[0].getValue()!== ""){
							var sValue = oControl[0].getValue();
								Opa5.assert.ok(aValues[0] === sValue, "The value '" + aValues[0] + "' found in MultiInputfield with id '" + sId + "'");
					    }
						else {
							var aTokens = oControl[0].getTokens();
							if (aValues.length === 0) {
								Opa5.assert.equal(aTokens.length, 0, "The MultiInputfield with id '" + sId + "' is empty");
								return null;
							}
							for (var i = 0; i < aValues.length; i++) {
								var bFlag = false;
								for (var j = 0; j < aTokens.length; j++) {
									if (aValues[i] === aTokens[j].getText()) {
										bFlag = true;
										break;
									}
								}
								Opa5.assert.ok(bFlag, "The value '" + aValues[i] + "' found in MultiInputfield with id '" + sId + "'");
							}
						}
						return null;
					},
					errorMessage: "MultiInput control not found on the screen"
				});
			},

			/**
			* Check the title visibility of the Section or Subsection on the Object page with the given index
			* @param {int} iSectionIndex - Section index. If you want to check the Section title then pass only Section index
			* @param {int} iSubSectionIndex - Sub Section index. If you want to check the Sub Section title then pass Section index
			* (in which that sub Section exist) along with Sub Section index.
			* @param {Boolean} bVisibility - Pass true/false to check the title visibility
			* @param {int} iNthOP - Nth OP on which selection need to be done
			* Pass this parameter only if you are in FCL screen. If you want to do selection in 2nd OP, pass iNthOP=2
			* @return {*} success or failure of test
			**/
			iCheckSectionOrSubSectionTitleVisibilityByIndex: function (iSectionIndex, iSubSectionIndex, bVisibility, iNthOP) {
				iNthOP = iNthOP ? iNthOP - 1 : 0;
				return this.waitFor({
					controlType: "sap.uxap.ObjectPageLayout",
					success: function (oObjectPageControl) {
						var aSections = oObjectPageControl[iNthOP].getSections();
						if (iSubSectionIndex > 0 || iSubSectionIndex === 0) {
							var aSubSections = aSections[iSectionIndex].getSubSections();
							Opa5.assert.equal(aSubSections[iSubSectionIndex].getShowTitle(), bVisibility, "Sub Section with index " + iSubSectionIndex + " in the Section with index " + iSectionIndex + " has the the title visibility '" + bVisibility + "' as expected");
							return null;
						}
						Opa5.assert.equal(aSections[iSectionIndex].getShowTitle(), bVisibility, "Section with index " + iSectionIndex + " has the the title visibility '" + bVisibility + "' as expected");
						return null;
					},
					errorMessage: "Object Page Layout not found"
				});
			},

			/**
			* Check for Placeholder on the screen
			* @param {String} sViewName - ViewName to be matched - 'sap.fe.placeholder.view.PlaceholderLR' for LR and 'sap.fe.placeholder.view.PlaceholderOP' for OP
			* @return {*} success or failure
			*/
			iCheckPlaceholderIsPresent: function (sViewName) {
				return this.waitFor({
					autoWait: false,
					controlType: "sap.m.NavContainer",
					id: new RegExp("placeholderHost" + "$"),
					check: function (oPlaceHolder) {
						for (var i = 0; i < oPlaceHolder.length; i++) {
							if (oPlaceHolder[i].getVisible() === true && oPlaceHolder[i].getPages().length > 0 && oPlaceHolder[i].getPages()[0].getViewName() === sViewName) {
								return true;
							}
						}
						return false;
					},
					success: function () {
						Opa5.assert.ok(true, "Placeholder is present");
					},
					errorMessage: "Could not find the placeholder"
				});
			},

			/**
			* Check is a particular string is present in the url
			* @param {string} sValue - Pass the string to be checked
			* @param {Boolean} bPresent - Pass true/false to check the filter parameter should be present or should not be present
			* @return {*} success or failure of test
			**/
			iCheckForStringInAppUrl: function(sValue, bPresent) {
				return this.waitFor({
					controlType: "sap.ui.core.ComponentContainer",
					success: function() {
						var sUrl = Opa5.getWindow().location.href;
						if (bPresent){
							if (sUrl.indexOf(sValue) > -1){
								Opa5.assert.ok(true, "There is " + sValue + " in app url which is an expected behavior");
								return null;
							}else{
								Opa5.assert.notOk(true, "There is no " + sValue + " in app url which is wrong behavior");
								return null;
							}
						}else{
							if (sUrl.indexOf(sValue+'=') === -1){
								Opa5.assert.ok(true, "There is no " + sValue + " in app url which is an expected behavior");
								return null;
							}else{
								Opa5.assert.notOk(true, "There is a " + sValue + " in app url which is wrong behavior");
								return null;
							}
						}

					},
					errorMessage: "Error in validating the app url"
				});
			},


			/**
			* Check is a particular hash value is present in the url
			* @param {string} sValue - Pass the string to be checked
			* @param {Boolean} bPresent - Pass true/false to check the hash value should be present or should not be present
			* @return {*} success or failure of test
			**/
			iCheckForHashValueInAppUrl: function (sValue, bPresent) {
				return this.waitFor({
					controlType: "sap.ui.core.ComponentContainer",
					success: function () {
						var sUrl = Opa5.getHashChanger().getAppHash();
						if (bPresent) {
							if (sUrl.indexOf(sValue + '=') > -1) {
								Opa5.assert.ok(true, "There is " + sValue + " in app url which is an expected behavior");
								return null;
							} else {
								Opa5.assert.notOk(true, "There is no " + sValue + " in app url which is wrong behavior");
								return null;
							}
						} else {
							if (sUrl.indexOf(sValue + '=') === -1) {
								Opa5.assert.ok(true, "There is no " + sValue + " in app url which is an expected behavior");
								return null;
							} else {
								Opa5.assert.notOk(true, "There is a " + sValue + " in app url which is wrong behavior");
								return null;
							}
						}

					},
					errorMessage: "Error in validating the app url"
				});
			},

			/**
			* Check the aggregated item properties of a given smart chart
			* @param {Object} oItemProperty - Pass the Item properties to be checked as key value pair in object form
			* Eg: { "chartType": "bar", "currentLocationText": "Currency" }
			* @param {string} sId - Id of the SmartChart. Need to pass the last part of the id which is unique. If not passed first available Smartchart will be taken
			* @return {*} success or failure of test
			**/
			iCheckTheAggregationItemPropertiesForSmartChart: function (oItemProperty, sId) {
				sId = sId ? sId : "Chart";
				return this.waitFor({
					controlType: "sap.ui.comp.smartchart.SmartChart",
					id: new RegExp(sId + "$"),
					success: function (oSmartChart) {
						var keys = Object.keys(oItemProperty);
						var aItems = oSmartChart[0].getItems();
						for (var i = 0; i < keys.length; i++) {
							var key = keys[i];
							var bFlag = false;
							for (var j = 0; j < aItems.length; j++) {
								if (aItems[j].mProperties.hasOwnProperty(key) && aItems[j].getProperty(key) === oItemProperty[key]) {
									bFlag = true;
									break;
								}
							}
							Opa5.assert.ok(bFlag, "The property '" + key + "' is set to '" + oItemProperty[key] + "' for the SmartChart");
						}
					},
					errorMessage: "Could not find the SmartChart"
				});
			},

			/**
			* Check for whitespace rendering in shell navigation menu item description text
			* @param {string} sText - Expected matching text
			* @param {string} sIcon - Expected matching icon , this parameter is optional
			**/
			iCheckShellNavigationMenuItemDescriptionIcon: function (sText,sIcon) {
				return this.waitFor({
					controlType: "sap.m.List",
					id: new RegExp("sapUshellNavHierarchyItems" + "$"),
					success: function (oControl) {
						var aItems = oControl[0].getItems();
						for (var i = 0; i < aItems.length; i++) {
							if (sIcon) {
								if ((aItems[i].getDescription() === sText) && (aItems[i].getIcon() === sIcon)) {
									Opa5.assert.ok(true, "Description text and icon match found");
									return null;
								}
							}
							else {
								if (aItems[i].getDescription() === sText) {

									Opa5.assert.ok(true, "Description text match found");
									return null;
								}
							}
						}
						Opa5.assert.notOk(true, "Description text or icon match not found");
					},
					errorMessage: "Description text or icon match not found"
				});
			},

			/**
			* Check the no data text set inside the custom messages for the chart control
			* @param {string} sExpectedText - Expected no data text
			* @param {string} sId - Id of the SmartChart. Need to pass the last part of the id which is unique
			**/
			iCheckSmartChartNoDataText: function (sExpectedText, sId) {
				return this.waitFor({
					controlType: "sap.ui.comp.smartchart.SmartChart",
					id: new RegExp(sId + "$"),
					success: function (oSmartChart) {
						return oSmartChart[0].getChartAsync().then(function (chart) {
							var sActualText = chart.getCustomMessages().NO_DATA;
							Opa5.assert.equal(sActualText, sExpectedText, "Correct Message about NoData is displayed for the chart");
						});
					},
					errorMessage: "The SmartChart not found on the screen"
				});
			},

			/**
			* Check the CommandExecution properties are correctly set for a particular control
			* Can be used to check the keyboard shortcut command for custom actions
			* @param {String} sId - Id of the Control. Need to pass the last part of the id which is unique
			* @param {Object} oPropeties - Pass the properties (command, visible & shortcut) as key value pair in object form
			* Eg: { "command": "GlobalActionCommand", "visible": true, "shortcut": "Ctrl+B" }
			**/
			iCheckTheCommandExecutionPropertiesForTheControl: function (sId, oPropeties) {
				return this.waitFor({
					id: new RegExp(sId + "$"),
					success: function (oControl) {
						var aDependents = oControl[0].getDependents();
						for (var i = 0; i < aDependents.length; i++) {
							if (aDependents[i].getCommand() === oPropeties.command &&
								aDependents[i].getVisible() === oPropeties.visible &&
								aDependents[i].oCommand.shortcut === oPropeties.shortcut) {
								Opa5.assert.ok(true, "Command Execution Properties '" + JSON.stringify(oPropeties) + "' found as expected for the control with id '" + sId + "'");
								return null;
							}
						}
						Opa5.assert.notOk(true, "Command Execution Properties '" + JSON.stringify(oPropeties) + "' not found as expected for the control with id '" + sId + "'");
						return null;
					},
					errorMessage: "Error in validating the Command Execution properties"
				});
			},

			/**
			* Check the value of DateRange control
			* @param {String} sId - Id of the DateRange Control. Need to pass the last part of the id which is unique
			* @param {Object} oValue - Pass the properties (key and operator) as key value pair in object form
			* Eg: { key: "EndDate", operator: "TOMORROW" }
			**/
			iCheckTheValueOfDateRangeField: function (sId, oValue) {
				return this.waitFor({
					id: new RegExp(sId + "$"),
					success: function (oControl) {
						var oActualValue = oControl[0].getValue();
						if (oValue.key === oActualValue.key && oValue.operator === oActualValue.operator) {
							Opa5.assert.ok(true, "The value '" + JSON.stringify(oValue) + "' is set on the DateRangeField");
							return null;
						}
						Opa5.assert.notOk(true, "The value '" + JSON.stringify(oValue) + "' is not set on the DateRangeField");
					},
					errorMessage: "DateRange field with id: '" + sId + "' not found"
				});
			},

			/**
			* Check the available options for the DateRange control
			* @param {String} sId - Id of the DateRange Control. Need to pass the last part of the id which is unique
			* @param {Array} aOptions - List of available options which needs to be checked
			**/
			iCheckTheAvailableOptionsForDateRangeField: function (sId, aOptions) {
				return this.waitFor({
					id: new RegExp(sId + "$"),
					success: function (oControl) {
						var aAvailableOptions = oControl[0].getStandardOptions();
						if (JSON.stringify(aAvailableOptions) === JSON.stringify(aOptions)) {
							Opa5.assert.ok(true, "The options '" + aOptions + "' are available for the DateRangeField as expected");
							return null;
						}
						Opa5.assert.notOk(true, "The options '" + aOptions + "' are not available for the DateRangeField as expected");
					},
					errorMessage: "DateRange field with id: '" + sId + "' not found"
				});
			},

			/**
			* Check whether an item with a given title text is currently selected in sap.m.List control
			* @param {String} sItem - Item title text
			**/
			iCheckTheSelectedItemInTheList: function (sItem) {
				return this.waitFor({
					controlType: "sap.m.List",
					success: function (oList) {
						var sSelectedItem = oList[0].getSelectedItem().getTitle();
						Opa5.assert.equal(sItem, sSelectedItem, "'" + sItem + "' is the selected item in the list");
					},
					errorMessage: "SmartList control not found on the screen"
				});
			},

			/**
			* Select an item from sap.m.List control with a given item title text
			* @param {String} sItem - Item title text
			**/
			iSelectTheItemInTheList: function (sItem) {
				return this.waitFor({
					controlType: "sap.m.List",
					success: function (oList) {
						var aListItems = oList[0].getItems();
						for (var i = 0; i < aListItems.length; i++) {
							if (aListItems[i].getTitle() === sItem) {
								Opa5.assert.ok(true, "'" + sItem + "' selected from the list");
								aListItems[i].firePress();
								return null
							}
						}
						Opa5.assert.notOk(true, "'" + sItem + "' not found in the list");
					},
					errorMessage: "SmartList control not found on the screen"
				});
			}
		});
	}
);
