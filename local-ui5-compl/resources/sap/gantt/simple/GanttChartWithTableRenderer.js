/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/library"],function(t){"use strict";var e={apiVersion:2};e.render=function(t,e){this.renderSplitter(t,e)};e.renderSplitter=function(e,a){e.openStart("div",a);e.style("width",a.getWidth());e.style("height",a.getHeight());e.class("sapGanttChartWithSingleTable");if(a.getDisplayType()===t.simple.GanttChartWithTableDisplayType.Chart){e.class("sapGanttChartWithTableShowOnlyChart")}else if(a.getDisplayType()===t.simple.GanttChartWithTableDisplayType.Table){e.class("sapGanttChartWithTableShowOnlyTable")}e.openEnd();var i=a.getAggregation("_splitter");i.getContentAreas()[0].getLayoutData().setSize(a.getSelectionPanelSize());i.triggerResize(true);e.renderControl(i);e.close("div")};return e},true);
//# sourceMappingURL=GanttChartWithTableRenderer.js.map