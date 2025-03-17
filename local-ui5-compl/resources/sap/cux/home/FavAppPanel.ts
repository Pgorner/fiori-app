/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import Log from "sap/base/Log";
import GridContainer from "sap/f/GridContainer";
import GridContainerSettings from "sap/f/GridContainerSettings";
import Button from "sap/m/Button";
import ColorPalette, { ColorPalette$ColorSelectEvent } from "sap/m/ColorPalette";
import ColorPalettePopover from "sap/m/ColorPalettePopover";
import CustomListItem from "sap/m/CustomListItem";
import Dialog from "sap/m/Dialog";
import GenericTile from "sap/m/GenericTile";
import HBox from "sap/m/HBox";
import IllustratedMessage from "sap/m/IllustratedMessage";
import Input from "sap/m/Input";
import Label from "sap/m/Label";
import List from "sap/m/List";
import MessageBox from "sap/m/MessageBox";
import MessageStrip from "sap/m/MessageStrip";
import MessageToast from "sap/m/MessageToast";
import NavContainer from "sap/m/NavContainer";
import ObjectIdentifier from "sap/m/ObjectIdentifier";
import Page from "sap/m/Page";
import Popover from "sap/m/Popover";
import ScrollContainer from "sap/m/ScrollContainer";
import SearchField from "sap/m/SearchField";
import StandardListItem from "sap/m/StandardListItem";
import Text from "sap/m/Text";
import Title from "sap/m/Title";
import Toolbar from "sap/m/Toolbar";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import VBox from "sap/m/VBox";
import { ButtonType, ListType, PlacementType } from "sap/m/library";
import Event from "sap/ui/base/Event";
import { MetadataOptions } from "sap/ui/base/ManagedObject";
import Control from "sap/ui/core/Control";
import Element from "sap/ui/core/Element";
import EventBus from "sap/ui/core/EventBus";
import Icon from "sap/ui/core/Icon";
import DragDropInfo from "sap/ui/core/dnd/DragDropInfo";
import { DropInfo$DropEventParameters } from "sap/ui/core/dnd/DropInfo";
import { dnd } from "sap/ui/core/library";
import MessageType from "sap/ui/core/message/MessageType";
import Parameters from "sap/ui/core/theming/Parameters";
import SimpleForm from "sap/ui/layout/form/SimpleForm";
import { form } from "sap/ui/layout/library";
import Config from "sap/ushell/Config";
import Container from "sap/ushell/Container";
import MyHomeImport from "sap/ushell/components/pages/MyHomeImport";
import PageRuntime from "sap/ushell/components/pages/controller/PageRuntime.controller";
import Navigation from "sap/ushell/services/Navigation";
import Pages from "sap/ushell/services/Pages";
import App from "./App";
import AppsContainer from "./AppsContainer";
import { ActionsPopover } from "./BaseApp";
import BaseAppPersPanel from "./BaseAppPersPanel";
import BaseContainer from "./BaseContainer";
import Group, { Group$PressEvent } from "./Group";
import MenuItem from "./MenuItem";
import {
	IAppPersonalization,
	IAppPersonalizationConfig,
	ICustomVisualization,
	IDragDropInfo,
	ISection,
	ISectionAndVisualization,
	IUpdatePersonalizationConfig
} from "./interface/AppsInterface";
import { DEFAULT_BG_COLOR, END_USER_COLORS, MYHOME_PAGE_ID } from "./utils/Constants";
import DataFormatUtils from "./utils/DataFormatUtils";
import { attachKeyboardHandler } from "./utils/DragDropUtils";
import { addFESRId, addFESRSemanticStepName } from "./utils/FESRUtil";
const _showAddApps = () => {
	return (Config.last("/core/shell/enablePersonalization") || Config.last("/core/catalog/enabled")) as boolean;
};

/**
 *
 * Provides the FavAppPanel Class.
 *
 * @extends sap.cux.home.BaseAppPersPanel
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.121.0
 *
 * @private
 * @experimental
 * @hidden
 *
 * @alias sap.cux.home.FavAppPanel
 */
export default class FavAppPanel extends BaseAppPersPanel {
	private _selectedApps: App[] = [];
	private _selectedGroupColor: string | undefined;
	private _selectedGroupId: string | undefined;
	private _currentItem!: App | Group;
	private _cutApp: GenericTile | undefined;
	private oEventBus!: EventBus;
	private _importButton!: Button;
	private _createGroupMenuItem!: MenuItem;

	static readonly metadata: MetadataOptions = {
		library: "sap.cux.home",
		defaultAggregation: "apps",
		aggregations: {
			/**
			 * Apps aggregation for Favorite apps
			 */
			apps: { type: "sap.cux.home.App", singularName: "app", multiple: true, visibility: "hidden" },
			/**
			 * Group aggregation for Favorite apps
			 */
			groups: { type: "sap.cux.home.Group", singularName: "group", multiple: true, visibility: "hidden" }
		}
	};

	public init() {
		super.init();
		//Configure Header
		this.setProperty("key", "favApps");
		this.setProperty("title", this._i18nBundle.getText("favoritesTab"));
		this.setProperty("tooltip", this._i18nBundle.getText("favAppsInfo"));
		//Setup Action Buttons
		void this._createActionButtons();
		//Setup Menu Items
		this._createHeaderMenuItems();
		//add drag and drop config
		this._generateAppsWrapper()
			?.addDragDropConfig(
				new DragDropInfo(`${this.getId()}-dragDropInfo`, {
					sourceAggregation: "items",
					targetAggregation: "items",
					dropPosition: dnd.DropPosition.OnOrBetween,
					dropLayout: dnd.DropLayout.Horizontal,
					drop: (event) => {
						void this._onFavItemDrop(event);
					}
				})
			)
			.attachBrowserEvent("keydown", (event: KeyboardEvent) => {
				const disablenavigation = event.metaKey || event.ctrlKey;
				void attachKeyboardHandler(event, disablenavigation, (dragDropEvent: Event) => this._onFavItemDrop(dragDropEvent));
			})
			.attachBrowserEvent("keydown", (event: KeyboardEvent) => this._handleKeyboardMoveApp(event));

		this.oEventBus = EventBus.getInstance();
		// Subscribe to the event
		this.oEventBus.subscribe(
			"importChannel",
			"appsImport",
			(sChannelId?: string, sEventId?: string, oData?) => {
				const aSections = oData as ISectionAndVisualization[];

				aSections.forEach(async (oSection) => {
					await this.appManagerInstance.addSection({
						id: oSection.id,
						title: oSection.title,
						default: oSection.default,
						preset: oSection.preset,
						visualizations: oSection.visualizations
					});
				});
				this._importdone();
			},
			this
		);
		this.oEventBus.subscribe(
			"importChannel",
			"resetImported",
			() => {
				this.setImportButtonVisibility(true);
			},
			this
		);
		this.attachNavigated(() => {
			// if while navigating to different page, a group detail dialog was open, then while navigating back group detail dialog should be in open state.
			if (this._selectedGroupId) {
				void this._showGroupDetailDialog(this._selectedGroupId);
			}
		});

		document.addEventListener("click", (event) => this._resetCutElement(event));
		document.addEventListener("keydown", (event) => this._resetCutElement(event));
	}

	private _importdone() {
		const stateData = { status: true };
		this.oEventBus.publish("importChannel", "appsImported", stateData);
	}

	/**
	 * Fetch fav apps and set apps aggregation
	 * @private
	 */
	public async loadApps() {
		const favoriteVisualizations = await this.appManagerInstance.fetchFavVizs(true, false);
		//Create groups
		this.destroyAggregation("groups", true);
		const groupVisualizations = favoriteVisualizations
			.filter((visualization) => visualization.isSection)
			.map((groupVisualization) => {
				return {
					...groupVisualization,
					menuItems: this._getGroupActions(groupVisualization)
				};
			});
		const groups = this._generateGroups(groupVisualizations);
		this._setGroups(groups);

		//Create apps
		this.destroyAggregation("apps", true);
		const appVisualizations = favoriteVisualizations
			.filter((visualization) => !visualization.isSection)
			.map((appVisualization) => {
				return {
					...appVisualization,
					menuItems: this._getAppActions()
				};
			});
		const apps = this.generateApps(appVisualizations);
		this.setApps(apps);
		if (this._selectedGroupId) {
			void this._setGroupDetailDialogApps(this._selectedGroupId);
		}
		const container = this.getParent() as BaseContainer;
		container.toggleMenuListItem(this._createGroupMenuItem, this.getApps().length > 0);
	}

	/**
	 * Creates and returns group instances for given group objects
	 * @private
	 * @param {object[]} aGroupObject - Array of group object.
	 * @returns {sap.cux.home.Group[]} - Array of group instances
	 */
	private _generateGroups(groupVisualizations: ISectionAndVisualization[]): Group[] {
		return groupVisualizations.map((groupVisualization, index) => {
			const group = new Group(`${this.getId()}-group-${index}`, {
				title: groupVisualization.title,
				bgColor: groupVisualization.BGColor,
				status: groupVisualization.status,
				icon: groupVisualization.icon,
				number: groupVisualization.badge,
				groupId: groupVisualization.id,
				press: this._handleGroupPress.bind(this)
			});
			groupVisualization.menuItems?.forEach((oMenuItem) => {
				group.addAggregation("menuItems", oMenuItem);
			});
			return group;
		});
	}

	/**
	 * Add multiple groups in the groups aggregation.
	 * @private
	 * @param {sap.cux.home.Group[]} groups - Array of groups.
	 */
	private _setGroups(groups: Group[]) {
		groups.forEach((group) => {
			this.addAggregation("groups", group, true);
		});
	}

	/**
	 * Returns list of actions available for app
	 * @param {ssap.cux.home.Group} group - The group containing the app.
	 * @private
	 * @returns {sap.cux.home.MenuItem[]} - An array of menu items representing available actions for the app.
	 */
	private _getAppActions(group?: Group) {
		const groupId = group?.getGroupId();
		const isUngroupedApp = !groupId;
		const appActions = [];
		const selectColorMenuItem = new MenuItem("", {
			title: this._i18nBundle.getText("selectColor"),
			type: ListType.Navigation,
			press: this._openColorPopover.bind(this)
		});
		appActions.push(selectColorMenuItem);

		addFESRId(selectColorMenuItem, "changeColor");

		if (this._getAllowedMoveGroups(groupId)?.length >= 1) {
			const moveToMenuItem = new MenuItem("", {
				title: this._i18nBundle.getText("moveTo"),
				type: ListType.Navigation,
				press: (event) => this._openMoveToGroupPopover(event, group)
			});
			appActions.push(moveToMenuItem);
			addFESRId(moveToMenuItem, "moveToGroup");
		}
		if (isUngroupedApp) {
			const createGroupMenuItem = new MenuItem({
				title: this._i18nBundle.getText("createGroup"),
				press: (event: Event) => {
					const source = event.getSource<MenuItem>();
					const app = source.getParent() as App;
					this._selectedApps = [app];
					this._openCreateGroupDialog();
				}
			});
			appActions.push(createGroupMenuItem);
			addFESRId(createGroupMenuItem, "createGroupDialog");
		}
		const removeFromMyHomeMenuItem = new MenuItem({
			title: this._i18nBundle.getText("removeFromMyHome"),
			press: (event: Event) => {
				const source = event.getSource<MenuItem>();
				const app = source.getParent() as App;
				this._handleRemove(app, group);
			}
		});
		appActions.push(removeFromMyHomeMenuItem);
		addFESRId(removeFromMyHomeMenuItem, "removeFromMyHome");

		if (!isUngroupedApp) {
			const removeFromGroupMenuItem = new MenuItem({
				title: this._i18nBundle.getText("removeFromGroup"),
				press: (event: Event) => {
					const source = event.getSource<MenuItem>();
					const app = source.getParent() as App;
					void this._handleMoveToGroup(app, groupId);
				}
			});
			appActions.push(removeFromGroupMenuItem);
			addFESRId(removeFromGroupMenuItem, "ungroupApp");
		}

		return appActions;
	}

	/**
	 * Returns list of actions available for selected group
	 * @private
	 * @param {sap.cux.home.Group} group - Group
	 * @returns {sap.cux.home.MenuItem[]} - An array of menu items representing available actions for the group.
	 */
	private _getGroupActions(group: ISectionAndVisualization) {
		const renameGroupMenuItem = new MenuItem(`id-${group.id}-renameGroup`, {
			title: this._i18nBundle.getText("renameGroup"),
			press: this._onRenameGroup.bind(this)
		});
		addFESRId(renameGroupMenuItem, "renameGroup");
		const selectColorMenuItem = new MenuItem(`id-${group.id}-selectColor`, {
			title: this._i18nBundle.getText("selectColor"),
			type: ListType.Navigation,
			press: this._openColorPopover.bind(this)
		});
		addFESRId(selectColorMenuItem, "changeColor");
		const removeAllAppsMenuItem = new MenuItem(`id-${group.id}-removeAllApps`, {
			title: this._i18nBundle.getText("removeAllApps"),
			press: this._handleUngroupApps.bind(this, group)
		});
		addFESRId(removeAllAppsMenuItem, "removeAllApps");
		const groupActions = [renameGroupMenuItem, selectColorMenuItem, removeAllAppsMenuItem];
		if (!group.isPresetSection) {
			const deleteGroupMenuItem = new MenuItem(`id-${group.id}-delete`, {
				title: this._i18nBundle.getText("delete"),
				press: this._onDeleteGroup.bind(this)
			});
			addFESRId(deleteGroupMenuItem, "deleteGroup");
			groupActions.push(deleteGroupMenuItem);
		}
		return groupActions;
	}

