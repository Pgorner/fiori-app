/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([
	"sap/ui/core/mvc/View"
], function(View) {
	'use strict';

	/**
	 * @class messageHandler view
	 * @name sap.apf.ui.reuse.view.messageHandler
	 */
	return View.extend("sap.apf.ui.reuse.view.messageHandler", /** @lends sap.apf.ui.reuse.view.messageHandler.prototype */ {
		getControllerName : function() {
			return "sap.apf.ui.reuse.controller.messageHandler";
		},
		createContent : function() {
		}
	});
});