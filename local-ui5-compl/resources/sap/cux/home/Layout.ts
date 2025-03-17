/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import { Event } from "jquery";
import Log from "sap/base/Log";
import UI5Event from "sap/ui/base/Event";
import { MetadataOptions } from "sap/ui/core/Element";
import S4MyHome from "sap/ushell/api/S4MyHome";
import Container from "sap/ushell/Container";
import Extension from "sap/ushell/services/Extension";
import Item from "sap/ushell/services/Extension/Item";
import AdvancedSettingsPanel from "./AdvancedSettingsPanel";
import AppsContainer from "./AppsContainer";
import BaseContainer from "./BaseContainer";
import BaseLayout, { $BaseLayoutSettings } from "./BaseLayout";
import BaseLayoutRenderer from "./BaseLayoutRenderer";
import BasePanel from "./BasePanel";
import BaseSettingsDialog from "./BaseSettingsDialog";
import BaseSettingsPanel from "./BaseSettingsPanel";
import InsightsCardsSettingsPanel from "./InsightsCardsSettingsPanel";
import InsightsTilesSettingsPanel from "./InsightsTilesSettingsPanel";
import KeyUserLayoutSettingsPanel from "./KeyUserLayoutSettingsPanel";
import KeyUserNewsPagesSettingsPanel from "./KeyUserNewsPagesSettingsPanel";
import KeyUserSettingsDialog from "./KeyUserSettingsDialog";
import LayoutSettingsPanel from "./LayoutSettingsPanel";
import NewsAndPagesContainer from "./NewsAndPagesContainer";
import NewsSettingsPanel from "./NewsSettingsPanel";
import NoDataContainer from "./NoDataContainer";
import PagePanel from "./PagePanel";
import PageSettingsPanel from "./PageSettingsPanel";
import SettingsDialog from "./SettingsDialog";
import ToDosContainer from "./ToDosContainer";
import { SETTINGS_PANELS_KEYS } from "./utils/Constants";
import KeyUserPersonalization from "./utils/KeyUserPersonalization";
import PersonalisationUtils from "./utils/PersonalisationUtils";

interface IElement {
	completeId: string;
	sContainerType: string;
	blocked: boolean;
	visible: boolean;
	title: string;
	text: string;
}

export interface UserActionProperties {
	id: string;
	icon: string;
	text: string;
	tooltip: string;
	press: () => void;
}

/**
 *
 * Layout class for the My Home layout.
 *
 * @extends BaseLayout
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.121
 *
 * @internal
 * @experimental Since 1.121
 * @public
 *
 * @alias sap.cux.home.Layout
 */
export default class Layout extends BaseLayout {
	private _layoutSettingsPanel!: LayoutSettingsPanel;
	private _advancedSettingsPanel!: AdvancedSettingsPanel;
	private _isCustomNews!: boolean;
	private _pagesAvailable!: boolean;
	private _toDoAccessible!: boolean;
	private _aOrderedSections!: IElement[] | undefined;
	private _noDataContainer!: NoDataContainer;
	private _shellUserActions: Item[] = [];
	private _userActionsAdded!: boolean;
	private _keyUserPersonalization!: KeyUserPersonalization;
	private _isDefaultSettingsDialog: boolean = false;
	private _customNoDataContainerPresent: boolean = true;

	static readonly metadata: MetadataOptions = {
		designtime: "sap/cux/home/designtime/Layout.designtime"
	};
	static renderer: typeof BaseLayoutRenderer = BaseLayoutRenderer;

	/**
	 * Constructor for a new layout.
	 *
	 * @param {string} [id] ID for the new control, generated automatically if an ID is not provided
	 * @param {object} [settings] Initial settings for the new control
	 */
	public constructor(id?: string, settings?: $BaseLayoutSettings) {
		super(id, settings);
	}

	/**
	 * Init lifecycle method
	 *
	 * @private
	 * @async
	 * @override
	 */
	public init(): void {
		super.init();

		//setup layout
		this.setProperty("enableSettings", true);
		this.setProperty("enableFullScreen", true);

		// Setup KeyUserPersonalization
		this._keyUserPersonalization = new KeyUserPersonalization(PersonalisationUtils.getOwnerComponent(this), this._i18nBundle);
	}

