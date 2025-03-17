/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import Button from "sap/m/Button";
import ComboBox from "sap/m/ComboBox";
import CustomListItem from "sap/m/CustomListItem";
import HBox, { $HBoxSettings } from "sap/m/HBox";
import List from "sap/m/List";
import Text from "sap/m/Text";
import Event from "sap/ui/base/Event";
import Control, { $ControlSettings } from "sap/ui/core/Control";
import type { MetadataOptions } from "sap/ui/core/Element";
import CoreElement from "sap/ui/core/Element";
import ListItem from "sap/ui/core/ListItem";
import RenderManager from "sap/ui/core/RenderManager";
import { ValueState } from "sap/ui/core/library";
import Context from "sap/ui/model/Context";
import Model from "sap/ui/model/Model";
import Sorter from "sap/ui/model/Sorter";
import JSONModel from "sap/ui/model/json/JSONModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import { TEXTARRANGEMENT_OPTIONS } from "../../config/TextArrangementOptions";
import { NavigationParameter, Property } from "../../helpers/CardGeneratorModel";
import type { PropertyInfo } from "../../odata/ODataTypes";

export type ArrangementOptions = {
	name: string;
	value: string;
	propertyKeyForId?: string;
	propertyKeyForDescription: string;
	navigationKeyForId: string;
	navigationKeyForDescription: string;
	isNavigationForId: boolean;
	isNavigationForDescription: boolean;
	navigationalPropertiesForId: Property[];
	navigationalPropertiesForDescription: Property[];
	textArrangement?: string;
	arrangementType: string;
};

interface IArrangementsEditor {
	getMode(): string;
	getSelectionKeys(): object;
	getItems(): Array<ArrangementOptions>;
	_addButton: Button;
	_list: List;
}

interface ArrangementsEditorSettings extends $ControlSettings {
	mode: string;
	selectionKeys: object;
	navigationSelectionKeys: object;
	items: object;
	change?: (event: ArrangementsEditorChangeEvent) => void;
	selectionChange?: (event: ArrangementsEditorSelectionChangeEvent) => void;
}
interface ArrangementsEditorChangeEventParameters {
	value?: number;
}
interface ArrangementsEditorSelectionChangeEventParameters {
	value?: number;
}

type ArrangementsEditorChangeEvent = Event<ArrangementsEditorChangeEventParameters>;
type ArrangementsEditorSelectionChangeEvent = Event<ArrangementsEditorSelectionChangeEventParameters>;

type PropertyMap = {
	[key: string]: string;
};
type PropertyInfoMap = Array<PropertyMap>;

/**
 * @namespace sap.cards.ap.generator.app.controls
 */
export default class ArrangementsEditor extends Control {
	_list!: List;
	_propertyComboBox!: ComboBox;
	_idNavigationComboBox!: ComboBox;
	_addButton!: Button;
	_separatorColon!: Text;
	_uomComboBox!: ComboBox;
	_descriptionNavigationComboBox!: ComboBox;
	_separatorColonText!: Text;
	_textArrangementComboBox!: ComboBox;
	_deleteButton!: Button;
	errorFlag!: boolean;
	_setSelectionKeysMap!: PropertyInfo;

	static readonly metadata: MetadataOptions = {
		properties: {
			mode: "string",
			selectionKeys: { type: "object", defaultValue: {} },
			navigationSelectionKeys: { type: "object", defaultValue: {} },
			items: { type: "object", defaultValue: {} }
		},
		aggregations: {
			_list: { type: "sap.m.List", multiple: false, visibility: "hidden" }
		},
		events: {
			change: {
				parameters: {
					value: { type: "int" }
				}
			},
			selectionChange: {
				parameters: {
					value: { type: "int" }
				}
			}
		}
	};

	constructor(settings: ArrangementsEditorSettings) {
		super(settings);
	}

