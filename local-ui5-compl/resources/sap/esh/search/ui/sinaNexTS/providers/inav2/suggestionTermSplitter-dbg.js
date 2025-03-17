/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../sina/SuggestionType"], function (____sina_SuggestionType) {
  "use strict";

  const SuggestionType = ____sina_SuggestionType["SuggestionType"];
  class SuggestionTermSplitter {
    provider;
    sina;
    constructor(provider) {
      this.provider = provider;
      this.sina = provider.sina;
    }
    split(term) {
      // split suggestions term into
      // prefix = which is used as search term filter
      // suffix = which is actually used as thes suggestion term
      // split position is last space
      // reason:
      // document contains: "Sally Spring"
      // search input box: sally  s-> suggestion sally spring
      //                   spring s-> suggestion spring sally
      // last suggestion would not happend when just using
      // "spring s " as suggestion term

      // check for last blank
      const splitPos = term.lastIndexOf(" ");
      if (splitPos < 0) {
        return {
          searchTerm: null,
          suggestionTerm: term
        };
      }

      // split search term
      let searchTerm = term.slice(0, splitPos);
      searchTerm = searchTerm.replace(/\s+$/, ""); // right trim
      if (searchTerm.length === 0) {
        return {
          searchTerm: null,
          suggestionTerm: term
        };
      }

      // split suggestion term
      let suggestionTerm = term.slice(splitPos);
      suggestionTerm = suggestionTerm.replace(/^\s+/, ""); // left trim
      if (suggestionTerm.length === 0) {
        return {
          searchTerm: null,
          suggestionTerm: term
        };
      }

      // return result
      return {
        searchTerm: searchTerm,
        suggestionTerm: suggestionTerm
      };
    }
    concatenate(splittedSuggestionTerm, suggestions) {
      // no search term -> nothing to do
      if (!splittedSuggestionTerm.searchTerm) {
        return;
      }

      // split search terms
      let term;
      const searchTerms = [];
      const splittedSuggestionTerms = splittedSuggestionTerm.searchTerm.split(" ");
      for (let k = 0; k < splittedSuggestionTerms.length; k++) {
        term = splittedSuggestionTerms[k];
        term = term.trim();
        searchTerms.push({
          term: term,
          regExp: new RegExp(this.escapeRegExp(term), "i")
        });
      }

      // process all suggestions
      for (let i = 0; i < suggestions.length; ++i) {
        const suggestion = suggestions[i];

        // process only SearchTerm and SearchTermAndDataSource suggestions
        if (suggestion.suggestionType !== SuggestionType.SearchTerm && suggestion.suggestionType !== SuggestionType.SearchTermAndDataSource) {
          continue;
        }

        // identify all search terms not included in suggestion
        const notFoundSearchTerms = [];
        for (let j = 0; j < searchTerms.length; ++j) {
          const searchTerm = searchTerms[j];
          if (!searchTerm.regExp.test(suggestion.filter.searchTerm)) {
            notFoundSearchTerms.push(searchTerm.term);
          }
        }

        // prefix for suggestion = all search terms not included in suggestions
        const prefixBold = [];
        const prefix = notFoundSearchTerms.join(" ");
        for (let l = 0; l < notFoundSearchTerms.length; l++) {
          term = notFoundSearchTerms[l];
          /* eslint no-loop-func:0 */
          prefixBold.push("<b>" + term + "</b>");
        }
        const prefixBoldStr = prefixBold.join(" ");
        suggestion.label = prefixBoldStr + " " + suggestion.label;
        suggestion.filter.searchTerm = suggestion.searchTerm = prefix + " " + suggestion.filter.searchTerm;

        // process children
        this.concatenate(splittedSuggestionTerm, suggestion.childSuggestions);
      }
    }
    escapeRegExp(str) {
      /* eslint no-useless-escape:0 */
      return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
  }
  function split(provider, term) {
    const suggestionTermSplitter = new SuggestionTermSplitter(provider);
    return suggestionTermSplitter.split(term);
  }
  function concatenate(provider, splittedTerm, suggestions) {
    const suggestionTermSplitter = new SuggestionTermSplitter(provider);
    return suggestionTermSplitter.concatenate(splittedTerm, suggestions);
  }
  var __exports = {
    __esModule: true
  };
  __exports.split = split;
  __exports.concatenate = concatenate;
  return __exports;
});
})();