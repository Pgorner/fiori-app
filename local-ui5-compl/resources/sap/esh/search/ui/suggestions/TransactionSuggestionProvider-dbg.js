/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../sinaNexTS/sina/DataSourceType", "./SuggestionType", "./SinaObjectSuggestionFormatter", "../flp/BackendSystem", "../flp/FrontendSystem", "sap/ui/Device"], function (___sinaNexTS_sina_DataSourceType, __SuggestionType, __Formatter, __BackendSystem, __FrontendSystem, Device) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const DataSourceType = ___sinaNexTS_sina_DataSourceType["DataSourceType"];
  const SuggestionType = _interopRequireDefault(__SuggestionType);
  const Type = __SuggestionType["Type"];
  const Formatter = _interopRequireDefault(__Formatter);
  const BackendSystem = _interopRequireDefault(__BackendSystem);
  const FrontendSystem = _interopRequireDefault(__FrontendSystem);
  class TransactionSuggestionProvider {
    model;
    suggestionHandler;
    suggestionLimit;
    sinaNext;
    suggestionQuery;
    transactionsDS;
    suggestionStartingCharacters;
    suggestionFormatter = (() => new Formatter())();
    transactionSuggestions = [];
    constructor(params) {
      this.model = params.model;
      this.suggestionHandler = params.suggestionHandler;
      this.suggestionLimit = Device.system.phone ? 5 : 7;
      this.sinaNext = this.model.sinaNext;
      this.suggestionQuery = this.sinaNext.createSuggestionQuery();
      this.transactionsDS = this.sinaNext.createDataSource({
        id: "CD$ALL~ESH_TRANSACTION~",
        label: "Transactions",
        type: DataSourceType.BusinessObject
      });
      this.suggestionStartingCharacters = this.model.config.suggestionStartingCharacters;
    }
    abortSuggestions() {
      this.suggestionQuery.abort();
    }

    // openTransactionSuggestion(tcode: string, startInNewWindow: boolean): void {
    //     const transactionSuggestion = this.suggestionHandler.autoSelectTransactionSuggestion(tcode);
    //     // const url = "#Shell-startGUI?sap-ui2-tcode=" + tcode;
    //     if (!transactionSuggestion) return;
    //     if (startInNewWindow) {
    //         window.open(transactionSuggestion.url, "_blank", "noopener,noreferrer");
    //     } else {
    //         if (window.hasher) {
    //             window.hasher.setHash(transactionSuggestion.url);
    //         } else {
    //             window.location.href = transactionSuggestion.url;
    //         }
    //     }
    // }

    getUrl(tCode) {
      let tCodeStartUrl = "#Shell-startGUI?sap-ui2-tcode=" + tCode;
      const eshBackendSystemInfo = BackendSystem.getSystem(this.model);
      if (eshBackendSystemInfo && !eshBackendSystemInfo.equals(FrontendSystem.getSystem())) {
        // add sid(XYZ.123) url parameter
        tCodeStartUrl = `#Shell-startGUI?sap-system=sid(${eshBackendSystemInfo.id})&sap-ui2-tcode=${tCode}`;
      }
      return tCodeStartUrl;
    }
    async getSuggestions(filter) {
      // check that BO search is enabled
      if (!this.model.config.searchBusinessObjects) {
        return Promise.resolve([]);
      }
      const dataSource = this.model.getDataSource();
      const userCategoryManager = this.model.userCategoryManager;
      const favoritesIncludeApps = userCategoryManager?.isFavActive() && userCategoryManager?.getCategory("MyFavorites")?.includeApps;
      // check that datasource is all, apps or my favorites and my favorites include apps:
      if (dataSource !== this.model.allDataSource && dataSource !== this.model.appDataSource && !(dataSource === this.model.favDataSource && favoritesIncludeApps)) {
        return Promise.resolve([]);
      }
      filter = filter.clone();
      let suggestionTerm = filter.searchTerm;
      if (suggestionTerm.toLowerCase().indexOf("/n") === 0 || suggestionTerm.toLowerCase().indexOf("/o") === 0) {
        suggestionTerm = suggestionTerm.slice(2);
        filter.searchTerm = suggestionTerm;
      }
      this.transactionSuggestions = [];
      if (suggestionTerm.length < this.suggestionStartingCharacters) {
        return Promise.resolve([]);
      }

      // prepare sina suggestion query
      this.prepareSuggestionQuery(filter);
      const resultSet = await this.suggestionQuery.getResultSetAsync();
      const sinaSuggestions = resultSet.items;

      // const inTransactions = i18n.getText("suggestion_in_transactions", [""]);

      // set type, datasource and position
      for (const sinaSuggestion of sinaSuggestions) {
        const transactionSuggestion = {
          uiSuggestionType: Type.Transaction,
          dataSource: this.transactionsDS,
          position: SuggestionType.properties.Transaction.position,
          key: sinaSuggestion.object.attributesMap.TCODE.value,
          searchTerm: filter.searchTerm,
          url: this.getUrl(sinaSuggestion.object.attributesMap.TCODE.value),
          icon: "sap-icon://generate-shortcut",
          label: sinaSuggestion.object.attributesMap.TCDTEXT.valueHighlighted,
          type: sinaSuggestion.type,
          calculationMode: sinaSuggestion.calculationMode,
          object: sinaSuggestion.object,
          sina: sinaSuggestion.sina
        };
        const can = await window.sap.ushell.Container.getServiceAsync("CrossApplicationNavigation");
        const isSupported = await can.isNavigationSupported([{
          target: {
            shellHash: transactionSuggestion.url
          }
        }]);
        if (isSupported[0].supported) {
          this.suggestionFormatter.format(this, transactionSuggestion);
        }
      }

      // limit transaction suggestions
      const transactionSuggestionLimit = this.suggestionHandler.getSuggestionLimit(Type.Transaction);
      this.transactionSuggestions = this.transactionSuggestions.slice(0, transactionSuggestionLimit);
      return this.transactionSuggestions;
    }
    addSuggestion(transactionSuggestion) {
      this.transactionSuggestions.push(transactionSuggestion);
    }
    prepareSuggestionQuery(filter) {
      this.suggestionQuery.resetResultSet();
      this.suggestionQuery.setFilter(filter);
      this.suggestionQuery.setDataSource(this.transactionsDS);
      this.suggestionQuery.setTypes([this.sinaNext.SuggestionType.Object]);
      this.suggestionQuery.setCalculationModes([this.sinaNext.SuggestionCalculationMode.Data]);
      this.suggestionQuery.setTop(10);
    }
  }
  return TransactionSuggestionProvider;
});
})();