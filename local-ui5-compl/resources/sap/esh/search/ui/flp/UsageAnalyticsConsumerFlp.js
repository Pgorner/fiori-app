/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../eventlogging/UserEvents","../eventlogging/EventConsumer","../suggestions/SuggestionType","sap/base/Log"],function(e,t,a,s){"use strict";function i(e){return e&&e.__esModule&&typeof e.default!=="undefined"?e.default:e}const n=e["UserEventType"];const c=i(t);const r=i(a);class o extends c{log=(()=>s.getLogger("sap.esh.search.ui.eventlogging.UsageAnalyticsConsumerFlp"))();analytics;actionPrefix="FLP: ";label="FLP";async initAsync(){if(window.sap?.ushell?.Container){this.analytics=await window.sap.ushell.Container.getServiceAsync("UsageAnalytics")}}logEvent(e){if(!this.analytics){return}switch(e.type){case n.RESULT_LIST_ITEM_NAVIGATE:this.analytics.logCustomEvent(`${this.actionPrefix}Search`,"Launch Object",[e.targetUrl]);break;case n.RESULT_LIST_ITEM_ATTRIBUTE_NAVIGATE:this.analytics.logCustomEvent(`${this.actionPrefix}Search`,"Launch Object",[e.targetUrl]);break;case n.SUGGESTION_SELECT:switch(e.suggestionType){case r.App:this.analytics.logCustomEvent(`${this.actionPrefix}Search`,"Suggestion Select App",[e.suggestionTitle,e.targetUrl,e.searchTerm]);this.analytics.logCustomEvent(`${this.actionPrefix}Application Launch point`,"Search Suggestions",[e.suggestionTitle,e.targetUrl,e.searchTerm]);break;case r.DataSource:this.analytics.logCustomEvent(`${this.actionPrefix}Search`,"Suggestion Select Datasource",[e.dataSourceKey,e.searchTerm]);break;case r.Object:this.analytics.logCustomEvent(`${this.actionPrefix}Search`,"Suggestion Select Object Data",[e.suggestionTerm,e.dataSourceKey,e.searchTerm]);break;case r.Search:this.analytics.logCustomEvent(`${this.actionPrefix}Search`,"Suggestion Select Search",[e.suggestionTitle]);break}break;case n.SEARCH_REQUEST:this.analytics.logCustomEvent(`${this.actionPrefix}Search`,"Search",[e.searchTerm,e.dataSourceKey]);break;case n.RESULT_LIST_ITEM_NAVIGATE_CONTEXT:this.analytics.logCustomEvent(`${this.actionPrefix}Search`,"Launch Related Object",[e.targetUrl]);break;case n.SUGGESTION_REQUEST:this.analytics.logCustomEvent(`${this.actionPrefix}Search`,"Suggestion",[e.suggestionTerm,e.dataSourceKey]);break;case n.TILE_NAVIGATE:this.analytics.logCustomEvent(`${this.actionPrefix}Search`,"Launch App",[e.tileTitle,e.targetUrl]);this.analytics.logCustomEvent(`${this.actionPrefix}Application Launch point`,"Search Results",[e.tileTitle,e.targetUrl]);break}this.log.debug(`[${this.label}] Logged user event ${e.type}`)}}return o})})();
//# sourceMappingURL=UsageAnalyticsConsumerFlp.js.map