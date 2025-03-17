/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([
	"sap/ui/comp/smartfilterbar/SmartFilterBar",
	"sap/ui/core/mvc/View"
], function(SmartFilterBar, View) {
	'use strict';

	/**
	 * Creates the smart filter bar.
	 * @class smartFilterBar view
	 * @name sap.apf.ui.reuse.view.smartFilterBar
	 */
	return View.extend("sap.apf.ui.reuse.view.smartFilterBar", /** @lends sap.apf.ui.reuse.view.smartFilterBar.prototype */ {
		getControllerName : function() {
			return "sap.apf.ui.reuse.controller.smartFilterBar";
		},
		createContent : function(oController) {
			var oView = this, sEntitySet, sSmartFilterBarId, sPersistencyKey, oSmartFilterBar;
			sEntitySet = oView.getViewData().oSmartFilterBarConfiguration.entitySet;
			sSmartFilterBarId = oView.getViewData().oSmartFilterBarConfiguration.id;
			sPersistencyKey = oView.getViewData().oCoreApi.getSmartFilterBarPersistenceKey(sSmartFilterBarId);
			oSmartFilterBar = new SmartFilterBar(oController.createId("idAPFSmartFilterBar"), {
				entitySet : sEntitySet,
				controlConfiguration : oView.getViewData().controlConfiguration,
				initialized : oController.afterInitialization.bind(oController),
				search : oController.handlePressOfGoButton.bind(oController),
				persistencyKey : sPersistencyKey,
				considerAnalyticalParameters : true,
				customData: {
					key: "dateFormatSettings",
					value: {"UTC":true}
				},
				useDateRangeType: true,
				liveMode: true,
				filterChange: oController.validateFilters.bind(oController)
			});
			oView.setParent(oView.getViewData().parent);
			return oSmartFilterBar;
		}
	});
});