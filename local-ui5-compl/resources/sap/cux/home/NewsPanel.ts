/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import Log from "sap/base/Log";
import FlexBox from "sap/m/FlexBox";
import SlideTile from "sap/m/SlideTile";
import Event from "sap/ui/base/Event";
import Component from "sap/ui/core/Component";
import type { MetadataOptions } from "sap/ui/core/Element";
import EventBus from "sap/ui/core/EventBus";
import DateFormat from "sap/ui/core/format/DateFormat";
import Context from "sap/ui/model/Context";
import XMLModel from "sap/ui/model/xml/XMLModel";
import Container from "sap/ushell/Container";
import BaseNewsPanel, { $BaseNewsPanelSettings } from "./BaseNewsPanel";
import MenuItem from "./MenuItem";
import NewsAndPagesContainer from "./NewsAndPagesContainer";
import NewsGroup from "./NewsGroup";
import NewsItem from "./NewsItem";
import { NewsType } from "./library";
import { addFESRId } from "./utils/FESRUtil";
import PersonalisationUtils from "./utils/PersonalisationUtils";
import UshellPersonalizer, { IPersonalizationData } from "./utils/UshellPersonalizer";

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

export interface ICustomNewsFeed {
	[key: string]: string | boolean | INewsLink | number | INewsLink[] | INewsParam;
}

