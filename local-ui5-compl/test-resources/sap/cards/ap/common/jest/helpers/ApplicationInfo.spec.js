/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/base/i18n/ResourceBundle", "sap/cards/ap/common/helpers/ApplicationInfo", "sap/ui/core/UIComponent"], function (ResourceBundle, sap_cards_ap_common_helpers_ApplicationInfo, UIComponent) {
  "use strict";

  const fetchApplicationInfo = sap_cards_ap_common_helpers_ApplicationInfo["fetchApplicationInfo"];
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
  describe("fetchApplicationInfo", () => {
    let windowSpy;
    let getModelSpy;
    let resourceBundleCreateSpy;
    const sapAppId = "testComponent";
    const Component = UIComponent.extend("rootComponent", {
      metadata: {
        manifest: {
          "sap.app": {
            id: sapAppId,
            type: "application"
          },
          "sap.ui5": {},
          "sap.platform.abap": {
            uri: ""
          }
        }
      },
      createContent() {
        return null;
      }
    });
    const rootComponent = new Component(sapAppId);
    beforeEach(() => {
      resourceBundleCreateSpy = jest.spyOn(ResourceBundle, "create");
    });
    afterEach(() => {
      resourceBundleCreateSpy.mockRestore();
    });
    beforeAll(() => {
      windowSpy = jest.spyOn(window, "window", "get");
      getModelSpy = jest.spyOn(rootComponent, "getModel").mockImplementation(() => {
        return {
          isA: () => true,
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
    afterAll(() => {
      windowSpy.mockRestore();
      getModelSpy.mockRestore();
    });
    test("returns the application info, object page", function () {
      try {
        windowSpy.mockImplementation(() => ({
          hasher: {
            getHash: () => "test-intent&/testEntity('12345')"
          }
        }));
        resourceBundleCreateSpy.mockImplementation(() => {
          return {
            getText: key => {
              return i18nMap[key] || key;
            }
          };
        });
        return Promise.resolve(fetchApplicationInfo(rootComponent)).then(function (applicationInfo) {
          expect(applicationInfo).toMatchObject({
            componentName: sapAppId,
            entitySet: "testEntity",
            context: "'12345'"
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    test("returns the application info, other than object page", function () {
      try {
        windowSpy.mockImplementation(() => ({
          hasher: {
            getHash: () => "test-intent"
          }
        }));
        resourceBundleCreateSpy.mockImplementation(() => {
          return {
            getText: key => {
              return i18nMap[key] || key;
            }
          };
        });
        return Promise.resolve(fetchApplicationInfo(rootComponent)).then(function (applicationInfo) {
          expect(applicationInfo).toMatchObject({
            componentName: sapAppId,
            entitySet: "",
            context: ""
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    test("ResourceBundle create method should be called, when isDesignMode option is true", function () {
      try {
        windowSpy.mockImplementation(() => ({
          hasher: {
            getHash: () => "test-intent&/testEntity('12345')"
          }
        }));
        return Promise.resolve(fetchApplicationInfo(rootComponent, {
          isDesignMode: true
        })).then(function () {
          expect(resourceBundleCreateSpy).toHaveBeenCalled();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    test("ResourceBundle create method should not be called, when isDesignMode option is false", function () {
      try {
        windowSpy.mockImplementation(() => ({
          hasher: {
            getHash: () => "test-intent&/testEntity('12345')"
          }
        }));
        return Promise.resolve(fetchApplicationInfo(rootComponent, {
          isDesignMode: false
        })).then(function () {
          expect(resourceBundleCreateSpy).not.toHaveBeenCalled();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });
});
//# sourceMappingURL=ApplicationInfo.spec.js.map