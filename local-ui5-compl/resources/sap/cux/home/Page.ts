/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import Element, { MetadataOptions } from "sap/ui/core/Element";
import Container from "sap/ushell/Container";
import Navigation from "sap/ushell/services/Navigation";
import { $PageSettings } from "./Page";
import { IPage } from "./interface/PageSpaceInterface";

/**
 *
 * Class for managing and storing Pages.
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
 * @alias sap.cux.home.Page
 */

export default class Page extends Element {
	constructor(idOrSettings?: string | $PageSettings);
	constructor(id?: string, settings?: $PageSettings);
	constructor(id?: string, settings?: $PageSettings) {
		super(id, settings);
	}
	static readonly metadata: MetadataOptions = {
		library: "sap.cux.home",
		properties: {
			/**
			 * Title for the  page
			 * @since 1.120
			 */
			title: { type: "string", group: "Misc", defaultValue: "" },
			/**
			 * Icon for the  page
			 * @since 1.120
			 */
			icon: { type: "string", group: "Misc", defaultValue: "" },
			/**
			 * Subtitle for the  page
			 * @since 1.120
			 */
			subTitle: { type: "string", group: "Misc", defaultValue: "" },
			/**
			 * Background color for the  page
			 * @since 1.120
			 */
			bgColor: { type: "string", group: "Misc", defaultValue: "" },
			/**
			 * Id for the corresponding page
			 * @since 1.120
			 * @experimental Since 1.120
			 */
			pageId: { type: "string", group: "Misc", defaultValue: "" },
			/**
			 * Space id for the corresponding page
			 * @since 1.120
			 * @experimental Since 1.120
			 */
			spaceId: { type: "string", group: "Misc", defaultValue: "" },
			/**
			 * Space title for the corresponding page
			 * @since 1.120
			 * @experimental Since 1.120
			 */
			spaceTitle: { type: "string", group: "Misc", defaultValue: "" },
			/**
			 * Url to be launched for the corresponding page
			 * @since 1.120
			 * @experimental Since 1.120
			 */
			url: { type: "string", group: "Misc", defaultValue: "" }
		},
		events: {
			/**
			 * Press event for the page
			 */
			press: {}
		}
	};

	public async onPageTilePress(oPage: IPage) {
		const sPageId = oPage.getProperty?.("pageId"),
			sSpaceId = oPage.getProperty?.("spaceId");
		const navigationService = await Container.getServiceAsync<Navigation>("Navigation");
		await navigationService.navigate({
			target: {
				semanticObject: "Launchpad",
				action: "openFLPPage"
			},
			params: {
				pageId: sPageId,
				spaceId: sSpaceId
			}
		});
	}
}
