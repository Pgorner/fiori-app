/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import deepClone from "sap/base/util/deepClone";
import Button from "sap/m/Button";
import CheckBox from "sap/m/CheckBox";
import ComboBox from "sap/m/ComboBox";
import CustomListItem from "sap/m/CustomListItem";
import FlexBox from "sap/m/FlexBox";
import HBox from "sap/m/HBox";
import Input from "sap/m/Input";
import List from "sap/m/List";
import Select from "sap/m/Select";
import StepInput from "sap/m/StepInput";
import Text from "sap/m/Text";
import VBox from "sap/m/VBox";
import Event from "sap/ui/base/Event";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import Control, { $ControlSettings } from "sap/ui/core/Control";
import type { MetadataOptions } from "sap/ui/core/Element";
import Item from "sap/ui/core/Item";
import ListItem from "sap/ui/core/ListItem";
import RenderManager from "sap/ui/core/RenderManager";
import JSONModel from "sap/ui/model/json/JSONModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import { getFormatterConfiguration } from "../../config/FormatterOptions";
import type { FormatterConfiguration, FormatterConfigurationMap } from "../../helpers/Formatter";
import type { PropertyInfoMap } from "../../odata/ODataTypes";
import * as ODataUtils from "../../odata/ODataUtils";

export default interface FormatterSelection {
	getType(): string;
	getFormatters(): FormatterConfigurationMap;
}
interface PropertyType {
	value: number;
	defaultValue: number;
}

type PropertyOptions = {
	name: string;
	value: string;
};

interface CompactFormatterSelectionSettings extends $ControlSettings {
	type: string;
	formatters: FormatterConfiguration;
	change?: (event: CompactFormatterSelection$ChangeEvent) => void;
}

interface CompactFormatterSelectionChangeEventParameters {
	value?: object;
}

type CompactFormatterSelection$ChangeEvent = Event<CompactFormatterSelectionChangeEventParameters>;

/**
 * @namespace sap.cards.ap.generator.app.controls
 */
export default class CompactFormatterSelection extends Control {
	_selectorControl!: ComboBox;
	_deleteButton!: Button;
	_applyButton!: Button;
	_List!: List;

	static readonly metadata: MetadataOptions = {
		properties: {
			type: "string",
			formatters: "object"
		},
		aggregations: {
			_list: { type: "sap.m.List", multiple: false, visibility: "hidden" }
		},
		events: {
			change: {
				parameters: {
					value: { type: "object" }
				}
			}
		}
	};

	constructor(settings: CompactFormatterSelectionSettings) {
		super(settings);
	}

	renderer = {
		apiVersion: 2,
		render: function (rm: RenderManager, control: FormatterSelection): void {
			if (control.getType() === "COMPACT") {
				control._deleteButton.setVisible(false);
				control._applyButton.setVisible(false);
			}
			rm.openStart("div", control);
			rm.openEnd();
			rm.renderControl(control._selectorControl);
			rm.renderControl(control._deleteButton);
			rm.renderControl(control._List);
			rm.renderControl(control._applyButton);
			rm.close("div");
		}
	};

	/**
	 * Initializes the component
	 * This method creates a new List control (_List) and calls the superclass's init method
	 *
	 * @returns {void}
	 */

	init(): void {
		this._List = new List();
		super.init();
	}

	/**
	 * Sets the formatters for the control
	 *
	 * @param {FormatterConfigurationMap} formatters - An array of Formatter objects representing the formatters to be set.
	 * @returns {void}
	 */

	setFormatters(formatters: FormatterConfigurationMap): void {
		this.setAggregation("_list", this._List);
		this.setProperty("formatters", formatters, true);
		const model = this.getModel() as JSONModel;
		const selectedProperty = model.getProperty("/configuration/advancedFormattingOptions/targetFormatterProperty");
		const emptyObj = {} as FormatterConfiguration;
		let selectedFormatter: FormatterConfiguration = formatters.find((formatter) => formatter.property === selectedProperty) || emptyObj;
		const properties: PropertyInfoMap = model.getData().configuration.properties;
		const type = properties.find((property) => property.name === selectedProperty)?.type || "";
		this.createControl(type);
		if (
			selectedFormatter.formatterName === "format.unit" &&
			typeof selectedFormatter.parameters?.[1].properties?.[0].value === "number"
		) {
			const i18nModel = this.getModel("i18n") as ResourceModel;
			selectedFormatter.formatterName = "format.float";
			selectedFormatter.displayName = i18nModel.getObject("FORMAT_FLOAT");
			if (selectedFormatter.parameters) {
				selectedFormatter.parameters[0] = selectedFormatter.parameters[1];
			}
			selectedFormatter.parameters?.splice(1, 1);
		} else if (selectedFormatter.formatterName === "format.unit") {
			selectedFormatter = emptyObj;
		}
		this._refreshControl(selectedFormatter);
		if (selectedFormatter.formatterName) {
			this._selectorControl.setSelectedKey(selectedFormatter.formatterName);
		}
	}

