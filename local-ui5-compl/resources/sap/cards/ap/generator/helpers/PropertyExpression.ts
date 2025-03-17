/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import Log from "sap/base/Log";
import BindingParser from "sap/ui/base/BindingParser";
import { CardManifest } from "sap/ui/integration/widgets/Card";
import { ArrangementOptions } from "../app/controls/ArrangementsEditor";
import { getFormatterConfiguration } from "../config/FormatterOptions";
import type { FormatterConfiguration, FormatterConfigurationMap } from "./Formatter";
import { createFormatterExpression } from "./Formatter";

type JSONObject = {
	[key: string]: string | boolean | number;
};

type FormatterConfigParameters = string | JSONObject;

type ParsedFormatterExpression = {
	formatterName: string;
	propertyPath: string;
	parameters: Array<FormatterConfigParameters>;
};

type PropertyFormattingOptions = {
	unitOfMeasures: Array<{
		[key: string]: string;
	}>;
	textArrangements: ArrangementOptions[];
	propertyValueFormatters: FormatterConfigurationMap;
};

/**
 * This function checks if the property value is an expression
 *
 * @param {string} propertyValue
 * @returns {boolean}
 */
export function isExpression(propertyValue = ""): boolean {
	return propertyValue.startsWith("{");
}

/**
 * This function checks if the property value is an i18n expression
 *
 * @param {string} propertyValue
 * @returns {boolean}
 */
export function isI18nExpression(propertyValue = ""): boolean {
	return propertyValue.startsWith("{{") && propertyValue.endsWith("}}");
}

/**
 * The function checks if the property value has a formatter
 *
 * @param propertyValue
 * @returns
 */
export function hasFormatter(propertyValue = ""): boolean {
	return propertyValue.startsWith("{=") && propertyValue.endsWith("}");
}

/**
 * format the value based on the formatter configuration
 * @param {string} sPropertyName
 * @param {FormatterConfigurationMap} propertyValueFormatters
 * @returns
 */
function formatValue(sPropertyName: string, propertyValueFormatters: FormatterConfigurationMap = []) {
	const oMatchedFormatterDetail = propertyValueFormatters.find(function (oFormatterDetail: FormatterConfiguration) {
		return oFormatterDetail.property === sPropertyName || "{" + oFormatterDetail.property + "}" === sPropertyName;
	});

	if (oMatchedFormatterDetail) {
		return createFormatterExpression(oMatchedFormatterDetail);
	}
	return sPropertyName;
}

/**
 * Apply text arrangement, UOM and formatter to the property
 * @param {string} sPropertyName
 * @param {PropertyFormattingOptions} mOptions
 * @returns {string}
 */
