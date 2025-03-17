/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import { date, dateTime } from "sap/ui/integration/formatters/DateTimeFormatter";
import type { PropertyInfo, PropertyInfoMap } from "../odata/ODataTypes";
import * as ODataUtils from "../odata/ODataUtils";

export const formatPropertyDropdownValues = function (property: PropertyInfo, value: string) {
	const type = property.type;
	switch (type) {
		case "Edm.Boolean":
			break;
		case "Edm.Date":
		case "Edm.DateTime":
			value = date(value, { UTC: true });
			break;
		case "Edm.DateTimeOffset":
			value = dateTime(value, { UTC: true });
			break;
		case "Edm.DateTimeInterval":
		case "Edm.Time":
			break;
		case "Edm.String":
			if (value?.length === 0) {
				value = "<empty>";
			}
			break;
		case "Edm.Integer":
		case "Edm.Float":
			break;
		default:
			break;
	}
	return `${property.label} (${value})`;
};

export const createFormatterExpression = function (oFormatterDetail: FormatterConfiguration) {
	const aFormatterArguments = [];
	aFormatterArguments.push("${" + oFormatterDetail.property + "}");
	let content = oFormatterDetail.formatterName + "("; // dont close brackets here

	const mOptions: Record<string, string | boolean | number> = {};
	oFormatterDetail.parameters?.forEach(function (mParameters) {
		if (mParameters.properties && mParameters.properties.length > 0) {
			mParameters.properties.forEach(function (oProperties: SingleFormatterProperty) {
				switch (oProperties.type) {
					case "boolean":
						if (!oProperties.selected) {
							oProperties.selected = false;
						}
						mOptions[oProperties.name] = oProperties.selected;
						break;
					case "number":
						if (typeof oProperties.value === "number") {
							mOptions[oProperties.name] = parseFloat(oProperties.value);
						}
						break;
					case "enum":
						if (oProperties.selectedKey) {
							mOptions[oProperties.name] = oProperties.selectedKey;
						}
						break;
					default:
						mOptions[oProperties.name] = oProperties.value;
						break;
				}
			});
			if (JSON.stringify(mOptions) !== "{}") {
				aFormatterArguments.push(JSON.stringify(mOptions));
			}
		} else {
			switch (mParameters.type) {
				case "boolean":
					if (!mParameters.selected) {
						mParameters.selected = false;
					}
					aFormatterArguments.push(mParameters.selected);
					break;
				case "number":
					aFormatterArguments.push(parseFloat(mParameters.value));
					break;
				case "enum":
					aFormatterArguments.push(mParameters.selectedKey);
					break;
				default:
					aFormatterArguments.push(mParameters.value);
					break;
			}
		}
	});
	content = content.concat(aFormatterArguments[0]);
	for (let i = 1; i < aFormatterArguments.length; i++) {
		const aFormatter = aFormatterArguments[i];
		const bindingOrFormatterArray = ["{", "[", "$"];
		const hasBindingOrFormatter = bindingOrFormatterArray.some((item) => aFormatter.startsWith(item));
		if (typeof aFormatter === "string" && !hasBindingOrFormatter) {
			content = content.concat(", '" + aFormatter + "' ");
		} else {
			content = content.concat(", " + aFormatter);
		}
	}
	return content + ")";
};

/**
 * Generates the default property formatter configuration for date properties.
 *
 * @param {ResourceBundle} i18nModel - The internationalization model used for localization.
 * @param {PropertyInfoMap} properties - The map of property information.
 * @returns {FormatterConfigurationMap} - The configuration map for date formatters.
 */
export const getDefaultPropertyFormatterConfig = function (i18nModel: ResourceBundle, properties: PropertyInfoMap): FormatterConfigurationMap {
	const dateFormatterConfig: FormatterConfigurationMap = [];
	for (const property of properties) {
		const isPropertyTypeDate = ODataUtils.isPropertyTypeDate(property.type);
		if (property.name && isPropertyTypeDate) {
			const configData = getDateFormatterConfiguration(property.name, property.type, i18nModel) as FormatterConfiguration;
			dateFormatterConfig.push(configData);
		}
	}
	return dateFormatterConfig;
};

