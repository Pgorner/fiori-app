/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["./Drawer","sap/ui/thirdparty/d3"],function(t){"use strict";var e=t.extend("sap.gantt.drawer.VerticalLine",{constructor:function(t){this.oAxisTime=t}});e.prototype.drawSvg=function(t){var e=jQuery(t.node()),r=e.width(),a=Math.max.apply(null,e.map(function(){return jQuery(this).height()}).get());var i=this.oAxisTime.getZoomStrategy();var n=this.oAxisTime.getTickTimeIntervalLabel(i.getTimeLineOption(),null,[0,r]);var s=n[1];var l="";for(var o=0;o<s.length;o++){l+=" M"+" "+(s[o].value-1/2)+" 0"+" L"+" "+(s[o].value-1/2)+" "+a}if(l){t.selectAll(".sapGanttChartVerticalLine").remove();t.insert("g",":first-child").classed("sapGanttChartVerticalLine",true).append("path").attr("d",l)}};e.prototype.destroySvg=function(t){if(t){t.selectAll(".sapGanttChartVerticalLine").remove()}};return e},true);
//# sourceMappingURL=VerticalLine.js.map