/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import Parameters from "sap/ui/core/theming/Parameters";

export const fnFetchLegendColor = (sLegendName: string) => {
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

export const MYHOME_PAGE_ID: string = "SAP_BASIS_PG_UI_MYHOME";
export const FALLBACK_ICON: string = "sap-icon://document";
export const DEFAULT_APP_ICON: string = "sap-icon://product";
export const MYINSIGHT_SECTION_ID: string = "AZHJGRIT78TG7Y65RF6EPFJ9U";
export const MYHOME_SPACE_ID: string = "SAP_BASIS_SP_UI_MYHOME";
export const DEFAULT_BG_COLOR = () => fnFetchLegendColor("sapLegendColor9");

export const PAGE_SELECTION_LIMIT = 8;
export const LEGEND_COLORS = () =>
	[
		"sapLegendColor6",
		"sapLegendColor3",
		"sapLegendColor1",
		"sapLegendColor10",
		"sapLegendColor12",
		"sapLegendColor7",
		"sapLegendColor5",
		"sapLegendColor8",
		"sapLegendColor18",
		"sapLegendColor9"
	].map(fnFetchLegendColor);
export const END_USER_COLORS = () =>
	[
		"sapLegendColor19",
		"sapLegendColor13",
		"sapLegendColor11",
		"sapLegendColor20",
		"sapLegendColor2",
		"sapLegendColor17",
		"sapLegendColor15",
		"sapLegendColor14",
		"sapLegendColor16",
		"sapLegendColor4"
	].map(fnFetchLegendColor);
export const AppTypes = {
	FAVORITE: "FAVORITE",
	RECENT: "RECENT",
	FREQUENT: "FREQUENT"
};
export const PLACEHOLDER_ITEMS_COUNT = 5;
export const RECOMMENDED_CARD_LIMIT = 4;
export const RECOMMENDATION_SRVC_URL = INSIGHTS_READ_SRVC_URL + "RecommendedApps";
export const FEATURE_TOGGLES = {
	RECOMMENDATION: "/UI2/MYHOME_APP_RECOMMENDATION",
	TASK_ACTIONS: "/UI2/S4HOME_FEATURE_TOGGLE"
};
export const FEATURE_TOGGLE_SRVC_URL = INSIGHTS_READ_SRVC_URL + "FeatureToggle";
export const REPO_BASE_URL = BASE_URL + "insights_cards_repo_srv/0001/";
export enum SETTINGS_PANELS_KEYS {
	LAYOUT = "LAYOUT",
	NEWS = "NEWS",
	PAGES = "PAGES",
	INSIGHTS_TILES = "INSIGHTS_TILES",
	INSIGHTS_CARDS = "INSIGHTS_CARDS",
	ADVANCED = "ADVANCED"
}
export enum KEYUSER_SETTINGS_PANELS_KEYS {
	LAYOUT = "KEYUSER_LAYOUT",
	NEWS_PAGES = "KEYUSER_NEWS_PAGES",
	NEWS = "KEYUSER_NEWS",
	PAGES = "KEYUSER_PAGES"
}
