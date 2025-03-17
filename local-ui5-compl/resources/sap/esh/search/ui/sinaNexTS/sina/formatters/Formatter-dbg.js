/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([], function () {
  "use strict";

  /**
   * A Formatter allows as sina developer to format a resultset (searchresultset, suggestionresultset) or
   * to format datasource metadata through a special object which has a format()/formatAsync() method.
   * This allows to change visible result data before it is displayed in the search UI.
   */
  class Formatter {
    constructor() {}

    /**
     *
     * @deprecated use formatAsync() instead
     */
  }
  class ChartResultSetFormatter extends Formatter {}
  var __exports = {
    __esModule: true
  };
  __exports.Formatter = Formatter;
  __exports.ChartResultSetFormatter = ChartResultSetFormatter;
  return __exports;
});
})();