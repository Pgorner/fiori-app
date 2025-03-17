/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import Log from "sap/base/Log";
import Button from "sap/m/Button";
import CustomListItem from "sap/m/CustomListItem";
import Dialog from "sap/m/Dialog";
import GroupHeaderListItem from "sap/m/GroupHeaderListItem";
import { URLHelper } from "sap/m/library";
import List from "sap/m/List";
import OverflowToolbar from "sap/m/OverflowToolbar";
import Select, { Select$ChangeEvent } from "sap/m/Select";
import StandardListItem from "sap/m/StandardListItem";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import VBox from "sap/m/VBox";
import Event from "sap/ui/base/Event";
import type { MetadataOptions } from "sap/ui/core/Element";
import DateFormat from "sap/ui/core/format/DateFormat";
import Item from "sap/ui/core/Item";
import Container from "sap/ushell/Container";
import EventHub from "sap/ushell/EventHub";
import UserRecents from "sap/ushell/services/UserRecents";
import App from "./App";
import BaseAppPersPanel, { $BaseAppPersPanelSettings } from "./BaseAppPersPanel";
import { IActivity } from "./interface/AppsInterface";
import MenuItem from "./MenuItem";
import { addFESRId } from "./utils/FESRUtil";

interface IAppHistoryItem {
	name: string;
}

interface IAppHistory {
	dateStamp: number;
	apps: IAppHistoryItem[];
}

enum DateFilterOption {
	ALL = "ALL",
	TODAY = "TODAY",
	WEEK = "WEEK",
	TWO_WEEK = "TWO_WEEK",
	THREE_WEEK = "THREE_WEEK"
}

const GroupDateFormatter = DateFormat.getDateInstance({ pattern: "MMMM d, yyyy" });

const Constants = {
	OLDER_DATE_TIMESTAMP: Number.MIN_SAFE_INTEGER
};

const formatConstantTimeInDate = (date: Date): number => {
	return date.setHours(12, 0, 0, 0);
};

/**
 * Calculates the start and end dates of a week based on the given week offset.
 * @param weekOffset - The offset from the current week.
 * @returns An object containing the start and end dates of the week.
 */
const getWeekRangeValues = (weekOffset: number) => {
	const currentDate = new Date();

	// Calculate the start of the current week (with sunday as the first day of the week)
	const startDate = new Date(currentDate);
	const startDateTimeStamp = startDate.setDate(currentDate.getDate() - currentDate.getDay() - 7 * weekOffset);

	// Calculate the end of the week
	const endDate = new Date(startDate);
	const endDateTimeStamp = endDate.setDate(startDate.getDate() + 6);

	return {
		startDate: startDateTimeStamp,
		endDate: endDateTimeStamp
	};
};

/**
 * Calculates the timestamp of a date, that is a specified number of days before a given current date.
 *
 * @param {Date} currentTimeStamp - The current date to calculate days before.
 * @param {number} days - The number of days before the current date.
 * @returns {number} The timestamp of the date `days` before `currentDate`.
 */
const getDaysBefore = (currentTimeStamp: number, days: number): number => {
	const currentDate = new Date(currentTimeStamp);
	const newDateStamp = currentDate.setDate(currentDate.getDate() - days);
	return formatConstantTimeInDate(new Date(newDateStamp));
};

/**
 * Filters an app by date.
 * @private
 * @param {number} appTimeStamp - The timestamp of the app.
 * @param {number} startTimeStamp - The start timestamp for filtering.
 * @param {number} endTimeStamp - The end timestamp for filtering.
 * @returns A boolean indicating whether the app falls within the specified date range.
 */
const isDateWithinRange = (appTimeStamp: number, startTimeStamp: number, endTimeStamp: number) => {
	return appTimeStamp >= startTimeStamp && appTimeStamp <= endTimeStamp;
};

