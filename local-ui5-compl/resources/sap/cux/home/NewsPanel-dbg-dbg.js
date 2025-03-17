/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/base/Log", "sap/m/SlideTile", "sap/ui/core/EventBus", "sap/ui/core/format/DateFormat", "sap/ui/model/xml/XMLModel", "sap/ushell/Container", "./BaseNewsPanel", "./MenuItem", "./NewsGroup", "./NewsItem", "./library", "./utils/FESRUtil", "./utils/PersonalisationUtils", "./utils/UshellPersonalizer"], function (Log, SlideTile, EventBus, DateFormat, XMLModel, Container, __BaseNewsPanel, __MenuItem, __NewsGroup, __NewsItem, ___library, ___utils_FESRUtil, __PersonalisationUtils, __UshellPersonalizer) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
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
  const BaseNewsPanel = _interopRequireDefault(__BaseNewsPanel);
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
  function _for(test, update, body) {
    var stage;
    for (;;) {
      var shouldContinue = test();
      if (_isSettledPact(shouldContinue)) {
        shouldContinue = shouldContinue.v;
      }
      if (!shouldContinue) {
        return result;
      }
      if (shouldContinue.then) {
        stage = 0;
        break;
      }
      var result = body();
      if (result && result.then) {
        if (_isSettledPact(result)) {
          result = result.s;
        } else {
          stage = 1;
          break;
        }
      }
      if (update) {
        var updateValue = update();
        if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
          stage = 2;
          break;
        }
      }
    }
    var pact = new _Pact();
    var reject = _settle.bind(null, pact, 2);
    (stage === 0 ? shouldContinue.then(_resumeAfterTest) : stage === 1 ? result.then(_resumeAfterBody) : updateValue.then(_resumeAfterUpdate)).then(void 0, reject);
    return pact;
    function _resumeAfterBody(value) {
      result = value;
      do {
        if (update) {
          updateValue = update();
          if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
            updateValue.then(_resumeAfterUpdate).then(void 0, reject);
            return;
          }
        }
        shouldContinue = test();
        if (!shouldContinue || _isSettledPact(shouldContinue) && !shouldContinue.v) {
          _settle(pact, 1, result);
          return;
        }
        if (shouldContinue.then) {
          shouldContinue.then(_resumeAfterTest).then(void 0, reject);
          return;
        }
        result = body();
        if (_isSettledPact(result)) {
          result = result.v;
        }
      } while (!result || !result.then);
      result.then(_resumeAfterBody).then(void 0, reject);
    }
    function _resumeAfterTest(shouldContinue) {
      if (shouldContinue) {
        result = body();
        if (result && result.then) {
          result.then(_resumeAfterBody).then(void 0, reject);
        } else {
          _resumeAfterBody(result);
        }
      } else {
        _settle(pact, 1, result);
      }
    }
    function _resumeAfterUpdate() {
      if (shouldContinue = test()) {
        if (shouldContinue.then) {
          shouldContinue.then(_resumeAfterTest).then(void 0, reject);
        } else {
          _resumeAfterTest(shouldContinue);
        }
      } else {
        _settle(pact, 1, result);
      }
    }
  }
  const MenuItem = _interopRequireDefault(__MenuItem);
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
  const NewsGroup = _interopRequireDefault(__NewsGroup);
  const NewsItem = _interopRequireDefault(__NewsItem);
  const NewsType = ___library["NewsType"];
  const addFESRId = ___utils_FESRUtil["addFESRId"];
  const PersonalisationUtils = _interopRequireDefault(__PersonalisationUtils);
  const UshellPersonalizer = _interopRequireDefault(__UshellPersonalizer);
  const BASE_URL = "/sap/opu/odata4/ui2/insights_srv/srvd/ui2/",
    NEWS_FEED_READ_API = BASE_URL + "insights_read_srv/0001/" + "NEWS_FEED",
    NEWS_FEED_TRANSLATION_API = BASE_URL + "insights_read_srv/0001/" + "NewsFeedColumnTranslation",
    NEWS_FEED_COUNT_URL = NEWS_FEED_READ_API + "/$count",
    DEFAULT_FEED_COUNT = 7,
    fnImagePlaceholder = function (sPath, N) {
      return Array.from({
        length: N
      }, function (v, i) {
        return sPath + "/" + (i + 1) + ".jpg";
      });
    };
  const CUSTOM_NEWS_FEED = {
      TITLE: "LineOfBusiness",
      LINK: "WhatsNewDocument",
      VALIDITY: "ValidAsOf",
      PREPARATION_REQUIRED: "PreparationRequired",
      EXCLUDE_FIELDS: ["ChangeId", "LineNumber", "LineOfBusiness", "SolutionArea", "Title", "Description", "Type", "ValidAsOf", "WhatsNewDocument", "Link"],
      IMAGE_URL: "sap/cux/home/img/CustomNewsFeed/",
      FESR_STEP_NAME: "custNewsSlide-press",
      EMPTY_DATA_ERROR_CODE: "NODATA"
    },
    CUSTOM_IMAGES = {
      "Application Platform and Infrastructure": fnImagePlaceholder("ApplicationPlatformandInfrastructure", 3),
      "Asset Management": fnImagePlaceholder("AssetManagement", 3),
      "Cross Applications": fnImagePlaceholder("CrossApplications", 3),
      Finance: fnImagePlaceholder("Finance", 3),
      Manufacturing: fnImagePlaceholder("Manufacturing", 3),
      "R&D / Engineering": fnImagePlaceholder("RnDandEngineering", 3),
      Sales: fnImagePlaceholder("Sales", 3),
      "Sourcing and Procurement": fnImagePlaceholder("SourcingandProcurement", 3),
      "Supply Chain": fnImagePlaceholder("SupplyChain", 3),
      default: ["default.jpg"]
    };

  /**
   *
   * Panel class for managing and storing News.
   *
   * @extends sap.cux.home.BaseNewsPanel
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.121
   *
   * @internal
   * @experimental Since 1.121
   * @public
   *
   * @alias sap.cux.home.NewsPanel
   */
  const NewsPanel = BaseNewsPanel.extend("sap.cux.home.NewsPanel", {
    metadata: {
      library: "sap.cux.home",
      properties: {
        /**
         * The URL of the news item.
         *
         * @public
         */
        url: {
          type: "string",
          group: "Misc",
          defaultValue: "",
          visibility: "public"
        },
        /**
         * Type of the news item.
         *
         * @public
         */
        type: {
          type: "sap.cux.home.NewsType",
          group: "Misc",
          visibility: "public",
          defaultValue: NewsType.RSS
        },
        /**
         * The key of custom news feed.
         *
         * @public
         */
        customFeedKey: {
          type: "string",
          group: "Misc",
          defaultValue: "",
          visibility: "public"
        },
        /**
         * The filename of custom news feed.
         *
         */
        customFileName: {
          type: "string",
          group: "Misc",
          defaultValue: ""
        },
        /**
         * The flag for custom news feed is checked or not.
         */
        showCustom: {
          type: "boolean",
          group: "Misc",
          defaultValue: false
        },
        /**
         * The flag to determine rss feed will load or not.
         *
         * @private
         */
        newsAvailable: {
          type: "boolean",
          group: "Misc",
          defaultValue: true,
          visibility: "hidden"
        }
      },
      aggregations: {
        /**
         * newsGroup aggregation for News
         */
        newsGroup: {
          type: "sap.cux.home.NewsGroup",
          singularName: "newsGroup",
          multiple: true,
          visibility: "hidden"
        }
      }
    },
    /**
     * Constructor for a new News Panel.
     *
     * @param {string} [id] ID for the new control, generated automatically if an ID is not provided
     * @param {object} [settings] Initial settings for the new control
     */
    constructor: function _constructor(id, settings) {
      BaseNewsPanel.prototype.constructor.call(this, id, settings);
    },
    /**
     * Init lifecycle method
     *
     * @private
     * @override
     */
    init: function _init() {
      BaseNewsPanel.prototype.init.call(this);
      this.oNewsTile = new SlideTile(this.getId() + "--idNewsSlide", {
        displayTime: 20000,
        width: "100%",
        height: "17rem"
      }).addStyleClass("newsTileMaxWidth sapUiSmallMarginTop sapUiSmallMarginBottom");
      this.getNewsWrapper().addContent(this.oNewsTile);
      this.setProperty("title", this._i18nBundle.getText("newsTitle"));
      this._eventBus = EventBus.getInstance();
      const menuItem = new MenuItem(`${this.getId()}-manageNews`, {
        title: this._i18nBundle.getText("mngNews"),
        icon: "sap-icon://edit",
        press: this.handleEditNews.bind(this)
      });
      this.addAggregation("menuItems", menuItem);
      addFESRId(menuItem, "manageNews");
    },
    /**
     * Retrieves news data asynchronously.
     * If the news model is not initialized, it initializes the XML model and loads news feed data.
     * @returns {Promise} A promise that resolves when the news data is retrieved.
     */
    getData: function _getData() {
      try {
        const _this = this;
        const sUrl = _this.getUrl();
        const _temp2 = function () {
          if (sUrl && !_this.getProperty("showCustom")) {
            return Promise.resolve(_this.initializeXmlModel(sUrl)).then(function (_this$initializeXmlMo) {
              _this.oNewsModel = _this$initializeXmlMo;
              _this.oNewsTile.setModel(_this.oNewsModel);
            });
          } else {
            const _temp = function () {
              if (_this.getProperty("showCustom")) {
                _this.bNewsLoad = _this.bNewsLoad || false;
                return Promise.resolve(UshellPersonalizer.getInstance(PersonalisationUtils.getPersContainerId(_this), PersonalisationUtils.getOwnerComponent(_this))).then(function (_UshellPersonalizer$g) {
                  _this.oPersonalizer = _UshellPersonalizer$g;
                  return Promise.resolve(_this.oPersonalizer.read()).then(function (_this$oPersonalizer$r) {
                    _this.oPersData = _this$oPersonalizer$r;
                    const sCustomNewsFeedKey = _this.getCustomFeedKey();
                    if (sCustomNewsFeedKey) {
                      void _this.setCustomNewsFeed(sCustomNewsFeedKey);
                    } else {
                      _this.handleFeedError();
                    }
                  });
                });
              } else {
                _this.handleFeedError();
              }
            }();
            if (_temp && _temp.then) return _temp.then(function () {});
          }
        }();
        return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Returns the custom news feed key property of NewsPanel
     * @returns {string} custom news feed key
     */
    getCustomFeedKey: function _getCustomFeedKey() {
      const sCustomNewsFeedKey = this.getProperty("customFeedKey");
      if (sCustomNewsFeedKey) {
        return sCustomNewsFeedKey;
      } else {
        return this.oPersData?.oAdaptationData?.customNewsFeedKey;
      }
    },
    /**
     * Returns the Url property of NewsPanel
     * @returns {any}
     */
    getUrl: function _getUrl() {
      return this.getProperty("url");
    },
    /**
     * Initializes an XML model for managing news data.
     * This method returns a Promise that resolves to the initialized XML model.
     */
    /**
     * Initializes an XML model for managing news data.
     * This method returns a Promise that resolves to the initialized XML model.
     * @param {string} sUrl rss url to load the news feed
     * @returns {Promise<XMLModel>} XML Document containing the news feeds
     */
    initializeXmlModel: function _initializeXmlModel(sUrl) {
      try {
        const _this2 = this;
        const oParent = _this2.getParent();
        return Promise.resolve(new Promise(resolve => {
          const oNewsModel = new XMLModel(sUrl);
          oNewsModel.setDefaultBindingMode("OneWay");
          oNewsModel.attachRequestCompleted(oEvent => {
            void function () {
              try {
                if (!_this2.bNewsLoad) {
                  oParent?.panelLoadedFn("News", {
                    loaded: true,
                    count: DEFAULT_FEED_COUNT
                  });
                  _this2.bNewsLoad = true;
                }
                const oDocument = oEvent.getSource().getData();
                return Promise.resolve(_this2.loadNewsFeed(oDocument, 0)).then(function () {
                  _this2._eventBus.publish("KeyUserChanges", "newsFeedLoadFailed", {
                    showError: false,
                    date: new Date()
                  });
                  resolve(oNewsModel);
                });
              } catch (e) {
                return Promise.reject(e);
              }
            }();
          });
          oNewsModel.attachRequestFailed(() => {
            _this2.handleFeedError();
            if (!_this2.bNewsLoad) {
              oParent?.panelLoadedFn("News", {
                loaded: false,
                count: 0
              });
              _this2.bNewsLoad = true;
            }
            _this2._eventBus.publish("KeyUserChanges", "newsFeedLoadFailed", {
              showError: true,
              date: new Date()
            });
            resolve(oNewsModel);
          });
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Loads the news feed based on the provided document and number of feeds.
     * Determines the feed type (RSS, feed, custom) and binds the news tile accordingly.
     * @param {Document} oDocument - The document containing the news feed data.
     * @param {number} [noOfFeeds] - The number of feeds to be displayed. Defaults to a predefined value.
     */
    loadNewsFeed: function _loadNewsFeed(oDocument, noOfFeeds) {
      try {
        const _this3 = this;
        function _temp4() {
          if (!!oDocument?.querySelector("rss") && !!oDocument?.querySelector("item")) {
            oBindingInfo = {
              path: "/channel/item/",
              length: noOfFeeds || DEFAULT_FEED_COUNT
            };
          } else if (!!oDocument?.querySelector("feed") && !!oDocument?.querySelector("entry")) {
            oBindingInfo = {
              path: "/entry/",
              length: noOfFeeds || DEFAULT_FEED_COUNT
            };
          } else if (!!oDocument?.querySelector("customFeed") && !!oDocument?.querySelector("item")) {
            oBindingInfo = {
              path: "/item/",
              length: noOfFeeds || DEFAULT_FEED_COUNT
            };
          } else {
            _this3.handleFeedError();
            return;
          }
          _this3.bindNewsTile(_this3.oNewsTile, oBindingInfo);
        }
        let oBindingInfo;
        const _temp3 = function () {
          if (!oDocument?.querySelector("customFeed")) {
            return Promise.resolve(_this3.extractAllImageUrls(oDocument, noOfFeeds || DEFAULT_FEED_COUNT)).then(function () {});
          }
        }();
        return Promise.resolve(_temp3 && _temp3.then ? _temp3.then(_temp4) : _temp4(_temp3));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Handles errors that occur during the loading of the news feed.
     * @returns {void}
     */
    handleFeedError: function _handleFeedError() {
      if (this.getProperty("showCustom")) {
        this.generateErrorMessage().setVisible(true);
        this.oNewsTile.setVisible(false);
      } else {
        (this.getNewsWrapper()?.getParent()).setVisible(false);
        this.setProperty("newsAvailable", false);
      }
    },
    setURL: function _setURL(url) {
      try {
        const _this4 = this;
        _this4.setProperty("showCustom", false);
        _this4.setProperty("newsAvailable", true);
        _this4.generateErrorMessage().setVisible(false);
        (_this4.getNewsWrapper()?.getParent()).setVisible(true);
        _this4.oNewsTile.setVisible(true);
        _this4.setProperty("url", url);
        return Promise.resolve(_this4.getData()).then(function () {});
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Binds the news tile with the provided binding information.
     * @param {sap.m.SlideTile} oSlideTile - The SlideTile control to be bound.
     * @param {IBindingInfo} oBindingInfo - The binding information containing the path and length of the aggregation.
     */
    bindNewsTile: function _bindNewsTile(oSlideTile, oBindingInfo) {
      if (oBindingInfo) {
        oSlideTile.bindAggregation("tiles", {
          path: oBindingInfo.path,
          length: oBindingInfo.length,
          templateShareable: false,
          factory: (sId, oContext) => {
            const newsInfo = oContext.getObject();
            let oTile;
            if (newsInfo.getElementsByTagName("link").length > 0) {
              oTile = new NewsItem("", {
                url: newsInfo.getElementsByTagName("link")[0].textContent,
                title: newsInfo.getElementsByTagName("title")[0].textContent,
                subTitle: newsInfo.getElementsByTagName("description")[0].textContent,
                imageUrl: newsInfo.getElementsByTagName("imageUrl")[0].textContent,
                footer: this.formatDate(newsInfo.getElementsByTagName("pubDate")[0].textContent)
              });
            } else {
              oTile = new NewsGroup("", {
                title: newsInfo.getElementsByTagName("title")[0].textContent,
                subTitle: this._i18nBundle.getText("newsFeedDescription"),
                imageUrl: newsInfo.getElementsByTagName("imageUrl")[0].textContent,
                footer: newsInfo.getElementsByTagName("footer")[0].textContent
              });
            }
            this.addAggregation("newsItems", oTile, true);
            return oTile.getTile();
          }
        });
      }
    },
    /**
     * Extracts images for all the news tiles
     * @param {Document} oDocument - The document containing the news feed data.
     * @param {number} [noOfFeeds] - The number of feeds to be displayed. Defaults to a predefined value.
     */
    extractAllImageUrls: function _extractAllImageUrls(oDocument, noOfFeeds) {
      try {
        const _this5 = this;
        let i = 0;
        const _temp5 = _for(function () {
          return i < noOfFeeds;
        }, function () {
          return i++;
        }, function () {
          const oItemElement = oDocument?.getElementsByTagName("item")[i];
          return Promise.resolve(_this5.extractImage(oItemElement.getElementsByTagName("link")[0].textContent)).then(function (sUrl) {
            const oImageUrl = oDocument.createElement("imageUrl");
            oImageUrl.textContent = sUrl;
            oItemElement.appendChild(oImageUrl);
          });
        });
        return Promise.resolve(_temp5 && _temp5.then ? _temp5.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Formats the publication date or the update date to a relative date-time format.
     * @param {string} oPublished - The publication date.
     * @returns {string} The formatted relative date-time string.
     */
    formatDate: function _formatDate(oPublished) {
      return this.toRelativeDateTime(new Date(oPublished));
    },
    /**
     * Returns the favourite news feed for the custom news
     * @returns {any}
     */
    getFavNewsFeed: function _getFavNewsFeed() {
      return this.aFavNewsFeed;
    },
    /**
     * Extracts the image URL from the provided HREF link or link.
     * @param {string} sHrefLink - The HREF link containing the image URL.
     * @returns {Promise} A promise that resolves to the extracted image URL.
     */
    extractImage: function _extractImage(sHrefLink) {
      const fnLoadPlaceholderImage = () => {
        const sPrefix = sap.ui.require.toUrl("sap.cux.home/src/sap/cux/home/utils/");
        this.image = this.image ? this.image + 1 : 1;
        this.image = this.image < 9 ? this.image : 1;
        return `${sPrefix}/imgNews/${this.image}.jpg`;
      };
      return fetch(sHrefLink).then(res => res.text()).then(sHTML => {
        const aMatches = sHTML.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i);
        return Array.isArray(aMatches) && aMatches[1] ? aMatches[1] : fnLoadPlaceholderImage();
      }).catch(fnLoadPlaceholderImage);
    },
    /**
     * Converts the given date to a relative date-time format.
     * @param {Date} oDate - The date to be converted.
     * @returns {string} The date in relative date-time format.
     */
    toRelativeDateTime: function _toRelativeDateTime(oDate) {
      const oRelativeDateFormatter = DateFormat.getDateTimeInstance({
        style: "medium",
        relative: true,
        relativeStyle: "short"
      });
      return oRelativeDateFormatter.format(new Date(oDate));
    },
    /**
     * This method retrieves the count and feeds of the custom news feed asynchronously.
     * If the count is not zero, it loads the custom news feed data and returns the feeds.
     * @param {string} sFeedId - The ID of the custom news feed to set.
     * @returns {Promise} A promise that resolves to an array of news feeds.
     */
    setCustomNewsFeed: function _setCustomNewsFeed(sFeedId) {
      try {
        const _this6 = this;
        return Promise.resolve(_catch(function () {
          _this6.oNewsTile.setVisible(true);
          _this6.generateErrorMessage().setVisible(false);
          return Promise.resolve(_this6.oPersonalizer?.read()).then(function (_this6$oPersonalizer$) {
            _this6.oPersData = _this6$oPersonalizer$;
            _this6.aFavNewsFeed = _this6.oPersData?.favNewsFeed || {
              items: []
            };
            return Promise.resolve(Promise.all([_this6.getCustomNewsFeedCount(sFeedId), _this6.getCustomNewsFeed(sFeedId, _this6.aFavNewsFeed.showAllPreparationRequired)])).then(function (_ref) {
              let [iFeedCount, aFeeds] = _ref;
              if (aFeeds.length === 0 || iFeedCount === 0) {
                throw new Error();
              }
              //filer selected feeds from all news feed
              if (_this6.aFavNewsFeed?.items?.length) {
                aFeeds = aFeeds.filter(oNewsFeed => {
                  return _this6.aFavNewsFeed?.items.includes(oNewsFeed.title);
                });
              } else if (_this6.aFavNewsFeed?.items?.length === 0) {
                throw new Error("Error: No news feed available");
              }
              _this6.loadCustomNewsFeed(aFeeds);
            });
          });
        }, function (err) {
          Log.error(err);
          _this6.handleFeedError();
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Retrieves the count of custom news feed items identified by the provided feed ID.
     * @param {string} sFeedId - The ID of the custom news feed.
     * @returns {Promise} A Promise that resolves to the count of custom news feed items.
     */
    getCustomNewsFeedCount: function _getCustomNewsFeedCount(sFeedId) {
      try {
        const _this7 = this;
        function _temp8(_fetch) {
          return _temp6 ? _fetch : Promise.resolve(_fetch.json()).then(_temp7);
        }
        function _temp7(_await$fetch$json) {
          _this7.pCustomNewsFeedCount[sUrl] = _temp6 ? _await$fetch$json : _await$fetch$json;
          return _this7.pCustomNewsFeedCount[sUrl];
        }
        let sUrl = encodeURI(NEWS_FEED_COUNT_URL + "?$filter=ChangeId" + " eq " + "'" + sFeedId + "'");
        _this7.pCustomNewsFeedCount = _this7.pCustomNewsFeedCount ? _this7.pCustomNewsFeedCount : {};
        const _temp6 = _this7.pCustomNewsFeedCount[sUrl] !== undefined;
        return Promise.resolve(_temp6 ? _temp8(_temp7(_this7.pCustomNewsFeedCount[sUrl])) : Promise.resolve(fetch(sUrl)).then(_temp8));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Retrieves custom news feed items identified by the provided feed ID and settings.
     * It processes the response data and returns an array of custom news feed items.
     * @param {string} sFeedId - The ID of the custom news feed.
     * @param {boolean} showAllPreparationRequired - Indicates whether to show all preparation required.
     * @returns {Promise} A Promise that resolves to an array of custom news feed items.
     */
    getCustomNewsFeed: function _getCustomNewsFeed(sFeedId, showAllPreparationRequired) {
      try {
        const _this8 = this;
        return Promise.resolve(_catch(function () {
          const sUrl = _this8.getNewsFeedDetailsUrl({
            changeId: sFeedId,
            showAllPreparationRequired: showAllPreparationRequired
          });
          _this8.pCustomNewsFeed = _this8.pCustomNewsFeed ? _this8.pCustomNewsFeed : {};
          _this8.pCustomNewsFeed[sUrl] = _this8.pCustomNewsFeed[sUrl] !== undefined ? _this8.pCustomNewsFeed[sUrl] : _this8.getAuthNewsFeed(sUrl);
          return Promise.resolve(_this8.pCustomNewsFeed[sUrl]).then(function (oResponse) {
            const oFeedDict = {};
            const aFeeds = [];
            if (oResponse?.length > 0) {
              oResponse.forEach(oFeed => {
                const title = oFeed[CUSTOM_NEWS_FEED.TITLE];
                if (!oFeedDict[title.value]) {
                  aFeeds.push({
                    title: title.value,
                    footer: oFeed[CUSTOM_NEWS_FEED.VALIDITY].value,
                    imageUrl: _this8.getCustomFeedImage(title.value)
                  });
                  oFeedDict[title.value] = title.value;
                }
              });
            }
            return aFeeds;
          });
        }, function (err) {
          Log.error(err);
          throw new Error(err);
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Generates the URL for retrieving news feed details based on the provided news object.
     * The generated URL limits the number of results to 999.
     * @param {INewsItem} oNews - The news object containing properties such as changeId, title, and showAllPreparationRequired.
     * @returns {string} The URL for retrieving news feed details.
     */
    getNewsFeedDetailsUrl: function _getNewsFeedDetailsUrl(oNews) {
      let sUrl = NEWS_FEED_READ_API + "?$filter=ChangeId eq " + "'" + oNews.changeId + "'";
      sUrl = oNews.title ? sUrl + " and LineOfBusiness eq " + "'" + encodeURI(oNews.title) + "'" : sUrl;
      sUrl = oNews.showAllPreparationRequired ? sUrl + " and PreparationRequired eq true" : sUrl;
      return sUrl + "&$top=999";
    },
    /**
     * Retrieves the news feed from the specified URL after applying authorization filtering based on the available apps.
     * If the news feed contains impacted artifacts, it checks if the current user has access to any of the impacted apps.
     * If the user has access to at least one impacted app, the news feed is included in the returned array.
     * @param {string} sNewsUrl - The URL of the news feed.
     * @returns {Array} The filtered array of news feed items authorized for the user.
     */
    getAuthNewsFeed: function _getAuthNewsFeed(sNewsUrl) {
      try {
        const _this9 = this;
        return Promise.resolve(_catch(function () {
          return Promise.resolve(Promise.all([_this9.getAllAvailableApps(), _this9.getNewsFeedDetails(sNewsUrl)])).then(function (_ref2) {
            let [aAvailableApps, aNewsFeed] = _ref2;
            return aAvailableApps.length === 0 ? aNewsFeed : _this9.arrangeNewsFeeds(aNewsFeed, aAvailableApps);
          });
        }, function (err) {
          Log.error(err);
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * If the news feed contains impacted artifacts, it checks if the current user has access to any of the impacted apps.
     * If the user has access to at least one impacted app, the news feed is included in the returned array.
     * @param {ICustomNewsFeed[]} aNewsFeed - array of news feed
     * @param {IAvailableApp[]} aAvailableApps - array of all availabel apps
     * @returns {Array} The filtered array of news feed items authorized for the user.
     */
    arrangeNewsFeeds: function _arrangeNewsFeeds(aNewsFeed, aAvailableApps) {
      const aAuthNewsFeed = [];
      aNewsFeed.forEach(oNewsFeed => {
        if (oNewsFeed.Category.value !== "App" || !oNewsFeed.ImpactedArtifacts.value) {
          aAuthNewsFeed.push(oNewsFeed);
        } else {
          const aImpactedArtifacts = oNewsFeed.ImpactedArtifacts.value.split("\n");
          for (let impactedArtifact of aImpactedArtifacts) {
            const oImpactedArtifact = impactedArtifact;
            if (oImpactedArtifact && this.isAuthFeed(aAvailableApps, impactedArtifact)) {
              aAuthNewsFeed.push(oNewsFeed);
              break;
            }
          }
        }
      });
      return aAuthNewsFeed;
    },
    /**
     * takes all available apps list and the impacted atifact from the news and returns if it's valid
     * @param {IAvailableApp[]} aAvailableApps - Array of all available apps
     * @param {string} oImpactedArtifact - impacted artifact form the news
     * @returns {boolean} checks if the news is authenticated with the available apps list
     */
    isAuthFeed: function _isAuthFeed(aAvailableApps, oImpactedArtifact) {
      const fioriIdSplitter = "|";
      if (oImpactedArtifact.includes(fioriIdSplitter)) {
        const aTokens = oImpactedArtifact.split(fioriIdSplitter);
        const sFioriId = (aTokens[aTokens.length - 1] || "").trim();
        if (sFioriId) {
          const index = aAvailableApps.findIndex(oApp => {
            return sFioriId === oApp?.signature?.parameters["sap-fiori-id"]?.defaultValue?.value;
          });
          return index > -1;
        }
      }
      return true;
    },
    /**
     * Retrieves all available apps from the ClientSideTargetResolution service for authorization filtering.
     * @returns {Array} An array of available apps.
     */
    getAllAvailableApps: function _getAllAvailableApps() {
      try {
        return Promise.resolve(_catch(function () {
          return Promise.resolve(Container.getServiceAsync("ClientSideTargetResolution")).then(function (oService) {
            return oService?._oAdapter._aInbounds || [];
          });
        }, function (err) {
          if (err instanceof Error) {
            Log.error(err.message);
          }
          return [];
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Retrieves the news feed details from the specified URL, including translation and formatting of field labels.
     * @param {string} sUrl - The URL of the news feed details.
     * @returns {Array} The array of news feed items with translated and formatted field labels.
     */
    getNewsFeedDetails: function _getNewsFeedDetails(sUrl) {
      try {
        const _this10 = this;
        function _temp11(_fetch2) {
          return _temp9 ? _fetch2 : Promise.resolve(_fetch2.json()).then(_temp10);
        }
        function _temp10(_await$fetch$json2) {
          _this10.pNewsFeed[sUrl] = _temp9 ? _await$fetch$json2 : _await$fetch$json2;
          const fnFormattedLabel = sLabel => sLabel.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
          return Promise.resolve(Promise.all([_this10.pNewsFeed[sUrl], _this10.getTranslatedText(_this10.getCustomFeedKey())])).then(function (_ref3) {
            let [newsResponse, translationResponse] = _ref3;
            const aNews = JSON.parse(JSON.stringify(newsResponse.value || []));
            const aTranslation = JSON.parse(JSON.stringify(translationResponse.value || []));
            return aNews.map(oNews => {
              const aFields = Object.keys(oNews);
              const aExpandFields = [];
              aFields.forEach(oField => {
                const oTranslatedField = aTranslation.find(oTranslation => oTranslation?.ColumnName?.toUpperCase() === oField.toUpperCase());
                const oTranslatedFieldName = oTranslatedField?.TranslatedName || fnFormattedLabel(oField);
                oNews[oField] = {
                  label: oTranslatedFieldName,
                  value: oNews[oField]
                };
                if (!CUSTOM_NEWS_FEED.EXCLUDE_FIELDS.includes(oField)) {
                  aExpandFields.push(oNews[oField]);
                }
              });
              oNews.Link = {
                label: _this10._i18nBundle.getText("readMoreLink"),
                value: oNews[CUSTOM_NEWS_FEED.LINK],
                text: "Link"
              };
              oNews.expanded = aNews.length === 1;
              oNews.expandFields = aExpandFields;
              return oNews;
            });
          });
        }
        _this10.pNewsFeed = _this10.pNewsFeed ? _this10.pNewsFeed : {};
        const _temp9 = _this10.pNewsFeed[sUrl] !== undefined;
        return Promise.resolve(_temp9 ? _temp11(_temp10(_this10.pNewsFeed[sUrl])) : Promise.resolve(fetch(sUrl)).then(_temp11));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Retrieves translated text for news feed fields based on the specified feed ID.
     * @param {string} sFeedId - The ID of the custom news feed
     * @returns {Promise} A promise resolving to the translated text for news feed fields.
     */
    getTranslatedText: function _getTranslatedText(sFeedId) {
      try {
        const _this11 = this;
        return Promise.resolve(_catch(function () {
          function _temp14(_fetch3) {
            return _temp12 ? _fetch3 : Promise.resolve(_fetch3.json()).then(_temp13);
          }
          function _temp13(_await$fetch$json3) {
            _this11.pCustomNewsFeed[sUrl] = _temp12 ? _await$fetch$json3 : _await$fetch$json3;
            return _this11.pCustomNewsFeed[sUrl];
          }
          const sUrl = NEWS_FEED_TRANSLATION_API + "?$filter=Changeid eq '" + sFeedId + "'";
          _this11.pCustomNewsFeed = _this11.pCustomNewsFeed ? _this11.pCustomNewsFeed : {};
          const _temp12 = _this11.pCustomNewsFeed[sUrl] !== undefined;
          return _temp12 ? _temp14(_temp13(_this11.pCustomNewsFeed[sUrl])) : Promise.resolve(fetch(sUrl)).then(_temp14);
        }, function (err) {
          if (err instanceof Error) {
            Log.error(err.message);
          }
          return [];
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Loads custom news feed into the news panel after parsing JSON feed data to XML format.
     * @param {Array} feeds - The array of custom news feed items.
     */
    loadCustomNewsFeed: function _loadCustomNewsFeed(feeds) {
      const oXMLResponse = this.parseJsonToXml(JSON.parse(JSON.stringify(feeds)));
      const oParent = this.getParent();
      if (!this.oNewsModel) {
        this.oNewsModel = new XMLModel(oXMLResponse);
        if (!this.bNewsLoad) {
          oParent?.panelLoadedFn("News", {
            loaded: true,
            count: DEFAULT_FEED_COUNT
          });
          this.bNewsLoad = true;
        }
        this.oNewsTile.setModel(this.oNewsModel);
      } else {
        this.oNewsModel.setData(oXMLResponse);
      }
      void this.loadNewsFeed(oXMLResponse, feeds.length);
    },
    /**
     * Parses JSON data into XML format.
     * @param {JSON[]} json - The JSON data to be parsed into XML.
     * @returns {XMLDocument} The XML document representing the parsed JSON data.
     */
    parseJsonToXml: function _parseJsonToXml(json) {
      const _transformJsonForXml = aData => aData.map(data => ({
        item: data
      }));
      const _jsonToXml = json => {
        let xml = "";
        let key;
        for (key in json) {
          const value = json[key];
          if (value) {
            if (typeof value === "object") {
              xml += `<${key}>${_jsonToXml(value)}</${key}>`;
            } else {
              xml += `<${key}>${value}</${key}>`;
            }
          }
        }
        return xml.replace(/<\/?\d+>/g, "");
      };
      const transformedJson = JSON.parse(JSON.stringify(_transformJsonForXml(json)));
      let xml = "<?xml version='1.0' encoding='UTF-8'?>";
      const rootToken = "customFeed";
      xml += `<${rootToken}>`;
      xml += _jsonToXml(transformedJson);
      xml += `</${rootToken}>`;
      xml = xml.replaceAll("&", "&amp;");
      const parser = new DOMParser();
      return parser.parseFromString(xml, "text/xml");
    },
    /**
     * Randomly selects an image from the available images for the feed item.
     * @param {string} sFileName - The file name of the custom news feed item.
     * @returns {string} The URL of the image for the feed item.
     */
    getCustomFeedImage: function _getCustomFeedImage(sFileName) {
      const sFileBasePath = sap.ui.require.toUrl(CUSTOM_NEWS_FEED.IMAGE_URL);
      let sFilePath = sFileBasePath + CUSTOM_IMAGES.default[0];
      const files = CUSTOM_IMAGES[sFileName] || [];
      let randomIndex = 0;
      if (files.length > 0) {
        const randomArray = new window.Uint32Array(1);
        window.crypto.getRandomValues(randomArray);
        randomIndex = randomArray[0] % 3;
        sFilePath = sFileBasePath + files[randomIndex];
      }
      return sFilePath;
    }
  });
  return NewsPanel;
});
//# sourceMappingURL=NewsPanel-dbg-dbg.js.map
