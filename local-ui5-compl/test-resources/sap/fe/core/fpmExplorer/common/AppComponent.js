sap.ui.define(
	["sap/fe/core/AppComponent", "sap/ui/core/Component", "sap/ui/model/odata/v4/ODataModel", "sap/ui/fl/api/FlexTestAPI"],
	function (AppComponent, Component, ODataModel, FlexTestAPI) {
		"use strict";

		return AppComponent.extend("sap.fe.core.fpmExplorer.common.AppComponent", {
			init: function () {
				window.mainComponent = this;
				AppComponent.prototype.init.apply(this, arguments);
				this.getModel("ui").setDefaultBindingMode("TwoWay");
				if (window.parent) {
					window.parent.postMessage("applyAppSettings");
				}
			},
			refresh: function (shouldKeepMock) {
				const appId = this.getManifestEntry("sap.app").id;
				// Reset the flex changes
				FlexTestAPI.reset();
				if (!shouldKeepMock) {
					window.reloadMock();
				}

				this.reloadPromise = new Promise((resolve) => {
					this.fnResolve = resolve;
				});
				if (shouldKeepMock) {
					this.reloadPages();
				}
				return this.reloadPromise;
			},
			reloadPages: function () {
				var oManifestDataSources = this._getManifestEntry("/sap.app/dataSources", true) || {};
				var oManifestModels = this._getManifestEntry("/sap.ui5/models", true) || {};
				for (var sManifestName in oManifestModels) {
					if (!oManifestModels[sManifestName].type) {
						oManifestModels[sManifestName].type = "sap.ui.model.odata.v4.ODataModel";
					}
				}
				var mAllModelConfigurations = Component._createManifestModelConfigurations({
					models: oManifestModels,
					dataSources: oManifestDataSources,
					component: this,
					mergeParent: true,
					cacheTokens: {},
					activeTerminologies: undefined
				});

				this.setModel(new ODataModel(mAllModelConfigurations[""].settings[0]));

				this.getModel()
					.oMetaModel.fetchEntityContainer()
					.then(() => {
						this.fnResolve();
					});
			},
			onServicesStarted: function () {
				AppComponent.prototype.onServicesStarted.apply(this, arguments);
				if (window.parent) {
					window.parent.postMessage("sampleLoaded");
				}
			}
		});
	}
);
