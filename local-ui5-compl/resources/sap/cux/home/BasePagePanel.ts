/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import type { MetadataOptions } from "sap/ui/core/Element";
import { $BasePagePanelSettings } from "./BasePagePanel";
import BasePanel from "./BasePanel";

/**
 *
 * Base Panel class for managing and storing Pages.
 *
 * @extends sap.ui.core.BasePanel
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
 * @alias sap.cux.home.BasePagePanel
 */
export default abstract class BasePagePanel extends BasePanel {
	constructor(idOrSettings?: string | $BasePagePanelSettings);
	constructor(id?: string, settings?: $BasePagePanelSettings);
	constructor(id?: string, settings?: $BasePagePanelSettings) {
		super(id, settings);
	}

	static readonly metadata: MetadataOptions = {
		library: "sap.cux.home",
		properties: {
			title: { type: "string", group: "Misc" },
			key: { type: "string", group: "Misc" }
		},
		aggregations: {
			pages: { type: "sap.cux.home.Page", singularName: "page", multiple: true }
		}
	};
}
