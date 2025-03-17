/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import GridContainer from "sap/f/GridContainer";
import GenericTile from "sap/m/GenericTile";
import HeaderContainer from "sap/m/HeaderContainer";
import IconTabBar, { IconTabBar$SelectEvent } from "sap/m/IconTabBar";
import IconTabFilter from "sap/m/IconTabFilter";
import Panel from "sap/m/Panel";
import VBox from "sap/m/VBox";
import { BackgroundDesign, FrameType, GenericTileMode, GenericTileScope, LoadState, TileSizeBehavior } from "sap/m/library";
import type { MetadataOptions } from "sap/ui/core/Element";
import EventBus from "sap/ui/core/EventBus";
import Parameters from "sap/ui/core/theming/Parameters";
import App from "./App";
import BaseApp from "./BaseApp";
import BaseAppPanel, { BaseAppPanel$SupportedEvent } from "./BaseAppPanel";
import BaseAppPersPanel from "./BaseAppPersPanel";
import BaseContainer, { $BaseContainerSettings } from "./BaseContainer";
import Group from "./Group";
import MenuItem from "./MenuItem";
import { ICustomVisualization } from "./interface/AppsInterface";
import { LayoutType } from "./library";
import DataFormatUtils from "./utils/DataFormatUtils";
import { DeviceType } from "./utils/Device";

const getDefaultAppColor = () => {
	const sLegendName = "sapLegendColor9";
	return {
		key: sLegendName,
		value: Parameters.get({
			name: sLegendName
		}),
		assigned: false
	};
};

const CONSTANTS = {
	PLACEHOLDER_ITEMS_COUNT: 5
};

/**
 *
 * Container class for managing and storing apps.
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
 * @alias sap.cux.home.AppsContainer
 */
export default class AppsContainer extends BaseContainer {
	private _oEventBus!: EventBus;
	private _shellNavigationHandler!: () => void;
	private _isInitialRender = true;
	static readonly renderer = {
		...BaseContainer.renderer,
		apiVersion: 2
	};
	static readonly metadata: MetadataOptions = {
		events: {
			/**
			 * Event is fired when apps are loaded.
			 */
			appsLoaded: {
				parameters: {
					apps: { type: "App[]" },
					tiles: { type: "GenericTile[]" }
				}
			}
		}
	};

	/**
	 * Constructor for a new app container.
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
		this.setProperty("title", this._i18nBundle?.getText("appsTitle"));
		if (this.getDeviceType() === DeviceType.Mobile) {
			this.setProperty("layout", LayoutType.Vertical);
		}
		this._shellNavigationHandler = () => this._onShellNavigated();
		this._oEventBus = EventBus.getInstance();
		this._oEventBus?.subscribe("sap.ushell", "navigated", this._shellNavigationHandler);
		this.addStyleClass("sapCuxAppsContainer");
	}

	/**
	 * Exit lifecycle method
	 * Clean up event handlers
	 * @private
	 */
	public exit(): void {
		this._oEventBus?.unsubscribe("sap.ushell", "navigated", this._shellNavigationHandler);
	}

	/**
	 * onBeforeRendering lifecycle method
	 *
	 * @private
	 * @override
	 */
	public onBeforeRendering() {
		super.onBeforeRendering();

		if (this._isInitialRender) {
			this._isInitialRender = false;
			this._attachPanelSupportedEvent();
			this._removeUnsupportedPanels();
		}
		const isPhone = this.getDeviceType() === DeviceType.Mobile;
		const selectedPanels = (isPhone ? this.getContent() : [this._getSelectedPanel()]) as BaseAppPanel[];
		for (const selectedPanel of selectedPanels) {
			selectedPanel.fireNavigated();
			void this._setApps(selectedPanel);
		}
	}

	/**
	 * Handler for navigation event.
	 * @private
	 * Sets the panels dirty if navigated to different page.
	 */
	private _onShellNavigated(): void {
		this._setPanelsDirty();
	}

	/**
	 * Set all panels dirty state to true, to refresh all panels
	 * @private
	 */
	private _setPanelsDirty(): void {
		const panels = this.getContent() as BaseAppPanel[];
		for (const panel of panels) {
			panel.setDesktopViewDirty(true);
			panel.setMobileViewDirty(true);
		}
	}