	/**
	 * Adds all user actions to the Fiori launchpad.
	 *
	 * @private
	 */
	private async _addUserActions() {
		try {
			if (this.getVisible() && !this._userActionsAdded) {
				this._userActionsAdded = true;

				// Configure User Actions
				const userActions: UserActionProperties[] = [
					{
						id: `${this.getId()}-homeSettingsBtn`,
						icon: "sap-icon://edit",
						text: this._i18nBundle.getText("myHomeSettings") as string,
						tooltip: this._i18nBundle.getText("myHomeSettings") as string,
						press: () => {
							void this.openSettingsDialog();
						}
					}
				];

				// Add RTA User Action if Key User
				const rtaUserAction = await this._keyUserPersonalization.getRTAUserAction();
				if (rtaUserAction) {
					userActions.push(rtaUserAction);
				}

				// Attach User Actions
				const extensionService = await Container.getServiceAsync<Extension>("Extension");
				for (let action of userActions) {
					const shellUserAction = await extensionService.createUserAction(action, {
						controlType: "sap.ushell.ui.launchpad.ActionItem"
					});
					shellUserAction.showOnHome();
					this._shellUserActions.push(shellUserAction);
				}

				// Toggle User Actions on Page Change
				const toggleUserActions = (event: UI5Event<{ isMyHomeRoute: boolean }>) => {
					const show = event.getParameter("isMyHomeRoute");
					this._shellUserActions.forEach(function (userAction) {
						if (show) {
							userAction.showOnHome();
						} else {
							userAction.hideOnHome();
						}
					});
				};
				S4MyHome.attachRouteMatched({}, toggleUserActions, this);
			}
		} catch (error: unknown) {
			Log.warning("Unable to add User Actions", error instanceof Error ? error.message : "");
		}
	}

	/**
	 * Opens the settings dialog for the layout.
	 * Overriden from the BaseLayout to ensure of all panels
	 * to the dialog if not already added.
	 *
	 * @private
	 * @param {string} selectedKey The key of the panel to navigate to
	 * @override
	 */
	public async openSettingsDialog(selectedKey: string = "", context?: object): Promise<void> {
		const settingsDialog = this.getAggregation("settingsDialog") as BaseSettingsDialog;
		if (settingsDialog.getPanels().length !== this._getSettingsPanels().length) {
			this._addPanelsToSettingsDialog();
		}
		await this._calculateSectionsState();

		super.openSettingsDialog(selectedKey, context);
	}

	/**
	 * Close Settings Dialog
	 *
	 * @private
	 *
	 */
	public closeSettingsDialog(): void {
		const settingsDialog = this.getAggregation("settingsDialog") as BaseSettingsDialog;
		settingsDialog?.close();
	}

	/**
	 * onBeforeRendering lifecycle method
	 *
	 * @private
	 * @override
	 */
	public async onBeforeRendering(event: Event): Promise<void> {
		super.onBeforeRendering(event);

		// setup no-data container
		if (!this._noDataContainer) {
			this._noDataContainer = this.getItems().find((item) => item instanceof NoDataContainer) as NoDataContainer;

			// if no data container is already present, use it
			if (!this._noDataContainer) {
				this._customNoDataContainerPresent = false;
				this._noDataContainer = new NoDataContainer(`${this.getId()}-noDataContainer`);
			}
			this._noDataContainer.setVisible(false);
		}

		//prepare layout data, if not already done
		if (!this._aOrderedSections) {
			setTimeout(this._prepareLayoutData.bind(this));
		}

		//setup common layout features
		this._setupSettingsDialog();

		// Setup KeyUserPersonalization
		this._setupKeyUserSettingsDialog();

		//configure user action button if the layout is in an ushell environment
		await this._addUserActions();
	}

