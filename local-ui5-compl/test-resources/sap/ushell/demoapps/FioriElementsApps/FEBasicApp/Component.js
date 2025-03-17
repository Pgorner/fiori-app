// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
	"sap/ui/generic/app/AppComponent",
	"sap/ushell/demo/FioriElementsApps/FEBasicApp/localService/mockserver"
], function(
	UIComponent,
	mockserver
) {
	"use strict";

	return UIComponent.extend("sap.ushell.demo.FioriElementsApps.FEBasicApp.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * Initialize MockServer & FakeLrep in constructor before model is loaded from the manifest.json
		 * @public
		 * @override
		 */
		constructor: function () {
			this._startMockServer();

			UIComponent.prototype.constructor.apply(this, arguments);
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function and start the application
			UIComponent.prototype.init.apply(this, arguments);
		},

		/**
		 * Start the MockServer
		 * @private
		 */
		_startMockServer: function () {
			mockserver.init(this.getManifestEntry.bind(this));
		}
	});
});
