/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Button from "sap/m/Button";
import FlexBox from "sap/m/FlexBox";
import HBox from "sap/m/HBox";
import IconTabBar, { IconTabBar$SelectEvent } from "sap/m/IconTabBar";
import IconTabFilter from "sap/m/IconTabFilter";
import List from "sap/m/List";
import Popover from "sap/m/Popover";
import StandardListItem from "sap/m/StandardListItem";
import Title from "sap/m/Title";
import { BackgroundDesign, ButtonType, PlacementType } from "sap/m/library";
import Event from "sap/ui/base/Event";
import Control from "sap/ui/core/Control";
import CustomData from "sap/ui/core/CustomData";
import type { MetadataOptions } from "sap/ui/core/Element";
import UI5Element from "sap/ui/core/Element";
import Lib from "sap/ui/core/Lib";
import { CSSSize } from "sap/ui/core/library";
import { $BaseContainerSettings } from "./BaseContainer";
import BaseContainerRenderer from "./BaseContainerRenderer";
import BaseLayout from "./BaseLayout";
import BasePanel from "./BasePanel";
import MenuItem from "./MenuItem";
import { LayoutType } from "./library";
import { calculateDeviceType, DeviceType } from "./utils/Device";
import { addFESRId, addFESRSemanticStepName, FESR_EVENTS, getFESRId } from "./utils/FESRUtil";

/**
 *
 * Abstract base class for My Home layout control container.
 *
 * @extends sap.ui.core.Control
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.121
 *
 * @abstract
 * @internal
 * @experimental Since 1.121
 * @private
 *
 * @alias sap.cux.home.BaseContainer
 */
export default abstract class BaseContainer extends Control {
	protected _i18nBundle!: ResourceBundle;
	private _controlMap!: Map<string, Control | UI5Element>;
	private _wrapper!: FlexBox;
	private _iconTabBar!: IconTabBar;
	private _commonHeaderElementStates!: Map<string, boolean>;
	private _resizeObserver!: ResizeObserver;
	private _deviceType!: DeviceType;
	public adjustLayout() {}

	constructor(id?: string | $BaseContainerSettings);
	constructor(id?: string, settings?: $BaseContainerSettings);
	constructor(id?: string, settings?: $BaseContainerSettings) {
		super(id, settings);
	}

