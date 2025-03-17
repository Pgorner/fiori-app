/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import Log from "sap/base/Log";
import Card from "sap/f/Card";
import GridContainer from "sap/f/GridContainer";
import GridContainerSettings from "sap/f/GridContainerSettings";
import Button from "sap/m/Button";
import GenericTile from "sap/m/GenericTile";
import HeaderContainer from "sap/m/HeaderContainer";
import IllustratedMessage from "sap/m/IllustratedMessage";
import Text from "sap/m/Text";
import TileContent from "sap/m/TileContent";
import VBox from "sap/m/VBox";
import { LoadState, Priority, URLHelper } from "sap/m/library";
import Device from "sap/ui/Device";
import Control from "sap/ui/core/Control";
import type { MetadataOptions } from "sap/ui/core/Element";
import UI5Element from "sap/ui/core/Element";
import DateFormat from "sap/ui/core/format/DateFormat";
import Context from "sap/ui/model/Context";
import JSONModel from "sap/ui/model/json/JSONModel";
import BasePanel from "./BasePanel";
import MenuItem from "./MenuItem";
import { $ToDoPanelSettings } from "./ToDoPanel";
import ToDosContainer from "./ToDosContainer";
import BatchHelper from "./utils/BatchHelper";
import { DeviceType, fetchElementProperties } from "./utils/Device";
import { addFESRId } from "./utils/FESRUtil";

export interface IToDoPanel {
	generateCardTemplate(id: string, context: Context): Control;
	generateRequestUrls?(cardCount: number): string[];
	onDataReceived?(data: unknown[], options?: RequestOptions): Promise<void>;
	getNoDataText?(): string;
}

interface Request {
	baseURL: string;
	requestURLs: string[];
	success(args: unknown[]): Promise<void>;
}

export interface CalculationProperties {
	isPlaceholder?: boolean;
}

export interface Intent {
	target: {
		semanticObject: string;
		action: string;
	};
	params: {
		[key: string]: string;
	};
}

export interface RequestOptions {
	type: string;
	onlyCount?: boolean;
}

export interface Response {
	d?: {
		results?: unknown[];
	};
	results?: unknown[];
	value?: unknown[];
}

export enum TaskPriority {
	VERY_HIGH = "VERY_HIGH",
	HIGH = "HIGH",
	MEDIUM = "MEDIUM",
	LOW = "LOW"
}

const Constants = {
	SITUATION_ICON: "sap-icon://message-warning",
	PLACEHOLDER_ITEMS_COUNT: 5,
	TODO_CARDS_LIMIT: 100,
	TODO_SECTION_LIMIT: 6,
	TODOS_REFRESH_INTERVAL: 65000,
	MOBILE_DEVICE_MAX_WIDTH: 600,
	DEFAULT_TITLE_HEIGHT: 33,
	DEFAULT_CARD_HEIGHT: 168,
	DEFAULT_TAB_HEADER_HEIGHT: 44
};

/**
 * Calculates the card width based on the available width and certain constraints.
 *
 * @param {number} availableWidth - The available width for card rendering.
 * @returns {number} The calculated card width within specified constraints.
 */
function calculateCardWidth(availableWidth: number): number {
	const minWidth = 320;
	const maxWidth = 400;
	const gap = 14.5;
	let count = 1;
	let cardWidth = minWidth;

	while (availableWidth / count >= minWidth + gap) {
		cardWidth = availableWidth / count;
		count += 1;
	}

	return Math.min(cardWidth - gap, maxWidth);
}

/**
 *
 * Abstract Panel class for managing and storing To-Do cards.
 *
 * @extends BasePanel
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.121
 *
 * @abstract
 * @internal
 * @experimental Since 1.121
 * @public
 *
 * @alias sap.cux.home.ToDoPanel
 */
export default abstract class ToDoPanel extends BasePanel implements IToDoPanel {
	protected _oData!: Record<string, unknown>;
	protected requests!: Request[];
	private _controlModel!: JSONModel;
	private _toDoWrapper!: VBox;
	private _cardContainer!: GridContainer;
	private _mobileCardContainer!: HeaderContainer;
	private _errorCard!: Card;
	private _errorMessage!: IllustratedMessage;
	private _refreshBtn!: Button;
	private _loadToDos!: Promise<void> | undefined;
	private _innerControlsBound!: boolean;
	private _cardCount!: number;

