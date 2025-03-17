// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([], function () {
    "use strict";

    return {
        "sap.app": {
            id: "tile1",
            title: "I am hungry",
            subTitle: "lets eat"
        },
        "sap.flp": {
            target: {
                type: "URL",
                url: "https://fiorilaunchpad.sap.com/sites#lunch-menu&/favorites/?language=de"
            },
            indicatorDataSource: {
                path: "/mockbackend/dynamictile",
                refresh: 60
            },
            vizOptions: {
                displayFormats: {
                    supported: ["standard", "standardWide", "flat", "flatWide", "compact"],
                    default: "standard"
                }
            }
        },
        "sap.ui": {
            icons: {
                icon: "sap-icon://meal"
            }

        }
    };
});
