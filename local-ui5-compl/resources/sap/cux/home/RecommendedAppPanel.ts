/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import Log from "sap/base/Log";
import Button from "sap/m/Button";
import IllustratedMessageType from "sap/m/IllustratedMessageType";
import { BackgroundDesign } from "sap/m/library";
import Link from "sap/m/Link";
import MessageStrip from "sap/m/MessageStrip";
import MessageToast from "sap/m/MessageToast";
import VBox from "sap/m/VBox";
import type { MetadataOptions } from "sap/ui/core/Element";
import EventBus from "sap/ui/core/EventBus";
import App from "./App";
import BaseAppPersPanel, { $BaseAppPersPanelSettings } from "./BaseAppPersPanel";
import BaseContainer from "./BaseContainer";
import MenuItem, { MenuItem$PressEvent } from "./MenuItem";
import { FEATURE_TOGGLES, REPO_BASE_URL, SETTINGS_PANELS_KEYS } from "./utils/Constants";
import { DeviceType } from "./utils/Device";
import { addFESRId } from "./utils/FESRUtil";
import HttpHelper from "./utils/HttpHelper";

const CONSTANTS = {
	USER_PREFERENCE_SRVC_URL: `${REPO_BASE_URL}UserPreference`,
	KEY: "recommendedApps"
};

/**
 *
 * Provides the RecommendedAppPanel Class.
 *
 * @extends sap.cux.home.BaseAppPersPanel
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.128.0
 *
 * @private
 * @experimental
 * @hidden
 *
 * @alias sap.cux.home.RecommendedAppPanel
 */
export default class RecommendedAppPanel extends BaseAppPersPanel {
	static readonly metadata: MetadataOptions = {
		library: "sap.cux.home",
		defaultAggregation: "apps",
		aggregations: {
			/**
			 * Apps aggregation for Recommended apps
			 */
			apps: { type: "sap.cux.home.App", singularName: "app", multiple: true, visibility: "hidden" }
		}
	};

	public constructor(id?: string, settings?: $BaseAppPersPanelSettings) {
		super(id, settings);
		this.setSupported(false);
	}

	public init() {
		super.init();
		this.setProperty("key", CONSTANTS.KEY);
		this.setProperty("title", this._i18nBundle.getText("recommendedAppsTab"));
		//subscribe to recommendation setting change event
		const eventBus = EventBus.getInstance();
		eventBus.subscribe("importChannel", "recommendationSettingChanged", (channelId?: string, eventId?: string, data?: object) => {
			const showRecommendation = (data as { showRecommendation: boolean }).showRecommendation;
			this.fireSupported({ isSupported: showRecommendation });
		});
		if (this.getDeviceType() !== DeviceType.Mobile) {
			void this._enableRecommendationTab();
		}
	}

	/**
	 * Overrides the wrapper for the apps panel to add message strip.
	 *
	 * @private
	 * @returns {sap.m.VBox} The apps panel wrapper.
	 */
	protected _generateWrapper() {
		const wrapperId = `${this.getId()}-recommendedPanelWrapper`;
		if (!this._controlMap.get(wrapperId)) {
			this._controlMap.set(
				wrapperId,
				new VBox(wrapperId, {
					items: [this._generateMessageStrip(), super._generateWrapper()],
					backgroundDesign: BackgroundDesign.Transparent
				})
			);
		}
		return this._controlMap.get(wrapperId) as VBox;
	}

	/**
	 * Fetch recommended apps and set apps aggregation
	 * @private
	 */
	public async loadApps() {
		let recommendedVisualizations = await this.appManagerInstance.getRecommendedVisualizations(true);
		recommendedVisualizations = recommendedVisualizations.map((visualization) => {
			return {
				...visualization,
				menuItems: this._getActions()
			};
		});
		this.destroyAggregation("apps", true);
		//convert apps objects array to apps instances
		const recommendedApps = this.generateApps(recommendedVisualizations);
		this.setApps(recommendedApps);
	}

