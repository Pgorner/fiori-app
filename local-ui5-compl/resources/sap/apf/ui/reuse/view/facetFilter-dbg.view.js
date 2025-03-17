/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
*/
sap.ui.define([
	"sap/m/FacetFilter",
	"sap/ui/Device",
	"sap/ui/core/mvc/View"
], function(FacetFilter, Device, View) {
	'use strict';

	/**
	 * Creates the facet filter.
	 * @class FacetFilter view
	 * @name sap.apf.ui.reuse.view.facetFilter
	 */
	return View.extend("sap.apf.ui.reuse.view.facetFilter", /** @lends sap.apf.ui.reuse.view.facetFilter.prototype */ {
		getControllerName : function() {
			return "sap.apf.ui.reuse.controller.facetFilter";
		},
		createContent : function(oController) {
			var oFacetFilter = new FacetFilter(oController.createId("idAPFFacetFilter"), {
				type : "Simple",
				showReset : true,
				mode: "MultiSelect",
				showPopoverOKButton : true,
				reset : oController.onResetPress.bind(oController)
			}).addStyleClass('facetFilterInitialAlign');
			if (Device.system.desktop) {
				oFacetFilter.addStyleClass("facetfilter");
			}
			return oFacetFilter;
		}
	});
});
