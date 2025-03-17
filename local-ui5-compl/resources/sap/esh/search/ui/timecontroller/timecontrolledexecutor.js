/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["./requestexecutor"],function(e){"use strict";const t=e["RequestExecutor"];const r=e["RequestExecutorStatus"];function s(){return new Error("Too many requests")}class u{requestExecutor;outdatedLimit;createTooManyRequestsError;constructor(e){this.outdatedLimit=e.outdatedTimeLimit;this.createTooManyRequestsError=e.createTooManyRequestsError??s}createNewRequest(e){if(this.requestExecutor){this.requestExecutor.delete()}this.requestExecutor=new t(e);const r=this.requestExecutor.createResponseListener();this.requestExecutor.execute();return r}reuseOldRequest(){this.requestExecutor.clearResponseListeners();return this.requestExecutor.createResponseListener()}denyRequest(e){this.requestExecutor.clearResponseListeners();return Promise.reject(this.createTooManyRequestsError(e))}execute(e){if(!this.requestExecutor){return this.createNewRequest(e)}const t=(new Date).getTime()-this.requestExecutor.time;if(this.requestExecutor.status===r.PENDING){if(this.requestExecutor.getRequest().equals(e)){if(t<=this.outdatedLimit){return this.reuseOldRequest()}return this.createNewRequest(e)}else{return this.createNewRequest(e)}}else{return this.createNewRequest(e)}}}var o={__esModule:true};o.TimeControlledExecutor=u;return o})})();
//# sourceMappingURL=timecontrolledexecutor.js.map