/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import Log from "sap/base/Log";
import GridContainer from "sap/f/GridContainer";
import GridContainerSettings from "sap/f/GridContainerSettings";
import Button from "sap/m/Button";
import GenericTile from "sap/m/GenericTile";
import HeaderContainer from "sap/m/HeaderContainer";
import IllustratedMessage from "sap/m/IllustratedMessage";
import IllustratedMessageSize from "sap/m/IllustratedMessageSize";
import IllustratedMessageType from "sap/m/IllustratedMessageType";
import MessageToast from "sap/m/MessageToast";
import Panel from "sap/m/Panel";
import VBox from "sap/m/VBox";
import { BackgroundDesign } from "sap/m/library";
import Event from "sap/ui/base/Event";
import Control from "sap/ui/core/Control";
import type { MetadataOptions } from "sap/ui/core/Element";
import Config from "sap/ushell/Config";
import Container from "sap/ushell/Container";
import URLParsing from "sap/ushell/services/URLParsing";
import App from "./App";
import AppsContainer from "./AppsContainer";
import { $BaseAppPanelSettings } from "./BaseAppPanel";
import BasePanel from "./BasePanel";
import Group from "./Group";
import MenuItem from "./MenuItem";
import { IActivity, ICustomVisualization, IVisualization } from "./interface/AppsInterface";
import AppManager from "./utils/AppManager";
import { DeviceType } from "./utils/Device";

/**
 *
 * Base App Panel class for managing and storing Apps.
 *
 * @extends sap.cux.home.BasePanel
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.121.0
 *
 * @abstract
 * @internal
 * @experimental Since 1.121
 * @private
 *
 * @alias sap.cux.home.BaseAppPanel
 */

export default abstract class BaseAppPanel extends BasePanel {
	private _isDirty: boolean = true;
	private _isMobileDirty: boolean = true;
	private _isLoaded: boolean = false;
	private _appsWrapper!: GridContainer;
	private _errorCard!: VBox;
	private _errorMessage!: IllustratedMessage;
	private _appsPanelWrapper!: VBox;
	private _allAvailableVisualizations!: IVisualization[];
	private _catalogVisualizationCache!: Map<string, IVisualization>;
	protected appManagerInstance!: AppManager;
	private _isSupported: boolean = true;
	private _mobileAppsWrapper!: HeaderContainer;
	protected _menuItems!: MenuItem[];
	protected _actionButtons!: Button[];
	protected _controlMap!: Map<string, Control | Element>;

	constructor(idOrSettings?: string | $BaseAppPanelSettings);
	constructor(id?: string, settings?: $BaseAppPanelSettings);
	constructor(id?: string, settings?: $BaseAppPanelSettings) {
		super(id, settings);
	}

	static readonly metadata: MetadataOptions = {
		library: "sap.cux.home",
		defaultAggregation: "apps",
		aggregations: {
			/**
			 * Holds the apps aggregation
			 */
			apps: { type: "sap.cux.home.App", singularName: "app", multiple: true }
		},
		events: {
			/**
			 * Fired when OnBeforeRendering of container is triggered.
			 */
			navigated: {},
			/**
			 * Fired when the panel supported property is changed.
			 */
			supported: {
				parameters: {
					isSupported: { type: "boolean" }
				}
			}
		}
	};

	/**
	 * This method must be implemented by panel, to set the apps that needs to be shown in the panel.
	 * @abstract
	 */
	abstract loadApps(): Promise<void>;

	public init() {
		super.init();
		this.appManagerInstance = AppManager.getInstance();
		this._controlMap = new Map();
		//Add Wrapper to Panel
		this._appsPanelWrapper = this._generateWrapper();
		this._addContent(this._appsPanelWrapper);
	}

	/**
	 * Generates the wrapper for the apps panel, if it doesn't already exist
	 *
	 * @private
	 * @override
	 * @returns {sap.m.VBox} The apps panel wrapper.
	 */
	protected _generateWrapper() {
		if (!this._appsPanelWrapper) {
			this._appsPanelWrapper = new VBox(`${this.getId()}-appsPanelWrapper`, {
				items: [this._generateDesktopAppsWrapper(), this._generateMobileAppsWrapper(), this._generateErrorMessage()],
				width: "100%"
			}).addStyleClass("sapCuxAppsPanel sapCuxAppsContainerBorder");
		}
		return this._appsPanelWrapper;
	}

