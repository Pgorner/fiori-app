/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
*/
sap.ui.define([
	'sap/ui/comp/state/UIState',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/odata/ODataUtils',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/model/odata/CountMode'
		], function(UIState, BaseController, ODataUtils, ODataModel, CountMode) {
			'use strict'; 

	/**
	 * @class Controller for smartFilterBar view
y	 * @name sap.apf.ui.reuse.controller.smartFilterBar
	 */
	return BaseController.extend("sap.apf.ui.reuse.controller.smartFilterBar", /** @lends sap.apf.ui.reuse.controller.smartFilterBar.prototype */ {
		/**
		 * Called on initialization of the view.
		 * @public
		 */
		onInit : function() {
			var oController = this;
			var sServiceForSFB = oController.getView().getViewData().oSmartFilterBarConfiguration.service;
			var annotationUris = oController.getView().getViewData().oCoreApi.getAnnotationsForService(sServiceForSFB);
			var parameterSet = {
				annotationURI : annotationUris,
				json : true
			};
			if (annotationUris && annotationUris.length > 0) {
				parameterSet.loadAnnotationsJoined = true;
			}
			var sapSystem = oController.getView().getViewData().oCoreApi.getStartParameterFacade().getSapSystem();
			if (sapSystem) {
				sServiceForSFB = ODataUtils.setOrigin(sServiceForSFB, { force : true, alias : sapSystem});
			}
			var oModel = new ODataModel(sServiceForSFB, parameterSet);
			oModel.getMetaModel().loaded().then(function(){
				oController.getView().getViewData().oCoreApi.getMetadata(sServiceForSFB).done(function(metadata){
					if(metadata.getAllEntitySetsExceptParameterEntitySets().indexOf(oController.getView().getViewData().oSmartFilterBarConfiguration.entitySet) < 0 ){
						oController.getView().getViewData().oCoreApi.putMessage(oController.getView().getViewData().oCoreApi.createMessageObject({
							code: "5053",
							aParameters: [oController.getView().getViewData().oSmartFilterBarConfiguration.entitySet, sServiceForSFB]}));
					}
					oModel.setDefaultCountMode(CountMode.None);
					oController.byId("idAPFSmartFilterBar").setModel(oModel);
				});
			});
			oModel.attachMetadataFailed(function(){
				oController.getView().getViewData().oCoreApi.putMessage(oController.getView().getViewData().oCoreApi.createMessageObject({
					code: "5052",
					aParameters: [sServiceForSFB]}));
			});
		},

		/**
		 * Called on initialize event of the Smart Filter Bar.
		 *
		 * @public
		 */
		afterInitialization: function(){
			this.handleSplitterSize();
			this.setFilterData();
			this.validateFilters();
			this.registerSFBInstanceWithCore();
		},

		/**
		 * Registers the sfb instance in the core, so the startup can continue.
		 *
		 * @public
		 */
		registerSFBInstanceWithCore : function() {
			var oController = this;
			oController.getView().getViewData().oCoreApi.registerSmartFilterBarInstance(oController.byId("idAPFSmartFilterBar"));
		},

		/**
		 * Called on search event(press of Go Button) of the Smart Filter Bar.
		 *
		 * @public
		 */
		handlePressOfGoButton : function() {
			var oController = this;
			var oSmartFilterBar = this.byId("idAPFSmartFilterBar");
			if(!oSmartFilterBar._apfOpenPath && oController.getView().getViewData().oCoreApi.getActiveStep()){
				oController.getView().getViewData().oUiApi.selectionChanged(true);
			}
			delete oSmartFilterBar._apfOpenPath;
		},

		/**
		 * Checks if the navigation filter does not pass default variant key.
		 *
		 * @public
		 */
		setFilterData: function(){
			var oController = this;
			var oSmartFilterBar = this.byId("idAPFSmartFilterBar");
			var navApfExists = oController.getView().getViewData().oCoreApi.getStartParameterFacade().getAnalyticalConfigurationId();
			var navXappExists = oController.getView().getViewData().oCoreApi.getStartParameterFacade().getXappStateId();
			var oUistate = oSmartFilterBar.getUiState();
			var mproperties = oSmartFilterBar.mProperties;
			oSmartFilterBar.setUiState(oUistate,mproperties);
			//oSmartFilterBar.setFilterData();
			if ((navApfExists !== undefined) || ((navXappExists !== null) && (navXappExists !== undefined))) {
				var oInstance = oController.getView().getViewData().oCoreApi;
				var oComponent = oInstance.getComponent();
				const UshellContainer = sap.ui.require("sap/ushell/Container");
				if (UshellContainer !== undefined) {
					var oCrossAppNavService = UshellContainer.getService("CrossApplicationNavigation");
					//and sAppKey representing the value of sap.
					var oStartupPromise = oCrossAppNavService.getStartupAppState(oComponent);
					oStartupPromise.done(function(oAppData){
						//Set the filter values. 'true' ensures that existing filters are overwritten
						var oAppStateData = oAppData.getData();
						if (oAppStateData) {
							oAppStateData = JSON.parse(JSON.stringify(oAppStateData));
							var oSelectionVariant = oAppStateData.selectionVariant;
							var oUiState = new UIState({
								selectionVariant : oSelectionVariant
							});
							var oSmartFilterBar = this.byId("idAPFSmartFilterBar");
							oSmartFilterBar.setUiState(oUiState, {
								replace: true,
								strictMode: false
							});
							var defaultKey = oSmartFilterBar.getVariantManagement().STANDARDVARIANTKEY;
							oSmartFilterBar.getVariantManagement().setCurrentVariantId(defaultKey);
						}
					}.bind(this));
				}
				//var defaultKey = oSmartFilterBar.getVariantManagement().STANDARDVARIANTKEY;
				//oSmartFilterBar.getVariantManagement().setCurrentVariantId(defaultKey);
				var defaultKey = oSmartFilterBar.getVariantManagement().getDefaultVariantKey();
				oSmartFilterBar.setCurrentVariantId(defaultKey);
			} 
		},

		/**
		 * Checks if the filter bar is in a valid state (all mandatory filters are filled).
		 *
		 * @public
		 */
		validateFilters: function(){
			var oSmartFilterBar = this.byId("idAPFSmartFilterBar");
			var valid = oSmartFilterBar.validateMandatoryFields();
			this.getView().getViewData().oUiApi.getAddAnalysisStepButton().setEnabled(valid);
			this.getView().getViewData().oUiApi.getAddAnalysisStepButton().rerender();
		},

		/**
		 * Alters splitter layout height based on hide/show filter button.
		 *
		 * @public
		 */
		 handleSplitterSize: function(){
			var that = this;
			var oSmartFilterBar = this.byId("idAPFSmartFilterBar");
			var filterBtn = oSmartFilterBar.getAggregation("_searchButton");
			filterBtn.attachPress(function(){
				var oFilterBar = this.getParent();
				if (oFilterBar.getFilterBarExpanded()){
					that.getView().getViewData().oUiApi.getLayoutView().byId("idSplitterLayoutData").setSize("127px");
				} else {
					that.getView().getViewData().oUiApi.getLayoutView().byId("idSplitterLayoutData").setSize("65px");
				}
			});
		}
	});
});