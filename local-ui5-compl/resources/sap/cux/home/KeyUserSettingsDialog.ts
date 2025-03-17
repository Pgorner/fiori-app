/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import { Event as JQueryEvent } from "jquery";
import Button from "sap/m/Button";
import NavContainer from "sap/m/NavContainer";
import Page from "sap/m/Page";
import { MetadataOptions } from "sap/ui/core/Component";
import Control from "sap/ui/core/Control";
import Element from "sap/ui/core/Element";
import EventBus from "sap/ui/core/EventBus";
import BaseSettingsDialog from "./BaseSettingsDialog";
import BaseSettingsPanel from "./BaseSettingsPanel";
import layoutHandler from "./changeHandler/LayoutHandler";
import { CHANGE_TYPES } from "./flexibility/Layout.flexibility";
import { IKeyUserChange } from "./interface/KeyUserInterface";
import KeyUserNewsPagesSettingsPanel from "./KeyUserNewsPagesSettingsPanel";

/**
 *
 * Dialog class for Key User Settings.
 *
 * @extends BaseSettingsDialog
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.121
 *
 * @internal
 * @experimental Since 1.122
 * @private
 *
 * @alias sap.cux.home.KeyUserSettingsDialog
 */
export default class KeyUserSettingsDialog extends BaseSettingsDialog {
	static renderer = {
		apiVersion: 2
	};
	static readonly metadata: MetadataOptions = {
		designtime: "not-adaptable-tree"
	};
	private controlMap!: Map<string, Control | Element>;
	private detailPageMap!: Map<string, Page>;
	private _eventBus!: EventBus;

	/**
	 * Init lifecycle method
	 *
	 * @public
	 * @override
	 */
	public init(): void {
		super.init();
		this.controlMap = new Map();
		this.detailPageMap = new Map();

		//setup dialog
		this.setContentWidth("23.636rem");
		this.setContentHeight("23.33rem");
		this.setStretch(false);
		this.setShowHeader(false);

		//setup dialog buttons
		this.addButton(
			new Button(`${this.getId()}-dialog-save-btn`, {
				text: this._i18nBundle.getText("saveButton"),
				type: "Emphasized",
				press: this.saveChanges.bind(this)
			})
		);
		this.addButton(
			new Button(`${this.getId()}-dialog-close-btn`, {
				text: this._i18nBundle.getText("closeSettings"),
				type: "Transparent",
				press: this.handleCancel.bind(this)
			})
		);

		//setup dialog content
		const navContainerId = `${this.getId()}-navContainer`;
		const navContainer = new NavContainer(navContainerId);
		this.controlMap.set(navContainerId, navContainer);
		this.addContent(this.controlMap.get(navContainerId) as NavContainer);
		this._eventBus = EventBus.getInstance();
		this._eventBus.subscribe(
			"KeyUserChanges",
			"disabledSaveBtn",
			(channelId?: string, eventId?: string, data?: object) => {
				//errorstate is false when import is successful
				// const { changes  = data as {disable: boolean, date: Date};
				this.getButtons()[0].setEnabled(!(data as unknown as { disable: boolean; date: Date })?.disable);
			},
			this
		);
	}

	/**
	 * onBeforeRendering lifecycle method.
	 * Prepares the SettingsDialog content.
	 *
	 * @public
	 * @override
	 */
	public onBeforeRendering(event: JQueryEvent): void {
		super.onBeforeRendering(event);
		const navContainer = this.getNavContainer();
		navContainer.removeAllPages();

		//setup master and detail page content
		this.getPanels().forEach((panel: BaseSettingsPanel, index: number) => {
			navContainer.addPage(this.getPage(panel, !index));
		});

		// navigate to the first page
		if (navContainer.getPages()?.length) {
			this.navigateToPage(navContainer.getPages()[0] as Page);
		}
	}

