declare module "sap/cux/home/NewsPanel" {
    import type { MetadataOptions } from "sap/ui/core/Element";
    import BaseNewsPanel, { $BaseNewsPanelSettings } from "sap/cux/home/BaseNewsPanel";
    interface IBindingInfo {
        path: string;
        length: number;
    }
    interface INewsResponse {
        value: ICustomNewsFeed[];
    }
    interface INewsFeedPromise {
        [key: string]: Promise<INewsResponse | ICustomNewsFeed[]>;
    }
    interface ICustomNewsFeed {
        [key: string]: string | boolean | INewsLink | number | INewsLink[] | INewsParam;
    }
    interface INewsItem {
        changeId: string;
        title?: string;
        showAllPreparationRequired?: boolean;
    }
    interface ITranslatedText {
        ColumnName?: string;
        TranslatedName?: string;
    }
    interface IAppConfiguration {
        _oAdapter: {
            _aInbounds: IAvailableApp[];
        };
    }
    interface IAvailableApp {
        semanticObject?: string;
        action?: string;
        id?: string;
        title?: string;
        permanentKey?: string;
        contentProviderId?: string;
        resolutionResult?: {
            [key: string]: string;
        };
        deviceTypes?: {
            [key: string]: boolean;
        };
        signature: {
            parameters: {
                [key: string]: IAppParameter;
            };
            additionalParameters?: string;
        };
    }
    interface IAppParameter {
        defaultValue?: {
            value: string;
            format: string;
        };
        required: boolean;
    }
    interface INewsLink {
        [key: string]: string;
    }
    interface INewsParam {
        [key: string]: {
            [key: string]: string;
        };
    }
    const BASE_URL = "/sap/opu/odata4/ui2/insights_srv/srvd/ui2/", NEWS_FEED_READ_API: string, NEWS_FEED_TRANSLATION_API: string, NEWS_FEED_COUNT_URL: string, DEFAULT_FEED_COUNT = 7, fnImagePlaceholder: (sPath: string, N: number) => string[];
    const CUSTOM_NEWS_FEED: {
        TITLE: string;
        LINK: string;
        VALIDITY: string;
        PREPARATION_REQUIRED: string;
        EXCLUDE_FIELDS: string[];
        IMAGE_URL: string;
        FESR_STEP_NAME: string;
        EMPTY_DATA_ERROR_CODE: string;
    }, CUSTOM_IMAGES: {
        [key: string]: string[];
    };
    /**
     *
     * Panel class for managing and storing News.
     *
     * @extends sap.cux.home.BaseNewsPanel
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121
     *
     * @internal
     * @experimental Since 1.121
     * @public
     *
     * @alias sap.cux.home.NewsPanel
     */
    export default class NewsPanel extends BaseNewsPanel {
        private oNewsTile;
        private oNewsModel;
        private image;
        private pCustomNewsFeed;
        private pCustomNewsFeedCount;
        private pNewsFeed;
        private bNewsLoad;
        private oPersonalizer;
        private oPersData;
        private aFavNewsFeed;
        private _eventBus;
        static readonly metadata: MetadataOptions;
        constructor(idOrSettings?: string | $BaseNewsPanelSettings);
        constructor(id?: string, settings?: $BaseNewsPanelSettings);
        /**
         * Init lifecycle method
         *
         * @private
         * @override
         */
        init(): void;
        /**
         * Retrieves news data asynchronously.
         * If the news model is not initialized, it initializes the XML model and loads news feed data.
         * @returns {Promise} A promise that resolves when the news data is retrieved.
         */
        getData(): Promise<void>;
        /**
         * Initializes an XML model for managing news data.
         * This method returns a Promise that resolves to the initialized XML model.
         */
        /**
         * Initializes an XML model for managing news data.
         * This method returns a Promise that resolves to the initialized XML model.
         * @param {string} sUrl rss url to load the news feed
         * @returns {Promise<XMLModel>} XML Document containing the news feeds
         */
        private initializeXmlModel;
        /**
         * Loads the news feed based on the provided document and number of feeds.
         * Determines the feed type (RSS, feed, custom) and binds the news tile accordingly.
         * @param {Document} oDocument - The document containing the news feed data.
         * @param {number} [noOfFeeds] - The number of feeds to be displayed. Defaults to a predefined value.
         */
        private loadNewsFeed;
        /**
         * Handles errors that occur during the loading of the news feed.
         * @returns {void}
         */
        handleFeedError(): void;
        setURL(url: string): Promise<void>;
        /**
         * Binds the news tile with the provided binding information.
         * @param {sap.m.SlideTile} oSlideTile - The SlideTile control to be bound.
         * @param {IBindingInfo} oBindingInfo - The binding information containing the path and length of the aggregation.
         */
        private bindNewsTile;
        /**
         * Extracts images for all the news tiles
         * @param {Document} oDocument - The document containing the news feed data.
         * @param {number} [noOfFeeds] - The number of feeds to be displayed. Defaults to a predefined value.
         */
        private extractAllImageUrls;
        /**
         * Formats the publication date or the update date to a relative date-time format.
         * @param {string} oPublished - The publication date.
         * @returns {string} The formatted relative date-time string.
         */
        private formatDate;
        /**
         * Returns the favourite news feed for the custom news
         * @returns {any}
         */
        getFavNewsFeed(): {
            items: string[];
            showAllPreparationRequired: boolean;
        };
        /**
         * Extracts the image URL from the provided HREF link or link.
         * @param {string} sHrefLink - The HREF link containing the image URL.
         * @returns {Promise} A promise that resolves to the extracted image URL.
         */
        private extractImage;
        /**
         * Converts the given date to a relative date-time format.
         * @param {Date} oDate - The date to be converted.
         * @returns {string} The date in relative date-time format.
         */
        private toRelativeDateTime;
        /**
         * This method retrieves the count and feeds of the custom news feed asynchronously.
         * If the count is not zero, it loads the custom news feed data and returns the feeds.
         * @param {string} sFeedId - The ID of the custom news feed to set.
         * @returns {Promise} A promise that resolves to an array of news feeds.
         */
        setCustomNewsFeed(sFeedId: string): Promise<void>;
        /**
         * Retrieves the count of custom news feed items identified by the provided feed ID.
         * @param {string} sFeedId - The ID of the custom news feed.
         * @returns {Promise} A Promise that resolves to the count of custom news feed items.
         */
        getCustomNewsFeedCount(sFeedId: string): Promise<number>;
        /**
         * Retrieves custom news feed items identified by the provided feed ID and settings.
         * It processes the response data and returns an array of custom news feed items.
         * @param {string} sFeedId - The ID of the custom news feed.
         * @param {boolean} showAllPreparationRequired - Indicates whether to show all preparation required.
         * @returns {Promise} A Promise that resolves to an array of custom news feed items.
         */
        getCustomNewsFeed(sFeedId: string, showAllPreparationRequired: boolean): Promise<ICustomNewsFeed[]>;
        /**
         * Generates the URL for retrieving news feed details based on the provided news object.
         * The generated URL limits the number of results to 999.
         * @param {INewsItem} oNews - The news object containing properties such as changeId, title, and showAllPreparationRequired.
         * @returns {string} The URL for retrieving news feed details.
         */
        getNewsFeedDetailsUrl(oNews: INewsItem): string;
        /**
         * Retrieves the news feed from the specified URL after applying authorization filtering based on the available apps.
         * If the news feed contains impacted artifacts, it checks if the current user has access to any of the impacted apps.
         * If the user has access to at least one impacted app, the news feed is included in the returned array.
         * @param {string} sNewsUrl - The URL of the news feed.
         * @returns {Array} The filtered array of news feed items authorized for the user.
         */
        getAuthNewsFeed(sNewsUrl: string): Promise<ICustomNewsFeed[]>;
        /**
         * If the news feed contains impacted artifacts, it checks if the current user has access to any of the impacted apps.
         * If the user has access to at least one impacted app, the news feed is included in the returned array.
         * @param {ICustomNewsFeed[]} aNewsFeed - array of news feed
         * @param {IAvailableApp[]} aAvailableApps - array of all availabel apps
         * @returns {Array} The filtered array of news feed items authorized for the user.
         */
        private arrangeNewsFeeds;
        /**
         * takes all available apps list and the impacted atifact from the news and returns if it's valid
         * @param {IAvailableApp[]} aAvailableApps - Array of all available apps
         * @param {string} oImpactedArtifact - impacted artifact form the news
         * @returns {boolean} checks if the news is authenticated with the available apps list
         */
        private isAuthFeed;
        /**
         * Retrieves all available apps from the ClientSideTargetResolution service for authorization filtering.
         * @returns {Array} An array of available apps.
         */
        private getAllAvailableApps;
        /**
         * Retrieves the news feed details from the specified URL, including translation and formatting of field labels.
         * @param {string} sUrl - The URL of the news feed details.
         * @returns {Array} The array of news feed items with translated and formatted field labels.
         */
        private getNewsFeedDetails;
        /**
         * Retrieves translated text for news feed fields based on the specified feed ID.
         * @param {string} sFeedId - The ID of the custom news feed
         * @returns {Promise} A promise resolving to the translated text for news feed fields.
         */
        private getTranslatedText;
        /**
         * Loads custom news feed into the news panel after parsing JSON feed data to XML format.
         * @param {Array} feeds - The array of custom news feed items.
         */
        private loadCustomNewsFeed;
        /**
         * Parses JSON data into XML format.
         * @param {JSON[]} json - The JSON data to be parsed into XML.
         * @returns {XMLDocument} The XML document representing the parsed JSON data.
         */
        private parseJsonToXml;
        /**
         * Randomly selects an image from the available images for the feed item.
         * @param {string} sFileName - The file name of the custom news feed item.
         * @returns {string} The URL of the image for the feed item.
         */
        getCustomFeedImage(sFileName: string): string;
    }
}
//# sourceMappingURL=NewsPanel.d.ts.map