// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/ui/launchpad/VizInstanceCdm"
], function (VizInstanceCdm) {
    "use strict";
    return new VizInstanceCdm({
        width: 2,
        height: 2,
        vizRefId: "00O2TR8035SJUP6AW43TU86LR",
        title: "Title and icon Overwritten on Group",
        subtitle: "AppNavSample",
        icon: "sap-icon://family-care",
        keywords: [
            "keyword1"
        ],
        instantiationData: {
            platform: "CDM",
            vizType: {
                _version: "1.21.0",
                "sap.flp": {
                    type: "tile",
                    tileSize: "1x1",
                    vizOptions: {
                        displayFormats: {
                            supported: [
                                "standard",
                                "compact",
                                "flat",
                                "flatWide",
                                "standardWide"
                            ],
                            default: "standard"
                        }
                    }
                },
                "sap.app": {
                    id: "sap.ushell.components.tiles.cdm.applauncher",
                    type: "component",
                    applicationVersion: {
                        version: "1.0.0"
                    },
                    title: "",
                    tags: {
                        keywords: []
                    },
                    ach: "CA-FE-FLP-COR"
                },
                "sap.ui": {
                    _version: "1.1.0",
                    technology: "UI5",
                    icons: {
                        icon: ""
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: true
                    },
                    supportedThemes: [
                        "sap_hcb",
                        "sap_belize",
                        "sap_belize_plus"
                    ]
                },
                "sap.ui5": {
                    _version: "1.1.0",
                    componentName: "sap.ushell.components.tiles.cdm.applauncher",
                    dependencies: {
                        minUI5Version: "1.42",
                        libs: {
                            "sap.m": {}
                        }
                    },
                    rootView: {
                        viewName: "sap.ushell.components.tiles.cdm.applauncher.StaticTile",
                        type: "XML"
                    },
                    handleValidation: false,
                    contentDensities: {
                        compact: true,
                        cozy: true
                    }
                }
            }
        },
        contentProviderId: "",
        vizConfig: {
            "sap.flp": {
                target: {
                    appId: "sap.ushell.demo.AppNavSample",
                    inboundId: "inb1"
                }
            }
        },
        supportedDisplayFormats: [
            "standard",
            "compact",
            "flat",
            "flatWide",
            "standardWide"
        ],
        displayFormat: "standard",
        numberUnit: "",
        dataHelpId: "sap.ushell.demo.AppNavSample",
        preview: false,
        targetURL: "#Action-toappnavsample?sap-ui-app-id-hint=sap.ushell.demo.AppNavSample",
        info: ""
    });
});
