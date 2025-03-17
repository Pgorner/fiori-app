/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import type ResourceBundle from "sap/base/i18n/ResourceBundle";
import encodeURLParameters from "sap/base/security/encodeURLParameters";
import { createContextParameter } from "sap/cards/ap/common/odata/ODataUtils";
import type ODataMetaModel from "sap/ui/model/odata/ODataMetaModel";
import V2ODataModel from "sap/ui/model/odata/v2/ODataModel";
import type { default as V4ODataMetaModel } from "sap/ui/model/odata/v4/ODataMetaModel";
import type { default as V4ODataModel } from "sap/ui/model/odata/v4/ODataModel";
import { PropertyInfo, PropertyInfoType } from "./ODataTypes";
import * as V2MetadataAnalyzer from "./v2/MetadataAnalyzer";
import * as V4MetadataAnalyzer from "./v4/MetadataAnalyzer";
const {
	getLabelForEntitySet: getLabelForEntitySetV2,
	getPropertyInfoFromEntity: getPropertyInfoFromEntityV2,
	getNavigationPropertyInfoFromEntity: getNavigationPropertyInfoFromEntityV2,
	getMetaModelObjectForEntitySet: getMetaModelObjectForEntitySetForODataV2
} = V2MetadataAnalyzer;

const {
	getLabelForEntitySet: getLabelForEntitySetV4,
	getPropertyInfoFromEntity: getPropertyInfoFromEntityV4,
	getNavigationPropertyInfoFromEntity: getNavigationPropertyInfoFromEntityV4,
	getMetaModelObjectForEntitySet: getMetaModelObjectForEntitySetForODataV4
} = V4MetadataAnalyzer;

export const isODataV4Model = function (oModel: V2ODataModel | V4ODataModel | undefined): boolean {
	return (oModel && oModel.isA<V4ODataModel>("sap.ui.model.odata.v4.ODataModel")) || false;
};

export const fetchDataAsyncV4 = async function (sUrl: string, sPath: string, queryParams: Record<string, string>) {
	const formattedUrl = sUrl.endsWith("/") ? sUrl : `${sUrl}/`;
	queryParams.format = "json";
	const parameters = encodeURLParameters(queryParams);
	const sFormattedUrl = `${formattedUrl}${sPath}?${parameters}`;
	return fetch(sFormattedUrl)
		.then((response) => response.json())
		.then((data) => data)
		.catch((err) => {
			throw new Error(err);
		});
};

const fetchDataAsyncV2 = async function (sUrl: string, sPath: string, queryParams: Record<string, string>) {
	const oModel = new V2ODataModel(sUrl);
	return new Promise(function (resolve, reject) {
		const fnSuccess = function (oData: object) {
			resolve(oData);
		};
		const fnFailure = function (oError: Error) {
			reject(oError);
		};
		oModel.read("/" + sPath, { success: fnSuccess, error: fnFailure, urlParameters: queryParams });
	});
};

export const fetchDataAsync = async function (sUrl: string, sPath: string, bODataV4?: boolean, urlParameters: Record<string, string> = {}) {
	const queryParams: Record<string, string> = {};
	Object.keys(urlParameters).forEach((key) => {
		if (urlParameters[key].length) {
			queryParams[key] = urlParameters[key];
		}
	});

	if (bODataV4) {
		return fetchDataAsyncV4(sUrl, sPath, queryParams);
	} else {
		return fetchDataAsyncV2(sUrl, sPath, queryParams);
	}
};

export const getLabelForEntitySet = function (oAppModel: V2ODataModel | V4ODataModel | undefined, sEntitySet: string) {
	if (!oAppModel) {
		return "";
	}
	if (oAppModel.isA<V2ODataModel>("sap.ui.model.odata.v2.ODataModel")) {
		return getLabelForEntitySetV2(oAppModel, sEntitySet);
	} else {
		return getLabelForEntitySetV4(oAppModel, sEntitySet);
	}
};

