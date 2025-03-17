/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import { Event as JQueryEvent } from "jquery";
import Bar from "sap/m/Bar";
import Button from "sap/m/Button";
import List from "sap/m/List";
import Page from "sap/m/Page";
import SplitApp from "sap/m/SplitApp";
import StandardListItem from "sap/m/StandardListItem";
import Title from "sap/m/Title";
import Event from "sap/ui/base/Event";
import Control from "sap/ui/core/Control";
import Element from "sap/ui/core/Element";
import Device from "sap/ui/Device";
import BaseSettingsDialog from "./BaseSettingsDialog";
import BaseSettingsPanel from "./BaseSettingsPanel";
import { calculateDeviceType, DeviceType } from "./utils/Device";

/**
 *
 * Dialog class for My Home Settings.
 *
 * @extends BaseSettingsDialog
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.121
 *
 * @internal
 * @experimental Since 1.121
 * @private
 *
 * @alias sap.cux.home.SettingsDialog
 */
export default class SettingsDialog extends BaseSettingsDialog {
	private _controlMap!: Map<string, Control | Element>;
	private _menuBtn!: Button;
	private _menuList!: List;
	private _masterPage!: Page;
	private _splitApp!: SplitApp;
	private _deviceType!: DeviceType;

	static renderer = {
		apiVersion: 2
	};

	/**
	 * Init lifecycle method
	 *
	 * @public
	 * @override
	 */
	public init(): void {
		super.init();
		this._controlMap = new Map();

		//setup dialog
		this.setContentWidth("72rem");
		this.setStretch(false);
		this.setCustomHeader(this._setCustomHeader());

		//setup dialog buttons
		this.addButton(
			new Button(`${this.getId()}-close-btn`, {
				text: this._i18nBundle.getText("closeSettings"),
				type: "Transparent",
				press: () => this.close()
			})
		);

		//setup dialog content
		this.addContent(
			new Page(`${this.getId()}-settingsPage`, {
				title: this._i18nBundle.getText("myHomeSettings"),
				showHeader: false,
				content: this._getPageContent()
			})
		);
	}

	/**
	 * Creates and sets a custom header for the SettingsDialog.
	 *
	 * @private
	 * @returns {Bar} The custom header bar for the SettingsDialog.
	 */
	private _setCustomHeader(): Bar {
		this._menuBtn = new Button(`${this.getId()}-menu-btn`, {
			icon: "sap-icon://menu2",
			tooltip: this._i18nBundle.getText("showMenu"),
			press: () => this._toggleMasterPage()
		});
		return new Bar(`${this.getId()}-header`, {
			contentLeft: [this._menuBtn],
			contentMiddle: [
				new Title(`${this.getId()}-dialog-title`, {
					text: this._i18nBundle.getText("myHomeSettings")
				})
			]
		});
	}

	/**
	 * Toggles the visibility of the master page in the SettingsDialog based on the current device width.
	 * If the device width is less than 600 pixels or equal to or greater than 1024 pixels, the master
	 * page is always shown. Otherwise, it toggles the visibility of the master page.
	 *
	 * @private
	 */
	private _toggleMasterPage(): void {
		const isMasterShown = this._splitApp.isMasterShown();
		const deviceType = this._deviceType || calculateDeviceType();
		if (deviceType !== DeviceType.Tablet) {
			this._splitApp.toMaster(this._masterPage.getId(), "slide");
		} else {
			if (isMasterShown) {
				this._splitApp.hideMaster();
			} else {
				this._splitApp.showMaster();
			}
		}
		this._updateHeaderButtonVisibility(!isMasterShown);
	}

	/**
	 * Update header button
	 *
	 * @param {boolean} isMasterShown If master page is shown
	 * @private
	 */
	private _updateHeaderButtonVisibility(isMasterShown: boolean): void {
		const deviceType = this._deviceType || calculateDeviceType();
		if (deviceType === DeviceType.Mobile) {
			// Hide or show the menu button on mobile
			this._menuBtn.setVisible(!isMasterShown);
		} else if (deviceType === DeviceType.Tablet) {
			if (Device.orientation?.portrait) {
				// Show menu button in portrait mode with a tooltip
				const tooltipText = this._i18nBundle.getText(isMasterShown ? "ToggleButtonHide" : "ToggleButtonShow");
				this._menuBtn.setVisible(true);
				if (tooltipText) {
					// Only set the tooltip if a valid string is available
					this._menuBtn.setTooltip(tooltipText);
				}
			} else {
				// Hide or show the menu button in other orientations
				this._menuBtn.setVisible(!isMasterShown);
			}
		}
	}

