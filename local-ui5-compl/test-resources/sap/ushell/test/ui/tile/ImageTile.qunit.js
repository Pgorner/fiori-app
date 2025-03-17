// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.ui.tile.ImageTile
 */
sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/ushell/ui/tile/ImageTile"
], function (jQuery, ImageTile) {
    "use strict";

    /*global QUnit */

    var demiTileData = {
        //TileBase Constructor arguments
        title: "testTileTitle",
        subtitle: "testTileSubTitle",
        icon: "sap-icon://world",
        info: "testInfo",
        targetURL: "#testTargetUrl",
        imageSource: "test"
    };
    var oTile,
        testContainer;

    QUnit.module("sap.ushell.ui.tile.ImageTile", {
        beforeEach: function () {
            oTile = new ImageTile(demiTileData);
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

    QUnit.test("Constructor Test", function (assert) {
        assert.deepEqual(oTile.getImageSource(), demiTileData.imageSource, "Image Source property test");
    });

    QUnit.test("Render Part - ImageTile wrapping structure Test", function (assert) {
        var fnDone = assert.async();
        var sSource = "/ushell/resources/sap/ushell/themes/base/img/grid.png";
        oTile.setImageSource(sSource);
        oTile.placeAt("testContainer");
        setTimeout(function () {
            var bSapUshellImageTileClassAdded = testContainer.find(".sapUshellImageTile").length > 0,
                sImageSrc = testContainer.find(".sapUshellImageTile").attr("src");

            //Check whether a span with sapUshellImageTile has been created.
            assert.ok(bSapUshellImageTileClassAdded, "Div with CSS Class: 'sapUshellImageTile' is added");
            assert.deepEqual(sImageSrc, sSource, "Image src is the same as configured");
            fnDone();
        }, 0);
    });
});
