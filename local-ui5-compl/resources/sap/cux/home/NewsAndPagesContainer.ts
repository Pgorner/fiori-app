/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import FlexBox from "sap/m/FlexBox";
import type { MetadataOptions } from "sap/ui/core/Element";
import BaseContainer, { $BaseContainerSettings } from "./BaseContainer";
import BasePanel from "./BasePanel";
import NewsPanel from "./NewsPanel";
import PagePanel from "./PagePanel";
import { INewsFeedVisibiliyChange, INewsPersData, ISpacePagePersonalization } from "./interface/KeyUserInterface";
import { DeviceType } from "./utils/Device";

interface IpanelLoaded {
	[key: string]: { loaded: boolean; count: number };
}

/**
 *
 * Container class for managing and storing News and Pages.
 *
 * @extends sap.cux.home.BaseContainer
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.121
 *
 * @internal
 * @experimental Since 1.121
 * @public
 *
 * @alias sap.cux.home.NewsAndPagesContainer
 */

export default class NewsAndPagesContainer extends BaseContainer {
	static renderer = {
		...BaseContainer.renderer,
		apiVersion: 2
	};
	static readonly metadata: MetadataOptions = {
		properties: {
			/**
			 * Color Personalizations for Spaces & Pages
			 */
			colorPersonalizations: { type: "array", group: "Misc", defaultValue: [], visibility: "hidden" },
			/**
			 * Icon Personalizations for Spaces & Pages
			 */
			iconPersonalizations: { type: "array", group: "Misc", defaultValue: [], visibility: "hidden" },
			/**
			 * News feed visibility flag
			 */
			newsFeedVisibility: { type: "boolean", group: "Misc", defaultValue: true, visibility: "hidden" }
		}
	};

	private panelLoaded: IpanelLoaded = {};
	private pagePanel!: PagePanel;
	private newsPanel!: NewsPanel;

	constructor(idOrSettings?: string | $BaseContainerSettings);
	constructor(id?: string, settings?: $BaseContainerSettings);
	/**
	 * Constructor for the new News and Pages container.
	 *
	 * @param {string} [id] ID for the new control, generated automatically if an ID is not provided
	 * @param {object} [settings] Initial settings for the new control
	 */
	public constructor(id?: string, settings?: $BaseContainerSettings) {
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

		this.panelLoaded = {};
		this.setProperty("layout", "Horizontal");
	}

	public onBeforeRendering() {
		super.onBeforeRendering();
		const aContent = this.getContent() as PagePanel[];
		aContent.forEach((oContent) => {
			void oContent.getData();
		});
	}

	/**
	 * Sets property value for colorPersonalization.
	 * Overridden to update cached personalizations.
	 *
	 * @public
	 * @override
	 * @returns {NewsAndPagesContainer} the container for chaining
	 */
	setColorPersonalizations(personalizations: Array<ISpacePagePersonalization>): NewsAndPagesContainer {
		const existingPers = (this.getProperty("colorPersonalizations") as ISpacePagePersonalization[]) || [];
		const updatedPers = existingPers.concat(personalizations);
		this.setProperty("colorPersonalizations", updatedPers);
		this.getContent().forEach((oContent) => {
			if (oContent.getMetadata().getName() === "sap.cux.home.PagePanel") {
				(oContent as PagePanel).applyColorPersonalizations(updatedPers);
			}
		});
		return this;
	}

	/**
	 * Sets property value for iconPersonalization.
	 * Overridden to update cached personalizations.
	 *
	 * @public
	 * @override
	 * @returns {NewsAndPagesContainer} the container for chaining
	 */
	setIconPersonalizations(personalizations: Array<ISpacePagePersonalization>): NewsAndPagesContainer {
		const existingPers = (this.getProperty("iconPersonalizations") as ISpacePagePersonalization[]) || [];
		const updatedPers = existingPers.concat(personalizations);
		this.setProperty("iconPersonalizations", updatedPers);
		this.getContent().forEach((oContent) => {
			if (oContent.getMetadata().getName() === "sap.cux.home.PagePanel") {
				(oContent as PagePanel).applyIconPersonalizations(updatedPers);
			}
		});
		return this;
	}

	public newsVisibilityChangeHandler(personalization: INewsFeedVisibiliyChange) {
		const aContent = this.getContent();
		aContent.forEach((oContent: BasePanel) => {
			if (oContent.getMetadata().getName() === "sap.cux.home.NewsPanel") {
				let newsPanel = oContent as NewsPanel;
				if (personalization.isNewsFeedVisible) {
					this.setProperty("newsFeedVisibility", true);
					this._getPanelContentWrapper(newsPanel).setVisible(true);
				} else {
					this.setProperty("newsFeedVisibility", false);
					this._getPanelContentWrapper(newsPanel).setVisible(false);
				}
			}
		});
	}

