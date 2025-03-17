/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import type ODataMetaModel from "sap/ui/model/odata/v4/ODataMetaModel";
import type ODataModel from "sap/ui/model/odata/v4/ODataModel";

export type Property = {
	type: string;
	name: string;
};

export type SemanticKey = {
	$PropertyPath: string;
};

type MetaModelEntityType = { $Type: string; $Key: string[] } & {
	[K: string]: MetaModelProperty | MetaModelNavProperty;
};

type MetaModelProperty = {
	$Name: string;
	$kind: string;
	$Type: string;
};

type MetaModelNavProperty = {
	$kind: string;
	$Type: string;
	$isCollection: boolean;
};

/**
 * Retrieves property information from a given entity set in the OData model.
 *
 * @param model - The OData model instance.
 * @param entitySetName - The name of the entity set.
 * @returns An array of properties with their types and names.
 */
export const getPropertyInfoFromEntity = function (model: ODataModel, entitySetName: string): Property[] {
	const metaModel = model.getMetaModel();
	const entitySet = metaModel.getObject(`/${entitySetName}`);
	const entityTypeName = entitySet.$Type;
	const entityType = metaModel.getObject(`/${entityTypeName}`) as MetaModelEntityType;
	const properties = extractPropertiesFromEntityType(entityType);

	return properties.map((property) => ({
		type: property.type,
		name: property.name
	}));
};

/**
 * Retrieves the key properties of a given entity set in the OData model.
 *
 * @param model - The OData model instance.
 * @param entitySetName - The name of the entity set.
 * @returns An array of key properties with their types and names.
 */
export const getPropertyReferenceKey = function (model: ODataModel, entitySetName: string): Property[] {
	const entityContainer = model.getMetaModel().getObject("/");
	const entitySet = entityContainer[entitySetName];
	const entitySetType = entitySet?.$Type;
	const propertyRefKey = model.getMetaModel().getObject("/" + entitySetType)?.$Key;
	const properties = getPropertyInfoFromEntity(model, entitySetName);
	return properties.filter((property) => propertyRefKey.includes(property.name));
};

/**
 * Extracts properties from a given entity type.
 *
 * @param entityType - The entity type object.
 * @returns An array of properties with their types and names.
 */
const extractPropertiesFromEntityType = function (entityType: MetaModelEntityType): Property[] {
	return Object.keys(entityType)
		.filter(
			(property) =>
				property !== "SAP__Messages" && typeof entityType[property] === "object" && entityType[property].$kind === "Property"
		)
		.map((property) => ({
			name: property,
			type: entityType[property].$Type
		}));
};

/**
 * Retrieves the semantic keys of a given entity set from the OData meta model.
 *
 * @param metaModel - The OData meta model instance.
 * @param entitySetName - The name of the entity set.
 * @returns An array of semantic keys.
 */
export function getSemanticKeys(metaModel: ODataMetaModel, entitySetName: string): SemanticKey[] {
	return metaModel.getObject(`/${entitySetName}/@com.sap.vocabularies.Common.v1.SemanticKey`) || [];
}