	/**
	 * Generates desktop apps wrapper for displaying apps.
	 * @private
	 * @returns {sap.m.VBox} The generated apps wrapper.
	 */
	public _generateDesktopAppsWrapper() {
		const controlId = `${this.getId()}-desktopAppsWrapper`;
		if (!this._controlMap.get(controlId)) {
			this._controlMap.set(
				controlId,
				new VBox({
					id: `${this.getId()}-desktopAppsWrapper`,
					items: [this._generateAppsWrapper()],
					visible: this.getDeviceType() !== DeviceType.Mobile,
					backgroundDesign: BackgroundDesign.Solid
				}).addStyleClass("sapCuxAppsPanel sapCuxAppsContainerBorder")
			);
		}
		return this._controlMap.get(controlId) as VBox;
	}

	/**
	 * Generates app wrapper (GridContainer) for displaying apps.
	 * @private
	 * @returns {sap.m.GridContainer} The generated apps wrapper.
	 */
	public _generateAppsWrapper(): GridContainer {
		//create container
		if (!this._appsWrapper) {
			this._appsWrapper = new GridContainer({
				id: `${this.getId()}-appsWrapper`,
				layout: new GridContainerSettings({
					columnSize: "19rem",
					gap: "0.5rem"
				}),
				visible: this.getDeviceType() !== DeviceType.Mobile
			});
		}
		return this._appsWrapper;
	}

	/**
	 * Generates wrapper for displaying apps in mobile mode.
	 * @private
	 * @returns {sap.m.HeaderContainer} The generated apps wrapper.
	 */
	public _generateMobileAppsWrapper() {
		if (!this._mobileAppsWrapper) {
			this._mobileAppsWrapper = new HeaderContainer({
				id: `${this.getId()}-mobileAppsWrapper`,
				gridLayout: true,
				showDividers: false,
				height: "23.5rem",
				content: [],
				visible: this.getDeviceType() === DeviceType.Mobile
			}).addStyleClass("sapUiMargin-26Bottom sapMHeaderContainerAlign");
		}
		return this._mobileAppsWrapper;
	}

	/**
	 * Generates the error message wrapper with illustrated message.
	 * @private
	 * @returns {sap.m.VBox} Wrapper with illustrated message.
	 */
	public _generateErrorMessage(): VBox {
		if (!this._errorCard) {
			this._errorCard = new VBox(`${this.getId()}-errorCard`, {
				wrap: "Wrap",
				backgroundDesign: "Solid",
				items: [this.generateIllustratedMessage()],
				visible: this.getApps().length === 0,
				justifyContent: "Center"
			}).addStyleClass("sapCuxAppsPanel");
		}
		this._errorCard.setHeight(this.getDeviceType() === DeviceType.Mobile ? "23.5rem" : "auto");
		return this._errorCard;
	}

	/**
	 * Creates and returns app instances for given app objects
	 * @private
	 * @param {object[]} appObjects - Array of app object.
	 * @returns {sap.cux.home.App[]} - Array of app instances
	 */
	public generateApps(visualizationsData: ICustomVisualization[]) {
		return visualizationsData.map((visualizationData) => {
			const app = new App("", {
				title: visualizationData.title,
				subTitle: visualizationData.subtitle,
				bgColor: visualizationData.BGColor,
				icon: visualizationData.icon,
				url: visualizationData.url,
				vizId: visualizationData.vizId || visualizationData.visualization?.vizId,
				status: visualizationData.status
			});
			if (visualizationData.oldAppId) {
				app.data("oldAppId", visualizationData.oldAppId);
			}
			visualizationData.menuItems?.forEach((menuItem) => {
				app.addAggregation("menuItems", menuItem, true);
			});
			return app;
		});
	}

	/**
	 * Add multiple apps in the apps aggregation.
	 * @param {sap.cux.home.App[]} apps - Array of apps.
	 */
	public setApps(apps: App[]) {
		apps.forEach((app) => {
			this.addAggregation("apps", app, true);
		});
	}

	/**
	 * Fetches and returns the tile visualizations for the current device type (Mobile or Desktop).
	 *
	 * @public
	 * @param {GenericTile[]} tiles - This array will be updated with new tile data based on the device type.
	 *
	 * @returns {GenericTile[]} - returns updated tiles
	 */
	public fetchTileVisualization(tiles: GenericTile[] = []): GenericTile[] {
		if (this.getDeviceType() === DeviceType.Mobile) {
			const cards = (this._generateMobileAppsWrapper()?.getContent() || []) as Panel[];
			for (const card of cards) {
				tiles = tiles.concat((card?.getContent() || []) as GenericTile[]);
			}
		} else {
			tiles = (this._generateAppsWrapper()?.getItems() || []) as GenericTile[];
		}
		return tiles;
	}

