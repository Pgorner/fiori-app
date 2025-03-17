// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.VizInstanceLaunchPage
 * @deprecated As of version 1.120
 */

sap.ui.define([
    "sap/base/util/ObjectPath",
    "sap/ushell/ui/launchpad/VizInstanceLaunchPage",
    "sap/ushell/ui/launchpad/VizInstance",
    "sap/ushell/library",
    "sap/m/library"
], function (
    ObjectPath,
    VizInstanceLaunchPage,
    VizInstance,
    ushellLibrary,
    mobileLibrary
) {
    "use strict";

    var DisplayFormat = ushellLibrary.DisplayFormat;
    var LoadState = mobileLibrary.LoadState;

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox();

    QUnit.module("The constructor");

    QUnit.test("Stores the visualization data", function (assert) {
        // Arrange
        var oTestVizData = {
            title: "The title"
        };

        // Act
        var oVizInstance = new VizInstanceLaunchPage(oTestVizData);

        // Assert
        assert.ok(typeof oVizInstance, VizInstance, "The data was correctly saved to the instance");

        oVizInstance.destroy();
    });

    QUnit.test("Correctly assigns the content aggregation to the initial tile", function (assert) {
        // Arrange
        // Act
        var oVizInstance = new VizInstanceLaunchPage();

        // Assert
        var oTile = oVizInstance.getContent();
        assert.ok(oTile.isA("sap.m.GenericTile"), "The correct control type has been found.");
        assert.strictEqual(oTile.getState(), LoadState.Loaded, "The default state was correctly set");
        assert.strictEqual(oTile.getFrameType(), "OneByOne", "The default frame type was correctly set");

        // Cleanup
        oVizInstance.destroy();
    });

    QUnit.module("The load function", {
        beforeEach: function () {
            this.oLaunchpageTile = {
                launchPageTile: {
                    id: "launchPageTile"
                }
            };
            this.oVizData = {
                title: "The Title",
                subtitle: "The Subtitle",
                instantiationData: {
                    vizType: {
                        "sap.ui5": {
                            componentName: "sap.ushell.components.tiles.cdm.applauncher"
                        }
                    },
                    launchPageTile: this.oGetInstantiationDataStub
                }
            };
            this.oVizInstance = new VizInstanceLaunchPage(this.oVizData);
            this.oGetInstantiationDataStub = sandbox.stub(this.oVizInstance, "getInstantiationData");
            this.oGetInstantiationDataStub.returns(this.oLaunchpageTile);
            this.oSetContentStub = sandbox.stub(this.oVizInstance, "setContent");
            this.oSetSizeStub = sandbox.stub(this.oVizInstance, "_setSize");
            this.oTileView = {
                id: "tileView"
            };
            this.oGetCatalogTileViewControlStub = sandbox.stub().returns((new jQuery.Deferred()).resolve(this.oTileView));
            this.oGetTileViewStub = sandbox.stub().returns((new jQuery.Deferred()).resolve(this.oTileView));
            this.oGetTileSizeStub = sandbox.stub().returns("1x2");
            this.oGetServiceAsyncStub = sandbox.stub();
            this.oGetServiceAsyncStub.withArgs("FlpLaunchPage").resolves({
                getCatalogTileViewControl: this.oGetCatalogTileViewControlStub,
                getTileSize: this.oGetTileSizeStub,
                getTileView: this.oGetTileViewStub
            });

            var oContainer = ObjectPath.create("sap.ushell.Container");
            oContainer.getServiceAsync = this.oGetServiceAsyncStub;
        },
        afterEach: function () {
            sandbox.restore();
            this.oVizInstance.destroy();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("creates a VizInstanceLaunchPage tile successfully.", function (assert) {
        // Act
        return this.oVizInstance.load().then(function () {
            // Assert
            assert.strictEqual(this.oVizInstance.getDisplayFormat(), DisplayFormat.StandardWide, "The vizInstance's displayFormat was set correctly");
            assert.strictEqual(this.oSetSizeStub.callCount, 2, "The visualization size was set");

            assert.strictEqual(this.oSetContentStub.callCount, 1, "The visualization content was set");
            assert.strictEqual(this.oSetContentStub.getCall(0).args[0], this.oTileView, "The setContent of the visualization was called with the correct parameter.");

            assert.strictEqual(this.oGetInstantiationDataStub.callCount, 1, "The getInstantiationData was called once.");

            assert.strictEqual(this.oGetCatalogTileViewControlStub.callCount, 1, "The getCatalogTileViewControl was called once.");
            assert.deepEqual(this.oGetCatalogTileViewControlStub.getCall(0).args, [this.oLaunchpageTile.launchPageTile, false],
                "The getCatalogTileViewControl was called with the correct parameter.");
        }.bind(this));
    });

    QUnit.test("creates a VizInstanceLaunchPage group tile successfully when the catalog tile UI is not available", function (assert) {
        // Arrange
        this.oGetCatalogTileViewControlStub.returns((new jQuery.Deferred()).reject());
        this.oVizInstance.setPreview(true);

        // Act
        return this.oVizInstance.load().then(function () {
            // Assert
            assert.strictEqual(this.oVizInstance.getDisplayFormat(), DisplayFormat.StandardWide, "The vizInstance's tile size was set correctly");
            assert.strictEqual(this.oSetSizeStub.callCount, 2, "The visualization size was set");

            assert.strictEqual(this.oSetContentStub.callCount, 1, "The visualization content was set");
            assert.strictEqual(this.oSetContentStub.getCall(0).args[0], this.oTileView, "The setContent of the visualization was called with the correct parameter.");

            assert.strictEqual(this.oGetInstantiationDataStub.callCount, 1, "The getInstantiationData was called once.");

            assert.strictEqual(this.oGetCatalogTileViewControlStub.callCount, 1, "The getCatalogTileViewControl was called once.");
            assert.deepEqual(this.oGetCatalogTileViewControlStub.getCall(0).args, [this.oLaunchpageTile.launchPageTile, true],
                "The getCatalogTileViewControl was called with the correct parameter.");

            assert.strictEqual(this.oGetTileViewStub.callCount, 1, "The getTileView was called once.");
            assert.strictEqual(this.oGetTileViewStub.getCall(0).args[0], this.oLaunchpageTile.launchPageTile, "The getTileView was called with the correct parameter.");
        }.bind(this));
    });

    QUnit.test("returns a rejected promise when the VizInstanceLaunchPage could not be instantiated as catalog tile or group tile", function (assert) {
        // Arrange
        this.oGetCatalogTileViewControlStub.returns((new jQuery.Deferred()).reject());
        this.oGetTileViewStub.returns((new jQuery.Deferred()).reject());

        // Act
        return this.oVizInstance.load()
            .then(function () {
                assert.ok(false, "A VizInstanceLaunchPage tile was accidentally created.");
            })
            .catch(function () {
                // Assert
                assert.strictEqual(this.oGetInstantiationDataStub.callCount, 1, "The getInstantiationData was called once.");

                assert.strictEqual(this.oGetCatalogTileViewControlStub.callCount, 1, "The getCatalogTileViewControl was called once.");
                assert.strictEqual(this.oGetCatalogTileViewControlStub.getCall(0).args[0], this.oLaunchpageTile.launchPageTile, "The getCatalogTileViewControl was called with the correct parameter.");

                assert.strictEqual(this.oGetTileViewStub.callCount, 1, "The getTileView was called.");
                assert.strictEqual(this.oGetTileViewStub.getCall(0).args[0], this.oLaunchpageTile.launchPageTile, "The getTileView was called with the correct parameter.");
            }.bind(this));
    });

    QUnit.module("The function _setDisplayFormatFromTileSize", {
        beforeEach: function () {
            this.oVizInstance = new VizInstanceLaunchPage(this.oVizData);
            this.oTile = {
                id: "iAmATile"
            };
            this.oLaunchPageService = {
                getTileSize: sandbox.stub()
            };
        },
        afterEach: function () {
            this.oVizInstance.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Sets the display format to standard if the tile size is 1x1", function (assert) {
        //Arrange
        this.oLaunchPageService.getTileSize.withArgs(this.oTile).returns("1x1");

        //Act
        this.oVizInstance._setDisplayFormatFromTileSize(this.oTile, this.oLaunchPageService);

        //Assert
        assert.strictEqual(this.oVizInstance.getDisplayFormat(), DisplayFormat.Standard, "The correct display format was set");
    });

    QUnit.test("Sets the display format to standardWide if the tile size is 1x2", function (assert) {
        //Arrange
        this.oLaunchPageService.getTileSize.withArgs(this.oTile).returns("1x2");

        //Act
        this.oVizInstance._setDisplayFormatFromTileSize(this.oTile, this.oLaunchPageService);

        //Assert
        assert.strictEqual(this.oVizInstance.getDisplayFormat(), DisplayFormat.StandardWide, "The correct display format was set");
    });

    QUnit.test("Sets the display format to standard for any other tile size", function (assert) {
        //Arrange
        this.oLaunchPageService.getTileSize.withArgs(this.oTile).returns("3x4");

        //Act
        this.oVizInstance._setDisplayFormatFromTileSize(this.oTile, this.oLaunchPageService);

        //Assert
        assert.strictEqual(this.oVizInstance.getDisplayFormat(), DisplayFormat.Standard, "The correct display format was set");
    });

    QUnit.test("Sets the display format to standard if there is not tile size", function (assert) {
        //Arrange
        this.oLaunchPageService.getTileSize.withArgs(this.oTile).returns(undefined);

        //Act
        this.oVizInstance._setDisplayFormatFromTileSize(this.oTile, this.oLaunchPageService);

        //Assert
        assert.strictEqual(this.oVizInstance.getDisplayFormat(), DisplayFormat.Standard, "The correct display format was set");
    });
});
