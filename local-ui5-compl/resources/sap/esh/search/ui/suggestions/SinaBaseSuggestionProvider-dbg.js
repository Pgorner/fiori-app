/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./SuggestionType"], function (___SuggestionType) {
  "use strict";

  const UISuggestionType = ___SuggestionType["Type"];
  class SinaBaseSuggestionProvider {
    suggestionQuery;
    suggestionTypes;
    constructor(sinaNext) {
      this.sinaNext = sinaNext;
      this.suggestionQuery = this.sinaNext.createSuggestionQuery();
    }

    // prepare suggestions query
    // ===================================================================
    prepareSuggestionQuery(filter) {
      this.suggestionQuery.resetResultSet();
      this.suggestionQuery.setFilter(filter);
      const sinaSuggestionTypes = this.assembleSinaSuggestionTypesAndCalcModes();
      this.suggestionQuery.setTypes(sinaSuggestionTypes.types);
      this.suggestionQuery.setCalculationModes(sinaSuggestionTypes.calculationModes);
      this.suggestionQuery.setTop(20);
    }

    // assemble suggestion types and calculation modes
    // ===================================================================
    assembleSinaSuggestionTypesAndCalcModes() {
      const append = function (list, element) {
        if (list.indexOf(element) >= 0) {
          return;
        }
        list.push(element);
      };
      const result = {
        types: [],
        calculationModes: []
      };
      for (let i = 0; i < this.suggestionTypes.length; ++i) {
        const suggestionType = this.suggestionTypes[i];
        switch (suggestionType) {
          case UISuggestionType.SearchTermHistory:
            append(result.types, this.sinaNext.SuggestionType.SearchTerm);
            append(result.calculationModes, this.sinaNext.SuggestionCalculationMode.History);
            break;
          case UISuggestionType.SearchTermData:
            append(result.types, this.sinaNext.SuggestionType.SearchTerm);
            append(result.calculationModes, this.sinaNext.SuggestionCalculationMode.Data);
            break;
          case UISuggestionType.SearchTermAI:
            append(result.types, this.sinaNext.SuggestionType.SearchTermAI);
            append(result.calculationModes, this.sinaNext.SuggestionCalculationMode.Data);
            break;
          case UISuggestionType.DataSource:
            append(result.types, this.sinaNext.SuggestionType.DataSource);
            append(result.calculationModes, this.sinaNext.SuggestionCalculationMode.Data);
            break;
          case UISuggestionType.Object:
            append(result.types, this.sinaNext.SuggestionType.Object);
            append(result.calculationModes, this.sinaNext.SuggestionCalculationMode.Data);
            break;
        }
      }
      return result;
    }
  }
  return SinaBaseSuggestionProvider;
});
})();