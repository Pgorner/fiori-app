/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define([], function () {
  "use strict";

  /**
   * Retrieves property information from a given entity set in the OData model.
   *
   * @param model - The OData model instance.
   * @param entitySetName - The name of the entity set.
   * @returns An array of properties with their types and names.
   */
  const getPropertyInfoFromEntity = function (model, entitySetName) {
    const metaModel = model.getMetaModel();
    const entitySet = metaModel.getObject(`/${entitySetName}`);
    const entityTypeName = entitySet.$Type;
    const entityType = metaModel.getObject(`/${entityTypeName}`);
    const properties = extractPropertiesFromEntityType(entityType);
    return properties.map(property => ({
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
  const getPropertyReferenceKey = function (model, entitySetName) {
    const entityContainer = model.getMetaModel().getObject("/");
    const entitySet = entityContainer[entitySetName];
    const entitySetType = entitySet?.$Type;
    const propertyRefKey = model.getMetaModel().getObject("/" + entitySetType)?.$Key;
    const properties = getPropertyInfoFromEntity(model, entitySetName);
    return properties.filter(property => propertyRefKey.includes(property.name));
  };

  /**
   * Extracts properties from a given entity type.
   *
   * @param entityType - The entity type object.
   * @returns An array of properties with their types and names.
   */
  const extractPropertiesFromEntityType = function (entityType) {
    return Object.keys(entityType).filter(property => property !== "SAP__Messages" && typeof entityType[property] === "object" && entityType[property].$kind === "Property").map(property => ({
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
  function getSemanticKeys(metaModel, entitySetName) {
    return metaModel.getObject(`/${entitySetName}/@com.sap.vocabularies.Common.v1.SemanticKey`) || [];
  }
  var __exports = {
    __esModule: true
  };
  __exports.getPropertyInfoFromEntity = getPropertyInfoFromEntity;
  __exports.getPropertyReferenceKey = getPropertyReferenceKey;
  __exports.getSemanticKeys = getSemanticKeys;
  return __exports;
});
//# sourceMappingURL=MetadataAnalyzer-dbg-dbg.js.map
