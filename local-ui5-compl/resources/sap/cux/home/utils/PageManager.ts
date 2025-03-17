/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import BaseObject from "sap/ui/base/Object";
import Component from "sap/ui/core/Component";
import EventBus from "sap/ui/core/EventBus";
import Config from "sap/ushell/Config";
import Container from "sap/ushell/Container";
import Bookmark from "sap/ushell/services/BookmarkV2";
import { ISpacePagePersonalization } from "../interface/KeyUserInterface";
import { IColor, IPage, ISpace } from "../interface/PageSpaceInterface";
import ColorUtils from "./ColorUtils";
import { DEFAULT_BG_COLOR, FALLBACK_ICON, fnFetchLegendColor, MYHOME_SPACE_ID, PAGE_SELECTION_LIMIT } from "./Constants";
import { PAGES, SPACES } from "./PagesIconsConstants";
import UShellPersonalizer from "./UshellPersonalizer";

/**
 *
 * Provides the PageManager Class used for fetch and process user pages.
 *
 * @extends sap.ui.BaseObject
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.121.0
 *
 * @private
 * @experimental Since 1.121
 * @hidden
 *
 * @alias sap.cux.home.utils.PageManager
 */

export default class PageManager extends BaseObject {
	colorUtils: typeof ColorUtils = ColorUtils;
	persContainerId: string;
	oOwnerComponent: Component;
	_aSpaces!: ISpace[];
	_aPages!: IPage[];
	aFavPages!: IPage[];
	oPersonalizer!: UShellPersonalizer;
	oGetFavPagesPromise!: Promise<IPage[]>;
	static oCacheInstances: { [key: string]: PageManager } = {};
	private _eventBus: EventBus;
	private constructor(persContainerId: string, oOwnerComponent: Component) {
		super();
		this.persContainerId = persContainerId;
		this.oOwnerComponent = oOwnerComponent;
		this._eventBus = EventBus.getInstance();
	}

	static getInstance(persContainerId: string, oOwnerComponent: Component) {
		if (PageManager.oCacheInstances[persContainerId]) {
			return PageManager.oCacheInstances[persContainerId];
		}
		const pageManagerInstance = new PageManager(persContainerId, oOwnerComponent);
		PageManager.oCacheInstances[persContainerId] = pageManagerInstance;
		return pageManagerInstance;
	}

	private _getPersonalization() {
		return UShellPersonalizer.getInstance(this.persContainerId, this.oOwnerComponent);
	}

