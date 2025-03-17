(function () {
    'use strict';
    window["sap-ushell-config"] = {
        apps: {
            inputFieldHistory: {
                enabled: true
            },
            insights: {
                enabled: true
            }
        },
        defaultRenderer: "fiori2",
        renderers: {
            fiori2: {
                componentData: {
                    config: {
                        search: "hidden",
                        sapHorizonEnabled: true,
                        searchBusinessObjects: "hidden",
                        rootIntent: "Shell-home",
                        sizeBehaviorConfigurable: true,
                        preloadLibrariesForRootIntent: false
                    }
                }
            }
        },
        bootstrapPlugins: {
            "RuntimeAuthoringPlugin": {
                "component": "sap.ushell.plugins.rta",
                "config": {
                    validateAppVersion: false
                }
            }
        },
        services: {
            ClientSideTargetResolution: {
                adapter: {
                    config: {
                        inbounds: {}
                    }
                }
            }
        },
        applications: {
            "Demo-FilterSettings": {
                additionalInformation: "SAPUI5.Component=demoFilterSettings",
                applicationType: "URL",
                title: "Demo Filter Settings",
                description: "Settings in SFB",
                url: "./demoFilterSettings/webapp"
            },
            "Demo-ObjectPageSections": {
                additionalInformation: "SAPUI5.Component=demoObjectPageSections",
                applicationType: "URL",
                title: "Demo ObjectPage Sections",
                description: "Sections Structure",
                url: "./demoObjectPageSections/webapp"
            },
            "Demo-ObjectPagePathSupport": {
                additionalInformation: "SAPUI5.Component=demoObjectPagePathSupport",
                applicationType: "URL",
                title: "Demo ObjectPage inverse navigation",
                description: "Validate inverse navigation",
                url: "./demoObjectPagePathSupport/webapp"
            },
            "Demo-ObjectPageExtensions": {
                additionalInformation: "SAPUI5.Component=demoObjectPageExtensions",
                applicationType: "URL",
                title: "Demo ObjectPage Extensions",
                description: "Possible View Extensions",
                url: "./demoObjectPageExtensions/webapp"
            },
            "STTAMPTT-STTAMPTT": {
                additionalInformation: "SAPUI5.Component=STTAMPTT",
                applicationType: "URL",
                title: "List report with tree table",
                description: "Tree table",
                url: "./sample.stta.prod.man.treetable/webapp"
            },
            "EPMProduct-manage_st": {
                additionalInformation: "SAPUI5.Component=STTA_MP",
                applicationType: "URL",
                title: "Manage Products (STTA)",
                description: "Technical Reference Application",
                url: "./sample.stta.manage.products/webapp"
            },

            "SalesOrder-nondraft": {
                additionalInformation: "SAPUI5.Component=STTA_SO_ND",
                applicationType: "URL",
                title: "Sales Order Non Draft",
                description: "Technical Reference Application",
                url: "./sample.stta.sales.order.nd/webapp"
            },
            "SalesOrder-itemaggregation": {
                additionalInformation: "SAPUI5.Component=SOITMAGGR",
                applicationType: "URL",
                title: "Sales Order Items Aggregation",
                description: "Sales Order Items Aggregation",
                url: "./sample.stta.sales.order.item.aggregation/webapp"
            },
            "SalesOrder-TableTabs": {
                additionalInformation: "SAPUI5.Component=ManageSalesOrderWithTableTabs",
                applicationType: "URL",
                title: "Sales Order with Table Tabs",
                description: "Sales Order with Table Tabs",
                url: "./sample.stta.sales.order.tabletabs/webapp"
            },
            "SalesOrder-SegButtons": {
                additionalInformation: "SAPUI5.Component=ManageSalesOrderWithSegButtons",
                applicationType: "URL",
                title: "Sales Order with Segmented Buttons in FCL",
                description: "Sales Order with Segmented Buttons in FCL",
                url: "./sample.stta.sales.order.segbuttons/webapp"
            },
            "SalesOrder-Worklist": {
                additionalInformation: "SAPUI5.Component=sttasalesorderwklt",
                applicationType: "URL",
                title: "Sales Order Worklist",
                description: "Technical Reference Application",
                url: "./sample.stta.sales.order.worklist/webapp"
            },
            "SalesOrder-List": {
                additionalInformation: "SAPUI5.Component=SalesOrderSmartList",
                applicationType: "URL",
                title: "Sales Order SmartList",
                description: "Technical Reference Application",
                url: "./sample.stta.sales.order.smartlist/webapp"
            },
            "SalesOrder-MultiViews": {
                additionalInformation: "SAPUI5.Component=SOMULTIENTITY",
                applicationType: "URL",
                title: "Sales Order Multi EntitySets",
                description: "Technical Reference Application",
                url: "./sample.stta.sales.order.multi.entitysets/webapp"
            },
            "SalesOrderItems-EditableFieldFor": {
                additionalInformation: "SAPUI5.Component=SalesOrderItemEditableFieldFor",
                applicationType: "URL",
                title: "Sales Order Items using EditableFieldFor",
                description: "Technical Reference Application",
                url: "./stta.sales.order.item.editableFieldFor/webapp"
            },
            "STTASOWD20SE-STTASOWD20SE": {
                additionalInformation: "SAPUI5.Component=SOwoExtSE",
                applicationType: "URL",
                title: "Sales Order with Draft SE",
                description: "STTA w/o Extension SE",
                url: "./sample.stta.sales.order.no.extensions_se/webapp"
            },
            "STTASOWD20-STTASOWD20": {
                additionalInformation: "SAPUI5.Component=SOwoExt",
                applicationType: "URL",
                title: "Sales Order with Draft",
                description: "STTA w/o Extension",
                url: "./sample.stta.sales.order.no.extensions/webapp"
            },
            "EPMProduct-displayFactSheet": {
                additionalInformation: "SAPUI5.Component=ManageProductsNS2",
                applicationType: "URL",
                title: "Manage Products",
                description: "EPM",
                url: "./sample.manage.products/webapp"
            },
            "SalesOrder-nondraftdisplay": {
                additionalInformation: "SAPUI5.Component=anondraftapp",
                applicationType: "URL",
                title: "Manage Sales Orders",
                description: "Non-draft",
                url: "./sample.nondraft.sales.orders/webapp"
            },
            "SalesOrder-display": {
                additionalInformation: "SAPUI5.Component=SalesOrdersNS",
                applicationType: "URL",
                title: "Manage Sales Orders",
                description: "Draft",
                url: "./sample.sales.orders/webapp"
            },
            "alp-display": {
                additionalInformation: "SAPUI5.Component=analytics2",
                applicationType: "URL",
                title: "Analytical List Page",
                description: "ALP",
                url: "./sample.analytical.list.page/webapp"
            },
            "alp-multitabledisplay": {
                additionalInformation: "SAPUI5.Component=analytics6",
                applicationType: "URL",
                title: "Analytical List Page with MultiTable",
                description: "ALP",
                url: "./sample.analytical.list.page.multitable/webapp"
            },
            "alpwp-display": {
                additionalInformation: "SAPUI5.Component=sample.analytical.list.page.with.params",
                applicationType: "URL",
                title: "Analytical List Page with Parameter",
                description: "ALP",
                url: "./sample.analytical.list.page.with.params/webapp"
            },
            "alpWithSettings-display": {
                additionalInformation: "SAPUI5.Component=analytics3",
                applicationType: "URL",
                title: "Analytical List Page with settings",
                description: "ALP",
                url: "./sample.analytical.list.page.settings/webapp"
            },
            "alpWithExtensions-display": {
                additionalInformation: "SAPUI5.Component=analytics4",
                applicationType: "URL",
                title: "Analytical List Page with Extensions",
                description: "ALP",
                url: "./sample.analytical.list.page.ext/webapp"
            },
            "alpWithTreeTable-display": {
                additionalInformation: "SAPUI5.Component=analytics5",
                applicationType: "URL",
                title: "Analytical List Page with TreeTable",
                description: "ALP",
                url: "./sample.analytical.list.page.treetable/webapp"
            },
            "lrwp-display": {
                additionalInformation: "SAPUI5.Component=sample.stta.with.params",
                applicationType: "URL",
                title: "List Report with Parameter",
                description: "LR",
                url: "./sample.stta.with.params/webapp"
            },
            "EPMManageProduct-displayFactSheet": {
                additionalInformation: "SAPUI5.Component=epmprodman",
                applicationType: "URL",
                title: "Manage Products",
                description: "EPM Reference App",
                url: "./sample.epm.manage.products/webapp"
            },
            "SalesOrder-nondraftshowcase": {
                additionalInformation: "SAPUI5.Component=nondraftshowcase",
                applicationType: "URL",
                title: "Manage Sales Orders Showcase",
                description: "Fiori elements showcase app",
                url: "./sample.nondraft.showcase/webapp"
            },
            "BusinessPartner-displayFactSheet": {
                additionalInformation: "SAPUI5.Component=SOBUPA",
                applicationType: "URL",
                title: "Business Partner",
                description: "Factsheet",
                url: "./sample.stta.business.partner/webapp"
            },
            "IntelligentPrompt-summarize": {
                additionalInformation: "SAPUI5.Component=ux.eng.fioriai.reuse",
                title: "Summarize Service",
                url: "./ux.eng.fioriai.reuse/dist"
            },
            "IntelligentPrompt-filter": {
                additionalInformation: "SAPUI5.Component=ux.eng.fioriai.reuse",
                title: "Easy Filter",
                url: "./ux.eng.fioriai.reuse/dist"
            },
            "IntelligentPrompt-explain": {
                additionalInformation: "SAPUI5.Component=ux.eng.fioriai.reuse",
                title: "Error Explanation",
                url: "./ux.eng.fioriai.reuse/dist"
            }
        }
    };

    // Add inbounds to ClientSideTargetResolution service
    var oInbound = window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.inbounds;

    ["EPMProduct", "Supplier", "SalesOrder"].forEach(function (sSemanticObject) {
        var sTraceAppKey = sSemanticObject + "-trace";
        var sBetaAppKey = sSemanticObject + "-beta";

        if (!oInbound[sTraceAppKey]) {
            oInbound[sTraceAppKey] = {
                "semanticObject": sSemanticObject,
                "action": "trace",
                "title": "Trace Navigation Parameters",
                "signature": {
                    "parameters": {},
                    "additionalParameters": "allowed"
                },
                "resolutionResult": {
                    "description": "Trace Navigation Parameters",
                    "ui5ComponentName": "sap.ushell.demo.ReceiveParametersTestApp",
                    "url": "../../../../../../../test-resources/sap/ushell/demoapps/ReceiveParametersTestApp"
                }
            };
        }

        if (!oInbound[sBetaAppKey]) {
            oInbound[sBetaAppKey] = {
                "semanticObject": sSemanticObject,
                "action": "beta",
                "title": "Trace Navigation Parameters - Beta Version",
                "signature": {
                    "parameters": {},
                    "additionalParameters": "allowed"
                },
                "resolutionResult": {
                    "description": "Trace Navigation Parameters - Beta Version",
                    "ui5ComponentName": "sap.ushell.demo.ReceiveParametersTestApp",
                    "url": "../../../../../../../test-resources/sap/ushell/demoapps/ReceiveParametersTestApp"
                }
            }
        }
    });
    
})();
