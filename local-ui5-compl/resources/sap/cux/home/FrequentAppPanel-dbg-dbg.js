/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/base/Log", "sap/ushell/Container", "sap/ushell/EventHub", "./BaseAppPersPanel", "./MenuItem"], function (Log, Container, EventHub, __BaseAppPersPanel, __MenuItem) {
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
  const BaseAppPersPanel = _interopRequireDefault(__BaseAppPersPanel);
  const MenuItem = _interopRequireDefault(__MenuItem);
  /**
   *
   * Provides the class for managing frequent apps.
   *
   * @extends sap.cux.home.BaseAppPersPanel
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.121.0
   *
   * @internal
   * @experimental Since 1.121
   * @public
   *
   * @alias sap.cux.home.FrequentAppPanel
   */
  const FrequentAppPanel = BaseAppPersPanel.extend("sap.cux.home.FrequentAppPanel", {
    metadata: {
      library: "sap.cux.home",
      defaultAggregation: "apps",
      aggregations: {
        /**
         * Apps aggregation for Frequent apps
         */
        apps: {
          type: "sap.cux.home.App",
          singularName: "app",
          multiple: true,
          visibility: "hidden"
        }
      }
    },
    /**
     * Constructor for a new frequent app panel.
     *
     * @param {string} [id] ID for the new control, generated automatically if an ID is not provided
     * @param {object} [settings] Initial settings for the new control
     */
    constructor: function _constructor(id, settings) {
      BaseAppPersPanel.prototype.constructor.call(this, id, settings);
      this.setSupported(false);
    },
    init: function _init() {
      BaseAppPersPanel.prototype.init.call(this);
      this.setProperty("key", "frequentApps");
      this.setProperty("title", this._i18nBundle.getText("frequentlyUsedTab"));
      this.setProperty("tooltip", this._i18nBundle.getText("frequentlyUsedTabInfo"));
      this._attachUserActivityTracking();
      EventHub.on("userRecentsCleared").do(() => {
        void this.refresh();
      });
    },
    /**
     * Fetch frequent apps and set apps aggregation
     * @private
     */
    loadApps: function _loadApps() {
      try {
        const _this = this;
        return Promise.resolve(_this._getFrequentVisualizations()).then(function (frequentVisualizations) {
          frequentVisualizations = frequentVisualizations.map(visualization => {
            return {
              ...visualization,
              menuItems: _this._getActions(visualization.addedInFavorites)
            };
          });
          _this.destroyAggregation("apps", true);
          //convert apps objects array to apps instances
          const frequentApps = _this.generateApps(frequentVisualizations);
          _this.setApps(frequentApps);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Returns list of frequent apps
     * @private
     * @returns {object[]} - Array of frequent apps.
     */
    _getFrequentVisualizations: function _getFrequentVisualizations() {
      try {
        const _this2 = this;
        return Promise.resolve(_catch(function () {
          return Promise.resolve(Container.getServiceAsync("UserRecents")).then(function (UserRecentsService) {
            return Promise.resolve(UserRecentsService?.getFrequentActivity()).then(function (frequentActivities) {
              //convert activity to apps
              return Promise.resolve(_this2.convertActivitiesToVisualizations(frequentActivities));
            });
          });
        }, function (error) {
          Log.error(error);
          return [];
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Returns list of actions available for selected app
     * @private
     * @param {boolean} isAppAddedInFavorite - true if app is already present in favorite, false otherwise.
     * @returns {sap.cux.home.MenuItem[]} - Array of list items.
     */
    _getActions: function _getActions() {
      let isAppAddedInFavorite = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      const action = [];
      if (!isAppAddedInFavorite) {
        action.push(new MenuItem("", {
          title: this._i18nBundle.getText("addToFavorites"),
          icon: "sap-icon://add-favorite",
          press: event => {
            void this._addAppToFavorites(event);
          }
        }));
      }
      return action;
    },
    /**
     * Generates illustrated message for frequent apps panel.
     * @private
     * @override
     * @returns {sap.m.IllustratedMessage} Illustrated error message.
     */
    generateIllustratedMessage: function _generateIllustratedMessage() {
      const illustratedMessage = BaseAppPersPanel.prototype.generateIllustratedMessage.call(this);
      //override the default description
      illustratedMessage.setDescription(this._i18nBundle.getText("noFreqAppsDescription"));
      return illustratedMessage;
    }
  });
  return FrequentAppPanel;
});
//# sourceMappingURL=FrequentAppPanel-dbg-dbg.js.map
