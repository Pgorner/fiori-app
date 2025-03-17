// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.adapters.local.UserDefaultParameterPersistenceAdapter
 */
sap.ui.define([
    "sap/base/Log",
    "sap/ushell/adapters/local/UserDefaultParameterPersistenceAdapter",
    "sap/ushell/Container",
    "sap/ushell/services/PersonalizationV2"
], function (
    Log,
    UserDefaultParameterPersistenceAdapter,
    Container,
    PersonalizationV2
) {
    "use strict";

    const { KeyCategory, WriteFrequency } = PersonalizationV2.prototype;

    /* global sinon, QUnit */

    var sandbox = sinon.createSandbox({});

    QUnit.module("sap.ushell.adapters.local.UserDefaultParameterPersistenceAdapter", {
        // This method is called after each test. Add every restoration code here.
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("ctor signature", function (assert) {
        var oAdapter = new UserDefaultParameterPersistenceAdapter();
        assert.strictEqual(typeof oAdapter, "object", "The adapter is of type object");
        assert.strictEqual(typeof oAdapter.saveParameterValue, "function", "Function saveParameterValue is present");
        assert.strictEqual(typeof oAdapter.loadParameterValue, "function", "Function loadParameterValue is present");
    });

    QUnit.test("Integration: saveParameterValue calls the right functions", function (assert) {
        // Arrange
        var oAdapter = new UserDefaultParameterPersistenceAdapter();
        var oSetItemValueStub = sandbox.stub();
        var oSaveStub = sandbox.stub().resolves();
        var oMockContainer = {
            save: oSaveStub,
            setItemValue: oSetItemValueStub
        };

        var oGetContainerStub = sandbox.stub().resolves(oMockContainer);

        var oMockService = {
            getContainer: oGetContainerStub,
            KeyCategory,
            WriteFrequency
        };

        oAdapter._getPersonalizationService = sandbox.stub().returns(Promise.resolve(oMockService));

        var oSystemContextMock = { id: "mySystemContext" };
        // Act
        return oAdapter.saveParameterValue("AKEY", { value: "abc" }, oSystemContextMock)
            .done(function () {
                // Assert
                assert.strictEqual(oGetContainerStub.callCount, 1, "getContainer was called exactly once");
                assert.deepEqual(oGetContainerStub.getCall(0).args, ["sap.ushell.UserDefaultParameter.mySystemContext", {
                    keyCategory: "FIXED_KEY",
                    writeFrequency: "LOW",
                    clientStorageAllowed: true
                }], "getContainer called with proper args");

                assert.deepEqual(oSetItemValueStub.getCall(0).args, ["AKEY", {
                    value: "abc"
                }], "container.setItemValue called with proper args");
                assert.strictEqual(oSaveStub.callCount, 1, "save was called exactly once");
            })
            .fail(function () {
                assert.ok(false, "should succeed");
            });
    });

    [
        { testName: "too long", paramName: "AKEYwhichIsWayToLongToBeLegalAndThusErrorLog", ok: false },
        { testName: "spaces", paramName: "Are you trying", ok: false },
        { testName: "special chars", paramName: "to&$AX", ok: false },
        { testName: "empty string", paramName: "", ok: false },
        { testName: "special chars 2", paramName: "break_the_%&%_system", ok: false },
        { testName: "special chars ok", paramName: "stick-to_legal_Params.1234", ok: true }
    ].forEach(function (oFixture) {
        QUnit.test("saveParameterValue illegal key raises log : " + oFixture.testName, function (assert) {
            // Arrange
            var sParameterName = oFixture.paramName;
            var oAdapter = new UserDefaultParameterPersistenceAdapter();

            var oSetItemValueStub = sandbox.stub();
            var oSaveStub = sandbox.stub().resolves();

            var oMockContainer = {
                save: oSaveStub,
                setItemValue: oSetItemValueStub
            };

            var oGetContainerStub = sandbox.stub().resolves(oMockContainer);

            var oMockService = {
                getContainer: oGetContainerStub,
                KeyCategory,
                WriteFrequency
            };

            oAdapter._getPersonalizationService = sandbox.stub().returns(Promise.resolve(oMockService));

            sandbox.spy(Log, "error");
            var oSystemContextMock = { id: "mySystemContext" };
            // Act
            return oAdapter.saveParameterValue(sParameterName, { value: "abc" }, oSystemContextMock)
                .done(function () {
                    // Assert
                    assert.deepEqual(
                        Log.error.getCall(0).args,
                        (["Illegal Parameter Key, less than 40 characters and [A-Za-z0-9.-_]+ :\"" + sParameterName + "\""]),
                        "called error with the right params"
                    );
                    assert.strictEqual(oGetContainerStub.callCount, 1, "getContainer called exactly once");
                    assert.deepEqual(oGetContainerStub.getCall(0).args, ["sap.ushell.UserDefaultParameter.mySystemContext", {
                        keyCategory: "FIXED_KEY",
                        writeFrequency: "LOW",
                        clientStorageAllowed: true
                    }], "getContainer called with proper args");

                    assert.deepEqual(oSetItemValueStub.getCall(0).args, [sParameterName, {
                        value: "abc"
                    }], "container.setItemValue called with proper args");
                    assert.strictEqual(oSaveStub.callCount, 1, "save was called exactly once");
                    sandbox.restore();
                })
                .fail(function () {
                    assert.ok(false, "should succeed");
                });
        });
    });

    QUnit.test("Integration: loadParameterValue calls the right functions", function (assert) {
        // Arrange
        var oAdapter = new UserDefaultParameterPersistenceAdapter();

        var oSetItemValueStub = sandbox.stub();
        var oSaveStub = sandbox.stub().resolves();
        var oGetItemValueStub = sandbox.stub().returns({ value: 123 });

        var oMockContainer = {
            save: oSaveStub,
            setItemValue: oSetItemValueStub,
            getItemValue: oGetItemValueStub
        };

        var oGetContainerStub = sandbox.stub().resolves(oMockContainer);

        var oMockService = {
            getContainer: oGetContainerStub,
            KeyCategory,
            WriteFrequency
        };

        oAdapter._getPersonalizationService = sandbox.stub().returns(Promise.resolve(oMockService));
        var oSystemContextMock = { id: "mySystemContext" };

        // Act
        return oAdapter.loadParameterValue("AKEY", oSystemContextMock)
            .done(function () {
                // Assert
                assert.strictEqual(oGetContainerStub.callCount, 1, "getContainer called exactly once");
                assert.deepEqual(oGetContainerStub.getCall(0).args, ["sap.ushell.UserDefaultParameter.mySystemContext", {
                    keyCategory: "FIXED_KEY",
                    writeFrequency: "LOW",
                    clientStorageAllowed: true
                }], "getContainer called with proper args");

                assert.deepEqual(oGetItemValueStub.getCall(0).args, ["AKEY"], "container.getItemValue called with proper args");
                assert.strictEqual(oSetItemValueStub.callCount, 0, "setItemValue was not called");
            })
            .fail(function () {
                assert.ok(false, "should succeed");
            });
    });

    QUnit.test("Integration: loadParameterValue fails if getItemValue returns undefined", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oAdapter = new UserDefaultParameterPersistenceAdapter();

        var oSetItemValueStub = sandbox.stub();
        var oSaveStub = sandbox.stub().resolves();
        var oGetItemValueStub = sandbox.stub().returns(undefined);

        var oMockContainer = {
            save: oSaveStub,
            setItemValue: oSetItemValueStub,
            getItemValue: oGetItemValueStub
        };

        var oGetContainerStub = sandbox.stub().resolves(oMockContainer);

        var oMockService = {
            getContainer: oGetContainerStub,
            KeyCategory,
            WriteFrequency
        };

        oAdapter._getPersonalizationService = sandbox.stub().returns(Promise.resolve(oMockService));
        var oSystemContextMock = { id: "mySystemContext" };

        // Act
        oAdapter.loadParameterValue("AKEY", oSystemContextMock)
            .done(function () {
                // Assert
                assert.ok(false, " should not succeed");
                fnDone();
            })
            .fail(function () {
                assert.ok(true, "should fail");
                fnDone();
            });
    });

    QUnit.test("Integration: deleteParameter calls the right functions", function (assert) {
        // Arrange
        var oAdapter = new UserDefaultParameterPersistenceAdapter();

        var oSetItemValueStub = sandbox.stub();
        var oSaveStub = sandbox.stub().resolves();
        var oDeleteItemStub = sandbox.stub().returns(undefined);

        var oMockContainer = {
            save: oSaveStub,
            setItemValue: oSetItemValueStub,
            deleteItem: oDeleteItemStub
        };

        var oGetContainerStub = sandbox.stub().resolves(oMockContainer);

        var oMockService = {
            getContainer: oGetContainerStub,
            KeyCategory,
            WriteFrequency
        };

        oAdapter._getPersonalizationService = sandbox.stub().returns(Promise.resolve(oMockService));
        var oSystemContextMock = { id: "mySystemContext" };
        // Act
        return oAdapter.deleteParameter("AKEY", oSystemContextMock)
            .done(function () {
                // Assert
                assert.strictEqual(oDeleteItemStub.callCount, 1, "deleteItem called exactly once");
                assert.deepEqual(oDeleteItemStub.getCall(0).args, ["AKEY"], "deleteItem was called with the correct args");
                assert.strictEqual(oSaveStub.callCount, 1, "save called exactly once");
            })
            .fail(function () {
                assert.ok(false, "should succeed");
            });
    });

    QUnit.test("Integration: getStoredParameterNames calls the right functions", function (assert) {
        // Arrange
        var oAdapter = new UserDefaultParameterPersistenceAdapter();

        var oSetItemValueStub = sandbox.stub();
        var oSaveStub = sandbox.stub().resolves();
        var oGetItemKeysStub = sandbox.stub().returns(["AAA", "BBB"]);

        var oMockContainer = {
            setItemValue: oSetItemValueStub,
            save: oSaveStub,
            getItemKeys: oGetItemKeysStub
        };

        var oGetContainerStub = sandbox.stub().resolves(oMockContainer);

        var oMockService = {
            getContainer: oGetContainerStub,
            KeyCategory,
            WriteFrequency
        };

        var oSystemContextMock = { id: "mySystemContext" };

        oAdapter._getPersonalizationService = sandbox.stub().returns(Promise.resolve(oMockService));
        // Act
        return oAdapter.getStoredParameterNames(oSystemContextMock)
            .done(function (a) {
                // Assert
                assert.deepEqual(a, ["AAA", "BBB"], "The right values were returned");
            })
            .fail(function () {
                assert.ok(false, "should not fail");
            });
    });
});