export interface INewsItem {
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

export interface INewsLink {
	[key: string]: string;
}

export interface INewsParam {
	[key: string]: { [key: string]: string };
}

const BASE_URL = "/sap/opu/odata4/ui2/insights_srv/srvd/ui2/",
	NEWS_FEED_READ_API = BASE_URL + "insights_read_srv/0001/" + "NEWS_FEED",
	NEWS_FEED_TRANSLATION_API = BASE_URL + "insights_read_srv/0001/" + "NewsFeedColumnTranslation",
	NEWS_FEED_COUNT_URL = NEWS_FEED_READ_API + "/$count",
	DEFAULT_FEED_COUNT = 7,
	fnImagePlaceholder = function (sPath: string, N: number) {
		return Array.from({ length: N }, function (v, i) {
			return sPath + "/" + (i + 1) + ".jpg";
		});
	};

const CUSTOM_NEWS_FEED = {
		TITLE: "LineOfBusiness",
		LINK: "WhatsNewDocument",
		VALIDITY: "ValidAsOf",
		PREPARATION_REQUIRED: "PreparationRequired",
		EXCLUDE_FIELDS: [
			"ChangeId",
			"LineNumber",
			"LineOfBusiness",
			"SolutionArea",
			"Title",
			"Description",
			"Type",
			"ValidAsOf",
			"WhatsNewDocument",
			"Link"
		],
		IMAGE_URL: "sap/cux/home/img/CustomNewsFeed/",
		FESR_STEP_NAME: "custNewsSlide-press",
		EMPTY_DATA_ERROR_CODE: "NODATA"
	},
	CUSTOM_IMAGES: { [key: string]: string[] } = {
		"Application Platform and Infrastructure": fnImagePlaceholder("ApplicationPlatformandInfrastructure", 3),
		"Asset Management": fnImagePlaceholder("AssetManagement", 3),
		"Cross Applications": fnImagePlaceholder("CrossApplications", 3),
		Finance: fnImagePlaceholder("Finance", 3),
		Manufacturing: fnImagePlaceholder("Manufacturing", 3),
		"R&D / Engineering": fnImagePlaceholder("RnDandEngineering", 3),
		Sales: fnImagePlaceholder("Sales", 3),
		"Sourcing and Procurement": fnImagePlaceholder("SourcingandProcurement", 3),
		"Supply Chain": fnImagePlaceholder("SupplyChain", 3),
		default: ["default.jpg"]
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
	private oNewsTile!: SlideTile;
	private oNewsModel!: XMLModel;
	private image!: number;
	private pCustomNewsFeed!: INewsFeedPromise;
	private pCustomNewsFeedCount!: { [key: string]: Promise<number> };
	private pNewsFeed!: INewsFeedPromise;
	private bNewsLoad!: boolean;
	private oPersonalizer!: UshellPersonalizer;
	private oPersData!: IPersonalizationData;
	private aFavNewsFeed!: { items: string[]; showAllPreparationRequired: boolean };
	private _eventBus!: EventBus;

	static readonly metadata: MetadataOptions = {
		library: "sap.cux.home",
		properties: {
			/**
			 * The URL of the news item.
			 *
			 * @public
			 */
			url: { type: "string", group: "Misc", defaultValue: "", visibility: "public" },
			/**
			 * Type of the news item.
			 *
			 * @public
			 */
			type: {
				type: "sap.cux.home.NewsType",
				group: "Misc",
				visibility: "public",
				defaultValue: NewsType.RSS
			},
			/**
			 * The key of custom news feed.
			 *
			 * @public
			 */
			customFeedKey: { type: "string", group: "Misc", defaultValue: "", visibility: "public" },
			/**
			 * The filename of custom news feed.
			 *
			 */
			customFileName: { type: "string", group: "Misc", defaultValue: "" },
			/**
			 * The flag for custom news feed is checked or not.
			 */
			showCustom: { type: "boolean", group: "Misc", defaultValue: false },
			/**
			 * The flag to determine rss feed will load or not.
			 *
			 * @private
			 */
			newsAvailable: { type: "boolean", group: "Misc", defaultValue: true, visibility: "hidden" }
		},
		aggregations: {
			/**
			 * newsGroup aggregation for News
			 */
			newsGroup: { type: "sap.cux.home.NewsGroup", singularName: "newsGroup", multiple: true, visibility: "hidden" }
		}
	};

	constructor(idOrSettings?: string | $BaseNewsPanelSettings);
	constructor(id?: string, settings?: $BaseNewsPanelSettings);
	/**
	 * Constructor for a new News Panel.
	 *
	 * @param {string} [id] ID for the new control, generated automatically if an ID is not provided
	 * @param {object} [settings] Initial settings for the new control
	 */
	public constructor(id?: string, settings?: $BaseNewsPanelSettings) {
		super(id, settings);
	}

	/**
	 * Init lifecycle method
	 *
	 * @private
	 * @override
	 */
	public init(): void {
		super.init();

		this.oNewsTile = new SlideTile(this.getId() + "--idNewsSlide", {
			displayTime: 20000,
			width: "100%",
			height: "17rem"
		}).addStyleClass("newsTileMaxWidth sapUiSmallMarginTop sapUiSmallMarginBottom");

		this.getNewsWrapper().addContent(this.oNewsTile);
		this.setProperty("title", this._i18nBundle.getText("newsTitle"));
		this._eventBus = EventBus.getInstance();

		const menuItem = new MenuItem(`${this.getId()}-manageNews`, {
			title: this._i18nBundle.getText("mngNews"),
			icon: "sap-icon://edit",
			press: this.handleEditNews.bind(this)
		});
		this.addAggregation("menuItems", menuItem);
		addFESRId(menuItem, "manageNews");
	}

	/**
	 * Retrieves news data asynchronously.
	 * If the news model is not initialized, it initializes the XML model and loads news feed data.
	 * @returns {Promise} A promise that resolves when the news data is retrieved.
	 */

	public async getData() {
		const sUrl: string = this.getUrl();
		if (sUrl && !this.getProperty("showCustom")) {
			this.oNewsModel = await this.initializeXmlModel(sUrl);
			this.oNewsTile.setModel(this.oNewsModel);
		} else if (this.getProperty("showCustom")) {
			this.bNewsLoad = this.bNewsLoad || false;
			this.oPersonalizer = await UshellPersonalizer.getInstance(
				PersonalisationUtils.getPersContainerId(this),
				PersonalisationUtils.getOwnerComponent(this) as Component
			);
			this.oPersData = await this.oPersonalizer.read();
			const sCustomNewsFeedKey = this.getCustomFeedKey();
			if (sCustomNewsFeedKey) {
				void this.setCustomNewsFeed(sCustomNewsFeedKey);
			} else {
				this.handleFeedError();
			}
		} else {
			this.handleFeedError();
		}
	}

	/**
	 * Returns the custom news feed key property of NewsPanel
	 * @returns {string} custom news feed key
	 */
	public getCustomFeedKey(): string {
		const sCustomNewsFeedKey = this.getProperty("customFeedKey") as string;
		if (sCustomNewsFeedKey) {
			return sCustomNewsFeedKey;
		} else {
			return this.oPersData?.oAdaptationData?.customNewsFeedKey as string;
		}
	}

	/**
	 * Returns the Url property of NewsPanel
	 * @returns {any}
	 */
	public getUrl(): string {
		return this.getProperty("url") as string;
	}

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
	private async initializeXmlModel(sUrl: string): Promise<XMLModel> {
		const oParent = this.getParent() as NewsAndPagesContainer;
		return new Promise((resolve) => {
			const oNewsModel = new XMLModel(sUrl);
			oNewsModel.setDefaultBindingMode("OneWay");
			oNewsModel.attachRequestCompleted((oEvent: Event) => {
				void (async () => {
					if (!this.bNewsLoad) {
						oParent?.panelLoadedFn("News", { loaded: true, count: DEFAULT_FEED_COUNT });
						this.bNewsLoad = true;
					}
					const oDocument = oEvent.getSource<XMLModel>().getData() as XMLDocument;
					await this.loadNewsFeed(oDocument, 0);
					this._eventBus.publish("KeyUserChanges", "newsFeedLoadFailed", { showError: false, date: new Date() });
					resolve(oNewsModel);
				})();
			});
			oNewsModel.attachRequestFailed(() => {
				this.handleFeedError();
				if (!this.bNewsLoad) {
					oParent?.panelLoadedFn("News", { loaded: false, count: 0 });
					this.bNewsLoad = true;
				}
				this._eventBus.publish("KeyUserChanges", "newsFeedLoadFailed", { showError: true, date: new Date() });
				resolve(oNewsModel);
			});
		});
	}

	/**
	 * Loads the news feed based on the provided document and number of feeds.
	 * Determines the feed type (RSS, feed, custom) and binds the news tile accordingly.
	 * @param {Document} oDocument - The document containing the news feed data.
	 * @param {number} [noOfFeeds] - The number of feeds to be displayed. Defaults to a predefined value.
	 */
	private async loadNewsFeed(oDocument: Document, noOfFeeds: number) {
		let oBindingInfo: IBindingInfo;
		if (!oDocument?.querySelector("customFeed")) {
			await this.extractAllImageUrls(oDocument, noOfFeeds || DEFAULT_FEED_COUNT);
		}

		if (!!oDocument?.querySelector("rss") && !!oDocument?.querySelector("item")) {
			oBindingInfo = {
				path: "/channel/item/",
				length: noOfFeeds || DEFAULT_FEED_COUNT
			};
		} else if (!!oDocument?.querySelector("feed") && !!oDocument?.querySelector("entry")) {
			oBindingInfo = {
				path: "/entry/",
				length: noOfFeeds || DEFAULT_FEED_COUNT
			};
		} else if (!!oDocument?.querySelector("customFeed") && !!oDocument?.querySelector("item")) {
			oBindingInfo = {
				path: "/item/",
				length: noOfFeeds || DEFAULT_FEED_COUNT
			};
		} else {
			this.handleFeedError();
			return;
		}
		this.bindNewsTile(this.oNewsTile, oBindingInfo);
	}

	/**
	 * Handles errors that occur during the loading of the news feed.
	 * @returns {void}
	 */
	public handleFeedError(): void {
		if (this.getProperty("showCustom")) {
			this.generateErrorMessage().setVisible(true);
			this.oNewsTile.setVisible(false);
		} else {
			(this.getNewsWrapper()?.getParent() as FlexBox).setVisible(false);
			this.setProperty("newsAvailable", false);
		}
	}

	public async setURL(url: string) {
		this.setProperty("showCustom", false);
		this.setProperty("newsAvailable", true);
		this.generateErrorMessage().setVisible(false);
		(this.getNewsWrapper()?.getParent() as FlexBox).setVisible(true);
		this.oNewsTile.setVisible(true);
		this.setProperty("url", url);
		await this.getData();
	}

	/**
	 * Binds the news tile with the provided binding information.
	 * @param {sap.m.SlideTile} oSlideTile - The SlideTile control to be bound.
	 * @param {IBindingInfo} oBindingInfo - The binding information containing the path and length of the aggregation.
	 */
	private bindNewsTile(oSlideTile: SlideTile, oBindingInfo: IBindingInfo): void {
		if (oBindingInfo) {
			oSlideTile.bindAggregation("tiles", {
				path: oBindingInfo.path,
				length: oBindingInfo.length,
				templateShareable: false,
				factory: (sId: string, oContext: Context) => {
					const newsInfo = oContext.getObject() as XMLDocument;
					let oTile;
					if (newsInfo.getElementsByTagName("link").length > 0) {
						oTile = new NewsItem("", {
							url: newsInfo.getElementsByTagName("link")[0].textContent as string,
							title: newsInfo.getElementsByTagName("title")[0].textContent as string,
							subTitle: newsInfo.getElementsByTagName("description")[0].textContent as string,
							imageUrl: newsInfo.getElementsByTagName("imageUrl")[0].textContent as string,
							footer: this.formatDate(newsInfo.getElementsByTagName("pubDate")[0].textContent as string)
						});
					} else {
						oTile = new NewsGroup("", {
							title: newsInfo.getElementsByTagName("title")[0].textContent as string,
							subTitle: this._i18nBundle.getText("newsFeedDescription") as string,
							imageUrl: newsInfo.getElementsByTagName("imageUrl")[0].textContent as string,
							footer: newsInfo.getElementsByTagName("footer")[0].textContent as string
						});
					}
					this.addAggregation("newsItems", oTile, true);
					return oTile.getTile();
				}
			});
		}
	}

	/**
	 * Extracts images for all the news tiles
	 * @param {Document} oDocument - The document containing the news feed data.
	 * @param {number} [noOfFeeds] - The number of feeds to be displayed. Defaults to a predefined value.
	 */
	private async extractAllImageUrls(oDocument: Document, noOfFeeds: number) {
		for (let i = 0; i < noOfFeeds; i++) {
			const oItemElement = oDocument?.getElementsByTagName("item")[i];
			const sUrl: string = await this.extractImage(oItemElement.getElementsByTagName("link")[0].textContent as string);
			const oImageUrl = oDocument.createElement("imageUrl");
			oImageUrl.textContent = sUrl;
			oItemElement.appendChild(oImageUrl);
		}
	}

	/**
	 * Formats the publication date or the update date to a relative date-time format.
	 * @param {string} oPublished - The publication date.
	 * @returns {string} The formatted relative date-time string.
	 */
	private formatDate(oPublished: string): string {
		return this.toRelativeDateTime(new Date(oPublished));
	}

	/**
	 * Returns the favourite news feed for the custom news
	 * @returns {any}
	 */
	public getFavNewsFeed() {
		return this.aFavNewsFeed;
	}

	/**
	 * Extracts the image URL from the provided HREF link or link.
	 * @param {string} sHrefLink - The HREF link containing the image URL.
	 * @returns {Promise} A promise that resolves to the extracted image URL.
	 */
	private extractImage(sHrefLink: string): Promise<string> {
		const fnLoadPlaceholderImage = () => {
			const sPrefix = sap.ui.require.toUrl("sap.cux.home/src/sap/cux/home/utils/");
			this.image = this.image ? this.image + 1 : 1;
			this.image = this.image < 9 ? this.image : 1;
			return `${sPrefix}/imgNews/${this.image}.jpg`;
		};

		return fetch(sHrefLink)
			.then((res) => res.text())
			.then((sHTML) => {
				const aMatches = sHTML.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i);
				return Array.isArray(aMatches) && aMatches[1] ? aMatches[1] : fnLoadPlaceholderImage();
			})
			.catch(fnLoadPlaceholderImage);
	}

