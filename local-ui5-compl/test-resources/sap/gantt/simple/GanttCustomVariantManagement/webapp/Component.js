sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"gantt/demo/GanttCustomVariantManagement/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("gantt.demo.GanttCustomVariantManagement.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by SAP UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// Calls the base component's init function.
			UIComponent.prototype.init.apply(this, arguments);

			// Enables routing
			this.getRouter().initialize();

			// Sets the device model.
			this.setModel(models.createDeviceModel(), "device");

			// Sets the UI model.
			this.setModel(models.createUIModel(), "ui");

			// Sets the data model.
			this.setModel(models.createDataModel(), "data");
		}
	});
});