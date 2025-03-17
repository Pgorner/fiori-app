// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/ui/launchpad/VizInstanceCdm"
], function (VizInstanceCdm) {
    "use strict";
    return new VizInstanceCdm({
        width: 2,
        height: 2,
        vizRefId: "tile000000003",
        title: "Concur",
        subtitle: "absolute icon URL",
        icon: "https://www-us.api.concursolutions.com/appcenter/api/v3/listings/550353cc99066b13221bcded/images/57e5b5bab490ec6ac904e887",
        keywords: [],
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
            "sap.app": {
                title: "Concur",
                subTitle: "absolute icon URL"
            },
            "sap.ui": {
                icons: {
                    icon: "https://www-us.api.concursolutions.com/appcenter/api/v3/listings/550353cc99066b13221bcded/images/57e5b5bab490ec6ac904e887"
                },
                deviceTypes: {
                    desktop: true,
                    tablet: true,
                    phone: true
                }
            },
            "sap.flp": {
                target: {
                    type: "URL",
                    url: "https://www.concur.com/"
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
        dataHelpId: "sap.ushell.example.startURL.Concur",
        preview: false,
        targetURL: "https://www.concur.com/",
        info: ""
    });
});
