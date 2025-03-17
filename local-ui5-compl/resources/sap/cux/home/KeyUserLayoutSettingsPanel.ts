/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import Column from "sap/m/Column";
import ColumnListItem from "sap/m/ColumnListItem";
import HBox from "sap/m/HBox";
import ObjectIdentifier from "sap/m/ObjectIdentifier";
import Table from "sap/m/Table";
import ToggleButton, { ToggleButton$PressEvent } from "sap/m/ToggleButton";
import Control from "sap/ui/core/Control";
import CustomData from "sap/ui/core/CustomData";
import DragDropInfo from "sap/ui/core/dnd/DragDropInfo";
import { DropInfo$DropEvent } from "sap/ui/core/dnd/DropInfo";
import type { MetadataOptions } from "sap/ui/core/Element";
import Element from "sap/ui/core/Element";
import Icon from "sap/ui/core/Icon";
import BaseContainer from "./BaseContainer";
import BaseSettingsPanel from "./BaseSettingsPanel";
import { CHANGE_TYPES } from "./flexibility/Layout.flexibility";
import { IDragEvent, IElement } from "./interface/LayoutInterface";
import KeyUserSettingsDialog from "./KeyUserSettingsDialog";
import Layout from "./Layout";
import { KEYUSER_SETTINGS_PANELS_KEYS } from "./utils/Constants";

/**
 *
 * Class for Layout Settings Panel for KeyUser Settings Dialog.
 *
 * @extends BaseSettingsPanel
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.121
 *
 * @internal
 * @experimental Since 1.121
 * @private
 *
 * @alias sap.cux.home.KeyUserLayoutSettingsPanel
 */
export default class KeyUserLayoutSettingsPanel extends BaseSettingsPanel {
	static readonly metadata: MetadataOptions = {
		library: "sap.cux.home"
	};

	private layoutTable!: Table;
	private orderedSections!: IElement[];
	private _allLayoutElements!: BaseContainer[];

	/**
	 * Init lifecycle method
	 *
	 * @public
	 * @override
	 */
	public init(): void {
		super.init();

		//setup panel
		this.setProperty("key", KEYUSER_SETTINGS_PANELS_KEYS.LAYOUT);
		this.setProperty("title", this._i18nBundle.getText("editModeTitle"));

		// //setup layout content
		this.addAggregation("content", this.getContent());

		//fired every time on panel navigation
		this.attachPanelNavigated(() => {
			const layout = this._getPanel() as Layout;
			layout.resetSections();
			void this.loadSections();
		});
	}

	/**
	 * Returns the content for the Layout Settings Panel.
	 *
	 * @private
	 * @returns {VBox} The control containing the Layout Settings Panel content.
	 */
	private getContent(): Table {
		if (!this.layoutTable) {
			this.layoutTable = new Table(this.getId() + "--idLayoutSettingsTable", {
				width: "calc(100% - 2rem)",
				items: [],
				columns: [
					new Column(this.getId() + "--idSectionTitleColumn", {
						width: "100%"
					})
				],
				dragDropConfig: new DragDropInfo(this.getId() + "--idLayoutSettingsDragInfo", {
					sourceAggregation: "items",
					targetAggregation: "items",
					groupName: "LayoutSettingsItems",
					dropPosition: "On",
					drop: (event: DropInfo$DropEvent) => {
						this.onDropLayoutSettings(event);
					}
				})
			}).addStyleClass("layoutSettingsTable sapContrastPlus sapUiSmallMarginBegin");
		}
		return this.layoutTable;
	}

	/**
	 * Method to load the sections
	 *
	 * @private
	 */
	private async loadSections(): Promise<void> {
		const layout = this._getPanel() as Layout;
		await layout._calculateSectionsState();
		this.orderedSections = layout.getSections() || [];

		const keyUserSettingsDialog = this.getParent() as KeyUserSettingsDialog;

		this.layoutTable.removeAllItems();
		this.orderedSections.forEach((section: IElement) => {
			this.layoutTable
				.addItem(
					new ColumnListItem({
						type: (this.getParent() as KeyUserSettingsDialog)?.hasDetailsPage?.(section.completeId) ? "Navigation" : "Inactive",
						cells: [
							new HBox({
								alignItems: "Center",
								items: [
									new Icon({
										src: "sap-icon://vertical-grip"
									}).addStyleClass("sapUiSmallMarginEnd"),
									new HBox({
										justifyContent: "SpaceBetween",
										alignItems: "Center",
										width: "100%",
										items: [
											new ObjectIdentifier({
												title: section.title,
												text: section.text,
												tooltip: section.title
											}),
											new ToggleButton({
												tooltip: section.visible
													? this._i18nBundle.getText("hideBtn")
													: this._i18nBundle.getText("showBtn"),
												icon: "sap-icon://show",
												type: "Emphasized",
												enabled: !section.blocked,
												press: (event) => this.createShowHideChangeFile(event, section),
												pressed: !section.visible,
												ariaLabelledBy: ["selectLabel"]
											}).addStyleClass("sapUiTinyMarginEnd sapUiTinyMarginTop")
										]
									}).addStyleClass("sapUiTinyMarginBegin")
								],
								width: "100%"
							})
						],
						press: () => keyUserSettingsDialog?.navigateToPage?.(keyUserSettingsDialog.getDetailsPage(section.completeId)),
						customData: new CustomData({
							key: "sectionObject",
							value: section
						})
					})
				)
				.addStyleClass("insightsListItem insightsListMargin");
		});
	}

