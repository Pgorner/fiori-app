// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.VizInstanceCdm
 */

sap.ui.define([
    "sap/ushell/ui/launchpad/VizInstanceCdm",
    "sap/ushell/ui/launchpad/VizInstance",
    "sap/ui/core/Component",
    "sap/base/util/ObjectPath",
    "sap/ushell/services/Ui5ComponentLoader",
    "sap/ushell/UI5ComponentType",
    "sap/m/library",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/Container"
], function (
    VizInstanceCdm,
    VizInstance,
    Component,
    ObjectPath,
    Ui5ComponentLoader,
    UI5ComponentType,
    mobileLibrary,
    jQuery,
    Container
) {
    "use strict";

    // shortcut for sap.m.TileSizeBehavior
    const TileSizeBehavior = mobileLibrary.TileSizeBehavior;

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
        var oVizInstance = new VizInstanceCdm(oTestVizData);

        // Assert
        assert.ok(typeof oVizInstance, VizInstance, "The data was correctly saved to the instance");

        oVizInstance.destroy();
    });

    QUnit.test("Correctly assigns the content aggregation to the initial tile", function (assert) {
        // Arrange
        // Act
        var oVizInstance = new VizInstanceCdm();

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
            this.oVizData = {
                active: true,
                preview: true,
                sizeBehavior: "Responsive",
                title: "The Title",
                subtitle: "The Subtitle",
                instantiationData: {
                    vizType: {
                        "sap.ui5": {
                            componentName: "sap.ushell.components.tiles.cdm.applauncher"
                        }
                    }
                }
            };
            this.oVizInstance = new VizInstanceCdm(this.oVizData);
            this.oSetContentStub = sandbox.stub(this.oVizInstance, "setContent");
            this.oSetPreviewStub = sandbox.stub(this.oVizInstance, "setPreview");
            this.oSetSizeBehaviorStub = sandbox.stub(this.oVizInstance, "setTileSizeBehavior");
            this.oSetComponentTileVisibleStub = sandbox.stub(this.oVizInstance, "_setComponentTileVisible");

            this.oSetParentStub = sandbox.spy(Component.prototype, "setParent");
            // Custom visualization instantiation
            var oUI5ComponentLoaderInstance = new Ui5ComponentLoader({});
            sandbox.stub(Container, "getServiceAsync").resolves(oUI5ComponentLoaderInstance);

            this.oUI5ComponentCreateSpy = sandbox.spy(oUI5ComponentLoaderInstance, "createComponent");
        },
        afterEach: function () {
            sandbox.restore();
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("Creates the tile component and sets the properties", function (assert) {
        // Act
        return this.oVizInstance.load(false)
            .then(function () {
                // Assert
                var oComponentContainer = this.oSetContentStub.firstCall.args[0];
                var sComponentContainerName = oComponentContainer.getMetadata().getName();
                var oComponent = oComponentContainer.getComponentInstance();
                var sComponentName = oComponent.getMetadata().getName();

                assert.ok(this.oSetSizeBehaviorStub.calledOnce, "setSizeBehavior was called.");
                assert.strictEqual(this.oSetSizeBehaviorStub.firstCall.args[0], "Responsive", "setSizeBehavior was called.");

                assert.strictEqual(sComponentContainerName, "sap.ui.core.ComponentContainer", "The tile componentContainer was created");
                assert.strictEqual(sComponentName, "sap.ushell.components.tiles.cdm.applauncher.Component", "The tile component was created");

                assert.strictEqual(this.oSetParentStub.getCall(0).args[0], this.oVizInstance, "the correct parent was set");

                assert.strictEqual(this.oVizInstance.getTitle(), this.oVizData.title, "The title property was correctly set");
                assert.strictEqual(this.oVizInstance.getSubtitle(), this.oVizData.subtitle, "The subtitle property was correctly set");
                assert.deepEqual(this.oSetComponentTileVisibleStub.getCall(0).args, [true], "_setComponentTileVisible was called with correct parameters");

                oComponent.destroy();
            }.bind(this));
    });

    QUnit.test("Creates the (custom) tile component and sets the properties", function (assert) {
        return this.oVizInstance.load(true)
            .then(function () {
                // Assert
                var oComponentContainer = this.oSetContentStub.firstCall.args[0];
                var sComponentContainerName = oComponentContainer.getMetadata().getName();
                var oComponent = oComponentContainer.getComponentInstance();
                var sComponentName = oComponent.getMetadata().getName();

                assert.ok(this.oUI5ComponentCreateSpy.calledOnce, "The UI5ComponentLoader was used to load the component.");
                assert.strictEqual(sComponentContainerName, "sap.ui.core.ComponentContainer", "The tile componentContainer was created");
                assert.strictEqual(sComponentName, "sap.ushell.components.tiles.cdm.applauncher.Component", "The tile component was created");

                assert.strictEqual(this.oSetParentStub.getCall(0).args[0], this.oVizInstance, "the correct parent was set");

                assert.strictEqual(this.oVizInstance.getTitle(), this.oVizData.title, "The title property was correctly set");
                assert.strictEqual(this.oVizInstance.getSubtitle(), this.oVizData.subtitle, "The subtitle property was correctly set");
                assert.deepEqual(this.oSetComponentTileVisibleStub.getCall(0).args, [true], "_setComponentTileVisible was called with correct parameters");

                oComponent.destroy();
            }.bind(this));
    });

    QUnit.test("Rejects and sets the VizInstance to an error state if the component creation fails", function (assert) {
        // Arrange
        var oExpectedError = { error: "error" };
        var oComponentCreateStub = sandbox.stub(Component, "create");
        oComponentCreateStub.rejects(oExpectedError);

        // Act
        return this.oVizInstance.load()
            .catch(function (oError) {
                // Assert
                assert.deepEqual(oError, oExpectedError, "The error object was returned");
                assert.strictEqual(this.oVizInstance.getState(), "Failed", "The state was set to failed");
            }.bind(this));
    });

    QUnit.module("Helper functions for custom visualization instantiation", {
        beforeEach: function () {
            this.oVizData = {
                active: true,
                title: "The Title",
                subtitle: "The Subtitle",
                instantiationData: {
                    vizType: {
                        "sap.ui5": {
                            componentName: "sap.ushell.components.tiles.cdm.applauncher"
                        }
                    }
                }
            };
            this.oVizInstance = new VizInstanceCdm(this.oVizData);
            // Custom visualization instantiation
            this.oUI5ComponentLoaderInstance = new Ui5ComponentLoader({});
            sandbox.stub(Container, "getServiceAsync").resolves(this.oUI5ComponentLoaderInstance);

            this.oFakeComponent = { fake: "component" };
            this.oGetInstanceStub = sandbox.stub().returns(this.oFakeComponent);
            this.oCreateComponentPromise = new jQuery.Deferred();
            this.oCreateComponentPromise.resolve({
                componentHandle: {
                    getInstance: this.oGetInstanceStub
                }
            });
            this.oUI5ComponentCreateStub = sandbox.stub(this.oUI5ComponentLoaderInstance, "createComponent").returns(this.oCreateComponentPromise.promise());
        },
        afterEach: function () {
            sandbox.restore();
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("_loadCustomVizType calls createComponent and extracts the component from its handle", function (assert) {
        return this.oVizInstance._loadCustomVizType()
            .then(function (oComponent) {
                // Assert
                assert.ok(this.oUI5ComponentCreateStub.calledOnce, "UI5ComponentLoader.createComponent was called");
                assert.ok(this.oGetInstanceStub.calledOnce, "The control was extracted from the component handle.");
                assert.deepEqual(oComponent, this.oFakeComponent, "The control was correctly returned");
            }.bind(this));
    });

    QUnit.test("_loadCustomVizType calls createComponent with the correct parameters", function (assert) {
        var oAppConfig = {
            loadCoreExt: true,
            loadDefaultDependencies: false,
            componentData: { data: "data" },
            url: "https//www.some.url",
            applicationConfiguration: {},
            reservedParameters: {},
            applicationDependencies: { component: "config" },
            ui5ComponentName: "some.ui5.name"
        };
        var sVizType = UI5ComponentType.Visualization;
        sandbox.stub(this.oVizInstance, "_getCustomComponentConfiguration").returns(oAppConfig);

        return this.oVizInstance._loadCustomVizType()
            .then(function (oComponent) {
                // Assert
                assert.ok(this.oUI5ComponentCreateStub.calledOnce, "UI5ComponentLoader.createComponent was called");
                assert.deepEqual(this.oUI5ComponentCreateStub.args[0][0], oAppConfig, "The correct configuration was passed to createComponent");
                assert.deepEqual(this.oUI5ComponentCreateStub.args[0][1], {}, "The correct parsed hash was passed to createComponent");
                assert.deepEqual(this.oUI5ComponentCreateStub.args[0][2], [], "The correct promises array was passed to createComponent");
                assert.equal(this.oUI5ComponentCreateStub.args[0][3], sVizType, "The correct visualization type was passed to createComponent");
            }.bind(this));
    });

    QUnit.test("_loadCustomVizType throws an error in case there is no component handle", function (assert) {
        // Arrange
        this.oCreateComponentPromise = new jQuery.Deferred();
        this.oCreateComponentPromise.resolve({});
        this.oUI5ComponentCreateStub.restore();
        this.oUI5ComponentCreateStub = sandbox.stub(this.oUI5ComponentLoaderInstance, "createComponent").returns(this.oCreateComponentPromise.promise());

        // Act
        return this.oVizInstance._loadCustomVizType()
            .then(function () {
                // Assert
                assert.notOk(true, "No exception was thrown");
            })
            .catch(function (oError) {
                assert.ok(true, "An exception was thrown");
                assert.strictEqual(oError.message, "Create component failed: no instance found in the component handle.", "The correct error message was sent");
            });
    });

    QUnit.test("_loadCustomVizType throws an error in case there is no control", function (assert) {
        // Arrange
        this.oCreateComponentPromise = new jQuery.Deferred();
        this.oCreateComponentPromise.resolve({
            componentHandle: {}
        });
        this.oUI5ComponentCreateStub.restore();
        this.oUI5ComponentCreateStub = sandbox.stub(this.oUI5ComponentLoaderInstance, "createComponent").returns(this.oCreateComponentPromise.promise());

        // Act
        return this.oVizInstance._loadCustomVizType()
            .then(function () {
                // Assert
                assert.notOk(true, "No exception was thrown");
            })
            .catch(function (oError) {
                assert.ok(true, "An exception was thrown");
                assert.strictEqual(oError.message, "Create component failed: no instance found in the component handle.", "The correct error message was sent");
            });
    });

    QUnit.test("_getCustomComponentConfiguration returns the correct configuration", function (assert) {
        // Arrange
        var oComponentConfiguration = {
            componentData: {
                data: 1
            },
            url: "http://some.thing",
            name: "Say it!"
        };
        sandbox.stub(this.oVizInstance, "_getComponentConfiguration").returns(oComponentConfiguration);

        var oExpectedProperties = {
            loadCoreExt: true,
            loadDefaultDependencies: false,
            componentData: oComponentConfiguration.componentData,
            url: oComponentConfiguration.url,
            applicationConfiguration: {},
            reservedParameters: {},
            applicationDependencies: oComponentConfiguration,
            ui5ComponentName: oComponentConfiguration.name
        };

        // Act
        var oAppProperties = this.oVizInstance._getCustomComponentConfiguration();

        // Assert
        assert.deepEqual(oAppProperties, oExpectedProperties, "The component configuration was correctly constructed");
    });

    QUnit.module("The _getComponentConfiguration function", {
        beforeEach: function () {
            this.oVizData = {
                title: "The Tile",
                subtitle: "The subtitle",
                icon: "The icon",
                info: "The info",
                numberUnit: "EUR",
                indicatorDataSource: { testPath: "path/$count" },
                dataSource: { uri: "/test/" },
                contentProviderId: "The content provider id",
                contentProviderLabel: "The content provider label",
                targetURL: "Target URL",
                anotherProperty: "Another property",
                instantiationData: {
                    vizType: {
                        "sap.ui5": {
                            componentName: "visualization.component.name"
                        },
                        "sap.flp": {
                            tileSize: "1x1"
                        }
                    }
                }
            };

            this.oVizInstance = new VizInstanceCdm(this.oVizData);
        },
        afterEach: function () {
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("Sets the basic component configuration", function (assert) {
        //Arrange
        var oExpectedComponentConfiguration = {
            name: "visualization.component.name",
            componentData: {
                properties: {
                    title: "The Tile",
                    subtitle: "The subtitle",
                    icon: "The icon",
                    info: "The info",
                    numberUnit: "EUR",
                    indicatorDataSource: { testPath: "path/$count" },
                    dataSource: { uri: "/test/" },
                    contentProviderId: "The content provider id",
                    contentProviderLabel: "The content provider label",
                    targetURL: "Target URL",
                    displayFormat: "standard",
                    preview: false
                }
            },
            url: undefined,
            manifest: undefined,
            asyncHints: undefined
        };

        //Act
        var oComponentConfiguration = this.oVizInstance._getComponentConfiguration(this.oVizData);

        //Assert
        assert.deepEqual(oComponentConfiguration, oExpectedComponentConfiguration, "The basic component configuration was created correctly");
    });

    QUnit.test("Sets the alternative component URL", function (assert) {
        //Arrange
        ObjectPath.set(["instantiationData", "vizType", "sap.platform.runtime", "componentProperties", "url"], "/component/url", this.oVizData);

        //Act
        var oComponentConfiguration = this.oVizInstance._getComponentConfiguration(this.oVizData);

        //Assert
        assert.deepEqual(oComponentConfiguration.url, "/component/url", "The component url was taken over");
    });

    QUnit.test("Sets the alternative component manifest", function (assert) {
        //Arrange
        ObjectPath.set(["instantiationData", "vizType", "sap.platform.runtime", "componentProperties", "manifest"], "/manifest/url", this.oVizData);

        //Act
        var oComponentConfiguration = this.oVizInstance._getComponentConfiguration(this.oVizData);

        //Assert
        assert.deepEqual(oComponentConfiguration.manifest, "/manifest/url", "The component url was taken over");
    });

    QUnit.test("Uses the vizType as manifest if includeManifest is specified", function (assert) {
        //Arrange
        ObjectPath.set(["instantiationData", "vizType", "sap.platform.runtime", "includeManifest"], true, this.oVizData);

        //Act
        var oComponentConfiguration = this.oVizInstance._getComponentConfiguration(this.oVizData);

        //Assert
        assert.deepEqual(oComponentConfiguration.manifest, this.oVizData.instantiationData.vizType, "The vizType was taken over as component manifest.");
    });

    QUnit.test("Merges the vizConfig with the vizType if includeManifest is specified", function (assert) {
        //Arrange
        var oVizConfig = {
            "sap.platform.runtime": {
                includeManifest: true
            },
            "sap.flp": {
                tileSize: "1x2"
            }
        };
        this.oVizInstance.setVizConfig(oVizConfig);
        ObjectPath.set(["instantiationData", "vizType", "sap.platform.runtime", "includeManifest"], true, this.oVizData);

        var oExpectedManifest = {
            "sap.flp": {
                tileSize: "1x2"
            },
            "sap.platform.runtime": {
                includeManifest: true
            },
            "sap.ui5": {
                componentName: "visualization.component.name"
            }
        };

        //Act
        var oComponentConfiguration = this.oVizInstance._getComponentConfiguration(this.oVizData);

        //Assert
        assert.deepEqual(oComponentConfiguration.manifest, oExpectedManifest, "The correct merged manifest was returned.");
    });

    QUnit.test("Merges the provided componentProperties with the default componentProperties", function (assert) {
        //Arrange
        var oComponentProperties = {
            special: "variable",
            manifest: true
        };
        ObjectPath.set(["instantiationData", "vizType", "sap.platform.runtime", "componentProperties"], oComponentProperties, this.oVizData);

        var oExpectedComponentData = {
            properties: {
                contentProviderId: "The content provider id",
                contentProviderLabel: "The content provider label",
                icon: "The icon",
                indicatorDataSource: { testPath: "path/$count" },
                dataSource: {
                    uri: "/test/"
                },
                info: "The info",
                numberUnit: "EUR",
                preview: false,
                special: "variable",
                subtitle: "The subtitle",
                targetURL: "Target URL",
                title: "The Tile",
                manifest: true,
                displayFormat: "standard"
            }
        };

        //Act
        var oComponentConfiguration = this.oVizInstance._getComponentConfiguration(this.oVizData);

        //Assert
        assert.deepEqual(oComponentConfiguration.componentData, oExpectedComponentData, "The correct merged componentData was returned.");
    });

    QUnit.test("Sets the manifest when the manifest is provided as an object", function (assert) {
        //Arrange
        var oComponentProperties = {
            special: "variable"
        };
        ObjectPath.set(["instantiationData", "vizType", "sap.platform.runtime", "componentProperties"], oComponentProperties, this.oVizData);
        ObjectPath.set(["instantiationData", "vizType", "sap.platform.runtime", "includeManifest"], true, this.oVizData);

        var oExpectedComponentData = {
            properties: {
                contentProviderId: "The content provider id",
                contentProviderLabel: "The content provider label",
                icon: "The icon",
                indicatorDataSource: { testPath: "path/$count" },
                dataSource: {
                    uri: "/test/"
                },
                info: "The info",
                numberUnit: "EUR",
                preview: false,
                special: "variable",
                subtitle: "The subtitle",
                targetURL: "Target URL",
                title: "The Tile",
                manifest: {
                    "sap.flp": {
                        tileSize: "1x1"
                    },
                    "sap.platform.runtime": {
                        componentProperties: {
                            special: "variable"
                        },
                        includeManifest: true
                    },
                    "sap.ui5": {
                        componentName: "visualization.component.name"
                    }
                },
                displayFormat: "standard"
            }
        };

        //Act
        var oComponentConfiguration = this.oVizInstance._getComponentConfiguration(this.oVizData);

        //Assert
        assert.deepEqual(oComponentConfiguration.componentData, oExpectedComponentData, "The correct merged componentData was returned.");
    });

    QUnit.test("Adds asyncHints to the componentConfiguration", function (assert) {
        //Arrange
        var oAsyncHints = {
            components: [],
            libs: [{
                lazy: false,
                name: "sap.cloudfnd.smartbusiness.lib.reusetiles",
                url: {
                    final: true,
                    url: "/some/other/url/~0000~/"
                }
            }]
        };
        ObjectPath.set(["instantiationData", "vizType", "sap.platform.runtime", "componentProperties", "asyncHints"], oAsyncHints, this.oVizData);

        var oExpectedAsyncHints = {
            components: [],
            libs: [{
                lazy: false,
                name: "sap.cloudfnd.smartbusiness.lib.reusetiles",
                url: {
                    final: true,
                    url: "/some/other/url/~0000~/"
                }
            }]
        };
        //Act
        var oComponentConfiguration = this.oVizInstance._getComponentConfiguration(this.oVizData);

        //Assert
        assert.deepEqual(oComponentConfiguration.asyncHints, oExpectedAsyncHints, "The correct asyncHints array was returned.");
    });

    QUnit.module("The method _setComponentTileVisible", {
        beforeEach: function () {
            this.oVizInstance = new VizInstanceCdm();
            this.oTileSetVisibleStub = sandbox.stub();
            this.oVizInstance._oComponent = {
                tileSetVisible: this.oTileSetVisibleStub
            };
        },
        afterEach: function () {
            this.oVizInstance.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Calls tileSetVisible of the component", function (assert) {
        // Arrange
        // Act
        this.oVizInstance._setComponentTileVisible(true);
        // Assert
        assert.deepEqual(this.oTileSetVisibleStub.getCall(0).args, [true], "tileSetVisible waa called with correct parameters");
    });

    QUnit.module("The method setActive", {
        beforeEach: function () {
            this.oVizInstance = new VizInstanceCdm();
            this.oRefreshStub = sandbox.stub(VizInstanceCdm.prototype, "refresh");
        },
        afterEach: function () {
            this.oVizInstance.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("correctly sets the active state on the content", function (assert) {
        // Arrange
        var oTileSetVisibleStub = sinon.stub();
        this.oVizInstance._oComponent = {
            tileSetVisible: oTileSetVisibleStub
        };
        // Act
        this.oVizInstance.setActive(true, true);
        assert.strictEqual(oTileSetVisibleStub.callCount, 1, "was called exactly once");
        assert.strictEqual(oTileSetVisibleStub.getCall(0).args[0], true, "was called with correct param");
        assert.strictEqual(this.oRefreshStub.callCount, 1, "refresh was called exactly once");
    });

    QUnit.module("The method refresh", {
        beforeEach: function () {
            this.oVizInstance = new VizInstanceCdm();
        },
        afterEach: function () {
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("correctly sets the refresh state on the content", function (assert) {
        // Arrange
        var oTileRefreshStub = sinon.stub();
        this.oVizInstance._oComponent = {
            tileRefresh: oTileRefreshStub
        };
        // Act
        this.oVizInstance.refresh();
        assert.strictEqual(oTileRefreshStub.callCount, 1, "was called exactly once");
    });

    QUnit.module("The method setTileEditable", {
        beforeEach: function () {
            this.oVizInstance = new VizInstanceCdm();
            this.oTileSetEditModeStub = sandbox.stub();
            this.oComponentMock = {
                tileSetEditMode: this.oTileSetEditModeStub
            };
            this.oVizInstance._oComponent = this.oComponentMock;
        },
        afterEach: function () {
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("calls tileSetEditMode on the component", function (assert) {
        // Act
        this.oVizInstance.setTileEditable(true);

        // Assert
        assert.ok(this.oTileSetEditModeStub.calledWith(true), "tileSetEditMode was called");
    });

    QUnit.module("The method setTileSizeBehavior", {
        beforeEach: function () {
            this.oVizInstance = new VizInstanceCdm();
            this.oTileSetSizeBehaviorStub = sandbox.stub();
            this.oComponentMock = {
                tileSetSizeBehavior: this.oTileSetSizeBehaviorStub
            };
            this.oVizInstance._oComponent = this.oComponentMock;
            this.oVizInstanceSetSizeBehaviorStub = sandbox.stub(VizInstance.prototype, "setTileSizeBehavior");
        },
        afterEach: function () {
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("calls tileSetSizeBehavior on the component", function (assert) {
        // Act
        var oVizInstance = this.oVizInstance.setTileSizeBehavior(TileSizeBehavior.Small);

        // Assert
        assert.strictEqual(this.oTileSetSizeBehaviorStub.firstCall.args[0], TileSizeBehavior.Small, "tileSetSizeBehavior was called with the expected arguments.");
        assert.deepEqual(oVizInstance, this.oVizInstance, "tileSetSizeBehavior returned the VizInstance.");
        assert.ok(this.oVizInstanceSetSizeBehaviorStub.calledOnce, "setTileSizeBehavior was called once on the vizInstance.");
        assert.ok(this.oVizInstanceSetSizeBehaviorStub.firstCall.args[0], TileSizeBehavior.Small, "setTileSizeBehavior was called with the expected arguments.");
    });


    QUnit.module("The method setPreview", {
        beforeEach: function () {
            this.oVizInstance = new VizInstanceCdm();
            this.oTileSetPreviewStub = sandbox.stub();
            this.oRefreshStub = sandbox.stub(this.oVizInstance, "refresh");
            this.oComponentMock = {
                tileSetPreview: this.oTileSetPreviewStub
            };
            this.oVizInstance._oComponent = this.oComponentMock;

            this.oVizInstanceSetPreviewStub = sandbox.stub(VizInstance.prototype, "setPreview");
        },
        afterEach: function () {
            sandbox.restore();
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("calls setTilePreview on the component", function (assert) {
        // Act
        var oVizInstance = this.oVizInstance.setPreview(true);

        // Assert
        assert.ok(this.oTileSetPreviewStub.calledOnce, "tileSetPreview was called once.");
        assert.strictEqual(this.oTileSetPreviewStub.firstCall.args[0], true, "tileSetPreview was called with the expected arguments");
        assert.ok(this.oRefreshStub.notCalled, "refresh was not called.");
        assert.strictEqual(oVizInstance, this.oVizInstance, "setPreview returned the VizInstance");
        assert.ok(this.oVizInstanceSetPreviewStub.calledOnce, "setPreview was called on the VizInstance");
        assert.strictEqual(this.oVizInstanceSetPreviewStub.args[0][0], true, "setPreview was called on the VizInstance with the expected arguments.");
    });

    QUnit.test("calls setTilePreview on the component, preview: false, refresh: true", function (assert) {
        // Arrange
        this.oVizInstance.setProperty("preview", true);

        // Act
        var oVizInstance = this.oVizInstance.setPreview(false);

        // Assert
        assert.ok(this.oTileSetPreviewStub.calledOnce, "tileSetPreview was called once.");
        assert.strictEqual(this.oTileSetPreviewStub.firstCall.args[0], false, "tileSetPreview was called with the expected arguments");
        assert.ok(this.oRefreshStub.calledOnce, "refresh was called once.");
        assert.strictEqual(oVizInstance, this.oVizInstance, "setPreview returned the VizInstance");
        assert.ok(this.oVizInstanceSetPreviewStub.calledOnce, "setPreview was called on the VizInstance");
        assert.strictEqual(this.oVizInstanceSetPreviewStub.args[0][0], false, "setPreview was called on the VizInstance with the expected arguments.");
    });
});
