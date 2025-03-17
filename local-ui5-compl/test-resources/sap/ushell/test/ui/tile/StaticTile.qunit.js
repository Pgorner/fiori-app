// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.ui.tile.StaticTile
 * @deprecated As of version 1.120
 */
sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/ushell/ui/tile/StaticTile"
], function (jQuery, StaticTile) {
    "use strict";

    /*global QUnit */

    var demiTileData = {
        //TileBase Constructor arguments
        title: "testTileTitle",
        subtitle: "testTileSubTitle",
        icon: "sap-icon://world",
        info: "testInfo",
        targetURL: "#testTargetUrl"
    };
    var oTile,
        testContainer;

    QUnit.module("sap.ushell.ui.tile.StaticTile", {
        beforeEach: function () {
            oTile = new StaticTile(demiTileData);
            testContainer = jQuery('<div id="testContainer">').appendTo("body");
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        afterEach: function () {
            oTile.destroy();
            jQuery(testContainer).remove();
        }
    });

    QUnit.test("Render Part - StaticTile wrapping structure Test", function (assert) {
        var fnDone = assert.async();
        oTile.placeAt("testContainer");
        setTimeout(function () {
            var bSapUshellStaticTileClassAdded = testContainer.find(".sapUshellStaticTile").length > 0;

            //Check whether a span with sapUshellStaticTile has been created.
            assert.ok(bSapUshellStaticTileClassAdded, "Div with CSS Class: 'sapUshellStaticTile' is added");
            fnDone();
        }, 0);
    });
});