/**
 * Generates the default property formatter configuration for navigation properties.
 *
 * @param {ResourceBundle} i18nModel - The internationalization model used for localization.
 * @param {PropertyInfoMap} navProperties - The map of navigation properties.
 * @returns {FormatterConfigurationMap} The formatter configuration map for date properties.
 */
export const getDefaultPropertyFormatterConfigForNavProperties = function (i18nModel: ResourceBundle, navProperties: PropertyInfoMap): FormatterConfigurationMap {
	const dateFormatterConfig: FormatterConfigurationMap = [];
	for (const navProperty of navProperties) {
		const properties = navProperty.properties as PropertyInfoMap || [];
		for (const property of properties) {
			const propertyName = navProperty.name + "/" + property.name;
			const isPropertyTypeDate = ODataUtils.isPropertyTypeDate(property.type);
			if (propertyName && isPropertyTypeDate) {
				const configData = getDateFormatterConfiguration(propertyName, property.type, i18nModel) as FormatterConfiguration;
				dateFormatterConfig.push(configData);
			}
		}
	}
	return dateFormatterConfig;
};
 
/**
 * Generates configuration data for a given property based on its type.
 *
 * @param {string} propertyName - The name of the property.
 * @param {string} propertyType - The type of the property (e.g., "Edm.DateTimeOffset", "Edm.TimeOfDay", "Edm.DateTime", "Edm.Date").
 * @param {ResourceBundle} i18nModel - The internationalization model used to get localized text.
 * @returns {FormatterConfiguration} The configuration data for the specified property.
 */
function getDateFormatterConfiguration(propertyName: string, propertyType: string, i18nModel: ResourceBundle) {
	if (propertyType === "Edm.DateTimeOffset" || propertyType === "Edm.TimeOfDay") {
		const configData: FormatterConfiguration = {
			property: propertyName,
			formatterName: "format.dateTime",
			displayName: i18nModel.getText("FORMAT_DATETIME") ?? "",
			parameters: [
				{
					name: "options",
					displayName: "Options",
					type: "object",
					defaultValue: "",
					properties: [
						{
							name: "relative",
							displayName: i18nModel.getText("RELATIVE") ?? "",
							type: "boolean",
							defaultValue: false
						},
						{
							name: "UTC",
							displayName: i18nModel.getText("UTC") ?? "",
							type: "boolean",
							defaultValue: false,
							selected: true
						}
					]
				}
			],
			type: "Date",
			visible: true
		};
		return configData;
	} else if (propertyType === "Edm.DateTime" || propertyType === "Edm.Date") {
		const configData: FormatterConfiguration = {
			property: propertyName,
			formatterName: "format.date",
			displayName: i18nModel.getText("FORMAT_DATE") ?? "",
			parameters: [
				{
					name: "options",
					displayName: "Options",
					type: "object",
					defaultValue: "",
					properties: [
						{
							name: "UTC",
							displayName: i18nModel.getText("UTC") ?? "",
							type: "boolean",
							defaultValue: false,
							selected: true
						}
					]
				}
			],
			type: "Date",
			visible: true
		};
		return configData;
	}
}

type SupportedPropertyTypes = "boolean" | "number" | "enum" | "string" | "object";
export type SingleFormatterProperty = {
	name: string;
	displayName: string;
	type: SupportedPropertyTypes;
	defaultValue?: boolean | number | string;
	selected?: boolean;
	value?: string;
	selectedKey?: string;
	defaultSelectedKey?: string;
	bIsProperty?: boolean;
	options?: Array<{
		name: string;
		value: string;
	}>;
};

type SingleFormatterParameter = {
	name: string;
	displayName: string;
	type: SupportedPropertyTypes;
	defaultValue?: string;
	value?: string;
	selectedKey?: string;
	selected?: boolean;
	properties?: Array<SingleFormatterProperty>;
	defaultSelectedKey?: string;
	options?: Array<{
		name: string;
		value: string;
	}>;
};

export type FormatterConfiguration = {
	property?: string;
	formatterName: string;
	displayName: string;
	parameters?: Array<SingleFormatterParameter>;
	type: string;
	visible: boolean;
};

export type FormatterConfigurationMap = Array<FormatterConfiguration>;
