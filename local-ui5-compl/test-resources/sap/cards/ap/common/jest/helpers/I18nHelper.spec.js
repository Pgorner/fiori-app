/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/cards/ap/common/helpers/I18nHelper", "sap/ui/core/UIComponent"], function (sap_cards_ap_common_helpers_I18nHelper, UIComponent) {
  "use strict";

  const resolvei18nTextsForIntegrationCard = sap_cards_ap_common_helpers_I18nHelper["resolvei18nTextsForIntegrationCard"];
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
      getText: key => {
        return mI18nMap[key];
      }
    };
  });
  describe("resolvei18nTextsForIntegrationCard", () => {
    test("resolvei18nTextsForIntegrationCard: return updated value of manifest with resolved i18n texts ", () => {
      const cardManifest = {
        _version: "1.15.0",
        "sap.app": {
          id: "objectCard",
          type: "card",
          title: "{{APP_TITLE}}",
          i18n: "",
          subTitle: "{{APP_SUBTITLE}}",
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
              number: "{{NUMBER}}"
            }
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
        },
        "sap.insights": {
          templateName: "ObjectPage",
          parentAppId: "objectCard",
          cardType: "LEAN_DT",
          versions: {
            ui5: ""
          }
        }
      };
      expect(resolvei18nTextsForIntegrationCard(cardManifest, rootComponent.getModel())).toMatchSnapshot();
    });
    test("resolvei18nTextsForIntegrationCard: return updated value of manifest without resolving i18n texts ", () => {
      const cardManifest = {
        _version: "1.15.0",
        "sap.app": {
          id: "objectCard",
          type: "card",
          title: "APP_TITLE",
          subTitle: "APP_SUBTITLE",
          i18n: "",
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
            title: "HEADER_TITLE",
            subTitle: "HEADER_SUBTITLE",
            unitOfMeasurement: "{CndnContrTypeDesc}",
            mainIndicator: {
              unit: "UNIT",
              number: "NUMBER"
            }
          },
          content: {
            groups: [{
              title: "{GROUP_TITLE_1}",
              items: [{
                label: "{GROUP_1_LABEL_1}",
                value: "{GROUP_1_VALUE_1}",
                name: "CndnContrActvtnStatusName"
              }, {
                label: "{GROUP_1_LABEL_2}",
                value: "{GROUP_1_VALUE_2}",
                name: "CndnContrProcessCategoryDesc"
              }]
            }, {
              title: "{GROUP_TITLE_2}",
              items: [{
                label: "{GROUP_2_LABEL_1}",
                value: "{GROUP_2_VALUE_1}",
                name: "SalesOrganizationName"
              }, {
                label: "{GROUP_2_LABEL_2}",
                value: "{GROUP_2_VALUE_2}",
                name: "CndnContrPrtlSettlmtCatName"
              }]
            }]
          }
        },
        "sap.insights": {
          templateName: "ObjectPage",
          parentAppId: "objectCard",
          cardType: "LEAN_DT",
          versions: {
            ui5: ""
          }
        }
      };
      expect(resolvei18nTextsForIntegrationCard(cardManifest, rootComponent.getModel())).toMatchSnapshot();
    });
  });
});
//# sourceMappingURL=I18nHelper.spec.js.map