	/**
	 * Returns the page content for the SettingsDialog.
	 *
	 * @private
	 * @returns {Page} The page content for the SettingsDialog.
	 */
	private getPage(panel: BaseSettingsPanel, isMasterPage: boolean): Page {
		const id = `${this.getId()}-${panel.getId()}-page`;
		let page = this.controlMap.get(id) as Page;
		if (!page) {
			const navContainer = this.getNavContainer();
			page = new Page(id, {
				title: panel.getProperty("title") as string,
				showHeader: true,
				content: panel.getAggregation("content") as Control,
				backgroundDesign: "Transparent",
				showNavButton: isMasterPage ? false : true,
				navButtonPress: () => navContainer.back()
			});
			this.controlMap.set(id, page);

			// Set the details page map for navigation
			const associatedPanelId = panel.getAssociation("panel", null) as string;
			const associatedPanel = Element.getElementById(associatedPanelId) as BaseSettingsPanel;
			const containerId = associatedPanel?.getParent()?.getId();
			if (containerId) {
				this.detailPageMap.set(containerId, page);
			}
		}
		return page;
	}

	/**
	 * Navigates to the selected page.
	 *
	 * @param {Page} page The page to navigate to.
	 */
	public navigateToPage(page: Page | undefined): void {
		const pageId = page?.getId();
		const panelId = pageId?.substring(0, pageId.lastIndexOf("-page"));
		const panel = this.getPanels().find((panel: BaseSettingsPanel) => panelId?.includes(panel.getId()));
		panel?.firePanelNavigated();
		const navContainerId = `${this.getId()}-navContainer`;
		const navContainer = this.controlMap.get(navContainerId) as NavContainer;
		if (page) {
			navContainer.to(page);
		}
	}

	/**
	 * Returns the details page for the selected panel.
	 *
	 * @param {BaseSettingsPanel} panel The selected panel.
	 * @returns {Page | undefined} The details page for the selected panel.
	 */
	public getDetailsPage(containerId: string): Page | undefined {
		return this.detailPageMap.get(containerId);
	}

	/**
	 * Checks if the selected panel has a details page.
	 *
	 * @param {BaseSettingsPanel} panel The selected panel.
	 * @returns {boolean} True if the selected panel has a details page, false otherwise.
	 */
	public hasDetailsPage(containerId: string): boolean {
		return this.detailPageMap.has(containerId);
	}

	/**
	 * Returns the NavContainer.
	 *
	 * @returns {NavContainer} NavContainer.
	 */
	public getNavContainer(): NavContainer {
		const navContainerId = `${this.getId()}-navContainer`;
		return this.controlMap.get(navContainerId) as NavContainer;
	}

	/**
	 * Save the changes.
	 *
	 * @private
	 */
	private async saveChanges() {
		const isValidChanges = await this.isValidChanges();
		if (isValidChanges) {
			const allPanels = this.getPanels();
			allPanels.forEach((panel: BaseSettingsPanel) => {
				const panelChanges = panel.getKeyUserChanges();
				if (panelChanges.length) {
					this.createAndAddChanges(panelChanges);
					panel.clearKeyUserChanges();
				}
			});
			(allPanels[1] as KeyUserNewsPagesSettingsPanel)?.onSaveClearChanges();
			this.close();
			layoutHandler.resolve();
			layoutHandler.clearChanges();
		}
	}

	private async isValidChanges(): Promise<boolean> {
		let isValidChanges = true;
		const keyUserNewsPagePanel = this.getPanels()[1] as KeyUserNewsPagesSettingsPanel;
		const panelChanges = keyUserNewsPagePanel.getKeyUserChanges();
		for (const change of panelChanges) {
			if (change.changeSpecificData.changeType === CHANGE_TYPES.NEWS_FEED_URL) {
				isValidChanges = await keyUserNewsPagePanel.isNewsChangesValid();
			}
		}
		return isValidChanges;
	}

	/**
	 * Create and add keyuser changes to layoutHandler
	 *
	 * @private
	 */
	private createAndAddChanges(changes: Array<IKeyUserChange>) {
		const allChanges: unknown[] = [];
		changes.forEach((change) => {
			allChanges.push(change);
		});
		layoutHandler.addChanges(allChanges);
	}

	/**
	 * Handle cancel event.
	 *
	 * @private
	 */
	private handleCancel(): void {
		const allPanels = this.getPanels();
		allPanels.forEach((panel: BaseSettingsPanel) => {
			const panelChanges = panel.getKeyUserChanges();
			if (panelChanges.length) {
				panel.clearKeyUserChanges();
			}
		});
		const keyUserNewsPagePanel = this.getPanels()[1] as KeyUserNewsPagesSettingsPanel;
		keyUserNewsPagePanel.onCancelClearKeyUserChanges();
		this.close();
	}
}
