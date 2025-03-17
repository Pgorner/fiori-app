/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/base/security/encodeURLParameters", "sap/ui/model/odata/ODataUtils", "sap/ui/model/odata/v4/ODataUtils", "../helpers/ApplicationInfo", "./v2/MetadataAnalyzer", "./v4/MetadataAnalyzer"], function (encodeURLParameters, V2OdataUtils, V4ODataUtils, ___helpers_ApplicationInfo, ___v2_MetadataAnalyzer, ___v4_MetadataAnalyzer) {
  "use strict";

  const ODataModelVersion = ___helpers_ApplicationInfo["ODataModelVersion"];
  const getPropertyReference = ___v2_MetadataAnalyzer["getPropertyReference"];
  const getPropertyReferenceKey = ___v4_MetadataAnalyzer["getPropertyReferenceKey"];
  const getSemanticKeys = ___v4_MetadataAnalyzer["getSemanticKeys"];
  /**
   * Retrieves context properties for OData V2.
   *
   * @param path - The path to retrieve context properties for.
   * @param model - The application model.
   * @param entitySetName - The entity set name.
   * @returns An array of context properties.
   */
  const getContextPropertiesForODataV2 = function (path, model, entitySetName) {
    const contextParameters = [];
    const data = model.getObject(`/${path}`);
    const keyProperties = getPropertyReference(model, entitySetName);
    keyProperties.forEach(property => {
      const parameter = V2OdataUtils.formatValue(`${data[property.name]}`, property.type, true);
      contextParameters.push(`${property.name}=${parameter}`);
    });
    return contextParameters;
  };

  /**
   * Matches semantic keys with reference keys.
   *
   * @param semanticProperties - The semantic properties.
   * @param referenceKeys - The reference keys.
   * @returns A boolean indicating if the keys match.
   */
  const matchSemanticKeysWithReferenceKeys = function (semanticProperties, referenceKeys) {
    if (semanticProperties.length !== referenceKeys.length) {
      return false;
    }
    const sortedSemanticProperties = [...semanticProperties].sort();
    const sortedReferenceKeys = [...referenceKeys].sort();
    return sortedSemanticProperties.join("") === sortedReferenceKeys.join("");
  };

  /**
   * Retrieves properties using semantic keys from an OData model.
   *
   * @param {V4ODataModel} model - The OData model instance.
   * @param {string} entitySetName - The name of the entity set.
   * @param {string[]} contextProperties - The context properties.
   * @param {SemanticKey[]} semanticKeys - The semantic keys.
   * @param {string[]} referenceKeys - The reference keys to be selected.
   * @param {{ name: string, type: string }[]} propertyReferenceKey - The property reference keys with their types.
   * @returns {Promise<string[]>} A promise that resolves to an array of formatted property reference keys or the original context properties.
   */
  const getPropertiesUsingSemanticKeys = function (model, entitySetName, contextProperties, semanticKeys, referenceKeys, propertyReferenceKey) {
    try {
      const odataModel = model.isA("sap.ui.model.odata.v4.ODataModel") ? ODataModelVersion.V4 : ODataModelVersion.V2;
      const bODataV4 = odataModel === ODataModelVersion.V4;
      const serviceUrl = bODataV4 ? model.getServiceUrl() : model.sServiceUrl;
      const key = semanticKeys[0].$PropertyPath;
      const urlParameters = {
        $select: referenceKeys.join(","),
        $filter: `${key} eq ${decodeURIComponent(contextProperties[0])}`
      };
      return Promise.resolve(fetchDataAsync(serviceUrl, entitySetName, urlParameters)).then(function (data) {
        if (data.value.length) {
          const result = data.value[0];
          return propertyReferenceKey.map(ref => {
            return `${ref.name}=${V4ODataUtils.formatLiteral(result[ref.name], ref.type)}`;
          });
        }
        return contextProperties;
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   * Handles a single property in the context of OData.
   *
   * If there is only one property in the object context and it is not a semantic key,
   * then it is assumed to be a GUID. The function updates the context properties accordingly.
   *
   * @param propertyReferenceKey - An array of properties to reference.
   * @param contextProperties - An array of context properties to be updated.
   */
  const handleSingleProperty = function (propertyReferenceKey, contextProperties) {
    // If there is only one property in the object context, and it is not semantic key, then it is a guid
    const guidKey = propertyReferenceKey.find(property => {
      return property.type === "Edm.Guid";
    })?.name;
    const guidValue = contextProperties[0];
    contextProperties[0] = guidKey ? `${guidKey}=${V4ODataUtils.formatLiteral(guidValue, "Edm.Guid")}` : propertyReferenceKey.map(ref => `${ref.name}=${guidValue}`).join(",");
    return contextProperties;
  };

  /**
   * Adds the "IsActiveEntity=true" property to the context properties if it is not already present.
   *
   * @param contextProperties - An array of context property strings.
   * @param propertyReferenceKey - An array of objects containing property name and type.
   * @returns The updated array of context property strings.
   */
  const addIsActiveEntityProperty = function (contextProperties, propertyReferenceKey) {
    const currentProperty = contextProperties.map(property => property.split("=")[0]);
    propertyReferenceKey.forEach(element => {
      if (!currentProperty.includes(element.name) && element.name === "IsActiveEntity") {
        contextProperties.push("IsActiveEntity=true");
      }
    });
    return contextProperties;
  };

  /**
   * Retrieves context properties for OData V4.
   *
   * @param model - The application model.
   * @param entitySetName - The entity set name.
   * @param propertyPath - The property path.
   * @returns A promise that resolves to an array of context properties.
   */
  const getContextPropertiesForODataV4 = function (model, entitySetName, propertyPath) {
    try {
      let _exit = false;
      function _temp2(_result) {
        return _exit ? _result : contextProperties.length === 1 && contextProperties[0].indexOf("=") === -1 ? handleSingleProperty(propertyReferenceKey, contextProperties) : addIsActiveEntityProperty(contextProperties, propertyReferenceKey);
      }
      const propertyReferenceKey = getPropertyReferenceKey(model, entitySetName);
      const contextProperties = propertyPath.split(",");
      const semanticKeys = getSemanticKeys(model.getMetaModel(), entitySetName);
      const semanticKeyProperties = semanticKeys.map(key => key.$PropertyPath);
      const referenceKeys = propertyReferenceKey.map(ref => ref.name);
      const considerSemanticKey = !matchSemanticKeysWithReferenceKeys(semanticKeyProperties, referenceKeys);

      // If semantic keys are declared, we can get the value for key parameters by fetching the data using the semantic key
      const _temp = function () {
        if (semanticKeys.length && considerSemanticKey) {
          return Promise.resolve(getPropertiesUsingSemanticKeys(model, entitySetName, contextProperties, semanticKeys, referenceKeys, propertyReferenceKey)).then(function (_await$getPropertiesU) {
            _exit = true;
            return _await$getPropertiesU;
          });
        }
      }();
      return Promise.resolve(_temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   * Creates context parameters based on the given path, app model, and OData version.
   *
   * @param path - The path to create context parameters for.
   * @param model - The application model.
   * @param oDataV4 - A boolean indicating if OData V4 is used.
   * @returns A promise that resolves to a string of context parameters.
   */
  const createContextParameter = function (path, model, oDataV4) {
    try {
      function _temp4() {
        return contextParameters.join(",");
      }
      const index = path.indexOf("(");
      const entitySetName = path.substring(0, index);
      const lastIndex = path.indexOf(")");
      const propertyPath = path.substring(index + 1, lastIndex);
      let contextParameters = [];
      const _temp3 = function () {
        if (oDataV4) {
          return Promise.resolve(getContextPropertiesForODataV4(model, entitySetName, propertyPath)).then(function (_getContextProperties) {
            contextParameters = _getContextProperties;
          });
        } else {
          contextParameters = getContextPropertiesForODataV2(path, model, entitySetName);
        }
      }();
      return Promise.resolve(_temp3 && _temp3.then ? _temp3.then(_temp4) : _temp4(_temp3));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   * Helper function to fetch data from the given URL. This function is used to fetch data from the OData V4 service.
   *
   * @param url - The URL to fetch data from.
   * @param path - The path to fetch data for.
   * @param urlParameters - The URL parameters.
   * @returns A promise that resolves to the fetched data.
   */
  const fetchDataAsync = function (url, path) {
    let urlParameters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    try {
      const queryParams = {};
      Object.keys(urlParameters).forEach(key => {
        if (urlParameters[key].length) {
          queryParams[key] = urlParameters[key];
        }
      });
      const formattedUrl = url.endsWith("/") ? url : `${url}/`;
      queryParams.format = "json";
      const parameters = encodeURLParameters(queryParams);
      const sFormattedUrl = `${formattedUrl}${path}?${parameters}`;
      return Promise.resolve(fetch(sFormattedUrl).then(response => response.json()).then(data => data).catch(err => {
        throw new Error(err);
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var __exports = {
    __esModule: true
  };
  __exports.createContextParameter = createContextParameter;
  __exports.fetchDataAsync = fetchDataAsync;
  return __exports;
});
//# sourceMappingURL=ODataUtils-dbg-dbg.js.map
