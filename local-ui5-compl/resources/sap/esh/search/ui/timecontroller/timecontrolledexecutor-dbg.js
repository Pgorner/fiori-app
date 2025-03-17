/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./requestexecutor"], function (___requestexecutor) {
  "use strict";

  const RequestExecutor = ___requestexecutor["RequestExecutor"];
  const RequestExecutorStatus = ___requestexecutor["RequestExecutorStatus"];
  function defaultCreateTooManyRequestsError() {
    return new Error("Too many requests");
  }
  class TimeControlledExecutor {
    requestExecutor;
    outdatedLimit;
    createTooManyRequestsError;
    constructor(options) {
      this.outdatedLimit = options.outdatedTimeLimit;
      this.createTooManyRequestsError = options.createTooManyRequestsError ?? defaultCreateTooManyRequestsError;
    }
    createNewRequest(request) {
      // delete old request
      if (this.requestExecutor) {
        this.requestExecutor.delete();
      }
      // create new request
      this.requestExecutor = new RequestExecutor(request);
      const promise = this.requestExecutor.createResponseListener();
      this.requestExecutor.execute();
      return promise;
    }
    reuseOldRequest() {
      // remove old promise (will never be resolved)
      this.requestExecutor.clearResponseListeners();
      // create new promise
      return this.requestExecutor.createResponseListener();
    }
    denyRequest(request) {
      // remove old promise (will never be resolved)
      this.requestExecutor.clearResponseListeners();
      // create rejected promise
      return Promise.reject(this.createTooManyRequestsError(request));
    }
    execute(request) {
      // simple case: no old request -> just create new request
      if (!this.requestExecutor) {
        return this.createNewRequest(request);
      }

      // goals
      // =====
      // - prevent request overtaking
      // - prevent two many call in a short time interval

      // input:
      // ======
      // - old request: pending or completed
      // - request: changed or not
      // - time interval between request: small or large

      // output:
      // =======
      // - new request (forget old request)
      // - reuse old request
      // - deny request (too many requests error)

      // time between old and new request
      const timeInterval = new Date().getTime() - this.requestExecutor.time;
      if (this.requestExecutor.status === RequestExecutorStatus.PENDING) {
        // 1. old request pending
        if (this.requestExecutor.getRequest().equals(request)) {
          // 1.1 request not changed
          if (timeInterval <= this.outdatedLimit) {
            // 1.1.1 reuse old request
            return this.reuseOldRequest();
          }
          // 1.1.2 create new request
          return this.createNewRequest(request);
        } else {
          // 1.2 request changed
          return this.createNewRequest(request);
        }
      } else {
        // 2. old request completed
        return this.createNewRequest(request);
      }
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.TimeControlledExecutor = TimeControlledExecutor;
  return __exports;
});
})();