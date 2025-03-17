/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import Log from "sap/base/Log";
import Formatting from "sap/base/i18n/Formatting";
import ActionTile from "sap/m/ActionTile";
import ActionTileContent, { ActionTileContent$LinkPressEvent } from "sap/m/ActionTileContent";
import Button from "sap/m/Button";
import ContentConfig from "sap/m/ContentConfig";
import Link from "sap/m/Link";
import List from "sap/m/List";
import MessageBox from "sap/m/MessageBox";
import Popover from "sap/m/Popover";
import StandardListItem from "sap/m/StandardListItem";
import TileAttribute from "sap/m/TileAttribute";
import { ButtonType, ContentConfigType, LoadState, PlacementType, URLHelper } from "sap/m/library";
import ServiceContainer from "sap/suite/ui/commons/collaboration/ServiceContainer";
import Event from "sap/ui/base/Event";
import Control from "sap/ui/core/Control";
import { MetadataOptions } from "sap/ui/core/Element";
import Locale from "sap/ui/core/Locale";
import DateFormat from "sap/ui/core/format/DateFormat";
import NumberFormat from "sap/ui/core/format/NumberFormat";
import Context from "sap/ui/model/Context";
import MenuItem from "./MenuItem";
import { $TaskPanelSettings } from "./TaskPanel";
import ToDoPanel, { CalculationProperties, IToDoPanel, RequestOptions, Response, TaskPriority } from "./ToDoPanel";
import DecisionDialog, { ActionButton, DecisionOption, getIconFrameBadge, getIconFrameBadgeValueState } from "./utils/DecisionDialog";
import { fetchElementProperties } from "./utils/Device";
import { addFESRId, addFESRSemanticStepName, FESR_EVENTS } from "./utils/FESRUtil";

interface CustomAttribute {
	name?: string;
	label?: string;
	text?: string;
	type?: string;
	href?: string;
	format?: string;
	reference?: string;
	referenced?: string;
	textArrangement?: TextArrangement;
}

interface TaskCustomAttribute {
	Name: string;
	Value: string;
	ValueText: string;
	Label: string;
	Type: string;
	Rank: number;
	Format: string;
	FormattedValue: string;
	Reference: string;
	Referenced: string;
	TextArrangement: TextArrangement;
}

export interface Task {
	SAP__Origin: string;
	CreatedBy: string;
	TaskTitle: string;
	CreatedByName: string;
	InstanceID: string;
	TaskDefinitionID: string;
	CompletionDeadline: string;
	CreatedOn: string;
	actions: ActionButton[];
	Priority: TaskPriority;
	CustomAttributeData: {
		results: TaskCustomAttribute[];
	};
	attributes: CustomAttribute[];
}

interface TaskDefintion {
	SAP__Origin: string;
	InstanceID: string;
	TaskDefinitionID: string;
}

interface TaskDefinitionCollection {
	TaskDefinitionID: string;
	CustomAttributeDefinitionData: {
		results: TaskCustomAttribute[];
	};
}

interface UserInfo {
	Email?: string;
}

enum Format {
	CURRENCYVALUE = "CURRENCYVALUE",
	CURRENCYCODE = "CURRENCYCODE",
	USER = "USER"
}

enum TextArrangement {
	TextFirst = "TextFirst",
	TextLast = "TextLast",
	TextOnly = "TextOnly",
	TextSeparate = "TextSeparate"
}

const Constants = {
	CARD_HEIGHT: {
		// Cozy - Compact
		1: 220, // 214  - 226
		2: 272, // 265  - 278
		3: 324, // 318  - 330
		4: 376 // 370  - 382
	}
};

/**
 * Splits an array of task cards into smaller arrays, each with a maximum specified length.
 *
 * @param {Task[]} cards - The array of task cards to be split.
 * @param {number} maxLength - The maximum length of each sub-array.
 * @returns {Task[][]} - An array of sub-arrays, each containing a maximum of `maxLength` task cards.
 */
function splitCards(cards: Task[], maxLength: number): Task[][] {
	const cardSet = [];
	for (let i = 0; i < cards.length; i += maxLength) {
		cardSet.push(cards.slice(i, i + maxLength));
	}

	return cardSet;
}

/**
 *
 * Panel class for managing and storing Task cards.
 *
 * @extends ToDoPanel
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.121
 *
 * @internal
 * @experimental Since 1.121
 * @public
 *
 * @alias sap.cux.home.TaskPanel
 */