export function getArrangements(sPropertyName: string, mOptions: PropertyFormattingOptions) {
	const { unitOfMeasures, textArrangements, propertyValueFormatters } = mOptions;
	const bPropertyHasBinding = sPropertyName.startsWith("{");
	sPropertyName = sPropertyName.replace(/[{}]/g, "");

	const oMatchedUOM = unitOfMeasures.find(function (oArrangement: any) {
		return oArrangement.name === sPropertyName;
	});
	const sMatchedUOMName = oMatchedUOM?.value?.replace(/[{}]/g, "");
	const oMatchedArrangement = textArrangements.find(function (oArrangement: any) {
		if (oArrangement.value && oArrangement.textArrangement) {
			return oArrangement.name === sPropertyName;
		}
	});
	const sMatchedArrangementName = oMatchedArrangement?.value?.replace(/[{}]/g, "");
	let bPropertyHasFormatter = false;
	let bMatchedUOMHasFormatter = false;
	let bMatchedArrangementHasFormatter = false;
	const sProperty = sPropertyName;

	sPropertyName = sPropertyName && formatValue(sPropertyName, propertyValueFormatters);
	if (sPropertyName !== sProperty) {
		bPropertyHasFormatter = true;
	}

	const sMatchedUOM = oMatchedUOM && formatValue(sMatchedUOMName ?? "", propertyValueFormatters);
	if (sMatchedUOMName !== sMatchedUOM) {
		bMatchedUOMHasFormatter = true;
	}

	const sMatchedArrangement = sMatchedArrangementName && formatValue(sMatchedArrangementName, propertyValueFormatters);
	if (sMatchedArrangementName !== sMatchedArrangement) {
		bMatchedArrangementHasFormatter = true;
	}

	let updatedVal = "";
	if (oMatchedUOM && oMatchedArrangement) {
		switch (oMatchedArrangement.textArrangement) {
			case "TextLast":
				updatedVal += bPropertyHasFormatter ? "{= " + sPropertyName + "}" : "{" + sPropertyName + "}";
				updatedVal += bMatchedUOMHasFormatter ? " {= " + sMatchedUOM + "}" : " {" + sMatchedUOMName + "}";
				updatedVal = getFormattedValue(updatedVal, bPropertyHasFormatter, bMatchedUOMHasFormatter);
				updatedVal += bMatchedArrangementHasFormatter
					? " (" + "{= " + sMatchedArrangement + "}" + ")"
					: " (" + "{" + sMatchedArrangementName + "}" + ")";
				break;
			case "TextFirst":
				updatedVal = bMatchedArrangementHasFormatter
					? "{= " + sMatchedArrangement + "}" + " ("
					: "{" + sMatchedArrangementName + "}" + " (";
				updatedVal += bPropertyHasFormatter ? "{= " + sPropertyName + "}" : "{" + sPropertyName + "}";
				updatedVal += bMatchedUOMHasFormatter ? " {= " + sMatchedUOM + "}" : " {" + sMatchedUOMName + "}";
				const index = updatedVal.indexOf(" (");
				const formattedValue = getFormattedValue(updatedVal.slice(index + 2), bPropertyHasFormatter, bMatchedUOMHasFormatter);
				updatedVal = updatedVal.slice(0, index + 2) + formattedValue;
				updatedVal += ")";
				break;
			case "TextSeparate":
				updatedVal += bPropertyHasFormatter ? "{= " + sPropertyName + "}" : "{" + sPropertyName + "}";
				updatedVal += bMatchedUOMHasFormatter ? " {= " + sMatchedUOM + "}" : " {" + sMatchedUOMName + "}";
				updatedVal = getFormattedValue(updatedVal, bPropertyHasFormatter, bMatchedUOMHasFormatter);
				break;
			case "TextOnly":
				updatedVal += bMatchedArrangementHasFormatter ? "{= " + sMatchedArrangement + "}" : "{" + sMatchedArrangementName + "}";
				break;
			default:
				break;
		}
		return updatedVal;
	} else if (oMatchedUOM && sMatchedUOMName) {
		updatedVal = bPropertyHasFormatter ? "{= " + sPropertyName + "}" : "{" + sPropertyName + "}";
		if (!sMatchedUOM?.startsWith("format.unit(")) {
			updatedVal += bMatchedUOMHasFormatter ? " {= " + sMatchedUOM + "}" : " {" + sMatchedUOMName + "}";
		}
		return getFormattedValue(updatedVal, bPropertyHasFormatter, bMatchedUOMHasFormatter);
	} else if (oMatchedArrangement) {
		switch (oMatchedArrangement.textArrangement) {
			case "TextLast":
				updatedVal += bPropertyHasFormatter ? "{= " + sPropertyName + "}" : "{" + sPropertyName + "}";
				updatedVal += bMatchedArrangementHasFormatter
					? " (" + "{= " + sMatchedArrangement + "}" + ")"
					: " (" + "{" + sMatchedArrangementName + "}" + ")";
				break;
			case "TextFirst":
				updatedVal = bMatchedArrangementHasFormatter
					? "{= " + sMatchedArrangement + "}" + " ("
					: "{" + sMatchedArrangementName + "}" + " (";
				updatedVal += bPropertyHasFormatter ? "{= " + sPropertyName + "}" : "{" + sPropertyName + "}";
				updatedVal += ")";
				break;
			case "TextSeparate":
				updatedVal += bPropertyHasFormatter ? "{= " + sPropertyName + "}" : "{" + sPropertyName + "}";
				break;
			case "TextOnly":
				updatedVal = bMatchedArrangementHasFormatter ? "{= " + sMatchedArrangement + "}" : "{" + sMatchedArrangementName + "}";
				break;
			default:
				break;
		}
		return updatedVal;
	}
	return bPropertyHasBinding ? (bPropertyHasFormatter ? "{= " + sPropertyName + "}" : "{" + sPropertyName + "}") : sPropertyName;
}

/**
 * Retrieves the formatted value based on the provided parameters.
 *
 * @param updatedVal - The updated value to be formatted.
 * @param bPropertyHasFormatter - A boolean indicating whether the property has a formatter.
 * @param bMatchedUOMHasFormatter - A boolean indicating whether the matched unit of measure has a formatter.
 * @returns The formatted value as a binding string in the format '{= format.unit(${property}, ${uom})}'.
 */
