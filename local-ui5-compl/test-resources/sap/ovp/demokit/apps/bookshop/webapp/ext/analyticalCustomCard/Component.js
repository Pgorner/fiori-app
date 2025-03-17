sap.ui.define(["sap/ovp/cards/custom/Component", "jquery.sap.global"], function(e, t) {
    "use strict";
    return e.extend("bookshop.ext.analyticalCustomCard.Component", {
        metadata: {
            properties: {
                contentFragment: {
                    type: "string",
                    defaultValue: "bookshop.ext.analyticalCustomCard.analyticalCustomCard"
                },
                headerFragment: {
                    type: "string",
                    defaultValue: ""
                },
                footerFragment: {
                    type: "string",
                    defaultValue: ""
                },
                includeSearchWithRelevantFilters: {
                    type: "boolean",
                    defaultValue: true
                }
            },
            version: "0.0.1",
            library: "sap.ovp",
            includes: [],
            dependencies: {
                libs: ["sap.m"],
                components: []
            },
            config: {},
            customizing: {
                "sap.ui.controllerExtensions": {
                    "sap.ovp.cards.generic.Card": {
                        controllerName: "bookshop.ext.analyticalCustomCard.analyticalCustomCard"
                    }
                }
            }
        }
    });
});