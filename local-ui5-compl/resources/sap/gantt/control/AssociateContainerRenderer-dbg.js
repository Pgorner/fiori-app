/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Element"], function (Element) {
	"use strict";

	var AssociateContainerRenderer = {};

	AssociateContainerRenderer.render = function(oRenderManager, oControl) {

		if (oControl.getEnableRootDiv()) {
			oRenderManager.openStart("div", oControl);
			oRenderManager.class("sapGanttChartLayoutBG");
			oRenderManager.style("width", "100%");
			oRenderManager.style("height", "100%");
			oRenderManager.style("overflow", "hidden");
			oRenderManager.openEnd();
		}
		oRenderManager.renderControl(Element.getElementById(oControl.getContent()));
		if (oControl.getEnableRootDiv()) {
			oRenderManager.close("div");
		}
	};

	return AssociateContainerRenderer;
}, /* bExport= */ true);
