/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/cards/ap/generator/odata/v2/MetadataAnalyzer"], function (sap_cards_ap_generator_odata_v2_MetadataAnalyzer) {
  "use strict";

  const getNavigationPropertyInfoFromEntity = sap_cards_ap_generator_odata_v2_MetadataAnalyzer["getNavigationPropertyInfoFromEntity"];
  const getPropertyInfoFromEntity = sap_cards_ap_generator_odata_v2_MetadataAnalyzer["getPropertyInfoFromEntity"];
  const getPropertyReference = sap_cards_ap_generator_odata_v2_MetadataAnalyzer["getPropertyReference"];
  describe("Card CardGenerator", () => {
    let mockMetaData;
    beforeEach(() => {
      mockMetaData = {
        getMetaModel: () => {
          return {
            getODataEntityContainer: () => {
              return {
                entitySet: [{
                  name: "C_STTA_SalesOrder_WD_20",
                  entityType: "STTA_SALES_ORDER_WD_20_SRV.C_STTA_SalesOrder_WD_20Type"
                }]
              };
            },
            getODataEntitySet: entitySetName => {
              const entitySet = [{
                name: "C_STTA_SalesOrder_WD_20",
                entityType: "STTA_SALES_ORDER_WD_20_SRV.C_STTA_SalesOrder_WD_20Type"
              }];
              return entitySet.filter(entity => entity.name === entitySetName)[0];
            },
            getODataEntityType: path => {
              if (path !== "STTA_SALES_ORDER_WD_20_SRV.I_AIVS_Confirm_StatusType") {
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
                    "com.sap.vocabularies.Common.v1.Label": {
                      String: "Node Key"
                    }
                  }, {
                    name: "IsActiveEntity",
                    type: "Edm.Boolean",
                    "com.sap.vocabularies.Common.v1.Label": {
                      String: "Is Active Entity"
                    }
                  }, {
                    name: "Product",
                    type: "Edm.String",
                    maxLength: "7",
                    "com.sap.vocabularies.Common.v1.Label": {
                      String: "Product"
                    },
                    "com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive": {
                      Bool: "true"
                    }
                  }, {
                    name: "ProductForEdit",
                    type: "Edm.String",
                    maxLength: "7"
                  }],
                  navigationProperty: [{
                    name: "to_BillingStatus",
                    relationship: "STTA_SALES_ORDER_WD_20_SRV.assoc_3E1B3FFAFCE6372E0575D426A7553246",
                    fromRole: "FromRole_assoc_3E1B3FFAFCE6372E0575D426A7553246",
                    toRole: "ToRole_assoc_3E1B3FFAFCE6372E0575D426A7553246"
                  }]
                };
              } else {
                return {
                  key: {
                    propertyRef: [{
                      name: "Status"
                    }]
                  },
                  property: [{
                    name: "Status",
                    type: "Edm.String",
                    nullable: "false",
                    maxLength: "10",
                    "sap:display-format": "UpperCase",
                    "com.sap.vocabularies.Common.v1.IsUpperCase": {
                      Bool: "true"
                    },
                    "sap:text": "Status_Text",
                    "com.sap.vocabularies.Common.v1.Text": {
                      Path: "Status_Text"
                    },
                    "sap:label": "Lower Value",
                    "com.sap.vocabularies.Common.v1.Label": {
                      String: "Lower Value"
                    }
                  }, {
                    name: "Status_Text",
                    type: "Edm.String",
                    maxLength: "60",
                    "sap:label": "Confirmation",
                    "com.sap.vocabularies.Common.v1.Label": {
                      String: "Confirmation"
                    }
                  }]
                };
              }
            },
            getODataAssociationEnd: () => {
              return {
                type: "STTA_SALES_ORDER_WD_20_SRV.I_AIVS_Confirm_StatusType",
                multiplicity: "0..1",
                role: "ToRole_assoc_3E1B3FFAFCE6372E0575D426A7553246"
              };
            }
          };
        }
      };
    });
    const resourceBundle = {
      getText: jest.fn().mockImplementation(key => {
        if (key === "GENERATOR_CARD_SELECT_NAV_PROP") return "Select a Navigational Property:";
        if (key === "CRITICALITY_CONTROL_SELECT_PROP") return "Select a Property:";
      })
    };
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("validate function getPropertyReference", () => {
      const referenceValue = getPropertyReference(mockMetaData, "C_STTA_SalesOrder_WD_20");
      expect(referenceValue).toMatchSnapshot();
    });
    test("validate function getPropertyInfoFromEntity", () => {
      const referenceValue = getPropertyInfoFromEntity(mockMetaData, "C_STTA_SalesOrder_WD_20", false);
      expect(referenceValue).toMatchSnapshot();
    });
    test("validate function getPropertyInfoFromEntity with navigation", () => {
      const referenceValue = getPropertyInfoFromEntity(mockMetaData, "C_STTA_SalesOrder_WD_20", true, resourceBundle);
      expect(referenceValue).toMatchSnapshot();
    });
    test("validate function getNavigationPropertyInfoFromEntity", () => {
      const referenceValue = getNavigationPropertyInfoFromEntity(mockMetaData, "C_STTA_SalesOrder_WD_20");
      expect(referenceValue).toMatchSnapshot();
    });
  });
});
//# sourceMappingURL=MetadataAnalyzer.spec.js.map