	renderer = {
		apiVersion: 2,
		render: function (rm: RenderManager, control: IArrangementsEditor): void {
			rm.openStart("div", control);
			rm.openEnd();
			rm.renderControl(control._list);
			rm.renderControl(control._addButton);
			rm.close("div");
		}
	};

	/**
	 * Initializes the ArrangementsEditor custom control
	 *
	 * This method sets up various controls and event handlers used by the methods in this control
	 *
	 * @returns {void}
	 */

	init(): void {
		const that = this;
		this._list = new List();
		this._propertyComboBox = new ComboBox({
			selectionChange: function (event: Event) {
				that.handleComboBoxEvents(event, that, false, true);
			},
			change: function (event: Event) {
				const source: ComboBox = event.getSource();
				const bindingContext = source.getBindingContext() as Context;
				const path = bindingContext?.getPath() || "";
				const model = that.getModel() as JSONModel;
				const selectedItem = model.getProperty(path);
				const textArrangementChanged = true;
				that.fireEvent("change", {
					value: that.getItems(),
					selectedItem,
					textArrangementChanged
				});
			}
		});
		this._separatorColon = new Text({ text: ":" }).addStyleClass("sapUiTinyMarginTop");
		this._idNavigationComboBox = new ComboBox({
			visible: "{= !!${isNavigationForId} }",
			change: function () {
				that.fireEvent("change", {
					value: that.getItems()
				});
			},
			selectionChange: function (event: Event) {
				that.handleComboBoxEvents(event, that, true);
			}
		});
		this._uomComboBox = new ComboBox({
			change: function (event: Event) {
				const source: ComboBox = event.getSource();
				const bindingContext = source.getBindingContext() as Context;
				const path = bindingContext?.getPath() || "";
				const model = that.getModel() as JSONModel;
				const selectedItem = model.getProperty(path);
				that.fireEvent("change", {
					value: that.getItems(),
					selectedItem
				});
			},
			selectionChange: function (event: Event) {
				that.handleComboBoxEvents(event, that);
			}
		});
		this._descriptionNavigationComboBox = new ComboBox({
			visible: "{= !!${isNavigationForDescription} }",
			change: function () {
				that.fireEvent("change", {
					value: that.getItems()
				});
			},
			selectionChange: function (event: Event) {
				that.handleComboBoxEvents(event, that, true);
			}
		});
		this._separatorColonText = new Text({ text: ":" }).addStyleClass("sapUiTinyMarginTop");
		this._textArrangementComboBox = new ComboBox({
			change: function () {
				that.fireEvent("change", {
					type: "text",
					value: that.getItems()
				});
			},
			selectionChange: function (event: Event) {
				const controlId = event.getParameter("id");
				const control = CoreElement.getElementById(controlId) as ComboBox;
				const selectedKey = control.getSelectedKey();
				const source: ComboBox = event.getSource();
				const bindingContext = source.getBindingContext() as Context;
				const path = bindingContext?.getPath() || "";
				const model = that.getModel() as JSONModel;
				const group = model.getProperty(path);
				group.textArrangement = `${selectedKey}`;
				model.refresh();
			}
		});
		this._deleteButton = new Button({
			icon: "sap-icon://delete",
			type: "Transparent",
			press: this._onDeleteButtonClicked.bind(this)
		});
		this._addButton = new Button({
			icon: "sap-icon://add",
			type: "Transparent",
			press: this._onAddButtonClicked.bind(this)
		});
	}

	/**
	 * Performs actions after ArrangementsEditor custom control has been rendered
	 *
	 * This method is called after the control has been rendered in the UI
	 * It updates entity data and refreshes the internal model of the TextArrangementComboBox
	 *
	 * @returns {void}
	 */

