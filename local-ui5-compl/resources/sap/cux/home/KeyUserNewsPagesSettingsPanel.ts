/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import Dialog from "sap/m/Dialog";
import FlexBox from "sap/m/FlexBox";
import List from "sap/m/List";
import { ListBase$SelectionChangeEvent } from "sap/m/ListBase";
import NavContainer from "sap/m/NavContainer";
import Page from "sap/m/Page";
import StandardListItem from "sap/m/StandardListItem";
import VBox from "sap/m/VBox";
import Control from "sap/ui/core/Control";
import type { MetadataOptions } from "sap/ui/core/Element";
import Element from "sap/ui/core/Element";
import EventBus from "sap/ui/core/EventBus";
import BaseContainer from "./BaseContainer";
import BaseLayout from "./BaseLayout";
import BasePanel from "./BasePanel";
import BaseSettingsPanel from "./BaseSettingsPanel";
import { CHANGE_TYPES } from "./flexibility/Layout.flexibility";
import { IKeyUserChange, INewsFeedVisibiliyChange } from "./interface/KeyUserInterface";
import KeyUserNewsSettingsPanel from "./KeyUserNewsSettingsPanel";
import KeyUserPagesSettingsPanel from "./KeyUserPagesSettingsPanel";
import KeyUserSettingsDialog from "./KeyUserSettingsDialog";
import NewsAndPagesContainer from "./NewsAndPagesContainer";
import NewsPanel from "./NewsPanel";
import PagePanel from "./PagePanel";
import { KEYUSER_SETTINGS_PANELS_KEYS } from "./utils/Constants";

/**
 *
 * Class for News & Pages Settings Panel for KeyUser Settings Dialog.
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
 * @alias sap.cux.home.KeyUserNewsPagesSettingsPanel
 */
export default class KeyUserNewsPagesSettingsPanel extends BaseSettingsPanel {
	static readonly metadata: MetadataOptions = {
		library: "sap.cux.home"
	};
	private wrapperVBox!: VBox;
	private newsPanel!: NewsPanel;
	private newsSettingsPanel!: KeyUserNewsSettingsPanel;
	private newsSettingsList!: List;
	private newsSettingsPage!: Page;
	private pagePanel!: PagePanel;
	private pageSettingsPanel!: KeyUserPagesSettingsPanel;
	private pageSettingsList!: List;
	private pageSettingsDialog!: Dialog;
	private _eventBus!: EventBus;
	private newsFeedVisibility!: boolean | undefined;
	private standardListItem!: StandardListItem;

	/**
	 * Init lifecycle method
	 *
	 * @public
	 * @override
	 */
	public init(): void {
		super.init();

		//setup panel
		this.setProperty("key", KEYUSER_SETTINGS_PANELS_KEYS.NEWS_PAGES);
		this.setProperty("title", this._i18nBundle.getText("editNewsPages"));

		// Subscribe to event bus
		this._eventBus = EventBus.getInstance();
		this._eventBus.subscribe(
			"KeyUserChanges",
			"addNewsPagesChanges",
			(channelId?: string, eventId?: string, data?: object) => {
				//errorstate is false when import is successful
				const { changes } = data as { changes: Array<IKeyUserChange> };
				this.addNewsPagesChanges(changes);
			},
			this
		);

		// setup layout content
		this.addAggregation("content", this.getContent());

		// fired every time on panel navigation
		this.attachPanelNavigated(() => this.loadSettings());
	}

	/**
	 * Returns the content for the KeyUser News Pages Settings Panel.
	 *
	 * @private
	 * @returns {VBox} The control containing the KeyUser News Pages Settings Panel content.
	 */
	private getContent(): VBox {
		if (!this.wrapperVBox) {
			this.wrapperVBox = new VBox(`${this.getId()}-wrapperVBox`);
		}
		return this.wrapperVBox;
	}

	/**
	 * Load settings for the panel.
	 *
	 * @private
	 */
	private loadSettings(): void {
		const associatedPanelId = this.getPanel();
		const associatedPanel = Element.getElementById(associatedPanelId) as BasePanel;
		const container = associatedPanel?.getParent() as BaseContainer;
		container.getContent()?.forEach((panel: BasePanel) => {
			if (panel instanceof NewsPanel) {
				this.newsPanel = panel;
				this.wrapperVBox.addItem(this.getNewsSettingsList(panel));
			}
			if (panel instanceof PagePanel) {
				this.pagePanel = panel;
				this.wrapperVBox.addItem(this.getPageSettingsList(panel));
			}
		});
	}

	private newsVisibilityChangeHandler(oEvent: ListBase$SelectionChangeEvent): void {
		const newsVisibilityCheckBox = oEvent.getParameter("listItem");
		this.newsFeedVisibility = newsVisibilityCheckBox?.getSelected();
		const newsPanel = this._getPanel() as NewsPanel;
		const newsPageContainer = newsPanel.getParent() as NewsAndPagesContainer;
		const layout = newsPageContainer.getParent() as BaseLayout;
		const keyUserChanges = this.getKeyUserChanges();
		const existingChange = keyUserChanges.find((change) => {
			return change.changeSpecificData.changeType === CHANGE_TYPES.NEWS_FEED_VISIBILITY;
		});
		if (!this.newsFeedVisibility && this.newsSettingsPanel) {
			this.newsSettingsPanel.removeUrlMesageStrip();
		}
		if (!existingChange) {
			this.addKeyUserChanges({
				selectorControl: layout,
				changeSpecificData: {
					changeType: CHANGE_TYPES.NEWS_FEED_VISIBILITY,
					content: {
						isNewsFeedVisible: this.newsFeedVisibility
					}
				}
			});
		} else if ((existingChange.changeSpecificData.content as INewsFeedVisibiliyChange).isNewsFeedVisible !== this.newsFeedVisibility) {
			(existingChange.changeSpecificData.content as INewsFeedVisibiliyChange).isNewsFeedVisible = this.newsFeedVisibility;
		}
	}

