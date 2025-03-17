/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["sap/base/Log", "../i18n", "./AppSuggestionProvider", "./RecentlyUsedSuggestionProvider", "./SinaSuggestionProvider", "./SuggestionType", "./TimeMerger", "./TransactionSuggestionProvider", "sap/esh/search/ui/SearchHelper", "../eventlogging/UserEvents", "sap/ui/core/Element"], function (Log, __i18n, __AppSuggestionProvider, __RecentlyUsedSuggestionProvider, __SinaSuggestionProvider, ___SuggestionType, __TimeMerger, __TransactionSuggestionProvider, SearchHelper, ___eventlogging_UserEvents, Element) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const i18n = _interopRequireDefault(__i18n);
  const AppSuggestionProvider = _interopRequireDefault(__AppSuggestionProvider);
  const RecentlyUsedSuggestionProvider = _interopRequireDefault(__RecentlyUsedSuggestionProvider);
  const SinaSuggestionProvider = _interopRequireDefault(__SinaSuggestionProvider);
  const SuggestionType = ___SuggestionType["Type"];
  const SuggestionTypeProperties = ___SuggestionType["SuggestionType"];
  const TimeMerger = _interopRequireDefault(__TimeMerger);
  const TransactionSuggestionProvider = _interopRequireDefault(__TransactionSuggestionProvider);
  const UserEventType = ___eventlogging_UserEvents["UserEventType"];
  class SuggestionHandler {
    _oLogger;
    model;
    suggestionProviders;
    keyboardRelaxationTime;
    uiUpdateInterval = 500;
    uiClearOldSuggestionsTimeOut = 1000;
    recentlyUsedSuggestionProvider;
    appSuggestionProvider;
    timeMerger;
    suggestionProvidersPromise;
    sinaNext;
    firstInsertion;
    busyIndicator;
    performanceLoggerSuggestionMethods;
    clearSuggestionTimer;
    suggestionResultSetCounter;
    suggestionHeaders;
    generatedPositions;
    doSuggestionInternalDelayed;
    transactionSuggestionProvider;

    // init
    // ===================================================================
    constructor(params) {
      // members
      this._oLogger = Log.getLogger("sap.esh.search.ui.suggestions.SuggestionHandler");
      this.model = params.model;
      this.suggestionProviders = [];

      // times
      this.keyboardRelaxationTime = this.model.config.suggestionKeyboardRelaxationTime;

      // recently used suggestion provider
      if (this.supportsRecentlyUsedSuggestions()) {
        this.recentlyUsedSuggestionProvider = new RecentlyUsedSuggestionProvider({
          model: this.model,
          suggestionHandler: this
        });
      }

      // apps suggestion provider
      this.appSuggestionProvider = new AppSuggestionProvider({
        model: this.model,
        suggestionHandler: this
      });

      // decorator for delayed suggestion execution, make delayed by default 400ms
      this.doSuggestionInternalDelayed = SearchHelper.delayedExecution(this.doSuggestionInternal.bind(this), this.keyboardRelaxationTime);

      // time merger for merging returning suggestions callbacks
      this.timeMerger = new TimeMerger();
      this.performanceLoggerSuggestionMethods = []; // performance logging: Remember all method names of (open) suggestion calls (needed for 'abortSuggestion -> leaveMethod')
    }
    supportsRecentlyUsedSuggestions() {
      if (!this.model.config.bRecentSearches) return false;
      return true;
    }
    supportsTransactionSuggestions() {
      return false; // deactivate until S4 decides to activate it
      if (window.sap["cf"]) return false; // no transaction suggestions in cFLP/multiprovider
      if (!this.model.config.isUshell) return false; // transaction suggestions are only shown in ushell
      if (this.model.sinaNext.provider.serverInfo && this.model.sinaNext.provider.serverInfo.Services && this.model.sinaNext.provider.serverInfo.Services.results && this.model.sinaNext.provider.serverInfo.Services.results.length > 0) {
        for (const capability of this.model.sinaNext.provider.serverInfo.Services.results) {
          if (capability.Id === "TransactionSuggestions") return true;
        }
      }
      return false;
    }

    // abort suggestions
    // ===================================================================
    abortSuggestions(clearSuggestions) {
      if (clearSuggestions === undefined || clearSuggestions === true) {
        this.model.setProperty("/suggestions", []);
      }
      if (this.clearSuggestionTimer) {
        clearTimeout(this.clearSuggestionTimer);
        this.clearSuggestionTimer = null;
      }
      this.doSuggestionInternalDelayed.abort(); // abort time delayed calls
      this.getSuggestionProviders().then(suggestionProviders => {
        for (let i = 0; i < suggestionProviders.length; ++i) {
          const suggestionProvider = suggestionProviders[i];
          suggestionProvider.abortSuggestions();
        }
        this.timeMerger.abort();
        for (const method of this.performanceLoggerSuggestionMethods) {
          this.model.config.performanceLogger.leaveMethod({
            name: method
          });
        }
        this.performanceLoggerSuggestionMethods = [];
      });
    }

    // get suggestion providers dependend on server capabilities
    // ===================================================================
    getSuggestionProviders() {
      // check cache
      if (this.suggestionProvidersPromise) {
        return this.suggestionProvidersPromise;
      }
      this.suggestionProvidersPromise = this.model.initAsync().then(() => {
        // link to sina
        this.sinaNext = this.model.sinaNext;

        // init list of suggestion providers (app suggestions are always available)
        const suggestionProviders = [];
        if (this.model.config.isUshell) {
          suggestionProviders.push(this.appSuggestionProvider);
        }
        if (this.supportsRecentlyUsedSuggestions()) {
          suggestionProviders.push(this.recentlyUsedSuggestionProvider);
        }

        // if no business obj search configured -> just use app suggestion provider
        if (!this.model.config.searchBusinessObjects) {
          return Promise.resolve(suggestionProviders);
        }

        // create sina suggestion providers
        suggestionProviders.push(...this.createSinaSuggestionProviders());

        // transactions suggestion provider
        if (this.supportsTransactionSuggestions()) {
          this.transactionSuggestionProvider = new TransactionSuggestionProvider({
            model: this.model,
            suggestionHandler: this
          });
          suggestionProviders.push(this.transactionSuggestionProvider);
        }
        return Promise.resolve(suggestionProviders);
      });
      return this.suggestionProvidersPromise;
    }

    // create sina suggestion providers
    // ===================================================================
    createSinaSuggestionProviders() {
      // provider configuration
      const providerConfigurations = [{
        suggestionTypes: [SuggestionType.SearchTermHistory]
      }, {
        suggestionTypes: [SuggestionType.SearchTermData]
      }, {
        suggestionTypes: [SuggestionType.DataSource]
      }];
      if (this.model.config.boSuggestions) {
        providerConfigurations.push({
          suggestionTypes: [SuggestionType.Object]
        });
      }
      if (this.model.config.aiSuggestions) {
        // just evaluate config flag
        // user settings is checked in SinaSuggestionProvider and may change during runtime
        providerConfigurations.push({
          suggestionTypes: [SuggestionType.SearchTermAI]
        });
      }
      // create suggestion providers
      const suggestionProviders = [];
      for (let k = 0; k < providerConfigurations.length; ++k) {
        const providerConfiguration = providerConfigurations[k];
        suggestionProviders.push(new SinaSuggestionProvider({
          model: this.model,
          sinaNext: this.sinaNext,
          suggestionTypes: providerConfiguration.suggestionTypes,
          suggestionHandler: this
        }));
      }
      return suggestionProviders;
    }

    // check if suggestions are visible
    // ===================================================================
    isSuggestionPopupVisible() {
      return jQuery(".searchSuggestion").filter(":visible").length > 0;
    }

    // do suggestions
    // ===================================================================
    doSuggestion(filter) {
      this.abortSuggestions(false);
      this.doSuggestionInternalDelayed(filter); // time delayed
    }

    // auto select app suggestion
    // ===================================================================
    autoSelectAppSuggestion(filter) {
      return this.appSuggestionProvider.getSuggestions(filter).then(function (suggestions) {
        return suggestions[0];
      });
    }
    autoSelectTransactionSuggestion(key = "") {
      key = key.toUpperCase();
      return this.transactionSuggestionProvider?.transactionSuggestions.find(suggestion => {
        return suggestion.key === key;
      });
    }

    // do suggestion internal
    // ===================================================================
    doSuggestionInternal(filter) {
      /* eslint no-loop-func:0 */

      this.firstInsertion = true;
      this.busyIndicator = false;
      const suggestionTerm = this.model.getProperty("/uiFilter/searchTerm");

      // no suggestions for *
      if (suggestionTerm.trim() === "*") {
        this.insertSuggestions([], 0);
        return;
      }
      const method = `Suggestions for term ${suggestionTerm}`;
      this.performanceLoggerSuggestionMethods.push(method);
      this.model.config.performanceLogger.enterMethod({
        name: method
      }, {
        isSearch: true,
        comments: `suggestion term: ${suggestionTerm}`
      });

      // log suggestion request
      this.model.eventLogger.logEvent({
        type: UserEventType.SUGGESTION_REQUEST,
        suggestionTerm: this.model.getProperty("/uiFilter/searchTerm"),
        dataSourceKey: this.model.getProperty("/uiFilter/dataSource").id
      });

      // get suggestion providers
      this.getSuggestionProviders().then(suggestionProviders => {
        // get suggestion promises from all providers
        const promises = [];
        let pending = suggestionProviders.length;
        for (let i = 0; i < suggestionProviders.length; ++i) {
          const suggestionProvider = suggestionProviders[i];
          promises.push(suggestionProvider.getSuggestions(filter));
        }

        // display empty suggestions list just with busy indicator
        if (this.isSuggestionPopupVisible()) {
          // do this time delayed in order to avoid flickering
          // otherwise we would have: old suggestions/busy indicator/new suggestions
          if (this.clearSuggestionTimer) {
            clearTimeout(this.clearSuggestionTimer);
          }
          this.clearSuggestionTimer = window.setTimeout(() => {
            this.clearSuggestionTimer = null;
            this.insertSuggestions([], pending);
          }, this.uiClearOldSuggestionsTimeOut);
        } else {
          // immediately display busy indicator
          this.insertSuggestions([], pending);
        }

        // process suggestions using time merger
        // (merge returning suggestion callbacks happening within a time slot
        // in order to reduce number of UI updates)
        this.timeMerger.abort();
        this.timeMerger = new TimeMerger(promises, this.uiUpdateInterval);
        this.timeMerger.process(results => {
          pending -= results.length;
          const suggestions = [];
          for (let j = 0; j < results.length; ++j) {
            const result = results[j];
            if (result && result instanceof Error) {
              this._oLogger.error("A suggestion provider reported an error while getting suggestions for term '" + filter.searchTerm + "'\n" + result.stack || result + "");
              continue;
            }
            suggestions.push(...result);
          }
          if (pending > 0 && suggestions.length === 0) {
            return; // empty result -> return and don't update (flicker) suggestions on UI
          }
          if (this.clearSuggestionTimer) {
            clearTimeout(this.clearSuggestionTimer);
            this.clearSuggestionTimer = null;
          }
          this.insertSuggestions(suggestions, pending);
          if (pending === 0) {
            for (const method of this.performanceLoggerSuggestionMethods) {
              this.model.config.performanceLogger.leaveMethod({
                name: method
              });
            }
            this.performanceLoggerSuggestionMethods = [];
          }
        });
      }).catch(() => {
        for (const method of this.performanceLoggerSuggestionMethods) {
          this.model.config.performanceLogger.leaveMethod({
            name: method
          });
        }
        this.performanceLoggerSuggestionMethods = [];
      });
    }

    // generate suggestion header
    // ===================================================================
    generateSuggestionHeader(insertSuggestion) {
      const header = {};
      switch (insertSuggestion.uiSuggestionType) {
        case SuggestionType.Transaction:
          header.label = i18n.getText("label_transactions");
          break;
        case SuggestionType.App:
          header.label = i18n.getText("label_apps");
          break;
        case SuggestionType.DataSource:
          header.label = i18n.getText("searchIn");
          break;
        case SuggestionType.SearchTermData:
        case SuggestionType.SearchTermHistory:
          header.label = i18n.getText("searchFor");
          break;
        case SuggestionType.SearchTermAI:
          header.label = i18n.getText("searchTermAIHeader");
          header.helpLink = this.model.config.aiSuggestionsHeaderHelpLink;
          break;
        case SuggestionType.Object:
          header.label = insertSuggestion.dataSource.labelPlural; // default label
          header.dataSource = insertSuggestion.dataSource;
          break;
      }
      if (insertSuggestion.isRecentEntry) {
        header.label = i18n.getText("label_recently_used");
      }
      header.position = insertSuggestion.position;
      header.suggestionResultSetCounter = this.suggestionResultSetCounter;
      header.uiSuggestionType = SuggestionType.Header;
      header.uiSuggestionTypeOfSuggestionsInSection = insertSuggestion.uiSuggestionType;
      return header;
    }

    // enable busy indicator suggestion (waiting for suggestions)
    // ===================================================================
    enableBusyIndicator(suggestions, enabled) {
      if (enabled) {
        // enable -> add busy indicator suggestions
        suggestions.push({
          position: SuggestionTypeProperties.properties[SuggestionType.BusyIndicator].position,
          uiSuggestionType: SuggestionType.BusyIndicator
        });
        return;
      }
      // disable -> remove busy indicator suggestion
      for (let i = 0; i < suggestions.length; ++i) {
        const suggestion = suggestions[i];
        if (suggestion.uiSuggestionType === SuggestionType.BusyIndicator) {
          suggestions.splice(i, 1);
          return;
        }
      }
    }

    // check for duplicate suggestion
    // ===================================================================
    checkDuplicate(suggestions, insertSuggestion) {
      const checkRelevancy = function (insertSuggestion) {
        return insertSuggestion.uiSuggestionType === SuggestionType.SearchTermHistory || insertSuggestion.uiSuggestionType === SuggestionType.SearchTermData && !insertSuggestion.dataSource;
      };
      if (!checkRelevancy(insertSuggestion)) {
        return {
          action: "append"
        };
      }
      for (let i = 0; i < suggestions.length; ++i) {
        const suggestion = suggestions[i];
        if (!checkRelevancy(suggestion)) {
          continue;
        }
        if (insertSuggestion.searchTerm === suggestion.searchTerm) {
          if (insertSuggestion.grouped && insertSuggestion.uiSuggestionType === SuggestionType.SearchTermData && suggestion.uiSuggestionType === SuggestionType.SearchTermHistory) {
            // for the top grouped suggestions: prefer data based suggestion
            // over history based suggestions because
            // - upper lower case of history and data based suggestions may differ
            // - upper lower case should be identical for all grouped suggestions
            return {
              action: "replace",
              index: i
            };
          }
          return {
            action: "skip"
          };
        }
      }
      return {
        action: "append"
      };
    }

    // insert suggestions
    // ===================================================================
    insertSuggestions(insertSuggestions, pending) {
      // get suggestions from model
      let suggestions = this.model.getProperty("/suggestions").slice(); // copy list (updateSuggestions needs to access old list via data binding)

      // unsorted insert of suggestions
      suggestions = this.insertIntoSuggestionList(insertSuggestions, suggestions);

      // adjust busy indicator
      if (!this.busyIndicator && pending > 0) {
        this.enableBusyIndicator(suggestions, true);
        this.busyIndicator = true;
      }
      if (this.busyIndicator && pending === 0) {
        this.enableBusyIndicator(suggestions, false);
        this.busyIndicator = false;
      }

      // sort
      this.sortSuggestions(suggestions);

      // remove suggestions if over limit
      // (limit needs to be done here because history and search term suggestions are merged)
      this.limitSuggestions(suggestions);

      // set suggestions in model
      this.updateSuggestions(suggestions);
      //this.model.setProperty('/suggestions', suggestions);
    }

    // insert into suggestion list
    // ===================================================================
    insertIntoSuggestionList(insertSuggestions, suggestions) {
      // do we need to replace?
      let flagReplace = false;
      if (this.firstInsertion) {
        this.firstInsertion = false;
        flagReplace = true;
      }

      // reset global fields
      if (flagReplace) {
        suggestions = [];
        this.suggestionHeaders = {};
        this.suggestionResultSetCounter = 0;
        this.generatedPositions = {
          maxPosition: SuggestionTypeProperties.properties[SuggestionType.Object].position,
          position: {}
        };
      }

      // increase result set counter (used for sorting)
      this.suggestionResultSetCounter += 1;

      // add sorting information to the suggestions
      for (let i = 0; i < insertSuggestions.length; ++i) {
        const insertSuggestion = insertSuggestions[i];

        // for object suggestions:
        // overwrite position by a generated position for grouping object suggestions by datasource
        // object suggestions from recent storage are not affected by this logic (they are displayed in the recent section)
        if (insertSuggestion.uiSuggestionType === SuggestionType.Object && !insertSuggestion.isRecentEntry) {
          let position = this.generatedPositions.position[insertSuggestion.dataSource.id];
          if (!position) {
            this.generatedPositions.maxPosition += 1;
            position = this.generatedPositions.maxPosition;
            this.generatedPositions.position[insertSuggestion.dataSource.id] = position;
          }
          insertSuggestion.position = position;
        }

        // set fields used in sorting
        insertSuggestion.suggestionResultSetCounter = this.suggestionResultSetCounter;
        insertSuggestion.resultSetPosition = i;

        // additional duplicate check for search term suggestions
        const duplicateCheckResult = this.checkDuplicate(suggestions, insertSuggestion);
        switch (duplicateCheckResult.action) {
          case "append":
            suggestions.push(insertSuggestion);
            break;
          case "skip":
            continue;
          case "replace":
            //var toBeReplacedSuggestion = suggestions[duplicateCheckResult.index];
            suggestions.splice(duplicateCheckResult.index, 1, insertSuggestion);
            //insertSuggestion.suggestionResultSetCounter = toBeReplacedSuggestion.suggestionResultSetCounter;
            //insertSuggestion.resultSetPosition = toBeReplacedSuggestion.resultSetPosition;
            break;
        }
        if (this.isHeaderGenerationEnabled() && !this.suggestionHeaders[insertSuggestion.position]) {
          suggestions.push(this.generateSuggestionHeader(insertSuggestion));
          this.suggestionHeaders[insertSuggestion.position] = true;
        }
      }
      return suggestions;
    }

    // check whether we need to generate headers
    // ===================================================================
    isHeaderGenerationEnabled() {
      // no headings for app datsource
      if (this.model.getDataSource() === this.model.appDataSource) {
        return false;
      }

      // no headings if bo suggestions are deactivated datasource is businessobject (connector)
      if (!this.model.config.boSuggestions && this.model.getDataSource().type === this.sinaNext.DataSourceType.BusinessObject) {
        return false;
      }
      return true;
    }

    // sort suggestions
    // ===================================================================
    sortSuggestions(suggestions) {
      suggestions.sort(function (s1, s2) {
        // position is main sort field
        let cmp = s1.position - s2.position;
        if (cmp !== 0) {
          return cmp;
        }

        // headers are always on top of each section
        if (s1.uiSuggestionType === SuggestionType.Header) {
          return -1;
        }
        if (s2.uiSuggestionType === SuggestionType.Header) {
          return 1;
        }

        // special: grouped search term suggestions on top
        // grouped: the first search term suggestion with sub suggestions by datasource
        // for instance: sally in All
        //               sally in Employees
        //               sally in Customers
        if (s1.grouped && !s2.grouped) {
          return -1;
        }
        if (!s1.grouped && s2.grouped) {
          return 1;
        }

        // sort by result set
        cmp = s1.suggestionResultSetCounter - s2.suggestionResultSetCounter;
        if (cmp !== 0) {
          return cmp;
        }

        // sort by position in result set
        cmp = s1.resultSetPosition - s2.resultSetPosition;
        return cmp;
      });
    }

    // get suggestion limit
    // ===================================================================
    getSuggestionLimit(uiSuggestionType) {
      const suggestionTypeData = SuggestionTypeProperties.properties[uiSuggestionType];
      if (typeof suggestionTypeData === "undefined") {
        return Infinity;
      }
      let limit;
      if (this.model.getDataSource() === this.model.sinaNext.allDataSource || this.model.getDataSource() === this.model.favDataSource) {
        limit = suggestionTypeData.limitDsAll;
      } else {
        limit = suggestionTypeData.limit;
      }
      return limit;
    }

    // limit suggestions
    // ===================================================================
    limitSuggestions(suggestions) {
      const numberSuggestions = {};
      for (let i = 0; i < suggestions.length; ++i) {
        const suggestion = suggestions[i];
        let suggestionType = suggestion.uiSuggestionType;
        if (suggestionType === SuggestionType.SearchTermHistory) {
          suggestionType = SuggestionType.SearchTermData; // history and data suggestions are merged
        }
        const limit = this.getSuggestionLimit(suggestionType);
        let number = numberSuggestions[suggestionType];
        if (typeof number === "undefined") {
          number = 0;
          numberSuggestions[suggestionType] = number;
        }
        if (number >= limit) {
          suggestions.splice(i, 1);
          --i;
          continue;
        }
        numberSuggestions[suggestionType] = number + 1;
      }
    }

    // update suggestions with restore old selected suggestion
    // ===================================================================
    updateSuggestions(suggestions) {
      const searchFieldInShellId = "searchFieldInShell-input";
      let input = Element.getElementById(searchFieldInShellId);
      if (!input) {
        input = this.model.getProperty("/inputHelp");
      }

      // get selected entry in old suggestion list
      const suggestionRows = input.getSuggestionRows();
      let suggestionKey;
      for (let i = 0; i < suggestionRows.length; ++i) {
        const suggestionRow = suggestionRows[i];
        const suggestion = suggestionRow.getBindingContext().getObject();
        if (suggestionRow.getSelected()) {
          suggestionKey = suggestion.key;
        }
      }

      // update suggestions
      this.model.setProperty("/suggestions", suggestions);

      // restore selected entry (ugly time delayed logic)
      if (!suggestionKey) {
        return;
      }
      window.setTimeout(() => {
        const suggestionRows = input.getSuggestionRows();
        for (let j = 0; j < suggestionRows.length; ++j) {
          const suggestionRow = suggestionRows[j];
          const suggestion = suggestionRow.getBindingContext().getObject();
          if (suggestion.key === suggestionKey) {
            input["_oSuggPopover"]._iPopupListSelectedIndex = j; // ugly
            suggestionRow.setSelected(true);
            suggestionRow.rerender();
          }
        }
      }, 100);
    }
  }
  return SuggestionHandler;
});
})();