/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./SearchUrlParserInav2", "./SearchHelper", "./i18n", "sap/m/MessageBox", "./error/ErrorHandler"], function (__SearchUrlParserInav2, SearchHelper, __i18n, MessageBox, __ErrorHandler) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const SearchUrlParserInav2 = _interopRequireDefault(__SearchUrlParserInav2);
  const i18n = _interopRequireDefault(__i18n);
  const ErrorHandler = _interopRequireDefault(__ErrorHandler);
  class SearchUrlParser {
    model;
    urlParserInav2;
    errorHandler;
    constructor(options) {
      this.model = options.model;
      this.urlParserInav2 = new SearchUrlParserInav2(options);
      this.errorHandler = ErrorHandler.getInstance();
    }
    async parse(fireQuery = true) {
      // ignore url hash change which if no search application
      try {
        if (!this.model.config.isSearchUrl(SearchHelper.getHashFromUrl())) {
          return Promise.resolve(undefined);
        }
      } catch (e) {
        this.errorHandler.onError(e);
        return Promise.resolve(undefined);
      }

      // check if hash differs from old hash. if not -> return
      if (!SearchHelper.hasher.hasChanged()) {
        return Promise.resolve(undefined);
      }

      // ensure model is initialized
      await this.model.initAsync();

      // without sina -> do nothing
      if (!this.model.sinaNext) {
        return;
      }

      // parse url parameters
      let oParametersLowerCased = SearchHelper.getUrlParameters();
      if ($.isEmptyObject(oParametersLowerCased)) {
        return undefined;
      }

      // handle old sina format
      if (oParametersLowerCased.datasource || oParametersLowerCased.searchterm) {
        if (!oParametersLowerCased.datasource || this.isJson(oParametersLowerCased.datasource)) {
          return this.urlParserInav2.parseUrlParameters(oParametersLowerCased);
        }
      }

      // parameter modification exit
      try {
        oParametersLowerCased = this.model.config.parseSearchUrlParameters(oParametersLowerCased);
      } catch (e) {
        this.errorHandler.onError(e);
        return;
      }
      if (oParametersLowerCased.datasource && !this.isJson(oParametersLowerCased.datasource) && oParametersLowerCased.searchterm) {
        // parse simplified url parameters
        this.parseSimplifiedUrlParameters(oParametersLowerCased);
      } else {
        // parse new sinaNext format
        this.parseUrlParameters(oParametersLowerCased);
      }

      // update placeholder in case back button is clicked.
      this.model.setProperty("/searchTermPlaceholder", this.model.calculatePlaceholder());

      // calculate search button status
      this.model.calculateSearchButtonStatus();

      // fire query
      if (fireQuery) {
        this.model.fireSearchQuery({
          deserialization: true
        });
      }
    }
    isJson(data) {
      return data.indexOf("{") >= 0 && data.indexOf("}") >= 0;
    }
    parseSimplifiedUrlParameters(oParametersLowerCased) {
      // top
      if (oParametersLowerCased.top) {
        const top = parseInt(oParametersLowerCased.top, 10);
        this.model.setTop(top, false);
      }

      // search term
      const filter = this.model.sinaNext.createFilter();
      filter.setSearchTerm(oParametersLowerCased.searchterm);

      // datasource
      let dataSource = this.model.sinaNext.getDataSource(oParametersLowerCased.datasource);
      if (!dataSource) {
        dataSource = this.model.sinaNext.allDataSource;
      }
      filter.setDataSource(dataSource);

      // update model
      this.model.setProperty("/uiFilter", filter);
      this.model.setDataSource(filter.dataSource, false, false); // explicitely updata datasource (for categories: update ds list in model)
    }
    parseUrlParameters(oParametersLowerCased) {
      // top
      if (oParametersLowerCased.top) {
        const top = parseInt(oParametersLowerCased.top, 10);
        this.model.setTop(top, false);
      }

      // order by
      if (oParametersLowerCased.orderby && oParametersLowerCased.sortorder) {
        const orderBy = {
          orderBy: oParametersLowerCased.orderby,
          sortOrder: oParametersLowerCased.sortorder
        };
        this.model.setOrderBy(orderBy, false);
      } else {
        this.model.resetOrderBy(false);
      }

      // filter conditions
      let filter;
      if (oParametersLowerCased.filter) {
        try {
          const filterJson = JSON.parse(oParametersLowerCased.filter);
          filter = this.model.sinaNext.parseFilterFromJson(filterJson);
          this.model.setProperty("/uiFilter", filter);
          this.model.setDataSource(filter.dataSource, false, false); // explicitely updata datasource (for categories: update ds list in model)
        } catch (e) {
          // no filter taken over from url + send error message
          MessageBox.show(i18n.getText("searchUrlParsingErrorLong") + "\n(" + e.toString() + ")", {
            icon: MessageBox.Icon.ERROR,
            title: i18n.getText("searchUrlParsingError"),
            actions: [MessageBox.Action.OK]
          });
        }
      }
    }
  }
  return SearchUrlParser;
});
})();