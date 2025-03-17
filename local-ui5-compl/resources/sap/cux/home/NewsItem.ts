/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import { URLHelper } from "sap/m/library";
import type { MetadataOptions } from "sap/ui/core/Element";
import BaseNewsItem from "./BaseNewsItem";
import { $NewsItemSettings } from "./NewsItem";

/**
 *
 * Class for managing and storing News items.
 *
 * @extends sap.cux.home.BaseNewsItem
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.121
 *
 * @internal
 * @experimental Since 1.121
 * @private
 *
 * @alias sap.cux.home.NewsItem
 */
export default class NewsItem extends BaseNewsItem {
	constructor(idOrSettings?: string | $NewsItemSettings);
	constructor(id?: string, settings?: $NewsItemSettings);
	constructor(id?: string, settings?: $NewsItemSettings) {
		super(id, settings);
	}

	static readonly metadata: MetadataOptions = {
		library: "sap.cux.home",
		properties: {
			/**
			 * The URL of the news item. Clicking on the item navigates to this URL.
			 */
			url: { type: "string", group: "Misc", defaultValue: "" }
		}
	};

	/**
	 * Init lifecycle method
	 *
	 * @private
	 * @override
	 */
	public init(): void {
		super.init();
		this._oTile.attachPress(this, this.pressNewsItem.bind(this));
	}

	/**
	 * Sets the URL of the news item.
	 * @param {string} sUrl - The URL of the news item.
	 */
	public setUrl(sUrl: string): NewsItem {
		this._oTile.setUrl(sUrl);
		return this.setProperty("url", sUrl, true);
	}

	/**
	 * Gets the URL of the news item.
	 * @param {string} sUrl - The URL of the news item.
	 */
	public getUrl(): string {
		return this.getProperty("url") as string;
	}

	/**
	 * Handles the press event on the news item, redirecting the user to the specified URL.
	 */
	private pressNewsItem(): void {
		URLHelper.redirect(this.getUrl(), true);
	}
}
