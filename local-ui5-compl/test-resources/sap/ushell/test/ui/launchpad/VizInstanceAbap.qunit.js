// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.VizInstanceAbap
 */
sap.ui.define([
    "sap/ushell/ui/launchpad/VizInstanceAbap",
    "sap/ushell/ui/launchpad/VizInstance",
    "sap/base/Log",
    "sap/base/util/ObjectPath",
    "sap/ushell/library",
    "sap/ushell/utils/chipsUtils",
    "sap/m/library",
    "sap/ushell/Container"
], function (
    VizInstanceAbap,
    VizInstance,
    Log,
    ObjectPath,
    ushellLibrary,
    chipsUtils,
    mobileLibrary,
    Container
) {
    "use strict";

    var DisplayFormat = ushellLibrary.DisplayFormat;
    var LoadState = mobileLibrary.LoadState;

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    QUnit.module("The constructor", {
        beforeEach: function () {
            // Using a custom thenable to avoid executing any promise handler
            var oThenable = {
                then: function () { }
            };
            var oGetServiceAsyncStub = sandbox.stub().returns(oThenable);

            sandbox.stub(Container, "getServiceAsync").callsFake(oGetServiceAsyncStub);
        },
        afterEach: function () {
            Container.resetServices();
            sandbox.restore();
        }
    });

    QUnit.test("Creates instance of type VizInstance", function (assert) {
        // Arrange
        sandbox.stub(VizInstanceAbap.prototype, "init");

        // Act
        var oVizInstance = new VizInstanceAbap({});

        // Assert
        assert.ok(oVizInstance.isA("sap.ushell.ui.launchpad.VizInstanceAbap"), "The object was created successfully");
        assert.ok(oVizInstance.isA("sap.ushell.ui.launchpad.VizInstance"), "The object correctly extends VizInstance.");

        // Cleanup
        oVizInstance.destroy();
    });

    QUnit.test("Calls the init function of the superclass", function (assert) {
        // Arrange
        var oInitStub = sandbox.stub(VizInstance.prototype, "init");

        // Act
        var oVizInstance = new VizInstanceAbap();

        // Assert
        assert.strictEqual(oInitStub.callCount, 1, "The init function has been called once.");

        // Cleanup
        oVizInstance.destroy();
    });

    QUnit.test("Correctly assigns the content aggregation to the initial tile", function (assert) {
        // Arrange
        // Act
        var oVizInstance = new VizInstanceAbap();

        // Assert
        var oTile = oVizInstance.getContent();
        assert.ok(oTile.isA("sap.m.GenericTile"), "The correct control type has been found.");
        assert.strictEqual(oTile.getState(), LoadState.Loaded, "The default state was correctly set");
        assert.strictEqual(oTile.getFrameType(), "OneByOne", "The default frame type was correctly set");

        // Cleanup
        oVizInstance.destroy();
    });

    QUnit.module("The init function", {
        beforeEach: function () {
            this.oChipMock = {
                id: "chipMock"
            };

            this.oGetServiceAsyncStub = sandbox.stub();

            sandbox.stub(Container, "getServiceAsync").callsFake(this.oGetServiceAsyncStub);

            this.oCreateChipInstanceStub = sandbox.stub().returns(this.oChipMock);
            this.oPageBuildingServiceMock = {
                getFactory: sandbox.stub().returns({
                    createChipInstance: this.oCreateChipInstanceStub
                })
            };
            this.oGetServiceAsyncStub.withArgs("PageBuilding").returns({
                then: sandbox.stub().yields(this.oPageBuildingServiceMock)
            });
            this.oAddBagDataToChipInstanceStub = sandbox.stub(chipsUtils, "addBagDataToChipInstance");
            this.oGetInstantiationDataStub = sandbox.stub(VizInstanceAbap.prototype, "getInstantiationData");
        },
        afterEach: function () {
            Container.resetServices();
            sandbox.restore();
        }
    });

    QUnit.test("Handles standard chipData correctly", function (assert) {
        // Arrange
        var oInstantiationData = {
            platform: "ABAP",
            chip: {
                id: "someChip",
                someChipProperty: "someChipProperty"
            }
        };
        this.oGetInstantiationDataStub.returns(oInstantiationData);

        var oExpectedChip = {
            chipId: "someChip",
            chip: {
                id: "someChip",
                someChipProperty: "someChipProperty"
            }
        };

        // Act
        new VizInstanceAbap();
        // Assert
        assert.strictEqual(this.oCreateChipInstanceStub.callCount, 1, "createChipInstance was called once");
        assert.deepEqual(this.oCreateChipInstanceStub.getCall(0).args, [oExpectedChip], "createChipInstance was called with correct parameters");
        assert.strictEqual(this.oAddBagDataToChipInstanceStub.callCount, 1, "addBagDataToChipInstanceStub was called once");
        assert.deepEqual(this.oAddBagDataToChipInstanceStub.getCall(0).args, [this.oChipMock, undefined], "addBagDataToChipInstanceStub was called with correct parameters");
    });

    QUnit.test("Handles simplified chipData correctly", function (assert) {
        // Arrange
        var oInstantiationData = {
            platform: "ABAP",
            chip: {
                chipId: "someCustomChip",
                bags: { id: "someBags" },
                configuration: { id: "someConfiguration" }
            },
            simplifiedChipFormat: true
        };
        this.oGetInstantiationDataStub.returns(oInstantiationData);

        var oExpectedChip = {
            chipId: "someCustomChip",
            configuration: "{\"id\":\"someConfiguration\"}"
        };

        // Act
        new VizInstanceAbap();

        // Assert
        assert.strictEqual(this.oCreateChipInstanceStub.callCount, 1, "createChipInstance was called once");
        assert.deepEqual(this.oCreateChipInstanceStub.getCall(0).args, [oExpectedChip], "createChipInstance was called with correct parameters");
        assert.strictEqual(this.oAddBagDataToChipInstanceStub.callCount, 1, "addBagDataToChipInstanceStub was called once");
        var oBags = oInstantiationData.chip.bags;
        assert.deepEqual(this.oAddBagDataToChipInstanceStub.getCall(0).args, [this.oChipMock, oBags], "addBagDataToChipInstanceStub was called with correct parameters");
    });

    QUnit.module("The load function", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub();

            sandbox.stub(Container, "getServiceAsync").callsFake(this.oGetServiceAsyncStub);

            this.oTestVizData = {
                instantiationData: {
                    chip: { id: "SomeID" }
                }
            };
            this.oChipInstanceLoadStub = sandbox.stub().yields();
            this.oVizInstanceSetContentStub = sandbox.stub(VizInstance.prototype, "setContent");
            this.oVizInstanceSetStateStub = sandbox.stub(VizInstance.prototype, "setState");

            // chip contracts
            this.oGetContractStub = sandbox.stub();
            this.oPreviewContract = {
                setEnabled: sandbox.stub()
            };
            this.oGetContractStub.withArgs("preview").returns(this.oPreviewContract);
            this.oTypesContract = {
                setType: sandbox.stub()
            };
            this.oGetContractStub.withArgs("types").returns(this.oTypesContract);
            this.oVisibleContract = {
                setVisible: sandbox.stub()
            };
            this.oGetContractStub.withArgs("visible").returns(this.oVisibleContract);

            // chip implementation
            this.oComponentMock = {
                setParent: sandbox.stub()
            };
            this.oControlMock = {
                id: "foobar",
                getComponentInstance: sandbox.stub().returns(this.oComponentMock)
            };
            this.oChipInstance = {
                load: this.oChipInstanceLoadStub,
                getContract: this.oGetContractStub,
                getImplementationAsSapui5Async: sandbox.stub().resolves(this.oControlMock),
                isStub: sandbox.stub().returns(false)
            };

            this.oPageBuildingServiceFake = {
                getFactory: sandbox.stub().returns({
                    createChipInstance: sandbox.stub().returns(this.oChipInstance)
                })
            };
            this.oGetServiceAsyncStub.withArgs("PageBuilding").resolves(this.oPageBuildingServiceFake);

            this.oTestVizInstance = new VizInstanceAbap(this.oTestVizData);
        },
        afterEach: function () {
            sandbox.restore();
            Container.resetServices();
            this.oTestVizInstance.destroy();
        }
    });

    QUnit.test("Correctly executes the callback and sets all properties", function (assert) {
        // Arrange
        // Act
        return this.oTestVizInstance.load(undefined, false)
            .then(function () {
                // Assert
                assert.deepEqual(this.oVisibleContract.setVisible.getCall(0).args, [false], "chip was set to invisible");
                assert.deepEqual(this.oTypesContract.setType.getCall(0).args, ["tile"], "tile type was correctly set");
                assert.deepEqual(this.oPreviewContract.setEnabled.callCount, 0, "preview contract was not set");

                assert.deepEqual(this.oComponentMock.setParent.getCall(0).args[0], this.oTestVizInstance, "setParent was called with correct params");
                assert.deepEqual(this.oVizInstanceSetContentStub.getCall(0).args[0], this.oControlMock, "setContent was called with correct params");
                assert.strictEqual(this.oVizInstanceSetStateStub.callCount, 0, "The function setState was not called.");
            }.bind(this));
    });

    QUnit.test("Correctly retrieves the previewContract if the preview property is set to true and a previewContract is available", function (assert) {
        // Arrange
        this.oTestVizInstance.setPreview(true);

        // Act
        return this.oTestVizInstance.load()
            .then(function () {
                // Assert
                assert.deepEqual(this.oPreviewContract.setEnabled.getCall(0).args, [true], "preview was enabled on chip");

                assert.deepEqual(this.oComponentMock.setParent.getCall(0).args[0], this.oTestVizInstance, "setParent was called with correct params");
                assert.deepEqual(this.oVizInstanceSetContentStub.getCall(0).args[0], this.oControlMock, "setContent was called with correct params");
                assert.strictEqual(this.oVizInstanceSetStateStub.callCount, 0, "The function setState was not called.");
            }.bind(this));
    });

    QUnit.test("Correctly retrieves the visibleContract if a visibleContract is available", function (assert) {
        // Arrange
        this.oTestVizInstance.setActive(true);

        // Act
        return this.oTestVizInstance.load()
            .then(function () {
                // Assert
                assert.deepEqual(this.oVisibleContract.setVisible.getCall(0).args, [true], "chip was set to visible");

                assert.deepEqual(this.oComponentMock.setParent.getCall(0).args[0], this.oTestVizInstance, "setParent was called with correct params");
                assert.deepEqual(this.oVizInstanceSetContentStub.getCall(0).args[0], this.oControlMock, "setContent was called with correct params");
                assert.strictEqual(this.oVizInstanceSetStateStub.callCount, 0, "The function setState was not called.");
            }.bind(this));
    });

    QUnit.test("Correctly rejects if the chip instantiation calls the error handler", function (assert) {
        // Arrange
        this.oChipInstanceLoadStub.callsArg(1);

        // Act
        return this.oTestVizInstance.load(undefined, true)
            .catch(function () {
                // Assert
                assert.strictEqual(this.oVizInstanceSetStateStub.callCount, 1, "The function setState was called once.");
                assert.strictEqual(this.oVizInstanceSetStateStub.firstCall.args[0], "Failed", "The function setState was called with the correct parameter.");
            }.bind(this));
    });

    QUnit.module("The _setChipInstanceType function", {
        beforeEach: function () {
            sandbox.stub(VizInstanceAbap.prototype, "init").callsFake(function () {
                // We need to call the super here to ensure the VizInstances content (read: GenericTile) is properly initialized
                VizInstance.prototype.init.apply(this, arguments);
            });
            this.oVizInstance = new VizInstanceAbap();
            this.oVizInstance._oChipInstance = {
                getContract: sandbox.stub()
            };
        },
        afterEach: function () {
            sandbox.restore();
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("Sets the CHIP instances's type based on the vizInstance's display format", function (assert) {
        //Arrange
        var oTypesContractMock = {
            setType: sandbox.stub()
        };
        this.oVizInstance._oChipInstance.getContract.withArgs("types").returns(oTypesContractMock);
        this.oVizInstance.setDisplayFormat("standard");

        //Act
        this.oVizInstance._setChipInstanceType();

        //Assert
        assert.strictEqual(oTypesContractMock.setType.args[0][0], "tile", "The CHIP instance's type was set correctly");
    });

    QUnit.test("Doesn't crash if the CHIP instance doesn't have a types contract", function (assert) {
        //Act
        this.oVizInstance._setChipInstanceType();

        //Assert
        assert.ok(true, "The function didn't crash");
    });

    QUnit.module("The _mapDisplayFormatToChip function", {
        beforeEach: function () {
            sandbox.stub(VizInstanceAbap.prototype, "init");
            this.oVizInstance = new VizInstanceAbap();
        },
        afterEach: function () {
            sandbox.restore();
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("Maps displayFormat Standard correctly", function (assert) {
        // Act
        var sResult = this.oVizInstance._mapDisplayFormatToChip(DisplayFormat.Standard);
        // Assert
        assert.strictEqual(sResult, "tile", "Returned the correct format");
    });

    QUnit.test("Maps displayFormat StandardWide correctly", function (assert) {
        // Act
        var sResult = this.oVizInstance._mapDisplayFormatToChip(DisplayFormat.StandardWide);
        // Assert
        assert.strictEqual(sResult, "tile", "Returned the correct format");
    });

    QUnit.test("Maps displayFormat Flat correctly", function (assert) {
        // Act
        var sResult = this.oVizInstance._mapDisplayFormatToChip(DisplayFormat.Flat);
        // Assert
        assert.strictEqual(sResult, "flat", "Returned the correct format");
    });

    QUnit.test("Maps displayFormat FlatWide correctly", function (assert) {
        // Act
        var sResult = this.oVizInstance._mapDisplayFormatToChip(DisplayFormat.FlatWide);
        // Assert
        assert.strictEqual(sResult, "flatwide", "Returned the correct format");
    });

    QUnit.test("Maps displayFormat Compact correctly", function (assert) {
        // Act
        var sResult = this.oVizInstance._mapDisplayFormatToChip(DisplayFormat.Compact);
        // Assert
        assert.strictEqual(sResult, "link", "Returned the correct format");
    });

    QUnit.module("The _setVisible function", {
        beforeEach: function () {
            sandbox.stub(Container, "getServiceAsync");

            sandbox.stub(VizInstanceAbap.prototype, "init");
            this.oVizInstanceAbap = new VizInstanceAbap();
        },
        afterEach: function () {
            this.oVizInstanceAbap.destroy();
            sandbox.restore();
            Container.resetServices();
        }
    });

    QUnit.test("Calls the isStub function of the chip instance", function (assert) {
        // Arrange
        var oIsStubStub = sinon.stub().returns(true); // lol
        this.oVizInstanceAbap._oChipInstance = {
            isStub: oIsStubStub
        };

        // Act
        this.oVizInstanceAbap._setVisible();

        // Assert
        assert.strictEqual(oIsStubStub.callCount, 1, "The function isStub has been called once.");
    });

    QUnit.test("Calls the 'visible' contract's setVisible function if the chip is not a stub and if the contract exists", function (assert) {
        // Arrange
        var oParam = {};
        var oSetVisibleStub = sinon.stub();
        var oContract = {
            setVisible: oSetVisibleStub
        };
        var oGetContractStub = sinon.stub().returns(oContract);

        this.oVizInstanceAbap._oChipInstance = {
            isStub: sinon.stub().returns(false),
            getContract: oGetContractStub
        };

        // Act
        this.oVizInstanceAbap._setVisible(oParam);

        // Assert
        assert.strictEqual(oGetContractStub.callCount, 1, "The function getContract has been called once.");
        assert.deepEqual(oGetContractStub.firstCall.args, ["visible"], "The function getContract has been called with the correct parameter.");
        assert.strictEqual(oSetVisibleStub.callCount, 1, "The function setVisible has been called once.");
        assert.deepEqual(oSetVisibleStub.firstCall.args, [oParam], "The function setVisible has been called with the correct parameter.");
    });

    QUnit.test("Does not throw if no contract exists", function (assert) {
        // Arrange
        var oGetContractStub = sinon.stub();

        this.oVizInstanceAbap._oChipInstance = {
            isStub: sinon.stub().returns(false),
            getContract: oGetContractStub
        };

        // Act
        this.oVizInstanceAbap._setVisible();

        // Assert
        assert.strictEqual(oGetContractStub.callCount, 1, "The function getContract has been called once.");
    });

    QUnit.module("The setActive function", {
        beforeEach: function () {
            sandbox.stub(Container, "getServiceAsync");

            sandbox.stub(VizInstanceAbap.prototype, "init");
            this.oVizInstanceAbap = new VizInstanceAbap();

            this.oSetPropertySpy = sandbox.spy(this.oVizInstanceAbap, "setProperty");
            this.oSetVisibleStub = sandbox.stub(this.oVizInstanceAbap, "_setVisible");
            this.oRefreshStub = sandbox.stub(this.oVizInstanceAbap, "refresh");
        },
        afterEach: function () {
            this.oVizInstanceAbap.destroy();
            sandbox.restore();
            Container.resetServices();
        }
    });

    QUnit.test("Calls the _setVisible function", function (assert) {
        // Arrange
        // Act
        this.oVizInstanceAbap.setActive(true);

        // Assert
        assert.strictEqual(this.oSetVisibleStub.callCount, 1, "The function _setVisible has been called once.");
        assert.deepEqual(this.oSetVisibleStub.firstCall.args, [true], "The function _setVisible has been called with the correct parameters.");
    });

    QUnit.test("Calls the setProperty function", function (assert) {
        // Arrange
        // Act
        this.oVizInstanceAbap.setActive(true);

        // Assert
        assert.strictEqual(this.oSetPropertySpy.callCount, 1, "The function setProperty has been called once.");
        assert.deepEqual(this.oSetPropertySpy.firstCall.args, ["active", true, false], "The function setProperty has been called with the correct parameters.");
    });

    QUnit.test("Returns a reference to 'this'", function (assert) {
        // Arrange
        // Act
        var oResult = this.oVizInstanceAbap.setActive();

        // Assert
        assert.strictEqual(oResult, this.oVizInstanceAbap, "The correct reference has been found.");
    });

    QUnit.test("Calls refresh if requested", function (assert) {
        // Arrange
        // Act
        this.oVizInstanceAbap.setActive(true, true);

        // Assert
        assert.strictEqual(this.oRefreshStub.callCount, 1, "The function refresh has been called once.");
    });

    QUnit.test("Does not call refresh in not requested", function (assert) {
        // Arrange
        // Act
        this.oVizInstanceAbap.setActive(true, false);

        // Assert
        assert.strictEqual(this.oRefreshStub.callCount, 0, "The function refresh has not been called once.");
    });

    QUnit.module("The refresh function", {
        beforeEach: function () {
            sandbox.stub(Container, "getServiceAsync");
            sandbox.stub(VizInstanceAbap.prototype, "init");
            this.oVizInstanceAbap = new VizInstanceAbap();
            this.oVizInstanceAbap._oChipInstance = {
                refresh: sandbox.stub()
            };
        },
        afterEach: function () {
            sandbox.restore();
            this.oVizInstanceAbap.destroy();
            Container.resetServices();
        }
    });

    QUnit.test("Calls the CHIP's refresh function if the CHIP is already loaded", function (assert) {
        //Arrange
        //Act
        this.oVizInstanceAbap.refresh();

        //Assert
        assert.strictEqual(this.oVizInstanceAbap._oChipInstance.refresh.callCount, 1, "The refresh function was called.");
    });

    QUnit.test("Doesn't throw an exception if the CHIP instance is not yet loaded", function (assert) {
        //Arrange
        //Act
        this.oVizInstanceAbap.refresh();

        //Assert
        assert.ok(true, "The refresh function didn't crash.");
    });
});
