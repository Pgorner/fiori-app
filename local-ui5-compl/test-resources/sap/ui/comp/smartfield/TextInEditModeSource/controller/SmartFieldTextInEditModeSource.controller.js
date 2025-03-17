sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";
	return Controller.extend("TextInEditModeSource.controller.SmartFieldTextInEditModeSource", {
		onInit: function() {
			//Bind the Projector (Product 1239102) to the Form
			this.byId("detail").bindElement({
				path: "/Products('001')",
				parameters: {
					//Necesssary Parameter for TextInEditMode --> important Parameter for the NavigationProperty
					expand: "to_ProductCategories"
				}
			});
		}
	});
});
