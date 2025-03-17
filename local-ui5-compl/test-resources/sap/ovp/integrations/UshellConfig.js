(function() {
    "use strict";
    
    window["sap-ushell-config"] = {
        apps: {
            placeholder: {
                enabled: false,
            },
            insights : {
                enabled : true
            }
        },
        homeApp: {
            component: {
                name: "ux.eng.s4producthomes1"
            }
        },
        spaces: {
            enabled: true,
            myHome : {
                enabled: true
            }
        },
        defaultRenderer: "fiori2",
        renderers: {
            fiori2: {
                componentData: {
                    config: {
                        search: "hidden",
                    },
                },
            },
        },
        bootstrapPlugins: {
            RuntimeAuthoringPlugin: {
                component: "sap.ushell.plugins.rta",
                config: {
                    validateAppVersion: false,
                },
            },
            PersonalizePlugin: {
                component: "sap.ushell.plugins.rta-personalize",
                config: {
                    validateAppVersion: false,
                },
            },
        },
        ClientSideTargetResolution: {},
        NavTargetResolution: {
            config: {
                enableClientSideTargetResolution: false,
            },
        },
        applications: {
            "procurement-overview": {
                title: "Procurement Overview Page",
                description: "Procurement Overview Demo App",
                applicationType: "URL",
                url: "../demokit/apps/procurement/webapp",
                additionalInformation: "SAPUI5.Component=procurement",
            },
            "sales-overview": {
                title: "Sales Overview Page",
                description: "Sales Overview Demo App",
                applicationType: "URL",
                url: "../demokit/apps/sales/webapp",
                additionalInformation: "SAPUI5.Component=sales",
            },
            "browse-books": {
                title: "Browse Books (V4)",
                description: "Bookshop",
                applicationType: "URL",
                url: "../demokit/apps/bookshop/webapp",
                additionalInformation: "SAPUI5.Component=bookshop"
            },
            "books-overview": {
                title: "Custom Content App",
                description: "App contains custom card",
                applicationType: "URL",
                url: "../demokit/apps/books/webapp",
                additionalInformation: "SAPUI5.Component=books"
            },
            "saphanaoverview-display": {
                title: "SAP HANA overview",
                description: "Demo App",
                applicationType: "URL",
                url: "../demokit/apps/saphanaoverview/webapp",
                additionalInformation: "SAPUI5.Component=saphanaoverview"
            },
            "freestyle-inbound": {
                title: "Freestyle Inbound",
                description: "free style inbound",
                applicationType: "URL",
                url: "../demokit/apps/Freestyle-Inbound/webapp",
                additionalInformation: "SAPUI5.Component=Freestyle-Inbound"
            }
        },
    };
})();