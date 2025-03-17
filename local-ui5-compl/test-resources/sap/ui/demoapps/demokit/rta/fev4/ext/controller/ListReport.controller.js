sap.ui.define([
	"sap/ui/core/mvc/ControllerExtension"
], function(
	ControllerExtension
) {
	"use strict";

	return ControllerExtension.extend("sap.ui.demoapps.rta.fev4.ext.controller.ListReport", {
		override: {
			// We do not want the export to excel or copy buttons to be shown
			onInit: function () {
				this.getView().byId("sap.ui.demoapps.rta.fev4::ProductsList--fe::table::Products::LineItem").setEnableExport(false);
				this.getView().byId("sap.ui.demoapps.rta.fev4::ProductsList--fe::table::Products::LineItem").destroyCopyProvider();
			}
		}
	});
});