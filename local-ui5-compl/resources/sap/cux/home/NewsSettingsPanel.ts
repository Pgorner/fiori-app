/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import HBox from "sap/m/HBox";
import Label from "sap/m/Label";
import List from "sap/m/List";
import ListItemBase from "sap/m/ListItemBase";
import StandardListItem from "sap/m/StandardListItem";
import Switch from "sap/m/Switch";
import Text from "sap/m/Text";
import Title from "sap/m/Title";
import VBox from "sap/m/VBox";
import Component from "sap/ui/core/Component";
import Control from "sap/ui/core/Control";
import BaseSettingsPanel from "./BaseSettingsPanel";
import NewsPanel, { ICustomNewsFeed } from "./NewsPanel";
import { SETTINGS_PANELS_KEYS } from "./utils/Constants";
import { addFESRSemanticStepName, FESR_EVENTS } from "./utils/FESRUtil";
import PersonalisationUtils from "./utils/PersonalisationUtils";
import UshellPersonalizer from "./utils/UshellPersonalizer";

/**
 *
 * Class for My Home News Settings Panel.
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
 * @alias sap.cux.home.NewsSettingsPanel
 */
export default class NewsSettingsPanel extends BaseSettingsPanel {
	private oShowSwitch!: Switch;
	private oList!: List;
	private oPersonalizer!: UshellPersonalizer;
	private oNewsPanel!: NewsPanel;
	private aFavNewsFeed!: ICustomNewsFeed[] | string[];

	/**
	 * Init lifecycle method
	 *
	 * @public
	 * @override
	 */
	public init(): void {
		super.init();

		//setup panel
		this.setProperty("key", SETTINGS_PANELS_KEYS.NEWS);
		this.setProperty("title", this._i18nBundle.getText("news"));
		this.setProperty("icon", "sap-icon://newspaper");

		//setup layout content
		this.addAggregation("content", this.getContent());

		//fired every time on panel navigation
		this.attachPanelNavigated(() => {
			void this.loadNewsFeedSettings();
		});
		this.aFavNewsFeed = [];
	}

	/**
	 * Returns the content for the News Settings Panel.
	 *
	 * @private
	 * @returns {Control} The control containing the News Settings Panel content.
	 */
	private getContent(): Control {
		const oHeader = this.setHeader();
		const oTitle = this.setTitleMessage();
		const oContentVBox = new VBox(this.getId() + "--idNewsPageOuterVBoX", {
			alignItems: "Start",
			justifyContent: "SpaceBetween",
			items: [oHeader, oTitle, this.setNewsList()]
		});
		return oContentVBox;
	}

	/**
	 * Get personalization instance
	 */
	private async getPersonalization() {
		if (!this.oPersonalizer) {
			this.oPersonalizer = await UshellPersonalizer.getInstance(
				PersonalisationUtils.getPersContainerId(this._getPanel()),
				PersonalisationUtils.getOwnerComponent(this._getPanel()) as Component
			);
		}
		return this.oPersonalizer;
	}

	/**
	 * Returns the content for the News Settings Panel Header.
	 *
	 * @private
	 * @returns {sap.ui.core.Control} The control containing the News Settings Panel's Header content.
	 */
	private setHeader() {
		const oHeaderText = new Text(this.getId() + "--idCustNewsFeedSettingsText", {
			text: this._i18nBundle.getText("newsFeedSettingsText")
		});
		const oHeaderVBox = new VBox(this.getId() + "--idCustNewsFeedSettingsTextContainer", {
			alignItems: "Start",
			justifyContent: "SpaceBetween",
			items: [oHeaderText]
		}).addStyleClass("sapUiSmallMarginTop sapUiSmallMarginBegin");
		return oHeaderVBox;
	}

	/**
	 * Returns the content for the News Settings Panel Title description.
	 *
	 * @private
	 * @returns {sap.ui.core.Control} The control containing the News Settings Panel's Title description.
	 */
	private setTitleMessage() {
		const oTitle = new Title(this.getId() + "--idCustNewsFeedSettignsTitle", {
			text: this._i18nBundle.getText("newsFeedSettingsHeading"),
			titleStyle: "H5"
		});
		const oTitleHbox = new HBox(this.getId() + "--idCustNewsFeedSettingsTitleContainer", {
			alignItems: "Center",
			justifyContent: "SpaceBetween",
			items: [oTitle]
		});
		const oTitleVBox = new VBox(this.getId() + "--idCustNewsFeedSettingsTitleVBox", {
			alignItems: "Start",
			justifyContent: "SpaceBetween",
			items: [oTitleHbox]
		}).addStyleClass("sapUiSmallMarginTop sapUiSmallMarginBegin");
		return oTitleVBox;
	}

