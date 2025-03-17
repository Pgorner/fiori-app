/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["../helpers/ApplicationInfo", "../odata/ODataUtils"], function (___helpers_ApplicationInfo, ___odata_ODataUtils) {
  "use strict";

  const ApplicationInfo = ___helpers_ApplicationInfo["ApplicationInfo"];
  const ODataModelVersion = ___helpers_ApplicationInfo["ODataModelVersion"];
  const getMetaModelObjectForEntitySet = ___odata_ODataUtils["getMetaModelObjectForEntitySet"];
  const getAllValues = subManifest => {
    const values = [];
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
  const getQueryParameters = values => {
    const applicationInfo = ApplicationInfo.getInstance();
    const rootComponent = applicationInfo.getRootComponent();
    const model = rootComponent.getModel();
    const {
      entitySet,
      odataModel
    } = applicationInfo.fetchDetails();
    const isODataV4Model = odataModel === ODataModelVersion.V4;
    const {
      properties,
      navigationProperties,
      complexProperties
    } = getMetaModelObjectForEntitySet(model.getMetaModel(), entitySet, isODataV4Model);
    const queryParameters = {
      properties: [],
      navigationProperties: []
    };
    queryParameters.properties = properties.filter(property => {
      return values.some(value => {
        return value && value.includes(`{${property.name}}`);
      });
    }).map(property => property.name);
    navigationProperties.forEach(navigationProperty => {
      const navigationPropertyName = navigationProperty.name;
      const properties = navigationProperty.properties;
      const selectedProperties = properties.filter(property => {
        return values.some(value => {
          return value && value.includes(`{${navigationPropertyName}/${property.name}}`);
        });
      }).map(property => property.name);
      if (selectedProperties.length) {
        queryParameters.navigationProperties.push({
          name: navigationPropertyName,
          properties: selectedProperties
        });
      }
    });
    complexProperties.forEach(complexProperty => {
      const complexPropertyName = complexProperty.name;
      const properties = complexProperty.properties;
      const selectedProperties = properties.filter(property => {
        return values.some(value => {
          return value && value.includes(`{${complexPropertyName}/${property.name}}`);
        });
      }).map(property => property.name);
      const selectedComplexProperties = selectedProperties.map(property => {
        return `${complexPropertyName}/${property}`;
      });
      if (selectedProperties.length) {
        queryParameters.properties = queryParameters.properties.concat(selectedComplexProperties);
      }
    });
    return queryParameters;
  };
  const getHeaderProperties = cardManifest => {
    const values = getAllValues(cardManifest["sap.card"].header);
    return getQueryParameters(values);
  };
  const getContentProperties = cardManifest => {
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
  const getFooterProperties = cardManifest => {
    const actionsStrips = cardManifest["sap.card"].footer?.actionsStrip;
    const values = actionsStrips?.map(actionsStrip => {
      return actionsStrip.actions[0].enabled;
    }) || [];
    return getQueryParameters(values);
  };
  var __exports = {
    __esModule: true
  };
  __exports.getHeaderProperties = getHeaderProperties;
  __exports.getContentProperties = getContentProperties;
  return __exports;
});
//# sourceMappingURL=IntegrationCardManifestParser-dbg-dbg.js.map
