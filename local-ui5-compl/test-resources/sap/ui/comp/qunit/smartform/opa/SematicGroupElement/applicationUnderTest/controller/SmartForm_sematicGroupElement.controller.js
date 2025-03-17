sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("smartform_SemanticGroupElement.Controller", {

		onInit: function() {
			this.byId("smartForm").bindElement({
				path: "/Employees('0001')"
			});
		}
	});
});
