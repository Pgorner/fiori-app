/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import Log from "sap/base/Log";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Button from "sap/m/Button";
import Column from "sap/m/Column";
import ColumnListItem from "sap/m/ColumnListItem";
import HBox from "sap/m/HBox";
import MessageBox from "sap/m/MessageBox";
import ObjectIdentifier from "sap/m/ObjectIdentifier";
import Table from "sap/m/Table";
import Text from "sap/m/Text";
import ToggleButton from "sap/m/ToggleButton";
import VBox from "sap/m/VBox";
import Event from "sap/ui/base/Event";
import Component from "sap/ui/core/Component";
import type { MetadataOptions } from "sap/ui/core/Element";
import Element from "sap/ui/core/Element";
import Icon from "sap/ui/core/Icon";
import Lib from "sap/ui/core/Lib";
import DragDropInfo from "sap/ui/core/dnd/DragDropInfo";
import { DropInfo$DropEvent } from "sap/ui/core/dnd/DropInfo";
import JSONModel from "sap/ui/model/json/JSONModel";
import BaseContainer from "./BaseContainer";
import BaseLayout from "./BaseLayout";
import BaseSettingsPanel, { $BaseSettingsPanelSettings } from "./BaseSettingsPanel";
import Layout from "./Layout";
import { CHANGE_TYPES } from "./flexibility/Layout.flexibility";
import { IControlPersonalizationWriteAPI, IDragEvent, IElement, IManagePersChanges } from "./interface/LayoutInterface";
import { SETTINGS_PANELS_KEYS } from "./utils/Constants";
import PersonalisationUtils from "./utils/PersonalisationUtils";

/**
 *
 * Class for My Home Layout Settings Panel.
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
 * @alias sap.cux.home.LayoutSettingsPanel
 */
export default class LayoutSettingsPanel extends BaseSettingsPanel {
	private _layoutTable!: Table;
	public _i18nBundle!: ResourceBundle;
	private _orderedSections!: IElement[];
	private _manageSectionsChanges!: IManagePersChanges[];
	private _controlModel!: JSONModel;
	private _allLayoutElements!: BaseContainer[];
	private _isCollapseHandlerAttached: boolean = false;

	constructor(id?: string | $BaseSettingsPanelSettings);
	constructor(id?: string, settings?: $BaseSettingsPanelSettings);
	constructor(id?: string, settings?: $BaseSettingsPanelSettings) {
		super(id, settings);
	}

	static readonly metadata: MetadataOptions = {
		library: "sap.cux.home"
	};

	/**
	 * Init lifecycle method
	 *
	 * @public
	 * @override
	 */
	public init(): void {
		super.init();

		//setup panel
		this.setProperty("key", SETTINGS_PANELS_KEYS.LAYOUT);
		this.setProperty("title", this._i18nBundle.getText("layout"));
		this.setProperty("icon", "sap-icon://grid");

		// //setup layout content
		this.addAggregation("content", this._getContent());
		this.addAggregation(
			"actionButtons",
			new Button({
				id: `${this.getId()}-layoutResetBtn`,
				text: this._i18nBundle.getText("resetButton"),
				press: () => {
					this.resetMyhomeSettings();
				}
			})
		);
		//fired every time on panel navigation
		this.attachPanelNavigated(() => void this._loadSections());
		this._manageSectionsChanges = [];
	}

