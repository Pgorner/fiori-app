/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";var t={};t.render=function(t,e){t.write("<div");t.writeControlData(e);t.addClass("sapGanttChartLegend");t.writeClasses();t.addStyle("width",e.getWidth());t.addStyle("height","100%");t.writeStyles();t.write(">");t.renderControl(e._oNavContainer);t.write("</div>")};return t},true);
//# sourceMappingURL=LegendContainerRenderer.js.map