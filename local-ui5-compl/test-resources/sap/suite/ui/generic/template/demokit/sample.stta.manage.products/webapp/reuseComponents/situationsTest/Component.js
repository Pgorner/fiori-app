sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/suite/ui/generic/template/extensionAPI/ReuseComponentSupport",
	"sap/ui/core/mvc/XMLView"
], function(UIComponent, ReuseComponentSupport, XMLView) {
	"use strict";

	var bCanGetExtensionAPIFromMixInto = false;

	function fnRegisterOnPageDataLoaded(oExtensionAPI){
		oExtensionAPI.attachPageDataLoaded(function(oEvent){
			var oContextData = oEvent.context.getObject();
			(oExtensionAPI.setSectionHidden || Function.prototype)(oContextData.ProductCategory !== "Notebooks"); // method setSectionHidden not available in older releases
		});
	}

	return UIComponent.extend("STTA_MP.reuseComponents.situationsTest.Component", {
		metadata: {
			manifest: "json",
			interfaces: [
				"sap.ui.core.IAsyncContentCreation"
			],
			properties: {
				productKey: {
					type: "string",
					group: "specific",
					defaultValue: ""
				}
			},
			interfaces: [
				"sap.ui.core.IAsyncContentCreation"
			]
		},

		setProductKey: function(sKey){
			this.setProperty("productKey", sKey);
			var oResourceModel = this.getModel("i18n");
			var oResourceBundle = oResourceModel.getResourceBundle();
			var sText = oResourceBundle.getText("LBL", sKey);
			var oComponentModel = this.getComponentModel();
			oComponentModel.setProperty("/lbl", sText);
		},

		createContent: function() {
			var oView = XMLView.create({
				id: this.createId("View"),
				viewName: "STTA_MP.reuseComponents.situationsTest.view.Default"
			});
			var oExtensionAPIPromise = ReuseComponentSupport.mixInto(this, "componentModel");
			if (oExtensionAPIPromise){ // this will only be available from 1.55 onwards
				bCanGetExtensionAPIFromMixInto = true;
				oExtensionAPIPromise.then(function(oExtensionAPI){
					fnRegisterOnPageDataLoaded(oExtensionAPI);
				});
			}
			return oView;
		},

		stStart: function(oModel, oBindingContext, oExtensionAPI) {
			if (!bCanGetExtensionAPIFromMixInto){
				fnRegisterOnPageDataLoaded(oExtensionAPI);
			}
		}
	});
});
