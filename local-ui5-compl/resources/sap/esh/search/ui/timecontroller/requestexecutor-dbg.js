/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define([], function () {
  "use strict";

  class ResponseListener {
    requestExecutor;
    resolve;
    reject;
    promise;
    constructor(requestExecutor) {
      this.requestExecutor = requestExecutor;
      this.promise = new Promise((_resolve, _reject) => {
        this.resolve = _resolve;
        this.reject = _reject;
      });
    }
    notify() {
      if (this.requestExecutor.status !== RequestExecutorStatus.COMPLETED) {
        throw "program error";
      }
      if (!this.requestExecutor.executionResult.hasError) {
        // success
        this.resolve(this.requestExecutor.executionResult.response);
      } else {
        // error
        this.reject(this.requestExecutor.executionResult.error);
      }
    }
  }
  var RequestExecutorStatus = /*#__PURE__*/function (RequestExecutorStatus) {
    RequestExecutorStatus["INITIAL"] = "INITIAL";
    RequestExecutorStatus["PENDING"] = "PENDING";
    RequestExecutorStatus["COMPLETED"] = "COMPLETED";
    return RequestExecutorStatus;
  }(RequestExecutorStatus || {}); // may be successful or with errors
  class RequestExecutor {
    request;
    copiedRequest;
    time;
    status = (() => RequestExecutorStatus.INITIAL)();
    executionResult;
    responseListeners = [];
    constructor(request) {
      this.request = request;
      this.copiedRequest = request.clone();
    }
    getRequest() {
      return this.copiedRequest;
    }
    delete() {
      this.clearResponseListeners();
    }
    createResponseListener() {
      const responseListener = new ResponseListener(this);
      if (this.status === RequestExecutorStatus.COMPLETED) {
        responseListener.notify();
      } else {
        this.responseListeners.push(responseListener);
      }
      return responseListener.promise;
    }
    clearResponseListeners() {
      this.responseListeners = [];
    }
    execute() {
      this.time = new Date().getTime();
      this.status = RequestExecutorStatus.PENDING;
      if (this.executionResult) {
        throw "program error";
      }
      this.request.execute().then(response => {
        // success
        this.status = RequestExecutorStatus.COMPLETED;
        this.executionResult = {
          hasError: false,
          response: response
        };
        this.notifyResponseListeners();
      }, error => {
        // error
        this.status = RequestExecutorStatus.COMPLETED;
        this.executionResult = {
          hasError: true,
          error: error
        };
        this.notifyResponseListeners();
      });
    }
    notifyResponseListeners() {
      for (const responseListener of this.responseListeners) {
        responseListener.notify();
      }
      this.clearResponseListeners();
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.RequestExecutorStatus = RequestExecutorStatus;
  __exports.RequestExecutor = RequestExecutor;
  return __exports;
});
})();