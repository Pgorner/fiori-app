/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/ui/core/theming/Parameters"], function (Parameters) {
  "use strict";

  const fnFetchLegendColor = sLegendName => {
    return {
      key: sLegendName,
      value: Parameters.get({
        name: sLegendName
      }),
      assigned: false
    };
  };
  const BASE_URL = "/sap/opu/odata4/ui2/insights_srv/srvd/ui2/";
  const INSIGHTS_READ_SRVC_URL = BASE_URL + "insights_read_srv/0001/";
  const MYHOME_PAGE_ID = "SAP_BASIS_PG_UI_MYHOME";
  const FALLBACK_ICON = "sap-icon://document";
  const DEFAULT_APP_ICON = "sap-icon://product";
  const MYINSIGHT_SECTION_ID = "AZHJGRIT78TG7Y65RF6EPFJ9U";
  const MYHOME_SPACE_ID = "SAP_BASIS_SP_UI_MYHOME";
  const DEFAULT_BG_COLOR = () => fnFetchLegendColor("sapLegendColor9");
  const PAGE_SELECTION_LIMIT = 8;
  const LEGEND_COLORS = () => ["sapLegendColor6", "sapLegendColor3", "sapLegendColor1", "sapLegendColor10", "sapLegendColor12", "sapLegendColor7", "sapLegendColor5", "sapLegendColor8", "sapLegendColor18", "sapLegendColor9"].map(fnFetchLegendColor);
  const END_USER_COLORS = () => ["sapLegendColor19", "sapLegendColor13", "sapLegendColor11", "sapLegendColor20", "sapLegendColor2", "sapLegendColor17", "sapLegendColor15", "sapLegendColor14", "sapLegendColor16", "sapLegendColor4"].map(fnFetchLegendColor);
  const AppTypes = {
    FAVORITE: "FAVORITE",
    RECENT: "RECENT",
    FREQUENT: "FREQUENT"
  };
  const PLACEHOLDER_ITEMS_COUNT = 5;
  const RECOMMENDED_CARD_LIMIT = 4;
  const RECOMMENDATION_SRVC_URL = INSIGHTS_READ_SRVC_URL + "RecommendedApps";
  const FEATURE_TOGGLES = {
    RECOMMENDATION: "/UI2/MYHOME_APP_RECOMMENDATION",
    TASK_ACTIONS: "/UI2/S4HOME_FEATURE_TOGGLE"
  };
  const FEATURE_TOGGLE_SRVC_URL = INSIGHTS_READ_SRVC_URL + "FeatureToggle";
  const REPO_BASE_URL = BASE_URL + "insights_cards_repo_srv/0001/";
  var SETTINGS_PANELS_KEYS = /*#__PURE__*/function (SETTINGS_PANELS_KEYS) {
    SETTINGS_PANELS_KEYS["LAYOUT"] = "LAYOUT";
    SETTINGS_PANELS_KEYS["NEWS"] = "NEWS";
    SETTINGS_PANELS_KEYS["PAGES"] = "PAGES";
    SETTINGS_PANELS_KEYS["INSIGHTS_TILES"] = "INSIGHTS_TILES";
    SETTINGS_PANELS_KEYS["INSIGHTS_CARDS"] = "INSIGHTS_CARDS";
    SETTINGS_PANELS_KEYS["ADVANCED"] = "ADVANCED";
    return SETTINGS_PANELS_KEYS;
  }(SETTINGS_PANELS_KEYS || {});
  var KEYUSER_SETTINGS_PANELS_KEYS = /*#__PURE__*/function (KEYUSER_SETTINGS_PANELS_KEYS) {
    KEYUSER_SETTINGS_PANELS_KEYS["LAYOUT"] = "KEYUSER_LAYOUT";
    KEYUSER_SETTINGS_PANELS_KEYS["NEWS_PAGES"] = "KEYUSER_NEWS_PAGES";
    KEYUSER_SETTINGS_PANELS_KEYS["NEWS"] = "KEYUSER_NEWS";
    KEYUSER_SETTINGS_PANELS_KEYS["PAGES"] = "KEYUSER_PAGES";
    return KEYUSER_SETTINGS_PANELS_KEYS;
  }(KEYUSER_SETTINGS_PANELS_KEYS || {});
  var __exports = {
    __esModule: true
  };
  __exports.fnFetchLegendColor = fnFetchLegendColor;
  __exports.MYHOME_PAGE_ID = MYHOME_PAGE_ID;
  __exports.FALLBACK_ICON = FALLBACK_ICON;
  __exports.DEFAULT_APP_ICON = DEFAULT_APP_ICON;
  __exports.MYINSIGHT_SECTION_ID = MYINSIGHT_SECTION_ID;
  __exports.MYHOME_SPACE_ID = MYHOME_SPACE_ID;
  __exports.DEFAULT_BG_COLOR = DEFAULT_BG_COLOR;
  __exports.PAGE_SELECTION_LIMIT = PAGE_SELECTION_LIMIT;
  __exports.LEGEND_COLORS = LEGEND_COLORS;
  __exports.END_USER_COLORS = END_USER_COLORS;
  __exports.AppTypes = AppTypes;
  __exports.PLACEHOLDER_ITEMS_COUNT = PLACEHOLDER_ITEMS_COUNT;
  __exports.RECOMMENDED_CARD_LIMIT = RECOMMENDED_CARD_LIMIT;
  __exports.RECOMMENDATION_SRVC_URL = RECOMMENDATION_SRVC_URL;
  __exports.FEATURE_TOGGLES = FEATURE_TOGGLES;
  __exports.FEATURE_TOGGLE_SRVC_URL = FEATURE_TOGGLE_SRVC_URL;
  __exports.REPO_BASE_URL = REPO_BASE_URL;
  __exports.SETTINGS_PANELS_KEYS = SETTINGS_PANELS_KEYS;
  __exports.KEYUSER_SETTINGS_PANELS_KEYS = KEYUSER_SETTINGS_PANELS_KEYS;
  return __exports;
});
//# sourceMappingURL=Constants-dbg-dbg.js.map
