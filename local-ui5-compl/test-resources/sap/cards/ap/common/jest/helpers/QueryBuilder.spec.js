/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/cards/ap/common/helpers/QueryBuilder"], function (sap_cards_ap_common_helpers_QueryBuilder) {
  "use strict";

  const getSeparatedProperties = sap_cards_ap_common_helpers_QueryBuilder["getSeparatedProperties"];
  const updateExpandQuery = sap_cards_ap_common_helpers_QueryBuilder["updateExpandQuery"];
  const updateSelectQuery = sap_cards_ap_common_helpers_QueryBuilder["updateSelectQuery"];
  describe("Check formation of header and select query for the card", () => {
    it("should append select query parameters", () => {
      const contentUrl = "C_STTA_SalesOrder_WD_20(node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true)";
      const integrationCardManifest = {
        _version: "1.15.0",
        "sap.card": {
          extension: "module:sap/manifests/ap/common/extensions/BaseIntegrationCardExtension",
          type: "Object",
          configuration: {
            parameters: {
              _contentSelectQuery: {
                value: "$select=node_key,so_id,bp_id,currency_code,gross_amount,net_amount,lifecycle_status"
              },
              _headerSelectQuery: {
                value: "$select=bp_id,created_at"
              },
              _contentExpandQuery: {
                value: ""
              },
              _headerExpandQuery: {
                value: ""
              }
            }
          }
        }
      };
      const contentUrlWithSelect = updateSelectQuery(contentUrl, integrationCardManifest);
      const expected = "C_STTA_SalesOrder_WD_20(node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true)?$select=bp_id,created_at,node_key,so_id,currency_code,gross_amount,net_amount,lifecycle_status";
      expect(contentUrlWithSelect).toEqual(expected);
    });
    it("should append only the select query parameters when expand parameters are missing", () => {
      const contentUrl = "C_STTA_SalesOrder_WD_20(node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true)?{{parameters._contentSelectQuery}}";
      const integrationCardManifest = {
        _version: "1.15.0",
        "sap.card": {
          extension: "module:sap/manifests/ap/common/extensions/BaseIntegrationCardExtension",
          type: "Object",
          configuration: {
            parameters: {
              _contentSelectQuery: {
                value: "$select=node_key,so_id,bp_id,currency_code,gross_amount,net_amount,lifecycle_status"
              },
              _headerSelectQuery: {
                value: "$select=bp_id,created_at"
              },
              _contentExpandQuery: {
                value: ""
              },
              _headerExpandQuery: {
                value: ""
              }
            }
          }
        }
      };
      const contentUrlWithSelect = updateSelectQuery(contentUrl, integrationCardManifest);
      const contentUrlWithSelectAndExpand = updateExpandQuery(contentUrlWithSelect, integrationCardManifest);
      const expected = "C_STTA_SalesOrder_WD_20(node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true)?$select=bp_id,created_at,node_key,so_id,currency_code,gross_amount,net_amount,lifecycle_status";
      expect(contentUrlWithSelect).toEqual(expected);
      expect(contentUrlWithSelectAndExpand).toEqual(expected);
    });
    it("should append both select and expand query parameters, even if they are not in the contentUrl", () => {
      const contentUrl = "C_STTA_SalesOrder_WD_20(node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true)";
      const integrationCardManifest = {
        _version: "1.15.0",
        "sap.card": {
          extension: "module:sap/manifests/ap/common/extensions/BaseIntegrationCardExtension",
          type: "Object",
          configuration: {
            parameters: {
              _contentSelectQuery: {
                value: "$select=node_key,so_id,bp_id,currency_code,gross_amount,net_amount,lifecycle_status"
              },
              _headerSelectQuery: {
                value: "$select=bp_id,created_at"
              },
              _contentExpandQuery: {
                value: "&$expand=to_Currency,to_BillingStatus,to_LifecycleStatus"
              },
              _headerExpandQuery: {
                value: "&$expand=to_Currency"
              }
            }
          }
        }
      };
      const contentUrlWithSelect = updateSelectQuery(contentUrl, integrationCardManifest);
      const contentUrlWithSelectAndExpand = updateExpandQuery(contentUrlWithSelect, integrationCardManifest);
      const expected = "C_STTA_SalesOrder_WD_20(node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true)?$select=bp_id,created_at,node_key,so_id,currency_code,gross_amount,net_amount,lifecycle_status&$expand=to_Currency,to_BillingStatus,to_LifecycleStatus";
      expect(contentUrlWithSelectAndExpand).toEqual(expected);
    });
    it("should append both select and expand query parameters when both are present and are part of contentUrl", () => {
      const contentUrl = "C_STTA_SalesOrder_WD_20(node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true)?{{parameters._contentSelectQuery}}{{parameters._contentExpandQuery}}";
      const integrationCardManifest = {
        _version: "1.15.0",
        "sap.card": {
          extension: "module:sap/manifests/ap/common/extensions/BaseIntegrationCardExtension",
          type: "Object",
          configuration: {
            parameters: {
              _contentSelectQuery: {
                value: "$select=node_key,so_id,bp_id,currency_code,gross_amount,net_amount,lifecycle_status"
              },
              _headerSelectQuery: {
                value: "$select=bp_id,created_at,to_BillingStatus/Status_Text"
              },
              _contentExpandQuery: {
                value: "&$expand=to_Currency,to_BillingStatus,to_LifecycleStatus"
              },
              _headerExpandQuery: {
                value: "&$expand=to_Currency,to_BusinessPartner"
              }
            }
          }
        }
      };
      const contentUrlWthSelect = updateSelectQuery(contentUrl, integrationCardManifest);
      const contentUrlWthSelectAndExpand = updateExpandQuery(contentUrlWthSelect, integrationCardManifest);
      const expected = "C_STTA_SalesOrder_WD_20(node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true)?$select=bp_id,created_at,to_BillingStatus/Status_Text,node_key,so_id,currency_code,gross_amount,net_amount,lifecycle_status&$expand=to_Currency,to_BusinessPartner,to_BillingStatus,to_LifecycleStatus";
      expect(contentUrlWthSelectAndExpand).toEqual(expected);
    });
    it("should only add expand parameters when _contentSelectQuery and _headerSelectQuery are empty and both _contentSelectQuery and _contentExpandQuery are part of content url", () => {
      const contentUrl = "C_STTA_SalesOrder_WD_20(node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true)?{{parameters._contentSelectQuery}}{{parameters._contentExpandQuery}}";
      const integrationCardManifest = {
        _version: "1.15.0",
        "sap.card": {
          extension: "module:sap/manifests/ap/common/extensions/BaseIntegrationCardExtension",
          type: "Object",
          configuration: {
            parameters: {
              _contentSelectQuery: {
                value: ""
              },
              _headerSelectQuery: {
                value: ""
              },
              _contentExpandQuery: {
                value: "?$expand=to_Currency,to_BillingStatus,to_LifecycleStatus"
              },
              _headerExpandQuery: {
                value: "?$expand=to_Currency,to_BusinessPartner"
              }
            }
          }
        }
      };
      const contentUrlWithSelect = updateSelectQuery(contentUrl, integrationCardManifest);
      const contentUrlWithSelectAndExpand = updateExpandQuery(contentUrlWithSelect, integrationCardManifest);
      const expected = "C_STTA_SalesOrder_WD_20(node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true)?$expand=to_Currency,to_BusinessPartner,to_BillingStatus,to_LifecycleStatus";
      expect(contentUrlWithSelectAndExpand).toEqual(expected);
    });
    it("should only add expand parameters when _contentSelectQuery and _headerSelectQuery are empty and they are not part of content url", () => {
      const contentUrl = "C_STTA_SalesOrder_WD_20(node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true)";
      const integrationCardManifest = {
        _version: "1.15.0",
        "sap.card": {
          extension: "module:sap/manifests/ap/common/extensions/BaseIntegrationCardExtension",
          type: "Object",
          configuration: {
            parameters: {
              _contentSelectQuery: {
                value: ""
              },
              _headerSelectQuery: {
                value: ""
              },
              _contentExpandQuery: {
                value: "?$expand=to_Currency,to_BillingStatus,to_LifecycleStatus"
              },
              _headerExpandQuery: {
                value: "?$expand=to_Currency,to_BusinessPartner"
              }
            }
          }
        }
      };
      const contentUrlWithSelect = updateSelectQuery(contentUrl, integrationCardManifest);
      const contentUrlWithSelectAndExpand = updateExpandQuery(contentUrlWithSelect, integrationCardManifest);
      const expected = "C_STTA_SalesOrder_WD_20(node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true)?$expand=to_Currency,to_BusinessPartner,to_BillingStatus,to_LifecycleStatus";
      expect(contentUrlWithSelectAndExpand).toEqual(expected);
    });
    it("should add both expand and select when value exists for both", () => {
      const contentUrl = "C_STTA_SalesOrder_WD_20(node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true)";
      const integrationCardManifest = {
        _version: "1.15.0",
        "sap.card": {
          extension: "module:sap/manifests/ap/common/extensions/BaseIntegrationCardExtension",
          type: "Object",
          configuration: {
            parameters: {
              _contentSelectQuery: {
                value: "$select=gross_amount,net_amount"
              },
              _headerSelectQuery: {
                value: "$select=gross_amount,net_amount,tax_amount,to_BillingStatus"
              },
              _contentExpandQuery: {
                value: "&$expand=to_BillingStatus($select=status_code,Status_Text),to_LifecycleStatus"
              },
              _headerExpandQuery: {
                value: "&$expand=to_BillingStatus($select=status_code),to_LifecycleStatus,to_Currency"
              }
            }
          }
        }
      };
      const contentUrlWithSelect = updateSelectQuery(contentUrl, integrationCardManifest);
      const contentUrlWithSelectAndExpand = updateExpandQuery(contentUrlWithSelect, integrationCardManifest);
      const expected = "C_STTA_SalesOrder_WD_20(node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true)?$select=gross_amount,net_amount,tax_amount,to_BillingStatus&$expand=to_BillingStatus($select=status_code,Status_Text),to_LifecycleStatus,to_Currency";
      expect(contentUrlWithSelectAndExpand).toEqual(expected);
    });
  });
  describe("getSeparatedProperties", () => {
    it("Both normal navigation properties and navigation properties with select should be separated", () => {
      const expandQueryParams = ["to_BillingStatus($select=status_code)", "to_LifecycleStatus", "to_Currency", "to_BillingStatus($select=status_code", "Status_Text)"];
      const result = getSeparatedProperties(expandQueryParams);
      expect(result).toEqual({
        navigationPropertiesWithSelect: ["to_BillingStatus($select=status_code)", "to_BillingStatus($select=status_code,Status_Text)"],
        navigationProperties: ["to_LifecycleStatus", "to_Currency"]
      });
    });
    it("Multiple navigation properties with select should be separated", () => {
      const expandQueryParams = ["to_BillingStatus($select=status_code", "Status_Text)", "to_BusinessPartner($select=id", "name", "address)", "to_sales($select=netAmount", "totalAmount", "taxAmount)"];
      const result = getSeparatedProperties(expandQueryParams);
      expect(result).toEqual({
        navigationPropertiesWithSelect: ["to_BillingStatus($select=status_code,Status_Text)", "to_BusinessPartner($select=id,name,address)", "to_sales($select=netAmount,totalAmount,taxAmount)"],
        navigationProperties: []
      });
    });
    it("single navigation property with $select should be processed properly by the function", () => {
      const expandQueryParams = ["to_BillingStatus($select=status_code)"];
      const result = getSeparatedProperties(expandQueryParams);
      expect(result).toEqual({
        navigationPropertiesWithSelect: ["to_BillingStatus($select=status_code)"],
        navigationProperties: []
      });
    });
  });
});
//# sourceMappingURL=QueryBuilder.spec.js.map