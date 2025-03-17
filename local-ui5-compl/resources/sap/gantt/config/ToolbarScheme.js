/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Element"],function(e){"use strict";var t=e.extend("sap.gantt.config.ToolbarScheme",{metadata:{library:"sap.gantt",properties:{key:{type:"string",defaultValue:null},sourceSelect:{type:"object",defaultValue:null},birdEye:{type:"object",defaultValue:null},layout:{type:"object",defaultValue:null},customToolbarItems:{type:"object",defaultValue:null},expandChart:{type:"object",defaultValue:null},expandTree:{type:"object",defaultValue:null},timeZoom:{type:"object",defaultValue:null},legend:{type:"object",defaultValue:null},settings:{type:"object",defaultValue:null},mode:{type:"object",defaultValue:null},toolbarDesign:{type:"string",defaultValue:sap.m.ToolbarDesign.Auto}}}});t.prototype.setTimeZoom=function(e){var t=e;if(!(t instanceof sap.gantt.config.TimeZoomGroup)){t=new sap.gantt.config.TimeZoomGroup;t.setOverflowPriority(e.getOverflowPriority());t.setPosition(e.getPosition())}this.setProperty("timeZoom",t);return this};return t},true);
//# sourceMappingURL=ToolbarScheme.js.map