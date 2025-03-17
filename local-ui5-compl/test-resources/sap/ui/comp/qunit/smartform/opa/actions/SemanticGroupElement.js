sap.ui.define([
    "sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/matchers/Ancestor",
	"sap/ui/test/matchers/Properties"
], function (Opa5, Press, EnterText, Ancestor, Properties) {
	"use strict";
	var ID_PREFIX = "__component0---IDView--",
		SMARTFORM = ID_PREFIX + "smartForm";
	return {
		iPress: function (sId) {
			return this.waitFor({
				id: sId,
				actions: new Press()
			});
		},
		iToggleFormEditMode: function (bEditable) {
			return this.waitFor({
				id: SMARTFORM,
				success: function (oForm) {
					if (oForm.getEditable() === bEditable) {
						return;
					}

					this.iWaitForPromise(new Promise(function (resolve, reject) {
						oForm.attachEventOnce("editToggled", function(){
							resolve();
						});
					}));
					oForm.setEditable(bEditable);
				},
				errorMessage: "Not able to toggle the mode of SmartForm with id " + SMARTFORM
			});
		}
	};
});