	constructor(id?: string | $ToDoPanelSettings);
	constructor(id?: string, settings?: $ToDoPanelSettings);
	/**
	 * Constructor for a new To-Dos Panel.
	 *
	 * @param {string} [id] ID for the new control, generated automatically if an ID is not provided
	 * @param {object} [settings] Initial settings for the new control
	 */
	public constructor(id?: string, settings?: $ToDoPanelSettings) {
		super(id, settings);
	}

	static readonly metadata: MetadataOptions = {
		library: "sap.cux.home",
		properties: {
			/**
			 * Specifies the base URL for batching requests sent from the panel.
			 *
			 * @public
			 */
			baseUrl: { type: "string", group: "Misc", defaultValue: "", visibility: "public" },
			/**
			 * Specifies the URL for fetching the count of requested to-do cards.
			 *
			 * @public
			 */
			countUrl: { type: "string", group: "Misc", defaultValue: "", visibility: "public" },
			/**
			 * Specifies the URL from where the to-do cards should be fetched.
			 *
			 * @public
			 */
			dataUrl: { type: "string", group: "Misc", defaultValue: "", visibility: "public" },
			/**
			 * Specifies the URL of the target application associated with the to-do cards.
			 *
			 * @public
			 */
			targetAppUrl: { type: "string", group: "Misc", defaultValue: "", visibility: "public" }
		}
	};

	static relativeDateFormatter = DateFormat.getDateTimeInstance({
		style: "medium",
		relative: true,
		relativeStyle: "short"
	});

	/**
	 * Init lifecycle method
	 *
	 * @private
	 * @override
	 */
	public init(): void {
		super.init();

		//Initialise ToDos Model
		this._oData = {
			length: 0,
			isLoaded: false,
			hasError: false,
			cardWidth: "20rem",
			getSupported: false,
			isExpandedOnce: false,
			isCountCalledOnce: false,
			illustrationType: "sapIllus-NoTasks",
			refreshInfo: this._toRelativeDateTime(new Date()),
			horizontalCardCount: Constants.PLACEHOLDER_ITEMS_COUNT,
			illustrationTitle: this._i18nBundle.getText("noToDoTitle"),
			illustrationDescription: this._i18nBundle.getText("noToDoDesc"),
			isPhone: Device.resize.width < Constants.MOBILE_DEVICE_MAX_WIDTH || Device.system.phone,
			tiles: new Array(Constants.PLACEHOLDER_ITEMS_COUNT).fill({ status: "Loading" }),
			displayTiles: new Array(Constants.PLACEHOLDER_ITEMS_COUNT).fill({ status: "Loading" })
		};
		this._controlModel = new JSONModel(this._oData);

		//Initialize Request Queue
		this.requests = [];

		//Add Wrapper Container to Panel
		this._toDoWrapper = new VBox(`${this.getId()}-toDosWrapper`, {
			renderType: "Bare",
			items: [this._generateCardContainer(), this._generateMobileCardContainer(), this._generateErrorMessage()]
		});
		this._toDoWrapper.setModel(this._controlModel);
		this._addContent(this._toDoWrapper);

		//Setup Common Menu Items
		const menuItem = new MenuItem(`${this.getId()}-refresh`, {
			title: this._i18nBundle.getText("refresh"),
			icon: "sap-icon://refresh",
			press: () => this._onPressRefresh()
		});
		this.addAggregation("menuItems", menuItem);
		addFESRId(menuItem, "todosRefresh");

		//Setup Common Action Buttons
		this._refreshBtn = new Button(`${this.getId()}-refreshBtn`, {
			icon: "sap-icon://refresh",
			text: this._toRelativeDateTime(new Date()),
			press: () => this._onPressRefresh()
		});
		addFESRId(this._refreshBtn, "manualTodoRefresh");
		this.addAggregation("actionButtons", this._refreshBtn);

		//Configure Full Screen and Expand Event handlers
		this.setProperty("enableFullScreen", true);
		this.attachEvent("onExpand", async () => {
			await this._beforePanelExpand();
		});
	}

