// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([], function () {
    "use strict";

    return {
        "sap.app": {
            title: "Dynamic Tile",
            subTitle: "with dataSource from app"
        },
        "sap.ui": {
            icons: {
                icon: "sap-icon://number-sign"
            }
        },
        "sap.flp": {
            type: "tile",
            vizOptions: {
                displayFormats: {
                    supported: [
                        "standard",
                        "standardWide",
                        "compact",
                        "flat",
                        "flatWide"
                    ],
                    default: "standard"
                }
            },
            target: {
                type: "IBN",
                appId: "sap.ushell.demo.bookmark",
                inboundId: "target"
            },
            indicatorDataSource: {
                path: "count22.json",
                refresh: 300,
                dataSource: "indicator"
            }
        }
    };
});



