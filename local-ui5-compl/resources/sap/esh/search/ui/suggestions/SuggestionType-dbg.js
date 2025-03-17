/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../sinaNexTS/sina/NavigationTarget"], function (___sinaNexTS_sina_NavigationTarget) {
  "use strict";

  const NavigationTarget = ___sinaNexTS_sina_NavigationTarget["NavigationTarget"];
  function isSearchSuggestion(suggestion) {
    if (typeof suggestion === "object") {
      if ("titleNavigation" in suggestion) {
        return suggestion.titleNavigation instanceof NavigationTarget;
      }
    }
  }
  var Type = /*#__PURE__*/function (Type) {
    Type["App"] = "App";
    Type["DataSource"] = "DataSource";
    Type["SearchTermHistory"] = "SearchTermHistory";
    Type["SearchTermData"] = "SearchTermData";
    Type["SearchTermAI"] = "SearchTermAI";
    Type["Object"] = "Object";
    Type["Header"] = "Header";
    Type["BusyIndicator"] = "BusyIndicator";
    Type["Transaction"] = "Transaction";
    Type["Search"] = "Search";
    return Type;
  }(Type || {});
  const SuggestionType = {
    // =======================================================================
    // constants for suggestion types
    // =======================================================================
    App: "App",
    DataSource: "DataSource",
    SearchTermHistory: "SearchTermHistory",
    SearchTermData: "SearchTermData",
    SearchTermAI: "SearchTermAI",
    Object: "Object",
    Header: "Header",
    // section header
    BusyIndicator: "BusyIndicator",
    // busy indicator entry
    Transaction: "Transaction",
    Search: "Search",
    // =======================================================================
    // list of all suggestion types
    // =======================================================================
    types: ["App", "DataSource", "SearchTermHistory", "SearchTermData", "SearchTermAI", "Object", "Search", "Transaction"],
    // =======================================================================
    // properties of suggestion types
    // =======================================================================
    properties: {
      Transaction: {
        position: 50,
        limitDsAll: 3,
        limit: 3
      },
      App: {
        position: 100,
        // TODO sinaNext check values
        limitDsAll: 3,
        limit: 7 // Ds=Apps
      },
      DataSource: {
        position: 200,
        limitDsAll: 2,
        limit: 2
      },
      SearchTermHistory: {
        position: 400,
        limitDsAll: 7,
        limit: 5
      },
      SearchTermData: {
        position: 400,
        limitDsAll: 7,
        limit: 5
      },
      SearchTermAI: {
        position: 20,
        limitDsAll: 7,
        limit: 5
      },
      Object: {
        position: 300,
        limitDsAll: 3,
        limit: 5
      },
      Search: {
        position: 20,
        limitDsAll: 7,
        limit: 5
      },
      BusyIndicator: {
        position: 900
      }
    }
  };
  const RecentEntriesPosition = 25;
  const RecentEntriesLimit = 10;
  SuggestionType.isSearchSuggestion = isSearchSuggestion;
  SuggestionType.Type = Type;
  SuggestionType.SuggestionType = SuggestionType;
  SuggestionType.RecentEntriesPosition = RecentEntriesPosition;
  SuggestionType.RecentEntriesLimit = RecentEntriesLimit;
  return SuggestionType;
});
})();