	/**
	 * Sets up the settings dialog for the layout.
	 *
	 * @private
	 */
	private _setupSettingsDialog(): void {
		const allPanels: BasePanel[] = [];
		(this.getItems() || []).forEach((container) => {
			//link container to layout
			container.setAssociation("layout", this);

			//enable settings for all panels
			container.getContent().forEach((panel) => {
				allPanels.push(panel);
				const panelEnableSettings = panel.getProperty("enableSettings") as boolean;
				panel.setProperty("enableSettings", panelEnableSettings !== undefined ? panelEnableSettings : true);
			});
		});

		const enableSettings = this.getProperty("enableSettings") as boolean;
		const settingsDialog = this.getAggregation("settingsDialog") as BaseSettingsDialog | undefined;
		if (!settingsDialog) {
			this._isDefaultSettingsDialog = true;

			// If settings dialog is not provided and settings is enabled, create a default settings dialog
			if (enableSettings) {
				const defaultSettingsDialog = this._getDefaultSettingsDialog(allPanels);
				this.setSettingsDialog(defaultSettingsDialog);
			}
		}
	}

	/**
	 * Get default settings dialog
	 * @private
	 * @returns {BaseSettingsDialog} Default settings dialog
	 */
	private _getDefaultSettingsDialog(allPanels: BasePanel[]): BaseSettingsDialog {
		const defaultSettingsDialog = new SettingsDialog(`${this.getId()}-settings-dialog`);

		allPanels.forEach((panel) => {
			const settingsPanel = this._getDefaultSettingsPanel(panel);
			if (settingsPanel) {
				defaultSettingsDialog.addPanel(settingsPanel);
			}
		});

		//sort all panels and add them to the settings dialog
		const sortedPanels = this._sortPanels(defaultSettingsDialog.getPanels());
		defaultSettingsDialog.removeAllPanels();
		sortedPanels.forEach((panel) => defaultSettingsDialog.addPanel(panel));

		defaultSettingsDialog.insertPanel(this._getLayoutSettingsPanel(), 0);
		defaultSettingsDialog.addPanel(this._getAdvancedSettingsPanel());

		return defaultSettingsDialog;
	}

	/**
	 * Get default Settings Panel
	 *
	 * @private
	 */

	private _getDefaultSettingsPanel(panel: BasePanel): BaseSettingsPanel | undefined {
		let settingsPanel: BaseSettingsPanel | undefined;
		const panelClassName = panel.getMetadata().getName();
		switch (panelClassName) {
			case "sap.cux.home.NewsPanel":
				settingsPanel = new NewsSettingsPanel(`${panel.getId()}-news-settings`);
				break;
			case "sap.cux.home.PagePanel":
				settingsPanel = new PageSettingsPanel(`${panel.getId()}-page-settings`);
				break;
			case "sap.cux.home.TilesPanel":
				settingsPanel = new InsightsTilesSettingsPanel(`${panel.getId()}-tiles-settings`);
				break;
			case "sap.cux.home.CardsPanel":
				settingsPanel = new InsightsCardsSettingsPanel(`${panel.getId()}-cards-settings`);
				break;
			default:
				break;
		}
		settingsPanel?.setAssociation("panel", panel);
		return settingsPanel;
	}

	/**
	 * Adds all settings panels to the settings dialog, including
	 * the layout settings panel and advanced settings panel.
	 *
	 * @private
	 */
	private _addPanelsToSettingsDialog(): void {
		const settingsDialog = this.getAggregation("settingsDialog") as BaseSettingsDialog;

		//sort all panels and add them to the settings dialog
		const sortedPanels = this._sortPanels(settingsDialog.getPanels());
		settingsDialog.removeAllPanels();
		sortedPanels.forEach((panel) => settingsDialog.addPanel(panel));

		// Layout Settings should be displayed only if no settings dialog is provided
		if (this._isDefaultSettingsDialog) {
			settingsDialog.insertPanel(this._getLayoutSettingsPanel(), 0);
			settingsDialog.addPanel(this._getAdvancedSettingsPanel());
		}
		settingsDialog.addPanel(this._getAdvancedSettingsPanel());
		this._addSettingsPanel(settingsDialog.getPanels(), true);
	}

	/**
	 * Sorts settings panels based on a predefined order.
	 *
	 * @private
	 * @returns {BaseSettingsPanel[]} Sorted settings panels.
	 */
	private _sortPanels(panels: BaseSettingsPanel[]): BaseSettingsPanel[] {
		return Object.keys(SETTINGS_PANELS_KEYS)
			.map((key) => panels.find((panel) => panel?.getProperty("key") === key))
			.filter(Boolean) as BaseSettingsPanel[];
	}