	/**
	 * Converts the given date to a relative date-time format.
	 * @param {Date} oDate - The date to be converted.
	 * @returns {string} The date in relative date-time format.
	 */
	private toRelativeDateTime(oDate: Date): string {
		const oRelativeDateFormatter = DateFormat.getDateTimeInstance({
			style: "medium",
			relative: true,
			relativeStyle: "short"
		});
		return oRelativeDateFormatter.format(new Date(oDate));
	}

	/**
	 * This method retrieves the count and feeds of the custom news feed asynchronously.
	 * If the count is not zero, it loads the custom news feed data and returns the feeds.
	 * @param {string} sFeedId - The ID of the custom news feed to set.
	 * @returns {Promise} A promise that resolves to an array of news feeds.
	 */
	public async setCustomNewsFeed(sFeedId: string): Promise<void> {
		try {
			this.oNewsTile.setVisible(true);
			this.generateErrorMessage().setVisible(false);
			this.oPersData = await this.oPersonalizer?.read();
			this.aFavNewsFeed = (this.oPersData?.favNewsFeed as { items: string[]; showAllPreparationRequired: boolean }) || { items: [] };
			let [iFeedCount, aFeeds] = await Promise.all([
				this.getCustomNewsFeedCount(sFeedId),
				this.getCustomNewsFeed(sFeedId, this.aFavNewsFeed.showAllPreparationRequired)
			]);
			if (aFeeds.length === 0 || iFeedCount === 0) {
				throw new Error();
			}
			//filer selected feeds from all news feed
			if (this.aFavNewsFeed?.items?.length) {
				aFeeds = aFeeds.filter((oNewsFeed) => {
					return this.aFavNewsFeed?.items.includes(oNewsFeed.title as string);
				});
			} else if (this.aFavNewsFeed?.items?.length === 0) {
				throw new Error("Error: No news feed available");
			}
			this.loadCustomNewsFeed(aFeeds);
		} catch (err) {
			Log.error(err as string);
			this.handleFeedError();
		}
	}

