/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define([], function () {
  "use strict";

  class TimeMerger {
    static counter = 0;
    aborted = false;
    pending;
    returned = [];
    counter;
    processorCallback;
    processorNotificationSchedule;
    constructor(promiseList = [], timeDelay = 1000) {
      this.promiseList = promiseList;
      this.timeDelay = timeDelay;
      this.pending = this.promiseList.length;
      this.counter = ++TimeMerger.counter;
    }
    abort() {
      this.aborted = true;
    }
    process(processorCallback) {
      this.processorCallback = processorCallback;
      this.start();
      return this;
    }
    start() {
      // register done callback for all promises
      for (let i = 0; i < this.promiseList.length; ++i) {
        const promise = this.promiseList[i];
        promise.then(this.assembleDoneCallback(), this.assembleErrorCallback());
      }
      // schedule time delayed merging of promise results
      this.scheduleProcessorNotification();
    }
    scheduleProcessorNotification() {
      if (this.processorNotificationSchedule) {
        window.clearTimeout(this.processorNotificationSchedule);
        this.processorNotificationSchedule = null;
      }
      this.processorNotificationSchedule = window.setTimeout(() => {
        this.notifyProcessor();
      }, this.timeDelay);
    }
    notifyProcessor() {
      //console.log('--notify');
      // check for abortion
      if (this.aborted) {
        return;
      }
      // notify callback if promises have returned
      if (this.returned.length > 0) {
        this.processorCallback(this.returned);
        this.returned = [];
      }
      // check if we need to schedule a new merge
      if (this.pending > 0) {
        this.scheduleProcessorNotification();
      }
    }
    assembleDoneCallback() {
      return result => {
        this.pending--;
        this.returned.push(result);
        if (this.pending === 0) {
          if (this.processorNotificationSchedule) {
            window.clearTimeout(this.processorNotificationSchedule);
            this.processorNotificationSchedule = null;
          }
          this.notifyProcessor();
        }
      };
    }
    assembleErrorCallback() {
      return error => {
        this.pending--;
        this.returned.push(error);
        if (this.pending === 0) {
          if (this.processorNotificationSchedule) {
            window.clearTimeout(this.processorNotificationSchedule);
            this.processorNotificationSchedule = null;
          }
          this.notifyProcessor();
        }
      };
    }
  }
  return TimeMerger;
});
})();