	static readonly metadata: MetadataOptions = {
		library: "sap.cux.home",
		properties: {
			/**
			 * Title of the container.
			 */
			title: { type: "string", group: "Data", defaultValue: "", visibility: "hidden" },
			/**
			 * Layout type of the container.
			 */
			layout: {
				type: "sap.cux.home.LayoutType",
				group: "Data",
				defaultValue: LayoutType.SideBySide,
				visibility: "hidden"
			},
			/**
			 * Key of the selected panel of the container.
			 */
			selectedKey: { type: "string", group: "Data", defaultValue: "", visibility: "hidden" },
			/**
			 * Width to be set for the container.
			 * @public
			 */
			width: { type: "sap.ui.core.CSSSize", group: "Appearance", defaultValue: "100%", visibility: "public" },
			/**
			 * Height to be set for the container.
			 * @public
			 */
			height: { type: "sap.ui.core.CSSSize", group: "Appearance", visibility: "public" },
			/**
			 * Whether the control is currently in blocked state.
			 */
			blocked: { type: "boolean", group: "Appearance", defaultValue: false, visibility: "hidden" },
			/**
			 * Whether the layout is currently in busy state.
			 */
			busy: { type: "boolean", group: "Appearance", defaultValue: false, visibility: "hidden" },
			/**
			 * The delay in milliseconds, after which the busy indicator will show up for this control.
			 */
			busyIndicatorDelay: { type: "int", defaultValue: 1000, visibility: "hidden" },
			/**
			 * The size of the BusyIndicator.
			 */
			busyIndicatorSize: { type: "sap.ui.core.BusyIndicatorSize", defaultValue: "Medium", visibility: "hidden" },
			/**
			 * The IDs of a logical field group that this control belongs to.
			 */
			fieldGroupIds: { type: "string[]", defaultValue: [], visibility: "hidden" },
			/**
			 * The visible property of the container.
			 */
			visible: { type: "boolean", group: "Appearance", defaultValue: true, visibility: "hidden" },
			/**
			 * Indicates whether home settings are enabled for this control.
			 */
			enableSettings: { type: "boolean", group: "Misc", visibility: "hidden" },
			/**
			 * Indicates whether full screen is enabled for this control.
			 */
			enableFullScreen: { type: "boolean", group: "Misc", visibility: "hidden" },
			/**
			 * The name of the URL parameter used to expand the container into full-screen mode.
			 * This property specifies the parameter key expected in the URL query string
			 * to identify the container to be expanded.
			 */
			fullScreenName: { type: "string", group: "Misc", visibility: "hidden" }
		},
		defaultAggregation: "content",
		aggregations: {
			/**
			 * The container content aggregation which should be of type BasePanel.
			 *
			 * @public
			 */
			content: { type: "sap.cux.home.BasePanel", singularName: "content", multiple: true, visibility: "public" },
			/**
			 * This aggregation contains the actions that should be displayed within the container.
			 *
			 * @public
			 */
			actionButtons: { type: "sap.m.Button", multiple: true, singularName: "actionButton", visibility: "public" },
			/**
			 * This aggregation holds the items that should be shown within the dropdown menu of the container.
			 *
			 * @public
			 */
			menuItems: { type: "sap.cux.home.MenuItem", multiple: true, singularName: "menuItem", visibility: "public" }
		},
		associations: {
			layout: { type: "sap.cux.home.BaseLayout", multiple: false, singularName: "layout", visibility: "hidden" },
			fullScreenButton: { type: "sap.m.Button", multiple: false, singularName: "fullScreenButton", visibility: "hidden" },
			fullScreenMenuItem: { type: "sap.cux.home.MenuItem", multiple: false, singularName: "fullScreenMenuItem", visibility: "hidden" }
		},
		events: {
			/**
			 * Event is fired before the container is expanded.
			 */
			onExpand: {}
		},
		designtime: true
	};

	static renderer: typeof BaseContainerRenderer = BaseContainerRenderer;

	/**
	 * Init lifecycle method
	 *
	 * @private
	 * @override
	 */
	public init(): void {
		this._controlMap = new Map();
		this._commonHeaderElementStates = new Map();
		this._i18nBundle = Lib.getResourceBundleFor("sap.cux.home.i18n") as ResourceBundle;
		this._createHeader(this);
	}

	/**
	 * Creates and returns header for both container as well as panels
	 *
	 * @private
	 * @param {BaseContainer | BasePanel} control - can be a container or a panel
	 * @returns {HBox} header for the given container or panel
	 */
	private _createHeader(control: BaseContainer | BasePanel): HBox {
		const controlId = control.getId();
		const id = `${controlId}-header`;
		const isPanel = control.isA("sap.cux.home.BasePanel");
		const hasContainerTitle = (this.getProperty("title") as string)?.trim().length > 0;

		if (!this._controlMap.get(id)) {
			//create header elements
			this._controlMap.set(
				`${controlId}-header-title`,
				new Title(`${controlId}-title`, { titleStyle: isPanel && hasContainerTitle ? "H6" : "H4" })
			);
			this._controlMap.set(
				`${controlId}-header-contentLeft`,
				new HBox(`${controlId}-contentLeft`, { renderType: "Bare" }).addStyleClass("sapCuxSectionContentArea")
			);
			this._controlMap.set(
				`${controlId}-header-contentRight`,
				new HBox(`${controlId}-contentRight`, { renderType: "Bare" }).addStyleClass("sapCuxSectionContentArea")
			);
			this._controlMap.set(
				`${controlId}-header-content`,
				new HBox(`${controlId}-content`, {
					width: "100%",
					justifyContent: "SpaceBetween",
					renderType: "Bare",
					items: [
						this._controlMap.get(`${controlId}-header-contentLeft`) as Control,
						this._controlMap.get(`${controlId}-header-contentRight`) as Control
					]
				}).addStyleClass("sapUiTinyMarginBegin")
			);

			//create header container
			this._controlMap.set(
				id,
				new HBox(`${controlId}-header`, {
					alignItems: "Center",
					items: [
						this._controlMap.get(`${controlId}-header-title`) as Control,
						this._controlMap.get(`${controlId}-header-content`) as Control
					]
				})
			);

			this.addDependent(this._controlMap.get(id) as Control);
		}

		//add control-specific styling
		(this._controlMap.get(id) as HBox)?.addStyleClass(isPanel && hasContainerTitle ? "sapCuxPanelHeader" : "sapUiContainerHeader");

		return this._controlMap.get(id) as HBox;
	}

