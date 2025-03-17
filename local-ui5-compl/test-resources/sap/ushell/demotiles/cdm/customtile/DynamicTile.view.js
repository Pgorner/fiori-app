// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/View",
    "sap/m/GenericTile",
    "sap/m/TileContent",
    "sap/m/NumericContent",
    "sap/m/library",
    "sap/ushell/demotiles/cdm/customtile/DynamicTile.controller" // Controller needs to be preloaded
], function (View, GenericTile, TileContent, NumericContent, mobileLibrary) {
    "use strict";

    // shortcut for sap.m.GenericTileMode
    var GenericTileMode = mobileLibrary.GenericTileMode;
    return View.extend("sap.ushell.demotiles.cdm.customtile.DynamicTile", {
        getControllerName: function () {
            return "sap.ushell.demotiles.cdm.customtile.DynamicTile";
        },

        createContent: function () {
            this.setHeight("100%");
            this.setWidth("100%");

            return this.getTileControl();
        },

        getTileControl: function () {
            var oController = this.getController();

            var oTile = new GenericTile({
                mode: GenericTileMode.ContentMode,
                header: "{/data/display_title_text}",
                subheader: "{/data/display_subtitle_text}",
                sizeBehavior: "{/sizeBehavior}",
                url: {
                    parts: ["/nav/navigation_target_url"],
                    formatter: oController.formatters.urlToExternal
                },
                // custom tile tag:
                backgroundImage: "{/backgroundImage}",
                tileContent: [new TileContent({
                    footer: "{/data/display_info_text}",
                    unit: "{/data/display_number_unit}",
                    // We'll utilize NumericContent for the "Dynamic" content.
                    content: [new NumericContent({
                        scale: "{/data/display_number_factor}",
                        value: "{/data/display_number_value}",
                        truncateValueTo: 5, // Otherwise, The default value is 4.
                        indicator: "{/data/display_state_arrow}",
                        valueColor: "{/data/display_number_state}",
                        icon: "{/data/display_icon_url}",
                        width: "100%"
                    })]
                })],
                press: [oController.onPress, oController],
                additionalTooltip: "{/properties/contentProviderLabel}"
            });
            return oTile;
        }
    });
});
