// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([], function () {
    "use strict";

    return {
        "sap.app": {
            id: "link1",
            title: "I am a link",
            subTitle: "in a compact format"
        },
        "sap.flp": {
            target: {
                type: "URL",
                url: "https://fiorilaunchpad.sap.com/sites#lunch-menu&/favorites/?language=de"
            },
            vizOptions: {
                displayFormats: {
                    supported: ["standard", "standardWide", "flat", "flatWide", "compact"],
                    default: "compact"
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
