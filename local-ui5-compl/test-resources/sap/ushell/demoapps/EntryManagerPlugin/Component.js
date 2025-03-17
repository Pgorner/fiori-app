// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/Component"
], function (Component) {
    "use strict";

    /*
    Demo plugin that extends FLP Spaces/Pages Menu with custom menu entries.
    The code dynamically replaces space05/page04 navigation menu with a custom subtree.
    The menu entry with id:"space05page4" should already exist in the initial site configuration.

    Do not replace top level menu entries: this leads to UI flickering.
    Replacement of the "space01" root menu entry is hier for internal test purposes only.
    Do not use it in production code.
    */
    return Component.extend("sap.ushell.demo.EntryManagerPlugin.Component", {
        init: function () {
            this.getComponentData().getExtensions("Menu").then(function (menuExtensions) {
                menuExtensions.getMenuEntryProvider(["space05page4", "space01"]).then(function (menuEntryProviders) {
                    menuEntryProviders.space05page4.setData({
                        "help-id": "Space-space05",
                        title: "My replace Page 4",
                        description: "Description of Page 4",
                        icon: "sap-icon://stethoscope",
                        type: "IBN",
                        target: {
                            semanticObject: "Launchpad",
                            action: "openFLPPage",
                            parameters: [{ name: "pageId", value: "page4" }, {
                                name: "spaceId",
                                value: "space05"
                            }]
                        },
                        menuEntries: [{
                            title: "Page 4-1",
                            description: "Description of Page 4-1",
                            icon: "sap-icon://stethoscope",
                            type: "IBN",
                            target: {
                                semanticObject: "Launchpad",
                                action: "openFLPPage",
                                parameters: [{ name: "pageId", value: "page4-1" }, {
                                    name: "spaceId",
                                    value: "space05"
                                }]
                            },
                            menuEntries: [{
                                title: "Page 4-1-1",
                                description: "Description of Page 4-1-1",
                                icon: "sap-icon://stethoscope",
                                type: "IBN",
                                target: {
                                    semanticObject: "Launchpad",
                                    action: "openFLPPage",
                                    parameters: [{ name: "pageId", value: "page4-1-1" }, {
                                        name: "spaceId",
                                        value: "space05"
                                    }]
                                }
                            }]
                        }, {
                            title: "My Page 5",
                            description: "Description of Page 5",
                            icon: "sap-icon://stethoscope",
                            type: "IBN",
                            target: {
                                semanticObject: "Launchpad",
                                action: "openFLPPage",
                                parameters: [{ name: "pageId", value: "page4" }, {
                                    name: "spaceId",
                                    value: "space05"
                                }]
                            }
                        }, {
                            title: "My Page 6",
                            description: "Description of Page 6",
                            icon: "sap-icon://stethoscope",
                            type: "IBN",
                            target: {
                                semanticObject: "Launchpad",
                                action: "openFLPPage",
                                parameters: [{ name: "pageId", value: "page4" }, {
                                    name: "spaceId",
                                    value: "space05"
                                }]
                            },
                            menuEntries: [{
                                title: "Page 6-1",
                                description: "Description of Page 6-1",
                                icon: "sap-icon://stethoscope",
                                type: "IBN",
                                target: {
                                    semanticObject: "Launchpad",
                                    action: "openFLPPage",
                                    parameters: [{ name: "pageId", value: "page6-1" }, {
                                        name: "spaceId",
                                        value: "space05"
                                    }]
                                }
                            }, {
                                title: "Page 6-2",
                                description: "Description of Page 6-2",
                                icon: "sap-icon://stethoscope",
                                type: "IBN",
                                target: {
                                    semanticObject: "Launchpad",
                                    action: "openFLPPage",
                                    parameters: [{ name: "pageId", value: "page6-2" }, {
                                        name: "spaceId",
                                        value: "space05"
                                    }]
                                }
                            }]
                        }]
                    });
                    menuEntryProviders.space01.setData({
                        id: "space01",
                        "help-id": "Space-space01",
                        title: "Space 1",
                        description: "Description of space 1",
                        icon: "sap-icon://syringe",
                        type: "IBN",
                        target: {
                            semanticObject: "Launchpad",
                            action: "openFLPPage",
                            parameters: [
                                { name: "pageId", value: "page1" },
                                { name: "spaceId", value: "space01" }
                            ]
                        },
                        menuEntries: [{
                            title: "Page 1-1",
                            description: "Description of Page 1-1",
                            icon: "sap-icon://stethoscope",
                            type: "IBN",
                            target: {
                                semanticObject: "Launchpad",
                                action: "openFLPPage",
                                parameters: [
                                    { name: "pageId", value: "page1" },
                                    { name: "spaceId", value: "space01" }
                                ]
                            }
                        }]
                    });
                });
            });
        },

        exit: function () {
        },

        metadata: {
            manifest: "json"
        }
    });
});