	/**
	 * Retrieves the count of custom news feed items identified by the provided feed ID.
	 * @param {string} sFeedId - The ID of the custom news feed.
	 * @returns {Promise} A Promise that resolves to the count of custom news feed items.
	 */
	public async getCustomNewsFeedCount(sFeedId: string): Promise<number> {
		let sUrl = encodeURI(NEWS_FEED_COUNT_URL + "?$filter=ChangeId" + " eq " + "'" + sFeedId + "'");
		this.pCustomNewsFeedCount = this.pCustomNewsFeedCount ? this.pCustomNewsFeedCount : {};
		this.pCustomNewsFeedCount[sUrl] =
			this.pCustomNewsFeedCount[sUrl] !== undefined
				? this.pCustomNewsFeedCount[sUrl]
				: ((await (await fetch(sUrl)).json()) as Promise<number>);
		return this.pCustomNewsFeedCount[sUrl];
	}

	/**
	 * Retrieves custom news feed items identified by the provided feed ID and settings.
	 * It processes the response data and returns an array of custom news feed items.
	 * @param {string} sFeedId - The ID of the custom news feed.
	 * @param {boolean} showAllPreparationRequired - Indicates whether to show all preparation required.
	 * @returns {Promise} A Promise that resolves to an array of custom news feed items.
	 */
	public async getCustomNewsFeed(sFeedId: string, showAllPreparationRequired: boolean): Promise<ICustomNewsFeed[]> {
		try {
			const sUrl = this.getNewsFeedDetailsUrl({ changeId: sFeedId, showAllPreparationRequired: showAllPreparationRequired });
			this.pCustomNewsFeed = this.pCustomNewsFeed ? this.pCustomNewsFeed : {};
			this.pCustomNewsFeed[sUrl] =
				this.pCustomNewsFeed[sUrl] !== undefined
					? this.pCustomNewsFeed[sUrl]
					: (this.getAuthNewsFeed(sUrl) as Promise<ICustomNewsFeed[]>);
			const oResponse = await this.pCustomNewsFeed[sUrl];
			const oFeedDict: { [key: string]: string } = {};
			const aFeeds: ICustomNewsFeed[] = [];
			if ((oResponse as ICustomNewsFeed[])?.length > 0) {
				(oResponse as ICustomNewsFeed[]).forEach((oFeed: ICustomNewsFeed) => {
					const title = oFeed[CUSTOM_NEWS_FEED.TITLE] as INewsLink;
					if (!oFeedDict[title.value]) {
						aFeeds.push({
							title: title.value,
							footer: (oFeed[CUSTOM_NEWS_FEED.VALIDITY] as INewsLink).value,
							imageUrl: this.getCustomFeedImage(title.value)
						});
						oFeedDict[title.value] = title.value;
					}
				});
			}
			return aFeeds;
		} catch (err) {
			Log.error(err as string);
			throw new Error(err as string);
		}
	}