	/**
	 * Creates actions buttons for panel.
	 * @private
	 */
	private async _createActionButtons() {
		if (!this._actionButtons) {
			this._actionButtons = [];
			if (_showAddApps()) {
				const addAppsBtn = new Button(`${this.getId()}-addAppsBtn`, {
					icon: "sap-icon://action",
					tooltip: this._i18nBundle.getText("addAppsTooltip"),
					text: this._i18nBundle.getText("addApps"),
					press: () => {
						void this.navigateToAppFinder();
					}
				});
				addFESRId(addAppsBtn, "addAppsBtn");
				this._actionButtons.push(addAppsBtn);
			}
		}
		this._actionButtons.forEach((actionButton) => {
			this.addAggregation("actionButtons", actionButton);
		});
		const isImportEnabled = await this._validateAppsMigration();
		if (isImportEnabled) {
			this._createImportButton();
		}
	}

	private _createImportButton(): Button {
		if (!this._importButton) {
			this._importButton = new Button(`${this.getId()}-importAppsBtn`, {
				tooltip: this._i18nBundle.getText("importAppsNow"),
				text: this._i18nBundle.getText("importAppsNow"),
				press: this._openImportAppsDialog.bind(this)
			});
			addFESRId(this._importButton, "importAppsDialog");
			this._actionButtons.push(this._importButton);
			this.insertAggregation("actionButtons", this._importButton, 0);
		}
		return this._importButton;
	}

	private setImportButtonVisibility(bVisible: boolean): void {
		this._createImportButton().setVisible(bVisible);
	}

	/**
	 * Creates menu items for panel header.
	 * @private
	 */
	private _createHeaderMenuItems() {
		if (!this._menuItems) {
			this._createGroupMenuItem = new MenuItem(`${this.getId()}-createGrpMenuBtn`, {
				title: this._i18nBundle.getText("createGroup"),
				icon: "sap-icon://add",
				press: () => this._openCreateGroupDialog()
			});
			this._menuItems = [this._createGroupMenuItem];
			if (_showAddApps()) {
				this._menuItems.push(
					new MenuItem(`${this.getId()}-addAppsMenuBtn`, {
						title: this._i18nBundle.getText("addApps"),
						icon: "sap-icon://action",
						press: () => {
							void this.navigateToAppFinder();
						}
					})
				);
			}
			this._menuItems.push(
				new MenuItem(`${this.getId()}-addInsightsMenuBtn`, {
					title: this._i18nBundle.getText("addFromInsights"),
					icon: "sap-icon://duplicate",
					press: () => {
						void this._handleAddFromInsights();
					}
				})
			);
			// Assign FESR IDs based on menu items
			addFESRId(this._createGroupMenuItem, "createGroupDialog");
			const addAppsMenuItem = this._menuItems.find((item) => item.getId() === `${this.getId()}-addAppsMenuBtn`);
			if (addAppsMenuItem) {
				addFESRId(addAppsMenuItem, "appsAppFinder");
			}
			const addInsightsMenuItem = this._menuItems.find((item) => item.getId() === `${this.getId()}-addInsightsMenuBtn`);
			if (addInsightsMenuItem) {
				addFESRId(addInsightsMenuItem, "staticTilesDialog");
			}
			this._menuItems.forEach((oMenuItem) => {
				this.addAggregation("menuItems", oMenuItem, true);
			});
		}
	}

	/**
	 * Retrieves drag and drop information from the given event.
	 * @private
	 * @param {Event<DropInfo$DropEventParameters>} event - The event containing drag and drop information.
	 * @returns {Promise<IDragDropInfo>} The drag and drop information.
	 */
	private async _getDragDropInfo(event: Event<DropInfo$DropEventParameters>, appGroupId?: string) {
		const dragTile = event.getParameter?.("draggedControl") as GenericTile,
			dropTile = event.getParameter?.("droppedControl") as GenericTile,
			dropPosition = event.getParameter?.("dropPosition"),
			dropControl = dragTile.getParent() as GridContainer,
			dragItemIndex = dropControl.indexOfItem(dragTile),
			dropItemIndex = dropControl.indexOfItem(dropTile),
			dragItem = this._getTileItem(dragTile, appGroupId),
			dropItem = this._getTileItem(dropTile, appGroupId);

		const dragDropInfo: IDragDropInfo = {
			dragItem: dragItem!,
			dropItem: dropItem!,
			dropPosition: dropPosition as dnd.RelativeDropPosition,
			dropControl,
			dragItemIndex,
			dropItemIndex
		};
		//adjust drap drop info
		if (dragItemIndex !== dropItemIndex) {
			if (!dragItem?.isA("sap.cux.home.Group") && !dropItem?.isA("sap.cux.home.Group")) {
				await this._adjustAppDragDropInfo(dragDropInfo, appGroupId);
			} else if (dragItem?.isA("sap.cux.home.Group")) {
				await this._adjustGroupDragDropInfo(dragDropInfo);
			}
		}
		return dragDropInfo;
	}

	/**
	 * Adjusts apps drag and drop information.
	 * @private
	 * @param {IDragDropInfo} dragDropInfo - The drag and drop information to adjust.
	 * @returns {Promise<void>} A Promise that resolves when the adjustment is completed.
	 */
	private async _adjustAppDragDropInfo(dragDropInfo: IDragDropInfo, appGroupId?: string) {
		let isUpdated = false;
		const dragApp = dragDropInfo.dragItem as App;
		const dropApp = dragDropInfo.dropItem as App;
		const [dragVisualization, dropVisualization] = await Promise.all([
			this.appManagerInstance.getVisualization(dragApp.getUrl(), appGroupId),
			this.appManagerInstance.getVisualization(dropApp.getUrl(), appGroupId)
		]);
		if (dragDropInfo.dropPosition === dnd.RelativeDropPosition.Before) {
			//let's say there are two apps a1, a2, if a1 is moved before a2, that essentailly means the drop item index is same as current item index, adjust the dropItemIndex accordingly
			if (dragDropInfo.dragItemIndex === dragDropInfo.dropItemIndex - 1) {
				dragDropInfo.dropItemIndex--;
			}
			if (
				dragDropInfo.dragItemIndex < dragDropInfo.dropItemIndex &&
				dragVisualization?.persConfig?.sectionIndex === dropVisualization?.persConfig?.sectionIndex
			) {
				dragDropInfo.dropItemIndex--;
				isUpdated = true;
			}
		} else if (dragDropInfo.dropPosition === dnd.RelativeDropPosition.After) {
			if (dragDropInfo.dragItemIndex === dragDropInfo.dropItemIndex + 1) {
				dragDropInfo.dropItemIndex++;
			}
			if (
				dragDropInfo.dragItemIndex > dragDropInfo.dropItemIndex &&
				dragVisualization?.persConfig?.sectionIndex === dropVisualization?.persConfig?.sectionIndex
			) {
				dragDropInfo.dropItemIndex++;
				isUpdated = true;
			}
		}

		if (isUpdated) {
			const tile = (dragDropInfo.dropControl as GridContainer).getItems()[dragDropInfo.dropItemIndex] as GenericTile;
			const app = this._getTileItem(tile, appGroupId);
			if (app) {
				dragDropInfo.dropItem = app;
			}
		}
	}

	private _getTileItem(tile: GenericTile, appGroupId?: string) {
		const tileGroupId = tile.data("groupId") as string | undefined;
		if (tileGroupId) {
			//tile is a group
			return this._getGroup(tileGroupId);
		} else {
			const group = appGroupId ? this._getGroup(appGroupId) : null;
			const apps = group ? group.getApps() : this.getApps();
			return apps.find((app) => DataFormatUtils.getLeanURL(app.getUrl()) === tile.getUrl());
		}
	}

	/**
	 * Adjusts app/group drag and drop information.
	 * @private
	 * @param {IDragDropInfo} dragDropInfo - The drag and drop information to adjust.
	 * @returns {Promise<void>} A Promise that resolves when the adjustment is completed.
	 */
	private async _adjustGroupDragDropInfo(dragDropInfo: IDragDropInfo) {
		const sections = await this.appManagerInstance._getSections();
		let dropGroupIndex;
		dragDropInfo.dragItemIndex = sections.findIndex((section) => section.id === (dragDropInfo.dragItem as Group).getGroupId());

		//If dropped app is the first ungrouped app, put the group at the end
		if (!dragDropInfo.dropItem.isA("sap.cux.home.Group")) {
			const lastGroupIndex = (this.getAggregation("groups") as Group[]).length;
			dragDropInfo.dropItemIndex =
				dragDropInfo.dropPosition === dnd.RelativeDropPosition.Before &&
				dragDropInfo.dropItemIndex === lastGroupIndex &&
				dragDropInfo.dragItemIndex !== lastGroupIndex
					? lastGroupIndex + 1
					: dragDropInfo.dragItemIndex;
		} else {
			dropGroupIndex = sections.findIndex((section) => section.id === (dragDropInfo.dropItem as Group).getGroupId());
			//update the drop item with section index
			dragDropInfo.dropItemIndex = dropGroupIndex;
		}

		//let's say there are two groups g1, g2, if g1 is moved before g2, that essentailly means the drop item index is same as current item index, adjust the dropItemIndex accordingly
		if (
			dragDropInfo.dropPosition === dnd.RelativeDropPosition.Before &&
			dragDropInfo.dragItemIndex === dragDropInfo.dropItemIndex - 1
		) {
			dragDropInfo.dropItemIndex--;
		} else if (
			dragDropInfo.dropPosition === dnd.RelativeDropPosition.After &&
			(dragDropInfo.dragItemIndex !== dragDropInfo.dropItemIndex || (dropGroupIndex && dragDropInfo.dropItemIndex >= dropGroupIndex))
		) {
			dragDropInfo.dropItemIndex++;
		}
	}

	/**
	 * Handler for drop event of a favorite item.
	 * @private
	 * @param {Event<DropInfo$DropEventParameters>} event - The drop event containing information about the dropped item.
	 * @returns {Promise<void>} A Promise that resolves when the drop event handling is completed.
	 */
	private async _onFavItemDrop(event: Event<DropInfo$DropEventParameters>, appGroupId?: string) {
		const dragTile = event.getParameter?.("draggedControl") as GenericTile;
		const dragDropInfo = await this._getDragDropInfo(event, appGroupId);
		const { dragItemIndex, dropItemIndex, dropPosition, dragItem, dropItem } = dragDropInfo;
		if (dragItemIndex === dropItemIndex) return;

		if (dropPosition === dnd.RelativeDropPosition.On) {
			await this._handleOnItemDrop(dragItem, dropItem);
			void this.refresh();
		} else if (dropPosition === dnd.RelativeDropPosition.After || dropPosition === dnd.RelativeDropPosition.Before) {
			this._setBusy(true);
			await this._handleItemsReorder(dragDropInfo, appGroupId);
			await this.refresh();

			if (appGroupId) {
				void this._setGroupDetailDialogApps(appGroupId);
			}
			this._setBusy(false);
		}

		dragTile.removeStyleClass("sapMGTPressActive");
	}

	/**
	 * Handles the drop of an item onto another item.
	 * If an app in dropped over another app, create group dialog is opened.
	 * If an app is dropped over a group, app should be moved inside that group.
	 * @private
	 * @param {Group | App} dragItem - The item being dragged.
	 * @param {Group | App} dropItem - The item onto which the dragItem is dropped.
	 * @returns {Promise<void>} A Promise that resolves when the dropping of the item is completed.
	 */
	private async _handleOnItemDrop(dragItem: Group | App, dropItem: Group | App) {
		if (dragItem.isA("sap.cux.home.Group")) return;

		if (!dropItem.isA("sap.cux.home.Group")) {
			//if both dragged and dropped items are apps, create group dialog is opened.
			const dragApp = dragItem as App;
			const dropApp = dropItem as App;
			this._selectedApps = [dragApp, dropApp];
			this._openCreateGroupDialog(true);
		} else {
			//if dragged item is an app and dropped item is a group, app should be moved into that group.
			const targetGroupId = (dropItem as Group).getGroupId();
			this._setBusy(true);
			await this._handleMoveToGroup(dragItem, undefined, targetGroupId);
			this._setBusy(false);
		}
	}