	/**
	 * Convert array of provided activities to app
	 * @private
	 * @param {object[]} activities - Array of activities.
	 * @returns {object[]} - Array of apps
	 */
	protected async convertActivitiesToVisualizations(activities: IActivity[]) {
		const [availableVisualizations, URLParsingService] = await Promise.all([
			this._getAllAvailableVisualizations(),
			Container.getServiceAsync<URLParsing>("URLParsing")
		]);
		const appActivities = activities
			.filter((activity) => activity.appType === "Application")
			.map((activity) => {
				activity.orgAppId = activity.appId;
				activity.appId = activity.url;
				return activity;
			});
		const visualizations = appActivities
			.map((activity) => this._convertToVisualization(activity, availableVisualizations, URLParsingService))
			.filter((activity): activity is IActivity => activity !== undefined);
		const updatedVisualizations = await this._updateVisualizationAvailability(visualizations);
		return updatedVisualizations;
	}

	/**
	 * Returns promise that resolves to array of all available visualizations
	 * @private
	 * @returns {Promise} A Promise that resolves to array of all available visualizations.
	 */
	private async _getAllAvailableVisualizations() {
		if (!this._allAvailableVisualizations) {
			const catalogApps = await this.appManagerInstance._getCatalogApps();
			this._allAvailableVisualizations = catalogApps.reduce((visualizations: IVisualization[], catalogApp) => {
				return visualizations.concat(catalogApp.visualizations || []);
			}, []);
		}
		return this._allAvailableVisualizations;
	}

	/**
	 * Updates vizualization array with information - if vizualization is present in favorites .
	 * @private
	 * @param {object[]} visualizations - Array of vizualizations.
	 * @returns {object[]} - Array of updated vizualizations.
	 */
	private async _updateVisualizationAvailability(visualizations: IActivity[]) {
		const favoriteVisualizations: ICustomVisualization[] = await this.appManagerInstance.fetchFavVizs(true, true);
		visualizations.forEach((visualization) => {
			visualization.addedInFavorites = favoriteVisualizations.some(
				(favoriteVisualization) => favoriteVisualization.oldAppId === visualization.orgAppId
			);
		});
		return visualizations;
	}

	/**
	 * Updates user activity with provided vizualization info
	 * @private
	 * @param {object} activity - User activity.
	 * @param {object} updatedVizConfig - Updated vizualization config.
	 * @returns {object} - Updated user acitvity.
	 */
	private _updateActivityInfo(activity: IActivity, updatedVizConfig: IVisualization) {
		this._catalogVisualizationCache = this._catalogVisualizationCache || new Map<string, IVisualization>();
		activity.targetURL = updatedVizConfig.targetURL;
		activity.vizId = updatedVizConfig.vizId;
		this._catalogVisualizationCache.set(activity.orgAppId, updatedVizConfig);
		return activity;
	}

	/**
	 * Finds the best matching visualization for a given activity from a list of matching visualizations.
	 *
	 * This method first attempts to find an exact match for the target URL of the activity among the matching visualizations.
	 * If no exact match is found, it uses the URLParsingService to compare parameters of the target URLs to find the best match.
	 * It then updates the activity information with the best matching visualization.
	 *
	 * @private
	 * @param {IActivity} activity - The activity for which to find the best matching visualization.
	 * @param {IVisualization[]} matchingVisualizations - A list of visualizations that match the activity.
	 * @param {URLParsing} URLParsingService - A service used to parse and compare target URLs.
	 * @returns {IVisualization | undefined} The best matching visualization, or undefined if no match is found.
	 */
	private _findBestMatchingVisualization(activity: IActivity, matchingVisualizations: IVisualization[], URLParsingService: URLParsing) {
		//if there are multiple matching apps, compare the target urls
		const matchedVisualization = matchingVisualizations.find((matchingViz) => matchingViz.targetURL === activity.url);
		if (matchedVisualization) {
			return this._updateActivityInfo(activity, matchedVisualization);
		} else {
			//edge cases, when no exact targetUrl match
			const matchedVisualizationCache = new Map<string, object>();
			const matchedVisualizations: { viz: IVisualization; params: unknown; prio: number }[] = [];

			matchingVisualizations.forEach((visualization) => {
				const targetURL: string = visualization.targetURL;
				if (!matchedVisualizationCache.get(targetURL)) {
					const matchedVisualization = {
						viz: visualization,
						params: (URLParsingService.parseShellHash(visualization.targetURL) as { params: { [key: string]: unknown[] } })
							.params,
						prio: 0
					};
					matchedVisualizationCache.set(targetURL, matchedVisualization);
					matchedVisualizations.push(matchedVisualization);
				}
			});
			const filteredVisualizations = matchedVisualizations.filter((matchedVisualization) =>
				this._filterMatchingVisualization(activity, matchedVisualization, URLParsingService)
			);
			if (filteredVisualizations.length) {
				// more than 1 matching condition for unique targetUrls
				// this could be either because there is exact match and/or also allItems true and/or no params in VizData param keys
				// then find best match possible, based on prio
				filteredVisualizations.sort((val1, val2) => val1.prio - val2.prio);
				return this._updateActivityInfo(activity, filteredVisualizations[0].viz);
			}
		}
	}