export default class TaskPanel extends ToDoPanel implements IToDoPanel {
	private _customAttributeMap!: Record<string, CustomAttribute[]>;
	private userInfo!: Record<string, UserInfo>;
	private _disableNavigation!: boolean;
	private _taskDefinitionMap!: Record<string, DecisionOption[]>;
	private _overflowPopover!: Popover;
	private _overflowList!: List;

	constructor(id?: string | $TaskPanelSettings);
	constructor(id?: string, settings?: $TaskPanelSettings);
	/**
	 * Constructor for a new Task Panel.
	 *
	 * @param {string} [id] ID for the new control, generated automatically if an ID is not provided
	 * @param {object} [settings] Initial settings for the new control
	 */
	public constructor(id?: string, settings?: $TaskPanelSettings) {
		super(id, settings);
	}

	static readonly metadata: MetadataOptions = {
		library: "sap.cux.home",
		properties: {
			/**
			 * Specifies if actions should be enabled for the task cards.
			 *
			 * @public
			 */
			enableActions: { type: "boolean", group: "Data", defaultValue: false, visibility: "public" },
			/**
			 * Specifies the URL that fetches the custom attributes to be displayed along with the task cards.
			 *
			 * @public
			 */
			customAttributeUrl: { type: "string", group: "Data", defaultValue: "", visibility: "public" }
		}
	};

	/**
	 * Init lifecycle method
	 *
	 * @private
	 * @override
	 */
	public init(): void {
		super.init();
		this._customAttributeMap = {};
		this._taskDefinitionMap = {};

		//Configure Header
		this.setProperty("key", "tasks");
		this.setProperty("title", this._i18nBundle.getText("tasksTabTitle"));

		//Setup Menu Items - ensure that 'View All Tasks' item is the first item in the list
		const menuItem = new MenuItem(`${this.getId()}-view-tasks-btn`, {
			title: this._i18nBundle.getText("viewAllTasksTitle"),
			icon: "sap-icon://inbox",
			press: this._onPressViewAll.bind(this)
		});
		this.insertAggregation("menuItems", menuItem, 0);
		addFESRId(menuItem, "goToTaskSitution");
	}

	/**
	 * Generates request URLs for fetching data based on the specified card count.
	 * Overridden method to provide task-specific URLs.
	 *
	 * @private
	 * @override
	 * @param {number} cardCount - The number of cards to retrieve.
	 * @returns {string[]} An array of request URLs.
	 */
	public generateRequestUrls(cardCount: number): string[] {
		const urls = [this.getCountUrl(), `${this.getDataUrl()},CustomAttributeData&$expand=CustomAttributeData&$skip=0&$top=${cardCount}`];

		const customAttributeUrl = this.getCustomAttributeUrl();
		if (customAttributeUrl) {
			urls.push(customAttributeUrl);
		}

		return urls;
	}

