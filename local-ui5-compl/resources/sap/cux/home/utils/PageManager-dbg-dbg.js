/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/ui/base/Object", "sap/ui/core/EventBus", "sap/ushell/Config", "sap/ushell/Container", "./ColorUtils", "./Constants", "./PagesIconsConstants", "./UshellPersonalizer"], function (BaseObject, EventBus, Config, Container, __ColorUtils, ___Constants, ___PagesIconsConstants, __UShellPersonalizer) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const ColorUtils = _interopRequireDefault(__ColorUtils);
  const DEFAULT_BG_COLOR = ___Constants["DEFAULT_BG_COLOR"];
  const FALLBACK_ICON = ___Constants["FALLBACK_ICON"];
  const fnFetchLegendColor = ___Constants["fnFetchLegendColor"];
  const MYHOME_SPACE_ID = ___Constants["MYHOME_SPACE_ID"];
  const PAGE_SELECTION_LIMIT = ___Constants["PAGE_SELECTION_LIMIT"];
  const PAGES = ___PagesIconsConstants["PAGES"];
  const SPACES = ___PagesIconsConstants["SPACES"];
  const UShellPersonalizer = _interopRequireDefault(__UShellPersonalizer);
  /**
   *
   * Provides the PageManager Class used for fetch and process user pages.
   *
   * @extends sap.ui.BaseObject
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.121.0
   *
   * @private
   * @experimental Since 1.121
   * @hidden
   *
   * @alias sap.cux.home.utils.PageManager
   */
  const PageManager = BaseObject.extend("sap.cux.home.utils.PageManager", {
    constructor: function _constructor(persContainerId, oOwnerComponent) {
      BaseObject.prototype.constructor.call(this);
      this.colorUtils = ColorUtils;
      this.persContainerId = persContainerId;
      this.oOwnerComponent = oOwnerComponent;
      this._eventBus = EventBus.getInstance();
    },
    _getPersonalization: function _getPersonalization() {
      return UShellPersonalizer.getInstance(this.persContainerId, this.oOwnerComponent);
    },
    fetchAllAvailableSpaces: function _fetchAllAvailableSpaces() {
      try {
        const _this = this;
        if (_this._aSpaces) {
          return Promise.resolve(_this._aSpaces);
        }
        return Promise.resolve(Container.getServiceAsync("BookmarkV2")).then(function (oBookmarkService) {
          return Promise.resolve(oBookmarkService.getContentNodes()).then(function (_oBookmarkService$get) {
            const aSpaces = _oBookmarkService$get;
            // Filter MyHome Space from Spaces
            _this._aSpaces = aSpaces.filter(oSpace => oSpace.id !== MYHOME_SPACE_ID);

            // Add Initial Default Color for Spaces
            _this._aSpaces.forEach(function (oSpace) {
              oSpace.BGColor = DEFAULT_BG_COLOR();
              oSpace.applyColorToAllPages = false;
            });
            return _this._aSpaces;
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    fetchAllAvailablePages: function _fetchAllAvailablePages() {
      let bFetchDistinctPages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      try {
        const _this2 = this;
        if (_this2._aPages) {
          return Promise.resolve(_this2._aPages);
        }
        return Promise.resolve(_this2.fetchAllAvailableSpaces()).then(function (aSpaces) {
          _this2._aPages = [];
          aSpaces.forEach(oSpace => {
            if (Array.isArray(oSpace.children)) {
              oSpace.children.forEach(oPage => {
                if (!bFetchDistinctPages || bFetchDistinctPages && !_this2._aPages.find(oExistingPage => oExistingPage.id === oPage.id)) {
                  _this2._aPages.push({
                    title: oPage.label,
                    icon: FALLBACK_ICON,
                    isIconLoaded: false,
                    pageId: oPage.id,
                    spaceId: oSpace.id,
                    spaceTitle: oSpace.label,
                    url: "#Launchpad-openFLPPage?pageId=" + oPage.id + "&spaceId=" + oSpace.id
                  });
                }
              });
            }
          });
          return _this2._aPages;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    _getDefaultPages: function _getDefaultPages(aAvailablePages) {
      const aFavoritePages = aAvailablePages.slice(0, PAGE_SELECTION_LIMIT) || [];
      return this.getFavPages(aFavoritePages);
    },
    // Get icons from icon constants file
    _getIconForPage: function _getIconForPage(oFavPage) {
      // Check for icon in page icon constants file
      let oIcon = PAGES.find(oPage => oFavPage.pageId?.includes(oPage.id));
      if (!oIcon) {
        // Check for icon in space icon constants file
        oIcon = SPACES.find(oSpace => oFavPage.spaceId?.includes(oSpace.id));
      }
      oFavPage.icon = oIcon?.icon || FALLBACK_ICON;
      oFavPage.isIconLoaded = true;
    },
    _applyIconsForFavPages: function _applyIconsForFavPages(aFavPages) {
      const aPageWithoutIcon = aFavPages.filter(oPage => !oPage.isIconLoaded);
      aPageWithoutIcon.forEach(oPage => {
        this._getIconForPage(oPage);
      });
    },
    getFavPages: function _getFavPages(aFavPages) {
      let bUpdatePersonalisation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      try {
        const _this3 = this;
        function _temp4() {
          // Fetch and apply Icons for Favorite Pages
          if (aFavPages.length) {
            _this3._applyIconsForFavPages(aFavPages);
          }
          return aFavPages;
        }
        aFavPages.forEach(oPage => {
          oPage.selected = true;
          if (!oPage.BGColor) {
            oPage.BGColor = _this3.colorUtils.getFreeColor();
          } else {
            _this3.colorUtils.addColor(oPage.BGColor);
          }
        });

        // Update the Personalisation model
        const _temp3 = function () {
          if (bUpdatePersonalisation) {
            function _temp2() {
              return Promise.resolve(_this3.oPersonalizer.read()).then(function (oPersData) {
                if (!oPersData) oPersData = {
                  favouritePages: []
                };
                oPersData.favouritePages = aFavPages;
                return Promise.resolve(_this3.oPersonalizer.write(oPersData)).then(function () {
                  _this3._eventBus.publish("pageChannel", "pageUpdated");
                });
              });
            }
            const _temp = function () {
              if (!_this3.oPersonalizer) {
                return Promise.resolve(_this3._getPersonalization()).then(function (_this3$_getPersonaliz) {
                  _this3.oPersonalizer = _this3$_getPersonaliz;
                });
              }
            }();
            return _temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp);
          }
        }();
        return Promise.resolve(_temp3 && _temp3.then ? _temp3.then(_temp4) : _temp4(_temp3));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    getFavoritePages: function _getFavoritePages() {
      let bForceUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const bSpaceEnabled = encodeURIComponent(Config.last("/core/spaces/enabled"));
      if (!bSpaceEnabled) {
        return Promise.resolve([]);
      }
      if (this.aFavPages && !bForceUpdate) {
        return Promise.resolve(this.aFavPages);
      }
      if (this.oGetFavPagesPromise === undefined) {
        this.oGetFavPagesPromise = this._getFavPages(bForceUpdate);
      }
      return this.oGetFavPagesPromise;
    },
    _getFavPages: function _getFavPages2(bForceUpdate) {
      try {
        const _this4 = this;
        return Promise.resolve(_this4._getPersonalization()).then(function (_this4$_getPersonaliz) {
          _this4.oPersonalizer = _this4$_getPersonaliz;
          return Promise.resolve(_this4.oPersonalizer.read()).then(function (oPersData) {
            const aFavoritePages = oPersData?.favouritePages || [];
            return Promise.resolve(_this4.fetchAllAvailablePages(true)).then(function (aAvailablePages) {
              function _temp8() {
                return _this4.aFavPages;
              }
              const _temp7 = function () {
                if (!aFavoritePages.length) {
                  return Promise.resolve(_this4._getDefaultPages(aAvailablePages)).then(function (_this4$_getDefaultPag) {
                    _this4.aFavPages = _this4$_getDefaultPag;
                  });
                } else {
                  let aPages = [],
                    oExistingPage;
                  aFavoritePages.forEach(oPage => {
                    oExistingPage = aAvailablePages.find(function (oAvailablePage) {
                      return oAvailablePage.pageId === oPage.pageId;
                    });
                    if (oExistingPage) {
                      oExistingPage.BGColor = oPage.BGColor;
                      aPages.push(oExistingPage);
                    }
                  });
                  // To send Maximum of 8 Pages (BCP incident: 2270169293)
                  aPages = aPages.slice(0, PAGE_SELECTION_LIMIT);
                  const _temp6 = function () {
                    if (aPages.length || !aFavoritePages.length) {
                      return Promise.resolve(_this4.getFavPages(aPages, aPages.length !== aFavoritePages.length || bForceUpdate)).then(function (_this4$getFavPages) {
                        _this4.aFavPages = _this4$getFavPages;
                      });
                    } else {
                      const _temp5 = function () {
                        if (!aPages.length && aFavoritePages.length) {
                          //Clean unaccessible page data
                          oPersData.favouritePages = [];
                          return Promise.resolve(_this4.oPersonalizer.write(oPersData)).then(function () {
                            return Promise.resolve(_this4._getDefaultPages(aAvailablePages)).then(function (_this4$_getDefaultPag2) {
                              _this4.aFavPages = _this4$_getDefaultPag2;
                            });
                          });
                        }
                      }();
                      if (_temp5 && _temp5.then) return _temp5.then(function () {});
                    }
                  }();
                  if (_temp6 && _temp6.then) return _temp6.then(function () {});
                }
              }();
              // Set first 8 available pages are favorite if no favorite page data is present
              return _temp7 && _temp7.then ? _temp7.then(_temp8) : _temp8(_temp7);
            });
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    applyColorPersonalizations: function _applyColorPersonalizations(personalizations) {
      try {
        const _this5 = this;
        function _temp10() {
          return Promise.resolve(_this5.fetchAllAvailableSpaces()).then(function (allSpaces) {
            personalizations.forEach(personalization => {
              const isPagePersonalization = !!personalization.pageId;
              const spaceObj = allSpaces?.find(space => space.id === personalization.spaceId);
              const pageObj = spaceObj?.children.find(page => page.id === personalization.pageId);
              const oPage = _this5.aFavPages.find(oPage => oPage.pageId === personalization.pageId);
              // Update the Personalisation model for space
              if (!isPagePersonalization && spaceObj) {
                const colorObj = fnFetchLegendColor(personalization.BGColor);
                spaceObj.BGColor = colorObj;
                spaceObj.applyColorToAllPages = personalization.applyColorToAllPages;
                spaceObj.isSpacePersonalization = true;

                // Update the color for all pages in the space if applied
                spaceObj.children.forEach(oPage => {
                  const favPageObj = _this5.aFavPages.find(favPage => favPage.pageId === oPage.id);
                  if (favPageObj) {
                    const favpageBGColor = favPageObj.isPagePersonalization ? favPageObj.oldColor : DEFAULT_BG_COLOR();
                    favPageObj.BGColor = spaceObj.applyColorToAllPages ? personalization.BGColor : favpageBGColor;
                    oPage.BGColor = favPageObj.BGColor;
                  }
                });
              } else if (pageObj && oPage) {
                // Update the Personalisation model for page
                const pageBackgroundColor = spaceObj?.applyColorToAllPages ? {
                  ...spaceObj.BGColor
                } : fnFetchLegendColor(personalization.BGColor);
                oPage.isPagePersonalization = true;
                pageObj.isPagePersonalization = true;
                oPage.BGColor = pageBackgroundColor;
                pageObj.BGColor = pageBackgroundColor;
                oPage.oldColor = fnFetchLegendColor(personalization.BGColor);
                pageObj.oldColor = fnFetchLegendColor(personalization.BGColor);
              }
            });
            _this5._eventBus.publish("pageChannel", "pageUpdated");
          });
        }
        if (!personalizations?.length) {
          return Promise.resolve();
        }
        const _temp9 = function () {
          if (!_this5.aFavPages) {
            return Promise.resolve(_this5.getFavoritePages()).then(function () {});
          }
        }();
        return Promise.resolve(_temp9 && _temp9.then ? _temp9.then(_temp10) : _temp10(_temp9));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    applyIconPersonalizations: function _applyIconPersonalizations(personalizations) {
      try {
        const _this6 = this;
        function _temp12() {
          return Promise.resolve(_this6.fetchAllAvailableSpaces()).then(function (allSpaces) {
            personalizations.forEach(personalization => {
              const isPagePersonalization = !!personalization.pageId;
              const spaceObj = allSpaces?.find(space => space.id === personalization.spaceId);

              // Update the Personalisation model for space
              if (!isPagePersonalization) {
                if (spaceObj) {
                  spaceObj.icon = personalization.icon;
                  spaceObj.isSpaceIconPersonalization = true;

                  // Update the icon for all pages in the space if applied
                  spaceObj.children.forEach(oPage => {
                    if (!oPage.isPageIconPersonalization) {
                      const favPageObj = _this6.aFavPages.find(favPage => favPage.pageId === oPage.id);
                      if (favPageObj) {
                        favPageObj.icon = spaceObj.icon || FALLBACK_ICON;
                        oPage.icon = spaceObj.icon || FALLBACK_ICON;
                      }
                    }
                  });
                }
              } else {
                // Update the Personalisation model for page
                const pageObj = spaceObj?.children.find(page => page.id === personalization.pageId);
                const oPage = _this6.aFavPages.find(oPage => oPage.pageId === personalization.pageId);
                if (pageObj && oPage) {
                  oPage.isPageIconPersonalization = true;
                  pageObj.isPageIconPersonalization = true;
                  oPage.icon = personalization.icon;
                  pageObj.icon = personalization.icon;
                  oPage.oldIcon = personalization.oldIcon;
                  pageObj.oldIcon = personalization.oldIcon;
                }
              }
            });
            _this6._eventBus.publish("pageChannel", "pageUpdated");
          });
        }
        if (!personalizations?.length) {
          return Promise.resolve();
        }
        const _temp11 = function () {
          if (!_this6.aFavPages) {
            return Promise.resolve(_this6._getFavPages(false)).then(function () {});
          }
        }();
        return Promise.resolve(_temp11 && _temp11.then ? _temp11.then(_temp12) : _temp12(_temp11));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  });
  PageManager.oCacheInstances = {};
  PageManager.getInstance = function getInstance(persContainerId, oOwnerComponent) {
    if (PageManager.oCacheInstances[persContainerId]) {
      return PageManager.oCacheInstances[persContainerId];
    }
    const pageManagerInstance = new PageManager(persContainerId, oOwnerComponent);
    PageManager.oCacheInstances[persContainerId] = pageManagerInstance;
    return pageManagerInstance;
  };
  return PageManager;
});
//# sourceMappingURL=PageManager-dbg-dbg.js.map