	onAfterRendering(): void {
		const entityData = JSON.parse(JSON.stringify(this.getSelectionKeys())) as PropertyInfoMap;
		const name = this._setSelectionKeysMap.name ?? "";
		const label = this._setSelectionKeysMap.label;
		const textArrangement = this._setSelectionKeysMap.textArrangement ?? "";
		entityData.forEach((entity) => {
			entity.name = entity[name] as string;
			entity.label = entity[label] as string;
			entity.textArrangement = entity[textArrangement] as string;
		});
		const _textArrangementComboBoxModel = this._textArrangementComboBox.getModel("internal") as JSONModel;
		const i18nModel = this.getModel("i18n") as ResourceModel;
		TEXTARRANGEMENT_OPTIONS.forEach((option) => {
			option.label = i18nModel.getObject(option.label);
		});
		_textArrangementComboBoxModel.setData(TEXTARRANGEMENT_OPTIONS, true);
		_textArrangementComboBoxModel.refresh();
	}

	/**
	 * Sets the selection keys
	 *
	 * This method forms the _setSelectionKeysMap from selectionKeys binding information,
	 * and binds aggregation items for ComboBox controls, updates internal model of text arrangement ComboBox
	 *
	 * @param {Array<PropertyInfo>} selectionKeysArr - The array of selection keys
	 * @returns {void}
	 */

	setSelectionKeys(selectionKeysArr: Array<PropertyInfo>): void {
		const that = this;
		that.setAggregation("_list", that._list);
		this.setProperty("selectionKeys", selectionKeysArr);
		this.setProperty("navigationSelectionKeys", selectionKeysArr);
		this._setSelectionKeysMap = this.getBindingInfo("selectionKeys").parameters as PropertyInfo;
		const bindingPath = this.getBindingPath("selectionKeys") || "";
		const navigationBindingPath = this.getBindingPath("navigationSelectionKeys") || "";

		this._propertyComboBox.bindAggregation("items", {
			path: this.getMode() !== "uom" ? navigationBindingPath : bindingPath,
			...(this.getMode() !== "uom" && { sorter: new Sorter("category", true, true) }),
			length: 500,
			factory: function () {
				return new ListItem({
					key: "{" + that._setSelectionKeysMap.name + "}",
					text: "{" + that._setSelectionKeysMap.label + "}"
				});
			}
		});
		this._uomComboBox.bindAggregation("items", {
			path: this.getMode() !== "uom" ? navigationBindingPath : bindingPath,
			...(this.getMode() !== "uom" && { sorter: new Sorter("category", true, true) }),
			length: 500,
			factory: function () {
				return new ListItem({
					key: "{" + that._setSelectionKeysMap.name + "}",
					text: "{" + that._setSelectionKeysMap.label + "}"
				});
			}
		});
		that._idNavigationComboBox.bindAggregation("items", {
			path: "navigationalPropertiesForId/",
			length: 500,
			factory: function () {
				return new ListItem({
					key: "{name}",
					text: "{labelWithValue}"
				});
			}
		});
		that._descriptionNavigationComboBox.bindAggregation("items", {
			path: "navigationalPropertiesForDescription/",
			length: 500,
			factory: function () {
				return new ListItem({
					key: "{name}",
					text: "{labelWithValue}"
				});
			}
		});
		this._textArrangementComboBox.setModel(this._getTextArrangementModel(), "internal");
		this._textArrangementComboBox.bindAggregation("items", {
			path: "internal>/",
			factory: function () {
				return new ListItem({
					key: "{internal>name}",
					text: "{internal>label}"
				});
			}
		});
	}

	/**
	 * Sets the items property with the selectionKeysArr provided
	 * bind items for _list control using binding path of items,
	 * creates a custom layout for each item using a HBox and arranging the content within the HBox according to the specified styles
	 *
	 * @param {Array<ArrangementOptions>} selectionKeysArr - The array of items to be set
	 * @returns {void}
	 */