	/**
	 * Retrieves the advanced settings panel associated with the layout.
	 *
	 * @private
	 * @returns {AdvancedSettingsPanel} The advanced settings panel.
	 */
	private _getAdvancedSettingsPanel(): AdvancedSettingsPanel {
		if (!this._advancedSettingsPanel) {
			this._advancedSettingsPanel = new AdvancedSettingsPanel(`${this.getId()}-advanced-settings`);
			this._advancedSettingsPanel.setAssociation("panel", this);
		}

		return this._advancedSettingsPanel;
	}

	/**
	 * Retrieves the layout settings panel associated with the layout.
	 *
	 * @private
	 * @returns {LayoutSettingsPanel} The layout settings panel.
	 */
	private _getLayoutSettingsPanel(): LayoutSettingsPanel {
		if (!this._layoutSettingsPanel) {
			this._layoutSettingsPanel = new LayoutSettingsPanel(`${this.getId()}-layout-settings`);
			this._layoutSettingsPanel.setAssociation("panel", this);
		}

		return this._layoutSettingsPanel;
	}

	/**
	 * Prepares the layout data.
	 *
	 * @private
	 */
	private _prepareLayoutData(): void {
		let hasVisibleSection = false;
		const aElements = this.getItems();
		// set aelementsMap as elementMap[] | [];
		const aElementMap: IElement[] = [];
		aElements.forEach((element: BaseContainer) => {
			if (element !== this._noDataContainer) {
				const sId = element.getId();

				//if no title set for container , then layout setting should show tooltip as title within the settings dialog
				let title = element.getProperty("title") as string;
				if (!title) {
					title = element.getTooltip() as string;
				}
				const elementVisible = element.getVisible();
				aElementMap.push({
					completeId: sId,
					sContainerType: element.getMetadata().getName(),
					blocked: false,
					visible: element.getProperty("visible") as boolean,
					title: element instanceof NewsAndPagesContainer ? (this._i18nBundle.getText("myInterestMsg") as string) : title,
					text: this._setTextValue(element)
				});
				if (elementVisible) {
					hasVisibleSection = true;
				}
			}
		});

		this._aOrderedSections = aElementMap;
		if (!this.getProperty("expanded")) {
			this.setNoDataContainerVisibility(!hasVisibleSection);
		}
	}

	/**
	 * Sets the text value for the section
	 * @private
	 */
	private _setTextValue(element: BaseContainer): string {
		if (element instanceof ToDosContainer) {
			return this._i18nBundle.getText("forMeTodayMsg") as string;
		} else if (element instanceof AppsContainer) {
			return this._i18nBundle.getText("myAppMsg") as string;
		}
		return "";
	}

	/**
	 * Sets the visibility of the no data container
	 *
	 * @private
	 */
	public setNoDataContainerVisibility(contentVisible: boolean): void {
		this._noDataContainer?.setVisible(contentVisible);
		if (!this._customNoDataContainerPresent) {
			if (contentVisible) {
				this.insertItem(this._noDataContainer, 0);
			} else {
				this.removeItem(this._noDataContainer);
			}
		}
	}

	/**
	 * Calculates the state of the sections based on the layout's content.
	 * @private
	 */
	public async _calculateSectionsState(): Promise<void> {
		const settingsDialog = this.getAggregation("settingsDialog") as SettingsDialog;
		const aSettingsPanel = settingsDialog.getPanels();
		this._isCustomNews = false;
		aSettingsPanel.forEach((oSettingsPanel: BaseSettingsPanel) => {
			if (oSettingsPanel instanceof NewsSettingsPanel) {
				this._isCustomNews = true;
			}
			if (oSettingsPanel instanceof AdvancedSettingsPanel) {
				oSettingsPanel.resetImportModel(true);
			}
		});
		await this.setSectionDetails();
	}

