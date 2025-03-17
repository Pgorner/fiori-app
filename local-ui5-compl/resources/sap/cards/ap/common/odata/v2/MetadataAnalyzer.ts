/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import { EntitySet, EntityType } from "sap/ui/model/odata/ODataMetaModel";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";

type Property = {
	type: string;
	name: string;
};

/**
 * Retrieves property information from an entity set.
 *
 * @param {ODataModel} model - The OData model.
 * @param {string} entitySetName - The name of the entity set.
 * @return {Property[]} - An array of property information.
 */
export const getPropertyInfoFromEntity = function (model: ODataModel, entitySetName: string): Property[] {
	const metaModel = model.getMetaModel();
	const entitySet = metaModel.getODataEntitySet(entitySetName);
	const entityType = metaModel.getODataEntityType((entitySet as EntitySet).entityType) as EntityType;
	const properties = entityType.property || [];

	return properties.map((property) => ({
		type: property.type,
		name: property.name
	}));
};

/**
 * Retrieves property references from an entity set.
 *
 * @param {ODataModel} model - The OData model.
 * @param {string} entitySetName - The name of the entity set.
 * @return {Property[]} - An array of property references.
 */
export const getPropertyReference = function (model: ODataModel, entitySetName: string): Property[] {
	const metaModel = model.getMetaModel();
	const entitySet = metaModel.getODataEntitySet(entitySetName) as EntitySet;
	const entityDefinition = metaModel.getODataEntityType(entitySet.entityType) as EntityType;
	const propertyRef = entityDefinition.key.propertyRef.map((property) => property.name);
	const properties = getPropertyInfoFromEntity(model, entitySetName);

	return properties.filter((property) => propertyRef.includes(property.name));
};