function getFormattedValue(updatedVal: string, bPropertyHasFormatter: boolean, bMatchedUOMHasFormatter: boolean) {
	const parts = updatedVal.split(" ");
	let property = "",
		uom = "";

	if (parts.length === 2) {
		property = parts[0];
		uom = parts[1];
	}

	if (bPropertyHasFormatter) {
		const formatFloat = updatedVal.startsWith("{= format.float(");
		const formatUnit = updatedVal.startsWith("{= format.unit(");

		if ((formatFloat || formatUnit) && !bMatchedUOMHasFormatter) {
			const index = updatedVal.indexOf("} ");
			let part1 = updatedVal.slice(0, index + 1);
			const part2 = updatedVal.slice(index + 2);
			part1 = part1.replace("format.float(", "format.unit(");

			const parts = part1.split(", ");
			if (parts.length === 2) {
				if (formatFloat) {
					updatedVal = part1.replace(", {", ", $" + part2 + ", {");
				} else {
					updatedVal = parts[0].concat(", $" + part2 + ")}");
				}
			} else if (parts.length === 3) {
				if (part2) {
					updatedVal = parts[0].concat(", $" + part2 + ", ");
					updatedVal = updatedVal.concat(parts[2]);
				} else {
					updatedVal = part1;
				}
			}
			return updatedVal;
		}
		return updatedVal;
	}

	//To return the binding string in the below format  '{= format.unit(${gross_amount}, ${currency_code})}'
	return "{= format.unit($" + property + ", $" + uom + ")}";
}

/**
 * Extracts the property path without unit of measure
 * 	 - The property is in the format {propertyPath} {uomPath}
 *
 * @param property
 * @returns {string}
 */
export function extractPathWithoutUOM(property: string) {
	return extractPathExpressionWithoutUOM(property).replace(/[{}]/g, ""); // Remove curly braces
}

/**
 * Extracts the property path expression without unit of measure
 * 	 - The property is in the format {propertyPath} {uomPath}
 *
 * @param property
 * @returns {string}
 */
export function extractPathExpressionWithoutUOM(property: string) {
	const hasUOM = property.includes("} {");
	return hasUOM ? property.substring(0, property.indexOf("} {") + 1) : property;
}

/**
 * Extracts parts of an expression
 *
 * @param expression
 * @returns {string[]}
 */
export function getExpressionParts(expression: string) {
	const startSymbols = ["{=", "{", "(", "${"];
	const endSymbols = ["}", ")"];
	const parts = [];
	let count = 0,
		part = "",
		skipNext = false;

	for (let i = 0; i < expression.length; i++) {
		if (skipNext) {
			skipNext = false;
			continue;
		}

		if (startSymbols.includes(expression[i])) {
			if (expression[i] === "{" && expression[i + 1] === "=") {
				part += "{=";
				skipNext = true;
			} else {
				part += expression[i];
			}
			count++;
		} else if (endSymbols.includes(expression[i])) {
			part += expression[i];
			count--;
		} else {
			part += expression[i];
		}

		if (count === 0) {
			if (part.trim().length !== 0) {
				parts.push(part);
			}

			part = "";
		}
	}
	return parts;
}

/**
 * Extracts the property path and formatter expression without text arrangement
 *
 * @param expression
 * @param mCardManifest
 *
 * @returns { propertyPath: string, formatterExpression: string[]}
 */
