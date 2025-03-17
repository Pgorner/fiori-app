/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/cards/ap/generator/helpers/ApplicationInfo", "sap/cards/ap/generator/helpers/IntegrationCardHelper", "sap/ui/VersionInfo", "sap/ui/core/UIComponent", "sap/ui/model/json/JSONModel"], function (sap_cards_ap_generator_helpers_ApplicationInfo, sap_cards_ap_generator_helpers_IntegrationCardHelper, VersionInfo, UIComponent, JSONModel) {
  "use strict";

  const ApplicationInfo = sap_cards_ap_generator_helpers_ApplicationInfo["ApplicationInfo"];
  const addQueryParametersToManifest = sap_cards_ap_generator_helpers_IntegrationCardHelper["addQueryParametersToManifest"];
  const createInitialManifest = sap_cards_ap_generator_helpers_IntegrationCardHelper["createInitialManifest"];
  const enhanceManifestWithConfigurationParameters = sap_cards_ap_generator_helpers_IntegrationCardHelper["enhanceManifestWithConfigurationParameters"];
  const enhanceManifestWithInsights = sap_cards_ap_generator_helpers_IntegrationCardHelper["enhanceManifestWithInsights"];
  const getCriticallityStateForGroup = sap_cards_ap_generator_helpers_IntegrationCardHelper["getCriticallityStateForGroup"];
  const getCurrentCardManifest = sap_cards_ap_generator_helpers_IntegrationCardHelper["getCurrentCardManifest"];
  const parseCard = sap_cards_ap_generator_helpers_IntegrationCardHelper["parseCard"];
  const resolvePropertyLabelFromExpression = sap_cards_ap_generator_helpers_IntegrationCardHelper["resolvePropertyLabelFromExpression"];
  const updateCardGroups = sap_cards_ap_generator_helpers_IntegrationCardHelper["updateCardGroups"];
  const updateExistingCardManifest = sap_cards_ap_generator_helpers_IntegrationCardHelper["updateExistingCardManifest"];
  jest.mock(sap.jest.resolvePath("sap/cards/ap/generator/config/FormatterOptions"), () => {
    return {
      getFormatterConfiguration: jest.fn().mockReturnValue([{
        displayName: "Float",
        formatterName: "format.float",
        parameters: [{
          defaultValue: "",
          displayName: "Options",
          name: "options",
          properties: [{
            defaultValue: 2,
            displayName: "Decimals",
            name: "decimals",
            type: "number",
            value: 2
          }, {
            defaultSelectedKey: "short",
            displayName: "Style",
            name: "style",
            options: [{
              name: "Short",
              value: "short"
            }, {
              name: "Long",
              value: "long"
            }],
            selectedKey: "short",
            type: "enum",
            value: "short"
          }],
          type: "object"
        }],
        property: "net_amount",
        type: "numeric",
        visible: true
      }, {
        displayName: "Format Criticality State or Value",
        formatterName: "extension.formatters.formatCriticality",
        parameters: [{
          defaultValue: "",
          displayName: "Criticality States",
          name: "sType",
          type: "string"
        }],
        property: "Language",
        type: "string | numeric",
        visible: false
      }, {
        displayName: "Date Time",
        formatterName: "format.dateTime",
        parameters: [{
          defaultValue: "",
          displayName: "Options",
          name: "options",
          properties: [{
            defaultValue: false,
            displayName: "Relative",
            name: "relative",
            selected: {
              UTC: {
                UTC: true,
                relative: false
              },
              relative: {
                UTC: true,
                relative: false
              }
            },
            type: "boolean"
          }, {
            defaultValue: false,
            displayName: "UTC",
            name: "UTC",
            selected: {
              UTC: {
                UTC: true,
                relative: false
              },
              relative: {
                UTC: true,
                relative: false
              }
            },
            type: "boolean"
          }],
          type: "object"
        }],
        property: "created_at",
        type: "Date",
        visible: true
      }])
    };
  });
  const mI18nMap = {
    APP_TITLE: "Display Settlement Dates",
    APP_SUBTITLE: "Display Settlement Dates",
    HEADER_TITLE: "Header Title",
    HEADER_SUBTITLE: "Header Subtitle",
    UNIT: "USD",
    NUMBER: "500",
    GROUP_TITLE_1: "Group 1",
    GROUP_1_LABEL_1: "Activation Status",
    GROUP_1_VALUE_1: "Condition Control Activation Status",
    GROUP_1_LABEL_2: "Process Category",
    GROUP_1_VALUE_2: "Condition Control Process Category Description",
    GROUP_TITLE_2: "Group 2",
    GROUP_2_LABEL_1: "Sales Organization Description",
    GROUP_2_VALUE_1: "Sales Organization Name",
    GROUP_2_LABEL_2: "Short Description",
    GROUP_2_VALUE_2: "Condition Control Settlement Category Name"
  };
  const sId = "testComponent";
  const oManifest = {
    "sap.app": {
      id: sId,
      type: "application"
    }
  };
  const Component = UIComponent.extend("component", {
    metadata: {
      manifest: oManifest
    },
    createContent() {
      return null;
    }
  });
  const rootComponent = new Component(sId);
  jest.spyOn(rootComponent, "getModel").mockImplementation(yesOrNo => {
    return {
      isA: () => false,
      getMetaModel: function () {
        return {
          getODataEntitySet: function () {
            return {
              entityType: "SD_SALESPLAN.C_SalesPlanTPType"
            };
          },
          getODataAssociationEnd: () => {},
          getODataEntityType: function () {
            return {
              key: {
                propertyRef: [{
                  name: "node_key"
                }, {
                  name: "IsActiveEntity"
                }]
              },
              property: [{
                name: "node_key",
                type: "Edm.Guid",
                nullable: "false",
                "sap:label": "Node Key",
                kind: "Property"
              }, {
                name: "so_id",
                type: "Edm.String",
                maxLength: "10",
                "sap:label": "Sales Order ID",
                kind: "Property"
              }, {
                name: "IsActiveEntity",
                type: "Edm.Boolean",
                kind: "Property"
              }]
            };
          }
        };
      },
      getObject: key => {
        return mI18nMap[key];
      }
    };
  });
  describe("getCurrentCardManifest", () => {
    test("Empty manifest is returned", () => {
      const currentManifest = getCurrentCardManifest();
      expect(currentManifest).toEqual({});
    });
  });
  describe("getCriticallityStateForGroup", () => {
    it("should return formatted property when state has a formatter", () => {
      const testCases = [{
        input: "{= extension.formatters.formatCriticality(${op_id_fc}, 'state') }",
        expected: "{op_id_fc}"
      }, {
        input: "Warning",
        expected: "Critical"
      }, {
        input: "Success",
        expected: "Good"
      }, {
        input: "Error",
        expected: "Error"
      }, {
        input: "UnknownState",
        expected: "Neutral"
      }, {
        input: "",
        expected: "Neutral"
      }];
      testCases.forEach(_ref => {
        let {
          input,
          expected
        } = _ref;
        const result = getCriticallityStateForGroup(input);
        expect(result).toEqual(expected);
      });
    });
    it("should return ColorIndicator.None for empty state", () => {
      const result = getCriticallityStateForGroup("");
      expect(result).toBe("Neutral");
    });
  });
  describe("createInitialManifest", () => {
    let windowSpy;
    beforeAll(() => {
      windowSpy = jest.spyOn(window, "window", "get");
      windowSpy.mockImplementation(() => ({
        hasher: {
          getHash: () => "test-intent&/testEntity(12345)"
        }
      }));
      ApplicationInfo.createInstance(rootComponent);
    });
    afterAll(() => {
      ApplicationInfo.getInstance()._resetInstance();
      windowSpy.mockRestore();
    });
    test("Create initial integration card manifest", () => {
      const manifest = createInitialManifest({
        entitySet: "C_STTA_SalesOrder_WD_20(node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true)",
        service: "/sap/opu/odata/sap/salesorder",
        title: "Sales Order",
        subTitle: "A Fiori application.",
        serviceModel: {
          isA: jest.fn().mockReturnValue(false),
          getMetaModel: () => {
            return {
              getODataAssociationEnd: () => {},
              getODataEntitySet: () => {
                return {
                  entityType: "C_STTA_SalesOrder_WD_20Type"
                };
              },
              getODataEntityType: () => {
                return {
                  key: {
                    propertyRef: [{
                      name: "node_key"
                    }, {
                      name: "so_id"
                    }]
                  },
                  property: [{
                    name: "node_key",
                    type: "Edm.Guid",
                    nullable: "false",
                    "sap:label": "Node Key",
                    kind: "Property"
                  }, {
                    name: "so_id",
                    type: "Edm.String",
                    maxLength: "10",
                    "sap:label": "Sales Order ID",
                    kind: "Property"
                  }]
                };
              }
            };
          }
        },
        sapAppId: "test.app.id",
        sapCoreVersionInfo: {
          version: "1.0.0",
          buildTimestamp: "2021-09-01T00:00:00Z"
        },
        entitySetName: "C_STTA_SalesOrder_WD_20",
        data: {
          node_key: "guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a'",
          so_id: "12345"
        }
      });
      expect(manifest).toMatchSnapshot();
    });
    test("Create initial integration card manifest of OData V4 application", () => {
      const manifest = createInitialManifest({
        entitySet: "SalesContractManage(SalesContract='40000441')",
        service: "/sap/opu/odata/sap/salesorder",
        title: "Manage Sales Contracts",
        subTitle: "A Fiori application.",
        serviceModel: {
          isA: jest.fn().mockReturnValue(true),
          getMetaModel: () => {
            return {
              getObject: sPath => {
                if (sPath === "/SalesContractManage") {
                  return {
                    $Type: "com.sap.gateway.srvd.ui_salescontractmanage.v0001.SalesContractManageType"
                  };
                }
                if (sPath === "/com.sap.gateway.srvd.ui_salescontractmanage.v0001.SalesContractManageType") {
                  return {
                    $Key: ["SalesContract"],
                    SalesContract: {
                      $kind: "Property",
                      $Type: "Edm.String",
                      $Nullable: false,
                      $MaxLength: 10
                    }
                  };
                }
                return {
                  SalesContractManage: {
                    $Type: "com.sap.gateway.srvd.ui_salescontractmanage.v0001.SalesContractManageType"
                  }
                };
              }
            };
          }
        },
        sapAppId: "test.app.id",
        sapCoreVersionInfo: {
          version: "1.0.0",
          buildTimestamp: "2021-09-01T00:00:00Z"
        },
        entitySetName: "SalesContractManage",
        data: {
          SalesContract: "40000441"
        }
      });
      expect(manifest).toMatchSnapshot();
    });
  });
  describe("parseCard", () => {
    test("Validate parseCard generated content", () => {
      const mManifest = {
        _version: "1.15.0",
        "sap.app": {
          id: "objectCard",
          type: "card",
          title: "{{APP_TITLE}}",
          subTitle: "{{APP_SUBTITLE}} | {{UNIT}}",
          description: "Description of an Object Card",
          applicationVersion: {
            version: "1.0.0"
          }
        },
        "sap.card": {
          type: "Object",
          extension: "module:sap/cards/ap/common/extensions/BaseIntegrationCardExtension",
          header: {
            data: {
              path: "/content/"
            },
            type: "Numeric",
            title: "{{HEADER_TITLE}}",
            subTitle: "{{HEADER_SUBTITLE}}",
            unitOfMeasurement: "{CndnContrTypeDesc}",
            mainIndicator: {
              unit: "{{UNIT}}",
              number: "{{NUMBER}}",
              trend: "None"
            },
            sideIndicators: [{
              title: "",
              number: "",
              unit: ""
            }, {
              title: "",
              number: "",
              unit: ""
            }]
          },
          content: {
            groups: [{
              title: "{{GROUP_TITLE_1}}",
              items: [{
                label: "{{GROUP_1_LABEL_1}}",
                value: "{{GROUP_1_VALUE_1}}",
                name: "CndnContrActvtnStatusName",
                type: "Status",
                state: "Success"
              }, {
                label: "{{GROUP_1_LABEL_2}}",
                value: "{{GROUP_1_VALUE_2}}",
                name: "CndnContrProcessCategoryDesc"
              }]
            }, {
              title: "{{GROUP_TITLE_2}}",
              items: [{
                label: "{{GROUP_2_LABEL_1}}",
                value: "{{GROUP_2_VALUE_1}}",
                name: "SalesOrganizationName"
              }, {
                label: "{{GROUP_2_LABEL_2}}",
                value: "{{GROUP_2_VALUE_2}}",
                name: "CndnContrPrtlSettlmtCatName"
              }]
            }]
          }
        }
      };
      const properties = [{
        name: "CndnContrTypeDesc",
        label: "Condition Control Type Description",
        value: "USD",
        labelWithValue: "Condition Control Type Description (USD)"
      }, {
        name: "CndnContrActvtnStatusName",
        label: "Condition Control Activation Status",
        value: "Activated",
        labelWithValue: "Condition Control Activation Status (Activated)"
      }, {
        name: "CndnContrProcessCategoryDesc",
        label: "Condition Control Process Category",
        value: "A",
        labelWithValue: "Condition Control Process Category (A)"
      }, {
        name: "SalesOrganizationName",
        label: "Sales Organization Name",
        value: "Org1",
        labelWithValue: "Sales Organization Name (Org1)"
      }, {
        name: "CndnContrPrtlSettlmtCatName",
        label: "Condition Control Partial Settlement Category Name",
        value: "Cat 1",
        labelWithValue: "Condition Control Partial Settlement Category Name (Cat 1)"
      }];
      const result = parseCard(mManifest, rootComponent.getModel(), properties);
      expect(result).toMatchSnapshot();
    });
    test("Validate parseCard generated content with trend enabled", () => {
      const mManifest = {
        _version: "1.15.0",
        "sap.app": {
          id: "objectCard",
          type: "card",
          title: "{{APP_TITLE}}",
          subTitle: "{{APP_SUBTITLE}} | {{UNIT}}",
          description: "Description of an Object Card",
          applicationVersion: {
            version: "1.0.0"
          }
        },
        "sap.card": {
          type: "Object",
          extension: "module:sap/cards/ap/common/extensions/BaseIntegrationCardExtension",
          header: {
            data: {
              path: "/content/"
            },
            type: "Numeric",
            title: "{{HEADER_TITLE}}",
            subTitle: "{{HEADER_SUBTITLE}}",
            unitOfMeasurement: "{CndnContrTypeDesc}",
            mainIndicator: {
              unit: "{{UNIT}}",
              number: "{{NUMBER}}",
              trend: '{= extension.formatters.formatTrendIcon(${tax_amount},{"referenceValue":3333,"downDifference":11,"upDifference":22}) }'
            },
            sideIndicators: [{
              title: "",
              number: "",
              unit: ""
            }, {
              title: "",
              number: "",
              unit: ""
            }]
          },
          content: {
            groups: [{
              title: "{{GROUP_TITLE_1}}",
              items: [{
                label: "{{GROUP_1_LABEL_1}}",
                value: "{{GROUP_1_VALUE_1}}",
                name: "CndnContrActvtnStatusName"
              }, {
                label: "{{GROUP_1_LABEL_2}}",
                value: "{{GROUP_1_VALUE_2}}",
                name: "CndnContrProcessCategoryDesc"
              }]
            }, {
              title: "{{GROUP_TITLE_2}}",
              items: [{
                label: "{{GROUP_2_LABEL_1}}",
                value: "{{GROUP_2_VALUE_1}}",
                name: "SalesOrganizationName"
              }, {
                label: "{{GROUP_2_LABEL_2}}",
                value: "{{GROUP_2_VALUE_2}}",
                name: "CndnContrPrtlSettlmtCatName"
              }]
            }]
          }
        }
      };
      const properties = [{
        name: "CndnContrTypeDesc",
        label: "Condition Control Type Description",
        value: "USD",
        labelWithValue: "Condition Control Type Description (USD)"
      }, {
        name: "CndnContrActvtnStatusName",
        label: "Condition Control Activation Status",
        value: "Activated",
        labelWithValue: "Condition Control Activation Status (Activated)"
      }, {
        name: "CndnContrProcessCategoryDesc",
        label: "Condition Control Process Category",
        value: "A",
        labelWithValue: "Condition Control Process Category (A)"
      }, {
        name: "SalesOrganizationName",
        label: "Sales Organization Name",
        value: "Org1",
        labelWithValue: "Sales Organization Name (Org1)"
      }, {
        name: "CndnContrPrtlSettlmtCatName",
        label: "Condition Control Partial Settlement Category Name",
        value: "Cat 1",
        labelWithValue: "Condition Control Partial Settlement Category Name (Cat 1)"
      }];
      const result = parseCard(mManifest, rootComponent.getModel(), properties);
      expect(result).toMatchSnapshot();
    });
    test("Validate parseCard generated content when manifest fields have bindings", () => {
      const mManifest = {
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
            unitOfMeasurement: "{overall_status}",
            mainIndicator: {
              number: '{= format.float(${net_amount}, {"decimals":2,"style":"short"})} {currency_code}',
              unit: "",
              trend: '{= extension.formatters.formatTrendIcon(${tax_amount},{"referenceValue":3333,"downDifference":11,"upDifference":22}) }',
              state: "{= extension.formatters.formatCriticality(${Language}, 'color') }"
            },
            sideIndicators: [{
              title: "Target",
              number: "22",
              unit: "K"
            }, {
              title: "Deviation",
              number: "33",
              unit: "%"
            }]
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
                name: "net_amount",
                state: "{= extension.formatters.formatCriticality(${Language}, 'color') }"
              }, {
                label: "Gross Amount",
                value: "{gross_amount} {currency_code}",
                name: "gross_amount",
                state: "Error"
              }, {
                label: "Tax Amount",
                value: "{tax_amount} {currency_code}",
                name: "tax_amount"
              }]
            }, {
              title: "Additional Info",
              items: [{
                label: "Business Partner ID",
                value: "{bp_id}",
                name: "bp_id"
              }, {
                label: "Created At",
                value: '{= format.dateTime(${created_at}, {"relative":true,"UTC":false})}',
                name: "created_at"
              }, {
                label: "Sales Order ID",
                value: "{so_id}",
                name: "so_id"
              }]
            }]
          }
        }
      };
      const properties = [{
        name: "CndnContrTypeDesc",
        label: "Condition Control Type Description",
        value: "USD",
        labelWithValue: "Condition Control Type Description (USD)"
      }, {
        name: "CndnContrActvtnStatusName",
        label: "Condition Control Activation Status",
        value: "Activated",
        labelWithValue: "Condition Control Activation Status (Activated)"
      }, {
        name: "CndnContrProcessCategoryDesc",
        label: "Condition Control Process Category",
        value: "A",
        labelWithValue: "Condition Control Process Category (A)"
      }, {
        name: "SalesOrganizationName",
        label: "Sales Organization Name",
        value: "Org1",
        labelWithValue: "Sales Organization Name (Org1)"
      }, {
        name: "CndnContrPrtlSettlmtCatName",
        label: "Condition Control Partial Settlement Category Name",
        value: "Cat 1",
        labelWithValue: "Condition Control Partial Settlement Category Name (Cat 1)"
      }];
      const result = parseCard(mManifest, rootComponent.getModel(), [], properties);
      expect(result).toMatchSnapshot();
    });
    test("Validate parseCard generated with no contents for group or mainIndicator", () => {
      const mManifest = {
        _version: "1.15.0",
        "sap.app": {
          id: "objectCard",
          type: "card",
          title: "{{APP_TITLE}}",
          subTitle: "{{APP_SUBTITLE}} | {{UNIT}}",
          description: "Description of an Object Card",
          applicationVersion: {
            version: "1.0.0"
          }
        },
        "sap.card": {
          type: "Object",
          extension: "module:sap/cards/ap/common/extensions/BaseIntegrationCardExtension",
          header: {
            data: {
              path: "/content/"
            },
            mainIndicator: {}
          },
          content: {
            groups: []
          }
        }
      };
      const properties = [{
        name: "CndnContrTypeDesc",
        label: "Condition Control Type Description",
        value: "USD",
        labelWithValue: "Condition Control Type Description (USD)"
      }];
      const result = parseCard(mManifest, rootComponent.getModel(), properties);
      expect(result).toMatchSnapshot();
    });
    test("Validate parseCard generated content when manifest fields have static criticality", () => {
      const mManifest = {
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
            unitOfMeasurement: "{overall_status}",
            mainIndicator: {
              number: "{Language}",
              unit: "",
              trend: "None",
              state: "Good"
            },
            sideIndicators: [{
              title: "",
              number: "",
              unit: ""
            }, {
              title: "",
              number: "",
              unit: ""
            }]
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
                name: "net_amount",
                state: "Error"
              }]
            }]
          }
        }
      };
      const properties = [{
        name: "CndnContrTypeDesc",
        label: "Condition Control Type Description",
        value: "USD",
        labelWithValue: "Condition Control Type Description (USD)"
      }, {
        name: "CndnContrActvtnStatusName",
        label: "Condition Control Activation Status",
        value: "Activated",
        labelWithValue: "Condition Control Activation Status (Activated)"
      }, {
        name: "CndnContrProcessCategoryDesc",
        label: "Condition Control Process Category",
        value: "A",
        labelWithValue: "Condition Control Process Category (A)"
      }, {
        name: "SalesOrganizationName",
        label: "Sales Organization Name",
        value: "Org1",
        labelWithValue: "Sales Organization Name (Org1)"
      }, {
        name: "CndnContrPrtlSettlmtCatName",
        label: "Condition Control Partial Settlement Category Name",
        value: "Cat 1",
        labelWithValue: "Condition Control Partial Settlement Category Name (Cat 1)"
      }];
      const result = parseCard(mManifest, rootComponent.getModel(), [], properties);
      expect(result).toMatchSnapshot();
    });
    test("Validate parseCard generated content when manifest fields have static criticality as None", () => {
      const mManifest = {
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
            unitOfMeasurement: "{overall_status}",
            mainIndicator: {
              number: "{Language}",
              unit: "",
              trend: "None",
              state: "None"
            },
            sideIndicators: [{
              title: "",
              number: "",
              unit: ""
            }, {
              title: "",
              number: "",
              unit: ""
            }]
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
              }]
            }]
          }
        }
      };
      const properties = [{
        name: "CndnContrTypeDesc",
        label: "Condition Control Type Description",
        value: "USD",
        labelWithValue: "Condition Control Type Description (USD)"
      }, {
        name: "CndnContrActvtnStatusName",
        label: "Condition Control Activation Status",
        value: "Activated",
        labelWithValue: "Condition Control Activation Status (Activated)"
      }];
      const result = parseCard(mManifest, rootComponent.getModel(), [], properties);
      expect(result).toMatchSnapshot();
    });
    test("resolvePropertyLabelFromExpression should return the correct label", () => {
      const properties = [{
        type: "Edm.Decimal",
        name: "net_amount",
        label: "Net Amount",
        value: "4700",
        labelWithValue: "Net Amount (USD)"
      }];
      const path = "{{HEADER_TITLE}}";
      const result = resolvePropertyLabelFromExpression(path, rootComponent.getModel(), properties);
      expect(result).toEqual("Header Title");
      const path2 = "{net_amount}";
      const result2 = resolvePropertyLabelFromExpression(path2, rootComponent.getModel(), properties);
      expect(result2).toEqual("Net Amount (USD)");
      const path3 = '{= format.float(${net_amount}, {"decimals":2,"style":"short"})} {currency_code}';
      const result3 = resolvePropertyLabelFromExpression(path3, rootComponent.getModel(), properties);
      expect(result3).toEqual("Net Amount (USD)");
    });
  });
  describe("enhanceManifestWithInsights - Fix integration card manifest on regeneration with sap.insights section", () => {
    beforeAll(() => {
      jest.spyOn(VersionInfo, "load").mockResolvedValue({
        version: "1.88.0",
        buildTimestamp: "202404111500"
      });
    });
    test("validate method enhanceManifestWithInsights - with cardType as DT", () => {
      const mCardManifest = {
        "sap.insights": {
          cardType: "DT",
          parentAppId: "sap.app.id",
          templateName: "ObjectPage",
          versions: {
            ui5: "1.88.0-202404111500"
          }
        }
      };
      enhanceManifestWithInsights(mCardManifest, rootComponent);
      expect(mCardManifest).toMatchSnapshot();
    });
    test("validate method enhanceManifestWithInsights - without cardType", () => {
      const mCardManifest = {};
      enhanceManifestWithInsights(mCardManifest, rootComponent);
      expect(mCardManifest).toMatchSnapshot();
    });
  });
  describe("enhanceManifestWithConfigurationParameters", () => {
    let windowSpy;
    beforeAll(() => {
      windowSpy = jest.spyOn(window, "window", "get");
      windowSpy.mockImplementation(() => ({
        hasher: {
          getHash: () => "test-intent&/C_STTA_SalesOrder_WD_20(node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true)"
        }
      }));
      ApplicationInfo.createInstance(rootComponent);
    });
    afterAll(() => {
      windowSpy.mockRestore();
      ApplicationInfo.getInstance()._resetInstance();
    });
    test("validate generated configuration->parameters", () => {
      const mManifest = {
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
      const oDialogModel = new JSONModel({
        configuration: {
          properties: [{
            name: "net_amount",
            type: "Edm.Int32"
          }],
          advancedFormattingOptions: {
            unitOfMeasures: [],
            textArrangements: [{
              name: "net_amount",
              value: "{overall_status}",
              arrangementType: "TextLast"
            }],
            propertyValueFormatters: []
          },
          trendOptions: {
            sourceProperty: ""
          },
          indicatorsValue: {},
          selectedIndicatorOptions: [],
          $data: {
            node_key: "guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a'",
            IsActiveEntity: true
          }
        }
      });
      enhanceManifestWithConfigurationParameters(mManifest, oDialogModel);
      expect(mManifest).toMatchSnapshot();
    });
    test("validate generated configuration->parameters when text arrangements is empty", () => {
      const mManifest = {
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
      const oDialogModel = new JSONModel({
        configuration: {
          properties: [{
            name: "net_amount",
            type: "Edm.Int32"
          }],
          advancedFormattingOptions: {
            unitOfMeasures: [],
            textArrangements: [{}],
            propertyValueFormatters: []
          },
          trendOptions: {
            sourceProperty: ""
          },
          indicatorsValue: {},
          selectedIndicatorOptions: [],
          $data: {
            node_key: "guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a'",
            IsActiveEntity: true
          }
        }
      });
      enhanceManifestWithConfigurationParameters(mManifest, oDialogModel);
      expect(mManifest).toMatchSnapshot();
    });
    test("validate generated configuration->parameters when text arrangements list has an empty object at the second position", () => {
      const mManifest = {
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
      const oDialogModel = new JSONModel({
        configuration: {
          properties: [{
            name: "net_amount",
            type: "Edm.Int32"
          }],
          advancedFormattingOptions: {
            unitOfMeasures: [],
            textArrangements: [{
              name: "net_amount",
              value: "{overall_status}",
              arrangementType: "TextLast"
            }, {}],
            propertyValueFormatters: []
          },
          trendOptions: {
            sourceProperty: ""
          },
          indicatorsValue: {},
          selectedIndicatorOptions: [],
          $data: {
            node_key: "guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a'",
            IsActiveEntity: true
          }
        }
      });
      enhanceManifestWithConfigurationParameters(mManifest, oDialogModel);
      expect(mManifest).toMatchSnapshot();
    });
  });
  describe("updateCardGroups for group level", () => {
    let manifest, oModel;
    let windowSpy;
    beforeAll(() => {
      oModel = new JSONModel({
        configuration: {
          mainIndicatorOptions: {
            criticality: [{
              name: "net_amount"
            }]
          },
          groups: [{
            title: "Group 1",
            items: [{
              label: "Net Amount",
              value: "{= format.unit(${net_amount}, ${currency_code})}",
              name: "net_amount",
              isEnabled: true,
              isNavigationEnabled: false,
              type: "Status",
              state: "Success",
              hasActions: true,
              actions: []
            }, {
              label: "Gross Amount",
              value: "{= format.unit(${gross_amount}, ${currency_code})}",
              name: "gross_amount",
              isEnabled: true,
              isNavigationEnabled: false,
              type: "Status",
              state: "{= extension.formatters.formatCriticality(${Language}, 'state') }"
            }, {
              label: "Tax Amount",
              value: '{= format.dateTime(${DraftEntityCreationDateTime}, {"relative":false,"UTC":true})}',
              name: "DraftEntityCreationDateTime",
              isEnabled: true,
              isNavigationEnabled: false,
              type: "Status",
              state: "Error"
            }, {
              label: "CardGeneratorGroupPropertyLabel_Groups_0_Items_3",
              value: "{so_id}",
              name: "so_id",
              isEnabled: true,
              isNavigationEnabled: false,
              type: "Status",
              state: "{= extension.formatters.formatCriticality(${op_id_fc}, 'state') }"
            }]
          }, {
            title: "Additional Info",
            items: [{
              label: "Business Partner ID",
              value: "{= format.unit(${net_amount}, ${currency_code})}",
              name: "net_amount",
              isEnabled: true,
              isNavigationEnabled: false,
              type: "Status",
              state: "Success"
            }, {
              label: "Created At",
              value: "{node_key}",
              name: "node_key",
              isEnabled: true,
              isNavigationEnabled: false,
              type: "Status",
              state: "Warning"
            }],
            enableAddMoreGroupItems: true
          }, {
            title: "CardGeneratorGroupHeader_Groups_2",
            items: [{
              label: "CardGeneratorGroupPropertyLabel_Groups_2_Items_0",
              value: '{= format.dateTime(${DraftEntityCreationDateTime}, {"relative":false,"UTC":true})}',
              name: "DraftEntityCreationDateTime",
              isEnabled: true,
              isNavigationEnabled: false,
              type: "Status",
              state: "Error"
            }, {
              label: "CardGeneratorGroupPropertyLabel_Groups_2_Items_1",
              value: "{= format.unit(${net_amount}, ${currency_code})}",
              name: "net_amount",
              isEnabled: true,
              isNavigationEnabled: false,
              type: "Status",
              state: "Success"
            }, {
              label: "CardGeneratorGroupPropertyLabel_Groups_2_Items_2",
              value: '{= format.dateTime(${changed_at}, {"relative":false,"UTC":true})}',
              name: "changed_at",
              isEnabled: true,
              isNavigationEnabled: false,
              type: "Status",
              state: "None"
            }, {
              label: "Tax Amount",
              value: "{= format.unit(${tax_amount}, ${currency_code})}",
              isEnabled: true,
              isNavigationEnabled: false,
              navigationalProperties: [],
              name: "tax_amount"
            }],
            enableAddMoreGroupItems: true
          }]
        }
      });
      windowSpy = jest.spyOn(window, "window", "get");
      windowSpy.mockImplementation(() => ({
        hasher: {
          getHash: () => "test-intent&/testEntity(12345)"
        }
      }));
      ApplicationInfo.createInstance(rootComponent);
      manifest = createInitialManifest({
        entitySet: "C_STTA_SalesOrder_WD_20(node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true)",
        service: "/sap/opu/odata/sap/salesorder",
        title: "Sales Order",
        subTitle: "A Fiori application.",
        serviceModel: {
          isA: jest.fn().mockReturnValue(false),
          getMetaModel: () => {
            return {
              getODataAssociationEnd: () => {},
              getODataEntitySet: () => {
                return {
                  entityType: "C_STTA_SalesOrder_WD_20Type"
                };
              },
              getODataEntityType: () => {
                return {
                  key: {
                    propertyRef: [{
                      name: "node_key"
                    }, {
                      name: "so_id"
                    }]
                  },
                  property: [{
                    name: "node_key",
                    type: "Edm.Guid",
                    nullable: "false",
                    "sap:label": "Node Key",
                    kind: "Property"
                  }, {
                    name: "so_id",
                    type: "Edm.String",
                    maxLength: "10",
                    "sap:label": "Sales Order ID",
                    kind: "Property"
                  }]
                };
              }
            };
          }
        },
        sapAppId: "test.app.id",
        sapCoreVersionInfo: {
          version: "1.0.0",
          buildTimestamp: "2021-09-01T00:00:00Z"
        },
        entitySetName: "C_STTA_SalesOrder_WD_20",
        data: {
          node_key: "guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a'",
          IsActiveEntity: true
        }
      });
    });
    afterAll(() => {
      windowSpy.mockRestore();
      ApplicationInfo.getInstance()._resetInstance();
    });
    it("should update manifest groups based on model data", () => {
      const adavancedFormattingOptions = [{
        criticality: "{Language}",
        name: "net_amount",
        activeCalculation: false
      }, {
        criticality: "Error",
        name: "DraftEntityCreationDateTime",
        activeCalculation: false
      }, {
        criticality: "{op_id_fc}",
        name: "so_id",
        activeCalculation: false
      }, {
        criticality: "Critical",
        name: "node_key",
        activeCalculation: true
      }, {
        criticality: "Neutral",
        name: "changed_at",
        activeCalculation: false
      }];
      oModel.setProperty("/configuration/mainIndicatorOptions/criticality", adavancedFormattingOptions);
      updateCardGroups(oModel);
      expect(manifest["sap.card"].content.groups).toMatchSnapshot();
    });
    it("should handle the scenario when there is no item added to the group", () => {
      oModel.setProperty("/configuration/groups", [{
        title: "Group 1",
        items: []
      }]);
      updateCardGroups(oModel);
      expect(manifest["sap.card"].content.groups).toMatchSnapshot();
    });
    it("should filter out valid items which needs to be added to the card manifest", () => {
      oModel.setProperty("/configuration/groups", [{
        title: "Group 1",
        items: [{
          label: null,
          value: "{/item/1}"
        }, {
          name: "Item 2",
          label: "Label 2",
          value: "Value 2"
        }]
      }]);
      updateCardGroups(oModel);
      expect(manifest["sap.card"].content.groups).toMatchSnapshot();
    });
    it("should handle groups with no items property", () => {
      oModel.setProperty("/configuration/groups", [{
        title: "Group 1"
      }]);
      updateCardGroups(oModel);
      expect(manifest["sap.card"].content.groups).toMatchSnapshot();
    });
  });
  describe("addQueryParametersToManifest", () => {
    it("should add query parameters when an already saved manifest w/o query parameters is reopened", () => {
      const manifest = {
        "sap.card": {
          configuration: {
            parameters: {}
          },
          data: {
            request: {
              batch: {
                header: {
                  url: "C_STTA_SalesOrder_WD_20({{parameters.contextParameters}})"
                },
                content: {
                  url: "C_STTA_SalesOrder_WD_20({{parameters.contextParameters}})"
                }
              }
            }
          }
        }
      };
      const result = addQueryParametersToManifest(manifest);
      const expectedResultHeader = "C_STTA_SalesOrder_WD_20({{parameters.contextParameters}})?{{parameters._headerSelectQuery}}{{parameters._headerExpandQuery}}";
      const expectedResultContent = "C_STTA_SalesOrder_WD_20({{parameters.contextParameters}})?{{parameters._contentSelectQuery}}{{parameters._contentExpandQuery}}";
      expect(result?.["sap.card"]?.data?.request?.batch?.header.url).toEqual(expectedResultHeader);
      expect(result?.["sap.card"]?.data?.request?.batch?.content.url).toEqual(expectedResultContent);
      expect(result?.["sap.card"].configuration?.parameters).toMatchSnapshot();
    });
    it("should not modify the original manifest and the query parameters should not update", () => {
      const manifest = {
        "sap.card": {
          configuration: {
            parameters: {}
          },
          data: {
            request: {
              batch: {
                header: {
                  url: "C_STTA_SalesOrder_WD1_20({{parameters.contextParameters}})?{{parameters._headerSelectQuery}}{{parameters._headerExpandQuery}}"
                },
                content: {
                  url: "C_STTA_SalesOrder_WD1_20({{parameters.contextParameters}})?{{parameters._contentSelectQuery}}{{parameters._contentExpandQuery}}"
                }
              }
            }
          }
        }
      };
      const originalManifest = JSON.parse(JSON.stringify(manifest));
      expect(manifest).toEqual(originalManifest);
      const updatedManifest = addQueryParametersToManifest(manifest);
      const expectedResultHeader = "C_STTA_SalesOrder_WD1_20({{parameters.contextParameters}})?{{parameters._headerSelectQuery}}{{parameters._headerExpandQuery}}";
      const expectedResultContent = "C_STTA_SalesOrder_WD1_20({{parameters.contextParameters}})?{{parameters._contentSelectQuery}}{{parameters._contentExpandQuery}}";
      expect(updatedManifest?.["sap.card"]?.data?.request?.batch?.header.url).toEqual(expectedResultHeader);
      expect(updatedManifest?.["sap.card"]?.data?.request?.batch?.content.url).toEqual(expectedResultContent);
      expect(updatedManifest?.["sap.card"].configuration?.parameters).toMatchSnapshot();
    });
    it("should add expand query when only select query exists", () => {
      const manifest = {
        "sap.card": {
          configuration: {
            parameters: {}
          },
          data: {
            request: {
              batch: {
                header: {
                  url: "C_STTA_SalesOrder_WD1_20({{parameters.contextParameters}})?{{parameters._headerSelectQuery}}"
                },
                content: {
                  url: "C_STTA_SalesOrder_WD1_20({{parameters.contextParameters}})?{{parameters._contentSelectQuery}}"
                }
              }
            }
          }
        }
      };
      const originalManifest = JSON.parse(JSON.stringify(manifest));
      expect(manifest).toEqual(originalManifest);
      const updatedManifest = addQueryParametersToManifest(manifest);
      const expectedResultHeader = "C_STTA_SalesOrder_WD1_20({{parameters.contextParameters}})?{{parameters._headerSelectQuery}}{{parameters._headerExpandQuery}}";
      const expectedResultContent = "C_STTA_SalesOrder_WD1_20({{parameters.contextParameters}})?{{parameters._contentSelectQuery}}{{parameters._contentExpandQuery}}";
      expect(updatedManifest?.["sap.card"]?.data?.request?.batch?.header.url).toEqual(expectedResultHeader);
      expect(updatedManifest?.["sap.card"]?.data?.request?.batch?.content.url).toEqual(expectedResultContent);
      expect(updatedManifest?.["sap.card"].configuration?.parameters).toMatchSnapshot();
    });
  });
  describe("updateExistingCardManifest", () => {
    let windowSpy;
    beforeAll(() => {
      windowSpy = jest.spyOn(window, "window", "get");
      windowSpy.mockImplementation(() => ({
        hasher: {
          getHash: () => "test-intent&/C_STTA_SalesOrder_WD_20(node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true)"
        }
      }));
      ApplicationInfo.createInstance(rootComponent);
    });
    afterAll(() => {
      windowSpy.mockRestore();
      ApplicationInfo.getInstance()._resetInstance();
    });
    test("it should have app component id as sap.app.id, i18n properties path and mandatory OData properties and their types in configuration paramereters", () => {
      const mManifest = {
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
      const updatedManifest = updateExistingCardManifest(mManifest, {
        node_key: "guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a'",
        IsActiveEntity: true
      });
      expect(updatedManifest).toMatchSnapshot();
    });
  });
});
//# sourceMappingURL=IntegrationCardHelper.spec.js.map