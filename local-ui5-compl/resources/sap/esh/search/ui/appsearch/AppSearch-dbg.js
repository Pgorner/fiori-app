/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./CatalogSearch"], function (__CatalogSearch) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const CatalogSearch = _interopRequireDefault(__CatalogSearch);
  class AppSearch {
    catalogSearch;
    searchProviders;
    constructor() {
      this.catalogSearch = new CatalogSearch();
      this.searchProviders = [this.catalogSearch]; // deactivate transaction search
    }
    prefetch() {
      for (let i = 0; i < this.searchProviders.length; i++) {
        const searchProvider = this.searchProviders[i];
        searchProvider.prefetch();
      }
    }
    async search(query) {
      const queryPromises = [];
      for (let i = 0; i < this.searchProviders.length; i++) {
        const searchProvider = this.searchProviders[i];
        queryPromises.push(searchProvider.search(query));
      }
      return Promise.all(queryPromises).then(function (subResults) {
        const result = {
          totalCount: 0,
          tiles: []
        };
        for (let i = 0; i < subResults.length; i++) {
          const subResult = subResults[i];
          result.totalCount += subResult.totalCount;
          result.tiles.push(...subResult.tiles);
        }
        return result;
      });
    }
  }
  return AppSearch;
});
})();