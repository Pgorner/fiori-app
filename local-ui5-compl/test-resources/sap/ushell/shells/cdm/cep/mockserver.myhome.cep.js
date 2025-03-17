// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview
 *
 * This serves as a mockserver for the CEP Content API.
 * The data is returned in the identical format that is expected from the backend.
 *
 */

(function () {
    "use strict";

    window["sap.ushell.bootstrap.callback"] = function () {
        sap.ui.require([
            "sap/ui/core/util/MockServer",
            "sap/ushell/shells/cdm/cep/CardDescriptors/ImageCard",
            "sap/ushell/shells/cdm/cep/CardDescriptors/OpenSalesOrdersCard",
            "sap/ushell/shells/cdm/cep/CardDescriptors/SalesOrderFulfillmentCard",
            "sap/ushell/shells/cdm/cep/CardDescriptors/SalesQuotationPipelineCard",
            "sap/ushell/shells/cdm/cep/CardDescriptors/TaskCenterCard",
            "sap/ushell/shells/cdm/cep/CardDescriptors/SFSFInfoCard",
            "sap/ushell/shells/cdm/cep/CardDescriptors/SFSFActionCard",
            "sap/ushell/shells/cdm/cep/WorkPages/WorkPageDemoMyHome"
        ], function (
            MockServer,
            DescriptorImageCard,
            DescriptorOpenSalesOrdersCard,
            DescriptorSalesOrderFulfillmentCard,
            DescriptorSalesQuotationPipelineCard,
            DescriptorTaskCenterCard,
            DescriptorSFSFInfoCard,
            DescriptorSFSFActionCard,
            WorkPageDemoMyHome
        ) {

            var oViz = {
                data: {
                    visualizations: {
                        nodes: [
                            {
                                id: "97176e7f-b2ea-4e31-842a-3efa5086b320",
                                type: "sap.card",
                                descriptor: { value: DescriptorImageCard },
                                descriptorResources: {
                                    baseUrl: "/content-repository/v2/cards",
                                    descriptorPath: "/sap.ushell.samplecards.imageCard/a297324049c0b349ef9309f11acc8da0"
                                }
                            },
                            {
                                id: "287e3392-00d9-4548-ba64-7055318f5565",
                                type: "sap.card",
                                descriptor: { value: DescriptorSFSFInfoCard },
                                descriptorResources: {
                                    baseUrl: "/content-repository/v2/cards",
                                    descriptorPath: "/successfactors.card.cardservicereuse.infocard/632c1620a565131f841015b059f6c381"
                                }
                            },
                            {
                                id: "25aa15f2-d26f-4070-84fa-6d47257fa95e",
                                type: "sap.card",
                                descriptor: { value: DescriptorSFSFActionCard },
                                descriptorResources: {
                                    baseUrl: "/content-repository/v2/cards",
                                    descriptorPath: "/successfactors.card.cardservicereuse.actioncard/c8390120d890edb6db19bb8837d7f60c"
                                }
                            },
                            {
                                id: "7adb5695-f954-4e5c-b8b7-ac947cff3ac9",
                                type: "sap.card",
                                descriptor: { value: DescriptorTaskCenterCard },
                                descriptorResources: {
                                    baseUrl: "https://cards.cpe.c.eu-de-1.cloud.sap",
                                    descriptorPath: ""
                                }
                            },
                            {
                                id: "2eef15de-0297-4514-a674-d50f3bedc677",
                                type: "sap.card",
                                descriptor: { value: DescriptorSalesOrderFulfillmentCard },
                                descriptorResources: {
                                    baseUrl: "",
                                    descriptorPath: ""
                                }
                            },
                            {
                                id: "1c06ebbd-aca0-4d14-8dcd-2ff39ed3f7c8",
                                type: "sap.card",
                                descriptor: { value: DescriptorSalesQuotationPipelineCard },
                                descriptorResources: {
                                    baseUrl: "",
                                    descriptorPath: ""
                                }
                            },
                            {
                                id: "90afeb68-70cc-460e-9b91-578c0357c28b",
                                type: "sap.card",
                                descriptor: { value: DescriptorOpenSalesOrdersCard },
                                descriptorResources: {
                                    baseUrl: "",
                                    descriptorPath: ""
                                }
                            }
                        ]
                    }
                }
            };

            /**
             * WorkPage for the MyHome case
             */
            var oWorkPageMyHome = {
                data: {
                    workPage: {
                        id: "6a559319-8878-40a9-b8b7-22dd81f3c208",
                        contents: WorkPageDemoMyHome
                    }
                }
            };

            var oWorkPageMyHomeWithUsedViz = {
                data: {
                    workPage: {
                        id: "6a559319-8878-40a9-b8b7-22dd81f3c208",
                        contents: WorkPageDemoMyHome,
                        usedVisualizations: {
                            nodes: oViz.data.visualizations.nodes
                        }
                    }
                }
            };

            var oMockServer = new MockServer({
                rootUri: "/",
                requests: [{
                    method: "GET",
                    path: new RegExp("(.)*\\/content/v1\\?query=(.)*"),
                    response: function (oXhr) {
                        if (oXhr.url.indexOf("workPage(") > -1 && oXhr.url.indexOf("usedVisualizations") > -1) {
                            oXhr.respond(
                                200,
                                { "Content-Type": "application/json;charset=utf-8" },
                                JSON.stringify(oWorkPageMyHomeWithUsedViz)
                            );
                        } else if (oXhr.url.indexOf("workPage(")) {
                            oXhr.respond(
                                200,
                                { "Content-Type": "application/json;charset=utf-8" },
                                JSON.stringify(oWorkPageMyHome)
                            );
                        } else {
                            oXhr.respond(400);
                        }

                        return true;
                    }
                }, {
                    method: "HEAD",
                    path: new RegExp("(.)*\\/graphql"),
                    response: function (oXhr) {
                        oXhr.respond(
                            200,
                            { "x-csrf-token": "csrf-token-by-mockserver" },
                            JSON.stringify(oViz)
                        );
                    }
                }]
            });
            oMockServer.start();
        });
    };
}());



