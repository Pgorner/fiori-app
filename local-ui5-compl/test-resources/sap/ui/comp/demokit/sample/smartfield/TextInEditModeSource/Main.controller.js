sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";
	return Controller.extend("sap.ui.comp.sample.smartfield.TextInEditModeSource.Main", {
		onInit: function() {

			//Bind the Projector (Product 1239102) to the Form
			this.byId("smartForm").bindElement({
				path: "/Products('001')",
				parameters: {
					// Necessary Parameter for TextInEditMode --> important Parameter for the NavigationProperty
					expand: "to_ProductCategories"
				}
			});

			//****************** displayed text *******************
			var oInformativeTextModel = new JSONModel({
				defaultConfig : "TextInEditModeSource: default configuration",
				customDataConfig : "TextInEditModeSource: default configuration (descriptive text via ValueList from defaultTextInEditModeSource)",
				noneConfig: "<p>TextInEditModeSource: <code>None</code> <br> (no descriptive text)</p>",
				navPropConfig: "<p>TextInEditModeSource: <code>NavigationProperty</code> <br> (descriptive text via Navigation Property)</p>",
				valueListConfig: "<p>TextInEditModeSource: <code>ValueList</code> <br> (descriptive text via ValueList)</p>",
				valueListTextConfig: "<p>TextInEditModeSource: <code>ValueList</code> <br> (descriptive text via sap:text and ValueList)</p>",
				valueListNoValidationConfig: "<p>TextInEditModeSource: <code>ValueListNoValidation</code> <br> (if avaliable descriptive text via ValueListNoValidation)</p>",
				valueListWarningConfig: "<p>TextInEditModeSource: <code>ValueListWarning</code> <br> (if avaliable descriptive text via ValueListWarning)</p>"
			});
			this.getView().setModel(oInformativeTextModel,"InformativeText");
			//*****************************************************
		},
		onEditToggled: function() {
			// Transmit the changes made by the user --> triggered by an edit toggle
			this.getView().getModel().submitChanges();
		}
	});
});
