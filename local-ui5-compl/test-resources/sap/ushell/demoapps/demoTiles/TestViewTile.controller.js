// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/thirdparty/hasher",
    "sap/ushell/utils/WindowUtils"
], function (
    Controller,
    hasher,
    WindowUtils
) {
    "use strict";

    return Controller.extend("sap.ushell.demo.demoTiles.TestViewTile", {
        _handleTilePress : function (oTileControl) {
            if (typeof oTileControl.attachPress === "function") {
                oTileControl.attachPress(function () {
                    if (typeof oTileControl.getTargetURL === "function") {
                        var sTargetURL = oTileControl.getTargetURL();
                        if (sTargetURL) {
                            if (sTargetURL[0] === "#") {
                                hasher.setHash(sTargetURL);
                            } else {
                                WindowUtils.openURL(sTargetURL, "_blank");
                            }
                        }
                    }
                });
            }
        }
    });
});