export function extractPropertyConfigurationWithoutTextArrangement(expression: string, mCardManifest: CardManifest) {
	const textArrangementOptions: Array<ArrangementOptions> = getTextArrangementFromCardManifest(mCardManifest);
	const parts = getExpressionParts(expression);
	let textArrangementIndex = -1;
	const propertyPaths: string[] = [];
	const formatterExpression: string[] = [];

	parts.forEach((part, index) => {
		const hasTextArrangement = part.trim().startsWith("(") && part.trim().endsWith(")");

		if (hasTextArrangement) {
			textArrangementIndex = index;
			const hasFormatterBinding = hasFormatter(part.slice(1, -1));

			if (hasFormatterBinding) {
				formatterExpression.push(part.slice(1, -1));
			}
			part = hasFormatterBinding ? parseFormatterExpression(part.slice(1, -1)).propertyPath : part.slice(1, -1);
			part = "({" + part + "})";
		} else if (hasFormatter(part)) {
			formatterExpression.push(part);
			part = "{" + parseFormatterExpression(part).propertyPath + "}";
		}
		propertyPaths.push(part);
	});

	if (textArrangementIndex > -1) {
		let remainingExpression = propertyPaths
			.slice(0, textArrangementIndex)
			.concat(propertyPaths.slice(textArrangementIndex + 1))
			.join(" ");
		const textArrangement = propertyPaths.slice(textArrangementIndex, textArrangementIndex + 1)[0];
		const textArrangementProperty = textArrangement.trim().replace(/[({})]/g, "");
		const prop = textArrangementOptions.find((option) => textArrangementProperty === option.name);
		if (prop && prop.arrangementType === "TextFirst") {
			remainingExpression = remainingExpression.replace(prop.value, prop.name);
		}
		return {
			propertyPath: remainingExpression,
			formatterExpression
		};
	} else {
		const propertyPathWithoutUOM = extractPathWithoutUOM(expression);
		const matchedTextArrangement = textArrangementOptions.find((option) => propertyPathWithoutUOM === option.value);
		if (matchedTextArrangement && matchedTextArrangement.arrangementType === "TextOnly") {
			return {
				propertyPath: `{${matchedTextArrangement.name}}`,
				formatterExpression
			};
		}
	}

	return {
		propertyPath: expression,
		formatterExpression
	};
}

/**
 *  Resolves the property path with expression to simple property path
 * 	- If path is an expression, resolve the expression then return the path
 *  - If path is an expression with formatter, return the path after extracting the formatter
 * @param path
 * @param mCardManifest
 * @returns
 */
export function resolvePropertyPathFromExpression(path = "", mCardManifest: CardManifest) {
	let { propertyPath } = extractPropertyConfigurationWithoutTextArrangement(path, mCardManifest);
	const hasBinding = isExpression(path) || hasFormatter(path);

	if (isExpression(propertyPath) && !hasFormatter(propertyPath)) {
		propertyPath = extractPathWithoutUOM(propertyPath);
	}

	if (isExpression(propertyPath) && hasFormatter(propertyPath)) {
		const formatterExpression = extractPathExpressionWithoutUOM(propertyPath);
		const selectedFormatter = updateAndGetSelectedFormatters(formatterExpression);
		propertyPath = selectedFormatter.property || "";
	}

	return hasBinding ? `{${propertyPath}}` : propertyPath;
}

export function getTextArrangementFromCardManifest(mManifest: CardManifest) {
	const textArrangements = mManifest["sap.card"].configuration?.parameters?._propertyFormatting as object | undefined;

	if (!textArrangements) {
		return [];
	}

	const textArrangementOptions: Array<ArrangementOptions> = [];
	Object.keys(textArrangements).forEach((property) => {
		const arrangement = textArrangements[property].arrangements.text;
		const arrangementType = Object.keys(arrangement).find((key) => arrangement[key]) || "TextLast";
		let path = arrangement.path;
		let isNavigationForId = false;
		let isNavigationForDescription = false;
		let propertyKeyForId = "";
		let navigationKeyForId = "";
		let navigationKeyForDescription = "";
		if (property.includes("/")) {
			propertyKeyForId = property.split("/")[0];
			navigationKeyForId = property.split("/")[1];
			isNavigationForId = true;
		}
		if (path?.includes("/")) {
			path = arrangement.path.split("/")[0];
			navigationKeyForDescription = arrangement.path.split("/")[1];
			isNavigationForDescription = true;
		}
		textArrangementOptions.push({
			name: property,
			arrangementType,
			value: arrangement.path,
			propertyKeyForDescription: path,
			propertyKeyForId: property.includes("/") ? propertyKeyForId : property,
			textArrangement: arrangementType,
			isNavigationForId,
			isNavigationForDescription,
			navigationKeyForId,
			navigationKeyForDescription,
			navigationalPropertiesForDescription: [],
			navigationalPropertiesForId: []
		});
	});
	return textArrangementOptions;
}

/**
 * Parses the formatter expression and returns the formatter name, property path and parameters
 *
 * @param path
 * @returns
 */
