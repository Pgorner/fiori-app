sap.ui.define(
	["sap/ui/core/mvc/Controller", "sap/fe/navigation/NavigationHandler"],
	function (Controller, FENavigationHandler) {
		"use strict";

		return Controller.extend("Freestyle-Inbound.App.controller", {
			onInit: function () {
				var oModel = new sap.ui.model.json.JSONModel();
				var oModel2 = new sap.ui.model.json.JSONModel();
				var oModelIAppState = new sap.ui.model.json.JSONModel();
				var oComponentData = this.getOwnerComponent().getComponentData();
				var oComponent = this.getOwnerComponent();
				var oNavigationHandler;
				var that = this;
				this.sParseType =
					oComponent.getComponentData().startupParameters["ParseType"] &&
					oComponent.getComponentData().startupParameters["ParseType"][0];
				if (this.sParseType) {
					delete oComponent.getComponentData().startupParameters["ParseType"];
				}
				var oParamsData = this.createStartupParametersData((oComponentData && oComponentData.startupParameters) || {});
				oModel.setData(oParamsData);

				this.getView().setModel(oModel, "startupParameters");
				this.getView().setModel(oModel2, "AppState");
				this.getView().setModel(oModelIAppState, "IAppState");
				oNavigationHandler = new FENavigationHandler(this);
				oNavigationHandler.parseNavigation().done(function (oAppState) {
					that._parseAndSetData(oAppState, oComponentData);
				});
			},
			createStartupParametersData: function (oComponentData) {
				var aParameters = [],
					sKey = null;
				if (oComponentData) {
					for (sKey in oComponentData) {
						if (Object.prototype.hasOwnProperty.call(oComponentData, sKey)) {
							aParameters.push({
								key: sKey,
								value: oComponentData[sKey].toString()
							});
						}
					}
				}
				return {
					parameters: aParameters
				};
			},
			_parseAndSetData: function (oAppState, oComponentData) {
				var vAppStateData = oAppState.selectionVariant,
					oModelData = {
						parameters: []
					},
					oData = vAppStateData && JSON.parse(vAppStateData);

				const iAppStateData = oAppState.iAppState;
				const iAppStateKey = oAppState.nhHybridIAppStateKey;
				const modelIAppStateData = {
					iAppStateKey,
					stringiedIAppState: JSON.stringify(iAppStateData) || "no i-app state"
				};
				this.getView().getModel("IAppState").setProperty("/appstate", modelIAppStateData);

				if (this.sParseType) {
					oData.SelectOptions.pop();
					vAppStateData = JSON.stringify(oData);
				}
				oModelData.stringifiedAppstate = JSON.stringify(vAppStateData || " no app state ");
				oModelData.appStateKey = oComponentData["sap-xapp-state"];
				// array or object
				if (oAppState.selectionVariant) {
					oData.SelectOptions.forEach(function (oParam) {
						oModelData.parameters.push({
							name: oParam.PropertyName,
							value: JSON.stringify(oParam.Ranges)
						});
					});
				}
				this.getView().getModel("AppState").setProperty("/appstate", oModelData);
			}
		});
	}
);
