/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import type { CardManifest } from "sap/ui/integration/widgets/Card";
import V2ODataModel from "sap/ui/model/odata/v2/ODataModel";
import V4ODataModel from "sap/ui/model/odata/v4/ODataModel";
import { ApplicationInfo, ODataModelVersion } from "../helpers/ApplicationInfo";
import { QueryParameters } from "../helpers/Batch";
import { getMetaModelObjectForEntitySet } from "../odata/ODataUtils";

type Model = V2ODataModel | V4ODataModel;

const getAllValues = (subManifest: Record<string, string>): string[] => {
	const values: string[] = [];

	for (const key in subManifest) {
		const value = subManifest[key];
		if (typeof value === "string") {
			values.push(subManifest[key]);
		} else {
			values.push(...getAllValues(value));
		}
	}

	return values;
};

const getQueryParameters = (values: string[]) => {
	const applicationInfo = ApplicationInfo.getInstance();
	const rootComponent = applicationInfo.getRootComponent();
	const model = rootComponent.getModel() as Model;
	const { entitySet, odataModel } = applicationInfo.fetchDetails();
	const isODataV4Model = odataModel === ODataModelVersion.V4;
	const { properties, navigationProperties, complexProperties } = getMetaModelObjectForEntitySet(
		model.getMetaModel(),
		entitySet,
		isODataV4Model
	);

	const queryParameters: QueryParameters = {
		properties: [],
		navigationProperties: []
	};

	queryParameters.properties = properties
		.filter((property) => {
			return values.some((value) => {
				return value && value.includes(`{${property.name}}`);
			});
		})
		.map((property) => property.name);

	navigationProperties.forEach((navigationProperty) => {
		const navigationPropertyName = navigationProperty.name;
		const properties = navigationProperty.properties;
		const selectedProperties = properties
			.filter((property) => {
				return values.some((value) => {
					return value && value.includes(`{${navigationPropertyName}/${property.name}}`);
				});
			})
			.map((property) => property.name);

		if (selectedProperties.length) {
			queryParameters.navigationProperties.push({
				name: navigationPropertyName,
				properties: selectedProperties
			});
		}
	});

	complexProperties.forEach((complexProperty) => {
		const complexPropertyName = complexProperty.name;
		const properties = complexProperty.properties;
		const selectedProperties = properties
			.filter((property) => {
				return values.some((value) => {
					return value && value.includes(`{${complexPropertyName}/${property.name}}`);
				});
			})
			.map((property) => property.name);

		const selectedComplexProperties = selectedProperties.map((property) => {
			return `${complexPropertyName}/${property}`;
		});
		if (selectedProperties.length) {
			queryParameters.properties = queryParameters.properties.concat(selectedComplexProperties);
		}
	});

	return queryParameters;
};

export const getHeaderProperties = (cardManifest: CardManifest): QueryParameters => {
	const values = getAllValues(cardManifest["sap.card"].header);
	return getQueryParameters(values);
};

export const getContentProperties = (cardManifest: CardManifest): QueryParameters => {
	const values = getAllValues(cardManifest["sap.card"].content);
	const contentQueryParams = getQueryParameters(values);
	const footerQueryParams = getFooterProperties(cardManifest);
	const selectedProperties = contentQueryParams.properties.concat(footerQueryParams.properties);
	const selectedNavigationProperties = contentQueryParams.navigationProperties.concat(footerQueryParams.navigationProperties);

	return {
		properties: selectedProperties,
		navigationProperties: selectedNavigationProperties
	};
};

const getFooterProperties = (cardManifest: CardManifest): QueryParameters => {
	const actionsStrips = cardManifest["sap.card"].footer?.actionsStrip;

	const values =
		actionsStrips?.map((actionsStrip) => {
			return actionsStrip.actions[0].enabled as string;
		}) || [];

	return getQueryParameters(values);
};