	/**
	 * Returns container header
	 *
	 * @private
	 * @returns {Object} container header
	 */
	public _getHeader(): HBox {
		return this._controlMap.get(`${this.getId()}-header`) as HBox;
	}

	/**
	 * Returns inner control corresponding to the specified layout
	 *
	 * @private
	 * @returns {IconTabBar | FlexBox} inner control based on the layout
	 */
	public _getInnerControl(): IconTabBar | FlexBox {
		return this.getProperty("layout") === LayoutType.SideBySide ? this._iconTabBar : this._wrapper;
	}

	/**
	 * Handler for selection of panel in SideBySide layout
	 *
	 * @private
	 * @param {Event} event - event object
	 */
	protected _onPanelSelect(event: IconTabBar$SelectEvent) {
		//suppress invalidation to prevent container re-rendering. render the specific header element instead
		this.setProperty("selectedKey", event.getParameter("selectedKey"), true);
		this._updateContainerHeader(this);
	}

	/**
	 * Updates the count information of IconTabFilter of IconTabBar inner control
	 * in case of SideBySide layout
	 *
	 * @private
	 * @param {BasePanel} panel - associated panel
	 * @param {string} count - updated count
	 */
	public _setPanelCount(panel: BasePanel, count?: string) {
		if (this.getProperty("layout") === LayoutType.SideBySide) {
			this._getIconTabFilter(panel).setCount(count);
		}
	}

	/**
	 * Adds corresponding control to panel. The control would be added to the
	 * corresponding target inner control based on the layout.
	 *
	 * @private
	 * @param {BasePanel} panel - panel to which control must be added
	 * @param {Control} control - control to be added
	 */
	public _addToPanel(panel: BasePanel, control: Control): void {
		if (this.getProperty("layout") === LayoutType.SideBySide) {
			this._getIconTabFilter(panel)?.addContent(control);
		} else {
			(this._controlMap.get(`${panel.getId()}-wrapper`) as FlexBox)?.addItem(control);
		}
	}

	/**
	 * Creates and returns IconTabBarFilter for the specified panel to be placed
	 * in the IconTabBar inner control in case of SideBySide layout
	 *
	 * @private
	 * @param {BasePanel} panel - panel whose icon tab filter must be fetched
	 * @returns {IconTabFilter} IconTabFilter for the specified panel
	 */
	private _getIconTabFilter(panel: BasePanel): IconTabFilter {
		const id = `${panel.getId()}-tabFilter`;

		if (!this._controlMap.get(id)) {
			const iconTabFilter = new IconTabFilter(id, {
				key: panel.getProperty("key") as string,
				text: panel.getProperty("title") as string,
				tooltip: panel.getProperty("tooltip") as string
			});
			iconTabFilter.addCustomData(
				new CustomData({
					key: "sap-ui-fastnavgroup",
					value: "true",
					writeToDom: true
				})
			);
			this._controlMap.set(id, iconTabFilter);
			addFESRSemanticStepName(iconTabFilter, FESR_EVENTS.SELECT, panel.getProperty("key") as string);
		}

		//Add panel content to the created filter
		panel._getContent()?.forEach((content) => (this._controlMap.get(id) as IconTabFilter).addContent(content));

		return this._controlMap.get(id) as IconTabFilter;
	}

	/**
	 * onBeforeRendering lifecycle method
	 *
	 * @private
	 * @override
	 */
	public onBeforeRendering(): void {
		//create layout-specific inner control
		this._createInnerControl();

		//fetch and update container header
		this._updateContainerHeader(this);

		//add content from all panels to inner control
		this._addAllPanelContent();
	}

