/*!
 * SAP APF Analysis Path Framework 
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([
	"sap/suite/ui/commons/ChartContainer",
	"sap/suite/ui/commons/ChartContainerToolbarPlaceholder",
	"sap/m/OverflowToolbar",
	"sap/ui/Device",
	"sap/ui/core/mvc/View",
	"sap/ui/layout/VerticalLayout"
], function(ChartContainer, ChartContainerToolbarPlaceholder, OverflowToolbar, Device, View, VerticalLayout) {
	"use strict";

	/**
	 * Creates ChartContainer and add it into the layout
	 * @class Step container view
	 * @name sap.apf.ui.reuse.view.stepContainer
	 */
	return View.extend("sap.apf.ui.reuse.view.stepContainer", /** @lends sap.apf.ui.reuse.view.stepContainer.prototype */ {
		getControllerName : function() {
			return "sap.apf.ui.reuse.controller.stepContainer";
		},
		createContent : function(oController) {
			if (Device.system.desktop) {
				oController.getView().addStyleClass("sapUiSizeCompact");
			}
			var chartContainer = new ChartContainer({
				id : oController.createId("idChartContainer"),
				showFullScreen : true
			}).addStyleClass("chartContainer ChartArea");
			var toolbar = new OverflowToolbar({
				id : oController.createId("idChartContainerToolbar")
			});
			toolbar.addContent(new ChartContainerToolbarPlaceholder());
			chartContainer.setToolbar(toolbar);
			this.stepLayout = new VerticalLayout({
				id : oController.createId("idStepLayout"),
				content : [ chartContainer ],
				width : "100%"
			});
			this.stepLayout.setBusy(true);
			return this.stepLayout;
		}
	});
});
