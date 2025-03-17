/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define([],function(){"use strict";class e{performanceLog;performanceLogStartDate;constructor(){this.performanceLog=[];this.performanceLogStartDate=new Date}getUniqueId(){return(new Date).getTime()}enterMethod(e,t){this.performanceLog.push({step:e.name,parameterBag:t,startDate:new Date,endDate:null,time:null})}leaveMethod(e){for(const t of this.performanceLog){if(t.step===e.name){t.endDate=new Date;t.time=t.endDate.getTime()-t.startDate.getTime()}}}printLogToBrowserConsole(){console.table(this.getLogSummary())}getLogSummary(){return this.performanceLog.map(e=>({step:e.step,secFromStart:Math.round((e.startDate.getTime()-this.performanceLogStartDate.getTime())/100)/10,msecTotal:e.time,comments:e.parameterBag&&e.parameterBag.comments?e.parameterBag.comments:"-"}))}clearPerformanceLog(){this.performanceLogStartDate=new Date;this.performanceLog=[]}}return e})})();
//# sourceMappingURL=PerformanceLogger.js.map