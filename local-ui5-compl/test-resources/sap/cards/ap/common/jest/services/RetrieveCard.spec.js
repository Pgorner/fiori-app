/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/base/i18n/ResourceBundle", "sap/cards/ap/common/services/RetrieveCard", "sap/ui/core/UIComponent", "sap/ui/core/routing/HashChanger", "../testData/AdaptiveCardSampleManifest", "../testData/IntegrationCardManifestWithoutSelectParam", "../testData/IntegrationCardSampleManifest"], function (ResourceBundle, sap_cards_ap_common_services_RetrieveCard, UIComponent, HashChanger, AdaptiveCardSampleManifest, IntegrationCardManifestWithoutSelectParam, IntegrationCardSampleManifest) {
  "use strict";

  function _catch(body, recover) {
    try {
      var result = body();
    } catch (e) {
      return recover(e);
    }
    if (result && result.then) {
      return result.then(void 0, recover);
    }
    return result;
  }
  const CardTypes = sap_cards_ap_common_services_RetrieveCard["CardTypes"];
  const _getObjectPageCardManifest = sap_cards_ap_common_services_RetrieveCard["_getObjectPageCardManifest"];
  const getCardPath = sap_cards_ap_common_services_RetrieveCard["getCardPath"];
  const getObjectPageCardManifestForPreview = sap_cards_ap_common_services_RetrieveCard["getObjectPageCardManifestForPreview"];
  const i18nMap = {
    appTitle: "Sales Order",
    appDescription: "A Fiori application.",
    CardGeneratorHeaderTitle: "Sales Order",
    CardGeneratorHeaderSubTitle: "A Fiori application.",
    CardGeneratorGroupPropertyLabel_Groups_0_Items_0: "Net Amount",
    CardGeneratorGroupPropertyLabel_Groups_0_Items_1: "Gross Amount",
    CardGeneratorGroupPropertyLabel_Groups_0_Items_2: "Tax Amount",
    CardGeneratorGroupHeader_Groups_0: "Amount",
    CardGeneratorGroupPropertyLabel_Groups_1_Items_0: "Business Partner ID",
    CardGeneratorGroupPropertyLabel_Groups_1_Items_1: "Created At",
    CardGeneratorGroupPropertyLabel_Groups_1_Items_2: "Sales Order ID",
    CardGeneratorGroupHeader_Groups_1: "Additional Info"
  };
  describe("getCardPath", () => {
    const appManifest = {
      "sap.app": {
        id: "testComponent",
        type: "application"
      },
      "sap.ui5": {},
      "sap.platform.abap": {
        uri: ""
      },
      "sap.cards.ap": {
        embeds: {
          ObjectPage: {
            default: "testEntity",
            manifests: {
              testEntity: [{
                localUri: "cards/op/testEntity/"
              }],
              testEntity1: [{
                localUri: "cards/op/testEntity1/"
              }]
            }
          }
        }
      }
    };
    test("returns the card path for integration card", () => {
      const sType = CardTypes.INTEGRATION;
      const entitySet = "testEntity";
      const cardPath = getCardPath(sType, entitySet, appManifest);
      expect(cardPath).toBe("/cards/op/testEntity/manifest.json");
    });
    test("returns the card path for integration card when localUri is without training slash", () => {
      const appManifest = {
        "sap.app": {
          id: "testComponent"
        },
        "sap.ui5": {},
        "sap.ui": {},
        "sap.cards.ap": {
          embeds: {
            ObjectPage: {
              default: "testEntity",
              manifests: {
                testEntity: [{
                  localUri: "cards/op/testEntity"
                }]
              }
            }
          }
        }
      };
      const sType = CardTypes.INTEGRATION;
      const entitySet = "testEntity";
      const cardPath = getCardPath(sType, entitySet, appManifest);
      expect(cardPath).toBe("/cards/op/testEntity/manifest.json");
    });
    test("returns the card path for adaptive card", () => {
      const sType = CardTypes.ADAPTIVE;
      const entitySet = "testEntity";
      const cardPath = getCardPath(sType, entitySet, appManifest);
      expect(cardPath).toBe("/cards/op/testEntity/adaptive-manifest.json");
    });
    test("returns empty path when sap.cards.ap's embeds object page configuration is empty", () => {
      appManifest["sap.cards.ap"].embeds.ObjectPage.manifests = {};
      const sType = CardTypes.ADAPTIVE;
      const entitySet = "testEntity";
      const cardPath = getCardPath(sType, entitySet, appManifest);
      expect(cardPath).toBe("");
    });
    test("returns empty path when sap.cards.ap configuration is not there in appManifest", () => {
      appManifest["sap.cards.ap"] = {};
      const sType = CardTypes.ADAPTIVE;
      const entitySet = "testEntity";
      const cardPath = getCardPath(sType, entitySet, appManifest);
      expect(cardPath).toBe("");
    });
  });
  describe("_getObjectPageCardManifest", () => {
    let globalFetchMock;
    const sapAppId = "testComponent1";
    const appManifest = {
      "sap.app": {
        id: sapAppId,
        type: "application"
      },
      "sap.ui5": {},
      "sap.platform.abap": {
        uri: ""
      },
      "sap.cards.ap": {
        embeds: {
          ObjectPage: {
            default: "testEntity",
            manifests: {
              testEntity: [{
                localUri: "cards/op/testEntity/"
              }]
            }
          }
        }
      }
    };
    const Component = UIComponent.extend("rootComponent", {
      metadata: {
        manifest: appManifest
      },
      createContent() {
        return null;
      }
    });
    const rootComponent = new Component(sapAppId);
    beforeAll(() => {
      globalFetchMock = jest.spyOn(window, "fetch").mockImplementation(url => {
        if (url === "/manifest.json") {
          return Promise.resolve({
            ok: true,
            json: () => {
              return appManifest;
            }
          });
        }
        if (url === "/cards/op/testEntity/manifest.json") {
          return Promise.resolve({
            ok: true,
            json: () => {
              return IntegrationCardSampleManifest;
            }
          });
        }
        if (url === "/cards/op/testEntity/adaptive-manifest.json") {
          return Promise.resolve({
            ok: true,
            json: () => {
              return AdaptiveCardSampleManifest;
            }
          });
        }
      });
    });
    afterAll(() => {
      globalFetchMock.mockRestore();
    });
    test("returns the integration card manifest for object page card", function () {
      try {
        const fetchedParams = {
          componentName: "testComponent1",
          entitySet: "testEntity",
          cardType: CardTypes.INTEGRATION
        };
        return Promise.resolve(_getObjectPageCardManifest(rootComponent, fetchedParams)).then(function (cardManifest) {
          expect(cardManifest).toMatchSnapshot();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    test("returns the adaptive card manifest for object page card", function () {
      try {
        const fetchedParams = {
          componentName: "testComponent1",
          entitySet: "testEntity",
          cardType: CardTypes.ADAPTIVE
        };
        return Promise.resolve(_getObjectPageCardManifest(rootComponent, fetchedParams)).then(function (cardManifest) {
          expect(cardManifest).toMatchSnapshot();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    test("rejects the promise when entity set name is empty", function () {
      try {
        const fetchedParams = {
          componentName: "testComponent1",
          entitySet: "",
          cardType: ""
        };
        const rootComponent1 = {
          getManifest: jest.fn().mockReturnValue({})
        };
        const _temp = _catch(function () {
          return Promise.resolve(_getObjectPageCardManifest(rootComponent1, fetchedParams)).then(function () {});
        }, function (error) {
          expect(error).toBeDefined();
          expect(error).toBe("No cards available for this application");
        });
        return Promise.resolve(_temp && _temp.then ? _temp.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });
  describe("getObjectPageCardManifestForPreview - V2", () => {
    let globalFetchMock;
    let resourceBundleCreateSpy;
    const sapAppId = "testComponent2";
    const appManifest = {
      "sap.app": {
        id: sapAppId,
        type: "application"
      },
      "sap.ui5": {},
      "sap.platform.abap": {
        uri: ""
      },
      "sap.cards.ap": {
        embeds: {
          ObjectPage: {
            default: "testEntity",
            manifests: {
              testEntity: [{
                localUri: "cards/op/testEntity/"
              }],
              testEntity1: [{
                localUri: "cards/op/testEntity1/"
              }]
            }
          }
        }
      }
    };
    const Component = UIComponent.extend("rootComponent", {
      metadata: {
        manifest: appManifest
      },
      createContent() {
        return null;
      }
    });
    const rootComponent = new Component(sapAppId);
    beforeAll(() => {
      resourceBundleCreateSpy = jest.spyOn(ResourceBundle, "create").mockImplementation(() => {
        return {
          getText: key => {
            return i18nMap[key] || key;
          }
        };
      });
      globalFetchMock = jest.spyOn(window, "fetch").mockImplementation(url => {
        if (url === "/manifest.json") {
          return Promise.resolve({
            ok: true,
            json: () => {
              return appManifest;
            }
          });
        }
        if (url === "/cards/op/testEntity1/manifest.json") {
          return Promise.resolve({
            ok: true,
            json: () => {
              return IntegrationCardManifestWithoutSelectParam;
            }
          });
        }
        if (url === "/cards/op/testEntity/manifest.json") {
          return Promise.resolve({
            ok: true,
            json: () => {
              return IntegrationCardSampleManifest;
            }
          });
        }
        if (url === "/cards/op/testEntity/adaptive-manifest.json") {
          return Promise.resolve({
            ok: true,
            json: () => {
              return AdaptiveCardSampleManifest;
            }
          });
        }
      });
    });
    afterAll(() => {
      resourceBundleCreateSpy.mockRestore();
      globalFetchMock.mockRestore();
    });
    let windowSpy;
    let getModelSpy;
    beforeEach(() => {
      windowSpy = jest.spyOn(window, "window", "get");
      getModelSpy = jest.spyOn(rootComponent, "getModel").mockImplementation(() => {
        return {
          isA: () => false,
          getMetaModel: function () {
            return {
              getODataEntitySet: function () {
                return {
                  entityType: "container.testEntityType"
                };
              },
              getODataEntityType: function () {
                return {
                  property: [{
                    name: "node_key",
                    type: "Edm.Guid"
                  }, {
                    name: "IsActiveEntity",
                    type: "Edm.Boolean"
                  }],
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
          getObject: () => {
            return {
              node_key: "12345",
              IsActiveEntity: true
            };
          },
          getResourceBundle: jest.fn().mockImplementation(() => {
            return {
              oUrlInfo: {
                url: "i18n.properties"
              }
            };
          })
        };
      });
    });
    afterEach(() => {
      windowSpy.mockRestore();
      getModelSpy.mockRestore();
    });
    test("returns integration card manifest", function () {
      try {
        windowSpy.mockImplementation(() => ({
          hasher: {
            getHash: () => "test-intent&/testEntity('12345')"
          }
        }));
        return Promise.resolve(getObjectPageCardManifestForPreview(rootComponent, {
          cardType: CardTypes.INTEGRATION,
          isDesignMode: true
        })).then(function (mIntegrationCardManifest) {
          expect(mIntegrationCardManifest).toMatchSnapshot();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    test("returns integration card manifest, with key-value format as context parameters", function () {
      try {
        windowSpy.mockImplementation(() => ({
          hasher: {
            getHash: () => "test-intent&/testEntity(id='12345')"
          }
        }));
        return Promise.resolve(getObjectPageCardManifestForPreview(rootComponent, {
          cardType: CardTypes.INTEGRATION,
          isDesignMode: true
        })).then(function (mIntegrationCardManifest) {
          expect(mIntegrationCardManifest).toMatchSnapshot();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    test("returns adaptive card manifest ready for preview when there exists select query parameters", function () {
      try {
        windowSpy.mockImplementation(() => ({
          hasher: {
            getHash: () => "test-intent&/testEntity(id='12345')"
          },
          location: {
            href: "http://localhost:8080/test#test-intent&/testEntity(id='12345')",
            origin: "http://localhost:8080",
            pathname: "/test",
            search: "?query=1",
            hash: "#hash"
          }
        }));
        const hashChangerMock = {
          getHash: jest.fn().mockReturnValue("myHash"),
          hrefForAppSpecificHash: jest.fn().mockReturnValue("basePath/")
        };
        const mockRouter = {
          hashChangerMock
        };
        jest.spyOn(HashChanger, "getInstance").mockReturnValue(mockRouter.hashChangerMock);
        return Promise.resolve(getObjectPageCardManifestForPreview(rootComponent, {
          cardType: CardTypes.ADAPTIVE,
          isDesignMode: true
        })).then(function (mAdaptiveCardManifest) {
          expect(mAdaptiveCardManifest).toMatchSnapshot();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    test("returns adaptive card manifest ready for preview when no select query parameter exists for card", function () {
      try {
        windowSpy.mockImplementation(() => ({
          hasher: {
            getHash: () => "test-intent&/testEntity1(id='12345')"
          },
          location: {
            href: "http://localhost:8080/test#test-intent&/testEntity(id='12345')",
            origin: "http://localhost:8080",
            pathname: "/test",
            search: "?query=1",
            hash: "#hash"
          }
        }));
        const hashChangerMock = {
          getHash: jest.fn().mockReturnValue("myHash"),
          hrefForAppSpecificHash: jest.fn().mockReturnValue("basePath/")
        };
        const mockRouter = {
          hashChangerMock
        };
        jest.spyOn(HashChanger, "getInstance").mockReturnValue(mockRouter.hashChangerMock);
        return Promise.resolve(getObjectPageCardManifestForPreview(rootComponent, {
          cardType: CardTypes.ADAPTIVE,
          isDesignMode: true
        })).then(function (mIntegrationCardManifest) {
          expect(mIntegrationCardManifest).toMatchSnapshot();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });
  describe("getObjectPageCardManifestForPreview - V4", () => {
    let globalFetchMock;
    let resourceBundleCreateSpy;
    const sapAppId = "testComponent3";
    const appManifest = {
      "sap.app": {
        id: sapAppId,
        type: "application"
      },
      "sap.ui5": {},
      "sap.platform.abap": {
        uri: ""
      },
      "sap.cards.ap": {
        embeds: {
          ObjectPage: {
            default: "CashBank",
            manifests: {
              CashBank: [{
                localUri: "cards/op/CashBank/",
                hideActions: true
              }]
            }
          }
        }
      }
    };
    const Component = UIComponent.extend("rootComponent", {
      metadata: {
        manifest: appManifest
      },
      createContent() {
        return null;
      }
    });
    const rootComponent = new Component(sapAppId);
    beforeAll(() => {
      resourceBundleCreateSpy = jest.spyOn(ResourceBundle, "create").mockImplementation(() => {
        return {
          getText: key => {
            return i18nMap[key] || key;
          }
        };
      });
      globalFetchMock = jest.spyOn(window, "fetch").mockImplementation(url => {
        if (url === "/manifest.json") {
          return Promise.resolve({
            ok: true,
            json: () => {
              return appManifest;
            }
          });
        }
        if (url === "/cards/op/CashBank/manifest.json") {
          return Promise.resolve({
            ok: true,
            json: () => {
              return IntegrationCardSampleManifest;
            }
          });
        }
        if (url === "/cards/op/CashBank/adaptive-manifest.json") {
          return Promise.resolve({
            ok: true,
            json: () => {
              return AdaptiveCardSampleManifest;
            }
          });
        }
      });
    });
    afterAll(() => {
      resourceBundleCreateSpy.mockRestore();
      globalFetchMock.mockRestore();
    });
    let windowSpy;
    let getModelSpy;
    beforeEach(() => {
      windowSpy = jest.spyOn(window, "window", "get");
      getModelSpy = jest.spyOn(rootComponent, "getModel").mockImplementation(() => {
        return {
          isA: () => true,
          getMetaModel: () => {
            return {
              getObject: sParam => {
                const entityContainer = {
                  $kind: "EntityContainer",
                  CashBank: {
                    $kind: "EntitySet",
                    $Type: "com.sap.gateway.srvd.ui_cashbank_manage.v0001.CashBankType"
                  },
                  "com.sap.gateway.srvd.ui_cashbank_manage.v0001.CashBankType": {
                    $kind: "EntityType",
                    $Key: ["BankCountry", "BankInternalID", "IsActiveEntity"],
                    BankCountry: {
                      $kind: "Property",
                      $Type: "Edm.String",
                      "@com.sap.vocabularies.Common.v1.Label": "Bank Country"
                    },
                    BankInternalID: {
                      $kind: "Property",
                      $Type: "Edm.String",
                      "@com.sap.vocabularies.Common.v1.Label": "Bank Internal ID"
                    },
                    IsActiveEntity: {
                      $kind: "Property",
                      $Type: "Edm.Boolean",
                      "@com.sap.vocabularies.Common.v1.Label": "Is Active Entity"
                    }
                  }
                };
                if (sParam === "/") {
                  return entityContainer;
                }
                sParam = sParam.replace("/", "");
                return entityContainer[sParam];
              },
              getODataEntityType: path => {
                return {
                  key: {
                    propertyRef: [{
                      name: "node_key"
                    }, {
                      name: "IsActiveEntity"
                    }, {
                      name: "BankCountry"
                    }]
                  }
                };
              }
            };
          },
          getObject: () => {
            return {
              node_key: "005056a7-004e-1ed8-b2e0-081387831f0d",
              IsActiveEntity: true,
              BankCountry: "0000000006"
            };
          },
          getResourceBundle: jest.fn().mockImplementation(() => {
            return {
              oUrlInfo: {
                url: "i18n.properties"
              }
            };
          })
        };
      });
    });
    afterEach(() => {
      windowSpy.mockRestore();
      getModelSpy.mockRestore();
    });
    test("returns adaptive card manifest ready for preview when there exists select query parameters- when hideAction is false", function () {
      try {
        windowSpy.mockImplementation(() => ({
          hasher: {
            getHash: () => "test-intent&/CashBank(node_key='005056a7-004e-1ed8-b2e0-081387831f0d',IsActiveEntity=true,BankCountry=0000000006)"
          },
          location: {
            href: "http://localhost:8080/test#test-intent&/CashBank(node_key=005056a7-004e-1ed8-b2e0-081387831f0d,IsActiveEntity=true,BankCountry=0000000006)",
            origin: "http://localhost:8080",
            pathname: "/test",
            search: "?query=1",
            hash: "#hash"
          }
        }));
        const hashChangerMock = {
          getHash: jest.fn().mockReturnValue("myHash"),
          hrefForAppSpecificHash: jest.fn().mockReturnValue("basePath/")
        };
        const mockRouter = {
          hashChangerMock
        };
        jest.spyOn(HashChanger, "getInstance").mockReturnValue(mockRouter.hashChangerMock);
        return Promise.resolve(getObjectPageCardManifestForPreview(rootComponent, {
          cardType: CardTypes.ADAPTIVE,
          includeActions: false,
          hideActions: false,
          isDesignMode: true
        })).then(function (mAdaptiveCardManifest) {
          expect(mAdaptiveCardManifest).toMatchSnapshot();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    test("returns integration card manifest", function () {
      try {
        windowSpy.mockImplementation(() => ({
          hasher: {
            getHash: () => "test-intent&/CashBank(node_key='005056a7-004e-1ed8-b2e0-081387831f0d',IsActiveEntity=true,BankCountry=0000000006)"
          }
        }));
        const hashChangerMock = {
          getHash: jest.fn().mockReturnValue("myHash"),
          hrefForAppSpecificHash: jest.fn().mockReturnValue("basePath/")
        };
        const mockRouter = {
          hashChangerMock
        };
        jest.spyOn(HashChanger, "getInstance").mockReturnValue(mockRouter.hashChangerMock);
        return Promise.resolve(getObjectPageCardManifestForPreview(rootComponent, {
          cardType: CardTypes.INTEGRATION,
          isDesignMode: true
        })).then(function (mIntegrationCardManifest) {
          expect(mIntegrationCardManifest).toMatchSnapshot();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    test("returns adaptive card manifest ready for preview when there exists select query parameters - when hideAction is true", function () {
      try {
        windowSpy.mockImplementation(() => ({
          hasher: {
            getHash: () => "test-intent?&/CashBank(node_key='005056a7-004e-1ed8-b2e0-081387831f0d',IsActiveEntity=true,BankCountry=0000000006)/"
          },
          location: {
            href: "http://localhost:8080/test#test-intent&/CashBank(node_key=005056a7-004e-1ed8-b2e0-081387831f0d,IsActiveEntity=true,BankCountry=0000000006)",
            origin: "http://localhost:8080",
            pathname: "/test",
            search: "?query=1",
            hash: "#hash"
          }
        }));
        const hashChangerMock = {
          getHash: jest.fn().mockReturnValue("myHash"),
          hrefForAppSpecificHash: jest.fn().mockReturnValue("basePath/")
        };
        const mockRouter = {
          hashChangerMock
        };
        jest.spyOn(HashChanger, "getInstance").mockReturnValue(mockRouter.hashChangerMock);
        return Promise.resolve(getObjectPageCardManifestForPreview(rootComponent, {
          cardType: CardTypes.ADAPTIVE,
          includeActions: false,
          hideActions: true,
          isDesignMode: true
        })).then(function (mAdaptiveCardManifest) {
          expect(mAdaptiveCardManifest).toMatchSnapshot();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    test("No card exists for application at run time", function () {
      try {
        windowSpy.mockImplementation(() => ({
          hasher: {
            getHash: () => "test-intent&/CashBank(node_key=005056a7-004e-1ed8-b2e0-081387831f0d,IsActiveEntity=true,BankCountry=0000000006)"
          },
          location: {
            href: "http://localhost:8080/test-intent&/CashBank(node_key=005056a7-004e-1ed8-b2e0-081387831f0d,IsActiveEntity=true,BankCountry=0000000006)"
          }
        }));
        delete rootComponent?.getManifest()?.["sap.cards.ap"];
        const _temp2 = _catch(function () {
          return Promise.resolve(getObjectPageCardManifestForPreview(rootComponent, {
            cardType: CardTypes.ADAPTIVE,
            includeActions: false,
            hideActions: true,
            isDesignMode: false
          })).then(function () {});
        }, function (error) {
          expect(error).toBeDefined();
          expect(error).toBe("No cards available for this application");
        });
        return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });
});
//# sourceMappingURL=RetrieveCard.spec.js.map