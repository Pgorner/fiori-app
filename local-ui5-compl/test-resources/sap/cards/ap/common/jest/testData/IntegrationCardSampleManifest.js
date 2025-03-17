/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define([], function () {
  "use strict";

  var __exports = {
    _version: "1.15.0",
    "sap.app": {
      id: "objectCard",
      type: "card",
      title: "{{CardGeneratorHeaderTitle}}",
      subTitle: "{{CardGeneratorHeaderSubTitle}} | {overall_status}",
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
          _headerSelectQuery: {
            value: "$select=bp_id,currency_code,overall_status"
          },
          _contentSelectQuery: {
            value: "$select=so_id,bp_id,created_at,net_amount,gross_amount,tax_amount,currency_code,overall_status"
          },
          node_key: {
            type: "string",
            value: "12345"
          },
          IsActiveEntity: {
            type: "boolean",
            value: true
          },
          BankCountry: {
            type: "number",
            value: "0000000006"
          },
          _adaptiveFooterActionParameters: {
            C_SalesPlanTPRelease: {
              actionParameters: [],
              data: {
                actionParams: {
                  keys: ["SalesPlanUUID", "IsActiveEntity"]
                },
                isConfirmationRequired: false
              },
              enablePath: "salesorderID",
              label: "Release",
              parameters: {
                IsActiveEntity: true,
                SalesPlanUUID: "00000000-0000-0000-0000-000000000000"
              },
              style: "default",
              verb: "C_SalesPlanTPRelease"
            }
          },
          footerActionParameters: {},
          _entitySet: {
            value: "C_STTA_SalesOrder_WD_20",
            type: "string"
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
              url: "C_STTA_SalesOrder_WD_20({{parameters.contextParameters}})?{{parameters._headerSelectQuery}}",
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
        title: "{{CardGeneratorHeaderTitle}}",
        subTitle: "{{CardGeneratorHeaderSubTitle}}",
        unitOfMeasurement: "{overall_status}",
        mainIndicator: {
          number: '{= format.float(${net_amount}, {"decimals":2,"style":"short"})} {currency_code}',
          unit: "",
          trend: "None",
          state: "{= extension.formatters.formatCriticality(${Language}, 'color') }"
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
          title: "{{CardGeneratorGroupHeader_Groups_0}}",
          items: [{
            label: "{{CardGeneratorGroupPropertyLabel_Groups_0_Items_0}}",
            value: '{= format.float(${net_amount}, {"decimals":2,"style":"short"})} {currency_code}',
            name: "net_amount"
          }, {
            label: "{{CardGeneratorGroupPropertyLabel_Groups_0_Items_1}}",
            value: "{gross_amount} {currency_code}",
            name: "gross_amount"
          }, {
            label: "{{CardGeneratorGroupPropertyLabel_Groups_0_Items_2}}",
            value: "{tax_amount} {currency_code}",
            name: "tax_amount"
          }]
        }, {
          title: "{{CardGeneratorGroupHeader_Groups_1}}",
          items: [{
            label: "{{CardGeneratorGroupPropertyLabel_Groups_1_Items_0}}",
            value: "{bp_id}",
            name: "bp_id"
          }, {
            label: "{{CardGeneratorGroupPropertyLabel_Groups_1_Items_1}}",
            value: '{= format.dateTime(${created_at}, {"relative":false,"UTC":true})}',
            name: "created_at"
          }, {
            label: "{{CardGeneratorGroupPropertyLabel_Groups_1_Items_2}}",
            value: "{so_id}",
            name: "so_id"
          }]
        }]
      },
      footer: {
        actionsStrip: []
      }
    },
    "sap.insights": {
      templateName: "ObjectPage",
      parentAppId: "sales.order.wd20",
      cardType: "LEAN_DT",
      versions: {
        ui5: "1.125.1-SNAPSHOT-202406281543"
      }
    }
  };
  return __exports;
});
//# sourceMappingURL=IntegrationCardSampleManifest.js.map