/**
 *
 * Provides class for managing Recently Used apps.
 *
 * @extends sap.cux.home.BaseAppPersPanel
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.121.0
 *
 * @internal
 * @experimental Since 1.121
 * @public
 *
 * @alias sap.cux.home.RecentAppPanel
 */
export default class RecentAppPanel extends BaseAppPersPanel {
	private _recentDayTimeStamp!: number;
	private _recentApps: IActivity[] = [];
	static readonly metadata: MetadataOptions = {
		library: "sap.cux.home",
		defaultAggregation: "apps",
		aggregations: {
			/**
			 * Apps aggregation for Recent apps
			 */
			apps: { type: "sap.cux.home.App", singularName: "app", multiple: true, visibility: "hidden" }
		}
	};

	/**
	 * Constructor for a new Recently Used apps Panel.
	 *
	 * @param {string} [id] ID for the new control, generated automatically if an ID is not provided
	 * @param {object} [settings] Initial settings for the new control
	 */
	public constructor(id?: string, settings?: $BaseAppPersPanelSettings) {
		super(id, settings);
		this.setSupported(false);
	}

	public init() {
		super.init();
		this.setProperty("key", "recentApps");
		this.setProperty("title", this._i18nBundle.getText("recentlyUsedTab"));
		this.setProperty("tooltip", this._i18nBundle.getText("recentAppsInfo"));
		this._attachUserActivityTracking();
		EventHub.on("userRecentsCleared").do(() => {
			void this.refresh();
		});

		//Setup Menu Items
		const showHistoryMenuItem = new MenuItem(`${this.getId()}-show-history-btn`, {
			title: this._i18nBundle.getText("showHistoryBtn"),
			icon: "sap-icon://history",
			press: this._openHistoryDialog.bind(this)
		});
		addFESRId(showHistoryMenuItem, "showHistory");
		this.insertAggregation("menuItems", showHistoryMenuItem, 0);
	}

	/**
	 * Fetch recent apps and set apps aggregation
	 * @private
	 */
	public async loadApps() {
		let recentApps = await this._getRecentApps();
		recentApps = recentApps.map((app) => {
			return {
				...app,
				menuItems: this._getAppActions(app.addedInFavorites)
			};
		});
		this.destroyAggregation("apps", true);
		//convert apps objects array to apps instances
		this.setApps(this.generateApps(recentApps));
	}

	/**
	 * Returns list of recent apps
	 * @private
	 * @returns {Promise<IActivity[]>} - Array of recent apps.
	 */
	private async _getRecentApps(): Promise<IActivity[]> {
		try {
			const UserRecentsService = await Container.getServiceAsync<UserRecents>("UserRecents");
			const [recentActivities, recentActivitiesUsageData] = await Promise.all([
				UserRecentsService?.getRecentActivity().then((result) => result || []),
				UserRecentsService?.oRecentActivity._getRecentActivitiesFromLoadedData().then((result) => result || {})
			]);
			//convert activity to apps
			this._recentApps = await this.convertActivitiesToVisualizations(recentActivities);
			let recentDate = new Date(recentActivitiesUsageData?.recentDay);
			// add last used and usage info
			this._recentDayTimeStamp = formatConstantTimeInDate(recentDate);

			const recentUsage = recentActivitiesUsageData?.recentUsageArray || [];
			const recentUsageMap = new Map<string, number[]>();
			recentUsage.forEach((app) => {
				if (app.oItem?.appId) {
					recentUsageMap.set(app.oItem.appId, app.aUsageArray);
				}
			});
			this._recentApps.forEach((app) => {
				//isolate only date information by having common time information
				app.dateStamp = formatConstantTimeInDate(new Date(app.timestamp));
				if (recentUsageMap.size) {
					app.usageArray = recentUsageMap.get(app.orgAppId);
				}
			});
			return this._recentApps || [];
		} catch (error) {
			Log.error(error as string);
			return [];
		}
	}

