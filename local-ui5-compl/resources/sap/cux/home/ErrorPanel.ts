/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import Button from "sap/m/Button";
import IllustratedMessage from "sap/m/IllustratedMessage";
import VBox from "sap/m/VBox";
import { MetadataOptions } from "sap/ui/core/Component";
import BasePanel from "./BasePanel";
import { $ErrorPanelSettings } from "./ErrorPanel";

/**
 *
 * Panel class for displaying Error Message.
 *
 * @extends sap.cux.home.BasePanel
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.122.0
 *
 * @internal
 * @experimental Since 1.122
 * @private
 *
 * @alias sap.cux.home.ErrorPanel
 */

export default class ErrorPanel extends BasePanel {
	constructor(idOrSettings?: string | $ErrorPanelSettings);
	constructor(id?: string, settings?: $ErrorPanelSettings);
	constructor(id?: string, settings?: $ErrorPanelSettings) {
		super(id, settings);
	}

	static readonly metadata: MetadataOptions = {
		library: "sap.cux.home",
		properties: {
			messageTitle: { type: "string", group: "Misc", defaultValue: "" },
			messageDescription: { type: "string", group: "Misc", defaultValue: "" },
			actionButton: { type: "sap.m.Button", group: "Misc" }
		}
	};
	private _oWrapperNoCardsVBox!: VBox;

	getData() {
		this.setProperty("enableSettings", false);
		if (!this._oWrapperNoCardsVBox) {
			const oIllustratedMessage = new IllustratedMessage({
				illustrationSize: "Spot",
				illustrationType: "sapIllus-AddDimensions",
				title: this.getProperty("messageTitle") as string,
				description: this.getProperty("messageDescription") as string
			});

			this._oWrapperNoCardsVBox = new VBox({
				backgroundDesign: "Solid"
			}).addStyleClass("sapUiSmallMarginTop");
			const oActionButton = this.getProperty("actionButton") as Button;
			if (oActionButton) {
				oIllustratedMessage.insertAdditionalContent(oActionButton, 0);
			}
			this._oWrapperNoCardsVBox.addItem(oIllustratedMessage);
			this._addContent(this._oWrapperNoCardsVBox);
		}
	}
}