	/**
	 * Returns message strip for recommended tab
	 * @private
	 * @returns {sap.cux.home.MessageStrip} - Message strip control.
	 */
	private _generateMessageStrip() {
		const messageStripId = `${this.getId()}-messageStrip`;
		if (!this._controlMap.get(messageStripId)) {
			this._controlMap.set(
				messageStripId,
				new MessageStrip(messageStripId, {
					text: this._i18nBundle.getText("recommendationMessageStrip"),
					showIcon: true,
					showCloseButton: true,
					link: new Link(`${messageStripId}-settings`, {
						text: this._i18nBundle.getText("settings"),
						press: () => (this.getParent() as BaseContainer)?._getLayout()?.openSettingsDialog(SETTINGS_PANELS_KEYS.ADVANCED)
					}).addStyleClass("sapUiNoMargin")
				}).addStyleClass("sapUiNoMarginBegin sapUiTinyMarginBottom")
			);
		}
		return this._controlMap.get(messageStripId) as MessageStrip;
	}

	/**
	 * Returns list of actions available for selected app
	 * @private
	 * @returns {sap.cux.home.MenuItem[]} - Array of list items.
	 */
	private _getActions(): MenuItem[] {
		const addToFavoritesItem = new MenuItem({
			title: this._i18nBundle.getText("addToFavorites"),
			icon: "sap-icon://add-favorite",
			press: (event) => {
				void this._addAppToFavorites(event);
			}
		});
		addFESRId(addToFavoritesItem, "acceptRecommendation");
		const notRelevantItem = new MenuItem({
			title: this._i18nBundle.getText("notRelevantRecommendation"),
			icon: "sap-icon://decline",
			press: (event) => {
				void this._rejectRecommendation(event);
			}
		});
		addFESRId(notRelevantItem, "rejectRecommendation");
		const actions = [addToFavoritesItem, notRelevantItem];
		return actions;
	}

	/**
	 * Rejects the selected app as recommendation
	 * @private
	 * @param {sap.ui.base.MenuItem$PressEvent} event - Event object.
	 */
	private async _rejectRecommendation(event: MenuItem$PressEvent) {
		this.setBusy(true);
		try {
			const source = event.getSource<MenuItem>();
			const app = source.getParent() as App;
			const title = app.getTitle();
			const recommendedVisualizations = await this.appManagerInstance.getRecommendedVisualizations();
			const visualization = recommendedVisualizations.find((viz) => viz.url === app.getUrl());
			const fioriId = visualization?.fioriId;
			if (fioriId) {
				const rejectPayload = {
					AppId: fioriId,
					Decision: 1
				};
				await HttpHelper.Post(CONSTANTS.USER_PREFERENCE_SRVC_URL, rejectPayload);
				await this.refresh();
				const message = this._i18nBundle.getText("rejectRecommendationMsg", [title]) as string;
				MessageToast.show(message);
			}
		} catch (error) {
			Log.error(error as string);
		} finally {
			this.setBusy(false);
		}
	}

	/**
	 * Checks if recommendation is enabled based on recommendation feature toggle and user personalization.
	 * @private
	 * @returns {Boolean} - Returns true if recommendation is enabled otherwise false.
	 */
	private async _isRecommendationEnabled() {
		const recommendationEnabled = await this.appManagerInstance.isFeatureEnabled(FEATURE_TOGGLES.RECOMMENDATION);
		if (recommendationEnabled) {
			const personalisation = await this.getPersonalization();
			return personalisation.showRecommendation ?? true;
		}
		return false;
	}

	/**
	 * Show recommendation tab if recommendation is enabled
	 * @private
	 */
	private async _enableRecommendationTab() {
		const isSupported = await this._isRecommendationEnabled();
		this.setSupported(isSupported);
		this.fireSupported({ isSupported });
	}

	/**
	 * Generates illustrated message for recommended apps panel.
	 * @private
	 * @override
	 * @returns {sap.m.IllustratedMessage} Illustrated error message.
	 */
	protected generateIllustratedMessage() {
		const illustratedMessage = super.generateIllustratedMessage();
		//overrride the default illustrated message, title, description and add additional content
		illustratedMessage.setIllustrationType(IllustratedMessageType.Tent);
		illustratedMessage.setTitle(this._i18nBundle.getText("noRecommendationsTitle"));
		illustratedMessage.setDescription(this._i18nBundle.getText("noRecommendationsDescription"));
		illustratedMessage.addAdditionalContent(
			new Button({
				text: this._i18nBundle.getText("settings"),
				tooltip: this._i18nBundle.getText("settings"),
				press: () => (this.getParent() as BaseContainer)?._getLayout()?.openSettingsDialog(SETTINGS_PANELS_KEYS.ADVANCED),
				type: "Emphasized"
			})
		);
		return illustratedMessage;
	}
}
