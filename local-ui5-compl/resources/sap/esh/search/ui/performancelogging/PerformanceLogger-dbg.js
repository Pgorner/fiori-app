/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define([], function () {
  "use strict";

  class PerformanceLogger {
    /**
     * Performance log data
     */
    performanceLog;

    /**
     * Performance log start date
     */
    performanceLogStartDate;
    constructor() {
      this.performanceLog = [];
      this.performanceLogStartDate = new Date();
    }

    /**
     * Get a unique Id to be used to make 'method name' unique (see enterMethod/leaveMethod)
     * @returns unique ID
     */
    getUniqueId() {
      return new Date().getTime();
    }

    /**
     * start a new step of performance logging
     * @param {*} method name a log step you want to enter
     * @param {*} parameterBag additional properties to log for this step
     */
    // eslint-disable-next-line no-unused-vars
    enterMethod(method, parameterBag) {
      this.performanceLog.push({
        step: method.name,
        parameterBag: parameterBag,
        startDate: new Date(),
        endDate: null,
        time: null
      });
    }

    /**
     * complete an open step of performance logging
     * @param {*} method name of log step to leave
     */
    // eslint-disable-next-line no-unused-vars
    leaveMethod(method) {
      for (const logEntry of this.performanceLog) {
        if (logEntry.step === method.name) {
          logEntry.endDate = new Date();
          logEntry.time = logEntry.endDate.getTime() - logEntry.startDate.getTime();
        }
      }
    }

    // eslint-disable-next-line no-unused-vars
    printLogToBrowserConsole() {
      console.table(this.getLogSummary());
    }

    // eslint-disable-next-line no-unused-vars
    getLogSummary() {
      return this.performanceLog.map(logEntry => {
        return {
          step: logEntry.step,
          secFromStart: Math.round((logEntry.startDate.getTime() - this.performanceLogStartDate.getTime()) / 100) / 10,
          msecTotal: logEntry.time,
          comments: logEntry.parameterBag && logEntry.parameterBag.comments ? logEntry.parameterBag.comments : "-"
        };
      });
    }
    clearPerformanceLog() {
      this.performanceLogStartDate = new Date();
      this.performanceLog = [];
    }
  }
  return PerformanceLogger;
});
})();