	/**
	 * Handles the reordering of items based on drag and drop information.
	 * @private
	 * @param {IDragDropInfo} dragDropInfo - The drag and drop information.
	 * @returns {Promise<void>} A Promise that resolves when the reordering is completed.
	 */
	private async _handleItemsReorder(dragDropInfo: IDragDropInfo, appGroupId?: string) {
		const { dragItem, dropItem, dragItemIndex, dropItemIndex } = dragDropInfo;
		const isDragItemGroup = dragItem.isA("sap.cux.home.Group");
		const isDropItemGroup = dropItem.isA("sap.cux.home.Group");
		if (!isDragItemGroup && !isDropItemGroup) {
			const drapApp = dragItem as App;
			const dropApp = dropItem as App;
			const [dragVisualization, dropVisualization] = await Promise.all([
				this.appManagerInstance.getVisualization(drapApp.getUrl(), appGroupId),
				this.appManagerInstance.getVisualization(dropApp.getUrl(), appGroupId)
			]);
			await this.appManagerInstance.moveVisualization({
				sourceSectionIndex: dragVisualization?.persConfig?.sectionIndex as number,
				sourceVisualizationIndex: dragVisualization?.persConfig?.visualizationIndex as number,
				targetSectionIndex: dropVisualization?.persConfig?.sectionIndex as number,
				targetVisualizationIndex: dropVisualization?.persConfig?.visualizationIndex as number
			});
		} else if (isDragItemGroup && isDropItemGroup) {
			await this.appManagerInstance.moveSection(dragItemIndex, dropItemIndex);
		}
	}

	/**
	 * Navigates to the App Finder with optional group Id.
	 * @async
	 * @private
	 * @param {string} [groupId] - Optional group Id
	 */
	private async navigateToAppFinder(groupId?: string) {
		const navigationService = await Container.getServiceAsync<Navigation>("Navigation");
		const navigationObject: { pageID: string; sectionID?: string } = {
			pageID: MYHOME_PAGE_ID
		};
		if (groupId) {
			navigationObject.sectionID = groupId;
		}
		await navigationService.navigate({
			target: {
				shellHash: `Shell-appfinder?&/catalog/${JSON.stringify(navigationObject)}`
			}
		});
	}

	/**
	 * Validates if import apps is enabled
	 *
	 *@returns {Promise} - resolves to boolean value (import is enabled/disabled)
	 */
	private async _validateAppsMigration() {
		const isImportEnabled = await MyHomeImport.isImportEnabled();
		return isImportEnabled;
	}

	private _openImportAppsDialog() {
		const pageRuntime = new PageRuntime();
		pageRuntime.onImportDialogPress();
	}

	/**
	 * Opens the create group dialog.
	 * @private
	 * @param {boolean} [skipAppsSelection=false] - Whether to skip the apps selection page.
	 */
	private _openCreateGroupDialog(skipAppsSelection = false) {
		const createGroupDialog = this._generateCreateGroupDialog(skipAppsSelection);
		const appsWrapper = this._controlMap.get(`${this.getId()}-createGroupDialog-appsPage-scrollContainer-apps`) as GridContainer;
		appsWrapper.destroyItems();
		const tiles = [...this.getApps()].map((app) => {
			const appCopy = app.clone();
			appCopy._onPress = (e) => this._highlightApp(e, appCopy); // override app press behaviour to highlight app
			return (this.getParent() as AppsContainer)._getAppTile(appCopy);
		});
		this._setAggregation(appsWrapper, tiles);
		let apps = this.getApps();
		(this.getParent() as AppsContainer).fireEvent("appsLoaded", { apps, tiles });
		this._updateSelectedAppCount();
		createGroupDialog.open();
	}

	/**
	 * Closes the create group dialog.
	 * @private
	 */
	private _closeCreateGroupDialog() {
		const createGroupDialog = this._generateCreateGroupDialog();
		createGroupDialog?.close();
		//reset create group dialog on close
		this._resetCreateGroupDialog();
	}

	/**
	 * Resets the state of the create group dialog.
	 * @private
	 */
	private _resetCreateGroupDialog() {
		const navContainer = this._generateCreateGroupNavContainer();
		const groupNameInput = this._controlMap.get(`${this.getId()}-createGroupDialog-mainPage-form-groupName-input`) as Input;
		const searchField = this._controlMap.get(`${this.getId()}-createGroupDialog-appsPage-search`) as SearchField;
		groupNameInput.setValue("");
		navContainer.to(navContainer.getInitialPage() as string);
		this._selectedApps = [];
		searchField.setValue("");
		this._setNoAppsSelectedError(false);
		this._selectedGroupColor = undefined;
	}

	/**
	 * Generates or retrieves the dialog for creating a group.
	 * @private
	 * @param {boolean} bSkipAppsSelection - Whether to skip the apps selection page.
	 * @returns {sap.m.Dialog} The generated dialog for creating a group.
	 */
	private _generateCreateGroupDialog(skipAppsSelection: boolean = true) {
		const id = `${this.getId()}-createGroupDialog`;
		const navContainer = this._generateCreateGroupNavContainer();
		const _toggleNavButton = (skipAppsSelection: boolean) => {
			const nextBtn = this._controlMap.get(`${id}-nextBtn`) as Button;
			const backBtn = this._controlMap.get(`${id}-backBtn`) as Button;
			const createBtn = this._controlMap.get(`${id}-createBtn`) as Button;
			const currentPageIndex = navContainer.indexOfPage(navContainer.getCurrentPage());
			nextBtn.setVisible(currentPageIndex !== navContainer.getPages().length - 1 && !skipAppsSelection);
			backBtn.setVisible(currentPageIndex !== 0 && !skipAppsSelection);
			createBtn.setVisible(currentPageIndex === navContainer.getPages().length - 1 || skipAppsSelection);
		};
		if (!this._controlMap.get(id)) {
			//set up navigation buttons
			this._controlMap.set(
				`${id}-nextBtn`,
				new Button({
					id: `${id}-nextBtn`,
					text: this._i18nBundle.getText("nextButton"),
					press: () => {
						if (this._validateGroupName()) {
							navContainer.to(this._generateCreateGroupAppsPage());
							_toggleNavButton(skipAppsSelection);
							this._highlightSelectedApps();
						}
					},
					type: "Emphasized"
				})
			);
			// Add FESR for next button
			const nextBtn = this._controlMap.get(`${id}-nextBtn`) as Button;
			addFESRSemanticStepName(nextBtn, "press", "createGroupNextBtn");
			this._controlMap.set(
				`${id}-backBtn`,
				new Button({
					id: `${id}-backBtn`,
					text: this._i18nBundle.getText("backButton"),
					press: () => {
						navContainer.back();
						_toggleNavButton(skipAppsSelection);
					}
				})
			);
			// Add FESR for back button
			const backBtn = this._controlMap.get(`${id}-backBtn`) as Button;
			addFESRSemanticStepName(backBtn, "press", "createGroupBackBtn");
			this._controlMap.set(
				`${id}-createBtn`,
				new Button({
					id: `${id}-createBtn`,
					text: this._i18nBundle.getText("createButton"),
					press: () => {
						void this._onPressGroupCreate();
					},
					type: "Emphasized"
				})
			);
			// Add FESR for create button
			const createBtn = this._controlMap.get(`${id}-createBtn`) as Button;
			addFESRSemanticStepName(createBtn, "press", "addCreateGroup");
			this._controlMap.set(
				id,
				new Dialog(id, {
					title: this._i18nBundle.getText("createGroup"),
					content: navContainer,
					escapeHandler: this._closeCreateGroupDialog.bind(this),
					contentHeight: "25rem",
					contentWidth: "41.75rem",
					buttons: [
						nextBtn,
						backBtn,
						createBtn,
						new Button({
							id: `${id}-cancelBtn`,
							text: this._i18nBundle.getText("cancelBtn"),
							press: this._closeCreateGroupDialog.bind(this)
						})
					]
				}).addStyleClass("sapCuxCreateGroupDialog sapContrastPlus")
			);
		}
		_toggleNavButton(skipAppsSelection);
		return this._controlMap.get(id) as Dialog;
	}

	/**
	 * Handles the highlighting of an app when selected.
	 * @private
	 * @param {sap.ui.base.Event} event - The event object.
	 * @param {Object} selectedApp - The selected app object.
	 */
	private _highlightApp(event: Event, selectedApp: App) {
		const oTile = event.getSource<GenericTile>(),
			bIsSelected = !oTile.hasStyleClass("sapCuxHighlightApp"),
			oScrollContainer = this._generateAppsScrollContainer();
		this._selectedApps = this._selectedApps || [];
		if (bIsSelected) {
			this._selectedApps.push(selectedApp);
		} else {
			this._selectedApps.splice(
				this._selectedApps.findIndex((oApp) => selectedApp.getUrl() === oApp.getUrl()),
				1
			);
		}
		this._updateSelectedAppCount();
		oTile.toggleStyleClass("sapCuxHighlightApp", bIsSelected);
		this._setNoAppsSelectedError(this._selectedApps.length < 1);
		//adjust scroll container height
		oScrollContainer.setHeight(this._selectedApps.length < 1 ? "15.3rem" : "17.5rem");
	}

	/**
	 * Generates the scroll container for displaying apps in the create group dialog.
	 * @private
	 * @returns {sap.m.ScrollContainer} The scroll container for displaying apps.
	 */
	private _generateAppsScrollContainer() {
		const id = `${this.getId()}-createGroupDialog-appsPage-scrollContainer`;
		if (!this._controlMap.get(id)) {
			this._controlMap.set(
				`${id}-apps`,
				new GridContainer({
					id: `${id}-apps`,
					layout: new GridContainerSettings({
						columnSize: "19rem",
						gap: "0.5rem"
					})
				}).addStyleClass("sapCuxAppsGridContainerPadding")
			);
			this._controlMap.set(
				id,
				new ScrollContainer(id, {
					id,
					vertical: true,
					visible: true,
					height: "17.5rem",
					content: [this._controlMap.get(`${id}-apps`) as GridContainer]
				}).addStyleClass("sapUiSmallMarginBeginEnd")
			);
		}
		return this._controlMap.get(id) as ScrollContainer;
	}

	/**
	 * Method for updating selected apps count in create group dialog
	 * @private
	 */
	private _updateSelectedAppCount() {
		const oAppsCountContol = this._controlMap.get(`${this.getId()}-createGroupDialog-appsPage-headerContainer-count`) as Text;
		oAppsCountContol.setText(
			this._i18nBundle.getText("selectedAppsCount", [this._selectedApps?.length || this._i18nBundle.getText("noAppSelected")])
		);
	}

	/**
	 * Creates or returns the navigation container for the create group dialog.
	 * @private
	 * @returns {sap.m.NavContainer} The navigation container for the create group dialog.
	 */
	private _generateCreateGroupNavContainer() {
		const id = `${this.getId()}-createGroupDialog-wrapper`;
		if (!this._controlMap.get(id)) {
			this._controlMap.set(
				id,
				new NavContainer(id, {
					initialPage: `${this.getId()}-createGroupDialog-mainPage`,
					pages: [this._generateCreateGroupMainPage(), this._generateCreateGroupAppsPage()]
				})
			);
		}
		return this._controlMap.get(id) as NavContainer;
	}

	/**
	 * Generates or retrieve the main page of the create group dialog.
	 * @private
	 * @returns {sap.m.Page} The main page of the create group dialog.
	 */
	private _generateCreateGroupMainPage() {
		const id = `${this.getId()}-createGroupDialog-mainPage`;
		if (!this._controlMap.get(id)) {
			this._controlMap.set(
				`${id}-form-groupName-input`,
				new Input({
					id: `${id}-form-groupName-input`,
					width: "13.75rem",
					required: true,
					liveChange: this._validateGroupName.bind(this)
				})
			);
			this._controlMap.set(
				id,
				new Page({
					id,
					showHeader: false,
					enableScrolling: false,
					backgroundDesign: "List",
					content: [
						new VBox({
							id: `${id}-headerContainer`,
							items: [
								new Title({
									id: `${id}-title`,
									text: this._i18nBundle.getText("settings")
								}),
								new Text({
									id: `${id}-description`,
									text: this._i18nBundle.getText("settingsDescription")
								})
							]
						}).addStyleClass("sapUiSmallMarginTop sapUiSmallMarginBeginEnd sapUiTinyMarginBottom"),
						new SimpleForm(`${id}-form`, {
							layout: form.SimpleFormLayout.ResponsiveGridLayout,
							labelSpanS: 4,
							labelSpanM: 4,
							content: [
								new Label({
									id: `${id}-form-groupName-label`,
									text: this._i18nBundle.getText("groupNameLbl")
								}).addStyleClass("sapUiTinyMarginTop"),
								this._controlMap.get(`${id}-form-groupName-input`) as Input,
								new Label({
									id: `${id}-form-groupColor-label`,
									text: this._i18nBundle.getText("groupColorLbl")
								}).addStyleClass("sapUiTinyMarginTop"),
								new ColorPalette(`${id}-form-groupColor-pallet`, {
									colors: END_USER_COLORS().map((oColor) => oColor.value) as string[],
									colorSelect: this._onColorSelect.bind(this)
								})
							]
						}).addStyleClass("sapUiMediumMarginTop")
					]
				})
			);
		}
		return this._controlMap.get(id) as Page;
	}