	/**
	 * Generate placeholer for the panel.
	 * @private
	 * @param {BaseAppPanel} panel - Panel for which placeholders has to be generated.
	 */
	private _generatePlaceholder(panel: BaseAppPanel): void {
		if (!panel.isLoaded()) {
			const placeholderApps = panel.generateApps(
				new Array(CONSTANTS.PLACEHOLDER_ITEMS_COUNT).fill({ status: "Loading" }) as ICustomVisualization[]
			);
			panel.destroyAggregation("apps", true);
			panel.setApps(placeholderApps);
			this._updatePanelContent(panel);
		}
	}

	/**
	 * Loads and sets the apps.
	 * @private
	 * @param {BaseAppPanel} panel - Panel for which apps has to be loaded.
	 * @returns {Promise<void>} resolves when apps are loaded.
	 */
	private async _setApps(panel: BaseAppPanel): Promise<void> {
		// only load the apps if panel is in dirty state
		if (panel.isDirty() && panel.isMobileDirty()) {
			this._generatePlaceholder(panel);
			await panel.loadApps?.();
			if (this.getDeviceType() === DeviceType.Mobile) {
				panel.setMobileViewDirty(false);
			} else {
				panel.setDesktopViewDirty(false);
			}
			panel.setLoaded(true);
			this._updatePanelContent(panel);

			if (panel.isA("sap.cux.home.BaseAppPersPanel")) {
				await (panel as BaseAppPersPanel).applyPersonalization();
			}
			let tiles: GenericTile[] = [];
			let apps = panel.getApps();
			tiles = panel.fetchTileVisualization(tiles);
			this.fireEvent("appsLoaded", { apps, tiles });
		}
	}

	/**
	 * Updates the content of the panel by replacing existing items with new apps and groups.
	 * This method selects the appropriate wrapper based on the device type, and add apps/group or mobile cards to the wrapper.
	 *
	 * @param {BaseAppPanel} panel - The panel whose content needs to be updated.
	 * @returns {void}
	 * @private
	 */
	private _updatePanelContent(panel: BaseAppPanel): void {
		const apps = panel.getApps() || [];
		const groups = (panel.getAggregation("groups") || []) as Group[];
		const isPhone = this.getDeviceType() === DeviceType.Mobile;
		const wrapper = isPhone ? panel._generateMobileAppsWrapper() : panel._generateAppsWrapper();
		const aggregationName = isPhone ? "content" : "items";
		wrapper.destroyAggregation(aggregationName);
		let items = isPhone ? this._generateMobileCards([...groups, ...apps]) : this._generateTiles([...groups, ...apps]);
		this._addWrapperContent(wrapper, items, aggregationName);
		this._updatePanelContentVisibility(panel);
	}

	/**
	 * Updates the visibility of the panel's content based on the current state and device type.
	 * This method determines whether to display the apps or an error message based on the presence of apps and groups.
	 * It also adjusts the visibility of different containers depending on whether the device is a phone or not.
	 *
	 * @param {BaseAppPanel} panel - The panel whose content visibility needs to be updated.
	 * @returns {void}
	 * @private
	 */
	private _updatePanelContentVisibility(panel: BaseAppPanel): void {
		const apps = panel.getApps() || [];
		const groups = (panel.getAggregation("groups") || []) as Group[];
		const isPhone = this.getDeviceType() === DeviceType.Mobile;
		const appsWrapper = panel._generateDesktopAppsWrapper();
		const mobileAppsWrapper = panel._generateMobileAppsWrapper();
		const errorCard = panel._generateErrorMessage();
		const hasApps = [...apps, ...groups].length !== 0;
		appsWrapper.setVisible(hasApps && !isPhone);
		mobileAppsWrapper.setVisible(hasApps && isPhone);
		(mobileAppsWrapper.getParent() as VBox).setWidth(isPhone && hasApps ? "100%" : "auto");
		errorCard.setVisible(!hasApps);
	}

	/**
	 * Generates generic tile based on app.
	 * @private
	 * @param {sap.cux.home.App} app - App.
	 * @returns {sap.m.GenericTile}.
	 */
	public _getAppTile(app: App): GenericTile {
		const isPhone = this.getDeviceType() === DeviceType.Mobile;
		const actions = (app.getAggregation("menuItems") || []) as MenuItem[];
		return new GenericTile("", {
			scope: actions.length && !isPhone ? GenericTileScope.ActionMore : GenericTileScope.Display,
			state: app.getStatus() as LoadState,
			mode: GenericTileMode.IconMode,
			sizeBehavior: TileSizeBehavior.Small,
			header: app.getTitle(),
			backgroundColor: app.getBgColor() || getDefaultAppColor()?.key,
			tileIcon: app.getIcon(),
			url: DataFormatUtils.getLeanURL(app.getUrl()),
			frameType: FrameType.TwoByHalf,
			renderOnThemeChange: true,
			dropAreaOffset: 4,
			subheader: app.getSubTitle(),
			press: (e) => app._onPress(e),
			width: isPhone ? "15rem" : "auto"
		}).addStyleClass("sapMGTTwoByHalf tileLayout");
	}