	/**
	 * Refreshes the control with the provided formatter
	 * @param {FormatterConfiguration} formatter - The formatter to be used for refreshing the control
	 * @returns {void}
	 * @private
	 */

	_refreshControl(formatter: FormatterConfiguration): void {
		const listModel = new JSONModel({
			listItems: [formatter]
		});
		this._List
			.bindItems({
				path: "/listItems",
				template: new CustomListItem({
					content: [
						new VBox({
							justifyContent: "SpaceAround"
						}).bindAggregation("items", {
							path: "parameters",
							factory: this._createParametersControl.bind(this)
						})
					]
				})
			})
			.setModel(listModel);
	}

	/**
	 * Creates a select control with the formatter list based on the provided type
	 *
	 * @param {string} type - The type of the control to be created
	 * @returns {void}
	 */

	createControl(type: string): void {
		const i18nModel = this.getModel("i18n") as ResourceModel;
		let formatterConfigList: FormatterConfigurationMap = deepClone(getFormatterConfiguration());
		const isDateType = ODataUtils.isPropertyTypeDate(type);
		const isNumberType = type === "Edm.Decimal" || type === "Edm.Int16" || type === "Edm.Int32" || type === "Edm.Double";
		formatterConfigList = formatterConfigList.filter((formatterConfig) => formatterConfig.visible === true);
		if (isDateType) {
			formatterConfigList = formatterConfigList.filter((formatterConfig) => formatterConfig.type === "Date");
		} else if (isNumberType) {
			formatterConfigList = formatterConfigList.filter(
				(formatterConfig) => formatterConfig.type === "numeric" || formatterConfig.type === "string | numeric"
			);
		} else {
			formatterConfigList = formatterConfigList.filter(
				(formatterConfig) => formatterConfig.type === "string" || formatterConfig.type === "string | numeric"
			);
		}
		const formatterListModel = new JSONModel({
			formattersList: formatterConfigList
		});
		this._selectorControl = new ComboBox({
			width: "80%",
			items: {
				path: "/formattersList",
				template: new ListItem({
					key: "{formatterName}",
					text: "{displayName}"
				})
			},
			change: this.onFormatterSelected.bind(this)
		})
			.addStyleClass("sapUiTinyMarginBegin")
			.setModel(formatterListModel);
		this._deleteButton = new Button({
			icon: "sap-icon://delete",
			type: "Transparent",
			press: this.deleteFormatter.bind(this)
		});
		this._applyButton = new Button({
			text: i18nModel.getObject("FORMATTER_CONTROL_APPLY"),
			type: "Ghost",
			press: this.applyFormatter.bind(this)
		});
	}

	/**
	 * Creates a control for displaying and editing parameters based on the provided property type
	 *
	 * @param {string} id - ID of the control
	 * @param {*} context - context object containing information about the property
	 * @returns {sap.ui.core.Control} A control for displaying and editing parameters
	 * @private
	 */

	_createParametersControl(id: string, context: any): Control {
		const property = context.getProperty();
		const propertyType = property.type;
		let inputControl: CheckBox | Select | Input | StepInput,
			hBoxItems: (Text | CheckBox | Select | Input)[] = [];
		if (propertyType !== "object") {
			hBoxItems = [
				new Text({
					width: "200px",
					text: "{displayName} : "
				}).addStyleClass("sapUiTinyMarginTop sapUiTinyMarginBegin")
			];
		}
		switch (propertyType) {
			case "boolean":
				inputControl = new CheckBox({ width: "116px", selected: "{selected}" });
				break;
			case "enum":
				inputControl = this._createSelectControl("{selectedKey}", property.options);
				break;
			case "object": {
				const flexBoxItems = [];
				for (let i = 0; i < property.properties.length; i++) {
					const currentProperty = property.properties[i];
					if (currentProperty && typeof currentProperty.value !== "object") {
						const rowItem = [];
						const displayName = currentProperty.displayName;
						const propertyType = currentProperty.type;
						switch (propertyType) {
							case "boolean":
								inputControl = new CheckBox({
									width: "116px",
									selected: { path: "properties/" + i + "/selected/" }
								});
								break;
							case "enum":
								inputControl = this._createSelectControl("{properties/" + i + "/selectedKey}", currentProperty.options);
								break;
							case "number":
								this.setDefaultStepInputValue(currentProperty);
								const bindingInfo: PropertyBindingInfo = { path: `properties/${i}/value` };
								inputControl = new StepInput({ width: "116px", min: 0, max: 2, value: bindingInfo });
								break;
							default:
								inputControl = new Input({ width: "176px", value: "{properties/" + i + "/value}" });
						}
						rowItem.push(
							new Text({
								width: "200px",
								text: displayName + " : "
							}).addStyleClass("sapUiTinyMarginTop sapUiTinyMarginBegin")
						);
						rowItem.push(inputControl);
						const hBox = new HBox({ justifyContent: "Start", items: rowItem });
						flexBoxItems.push(hBox);
					}
				}
				return new FlexBox({ items: flexBoxItems, direction: "Column" });
			}
			default:
				inputControl = new Input({ width: "108px", value: "{value}" });
				break;
		}
		hBoxItems.push(inputControl);
		return new HBox({ justifyContent: "Start", items: hBoxItems });
	}

