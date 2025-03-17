sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/matchers/Ancestor",
	"sap/ui/test/matchers/Properties",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"test-resources/sap/ui/mdc/qunit/p13n/OpaTests/utility/Util",
	"sap/ui/test/matchers/Descendant"

], function (Opa5, Press, EnterText, Ancestor, Properties,PropertyStrictEquals, TestUtil, Descendant) {
	"use strict";
	function __iPressSearchFieldIconButton(sId) {
		return {
			id: sId,
			controlType: "sap.m.Button",
			actions: new Press(),
			searchOpenDialogs: true
		};
	}
	function __iEnterValue(sControlID, sValue, bKeepFocus) {
		return {
			id: sControlID,
			actions: new EnterText({
				text: sValue,
				keepFocus: !!bKeepFocus
			})
		};
	}

	return {
		iPressSearchFieldIconButton: function (sId) {
			return this.waitFor(__iPressSearchFieldIconButton(sId));
		},
		iEnterValue: function (sControlId, sValue, bKeepFocus) {
			return this.waitFor(__iEnterValue(sControlId, sValue, bKeepFocus));
		}
	};
});
