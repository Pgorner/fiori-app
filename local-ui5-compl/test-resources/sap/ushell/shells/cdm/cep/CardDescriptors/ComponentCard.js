// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([], function () {
    "use strict";

    return {
        "sap.ui": {
            icons: {
                icon: "sap-icon://technical-object"
            },
            technology: "UI5"
        },
        "sap.app": {
            id: "sap.ushell.samplecards.componentCard",
            info: "Additional information about this Card",
            tags: {
                keywords: [
                    "Component",
                    "Card",
                    "Sample"
                ]
            },
            type: "card",
            title: "Sample of a Component Content",
            subTitle: "Sample of a Component Content",
            shortTitle: "A short title for this Card",
            description: "A long description for this Card",
            applicationVersion: {
                version: "1.0.0"
            }
        },
        "sap.ui5": {
            rootView: {
                id: "samplecard",
                type: "XML",
                async: true,
                viewName: "sap.ushell.samplecards.componentCard.View"
            },
            dependencies: {
                libs: {
                    "sap.m": {}
                },
                minUI5Version: "1.38"
            }
        },
        _version: "1.15.0",
        "sap.card": {
            type: "Component"
        }
    };
});
