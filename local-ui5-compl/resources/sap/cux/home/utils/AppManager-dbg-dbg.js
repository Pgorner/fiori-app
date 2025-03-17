/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/base/Log", "sap/base/i18n/Formatting", "sap/base/i18n/ResourceBundle", "sap/ui/VersionInfo", "sap/ui/base/Object", "sap/ui/model/odata/v2/ODataModel", "sap/ushell/Config", "sap/ushell/Container", "./CardSkeleton", "./Constants", "./DataFormatUtils", "./HttpHelper"], function (Log, Formatting, ResourceBundle, VersionInfo, BaseObject, ODataModelV2, Config, Container, ___CardSkeleton, ___Constants, __DataFormatUtils, __HttpHelper) {
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
  const CardSkeleton = ___CardSkeleton["CardSkeleton"];
  const _iteratorSymbol = /*#__PURE__*/typeof Symbol !== "undefined" ? Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator")) : "@@iterator";
  function _settle(pact, state, value) {
    if (!pact.s) {
      if (value instanceof _Pact) {
        if (value.s) {
          if (state & 1) {
            state = value.s;
          }
          value = value.v;
        } else {
          value.o = _settle.bind(null, pact, state);
          return;
        }
      }
      if (value && value.then) {
        value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
        return;
      }
      pact.s = state;
      pact.v = value;
      const observer = pact.o;
      if (observer) {
        observer(pact);
      }
    }
  }
  const _Pact = /*#__PURE__*/function () {
    function _Pact() {}
    _Pact.prototype.then = function (onFulfilled, onRejected) {
      const result = new _Pact();
      const state = this.s;
      if (state) {
        const callback = state & 1 ? onFulfilled : onRejected;
        if (callback) {
          try {
            _settle(result, 1, callback(this.v));
          } catch (e) {
            _settle(result, 2, e);
          }
          return result;
        } else {
          return this;
        }
      }
      this.o = function (_this) {
        try {
          const value = _this.v;
          if (_this.s & 1) {
            _settle(result, 1, onFulfilled ? onFulfilled(value) : value);
          } else if (onRejected) {
            _settle(result, 1, onRejected(value));
          } else {
            _settle(result, 2, value);
          }
        } catch (e) {
          _settle(result, 2, e);
        }
      };
      return result;
    };
    return _Pact;
  }();
  function _isSettledPact(thenable) {
    return thenable instanceof _Pact && thenable.s & 1;
  }
  function _forTo(array, body, check) {
    var i = -1,
      pact,
      reject;
    function _cycle(result) {
      try {
        while (++i < array.length && (!check || !check())) {
          result = body(i);
          if (result && result.then) {
            if (_isSettledPact(result)) {
              result = result.v;
            } else {
              result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
              return;
            }
          }
        }
        if (pact) {
          _settle(pact, 1, result);
        } else {
          pact = result;
        }
      } catch (e) {
        _settle(pact || (pact = new _Pact()), 2, e);
      }
    }
    _cycle();
    return pact;
  }
  const DEFAULT_BG_COLOR = ___Constants["DEFAULT_BG_COLOR"];
  function _forOf(target, body, check) {
    if (typeof target[_iteratorSymbol] === "function") {
      var iterator = target[_iteratorSymbol](),
        step,
        pact,
        reject;
      function _cycle(result) {
        try {
          while (!(step = iterator.next()).done && (!check || !check())) {
            result = body(step.value);
            if (result && result.then) {
              if (_isSettledPact(result)) {
                result = result.v;
              } else {
                result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
                return;
              }
            }
          }
          if (pact) {
            _settle(pact, 1, result);
          } else {
            pact = result;
          }
        } catch (e) {
          _settle(pact || (pact = new _Pact()), 2, e);
        }
      }
      _cycle();
      if (iterator.return) {
        var _fixup = function (value) {
          try {
            if (!step.done) {
              iterator.return();
            }
          } catch (e) {}
          return value;
        };
        if (pact && pact.then) {
          return pact.then(_fixup, function (e) {
            throw _fixup(e);
          });
        }
        _fixup();
      }
      return pact;
    }
    // No support for Symbol.iterator
    if (!("length" in target)) {
      throw new TypeError("Object is not iterable");
    }
    // Handle live collections properly
    var values = [];
    for (var i = 0; i < target.length; i++) {
      values.push(target[i]);
    }
    return _forTo(values, function (i) {
      return body(values[i]);
    }, check);
  }
  const FALLBACK_ICON = ___Constants["FALLBACK_ICON"];
  const FEATURE_TOGGLES = ___Constants["FEATURE_TOGGLES"];
  const FEATURE_TOGGLE_SRVC_URL = ___Constants["FEATURE_TOGGLE_SRVC_URL"];
  const MYHOME_PAGE_ID = ___Constants["MYHOME_PAGE_ID"];
  const MYHOME_SPACE_ID = ___Constants["MYHOME_SPACE_ID"];
  const MYINSIGHT_SECTION_ID = ___Constants["MYINSIGHT_SECTION_ID"];
  const RECOMMENDATION_SRVC_URL = ___Constants["RECOMMENDATION_SRVC_URL"];
  const RECOMMENDED_CARD_LIMIT = ___Constants["RECOMMENDED_CARD_LIMIT"];
  const DataFormatUtils = _interopRequireDefault(__DataFormatUtils);
  const HttpHelper = _interopRequireDefault(__HttpHelper);
  const CONSTANTS = {
    MUST_INCLUDE_RECOMMEDED_APPS: ["F0862", "F1823"] //My Inbox and Manage Timesheet apps
  };
  const _parseSBParameters = oParam => {
    let oParsedParams = {};
    if (oParam) {
      if (typeof oParam === "object") {
        oParsedParams = oParam;
      } else {
        try {
          oParsedParams = JSON.parse(oParam);
        } catch (oError) {
          Log.error(oError instanceof Error ? oError.message : String(oError));
          oParsedParams = undefined;
        }
      }
    }
    return oParsedParams;
  };
  const _getTileProperties = vizConfigFLP => {
    let oTileProperties = {};
    if (vizConfigFLP?._instantiationData?.chip?.configuration) {
      const oConfig = _parseSBParameters(vizConfigFLP._instantiationData.chip.configuration);
      if (oConfig?.tileConfiguration) {
        const oTileConfig = _parseSBParameters(oConfig.tileConfiguration);
        if (oTileConfig) {
          oTileProperties = _parseSBParameters(oTileConfig.TILE_PROPERTIES);
        }
      }
    }
    return oTileProperties;
  };
  const _getAppId = vizConfigFLP => {
    let sAppId = "";
    let oTileProperties = {};
    if (vizConfigFLP?.target?.semanticObject && vizConfigFLP?.target?.action) {
      sAppId = `#${vizConfigFLP.target.semanticObject}-${vizConfigFLP.target.action}`;
    } else if (vizConfigFLP?._instantiationData?.chip?.configuration) {
      oTileProperties = _getTileProperties(vizConfigFLP);
      if (oTileProperties?.semanticObject && oTileProperties?.semanticAction) {
        sAppId = `#${oTileProperties?.semanticObject}-${oTileProperties?.semanticAction}`;
      }
    }
    return sAppId;
  };
  const _getTargetUrl = vizConfigFLP => {
    let sTargetURL = _getAppId(vizConfigFLP) || "";
    const oTileProperties = _getTileProperties(vizConfigFLP);
    if (oTileProperties?.evaluationId) {
      sTargetURL += "?EvaluationId=" + oTileProperties.evaluationId;
    }
    return sTargetURL;
  };
  const _isSmartBusinessTile = oVisualization => {
    return oVisualization.vizType?.startsWith("X-SAP-UI2-CHIP:SSB");
  };

  // get App Title in case of value not present at root level
  const _getAppTitleSubTitle = (oApp, vizConfigFLP) => {
    const oAppTileInfo = vizConfigFLP?._instantiationData?.chip?.bags?.sb_tileProperties?.texts;
    return {
      title: oApp.title ? oApp.title : oAppTileInfo?.title || "",
      subtitle: oApp.subtitle ? oApp.subtitle : oAppTileInfo?.description || ""
    };
  };

  /**
   * Link Duplicate Visualizations to a single visualization
   *
   * @param {object[]} aVizs - array of visualizations
   * @returns {object[]} arry of visualizations after linking duplicate visualizations
   * @private
   */
  const _linkDuplicateVizs = aVizs => {
    aVizs.forEach(oDuplicateViz => {
      aVizs.filter(oViz => oViz.appId === oDuplicateViz.appId && oViz?.visualization?.id !== oDuplicateViz?.visualization?.id && oViz.persConfig?.sectionIndex === oDuplicateViz.persConfig?.sectionIndex).forEach(oViz => {
        oViz?.persConfig?.duplicateApps?.push(oDuplicateViz);
      });
    });
    return aVizs;
  };
  const _isGUIVisualization = visualization => {
    return visualization?.target?.parameters?.["sap-ui-tech-hint"]?.value?.value === "GUI";
  };
  const _isMustIncludeRecommendation = recViz => {
    return recViz.fioriId && CONSTANTS.MUST_INCLUDE_RECOMMEDED_APPS.includes(recViz.fioriId);
  };
  const _isVisualizationAlreadyAdded = (visualization, favoriteVisualizations) => {
    return !favoriteVisualizations.some(favViz => favViz.visualization?.target?.semanticObject === visualization.visualization?.target?.semanticObject && favViz.visualization?.target?.action === visualization.visualization?.target?.action);
  };

  /**
   *
   * @class Provides the AppManager Class used for fetch and process user apps.
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
   * @alias sap.cux.home.util.AppManager
   */
  class AppManager extends BaseObject {
    aRequestQueue = [];
    bInsightsSectionPresent = false;
    vizDataModified = false;
    constructor() {
      super();
    }
    static getInstance() {
      if (!AppManager.Instance) {
        AppManager.Instance = new AppManager();
      }
      return AppManager.Instance;
    }
    /**
     * Returns page load promise from the request queue if it exists, adds it to the queue if it doesn't
     *
     * @param {string} sPageId - page id
     * @param {boolean} bForceRefresh - force reload of data if true
     * @returns {Promise} - returns a promise which resolves with the requested page data
     * @private
     */
    _fetchRequestFromQueue(bForceRefresh) {
      try {
        const _this = this;
        return Promise.resolve(Container.getServiceAsync("SpaceContent")).then(function (oSpaceContentService) {
          let oPageLoadPromise;
          _this.aRequestQueue = _this.aRequestQueue || [];

          //Check if request already exists in the queue, if not add it
          const oRequestedPage = _this.aRequestQueue.find(oRequest => oRequest.pageId === MYHOME_PAGE_ID);
          if (!oRequestedPage || bForceRefresh === true || _this.vizDataModified === true) {
            _this.vizDataModified = false;
            oPageLoadPromise = oSpaceContentService.getPage(MYHOME_PAGE_ID);
            if (oRequestedPage) {
              oRequestedPage.pageLoadPromise = oPageLoadPromise;
            } else {
              _this.aRequestQueue.push({
                pageId: MYHOME_PAGE_ID,
                pageLoadPromise: oPageLoadPromise
              });
            }
          } else {
            oPageLoadPromise = oRequestedPage.pageLoadPromise;
          }
          return oPageLoadPromise;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Returns all dynamic visualizations present in MyHome page
     *
     * @param {boolean} bForceRefresh - force reload of visualizations data
     * @returns {Promise} - resolves to array of all dynamic visualizations in MyHome page
     * @private
     */
    _fetchDynamicVizs(bForceRefresh) {
      return this.fetchFavVizs(bForceRefresh, true).then(aFavApps => aFavApps.filter(oDynApp => oDynApp.isCount || oDynApp.isSmartBusinessTile));
    }
    /**
     * Returns all the sections that are available in the MyHome page
     *
     * @param {boolean} bForceRefresh - force reload of visualizations data
     * @returns {Promise} - resolves to array of all sections available in MyHome page
     * @private
     */
    _getSections() {
      let bForceRefresh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      try {
        const _this2 = this;
        return Promise.resolve(_this2._fetchRequestFromQueue(bForceRefresh)).then(function (oPage) {
          const aSections = oPage && oPage.sections || [],
            iRecentAppSectionIndex = aSections.findIndex(oSection => oSection.default);
          if (iRecentAppSectionIndex > 0) {
            function _temp2() {
              return _this2._getSections(true);
            }
            const _temp = function () {
              if (_this2._oMoveAppsPromise !== undefined) {
                _this2._oMoveAppsPromise = _this2.moveSection(iRecentAppSectionIndex, 0);
                return Promise.resolve(_this2._oMoveAppsPromise).then(function () {});
              }
            }();
            return _temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp);
          } else {
            return aSections;
          }
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Models and returns all visualizations available in MyHome page
     *
     * @param {bool} bForceRefresh - force reload of visualizations data
     * @returns {Promise} - resolves to array of all apps available in MyHome page
     * @private
     */
    _fetchMyHomeVizs(bForceRefresh) {
      try {
        const _this3 = this;
        const aVizs = [];
        return Promise.resolve(_this3._getSections(bForceRefresh)).then(function (aSections) {
          aSections.forEach((oSection, iSectionIndex) => {
            oSection?.visualizations?.forEach((oVisualization, iVisualizationIndex) => {
              const vizConfig = oVisualization.vizConfig,
                oVizInfo = vizConfig?.["sap.app"] || {
                  title: "?"
                },
                oViz = {};
              oViz.oldAppId = _getAppId(vizConfig?.["sap.flp"]);
              oViz.appId = oVisualization?.targetURL; // Using targetURL as unique identifier as in certian scenario vizConfig can be empty.
              oViz.url = oVisualization?.targetURL;
              if (!oViz.url && _isSmartBusinessTile(oVisualization)) {
                oViz.url = _getTargetUrl(vizConfig?.["sap.flp"]);
              }
              oViz.leanURL = DataFormatUtils.getLeanURL(oViz.url);
              oViz.title = oVisualization?.title || _getAppTitleSubTitle(oVizInfo, oVisualization)?.title;
              oViz.subtitle = oVisualization.subtitle || _getAppTitleSubTitle(oVizInfo, oVisualization).subtitle;
              oViz.BGColor = DEFAULT_BG_COLOR().key;
              oViz.isFav = true;
              oViz.isSection = false;
              oViz.icon = vizConfig?.["sap.ui"]?.icons?.icon || FALLBACK_ICON;
              if (oVisualization?.indicatorDataSource) {
                oViz.isCount = true;
                oViz.indicatorDataSource = oVisualization.indicatorDataSource.path;
                oViz.contentProviderId = oVisualization.contentProviderId;
              }
              oViz.isSmartBusinessTile = _isSmartBusinessTile(oVisualization);
              // Add FLP Personalization Config
              oViz.persConfig = {
                pageId: MYHOME_PAGE_ID,
                sectionTitle: oSection.title,
                sectionId: oSection.id,
                sectionIndex: iSectionIndex,
                visualizationIndex: iVisualizationIndex,
                isDefaultSection: oSection.default,
                isPresetSection: oSection.preset,
                duplicateApps: []
              };
              oViz.visualization = oVisualization;
              // Title and Subtitle in visualization are required in Insights Dialog.
              oViz.visualization.title = oViz.title;
              oViz.visualization.subtitle = oViz.subtitle;
              aVizs.push(oViz);
            });
          });
          return aVizs;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Copies all Dynamic visualizations to Insights section
     *
     * @returns {Promise} - resolves to void and copy all the visualizations
     * @private
     */
    _copyDynamicVizs() {
      try {
        const _this4 = this;
        return Promise.resolve(_this4._fetchDynamicVizs(true)).then(function (aDynamicVizs) {
          return Promise.all(aDynamicVizs.map(oDynViz => {
            return _this4.addVisualization(oDynViz.visualization.vizId, MYINSIGHT_SECTION_ID);
          }));
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Returns a list of all favorite vizualizations in MyHome page
     *
     * @param {boolean} bForceRefresh - force reload of vizualizations data
     * @param {boolean} bPreventGrouping - prevent vizualizations grouping
     * @returns {Promise} - resolves to array of favourite vizualizations in MyHome page
     * @private
     */
    fetchFavVizs(bForceRefresh, bPreventGrouping) {
      try {
        const _this5 = this;
        return Promise.resolve(_this5._fetchMyHomeVizs(bForceRefresh)).then(function (aMyHomeVizs) {
          const aVisibleFavVizs = aMyHomeVizs.filter(oViz => oViz.persConfig && oViz.persConfig.sectionId !== MYINSIGHT_SECTION_ID && oViz.url && oViz.title);
          if (bPreventGrouping) {
            return _this5._filterDuplicateVizs(_linkDuplicateVizs(aVisibleFavVizs), false);
          } else {
            return _this5._addGroupInformation(aVisibleFavVizs);
          }
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Returns all vizualizations present in the Insights Section
     *
     * @param {boolean} bForceRefresh - force reload insights vizualizations data
     * @param {string} sSectionTitle - optional, title of insights section to be used while creating insights section
     * @returns {Promise} - resolves to an array with all vizualizations in Insights section
     */
    fetchInsightApps(bForceRefresh, sSectionTitle) {
      try {
        const _this6 = this;
        function _temp5() {
          return Promise.resolve(fnFetchInsightsApps());
        }
        const fnFetchInsightsApps = function () {
          try {
            return Promise.resolve(_this6._fetchMyHomeVizs(bForceRefresh)).then(function (aVizs) {
              return aVizs.filter(oViz => oViz.persConfig?.sectionId === MYINSIGHT_SECTION_ID && oViz.url && oViz.title);
            });
          } catch (e) {
            return Promise.reject(e);
          }
        };
        const _temp4 = function () {
          if (!_this6.bInsightsSectionPresent) {
            return Promise.resolve(_this6._getSections(bForceRefresh)).then(function (aSections) {
              _this6.insightsSectionIndex = aSections.findIndex(function (oSection) {
                return oSection.id === MYINSIGHT_SECTION_ID;
              });
              const _temp3 = function () {
                if (_this6.insightsSectionIndex === -1 && (Config.last("/core/shell/enablePersonalization") || Config.last("/core/catalog/enabled")) && _this6.bInsightsSectionPresent === false) {
                  _this6.bInsightsSectionPresent = true;
                  return Promise.resolve(_this6.addSection({
                    sectionIndex: aSections?.length,
                    sectionProperties: {
                      id: MYINSIGHT_SECTION_ID,
                      title: sSectionTitle
                    }
                  })).then(function () {
                    return Promise.resolve(_this6._copyDynamicVizs()).then(function () {});
                  });
                } else {
                  _this6.bInsightsSectionPresent = true;
                }
              }();
              if (_temp3 && _temp3.then) return _temp3.then(function () {});
            });
          }
        }();
        return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(_temp5) : _temp5(_temp4));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Add visualization to a particular section
     *
     * @param {string} visualizationId - The id of the visualization to add.
     * @param {string} sectionId - The id of the section the visualization should be added to (optional parameter)
     * @returns {Promise} resolves to void after adding app to a section
     * @private
     */
    addVisualization(visualizationId) {
      let sectionId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      try {
        return Promise.resolve(Container.getServiceAsync("SpaceContent")).then(function (spaceContentService) {
          return Promise.resolve(spaceContentService.addVisualization(MYHOME_PAGE_ID, sectionId, visualizationId)).then(function () {});
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * @param {object} mProperties - map of properties
     * @param {string} mProperties.sectionId - section id from which visualizations should be removed
     * @param {object[]} mProperties.appIds - array of url of visualizations that has to be deleted
     * @param {boolean} mProperties.ignoreDuplicateApps - if true doesn't remove the duplicate apps, else removes the duplicate apps as well
     * @private
     * @returns {Promise} resolves after all visualizations are deleted
     */
    removeVisualizations(_ref) {
      let {
        sectionId,
        vizIds
      } = _ref;
      try {
        const _this7 = this;
        return Promise.resolve(Container.getServiceAsync("SpaceContent")).then(function (spaceContentService) {
          return _forOf(vizIds, function (vizId) {
            const _temp7 = _catch(function () {
              return Promise.resolve(_this7._getSections(true)).then(function (sections) {
                const sectionIndex = sections.findIndex(oSection => oSection.id === sectionId);
                const targetSection = sectionIndex > -1 ? sections[sectionIndex] : null;
                const visualizationIndex = targetSection?.visualizations?.findIndex(oVisualization => oVisualization.id === vizId) ?? -1;
                const _temp6 = function () {
                  if (visualizationIndex > -1) {
                    return Promise.resolve(spaceContentService.deleteVisualization(MYHOME_PAGE_ID, sectionIndex, visualizationIndex)).then(function () {});
                  }
                }();
                if (_temp6 && _temp6.then) return _temp6.then(function () {});
              });
            }, function (error) {
              Log.error(error);
            });
            if (_temp7 && _temp7.then) return _temp7.then(function () {});
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * @param {object} mProperties - map of properties
     * @param {string} mProperties.pageId - page id from which visualizations should be updated
     * @param {object[]} mProperties.sourceSectionIndex - section index in which visualization that has to be updated
     * @param {boolean} mProperties.sourceVisualizationIndex - visualization index in the which should be updated
     * @param {boolean} mProperties.oVisualizationData - visualization data which will be updated for the vizualisation
     * @private
     * @returns {Promise} resolves to void
     */
    updateVisualizations(_ref2) {
      let {
        pageId,
        sourceSectionIndex,
        sourceVisualizationIndex,
        oVisualizationData
      } = _ref2;
      try {
        return Promise.resolve(Container.getServiceAsync("SpaceContent")).then(function (spaceContentService) {
          return spaceContentService.updateVisualization(pageId, sourceSectionIndex, sourceVisualizationIndex, oVisualizationData);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Create Insight Section if not already present
     *
     * @param {string} sSectionTitle - optional, section title
     * @returns {Promise} - resolves to insight section created
     */
    createInsightSection(sSectionTitle) {
      try {
        let _exit = false;
        const _this8 = this;
        function _temp9(_result) {
          return _exit ? _result : Promise.resolve();
        }
        const _temp8 = function () {
          if (!_this8.bInsightsSectionPresent) {
            return Promise.resolve(_this8._getSections()).then(function (aSections) {
              const iMyInsightSectionIndex = aSections.findIndex(function (oSection) {
                return oSection.id === MYINSIGHT_SECTION_ID;
              });

              //check if myinsight section exists, if not create one
              if (iMyInsightSectionIndex === -1 && (Config.last("/core/shell/enablePersonalization") || Config.last("/core/catalog/enabled"))) {
                const _this8$addSection = _this8.addSection({
                  sectionIndex: aSections.length,
                  sectionProperties: {
                    id: MYINSIGHT_SECTION_ID,
                    title: sSectionTitle,
                    visible: true
                  }
                });
                _exit = true;
                return _this8$addSection;
              }
            });
          }
        }();
        return Promise.resolve(_temp8 && _temp8.then ? _temp8.then(_temp9) : _temp9(_temp8));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Adds a section
     *
     * @param {object} mProperties - map of properties
     * @param {string} mProperties.sectionIndex - section index
     * @param {object} mProperties.sectionProperties - section properties
     * @returns {Promise} resolves to void and creates the section
     * @private
     */
    addSection(mProperties) {
      try {
        const {
          sectionIndex,
          sectionProperties
        } = mProperties;
        return Promise.resolve(Container.getServiceAsync("SpaceContent")).then(function (oSpaceContentService) {
          return Promise.resolve(oSpaceContentService.addSection(MYHOME_PAGE_ID, sectionIndex, {
            ...sectionProperties,
            visible: true
          })).then(function () {});
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Returns visualizations for a given section
     * @param {string} sectionId - section id
     * @param {boolean} [forceRefresh=false] - force reload of data if true
     * @returns {Promise} resolves to array of visualizations
     * @private
     */
    getSectionVisualizations(sectionId) {
      let forceRefresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      try {
        const _this9 = this;
        return Promise.resolve(_this9.fetchFavVizs(forceRefresh)).then(function (aApps) {
          if (sectionId) {
            return aApps.find(oViz => oViz.isSection && oViz.id === sectionId)?.apps || [];
          } else {
            return aApps.filter(oViz => !oViz.isSection); //return recently added apps
          }
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Adds a bookmark.
     * @private
     * @param {Object} bookmark - The bookmark data object.
     * @returns {Promise<void>} - A Promise that resolves once the bookmark is added.
     */
    addBookMark(bookmark, moveConfig) {
      try {
        const _this10 = this;
        return Promise.resolve(Container.getServiceAsync("BookmarkV2")).then(function (oBookmarkService) {
          return Promise.resolve(oBookmarkService.getContentNodes()).then(function (aContentNodes) {
            const oMyHomeSpace = aContentNodes.find(contentNode => contentNode.id === MYHOME_SPACE_ID);
            const contentNode = oMyHomeSpace?.children?.find(contentNode => contentNode.id === MYHOME_PAGE_ID);
            return Promise.resolve(oBookmarkService.addBookmark(DataFormatUtils.createBookMarkData(bookmark), contentNode)).then(function () {
              return moveConfig ? _this10.moveVisualization(moveConfig) : Promise.resolve();
            });
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Retrieves the visualization with the specified appId within the specified section.
     * @param {string} appId - appId of the visualization for.
     * @param {string} sectionId - The ID of the section containing the visualization.
     * @param {boolean} [forceRefresh=false] - Whether to force a refresh of the section's cache.
     * @returns {Promise<object|null>} A promise that resolves with the visualization object if found, or null if not found.
     * @private
     */
    getVisualization(appId, sectionId) {
      let forceRefresh = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      try {
        const _this11 = this;
        return Promise.resolve(_this11.getSectionVisualizations(sectionId, forceRefresh)).then(function (sectionVisualizations) {
          return sectionVisualizations.find(sectionVisualization => sectionVisualization.appId === appId);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Moves a visualization from source section to target section.
     * @param {object} moveConfig - Configuration object containing details for moving the visualization.
     * @param {number} moveConfig.sourceSectionIndex - Index of the source section.
     * @param {number} moveConfig.sourceVisualizationIndex - Index of the visualization within the source section.
     * @param {number} moveConfig.targetSectionIndex - Index of the target section.
     * @param {number} moveConfig.targetVisualizationIndex - Index at which the visualization will be placed within the target section.
     * @returns {Promise<void>} A promise that resolves to void after the move operation.
     * @private
     */
    moveVisualization(moveConfig) {
      try {
        const _this12 = this;
        return Promise.resolve(Container.getServiceAsync("SpaceContent")).then(function (spaceContentService) {
          _this12.vizDataModified = true;
          return spaceContentService.moveVisualization(MYHOME_PAGE_ID, moveConfig.sourceSectionIndex, moveConfig.sourceVisualizationIndex, moveConfig.targetSectionIndex, moveConfig.targetVisualizationIndex);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Filters out duplicate visualizations from a list of all visualizations
     *
     * @param {object[]} aVisibleFavoriteVizs - array containing list of all visualizations
     * @param {boolean} bReturnDuplicateVizs - flag when set to true, returns only the duplicate apps
     * @returns {object[]} filtered array of vizualisations
     * @private
     */
    _filterDuplicateVizs(aVisibleFavoriteVizs, bReturnDuplicateVizs) {
      return aVisibleFavoriteVizs.filter((oViz, iVizIndex, aVizs) => {
        const iFirstIndex = aVizs.findIndex(oTempApp => oTempApp.appId === oViz.appId);
        return bReturnDuplicateVizs ? iFirstIndex !== iVizIndex : iFirstIndex === iVizIndex;
      });
    }

    /**
     * Add Grouping Information to visualizations list, and return concatenated list.
     *
     * @param {object[]} aFavoriteVizs - list of all favorite visualizations
     * @returns {object[]} - concatenated list contaning grouping information as well
     * @private
     */
    _addGroupInformation(aFavoriteVizs) {
      const aRecentVizs = [],
        aSections = [];
      let oExistingSection;
      _linkDuplicateVizs(aFavoriteVizs).forEach(oViz => {
        if (oViz.persConfig?.isDefaultSection) {
          aRecentVizs.push(oViz);
        } else {
          oExistingSection = aSections.find(oSection => oSection.isSection && oSection.id === oViz.persConfig?.sectionId);
          if (!oExistingSection) {
            aSections.push({
              id: oViz.persConfig?.sectionId,
              index: oViz.persConfig?.sectionIndex,
              title: oViz.persConfig?.sectionTitle || "",
              badge: "1",
              BGColor: DEFAULT_BG_COLOR().key,
              icon: "sap-icon://folder-full",
              isSection: true,
              isPresetSection: oViz.persConfig?.isPresetSection,
              apps: [oViz]
            });
          } else {
            oExistingSection.apps?.push(oViz);
            oExistingSection.badge = oExistingSection.apps?.length.toString();
          }
        }
      });

      //filter out duplicate apps only from recent apps list
      return [...aSections, ...this._filterDuplicateVizs(aRecentVizs, false)];
    }

    /**
     * Move a section within a page
     *
     * @param {number} sourceSectionIndex - source index (previous index of the section in the page before move)
     * @param {number} targetSectionIndex - target index (desired index of the section in the page after move)
     * @returns {Promise} resolves to void  and moves the section to desired index within the page
     * @private
     */
    moveSection(sourceSectionIndex, targetSectionIndex) {
      try {
        return Promise.resolve(Container.getServiceAsync("Pages").then(function (oPagesService) {
          const iPageIndex = oPagesService.getPageIndex(MYHOME_PAGE_ID);
          return oPagesService.moveSection(iPageIndex, sourceSectionIndex, targetSectionIndex);
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Returns array of all feature toggles
     *
     * @returns {object[]} - returns array of all feature toggles.
     */
    _getFeatureToggles() {
      try {
        let sFeatureToggleUrl = FEATURE_TOGGLE_SRVC_URL + "?$filter=";
        const FEATURE_TOGGLE_KEYS = Object.keys(FEATURE_TOGGLES);
        const toggleFilter = FEATURE_TOGGLE_KEYS.map(sToggleKey => {
          return "ToggleId eq '" + FEATURE_TOGGLES[sToggleKey] + "'";
        }).join(" or ");
        sFeatureToggleUrl = sFeatureToggleUrl + "(" + toggleFilter + ")";
        return Promise.resolve(HttpHelper.GetJSON(sFeatureToggleUrl)).then(function (_HttpHelper$GetJSON) {
          const oResponse = _HttpHelper$GetJSON;
          if (oResponse?.error) {
            throw new Error(oResponse.error.message);
          }
          return oResponse?.value || [];
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Checks if feature is enabled or not.
     *
     * @param {string} sToggleId - feature toggle id
     * @returns {boolean} - returns true if feature is enabled.
     */
    isFeatureEnabled(sToggleId) {
      try {
        const _this13 = this;
        return Promise.resolve(_catch(function () {
          return Promise.resolve(_this13._getFeatureToggles()).then(function (aFeatureToggles) {
            const oToggle = aFeatureToggles.find(oFeatureToggle => {
              return oFeatureToggle.ToggleId === sToggleId;
            });
            return oToggle && oToggle.State === "" ? false : true;
          });
        }, function (error) {
          Log.error("Unable to load feature toggles: " + error.message);
          return false;
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Fetch Recommended Fiori IDs
     *
     * @returns {Promise} resolves to array of recommended fiori ids
     * @private
     */
    _getRecommenedFioriIds() {
      let bForceRefresh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      try {
        const _this14 = this;
        return Promise.resolve(_this14.isFeatureEnabled(FEATURE_TOGGLES.RECOMMENDATION)).then(function (recommendationEnabled) {
          let _exit2 = false;
          function _temp11(_result3) {
            return _exit2 ? _result3 : _this14.recommendedFioriIds;
          }
          if (!recommendationEnabled) {
            return Promise.resolve([]);
          }
          const _temp10 = function () {
            if (!_this14.recommendedFioriIds || bForceRefresh) {
              return _catch(function () {
                return Promise.resolve(HttpHelper.GetJSON(RECOMMENDATION_SRVC_URL)).then(function (_HttpHelper$GetJSON2) {
                  const response = _HttpHelper$GetJSON2;
                  _this14.recommendedFioriIds = response?.value?.map(oApp => {
                    return oApp.app_id;
                  }) || [];
                });
              }, function (error) {
                Log.error("Unable to load feature toggles: " + error.message);
                const _Promise$resolve = Promise.resolve([]);
                _exit2 = true;
                return _Promise$resolve;
              });
            }
          }();
          return _temp10 && _temp10.then ? _temp10.then(_temp11) : _temp11(_temp10);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Fetch Catalog Apps
     *
     * @returns {Promise} resolves to array of Catalog Apps
     * @private
     */
    _getCatalogApps() {
      try {
        return Promise.resolve(_catch(function () {
          return Promise.resolve(Container.getServiceAsync("SearchableContent")).then(function (SearchableContent) {
            return SearchableContent.getApps({
              includeAppsWithoutVisualizations: false
            });
          });
        }, function (error) {
          Log.error("Error while fetching catalog apps: " + error.message);
          return [];
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Check If Page is List Report
     *
     * @param {object} page - page object
     * @returns {boolean} returns boolean
     * @private
     */
    _isListReport(page) {
      return page?.component?.name === "sap.suite.ui.generic.template.ListReport";
    }

    /**
     * Checks whether page settings contains addCardtoInsightsHidden
     * @param {object} page - page object
     * @returns {boolean} returns boolean
     * @private
     */
    // checks whether page settings contains addCardtoInsightsHidden
    isAddCardToInsightsHidden(page) {
      return page?.component?.settings?.tableSettings?.addCardtoInsightsHidden;
    }

    /**
     * check Valid Manifests
     *
     * @returns {boolean} returns boolean
     * @private
     */

    _checkValidManifests(manifest) {
      const hasRequiredDataSource = manifest["sap.ui.generic.app"] && manifest["sap.app"]?.dataSources?.mainService;
      if (!hasRequiredDataSource) {
        return false;
      }
      const pages = manifest["sap.ui.generic.app"]?.pages;
      // if its not list report component or if listreport page settings has
      // isAddCardToInsightsHidden as true, then do not recommend the card
      if (Array.isArray(pages)) {
        return this._isListReport(pages[0]) && !this.isAddCardToInsightsHidden(pages[0]);
      } else if (Object.keys(pages).length) {
        return Object.keys(pages).some(key => {
          if (pages[key]) {
            return this._isListReport(pages[key]) && !this.isAddCardToInsightsHidden(pages[key]);
          }
        });
      }
      return false;
    }

    /**
     * Get OData Model
     *
     * @param {object} manifest - manifest object
     * @returns {object} returns OData Model
     * @private
     */
    _getOdataModel(oManifest) {
      return new Promise(function (resolve) {
        const datasource = oManifest?.["sap.app"]?.dataSources;
        const mainService = datasource?.mainService;
        const annotationUrls = mainService?.settings?.annotations.map(sname => {
          if (datasource && datasource[sname]) {
            return datasource[sname]?.uri;
          }
        }).filter(urls => urls !== undefined);
        const oDataModel = new ODataModelV2(mainService?.uri, {
          annotationURI: annotationUrls,
          loadAnnotationsJoined: true
        });
        oDataModel.attachMetadataLoaded(() => {
          resolve(oDataModel);
        });
        oDataModel.attachMetadataFailed(() => {
          resolve(oDataModel);
        });
      });
    }

    /**
     * Get Entity Set
     *
     * @param {object} manifest - manifest object
     * @returns {string} returns entity set
     * @private
     */
    _getEntitySet(manifest) {
      const pages = manifest["sap.ui.generic.app"]?.pages;
      if (Array.isArray(pages)) {
        return pages[0].entitySet;
      } else if (pages) {
        for (const key in pages) {
          const oApp = pages[key];
          if (oApp.component && oApp.component?.name === "sap.suite.ui.generic.template.ListReport") {
            return oApp.entitySet;
          }
        }
      }
      return undefined;
    }

    /**
     * function returns true if the passed entityset / properties have mandatory properties
     *
     * @param {EntitySet} oEntitySet - Entity set
     * @param {Array} aProperties - Additional Properties
     * @returns {boolean} returns boolean
     * @private
     */
    _hasMandatoryProperties(oEntitySet, aProperties) {
      // if entityset has required properties in filter restrictions return true
      if (oEntitySet?.["Org.OData.Capabilities.V1.FilterRestrictions"]?.["RequiredProperties"]?.length) {
        return true;
      } else if (aProperties?.length) {
        // iterate through all properties and return true if any property is mandatory or sap:rquired-in-filter is true
        return aProperties.some(oProperty => {
          return Object.keys(oProperty).length && (oProperty["sap:parameter"] === "mandatory" || oProperty["sap:required-in-filter"] === "true");
        });
      }
    }

    /**
     * Get Parametersised Entity Set Params
     *
     * @param {ODataMetaModel} oMetaModel - Meta Model
     * @param {string} sEntitySet - Entity Set
     * @param {boolean} bIsParamEntitySet - Is Param Entity Set
     * @returns {object} returns entity set params
     * @private
     */
    _getParametersisedEntitySetParams(oMetaModel, sEntitySet, bInfoParams) {
      if (!oMetaModel) {
        throw new Error("OData Model needs to be passed as an argument");
      }
      const oResult = {
        entitySetName: null,
        parameters: [],
        navPropertyName: null
      };
      const oEntitySet = oMetaModel.getODataEntitySet(sEntitySet);
      const oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
      const aNavigationProperties = oEntityType.navigationProperty;
      if (!aNavigationProperties) {
        return oResult;
      }
      // filter the parameter entityset for extracting it's key and it's entityset name
      aNavigationProperties.forEach(function (oNavProperty) {
        const oNavigationEntitySet = oMetaModel.getODataAssociationEnd(oEntityType, oNavProperty.name);
        const oNavigationEntityType = oNavigationEntitySet && oMetaModel.getODataEntityType(oNavigationEntitySet.type);
        if (oNavigationEntityType?.["sap:semantics"] !== "parameters" || !oNavigationEntityType.key) {
          return;
        }
        oResult.entitySetName = oMetaModel.getODataAssociationSetEnd(oEntityType, oNavProperty.name)?.entitySet;
        for (let value of oNavigationEntityType.key.propertyRef) {
          if (bInfoParams) {
            const navProp = oNavigationEntityType.property;
            for (let navProperty of navProp) {
              if (navProperty.name === value.name) {
                oResult.parameters.push(navProperty);
                oResult.entitySetName = oMetaModel.getODataAssociationSetEnd(oEntityType, oNavProperty.name)?.entitySet;
              }
            }
          } else {
            oResult.parameters.push(value.name);
          }
        }
        const aSubNavigationProperties = oNavigationEntityType.navigationProperty;
        // Parameter entityset must have association back to main entityset.
        const bBackAssociationPresent = aSubNavigationProperties?.some(function (oSubNavigationProperty) {
          const sSubNavigationEntityType = oMetaModel.getODataAssociationEnd(oNavigationEntityType, oSubNavigationProperty.name)?.type;
          //if entityset.entitytype is same as subnavigation entitytype then it's a back association
          oResult.navPropertyName = sSubNavigationEntityType === oEntitySet.entityType ? oSubNavigationProperty.name : null;
          return oResult.navPropertyName;
        });
        return bBackAssociationPresent && oResult.navPropertyName && oResult.entitySetName;
      });
      return oResult;
    }

    /**
     * Get Column Detail
     *
     * @param {object} oEntityType - entity type object
     * @param {object} oMetaModel - meta model object
     * @param {object} oColumn - column object
     * @returns {object} returns column detail
     * @private
     */
    _getColumnDetail(oEntityType, oMetaModel, oLineItemContext) {
      let oProperty,
        oColumnObject = {};
      if (oLineItemContext.Value?.Path) {
        oProperty = oMetaModel.getODataProperty(oEntityType, oLineItemContext.Value.Path);
      }
      if (!oProperty || oProperty["com.sap.vocabularies.UI.v1.Hidden"]?.Bool || oLineItemContext["com.sap.vocabularies.UI.v1.Hidden"]?.Bool) {
        return oColumnObject;
      }
      // if there is field control path binding then ignore the column
      if (oProperty["com.sap.vocabularies.Common.v1.FieldControl"]?.Path) {
        return undefined;
      }
      let sColumnKeyDescription = oProperty["com.sap.vocabularies.Common.v1.Text"]?.Path || "";
      sColumnKeyDescription = "{" + sColumnKeyDescription + "}";
      let sColumnValue = "{" + oProperty.name + "}";
      let sNavigation = ""; //need to improve
      const aSemKeyAnnotation = oEntityType["com.sap.vocabularies.Common.v1.SemanticKey"];
      const bIsPropertySemanticKey = !!aSemKeyAnnotation && aSemKeyAnnotation.some(function (oAnnotation) {
        return oAnnotation.PropertyPath === oProperty.name;
      });
      if (oProperty["Org.OData.Measures.V1.ISOCurrency"]?.Path) {
        sColumnValue = sColumnValue.concat(" " + "{" + sNavigation + oProperty["Org.OData.Measures.V1.ISOCurrency"].Path + "}");
      }
      if (oProperty["Org.OData.Measures.V1.Unit"]?.Path) {
        sColumnValue = sColumnValue.concat(" " + "{" + sNavigation + oProperty["Org.OData.Measures.V1.Unit"].Path + "}");
      }
      if (oProperty["com.sap.vocabularies.Common.v1.Text"]?.Path) {
        let sTextArragement = oProperty["com.sap.vocabularies.Common.v1.Text"]["com.sap.vocabularies.UI.v1.TextArrangement"];
        if (!sTextArragement) {
          sTextArragement = oEntityType["com.sap.vocabularies.UI.v1.TextArrangement"];
        }
        this._setColumnTextValue(sTextArragement, oColumnObject, sColumnKeyDescription, sColumnValue);
      } else {
        oColumnObject["value"] = sColumnValue;
        if (bIsPropertySemanticKey) {
          oColumnObject.identifier = bIsPropertySemanticKey;
        }
      }
      oColumnObject.path = oProperty["com.sap.vocabularies.Common.v1.Text"] ? oProperty["com.sap.vocabularies.Common.v1.Text"].Path : oProperty.name;
      oColumnObject.importance = oLineItemContext["com.sap.vocabularies.UI.v1.Importance"];
      oColumnObject.type = oProperty.type;
      return oColumnObject;
    }

    /**
     * Sets display text format of column
     *
     * @private
     * @param {{EnumMember: string} | undefined} sTextArragement - sTextArragement object
     * @param {Record<string, unknown>} oColumnObject - Object containing column details
     * @param {string} sColumnKeyDescription - Description field to include in text value
     * @param {string} sColumnValue - The value to include in Text value
     */
    _setColumnTextValue(sTextArragement, oColumnObject, sColumnKeyDescription, sColumnValue) {
      const sTextArrangementType = sTextArragement?.EnumMember.split("/")[1];
      if (sTextArrangementType === "TextOnly") {
        oColumnObject["value"] = "{= $" + sColumnKeyDescription + " === '' ? '' : $" + sColumnKeyDescription + "}";
      } else if (sTextArrangementType === "TextLast") {
        oColumnObject["value"] = "{= $" + sColumnValue + " === '' ? '' : $" + sColumnValue + "}" + "{= $" + sColumnKeyDescription + " === '' ? '' : ' (' + ($" + sColumnKeyDescription + ") + ')'}";
      } else if (sTextArrangementType === "TextSeparate") {
        oColumnObject["value"] = "{= $" + sColumnValue + " === '' ? '' : $" + sColumnValue + "}";
      } else {
        // Default case
        oColumnObject["value"] = "{= $" + sColumnKeyDescription + " === '' ? '' : $" + sColumnKeyDescription + "}" + "{= $" + sColumnValue + " === '' ? '' : ' (' + ($" + sColumnValue + ") + ')'}";
      }
    }

    /**
     * Get Manifest Card Data
     *
     * @param {object} manifest - manifest object
     * @param {object} entityType - entity type object
     * @param {object} lineItem - line item object
     * @param {string} entitySet - entity set
     * @param {object} parentApp - parent app object
     * @param {object} metaModel - meta model object
     * @returns {object} returns card data
     * @private
     */
    _getManifestCardData(manifest, oEntityType, lineItem, entitySet, oParentApp, oMetaModel) {
      const mainServiceUri = manifest?.["sap.app"]?.dataSources.mainService.uri;
      const serviceUrl = mainServiceUri?.[mainServiceUri.length - 1] === "/" ? mainServiceUri + entitySet : mainServiceUri + "/" + entitySet;

      //get the column details for each of the lineitem columns
      const aColumns = lineItem?.map(oColumn => {
        return this._getColumnDetail(oEntityType, oMetaModel, oColumn);
      }).filter(function (oItem) {
        // if no column or if path of column is complex path then filter it out
        return oItem !== undefined && oItem.path.split("/").length <= 1;
      });
      //sort  the column based on their importance and then splice the first 4 columns
      const aColumnSorted = DataFormatUtils.sortCollectionByImportance(aColumns).map(column => {
        return {
          path: column.path,
          type: column.type,
          value: column.value
        };
      }).splice(0, 4);
      return {
        cardTitle: manifest?.["sap.app"]?.title,
        subTitle: oEntityType["com.sap.vocabularies.Common.v1.Label"] ? "Top 5 " + oEntityType["com.sap.vocabularies.Common.v1.Label"].String : "",
        url: serviceUrl + "?$top=5&skip=0",
        semanticObject: oParentApp.semanticObject,
        action: oParentApp.action,
        id: manifest?.["sap.app"]?.id,
        columns: aColumnSorted
      };
    }

    /**
     * Load I18n
     *
     * @param {object} manifest - manifest object
     * @param {string} manifestUrl - manifest url
     * @returns {object} returns resource bundle
     * @private
     */
    loadI18n(manifest, manifestUrl) {
      try {
        const _this15 = this;
        function _temp13() {
          return _this15._RBManifestMap[absoluteUrl];
        }
        // construct abslute url for properties file relative to manifest url
        const i18nBundleUrl = manifest?.["sap.app"]?.["i18n"]["bundleUrl"];
        const absoluteUrl = new URL(i18nBundleUrl, manifestUrl).href;
        _this15._RBManifestMap = _this15._RBManifestMap || {};
        const _temp12 = function () {
          if (!_this15._RBManifestMap[absoluteUrl]) {
            return Promise.resolve(ResourceBundle.create({
              // specify url of the base .properties file
              bundleUrl: absoluteUrl,
              async: true,
              terminologies: manifest["sap.app"]?.["i18n"]["terminologies"]
            })).then(function (oResourceBundle) {
              _this15._RBManifestMap[absoluteUrl] = oResourceBundle;
            });
          }
        }();
        return Promise.resolve(_temp12 && _temp12.then ? _temp12.then(_temp13) : _temp13(_temp12));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Get I18n Value Or Default String
     *
     * @param {string} sValue - value
     * @param {object} oResourceBundle - resource bundle object
     * @returns {string} returns string
     * @private
     */
    getI18nValueOrDefaultString(sValue, oRB) {
      let sPath = "";
      if (sValue && sValue.startsWith("{{")) {
        sPath = sValue.substring(2, sValue.length - 2);
      } else if (sValue && sValue.startsWith("{")) {
        sPath = sValue.substring(1, sValue.length - 1);
      }
      return sPath ? oRB.getText(sPath) : sValue;
    }

    /**
     * Get Attribute Value
     *
     * @param {object} oColumn - column object
     * @returns {string} returns attribute value
     * @private
     */
    _getAttributeValue(oAttribute) {
      let oAttributeValue = !oAttribute.value.startsWith("{") ? "{= extension.formatters.stringFormatter(${" + oAttribute.path + "}) }" : oAttribute.value;
      if (oAttribute.type === "Edm.Date" || oAttribute.type === "Edm.DateTime") {
        const oDateFormatOptions = JSON.stringify({
          pattern: Formatting.getDatePattern("short")
        });
        oAttributeValue = "{=${" + oAttribute.path + "}?format.dateTime(${" + oAttribute.path + "}, " + oDateFormatOptions + ") : ''}";
      }
      return oAttributeValue;
    }

    /**
     * Get Manifest
     *
     * @param {object} cardInput - card input object
     * @returns {object} returns manifest
     * @private
     */
    _getManifest(oInput) {
      const cardSkeletonCopy = JSON.parse(JSON.stringify(CardSkeleton));
      const oApp = cardSkeletonCopy["sap.app"];
      const oCard = cardSkeletonCopy["sap.card"];
      if (oApp) {
        oApp.id = "user." + oInput.id + "." + Date.now();
        oApp.title = oCard.header.title = oInput.cardTitle;
        oApp.subTitle = oCard.header.subTitle = oInput.subTitle;
      }
      const oContent = oCard.content;
      oContent.item.title = this._getAttributeValue(oInput.columns[0]);
      oContent.item.description = this._getAttributeValue(oInput.columns[1]);
      oContent.item.attributes[0] = {
        value: this._getAttributeValue(oInput.columns[2]),
        visible: "{= !!${" + oInput.columns[2].path + "} }"
      };
      oContent.data.request.url = oInput.url;
      oContent.item.actions = oCard.header.actions = [{
        type: "Navigation",
        parameters: {
          ibnTarget: {
            semanticObject: oInput.semanticObject,
            action: oInput.action
          }
        }
      }];
      cardSkeletonCopy["sap.insights"] = {
        parentAppId: oInput.id,
        cardType: "RT",
        versions: {
          ui5: this.versionInfo.version + "-" + this.versionInfo.buildTimestamp
        },
        visible: true
      };
      return cardSkeletonCopy;
    }

    /**
     * Fetch Card Mainfest
     *
     * @param {string[]} aAppIds - array of app ids
     * @returns {Promise} resolves to array of card manifest
     * @private
     */
    _getCardMainfest(aAppIds) {
      try {
        const _this16 = this;
        return Promise.resolve(Promise.all([_this16._getInboundApps(), _this16._getCatalogApps()])).then(function (_ref3) {
          let [aInbounds, aCatalog] = _ref3;
          return Promise.resolve(VersionInfo.load()).then(function (_VersionInfo$load) {
            _this16.versionInfo = _VersionInfo$load;
            let aAppUrls = aAppIds.map(appId => {
              const oApp = aInbounds.find(oItem => {
                return oItem?.signature?.parameters?.["sap-fiori-id"]?.defaultValue?.value === appId;
              });
              if (oApp) {
                const oViz = aCatalog.find(oCatalog => {
                  return oApp.semanticObject === oCatalog.target?.semanticObject && oApp.action === oCatalog.target?.action;
                });
                return oViz && oApp?.resolutionResult?.applicationDependencies?.manifest;
              }
              return undefined;
            }).filter(url => {
              return url !== undefined;
            });
            const aManifestPromises = aAppUrls.map(function (url) {
              try {
                return Promise.resolve(fetch(String(url))).then(function (response) {
                  return Promise.resolve(response.json()).then(function (_response$json) {
                    const manifest = _response$json;
                    return {
                      url: response.url,
                      manifest: manifest
                    };
                  });
                });
              } catch (e) {
                return Promise.reject(e);
              }
            });
            return Promise.resolve(Promise.all(aManifestPromises)).then(function (aManifest) {
              const validManifests = aManifest.filter(manifestObj => {
                return _this16._checkValidManifests(manifestObj.manifest);
              });
              const odataPromises = validManifests.map(manifestObj => {
                return _this16._getOdataModel(manifestObj.manifest).then(model => {
                  return model.getMetaModel();
                });
              });
              return Promise.resolve(Promise.all(odataPromises)).then(function (aMetaModel) {
                const cardPromises = validManifests.map(function (manifestObj, index) {
                  try {
                    let _exit3 = false;
                    return Promise.resolve(_catch(function () {
                      function _temp15(_result5) {
                        return _exit3 ? _result5 : _this16._getManifest(cardInput);
                      }
                      const oMetaModel = aMetaModel[index];
                      const entitySet = _this16._getEntitySet(manifestObj.manifest);
                      if (!entitySet) {
                        return undefined;
                      }
                      const oEntitySet = oMetaModel.getODataEntitySet(entitySet);
                      const oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
                      const oLineItem = oEntityType["com.sap.vocabularies.UI.v1.LineItem"];
                      if (!oLineItem || _this16._hasMandatoryProperties(oEntitySet, oEntityType.property)) {
                        return undefined;
                      }
                      const parameterDetails = _this16._getParametersisedEntitySetParams(oMetaModel, entitySet, true);
                      if (parameterDetails && parameterDetails.entitySetName && parameterDetails.parameters.length) {
                        const paramEntitySet = oMetaModel.getODataEntitySet(parameterDetails.entitySetName);
                        if (_this16._hasMandatoryProperties(paramEntitySet, parameterDetails.parameters)) {
                          return undefined;
                        }
                      }
                      const oParentApp = aInbounds.find(function (oApp) {
                        return oApp.resolutionResult && oApp.resolutionResult.ui5ComponentName === manifestObj?.manifest?.["sap.app"]?.id;
                      });
                      const cardInput = _this16._getManifestCardData(manifestObj.manifest, oEntityType, oLineItem, entitySet, oParentApp, oMetaModel);
                      // if less than 3 columns are present in the card, then do not recommend the card
                      if (cardInput.columns.length < 3) {
                        return undefined;
                      }
                      const _temp14 = function () {
                        if (typeof manifestObj?.manifest?.["sap.app"]?.i18n === "object") {
                          const i18nBundleUrl = manifestObj.manifest["sap.app"].i18n.bundleUrl;
                          //if manifest title is not resolved load the resource bundle of the parent app and get the text
                          return function () {
                            if (i18nBundleUrl && (manifestObj.manifest["sap.app"].title.startsWith("i18n>") || manifestObj.manifest["sap.app"].title.startsWith("{"))) {
                              return Promise.resolve(_this16.loadI18n(manifestObj.manifest, manifestObj.url)).then(function (i18nResourceBundle) {
                                cardInput.cardTitle = _this16.getI18nValueOrDefaultString(cardInput.cardTitle, i18nResourceBundle);
                                const _this16$_getManifest = _this16._getManifest(cardInput);
                                _exit3 = true;
                                return _this16$_getManifest;
                              });
                            }
                          }();
                        }
                      }();
                      return _temp14 && _temp14.then ? _temp14.then(_temp15) : _temp15(_temp14);
                    }, function (error) {
                      Log.error(error);
                      return undefined;
                    }));
                  } catch (e) {
                    return Promise.reject(e);
                  }
                });
                return Promise.resolve(Promise.all(cardPromises)).then(function (cards) {
                  return cards.filter(card => {
                    return card !== undefined;
                  });
                });
              });
            });
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Remove Duplicate Cards
     *
     * @param {object[]} aCards - array of cards
     * @returns {object[]} returns array of cards
     * @private
     */
    _removeDuplicateCards(aCards) {
      const oCardDict = {};
      const aResult = [];
      aCards.forEach(oCard => {
        const sCardTitle = oCard?.descriptorContent?.["sap.card"]?.header?.title || "";
        if (!oCardDict[sCardTitle]) {
          aResult.push(oCard);
          oCardDict[sCardTitle] = true;
        }
      });
      return aResult;
    }

    /**
     * Fetch Recommended Cards
     *
     * @returns {Promise} resolves to array of recommended cards
     * @private
     */
    getRecommenedCards() {
      try {
        const _this17 = this;
        return Promise.resolve(_catch(function () {
          return Promise.resolve(_this17._getRecommenedFioriIds()).then(function (aAppIds) {
            return Promise.resolve(_this17._getCardMainfest(aAppIds)).then(function (aManifests) {
              const aRecManifests = aManifests.slice(0, RECOMMENDED_CARD_LIMIT);
              const aRecommendedCards = aRecManifests.map(manifest => {
                let id;
                if (manifest) {
                  manifest["sap.card"].rec = true;
                  id = manifest["sap.app"]?.id;
                }
                return {
                  id,
                  descriptorContent: manifest
                };
              });
              return _this17._removeDuplicateCards(aRecommendedCards);
            });
          });
        }, function (error) {
          Log.error("Error while fetching recommended cards: " + error.message);
          return [];
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Retrieves a list of recommended visualizations for the user.
     *
     * The final list is composed of up to 10 recommendations, with must-include visualizations prioritized.
     * If no recommended visualizations are available or if an error occurs, it returns an empty array.
     *
     * @private
     * @async
     * @param {boolean} [forceRefresh=false] - If `true`, forces a refresh of the recommended visualizations
     *                                         regardless of whether they are cached.
     * @returns {Promise<ICustomVisualization[]>} A promise that resolves to an array of recommended visualizations.
     *                                            The array is limited to 10 visualizations, including must-include recommendations.
     */
    getRecommendedVisualizations() {
      let forceRefresh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      try {
        const _this18 = this;
        function _temp18() {
          return _this18._recommendedVisualizations;
        }
        const _temp17 = function () {
          if (!_this18._recommendedVisualizations || forceRefresh) {
            return Promise.resolve(_this18._getRecommenedFioriIds(forceRefresh)).then(function (recommendedFioriIds) {
              const _temp16 = function () {
                if (recommendedFioriIds.length) {
                  let finalRecommendations = [];
                  let mustIncludeRecommendations = [];
                  return Promise.resolve(Promise.all([_this18._getVisualizationsByFioriIds(recommendedFioriIds), _this18._fetchMyHomeVizs(forceRefresh)])).then(function (_ref4) {
                    let [recommendedVisualizations, favoriteVisualizations] = _ref4;
                    //filter out recommendations that are already added
                    recommendedVisualizations = recommendedVisualizations.filter(recViz => _isVisualizationAlreadyAdded(recViz, favoriteVisualizations));
                    recommendedVisualizations.forEach(recViz => {
                      if (_isMustIncludeRecommendation(recViz)) {
                        mustIncludeRecommendations.push(recViz);
                      } else {
                        finalRecommendations.push(recViz);
                      }
                    });
                    //return only 10 recommended apps along with 'MyInbox' and 'Manage My Timesheet' if user has access to these apps.
                    _this18._recommendedVisualizations = finalRecommendations.slice(0, 10 - mustIncludeRecommendations.length).concat(mustIncludeRecommendations);
                  });
                } else {
                  _this18._recommendedVisualizations = [];
                }
              }();
              if (_temp16 && _temp16.then) return _temp16.then(function () {});
            });
          }
        }();
        return Promise.resolve(_temp17 && _temp17.then ? _temp17.then(_temp18) : _temp18(_temp17));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Asynchronously retrieves the list of inbound applications from the SAP Fiori client-side target resolution service.
     *
     * @private
     * @async
     * @returns {Promise<Array>} A promise that resolves to an array of inbound applications.
     *                            If an error occurs or the inbound applications are not available, it resolves to an empty array.
     */
    _getInboundApps() {
      try {
        return Promise.resolve(_catch(function () {
          return Promise.resolve(Container.getServiceAsync("ClientSideTargetResolution")).then(function (service) {
            return service?._oAdapter?._aInbounds || [];
          });
        }, function (error) {
          Log.error("Error while fetching inbound apps: " + error.message);
          return [];
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Retrieves visualizations based on a list of Fiori IDs.
     *
     * This function processes the given Fiori IDs to find associated visualizations. It does so by fetching
     * inbound applications and catalog apps, then matching the Fiori IDs to filter out and gather relevant visualizations.
     * The function distinguishes between GUI and non-GUI visualizations, prioritizing non-GUI visualizations if both types are found.
     * It also ensures that each visualization is unique based on its URL and title, avoiding duplicates.
     *
     * @private
     * @async
     * @param {string[]} fioriIds - An array of Fiori IDs to search for visualizations.
     * @returns {Promise<ICustomVisualization[]>} A promise that resolves to an array of unique visualizations associated with the provided Fiori IDs.
     */
    _getVisualizationsByFioriIds(fioriIds) {
      try {
        const _this19 = this;
        const visualizations = [];
        const visitedVisualizations = new Map();
        return Promise.resolve(Promise.all([_this19._getInboundApps(), _this19._getCatalogApps()])).then(function (_ref5) {
          let [inbounds, catalogApps] = _ref5;
          fioriIds.forEach(fioriId => {
            // get all inbounds with the fiori id
            const authorizedApps = inbounds.filter(function (inbound) {
              return inbound?.signature.parameters["sap-fiori-id"]?.defaultValue?.value === fioriId;
            });
            authorizedApps.forEach(app => {
              //filter apps that matched semantic object action
              let matchingVizualizations = catalogApps.filter(catalogApp => {
                return catalogApp?.target?.semanticObject === app.semanticObject && catalogApp.target.action === app.action;
              });
              const guiVisualizations = matchingVizualizations.filter(matchingVizualization => _isGUIVisualization(matchingVizualization));
              const nonGuiVisualizations = matchingVizualizations.filter(matchingVizualization => !_isGUIVisualization(matchingVizualization));
              //if both gui and non-gui visualizations exists, then consider only non-gui visualizations for recommendation.
              if (guiVisualizations.length > 0 && nonGuiVisualizations.length > 0) {
                matchingVizualizations = [...nonGuiVisualizations];
              }
              matchingVizualizations.forEach(matchingVizualization => {
                let visualization = matchingVizualization.visualizations[0];
                let recommendedVisualization = {
                  title: visualization.title,
                  subtitle: visualization.subtitle,
                  icon: visualization.icon,
                  url: visualization.targetURL,
                  vizId: visualization.vizId,
                  fioriId: fioriId,
                  visualization: visualization
                };
                //if app with same url or title already recommended, then don't consider it.
                if (!visitedVisualizations.has(recommendedVisualization.url) || !visitedVisualizations.has(recommendedVisualization.title)) {
                  visitedVisualizations.set(recommendedVisualization.url, true);
                  visitedVisualizations.set(recommendedVisualization.title, true);
                  visualizations.push(recommendedVisualization);
                }
              });
            });
          });
          return visualizations;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
  return AppManager;
});
//# sourceMappingURL=AppManager-dbg-dbg.js.map
