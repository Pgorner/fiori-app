// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for the reset personalization functionality of sap.ushell.services.PersonalizationV2
 */
sap.ui.define([
    "sap/ushell/services/PersonalizationV2",
    "sap/ushell/adapters/local/PersonalizationAdapter",
    "sap/base/Log"
], function (
    Personalization,
    PersonalizationAdapter,
    Log
) {
    "use strict";

    /* global QUnit, sinon*/

    var sandbox = sinon.createSandbox();

    QUnit.module("_getBackendAdapter", {
        beforeEach: function () {
            this.oBackendAdapter = {
                id: "myAdapter"
            };
            this.oPersonalizationService = new Personalization();
            this.oPersonalizationService._oAdapterWithBackendAdapter = {
                instance: {
                    _oBackendAdapter: this.oBackendAdapter
                }
            };
        }
    });

    QUnit.test("returns the right value", function (assert) {
        // Arrange

        // Act
        var oAdapter = this.oPersonalizationService._getBackendAdapter();

        // Assert
        assert.strictEqual(oAdapter, this.oBackendAdapter, "The right adapter was returned");
    });

    QUnit.module("The function resetEntirePersonalization", {
        beforeEach: function () {
            this.oPersonalizationService = new Personalization();

            this.oResetEntirePersonalizationStub = sandbox.stub();

            this.oGetBackendAdapterStub = sandbox.stub(this.oPersonalizationService, "_getBackendAdapter");
            this.oGetBackendAdapterStub.returns({
                resetEntirePersonalization: this.oResetEntirePersonalizationStub
            });

            this.oIsResetEntirePersonalizationSupported = sandbox.stub(this.oPersonalizationService, "isResetEntirePersonalizationSupported");
        }
    });

    QUnit.test("Passes the call to the adapter if supported", function (assert) {
        // Arrange
        this.oIsResetEntirePersonalizationSupported.resolves(true);

        // Act
        return this.oPersonalizationService.resetEntirePersonalization().then(function () {
            // Assert
            assert.strictEqual(this.oIsResetEntirePersonalizationSupported.callCount, 1, "isResetEntirePersonalizationSupported on the adapter was called once");
            assert.strictEqual(this.oResetEntirePersonalizationStub.callCount, 1, "resetEntirePersonalization on the adapter was called once");
        }.bind(this));
    });

    QUnit.test("Doesn't pass the call to the adapter if not supported", function (assert) {
        // Arrange
        this.oIsResetEntirePersonalizationSupported.resolves(false);
        var done = assert.async();

        // Act
        this.oPersonalizationService.resetEntirePersonalization().catch(function () {
            // Assert
            assert.strictEqual(this.oResetEntirePersonalizationStub.callCount, 0, "resetEntirePersonalization on the adapter was not called");
            done();
        }.bind(this));
    });

    QUnit.module("The function IsResetEntirePersonalizationSupported", {
        beforeEach: function () {
            this.oPersonalizationService = new Personalization();

            this.oIsResetEntirePersonalizationSupportedStub = sandbox.stub();

            this.oGetBackendAdapterStub = sandbox.stub(this.oPersonalizationService, "_getBackendAdapter");
            this.oGetBackendAdapterStub.returns({
                isResetEntirePersonalizationSupported: this.oIsResetEntirePersonalizationSupportedStub,
                resetEntirePersonalization: sandbox.stub()
            });

            this.oLogErrorStub = sandbox.stub(Log, "error");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Resolves to true if resetting is supported", function (assert) {
        // Arrange
        this.oIsResetEntirePersonalizationSupportedStub.resolves(true);

        // Act
        return this.oPersonalizationService.isResetEntirePersonalizationSupported().then(function (bIsSupported) {
            // Assert
            assert.strictEqual(bIsSupported, true, "The right value was returned");
            assert.strictEqual(this.oGetBackendAdapterStub.callCount, 1, "getBackendAdapter was called once");
        }.bind(this));
    });

    QUnit.test("Resolves to false if resetting is not supported", function (assert) {
        // Arrange
        this.oIsResetEntirePersonalizationSupportedStub.resolves(false);

        // Act
        return this.oPersonalizationService.isResetEntirePersonalizationSupported().then(function (bIsSupported) {
            // Assert
            assert.strictEqual(bIsSupported, false, "The right value was returned");
            assert.strictEqual(this.oGetBackendAdapterStub.callCount, 1, "getBackendAdapter was called once");
        }.bind(this));
    });

    QUnit.test("Resolves to false if resetting seems to be supported but the function 'resetEntirePersonalization' is not there", function (assert) {
        // Arrange
        this.oIsResetEntirePersonalizationSupportedStub.resolves(true);

        this.oGetBackendAdapterStub.returns({
            isResetEntirePersonalizationSupported: this.oIsResetEntirePersonalizationSupportedStub
        });

        // Act
        return this.oPersonalizationService.isResetEntirePersonalizationSupported()
            .then(function (bIsSupported) {
                // Assert
                assert.strictEqual(bIsSupported, false, "The right value was returned");
                assert.strictEqual(this.oGetBackendAdapterStub.callCount, 1, "getBackendAdapter was called once");
            }.bind(this));
    });

    QUnit.test("Resolves to true if it can't be checked if resetting is supported and the function 'resetEntirePersonalization' is there", function (assert) {
        // Arrange
        this.oGetBackendAdapterStub.returns({
            resetEntirePersonalization: sandbox.stub()
        });

        // Act
        return this.oPersonalizationService.isResetEntirePersonalizationSupported()
            .then(function (bIsSupported) {
                // Assert
                assert.strictEqual(bIsSupported, true, "The right value was returned");
            });
    });

    QUnit.test("Resolves to false if it can't be checked if resetting is supported and the function 'resetEntirePersonalization' is not there", function (assert) {
        // Arrange
        this.oGetBackendAdapterStub.returns({});

        // Act
        return this.oPersonalizationService.isResetEntirePersonalizationSupported()
            .then(function (bIsSupported) {
                // Assert
                assert.strictEqual(bIsSupported, false, "The right value was returned");
            });
    });

    QUnit.test("Rejects if isResetEntirePersonalizationSupported on the adapter rejects", function (assert) {
        // Arrange
        var oError = new Error("myError");
        this.oIsResetEntirePersonalizationSupportedStub.rejects(oError);
        var sExpectedMessage = "isResetEntirePersonalizationSupported failed with error:";

        // Act
        return this.oPersonalizationService.isResetEntirePersonalizationSupported()
            .then(function () {
                assert.ok(false, "should not resolve");
            })
            .catch(function (oError) {
                // Assert
                assert.strictEqual(oError.message, "myError", "The error was passed!");
                assert.strictEqual(this.oLogErrorStub.callCount, 1, "Log.error was called once");
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, [sExpectedMessage, oError], "Log.error was called with the right args");
            }.bind(this));
    });

    QUnit.module("Integration test module for service and local adapter", {
        beforeEach: function () {
            this._oAdapter = new PersonalizationAdapter();
            this.oPersonalizationService = new Personalization(this._oAdapter);
            this.oIsResetSupportedSpy = sandbox.spy(this.oPersonalizationService, "isResetEntirePersonalizationSupported");
            this.oIsResetSupportedAdapterSpy = sandbox.spy(this._oAdapter, "isResetEntirePersonalizationSupported");
            this.oResetSpy = sandbox.spy(this.oPersonalizationService, "resetEntirePersonalization");
            this.oResetAdapterSpy = sandbox.spy(this._oAdapter, "resetEntirePersonalization");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("works as expected", function (assert) {
        // Arrange
        // Act
        return this.oPersonalizationService.resetEntirePersonalization()
            .then(function () {
                assert.strictEqual(this.oIsResetSupportedSpy.callCount, 1, "The method isResetEntirePersonalizationSupported was called exactly once on the service");
                assert.strictEqual(this.oIsResetSupportedAdapterSpy.callCount, 1, "The method isResetEntirePersonalizationSupported was called exactly once on the adapter");
                this.oIsResetSupportedAdapterSpy.call(0).then(function (bResult) {
                    assert.ok(bResult, "the promise resolved to true");
                });
                assert.strictEqual(this.oResetSpy.callCount, 1, "The method resetEntirePersonalization was called exactly once on the service");
                assert.strictEqual(this.oResetAdapterSpy.callCount, 1, "The method resetEntirePersonalization was called exactly once on the adapter");
            }.bind(this))
            .catch(function (error) {
                assert.ok(false, "there was an error", error);
            });
    });
});