	/**
	 * Generates or retrieve the app selection page of the create group dialog.
	 * @private
	 * @returns {sap.m.Page} The app selection page of the create group dialog.
	 */
	private _generateCreateGroupAppsPage() {
		const id = `${this.getId()}-createGroupDialog-appsPage`;
		if (!this._controlMap.get(id)) {
			this._controlMap.set(
				`${id}-search`,
				new SearchField({
					id: `${id}-search`,
					liveChange: this._onCreateAppSearch.bind(this)
				}).addStyleClass("sapUiTinyMarginTopBottom")
			);
			this._controlMap.set(
				`${id}-errorMessageStrip`,
				new MessageStrip(`${id}-errorMessageStrip`, {
					id: `${id}-errorMessageStrip`,
					type: MessageType.Error,
					showIcon: true,
					text: this._i18nBundle.getText("selectionErrorMessage"),
					visible: false
				})
			);
			this._controlMap.set(
				`${id}-headerContainer-count`,
				new Text({
					id: `${id}-headerContainer-count`
				})
			);
			this._controlMap.set(
				id,
				new Page(id, {
					showHeader: false,
					backgroundDesign: "List",
					enableScrolling: false,
					content: [
						new VBox(`${id}-headerContainer`, {
							items: [
								new HBox(`${id}-headerContainer-titleCount`, {
									id: `${id}-headerContainer-titleCount`,
									items: [
										new Title({
											id: `${id}-headerContainer-title`,
											text: this._i18nBundle.getText("selectedAppsTitle")
										}).addStyleClass("sapUiTinyMarginEnd"),
										this._controlMap.get(`${id}-headerContainer-count`) as Text
									]
								}),
								new Text({
									id: `${id}-description`,
									text: this._i18nBundle.getText("appsSelectionDescription")
								}).addStyleClass("sapUiTinyMarginBottom"),
								this._controlMap.get(`${id}-search`) as SearchField,
								this._controlMap.get(`${id}-errorMessageStrip`) as MessageStrip
							]
						}).addStyleClass("sapUiSmallMarginTop sapUiSmallMarginBeginEnd sapUiTinyMarginBottom"),
						this._generateAppsScrollContainer(),
						this._generateCreateGroupErrorMsg()
					]
				})
			);
		}
		return this._controlMap.get(id) as Page;
	}

	/**
	 * Generates the error message for create group dialog, when no apps are found for searched text.
	 * @private
	 * @returns {sap.m.IllustratedMessage} The error message for no filtered apps.
	 */
	private _generateCreateGroupErrorMsg() {
		const id = `${this.getId()}-createGroupDialog-appsPage-noFilterApps`;
		if (!this._controlMap.get(id)) {
			this._controlMap.set(
				id,
				new IllustratedMessage({
					id,
					illustrationSize: "Spot",
					illustrationType: "sapIllus-SearchFolder",
					title: this._i18nBundle.getText("noSearchedAppTitle"),
					description: this._i18nBundle.getText("noSearchedAppDes"),
					visible: false
				})
			);
		}
		return this._controlMap.get(id) as IllustratedMessage;
	}

	/**
	 * Handles the color selection event for new group.
	 * @private
	 * @param {sap.ui.base.Event} event - The event object.
	 */
	private _onColorSelect(event: ColorPalette$ColorSelectEvent) {
		this._selectedGroupColor = this._getLegendColor(event.getParameter("value") as string).key;
	}

	/**
	 * Retrieves the key of the legend color based on the provided color value.
	 * @param {string} color - The color value for which to retrieve the legend color key.
	 * @returns {string} The legend color key corresponding to the provided color value, or the default background color key if not found.
	 * @private
	 */
	private _getLegendColor(color: string) {
		return END_USER_COLORS().find((oColor) => oColor.value === color) || DEFAULT_BG_COLOR();
	}

	/**
	 * Sets the visibility of the error message strip indicating no apps are selected in create group dialog.
	 * @private
	 * @param {boolean} error - Whether to show the error message strip (true) or hide it (false).
	 */
	private _setNoAppsSelectedError(error: boolean) {
		const messageStrip = this._controlMap.get(`${this.getId()}-createGroupDialog-appsPage-errorMessageStrip`) as MessageStrip;
		messageStrip.setVisible(error);
	}

	/**
	 * Validates the group name entered in the create group dialog.
	 * @private
	 * @returns {boolean} Whether the group name is valid (true) or not (false).
	 */
	private _validateGroupName() {
		const groupNameInput = this._controlMap.get(`${this.getId()}-createGroupDialog-mainPage-form-groupName-input`) as Input;
		const groupName = groupNameInput.getValue().trim();
		//update value state
		groupNameInput.setValueState(groupName ? "None" : "Error");
		groupNameInput.setValueStateText(groupName ? "" : (this._i18nBundle.getText("invalidGroupName") as string));
		return groupName ? true : false;
	}

	/**
	 * Highlights selected apps by adding a CSS class to corresponding tiles.
	 * @private
	 */
	private _highlightSelectedApps() {
		const selectedApps = this._selectedApps || [];
		const tilesContainer = this._controlMap.get(`${this.getId()}-createGroupDialog-appsPage-scrollContainer-apps`) as GridContainer;
		const tiles = (tilesContainer.getItems() || []) as GenericTile[];
		tiles.forEach((tile) => {
			tile.toggleStyleClass(
				"sapCuxHighlightApp",
				selectedApps.some((app) => DataFormatUtils.getLeanURL(app.getUrl()) === tile.getUrl())
			);
		});
	}

	/**
	 * Handles the search for apps in create group dialog.
	 * @private
	 * @param {sap.ui.base.Event} event - The event object.
	 */
	private _onCreateAppSearch(event: Event) {
		const tilesContainer = this._controlMap.get(`${this.getId()}-createGroupDialog-appsPage-scrollContainer-apps`) as GridContainer,
			searchQuery = event.getSource<SearchField>().getValue(),
			tiles = (tilesContainer.getItems() || []) as GenericTile[],
			searchExpression = new RegExp(searchQuery, "i");
		tiles.forEach((tile) => {
			tile.setVisible(searchExpression.test(tile.getHeader()));
		});
		const filteredTiles = tiles.filter((tile) => tile.getVisible());
		const hasFilteredApps = filteredTiles.length > 0;
		this._generateAppsScrollContainer()?.setVisible(hasFilteredApps);
		this._generateCreateGroupErrorMsg()?.setVisible(!hasFilteredApps);
	}

	/**
	 * Handles the event when the user presses the button to create a new group.
	 * @private
	 */
	private async _onPressGroupCreate() {
		const groupNameInput = this._controlMap.get(`${this.getId()}-createGroupDialog-mainPage-form-groupName-input`) as Input;
		if (this._validateGroupName()) {
			if (this._selectedApps?.length) {
				this._setBusy(true);
				await this._createGroup({
					selectedApps: this._selectedApps,
					groupName: groupNameInput.getValue(),
					groupColor: this._getGroupColor()
				});
				await this.refresh();
				this._setBusy(false);
				this._closeCreateGroupDialog();
				// Show toast message after successful group creation
				MessageToast.show(this._i18nBundle.getText("newGroupCreated") as string, {
					of: this._controlMap.get(`${this.getId()}-createGroupDialog`),
					offset: "0 80"
				});
				const groups = (this.getAggregation("groups") || []) as Group[];
				void this._showGroupDetailDialog(groups[0]?.getGroupId());
			} else {
				this._setNoAppsSelectedError(true);
			}
		}
	}

	/**
	 * Creates a new group with the given properties and adds selected apps to it.
	 * @param {Object} params - The properties for creating the group.
	 * @param {sap.ui.core.URI[]} params.selectedApps - Target URL unique identifier of the selected apps to be added to the group.
	 * @param {string} [params.groupName] - The name of the group. If not provided, a default name will be used.
	 * @param {string} [params.groupColor] - The color of the group. If not provided, the default color will be used.
	 * @private
	 */
	private async _createGroup(params: { selectedApps: App[]; groupName: string; groupColor: string }) {
		const { selectedApps, groupName, groupColor } = params;
		const sectionVisualizations = await this.appManagerInstance.getSectionVisualizations();
		const visualizations = selectedApps.reduce((selectedVisualizations: ICustomVisualization[], oApp) => {
			const sectionVisualization = sectionVisualizations.find((oSectionViz) => oSectionViz.url === oApp.getUrl());
			if (sectionVisualization) {
				selectedVisualizations.push(sectionVisualization);
			}
			return selectedVisualizations;
		}, []);
		const sectionId = visualizations[0].persConfig!.sectionId!;
		await this.appManagerInstance.addSection({
			sectionIndex: 1,
			sectionProperties: {
				title: groupName || this._i18nBundle.getText("newGroup"),
				visible: true,
				visualizations: visualizations.map((viz) => viz.visualization)
			}
		});

		const visualizationsToBeDeleted: string[] = visualizations.reduce((visualizationsToBeDeleted: string[], oViz) => {
			if (oViz.visualization?.id) {
				const duplicateVisualizationIds = (oViz.persConfig?.duplicateApps || []).map((oViz) => oViz.visualization?.id) as string[];
				visualizationsToBeDeleted = visualizationsToBeDeleted.concat([oViz.visualization?.id], duplicateVisualizationIds);
			}
			return visualizationsToBeDeleted;
		}, []);

		await this.appManagerInstance.removeVisualizations({ sectionId, vizIds: visualizationsToBeDeleted });
		const sections = await this.appManagerInstance._getSections(true);
		const defaultSection = sections.find((oSection) => oSection.default);
		const targetGroupId = sections[defaultSection ? 1 : 0]?.id;
		//update personalization
		await this._updateAppPersonalization(
			visualizations.map((oViz) => {
				return {
					visualization: oViz,
					targetGroupId
				};
			})
		);
		await this._updateGroupPersonalization(targetGroupId!, groupColor);
	}

	/**
	 * Retrieves the color for the group.
	 * @private
	 * @returns {string} The color for the group.
	 */
	private _getGroupColor() {
		const defaultColor = DEFAULT_BG_COLOR().key;
		const firstApp = this._selectedApps[0];
		const setDefaultColor = this._selectedApps.some((app) => app.getBgColor() !== firstApp.getBgColor());
		//if group color is selected then apply that color, else if all the selected apps have same color then give the same color to group, else apply default color.
		return this._selectedGroupColor || (setDefaultColor ? defaultColor : firstApp.getBgColor());
	}

	/**
	 * Opens a color popover for selecting a background color for an item.
	 * @param {sap.ui.base.Event} event - The event object.
	 * @private
	 */
	private _openColorPopover(event: Event<{ listItem?: StandardListItem }>) {
		const colorPopoverId = `${this.getId()}-colorPopover`,
			colors = END_USER_COLORS().map((oColor) => oColor.value) as string[];
		const source = event.getSource<MenuItem>();
		this._currentItem = source.getParent() as App | Group;
		let colorPopover = this._controlMap.get(colorPopoverId) as ColorPalettePopover;
		if (!colorPopover) {
			colorPopover = new ColorPalettePopover(colorPopoverId, {
				id: colorPopoverId,
				colors: colors,
				showDefaultColorButton: false,
				showMoreColorsButton: false,
				showRecentColorsSection: false,
				colorSelect: (event: ColorPalette$ColorSelectEvent) => {
					ActionsPopover._closeActionsPopover();
					const selectedColor = event.getParameter("value") as string;
					void this._handleColorSelect(this._currentItem, selectedColor);
				}
			}).addStyleClass("sapContrastPlus");
			(colorPopover as ColorPalettePopover & { _oPopover: Popover })._oPopover.setPlacement(PlacementType.HorizontalPreferredRight);
			this._controlMap.set(colorPopoverId, colorPopover);
		}
		colorPopover.openBy(event.getParameter("listItem") as Control);
	}

