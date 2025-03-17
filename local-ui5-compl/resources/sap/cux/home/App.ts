/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import type { MetadataOptions } from "sap/ui/core/Element";
import Container from "sap/ushell/Container";
import SpaceContent from "sap/ushell/services/SpaceContent";
import { $AppSettings } from "./App";
import BaseApp from "./BaseApp";

/**
 *
 * App class for managing and storing Apps.
 *
 * @extends sap.cux.home.BaseApp
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.121.0
 *
 * @internal
 * @experimental Since 1.121
 * @private
 *
 * @alias sap.cux.home.App
 */
export default class App extends BaseApp {
	constructor(idOrSettings?: string | $AppSettings);
	constructor(id?: string, settings?: $AppSettings);
	constructor(id?: string, settings?: $AppSettings) {
		super(id, settings);
	}

	static readonly metadata: MetadataOptions = {
		library: "sap.cux.home",
		properties: {
			/**
			 * Url of the app where the user navigates to on click
			 */
			url: { type: "string", group: "Misc", defaultValue: "" },
			/**
			 * VizId of the app. Used for enabling addition of apps to FavoriteApp panel
			 */
			vizId: { type: "string", group: "Misc", defaultValue: "" }
		}
	};

	/**
	 * Navigates to the clicked app
	 * @private
	 */
	private async _launchApp(): Promise<void> {
		const spaceContentService = await Container.getServiceAsync<SpaceContent>("SpaceContent");
		await spaceContentService.launchTileTarget(this.getUrl(), this.getTitle());
	}

	/**
	 * App Press Handler
	 * @private
	 */
	public _handlePress(): void {
		if (this.getUrl()) {
			void this._launchApp();
		}
	}
}