	/**
	 * Returns the content for the news List
	 *
	 * @private
	 * @returns {sap.ui.core.Control} The control containing the News Settings Panel's List
	 */
	private setNewsList() {
		//showAllPrepRequired Switch
		const oShowSwitchLabel = new Label(this.getId() + "--idShowAllCustNewsSwitchLabel", {
			text: this._i18nBundle.getText("showAllPreparationRequiredSwitchLabel")
		});
		this.oShowSwitch = new Switch("", {
			// 'ariaLabelledBy': "idShowAllCustNewsSwitchLabel idShowAllCustNewsSwitch",
			customTextOn: " ",
			customTextOff: " ",
			change: () => {
				void this.saveNewsFeedSettings();
			},
			// 'fesr:change': "showPrepRequire",
			state: false
		});
		addFESRSemanticStepName(this.oShowSwitch, FESR_EVENTS.CHANGE, "showPrepRequire");
		const oCustNewsSwitchContainer = new HBox(this.getId() + "--idShowAllCustNewsSwitchContainer", {
			alignItems: "Center",
			items: [oShowSwitchLabel, this.oShowSwitch],
			width: "94%"
		}).addStyleClass("sapUiSmallMarginTop");

		const oShowAllPrep = new VBox(this.getId() + "--idShowAllCustNewsSwitchVBox", {
			items: [oCustNewsSwitchContainer],
			width: "94%"
		}).addStyleClass("sapUiSmallMarginTop");
		//List of news items
		this.oList = new List(this.getId() + "--idCustNewsFeedList", {
			mode: "MultiSelect",
			selectionChange: () => {
				void this.saveNewsFeedSettings();
			}
		});
		//Outer VBox
		const oNewsListVBox = new VBox(this.getId() + "--idCustNewsFeedListContainer", {
			direction: "Column",
			items: [this.oList, oShowAllPrep],
			width: "96%"
		}).addStyleClass("sapUiSmallMarginTop sapUiSmallMarginBegin");
		return oNewsListVBox;
	}

	/**
	 *
	 * Saves news feed settings and shows news feed based on selection change of list of switch
	 *
	 * @private
	 */
	private async saveNewsFeedSettings() {
		const aSelectedNewsFeed: string[] = this.oList.getSelectedItems().map((item: ListItemBase) => {
			return (item as StandardListItem).getTitle();
		});
		/****TO DO control visibility of newspanel based on selection */
		if (aSelectedNewsFeed && aSelectedNewsFeed.length > 0) {
			//control visibility of newsfeed
		}
		const oFavNewsFeed = {
			items: aSelectedNewsFeed,
			showAllPreparationRequired: this.oShowSwitch.getState()
		};
		const oPersonalizer = await this.getPersonalization();
		const oPersData = await oPersonalizer.read();
		oPersData.favNewsFeed = oFavNewsFeed;
		await oPersonalizer.write(oPersData);
		//get the latest value of switch and set the state
		this.oShowSwitch.setState(oFavNewsFeed.showAllPreparationRequired);
		//load news feed
		await this.oNewsPanel.setCustomNewsFeed(this.oNewsPanel.getCustomFeedKey());
	}
	/** Set items for the NewsList
	 * @param {Array} [aItems] news items to be set as items aggregation
	 * @private
	 */
	private setItems(aItems: ICustomNewsFeed[]) {
		this.oList.destroyAggregation("items", true);
		(aItems || []).forEach((oItem: ICustomNewsFeed, i: number) => {
			const oCustomListItem = new StandardListItem(this.getId() + "--idCustNewsFeedItem" + "--" + i, {
				title: oItem.title as string,
				selected: oItem.selected as boolean
			});
			//.addStyleClass("newsListItem");
			this.oList.addItem(oCustomListItem);
		});
	}

	/**
	 * Loads news feed settings
	 *
	 * @returns {Promise} resolves to news feed settings
	 */
	private async loadNewsFeedSettings() {
		this.oNewsPanel = this._getPanel() as NewsPanel;
		const oPersonalizer = await this.getPersonalization();
		const oPersData = await oPersonalizer.read();
		const aPersNewsFeed = oPersData?.["favNewsFeed"];
		const showAllPreparationRequired = !aPersNewsFeed ? true : aPersNewsFeed.showAllPreparationRequired;

		let aNewsFeed: ICustomNewsFeed[] = await this.oNewsPanel.getCustomNewsFeed(this.oNewsPanel.getCustomFeedKey(), false);
		if (aNewsFeed && aNewsFeed.length > 0) {
			this.aFavNewsFeed = (aPersNewsFeed && aPersNewsFeed.items) || aNewsFeed;
			aNewsFeed = aNewsFeed.map((oNewsFeed: ICustomNewsFeed) => {
				const NewsFeedInFavorites = this.aFavNewsFeed.find((oFavNewsFeed) => {
					return oFavNewsFeed === oNewsFeed.title;
				})
					? true
					: false;
				oNewsFeed.selected = !aPersNewsFeed ? true : NewsFeedInFavorites;
				return oNewsFeed;
			});
			this.aFavNewsFeed = aNewsFeed;
			this.setItems(this.aFavNewsFeed);
			this.oShowSwitch.setState(showAllPreparationRequired);
			return aNewsFeed;
		}
	}
}
