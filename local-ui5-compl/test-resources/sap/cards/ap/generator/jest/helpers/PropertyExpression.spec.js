/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/cards/ap/generator/helpers/PropertyExpression"], function (sap_cards_ap_generator_helpers_PropertyExpression) {
  "use strict";

  const extractPathExpressionWithoutUOM = sap_cards_ap_generator_helpers_PropertyExpression["extractPathExpressionWithoutUOM"];
  const extractPathWithoutUOM = sap_cards_ap_generator_helpers_PropertyExpression["extractPathWithoutUOM"];
  const extractPropertyConfigurationWithoutTextArrangement = sap_cards_ap_generator_helpers_PropertyExpression["extractPropertyConfigurationWithoutTextArrangement"];
  const getArrangements = sap_cards_ap_generator_helpers_PropertyExpression["getArrangements"];
  const getExpressionParts = sap_cards_ap_generator_helpers_PropertyExpression["getExpressionParts"];
  const hasFormatter = sap_cards_ap_generator_helpers_PropertyExpression["hasFormatter"];
  const isExpression = sap_cards_ap_generator_helpers_PropertyExpression["isExpression"];
  const isI18nExpression = sap_cards_ap_generator_helpers_PropertyExpression["isI18nExpression"];
  const parseFormatterExpression = sap_cards_ap_generator_helpers_PropertyExpression["parseFormatterExpression"];
  const resolvePropertyPathFromExpression = sap_cards_ap_generator_helpers_PropertyExpression["resolvePropertyPathFromExpression"];
  describe("getArrangements", () => {
    test("Get arrangements for property with binding", () => {
      const propertyValue = "{Property1}";
      const mOptions = {
        unitOfMeasures: [{
          name: "Property1",
          value: "{Property1UOM}"
        }],
        textArrangements: [{
          name: "Property1",
          value: "{Property1Arrangement}",
          textArrangement: "TextLast"
        }],
        propertyValueFormatters: []
      };
      const result = getArrangements(propertyValue, mOptions);
      expect(result).toMatchSnapshot();
    });
    test("Get arrangements for property with formatters", () => {
      const propertyValue = "net_amount";
      const mOptions = {
        unitOfMeasures: [{
          name: "net_amount",
          value: "{net_amount}"
        }],
        textArrangements: [{
          name: "net_amount",
          value: "{Property1Arrangement}",
          textArrangement: "TextLast"
        }],
        propertyValueFormatters: [{
          formatterName: "format.float",
          displayName: "Float (format.float)",
          parameters: [{
            name: "options",
            displayName: "Options",
            type: "object",
            defaultValue: "",
            properties: [{
              name: "decimals",
              displayName: "Decimals",
              type: "number",
              defaultValue: 2,
              value: 3
            }, {
              name: "style",
              displayName: "Style",
              type: "enum",
              defaultSelectedKey: "short",
              selectedKey: "long",
              options: [{
                value: "short",
                name: "Short"
              }, {
                value: "long",
                name: "Long"
              }],
              value: "short"
            }]
          }],
          type: "numeric",
          visible: true,
          property: "net_amount"
        }]
      };
      const result = getArrangements(propertyValue, mOptions);
      expect(result).toMatchSnapshot();
    });
    test("Get Arrangements for property with UOM, formatter and text arrangement", () => {
      const propertyValue = "{net_amount}";
      const mOptions = {
        unitOfMeasures: [{
          arrangementKey: "currency_code",
          name: "net_amount",
          propKey: "net_amount",
          value: "currency_code"
        }],
        textArrangements: [{
          propKey: "net_amount",
          name: "net_amount",
          arrangementKey: "so_id",
          value: "so_id",
          arrangementType: "TextFirst",
          textArrangement: "TextFirst"
        }],
        propertyValueFormatters: [{
          property: "net_amount",
          formatterName: "format.float",
          displayName: "Float (format.float)",
          parameters: [{
            name: "options",
            displayName: "Options",
            type: "object",
            defaultValue: "",
            properties: [{
              name: "decimals",
              displayName: "Decimals",
              type: "number",
              defaultValue: 2,
              value: 2
            }, {
              name: "style",
              displayName: "Style",
              type: "enum",
              defaultSelectedKey: "short",
              selectedKey: "short",
              options: [{
                value: "short",
                name: "Short"
              }, {
                value: "long",
                name: "Long"
              }]
            }]
          }],
          type: "numeric",
          visible: true
        }]
      };
      const result = getArrangements(propertyValue, mOptions);
      expect(result).toMatchSnapshot();
    });
    test("Get Arrangements for property with TextFirst arrangement", () => {
      const propertyValue = "{net_amount}";
      const mOptions = {
        unitOfMeasures: [],
        textArrangements: [{
          propKey: "net_amount",
          name: "net_amount",
          arrangementKey: "so_id",
          value: "so_id",
          arrangementType: "TextFirst",
          textArrangement: "TextFirst"
        }],
        propertyValueFormatters: []
      };
      const result = getArrangements(propertyValue, mOptions);
      expect(result).toMatchSnapshot();
    });
    test("Get Arrangements for property with TextSeparate arrangement", () => {
      const propertyValue = "{net_amount}";
      const mOptions = {
        unitOfMeasures: [],
        textArrangements: [{
          propKey: "net_amount",
          name: "net_amount",
          arrangementKey: "so_id",
          value: "so_id",
          arrangementType: "TextSeparate",
          textArrangement: "TextSeparate"
        }],
        propertyValueFormatters: []
      };
      const result = getArrangements(propertyValue, mOptions);
      expect(result).toMatchSnapshot();
    });
    test("Get Arrangements for property with TextSeparate arrangement and UOM with propertyFormatter", () => {
      const propertyValue = "{net_amount}";
      const mOptions = {
        unitOfMeasures: [{
          arrangementKey: "currency_code",
          name: "net_amount",
          propKey: "net_amount",
          value: "currency_code"
        }],
        textArrangements: [{
          propKey: "net_amount",
          name: "net_amount",
          arrangementKey: "so_id",
          value: "so_id",
          arrangementType: "TextSeparate",
          textArrangement: "TextSeparate"
        }],
        propertyValueFormatters: [{
          property: "net_amount",
          formatterName: "format.float",
          displayName: "Float (format.float)",
          parameters: [{
            name: "options",
            displayName: "Options",
            type: "object",
            defaultValue: "",
            properties: [{
              name: "decimals",
              displayName: "Decimals",
              type: "number",
              defaultValue: 2,
              value: 2
            }, {
              name: "style",
              displayName: "Style",
              type: "enum",
              defaultSelectedKey: "short",
              selectedKey: "short",
              options: [{
                value: "short",
                name: "Short"
              }, {
                value: "long",
                name: "Long"
              }]
            }]
          }],
          type: "numeric",
          visible: true
        }]
      };
      const result = getArrangements(propertyValue, mOptions);
      expect(result).toMatchSnapshot();
    });
    test("Get Arrangements for property with TextSeparate arrangement and UOM", () => {
      const propertyValue = "{net_amount}";
      const mOptions = {
        unitOfMeasures: [{
          arrangementKey: "currency_code",
          name: "net_amount",
          propKey: "net_amount",
          value: "currency_code"
        }],
        textArrangements: [{
          propKey: "net_amount",
          name: "net_amount",
          arrangementKey: "so_id",
          value: "so_id",
          arrangementType: "TextSeparate",
          textArrangement: "TextSeparate"
        }],
        propertyValueFormatters: []
      };
      const result = getArrangements(propertyValue, mOptions);
      expect(result).toMatchSnapshot();
    });
    test("Get Arrangements for property with TextSeparate arrangement", () => {
      const propertyValue = "{net_amount}";
      const mOptions = {
        unitOfMeasures: [],
        textArrangements: [{
          propKey: "net_amount",
          name: "net_amount",
          arrangementKey: "so_id",
          value: "so_id",
          arrangementType: "TextSeparate",
          textArrangement: "TextSeparate"
        }],
        propertyValueFormatters: []
      };
      const result = getArrangements(propertyValue, mOptions);
      expect(result).toMatchSnapshot();
    });
    test("Get Arrangements for property with TextFirst arrangement", () => {
      const propertyValue = "{net_amount}";
      const mOptions = {
        unitOfMeasures: [],
        textArrangements: [{
          propKey: "net_amount",
          name: "net_amount",
          arrangementKey: "so_id",
          value: "so_id",
          arrangementType: "TextFirst",
          textArrangement: "TextFirst"
        }],
        propertyValueFormatters: []
      };
      const result = getArrangements(propertyValue, mOptions);
      expect(result).toMatchSnapshot();
    });
    test("Get Arrangements for property with TextLast arrangement", () => {
      const propertyValue = "{net_amount}";
      const mOptions = {
        unitOfMeasures: [],
        textArrangements: [{
          propKey: "net_amount",
          name: "net_amount",
          arrangementKey: "so_id",
          value: "so_id",
          arrangementType: "TextLast",
          textArrangement: "TextLast"
        }],
        propertyValueFormatters: []
      };
      const result = getArrangements(propertyValue, mOptions);
      expect(result).toMatchSnapshot();
    });
    test("Get Arrangements for property with TextFirst arrangement with formatters", () => {
      const propertyValue = "{net_amount}";
      const mOptions = {
        unitOfMeasures: [],
        textArrangements: [{
          propKey: "net_amount",
          name: "net_amount",
          arrangementKey: "so_id",
          value: "so_id",
          arrangementType: "TextFirst",
          textArrangement: "TextFirst"
        }],
        propertyValueFormatters: [{
          property: "net_amount",
          formatterName: "format.float",
          displayName: "Float (format.float)",
          parameters: [{
            name: "options",
            displayName: "Options",
            type: "object",
            defaultValue: "",
            properties: [{
              name: "decimals",
              displayName: "Decimals",
              type: "number",
              defaultValue: 2,
              value: 2
            }, {
              name: "style",
              displayName: "Style",
              type: "enum",
              defaultSelectedKey: "short",
              selectedKey: "short",
              options: [{
                value: "short",
                name: "Short"
              }, {
                value: "long",
                name: "Long"
              }]
            }]
          }],
          type: "numeric",
          visible: true
        }]
      };
      const result = getArrangements(propertyValue, mOptions);
      expect(result).toMatchSnapshot();
    });
    test("Get Arrangements for property with TextLast arrangement with formatters", () => {
      const propertyValue = "{net_amount}";
      const mOptions = {
        unitOfMeasures: [],
        textArrangements: [{
          propKey: "net_amount",
          name: "net_amount",
          arrangementKey: "so_id",
          value: "so_id",
          arrangementType: "TextLast",
          textArrangement: "TextLast"
        }],
        propertyValueFormatters: [{
          property: "net_amount",
          formatterName: "format.float",
          displayName: "Float (format.float)",
          parameters: [{
            name: "options",
            displayName: "Options",
            type: "object",
            defaultValue: "",
            properties: [{
              name: "decimals",
              displayName: "Decimals",
              type: "number",
              defaultValue: 2,
              value: 2
            }, {
              name: "style",
              displayName: "Style",
              type: "enum",
              defaultSelectedKey: "short",
              selectedKey: "short",
              options: [{
                value: "short",
                name: "Short"
              }, {
                value: "long",
                name: "Long"
              }]
            }]
          }],
          type: "numeric",
          visible: true
        }]
      };
      const result = getArrangements(propertyValue, mOptions);
      expect(result).toMatchSnapshot();
    });
    test("Get Arrangements for property with TextLast arrangement", () => {
      const propertyValue = "{net_amount}";
      const mOptions = {
        unitOfMeasures: [],
        textArrangements: [{
          propKey: "net_amount",
          name: "net_amount",
          arrangementKey: "so_id",
          value: "so_id",
          arrangementType: "TextLast",
          textArrangement: "TextLast"
        }],
        propertyValueFormatters: []
      };
      const result = getArrangements(propertyValue, mOptions);
      expect(result).toMatchSnapshot();
    });
    test("Get Arrangements for property with TextOnly arrangement and UOM", () => {
      const propertyValue = "{net_amount}";
      const mOptions = {
        unitOfMeasures: [{
          name: "net_amount",
          value: "{net_amount}"
        }],
        textArrangements: [{
          propKey: "net_amount",
          name: "net_amount",
          arrangementKey: "so_id",
          value: "so_id",
          arrangementType: "TextOnly",
          textArrangement: "TextOnly"
        }],
        propertyValueFormatters: []
      };
      const result = getArrangements(propertyValue, mOptions);
      expect(result).toMatchSnapshot();
    });
    test("Get Arrangements for property with TextLast arrangement and UOM", () => {
      const propertyValue = "{net_amount}";
      const mOptions = {
        unitOfMeasures: [{
          name: "net_amount",
          value: "{net_amount}"
        }],
        textArrangements: [{
          propKey: "net_amount",
          name: "net_amount",
          arrangementKey: "so_id",
          value: "so_id",
          arrangementType: "TextLast",
          textArrangement: "TextLast"
        }],
        propertyValueFormatters: []
      };
      const result = getArrangements(propertyValue, mOptions);
      expect(result).toMatchSnapshot();
    });
    test("Get Arrangements for property with TextFirst arrangement and UOM", () => {
      const propertyValue = "{net_amount}";
      const mOptions = {
        unitOfMeasures: [{
          name: "net_amount",
          value: "{net_amount}"
        }],
        textArrangements: [{
          propKey: "net_amount",
          name: "net_amount",
          arrangementKey: "so_id",
          value: "so_id",
          arrangementType: "TextFirst",
          textArrangement: "TextFirst"
        }],
        propertyValueFormatters: []
      };
      const result = getArrangements(propertyValue, mOptions);
      expect(result).toMatchSnapshot();
    });
    test("Get Arrangements for property with TextFirst arrangement, when both property and matching UoM has formatter", () => {
      const propertyValue = "gross_amount";
      const mOptions = {
        unitOfMeasures: [{
          name: "gross_amount",
          value: "currency_code"
        }],
        textArrangements: [{
          propKey: "gross_amount",
          name: "gross_amount",
          arrangementKey: "net_amount",
          value: "net_amount",
          arrangementType: "TextFirst",
          textArrangement: "TextFirst"
        }],
        propertyValueFormatters: [{
          property: "net_amount",
          formatterName: "format.float",
          displayName: "Float (format.float)",
          parameters: [{
            name: "options",
            displayName: "Options",
            type: "object",
            defaultValue: "",
            properties: [{
              name: "decimals",
              displayName: "Decimals",
              type: "number",
              defaultValue: 2,
              value: 1
            }, {
              name: "style",
              displayName: "Style",
              type: "enum",
              defaultSelectedKey: "short",
              selectedKey: "short",
              options: [{
                value: "short",
                name: "Short"
              }, {
                value: "long",
                name: "Long"
              }]
            }]
          }],
          type: "numeric",
          visible: true
        }, {
          property: "gross_amount",
          formatterName: "format.float",
          displayName: "Float (format.float)",
          parameters: [{
            name: "options",
            displayName: "Options",
            type: "object",
            defaultValue: "",
            properties: [{
              name: "decimals",
              displayName: "Decimals",
              type: "number",
              defaultValue: 2,
              value: 1
            }, {
              name: "style",
              displayName: "Style",
              type: "enum",
              defaultSelectedKey: "short",
              selectedKey: "short",
              options: [{
                value: "short",
                name: "Short"
              }, {
                value: "long",
                name: "Long"
              }]
            }]
          }],
          type: "numeric",
          visible: true
        }]
      };
      const result = getArrangements(propertyValue, mOptions);
      expect(result).toMatchSnapshot();
    });
  });
  describe("Utility methods", () => {
    const cardManifest = {
      _version: "1.15.0",
      "sap.app": {
        id: "objectCard",
        type: "card",
        title: "Sales Order",
        subTitle: "A Fiori application. | {overall_status}",
        applicationVersion: {
          version: "1.0.0"
        }
      },
      "sap.ui": {
        technology: "UI5",
        icons: {
          icon: "sap-icon://switch-classes"
        }
      },
      "sap.card": {
        extension: "module:sap/cards/ap/common/extensions/BaseIntegrationCardExtension",
        type: "Object",
        configuration: {
          parameters: {
            contextParameters: {
              type: "string",
              value: "node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true"
            },
            _propertyFormatting: {
              net_amount: {
                arrangements: {
                  text: {
                    TextLast: true,
                    path: "{overall_status}"
                  }
                }
              }
            }
          },
          destinations: {
            service: {
              name: "(default)",
              defaultUrl: "/"
            }
          },
          csrfTokens: {
            token1: {
              data: {
                request: {
                  url: "{{destinations.service}}/sap/opu/odata/sap/salesorder",
                  method: "HEAD",
                  headers: {
                    "X-CSRF-Token": "Fetch"
                  }
                }
              }
            }
          }
        },
        data: {
          request: {
            url: "{{destinations.service}}/sap/opu/odata/sap/salesorder/$batch",
            method: "POST",
            headers: {
              "X-CSRF-Token": "{{csrfTokens.token1}}"
            },
            batch: {
              header: {
                method: "GET",
                url: "C_STTA_SalesOrder_WD_20({{parameters.contextParameters}})",
                headers: {
                  Accept: "application/json",
                  "Accept-Language": "{{parameters.LOCALE}}"
                },
                retryAfter: 30
              },
              content: {
                method: "GET",
                url: "C_STTA_SalesOrder_WD_20({{parameters.contextParameters}})",
                headers: {
                  Accept: "application/json",
                  "Accept-Language": "{{parameters.LOCALE}}"
                }
              }
            }
          }
        },
        header: {
          data: {
            path: "/content/d/"
          },
          type: "Numeric",
          title: "Sales Order",
          subTitle: "A Fiori application.",
          unitOfMeasurement: "",
          mainIndicator: {
            number: '{= format.float(${net_amount}, {"decimals":2,"style":"short"})} {currency_code}',
            unit: "",
            trend: "None",
            state: "None"
          }
        },
        content: {
          data: {
            path: "/content/d/"
          },
          groups: [{
            title: "Amount",
            items: [{
              label: "Net Amount",
              value: '{= format.float(${net_amount}, {"decimals":2,"style":"short"})} {currency_code}',
              name: "net_amount"
            }, {
              label: "Gross Amount",
              value: "{gross_amount} {currency_code}",
              name: "gross_amount"
            }, {
              label: "Tax Amount",
              value: "{tax_amount} {currency_code}",
              name: "tax_amount"
            }]
          }]
        }
      }
    };
    test("Validate is a property value is expression", () => {
      const propertyValue = "{Property1}";
      const result = isExpression(propertyValue);
      expect(result).toBe(true);
      const propertyValue2 = "Property1";
      const result2 = isExpression(propertyValue2);
      expect(result2).toBe(false);
    });
    test("Validate if property value is an i18n text", () => {
      const sPropertyValue = "{{Property1}}";
      const result = isI18nExpression(sPropertyValue);
      expect(result).toBe(true);
      const sPropertyValue2 = "Property1";
      const result2 = isI18nExpression(sPropertyValue2);
      expect(result2).toBe(false);
      const sPropertyValue3 = "{Property1}";
      const result3 = isI18nExpression(sPropertyValue3);
      expect(result3).toBe(false);
    });
    test("Validate if a property value has a formatter", () => {
      const sPropertyValue = '{= format.float(${net_amount}, {"decimals":2,"style":"long"})}';
      const result = hasFormatter(sPropertyValue);
      expect(result).toBe(true);
      const sPropertyValue2 = "{net_amount}";
      const result2 = hasFormatter(sPropertyValue2);
      expect(result2).toBe(false);
    });
    test("Extract path without UOM", () => {
      const propertyValue = "{net_amount}";
      const result = extractPathWithoutUOM(propertyValue);
      expect(result).toBe("net_amount");
      const propertyValue2 = "{net_amount} {currency_code}";
      const result2 = extractPathWithoutUOM(propertyValue2);
      expect(result2).toBe("net_amount");
    });
    test("Extract path expression without UOM", () => {
      const propertyValue = "{net_amount}";
      const result = extractPathExpressionWithoutUOM(propertyValue);
      expect(result).toBe("{net_amount}");
      const propertyValue2 = "{net_amount} {currency_code}";
      const result2 = extractPathExpressionWithoutUOM(propertyValue2);
      expect(result2).toBe("{net_amount}");
    });
    test("Resolve property path from expression", () => {
      const propertyValue = "{net_amount}";
      const result = resolvePropertyPathFromExpression(propertyValue, cardManifest);
      expect(result).toBe("{net_amount}");
      const propertyValue2 = '{= format.float(${net_amount}, {"decimals":2,"style":"long"})} {currency_code}';
      const result2 = resolvePropertyPathFromExpression(propertyValue2, cardManifest);
      expect(result2).toBe("{net_amount}");
    });
    test("getExpressionParts: parse expression and extract paths", () => {
      const expressions = ['{= format.float(${net_amount}, {"decimals":2,"style":"long"})}', '{= format.float(${net_amount}, {"decimals":2,"style":"long"})} {currency_code}', '{= format.float(${net_amount}, {"decimals":2,"style":"long"})} ({so_id}) {currency_code}', '{so_id} ({= format.float(${net_amount}, {"decimals":2,"style":"long"})}) {currency_code}'];
      const result = expressions.map(getExpressionParts);
      expect(result).toMatchSnapshot();
    });
    test("extractPathWithoutTextArrangement: extract path without text arrangement", () => {
      const expressions = ['{= format.float(${net_amount}, {"decimals":2,"style":"long"})}', '{= format.float(${net_amount}, {"decimals":2,"style":"long"})} {currency_code}', '{= format.float(${net_amount}, {"decimals":2,"style":"long"})} ({so_id}) {currency_code}', '{so_id} ({= format.float(${net_amount}, {"decimals":2,"style":"long"})}) {currency_code}', '{= format.float(${net_amount}, {"decimals":2,"style":"short"})} ({=format.dateTime(${created_at}, {"relative":false,"UTC":true})}) {currency_code}'];
      const result = expressions.map(expression => extractPropertyConfigurationWithoutTextArrangement(expression, cardManifest));
      expect(result).toMatchSnapshot();
    });
  });
  describe("Parse formatter expression", () => {
    describe("Parse date type formatters", () => {
      test("Parse format.date formatter", () => {
        const propertyValue = '{= format.date(${created_at}, {"UTC":true})}';
        const result = parseFormatterExpression(propertyValue);
        expect(result).toMatchSnapshot();
      });
      test("Parse format.dateTime formatter", () => {
        const propertyValue = '{= format.dateTime(${created_at}, {"UTC":true, "relative": true})}';
        const result = parseFormatterExpression(propertyValue);
        expect(result).toMatchSnapshot();
      });
    });
    describe("Parse numeric type formatters", () => {
      test("Parse format.float formatter", () => {
        const propertyValue = '{= format.float(${net_amount}, {"decimals":2,"style":"long"})}';
        const result = parseFormatterExpression(propertyValue);
        expect(result).toMatchSnapshot();
      });
      test("Parse format.currency formatter", () => {
        const propertyValue = '{= format.currency(${net_amount}, "INR" , {"currencyCode":true})}';
        const result = parseFormatterExpression(propertyValue);
        expect(result).toMatchSnapshot();
      });
      test("Parse format.percent formatter", () => {
        const propertyValue = "{= format.percent(${net_amount})}";
        const result = parseFormatterExpression(propertyValue);
        expect(result).toMatchSnapshot();
      });
      test("Parse format.integer formatter", () => {
        const propertyValue = "{= format.integer(${net_amount})}";
        const result = parseFormatterExpression(propertyValue);
        expect(result).toMatchSnapshot();
      });
    });
  });
  describe("getArrangements with matching UOM, without matching arrangement", () => {
    test("property with binding, float formatter and matching UOM - when matching UOM does not have formatter", () => {
      const sPropertyName = "{net_amount}";
      const mOptions = {
        unitOfMeasures: [{
          name: "net_amount",
          value: "currency_code"
        }],
        textArrangements: [],
        propertyValueFormatters: [{
          property: "net_amount",
          formatterName: "format.float",
          displayName: "Float (format.float)",
          parameters: [{
            name: "options",
            displayName: "Options",
            type: "object",
            defaultValue: "",
            properties: [{
              name: "decimals",
              displayName: "Decimals",
              type: "number",
              defaultValue: 2,
              value: 1
            }, {
              name: "style",
              displayName: "Style",
              type: "enum",
              defaultSelectedKey: "short",
              selectedKey: "long",
              options: [{
                value: "short",
                name: "Short"
              }, {
                value: "long",
                name: "Long"
              }]
            }]
          }],
          type: "numeric",
          visible: true
        }]
      };
      const result = getArrangements(sPropertyName, mOptions);
      expect(result).toMatchSnapshot();
    });
    test("property with binding, float formatter and matching UOM - when matching UOM has formatter", () => {
      const sPropertyName = "{net_amount}";
      const mOptions = {
        unitOfMeasures: [{
          name: "net_amount",
          value: "{net_amount}"
        }],
        textArrangements: [],
        propertyValueFormatters: [{
          property: "net_amount",
          formatterName: "format.float",
          displayName: "Float (format.float)",
          parameters: [{
            name: "options",
            displayName: "Options",
            type: "object",
            defaultValue: "",
            properties: [{
              name: "decimals",
              displayName: "Decimals",
              type: "number",
              defaultValue: 2,
              value: 1
            }, {
              name: "style",
              displayName: "Style",
              type: "enum",
              defaultSelectedKey: "short",
              selectedKey: "long",
              options: [{
                value: "short",
                name: "Short"
              }, {
                value: "long",
                name: "Long"
              }]
            }]
          }],
          type: "numeric",
          visible: true
        }]
      };
      const result = getArrangements(sPropertyName, mOptions);
      expect(result).toMatchSnapshot();
    });
    test("property with binding, float formatter and matching UOM - when matching UOM with binding, without formatter", () => {
      const sPropertyName = "{net_amount}";
      const mOptions = {
        unitOfMeasures: [{
          name: "net_amount",
          value: "{gross_amount}"
        }],
        textArrangements: [],
        propertyValueFormatters: [{
          property: "net_amount",
          formatterName: "format.float",
          displayName: "Float (format.float)",
          parameters: [{
            name: "options",
            displayName: "Options",
            type: "object",
            defaultValue: "",
            properties: [{
              name: "decimals",
              displayName: "Decimals",
              type: "number",
              defaultValue: 2,
              value: 1
            }, {
              name: "style",
              displayName: "Style",
              type: "enum",
              defaultSelectedKey: "short",
              selectedKey: "long",
              options: [{
                value: "short",
                name: "Short"
              }, {
                value: "long",
                name: "Long"
              }]
            }]
          }],
          type: "numeric",
          visible: true
        }]
      };
      const result = getArrangements(sPropertyName, mOptions);
      expect(result).toMatchSnapshot();
    });
    test("property with matching UOM - when property has pre applied unit formatter with formatOptions", () => {
      const sPropertyName = "net_amount";
      const mOptions = {
        unitOfMeasures: [{
          name: "net_amount",
          value: "so_id"
        }],
        textArrangements: [],
        propertyValueFormatters: [{
          property: "net_amount",
          formatterName: "format.unit",
          displayName: "",
          parameters: [{
            name: "type",
            displayName: "",
            type: "string",
            defaultValue: "",
            value: "${currency_code}"
          }, {
            name: "options",
            displayName: "Options",
            type: "object",
            defaultValue: "",
            properties: [{
              name: "decimals",
              displayName: "Decimals",
              type: "number",
              defaultValue: 2,
              value: 1
            }, {
              name: "style",
              displayName: "Style",
              type: "enum",
              defaultSelectedKey: "short",
              options: [{
                value: "short",
                name: "Short"
              }, {
                value: "long",
                name: "Long"
              }],
              selectedKey: "long"
            }]
          }],
          type: "numeric",
          visible: false
        }]
      };
      const result = getArrangements(sPropertyName, mOptions);
      expect(result).toMatchSnapshot();
    });
    test("property with matching UOM - when property has pre applied unit formatter without formatOptions", () => {
      const sPropertyName = "net_amount";
      const mOptions = {
        unitOfMeasures: [{
          name: "net_amount",
          value: "so_id"
        }],
        textArrangements: [],
        propertyValueFormatters: [{
          property: "net_amount",
          formatterName: "format.unit",
          displayName: "",
          parameters: [{
            name: "type",
            displayName: "",
            type: "string",
            defaultValue: "",
            value: "${currency_code}"
          }],
          type: "numeric",
          visible: false
        }]
      };
      const result = getArrangements(sPropertyName, mOptions);
      expect(result).toMatchSnapshot();
    });
    test("property with matching UOM - when property and matching UOM does not have any pre applied formatters", () => {
      const sPropertyName = "net_amount";
      const mOptions = {
        unitOfMeasures: [{
          name: "net_amount",
          value: "so_id"
        }],
        textArrangements: [],
        propertyValueFormatters: []
      };
      const result = getArrangements(sPropertyName, mOptions);
      expect(result).toMatchSnapshot();
    });
  });
});
//# sourceMappingURL=PropertyExpression.spec.js.map