	/**
	 * Returns News Settings Panel to the content.
	 *
	 * @private
	 * @returns {List} The control containing the News Settings Panel content.
	 */
	private getNewsSettingsList(panel: NewsPanel): List {
		const newsPanel = this._getPanel() as NewsPanel;
		if (!this.newsSettingsList) {
			this.newsSettingsList = new List(`${this.getId()}-news-settings-list`, {
				selectionChange: this.newsVisibilityChangeHandler.bind(this),
				mode: "MultiSelect"
			});
			this.standardListItem = new StandardListItem({
				selected: (newsPanel._getContent()[0].getParent() as FlexBox).getVisible(), // TO-DO: Integrate with keyuser data
				press: this.navigateToNewsSettingsPage.bind(this),
				type: "Navigation",
				title: this._i18nBundle.getText("newsFeed")
			});
			this.newsSettingsList.addItem(this.standardListItem);
			this.newsSettingsList.setAssociation("panel", panel);
		} else {
			if (this.newsFeedVisibility === undefined) {
				this.standardListItem.setSelected(
					Boolean(newsPanel.getParent()?.getProperty("newsFeedVisibility")) && Boolean(newsPanel.getProperty("newsAvailable"))
				);
			} else {
				this.standardListItem.setSelected(this.newsFeedVisibility);
			}
		}
		return this.newsSettingsList;
	}

	/**
	 * Returns Page Settings Panel to the content.
	 *
	 * @private
	 * @returns {List} The control containing the Page Settings Panel content.
	 */
	private getPageSettingsList(panel: PagePanel): List {
		if (!this.pageSettingsList) {
			this.pageSettingsList = new List(`${this.getId()}-page-settings-list`, {
				mode: "None",
				items: [
					new StandardListItem({
						selected: true, // TO-DO: Integrate with keyuser data
						press: this.openPageSettingsDialog.bind(this),
						type: "Navigation",
						title: this._i18nBundle.getText("pageGroupHeader")
					})
				]
			});
			this.pageSettingsList.setAssociation("panel", panel);
		}
		return this.pageSettingsList;
	}

	private onNavBack(navContainer: NavContainer): void {
		navContainer?.back();
		if (!this.standardListItem.getSelected()) {
			this.newsSettingsPanel?.removeUrlMesageStrip();
		}
	}

	/**
	 * Adds News Settings Page to the dialog.
	 *
	 * @private
	 */
	private navigateToNewsSettingsPage(): void {
		const navContainer = (this.getParent() as KeyUserSettingsDialog)?.getNavContainer?.();
		if (!this.newsSettingsPage) {
			this.newsSettingsPanel = new KeyUserNewsSettingsPanel();
			this.newsSettingsPanel.setAssociation("panel", this.newsPanel);
			this.newsSettingsPage = new Page(`${this.getId()}-news-settings-page`, {
				title: this.newsSettingsPanel.getProperty("title") as string,
				showHeader: true,
				content: this.newsSettingsPanel.getAggregation("content") as Control,
				backgroundDesign: "Transparent",
				showNavButton: true,
				navButtonPress: this.onNavBack.bind(this, navContainer)
			});
		}
		navContainer?.addPage(this.newsSettingsPage);
		navContainer?.to(this.newsSettingsPage);
		this.newsSettingsPanel.firePanelNavigated();
	}

	/**
	 * Opens Page Settings Dialog.
	 *
	 * @private
	 */
	private openPageSettingsDialog(): void {
		if (!this.pageSettingsPanel) {
			this.pageSettingsPanel = new KeyUserPagesSettingsPanel();
			this.pageSettingsPanel.setAssociation("panel", this.pagePanel);
			this.pageSettingsDialog = (this.pageSettingsPanel.getAggregation("content") as Dialog[])?.[0];
		}
		this.pageSettingsDialog?.open();
		this.pageSettingsPanel?.firePanelNavigated();
	}

	/**
	 * Handles Space Page Changes.
	 *
	 * @private
	 * @param {Array<IKeyUserChange>} changes All Key User Changes.
	 */
	private addNewsPagesChanges(changes: Array<IKeyUserChange>): void {
		changes.forEach((change) => {
			this.addKeyUserChanges(change);
		});
	}

	public async isNewsChangesValid() {
		try {
			return await this.newsSettingsPanel?.isValidChanges(this.standardListItem.getSelected());
		} catch {
			return true;
		}
	}

	public onSaveClearChanges() {
		this.newsFeedVisibility = undefined;
		this.newsSettingsPanel?.clearKeyUserChanges();
	}

	public onCancelClearKeyUserChanges() {
		const newsPanel = this._getPanel() as NewsPanel;
		this.newsFeedVisibility = undefined;
		this.standardListItem?.setSelected((newsPanel._getContent()[0].getParent() as FlexBox).getVisible());
		this.newsSettingsPanel?.clearNewsPanelChanges();
	}
}
