/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["../DefBase","sap/gantt/misc/Format","sap/gantt/utils/GanttChartConfigurationUtils"],function(t,e,i){"use strict";var a=t.extend("sap.gantt.def.cal.TimeInterval",{metadata:{library:"sap.gantt",properties:{startTime:{type:"string",group:"Misc",defaultValue:null},endTime:{type:"string",group:"Misc",defaultValue:null}}}});a.prototype.setStartTime=function(t){this.setProperty("startTime",this._convertTimestamp(t));return this};a.prototype.setEndTime=function(t){this.setProperty("endTime",this._convertTimestamp(t));return this};a.prototype._convertTimestamp=function(t){var i=t;if(i&&typeof i==="object"){i=e.dateToAbapTimestamp(i)}return i};a.prototype.getDefNode=function(){var t=this.getParent()&&this.getParent().getParent()&&this.getParent().getParent().getParent()?this.getParent().getParent().getParent().getAxisTime():null;var a;var r;if(t){if(i.getRTL()===true){a=t.timeToView(e.abapTimestampToDate(this.getEndTime()));r=t.timeToView(e.abapTimestampToDate(this.getStartTime()))-a}else{a=t.timeToView(e.abapTimestampToDate(this.getStartTime()));r=t.timeToView(e.abapTimestampToDate(this.getEndTime()))-a}}return{x:a,y:0,width:r}};return a},true);
//# sourceMappingURL=TimeInterval.js.map