	/**
	 * Generates generic tile based on group.
	 * @private
	 * @param {sap.cux.home.Group} group - Group.
	 * @returns {sap.m.GenericTile}.
	 */
	private _getGroupTile(group: Group): GenericTile {
		const isPhone = this.getDeviceType() === DeviceType.Mobile;
		const actions = (group.getAggregation("menuItems") || []) as MenuItem[];
		return new GenericTile("", {
			scope: actions.length && !isPhone ? GenericTileScope.ActionMore : GenericTileScope.Display,
			state: group.getStatus() as LoadState,
			mode: GenericTileMode.IconMode,
			sizeBehavior: TileSizeBehavior.Small,
			header: group.getTitle(),
			backgroundColor: group.getBgColor() || getDefaultAppColor()?.key,
			tileIcon: group.getIcon(),
			frameType: FrameType.TwoByHalf,
			renderOnThemeChange: true,
			dropAreaOffset: 4,
			tileBadge: group.getNumber(),
			press: (e) => group._onPress(e),
			width: isPhone ? "15rem" : "auto"
		})
			.addStyleClass("sapMGTTwoByHalf tileLayout")
			.data("groupId", group.getGroupId()) as GenericTile;
	}

	/**
	 * Overridden method for selection of panel in the IconTabBar.
	 * Loads the apps in selected panel
	 * @private
	 * @returns {Promise<void>} resolves when apps are loaded on panel selection.
	 */
	protected async _onPanelSelect(event: IconTabBar$SelectEvent) {
		super._onPanelSelect(event);
		const selectedPanel = this._getSelectedPanel() as BaseAppPanel;
		await this._setApps(selectedPanel);
	}

	/**
	 * Refresh apps for all the panels.
	 * @private
	 * @returns {Promise<void>} resolves when all panels are set to dirty and apps for current panel are refreshed.
	 */
	public async _refreshAllPanels(): Promise<void> {
		//set all panels to dirty
		this._setPanelsDirty();
		//set apps for current section
		await this._setApps(this._getSelectedPanel() as BaseAppPanel);
	}

	/**
	 * Refresh apps for selected panel.
	 * @private
	 * @param {BaseAppPanel} panel - Panel that has be refreshed.
	 * @returns {Promise<void>} resolves when apps are refreshed.
	 */
	public async refreshPanel(panel: BaseAppPanel): Promise<void> {
		panel.setMobileViewDirty(true);
		panel.setDesktopViewDirty(true);
		await this._setApps(panel);
	}

	/**
	 * Toggles the visibility of the tab view based on the supported panels.
	 * @private
	 */
	private _toggleTabView() {
		if (this.getDeviceType() !== DeviceType.Mobile) {
			const panels = this.getContent() as BaseAppPanel[];
			const supportedPanels = panels.filter((panel) => panel.isSupported());
			const iconTabBarControl = this._getInnerControl() as IconTabBar;
			iconTabBarControl?.toggleStyleClass("sapUiITBHide", supportedPanels.length === 1);
		}
	}

	/**
	 * Handles the supported state of the current panel.
	 * If the panel is supported, it adds the panel to the content.
	 * If the panel is not supported, it removes the panel from the content.
	 * @param {BaseAppPanel} currentPanel - The panel to handle the supported state for.
	 * @private
	 */
	private _onPanelSupported(currentPanel: BaseAppPanel, event: BaseAppPanel$SupportedEvent) {
		const isSupported = event.getParameter("isSupported") as boolean;
		currentPanel.setSupported(isSupported);
		this._togglePanelVisibility(currentPanel, isSupported);
		this._toggleTabView();
	}

	/**
	 * Toggles the visibility of the panel.
	 * @param {BaseAppPanel} panel - The panel to toggle the visibility for.
	 * @param {boolean} isVisible - The visibility state of the panel.
	 * @private
	 */
	private _togglePanelVisibility(panel: BaseAppPanel, isVisible: boolean) {
		if (this.getDeviceType() === DeviceType.Mobile) {
			const panelWrapper = this._getPanelContentWrapper(panel);
			panelWrapper.setVisible(isVisible);
		} else {
			const iconTabBar = this._getInnerControl() as IconTabBar;
			const tabs = (iconTabBar?.getItems() as IconTabFilter[]) || [];
			const selectedTab = tabs.find((tab) => tab.getKey() === panel.getKey());
			selectedTab?.setVisible(isVisible);
		}
	}

