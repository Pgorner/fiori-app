/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import BaseContainer, { $BaseContainerSettings } from "./BaseContainer";
import BasePanel from "./BasePanel";
import CardsPanel, { cardsMenuItems } from "./CardsPanel";
import ErrorPanel from "./ErrorPanel";
import MenuItem from "./MenuItem";
import TilesPanel, { tilesMenuItems } from "./TilesPanel";
import { DeviceType } from "./utils/Device";

const tilesPanelName: string = "sap.cux.home.TilesPanel";
const cardsPanelName: string = "sap.cux.home.CardsPanel";
const errorPanelName: string = "sap.cux.home.ErrorPanel";

/**
 *
 * Container class for managing and storing Insights Tiles and Insights Cards.
 *
 * @extends sap.cux.home.BaseContainer
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.121
 *
 * @internal
 * @experimental Since 1.121
 * @public
 *
 * @alias sap.cux.home.InsightsContainer
 */

export default class InsightsContainer extends BaseContainer {
	static renderer = {
		...BaseContainer.renderer,
		apiVersion: 2
	};
	private _visiblePanels: string[] = [];
	private tilesPanel!: TilesPanel;
	private cardsPanel!: CardsPanel;
	private tilesCount!: number;
	private cardsCount!: number;
	private _errorPanel!: ErrorPanel;
	private _isInitialRender: boolean = true;

	/**
	 * Constructor for a new Insights container.
	 *
	 * @param {string} [id] ID for the new control, generated automatically if an ID is not provided
	 * @param {object} [settings] Initial settings for the new control
	 */
	public constructor(id?: string, settings?: $BaseContainerSettings) {
		super(id, settings);
	}

	/**
	 * Init lifecycle method
	 *
	 * @private
	 * @override
	 */
	public init(): void {
		super.init();
		this.setProperty("layout", "Vertical");
		this.setTooltip(String(this._i18nBundle.getText("insightLayoutSectionTitle")));
	}

	public onBeforeRendering() {
		super.onBeforeRendering();
		if(this._isInitialRender) {
			const aContent = this.getContent();
			const panels: (TilesPanel | CardsPanel)[] = [];
			// Initially tiles & cards panels will be hidden till data is loaded in the individual panels are unhidden from panel level.
			aContent.forEach((oContent) => {
				if (!this.tilesPanel && oContent.isA(tilesPanelName)) {
					this.tilesPanel = oContent as TilesPanel;
					panels.push(this.tilesPanel);
				}
				if (!this.cardsPanel && oContent.isA(cardsPanelName)) {
					this.cardsPanel = oContent as CardsPanel;
					panels.push(this.cardsPanel);
				}
			});

			this.handleHidePanel(this.tilesPanel);
			this.handleHidePanel(this.cardsPanel);
	
			// Render individual panels
			panels.forEach((panel) => {
				panel.handleRemoveActions();
				panel.attachHandleHidePanel(() => this.handleHidePanel(panel));
				panel.attachHandleUnhidePanel(() => this.unhidePanelIfHidden(panel));
				void panel.renderPanel();
			});
			this._isInitialRender = false;
		}
	}

	/**
	 * handleHidePanel
	 */
	public handleHidePanel(panel: BasePanel) {
		this.removeContent(panel);
		const panelCount = this.getContent()?.length;
		this._addContainerHeader(this.getContent());
		if (panelCount === 0) {
			if (!this._errorPanel) {
				this._errorPanel = new ErrorPanel(`${this.getId()}-errorPanel`, {
					messageTitle: this._i18nBundle.getText("noAppsTitle"),
					messageDescription: this._i18nBundle.getText("noInsightsMsg")
				});
				this._errorPanel.getData();
			}
			this.addAggregation("content", this._errorPanel);
		} else if (panelCount === 1) {
			const panel = this.getContent()[0];
			if(!panel.isA(errorPanelName)) {
				(panel as TilesPanel | CardsPanel)?.handleRemoveActions();
			}
		}
	}

	private _addContainerHeader(panels: BasePanel[]) {
		this.setProperty("title", this._i18nBundle?.getText("insights"));
		this.setProperty("enableSettings", true);
		const menuItems: MenuItem[] = [];
		if (panels.length === 0 || panels[0]?.isA(errorPanelName)) {
			this._visiblePanels = [];
			menuItems.push(...this._handleNoPanelMenuItems());
		} else if (panels.length === 1) {
			if (panels[0].isA(tilesPanelName)) {
				this._visiblePanels = [tilesPanelName];
				this.setProperty("title", `${this._i18nBundle?.getText("insights")} (${this.tilesCount || 0})`);
				menuItems.push(...this._handleTilesPanelMenuItems());
			}
			if (panels[0].isA(cardsPanelName)) {
				this._visiblePanels = [cardsPanelName];
				this.setProperty("title", `${this._i18nBundle?.getText("insights")} (${this.cardsCount || 0})`);
				menuItems.push(...this._handleCardsPanelMenuItems());
			}
		}
		
		// Add Insights Settings Menu Item
		const insightsSettingMenu = (this.getAggregation("menuItems") as MenuItem[] || [])?.find(menu => menu.getId() === `${this.getId()}-settings`);
		if(insightsSettingMenu) {
			menuItems.push(insightsSettingMenu);
		}

		// Remove Existing Aggregations
		this.removeAllAggregation("menuItems");
		this.removeAllAggregation("actionButtons");

		// Add Tiles Action Buttons to Container Action Buttons
		this.tilesPanel.actionButtons.forEach((actionButton) => this.addAggregation("actionButtons", actionButton));
		menuItems.forEach((menuItem) => this.addAggregation("menuItems", menuItem));
	}