	/**
	 * Handles the selection of a color for an app or group.
	 * @param {sap.cux.home.App | sap.cux.home.Group} item - The item control.
	 * @param {string} color - The selected color.
	 * @returns {Promise<void>} - A promise that resolves when the color selection is handled.
	 * @private
	 */
	private async _handleColorSelect(item: App | Group, color: string) {
		const selectedColor = this._getLegendColor(color).key;
		item.setProperty("bgColor", selectedColor, true);
		const groupId = item.isA("sap.cux.home.Group") ? (item as Group).getGroupId() : null;
		const isGroupedApp = !groupId && item.getParent()?.isA("sap.cux.home.Group");

		//update tile color
		if (isGroupedApp) {
			this._refreshGroupDetailDialog(item as App, false);
		} else {
			//if ungroup app or group
			this._applyUngroupedTileColor(item, color);
		}

		//update personalization
		if (groupId) {
			//if group
			void this._updateGroupPersonalization(groupId, selectedColor);
			const groupIconControl = this._controlMap.get(`${this.getId()}-detailDialog-toolbar-color`) as Icon;
			groupIconControl?.setColor(color);
		} else {
			//if app
			const app = item as App;
			const groupId = isGroupedApp ? (app.getParent() as Group).getGroupId() : undefined;
			const visualization = await this.appManagerInstance.getVisualization(app.getUrl(), groupId);
			if (visualization) {
				void this._updateAppPersonalization([{ visualization, color: selectedColor }]);
			}
		}
	}

	/**
	 * Applies the selected color to an ungrouped tile.
	 * @param {sap.cux.home.App | sap.cux.home.Group} item - The item control.
	 * @param {string} color - The selected color.
	 * @private
	 */
	private _applyUngroupedTileColor(item: App | Group, color: string) {
		const tiles: GenericTile[] = this.fetchTileVisualization();
		const groupId = item.isA("sap.cux.home.Group") ? (item as Group).getGroupId() : null;
		const updatedTileIndex = tiles.findIndex((tile) =>
			groupId ? tile.data("groupId") === groupId : tile.getUrl() === DataFormatUtils.getLeanURL((item as App).getUrl())
		);
		tiles[updatedTileIndex].setBackgroundColor(color);
	}

	/**
	 * Retrieves the list of groups where apps can be moved, excluding the source group if specified.
	 * @param {string|null} sourceGroupId - The ID of the source group from which apps are being moved.
	 * @returns {sap.cux.home.Group[]} An array of groups where apps can be moved.
	 * @private
	 */
	private _getAllowedMoveGroups(sourceGroupId: string | undefined) {
		let allowedMoveGroups = (this.getAggregation("groups") || []) as Group[];
		if (sourceGroupId) {
			allowedMoveGroups = allowedMoveGroups.filter((allowedMoveGroup) => allowedMoveGroup.getGroupId() !== sourceGroupId);
		}
		return allowedMoveGroups;
	}

	/**
	 * Sets the busy state for dialogs and the panel.
	 * @param {boolean} busy - Indicates whether the dialogs and the panel should be set to busy state.
	 * @private
	 */
	private _setBusy(busy: boolean) {
		[this._generateGroupDetailDialog(), this._generateCreateGroupDialog(), this._generateAddFromInsightsDialog()].forEach(
			(oControl) => {
				oControl.setBusy(busy);
			}
		);
		super.setBusy(busy);
	}

	/**
	 * Opens a popover to move the app to another group.
	 * @param {sap.cux.home.Group} sourceGroup - The source group from which the app is being moved.
	 * @param {sap.ui.base.Event} event - The event triggering the popover opening.
	 * @private
	 */
	private _openMoveToGroupPopover(event: Event<{ listItem?: StandardListItem }>, sourceGroup?: Group) {
		const popoverId = `${this.getId()}-moveToGroupPopover`,
			source = event?.getSource<MenuItem>(),
			app = source?.getParent() as App,
			sourceGroupId = sourceGroup?.getGroupId();

		let list = this._controlMap.get(`${popoverId}-list`) as List,
			moveToGroupPopover = this._controlMap.get(popoverId) as Popover;

		if (!moveToGroupPopover) {
			list = new List({
				id: `${popoverId}-list`,
				itemPress: () => ActionsPopover._closeActionsPopover()
			});
			this._controlMap.set(`${popoverId}-list`, list);
			moveToGroupPopover = new Popover({
				id: popoverId,
				showHeader: false,
				placement: PlacementType.HorizontalPreferredRight,
				content: [list]
			}).addStyleClass("sapContrastPlus");
			this._controlMap.set(popoverId, moveToGroupPopover);
		}
		list.removeAllItems();

		this._getAllowedMoveGroups(sourceGroupId).forEach((targetGroup) =>
			list.addItem(
				new StandardListItem({
					title: targetGroup.getTitle(),
					type: "Active",
					press: () => {
						void this._handleMoveToGroup(app, sourceGroupId, targetGroup.getGroupId());
					}
				})
			)
		);

		moveToGroupPopover.openBy(event.getParameter("listItem") as Control);
	}

	/**
	 * Handles the removal of an app, displaying a confirmation dialog to the user.
	 * If the app is the last one in the group, a warning dialog is displayed for confirmation.
	 * @param {sap.cux.home.App} app - The app to be removed.
	 * @param {sap.cux.home.Group} [group] - The group from which the app should be removed. If not provided, the app is considered to be in favorites.
	 * @private
	 */
	private _handleRemove(app: App, group?: Group): void {
		const lastAppInGroup = group?.getApps()?.length === 1;

		let message = this._i18nBundle.getText("removeAppMessage", [app.getTitle()]),
			title = this._i18nBundle.getText("remove"),
			actionText = this._i18nBundle.getText("remove"),
			messageIcon = MessageBox.Icon.QUESTION;

		if (lastAppInGroup) {
			message = this._i18nBundle.getText("removeFromMyHomeMessage", [app.getTitle()]);
			title = this._i18nBundle.getText("delete");
			actionText = this._i18nBundle.getText("delete");
			messageIcon = MessageBox.Icon.WARNING;
		}

		MessageBox.show(message as string, {
			icon: messageIcon,
			title: title,
			actions: [actionText as string, MessageBox.Action.CANCEL],
			emphasizedAction: actionText,
			onClose: async (action: string) => {
				if (action === actionText) {
					this._setBusy(true);
					await this._removeApp(app, group);
					if (lastAppInGroup) {
						this._closeGroupDetailDialog();
					}
					if (group) {
						this._refreshGroupDetailDialog(app);
					}
					await (this.getParent() as AppsContainer)._refreshAllPanels();
					MessageToast.show(this._i18nBundle.getText("appRemoved") as string);
					this._setBusy(false);
				}
			}
		});
	}

	/**
	 * Removes the specified app from the group or favorites.
	 * If the app is the last one in the group, the group will be deleted as well.
	 * If the app is an ungrouped app, its duplicate apps (if any) will also be deleted.
	 * @param {App} app - The app to be removed.
	 * @param {Group} [group] - The group from which the app should be removed. If not provided, the app is considered to be in favorites.
	 * @returns {Promise<void>}
	 * @private
	 */
	private async _removeApp(app: App, group?: Group) {
		const lastAppInGroup = group?.getApps()?.length === 1,
			groupId = group?.getGroupId(),
			appId = app.getUrl(),
			viz = await this.appManagerInstance.getVisualization(appId, groupId);
		if (lastAppInGroup) {
			//if last app in group, then delete the group as well
			await this._deleteGroup(groupId!);
		} else {
			let visualizationsToBeDeleted = [viz?.visualization?.id];
			if (!groupId) {
				//for apps outside group i.e. for favorite apps delete duplicate apps as well
				visualizationsToBeDeleted = visualizationsToBeDeleted.concat(
					viz?.persConfig?.duplicateApps?.map((viz) => viz.visualization?.id)
				);
			}
			if (viz?.persConfig?.sectionId && visualizationsToBeDeleted.length > 0) {
				await this.appManagerInstance.removeVisualizations({
					sectionId: viz.persConfig.sectionId,
					vizIds: visualizationsToBeDeleted as string[]
				});
				void this._deletePersonalization({
					appId: appId,
					oldAppId: viz?.oldAppId,
					sectionId: viz?.persConfig?.sectionId,
					isRecentlyAddedApp: viz?.persConfig?.isDefaultSection
				});
			}
		}
	}

	/**
	 * Handler for moving an app from a source group to a target group.
	 * @param {sap.cux.home.App} app - The app to be moved.
	 * @param {string} sourceGroupId - The ID of the source group from which the app is being moved.
	 * @param {string | null} targetGroupId - The ID of the target group to which the app will be moved.
	 * @private
	 */
	private async _handleMoveToGroup(app: App, sourceGroupId?: string, targetGroupId?: string) {
		const sourceGroup = sourceGroupId ? this._getGroup(sourceGroupId) : undefined,
			isLastAppInGroup = sourceGroup?.getApps()?.length === 1;

		if (isLastAppInGroup) {
			const confirmationMessage = this._i18nBundle.getText("moveAppMessage", [app.getTitle()]) as string;
			const confirmationTitle = this._i18nBundle.getText("delete") as string;
			MessageBox.show(confirmationMessage, {
				icon: MessageBox.Icon.WARNING,
				title: confirmationTitle,
				actions: [confirmationTitle, MessageBox.Action.CANCEL],
				emphasizedAction: confirmationTitle,
				onClose: (action: string) => {
					if (action === confirmationTitle) {
						void this._moveAppAndHandleGroupChanges(app, sourceGroupId, targetGroupId);
					}
				}
			});
		} else {
			await this._moveAppAndHandleGroupChanges(app, sourceGroupId, targetGroupId);
		}
	}

	/**
	 * Moves an app to a different group and handles group changes.
	 * @param {App} app - The app to be moved.
	 * @param {string} [sourceGroupId] - The ID of the source group from which the app is being moved.
	 * @param {string} [targetGroupId] - The ID of the target group to which the app is being moved.
	 * @returns {Promise<void>} - A Promise that resolves once the app is moved and group changes are handled.
	 * @private
	 */
	private async _moveAppAndHandleGroupChanges(app: App, sourceGroupId?: string, targetGroupId?: string) {
		const sourceGroup = sourceGroupId ? this._getGroup(sourceGroupId) : null,
			targetGroup = targetGroupId ? this._getGroup(targetGroupId) : null,
			sTargetGroupTile = targetGroup?.getTitle(),
			isLastAppInGroup = sourceGroup?.getApps()?.length === 1;
		try {
			this._setBusy(true);
			await this._moveAppToGroup(app, sourceGroupId, targetGroupId);
			//delete group, if it is the last app in the group
			if (isLastAppInGroup && sourceGroupId) {
				await this._deleteGroup(sourceGroupId);
				this._closeGroupDetailDialog();
			}
			if (sourceGroupId) {
				this._refreshGroupDetailDialog(app);
			}
			const sMsg = sTargetGroupTile
				? this._i18nBundle.getText("appMoved", [sTargetGroupTile])
				: this._i18nBundle.getText("appUngrouped");
			MessageToast.show(sMsg as string);
			await this.refresh();
		} catch (error) {
			Log.error(error as string);
		} finally {
			this._setBusy(false);
		}
	}

	/**
	 * Refreshes the group detail dialog.
	 * @param {sap.cux.home.App} updatedApp - The updated app control.
	 * @param {boolean} [isRemove=true] - A flag indicating whether to remove the app. Defaults to true.
	 * @private
	 */
	private _refreshGroupDetailDialog(updatedApp: App, isRemove = true) {
		const appsWrapper = this._controlMap.get(`${this.getId()}-detailDialog-apps`) as GridContainer;
		const tiles = appsWrapper.getItems() as GenericTile[];
		const group = updatedApp.getParent() as Group;
		const groupApps = group.getApps();
		if (isRemove) {
			const updatedAppIndex = groupApps.findIndex((groupApp) => groupApp.getUrl() === updatedApp.getUrl());
			groupApps[updatedAppIndex].destroy(true);
			tiles[updatedAppIndex].destroy(true);
		} else {
			//update app color, along with duplicate apps, if any
			groupApps.forEach((groupApp, index) => {
				if (groupApp.getUrl() === updatedApp.getUrl()) {
					groupApp.setProperty("bgColor", updatedApp.getBgColor(), true);
					tiles[index].setBackgroundColor(updatedApp.getBgColor());
				}
			});
		}
	}

