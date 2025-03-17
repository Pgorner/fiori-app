/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define([], function () {
  "use strict";

  /**
   * Retrieves property information from an entity set.
   *
   * @param {ODataModel} model - The OData model.
   * @param {string} entitySetName - The name of the entity set.
   * @return {Property[]} - An array of property information.
   */
  const getPropertyInfoFromEntity = function (model, entitySetName) {
    const metaModel = model.getMetaModel();
    const entitySet = metaModel.getODataEntitySet(entitySetName);
    const entityType = metaModel.getODataEntityType(entitySet.entityType);
    const properties = entityType.property || [];
    return properties.map(property => ({
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
  const getPropertyReference = function (model, entitySetName) {
    const metaModel = model.getMetaModel();
    const entitySet = metaModel.getODataEntitySet(entitySetName);
    const entityDefinition = metaModel.getODataEntityType(entitySet.entityType);
    const propertyRef = entityDefinition.key.propertyRef.map(property => property.name);
    const properties = getPropertyInfoFromEntity(model, entitySetName);
    return properties.filter(property => propertyRef.includes(property.name));
  };
  var __exports = {
    __esModule: true
  };
  __exports.getPropertyInfoFromEntity = getPropertyInfoFromEntity;
  __exports.getPropertyReference = getPropertyReference;
  return __exports;
});
//# sourceMappingURL=MetadataAnalyzer-dbg-dbg.js.map
