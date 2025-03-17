/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/base/Log", "sap/f/GridContainer", "sap/f/GridContainerSettings", "sap/m/HeaderContainer", "sap/m/IllustratedMessage", "sap/m/IllustratedMessageSize", "sap/m/IllustratedMessageType", "sap/m/MessageToast", "sap/m/VBox", "sap/m/library", "sap/ushell/Config", "sap/ushell/Container", "./App", "./BasePanel", "./utils/AppManager", "./utils/Device"], function (Log, GridContainer, GridContainerSettings, HeaderContainer, IllustratedMessage, IllustratedMessageSize, IllustratedMessageType, MessageToast, VBox, sap_m_library, Config, Container, __App, __BasePanel, __AppManager, ___utils_Device) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  function _catch(body, recover) {
    try {
      var result = body();
    } catch (e) {
      return recover(e);
    }
    if (result && result.then) {
      return result.then(void 0, recover);
    }
    return result;
  }
  const BackgroundDesign = sap_m_library["BackgroundDesign"];
  function _finallyRethrows(body, finalizer) {
    try {
      var result = body();
    } catch (e) {
      return finalizer(true, e);
    }
    if (result && result.then) {
      return result.then(finalizer.bind(null, false), finalizer.bind(null, true));
    }
    return finalizer(false, result);
  }
  const App = _interopRequireDefault(__App);
  const BasePanel = _interopRequireDefault(__BasePanel);
  const AppManager = _interopRequireDefault(__AppManager);
  const DeviceType = ___utils_Device["DeviceType"];
  /**
   *
   * Base App Panel class for managing and storing Apps.
   *
   * @extends sap.cux.home.BasePanel
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.121.0
   *
   * @abstract
   * @internal
   * @experimental Since 1.121
   * @private
   *
   * @alias sap.cux.home.BaseAppPanel
   */
  const BaseAppPanel = BasePanel.extend("sap.cux.home.BaseAppPanel", {
    metadata: {
      library: "sap.cux.home",
      defaultAggregation: "apps",
      aggregations: {
        /**
         * Holds the apps aggregation
         */
        apps: {
          type: "sap.cux.home.App",
          singularName: "app",
          multiple: true
        }
      },
      events: {
        /**
         * Fired when OnBeforeRendering of container is triggered.
         */
        navigated: {},
        /**
         * Fired when the panel supported property is changed.
         */
        supported: {
          parameters: {
            isSupported: {
              type: "boolean"
            }
          }
        }
      }
    },
    constructor: function _constructor(id, settings) {
      BasePanel.prototype.constructor.call(this, id, settings);
      this._isDirty = true;
      this._isMobileDirty = true;
      this._isLoaded = false;
      this._isSupported = true;
      /**
       * Sets aggregation for give control.
       * @param {Object} control - Control for which aggregation has to be set.
       * @param {Object[]} items - Items to be added in aggregation.
       * @param {string} aggregationName - Aggregation name
       * @private
       */
      this._setAggregation = function (control) {
        let items = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        let aggregationName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "items";
        items.forEach(oItem => {
          control.addAggregation(aggregationName, oItem, true);
        });
      };
    },
    init: function _init() {
      BasePanel.prototype.init.call(this);
      this.appManagerInstance = AppManager.getInstance();
      this._controlMap = new Map();
      //Add Wrapper to Panel
      this._appsPanelWrapper = this._generateWrapper();
      this._addContent(this._appsPanelWrapper);
    },
    /**
     * Generates the wrapper for the apps panel, if it doesn't already exist
     *
     * @private
     * @override
     * @returns {sap.m.VBox} The apps panel wrapper.
     */
    _generateWrapper: function _generateWrapper() {
      if (!this._appsPanelWrapper) {
        this._appsPanelWrapper = new VBox(`${this.getId()}-appsPanelWrapper`, {
          items: [this._generateDesktopAppsWrapper(), this._generateMobileAppsWrapper(), this._generateErrorMessage()],
          width: "100%"
        }).addStyleClass("sapCuxAppsPanel sapCuxAppsContainerBorder");
      }
      return this._appsPanelWrapper;
    },
    /**
     * Generates desktop apps wrapper for displaying apps.
     * @private
     * @returns {sap.m.VBox} The generated apps wrapper.
     */
    _generateDesktopAppsWrapper: function _generateDesktopAppsWrapper() {
      const controlId = `${this.getId()}-desktopAppsWrapper`;
      if (!this._controlMap.get(controlId)) {
        this._controlMap.set(controlId, new VBox({
          id: `${this.getId()}-desktopAppsWrapper`,
          items: [this._generateAppsWrapper()],
          visible: this.getDeviceType() !== DeviceType.Mobile,
          backgroundDesign: BackgroundDesign.Solid
        }).addStyleClass("sapCuxAppsPanel sapCuxAppsContainerBorder"));
      }
      return this._controlMap.get(controlId);
    },
    /**
     * Generates app wrapper (GridContainer) for displaying apps.
     * @private
     * @returns {sap.m.GridContainer} The generated apps wrapper.
     */
    _generateAppsWrapper: function _generateAppsWrapper() {
      //create container
      if (!this._appsWrapper) {
        this._appsWrapper = new GridContainer({
          id: `${this.getId()}-appsWrapper`,
          layout: new GridContainerSettings({
            columnSize: "19rem",
            gap: "0.5rem"
          }),
          visible: this.getDeviceType() !== DeviceType.Mobile
        });
      }
      return this._appsWrapper;
    },
    /**
     * Generates wrapper for displaying apps in mobile mode.
     * @private
     * @returns {sap.m.HeaderContainer} The generated apps wrapper.
     */
    _generateMobileAppsWrapper: function _generateMobileAppsWrapper() {
      if (!this._mobileAppsWrapper) {
        this._mobileAppsWrapper = new HeaderContainer({
          id: `${this.getId()}-mobileAppsWrapper`,
          gridLayout: true,
          showDividers: false,
          height: "23.5rem",
          content: [],
          visible: this.getDeviceType() === DeviceType.Mobile
        }).addStyleClass("sapUiMargin-26Bottom sapMHeaderContainerAlign");
      }
      return this._mobileAppsWrapper;
    },
    /**
     * Generates the error message wrapper with illustrated message.
     * @private
     * @returns {sap.m.VBox} Wrapper with illustrated message.
     */
    _generateErrorMessage: function _generateErrorMessage() {
      if (!this._errorCard) {
        this._errorCard = new VBox(`${this.getId()}-errorCard`, {
          wrap: "Wrap",
          backgroundDesign: "Solid",
          items: [this.generateIllustratedMessage()],
          visible: this.getApps().length === 0,
          justifyContent: "Center"
        }).addStyleClass("sapCuxAppsPanel");
      }
      this._errorCard.setHeight(this.getDeviceType() === DeviceType.Mobile ? "23.5rem" : "auto");
      return this._errorCard;
    },
    /**
     * Creates and returns app instances for given app objects
     * @private
     * @param {object[]} appObjects - Array of app object.
     * @returns {sap.cux.home.App[]} - Array of app instances
     */
    generateApps: function _generateApps(visualizationsData) {
      return visualizationsData.map(visualizationData => {
        const app = new App("", {
          title: visualizationData.title,
          subTitle: visualizationData.subtitle,
          bgColor: visualizationData.BGColor,
          icon: visualizationData.icon,
          url: visualizationData.url,
          vizId: visualizationData.vizId || visualizationData.visualization?.vizId,
          status: visualizationData.status
        });
        if (visualizationData.oldAppId) {
          app.data("oldAppId", visualizationData.oldAppId);
        }
        visualizationData.menuItems?.forEach(menuItem => {
          app.addAggregation("menuItems", menuItem, true);
        });
        return app;
      });
    },
    /**
     * Add multiple apps in the apps aggregation.
     * @param {sap.cux.home.App[]} apps - Array of apps.
     */
    setApps: function _setApps(apps) {
      apps.forEach(app => {
        this.addAggregation("apps", app, true);
      });
    },
    /**
     * Fetches and returns the tile visualizations for the current device type (Mobile or Desktop).
     *
     * @public
     * @param {GenericTile[]} tiles - This array will be updated with new tile data based on the device type.
     *
     * @returns {GenericTile[]} - returns updated tiles
     */
    fetchTileVisualization: function _fetchTileVisualization() {
      let tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      if (this.getDeviceType() === DeviceType.Mobile) {
        const cards = this._generateMobileAppsWrapper()?.getContent() || [];
        for (const card of cards) {
          tiles = tiles.concat(card?.getContent() || []);
        }
      } else {
        tiles = this._generateAppsWrapper()?.getItems() || [];
      }
      return tiles;
    },
    /**
     * Convert array of provided activities to app
     * @private
     * @param {object[]} activities - Array of activities.
     * @returns {object[]} - Array of apps
     */
    convertActivitiesToVisualizations: function _convertActivitiesToVisualizations(activities) {
      try {
        const _this = this;
        return Promise.resolve(Promise.all([_this._getAllAvailableVisualizations(), Container.getServiceAsync("URLParsing")])).then(function (_ref) {
          let [availableVisualizations, URLParsingService] = _ref;
          const appActivities = activities.filter(activity => activity.appType === "Application").map(activity => {
            activity.orgAppId = activity.appId;
            activity.appId = activity.url;
            return activity;
          });
          const visualizations = appActivities.map(activity => _this._convertToVisualization(activity, availableVisualizations, URLParsingService)).filter(activity => activity !== undefined);
          return Promise.resolve(_this._updateVisualizationAvailability(visualizations));
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Returns promise that resolves to array of all available visualizations
     * @private
     * @returns {Promise} A Promise that resolves to array of all available visualizations.
     */
    _getAllAvailableVisualizations: function _getAllAvailableVisualizations() {
      try {
        const _this2 = this;
        function _temp2() {
          return _this2._allAvailableVisualizations;
        }
        const _temp = function () {
          if (!_this2._allAvailableVisualizations) {
            return Promise.resolve(_this2.appManagerInstance._getCatalogApps()).then(function (catalogApps) {
              _this2._allAvailableVisualizations = catalogApps.reduce((visualizations, catalogApp) => {
                return visualizations.concat(catalogApp.visualizations || []);
              }, []);
            });
          }
        }();
        return Promise.resolve(_temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Updates vizualization array with information - if vizualization is present in favorites .
     * @private
     * @param {object[]} visualizations - Array of vizualizations.
     * @returns {object[]} - Array of updated vizualizations.
     */
    _updateVisualizationAvailability: function _updateVisualizationAvailability(visualizations) {
      try {
        const _this3 = this;
        return Promise.resolve(_this3.appManagerInstance.fetchFavVizs(true, true)).then(function (favoriteVisualizations) {
          visualizations.forEach(visualization => {
            visualization.addedInFavorites = favoriteVisualizations.some(favoriteVisualization => favoriteVisualization.oldAppId === visualization.orgAppId);
          });
          return visualizations;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Updates user activity with provided vizualization info
     * @private
     * @param {object} activity - User activity.
     * @param {object} updatedVizConfig - Updated vizualization config.
     * @returns {object} - Updated user acitvity.
     */
    _updateActivityInfo: function _updateActivityInfo(activity, updatedVizConfig) {
      this._catalogVisualizationCache = this._catalogVisualizationCache || new Map();
      activity.targetURL = updatedVizConfig.targetURL;
      activity.vizId = updatedVizConfig.vizId;
      this._catalogVisualizationCache.set(activity.orgAppId, updatedVizConfig);
      return activity;
    },
    /**
     * Finds the best matching visualization for a given activity from a list of matching visualizations.
     *
     * This method first attempts to find an exact match for the target URL of the activity among the matching visualizations.
     * If no exact match is found, it uses the URLParsingService to compare parameters of the target URLs to find the best match.
     * It then updates the activity information with the best matching visualization.
     *
     * @private
     * @param {IActivity} activity - The activity for which to find the best matching visualization.
     * @param {IVisualization[]} matchingVisualizations - A list of visualizations that match the activity.
     * @param {URLParsing} URLParsingService - A service used to parse and compare target URLs.
     * @returns {IVisualization | undefined} The best matching visualization, or undefined if no match is found.
     */
    _findBestMatchingVisualization: function _findBestMatchingVisualization(activity, matchingVisualizations, URLParsingService) {
      //if there are multiple matching apps, compare the target urls
      const matchedVisualization = matchingVisualizations.find(matchingViz => matchingViz.targetURL === activity.url);
      if (matchedVisualization) {
        return this._updateActivityInfo(activity, matchedVisualization);
      } else {
        //edge cases, when no exact targetUrl match
        const matchedVisualizationCache = new Map();
        const matchedVisualizations = [];
        matchingVisualizations.forEach(visualization => {
          const targetURL = visualization.targetURL;
          if (!matchedVisualizationCache.get(targetURL)) {
            const matchedVisualization = {
              viz: visualization,
              params: URLParsingService.parseShellHash(visualization.targetURL).params,
              prio: 0
            };
            matchedVisualizationCache.set(targetURL, matchedVisualization);
            matchedVisualizations.push(matchedVisualization);
          }
        });
        const filteredVisualizations = matchedVisualizations.filter(matchedVisualization => this._filterMatchingVisualization(activity, matchedVisualization, URLParsingService));
        if (filteredVisualizations.length) {
          // more than 1 matching condition for unique targetUrls
          // this could be either because there is exact match and/or also allItems true and/or no params in VizData param keys
          // then find best match possible, based on prio
          filteredVisualizations.sort((val1, val2) => val1.prio - val2.prio);
          return this._updateActivityInfo(activity, filteredVisualizations[0].viz);
        }
      }
    },
    /**
     * Filters matching visualizations based on activity parameters and assigns priority.
     *
     * This method compares the parameters of the activity with those of a matched visualization
     * to determine if they match.
     *
     * @private
     * @returns {boolean} Returns true if the visualization matches the activity, false otherwise.
     */
    _filterMatchingVisualization: function _filterMatchingVisualization(activity, matchedVisualization, URLParsingService) {
      const parshedShellHash = URLParsingService.parseShellHash(activity.url);
      const activityParameters = parshedShellHash.params;
      const activityParameterKeys = Object.keys(activityParameters);
      const visualizationParams = matchedVisualization.params;
      //filter keys other than 'allItems', for myinbox tasks allItems key is a generally common key hence filter that
      const visualizationParamKeys = Object.keys(visualizationParams).filter(key => key !== "allItems");
      if (visualizationParamKeys.length === activityParameterKeys.length) {
        const bMatch = activityParameterKeys.every(key => visualizationParamKeys.includes(key) && visualizationParams[key][0] === activityParameters[key][0]);
        if (bMatch) {
          matchedVisualization.prio = 1;
          return true;
        }
        return false;
      } else if (!visualizationParamKeys.length) {
        //this could mean either visualizationParamKeys did not have any key or the only key present was 'allItems'
        //if 'allItems' present give prio 2 else prio 3
        matchedVisualization.prio = Object.keys(matchedVisualization.params).length ? 2 : 3;
        return true;
      }
      //filtered visualizationParamKeys length doesnt match aAppParamKeys length & visualizationParamKeys length is not 0
      return false;
    },
    /**
     * Converts given user activity to vizualization
     * @private
     * @param {object} activity - User Activity.
     * @param {object[]} catalogVisualizations - array of all available visualizations in catalog.
     * @param {object} URLParsingService - URL parsing service.
     * @returns {object} - visualization
     */
    _convertToVisualization: function _convertToVisualization(activity, catalogVisualizations, URLParsingService) {
      this._catalogVisualizationCache = this._catalogVisualizationCache || new Map();
      const catalogVisualization = this._catalogVisualizationCache.get(activity.orgAppId);
      if (catalogVisualization) {
        return this._updateActivityInfo(activity, catalogVisualization);
      } else {
        const matchingVisualizations = catalogVisualizations.filter(visualization => visualization.vizId && `#${visualization.target?.semanticObject}-${visualization.target?.action}` === activity.orgAppId);
        if (matchingVisualizations.length > 1) {
          return this._findBestMatchingVisualization(activity, matchingVisualizations, URLParsingService);
        } else if (matchingVisualizations.length === 1) {
          return this._updateActivityInfo(activity, matchingVisualizations[0]);
        }
      }
    },
    /**
     * Adds visualization to favorite apps
     * @private
     * @param {sap.ui.base.Event} event - The event object.
     */
    _addAppToFavorites: function _addAppToFavorites(event) {
      try {
        const _this4 = this;
        _this4.setBusy(true);
        return Promise.resolve(_finallyRethrows(function () {
          return _catch(function () {
            const source = event.getSource();
            const app = source.getParent();
            const vizId = app.getVizId?.();
            const _temp3 = function () {
              if (vizId) {
                //Add Apps to the 'Recently Added Apps' section
                return Promise.resolve(_this4.appManagerInstance.addVisualization(vizId)).then(function () {
                  return Promise.resolve((_this4.getParent?.())._refreshAllPanels()).then(function () {
                    const message = _this4._i18nBundle.getText("appMovedToFavorites", [app.getTitle()]);
                    MessageToast.show(message);
                  });
                });
              }
            }();
            if (_temp3 && _temp3.then) return _temp3.then(function () {});
          }, function (error) {
            Log.error(error);
          });
        }, function (_wasThrown, _result) {
          _this4.setBusy(false);
          if (_wasThrown) throw _result;
          return _result;
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Checks if the panel is loaded. If the panel is not loaded then placholders are shown otherwise not
     * @private
     * @returns {boolean} true if the panel is loaded, false otherwise.
     */
    isLoaded: function _isLoaded() {
      return this._isLoaded;
    },
    /**
     * Set the loaded status of the app panel.
     * @private
     * @param {boolean} val - The new loaded status to set for the app panel.
     */
    setLoaded: function _setLoaded(val) {
      this._isLoaded = val;
    },
    /**
     * Returns the dirty status of the app panel. If the panel is dirty then only re-render the apps
     * @private
     * @returns {boolean} true if the panel is dirty, false otherwise.
     */
    isDirty: function _isDirty() {
      return this._isDirty;
    },
    /**
     * Set the dirty status of the app panel.
     * @private
     * @param {boolean} val - The new dirty status to set for the app panel.
     */
    setDesktopViewDirty: function _setDesktopViewDirty(val) {
      this._isDirty = val;
    },
    /**
     * Returns the dirty status of the app mobile panel. If the panel is dirty then only re-render the apps
     * @private
     * @returns {boolean} true if the panel is dirty, false otherwise.
     */
    isMobileDirty: function _isMobileDirty() {
      return this._isMobileDirty;
    },
    /**
     * Set the dirty status of the app mobile panel.
     * @private
     * @param {boolean} val - The new dirty status to set for the app mobile panel.
     */
    setMobileViewDirty: function _setMobileViewDirty(val) {
      this._isMobileDirty = val;
    },
    /**
     * Sets the busy state of panel.
     * @private
     * @param {boolean} isBusy - Indicates whether the panel should be set to busy state.
     */
    setBusy: function _setBusy(isBusy) {
      const oAppsWrapper = this._generateAppsWrapper();
      oAppsWrapper.setBusy(isBusy);
    },
    /**
     * Retrieves the group with the specified group Id.
     * @private
     * @param {string} groupId - The Id of the group.
     * @returns {sap.cux.home.Group} The group with the specified group Id, or null if not found.
     */
    _getGroup: function _getGroup(groupId) {
      const groups = this.getAggregation("groups") || [];
      return groups.find(group => group.getGroupId() === groupId);
    },
    /**
     * Checks if the panel is supported.
     * @returns {boolean} True if the panel is supported, false otherwise.
     * @private
     */
    isSupported: function _isSupported() {
      return this._isSupported;
    },
    /**
     * Sets panel as supported or unsupported.
     * @param {boolean} isSupported true if the panel is supported, false otherwise.
     * @private
     */
    setSupported: function _setSupported(isSupported) {
      this._isSupported = isSupported;
    },
    /**
     * Attaches user activity tracking based on the configuration.
     * If user activity tracking is enabled, it listens to changes in tracking activity configuration
     * and fires a 'supported' event accordingly.
     * @private
     */
    _attachUserActivityTracking: function _attachUserActivityTracking() {
      if (Config.last("/core/shell/enableRecentActivity")) {
        Config.on("/core/shell/model/enableTrackingActivity").do(isTrackingActivityEnabled => {
          this.fireSupported({
            isSupported: isTrackingActivityEnabled
          });
        });
      }
    },
    /**
     * Refreshes the panel.
     * @public
     */
    refresh: function _refresh() {
      try {
        const _this5 = this;
        return Promise.resolve(_this5.getParent().refreshPanel(_this5)).then(function () {});
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Generates default illustrated message for panel.
     * @private
     * @returns {sap.m.IllustratedMessage} Illustrated error message for panel.
     */
    generateIllustratedMessage: function _generateIllustratedMessage() {
      if (!this._errorMessage) {
        this._errorMessage = new IllustratedMessage(`${this.getId()}-errorMessage`, {
          illustrationSize: IllustratedMessageSize.Spot,
          illustrationType: IllustratedMessageType.AddColumn,
          title: this._i18nBundle.getText("noAppsTitle"),
          description: this._i18nBundle.getText("noData")
        });
      }
      return this._errorMessage;
    }
  });
  return BaseAppPanel;
});
//# sourceMappingURL=BaseAppPanel-dbg-dbg.js.map
