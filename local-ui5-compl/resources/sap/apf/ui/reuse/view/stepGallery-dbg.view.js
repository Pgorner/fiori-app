/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([
	"sap/ui/core/mvc/View"
], function(View) {
	"use strict";
	/**
	 * Holds the available steps of configuration and displays them on overlay container.
	 * @class Step gallery view
	 * @name sap.apf.ui.reuse.view.stepGallery
	 */
	return View.extend("sap.apf.ui.reuse.view.stepGallery", /** @lends sap.apf.ui.reuse.view.stepGallery.prototype */ {
		getControllerName : function() {
			return "sap.apf.ui.reuse.controller.stepGallery";
		},
		createContent : function(oController) {
			this.oController = oController;
		}
	});
});