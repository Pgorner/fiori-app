sap.ui.define(["sap/ovp/cards/custom/Component"], function (CustomCardComponent) {
    "use strict";

    return CustomCardComponent.extend("bookshop.ext.table.Component", {
        metadata: {
            properties: {
                contentFragment: {
                    type: "string",
                    defaultValue: "bookshop.ext.table.Table",
                },
                annotationPath: {
                    type: "string",
                    defaultValue: "com.sap.vocabularies.UI.v1.LineItem",
                },
                countHeaderFragment: {
                    type: "string",
                    defaultValue: "sap.ovp.cards.generic.CountHeader",
                },
                footerFragment: {
                    type: "string",
                    defaultValue: "sap.ovp.cards.generic.CountFooter",
                },
                headerExtensionFragment: {
                    type: "string",
                    defaultValue: "sap.ovp.cards.generic.KPIHeader",
                },
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
                        controllerName: "bookshop.ext.table.Table",
                    },
                },
            },
        },
    });
});