	/**
	 * Generates the card container (GridContainer) for displaying cards.
	 *
	 * @private
	 * @returns {GridContainer} The generated card container.
	 */
	private _generateCardContainer(): GridContainer {
		//create container
		if (!this._cardContainer) {
			this._cardContainer = new GridContainer(`${this.getId()}-flexContainer`, {
				inlineBlockLayout: true,
				snapToRow: true,
				visible: "{= !${/isPhone} && !${/hasError} && (!${/isLoaded} || ${/length} > 0) }",
				layout: new GridContainerSettings(`${this.getId()}-layout`, {
					columns: "{/horizontalCardCount}",
					columnSize: "{/cardWidth}",
					gap: "1rem"
				})
			}).addStyleClass("sapCuxToDoCardsContainer");
		}

		return this._cardContainer;
	}

	/**
	 * Generates the mobile card container (HeaderContainer) for displaying cards on mobile devices.
	 *
	 * @private
	 * @returns {HeaderContainer} The generated mobile card container.
	 */
	private _generateMobileCardContainer(): HeaderContainer {
		// Create a HeaderContainer for mobile devices
		if (!this._mobileCardContainer) {
			this._mobileCardContainer = new HeaderContainer(`${this.getId()}-headerContainer`, {
				visible: "{/isPhone}",
				scrollStep: 0,
				gridLayout: true,
				scrollTime: 1000,
				showDividers: false
			});

			this._mobileCardContainer.addStyleClass("sapMHeaderContainerAlign sapMHeaderContainerToDoAlign toDoCardHeight");
		}

		return this._mobileCardContainer;
	}

	/**
	 * Generates the error message card for displaying error messages.
	 *
	 * @private
	 * @returns {Card} The generated error message card.
	 */
	private _generateErrorMessage(): Card {
		if (!this._errorCard) {
			this._errorMessage = new IllustratedMessage(`${this.getId()}-errorMessage`, {
				illustrationSize: "Base",
				title: "{/illustrationTitle}",
				description: "{/illustrationDescription}",
				illustrationType: "{/illustrationType}"
			});
			this._errorCard = new Card(`${this.getId()}-errorCard`, {
				content: this._errorMessage,
				visible: "{= ${/tiles/length} === 0 || ${/hasError} === true }"
			});
		}

		return this._errorCard;
	}

	/**
	 * Handler for the Refresh button for each panel.
	 * Reloads the selected panel
	 *
	 * @async
	 * @private
	 */
	private _onPressRefresh(): void {
		void ((this.getParent() as ToDosContainer)?._getSelectedPanel() as ToDoPanel)?._loadCards(true);
	}

	/**
	 * Loads the To-Do cards for the panel.
	 *
	 * @private
	 * @param {boolean} forceRefresh - force refresh cards
	 * @returns {Promise<void>} A promise that resolves when the cards are loaded.
	 */
	public async _loadCards(forceRefresh?: boolean): Promise<void> {
		if (this._loadToDos !== undefined && !forceRefresh) {
			return this._loadToDos;
		} else {
			this._bindInnerControls();
			this._loadToDos = new Promise((resolve) => {
				const selectedKey = this.getParent()?.getProperty("selectedKey") as string;
				const requests: Request[] = [];

				this._oData.isLoaded = false;
				this._oData.isCountCalledOnce = false;
				this._oData.isExpandedOnce = this._isElementExpanded();
				this._setCount();

				if (this._getSupported()) {
					setTimeout(() => {
						// Load Placeholder Cards
						this._generatePlaceHolderTiles();

						// Add Initial Batch Requests
						requests.push(
							this._generateRequestObject({ type: selectedKey, onlyCount: selectedKey !== this.getProperty("key") })
						);
						this.requests = this.requests.concat(requests);

						//Submit Batch Requests
						this._submitBatch()
							.then(async () => {
								this._oData.isLoaded = selectedKey === this.getProperty("key");
								this._oData.isCountCalledOnce = true;
								this._setCount(this._oData.length as string);
								this._setSectionRefreshInterval();
								this._oData.refreshInfo = this._toRelativeDateTime(new Date());
								this._oData.lastRefreshedTime = new Date();
								this._updateRefreshInformation();
								await this._switchTabIfRequired();
								this._updateHeaderIfExclusive();
							})
							.catch((error: unknown) => {
								Log.error(error instanceof Error ? error.message : "");
							})
							.finally(() => {
								this._controlModel.refresh();
								this._adjustLayout();
								resolve();
							});
					});
				} else {
					this._handleError(`User not authorized to access: + ${this.getTargetAppUrl()}`);

					// Remove Item from IconTabBar
					(this.getParent() as ToDosContainer)?.removeContent(this);

					//resolve the promise
					resolve();
				}
			});
		}

		return this._loadToDos;
	}