	/**
	 * Returns list of actions available for selected app
	 * @private
	 * @param {boolean} isAppAddedInFavorite - true if app is already present in favorite, false otherwise.
	 * @returns {sap.cux.home.MenuItem[]} - Array of list items.
	 */
	private _getAppActions(isAppAddedInFavorite: boolean = false): MenuItem[] {
		const resumeLastActivityItem = new MenuItem({
			title: this._i18nBundle.getText("resumeLastActivity"),
			icon: "sap-icon://past",
			press: this._resumeAppActivity.bind(this)
		});
		addFESRId(resumeLastActivityItem, "resumeActivity");
		const appActions = [resumeLastActivityItem];
		if (!isAppAddedInFavorite) {
			const addToFavoritesItem = new MenuItem({
				title: this._i18nBundle.getText("addToFavorites"),
				icon: "sap-icon://add-favorite",
				press: (event) => {
					void this._addAppToFavorites(event);
				}
			});
			addFESRId(addToFavoritesItem, "addFavFromRecent");
			appActions.push(addToFavoritesItem);
		}
		return appActions;
	}

	/**
	 * Redirects to the selected app url
	 * @private
	 * @param {sap.ui.base.Event} event - The event object.
	 */
	private _resumeAppActivity(event: Event) {
		const menuItem = event.getSource<MenuItem>();
		const app = menuItem.getParent() as App;
		const url = app.getUrl?.();
		URLHelper.redirect(url, false);
	}

	/**
	 * Generates and returns a dialog for showing the history of recent applications.
	 * @private
	 * @returns The generated dialog for showing the history of recent applications.
	 */
	private _generateHistoryDialog() {
		const id = `${this.getId()}-history-dialog`;
		if (!this._controlMap.get(id)) {
			this._controlMap.set(
				id,
				new Dialog(id, {
					title: this._i18nBundle.getText("showHistoryTitle"),
					content: new VBox({
						id: `${id}-container`,
						height: "100%",
						items: [this._generateAppHistoryList()]
					}).addStyleClass("sapUiTinyMargin"),
					escapeHandler: this._closeHistoryDialog.bind(this),
					contentHeight: "29rem",
					contentWidth: "25rem",
					buttons: [
						new Button({
							id: `${id}-cancel-btn`,
							text: this._i18nBundle.getText("cancelBtn"),
							press: this._closeHistoryDialog.bind(this)
						})
					]
				}).addStyleClass("sapContrastPlus")
			);
		}
		return this._controlMap.get(id) as Dialog;
	}

	/**
	 * Generates the app history list.
	 * @private
	 * @returns The generated app history list.
	 */
	private _generateAppHistoryList() {
		const id = `${this.getId()}-history-dialog-list`;
		if (!this._controlMap.get(id)) {
			this._controlMap.set(
				id,
				new List({
					id,
					growing: true,
					growingScrollToLoad: true,
					headerToolbar: new OverflowToolbar({
						id: `${id}-header-toolbar`,
						style: "Clear",
						height: "1.75rem",
						content: [
							new ToolbarSpacer({
								id: `${id}-header-toolbar-spacer`
							}),
							this._generateAppHistoryListFilter()
						]
					})
				}).addStyleClass("sapMListShowSeparatorsNone recentAppList")
			);
		}
		return this._controlMap.get(id) as List;
	}

	/**
	 * Generates the app history list filter.
	 * @private
	 * @returns The Select control for the app history list filter.
	 */
	private _generateAppHistoryListFilter() {
		const id = `${this.getId()}-history-dialog-list-filter`;
		if (!this._controlMap.get(id)) {
			this._controlMap.set(
				id,
				new Select({
					id,
					selectedKey: DateFilterOption.ALL,
					change: (e) => this._onDateFilterChange(e),
					items: [
						new Item({
							id: `${id}-month`,
							key: DateFilterOption.ALL,
							text: this._i18nBundle.getText("dateThirty")
						}),
						new Item({
							id: `${id}-today`,
							key: DateFilterOption.TODAY,
							text: this._i18nBundle.getText("dateToday")
						}),
						new Item({
							id: `${id}-week`,
							key: DateFilterOption.WEEK,
							text: this._i18nBundle.getText("dateWeek")
						}),
						new Item({
							id: `${id}-twoWeek`,
							key: DateFilterOption.TWO_WEEK,
							text: this._i18nBundle.getText("dateTwoWeek")
						}),
						new Item({
							id: `${id}-threeWeek`,
							key: DateFilterOption.THREE_WEEK,
							text: this._i18nBundle.getText("dateThreeWeek")
						})
					]
				})
			);
		}
		return this._controlMap.get(id) as Select;
	}

