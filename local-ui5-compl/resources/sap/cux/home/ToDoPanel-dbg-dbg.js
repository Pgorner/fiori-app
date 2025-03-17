/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/base/Log", "sap/f/Card", "sap/f/GridContainer", "sap/f/GridContainerSettings", "sap/m/Button", "sap/m/GenericTile", "sap/m/HeaderContainer", "sap/m/IllustratedMessage", "sap/m/Text", "sap/m/TileContent", "sap/m/VBox", "sap/m/library", "sap/ui/Device", "sap/ui/core/Element", "sap/ui/core/format/DateFormat", "sap/ui/model/json/JSONModel", "./BasePanel", "./MenuItem", "./ToDosContainer", "./utils/BatchHelper", "./utils/Device", "./utils/FESRUtil"], function (Log, Card, GridContainer, GridContainerSettings, Button, GenericTile, HeaderContainer, IllustratedMessage, Text, TileContent, VBox, sap_m_library, Device, UI5Element, DateFormat, JSONModel, __BasePanel, __MenuItem, __ToDosContainer, __BatchHelper, ___utils_Device, ___utils_FESRUtil) {
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
  const Priority = sap_m_library["Priority"];
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
  const URLHelper = sap_m_library["URLHelper"];
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
  const BasePanel = _interopRequireDefault(__BasePanel);
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
  const MenuItem = _interopRequireDefault(__MenuItem);
  const ToDosContainer = _interopRequireDefault(__ToDosContainer);
  const BatchHelper = _interopRequireDefault(__BatchHelper);
  const DeviceType = ___utils_Device["DeviceType"];
  const fetchElementProperties = ___utils_Device["fetchElementProperties"];
  const addFESRId = ___utils_FESRUtil["addFESRId"];
  var TaskPriority = /*#__PURE__*/function (TaskPriority) {
    TaskPriority["VERY_HIGH"] = "VERY_HIGH";
    TaskPriority["HIGH"] = "HIGH";
    TaskPriority["MEDIUM"] = "MEDIUM";
    TaskPriority["LOW"] = "LOW";
    return TaskPriority;
  }(TaskPriority || {});
  const Constants = {
    SITUATION_ICON: "sap-icon://message-warning",
    PLACEHOLDER_ITEMS_COUNT: 5,
    TODO_CARDS_LIMIT: 100,
    TODO_SECTION_LIMIT: 6,
    TODOS_REFRESH_INTERVAL: 65000,
    MOBILE_DEVICE_MAX_WIDTH: 600,
    DEFAULT_TITLE_HEIGHT: 33,
    DEFAULT_CARD_HEIGHT: 168,
    DEFAULT_TAB_HEADER_HEIGHT: 44
  };

  /**
   * Calculates the card width based on the available width and certain constraints.
   *
   * @param {number} availableWidth - The available width for card rendering.
   * @returns {number} The calculated card width within specified constraints.
   */
  function calculateCardWidth(availableWidth) {
    const minWidth = 320;
    const maxWidth = 400;
    const gap = 14.5;
    let count = 1;
    let cardWidth = minWidth;
    while (availableWidth / count >= minWidth + gap) {
      cardWidth = availableWidth / count;
      count += 1;
    }
    return Math.min(cardWidth - gap, maxWidth);
  }

  /**
   *
   * Abstract Panel class for managing and storing To-Do cards.
   *
   * @extends BasePanel
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.121
   *
   * @abstract
   * @internal
   * @experimental Since 1.121
   * @public
   *
   * @alias sap.cux.home.ToDoPanel
   */
  const ToDoPanel = BasePanel.extend("sap.cux.home.ToDoPanel", {
    metadata: {
      library: "sap.cux.home",
      properties: {
        /**
         * Specifies the base URL for batching requests sent from the panel.
         *
         * @public
         */
        baseUrl: {
          type: "string",
          group: "Misc",
          defaultValue: "",
          visibility: "public"
        },
        /**
         * Specifies the URL for fetching the count of requested to-do cards.
         *
         * @public
         */
        countUrl: {
          type: "string",
          group: "Misc",
          defaultValue: "",
          visibility: "public"
        },
        /**
         * Specifies the URL from where the to-do cards should be fetched.
         *
         * @public
         */
        dataUrl: {
          type: "string",
          group: "Misc",
          defaultValue: "",
          visibility: "public"
        },
        /**
         * Specifies the URL of the target application associated with the to-do cards.
         *
         * @public
         */
        targetAppUrl: {
          type: "string",
          group: "Misc",
          defaultValue: "",
          visibility: "public"
        }
      }
    },
    /**
     * Constructor for a new To-Dos Panel.
     *
     * @param {string} [id] ID for the new control, generated automatically if an ID is not provided
     * @param {object} [settings] Initial settings for the new control
     */
    constructor: function _constructor(id, settings) {
      BasePanel.prototype.constructor.call(this, id, settings);
    },
    /**
     * Init lifecycle method
     *
     * @private
     * @override
     */
    init: function _init() {
      const _this = this;
      BasePanel.prototype.init.call(this);

      //Initialise ToDos Model
      this._oData = {
        length: 0,
        isLoaded: false,
        hasError: false,
        cardWidth: "20rem",
        getSupported: false,
        isExpandedOnce: false,
        isCountCalledOnce: false,
        illustrationType: "sapIllus-NoTasks",
        refreshInfo: this._toRelativeDateTime(new Date()),
        horizontalCardCount: Constants.PLACEHOLDER_ITEMS_COUNT,
        illustrationTitle: this._i18nBundle.getText("noToDoTitle"),
        illustrationDescription: this._i18nBundle.getText("noToDoDesc"),
        isPhone: Device.resize.width < Constants.MOBILE_DEVICE_MAX_WIDTH || Device.system.phone,
        tiles: new Array(Constants.PLACEHOLDER_ITEMS_COUNT).fill({
          status: "Loading"
        }),
        displayTiles: new Array(Constants.PLACEHOLDER_ITEMS_COUNT).fill({
          status: "Loading"
        })
      };
      this._controlModel = new JSONModel(this._oData);

      //Initialize Request Queue
      this.requests = [];

      //Add Wrapper Container to Panel
      this._toDoWrapper = new VBox(`${this.getId()}-toDosWrapper`, {
        renderType: "Bare",
        items: [this._generateCardContainer(), this._generateMobileCardContainer(), this._generateErrorMessage()]
      });
      this._toDoWrapper.setModel(this._controlModel);
      this._addContent(this._toDoWrapper);

      //Setup Common Menu Items
      const menuItem = new MenuItem(`${this.getId()}-refresh`, {
        title: this._i18nBundle.getText("refresh"),
        icon: "sap-icon://refresh",
        press: () => this._onPressRefresh()
      });
      this.addAggregation("menuItems", menuItem);
      addFESRId(menuItem, "todosRefresh");

      //Setup Common Action Buttons
      this._refreshBtn = new Button(`${this.getId()}-refreshBtn`, {
        icon: "sap-icon://refresh",
        text: this._toRelativeDateTime(new Date()),
        press: () => this._onPressRefresh()
      });
      addFESRId(this._refreshBtn, "manualTodoRefresh");
      this.addAggregation("actionButtons", this._refreshBtn);

      //Configure Full Screen and Expand Event handlers
      this.setProperty("enableFullScreen", true);
      this.attachEvent("onExpand", function () {
        try {
          return Promise.resolve(_this._beforePanelExpand()).then(function () {});
        } catch (e) {
          return Promise.reject(e);
        }
      });
    },
    /**
     * Generates the card container (GridContainer) for displaying cards.
     *
     * @private
     * @returns {GridContainer} The generated card container.
     */
    _generateCardContainer: function _generateCardContainer() {
      //create container
      if (!this._cardContainer) {
        this._cardContainer = new GridContainer(`${this.getId()}-flexContainer`, {
          inlineBlockLayout: true,
          snapToRow: true,
          visible: "{= !${/isPhone} && !${/hasError} && (!${/isLoaded} || ${/length} > 0) }",
          layout: new GridContainerSettings(`${this.getId()}-layout`, {
            columns: "{/horizontalCardCount}",
            columnSize: "{/cardWidth}",
            gap: "1rem"
          })
        }).addStyleClass("sapCuxToDoCardsContainer");
      }
      return this._cardContainer;
    },
    /**
     * Generates the mobile card container (HeaderContainer) for displaying cards on mobile devices.
     *
     * @private
     * @returns {HeaderContainer} The generated mobile card container.
     */
    _generateMobileCardContainer: function _generateMobileCardContainer() {
      // Create a HeaderContainer for mobile devices
      if (!this._mobileCardContainer) {
        this._mobileCardContainer = new HeaderContainer(`${this.getId()}-headerContainer`, {
          visible: "{/isPhone}",
          scrollStep: 0,
          gridLayout: true,
          scrollTime: 1000,
          showDividers: false
        });
        this._mobileCardContainer.addStyleClass("sapMHeaderContainerAlign sapMHeaderContainerToDoAlign toDoCardHeight");
      }
      return this._mobileCardContainer;
    },
    /**
     * Generates the error message card for displaying error messages.
     *
     * @private
     * @returns {Card} The generated error message card.
     */
    _generateErrorMessage: function _generateErrorMessage() {
      if (!this._errorCard) {
        this._errorMessage = new IllustratedMessage(`${this.getId()}-errorMessage`, {
          illustrationSize: "Base",
          title: "{/illustrationTitle}",
          description: "{/illustrationDescription}",
          illustrationType: "{/illustrationType}"
        });
        this._errorCard = new Card(`${this.getId()}-errorCard`, {
          content: this._errorMessage,
          visible: "{= ${/tiles/length} === 0 || ${/hasError} === true }"
        });
      }
      return this._errorCard;
    },
    /**
     * Handler for the Refresh button for each panel.
     * Reloads the selected panel
     *
     * @async
     * @private
     */
    _onPressRefresh: function _onPressRefresh() {
      void this.getParent()?._getSelectedPanel()?._loadCards(true);
    },
    /**
     * Loads the To-Do cards for the panel.
     *
     * @private
     * @param {boolean} forceRefresh - force refresh cards
     * @returns {Promise<void>} A promise that resolves when the cards are loaded.
     */
    _loadCards: function _loadCards(forceRefresh) {
      try {
        const _this2 = this;
        if (_this2._loadToDos !== undefined && !forceRefresh) {
          return Promise.resolve(_this2._loadToDos);
        } else {
          _this2._bindInnerControls();
          _this2._loadToDos = new Promise(resolve => {
            const selectedKey = _this2.getParent()?.getProperty("selectedKey");
            const requests = [];
            _this2._oData.isLoaded = false;
            _this2._oData.isCountCalledOnce = false;
            _this2._oData.isExpandedOnce = _this2._isElementExpanded();
            _this2._setCount();
            if (_this2._getSupported()) {
              setTimeout(() => {
                // Load Placeholder Cards
                _this2._generatePlaceHolderTiles();

                // Add Initial Batch Requests
                requests.push(_this2._generateRequestObject({
                  type: selectedKey,
                  onlyCount: selectedKey !== _this2.getProperty("key")
                }));
                _this2.requests = _this2.requests.concat(requests);

                //Submit Batch Requests
                _this2._submitBatch().then(function () {
                  try {
                    _this2._oData.isLoaded = selectedKey === _this2.getProperty("key");
                    _this2._oData.isCountCalledOnce = true;
                    _this2._setCount(_this2._oData.length);
                    _this2._setSectionRefreshInterval();
                    _this2._oData.refreshInfo = _this2._toRelativeDateTime(new Date());
                    _this2._oData.lastRefreshedTime = new Date();
                    _this2._updateRefreshInformation();
                    return Promise.resolve(_this2._switchTabIfRequired()).then(function () {
                      _this2._updateHeaderIfExclusive();
                    });
                  } catch (e) {
                    return Promise.reject(e);
                  }
                }).catch(error => {
                  Log.error(error instanceof Error ? error.message : "");
                }).finally(() => {
                  _this2._controlModel.refresh();
                  _this2._adjustLayout();
                  resolve();
                });
              });
            } else {
              _this2._handleError(`User not authorized to access: + ${_this2.getTargetAppUrl()}`);

              // Remove Item from IconTabBar
              _this2.getParent()?.removeContent(_this2);

              //resolve the promise
              resolve();
            }
          });
        }
        return Promise.resolve(_this2._loadToDos);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Update Container Header if the panel is exclusive
     *
     * @private
     */
    _updateHeaderIfExclusive: function _updateHeaderIfExclusive() {
      if (this._isExclusivePanel()) {
        this.getParent()._setTitle(`${this._i18nBundle.getText("toDosTitle")} (${String(this._oData.length)})`);
      }
    },
    /**
     * Creates a one-time binding of inner controls for the ToDoPanel.
     * @private
     */
    _bindInnerControls: function _bindInnerControls() {
      if (!this._innerControlsBound) {
        //bind card container
        this._cardContainer.bindAggregation("items", {
          path: "/displayTiles",
          length: Constants.TODO_CARDS_LIMIT,
          factory: (id, context) => this.generateCardTemplate(id, context)?.bindProperty?.("width", {
            path: "/cardWidth"
          })
        });

        //bind mobile card container
        this._mobileCardContainer.bindAggregation("content", {
          path: "/displayTiles",
          length: Constants.TODO_CARDS_LIMIT,
          factory: this.generateCardTemplate.bind(this)
        });
        this._innerControlsBound = true;
      }
    },
    /**
     * Generate a default card template for the Current Panel.
     * An extended panel can have it's own template by overridding
     * this method and providing a custom card template.
     *
     * @public
     * @param {string} id The ID for the template.
     * @param {object} context The context for the template.
     * @returns {object} The generated card template.
     */
    generateCardTemplate: function _generateCardTemplate(id, context) {
      return new GenericTile(`${id}-tile`, {
        mode: "ActionMode",
        frameType: "TwoByOne",
        pressEnabled: true,
        header: context.getProperty("title"),
        width: context.getProperty("/cardWidth"),
        state: context.getProperty("status"),
        tileContent: [new TileContent(`${id}-tileContent`, {
          priority: context.getProperty("priority"),
          priorityText: this._toPriorityText(context.getProperty("priority")),
          footer: context.getProperty("footerText"),
          content: new Text(`${id}-situationContent`, {
            text: context.getProperty("message")
          })
        })]
      });
    },
    /**
     * Convert a priority string to a corresponding priority value.
     *
     * @private
     * @param {TaskPriority} priority - The task priority string.
     * @returns {string} The corresponding priority value.
     */
    _toPriority: function _toPriority(priority) {
      if (priority === TaskPriority.VERY_HIGH) {
        return Priority.VeryHigh ? Priority.VeryHigh : Priority.None;
      } else if (priority === TaskPriority.HIGH) {
        return Priority.High;
      } else if (priority === TaskPriority.MEDIUM) {
        return Priority.Medium;
      } else if (priority === TaskPriority.LOW) {
        return Priority.Low;
      } else {
        return Priority.None;
      }
    },
    /**
     * Convert a priority string to a corresponding priority text.
     *
     * @private
     * @param {Priority} priority - The priority string.
     * @returns {string} The corresponding priority text.
     */
    _toPriorityText: function _toPriorityText(priority) {
      let key;
      if (priority === Priority.VeryHigh) {
        key = "veryHighPriority";
      } else if (priority === Priority.High) {
        key = "highPriority";
      } else if (priority === Priority.Medium) {
        key = "mediumPriority";
      } else if (priority === Priority.Low) {
        key = "lowPriority";
      } else {
        key = "nonePriority";
      }
      return this._i18nBundle.getText(key);
    },
    /**
     * Generates placeholder tiles for the panel.
     *
     * @private
     */
    _generatePlaceHolderTiles: function _generatePlaceHolderTiles() {
      this._cardCount = this._getVisibleCardCount({
        isPlaceholder: true
      });
      this._oData.displayTiles = this._oData.tiles = new Array(this._cardCount).fill({
        status: "Loading"
      });
      this._oData.isLoaded = this._oData.hasError = false;
      this._controlModel.refresh();
    },
    /**
     * Calculates the number of visible cards that can fit within the available space of the To-Dos panel.
     *
     * @private
     * @param {CalculationProperties} [calculationProperties] - Optional properties to assist in the calculation.
     * @returns {number} - The number of visible cards.
     */
    _getVisibleCardCount: function _getVisibleCardCount(calculationProperties) {
      const layout = this.getParent()?._getLayout();
      let isElementExpanded = false;
      let targetDomRef = this._toDoWrapper?.getDomRef();
      if (layout) {
        isElementExpanded = this._isElementExpanded();
        const containerDomRef = (isElementExpanded ? layout._getFullScreenContainer() : layout).getDomRef();
        targetDomRef = containerDomRef?.childNodes[0];
      }
      const isMobileDevice = this._controlModel.getProperty("/isPhone");
      let cardCount = isMobileDevice ? Constants.TODO_SECTION_LIMIT : 1;
      if (targetDomRef && !isMobileDevice) {
        // @ts-expect-error Calculate Horizontal Card Count
        cardCount = this.getHorizontalCardCount(targetDomRef, calculationProperties);
        if (isElementExpanded) {
          // @ts-expect-error Calculate Vertical Card Count
          cardCount *= this.getVerticalCardCount(targetDomRef, calculationProperties);
        }

        //Restrict cards to the maximum limit
        cardCount = cardCount > Constants.TODO_CARDS_LIMIT ? Constants.TODO_CARDS_LIMIT : cardCount;
      }
      return cardCount;
    },
    /**
     * Checks if the current element is expanded to full screen.
     *
     * @private
     * @returns {boolean} - True if the element is expanded, otherwise false.
     */
    _isElementExpanded: function _isElementExpanded() {
      const toDosContainer = this.getParent();
      const layout = toDosContainer._getLayout();
      return layout?._getCurrentExpandedElementName() === toDosContainer.getProperty("fullScreenName");
    },
    /**
     * Calculates the number of horizontal cards that can fit within the available width of the given DOM element.
     *
     * @private
     * @param {Element} domRef - The DOM element to calculate the horizontal card count for.
     * @returns {number} - The number of horizontal cards that can fit within the available width.
     */
    getHorizontalCardCount: function _getHorizontalCardCount(domRef) {
      const domProperties = fetchElementProperties(domRef, ["width", "padding-left", "padding-right", "margin-left", "margin-right"]);
      const availableWidth = Object.values(domProperties).slice(1).reduce((width, propertyValue) => width - propertyValue, domProperties["width"]);
      const cardWidth = calculateCardWidth(availableWidth);

      // Calculate Horizontal Card Count
      let horizontalCardCount = Math.max(Math.floor(availableWidth / cardWidth), 1);
      this._controlModel.setProperty("/cardWidth", `${cardWidth / 16}rem`);
      this._controlModel.setProperty("/horizontalCardCount", horizontalCardCount);
      return horizontalCardCount;
    },
    /**
     * Calculates the number of vertical cards that can fit within the available height of the given DOM element.
     *
     * @private
     * @param {Element} domRef - The DOM element to calculate the vertical card count for.
     * @returns {number} - The number of vertical cards that can fit within the available height.
     */
    getVerticalCardCount: function _getVerticalCardCount(domRef) {
      const domProperties = fetchElementProperties(domRef, ["height", "padding-top"]);
      const titleHeight = this.calculateTitleHeight();
      const availableHeight = domProperties.height - domProperties["padding-top"] * 2 - titleHeight;
      const margin = 14;
      const cardHeight = Constants.DEFAULT_CARD_HEIGHT + margin;
      const verticalCardCount = Math.max(Math.floor(availableHeight / cardHeight), 2); //minimum of 2 rows should be displayed

      return verticalCardCount;
    },
    /**
     * Calculates the combined height of the title and tab header for the To-Dos panel.
     *
     * @private
     * @returns {number} - The combined height of the title and tab header.
     */
    calculateTitleHeight: function _calculateTitleHeight() {
      const container = this.getParent();
      const containerHeaderRef = UI5Element.getElementById(`${container.getId()}-header`)?.getDomRef();
      const iconTabBarHeaderRef = UI5Element.getElementById(`${container._getInnerControl().getId()}--header`)?.getDomRef();
      const defaultHeight = Constants.DEFAULT_TITLE_HEIGHT + Constants.DEFAULT_TAB_HEADER_HEIGHT;
      let titleHeight = 0;
      if (containerHeaderRef && iconTabBarHeaderRef) {
        titleHeight = containerHeaderRef.clientHeight + iconTabBarHeaderRef.clientHeight;
      }
      return Math.max(titleHeight, defaultHeight);
    },
    /**
     * Generates a request object for batch requests.
     *
     * @private
     * @param {RequestOptions} options - Additional properties for generating the request object.
     * @param {boolean} [options.onlyCount] - Whether to include only the count in the request.
     * @returns {Object} The generated request object.
     */
    _generateRequestObject: function _generateRequestObject(options) {
      const _this3 = this;
      const cardCount = this._getVisibleCardCount();
      const urls = this.generateRequestUrls?.(cardCount);
      if (options?.onlyCount) {
        urls.splice(1);
      }
      return {
        baseURL: this.getBaseUrl(),
        requestURLs: urls,
        success: function (args) {
          try {
            //data process extension for panels
            return Promise.resolve(_this3.onDataReceived(args.splice(1), options)).then(function () {
              //set card count and handle empty cards
              _this3._oData.length = Number(args[0]);
              _this3._handleEmptyCards();
            });
          } catch (e) {
            return Promise.reject(e);
          }
        }
      };
    },
    /**
     * Generates request URLs for fetching data based on the specified card count.
     *
     * @private
     * @param {number} cardCount - The number of cards to retrieve.
     * @returns {string[]} An array of request URLs.
     */
    generateRequestUrls: function _generateRequestUrls(cardCount) {
      const queryString = `$skip=0&$top=${cardCount}`;
      let dataUrl = this.getDataUrl();
      dataUrl = dataUrl.includes("?") ? `${dataUrl}&${queryString}` : `${dataUrl}?${queryString}`;
      return [this.getCountUrl(), dataUrl];
    },
    /**
     * Hook for processing data fetched from a batch call.
     * This method can be overridden to perform additional data processing operations.
     *
     * @private
     * @async
     * @param {unknown[]} results - Data retrieved from the batch call.
     * @param {RequestOptions} options - Additional options for parsing the data.
     * Structure may vary based on the backend service.
     */
    onDataReceived: function _onDataReceived() {
      let results = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      let options = arguments.length > 1 ? arguments[1] : undefined;
      try {
        const _this4 = this;
        if (!options || options && !options.onlyCount) {
          _this4._oData.displayTiles = _this4._oData.tiles = results[0] || [];
        }
        return Promise.resolve(Promise.resolve()).then(function () {});
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Handles the scenario when there are no cards to display.
     * Updates the illustration and description based on the selected panel and card count.
     *
     * @private
     */
    _handleEmptyCards: function _handleEmptyCards() {
      if (Number(this._oData.length) === 0) {
        this._oData.illustrationType = "sapIllus-EmptyPlanningCalendar";
        this._oData.illustrationTitle = this._isExclusivePanel() ? this._i18nBundle.getText("noToDoTitle") : this._i18nBundle.getText(this.getNoDataText());
        this._oData.illustrationDescription = this._isExclusivePanel() ? this._i18nBundle.getText("noToDoDesc") : this._i18nBundle.getText("emptyToDoDesc");
      }
    },
    /**
     * Checks if the panel is exclusive based on support and the number of panels.
     *
     * @private
     * @returns {boolean} True if the panel is exclusive, otherwise false.
     */
    _isExclusivePanel: function _isExclusivePanel() {
      const allPanels = this.getParent().getContent();
      const supportedPanels = allPanels.filter(panel => panel._getSupported());
      return supportedPanels.length === 1 || allPanels.length === 1 && this._getSupported();
    },
    /**
     * Sets the interval for refreshing the section.
     *
     * @private
     */
    _setSectionRefreshInterval: function _setSectionRefreshInterval() {
      clearInterval(this._oData.refreshFn);
      this._oData.refreshFn = setInterval(() => {
        this._oData.lastRefreshedTime = this._oData.lastRefreshedTime || new Date();
        this._oData.refreshInfo = this._toRelativeDateTime(this._oData.lastRefreshedTime);
        this._updateRefreshInformation();
      }, Constants.TODOS_REFRESH_INTERVAL);
    },
    /**
     * Updates the refresh information and adjusts the layout.
     *
     * @private
     */
    _updateRefreshInformation: function _updateRefreshInformation() {
      const container = this.getParent();
      if (container.getProperty("selectedKey") === this.getProperty("key")) {
        this._refreshBtn.setProperty("text", this._oData.refreshInfo, true);
        container._updateContainerHeader(this);
      }
      this._adjustLayout();
    },
    /**
     * Adjusts the layout based on card count and device type.
     *
     * @private
     */
    _adjustLayout: function _adjustLayout() {
      // Update visible cards
      const cardCount = this._getVisibleCardCount();
      if (this._oData.tiles.length && !this._oData.hasError) {
        const displayCards = this._oData.tiles.slice(0, cardCount);
        this._controlModel.setProperty("/displayTiles", displayCards);
      }

      // Update if device type is phone
      this._controlModel.setProperty("/isPhone", this.getDeviceType() === DeviceType.Mobile);

      // Show/Hide Full Screen Button if available
      this.getParent()?.toggleFullScreenElements(this, Number(this._oData.length) > cardCount, this._isElementExpanded());
    },
    /**
     * Formats the given date to a relative date.
     *
     * @private
     * @param {Date} date Date object or Date String
     * @returns {string} Formatted Date
     */
    _toRelativeDateTime: function _toRelativeDateTime(date) {
      const inputDate = new Date(date);
      return isNaN(Number(inputDate)) ? "" : ToDoPanel.relativeDateFormatter.format(inputDate);
    },
    /**
     * Get the text for the "No Data" message.
     *
     * @private
     * @returns {string} The text for the "No Data" message.
     */
    getNoDataText: function _getNoDataText() {
      return this._i18nBundle.getText("noData");
    },
    /**
     * Parses the response object and returns the appropriate value.
     *
     * @private
     * @param {Object} response - The response object.
     * @param {Object} [response.d] - The 'd' property of the response object.
     * @param {Array} [response.d.results] - The results array.
     * @param {string|number} [response.d] - The 'd' property of the response object which may contain a numeric value.
     * @param {string|number} [response] - The response object which may contain a numeric value.
     * @param {string|number} [response.value] - The 'value' property of the response object which may contain a numeric value.
     * @returns {Response} - The parsed value extracted from the response object.
     */
    _parseResponse: function _parseResponse(response) {
      const {
        d = {},
        value
      } = response || {};
      const results = d?.results;
      const numericD = !isNaN(+d) && +d;
      const numericResponse = !isNaN(+response) && +response;
      return results || numericD || numericResponse || value || 0;
    },
    /**
     * Submits a batch request for multiple URLs and processes the responses.
     *
     * @private
     * @returns {Promise} A Promise that resolves when all batch requests are completed.
     */
    _submitBatch: function _submitBatch() {
      const _this5 = this;
      return Promise.all(this.requests.map(function (request) {
        try {
          return Promise.resolve(_finallyRethrows(function () {
            return _catch(function () {
              return Promise.resolve(BatchHelper.createMultipartRequest(request.baseURL, request.requestURLs)).then(function (responses) {
                if (responses.length) {
                  const processedResponses = responses.map(response => {
                    if (typeof response === "string") {
                      response = JSON.parse(response);
                    }
                    return _this5._parseResponse(response);
                  });

                  // Call success callback, if any
                  const _temp = function () {
                    if (request.success && typeof request.success === "function") {
                      return Promise.resolve(request.success(processedResponses)).then(function () {});
                    }
                  }();
                  return _temp && _temp.then ? _temp.then(function () {
                    return processedResponses;
                  }) : processedResponses;
                } else {
                  throw new Error("Invalid response");
                }
              });
            }, function (error) {
              _this5._handleError(error);
            });
          }, function (_wasThrown, _result) {
            _this5._clearRequests();
            if (_wasThrown) throw _result;
            return _result;
          }));
        } catch (e) {
          return Promise.reject(e);
        }
      }));
    },
    /**
     * Handles errors by updating the data and logging the error.
     *
     * @private
     * @param {Error} error - The error object to handle.
     */
    _handleError: function _handleError(error) {
      this._oData.displayTiles = this._oData.tiles = [];
      this._oData.getSupported = this._oData.isLoaded = this._oData.hasError = true;
      this._oData.illustrationType = "sapIllus-UnableToLoad";
      this._oData.illustrationTitle = this._oData.illustrationDescription = "";
      Log.error(error);
      this._controlModel.refresh();
    },
    /**
     * Clears the list of requests.
     *
     * @private
     */
    _clearRequests: function _clearRequests() {
      this.requests = [];
    },
    /**
     * Checks if the panel is loaded.
     *
     * @private
     * @returns {boolean} true if the panel is loaded, false otherwise.
     */
    _isLoaded: function _isLoaded() {
      return this._oData.isLoaded;
    },
    /**
     * Set the loaded status of the ToDoPanel.
     *
     * @private
     * @param {boolean} isLoaded - The new loaded status to set for the ToDoPanel.
     */
    _setLoaded: function _setLoaded(isLoaded) {
      this._oData.isLoaded = isLoaded;
    },
    /**
     * Gets the supported status of the panel.
     *
     * @private
     * @returns {boolean} The supported status of the panel.
     */
    _getSupported: function _getSupported() {
      return this._oData.getSupported;
    },
    /**
     * Sets the supported status of the panel.
     *
     * @private
     * @param {boolean} value - The value to set for supported status.
     */
    _setSupported: function _setSupported(isSupported) {
      this._oData.getSupported = isSupported;
    },
    /**
     * Extracts the app intent from the target app URL.
     *
     * @private
     * @returns {Intent | null} The app intent object with target and parameters, or null if not found.
     */
    _getAppIntent: function _getAppIntent() {
      const pattern = /#([^?-]+)-([^?#]+)(?:\?([^#]+))?(?:#.*)?/;
      const match = this.getTargetAppUrl().match(pattern);
      if (match) {
        const target = {
          semanticObject: match[1],
          action: match[2]
        };
        const params = {};
        if (match[3]) {
          const paramsArray = match[3].split("&");
          for (const param of paramsArray) {
            const [key, value] = param.split("=");
            params[key] = value;
          }
        }
        return {
          target,
          params
        };
      } else {
        return null;
      }
    },
    /**
     * Switch to available tab if current panel has empty cards or has error
     *
     * @private
     * @async
     */
    _switchTabIfRequired: function _switchTabIfRequired() {
      try {
        const _this6 = this;
        const container = _this6.getParent();
        const selectedKey = container?.getProperty("selectedKey");
        return Promise.resolve(function () {
          if (selectedKey === _this6.getProperty("key") && (_this6._oData.length === 0 || _this6._oData.hasError)) {
            let _interrupt = false;
            function _temp5() {
              const _temp3 = function () {
                if (nextAvailablePanel) {
                  container?.setProperty("selectedKey", nextAvailablePanel.getProperty("key"));
                  ToDosContainer.cardCount = _this6._cardCount;
                  return Promise.resolve(nextAvailablePanel._loadCards(true)).then(function () {
                    ToDosContainer.cardCount = undefined;
                  });
                }
              }();
              if (_temp3 && _temp3.then) return _temp3.then(function () {});
            }
            let nextAvailablePanel;
            const panels = container?.getAggregation("content");
            const _temp4 = _forOf(panels, function (panel) {
              const _temp2 = function () {
                if (panel !== _this6) {
                  //ensure that panel is loaded first
                  return Promise.resolve(panel._loadCards()).then(function () {
                    if (panel._getSupported() && !panel._isLoaded() && panel._getCardCount() > 0) {
                      nextAvailablePanel = panel;
                      _interrupt = true;
                    }
                  });
                }
              }();
              if (_temp2 && _temp2.then) return _temp2.then(function () {});
            }, function () {
              return _interrupt;
            });
            return _temp4 && _temp4.then ? _temp4.then(_temp5) : _temp5(_temp4);
          }
        }());
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Handles the press event to view all items.
     *
     * @private
     */
    _onPressViewAll: function _onPressViewAll() {
      URLHelper.redirect(this.getTargetAppUrl(), false);
    },
    /**
     * Retrieves the count of cards in the panel.
     *
     * @private
     * @returns {number} The number of cards.
     */
    _getCardCount: function _getCardCount() {
      return Number(this._oData.length);
    },
    /**
     * Handles actions to be performed before the To-Dos panel is expanded.
     * If the panel has not been expanded before in full screen, the cards will be loaded once.
     *
     * @private
     */
    _beforePanelExpand: function _beforePanelExpand() {
      try {
        const _this7 = this;
        const _temp6 = function () {
          if (!_this7._oData.isExpandedOnce) {
            _this7._oData.isExpandedOnce = true;
            return Promise.resolve(_this7._loadCards(true)).then(function () {});
          }
        }();
        return Promise.resolve(_temp6 && _temp6.then ? _temp6.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    }
  });
  ToDoPanel.relativeDateFormatter = DateFormat.getDateTimeInstance({
    style: "medium",
    relative: true,
    relativeStyle: "short"
  });
  ToDoPanel.TaskPriority = TaskPriority;
  return ToDoPanel;
});
//# sourceMappingURL=ToDoPanel-dbg-dbg.js.map