export function parseFormatterExpression(path = ""): ParsedFormatterExpression {
	const formatterOptions = getFormatterConfiguration();
	const formatterName = path.split("{=")[1]?.split("(")[0]?.trim();

	if (!formatterName) {
		return {
			formatterName: "",
			propertyPath: "",
			parameters: []
		};
	}

	const selectedFormatter = formatterOptions.find((formatter) => formatter.formatterName === formatterName);
	const bindingInfo = BindingParser.complexParser(path);
	const propertyPath: string = bindingInfo.parts[0].path;
	const propertyExpression = "${" + propertyPath + "}";
	const parameters: Array<FormatterConfigParameters> = [];

	let bindingPartial = path;
	bindingPartial = path.trim().replace("{=", "");
	bindingPartial = bindingPartial.substring(0, bindingPartial.lastIndexOf("}"));
	bindingPartial = bindingPartial.replace(`${formatterName}(`, "");
	bindingPartial = bindingPartial.substring(0, bindingPartial.lastIndexOf(")"));

	let parametersExpression = bindingPartial.replace(`${propertyExpression}`, "").trim();
	const hasParameters = parametersExpression.length > 0;

	if (hasParameters) {
		const formatterParameters = selectedFormatter?.parameters || [];
		for (const parameter of formatterParameters) {
			if (parameter.type === "object") {
				const startIndex = parametersExpression.indexOf("{");
				const endIndex = parametersExpression.indexOf("}");
				const options = parametersExpression.substring(startIndex, endIndex + 1);
				parametersExpression = parametersExpression.substring(endIndex + 1);
				try {
					parameters.push(JSON.parse(options) as JSONObject);
				} catch {
					Log.error("Error in parsing the formatter options");
				}
			}
			if (parameter.type === "string") {
				const startIndex = parametersExpression.indexOf(",");
				parametersExpression = parametersExpression.substring(startIndex + 1);
				let endIndex = parametersExpression.indexOf(",");
				let options;
				if (endIndex !== -1) {
					options = parametersExpression.substring(0, endIndex).trim();
				} else {
					endIndex = parametersExpression.indexOf("}");
					options = parametersExpression.substring(0, endIndex + 1).trim();
				}
				parametersExpression = parametersExpression.substring(endIndex + 1);
				parameters.push(options.replace(/['"]+/g, ""));
			}
		}
	}

	return {
		formatterName,
		propertyPath,
		parameters
	};
}

/**
 * Updates the selected formatter with received parameters and returns the updated formatter
 *
 * @param sPropertyPath
 * @returns
 */
export function updateAndGetSelectedFormatters(sPropertyPath: string): FormatterConfiguration {
	const formatterOptions = getFormatterConfiguration();
	const formatterConfig = parseFormatterExpression(sPropertyPath);
	const selectedFormatter = {
		...formatterOptions.find((options) => options.formatterName === formatterConfig.formatterName)
	} as FormatterConfiguration;
	selectedFormatter.property = formatterConfig.propertyPath;

	if (!selectedFormatter.parameters?.length) {
		return selectedFormatter;
	}

	const parametersLength = selectedFormatter.parameters.length;
	for (let i = 0; i < parametersLength; i++) {
		const formatterConfigParameters = formatterConfig.parameters;
		if (selectedFormatter.parameters[i].type === "object" && typeof formatterConfigParameters[i] === "object") {
			updatePropertiesForObjectType(selectedFormatter, formatterConfigParameters, i);
		}

		if (selectedFormatter.parameters[i].type === "string" && typeof formatterConfigParameters[i] === "string") {
			selectedFormatter.parameters[i].value = formatterConfigParameters[i];
		}
	}

	return selectedFormatter;
}

/**
 *  Updates the properties for the object type parameters
 *
 * @param selectedFormatter
 * @param formatterConfigParameters
 * @param index
 */
function updatePropertiesForObjectType(
	selectedFormatter: FormatterConfiguration,
	formatterConfigParameters: Array<FormatterConfigParameters>,
	index: number
) {
	const properties = selectedFormatter!.parameters![index].properties;

	properties?.forEach((property) => {
		if (property.type === "boolean") {
			property["selected"] = (formatterConfigParameters[index] as JSONObject)[property.name] as boolean;
		} else if (property.type === "enum") {
			property["selectedKey"] = (formatterConfigParameters[index] as JSONObject)[property.name] as string;
		} else {
			property["value"] =
				typeof formatterConfigParameters === "object"
					? ((formatterConfigParameters[index] as JSONObject)[property.name] as string)
					: formatterConfigParameters[index];
		}
	});
}
