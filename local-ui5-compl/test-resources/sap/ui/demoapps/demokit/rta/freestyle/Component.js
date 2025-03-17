sap.ui.define([
	"sap/ui/core/UIComponent",
	"./controller/Application",
	"sap/ui/model/odata/v2/ODataModel",
	"./localService/mockserver",
	"sap/ui/model/json/JSONModel",
	"./util/SmartLink",
	'sap/ui/fl/Utils'
], function(
	UIComponent,
	Application,
	ODataModel,
	mockserver,
	JSONModel,
	SmartLink,
	Utils
) {
	"use strict";

	return UIComponent.extend("sap.ui.demoapps.rta.freestyle.Component", {

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
			SmartLink.mockUShellServices();
			UIComponent.prototype.constructor.apply(this, arguments);
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			this._assignMainService();
			this._createODataModel();
			// add custom "Adapt UI" button if application is running as a standalone app
			this._adaptButtonConfiguration();

			// call the base component's init function and start the application
			UIComponent.prototype.init.apply(this, arguments);

			this.oApplicationController = new Application();
			this.oApplicationController.init(this);
		},

		/**
		 * The component is destroyed by UI5 automatically.
		 * In this method, the ApplicationControlled is destroyed.
		 * @public
		 * @override
		 */
		destroy: function() {
			this.oApplicationController.destroy();
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		},

		/**
		 * Start the MockServer
		 * @private
		 */
		_startMockServer: function () {
			mockserver.init(this.getManifest());
		},

		/**
		 * Adapt the visibility of the "Adapt UI" button
		 * @private
		 */
		_adaptButtonConfiguration: function () {
			this.setModel(new JSONModel({
				showAdaptButton: !Utils.getUshellContainer()
			}), "app");
		},

		/**
		 * Read the mainService configuration from the app descriptor
		 * @private
		 */
		_assignMainService: function () {
			const oAppEntry = this.getManifest()["sap.app"];

			if (oAppEntry.dataSources.mainService) {
				this._oMainService = oAppEntry.dataSources.mainService;
			} else {
				this._oMainService = undefined;
			}
		},

		/**
		 * Create the ODataModel for the app
		 * @private
		 */
		_createODataModel: function () {
			if (this._oMainService.uri) {
				var oModel = new ODataModel(this._oMainService.uri, {
					"settings": {
						"metadataUrlParams": {
							"sap-documentation": "heading"
						}
					}
				});
				oModel.setDefaultBindingMode("TwoWay");
				this.setModel(oModel);
			}
		}
	});
});
