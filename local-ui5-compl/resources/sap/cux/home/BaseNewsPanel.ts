/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import Button from "sap/m/Button";
import FlexItemData from "sap/m/FlexItemData";
import IllustratedMessage from "sap/m/IllustratedMessage";
import VBox from "sap/m/VBox";
import type { MetadataOptions } from "sap/ui/core/Element";
import VerticalLayout from "sap/ui/layout/VerticalLayout";
import { $BaseNewsPanelSettings } from "./BaseNewsPanel";
import BasePanel from "./BasePanel";
import NewsAndPagesContainer from "./NewsAndPagesContainer";
import { SETTINGS_PANELS_KEYS } from "./utils/Constants";

/**
 *
 * Base Panel class for managing and storing News.
 *
 * @extends sap.cux.home.BasePanel
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.121
 *
 * @abstract
 * @internal
 * @experimental Since 1.121
 * @private
 *
 * @alias sap.cux.home.BaseNewsPanel
 */
export default abstract class BaseNewsPanel extends BasePanel {
	constructor(idOrSettings?: string | $BaseNewsPanelSettings);
	constructor(id?: string, settings?: $BaseNewsPanelSettings);
	constructor(id?: string, settings?: $BaseNewsPanelSettings) {
		super(id, settings);
	}

	private errorCard!: VBox;
	private newsVerticalLayout!: VerticalLayout;

	static readonly metadata: MetadataOptions = {
		library: "sap.cux.home",
		aggregations: {
			/**
			 * Holds the news aggregation
			 */
			newsItems: { type: "sap.cux.home.BaseNewsItem", singularName: "newsItem", multiple: true }
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

		this.newsVerticalLayout = new VerticalLayout(`${this.getId()}-newsContent`, {
			content: [this.generateErrorMessage()],
			layoutData: new FlexItemData({
				id: `${this.getId()}-flexItemdata`,
				order: 0,
				growFactor: 1,
				maxWidth: "39.75rem"
			})
		});
		this._addContent(this.newsVerticalLayout);
	}

	/**
	 * Generates app wrapper for displaying apps.
	 * @private
	 * @returns The generated apps wrapper.
	 */
	protected getNewsWrapper(): VerticalLayout {
		return this.newsVerticalLayout;
	}

	/**
	 * Generates the error message wrapper with illustrated message.
	 * @private
	 * @returns Wrapper with illustrated message.
	 */
	protected generateErrorMessage(): VBox {
		if (!this.errorCard) {
			const oErrorMessage = new IllustratedMessage(`${this.getId()}-errorMessage`, {
				illustrationSize: "Spot",
				illustrationType: "sapIllus-SleepingBell",
				title: this._i18nBundle.getText("noNewsTitle"),
				description: this._i18nBundle.getText("noNewsDescription"),
				additionalContent: [
					new Button(`${this.getId()}-idManageNewsBtn`, {
						text: this._i18nBundle.getText("editLinkNews"),
						tooltip: this._i18nBundle.getText("editLinkNews"),
						type: "Emphasized",
						press: this.handleEditNews.bind(this)
					})
				]
			});
			this.errorCard = new VBox(`${this.getId()}-errorCard`, {
				wrap: "Wrap",
				backgroundDesign: "Solid",
				items: [oErrorMessage],
				visible: false
			});
		}
		return this.errorCard;
	}

	/**
	 * Handles the edit news event.
	 * Opens the news dialog for managing news data.
	 * @private
	 */
	protected handleEditNews() {
		const parentContainer = this.getParent() as NewsAndPagesContainer;
		parentContainer?._getLayout().openSettingsDialog(SETTINGS_PANELS_KEYS.NEWS);
	}
}
