/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */

/**
 * @namespace Factory to access <code>ushell</code> services.
 * @name sap.ui.comp.navpopover.Factory
 * @author SAP SE
 * @version 1.132.1
 * @private
 * @since 1.36.0
 */
sap.ui.define([
	'sap/ui/comp/library',
	'sap/base/Log'
], function(CompLibrary, Log) {
	"use strict";
	var Factory = {

		getUShellContainer: function() {
			return sap.ui.require("sap/ushell/Container");
		},
		getService: function(sServiceName, bAsync) {
			if (!bAsync) {
				Log.warning("sap.ui.comp.navpopover.Factory: calling getService synchronously should not be done as it's deprecated.");
			}

			const oShellContainer = this.getUShellContainer();
			if (!oShellContainer) {
				return bAsync ? Promise.resolve(null) : null;
			}

			switch (sServiceName) {
				case "CrossApplicationNavigation":
					Log.warning("sap.ui.comp.navpopover.Factory: Service 'CrossApplicationNavigation' should not be used as it's deprecated.");
					return bAsync ? oShellContainer.getServiceAsync("CrossApplicationNavigation") : oShellContainer.getService("CrossApplicationNavigation");
				case "URLParsing":
					return bAsync ? oShellContainer.getServiceAsync("URLParsing") : oShellContainer.getService("URLParsing");
				case "Navigation":
					return bAsync ? oShellContainer.getServiceAsync("Navigation") : oShellContainer.getService("Navigation");
				default:
					return bAsync ? Promise.resolve(null) : null;
			}
		},
		getServiceAsync: function(sServiceName) {
			return this.getService(sServiceName, true);
		}
	};

	return Factory;
}, /* bExport= */true);
