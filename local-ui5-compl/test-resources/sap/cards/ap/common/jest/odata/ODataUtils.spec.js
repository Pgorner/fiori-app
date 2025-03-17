/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/cards/ap/common/odata/ODataUtils"], function (sap_cards_ap_common_odata_ODataUtils) {
  "use strict";

  const createContextParameter = sap_cards_ap_common_odata_ODataUtils["createContextParameter"];
  const fetchDataAsync = sap_cards_ap_common_odata_ODataUtils["fetchDataAsync"];
  describe("fetchDataAsync", () => {
    let originalFetch;
    let sUrl = "https://url/test/";
    const sPath = "Products";
    const expectedValue = {
      value: "Testing!",
      Response: "Success",
      Status: 200,
      StatusText: "OK",
      Headers: "Content-Type: application/json"
    };
    beforeEach(() => {
      originalFetch = global.fetch;
      global.fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve(expectedValue)
      }));
    });
    afterEach(() => {
      global.fetch = originalFetch;
    });
    test("fetchDataAsync - service URL ending with /", function () {
      try {
        return Promise.resolve(fetchDataAsync(sUrl, sPath, {})).then(function (result) {
          expect(global.fetch).toHaveBeenCalledWith("https://url/test/Products?format=json");
          expect(result).toBe(expectedValue);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    test("fetchDataAsync service URL ending without /", function () {
      try {
        sUrl = "https://url/test";
        return Promise.resolve(fetchDataAsync(sUrl, sPath, {})).then(function (result) {
          expect(global.fetch).toHaveBeenCalledWith("https://url/test/Products?format=json");
          expect(result).toBe(expectedValue);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });
  describe("createContextParameter", () => {
    let windowSpy;
    let originalFetch;
    const expectedValue = {
      value: [{
        BankCountry: "AD",
        IsActiveEntity: true
      }]
    };
    beforeAll(() => {
      windowSpy = jest.spyOn(window, "window", "get");
      windowSpy.mockImplementation(() => ({
        hasher: {
          getHash: () => "test-intent&/I_BillingBlockReason(12345)"
        }
      }));
      originalFetch = global.fetch;
      global.fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve(expectedValue)
      }));
    });
    afterAll(() => {
      jest.restoreAllMocks();
      global.fetch = originalFetch;
    });
    test("validate method createContextParameter for V4 data - with multiple context parameters", function () {
      try {
        const mockMetaData = {
          getServiceUrl: () => "/sap/opu/odata",
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
              getODataEntitySet: path => {
                return {
                  name: "CashBank",
                  entityType: "com.sap.gateway.srvd.ui_cashbank_manage.v0001.CashBankType"
                };
              }
            };
          },
          getObject: () => {
            return {
              BankInternalID: "0000000002",
              IsActiveEntity: true,
              BankCountry: "AD"
            };
          }
        };
        const path = "CashBank(BankCountry='AD',BankInternalID='0000000002')";
        const expectedPath = "BankCountry='AD',BankInternalID='0000000002',IsActiveEntity=true";
        return Promise.resolve(createContextParameter(path, mockMetaData, true)).then(function (updatedPath) {
          expect(updatedPath).toEqual(expectedPath);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    test("validate method createContextParameter for V4 data - with single context guid parameters", function () {
      try {
        const mockMetaData = {
          getServiceUrl: () => "/sap/opu/odata",
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
                    $Key: ["BankCountry", "IsActiveEntity"],
                    BankCountry: {
                      $kind: "Property",
                      $Type: "Edm.Guid",
                      "@com.sap.vocabularies.Common.v1.Label": "Bank Country"
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
              getODataEntitySet: path => {
                return {
                  name: "CashBank",
                  entityType: "com.sap.gateway.srvd.ui_cashbank_manage.v0001.CashBankType"
                };
              }
            };
          },
          getObject: () => {
            return {
              IsActiveEntity: true,
              BankCountry: "'AD'"
            };
          }
        };
        const path = "CashBank(BankCountry='AD')";
        const expectedPath = "BankCountry='AD',IsActiveEntity=true";
        return Promise.resolve(createContextParameter(path, mockMetaData, true)).then(function (updatedPath) {
          expect(updatedPath).toEqual(expectedPath);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    test("validate method createContextParameter for V4 data - with semantic key annotation", function () {
      try {
        const mockMetamodel = {
          getObject: sParam => {
            const entityContainer = {
              $kind: "EntityContainer",
              CashBank: {
                $kind: "EntitySet",
                $Type: "com.sap.gateway.srvd.ui_cashbank_manage.v0001.CashBankType"
              },
              "com.sap.gateway.srvd.ui_cashbank_manage.v0001.CashBankType": {
                $kind: "EntityType",
                $Key: ["BankCountry", "IsActiveEntity"],
                BankCountry: {
                  $kind: "Property",
                  $Type: "Edm.String",
                  "@com.sap.vocabularies.Common.v1.Label": "Bank Country"
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
            if (sParam === "/CashBank/@com.sap.vocabularies.Common.v1.SemanticKey") {
              return [{
                $PropertyPath: "BankCountry"
              }];
            }
            sParam = sParam.replace("/", "");
            return entityContainer[sParam];
          },
          getODataEntitySet: path => {
            return {
              name: "CashBank",
              entityType: "com.sap.gateway.srvd.ui_cashbank_manage.v0001.CashBankType"
            };
          }
        };
        const mockMetaData = {
          getServiceUrl: () => "/sap/opu/odata",
          isA: () => true,
          getMetaModel: () => {
            return mockMetamodel;
          },
          getObject: () => {
            return {
              IsActiveEntity: true,
              BankCountry: "AD"
            };
          }
        };
        const path = "CashBank('AD')";
        const expectedPath = "BankCountry='AD',IsActiveEntity=true";
        return Promise.resolve(createContextParameter(path, mockMetaData, true)).then(function (updatedPath) {
          expect(updatedPath).toEqual(expectedPath);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    test("validate method createContextParameter for V2 data - with multiple context parameters", function () {
      try {
        const mockMetaData = {
          getMetaModel: () => {
            return {
              sServiceUrl: "/sap/opu/odata",
              isA: () => false,
              getODataEntityType: path => {
                return {
                  key: {
                    propertyRef: [{
                      name: "BankCountry"
                    }, {
                      name: "BankInternalID"
                    }, {
                      name: "IsActiveEntity"
                    }]
                  },
                  property: [{
                    name: "BankCountry",
                    type: "Edm.String",
                    nullable: "false",
                    "sap:label": "Bank Country",
                    kind: "Property"
                  }, {
                    name: "BankInternalID",
                    type: "Edm.Guid",
                    nullable: "false",
                    "sap:label": "Bank Internal ID",
                    kind: "Property"
                  }, {
                    name: "IsActiveEntity",
                    type: "Edm.Boolean",
                    nullable: "false",
                    "sap:label": "Is Active Entity",
                    kind: "Property"
                  }]
                };
              },
              getODataAssociationEnd: () => {},
              getODataEntitySet: path => {
                return {
                  name: "CashBank",
                  entityType: "com.sap.gateway.srvd.ui_cashbank_manage.v0001.CashBankType"
                };
              }
            };
          },
          getObject: () => {
            return {
              BankInternalID: "0000000002",
              IsActiveEntity: true,
              BankCountry: "AD"
            };
          }
        };
        const path = "CashBank(BankInternalID=guid'0000000002',BankCountry='AD',IsActiveEntity=true)";
        const expectedPath = "BankCountry='AD',BankInternalID=guid'0000000002',IsActiveEntity=true";
        return Promise.resolve(createContextParameter(path, mockMetaData, false)).then(function (updatedPath) {
          expect(updatedPath).toEqual(expectedPath);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    test("validate method createContextParameter for V2 data - with single context guid parameter", function () {
      try {
        const mockMetaData = {
          getMetaModel: () => {
            return {
              sServiceUrl: "/sap/opu/odata",
              isA: () => false,
              getODataEntityContainer: () => {
                return {
                  entitySet: [{
                    name: "CashBank",
                    entityType: "com.sap.gateway.srvd.ui_cashbank_manage.v0001.CashBankType"
                  }]
                };
              },
              getODataEntityType: path => {
                return {
                  key: {
                    propertyRef: [{
                      name: "BankCountry"
                    }, {
                      name: "BankInternalID"
                    }, {
                      name: "IsActiveEntity"
                    }]
                  },
                  property: [{
                    name: "BankCountry",
                    type: "Edm.String",
                    nullable: "false",
                    "sap:label": "Bank Country",
                    kind: "Property"
                  }, {
                    name: "BankInternalID",
                    type: "Edm.Guid",
                    nullable: "false",
                    "sap:label": "Bank Internal ID",
                    kind: "Property"
                  }, {
                    name: "IsActiveEntity",
                    type: "Edm.Boolean",
                    nullable: "false",
                    "sap:label": "Is Active Entity",
                    kind: "Property"
                  }]
                };
              },
              getODataAssociationEnd: () => {},
              getODataEntitySet: path => {
                return {
                  name: "CashBank",
                  entityType: "com.sap.gateway.srvd.ui_cashbank_manage.v0001.CashBankType"
                };
              }
            };
          },
          getObject: () => {
            return {
              BankInternalID: "0000000002",
              IsActiveEntity: true,
              BankCountry: "AD"
            };
          }
        };
        const path = "CashBank(BankInternalID=guid'005056a7-004e-1ed8-b2e0-081387831f0d',IsActiveEntity=true)";
        const expectedPath = "BankCountry='AD',BankInternalID=guid'0000000002',IsActiveEntity=true";
        return Promise.resolve(createContextParameter(path, mockMetaData, false)).then(function (updatedPath) {
          expect(updatedPath).toEqual(expectedPath);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    test("validate method createContextParameter for V2 data - with guid as context parameter", function () {
      try {
        const mockMetaData = {
          getMetaModel: () => {
            return {
              sServiceUrl: "/sap/opu/odata",
              isA: () => false,
              getODataEntityContainer: () => {
                return {
                  entitySet: [{
                    name: "CashBank",
                    entityType: "com.sap.gateway.srvd.ui_cashbank_manage.v0001.CashBankType"
                  }]
                };
              },
              getODataEntityType: path => {
                return {
                  key: {
                    propertyRef: [{
                      name: "BankCountry"
                    }, {
                      name: "BankInternalID"
                    }, {
                      name: "IsActiveEntity"
                    }]
                  },
                  property: [{
                    name: "BankCountry",
                    type: "Edm.String",
                    nullable: "false",
                    "sap:label": "Bank Country",
                    kind: "Property"
                  }, {
                    name: "BankInternalID",
                    type: "Edm.Guid",
                    nullable: "false",
                    "sap:label": "Bank Internal ID",
                    kind: "Property"
                  }, {
                    name: "IsActiveEntity",
                    type: "Edm.Boolean",
                    nullable: "false",
                    "sap:label": "Is Active Entity",
                    kind: "Property"
                  }]
                };
              },
              getODataAssociationEnd: () => {},
              getODataEntitySet: path => {
                return {
                  name: "CashBank",
                  entityType: "com.sap.gateway.srvd.ui_cashbank_manage.v0001.CashBankType"
                };
              }
            };
          },
          getObject: () => {
            return {
              BankInternalID: "0000000002",
              IsActiveEntity: true,
              BankCountry: "AD"
            };
          }
        };
        const path = "CashBank('0000000002')";
        const expectedPath = "BankCountry='AD',BankInternalID=guid'0000000002',IsActiveEntity=true";
        return Promise.resolve(createContextParameter(path, mockMetaData, false)).then(function (updatedPath) {
          expect(updatedPath).toEqual(expectedPath);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });
});
//# sourceMappingURL=ODataUtils.spec.js.map