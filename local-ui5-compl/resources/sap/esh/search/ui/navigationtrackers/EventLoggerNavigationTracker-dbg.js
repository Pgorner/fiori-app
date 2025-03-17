/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../eventlogging/UserEvents", "../sinaNexTS/sina/ObjectSuggestion", "../sinaNexTS/sina/ResultSet", "../sinaNexTS/sina/SearchResultSetItem", "../sinaNexTS/sina/SearchResultSetItemAttributeBase"], function (___eventlogging_UserEvents, ___sinaNexTS_sina_ObjectSuggestion, ___sinaNexTS_sina_ResultSet, ___sinaNexTS_sina_SearchResultSetItem, ___sinaNexTS_sina_SearchResultSetItemAttributeBase) {
  "use strict";

  const UserEventType = ___eventlogging_UserEvents["UserEventType"];
  const ObjectSuggestion = ___sinaNexTS_sina_ObjectSuggestion["ObjectSuggestion"];
  const ResultSet = ___sinaNexTS_sina_ResultSet["ResultSet"];
  const SearchResultSetItem = ___sinaNexTS_sina_SearchResultSetItem["SearchResultSetItem"];
  const SearchResultSetItemAttributeBase = ___sinaNexTS_sina_SearchResultSetItemAttributeBase["SearchResultSetItemAttributeBase"];
  function assembleResultData(resultSetItem) {
    if (!resultSetItem) {
      return {
        executionId: "-1",
        positionInList: -1
      };
    }
    const resultSet = resultSetItem.parent;
    if (!(resultSet instanceof ResultSet)) {
      return {
        executionId: "-1",
        positionInList: -1
      };
    }
    return {
      executionId: resultSet.id,
      positionInList: resultSet?.items.indexOf(resultSetItem)
    };
  }
  function assembleEventData(navigationTarget) {
    const parent = navigationTarget.parent;

    // check for nav target on result set attribute
    if (parent instanceof SearchResultSetItemAttributeBase) {
      return Object.assign({
        type: UserEventType.RESULT_LIST_ITEM_ATTRIBUTE_NAVIGATE,
        targetUrl: navigationTarget.targetUrl
      }, assembleResultData(parent.parent));
    }

    // check for nav target on object suggestion
    if (parent instanceof SearchResultSetItem && parent.parent instanceof ObjectSuggestion) {
      return Object.assign({
        type: UserEventType.OBJECT_SUGGESTION_NAVIGATE,
        targetUrl: navigationTarget.targetUrl
      }, assembleResultData(parent.parent));
    }

    // check for nav target on result set item
    if (parent instanceof SearchResultSetItem) {
      const type = parent.defaultNavigationTarget === navigationTarget ? UserEventType.RESULT_LIST_ITEM_NAVIGATE : UserEventType.RESULT_LIST_ITEM_NAVIGATE_CONTEXT;
      return Object.assign({
        type: type,
        targetUrl: navigationTarget.targetUrl
      }, assembleResultData(parent));
    }

    // fallback
    return {
      type: UserEventType.ITEM_NAVIGATE,
      targetUrl: navigationTarget.targetUrl,
      executionId: "",
      positionInList: -1
    };
  }
  function generateEventLoggerNavigationTracker(model) {
    return navigationTarget => {
      const eventData = assembleEventData(navigationTarget);
      model.eventLogger.logEvent(eventData);
    };
  }
  var __exports = {
    __esModule: true
  };
  __exports.generateEventLoggerNavigationTracker = generateEventLoggerNavigationTracker;
  return __exports;
});
})();