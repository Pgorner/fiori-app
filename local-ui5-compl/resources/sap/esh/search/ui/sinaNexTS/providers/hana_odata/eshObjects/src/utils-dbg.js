/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./definitions"], function (___definitions) {
  "use strict";

  /** Copyright 2019 SAP SE or an SAP affiliate company. All rights reserved. */
  const Term = ___definitions["Term"];
  const Phrase = ___definitions["Phrase"];
  const Expression = ___definitions["Expression"];
  const SearchQueryLogicalOperator = ___definitions["SearchQueryLogicalOperator"];
  const CustomFunction = ___definitions["CustomFunction"];
  const FilterFunction = ___definitions["FilterFunction"];
  const LogicalOperator = ___definitions["LogicalOperator"];
  const SEARCH_DEFAULTS = ___definitions["SEARCH_DEFAULTS"];
  const escapeQuery = ___definitions["escapeQuery"];
  var States = /*#__PURE__*/function (States) {
    States[States["Term"] = 0] = "Term";
    States[States["Phrase"] = 1] = "Phrase";
    return States;
  }(States || {});
  const createEshSearchQuery = (options = {}) => {
    if (options.metadataCall) {
      let path = options.resourcePath ? options.resourcePath : "/$metadata";
      if (options.metadataObjects) {
        if (options.metadataObjects.entitySets) {
          path += "/EntitySets(" + options.metadataObjects.entitySets + ")";
        } else {
          if (options.metadataObjects.format) {
            path += "?$format=" + options.metadataObjects.format;
          }
          if (options.metadataObjects.collectionReference) {
            path += "#" + options.metadataObjects.collectionReference;
          }
          if (options.metadataObjects.contextEntitySet && options.metadataObjects.primitiveTyp) {
            path += "#" + options.metadataObjects.contextEntitySet + "(" + options.metadataObjects.primitiveTyp + ")";
          } else if (options.metadataObjects.contextEntitySet) {
            path += "#" + options.metadataObjects.contextEntitySet;
          } else if (options.metadataObjects.primitiveTyp) {
            path += "#" + options.metadataObjects.primitiveTyp;
          }
        }
      }
      return {
        path: path,
        parameters: {}
      };
    }
    /*
    let searchPath1 = "";
    if (options?.resourcePath) {
      searchPath1 = options?.resourcePath
    } else {
      searchPath1 = (options && options.suggestTerm) ? `/$all/${encodeURIComponent("GetSuggestion(term='" + options.suggestTerm.replace("'", "''").replace("\\?", "?") + "')")}` : "/$all";
    }*/

    let searchPath = "/$all";
    if (options.resourcePath) {
      searchPath = options.resourcePath;
    }
    if (options?.suggestTerm) {
      searchPath += `/${encodeURIComponent("GetSuggestion(term='" + options.suggestTerm.replace(/'/g, "''") + "')")}`;
    }
    if (options.eshParameters) {
      const customParameters = [];
      for (const key of Object.keys(options.eshParameters)) {
        customParameters.push(key + "='" + encodeURIComponent(options.eshParameters[key]) + "'");
      }
      if (customParameters.length > 0) {
        searchPath += "(" + customParameters.join(",") + ")";
      }
    }
    const newODataFilter = new Expression({
      operator: LogicalOperator.and,
      items: []
    });
    if (!options) {
      options = {
        query: SEARCH_DEFAULTS.query,
        scope: SEARCH_DEFAULTS.scope,
        $select: [],
        facets: []
      };
    } else {
      if (!options.query) {
        options.query = SEARCH_DEFAULTS.query;
      }
      /*
      if (!options.scope) {
        options.scope = SEARCH_DEFAULTS.scope;
      }*/
      if (!options.$select) {
        options.$select = [];
      }
      if (!options.facets) {
        options.facets = [];
      }
    }
    if (options.oDataFilter) {
      newODataFilter.items.push(options.oDataFilter);
    }
    if (newODataFilter.items.length > 0) {
      options.oDataFilter = newODataFilter;
    }
    const urlSearchPath = searchPath;
    let query = options.scope ? "SCOPE:" + options.scope : "";
    if (options.searchQueryFilter) {
      const searchQueryFilterStatement = options.searchQueryFilter.toStatement().trim();
      if (searchQueryFilterStatement.length > 0) {
        if (query !== "") {
          query += " ";
        }
        query += searchQueryFilterStatement;
      }
    }
    if (options.freeStyleText) {
      if (query !== "") {
        query += " ";
      }
      const freeStyleTextExpression = parseFreeStyleText(options.freeStyleText);
      query += freeStyleTextExpression.toStatement();
    }
    if (options.query && options.query !== "") {
      if (query !== "") {
        query += " ";
      }
      query += escapeQuery(options.query);
    }
    const parameters = {};
    for (const optionKey of Object.keys(options)) {
      switch (optionKey) {
        case "query":
          if (options.$apply) {
            // it is not allowed to use query and $apply together
            break;
          }
          let filter = query === "" ? "" : "filter(Search.search(query='" + query + "')";
          if (options.oDataFilter && options.oDataFilter.items.length > 0) {
            filter += " and " + options.oDataFilter.toStatement();
          }
          if (query !== "") {
            filter += ")";
          }
          if (options.groupby && options.groupby.properties && options.groupby.properties.length > 0) {
            filter += `/groupby((${options.groupby.properties.join(",")})`;
            if (options.groupby.aggregateCountAlias && options.groupby.aggregateCountAlias !== "") {
              filter += `,aggregate($count as ${options.groupby.aggregateCountAlias})`;
            }
            filter += ")";
          }
          if (filter !== "") {
            parameters.$apply = filter;
          }
          break;
        case "$orderby":
          if (options.$orderby && options.$orderby.length > 0) {
            parameters.$orderby = options.$orderby.map(i => i.order ? `${i.key} ${i.order}` : i.key).join(",");
          }
          break;
        case "facets":
          if (options.facets && options.facets.length > 0) {
            parameters[optionKey] = options.facets.join(",");
          }
          break;
        case "$select":
          if (options.$select && options.$select.length > 0) {
            parameters[optionKey] = options.$select.join(",");
          }
          break;
        case "facetroot":
          if (options.facetroot && options.facetroot.length > 0) {
            parameters.facetroot = options.facetroot.map(i => i.toStatement()).join(",");
          }
          break;
        case "$top":
        case "$skip":
        case "$count":
        case "whyfound":
        case "estimate":
        case "wherefound":
        case "facetlimit":
        case "valuehierarchy":
        case "filteredgroupby":
          parameters[optionKey] = options[optionKey];
          break;
        case "dynamicview":
          if (options.dynamicview) {
            parameters[optionKey] = options.dynamicview.map(dynamicView => {
              return dynamicView.toStatement();
            }).join(" ");
          }
          break;
        case "$apply":
          if (options[optionKey] instanceof CustomFunction || options[optionKey] instanceof FilterFunction) {
            let apply = options[optionKey].toStatement();
            if (options.groupby && options.groupby.properties && options.groupby.properties.length > 0) {
              apply += `/groupby((${options.groupby.properties.join(",")})`;
              if (options.groupby.aggregateCountAlias && options.groupby.aggregateCountAlias !== "") {
                apply += `,aggregate($count as ${options.groupby.aggregateCountAlias})`;
              }
              apply += ")";
            }
            ;
            parameters[optionKey] = apply;
          }
          break;
        default:
          break;
      }
    }
    return {
      path: urlSearchPath,
      parameters
    };
  };
  const getEshSearchQuery = options => {
    const createdQuery = createEshSearchQuery(options);
    const stringParams = Object.keys(createdQuery.parameters).map(function (key) {
      return encodeURIComponent(key) + "=" + encodeURIComponent(createdQuery.parameters[key]);
    }).join("&");
    if (stringParams && stringParams !== "") {
      return `${createdQuery.path}?${stringParams}`;
    }
    return createdQuery.path;
  };
  const parseFreeStyleText = freeStyleText => {
    const items = [];
    let term = "";
    let state = States.Term;
    for (let i = 0; i < freeStyleText.length; i++) {
      const currentChar = freeStyleText[i];
      if (currentChar === '"') {
        if (state == States.Term) {
          // check if there is closing "
          if (freeStyleText.substring(i + 1).indexOf('"') >= 0) {
            items.push(new Term({
              term: term.trim()
            }));
            state = States.Phrase;
            term = '';
          } else {
            items.push(new Term({
              term: (term + freeStyleText.substring(i)).trim()
            }));
            term = '';
            break;
          }
        } else {
          items.push(new Phrase({
            phrase: term
          }));
          state = States.Term;
          term = '';
        }
      } else {
        term += freeStyleText[i];
      }
    }
    if (term.length > 0) {
      items.push(new Term({
        term: term.trim()
      }));
    }
    return new Expression({
      operator: SearchQueryLogicalOperator.TIGHT_AND,
      items
    });
  };
  var __exports = {
    __esModule: true
  };
  __exports.createEshSearchQuery = createEshSearchQuery;
  __exports.getEshSearchQuery = getEshSearchQuery;
  __exports.parseFreeStyleText = parseFreeStyleText;
  return __exports;
});
})();