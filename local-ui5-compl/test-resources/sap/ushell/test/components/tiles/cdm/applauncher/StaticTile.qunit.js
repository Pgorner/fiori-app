// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/m/library",
    "sap/ushell/components/tiles/cdm/applauncher/Component",
    "sap/ushell/components/tiles/cdm/applauncher/StaticTile.controller",
    "sap/ushell/Config",
    "sap/ushell/Container"
], function(
    Log,
    mobileLibrary,
    AppLauncherComponent,
    Controller,
    Config,
    Container
) {
    "use strict";

    // shortcut for sap.m.TileSizeBehavior
    const TileSizeBehavior = mobileLibrary.TileSizeBehavior;

    // shortcut for sap.m.GenericTileMode
    const GenericTileMode = mobileLibrary.GenericTileMode;

    // shortcut for sap.m.GenericTileScope
    const GenericTileScope = mobileLibrary.GenericTileScope;

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox({});

    QUnit.module("sap.ushell.components.tiles.cdm.applauncher.Component", {
        beforeEach: function (assert) {
            var done = assert.async();
            Container.init("local").then(function () {
                done();
            });
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        afterEach: function () {
            sandbox.restore();
            this.oComponent.destroy();
        }
    });

    QUnit.test("Create StaticTile Component Test", function (assert) {
        this.oComponent = new AppLauncherComponent({
            componentData: {
                isCreated: true,
                properties: {},
                startupParameters: {}
            }
        });
        assert.ok(this.oComponent.getComponentData().isCreated, "Component should be created with component data as specified");
        return this.oComponent.rootControlLoaded();
    });

    QUnit.test("Component API tileSetVisualProperties : Static properties Test", function (assert) {
        var done = assert.async();

        var oComponentDataProperties = {
            title: "static_tile_1_title",
            subtitle: "static_tile_1_subtitle",
            icon: "static_tile_1_icon",
            targetURL: "#static_tile_1_URL",
            info: "static_tile_1_info",
            displayFormat: "compact",
            tilePersonalization: {}
        };

        var oComponentDataStartupParams = {
            "sap-system": ["static_tile_1_system"]
        };

        this.oComponent = new AppLauncherComponent({
            componentData: {
                properties: oComponentDataProperties,
                startupParameters: oComponentDataStartupParams
            }
        });

        // check properties on tile's model
        this.oComponent.rootControlLoaded().then(function (oTileView) {
            var oProperties = oTileView.getController()._getCurrentProperties();
            assert.strictEqual(oProperties.title, oComponentDataProperties.title, "component data title and tile view title");
            assert.strictEqual(oProperties.subtitle, oComponentDataProperties.subtitle, "component data subtitle and tile view subtitle");
            assert.strictEqual(oProperties.icon, oComponentDataProperties.icon, "component data icon and tile view icon");
            assert.strictEqual(oProperties.info, oComponentDataProperties.info, "component data info and tile view info");
            assert.strictEqual(oProperties.mode, GenericTileMode.LineMode, "the mode was set to line mode");

            // check URL contains sap-system
            // TODO: press handler tests are missing!
            assert.ok(oTileView.getController()._createTargetUrl().indexOf(oComponentDataStartupParams["sap-system"][0]) !== -1,
                "tile targetURL should contain sap-system from component startup parameters");

            var oNewVisualProperties_1 = {
                title: "title had changed",
                info: "info had changed"
            };
            this.oComponent.tileSetVisualProperties(oNewVisualProperties_1);
            oProperties = oTileView.getController()._getCurrentProperties();
            assert.strictEqual(oProperties.title, oNewVisualProperties_1.title, "component data title and tile view title must have been changed by new visual property");
            assert.strictEqual(oProperties.info, oNewVisualProperties_1.info, "component data info and tile view info must have been changed by new visual property");
            assert.strictEqual(oProperties.subtitle, oComponentDataProperties.subtitle, "component data subtitle and tile view subtitle");
            assert.strictEqual(oProperties.icon, oComponentDataProperties.icon, "component data icon and tile view icon");

            var oNewVisualProperties_2 = {
                subtitle: "i am also changed",
                icon: "i am also changed",
                info: "'i am also changed"
            };
            this.oComponent.tileSetVisualProperties(oNewVisualProperties_2);
            oProperties = oTileView.getController()._getCurrentProperties();
            assert.strictEqual(oProperties.title, oNewVisualProperties_1.title, "component data title and tile view title not changed by new visual property");
            assert.strictEqual(oProperties.info, oNewVisualProperties_2.info, "component data info and tile view info");
            assert.strictEqual(oProperties.subtitle, oNewVisualProperties_2.subtitle, "component data subtitle and tile view subtitle");
            assert.strictEqual(oProperties.icon, oNewVisualProperties_2.icon, "component data icon and tile view icon");

            done();
        }.bind(this));
    });

    QUnit.test("Component API tileSetEditMode", function (assert) {
        this.oComponent = new AppLauncherComponent({
            componentData: {
                isCreated: true,
                properties: {},
                startupParameters: {}
            }
        });

        return this.oComponent.rootControlLoaded().then(function (oTileView) {
            this.oComponent.tileSetEditMode(true);
            assert.strictEqual(oTileView.getModel().getProperty("/properties/scope"), GenericTileScope.ActionMore, "The tile scope was set as expected");
            this.oComponent.tileSetEditMode(false);
            assert.strictEqual(oTileView.getModel().getProperty("/properties/scope"), GenericTileScope.Display, "The tile scope was set as expected");
        }.bind(this));
    });

    QUnit.test("Tile property sizeBehavior test", function (assert) {
        var done = assert.async();
        this.oComponent = new AppLauncherComponent({
            componentData: {
                isCreated: true,
                properties: {},
                startupParameters: {}
            }
        });
        // check properties on tile's model
        this.oComponent.rootControlLoaded().then(function (oTileView) {
            var sSizeBehaviorStart;
            var sNewSizeBehavior;
            var oTileModel = oTileView.getModel();

            if (Config.last("/core/home/sizeBehavior") === "Responsive") {
                sSizeBehaviorStart = "Responsive";
                sNewSizeBehavior = "Small";
            } else {
                sSizeBehaviorStart = "Small";
                sNewSizeBehavior = "Responsive";
            }
            // Check if default is set
            assert.strictEqual(oTileModel.getProperty("/properties/configSizeBehavior"), sSizeBehaviorStart, "Config sizeBehavior correctly set at startup");
            assert.strictEqual(oTileModel.getProperty("/properties/customSizeBehavior"), undefined, "Custom sizeBehavior correctly set at startup");

            // set new sizeBehavior
            this.oComponent.tileSetSizeBehavior(TileSizeBehavior.Small);
            assert.strictEqual(oTileModel.getProperty("/properties/customSizeBehavior"), TileSizeBehavior.Small, "Custom sizeBehavior correctly set");

            // emit new configuration
            Config.emit("/core/home/sizeBehavior", sNewSizeBehavior);
            // check if size property has changed
            Config.once("/core/home/sizeBehavior").do(function () {
                assert.strictEqual(oTileModel.getProperty("/properties/configSizeBehavior"), sNewSizeBehavior, "Size correctly set after change");
                assert.strictEqual(oTileModel.getProperty("/properties/customSizeBehavior"), TileSizeBehavior.Small, "Custom sizeBehavior correctly set at startup");

                this.oComponent.tileSetSizeBehavior(TileSizeBehavior.Responsive);
                assert.strictEqual(oTileModel.getProperty("/properties/customSizeBehavior"), TileSizeBehavior.Responsive, "Custom sizeBehavior correctly set");
                done();
            }.bind(this));
        }.bind(this));
    });

    QUnit.module("GenericTile properties", {
        beforeEach: function () {
            this.oSystemContext = {};

            this.oGetSystemContextStub = sandbox.stub();
            this.oGetSystemContextStub.resolves(this.oSystemContext);

            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync").withArgs("ClientSideTargetResolution").resolves({
                getSystemContext: this.oGetSystemContextStub
            });

            this.oComponent = new AppLauncherComponent({
                componentData: {
                    isCreated: true,
                    properties: {},
                    startupParameters: {}
                }
            });

            return this.oComponent.rootControlLoaded().then(function (oTileView) {
                this.oGenericTile = oTileView.getContent()[0];
            }.bind(this));
        },
        afterEach: function () {
            this.oComponent.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Sets the right systemInfo", function (assert) {
        // Arrange
        var sBindingPath = this.oGenericTile.getBindingPath("systemInfo");

        // Assert
        assert.strictEqual(sBindingPath, "/properties/showContentProviderInfoOnVisualizations", "There is the correct binding path");
    });

    QUnit.test("Sets the right url path", function (assert) {
        // Arrange
        var oBindingInfo = this.oGenericTile.getBindingInfo("url");

        // Assert
        assert.strictEqual(oBindingInfo.binding.getPath(), "/properties/targetURL", "There is the correct binding path");
        assert.ok(oBindingInfo.formatter, "There is a formatter set");
    });

    QUnit.module("OnInit", {
        beforeEach: function () {
            this.oLogStub = sandbox.stub(Log, "error");

            this.oSystemContext = { label: "systemContextLabel" };

            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oConfigLastStub.withArgs("/core/contentProviders/providerInfo/enabled").returns(true);

            this.oGetSystemContextPromise = Promise.resolve(this.oSystemContext);

            this.oGetSystemContextStub = sandbox.stub();
            this.oGetSystemContextStub.returns(this.oGetSystemContextPromise);

            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync").withArgs("ClientSideTargetResolution").resolves({
                getSystemContext: this.oGetSystemContextStub
            });

            this.oComponent = new AppLauncherComponent({
                componentData: {
                    isCreated: true,
                    properties: {},
                    startupParameters: {}
                }
            });
        },
        afterEach: function () {
            this.oComponent.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Sets the correct frameType for displayFormat flat", function (assert) {
        // Arrange
        var oComponentDataProperties = {
            displayFormat: "flat"
        };

        this.oComponent = new AppLauncherComponent({
            componentData: {
                properties: oComponentDataProperties
            }
        });

        // Act
        return this.oComponent.rootControlLoaded().then(function (oTileView) {
            return this.oGetSystemContextPromise.then(function () {
                var sFrameType = oTileView.getModel().getProperty("/properties/frameType");
                // Assert
                assert.strictEqual(sFrameType, "OneByHalf", "The contentProviderLabel is correct");
            });
        }.bind(this));
    });

    QUnit.test("Sets the correct frameType for displayFormat flatWide", function (assert) {
        // Arrange
        var oComponentDataProperties = {
            displayFormat: "flatWide"
        };

        this.oComponent = new AppLauncherComponent({
            componentData: {
                properties: oComponentDataProperties
            }
        });

        // Act
        return this.oComponent.rootControlLoaded().then(function (oTileView) {
            return this.oGetSystemContextPromise.then(function () {
                var sFrameType = oTileView.getModel().getProperty("/properties/frameType");
                // Assert
                assert.strictEqual(sFrameType, "TwoByHalf", "The contentProviderLabel is correct");
            });
        }.bind(this));
    });

    QUnit.test("Sets the correct frameType for displayFormat standardWide", function (assert) {
        // Arrange
        var oComponentDataProperties = {
            displayFormat: "standardWide"
        };

        this.oComponent = new AppLauncherComponent({
            componentData: {
                properties: oComponentDataProperties
            }
        });

        // Act
        return this.oComponent.rootControlLoaded().then(function (oTileView) {
            return this.oGetSystemContextPromise.then(function () {
                var sFrameType = oTileView.getModel().getProperty("/properties/frameType");
                // Assert
                assert.strictEqual(sFrameType, "TwoByOne", "The contentProviderLabel is correct");
            });
        }.bind(this));
    });
});
