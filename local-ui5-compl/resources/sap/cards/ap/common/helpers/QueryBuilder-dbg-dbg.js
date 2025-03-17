/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define([], function () {
  "use strict";

  /**
   * Updates the content URL with expand query parameters for an integration card.
   *
   * This function checks if the content URL already contains a placeholder for expand query parameters.
   * If not, it appends this placeholder to the URL. Then, it retrieves the expand query parameters from
   * the integration card manifest. If no parameters are found, it removes the placeholder from the URL.
   * Otherwise, it replaces the placeholder with the actual expand query parameters.
   *
   * @param {string} contentUrl - The original content URL that may or may not contain the expand query placeholder.
   * @param {CardManifest} integrationCardManifest - The manifest of the integration card, which includes configuration for expand queries.
   * @returns {string} The updated content URL with the appropriate expand query parameters inserted, or the placeholder removed if no parameters are found.
   */
  const updateExpandQuery = function (contentUrl, integrationCardManifest) {
    if (contentUrl.indexOf("{{parameters._contentExpandQuery}}") === -1) {
      contentUrl += "{{parameters._contentExpandQuery}}";
    }
    const expandQueryParams = getExpandQueryParams(integrationCardManifest);
    if (!expandQueryParams) {
      return contentUrl.replace("{{parameters._contentExpandQuery}}", "");
    }
    return contentUrl.replace("{{parameters._contentExpandQuery}}", expandQueryParams);
  };

  /**
   * Separates expand query parameters into navigation properties with select queries and standalone navigation properties.
   *
   * This function processes an array of expand query parameters and categorizes them into two groups:
   * - Navigation properties with select queries: These are properties that include nested select queries, indicated by parentheses.
   * - Standalone navigation properties: These are properties without nested select queries.
   *
   * The categorization is achieved by iterating through the expand query parameters and using a stack to track
   * nested structures. The function identifies parameters that start with an opening bracket but do not close,
   * parameters that close but do not open, and parameters that are standalone or fully enclosed within brackets.
   *
   * @param {string[]} expandQueryParams - An array of expand query parameters to be categorized.
   * @returns {{ navigationPropertiesWithSelect: string[], navigationProperties: string[] }} An object containing two arrays:
   *          `navigationPropertiesWithSelect` for properties with select queries, and `navigationProperties` for standalone properties.
   */
  const getSeparatedProperties = function (expandQueryParams) {
    const stack = [];
    const navigationPropertiesWithSelect = [];
    let selectProperties = [];
    const navigationProperties = [];
    expandQueryParams.forEach(expandQueryParam => {
      const hasOpeningBracket = expandQueryParam.indexOf("(") > -1;
      const hasClosingBracket = expandQueryParam.indexOf(")") > -1;
      if (hasOpeningBracket && hasClosingBracket) {
        navigationPropertiesWithSelect.push(expandQueryParam);
      } else if (hasOpeningBracket && !hasClosingBracket) {
        selectProperties = [];
        stack.push("(");
        selectProperties.push(expandQueryParam);
      } else if (hasClosingBracket) {
        selectProperties.push(expandQueryParam);
        stack.pop();
        if (stack.length === 0) {
          navigationPropertiesWithSelect.push(selectProperties.join(","));
        }
      } else if (stack.length !== 0) {
        selectProperties.push(expandQueryParam);
      } else {
        navigationProperties.push(expandQueryParam);
      }
    });
    return {
      navigationPropertiesWithSelect,
      navigationProperties
    };
  };

  /**
   * Formats the expand query parameters for OData requests.
   *
   * This function takes a map where each key represents a navigation property and its value is an array of properties to select.
   * It constructs a string for the `$expand` query parameter of an OData request. For navigation properties without any select
   * properties, it appends just the property name. For those with select properties, it appends the property name followed by
   * `($select=...)` specifying the properties to select. The resulting string is a comma-separated list of these formatted properties,
   * suitable for inclusion in an OData query URL.
   *
   * @param {Map<string, string[]>} mapProperties - A map where keys are navigation property names and values are arrays of property names to select.
   * @returns {string} A formatted string representing the `$expand` query parameter for an OData request.
   */
  const formatExpandQuery = function (mapProperties) {
    let formattedExpandQuery = "";
    mapProperties.forEach((value, key) => {
      if (value.length === 0) {
        formattedExpandQuery += key + ",";
      } else {
        formattedExpandQuery += key + "($select=" + value.join(",") + "),";
      }
    });
    return formattedExpandQuery.substring(0, formattedExpandQuery.length - 1);
  };

  /**
   * Formats the expand query parameters for OData requests.
   *
   * This function takes an array of expand query parameters and separates them into two categories:
   * navigation properties with select queries and standalone navigation properties. It then constructs
   * a map where each key is a navigation property and its value is an array of properties to select.
   * For navigation properties with select queries, it parses and aggregates the properties to select.
   * Standalone navigation properties are added with an empty array as their value. Finally, it formats
   * this map into a string suitable for the `$expand` query parameter in an OData request.
   *
   * @param {string[]} expandQueryParams - An array of expand query parameters to be formatted.
   * @returns {string} A formatted string representing the `$expand` query parameter for an OData request.
   */
  const getFormattedExpandQuery = function (expandQueryParams) {
    const {
      navigationPropertiesWithSelect,
      navigationProperties
    } = getSeparatedProperties(expandQueryParams);
    const properties = new Map();
    navigationPropertiesWithSelect.forEach(property => {
      const navigationProperty = property.substring(0, property.indexOf("("));
      property = property.replace(navigationProperty, "").replace("($select=", "").replace(")", "");
      const existingProperties = properties.get(navigationProperty) || [];
      if (existingProperties.length === 0) {
        properties.set(navigationProperty, property.split(","));
      } else {
        const propertiesToAdd = property.split(",");
        propertiesToAdd.forEach(prop => {
          if (!existingProperties.includes(prop)) {
            existingProperties.push(prop);
          }
        });
        properties.set(navigationProperty, existingProperties);
      }
    });
    navigationProperties.forEach(property => {
      properties.set(property, []);
    });
    return formatExpandQuery(properties);
  };

  /**
   *
   * Function to get the expand query parameters for the adaptive card content url
   *
   * @param cardManifest
   * @returns
   */
  const getExpandQueryParams = function (cardManifest) {
    const configParameters = cardManifest["sap.card"].configuration?.parameters;
    if (!configParameters) {
      return "";
    }
    const headerExpandQuery = configParameters?._headerExpandQuery?.value.replace("$expand=", "") || "";
    const contentExpandQuery = configParameters?._contentExpandQuery?.value.replace("$expand=", "") || "";
    const headerExpandQueryParams = headerExpandQuery ? headerExpandQuery.split(",") : [];
    const contentExpandQueryParams = contentExpandQuery ? contentExpandQuery.split(",") : [];
    if (headerExpandQueryParams.length || contentExpandQueryParams.length) {
      const firstQueryParamContent = contentExpandQueryParams[0];
      const operatorContent = firstQueryParamContent.indexOf("?") > -1 ? "?" : "&";
      if (headerExpandQueryParams.length) {
        headerExpandQueryParams[0] = headerExpandQueryParams[0]?.replace(operatorContent, "");
      }
      if (contentExpandQueryParams.length) {
        contentExpandQueryParams[0] = contentExpandQueryParams[0]?.replace(operatorContent, "");
      }
      const mergedExpandQueryParams = headerExpandQueryParams.concat(contentExpandQueryParams);
      const expandQueryParams = Array.from(new Set(mergedExpandQueryParams));
      if (headerExpandQuery.indexOf("$select") > -1 || contentExpandQuery.indexOf("$select") > -1) {
        const expandQuery = getFormattedExpandQuery(expandQueryParams);
        return expandQuery ? `${operatorContent}$expand=` + expandQuery : "";
      }
      return expandQueryParams.length ? `${operatorContent}$expand=` + expandQueryParams.join(",") : "";
    }
    return "";
  };

  /**
   * Function to form the select query parameters for the adaptive card content url
   *
   * @param cardManifest
   * @returns {string} The select query parameters
   * @private
   */
  const getSelectQueryParams = function (cardManifest) {
    const configParameters = cardManifest["sap.card"].configuration?.parameters;
    if (configParameters) {
      const headerSelectQuery = configParameters?._headerSelectQuery?.value.replace("$select=", "");
      const contentSelectQuery = configParameters?._contentSelectQuery?.value.replace("$select=", "");
      const headerSelectQueryParams = headerSelectQuery ? headerSelectQuery.split(",") : [];
      const contentSelectQueryParams = contentSelectQuery ? contentSelectQuery.split(",") : [];
      if (headerSelectQueryParams.length || contentSelectQueryParams.length) {
        const mergedSelectQueryParams = headerSelectQueryParams.concat(contentSelectQueryParams);
        const selectQueryParams = Array.from(new Set(mergedSelectQueryParams));
        return selectQueryParams.length ? "$select=" + selectQueryParams.join(",") : "";
      }
    }
    return "";
  };

  /**
   * Updates the content URL with select query parameters for an integration card.
   *
   * This function checks if the content URL already contains a placeholder for select query parameters.
   * If not, it appends this placeholder to the URL. Then, it retrieves the select query parameters from
   * the integration card manifest. If parameters are found, it replaces the placeholder in the URL with
   * these parameters. Otherwise, it removes the placeholder from the URL, preparing it for potential
   * expansion handling in the future.
   *
   * @param {string} contentUrl - The original content URL that may or may not contain the select query placeholder.
   * @param {CardManifest} integrationCardManifest - The manifest of the integration card, which includes configuration for select queries.
   * @returns {string} The updated content URL with the appropriate select query parameters inserted, or the placeholder removed if no parameters are found.
   */
  const updateSelectQuery = function (contentUrl, integrationCardManifest) {
    if (contentUrl.indexOf("?{{parameters._contentSelectQuery}}") === -1) {
      contentUrl = contentUrl + "?{{parameters._contentSelectQuery}}";
    }
    const selectQueryParams = getSelectQueryParams(integrationCardManifest);
    if (selectQueryParams) {
      contentUrl = contentUrl.replace("{{parameters._contentSelectQuery}}", selectQueryParams);
    } else {
      // Once we enable $expand, we need to conditionally handle it here.
      contentUrl = contentUrl.replace("?{{parameters._contentSelectQuery}}", "");
    }
    return contentUrl;
  };
  var __exports = {
    __esModule: true
  };
  __exports.updateExpandQuery = updateExpandQuery;
  __exports.getSeparatedProperties = getSeparatedProperties;
  __exports.updateSelectQuery = updateSelectQuery;
  return __exports;
});
//# sourceMappingURL=QueryBuilder-dbg-dbg.js.map
