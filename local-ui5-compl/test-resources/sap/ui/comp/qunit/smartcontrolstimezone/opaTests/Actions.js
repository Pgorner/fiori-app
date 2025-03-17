sap.ui.define([
	"sap/ui/test/Opa5",
	"test-resources/sap/ui/mdc/qunit/p13n/OpaTests/utility/Util",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText"
], function (Opa5, P13nTestUtil, Press, EnterText) {
	"use strict";

	function pressButton(sButtonText) {
		return this.waitFor({
			controlType: "sap.m.Button",
			properties: {
				text: sButtonText
			},
			actions: new Press(),
			errorMessage: sButtonText + " button not found!",
			success: function () {
				Opa5.assert.ok(true, sButtonText + " button pressed");
			}
		});
	}

	function enterValueInInput(sParent, sControlType, sLabel, sValue) {
		return this.waitFor({
			controlType: sControlType,
			ancestor: {
				controlType: sParent
			},
			labelFor: {
				text: sLabel
			},
			actions: new EnterText({
				text: sValue
			}),
			errorMessage: "'" + sLabel + "' " + sControlType + " not found!",
			success: function () {
				Opa5.assert.ok(true, "'" + sValue + "' value entered in '" + sLabel + "' " + sControlType);
			}
		});
	}

	function enterValueInInputInValueHelpDialog(sControlType, sLabel, sValue) {
		return this.waitFor({
			controlType: sControlType,
			searchOpenDialogs: true,
			ancestor: {
				controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog"
			},
			actions: new EnterText({
				text: sValue
			}),
			errorMessage: "'" + sLabel + "' " + sControlType + " not found!",
			success: function () {
				Opa5.assert.ok(true, "'" + sValue + "' value entered in '" + sLabel + "' " + sControlType);
			}
		});
	}

	return {
		iPressGoButtonOnSmartFilterBar: function () {
			var sGoBtnText = P13nTestUtil.getTextFromResourceBundle("sap.ui.comp", "FILTER_BAR_GO");
			return pressButton.call(this, sGoBtnText);
		},
		iPressClearButtonOnSmartFilterBar: function () {
			var sClearBtnText = P13nTestUtil.getTextFromResourceBundle("sap.ui.comp", "FILTER_BAR_CLEAR");
			return pressButton.call(this, sClearBtnText);
		},
		iPressSetFilterDataWithDate: function () {
			return pressButton.call(this, "setFilterData with Date");
		},
		iPressSetFilterDataWithString: function () {
			return pressButton.call(this, "setFilterData with String");
		},
		iPressSetFilterDataGetFilterDataButton: function () {
			return pressButton.call(this, "setFilterData(getFilterData())");
		},
		iPressUpdateResultsButton: function () {
			return pressButton.call(this, "Update results");
		},
		iPressResetButton: function () {
			return pressButton.call(this, "Reset");
		},
		iPressApplyVariantWithDateButton: function () {
			return pressButton.call(this, "applyVariant (with Date)");
		},
		iPressApplyVariantWithStringButton: function () {
			return pressButton.call(this, "applyVariant (with String)");
		},
		iPressApplyVariantFetchVariantButton: function () {
			return pressButton.call(this, "applyVariant(fetchVariant)");
		},
		iPressSetUiStateGetUiStateButton: function () {
			return pressButton.call(this, "setUiState(getUiState())");
		},
		iEnterValueInDatePicker: function (sParent, sLabel, sValue) {
			return enterValueInInput.call(this, sParent, "sap.m.DatePicker", sLabel, sValue);
		},
		iEnterValueInDateRangeSelection: function (sParent, sLabel, sValue) {
			return enterValueInInput.call(this, sParent, "sap.m.DateRangeSelection", sLabel, sValue);
		},
		iEnterValueInDateTimePicker: function (sParent, sLabel, sValue) {
			return enterValueInInput.call(this, sParent, "sap.m.DateTimePicker", sLabel, sValue);
		},
		iEnterValueInDynamicDateRange: function (sParent, sLabel, sValue) {
			return enterValueInInput.call(this, sParent, "sap.m.DynamicDateRange", sLabel, sValue);
		},
		iEnterValueInTimePicker: function (sParent, sLabel, sValue) {
			return enterValueInInput.call(this, sParent, "sap.m.TimePicker", sLabel, sValue);
		},
		iEnterValueInValueHelpMultiInput: function (sParent, sDateControl, sLabel, sValue, sMainControlType) {
			var sControlType = sMainControlType || "sap.m.MultiInput";
			// Open ValueHelpDialog
			this.waitFor({
				controlType: sControlType,
				ancestor: {
					controlType: sParent
				},
				labelFor: {
					text: sLabel
				},
				actions: new Press(),
				errorMessage: "'" + sLabel + "' " + sControlType + " not found!",
				success: function() {
					Opa5.assert.ok(true, "'" + sLabel + "' " + sControlType + " was pressed");
				}
			});
			// Find ValueHelpDialog
			this.waitFor({
				controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
				errorMessage: "'" + sLabel + "' ValueHelpDialog not found!",
				success: function () {
					Opa5.assert.ok(true, "'" + sLabel + "' ValueHelpDialog was found!");
				}
			});
			// Enter Value in the Date control
			enterValueInInputInValueHelpDialog.call(this, sDateControl, sLabel, sValue);
			// Press OK button of the ValueHelpDialog
			return this.waitFor({
				controlType: "sap.m.Button",
				searchOpenDialogs: true,
				ancestor: {
					controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog"
				},
				properties: {
					text: "OK"
				},
				actions: new Press(),
				success: function () {
					Opa5.assert.ok(true, "ValueHelp dialog was closed");
				}
			});
		},
		iOpenP13nFilterAndShowField: function (sFieldName) {
			this.iPressButtonWithIcon("Settings");
			this.iPressFilterItemInP13n(P13nTestUtil.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Filter"));
			this.iSelectFilterFieldInP13n(sFieldName);
		},
		iPressButtonWithIcon: function (sText) {
			this.waitFor({
				controlType: "sap.m.Button",
				properties: {
					text: sText
				},
				actions: new Press(),
				errorMessage: "'" + sText + "' button not found!",
				success: function () {
					Opa5.assert.ok(true, "'" + sText + "' button pressed");
				}
			});
		},
		iPressFilterItemInP13n: function (sTitle) {
			return this.waitFor({
				controlType: "sap.m.IconTabFilter",
				searchOpenDialogs: true,
				properties: {
					text: sTitle
				},
				actions: new Press(),
				errorMessage: "'" + sTitle + "' tab not found!",
				success: function () {
					Opa5.assert.ok(true, "'" + sTitle + "' tab pressed");
				}
			});
		},
		iSelectFilterFieldInP13n: function (sFieldName) {
			return this.waitFor({
				properties: {
					placeholder: P13nTestUtil.getTextFromResourceBundle("sap.m", "p13n.FILTER_PLACEHOLDER")
				},
				controlType: "sap.m.ComboBox",
				errorMessage: "'" + P13nTestUtil.getTextFromResourceBundle("sap.m", "p13n.FILTER_PLACEHOLDER") + "' field not found!",
				success: function (aComboBoxes) {
					var oComboBox = aComboBoxes[0],
						oItem = oComboBox.getItems().find(function (oItem) {
							return oItem.getText() === sFieldName;
						}),
						sKey = oItem && oItem.getKey();
					oComboBox.setSelectedKey(sKey);
					oComboBox.fireSelectionChange();
					oComboBox.fireChange({ newValue: sFieldName });
					Opa5.assert.ok(!!sKey, "'" + sFieldName + "' was shown");
				}
			});
		},
		iPressOKButtonInP13n: function () {
			return pressButton.call(this, P13nTestUtil.getTextFromResourceBundle("sap.m", "p13n.POPUP_OK"));
		}
	};
});
