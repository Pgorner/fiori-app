// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ushell/ui/tile/StaticTile",
    "sap/ui/thirdparty/hasher",
    "sap/ushell/utils/WindowUtils"
], function (UIComponent, StaticTile, hasher, WindowUtils) {
    "use strict";

    return UIComponent.extend("sap.ushell.demo.demoTiles.Component", {
        metadata: {
            version: "1.132.1",

            library: "sap.ushell.demo.demoTiles",

            dependencies: {
                libs: ["sap.m"]
            },

            config: {}
        },

        createContent: function () {
            var oComponentData = this.getComponentData && this.getComponentData();
            var oTile = new StaticTile(oComponentData.properties);
            oTile.attachPress(
                function () {
                    if (typeof this.getTargetURL === "function") {
                        var sTargetURL = this.getTargetURL();
                        if (sTargetURL) {
                            if (sTargetURL[0] === "#") {
                                hasher.setHash(sTargetURL);
                            } else {
                                WindowUtils.openURL(sTargetURL, "_blank");
                            }
                        }
                    }
                }
            );
            return oTile;
        }

    });
});

