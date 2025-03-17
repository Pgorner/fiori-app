/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import ODataMetaModel, { EntitySet, EntityType } from "sap/ui/model/odata/ODataMetaModel";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import type { RequestQueryNavigationProperties, RequestQueryParameters } from "../../helpers/Batch";
import type { NavigationParameter, NavigationParameters, Property } from "../../helpers/CardGeneratorModel";
import { PropertyInfo, PropertyInfoMap } from "../ODataTypes";

const Annotatations = {
	label: "com.sap.vocabularies.Common.v1.Label",
	isPotentiallySensitive: "com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive",
	isoCurrency: "Org.OData.Measures.V1.ISOCurrency",
	unit: "Org.OData.Measures.V1.Unit"
};

export function getNavigationPropertyInfoFromEntity(oModel: ODataModel, sEntitySet: string): NavigationParameter[] {
	const oMetaModel: ODataMetaModel = oModel.getMetaModel();
	const oResult: NavigationParameters = { parameters: [] };

	const oEntityType = getEntityTypeFromEntitySet(oMetaModel, sEntitySet);
	const aNavigationProperties = oEntityType?.navigationProperty || [];

	aNavigationProperties.forEach((oNavProperty: any) => {
		const oNavigationEntitySet = oMetaModel.getODataAssociationEnd(oEntityType as EntityType, oNavProperty.name);
		const oNavigationEntityType = oMetaModel.getODataEntityType(oNavigationEntitySet.type);

		if (oNavigationEntityType.key) {
			const properties: Property[] = mapProperties(oNavigationEntityType.property);
			const navigationParameter: NavigationParameter = {
				name: oNavProperty.name,
				properties: properties
			};
			oResult.parameters.push(navigationParameter);
		}
	});
	return oResult.parameters;
}

export function getPropertyInfoFromEntity(
	model: ODataModel,
	entitySet: string,
	withNavigation: boolean,
	resourceModel?: ResourceBundle
): PropertyInfoMap {
	const metaModel = model.getMetaModel();
	const entityType = getEntityTypeFromEntitySet(metaModel, entitySet) as EntityType;
	let properties = [];
	if (withNavigation) {
		const propertiesWithoutNav = (entityType?.property || []).map((obj) => ({
			...obj,
			category: resourceModel?.getText("CRITICALITY_CONTROL_SELECT_PROP"),
			kind: "Property"
		}));
		const propertiesWithNav = (entityType?.navigationProperty || []).map((obj) => ({
			...obj,
			category: resourceModel?.getText("GENERATOR_CARD_SELECT_NAV_PROP"),
			kind: "NavigationProperty"
		}));
		properties = [...propertiesWithoutNav, ...propertiesWithNav];
	} else {
		properties = entityType?.property || [];
		properties.forEach((property) => (property.kind = "Property"));
	}

	return properties
		.filter((property) => !isPropertySensitive(metaModel, entityType, property))
		.map((property) => mapPropertyInfo(property, withNavigation));
}

function getEntityTypeFromEntitySet(oMetaModel: ODataMetaModel, sEntitySet: string): EntityType | undefined {
	const oEntitySet = oMetaModel.getODataEntitySet(sEntitySet);
	return oMetaModel.getODataEntityType(oEntitySet?.entityType) as EntityType | undefined;
}

function mapProperties(properties: any[]): Property[] {
	return properties.map((property: any) => ({
		label: property["sap:label"] || property?.name,
		type: property.type,
		name: property?.name
	}));
}

function isPropertySensitive(oMetaModel: ODataMetaModel, oEntityType: EntityType, oProperty: any): boolean {
	const oNavigationEntitySet = oMetaModel.getODataAssociationEnd(oEntityType, oProperty.name);
	return oProperty[Annotatations.isPotentiallySensitive]?.Bool || oNavigationEntitySet?.multiplicity === "*";
}

function mapPropertyInfo(oProperty: any, withNavigation: boolean): PropertyInfo {
	const isDate: boolean = checkForDateType(oProperty);
	const ISOCurrency = oProperty && oProperty[Annotatations.isoCurrency];
	const unitOfMeasure = oProperty && oProperty[Annotatations.unit];
	let UOM: string = "";

	if (ISOCurrency) {
		UOM = ISOCurrency?.Path ? ISOCurrency?.Path : ISOCurrency?.String;
	} else if (unitOfMeasure) {
		UOM = unitOfMeasure?.Path ? unitOfMeasure?.Path : unitOfMeasure?.String;
	} else if (oProperty && oProperty["sap:unit"]) {
		UOM = oProperty && oProperty["sap:unit"];
	}

	return {
		label: oProperty["sap:label"] || oProperty?.name,
		type: oProperty.type,
		name: oProperty.name,
		...(withNavigation && { category: oProperty.category }),
		UOM,
		isDate,
		kind: oProperty.kind
	};
}

export function checkForDateType(property: PropertyInfo | Property) {
	return property.type === "Edm.DateTimeOffset" || property.type === "Edm.DateTime";
}

export function getLabelForEntitySet(oModel: ODataModel, sEntitySet: string) {
	const oMetaModel = oModel.getMetaModel();
	const oEntitySet = oMetaModel.getODataEntitySet(sEntitySet);
	const oEntityDef = oMetaModel.getODataEntityType(oEntitySet?.entityType);
	const label = oEntityDef[Annotatations.label] && oEntityDef[Annotatations.label].String;
	return label || sEntitySet;
}

export function getPropertyReference(oModel: ODataModel, entitySetName: string) {
	const metaModel = oModel.getMetaModel();
	const entitySet = metaModel.getODataEntitySet(entitySetName) as EntitySet;
	const entityDefinition = metaModel.getODataEntityType(entitySet.entityType) as EntityType;
	const propertyRef = entityDefinition.key.propertyRef.map((property) => property.name);
	const properties = getPropertyInfoFromEntity(oModel, entitySetName, false);

	return properties.filter((property) => propertyRef.includes(property?.name));
}

export function getMetaModelObjectForEntitySet(metaModel: ODataMetaModel, entitySetName: string): RequestQueryParameters {
	const entitySet = metaModel.getODataEntitySet(entitySetName) as EntitySet;
	const entityType = metaModel.getODataEntityType(entitySet.entityType) as EntityType;
	const properties: Property[] = entityType.property || [];
	const navigationProperties: RequestQueryNavigationProperties[] = [];

	entityType.navigationProperty?.forEach((navigationProperty) => {
		const propertyName = navigationProperty.name;
		const navigationEntitySet = metaModel.getODataAssociationEnd(entityType, propertyName);
		if (navigationEntitySet !== null) {
			const navigationEntityType = metaModel.getODataEntityType(navigationEntitySet.type) as EntityType;
			const navigationProperty = navigationEntityType.property || [];
			navigationProperties.push({
				name: propertyName,
				properties: navigationProperty
			});
		}
	});

	return {
		properties,
		navigationProperties,
		complexProperties: []
	};
}
