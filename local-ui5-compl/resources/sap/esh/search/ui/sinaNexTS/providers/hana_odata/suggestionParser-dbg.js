/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../sina/SuggestionCalculationMode", "../../sina/SuggestionType", "../../core/errors"], function (____sina_SuggestionCalculationMode, ____sina_SuggestionType, ____core_errors) {
  "use strict";

  const SuggestionCalculationMode = ____sina_SuggestionCalculationMode["SuggestionCalculationMode"];
  const SuggestionType = ____sina_SuggestionType["SuggestionType"];
  const InternalSinaError = ____core_errors["InternalSinaError"];
  class SuggestionParser {
    provider;
    sina;
    constructor(provider) {
      this.provider = provider;
      this.sina = provider.sina;
    }
    parse(query, data) {
      const suggestions = [];
      let suggestion;
      // var parentSuggestion;
      // var parentSuggestions = [];
      // var suggestionSearchTerms = [];
      let cell;
      // var parentCell;
      // var calculationMode;

      for (let i = 0; i < data.length; i++) {
        suggestion = null;
        cell = data[i];
        // calculationMode = this.parseCalculationMode(cell.Type);
        //
        // switch (cell.Type) {
        // case 'H':
        //     suggestion = this.parseSearchTermSuggestion(query, cell);
        //     break;
        // case 'A':
        //     suggestion = this.parseSearchTermAndDataSourceSuggestion(query, cell);
        //     // attach type and cell information
        //     suggestion.type = 'A';
        //     suggestion.cell = cell;
        //     break;
        // case 'M':
        //     suggestion = this.parseDataSourceSuggestion(query, cell);
        //     break;
        // }

        suggestion = this.parseSearchTermSuggestion(query, cell);

        // if (suggestion) {
        //     if (suggestion.type === 'A') {
        //         // set parent sugestion
        //         if (parentSuggestions[suggestion.searchTerm] === undefined) {
        //             parentCell = this._getParentCell(suggestion.cell);
        //             parentSuggestion = this.parseSearchTermSuggestion(query, parentCell);
        //             parentSuggestions[suggestion.searchTerm] = parentSuggestion;
        //         }
        //         // remove type and cell information
        //         delete suggestion.type;
        //         delete suggestion.cell;
        //         // attach children
        //         parentSuggestions[suggestion.searchTerm].childSuggestions.push(suggestion);
        //     } else {
        //         // push non-attribute suggestion
        //         suggestions.push(suggestion);
        //     }
        // }
        if (suggestion) {
          suggestions.push(suggestion);
        }
      }

      // push attribute suggestion
      // Object.keys(parentSuggestions).forEach(function (key) {
      //     suggestions.push(parentSuggestions[key]);
      // });

      return suggestions;
    }
    parseDataSourceSuggestion(query, cell) {
      const calculationMode = this.sina.SuggestionCalculationMode.Data; // always data suggestion
      const dataSource = this.sina.getDataSource(cell.FromDataSource);
      if (!dataSource) {
        return null;
      }
      const filter = query.filter.clone();
      filter.setDataSource(dataSource);
      return this.sina._createDataSourceSuggestion({
        calculationMode: calculationMode,
        dataSource: dataSource,
        label: cell.SearchTermsHighlighted
      });
    }
    parseSearchTermSuggestion(query, cell) {
      const filter = query.filter.clone();
      filter.setSearchTerm(cell.term);
      if (query.types.indexOf(SuggestionType.SearchTermAI) >= 0) {
        if (query.types.length > 1) {
          throw new InternalSinaError({
            message: "mix of ai suggestions with other suggestions not allowed"
          });
        }
        if (!cell.term) {
          return null;
        }
        return this.sina._createSearchTermAISuggestion({
          searchTerm: cell.term,
          calculationMode: this.sina.SuggestionCalculationMode.Data,
          filter: filter,
          label: cell.highlighted || cell.term
        });
      } else {
        return this.sina._createSearchTermSuggestion({
          searchTerm: cell.term,
          calculationMode: this.sina.SuggestionCalculationMode.Data,
          filter: filter,
          label: cell.highlighted || cell.term
        });
      }
    }
    parseSearchTermAndDataSourceSuggestion(query, cell) {
      const calculationMode = this.parseCalculationMode(cell.Type);
      const filter = query.filter.clone();
      filter.setSearchTerm(cell.SearchTerms);
      const dataSource = this.sina.getDataSource(cell.FromDataSource);
      if (!dataSource) {
        return null;
      }
      filter.setDataSource(dataSource);
      return this.sina._createSearchTermAndDataSourceSuggestion({
        searchTerm: cell.SearchTerms,
        dataSource: dataSource,
        calculationMode: calculationMode,
        filter: filter,
        label: cell.SearchTermsHighlighted
      });
    }
    parseObjectSuggestions(query, searchItems) {
      // const filter = query.filter.clone();
      const objectSuggestions = [];
      // var objectSuggestions = searchItems.d.ObjectSuggestions.SearchResults.results;
      for (let i = 0; i < searchItems.length; ++i) {
        const object = searchItems[i];
        // fill highlighted value: actually it would be better to call
        // the search result set formatter like for a regular result
        // set
        this.fillValueHighlighted(object);
        const title = object.titleAttributes.map(function (attribute) {
          return attribute.valueFormatted || "";
        }).join(" ");
        const oObjectSuggestion = this.sina._createObjectSuggestion({
          calculationMode: this.sina.SuggestionCalculationMode.Data,
          label: title,
          // searchTerm: filter.searchTerm,
          // filter: filter,
          object: object
        });
        objectSuggestions.push(oObjectSuggestion);
      }
      return objectSuggestions;
    }
    fillValueHighlighted(object) {
      const doFillValueHighlighted = function (attributes) {
        if (!attributes) {
          return;
        }
        for (let i = 0; i < attributes.length; ++i) {
          const attribute = attributes[i];
          if (!attribute.valueHighlighted) {
            if (typeof attribute.valueFormatted === "string" && attribute.valueFormatted.startsWith("sap-icon://") === true) {
              attribute.valueHighlighted = "";
            } else {
              attribute.valueHighlighted = attribute.valueFormatted;
            }
          }
        }
      };
      doFillValueHighlighted(object.detailAttributes);
      doFillValueHighlighted(object.titleAttributes);
    }
    parseCalculationMode(scope) {
      switch (scope) {
        case "H":
          return SuggestionCalculationMode.History;
        case "A":
        case "M":
          return SuggestionCalculationMode.Data;
      }
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.SuggestionParser = SuggestionParser;
  return __exports;
});
})();