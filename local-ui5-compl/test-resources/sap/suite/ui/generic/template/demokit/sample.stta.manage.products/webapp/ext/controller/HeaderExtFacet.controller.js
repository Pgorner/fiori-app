sap.ui.define(["sap/ui/core/mvc/Controller","sap/suite/ui/generic/template/extensionAPI/extensionAPI"],
	function(Controller, extensionAPI) {
		"use strict";
		return Controller.extend("STTA_MP.ext.controller.HeaderExtFacet", {
			onInit: function(){
				var oRatingIndicator = this.byId("RI_default");
				var oAPIPromise = extensionAPI.getExtensionAPIPromise(this.getView());
				oAPIPromise.then(function(oExtensionAPI) {
					//To get the Rating Indicator Dynamic ID, extensionAPI has been used. oCommunicationObject will store the Id of Rating Indicator.
					//As this HeaderExtFacetcontroller is called twice ,array has been used to store the Ids.
					//this oCommunicationObject array has been used in DetailExtensionController to set the Value of Rating Indicator.
					var oCommunicationObject = oExtensionAPI.getCommunicationObject();
					oCommunicationObject.entries = oCommunicationObject.entries || [];
					oCommunicationObject.entries.push(oRatingIndicator);
				})
			}
		});
	}
);
