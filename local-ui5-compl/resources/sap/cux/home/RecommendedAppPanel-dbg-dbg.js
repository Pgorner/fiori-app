/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/base/Log", "sap/m/Button", "sap/m/IllustratedMessageType", "sap/m/library", "sap/m/Link", "sap/m/MessageStrip", "sap/m/MessageToast", "sap/m/VBox", "sap/ui/core/EventBus", "./BaseAppPersPanel", "./MenuItem", "./utils/Constants", "./utils/Device", "./utils/FESRUtil", "./utils/HttpHelper"], function (Log, Button, IllustratedMessageType, sap_m_library, Link, MessageStrip, MessageToast, VBox, EventBus, __BaseAppPersPanel, __MenuItem, ___utils_Constants, ___utils_Device, ___utils_FESRUtil, __HttpHelper) {
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
  const BaseAppPersPanel = _interopRequireDefault(__BaseAppPersPanel);
  const MenuItem = _interopRequireDefault(__MenuItem);
  const FEATURE_TOGGLES = ___utils_Constants["FEATURE_TOGGLES"];
  const REPO_BASE_URL = ___utils_Constants["REPO_BASE_URL"];
  const SETTINGS_PANELS_KEYS = ___utils_Constants["SETTINGS_PANELS_KEYS"];
  const DeviceType = ___utils_Device["DeviceType"];
  const addFESRId = ___utils_FESRUtil["addFESRId"];
  const HttpHelper = _interopRequireDefault(__HttpHelper);
  const CONSTANTS = {
    USER_PREFERENCE_SRVC_URL: `${REPO_BASE_URL}UserPreference`,
    KEY: "recommendedApps"
  };

  /**
   *
   * Provides the RecommendedAppPanel Class.
   *
   * @extends sap.cux.home.BaseAppPersPanel
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.128.0
   *
   * @private
   * @experimental
   * @hidden
   *
   * @alias sap.cux.home.RecommendedAppPanel
   */
  const RecommendedAppPanel = BaseAppPersPanel.extend("sap.cux.home.RecommendedAppPanel", {
    metadata: {
      library: "sap.cux.home",
      defaultAggregation: "apps",
      aggregations: {
        /**
         * Apps aggregation for Recommended apps
         */
        apps: {
          type: "sap.cux.home.App",
          singularName: "app",
          multiple: true,
          visibility: "hidden"
        }
      }
    },
    constructor: function _constructor(id, settings) {
      BaseAppPersPanel.prototype.constructor.call(this, id, settings);
      this.setSupported(false);
    },
    init: function _init() {
      BaseAppPersPanel.prototype.init.call(this);
      this.setProperty("key", CONSTANTS.KEY);
      this.setProperty("title", this._i18nBundle.getText("recommendedAppsTab"));
      //subscribe to recommendation setting change event
      const eventBus = EventBus.getInstance();
      eventBus.subscribe("importChannel", "recommendationSettingChanged", (channelId, eventId, data) => {
        const showRecommendation = data.showRecommendation;
        this.fireSupported({
          isSupported: showRecommendation
        });
      });
      if (this.getDeviceType() !== DeviceType.Mobile) {
        void this._enableRecommendationTab();
      }
    },
    /**
     * Overrides the wrapper for the apps panel to add message strip.
     *
     * @private
     * @returns {sap.m.VBox} The apps panel wrapper.
     */
    _generateWrapper: function _generateWrapper() {
      const wrapperId = `${this.getId()}-recommendedPanelWrapper`;
      if (!this._controlMap.get(wrapperId)) {
        this._controlMap.set(wrapperId, new VBox(wrapperId, {
          items: [this._generateMessageStrip(), BaseAppPersPanel.prototype._generateWrapper.call(this)],
          backgroundDesign: BackgroundDesign.Transparent
        }));
      }
      return this._controlMap.get(wrapperId);
    },
    /**
     * Fetch recommended apps and set apps aggregation
     * @private
     */
    loadApps: function _loadApps() {
      try {
        const _this = this;
        return Promise.resolve(_this.appManagerInstance.getRecommendedVisualizations(true)).then(function (recommendedVisualizations) {
          recommendedVisualizations = recommendedVisualizations.map(visualization => {
            return {
              ...visualization,
              menuItems: _this._getActions()
            };
          });
          _this.destroyAggregation("apps", true);
          //convert apps objects array to apps instances
          const recommendedApps = _this.generateApps(recommendedVisualizations);
          _this.setApps(recommendedApps);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Returns message strip for recommended tab
     * @private
     * @returns {sap.cux.home.MessageStrip} - Message strip control.
     */
    _generateMessageStrip: function _generateMessageStrip() {
      const messageStripId = `${this.getId()}-messageStrip`;
      if (!this._controlMap.get(messageStripId)) {
        this._controlMap.set(messageStripId, new MessageStrip(messageStripId, {
          text: this._i18nBundle.getText("recommendationMessageStrip"),
          showIcon: true,
          showCloseButton: true,
          link: new Link(`${messageStripId}-settings`, {
            text: this._i18nBundle.getText("settings"),
            press: () => this.getParent()?._getLayout()?.openSettingsDialog(SETTINGS_PANELS_KEYS.ADVANCED)
          }).addStyleClass("sapUiNoMargin")
        }).addStyleClass("sapUiNoMarginBegin sapUiTinyMarginBottom"));
      }
      return this._controlMap.get(messageStripId);
    },
    /**
     * Returns list of actions available for selected app
     * @private
     * @returns {sap.cux.home.MenuItem[]} - Array of list items.
     */
    _getActions: function _getActions() {
      const addToFavoritesItem = new MenuItem({
        title: this._i18nBundle.getText("addToFavorites"),
        icon: "sap-icon://add-favorite",
        press: event => {
          void this._addAppToFavorites(event);
        }
      });
      addFESRId(addToFavoritesItem, "acceptRecommendation");
      const notRelevantItem = new MenuItem({
        title: this._i18nBundle.getText("notRelevantRecommendation"),
        icon: "sap-icon://decline",
        press: event => {
          void this._rejectRecommendation(event);
        }
      });
      addFESRId(notRelevantItem, "rejectRecommendation");
      const actions = [addToFavoritesItem, notRelevantItem];
      return actions;
    },
    /**
     * Rejects the selected app as recommendation
     * @private
     * @param {sap.ui.base.MenuItem$PressEvent} event - Event object.
     */
    _rejectRecommendation: function _rejectRecommendation(event) {
      try {
        const _this2 = this;
        _this2.setBusy(true);
        const _temp2 = _finallyRethrows(function () {
          return _catch(function () {
            const source = event.getSource();
            const app = source.getParent();
            const title = app.getTitle();
            return Promise.resolve(_this2.appManagerInstance.getRecommendedVisualizations()).then(function (recommendedVisualizations) {
              const visualization = recommendedVisualizations.find(viz => viz.url === app.getUrl());
              const fioriId = visualization?.fioriId;
              const _temp = function () {
                if (fioriId) {
                  const rejectPayload = {
                    AppId: fioriId,
                    Decision: 1
                  };
                  return Promise.resolve(HttpHelper.Post(CONSTANTS.USER_PREFERENCE_SRVC_URL, rejectPayload)).then(function () {
                    return Promise.resolve(_this2.refresh()).then(function () {
                      const message = _this2._i18nBundle.getText("rejectRecommendationMsg", [title]);
                      MessageToast.show(message);
                    });
                  });
                }
              }();
              if (_temp && _temp.then) return _temp.then(function () {});
            });
          }, function (error) {
            Log.error(error);
          });
        }, function (_wasThrown, _result) {
          _this2.setBusy(false);
          if (_wasThrown) throw _result;
          return _result;
        });
        return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Checks if recommendation is enabled based on recommendation feature toggle and user personalization.
     * @private
     * @returns {Boolean} - Returns true if recommendation is enabled otherwise false.
     */
    _isRecommendationEnabled: function _isRecommendationEnabled() {
      try {
        const _this3 = this;
        return Promise.resolve(_this3.appManagerInstance.isFeatureEnabled(FEATURE_TOGGLES.RECOMMENDATION)).then(function (recommendationEnabled) {
          let _exit = false;
          const _temp4 = function () {
            if (recommendationEnabled) {
              return Promise.resolve(_this3.getPersonalization()).then(function (personalisation) {
                const _temp3 = personalisation.showRecommendation ?? true;
                _exit = true;
                return _temp3;
              });
            }
          }();
          return _temp4 && _temp4.then ? _temp4.then(function (_result2) {
            return _exit ? _result2 : false;
          }) : _exit ? _temp4 : false;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Show recommendation tab if recommendation is enabled
     * @private
     */
    _enableRecommendationTab: function _enableRecommendationTab() {
      try {
        const _this4 = this;
        return Promise.resolve(_this4._isRecommendationEnabled()).then(function (isSupported) {
          _this4.setSupported(isSupported);
          _this4.fireSupported({
            isSupported
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Generates illustrated message for recommended apps panel.
     * @private
     * @override
     * @returns {sap.m.IllustratedMessage} Illustrated error message.
     */
    generateIllustratedMessage: function _generateIllustratedMessage() {
      const illustratedMessage = BaseAppPersPanel.prototype.generateIllustratedMessage.call(this);
      //overrride the default illustrated message, title, description and add additional content
      illustratedMessage.setIllustrationType(IllustratedMessageType.Tent);
      illustratedMessage.setTitle(this._i18nBundle.getText("noRecommendationsTitle"));
      illustratedMessage.setDescription(this._i18nBundle.getText("noRecommendationsDescription"));
      illustratedMessage.addAdditionalContent(new Button({
        text: this._i18nBundle.getText("settings"),
        tooltip: this._i18nBundle.getText("settings"),
        press: () => this.getParent()?._getLayout()?.openSettingsDialog(SETTINGS_PANELS_KEYS.ADVANCED),
        type: "Emphasized"
      }));
      return illustratedMessage;
    }
  });
  return RecommendedAppPanel;
});
//# sourceMappingURL=RecommendedAppPanel-dbg-dbg.js.map
