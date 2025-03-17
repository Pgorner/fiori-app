sap.ui.define([
    "sap/ovp/cards/generic/Component",
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/mockservers",
], function (genComponent, utils, mockservers) {
    "use strict";

    genComponent.extend("sap.ovp.test.qunit.cards.headerExtension.Component", {
        metadata: {
            properties: {
                contentFragment: {
                    type: "string",
                    defaultValue: "sap.ovp.cards.list.List",
                },
                headerExtensionFragment: {
                    type: "string",
                    defaultValue: "sap.ovp.test.qunit.cards.headerExtension.headerExtension",
                },
            },
            version: "1.132.0",
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
                        controllerName: "sap.ovp.cards.list.List",
                    },
                },
            },
        },
    });
});