	/**
	 * Generates and populates items in the app history list based on the provided list of items.
	 * Clears existing items in the list before adding new items.
	 *
	 * @param {IAppHistory[]} appHistoryItems - Array of items to populate in the app history list.
	 * @returns {void}
	 * @private
	 */
	private _generateAppHistoryListItems(appHistoryItems: IAppHistory[]): void {
		const appHistoryList = this._generateAppHistoryList();
		appHistoryList?.destroyItems();
		appHistoryItems.forEach((appHistoryItem) => {
			appHistoryList.addItem(this._getGroupHeader(appHistoryItem.dateStamp));
			appHistoryList.addItem(
				new CustomListItem({
					id: `date-${appHistoryItem.dateStamp}-lisItem`,
					type: "Inactive",
					content: [
						new List({
							id: `date-${appHistoryItem.dateStamp}-appList`,
							items: (appHistoryItem.apps || []).map((app) =>
								new StandardListItem({
									//id,
									title: app.name,
									type: "Inactive"
								}).addStyleClass("sapUiTinyMarginBeginEnd recentAppList sapUiSmallMarginTop")
							)
						}).addStyleClass("sapMListShowSeparatorsNone sapUiTinyMarginBottom")
					]
				})
			);
		});
	}

	/**
	 * Opens the history dialog.
	 * This method generates the show history dialog, retrieves the app history list,
	 * generates the app history list items, and opens the dialog.
	 * @private
	 */
	private _openHistoryDialog() {
		const historyDialog = this._generateHistoryDialog();
		const appHistory = this._getAppHistory();
		this._generateAppHistoryListItems(appHistory);
		historyDialog.open();
	}

	/**
	 * Closes the history dialog.
	 * @private
	 */
	private _closeHistoryDialog() {
		const historyDialog = this._generateHistoryDialog();
		historyDialog.close();
	}

	/**
	 * Handles the change event of the date filter.
	 * Updates the app history list based on the selected date filter.
	 * @private
	 * @param {Select$ChangeEvent} event - The select change event.
	 */
	private _onDateFilterChange(event: Select$ChangeEvent) {
		const selectedKey = event.getParameter("selectedItem")?.getKey() as DateFilterOption;
		const filteredAppHistory: IAppHistory[] = this._getFilteredAppHistory(selectedKey);
		this._generateAppHistoryListItems(filteredAppHistory);
	}

	/**
	 * Generates a group header for the given date timestamp.
	 *
	 * @param {number} dateStamp - The timestamp representing the date.
	 * @returns {GroupHeaderListItem} The generated group header list item.
	 * @private
	 */
	private _getGroupHeader(dateStamp: number): GroupHeaderListItem {
		let sTitle = "";
		switch (dateStamp) {
			case Constants.OLDER_DATE_TIMESTAMP:
				sTitle = this._i18nBundle.getText("dateLater") as string;
				break;
			case formatConstantTimeInDate(new Date()):
				sTitle = this._i18nBundle.getText("dateToday") as string;
				break;
			default:
				sTitle = GroupDateFormatter.format(new Date(dateStamp));
				break;
		}
		return new GroupHeaderListItem({
			title: sTitle
		}).addStyleClass("sapUiTinyMarginBeginEnd recentAppListHeader");
	}