	/**
	 * Method to set visibility of the container sections
	 * Toggle button pressed event handler
	 *
	 * @private
	 */
	private async createShowHideChangeFile(oControlEvent: Event): Promise<void> {
		const toggle = oControlEvent.getSource<ToggleButton>();
		const bValue = !toggle.getPressed();
		const oContext = toggle.getBindingContext()?.getObject() as IElement;

		oContext.visible = bValue;
		(this._getPanel() as Layout).getSections().find((section) => section.completeId === oContext.completeId)!.visible = bValue;

		const sChangeType = bValue ? CHANGE_TYPES.UNHIDE : CHANGE_TYPES.HIDE;
		const oWrapperItem = Element.getElementById(oContext.completeId) as BaseContainer;
		// visibility handling
		// const layout = this._getPanel() as Layout;
		// const isPagesAvailable = layout?.getPagesAvailable();
		// const isCustomNewsVisible = layout?.customNewAvailable();

		//****review this code */
		// const isPageSection = oContext.sContainerType === "sap.cux.home.NewsAndPagesContainer",
		// bIsPageSectionDisabled = isPageSection && !isPagesAvailable && !isCustomNewsVisible;
		// if (!bIsPageSectionDisabled) {
		this._manageSectionsChanges.push({
			selectorElement: oWrapperItem,
			changeSpecificData: {
				changeType: sChangeType
			}
		});
		// }
		await this._saveManageSectionsDialog();
		setTimeout(() => oWrapperItem.adjustLayout());

		// switch to collapsed view if the container is in expanded view
		if (!bValue) {
			this._switchToCollapsedViewIfRequired([oWrapperItem]);
		}
	}

	/**
	 * Switches the layout to collapsed view if the current container is in expanded view
	 *
	 * @private
	 * @param {BaseContainer} container - container instance to check
	 * @returns {void}
	 */
	private _switchToCollapsedViewIfRequired(containers: BaseContainer[]): void {
		const layout = this._getPanel() as Layout;
		const isLayoutExpanded = layout.getProperty("expanded") as boolean;

		if (isLayoutExpanded) {
			containers.forEach((container) => {
				layout.toggleFullScreen(container._getSelectedPanel());
			});
		}
	}

