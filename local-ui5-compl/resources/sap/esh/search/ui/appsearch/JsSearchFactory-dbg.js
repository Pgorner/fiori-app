/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/esh/search/ui/appsearch/JsSearch"], function (JsSearch) {
  "use strict";

  const jsSearchFactory = {
    createJsSearch: function (options) {
      return new JsSearch(options);
    }
  };
  return jsSearchFactory;
});
})();