	/**
	 * Sets the section details based on the layout's content.
	 * @private
	 */
	private async setSectionDetails(): Promise<void> {
		const elementArray = this.getItems();
		for (const element of elementArray) {
			let bBlocked = false;
			const sId = element.getId();
			//check news & apps visibility
			if (element instanceof NewsAndPagesContainer && element.getVisible()) {
				const aNewsAndPagesPanel = element.getContent();
				//check whether user has access to pages
				bBlocked = aNewsAndPagesPanel.length ? await this.checkPagesBlocked(aNewsAndPagesPanel) : false;
			} else if (element instanceof ToDosContainer) {
				bBlocked = this.checkToDoBlocked(element);
			}

			this._aOrderedSections?.forEach((oElementItem) => {
				if (oElementItem.completeId === sId) {
					oElementItem.blocked = bBlocked;
					oElementItem.visible = element.getVisible();
				}
			});
		}
	}

	/**
	 * Check whether My Interest section is blocked or not
	 * @private
	 */
	private async checkPagesBlocked(aNewsAndPagesPanel: BasePanel[]): Promise<boolean> {
		for (const oPanel of aNewsAndPagesPanel) {
			if (oPanel instanceof PagePanel) {
				// find if user has any pages accessible
				const aPages = (await oPanel.getUserAvailablePages()) || [];
				if (aPages.length) {
					this._pagesAvailable = true;
				}
			}
		}
		//if user has no available pages and no  news feed, then block the section
		if (!this._pagesAvailable && !this._isCustomNews) {
			return true;
		}
		return false;
	}

	/**
	 * Check whether For Me Today section is blocked or not
	 * @private
	 */
	private checkToDoBlocked(toDoContainer: BaseContainer): boolean {
		if (!toDoContainer.getVisible()) {
			const panels = toDoContainer.getContent();
			if (panels.length === 0) {
				this._toDoAccessible = false;
				return true;
			}
		}
		return false;
	}

	/**
	 * Sets up the key user settings dialog for the layout.
	 *
	 * @private
	 */
	private _setupKeyUserSettingsDialog(): void {
		const keyUserSettingsDialog = this.getAggregation("keyUserSettingsDialog") as BaseSettingsDialog;
		if (!keyUserSettingsDialog) {
			const defaultKeyUserSettingsDialog = new KeyUserSettingsDialog(`${this.getId()}-keyUser-settings-dialog`);

			// Add Key User Layout Settings Panel
			const keyUserLayoutSettingsPanel = new KeyUserLayoutSettingsPanel(`${this.getId()}-keyUser-layout-settings`);
			keyUserLayoutSettingsPanel.setAssociation("panel", this);
			defaultKeyUserSettingsDialog.addPanel(keyUserLayoutSettingsPanel);

			// Add News and Pages Settings Panel If News and Pages Container is available
			(this.getItems() || []).forEach((container: BaseContainer) => {
				if (container instanceof NewsAndPagesContainer) {
					const keyUserNewsPagesSettingsPanel = new KeyUserNewsPagesSettingsPanel(`${this.getId()}-keyUser-news-pages-settings`);
					// Set any panel of the containet to the settings panel as association
					keyUserNewsPagesSettingsPanel.setAssociation("panel", container.getContent()?.[0]);
					defaultKeyUserSettingsDialog.addPanel(keyUserNewsPagesSettingsPanel);
				}
			});

			this.setAggregation("keyUserSettingsDialog", defaultKeyUserSettingsDialog);
		}
	}

	/**
	 * Return the pages availability value
	 * @private
	 */
	public getpagesAvailable(): boolean {
		return this._pagesAvailable;
	}

	/**
	 * Return the To-Dos availability value
	 * @private
	 */
	public isToDoAccessible(): boolean {
		return this._toDoAccessible;
	}

	/**
	 * Return whether customNews available or not
	 */
	public customNewAvailable(): boolean {
		return this._isCustomNews;
	}

	/**
	 * Returns the set of sections present within the layout
	 *
	 * @private
	 */
	public getSections(): IElement[] {
		return this._aOrderedSections!;
	}

	/**
	 * Sets the sections present within the layout
	 *
	 * @private
	 */
	public setSections(sections: IElement[]): void {
		this._aOrderedSections = sections;
	}

	/**
	 * Resets the ordered sections of the layout.
	 *
	 * @private
	 */
	public resetSections(): void {
		this._aOrderedSections = undefined;
		this._prepareLayoutData();
	}
}
