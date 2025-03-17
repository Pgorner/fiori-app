sap.ui.define(["sap/ovp/cards/custom/Component"], function (CustomCardComponent) {
    "use strict";

    return CustomCardComponent.extend("procurement.ext.list.Component", {
        metadata: {
            properties: {
                contentFragment: {
                    type: "string",
                    defaultValue: "procurement.ext.list.List",
                },
                annotationPath: {
                    type: "string",
                    defaultValue: "com.sap.vocabularies.UI.v1.LineItem",
                },
                countHeaderFragment: {
                    type: "string",
                    defaultValue: "sap.ovp.cards.generic.CountHeader",
                },
                headerExtensionFragment: {
                    type: "string",
                    defaultValue: "procurement.ext.list.KPIHeader"
                },
            },

            version: "@version@",

            library: "sap.ovp",

            includes: [],

            dependencies: {
                libs: ["sap.m", "sap.suite.ui.microchart"],
                components: [],
            },
            config: {},
            customizing: {
                "sap.ui.controllerExtensions": {
                    "sap.ovp.cards.generic.Card": {
                        controllerName: "procurement.ext.list.List",
                    },
                },
            },
        },
    });
});
