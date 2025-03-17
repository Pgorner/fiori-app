/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/drawer/Drawer","sap/ui/thirdparty/d3"],function(t){"use strict";var e=t.extend("sap.gantt.drawer.TimePeriodZoomRectangle");e.prototype.drawSvg=function(t,e){t.selectAll(".sapGanttChartTimePeriodZoomRectangle").remove();t.append("rect").classed("sapGanttChartTimePeriodZoomRectangle",true).attr("x",function(){return e}).attr("y",function(){return 0}).attr("height",function(){return jQuery(t.node()).height()})};e.prototype.updateSvg=function(t,e,r){t.selectAll(".sapGanttChartTimePeriodZoomRectangle").attr("x",function(){return e}).attr("width",function(){return r-e})};e.prototype.destroySvg=function(t){t.selectAll(".sapGanttChartTimePeriodZoomRectangle").remove()};return e},true);
//# sourceMappingURL=TimePeriodZoomRectangle.js.map