	setItems(selectionKeysArr: Array<ArrangementOptions>): void {
		this.setProperty("items", selectionKeysArr, true);
		this._propertyComboBox.bindProperty("selectedKey", { path: "propertyKeyForId" });
		this._idNavigationComboBox.bindProperty("selectedKey", { path: "navigationKeyForId" });
		this._uomComboBox.bindProperty("selectedKey", { path: "propertyKeyForDescription" });
		this._descriptionNavigationComboBox.bindProperty("selectedKey", { path: "navigationKeyForDescription" });
		this._textArrangementComboBox.bindProperty("selectedKey", { path: "arrangementType" });
		const bindingPath = this.getBindingPath("items") ?? "";

		this._list.bindItems({
			path: bindingPath,
			template: new CustomListItem({
				content: [
					new HBox({
						justifyContent: "SpaceAround",
						items: [
							this._propertyComboBox,
							this.getMode() !== "uom" && this._idNavigationComboBox,
							this._separatorColon,
							this._uomComboBox,
							this.getMode() !== "uom" && this._separatorColonText,
							this.getMode() !== "uom" && this._descriptionNavigationComboBox,
							this.getMode() !== "uom" && this._separatorColonText,
							this.getMode() !== "uom" && this._textArrangementComboBox,
							this._deleteButton
						],
						width: "100%",
						alignItems: "Start",
						fitContainer: true
					} as $HBoxSettings)
				]
			})
		});
	}

	/**
	 * Retrieves the internal model of the ArrangementsEditor control
	 *
	 * This method checks if the internal model exists. If not, it creates a new JSON model
	 * and sets it as the internal model. It then returns the internal model
	 *
	 * @returns {sap.ui.model.Model} The internal model of the control
	 */

	_getInternalModel(): Model {
		if (!this.getModel("internal")) {
			const model = new JSONModel({});
			this.setModel(model, "internal");
		}
		return this.getModel("internal") as Model;
	}

	/**
	 * Retrieves the items from the model
	 *
	 * This method fetches the items from the model using the binding path for items
	 *
	 * @returns {Array<ArrangementOptions>} An array containing the items retrieved from the model
	 */

	getItems(): Array<ArrangementOptions> {
		const path = this.getBindingPath("items") || "";
		return (this.getModel() as JSONModel).getProperty(path);
	}
	getSelectedItem(): Array<ArrangementOptions> {
		const path = this.getBindingPath("items") || "";
		return (this.getModel() as JSONModel).getProperty(path);
	}

	/**
	 * Creates and returns a JSON model for text arrangement options
	 *
	 * This method creates a new JSON model using the provided text arrangement options and returns it.
	 *
	 * @returns {sap.ui.model.json.JSONModel} A JSON model containing text arrangement options
	 */

	_getTextArrangementModel(): JSONModel {
		return new JSONModel(TEXTARRANGEMENT_OPTIONS);
	}

	/**
	 * Handles the click event of the add button, adds a new item to the array and refreshes the model
	 *
	 * @returns {void}
	 */

	_onAddButtonClicked(): void {
		const model = this.getModel();
		const path = this.getBindingPath("items") || "";
		if (model) {
			let boundData = model.getProperty(path);
			if (!boundData) {
				boundData = [];
			}
			boundData.push({});
			model.refresh();
		}
	}

	/**
	 * Handles the click event of the delete button, removes item to be deleted, refreshes the model and fires a change event
	 *
	 * @param {Event} event - The event object representing the click event
	 * @returns {void}
	 */

	_onDeleteButtonClicked(event: Event): void {
		const source = event.getSource() as Control;
		const path = (source.getBindingContext() as Context).getPath();
		const bindingPath = this.getBindingPath("items") || "";
		const model = this.getModel() as JSONModel;
		const bindingPathProperty = model.getProperty(bindingPath);
		bindingPathProperty && bindingPathProperty.splice(path.slice(path.length - 1), 1);
		model.refresh();
		this.fireEvent("change", {
			value: this.getItems()
		});
	}

