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
	function __iPressTheFilterGoButton() {
		return {
			id: "__xmlview0--smartFilterBar-btnGo",
			controlType: "sap.m.Button",
			actions: new Press(),
			errorMessage: "Did not find the button 'Go'"
		};
	}

	function __iSelectItemByKey(sControlId, sKey) {
		return {
			id: sControlId,
			controlType: "sap.m.ComboBox",
			success: function (aControl) {
				var oItem = aControl.getItemByKey(sKey);
				aControl.setSelectedItem(oItem).fireEvent("change");
			}
		};
	}
	return {
		iSelectItemByKey: function (sControlId, sKey) {
			return this.waitFor(__iSelectItemByKey(sControlId, sKey));
		},
		PressTheFilterGoButton: function () {
			return this.waitFor(__iPressTheFilterGoButton());
		}
	};
});