	/**
	 * Generates the URL for retrieving news feed details based on the provided news object.
	 * The generated URL limits the number of results to 999.
	 * @param {INewsItem} oNews - The news object containing properties such as changeId, title, and showAllPreparationRequired.
	 * @returns {string} The URL for retrieving news feed details.
	 */
	public getNewsFeedDetailsUrl(oNews: INewsItem) {
		let sUrl = NEWS_FEED_READ_API + "?$filter=ChangeId eq " + "'" + oNews.changeId + "'";
		sUrl = oNews.title ? sUrl + " and LineOfBusiness eq " + "'" + encodeURI(oNews.title) + "'" : sUrl;
		sUrl = oNews.showAllPreparationRequired ? sUrl + " and PreparationRequired eq true" : sUrl;
		return sUrl + "&$top=999";
	}

	/**
	 * Retrieves the news feed from the specified URL after applying authorization filtering based on the available apps.
	 * If the news feed contains impacted artifacts, it checks if the current user has access to any of the impacted apps.
	 * If the user has access to at least one impacted app, the news feed is included in the returned array.
	 * @param {string} sNewsUrl - The URL of the news feed.
	 * @returns {Array} The filtered array of news feed items authorized for the user.
	 */
	public async getAuthNewsFeed(sNewsUrl: string) {
		try {
			const [aAvailableApps, aNewsFeed] = await Promise.all([this.getAllAvailableApps(), this.getNewsFeedDetails(sNewsUrl)]);
			if (aAvailableApps.length === 0) {
				return aNewsFeed;
			}
			return this.arrangeNewsFeeds(aNewsFeed, aAvailableApps);
		} catch (err) {
			Log.error(err as string);
		}
	}