	/**
	 * onAfterRendering lifecycle method
	 *
	 * @private
	 * @override
	 */
	public onAfterRendering(): void {
		this._attachResizeHandler();
	}

	/**
	 * Attaches a resize handler to the container to adjust
	 * the layout based on device size changes.
	 *
	 * @private
	 */
	private _attachResizeHandler() {
		if (this.getDomRef()) {
			this._resizeObserver?.disconnect();
			this._resizeObserver = new ResizeObserver((entries) => {
				this._setDeviceType(entries);
				this.adjustLayout();
			});
			this._resizeObserver?.observe(this.getDomRef() as Element);
		}
	}

	/**
	 * Create inner control for storing content from panel
	 *
	 * @private
	 */
	private _createInnerControl(): void {
		const layout = this.getProperty("layout") as LayoutType;

		if (layout === LayoutType.Horizontal || layout === LayoutType.Vertical) {
			if (!this._wrapper) {
				this._wrapper = new FlexBox(`${this.getId()}-wrapper`, {
					width: "100%",
					renderType: "Bare"
				}).addStyleClass("sapCuxBaseWrapper");
				this.addDependent(this._wrapper);
			}
			this._wrapper.setDirection(layout === LayoutType.Horizontal ? "Row" : "Column");
		} else if (!this._iconTabBar) {
			this._iconTabBar = new IconTabBar(`${this.getId()}-iconTabBar`, {
				expandable: true,
				backgroundDesign: BackgroundDesign.Transparent,
				headerMode: "Inline",
				headerBackgroundDesign: BackgroundDesign.Transparent,
				select: (event: Event) => this._onPanelSelect(event)
			});
			this.addDependent(this._iconTabBar);
		}
	}

	/**
	 * Update container header information
	 *
	 * @private
	 */
	public _updateContainerHeader(control: BaseContainer | BasePanel): void {
		//clear container header elements
		(this._controlMap.get(control.getId() + "-header-contentLeft") as HBox)?.removeAllItems();
		(this._controlMap.get(control.getId() + "-header-contentRight") as HBox)?.removeAllItems();

		//update container header elements
		this._updateHeader(control);
	}

	/**
	 * Updates header information of a specified container or a panel
	 *
	 * @private
	 * @param {BaseContainer | BasePanel} control - can be container or panel
	 */
	private _updateHeader(control: BaseContainer | BasePanel): void {
		const isSideBySideLayout = this.getProperty("layout") === LayoutType.SideBySide;
		const isContainer = control.isA("sap.cux.home.BaseContainer");

		//Update Title
		const headerTitle = this._controlMap.get(control.getId() + "-header-title") as Title;
		headerTitle?.setText(control.getProperty("title") as string);
		headerTitle?.setVisible((control.getProperty("title") as string)?.trim().length > 0);

		//Add common header elements
		this._addCommonHeaderElements();

		const currentControl = isContainer && isSideBySideLayout ? this._getSelectedPanel() : control;
		const targetControl = !isContainer && isSideBySideLayout ? this : control;

		//Update Menu Items
		const menuItems = (currentControl?.getAggregation("menuItems") || []) as MenuItem[];
		if (menuItems.length > 0) {
			this._addMenuItems(targetControl, menuItems);
		}

		//Update Action Buttons
		(currentControl?.getAggregation("actionButtons") as Button[])?.forEach((actionButton: Button) => {
			(this._controlMap.get(targetControl.getId() + "-header-contentRight") as HBox)?.addItem(this._getHeaderButton(actionButton));
		});
	}

