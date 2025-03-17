/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import encodeURLParameters from "sap/base/security/encodeURLParameters";
import V2OdataUtils from "sap/ui/model/odata/ODataUtils";
import { default as V2ODataModel } from "sap/ui/model/odata/v2/ODataModel";
import { default as V4ODataModel } from "sap/ui/model/odata/v4/ODataModel";
import V4ODataUtils from "sap/ui/model/odata/v4/ODataUtils";
import { ODataModelVersion } from "../helpers/ApplicationInfo";
import { getPropertyReference } from "./v2/MetadataAnalyzer";
import { getPropertyReferenceKey, getSemanticKeys, Property, SemanticKey } from "./v4/MetadataAnalyzer";

/**
 * Retrieves context properties for OData V2.
 *
 * @param path - The path to retrieve context properties for.
 * @param model - The application model.
 * @param entitySetName - The entity set name.
 * @returns An array of context properties.
 */
const getContextPropertiesForODataV2 = function (path: string, model: V2ODataModel, entitySetName: string): string[] {
	const contextParameters: string[] = [];
	const data = model.getObject(`/${path}`);
	const keyProperties = getPropertyReference(model, entitySetName);

	keyProperties.forEach((property) => {
		const parameter = V2OdataUtils.formatValue(`${data[property.name]}`, property.type, true);
		contextParameters.push(`${property.name}=${parameter}`);
	});

	return contextParameters;
};

/**
 * Matches semantic keys with reference keys.
 *
 * @param semanticProperties - The semantic properties.
 * @param referenceKeys - The reference keys.
 * @returns A boolean indicating if the keys match.
 */
const matchSemanticKeysWithReferenceKeys = function (semanticProperties: string[], referenceKeys: string[]) {
	if (semanticProperties.length !== referenceKeys.length) {
		return false;
	}

	const sortedSemanticProperties = [...semanticProperties].sort();
	const sortedReferenceKeys = [...referenceKeys].sort();

	return sortedSemanticProperties.join("") === sortedReferenceKeys.join("");
};

/**
 * Retrieves properties using semantic keys from an OData model.
 *
 * @param {V4ODataModel} model - The OData model instance.
 * @param {string} entitySetName - The name of the entity set.
 * @param {string[]} contextProperties - The context properties.
 * @param {SemanticKey[]} semanticKeys - The semantic keys.
 * @param {string[]} referenceKeys - The reference keys to be selected.
 * @param {{ name: string, type: string }[]} propertyReferenceKey - The property reference keys with their types.
 * @returns {Promise<string[]>} A promise that resolves to an array of formatted property reference keys or the original context properties.
 */
const getPropertiesUsingSemanticKeys = async function (
	model: V4ODataModel,
	entitySetName: string,
	contextProperties: string[],
	semanticKeys: SemanticKey[],
	referenceKeys: string[],
	propertyReferenceKey: { name: string; type: string }[]
) {
	const odataModel = model.isA<V4ODataModel>("sap.ui.model.odata.v4.ODataModel") ? ODataModelVersion.V4 : ODataModelVersion.V2;
	const bODataV4 = odataModel === ODataModelVersion.V4;
	const serviceUrl = bODataV4
		? model.getServiceUrl()
		: (model as unknown as { V2ODataModel: V2ODataModel; sServiceUrl: string }).sServiceUrl;
	const key = semanticKeys[0].$PropertyPath;
	const urlParameters = {
		$select: referenceKeys.join(","),
		$filter: `${key} eq ${decodeURIComponent(contextProperties[0])}`
	};
	const data = await fetchDataAsync(serviceUrl, entitySetName, urlParameters);

	if (data.value.length) {
		const result = data.value[0];
		return propertyReferenceKey.map((ref) => {
			return `${ref.name}=${V4ODataUtils.formatLiteral(result[ref.name], ref.type)}`;
		});
	}

	return contextProperties;
};

/**
 * Handles a single property in the context of OData.
 *
 * If there is only one property in the object context and it is not a semantic key,
 * then it is assumed to be a GUID. The function updates the context properties accordingly.
 *
 * @param propertyReferenceKey - An array of properties to reference.
 * @param contextProperties - An array of context properties to be updated.
 */