	/**
	 * If the news feed contains impacted artifacts, it checks if the current user has access to any of the impacted apps.
	 * If the user has access to at least one impacted app, the news feed is included in the returned array.
	 * @param {ICustomNewsFeed[]} aNewsFeed - array of news feed
	 * @param {IAvailableApp[]} aAvailableApps - array of all availabel apps
	 * @returns {Array} The filtered array of news feed items authorized for the user.
	 */
	private arrangeNewsFeeds(aNewsFeed: ICustomNewsFeed[], aAvailableApps: IAvailableApp[]) {
		const aAuthNewsFeed: ICustomNewsFeed[] = [];

		aNewsFeed.forEach((oNewsFeed: ICustomNewsFeed) => {
			if ((oNewsFeed.Category as INewsLink).value !== "App" || !(oNewsFeed.ImpactedArtifacts as INewsLink).value) {
				aAuthNewsFeed.push(oNewsFeed);
			} else {
				const aImpactedArtifacts: string[] = (oNewsFeed.ImpactedArtifacts as INewsLink).value.split("\n");
				for (let impactedArtifact of aImpactedArtifacts) {
					const oImpactedArtifact = impactedArtifact;
					if (oImpactedArtifact && this.isAuthFeed(aAvailableApps, impactedArtifact)) {
						aAuthNewsFeed.push(oNewsFeed);
						break;
					}
				}
			}
		});
		return aAuthNewsFeed;
	}

