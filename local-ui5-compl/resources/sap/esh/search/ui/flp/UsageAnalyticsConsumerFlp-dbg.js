/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../eventlogging/UserEvents", "../eventlogging/EventConsumer", "../suggestions/SuggestionType", "sap/base/Log"], function (___eventlogging_UserEvents, __EventConsumer, __SuggestionType, Log) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const UserEventType = ___eventlogging_UserEvents["UserEventType"];
  const EventConsumer = _interopRequireDefault(__EventConsumer);
  const SuggestionType = _interopRequireDefault(__SuggestionType);
  /**
   * Usage Analytics Event Consumer for Fiori Launchpad
   */
  class UsageAnalyticsConsumerFlp extends EventConsumer {
    log = (() => Log.getLogger("sap.esh.search.ui.eventlogging.UsageAnalyticsConsumerFlp"))();
    analytics;
    actionPrefix = "FLP: ";
    label = "FLP";
    async initAsync() {
      if (window.sap?.ushell?.Container) {
        this.analytics = await window.sap.ushell.Container.getServiceAsync("UsageAnalytics");
      }
    }
    logEvent(event) {
      if (!this.analytics) {
        return;
      }
      switch (event.type) {
        case UserEventType.RESULT_LIST_ITEM_NAVIGATE:
          this.analytics.logCustomEvent(`${this.actionPrefix}Search`, "Launch Object", [event.targetUrl]);
          break;
        case UserEventType.RESULT_LIST_ITEM_ATTRIBUTE_NAVIGATE:
          this.analytics.logCustomEvent(`${this.actionPrefix}Search`, "Launch Object", [event.targetUrl]);
          break;
        case UserEventType.SUGGESTION_SELECT:
          switch (event.suggestionType) {
            case SuggestionType.App:
              this.analytics.logCustomEvent(`${this.actionPrefix}Search`, "Suggestion Select App", [event.suggestionTitle, event.targetUrl, event.searchTerm]);
              this.analytics.logCustomEvent(`${this.actionPrefix}Application Launch point`, "Search Suggestions", [event.suggestionTitle, event.targetUrl, event.searchTerm]);
              break;
            case SuggestionType.DataSource:
              this.analytics.logCustomEvent(`${this.actionPrefix}Search`, "Suggestion Select Datasource", [event.dataSourceKey, event.searchTerm]);
              break;
            case SuggestionType.Object:
              this.analytics.logCustomEvent(`${this.actionPrefix}Search`, "Suggestion Select Object Data", [event.suggestionTerm, event.dataSourceKey, event.searchTerm]);
              break;
            case SuggestionType.Search:
              this.analytics.logCustomEvent(`${this.actionPrefix}Search`, "Suggestion Select Search", [event.suggestionTitle]);
              break;
          }
          break;
        case UserEventType.SEARCH_REQUEST:
          this.analytics.logCustomEvent(`${this.actionPrefix}Search`, "Search", [event.searchTerm, event.dataSourceKey]);
          break;
        case UserEventType.RESULT_LIST_ITEM_NAVIGATE_CONTEXT:
          this.analytics.logCustomEvent(`${this.actionPrefix}Search`, "Launch Related Object", [event.targetUrl]);
          break;
        case UserEventType.SUGGESTION_REQUEST:
          this.analytics.logCustomEvent(`${this.actionPrefix}Search`, "Suggestion", [event.suggestionTerm, event.dataSourceKey]);
          break;
        case UserEventType.TILE_NAVIGATE:
          this.analytics.logCustomEvent(`${this.actionPrefix}Search`, "Launch App", [event.tileTitle, event.targetUrl]);
          this.analytics.logCustomEvent(`${this.actionPrefix}Application Launch point`, "Search Results", [event.tileTitle, event.targetUrl]);
          break;
      }
      this.log.debug(`[${this.label}] Logged user event ${event.type}`);
    }
  }
  return UsageAnalyticsConsumerFlp;
});
})();