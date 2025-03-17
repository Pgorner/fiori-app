// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.adapters.local.LaunchPageAdapter
 *
 * @deprecated since 1.112
 */
sap.ui.define([
    "sap/ushell/adapters/local/LaunchPageAdapter",
    "sap/ushell/Container"
], function (
    LaunchPageAdapter,
    Container
) {
    "use strict";

    /* global sinon, QUnit*/
    var sandbox = sinon.sandbox.create();
    QUnit.module("_getCatalogTileIndex", {
        beforeEach: function () {
            var oConfig = {
                config: {
                    groups: [],
                    catalogs: []
                }
            };

            this.oLaunchPageAdapter = new LaunchPageAdapter({}, {}, oConfig);
            sandbox.stub(Container, "getRendererInternal").withArgs("fiori2").returns({
                logRecentActivity: () => {}
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("returns the correct value", function (assert) {
        //Act
        return this.oLaunchPageAdapter._getCatalogTileIndex().then(function (oCatalogTileIndex) {
            // Assert
            assert.deepEqual(oCatalogTileIndex, {}, "An empty catalogTileIndex was returned");
        });
    });
});