export const getPropertyInfoFromEntity = function (
	oAppModel: V2ODataModel | V4ODataModel | undefined,
	sEntitySet: string,
	withNavigation: boolean,
	resourceBundle?: ResourceBundle
) {
	if (!oAppModel) {
		return [];
	}
	if (oAppModel.isA<V2ODataModel>("sap.ui.model.odata.v2.ODataModel")) {
		return getPropertyInfoFromEntityV2(oAppModel, sEntitySet, withNavigation, resourceBundle);
	} else {
		return getPropertyInfoFromEntityV4(oAppModel, sEntitySet, withNavigation, resourceBundle);
	}
};

export const getNavigationPropertyInfoFromEntity = function (oAppModel: V2ODataModel | V4ODataModel | undefined, sEntitySet: string) {
	if (!oAppModel) {
		return [];
	}
	if (oAppModel.isA<V2ODataModel>("sap.ui.model.odata.v2.ODataModel")) {
		return getNavigationPropertyInfoFromEntityV2(oAppModel, sEntitySet);
	} else {
		return getNavigationPropertyInfoFromEntityV4(oAppModel, sEntitySet);
	}
};

export const getMetaModelObjectForEntitySet = function (
	metaModel: ODataMetaModel | V4ODataMetaModel,
	sEntitySet: string,
	isODataV4Model: boolean
) {
	if (!isODataV4Model) {
		return getMetaModelObjectForEntitySetForODataV2(metaModel as ODataMetaModel, sEntitySet);
	} else {
		return getMetaModelObjectForEntitySetForODataV4(metaModel as V4ODataMetaModel, sEntitySet);
	}
};

export function getPropertyLabel(
	oModel: V2ODataModel | V4ODataModel | undefined,
	sEntitySet: string,
	sProperty: string,
	propertyType: PropertyInfoType = PropertyInfoType.Property
) {
	const propertyInfo =
		propertyType === PropertyInfoType.Property
			? getPropertyInfoFromEntity(oModel, sEntitySet, false)
			: getNavigationPropertyInfoFromEntity(oModel, sEntitySet);

	const property = propertyInfo.find((oProperty) => oProperty.name === sProperty);
	return propertyType === PropertyInfoType.Property ? (property as PropertyInfo)?.label || "" : property || "";
}

/**
 * Get the data type of the property mapped with supported data types by integration cards configuration parameters
 * @param propertyType
 */
export function getDataType(propertyType: string) {
	const dataTypeMap: Record<string, string> = {
		Boolean: "boolean",
		Byte: "integer",
		SByte: "integer",
		Int16: "integer",
		Int32: "integer",
		Int64: "number",
		Single: "number",
		Double: "number",
		Float: "number",
		Decimal: "number",
		Guid: "string",
		String: "string",
		Date: "date",
		DateTime: "datetime",
		DateTimeOffset: "datetime",
		Time: "datetime",
		Binary: "",
		Stream: "",
		TimeOfDay: "",
		Duration: ""
	};

	const type = propertyType.startsWith("Edm.") ? propertyType.replace("Edm.", "") : propertyType;
	return dataTypeMap[type] || "string";
}

export const createPathWithEntityContext = async function (path: string, oAppModel: V2ODataModel | V4ODataModel, oDataV4: boolean) {
	const index = path.indexOf("(");
	const entitySetName = path.substring(0, index);
	const context = await createContextParameter(path, oAppModel, oDataV4);

	return `${entitySetName}(${context})`;
};

/**
 * Checks if the given data type is of a date type.
 *
 * @param {string} dataType - The data type to check.
 * @returns {boolean} - Returns `true` if the data type is one of "Edm.Date", "Edm.DateTimeOffset", or "Edm.TimeOfDay"; otherwise, returns `false`.
 */

export function isPropertyTypeDate(dataType: string): boolean {
	return ["Edm.Date", "Edm.DateTime", "Edm.DateTimeOffset", "Edm.TimeOfDay"].indexOf(dataType) > -1;
}
