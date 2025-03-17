/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["../utils/IntegrationCardManifestParser", "./ApplicationInfo"], function (___utils_IntegrationCardManifestParser, ___ApplicationInfo) {
  "use strict";

  const getContentProperties = ___utils_IntegrationCardManifestParser["getContentProperties"];
  const getHeaderProperties = ___utils_IntegrationCardManifestParser["getHeaderProperties"];
  const ApplicationInfo = ___ApplicationInfo["ApplicationInfo"];
  const ODataModelVersion = ___ApplicationInfo["ODataModelVersion"];
  function updateManifestWithSelectQueryParams(cardManifest) {
    const headerSelectProperties = getHeaderProperties(cardManifest);
    const headerSelect = createUrlParameters(headerSelectProperties).$select;
    const headerSelectQuery = headerSelect && "$select=" + headerSelect;
    const contentSelectProperties = getContentProperties(cardManifest);
    const contentSelect = createUrlParameters(contentSelectProperties).$select;
    const contentSelectQuery = contentSelect && "$select=" + contentSelect;
    const configParameters = cardManifest["sap.card"].configuration?.parameters;
    if (!configParameters && cardManifest["sap.card"].configuration) {
      cardManifest["sap.card"].configuration.parameters = {
        _headerSelectQuery: {
          value: headerSelectQuery
        },
        _contentSelectQuery: {
          value: contentSelectQuery
        }
      };
      return;
    }
    if (headerSelectQuery && configParameters) {
      configParameters._headerSelectQuery = {
        value: headerSelectQuery
      };
    }
    if (contentSelectQuery && configParameters) {
      configParameters._contentSelectQuery = {
        value: contentSelectQuery
      };
    }
  }
  function updateManifestWithExpandQueryParams(cardManifest) {
    const headerProperties = getHeaderProperties(cardManifest);
    const headerExpand = createUrlParameters(headerProperties).$expand;
    const headerExpandQuery = headerExpand && "&$expand=" + headerExpand;
    const contentProperties = getContentProperties(cardManifest);
    const contentExpand = createUrlParameters(contentProperties).$expand;
    const contentExpandQuery = contentExpand && "&$expand=" + contentExpand;
    const configParameters = cardManifest["sap.card"].configuration?.parameters;
    if (!configParameters && cardManifest["sap.card"].configuration) {
      cardManifest["sap.card"].configuration.parameters = {
        _headerExpandQuery: {
          value: headerExpandQuery
        },
        _contentExpandQuery: {
          value: contentExpandQuery
        }
      };
      return;
    }
    if (headerExpandQuery && configParameters) {
      configParameters._headerExpandQuery = {
        value: headerExpandQuery
      };
    }
    if (contentExpandQuery && configParameters) {
      configParameters._contentExpandQuery = {
        value: contentExpandQuery
      };
    }
  }

  /*
   * Based on the odata model version(either v2 or v4) and the query parameters, this function creates the select and expand query parameters
   *
   * @param mParameters
   * @param odataModel
   * @returns
   */
  function createUrlParameters(queryParameters) {
    const {
      odataModel
    } = ApplicationInfo.getInstance().fetchDetails();
    let selectQuery = queryParameters.properties.join(",");
    let expandQuery = "";
    if (odataModel === ODataModelVersion.V4) {
      queryParameters.navigationProperties.forEach(navProp => {
        const selectQueryForNavigationProperty = navProp.properties.join(",");
        expandQuery += expandQuery.length ? "," : "";
        selectQuery += selectQuery.length ? "," : "";
        selectQuery += `${navProp.name}`;
        expandQuery += selectQueryForNavigationProperty.length ? `${navProp.name}($select=${selectQueryForNavigationProperty})` : `${navProp.name}`;
      });
    }
    if (odataModel === ODataModelVersion.V2) {
      queryParameters.navigationProperties.forEach(navProp => {
        selectQuery += selectQuery.length ? "," : "";
        expandQuery += expandQuery.length ? "," : "";
        selectQuery += navProp.properties.length ? navProp.properties.map(property => `${navProp.name}/${property}`) : `${navProp.name}`;
        expandQuery += `${navProp.name}`;
      });
    }
    return {
      $select: selectQuery,
      $expand: expandQuery
    };
  }
  var __exports = {
    __esModule: true
  };
  __exports.updateManifestWithSelectQueryParams = updateManifestWithSelectQueryParams;
  __exports.updateManifestWithExpandQueryParams = updateManifestWithExpandQueryParams;
  __exports.createUrlParameters = createUrlParameters;
  return __exports;
});
//# sourceMappingURL=Batch-dbg-dbg.js.map
