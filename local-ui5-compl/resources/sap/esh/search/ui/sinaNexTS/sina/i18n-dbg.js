/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define([], function () {
  "use strict";

  // text resources for sina
  // all sina instances share the same resource bundle!

  let globalGetTextFunction;
  function injectGetText(getTextFunction) {
    globalGetTextFunction = getTextFunction;
  }

  // use this function for accesing text resources in sina
  function getText(key, args) {
    if (globalGetTextFunction) {
      return globalGetTextFunction(key, args);
    } else {
      args = args || [];
      return "no texts avaibale " + key + " " + args.map(arg => "" + arg).join(":");
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.injectGetText = injectGetText;
  __exports.getText = getText;
  return __exports;
});
})();