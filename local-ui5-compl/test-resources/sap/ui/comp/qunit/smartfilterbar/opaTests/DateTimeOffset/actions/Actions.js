sap.ui.define([
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/test/actions/EnterText"
], function (PropertyStrictEquals, EnterText) {
	"use strict";
	function __iSelectOperation(sOperation, bExclude) {
		return {
			controlType: "sap.m.ComboBox",
			success: function (aControls) {
				// First control should be the include operations select and second the exclude
				aControls[bExclude ? 1 : 0].setSelectedKey(sOperation).fireEvent("change");
			},
			searchOpenDialogs: true
		};
	}
	function __iSelectDateTimeConditionValue(sPlaceHolder, sValue) {
		return {
			controlType: "sap.m.DateTimePicker",
			matchers: new PropertyStrictEquals({
				name: "placeholder",
				value: sPlaceHolder
			}),
			actions: new EnterText({
				text: sValue
			}),
			searchOpenDialogs: true
		};
	}
	return {
		iSelectOperation: function (sOperation, bExclude) {
			return this.waitFor(__iSelectOperation(sOperation, bExclude));
		},
		iSelectDateTimeConditionValue: function (sPlaceHolder, sValue) {
			return this.waitFor(__iSelectDateTimeConditionValue(sPlaceHolder, sValue));
		}
	};
});
