/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/base/security/encodeURLParameters", "sap/cards/ap/common/odata/ODataUtils", "sap/ui/model/odata/v2/ODataModel", "./ODataTypes", "./v2/MetadataAnalyzer", "./v4/MetadataAnalyzer"], function (encodeURLParameters, sap_cards_ap_common_odata_ODataUtils, V2ODataModel, ___ODataTypes, V2MetadataAnalyzer, V4MetadataAnalyzer) {
  "use strict";

  const createContextParameter = sap_cards_ap_common_odata_ODataUtils["createContextParameter"];
  const PropertyInfoType = ___ODataTypes["PropertyInfoType"];
  const {
    getLabelForEntitySet: getLabelForEntitySetV2,
    getPropertyInfoFromEntity: getPropertyInfoFromEntityV2,
    getNavigationPropertyInfoFromEntity: getNavigationPropertyInfoFromEntityV2,
    getMetaModelObjectForEntitySet: getMetaModelObjectForEntitySetForODataV2
  } = V2MetadataAnalyzer;
  const {
    getLabelForEntitySet: getLabelForEntitySetV4,
    getPropertyInfoFromEntity: getPropertyInfoFromEntityV4,
    getNavigationPropertyInfoFromEntity: getNavigationPropertyInfoFromEntityV4,
    getMetaModelObjectForEntitySet: getMetaModelObjectForEntitySetForODataV4
  } = V4MetadataAnalyzer;
  const isODataV4Model = function (oModel) {
    return oModel && oModel.isA("sap.ui.model.odata.v4.ODataModel") || false;
  };
  const fetchDataAsyncV4 = function (sUrl, sPath, queryParams) {
    try {
      const formattedUrl = sUrl.endsWith("/") ? sUrl : `${sUrl}/`;
      queryParams.format = "json";
      const parameters = encodeURLParameters(queryParams);
      const sFormattedUrl = `${formattedUrl}${sPath}?${parameters}`;
      return Promise.resolve(fetch(sFormattedUrl).then(response => response.json()).then(data => data).catch(err => {
        throw new Error(err);
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  const fetchDataAsyncV2 = function (sUrl, sPath, queryParams) {
    try {
      const oModel = new V2ODataModel(sUrl);
      return Promise.resolve(new Promise(function (resolve, reject) {
        const fnSuccess = function (oData) {
          resolve(oData);
        };
        const fnFailure = function (oError) {
          reject(oError);
        };
        oModel.read("/" + sPath, {
          success: fnSuccess,
          error: fnFailure,
          urlParameters: queryParams
        });
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  const fetchDataAsync = function (sUrl, sPath, bODataV4) {
    let urlParameters = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    try {
      const queryParams = {};
      Object.keys(urlParameters).forEach(key => {
        if (urlParameters[key].length) {
          queryParams[key] = urlParameters[key];
        }
      });
      if (bODataV4) {
        return fetchDataAsyncV4(sUrl, sPath, queryParams);
      } else {
        return fetchDataAsyncV2(sUrl, sPath, queryParams);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  };
  const getLabelForEntitySet = function (oAppModel, sEntitySet) {
    if (!oAppModel) {
      return "";
    }
    if (oAppModel.isA("sap.ui.model.odata.v2.ODataModel")) {
      return getLabelForEntitySetV2(oAppModel, sEntitySet);
    } else {
      return getLabelForEntitySetV4(oAppModel, sEntitySet);
    }
  };
  const getPropertyInfoFromEntity = function (oAppModel, sEntitySet, withNavigation, resourceBundle) {
    if (!oAppModel) {
      return [];
    }
    if (oAppModel.isA("sap.ui.model.odata.v2.ODataModel")) {
      return getPropertyInfoFromEntityV2(oAppModel, sEntitySet, withNavigation, resourceBundle);
    } else {
      return getPropertyInfoFromEntityV4(oAppModel, sEntitySet, withNavigation, resourceBundle);
    }
  };
  const getNavigationPropertyInfoFromEntity = function (oAppModel, sEntitySet) {
    if (!oAppModel) {
      return [];
    }
    if (oAppModel.isA("sap.ui.model.odata.v2.ODataModel")) {
      return getNavigationPropertyInfoFromEntityV2(oAppModel, sEntitySet);
    } else {
      return getNavigationPropertyInfoFromEntityV4(oAppModel, sEntitySet);
    }
  };
  const getMetaModelObjectForEntitySet = function (metaModel, sEntitySet, isODataV4Model) {
    if (!isODataV4Model) {
      return getMetaModelObjectForEntitySetForODataV2(metaModel, sEntitySet);
    } else {
      return getMetaModelObjectForEntitySetForODataV4(metaModel, sEntitySet);
    }
  };
  function getPropertyLabel(oModel, sEntitySet, sProperty) {
    let propertyType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : PropertyInfoType.Property;
    const propertyInfo = propertyType === PropertyInfoType.Property ? getPropertyInfoFromEntity(oModel, sEntitySet, false) : getNavigationPropertyInfoFromEntity(oModel, sEntitySet);
    const property = propertyInfo.find(oProperty => oProperty.name === sProperty);
    return propertyType === PropertyInfoType.Property ? property?.label || "" : property || "";
  }

  /**
   * Get the data type of the property mapped with supported data types by integration cards configuration parameters
   * @param propertyType
   */
  function getDataType(propertyType) {
    const dataTypeMap = {
      Boolean: "boolean",
      Byte: "integer",
      SByte: "integer",
      Int16: "integer",
      Int32: "integer",
      Int64: "number",
      Single: "number",
      Double: "number",
      Float: "number",
      Decimal: "number",
      Guid: "string",
      String: "string",
      Date: "date",
      DateTime: "datetime",
      DateTimeOffset: "datetime",
      Time: "datetime",
      Binary: "",
      Stream: "",
      TimeOfDay: "",
      Duration: ""
    };
    const type = propertyType.startsWith("Edm.") ? propertyType.replace("Edm.", "") : propertyType;
    return dataTypeMap[type] || "string";
  }
  const createPathWithEntityContext = function (path, oAppModel, oDataV4) {
    try {
      const index = path.indexOf("(");
      const entitySetName = path.substring(0, index);
      return Promise.resolve(createContextParameter(path, oAppModel, oDataV4)).then(function (context) {
        return `${entitySetName}(${context})`;
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   * Checks if the given data type is of a date type.
   *
   * @param {string} dataType - The data type to check.
   * @returns {boolean} - Returns `true` if the data type is one of "Edm.Date", "Edm.DateTimeOffset", or "Edm.TimeOfDay"; otherwise, returns `false`.
   */

  function isPropertyTypeDate(dataType) {
    return ["Edm.Date", "Edm.DateTime", "Edm.DateTimeOffset", "Edm.TimeOfDay"].indexOf(dataType) > -1;
  }
  var __exports = {
    __esModule: true
  };
  __exports.isODataV4Model = isODataV4Model;
  __exports.fetchDataAsyncV4 = fetchDataAsyncV4;
  __exports.fetchDataAsync = fetchDataAsync;
  __exports.getLabelForEntitySet = getLabelForEntitySet;
  __exports.getPropertyInfoFromEntity = getPropertyInfoFromEntity;
  __exports.getNavigationPropertyInfoFromEntity = getNavigationPropertyInfoFromEntity;
  __exports.getMetaModelObjectForEntitySet = getMetaModelObjectForEntitySet;
  __exports.getPropertyLabel = getPropertyLabel;
  __exports.getDataType = getDataType;
  __exports.createPathWithEntityContext = createPathWithEntityContext;
  __exports.isPropertyTypeDate = isPropertyTypeDate;
  return __exports;
});
//# sourceMappingURL=ODataUtils-dbg-dbg.js.map