	/**
	 * Update Container Header if the panel is exclusive
	 *
	 * @private
	 */
	private _updateHeaderIfExclusive() {
		if (this._isExclusivePanel()) {
			(this.getParent() as ToDosContainer)._setTitle(`${this._i18nBundle.getText("toDosTitle")} (${String(this._oData.length)})`);
		}
	}

	/**
	 * Creates a one-time binding of inner controls for the ToDoPanel.
	 * @private
	 */
	private _bindInnerControls(): void {
		if (!this._innerControlsBound) {
			//bind card container
			this._cardContainer.bindAggregation("items", {
				path: "/displayTiles",
				length: Constants.TODO_CARDS_LIMIT,
				factory: (id, context) => this.generateCardTemplate(id, context)?.bindProperty?.("width", { path: "/cardWidth" })
			});

			//bind mobile card container
			this._mobileCardContainer.bindAggregation("content", {
				path: "/displayTiles",
				length: Constants.TODO_CARDS_LIMIT,
				factory: this.generateCardTemplate.bind(this)
			});

			this._innerControlsBound = true;
		}
	}

	/**
	 * Generate a default card template for the Current Panel.
	 * An extended panel can have it's own template by overridding
	 * this method and providing a custom card template.
	 *
	 * @public
	 * @param {string} id The ID for the template.
	 * @param {object} context The context for the template.
	 * @returns {object} The generated card template.
	 */
	public generateCardTemplate(id: string, context: Context): Control {
		return new GenericTile(`${id}-tile`, {
			mode: "ActionMode",
			frameType: "TwoByOne",
			pressEnabled: true,
			header: context.getProperty("title") as string,
			width: context.getProperty("/cardWidth") as string,
			state: context.getProperty("status") as LoadState,
			tileContent: [
				new TileContent(`${id}-tileContent`, {
					priority: context.getProperty("priority") as Priority,
					priorityText: this._toPriorityText(context.getProperty("priority") as Priority),
					footer: context.getProperty("footerText") as string,
					content: new Text(`${id}-situationContent`, {
						text: context.getProperty("message") as string
					})
				})
			]
		});
	}

	/**
	 * Convert a priority string to a corresponding priority value.
	 *
	 * @private
	 * @param {TaskPriority} priority - The task priority string.
	 * @returns {string} The corresponding priority value.
	 */
	public _toPriority(priority: TaskPriority): Priority {
		if (priority === TaskPriority.VERY_HIGH) {
			return Priority.VeryHigh ? Priority.VeryHigh : Priority.None;
		} else if (priority === TaskPriority.HIGH) {
			return Priority.High;
		} else if (priority === TaskPriority.MEDIUM) {
			return Priority.Medium;
		} else if (priority === TaskPriority.LOW) {
			return Priority.Low;
		} else {
			return Priority.None;
		}
	}

	/**
	 * Convert a priority string to a corresponding priority text.
	 *
	 * @private
	 * @param {Priority} priority - The priority string.
	 * @returns {string} The corresponding priority text.
	 */
	public _toPriorityText(priority: Priority): string {
		let key;
		if (priority === Priority.VeryHigh) {
			key = "veryHighPriority";
		} else if (priority === Priority.High) {
			key = "highPriority";
		} else if (priority === Priority.Medium) {
			key = "mediumPriority";
		} else if (priority === Priority.Low) {
			key = "lowPriority";
		} else {
			key = "nonePriority";
		}

		return this._i18nBundle.getText(key) as string;
	}