	/**
	 * Filters matching visualizations based on activity parameters and assigns priority.
	 *
	 * This method compares the parameters of the activity with those of a matched visualization
	 * to determine if they match.
	 *
	 * @private
	 * @returns {boolean} Returns true if the visualization matches the activity, false otherwise.
	 */
	private _filterMatchingVisualization(
		activity: IActivity,
		matchedVisualization: { viz: IVisualization; params: unknown; prio: number },
		URLParsingService: URLParsing
	) {
		const parshedShellHash = URLParsingService.parseShellHash(activity.url) as { params: { [key: string]: unknown[] } };
		const activityParameters = parshedShellHash.params;

		const activityParameterKeys = Object.keys(activityParameters);
		const visualizationParams = matchedVisualization.params as { [key: string]: unknown[] };
		//filter keys other than 'allItems', for myinbox tasks allItems key is a generally common key hence filter that
		const visualizationParamKeys = Object.keys(visualizationParams).filter((key) => key !== "allItems");
		if (visualizationParamKeys.length === activityParameterKeys.length) {
			const bMatch = activityParameterKeys.every(
				(key) => visualizationParamKeys.includes(key) && visualizationParams[key][0] === activityParameters[key][0]
			);
			if (bMatch) {
				matchedVisualization.prio = 1;
				return true;
			}
			return false;
		} else if (!visualizationParamKeys.length) {
			//this could mean either visualizationParamKeys did not have any key or the only key present was 'allItems'
			//if 'allItems' present give prio 2 else prio 3
			matchedVisualization.prio = Object.keys(matchedVisualization.params as { [key: string]: unknown[] }).length ? 2 : 3;
			return true;
		}
		//filtered visualizationParamKeys length doesnt match aAppParamKeys length & visualizationParamKeys length is not 0
		return false;
	}

	/**
	 * Converts given user activity to vizualization
	 * @private
	 * @param {object} activity - User Activity.
	 * @param {object[]} catalogVisualizations - array of all available visualizations in catalog.
	 * @param {object} URLParsingService - URL parsing service.
	 * @returns {object} - visualization
	 */
	private _convertToVisualization(activity: IActivity, catalogVisualizations: IVisualization[], URLParsingService: URLParsing) {
		this._catalogVisualizationCache = this._catalogVisualizationCache || new Map<string, IVisualization>();
		const catalogVisualization = this._catalogVisualizationCache.get(activity.orgAppId);
		if (catalogVisualization) {
			return this._updateActivityInfo(activity, catalogVisualization);
		} else {
			const matchingVisualizations = catalogVisualizations.filter(
				(visualization) =>
					visualization.vizId && `#${visualization.target?.semanticObject}-${visualization.target?.action}` === activity.orgAppId
			);
			if (matchingVisualizations.length > 1) {
				return this._findBestMatchingVisualization(activity, matchingVisualizations, URLParsingService);
			} else if (matchingVisualizations.length === 1) {
				return this._updateActivityInfo(activity, matchingVisualizations[0]);
			}
		}
	}

	/**
	 * Adds visualization to favorite apps
	 * @private
	 * @param {sap.ui.base.Event} event - The event object.
	 */
	protected async _addAppToFavorites(event: Event) {
		this.setBusy(true);
		try {
			const source = event.getSource<MenuItem>();
			const app = source.getParent() as App;
			const vizId = app.getVizId?.();
			if (vizId) {
				//Add Apps to the 'Recently Added Apps' section
				await this.appManagerInstance.addVisualization(vizId);
				await (this.getParent?.() as AppsContainer)._refreshAllPanels();
				const message = this._i18nBundle.getText("appMovedToFavorites", [app.getTitle()]) as string;
				MessageToast.show(message);
			}
		} catch (error) {
			Log.error(error as string);
		} finally {
			this.setBusy(false);
		}
	}

