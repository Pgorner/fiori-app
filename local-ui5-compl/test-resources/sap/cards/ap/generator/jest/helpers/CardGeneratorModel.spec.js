/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/cards/ap/generator/helpers/ApplicationInfo", "sap/cards/ap/generator/helpers/CardGeneratorModel", "sap/ui/core/Component", "sap/ui/core/date/Gregorian"], function (sap_cards_ap_generator_helpers_ApplicationInfo, sap_cards_ap_generator_helpers_CardGeneratorModel, UIComponent, sap_ui_core_date_Gregorian) {
  "use strict";

  const ApplicationInfo = sap_cards_ap_generator_helpers_ApplicationInfo["ApplicationInfo"];
  const _mergePropertyFormatters = sap_cards_ap_generator_helpers_CardGeneratorModel["_mergePropertyFormatters"];
  const addLabelsForProperties = sap_cards_ap_generator_helpers_CardGeneratorModel["addLabelsForProperties"];
  const getCardActionInfo = sap_cards_ap_generator_helpers_CardGeneratorModel["getCardActionInfo"];
  const getCardGeneratorDialogModel = sap_cards_ap_generator_helpers_CardGeneratorModel["getCardGeneratorDialogModel"];
  const updateUnitOfMeasures = sap_cards_ap_generator_helpers_CardGeneratorModel["updateUnitOfMeasures"];
  jest.mock(sap.jest.resolvePath("sap/cards/ap/common/adaptiveCards/AdaptiveCardRenderer"), () => {
    return {
      getAdaptiveCardForRendering: jest.fn().mockReturnValue({})
    };
  });
  jest.mock(sap.jest.resolvePath("sap/cards/ap/generator/helpers/IntegrationCardHelper"), () => {
    return {
      parseCard: jest.fn().mockReturnValue({
        title: "Manage Sales Orders - Version 2",
        subtitle: "Manage Sales Orders - Version 2",
        headerUOM: "",
        mainIndicatorOptions: {
          mainIndicatorStatusKey: "SalesOrder",
          mainIndicatorNavigationSelectedKey: "",
          criticalityOptions: [],
          navigationValue: "SalesOrder",
          trendOptions: {
            referenceValue: "33",
            downDifference: "11",
            upDifference: "22"
          }
        },
        sideIndicatorOptions: {
          targetValue: "11",
          targetUnit: "%",
          deviationValue: "22",
          deviationUnit: "%"
        },
        groups: [{
          title: "Group 1",
          items: [{
            label: "Company",
            value: "{_BillingCompanyCode/Company}",
            name: "_BillingCompanyCode",
            isEnabled: true,
            isNavigationEnabled: false
          }, {
            label: "Net Amount",
            value: "{= format.dateTime(${to_BusinessPartner/CreatedAt}, {\"relative\":false,\"UTC\":true})}",
            name: "to_BusinessPartner",
            isEnabled: true,
            isNavigationEnabled: false
          }, {
            label: "Division",
            value: "{OrganizationDivision}",
            name: "OrganizationDivision",
            isEnabled: true,
            isNavigationEnabled: false
          }]
        }],
        formatterConfigurationFromCardManifest: [{
          formatterName: "format.unit",
          displayName: "",
          parameters: [{
            name: "type",
            displayName: "",
            type: "string",
            defaultValue: "",
            value: "${bp_id}"
          }, {
            name: "options",
            displayName: "Options",
            type: "object",
            defaultValue: "",
            properties: [{
              name: "decimals",
              displayName: "Decimals",
              type: "number",
              defaultValue: 2
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
              }]
            }]
          }],
          type: "numeric",
          visible: false,
          property: "gross_amount"
        }, {
          formatterName: "format.unit",
          displayName: "",
          parameters: [{
            name: "type",
            displayName: "",
            type: "string",
            defaultValue: "",
            value: "${bp_id}"
          }, {
            name: "options",
            displayName: "Options",
            type: "object",
            defaultValue: "",
            properties: [{
              name: "decimals",
              displayName: "Decimals",
              type: "number",
              defaultValue: 2
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
              }]
            }]
          }],
          type: "numeric",
          visible: false,
          property: "sp_id"
        }],
        textArrangementsFromCardManifest: [{
          name: "SalesOrder",
          arrangementType: "TextFirst",
          value: "_BillingCompanyCode/Country",
          propertyKeyForDescription: "_BillingCompanyCode",
          propertyKeyForId: "SalesOrder",
          textArrangement: "TextFirst",
          isNavigationForDescription: true,
          navKey: "Country",
          navigationalProperties: []
        }, {
          name: "tax_amount",
          arrangementType: "TextLast",
          value: "Language",
          propertyKeyForDescription: "Language",
          propertyKeyForId: "tax_amount",
          textArrangement: "TextLast",
          isNavigationForId: false,
          isNavigationForDescription: false,
          navigationKeyForId: "",
          navigationKeyForDescription: "",
          navigationalPropertiesForDescription: [],
          navigationalPropertiesForId: []
        }, {
          name: "to_BusinessPartner/CompanyName",
          arrangementType: "TextLast",
          value: "to_BusinessPartner/LegalForm",
          propertyKeyForDescription: "to_BusinessPartner",
          propertyKeyForId: "to_BusinessPartner",
          textArrangement: "TextLast",
          isNavigationForId: true,
          isNavigationForDescription: true,
          navigationKeyForId: "CompanyName",
          navigationKeyForDescription: "LegalForm",
          navigationalPropertiesForDescription: [],
          navigationalPropertiesForId: []
        }, {
          name: "to_Currency/Currency_Code_Text",
          arrangementType: "TextFirst",
          value: "to_BusinessPartner/PhoneNumber",
          propertyKeyForDescription: "to_BusinessPartner",
          propertyKeyForId: "to_Currency",
          textArrangement: "TextFirst",
          isNavigationForId: true,
          isNavigationForDescription: true,
          navigationKeyForId: "Currency_Code_Text",
          navigationKeyForDescription: "PhoneNumber",
          navigationalPropertiesForDescription: [],
          navigationalPropertiesForId: []
        }, {
          name: "net_amount",
          arrangementType: "TextFirst",
          value: "to_LifecycleStatus/Status",
          propertyKeyForDescription: "to_LifecycleStatus",
          propertyKeyForId: "net_amount",
          textArrangement: "TextFirst",
          isNavigationForId: false,
          isNavigationForDescription: true,
          navigationKeyForId: "",
          navigationKeyForDescription: "Status",
          navigationalPropertiesForDescription: [],
          navigationalPropertiesForId: []
        }, {
          name: "to_LifecycleStatus/Status_Text",
          arrangementType: "TextFirst",
          value: "to_LifecycleStatus/Status",
          propertyKeyForDescription: "to_LifecycleStatus",
          propertyKeyForId: "to_LifecycleStatus",
          textArrangement: "TextFirst",
          isNavigationForId: true,
          isNavigationForDescription: true,
          navigationKeyForId: "Status_Text",
          navigationKeyForDescription: "Status",
          navigationalPropertiesForDescription: [],
          navigationalPropertiesForId: []
        }]
      })
    };
  });
  jest.mock(sap.jest.resolvePath("sap/cards/ap/generator/odata/ODataUtils"), () => {
    return {
      fetchDataAsync: jest.fn().mockResolvedValue({
        node_key: "12345",
        IsActiveEntity: true,
        SalesOrder: "12345",
        tax_amount: "298.30",
        Language: "1",
        net_amount: "1570.00",
        _BillingCompanyCode: {
          Status: "O",
          Status_Text: "Open"
        },
        to_BusinessPartner: {
          PhoneNumber: "0622734567",
          FaxNumber: "0622734004",
          LegalForm: "SE",
          CurrencyCode: "EUR",
          CompanyName: "SAP",
          __metadata: {}
        },
        to_Currency: {
          Currency_Code: "USD",
          Currency_Code_Text: "United States Dollar",
          Decimals: 2,
          __metadata: {}
        },
        to_LifecycleStatus: {
          Status: "N",
          Status_Text: "New",
          __metadata: {}
        }
      }),
      getLabelForEntitySet: jest.fn().mockReturnValue("Entity Set Name"),
      getPropertyInfoFromEntity: jest.fn().mockReturnValue([{
        UOM: "",
        isDate: false,
        label: "node_key",
        name: "node_key",
        type: "Edm.Guid"
      }, {
        UOM: "",
        isDate: false,
        label: "IsActiveEntity",
        name: "IsActiveEntity",
        type: "Edm.Boolean"
      }, {
        label: "Tax Amount",
        type: "Edm.Decimal",
        name: "tax_amount",
        UOM: "currency_code",
        isDate: false,
        kind: "Property"
      }, {
        label: "Language",
        type: "Edm.String",
        name: "Language",
        UOM: "",
        isDate: false,
        kind: "Property"
      }, {
        label: "Net Amount",
        type: "Edm.Decimal",
        name: "net_amount",
        UOM: "currency_code",
        isDate: false,
        kind: "Property"
      }]),
      getNavigationPropertyInfoFromEntity: jest.fn().mockReturnValue([{
        name: "_BillingCompanyCode",
        properties: [{
          label: "Lower Value",
          labelWithValue: "Lower Value (O)",
          name: "Status",
          type: "Edm.String"
        }, {
          label: "Confirmation",
          labelWithValue: "Confirmation (Open)",
          name: "Status_Text",
          type: "Edm.String"
        }]
      }, {
        name: "to_Currency",
        properties: [{
          label: "Currency Code",
          type: "Edm.String",
          name: "Currency_Code"
        }, {
          label: "Currency Code Text",
          type: "Edm.String",
          name: "Currency_Code_Text"
        }]
      }, {
        name: "to_BillingStatus",
        properties: [{
          label: "Lower Value",
          type: "Edm.String",
          name: "Status"
        }, {
          label: "Confirmation",
          type: "Edm.String",
          name: "Status_Text"
        }]
      }, {
        name: "to_BusinessPartner",
        properties: [{
          label: "Business Partner ID",
          type: "Edm.String",
          name: "BusinessPartnerID"
        }, {
          label: "Bus. Part. Role",
          type: "Edm.String",
          name: "BusinessPartnerRole"
        }, {
          label: "Email",
          type: "Edm.String",
          name: "MailAddress"
        }, {
          label: "Phone",
          type: "Edm.String",
          name: "PhoneNumber"
        }, {
          label: "Fax",
          type: "Edm.String",
          name: "FaxNumber"
        }, {
          label: "Legal Form",
          type: "Edm.String",
          name: "LegalForm"
        }, {
          label: "Currency Code",
          type: "Edm.String",
          name: "CurrencyCode"
        }, {
          label: "Company",
          type: "Edm.String",
          name: "CompanyName"
        }, {
          label: "Created At",
          type: "Edm.DateTimeOffset",
          name: "CreatedAt"
        }, {
          label: "Created By",
          type: "Edm.String",
          name: "CreatedBy"
        }, {
          label: "Changed At",
          type: "Edm.DateTimeOffset",
          name: "ChangedAt"
        }, {
          label: "Changed By",
          type: "Edm.String",
          name: "ChangedBy"
        }]
      }, {
        name: "to_LifecycleStatus",
        properties: [{
          label: "Lower Value",
          type: "Edm.String",
          name: "Status"
        }, {
          label: "Lifecycle Status",
          type: "Edm.String",
          name: "Status_Text"
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
      }]),
      createPathWithEntityContext: jest.fn().mockResolvedValue("testEntity('12345')"),
      isPropertyTypeDate: jest.fn(path => {
        return ["Edm.Date", "Edm.DateTime", "Edm.DateTimeOffset", "Edm.TimeOfDay"].indexOf(path) > -1;
      })
    };
  });
  jest.mock(sap.jest.resolvePath("sap/cards/ap/generator/odata/v2/MetadataAnalyzer"), () => {
    return {
      getPropertyReference: jest.fn().mockReturnValue([{
        label: "node_key",
        type: "Edm.Guid",
        name: "node_key",
        UOM: "",
        isDate: false
      }, {
        label: "IsActiveEntity",
        type: "Edm.Boolean",
        name: "IsActiveEntity",
        UOM: "",
        isDate: false
      }, {
        label: "Bank Country",
        type: "Edm.String",
        name: "BankCountry",
        UOM: "",
        isDate: false
      }])
    };
  });
  jest.mock(sap.jest.resolvePath("sap/cards/ap/generator/odata/v4/MetadataAnalyzer"), () => ({
    getPropertyReferenceKey: jest.fn()
  }));
  describe("Card generation model creation", () => {
    test("addLabelsForProperties", function () {
      try {
        const mockProperties = [{
          label: "My Entity",
          type: "Edm.Guid",
          name: "ID",
          UOM: "",
          isDate: false
        }, {
          label: "My RootElement",
          type: "Edm.String",
          name: "EntityLabel",
          UOM: "",
          isDate: false
        }, {
          label: "A text",
          type: "Edm.String",
          name: "targetText",
          UOM: "",
          isDate: false
        }, {
          label: "Only Text",
          type: "Edm.String",
          name: "textOnly",
          UOM: "",
          isDate: false
        }, {
          label: "Text First",
          type: "Edm.String",
          name: "textFirst",
          UOM: "",
          isDate: false
        }, {
          label: "textLast",
          type: "Edm.String",
          name: "textLast",
          UOM: "",
          isDate: false
        }, {
          label: "textSeparate",
          type: "Edm.String",
          name: "textSeparate",
          UOM: "",
          isDate: false
        }, {
          label: "Date",
          type: "Edm.Date",
          name: "date",
          UOM: "",
          isDate: false
        }, {
          label: "Date And Time",
          type: "Edm.DateTimeOffset",
          name: "dateTime",
          UOM: "",
          isDate: false
        }, {
          label: "imageUrl",
          type: "Edm.String",
          name: "imageUrl",
          UOM: "",
          isDate: false
        }, {
          label: "Price",
          type: "Edm.Int64",
          name: "amountWithCurrency",
          UOM: "",
          isDate: false
        }, {
          label: "Amount",
          type: "Edm.Int64",
          name: "amountWithUnit",
          UOM: "",
          isDate: false
        }, {
          label: "currency",
          type: "Edm.String",
          name: "currency",
          UOM: "",
          isDate: false
        }, {
          label: "unit",
          type: "Edm.String",
          name: "unit",
          UOM: "",
          isDate: false
        }, {
          label: "referencedTestEntities_ID",
          type: "Edm.Guid",
          name: "referencedTestEntities_ID",
          UOM: "",
          isDate: false
        }, {
          label: "statusCriticality",
          type: "Edm.Int32",
          name: "statusCriticality",
          UOM: "",
          isDate: false
        }, {
          label: "Status",
          type: "Edm.String",
          name: "justCritical",
          UOM: "",
          isDate: false
        }, {
          label: "onlyIcon",
          type: "Edm.String",
          name: "onlyIcon",
          UOM: "",
          isDate: false
        }, {
          label: "withIcon",
          type: "Edm.String",
          name: "withIcon",
          UOM: "",
          isDate: false
        }, {
          label: "withoutIcon",
          type: "Edm.String",
          name: "withoutIcon",
          UOM: "",
          isDate: false
        }, {
          label: "Terms of Payment",
          type: "Edm.String",
          name: "RootPaymentTerms",
          UOM: "",
          isDate: false
        }, {
          label: "Net Value (With Semantic Object)",
          type: "Edm.String",
          name: "NetAmountSemanticObject",
          UOM: "",
          isDate: false
        }, {
          label: "IsActiveEntity",
          type: "Edm.Boolean",
          name: "IsActiveEntity",
          UOM: "",
          isDate: false
        }, {
          label: "HasActiveEntity",
          type: "Edm.Boolean",
          name: "HasActiveEntity",
          UOM: "",
          isDate: false
        }, {
          label: "HasDraftEntity",
          type: "Edm.Boolean",
          name: "HasDraftEntity",
          UOM: "",
          isDate: false
        }];
        const mockData = {
          "@odata.context": "$metadata#RootElement(ID=c8a34397-297e-44bb-a6b5-fffb41f78453,IsActiveEntity=true)",
          "@odata.metadataEtag": 'W/"5160-fx59Nb2TI0eFbp2yL/rZS6IpSY4"',
          ID: "c8a34397-297e-44bb-a6b5-fffb41f78453",
          EntityLabel: "Root 1",
          targetText: "Sample Text 1",
          textOnly: "Sample Text 1",
          textFirst: "Sample Text 1",
          textLast: "Sample Text 1",
          textSeparate: "Sample Text 1",
          imageUrl: "https://example.com/image1.jpg",
          amountWithCurrency: 100,
          amountWithUnit: 50,
          currency: "USD",
          unit: "kg",
          statusCriticality: 3,
          justCritical: "Critical",
          onlyIcon: "Icon1",
          withIcon: "Icon2",
          withoutIcon: "No Icon",
          RootPaymentTerms: "0001",
          NetAmountSemanticObject: "11.00 EUR",
          date: "2023-05-30",
          dateTime: null,
          IsActiveEntity: true,
          HasActiveEntity: true,
          HasDraftEntity: false,
          referencedTestEntities_ID: "",
          SAP__Messages: ""
        };
        const mockmData = {};
        const mockUnitOfMeasures = [];
        addLabelsForProperties(mockProperties, mockData, mockmData, mockUnitOfMeasures);
        expect(mockProperties).toMatchSnapshot();
        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    });
    test("getCardActionInfo: Test the Generation of the Card Action information for CardGenerator Model when there exists actions for entityType", function () {
      try {
        const component = {
          getModel: function () {
            return {
              isA: function () {
                return false;
              },
              getMetaModel: function () {
                return {
                  getODataEntitySet: function () {
                    return {
                      entityType: "SD_SALESPLAN.C_SalesPlanTPType"
                    };
                  },
                  getODataEntityType: function () {
                    return {
                      key: {
                        propertyRef: [{
                          name: "SalesPlanUUID"
                        }, {
                          name: "IsActiveEntity"
                        }]
                      },
                      "com.sap.vocabularies.UI.v1.Identification": [{
                        Label: {
                          String: "Copy to New Version"
                        },
                        Action: {
                          String: "SD_SALESPLAN.SD_SALESPLAN_Entities/C_SalesPlanTPCopy"
                        },
                        InvocationGrouping: {
                          EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"
                        },
                        RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
                        Criticality: {
                          EnumMember: {
                            Path: "CriticalityPath"
                          }
                        }
                      }, {
                        Label: {
                          String: "Release"
                        },
                        Action: {
                          String: "SD_SALESPLAN.SD_SALESPLAN_Entities/C_SalesPlanTPRelease"
                        },
                        InvocationGrouping: {
                          EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"
                        },
                        RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction"
                      }, {
                        Label: {
                          String: "Reopen"
                        },
                        Action: {
                          String: "SD_SALESPLAN.SD_SALESPLAN_Entities/C_SalesPlanTPReopen"
                        },
                        InvocationGrouping: {
                          EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"
                        },
                        RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction"
                      }, {
                        Label: {
                          String: "Reopen with Hidden Path"
                        },
                        Action: {
                          String: "SD_SALESPLAN.SD_SALESPLAN_Entities/C_SalesPlanTPReopen"
                        },
                        InvocationGrouping: {
                          EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"
                        },
                        RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
                        "com.sap.vocabularies.UI.v1.Hidden": {}
                      }, {
                        Label: {
                          String: "Reopen with Hidden Path Bool true"
                        },
                        Action: {
                          String: "SD_SALESPLAN.SD_SALESPLAN_Entities/C_SalesPlanTPReopen"
                        },
                        InvocationGrouping: {
                          EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"
                        },
                        RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
                        "com.sap.vocabularies.UI.v1.Hidden": {
                          Bool: "true"
                        }
                      }, {
                        Label: {
                          String: "Reopen with Determining annotation value Bool true"
                        },
                        Action: {
                          String: "SD_SALESPLAN.SD_SALESPLAN_Entities/C_SalesPlanTPReopen"
                        },
                        InvocationGrouping: {
                          EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"
                        },
                        RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
                        Determining: {
                          Bool: "true"
                        }
                      }, {
                        Label: {
                          String: "Reopen with IsCopyAction annotation value Bool true"
                        },
                        Action: {
                          String: "SD_SALESPLAN.SD_SALESPLAN_Entities/C_SalesPlanTPReopen"
                        },
                        InvocationGrouping: {
                          EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"
                        },
                        RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
                        "com.sap.vocabularies.UI.v1.IsCopyAction": {
                          Bool: "true"
                        },
                        Criticality: {
                          Path: "CriticalityPath"
                        }
                      }]
                    };
                  },
                  getODataFunctionImport: jest.fn().mockReturnValue({
                    name: "C_SalesPlanTPCopy",
                    returnType: "SD_SALESPLAN.C_SalesPlanTPType",
                    entitySet: "C_SalesPlanTP",
                    httpMethod: "POST",
                    parameter: [{
                      name: "SalesPlanUUID",
                      type: "Edm.Guid",
                      mode: "In",
                      extensions: [{
                        name: "label",
                        value: "Sales Plan UUID",
                        namespace: "http://www.sap.com/Protocols/SAPData"
                      }],
                      "sap:label": "Sales Plan UUID",
                      "com.sap.vocabularies.Common.v1.Label": {
                        String: "Sales Plan UUID"
                      }
                    }, {
                      name: "IsActiveEntity",
                      type: "Edm.Boolean",
                      mode: "In",
                      extensions: [{
                        name: "label",
                        value: "Is active",
                        namespace: "http://www.sap.com/Protocols/SAPData"
                      }],
                      "sap:label": "Is active",
                      "com.sap.vocabularies.Common.v1.Label": {
                        String: "Is active"
                      }
                    }],
                    extensions: [{
                      name: "action-for",
                      value: "SD_SALESPLAN.C_SalesPlanTPType",
                      namespace: "http://www.sap.com/Protocols/SAPData"
                    }, {
                      name: "applicable-path",
                      value: "Copy_ac",
                      namespace: "http://www.sap.com/Protocols/SAPData"
                    }],
                    "sap:action-for": "SD_SALESPLAN.C_SalesPlanTPType",
                    "sap:applicable-path": "Copy_ac"
                  })
                };
              }
            };
          },
          getManifest: function () {
            return {
              "sap.app": {
                id: "testId"
              }
            };
          }
        };
        let windowSpy1;
        windowSpy1 = jest.spyOn(window, "window", "get");
        windowSpy1.mockImplementation(() => ({
          hasher: {
            getHash: () => "test-intent&/C_SalesPlanTPCopy(12345)"
          }
        }));
        ApplicationInfo.createInstance(component);
        return Promise.resolve(getCardActionInfo(component, [], {})).then(function (cardActionsInfo) {
          expect(cardActionsInfo).toMatchSnapshot();
          ApplicationInfo.getInstance()._resetInstance();
          windowSpy1.mockRestore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    test("getCardActionInfo: Test the Generation of the Card Action information for CardGenerator Model when there does not exist actions for entityType", function () {
      try {
        const component = {
          getModel: function () {
            return {
              isA: function () {
                return false;
              },
              getMetaModel: function () {
                return {
                  getODataEntitySet: function () {
                    return {
                      entityType: "SD_SALESPLAN.C_SalesPlanTPType"
                    };
                  },
                  getODataEntityType: function () {
                    return {
                      key: {
                        propertyRef: [{
                          name: "SalesPlanUUID"
                        }, {
                          name: "IsActiveEntity"
                        }]
                      }
                    };
                  }
                };
              }
            };
          },
          getManifest: function () {
            return {
              "sap.app": {
                id: "testId"
              }
            };
          }
        };
        let windowSpy1;
        windowSpy1 = jest.spyOn(window, "window", "get");
        windowSpy1.mockImplementation(() => ({
          hasher: {
            getHash: () => "test-intent&/C_SalesPlanTP(12345)"
          }
        }));
        ApplicationInfo.createInstance(component);
        return Promise.resolve(getCardActionInfo(component, [], {})).then(function (cardActionsInfo) {
          expect(cardActionsInfo).toMatchSnapshot();
          ApplicationInfo.getInstance()._resetInstance();
          windowSpy1.mockRestore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });
  test("validate method _mergePropertyFormatters", () => {
    const arr1 = [{
      property: "created_at",
      formatterName: "format.dateTime",
      displayName: "Date Time (format.dateTime)",
      parameters: [{
        name: "options",
        displayName: "Options",
        type: "object",
        defaultValue: "",
        properties: [{
          name: "relative",
          displayName: "Relative",
          type: "boolean",
          defaultValue: false
        }, {
          name: "UTC",
          displayName: "UTC",
          type: "boolean",
          defaultValue: false,
          selected: true
        }]
      }],
      type: "Date",
      visible: true
    }, {
      property: "DraftEntityLastChangeDateTime",
      formatterName: "format.dateTime",
      displayName: "Date Time (format.dateTime)",
      parameters: [{
        name: "options",
        displayName: "Options",
        type: "object",
        defaultValue: "",
        properties: [{
          name: "relative",
          displayName: "Relative",
          type: "boolean",
          defaultValue: false
        }, {
          name: "UTC",
          displayName: "UTC",
          type: "boolean",
          defaultValue: false,
          selected: true
        }]
      }],
      type: "Date",
      visible: true
    }];
    const arr2 = [{
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
          }],
          value: "short"
        }]
      }],
      type: "numeric",
      visible: true,
      property: "net_amount"
    }, {
      formatterName: "extension.formatters.formatCriticality",
      displayName: "Format Criticality State or Value",
      parameters: [{
        name: "sType",
        displayName: "Criticality States",
        type: "string",
        defaultValue: ""
      }],
      type: "string | numeric",
      visible: false,
      property: "Language"
    }, {
      formatterName: "format.dateTime",
      displayName: "Date Time (format.dateTime)",
      parameters: [{
        name: "options",
        displayName: "Options",
        type: "object",
        defaultValue: "",
        properties: [{
          name: "relative",
          displayName: "Relative",
          type: "boolean",
          defaultValue: false,
          selected: {
            relative: false,
            UTC: true
          }
        }, {
          name: "UTC",
          displayName: "UTC",
          type: "boolean",
          defaultValue: false,
          selected: {
            relative: false,
            UTC: true
          }
        }]
      }],
      type: "Date",
      visible: true,
      property: "created_at"
    }];
    expect(_mergePropertyFormatters(arr1, arr2)).toMatchSnapshot();
  });
  describe("getCardGeneratorDialogModel", () => {
    let windowSpy;
    const sId = "testComponent";
    const oManifest = {
      "sap.app": {
        id: sId,
        type: "application",
        applicationVersion: {
          version: "1.0.0"
        },
        title: "Test Application",
        description: "Test Application Description"
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
    jest.spyOn(rootComponent, "getModel").mockImplementation(() => {
      return {
        sServiceUrl: "/sap/opu/odata",
        isA: () => false,
        getMetaModel: function () {
          return {
            getODataEntitySet: function () {
              return {
                entityType: "SD_SALESPLAN.C_SalesPlanTPType"
              };
            },
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
                  label: "Node Key"
                }, {
                  name: "IsActiveEntity",
                  type: "Edm.Boolean",
                  label: "Is Active Entity"
                }]
              };
            }
          };
        },
        getContext: () => {
          return {
            getObject: () => {
              return {
                node_key: "'12345'",
                IsActiveEntity: true,
                SalesOrder: null,
                _BillingCompanyCode: null
              };
            }
          };
        },
        getResourceBundle: jest.fn().mockReturnValue({}),
        getObject: jest.fn().mockReturnValue({
          node_key: "'12345'",
          IsActiveEntity: true,
          SalesOrder: null,
          _BillingCompanyCode: null
        })
      };
    });
    beforeAll(() => {
      windowSpy = jest.spyOn(window, "window", "get");
      windowSpy.mockImplementation(() => ({
        hasher: {
          getHash: () => "test-intent&/testEntity(node_key='12345',IsActiveEntity=true)"
        }
      }));
      ApplicationInfo.createInstance(rootComponent);
    });
    afterAll(() => {
      windowSpy.mockRestore();
      ApplicationInfo.getInstance()._resetInstance();
    });
    test("validate method getCardGeneratorDialogModel, card generation process is started from scratch", function () {
      try {
        return Promise.resolve(getCardGeneratorDialogModel(rootComponent)).then(function (expectedResult) {
          expect(expectedResult.getData()).toMatchSnapshot();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    test("validate method getCardGeneratorDialogModel, card generation process is started from existing card", function () {
      try {
        const cardManifest = {
          _version: "1.15.0",
          "sap.app": {
            id: "objectCard",
            type: "card",
            title: "{{CardGeneratorHeaderTitle}}",
            subTitle: "{{CardGeneratorHeaderSubTitle}}",
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
                _contentSelectQuery: {
                  value: "$select=BillingCompanyCode,OrganizationDivision"
                },
                _headerSelectQuery: {
                  value: "$select=SalesOrder,BillingCompanyCode"
                },
                _contentExpandQuery: {
                  value: "&$expand=_BillingCompanyCode($select=Country,Company)"
                },
                _headerExpandQuery: {
                  value: "&$expand=_BillingCompanyCode($select=Country,Company)"
                },
                _propertyFormatting: {
                  SalesOrder: {
                    arrangements: {
                      text: {
                        TextFirst: true,
                        path: "_BillingCompanyCode/Country"
                      }
                    }
                  },
                  tax_amount: {
                    arrangements: {
                      text: {
                        TextLast: true,
                        path: "Language"
                      }
                    }
                  },
                  "to_BusinessPartner/CompanyName": {
                    arrangements: {
                      text: {
                        TextLast: true,
                        path: "to_BusinessPartner/LegalForm"
                      }
                    }
                  },
                  "to_Currency/Currency_Code_Text": {
                    arrangements: {
                      text: {
                        TextFirst: true,
                        path: "to_BusinessPartner/PhoneNumber"
                      }
                    }
                  },
                  net_amount: {
                    arrangements: {
                      text: {
                        TextFirst: true,
                        path: "to_LifecycleStatus/Status"
                      }
                    }
                  },
                  "to_LifecycleStatus/Status_Text": {
                    arrangements: {
                      text: {
                        TextFirst: true,
                        path: "to_LifecycleStatus/Status"
                      }
                    }
                  }
                },
                footerActionParameters: {
                  "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SetBillingBlock(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)": {},
                  "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SetDeliveryBlock(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)": {}
                },
                _adaptiveFooterActionParameters: {
                  "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SetBillingBlock(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)": {
                    style: "default",
                    verb: "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SetBillingBlock",
                    label: "{{CardGenerator_AdaptiveCardActions_0_Label}}",
                    actionParameters: [{
                      isRequired: true,
                      id: "HeaderBillingBlockReason",
                      label: "{{CardGenerator_AdaptiveCardAction_0_ActionParameterLabel_0}}",
                      errorMessage: "{{CardGenerator_AdaptiveCardAction_ActionParameterErrorMsg}}",
                      placeholder: "{{CardGenerator_AdaptiveCardAction_ActionParameterPlaceholder}}",
                      actionData: {
                        actionParameterEntitySet: "I_BillingBlockReason",
                        actionParameterServiceUrl: "/sap/opu/odata4/sap/c_salesordermanage_srv/srvd_f4/sap/i_billingblockreason/0001;ps=%27srvd-c_salesordermanage_sd-0001%27;va=%27com.sap.gateway.srvd.c_salesordermanage_sd.v0001.ae-c_salesordermanage.setbillingblock.headerbillingblockreason.SalesOrderManageType%27/I_BillingBlockReason?$select=BillingBlockReason,BillingBlockReason_Text&skip=0&$top=20",
                        actionParameterValue: "${BillingBlockReason_Text} (${BillingBlockReason})",
                        actionParameterTitle: "${BillingBlockReason}"
                      }
                    }],
                    data: {
                      isConfirmationRequired: false
                    },
                    enablePath: "__OperationControl/SetBillingBlock",
                    complimentaryActionKey: "",
                    isComplimentaryAction: false,
                    okButtonText: "{{CardGenerator_AdaptiveCardActions_OkButton}}"
                  },
                  "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SetDeliveryBlock(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)": {
                    style: "default",
                    verb: "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SetDeliveryBlock",
                    label: "{{CardGenerator_AdaptiveCardActions_1_Label}}",
                    actionParameters: [{
                      isRequired: true,
                      id: "DeliveryBlockReason",
                      label: "{{CardGenerator_AdaptiveCardAction_1_ActionParameterLabel_0}}",
                      errorMessage: "{{CardGenerator_AdaptiveCardAction_ActionParameterErrorMsg}}",
                      placeholder: "{{CardGenerator_AdaptiveCardAction_ActionParameterPlaceholder}}",
                      actionData: {
                        actionParameterEntitySet: "I_DeliveryBlockReason",
                        actionParameterServiceUrl: "/sap/opu/odata4/sap/c_salesordermanage_srv/srvd_f4/sap/i_deliveryblockreason/0001;ps=%27srvd-c_salesordermanage_sd-0001%27;va=%27com.sap.gateway.srvd.c_salesordermanage_sd.v0001.ae-c_salesordermanage.setdeliveryblock.deliveryblockreason.SalesOrderManageType%27/I_DeliveryBlockReason?$select=DeliveryBlockReason,DeliveryBlockReason_Text&skip=0&$top=20",
                        actionParameterValue: "${DeliveryBlockReason_Text} (${DeliveryBlockReason})",
                        actionParameterTitle: "${DeliveryBlockReason}"
                      }
                    }],
                    data: {
                      isConfirmationRequired: false
                    },
                    enablePath: "__OperationControl/SetDeliveryBlock",
                    complimentaryActionKey: "",
                    isComplimentaryAction: false,
                    okButtonText: "{{CardGenerator_AdaptiveCardActions_OkButton}}"
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
                      url: "{{destinations.service}}/sap/opu/odata4/sap/c_salesordermanage_srv/srvd/sap/c_salesordermanage_sd/0001/",
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
                url: "{{destinations.service}}/sap/opu/odata4/sap/c_salesordermanage_srv/srvd/sap/c_salesordermanage_sd/0001//$batch",
                method: "POST",
                headers: {
                  "X-CSRF-Token": "{{csrfTokens.token1}}"
                },
                batch: {
                  header: {
                    method: "GET",
                    url: "SalesOrderManage({{parameters.contextParameters}})?{{parameters._headerSelectQuery}}{{parameters._headerExpandQuery}}",
                    headers: {
                      Accept: "application/json",
                      "Accept-Language": "{{parameters.LOCALE}}"
                    },
                    retryAfter: 30
                  },
                  content: {
                    method: "GET",
                    url: "SalesOrderManage({{parameters.contextParameters}})?{{parameters._contentSelectQuery}}{{parameters._contentExpandQuery}}",
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
                path: "/header/"
              },
              type: "Numeric",
              title: "{{CardGeneratorHeaderTitle}}",
              subTitle: "{{CardGeneratorHeaderSubTitle}}",
              unitOfMeasurement: "",
              mainIndicator: {
                number: "{_BillingCompanyCode/Country} ({SalesOrder})",
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
                path: "/content/"
              },
              groups: [{
                title: "{{CardGeneratorGroupHeader_Groups_0}}",
                items: [{
                  label: "{{CardGeneratorGroupPropertyLabel_Groups_0_Items_0}}",
                  value: "{_BillingCompanyCode/Company}",
                  name: "_BillingCompanyCode"
                }, {
                  label: "{{CardGeneratorGroupPropertyLabel_Groups_0_Items_1}}",
                  value: "{to_BusinessPartner/CreatedAt}",
                  name: "to_BusinessPartner"
                }, {
                  label: "{{CardGeneratorGroupPropertyLabel_Groups_0_Items_2}}",
                  value: "{OrganizationDivision}",
                  name: "OrganizationDivision"
                }]
              }]
            },
            footer: {
              actionsStrip: [{
                type: "Button",
                visible: false,
                text: "Set Billing Block",
                buttonType: "Default",
                actions: [{
                  type: "custom",
                  enabled: "${__OperationControl/SetBillingBlock}",
                  parameters: "{{parameters.footerActionParameters.com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SetBillingBlock(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)}}"
                }]
              }, {
                type: "Button",
                visible: false,
                text: "Set Delivery Block",
                buttonType: "Default",
                actions: [{
                  type: "custom",
                  enabled: "${__OperationControl/SetDeliveryBlock}",
                  parameters: "{{parameters.footerActionParameters.com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SetDeliveryBlock(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)}}"
                }]
              }]
            }
          },
          "sap.ui5": {
            _version: "1.1.0",
            contentDensities: {
              compact: true,
              cozy: true
            },
            dependencies: {
              libs: {
                "sap.insights": {
                  lazy: false
                }
              }
            }
          },
          "sap.insights": {
            templateName: "ObjectPage",
            parentAppId: "cus.sd.salesorderv2.manage",
            cardType: "LEAN_DT",
            versions: {
              ui5: "1.125.0-SNAPSHOT-202406010908",
              dtMiddleware: "0.3.6"
            }
          }
        };
        rootComponent.getModel().getObject = jest.fn(path => {
          const i18nValueMap = {
            CardGenerator_AdaptiveCardActions_0_Label: "Set Billing Block",
            CardGenerator_AdaptiveCardActions_OkButton: "OK",
            CardGenerator_AdaptiveCardAction_0_ActionParameterLabel_0: "Billing Block",
            CardGenerator_AdaptiveCardAction_ActionParameterErrorMsg: "This is a required input",
            CardGenerator_AdaptiveCardAction_ActionParameterPlaceholder: "Please choose",
            CardGenerator_AdaptiveCardActions_1_Label: "Set Delivery Block",
            CardGenerator_AdaptiveCardAction_1_ActionParameterLabel_0: "Delivery Block"
          };
          if (i18nValueMap[path]) {
            return i18nValueMap[path];
          }
          return path;
        });
        return Promise.resolve(getCardGeneratorDialogModel(rootComponent, cardManifest)).then(function (expectedResult) {
          expect(expectedResult.getData()).toMatchSnapshot();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });

    //when unitOfMeasures already exists to validate if its getting updated correctly
    test("updateUnitOfMeasures", () => {
      const unitOfMeasurement = [{
        propertyKeyForDescription: "currency_code",
        name: "net_amount",
        propertyKeyForId: "net_amount",
        value: "currency_code"
      }, {
        propertyKeyForDescription: "currency_code",
        name: "tax_amount",
        propertyKeyForId: "tax_amount",
        value: "currency_code"
      }, {
        propertyKeyForDescription: "currency_code",
        name: "gross_amount",
        propertyKeyForId: "gross_amount",
        value: "currency_code"
      }];
      const formatterConfigsWithUnit = [{
        formatterName: "format.unit",
        displayName: "",
        parameters: [{
          name: "type",
          displayName: "",
          type: "string",
          defaultValue: "",
          value: "${bp_id}"
        }, {
          name: "options",
          displayName: "Options",
          type: "object",
          defaultValue: "",
          properties: [{
            name: "decimals",
            displayName: "Decimals",
            type: "number",
            defaultValue: 2
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
            }]
          }]
        }],
        type: "numeric",
        visible: false,
        property: "gross_amount"
      }, {
        formatterName: "format.unit",
        displayName: "",
        parameters: [{
          name: "type",
          displayName: "",
          type: "string",
          defaultValue: "",
          value: "${bp_id}"
        }, {
          name: "options",
          displayName: "Options",
          type: "object",
          defaultValue: "",
          properties: [{
            name: "decimals",
            displayName: "Decimals",
            type: "number",
            defaultValue: 2
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
            }]
          }]
        }],
        type: "numeric",
        visible: false,
        property: "sp_id"
      }];
      const expectedResult = updateUnitOfMeasures(unitOfMeasurement, formatterConfigsWithUnit);
      expect(expectedResult).toMatchSnapshot();
    });
  });
});
//# sourceMappingURL=CardGeneratorModel.spec.js.map