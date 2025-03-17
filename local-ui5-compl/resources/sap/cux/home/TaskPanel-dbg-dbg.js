/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/base/Log", "sap/base/i18n/Formatting", "sap/m/ActionTile", "sap/m/ActionTileContent", "sap/m/Button", "sap/m/ContentConfig", "sap/m/Link", "sap/m/List", "sap/m/MessageBox", "sap/m/Popover", "sap/m/StandardListItem", "sap/m/TileAttribute", "sap/m/library", "sap/ui/core/Locale", "sap/ui/core/format/DateFormat", "sap/ui/core/format/NumberFormat", "./MenuItem", "./ToDoPanel", "./utils/DecisionDialog", "./utils/Device", "./utils/FESRUtil"], function (Log, Formatting, ActionTile, ActionTileContent, Button, ContentConfig, Link, List, MessageBox, Popover, StandardListItem, TileAttribute, sap_m_library, Locale, DateFormat, NumberFormat, __MenuItem, __ToDoPanel, __DecisionDialog, ___utils_Device, ___utils_FESRUtil) {
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
  const ButtonType = sap_m_library["ButtonType"];
  const ContentConfigType = sap_m_library["ContentConfigType"];
  const LoadState = sap_m_library["LoadState"];
  const PlacementType = sap_m_library["PlacementType"];
  const URLHelper = sap_m_library["URLHelper"];
  const MenuItem = _interopRequireDefault(__MenuItem);
  const ToDoPanel = _interopRequireDefault(__ToDoPanel);
  const DecisionDialog = _interopRequireDefault(__DecisionDialog);
  const getIconFrameBadge = __DecisionDialog["getIconFrameBadge"];
  const getIconFrameBadgeValueState = __DecisionDialog["getIconFrameBadgeValueState"];
  const fetchElementProperties = ___utils_Device["fetchElementProperties"];
  const addFESRId = ___utils_FESRUtil["addFESRId"];
  const addFESRSemanticStepName = ___utils_FESRUtil["addFESRSemanticStepName"];
  const FESR_EVENTS = ___utils_FESRUtil["FESR_EVENTS"];
  var Format = /*#__PURE__*/function (Format) {
    Format["CURRENCYVALUE"] = "CURRENCYVALUE";
    Format["CURRENCYCODE"] = "CURRENCYCODE";
    Format["USER"] = "USER";
    return Format;
  }(Format || {});
  var TextArrangement = /*#__PURE__*/function (TextArrangement) {
    TextArrangement["TextFirst"] = "TextFirst";
    TextArrangement["TextLast"] = "TextLast";
    TextArrangement["TextOnly"] = "TextOnly";
    TextArrangement["TextSeparate"] = "TextSeparate";
    return TextArrangement;
  }(TextArrangement || {});
  const Constants = {
    CARD_HEIGHT: {
      // Cozy - Compact
      1: 220,
      // 214  - 226
      2: 272,
      // 265  - 278
      3: 324,
      // 318  - 330
      4: 376 // 370  - 382
    }
  };

  /**
   * Splits an array of task cards into smaller arrays, each with a maximum specified length.
   *
   * @param {Task[]} cards - The array of task cards to be split.
   * @param {number} maxLength - The maximum length of each sub-array.
   * @returns {Task[][]} - An array of sub-arrays, each containing a maximum of `maxLength` task cards.
   */
  function splitCards(cards, maxLength) {
    const cardSet = [];
    for (let i = 0; i < cards.length; i += maxLength) {
      cardSet.push(cards.slice(i, i + maxLength));
    }
    return cardSet;
  }

  /**
   *
   * Panel class for managing and storing Task cards.
   *
   * @extends ToDoPanel
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.121
   *
   * @internal
   * @experimental Since 1.121
   * @public
   *
   * @alias sap.cux.home.TaskPanel
   */
  const TaskPanel = ToDoPanel.extend("sap.cux.home.TaskPanel", {
    metadata: {
      library: "sap.cux.home",
      properties: {
        /**
         * Specifies if actions should be enabled for the task cards.
         *
         * @public
         */
        enableActions: {
          type: "boolean",
          group: "Data",
          defaultValue: false,
          visibility: "public"
        },
        /**
         * Specifies the URL that fetches the custom attributes to be displayed along with the task cards.
         *
         * @public
         */
        customAttributeUrl: {
          type: "string",
          group: "Data",
          defaultValue: "",
          visibility: "public"
        }
      }
    },
    /**
     * Constructor for a new Task Panel.
     *
     * @param {string} [id] ID for the new control, generated automatically if an ID is not provided
     * @param {object} [settings] Initial settings for the new control
     */
    constructor: function _constructor(id, settings) {
      ToDoPanel.prototype.constructor.call(this, id, settings);
    },
    /**
     * Init lifecycle method
     *
     * @private
     * @override
     */
    init: function _init() {
      ToDoPanel.prototype.init.call(this);
      this._customAttributeMap = {};
      this._taskDefinitionMap = {};

      //Configure Header
      this.setProperty("key", "tasks");
      this.setProperty("title", this._i18nBundle.getText("tasksTabTitle"));

      //Setup Menu Items - ensure that 'View All Tasks' item is the first item in the list
      const menuItem = new MenuItem(`${this.getId()}-view-tasks-btn`, {
        title: this._i18nBundle.getText("viewAllTasksTitle"),
        icon: "sap-icon://inbox",
        press: this._onPressViewAll.bind(this)
      });
      this.insertAggregation("menuItems", menuItem, 0);
      addFESRId(menuItem, "goToTaskSitution");
    },
    /**
     * Generates request URLs for fetching data based on the specified card count.
     * Overridden method to provide task-specific URLs.
     *
     * @private
     * @override
     * @param {number} cardCount - The number of cards to retrieve.
     * @returns {string[]} An array of request URLs.
     */
    generateRequestUrls: function _generateRequestUrls(cardCount) {
      const urls = [this.getCountUrl(), `${this.getDataUrl()},CustomAttributeData&$expand=CustomAttributeData&$skip=0&$top=${cardCount}`];
      const customAttributeUrl = this.getCustomAttributeUrl();
      if (customAttributeUrl) {
        urls.push(customAttributeUrl);
      }
      return urls;
    },
    /**
     * Generates a card template for tasks.
     * Overridden method from To-Do panel to generate task-specific card template.
     *
     * @private
     * @override
     * @param {string} id The ID for the template card.
     * @param {Context} context The context object.
     * @returns {Control} The generated card control template.
     */
    generateCardTemplate: function _generateCardTemplate(id, context) {
      const attributes = context.getObject().attributes?.map((attribute, index) => {
        return new TileAttribute(`${id}-${index}-attribute`, {
          label: attribute.label,
          contentConfig: new ContentConfig(`${id}-${index}-contentConfig`, {
            type: attribute.type,
            text: attribute.text,
            href: attribute.href
          })
        });
      });
      return new ActionTile(`${id}-actionTile`, {
        mode: "ActionMode",
        frameType: "TwoByOne",
        pressEnabled: true,
        enableIconFrame: true,
        enableDynamicHeight: true,
        enableNavigationButton: true,
        headerImage: "sap-icon://workflow-tasks",
        badgeIcon: getIconFrameBadge(context.getProperty("Priority")),
        badgeValueState: getIconFrameBadgeValueState(context.getProperty("Priority")),
        header: context.getProperty("TaskTitle"),
        state: context.getProperty("status"),
        priority: this._toPriority(context.getProperty("Priority")),
        priorityText: this._toPriorityText(this._toPriority(context.getProperty("Priority"))),
        press: event => this._onPressTask(event),
        tileContent: [new ActionTileContent(`${id}-actionTileContent`, {
          headerLink: (() => {
            const createdByLink = new Link({
              text: context.getProperty("CreatedByName"),
              press: event => {
                void this._onClickCreatedBy(event);
              }
            });
            addFESRSemanticStepName(createdByLink, FESR_EVENTS.PRESS, "MST:ContactDetails");
            return createdByLink;
          })(),
          attributes
        })],
        actionButtons: [(() => {
          const viewButton = new Button(`${id}-view-btn`, {
            text: this._i18nBundle.getText("viewButton"),
            press: event => event.getSource().getParent().firePress(),
            visible: context.getProperty("actions/length") === 0
          });
          addFESRSemanticStepName(viewButton, FESR_EVENTS.PRESS, "todoActionBtn");
          return viewButton;
        })(), (() => {
          const approveButton = new Button(`${id}-approve-btn`, {
            text: context.getProperty("actions/0/text"),
            type: context.getProperty("actions/0/type"),
            press: () => this._onActionButtonPress(context.getProperty("actions/0/pressHandler")),
            visible: context.getProperty("actions/0") !== undefined
          }).addStyleClass("sapUiTinyMarginEnd");
          addFESRSemanticStepName(approveButton, FESR_EVENTS.PRESS, "todoActionBtn");
          return approveButton;
        })(), (() => {
          const rejectButton = new Button(`${id}-reject-btn`, {
            text: context.getProperty("actions/1/text"),
            type: context.getProperty("actions/1/type"),
            press: () => this._onActionButtonPress(context.getProperty("actions/1/pressHandler")),
            visible: context.getProperty("actions/1") !== undefined
          }).addStyleClass("sapUiTinyMarginEnd");
          addFESRSemanticStepName(rejectButton, FESR_EVENTS.PRESS, "todoActionBtn");
          return rejectButton;
        })(), (() => {
          const overflowButton = new Button(`${id}-overflow-btn`, {
            icon: "sap-icon://overflow",
            type: ButtonType.Transparent,
            press: event => this._onOverflowButtonPress(event, context),
            visible: context.getProperty("actions/length") >= 3
          });
          addFESRSemanticStepName(overflowButton, FESR_EVENTS.PRESS, "todoActBtnOverflow");
          return overflowButton;
        })()]
      });
    },
    /**
     * Handles the press event of the overflow button.
     * Opens a Popover containing overflow actions.
     *
     * @private
     * @param {Event} event - The press event triggered by the overflow button.
     * @param {Context} context - The context containing all actions.
     * @returns {void}
     */
    _onOverflowButtonPress: function _onOverflowButtonPress(event, context) {
      const overflowButtons = context.getProperty("actions").slice(2);
      this._getOverflowButtonPopover(overflowButtons).openBy(event.getSource());
    },
    /**
     * Creates or retrieves the overflow button Popover.
     *
     * @private
     * @param {ActionButton[]} actionButtons - The array of overflow actions.
     * @returns {Popover} The overflow button Popover.
     */
    _getOverflowButtonPopover: function _getOverflowButtonPopover(actionButtons) {
      if (!this._overflowPopover) {
        this._overflowList = new List(`${this.getId()}-overflowList`);
        this._overflowPopover = new Popover(`${this.getId()}-overflowPopover`, {
          showHeader: false,
          content: this._overflowList,
          placement: PlacementType.VerticalPreferredBottom
        });
      }

      //setup task-specific with task-specific actions
      this._setupOverflowList(actionButtons);
      return this._overflowPopover;
    },
    /**
     * Sets up the overflow button list with the provided task-specific actions.
     *
     * @private
     * @param {ActionButton[]} actionButtons - The array of overflow actions.
     * @returns {void}
     */
    _setupOverflowList: function _setupOverflowList(actionButtons) {
      this._overflowList.destroyItems();
      actionButtons.forEach((actionButton, index) => {
        const listItem = new StandardListItem(`action-${index}`, {
          title: actionButton.text,
          type: "Active",
          press: () => this._onActionButtonPress(actionButton.pressHandler)
        });
        addFESRSemanticStepName(listItem, FESR_EVENTS.PRESS, "todoActionBtn");
        this._overflowList.addItem(listItem);
      });
    },
    /**
     * Handles the button press event and executes the provided press handler function,
     * which refreshes the UI after the button press action.
     *
     * @private
     * @param {Function} pressHandler - The function to be executed when the button is pressed.
     * @returns {void}
     */
    _onActionButtonPress: function _onActionButtonPress(pressHandler) {
      pressHandler(this._loadCards.bind(this));
    },
    /**
     * Retrieves custom attributes for a given task and formats them for display.
     * If the task has completion deadline and creation date, those attributes are also included.
     * If the task has a creator, the creator's name is included as well.
     *
     * @param {Task} task - The task object for which custom attributes are retrieved.
     * @returns {CustomAttribute[]} - An array of formatted custom attributes.
     */
    _getCustomAttributes: function _getCustomAttributes(task) {
      const finalAttributes = [];
      const maximumAttributeCount = 4;
      const customAttributes = this._customAttributeMap[task.TaskDefinitionID] || [];
      for (let custom_attribute of customAttributes) {
        const customAttribute = custom_attribute;
        const taskCustomAttributes = task.CustomAttributeData?.results;
        const existingAttribute = taskCustomAttributes.find(taskAttribute => {
          return taskAttribute.Name === customAttribute.name;
        });
        let value = "";
        if (existingAttribute && !customAttribute.referenced) {
          const attribute = {
            label: customAttribute.label + ":",
            type: ContentConfigType.Text
          };
          if (customAttribute.format) {
            value = this._formatCustomAttribute(customAttribute, taskCustomAttributes);
          } else if (customAttribute.textArrangement) {
            value = this._arrangeText(existingAttribute, customAttribute.textArrangement);
          } else {
            value = customAttribute.type === "Edm.DateTime" ? this._formatDate(existingAttribute.Value) : existingAttribute.Value;
          }
          attribute.text = value || "-";
          finalAttributes.push(attribute);
        }
      }

      // add common attributes
      this._addCommonAttributes(finalAttributes, task);
      return finalAttributes.slice(0, maximumAttributeCount);
    },
    /**
     * Formats the given unit of measure value and description based on the specified text arrangement.
     *
     * @private
     * @param {TaskCustomAttribute} customAttribute The custom attribute object.
     * @param {TextArrangement} textArrangement The text arrangement option.
     * @returns {string} The formatted value.
     */
    _arrangeText: function _arrangeText(customAttribute, textArrangement) {
      const value = customAttribute.Value.trim();
      const description = customAttribute.ValueText.trim();
      let formattedValue = "";
      switch (textArrangement) {
        case TextArrangement.TextFirst:
          formattedValue = `${description} (${value})`;
          break;
        case TextArrangement.TextLast:
          formattedValue = `${value} (${description})`;
          break;
        case TextArrangement.TextOnly:
          formattedValue = `${description}`;
          break;
        case TextArrangement.TextSeparate:
          formattedValue = `${value}`;
          break;
        default:
          // TextFirst
          formattedValue = `${description} ${value})`;
          break;
      }
      return formattedValue;
    },
    /**
     * Formats a custom attribute value based on its format type.
     *
     * @param {CustomAttribute} customAttribute - The custom attribute object.
     * @param {TaskCustomAttribute[]} taskAttributes - The array of task attributes.
     * @returns {string} - The formatted value.
     */
    _formatCustomAttribute: function _formatCustomAttribute(customAttribute) {
      let taskAttributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      const findAttribute = attributeName => {
        return taskAttributes.find(oAttribute => {
          return oAttribute.Name === attributeName;
        });
      };
      const format = customAttribute.format?.toUpperCase();
      const currentAttribute = findAttribute(customAttribute.name);
      let formattedValue = currentAttribute?.Value;

      // Format = CurrencyValue
      if (format === Format.CURRENCYVALUE && customAttribute.reference) {
        const referencedAttribute = findAttribute(customAttribute.reference);
        if (referencedAttribute) {
          const currencyFormatter = NumberFormat.getCurrencyInstance();
          formattedValue = currencyFormatter.format(parseFloat(currentAttribute?.Value), referencedAttribute.Value);
        }
      } else if (format === Format.USER) {
        formattedValue = currentAttribute?.FormattedValue || currentAttribute?.Value;
      }
      return formattedValue;
    },
    /**
     * Adds common attributes to the final attributes list based on the provided task.
     * Common attributes include completion deadline, creation date, and creator's name.
     *
     * @param {CustomAttribute[]} finalAttributes - The array of custom attributes to which the common attributes will be added.
     * @param {Task} task - The task object containing data for common attributes.
     */
    _addCommonAttributes: function _addCommonAttributes(finalAttributes, task) {
      if (task.CompletionDeadline) {
        finalAttributes.push({
          label: this._i18nBundle.getText("dueDate") + ":",
          text: this._formatDate(task.CompletionDeadline, "MMM dd, YYYY hh:mm a"),
          type: ContentConfigType.Text
        });
      }
      if (task.CreatedOn) {
        finalAttributes.push({
          label: this._i18nBundle.getText("createdOn") + ":",
          text: this._formatDate(task.CreatedOn),
          type: ContentConfigType.Text
        });
      }
    },
    /**
     * Format a date string to a custom date and time format.
     *
     * @private
     * @param {string} dateStr - The date string to format.
     * @param {string} pattern - The pattern to be used for formatting the date.
     * @returns {string} The formatted date string.
     */
    _formatDate: function _formatDate(dateStr) {
      let pattern = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Formatting.getDatePattern("short") || "dd/MM/yyyy";
      const locale = new Locale(Formatting.getLanguageTag().language);
      const dateFormat = DateFormat.getDateTimeInstance({
        pattern
      }, locale);
      const value = this._getParsedTime(dateStr);
      let formattedDate = "";
      if (!isNaN(value)) {
        formattedDate = dateFormat.format(new Date(value));
      }
      return formattedDate;
    },
    /**
     * Parses different time formats supplied from the back-ends. It returns UNIX time stamp in milliseconds.
     * If Time Format contains unexpected symbols or Format is not recognized NaN is returned.
     * Referenced from: cross.fnd.fiori.inbox.CustomAttributeComparator
     *
     * @param {string | number} time date format to be parsed. If int UNIX time stamp in milliseconds is assumed.
     * @returns {number} UNIX time stamp in milliseconds. (milliseconds that have elapsed since 00:00:00 UTC, Thursday, 1 January 1970)
     * @private
     */
    _getParsedTime: function _getParsedTime(time) {
      if (time == null || time === "00000000") {
        return NaN;
      }
      if (typeof time === "number") {
        return time;
      }

      // Check for various time formats
      const dateRegex = /\/(Date)\((\d+)\)\//;
      const yyyymmddRegex = /^\d{8}$/;
      const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|([+-])(\d{2}):(\d{2}))?$/;
      const dateMatch = time.match(dateRegex);
      if (dateMatch) {
        // Time Format "/Date(869080830000)/"
        return parseInt(dateMatch[2], 10);
      }
      if (yyyymmddRegex.test(time) && this._isValidDate(time)) {
        // Time Format "YYYYMMDD" (Old TGW format)
        const parsedDate = DateFormat.getDateInstance().parse(time);
        return parsedDate instanceof Date ? parsedDate.getTime() : NaN;
      }
      const isoMatch = time.match(isoRegex);
      if (isoMatch) {
        // Time Format "2018-01-05T00:00:00" (BPM and TGW-cloud format, UTC)
        return new Date(time).getTime();
      }
      return NaN;
    },
    /**
     * Check whether given dateString is of format YYYYMMDD and is a valid value for Date object.
     *
     * @param {string} dateString - The datestring to be checked for validity
     * @returns {Date} if its a valid date return the date else false
     * @private
     */
    _isValidDate: function _isValidDate(dateString) {
      // Check if the input has the correct length
      if (dateString.length !== 8) {
        return false;
      }

      // Parse the date components
      const year = parseInt(dateString.slice(0, 4), 10);
      const month = parseInt(dateString.slice(4, 6), 10) - 1;
      const day = parseInt(dateString.slice(6), 10);

      // Create a Date object with the parsed components
      const date = new Date(year, month, day);

      // Check if the parsed date is valid
      return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;
    },
    /**
     * Handles the press event of a task.
     *
     * @private
     * @param {Event} event - The press event.
     */
    _onPressTask: function _onPressTask(event) {
      const control = event.getSource();
      const context = control.getBindingContext();
      const status = context?.getProperty("status");
      const url = this._getTaskUrl(context?.getProperty("SAP__Origin"), context?.getProperty("InstanceID"));
      if (!this._disableNavigation) {
        if (status !== LoadState.Loading) {
          URLHelper.redirect(url, false);
        }
      }
    },
    /**
     * Get the task URL for a given task.
     *
     * @private
     * @param {string} originId - The origin ID of the task.
     * @param {string} instanceId - The instance ID of the task.
     * @returns {string} The task URL.
     */
    _getTaskUrl: function _getTaskUrl(originId, instanceId) {
      const taskInstanceURL = `?showAdditionalAttributes=true&/detail/${originId}/${instanceId}/TaskCollection(SAP__Origin='${originId}',InstanceID='${instanceId}')`;
      return this.getTargetAppUrl() + taskInstanceURL;
    },
    /**
     * Handles the click event on the "Created By" link.
     * Triggers email or opens a contact card if configuration is enabled
     *
     * @private
     * @param {Event} event - The event object.
     */
    _onClickCreatedBy: function _onClickCreatedBy(event) {
      try {
        const _this = this;
        const sourceControl = event.getParameter("link");
        const {
          SAP__Origin: originId,
          CreatedBy: userId,
          TaskTitle: subject,
          CreatedByName: createdBy,
          InstanceID
        } = event.getSource().getBindingContext()?.getObject();
        const link = _this._getTaskUrl(originId, InstanceID);
        const triggerEmail = (email, _ref) => {
          let {
            subject,
            body
          } = _ref;
          URLHelper.triggerEmail(email, subject, body);
          setTimeout(() => {
            _this._disableNavigation = false;
          }, 0);
        };
        const url = new URL(window.location.href);
        url.hash = link;
        const body = url.toString();
        _this._disableNavigation = true;
        return Promise.resolve(_this._fetchUserDetailsIfRequired(originId, userId)).then(function (userData) {
          if (userData.Email) {
            sap.ui.require(["sap/suite/ui/commons/collaboration/ServiceContainer"], function (serviceContainer) {
              try {
                return Promise.resolve(serviceContainer.getServiceAsync()).then(function (teamsHelper) {
                  const _temp2 = function () {
                    if (teamsHelper.enableContactsCollaboration) {
                      const _temp = _catch(function () {
                        return Promise.resolve(teamsHelper.enableContactsCollaboration(userData.Email, {
                          subject,
                          body: encodeURIComponent(body)
                        })).then(function (_teamsHelper$enableCo) {
                          const popover = _teamsHelper$enableCo;
                          popover.openBy(sourceControl);
                        });
                      }, function (error) {
                        Log.error(error instanceof Error ? error.message : String(error));
                        triggerEmail(userData.Email, {
                          subject,
                          body
                        });
                      });
                      if (_temp && _temp.then) return _temp.then(function () {});
                    } else {
                      triggerEmail(userData.Email, {
                        subject,
                        body
                      });
                    }
                  }();
                  if (_temp2 && _temp2.then) return _temp2.then(function () {});
                });
              } catch (e) {
                return Promise.reject(e);
              }
            });
          } else {
            MessageBox.warning(_this._i18nBundle.getText("noEmail", [createdBy]));
            setTimeout(() => {
              _this._disableNavigation = false;
            }, 0);
          }
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Fetches user details if required.
     *
     * @private
     * @param {string} originId - The origin ID.
     * @param {string} userId - The user ID.
     * @returns {Promise<UserInfo>} - A promise that resolves to the user information.
     */
    _fetchUserDetailsIfRequired: function _fetchUserDetailsIfRequired(originId, userId) {
      this.userInfo = this.userInfo || {};
      if (Object.keys(this.userInfo).includes(userId)) {
        return Promise.resolve(this.userInfo[userId]);
      } else {
        return this._fetchUserInfo(originId, userId);
      }
    },
    /**
     * Fetches user information for a specific user.
     *
     * @private
     * @param {string} originId - The origin ID.
     * @param {string} userId - The user ID.
     * @returns {Promise<UserInfo>} - A promise that resolves to the user information.
     */
    _fetchUserInfo: function _fetchUserInfo(originId, userId) {
      try {
        const _this2 = this;
        return Promise.resolve(_catch(function () {
          return Promise.resolve(fetch(`/sap/opu/odata/IWPGW/TASKPROCESSING;mo;v=2/UserInfoCollection(SAP__Origin='${originId}',UniqueName='${userId}')?$format=json`)).then(function (response) {
            if (!response.ok) {
              throw new Error(`Failed to Fetch User Info for: ${userId}`);
            }
            return Promise.resolve(response.json()).then(function (_response$json) {
              const {
                d: data
              } = _response$json;
              _this2.userInfo[userId] = data;
              return _this2.userInfo[userId];
            });
          });
        }, function (error) {
          Log.error(error instanceof Error ? error.message : String(error));
          return {};
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Hook for processing data fetched from a batch call.
     * This method can be overridden to perform additional data processing operations.
     * In this implementation, it is consumed to handle task-related data, particularly
     * for extracting custom attributes if action cards are enabled.
     *
     * @private
     * @async
     * @param {unknown[]} results - Data retrieved from the batch call. Structure may vary based on the backend service.
     * @param {RequestOptions} options - Additional options for parsing the data.
     * @returns {Promise<void>} A Promise that resolves when the data processing is complete.
     */
    onDataReceived: function _onDataReceived(results, options) {
      try {
        const _this3 = this;
        const [tasks, taskDefinitions] = results;
        _this3._extractCustomAttributes(taskDefinitions);
        const _temp3 = function () {
          if (!options || options && !options.onlyCount) {
            return Promise.resolve(_this3._updateTasks(tasks)).then(function (updatedTasks) {
              _this3._oData.displayTiles = _this3._oData.tiles = updatedTasks;
            });
          }
        }();
        return Promise.resolve(_temp3 && _temp3.then ? _temp3.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Updates the tasks with attributes and actions.
     *
     * @private
     * @param {Task[]} tasks - The array of tasks to update.
     * @returns {Promise<Task[]>} A promise that resolves with the updated array of tasks.
     */
    _updateTasks: function _updateTasks() {
      let tasks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      try {
        const _this4 = this;
        //add custom attributes to tasks
        let updatedTasks = _this4._addCustomAttributes(tasks);

        //add actions to tasks
        const _temp4 = function () {
          if (_this4.getEnableActions()) {
            //calculate unique task definitions
            const taskDefinitions = _this4._getTaskDefintions(updatedTasks);

            //download decision options for task defintions
            return Promise.resolve(_this4._downloadDecisionOptions(taskDefinitions)).then(function () {
              //append actions
              updatedTasks = _this4._addActions(updatedTasks);
            });
          }
        }();
        return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(function () {
          return updatedTasks;
        }) : updatedTasks);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Adds custom attributes to each task in the provided array.
     *
     * @private
     * @param {Task[]} tasks - The array of tasks to which custom attributes will be added.
     * @returns {Task[]} - A new array of tasks, each with added custom attributes.
     */
    _addCustomAttributes: function _addCustomAttributes(tasks) {
      return tasks.map(task => ({
        ...task,
        attributes: this._getCustomAttributes(task)
      }));
    },
    /**
     * Adds actions to the tasks based on their task definitions.
     *
     * @private
     * @param {Task[]} tasks - The array of tasks to which actions will be added.
     * @returns {Task[]} The array of tasks with actions added.
     */
    _addActions: function _addActions(tasks) {
      return tasks.map(task => {
        const key = task.SAP__Origin + task.TaskDefinitionID;
        return {
          ...task,
          actions: this._taskDefinitionMap[key] ? DecisionDialog.getTaskActions(task, this.getBaseUrl(), this._taskDefinitionMap, this._i18nBundle) : []
        };
      });
    },
    /**
     * Downloads decision options for the provided task definitions.
     *
     * @private
     * @param {Record<string, TaskDefinition>} taskDefinitions - The task definitions for which decision options will be downloaded.
     * @returns {Promise<void>} A promise that resolves when all decision options are downloaded and processed.
     */
    _downloadDecisionOptions: function _downloadDecisionOptions(taskDefinitions) {
      try {
        const _this5 = this;
        const decisionKeys = [];
        const decisionURLs = Object.keys(taskDefinitions).reduce((urls, key) => {
          if (!Object.keys(_this5._taskDefinitionMap).includes(key)) {
            decisionKeys.push(key);
            _this5._taskDefinitionMap[key] = [];
            const {
              SAP__Origin,
              InstanceID
            } = taskDefinitions[key];
            urls.push(`DecisionOptions?SAP__Origin='${SAP__Origin}'&InstanceID='${InstanceID}'`);
          }
          return urls;
        }, []);
        const _temp5 = function () {
          if (decisionURLs.length) {
            _this5._clearRequests();
            _this5.requests.push({
              baseURL: _this5.getBaseUrl(),
              requestURLs: decisionURLs,
              success: results => {
                results.forEach((decisionOptions, index) => {
                  _this5._taskDefinitionMap[decisionKeys[index]] = decisionOptions;
                });
                return Promise.resolve();
              }
            });
            return Promise.resolve(_this5._submitBatch()).then(function () {});
          }
        }();
        return Promise.resolve(_temp5 && _temp5.then ? _temp5.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Retrieves unique task definitions from the provided array of tasks.
     *
     * @private
     * @param {Task[]} tasks - The array of tasks from which to retrieve task definitions.
     * @returns {Record<string, TaskDefintion>} An object containing unique task definitions.
     */
    _getTaskDefintions: function _getTaskDefintions() {
      let tasks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      const taskDefinitions = {};
      tasks.forEach(task => {
        const key = task.SAP__Origin + task.TaskDefinitionID;
        if (!taskDefinitions[key]) {
          taskDefinitions[key] = {
            SAP__Origin: task.SAP__Origin,
            InstanceID: task.InstanceID,
            TaskDefinitionID: task.TaskDefinitionID
          };
        }
      });
      return taskDefinitions;
    },
    /**
     * Extracts Custom Attribute Information to create an attribute map from raw attribute data
     * received from call, which is used while task processing
     *
     * @private
     * @param {TaskDefinitionCollection[]} taskDefinitions - array of raw tasks definitions
     */
    _extractCustomAttributes: function _extractCustomAttributes() {
      let taskDefinitions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      taskDefinitions.forEach(taskDefinition => {
        const customAttributes = taskDefinition.CustomAttributeDefinitionData?.results || [];
        this._customAttributeMap[taskDefinition.TaskDefinitionID] = customAttributes.filter(oAttribute => oAttribute.Rank > 0).sort((attr1, attr2) => attr2.Rank - attr1.Rank).map(oAttribute => ({
          name: oAttribute.Name,
          label: oAttribute.Label,
          type: oAttribute.Type,
          format: oAttribute.Format,
          reference: oAttribute.Reference,
          referenced: oAttribute.Referenced,
          textArrangement: oAttribute.TextArrangement
        }));
      });
    },
    /**
     * Get the text for the "No Data" message.
     *
     * @private
     * @returns {string} The text for the "No Data" message.
     */
    getNoDataText: function _getNoDataText() {
      return this._i18nBundle.getText("noTaskTitle");
    },
    /**
     * Calculates the number of vertical cards that can fit within the available height of the given DOM element.
     *
     * @private
     * @override
     * @param {Element} domRef - The DOM element to calculate the vertical card count for.
     * @returns {number} - The number of vertical cards that can fit within the available height.
     */
    getVerticalCardCount: function _getVerticalCardCount(domRef, calculationProperties) {
      const domProperties = fetchElementProperties(domRef, ["height", "padding-top"]);
      const titleHeight = this.calculateTitleHeight();
      const availableHeight = domProperties.height - domProperties["padding-top"] * 2 - titleHeight;
      const horizontalCardCount = this.getHorizontalCardCount(domRef);
      const isPlaceholder = calculationProperties?.isPlaceholder;
      const gap = 16;
      let height = 0;
      let verticalCardCount = 0;
      if (this._isLoaded()) {
        const cardSet = splitCards(this._oData.tiles, horizontalCardCount);
        const rowHeights = cardSet.map(function (cards) {
          const maxAttributes = cards.reduce(function (attributeCount, card) {
            card.attributes = card.attributes || [];
            return card.attributes.length > attributeCount ? card.attributes.length : attributeCount;
          }, 1);
          const count = Math.min(maxAttributes, 4);
          return Constants.CARD_HEIGHT[count] + gap;
        }.bind(this));
        for (let rowHeight of rowHeights) {
          if (height + rowHeight < availableHeight) {
            height += rowHeight;
            verticalCardCount++;
          } else {
            break;
          }
        }
      } else {
        verticalCardCount = Math.floor(availableHeight / Constants.CARD_HEIGHT[isPlaceholder ? "4" : "1"]);
      }
      return Math.max(verticalCardCount, 2);
    }
  });
  return TaskPanel;
});
//# sourceMappingURL=TaskPanel-dbg-dbg.js.map