	/**
	 * takes all available apps list and the impacted atifact from the news and returns if it's valid
	 * @param {IAvailableApp[]} aAvailableApps - Array of all available apps
	 * @param {string} oImpactedArtifact - impacted artifact form the news
	 * @returns {boolean} checks if the news is authenticated with the available apps list
	 */
	private isAuthFeed(aAvailableApps: IAvailableApp[], oImpactedArtifact: string) {
		const fioriIdSplitter = "|";
		if (oImpactedArtifact.includes(fioriIdSplitter)) {
			const aTokens = oImpactedArtifact.split(fioriIdSplitter);
			const sFioriId = (aTokens[aTokens.length - 1] || "").trim();
			if (sFioriId) {
				const index = aAvailableApps.findIndex((oApp: IAvailableApp) => {
					return sFioriId === oApp?.signature?.parameters["sap-fiori-id"]?.defaultValue?.value;
				});
				return index > -1;
			}
		}
		return true;
	}

	/**
	 * Retrieves all available apps from the ClientSideTargetResolution service for authorization filtering.
	 * @returns {Array} An array of available apps.
	 */
	private async getAllAvailableApps(): Promise<IAvailableApp[]> {
		try {
			const oService = await Container.getServiceAsync<IAppConfiguration>("ClientSideTargetResolution");
			return oService?._oAdapter._aInbounds || [];
		} catch (err) {
			if (err instanceof Error) {
				Log.error(err.message);
			}
			return [];
		}
	}

	/**
	 * Retrieves the news feed details from the specified URL, including translation and formatting of field labels.
	 * @param {string} sUrl - The URL of the news feed details.
	 * @returns {Array} The array of news feed items with translated and formatted field labels.
	 */
	private async getNewsFeedDetails(sUrl: string): Promise<ICustomNewsFeed[]> {
		this.pNewsFeed = this.pNewsFeed ? this.pNewsFeed : {};
		this.pNewsFeed[sUrl] =
			this.pNewsFeed[sUrl] !== undefined
				? this.pNewsFeed[sUrl]
				: ((await (await fetch(sUrl)).json()) as Promise<{ value: ICustomNewsFeed[] }>);
		const fnFormattedLabel = (sLabel: string) => sLabel.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
		const [newsResponse, translationResponse] = await Promise.all([
			this.pNewsFeed[sUrl],
			this.getTranslatedText(this.getCustomFeedKey())
		]);
		const aNews: ICustomNewsFeed[] = JSON.parse(JSON.stringify((newsResponse as INewsResponse).value || [])) as ICustomNewsFeed[];
		const aTranslation = JSON.parse(JSON.stringify((translationResponse as INewsResponse).value || [])) as ITranslatedText[];
		return aNews.map((oNews: ICustomNewsFeed) => {
			const aFields = Object.keys(oNews);
			const aExpandFields: INewsLink[] = [];
			aFields.forEach((oField) => {
				const oTranslatedField = aTranslation.find(
					(oTranslation: ITranslatedText) => oTranslation?.ColumnName?.toUpperCase() === oField.toUpperCase()
				);
				const oTranslatedFieldName = (oTranslatedField?.TranslatedName as string) || fnFormattedLabel(oField);
				oNews[oField] = { label: oTranslatedFieldName, value: oNews[oField] as string } as INewsLink;
				if (!CUSTOM_NEWS_FEED.EXCLUDE_FIELDS.includes(oField)) {
					aExpandFields.push(oNews[oField]);
				}
			});
			oNews.Link = {
				label: this._i18nBundle.getText("readMoreLink") as string,
				value: oNews[CUSTOM_NEWS_FEED.LINK] as string,
				text: "Link"
			};
			oNews.expanded = aNews.length === 1;
			oNews.expandFields = aExpandFields;
			return oNews;
		});
	}

