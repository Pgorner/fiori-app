// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/View",
    "sap/ushell/demotiles/cdm/newstile/NewsTileUtils",
    "sap/m/TileContent",
    "sap/m/NewsContent",
    "sap/m/GenericTile",
    "sap/m/SlideTile",
    "sap/ushell/demotiles/cdm/newstile/NewsTile.controller" // Controller needs to be preloaded
], function (
    View,
    NewsTileUtils,
    TileContent,
    NewsContent,
    GenericTile,
    SlideTile
) {
    "use strict";

    // ===========================================================================================
    //       This demo tile is only used for test content and shall not be used productively!
    // ===========================================================================================
    // The demo version does only support a limited set of features in comparison to the original news tile

    return View.extend("sap.ushell.demotiles.cdm.newstile.NewsTile", {
        getControllerName: function () {
            return "sap.ushell.demotiles.cdm.newstile.NewsTile";
        },

        createContent: function (oController) {
            var oConfig = oController.getOwnerComponent().getManifestEntry("/sap.ui5/config");
            var oComponentData = oController.getOwnerComponent().getComponentData();
            var oTileProperties = oComponentData.properties;

            this.setHeight("100%");

            //-----------------------------------------------******------------------------------------------\\
            var oResourceBundle = this.getController().getOwnerComponent().getModel("i18n").getResourceBundle();

            var oNewsTile = new GenericTile({
                frameType: "TwoByOne",
                header: "{header}",
                backgroundImage: "{image}",
                tileContent: [
                    new TileContent({
                        footer: {
                            path: "pubDate",
                            formatter: function (date) {
                                return NewsTileUtils.calculateFeedItemAge(date, oResourceBundle);
                            }
                        },
                        content: new NewsContent({
                            contentText: "{title}",
                            subheader: "{source}"
                        })
                    })
                ],
                press: function (evt) {
                    oController.select(evt);
                }
            });

            return new SlideTile(oController.createId("feedTile"), {
                displayTime: NewsTileUtils.getCycleIntervalConfig(oConfig, oTileProperties), // parseInt
                transitionTime: 500,
                tiles: {
                    path: "/items",
                    template: oNewsTile
                }
            });
        }
    });
});