const handleSingleProperty = function (propertyReferenceKey: Property[], contextProperties: string[]) {
	// If there is only one property in the object context, and it is not semantic key, then it is a guid
	const guidKey = propertyReferenceKey.find((property) => {
		return property.type === "Edm.Guid";
	})?.name;
	const guidValue = contextProperties[0];
	contextProperties[0] = guidKey
		? `${guidKey}=${V4ODataUtils.formatLiteral(guidValue, "Edm.Guid")}`
		: propertyReferenceKey.map((ref) => `${ref.name}=${guidValue}`).join(",");

	return contextProperties;
};

/**
 * Adds the "IsActiveEntity=true" property to the context properties if it is not already present.
 *
 * @param contextProperties - An array of context property strings.
 * @param propertyReferenceKey - An array of objects containing property name and type.
 * @returns The updated array of context property strings.
 */
const addIsActiveEntityProperty = function (contextProperties: string[], propertyReferenceKey: { name: string; type: string }[]) {
	const currentProperty = contextProperties.map((property: string) => property.split("=")[0]);

	propertyReferenceKey.forEach((element) => {
		if (!currentProperty.includes(element.name) && element.name === "IsActiveEntity") {
			contextProperties.push("IsActiveEntity=true");
		}
	});

	return contextProperties;
};

/**
 * Retrieves context properties for OData V4.
 *
 * @param model - The application model.
 * @param entitySetName - The entity set name.
 * @param propertyPath - The property path.
 * @returns A promise that resolves to an array of context properties.
 */
const getContextPropertiesForODataV4 = async function (model: V4ODataModel, entitySetName: string, propertyPath: string) {
	const propertyReferenceKey = getPropertyReferenceKey(model, entitySetName);
	const contextProperties = propertyPath.split(",");
	const semanticKeys: SemanticKey[] = getSemanticKeys(model.getMetaModel(), entitySetName);
	const semanticKeyProperties = semanticKeys.map((key) => key.$PropertyPath);
	const referenceKeys = propertyReferenceKey.map((ref) => ref.name);
	const considerSemanticKey = !matchSemanticKeysWithReferenceKeys(semanticKeyProperties, referenceKeys);

	// If semantic keys are declared, we can get the value for key parameters by fetching the data using the semantic key
	if (semanticKeys.length && considerSemanticKey) {
		return await getPropertiesUsingSemanticKeys(
			model,
			entitySetName,
			contextProperties,
			semanticKeys,
			referenceKeys,
			propertyReferenceKey
		);
	}

	if (contextProperties.length === 1 && contextProperties[0].indexOf("=") === -1) {
		return handleSingleProperty(propertyReferenceKey, contextProperties);
	}

	return addIsActiveEntityProperty(contextProperties, propertyReferenceKey);
};

/**
 * Creates context parameters based on the given path, app model, and OData version.
 *
 * @param path - The path to create context parameters for.
 * @param model - The application model.
 * @param oDataV4 - A boolean indicating if OData V4 is used.
 * @returns A promise that resolves to a string of context parameters.
 */
export const createContextParameter = async function (path: string, model: V2ODataModel | V4ODataModel, oDataV4: boolean) {
	const index = path.indexOf("(");
	const entitySetName = path.substring(0, index);
	const lastIndex = path.indexOf(")");
	const propertyPath = path.substring(index + 1, lastIndex);
	let contextParameters: string[] = [];

	if (oDataV4) {
		contextParameters = await getContextPropertiesForODataV4(model as V4ODataModel, entitySetName, propertyPath);
	} else {
		contextParameters = getContextPropertiesForODataV2(path, model as V2ODataModel, entitySetName);
	}

	return contextParameters.join(",");
};

/**
 * Helper function to fetch data from the given URL. This function is used to fetch data from the OData V4 service.
 *
 * @param url - The URL to fetch data from.
 * @param path - The path to fetch data for.
 * @param urlParameters - The URL parameters.
 * @returns A promise that resolves to the fetched data.
 */
export const fetchDataAsync = async function (url: string, path: string, urlParameters: Record<string, string> = {}) {
	const queryParams: Record<string, string> = {};
	Object.keys(urlParameters).forEach((key) => {
		if (urlParameters[key].length) {
			queryParams[key] = urlParameters[key];
		}
	});

	const formattedUrl = url.endsWith("/") ? url : `${url}/`;
	queryParams.format = "json";
	const parameters = encodeURLParameters(queryParams);
	const sFormattedUrl = `${formattedUrl}${path}?${parameters}`;
	return fetch(sFormattedUrl)
		.then((response) => response.json())
		.then((data) => data)
		.catch((err) => {
			throw new Error(err);
		});
};
