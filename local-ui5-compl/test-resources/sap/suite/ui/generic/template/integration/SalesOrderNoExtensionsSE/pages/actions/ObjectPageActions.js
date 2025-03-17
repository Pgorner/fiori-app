/*** Object Page Report actions ***/
sap.ui.define(["sap/ui/test/Opa5", "sap/ui/test/actions/Press", "sap/ui/test/actions/EnterText"
],
	function (Opa5, Press, EnterText) {
		'use strict';
		return function () {
			return {
				//This function simulates the keyboard hit enter action 
				iEnterCheckbox: function (sId) {
					return this.waitFor({
						controlType: "sap.m.CheckBox",
						id: new RegExp(sId + "$"),
						actions: new EnterText({
							text: "",
							pressEnterKey: true
						}),
						success: function (aCheckBox) {
							aCheckBox[0].setSelected(true);
							Opa5.assert.ok(true, "CheckBox selected");
						}
					});
				},

				//This is to enable and disable the checkbox
				iClickOnCheckboxWithText: function (sText, sId) {
					var sControlType = "sap.m.CheckBox";
					return this.waitFor({
						controlType: sControlType,
						id: new RegExp(sId + "$"),
						success: function (aControl) {
							aControl[0].setSelected(!aControl[0].getSelected());
							aControl[0].fireSelect({ selected: aControl[0].getSelected() });
							Opa5.assert.ok(true, "Control type: \"" + sControlType + "\" with text: \"" + sText + "\" and id: \"" + sId + "\" got selected with value: \"" + aControl[0].getSelected() + "\"");
						},
						errorMessage: "Failed to get control type: \"" + sControlType + "\" with text: \"" + sText + "\" and id: \"" + sId + "\""
					});
				},

				//This is to select the value from ValuHelp Dialog
				iSelectFirstItemInVhWithId: function (sId) {
					return this.waitFor({
						id: new RegExp(sId + "$"),
						actions: new Press({
							idSuffix: "col0"
						}),
						success: function () {
							Opa5.assert.ok(true, "Value Help selected ");
						}
					});
				}
			};
		};
	});
