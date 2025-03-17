/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/base/Log", "sap/f/GridContainer", "sap/f/GridContainerSettings", "sap/fe/navigation/SelectionVariant", "sap/insights/CardHelper", "sap/insights/base/InMemoryCachingHost", "sap/m/HBox", "sap/m/HeaderContainer", "sap/m/VBox", "sap/ui/core/EventBus", "sap/ui/core/dnd/DragDropInfo", "sap/ui/core/library", "sap/ui/integration/widgets/Card", "sap/ui/model/json/JSONModel", "sap/ushell/Container", "sap/ushell/api/S4MyHome", "./BasePanel", "./MenuItem", "./utils/AppManager", "./utils/Constants", "./utils/Device", "./utils/DragDropUtils", "./utils/FESRUtil", "./utils/PersonalisationUtils", "./utils/UshellPersonalizer"], function (Log, GridContainer, GridContainerSettings, SelectionVariant, CardHelper, InsightsInMemoryCachingHost, HBox, HeaderContainer, VBox, EventBus, DragDropInfo, sap_ui_core_library, Card, JSONModel, Container, S4MyHome, __BasePanel, __MenuItem, __AppManager, ___utils_Constants, ___utils_Device, ___utils_DragDropUtils, ___utils_FESRUtil, __PersonalisationUtils, __UShellPersonalizer) {
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
  const dnd = sap_ui_core_library["dnd"];
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
  const BasePanel = _interopRequireDefault(__BasePanel);
  const MenuItem = _interopRequireDefault(__MenuItem);
  const AppManager = _interopRequireDefault(__AppManager);
  const FEATURE_TOGGLES = ___utils_Constants["FEATURE_TOGGLES"];
  const SETTINGS_PANELS_KEYS = ___utils_Constants["SETTINGS_PANELS_KEYS"];
  const DeviceType = ___utils_Device["DeviceType"];
  const fetchElementProperties = ___utils_Device["fetchElementProperties"];
  const attachKeyboardHandler = ___utils_DragDropUtils["attachKeyboardHandler"];
  const addFESRId = ___utils_FESRUtil["addFESRId"];
  const PersonalisationUtils = _interopRequireDefault(__PersonalisationUtils);
  const UShellPersonalizer = _interopRequireDefault(__UShellPersonalizer);
  var cardsMenuItems = /*#__PURE__*/function (cardsMenuItems) {
    cardsMenuItems["REFRESH"] = "cards-refresh";
    cardsMenuItems["EDIT_CARDS"] = "cards-editCards";
    return cardsMenuItems;
  }(cardsMenuItems || {});
  const RECOMMENDATION_PATH = "showRecommendation";
  let runtimeHostCreated = false;

  /**
   *
   * Panel class for managing and storing Insights Cards.
   *
   * @extends sap.cux.home.BasePanel
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.122.0
   *
   * @internal
   * @experimental Since 1.122
   * @public
   *
   * @alias sap.cux.home.CardsPanel
   */
  const CardsPanel = BasePanel.extend("sap.cux.home.CardsPanel", {
    metadata: {
      library: "sap.cux.home",
      properties: {
        title: {
          type: "string",
          group: "Misc",
          defaultValue: "",
          visibility: "hidden"
        },
        key: {
          type: "string",
          group: "Misc",
          defaultValue: "",
          visibility: "hidden"
        },
        fullScreenName: {
          type: "string",
          group: "Misc",
          defaultValue: "SI2",
          visibility: "hidden"
        }
      },
      defaultAggregation: "cards",
      aggregations: {
        /**
         * Aggregation of cards available within the cards panel
         */
        cards: {
          type: "sap.ui.integration.widgets.Card",
          multiple: true,
          singularName: "card",
          visibility: "hidden"
        }
      },
      events: {
        handleHidePanel: {
          parameters: {}
        },
        handleUnhidePanel: {
          parameters: {}
        }
      }
    },
    /**
     * Constructor for a new card panel.
     *
     * @param {string} [id] ID for the new control, generated automatically if an ID is not provided
     * @param {object} [settings] Initial settings for the new control
     */
    constructor: function _constructor(id, settings) {
      BasePanel.prototype.constructor.call(this, id, settings);
      this.aVisibleCardInstances = [];
      this.cardsInViewport = [];
      this._appSwitched = false;
      this.appManagerInstance = AppManager.getInstance();
    },
    init: function _init() {
      try {
        const _this = this;
        BasePanel.prototype.init.call(_this);
        _this.setProperty("title", `${_this._i18nBundle?.getText("insights")} ${_this._i18nBundle.getText("insightsCardsTitle")}`);
        _this.cardWidth = _this.getDeviceType() === DeviceType.Mobile ? "17rem" : "22rem";
        _this.cardHeight = _this.getDeviceType() === DeviceType.Mobile ? "25.5rem" : "33rem";

        //Initialize Tiles Model
        _this._oData = {
          userVisibleCards: [],
          userAllCards: []
        };
        _this._controlModel = new JSONModel(_this._oData);

        // Setup Menu Items
        const refreshMenuItem = new MenuItem(`${_this.getId()}-${cardsMenuItems.REFRESH}`, {
          title: _this._i18nBundle.getText("refresh"),
          icon: "sap-icon://refresh",
          press: () => _this.refreshCards()
        });
        addFESRId(refreshMenuItem, "cardsRefresh");
        const editCardsMenuItem = new MenuItem(`${_this.getId()}-${cardsMenuItems.EDIT_CARDS}`, {
          title: _this._i18nBundle.getText("manageCards"),
          icon: "sap-icon://edit",
          press: event => _this._handleEditCards(event)
        });
        addFESRId(editCardsMenuItem, "manageCards");
        _this.menuItems = [refreshMenuItem, editCardsMenuItem];
        _this.oEventBus = EventBus.getInstance();
        // Subscribe to the event
        _this.oEventBus.subscribe("importChannel", "cardsImport", function (sChannelId, sEventId, oData) {
          try {
            return Promise.resolve(_this._createCards(oData)).then(function () {
              return Promise.resolve(_this.rerenderCards()).then(function () {
                _this._importdone();
              });
            });
          } catch (e) {
            return Promise.reject(e);
          }
        }, _this);

        // Setup Header Content
        _this._setupHeader();
        return Promise.resolve(CardHelper.getServiceAsync()).then(function (_getServiceAsync) {
          _this.cardHelperInstance = _getServiceAsync;
          // Setup Host For Cards
          if (!runtimeHostCreated) {
            _this._addRuntimeHost();
          }
          // Toggles the activity of cards
          _this._toggleCardActivity();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Toggles the activity of cards on route change.
     *
     * @private
     * @returns {void}
     */
    _toggleCardActivity: function _toggleCardActivity() {
      const _this2 = this;
      const toggleUserActions = function (event) {
        try {
          const show = event.getParameter("isMyHomeRoute");
          const _temp2 = function () {
            if (show) {
              const _temp = function () {
                if (_this2._appSwitched) {
                  return Promise.resolve(_this2.rerenderCards()).then(function () {
                    _this2._appSwitched = false;
                  });
                }
              }();
              if (_temp && _temp.then) return _temp.then(function () {});
            } else {
              _this2._appSwitched = true;
            }
          }();
          return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
        } catch (e) {
          return Promise.reject(e);
        }
      };
      S4MyHome.attachRouteMatched({}, toggleUserActions, this);
    },
    /**
     * Create imported cards
     * @param {ICardManifest[]} aCards - array of card manifests
     * @returns {any}
     */
    _createCards: function _createCards(aCards) {
      try {
        const _this3 = this;
        return Promise.resolve(_this3.cardHelperInstance?._createCards(aCards)).then(function () {
          return _this3.rerenderCards();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Retrieves a manifest entry from a card.
     * If the manifest entry is not immediately available, it waits for the manifest to be ready.
     *
     * @param {object} oCard - The card object from which to retrieve the manifest entry.
     * @param {string} sEntry - The manifest entry key to retrieve.
     * @returns {Promise<ICardManifest | undefined>} A promise that resolves with the manifest entry value.
     */
    _getManifestEntryFromCard: function _getManifestEntryFromCard(oCard, sEntry) {
      const cardWithManifestPromise = oCard;
      const manifestEntry = oCard.getManifestEntry(sEntry);
      if (manifestEntry) {
        return Promise.resolve(manifestEntry);
      } else {
        if (!cardWithManifestPromise._pManifestReady) {
          cardWithManifestPromise._pManifestReady = new Promise(resolve => {
            oCard.attachManifestReady(() => {
              resolve(oCard.getManifestEntry(sEntry));
            });
          });
        }
        return cardWithManifestPromise._pManifestReady;
      }
    },
    _addRuntimeHost: function _addRuntimeHost() {
      const _this4 = this,
        _this5 = this,
        _this6 = this,
        _this7 = this,
        _this8 = this;
      this.runtimeHost = new InsightsInMemoryCachingHost("runtimeHost", {
        action: function (oEvent) {
          try {
            const sType = oEvent.getParameter("type");
            let oParameters = oEvent.getParameter("parameters") || {};
            const _temp3 = function () {
              if (sType === "Navigation" && oParameters.ibnTarget) {
                oEvent.preventDefault();
                const oCard = oEvent.getParameter("card") || {},
                  oIntegrationCardManifest = oCard?.getManifestEntry("sap.card") || {},
                  aHeaderActions = oIntegrationCardManifest?.header?.actions || [];

                //processing semantic date as param for navigation
                //check to verify if _semanticDateRangeSetting property is present in manifest
                let oCheckSemanticProperty;
                if (oIntegrationCardManifest?.configuration?.parameters?._semanticDateRangeSetting?.value) {
                  oCheckSemanticProperty = JSON.parse(oIntegrationCardManifest.configuration.parameters._semanticDateRangeSetting.value);
                }
                if (oCheckSemanticProperty && Object.keys(oCheckSemanticProperty).length) {
                  oParameters = _this4.cardHelperInstance.processSemanticDate(oParameters, oIntegrationCardManifest);
                }
                let aContentActions = _this4.getContentActions(oIntegrationCardManifest) || [];
                const oHeaderAction = aHeaderActions[0] || {},
                  oContentAction = aContentActions[0] || {};
                const bOldCardExtension = !!(oHeaderAction?.parameters && typeof oHeaderAction.parameters === "string" && oHeaderAction.parameters.indexOf("{= extension.formatters.addPropertyValueToAppState") > -1 || oContentAction?.parameters && typeof oContentAction.parameters === "string" && oContentAction.parameters.indexOf("{= extension.formatters.addPropertyValueToAppState") > -1);
                _this4._manageOldCardExtension(bOldCardExtension, oEvent, oParameters);
                return Promise.resolve(Container.getServiceAsync("Navigation")).then(function (navigationService) {
                  return Promise.resolve(navigationService.navigate({
                    target: oParameters.ibnTarget,
                    params: oParameters.ibnParams
                  })).then(function () {});
                });
              }
            }();
            return Promise.resolve(_temp3 && _temp3.then ? _temp3.then(function () {}) : void 0);
          } catch (e) {
            return Promise.reject(e);
          }
        },
        actions: [{
          type: "Custom",
          text: this._i18nBundle?.getText("refresh"),
          icon: "sap-icon://refresh",
          action: oCard => {
            this._refreshCardData(oCard);
          },
          visible: function (oCard) {
            try {
              return Promise.resolve(_this5._getManifestEntryFromCard(oCard, "sap.insights")).then(function (oEntry) {
                return oEntry && !oEntry.cacheType;
              });
            } catch (e) {
              return Promise.reject(e);
            }
          }
        }, {
          type: "Custom",
          text: this._i18nBundle?.getText("viewFilteredBy"),
          icon: "sap-icon://filter",
          action: oCard => {
            const cardId = oCard.getManifestEntry("sap.app").id;
            this.getParent()?._getLayout().openSettingsDialog(SETTINGS_PANELS_KEYS.INSIGHTS_CARDS, {
              cardId
            });
          },
          visible: function (oCard) {
            try {
              return Promise.resolve(_this6._getManifestEntryFromCard(oCard, "sap.insights")).then(function (oEntry) {
                if (oEntry) {
                  const oCardParams = oCard.getManifestEntry("sap.card")?.configuration?.parameters;
                  const aRelevantFilters = oCardParams?._relevantODataFilters?.value || [];
                  const bRelevantFilters = aRelevantFilters?.length;
                  const aRelevantParams = oCardParams?._relevantODataParameters?.value || [];
                  const bRelevantParams = aRelevantParams?.length;
                  const oCardDataSource = oCard.getManifestEntry("sap.app").dataSources;
                  const oFilterService = oCardDataSource?.filterService;
                  const oDataSourceSettings = oFilterService?.settings;
                  // show ViewFilteredBy Option only if relevantFilters or relevantParameters are there and is OdataV2 version
                  return !!((bRelevantFilters || bRelevantParams) && oDataSourceSettings && oDataSourceSettings.odataVersion === "2.0");
                } else {
                  return false;
                }
              });
            } catch (e) {
              return Promise.reject(e);
            }
          }
        }, {
          type: "Custom",
          text: this._i18nBundle?.getText("navigateToParent"),
          icon: "sap-icon://display-more",
          visible: function (oCard) {
            try {
              return Promise.resolve(_this7._getManifestEntryFromCard(oCard, "sap.insights").then(function (oEntry) {
                try {
                  if (oEntry) {
                    return Promise.resolve(_this7.cardHelperInstance.getParentAppDetails({
                      descriptorContent: oCard.getManifestEntry("/")
                    })).then(function (parentApp) {
                      if (parentApp.semanticObject && parentApp.action) {
                        return Promise.resolve(Container.getServiceAsync("Navigation")).then(function (navigationService) {
                          const intents = [{
                            target: {
                              semanticObject: parentApp.semanticObject,
                              action: parentApp.action
                            }
                          }];
                          return Promise.resolve(navigationService.isNavigationSupported(intents)).then(function (_navigationService$is) {
                            const aResponses = _navigationService$is;
                            return aResponses[0].supported || false;
                          });
                        });
                      } else {
                        return true;
                      }
                    });
                  } else {
                    return Promise.resolve(false);
                  }
                } catch (e) {
                  return Promise.reject(e);
                }
              }));
            } catch (e) {
              return Promise.reject(e);
            }
          },
          action: function (oCard) {
            try {
              return Promise.resolve(_this8.cardHelperInstance.getParentAppDetails({
                descriptorContent: oCard.getManifestEntry("/")
              })).then(function (parentApp) {
                const sShellHash = parentApp.semanticURL || parentApp.semanticObject;
                return Promise.resolve(Container.getServiceAsync("Navigation")).then(function (navigationService) {
                  return Promise.resolve(navigationService.navigate({
                    target: {
                      shellHash: sShellHash
                    }
                  })).then(function () {});
                });
              });
            } catch (e) {
              return Promise.reject(e);
            }
          }
        }]
      });
      runtimeHostCreated = true;
    },
    /**
     * Updates parameters for an old card extension
     * @private
     * @param {boolean} bOldCardExtension - Determines whether the card is using an old card extension.
     * @param {IcardActionEvent} oEvent - An event object
     * @param {ICardActionParameters} oParameters - Parameter object
     */
    _manageOldCardExtension: function _manageOldCardExtension(bOldCardExtension, oEvent, oParameters) {
      if (bOldCardExtension) {
        const oCardSV = new SelectionVariant();
        const oCardParams = oEvent.getParameter("card").getCombinedParameters();
        (oCardParams?._relevantODataParameters).forEach(sParamName => {
          if (oParameters.ibnParams) {
            oParameters.ibnParams[sParamName] = oCardParams[sParamName];
          }
        });
        (oCardParams?._relevantODataFilters).forEach(sFilterName => {
          const oCardParamsFilterName = JSON.parse(oCardParams[sFilterName]);
          const aSelectOptions = oCardParamsFilterName.SelectOptions[0];
          const aRanges = aSelectOptions.Ranges;
          if (aRanges?.length === 1 && aRanges[0].Sign === "I" && aRanges[0].Option === "EQ") {
            if (oParameters.ibnParams) {
              oParameters.ibnParams[sFilterName] = aRanges[0].Low;
            }
          } else if (aRanges?.length > 0) {
            oCardSV.massAddSelectOption(sFilterName, aRanges);
          }
        });
        const oTempParam = JSON.parse(oParameters?.ibnParams?.["sap-xapp-state-data"]);
        oTempParam.selectionVariant = oCardSV.toJSONObject();
        if (oParameters.ibnParams) {
          oParameters.ibnParams["sap-xapp-state-data"] = JSON.stringify(oTempParam);
        }
      }
    },
    /**
     * Retrieves actions for a card based on its content type.
     *
     * @private
     * @param {IsapCard} manifest - manifest object
     */
    getContentActions: function _getContentActions(manifest) {
      if (manifest.type === "List") {
        return manifest?.content?.item?.actions;
      } else if (manifest.type === "Table") {
        return manifest?.content?.row?.actions;
      } else {
        return manifest?.content?.actions;
      }
    },
    _importdone: function _importdone() {
      const stateData = {
        status: true
      };
      this.oEventBus.publish("importChannel", "cardsImported", stateData);
    },
    _refreshCardData: function _refreshCardData(oCard) {
      sap.ui.require(["sap/insights/base/CacheData"], InsightsCacheData => {
        const sCardId = oCard.getManifestEntry("sap.app").id;
        const cacheDataInstance = InsightsCacheData.getInstance();
        cacheDataInstance.clearCache(sCardId);
        oCard.refreshData();
      });
    },
    _setupHeader: function _setupHeader() {
      this.menuItems?.forEach(menuItem => this.addAggregation("menuItems", menuItem));
      this.actionButtons?.forEach(actionButton => this.addAggregation("actionButtons", actionButton));
      this.setProperty("enableFullScreen", true);
    },
    renderPanel: function _renderPanel() {
      try {
        const _this9 = this;
        return Promise.resolve(_this9.rerenderCards()).then(function () {});
      } catch (e) {
        return Promise.reject(e);
      }
    },
    rerenderCards: function _rerenderCards() {
      try {
        const _this10 = this;
        const _temp5 = _finallyRethrows(function () {
          return _catch(function () {
            // Enable Loader if container is present
            _this10.cardsContainer?.setBusy(true);
            // Fetch Cards from insights service
            return Promise.resolve(_this10.cardHelperInstance?._getUserVisibleCardModel()).then(function (oUserVisibleCardModel) {
              const aCards = oUserVisibleCardModel.getProperty("/cards");
              _this10._controlModel.setProperty("/userVisibleCards", aCards);
              const _temp4 = function () {
                if (aCards?.length) {
                  _this10._showCards(aCards);
                } else {
                  return Promise.resolve(_this10._checkForRecommendationCards()).then(function () {});
                }
              }();
              if (_temp4 && _temp4.then) return _temp4.then(function () {});
            });
          }, function (error) {
            if (error instanceof Error) {
              Log.error(error.message);
            }
            _this10.fireHandleHidePanel();
          });
        }, function (_wasThrown, _result) {
          _this10.cardsContainer?.setBusy(false);
          _this10._adjustLayout();
          if (_wasThrown) throw _result;
          return _result;
        });
        return Promise.resolve(_temp5 && _temp5.then ? _temp5.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    _checkForRecommendationCards: function _checkForRecommendationCards() {
      try {
        const _this11 = this;
        return Promise.resolve(_this11._getPersonalization()).then(function (_this11$_getPersonali) {
          _this11.oPersonalizer = _this11$_getPersonali;
          return Promise.resolve(_this11.oPersonalizer.read()).then(function (oPersData) {
            let _exit = false;
            function _temp7(_result2) {
              if (_exit) return _result2;
              _this11.fireHandleHidePanel();
            }
            const showRecommendationCards = oPersData?.[RECOMMENDATION_PATH];
            const _temp6 = function () {
              if (showRecommendationCards === undefined) {
                return Promise.resolve(_this11.appManagerInstance.getRecommenedCards()).then(function (aRecommendedCards) {
                  if (aRecommendedCards) {
                    const _this11$_handleRecomm = _this11._handleRecommendationCards(aRecommendedCards);
                    _exit = true;
                    return _this11$_handleRecomm;
                  }
                });
              }
            }();
            return _temp6 && _temp6.then ? _temp6.then(_temp7) : _temp7(_temp6);
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Handle Recommendation Cards
     * @param aRecommendedCards
     * @private
     */
    _handleRecommendationCards: function _handleRecommendationCards(aRecommendedCards) {
      try {
        const _this12 = this;
        const cardManifests = aRecommendedCards.map(oCard => oCard.descriptorContent);
        return Promise.resolve(_this12.cardHelperInstance?._createCards(cardManifests)).then(function () {
          return Promise.resolve(_this12._updateRecommendationStatus()).then(function () {
            return _this12.rerenderCards();
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     *
     * @private
     */
    _showCards: function _showCards(aCards) {
      this.fireHandleUnhidePanel();
      this.getParent()?.updatePanelsItemCount(aCards.length, this.getMetadata().getName());
      if (this.getProperty("title")) {
        this.setProperty("title", `${this._i18nBundle?.getText("insights")} ${this._i18nBundle.getText("insightsCardsTitle")} (${aCards.length})`);
      }
      // Create GridList Wrapper for all cards if not created
      if (!this.cardsContainer) {
        if (this.getDeviceType() === DeviceType.Mobile) {
          this.cardsContainer = new HeaderContainer(`${this.getId()}-insightsCardsMobileFlexBox`, {
            scrollStep: 0,
            scrollStepByItem: 1,
            gridLayout: true,
            scrollTime: 1000,
            showDividers: false,
            visible: this.getDeviceType() === DeviceType.Mobile
          });
        } else {
          this.cardsContainerSettings = new GridContainerSettings({
            columnSize: this.cardWidth,
            rowSize: this.cardHeight,
            gap: "1rem"
          });
          this.cardsContainer = new GridContainer(`${this.getId()}-insightsCardsFlexBox`, {}).addStyleClass("sapUiSmallMarginTop").setLayout(this.cardsContainerSettings);
        }
        this.cardsContainer.addDragDropConfig(new DragDropInfo({
          sourceAggregation: "items",
          targetAggregation: "items",
          dropPosition: dnd.DropPosition.Between,
          dropLayout: dnd.DropLayout.Horizontal,
          drop: oEvent => void this._handleCardsDnd(oEvent)
        })).attachBrowserEvent("keydown", event => {
          const disablenavigation = event.metaKey || event.ctrlKey;
          void attachKeyboardHandler(event, disablenavigation, dragDropEvent => this._handleCardsDnd(dragDropEvent));
        });
        this._addContent(this.cardsContainer);
      } else {
        const sDefaultAggreName = this.cardsContainer.getMetadata().getDefaultAggregationName();
        this.cardsContainer.removeAllAggregation(sDefaultAggreName);
        this.aVisibleCardInstances = [];
        this.cardsInViewport = [];
      }
      aCards.forEach(oCard => {
        const manifest = oCard.descriptorContent;
        // Create Card Instance
        const oUserCard = new Card({
          width: this.cardWidth,
          height: this.cardHeight,
          manifest,
          host: this.runtimeHost
        });
        this.aVisibleCardInstances.push(oUserCard);
        this.addAggregation("cards", oUserCard, true);
        const items = [oUserCard];

        // Add overlay in case of List and Table Card
        const sType = manifest["sap.card"].type;
        if (sType === "Table" || sType === "List") {
          const overlay = new HBox({
            width: this.cardWidth,
            height: "2rem"
          }).addStyleClass("insightsCardOverflowTop");
          const overlayHBoxWrapper = new HBox({
            height: "0"
          }).addStyleClass("sapMFlexBoxJustifyCenter");
          overlayHBoxWrapper.addItem(overlay);
          items.push(overlayHBoxWrapper);
        }

        // Create Wrapper VBox for Card
        const oPreviewVBox = new VBox({
          direction: "Column",
          justifyContent: "Center",
          items: items
        });

        // add VBox as item to GridList
        const sDefaultAggreName = this.cardsContainer.getMetadata().getDefaultAggregationName();
        this.cardsContainer.addAggregation(sDefaultAggreName, oPreviewVBox);
      });
      this.cardsContainer.setBusy(false);
    },
    _handleEditCards: function _handleEditCards(event) {
      /* If called from Panel Header event.source() will return TilesPanel, if called from Insights Container event.source() will return InsightsContainer.
      _getLayout is available at Container Level*/
      let parent = event.getSource().getParent() || this;
      if (parent?.isA("sap.cux.home.CardsPanel")) {
        parent = parent.getParent();
      }
      parent?._getLayout().openSettingsDialog(SETTINGS_PANELS_KEYS.INSIGHTS_CARDS);
    },
    handleRemoveActions: function _handleRemoveActions() {
      this.setProperty("title", "");
      this.setProperty("enableSettings", false);
      this.setProperty("enableFullScreen", false);
      this.removeAllAggregation("actionButtons");
      this.removeAllAggregation("menuItems");
    },
    handleAddActions: function _handleAddActions() {
      this.setProperty("title", `${this._i18nBundle?.getText("insights")} ${this._i18nBundle.getText("insightsCardsTitle")} (${this._controlModel.getProperty("/userVisibleCards")?.length})`);
      this.setProperty("enableSettings", true);
      this.setProperty("enableFullScreen", true);
      this._setupHeader();
    },
    refreshCards: function _refreshCards() {
      // This should be done via Host once implemented
      this.aVisibleCardInstances.forEach(card => card.refreshData());
    },
    _handleCardsDnd: function _handleCardsDnd(oEvent) {
      try {
        const _this13 = this;
        const sInsertPosition = oEvent.getParameter("dropPosition"),
          oDragItem = oEvent.getParameter("draggedControl"),
          iDragItemIndex = oDragItem.getParent()?.indexOfItem(oDragItem),
          oDropItem = oEvent.getParameter("droppedControl"),
          iDropItemIndex = oDragItem.getParent().indexOfItem(oDropItem);
        _this13.cardsContainer?.setBusy(true);
        // take the moved item from dragIndex and add to dropindex
        return Promise.resolve(_catch(function () {
          const _temp8 = function () {
            if (!_this13._controlModel.getProperty("/userAllCards").length) {
              return Promise.resolve(_this13.cardHelperInstance._getUserAllCardModel()).then(function (userAllCardsModel) {
                _this13._controlModel.setProperty("/userAllCards", userAllCardsModel.getProperty("/cards"));
                return Promise.resolve(_this13.updateCardList(sInsertPosition, iDropItemIndex, iDragItemIndex)).then(function () {});
              });
            } else {
              return Promise.resolve(_this13.updateCardList(sInsertPosition, iDropItemIndex, iDragItemIndex)).then(function () {});
            }
          }();
          if (_temp8 && _temp8.then) return _temp8.then(function () {});
        }, function (error) {
          if (error instanceof Error) {
            Log.error(error.message);
          }
          _this13.cardsContainer?.setBusy(false);
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    updateCardList: function _updateCardList(sInsertPosition, iDropItemIndex, iDragItemIndex) {
      try {
        const _this14 = this;
        const aUserVisibleCards = _this14._controlModel.getProperty("/userVisibleCards"),
          aUserAllCards = _this14._controlModel.getProperty("/userAllCards"),
          sDragedPositionRank = aUserVisibleCards[iDragItemIndex]?.rank,
          sDropedPositionRank = aUserVisibleCards[iDropItemIndex]?.rank;
        let iUpdatedDragItemIndex = aUserAllCards.findIndex(oCard => oCard.rank === sDragedPositionRank),
          iUpdatedDropItemIndex = aUserAllCards.findIndex(oCard => oCard.rank === sDropedPositionRank);
        if (sInsertPosition === "Before" && iDragItemIndex === iDropItemIndex - 1 || sInsertPosition === "After" && iDragItemIndex === iDropItemIndex + 1 || iDragItemIndex === iDropItemIndex) {
          _this14.cardsContainer?.setBusy(false);
          return Promise.resolve();
        }
        if (sInsertPosition === "Before" && iUpdatedDragItemIndex < iUpdatedDropItemIndex) {
          iUpdatedDropItemIndex--;
        } else if (sInsertPosition === "After" && iUpdatedDragItemIndex > iUpdatedDropItemIndex) {
          iUpdatedDropItemIndex++;
        }
        const _temp9 = function () {
          if (iUpdatedDragItemIndex !== iUpdatedDropItemIndex) {
            const aUpdatedCards = _this14.cardHelperInstance.handleDndCardsRanking(iUpdatedDragItemIndex, iUpdatedDropItemIndex, aUserAllCards);
            return Promise.resolve(_this14.cardHelperInstance._updateMultipleCards(aUpdatedCards, "PUT")).then(function () {
              _this14._sortCardsOnRank(aUserAllCards);
              _this14._controlModel.setProperty("/userAllCards", aUserAllCards);
              _this14._controlModel.setProperty("/userVisibleCards", aUserAllCards.filter(oCard => oCard.visibility));
              return Promise.resolve(_this14.rerenderCards()).then(function () {});
            });
          } else {
            _this14.cardsContainer?.setBusy(false);
          }
        }();
        return Promise.resolve(_temp9 && _temp9.then ? _temp9.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    _sortCardsOnRank: function _sortCardsOnRank(aCards) {
      // Sort Cards based on it rank property where rank is a alphanumeric string
      aCards.sort((a, b) => {
        if (a.rank && b.rank) {
          if (a.rank < b.rank) {
            return -1;
          } else if (a.rank > b.rank) {
            return 1;
          }
        }
        return 0;
      });
    },
    _getPersonalization: function _getPersonalization() {
      const persContainerId = PersonalisationUtils.getPersContainerId(this);
      const ownerComponent = PersonalisationUtils.getOwnerComponent(this);
      return UShellPersonalizer.getInstance(persContainerId, ownerComponent);
    },
    /**
     * Updates the recommendation status based on the feature toggle.
     * @returns {Promise} A promise that resolves when the recommendation status is updated.
     */
    _updateRecommendationStatus: function _updateRecommendationStatus() {
      try {
        const _this15 = this;
        return Promise.resolve(_this15.appManagerInstance.isFeatureEnabled(FEATURE_TOGGLES.RECOMMENDATION)).then(function (bRecommendationEnabled) {
          return function () {
            if (bRecommendationEnabled) {
              function _temp11() {
                return Promise.resolve(_this15.oPersonalizer.read()).then(function (oPersData) {
                  if (!oPersData) {
                    oPersData = {};
                  }
                  oPersData.showRecommendation = true;
                  return _this15.oPersonalizer.write(oPersData);
                });
              }
              const _temp10 = function () {
                if (!_this15.oPersonalizer) {
                  return Promise.resolve(_this15._getPersonalization()).then(function (_this15$_getPersonali) {
                    _this15.oPersonalizer = _this15$_getPersonali;
                  });
                }
              }();
              return _temp10 && _temp10.then ? _temp10.then(_temp11) : _temp11(_temp10);
            }
          }();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Calculates the number of visible cards that can fit within the available width of the parent container.
     *
     * @private
     * @returns {number} - The number of visible cards.
     */
    _calculateVisibleCardCount: function _calculateVisibleCardCount() {
      const pageDomRef = this.getParent()._getLayout().getDomRef();
      const deviceType = this.getDeviceType();
      let count = 1;
      if (pageDomRef) {
        const sectionDomRef = pageDomRef.childNodes[0];
        const domProperties = fetchElementProperties(sectionDomRef, ["width", "padding-left", "padding-right"]);
        const iAvailableWidth = domProperties.width - domProperties["padding-left"] - domProperties["padding-right"];
        let cardWidth = deviceType === DeviceType.Mobile ? 17 : this._calculateCardWidth(iAvailableWidth);

        // Calculate and log the number of cards that can fit
        count = deviceType === DeviceType.Mobile ? this.aVisibleCardInstances.length : Math.floor(iAvailableWidth / (cardWidth * 16 + 14));
        this.cardWidth = `${cardWidth}rem`;
      }
      return count;
    },
    /**
     * Calculates the optimal card width based on the given container width.
     *
     * @param {number} containerWidth - The width of the container in which the cards will be placed.
     * @returns {number} - The calculated card width in rem units.
     */
    _calculateCardWidth: function _calculateCardWidth(containerWidth) {
      const minWidth = 304;
      const maxWidth = 352;
      const margin = 14;
      let count = 1;
      let cardWidth = minWidth;

      //calculate the maximum number of cards that can fit in the container within the range of min and max width
      while (containerWidth / count >= minWidth + margin) {
        cardWidth = containerWidth / count;
        count += 1;
      }
      cardWidth -= margin;
      cardWidth = cardWidth > maxWidth ? maxWidth : cardWidth;
      return cardWidth / 16;
    },
    /**
     * Adjusts the layout of the cards panel based on the current layout and device type.
     *
     * @private
     * @override
     */
    _adjustLayout: function _adjustLayout() {
      const layout = this.getParent()?._getLayout();
      const isFullScreenEnabled = this.getProperty("enableFullScreen");
      let cardWidth = this.cardWidth;
      if (layout && isFullScreenEnabled) {
        const isElementExpanded = layout._getCurrentExpandedElementName() === this.getProperty("fullScreenName");
        const cardCount = isElementExpanded ? this.aVisibleCardInstances.length : this._calculateVisibleCardCount();

        // update cards in viewport
        if (cardCount !== this.cardsInViewport.length) {
          this.cardsInViewport = this.aVisibleCardInstances.slice(0, cardCount);
          const sDefaultAggreName = this.cardsContainer.getMetadata().getDefaultAggregationName();
          this.cardsContainer.removeAllAggregation(sDefaultAggreName);
          this.cardsInViewport.forEach(card => {
            const manifest = card.getManifest();
            const sType = manifest["sap.card"]?.type;
            let overlayHBoxWrapper;
            if (sType === "Table" || sType === "List") {
              const overlay = new HBox({
                width: this.cardWidth,
                height: "2rem"
              }).addStyleClass("insightsCardOverflowLayer insightsCardOverflowTop");
              overlayHBoxWrapper = new HBox({
                height: "0"
              }).addStyleClass("sapMFlexBoxJustifyCenter");
              overlayHBoxWrapper.addItem(overlay);
            }
            const cardWrapper = new VBox({
              direction: "Column",
              justifyContent: "Center",
              items: [card]
            });
            if (overlayHBoxWrapper) {
              cardWrapper.addItem(overlayHBoxWrapper);
            }
            const sDefaultAggreName = this.cardsContainer.getMetadata().getDefaultAggregationName();
            this.cardsContainer.addAggregation(sDefaultAggreName, cardWrapper);
          });
        }

        // show/hide Full Screen Button if available
        this.getParent()?.toggleFullScreenElements(this, this.aVisibleCardInstances.length > cardCount, isElementExpanded);
      } else {
        this.cardWidth = this.getDeviceType() === DeviceType.Mobile ? "17rem" : "22rem";
      }

      // update width of cards on resize
      if (cardWidth !== this.cardWidth) {
        this.aVisibleCardInstances.forEach(card => card.setWidth(this.cardWidth));
        this.cardsContainerSettings?.setColumnSize(this.cardWidth);
      }
    }
  });
  CardsPanel.cardsMenuItems = cardsMenuItems;
  return CardsPanel;
});
//# sourceMappingURL=CardsPanel-dbg-dbg.js.map
