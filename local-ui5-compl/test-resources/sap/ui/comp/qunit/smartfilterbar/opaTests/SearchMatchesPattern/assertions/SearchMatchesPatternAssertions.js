sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/matchers/Ancestor",
	"sap/ui/test/matchers/Properties"
], function (Opa5, Ancestor, Properties) {
	"use strict";
	function __theValueStateShouldBe (sId, sValueState) {
		return {
			id: sId,
			success: function (oControl) {
				Opa5.assert.strictEqual(
					oControl.getValueState && oControl.getValueState(),
					sValueState,
					"Value state should match"
				);
			}
		};
	}
	function __theValueStateTextShouldBe (sId, sValueStateText) {
		return {
			id: sId,
			success: function (oControl) {
				Opa5.assert.strictEqual(
					oControl.getValueStateText && oControl.getValueStateText(),
					sValueStateText,
					"Value state text should match"
				);
			}
		};
	}
	return {
		theValueStateShouldBe: function (sControl, sValueState) {
			return this.waitFor(__theValueStateShouldBe(sControl, sValueState));
		},
		theValueStateTextShouldBe: function (sControl, sValueStateText) {
			return this.waitFor(__theValueStateTextShouldBe(sControl, sValueStateText));
		}
	};
});
