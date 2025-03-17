(() => {
    "use strict";
    window["sap-ushell-config"] = {
        defaultRenderer: "fiori2",
        applications: {
            "product-display": {
                title: "Display Product Catalog",
                description: "Fiori Elements v4",
                additionalInformation: "SAPUI5.Component=sap.ui.demoapps.rta.fev4",
                applicationType: "URL",
                url: "../",
                navigationMode: "embedded"
            }
        },
        bootstrapPlugins: {
            RuntimeAuthoringPlugin: {
                component: "sap.ushell.plugins.rta",
                config: {
                    validateAppVersion: false
                }
            }
        }
    };
})();