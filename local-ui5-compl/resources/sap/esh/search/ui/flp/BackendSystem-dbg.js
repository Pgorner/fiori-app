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

  class BackendSystem {
    static getSystem(searchModel) {
      return searchModel.getProperty("/dataSources")[3]?.system;
    }
  }
  return BackendSystem;
});
})();