	/**
	 * Method to load the sections
	 *
	 * @private
	 */
	private async _loadSections(): Promise<void> {
		const layout = this._getPanel() as Layout;
		await layout._calculateSectionsState();

		this._orderedSections = JSON.parse(JSON.stringify(layout.getSections())) as IElement[];
		// not a good way as there could be more than one insights container, discuss
		this._orderedSections.forEach((oSection) => {
			if (oSection.sContainerType === "sap.cux.home.InsightsContainer" && !oSection.title) {
				oSection.title = String(this._i18nBundle?.getText("insights"));
			}
		});
		this._controlModel = new JSONModel(this._orderedSections);
		this._layoutTable.setModel(this._controlModel);

		this._layoutTable.bindItems({
			path: "/",
			template: new ColumnListItem({
				type: "Inactive",
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
										title: "{title}",
										text: "{text}",
										tooltip: "{title}"
									}),
									new ToggleButton({
										tooltip:
											"{= ${visible} ? '" +
											this._i18nBundle.getText("hideBtn") +
											"' : '" +
											this._i18nBundle.getText("showBtn") +
											"' }",
										icon: "sap-icon://show",
										type: "Emphasized",
										enabled: "{= !${blocked}}",
										press: (event: Event) => {
											void this.createShowHideChangeFile(event);
										},
										pressed: "{= !${visible}}",
										ariaLabelledBy: ["selectLabel"]
									}).addStyleClass("sapUiTinyMarginEnd sapUiTinyMarginTop")
								]
							})
						],
						width: "100%"
					})
				]
			}).addStyleClass("insightsListItem insightsListMargin")
		});

		// attach collapse event handler to rearrange layout elements if required
		if (!this._isCollapseHandlerAttached) {
			layout.attachEvent("onCollapse", () => this._rearrangeLayoutIfRequired());
		}
	}

	/**
	 * Rearranges the layout elements if their order has changed.
	 *
	 * @private
	 */
	private _rearrangeLayoutIfRequired(): void {
		const layout = this._getPanel() as Layout;
		const currentLayoutElements = layout.getItems();

		if (Array.isArray(this._allLayoutElements) && currentLayoutElements.length === this._allLayoutElements.length) {
			const isOrderChanged = currentLayoutElements.some((element, index) => {
				return element.getId() !== this._allLayoutElements[index].getId();
			});

			if (isOrderChanged) {
				layout.removeAllItems();
				this._allLayoutElements.forEach((element) => {
					layout.addItem(element);
				});
			}
		}
	}

	/**
	 * Returns the content for the Layout Settings Panel.
	 *
	 * @private
	 * @returns {VBox} The control containing the Layout Settings Panel content.
	 */
	private _getContent(): VBox {
		const oHeader = this._setHeaderIntro();
		const oTable = this.setLayoutTable();

		const oContentVBox = new VBox(this.getId() + "--idNewsPageOuterVBoX", {
			alignItems: "Start",
			justifyContent: "SpaceBetween",
			renderType: "Bare",
			items: [oHeader, oTable]
		});
		return oContentVBox;
	}

	/**
	 * Returns the content for the Layout Settings Panel Header.
	 *
	 * @private
	 * @returns {VBox} The control containing the Layout Settings Panel's Header content.
	 */
	private _setHeaderIntro(): VBox {
		const oHeaderText = new Text(this.getId() + "--idCustLayoutText", {
			text: this._i18nBundle.getText("layoutIntroMsg")
		});
		const oHeaderVBox = new VBox(this.getId() + "--idLayoutIntroText", {
			backgroundDesign: "Solid",
			alignItems: "Start",
			justifyContent: "SpaceBetween",
			items: [oHeaderText],
			renderType: "Bare"
		}).addStyleClass("sapUiSmallMargin");
		return oHeaderVBox;
	}

	/**
	 * Returns the content for the Layout Table.
	 *
	 * @private
	 * @returns {sap.ui.core.Control} The control containing the Layout Settings Panel'sTable.
	 */
	private setLayoutTable(): Table {
		if (!this._layoutTable) {
			this._layoutTable = new Table(this.getId() + "--idManageSectionsTable", {
				width: "calc(100% - 2rem)",
				items: [],

				columns: [
					new Column(this.getId() + "--idSectionTitleColumn", {
						width: "100%"
					})
				],
				dragDropConfig: new DragDropInfo(this.getId() + "--idManageSectionsDragInfo", {
					sourceAggregation: "items",
					targetAggregation: "items",
					groupName: "manageSectionsItems",
					dropPosition: "On",
					drop: (event: DropInfo$DropEvent) => {
						void this.onDropManageSections(event);
					}
				})
			}).addStyleClass("sapContrastPlus sapUiSmallMarginBeginEnd sapUiTinyMarginBottom");
		}

		return this._layoutTable;
	}

	/**
	 * Function to save section changes of MyHomeSettingsDialog
	 *
	 * @private
	 */
	private async _saveManageSectionsDialog(): Promise<void> {
		return this._persistUserChanges({
			changes: this._manageSectionsChanges,
			appComponent: PersonalisationUtils.getOwnerComponent(this._getPanel() as Layout)
		})
			.then(() => {
				const tableModel = this._layoutTable.getModel() as JSONModel;
				tableModel.refresh();
				this._controlModel.refresh();
			})
			.finally(() => {
				this._manageSectionsChanges = [];
			});
	}

	/**
	 * Function to persist user changes
	 *
	 * @private
	 */
	private _persistUserChanges(mProperties: { changes: IManagePersChanges[]; appComponent: Component | undefined }): Promise<void> {
		return Lib.load({ name: "sap.ui.fl" }).then(function () {
			return new Promise(function (resolve, reject) {
				sap.ui.require(
					["sap/ui/fl/write/api/ControlPersonalizationWriteAPI"],
					function (ControlPersonalizationWriteAPI: IControlPersonalizationWriteAPI) {
						ControlPersonalizationWriteAPI.add({
							changes: mProperties.changes,
							ignoreVariantManagement: true
						})
							.then(function (aGeneratedChanges) {
								return resolve(
									ControlPersonalizationWriteAPI.save({
										selector: {
											appComponent: mProperties.appComponent
										},
										changes: aGeneratedChanges
									})
								);
							})
							.catch(function (oError) {
								if (oError instanceof Error) {
									Log.error("Unable to Save User Change: " + oError.message);
									return reject(oError);
								}
							});
					}
				);
			});
		});
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
	 * Function to execute drag and drop among sections
	 *
	 * @private
	 */
	private async onDropManageSections(oEvent: DropInfo$DropEvent | IDragEvent): Promise<void> {
		const oWrapper = this._getPanel() as Layout;
		const wrapperId = oWrapper.getId();
		const oDragItem = ((oEvent as DropInfo$DropEvent).getParameter?.("draggedControl") ||
			(oEvent as IDragEvent).draggedControl) as ColumnListItem;
		const iDragItemIndex = (oDragItem.getParent() as Table)?.indexOfItem(oDragItem);
		const oDropItem = ((oEvent as DropInfo$DropEvent).getParameter?.("droppedControl") ||
			(oEvent as IDragEvent).droppedControl) as ColumnListItem;
		const iDropItemIndex = (oDragItem.getParent() as Table)?.indexOfItem(oDropItem);

		if (iDragItemIndex !== iDropItemIndex) {
			const sectionOrder = this._orderedSections;
			const dragObject = oDragItem.getBindingContext()?.getObject() as IElement;
			const dropObject = oDropItem.getBindingContext()?.getObject() as IElement;

			const actualDragItemIndex = this._getActualIndex(dragObject.completeId);
			const actualDropItemIndex = this._getActualIndex(dropObject.completeId);
			this._rearrangeLayoutElements(actualDragItemIndex, actualDropItemIndex);

			sectionOrder.splice(iDragItemIndex, 1);
			sectionOrder.splice(iDropItemIndex, 0, dragObject);
			oWrapper.setSections(sectionOrder);

			this._manageSectionsChanges.push({
				selectorElement: oWrapper,
				changeSpecificData: {
					changeType: CHANGE_TYPES.MOVE,
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
			});

			await this._saveManageSectionsDialog();

			//switch to collapsed view if any of the containers is in expanded view
			const draggedContainer = Element.getElementById(dragObject.completeId) as BaseContainer;
			const droppedContainer = Element.getElementById(dropObject.completeId) as BaseContainer;
			this._switchToCollapsedViewIfRequired([draggedContainer, droppedContainer]);
		}
	}

	/**
	 * Function to reset MyHome settings changes
	 *
	 * @private
	 */
	private resetMyhomeSettings(): void {
		MessageBox.show(this._i18nBundle.getText("reset_cards_confirmation_msg") as string, {
			id: "resetCardsConfirmation",
			icon: MessageBox.Icon.QUESTION,
			title: this._i18nBundle.getText("reset_cards_confirmation_title"),
			actions: [this._i18nBundle.getText("reset_cards_button") as string, MessageBox.Action.CANCEL],
			onClose: async (oAction: string) => {
				if (oAction === this._i18nBundle.getText("reset_cards_button")) {
					const aChangesForDeletion: (BaseContainer | BaseLayout)[] = [];

					for (let section of this._orderedSections) {
						const element = Element.getElementById(section.completeId) as BaseContainer;
						aChangesForDeletion.push(element);
					}
					// Revert Changes Related to DragnDrop
					aChangesForDeletion.push(this._getPanel() as Layout);
					await Lib.load({ name: "sap.ui.fl" }).then(() => {
						sap.ui.require(
							["sap/ui/fl/write/api/ControlPersonalizationWriteAPI"],
							(ControlPersonalizationWriteAPI: IControlPersonalizationWriteAPI) => {
								void ControlPersonalizationWriteAPI.reset({
									selectors: aChangesForDeletion,
									changeTypes: [CHANGE_TYPES.MOVE, CHANGE_TYPES.UNHIDE, CHANGE_TYPES.HIDE]
								}).finally(() => {
									const layout = this._getPanel() as Layout;
									layout.resetSections();
									layout.closeSettingsDialog();
								});
							}
						);
					});
				}
			}
		});
	}
}