	setDefaultStepInputValue(prop: PropertyType) {
		prop.value = prop.value >= 0 ? prop.value : prop.defaultValue;
		return prop;
	}
	/**
	 * Creates a select control based on the provided selected key and property options
	 *
	 * @param {string} selectedKey - The selected key for the select control
	 * @param {Array<PropertyOptions>} propertyOptions - An array of propertyOptions representing the options for the select control
	 * @returns {sap.m.Select} Select control populated with the provided property options
	 * @private
	 */

	_createSelectControl(selectedKey: string, propertyOptions: Array<PropertyOptions>) {
		const inputControl = new Select({
			width: "108px",
			selectedKey: selectedKey
		});
		for (const item of propertyOptions) {
			inputControl.addItem(
				new Item({
					text: item.name,
					key: item.value
				})
			);
		}
		return inputControl;
	}

	/**
	 * Handles the event when a formatter is selected
	 *
	 * @param {Event} event - The event object representing the selection event
	 * @returns {void}
	 */

	onFormatterSelected(event: Event): void {
		const model = this.getModel() as JSONModel;
		const targetProperty = model.getProperty("/configuration/advancedFormattingOptions/targetFormatterProperty");
		const source = event.getSource() as ComboBox;
		const selectedKey = source.getSelectedKey();
		const formatterConfig = getFormatterConfiguration().find((formatter) => {
			return formatter.formatterName === selectedKey;
		}) as FormatterConfiguration;

		const isSelectedKey = selectedKey && formatterConfig ? true : false;
		model.setProperty("/configuration/advancedFormattingOptions/isFormatterApplied", isSelectedKey);

		this._refreshControl(Object.assign({ property: targetProperty }, deepClone(formatterConfig)));
	}

	/**
	 * Applies the selected formatter to the control, fires the change event with the updated propertyValueFormatters
	 *
	 * @returns {void}
	 */

	applyFormatter(): void {
		const listItemsData = (this._List.getModel() as JSONModel).getProperty("/listItems");
		this._updatePropertyValueFormatters(listItemsData[0]);
		const propertyValueFormatters = (this.getModel() as JSONModel).getProperty(
			"/configuration/advancedFormattingOptions/propertyValueFormatters"
		);
		this.fireEvent("change", {
			value: propertyValueFormatters
		});
	}

	/**
	 * Deletes the selected formatter from the control, fires the change event with the updated propertyValueFormatters
	 *
	 * @returns {void}
	 */

	deleteFormatter(): void {
		const model = this.getModel() as JSONModel;
		const targetProperty = model.getProperty("/configuration/advancedFormattingOptions/targetFormatterProperty");
		const propertyValueFormatters = this.getFormatters() as FormatterConfigurationMap;
		let index = -1;
		propertyValueFormatters.forEach((propertyValueFormatter, i) => {
			if (propertyValueFormatter.property === targetProperty) {
				index = i;
			}
		});
		if (index !== -1) {
			propertyValueFormatters.splice(index, 1);
		}
		model.setProperty("/configuration/advancedFormattingOptions/propertyValueFormatters", propertyValueFormatters);
		const emptyObj = {} as FormatterConfiguration;
		this._refreshControl(emptyObj);
		this.fireEvent("change", {
			value: propertyValueFormatters
		});
		this._selectorControl.setSelectedKey("");
	}

	/**
	 * Updates the propertyValueFormatters model with the provided formatter configuration
	 *
	 * @param formatterConfig - The formatter configuration to be updated
	 * @returns {void}
	 * @private
	 */
	_updatePropertyValueFormatters(formatterConfig: FormatterConfiguration): void {
		if (formatterConfig.parameters) {
			const parameterLength = formatterConfig.parameters.length;

			for (let i = 0; i < parameterLength; i++) {
				if (formatterConfig.parameters[i].type === "string") {
					// If a parameter is of type string, set the value to an empty string if it is undefined
					formatterConfig.parameters[i].value = formatterConfig.parameters[i].value || formatterConfig.parameters[i].defaultValue;
				}
			}
		}

		const targetProperty = formatterConfig.property;
		const propertyValueFormatters = this.getFormatters() as FormatterConfigurationMap;
		let index = -1;
		propertyValueFormatters.forEach((propertyValueFormatter, i) => {
			if (propertyValueFormatter.property === targetProperty) {
				index = i;
			}
		});
		if (index !== -1) {
			propertyValueFormatters[index] = formatterConfig;
		} else {
			propertyValueFormatters.push(formatterConfig);
		}
		(this.getModel() as JSONModel).setProperty(
			"/configuration/advancedFormattingOptions/propertyValueFormatters",
			propertyValueFormatters
		);
	}
}