	handleComboBoxEvents(event: Event, editor: ArrangementsEditor, isNavigation: boolean = false, isTextArrangementID: boolean = false) {
		const controlId = event.getParameter("id");
		const control = CoreElement.getElementById(controlId) as ComboBox;
		const selectedKey = control.getSelectedKey();
		const source = event.getSource();
		const bindingContext = (source as ComboBox).getBindingContext() as Context;
		const path = bindingContext?.getPath() || "";
		const value = control.getValue();
		const model = editor.getModel() as JSONModel;
		const group = model.getProperty(path);
		const i18nModel = editor.getModel("i18n") as ResourceModel;

		const navigationProperties: NavigationParameter[] = model.getProperty("/configuration/navigationProperty") || [];
		const isNavigationalProperty = this.hasNavigationProperty(navigationProperties, group.propertyKeyForDescription);
		// Determine the group name based on conditions
		group.name = this.getGroupName(group, isNavigation, isTextArrangementID);
		let navigationKey = "";
		if (group.navigationKeyForDescription) {
			navigationKey = `/${group.navigationKeyForDescription}`;
		}

		const groupVal = isNavigationalProperty ? `${group.propertyKeyForDescription}${navigationKey}` : group.propertyKeyForDescription;
		const isValidation = group.name === groupVal;
		// Update group value based on conditions
		if (!isValidation) {
			group.value = this.getGroupValue(group, isNavigation, isTextArrangementID, selectedKey, navigationProperties);
		}
		this.updateControlState(control, value, selectedKey, isValidation, i18nModel, editor);
		model.refresh();
		return group;
	}

	getGroupName(group: ArrangementOptions, isNavigation: boolean, isTextArrangementID: boolean): string {
		if (isNavigation) {
			return group.navigationKeyForId ? `${group.propertyKeyForId}/${group.navigationKeyForId}` : `${group.propertyKeyForId}`;
		}
		if (isTextArrangementID) {
			return `${group.propertyKeyForId}`;
		}
		return group.navigationKeyForId ? `${group.propertyKeyForId}/${group.navigationKeyForId}` : `${group.propertyKeyForId}`;
	}

	getGroupValue(
		group: ArrangementOptions,
		isNavigation: boolean,
		isTextArrangementID: boolean,
		selectedKey: string,
		navigationProperties: NavigationParameter[]
	): string {
		const { propertyKeyForId, propertyKeyForDescription, navigationKeyForDescription } = group;

		if (isNavigation) {
			return navigationKeyForDescription ? `${propertyKeyForDescription}/${navigationKeyForDescription}` : propertyKeyForDescription;
		}

		if (isTextArrangementID) {
			const isNavigationalProperty = this.hasNavigationProperty(navigationProperties, propertyKeyForId as string);
			if (navigationKeyForDescription) {
				return isNavigationalProperty ? `${propertyKeyForId}` : `${propertyKeyForDescription}/${navigationKeyForDescription}`;
			}
			return isNavigationalProperty ? (propertyKeyForId as string) : propertyKeyForDescription;
		}

		return propertyKeyForDescription || selectedKey;
	}

	updateControlState(
		control: ComboBox,
		value: string,
		selectedKey: string,
		isValidation: boolean,
		i18nModel: ResourceModel,
		editor: ArrangementsEditor
	) {
		if (!selectedKey && value) {
			control.setValueState(ValueState.Error);
			control.setValueStateText(i18nModel.getObject("INVALID_SELECTION"));
			editor.errorFlag = true;
		} else if (isValidation) {
			control.setValueState(ValueState.Warning);
			control.setValueStateText(i18nModel.getObject("SAME_SELECTION"));
			editor.errorFlag = true;
		} else {
			control.setValueState(ValueState.None);
			editor.errorFlag = false;
		}
	}

	hasNavigationProperty(navigationProperties: NavigationParameter[], propertyToCheck: string) {
		return navigationProperties.length > 0 && navigationProperties.some((prop) => prop.name === propertyToCheck);
	}
}
