/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import type { MetadataOptions } from "sap/ui/core/Element";
import Element from "sap/ui/core/Element";
import { $MenuItemSettings } from "./MenuItem";

/**
 *
 * Class for managing and storing menu items.
 *
 * @extends Element
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.121
 *
 * @internal
 * @experimental Since 1.121
 * @public
 *
 * @alias sap.cux.home.MenuItem
 */
export default class MenuItem extends Element {
	constructor(id?: string | $MenuItemSettings);
	constructor(id?: string, settings?: $MenuItemSettings);
	/**
	 * Constructor for a new menu item.
	 *
	 * @param {string} [id] ID for the new control, generated automatically if an ID is not provided
	 * @param {object} [settings] Initial settings for the new control
	 */
	public constructor(id?: string, settings?: $MenuItemSettings) {
		super(id, settings);
	}

	static readonly metadata: MetadataOptions = {
		library: "sap.cux.home",
		properties: {
			/**
			 * Title of the menu item.
			 *
			 * @public
			 */
			title: { type: "string", group: "Misc", defaultValue: "", visibility: "public" },
			/**
			 * Icon of the menu item.
			 *
			 * @public
			 */
			icon: { type: "sap.ui.core.URI", group: "Misc", defaultValue: "", visibility: "public" },
			/**
			 * Type of the menu item visualization in the menu list
			 *
			 * @public
			 */
			type: { type: "string", group: "Misc", defaultValue: "Active", visibility: "public" },
			/**
			 * Visibility of the menu item in the menu list
			 *
			 * @public
			 */
			visible: { type: "boolean", group: "Misc", defaultValue: true, visibility: "public" }
		},
		events: {
			/**
			 * Fires whenever the menu item is pressed.
			 *
			 * @public
			 */
			press: {}
		}
	};
}