	/**
	 * Generates placeholder tiles for the panel.
	 *
	 * @private
	 */
	private _generatePlaceHolderTiles(): void {
		this._cardCount = this._getVisibleCardCount({ isPlaceholder: true });
		this._oData.displayTiles = this._oData.tiles = new Array(this._cardCount).fill({ status: "Loading" });
		this._oData.isLoaded = this._oData.hasError = false;
		this._controlModel.refresh();
	}

	/**
	 * Calculates the number of visible cards that can fit within the available space of the To-Dos panel.
	 *
	 * @private
	 * @param {CalculationProperties} [calculationProperties] - Optional properties to assist in the calculation.
	 * @returns {number} - The number of visible cards.
	 */
	private _getVisibleCardCount(calculationProperties?: CalculationProperties): number {
		const layout = (this.getParent() as ToDosContainer)?._getLayout();
		let isElementExpanded = false;
		let targetDomRef = this._toDoWrapper?.getDomRef();

		if (layout) {
			isElementExpanded = this._isElementExpanded();
			const containerDomRef = (isElementExpanded ? layout._getFullScreenContainer() : layout).getDomRef();
			targetDomRef = containerDomRef?.childNodes[0] as Element;
		}

		const isMobileDevice = this._controlModel.getProperty("/isPhone") as boolean;
		let cardCount = isMobileDevice ? Constants.TODO_SECTION_LIMIT : 1;

		if (targetDomRef && !isMobileDevice) {
			// @ts-expect-error Calculate Horizontal Card Count
			cardCount = this.getHorizontalCardCount(targetDomRef, calculationProperties);

			if (isElementExpanded) {
				// @ts-expect-error Calculate Vertical Card Count
				cardCount *= this.getVerticalCardCount(targetDomRef, calculationProperties);
			}

			//Restrict cards to the maximum limit
			cardCount = cardCount > Constants.TODO_CARDS_LIMIT ? Constants.TODO_CARDS_LIMIT : cardCount;
		}

		return cardCount;
	}

	/**
	 * Checks if the current element is expanded to full screen.
	 *
	 * @private
	 * @returns {boolean} - True if the element is expanded, otherwise false.
	 */
	private _isElementExpanded(): boolean {
		const toDosContainer = this.getParent() as ToDosContainer;
		const layout = toDosContainer._getLayout();
		return layout?._getCurrentExpandedElementName() === toDosContainer.getProperty("fullScreenName");
	}

	/**
	 * Calculates the number of horizontal cards that can fit within the available width of the given DOM element.
	 *
	 * @private
	 * @param {Element} domRef - The DOM element to calculate the horizontal card count for.
	 * @returns {number} - The number of horizontal cards that can fit within the available width.
	 */
	protected getHorizontalCardCount(domRef: Element): number {
		const domProperties = fetchElementProperties(domRef, ["width", "padding-left", "padding-right", "margin-left", "margin-right"]);
		const availableWidth = Object.values(domProperties)
			.slice(1)
			.reduce((width, propertyValue) => width - propertyValue, domProperties["width"]);
		const cardWidth = calculateCardWidth(availableWidth);

		// Calculate Horizontal Card Count
		let horizontalCardCount = Math.max(Math.floor(availableWidth / cardWidth), 1);
		this._controlModel.setProperty("/cardWidth", `${cardWidth / 16}rem`);
		this._controlModel.setProperty("/horizontalCardCount", horizontalCardCount);

		return horizontalCardCount;
	}

	/**
	 * Calculates the number of vertical cards that can fit within the available height of the given DOM element.
	 *
	 * @private
	 * @param {Element} domRef - The DOM element to calculate the vertical card count for.
	 * @returns {number} - The number of vertical cards that can fit within the available height.
	 */
	protected getVerticalCardCount(domRef: Element): number {
		const domProperties = fetchElementProperties(domRef, ["height", "padding-top"]);
		const titleHeight = this.calculateTitleHeight();
		const availableHeight = domProperties.height - domProperties["padding-top"] * 2 - titleHeight;
		const margin = 14;
		const cardHeight = Constants.DEFAULT_CARD_HEIGHT + margin;
		const verticalCardCount = Math.max(Math.floor(availableHeight / cardHeight), 2); //minimum of 2 rows should be displayed

		return verticalCardCount;
	}