	/**
	 * Attaches common header elements like settings menu and full screen action to each
	 * panel in the container, if enabled.
	 *
	 * @private
	 */
	private _addCommonHeaderElements(): void {
		const attachHeaderElements = (control: BaseContainer | BasePanel) => {
			const elements = [
				{ property: "enableFullScreen", aggregation: "menuItems", headerElement: this._getFullScreenMenuItem(control) },
				{ property: "enableSettings", aggregation: "menuItems", headerElement: this._getHomeSettingsMenuItem(control) },
				{ property: "enableFullScreen", aggregation: "actionButtons", headerElement: this._getFullScreenButton(control) }
			];

			elements.forEach(({ property, aggregation, headerElement }) => {
				const layout = this._getLayout();
				const currentPropertyValue = control.getProperty(property) as boolean;
				const previousPropertyValue = this._commonHeaderElementStates.get(`${headerElement.getId()}-${property}`);

				//update common header elements only if there's a change in property value
				if (currentPropertyValue !== previousPropertyValue) {
					if (currentPropertyValue) {
						this._commonHeaderElementStates.set(`${headerElement.getId()}-${property}`, currentPropertyValue);
						control.addAggregation(aggregation, headerElement);

						//register full screen element with layout
						if (property === "enableFullScreen") {
							if (aggregation === "actionButtons") {
								control.setAssociation("fullScreenButton", headerElement, true);
							}
							if (aggregation === "menuItems") {
								control.setAssociation("fullScreenMenuItem", headerElement, true);
							}
							layout?.registerFullScreenElement(control);
						}
					} else {
						this._commonHeaderElementStates.set(`${headerElement.getId()}-${property}`, currentPropertyValue);
						control.removeAggregation(aggregation, headerElement);

						//deregister full screen element with layout
						if (property === "enableFullScreen") {
							if (aggregation === "actionButtons") {
								control.removeAssociation("fullScreenButton", headerElement, true);
							}
							if (aggregation === "menuItems") {
								control.removeAssociation("fullScreenMenuItem", headerElement, true);
							}
							layout?.deregisterFullScreenElement(control);
						}
					}
				}
			});
		};

		// Add common header elements for container
		attachHeaderElements(this);

		// Add common header elements for inner panels
		const panels = this.getContent() || [];
		panels.forEach(attachHeaderElements);
	}

	/**
	 * Retrieves the my home settings menu item for a given panel.
	 *
	 * @private
	 * @param {BaseContainer | BasePanel} panel - The panel for which to retrieve the home settings menu item.
	 * @returns {MenuItem} The settings menu item for the given panel.
	 */
	private _getHomeSettingsMenuItem(panel: BaseContainer | BasePanel): MenuItem {
		const id = `${panel.getId()}-settings`;
		if (!this._controlMap.get(id)) {
			const menuItem = new MenuItem(id, {
				title: this._i18nBundle.getText("myHomeSettings"),
				icon: "sap-icon://user-settings",
				press: () => {
					//open settings dialog
					const layout = this._getLayout();
					layout?.openSettingsDialog();
				}
			});
			addFESRId(menuItem, "myHomeSettings");
			this._controlMap.set(id, menuItem);
		}

		return this._controlMap.get(id) as MenuItem;
	}

	/**
	 * Retrieves the full screen menu item for a given panel.
	 *
	 * @private
	 * @param {BaseContainer | BasePanel} panel - The panel for which to retrieve the home settings menu item.
	 * @returns {MenuItem} The settings menu item for the given panel.
	 */
	private _getFullScreenMenuItem(panel: BaseContainer | BasePanel): MenuItem {
		const id = `${panel.getId()}-showMore`;
		if (!this._controlMap.get(id)) {
			const fullScreenMenuItem = new MenuItem(id, {
				title: this._i18nBundle.getText("expand"),
				icon: "sap-icon://display-more",
				press: () => {
					const layout = this._getLayout();
					layout?.toggleFullScreen(panel);
				}
			});
			addFESRId(fullScreenMenuItem, "toggleFullScreen");
			this._controlMap.set(id, fullScreenMenuItem);
		}
		return this._controlMap.get(id) as MenuItem;
	}

	/**
	 * Generates a full screen action button for a given control, which can be a panel or a container.
	 *
	 * @private
	 * @param {BaseContainer | BasePanel} control - The control for which the full screen button is generated.
	 * @returns {Button} A Button instance configured to toggle full screen mode for the specified control.
	 */
	private _getFullScreenButton(control: BaseContainer | BasePanel): Button {
		const id = `${control.getId()}-fullScreen`;
		if (!this._controlMap.get(id)) {
			const fullScreenButton = new Button(id, {
				text: this._i18nBundle.getText("expand"),
				type: ButtonType.Transparent,
				press: () => {
					const layout = this._getLayout();
					layout?.toggleFullScreen(control);
				}
			});
			addFESRId(fullScreenButton, "toggleFullScreen");
			this._controlMap.set(id, fullScreenButton);
		}

		return this._controlMap.get(id) as Button;
	}

