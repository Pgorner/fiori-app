// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/core/mvc/XMLView",
    "sap/base/util/ObjectPath",
    "sap/ushell/Container"
], function (
    UIComponent,
    XMLView,
    ObjectPath,
    Container // required for bootstrap
) {
    "use strict";

    return UIComponent.extend("sap.ushell.sample.AddBookmarkButton.Component", {
        metadata: {
            library: "sap.ushell",
            dependencies: {
                libs: [
                    "sap.ushell",
                    "sap.ui.core",
                    "sap.ui.layout"
                ]
            },
            includes: [],
            config: {
                sample: {
                    stretch: true,
                    files: [
                        "AddBookmarkSample.view.xml",
                        "AddBookmarkSample.controller.js"
                    ]
                }
            },
            interfaces: ["sap.ui.core.IAsyncContentCreation"]
        },
        createContent: function () {
            ObjectPath.set("sap-ushell-config.services.LaunchPage.adapter.config.groups", [
                {
                    id: "group_0",
                    title: "Home Group",
                    isPreset: true,
                    isVisible: true,
                    isGroupLocked: false,
                    tiles: []
                },
                {
                    id: "group_1",
                    title: "Sample Group",
                    isPreset: true,
                    isVisible: true,
                    isGroupLocked: false,
                    tiles: []
                }
            ]);

            return Promise.resolve()
                .then(function () {
                    return Container.init("local");
                })
                .then(function () {
                    return XMLView.create({
                        viewName: "sap.ushell.sample.AddBookmarkButton.AddBookmarkSample"
                    });
                });
        }
    });
});
