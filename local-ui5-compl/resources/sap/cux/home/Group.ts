/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import type { MetadataOptions } from "sap/ui/core/Element";
import BaseApp from "./BaseApp";
import { $GroupSettings } from "./Group";

/**
 *
 * Class for managing apps group.
 *
 * @extends sap.cux.home.BaseApp
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.121.0
 *
 * @private
 * @experimental Since 1.121
 *
 * @alias sap.cux.home.Group
 */
export default class Group extends BaseApp {
	constructor(idOrSettings?: string | $GroupSettings);
	constructor(id?: string, settings?: $GroupSettings);
	constructor(id?: string, settings?: $GroupSettings) {
		super(id, settings);
	}

	static readonly metadata: MetadataOptions = {
		library: "sap.cux.home",
		properties: {
			/**
			 * Number of apps, shown as folder badge
			 */
			number: { type: "string", group: "Misc", defaultValue: "" },
			/**
			 * Id of the group
			 */
			groupId: { type: "string", group: "Misc", defaultValue: "" }
		},
		aggregations: {
			/**
			 * Apps aggregation for Groups
			 */
			apps: { type: "sap.cux.home.App", multiple: true, singularName: "app" }
		},
		events: {
			press: {
				parameters: {
					groupId: { type: "string" }
				}
			}
		}
	};

	/**
	 * Handles the press event for a group.
	 * Retrieves the parent of the group and shows the group detail dialog.
	 * @private
	 */
	public _handlePress(): void {
		this.firePress({ groupId: this.getGroupId() });
	}
}