	/**
	 * Retrieves the application usage history based on recent app data.
	 *
	 * @returns {IAppHistory[]} Array of objects, where each object contains the date timestamp and the apps that are used on that date.
	 * @private
	 */
	private _getAppHistory(): IAppHistory[] {
		if (this._recentDayTimeStamp && this._recentApps?.length) {
			const groupedAppHistory: Record<number, IAppHistory> = {};
			const thresholdTimeStamp = getDaysBefore(this._recentDayTimeStamp, 30); // 30 days threshold
			this._recentApps.forEach((recentApp) => {
				const appTimeStamp = formatConstantTimeInDate(new Date(recentApp.dateStamp!));
				if (appTimeStamp < thresholdTimeStamp) {
					if (!groupedAppHistory[Constants.OLDER_DATE_TIMESTAMP]) {
						groupedAppHistory[Constants.OLDER_DATE_TIMESTAMP] = { dateStamp: Constants.OLDER_DATE_TIMESTAMP, apps: [] };
					}
					groupedAppHistory[Constants.OLDER_DATE_TIMESTAMP]?.apps.push({ name: recentApp.title });
				} else {
					const appUsage = recentApp.usageArray || [];
					appUsage.forEach((usage, index) => {
						if (usage > 0) {
							const usageDate = getDaysBefore(this._recentDayTimeStamp, appUsage.length - 1 - index);
							if (!groupedAppHistory[usageDate]) {
								groupedAppHistory[usageDate] = { dateStamp: usageDate, apps: [] };
							}
							groupedAppHistory[usageDate]?.apps.push({ name: recentApp.title });
						}
					});
				}
			});
			const appHistory = Object.values(groupedAppHistory);
			appHistory.sort((a, b) => b.dateStamp - a.dateStamp);
			return appHistory;
		}
		return [];
	}

	/**
	 * Retrieves the filtered app history based on the selected date filter option.
	 * @private
	 * @param {DateFilterOption} selectedKey - The selected date filter option.
	 * @returns {IAppHistory[]} An array of filtered app history.
	 */
	private _getFilteredAppHistory(selectedKey: DateFilterOption): IAppHistory[] {
		const appHistory = this._getAppHistory();
		let filteredAppHistory: IAppHistory[] = [];
		switch (selectedKey) {
			case DateFilterOption.TODAY: {
				filteredAppHistory = appHistory.filter((app) => app.dateStamp === formatConstantTimeInDate(new Date()));
				break;
			}
			case DateFilterOption.WEEK: {
				const { startDate: currentWeekStartDate, endDate: currentWeekEndDate } = getWeekRangeValues(0);
				filteredAppHistory = appHistory.filter((app) => isDateWithinRange(app.dateStamp, currentWeekStartDate, currentWeekEndDate));
				break;
			}
			case DateFilterOption.TWO_WEEK: {
				const { startDate: secondWeekStartDate } = getWeekRangeValues(1);
				const { endDate: currentWeekEndDate } = getWeekRangeValues(0);
				filteredAppHistory = appHistory.filter((app) => isDateWithinRange(app.dateStamp, secondWeekStartDate, currentWeekEndDate));
				break;
			}
			case DateFilterOption.THREE_WEEK: {
				const { startDate: thirdWeekStartDate } = getWeekRangeValues(2);
				const { endDate: currentWeekEndDate } = getWeekRangeValues(0);
				filteredAppHistory = appHistory.filter((app) => isDateWithinRange(app.dateStamp, thirdWeekStartDate, currentWeekEndDate));
				break;
			}
			default:
				filteredAppHistory = [...appHistory];
				break;
		}
		return filteredAppHistory;
	}

	/**
	 * Generates illustrated message for recent apps panel.
	 * @private
	 * @override
	 * @returns {sap.m.IllustratedMessage} Illustrated error message.
	 */
	protected generateIllustratedMessage() {
		const illustratedMessage = super.generateIllustratedMessage();
		//override the default description
		illustratedMessage.setDescription(this._i18nBundle.getText("noRecentAppsDescription"));
		return illustratedMessage;
	}
}
