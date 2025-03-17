/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import ResourceBundle from "sap/base/i18n/ResourceBundle";
import GenericTile from "sap/m/GenericTile";
import NewsContent from "sap/m/NewsContent";
import TileContent from "sap/m/TileContent";
import { FrameType } from "sap/m/library";
import type { MetadataOptions } from "sap/ui/core/Element";
import Element from "sap/ui/core/Element";
import Lib from "sap/ui/core/Lib";
import { $BaseNewsItemSettings } from "./BaseNewsItem";

export interface INews {
	url?: string;
	title: string;
	description: string;
	pubDate: string;
	imageUrl: string;
	expandFields?: string;
}

/**
 *
 * Base class for managing and storing News items.
 *
 * @extends sap.ui.core.Element
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.121
 *
 * @internal
 * @experimental Since 1.121
 * @private
 *
 * @alias sap.cux.home.BaseNewsItem
 */
export default abstract class BaseNewsItem extends Element {
	constructor(idOrSettings?: string | $BaseNewsItemSettings);
	constructor(id?: string, settings?: $BaseNewsItemSettings);
	constructor(id?: string, settings?: $BaseNewsItemSettings) {
		super(id, settings);
	}
	protected _oTile!: GenericTile;
	protected _i18nBundle!: ResourceBundle;

	static readonly metadata: MetadataOptions = {
		library: "sap.cux.home",
		properties: {
			/**
			 * The image URL of the news.
			 */
			imageUrl: { type: "string", group: "Misc" },
			/**
			 * Title of the news
			 */
			title: { type: "string", group: "Misc" },
			/**
			 * Subtitle of the app
			 */
			subTitle: { type: "string", group: "Misc" },
			/**
			 * Footer of the app
			 */
			footer: { type: "string", group: "Misc" }
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
		this._i18nBundle = Lib.getResourceBundleFor("sap.cux.home.i18n") as ResourceBundle;
		if (!this._oTile) {
			this.createTile();
		}
	}

	/**
	 * Sets the image URL for the news item.
	 * @param {string} sUrl - The URL of the image.
	 */
	public setImageUrl(sUrl: string): BaseNewsItem {
		const imageUrl = sUrl;
		this._oTile.setBackgroundImage(imageUrl);
		return this.setProperty("imageUrl", imageUrl, true);
	}

	/**
	 * Sets the subTitle of the news item.
	 * @param {string} sText - The subTitle of the news item.
	 */
	public setSubTitle(sText: string): BaseNewsItem {
		(this._oTile.getTileContent()[0].getContent() as NewsContent).setSubheader(sText);
		return this.setProperty("subTitle", sText, true);
	}

	/**
	 * Sets the title of the news item.
	 * @param {string} sText - The Title of the news item.
	 */
	public setTitle(sText: string): BaseNewsItem {
		(this._oTile.getTileContent()[0].getContent() as NewsContent).setContentText(sText);
		return this.setProperty("title", sText, true);
	}

	/**
	 * Sets the footer of the news item.
	 * @param {string} sText - The footer of the news item.
	 */
	public setFooter(sText: string): BaseNewsItem {
		this._oTile.getTileContent()[0].setFooter(sText);
		return this.setProperty("footer", sText, true);
	}

	/**
	 * Retrieves the tile control associated with the news item.
	 * If the tile control does not exist, it is created.
	 * @returns {sap.m.Tile} The tile control.
	 */
	public getTile(): GenericTile {
		if (!this._oTile) {
			this.createTile();
		}
		return this._oTile;
	}

	/**
	 * Creates the tile control associated with the news item.
	 * @private
	 */
	public createTile(): void {
		this._oTile = new GenericTile({
			mode: "ArticleMode",
			frameType: "Stretch" as FrameType,
			backgroundImage: this.getImageUrl(),
			tileContent: [
				new TileContent("", {
					footer: this.getFooter(),
					content: new NewsContent("", {
						contentText: this.getTitle(),
						subheader: this.getSubTitle()
					})
				})
			]
		});
	}
}
