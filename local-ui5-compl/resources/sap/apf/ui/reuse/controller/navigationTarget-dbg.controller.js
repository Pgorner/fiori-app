/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
sap.ui.define([
	"sap/ui/Device",
	"sap/ui/core/mvc/Controller"
], function(Device, Controller) {
	"use strict";

	/**
	 * @class Controller for view.navigationTarget
	 * @name sap.apf.ui.reuse.controllernavigationTarget
	 */
	return Controller.extend("sap.apf.ui.reuse.controller.navigationTarget", /** @lends sap.apf.ui.reuse.controllernavigationTarget.prototype */ {
		onInit : function() {
			this.oNavigationHandler = this.getView().getViewData().oNavigationHandler;
			if (Device.system.desktop) {
				this.getView().addStyleClass("sapUiSizeCompact");
			}
		},
		/**
		 * Launches the APF Core API for navigating externally to another application.
		 *
		 * @param {any} selectedNavTarget selected Navigation Target 
		 */
		handleNavigation : function(selectedNavTarget) {
			this.oNavigationHandler.navigateToApp(selectedNavTarget);
		}
	});
});
