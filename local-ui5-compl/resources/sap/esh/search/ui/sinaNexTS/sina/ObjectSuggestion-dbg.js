/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./Suggestion", "./SuggestionType"], function (___Suggestion, ___SuggestionType) {
  "use strict";

  const Suggestion = ___Suggestion["Suggestion"];
  const SuggestionType = ___SuggestionType["SuggestionType"];
  class ObjectSuggestion extends Suggestion {
    type = (() => SuggestionType.Object)();
    constructor(properties) {
      super(properties);
      this.object = properties.object ?? this.object;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.object.parent = this;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.ObjectSuggestion = ObjectSuggestion;
  return __exports;
});
})();