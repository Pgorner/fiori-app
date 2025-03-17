/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/cards/ap/generator/helpers/Formatter"], function (sap_cards_ap_generator_helpers_Formatter) {
  "use strict";

  const createFormatterExpression = sap_cards_ap_generator_helpers_Formatter["createFormatterExpression"];
  const getDefaultPropertyFormatterConfig = sap_cards_ap_generator_helpers_Formatter["getDefaultPropertyFormatterConfig"];
  const getDefaultPropertyFormatterConfigForNavProperties = sap_cards_ap_generator_helpers_Formatter["getDefaultPropertyFormatterConfigForNavProperties"];
  const mI18nMap = {
    FORMAT_DATETIME: "Date Time",
    RELATIVE: "Relative",
    UTC: "UTC",
    FORMAT_DATE: "Date"
  };

  // TODO: Set some default timezone for utc test case
  describe("getDefaultPropertyFormatterConfig", () => {
    let oResourceBundle;
    beforeAll(() => {
      oResourceBundle = {
        getText: key => {
          return mI18nMap[key];
        }
      };
    });
    afterAll(() => {
      oResourceBundle = null;
    });
    test("Get default config for DateTimeOffset type", () => {
      const properties = [{
        label: "Created On",
        type: "Edm.DateTimeOffset",
        name: "CreatedOn"
      }];
      const expectedResult = [{
        formatterName: "format.dateTime",
        parameters: [{
          defaultValue: "",
          displayName: "Options",
          name: "options",
          properties: [{
            defaultValue: false,
            displayName: "Relative",
            name: "relative",
            type: "boolean"
          }, {
            defaultValue: false,
            displayName: "UTC",
            name: "UTC",
            selected: true,
            type: "boolean"
          }],
          type: "object"
        }],
        property: "CreatedOn",
        type: "Date",
        visible: true
      }];
      const config = getDefaultPropertyFormatterConfig(oResourceBundle, properties);
      expect(config).toMatchObject(expectedResult);
    });
    test("Get default config for DateTime type", () => {
      const properties = [{
        label: "Created On",
        type: "Edm.DateTime",
        name: "CreatedOn"
      }];
      const expectedResult = [{
        formatterName: "format.date",
        parameters: [{
          defaultValue: "",
          displayName: "Options",
          name: "options",
          properties: [{
            defaultValue: false,
            displayName: "UTC",
            name: "UTC",
            selected: true,
            type: "boolean"
          }],
          type: "object"
        }],
        property: "CreatedOn",
        type: "Date",
        visible: true
      }];
      const config = getDefaultPropertyFormatterConfig(oResourceBundle, properties);
      expect(config).toMatchObject(expectedResult);
    });
    test("Get default config for multiple properties", () => {
      const properties = [{
        label: "Updated On",
        type: "Edm.DateTimeOffset",
        name: "UpdatedOn"
      }, {
        label: "Created On",
        type: "Edm.DateTime",
        name: "CreatedOn"
      }, {
        label: "Is Active",
        type: "Edm.Boolean",
        name: "IsActive"
      }];
      const expectedResult = [{
        formatterName: "format.dateTime",
        parameters: [{
          defaultValue: "",
          displayName: "Options",
          name: "options",
          properties: [{
            defaultValue: false,
            displayName: "Relative",
            name: "relative",
            type: "boolean"
          }, {
            defaultValue: false,
            displayName: "UTC",
            name: "UTC",
            selected: true,
            type: "boolean"
          }],
          type: "object"
        }],
        property: "UpdatedOn",
        type: "Date",
        visible: true
      }, {
        formatterName: "format.date",
        parameters: [{
          defaultValue: "",
          displayName: "Options",
          name: "options",
          properties: [{
            defaultValue: false,
            displayName: "UTC",
            name: "UTC",
            selected: true,
            type: "boolean"
          }],
          type: "object"
        }],
        property: "CreatedOn",
        type: "Date",
        visible: true
      }];
      const config = getDefaultPropertyFormatterConfig(oResourceBundle, properties);
      expect(config).toMatchObject(expectedResult);
    });
  });
  describe("createFormatterExpression", () => {
    test("Create formatter expression with properties", () => {
      let formatterDetail = {
        formatterName: "format.float",
        displayName: "Float",
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
            options: [{
              value: "short",
              name: "Short"
            }, {
              value: "long",
              name: "Long"
            }],
            selectedKey: "short"
          }]
        }],
        type: "numeric",
        visible: false,
        property: "net_amount"
      };
      let result = createFormatterExpression(formatterDetail);
      expect(result).toMatchSnapshot();
      formatterDetail = {
        formatterName: "format.float",
        displayName: "Float",
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
            value: 0
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
        visible: false,
        property: "net_amount"
      };
      result = createFormatterExpression(formatterDetail);
      expect(result).toMatchSnapshot();
    });
  });
  describe("getDefaultPropertyFormatterConfigForNavProperties", () => {
    let oResourceBundle;
    beforeAll(() => {
      oResourceBundle = {
        getText: key => {
          return mI18nMap[key];
        }
      };
    });
    afterAll(() => {
      oResourceBundle = null;
    });
    test("Validate if the date FormatterConfigurations are getting updated correctly for the navProperties provided", () => {
      const navProperties = [{
        name: "DraftAdministrativeData",
        properties: [{
          label: "Created At",
          type: "Edm.TimeOfDay",
          name: "CreatedAt"
        }, {
          label: "Draft Created On",
          type: "Edm.DateTimeOffset",
          name: "CreationDateTime"
        }]
      }, {
        name: "to_BPAContact",
        properties: [{
          label: "Lng",
          type: "Edm.String",
          name: "Language"
        }, {
          label: "Date of Birth",
          type: "Edm.DateTime",
          name: "DateOfBirth"
        }, {
          label: "Change At",
          type: "Edm.Date",
          name: "ChangeAt"
        }]
      }, {
        name: "to_DeliveryStatus",
        properties: [{
          label: "Lower Value",
          type: "Edm.String",
          name: "Status"
        }, {
          label: "Delivery Status",
          type: "Edm.String",
          name: "Status_Text"
        }]
      }];
      const result = getDefaultPropertyFormatterConfigForNavProperties(oResourceBundle, navProperties);
      expect(result).toMatchSnapshot();
    });
  });
});
//# sourceMappingURL=Formatter.spec.js.map