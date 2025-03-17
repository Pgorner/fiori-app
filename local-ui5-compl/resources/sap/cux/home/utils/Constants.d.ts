declare module "sap/cux/home/utils/Constants" {
    const fnFetchLegendColor: (sLegendName: string) => {
        key: string;
        value: import("sap/ui/core/theming/Parameters").Value;
        assigned: boolean;
    };
    const BASE_URL = "/sap/opu/odata4/ui2/insights_srv/srvd/ui2/";
    const INSIGHTS_READ_SRVC_URL: string;
    const MYHOME_PAGE_ID: string;
    const FALLBACK_ICON: string;
    const DEFAULT_APP_ICON: string;
    const MYINSIGHT_SECTION_ID: string;
    const MYHOME_SPACE_ID: string;
    const DEFAULT_BG_COLOR: () => {
        key: string;
        value: import("sap/ui/core/theming/Parameters").Value;
        assigned: boolean;
    };
    const PAGE_SELECTION_LIMIT = 8;
    const LEGEND_COLORS: () => {
        key: string;
        value: import("sap/ui/core/theming/Parameters").Value;
        assigned: boolean;
    }[];
    const END_USER_COLORS: () => {
        key: string;
        value: import("sap/ui/core/theming/Parameters").Value;
        assigned: boolean;
    }[];
    const AppTypes: {
        FAVORITE: string;
        RECENT: string;
        FREQUENT: string;
    };
    const PLACEHOLDER_ITEMS_COUNT = 5;
    const RECOMMENDED_CARD_LIMIT = 4;
    const RECOMMENDATION_SRVC_URL: string;
    const FEATURE_TOGGLES: {
        RECOMMENDATION: string;
        TASK_ACTIONS: string;
    };
    const FEATURE_TOGGLE_SRVC_URL: string;
    const REPO_BASE_URL: string;
    enum SETTINGS_PANELS_KEYS {
        LAYOUT = "LAYOUT",
        NEWS = "NEWS",
        PAGES = "PAGES",
        INSIGHTS_TILES = "INSIGHTS_TILES",
        INSIGHTS_CARDS = "INSIGHTS_CARDS",
        ADVANCED = "ADVANCED"
    }
    enum KEYUSER_SETTINGS_PANELS_KEYS {
        LAYOUT = "KEYUSER_LAYOUT",
        NEWS_PAGES = "KEYUSER_NEWS_PAGES",
        NEWS = "KEYUSER_NEWS",
        PAGES = "KEYUSER_PAGES"
    }
}
//# sourceMappingURL=Constants.d.ts.map