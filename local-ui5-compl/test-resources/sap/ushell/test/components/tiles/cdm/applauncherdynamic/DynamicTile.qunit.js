// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/m/library",
    "sap/ushell/components/tiles/cdm/applauncherdynamic/Component",
    "sap/ushell/components/tiles/cdm/applauncherdynamic/DynamicTile.controller",
    "sap/ushell/Config",
    "sap/ushell/Container",
    "sap/ushell/library",
    "sap/ushell/services/URLParsing",
    "sap/ushell/utils/DynamicTileRequest"
], function (
    Log,
    mobileLibrary,
    DynamicTileComponent,
    DynamicTileController,
    Config,
    Container,
    ushellLibrary,
    URLParsing,
    DynamicTileRequest
) {
    "use strict";

    /* global QUnit, sinon */

    // shortcut for sap.m.GenericTileScope
    var GenericTileScope = mobileLibrary.GenericTileScope;
    // shortcut for sap.m.DeviationIndicator
    var DeviationIndicator = mobileLibrary.DeviationIndicator;
    // shortcut for sap.m.ValueColor
    var ValueColor = mobileLibrary.ValueColor;
    // shortcut for sap.m.WrappingType
    var WrappingType = mobileLibrary.WrappingType;
    // shortcut for sap.m.FrameType
    var FrameType = mobileLibrary.FrameType;
    // shortcut for sap.m.TileSizeBehavior
    var TileSizeBehavior = mobileLibrary.TileSizeBehavior;
    // shortcut for sap.ushell.DisplayFormat
    var DisplayFormat = ushellLibrary.DisplayFormat;

    var sandbox = sinon.createSandbox({});

    QUnit.module("Component", {
        beforeEach: function () {
            this.oComponentData = {
                properties: {
                    displayFormat: DisplayFormat.Flat
                }
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Create DynamicTile Component Test with no componentData", function (assert) {
        // Arrange
        // Act
        var oComponent = new DynamicTileComponent({
            componentData: {}
        });
        // Assert
        assert.ok(oComponent);
    });

    QUnit.test("Sets the correct frameType for displayFormat flat", function (assert) {
        // Arrange
        this.oComponentData.properties.displayFormat = DisplayFormat.Flat;
        // Act
        var oComponent = new DynamicTileComponent({
            componentData: this.oComponentData
        });
        // Assert
        return oComponent.rootControlLoaded().then(function (oView) {
            // Assert
            var sFrameType = oView.getModel().getProperty("/properties/frameType");
            assert.strictEqual(sFrameType, FrameType.OneByHalf, "The frameType is correct");
        });
    });

    QUnit.test("Sets the correct frameType for displayFormat flatWide", function (assert) {
        // Arrange
        this.oComponentData.properties.displayFormat = DisplayFormat.FlatWide;
        // Act
        var oComponent = new DynamicTileComponent({
            componentData: this.oComponentData
        });
        // Assert
        return oComponent.rootControlLoaded().then(function (oView) {
            // Assert
            var sFrameType = oView.getModel().getProperty("/properties/frameType");
            assert.strictEqual(sFrameType, FrameType.TwoByHalf, "The frameType is correct");
        });
    });

    QUnit.test("Sets the correct frameType for displayFormat standardWide", function (assert) {
        // Arrange
        this.oComponentData.properties.displayFormat = DisplayFormat.StandardWide;
        // Act
        var oComponent = new DynamicTileComponent({
            componentData: this.oComponentData
        });
        // Assert
        return oComponent.rootControlLoaded().then(function (oView) {
            // Assert
            var sFrameType = oView.getModel().getProperty("/properties/frameType");
            assert.strictEqual(sFrameType, FrameType.TwoByOne, "The frameType is correct");
        });
    });

    QUnit.test("Initializes the tile with iLastTimeoutStart = 0", function (assert) {
        // Arrange
        // Act
        var oComponent = new DynamicTileComponent({
            componentData: this.oComponentData
        });
        // Assert
        return oComponent.rootControlLoaded().then(function (oView) {
            // Assert
            var oController = oView.getController();
            assert.strictEqual(oController.iLastTimeoutStart, 0, "iLastTimeoutStart was set correctly");
        });
    });

    QUnit.module("Controller: onInit", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub();
            sandbox.stub(Container, "getServiceAsync").returns(this.oGetServiceAsyncStub);

            this.oConfigDoStub = sandbox.stub().returns({
                off: sandbox.stub()
            });
            this.oConfigOnStub = sandbox.stub(Config, "on").returns({
                do: this.oConfigDoStub
            });
            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oConfigLastStub.withArgs("/core/contentProviders/providerInfo/enabled").returns(false);

            this.oErrorStub = sandbox.stub(Log, "error");

            this.oSystemContext = { label: "systemContextLabel" };
            this.oGetSystemContextStub = sandbox.stub().resolves(this.oSystemContext);

            this.oGetServiceAsyncStub.withArgs("ClientSideTargetResolution").resolves({
                getSystemContext: this.oGetSystemContextStub
            });

            this.oComponent = new DynamicTileComponent({ componentData: {} });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Correctly attaches to the showContentProviderInfoOnVisualizations config if enabled", function (assert) {
        this.oConfigLastStub.withArgs("/core/contentProviders/providerInfo/enabled").returns(true);
        return this.oComponent.rootControlLoaded().then(function () {
            assert.strictEqual(this.oConfigOnStub.getCall(0).args[0],
                "/core/contentProviders/providerInfo/showContentProviderInfoOnVisualizations", "Attached to the correct config");
        }.bind(this));
    });

    QUnit.test("Correctly attaches to the sizeBehavior config", function (assert) {
        return this.oComponent.rootControlLoaded().then(function () {
            assert.strictEqual(this.oConfigOnStub.getCall(0).args[0], "/core/home/sizeBehavior", "Attached to the correct config");
        }.bind(this));
    });

    QUnit.test("Handles correctly sizeBehavior config change", function (assert) {
        return this.oComponent.rootControlLoaded().then(function (oTileView) {
            // Arrange
            oTileView.getModel().setProperty("/properties/sizeBehavior", "Responsive");
            this.oConfigDoStub.getCall(0).callArgWith(0, TileSizeBehavior.Small);

            // Assert
            assert.strictEqual(oTileView.getModel().getProperty("/properties/configSizeBehavior"), TileSizeBehavior.Small,
                "Updated the sizeBehavior in the model");
        }.bind(this));
    });
    QUnit.module("Component: tileSetEditMode", {
        beforeEach: function () {
            this.oComponent = new DynamicTileComponent({
                componentData: {
                    properties: {},
                    configuration: {}
                }
            });

            return this.oComponent.rootControlLoaded().then(function (oView) {
                this.oController = oView.getController();

                this.oOffStub = sandbox.stub();
                this.oController._aDoables = [{
                    off: this.oOffStub
                }];

                this.oModel = oView.getModel();
            }.bind(this));
        },
        afterEach: function () {
            this.oComponent.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Component API tileSetEditMode", function (assert) {
        this.oComponent.tileSetEditMode(true);
        assert.strictEqual(this.oModel.getProperty("/properties/scope"), GenericTileScope.ActionMore, "The tile scope was set as expected");
        this.oComponent.tileSetEditMode(false);
        assert.strictEqual(this.oModel.getProperty("/properties/scope"), GenericTileScope.Display, "The tile scope was set as expected");
    });

    QUnit.module("Component: tileSetSizeBehavior", {
        beforeEach: function () {
            this.oComponent = new DynamicTileComponent({
                componentData: {
                    properties: {},
                    configuration: {}
                }
            });

            return this.oComponent.rootControlLoaded().then(function (oView) {
                this.oController = oView.getController();

                this.oOffStub = sandbox.stub();
                this.oController._aDoables = [{
                    off: this.oOffStub
                }];

                this.oModel = oView.getModel();
            }.bind(this));
        },
        afterEach: function () {
            this.oComponent.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Component API tileSetSizeBehavior", function (assert) {
        this.oComponent.tileSetSizeBehavior(TileSizeBehavior.Responsive);
        assert.strictEqual(this.oModel.getProperty("/properties/customSizeBehavior"), TileSizeBehavior.Responsive, "The custom sizeBehavior was set as expected");
        this.oComponent.tileSetSizeBehavior(TileSizeBehavior.Small);
        assert.strictEqual(this.oModel.getProperty("/properties/customSizeBehavior"), TileSizeBehavior.Small, "The custom sizeBehavior was set as expected");
    });

    QUnit.module("Component: tileSetPreview", {
        beforeEach: function () {
            this.oComponent = new DynamicTileComponent({
                componentData: {
                    properties: {
                        title: "Capital Projects",
                        subtitle: "All about Finance",
                        icon: "sap-icon://capital-projects",
                        info: "desktop only",
                        indicatorDataSource: {
                            path: "../../test/counts/v2/$count.txt",
                            refresh: 300
                        },
                        contentProviderId: "",
                        targetURL: "#Action-toappnavsample",
                        displayFormat: "standard",
                        numberUnit: "",
                        preview: false
                    },
                    configuration: {
                        serviceUrl: "../../test/counts/v2/$count.txt",
                        serviceRefreshInterval: 300
                    }
                }
            });

            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oConfigLastStub.withArgs("/core/home/sizeBehavior").returns(TileSizeBehavior.Responsive);
            this.oConfigLastStub.withArgs("/core/home/wrappingType").returns(WrappingType.Normal);
            this.oConfigLastStub.withArgs("/core/contentProviders/providerInfo/enabled").returns(false);

            return this.oComponent.rootControlLoaded().then(function (oView) {
                this.oController = oView.getController();

                this.oOffStub = sandbox.stub();
                this.oController._aDoables = [{
                    off: this.oOffStub
                }];

                this.oModel = oView.getModel();
            }.bind(this));
        },
        afterEach: function () {
            this.oComponent.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Component API tileSetPreview", function (assert) {
        // Act
        this.oComponent.tileSetPreview(true);

        assert.deepEqual(this.oModel.getProperty("/properties"), {
            title: "Capital Projects",
            subtitle: "All about Finance",
            icon: "sap-icon://capital-projects",
            info: "desktop only",
            customSizeBehavior: undefined,
            configSizeBehavior: "Responsive",
            indicatorDataSource: {
                path: "../../test/counts/v2/$count.txt",
                refresh: 300
            },
            contentProviderId: "",
            targetURL: "#Action-toappnavsample",
            displayFormat: "standard",
            numberUnit: "",
            preview: true,
            number_value: 1234,
            number_value_state: "Neutral",
            number_state_arrow: "None",
            number_factor: "",
            number_unit: "",
            wrappingType: "Normal",
            frameType: "OneByOne",
            showContentProviderInfoInTooltip: false,
            showContentProviderInfoOnVisualizations: false
        }, "The model had the expected properties.");

        this.oComponent.tileSetPreview(false);

        assert.deepEqual(this.oModel.getProperty("/properties"), {
            title: "Capital Projects",
            subtitle: "All about Finance",
            icon: "sap-icon://capital-projects",
            info: "desktop only",
            customSizeBehavior: undefined,
            configSizeBehavior: "Responsive",
            indicatorDataSource: {
                path: "../../test/counts/v2/$count.txt",
                refresh: 300
            },
            contentProviderId: "",
            targetURL: "#Action-toappnavsample",
            displayFormat: "standard",
            numberUnit: "",
            preview: false,
            number_value: 1234,
            number_value_state: "Neutral",
            number_state_arrow: "None",
            number_factor: "",
            number_unit: "",
            wrappingType: "Normal",
            frameType: "OneByOne",
            showContentProviderInfoInTooltip: false,
            showContentProviderInfoOnVisualizations: false
        }, "The model had the expected properties.");
    });

    QUnit.module("Component: tileSetVisualProperties", {
        beforeEach: function () {
            sandbox.stub(Container, "getServiceAsync").withArgs("URLParsing").returns(new URLParsing());

            this.oComponentData = {
                properties: {
                    title: "dynamic_tile_1_title",
                    subtitle: "dynamic_tile_1_subtitle",
                    icon: "dynamic_tile_1_icon",
                    withMargin: "false",
                    targetURL: "dynamic_tile_1_URL",
                    info: "dynamic_tile_1_Info",
                    tilePersonalization: {}
                },
                startupParameters: {
                    "sap-system": ["dynamic_tile_1_system"]
                }
            };

            this.oComponent = new DynamicTileComponent({
                componentData: this.oComponentData
            });

            return this.oComponent.rootControlLoaded().then(function (oView) {
                this.oController = oView.getController();

                this.oOffStub = sandbox.stub();
                this.oController._aDoables = [{
                    off: this.oOffStub
                }];

                this.oModel = oView.getModel();
            }.bind(this));
        },
        afterEach: function () {
            this.oComponent.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Sets the initial values correctly", function (assert) {
        // Arrange
        var oExpectedProperties = this.oComponentData.properties;
        var sSapSystem = this.oComponentData.startupParameters["sap-system"][0];
        // Act
        // Assert
        var oProperties = this.oModel.getProperty("/properties");
        assert.strictEqual(oProperties.title, oExpectedProperties.title, "title was correctly set");
        assert.strictEqual(oProperties.subtitle, oExpectedProperties.subtitle, "subtitle was correctly set");
        assert.strictEqual(oProperties.icon, oExpectedProperties.icon, "icon was correctly set");
        assert.strictEqual(oProperties.withMargin, oExpectedProperties.withMargin, "withMargin was correctly set");
        assert.strictEqual(oProperties.info, oExpectedProperties.info, "info was correctly set");
        assert.notEqual(oProperties.targetURL.indexOf(sSapSystem), -1, "targetURL contains sap-system");
    });

    QUnit.test("Updates visualProperties", function (assert) {
        // Arrange
        var oNewProperties = {
            title: "newTitle"
        };
        // Act
        this.oComponent.tileSetVisualProperties(oNewProperties);
        // Assert
        var oProperties = this.oModel.getProperty("/properties");
        assert.strictEqual(oProperties.title, oNewProperties.title, "title was updated");
        assert.strictEqual(oProperties.subtitle, "dynamic_tile_1_subtitle", "subtitle was not updated");
        assert.strictEqual(oProperties.icon, "dynamic_tile_1_icon", "icon was not updated");
    });

    QUnit.test("Does not update non-visual properties", function (assert) {
        // Arrange
        var oNewProperties = {
            configSizeBehavior: "Small",
            subtitle: "i am also changed",
            icon: "i am also changed",
            info: "i am also changed"
        };
        // Act
        this.oComponent.tileSetVisualProperties(oNewProperties);
        // Assert
        var oProperties = this.oModel.getProperty("/properties");
        assert.strictEqual(oProperties.configSizeBehavior, TileSizeBehavior.Responsive, "sizeBehavior was not updated");
        assert.strictEqual(oProperties.subtitle, oNewProperties.subtitle, "subtitle was updated");
        assert.strictEqual(oProperties.icon, oNewProperties.icon, "icon was updated");
        assert.strictEqual(oProperties.info, oNewProperties.info, "info was updated");
    });

    QUnit.module("Controller: loadData", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub();
            sandbox.stub(Container, "getServiceAsync").returns(this.oGetServiceAsyncStub);

            this.oLogInfoStub = sandbox.stub(Log, "info");
            this.oLogErrorStub = sandbox.stub(Log, "error");

            this.oController = new DynamicTileController();

            this.oOffStub = sandbox.stub();
            this.oController._aDoables = [{
                off: this.oOffStub
            }];

            this.oSetTileIntoErrorStateStub = sandbox.stub(this.oController, "_setTileIntoErrorState");
            this.oLoadDataSpy = sandbox.spy(this.oController, "loadData");

            this.oGetPropertyStub = sandbox.stub();
            sandbox.stub(this.oController, "getView").returns({
                getModel: sandbox.stub().returns({
                    getProperty: this.oGetPropertyStub
                })
            });

            this.oGetPropertyStub.withArgs("/configuration/serviceUrl").returns("someUrl");

            this.oRefreshStub = sandbox.stub();
            this.oDestroyStub = sandbox.stub();

            this.oController.oDataRequest = {
                refresh: this.oRefreshStub,
                destroy: this.oDestroyStub,
                sUrl: "someUrl",
                abort: sandbox.stub()
            };
        },
        afterEach: function () {
            this.oController.onExit();
            sandbox.restore();
        }
    });

    QUnit.test("Logs an info and sets the timer if the serviceRefreshInterval is bigger 0", function (assert) {
        // Arrange
        sandbox.useFakeTimers();
        var aExpectedMessage = [
            "Started timeout to call someUrl again in 1 seconds",
            null,
            "sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile"
        ];
        // Act
        this.oController.loadData(1);
        // Assert
        assert.deepEqual(this.oLogInfoStub.getCall(0).args, aExpectedMessage, "info was called with the right parameters");
        assert.notEqual(this.oController.timer, null, "The timer was set on a value"); //we can't test the exact value here as it is time dependent

        sandbox.clock.tick(1001);
        assert.strictEqual(this.oLoadDataSpy.callCount, 2, "'loadData' did call itself after one second");
    });

    QUnit.test("Does not create a request when no url was provided", function (assert) {
        // Arrange
        delete this.oController.oDataRequest;
        var sExpectedMessage = "No service URL given!";
        this.oGetPropertyStub.withArgs("/configuration/serviceUrl").returns("");
        // Act
        this.oController.loadData(0);
        // Assert
        assert.strictEqual(this.oController.oDataRequest, null, "The request was not created");
        assert.strictEqual(this.oLogErrorStub.getCall(0).args[0], sExpectedMessage, "logged the correct error");
        assert.strictEqual(this.oSetTileIntoErrorStateStub.callCount, 1, "The tile was set into error state");
    });

    QUnit.test("Does not create a request if preview is true", function (assert) {
        // Arrange
        delete this.oController.oDataRequest;
        var sExpectedMessage = "Tile in preview mode";
        this.oGetPropertyStub.withArgs("/properties/preview").returns(true);
        // Act
        this.oController.loadData(0);
        // Assert
        assert.strictEqual(this.oController.oDataRequest, null, "The request was not created");
        assert.strictEqual(this.oLogInfoStub.getCall(0).args[0], sExpectedMessage, "logged the correct info");
    });

    QUnit.test("Creates a new request when no requests exists", function (assert) {
        // Arrange
        delete this.oController.oDataRequest;
        // Act
        this.oController.loadData();
        // Assert
        assert.ok(this.oController.oDataRequest instanceof DynamicTileRequest, "The request was created");
    });

    QUnit.test("Creates a new request when url changed", function (assert) {
        // Arrange
        var oOldRequest = this.oController.oDataRequest;
        oOldRequest.sUrl = "someOldUrl";
        // Act
        this.oController.loadData();
        // Assert
        assert.strictEqual(this.oDestroyStub.callCount, 1, "The old request was destroyed");
        assert.ok(this.oController.oDataRequest instanceof DynamicTileRequest, "The request was created");
    });

    QUnit.test("Calls refresh on an existing request", function (assert) {
        // Arrange
        // Act
        this.oController.loadData();
        // Assert
        assert.strictEqual(this.oRefreshStub.callCount, 1, "The request was refreshed");
    });

    QUnit.test("Does not load the data again when the tile is configured to only fetch its data once", function (assert) {
        // Arrange
        this.oController.bShouldNotRefreshDataAfterInit = true;
        // Act
        this.oController.loadData();
        // Assert
        assert.strictEqual(this.oRefreshStub.callCount, 0, "The request was not refreshed");
    });

    QUnit.test("Does refresh the data when the tile is configured to only fetch its data once but loadData was called with bForce true", function (assert) {
        // Arrange
        this.oController.bShouldNotRefreshDataAfterInit = true;
        // Act
        this.oController.loadData(null, true);
        // Assert
        assert.strictEqual(this.oRefreshStub.callCount, 1, "The request was refreshed");
    });

    QUnit.test("Continues the timer when aborted", function (assert) {
        // Arrange
        var iNow = Date.now();
        var oClock = sandbox.useFakeTimers(iNow);
        var aExpectedMessage = [
            "Started timeout to call someUrl again in 10 seconds",
            null,
            "sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile"
        ];
        // Act
        this.oController.loadData(10);
        // Assert
        assert.strictEqual(this.oRefreshStub.callCount, 1, "The request was refreshed the first time");
        assert.strictEqual(this.oController.iLastTimeoutStart, iNow, "The timestamp was set");
        assert.deepEqual(this.oLogInfoStub.getCall(0).args, aExpectedMessage, "Log.info was called the first time with the right parameters");

        // Arrange
        var iFirstTimer = this.oController.timer;
        this.oRefreshStub.resetHistory();
        aExpectedMessage = [
            "Started timeout to call someUrl again in 5 seconds",
            null,
            "sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile"
        ];
        // Act
        oClock.tick(5000);
        this.oController.stopRequests();
        this.oController.loadData(10);
        // Assert
        assert.strictEqual(this.oRefreshStub.callCount, 0, "The request was not refreshed");
        assert.strictEqual(this.oController.iLastTimeoutStart, iNow, "The timestamp was not altered");
        assert.notStrictEqual(this.oController.timer, iFirstTimer, "The timer was updated the first time");
        assert.deepEqual(this.oLogInfoStub.getCall(1).args, aExpectedMessage, "Log.info was called the second time with the right parameters");

        // Arrange
        var iSecondTimer = this.oController.timer;
        this.oLoadDataSpy.resetHistory();
        aExpectedMessage = [
            "Started timeout to call someUrl again in 10 seconds",
            null,
            "sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile"
        ];
        // Act
        oClock.tick(5000);
        // Assert
        assert.strictEqual(this.oLoadDataSpy.callCount, 1, "loadData was called");
        assert.strictEqual(this.oRefreshStub.callCount, 1, "The request was refreshed the second time");
        assert.strictEqual(this.oController.iLastTimeoutStart, iNow + 10000, "The timestamp was updated");
        assert.notStrictEqual(this.oController.timer, iSecondTimer, "The timer was updated the second time");
        assert.deepEqual(this.oLogInfoStub.getCall(2).args, aExpectedMessage, "Log.info was called the third time with the right parameters");
    });

    QUnit.test("Refreshes instantly when timeout is reached after abortion", function (assert) {
        // Arrange
        var iNow = Date.now();
        var oClock = sandbox.useFakeTimers(iNow);
        var aExpectedMessage = [
            "Started timeout to call someUrl again in 10 seconds",
            null,
            "sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile"
        ];
        // Act
        this.oController.loadData(10);
        // Assert
        assert.strictEqual(this.oRefreshStub.callCount, 1, "The request was refreshed the first time");
        assert.strictEqual(this.oController.iLastTimeoutStart, iNow, "The timestamp was set");
        assert.deepEqual(this.oLogInfoStub.getCall(0).args, aExpectedMessage, "Log.info was called the first time with the right parameters");

        // Arrange
        var iFirstTimer = this.oController.timer;
        this.oRefreshStub.resetHistory();
        aExpectedMessage = [
            "Started timeout to call someUrl again in 10 seconds",
            null,
            "sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile"
        ];
        // Act
        oClock.tick(5000);
        this.oController.stopRequests();
        oClock.tick(10000);
        this.oController.loadData(10);
        // Assert
        assert.strictEqual(this.oRefreshStub.callCount, 1, "The request was refreshed the second time");
        assert.strictEqual(this.oController.iLastTimeoutStart, iNow + 15000, "The timestamp was updated");
        assert.notStrictEqual(this.oController.timer, iFirstTimer, "The timer was updated");
        assert.deepEqual(this.oLogInfoStub.getCall(1).args, aExpectedMessage, "Log.info was called the second time with the right parameters");
    });

    QUnit.module("Component: tileSetVisible", {
        beforeEach: function () {
            this.oComponent = new DynamicTileComponent({
                componentData: {}
            });

            return this.oComponent.rootControlLoaded().then(function (oView) {
                this.oController = oView.getController();

                this.oOffStub = sandbox.stub();
                this.oController._aDoables = [{
                    off: this.oOffStub
                }];

                this.oStopRequestsSpy = sandbox.spy(this.oController, "stopRequests");
                this.oInitRequestIntervalStub = sandbox.stub(this.oController, "initRequestInterval");
            }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
            this.oComponent.destroy();
        }
    });

    QUnit.test("Stops requests when the tile is invisible", function (assert) {
        // Arrange
        // Act
        this.oComponent.tileSetVisible(false);
        // Assert
        assert.strictEqual(this.oStopRequestsSpy.callCount, 1, "stopRequests was called once");
    });

    QUnit.test("Refreshes requests when the tile is invisible", function (assert) {
        // Arrange
        // Act
        this.oComponent.tileSetVisible(true);
        // Assert
        assert.strictEqual(this.oInitRequestIntervalStub.callCount, 1, "initRequestInterval was called once");
        assert.strictEqual(this.oStopRequestsSpy.callCount, 0, "stopRequests was not called");
    });

    QUnit.module("Component: tileRefresh", {
        beforeEach: function () {
            this.oComponent = new DynamicTileComponent({
                componentData: {}
            });

            return this.oComponent.rootControlLoaded().then(function (oView) {
                this.oController = oView.getController();

                this.oOffStub = sandbox.stub();
                this.oController._aDoables = [{
                    off: this.oOffStub
                }];

                this.oLoadDataStub = sandbox.stub(this.oController, "loadData");
            }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
            this.oComponent.destroy();
        }
    });

    QUnit.test("Calls refresh handler", function (assert) {
        // Arrange
        // Act
        this.oComponent.tileRefresh();
        // Assert
        assert.strictEqual(this.oLoadDataStub.callCount, 1, "loadData was called once");
    });

    QUnit.module("Controller: initRequestInterval", {
        beforeEach: function () {
            this.oController = new DynamicTileController();

            this.oOffStub = sandbox.stub();
            this.oController._aDoables = [{
                off: this.oOffStub
            }];

            this.oGetPropertyStub = sandbox.stub();
            sandbox.stub(this.oController, "getView").returns({
                getModel: sandbox.stub().returns({
                    getProperty: this.oGetPropertyStub
                })
            });

            this.oLoadDataStub = sandbox.stub(this.oController, "loadData");
            this.oGetPropertyStub.withArgs("/configuration/serviceUrl").returns("someUrl");
            this.oGetPropertyStub.withArgs("/configuration/serviceRefreshInterval").returns(0);
        },
        afterEach: function () {
            this.oController.onExit();
            sandbox.restore();
        }
    });

    QUnit.test("Calls loadData correctly when interval 0", function (assert) {
        // Arrange
        // Act
        this.oController.initRequestInterval(this.oController);
        // Assert
        assert.strictEqual(this.oLoadDataStub.getCall(0).args[0], 0, "loadData was called with the correct interval");
    });

    QUnit.test("Calls loadData correctly when interval 5", function (assert) {
        // Arrange
        this.oGetPropertyStub.withArgs("/configuration/serviceRefreshInterval").returns(5);
        // Act
        this.oController.initRequestInterval(this.oController);
        // Assert
        assert.strictEqual(this.oLoadDataStub.getCall(0).args[0], 10, "loadData was called with the correct interval");
    });

    QUnit.test("Calls loadData correctly when interval 50", function (assert) {
        // Arrange
        this.oGetPropertyStub.withArgs("/configuration/serviceRefreshInterval").returns(50);
        // Act
        this.oController.initRequestInterval(this.oController);
        // Assert
        assert.strictEqual(this.oLoadDataStub.getCall(0).args[0], 50, "loadData was called with the correct interval");
    });

    QUnit.test("Sets bShouldNotRefreshDataAfterInit when the tile is configured to not refresh its data after initial load and a request is already present", function (assert) {
        // Arrange
        this.oGetPropertyStub.withArgs("/configuration/serviceRefreshInterval").returns();
        this.oController.oDataRequest = {
            // needed since onExit is called in the afterEach which aborts and destroys all ongoing requests
            abort: sandbox.stub(),
            destroy: sandbox.stub()
        };
        // Act
        this.oController.initRequestInterval(this.oController);
        // Assert
        assert.strictEqual(this.oController.bShouldNotRefreshDataAfterInit, true, "bShouldNotRefreshDataAfterInit was set to true");
    });

    QUnit.module("Controller: updatePropertiesHandler (integration test)", {
        beforeEach: function () {
            this.oComponent = new DynamicTileComponent({
                componentData: {}
            });

            return this.oComponent.rootControlLoaded().then(function (oView) {
                this.oController = oView.getController();

                this.oOffStub = sandbox.stub();
                this.oController._aDoables = [{
                    off: this.oOffStub
                }];

                this.oNormalizeNumberStub = sandbox.stub(this.oController, "_normalizeNumber").returns({});
                this.oShouldProcessDigitsStub = sandbox.stub(this.oController, "_shouldProcessDigits");
            }.bind(this));
        },
        afterEach: function () {
            this.oController.onExit();
            sandbox.restore();
        }
    });

    QUnit.test("Processes a number correctly", function (assert) {
        // Arrange
        var oProperties = {
            number: "12345",
            numberDigits: "2",
            numberFactor: "3"
        };
        var aExpectedNormalizeArgs = ["12345", 5, "3", "2"];
        var aExpectedProcessArgs = ["12345", "2"];
        // Act
        this.oController.updatePropertiesHandler(oProperties);
        // Assert
        assert.deepEqual(this.oNormalizeNumberStub.getCall(0).args, aExpectedNormalizeArgs, "_normalizeNumber was called with correct args");
        assert.deepEqual(this.oShouldProcessDigitsStub.getCall(0).args, aExpectedProcessArgs, "_shouldProcessDigits was called with correct args");
    });

    QUnit.test("Keeps old data, only changes values are updated", function (assert) {
        // Arrange
        this.oComponent.tileSetVisualProperties({
            icon: "sap-icon://travel-expense",
            info: "Quarter Ends!",
            subtitle: "Quarterly overview",
            targetURL: "",
            title: "Travel Expenses"
        });

        var oExpectedProperties = {
            frameType: FrameType.OneByOne,
            icon: "sap-icon://travel-expense",
            info: "Quarter Ends!",
            infoState: ValueColor.Good,
            number_value: "2",
            number_digits: 2,
            number_factor: "",
            number_value_state: ValueColor.Neutral,
            showContentProviderInfoInTooltip: false,
            showContentProviderInfoOnVisualizations: false,
            number_unit: "",
            number_state_arrow: DeviationIndicator.None,
            configSizeBehavior: TileSizeBehavior.Responsive,
            subtitle: "Quarterly overview",
            targetURL: "",
            title: "New Title",
            wrappingType: WrappingType.Normal
        };

        // Act
        this.oController.updatePropertiesHandler({
            title: "New Title",
            infoState: ValueColor.Good,
            number: 2,
            numberDigits: 2
        });

        // Assert
        var oNewProperties = this.oController.getView().getModel().getProperty("/properties");
        assert.deepEqual(oNewProperties, oExpectedProperties, "The properties inside the model are changed as expected");
    });

    QUnit.test("Keeps old data, only changes values are updated but also allows empty updates", function (assert) {
        // Arrange
        this.oComponent.tileSetVisualProperties({
            icon: "sap-icon://travel-expense",
            info: "Quarter Ends!",
            subtitle: "Quarterly overview",
            targetURL: "",
            title: "Travel Expenses"
        });
        this.oController.updatePropertiesHandler({
            subtitle: "New subtitle",
            infoState: ValueColor.Good,
            number: 2,
            numberDigits: 2,
            numberUnit: "EUR"
        });

        var oExpectedProperties = {
            frameType: FrameType.OneByOne,
            icon: "sap-icon://travel-expense",
            info: "Quarter Ends!",
            infoState: ValueColor.Good,
            number_value: "2",
            number_digits: 2,
            number_factor: "",
            number_value_state: ValueColor.Neutral,
            showContentProviderInfoInTooltip: false,
            showContentProviderInfoOnVisualizations: false,
            number_unit: "",
            number_state_arrow: DeviationIndicator.None,
            configSizeBehavior: TileSizeBehavior.Responsive,
            subtitle: "Quarterly overview",
            targetURL: "",
            title: "",
            wrappingType: WrappingType.Normal
        };

        // Act
        this.oController.updatePropertiesHandler({
            // subtitle property is missing -> subtitle will default back to its original value
            title: "<RESET>", // Resets to a default
            info: "", // Resets to static value
            infoState: ValueColor.Good,
            number: 2,
            numberDigits: 2,
            numberUnit: ""
        });

        // Assert
        var oNewProperties = this.oController.getView().getModel().getProperty("/properties");
        assert.deepEqual(oNewProperties, oExpectedProperties, "The properties inside the model are changed as expected");
    });

    QUnit.test("Falls back to static value for empty string and null", function (assert) {
        // Arrange
        this.oComponent.tileSetVisualProperties({
            title: "Static Title",
            subtitle: "Static Subtitle",
            info: "Static Info"
        });
        this.oController.updatePropertiesHandler({
            title: "Updated Title",
            subtitle: "Updated Subtitle",
            info: "Updated Info"
        });

        // Act
        this.oController.updatePropertiesHandler({
            title: "",
            subtitle: null,
            info: undefined
        });

        // Assert
        var oNewProperties = this.oController.getView().getModel().getProperty("/properties");
        assert.deepEqual(oNewProperties.title, "Static Title", "The original title was set");
        assert.deepEqual(oNewProperties.subtitle, "Static Subtitle", "The original subtitle was set");
        assert.deepEqual(oNewProperties.info, "Static Info", "The original info was set");
    });

    QUnit.test("Defaults empty strings to proper enums for infoState, stateArrow and numberState", function (assert) {
        // Act
        this.oController.updatePropertiesHandler({
            infoState: "",
            stateArrow: "",
            numberState: ""
        });

        // Assert
        var oNewProperties = this.oController.getView().getModel().getProperty("/properties");
        assert.strictEqual(oNewProperties.infoState, ValueColor.Neutral, "The property was not changed");
        assert.strictEqual(oNewProperties.number_state_arrow, DeviationIndicator.None, "The property was not changed");
        assert.strictEqual(oNewProperties.number_value_state, ValueColor.Neutral, "The property was not changed");
    });

    QUnit.test("Target parameters are appended to the target URL", function (assert) {
        // Arrange
        this.oComponent.tileSetVisualProperties({
            icon: "sap-icon://travel-expense",
            info: "Quarter Ends!",
            subtitle: "Quarterly overview",
            targetURL: "some.target.url",
            title: "Travel Expenses"
        });

        // Act
        this.oController.updatePropertiesHandler({
            targetParams: "param1=a&param2=b"
        });

        // Assert
        var sTargetURL = this.oController.getView().getModel().getProperty("/properties/targetURL");
        assert.deepEqual(sTargetURL, "some.target.url?param1=a&param2=b", "The url is as expected");
    });

    QUnit.test("New target parameters replace old target parameters", function (assert) {
        // Arrange
        this.oComponent.tileSetVisualProperties({
            icon: "sap-icon://travel-expense",
            info: "Quarter Ends!",
            subtitle: "Quarterly overview",
            targetURL: "some.target.url?otherParam=y",
            title: "Travel Expenses"
        });
        this.oController.updatePropertiesHandler({
            targetParams: "param1=a&param2=b"
        });

        // Act
        this.oController.updatePropertiesHandler({
            targetParams: "param1=c&param2=d"
        });

        // Assert
        var sTargetURL = this.oController.getView().getModel().getProperty("/properties/targetURL");
        assert.deepEqual(sTargetURL, "some.target.url?otherParam=y&param1=c&param2=d", "The url is as expected");
    });

    QUnit.test("Aggregates result numbers", function (assert) {
        // Arrange
        this.oComponent.tileSetVisualProperties({
            title: "Static Title"
        });

        // Act
        this.oController.updatePropertiesHandler({
            results: [
                { number: undefined },
                { number: "10.34" },
                { number: 10 }
            ]
        });

        // Assert
        var iNumberValue = this.oController.getView().getModel().getProperty("/properties/number_value");
        assert.deepEqual(iNumberValue, 20.34, "The numberValue is as expected");
    });

    QUnit.test("Aggregates parameters", function (assert) {
        // Arrange
        this.oComponent.tileSetVisualProperties({
            title: "Static Title",
            targetURL: "some.target.url?x=y"
        });

        // Act
        this.oController.updatePropertiesHandler({
            results: [
                { targetParams: undefined },
                { targetParams: "" },
                { targetParams: "a=b" },
                { targetParams: "a=b" },
                { targetParams: "b=c" }
            ]
        });

        // Assert
        var sTargetURL = this.oController.getView().getModel().getProperty("/properties/targetURL");
        assert.deepEqual(sTargetURL, "some.target.url?x=y&a=b&a=b&b=c", "The url is as expected");
    });

    QUnit.module("Controller: _normalizeNumber", {
        beforeEach: function () {
            this.oController = new DynamicTileController();

            this.oOffStub = sandbox.stub();
            this.oController._aDoables = [{
                off: this.oOffStub
            }];
        },
        afterEach: function () {
            this.oController.onExit();
            sandbox.restore();
        }
    });

    QUnit.test("Returns the correct result when number is: 'NaN'", function (assert) {
        // Arrange
        // Act
        var oResult = this.oController._normalizeNumber("Not_a_Number", 5);
        // Assert
        assert.strictEqual(oResult.displayNumber, "Not_a", "Returned correct displayNumber");
    });

    QUnit.module("Controller: stopRequests", {
        beforeEach: function () {
            this.oController = new DynamicTileController();

            this.oOffStub = sandbox.stub();
            this.oController._aDoables = [{
                off: this.oOffStub
            }];

            this.oAbortStub = sandbox.stub();
            this.oController.oDataRequest = {
                abort: this.oAbortStub,
                destroy: sandbox.stub()
            };
        },
        afterEach: function () {
            this.oController.onExit();
            sandbox.restore();
        }
    });

    QUnit.test("Aborts the running request", function (assert) {
        // Arrange
        // Act
        this.oController.stopRequests();
        // Assert
        assert.strictEqual(this.oAbortStub.callCount, 1, "abort was called once");
    });

    QUnit.module("Controller: onExit", {
        beforeEach: function () {
            this.oController = new DynamicTileController();

            this.oDestroyStub = sandbox.stub();
            this.oAbortStub = sandbox.stub();
            this.oController.oDataRequest = {
                abort: this.oAbortStub,
                destroy: this.oDestroyStub
            };

            this.oOffStub = sandbox.stub();
            this.oController._aDoables = [{
                off: this.oOffStub
            }];
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Aborts and destroys the data request", function (assert) {
        // Arrange
        // Act
        this.oController.onExit();
        // Assert
        assert.strictEqual(this.oAbortStub.callCount, 1, "abort was called once");
        assert.strictEqual(this.oDestroyStub.callCount, 1, "destroy was called once");
    });

    QUnit.test("Detaches doables", function (assert) {
        // Arrange
        // Act
        this.oController.onExit();
        // Assert
        assert.strictEqual(this.oOffStub.callCount, 1, "off was called once");
    });

    QUnit.module("Component: createContent", {
        beforeEach: function () {
            this.oProperties = {
                targetURL: "dynamic_tile_1_URL",
                indicatorDataSource: {
                    refresh: 0,
                    path: ""
                }
            };
            this.oComponentData = {
                properties: this.oProperties
            };
            this.oData = {
                componentData: this.oComponentData
            };
        },
        afterEach: function () {
            sandbox.restore();
            this.oComponent.destroy();
        }
    });

    QUnit.test("Handles serviceUrl correctly when legacy", function (assert) {
        // Arrange
        this.oProperties.indicatorDataSource.path = "/sap/opu/Service1/somePath";
        this.oComponent = new DynamicTileComponent(this.oData);

        // Act
        return this.oComponent.rootControlLoaded().then(function (oTileView) {
            this.oController = oTileView.getController();

            this.oOffStub = sandbox.stub();
            this.oController._aDoables = [{
                off: this.oOffStub
            }];

            // Assert
            var sServiceUrl = oTileView.getModel().getProperty("/configuration/serviceUrl");
            assert.strictEqual(sServiceUrl, "/sap/opu/Service1/somePath", "configured the correct url");
        }.bind(this));
    });

    QUnit.test("Handles serviceUrl correctly when it contains dataSource", function (assert) {
        // Arrange
        this.oProperties.indicatorDataSource.path = "somePath";
        this.oProperties.dataSource = {
            uri: "/sap/opu/Service1/"
        };
        this.oComponent = new DynamicTileComponent(this.oData);

        //Act
        return this.oComponent.rootControlLoaded().then(function (oTileView) {
            this.oController = oTileView.getController();

            this.oOffStub = sandbox.stub();
            this.oController._aDoables = [{
                off: this.oOffStub
            }];

            // Assert
            var sServiceUrl = oTileView.getModel().getProperty("/configuration/serviceUrl");
            assert.strictEqual(sServiceUrl, "/sap/opu/Service1/somePath", "configured the correct url");
        }.bind(this));
    });

    QUnit.test("Handles serviceUrl correctly when it contains dataSource and sap-system", function (assert) {
        // Arrange
        this.oProperties.indicatorDataSource.path = "somePath";
        this.oProperties.dataSource = {
            uri: "/sap/opu/Service1/"
        };
        this.oComponentData.startupParameters = {
            "sap-system": ["SYS1", "SYS2"]
        };
        this.oComponent = new DynamicTileComponent(this.oData);

        // Act
        return this.oComponent.rootControlLoaded().then(function (oTileView) {
            this.oController = oTileView.getController();

            this.oOffStub = sandbox.stub();
            this.oController._aDoables = [{
                off: this.oOffStub
            }];

            // Assert
            var sServiceUrl = oTileView.getModel().getProperty("/configuration/serviceUrl");
            assert.equal(sServiceUrl, "/sap/opu/Service1;o=SYS1/somePath", "configured the correct url");
        }.bind(this));
    });

    QUnit.test("Handles serviceUrl correctly when it contains dataSource and sap-system and missing '/'", function (assert) {
        // Arrange
        this.oProperties.indicatorDataSource.path = "somePath";
        this.oProperties.dataSource = {
            uri: "/sap/opu/Service1"
        };
        this.oComponentData.startupParameters = {
            "sap-system": ["SYS1", "SYS2"]
        };
        this.oComponent = new DynamicTileComponent(this.oData);

        // Act
        return this.oComponent.rootControlLoaded().then(function (oTileView) {
            this.oController = oTileView.getController();

            this.oOffStub = sandbox.stub();
            this.oController._aDoables = [{
                off: this.oOffStub
            }];

            // Assert
            var sServiceUrl = oTileView.getModel().getProperty("/configuration/serviceUrl");
            assert.strictEqual(sServiceUrl, "/sap/opu/Service1;o=SYS1/somePath", "configured the correct url");
        }.bind(this));
    });

    QUnit.test("Handles serviceUrl correctly when it contains dataSource and empty array of sap-system", function (assert) {
        // Arrange
        this.oProperties.indicatorDataSource.path = "somePath";
        this.oProperties.dataSource = {
            uri: "/sap/opu/Service1/"
        };
        this.oComponentData.startupParameters = {
            "sap-system": []
        };
        this.oComponent = new DynamicTileComponent(this.oData);

        // Act
        return this.oComponent.rootControlLoaded().then(function (oTileView) {
            this.oController = oTileView.getController();

            this.oOffStub = sandbox.stub();
            this.oController._aDoables = [{
                off: this.oOffStub
            }];

            // Assert
            var sServiceUrl = oTileView.getModel().getProperty("/configuration/serviceUrl");
            assert.strictEqual(sServiceUrl, "/sap/opu/Service1/somePath", "configured the correct url");
        }.bind(this));
    });

    QUnit.test("Handles serviceUrl correctly when it contains dataSource and sap-system but no indicatorDataSource", function (assert) {
        // Arrange
        delete this.oProperties.indicatorDataSource;
        this.oProperties.dataSource = {
            uri: "/sap/opu/Service1/"
        };
        this.oComponentData.startupParameters = {
            "sap-system": ["SYS1"]
        };
        this.oComponent = new DynamicTileComponent(this.oData);

        // Act
        return this.oComponent.rootControlLoaded().then(function (oTileView) {
            this.oController = oTileView.getController();

            this.oOffStub = sandbox.stub();
            this.oController._aDoables = [{
                off: this.oOffStub
            }];

            // Assert
            var sServiceUrl = oTileView.getModel().getProperty("/configuration/serviceUrl");
            assert.strictEqual(sServiceUrl, undefined, "configured the correct url");
        }.bind(this));
    });

    QUnit.test("Handles serviceUrl correctly when it contains dataSource and sap-system but absolute path of indicatorDataSource", function (assert) {
        // Arrange
        this.oProperties.indicatorDataSource.path = "/sap/opu/Service2/somePath";
        this.oProperties.dataSource = {
            uri: "/sap/opu/Service1/"
        };
        this.oComponentData.startupParameters = {
            "sap-system": ["SYS1"]
        };
        this.oComponent = new DynamicTileComponent(this.oData);

        // Act
        return this.oComponent.rootControlLoaded().then(function (oTileView) {
            this.oController = oTileView.getController();

            this.oOffStub = sandbox.stub();
            this.oController._aDoables = [{
                off: this.oOffStub
            }];

            // Assert
            var sServiceUrl = oTileView.getModel().getProperty("/configuration/serviceUrl");
            assert.strictEqual(sServiceUrl, "/sap/opu/Service2/somePath", "configured the correct url");
        }.bind(this));
    });

    QUnit.module("Integration test", {
        beforeEach: function () {
            var sServiceUrl = "/some/service/url";

            this.oComponent = new DynamicTileComponent({
                componentData: {
                    properties: {
                        targetURL: "dynamic_tile_1_URL",
                        indicatorDataSource: {
                            refresh: 0,
                            path: sServiceUrl
                        }
                    }
                }
            });

            return this.oComponent.rootControlLoaded()
                .then(function (oView) {
                    this.oView = oView;
                    oView.placeAt("qunit-fixture");

                    this.oFakeServer = sinon.createFakeServer({
                        respondImmediately: true
                    });
                }.bind(this));
        },
        afterEach: function () {
            this.oComponent.destroy();
            this.oFakeServer.restore();
            sandbox.restore();
        }
    });
});
