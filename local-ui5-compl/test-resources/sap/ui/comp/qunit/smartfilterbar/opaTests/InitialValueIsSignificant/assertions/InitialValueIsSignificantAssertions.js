sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/matchers/Ancestor",
	"sap/ui/test/matchers/Properties"
], function (Opa5, Ancestor, Properties) {
	"use strict";

	function __theFiltersShouldMatch (sFilters, sErrorMessage) {
		return {
			id: "__xmlview0--filterResult",
			success: function (oText) {
				Opa5.assert.strictEqual(
					oText.getText(),
					sFilters,
					sErrorMessage ? sErrorMessage : "Filters should match"
				);
			}
		};
	}
	return {
		theFiltersShouldMatch: function (sFilters, sErrorMessage) {
			return this.waitFor(__theFiltersShouldMatch(sFilters, sErrorMessage));
		}
	};
});