	/**
	 * Calculates the combined height of the title and tab header for the To-Dos panel.
	 *
	 * @private
	 * @returns {number} - The combined height of the title and tab header.
	 */
	protected calculateTitleHeight(): number {
		const container = this.getParent() as ToDosContainer;
		const containerHeaderRef = UI5Element.getElementById(`${container.getId()}-header`)?.getDomRef();
		const iconTabBarHeaderRef = UI5Element.getElementById(`${container._getInnerControl().getId()}--header`)?.getDomRef();
		const defaultHeight = Constants.DEFAULT_TITLE_HEIGHT + Constants.DEFAULT_TAB_HEADER_HEIGHT;
		let titleHeight = 0;

		if (containerHeaderRef && iconTabBarHeaderRef) {
			titleHeight = containerHeaderRef.clientHeight + iconTabBarHeaderRef.clientHeight;
		}

		return Math.max(titleHeight, defaultHeight);
	}

	/**
	 * Generates a request object for batch requests.
	 *
	 * @private
	 * @param {RequestOptions} options - Additional properties for generating the request object.
	 * @param {boolean} [options.onlyCount] - Whether to include only the count in the request.
	 * @returns {Object} The generated request object.
	 */
	private _generateRequestObject(options: RequestOptions): Request {
		const cardCount = this._getVisibleCardCount();
		const urls = this.generateRequestUrls?.(cardCount);

		if (options?.onlyCount) {
			urls.splice(1);
		}

		return {
			baseURL: this.getBaseUrl(),
			requestURLs: urls,
			success: async (args: unknown[]): Promise<void> => {
				//data process extension for panels
				await this.onDataReceived(args.splice(1), options);

				//set card count and handle empty cards
				this._oData.length = Number(args[0]);
				this._handleEmptyCards();
			}
		};
	}

	/**
	 * Generates request URLs for fetching data based on the specified card count.
	 *
	 * @private
	 * @param {number} cardCount - The number of cards to retrieve.
	 * @returns {string[]} An array of request URLs.
	 */
	public generateRequestUrls(cardCount: number): string[] {
		const queryString = `$skip=0&$top=${cardCount}`;
		let dataUrl = this.getDataUrl();
		dataUrl = dataUrl.includes("?") ? `${dataUrl}&${queryString}` : `${dataUrl}?${queryString}`;

		return [this.getCountUrl(), dataUrl];
	}

	/**
	 * Hook for processing data fetched from a batch call.
	 * This method can be overridden to perform additional data processing operations.
	 *
	 * @private
	 * @async
	 * @param {unknown[]} results - Data retrieved from the batch call.
	 * @param {RequestOptions} options - Additional options for parsing the data.
	 * Structure may vary based on the backend service.
	 */
	public async onDataReceived(results: unknown[] = [], options?: RequestOptions): Promise<void> {
		if (!options || (options && !options.onlyCount)) {
			this._oData.displayTiles = this._oData.tiles = results[0] || [];
		}

		await Promise.resolve();
	}

	/**
	 * Handles the scenario when there are no cards to display.
	 * Updates the illustration and description based on the selected panel and card count.
	 *
	 * @private
	 */
	private _handleEmptyCards() {
		if (Number(this._oData.length) === 0) {
			this._oData.illustrationType = "sapIllus-EmptyPlanningCalendar";
			this._oData.illustrationTitle = this._isExclusivePanel()
				? this._i18nBundle.getText("noToDoTitle")
				: this._i18nBundle.getText(this.getNoDataText());
			this._oData.illustrationDescription = this._isExclusivePanel()
				? this._i18nBundle.getText("noToDoDesc")
				: this._i18nBundle.getText("emptyToDoDesc");
		}
	}

	/**
	 * Checks if the panel is exclusive based on support and the number of panels.
	 *
	 * @private
	 * @returns {boolean} True if the panel is exclusive, otherwise false.
	 */
	private _isExclusivePanel(): boolean {
		const allPanels = (this.getParent() as ToDosContainer).getContent() as ToDoPanel[];
		const supportedPanels = allPanels.filter((panel) => panel._getSupported());

		return supportedPanels.length === 1 || (allPanels.length === 1 && this._getSupported());
	}

