/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/base/Log", "sap/cards/ap/generator/app/CardGeneratorDialogController", "sap/cards/ap/generator/helpers/ApplicationInfo", "sap/cards/ap/generator/helpers/FooterActions", "sap/cards/ap/generator/helpers/I18nHelper", "sap/cards/ap/generator/helpers/IntegrationCardHelper", "sap/cards/ap/generator/helpers/Transpiler", "sap/cards/ap/generator/odata/ODataUtils", "sap/cards/ap/generator/utils/CommonUtils", "sap/m/ComboBox", "sap/m/MessageBox", "sap/m/MessageToast", "sap/m/ToggleButton", "sap/m/VBox", "sap/ui/base/Event", "sap/ui/core/Element", "sap/ui/core/Fragment", "sap/ui/core/Item", "sap/ui/core/UIComponent", "sap/ui/core/library", "sap/ui/layout/Splitter", "sap/ui/model/json/JSONModel", "sap/ui/thirdparty/jquery"], function (Log, sap_cards_ap_generator_app_CardGeneratorDialogController, sap_cards_ap_generator_helpers_ApplicationInfo, sap_cards_ap_generator_helpers_FooterActions, sap_cards_ap_generator_helpers_I18nHelper, sap_cards_ap_generator_helpers_IntegrationCardHelper, sap_cards_ap_generator_helpers_Transpiler, ODataUtils, sap_cards_ap_generator_utils_CommonUtils, ComboBox, MessageBox, MessageToast, ToggleButton, VBox, Event, CoreElement, Fragment, Item, UIComponent, sap_ui_core_library, Splitter, JSONModel, jQuery) {
  "use strict";

  const CardGeneratorDialogController = sap_cards_ap_generator_app_CardGeneratorDialogController["CardGeneratorDialogController"];
  const getCriticality = sap_cards_ap_generator_app_CardGeneratorDialogController["getCriticality"];
  const ApplicationInfo = sap_cards_ap_generator_helpers_ApplicationInfo["ApplicationInfo"];
  const addActionToCardManifest = sap_cards_ap_generator_helpers_FooterActions["addActionToCardManifest"];
  const createAndStoreGeneratedi18nKeys = sap_cards_ap_generator_helpers_I18nHelper["createAndStoreGeneratedi18nKeys"];
  const getCurrentCardManifest = sap_cards_ap_generator_helpers_IntegrationCardHelper["getCurrentCardManifest"];
  const renderCardPreview = sap_cards_ap_generator_helpers_IntegrationCardHelper["renderCardPreview"];
  const transpileIntegrationCardToAdaptive = sap_cards_ap_generator_helpers_Transpiler["transpileIntegrationCardToAdaptive"];
  const getColorForGroup = sap_cards_ap_generator_utils_CommonUtils["getColorForGroup"];
  const ValueState = sap_ui_core_library["ValueState"];
  jest.mock(sap.jest.resolvePath("sap/cards/ap/generator/helpers/IntegrationCardHelper"), () => ({
    updateCardGroups: jest.fn(),
    getCurrentCardManifest: jest.fn(),
    renderCardPreview: jest.fn(),
    enhanceManifestWithInsights: jest.fn(),
    enhanceManifestWithConfigurationParameters: jest.fn()
  }));
  jest.mock(sap.jest.resolvePath("sap/cards/ap/generator/helpers/Transpiler"), () => {
    return {
      transpileIntegrationCardToAdaptive: jest.fn()
    };
  });
  jest.mock(sap.jest.resolvePath("sap/cards/ap/generator/helpers/FooterActions"), () => {
    return {
      addActionToCardManifest: jest.fn(),
      removeActionFromManifest: jest.fn(),
      updateCardManifestAction: jest.fn(),
      resetCardActions: jest.fn()
    };
  });
  jest.mock(sap.jest.resolvePath("sap/cards/ap/generator/helpers/I18nHelper"), () => {
    return {
      createAndStoreGeneratedi18nKeys: jest.fn()
    };
  });
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
              }
            };
          }
        };
      },
      getContext: () => {
        return {
          getObject: () => {
            return {
              node_key: "12345",
              IsActiveEntity: true
            };
          }
        };
      }
    };
  });
  describe("update header for navigation property", () => {
    let getCurrentCardManifestMock = getCurrentCardManifest;
    let setPropertyMock;
    let windowSpy;
    const oDialogModel = new JSONModel({
      configuration: {
        properties: [{
          name: "net_amount",
          type: "Edm.Int32"
        }],
        advancedFormattingOptions: {
          unitOfMeasures: [],
          textArrangements: [],
          propertyValueFormatters: []
        },
        trendOptions: {
          sourceProperty: ""
        },
        indicatorsValue: {},
        selectedIndicatorOptions: [],
        mainIndicatorStatusKey: "to_BillingStatus",
        navigationProperty: [{
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
        }],
        selectedNavigationProperties: {
          name: "to_BillingStatus",
          value: [{
            label: "Lower Value",
            type: "Edm.String",
            name: "Status"
          }, {
            label: "Confirmation",
            type: "Edm.String",
            name: "Status_Text"
          }]
        },
        $data: {
          net_amount: 6938.0
        }
      }
    });
    const getResourceBundleMock = jest.fn().mockReturnValue({
      getResourceBundle: jest.fn().mockReturnValue({
        getText: jest.fn().mockImplementation(key => {
          if (key === "GENERATOR_MAIN_INDICATOR") return "Main Indicator";
          if (key === "GENERIC_ERR_MSG") return "Error occurred for Main Indicator";
        })
      })
    });
    getCurrentCardManifestMock.mockReturnValue({
      _version: "1.15.0",
      "sap.app": {
        id: "objectCard",
        type: "card",
        title: "Card Title",
        applicationVersion: {
          version: "1.0.0"
        }
      },
      "sap.ui": {},
      "sap.card": {
        type: "Object",
        configuration: {
          parameters: {
            contextParameters: {
              type: "string",
              value: "node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true"
            }
          }
        },
        header: {
          title: "{sales_order_id}"
        },
        data: {
          request: {
            batch: {
              header: {
                url: "C_STTA_SalesOrder_WD_20({{parameters.contextParameters}})"
              }
            }
          }
        }
      }
    });
    const oDialog = {
      getModel: type => {
        if (type && type === "i18n") {
          return getResourceBundleMock();
        } else {
          return oDialogModel;
        }
      },
      open: jest.fn(),
      setModel: jest.fn(),
      close: jest.fn()
    };
    beforeAll(() => {
      getCurrentCardManifestMock = getCurrentCardManifest;
      setPropertyMock = jest.fn();
      windowSpy = jest.spyOn(window, "window", "get");
      windowSpy.mockImplementation(() => ({
        hasher: {
          getHash: () => "test-intent&/testEntity(12345)"
        }
      }));
      ApplicationInfo.createInstance(rootComponent);
      oDialogModel.setProperty = setPropertyMock;
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    afterAll(() => {
      windowSpy.mockRestore();
      ApplicationInfo.getInstance()._resetInstance();
      jest.clearAllMocks();
    });
    test("UpdateCardHeader - navigational property", function () {
      try {
        const setValueStateMock = jest.fn();
        const oEvent = {
          getSource: jest.fn().mockReturnValue({
            getSelectedKey: jest.fn().mockReturnValue("to_BillingStatus"),
            setValueState: setValueStateMock,
            getValue: jest.fn().mockReturnValue("to_BillingStatus)")
          }),
          getParameter: jest.fn().mockReturnValue({
            newValue: "to_BillingStatus"
          })
        };
        const data = {
          node_key: "12345",
          IsActiveEntity: true,
          to_BillingStatus: {
            Status: "",
            Status_Text: "Initial",
            test: "123"
          }
        };
        jest.spyOn(ODataUtils, "fetchDataAsync").mockImplementation(() => Promise.resolve(data));
        getCurrentCardManifestMock.mockReturnValue({
          _version: "1.15.0",
          "sap.app": {
            id: "objectCard",
            type: "card",
            title: "Card Title",
            applicationVersion: {
              version: "1.0.0"
            }
          },
          "sap.ui": {},
          "sap.card": {
            type: "Object",
            header: {
              title: "{sales_order_id}"
            },
            data: {
              request: {
                batch: {
                  header: {
                    url: "C_STTA_SalesOrder_WD_20({{parameters.contextParameters}})"
                  }
                }
              }
            }
          }
        });
        return Promise.resolve(CardGeneratorDialogController.onStateIndicatorSelection(oEvent)).then(function () {
          let count = 1;
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/selectedNavigationalProperties", [{
            name: "to_BillingStatus",
            value: [{
              label: "Lower Value",
              labelWithValue: "Lower Value (<empty>)",
              name: "Status",
              type: "Edm.String"
            }, {
              label: "Confirmation",
              labelWithValue: "Confirmation (Initial)",
              name: "Status_Text",
              type: "Edm.String"
            }]
          }]);
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/selectedNavigationPropertyHeader", {
            name: "to_BillingStatus",
            value: [{
              label: "Lower Value",
              labelWithValue: "Lower Value (<empty>)",
              name: "Status",
              type: "Edm.String"
            }, {
              label: "Confirmation",
              labelWithValue: "Confirmation (Initial)",
              name: "Status_Text",
              type: "Edm.String"
            }]
          });
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/$data", {
            net_amount: 6938,
            to_BillingStatus: {
              Status: "",
              Status_Text: "Initial",
              test: "123"
            }
          });
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/mainIndicatorNavigationSelectedValue", "");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/mainIndicatorNavigationSelectedKey", "");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/advancedFormattingOptions/isPropertyFormattingEnabled", false);
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/mainIndicatorStatusKey", "to_BillingStatus");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/advancedFormattingOptions/isFormatterEnabled", false);
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/advancedFormattingOptions/textArrangementSourceProperty", "{to_BillingStatus}");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/advancedFormattingOptions/textArrangementSelectedKey", "to_BillingStatus");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/trendOptions", {});
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/indicatorsValue", {});
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/trendOptions/sourceProperty", "to_BillingStatus");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/indicatorsValue/sourceProperty", "to_BillingStatus");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/navigationValue", "");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/advancedFormattingOptions/sourceProperty", "to_BillingStatus");
          expect(setValueStateMock).toHaveBeenCalledWith(ValueState.None);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });
  describe("Update header, title, subtitle, uom, KPI value", () => {
    let renderCardPreviewMock;
    // let getCurrentCardManifestMock: jest.Mock;
    let getCurrentCardManifestMock = getCurrentCardManifest;
    let setPropertyMock;
    const oDialogModel = new JSONModel({
      configuration: {
        properties: [{
          name: "net_amount",
          type: "Edm.Int32"
        }],
        advancedFormattingOptions: {
          unitOfMeasures: [],
          textArrangements: [],
          propertyValueFormatters: []
        },
        trendOptions: {
          sourceProperty: ""
        },
        indicatorsValue: {},
        selectedIndicatorOptions: [],
        mainIndicatorStatusKey: "to_BillingStatus",
        navigationProperty: [],
        selectedNavigationProperties: {
          name: "",
          value: []
        }
      }
    });
    const getResourceBundleMock = jest.fn().mockReturnValue({
      getResourceBundle: jest.fn().mockReturnValue({
        getText: jest.fn().mockImplementation(key => {
          if (key === "GENERATOR_MAIN_INDICATOR") return "Main Indicator";
          if (key === "GENERIC_ERR_MSG") return "Error occurred for Main Indicator";
        })
      })
    });
    const oDialog = {
      getModel: type => {
        if (type && type === "i18n") {
          return getResourceBundleMock();
        } else {
          return oDialogModel;
        }
      },
      open: jest.fn(),
      setModel: jest.fn(),
      close: jest.fn()
    };
    const manifestWhenThereIsNoMainIndicatorValue = {
      _version: "1.15.0",
      "sap.app": {
        id: "objectCard",
        type: "card",
        title: "Card Title",
        applicationVersion: {
          version: "1.0.0"
        }
      },
      "sap.ui": {},
      "sap.card": {
        type: "Object",
        header: {
          title: "{sales_order_id}"
        }
      }
    };
    beforeEach(() => {
      renderCardPreviewMock = renderCardPreview;
      getCurrentCardManifestMock = getCurrentCardManifest;
      setPropertyMock = jest.fn();
      oDialogModel.setProperty = setPropertyMock;
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
      getCurrentCardManifestMock.mockReturnValue({
        _version: "1.15.0",
        "sap.app": {
          id: "objectCard",
          type: "card",
          title: "Card Title",
          applicationVersion: {
            version: "1.0.0"
          }
        },
        "sap.ui": {},
        "sap.card": {
          type: "Object",
          header: {
            title: "{sales_order_id}"
          }
        }
      });
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("UpdateCardHeader - card title", () => {
      const setValueStateMock = jest.fn();
      const oEvent = {
        getSource: jest.fn().mockReturnValue({
          getSelectedKey: jest.fn().mockReturnValue("sales_order_id"),
          setValueState: setValueStateMock
        }),
        getParameter: jest.fn().mockReturnValue({
          newValue: "sales_order_id"
        })
      };
      const expectedManifest = {
        _version: "1.15.0",
        "sap.app": {
          id: "objectCard",
          type: "card",
          title: "Card Title",
          applicationVersion: {
            version: "1.0.0"
          }
        },
        "sap.ui": {},
        "sap.card": {
          type: "Object",
          header: {
            title: "{sales_order_id}"
          }
        }
      };
      getCurrentCardManifestMock.mockReturnValue({
        _version: "1.15.0",
        "sap.app": {
          id: "objectCard",
          type: "card",
          title: "Card Title",
          applicationVersion: {
            version: "1.0.0"
          }
        },
        "sap.ui": {},
        "sap.card": {
          type: "Object"
        }
      });
      CardGeneratorDialogController.onTitleSelection(oEvent);
      expect(renderCardPreviewMock).toHaveBeenCalledWith(expectedManifest, oDialogModel);
      expect(setValueStateMock).toHaveBeenCalledWith(ValueState.None);
      expect(setPropertyMock).toHaveBeenNthCalledWith(1, "/configuration/advancedFormattingOptions/sourceProperty", "sales_order_id");
    });
    test("UpdateCardHeader - card subtitle", () => {
      const setValueStateMock = jest.fn();
      const oEvent = {
        getSource: jest.fn().mockReturnValue({
          getSelectedKey: jest.fn().mockReturnValue("description"),
          setValueState: setValueStateMock
        }),
        getParameter: jest.fn().mockReturnValue({
          newValue: "description"
        })
      };
      const expectedManifest = {
        _version: "1.15.0",
        "sap.app": {
          id: "objectCard",
          type: "card",
          title: "Card Title",
          applicationVersion: {
            version: "1.0.0"
          }
        },
        "sap.ui": {},
        "sap.card": {
          type: "Object",
          header: {
            title: "{sales_order_id}",
            subTitle: "{description}"
          }
        }
      };
      CardGeneratorDialogController.onSubTitleSelection(oEvent);
      expect(renderCardPreviewMock).toHaveBeenCalledWith(expectedManifest, oDialogModel);
      expect(setValueStateMock).toHaveBeenCalledWith(ValueState.None);
      expect(setPropertyMock).toHaveBeenNthCalledWith(1, "/configuration/advancedFormattingOptions/sourceProperty", "description");
    });
    test("UpdateCardHeader - card UOM", () => {
      const setValueStateMock = jest.fn();
      const oEvent = {
        getSource: jest.fn().mockReturnValue({
          getSelectedKey: jest.fn().mockReturnValue("currency_code"),
          setValueState: setValueStateMock
        }),
        getParameter: jest.fn().mockReturnValue({
          newValue: "currency_code"
        })
      };
      const expectedManifest = {
        _version: "1.15.0",
        "sap.app": {
          id: "objectCard",
          type: "card",
          title: "Card Title",
          applicationVersion: {
            version: "1.0.0"
          }
        },
        "sap.ui": {},
        "sap.card": {
          type: "Object",
          header: {
            title: "{sales_order_id}",
            unitOfMeasurement: "{currency_code}"
          }
        }
      };
      CardGeneratorDialogController.onHeaderUOMSelection(oEvent);
      expect(renderCardPreviewMock).toHaveBeenCalledWith(expectedManifest, oDialogModel);
      expect(setValueStateMock).toHaveBeenCalledWith(ValueState.None);
      expect(setPropertyMock).toHaveBeenNthCalledWith(1, "/configuration/advancedFormattingOptions/sourceProperty", "currency_code");
    });
    test("UpdateCardHeader - card KPI", function () {
      try {
        const setValueStateMock = jest.fn();
        const oEvent = {
          getSource: jest.fn().mockReturnValue({
            getSelectedKey: jest.fn().mockReturnValue("net_amount"),
            setValueState: setValueStateMock,
            getValue: jest.fn().mockReturnValue("Net Amount (6938.00)")
          }),
          getParameter: jest.fn().mockReturnValue({
            newValue: "net_amount"
          })
        };
        const expectedManifest = {
          _version: "1.15.0",
          "sap.app": {
            id: "objectCard",
            type: "card",
            title: "Card Title",
            applicationVersion: {
              version: "1.0.0"
            }
          },
          "sap.ui": {},
          "sap.card": {
            type: "Object",
            header: {
              title: "{sales_order_id}",
              mainIndicator: {
                state: "None",
                number: "{net_amount}",
                trend: "None"
              },
              sideIndicators: [{
                number: "",
                title: "",
                unit: ""
              }, {
                number: "",
                title: "",
                unit: ""
              }]
            }
          }
        };
        return Promise.resolve(CardGeneratorDialogController.onStateIndicatorSelection(oEvent)).then(function () {
          let count = 1;
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/selectedNavigationalProperties", []);
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/selectedNavigationPropertyHeader", {
            name: "",
            value: []
          });
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/mainIndicatorNavigationSelectedValue", "");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/mainIndicatorNavigationSelectedKey", "");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/advancedFormattingOptions/isPropertyFormattingEnabled", false);
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/mainIndicatorStatusKey", "net_amount");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/advancedFormattingOptions/isFormatterEnabled", true);
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/advancedFormattingOptions/textArrangementSourceProperty", "{net_amount}");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/advancedFormattingOptions/textArrangementSelectedKey", "net_amount");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/trendOptions", {});
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/indicatorsValue", {});
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/trendOptions/sourceProperty", "net_amount");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/indicatorsValue/sourceProperty", "net_amount");
          expect(renderCardPreviewMock).toHaveBeenCalledWith(expectedManifest, oDialogModel);
          expect(setValueStateMock).toHaveBeenCalledWith(ValueState.None);

          //validate header does not have main indicator or side indicator when main indicator value is not provided
          const setValueStateTextMock = jest.fn();
          const event = {
            getSource: jest.fn().mockReturnValue({
              getSelectedKey: jest.fn().mockReturnValue(""),
              setValueState: setValueStateMock,
              setValueStateText: setValueStateTextMock,
              getValue: jest.fn().mockReturnValue("")
            }),
            getParameter: jest.fn().mockReturnValue({
              newValue: ""
            })
          };
          return Promise.resolve(CardGeneratorDialogController.onStateIndicatorSelection(event)).then(function () {
            expect(renderCardPreview).toHaveBeenCalledWith(manifestWhenThereIsNoMainIndicatorValue, oDialogModel);
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    test("sets value state to none - when selected key and value exists", function () {
      try {
        const setValueStateMock = jest.fn();
        const setValueStateTextMock = jest.fn();
        const oEvent = {
          getSource: jest.fn().mockReturnValue({
            getSelectedKey: jest.fn().mockReturnValue("net_amount"),
            setValueState: setValueStateMock,
            setValueStateText: setValueStateTextMock,
            getValue: jest.fn().mockReturnValue("Net Amount (6938.00)")
          }),
          getParameter: jest.fn().mockReturnValue({
            newValue: "net_amount"
          })
        };
        return Promise.resolve(CardGeneratorDialogController.onStateIndicatorSelection(oEvent)).then(function () {
          let count = 1;
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/selectedNavigationalProperties", []);
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/selectedNavigationPropertyHeader", {
            name: "",
            value: []
          });
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/mainIndicatorNavigationSelectedValue", "");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/mainIndicatorNavigationSelectedKey", "");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/advancedFormattingOptions/isPropertyFormattingEnabled", false);
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/mainIndicatorStatusKey", "net_amount");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/advancedFormattingOptions/isFormatterEnabled", true);
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/advancedFormattingOptions/textArrangementSourceProperty", "{net_amount}");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/advancedFormattingOptions/textArrangementSelectedKey", "net_amount");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/trendOptions", {});
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/indicatorsValue", {});
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/trendOptions/sourceProperty", "net_amount");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/indicatorsValue/sourceProperty", "net_amount");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/navigationValue", "");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/advancedFormattingOptions/sourceProperty", "net_amount");
          expect(setValueStateMock).toHaveBeenCalledWith(ValueState.None);

          //validate header does not have main indicator or side indicator when main indicator value is not provided
          const event = {
            getSource: jest.fn().mockReturnValue({
              getSelectedKey: jest.fn().mockReturnValue(""),
              setValueState: setValueStateMock,
              setValueStateText: setValueStateTextMock,
              getValue: jest.fn().mockReturnValue("")
            }),
            getParameter: jest.fn().mockReturnValue({
              newValue: ""
            })
          };
          return Promise.resolve(CardGeneratorDialogController.onStateIndicatorSelection(event)).then(function () {
            expect(renderCardPreview).toHaveBeenCalledWith(manifestWhenThereIsNoMainIndicatorValue, oDialogModel);
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    test("sets error state and state indicator text when no selected key but value exists", function () {
      try {
        const setValueStateMock = jest.fn();
        const setValueStateTextMock = jest.fn();
        const oEvent = {
          getSource: jest.fn().mockReturnValue({
            getSelectedKey: jest.fn().mockReturnValue(""),
            setValueState: setValueStateMock,
            setValueStateText: setValueStateTextMock,
            getValue: jest.fn().mockReturnValue("Net Amount (6938.00)")
          }),
          getParameter: jest.fn().mockReturnValue("net_amount")
        };
        return Promise.resolve(CardGeneratorDialogController.onStateIndicatorSelection(oEvent)).then(function () {
          let count = 1;
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/selectedNavigationalProperties", []);
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/selectedNavigationPropertyHeader", {
            name: "",
            value: []
          });
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/mainIndicatorNavigationSelectedValue", "");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/mainIndicatorNavigationSelectedKey", "");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/advancedFormattingOptions/isPropertyFormattingEnabled", false);
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/mainIndicatorStatusKey", "");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/advancedFormattingOptions/isFormatterEnabled", false);
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/advancedFormattingOptions/textArrangementSourceProperty", "net_amount");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/advancedFormattingOptions/textArrangementSelectedKey", "");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/trendOptions/sourceProperty", "");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/indicatorsValue/sourceProperty", "");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/navigationValue", "");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/advancedFormattingOptions/sourceProperty", "");
          expect(setValueStateMock).toHaveBeenCalledWith(ValueState.Error);
          expect(setValueStateTextMock).toHaveBeenCalledWith("Error occurred for Main Indicator");
          //validate header does not have main indicator or side indicator when there is no selected key for main indicator but value exists
          return Promise.resolve(CardGeneratorDialogController.onStateIndicatorSelection(oEvent)).then(function () {
            expect(renderCardPreview).toHaveBeenCalledWith(manifestWhenThereIsNoMainIndicatorValue, oDialogModel);
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    test("updateTrendForCardHeader - trend ", function () {
      try {
        const setValueStateMock = jest.fn();
        const oEvent = {
          getSource: jest.fn().mockReturnValue({
            getSelectedKey: jest.fn().mockReturnValue("net_amount"),
            setValueState: setValueStateMock,
            getValue: jest.fn().mockReturnValue("Net Amount (6938.00)")
          }),
          getParameter: jest.fn().mockReturnValue({
            newValue: "net_amount"
          })
        };
        getCurrentCardManifestMock.mockReturnValue({
          _version: "1.15.0",
          "sap.app": {
            id: "objectCard",
            type: "card",
            title: "Card Title",
            applicationVersion: {
              version: "1.0.0"
            }
          },
          "sap.ui": {},
          "sap.card": {
            type: "Object",
            header: {
              title: "{sales_order_id}"
            }
          }
        });
        const expectedManifest = {
          _version: "1.15.0",
          "sap.app": {
            id: "objectCard",
            type: "card",
            title: "Card Title",
            applicationVersion: {
              version: "1.0.0"
            }
          },
          "sap.ui": {},
          "sap.card": {
            type: "Object",
            header: {
              title: "{sales_order_id}",
              mainIndicator: {
                state: "None",
                number: "{net_amount}",
                trend: "None"
              },
              sideIndicators: [{
                number: "",
                title: "",
                unit: ""
              }, {
                number: "",
                title: "",
                unit: ""
              }]
            }
          }
        };
        return Promise.resolve(CardGeneratorDialogController.onStateIndicatorSelection(oEvent)).then(function () {
          let count = 1;
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/selectedNavigationalProperties", []);
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/selectedNavigationPropertyHeader", {
            name: "",
            value: []
          });
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/mainIndicatorNavigationSelectedValue", "");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/mainIndicatorNavigationSelectedKey", "");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/advancedFormattingOptions/isPropertyFormattingEnabled", false);
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/mainIndicatorStatusKey", "net_amount");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/advancedFormattingOptions/isFormatterEnabled", true);
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/advancedFormattingOptions/textArrangementSourceProperty", "{net_amount}");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/advancedFormattingOptions/textArrangementSelectedKey", "net_amount");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/trendOptions", {});
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/indicatorsValue", {});
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/trendOptions/sourceProperty", "net_amount");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/indicatorsValue/sourceProperty", "net_amount");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/navigationValue", "");
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/advancedFormattingOptions/sourceProperty", "net_amount");
          expect(renderCardPreviewMock).toHaveBeenCalledWith(expectedManifest, oDialogModel);
          expect(setValueStateMock).toHaveBeenCalledWith(ValueState.None);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });
  describe("Validate header with arrangements - updateHeaderArrangements and updateArrangements", () => {
    let renderCardPreviewMock;
    let getCurrentCardManifestMock;
    const oDialogModel = new JSONModel({
      configuration: {
        mainIndicatorStatusKey: "net_amount",
        advancedFormattingOptions: {
          unitOfMeasures: [{
            arrangementKey: "currency_code",
            name: "net_amount",
            propKey: "net_amount",
            value: "currency_code"
          }],
          textArrangements: [],
          propertyValueFormatters: [{
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
        },
        groups: [{
          title: "Group 1",
          items: [{
            label: "",
            value: "",
            isEnabled: false,
            name: ""
          }]
        }]
      }
    });
    const oDialog = {
      getModel: jest.fn().mockReturnValue(oDialogModel),
      open: jest.fn(),
      setModel: jest.fn(),
      close: jest.fn()
    };
    beforeEach(() => {
      renderCardPreviewMock = renderCardPreview;
      getCurrentCardManifestMock = getCurrentCardManifest;
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("updateHeaderArrangements - Validate card header with arrangements", () => {
      getCurrentCardManifestMock.mockReturnValue({
        _version: "1.15.0",
        "sap.app": {
          id: "objectCard",
          type: "card",
          title: "Card Title",
          applicationVersion: {
            version: "1.0.0"
          }
        },
        "sap.ui": {},
        "sap.card": {
          type: "Object",
          header: {
            type: "Numeric",
            title: "Sales Order",
            subTitle: "{so_id}",
            unitOfMeasurement: "{currency_code}",
            mainIndicator: {
              number: "{net_amount}",
              unit: "",
              trend: "None",
              state: "Good"
            }
          },
          configuration: {
            parameters: {
              contextParameters: {
                type: "string",
                value: "node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true"
              }
            }
          },
          data: {
            request: {
              batch: {
                header: {
                  url: "C_STTA_SalesOrder_WD_20({{parameters.contextParameters}})"
                }
              }
            }
          }
        }
      });
      const expectedManifest = {
        _version: "1.15.0",
        "sap.app": {
          id: "objectCard",
          type: "card",
          title: "Card Title",
          applicationVersion: {
            version: "1.0.0"
          }
        },
        "sap.ui": {},
        "sap.card": {
          configuration: {
            parameters: {
              contextParameters: {
                type: "string",
                value: "node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true"
              }
            }
          },
          data: {
            request: {
              batch: {
                header: {
                  url: "C_STTA_SalesOrder_WD_20({{parameters.contextParameters}})"
                }
              }
            }
          },
          type: "Object",
          header: {
            type: "Numeric",
            title: "Sales Order",
            subTitle: "{so_id}",
            unitOfMeasurement: "{currency_code}",
            mainIndicator: {
              number: '{= format.unit(${net_amount}, ${currency_code}, {"decimals":2,"style":"long"})}',
              unit: "",
              trend: "None",
              state: "Good"
            }
          }
        }
      };
      CardGeneratorDialogController._updateHeaderArrangements();
      expect(renderCardPreviewMock).toHaveBeenCalledWith(expectedManifest, oDialogModel);
    });
    test("updateArrangements - Validate if value assignment for items under the group is not done when item does not have name (when it has empty string)", () => {
      getCurrentCardManifestMock.mockReturnValue({
        _version: "1.15.0",
        "sap.app": {
          id: "objectCard",
          type: "card",
          title: "Card Title",
          applicationVersion: {
            version: "1.0.0"
          }
        },
        "sap.ui": {},
        "sap.card": {
          type: "Object",
          header: {
            type: "Numeric",
            title: "Sales Order",
            subTitle: "{so_id}",
            unitOfMeasurement: "{currency_code}",
            mainIndicator: {
              number: "{net_amount}",
              unit: "",
              trend: "None",
              state: "Good"
            }
          }
        }
      });
      CardGeneratorDialogController._updateArrangements();
      const expected = oDialogModel.getProperty("/configuration/groups")[0].items[0].value;
      expect(expected).toEqual("");
    });
  });
  describe("Validate header with arrangements - updateHeaderArrangements, when header has a navigational property of date type.", () => {
    let renderCardPreviewMock;
    let getCurrentCardManifestMock;
    const oDialogModel = new JSONModel({
      configuration: {
        mainIndicatorStatusKey: "DraftAdministrativeData",
        advancedFormattingOptions: {
          unitOfMeasures: [{
            arrangementKey: "currency_code",
            name: "net_amount",
            propKey: "net_amount",
            value: "currency_code"
          }],
          textArrangements: [{
            "propertyKeyForId": "DraftAdministrativeData",
            "name": "DraftAdministrativeData/CreationDateTime",
            "value": "gross_amount",
            "navigationalPropertiesForId": [{
              "label": "Draft Created On",
              "type": "Edm.DateTimeOffset",
              "name": "CreationDateTime",
              "labelWithValue": "Draft Created On (Dec 26, 2024, 2:59:39 PM)"
            }],
            "isNavigationForId": true,
            "navigationKeyForId": "CreationDateTime",
            "propertyKeyForDescription": "gross_amount",
            "isNavigationForDescription": false,
            "navigationKeyForDescription": "",
            "arrangementType": "TextFirst",
            "textArrangement": "TextFirst"
          }],
          propertyValueFormatters: [{
            "property": "DraftAdministrativeData/CreationDateTime",
            "formatterName": "format.dateTime",
            "displayName": "Date/Time",
            "parameters": [{
              "name": "options",
              "displayName": "Options",
              "type": "object",
              "defaultValue": "",
              "properties": [{
                "name": "relative",
                "displayName": "Relative",
                "type": "boolean",
                "defaultValue": false,
                "selected": false
              }, {
                "name": "UTC",
                "displayName": "UTC",
                "type": "boolean",
                "defaultValue": false,
                "selected": true
              }]
            }],
            "type": "Date",
            "visible": true
          }]
        },
        navigationValue: "DraftAdministrativeData/CreationDateTime",
        selectedNavigationPropertyHeader: {
          value: [{
            "label": "Draft Created On",
            "type": "Edm.DateTimeOffset",
            "name": "CreationDateTime",
            "labelWithValue": "Draft Created On (Dec 23, 2024, 9:39:31 AM)"
          }]
        },
        mainIndicatorNavigationSelectedKey: "CreationDateTime",
        groups: []
      }
    });
    const oDialog = {
      getModel: jest.fn().mockReturnValue(oDialogModel),
      open: jest.fn(),
      setModel: jest.fn(),
      close: jest.fn()
    };
    beforeEach(() => {
      renderCardPreviewMock = renderCardPreview;
      getCurrentCardManifestMock = getCurrentCardManifest;
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("Validate to check if text arrangement and formatting both are getting applied correctly", () => {
      getCurrentCardManifestMock.mockReturnValue({
        _version: "1.15.0",
        "sap.card": {
          type: "Object",
          header: {
            type: "Numeric",
            title: "Sales Order",
            subTitle: "{so_id}",
            mainIndicator: {
              number: "{= format.dateTime(${DraftAdministrativeData/ProcessingStartDateTime}, {\"relative\":false\"UTC\":true})}",
              trend: "None",
              state: "Good"
            }
          }
        }
      });
      CardGeneratorDialogController._updateHeaderArrangements();
      const calledWithArgs = renderCardPreviewMock.mock.calls[0][0];
      expect(calledWithArgs["sap.card"].header.mainIndicator.number).toMatchSnapshot();
    });
  });
  describe("Validate header with arrangements -updateArrangements when group is having the matching content(group) value", () => {
    let renderCardPreviewMock;
    let getCurrentCardManifestMock;
    const oDialogModel = new JSONModel({
      configuration: {
        mainIndicatorStatusKey: "net_amount",
        advancedFormattingOptions: {
          unitOfMeasures: [{
            arrangementKey: "currency_code",
            name: "net_amount",
            propKey: "net_amount",
            value: "currency_code"
          }],
          textArrangements: [{
            propKey: "Language",
            name: "Language",
            arrangementKey: "to_BillingStatus",
            value: "to_BillingStatus/Status_Text",
            navigationalProperties: [{
              label: "Lower Value",
              type: "Edm.String",
              name: "Status",
              labelWithValue: "Lower Value (<empty>)"
            }, {
              label: "Confirmation",
              type: "Edm.String",
              name: "Status_Text",
              labelWithValue: "Confirmation (Initial)"
            }],
            isNavigation: true,
            navKey: "Status_Text",
            arrangementType: "TextLast",
            textArrangement: "TextLast"
          }]
        },
        groups: [{
          title: "Group 1",
          items: [{
            label: "Language",
            value: "{Language} ({to_BillingStatus/Status_Text})",
            isEnabled: true,
            name: "Language",
            navigationProperty: "",
            isNavigationEnabled: false
          }, {
            label: "Gross Amount",
            value: "{to_Currency/Currency_Code_Text} ({gross_amount}) {currency_code}",
            isEnabled: true,
            isNavigationEnabled: false,
            navigationalProperties: [],
            name: "gross_amount"
          }]
        }]
      }
    });
    const oDialog = {
      getModel: jest.fn().mockReturnValue(oDialogModel),
      open: jest.fn(),
      setModel: jest.fn(),
      close: jest.fn()
    };
    beforeEach(() => {
      renderCardPreviewMock = renderCardPreview;
      getCurrentCardManifestMock = getCurrentCardManifest;
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("updateArrangements - Validate card header with arrangements", () => {
      getCurrentCardManifestMock.mockReturnValue({
        _version: "1.15.0",
        "sap.app": {
          id: "objectCard",
          type: "card",
          title: "Card Title",
          applicationVersion: {
            version: "1.0.0"
          }
        },
        "sap.ui": {},
        "sap.card": {
          type: "Object",
          header: {
            type: "Numeric",
            title: "Sales Order",
            subTitle: "{so_id}",
            unitOfMeasurement: "{currency_code}",
            mainIndicator: {
              number: "{net_amount}",
              unit: "",
              trend: "None",
              state: "Good"
            }
          }
        }
      });
      CardGeneratorDialogController._updateArrangements();
      const expected = oDialogModel.getProperty("/configuration/groups")[0].items[0].value;
      expect(expected).toMatchSnapshot();
    });
  });
  describe("Validate updateArrangements - when group items are having navigational properties of date type, arrangement is a navigational property of date type.", () => {
    let getCurrentCardManifestMock;
    const oDialogModel = new JSONModel({
      configuration: {
        mainIndicatorStatusKey: "",
        advancedFormattingOptions: {
          unitOfMeasures: [{
            arrangementKey: "currency_code",
            name: "net_amount",
            propKey: "net_amount",
            value: "currency_code"
          }],
          textArrangements: [{
            "propertyKeyForId": "DraftAdministrativeData",
            "name": "DraftAdministrativeData/ProcessingStartDateTime",
            "value": "to_BusinessPartner/CreatedAt",
            "navigationalPropertiesForId": [{
              "label": "Draft In Process Since",
              "type": "Edm.DateTimeOffset",
              "name": "ProcessingStartDateTime",
              "labelWithValue": "Draft In Process Since (Dec 26, 2024, 6:37:47 PM)"
            }],
            "isNavigationForId": true,
            "navigationKeyForId": "ProcessingStartDateTime",
            "propertyKeyForDescription": "to_BusinessPartner",
            "navigationalPropertiesForDescription": [{
              "label": "Created At",
              "type": "Edm.DateTimeOffset",
              "name": "CreatedAt",
              "labelWithValue": "Created At (Oct 1, 2018, 4:45:56 PM)"
            }],
            "isNavigationForDescription": true,
            "navigationKeyForDescription": "CreatedAt",
            "arrangementType": "TextFirst",
            "textArrangement": "TextFirst"
          }],
          propertyValueFormatters: [{
            "property": "DraftAdministrativeData/ProcessingStartDateTime",
            "formatterName": "format.dateTime",
            "displayName": "Date/Time",
            "parameters": [{
              "name": "options",
              "displayName": "Options",
              "type": "object",
              "defaultValue": "",
              "properties": [{
                "name": "relative",
                "displayName": "Relative",
                "type": "boolean",
                "defaultValue": false,
                "selected": false
              }, {
                "name": "UTC",
                "displayName": "UTC",
                "type": "boolean",
                "defaultValue": false,
                "selected": true
              }]
            }],
            "type": "Date",
            "visible": true
          }, {
            "property": "to_BusinessPartner/CreatedAt",
            "formatterName": "format.dateTime",
            "displayName": "Date/Time",
            "parameters": [{
              "name": "options",
              "displayName": "Options",
              "type": "object",
              "defaultValue": "",
              "properties": [{
                "name": "relative",
                "displayName": "Relative",
                "type": "boolean",
                "defaultValue": false,
                "selected": false
              }, {
                "name": "UTC",
                "displayName": "UTC",
                "type": "boolean",
                "defaultValue": false,
                "selected": true
              }]
            }],
            "type": "Date",
            "visible": true
          }]
        },
        groups: [{
          "title": "Group 1",
          "items": [{
            "label": "Draft In Process Since",
            "value": "{= format.dateTime(${DraftAdministrativeData/ProcessingStartDateTime}, {\"relative\":false,\"UTC\":true})}",
            "isEnabled": false,
            "isNavigationEnabled": true,
            "navigationalProperties": [{
              "label": "Draft In Process Since",
              "type": "Edm.DateTimeOffset",
              "name": "ProcessingStartDateTime",
              "labelWithValue": "Draft In Process Since (Dec 23, 2024, 1:47:52 PM)"
            }],
            "name": "DraftAdministrativeData",
            "navigationProperty": "ProcessingStartDateTime"
          }],
          "newItem": {
            "label": null,
            "value": null,
            "isEnabled": false,
            "isNavigationEnabled": false,
            "navigationalProperties": []
          }
        }]
      }
    });
    const oDialog = {
      getModel: jest.fn().mockReturnValue(oDialogModel),
      open: jest.fn(),
      setModel: jest.fn(),
      close: jest.fn()
    };
    beforeEach(() => {
      getCurrentCardManifestMock = getCurrentCardManifest;
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("Validate to check if formatting and text arrangement both are getting applied correctly", () => {
      getCurrentCardManifestMock.mockReturnValue({
        _version: "1.15.0",
        "sap.card": {
          type: "Object",
          header: {
            "data": {
              "path": "/header/d/"
            },
            "type": "Numeric",
            "title": "Sales Order",
            "subTitle": "A Fiori application.",
            "unitOfMeasurement": "",
            "mainIndicator": {
              "number": ""
            }
          },
          content: {
            "data": {
              "path": "/content/d/"
            },
            "groups": [{
              "title": "Group 1",
              "items": [{
                "label": "Draft In Process Since",
                "value": "{= format.dateTime(${DraftAdministrativeData/ProcessingStartDateTime}, {\"relative\":false,\"UTC\":true})}",
                "name": "DraftAdministrativeData"
              }]
            }]
          }
        }
      });
      CardGeneratorDialogController._updateArrangements();
      expect(oDialogModel.getProperty("/configuration/groups")[0].items[0].value).toMatchSnapshot();
    });
  });
  describe("Validate criticality and UoM, delete trend", () => {
    let renderCardPreviewMock;
    let getCurrentCardManifestMock;
    const oDialogModel = new JSONModel({
      configuration: {
        mainIndicatorOptions: {
          criticality: [{
            activeCalculation: true,
            criticality: "Good",
            name: "net_amount"
          }]
        },
        advancedFormattingOptions: {
          sourceCriticalityProperty: [{
            name: "net_amount",
            activeCalculation: false,
            criticality: "Critical",
            hostCriticality: "Good"
          }],
          textArrangements: [],
          propertyValueFormatters: [],
          sourceUoMProperty: "so_id",
          targetProperty: "currency_code",
          unitOfMeasures: [{
            arrangementKey: "currency_code",
            name: "gross_amount",
            propKey: "gross_amount",
            value: "currency_code"
          }, {
            arrangementKey: "currency_code",
            name: "net_amount",
            propKey: "net_amount",
            value: "currency_code"
          }, {
            arrangementKey: "currency_code",
            name: "tax_amount",
            propKey: "tax_amount",
            value: "currency_code"
          }]
        },
        trendOptions: {
          sourceProperty: "net_amount",
          downDifference: "1000",
          downDifferenceValueState: "None",
          upDifference: "1000",
          upDifferenceValueState: "None",
          referenceValue: "2",
          referenceValueState: "None",
          upDown: "2"
        },
        selectedTrendOptions: [{
          referenceValue: "2",
          downDifference: "1000",
          upDifference: "1000",
          sourceProperty: "net_amount"
        }]
      }
    });
    const oDialog = {
      getModel: jest.fn().mockReturnValue(oDialogModel),
      open: jest.fn(),
      setModel: jest.fn(),
      close: jest.fn()
    };
    beforeEach(() => {
      renderCardPreviewMock = renderCardPreview;
      getCurrentCardManifestMock = getCurrentCardManifest;
      getCurrentCardManifestMock.mockReturnValue({
        _version: "1.15.0",
        "sap.app": {
          id: "objectCard",
          type: "card",
          title: "Card Title",
          applicationVersion: {
            version: "1.0.0"
          }
        },
        "sap.ui": {},
        "sap.card": {
          extension: "module:sap/cards/ap/common/extensions/BaseIntegrationCardExtension",
          type: "Object",
          header: {
            data: {
              path: "/header/d/"
            },
            type: "Numeric",
            title: "Sales Order",
            subTitle: "A Fiori application.",
            unitOfMeasurement: "",
            mainIndicator: {
              number: "{= format.unit(${net_amount}, ${currency_code})}",
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
              title: "Group 1",
              items: [{
                label: "Gross Amount",
                value: "{= format.unit(${gross_amount}, ${currency_code})}",
                name: "gross_amount",
                state: "{= extension.formatters.formatCriticality(${Language}, 'state') }",
                type: "Status"
              }, {
                label: "Tax Amount",
                value: '{= format.dateTime(${DraftEntityCreationDateTime}, {"relative":false,"UTC":true})}',
                name: "DraftEntityCreationDateTime",
                state: "Error",
                type: "Status"
              }, {
                label: "CardGeneratorGroupPropertyLabel_Groups_0_Items_3",
                value: "{so_id}",
                name: "so_id",
                state: "{= extension.formatters.formatCriticality(${op_id_fc}, 'state') }",
                type: "Status"
              }]
            }, {
              title: "Additional Info",
              items: [{
                label: "Business Partner ID",
                value: "{= format.unit(${net_amount}, ${currency_code})}",
                name: "net_amount",
                state: "{= extension.formatters.formatCriticality(${Language}, 'state') }",
                type: "Status"
              }, {
                label: "Created At",
                value: "{node_key}",
                name: "node_key",
                state: "Warning",
                type: "Status"
              }]
            }, {
              title: "CardGeneratorGroupHeader_Groups_2",
              items: [{
                label: "CardGeneratorGroupPropertyLabel_Groups_2_Items_0",
                value: '{= format.dateTime(${DraftEntityCreationDateTime}, {"relative":false,"UTC":true})}',
                name: "DraftEntityCreationDateTime",
                state: "Error",
                type: "Status"
              }, {
                label: "CardGeneratorGroupPropertyLabel_Groups_2_Items_1",
                value: "{= format.unit(${net_amount}, ${currency_code})}",
                name: "net_amount",
                state: "{= extension.formatters.formatCriticality(${Language}, 'state') }",
                type: "Status"
              }, {
                label: "CardGeneratorGroupPropertyLabel_Groups_2_Items_2",
                value: '{= format.dateTime(${changed_at}, {"relative":false,"UTC":true})}',
                name: "changed_at",
                state: '{= extension.formatters.formatValueColor(${changed_at},{"deviationLow":"100","deviationHigh":"100","toleranceLow":"100","toleranceHigh":"100","sImprovementDirection":"Target","oCriticalityConfigValues":{"None":"None","Negative":"Error","Critical":"Warning","Positive":"Success"}}) }',
                type: "Status"
              }]
            }]
          }
        }
      });
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("applyCriticality - Validate hostCriticality from sourceCriticalityProperty gets deleted, mainIndicatorCriticality gets updated with updated sourceCriticalityProperty", () => {
      const event = {
        getParameter: jest.fn().mockReturnValue({
          isCalcuationType: true
        })
      };
      CardGeneratorDialogController.applyCriticality(event);
      expect(oDialog.getModel().getProperty("/configuration/mainIndicatorOptions/criticality")).toMatchSnapshot();
    });
    test("updateCriticality ", () => {
      const expectedManifest = {
        _version: "1.15.0",
        "sap.app": {
          id: "objectCard",
          type: "card",
          title: "Card Title",
          applicationVersion: {
            version: "1.0.0"
          }
        },
        "sap.ui": {},
        "sap.card": {
          extension: "module:sap/cards/ap/common/extensions/BaseIntegrationCardExtension",
          type: "Object",
          header: {
            data: {
              path: "/header/d/"
            },
            type: "Numeric",
            title: "Sales Order",
            subTitle: "A Fiori application.",
            unitOfMeasurement: "",
            mainIndicator: {
              number: "{= format.unit(${net_amount}, ${currency_code})}",
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
              title: "Group 1",
              items: [{
                label: "Gross Amount",
                value: "{= format.unit(${gross_amount}, ${currency_code})}",
                name: "gross_amount",
                state: "{= extension.formatters.formatCriticality(${Language}, 'state') }",
                type: "Status"
              }, {
                label: "Tax Amount",
                value: '{= format.dateTime(${DraftEntityCreationDateTime}, {"relative":false,"UTC":true})}',
                name: "DraftEntityCreationDateTime",
                state: "Error",
                type: "Status"
              }, {
                label: "CardGeneratorGroupPropertyLabel_Groups_0_Items_3",
                value: "{so_id}",
                name: "so_id",
                state: "{= extension.formatters.formatCriticality(${op_id_fc}, 'state') }",
                type: "Status"
              }]
            }, {
              title: "Additional Info",
              items: [{
                label: "Business Partner ID",
                value: "{= format.unit(${net_amount}, ${currency_code})}",
                name: "net_amount",
                state: "{= extension.formatters.formatCriticality(${Language}, 'state') }",
                type: "Status"
              }, {
                label: "Created At",
                value: "{node_key}",
                name: "node_key",
                state: "Warning",
                type: "Status"
              }]
            }, {
              title: "CardGeneratorGroupHeader_Groups_2",
              items: [{
                label: "CardGeneratorGroupPropertyLabel_Groups_2_Items_0",
                value: '{= format.dateTime(${DraftEntityCreationDateTime}, {"relative":false,"UTC":true})}',
                name: "DraftEntityCreationDateTime",
                state: "Error",
                type: "Status"
              }, {
                label: "CardGeneratorGroupPropertyLabel_Groups_2_Items_1",
                value: "{= format.unit(${net_amount}, ${currency_code})}",
                name: "net_amount",
                state: "{= extension.formatters.formatCriticality(${Language}, 'state') }",
                type: "Status"
              }, {
                label: "CardGeneratorGroupPropertyLabel_Groups_2_Items_2",
                value: '{= format.dateTime(${changed_at}, {"relative":false,"UTC":true})}',
                name: "changed_at",
                state: '{= extension.formatters.formatValueColor(${changed_at},{"deviationLow":"100","deviationHigh":"100","toleranceLow":"100","toleranceHigh":"100","sImprovementDirection":"Target","oCriticalityConfigValues":{"None":"None","Negative":"Error","Critical":"Warning","Positive":"Success"}}) }',
                type: "Status"
              }]
            }]
          }
        }
      };
      CardGeneratorDialogController._updateCriticality(false);
      expect(renderCardPreviewMock).toHaveBeenCalledWith(expectedManifest, oDialogModel);
      expect(transpileIntegrationCardToAdaptive).toHaveBeenCalled();
    });
    test("getColorForGroup", () => {
      const testCases = [{
        input: "Error",
        expected: "Error"
      }, {
        input: "Neutral",
        expected: "None"
      }, {
        input: "Critical",
        expected: "Warning"
      }, {
        input: "Good",
        expected: "Success"
      }, {
        input: "{= extension.formatters.formatCriticality(${net_amount}, 'state') }",
        expected: "{= extension.formatters.formatCriticality(${net_amount}, 'state') }"
      }, {
        input: "{net_amount}",
        expected: "{= extension.formatters.formatCriticality(${net_amount}, 'state') }"
      }, {
        input: {
          activeCalculation: true,
          name: "Net_amount"
        },
        expected: '{= extension.formatters.formatValueColor(${Net_amount},{"oCriticalityConfigValues":{"None":"None","Negative":"Error","Critical":"Warning","Positive":"Success"}}) }'
      }, {
        input: "NoValue",
        expected: undefined
      }, {
        input: undefined,
        expected: undefined
      }];
      testCases.forEach(_ref => {
        let {
          input,
          expected
        } = _ref;
        const result = getColorForGroup(input);
        expect(result).toEqual(expected);
      });
    });
    test("applyUoMFormatting - Validate if UoM array gets updated with source property object, when target (UoM) is applied and source is not a part of the UoM array", () => {
      CardGeneratorDialogController.applyUoMFormatting();
      expect(oDialog.getModel().getProperty("/configuration/advancedFormattingOptions/unitOfMeasures")).toMatchSnapshot();
    });
    test("onTrendDelete", () => {
      CardGeneratorDialogController.onTrendDelete();
      expect(oDialog.getModel().getProperty("/configuration/trendOptions")).toMatchSnapshot();
    });
  });
  describe("loadAdvancedFormattingConfigurationFragment", () => {
    const oDialogModel = new JSONModel({
      configuration: {
        mainIndicatorStatusUnit: "Gross Amount (5631.08)",
        groups: [{
          items: [{
            label: "Net Amount"
          }]
        }],
        properties: [{
          label: "Net Amount",
          type: "Edm.Decimal",
          name: "net_amount",
          UOM: "currency_code",
          isDate: false,
          value: "4732.00",
          labelWithValue: "Net Amount (4732.00)"
        }]
      }
    });
    const getResourceBundleMock = jest.fn().mockReturnValue({
      getResourceBundle: jest.fn().mockReturnValue({
        getText: jest.fn().mockImplementation((key, text) => {
          if (key === "SELECT_UOM_TEXT") return "Select UoM for";
          if (key === "SELECT_FORMATTER_TEXT") return "Select Formatter for";
          if (key === "SELECT_CRITICALITY_TEXT") return "Select Criticality for";
        })
      })
    });
    const oDialog = {
      getModel: type => {
        if (type && type === "i18n") {
          return getResourceBundleMock();
        } else {
          return oDialogModel;
        }
      },
      open: jest.fn(),
      setModel: jest.fn(),
      close: jest.fn()
    };
    beforeEach(() => {
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("loadAdvancedFormattingConfigurationFragment - validate if getText of oResourceBundle is passed with correct second argument", function () {
      try {
        //when getBindingContext is present (when items in groups are added) - corresponding group item label is passed as text
        let source = {
          getBindingContext: jest.fn().mockReturnValue({
            sPath: "/configuration/groups/0/items/0"
          }),
          getId: jest.fn().mockReturnValue("cardGeneratorDialog--additionalActions-__list9-__vbox3-0-0"),
          addDependent: jest.fn()
        };
        const configurationController = {
          applyCriticality: jest.fn(),
          onPopoverClose: jest.fn(),
          onPropertyFormatterChange: jest.fn(),
          applyUoMFormatting: jest.fn(),
          applyFormatting: jest.fn(),
          resetValueState: jest.fn(),
          onDownDifferenceChange: jest.fn(),
          onUpDifferenceChange: jest.fn(),
          onReferenceValInputChange: jest.fn(),
          onTargetValueChange: jest.fn(),
          onDeviationValueChange: jest.fn(),
          onTargetUnitChange: jest.fn(),
          onDeviationUnitChange: jest.fn(),
          applyIndicators: jest.fn(),
          applyTrendCalculation: jest.fn(),
          onDelete: jest.fn(),
          onTrendDelete: jest.fn(),
          onIndicatorsDelete: jest.fn(),
          onDeleteFormatter: jest.fn(),
          onDeleteCriticality: jest.fn()
        };
        Fragment.load = jest.fn().mockResolvedValue(Promise.resolve({
          setBindingContext: jest.fn(),
          openBy: jest.fn(),
          setModel: jest.fn()
        }));
        return Promise.resolve(CardGeneratorDialogController.loadAdvancedFormattingConfigurationFragment(source, configurationController)).then(function () {
          expect(getResourceBundleMock().getResourceBundle().getText).toHaveBeenCalledWith("SELECT_UOM_TEXT", ["Net Amount (4732.00)"]);
          expect(getResourceBundleMock().getResourceBundle().getText).toHaveBeenCalledWith("SELECT_FORMATTER_TEXT", ["Net Amount (4732.00)"]);
          expect(getResourceBundleMock().getResourceBundle().getText).toHaveBeenCalledWith("SELECT_CRITICALITY_TEXT", ["Net Amount (4732.00)"]);

          //when getBindingContext is undefined (when items in groups are not added) - mainIndicator label is passed as text
          source = {
            getBindingContext: jest.fn().mockReturnValue(undefined),
            getId: jest.fn().mockReturnValue("cardGeneratorDialog--additionalActions-__list9-__vbox3-0-0"),
            addDependent: jest.fn()
          };
          return Promise.resolve(CardGeneratorDialogController.loadAdvancedFormattingConfigurationFragment(source, configurationController)).then(function () {
            expect(getResourceBundleMock().getResourceBundle().getText).toHaveBeenCalledWith("SELECT_UOM_TEXT", ["Gross Amount (5631.08)"]);
            expect(getResourceBundleMock().getResourceBundle().getText).toHaveBeenCalledWith("SELECT_FORMATTER_TEXT", ["Gross Amount (5631.08)"]);
            expect(getResourceBundleMock().getResourceBundle().getText).toHaveBeenCalledWith("SELECT_CRITICALITY_TEXT", ["Gross Amount (5631.08)"]);
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });
  describe("Update header - trend, side indicator", () => {
    let renderCardPreviewMock;
    let getCurrentCardManifestMock;
    let setPropertyMock;
    const oDialogModelData = {
      configuration: {
        properties: [{
          name: "net_amount",
          type: "Edm.Int32"
        }],
        advancedFormattingOptions: {
          textArrangementSelectedKey: "net_amount"
        },
        trendOptions: {
          sourceProperty: "net_amount",
          downDifference: "200",
          downDifferenceValueState: "None",
          upDifference: "400",
          upDifferenceValueState: "None",
          referenceValue: "300",
          referenceValueState: "None"
        },
        selectedTrendOptions: [],
        indicatorsValue: {
          sourceProperty: "net_amount",
          targetValue: "200",
          targetUnit: "K",
          deviationValue: "300",
          deviationUnit: "K"
        },
        selectedIndicatorOptions: []
      }
    };
    const oDialogModel = new JSONModel(oDialogModelData);
    const oDialog = {
      getModel: jest.fn().mockReturnValue(oDialogModel),
      open: jest.fn(),
      setModel: jest.fn(),
      close: jest.fn()
    };
    beforeEach(() => {
      renderCardPreviewMock = renderCardPreview;
      getCurrentCardManifestMock = getCurrentCardManifest;
      setPropertyMock = jest.fn();
      oDialogModel.setData(oDialogModelData);
      oDialogModel.setProperty = setPropertyMock;
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    test("updateTrendForCardHeader - trend ", () => {
      getCurrentCardManifestMock.mockReturnValue({
        _version: "1.15.0",
        "sap.app": {
          id: "objectCard",
          type: "card",
          title: "Card Title",
          applicationVersion: {
            version: "1.0.0"
          }
        },
        "sap.ui": {},
        "sap.card": {
          type: "Object",
          header: {
            type: "Numeric",
            title: "{sales_order_id}",
            mainIndicator: {
              state: "None",
              number: "{net_amount}",
              trend: "None"
            }
          }
        }
      });
      const expectedManifest = {
        _version: "1.15.0",
        "sap.app": {
          id: "objectCard",
          type: "card",
          title: "Card Title",
          applicationVersion: {
            version: "1.0.0"
          }
        },
        "sap.ui": {},
        "sap.card": {
          type: "Object",
          header: {
            type: "Numeric",
            title: "{sales_order_id}",
            mainIndicator: {
              state: "None",
              number: "{net_amount}",
              trend: "None"
            }
          }
        }
      };
      const expectedTrendValues = {
        referenceValue: "300",
        downDifference: "200",
        upDifference: "400",
        sourceProperty: "net_amount"
      };
      CardGeneratorDialogController._updateTrendForCardHeader();
      expect(renderCardPreviewMock).toHaveBeenCalledWith(expectedManifest, oDialogModel);
      expect(oDialogModel.getProperty("/configuration/selectedTrendOptions")).toEqual([expectedTrendValues]);
    });
    test("updateTrendForCardHeader - side indicator ", () => {
      getCurrentCardManifestMock.mockReturnValue({
        _version: "1.15.0",
        "sap.app": {
          id: "objectCard",
          type: "card",
          title: "Card Title",
          applicationVersion: {
            version: "1.0.0"
          }
        },
        "sap.ui": {},
        "sap.card": {
          configuration: {
            parameters: {
              contextParameters: {
                type: "string",
                value: "node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true"
              }
            }
          },
          data: {
            request: {
              batch: {
                header: {
                  url: "C_STTA_SalesOrder_WD_20({{parameters.contextParameters}})"
                }
              }
            }
          },
          type: "Object",
          header: {
            type: "Numeric",
            title: "{sales_order_id}",
            mainIndicator: {
              state: "None",
              number: "{net_amount}",
              trend: "None"
            }
          }
        }
      });
      const expectedManifest = {
        _version: "1.15.0",
        "sap.app": {
          id: "objectCard",
          type: "card",
          title: "Card Title",
          applicationVersion: {
            version: "1.0.0"
          }
        },
        "sap.ui": {},
        "sap.card": {
          configuration: {
            parameters: {
              contextParameters: {
                type: "string",
                value: "node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true"
              }
            }
          },
          data: {
            request: {
              batch: {
                header: {
                  url: "C_STTA_SalesOrder_WD_20({{parameters.contextParameters}})"
                }
              }
            }
          },
          type: "Object",
          header: {
            type: "Numeric",
            title: "{sales_order_id}",
            mainIndicator: {
              state: "None",
              number: "{net_amount}",
              trend: "None"
            },
            sideIndicators: [{
              title: "Target",
              number: "200",
              unit: "K"
            }, {
              title: "Deviation",
              number: "300",
              unit: "K"
            }]
          }
        }
      };
      const expectedIndicatorValues = {
        targetValue: "200",
        deviationValue: "300",
        targetUnit: "K",
        deviationUnit: "K",
        sourceProperty: "net_amount"
      };
      CardGeneratorDialogController._updateSideIndicatorsForHeader();
      expect(renderCardPreviewMock).toHaveBeenCalledWith(expectedManifest, oDialogModel);
      expect(oDialogModel.getProperty("/configuration/selectedIndicatorOptions")).toEqual([expectedIndicatorValues]);
      expect(setPropertyMock).toHaveBeenNthCalledWith(1, "/configuration/indicatorsValue/targetDeviation", "200");
    });
  });
  describe("Update header for selected values - trend, side indicator", () => {
    let renderCardPreviewMock;
    let getCurrentCardManifestMock;
    let setPropertyMock;
    const oDialogModelData = {
      configuration: {
        properties: [{
          name: "net_amount",
          type: "Edm.Int32"
        }],
        advancedFormattingOptions: {
          textArrangementSelectedKey: "net_amount"
        },
        trendOptions: {
          sourceProperty: "net_amount",
          downDifference: "200",
          downDifferenceValueState: "None",
          upDifference: "400",
          upDifferenceValueState: "None",
          referenceValue: "300",
          referenceValueState: "None"
        },
        selectedTrendOptions: [{
          referenceValue: "33333333",
          downDifference: "11",
          upDifference: "22",
          sourceProperty: "net_amount"
        }],
        indicatorsValue: {
          sourceProperty: "net_amount",
          targetValue: "200",
          targetUnit: "K",
          deviationValue: "300",
          deviationUnit: "K"
        },
        selectedIndicatorOptions: [{
          targetValue: "11",
          deviationValue: "55",
          targetUnit: "%",
          deviationUnit: "K",
          sourceProperty: "net_amount"
        }]
      }
    };
    const oDialogModel = new JSONModel(oDialogModelData);
    const oDialog = {
      getModel: jest.fn().mockReturnValue(oDialogModel),
      open: jest.fn(),
      setModel: jest.fn()
    };
    beforeEach(() => {
      renderCardPreviewMock = renderCardPreview;
      getCurrentCardManifestMock = getCurrentCardManifest;
      setPropertyMock = jest.fn();
      oDialogModel.setData(oDialogModelData);
      oDialogModel.setProperty = setPropertyMock;
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    test("updateTrendForCardHeader - for selected trend ", () => {
      getCurrentCardManifestMock.mockReturnValue({
        _version: "1.15.0",
        "sap.app": {
          id: "objectCard",
          type: "card",
          title: "Card Title",
          applicationVersion: {
            version: "1.0.0"
          }
        },
        "sap.ui": {},
        "sap.card": {
          type: "Object",
          header: {
            type: "Numeric",
            title: "{sales_order_id}",
            mainIndicator: {
              state: "None",
              number: "{net_amount}",
              trend: "None"
            }
          }
        }
      });
      const expectedManifest = {
        _version: "1.15.0",
        "sap.app": {
          id: "objectCard",
          type: "card",
          title: "Card Title",
          applicationVersion: {
            version: "1.0.0"
          }
        },
        "sap.ui": {},
        "sap.card": {
          type: "Object",
          header: {
            type: "Numeric",
            title: "{sales_order_id}",
            mainIndicator: {
              state: "None",
              number: "{net_amount}",
              trend: "None"
            }
          }
        }
      };
      const expectedTrendValues = {
        referenceValue: "300",
        downDifference: "200",
        upDifference: "400",
        sourceProperty: "net_amount"
      };
      CardGeneratorDialogController._updateTrendForCardHeader();
      expect(renderCardPreviewMock).toHaveBeenCalledWith(expectedManifest, oDialogModel);
      expect(oDialogModel.getProperty("/configuration/selectedTrendOptions")).toEqual([expectedTrendValues]);
      expect(setPropertyMock).toHaveBeenNthCalledWith(1, "/configuration/trendOptions", {
        downDifference: "200",
        downDifferenceValueState: "None",
        referenceValue: "300",
        referenceValueState: "None",
        sourceProperty: "net_amount",
        upDifference: "400",
        upDifferenceValueState: "None"
      });
    });
    test("updateSideIndicatorsForHeader - for selected side indicator ", () => {
      getCurrentCardManifestMock.mockReturnValue({
        _version: "1.15.0",
        "sap.app": {
          id: "objectCard",
          type: "card",
          title: "Card Title",
          applicationVersion: {
            version: "1.0.0"
          }
        },
        "sap.ui": {},
        "sap.card": {
          type: "Object",
          header: {
            type: "Numeric",
            title: "{sales_order_id}",
            mainIndicator: {
              state: "None",
              number: "{net_amount}",
              trend: "None"
            }
          }
        }
      });
      const expectedManifest = {
        _version: "1.15.0",
        "sap.app": {
          id: "objectCard",
          type: "card",
          title: "Card Title",
          applicationVersion: {
            version: "1.0.0"
          }
        },
        "sap.ui": {},
        "sap.card": {
          type: "Object",
          header: {
            type: "Numeric",
            title: "{sales_order_id}",
            mainIndicator: {
              state: "None",
              number: "{net_amount}",
              trend: "None"
            },
            sideIndicators: [{
              title: "Target",
              number: "200",
              unit: "K"
            }, {
              title: "Deviation",
              number: "300",
              unit: "K"
            }]
          }
        }
      };
      CardGeneratorDialogController._updateSideIndicatorsForHeader();
      expect(renderCardPreviewMock).toHaveBeenCalledWith(expectedManifest, oDialogModel);
      expect(oDialogModel.getProperty("/configuration/selectedIndicatorOptions")).toMatchSnapshot();
      expect(setPropertyMock).toHaveBeenNthCalledWith(1, "/configuration/indicatorsValue", {
        deviationUnit: "K",
        deviationValue: "300",
        sourceProperty: "net_amount",
        targetUnit: "K",
        targetValue: "200"
      }), expect(setPropertyMock).toHaveBeenNthCalledWith(2, "/configuration/indicatorsValue/targetDeviation", "200");
    });
  });
  describe("Validations - Card header", () => {
    let setPropertyMock;
    const oDialogModel = new JSONModel();
    const oDialog = {
      getModel: jest.fn().mockReturnValue(oDialogModel),
      open: jest.fn(),
      setModel: jest.fn(),
      close: jest.fn()
    };
    beforeEach(() => {
      setPropertyMock = jest.fn();
      oDialogModel.setProperty = setPropertyMock;
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("setAdvancedFormattingOptionsEnablement - Validate advanced formatting options for additional actions enablement", () => {
      let oDialogModelData = {
        configuration: {
          mainIndicatorStatusKey: "net_amount",
          properties: [{
            name: "net_amount",
            type: "Edm.Int32"
          }],
          advancedFormattingOptions: {
            unitOfMeasures: [{
              name: "net_amount",
              value: "currency_code"
            }],
            propertyValueFormatters: [{
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
              property: "net_amount"
            }]
          },
          trendOptions: {
            sourceProperty: "net_amount",
            downDifference: "200",
            upDifference: "400",
            referenceValue: "300"
          },
          selectedTrendOptions: [{
            referenceValue: "",
            downDifference: "",
            upDifference: "",
            sourceProperty: "",
            upDown: false
          }],
          indicatorsValue: {
            sourceProperty: "net_amount",
            targetValue: "200",
            targetUnit: "K",
            deviationValue: "300",
            deviationUnit: "K"
          },
          selectedIndicatorOptions: [{
            targetValue: "",
            targetUnit: "",
            deviationValue: "",
            deviationUnit: "",
            sourceProperty: "",
            targetDeviation: false
          }]
        }
      };
      oDialogModel.setData(oDialogModelData);
      CardGeneratorDialogController._setAdvancedFormattingOptionsEnablement("net_amount");
      let count = 1;
      expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/trendOptions/sourceProperty", "net_amount");
      expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/indicatorsValue/sourceProperty", "net_amount");
      expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/advancedFormattingOptions/isFormatterApplied", false);
      expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/advancedFormattingOptions/isFormatterEnabled", true);
      expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/advancedFormattingOptions/isUOMApplied", true);
      expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/advancedFormattingOptions/isCriticalityApplied", false);
      expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/advancedFormattingOptions/isTrendApplied", false);
      expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/advancedFormattingOptions/isIndicatorsApplied", false);
      expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/trendOptions/upDown", true);
      expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/indicatorsValue/targetDeviation", true);

      //when unit formatter has default formatOptions
      oDialogModelData = {
        configuration: {
          mainIndicatorStatusKey: "net_amount",
          properties: [{
            name: "{net_amount}",
            type: "Edm.Int32"
          }],
          advancedFormattingOptions: {
            unitOfMeasures: [{
              name: "net_amount",
              value: "currency_code"
            }],
            propertyValueFormatters: [{
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
              property: "net_amount"
            }]
          },
          trendOptions: {},
          selectedTrendOptions: [],
          indicatorsValue: {},
          selectedIndicatorOptions: []
        }
      };
      oDialogModel.setData(oDialogModelData);
      CardGeneratorDialogController._setAdvancedFormattingOptionsEnablement("{net_amount}");
      expect(setPropertyMock).toHaveBeenNthCalledWith(13, "/configuration/advancedFormattingOptions/isFormatterApplied", false);

      //when unit formatter has user provided formatOptions
      oDialogModelData = {
        configuration: {
          mainIndicatorStatusKey: "net_amount",
          properties: [{
            name: "{net_amount}",
            type: "Edm.Int32"
          }],
          advancedFormattingOptions: {
            unitOfMeasures: [{
              name: "net_amount",
              value: "currency_code"
            }],
            propertyValueFormatters: [{
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
              visible: false,
              property: "net_amount"
            }]
          },
          trendOptions: {},
          selectedTrendOptions: [],
          indicatorsValue: {},
          selectedIndicatorOptions: []
        }
      };
      oDialogModel.setData(oDialogModelData);
      CardGeneratorDialogController._setAdvancedFormattingOptionsEnablement("net_amount");
      expect(setPropertyMock).toHaveBeenNthCalledWith(21, "/configuration/advancedFormattingOptions/isFormatterApplied", true);

      //when unit formatter has user provided formatOptions - decimals in formatOptions is 0
      oDialogModelData = {
        configuration: {
          properties: [{
            name: "{net_amount}",
            type: "Edm.Int32"
          }],
          advancedFormattingOptions: {
            unitOfMeasures: [{
              name: "net_amount",
              value: "currency_code"
            }],
            propertyValueFormatters: [{
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
            }]
          },
          trendOptions: {},
          selectedTrendOptions: [],
          indicatorsValue: {},
          selectedIndicatorOptions: []
        }
      };
      oDialogModel.setData(oDialogModelData);
      CardGeneratorDialogController._setAdvancedFormattingOptionsEnablement("net_amount");
      expect(setPropertyMock).toHaveBeenNthCalledWith(29, "/configuration/advancedFormattingOptions/isFormatterApplied", true);
      oDialogModelData = {
        configuration: {
          mainIndicatorStatusKey: "net_amount",
          properties: [{
            name: "net_amount",
            type: "Edm.Int32"
          }],
          advancedFormattingOptions: {
            unitOfMeasures: [{
              name: "net_amount",
              value: "currency_code"
            }],
            propertyValueFormatters: [{
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
              property: "net_amount"
            }]
          },
          trendOptions: {
            sourceProperty: "",
            downDifference: "",
            upDifference: "",
            referenceValue: ""
          },
          selectedTrendOptions: [{
            referenceValue: "3333",
            downDifference: "11",
            upDifference: "22",
            sourceProperty: "net_amount",
            upDown: true
          }],
          indicatorsValue: {
            sourceProperty: "",
            targetValue: "",
            targetUnit: "",
            deviationValue: "",
            deviationUnit: ""
          },
          selectedIndicatorOptions: [{
            targetValue: "1144",
            targetUnit: "%",
            deviationValue: "22",
            deviationUnit: "%",
            sourceProperty: "net_amount",
            targetDeviation: true
          }]
        }
      };
      oDialogModel.setData(oDialogModelData);
      CardGeneratorDialogController._setAdvancedFormattingOptionsEnablement("net_amount");
      expect(setPropertyMock).toHaveBeenNthCalledWith(41, "/configuration/advancedFormattingOptions/isTrendApplied", true);
      expect(setPropertyMock).toHaveBeenNthCalledWith(42, "/configuration/advancedFormattingOptions/isIndicatorsApplied", true);
    });
  });
  describe("Card Action Handlers", () => {
    let setValueStateMock;
    let coreElementGetElementByIdSpy;
    let createAndStoreGeneratedi18nKeysMock;
    let jQueryAjaxSpy;
    let windowSpy;
    let addActionToCardManifestMock;
    const oDialogModelData = {
      configuration: {
        actions: {
          addedActions: [],
          annotationActions: [{
            label: "Release",
            action: "C_SalesPlanTPRelease"
          }, {
            label: "Reopen",
            action: "C_SalesPlanTPReopen"
          }],
          isAddActionEnabled: true,
          isConfirmationRequired: "false",
          complimentaryAction: {
            title: "",
            titleKey: "",
            style: "Default",
            isConfirmationRequired: "false",
            complimentaryActionKey: ""
          }
        },
        errorControls: [],
        keyParameters: [],
        appIntent: "SalesQuotation-manageV2"
      }
    };
    const oDialogModel = new JSONModel(oDialogModelData);
    const getResourceBundleMock = jest.fn().mockReturnValue({
      getResourceBundle: jest.fn().mockReturnValue({
        getText: jest.fn().mockImplementation(key => {
          if (key === "GENERATOR_CARD_TITLE") return "Card Title";
          if (key === "GENERATOR_MAIN_INDICATOR") return "Main Indicator";
          if (key === "GENERIC_ERR_MSG") return "Error occurred for Main Indicator ";
        })
      }),
      getObject: jest.fn().mockImplementation(key => {
        if (key === "GENERATOR_ACTION_ERROR_TEXT") return "Error occurred";
      })
    });
    const oDialog = {
      getModel: type => {
        if (type && type === "i18n") {
          return getResourceBundleMock();
        } else {
          return oDialogModel;
        }
      },
      open: jest.fn(),
      setModel: jest.fn(),
      close: jest.fn()
    };
    beforeAll(() => {
      coreElementGetElementByIdSpy = jest.spyOn(CoreElement, "getElementById");
      ApplicationInfo.createInstance(rootComponent);
    });
    afterAll(() => {
      ApplicationInfo.getInstance()._resetInstance();
    });
    beforeEach(() => {
      coreElementGetElementByIdSpy.mockReset();
      setValueStateMock = jest.fn();
      addActionToCardManifestMock = addActionToCardManifest;
      createAndStoreGeneratedi18nKeysMock = createAndStoreGeneratedi18nKeys;
      jQueryAjaxSpy = jest.spyOn(jQuery, "ajax");
      windowSpy = jest.spyOn(window, "window", "get");
      windowSpy.mockImplementation(() => ({
        hasher: {
          getHash: () => "SalesQuotation-manageV2&/SalesQuotationManage('20000005')"
        },
        location: {
          href: "https://my313815.s4hana.ondemand.com/ui#SalesQuotation-manageV2&/SalesQuotationManage('20000005')",
          origin: "https://my313815.s4hana.ondemand.com"
        }
      }));
      oDialogModel.setData(oDialogModelData);
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    afterEach(() => {
      windowSpy.mockRestore();
      jest.clearAllMocks();
    });
    test("onActionAddClick : Test the handler when add action button is being clicked on UI", () => {
      expect(oDialogModel.getProperty("/configuration/actions/addedActions")).toMatchSnapshot();
      CardGeneratorDialogController.onActionAddClick();
      expect(oDialogModel.getProperty("/configuration/actions/addedActions")).toMatchSnapshot();
    });
    test("onAddedActionDelete : Test the handler when Delete action is being clicked on UI and there exists two action on UI", () => {
      const addedActions = [{
        title: "Reopen",
        titleKey: "C_SalesPlanTPReopen",
        style: "Positive",
        enablePathKey: "IsActiveEntity",
        isStyleControlEnabled: true
      }, {
        title: "Release",
        titleKey: "C_SalesPlanTPRelease",
        style: "Negative",
        enablePathKey: "Update_mc",
        isStyleControlEnabled: true
      }];
      oDialogModelData.configuration.actions.addedActions = addedActions;
      oDialogModelData.configuration.actions.isAddActionEnabled = false;
      const oEvent = {
        getSource: jest.fn().mockReturnValue({
          getBindingContext: jest.fn().mockReturnValue({
            getPath: jest.fn().mockReturnValue("/configuration/actions/addedActions/0")
          })
        })
      };
      expect(oDialogModelData.configuration.actions.addedActions).toMatchSnapshot();
      expect(oDialogModelData.configuration.actions.annotationActions).toMatchSnapshot();
      expect(oDialogModelData.configuration.actions.isAddActionEnabled).toBe(false);
      CardGeneratorDialogController.onAddedActionDelete(oEvent);
      expect(oDialogModelData.configuration.actions.addedActions).toMatchSnapshot();
      expect(oDialogModelData.configuration.actions.annotationActions).toMatchSnapshot();
      expect(oDialogModelData.configuration.actions.isAddActionEnabled).toBe(true);

      //Delete the last action
      CardGeneratorDialogController.onAddedActionDelete(oEvent);
      expect(oDialogModelData.configuration.actions.addedActions).toMatchSnapshot();
      expect(oDialogModelData.configuration.actions.annotationActions).toMatchSnapshot();
      expect(oDialogModelData.configuration.actions.isAddActionEnabled).toBe(true);
    });
    test("onAddedActionStyleChange : Test the handler when added actions style property is changed", () => {
      const addedActions = [{
        title: "Reopen",
        titleKey: "C_SalesPlanTPReopen",
        style: "Positive",
        enablePathKey: "IsActiveEntity",
        isStyleControlEnabled: true
      }];
      oDialogModelData.configuration.actions.addedActions = addedActions;
      const oEvent = {
        getSource: jest.fn().mockReturnValue({
          getSelectedKey: jest.fn().mockReturnValue("Negative"),
          getValue: jest.fn().mockReturnValue("Negative"),
          getBindingContext: jest.fn().mockReturnValue({
            getPath: jest.fn().mockReturnValue("/configuration/actions/addedActions/0")
          })
        })
      };
      CardGeneratorDialogController.onAddedActionStyleChange(oEvent);
      expect(oDialogModel.getProperty("/configuration/actions/addedActions")).toMatchSnapshot();
    });
    test("okPressed : Test the handler when OK button is clicked to save the card", function () {
      try {
        const expectedManifest = {
          "sap.app": {
            id: "objectCard",
            type: "card",
            title: "Card Title",
            applicationVersion: {
              version: "1.0.0"
            }
          },
          "sap.ui": {},
          "sap.card": {
            type: "Object",
            header: {
              title: "{sales_order_id}"
            },
            configuration: {
              parameters: {
                _entitySet: {
                  type: "string",
                  value: "SalesOrderManage"
                }
              }
            }
          },
          "sap.insights": {
            templateName: "ObjectPage",
            parentAppId: "sales.order.wd20",
            cardType: "LEAN_DT",
            versions: {
              ui5: "1.120.1-202405021611"
            }
          }
        };
        coreElementGetElementByIdSpy.mockImplementation(id => {
          if (id === "cardGeneratorDialog--cardPreview") {
            return {
              getManifest: jest.fn().mockReturnValue(expectedManifest)
            };
          }
        });
        return Promise.resolve(CardGeneratorDialogController.okPressed()).then(function () {
          const settings = jQueryAjaxSpy.mock.calls[0][0];
          expect(createAndStoreGeneratedi18nKeysMock).toHaveBeenCalledWith(expectedManifest);
          expect(JSON.parse(settings.data)).toMatchSnapshot();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    test("okPressed : should show success message on successful save", function () {
      try {
        const oCard = {
          getManifest: jest.fn().mockReturnValue({
            "sap.card": {
              configuration: {}
            }
          })
        };
        CoreElement.getElementById.mockReturnValue(oCard);
        MessageToast.show = jest.fn();
        jQueryAjaxSpy.mockImplementation(_ref2 => {
          let {
            success
          } = _ref2;
          success();
        });
        return Promise.resolve(CardGeneratorDialogController.okPressed()).then(function () {
          expect(MessageToast.show).toHaveBeenCalledTimes(1);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    test("okPressed : should show error message on failed save", function () {
      try {
        const oCard = {
          getManifest: jest.fn().mockReturnValue({
            "sap.card": {
              configuration: {}
            }
          })
        };
        const jqXHR = {
          status: 500,
          statusText: "Internal Server Error"
        };
        const textStatus = "error";
        const errorThrown = "Server Error";
        CoreElement.getElementById.mockReturnValue(oCard);
        jQueryAjaxSpy.mockImplementation(_ref3 => {
          let {
            error
          } = _ref3;
          error(jqXHR, textStatus, errorThrown);
        });
        Log.error = jest.fn();
        MessageBox.error = jest.fn();
        return Promise.resolve(CardGeneratorDialogController.okPressed()).then(function () {
          const errorMessage = `Unable to save the card: ${textStatus} - ${errorThrown} (Status: ${jqXHR.status} - ${jqXHR.statusText})`;
          expect(Log.error).toHaveBeenCalledWith(errorMessage);
          expect(MessageBox.error).toHaveBeenCalledTimes(1);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    test("onAddedActionTitleChange : Test the handler when added actions title property is changed to a valid action value", function () {
      try {
        const addedActions = [{
          title: "Reopen",
          titleKey: "C_SalesPlanTPReopen",
          style: "Positive",
          enablePathKey: "IsActiveEntity",
          isStyleControlEnabled: true
        }];
        oDialogModelData.configuration.actions.addedActions = addedActions;
        const oEvent = {
          getSource: jest.fn().mockReturnValue({
            getSelectedKey: jest.fn().mockReturnValue("C_SalesPlanTPRelease"),
            getValue: jest.fn().mockReturnValue("Release"),
            getBindingContext: jest.fn().mockReturnValue({
              getPath: jest.fn().mockReturnValue("/configuration/actions/addedActions/0")
            }),
            setValueState: setValueStateMock
          })
        };
        const expectedAddedAction = {
          title: "Release",
          titleKey: "C_SalesPlanTPRelease",
          style: "Positive",
          enablePathKey: "IsActiveEntity",
          isStyleControlEnabled: true
        };
        expect(oDialogModel.getProperty("/configuration/actions/addedActions")).toMatchSnapshot();
        return Promise.resolve(CardGeneratorDialogController.onAddedActionTitleChange(oEvent)).then(function () {
          expect(addActionToCardManifestMock).toHaveBeenCalledWith(expect.any(Object), expectedAddedAction, expect.any(Object));
          expect(setValueStateMock).toHaveBeenCalledWith(ValueState.None);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    test("onAddedActionTitleChange : Test the handler when added actions title property is changed to a Invalid action value", function () {
      try {
        const addedActions = [{
          title: "Reopen1",
          titleKey: "C_SalesPlanTPReopen1",
          style: "Positive",
          enablePathKey: "IsActiveEntity",
          isStyleControlEnabled: true
        }];
        oDialogModelData.configuration.actions.addedActions = addedActions;
        const setValueStateTextMock = jest.fn();
        const oEvent = {
          getSource: jest.fn().mockReturnValue({
            getSelectedKey: jest.fn().mockReturnValue("C_SalesPlanTPRelease1"),
            getValue: jest.fn().mockReturnValue("Release1"),
            getBindingContext: jest.fn().mockReturnValue({
              getPath: jest.fn().mockReturnValue("/configuration/actions/addedActions/0")
            }),
            setValueState: setValueStateMock,
            setValueStateText: setValueStateTextMock,
            focus: jest.fn()
          })
        };
        expect(oDialogModel.getProperty("/configuration/actions/addedActions")).toMatchSnapshot();
        return Promise.resolve(CardGeneratorDialogController.onAddedActionTitleChange(oEvent)).then(function () {
          expect(oDialogModel.getProperty("/configuration/actions/addedActions")).toMatchSnapshot();
          expect(setValueStateMock).toHaveBeenCalledWith(ValueState.Error);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    test("filterCardActions : Existing action should not be visible in the card action dropdown", () => {
      const addedActions = [{
        title: "Reopen",
        titleKey: "C_SalesPlanTPReopen",
        style: "Positive",
        enablePathKey: "IsActiveEntity",
        isStyleControlEnabled: true
      }];
      oDialogModelData.configuration.actions.addedActions = addedActions;
      const comboBox = new ComboBox({
        items: {
          path: "/configuration/actions/annotationActions",
          template: new Item({
            key: "{action}",
            text: "{label}"
          })
        }
      });
      comboBox.setModel(oDialogModel);
      expect(comboBox.getItems().length).toEqual(2);
      CardGeneratorDialogController.filterCardActions(comboBox);
      expect(comboBox.getItems().length).toEqual(1);
      expect(comboBox.getItems()[0].getProperty("text")).toEqual("Release");
      expect(comboBox.getItems()[0].getProperty("key")).toEqual("C_SalesPlanTPRelease");
    });
    test("loadActions : The card actions which are initially suspended, should load on calling the function loadActions", () => {
      const addedActions = [{
        title: "Reopen",
        titleKey: "C_SalesPlanTPReopen",
        style: "Positive",
        enablePathKey: "IsActiveEntity",
        isStyleControlEnabled: true
      }];
      oDialogModelData.configuration.actions.addedActions = addedActions;
      const comboBox = new ComboBox({
        items: {
          path: "/configuration/actions/annotationActions",
          template: new Item({
            key: "{action}",
            text: "{label}"
          }),
          suspended: true
        }
      });
      comboBox.setModel(oDialogModel);
      const event = {
        getSource: jest.fn().mockReturnValue(comboBox)
      };
      const itemsBinding = comboBox.getBinding("items");
      expect(comboBox.getItems().length).toEqual(0);
      expect(itemsBinding?.isSuspended()).toBe(true);
      CardGeneratorDialogController.loadActions(event);
      expect(itemsBinding?.isSuspended()).toBe(false);
      expect(comboBox.getItems().length).toEqual(2);
    });
  });
  describe("validateHeader", () => {
    let setPropertyMock;
    const oDialogModel = new JSONModel({
      configuration: {
        properties: [{
          name: "net_amount",
          type: "Edm.Int32"
        }],
        errorControls: [{
          getValue: function () {
            return "sdf";
          },
          getValueState: function () {
            return "Error";
          },
          setValueState: jest.fn()
        }]
      }
    });
    const getResourceBundleMock = jest.fn().mockReturnValue({
      getResourceBundle: jest.fn().mockReturnValue({
        getText: jest.fn().mockImplementation(key => {
          if (key === "GENERATOR_CARD_TITLE") return "Card Title";
          if (key === "GENERATOR_MAIN_INDICATOR") return "Main Indicator";
          if (key === "GENERIC_ERR_MSG") return "Error occurred for Main Indicator ";
        })
      })
    });
    const oDialog = {
      getModel: type => {
        if (type && type === "i18n") {
          return getResourceBundleMock();
        } else {
          return oDialogModel;
        }
      },
      open: jest.fn(),
      setModel: jest.fn()
    };
    beforeEach(() => {
      setPropertyMock = jest.fn();
      oDialogModel.setProperty = setPropertyMock;
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("returns true when controls has error state", () => {
      const expectedResult = CardGeneratorDialogController._validateHeader();
      expect(expectedResult).toBe(true);
    });
  });
  describe("validateControl", () => {
    let setPropertyMock;
    const oEventMock = {
      getSource: jest.fn().mockReturnValue({
        getSelectedKey: jest.fn(),
        setValueState: jest.fn(),
        setValueStateText: jest.fn()
      }),
      getParameter: jest.fn()
    };
    const oDialogModel = new JSONModel({
      configuration: {
        properties: [{
          name: "net_amount",
          type: "Edm.Int32"
        }],
        errorControls: [{
          name: "test",
          getId: function () {
            return "123";
          },
          setValueState: jest.fn()
        }]
      }
    });
    const getResourceBundleMock = jest.fn().mockReturnValue({
      getResourceBundle: jest.fn().mockReturnValue({
        getText: jest.fn().mockImplementation(key => {
          if (key === "GENERATOR_CARD_TITLE") return "Card Title";
          if (key === "GENERATOR_MAIN_INDICATOR") return "Main Indicator";
          if (key === "GENERIC_ERR_MSG") return "Error occurred for Main Indicator";
        })
      })
    });
    const oDialog = {
      getModel: type => {
        if (type && type === "i18n") {
          return getResourceBundleMock();
        } else {
          return oDialogModel;
        }
      },
      open: jest.fn(),
      close: jest.fn(),
      setModel: jest.fn()
    };
    beforeEach(() => {
      setPropertyMock = jest.fn();
      oDialogModel.setProperty = setPropertyMock;
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("should add control to errorControls and set value state and text if selected key is empty and value is not empty", () => {
      const setValueStateMock = jest.fn();
      const setValueStateTextMock = jest.fn();
      const control = {
        getSelectedKey: jest.fn().mockReturnValue(undefined),
        setValueState: setValueStateMock,
        setValueStateText: setValueStateTextMock,
        getId: jest.fn().mockReturnValue("123")
      };
      const oEvent = {
        ...oEventMock,
        getSource: jest.fn().mockReturnValue(control),
        getParameter: jest.fn().mockReturnValue("value")
      };
      CardGeneratorDialogController.validateContol(oEvent);
      expect(oDialogModel.getProperty("/configuration/errorControls").length).toEqual(2);
      expect(control.setValueState).toHaveBeenCalledWith(ValueState.Error);
      expect(control.setValueStateText).toHaveBeenCalledWith("Error occurred for Main Indicator");
    });
    test("should remove control from errorControls and set value state to None if selected key and value are not empty", () => {
      const setValueStateMock = jest.fn();
      const control = {
        getSelectedKey: jest.fn().mockReturnValue("key"),
        setValueState: setValueStateMock,
        getId: jest.fn().mockReturnValue("123")
      };
      const oEvent = {
        ...oEventMock,
        getSource: jest.fn().mockReturnValue(control),
        getParameter: jest.fn().mockReturnValue("value")
      };
      CardGeneratorDialogController.validateContol(oEvent, "stateIndicator");
      expect(oDialogModel.getProperty("/configuration/errorControls").length).toEqual(1);
      expect(control.setValueState).toHaveBeenCalledWith(ValueState.None);
    });
    test("should add control to errorControls and set value state text if selected key and value are empty and control name is title", () => {
      const setValueStateMock = jest.fn();
      const setValueStateTextMock = jest.fn();
      const control = {
        getSelectedKey: jest.fn().mockReturnValue(undefined),
        setValueState: setValueStateMock,
        setValueStateText: setValueStateTextMock,
        getId: jest.fn().mockReturnValue("123")
      };
      const oEvent = {
        ...oEventMock,
        getSource: jest.fn().mockReturnValue(control),
        getParameter: jest.fn().mockReturnValue(undefined)
      };
      CardGeneratorDialogController.validateContol(oEvent, "title");
      expect(oDialogModel.getProperty("/configuration/errorControls").length).toEqual(2);
      expect(control.setValueStateText).toHaveBeenCalledWith("Error occurred for Main Indicator");
    });
    test("cancelPressed- should close dialog and reset error controls", () => {
      CardGeneratorDialogController.cancelPressed();
      oDialog.getModel().getProperty("/configuration/errorControls").forEach(control => {
        expect(control.setValueState).toHaveBeenCalledWith("None");
      });
      expect(oDialogModel.getProperty("/configuration/errorControls").length).toEqual(2);
    });
  });
  describe("onDeleteClick", () => {
    const oDialogModel = new JSONModel({
      configuration: {
        properties: [{
          name: "net_amount",
          type: "Edm.Int32"
        }, {
          name: "gross_amount",
          type: "Edm.Int32"
        }, {
          name: "tax_amount",
          type: "Edm.Int32"
        }, {
          name: "bp_id",
          type: "Edm.Int32"
        }, {
          name: "so_id",
          type: "Edm.Int32"
        }],
        groups: [{
          title: "Group 1",
          items: [{
            label: "Gross Amount",
            value: "{gross_amount} {currency_code}",
            isEnabled: true,
            name: "gross_amount"
          }, {
            label: "Net Amount",
            value: "{net_amount} {currency_code}",
            isEnabled: true,
            name: "net_amount"
          }, {
            label: "Tax Amount",
            value: "{tax_amount} {currency_code}",
            isEnabled: true,
            name: "tax_amount"
          }, {
            label: "Business Partner ID",
            value: "{bp_id}",
            isEnabled: true,
            name: "bp_amount"
          }, {
            label: "Sales Order ID",
            value: "{so_id}",
            isEnabled: true,
            name: "so_id"
          }]
        }]
      }
    });
    const oDialog = {
      getModel: jest.fn().mockReturnValue(oDialogModel),
      setModel: jest.fn(),
      refresh: jest.fn()
    };
    beforeEach(() => {
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("should delete item & set enableAddMoreGroupItems to true if total items is less than the limit set. onAddClick should add a new item & set enableAddMoreGroupItems to false if total items is equal to limit set", () => {
      let oEvent = {
        getSource: jest.fn().mockReturnValue({
          getBindingContext: jest.fn().mockReturnValue({
            getPath: jest.fn().mockReturnValue("/configuration/groups/0/items/0")
          })
        })
      };
      CardGeneratorDialogController.onDeleteClick(oEvent);
      expect(oDialogModel.getProperty("/configuration/groups/0").items).toMatchSnapshot();
      expect(oDialogModel.getProperty("/configuration/groups/0/enableAddMoreGroupItems")).toBe(true);

      //should add the new item and set enableAddMoreGroupItems to false if the total items in the group is equal to the limit set
      oEvent = {
        getSource: jest.fn().mockReturnValue({
          getBindingContext: jest.fn().mockReturnValue({
            getPath: jest.fn().mockReturnValue("/configuration/groups/0")
          })
        })
      };
      CardGeneratorDialogController.onAddClick(oEvent);
      expect(oDialogModel.getProperty("/configuration/groups/0").items).toMatchSnapshot();
      expect(oDialogModel.getProperty("/configuration/groups/0/enableAddMoreGroupItems")).toBe(false);
    });
  });
  describe("onAddClick", () => {
    const oDialogModel = new JSONModel({
      configuration: {
        properties: [{
          name: "net_amount",
          type: "Edm.Int32"
        }, {
          name: "gross_amount",
          type: "Edm.Int32"
        }],
        groups: [{
          title: "Group 1",
          items: [{
            label: "Gross Amount",
            value: "{gross_amount} {currency_code}",
            isEnabled: true,
            name: "gross_amount"
          }, {
            label: "Net Amount",
            value: "{net_amount} {currency_code}",
            isEnabled: true,
            name: "net_amount"
          }]
        }]
      }
    });
    const oDialog = {
      getModel: jest.fn().mockReturnValue(oDialogModel),
      setModel: jest.fn(),
      refresh: jest.fn()
    };
    beforeEach(() => {
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("should add a new item and set enableAddMoreGroupItems to true if the total items in the group is less than the limit set", () => {
      const oEvent = {
        getSource: jest.fn().mockReturnValue({
          getBindingContext: jest.fn().mockReturnValue({
            getPath: jest.fn().mockReturnValue("/configuration/groups/0")
          })
        })
      };
      CardGeneratorDialogController.onAddClick(oEvent);
      expect(oDialogModel.getProperty("/configuration/groups/0").items).toMatchSnapshot();
      expect(oDialogModel.getProperty("/configuration/groups/0/enableAddMoreGroupItems")).toBe(true);
    });
  });
  describe("onGroupAddClick", () => {
    const oDialogModel = new JSONModel({
      configuration: {
        groups: [{
          title: "Group 1",
          items: [{
            label: "Gross Amount",
            value: "{gross_amount} {currency_code}",
            isEnabled: true,
            name: "gross_amount"
          }]
        }],
        groupLimitReached: false
      }
    });
    const getResourceBundleMock = jest.fn().mockReturnValue({
      getResourceBundle: jest.fn().mockReturnValue({
        getText: jest.fn().mockImplementation((key, value) => {
          if (key === "GENERATOR_DEFAULT_GROUP_NAME" && value[0] === 2) return "Group 2";
        })
      })
    });
    const oDialog = {
      getModel: type => {
        if (type && type === "i18n") {
          return getResourceBundleMock();
        } else {
          return oDialogModel;
        }
      },
      setModel: jest.fn(),
      refresh: jest.fn()
    };
    beforeEach(() => {
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("validate if transpileIntegrationCardToAdaptive function is called when adding groups", () => {
      CardGeneratorDialogController.onGroupAddClick({});
      expect(transpileIntegrationCardToAdaptive).toHaveBeenCalled();
      expect(oDialogModel.getProperty("/configuration/groups")).toMatchSnapshot();
      expect(oDialogModel.getProperty("/configuration/groupLimitReached")).toBe(false);
    });
  });
  describe("onGroupAddClick - when there are 4 groups and 5th group is being added, onGroupDeleteClick - when there are less than 5 groups", () => {
    const oDialogModel = new JSONModel({
      configuration: {
        groups: [{
          title: "Group 1",
          items: [{
            label: "Gross Amount",
            value: "{gross_amount} {currency_code}",
            isEnabled: true,
            name: "gross_amount"
          }]
        }, {
          title: "Group 2",
          items: [{
            label: "Gross Amount",
            value: "{gross_amount} {currency_code}",
            isEnabled: true,
            name: "gross_amount"
          }]
        }, {
          title: "Group 3",
          items: [{
            label: "Gross Amount",
            value: "{gross_amount} {currency_code}",
            isEnabled: true,
            name: "gross_amount"
          }]
        }, {
          title: "Group 4",
          items: [{
            label: "Gross Amount",
            value: "{gross_amount} {currency_code}",
            isEnabled: true,
            name: "gross_amount"
          }]
        }],
        groupLimitReached: false
      }
    });
    const getResourceBundleMock = jest.fn().mockReturnValue({
      getResourceBundle: jest.fn().mockReturnValue({
        getText: jest.fn().mockImplementation((key, value) => {
          if (key === "GENERATOR_DEFAULT_GROUP_NAME" && value[0] === 5) return "Group 5";
        })
      })
    });
    const oDialog = {
      getModel: type => {
        if (type && type === "i18n") {
          return getResourceBundleMock();
        } else {
          return oDialogModel;
        }
      },
      setModel: jest.fn(),
      refresh: jest.fn()
    };
    beforeEach(() => {
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("validate if groupLimitReached is set to true when no of groups is 5", () => {
      CardGeneratorDialogController.onGroupAddClick({});
      expect(transpileIntegrationCardToAdaptive).toHaveBeenCalled();
      expect(oDialogModel.getProperty("/configuration/groupLimitReached")).toBe(true);

      //validate if groupLimitReached is set to false when a group is deleted
      const oEvent = {
        getSource: jest.fn().mockReturnValue({
          getBindingContext: jest.fn().mockReturnValue({
            getPath: jest.fn().mockReturnValue("/configuration/groups/1")
          })
        })
      };
      CardGeneratorDialogController.onGroupDeleteClick(oEvent);
      expect(oDialogModel.getProperty("/configuration/groupLimitReached")).toBe(false);
    });
  });
  describe("onPropertySelection", () => {
    let setPropertyMock;
    let windowSpy;
    const oDialogModel = new JSONModel({
      configuration: {
        properties: [{
          name: "net_amount",
          type: "Edm.Int32"
        }],
        advancedFormattingOptions: {
          unitOfMeasures: [{
            name: "net_amount",
            value: "currency_code"
          }],
          textArrangements: [],
          propertyValueFormatters: []
        },
        groups: [{
          title: "Group 1",
          items: [{
            label: null,
            value: "{/items/0}",
            isEnabled: false,
            name: "net_amount"
          }]
        }],
        $data: {
          net_amount: 6942.0
        }
      }
    });
    const getResourceBundleMock = jest.fn().mockReturnValue({
      getResourceBundle: jest.fn().mockReturnValue({
        getText: jest.fn().mockImplementation(key => {
          if (key === "GENERATOR_MAIN_INDICATOR") return "Main Indicator";
          if (key === "GENERIC_ERR_MSG") return "Error occurred for Main Indicator";
        })
      })
    });
    const oDialog = {
      getModel: type => {
        if (type && type === "i18n") {
          return getResourceBundleMock();
        } else {
          return oDialogModel;
        }
      },
      open: jest.fn(),
      setModel: jest.fn(),
      close: jest.fn()
    };
    beforeAll(() => {
      ApplicationInfo.createInstance(rootComponent);
    });
    afterAll(() => {
      ApplicationInfo.getInstance()._resetInstance();
    });
    beforeEach(() => {
      setPropertyMock = jest.fn();
      windowSpy = jest.spyOn(window, "window", "get");
      windowSpy.mockImplementation(() => ({
        hasher: {
          getHash: () => "test-intent&/testEntity(12345)"
        }
      }));
      oDialogModel.setProperty = setPropertyMock;
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    afterEach(() => {
      windowSpy.mockRestore();
      jest.clearAllMocks();
    });
    test("it should update model properties correctly when selectedKey is not empty", function () {
      try {
        const setValueStateMock = jest.fn();
        const oEvent = {
          getSource: jest.fn().mockReturnValue({
            getSelectedKey: jest.fn().mockReturnValue("net_amount"),
            setValueState: setValueStateMock,
            getBindingContext: jest.fn().mockReturnValue({
              getPath: jest.fn().mockReturnValue("/configuration/groups/0/items/0")
            })
          }),
          getParameter: jest.fn().mockReturnValue({
            newValue: "net_amount"
          })
        };
        jest.spyOn(ODataUtils, "getPropertyLabel").mockReturnValue("Net Amount");
        return Promise.resolve(CardGeneratorDialogController.onPropertySelection(oEvent)).then(function () {
          let count = 1;
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/selectedNavigationalProperties", []);
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/selectedNavigationPropertiesContent", {
            name: "",
            value: []
          });
          expect(setPropertyMock).toHaveBeenNthCalledWith(count++, "/configuration/advancedFormattingOptions/sourceProperty", "net_amount");
          expect(setValueStateMock).toHaveBeenCalledWith(ValueState.None);
          expect(oDialogModel.getProperty("/configuration/groups/0").items).toMatchSnapshot();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    test("it should update model properties correctly when selectedKey is empty", function () {
      try {
        const setValueStateMock = jest.fn();
        const setValueStateTextMock = jest.fn();
        const oEvent = {
          getSource: jest.fn().mockReturnValue({
            getSelectedKey: jest.fn().mockReturnValue(""),
            setValueState: setValueStateMock,
            setValueStateText: setValueStateTextMock,
            getBindingContext: jest.fn().mockReturnValue({
              getPath: jest.fn().mockReturnValue("/configuration/groups/0/items/0")
            })
          }),
          getParameter: jest.fn().mockReturnValue({
            newValue: "test"
          })
        };
        jest.spyOn(ODataUtils, "getPropertyLabel").mockReturnValue("");
        return Promise.resolve(CardGeneratorDialogController.onPropertySelection(oEvent)).then(function () {
          expect(setPropertyMock).toHaveBeenNthCalledWith(1, "/configuration/selectedNavigationalProperties", []);
          expect(setPropertyMock).toHaveBeenNthCalledWith(2, "/configuration/selectedNavigationPropertiesContent", {
            name: "",
            value: []
          });
          expect(setPropertyMock).toHaveBeenNthCalledWith(3, "/configuration/advancedFormattingOptions/sourceProperty", "");
          expect(setValueStateMock).toHaveBeenCalledWith(ValueState.Error);
          expect(setValueStateTextMock).toHaveBeenCalledWith("Error occurred for Main Indicator");
          expect(oDialogModel.getProperty("/configuration/groups/0").items).toMatchSnapshot();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });
  describe("onPropertySelection with navigation", () => {
    let setPropertyMock;
    let windowSpy;
    const oDialogModel = new JSONModel({
      configuration: {
        properties: [{
          name: "net_amount",
          type: "Edm.Int32"
        }],
        advancedFormattingOptions: {
          unitOfMeasures: [{
            name: "net_amount",
            value: "currency_code"
          }],
          textArrangements: [],
          propertyValueFormatters: []
        },
        groups: [{
          title: "Group 1",
          items: [{
            label: null,
            value: "{/items/0}",
            isEnabled: false,
            isNavigationEnabled: false,
            name: "net_amount"
          }]
        }],
        navigationProperty: [{
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
        }],
        selectedNavigationPropertiesContent: {
          name: "to_BillingStatus",
          value: [{
            label: "Lower Value",
            type: "Edm.String",
            name: "Status"
          }, {
            label: "Confirmation",
            type: "Edm.String",
            name: "Status_Text"
          }]
        },
        $data: {
          net_amount: 6942.0
        }
      }
    });
    const getResourceBundleMock = jest.fn().mockReturnValue({
      getResourceBundle: jest.fn().mockReturnValue({
        getText: jest.fn().mockImplementation(key => {
          if (key === "GENERATOR_MAIN_INDICATOR") return "Main Indicator";
          if (key === "GENERIC_ERR_MSG") return "Error occurred for Main Indicator";
        })
      })
    });
    const oDialog = {
      getModel: type => {
        if (type && type === "i18n") {
          return getResourceBundleMock();
        } else {
          return oDialogModel;
        }
      },
      open: jest.fn(),
      setModel: jest.fn(),
      close: jest.fn()
    };
    const data = {
      node_key: "12345",
      IsActiveEntity: true,
      to_BillingStatus: {
        Status: "",
        Status_Text: "Initial",
        test: "123"
      }
    };
    beforeAll(() => {
      ApplicationInfo.createInstance(rootComponent);
    });
    afterAll(() => {
      ApplicationInfo.getInstance()._resetInstance();
    });
    beforeEach(() => {
      setPropertyMock = jest.fn();
      windowSpy = jest.spyOn(window, "window", "get");
      windowSpy.mockImplementation(() => ({
        hasher: {
          getHash: () => "test-intent&/testEntity(12345)"
        }
      }));
      oDialogModel.setProperty = setPropertyMock;
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    afterEach(() => {
      windowSpy.mockRestore();
      jest.clearAllMocks();
    });
    test("it should update model properties correctly when selectedKey is not empty", function () {
      try {
        const setValueStateMock = jest.fn();
        const oEvent = {
          getSource: jest.fn().mockReturnValue({
            getSelectedKey: jest.fn().mockReturnValue("to_BillingStatus"),
            setValueState: setValueStateMock,
            getBindingContext: jest.fn().mockReturnValue({
              getPath: jest.fn().mockReturnValue("/configuration/groups/0/items/0")
            })
          }),
          getParameter: jest.fn().mockReturnValue({
            newValue: "to_BillingStatus"
          })
        };
        jest.spyOn(ODataUtils, "getPropertyLabel").mockReturnValue("to_BillingStatus");
        jest.spyOn(ODataUtils, "fetchDataAsync").mockImplementation(() => Promise.resolve(data));
        return Promise.resolve(CardGeneratorDialogController.onPropertySelection(oEvent)).then(function () {
          expect(setPropertyMock).toHaveBeenNthCalledWith(1, "/configuration/selectedNavigationalProperties", [{
            name: "to_BillingStatus",
            value: [{
              label: "Lower Value",
              labelWithValue: "Lower Value (<empty>)",
              name: "Status",
              type: "Edm.String"
            }, {
              label: "Confirmation",
              labelWithValue: "Confirmation (Initial)",
              name: "Status_Text",
              type: "Edm.String"
            }]
          }]);
          expect(setPropertyMock).toHaveBeenNthCalledWith(2, "/configuration/selectedNavigationPropertiesContent", {
            name: "to_BillingStatus",
            value: [{
              label: "Lower Value",
              labelWithValue: "Lower Value (<empty>)",
              name: "Status",
              type: "Edm.String"
            }, {
              label: "Confirmation",
              labelWithValue: "Confirmation (Initial)",
              name: "Status_Text",
              type: "Edm.String"
            }]
          });
          expect(setValueStateMock).toHaveBeenCalledWith(ValueState.None);
          expect(oDialogModel.getProperty("/configuration/groups/0").items).toMatchSnapshot();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });
  describe("updateContentNavigationSelection for V2", () => {
    let setPropertyMock;
    const oDialogModel = new JSONModel({
      configuration: {
        properties: [{
          name: "net_amount",
          type: "Edm.Int32"
        }],
        advancedFormattingOptions: {
          unitOfMeasures: [{
            name: "net_amount",
            value: "currency_code"
          }],
          textArrangements: [],
          propertyValueFormatters: []
        },
        oDataV4: false,
        contentUrlPath: "C_STTA_SalesOrder_WD_20({{parameters.contextParameters}})",
        groups: [{
          title: "Group 1",
          items: [{
            isEnabled: false,
            isNavigationEnabled: true,
            label: "",
            name: "to_BillingStatus",
            navigationProperty: "Status_Text",
            value: "{to_BillingStatus/Status_Text}"
          }]
        }],
        selectedContentNavigation: [],
        selectedHeaderNavigation: []
      }
    });
    const oDialog = {
      getModel: jest.fn().mockReturnValue(oDialogModel),
      open: jest.fn(),
      setModel: jest.fn(),
      close: jest.fn()
    };
    beforeEach(() => {
      setPropertyMock = jest.fn();
      oDialogModel.setProperty = setPropertyMock;
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("it should update model properties correctly when selectedKey is not empty", () => {
      const setValueStateMock = jest.fn();
      const navProperty = {
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
      };
      const data = {
        node_key: "12345",
        IsActiveEntity: true,
        to_BillingStatus: {
          Status: "",
          Status_Text: "Initial",
          test: "123"
        }
      };
      const oEvent = {
        getSource: jest.fn().mockReturnValue({
          getSelectedKey: jest.fn().mockReturnValue("Status_Text"),
          setValueState: setValueStateMock,
          getBindingContext: jest.fn().mockReturnValue({
            getPath: jest.fn().mockReturnValue("/configuration/groups/0/items/0")
          })
        }),
        getParameter: jest.fn().mockReturnValue({
          newValue: "Status_Text"
        })
      };
      jest.spyOn(ODataUtils, "getPropertyLabel").mockReturnValue(navProperty);
      jest.spyOn(ODataUtils, "fetchDataAsync").mockImplementation(() => Promise.resolve(data));
      CardGeneratorDialogController.updateContentNavigationSelection(oEvent);
      expect(setPropertyMock).toHaveBeenNthCalledWith(1, "/configuration/selectedContentNavigation", [{
        name: "to_BillingStatus",
        value: ["Status_Text"]
      }]);
      expect(oDialogModel.getProperty("/configuration/groups/0").items).toMatchSnapshot();
    });
  });
  describe("updateContentNavigationSelection for V4", () => {
    let setPropertyMock;
    const oDialogModel = new JSONModel({
      configuration: {
        properties: [{
          name: "net_amount",
          type: "Edm.Int32"
        }],
        advancedFormattingOptions: {
          unitOfMeasures: [{
            name: "net_amount",
            value: "currency_code"
          }],
          textArrangements: [],
          propertyValueFormatters: []
        },
        oDataV4: true,
        contentUrlPath: "C_STTA_SalesOrder_WD_20({{parameters.contextParameters}})",
        groups: [{
          title: "Group 1",
          items: [{
            isEnabled: false,
            isNavigationEnabled: true,
            label: "",
            name: "to_BillingStatus",
            navigationProperty: "Status_Text",
            value: "{to_BillingStatus/Status_Text}"
          }]
        }],
        selectedContentNavigation: [],
        selectedHeaderNavigation: []
      }
    });
    const oDialog = {
      getModel: jest.fn().mockReturnValue(oDialogModel),
      open: jest.fn(),
      setModel: jest.fn(),
      close: jest.fn()
    };
    beforeEach(() => {
      setPropertyMock = jest.fn();
      oDialogModel.setProperty = setPropertyMock;
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("it should update model properties correctly when selectedKey is not empty", () => {
      const setValueStateMock = jest.fn();
      const navProperty = {
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
      };
      const data = {
        node_key: "12345",
        IsActiveEntity: true,
        to_BillingStatus: {
          Status: "",
          Status_Text: "Initial",
          test: "123"
        }
      };
      const oEvent = {
        getSource: jest.fn().mockReturnValue({
          getSelectedKey: jest.fn().mockReturnValue("Status_Text"),
          setValueState: setValueStateMock,
          getBindingContext: jest.fn().mockReturnValue({
            getPath: jest.fn().mockReturnValue("/configuration/groups/0/items/0")
          })
        }),
        getParameter: jest.fn().mockReturnValue({
          newValue: "Status_Text"
        })
      };
      jest.spyOn(ODataUtils, "getPropertyLabel").mockReturnValue(navProperty);
      jest.spyOn(ODataUtils, "fetchDataAsync").mockImplementation(() => Promise.resolve(data));
      CardGeneratorDialogController.updateContentNavigationSelection(oEvent);
      expect(setPropertyMock).toHaveBeenNthCalledWith(1, "/configuration/selectedContentNavigation", [{
        name: "to_BillingStatus",
        value: ["Status_Text"]
      }]);
      expect(oDialogModel.getProperty("/configuration/groups/0").items).toMatchSnapshot();
    });
  });
  describe("updateHeaderNavigationSelection for V2", () => {
    let setPropertyMock;
    const oDialogModel = new JSONModel({
      configuration: {
        properties: [{
          name: "net_amount",
          type: "Edm.Int32"
        }],
        advancedFormattingOptions: {
          unitOfMeasures: [{
            name: "net_amount",
            value: "currency_code"
          }],
          textArrangements: [],
          propertyValueFormatters: []
        },
        oDataV4: false,
        contentUrlPath: "C_STTA_SalesOrder_WD_20({{parameters.contextParameters}})",
        entityUrlPath: "C_STTA_SalesOrder_WD_20(node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true)",
        mainIndicatorStatusKey: "to_BillingStatus",
        selectedContentNavigation: [{
          name: "to_BillingStatus",
          value: ["Status_Text"]
        }],
        selectedHeaderNavigation: []
      }
    });
    const oDialog = {
      getModel: jest.fn().mockReturnValue(oDialogModel),
      open: jest.fn(),
      setModel: jest.fn(),
      close: jest.fn()
    };
    beforeEach(() => {
      setPropertyMock = jest.fn();
      oDialogModel.setProperty = setPropertyMock;
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("it should update model properties correctly when selectedKey is not empty", () => {
      const setValueStateMock = jest.fn();
      const navProperty = {
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
      };
      const data = {
        node_key: "12345",
        IsActiveEntity: true,
        to_BillingStatus: {
          Status: "",
          Status_Text: "Initial",
          test: "123"
        }
      };
      const oEvent = {
        getSource: jest.fn().mockReturnValue({
          getSelectedKey: jest.fn().mockReturnValue("Status_Text"),
          setValueState: setValueStateMock,
          getValue: jest.fn().mockReturnValue("Status_Text)")
        }),
        getParameter: jest.fn().mockReturnValue({
          newValue: "Status_Text"
        })
      };
      jest.spyOn(ODataUtils, "getPropertyLabel").mockReturnValue(navProperty);
      jest.spyOn(ODataUtils, "fetchDataAsync").mockImplementation(() => Promise.resolve(data));
      CardGeneratorDialogController.updateHeaderNavigationSelection(oEvent);
      expect(setPropertyMock).toHaveBeenNthCalledWith(1, "/configuration/selectedHeaderNavigation", [{
        name: "to_BillingStatus",
        value: ["Status_Text"]
      }]);
      expect(setPropertyMock).toHaveBeenNthCalledWith(2, "/configuration/navigationValue", "to_BillingStatus/Status_Text");
      expect(setPropertyMock).toHaveBeenNthCalledWith(3, "/configuration/mainIndicatorNavigationSelectedKey", "Status_Text");
      expect(setPropertyMock).toHaveBeenNthCalledWith(4, "/configuration/advancedFormattingOptions/sourceProperty", "Status_Text");
    });
  });
  describe("updateHeaderNavigationSelection for V4", () => {
    let setPropertyMock;
    const oDialogModel = new JSONModel({
      configuration: {
        properties: [{
          name: "net_amount",
          type: "Edm.Int32"
        }],
        advancedFormattingOptions: {
          unitOfMeasures: [{
            name: "net_amount",
            value: "currency_code"
          }],
          textArrangements: [],
          propertyValueFormatters: []
        },
        oDataV4: true,
        contentUrlPath: "C_STTA_SalesOrder_WD_20({{parameters.contextParameters}})",
        entityUrlPath: "C_STTA_SalesOrder_WD_20(node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true)",
        mainIndicatorStatusKey: "to_BillingStatus",
        selectedContentNavigation: [{
          name: "to_BillingStatus",
          value: ["Status_Text"]
        }],
        selectedHeaderNavigation: []
      }
    });
    const getResourceBundleMock = jest.fn().mockReturnValue({
      getResourceBundle: jest.fn().mockReturnValue({
        getText: jest.fn().mockImplementation(key => {
          if (key === "GENERATOR_MAIN_INDICATOR") return "Main Indicator";
          if (key === "GENERIC_ERR_MSG") return "Error occurred for Main Indicator";
        })
      })
    });
    const oDialog = {
      getModel: type => {
        if (type && type === "i18n") {
          return getResourceBundleMock();
        } else {
          return oDialogModel;
        }
      },
      open: jest.fn(),
      setModel: jest.fn(),
      close: jest.fn()
    };
    beforeEach(() => {
      setPropertyMock = jest.fn();
      oDialogModel.setProperty = setPropertyMock;
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("it should update model properties correctly when selectedKey is not empty", () => {
      const setValueStateMock = jest.fn();
      const navProperty = {
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
      };
      const data = {
        node_key: "12345",
        IsActiveEntity: true,
        to_BillingStatus: {
          Status: "",
          Status_Text: "Initial",
          test: "123"
        }
      };
      const oEvent = {
        getSource: jest.fn().mockReturnValue({
          getSelectedKey: jest.fn().mockReturnValue("Status_Text"),
          setValueState: setValueStateMock,
          getValue: jest.fn().mockReturnValue("Status_Text)")
        }),
        getParameter: jest.fn().mockReturnValue({
          newValue: "Status_Text"
        })
      };
      jest.spyOn(ODataUtils, "getPropertyLabel").mockReturnValue(navProperty);
      jest.spyOn(ODataUtils, "fetchDataAsync").mockImplementation(() => Promise.resolve(data));
      CardGeneratorDialogController.updateHeaderNavigationSelection(oEvent);
      expect(setPropertyMock).toHaveBeenNthCalledWith(1, "/configuration/selectedHeaderNavigation", [{
        name: "to_BillingStatus",
        value: ["Status_Text"]
      }]);
      expect(setPropertyMock).toHaveBeenNthCalledWith(2, "/configuration/navigationValue", "to_BillingStatus/Status_Text");
      expect(setPropertyMock).toHaveBeenNthCalledWith(3, "/configuration/mainIndicatorNavigationSelectedKey", "Status_Text");
      expect(setPropertyMock).toHaveBeenNthCalledWith(4, "/configuration/advancedFormattingOptions/sourceProperty", "Status_Text");
    });
  });
  describe("updateHeaderNavigationSelection for V2 if selectedHeaderNavigation present", () => {
    let setPropertyMock;
    const oDialogModel = new JSONModel({
      configuration: {
        properties: [{
          name: "net_amount",
          type: "Edm.Int32"
        }],
        advancedFormattingOptions: {
          unitOfMeasures: [{
            name: "net_amount",
            value: "currency_code"
          }],
          textArrangements: [],
          propertyValueFormatters: []
        },
        oDataV4: false,
        contentUrlPath: "C_STTA_SalesOrder_WD_20({{parameters.contextParameters}})",
        entityUrlPath: "C_STTA_SalesOrder_WD_20(node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true)",
        mainIndicatorStatusKey: "to_BillingStatus",
        selectedContentNavigation: [],
        selectedHeaderNavigation: [{
          name: "to_BillingStatus",
          value: ["Status_Text"]
        }]
      }
    });
    const oDialog = {
      getModel: jest.fn().mockReturnValue(oDialogModel),
      open: jest.fn(),
      setModel: jest.fn(),
      close: jest.fn()
    };
    beforeEach(() => {
      setPropertyMock = jest.fn();
      oDialogModel.setProperty = setPropertyMock;
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("it should update model properties correctly when selectedKey is not empty", () => {
      const setValueStateMock = jest.fn();
      const navProperty = {
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
      };
      const data = {
        node_key: "12345",
        IsActiveEntity: true,
        to_BillingStatus: {
          Status: "",
          Status_Text: "Initial",
          test: "123"
        }
      };
      const oEvent = {
        getSource: jest.fn().mockReturnValue({
          getSelectedKey: jest.fn().mockReturnValue("Status_Text"),
          setValueState: setValueStateMock,
          getValue: jest.fn().mockReturnValue("Status_Text)")
        }),
        getParameter: jest.fn().mockReturnValue({
          newValue: "Status_Text"
        })
      };
      jest.spyOn(ODataUtils, "getPropertyLabel").mockReturnValue(navProperty);
      jest.spyOn(ODataUtils, "fetchDataAsync").mockImplementation(() => Promise.resolve(data));
      CardGeneratorDialogController.updateHeaderNavigationSelection(oEvent);
      expect(setPropertyMock).toHaveBeenNthCalledWith(1, "/configuration/selectedHeaderNavigation", [{
        name: "to_BillingStatus",
        value: ["Status_Text"]
      }]);
      expect(setPropertyMock).toHaveBeenNthCalledWith(2, "/configuration/navigationValue", "to_BillingStatus/Status_Text");
      expect(setPropertyMock).toHaveBeenNthCalledWith(3, "/configuration/mainIndicatorNavigationSelectedKey", "Status_Text");
      expect(setPropertyMock).toHaveBeenNthCalledWith(4, "/configuration/advancedFormattingOptions/sourceProperty", "Status_Text");
    });
  });
  describe("updateHeaderNavigationSelection - when navigationValue is of date type.", () => {
    let setPropertyMock;
    let renderCardPreviewMock;
    const oDialogModel = new JSONModel({
      configuration: {
        properties: [{
          name: "net_amount",
          type: "Edm.Int32"
        }],
        advancedFormattingOptions: {
          unitOfMeasures: [{
            name: "net_amount",
            value: "currency_code"
          }],
          textArrangements: [],
          propertyValueFormatters: [{
            "formatterName": "format.dateTime",
            "displayName": "Date/Time",
            "parameters": [{
              "name": "options",
              "displayName": "Options",
              "type": "object",
              "defaultValue": "",
              "properties": [{
                "name": "relative",
                "displayName": "Relative",
                "type": "boolean",
                "defaultValue": false
              }, {
                "name": "UTC",
                "displayName": "UTC",
                "type": "boolean",
                "defaultValue": false,
                "selected": true
              }]
            }],
            "type": "Date",
            "visible": true,
            "property": "DraftAdministrativeData/ProcessingStartDateTime"
          }]
        },
        oDataV4: false,
        contentUrlPath: "C_STTA_SalesOrder_WD_20({{parameters.contextParameters}})",
        entityUrlPath: "C_STTA_SalesOrder_WD_20(node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true)",
        mainIndicatorStatusKey: "DraftAdministrativeData",
        selectedContentNavigation: [],
        selectedHeaderNavigation: [{
          name: "DraftAdministrativeData",
          value: ["ProcessingStartDateTime"]
        }],
        selectedNavigationPropertyHeader: {
          name: "DraftAdministrativeData",
          value: [{
            label: "Draft In Process Since",
            type: "Edm.DateTimeOffset",
            name: "ProcessingStartDateTime",
            labelWithValue: "Draft In Process Since (Dec 20, 2024, 8:51:30 PM)"
          }]
        },
        navigationValue: "DraftAdministrativeData/ProcessingStartDateTime"
      }
    });
    const oDialog = {
      getModel: jest.fn().mockReturnValue(oDialogModel),
      open: jest.fn(),
      setModel: jest.fn(),
      close: jest.fn()
    };
    beforeEach(() => {
      setPropertyMock = jest.fn();
      renderCardPreviewMock = renderCardPreview;
      oDialogModel.setProperty = setPropertyMock;
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("Validate card header to check formatting is applied correctly", () => {
      const setValueStateMock = jest.fn();
      const oEvent = {
        getSource: jest.fn().mockReturnValue({
          getSelectedKey: jest.fn().mockReturnValue("ProcessingStartDateTime"),
          setValueState: setValueStateMock,
          getValue: jest.fn().mockReturnValue("ProcessingStartDateTime")
        }),
        getParameter: jest.fn().mockReturnValue({
          newValue: "Draft In Process Since (Dec 20, 2024, 8:51:30 PM)"
        })
      };
      CardGeneratorDialogController.updateHeaderNavigationSelection(oEvent);
      const calledWithArgs = renderCardPreviewMock.mock.calls[0][0];
      expect(calledWithArgs["sap.card"].header.mainIndicator.number).toMatchSnapshot();
      expect(setPropertyMock).toHaveBeenNthCalledWith(1, "/configuration/selectedHeaderNavigation", [{
        name: "DraftAdministrativeData",
        value: ["ProcessingStartDateTime"]
      }]);
      expect(setPropertyMock).toHaveBeenNthCalledWith(2, "/configuration/navigationValue", "DraftAdministrativeData/ProcessingStartDateTime");
      expect(setPropertyMock).toHaveBeenNthCalledWith(3, "/configuration/mainIndicatorNavigationSelectedKey", "ProcessingStartDateTime");
      expect(setPropertyMock).toHaveBeenNthCalledWith(4, "/configuration/advancedFormattingOptions/sourceProperty", "ProcessingStartDateTime");
    });
  });
  describe("updateContentNavigationSelection for V2 if selectedContentNavigation is present", () => {
    let setPropertyMock;
    const oDialogModel = new JSONModel({
      configuration: {
        properties: [{
          name: "net_amount",
          type: "Edm.Int32"
        }],
        advancedFormattingOptions: {
          unitOfMeasures: [{
            name: "net_amount",
            value: "currency_code"
          }],
          textArrangements: [],
          propertyValueFormatters: []
        },
        groups: [{
          title: "Group 1",
          items: [{
            isEnabled: false,
            isNavigationEnabled: true,
            label: "",
            name: "to_BillingStatus",
            navigationProperty: "Status_Text",
            value: "{to_BillingStatus/Status_Text}"
          }]
        }],
        oDataV4: false,
        contentUrlPath: "C_STTA_SalesOrder_WD_20({{parameters.contextParameters}})",
        entityUrlPath: "C_STTA_SalesOrder_WD_20(node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true)",
        mainIndicatorStatusKey: "to_BillingStatus",
        selectedContentNavigation: [{
          name: "to_BillingStatus",
          value: ["Status_Text"]
        }],
        selectedHeaderNavigation: []
      }
    });
    const oDialog = {
      getModel: jest.fn().mockReturnValue(oDialogModel),
      open: jest.fn(),
      setModel: jest.fn(),
      close: jest.fn()
    };
    beforeEach(() => {
      setPropertyMock = jest.fn();
      oDialogModel.setProperty = setPropertyMock;
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("it should update model properties correctly when selectedKey is not empty", () => {
      const setValueStateMock = jest.fn();
      const navProperty = {
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
      };
      const data = {
        node_key: "12345",
        IsActiveEntity: true,
        to_BillingStatus: {
          Status: "",
          Status_Text: "Initial",
          test: "123"
        }
      };
      const oEvent = {
        getSource: jest.fn().mockReturnValue({
          getSelectedKey: jest.fn().mockReturnValue("Status_Text"),
          setValueState: setValueStateMock,
          getValue: jest.fn().mockReturnValue("Status_Text)"),
          getBindingContext: jest.fn().mockReturnValue({
            getPath: jest.fn().mockReturnValue("/configuration/groups/0/items/0")
          })
        }),
        getParameter: jest.fn().mockReturnValue({
          newValue: "Status_Text"
        })
      };
      jest.spyOn(ODataUtils, "getPropertyLabel").mockReturnValue(navProperty);
      jest.spyOn(ODataUtils, "fetchDataAsync").mockImplementation(() => Promise.resolve(data));
      CardGeneratorDialogController.updateContentNavigationSelection(oEvent);
      expect(setPropertyMock).toHaveBeenNthCalledWith(1, "/configuration/selectedContentNavigation", [{
        name: "to_BillingStatus",
        value: ["Status_Text"]
      }]);
      expect(oDialogModel.getProperty("/configuration/groups/0").items).toMatchSnapshot();
    });
  });
  describe("updateContentNavigationSelection - when selectedContentNavigation is present and is of type date.", () => {
    let setPropertyMock;
    const oDialogModel = new JSONModel({
      configuration: {
        properties: [{
          name: "net_amount",
          type: "Edm.Int32"
        }],
        advancedFormattingOptions: {
          unitOfMeasures: [{
            name: "net_amount",
            value: "currency_code"
          }],
          textArrangements: [],
          propertyValueFormatters: [{
            "formatterName": "format.dateTime",
            "displayName": "Date/Time",
            "parameters": [{
              "name": "options",
              "displayName": "Options",
              "type": "object",
              "defaultValue": "",
              "properties": [{
                "name": "relative",
                "displayName": "Relative",
                "type": "boolean",
                "defaultValue": false,
                "selected": false
              }, {
                "name": "UTC",
                "displayName": "UTC",
                "type": "boolean",
                "defaultValue": false,
                "selected": true
              }]
            }],
            "type": "Date",
            "visible": true,
            "property": "DraftAdministrativeData/ProcessingStartDateTime"
          }]
        },
        groups: [{
          title: "Group 1",
          items: [{
            isEnabled: false,
            isNavigationEnabled: true,
            label: "",
            name: "DraftAdministrativeData",
            navigationProperty: "ProcessingStartDateTime",
            value: "{DraftAdministrativeData/ProcessingStartDateTime}"
          }]
        }],
        oDataV4: false,
        contentUrlPath: "C_STTA_SalesOrder_WD_20({{parameters.contextParameters}})",
        entityUrlPath: "C_STTA_SalesOrder_WD_20(node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true)",
        mainIndicatorStatusKey: "to_BillingStatus",
        selectedContentNavigation: [{
          name: "DraftAdministrativeData",
          value: ["ProcessingStartDateTime"]
        }],
        selectedHeaderNavigation: []
      }
    });
    const oDialog = {
      getModel: jest.fn().mockReturnValue(oDialogModel),
      open: jest.fn(),
      setModel: jest.fn(),
      close: jest.fn()
    };
    beforeEach(() => {
      setPropertyMock = jest.fn();
      oDialogModel.setProperty = setPropertyMock;
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("Validate group item to check formatting is applied correctly", () => {
      const setValueStateMock = jest.fn();
      const navProperty = {
        name: "DraftAdministrativeData",
        properties: [{
          label: "Lower Value",
          type: "Edm.String",
          name: "Status"
        }, {
          label: "Confirmation",
          type: "Edm.DateTimeOffset",
          name: "ProcessingStartDateTime"
        }]
      };
      const data = {
        node_key: "12345",
        IsActiveEntity: true,
        DraftAdministrativeData: {
          Status: "",
          ProcessingStartDateTime: "Dec 20, 2024, 8:51:30 PM",
          test: "123"
        }
      };
      const oEvent = {
        getSource: jest.fn().mockReturnValue({
          getSelectedKey: jest.fn().mockReturnValue("ProcessingStartDateTime"),
          setValueState: setValueStateMock,
          getValue: jest.fn().mockReturnValue("ProcessingStartDateTime)"),
          getBindingContext: jest.fn().mockReturnValue({
            getPath: jest.fn().mockReturnValue("/configuration/groups/0/items/0")
          })
        }),
        getParameter: jest.fn().mockReturnValue({
          newValue: "ProcessingStartDateTime"
        })
      };
      jest.spyOn(ODataUtils, "getPropertyLabel").mockReturnValue(navProperty);
      jest.spyOn(ODataUtils, "fetchDataAsync").mockImplementation(() => Promise.resolve(data));
      CardGeneratorDialogController.updateContentNavigationSelection(oEvent);
      expect(setPropertyMock).toHaveBeenNthCalledWith(1, "/configuration/selectedContentNavigation", [{
        name: "DraftAdministrativeData",
        value: ["ProcessingStartDateTime"]
      }]);
      expect(oDialogModel.getProperty("/configuration/groups/0").items).toMatchSnapshot();
    });
  });
  describe("addLabelsForProperties function", () => {
    test("should add labels with values for properties", function () {
      try {
        const mockProperties = {
          name: "to_Currency",
          value: [{
            label: "Currency Code",
            type: "Edm.String",
            name: "Currency_Code"
          }, {
            label: "Long Text",
            type: "Edm.String",
            name: "Currency_Code_Text"
          }, {
            label: "Decimal Places",
            type: "Edm.Byte",
            name: "Decimals"
          }]
        };
        const mockData = {
          op_id_fc: 3,
          Delete_mc: true,
          Update_mc: true,
          node_key: "005056a7-004e-1ed8-b2e0-081387831f0d",
          so_id: "500000070",
          bp_id: "",
          currency_code: "USD",
          gross_amount: "101299.22",
          net_amount: "85125.40",
          tax_amount: "16173.82",
          lifecycle_status: "P",
          billing_status: "",
          delivery_status: "D",
          to_Currency: {
            Currency_Code: "USD",
            Currency_Code_Text: "United States Dollar",
            Decimals: 2
          }
        };
        CardGeneratorDialogController.addLabelsForProperties(mockProperties, mockData);
        expect(mockProperties).toMatchSnapshot();
        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    });
    test("should add labels with (<empty>) for properties with undefined or null data", () => {
      const mockProperties = {
        name: "name1",
        value: [{
          label: "Value 1",
          type: "Edm.String",
          name: "Value1"
        }, {
          label: "Value 2",
          type: "Edm.String",
          name: "Value2"
        }, {
          label: "Value 3",
          type: "Edm.Byte",
          name: "Value3"
        }]
      };
      const mockData = {
        name1: {
          value1: undefined,
          value2: null
        },
        name2: null
      };
      CardGeneratorDialogController.addLabelsForProperties(mockProperties, mockData);
      expect(mockProperties).toMatchSnapshot();
    });
  });
  describe("textArrangement- checkForNavigationProperty", () => {
    let setPropertyMock;
    let windowSpy;
    const oDialogModel = new JSONModel({
      configuration: {
        properties: [{
          name: "net_amount",
          type: "Edm.Int32"
        }],
        advancedFormattingOptions: {
          unitOfMeasures: [],
          textArrangements: [],
          propertyValueFormatters: []
        },
        trendOptions: {
          sourceProperty: ""
        },
        indicatorsValue: {},
        selectedIndicatorOptions: [],
        mainIndicatorStatusKey: "to_BillingStatus",
        navigationProperty: [{
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
        }],
        selectedNavigationProperties: {
          name: "to_BillingStatus",
          value: [{
            label: "Lower Value",
            type: "Edm.String",
            name: "Status"
          }, {
            label: "Confirmation",
            type: "Edm.String",
            name: "Status_Text"
          }]
        },
        $data: {
          net_amount: 100
        }
      }
    });
    const oDialog = {
      getModel: jest.fn().mockReturnValue(oDialogModel),
      open: jest.fn(),
      setModel: jest.fn(),
      close: jest.fn()
    };
    beforeAll(() => {
      ApplicationInfo.createInstance(rootComponent);
    });
    afterAll(() => {
      ApplicationInfo.getInstance()._resetInstance();
    });
    beforeEach(() => {
      setPropertyMock = jest.fn();
      windowSpy = jest.spyOn(window, "window", "get");
      windowSpy.mockImplementation(() => ({
        hasher: {
          getHash: () => "test-intent&/testEntity(12345)"
        }
      }));
      oDialogModel.setProperty = setPropertyMock;
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    afterEach(() => {
      windowSpy.mockRestore();
      jest.clearAllMocks();
    });
    test("checkForNavigationProperty with no mathing arrangement property textArrangementChanged as false", function () {
      try {
        const oEvent = {
          getParameters: jest.fn().mockReturnValue({
            selectedItem: {
              propertyKeyForId: "overall_status",
              name: "overall_status",
              propertyKeyForDescription: "to_LifecycleStatus",
              value: "to_LifecycleStatus",
              navigationalPropertiesForDescription: [{
                label: "Lower Value",
                type: "Edm.String",
                name: "Status",
                labelWithValue: "Lower Value (D)"
              }, {
                label: "Delivery Status",
                type: "Edm.String",
                name: "Status_Text",
                labelWithValue: "Delivery Status (Delivered)"
              }],
              navigationalPropertiesForId: [],
              isNavigationForId: false,
              isNavigationForDescription: true,
              navigationKeyForDescription: "Status_Text",
              arrangementType: "TextLast",
              textArrangement: "TextLast"
            },
            textArrangementChanged: false
          })
        };
        const data = {
          node_key: "12345",
          IsActiveEntity: true,
          to_BillingStatus: {
            Status: "",
            Status_Text: "Initial",
            test: "123"
          }
        };
        jest.spyOn(ODataUtils, "fetchDataAsync").mockImplementation(() => Promise.resolve(data));
        return Promise.resolve(CardGeneratorDialogController.checkForNavigationProperty(oEvent)).then(function () {
          expect(setPropertyMock).toHaveBeenNthCalledWith(1, "/configuration/selectedNavigationalProperties", []);
          const expected = oEvent.getParameters().selectedItem.isNavigationForDescription;
          expect(expected).toMatchSnapshot();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    test("checkForNavigationProperty with matching arrangement property having textArrangementChanged as false", function () {
      try {
        const oEvent = {
          getParameters: jest.fn().mockReturnValue({
            selectedItem: {
              propertyKeyForId: "Language",
              name: "Language",
              propertyKeyForDescription: "to_BillingStatus",
              value: "to_BillingStatus",
              navigationalPropertiesForDescription: [{
                label: "Currency Code",
                type: "Edm.String",
                name: "Currency_Code",
                labelWithValue: "Currency Code (USD)"
              }, {
                label: "Long Text",
                type: "Edm.String",
                name: "Currency_Code_Text",
                labelWithValue: "Long Text (United States Dollar)"
              }, {
                label: "Decimal Places",
                type: "Edm.Byte",
                name: "Decimals",
                labelWithValue: "Decimal Places (2)"
              }],
              navigationalPropertiesForId: [],
              isNavigationForId: false,
              isNavigationForDescription: false,
              navigationKeyForDescription: "Currency_Code_Text",
              arrangementType: "TextLast",
              textArrangement: "TextLast"
            },
            textArrangementChanged: false
          })
        };
        const data = {
          node_key: "12345",
          IsActiveEntity: true,
          to_BillingStatus: {
            Status: "",
            Status_Text: "Initial",
            test: "123"
          }
        };
        jest.spyOn(ODataUtils, "fetchDataAsync").mockImplementation(() => Promise.resolve(data));
        return Promise.resolve(CardGeneratorDialogController.checkForNavigationProperty(oEvent)).then(function () {
          expect(setPropertyMock).toHaveBeenNthCalledWith(1, "/configuration/selectedNavigationalProperties", [{
            name: "to_BillingStatus",
            value: [{
              label: "Lower Value",
              labelWithValue: "Lower Value (<empty>)",
              name: "Status",
              type: "Edm.String"
            }, {
              label: "Confirmation",
              labelWithValue: "Confirmation (Initial)",
              name: "Status_Text",
              type: "Edm.String"
            }]
          }]);
          expect(setPropertyMock).toHaveBeenNthCalledWith(2, "/configuration/$data", {
            net_amount: 100,
            to_BillingStatus: {
              Status: "",
              Status_Text: "Initial",
              test: "123"
            }
          });
          const expectedIsNavigationForDescription = oEvent.getParameters().selectedItem.isNavigationForDescription;
          const expectedNavigationalPropertiesForDescription = oEvent.getParameters().selectedItem.navigationalPropertiesForDescription;
          expect(expectedIsNavigationForDescription).toMatchSnapshot();
          expect(expectedNavigationalPropertiesForDescription).toMatchSnapshot();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    test("checkForNavigationProperty with no mathing arrangement property textArrangementChanged as true", function () {
      try {
        const oEvent = {
          getParameters: jest.fn().mockReturnValue({
            selectedItem: {
              propertyKeyForId: "to_LifecycleStatus",
              name: "to_LifecycleStatus",
              value: "to_LifecycleStatus",
              navigationalPropertiesForId: [{
                label: "Lower Value",
                type: "Edm.String",
                name: "Status",
                labelWithValue: "Lower Value (N)"
              }, {
                label: "Lifecycle Status",
                type: "Edm.String",
                name: "Status_Text",
                labelWithValue: "Lifecycle Status (New)"
              }],
              isNavigationForId: false,
              navigationKeyForId: ""
            },
            textArrangementChanged: true
          })
        };
        const data = {
          node_key: "12345",
          IsActiveEntity: true,
          to_BillingStatus: {
            Status: "",
            Status_Text: "Initial",
            test: "123"
          }
        };
        jest.spyOn(ODataUtils, "fetchDataAsync").mockImplementation(() => Promise.resolve(data));
        return Promise.resolve(CardGeneratorDialogController.checkForNavigationProperty(oEvent)).then(function () {
          expect(setPropertyMock).toHaveBeenNthCalledWith(1, "/configuration/selectedNavigationalProperties", []);
          const expected = oEvent.getParameters().selectedItem.isNavigationForId;
          expect(expected).toMatchSnapshot();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    test("checkForNavigationProperty with matching arrangement property having textArrangementChanged as true", function () {
      try {
        const oEvent = {
          getParameters: jest.fn().mockReturnValue({
            selectedItem: {
              propertyKeyForId: "to_BillingStatus",
              name: "to_BillingStatus",
              value: "to_BillingStatus",
              navigationalPropertiesForId: [{
                label: "Currency Code",
                type: "Edm.String",
                name: "Currency_Code",
                labelWithValue: "Currency Code (USD)"
              }, {
                label: "Long Text",
                type: "Edm.String",
                name: "Currency_Code_Text",
                labelWithValue: "Long Text (United States Dollar)"
              }],
              isNavigationForId: false,
              navigationKeyForId: ""
            },
            textArrangementChanged: true
          })
        };
        const data = {
          node_key: "12345",
          IsActiveEntity: true,
          to_BillingStatus: {
            Status: "",
            Status_Text: "Initial",
            test: "123"
          }
        };
        jest.spyOn(ODataUtils, "fetchDataAsync").mockImplementation(() => Promise.resolve(data));
        return Promise.resolve(CardGeneratorDialogController.checkForNavigationProperty(oEvent)).then(function () {
          expect(setPropertyMock).toHaveBeenNthCalledWith(1, "/configuration/selectedNavigationalProperties", [{
            name: "to_BillingStatus",
            value: [{
              label: "Lower Value",
              labelWithValue: "Lower Value (<empty>)",
              name: "Status",
              type: "Edm.String"
            }, {
              label: "Confirmation",
              labelWithValue: "Confirmation (Initial)",
              name: "Status_Text",
              type: "Edm.String"
            }]
          }]);
          expect(setPropertyMock).toHaveBeenNthCalledWith(2, "/configuration/$data", {
            net_amount: 100,
            to_BillingStatus: {
              Status: "",
              Status_Text: "Initial",
              test: "123"
            }
          });
          const expectedIsNavigationForId = oEvent.getParameters().selectedItem.isNavigationForId;
          const expectedNavigationalPropertiesForId = oEvent.getParameters().selectedItem.navigationalPropertiesForId;
          expect(expectedIsNavigationForId).toMatchSnapshot();
          expect(expectedNavigationalPropertiesForId).toMatchSnapshot();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });
  describe("disableOrEnableUOMAndTrend", () => {
    const oDialogModel = new JSONModel({
      configuration: {
        advancedFormattingOptions: {
          sourceProperty: "net_amount",
          isUoMEnabled: false
        },
        properties: [{
          name: "net_amount",
          type: "Edm.Decimal",
          label: "Net Amount",
          labelWithValue: "Net Amount (43556.00)"
        }, {
          name: "is_active",
          type: "Edm.Boolean",
          label: "Dyn. Action Control",
          labelWithValue: "Dyn. Action Control (true)"
        }, {
          name: "node_key",
          type: "Edm.Guid",
          label: "Node Key",
          labelWithValue: "Node Key (fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a)"
        }, {
          name: "bp_id",
          type: "Edm.String",
          label: "Business Process ID",
          labelWithValue: "Business Process ID (123456)"
        }, {
          name: "overall_status",
          type: "Edm.String",
          label: "Overall Status",
          labelWithValue: "Overall Status (N473M2)"
        }, {
          name: "op_id_fc",
          type: "Edm.Byte",
          label: "Dyn. Field Control",
          labelWithValue: "Dyn. Field Control (3)"
        }, {
          label: "Created At",
          type: "Edm.DateTimeOffset",
          name: "created_at",
          labelWithValue: "Created At (Oct 2, 2018, 3:30:00 AM)"
        }],
        $data: {
          net_amount: "43556.00",
          is_active: true,
          node_key: "fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a",
          bp_id: "473278",
          overall_status: "N473M2",
          op_id_fc: 3,
          created_at: "2018-10-01T22:00:00.000Z"
        }
      }
    });
    const oDialog = {
      getModel: () => {
        return oDialogModel;
      },
      open: jest.fn(),
      setModel: jest.fn(),
      close: jest.fn()
    };
    beforeEach(() => {
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    test("should enable UoM when the selected property type is Edm.Decimal", () => {
      const selectedProperty = "net_amount";
      CardGeneratorDialogController.disableOrEnableUOMAndTrend(oDialogModel, selectedProperty);
      expect(oDialogModel.getProperty("/configuration/advancedFormattingOptions/isUoMEnabled")).toBe(true);
      expect(oDialogModel.getProperty("/configuration/advancedFormattingOptions/isTrendEnabled")).toBe(true);
    });
    test("should disable UoM when the selected property type is Edm.Boolean", () => {
      const selectedProperty = "is_active";
      CardGeneratorDialogController.disableOrEnableUOMAndTrend(oDialogModel, selectedProperty);
      expect(oDialogModel.getProperty("/configuration/advancedFormattingOptions/isUoMEnabled")).toBe(false);
      expect(oDialogModel.getProperty("/configuration/advancedFormattingOptions/isTrendEnabled")).toBe(false);
    });
    test("should disable UoM when the selected property type is Edm.Guid", () => {
      const selectedProperty = "node_key";
      CardGeneratorDialogController.disableOrEnableUOMAndTrend(oDialogModel, selectedProperty);
      expect(oDialogModel.getProperty("/configuration/advancedFormattingOptions/isUoMEnabled")).toBe(false);
      expect(oDialogModel.getProperty("/configuration/advancedFormattingOptions/isTrendEnabled")).toBe(false);
    });
    test("should disable UoM when the selected property type is Edm.DateTimeOffset", () => {
      const selectedProperty = "created_at";
      CardGeneratorDialogController.disableOrEnableUOMAndTrend(oDialogModel, selectedProperty);
      expect(oDialogModel.getProperty("/configuration/advancedFormattingOptions/isUoMEnabled")).toBe(false);
      expect(oDialogModel.getProperty("/configuration/advancedFormattingOptions/isTrendEnabled")).toBe(false);
    });
    test("should enable UoM when the selected property type is Edm.String having numeric value", () => {
      const selectedProperty = "bp_id";
      CardGeneratorDialogController.disableOrEnableUOMAndTrend(oDialogModel, selectedProperty);
      expect(oDialogModel.getProperty("/configuration/advancedFormattingOptions/isUoMEnabled")).toBe(true);
      expect(oDialogModel.getProperty("/configuration/advancedFormattingOptions/isTrendEnabled")).toBe(false);
    });
    test("should enable UoM when the selected property type is Edm.String with non numeric value", () => {
      const selectedProperty = "overall_status";
      CardGeneratorDialogController.disableOrEnableUOMAndTrend(oDialogModel, selectedProperty);
      expect(oDialogModel.getProperty("/configuration/advancedFormattingOptions/isUoMEnabled")).toBe(false);
      expect(oDialogModel.getProperty("/configuration/advancedFormattingOptions/isTrendEnabled")).toBe(false);
    });
    test("should enable UoM when the selected property type is Edm.Byte", () => {
      const selectedProperty = "op_id_fc";
      CardGeneratorDialogController.disableOrEnableUOMAndTrend(oDialogModel, selectedProperty);
      expect(oDialogModel.getProperty("/configuration/advancedFormattingOptions/isUoMEnabled")).toBe(true);
      expect(oDialogModel.getProperty("/configuration/advancedFormattingOptions/isTrendEnabled")).toBe(false);
    });
  });
  describe("onDrop when source and target group has 5 items each ", () => {
    const oDialogModel = new JSONModel({
      configuration: {
        groups: [{
          title: "Group 1",
          items: [{
            name: "to_BillingStatus",
            value: "{to_BillingStatus}"
          }, {
            name: "to_BillingStatus",
            value: "{to_BillingStatus}"
          }, {
            name: "to_BillingStatus",
            value: "{to_BillingStatus}"
          }, {
            name: "to_BillingStatus",
            value: "{to_BillingStatus}"
          }, {
            name: "to_BillingStatus",
            value: "{to_BillingStatus}"
          }],
          enableAddMoreGroupItems: false
        }, {
          title: "Group 2",
          items: [{
            name: "to_BillingStatus",
            value: "{to_BillingStatus}"
          }, {
            name: "to_BillingStatus",
            value: "{to_BillingStatus}"
          }, {
            name: "to_BillingStatus",
            value: "{to_BillingStatus}"
          }, {
            name: "to_BillingStatus",
            value: "{to_BillingStatus}"
          }, {
            name: "to_BillingStatus",
            value: "{to_BillingStatus}"
          }],
          enableAddMoreGroupItems: false
        }]
      }
    });
    const oDialog = {
      getModel: () => {
        return oDialogModel;
      },
      open: jest.fn(),
      setModel: jest.fn(),
      close: jest.fn()
    };
    beforeEach(() => {
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("validate item is not added", () => {
      const oEvent = {
        getParameter: jest.fn().mockImplementation(key => {
          if (key === "draggedControl") {
            return {
              getParent: jest.fn().mockReturnValue({
                getBindingContext: jest.fn().mockReturnValue({
                  getPath: jest.fn().mockReturnValue("/configuration/groups/0")
                }),
                indexOfItem: jest.fn().mockReturnValue(0)
              })
            };
          }
          if (key === "droppedControl") {
            return {
              getParent: jest.fn().mockReturnValue({
                getBindingContext: jest.fn().mockReturnValue({
                  getPath: jest.fn().mockReturnValue("/configuration/groups/1")
                }),
                indexOfItem: jest.fn().mockReturnValue(3)
              })
            };
          }
          if (key === "dropPosition") {
            return "After";
          }
        })
      };
      CardGeneratorDialogController.onDrop(oEvent);
      expect(oDialogModel.getProperty("/configuration/groups/1/enableAddMoreGroupItems")).toBe(false);
      expect(oDialogModel.getProperty("/configuration/groups/0/items").length).toEqual(5);
      expect(oDialogModel.getProperty("/configuration/groups/1/items").length).toEqual(5);
      expect(oDialogModel.getProperty("/configuration/groups/0/items")).toMatchSnapshot();
      expect(oDialogModel.getProperty("/configuration/groups/1/items")).toMatchSnapshot();
    });
  });
  describe("onDrop when source group has 3 items and target group has 5 items", () => {
    const oDialogModel = new JSONModel({
      configuration: {
        groups: [{
          title: "Group 1",
          items: [{
            name: "to_BillingStatus",
            value: "{to_BillingStatus}"
          }, {
            name: "to_BillingStatus",
            value: "{to_BillingStatus}"
          }, {
            name: "to_BillingStatus",
            value: "{to_BillingStatus}"
          }],
          enableAddMoreGroupItems: true
        }, {
          title: "Group 2",
          items: [{
            name: "to_BillingStatus",
            value: "{to_BillingStatus}"
          }, {
            name: "to_BillingStatus",
            value: "{to_BillingStatus}"
          }, {
            name: "to_BillingStatus",
            value: "{to_BillingStatus}"
          }, {
            name: "to_BillingStatus",
            value: "{to_BillingStatus}"
          }, {
            name: "to_BillingStatus",
            value: "{to_BillingStatus}"
          }],
          enableAddMoreGroupItems: false
        }]
      }
    });
    const oDialog = {
      getModel: () => {
        return oDialogModel;
      },
      open: jest.fn(),
      setModel: jest.fn(),
      close: jest.fn()
    };
    beforeEach(() => {
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("validate if item is not added to the target group", () => {
      const oEvent = {
        getParameter: jest.fn().mockImplementation(key => {
          if (key === "draggedControl") {
            return {
              getParent: jest.fn().mockReturnValue({
                getBindingContext: jest.fn().mockReturnValue({
                  getPath: jest.fn().mockReturnValue("/configuration/groups/0")
                }),
                indexOfItem: jest.fn().mockReturnValue(1)
              })
            };
          }
          if (key === "droppedControl") {
            return {
              getParent: jest.fn().mockReturnValue({
                getBindingContext: jest.fn().mockReturnValue({
                  getPath: jest.fn().mockReturnValue("/configuration/groups/1")
                }),
                indexOfItem: jest.fn().mockReturnValue(3)
              })
            };
          }
          if (key === "dropPosition") {
            return "Before";
          }
        })
      };
      CardGeneratorDialogController.onDrop(oEvent);
      expect(oDialogModel.getProperty("/configuration/groups/1/enableAddMoreGroupItems")).toBe(false);
      expect(oDialogModel.getProperty("/configuration/groups/0/items").length).toEqual(3);
      expect(oDialogModel.getProperty("/configuration/groups/1/items").length).toEqual(5);
      expect(oDialogModel.getProperty("/configuration/groups/0/items")).toMatchSnapshot();
      expect(oDialogModel.getProperty("/configuration/groups/1/items")).toMatchSnapshot();
    });
  });
  describe("onDrop when source has 5 items and target group has 4 items ", () => {
    const oDialogModel = new JSONModel({
      configuration: {
        groups: [{
          title: "Group 1",
          items: [{
            name: "to_BillingStatus",
            value: "{to_BillingStatus_0}"
          }, {
            name: "to_BillingStatus",
            value: "{to_BillingStatus_1}"
          }, {
            name: "to_BillingStatus",
            value: "{to_BillingStatus_2}"
          }, {
            name: "to_BillingStatus",
            value: "{to_BillingStatus_3}"
          }, {
            name: "to_BillingStatus",
            value: "{to_BillingStatus_4}"
          }],
          enableAddMoreGroupItems: false
        }, {
          title: "Group 2",
          items: [{
            name: "to_BillingStatus",
            value: "{to_BillingStatus_0}"
          }, {
            name: "to_BillingStatus",
            value: "{to_BillingStatus_1}"
          }, {
            name: "to_BillingStatus",
            value: "{to_BillingStatus_2}"
          }, {
            name: "to_BillingStatus",
            value: "{to_BillingStatus_3}"
          }],
          enableAddMoreGroupItems: true
        }]
      }
    });
    const oDialog = {
      getModel: () => {
        return oDialogModel;
      },
      open: jest.fn(),
      setModel: jest.fn(),
      close: jest.fn()
    };
    beforeEach(() => {
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("validate if item is added from the source group to the target group, when dropPosition is Before", () => {
      let oEvent = {
        getParameter: jest.fn().mockImplementation(key => {
          if (key === "draggedControl") {
            return {
              getParent: jest.fn().mockReturnValue({
                getBindingContext: jest.fn().mockReturnValue({
                  getPath: jest.fn().mockReturnValue("/configuration/groups/0")
                }),
                indexOfItem: jest.fn().mockReturnValue(0)
              })
            };
          }
          if (key === "droppedControl") {
            return {
              getParent: jest.fn().mockReturnValue({
                getBindingContext: jest.fn().mockReturnValue({
                  getPath: jest.fn().mockReturnValue("/configuration/groups/1")
                }),
                indexOfItem: jest.fn().mockReturnValue(3)
              })
            };
          }
          if (key === "dropPosition") {
            return "Before";
          }
        })
      };
      CardGeneratorDialogController.onDrop(oEvent);
      expect(oDialogModel.getProperty("/configuration/groups/0/enableAddMoreGroupItems")).toBe(true);
      expect(oDialogModel.getProperty("/configuration/groups/1/enableAddMoreGroupItems")).toBe(false);
      expect(oDialogModel.getProperty("/configuration/groups/0/items").length).toEqual(4);
      expect(oDialogModel.getProperty("/configuration/groups/1/items").length).toEqual(5);
      expect(oDialogModel.getProperty("/configuration/groups/0/items")).toMatchSnapshot();
      expect(oDialogModel.getProperty("/configuration/groups/1/items")).toMatchSnapshot();
    });
  });
  describe("onDrop when source has 4 items and target group has 4 items ", () => {
    const oDialogModel = new JSONModel({
      configuration: {
        groups: [{
          title: "Group 1",
          items: [{
            name: "to_BillingStatus",
            value: "{to_BillingStatus_0}"
          }, {
            name: "to_BillingStatus",
            value: "{to_BillingStatus_1}"
          }, {
            name: "to_BillingStatus",
            value: "{to_BillingStatus_2}"
          }, {
            name: "to_BillingStatus",
            value: "{to_BillingStatus_3}"
          }],
          enableAddMoreGroupItems: true
        }, {
          title: "Group 2",
          items: [{
            name: "to_BillingStatus",
            value: "{to_BillingStatus_0}"
          }, {
            name: "to_BillingStatus",
            value: "{to_BillingStatus_1}"
          }, {
            name: "to_BillingStatus",
            value: "{to_BillingStatus_2}"
          }, {
            name: "to_BillingStatus",
            value: "{to_BillingStatus_3}"
          }],
          enableAddMoreGroupItems: true
        }]
      }
    });
    const oDialog = {
      getModel: () => {
        return oDialogModel;
      },
      open: jest.fn(),
      setModel: jest.fn(),
      close: jest.fn()
    };
    beforeEach(() => {
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("validate if item is added from the source group to the target group, when dropPosition is After", () => {
      const oEvent = {
        getParameter: jest.fn().mockImplementation(key => {
          if (key === "draggedControl") {
            return {
              getParent: jest.fn().mockReturnValue({
                getBindingContext: jest.fn().mockReturnValue({
                  getPath: jest.fn().mockReturnValue("/configuration/groups/0")
                }),
                indexOfItem: jest.fn().mockReturnValue(0)
              })
            };
          }
          if (key === "droppedControl") {
            return {
              getParent: jest.fn().mockReturnValue({
                getBindingContext: jest.fn().mockReturnValue({
                  getPath: jest.fn().mockReturnValue("/configuration/groups/1")
                }),
                indexOfItem: jest.fn().mockReturnValue(3)
              })
            };
          }
          if (key === "dropPosition") {
            return "After";
          }
        })
      };
      CardGeneratorDialogController.onDrop(oEvent);
      expect(oDialogModel.getProperty("/configuration/groups/0/enableAddMoreGroupItems")).toBe(true);
      expect(oDialogModel.getProperty("/configuration/groups/1/enableAddMoreGroupItems")).toBe(false);
      expect(oDialogModel.getProperty("/configuration/groups/0/items").length).toEqual(3);
      expect(oDialogModel.getProperty("/configuration/groups/1/items").length).toEqual(5);
      expect(oDialogModel.getProperty("/configuration/groups/0/items")).toMatchSnapshot();
      expect(oDialogModel.getProperty("/configuration/groups/1/items")).toMatchSnapshot();
    });
  });
  describe("getCriticality", () => {
    const oDialogModel = new JSONModel({
      configuration: {
        mainIndicatorOptions: {
          criticality: [{
            name: "net_amount",
            criticality: "Neutral"
          }]
        },
        advancedFormattingOptions: {
          sourceCriticalityProperty: [{
            activeCalculation: false,
            criticality: "",
            name: "net_amount"
          }]
        }
      }
    });
    const oDialog = {
      getModel: () => {
        return oDialogModel;
      },
      open: jest.fn(),
      setModel: jest.fn(),
      close: jest.fn()
    };
    beforeEach(() => {
      CardGeneratorDialogController.initialize(rootComponent, oDialog, "entitySetName");
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("Criticality - None", () => {
      expect(getCriticality("{net_amount}", false)).toEqual("Neutral");
    });
    test("Criticality - Negative", () => {
      oDialogModel.setProperty("/configuration/mainIndicatorOptions/criticality/0/criticality", "Error");
      expect(getCriticality("{net_amount}", false)).toEqual("Error");
    });
    test("Criticality - Critical", () => {
      oDialogModel.setProperty("/configuration/mainIndicatorOptions/criticality/0/criticality", "Critical");
      expect(getCriticality("{net_amount}", false)).toEqual("Critical");
    });
    test("Criticality - Positive", () => {
      oDialogModel.setProperty("/configuration/mainIndicatorOptions/criticality/0/criticality", "Good");
      expect(getCriticality("{net_amount}", false)).toEqual("Good");
    });
    test("Edge case: Criticality - undefined", () => {
      oDialogModel.setProperty("/configuration/mainIndicatorOptions/criticality", undefined);
      expect(getCriticality("{net_amount}", false)).toEqual("None");
    });
  });
  describe("Toggle Advanced Settings", () => {
    let coreElementGetElementByIdSpy;
    beforeAll(() => {
      coreElementGetElementByIdSpy = jest.spyOn(CoreElement, "getElementById");
      const dialog = {
        getModel: () => {
          return {};
        },
        open: jest.fn(),
        setModel: jest.fn(),
        close: jest.fn()
      };
      CardGeneratorDialogController.initialize(rootComponent, dialog, "entitySetName");
    });
    beforeEach(() => {
      coreElementGetElementByIdSpy.mockReset();
    });
    test("transpileIntegrationCardToAdaptive should be called", function () {
      try {
        coreElementGetElementByIdSpy.mockImplementation(id => {
          if (id === "cardGeneratorDialog--contentSplitter") {
            return {
              getManifest: jest.fn().mockReturnValue({})
            };
          }
        });
        const toggleButton = new ToggleButton();
        const toggleEvent = new Event("toggle", toggleButton, {});
        CoreElement.getElementById.mockReturnValue(new Splitter("", {
          contentAreas: [new VBox(), new VBox()]
        }));
        jest.useFakeTimers();
        return Promise.resolve(CardGeneratorDialogController.toggleAdvancedSetting(toggleEvent)).then(function () {
          jest.runAllTimers();
          expect(transpileIntegrationCardToAdaptive).toHaveBeenCalledWith({});
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });
});
//# sourceMappingURL=CardGeneratorDialogController.spec.js.map