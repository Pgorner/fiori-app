/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Element","sap/gantt/misc/Format"],function(t,e){"use strict";var i=t.extend("sap.gantt.config.TimeHorizon",{metadata:{library:"sap.gantt",properties:{startTime:{type:"string",group:"Misc",defaultValue:undefined},endTime:{type:"string",group:"Misc",defaultValue:undefined}},designtime:"sap/ui/dt/designtime/notAdaptable.designtime"}});i.prototype.setStartTime=function(t,e){this._allowGanttInitialRender();return this.setProperty("startTime",this._convertTimestamp(t),e)};i.prototype.setEndTime=function(t,e){this._allowGanttInitialRender();return this.setProperty("endTime",this._convertTimestamp(t),e)};i.prototype.equals=function(t){return this.getStartTime()===t.getStartTime()&&this.getEndTime()===t.getEndTime()};i.prototype._allowGanttInitialRender=function(){var t=this.getParent();if(t&&typeof t.getParent==="function"){var e=t.getParent();if(e&&e.isA("sap.gantt.simple.GanttChartWithTable")){delete e._bPreventInitialRender}}};i.prototype._convertTimestamp=function(t){var i=t;if(i&&typeof i==="object"){i=e.dateToAbapTimestamp(i)}return i};return i},true);
//# sourceMappingURL=TimeHorizon.js.map