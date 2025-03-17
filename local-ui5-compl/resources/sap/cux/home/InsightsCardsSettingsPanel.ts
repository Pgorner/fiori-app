/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import ManageCards from "sap/insights/ManageCards";
import Dialog from "sap/m/Dialog";
import Control from "sap/ui/core/Control";
import BaseSettingsPanel, { BaseSettingsPanel$PanelNavigatedEvent } from "./BaseSettingsPanel";
import CardsPanel from "./CardsPanel";
import { SETTINGS_PANELS_KEYS } from "./utils/Constants";

interface IContext {
	cardId?: string;
}

/**
 *
 * Class for My Home Insights Cards Settings Panel.
 *
 * @extends BaseSettingsPanel
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.121
 *
 * @internal
 * @experimental Since 1.121
 * @private
 *
 * @alias sap.cux.home.InsightsCardsSettingsPanel
 */
export default class InsightsCardsSettingsPanel extends BaseSettingsPanel {
	private eventAttached: boolean = false;
	private manageCardsInstance!: ManageCards;
	/**
	 * Init lifecycle method
	 *
	 * @public
	 * @override
	 */
	public init(): void {
		super.init();

		//setup panel
		this.setProperty("key", SETTINGS_PANELS_KEYS.INSIGHTS_CARDS);
		this.setProperty("title", this._i18nBundle.getText("insightsCards"));
		this.setProperty("icon", "sap-icon://card");
		this.setProperty("showHeader", false);

		//setup layout content
		this.addAggregation("content", this._getContent());

		//fired every time on panel navigation
		this.attachPanelNavigated((event: BaseSettingsPanel$PanelNavigatedEvent) => {
			const cardId = (event.getParameter("context") as IContext)?.cardId;
			this.manageCardsInstance?.setProperty("cardId", cardId || "");
			if (!this.eventAttached) {
				this.eventAttached = true;
				(this.getParent() as Dialog)?.attachAfterClose(() => {
					void (this._getPanel() as CardsPanel)?.renderPanel();
				});
			}
		});
	}

	/**
	 * Returns the content for the Insights Cards Settings Panel.
	 *
	 * @private
	 * @returns {Control} The control containing the Insights Cards Settings Panel content.
	 */
	private _getContent(): Control {
		if (!this.manageCardsInstance) {
			this.manageCardsInstance = new ManageCards();
		}
		return this.manageCardsInstance;
	}
}
