/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

sap.ui.define([
	"sap/ui/base/DataType"
], function(
	DataType
) {
	"use strict";

	/**
	 * Button identifiers for {@link sap.ui.vk.DrawerToolbar}.
	 * @enum {string}
	 * @readonly
	 * @alias sap.ui.vk.DrawerToolbarButton
	 * @public
	 */
	var DrawerToolbarButton = {
		CrossSection: "VIT-Cross-Section",
		Turntable: "VIT-Turntable",
		Orbit: "VIT-Orbit",
		Pan: "VIT-Pan",
		Zoom: "VIT-Zoom",
		Show: "VIT-Show",
		Hide: "VIT-Hide",
		FitToView: "VIT-Fit-To-View",
		RectangularSelection: "VIT-Rectangular-Selection",
		PredefinedViews: "VIT-Predefined-Views",
		FullScreen: "VIT-Fullscreen",
		Measurements: "VIT-Measurements",
		MeasurementsSeparator: "VIT-Measurements-Separator",
		PMI: "VIT-PMI",
		PMISeparator: "VIT-PMI-Separator",
		ZoomIn: "VIT-Zoom-In",
		ZoomOut: "VIT-Zoom-Out",
		FitToPage: "VIT-Fit-To-Page",
		FitToWidth: "VIT-Fit-To-Width",
		PageNavigation: "VIT-Page-Navigation"
	};

	DataType.registerEnum("sap.ui.vk.DrawerToolbarButton", DrawerToolbarButton);

	return DrawerToolbarButton;
});