	/**
	 * Generates a card template for tasks.
	 * Overridden method from To-Do panel to generate task-specific card template.
	 *
	 * @private
	 * @override
	 * @param {string} id The ID for the template card.
	 * @param {Context} context The context object.
	 * @returns {Control} The generated card control template.
	 */
	public generateCardTemplate(id: string, context: Context): Control {
		const attributes = (context.getObject() as Task).attributes?.map((attribute, index) => {
			return new TileAttribute(`${id}-${index}-attribute`, {
				label: attribute.label as string,
				contentConfig: new ContentConfig(`${id}-${index}-contentConfig`, {
					type: attribute.type as ContentConfigType,
					text: attribute.text as string,
					href: attribute.href as string
				})
			});
		});

		return new ActionTile(`${id}-actionTile`, {
			mode: "ActionMode",
			frameType: "TwoByOne",
			pressEnabled: true,
			enableIconFrame: true,
			enableDynamicHeight: true,
			enableNavigationButton: true,
			headerImage: "sap-icon://workflow-tasks",
			badgeIcon: getIconFrameBadge(context.getProperty("Priority") as TaskPriority),
			badgeValueState: getIconFrameBadgeValueState(context.getProperty("Priority") as TaskPriority),
			header: context.getProperty("TaskTitle") as string,
			state: context.getProperty("status") as LoadState,
			priority: this._toPriority(context.getProperty("Priority") as TaskPriority),
			priorityText: this._toPriorityText(this._toPriority(context.getProperty("Priority") as TaskPriority)),
			press: (event: Event) => this._onPressTask(event),
			tileContent: [
				new ActionTileContent(`${id}-actionTileContent`, {
					headerLink: (() => {
						const createdByLink = new Link({
							text: context.getProperty("CreatedByName") as string,
							press: (event: Event): void => {
								void this._onClickCreatedBy(event);
							}
						});
						addFESRSemanticStepName(createdByLink, FESR_EVENTS.PRESS, "MST:ContactDetails");
						return createdByLink;
					})(),
					attributes
				})
			],
			actionButtons: [
				(() => {
					const viewButton = new Button(`${id}-view-btn`, {
						text: this._i18nBundle.getText("viewButton"),
						press: (event: Event) => (event.getSource<Button>().getParent() as ActionTile).firePress(),
						visible: context.getProperty("actions/length") === 0
					});
					addFESRSemanticStepName(viewButton, FESR_EVENTS.PRESS, "todoActionBtn");
					return viewButton;
				})(),
				(() => {
					const approveButton = new Button(`${id}-approve-btn`, {
						text: context.getProperty("actions/0/text") as string,
						type: context.getProperty("actions/0/type") as ButtonType,
						press: () => this._onActionButtonPress(context.getProperty("actions/0/pressHandler") as () => void),
						visible: context.getProperty("actions/0") !== undefined
					}).addStyleClass("sapUiTinyMarginEnd");
					addFESRSemanticStepName(approveButton, FESR_EVENTS.PRESS, "todoActionBtn");
					return approveButton;
				})(),
				(() => {
					const rejectButton = new Button(`${id}-reject-btn`, {
						text: context.getProperty("actions/1/text") as string,
						type: context.getProperty("actions/1/type") as ButtonType,
						press: () => this._onActionButtonPress(context.getProperty("actions/1/pressHandler") as () => void),
						visible: context.getProperty("actions/1") !== undefined
					}).addStyleClass("sapUiTinyMarginEnd");
					addFESRSemanticStepName(rejectButton, FESR_EVENTS.PRESS, "todoActionBtn");
					return rejectButton;
				})(),
				(() => {
					const overflowButton = new Button(`${id}-overflow-btn`, {
						icon: "sap-icon://overflow",
						type: ButtonType.Transparent,
						press: (event: Event) => this._onOverflowButtonPress(event, context),
						visible: context.getProperty("actions/length") >= 3
					});
					addFESRSemanticStepName(overflowButton, FESR_EVENTS.PRESS, "todoActBtnOverflow");
					return overflowButton;
				})()
			]
		});
	}

	/**
	 * Handles the press event of the overflow button.
	 * Opens a Popover containing overflow actions.
	 *
	 * @private
	 * @param {Event} event - The press event triggered by the overflow button.
	 * @param {Context} context - The context containing all actions.
	 * @returns {void}
	 */
	private _onOverflowButtonPress(event: Event, context: Context): void {
		const overflowButtons = (context.getProperty("actions") as ActionButton[]).slice(2);
		this._getOverflowButtonPopover(overflowButtons).openBy(event.getSource<Button>());
	}

	/**
	 * Creates or retrieves the overflow button Popover.
	 *
	 * @private
	 * @param {ActionButton[]} actionButtons - The array of overflow actions.
	 * @returns {Popover} The overflow button Popover.
	 */
	private _getOverflowButtonPopover(actionButtons: ActionButton[]): Popover {
		if (!this._overflowPopover) {
			this._overflowList = new List(`${this.getId()}-overflowList`);
			this._overflowPopover = new Popover(`${this.getId()}-overflowPopover`, {
				showHeader: false,
				content: this._overflowList,
				placement: PlacementType.VerticalPreferredBottom
			});
		}

		//setup task-specific with task-specific actions
		this._setupOverflowList(actionButtons);
		return this._overflowPopover;
	}

	/**
	 * Sets up the overflow button list with the provided task-specific actions.
	 *
	 * @private
	 * @param {ActionButton[]} actionButtons - The array of overflow actions.
	 * @returns {void}
	 */
	private _setupOverflowList(actionButtons: ActionButton[]): void {
		this._overflowList.destroyItems();
		actionButtons.forEach((actionButton, index) => {
			const listItem = new StandardListItem(`action-${index}`, {
				title: actionButton.text,
				type: "Active",
				press: () => this._onActionButtonPress(actionButton.pressHandler as () => void)
			});
			addFESRSemanticStepName(listItem, FESR_EVENTS.PRESS, "todoActionBtn");
			this._overflowList.addItem(listItem);
		});
	}

