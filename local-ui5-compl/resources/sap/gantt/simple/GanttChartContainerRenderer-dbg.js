/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([], function () {
	"use strict";

	/**
	 * Gantt Chart Container renderer.
	 *
	 * @namespace
	 */
	var GanttChartContainerRenderer = {
		apiVersion: 2    // enable in-place DOM patching
	};

	GanttChartContainerRenderer.render = function (oRm, oContainer) {
		if (oContainer.getGanttCharts() && oContainer.getGanttCharts().length > 0) {
			oContainer.getGanttCharts().forEach(function(oGanttChart){
				if (oGanttChart._bPreventInitialRender) {
					delete oGanttChart._bPreventInitialRender; // might need to jump to visible horizon before rendering
				}
			});
		}

		const bShowSearchSidePanel = oContainer.getShowSearchSidePanel();
		const oLayoutSidePanel = oContainer.getSidePanel();
		const bShowLayoutSidePanel = oLayoutSidePanel && oLayoutSidePanel.getVisible();

		oRm.openStart("div", oContainer);
		oRm.class("sapGanttContainer");

		if (bShowSearchSidePanel || bShowLayoutSidePanel) {
			oRm.class("sapGanttContainerWithSidePanel");
		}

		oRm.style("width", oContainer.getWidth());
		oRm.style("height", oContainer.getHeight());
		oRm.openEnd();

		//Render The SVGDefs within the main GanttChartWithTable SVG
		this.renderSvgDefs(oRm, oContainer);

		this.renderToolbar(oRm, oContainer);

		this.renderGanttCharts(oRm, oContainer, {
			hasSidePanel: bShowSearchSidePanel || bShowLayoutSidePanel
		});

		if (bShowSearchSidePanel) {
			this.renderSidePanel(oRm, oContainer, {
				id: "ganttSearchSidePanel",
				sidePanel: oContainer.getSearchSidePanel(),
				classNames: "sapUiGanttSearchSidePanel"
			});
		} else if (bShowLayoutSidePanel) {
			this.renderSidePanel(oRm, oContainer, {
				id: "ganttLayoutSidePanel",
				sidePanel: oLayoutSidePanel,
				classNames: "sapUiGanttLayoutSidePanel"
			});
		}

		if (oContainer.getEnableStatusBar()) {
			this.renderStatusBar(oRm, oContainer);
		}
		oRm.close("div");
	};

	GanttChartContainerRenderer.renderSvgDefs = function (oRm, oContainer) {
		var oSvgDefs = oContainer.getSvgDefs();
		if (oSvgDefs) {
			oRm.openStart("svg", oContainer.getId() + "-svg-psdef");
			oRm.attr("aria-hidden", "true");
			oRm.attr("tabindex", -1);
			oRm.attr("focusable", false);
			oRm.class("sapGanttInvisiblePaintServer");
			oRm.openEnd();
			oRm.unsafeHtml(oSvgDefs.getDefString());
			oRm.close("svg");
		}
	};

	GanttChartContainerRenderer.renderToolbar = function (oRm, oContainer) {
		var oToolbar = oContainer.getToolbar();
		if (oToolbar) {
			oRm.openStart("div");
			oRm.class("sapGanttContainerTbl");
			oRm.openEnd();
			oRm.renderControl(oToolbar);
			oRm.close("div");
		}
	};
	GanttChartContainerRenderer.renderStatusBar = function (oRm, oContainer) {
		var oStatusBar = oContainer.getStatusBar();
		if (oStatusBar) {
			oRm.openStart("div");
			oRm.class("sapGanttContainerStatusBar");
			oRm.openEnd();
			oRm.renderControl(oStatusBar);
			oRm.close("div");
		}
	};

	GanttChartContainerRenderer.renderGanttCharts = function (oRm, oContainer, oOptions) {
		oRm.openStart("div", oContainer.getId() + "-ganttContainerContent");
		if (oContainer.getEnableStatusBar()) {
			oRm.class("sapGanttContainerCntWithStatusBar");
		} else {
			oRm.class("sapGanttContainerCnt");
		}
		if (oOptions.hasSidePanel) {
			oRm.class("sapGanttContainerCntWithSidePanel");
		}
		oRm.openEnd();
		oRm.renderControl(oContainer._oSplitter);
		oRm.close("div");
	};

	GanttChartContainerRenderer.renderSidePanel = function (oRm, oContainer, oOptions) {
		if (oOptions.sidePanel) {
			oRm.openStart("div", oContainer.getId() + "-" + oOptions.id);
			oRm.class(oOptions.classNames);
			oRm.openEnd();
			oRm.renderControl(oOptions.sidePanel);
			oRm.close("div");
		}
	};

	return GanttChartContainerRenderer;

}, /* bExport= */ true);