	/**
	 * Checks if the panel is loaded. If the panel is not loaded then placholders are shown otherwise not
	 * @private
	 * @returns {boolean} true if the panel is loaded, false otherwise.
	 */
	public isLoaded(): boolean {
		return this._isLoaded;
	}

	/**
	 * Set the loaded status of the app panel.
	 * @private
	 * @param {boolean} val - The new loaded status to set for the app panel.
	 */
	public setLoaded(val: boolean): void {
		this._isLoaded = val;
	}

	/**
	 * Returns the dirty status of the app panel. If the panel is dirty then only re-render the apps
	 * @private
	 * @returns {boolean} true if the panel is dirty, false otherwise.
	 */
	public isDirty(): boolean {
		return this._isDirty;
	}

	/**
	 * Set the dirty status of the app panel.
	 * @private
	 * @param {boolean} val - The new dirty status to set for the app panel.
	 */
	public setDesktopViewDirty(val: boolean): void {
		this._isDirty = val;
	}

	/**
	 * Returns the dirty status of the app mobile panel. If the panel is dirty then only re-render the apps
	 * @private
	 * @returns {boolean} true if the panel is dirty, false otherwise.
	 */
	public isMobileDirty(): boolean {
		return this._isMobileDirty;
	}

	/**
	 * Set the dirty status of the app mobile panel.
	 * @private
	 * @param {boolean} val - The new dirty status to set for the app mobile panel.
	 */
	public setMobileViewDirty(val: boolean): void {
		this._isMobileDirty = val;
	}

	/**
	 * Sets aggregation for give control.
	 * @param {Object} control - Control for which aggregation has to be set.
	 * @param {Object[]} items - Items to be added in aggregation.
	 * @param {string} aggregationName - Aggregation name
	 * @private
	 */
	public _setAggregation = function (control: Control | Group, items: Control[] | App[] = [], aggregationName = "items") {
		items.forEach((oItem) => {
			control.addAggregation(aggregationName, oItem, true);
		});
	};

	/**
	 * Sets the busy state of panel.
	 * @private
	 * @param {boolean} isBusy - Indicates whether the panel should be set to busy state.
	 */
	protected setBusy(isBusy: boolean) {
		const oAppsWrapper = this._generateAppsWrapper();
		oAppsWrapper.setBusy(isBusy);
	}

	/**
	 * Retrieves the group with the specified group Id.
	 * @private
	 * @param {string} groupId - The Id of the group.
	 * @returns {sap.cux.home.Group} The group with the specified group Id, or null if not found.
	 */
	protected _getGroup(groupId: string) {
		const groups = (this.getAggregation("groups") || []) as Group[];
		return groups.find((group) => group.getGroupId() === groupId);
	}

	/**
	 * Checks if the panel is supported.
	 * @returns {boolean} True if the panel is supported, false otherwise.
	 * @private
	 */
	public isSupported() {
		return this._isSupported;
	}

	/**
	 * Sets panel as supported or unsupported.
	 * @param {boolean} isSupported true if the panel is supported, false otherwise.
	 * @private
	 */
	public setSupported(isSupported: boolean) {
		this._isSupported = isSupported;
	}

	/**
	 * Attaches user activity tracking based on the configuration.
	 * If user activity tracking is enabled, it listens to changes in tracking activity configuration
	 * and fires a 'supported' event accordingly.
	 * @private
	 */
	protected _attachUserActivityTracking() {
		if (Config.last("/core/shell/enableRecentActivity")) {
			Config.on("/core/shell/model/enableTrackingActivity").do((isTrackingActivityEnabled: boolean) => {
				this.fireSupported({ isSupported: isTrackingActivityEnabled });
			});
		}
	}

	/**
	 * Refreshes the panel.
	 * @public
	 */
	protected async refresh() {
		await (this.getParent() as AppsContainer).refreshPanel(this);
	}

	/**
	 * Generates default illustrated message for panel.
	 * @private
	 * @returns {sap.m.IllustratedMessage} Illustrated error message for panel.
	 */
	protected generateIllustratedMessage() {
		if (!this._errorMessage) {
			this._errorMessage = new IllustratedMessage(`${this.getId()}-errorMessage`, {
				illustrationSize: IllustratedMessageSize.Spot,
				illustrationType: IllustratedMessageType.AddColumn,
				title: this._i18nBundle.getText("noAppsTitle"),
				description: this._i18nBundle.getText("noData")
			});
		}
		return this._errorMessage;
	}
}