	/**
	 * Handles the button press event and executes the provided press handler function,
	 * which refreshes the UI after the button press action.
	 *
	 * @private
	 * @param {Function} pressHandler - The function to be executed when the button is pressed.
	 * @returns {void}
	 */
	private _onActionButtonPress(pressHandler: (refreshFn: () => Promise<void>) => void): void {
		pressHandler(this._loadCards.bind(this));
	}

	/**
	 * Retrieves custom attributes for a given task and formats them for display.
	 * If the task has completion deadline and creation date, those attributes are also included.
	 * If the task has a creator, the creator's name is included as well.
	 *
	 * @param {Task} task - The task object for which custom attributes are retrieved.
	 * @returns {CustomAttribute[]} - An array of formatted custom attributes.
	 */
	private _getCustomAttributes(task: Task): CustomAttribute[] {
		const finalAttributes = [];
		const maximumAttributeCount = 4;
		const customAttributes = this._customAttributeMap[task.TaskDefinitionID] || [];

		for (let custom_attribute of customAttributes) {
			const customAttribute = custom_attribute;
			const taskCustomAttributes = task.CustomAttributeData?.results;
			const existingAttribute = taskCustomAttributes.find((taskAttribute) => {
				return taskAttribute.Name === customAttribute.name;
			});
			let value = "";

			if (existingAttribute && !customAttribute.referenced) {
				const attribute: CustomAttribute = {
					label: customAttribute.label + ":",
					type: ContentConfigType.Text
				};

				if (customAttribute.format) {
					value = this._formatCustomAttribute(customAttribute, taskCustomAttributes);
				} else if (customAttribute.textArrangement) {
					value = this._arrangeText(existingAttribute, customAttribute.textArrangement);
				} else {
					value = customAttribute.type === "Edm.DateTime" ? this._formatDate(existingAttribute.Value) : existingAttribute.Value;
				}
				attribute.text = value || "-";
				finalAttributes.push(attribute);
			}
		}

		// add common attributes
		this._addCommonAttributes(finalAttributes, task);

		return finalAttributes.slice(0, maximumAttributeCount);
	}

	/**
	 * Formats the given unit of measure value and description based on the specified text arrangement.
	 *
	 * @private
	 * @param {TaskCustomAttribute} customAttribute The custom attribute object.
	 * @param {TextArrangement} textArrangement The text arrangement option.
	 * @returns {string} The formatted value.
	 */
	private _arrangeText(customAttribute: TaskCustomAttribute, textArrangement: TextArrangement): string {
		const value = customAttribute.Value.trim();
		const description = customAttribute.ValueText.trim();
		let formattedValue = "";

		switch (textArrangement) {
			case TextArrangement.TextFirst:
				formattedValue = `${description} (${value})`;
				break;
			case TextArrangement.TextLast:
				formattedValue = `${value} (${description})`;
				break;
			case TextArrangement.TextOnly:
				formattedValue = `${description}`;
				break;
			case TextArrangement.TextSeparate:
				formattedValue = `${value}`;
				break;
			default: // TextFirst
				formattedValue = `${description} ${value})`;
				break;
		}

		return formattedValue;
	}

	/**
	 * Formats a custom attribute value based on its format type.
	 *
	 * @param {CustomAttribute} customAttribute - The custom attribute object.
	 * @param {TaskCustomAttribute[]} taskAttributes - The array of task attributes.
	 * @returns {string} - The formatted value.
	 */
	private _formatCustomAttribute(customAttribute: CustomAttribute, taskAttributes: TaskCustomAttribute[] = []): string {
		const findAttribute = (attributeName: string) => {
			return taskAttributes.find((oAttribute) => {
				return oAttribute.Name === attributeName;
			});
		};
		const format = customAttribute.format?.toUpperCase();
		const currentAttribute = findAttribute(customAttribute.name as string);
		let formattedValue = currentAttribute?.Value;

		// Format = CurrencyValue
		if (format === Format.CURRENCYVALUE && customAttribute.reference) {
			const referencedAttribute = findAttribute(customAttribute.reference);

			if (referencedAttribute) {
				const currencyFormatter = NumberFormat.getCurrencyInstance();
				formattedValue = currencyFormatter.format(parseFloat(currentAttribute?.Value as string), referencedAttribute.Value);
			}
		} else if (format === Format.USER) {
			formattedValue = currentAttribute?.FormattedValue || currentAttribute?.Value;
		}

		return formattedValue as string;
	}

