/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/ui/integration/formatters/DateTimeFormatter", "../odata/ODataUtils"], function (sap_ui_integration_formatters_DateTimeFormatter, ODataUtils) {
  "use strict";

  const date = sap_ui_integration_formatters_DateTimeFormatter["date"];
  const dateTime = sap_ui_integration_formatters_DateTimeFormatter["dateTime"];
  const formatPropertyDropdownValues = function (property, value) {
    const type = property.type;
    switch (type) {
      case "Edm.Boolean":
        break;
      case "Edm.Date":
      case "Edm.DateTime":
        value = date(value, {
          UTC: true
        });
        break;
      case "Edm.DateTimeOffset":
        value = dateTime(value, {
          UTC: true
        });
        break;
      case "Edm.DateTimeInterval":
      case "Edm.Time":
        break;
      case "Edm.String":
        if (value?.length === 0) {
          value = "<empty>";
        }
        break;
      case "Edm.Integer":
      case "Edm.Float":
        break;
      default:
        break;
    }
    return `${property.label} (${value})`;
  };
  const createFormatterExpression = function (oFormatterDetail) {
    const aFormatterArguments = [];
    aFormatterArguments.push("${" + oFormatterDetail.property + "}");
    let content = oFormatterDetail.formatterName + "("; // dont close brackets here

    const mOptions = {};
    oFormatterDetail.parameters?.forEach(function (mParameters) {
      if (mParameters.properties && mParameters.properties.length > 0) {
        mParameters.properties.forEach(function (oProperties) {
          switch (oProperties.type) {
            case "boolean":
              if (!oProperties.selected) {
                oProperties.selected = false;
              }
              mOptions[oProperties.name] = oProperties.selected;
              break;
            case "number":
              if (typeof oProperties.value === "number") {
                mOptions[oProperties.name] = parseFloat(oProperties.value);
              }
              break;
            case "enum":
              if (oProperties.selectedKey) {
                mOptions[oProperties.name] = oProperties.selectedKey;
              }
              break;
            default:
              mOptions[oProperties.name] = oProperties.value;
              break;
          }
        });
        if (JSON.stringify(mOptions) !== "{}") {
          aFormatterArguments.push(JSON.stringify(mOptions));
        }
      } else {
        switch (mParameters.type) {
          case "boolean":
            if (!mParameters.selected) {
              mParameters.selected = false;
            }
            aFormatterArguments.push(mParameters.selected);
            break;
          case "number":
            aFormatterArguments.push(parseFloat(mParameters.value));
            break;
          case "enum":
            aFormatterArguments.push(mParameters.selectedKey);
            break;
          default:
            aFormatterArguments.push(mParameters.value);
            break;
        }
      }
    });
    content = content.concat(aFormatterArguments[0]);
    for (let i = 1; i < aFormatterArguments.length; i++) {
      const aFormatter = aFormatterArguments[i];
      const bindingOrFormatterArray = ["{", "[", "$"];
      const hasBindingOrFormatter = bindingOrFormatterArray.some(item => aFormatter.startsWith(item));
      if (typeof aFormatter === "string" && !hasBindingOrFormatter) {
        content = content.concat(", '" + aFormatter + "' ");
      } else {
        content = content.concat(", " + aFormatter);
      }
    }
    return content + ")";
  };

  /**
   * Generates the default property formatter configuration for date properties.
   *
   * @param {ResourceBundle} i18nModel - The internationalization model used for localization.
   * @param {PropertyInfoMap} properties - The map of property information.
   * @returns {FormatterConfigurationMap} - The configuration map for date formatters.
   */
  const getDefaultPropertyFormatterConfig = function (i18nModel, properties) {
    const dateFormatterConfig = [];
    for (const property of properties) {
      const isPropertyTypeDate = ODataUtils.isPropertyTypeDate(property.type);
      if (property.name && isPropertyTypeDate) {
        const configData = getDateFormatterConfiguration(property.name, property.type, i18nModel);
        dateFormatterConfig.push(configData);
      }
    }
    return dateFormatterConfig;
  };

  /**
   * Generates the default property formatter configuration for navigation properties.
   *
   * @param {ResourceBundle} i18nModel - The internationalization model used for localization.
   * @param {PropertyInfoMap} navProperties - The map of navigation properties.
   * @returns {FormatterConfigurationMap} The formatter configuration map for date properties.
   */
  const getDefaultPropertyFormatterConfigForNavProperties = function (i18nModel, navProperties) {
    const dateFormatterConfig = [];
    for (const navProperty of navProperties) {
      const properties = navProperty.properties || [];
      for (const property of properties) {
        const propertyName = navProperty.name + "/" + property.name;
        const isPropertyTypeDate = ODataUtils.isPropertyTypeDate(property.type);
        if (propertyName && isPropertyTypeDate) {
          const configData = getDateFormatterConfiguration(propertyName, property.type, i18nModel);
          dateFormatterConfig.push(configData);
        }
      }
    }
    return dateFormatterConfig;
  };

  /**
   * Generates configuration data for a given property based on its type.
   *
   * @param {string} propertyName - The name of the property.
   * @param {string} propertyType - The type of the property (e.g., "Edm.DateTimeOffset", "Edm.TimeOfDay", "Edm.DateTime", "Edm.Date").
   * @param {ResourceBundle} i18nModel - The internationalization model used to get localized text.
   * @returns {FormatterConfiguration} The configuration data for the specified property.
   */
  function getDateFormatterConfiguration(propertyName, propertyType, i18nModel) {
    if (propertyType === "Edm.DateTimeOffset" || propertyType === "Edm.TimeOfDay") {
      const configData = {
        property: propertyName,
        formatterName: "format.dateTime",
        displayName: i18nModel.getText("FORMAT_DATETIME") ?? "",
        parameters: [{
          name: "options",
          displayName: "Options",
          type: "object",
          defaultValue: "",
          properties: [{
            name: "relative",
            displayName: i18nModel.getText("RELATIVE") ?? "",
            type: "boolean",
            defaultValue: false
          }, {
            name: "UTC",
            displayName: i18nModel.getText("UTC") ?? "",
            type: "boolean",
            defaultValue: false,
            selected: true
          }]
        }],
        type: "Date",
        visible: true
      };
      return configData;
    } else if (propertyType === "Edm.DateTime" || propertyType === "Edm.Date") {
      const configData = {
        property: propertyName,
        formatterName: "format.date",
        displayName: i18nModel.getText("FORMAT_DATE") ?? "",
        parameters: [{
          name: "options",
          displayName: "Options",
          type: "object",
          defaultValue: "",
          properties: [{
            name: "UTC",
            displayName: i18nModel.getText("UTC") ?? "",
            type: "boolean",
            defaultValue: false,
            selected: true
          }]
        }],
        type: "Date",
        visible: true
      };
      return configData;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.formatPropertyDropdownValues = formatPropertyDropdownValues;
  __exports.createFormatterExpression = createFormatterExpression;
  __exports.getDefaultPropertyFormatterConfig = getDefaultPropertyFormatterConfig;
  __exports.getDefaultPropertyFormatterConfigForNavProperties = getDefaultPropertyFormatterConfigForNavProperties;
  return __exports;
});
//# sourceMappingURL=Formatter-dbg-dbg.js.map
