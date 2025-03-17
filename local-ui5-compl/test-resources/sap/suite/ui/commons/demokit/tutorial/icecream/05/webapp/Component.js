sap.ui.define([
	"sap/ui/core/UIComponent",
	"./model/models",
	"sap/ui/core/mvc/View"
], function (UIComponent, models, View) {
	"use strict";

	return UIComponent.extend("sap.suite.ui.commons.demokit.tutorial.icecream.05.Component", {

		metadata: {
			manifest: "json",
			interfaces: ["sap.ui.core.IAsyncContentCreation"]
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// create the views based on the url/hash
			this.getRouter().initialize();
		},
		createContent: function () {
			// create root view
			return View.create({
				viewName: "sap.suite.ui.commons.demokit.tutorial.icecream.05.view.App",
				type: "XML"
			});
		}
	});
});
