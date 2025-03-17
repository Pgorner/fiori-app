/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import type { $ExtensionSettings } from "sap/ui/integration/Extension";
import Extension from "sap/ui/integration/Extension";
import * as CardFormatters from "../formatters/CardFormatters";

export default class BaseIntegrationCardExtension extends Extension {
	constructor(id?: string, extensionSettings?: $ExtensionSettings) {
		super(id, extensionSettings);
		this.setFormatters(CardFormatters.getFormatters());
	}
}
