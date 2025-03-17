/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../sina/SuggestionCalculationMode", "./pivotTableParser"], function (____sina_SuggestionCalculationMode, pivotTableParser) {
  "use strict";

  const SuggestionCalculationMode = ____sina_SuggestionCalculationMode["SuggestionCalculationMode"];
  class SuggestionParser {
    provider;
    sina;
    constructor(provider) {
      this.provider = provider;
      this.sina = provider.sina;
    }
    parseSuggestions(query, data) {
      data = pivotTableParser.parse(data);
      const suggestions = [];
      let suggestion;
      let parentSuggestion;
      for (let i = 0; i < data.cells.length; i++) {
        suggestion = null;
        const cell = data.cells[i];
        if (cell.$$Attribute$$ !== "$$AllAttributes$$") {
          continue;
        }
        switch (cell.$$Term$$.Scope) {
          case "SearchHistory":
            if (cell.$$DataSource$$ === "$$AllDataSources$$") {
              suggestion = this.parseSearchTermSuggestion(query, cell);
            }
            break;
          case "ObjectData":
            if (cell.$$DataSource$$ === "$$AllDataSources$$") {
              suggestion = this.parseSearchTermSuggestion(query, cell);
              parentSuggestion = suggestion;
            } else {
              suggestion = this.parseSearchTermAndDataSourceSuggestion(query, cell);
              if (suggestion && suggestion.filter.dataSource !== parentSuggestion.filter.dataSource) {
                parentSuggestion.childSuggestions.push(suggestion);
              }
              suggestion = null;
            }
            break;
          case "DataSources":
            if (cell.$$DataSource$$ === "$$AllDataSources$$") {
              suggestion = this.parseDataSourceSuggestion(query, cell);
            }
            break;
        }
        if (suggestion) {
          suggestions.push(suggestion);
        }
      }
      return suggestions;
    }
    parseDataSourceSuggestion(query, cell) {
      const dataSource = this.sina.getDataSource(cell.$$Term$$.Value);
      if (!dataSource) {
        return null;
      }
      const filter = query.filter.clone();
      filter.setDataSource(dataSource);
      return this.sina._createDataSourceSuggestion({
        calculationMode: SuggestionCalculationMode.Data,
        dataSource: dataSource,
        label: cell.$$Term$$.ValueFormatted
      });
    }
    parseSearchTermSuggestion(query, cell) {
      const calculationMode = this.parseCalculationMode(cell.$$Term$$.Scope);
      const filter = query.filter.clone();
      filter.setSearchTerm(cell.$$Term$$.Value);
      return this.sina._createSearchTermSuggestion({
        searchTerm: cell.$$Term$$.Value,
        calculationMode: calculationMode,
        filter: filter,
        label: cell.$$Term$$.ValueFormatted
      });
    }
    parseSearchTermAndDataSourceSuggestion(query, cell) {
      const calculationMode = this.parseCalculationMode(cell.$$Term$$.Scope);
      const filter = query.filter.clone();
      filter.setSearchTerm(cell.$$Term$$.Value);
      const dataSource = this.sina.getDataSource(cell.$$DataSource$$);
      if (!dataSource) {
        return null;
      }
      filter.setDataSource(dataSource);
      return this.sina._createSearchTermAndDataSourceSuggestion({
        searchTerm: cell.$$Term$$.Value,
        dataSource: dataSource,
        calculationMode: calculationMode,
        filter: filter,
        label: cell.$$Term$$.ValueFormatted
      });
    }
    parseCalculationMode(scope) {
      switch (scope) {
        case "SearchHistory":
          return SuggestionCalculationMode.History;
        case "ObjectData":
          return SuggestionCalculationMode.Data;
      }
    }
  }
  function parse(provider, suggestionQuery, data) {
    const suggestionParser = new SuggestionParser(provider);
    return suggestionParser.parseSuggestions(suggestionQuery, data);
  }
  var __exports = {
    __esModule: true
  };
  __exports.parse = parse;
  return __exports;
});
})();