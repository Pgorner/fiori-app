/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import Log from "sap/base/Log";
import IconTabBar from "sap/m/IconTabBar";
import Event from "sap/ui/base/Event";
import { MetadataOptions } from "sap/ui/core/Element";
import Container from "sap/ushell/Container";
import Navigation from "sap/ushell/services/Navigation";
import BaseContainer, { $BaseContainerSettings } from "./BaseContainer";
import ToDoPanel, { Intent } from "./ToDoPanel";
import { DeviceType } from "./utils/Device";

/**
 *
 * Container class for managing and storing To-Do cards.
 *
 * @extends BaseContainer
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.121
 *
 * @internal
 * @experimental Since 1.121
 * @public
 *
 * @alias sap.cux.home.ToDosContainer
 */
export default class ToDosContainer extends BaseContainer {
	private _isAuthCheckRequired!: boolean;
	private _iconTabBarControl!: IconTabBar;

	static cardCount: number | undefined;
	static readonly metadata: MetadataOptions = {
		library: "sap.cux.home",
		properties: {
			fullScreenName: { type: "string", group: "Misc", defaultValue: "ST1", visibility: "hidden" }
		}
	};
	static renderer = {
		...BaseContainer.renderer,
		apiVersion: 2
	};

	/**
	 * Constructor for a new To-Dos container.
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

		//Update Container Title
		this.setProperty("title", this._i18nBundle?.getText("toDosTitle"));
		this.addStyleClass("sapCuxToDosContainer");
		this._isAuthCheckRequired = true;
	}

	/**
	 * onBeforeRendering lifecycle method
	 *
	 * @private
	 * @override
	 */
	public async onBeforeRendering(): Promise<void> {
		super.onBeforeRendering();
		this._iconTabBarControl = this._getInnerControl() as IconTabBar;

		//initiate loading of all cards after auth check
		try {
			await this._performAuthCheck();

			const panels = (this.getContent() as ToDoPanel[]) || [];
			const unsupportedPanels = panels.filter((panel) => !panel._getSupported());

			if (unsupportedPanels.length === panels.length) {
				this._handleToDoUnauthorizedAccess();
			} else {
				// Hide IconTabBar header if only one panel is accessible
				const isOnePanelSupported = panels.length - unsupportedPanels.length === 1;
				this._iconTabBarControl?.toggleStyleClass("sapUiITBHide", isOnePanelSupported);
				await this._loadAllPanels();
			}
		} catch (error) {
			this._handleToDoUnauthorizedAccess(error as Error);
		}
	}

	/**
	 * Performs an authorization check for the ToDosContainer.
	 * Checks if the authorization check is required and updates panel support accordingly.
	 *
	 * @private
	 * @async
	 * @returns {Promise<void>} A Promise that resolves when the authorization check is completed.
	 * @throws {Error} If an error occurs during the authorization check.
	 */
	private async _performAuthCheck(): Promise<void> {
		try {
			if (!this._isAuthCheckRequired) {
				return Promise.resolve();
			} else {
				const navigationService = await Container.getServiceAsync<Navigation>("Navigation");
				const panels = (this.getContent() as ToDoPanel[]) || [];
				const intents = panels.map((panel) => panel._getAppIntent()) as Intent[];
				const responses = (await navigationService.isNavigationSupported(intents)) as { supported: boolean }[];

				//Update panel support information
				panels.forEach((panel, index) => panel._setSupported(responses[index].supported));
				this._isAuthCheckRequired = false;
				return Promise.resolve();
			}
		} catch (oError) {
			return Promise.reject(oError as Error);
		}
	}

	/**
	 * Handles unauthorized access to the ToDosContainer by hiding all inner controls
	 *
	 * @private
	 * @param {Error} error - An optional custom error message or an Error object.
	 */
	private _handleToDoUnauthorizedAccess(error?: Error): void {
		//Remove all Inner Controls
		Log.error(error?.message || "User has no access to any available panels");
		(this.getContent() as ToDoPanel[])?.forEach((panel) => this.removeContent(panel));
		this.setVisible(false);
	}

	/**
	 * Asynchronously loads all panels, ensuring the currently selected panel is loaded first.
	 *
	 * @private
	 * @async
	 * @param {boolean} forceRefresh - force refresh cards
	 * @returns {Promise<void>} A promise that resolves when all panels are loaded.
	 */
	private async _loadAllPanels(forceRefresh?: boolean): Promise<void> {
		//Sort panels so that the current panel is always loaded first
		const selectedKey = this.getProperty("selectedKey") as string;
		const panels = (this.getContent() as ToDoPanel[]) || [];
		const sortedPanels = [...panels].sort((firstPanel, secondPanel) => {
			if (firstPanel.getProperty("key") === selectedKey) {
				return -1;
			}
			if (secondPanel.getProperty("key") === selectedKey) {
				return 1;
			}
			return 0;
		});

		for (const panel of sortedPanels) {
			if (!panel._isLoaded?.()) {
				await panel._loadCards(forceRefresh);
			}
		}
	}

	/**
	 * Overridden method for selection of panel in the IconTabBar.
	 * Loads the selected panel and updates the header elements as well
	 *
	 * @private
	 * @async
	 * @override
	 */
	protected async _onPanelSelect(event: Event): Promise<void> {
		super._onPanelSelect(event);

		//load panel if not loaded already
		const selectedPanel = this._getSelectedPanel() as ToDoPanel;
		if (!selectedPanel._isLoaded()) {
			await selectedPanel._loadCards(true);
		}

		//updates refresh information of the selected panel
		selectedPanel._updateRefreshInformation();
	}

	/**
	 * Asynchronously refreshes the section by forcing all inner panels to be reloaded.
	 *
	 * @public
	 * @async
	 * @returns {Promise<void>} A promise that resolves when the section is successfully refreshed.
	 */
	public async refreshData(): Promise<void> {
		//Force all inner panels to be reloaded
		(this.getContent() as ToDoPanel[])?.forEach((panel) => panel._setLoaded(false));
		return await this._loadAllPanels(true);
	}

	/**
	 * Gets the selected key of the To-Dos container.
	 * If no selected key is set, it defaults to the first item.
	 *
	 * @public
	 * @returns {string} The selected key.
	 */
	public getSelectedKey(): string {
		//Default selected key to first item, if null
		if (!this.getProperty("selectedKey")) {
			this.setProperty("selectedKey", this._getDefaultKey());
		}

		return this.getProperty("selectedKey") as string;
	}

	/**
	 * Gets the default key for the ToDosContainer by returning the key of the first panel
	 *
	 * @private
	 * @returns {string} The default key if it exists, or null if there are no panels
	 */
	private _getDefaultKey(): string {
		return this.getContent()?.[0]?.getProperty("key") as string;
	}

	/**
	 * Adjusts the layout of the all panels in the container.
	 *
	 * @private
	 * @override
	 */
	public adjustLayout() {
		//hide actions if the device is a phone
		this.toggleActionButtons(this.getDeviceType() !== DeviceType.Mobile);

		//adjust layout of all panels
		(this.getContent() as ToDoPanel[])?.forEach((panel) => panel._adjustLayout());
	}
}
