/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../eshObjects/src/index"], function (___eshObjects_src_index) {
  "use strict";

  // file copied from DWC (DWC specifica removed), src/components/shell/utility/Crud.ts
  // import * as eshObjectsQL from "../sinaNexTS/providers/hana_odata/eshObjects/src/index";
  const Expression = ___eshObjects_src_index["Expression"];
  const LogicalOperator = ___eshObjects_src_index["LogicalOperator"];
  const SEARCH_DEFAULTS = ___eshObjects_src_index["SEARCH_DEFAULTS"];
  const parseFreeStyleText = ___eshObjects_src_index["parseFreeStyleText"];
  function createEshSearchQueryUrl(options) {
    let searchPath = options.resourcePath || "/$all";
    if (options.metadataCall === true) {
      if (options.metadataObjects) {
        if (options.metadataObjects.entitySets) {
          searchPath += "/EntitySets(" + options.metadataObjects.entitySets + ")";
        }
      }
      return searchPath;
    }
    if (options.suggestTerm) {
      searchPath = searchPath + `/${encodeURIComponent("GetSuggestion(term='" + options.suggestTerm.replace(/'/g, "''") + "')")}`;
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
      if (!options.scope) {
        options.scope = SEARCH_DEFAULTS.scope;
      }
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
    let query = "SCOPE:" + options.scope;
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
    const parameters = {};
    for (const optionKey of Object.keys(options)) {
      switch (optionKey) {
        case "query":
          if (options.$apply) {
            // it is not allowed to use query and $apply together
            break;
          }
          // eslint-disable-next-line no-case-declarations
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
          if (options.$orderby) {
            parameters.$orderby = options.$orderby.map(i => i.key + " " + i.order).join(",");
          }
          break;
        case "facets":
        case "$select":
          if (options[optionKey].length > 0) {
            parameters[optionKey] = options[optionKey].join(",");
          }
          break;
        case "$top":
        case "$skip":
        case "$count":
        case "whyfound":
        case "estimate":
        case "wherefound":
        case "language":
        case "facetlimit":
          parameters[optionKey] = options[optionKey];
          break;
        case "resourcePath":
        default:
          break;
      }
    }
    const queryParameters = Object.keys(parameters).map(i => encodeURIComponent(i) + "=" + encodeURIComponent(parameters[i])).join("&");
    return queryParameters === "" ? urlSearchPath : urlSearchPath + "?" + queryParameters;
  }
  var __exports = {
    __esModule: true
  };
  __exports.createEshSearchQueryUrl = createEshSearchQueryUrl;
  return __exports;
});
})();