	/**
	 * Moves an app from a source group to a target group.
	 * @param {sap.cux.home.App} app - The app to be moved.
	 * @param {string} sourceGroupId - The ID of the source group from which the app is being moved.
	 * @param {string} targetGroupId - The ID of the target group to which the app will be moved. If null, the default section is considered.
	 * @private
	 */
	private async _moveAppToGroup(app: App, sourceGroupId?: string, targetGroupId?: string) {
		const appId = app.getUrl();
		const [visualizations, sections] = await Promise.all([
				this.appManagerInstance.getSectionVisualizations(sourceGroupId),
				this.appManagerInstance._getSections()
			]),
			sourceVisualization = visualizations.find((oViz) => oViz.url === appId),
			sourceVisualizationIndex = sourceVisualization?.persConfig?.visualizationIndex ?? -1,
			sourceSectionIndex = sourceVisualization?.persConfig?.sectionIndex as number;
		const isTargetGroupDefault = !targetGroupId; //if group id is not passed, then we consider it as default section
		const isSourceGroupDefault = !sourceGroupId;
		const targetSectionIndex = sections.findIndex((section) => (!targetGroupId ? section.default : section.id === targetGroupId));
		const visualization = sourceVisualizationIndex > -1 ? visualizations[sourceVisualizationIndex] : null;

		if (visualization !== null) {
			if (isTargetGroupDefault) {
				await this._moveAppToDefaultGroup(visualization);
			} else {
				if (isSourceGroupDefault) {
					//remove duplicate apps
					await this._removeDuplicateVisualizations(visualization);
				}
				await this.appManagerInstance.moveVisualization({
					sourceSectionIndex: sourceSectionIndex,
					sourceVisualizationIndex: sourceVisualizationIndex,
					targetSectionIndex: targetSectionIndex,
					targetVisualizationIndex: -1
				});
			}
			const sections = await this.appManagerInstance._getSections(true);
			const defaultSection = sections.find((oSection) => oSection.default);
			await this._updateAppPersonalization([
				{
					visualization: visualization,
					targetGroupId: targetGroupId ?? defaultSection?.id,
					isTargetGroupDefault
				}
			]);
		}
	}

	/**
	 * Moves a visualization to the default group.
	 * @param {ICustomVisualization} visualization - The visualization to be moved to the default group.
	 * @returns {Promise<void>} - A promise that resolves once the visualization is moved to the default group.
	 * @private
	 */
	private async _moveAppToDefaultGroup(visualization: ICustomVisualization) {
		await this._addVisualization(visualization);
		if (visualization.persConfig?.sectionId && visualization.visualization?.id) {
			await this.appManagerInstance.removeVisualizations({
				sectionId: visualization.persConfig?.sectionId,
				vizIds: [visualization.visualization?.id]
			});
		}
	}

	/**
	 * Removes duplicate visualizations associated with a specific visualization.
	 * @param {ICustomVisualization} visualization - The visualization for which duplicate visualizations should be removed.
	 * @returns {Promise<void>} - A promise that resolves once duplicate visualizations are removed.
	 * @private
	 */
	private async _removeDuplicateVisualizations(visualization: ICustomVisualization) {
		const vizIdsToBeDeleted = (visualization?.persConfig?.duplicateApps?.map((oViz) => oViz.visualization?.id) || []) as string[];
		if (visualization.persConfig?.sectionId && vizIdsToBeDeleted.length > 0) {
			await this.appManagerInstance.removeVisualizations({
				sectionId: visualization.persConfig?.sectionId,
				vizIds: vizIdsToBeDeleted
			});
		}
	}

	/**
	 * Handles the event for renaming a group.
	 * Opens the group detail dialog in edit mode.
	 * @private
	 * @param {sap.ui.base.Event} event - The event object.
	 */
	private _onRenameGroup(event: Event) {
		const group = event.getSource<MenuItem>()?.getParent() as Group;
		void this._showGroupDetailDialog(group.getGroupId(), true);
	}

	/**
	 * Event Handler for ungroup apps, shows confirmation dialog, ungroups the apps on confirmation
	 * @param {sap.cux.home.Group} group - The group from which the apps will be ungrouped.
	 * @private
	 */
	private _handleUngroupApps(group: ISectionAndVisualization) {
		const message = this._i18nBundle.getText("ungroupAppsMessage", [group.title]) as string,
			title = this._i18nBundle.getText("delete") as string,
			actionText = this._i18nBundle.getText("delete") as string;
		MessageBox.show(message, {
			icon: MessageBox.Icon.WARNING,
			title: title,
			actions: [actionText, MessageBox.Action.CANCEL],
			emphasizedAction: actionText,
			onClose: (action: string) => {
				if (action === actionText) {
					void this._ungroupApps(group.id!);
				}
			}
		});
	}

	/**
	 * Handles the event for deleting a group.
	 * Shows confirmation dialog to either delete the group and apps, or move the apps in favorites.
	 * @private
	 * @param {sap.ui.base.Event} event - The event object.
	 */
	private _onDeleteGroup(event: Event) {
		const group = event.getSource<MenuItem>()?.getParent() as Group,
			message = this._i18nBundle.getText("deleteGroupMessage", [group.getTitle()]) as string,
			title = this._i18nBundle.getText("delete") as string,
			deleteAction = this._i18nBundle.getText("delete") as string,
			moveAppAction = this._i18nBundle.getText("moveApps") as string;
		MessageBox.show(message, {
			icon: MessageBox.Icon.WARNING,
			title: title,
			actions: [deleteAction, this._i18nBundle.getText("moveApps") as string, MessageBox.Action.CANCEL],
			emphasizedAction: deleteAction,
			onClose: async (action: string) => {
				if (action === deleteAction) {
					this._setBusy(true);
					await this._deleteGroup(group.getGroupId());
					MessageToast.show(this._i18nBundle.getText("groupDeleted") as string);
					void this.refresh();
					this._closeGroupDetailDialog();
					this._setBusy(false);
				} else if (action === moveAppAction) {
					void this._ungroupApps(group.getGroupId());
				}
			}
		});
	}

	/**
	 * Ungroups apps from the specified group Id.
	 * @async
	 * @private
	 * @param {string} groupId - The Id of the group from which apps will be ungrouped.
	 * @returns {Promise<void>} - A Promise that resolves once the ungrouping process is complete.
	 */
	private async _ungroupApps(groupId: string) {
		this._setBusy(true);
		const visualizations = await this.appManagerInstance.getSectionVisualizations(groupId);
		const sections = await this.appManagerInstance._getSections();
		const section = sections.find((oSection) => oSection.id === groupId);
		await Promise.all(visualizations.map((oViz) => this._addVisualization(oViz)));
		const updatedSections = await this.appManagerInstance._getSections(true);
		const defaultSection = updatedSections.find((oSection) => oSection.default);
		//update personalization
		await this._updateAppPersonalization(
			visualizations.map((oViz) => {
				return {
					visualization: oViz,
					targetGroupId: defaultSection?.id,
					isTargetGroupDefault: true
				};
			})
		);

		//if preset section, then section shouldn't be deleted, instead remove visualizations inside section
		if (section?.preset) {
			await this.appManagerInstance.removeVisualizations({
				sectionId: groupId,
				vizIds: visualizations.map((oViz) => oViz.visualization?.id) as string[]
			});
		} else {
			await this._deleteGroup(groupId);
		}
		this._setBusy(false);
		MessageToast.show(this._i18nBundle.getText("appsUngrouped") ?? "");
		this._closeGroupDetailDialog();
		await this.refresh();
	}

	/**
	 * Shows the detail dialog for a group.
	 * @async
	 * @param {string} groupId - The Id of the group.
	 * @param {boolean} [editMode=false] - Whether to open the dialog in edit mode.
	 * @private
	 */
	private async _showGroupDetailDialog(groupId: string, editMode = false) {
		const group = this._getGroup(groupId);
		if (!group) {
			return;
		}
		this._selectedGroupId = groupId;
		const dialog = this._generateGroupDetailDialog();
		//set group icon
		const groupIconControl = this._controlMap.get(`${this.getId()}-detailDialog-toolbar-color`) as Icon;
		groupIconControl.setColor(Parameters.get({ name: group.getBgColor() }) as string);
		//set group apps
		await this._setGroupDetailDialogApps(groupId);
		dialog.open();
		//set group title
		this._setGroupNameControl(group.getTitle(), editMode);
	}

	/**
	 * Sets the apps for the detail dialog for a group.
	 * @async
	 * @param {string} groupId - The Id of the group.
	 * @returns {Promise<void>} - A Promise that resolves once the apps for the group detail dialog are set.
	 * @private
	 */
	private async _setGroupDetailDialogApps(groupId: string) {
		const group = this._getGroup(groupId);
		if (group) {
			let appVisualizations = await this.appManagerInstance.getSectionVisualizations(groupId, false);
			appVisualizations = appVisualizations.map((appVisualization) => {
				return {
					...appVisualization,
					menuItems: this._getAppActions(group) //add actions to show in group
				};
			});
			group.destroyAggregation("apps", true);
			const apps = this.generateApps(appVisualizations);
			const appsWrapper = this._controlMap.get(`${this.getId()}-detailDialog-apps`) as GridContainer;
			this._setAggregation(group, apps, "apps");
			appsWrapper.destroyItems();
			this._setAggregation(
				appsWrapper,
				group.getApps().map((app) => (this.getParent() as AppsContainer)._getAppTile(app))
			);
			this._applyGroupedAppsPersonalization(groupId);
			this._dispatchAppsLoadedEvent(apps);
		}
	}

	/**
	 * Applies personalization to the grouped apps within the specified group.
	 * @param {string} groupId - The ID of the group to which the apps belong.
	 * @private
	 */
	private _applyGroupedAppsPersonalization(groupId: string) {
		const appsWrapper = this._controlMap.get(`${this.getId()}-detailDialog-apps`) as GridContainer;
		const tiles = (appsWrapper?.getItems() || []) as GenericTile[];
		void this._applyTilesPersonalization(tiles, groupId, false);
	}

	/**
	 * Applies Deprecated Info for apps inside the group.
	 * @param {App[]} apps - The ID of the group to which the apps belong.
	 * @private
	 */
	private _dispatchAppsLoadedEvent(apps: App[]) {
		const appsWrapper = this._controlMap.get(`${this.getId()}-detailDialog-apps`) as GridContainer;
		const tiles = (appsWrapper?.getItems() || []) as GenericTile[];
		(this.getParent() as AppsContainer).fireEvent("appsLoaded", { apps, tiles });
	}

	/**
	 * Generates the group detail dialog.
	 * @private
	 * @returns {sap.m.Dialog} The generated detail dialog for the group.
	 */
	private _generateGroupDetailDialog() {
		const id = `${this.getId()}-detailDialog`;
		if (!this._controlMap.get(id)) {
			//group color icon
			this._controlMap.set(
				`${id}-toolbar-color`,
				new Icon({
					id: `${id}-toolbar-color`,
					src: "sap-icon://color-fill",
					size: "1.25rem"
				}).addStyleClass("sapUiTinyMarginEnd")
			);

			this._controlMap.set(
				`${id}-toolbar-title`,
				new Title({
					id: `${id}-toolbar-title`,
					visible: true
				})
			);

			const oGroupNameInput = new Input({
				id: `${id}-toolbar-title-edit`,
				width: "13.75rem",
				visible: false
			});

			this._controlMap.set(`${id}-toolbar-title-edit`, oGroupNameInput);

			oGroupNameInput.onsapfocusleave = () => {
				void this._onGroupEditName(oGroupNameInput.getValue());
			};

			//apps wrapper
			this._controlMap.set(
				`${id}-apps`,
				new GridContainer({
					id: `${id}-apps`,
					layout: new GridContainerSettings({
						columnSize: "19rem",
						gap: "0.5rem"
					})
				})
					?.addDragDropConfig(
						new DragDropInfo(`${id}-apps-dragDropInfo`, {
							sourceAggregation: "items",
							targetAggregation: "items",
							dropPosition: dnd.DropPosition.Between,
							dropLayout: dnd.DropLayout.Horizontal,
							drop: (event) => {
								void this._onFavItemDrop(event, this._selectedGroupId);
							}
						})
					)
					.attachBrowserEvent("keydown", (event: KeyboardEvent) => {
						const disablenavigation = event.metaKey || event.ctrlKey;
						void attachKeyboardHandler(event, disablenavigation, (dragDropEvent: Event) =>
							this._onFavItemDrop(dragDropEvent, this._selectedGroupId)
						);
					})
					.addStyleClass("sapCuxAppsContainerBorder sapCuxAppsDetailContainerPadding")
			);

			//add apps button
			this._controlMap.set(
				`${id}-addAppsBtn`,
				new Button(`${id}-addAppsBtn`, {
					text: this._i18nBundle.getText("addApps"),
					icon: "sap-icon://action",
					visible: _showAddApps(),
					press: () => {
						const groupId = this._selectedGroupId;
						this._closeGroupDetailDialog();
						this._selectedGroupId = groupId;
						void this.navigateToAppFinder(groupId);
					}
				})
			);

			this._controlMap.set(
				id,
				new Dialog(id, {
					content: this._controlMap.get(`${id}-apps`) as HBox,
					contentWidth: "60.75rem",
					endButton: new Button({
						id: `${id}-groupDetailCloseBtn`,
						text: this._i18nBundle.getText("closeBtn"),
						press: this._closeGroupDetailDialog.bind(this)
					}),
					escapeHandler: this._closeGroupDetailDialog.bind(this),
					customHeader: new Toolbar(`${this.getId()}-toolbar`, {
						content: [
							this._controlMap.get(`${id}-toolbar-color`) as Icon,
							this._controlMap.get(`${id}-toolbar-title`) as Title,
							this._controlMap.get(`${id}-toolbar-title-edit`) as Input,
							new ToolbarSpacer({ id: `${this.getId()}-toolbarSpacer` }),
							this._controlMap.get(`${id}-addAppsBtn`) as Button,
							new Button({
								id: "overflowBtn",
								icon: "sap-icon://overflow",
								type: "Transparent",
								press: (event) => {
									const source = event.getSource<Button>();
									const group = this._selectedGroupId ? this._getGroup(this._selectedGroupId) : null;
									const groupActions = group?.getAggregation("menuItems") as MenuItem[];
									const oPopover = ActionsPopover.get(groupActions);
									oPopover.openBy(source);
								}
							})
						]
					})
				}).addStyleClass("sapCuxGroupDetailDialog")
			);
		}
		return this._controlMap.get(id) as Dialog;
	}

