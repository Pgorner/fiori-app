/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define([], function () {
  "use strict";

  // =======================================================================
  // decorator for sequentialized execution
  // =======================================================================
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  function sequentializedExecution(originalFunction) {
    let chainedPromise;
    return function (...args) {
      if (!chainedPromise) {
        chainedPromise = originalFunction.apply(this, args);
      } else {
        chainedPromise = chainedPromise.then(() => {
          return originalFunction.apply(this, args);
        }, () => {
          return originalFunction.apply(this, args);
        });
      }
      const promise = chainedPromise;
      promise.finally(() => {
        if (promise === chainedPromise) {
          chainedPromise = null;
        }
      }).catch(() => {
        //dummy
      });
      return chainedPromise;
    };
  }
  var __exports = {
    __esModule: true
  };
  __exports.sequentializedExecution = sequentializedExecution;
  return __exports;
});
})();