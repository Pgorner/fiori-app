/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([
	"sap/ui/core/mvc/View"
], function(View) {
	"use strict";

	return View.extend("sap.apf.ui.reuse.view.pathGallery", /** @lends sap.apf.ui.reuse.view.pathGallery.prototype */ {
		getControllerName : function() {
			return "sap.apf.ui.reuse.controller.pathGallery";
		},
		createContent : function(oController) {
			this.viewData = this.getViewData();
		}
	});
});