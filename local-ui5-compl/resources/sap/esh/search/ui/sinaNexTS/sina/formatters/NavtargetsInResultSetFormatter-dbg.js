/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../core/util", "./Formatter"], function (util, ___Formatter) {
  "use strict";

  const Formatter = ___Formatter["Formatter"];
  class NavtargetsInResultSetFormatter extends Formatter {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    initAsync() {
      return Promise.resolve();
    }
    format(resultSet) {
      return resultSet;
    }
    async formatAsync(resultSet) {
      resultSet = util.addPotentialNavTargets(resultSet); //find emails phone nrs etc and augment attribute if required
      return Promise.resolve(resultSet);
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.NavtargetsInResultSetFormatter = NavtargetsInResultSetFormatter;
  return __exports;
});
})();