	/**
	 * Sets the interval for refreshing the section.
	 *
	 * @private
	 */
	private _setSectionRefreshInterval(): void {
		clearInterval(this._oData.refreshFn as number);
		this._oData.refreshFn = setInterval(() => {
			this._oData.lastRefreshedTime = this._oData.lastRefreshedTime || new Date();
			this._oData.refreshInfo = this._toRelativeDateTime(this._oData.lastRefreshedTime as Date);
			this._updateRefreshInformation();
		}, Constants.TODOS_REFRESH_INTERVAL);
	}

	/**
	 * Updates the refresh information and adjusts the layout.
	 *
	 * @private
	 */
	public _updateRefreshInformation(): void {
		const container = this.getParent() as ToDosContainer;
		if (container.getProperty("selectedKey") === this.getProperty("key")) {
			this._refreshBtn.setProperty("text", this._oData.refreshInfo, true);
			container._updateContainerHeader(this);
		}

		this._adjustLayout();
	}

	/**
	 * Adjusts the layout based on card count and device type.
	 *
	 * @private
	 */
	public _adjustLayout() {
		// Update visible cards
		const cardCount = this._getVisibleCardCount();
		if ((this._oData.tiles as object[]).length && !this._oData.hasError) {
			const displayCards = (this._oData.tiles as object[]).slice(0, cardCount);
			this._controlModel.setProperty("/displayTiles", displayCards);
		}

		// Update if device type is phone
		this._controlModel.setProperty("/isPhone", this.getDeviceType() === DeviceType.Mobile);

		// Show/Hide Full Screen Button if available
		(this.getParent() as ToDosContainer)?.toggleFullScreenElements(
			this,
			Number(this._oData.length) > cardCount,
			this._isElementExpanded()
		);
	}

	/**
	 * Formats the given date to a relative date.
	 *
	 * @private
	 * @param {Date} date Date object or Date String
	 * @returns {string} Formatted Date
	 */
	public _toRelativeDateTime(date: Date): string {
		const inputDate = new Date(date);
		return isNaN(Number(inputDate)) ? "" : ToDoPanel.relativeDateFormatter.format(inputDate);
	}

	/**
	 * Get the text for the "No Data" message.
	 *
	 * @private
	 * @returns {string} The text for the "No Data" message.
	 */
	public getNoDataText(): string {
		return this._i18nBundle.getText("noData") as string;
	}

	/**
	 * Parses the response object and returns the appropriate value.
	 *
	 * @private
	 * @param {Object} response - The response object.
	 * @param {Object} [response.d] - The 'd' property of the response object.
	 * @param {Array} [response.d.results] - The results array.
	 * @param {string|number} [response.d] - The 'd' property of the response object which may contain a numeric value.
	 * @param {string|number} [response] - The response object which may contain a numeric value.
	 * @param {string|number} [response.value] - The 'value' property of the response object which may contain a numeric value.
	 * @returns {Response} - The parsed value extracted from the response object.
	 */
	private _parseResponse(response: Response): Response {
		const { d = {}, value } = response || {};
		const results = d?.results;
		const numericD = !isNaN(+d) && +d;
		const numericResponse = !isNaN(+response) && +response;

		return (results || numericD || numericResponse || value || 0) as Response;
	}

	/**
	 * Submits a batch request for multiple URLs and processes the responses.
	 *
	 * @private
	 * @returns {Promise} A Promise that resolves when all batch requests are completed.
	 */
	protected _submitBatch(): Promise<unknown[]> {
		return Promise.all(
			this.requests.map(async (request: Request) => {
				try {
					const responses = await BatchHelper.createMultipartRequest(request.baseURL, request.requestURLs);

					if (responses.length) {
						const processedResponses = responses.map((response: string | Response) => {
							if (typeof response === "string") {
								response = JSON.parse(response) as Response;
							}
							return this._parseResponse(response);
						});

						// Call success callback, if any
						if (request.success && typeof request.success === "function") {
							await request.success(processedResponses);
						}

						return processedResponses;
					} else {
						throw new Error("Invalid response");
					}
				} catch (error: unknown) {
					this._handleError(error);
				} finally {
					this._clearRequests();
				}
			})
		);
	}

