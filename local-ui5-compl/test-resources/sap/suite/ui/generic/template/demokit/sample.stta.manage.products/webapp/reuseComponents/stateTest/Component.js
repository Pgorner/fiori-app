sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/suite/ui/generic/template/extensionAPI/ReuseComponentSupport",
	"sap/ui/core/mvc/XMLView"
], function(UIComponent, ReuseComponentSupport, XMLView) {
	"use strict";

	return UIComponent.extend("STTA_MP.reuseComponents.stateTest.Component", {
		metadata: {
			manifest: "json",
			interfaces: [
				"sap.ui.core.IAsyncContentCreation"
			],
			properties: {

			}
		},
		
		createContent: function() {
			var oView = XMLView.create({
				id: this.createId("View"),
				viewName: "STTA_MP.reuseComponents.stateTest.view.Default"
			});
			ReuseComponentSupport.mixInto(this, "component");
            var oComponentModel = this.getComponentModel();
            oComponentModel.setProperty("/state", 0);
            oComponentModel.setProperty("/permanent", false);
            oComponentModel.setProperty("/pagination", false);
            oComponentModel.setProperty("/page", false);
            oComponentModel.setProperty("/session", false);
			return oView;
		},
		
		stStart: function(oModel, oBindingContext, oExtensionAPI) {
			var oComponentModel = this.getComponentModel();
			oComponentModel.setProperty("/api", oExtensionAPI);
		},
		stRefresh: function(oModel, oBindingContext, oExtensionAPI) {
			sap.m.MessageToast.show("Refreshed Price");
		},
		stGetCurrentState: function(){
			var oComponentModel = this.getComponentModel();
			return {
				state: {
					data: oComponentModel.getProperty("/state"),
					lifecycle: {
						permanent: oComponentModel.getProperty("/permanent"),
						session: oComponentModel.getProperty("/session"),
						pagination: oComponentModel.getProperty("/pagination"),
						page: oComponentModel.getProperty("/page")
					}
				}	
			};
		},
		
		stApplyState: function(oState, bSameAsLast){
			var oComponentModel = this.getComponentModel();
			oComponentModel.setProperty("/state", oState.state);
			oComponentModel.setProperty("/sameAsLast", bSameAsLast);
		}
	});
});