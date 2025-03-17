/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import Component from "sap/ui/core/Component";
import V2ODataModel from "sap/ui/model/odata/v2/ODataModel";
import V4ODataModel from "sap/ui/model/odata/v4/ODataModel";
import { PropertyInfo } from "../odata/ODataTypes";
import { fetchDataAsync, getNavigationPropertyInfoFromEntity } from "../odata/ODataUtils";
import { ApplicationInfo, ODataModelVersion } from "./ApplicationInfo";
import { QueryParameters, createUrlParameters } from "./Batch";
import { formatPropertyDropdownValues } from "./Formatter";

type Model = V2ODataModel | V4ODataModel;

/**
 * Fetches the navigation properties with label for a single Navigation property
 * @param rootComponent
 * @param navigationProperty - Name of the navigation property
 * @param path
 */
export async function getNavigationPropertiesWithLabel(rootComponent: Component, navigationProperty: string, path: string) {
	const model = rootComponent.getModel() as Model;
	const { entitySet, serviceUrl, odataModel } = ApplicationInfo.getInstance().fetchDetails();
	const bODataV4 = odataModel === ODataModelVersion.V4;
	const navigationPropertyInfo = getNavigationPropertyInfoFromEntity(model, entitySet);
	const selectedNavigationProperty = navigationPropertyInfo.find((property) => property.name === navigationProperty);

	if (!selectedNavigationProperty) {
		return {
			propertiesWithLabel: [],
			navigationPropertyData: {}
		};
	}

	const properties = selectedNavigationProperty.properties || [];
	const queryParams: QueryParameters = {
		properties: [],
		navigationProperties: [
			{
				name: selectedNavigationProperty.name,
				properties: []
			}
		]
	};

	const data = await fetchDataAsync(serviceUrl, path, bODataV4, createUrlParameters(queryParams));

	if (data[selectedNavigationProperty.name] !== undefined && data[selectedNavigationProperty.name] !== null) {
		properties.forEach((property: PropertyInfo) => {
			const name = data[selectedNavigationProperty.name] as Record<string, unknown>;
			if (name[property.name] !== undefined && name[property.name] !== null) {
				const propertyValue = name[property.name] as string;
				property.labelWithValue = formatPropertyDropdownValues(property, propertyValue);
			} else {
				property.labelWithValue = `${property.label} (<empty>)`;
			}
		});
	}

	return {
		propertiesWithLabel: properties,
		navigationPropertyData: data
	};
}
