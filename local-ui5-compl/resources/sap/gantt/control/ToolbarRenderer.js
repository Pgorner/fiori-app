/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";var t={};t.render=function(t,r){var e=r.getAllToolbarItems().length;t.write("<div");t.writeControlData(r);t.addClass("sapGanttToolbar");if(e==0){t.addClass("sapGanttSkipToolbar")}t.writeClasses();t.write(">");t.renderControl(r.getAggregation("_toolbar"));t.write("</div>")};return t},true);
//# sourceMappingURL=ToolbarRenderer.js.map