	/**
	 * Closes the group detail dialog.
	 * @private
	 */
	private _closeGroupDetailDialog() {
		const groupDetailDialog = this._controlMap.get(`${this.getId()}-detailDialog`) as Dialog;
		this._selectedGroupId = undefined;
		groupDetailDialog?.close();
	}

	/**
	 * Updates the group name with new name.
	 * This method is triggered on group name input focus leave.
	 * @private
	 * @async
	 * @param {string} updatedTitle - The new title for the group.
	 */
	private async _onGroupEditName(updatedTitle: string) {
		this._setBusy(true);
		const groupId = this._selectedGroupId,
			group = this._getGroup(groupId!),
			oldTitle = group?.getTitle();
		if (updatedTitle && updatedTitle !== oldTitle) {
			await this._renameGroup(groupId!, updatedTitle);
			group?.setProperty("title", updatedTitle, true);
			void this.refresh();
			MessageToast.show(this._i18nBundle.getText("groupNameChanged") || "");
		}
		this._setGroupNameControl(updatedTitle, false);
		this._setBusy(false);
	}

	/**
	 * Renames a group.
	 * @async
	 * @param {string} groupId - The Id of the group to rename.
	 * @param {string} updatedTitle - The new title for the group.
	 * @returns {Promise<void>} A Promise that resolves once the group is renamed.
	 */
	private async _renameGroup(groupId: string, updatedTitle: string) {
		const pagesService = await Container.getServiceAsync<Pages>("Pages");
		const pageIndex = pagesService.getPageIndex(MYHOME_PAGE_ID),
			groups = pagesService.getModel().getProperty(`/pages/${pageIndex}/sections/`) as ISection[],
			groupIndex = groups.findIndex((group) => group.id === groupId);
		if (groupIndex > -1) {
			await pagesService.renameSection(pageIndex, groupIndex, updatedTitle);
		}
	}

	/**
	 * Sets the group name control in the detail dialog.
	 * Shows input control to edit the group name in edit mode, otherwise, shows group name as title control.
	 * @private
	 * @param {string} groupTitle - The title of the group.
	 * @param {boolean} editMode - Whether the dialog is in edit mode.
	 */
	private _setGroupNameControl(groupTitle: string, editMode: boolean) {
		const groupDetailDialog = this._controlMap.get(`${this.getId()}-detailDialog`) as Dialog;
		const groupTitleControl = this._controlMap.get(`${this.getId()}-detailDialog-toolbar-title`) as Title;
		const groupInputControl = this._controlMap.get(`${this.getId()}-detailDialog-toolbar-title-edit`) as Input;
		groupInputControl.setValue(groupTitle);
		groupTitleControl.setText(groupTitle);
		groupInputControl?.setVisible(editMode);
		groupTitleControl?.setVisible(!editMode);
		if (editMode) {
			//in edit mode set the focus on input
			groupDetailDialog.setInitialFocus(groupInputControl);
		}
	}

	/**
	 * Generates the dialog for adding apps from insights.
	 * @returns {sap.m.Dialog} The dialog for adding apps from insights.
	 * @private
	 */
	private _generateAddFromInsightsDialog() {
		const id = `${this.getId()}-addFromInsightsDialog`;

		const setAddBtnEnabled = () => {
			const selectedItems = this._getSelectedInsights();
			(this._controlMap.get(`${id}-addBtn`) as Button).setEnabled(selectedItems.length > 0);
		};

		if (!this._controlMap.get(id)) {
			const getAppFinderBtn = (id: string, btnType?: ButtonType) => {
				const appsAppFinder = new Button(id, {
					icon: "sap-icon://action",
					text: this._i18nBundle.getText("appFinderBtn"),
					press: () => {
						this._closeAddFromInsightsDialog();
						void this.navigateToAppFinder();
					},
					visible: _showAddApps(),
					type: btnType || ButtonType.Default
				});
				addFESRSemanticStepName(appsAppFinder, "press", "appsAppFinder");
				return appsAppFinder;
			};
			this._controlMap.set(
				`${id}-list`,
				new List({
					id: `${id}-list`,
					mode: "MultiSelect",
					selectionChange: setAddBtnEnabled
				})
			);
			this._controlMap.set(
				`${id}-addBtn`,
				new Button({
					id: `${id}-addBtn`,
					text: this._i18nBundle.getText("addFromInsightsDialogBtn"),
					type: "Emphasized",
					press: () => {
						void this._addFromInsights();
					},
					enabled: false
				})
			);
			const addStaticTiles = this._controlMap.get(`${id}-addBtn`) as Button;
			addFESRSemanticStepName(addStaticTiles, "press", "addStaticTiles");
			this._controlMap.set(
				`${id}-errorMessage`,
				new IllustratedMessage({
					id: `${id}-errorMessage`,
					illustrationSize: "Spot",
					illustrationType: "sapIllus-AddColumn",
					title: this._i18nBundle.getText("noAppsTitle"),
					description: this._i18nBundle.getText("noDataMsgInsightTiles"),
					visible: true
				}).addStyleClass("sapUiLargeMarginTop")
			);
			this._controlMap.set(
				id,
				new Dialog(id, {
					title: this._i18nBundle.getText("addFromInsights"),
					content: [
						new Label({
							id: `${id}-label`,
							text: this._i18nBundle.getText("addFromInsightsDialogLabel"),
							wrapping: true
						}).addStyleClass("sapMTitleAlign sapUiTinyMarginTopBottom sapUiSmallMarginBeginEnd"),
						new HBox({
							id: `${id}-textContainer`,
							justifyContent: "SpaceBetween",
							alignItems: "Center",
							items: [
								new Title({
									id: `${id}-text`,
									text: this._i18nBundle.getText("addFromInsightsDialogTitle")
								}),
								getAppFinderBtn(`${id}-addAppsBtn`, ButtonType.Transparent)
							]
						}).addStyleClass("sapUiTinyMarginTop dialogHeader sapUiSmallMarginBeginEnd"),
						this._controlMap.get(`${id}-list`) as List,
						this._controlMap.get(`${id}-errorMessage`) as IllustratedMessage
					],
					contentWidth: "42.75rem",
					contentHeight: "32.5rem",
					endButton: new Button({
						id: `${id}-addFromInsightsCloseBtn`,
						text: this._i18nBundle.getText("closeBtn"),
						press: this._closeAddFromInsightsDialog.bind(this)
					}),
					escapeHandler: this._closeAddFromInsightsDialog.bind(this),
					buttons: [
						this._controlMap.get(`${id}-addBtn`) as Button,
						new Button({
							id: `${id}-cancelBtn`,
							text: this._i18nBundle.getText("cancelBtn"),
							press: this._closeAddFromInsightsDialog.bind(this)
						})
					]
				}).addStyleClass("sapContrastPlus sapCuxAddFromInsightsDialog")
			);
		}
		setAddBtnEnabled();
		return this._controlMap.get(id) as Dialog;
	}

	/**
	 * Handles the addition of apps from insights.
	 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
	 * @private
	 */
	private async _handleAddFromInsights() {
		const appsToAdd = await this._getInsightTilesToAdd();
		const dialog = this._generateAddFromInsightsDialog();
		(this._controlMap.get(`${this.getId()}-addFromInsightsDialog-errorMessage`) as IllustratedMessage)?.setVisible(
			appsToAdd.length === 0
		);
		this._generateInsightListItems(appsToAdd);
		dialog.open();
	}

	/**
	 * Generates list items for the provided apps and populates the list in the "Add from Insights" dialog.
	 * @param {ICustomVisualization[]} apps - An array of custom visualizations representing the apps to be added.
	 * @private
	 */
	private _generateInsightListItems(apps: ICustomVisualization[]) {
		const list = this._controlMap.get(`${this.getId()}-addFromInsightsDialog-list`) as List;
		if (apps.length) {
			list.destroyItems();
			const listItems = apps.map(
				(app, index) =>
					new CustomListItem({
						id: `${this.getId()}-addFromInsightsDialog-listItem-${index}`,
						content: [
							new HBox({
								id: `${this.getId()}-addFromInsightsDialog-listItem-${index}-content`,
								alignItems: "Center",
								items: [
									new Icon({
										id: `${this.getId()}-addFromInsightsDialog-listItem-${index}-content-icon`,
										src: app.icon,
										backgroundColor: this._getLegendColor(app.BGColor || "").value,
										color: "white",
										width: "2.25rem",
										height: "2.25rem",
										size: "1.25rem"
									}).addStyleClass("sapUiRoundedBorder sapUiTinyMargin"),
									new ObjectIdentifier({
										id: `${this.getId()}-addFromInsightsDialog-listItem-${index}-content-identifier`,
										title: app.title,
										text: app.subtitle,
										tooltip: app.title
									}).addStyleClass("sapUiTinyMargin")
								]
							})
						]
					})
						.addStyleClass("sapUiContentPadding")
						.data("vizId", app.visualization?.vizId) as CustomListItem
			);
			this._setAggregation(list, listItems);
		}
		list?.setVisible(apps.length !== 0);
	}

	/**
	 * Retrieves the insight tiles to add.
	 * @returns {Promise<ICustomVisualization[]>} A Promise that resolves with an array of insight tiles to add.
	 * @private
	 */
	private async _getInsightTilesToAdd() {
		const [insightsApps, favoriteApps] = await Promise.all([
			this.appManagerInstance.fetchInsightApps(true, this._i18nBundle.getText("insights") as string),
			this.appManagerInstance.fetchFavVizs(false, true)
		]); //check force refresh true?
		//find the visualizations that are present in insight tile but not in favorite apps
		const appsToAdd = insightsApps.reduce((appsToAdd: ICustomVisualization[], insightsApp) => {
			if (!insightsApp.isCount && !insightsApp.isSmartBusinessTile) {
				// Check if App is not present in Fav Apps
				const iAppIndex = favoriteApps.findIndex(
					(favoriteApp) =>
						favoriteApp.visualization?.vizId === insightsApp.visualization?.vizId || favoriteApp.appId === insightsApp.appId
				);
				if (iAppIndex === -1) {
					appsToAdd.push(insightsApp);
				}
			}
			return appsToAdd;
		}, []);
		return this.appManagerInstance._filterDuplicateVizs(appsToAdd, false);
	}

	/**
	 * Closes the dialog for adding apps from insights.
	 * @private
	 */
	private _closeAddFromInsightsDialog() {
		const dialog = this._generateAddFromInsightsDialog();
		const list = this._controlMap.get(`${this.getId()}-addFromInsightsDialog-list`) as List;
		list.removeSelections();
		dialog?.close();
	}

	/**
	 * Retrieves the selected insights from the dialog.
	 * @returns {sap.m.ListItemBase[]} An array of selected insights.
	 * @private
	 */
	private _getSelectedInsights() {
		const list = this._controlMap.get(`${this.getId()}-addFromInsightsDialog-list`) as List;
		return list.getSelectedItems() || [];
	}

	/**
	 * Adds apps from insights.
	 * @returns {void}
	 * @private
	 */
	private async _addFromInsights() {
		this._setBusy(true);
		const selectedItems = this._getSelectedInsights();
		for (const selectedItem of selectedItems) {
			await this.appManagerInstance.addVisualization(selectedItem.data("vizId") as string);
		}
		this._closeAddFromInsightsDialog();
		MessageToast.show(
			this._i18nBundle.getText(selectedItems.length === 1 ? "addFromInsightTileSuccess" : "addFromInsightTilesSuccess", [
				selectedItems.length
			]) as string
		);
		await (this.getParent() as AppsContainer)._refreshAllPanels();
		this._setBusy(false);
	}

