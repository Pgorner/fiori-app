sap.ui.define([
	'sap/ui/core/mvc/Controller'
], function (Controller) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartform.smartformSemanticGroupElement.SemanticGroupElement", {

		onInit: function () {
			this.byId("smartformSemanticGroupElement").bindElement({
				path: "/Products('1239102')"
			});
		},
		handleEditToggled: function (oEvent) {
			// just dummy function to activate input validation in SmartForm.
		}
	});
});
