// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/ui/launchpad/VizInstanceCdm"
], function (VizInstanceCdm) {
    "use strict";
    return new VizInstanceCdm({
        width: 2,
        height: 2,
        vizRefId: "00O2TR8035SJUP6AW43TU86X",
        title: "App State form sample",
        subtitle: "parameter Rename Case 1",
        icon: "../../../../../resources/sap/ushell/themes/base/img/SAPLogo.svg",
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
                    id: "sap.ushell.components.tiles.cdm.applauncherdynamic",
                    _version: "1.0.0",
                    type: "component",
                    applicationVersion: {
                        version: "1.0.0"
                    },
                    title: "",
                    description: "",
                    tags: {
                        keywords: []
                    },
                    ach: "CA-FLP-FE-COR"
                },
                "sap.ui": {
                    _version: "1.1.0",
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
                    componentName: "sap.ushell.components.tiles.cdm.applauncherdynamic",
                    dependencies: {
                        minUI5Version: "1.42",
                        libs: {
                            "sap.m": {}
                        }
                    },
                    rootView: {
                        viewName: "sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile",
                        type: "JS"
                    },
                    handleValidation: false
                }
            }
        },
        indicatorDataSource: {
            path: "../../test/counts/count1.json",
            toBeDeleted: true
        },
        contentProviderId: "",
        vizConfig: {
            "sap.flp": {
                target: {
                    appId: "appstateformsampledynamictile",
                    inboundId: "Action-toappstateformsample"
                },
                indicatorDataSource: {
                    path: "../../test/counts/count1.json",
                    toBeDeleted: true
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
        dataHelpId: "appstateformsampledynamictile",
        preview: false,
        targetURL: "#Action-toappstateformsample?sap-ui-app-id-hint=appstateformsampledynamictile",
        info: ""
    });
});