	/**
	 * Adds common attributes to the final attributes list based on the provided task.
	 * Common attributes include completion deadline, creation date, and creator's name.
	 *
	 * @param {CustomAttribute[]} finalAttributes - The array of custom attributes to which the common attributes will be added.
	 * @param {Task} task - The task object containing data for common attributes.
	 */
	private _addCommonAttributes(finalAttributes: CustomAttribute[], task: Task): void {
		if (task.CompletionDeadline) {
			finalAttributes.push({
				label: this._i18nBundle.getText("dueDate") + ":",
				text: this._formatDate(task.CompletionDeadline, "MMM dd, YYYY hh:mm a"),
				type: ContentConfigType.Text
			});
		}

		if (task.CreatedOn) {
			finalAttributes.push({
				label: this._i18nBundle.getText("createdOn") + ":",
				text: this._formatDate(task.CreatedOn),
				type: ContentConfigType.Text
			});
		}
	}

	/**
	 * Format a date string to a custom date and time format.
	 *
	 * @private
	 * @param {string} dateStr - The date string to format.
	 * @param {string} pattern - The pattern to be used for formatting the date.
	 * @returns {string} The formatted date string.
	 */
	private _formatDate(dateStr: string, pattern: string = Formatting.getDatePattern("short") || "dd/MM/yyyy"): string {
		const locale = new Locale(Formatting.getLanguageTag().language);
		const dateFormat = DateFormat.getDateTimeInstance({ pattern }, locale);
		const value = this._getParsedTime(dateStr);
		let formattedDate = "";

		if (!isNaN(value)) {
			formattedDate = dateFormat.format(new Date(value));
		}

		return formattedDate;
	}

	/**
	 * Parses different time formats supplied from the back-ends. It returns UNIX time stamp in milliseconds.
	 * If Time Format contains unexpected symbols or Format is not recognized NaN is returned.
	 * Referenced from: cross.fnd.fiori.inbox.CustomAttributeComparator
	 *
	 * @param {string | number} time date format to be parsed. If int UNIX time stamp in milliseconds is assumed.
	 * @returns {number} UNIX time stamp in milliseconds. (milliseconds that have elapsed since 00:00:00 UTC, Thursday, 1 January 1970)
	 * @private
	 */
	private _getParsedTime(time: string | number): number {
		if (time == null || time === "00000000") {
			return NaN;
		}

		if (typeof time === "number") {
			return time;
		}

		// Check for various time formats
		const dateRegex = /\/(Date)\((\d+)\)\//;
		const yyyymmddRegex = /^\d{8}$/;
		const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|([+-])(\d{2}):(\d{2}))?$/;

		const dateMatch = time.match(dateRegex);
		if (dateMatch) {
			// Time Format "/Date(869080830000)/"
			return parseInt(dateMatch[2], 10);
		}

		if (yyyymmddRegex.test(time) && this._isValidDate(time)) {
			// Time Format "YYYYMMDD" (Old TGW format)
			const parsedDate = DateFormat.getDateInstance().parse(time);
			return parsedDate instanceof Date ? parsedDate.getTime() : NaN;
		}

		const isoMatch = time.match(isoRegex);
		if (isoMatch) {
			// Time Format "2018-01-05T00:00:00" (BPM and TGW-cloud format, UTC)
			return new Date(time).getTime();
		}

