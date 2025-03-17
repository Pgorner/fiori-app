// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define(["sap/ui/core/UIComponent"], function (UIComponent) {
    "use strict";

    return UIComponent.extend("sap.ushell.demo.bookmarkstate.Component", {
        metadata: {
            version: "1.132.1",
            library: "sap.ushell.demo.bookmarkstate",
            includes: [],
            dependencies: {
                libs: ["sap.m"],
                components: []
            },
            config: {
                title: "Bookmark With State",
                fullWidth: true
            },
            rootView: {
                viewName: "sap.ushell.demo.bookmarkstate.bookmark",
                type: "XML",
                async: true
            }
        }
    });
});
