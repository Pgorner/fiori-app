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
  class RemovePureAdvancedSearchFacetsFormatter extends Formatter {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    initAsync() {
      return Promise.resolve();
    }
    format(resultSet) {
      return util.removePureAdvancedSearchFacets(resultSet);
    }
    formatAsync(resultSet) {
      resultSet = util.removePureAdvancedSearchFacets(resultSet); //find emails phone nrs etc and augment attribute if required
      return Promise.resolve(resultSet);
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.RemovePureAdvancedSearchFacetsFormatter = RemovePureAdvancedSearchFacetsFormatter;
  return __exports;
});
})();