/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/ui/core/Element",
	"sap/ui/core/mvc/Controller",
	"sap/ui/rta/api/startKeyUserAdaptation",
	"sap/ui/mdc/enums/ChartToolbarActionType"
], function(Element, Controller, startKeyUserAdaptation, ChartToolbarActionType) {
	"use strict";

	const oController = Controller.extend("sap.ui.mdc.ActionToolbarTesting.controller.App", {
		onPressRTA: function() {
			const oOwnerComponent = this.getOwnerComponent();
			startKeyUserAdaptation({
				rootControl: oOwnerComponent.getAggregation("rootControl")
			});
		},
		onInit: function() {
			const oOwnerComponent = this.getOwnerComponent();
			const oChart = Element.getElementById(oOwnerComponent.getId() + "---app--actionToolbarChart");

			oChart.setIgnoreToolbarActions([
				ChartToolbarActionType.ZoomInOut,
				ChartToolbarActionType.DrillDownUp,
				ChartToolbarActionType.Legend
			]);
		}
	});

	return oController;
});
