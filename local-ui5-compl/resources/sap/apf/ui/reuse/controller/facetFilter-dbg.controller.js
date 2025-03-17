/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
sap.ui.define([
	"sap/apf/ui/utils/facetFilterListHandler",
	"sap/m/FacetFilter",
	"sap/ui/Device",
	"sap/ui/core/mvc/Controller"
], function(
	FacetFilterListHandler,
	FacetFilter,
	Device,
	Controller
) {
	"use strict";
	/**
	 * Creates the FacetFilterLists together with a ListHandler for each one configured FacetFilter
	 * @private
	 * @name sap.apf.ui.reuse.controller.facetFilter~_createFilterLists
	 * @param {sap.apf.ui.reuse.controller.facetFilter} oController The facet filter controller context
	 */
	function _createFilterLists(oController) {
		oController.getView().byId("idAPFFacetFilter").removeAllLists();
		var oViewData = oController.getView().getViewData();
		var aConfiguredFilters = oViewData.aConfiguredFilters;
		aConfiguredFilters.forEach(function(oConfiguredFilter) {
			var oFacetFilterListHandler = new FacetFilterListHandler(oViewData.oCoreApi, oViewData.oUiApi, oConfiguredFilter);
			oController.getView().byId("idAPFFacetFilter").addList(oFacetFilterListHandler.createFacetFilterList());
		});
	}
	/**
	 * @class
	 * @name sap.apf.ui.reuse.controller.facetFilter
	 */
	return Controller.extend("sap.apf.ui.reuse.controller.facetFilter", /** @lends sap.apf.ui.reuse.controller.facetFilter.protoype */ {
		/**
		 * Called on initialization of the view
		 * Instantiates all facet filter list handlers
		 * Populates and selects the filter values
		 * @public
		 */
		onInit : function() {
			var oController = this;
			if (Device.system.desktop) {
				oController.getView().addStyleClass("sapUiSizeCompact");
			}
			_createFilterLists(oController);
		},
		/**
		 * Reset to the initial filter values for all the facet filter list controls
		 * @public
		 */
		onResetPress : function() {
			var oController = this;
			oController.getView().getViewData().oStartFilterHandler.resetVisibleStartFilters();
			//Trigger selection changed to update path
			oController.getView().getViewData().oUiApi.selectionChanged(true);
		}
	});
});