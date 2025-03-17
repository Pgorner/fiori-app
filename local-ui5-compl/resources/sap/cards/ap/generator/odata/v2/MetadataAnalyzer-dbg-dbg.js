/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define([], function () {
  "use strict";

  const Annotatations = {
    label: "com.sap.vocabularies.Common.v1.Label",
    isPotentiallySensitive: "com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive",
    isoCurrency: "Org.OData.Measures.V1.ISOCurrency",
    unit: "Org.OData.Measures.V1.Unit"
  };
  function getNavigationPropertyInfoFromEntity(oModel, sEntitySet) {
    const oMetaModel = oModel.getMetaModel();
    const oResult = {
      parameters: []
    };
    const oEntityType = getEntityTypeFromEntitySet(oMetaModel, sEntitySet);
    const aNavigationProperties = oEntityType?.navigationProperty || [];
    aNavigationProperties.forEach(oNavProperty => {
      const oNavigationEntitySet = oMetaModel.getODataAssociationEnd(oEntityType, oNavProperty.name);
      const oNavigationEntityType = oMetaModel.getODataEntityType(oNavigationEntitySet.type);
      if (oNavigationEntityType.key) {
        const properties = mapProperties(oNavigationEntityType.property);
        const navigationParameter = {
          name: oNavProperty.name,
          properties: properties
        };
        oResult.parameters.push(navigationParameter);
      }
    });
    return oResult.parameters;
  }
  function getPropertyInfoFromEntity(model, entitySet, withNavigation, resourceModel) {
    const metaModel = model.getMetaModel();
    const entityType = getEntityTypeFromEntitySet(metaModel, entitySet);
    let properties = [];
    if (withNavigation) {
      const propertiesWithoutNav = (entityType?.property || []).map(obj => ({
        ...obj,
        category: resourceModel?.getText("CRITICALITY_CONTROL_SELECT_PROP"),
        kind: "Property"
      }));
      const propertiesWithNav = (entityType?.navigationProperty || []).map(obj => ({
        ...obj,
        category: resourceModel?.getText("GENERATOR_CARD_SELECT_NAV_PROP"),
        kind: "NavigationProperty"
      }));
      properties = [...propertiesWithoutNav, ...propertiesWithNav];
    } else {
      properties = entityType?.property || [];
      properties.forEach(property => property.kind = "Property");
    }
    return properties.filter(property => !isPropertySensitive(metaModel, entityType, property)).map(property => mapPropertyInfo(property, withNavigation));
  }
  function getEntityTypeFromEntitySet(oMetaModel, sEntitySet) {
    const oEntitySet = oMetaModel.getODataEntitySet(sEntitySet);
    return oMetaModel.getODataEntityType(oEntitySet?.entityType);
  }
  function mapProperties(properties) {
    return properties.map(property => ({
      label: property["sap:label"] || property?.name,
      type: property.type,
      name: property?.name
    }));
  }
  function isPropertySensitive(oMetaModel, oEntityType, oProperty) {
    const oNavigationEntitySet = oMetaModel.getODataAssociationEnd(oEntityType, oProperty.name);
    return oProperty[Annotatations.isPotentiallySensitive]?.Bool || oNavigationEntitySet?.multiplicity === "*";
  }
  function mapPropertyInfo(oProperty, withNavigation) {
    const isDate = checkForDateType(oProperty);
    const ISOCurrency = oProperty && oProperty[Annotatations.isoCurrency];
    const unitOfMeasure = oProperty && oProperty[Annotatations.unit];
    let UOM = "";
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
      ...(withNavigation && {
        category: oProperty.category
      }),
      UOM,
      isDate,
      kind: oProperty.kind
    };
  }
  function checkForDateType(property) {
    return property.type === "Edm.DateTimeOffset" || property.type === "Edm.DateTime";
  }
  function getLabelForEntitySet(oModel, sEntitySet) {
    const oMetaModel = oModel.getMetaModel();
    const oEntitySet = oMetaModel.getODataEntitySet(sEntitySet);
    const oEntityDef = oMetaModel.getODataEntityType(oEntitySet?.entityType);
    const label = oEntityDef[Annotatations.label] && oEntityDef[Annotatations.label].String;
    return label || sEntitySet;
  }
  function getPropertyReference(oModel, entitySetName) {
    const metaModel = oModel.getMetaModel();
    const entitySet = metaModel.getODataEntitySet(entitySetName);
    const entityDefinition = metaModel.getODataEntityType(entitySet.entityType);
    const propertyRef = entityDefinition.key.propertyRef.map(property => property.name);
    const properties = getPropertyInfoFromEntity(oModel, entitySetName, false);
    return properties.filter(property => propertyRef.includes(property?.name));
  }
  function getMetaModelObjectForEntitySet(metaModel, entitySetName) {
    const entitySet = metaModel.getODataEntitySet(entitySetName);
    const entityType = metaModel.getODataEntityType(entitySet.entityType);
    const properties = entityType.property || [];
    const navigationProperties = [];
    entityType.navigationProperty?.forEach(navigationProperty => {
      const propertyName = navigationProperty.name;
      const navigationEntitySet = metaModel.getODataAssociationEnd(entityType, propertyName);
      if (navigationEntitySet !== null) {
        const navigationEntityType = metaModel.getODataEntityType(navigationEntitySet.type);
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
  var __exports = {
    __esModule: true
  };
  __exports.getNavigationPropertyInfoFromEntity = getNavigationPropertyInfoFromEntity;
  __exports.getPropertyInfoFromEntity = getPropertyInfoFromEntity;
  __exports.checkForDateType = checkForDateType;
  __exports.getLabelForEntitySet = getLabelForEntitySet;
  __exports.getPropertyReference = getPropertyReference;
  __exports.getMetaModelObjectForEntitySet = getMetaModelObjectForEntitySet;
  return __exports;
});
//# sourceMappingURL=MetadataAnalyzer-dbg-dbg.js.map
