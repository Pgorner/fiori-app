/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./i18n", "sap/base/Log", "./error/ErrorHandler", "sap/esh/search/ui/SearchHelper", "sap/ui/model/json/JSONModel", "sap/esh/search/ui/SearchResultFormatter", "sap/esh/search/ui/SearchTabStripsFormatter", "sap/esh/search/ui/SearchResultTableFormatter", "sap/esh/search/ui/SearchFacetsFormatter", "sap/esh/search/ui/BreadcrumbsFormatter", "sap/esh/search/ui/suggestions/SuggestionHandler", "sap/esh/search/ui/SearchConfiguration", "sap/esh/search/ui/personalization/PersonalizationStorage", "sap/esh/search/ui/personalization/keyValueStoreFactory", "sap/esh/search/ui/eventlogging/EventLogger", "sap/esh/search/ui/SearchUrlParser", "sap/esh/search/ui/cFLPUtil", "sap/esh/search/ui/usercategories/UserCategoryManager", "sap/esh/search/ui/error/errors", "sap/esh/search/ui/RecentlyUsedStorage", "./eventlogging/UserEvents", "./sinaNexTS/sina/SinaConfiguration", "./sinaNexTS/sina/sinaFactory", "./sinaNexTS/core/Log", "./SearchResultItemMemory", "./FolderModeUtils", "sap/ui/core/message/MessageType", "./sinaNexTS/sina/HierarchyDisplayType", "./UIEvents", "./SearchShellHelperHorizonTheme", "./SearchConfigurationSettings", "sap/base/util/merge", "sap/base/assert", "sap/ui/Device", "sap/ui/core/EventBus", "./BusyIndicator", "./sinaNexTS/sina/Filter", "./SinaConfigurator", "./UrlUtils", "./suggestions/SearchSuggestionFactory", "./PublicSearchModel", "./personalization/PersonalizationKeys"], function (__i18n, Log, __ErrorHandler, SearchHelper, JSONModel, SearchResultFormatter, sap_esh_search_ui_SearchTabStripsFormatter, SearchResultTableFormatter, SearchFacetsFormatter, BreadcrumbsFormatter, SuggestionHandler, SearchConfiguration, PersonalizationStorage, keyValueStoreFactory, EventLogger, SearchUrlParser, cFLPUtil, UserCategoryManager, errors, RecentlyUsedStorage, ___eventlogging_UserEvents, ___sinaNexTS_sina_SinaConfiguration, sinaFactory, ___sinaNexTS_core_Log, __SearchResultSetItemMemory, ___FolderModeUtils, MessageType, ___sinaNexTS_sina_HierarchyDisplayType, __UIEvents, __SearchShellHelperHorizonTheme, ___SearchConfigurationSettings, merge, assert, Device, EventBus, ___BusyIndicator, ___sinaNexTS_sina_Filter, ___SinaConfigurator, ___UrlUtils, ___suggestions_SearchSuggestionFactory, __PublicSearchModel, ___personalization_PersonalizationKeys) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const i18n = _interopRequireDefault(__i18n);
  const ErrorHandler = _interopRequireDefault(__ErrorHandler);
  const SearchTabStripsFormatter = sap_esh_search_ui_SearchTabStripsFormatter["Formatter"];
  const UrlParseError = errors["UrlParseError"];
  const UserEventType = ___eventlogging_UserEvents["UserEventType"];
  const AvailableProviders = ___sinaNexTS_sina_SinaConfiguration["AvailableProviders"];
  const Severity = ___sinaNexTS_core_Log["Severity"];
  const SearchResultSetItemMemory = _interopRequireDefault(__SearchResultSetItemMemory);
  const FolderModeResultViewTypeCalculator = ___FolderModeUtils["FolderModeResultViewTypeCalculator"];
  const HierarchyDisplayType = ___sinaNexTS_sina_HierarchyDisplayType["HierarchyDisplayType"];
  const UIEvents = _interopRequireDefault(__UIEvents);
  const SearchShellHelperHorizonTheme = _interopRequireDefault(__SearchShellHelperHorizonTheme);
  const sinaParameters = ___SearchConfigurationSettings["sinaParameters"];
  const BusyIndicator = ___BusyIndicator["BusyIndicator"];
  const Filter = ___sinaNexTS_sina_Filter["Filter"];
  const SinaConfigurator = ___SinaConfigurator["SinaConfigurator"];
  const renderUrlFromParameters = ___UrlUtils["renderUrlFromParameters"];
  const createSearchSuggestionForCurrentSearch = ___suggestions_SearchSuggestionFactory["createSearchSuggestionForCurrentSearch"];
  const PublicSearchModel = _interopRequireDefault(__PublicSearchModel);
  const PersonalizationKeys = ___personalization_PersonalizationKeys["PersonalizationKeys"]; // declare global {
  //     interface Window {
  //         sap: {
  //             base: {
  //                 i18n: {
  //                     ResourceBundle: unknown;
  //                 };
  //             };
  //             cf: unknown;
  //             ushell: {
  //                 Container: Container & {
  //                     getLogonSystem: () => {
  //                         getClient: () => string;
  //                         getName: () => string;
  //                     };
  //                 };
  //             };
  //         };
  //     }
  // }
  /**
   * @namespace sap.esh.search.ui
   */
  const SearchModel = JSONModel.extend("sap.esh.search.ui.SearchModel", {
    constructor: function _constructor(settings) {
      JSONModel.prototype.constructor.call(this, []);
      this.searchTermHandlers = [];
      this.logger = Log.getLogger("sap.esh.search.ui.SearchModel");
      JSONModel.prototype.setProperty.call(this, "/errors", []);
      this.errorHandler = ErrorHandler.getInstance();
      this.errorHandler.setSearchModel(this);
      const oSettings = settings || {};

      // get search configuration
      this.config = new SearchConfiguration(oSettings?.configuration);
      this.errorHandler.setExternalOnErrorHandler(this.config.onErrorHandler);

      // public search model
      this.publicSearchModel = new PublicSearchModel({
        modelName: PublicSearchModel.defaultModelName,
        internalSearchModel: this
      });
      // memory for result set items storing for instance expansion state of item
      this.searchResultSetItemMemory = new SearchResultSetItemMemory();

      // set size limit in order to allow drop down list boxes with more than 100 entries
      this.setSizeLimit(1000);

      // create suggestions handler
      this._suggestionHandler = new SuggestionHandler({
        model: this
      });

      // result view type calculator for folder mode
      this.folderModeResultViewTypeCalculator = new FolderModeResultViewTypeCalculator(this);
      this._performanceLoggerSearchMethods = []; // performance logging: Remember all method names of (open) search calls (only needed if search calls are running in parallel)

      // decorate search methods (decorator prevents request overtaking)
      this._searchApplicationsRefuseOutdatedReq = SearchHelper.refuseOutdatedRequests(this.searchApplications.bind(this), "search"); // app search

      // initial values for boTop and appTop
      this.pageSize = this.config.pageSize || 10;
      this.appTopDefault = 20;
      this.boTopDefault = this.pageSize;
      this.filterChanged = false;

      // init busy indicator
      this.busyIndicator = new BusyIndicator(this);

      // init the properties
      // TODO: always use main result list (also for pure app results)

      this.setProperty("/isQueryInvalidated", true); // force request if query did not change
      this.setProperty("/busyDelay", 0); // delay before showing busy indicator, initalize with 0 for intial app loading
      this.setProperty("/sortableAttributes", []); // sort items of result
      this.setProperty("/results", []); // combined result list: apps + BOs
      this.setProperty("/appResults", []); // applications result list
      this.setProperty("/boResults", []); // business object result list
      this.resetTableData();
      this.setProperty("/breadcrumbsHierarchyNodePaths", []);
      this.setProperty("/breadcrumbsHierarchyAttribute", "");
      this.setProperty("/hierarchyNodePaths", []);
      this.setProperty("/isFolderMode", false);
      this.setProperty("/origBoResults", []); // business object result list
      this.setProperty("/count", 0);
      this.setProperty("/countText", "");
      this.setProperty("/boCount", 0);
      this.setProperty("/appCount", 0);
      this.setProperty("/facets", []);
      this.setProperty("/dataSources", [this.allDataSource, this.appDataSource]);
      this.setProperty("/appSearchDataSource", null);
      this.setProperty("/currentPersoServiceProvider", null); // current persoServiceProvider of table
      this.setProperty("/businessObjSearchEnabled", true);
      this.setProperty("/initializingObjSearch", false);
      this.setProperty("/suggestions", []);
      this.setProperty("/resultViewTypes", []); // selectable result view types
      this.setProperty("/resultViewType", ""); // active result view type, default value set in calculateResultViewSwitchVisibility() in initBusinessObjSearch
      this.setProperty("/resultViewSwitchVisibility", false); // visibility of display switch tap strip
      this.setProperty("/documentTitle", "Search");
      this.setProperty("/top", this.boTopDefault);
      this.setProperty("/orderBy", {});
      this.setProperty("/facetVisibility", false); // visibility of facet panel
      this.setProperty("/focusIndex", 0);
      this.setProperty("/isErrorPopovered", false);
      this.setProperty("/nlqExplanation", {});
      this.setProperty("/nlqResult", {
        success: false,
        filterDescription: ""
      });
      this.setProperty("/firstSearchWasExecuted", false);
      this.setProperty("/multiSelectionAvailable", false); //
      this.setProperty("/multiSelectionEnabled", false); //
      this.setProperty("/multiSelection/actions", []); //
      this.setProperty("/multiSelectionSelected", false);
      this.setProperty("/multiSelectionObjects", []);
      this.setProperty("/singleSelectionSelected", false);
      this.setProperty("/inputHelpSelectedItems", null);
      this.setProperty("/inputHelp", null);
      this.setProperty("/config", this.config);
      this.setProperty("/searchInLabel", "");
      this.setProperty("/searchInIcon", "sap-icon://none"); // prevent assert: Property 'src' (value: '') should be a valid Icon ...'

      this.setProperty("/searchButtonStatus", "Search");
      this.setProperty("/isNlqActive", false);
      this._subscribers = [];
      this.searchUrlParser = new SearchUrlParser({
        model: this
      });
      this._userCategoryManagerPromise = null;
      this._tempDataSources = [];
      this.tableFormatter = undefined;

      // used for SearchFacetDialogModel: SearchFacetDialogModel is constructed with reference to original searchModel
      // the _initBusinessObjSearchProm is reused from original searchModel in order to avoid double initialization
      // in initBusinessObjSearch
      if (oSettings?.searchModel?.initAsyncPromise) {
        this.initAsyncPromise = oSettings.searchModel.initAsyncPromise;
        this.oFacetFormatter = new SearchFacetsFormatter(this);
      }

      // Rest of the initialization is done asynchronously:
      this.initializationStatus = this.initAsync();
      this.initAsyncPromise = this.initializationStatus.catch(() => {
        // ignore the error, it has already been written to browser console
        // and staged in this.initializationStatus which can be queried by this.getInitializationStatus()
        // we cannot use "return Promise.reject(error) here, as we are in a constructor"
      });
    },
    // Get the status of initialization. In unsuccessful case, the corresponding error instance is returned either for error handling.
    // published further in SearchCompositeControl as a public API
    getInitializationStatus: async function _getInitializationStatus() {
      try {
        await this.initializationStatus;
        return {
          success: true
        };
      } catch (e) {
        return {
          success: false,
          error: e
        };
      }
    },
    // ################################################################################
    // Initialization:
    // ################################################################################
    initAsync: async function _initAsync() {
      // check cached promise
      if (this.initAsyncPromise) {
        return this.initAsyncPromise;
      }

      // set dummy datasource indicating the loading phase
      this.setProperty("/initializingObjSearch", true);
      this.busyIndicator.setBusy(true);
      const dummyDataSourceForLoadingPhase = {
        label: i18n.getText("genericLoading"),
        labelPlural: i18n.getText("genericLoading"),
        enabled: false,
        id: "$$Loading$$"
      };
      this.setProperty("/dataSource", dummyDataSourceForLoadingPhase);
      this.setProperty("/dataSources", [dummyDataSourceForLoadingPhase]);
      try {
        const keyValueStore = await keyValueStoreFactory.create(this.config.personalizationStorage, this.config.isUshell, this.config.id);
        this.setPersonalizationStorageInstance(new PersonalizationStorage(keyValueStore, this));
        if (this.config.bRecentSearches) {
          this.recentlyUsedStorage = new RecentlyUsedStorage({
            personalizationStorage: this._personalizationStorage,
            searchModel: this
          });
        }
        this.initFacetVisibility();
        // console.log(`initFacetVisibility: ${new Date().toTimeString()}`);

        // sina and datasources:
        this.sinaNext = await this.createSina();
        this.sinaNext.createSearchNavigationTarget = this.createSearchNavigationTarget.bind(this);
        this.createAllAndAppDataSource();
        this.calculateIsNlqActive();
        // my favorites:
        if (this.isMyFavoritesAvailable()) {
          this.userCategoryManager = await UserCategoryManager.create({
            sina: this.sinaNext,
            personalizationStorage: this._personalizationStorage
          });
        }

        // usage tracking:
        const loggerProperties = {
          sinaNext: this.sinaNext,
          searchModel: this,
          eventConsumers: this.config.eventConsumers
        };
        this.eventLogger = new EventLogger(loggerProperties);
        await this.eventLogger.initAsync();
        const userEventSessionStart = {
          type: UserEventType.SESSION_START
        };
        this.eventLogger.logEvent(userEventSessionStart);

        // set default DataSource
        this.setProperty("/defaultDataSource", this.calculateDefaultDataSource());
        if (this.sinaNext.provider.id === "dummy") {
          this.setProperty("/defaultDataSource", this.appDataSource);
          this.setProperty("/businessObjSearchEnabled", false);
          this.config.searchBusinessObjects = false;
          this.setFacetVisibility(false, false);
        }
        if (this.sinaNext.provider.id === "inav2" && this.config.isUshell) {
          // register enterprise search system
          // this triggers a logoff request to the enteprise search backend in case of logoff from flp
          // (this is not necessary for abap_odata because frontendserver system is registered by flp)
          // load ushell deps lazy only in case of FLP
          sap.ui.require(["sap/ushell/System"], SystemConstructionFunction => {
            sap.ushell["Container"].addRemoteSystem(new SystemConstructionFunction({
              alias: "ENTERPRISE_SEARCH",
              platform: "abap",
              baseUrl: "/ENTERPRISE_SEARCH"
            }));
          });
        }
        this.setProperty("/uiFilter", this.sinaNext.createFilter());
        this.loadDataSources();
        this.resetDataSource(false);
        this.resetAllFilterConditions(false);
        // this.config.loadCustomModulesAsync();
        this.query = this.sinaNext.createSearchQuery({
          limitAjaxRequests: this.config.limitAjaxRequests
        });
        this.query.setMultiSelectFacets(true);
        this.oFacetFormatter = new SearchFacetsFormatter(this);
        this._tabStripFormatter = new SearchTabStripsFormatter(this.allDataSource, this);
        this._breadcrumbsFormatter = new BreadcrumbsFormatter.Formatter(this);
        this.dataSourceTree = this._tabStripFormatter.tree;
        // set by the API of SearchCompositeControl
        this.setSearchBoxTerm(this.config.searchTerm, false);
        if (this.config.exclusiveDataSource) {
          this.setDataSourceById(this.config.exclusiveDataSource, false, false);
        } else if (this.config.dataSource) {
          this.setDataSourceById(this.config.dataSource, false, false);
        }
        if (this.config.filterRootCondition) {
          this.setFilterRootCondition(this.config.filterRootCondition);
        }
        this.setProperty("/initializingObjSearch", false);
        this.busyIndicator.setBusy(false);
        try {
          await this.config.initAsync(this);
        } catch (e) {
          this.errorHandler.onError(e);
        }
        if (window.sap?.ushell?.Container) {
          this.uShellVisualizationInstantiationService = await window.sap.ushell.Container.getServiceAsync("VisualizationInstantiation");
        }
        // if (this.config.isUshell) {
        //     // handle transactions only in ushell:
        //     this.searchTermHandlers.push(new TransactionsHandler(this));
        // }
      } catch (error) {
        this.errorHandler.onError(error);
        return Promise.reject(error);
      } finally {
        this.busyIndicator.setBusy(false);
      }
      return Promise.resolve();
    },
    createSina: async function _createSina() {
      // no enterprise search configured -> return dummy sina
      if (!this.config.searchBusinessObjects) {
        return sinaFactory.createAsync("dummy");
      }
      // use url parameter
      // sinaConfiguration={"provider":"multi","subProviders":["abap_odata","inav2","sample"],"federationType":"round_robin"}
      // to active the multi provider
      let trials = [];
      if (window.location.href.indexOf("demo/FioriLaunchpad.") !== -1) {
        trials = [AvailableProviders.SAMPLE];
      } else {
        trials = [
        // {provider: 'multi', subProviders: ['abap_odata', 'inav2', 'sample'], federationType: 'round_robin'},
        // {provider: "multi", subProviders: [{ provider: "abap_odata", label: "a1", url: "/unvalid" }, { provider: "abap_odata", label: "a2", url: "/unvalid" }]},
        AvailableProviders.ABAP_ODATA, AvailableProviders.INAV2, AvailableProviders.DUMMY];
      }

      // cFlp
      trials = await cFLPUtil.readCFlpConfiguration(trials);

      // sina configuration from flp overwrites
      if (this.config.sinaConfiguration) {
        trials = [this.config.sinaConfiguration];
      }

      // enhance sina configuration by logging, tracking, ...
      const sinaConfigurator = new SinaConfigurator(this);
      trials = sinaConfigurator.configure(trials);

      // try to create a sina by trying providers, first succesful provider wins
      const sina = await sinaFactory.createByTrialAsync(trials);
      if (sina.hasErrors()) {
        sina.getErrors().forEach(error => this.errorHandler.onError(error));
      }
      return sina;
    },
    mixinSearchConfigurationIntoSinaConfiguration: function _mixinSearchConfigurationIntoSinaConfiguration(sinaConfigurations) {
      const resultSinaConfigurations = [];
      for (let i = 0; i < sinaConfigurations.length; ++i) {
        let sinaConfiguration = sinaConfigurations[i];
        if (typeof sinaConfiguration === "string") {
          sinaConfiguration = {
            provider: sinaConfiguration,
            url: ""
          };
        }
        this.configureSinaCommonParameters(sinaConfiguration);
        this.configureSinaLogging(sinaConfiguration);
        resultSinaConfigurations.push(sinaConfiguration);
      }
      return resultSinaConfigurations;
    },
    configureSinaCommonParameters: function _configureSinaCommonParameters(sinaConfiguration) {
      for (const parameterName of sinaParameters) {
        if (!sinaConfiguration[parameterName]) {
          sinaConfiguration[parameterName] = this.config[parameterName];
        }
      }
    },
    configureSinaLogging: function _configureSinaLogging(sinaConfiguration) {
      const sinaUI5Log = Log.getLogger("sap.esh.search.ui.sina");
      // log target
      sinaConfiguration.logTarget = {
        debug: sinaUI5Log.debug,
        info: sinaUI5Log.info,
        warn: sinaUI5Log.warning,
        error: sinaUI5Log.error
      };
      // map UI5 loglevel to Sina loglevel:
      let sinaLogLevel = Severity.ERROR;
      switch (sinaUI5Log.getLevel()) {
        case Log.Level.ALL:
        case Log.Level.TRACE:
        case Log.Level.DEBUG:
          sinaLogLevel = Severity.DEBUG;
          break;
        case Log.Level.INFO:
          sinaLogLevel = Severity.INFO;
          break;
        case Log.Level.WARNING:
          sinaLogLevel = Severity.WARN;
          break;
      }
      sinaConfiguration.logLevel = sinaLogLevel;
    },
    /**
     *
     * @deprecated use initAsync() instead
     */
    initBusinessObjSearch: async function _initBusinessObjSearch() {
      return this.initAsync();
    },
    calculateDefaultDataSource: function _calculateDefaultDataSource() {
      let defaultDataSource = this.allDataSource;
      if (this.config.defaultSearchScopeApps) {
        // according config parameter, Apps as default
        defaultDataSource = this.appDataSource;
      }
      if (this.config.defaultDataSource) {
        // according config parameter, default dataSource id
        defaultDataSource = this.sinaNext.getDataSource(this.config.defaultDataSource);
      }
      if (this.config.exclusiveDataSource) {
        // according config parameter, exclusive dataSource id (the one and only DS used for this Search.Comp. control instance)
        defaultDataSource = this.sinaNext.getDataSource(this.config.exclusiveDataSource);
      }
      if (this.userCategoryManager && this.userCategoryManager.isFavActive()) {
        // set user definded dataSource as default
        defaultDataSource = this.userCategoryManager.getCategory("MyFavorites");
      }
      return defaultDataSource;
    },
    initFacetVisibility: function _initFacetVisibility() {
      // check configuration
      if (this.config.optimizeForValueHelp) {
        this.setFacetVisibility(false, false);
        return;
      }
      // else if (typeof this.config.facetVisibility !== "undefined") {
      //     this.setFacetVisibility(this.config.facetVisibility, false);
      //     return;
      // }
      // check personalization
      let facetsVisible = this.config.facetVisibility;
      try {
        facetsVisible = this._personalizationStorage.getItem(PersonalizationKeys.searchFacetPanelButtonState) ?? this.config.facetVisibility;
      } catch (e) {
        this.logger.warning("Error reading facet visibility from personalization storage", e);
      }
      this.setFacetVisibility(facetsVisible, false);
    },
    // ################################################################################
    // Get the state of things:
    // ################################################################################
    isBusinessObjSearchConfigured: function _isBusinessObjSearchConfigured() {
      try {
        const config = window["sap-ushell-config"].renderers.fiori2.componentData.config;
        return config.searchBusinessObjects !== "hidden";
      } catch (e) {
        this.logger.debug("Error reading searchBusinessObjects from ushell config", e);
        return true;
      }
    },
    isBusinessObjSearchEnabled: function _isBusinessObjSearchEnabled() {
      // TODO: how does this differ from isBusinessObjSearchConfigured() above?
      return this.getProperty("/businessObjSearchEnabled");
    },
    // ################################################################################
    // Getter/Setter:
    // ################################################################################
    setProperty: function _setProperty(sPath, oValue, oContext, bAsyncUpdate) {
      return this.setPropertyInternal(sPath, oValue, oContext, bAsyncUpdate, true);
    },
    setPropertyInternal: function _setPropertyInternal(sPath, oValue, oContext, bAsyncUpdate, bUpdatePublicModel = true) {
      try {
        if (sPath === "/resultViewType") {
          // run before updating '/resultViewType'
          if (this.getProperty("/resultViewType") !== "" && oValue !== "" && this.getProperty("/resultViewType") !== oValue) {
            // notify subscribers
            this.notifySubscribers(UIEvents.ESHResultViewTypeChanged);
            EventBus.getInstance().publish(UIEvents.ESHResultViewTypeChanged);
          }
        }
        let success = JSONModel.prototype.setProperty.call(this, sPath, oValue, oContext, bAsyncUpdate);
        switch (sPath) {
          case "/boResults":
          case "/appResults":
            this.calculateResultList();
            break;
          case "/appCount":
          case "/boCount":
            success = this.setProperty("/count", this.getProperty("/appCount") + this.getProperty("/boCount"));
            break;
          case "/count":
            success = this.setProperty("/countText", this._calculateCountText());
            break;
          case "expanded":
            if (oContext && oContext.getPath().startsWith("/results/")) {
              const object = oContext.getObject();
              if (object.key && typeof oValue === "boolean") {
                const searchResultSetItem = object;
                this.searchResultSetItemMemory.setExpanded(searchResultSetItem.key, oValue);
              }
            }
            break;
        }
        if (bUpdatePublicModel) {
          // update public search model (see PublicSearchModel), non public properties are skipped (w/o error/warning)
          this.publicSearchModel.setPropertyFromInternalModel(this, sPath, oValue, oContext, bAsyncUpdate);
        }
        return success;
      } catch (error) {
        this.errorHandler.onError(error);
      }
    },
    _calculateCountText: function _calculateCountText() {
      const count = this.getProperty("/count");
      if (typeof count !== "number") {
        return ""; // robustness
      }
      const countAsStr = SearchHelper.formatInteger(count);

      // DWC exit
      if (this.getProperty("/searchInLabel")) {
        return (this.getProperty("/searchInLabel") || i18n.getText("results")) + " (" + countAsStr + ")";
      }
      const text = i18n.getText("results") + " (" + countAsStr + ")"; // ToDo: RTL
      return text;
    },
    getSearchCompositeControlInstanceByChildControl: function _getSearchCompositeControlInstanceByChildControl(childControlInstance) {
      if (typeof childControlInstance?.hasStyleClass === "function" && childControlInstance.hasStyleClass("sapUshellSearchInputHelpPage")) {
        return childControlInstance;
      } else if (typeof childControlInstance?.getParent === "function") {
        return this.getSearchCompositeControlInstanceByChildControl(childControlInstance.getParent());
      }
      return undefined;
    },
    getPersonalizationStorageInstance: function _getPersonalizationStorageInstance() {
      return this._personalizationStorage;
    },
    setPersonalizationStorageInstance: function _setPersonalizationStorageInstance(personalizationStorage) {
      this._personalizationStorage = personalizationStorage;
    },
    // TODO: move to datasource
    getSearchBoxTerm: function _getSearchBoxTerm() {
      return this.getProperty("/uiFilter/searchTerm") || "";
    },
    setSearchBoxTerm: function _setSearchBoxTerm(searchTerm, fireQuery) {
      searchTerm = searchTerm || "";
      const searchTermTrimLeft = searchTerm.replace(/^\s+/, ""); // TODO: rtl
      this.setProperty("/uiFilter/searchTerm", searchTermTrimLeft);
      this.calculateSearchButtonStatus();
      if (fireQuery || typeof fireQuery === "undefined") {
        this.fireSearchQuery();
      }
    },
    getLastSearchTerm: function _getLastSearchTerm() {
      return this.query.getSearchTerm();
    },
    setFacetVisibility: function _setFacetVisibility(visibility, fireQuery) {
      if (Device.system.phone) {
        visibility = false;
      }

      // set new value
      this.setProperty("/facetVisibility", visibility);

      // set button status in sap storage
      try {
        this._personalizationStorage.setItem(PersonalizationKeys.searchFacetPanelButtonState, visibility);
      } catch (e) {
        this.logger.warning("Error writing facet visibility to personalization storage", e);
      }
      if (fireQuery || typeof fireQuery === "undefined") {
        this.fireSearchQuery({
          preserveFormerResults: true
        });
      }
    },
    getFacetVisibility: function _getFacetVisibility() {
      return this.getProperty("/facetVisibility");
    },
    getTop: function _getTop() {
      return this.getProperty("/top");
    },
    setTop: function _setTop(top, fireQuery) {
      if (top < 0) {
        this.resetTop();
        this.errorHandler.onError(new Error(`Could not set 'top' with value '${top}'.\nWe will use default value '${this.getProperty("/top")}' instead.`));
      } else {
        this.setProperty("/top", top);
      }
      if (fireQuery || typeof fireQuery === "undefined") {
        this.fireSearchQuery({
          preserveFormerResults: true
        });
      }
    },
    resetTop: function _resetTop() {
      this.setProperty("/focusIndex", 0);
      if (this.isAppCategory() || this.isUserCategory() && this.userCategoryManager && this.userCategoryManager.getCategory("MyFavorites").subDataSources.length === 0) {
        this.setTop(this.appTopDefault, false);
      } else {
        this.setTop(this.boTopDefault, false);
      }
    },
    getOrderBy: function _getOrderBy() {
      return this.getProperty("/orderBy");
    },
    setOrderBy: function _setOrderBy(orderBy, fireQuery) {
      this.setProperty("/orderBy", orderBy);
      this.updateSortableAttributesSelection(orderBy.orderBy);
      if (fireQuery || typeof fireQuery === "undefined") {
        this.fireSearchQuery({
          preserveFormerResults: true
        });
      }
    },
    resetOrderBy: function _resetOrderBy(fireQuery) {
      this.setProperty("/orderBy", {});
      this.updateSortableAttributesSelection();
      if (fireQuery || typeof fireQuery === "undefined") {
        this.fireSearchQuery({
          preserveFormerResults: true
        });
      }
    },
    updateSortableAttributesSelection: function _updateSortableAttributesSelection(orderBy) {
      const sortableAttributes = this.getProperty("/sortableAttributes");
      if (sortableAttributes.length === 0) {
        return;
      }
      // unselect all attributes
      for (let i = 0; i < sortableAttributes.length; i++) {
        sortableAttributes[i].selected = false;
      }
      // select one attribute
      const orderById = orderBy === undefined ? "DEFAULT_SORT_ATTRIBUTE" : orderBy;
      for (let i = 0; i < sortableAttributes.length; i++) {
        if (sortableAttributes[i].attributeId === orderById) {
          sortableAttributes[i].selected = true;
        }
      }
      this.setProperty("/sortableAttributes", sortableAttributes);
    },
    isEqualOrderBy: function _isEqualOrderBy(modelOrderBy, queryOrderBy) {
      // 1) no sort order given
      if (!modelOrderBy.orderBy) {
        return queryOrderBy.length === 0;
      }
      // 2) sort order given
      if (queryOrderBy.length !== 1) {
        return false;
      }
      const queryOrderByElement = queryOrderBy[0];
      if (queryOrderByElement.id !== modelOrderBy.orderBy) {
        return false;
      }
      if (modelOrderBy.sortOrder === "ASC") {
        return queryOrderByElement.order === this.sinaNext.SortOrder.Ascending;
      }
      return queryOrderByElement.order === this.sinaNext.SortOrder.Descending;
    },
    isMyFavoritesAvailable: function _isMyFavoritesAvailable() {
      let isAvailable = false;
      if (this.sinaNext.provider.id === "abap_odata") {
        isAvailable = true;
      }
      if (this.sinaNext.provider.id === "multi" && this.config.userDefinedDatasourcesMulti) {
        isAvailable = true;
      }
      return isAvailable;
    },
    calculateIsNlqActive: function _calculateIsNlqActive() {
      const nlqActiveInUserSettings = !this.config.isUshell || this.getPersonalizationStorageInstance().getItem(PersonalizationKeys.nlqActive); // only ushell has user settings
      const isNlqActive = this.config.aiNlq &&
      // config setting
      this.sinaNext.capabilities.nlq &&
      // server capability
      nlqActiveInUserSettings; // user setting
      this.setProperty("/isNlqActive", isNlqActive);
    },
    isNlqActive: function _isNlqActive() {
      return this.getProperty("/isNlqActive");
    },
    getDocumentTitle: function _getDocumentTitle() {
      const searchTerm = this.getSearchBoxTerm();
      const dataSourceLabel = this.getDataSource().labelPlural || this.getDataSource().label;
      let title;
      if (this.getDataSource() === this.allDataSource) {
        title = i18n.getText("searchTileTitleProposalAll", [searchTerm]);
      } else {
        title = i18n.getText("searchTileTitleProposal", [searchTerm, dataSourceLabel]);
      }
      return title;
    },
    resetQuery: function _resetQuery() {
      // This resets the UI search model but not sina.
      // Deserializing a URL may NOT trigger a real ajax search request because also sina buffers the search results.
      // This is used for for back navigation from an object page to the search UI without triggering a new search request.
      if (this.getProperty("/initializingObjSearch")) {
        return;
      }
      SearchHelper.hasher.reset();
      this.resetTop();
      this.setSearchBoxTerm("", false);
      this.resetDataSource(false);
      this.resetAllFilterConditions(false);
      this.query.resetConditions();
      this.query.setSearchTerm("random-jgfhfdskjghrtekjhg");
      this.setProperty("/facets", []);
      this.setProperty("/results", []); // also resets public search model
      this.setProperty("/appResults", []);
      this.setProperty("/boResults", []);
      this.setProperty("/breadcrumbsHierarchyNodePaths", []);
      this.setProperty("/breadcrumbsHierarchyAttribute", "");
      this.setProperty("/hierarchyNodePaths", []);
      this.setProperty("/isFolderMode", false);
      this.setProperty("/origBoResults", []);
      this.setProperty("/count", 0);
      this.setProperty("/boCount", 0);
      this.setProperty("/appCount", 0);
      this.setProperty("/nlqResult", {
        success: false,
        filterDescription: ""
      });
    },
    resetSearchResultItemMemory: function _resetSearchResultItemMemory() {
      this.searchResultSetItemMemory.reset();
    },
    // ################################################################################
    // Everything Datasource:
    // ################################################################################
    createAllAndAppDataSource: function _createAllAndAppDataSource() {
      // all data source
      this.allDataSource = this.sinaNext.getAllDataSource();
      this.allDataSource.label = i18n.getText("label_all");
      this.allDataSource.labelPlural = i18n.getText("label_all");

      // app datasource
      this.appDataSource = this.sinaNext._createDataSource({
        id: "$$APPS$$",
        label: i18n.getText("label_apps"),
        labelPlural: i18n.getText("label_apps"),
        type: this.sinaNext.DataSourceType.Category
      });
      this.setProperty("/appSearchDataSource", this.appDataSource);
    },
    getUserCategoryManager: async function _getUserCategoryManager() {
      // caching
      if (this._userCategoryManagerPromise) {
        return this._userCategoryManagerPromise;
      }
      // create
      this._userCategoryManagerPromise = this.initAsync().then(() => {
        return this.userCategoryManager;
      });
      return this._userCategoryManagerPromise;
    },
    loadDataSources: function _loadDataSources() {
      // get all datasources from sina
      let dataSources = this.sinaNext.getBusinessObjectDataSources();
      dataSources = dataSources.slice();

      // exclude app search datasource (here: app search datasource = connector with transactions)
      let displayedDataSources = [];
      dataSources.forEach(function (dataSource) {
        if (!dataSource.usage.appSearch) {
          displayedDataSources.push(dataSource);
        }
      });
      // check "Use Personalized Search Scope" is active
      if (this.userCategoryManager && this.userCategoryManager.isFavActive()) {
        displayedDataSources.splice(0, 0, this.userCategoryManager.getCategory("MyFavorites"));
        this.favDataSource = this.userCategoryManager.getCategory("MyFavorites");
      }
      // add app and all datasource
      if (this.config.isUshell) {
        displayedDataSources.splice(0, 0, this.appDataSource);
      }
      if (!this.config.searchScopeWithoutAll) {
        displayedDataSources.splice(0, 0, this.allDataSource);
      } else {
        if (!this.config.defaultDataSource && (!this.userCategoryManager || this.userCategoryManager && !this.userCategoryManager.isFavActive())) {
          // without all dataSource and no default dataSource, set the first item as default
          this.setProperty("/defaultDataSource", displayedDataSources[0]);
        }
      }
      // exit for filtering datasources
      try {
        displayedDataSources = this.config.filterDataSources(displayedDataSources);
      } catch (e) {
        this.errorHandler.onError(e);
      }
      // set property
      this.setProperty("/dataSources", displayedDataSources);
      this.setProperty("/searchTermPlaceholder", this.calculatePlaceholder());
    },
    resetDataSource: function _resetDataSource(fireQuery) {
      this.setDataSource(this.getDefaultDataSource(), fireQuery);
    },
    isAllCategory: function _isAllCategory() {
      const ds = this.getProperty("/uiFilter/dataSource");
      return ds === this.allDataSource;
    },
    isOtherCategory: function _isOtherCategory() {
      const ds = this.getProperty("/uiFilter/dataSource");
      return (ds.type === this.sinaNext.DataSourceType.Category || ds.type === this.sinaNext.DataSourceType.UserCategory) && !this.isAllCategory();
    },
    isAppCategory: function _isAppCategory() {
      const ds = this.getProperty("/uiFilter/dataSource");
      return ds === this.appDataSource;
    },
    isUserCategory: function _isUserCategory() {
      const ds = this.getProperty("/uiFilter/dataSource");
      return ds.type === this.sinaNext.DataSourceType.UserCategory;
    },
    isBusinessObject: function _isBusinessObject() {
      return this.getProperty("/uiFilter/dataSource").type === this.sinaNext.DataSourceType.BusinessObject;
    },
    isUserCategoryAppSearchOnlyWithoutBOs: function _isUserCategoryAppSearchOnlyWithoutBOs() {
      return this.isUserCategory() && this.userCategoryManager && this.userCategoryManager.getCategory("MyFavorites").subDataSources.length === 0;
    },
    getDataSource: function _getDataSource() {
      return this.getProperty("/uiFilter/dataSource");
    },
    getDefaultDataSource: function _getDefaultDataSource() {
      return this.getProperty("/defaultDataSource");
    },
    /**
     * @this sap.esh.search.ui.SearchModel
     * @param {string} dataSourceId
     * @param {boolean} [fireQuery]
     * @param {boolean} [resetTop]
     */
    setDataSourceById: function _setDataSourceById(dataSourceId, fireQuery, resetTop) {
      const ds = this.sinaNext.getDataSource(dataSourceId);
      if (ds && ds.id && ds.id === dataSourceId) {
        this.setDataSource(ds, fireQuery, resetTop);
        return;
      }
      throw new Error(`Could not set data source with id ${dataSourceId} because it was not in the list of loaded data sources.`);
    },
    setDataSource: function _setDataSource(dataSource, fireQuery, resetTop) {
      if (this.getDataSource() !== dataSource) {
        const userEventDatasourceChange = {
          type: UserEventType.DATASOURCE_CHANGE,
          dataSourceKey: dataSource.id
        };
        this.eventLogger.logEvent(userEventDatasourceChange);
      }
      this.updateDataSourceList(dataSource);
      this.getProperty("/uiFilter").setDataSource(dataSource);
      if (resetTop || resetTop === undefined) {
        this.resetTop();
      }
      this.setProperty("/searchTermPlaceholder", this.calculatePlaceholder());
      this.calculateSearchButtonStatus();
      if (fireQuery || fireQuery === undefined) {
        this.fireSearchQuery();
      }
    },
    // getServerDataSources: function () {
    //     var that = this;
    //     if (that.getDataSourcesDeffered) {
    //         return that.getDataSourcesDeffered;
    //     }
    //     that.getDataSourcesDeffered = that.sina
    //         .getDataSources()
    //         .then(function (dataSources) {
    //             // filter out categories
    //             return jQuery.grep(
    //                 dataSources,
    //                 function (dataSource) {
    //                     return (
    //                         dataSource.getType() !== "Category"
    //                     );
    //                 }
    //             );
    //         });
    //     return that.getDataSourcesDeffered;
    // },
    // ################################################################################
    // Filter conditions:
    // ################################################################################
    notifyFilterChanged: function _notifyFilterChanged() {
      // notify ui about changed filter, data binding does not react on changes below
      // conditions, so this is done manually
      jQuery.each(this["aBindings"], (index, binding) => {
        // ToDo
        if (binding.sPath === "/uiFilter/rootCondition") {
          binding.checkUpdate(true);
        }
      });
    },
    getFilterRootCondition: function _getFilterRootCondition() {
      let rootCondition;
      if (this.getProperty("/uiFilter")) {
        rootCondition = this.getProperty("/uiFilter").rootCondition;
      }
      return rootCondition;
    },
    setFilterRootCondition: function _setFilterRootCondition(rootCondition, fireQuery) {
      if (rootCondition.type !== "Complex") {
        throw new Error("filter root condition must be of type ComplexCondition");
      }
      for (let index = 0; index < rootCondition.conditions.length; index++) {
        const complexChildCondition = rootCondition.conditions[index];
        if (complexChildCondition.type !== "Complex") {
          throw new Error("filters of root condition must be of type ComplexCondition");
        }
        for (let index = 0; index < complexChildCondition.conditions.length; index++) {
          const simpleGrandChildCondition = complexChildCondition.conditions[index];
          if (simpleGrandChildCondition.type !== "Simple") {
            throw new Error("filters of the lowest level must be of type SimpleCondition");
          }
        }
      }
      this.getProperty("/uiFilter").setRootCondition(rootCondition);
      if (fireQuery || typeof fireQuery === "undefined") {
        this.fireSearchQuery({
          preserveFormerResults: false
        });
      }
      this.notifyFilterChanged();
    },
    addFilterCondition: function _addFilterCondition(filterCondition, fireQuery) {
      try {
        const uiFilter = this.getProperty("/uiFilter");
        //DWC exit for handling SearchIn facets
        if (typeof this.config.cleanUpSpaceFilters === "function") {
          this.config.cleanUpSpaceFilters(this, filterCondition);
        }
        if (filterCondition.attribute || filterCondition.conditions) {
          uiFilter.autoInsertCondition(filterCondition);
        } else {
          // or a datasource?
          this.setDataSource(filterCondition, false);
        }
        if (fireQuery || typeof fireQuery === "undefined") {
          this.fireSearchQuery({
            preserveFormerResults: false
          });
        }
        this.notifyFilterChanged();
      } catch (error) {
        this.errorHandler.onError(error);
      }
    },
    removeFilterCondition: function _removeFilterCondition(filterCondition, fireQuery) {
      if (filterCondition.attribute || filterCondition.conditions) {
        this.getProperty("/uiFilter").autoRemoveCondition(filterCondition);
      } else {
        this.setDataSource(filterCondition, false);
      }
      if (fireQuery || typeof fireQuery === "undefined") {
        this.fireSearchQuery({
          preserveFormerResults: true
        });
      }
      this.notifyFilterChanged();
    },
    resetAllFilterConditions: function _resetAllFilterConditions(fireQuery) {
      this.getProperty("/uiFilter").resetConditions();
      if (fireQuery || typeof fireQuery === "undefined") {
        this.fireSearchQuery();
      }
      this.notifyFilterChanged();
    },
    resetFilterByFilterConditions: function _resetFilterByFilterConditions(fireQuery) {
      // 1. collect static hierarchy facet filter conditions
      const nonFilterByConditions = this.getNonFilterByFilterConditions();

      // 1.1 DWC exit, should be removed after replacement of space by folder
      const searchInConditions = [];
      const searchInAttrPosistions = this.config.searchInAttibuteFacetPostion;
      if (searchInAttrPosistions) {
        for (const searchInAttribute in searchInAttrPosistions) {
          const searchInCondition = this.getProperty("/uiFilter").rootCondition.getAttributeConditions(searchInAttribute);
          for (let j = 0; j < searchInCondition.length; j++) {
            searchInConditions.push(searchInCondition[j]);
          }
        }
      }
      //// end of 1.1 DWC exit

      // 2. reset all filter conditions
      this.getProperty("/uiFilter").resetConditions();

      // 3. add static hierarchy facet filter conditions
      if (nonFilterByConditions.length > 0) {
        for (const nonFilterByCondition of nonFilterByConditions) {
          this.getProperty("/uiFilter").autoInsertCondition(nonFilterByCondition);
        }
      }

      // 3.1 DWC exit, should be removed after replacement of space by folder
      if (searchInConditions.length > 0) {
        for (let i = 0; i < searchInConditions.length; i++) {
          const filterCondition = searchInConditions[i];
          this.getProperty("/uiFilter").autoInsertCondition(filterCondition);
        }
      }
      //// end of 3.1 DWC exit

      // 4. notify filter changed
      if (fireQuery || typeof fireQuery === "undefined") {
        this.fireSearchQuery();
      }
      this.notifyFilterChanged();
    },
    setFilter: function _setFilter(filter) {
      this.setDataSource(filter.dataSource, false);
      this.setSearchBoxTerm(filter.searchTerm, false);
      const uiFilter = this.getProperty("/uiFilter");
      uiFilter.setRootCondition(filter.rootCondition);
      this.fireSearchQuery();
    },
    filterWithoutFilterByConditions: function _filterWithoutFilterByConditions() {
      const nonFilterByConditions = this.getNonFilterByFilterConditions();
      return nonFilterByConditions.length > 0 && nonFilterByConditions.length === this.getProperty("/uiFilter").rootCondition.conditions.length;
    },
    getNonFilterByFilterConditions: function _getNonFilterByFilterConditions() {
      const nonFilterByConditions = [];
      for (const attribute of this.getProperty("/uiFilter").rootCondition.getAttributes()) {
        const attributeMetadata = this.getProperty("/uiFilter").dataSource.attributeMetadataMap[attribute];
        if (attributeMetadata && attributeMetadata.isHierarchy === true && attributeMetadata.hierarchyDisplayType === HierarchyDisplayType.StaticHierarchyFacet) {
          for (const nonFilterByCondition of this.getProperty("/uiFilter").rootCondition.getAttributeConditions(attribute)) {
            nonFilterByConditions.push(nonFilterByCondition);
          }
        }
      }
      return nonFilterByConditions;
    },
    // ################################################################################
    // Suggestions:
    // ################################################################################
    doSuggestion: function _doSuggestion() {
      this._suggestionHandler.doSuggestion(this.getProperty("/uiFilter").clone());
    },
    abortSuggestions: function _abortSuggestions() {
      this._suggestionHandler.abortSuggestions();
    },
    // ################################################################################
    // Standard- and App-Search:
    // ################################################################################
    fireSearchQuery: async function _fireSearchQuery(deserializationIn, preserveFormerResultsIn) {
      try {
        await this.initAsync();
      } catch (error) {
        return Promise.reject(error);
      }
      return this.doFireSearchQuery(deserializationIn, preserveFormerResultsIn);
    },
    /**
     * @deprecated use fireSearchQuery instead
     */
    _firePerspectiveQuery: async function _firePerspectiveQuery(deserializationIn, preserveFormerResultsIn) {
      assert(false, `Do not call '_firePerspectiveQuery' of internal search model.\nInstead use function 'search' of SearchCompositeControl:\n`);
      return this.fireSearchQuery(deserializationIn, preserveFormerResultsIn);
    },
    doFireSearchQuery: function _doFireSearchQuery(deserializationIn, preserveFormerResultsIn) {
      let deserialization, preserveFormerResults;
      if (jQuery.isPlainObject(deserializationIn)) {
        deserialization = deserializationIn.deserialization;
        preserveFormerResults = deserializationIn.preserveFormerResults;
      } else {
        deserialization = deserializationIn || undefined;
        preserveFormerResults = preserveFormerResultsIn || undefined;
      }

      // decide whether to fire the query
      const uiFilter = this.getProperty("/uiFilter");
      if (uiFilter === undefined) {
        // async search model creation might have failed (see browser console)
        return;
      }
      if (uiFilter.equals(this.query.filter) && this.getTop() === this.query.top && this.isEqualOrderBy(this.getOrderBy(), this.query.sortOrder) && this.getCalculateFacetsFlag() === this.query.calculateFacets && !this.getProperty("/isQueryInvalidated")) {
        return Promise.resolve();
      }

      // set natural language query flag
      this.query.setNlq(this.isNlqActive());

      // reset orderby if search term changes or datasource
      if (!deserialization && (this.query.filter.dataSource && uiFilter.dataSource !== this.query.filter.dataSource || this.query.filter.searchTerm && uiFilter.searchTerm !== this.query.filter.searchTerm)) {
        this.resetOrderBy(false);
      }

      // notify facets formatter about datasource change
      if (this.query.filter.dataSource && uiFilter.dataSource !== this.query.filter.dataSource) {
        this.oFacetFormatter.handleDataSourceChanged();
      }

      // reset top if search term changes or filter condition or datasource
      if (!deserialization && !preserveFormerResults) {
        if (!uiFilter.equals(this.query.filter)) {
          this.resetTop();
        }
      }

      // reset tabstrip formatter if search term changes or filter condition
      // UserCategory (My Favorites) is used and search for one connector
      if (uiFilter.searchTerm !== this.query.filter.searchTerm || !uiFilter.rootCondition.equals(this.query.filter.rootCondition)) {
        this._tabStripFormatter.invalidate(this.getDataSource());
      }

      // query invalidated by UI -> force to fire query by reseting result set
      if (this.getProperty("/isQueryInvalidated") === true) {
        this.query.resetResultSet();
        this.setProperty("/isQueryInvalidated", false);
      }

      // update query (app search also uses this.query despite search regest is not controlled by sina)
      this.query.setFilter(this.getProperty("/uiFilter").clone());
      this.query.setTop(this.getTop());
      this.query.setSortOrder(this.assembleSortOrder());
      this.query.setCalculateFacets(this.getCalculateFacetsFlag());
      this.setProperty("/queryFilter", this.query.filter);

      // notify subscribers
      this.notifySubscribers(UIEvents.ESHSearchStarted);
      EventBus.getInstance().publish(UIEvents.ESHSearchStarted);

      // enable busy indicator
      if (deserialization || !this.config.isUshell) {
        // - no delay: avoid flickering when starting seach ui from shell header
        // - no delay in all none ushell use cases: in ushell we have no dynamic/static hierarchy facets
        //   dynamic/static hierarchy facets needs fast blocking in order to avoid parallel ajax requests triggered by fast clicking user
        this.setProperty("/busyDelay", 0);
      } else {
        this.setProperty("/busyDelay", 600);
      }
      this.busyIndicator.setBusy(true);
      this.abortSuggestions();

      // update url silently
      this.updateSearchURLSilently(deserialization);

      // for each new search the memory is reseted except in case of deserilization:
      // when navigating back from factsheet (object page) / other applications
      // the expand status of search result set items shall be restored -> do not clear memory
      if (!deserialization) {
        this.resetSearchResultItemMemory();
      }

      // log search request
      const userEventSearchRequest = {
        type: UserEventType.SEARCH_REQUEST,
        searchTerm: this.getProperty("/uiFilter/searchTerm"),
        dataSourceKey: this.getProperty("/uiFilter/dataSource").id
      };
      this.eventLogger.logEvent(userEventSearchRequest);
      this.logSearchRequestAdvanced();
      const method = `Search for '${this.getSearchBoxTerm()}' (logId:${this.config.performanceLogger.getUniqueId()})`;
      this._performanceLoggerSearchMethods.push(method);
      this.config.performanceLogger.enterMethod({
        name: method
      }, {
        isSearch: true,
        comments: `Top: ${this.getTop()}, searchbox term: ${this.getSearchBoxTerm()}`
      });

      // wait for all subsearch queries
      return Promise.all([this.normalSearch(preserveFormerResults), this.appSearch()]).then(() => {
        this.calculateResultViewSwitchVisibility();
        this.setProperty("/tabStrips", this._tabStripFormatter.format(this.getDataSource(), this.resultSet, this));
        this.setProperty("/breadcrumbsHierarchyNodePaths", this._breadcrumbsFormatter.formatNodePaths(this.resultSet));
        this.setProperty("/breadcrumbsHierarchyAttribute", this._breadcrumbsFormatter.formatHierarchyAttribute(this.resultSet));
        this.setProperty("/hierarchyNodePaths", this.resultSet?.hierarchyNodePaths);
        this.setProperty("/isFolderMode", this.getProperty("/uiFilter").isFolderMode());
        if (this.config.bRecentSearches && this.recentlyUsedStorage) {
          const searchSuggestion = createSearchSuggestionForCurrentSearch(this);
          if (searchSuggestion) {
            this.recentlyUsedStorage.addItem(searchSuggestion);
          }
        }
        return this.oFacetFormatter.getFacets(this.getDataSource(), this.resultSet, this).catch(error => {
          for (const method of this._performanceLoggerSearchMethods) {
            this.config.performanceLogger.leaveMethod({
              name: method
            });
          }
          this._performanceLoggerSearchMethods = [];
          return this.errorHandler.onErrorDeferred(error);
        }).then(facets => {
          if (facets?.length > 0) {
            facets[0].change = Date.now(); // workaround to prevent earlier force update facet tree
            this.setProperty("/facets", facets);
            facets.forEach(facet => facet.handleModelUpdate && facet.handleModelUpdate());
          }
        });
      }).catch(error => {
        for (const method of this._performanceLoggerSearchMethods) {
          this.config.performanceLogger.leaveMethod({
            name: method
          });
        }
        this._performanceLoggerSearchMethods = [];
        return this.errorHandler.onErrorDeferred(error);
      }).finally(() => {
        try {
          if (this.config && this.config.overwriteBrowserTitle === true) {
            document.title = this.getDocumentTitle();
          }
          for (const method of this._performanceLoggerSearchMethods) {
            this.config.performanceLogger.leaveMethod({
              name: method
            });
          }
          this._performanceLoggerSearchMethods = [];
          this.notifySubscribers(UIEvents.ESHSearchFinished);
          EventBus.getInstance().publish(UIEvents.ESHSearchFinished);
          this.busyIndicator.setBusy(false);
          this.setProperty("/firstSearchWasExecuted", true);
          this.notifyFilterChanged();
          this.updateMultiSelectionSelected();
        } catch (error) {
          this.errorHandler.onError(error);
        }
        this.ensureOneTimeDisplayForErrorMessages();
      });
    },
    ensureOneTimeDisplayForErrorMessages: function _ensureOneTimeDisplayForErrorMessages() {
      // get errors
      const errors = this.getProperty("/errors");
      // remove already shown errors / mark new errors as shown
      for (let i = 0; i < errors.length; ++i) {
        const error = errors[i];
        if (error.shownToUser) {
          // old and shown error -> remove
          errors.splice(i, 1);
          i--;
          continue;
        }
        // new error displayed in this roundtrip -> remove next time method is called
        error.shownToUser = true;
      }
      // update errors
      this.setProperty("/errors", errors);
    },
    assembleSortOrder: function _assembleSortOrder() {
      const orderBy = this.getOrderBy();
      if (!orderBy.orderBy) {
        return [];
      }
      let order = this.sinaNext.SortOrder.Ascending;
      if (orderBy.sortOrder === "DESC") {
        order = this.sinaNext.SortOrder.Descending;
      }
      return [{
        id: orderBy.orderBy,
        order: order
      }];
    },
    getCalculateFacetsFlag: function _getCalculateFacetsFlag() {
      if (this.getDataSource().type === this.sinaNext.DataSourceType.Category || this.getFacetVisibility()) {
        // tab strip needs data from data source facet if a category is selected because
        // then the tab strips show also siblings. If connector is selected, the tab strip
        // only shows All and the connector.
        return true;
      }
      return false;
    },
    appSearch: function _appSearch() {
      // only ushell should do app search
      if (!this.config.isUshell) {
        return Promise.resolve(true);
      }
      this.setProperty("/appResults", []);
      this.setProperty("/appCount", 0);
      if (this.isBusinessObject() || this.isOtherCategory() && !this.isAppCategory() && !this.isUserCategory() || this.isUserCategory() && this.userCategoryManager && !this.userCategoryManager.getCategory("MyFavorites").includeApps) {
        // 1. do not search
        return Promise.resolve(true);
      }

      // calculate top
      const top = this.query.filter.dataSource === this.allDataSource ? this.appTopDefault : this.query.top;

      // 2. search
      return this._searchApplicationsRefuseOutdatedReq(this.query.filter.searchTerm, top, 0).then(oResult => {
        // 1.1 search call succeeded
        this.setProperty("/appCount", oResult.totalResults);
        this.setProperty("/appResults", oResult.getElements());
      }, error => {
        // 1.2 search call failed
        return this.errorHandler.onErrorDeferred(error);
      });
    },
    searchApplications: function _searchApplications(searchTerm, top, skip) {
      if (this.config.isUshell) {
        return window.sap.ushell.Container.getServiceAsync("Search").then(service => {
          return service.queryApplications({
            searchTerm: searchTerm,
            top: top,
            skip: skip
          });
        });
      } else {
        return Promise.resolve({
          totalResults: 0,
          searchTerm: searchTerm,
          getElements: () => {
            return [];
          }
        });
      }
    },
    normalSearch: async function _normalSearch(preserveFormerResults) {
      // reset selection
      if (!preserveFormerResults) {
        this.resetAndDisableMultiSelection();
      }

      // return in case :
      // 1) enterprise search disabled
      // 2) dataSource=apps
      // 3) dataSource=MyFavorites and MyFavorites has not datasources
      if (!this.isBusinessObjSearchEnabled() || this.isAppCategory() || this.isUserCategory() && this.userCategoryManager && this.userCategoryManager.getCategory("MyFavorites").subDataSources.length === 0) {
        this.setProperty("/boResults", []);
        this.setProperty("/breadcrumbsHierarchyNodePaths", []);
        this.setProperty("/breadcrumbsHierarchyAttribute", "");
        this.setProperty("/hierarchyNodePaths", []);
        this.setProperty("/isFolderMode", false);
        this.setProperty("/origBoResults", []);
        this.setProperty("/boCount", 0);
        this.setProperty("/nlqExplanation", {});
        this.setProperty("/nlqResult", {
          success: false,
          filterDescription: ""
        });
        this.resultSet = null;
        return;
      }

      // set datasource
      this.setDataSource(this.getDataSource(), false, false); // why?? update of dropdown??

      // set flag whether to calculcate the facets
      this.query.setCalculateFacets(this.getCalculateFacetsFlag());

      // search request
      try {
        const resultSet = await this.query.getResultSetAsync();
        if (resultSet.hasErrors()) {
          resultSet.getErrors().forEach(error => {
            this.errorHandler.onError(error, {
              showMinorErrorsAsWarnings: resultSet?.items?.length > 0
            });
          });
        }
        this.dataSourceOfPreviousSearch = this?.resultSet?.query?.filter?.dataSource;
        this.resultSet = resultSet;
        this.setProperty("/nlqResult", resultSet.nlqResult);
        await this._afterSearchPrepareResultList(resultSet);
      } catch (error) {
        this.dataSourceOfPreviousSearch = this?.resultSet?.query?.filter?.dataSource;
        this.setProperty("/nlqResult", {
          success: false,
          filterDescription: ""
        });
        this.errorHandler.onError(error);
      }
    },
    _afterSearchPrepareResultList: function _afterSearchPrepareResultList(searchResultSet) {
      this.setProperty("/boResults", []);
      this.setProperty("/breadcrumbsHierarchyNodePaths", []);
      this.setProperty("/breadcrumbsHierarchyAttribute", "");
      this.setProperty("/hierarchyNodePaths", []);
      this.setProperty("/isFolderMode", false);
      this.setProperty("/origBoResults", searchResultSet.items);
      this.setProperty("/boCount", 0);
      const formatter = new SearchResultFormatter(this);
      const newResults = formatter.format(searchResultSet, this.query.filter.searchTerm);
      this.setProperty("/sortableAttributes", formatter.formatSortAttributes()); // move this.isHomogenousResult() && searchResultSet.totalCount > 0 to formatter

      this.setTableData(newResults); // format table even if table view is configured, used in getTableInitialColumns() for result export.

      this.restoreResultSetItemExpansion(newResults);
      let newResult;
      const dataSources = [];
      const dataSourcesHints = [];
      for (let i = 0; i < newResults.length; i++) {
        newResult = newResults[i];
        // collect data sources to initiate loading of custom modules
        dataSources.push(newResult.dataSource);
        dataSourcesHints.push({
          isDocumentConnector: newResult.isDocumentConnector
        });
      }
      const loadCustomModulesProm = this.config.loadCustomModulesForDataSourcesAsync(dataSources, dataSourcesHints);
      const thisPromise = Promise.all([Promise.resolve(searchResultSet), loadCustomModulesProm]).then(params => {
        // TODO: error handling

        const searchResultSet = params[0];

        // DWC exit
        if (this.config && typeof this.config.setSearchInLabelIconBindings === "function") {
          try {
            this.config.setSearchInLabelIconBindings(this, searchResultSet.facets);
          } catch (err) {
            const oError = new errors.ConfigurationExitError("setSearchInLabelIconBindings", this.config.applicationComponent, err);
            throw oError;
          }
        }
        this.setProperty("/boCount", searchResultSet.totalCount);
        this.setProperty("/boResults", newResults);
        this.enableOrDisableMultiSelection();
        return Promise.resolve();
      });
      return thisPromise;
    },
    restoreResultSetItemExpansion: function _restoreResultSetItemExpansion(items) {
      for (const item of items) {
        const expanded = this.searchResultSetItemMemory.getExpanded(item.key);
        if (typeof expanded !== "undefined") {
          item.expanded = expanded;
        }
      }
    },
    // ################################################################################
    // Helper functions:
    // ################################################################################
    // handle multi-selection availability
    // ===================================================================
    resetAndDisableMultiSelection: function _resetAndDisableMultiSelection() {
      this.setProperty("/multiSelectionAvailable", false);
      this.setProperty("/multiSelectionEnabled", false);
      this.setProperty("/multiSelectionSelected", false);
      this.setProperty("/singleSelectionSelected", false);
    },
    // handle multi-selection availability
    // ===================================================================
    enableOrDisableMultiSelection: function _enableOrDisableMultiSelection() {
      if (this.config.enableMultiSelectionResultItems) {
        this.setProperty("/multiSelectionAvailable", true);
        this.setProperty("/multiSelectionEnabled", true);
        return;
      }
      const dataSource = this.getDataSource();
      const dataSourceConfig = this.config.getDataSourceConfig(dataSource);
      const selectionHandler = new dataSourceConfig.searchResultListSelectionHandlerControl();
      if (selectionHandler) {
        this.setProperty("/multiSelectionAvailable", selectionHandler.isMultiSelectionAvailable());
      } else {
        this.setProperty("/multiSelectionAvailable", false);
      }
    },
    updateMultiSelectionSelected: function _updateMultiSelectionSelected() {
      let results;
      if (this.getResultViewType() === "searchResultTable") {
        // UI in table view
        results = this.getProperty("/tableRows");
      } else {
        // UI in list or grid view
        results = this.getProperty("/results");
      }
      let count = 0;
      const multiSelectionObjects = [];
      for (let i = 0; i < results.length; i++) {
        if (results[i].selected) {
          count++;
          multiSelectionObjects.push(results[i]);
        }
      }
      if (count > 0) {
        this.setProperty("/multiSelectionSelected", true);
        this.setProperty("/multiSelectionObjects", multiSelectionObjects);
      } else {
        this.setProperty("/multiSelectionSelected", false);
        this.setProperty("/multiSelectionObjects", []);
      }
      if (count === 1) {
        this.setProperty("/singleSelectionSelected", true);
      } else {
        this.setProperty("/singleSelectionSelected", false);
      }
      // notify subscribers
      this.notifySubscribers(UIEvents.ESHSelectionChanged);
      EventBus.getInstance().publish(UIEvents.ESHSelectionChanged, this);
    },
    calculatePlaceholder: function _calculatePlaceholder() {
      let dataSourceLabel = this.getDataSource().labelPlural; // default label
      if (this.isAllCategory() || this.config?.bPlaceHolderFixedValue === true) {
        return i18n.getText("search");
      } else if (typeof this.config?.getSearchInputPlaceholderLabel === "function") {
        try {
          dataSourceLabel = this.config?.getSearchInputPlaceholderLabel(this.getProperty("/uiFilter"));
        } catch (err) {
          const oError = new errors.ConfigurationExitError("getSearchInputPlaceholderLabel", this.config.applicationComponent, err);
          // not significant, unnecessary to throw exception, display fallback placeholder text
          this.errorHandler.onError(oError);
        }
      }
      // robustness
      if (typeof dataSourceLabel === "undefined" || dataSourceLabel === null || dataSourceLabel === "") {
        dataSourceLabel = this.getDataSource().labelPlural;
      }
      return i18n.getText("searchInPlaceholder", [dataSourceLabel]);
    },
    updateDataSourceList: function _updateDataSourceList(newDataSource) {
      const dataSources = this.getProperty("/dataSources");
      // delete old categories, until all data source
      this.removeTempDataSources();
      // check if newDataSource exists in existing list -> return
      if (dataSources.indexOf(newDataSource) >= 0) {
        return;
      }
      // add datasource
      dataSources.unshift(newDataSource);
      this._tempDataSources.push(newDataSource);
      this.setProperty("/dataSources", dataSources);
    },
    removeTempDataSources: function _removeTempDataSources() {
      const dataSources = this.getProperty("/dataSources");
      this._tempDataSources.forEach((tempDataSource, i, tempDataSources) => {
        const index = dataSources.indexOf(tempDataSource);
        if (index < 0) {
          const internalError = new Error("could not find temp DataSource in DataSources");
          throw new errors.ProgramError(internalError);
        }
        dataSources.splice(index, 1);
        tempDataSources.splice(i, 1);
      });
    },
    invalidateQuery: function _invalidateQuery() {
      SearchHelper.hasher.reset();
      this.setProperty("/isQueryInvalidated", true);
    },
    logSearchRequestAdvanced: function _logSearchRequestAdvanced() {
      if (this.getSearchBoxTerm()) {
        const userEventSearchWithSearchTerm = {
          type: UserEventType.SEARCH_WITH_SEARCHTERM,
          searchTerm: this.getSearchBoxTerm()
        };
        this.eventLogger.logEvent(userEventSearchWithSearchTerm);
      }
      if (this.getFilterRootCondition().conditions?.length > 0) {
        const userEventSearchWithFilters = {
          type: UserEventType.SEARCH_WITH_FILTERS
        };
        this.eventLogger.logEvent(userEventSearchWithFilters);
        if (this.getSearchBoxTerm()) {
          const userEventSearchWithFiltersAndSearchTerm = {
            type: UserEventType.SEARCH_WITH_SEARCHTERM_FILTERS,
            searchTerm: this.getSearchBoxTerm()
          };
          this.eventLogger.logEvent(userEventSearchWithFiltersAndSearchTerm);
        }
      } else {
        if (!this.getSearchBoxTerm()) {
          const userEventSearchWithout = {
            type: UserEventType.SEARCH_WITHOUT_SEARCHTERM_FILTERS
          };
          this.eventLogger.logEvent(userEventSearchWithout);
        }
      }
    },
    autoStartApp: function _autoStartApp() {
      const searchTerm = this.getProperty("/uiFilter/searchTerm");
      if (this.getProperty("/appCount") === 1 && this.getProperty("/count") === 1) {
        const aApps = this.getProperty("/appResults");
        if (aApps && aApps.length > 0 && aApps[0] && aApps[0].url && searchTerm && aApps[0].tooltip && searchTerm.toLowerCase().trim() === aApps[0].tooltip.toLowerCase().trim()) {
          if (aApps[0].url[0] === "#") {
            window.location.href = aApps[0].url;
          } else {
            window.open(aApps[0].url, "_blank", "noopener,noreferrer");
          }
          return;
        }
      }
    },
    isHomogenousResult: function _isHomogenousResult() {
      if (this.isAllCategory()) {
        return false;
      }
      if (this.isOtherCategory()) {
        return false;
      }
      if (this.isAppCategory()) {
        return false;
      }
      return true;
    },
    getResultViewTypes: function _getResultViewTypes() {
      return this.getProperty("/resultViewTypes");
    },
    setResultViewTypes: function _setResultViewTypes(types) {
      this.setProperty("/resultViewTypes", types);
    },
    getResultViewType: function _getResultViewType() {
      return this.getProperty("/resultViewType");
    },
    setResultViewType: function _setResultViewType(type) {
      this.setProperty("/resultViewType", type);
      if (this.isAppCategory()) {
        return;
      } else if (this.isAllCategory() || this.isOtherCategory()) {
        try {
          this._personalizationStorage.setItem(PersonalizationKeys.resultViewTypeForAllAndCategorySearch, type);
        } catch (e) {
          this.logger.warning("Could not store resultViewTypeForAllAndCategorySearch in personalization storage", e);
        }
      } else {
        try {
          this._personalizationStorage.setItem(PersonalizationKeys.resultViewTypeForBusinessObjectSearch, type);
        } catch (e) {
          this.logger.warning("Could not store resultViewTypeForBusinessObjectSearch in personalization storage", e);
        }
      }
    },
    calculateResultViewSwitchVisibility: function _calculateResultViewSwitchVisibility(settings) {
      /* view type by search scope
       * search in Datasource    All     Category    Apps    BusinessObject
       * -------------------------------------------------------------------
       * "appSearchResult"                           x
       * "searchResultList"      x        x                  x
       * "searchResultTable"                                 x
       * "searchResultGrid"      x        x                  x
       */

      this.validateResultViewSettings(settings);

      // ==============================================================================================================
      // click view switch buttons or use SearchComposite API (after SearchFinished) ->
      // call calculateResultViewSwitchVisibility(), settings is SearchComposite's parameters ->
      // calculate with settings:
      // ==============================================================================================================
      if (settings !== undefined) {
        this.setResultViewTypes(settings.resultViewTypes);
        this.setResultViewType(settings.resultViewType);
        this.setProperty("/resultViewSwitchVisibility", settings.resultViewTypes.length > 1);
        return;
      }

      // ==============================================================================================================
      // initialize Search UI with/without URL parameter or trigger new search (NormalSearch Resolve) ->
      // call calculateResultViewSwitchVisibility(), settings is undefined ->
      // calculate with hard code, storage and/or SearchConfiguration's parameters:
      // ==============================================================================================================
      let activeTypes;
      let activeType;

      // 1. Search in Apps
      if (this.isAppCategory() || this.isUserCategory() && this.userCategoryManager && this.userCategoryManager.getCategory("MyFavorites").subDataSources.length === 0) {
        activeTypes = ["appSearchResult"]; // ToDo: hard code
        activeType = "appSearchResult"; // ToDo: hard code
        this.setResultViewTypes(activeTypes);
        this.setResultViewType(activeType);
        this.setProperty("/resultViewSwitchVisibility", activeTypes.length > 1);
        return;
      }

      // 2. Search in All or other Category
      if (this.isAllCategory() || this.isOtherCategory()) {
        // 2.1.
        if (this.config.isUshell) {
          activeTypes = ["searchResultList"]; // ToDo: hard code
          activeType = "searchResultList"; // ToDo: hard code
        }
        // 2.2
        else {
          activeTypes = ["searchResultList", "searchResultGrid"]; // ToDo: hard code
          try {
            activeType = this._personalizationStorage.getItem(PersonalizationKeys.resultViewTypeForAllAndCategorySearch); //storage
          } catch (e) {
            this.logger.warning("Could not read resultViewTypeForAllAndCategorySearch from personalization storage", e);
          }
          if (activeType === undefined || activeType === null || activeType.length === 0 || !activeTypes.includes(activeType)) {
            activeType = "searchResultList"; //hard code
          }
        }
        this.setResultViewTypes(activeTypes);
        this.setResultViewType(activeType);
        this.setProperty("/resultViewSwitchVisibility", activeTypes.length > 1);
        return;
      }

      // 3. Search in Business Object
      activeTypes = this.config.resultViewTypes; // SearchConfiguration

      try {
        if (this._personalizationStorage instanceof PersonalizationStorage) activeType = this._personalizationStorage.getItem(PersonalizationKeys.resultViewTypeForBusinessObjectSearch); //storage
      } catch (e) {
        this.logger.warning("Could not read resultViewTypeForBusinessObjectSearch from personalization storage", e);
      }
      if (activeType === undefined || activeType === null || activeType.length === 0 || !activeTypes.includes(activeType)) {
        activeType = this.config.fallbackResultViewType; //SearchConfiguration
      }

      // result view type calculation for navigation mode (folder or search mode)
      activeType = this.folderModeResultViewTypeCalculator.calculate(activeTypes, activeType, this.getProperty("/uiFilter"));
      this.setResultViewTypes(activeTypes);
      this.setResultViewType(activeType);
      this.setProperty("/resultViewSwitchVisibility", activeTypes.length > 1);
    },
    validateResultViewSettings: function _validateResultViewSettings(settings) {
      let validateConfig;
      let typeSuperset; // superset of possible resultViewTypes
      let types; // active result view types
      let type; // active result view type
      let errorBegin;
      let errorEnding;
      if (typeof settings === "undefined") {
        // ==============================================================================================================
        // initialize Search UI with/without URL parameter or trigger new search (NormalSearch Resolve) ->
        // call validateResultViewSettings(), settings is undefined ->
        // validate SearchConfiguration parameters: config.resultViewTypes, config.fallbackResultViewType
        // ==============================================================================================================
        validateConfig = true;
      } else {
        // ==============================================================================================================
        // click view switch buttons or use SearchComposite API (after SearchFinished) ->
        // call validateResultViewSettings(), settings is SearchComposite's parameters ->
        // validate SearchCompositeControl parameters: settings.resultViewTypes, settings.resultViewType
        // ==============================================================================================================
        validateConfig = false;
      }
      if (validateConfig) {
        typeSuperset = ["searchResultList", "searchResultTable", "searchResultGrid"];
        types = this.config.resultViewTypes;
        type = this.config.fallbackResultViewType;
        errorBegin = "\nERROR: Search Result View Settings of SearchConfiguration:\n\n";
        errorEnding = ". \n Please check the validation and compatibility of resultViewTypes of SearchConfiguration!";
      } else {
        if (this.isAppCategory()) {
          typeSuperset = ["appSearchResult"];
        } else if (this.isAllCategory() || this.isOtherCategory()) {
          typeSuperset = ["searchResultList", "searchResultGrid"];
        } else {
          typeSuperset = ["searchResultList", "searchResultTable", "searchResultGrid"];
        }
        types = settings.resultViewTypes;
        type = settings.resultViewType;
        errorBegin = "\nERROR: Search Result View Settings of SearchCompositeControl\n\n";
        errorEnding = ". \n Please check the validation and compatibility of resultViewTypes and resultViewType of SearchCompositeControl!" + "\n When adding a new resultViewType and making it active at the same time, make use of function 'setResultViewSettings' to apply both changes together.";
      }

      // check starts
      // result view types not empty
      if (!Array.isArray(types) || types.length === 0) {
        throw Error(errorBegin + "resultViewTypes should be non-empty array" + errorEnding);
      }

      // result view types no duplicates
      let uniqueList = types;
      uniqueList = uniqueList.filter((elem, index) => {
        return uniqueList.indexOf(elem) === index;
      });
      if (uniqueList.length !== types.length) {
        throw Error(errorBegin + "resultViewTypes (" + types.toString() + ") should not have duplicated value" + errorEnding);
      }

      // result view types is subset of possible superset
      if (!SearchHelper.isSubsetOf(types, typeSuperset)) {
        throw Error(errorBegin + "resultViewTypes (" + types.toString() + ") contains invalid value. Possible values are (" + typeSuperset.toString() + ")" + errorEnding);
      }

      // set default value to undefined fallbackResultViewType, after validating resultViewTypes
      // move from setDefaults() of SearchConfiguration
      if (typeof type === "undefined" && validateConfig) {
        type = types[0];
        this.config.fallbackResultViewType = types[0]; // assign resultViewTypes' first element to fallbackResultViewType
      }

      // result view type of string type
      if (typeof type !== "string") {
        throw Error(errorBegin + "resultViewType should be of string" + errorEnding);
      }

      // result view types contains active result view type
      if (!types.includes(type)) {
        throw Error(errorBegin + "resultViewTypes (" + types.toString() + ") doesn't contain resultViewType (" + type + ")" + errorEnding);
      }
    },
    calculateSearchButtonStatus: function _calculateSearchButtonStatus() {
      if (!this.config.isUshell) {
        this.setProperty("/searchButtonStatus", "Search");
        return;
      }
      if (this.getDataSource() === this.getProperty("/defaultDataSource") && this.getSearchBoxTerm().length === 0) {
        if (SearchShellHelperHorizonTheme.isSearchFieldExpandedByDefault()) {
          this.setProperty("/searchButtonStatus", "Focus");
        } else {
          this.setProperty("/searchButtonStatus", "Close");
        }
      } else {
        this.setProperty("/searchButtonStatus", "Search");
      }
    },
    calculateResultList: function _calculateResultList() {
      // init
      let results = [];

      // add bo results
      const boResults = this.getProperty("/boResults");
      if (boResults && boResults.length) {
        results.push(...boResults);
      }

      // add app results (tiles)
      const tiles = this.getProperty("/appResults");
      if (tiles && tiles.length > 0) {
        const tilesItem = {
          type: "appcontainer",
          tiles: tiles
        };
        if (results.length > 0) {
          if (results.length > 3) {
            results.splice(3, 0, tilesItem);
          } else {
            //results.splice(0, 0, tilesItem);
            results.push(tilesItem);
          }
        } else {
          results = [tilesItem];
        }
      }
      this.setProperty("/results", results);
    },
    // ################################################################################
    // UI message handling:
    // ################################################################################
    /**
     * push an error object to error array
     * @this sap.esh.search.ui.SearchModel
     * @param { type: MessageType; title: string; description: string } error Error object
     */
    pushUIMessage: function _pushUIMessage(error) {
      error.title = error.title === "[object Object]" ? i18n.getText("searchError") : error.title;
      error.type = error.type !== undefined ? error.type : MessageType.Error;
      const errors = this.getProperty("/errors");
      errors.push(error);
      const finalErrors = this.removeAdjacentDuplicateMessages(errors);
      this.setProperty("/errors", finalErrors);
    },
    /**
     * remove all adjacent duplicate messages (message and 'next' message are the same -> keep first message only)
     * @this sap.esh.search.ui.SearchModel
     * @param {any[]} error
     */
    removeAdjacentDuplicateMessages: function _removeAdjacentDuplicateMessages(errors) {
      const finalErrors = [];
      let previousError;
      for (const error of errors) {
        if (typeof previousError === "undefined") {
          finalErrors.push(error);
        } else if (previousError.title !== error.title || previousError.description !== error.description || previousError.type !== error.type || previousError.shownToUser !== error.shownToUser) {
          finalErrors.push(error);
        }
        previousError = error;
      }
      return finalErrors;
    },
    // ################################################################################
    // Functions related to the URL:
    // ################################################################################
    updateSearchURLSilently: function _updateSearchURLSilently(deserialization) {
      if (deserialization) {
        // (1) url changed
        // in most cases current URL is identical to the URL the URL serializer would create
        // -> URL update not neccessary
        // in some case current URL is not identical to the URL the URL serializer would create
        // -> we accept the users URL and skip the URL update
        // nevertheless the internal url hash needs to be updated
        SearchHelper.hasher.init();
      } else {
        // (2) user changed query
        if (this.config.updateUrl) {
          const sHash = this.createSearchNavigationTargetCurrentState().targetUrl;
          SearchHelper.hasher.setHash(sHash);
        }
      }
    },
    parseURL: function _parseURL() {
      this.searchUrlParser.parse();
    },
    subscribe: function _subscribe(eventId, callback, listener) {
      // Subscription to internal events of search library is only allowed for internal components
      // Subscribe to events of SearchCompositeControl:
      //   - "searchStarted" is triggered when a search is started and the UI is waiting for results
      //   - "searchFinished" is triggered as soon as the results are in and the UI finished its updates
      //   - "selectionChanged" is triggered after selection changed (checkboxes of result items)

      // subscribe
      this._subscribers.push({
        eventId: eventId || "",
        callback: callback,
        listener: listener || this
      });

      // assert
      this.assertInternalEvents(eventId);
    },
    unsubscribe: function _unsubscribe(eventId, callback, listener) {
      // unsubscribe
      eventId = eventId || "";
      listener = listener || this;
      for (let index = 0; index < this._subscribers.length; index++) {
        const subscriber = this._subscribers[index];
        if (subscriber.eventId === eventId && subscriber.callback === callback && subscriber.listener === listener) {
          this._subscribers.splice(index, 1);
        }
      }

      // assert
      this.assertInternalEvents(eventId);
    },
    assertInternalEvents: function _assertInternalEvents(eventId) {
      const callStack = new Error().stack;
      if (callStack.includes("sap/esh/search/ui/SearchCompositeControl") || callStack.includes("sap/esh/search/ui/library-preload") || callStack.includes("sap/esh/search/ui/SearchShellHelper")) {
        // OK, called by ELISA component
      } else {
        assert(false, `Subscription to internal events ('${eventId}') of search library is only allowed for internal components.\nSubscribe to events of SearchCompositeControl:\n  - "searchStarted"        : Triggered when a search is started and the UI is waiting for results\n  - "searchFinished"       : Triggered as soon as the results are in and the UI finished its updates\n  - "selectionChanged"     : Triggered after selection changed (checkboxes of result items) \n  - "resultViewTypeChanged": Triggered after result view type got changed (list, table or grid)`);
      }
    },
    notifySubscribers: function _notifySubscribers(eventId) {
      for (const subscriber of this._subscribers) {
        if (subscriber.eventId === eventId) {
          subscriber.callback.apply(subscriber.listener, [eventId]);
        }
      }
    },
    /**
     * Create a NavigationTarget instance.
     * Use this method for the creation a NavigationTarget instance by filter and label for it.
     */
    createSearchNavigationTarget: function _createSearchNavigationTarget(parameter, label) {
      // normalize input parameters
      let searchNavigationTargetParameters;
      if (parameter instanceof Filter) {
        searchNavigationTargetParameters = {
          filter: parameter,
          label: label
        };
      } else {
        searchNavigationTargetParameters = parameter;
      }

      // fill defaults
      searchNavigationTargetParameters.updateUrl = searchNavigationTargetParameters.updateUrl ?? this.config.updateUrl;
      searchNavigationTargetParameters.top = searchNavigationTargetParameters.top ?? this.config.pageSize ?? 10;
      searchNavigationTargetParameters.label = searchNavigationTargetParameters.label ?? "Search";
      searchNavigationTargetParameters.encodeFilter = searchNavigationTargetParameters.encodeFilter ?? true;

      // create navigation target
      if (searchNavigationTargetParameters.updateUrl) {
        // 1) navigation target using url
        const url = renderUrlFromParameters(this, searchNavigationTargetParameters.top, searchNavigationTargetParameters.filter, searchNavigationTargetParameters.encodeFilter, searchNavigationTargetParameters.orderBy);
        return this.sinaNext.createNavigationTarget({
          targetUrl: url,
          text: searchNavigationTargetParameters.label,
          target: "_self"
        });
      } else {
        // 2) navigation target using target function
        return this.sinaNext.createNavigationTarget({
          targetFunction: () => {
            this.setTop(searchNavigationTargetParameters.top, false);
            if (searchNavigationTargetParameters.orderBy) {
              this.setOrderBy(searchNavigationTargetParameters.orderBy, false);
            }
            this.setFilter(searchNavigationTargetParameters.filter);
          },
          targetFunctionCustomData: {
            top: searchNavigationTargetParameters.top,
            filter: searchNavigationTargetParameters.filter,
            orderBy: searchNavigationTargetParameters.orderBy
          },
          text: searchNavigationTargetParameters.label
        });
      }
    },
    createSearchNavigationTargetCurrentState: function _createSearchNavigationTargetCurrentState(options) {
      return this.createSearchNavigationTarget({
        top: this.getTop(),
        filter: this.getProperty("/uiFilter"),
        encodeFilter: true,
        orderBy: this.getOrderBy(),
        updateUrl: options?.updateUrl
      });
    },
    parseSearchNavigationTarget: function _parseSearchNavigationTarget(searchNavigationTarget) {
      const searchQueryParameters = {
        filter: null
      };

      // in case the search navigation target is targetFunction based the original query parameters
      // are stored in the targetFunctionCustomData, see createSearchNavigationTarget
      if (searchNavigationTarget.targetFunctionCustomData) {
        return searchNavigationTarget.targetFunctionCustomData;
      }

      // parse url parameters
      let urlParameters = SearchHelper.parseUrlParameters(searchNavigationTarget.targetUrl);
      if ($.isEmptyObject(urlParameters)) {
        return undefined;
      }

      // parameter modification exit
      try {
        urlParameters = this.config.parseSearchUrlParameters(urlParameters);
      } catch (e) {
        this.errorHandler.onError(e);
      }

      // top
      if (urlParameters.top) {
        searchQueryParameters.top = parseInt(urlParameters.top, 10);
      }

      // order by
      if (urlParameters.orderby && urlParameters.sortorder) {
        searchQueryParameters.orderBy = {
          orderBy: urlParameters.orderby,
          sortOrder: urlParameters.sortorder
        };
      }

      // filter conditions
      if (urlParameters.filter) {
        try {
          const filterJson = JSON.parse(urlParameters.filter);
          searchQueryParameters.filter = this.sinaNext.parseFilterFromJson(filterJson);
        } catch (e) {
          throw new UrlParseError(e);
        }
      }
      return searchQueryParameters;
    },
    getTableColumns: function _getTableColumns(isStorage) {
      if (!isStorage) {
        return merge([], this.getProperty("/tableColumns")); // pass-by-value, not pass-by-reference
      } else {
        return this.fetchTableColumns();
      }
    },
    fetchTableColumns: function _fetchTableColumns() {
      try {
        if (this.getProperty("/tableDataSource").length > 0) {
          const storageId = PersonalizationKeys.searchResultTableState + this.getProperty("/tableDataSource");
          const persoState = this.getPersonalizationStorageInstance()?.getItem(storageId);
          if (this.isTablePersoStateValid(persoState)) {
            return merge([], persoState.aColumns); // pass-by-value, not pass-by-reference
          }
          return undefined;
        }
      } catch (error) {
        this.logger.warning("Could not fetch table columns from personalization storage", error);
        return undefined;
      }
    },
    isTablePersoStateValid: function _isTablePersoStateValid(persoState) {
      if (!persoState || persoState._persoSchemaVersion !== "p13n" || !Array.isArray(persoState.aColumns)) {
        return false;
      }
      for (const column of persoState.aColumns) {
        if (column.p13NColumnName === undefined) {
          return false;
        }
      }
      return true;
    },
    setTableColumns: function _setTableColumns(columns, isStorage) {
      this.setProperty("/tableColumns", columns);
      if (isStorage) {
        this.saveTableColumns(columns);
      }
    },
    saveTableColumns: function _saveTableColumns(columns) {
      try {
        if (this.getProperty("/tableDataSource").length > 0) {
          const storageId = PersonalizationKeys.searchResultTableState + this.getProperty("/tableDataSource");
          this.getPersonalizationStorageInstance().setItem(storageId, {
            aColumns: columns,
            _persoSchemaVersion: "p13n"
          });
        }
      } catch (error) {
        this.logger.warning("Could not save table columns to personalization storage", error);
      }
    },
    getTableInitialColumns: function _getTableInitialColumns() {
      if (!this.tableFormatter) {
        this.tableFormatter = new SearchResultTableFormatter(this);
      }
      const columns = this.getTableColumns(false);
      if (columns?.length > 0) {
        return this.tableFormatter.formatInitialColumns(columns);
      } else {
        return [];
      }
    },
    setTableData: function _setTableData(formattedResults) {
      try {
        if (this.isHomogenousResult()) {
          /* 
          Principle: 
              keep table data in search model as lang as datasource is not changed, otherwise 100%-width-columns in same-datasource-search will be modifed
           Example 1:
          1. Search "*" in Products -> has results -> set columns, set initial columns, set rows
              /tableDataSource        = Products
              /tableColumns           = [Product Id, Product Name, Product Price]
              /tableInitialColumns    = [Product Id, Product Name, Product Price]
              /tableRows              = [Product1, Product2, Product3]
           2. Search "$" in Employees -> has empty result -> reset table data
              /tableDataSource        = undefined
              /tableColumns           = []
              /tableInitialColumns    = []
              /tableRows              = []
           3. Search "*" in Employees -> has results -> set columns, set initial columns, set rows
              /tableDataSource        = Employees
              /tableColumns           = [Employee Id, Employee Name, Employee Address]
              /tableInitialColumns    = [Employee Id, Employee Name, Employee Address]
              /tableRows              = [Employee1, Employee2, Employee3]
           Example 2:
          1. Search "*" in Employees -> has results -> set columns, set initial columns, set rows
              /tableDataSource        = Employees
              /tableColumns           = [Employee Id, Employee Name, Employee Address]
              /tableInitialColumns    = [Employee Id, Employee Name, Employee Address]
              /tableRows              = [Employee1, Employee2, Employee3]
           2. Search "$" in Employees -> has empty result -> reset table data
              /tableDataSource        = Employees
              /tableColumns           = [Employee Id, Employee Name, Employee Address]
              /tableInitialColumns    = [Employee Id, Employee Name, Employee Address]
              /tableRows              = []
           3. Search "*" in Employees -> has results -> set columns, set initial columns, set rows
              /tableDataSource        = Employees
              /tableColumns           = [Employee Id, Employee Name, Employee Address]
              /tableInitialColumns    = [Employee Id, Employee Name, Employee Address]
              /tableRows              = [Employee1, Employee2, Employee3]
          */

          if (!this.tableFormatter) {
            this.tableFormatter = new SearchResultTableFormatter(this);
          }
          if (formattedResults.length > 0) {
            // set data source of table
            this.setProperty("/tableDataSource", this.getDataSource().id);

            // set columns
            this.setTableColumns(this.tableFormatter.formatColumns(formattedResults), true);

            // set initial columns
            // prevent pass-by-reference between /tableColumns and /tableInitialColumns
            // use getTableInitialColumns() in run time, instead of setProperty("/tableInitialColumns", ...)

            // set rows
            const rows = this.tableFormatter.formatRows(formattedResults, this.getTableColumns(false));
            for (let i = 0; i < rows.length; i++) {
              formattedResults[i].cells = rows[i].cells;
            }
            this.setProperty("/tableRows", formattedResults);
          } else {
            this.resetTableData();
          }
        } else {
          this.resetTableData();
        }
      } catch (error) {
        this.logger.warning("Could not set table data", error);
        this.resetTableData();
      }
    },
    resetTableData: function _resetTableData() {
      this.setProperty("/tableDataSource", undefined);
      this.setProperty("/tableColumns", []);
      // prevent pass-by-reference between /tableColumns and /tableInitialColumns
      // use getTableInitialColumns() in run time, instead of setProperty("/tableInitialColumns", ...)
      // this.setProperty("/tableInitialColumns", []);
      this.setProperty("/tableRows", []);
    }
  });
  SearchModel._searchModels = {};
  SearchModel.getModelSingleton = function getModelSingleton(configuration, id) {
    const modelId = id || "default";
    if (!SearchModel._searchModels[modelId]) {
      configuration.isUshell = modelId === "flp" ? true : false;
      SearchModel._searchModels[modelId] = new SearchModel({
        configuration: configuration
      });
    }
    return SearchModel._searchModels[modelId];
  };
  return SearchModel;
});
})();