	private _removeContainerHeader() {
		this.setProperty("title", "");
		this.setProperty("enableSettings", false);
		this.removeAllAggregation("menuItems");
		this.removeAllAggregation("actionButtons");
		this.getContent().forEach((panel) => (panel as TilesPanel | CardsPanel).handleAddActions());
	}

	private _handleNoPanelMenuItems() {
		// In case of No Panels, Except Refresh all menu itmes should be shown
		const menuItems: MenuItem[] = [];
		this.tilesPanel.menuItems.forEach((menuItem) => {
			if (menuItem.getId() !== tilesMenuItems.REFRESH.valueOf()) {
				menuItems.push(menuItem);
			}
		});
		const cardsPanelId = this.cardsPanel.getId();
		this.cardsPanel.menuItems.forEach((menuItem) => {
			if (menuItem.getId() !== `${cardsPanelId}-${cardsMenuItems.REFRESH.valueOf()}`) {
				menuItems.push(menuItem);
			}
		});
		return menuItems;
	}

	private _handleTilesPanelMenuItems() {
		// In case of TilesPanel visible, Except CardsPanel Refresh all menu itmes should be shown
		const menuItems: MenuItem[] = [];
		this.tilesPanel.menuItems.forEach((menuItem) => menuItems.push(menuItem));
		const cardsPanelId = this.cardsPanel.getId();
		this.cardsPanel.menuItems.forEach((menuItem) => {
			if (menuItem.getId() !== `${cardsPanelId}-${cardsMenuItems.REFRESH.valueOf()}`) {
				menuItems.push(menuItem);
			}
		});
		return menuItems;
	}

	private _handleCardsPanelMenuItems() {
		// In case of CardsPanel visible, Except TilesPanel Refresh all menu itmes should be shown and CardsPanel refresh should be shown at the top.
		const menuItems: MenuItem[] = [];
		this.tilesPanel.menuItems.forEach((menuItem) => {
			if (menuItem.getId() !== tilesMenuItems.REFRESH.valueOf()) {
				menuItems.push(menuItem);
			}
		});
		const cardsPanelId = this.cardsPanel.getId();
		this.cardsPanel.menuItems.forEach((menuItem) => {
			if (menuItem.getId() === `${cardsPanelId}-${cardsMenuItems.REFRESH.valueOf()}`) {
				menuItems.unshift(menuItem);
			} else {
				menuItems.push(menuItem);
			}
		});
		return menuItems;
	}

	public updatePanelsItemCount(itemCount: number, panelName: string) {
		if (panelName === tilesPanelName) {
			this.tilesCount = itemCount;
		} else if (panelName === cardsPanelName) {
			this.cardsCount = itemCount;
		}
		// Container Title Will be displayed only in case of only one panel is present
		if (this.getContent().length === 1) {
			this.setProperty("title", `${this._i18nBundle?.getText("insights")} (${itemCount || 0})`);
		}
	}

	public unhidePanelIfHidden(panel: TilesPanel | CardsPanel) {
		this.removeContent(this._errorPanel);
		if (panel.isA(tilesPanelName) && !this._visiblePanels.includes(tilesPanelName)) {
			this._visiblePanels.push(tilesPanelName);
			if (this._visiblePanels.includes(cardsPanelName)) {
				this.removeContent(this.cardsPanel);
				this.addContent(this.tilesPanel);
				this.addContent(this.cardsPanel);
			} else {
				this.addContent(this.tilesPanel);
			}
			const panels = this.getContent();
			if (panels.length > 1) {
				this._removeContainerHeader();
			} else {
				this._addContainerHeader(panels);
			}
		}

		if (panel.isA(cardsPanelName) && !this._visiblePanels.includes(cardsPanelName)) {
			this._visiblePanels.push(cardsPanelName);
			this.addContent(this.cardsPanel);
			const panels = this.getContent();
			if (panels.length === 2) {
				this._removeContainerHeader();
			} else {
				this._addContainerHeader(panels);
			}
		}
	}

	/**
	 * Adjusts the layout of the container.
	 *
	 * @private
	 * @override
	 */
	public adjustLayout() {
		//hide actions if the device is a phone
		this.toggleActionButtons(this.getDeviceType() !== DeviceType.Mobile);

		//adjust layout of all panels
		(this.getContent() as (TilesPanel | CardsPanel)[]).forEach((panel) => panel._adjustLayout?.());
	}
}
