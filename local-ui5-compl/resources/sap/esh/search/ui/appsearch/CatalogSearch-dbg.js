/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../error/ErrorHandler", "sap/ui/Device", "./JsSearchFactory", "sap/base/Log", "../error/errors", "../SearchModel"], function (__ErrorHandler, device, __jsSearchFactory, Log, ___error_errors, __SearchModel) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const ErrorHandler = _interopRequireDefault(__ErrorHandler);
  // TODO
  const jsSearchFactory = _interopRequireDefault(__jsSearchFactory);
  const AppSearchError = ___error_errors["AppSearchError"];
  const AppSearchSearchTermExceedsLimitsError = ___error_errors["AppSearchSearchTermExceedsLimitsError"];
  const ESHUIError = ___error_errors["ESHUIError"];
  const SearchModel = _interopRequireDefault(__SearchModel);
  class CatalogSearch {
    errorHandler;
    initPromise;
    searchEngine;
    logger = (() => Log.getLogger("sap.esh.search.ui.appsearch.catalogsearch"))();
    constructor() {
      this.errorHandler = ErrorHandler.getInstance({
        model: SearchModel.getModelSingleton({}, "flp")
      });
      this.initPromise = this.initAsync();
    }
    async initAsync() {
      // check cached promise
      if (this.initPromise) {
        return this.initPromise;
      }
      try {
        const searchService = await window.sap.ushell.Container.getServiceAsync("SearchableContent");
        const flpApps = await searchService.getApps();

        // format
        const apps = this.formatApps(flpApps);
        this.logger.debug(`Adding ${apps.length} flp apps to the search index`);

        // decide whether jsSearch should do normalization
        let shouldNormalize = true;
        const isIE = device && device.browser && device.browser.msie || false;
        if (!String.prototype.normalize || isIE) {
          shouldNormalize = false;
        }

        // create js search engine
        this.searchEngine = jsSearchFactory.createJsSearch({
          objects: apps,
          fields: ["title", "subtitle", "keywords"],
          shouldNormalize: shouldNormalize,
          algorithm: {
            id: "contains-ranked",
            options: [50, 49, 40, 39, 5, 4, 51]
          }
        });
      } catch (error) {
        const flpError = new ESHUIError("FLP SearchableContent Service Failed - App Search won't be available.");
        flpError.previous = error;
        throw flpError;
      }
    }
    formatApps(apps) {
      const resultApps = [];
      apps.forEach(function (app) {
        app.visualizations.forEach(function (vis) {
          let label = vis.title;
          if (vis.subtitle) {
            label = label + " - " + vis.subtitle;
          }
          resultApps.push({
            title: vis.title || "",
            subtitle: vis.subtitle || "",
            keywords: vis.keywords ? vis.keywords.join(" ") : "",
            icon: vis.icon || "",
            label: label,
            visualization: vis,
            url: vis.targetURL
          });
        });
      });
      return resultApps;
    }
    prefetch() {
      // empty
    }
    async search(query) {
      // check length limit (for long search terms jssearch may freeze the UI because of too much regexp creation...)
      const searchTermLengthLimit = 1000;
      if (query.searchTerm?.length > searchTermLengthLimit) {
        throw new AppSearchSearchTermExceedsLimitsError(searchTermLengthLimit);
      }
      try {
        await this.initAsync();

        // use js search for searching
        const searchResults = this.searchEngine.search({
          searchFor: query.searchTerm,
          top: query.top,
          skip: query.skip
        });

        // convert to result structure
        const items = [];
        for (let i = 0; i < searchResults.results.length; ++i) {
          const result = searchResults.results[i];
          const formattedResult = Object.assign({}, result.object);
          let highlightedLabel = formattedResult.title;
          let hasHighlightedSubtitle = false;
          if (typeof result.highlighted === "object" && result.highlighted) {
            if ("title" in result.highlighted && typeof result.highlighted.title === "string") {
              highlightedLabel = result.highlighted.title;
            }
            if ("subtitle" in result.highlighted && typeof result.highlighted.subtitle === "string") {
              highlightedLabel = highlightedLabel + " - " + result.highlighted.subtitle;
              hasHighlightedSubtitle = true;
            }
          }
          if (!hasHighlightedSubtitle && formattedResult.subtitle) {
            highlightedLabel = highlightedLabel + " - " + formattedResult.subtitle;
          }
          formattedResult.label = highlightedLabel;
          items.push(formattedResult);
        }

        // return search result
        return {
          totalCount: searchResults.totalCount,
          tiles: items
        };
      } catch (error) {
        const appSearchError = new AppSearchError(error);
        appSearchError.previous = error;
        this.errorHandler.onError(appSearchError);
        return {
          totalCount: 0,
          tiles: []
        };
      }
    }
  }
  return CatalogSearch;
});
})();