	/**
	 * Retrieves translated text for news feed fields based on the specified feed ID.
	 * @param {string} sFeedId - The ID of the custom news feed
	 * @returns {Promise} A promise resolving to the translated text for news feed fields.
	 */
	private async getTranslatedText(sFeedId: string) {
		try {
			const sUrl = NEWS_FEED_TRANSLATION_API + "?$filter=Changeid eq '" + sFeedId + "'";
			this.pCustomNewsFeed = this.pCustomNewsFeed ? this.pCustomNewsFeed : {};
			this.pCustomNewsFeed[sUrl] =
				this.pCustomNewsFeed[sUrl] !== undefined
					? this.pCustomNewsFeed[sUrl]
					: ((await (await fetch(sUrl)).json()) as Promise<ICustomNewsFeed[]>);
			return this.pCustomNewsFeed[sUrl];
		} catch (err) {
			if (err instanceof Error) {
				Log.error(err.message);
			}
			return [];
		}
	}

	/**
	 * Loads custom news feed into the news panel after parsing JSON feed data to XML format.
	 * @param {Array} feeds - The array of custom news feed items.
	 */
	private loadCustomNewsFeed(feeds: ICustomNewsFeed[]) {
		const oXMLResponse = this.parseJsonToXml(JSON.parse(JSON.stringify(feeds)) as JSON[]);
		const oParent = this.getParent() as NewsAndPagesContainer;
		if (!this.oNewsModel) {
			this.oNewsModel = new XMLModel(oXMLResponse);
			if (!this.bNewsLoad) {
				oParent?.panelLoadedFn("News", { loaded: true, count: DEFAULT_FEED_COUNT });
				this.bNewsLoad = true;
			}
			this.oNewsTile.setModel(this.oNewsModel);
		} else {
			this.oNewsModel.setData(oXMLResponse);
		}
		void this.loadNewsFeed(oXMLResponse, feeds.length);
	}

	/**
	 * Parses JSON data into XML format.
	 * @param {JSON[]} json - The JSON data to be parsed into XML.
	 * @returns {XMLDocument} The XML document representing the parsed JSON data.
	 */
	private parseJsonToXml(json: JSON[]): XMLDocument {
		const _transformJsonForXml = (aData: JSON[]) => aData.map((data: JSON) => ({ item: data }));
		const _jsonToXml = (json: JSON) => {
			let xml = "";
			let key: string;
			for (key in json) {
				const value = json[key as keyof typeof json];
				if (value) {
					if (typeof value === "object") {
						xml += `<${key}>${_jsonToXml(value)}</${key}>`;
					} else {
						xml += `<${key}>${value as string}</${key}>`;
					}
				}
			}
			return xml.replace(/<\/?\d+>/g, "");
		};
		const transformedJson: JSON = JSON.parse(JSON.stringify(_transformJsonForXml(json))) as JSON;
		let xml = "<?xml version='1.0' encoding='UTF-8'?>";
		const rootToken = "customFeed";
		xml += `<${rootToken}>`;
		xml += _jsonToXml(transformedJson);
		xml += `</${rootToken}>`;
		xml = xml.replaceAll("&", "&amp;");
		const parser = new DOMParser();
		return parser.parseFromString(xml, "text/xml");
	}

	/**
	 * Randomly selects an image from the available images for the feed item.
	 * @param {string} sFileName - The file name of the custom news feed item.
	 * @returns {string} The URL of the image for the feed item.
	 */
	public getCustomFeedImage(sFileName: string) {
		const sFileBasePath = sap.ui.require.toUrl(CUSTOM_NEWS_FEED.IMAGE_URL);
		let sFilePath = sFileBasePath + CUSTOM_IMAGES.default[0];
		const files = CUSTOM_IMAGES[sFileName] || [];
		let randomIndex = 0;
		if (files.length > 0) {
			const randomArray = new window.Uint32Array(1);
			window.crypto.getRandomValues(randomArray);
			randomIndex = randomArray[0] % 3;
			sFilePath = sFileBasePath + files[randomIndex];
		}
		return sFilePath;
	}
}