	/**
	 * Generates the content for the SettingsDialog, including the master page and split app.
	 *
	 * @private
	 * @returns {SplitApp} The split app containing the master page and detail pages for the SettingsDialog.
	 */
	private _getPageContent(): SplitApp {
		this._menuList = new List(`${this.getId()}-master-pages-list`, {
			mode: "SingleSelectMaster",
			itemPress: (event: Event) => this._navigateToDetailPage(event)
		}).addStyleClass("sapCuxMasterPageList");
		this._masterPage = new Page(`${this.getId()}-master-page`, {
			title: this._i18nBundle.getText("myHomeSettings"),
			showHeader: false,
			content: [this._menuList]
		});
		this._splitApp = new SplitApp(`${this.getId()}-settingsApp`, {
			mode: "ShowHideMode",
			masterPages: [this._masterPage],
			masterButton: (event: Event) => this._hideNavigationButton(event)
		});

		return this._splitApp;
	}

	/**
	 * Navigates to the detail page associated with the selected item in the master page list.
	 *
	 * @private
	 * @param {Event} event The item press event from the master page list.
	 */
	private _navigateToDetailPage(event: Event<{ listItem?: StandardListItem }> | string, context?: object): void {
		//update selected key
		const listItem = typeof event === "string" ? event : event.getParameter?.("listItem");
		const firstPanel = this.getPanels()[0];
		const selectedKey = ((listItem as StandardListItem)?.data?.("key") || event || firstPanel?.getProperty("key")) as string;
		this.setProperty("selectedKey", selectedKey, true);

		//navigate to detail page
		const detailPage = Element.getElementById(`${selectedKey}-detail-page`) as Page;
		this._splitApp.toDetail(detailPage.getId(), "slide");
		this._splitApp.hideMaster();
		if (this._splitApp.getMode() === "ShowHideMode") {
			this._updateHeaderButtonVisibility(false);
		}

		//fire panel navigated event
		const selectedPanel = this.getPanels().find(
			(panel: BaseSettingsPanel) => panel.getProperty("key") === selectedKey
		) as BaseSettingsPanel;
		selectedPanel?.firePanelNavigated({ context });

		//select list item
		this._menuList.removeSelections(true);
		const pageItem = Element.getElementById(`${selectedKey}-page-item`) as StandardListItem;
		setTimeout(() => {
			this._menuList.setSelectedItem(pageItem);
			pageItem.focus();
		}, 0);
	}

	/**
	 * Hides the navigation button associated with the provided event.
	 *
	 * @private
	 * @param {Event} event The event triggering the hide action.
	 */
	private _hideNavigationButton(event: Event): void {
		const navigationButton = Element.getElementById(`${event.getSource<SplitApp>().getId()}-MasterBtn`) as Button;
		navigationButton?.destroy();
	}

	/**
	 * onBeforeRendering lifecycle method.
	 * Prepares the SettingsDialog content and navigate to the selected detail page.
	 *
	 * @public
	 * @override
	 */
	public onBeforeRendering(event: JQueryEvent): void {
		super.onBeforeRendering(event);

		//setup master and detail page content
		this.getPanels().forEach((panel: BaseSettingsPanel) => {
			this._menuList.addItem(this._getPageListItem(panel));
			this._splitApp.addDetailPage(this._getDetailPage(panel));
		});

		//navigate to detail page
		const selectedKey = this.getProperty("selectedKey") as string;
		const context = this.getProperty("context") as object;
		this._navigateToDetailPage(selectedKey, context);
	}

	/**
	 * Generates a list item for the master page list based on the settings panel.
	 * The list item displays the title and icon of the settings panel.
	 *
	 * @private
	 * @param {BaseSettingsPanel} settingsPanel The settings panel for which to generate the list item.
	 * @returns {StandardListItem} The list item control representing the settings panel in the master page list.
	 */
	private _getPageListItem(settingsPanel: BaseSettingsPanel): StandardListItem {
		const id = `${settingsPanel.getProperty("key")}-page-item`;
		if (!this._controlMap.get(id)) {
			const listItem = new StandardListItem(id, {
				title: settingsPanel.getProperty("title") as string,
				icon: settingsPanel.getProperty("icon") as string,
				type: "Navigation",
				iconDensityAware: false
			});
			listItem.data("key", settingsPanel.getProperty("key"));
			this._controlMap.set(id, listItem);
		}

		return this._controlMap.get(id) as StandardListItem;
	}

	/**
	 * Generates a detail page for the SettingsDialog based on the provided settings panel.
	 *
	 * @private
	 * @param {BaseSettingsPanel} settingsPanel The settings panel for which to generate the detail page.
	 * @returns {Page} The detail page control representing the settings panel.
	 */
	private _getDetailPage(settingsPanel: BaseSettingsPanel): Page {
		const id = `${settingsPanel.getProperty("key")}-detail-page`;
		if (!this._controlMap.get(id)) {
			const page = new Page(id, {
				title: settingsPanel.getProperty("title") as string,
				backgroundDesign: "List",
				showHeader: settingsPanel.getProperty("showHeader") as boolean
			});

			//add settings panel action buttons
			((settingsPanel.getAggregation("actionButtons") || []) as Button[]).forEach((actionButton) => {
				page.addHeaderContent(actionButton);
			});

			this._controlMap.set(id, page);
		}

		//add settings panel content
		(settingsPanel.getAggregation("content") as Control[]).forEach((content) => (this._controlMap.get(id) as Page).addContent(content));

		return this._controlMap.get(id) as Page;
	}
}