	/**
	 * Function to execute drag and drop among sections
	 *
	 * @private
	 */
	private onDropLayoutSettings(event: DropInfo$DropEvent | IDragEvent) {
		const wrapper = this._getPanel() as Layout | Control;
		const wrapperId = wrapper.getId();
		const dragItem = ((event as DropInfo$DropEvent).getParameter?.("draggedControl") ||
			(event as IDragEvent).draggedControl) as ColumnListItem;
		const dragItemIndex = (dragItem.getParent() as Table)?.indexOfItem(dragItem);
		const dropItem = ((event as DropInfo$DropEvent).getParameter?.("droppedControl") ||
			(event as IDragEvent).droppedControl) as ColumnListItem;
		const dropItemIndex = (dragItem.getParent() as Table)?.indexOfItem(dropItem);

		if (dragItemIndex !== dropItemIndex) {
			const sectionOrder = this.orderedSections;
			const dragObject = dragItem.data("sectionObject") as IElement;
			const dropObject = dropItem.data("sectionObject") as IElement;

			const actualDragItemIndex = this._getActualIndex(dragObject.completeId);
			const actualDropItemIndex = this._getActualIndex(dropObject.completeId);
			this._rearrangeLayoutElements(actualDragItemIndex, actualDropItemIndex);

			sectionOrder.splice(dragItemIndex, 1);
			sectionOrder.splice(dropItemIndex, 0, dragObject);
			(wrapper as Layout).setSections(sectionOrder);

			this.addKeyUserChanges({
				selectorControl: wrapper as Control,
				changeSpecificData: {
					changeType: CHANGE_TYPES.MOVE,
					content: {
						movedElements: [
							{
								id: dragObject.completeId,
								sourceIndex: actualDragItemIndex,
								targetIndex: actualDropItemIndex
							}
						],
						source: {
							id: wrapperId,
							aggregation: "items"
						},
						target: {
							id: wrapperId,
							aggregation: "items"
						}
					}
				}
			});

			void this.loadSections();
		}
	}

	/**
	 * Retrieves the actual index of a layout element by its ID.
	 *
	 * @private
	 * @param {string} id - The ID of the layout element to find.
	 * @returns {number} The index of the layout element.
	 */
	private _getActualIndex(id: string): number {
		const layout = this._getPanel() as Layout;
		this._allLayoutElements = this._allLayoutElements || [...layout.getItems()];
		const isLayoutExpanded = layout.getProperty("expanded") as boolean;
		const expandedElementConfig = layout._getCurrentExpandedElement();

		if (isLayoutExpanded && expandedElementConfig) {
			// add the expanded element if it isn't already in the list
			if (!this._allLayoutElements.some((element) => element.getId() === expandedElementConfig.targetContainer.getId())) {
				this._allLayoutElements.splice(
					layout.indexOfItem(expandedElementConfig.targetContainer),
					0,
					expandedElementConfig.targetContainer
				);
			}
		}

		return this._allLayoutElements.findIndex((element) => element.getId() === id);
	}

	/**
	 * Rearranges the layout elements by moving an element from the source index to the target index.
	 *
	 * @private
	 * @param {number} sourceIndex - The index of the element to move.
	 * @param {number} targetIndex - The index to move the element to.
	 */
	private _rearrangeLayoutElements(sourceIndex: number, targetIndex: number): void {
		const container = this._allLayoutElements.splice(sourceIndex, 1)[0];
		this._allLayoutElements.splice(targetIndex, 0, container);
	}

	/**
	 * Method to set visibility of the container sections
	 * Toggle button pressed event handler
	 *
	 * @private
	 */
	private createShowHideChangeFile(oControlEvent: ToggleButton$PressEvent, section: IElement): void {
		const isCheckBoxSelected: boolean = !oControlEvent.getParameter("pressed");
		const keyUserChanges = this.getKeyUserChanges();
		const changeType = isCheckBoxSelected ? CHANGE_TYPES.UNHIDE : CHANGE_TYPES.HIDE;
		const oExistingChange = keyUserChanges.find((oChange) => {
			return oChange.selectorControl.getId() === section.completeId;
		});

		//Check if the change already exists
		if (oExistingChange) {
			oExistingChange.changeSpecificData.changeType = changeType;
		} else {
			this.addKeyUserChanges({
				selectorControl: Element.getElementById(section.completeId) as Control,
				changeSpecificData: {
					changeType
				}
			});
		}
	}
}
