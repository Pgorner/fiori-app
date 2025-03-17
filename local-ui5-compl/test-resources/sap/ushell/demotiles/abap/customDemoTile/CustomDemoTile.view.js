// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/mvc/View",
    "sap/m/GenericTile",
    "sap/m/TileContent",
    "sap/m/ImageContent",
    "sap/ushell/demotiles/abap/customDemoTile/CustomDemoTile.controller" // Controller needs to be preloaded
], function (View, GenericTile, TileContent, ImageContent) {
    "use strict";

    return View.extend("sap.ushell.demotiles.abap.customDemoTile.CustomDemoTile", {
        getControllerName: function () {
            return "sap.ushell.demotiles.abap.customDemoTile.CustomDemoTile";
        },
        createContent: function (oController) {
            return new GenericTile({
                header: "{/config/display_title_text}",
                subheader: "{/config/display_subtitle_text}",
                frameType: "{/frameType}",
                sizeBehavior: "{/sizeBehavior}",
                backgroundImage: "{/backgroundImage}",
                press: [ oController.onPress, oController ],
                content: new TileContent({
                    footer: "{/info}",
                    content: new ImageContent({
                        src: "{/icon}"
                    })
                })
            });
        }
    });
});
