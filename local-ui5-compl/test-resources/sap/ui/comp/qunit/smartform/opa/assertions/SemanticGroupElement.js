sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/matchers/Ancestor",
    "sap/ui/test/matchers/Properties"
], function (Opa5, Ancestor, Properties) {
	"use strict";
	var ID_PREFIX = "__component0---IDView--",
		SMARTFORM = ID_PREFIX + "smartForm";
	return {
		iShouldSeeSmartFieldWithIdAndValue: function (sId, vValue) {
			return this.waitFor({
				controlType: "sap.ui.comp.smartfield.SmartField",
				success: function (aSmartFields) {
					var oSmartField;
					for (var i = 0; i < aSmartFields.length; i++) {
						if (aSmartFields[i].getId() === sId) {
							oSmartField = aSmartFields[i];
							break;
						}

					}
					Opa5.assert.equal(oSmartField.getValue(), vValue, "The SmartField with the id " + sId + " contains the correct value");
				}
			});
		},
		iShouldSeeDelimiterOfSemanticFieldsInEditMode: function (sId, sDelimiter) {
			return this.waitFor({
				controlType: "sap.m.Text",
				id: sId,
				success: function (sText) {
					Opa5.assert.equal(sText.getText(),sDelimiter, "In display mode the correct delimiter '" + sDelimiter + "' is displayed");
				},
				errorMessage: "Delimiter with id'" + sId + "' and value '" + sDelimiter + "' is not rendered"
			});
		},
		iShouldSeeSemanticFieldsAsText: function (sId) {
			return this.waitFor({
				controlType: "sap.m.Text",
				id: sId,
				success: function (sText) {
					Opa5.assert.ok(sText, "In display mode the sematic fields and delimiter with id '" + sId + "' are displayed as text");
				},
				errorMessage: "Semantic fields with id'" + sId + "' are not visualized as text"

			});
		},
		iShouldSeeSemanticFieldAsSmartLink: function (sId) {
			return this.waitFor({
				controlType: "sap.ui.comp.smartfield.SmartField",
				id: sId,
				success: function (oSmartField) {
					Opa5.assert.ok(oSmartField.getFirstInnerControl().isA("sap.ui.comp.navpopover.SmartLink"), "In display mode the sematic field id '" + sId + "' is displayed as SmartLink");
				},
				errorMessage: "Semantic fields with id'" + sId + "' are not visualized as text"

			});
		},
		iShouldSeeUoMCurrencySemanticFieldsWithCorrectTextValue: function (sId, sValue) {
			return this.waitFor({
				controlType: "sap.m.Text",
				id: sId,
				success: function (oText) {
					Opa5.assert.strictEqual(
						oText.getText(),
						sValue,
						"In display mode the semantic fields and delimiter with id '" + sId + "' and value '" + sValue + "'are displayed as text"
					);
				},
				errorMessage: "Semantic fields with id'" + sId + "' are not having correct value"

			});
		},
		iShouldSeeSmartForm: function () {
			return this.waitFor({
				controlType: "sap.ui.comp.smartform.SmartForm",
				id: SMARTFORM,
				success: function (oSmartForm) {
					Opa5.assert.ok(oSmartForm, "The SmartForm with the id " + SMARTFORM + "is available");
				}
			});
		}
	};
});