	/**
	 * Updates the personalization data for apps.
	 * @param {IUpdatePersonalizationConfig[]} updateConfigs - The array of configurations for updating personalization.
	 * @param {IUpdatePersonalizationConfig} updateConfig - Configuration object for updating personalization.
	 * @param {ICustomVisualization} updateConfig.visualization - Visualization.
	 * @param {string} updateConfig.color - The color to update for the app.
	 * @param {boolean} updateConfig.isTargetGroupDefault - A flag indicating whether the target section is the default.
	 * @param {string} [updateConfig.targetGroupId] - The Id of the target group. Defaults to source group Id if not provided.
	 * @returns {Promise<void>} A promise that resolves when the personalization data is updated.
	 * @private
	 */
	private async _updateAppPersonalization(updateConfigs: IUpdatePersonalizationConfig[]) {
		const personalizations = await this._getAppPersonalization();

		for (const updateConfig of updateConfigs) {
			const { visualization } = updateConfig;
			const { persConfig } = visualization;
			const sourceGroupId = persConfig?.sectionId;
			const targetGroupId = updateConfig.targetGroupId ?? sourceGroupId;

			if (sourceGroupId !== targetGroupId) {
				//move app scenario
				this._updateMoveAppPersonalization(personalizations, updateConfig);
			} else {
				//only color is updated
				this._updateAppColorPersonalization(personalizations, updateConfig);
			}
		}
		await this.setFavAppsPersonalization(personalizations);
	}

	/**
	 * Updates the color personalization for an app.
	 * @param {IAppPersonalization[]} personalizations - The array of app personalizations.
	 * @param {IUpdatePersonalizationConfig} updateConfig - The update configuration.
	 * @returns {void}
	 * @private
	 */
	private _updateAppColorPersonalization = (personalizations: IAppPersonalization[], updateConfig: IUpdatePersonalizationConfig) => {
		const { visualization, color } = updateConfig;
		const { appId, oldAppId, persConfig } = visualization;
		const sourceGroupId = persConfig?.sectionId;
		const isSourceGroupDefault = persConfig?.isDefaultSection;
		const personalizationIndex = this._getPersonalizationIndex(personalizations, {
			appId,
			oldAppId,
			sectionId: sourceGroupId,
			isRecentlyAddedApp: isSourceGroupDefault
		});
		if (personalizationIndex > -1) {
			personalizations[personalizationIndex].BGColor = color as string;
		} else {
			personalizations.push({
				BGColor: color as string,
				sectionId: sourceGroupId,
				isRecentlyAddedApp: isSourceGroupDefault as boolean,
				appId,
				isSection: false
			});
		}
	};

	/**
	 * Updates the personalization when an app is moved to a different group.
	 * @param {IAppPersonalization[]} personalizations - The array of app personalizations.
	 * @param {IUpdatePersonalizationConfig} updateConfig - The update configuration.
	 * @returns {void}
	 * @private
	 */
	private _updateMoveAppPersonalization(personalizations: IAppPersonalization[], updateConfig: IUpdatePersonalizationConfig) {
		const { visualization, isTargetGroupDefault } = updateConfig;
		const { appId, oldAppId, persConfig } = visualization;
		const sourceGroupId = persConfig?.sectionId;
		const isSourceGroupDefault = persConfig?.isDefaultSection;
		const duplicateApps = persConfig?.duplicateApps || [];
		const targetGroupId = updateConfig.targetGroupId ?? sourceGroupId;

		const sourcePersonalizationIndex = this._getPersonalizationIndex(personalizations, {
			appId,
			oldAppId,
			sectionId: sourceGroupId,
			isRecentlyAddedApp: isSourceGroupDefault
		});
		//if personalization exists for app in source group
		if (sourcePersonalizationIndex > -1) {
			const newPersonalization = {
				...personalizations[sourcePersonalizationIndex],
				sectionId: targetGroupId,
				isRecentlyAddedApp: isTargetGroupDefault,
				isSection: false
			} as IAppPersonalization;
			//if no duplicate apps in source group, clean up source group personlization
			if (duplicateApps.length === 0) {
				personalizations.splice(sourcePersonalizationIndex, 1);
			}

			//update target personalization
			const iTargetPersonalizationIndex = this._getPersonalizationIndex(personalizations, {
				appId,
				oldAppId,
				sectionId: targetGroupId,
				isRecentlyAddedApp: isTargetGroupDefault
			});
			if (iTargetPersonalizationIndex > -1) {
				personalizations.splice(iTargetPersonalizationIndex, 1); //clean up any existing personalization
			}
			//push new personalization for target group
			personalizations.push(newPersonalization);
		}
	}

	/**
	 * Updates the personalization data for a group with the selected color.
	 * @param {string} groupId - The ID of the group.
	 * @param {string} selectedColor - The selected color for the group.
	 * @returns {Promise<void>} A promise that resolves when the personalization data is updated.
	 * @private
	 */
	private async _updateGroupPersonalization(groupId: string, selectedColor: string) {
		const personalizations = await this._getAppPersonalization();
		const personalizationIndex = this._getPersonalizationIndex(personalizations, {
			isSection: true,
			sectionId: groupId
		});
		const updatedPersonalization = {
			BGColor: selectedColor,
			isSection: true,
			sectionId: groupId,
			isRecentlyAddedApp: false
		};
		if (personalizationIndex > -1) {
			//if color is already present for the group, update the color
			personalizations[personalizationIndex] = updatedPersonalization;
		} else {
			personalizations.push(updatedPersonalization);
		}
		await this.setFavAppsPersonalization(personalizations);
	}

	/**
	 * Finds the index of personalization data matching the specified properties.
	 * @param {IAppPersonalization[]} personalizations - The array of personalization data.
	 * @param {IAppPersonalization} appPersonalization - The properties to match for finding the index.
	 * @param {string} [appPersonalization.appId] -  id of the app.
	 * @param {string} [appPersonalization.oldAppId] - old id of the app.
	 * @param {string} [appPersonalization.sectionId] - id of the section.
	 * @param {boolean} appPersonalization.isSection - A flag indicating whether the personalization is for a section.
	 * @param {boolean} appPersonalization.isRecentlyAddedApp - A flag indicating whether the app is a recently added app.
	 * @returns {number} The index of the matching personalization data, or -1 if not found.
	 * @private
	 */
	private _getPersonalizationIndex(personalizations: IAppPersonalization[], appPersonalization: IAppPersonalizationConfig) {
		const { appId, oldAppId, sectionId, isSection, isRecentlyAddedApp } = appPersonalization;
		return personalizations.findIndex((personalization) => {
			if (isSection) {
				return personalization.sectionId === sectionId && personalization.isSection;
			} else {
				return isRecentlyAddedApp
					? (personalization.appId === appId || personalization.appId === oldAppId) && personalization.isRecentlyAddedApp
					: (personalization.appId === appId || personalization.appId === oldAppId) && personalization.sectionId === sectionId;
			}
		});
	}

	/**
	 * Adds a visualization.
	 * @param {object} oViz - The visualization to be added.
	 * @param {object} oViz.visualization - The visualization object.
	 * @param {boolean} [oViz.visualization.isBookmark=false] - Indicates if the visualization is a bookmark.
	 * @param {string} [oViz.visualization.vizId] - The ID of the visualization if it's not a bookmark.
	 * @returns {Promise<void>} A promise that resolves to void after the visualization is added.
	 * @private
	 */
	private _addVisualization(viz: ICustomVisualization) {
		if (viz.visualization) {
			return viz.visualization.isBookmark
				? this.appManagerInstance.addBookMark(viz.visualization)
				: this.appManagerInstance.addVisualization(viz.visualization.vizId);
		}
		return Promise.reject(new Error("No visualization provided to add"));
	}

	/**
	 * Deletes a group.
	 * @param {string} groupId - The Id of the group to delete.
	 * @returns {Promise<void>} A Promise that resolves once the group is deleted.
	 * @private
	 */
	private async _deleteGroup(groupId: string) {
		const pagesService = await Container.getServiceAsync<Pages>("Pages");
		const pageIndex = pagesService.getPageIndex(MYHOME_PAGE_ID),
			groups = pagesService.getModel().getProperty(`/pages/${pageIndex}/sections/`) as ISection[],
			groupIndex = groups.findIndex((group) => group.id === groupId);
		if (groupIndex > -1) {
			await pagesService.deleteSection(pageIndex, groupIndex);
			void this._deletePersonalization({ sectionId: groupId, isSection: true });
		}
	}

	/**
	 * Deletes personalization data based on the specified properties.
	 * @param {IAppPersonalizationConfig} personalizationConfig - The properties to identify the personalization data to delete.
	 * @param {boolean} [personalizationConfig.isSection] - A flag indicating whether the personalization is for a group.
	 * @param {string} [appPersonalization.appId] -  id of the app.
	 * @param {string} [appPersonalization.oldAppId] - old id of the app.
	 * @param {string} personalizationConfig.sectionId - The ID of the group associated with the personalization.
	 * @param {boolean} [appPersonalization.isRecentlyAddedApp] - A flag indicating whether the app is a recently added app.
	 * @returns {Promise<void>} A promise that resolves when the personalization data is deleted.
	 * @private
	 */
	private async _deletePersonalization(personalizationConfig: IAppPersonalizationConfig) {
		const { isSection, sectionId } = personalizationConfig;
		let personalizations = await this._getAppPersonalization();

		if (!isSection) {
			const personalizationIndex = this._getPersonalizationIndex(personalizations, personalizationConfig);
			if (personalizationIndex > -1) {
				personalizations.splice(personalizationIndex, 1);
			}
		} else {
			// Delete personalizations for all associated apps if a group is deleted
			personalizations = personalizations.filter((personalization) => personalization.sectionId !== sectionId);
		}

		void this.setFavAppsPersonalization(personalizations);
	}

	/**
	 * Handles the press event of a group.
	 * @param {Group$PressEvent} event - The press event object.
	 * @private
	 */
	private _handleGroupPress(event: Group$PressEvent) {
		const groupId = event.getParameter("groupId");
		if (groupId) {
			void this._showGroupDetailDialog(groupId);
		}
	}

	/**
	 * Handles keyboard events for cutting and moving applications.
	 * When the Cmd (Mac) or Ctrl (Windows) key is pressed along with 'x', the currently selected element is cut.
	 * When the Cmd (Mac) or Ctrl (Windows) key is pressed along with 'v':
	 * - If the operation is performed on a group, the previously cut application is moved into the group.
	 * - If the operation is performed on an application, the create group dialog is opened.
	 * @param {KeyboardEvent} event - The keyboard event object.
	 * @param {string} [appGroupId] - The group Id of the app, if app belongs to a group.
	 * @returns {Promise<void>} A Promise that resolves when app is moved to a group or create group dialog is opened.
	 * @private
	 */
	private async _handleKeyboardMoveApp(event: KeyboardEvent, appGroupId?: string) {
		const currentItem = Element.closestTo((event.target as HTMLElement).firstElementChild as HTMLElement) as GenericTile & {
			_oMoreIcon: Button;
		};
		const container = currentItem.getParent() as GridContainer;
		if (event.metaKey || event.ctrlKey) {
			// ctrl(windows)/cmd (mac) + x, sets app to be moved to a group, or to create a group
			if (event.key === "x" && !currentItem.data("groupId") && !this._cutApp && !appGroupId) {
				currentItem.$().css("opacity", 0.6);
				currentItem._oMoreIcon.setEnabled(false);
				this._cutApp = currentItem;
			}

			if (event.key === "v" && this._cutApp && !appGroupId) {
				const dragDropEvent = new Event("keyboardDragDropEvent", container, {
					draggedControl: this._cutApp,
					droppedControl: currentItem,
					dropPosition: dnd.RelativeDropPosition.On
				});
				await this._onFavItemDrop(dragDropEvent);
				this._cutApp = undefined;
			}
		}
	}

	/**
	 * Cancels the cut operation when clicked outside apps section or when focus moves out of apps section.
	 * @param {MouseEvent | KeyboardEvent} event - The mouse or keyboard event triggering the reset.
	 * @private
	 */
	private _resetCutElement(event: MouseEvent | KeyboardEvent) {
		const appsWrapperId = this._generateAppsWrapper().getId();
		if (!(event.target as HTMLElement).id.includes(appsWrapperId)) {
			this._cutApp?.$().css("opacity", "");
			this._cutApp = undefined;
		}
	}

	/**
	 * Generates illustrated message for favorite apps panel.
	 * @private
	 * @override
	 * @returns {sap.m.IllustratedMessage} Illustrated error message.
	 */
	protected generateIllustratedMessage() {
		const illustratedMessage = super.generateIllustratedMessage();
		//overrride the default title and add additional content
		illustratedMessage.setDescription(this._i18nBundle.getText("noFavAppsDescription"));
		illustratedMessage.addAdditionalContent(
			new Button(`${this.getId()}-errorMessage-addApps`, {
				text: this._i18nBundle.getText("addApps"),
				tooltip: this._i18nBundle.getText("addAppsTooltip"),
				icon: "sap-icon://action",
				visible: _showAddApps(),
				press: () => {
					void this.navigateToAppFinder();
				},
				type: "Emphasized"
			})
		);
		return illustratedMessage;
	}
}