	/**
	 * Handles errors by updating the data and logging the error.
	 *
	 * @private
	 * @param {Error} error - The error object to handle.
	 */
	private _handleError(error: unknown) {
		this._oData.displayTiles = this._oData.tiles = [];
		this._oData.getSupported = this._oData.isLoaded = this._oData.hasError = true;
		this._oData.illustrationType = "sapIllus-UnableToLoad";
		this._oData.illustrationTitle = this._oData.illustrationDescription = "";

		Log.error(error as string);
		this._controlModel.refresh();
	}

	/**
	 * Clears the list of requests.
	 *
	 * @private
	 */
	protected _clearRequests() {
		this.requests = [];
	}

	/**
	 * Checks if the panel is loaded.
	 *
	 * @private
	 * @returns {boolean} true if the panel is loaded, false otherwise.
	 */
	public _isLoaded(): boolean {
		return this._oData.isLoaded as boolean;
	}

	/**
	 * Set the loaded status of the ToDoPanel.
	 *
	 * @private
	 * @param {boolean} isLoaded - The new loaded status to set for the ToDoPanel.
	 */
	public _setLoaded(isLoaded: boolean): void {
		this._oData.isLoaded = isLoaded;
	}

	/**
	 * Gets the supported status of the panel.
	 *
	 * @private
	 * @returns {boolean} The supported status of the panel.
	 */
	public _getSupported(): boolean {
		return this._oData.getSupported as boolean;
	}

	/**
	 * Sets the supported status of the panel.
	 *
	 * @private
	 * @param {boolean} value - The value to set for supported status.
	 */
	public _setSupported(isSupported: boolean): void {
		this._oData.getSupported = isSupported;
	}

	/**
	 * Extracts the app intent from the target app URL.
	 *
	 * @private
	 * @returns {Intent | null} The app intent object with target and parameters, or null if not found.
	 */
	public _getAppIntent(): Intent | null {
		const pattern = /#([^?-]+)-([^?#]+)(?:\?([^#]+))?(?:#.*)?/;
		const match = this.getTargetAppUrl().match(pattern);

		if (match) {
			const target = {
				semanticObject: match[1],
				action: match[2]
			};
			const params = {} as Record<string, string>;

			if (match[3]) {
				const paramsArray = match[3].split("&");
				for (const param of paramsArray) {
					const [key, value] = param.split("=");
					params[key] = value;
				}
			}

			return {
				target,
				params
			};
		} else {
			return null;
		}
	}

	/**
	 * Switch to available tab if current panel has empty cards or has error
	 *
	 * @private
	 * @async
	 */
	private async _switchTabIfRequired() {
		const container = this.getParent() as ToDosContainer;
		const selectedKey = container?.getProperty("selectedKey") as string;

		if (selectedKey === this.getProperty("key") && (this._oData.length === 0 || this._oData.hasError)) {
			let nextAvailablePanel;
			const panels = container?.getAggregation("content") as ToDoPanel[];

			for (const panel of panels) {
				if (panel !== this) {
					//ensure that panel is loaded first
					await panel._loadCards();

					if (panel._getSupported() && !panel._isLoaded() && panel._getCardCount() > 0) {
						nextAvailablePanel = panel;
						break;
					}
				}
			}

			if (nextAvailablePanel) {
				container?.setProperty("selectedKey", nextAvailablePanel.getProperty("key"));
				ToDosContainer.cardCount = this._cardCount;
				await nextAvailablePanel._loadCards(true);
				ToDosContainer.cardCount = undefined;
			}
		}
	}

	/**
	 * Handles the press event to view all items.
	 *
	 * @private
	 */
	public _onPressViewAll() {
		URLHelper.redirect(this.getTargetAppUrl(), false);
	}

	/**
	 * Retrieves the count of cards in the panel.
	 *
	 * @private
	 * @returns {number} The number of cards.
	 */
	public _getCardCount(): number {
		return Number(this._oData.length);
	}

	/**
	 * Handles actions to be performed before the To-Dos panel is expanded.
	 * If the panel has not been expanded before in full screen, the cards will be loaded once.
	 *
	 * @private
	 */
	private async _beforePanelExpand() {
		if (!this._oData.isExpandedOnce) {
			this._oData.isExpandedOnce = true;
			await this._loadCards(true);
		}
	}
}