	public async fetchAllAvailableSpaces(): Promise<ISpace[]> {
		if (this._aSpaces) {
			return Promise.resolve(this._aSpaces);
		}
		const oBookmarkService: Bookmark = await Container.getServiceAsync("BookmarkV2");
		const aSpaces = (await oBookmarkService.getContentNodes()) as ISpace[];
		// Filter MyHome Space from Spaces
		this._aSpaces = aSpaces.filter((oSpace) => oSpace.id !== MYHOME_SPACE_ID);

		// Add Initial Default Color for Spaces
		this._aSpaces.forEach(function (oSpace) {
			oSpace.BGColor = DEFAULT_BG_COLOR();
			oSpace.applyColorToAllPages = false;
		});

		return this._aSpaces;
	}
	public async fetchAllAvailablePages(bFetchDistinctPages: boolean = false): Promise<IPage[]> {
		if (this._aPages) {
			return Promise.resolve(this._aPages);
		}
		const aSpaces = await this.fetchAllAvailableSpaces();
		this._aPages = [];
		aSpaces.forEach((oSpace: ISpace) => {
			if (Array.isArray(oSpace.children)) {
				oSpace.children.forEach((oPage: IPage) => {
					if (
						!bFetchDistinctPages ||
						(bFetchDistinctPages && !this._aPages.find((oExistingPage) => oExistingPage.id === oPage.id))
					) {
						this._aPages.push({
							title: oPage.label,
							icon: FALLBACK_ICON,
							isIconLoaded: false,
							pageId: oPage.id,
							spaceId: oSpace.id,
							spaceTitle: oSpace.label,
							url: "#Launchpad-openFLPPage?pageId=" + oPage.id + "&spaceId=" + oSpace.id
						});
					}
				});
			}
		});
		return this._aPages;
	}
	private _getDefaultPages(aAvailablePages: IPage[]): Promise<IPage[]> {
		const aFavoritePages = aAvailablePages.slice(0, PAGE_SELECTION_LIMIT) || [];
		return this.getFavPages(aFavoritePages);
	}
	// Get icons from icon constants file
	private _getIconForPage(oFavPage: IPage) {
		// Check for icon in page icon constants file
		let oIcon = PAGES.find((oPage) => oFavPage.pageId?.includes(oPage.id));

		if (!oIcon) {
			// Check for icon in space icon constants file
			oIcon = SPACES.find((oSpace) => oFavPage.spaceId?.includes(oSpace.id));
		}

		oFavPage.icon = oIcon?.icon || FALLBACK_ICON;
		oFavPage.isIconLoaded = true;
	}
	private _applyIconsForFavPages(aFavPages: IPage[]) {
		const aPageWithoutIcon = aFavPages.filter((oPage) => !oPage.isIconLoaded);
		aPageWithoutIcon.forEach((oPage: IPage) => {
			this._getIconForPage(oPage);
		});
	}
	public async getFavPages(aFavPages: IPage[], bUpdatePersonalisation: boolean = false) {
		aFavPages.forEach((oPage: IPage) => {
			oPage.selected = true;
			if (!oPage.BGColor) {
				oPage.BGColor = this.colorUtils.getFreeColor();
			} else {
				this.colorUtils.addColor(oPage.BGColor as string);
			}
		});

		// Update the Personalisation model
		if (bUpdatePersonalisation) {
			if (!this.oPersonalizer) {
				this.oPersonalizer = await this._getPersonalization();
			}
			let oPersData = await this.oPersonalizer.read();
			if (!oPersData) oPersData = { favouritePages: [] };
			oPersData.favouritePages = aFavPages;
			await this.oPersonalizer.write(oPersData);
			this._eventBus.publish("pageChannel", "pageUpdated");
		}

		// Fetch and apply Icons for Favorite Pages
		if (aFavPages.length) {
			this._applyIconsForFavPages(aFavPages);
		}
		return aFavPages;
	}
	public getFavoritePages(bForceUpdate: boolean = false) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const bSpaceEnabled = encodeURIComponent(Config.last("/core/spaces/enabled"));
		if (!bSpaceEnabled) {
			return Promise.resolve([]);
		}
		if (this.aFavPages && !bForceUpdate) {
			return Promise.resolve(this.aFavPages);
		}
		if (this.oGetFavPagesPromise === undefined) {
			this.oGetFavPagesPromise = this._getFavPages(bForceUpdate);
		}
		return this.oGetFavPagesPromise;
	}

	private async _getFavPages(bForceUpdate: boolean) {
		this.oPersonalizer = await this._getPersonalization();
		const oPersData = await this.oPersonalizer.read();
		const aFavoritePages: IPage[] = oPersData?.favouritePages || [];
		const aAvailablePages = await this.fetchAllAvailablePages(true);
		// Set first 8 available pages are favorite if no favorite page data is present
		if (!aFavoritePages.length) {
			this.aFavPages = await this._getDefaultPages(aAvailablePages);
		} else {
			let aPages: IPage[] = [],
				oExistingPage;
			aFavoritePages.forEach((oPage: IPage) => {
				oExistingPage = aAvailablePages.find(function (oAvailablePage) {
					return oAvailablePage.pageId === oPage.pageId;
				});
				if (oExistingPage) {
					oExistingPage.BGColor = oPage.BGColor;
					aPages.push(oExistingPage);
				}
			});
			// To send Maximum of 8 Pages (BCP incident: 2270169293)
			aPages = aPages.slice(0, PAGE_SELECTION_LIMIT);
			if (aPages.length || !aFavoritePages.length) {
				this.aFavPages = await this.getFavPages(aPages, aPages.length !== aFavoritePages.length || bForceUpdate);
			} else if (!aPages.length && aFavoritePages.length) {
				//Clean unaccessible page data
				oPersData.favouritePages = [];
				await this.oPersonalizer.write(oPersData);
				this.aFavPages = await this._getDefaultPages(aAvailablePages);
			}
		}
		return this.aFavPages;
	}

	public async applyColorPersonalizations(personalizations?: ISpacePagePersonalization[]) {
		if (!personalizations?.length) {
			return;
		}

		if (!this.aFavPages) {
			await this.getFavoritePages();
		}

		const allSpaces = await this.fetchAllAvailableSpaces();

		personalizations.forEach((personalization) => {
			const isPagePersonalization = !!personalization.pageId;
			const spaceObj = allSpaces?.find((space) => space.id === personalization.spaceId);
			const pageObj = spaceObj?.children.find((page) => page.id === personalization.pageId);
			const oPage = this.aFavPages.find((oPage) => oPage.pageId === personalization.pageId);
			// Update the Personalisation model for space
			if (!isPagePersonalization && spaceObj) {
				const colorObj = fnFetchLegendColor(personalization.BGColor as string);
				spaceObj.BGColor = colorObj;
				spaceObj.applyColorToAllPages = personalization.applyColorToAllPages;
				spaceObj.isSpacePersonalization = true;

				// Update the color for all pages in the space if applied
				spaceObj.children.forEach((oPage) => {
					const favPageObj = this.aFavPages.find((favPage) => favPage.pageId === oPage.id);
					if (favPageObj) {
						const favpageBGColor = favPageObj.isPagePersonalization ? favPageObj.oldColor : DEFAULT_BG_COLOR();
						favPageObj.BGColor = spaceObj.applyColorToAllPages ? personalization.BGColor : favpageBGColor;
						oPage.BGColor = favPageObj.BGColor;
					}
				});
			} else if (pageObj && oPage) {
				// Update the Personalisation model for page
				const pageBackgroundColor = spaceObj?.applyColorToAllPages
					? ({ ...spaceObj.BGColor } as IColor)
					: fnFetchLegendColor(personalization.BGColor as string);
				oPage.isPagePersonalization = true;
				pageObj.isPagePersonalization = true;
				oPage.BGColor = pageBackgroundColor;
				pageObj.BGColor = pageBackgroundColor;
				oPage.oldColor = fnFetchLegendColor(personalization.BGColor as string);
				pageObj.oldColor = fnFetchLegendColor(personalization.BGColor as string);
			}
		});

		this._eventBus.publish("pageChannel", "pageUpdated");
	}

	public async applyIconPersonalizations(personalizations?: ISpacePagePersonalization[]) {
		if (!personalizations?.length) {
			return;
		}

		if (!this.aFavPages) {
			await this._getFavPages(false);
		}
		const allSpaces = await this.fetchAllAvailableSpaces();

		personalizations.forEach((personalization) => {
			const isPagePersonalization = !!personalization.pageId;
			const spaceObj = allSpaces?.find((space) => space.id === personalization.spaceId);

			// Update the Personalisation model for space
			if (!isPagePersonalization) {
				if (spaceObj) {
					spaceObj.icon = personalization.icon;
					spaceObj.isSpaceIconPersonalization = true;

					// Update the icon for all pages in the space if applied
					spaceObj.children.forEach((oPage) => {
						if (!oPage.isPageIconPersonalization) {
							const favPageObj = this.aFavPages.find((favPage) => favPage.pageId === oPage.id);
							if (favPageObj) {
								favPageObj.icon = spaceObj.icon || FALLBACK_ICON;
								oPage.icon = spaceObj.icon || FALLBACK_ICON;
							}
						}
					});
				}
			} else {
				// Update the Personalisation model for page
				const pageObj = spaceObj?.children.find((page) => page.id === personalization.pageId);
				const oPage = this.aFavPages.find((oPage) => oPage.pageId === personalization.pageId);
				if (pageObj && oPage) {
					oPage.isPageIconPersonalization = true;
					pageObj.isPageIconPersonalization = true;
					oPage.icon = personalization.icon;
					pageObj.icon = personalization.icon;
					oPage.oldIcon = personalization.oldIcon;
					pageObj.oldIcon = personalization.oldIcon;
				}
			}
		});

		this._eventBus.publish("pageChannel", "pageUpdated");
	}
}
