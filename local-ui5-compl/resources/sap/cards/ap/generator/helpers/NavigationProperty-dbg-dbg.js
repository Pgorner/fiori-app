/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["../odata/ODataUtils", "./ApplicationInfo", "./Batch", "./Formatter"], function (___odata_ODataUtils, ___ApplicationInfo, ___Batch, ___Formatter) {
  "use strict";

  /**
   * Fetches the navigation properties with label for a single Navigation property
   * @param rootComponent
   * @param navigationProperty - Name of the navigation property
   * @param path
   */
  const getNavigationPropertiesWithLabel = function (rootComponent, navigationProperty, path) {
    try {
      const model = rootComponent.getModel();
      const {
        entitySet,
        serviceUrl,
        odataModel
      } = ApplicationInfo.getInstance().fetchDetails();
      const bODataV4 = odataModel === ODataModelVersion.V4;
      const navigationPropertyInfo = getNavigationPropertyInfoFromEntity(model, entitySet);
      const selectedNavigationProperty = navigationPropertyInfo.find(property => property.name === navigationProperty);
      if (!selectedNavigationProperty) {
        return Promise.resolve({
          propertiesWithLabel: [],
          navigationPropertyData: {}
        });
      }
      const properties = selectedNavigationProperty.properties || [];
      const queryParams = {
        properties: [],
        navigationProperties: [{
          name: selectedNavigationProperty.name,
          properties: []
        }]
      };
      return Promise.resolve(fetchDataAsync(serviceUrl, path, bODataV4, createUrlParameters(queryParams))).then(function (data) {
        if (data[selectedNavigationProperty.name] !== undefined && data[selectedNavigationProperty.name] !== null) {
          properties.forEach(property => {
            const name = data[selectedNavigationProperty.name];
            if (name[property.name] !== undefined && name[property.name] !== null) {
              const propertyValue = name[property.name];
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
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  const fetchDataAsync = ___odata_ODataUtils["fetchDataAsync"];
  const getNavigationPropertyInfoFromEntity = ___odata_ODataUtils["getNavigationPropertyInfoFromEntity"];
  const ApplicationInfo = ___ApplicationInfo["ApplicationInfo"];
  const ODataModelVersion = ___ApplicationInfo["ODataModelVersion"];
  const createUrlParameters = ___Batch["createUrlParameters"];
  const formatPropertyDropdownValues = ___Formatter["formatPropertyDropdownValues"];
  var __exports = {
    __esModule: true
  };
  __exports.getNavigationPropertiesWithLabel = getNavigationPropertiesWithLabel;
  return __exports;
});
//# sourceMappingURL=NavigationProperty-dbg-dbg.js.map