	public newsPersonalization(personalizations: INewsPersData) {
		const aContent = this.getContent();
		aContent.forEach((oContent: BasePanel) => {
			if (oContent.getMetadata().getName() === "sap.cux.home.NewsPanel") {
				let newsPanel = oContent as NewsPanel;
				const newsFeedVisibility = Boolean(this.getProperty("newsFeedVisibility"));
				const url = personalizations.newsFeedURL;
				newsPanel.setProperty("url", personalizations.newsFeedURL);
				newsPanel.setProperty("showCustom", personalizations.showCustomNewsFeed);
				newsPanel.setProperty("customFeedKey", personalizations.customNewsFeedKey);
				newsPanel.setProperty("customFileName", personalizations.customNewsFeedFileName);

				if (newsFeedVisibility) {
					this._getPanelContentWrapper(newsPanel).setVisible(true);
					const customFeedKey = String(newsPanel.getProperty("customFeedKey"));
					const showCustom = Boolean(newsPanel.getProperty("showCustom"));
					if (showCustom && customFeedKey) {
						newsPanel.setProperty("newsAvailable", true);
						void newsPanel.setCustomNewsFeed(customFeedKey);
					} else if (!showCustom && url) {
						void newsPanel.setURL(url);
					} else {
						this._getPanelContentWrapper(newsPanel).setVisible(false);
						this.setProperty("newsFeedVisibility", false);
					}
				}
			}
		});
	}

	public panelLoadedFn(sPanelType: string, oVal: { loaded: boolean; count: number }) {
		// same issue of panelwrapper not available at this time
		const aContent = this.getContent();
		aContent.forEach((oContent: BasePanel) => {
			if (oContent.getMetadata().getName() === "sap.cux.home.PagePanel") {
				this.pagePanel = oContent as PagePanel;
			} else if (oContent.getMetadata().getName() === "sap.cux.home.NewsPanel") {
				this.newsPanel = oContent as NewsPanel;
			}
		});
		this.panelLoaded[sPanelType] = oVal;
		this.adjustLayout();
	}

	public adjustStyleLayout(bIsNewsTileVisible: boolean) {
		const sDeviceType = this.getDeviceType();
		const newsContentWrapper = this.newsPanel ? this._getPanelContentWrapper(this.newsPanel) : undefined;
		const pagesContentWrapper = this.pagePanel ? this._getPanelContentWrapper(this.pagePanel) : undefined;
		const containerWrapper = this._getInnerControl() as FlexBox;
		if (sDeviceType === DeviceType.Desktop || sDeviceType === DeviceType.LargeDesktop) {
			if (bIsNewsTileVisible) {
				pagesContentWrapper?.setWidth("50vw");
			}
			containerWrapper.setAlignItems("Center");
			containerWrapper.setDirection("Row");
			newsContentWrapper?.setWidth("100%");
			newsContentWrapper?.addStyleClass("sapMNewsFlex");
		} else if (sDeviceType === DeviceType.Tablet) {
			pagesContentWrapper?.setWidth("100%");
			newsContentWrapper?.setWidth("calc(100vw - 64px)");
			containerWrapper.setAlignItems("Baseline");
			containerWrapper.setDirection("Column");
		}

		if (pagesContentWrapper) {
			setTimeout(
				this.pagePanel.attachResizeHandler.bind(
					this.pagePanel,
					bIsNewsTileVisible,
					this.getDomRef()?.clientWidth || 0,
					pagesContentWrapper,
					containerWrapper
				)
			);
		}
	}

	/**
	 * Adjusts the layout of the all panels in the container.
	 *
	 * @private
	 * @override
	 */
	public adjustLayout() {
		if (this.pagePanel && this.newsPanel && this._getPanelContentWrapper(this.newsPanel).getVisible()) {
			if (this.panelLoaded["Page"]?.loaded && this.panelLoaded["News"]?.loaded) {
				// If Both Panels are available wait for both panels are successfully loaded to apply styling
				const bIsNewsTileVisible = true;
				this.adjustStyleLayout(bIsNewsTileVisible);
			} else if (this.panelLoaded["News"]?.loaded === false) {
				// In case News Panel fails to load remove the panel and apply styles for page to take full width
				const bIsNewsTileVisible = false;
				this.removeContent(this.newsPanel);
				this.adjustStyleLayout(bIsNewsTileVisible);
			} else if (this.panelLoaded["Page"]?.loaded === false) {
				this.removeContent(this.pagePanel);
			}
		} else if (this.pagePanel && this.panelLoaded["Page"]?.loaded) {
			// If News Panel is not present apply styles for page to take full width
			const bIsNewsTileVisible = false;
			this.adjustStyleLayout(bIsNewsTileVisible);
		}
	}
}