	/**
	 * Returns the selected panel in the IconTabBar inner control in
	 * case of SideBySide layout
	 *
	 * @private
	 * @returns {BasePanel} selected panel
	 */
	public _getSelectedPanel(): BasePanel {
		const panel =
			this.getContent()?.find((panel) => panel.getProperty("key") === this.getProperty("selectedKey")) || this.getContent()?.[0];
		this.setProperty("selectedKey", panel?.getProperty("key"), true);

		return panel;
	}

	/**
	 * Add content from all panels to the layout-specific inner control
	 *
	 * @private
	 */
	private _addAllPanelContent(): void {
		const panels = this.getContent() || [];

		if (this.getProperty("layout") === LayoutType.SideBySide) {
			this._iconTabBar.removeAllItems();
			panels.forEach((panel) => this._iconTabBar.addItem(this._getIconTabFilter(panel)));
			this._iconTabBar.setSelectedKey(this.getProperty("selectedKey") as string);
		} else {
			this._wrapper.removeAllItems();
			panels.forEach((panel) => this._wrapper.addItem(this._getPanelContentWrapper(panel)));
		}
	}

	/**
	 * Creates and returns a wrapper for containing the specified panel
	 * content in case of Horizontal and Vertical layout
	 *
	 * @private
	 * @param {BasePanel} panel - panel for which wrapper has to created
	 * @returns {FlexBox} wrapper container for the given panel
	 */
	protected _getPanelContentWrapper(panel: BasePanel): FlexBox {
		const id = `${panel.getId()}-contentWrapper`;

		if (!this._controlMap.get(id)) {
			this._controlMap.set(
				id,
				new FlexBox(id, {
					direction: "Column",
					renderType: "Bare"
				})
			);
		}

		//Add header as the first item in case of Horizontal and Vertical layout
		(this._controlMap.get(id) as FlexBox).addItem(this._updatePanelHeader(panel));
		panel._getContent()?.forEach((content) => (this._controlMap.get(id) as FlexBox).addItem(content));

		return this._controlMap.get(id) as FlexBox;
	}

	/**
	 * Returns header of the specified panel after updating it
	 *
	 * @private
	 * @param {BasePanel} panel - panel to be updated
	 * @returns {HBox} header associated with the panel
	 */
	private _updatePanelHeader(panel: BasePanel): HBox {
		const header = this._createHeader(panel);
		const isTitleVisible = (panel.getProperty("title") as string)?.trim().length > 0;
		const hasContainerTitle = (this.getProperty("title") as string)?.trim().length > 0;

		//update panel header elements
		this._updateContainerHeader(panel);

		//add header styling only if any of the header elements are visible
		header.toggleStyleClass(
			"sapCuxPanelHeader",
			hasContainerTitle &&
				(isTitleVisible ||
					(panel.getAggregation("menuItems") as MenuItem[])?.length > 0 ||
					(panel.getAggregation("actionButtons") as Button[])?.length > 0)
		);

		return header;
	}

	/**
	 * Setter for container title
	 *
	 * @private
	 * @param {string} title - updated title
	 * @returns {BaseContainer} BaseContainer instance for chaining
	 */
	public _setTitle(title: string): BaseContainer {
		//suppress invalidate to prevent container re-rendering. re-render only the concerned element
		this.setProperty("title", title, true);
		(this._controlMap.get(`${this.getId()}-header-title`) as Title).setText(title);
		return this;
	}

