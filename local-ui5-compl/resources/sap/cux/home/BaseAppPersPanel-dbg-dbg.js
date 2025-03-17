/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/base/Log", "sap/ui/core/EventBus", "sap/ushell/Container", "./BaseAppPanel", "./utils/Constants", "./utils/DataFormatUtils", "./utils/PageManager", "./utils/PersonalisationUtils", "./utils/UshellPersonalizer"], function (Log, EventBus, Container, __BaseAppPanel, ___utils_Constants, __DataFormatUtils, __PageManager, __PersonalisationUtils, __UshellPersonalizer) {
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
  const BaseAppPanel = _interopRequireDefault(__BaseAppPanel);
  const DEFAULT_APP_ICON = ___utils_Constants["DEFAULT_APP_ICON"];
  const DEFAULT_BG_COLOR = ___utils_Constants["DEFAULT_BG_COLOR"];
  const FALLBACK_ICON = ___utils_Constants["FALLBACK_ICON"];
  const MYHOME_PAGE_ID = ___utils_Constants["MYHOME_PAGE_ID"];
  const DataFormatUtils = _interopRequireDefault(__DataFormatUtils);
  const PageManager = _interopRequireDefault(__PageManager);
  const PersonalisationUtils = _interopRequireDefault(__PersonalisationUtils);
  const UshellPersonalizer = _interopRequireDefault(__UshellPersonalizer);
  /**
   *
   * Provides the BaseAppPersPanel Class which is BaseAppPanel with personalisation.
   *
   * @extends sap.cux.home.BaseAppPanel
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
   * @alias sap.cux.home.BaseAppPersPanel
   */
  const BaseAppPersPanel = BaseAppPanel.extend("sap.cux.home.BaseAppPersPanel", {
    metadata: {
      library: "sap.cux.home",
      properties: {
        persContainerId: {
          type: "string",
          group: "Misc",
          defaultValue: "",
          visibility: "hidden"
        }
      }
    },
    constructor: function _constructor(id, settings) {
      BaseAppPanel.prototype.constructor.call(this, id, settings);
      this._favPageVisualizations = [];
    },
    init: function _init() {
      BaseAppPanel.prototype.init.call(this);
      this.setProperty("persContainerId", PersonalisationUtils.getPersContainerId(this));
      this._pageManagerInstance = PageManager.getInstance(PersonalisationUtils.getPersContainerId(this), PersonalisationUtils.getOwnerComponent(this));
      this._eventBus = EventBus.getInstance();

      //apply personalization on page update
      this._eventBus.subscribe("pageChannel", "pageUpdated", () => {
        void this.applyPersonalization();
      }, this);
    },
    /**
     * Retrieves the personalizer instance.
     * @returns {Promise<sap.cux.home.UshellPersonalizer>} A promise resolving to the personalizer instance.
     * @throws {Error} Throws an error if no container ID is provided for personalization.
     * @private
     */
    _getPersonalizer: function _getPersonalizer() {
      try {
        const _this = this;
        const persContainerId = _this.getProperty("persContainerId");
        if (!persContainerId) {
          throw new Error("No Container ID Provided for personalisation!");
        }
        return Promise.resolve(UshellPersonalizer?.getInstance(persContainerId, PersonalisationUtils.getOwnerComponent(_this)));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Retrieves personalization data.
     * @returns {Promise<IPersonalizationData>} A promise that resolves with the personalization data.
     * @private
     */
    getPersonalization: function _getPersonalization() {
      try {
        const _this2 = this;
        return Promise.resolve(_this2._getPersonalizer()).then(function (personalizer) {
          return Promise.resolve(personalizer?.read());
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Sets the personalization data.
     * @param {IPersonalizationData} persData - The personalization data to set.
     * @returns {Promise<void>} A promise that resolves when the personalization data is set.
     * @private
     */
    setPersonalization: function _setPersonalization(persData) {
      try {
        const _this3 = this;
        return Promise.resolve(_this3._getPersonalizer()).then(function (personalizer) {
          return Promise.resolve(personalizer.write(persData)).then(function () {});
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Returns array of personalized favorite apps
     *
     * @returns {Promise} resolves to return array of personalized favorite apps
     */
    _getAppPersonalization: function _getAppPersonalization() {
      try {
        const _this4 = this;
        return Promise.resolve(_this4.getPersonalization()).then(function (personalization) {
          return personalization?.favoriteApps || [];
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Sets the personalization data.
     * @param {IAppPersonalization[]} appsPersonalization - Personalization data for favorite apps.
     * @returns {Promise<void>} A promise that resolves when the personalization data is set.
     * @private
     */
    setFavAppsPersonalization: function _setFavAppsPersonalization(appsPersonalization) {
      try {
        const _this5 = this;
        return Promise.resolve(_this5.getPersonalization()).then(function (personalization) {
          const _temp = function () {
            if (personalization) {
              personalization.favoriteApps = appsPersonalization;
              return Promise.resolve(_this5.setPersonalization(personalization)).then(function () {});
            }
          }();
          if (_temp && _temp.then) return _temp.then(function () {});
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Applies personalization settings to the tiles.
     * Retrieves tiles from the generated apps wrapper and applies personalization settings to each tile.
     * Personalization settings include background color and icon customization.
     * @private
     * @async
     */
    applyPersonalization: function _applyPersonalization() {
      try {
        const _this6 = this;
        let tiles = _this6.fetchTileVisualization();
        return Promise.resolve(_this6._applyTilesPersonalization(tiles));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Applies personalization settings to the provided tiles.
     * @param {Array} tiles - An array of tiles to apply personalization settings to.
     * @param {string} [groupId] - Optional group ID for filtering personalization settings.
     * @param {boolean} [shouldReload=true] - A flag indicating whether to reload page visualizations.
     * @returns {Promise<void>} A promise that resolves when personalization settings are applied to the tiles.
     * @private
     */
    _applyTilesPersonalization: function _applyTilesPersonalization(tiles, groupId) {
      let shouldReload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      try {
        const _this7 = this;
        return Promise.resolve(Promise.all([_this7._getAppPersonalization(), _this7._getFavPages()])).then(function (_ref) {
          let [personalizations, favPages] = _ref;
          return Promise.resolve(_this7._getAllFavPageApps(favPages, shouldReload)).then(function (favPageVisualizations) {
            const groups = _this7.getAggregation("groups") || [];
            const apps = groupId ? _this7._getGroup(groupId)?.getApps() || [] : _this7.getApps() || [];
            for (const tile of tiles) {
              const item = _this7._getItem(tile, groups, apps);
              const {
                color,
                icon
              } = _this7._getItemPersonalization(item, personalizations, favPageVisualizations, groupId);
              if (color) {
                item?.setProperty("bgColor", color, true);
                tile.setBackgroundColor(color);
              }
              if (icon) {
                item?.setProperty("icon", icon, true);
                tile.setTileIcon(icon);
              }
            }
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Retrieves the corresponding App or Group object associated with the given tile.
     * @param {GenericTile} tile - The tile for which to retrieve the corresponding item.
     * @param {Group[]} groups - An array of Group objects.
     * @param {App[]} apps - An array of App objects.
     * @returns {App | Group | undefined} The corresponding App or Group object, or undefined if not found.
     * @private
     */
    _getItem: function _getItem(tile, groups, apps) {
      const tileGroupId = tile.data("groupId");
      if (tileGroupId) {
        return groups.find(oGroup => oGroup.getGroupId() === tileGroupId);
      } else {
        return apps.find(oApp => DataFormatUtils.getLeanURL(oApp.getUrl()) === tile.getUrl());
      }
    },
    /**
     * Retrieves the color and icon associated with the specified item based on personalizations.
     * @param {App | Group | undefined} item - The App or Group object for which to retrieve personalization data.
     * @param {IAppPersonalization[] | undefined} personalizations - An array of personalization objects.
     * @param {ICustomVisualization[]} favPageVisualizations - An array of favorite page visualizations.
     * @param {string | undefined} groupId - The ID of the group to which the item belongs.
     * @returns {IItemPersonalization} An object containing the color and icon associated with the item.
     * @private
     */
    _getItemPersonalization: function _getItemPersonalization(item, personalizations, favPageVisualizations, groupId) {
      let color = "";
      let icon = "";
      if (!item) return {
        color,
        icon
      };
      if (item.isA("sap.cux.home.Group")) {
        const personalization = personalizations?.find(personalization => personalization.isSection && personalization.sectionId === item.getGroupId());
        color = personalization?.BGColor;
      } else {
        const app = item;
        const appIds = [app.getUrl()];
        const oldAppId = app.data("oldAppId");
        if (oldAppId) {
          appIds.push(oldAppId);
        }
        const vizId = app.getVizId();
        const personalization = groupId ? personalizations?.find(personalization => !personalization.isSection && personalization.sectionId === groupId && personalization.appId && appIds.includes(personalization.appId)) : personalizations?.find(oPersonalization => oPersonalization.isRecentlyAddedApp && oPersonalization.appId && appIds.includes(oPersonalization.appId));
        const favPageVisualization = favPageVisualizations.find(oVisualization => oVisualization.vizId === vizId || oVisualization.appId && appIds.includes(oVisualization.appId));
        color = personalization?.BGColor || favPageVisualization?.BGColor || DEFAULT_BG_COLOR().key;
        icon = this?.isA("sap.cux.home.FavAppPanel") ? this._getFavAppIcon(app, favPageVisualization?.icon) : this.getAppIcon();
      }
      return {
        color,
        icon
      };
    },
    /**
     * Retrieves favorite pages.
     * @returns {Promise<Array>} A promise that resolves with an array of favorite pages.
     * @private
     */
    _getFavPages: function _getFavPages() {
      try {
        const _this8 = this;
        return Promise.resolve(_this8._pageManagerInstance.getFavoritePages()).then(function (aFavPages) {
          return aFavPages.concat({
            pageId: MYHOME_PAGE_ID,
            BGColor: DEFAULT_BG_COLOR().key
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Retrieves visualizations for all favorite pages based on the provided parameters.
     * @param {Array} pages - An array of favorite pages.
     * @param {boolean} shouldReload - A flag indicating whether to reload page visualizations.
     * @returns {Promise<Array>} A promise that resolves with an array of favorite page visualizations.
     * @private
     */
    _getAllFavPageApps: function _getAllFavPageApps(pages, shouldReload) {
      try {
        let _exit = false;
        const _this9 = this;
        return Promise.resolve(_catch(function () {
          function _temp3(_result) {
            return _exit ? _result : [];
          }
          const _temp2 = function () {
            if (pages) {
              _this9._favPageVisualizations = _this9._favPageVisualizations || [];
              //Check to ensure that missing visualization data is loaded, if any
              const loadedPages = _this9._favPageVisualizations.reduce((pageIDs, visualization) => {
                if (visualization.pageId && !pageIDs.includes(visualization.pageId)) {
                  pageIDs.push(visualization.pageId);
                }
                return pageIDs;
              }, []);
              const pageIds = pages.map(page => page.pageId);
              const shouldLoadMissingApps = loadedPages.length === 0 || !loadedPages.every(pageId => pageIds.includes(pageId));
              if (!shouldReload && !shouldLoadMissingApps) {
                const _this9$_favPageVisual = _this9._favPageVisualizations;
                _exit = true;
                return _this9$_favPageVisual;
              } else {
                return Promise.resolve(_this9._loadAllPageVisualizations(pages)).then(function (_this9$_loadAllPageVi) {
                  _this9._favPageVisualizations = _this9$_loadAllPageVi;
                  const _this9$_favPageVisual2 = _this9._favPageVisualizations;
                  _exit = true;
                  return _this9$_favPageVisual2;
                });
              }
            }
          }();
          return _temp2 && _temp2.then ? _temp2.then(_temp3) : _temp3(_temp2);
        }, function (error) {
          Log.error(error);
          return [];
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Loads visualizations for all specified pages.
     * @param {Array} pages - An array of pages.
     * @param {boolean} [shouldFetchDistinctApps=false] - A flag indicating whether to fetch distinct pages.
     * @returns {Promise<Array>} A promise that resolves with an array of page visualizations.
     * @private
     */
    _loadAllPageVisualizations: function _loadAllPageVisualizations(pages) {
      let shouldFetchDistinctApps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      try {
        const getBgColor = pageId => {
          return pages.find(page => page.pageId === pageId)?.BGColor ?? DEFAULT_BG_COLOR().key;
        };
        return Promise.resolve(_catch(function () {
          const favPageVisualizations = [];
          return Promise.resolve(Container.getServiceAsync("SpaceContent")).then(function (spaceContentService) {
            return Promise.resolve(spaceContentService.getPages(pages.map(oPage => oPage.pageId))).then(function (pageData) {
              const aPages = Object.values(pageData);
              for (const page of aPages) {
                const sections = page.sections || [];
                for (const section of sections) {
                  const visualizations = section.visualizations || [];
                  for (const visualization of visualizations) {
                    const app = {
                      appId: visualization.targetURL,
                      vizId: visualization.vizId,
                      icon: visualization.icon,
                      BGColor: getBgColor(page.id),
                      pageId: page.id
                    };
                    if (!shouldFetchDistinctApps || !favPageVisualizations.some(oVizApp => oVizApp.appId === app.appId)) {
                      favPageVisualizations.push(app);
                    }
                  }
                }
              }
              return favPageVisualizations;
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
     * Returns default app icon.
     * @returns {string} The icon URL for the app.
     * @private
     */
    getAppIcon: function _getAppIcon() {
      return DEFAULT_APP_ICON;
    },
    /**
     * Retrieves the icon for the specified app, prioritizing the favorite page icon if available.
     * @param {sap.cux.home.App} app - The app object.
     * @param {string} favPageIcon - The icon for the app from the favorite page.
     * @returns {string} The icon URL for the app.
     * @private
     */
    _getFavAppIcon: function _getFavAppIcon(app, favPageIcon) {
      return favPageIcon || app?.getIcon() || FALLBACK_ICON;
    }
  });
  return BaseAppPersPanel;
});
//# sourceMappingURL=BaseAppPersPanel-dbg-dbg.js.map
