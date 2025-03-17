sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/matchers/Ancestor",
	"sap/ui/test/matchers/Properties"
], function (Opa5, Ancestor, Properties) {
	"use strict";

	function __theRequestURLShouldMatch (sRequestURL, sErrorMessage) {
		return {
			id: "outputAreaUrl",
			success: function (oText) {
				Opa5.assert.strictEqual(
					oText.getText(),
					sRequestURL,
					sErrorMessage ? sErrorMessage : "Request URL should match"
				);
			}
		};
	}
	function __theFiltersShouldMatch (sFilters, sErrorMessage) {
		return {
			id: "outputAreaFilters",
			success: function (oText) {
				Opa5.assert.strictEqual(
					oText.getText(),
					sFilters,
					sErrorMessage ? sErrorMessage : "Filters should match"
				);
			}
		};
	}
	function __theFiltersShouldContains (aFilters, sErrorMessage) {
		return {
			id: "outputAreaFilters",
			success: function (oText) {
				aFilters.forEach(function (sFilter){
					Opa5.assert.ok(oText.getText().indexOf(sFilter) > -1, sErrorMessage ? sErrorMessage : "Filters should contains");
				});
			}
		};
	}
	function __theFiltersShouldNotContains (aFilters, sErrorMessage) {
		return {
			id: "outputAreaFilters",
			success: function (oText) {
				aFilters.forEach(function (sFilter){
					Opa5.assert.ok(oText.getText().indexOf(sFilter) === -1, sErrorMessage ? sErrorMessage : "Filters should not contains");
				});
			}
		};
	}
	function __thereIsOperation (sControl, sOperation, sText) {
		return {
			controlType: "sap.m.ComboBox",
			searchOpenDialogs: true,
			success: function (aControls) {
				Opa5.assert.strictEqual(
					!!aControls[0].findItem("key", sOperation),
					true,
					"There is no Empty operation in " + sOperation + " operations select for " + sControl
				);
				if (sText) {
					Opa5.assert.strictEqual(
						aControls[0].findItem("key", sOperation).getText(),
						sText,
						"There is  operation in " + sOperation + " operations select for " + sControl
					);
				}
			}
		};
	}
	function __theOptionsShouldBeCount (sId, iCount) {
		return {
			id: sId + "-RP-popover",
			success: function (oPopOver) {
				var oListItems = oPopOver.getContent()[0].getPages()[0].getContent()[0].getItems();
				Opa5.assert.strictEqual(
					oListItems.length,
					iCount,
					"List items should match count"
				);
			}
		};
	}
	function __theOptionsShouldBeCountPerso (sId, iCount) {
		return {
			id: sId + "-RP-popover",
			searchOpenDialogs: true,
			success: function (oPopOver) {
				var oListItems = oPopOver.getContent()[0].getPages()[0].getContent()[0].getItems();
				Opa5.assert.strictEqual(
					oListItems.length,
					iCount,
					"List items should match count"
				);
			}
		};
	}
	function __theDefaultOptionShouldBe (sId, sOption) {
		return {
			id: sId,
			success: function (oControl) {
				if (!sOption) {
					Opa5.assert.strictEqual(
						oControl.getValue(),
						undefined,
						"Default option should match"
					);
				} else {
					var sOperator = oControl.getValue() && oControl.getValue().operator;

					Opa5.assert.strictEqual(
						sOperator,
						sOption,
						"Default option should match"
					);
				}
			}
		};
	}
	function __theValueToShouldBe (sId, sDate) {
		return {
			id: sId,
			success: function (oControl) {
				if (sDate === undefined) {
					Opa5.assert.strictEqual(
						oControl.getValue(),
						sDate,
						"Value should match"
					);
				} else {
					var sValue,
						sExpectedDate = new Date(sDate).toLocaleDateString();

					if (oControl.isA("sap.m.DatePicker")) {
						sValue = (new Date(oControl.getValue())).toLocaleDateString();
					} else if (oControl.isA("sap.m.DynamicDateRange")) {
						sValue = oControl.getValue() && oControl.getValue().values
						&& oControl.getValue().values[0] && oControl.getValue().values[0].toLocaleDateString();
					}

					Opa5.assert.strictEqual(
						sValue,
						sExpectedDate,
						"Value should match"
					);
				}
			}
		};
	}
	function __theOptionShouldNotBeInTheList (sId, sFilterName) {
		return {
			id: sId + "-RP-popover",
			success: function (oPopOver) {
				var oItem = oPopOver.getContent()[0].getPages()[0].getContent()[0].getItems().
				filter(function(item) {
					return item.getOptionKey() === sFilterName;
				});
				Opa5.assert.strictEqual(
					oItem.length,
					0,
					"Should not have filter with key " + sFilterName
				);
			}
		};
	}
	function __theOptionShouldBeInTheList (sId, sFilterName) {
		return {
			id: sId + "-RP-popover",
			success: function (oPopOver) {
				var oItem = oPopOver.getContent()[0].getPages()[0].getContent()[0].getItems().
				filter(function(item) {
					return item.getOptionKey() === sFilterName;
				});
				Opa5.assert.strictEqual(
					oItem.length,
					1,
					"Should have filter with key " + sFilterName
				);
			}
		};
	}
	function __theOptionShouldBeInTheListPerso (sId, sFilterName) {
		return {
			id: sId + "-RP-popover",
			searchOpenDialogs: true,
			success: function (oPopOver) {
				var oItem = oPopOver.getContent()[0].getPages()[0].getContent()[0].getItems().
				filter(function(item) {
					return item.getOptionKey() === sFilterName;
				});
				Opa5.assert.strictEqual(
					oItem.length,
					1,
					"Should have filter with key " + sFilterName
				);
			}
		};
	}
	function __theUiStateShouldContain (sParameterName, sParameterValue) {
		return {
			id: "__xmlview0--outputAreaDataSuite",
			success: function (oCodeEditor) {
				var sValue = oCodeEditor.getValue(),
					oJsonValue = JSON.parse(sValue),
					aParameter = oJsonValue.Parameters.filter(function(parameter) {
					return parameter.PropertyName === sParameterName;
				});
				Opa5.assert.strictEqual(
					aParameter.length,
					1,
					"Should have parameter with key " + sParameterName
				);
				Opa5.assert.strictEqual(
					aParameter[0].PropertyValue,
					sParameterValue,
					"Should have parameter with key " + sParameterName + "and value " + sParameterValue
				);
			}
		};
	}
	function __theUiStateShouldContainSelectOptions (sParameterName, oRange) {
		return {
			id: "__xmlview0--outputAreaDataSuite",
			success: function (oCodeEditor) {
				var sValue = oCodeEditor.getValue(),
					oJsonValue = JSON.parse(sValue),
					aParameter = oJsonValue.SelectOptions.filter(function(parameter) {
						return parameter.PropertyName === sParameterName;
					});
				Opa5.assert.strictEqual(
					aParameter.length,
					1,
					"Should have parameter with key " + sParameterName
				);
				Opa5.assert.strictEqual(
					aParameter[0]?.Ranges[0]?.Sign,
					oRange.Sign,
					"Should have parameter with key " + sParameterName + " and value Sign should be " + aParameter[0].Ranges[0].Sign + " but it is " + oRange.Low
				);
				Opa5.assert.strictEqual(
					aParameter[0]?.Ranges[0]?.Option,
					oRange.Option,
					"Should have parameter with key " + sParameterName + " and value Option should be " + aParameter[0].Ranges[0].Option + " but it is " + oRange.Low
				);
				Opa5.assert.strictEqual(
					aParameter[0]?.Ranges[0]?.Low,
					oRange.Low,
					"Should have parameter with key " + sParameterName + " and value Low should be " + aParameter[0].Ranges[0].Low + " but it is " + oRange.Low
				);
				Opa5.assert.strictEqual(
					aParameter[0]?.Ranges[0]?.High,
					oRange.High,
					"Should have parameter with key " + sParameterName + " and value High should be " + aParameter[0].Ranges[0].High + " but it is " + oRange.Low
				);
			}
		};
	}
	function __theFilterShouldContainsText (sId, sText) {
		return {
			id: sId,
			success: function (oControl) {
				Opa5.assert.strictEqual(oControl.getValue(), sText);
			}
		};
	}
	function __theBaseControlShouldContainsConfiguration (sId, sProperty, sConfiguration) {
		return {
			id: sId,
			success: function (oControl) {
				if (oControl.isA("sap.m.DynamicDateRange") || oControl.isA("sap.m.DatePicker") || oControl.isA("sap.m.DateRangeSelection") || oControl.isA("sap.m.DateTimePicker")) {
					Opa5.assert.strictEqual(oControl.getProperty(sProperty), sConfiguration);
				}
			}
		};
	}
	function __theDialogControlShouldContainsConfiguration (sId, sControlType, sProperty, sConfiguration) {
		return {
			controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
			success: function (oDialog) {
				this.waitFor({
					controlType: sControlType,
					success: function (oControl) {
						Opa5.assert.strictEqual(oControl[0].getProperty(sProperty), sConfiguration);
					}
				});
			}
		};
	}
	function __iShouldSeeFilterWithValueStateText(sId, sText) {
		return {
			id: sId,
			success: function (oControl) {
				Opa5.assert.equal(oControl.getValueStateText(), sText);
			}
		};
	}

	function __iShouldSeeFilterWithValueState(sId, sValueState) {
		return {
			id: sId,
			success: function (oControl) {
				Opa5.assert.equal(oControl.getValueState(), sValueState);
			}
		};
	}

	function __iShouldSeeFiltersWithValueState(aFilterNames, sState) {
		return {
			success: function() {
				aFilterNames.forEach(function(sFilterName){
					return this.waitFor(__iShouldSeeFilterWithValueState.call(this, sFilterName, sState));
				}.bind(this));
			}
		};
	}

	function __thereIsConditionOperation(sControl, sOperation, sText) {
		return {
			controlType: "sap.m.ComboBox",
			searchOpenDialogs: true,
			success: function (aControls) {
				Opa5.assert.strictEqual(
					!!aControls[0].findItem("key", sOperation),
					true,
					"There is no Empty operation in " + sOperation + " operations select for " + sControl
				);
				if (sText) {
					Opa5.assert.strictEqual(
						aControls[0].findItem("key", sOperation).getText(),
						sText,
						"There is  operation in " + sOperation + " operations select for " + sControl
					);
				}
			}
		};
	}

	function __theConditionOptionsShouldBeCount(sControl, iCount) {
		return {
			controlType: "sap.m.ComboBox",
			searchOpenDialogs: true,
			success: function (aControls) {
				Opa5.assert.strictEqual(
					aControls[0].getItems().length,
					iCount,
					"The count should be" + iCount
				);
			}
		};
	}

	function __theFilterWithIdShouldBeOfType(sId, sType) {
		return {
			id: sId,
			searchOpenDialogs: true,
			success: function (oControl) {
				Opa5.assert.strictEqual(oControl.getMetadata().getName(), sType,
						"Control with ID '" + sId + "' is of expected type '" + sType + "'");
			}
		};
	}
	function __iShouldSeeFilterValueInCodeEditor(sId, sValue) {
		return {
			id: sId,
			success: function(oCE){
				if (oCE.getId() === `__xmlview0--${sId}`) {
					var sCEValue = oCE.getValue().replace(/\n|\r/g, "").replace(/\s/g, '');
					sValue = JSON.stringify(sValue);
					Opa5.assert.equal(sCEValue, sValue, "The correct filter data has been created");
				}
			}
		};
	}
	function __iShouldSeeFilterValueInCodeEditor(sId, sValue) {
		return {
			id: sId,
			success: function(oCE){
				if (oCE.getId() === `__xmlview0--${sId}`) {
					var sCEValue = oCE.getValue().replace(/\n|\r/g, "").replace(/\s/g, '');
					sValue = JSON.stringify(sValue);
					Opa5.assert.equal(sCEValue, sValue, "The correct filter data has been created");
				}
			}
		};
	}
	return {
		theRequestURLShouldMatch: function (sRequestURL, sErrorMessage) {
			return this.waitFor(__theRequestURLShouldMatch(sRequestURL, sErrorMessage));
		},
		theFiltersShouldMatch: function (sFilters, sErrorMessage) {
			return this.waitFor(__theFiltersShouldMatch(sFilters, sErrorMessage));
		},
		theFiltersShouldContains: function (sFilters, sErrorMessage) {
			return this.waitFor(__theFiltersShouldContains(sFilters, sErrorMessage));
		},
		theFiltersShouldNotContains: function (sFilters, sErrorMessage) {
			return this.waitFor(__theFiltersShouldNotContains(sFilters, sErrorMessage));
		},
		thereIsOperation: function (sControl, sOperation, sText) {
			return this.waitFor(__thereIsOperation(sControl, sOperation, sText));
		},
		theOptionsShouldBeCount: function (sId, iCount) {
			return this.waitFor(__theOptionsShouldBeCount(sId, iCount));
		},
		theOptionsShouldBeCountPerso: function (sId, iCount) {
			return this.waitFor(__theOptionsShouldBeCountPerso(sId, iCount));
		},
		theDefaultOptionShouldBe: function (sId, sOption) {
			return this.waitFor(__theDefaultOptionShouldBe(sId, sOption));
		},
		theValueToShouldBe: function (sControl, sDate) {
			return this.waitFor(__theValueToShouldBe(sControl, sDate));
		},
		theOptionShouldNotBeInTheList: function (sId, sFilterName) {
			return this.waitFor(__theOptionShouldNotBeInTheList(sId, sFilterName));
		},
		theOptionShouldBeInTheList: function (sId, sFilterName) {
			return this.waitFor(__theOptionShouldBeInTheList(sId, sFilterName));
		},
		theOptionShouldBeInTheListPerso: function (sId, sFilterName) {
			return this.waitFor(__theOptionShouldBeInTheListPerso(sId, sFilterName));
		},
		theUiStateShouldContain: function (sParameterName, sParameterValue) {
			return this.waitFor(__theUiStateShouldContain(sParameterName, sParameterValue));
		},
		theUiStateShouldContainSelectOptions: function (sParameterName, oRange) {
			return this.waitFor(__theUiStateShouldContainSelectOptions(sParameterName, oRange));
		},
		theFilterShouldContainsText: function (sId, sText) {
			return this.waitFor(__theFilterShouldContainsText(sId, sText));
		},
		theControlShouldContainsConfiguration: function (sId, sProperty, sConfiguration) {
			return this.waitFor(__theBaseControlShouldContainsConfiguration(sId, sProperty, sConfiguration));
		},
		theControlInDialogShouldContainsConfiguration: function (sId, sControlType, sProperty, sConfiguration) {
			return this.waitFor(__theDialogControlShouldContainsConfiguration(sId, sControlType, sProperty, sConfiguration));
		},
		iShouldSeeFilterWithValueStateText: function (sId, sText) {
			return this.waitFor(__iShouldSeeFilterWithValueStateText(sId, sText));
		},
		iShouldSeeFilterWithValueState: function (sId, sValueState) {
			return this.waitFor(__iShouldSeeFilterWithValueState(sId, sValueState));
		},
		iShouldSeeFiltersWithValueState: function (aFilterNames, sState) {
			return this.waitFor(__iShouldSeeFiltersWithValueState.call(this, aFilterNames, sState));
		},
		//ToDo: Copy of ValueHelpDialogAssertion iCheckItemsCountEqualTo
		iCheckItemsCountEqualTo: function (nCount) {
			this.waitFor({
				controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
				searchOpenDialogs: true,
				success: function (aValueHelpDialogs) {
					var oValueHelpDialog = aValueHelpDialogs[0];
					oValueHelpDialog.getTableAsync().then(function(oTable) {
						var nItemsCount = 0;
						if (oTable.isA("sap.ui.table.Table")) {
							// N.B: oTable.getRows() will return only the visible rows of the table!
							nItemsCount = oTable.getBinding("rows").getLength();
						} else if (oTable.isA("sap.m.Table")){
							nItemsCount = oTable.getBinding("items").getLength();
						}
						Opa5.assert.equal(
							nItemsCount,
							nCount,
							"Items count should be " + nCount
						);
					});
				}
			});
		},
		iCheckIfItemIsWithGivenValueStateFromDialog: function (sId, sValueState, sEntitySet) {
			this.waitFor({
				controlType: "sap.m.Dialog",
				searchOpenDialogs: true,
				success: function(oDialog) {
					const oDLG = oDialog[0];
					const oSFB = oDLG.getParent().getParent();
					Opa5.assert.equal(oSFB.getMetadata().getName(), "sap.ui.comp.smartfilterbar.SmartFilterBar", "SmartFilterBar is found");
					oSFB._mAdvancedAreaFilter[sEntitySet]?.items?.forEach(function(oObj) {
						if (oObj.control && oObj.control.getName()?.includes(sId)) {
							const sFilterItemValueState = oObj.filterItem.getControl()?.getValueState();
							Opa5.assert.equal(
								sFilterItemValueState,
								sValueState,
								"ValueState is as expected"
							);
						}
					});
				}
			});
		},
		iCheckIfItemIsWithGivenValueState: function (sId, sValueState) {
			this.waitFor({
				controlType: "sap.ui.comp.smartfilterbar.SmartFilterBar",
				success: function(oSmartFilterBar) {
					const oSFB = oSmartFilterBar[0];
					Opa5.assert.equal(oSFB.getMetadata().getName(), "sap.ui.comp.smartfilterbar.SmartFilterBar", "SmartFilterBar is found");
					oSFB._retrieveCurrentSelectionSet(true, true).forEach(function(oObj) {
						if (oObj.control && oObj.control.setValueState && oObj.control.getValueState) {
							if (oObj.name === sId) {
								Opa5.assert.equal(
									oObj.control.getValueState(),
									sValueState,
									"ValueState is as expected"
								);
							}
						}

					});
				}
			});
		},
		iShouldSeeValueHelpDialogWithRows: function (nCount) {
			return this.iCheckItemsCountEqualTo(nCount);
		},
		thereIsConditionOperation: function (sControl, sOperation, sText) {
			return this.waitFor(__thereIsConditionOperation(sControl, sOperation, sText));
		},
		theConditionOptionsShouldBeCount: function (sControl, iCount) {
			return this.waitFor(__theConditionOptionsShouldBeCount(sControl, iCount));
		},
		theFilterWithIdShouldBeOfType: function (sId, sType) {
			return this.waitFor(__theFilterWithIdShouldBeOfType(sId, sType));
		},
		iShouldSeeFilterValueInCodeEditor: function(sId, sValue) {
			return this.waitFor(__iShouldSeeFilterValueInCodeEditor(sId, sValue));
		}
	};
});