	/**
	 * Adds menu items to a control and sets up a menu button to display them.
	 * If the menu for the control doesn't exist, it creates a new one.
	 *
	 * @private
	 * @param {BaseContainer | BasePanel} control - The control to which the menu items will be added.
	 * @param {MenuItem[]} menuItems - An array of menu items to be added to the menu.
	 */
	private _addMenuItems(control: BaseContainer | BasePanel, menuItems: MenuItem[]): void {
		if (!this._controlMap.get(`${control.getId()}-menu`)) {
			//create menu list
			const list = new List(`${control.getId()}-list`, {
				itemPress: (event) => (event.getSource<List>().getParent() as Popover).close()
			});
			this._controlMap.set(`${control.getId()}-menu`, list);

			//create menu popover
			const menuPopover = new Popover(`${control.getId()}-popover`, {
				placement: PlacementType.VerticalPreferredBottom,
				showHeader: false,
				content: [list]
			});

			//create menu button
			const menuButton = new Button(`${control.getId()}-menu-btn`, {
				icon: "sap-icon://slim-arrow-down",
				type: ButtonType.Transparent,
				press: (event) => menuPopover.openBy(event.getSource<Button>())
			});
			this._controlMap.set(`${control.getId()}-menu-btn`, menuButton);
		}

		//add menu button to header
		(this._controlMap.get(control.getId() + "-header-contentLeft") as HBox)?.addItem(
			this._controlMap.get(`${control.getId()}-menu-btn`) as Button
		);

		//Clear existing menu items and add new ones
		(this._controlMap.get(`${control.getId()}-menu`) as List).removeAllItems();
		menuItems.forEach((item) => (this._controlMap.get(`${control.getId()}-menu`) as List).addItem(this._getMenuListItem(item)));
	}

	/**
	 * Creates and returns a button for the corresponding header ActionButton
	 *
	 * @private
	 * @param {Button} headerButton - ActionButton element
	 * @returns {Button} Button instance created for the header element
	 */
	private _getHeaderButton(headerButton: Button): Button {
		const id = `${headerButton.getId()}-btn`;
		if (!this._controlMap.get(id)) {
			this._controlMap.set(
				id,
				new Button(id, {
					type: ButtonType.Transparent,
					press: () => headerButton.firePress()
				})
			);
			addFESRSemanticStepName(this._controlMap.get(id) as Button, FESR_EVENTS.PRESS, getFESRId(headerButton));
		}

		//Update button details
		const button = this._controlMap.get(id) as Button;
		button.setText(headerButton.getText());
		button.setTooltip(headerButton.getTooltip() as string);
		button.setIcon(headerButton.getIcon());
		button.setVisible(headerButton.getVisible());
		button.setEnabled(headerButton.getEnabled());

		return button;
	}

	/**
	 * Retrieves the layout associated with the container, if available.
	 *
	 * @private
	 * @returns {BaseLayout} The layout associated with the BaseContainer.
	 */
	public _getLayout(): BaseLayout {
		return UI5Element.getElementById(this.getAssociation("layout", null) as string) as BaseLayout;
	}

	/**
	 * Retrieves or creates a menu list item for a given menu item.
	 *
	 * @private
	 * @param {MenuItem} menuItem - The menu item for which to retrieve or create a list item.
	 * @returns {StandardListItem} The menu list item associated with the provided menu item.
	 */
	private _getMenuListItem(menuItem: MenuItem): StandardListItem {
		if (!this._controlMap.get(`${menuItem.getId()}-listItem`)) {
			this._controlMap.set(
				`${menuItem.getId()}-listItem`,
				new StandardListItem(`${menuItem.getId()}-listItem`, {
					type: "Active",
					icon: menuItem.getIcon(),
					title: menuItem.getTitle(),
					press: (event) => menuItem.firePress({ button: event.getSource<Button>() })
				})
			);
			addFESRSemanticStepName(
				this._controlMap.get(`${menuItem.getId()}-listItem`) as StandardListItem,
				FESR_EVENTS.PRESS,
				getFESRId(menuItem)
			);
		}
		//Update list item details
		const menuListItem = this._controlMap.get(`${menuItem.getId()}-listItem`) as StandardListItem;
		menuListItem.setIcon(menuItem.getIcon());
		menuListItem.setTitle(menuItem.getTitle());
		menuListItem.setVisible(menuItem.getVisible());
		return menuListItem;
	}

	/**
	 * Toggles the visibility of menu Item.
	 *
	 * @private
	 * @param {boolean} show - Indicates whether to show or hide the menu item.
	 * @returns {void}
	 */
	public toggleMenuListItem(menuItem: MenuItem, show: boolean): void {
		if (menuItem) {
			const menuListItem = this._getMenuListItem(menuItem);
			menuListItem?.setVisible(show);
		}
	}