	/**
	 * Removes unsupported panels from the container.
	 * @private
	 */
	private _removeUnsupportedPanels() {
		const panels = this.getContent() as BaseAppPanel[];
		const unSupportedPanels = panels.filter((panel) => !panel.isSupported());
		for (const panel of unSupportedPanels) {
			this._togglePanelVisibility(panel, false);
		}
		this._toggleTabView();
	}

	/**
	 * Attaches an event handler to the "supported" event for each panel in the container.
	 * @private
	 */
	private _attachPanelSupportedEvent() {
		const panels = this.getContent() as BaseAppPanel[];
		for (const panel of panels) {
			if (!panel.hasListeners("supported")) {
				panel.attachSupported(this._onPanelSupported.bind(this, panel));
			}
		}
	}

	/**
	 * Adjusts the layout and visibility based on the device type.
	 *
	 * This method adjusts the layout type and visibility of containers based on whether the device is a phone
	 * or not. It sets the container's layout property, toggles visibility of panels and their containers, and
	 * adjusts background design accordingly.
	 *
	 * @private
	 * @returns {void}
	 */
	public adjustLayout(): void {
		const isPhone = this.getDeviceType() === DeviceType.Mobile;
		const currentLayout = this.getProperty("layout") as LayoutType;
		const newLayout = isPhone ? LayoutType.Vertical : LayoutType.SideBySide;
		const shouldAdjustLayout = currentLayout !== newLayout;
		if (!shouldAdjustLayout) {
			return;
		}
		this.setProperty("layout", newLayout);
		const panels = this.getContent() as BaseAppPanel[];
		panels.forEach((panel) => {
			//if both the panels are dirty, then updated data will be loaded from onBeforeRendering, as layout change will trigger re-rendering
			//if both the panels are not dirty, i.e. doen't have any changes, then just toggle the visibility
			if (!panel.isDirty() && !panel.isMobileDirty()) {
				this._updatePanelContentVisibility(panel);
			} else if (panel.isDirty() !== panel.isMobileDirty()) {
				//if one of the panels is dirty i.e. have updated data and other is not, then re-create the inner controls
				panel.setDesktopViewDirty(false);
				panel.setMobileViewDirty(false);
				this._updatePanelContent(panel);
			}
		});
		//hide actions if the device is a phone
		this.toggleActionButtons(!isPhone);

		//this is to handle scenario when unsupported propert is changed and then layout is changed.
		this._removeUnsupportedPanels();
	}

	/**
	 * Generates mobile card panel and add given apps/groups in the panel.
	 *
	 * @private
	 * @returns {sap.m.Panel} The newly created mobile card panel.
	 */
	private _generateMobileCards(items: BaseApp[]): Panel[] {
		const panels: Panel[] = [];
		for (let i = 0; i < items.length; i += 7) {
			const panelItems = items.slice(i, i + 7);
			const panel = new Panel({
				backgroundDesign: BackgroundDesign.Solid,
				height: "23.5rem",
				width: "17rem",
				content: this._generateTiles(panelItems)
			}).addStyleClass("sapUiMobileAppsCard");
			panels.push(panel);
		}
		return panels;
	}

	/**
	 * Generates group/app generic tiles for given apps/groups.
	 *
	 * @private
	 * @param {BaseApp[]} items - Apps/Groups for which tiles has to be generated.
	 * @returns {sap.m.GenericTile[]} The generated tiles.
	 */
	private _generateTiles(items: BaseApp[]): GenericTile[] {
		return items.map((item) => (item.isA("sap.cux.home.Group") ? this._getGroupTile(item as Group) : this._getAppTile(item as App)));
	}

	/**
	 * Adds given items into the wrapper.
	 * @param {HeaderContainer | GridContainer} wrapper - wrapper for which items has to be added.
	 * @param {Panel[] | GenericTile[]} items - items to be added.
	 * @param {string} aggregationName - aggregation name to which items has to be added.
	 * @private
	 */
	private _addWrapperContent(wrapper: HeaderContainer | GridContainer, items: Panel[] | GenericTile[], aggregationName: string) {
		wrapper.destroyAggregation(aggregationName);
		items.forEach((item) => {
			wrapper.addAggregation(aggregationName, item);
		});
	}
}
