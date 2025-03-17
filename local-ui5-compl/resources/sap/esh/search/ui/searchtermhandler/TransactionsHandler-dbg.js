/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../suggestions/SuggestionType", "../SearchShellHelper", "../SearchShellHelperHorizonTheme", "../flp/FrontendSystem", "../flp/BackendSystem"], function (___suggestions_SuggestionType, __SearchShellHelper, __SearchShellHelperHorizonTheme, __FrontendSystem, __BackendSystem) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const SuggestionType = ___suggestions_SuggestionType["Type"];
  const SearchShellHelper = _interopRequireDefault(__SearchShellHelper);
  const SearchShellHelperHorizonTheme = _interopRequireDefault(__SearchShellHelperHorizonTheme);
  const FrontendSystem = _interopRequireDefault(__FrontendSystem);
  const BackendSystem = _interopRequireDefault(__BackendSystem);
  class TransactionsHandler {
    tCodeStartUrl;
    constructor(searchModel) {
      this.searchModel = searchModel;
      const eshBackendSystemInfo = BackendSystem.getSystem(searchModel);
      if (eshBackendSystemInfo && !eshBackendSystemInfo.equals(FrontendSystem.getSystem())) {
        // add sid(XYZ.123) url parameter
        this.tCodeStartUrl = `#Shell-startGUI?sap-system=sid(${eshBackendSystemInfo.id})&sap-ui2-tcode=`;
      } else {
        this.tCodeStartUrl = "#Shell-startGUI?sap-ui2-tcode=";
      }
    }
    _addItemToRecentlyUsedStorage(searchTerm, slicedSearchTerm) {
      const transactionSuggestion = {
        label: searchTerm,
        // dataSourceId: "All",
        url: this.tCodeStartUrl + slicedSearchTerm,
        icon: "sap-icon://generate-shortcut",
        uiSuggestionType: SuggestionType.Transaction,
        searchTerm
      };
      if (this.searchModel.config.bRecentSearches && this.searchModel.recentlyUsedStorage) {
        this.searchModel.recentlyUsedStorage.addItem(transactionSuggestion);
      }
    }
    handleSearchTerm(searchTerm, searchInput) {
      const returnValue = {
        navigateToSearchApp: true
      };
      const dataSource = this.searchModel.getDataSource();
      const userCategoryManager = this.searchModel.userCategoryManager;
      const favoritesIncludeApps = userCategoryManager?.isFavActive() && userCategoryManager?.getCategory("MyFavorites")?.includeApps;
      // check that datasource is all, apps or my favorites and my favorites include apps:
      if (dataSource !== this.searchModel.allDataSource && dataSource !== this.searchModel.appDataSource && !(dataSource === this.searchModel.favDataSource && favoritesIncludeApps)) {
        return returnValue;
      }
      if (window.sap.cf) {
        // no transaction handling in cFLP/multiprovider
        return returnValue;
      }
      // if search term starts with /n or /o start transaction directly:
      if (searchTerm.toLowerCase().indexOf("/n") === 0) {
        const slicedSearchTerm = searchTerm.slice(2);
        this._addItemToRecentlyUsedStorage(searchTerm, slicedSearchTerm);
        if (window.hasher) {
          window.hasher.setHash(this.tCodeStartUrl + slicedSearchTerm);
        } else {
          window.location.href = this.tCodeStartUrl + slicedSearchTerm;
        }
        returnValue.navigateToSearchApp = false;
      }
      if (searchTerm.toLowerCase().indexOf("/o") === 0) {
        const slicedSearchTerm = searchTerm.slice(2);
        this._addItemToRecentlyUsedStorage(searchTerm, slicedSearchTerm);
        window.open(this.tCodeStartUrl + slicedSearchTerm, "_blank", "noopener,noreferrer");
        returnValue.navigateToSearchApp = false;
      }
      if (returnValue.navigateToSearchApp === false) {
        // transaction is started, reset search input state:
        searchInput.destroySuggestionRows();
        searchInput.setValue("");
        if (!SearchShellHelperHorizonTheme.isSearchFieldExpandedByDefault()) {
          SearchShellHelper.collapseSearch();
        }
      }
      return returnValue;
    }
  }
  return TransactionsHandler;
});
})();