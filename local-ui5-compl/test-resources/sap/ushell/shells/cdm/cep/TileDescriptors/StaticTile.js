// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([], function () {
    "use strict";

    return {
        "sap.ui": {
            icons: {
                icon: "sap-icon://Fiori9/F1354"
            }
        },
        "sap.app": {
            ach: "SLC-EVL",
            title: "Translate Evaluation Templates",
            subTitle: "Evaluation"
        },
        "sap.flp": {
            vizOptions: {
                displayFormats: {
                    supported: ["standard", "standardWide", "flat", "flatWide", "compact"],
                    default: "standard"
                }
            },
            target: {
                type: "IBN",
                appId: "uyz200pp_0D3DD649E4DE6B79D2AF02C3D904A3AF",
                inboundId: "ET090PW4NWFHYIXAAGVEZB82L",
                parameters: {
                    "sap-ui-tech-hint": {
                        value: {
                            value: "UI5",
                            format: "plain"
                        }
                    }
                }
            }
        },
        "sap.fiori": {
            registrationIds: ["F2198"]
        }
    };
});
