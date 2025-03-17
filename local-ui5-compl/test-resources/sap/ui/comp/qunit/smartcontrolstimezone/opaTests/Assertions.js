sap.ui.define([
	"sap/ui/test/Opa5"
], function (Opa5) {
	"use strict";
	function checkInputValue (sInputLabel, sValue) {
		return this.waitFor({
			controlType: "sap.m.Input",
			properties: {
				placeholder: sInputLabel
			},
			errorMessage: "'" + sInputLabel + "' Input not found!",
			success: function (aInputs) {
				Opa5.assert.equal(aInputs[0].getValue(), sValue, "'" + sInputLabel + "' should be: " + sValue);
			}
		});
	}
	return {
		iSeeFilterQuery: function (sFilterQuery) {
			return checkInputValue.call(this, "Filter Query", sFilterQuery);
		},
		iSeeVariant: function (sVariant) {
			return checkInputValue.call(this, "Variant", sVariant);
		},
		iSeeUiState: function (sUiState) {
			return checkInputValue.call(this, "Ui State", sUiState);
		},
		iSeeFilterModel: function (sFilterModel) {
			return checkInputValue.call(this, "Filter Model", sFilterModel);
		},
		iSeeUsingUI5Date: function (sValue) {
			return checkInputValue.call(this, "Is Using UI5Date", sValue);
		}
	};
});
