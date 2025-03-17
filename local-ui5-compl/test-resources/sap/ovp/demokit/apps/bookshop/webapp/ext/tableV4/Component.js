sap.ui.define([
    "sap/ovp/cards/v4/custom/Component"
], function (
    OvpAppComponent
) {
    "use strict";

    /* component for custom card */

    return OvpAppComponent.extend("bookshop.ext.tableV4.Component", {
        // use inline declaration instead of component.json to save 1 round trip
        metadata: {
            properties: {
                contentFragment: {
                    type: "string",
                    defaultValue: "bookshop.ext.tableV4.tableV4"
                },
                annotationPath: {
                    type: "string",
                    defaultValue: "com.sap.vocabularies.UI.v1.LineItem"
                },
                countHeaderFragment: {
                    type: "string",
                    defaultValue: "sap.ovp.cards.v4.generic.CountHeader"
                },
                headerExtensionFragment: {
                    type: "string",
                    defaultValue: "sap.ovp.cards.v4.generic.KPIHeader"
                }
            },

            version: "@version@",

            library: "sap.ovp",

            includes: [],

            dependencies: {
                libs: ["sap.m"],
                components: [],
            },
            config: {},
            customizing: {
                "sap.ui.controllerExtensions": {
                    "sap.ovp.cards.generic.Card": {
                        controllerName: "bookshop.ext.tableV4.tableV4"
                    }
                }
            }
        }
    });
});