		return NaN;
	}

	/**
	 * Check whether given dateString is of format YYYYMMDD and is a valid value for Date object.
	 *
	 * @param {string} dateString - The datestring to be checked for validity
	 * @returns {Date} if its a valid date return the date else false
	 * @private
	 */
	private _isValidDate(dateString: string): boolean {
		// Check if the input has the correct length
		if (dateString.length !== 8) {
			return false;
		}

		// Parse the date components
		const year = parseInt(dateString.slice(0, 4), 10);
		const month = parseInt(dateString.slice(4, 6), 10) - 1;
		const day = parseInt(dateString.slice(6), 10);

		// Create a Date object with the parsed components
		const date = new Date(year, month, day);

		// Check if the parsed date is valid
		return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;
	}

	/**
	 * Handles the press event of a task.
	 *
	 * @private
	 * @param {Event} event - The press event.
	 */
	private _onPressTask(event: Event) {
		const control = event.getSource<ActionTile>();
		const context = control.getBindingContext();
		const status = context?.getProperty("status") as LoadState;
		const url = this._getTaskUrl(context?.getProperty("SAP__Origin") as string, context?.getProperty("InstanceID") as string);

		if (!this._disableNavigation) {
			if (status !== LoadState.Loading) {
				URLHelper.redirect(url, false);
			}
		}
	}

	/**
	 * Get the task URL for a given task.
	 *
	 * @private
	 * @param {string} originId - The origin ID of the task.
	 * @param {string} instanceId - The instance ID of the task.
	 * @returns {string} The task URL.
	 */
	private _getTaskUrl(originId: string, instanceId: string): string {
		const taskInstanceURL = `?showAdditionalAttributes=true&/detail/${originId}/${instanceId}/TaskCollection(SAP__Origin='${originId}',InstanceID='${instanceId}')`;

		return this.getTargetAppUrl() + taskInstanceURL;
	}

	/**
	 * Handles the click event on the "Created By" link.
	 * Triggers email or opens a contact card if configuration is enabled
	 *
	 * @private
	 * @param {Event} event - The event object.
	 */
	private async _onClickCreatedBy(event: ActionTileContent$LinkPressEvent): Promise<void> {
		const sourceControl = event.getParameter("link");
		const {
			SAP__Origin: originId,
			CreatedBy: userId,
			TaskTitle: subject,
			CreatedByName: createdBy,
			InstanceID
		} = event.getSource().getBindingContext()?.getObject() as Task;
		const link = this._getTaskUrl(originId, InstanceID);
		const triggerEmail = (email: string, { subject, body }: { subject: string; body: string }) => {
			URLHelper.triggerEmail(email, subject, body);
			setTimeout(() => {
				this._disableNavigation = false;
			}, 0);
		};
		const url = new URL(window.location.href);
		url.hash = link;
		const body = url.toString();

		this._disableNavigation = true;

		const userData = await this._fetchUserDetailsIfRequired(originId, userId);
		if (userData.Email) {
			sap.ui.require(["sap/suite/ui/commons/collaboration/ServiceContainer"], async (serviceContainer: ServiceContainer) => {
				const teamsHelper = await serviceContainer.getServiceAsync();

				if (teamsHelper.enableContactsCollaboration) {
					try {
						const popover = (await teamsHelper.enableContactsCollaboration(userData.Email as string, {
							subject,
							body: encodeURIComponent(body)
						})) as Popover;
						popover.openBy(sourceControl as Link);
					} catch (error) {
						Log.error(error instanceof Error ? error.message : String(error));
						triggerEmail(userData.Email as string, { subject, body });
					}
				} else {
					triggerEmail(userData.Email as string, { subject, body });
				}
			});
		} else {
			MessageBox.warning(this._i18nBundle.getText("noEmail", [createdBy]) as string);
			setTimeout(() => {
				this._disableNavigation = false;
			}, 0);
		}
	}

	/**
	 * Fetches user details if required.
	 *
	 * @private
	 * @param {string} originId - The origin ID.
	 * @param {string} userId - The user ID.
	 * @returns {Promise<UserInfo>} - A promise that resolves to the user information.
	 */
	private _fetchUserDetailsIfRequired(originId: string, userId: string): Promise<UserInfo> {
		this.userInfo = this.userInfo || {};

		if (Object.keys(this.userInfo).includes(userId)) {
			return Promise.resolve(this.userInfo[userId]);
		} else {
			return this._fetchUserInfo(originId, userId);
		}
	}

	/**
	 * Fetches user information for a specific user.
	 *
	 * @private
	 * @param {string} originId - The origin ID.
	 * @param {string} userId - The user ID.
	 * @returns {Promise<UserInfo>} - A promise that resolves to the user information.
	 */
	private async _fetchUserInfo(originId: string, userId: string): Promise<UserInfo> {
		try {
			const response = await fetch(
				`/sap/opu/odata/IWPGW/TASKPROCESSING;mo;v=2/UserInfoCollection(SAP__Origin='${originId}',UniqueName='${userId}')?$format=json`
			);

			if (!response.ok) {
				throw new Error(`Failed to Fetch User Info for: ${userId}`);
			}

			const { d: data } = (await response.json()) as Response;
			this.userInfo[userId] = data as UserInfo;
			return this.userInfo[userId];
		} catch (error: unknown) {
			Log.error(error instanceof Error ? error.message : String(error));
			return {};
		}
	}

	/**
	 * Hook for processing data fetched from a batch call.
	 * This method can be overridden to perform additional data processing operations.
	 * In this implementation, it is consumed to handle task-related data, particularly
	 * for extracting custom attributes if action cards are enabled.
	 *
	 * @private
	 * @async
	 * @param {unknown[]} results - Data retrieved from the batch call. Structure may vary based on the backend service.
	 * @param {RequestOptions} options - Additional options for parsing the data.
	 * @returns {Promise<void>} A Promise that resolves when the data processing is complete.
	 */
	public async onDataReceived(results: unknown[], options: RequestOptions): Promise<void> {
		const [tasks, taskDefinitions] = results;
		this._extractCustomAttributes(taskDefinitions as TaskDefinitionCollection[]);

		if (!options || (options && !options.onlyCount)) {
			const updatedTasks = await this._updateTasks(tasks as Task[]);
			this._oData.displayTiles = this._oData.tiles = updatedTasks;
		}
	}

	/**
	 * Updates the tasks with attributes and actions.
	 *
	 * @private
	 * @param {Task[]} tasks - The array of tasks to update.
	 * @returns {Promise<Task[]>} A promise that resolves with the updated array of tasks.
	 */
	private async _updateTasks(tasks: Task[] = []): Promise<Task[]> {
		//add custom attributes to tasks
		let updatedTasks = this._addCustomAttributes(tasks);

		//add actions to tasks
		if (this.getEnableActions()) {
			//calculate unique task definitions
			const taskDefinitions = this._getTaskDefintions(updatedTasks);

			//download decision options for task defintions
			await this._downloadDecisionOptions(taskDefinitions);

			//append actions
			updatedTasks = this._addActions(updatedTasks);
		}

		return updatedTasks;
	}

	/**
	 * Adds custom attributes to each task in the provided array.
	 *
	 * @private
	 * @param {Task[]} tasks - The array of tasks to which custom attributes will be added.
	 * @returns {Task[]} - A new array of tasks, each with added custom attributes.
	 */
	private _addCustomAttributes(tasks: Task[]): Task[] {
		return tasks.map((task) => ({
			...task,
			attributes: this._getCustomAttributes(task)
		}));
	}

	/**
	 * Adds actions to the tasks based on their task definitions.
	 *
	 * @private
	 * @param {Task[]} tasks - The array of tasks to which actions will be added.
	 * @returns {Task[]} The array of tasks with actions added.
	 */
	private _addActions(tasks: Task[]): Task[] {
		return tasks.map((task) => {
			const key = task.SAP__Origin + task.TaskDefinitionID;
			return {
				...task,
				actions: this._taskDefinitionMap[key]
					? DecisionDialog.getTaskActions(task, this.getBaseUrl(), this._taskDefinitionMap, this._i18nBundle)
					: []
			};
		});
	}

	/**
	 * Downloads decision options for the provided task definitions.
	 *
	 * @private
	 * @param {Record<string, TaskDefinition>} taskDefinitions - The task definitions for which decision options will be downloaded.
	 * @returns {Promise<void>} A promise that resolves when all decision options are downloaded and processed.
	 */
	private async _downloadDecisionOptions(taskDefinitions: Record<string, TaskDefintion>): Promise<void> {
		const decisionKeys: string[] = [];
		const decisionURLs = Object.keys(taskDefinitions).reduce((urls: string[], key) => {
			if (!Object.keys(this._taskDefinitionMap).includes(key)) {
				decisionKeys.push(key);
				this._taskDefinitionMap[key] = [];

				const { SAP__Origin, InstanceID } = taskDefinitions[key];
				urls.push(`DecisionOptions?SAP__Origin='${SAP__Origin}'&InstanceID='${InstanceID}'`);
			}
			return urls;
		}, []);

		if (decisionURLs.length) {
			this._clearRequests();
			this.requests.push({
				baseURL: this.getBaseUrl(),
				requestURLs: decisionURLs,
				success: (results: DecisionOption[][]): Promise<void> => {
					results.forEach((decisionOptions: DecisionOption[], index) => {
						this._taskDefinitionMap[decisionKeys[index]] = decisionOptions;
					});
					return Promise.resolve();
				}
			});

			await this._submitBatch();
		}
	}

	/**
	 * Retrieves unique task definitions from the provided array of tasks.
	 *
	 * @private
	 * @param {Task[]} tasks - The array of tasks from which to retrieve task definitions.
	 * @returns {Record<string, TaskDefintion>} An object containing unique task definitions.
	 */
	private _getTaskDefintions(tasks: Task[] = []): Record<string, TaskDefintion> {
		const taskDefinitions: Record<string, TaskDefintion> = {};
		tasks.forEach((task) => {
			const key = task.SAP__Origin + task.TaskDefinitionID;
			if (!taskDefinitions[key]) {
				taskDefinitions[key] = {
					SAP__Origin: task.SAP__Origin,
					InstanceID: task.InstanceID,
					TaskDefinitionID: task.TaskDefinitionID
				};
			}
		});

		return taskDefinitions;
	}

	/**
	 * Extracts Custom Attribute Information to create an attribute map from raw attribute data
	 * received from call, which is used while task processing
	 *
	 * @private
	 * @param {TaskDefinitionCollection[]} taskDefinitions - array of raw tasks definitions
	 */
	private _extractCustomAttributes(taskDefinitions: TaskDefinitionCollection[] = []): void {
		taskDefinitions.forEach((taskDefinition: TaskDefinitionCollection) => {
			const customAttributes = taskDefinition.CustomAttributeDefinitionData?.results || [];
			this._customAttributeMap[taskDefinition.TaskDefinitionID] = customAttributes
				.filter((oAttribute) => oAttribute.Rank > 0)
				.sort((attr1, attr2) => attr2.Rank - attr1.Rank)
				.map((oAttribute) => ({
					name: oAttribute.Name,
					label: oAttribute.Label,
					type: oAttribute.Type,
					format: oAttribute.Format,
					reference: oAttribute.Reference,
					referenced: oAttribute.Referenced,
					textArrangement: oAttribute.TextArrangement
				}));
		});
	}

	/**
	 * Get the text for the "No Data" message.
	 *
	 * @private
	 * @returns {string} The text for the "No Data" message.
	 */
	public getNoDataText(): string {
		return this._i18nBundle.getText("noTaskTitle") as string;
	}

	/**
	 * Calculates the number of vertical cards that can fit within the available height of the given DOM element.
	 *
	 * @private
	 * @override
	 * @param {Element} domRef - The DOM element to calculate the vertical card count for.
	 * @returns {number} - The number of vertical cards that can fit within the available height.
	 */
	public getVerticalCardCount(domRef: Element, calculationProperties?: CalculationProperties): number {
		const domProperties = fetchElementProperties(domRef, ["height", "padding-top"]);
		const titleHeight = this.calculateTitleHeight();
		const availableHeight = domProperties.height - domProperties["padding-top"] * 2 - titleHeight;
		const horizontalCardCount = this.getHorizontalCardCount(domRef);
		const isPlaceholder = calculationProperties?.isPlaceholder;
		const gap = 16;
		let height = 0;
		let verticalCardCount = 0;

		if (this._isLoaded()) {
			const cardSet = splitCards(this._oData.tiles as Task[], horizontalCardCount);
			const rowHeights = cardSet.map(
				function (cards: Task[]) {
					const maxAttributes = cards.reduce(function (attributeCount: number, card: Task) {
						card.attributes = card.attributes || [];
						return card.attributes.length > attributeCount ? card.attributes.length : attributeCount;
					}, 1);

					const count = Math.min(maxAttributes, 4) as keyof typeof Constants.CARD_HEIGHT;
					return Constants.CARD_HEIGHT[count] + gap;
				}.bind(this)
			);

			for (let rowHeight of rowHeights) {
				if (height + rowHeight < availableHeight) {
					height += rowHeight;
					verticalCardCount++;
				} else {
					break;
				}
			}
		} else {
			verticalCardCount = Math.floor(availableHeight / Constants.CARD_HEIGHT[isPlaceholder ? "4" : "1"]);
		}

		return Math.max(verticalCardCount, 2);
	}
}
