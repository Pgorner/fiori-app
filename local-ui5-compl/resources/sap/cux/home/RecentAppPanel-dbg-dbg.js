/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/base/Log", "sap/m/Button", "sap/m/CustomListItem", "sap/m/Dialog", "sap/m/GroupHeaderListItem", "sap/m/library", "sap/m/List", "sap/m/OverflowToolbar", "sap/m/Select", "sap/m/StandardListItem", "sap/m/ToolbarSpacer", "sap/m/VBox", "sap/ui/core/format/DateFormat", "sap/ui/core/Item", "sap/ushell/Container", "sap/ushell/EventHub", "./BaseAppPersPanel", "./MenuItem", "./utils/FESRUtil"], function (Log, Button, CustomListItem, Dialog, GroupHeaderListItem, sap_m_library, List, OverflowToolbar, Select, StandardListItem, ToolbarSpacer, VBox, DateFormat, Item, Container, EventHub, __BaseAppPersPanel, __MenuItem, ___utils_FESRUtil) {
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
  const URLHelper = sap_m_library["URLHelper"];
  const BaseAppPersPanel = _interopRequireDefault(__BaseAppPersPanel);
  const MenuItem = _interopRequireDefault(__MenuItem);
  const addFESRId = ___utils_FESRUtil["addFESRId"];
  var DateFilterOption = /*#__PURE__*/function (DateFilterOption) {
    DateFilterOption["ALL"] = "ALL";
    DateFilterOption["TODAY"] = "TODAY";
    DateFilterOption["WEEK"] = "WEEK";
    DateFilterOption["TWO_WEEK"] = "TWO_WEEK";
    DateFilterOption["THREE_WEEK"] = "THREE_WEEK";
    return DateFilterOption;
  }(DateFilterOption || {});
  const GroupDateFormatter = DateFormat.getDateInstance({
    pattern: "MMMM d, yyyy"
  });
  const Constants = {
    OLDER_DATE_TIMESTAMP: Number.MIN_SAFE_INTEGER
  };
  const formatConstantTimeInDate = date => {
    return date.setHours(12, 0, 0, 0);
  };

  /**
   * Calculates the start and end dates of a week based on the given week offset.
   * @param weekOffset - The offset from the current week.
   * @returns An object containing the start and end dates of the week.
   */
  const getWeekRangeValues = weekOffset => {
    const currentDate = new Date();

    // Calculate the start of the current week (with sunday as the first day of the week)
    const startDate = new Date(currentDate);
    const startDateTimeStamp = startDate.setDate(currentDate.getDate() - currentDate.getDay() - 7 * weekOffset);

    // Calculate the end of the week
    const endDate = new Date(startDate);
    const endDateTimeStamp = endDate.setDate(startDate.getDate() + 6);
    return {
      startDate: startDateTimeStamp,
      endDate: endDateTimeStamp
    };
  };

  /**
   * Calculates the timestamp of a date, that is a specified number of days before a given current date.
   *
   * @param {Date} currentTimeStamp - The current date to calculate days before.
   * @param {number} days - The number of days before the current date.
   * @returns {number} The timestamp of the date `days` before `currentDate`.
   */
  const getDaysBefore = (currentTimeStamp, days) => {
    const currentDate = new Date(currentTimeStamp);
    const newDateStamp = currentDate.setDate(currentDate.getDate() - days);
    return formatConstantTimeInDate(new Date(newDateStamp));
  };

  /**
   * Filters an app by date.
   * @private
   * @param {number} appTimeStamp - The timestamp of the app.
   * @param {number} startTimeStamp - The start timestamp for filtering.
   * @param {number} endTimeStamp - The end timestamp for filtering.
   * @returns A boolean indicating whether the app falls within the specified date range.
   */
  const isDateWithinRange = (appTimeStamp, startTimeStamp, endTimeStamp) => {
    return appTimeStamp >= startTimeStamp && appTimeStamp <= endTimeStamp;
  };

  /**
   *
   * Provides class for managing Recently Used apps.
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
   * @alias sap.cux.home.RecentAppPanel
   */
  const RecentAppPanel = BaseAppPersPanel.extend("sap.cux.home.RecentAppPanel", {
    metadata: {
      library: "sap.cux.home",
      defaultAggregation: "apps",
      aggregations: {
        /**
         * Apps aggregation for Recent apps
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
     * Constructor for a new Recently Used apps Panel.
     *
     * @param {string} [id] ID for the new control, generated automatically if an ID is not provided
     * @param {object} [settings] Initial settings for the new control
     */
    constructor: function _constructor(id, settings) {
      BaseAppPersPanel.prototype.constructor.call(this, id, settings);
      this._recentApps = [];
      this.setSupported(false);
    },
    init: function _init() {
      BaseAppPersPanel.prototype.init.call(this);
      this.setProperty("key", "recentApps");
      this.setProperty("title", this._i18nBundle.getText("recentlyUsedTab"));
      this.setProperty("tooltip", this._i18nBundle.getText("recentAppsInfo"));
      this._attachUserActivityTracking();
      EventHub.on("userRecentsCleared").do(() => {
        void this.refresh();
      });

      //Setup Menu Items
      const showHistoryMenuItem = new MenuItem(`${this.getId()}-show-history-btn`, {
        title: this._i18nBundle.getText("showHistoryBtn"),
        icon: "sap-icon://history",
        press: this._openHistoryDialog.bind(this)
      });
      addFESRId(showHistoryMenuItem, "showHistory");
      this.insertAggregation("menuItems", showHistoryMenuItem, 0);
    },
    /**
     * Fetch recent apps and set apps aggregation
     * @private
     */
    loadApps: function _loadApps() {
      try {
        const _this = this;
        return Promise.resolve(_this._getRecentApps()).then(function (recentApps) {
          recentApps = recentApps.map(app => {
            return {
              ...app,
              menuItems: _this._getAppActions(app.addedInFavorites)
            };
          });
          _this.destroyAggregation("apps", true);
          //convert apps objects array to apps instances
          _this.setApps(_this.generateApps(recentApps));
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Returns list of recent apps
     * @private
     * @returns {Promise<IActivity[]>} - Array of recent apps.
     */
    _getRecentApps: function _getRecentApps() {
      try {
        const _this2 = this;
        return Promise.resolve(_catch(function () {
          return Promise.resolve(Container.getServiceAsync("UserRecents")).then(function (UserRecentsService) {
            return Promise.resolve(Promise.all([UserRecentsService?.getRecentActivity().then(result => result || []), UserRecentsService?.oRecentActivity._getRecentActivitiesFromLoadedData().then(result => result || {})])).then(function (_ref) {
              let [recentActivities, recentActivitiesUsageData] = _ref;
              //convert activity to apps
              return Promise.resolve(_this2.convertActivitiesToVisualizations(recentActivities)).then(function (_this2$convertActivit) {
                _this2._recentApps = _this2$convertActivit;
                let recentDate = new Date(recentActivitiesUsageData?.recentDay);
                // add last used and usage info
                _this2._recentDayTimeStamp = formatConstantTimeInDate(recentDate);
                const recentUsage = recentActivitiesUsageData?.recentUsageArray || [];
                const recentUsageMap = new Map();
                recentUsage.forEach(app => {
                  if (app.oItem?.appId) {
                    recentUsageMap.set(app.oItem.appId, app.aUsageArray);
                  }
                });
                _this2._recentApps.forEach(app => {
                  //isolate only date information by having common time information
                  app.dateStamp = formatConstantTimeInDate(new Date(app.timestamp));
                  if (recentUsageMap.size) {
                    app.usageArray = recentUsageMap.get(app.orgAppId);
                  }
                });
                return _this2._recentApps || [];
              });
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
    _getAppActions: function _getAppActions() {
      let isAppAddedInFavorite = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      const resumeLastActivityItem = new MenuItem({
        title: this._i18nBundle.getText("resumeLastActivity"),
        icon: "sap-icon://past",
        press: this._resumeAppActivity.bind(this)
      });
      addFESRId(resumeLastActivityItem, "resumeActivity");
      const appActions = [resumeLastActivityItem];
      if (!isAppAddedInFavorite) {
        const addToFavoritesItem = new MenuItem({
          title: this._i18nBundle.getText("addToFavorites"),
          icon: "sap-icon://add-favorite",
          press: event => {
            void this._addAppToFavorites(event);
          }
        });
        addFESRId(addToFavoritesItem, "addFavFromRecent");
        appActions.push(addToFavoritesItem);
      }
      return appActions;
    },
    /**
     * Redirects to the selected app url
     * @private
     * @param {sap.ui.base.Event} event - The event object.
     */
    _resumeAppActivity: function _resumeAppActivity(event) {
      const menuItem = event.getSource();
      const app = menuItem.getParent();
      const url = app.getUrl?.();
      URLHelper.redirect(url, false);
    },
    /**
     * Generates and returns a dialog for showing the history of recent applications.
     * @private
     * @returns The generated dialog for showing the history of recent applications.
     */
    _generateHistoryDialog: function _generateHistoryDialog() {
      const id = `${this.getId()}-history-dialog`;
      if (!this._controlMap.get(id)) {
        this._controlMap.set(id, new Dialog(id, {
          title: this._i18nBundle.getText("showHistoryTitle"),
          content: new VBox({
            id: `${id}-container`,
            height: "100%",
            items: [this._generateAppHistoryList()]
          }).addStyleClass("sapUiTinyMargin"),
          escapeHandler: this._closeHistoryDialog.bind(this),
          contentHeight: "29rem",
          contentWidth: "25rem",
          buttons: [new Button({
            id: `${id}-cancel-btn`,
            text: this._i18nBundle.getText("cancelBtn"),
            press: this._closeHistoryDialog.bind(this)
          })]
        }).addStyleClass("sapContrastPlus"));
      }
      return this._controlMap.get(id);
    },
    /**
     * Generates the app history list.
     * @private
     * @returns The generated app history list.
     */
    _generateAppHistoryList: function _generateAppHistoryList() {
      const id = `${this.getId()}-history-dialog-list`;
      if (!this._controlMap.get(id)) {
        this._controlMap.set(id, new List({
          id,
          growing: true,
          growingScrollToLoad: true,
          headerToolbar: new OverflowToolbar({
            id: `${id}-header-toolbar`,
            style: "Clear",
            height: "1.75rem",
            content: [new ToolbarSpacer({
              id: `${id}-header-toolbar-spacer`
            }), this._generateAppHistoryListFilter()]
          })
        }).addStyleClass("sapMListShowSeparatorsNone recentAppList"));
      }
      return this._controlMap.get(id);
    },
    /**
     * Generates the app history list filter.
     * @private
     * @returns The Select control for the app history list filter.
     */
    _generateAppHistoryListFilter: function _generateAppHistoryListFilter() {
      const id = `${this.getId()}-history-dialog-list-filter`;
      if (!this._controlMap.get(id)) {
        this._controlMap.set(id, new Select({
          id,
          selectedKey: DateFilterOption.ALL,
          change: e => this._onDateFilterChange(e),
          items: [new Item({
            id: `${id}-month`,
            key: DateFilterOption.ALL,
            text: this._i18nBundle.getText("dateThirty")
          }), new Item({
            id: `${id}-today`,
            key: DateFilterOption.TODAY,
            text: this._i18nBundle.getText("dateToday")
          }), new Item({
            id: `${id}-week`,
            key: DateFilterOption.WEEK,
            text: this._i18nBundle.getText("dateWeek")
          }), new Item({
            id: `${id}-twoWeek`,
            key: DateFilterOption.TWO_WEEK,
            text: this._i18nBundle.getText("dateTwoWeek")
          }), new Item({
            id: `${id}-threeWeek`,
            key: DateFilterOption.THREE_WEEK,
            text: this._i18nBundle.getText("dateThreeWeek")
          })]
        }));
      }
      return this._controlMap.get(id);
    },
    /**
     * Generates and populates items in the app history list based on the provided list of items.
     * Clears existing items in the list before adding new items.
     *
     * @param {IAppHistory[]} appHistoryItems - Array of items to populate in the app history list.
     * @returns {void}
     * @private
     */
    _generateAppHistoryListItems: function _generateAppHistoryListItems(appHistoryItems) {
      const appHistoryList = this._generateAppHistoryList();
      appHistoryList?.destroyItems();
      appHistoryItems.forEach(appHistoryItem => {
        appHistoryList.addItem(this._getGroupHeader(appHistoryItem.dateStamp));
        appHistoryList.addItem(new CustomListItem({
          id: `date-${appHistoryItem.dateStamp}-lisItem`,
          type: "Inactive",
          content: [new List({
            id: `date-${appHistoryItem.dateStamp}-appList`,
            items: (appHistoryItem.apps || []).map(app => new StandardListItem({
              //id,
              title: app.name,
              type: "Inactive"
            }).addStyleClass("sapUiTinyMarginBeginEnd recentAppList sapUiSmallMarginTop"))
          }).addStyleClass("sapMListShowSeparatorsNone sapUiTinyMarginBottom")]
        }));
      });
    },
    /**
     * Opens the history dialog.
     * This method generates the show history dialog, retrieves the app history list,
     * generates the app history list items, and opens the dialog.
     * @private
     */
    _openHistoryDialog: function _openHistoryDialog() {
      const historyDialog = this._generateHistoryDialog();
      const appHistory = this._getAppHistory();
      this._generateAppHistoryListItems(appHistory);
      historyDialog.open();
    },
    /**
     * Closes the history dialog.
     * @private
     */
    _closeHistoryDialog: function _closeHistoryDialog() {
      const historyDialog = this._generateHistoryDialog();
      historyDialog.close();
    },
    /**
     * Handles the change event of the date filter.
     * Updates the app history list based on the selected date filter.
     * @private
     * @param {Select$ChangeEvent} event - The select change event.
     */
    _onDateFilterChange: function _onDateFilterChange(event) {
      const selectedKey = event.getParameter("selectedItem")?.getKey();
      const filteredAppHistory = this._getFilteredAppHistory(selectedKey);
      this._generateAppHistoryListItems(filteredAppHistory);
    },
    /**
     * Generates a group header for the given date timestamp.
     *
     * @param {number} dateStamp - The timestamp representing the date.
     * @returns {GroupHeaderListItem} The generated group header list item.
     * @private
     */
    _getGroupHeader: function _getGroupHeader(dateStamp) {
      let sTitle = "";
      switch (dateStamp) {
        case Constants.OLDER_DATE_TIMESTAMP:
          sTitle = this._i18nBundle.getText("dateLater");
          break;
        case formatConstantTimeInDate(new Date()):
          sTitle = this._i18nBundle.getText("dateToday");
          break;
        default:
          sTitle = GroupDateFormatter.format(new Date(dateStamp));
          break;
      }
      return new GroupHeaderListItem({
        title: sTitle
      }).addStyleClass("sapUiTinyMarginBeginEnd recentAppListHeader");
    },
    /**
     * Retrieves the application usage history based on recent app data.
     *
     * @returns {IAppHistory[]} Array of objects, where each object contains the date timestamp and the apps that are used on that date.
     * @private
     */
    _getAppHistory: function _getAppHistory() {
      if (this._recentDayTimeStamp && this._recentApps?.length) {
        const groupedAppHistory = {};
        const thresholdTimeStamp = getDaysBefore(this._recentDayTimeStamp, 30); // 30 days threshold
        this._recentApps.forEach(recentApp => {
          const appTimeStamp = formatConstantTimeInDate(new Date(recentApp.dateStamp));
          if (appTimeStamp < thresholdTimeStamp) {
            if (!groupedAppHistory[Constants.OLDER_DATE_TIMESTAMP]) {
              groupedAppHistory[Constants.OLDER_DATE_TIMESTAMP] = {
                dateStamp: Constants.OLDER_DATE_TIMESTAMP,
                apps: []
              };
            }
            groupedAppHistory[Constants.OLDER_DATE_TIMESTAMP]?.apps.push({
              name: recentApp.title
            });
          } else {
            const appUsage = recentApp.usageArray || [];
            appUsage.forEach((usage, index) => {
              if (usage > 0) {
                const usageDate = getDaysBefore(this._recentDayTimeStamp, appUsage.length - 1 - index);
                if (!groupedAppHistory[usageDate]) {
                  groupedAppHistory[usageDate] = {
                    dateStamp: usageDate,
                    apps: []
                  };
                }
                groupedAppHistory[usageDate]?.apps.push({
                  name: recentApp.title
                });
              }
            });
          }
        });
        const appHistory = Object.values(groupedAppHistory);
        appHistory.sort((a, b) => b.dateStamp - a.dateStamp);
        return appHistory;
      }
      return [];
    },
    /**
     * Retrieves the filtered app history based on the selected date filter option.
     * @private
     * @param {DateFilterOption} selectedKey - The selected date filter option.
     * @returns {IAppHistory[]} An array of filtered app history.
     */
    _getFilteredAppHistory: function _getFilteredAppHistory(selectedKey) {
      const appHistory = this._getAppHistory();
      let filteredAppHistory = [];
      switch (selectedKey) {
        case DateFilterOption.TODAY:
          {
            filteredAppHistory = appHistory.filter(app => app.dateStamp === formatConstantTimeInDate(new Date()));
            break;
          }
        case DateFilterOption.WEEK:
          {
            const {
              startDate: currentWeekStartDate,
              endDate: currentWeekEndDate
            } = getWeekRangeValues(0);
            filteredAppHistory = appHistory.filter(app => isDateWithinRange(app.dateStamp, currentWeekStartDate, currentWeekEndDate));
            break;
          }
        case DateFilterOption.TWO_WEEK:
          {
            const {
              startDate: secondWeekStartDate
            } = getWeekRangeValues(1);
            const {
              endDate: currentWeekEndDate
            } = getWeekRangeValues(0);
            filteredAppHistory = appHistory.filter(app => isDateWithinRange(app.dateStamp, secondWeekStartDate, currentWeekEndDate));
            break;
          }
        case DateFilterOption.THREE_WEEK:
          {
            const {
              startDate: thirdWeekStartDate
            } = getWeekRangeValues(2);
            const {
              endDate: currentWeekEndDate
            } = getWeekRangeValues(0);
            filteredAppHistory = appHistory.filter(app => isDateWithinRange(app.dateStamp, thirdWeekStartDate, currentWeekEndDate));
            break;
          }
        default:
          filteredAppHistory = [...appHistory];
          break;
      }
      return filteredAppHistory;
    },
    /**
     * Generates illustrated message for recent apps panel.
     * @private
     * @override
     * @returns {sap.m.IllustratedMessage} Illustrated error message.
     */
    generateIllustratedMessage: function _generateIllustratedMessage() {
      const illustratedMessage = BaseAppPersPanel.prototype.generateIllustratedMessage.call(this);
      //override the default description
      illustratedMessage.setDescription(this._i18nBundle.getText("noRecentAppsDescription"));
      return illustratedMessage;
    }
  });
  return RecentAppPanel;
});
//# sourceMappingURL=RecentAppPanel-dbg-dbg.js.map
