/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define([], function () {
  "use strict";

  var UserEventType = /*#__PURE__*/function (UserEventType) {
    UserEventType["SUGGESTION_SELECT"] = "SUGGESTION_SELECT";
    UserEventType["SEARCH_REQUEST"] = "SEARCH_REQUEST";
    UserEventType["SUGGESTION_REQUEST"] = "SUGGESTION_REQUEST";
    UserEventType["TILE_NAVIGATE"] = "TILE_NAVIGATE";
    UserEventType["SHOW_MORE"] = "SHOW_MORE";
    UserEventType["BROWSER_CLOSE"] = "BROWSER_CLOSE";
    UserEventType["LEAVE_PAGE"] = "LEAVE_PAGE";
    UserEventType["SESSION_START"] = "SESSION_START";
    UserEventType["HASH_CHANGE"] = "HASH_CHANGE";
    UserEventType["ITEM_NAVIGATE"] = "ITEM_NAVIGATE";
    UserEventType["RESULT_LIST_ITEM_NAVIGATE"] = "RESULT_LIST_ITEM_NAVIGATE";
    UserEventType["RESULT_LIST_ITEM_NAVIGATE_CONTEXT"] = "RESULT_LIST_ITEM_NAVIGATE_CONTEXT";
    UserEventType["RESULT_LIST_ITEM_ATTRIBUTE_NAVIGATE"] = "RESULT_LIST_ITEM_ATTRIBUTE_NAVIGATE";
    UserEventType["OBJECT_SUGGESTION_NAVIGATE"] = "OBJECT_SUGGESTION_NAVIGATE";
    UserEventType["DROPDOWN_SELECT_DS"] = "DROPDOWN_SELECT_DS";
    UserEventType["DATASOURCE_CHANGE"] = "DATASOURCE_CHANGE";
    UserEventType["FACET_FILTER_ADD"] = "FACET_FILTER_ADD";
    UserEventType["FACET_FILTER_DEL"] = "FACET_FILTER_DEL";
    UserEventType["ITEM_SHOW_DETAILS"] = "ITEM_SHOW_DETAILS";
    UserEventType["ITEM_HIDE_DETAILS"] = "ITEM_HIDE_DETAILS";
    UserEventType["CLEAR_ALL_FILTERS"] = "CLEAR_ALL_FILTERS";
    UserEventType["FACET_SHOW_MORE"] = "FACET_SHOW_MORE";
    UserEventType["FACET_SHOW_MORE_CLOSE"] = "FACET_SHOW_MORE_CLOSE";
    UserEventType["QUICK_SELECT_SWITCH"] = "QUICK_SELECT_SWITCH";
    UserEventType["RESULT_VIEW_SWITCH"] = "RESULT_VIEW_SWITCH";
    UserEventType["SEARCH_WITH_FILTERS"] = "SEARCH_WITH_FILTERS";
    UserEventType["SEARCH_WITH_SEARCHTERM"] = "SEARCH_WITH_SEARCHTERM";
    UserEventType["SEARCH_WITH_SEARCHTERM_FILTERS"] = "SEARCH_WITH_SEARCHTERM_FILTERS";
    UserEventType["SEARCH_WITHOUT_SEARCHTERM_FILTERS"] = "SEARCH_WITHOUT_SEARCHTERM_FILTERS";
    UserEventType["STATIC_FACET_SELECT"] = "STATIC_FACET_SELECT";
    UserEventType["BREADCRUMB_LINK_PRESS"] = "BREADCRUMB_LINK_PRESS";
    UserEventType["TABLE_CONFIG_OPEN"] = "TABLE_CONFIG_OPEN";
    return UserEventType;
  }(UserEventType || {});
  /**
   * WARNING: do not change this in an incompatible way, since
   * it is part of the official API for external use of SearchCompositeControl
   */
  var __exports = {
    __esModule: true
  };
  __exports.UserEventType = UserEventType;
  return __exports;
});
})();