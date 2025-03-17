// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([], function () {
    "use strict";

    return {
        "sap.app": {
            title: "Capital Projects",
            subTitle: "All about Finance",
            info: "desktop only"
        },
        "sap.ui": {
            icons: {
                icon: "sap-icon://capital-projects"
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
                semanticObject: "Action",
                action: "toappnavsample"
            },
            indicatorDataSource: {
                path: "../../test/counts/v2/$count.txt",
                refresh: 300
            }
        }
    };
});