	public removeContent(panel: BasePanel) {
		if (this.getProperty("selectedKey") && this.getProperty("selectedKey") === panel.getProperty("key")) {
			this.setProperty("selectedKey", undefined, true);
		}
		this.removeAggregation("content", panel);
	}

	/**
	 * Gets current value of property "width".
	 *
	 * Default value is: "100%"
	 * @returns {CSSSize} Value of property "width"
	 */
	public getWidth(): CSSSize {
		return this.getProperty("width") as CSSSize;
	}

	/**
	 * Toggles the visibility of action buttons within the container and/or its inner panels.
	 *
	 * @private
	 * @param {boolean} show - Indicates whether to show or hide the action buttons.
	 * @returns {void}
	 */
	public toggleActionButtons(show: boolean): void {
		const isSideBySideLayout = this.getProperty("layout") === LayoutType.SideBySide;
		let visibilityChanged = false;
		const toggleActionButtons = (control: BaseContainer | BasePanel) => {
			control.getActionButtons()?.forEach((actionButton) => {
				const currentVisibility = actionButton.getVisible();
				if (currentVisibility !== show) {
					actionButton.setProperty("visible", show, true);
					visibilityChanged = true;
				}
			});

			if (!isSideBySideLayout && visibilityChanged) {
				this._updateContainerHeader(control);
			}
		};

		// Toggle action buttons for container
		toggleActionButtons(this);

		// Toggle action buttons for inner panels
		const panels = this.getContent() || [];
		panels.forEach(toggleActionButtons);

		// Update Header Container if required
		if (isSideBySideLayout && visibilityChanged) {
			this._updateContainerHeader(this);
		}
	}

	/**
	 * Toggles the visibility of the full screen button for the specified element.
	 *
	 * @private
	 * @param {BaseContainer | BasePanel} element - The element for which to toggle the full screen button.
	 * @param {boolean} show - Indicates whether to show or hide the full screen button.
	 * @param {boolean} isElementExpanded - Indicates whether the element is expanded.
	 */
	public toggleFullScreenElements(element: BaseContainer | BasePanel, show: boolean, isElementExpanded: boolean): void {
		const fullScreenButton = UI5Element.getElementById(element.getAssociation("fullScreenButton", null) as string) as Button;
		const fullScreenMenuButton = UI5Element.getElementById(element.getAssociation("fullScreenMenuItem", null) as string) as MenuItem;
		const isSideBySideLayout = this.getProperty("layout") === LayoutType.SideBySide;
		const isPhone = this.getDeviceType() === DeviceType.Mobile;
		let elementVisibilityChanged = false;
		[fullScreenButton, fullScreenMenuButton].forEach((fullScreenElement: Button | MenuItem) => {
			if (fullScreenElement && show !== fullScreenElement.getVisible()) {
				elementVisibilityChanged = true;
				show = !isPhone ? show : false;
				fullScreenElement.setProperty("visible", isElementExpanded ? true : show, true);
			}
		});
		const elementKey = element instanceof BasePanel && element.getKey();
		if (elementVisibilityChanged && (!isSideBySideLayout || (isSideBySideLayout && this.getProperty("selectedKey") === elementKey))) {
			this._updateContainerHeader(element);
		}
	}

	/**
	 * Sets the device type based on the width of the container element.
	 *
	 * @private
	 * @param {ResizeObserverEntry[]} entries - The entries returned by the ResizeObserver.
	 * @returns {void}
	 */
	private _setDeviceType(entries: ResizeObserverEntry[]): void {
		const [entry] = entries;
		const width = entry?.contentRect.width;
		const deviceType = calculateDeviceType(width);

		if (this._deviceType !== deviceType) {
			this._deviceType = deviceType;
		}
	}

	/**
	 * Retrieves the device type for the current instance.
	 *
	 * @private
	 * @returns {DeviceType} - The device type. If the device type is not set, it calculates
	 * and returns the device type based on the current device width.
	 */
	public getDeviceType(): DeviceType {
		return this._deviceType || calculateDeviceType();
	}
}
