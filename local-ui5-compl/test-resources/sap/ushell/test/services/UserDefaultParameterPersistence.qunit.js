// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.UserDefaultParameterPersistence
 */
sap.ui.define([
    "sap/ushell/services/UserDefaultParameterPersistence",
    "sap/base/Log",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/Container"
], function (
    UserDefaultParameterPersistence,
    Log,
    jQuery,
    Container
) {
    "use strict";

    /* global QUnit, sinon*/

    const sandbox = sinon.createSandbox({});

    QUnit.module("loadParameterValue", {
        beforeEach: function () {
            this.oAdapter = {
                loadParameterValue: sandbox.stub().returns((new jQuery.Deferred()).resolve({
                    value: "xxx"
                }).promise())
            };
            this.oService = new UserDefaultParameterPersistence(this.oAdapter);

            this.oSystemContextMock = {
                id: "systemContextMockId"
            };
            this.oGetSystemContextFallbackStub = sandbox.stub(this.oService, "_getSystemContextFallback").resolves(this.oSystemContextMock);

            this.oCleanseValueStub = sandbox.stub(this.oService, "_cleanseValue").returns({
                value: "yyy"
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the right value", async function (assert) {
        // Act
        const oResult = await this.oService.loadParameterValue("AKEY", this.oSystemContextMock);
        // Assert
        assert.deepEqual(oResult, {
            value: "yyy"
        }, "the right value was returned");
        assert.strictEqual(this.oCleanseValueStub.callCount, 1, "'cleanseValue' was called once");
        assert.deepEqual(this.oCleanseValueStub.getCall(0).args, [{ value: "xxx" }], "'cleanseValue' was called with the right parameters");
        assert.deepEqual(this.oAdapter.loadParameterValue.getCall(0).args, ["AKEY", this.oSystemContextMock], "'loadParameterValue' called with the right arguments");
    });

    QUnit.test("Rejects if 'loadParamterValue' rejects", function (assert) {
        // Arrange
        this.oAdapter.loadParameterValue.returns((new jQuery.Deferred()).reject("nonono").promise());

        // Act
        return this.oService.loadParameterValue("AKEY", this.oSystemContextMock)
            .then(() => {
                assert.ok(false, "should not get here");
            })
            .catch((a) => {
                // Assert
                assert.deepEqual(a, "nonono", " msg transported");
                assert.strictEqual(this.oCleanseValueStub.callCount, 0, "'cleanseValue' was not called");
            });
    });

    QUnit.module("saveParameterValue", {
        beforeEach: function () {
            this.oAdapter = {
                loadParameterValue: sandbox.stub().returns((new jQuery.Deferred()).resolve({
                    value: "xxx"
                }).promise()),
                saveParameterValue: sandbox.stub().returns((new jQuery.Deferred()).resolve("aaa").promise())
            };
            this.oService = new UserDefaultParameterPersistence(this.oAdapter);

            this.oSystemContextMock = {
                id: "systemContextMockId"
            };
            this.oGetSystemContextFallbackStub = sandbox.stub(this.oService, "_getSystemContextFallback").resolves(this.oSystemContextMock);

            this.oCleanseValueStub = sandbox.stub(this.oService, "_cleanseValue").returns({
                value: "yyy"
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls the right functions", async function (assert) {
        // Act
        await this.oService.saveParameterValue("AKEY", {
            value: "xxx"
        }, this.oSystemContextMock);

        // Assert
        assert.strictEqual(this.oCleanseValueStub.callCount, 1, "'cleanseValue' was called once");
        assert.deepEqual(this.oCleanseValueStub.getCall(0).args, [{ value: "xxx" }], "'cleanseValue' was called with the right parameters");
        assert.deepEqual(this.oAdapter.saveParameterValue.getCall(0).args, ["AKEY", { value: "yyy" }, this.oSystemContextMock], "'saveParameterValue' was called with the right parameters");
    });

    QUnit.test("Rejects if the adapter fails", function (assert) {
        // Arrange
        this.oAdapter.saveParameterValue.returns((new jQuery.Deferred()).reject("aaa").promise());

        // Act
        return this.oService.saveParameterValue("AKEY", {
            value: "xxx"
        }, this.oSystemContextMock)
            .then(() => {
                assert.ok(false, "should not get here");
            })
            .catch((a) => {
                // Assert
                assert.deepEqual(a, "aaa", "failed with the correct message");
                assert.strictEqual(this.oCleanseValueStub.callCount, 1, "'cleansValue' was called exactly once");
                assert.deepEqual(this.oCleanseValueStub.getCall(0).args, [{ value: "xxx" }], "called");
                assert.deepEqual(this.oAdapter.saveParameterValue.getCall(0).args, ["AKEY", { value: "yyy" }, this.oSystemContextMock], "'saveParameterValue' called with the right arguments");
            })
            ;
    });

    QUnit.module("deleteParameter", {
        beforeEach: function () {
            this.oAdapter = {
                deleteParameter: sandbox.stub().returns((new jQuery.Deferred()).resolve("aaa").promise())
            };
            this.oService = new UserDefaultParameterPersistence(this.oAdapter);

            this.oSystemContextMock = {
                id: "systemContextMockId"
            };
            this.oGetSystemContextFallbackStub = sandbox.stub(this.oService, "_getSystemContextFallback").resolves(this.oSystemContextMock);

            this.oCleanseValueStub = sandbox.stub(this.oService, "_cleanseValue").returns({
                value: "yyy"
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls the right functions", async function (assert) {
        // Act
        await this.oService.deleteParameter("AKEY", this.oSystemContextMock);

        // Assert
        assert.deepEqual(this.oAdapter.deleteParameter.getCall(0).args, ["AKEY", this.oSystemContextMock], "'deleteParameterValue' was called with the right arguments");
    });

    QUnit.module("getStoredParameterNames", {
        beforeEach: function () {
            this.oAdapter = {
                getStoredParameterNames: sandbox.stub().returns((new jQuery.Deferred()).resolve(["CCC", "AAA", "BbB"]).promise())
            };
            this.oService = new UserDefaultParameterPersistence(this.oAdapter);

            this.oSystemContextMock = {
                id: "systemContextMockId"
            };
            this.oGetSystemContextFallbackStub = sandbox.stub(this.oService, "_getSystemContextFallback").resolves(this.oSystemContextMock);
        }
    });

    QUnit.test("Calls the right functions", async function (assert) {
        // Act
        const aNames = await this.oService.getStoredParameterNames();

        // Assert
        assert.deepEqual(aNames, ["AAA", "BbB", "CCC"], "The right values were returned");
        assert.strictEqual(this.oAdapter.getStoredParameterNames.callCount, 1, "'getStoredParameterNames' called once");
    });

    QUnit.module("_cleanseValue", {
        beforeEach: function () {
            this.oService = new UserDefaultParameterPersistence({});
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the right result", function (assert) {
        // Act
        const oResult = this.oService._cleanseValue({
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            value: "123",
            noStore: true,
            noEdit: false,
            alwaysAskPlugin: true
        });

        // Assert
        assert.deepEqual(oResult, { value: "123", noEdit: false, alwaysAskPlugin: true }, "The right result was returned");
    });

    QUnit.module("_getSystemContextFallback", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oSystemContextMock = {
                id: "systemContext"
            };

            this.oGetSystemContextStub = sandbox.stub();
            this.oGetSystemContextStub.resolves(this.oSystemContextMock);
            this.oGetServiceAsyncStub.withArgs("ClientSideTargetResolution").resolves({
                getSystemContext: this.oGetSystemContextStub
            });

            this.oWarningStub = sandbox.stub(Log, "warning");

            this.oService = new UserDefaultParameterPersistence({});
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the default systemContext when parameter is undefined", async function (assert) {
        // Arrange
        const sExpectedWarning = "UserDefaultParameterPersistence: The systemContext was not provided, using defaultSystemContext as fallback";
        // Act
        const oSystemContext = await this.oService._getSystemContextFallback();
        // Assert
        assert.strictEqual(oSystemContext, this.oSystemContextMock, "returned the correct systemContext");
        assert.strictEqual(this.oGetSystemContextStub.callCount, 1, "getSystemContext was called once");
        assert.deepEqual(this.oWarningStub.getCall(0).args, [sExpectedWarning], "raised the correct warning");
    });

    QUnit.module("Component tests: Save, load and delete ParameterValue", {
        beforeEach: function () {
            this.oAdapter = {
                loadParameterValue: sandbox.stub().returns((new jQuery.Deferred()).resolve({
                    value: "xxx"
                }).promise()),
                saveParameterValue: sandbox.stub().returns((new jQuery.Deferred()).resolve("aaa").promise()),
                deleteParameter: sandbox.stub().returns((new jQuery.Deferred()).resolve("aaa").promise())
            };
            this.oService = new UserDefaultParameterPersistence(this.oAdapter);

            this.oSystemContextMock = {
                id: "systemContextMockId"
            };
            this.oGetSystemContextFallbackStub = sandbox.stub(this.oService, "_getSystemContextFallback").resolves(this.oSystemContextMock);

            this.oCleanseValueStub = sandbox.stub(this.oService, "_cleanseValue").callsFake(() => {
                return {
                    value: "yyy"
                };
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the cached value", async function (assert) {
        await this.oService.saveParameterValue("AKEY", { value: "xxx" }, this.oSystemContextMock);

        assert.ok(true, "saved");
        assert.strictEqual(this.oCleanseValueStub.callCount, 1, "'cleanseValue' was called exactly once");
        assert.deepEqual(this.oCleanseValueStub.getCall(0).args, [{ value: "xxx" }], "'cleanseValue' was called with the right parameters");
        assert.deepEqual(this.oAdapter.saveParameterValue.getCall(0).args, ["AKEY", { value: "yyy" }, this.oSystemContextMock], "'saveParameterValue' was called with the right arguments");
        assert.strictEqual(this.oAdapter.loadParameterValue.callCount, 0, "'loadParameterValue' was not called");

        // load AKEY, loading cleansed value from last save operation
        const oResult = await this.oService.loadParameterValue("AKEY", this.oSystemContextMock);

        assert.deepEqual(oResult, { value: "yyy" }, " value ok");
        assert.strictEqual(this.oCleanseValueStub.callCount, 1, "'cleanseValue' was called once");
        assert.strictEqual(this.oAdapter.loadParameterValue.callCount, 0, "'loadParameterValue' was not called");
    });

    QUnit.test("Returns the cached value and cleaning works", async function (assert) {
        // Arrange
        this.oCleanseValueStub.restore();

        const oData = {
            noEdit: true,
            notstored: "zzz",
            value: "yyy"
        };

        // Act
        await this.oService.saveParameterValue("AKEY", oData, this.oSystemContextMock);
        const oResult = await this.oService.loadParameterValue("AKEY", this.oSystemContextMock);
        // Assert
        assert.deepEqual(oResult, { value: "yyy", noEdit: true }, "The right value was loaded");
        assert.deepEqual(this.oAdapter.saveParameterValue.getCall(0).args,
            ["AKEY", { noEdit: true, value: "yyy" }, this.oSystemContextMock],
            "'saveParameterValue' was called with the right arguments");
    });

    QUnit.test("Calls the adapter's deleteParameter function if undefined is passed as the value", async function (assert) {
        assert.expect(7);
        this.oAdapter.saveParameterValue.returns(new jQuery.Deferred().resolve().promise());

        this.oAdapter.loadParameterValue.returns(new jQuery.Deferred().resolve({
            value: "fakeLoad"
        }).promise());
        this.oCleanseValueStub.callsFake((a) => {
            return a;
        });

        await this.oService.saveParameterValue("AKEY", { value: "abc" }, this.oSystemContextMock);
        assert.ok(true, "saved");

        const oResult1 = await this.oService.loadParameterValue("AKEY", this.oSystemContextMock);

        assert.ok(true, "saved");
        assert.deepEqual(oResult1, { value: "abc" }, "loaded value is saved value");

        await this.oService.saveParameterValue("AKEY", undefined, this.oSystemContextMock);

        assert.ok(true, "saved (undefined)");
        assert.ok(this.oAdapter.deleteParameter.calledOnce, "delete called");

        const oResult2 = await this.oService.loadParameterValue("AKEY", this.oSystemContextMock);

        assert.ok(true, "saved");
        assert.deepEqual(oResult2, { value: "fakeLoad" }, "loaded value empty");
    });

    QUnit.module("Component tests: save and load value with extendedParameter cleaning", {
        beforeEach: function () {
            this.oAdapter = {
                deleteParameter: sandbox.stub().returns((new jQuery.Deferred()).resolve("aaa").promise()),
                saveParameterValue: sandbox.stub().callsFake(function (sParameterName, aValue) {
                    this.oAdapterSavedValue = aValue;
                    return new jQuery.Deferred().resolve().promise();
                }),
                loadParameterValue: sandbox.stub().callsFake(function () {
                    return new jQuery.Deferred().resolve(this.oAdapterSavedValue).promise();
                })
            };
            this.oService = new UserDefaultParameterPersistence(this.oAdapter);

            this.oSystemContextMock = {
                id: "systemContextMockId"
            };
            this.oGetSystemContextFallbackStub = sandbox.stub(this.oService, "_getSystemContextFallback").resolves(this.oSystemContextMock);
        }
    });

    QUnit.test("Saves the right object if there is a value and no extended value in it", async function (assert) {
        assert.expect(4);
        const oValue = {
            value: "123",
            extendedValue: {
                a: "b"
            }
        };
        const oExpectedValue = {
            value: "123",
            extendedValue: {
                a: "b"
            }
        };

        const oSavedObject = {};
        if (Object.hasOwnProperty.call(oValue, "value")) {
            oSavedObject.value = oValue.value;
        }
        if (Object.hasOwnProperty.call(oValue, "extendedValue")) {
            oSavedObject.extendedValue = oValue.extendedValue;
        }
        await this.oService.saveParameterValue("AKEY", oSavedObject, this.oSystemContextMock);

        assert.ok(true, "saved");
        assert.deepEqual(this.oAdapter.saveParameterValue.getCall(0).args, ["AKEY", oExpectedValue, this.oSystemContextMock], "'saveParameterValue' was  called with the right arguments");

        const oResult = await this.oService.loadParameterValue("AKEY", this.oSystemContextMock);

        assert.ok(true, "saved");
        assert.deepEqual(oResult, oExpectedValue, "loaded value ok");
    });

    QUnit.test("Saves the right object if there is only a value and no extended value in it", async function (assert) {
        assert.expect(4);
        const oValue = {
            value: "123"
        };
        const oExpectedValue = {
            value: "123"
        };

        const oSavedObject = {};
        if (Object.hasOwnProperty.call(oValue, "value")) {
            oSavedObject.value = oValue.value;
        }
        if (Object.hasOwnProperty.call(oValue, "extendedValue")) {
            oSavedObject.extendedValue = oValue.extendedValue;
        }

        await this.oService.saveParameterValue("AKEY", oSavedObject, this.oSystemContextMock);

        assert.ok(true, "saved");
        assert.deepEqual(this.oAdapter.saveParameterValue.getCall(0).args, ["AKEY", oExpectedValue, this.oSystemContextMock], "'saveParameterValue' was  called with the right arguments");

        const oResult = await this.oService.loadParameterValue("AKEY", this.oSystemContextMock);

        assert.ok(true, "saved");
        assert.deepEqual(oResult, oExpectedValue, "loaded value ok");
    });

    QUnit.test("Saves the right object if there is a value and an undefined extended value in it", async function (assert) {
        assert.expect(4);
        const oValue = {
            value: "123",
            extendedValue: undefined
        };
        const oExpectedValue = {
            value: "123"
        };

        const oSavedObject = {};
        if (Object.hasOwnProperty.call(oValue, "value")) {
            oSavedObject.value = oValue.value;
        }
        if (Object.hasOwnProperty.call(oValue, "extendedValue")) {
            oSavedObject.extendedValue = oValue.extendedValue;
        }

        await this.oService.saveParameterValue("AKEY", oSavedObject, this.oSystemContextMock);

        assert.ok(true, "saved");
        assert.deepEqual(this.oAdapter.saveParameterValue.getCall(0).args, ["AKEY", oExpectedValue, this.oSystemContextMock], "'saveParameterValue' was  called with the right arguments");

        const oResult = await this.oService.loadParameterValue("AKEY", this.oSystemContextMock);

        assert.ok(true, "saved");
        assert.deepEqual(oResult, oExpectedValue, "loaded value ok");
    });

    QUnit.test("Saves the right object if there is only an extended value and no value in it", async function (assert) {
        assert.expect(4);
        const oValue = {
            extendedValue: {
                a: "b"
            }
        };
        const oExpectedValue = {
            extendedValue: {
                a: "b"
            }
        };

        const oSavedObject = {};
        if (Object.hasOwnProperty.call(oValue, "value")) {
            oSavedObject.value = oValue.value;
        }
        if (Object.hasOwnProperty.call(oValue, "extendedValue")) {
            oSavedObject.extendedValue = oValue.extendedValue;
        }

        await this.oService.saveParameterValue("AKEY", oSavedObject, this.oSystemContextMock);

        assert.ok(true, "saved");
        assert.deepEqual(this.oAdapter.saveParameterValue.getCall(0).args, ["AKEY", oExpectedValue, this.oSystemContextMock], "'saveParameterValue' was  called with the right arguments");
        const oResult = await this.oService.loadParameterValue("AKEY", this.oSystemContextMock);

        assert.ok(true, "saved");
        assert.deepEqual(oResult, oExpectedValue, "loaded value ok");
    });

    QUnit.test("Saves the right object if there is an extended value and an unexpected value in it", async function (assert) {
        assert.expect(4);
        const oValue = {
            extendedValue: {
                a: "b"
            },
            value: undefined
        };
        const oExpectedValue = {
            extendedValue: {
                a: "b"
            }
        };

        const oSavedObject = {};
        if (Object.hasOwnProperty.call(oValue, "value")) {
            oSavedObject.value = oValue.value;
        }
        if (Object.hasOwnProperty.call(oValue, "extendedValue")) {
            oSavedObject.extendedValue = oValue.extendedValue;
        }

        await this.oService.saveParameterValue("AKEY", oSavedObject, this.oSystemContextMock);

        assert.ok(true, "saved");
        assert.deepEqual(this.oAdapter.saveParameterValue.getCall(0).args, ["AKEY", oExpectedValue, this.oSystemContextMock], "'saveParameterValue' was  called with the right arguments");

        const oResult = await this.oService.loadParameterValue("AKEY", this.oSystemContextMock);

        assert.ok(true, "saved");
        assert.deepEqual(oResult, oExpectedValue, "loaded value ok");
    });

    QUnit.module("Component tests: Save and load value, no store", {
        beforeEach: function () {
            this.oAdapter = {
                saveParameterValue: sandbox.stub().callsFake(function (sParameterName, aValue) {
                    this.oAdapterSavedValue = aValue;
                    return new jQuery.Deferred().resolve().promise();
                }),
                loadParameterValue: sandbox.stub().callsFake(function () {
                    return new jQuery.Deferred().resolve(this.oAdapterSavedValue).promise();
                })
            };
            this.oService = new UserDefaultParameterPersistence(this.oAdapter);

            this.oSystemContextMock = {
                id: "systemContextMockId"
            };
            this.oGetSystemContextFallbackStub = sandbox.stub(this.oService, "_getSystemContextFallback").resolves(this.oSystemContextMock);
        }
    });

    QUnit.test("Saves an empty object if No store is true and save called is false", async function (assert) {
        assert.expect(4);

        const oValue = {
            noStore: true,
            value: "123",
            extendedValue: {
                a: "b"
            }
        };
        const oExpectedValue = {};
        const oSavedObject = {
            noStore: oValue.noStore
        };
        if (Object.hasOwnProperty.call(oValue, "value")) {
            oSavedObject.value = oValue.value;
        }
        if (Object.hasOwnProperty.call(oValue, "extendedValue", this.oSystemContextMock)) {
            oSavedObject.extendedValue = oValue.extendedValue;
        }

        await this.oService.saveParameterValue("AKEY", oSavedObject, this.oSystemContextMock);

        assert.ok(true, "saved");
        const oResult = await this.oService.loadParameterValue("AKEY", this.oSystemContextMock);

        assert.ok(true, "saved");
        assert.deepEqual(oResult, oExpectedValue, "loaded value ok");
        assert.strictEqual(this.oAdapter.saveParameterValue.callCount, 0, "'saveParameterValue' was not called");
    });

    QUnit.test("Saves the given object if No store is true and save called is true", async function (assert) {
        assert.expect(5);

        const oValue = {
            noStore: "true",
            value: "123"
        };
        const oExpectedValue = {
            value: "123"
        };
        const oSavedObject = {
            noStore: oValue.noStore
        };
        if (Object.hasOwnProperty.call(oValue, "value")) {
            oSavedObject.value = oValue.value;
        }
        if (Object.hasOwnProperty.call(oValue, "extendedValue", this.oSystemContextMock)) {
            oSavedObject.extendedValue = oValue.extendedValue;
        }

        await this.oService.saveParameterValue("AKEY", oSavedObject, this.oSystemContextMock);

        assert.ok(true, "saved");
        const oResult = await this.oService.loadParameterValue("AKEY", this.oSystemContextMock);

        assert.ok(true, "saved");
        assert.deepEqual(oResult, oExpectedValue, "loaded value ok");
        assert.strictEqual(this.oAdapter.saveParameterValue.callCount, 1, "'saveParameterValue' was called exactly once");
        assert.deepEqual(this.oAdapter.saveParameterValue.getCall(0).args, ["AKEY", oExpectedValue, this.oSystemContextMock], "'saveParameterValue' was called with the right arguments");
    });

    QUnit.test("Saves the given object if save called is false", async function (assert) {
        assert.expect(5);

        const oValue = {
            value: "123"
        };
        const oExpectedValue = {
            value: "123"
        };
        const oSavedObject = {
            noStore: oValue.noStore
        };
        if (Object.hasOwnProperty.call(oValue, "value")) {
            oSavedObject.value = oValue.value;
        }
        if (Object.hasOwnProperty.call(oValue, "extendedValue", this.oSystemContextMock)) {
            oSavedObject.extendedValue = oValue.extendedValue;
        }

        await this.oService.saveParameterValue("AKEY", oSavedObject, this.oSystemContextMock);

        assert.ok(true, "saved");

        const oResult = await this.oService.loadParameterValue("AKEY", this.oSystemContextMock);

        assert.ok(true, "saved");
        assert.deepEqual(oResult, oExpectedValue, "loaded value ok");
        assert.strictEqual(this.oAdapter.saveParameterValue.callCount, 1, "'saveParameterValue' was called exactly once");
        assert.deepEqual(this.oAdapter.saveParameterValue.getCall(0).args, ["AKEY", oExpectedValue, this.oSystemContextMock], "'saveParameterValue' was called with the right arguments");
    });

    QUnit.test("Saves the given object if there is only an extendedValue and save called is false", async function (assert) {
        assert.expect(5);

        const oValue = {
            extendedValue: "xxxx"
        };
        const oExpectedValue = {
            extendedValue: "xxxx"
        };

        const oSavedObject = {
            noStore: oValue.noStore
        };
        if (Object.hasOwnProperty.call(oValue, "value")) {
            oSavedObject.value = oValue.value;
        }
        if (Object.hasOwnProperty.call(oValue, "extendedValue", this.oSystemContextMock)) {
            oSavedObject.extendedValue = oValue.extendedValue;
        }

        await this.oService.saveParameterValue("AKEY", oSavedObject, this.oSystemContextMock);

        assert.ok(true, "saved");
        const oResult = await this.oService.loadParameterValue("AKEY", this.oSystemContextMock);

        assert.ok(true, "saved");
        assert.deepEqual(oResult, oExpectedValue, "loaded value ok");
        assert.strictEqual(this.oAdapter.saveParameterValue.callCount, 1, "'saveParameterValue' was called exactly once");
        assert.deepEqual(this.oAdapter.saveParameterValue.getCall(0).args, ["AKEY", oExpectedValue, this.oSystemContextMock], "'saveParameterValue' was called with the right arguments");

    });

    QUnit.test("Saves an empty object if the given object is empty", async function (assert) {
        assert.expect(5);

        const oValue = {};
        const oExpectedValue = {};

        const oSavedObject = {
            noStore: oValue.noStore
        };
        if (Object.hasOwnProperty.call(oValue, "value")) {
            oSavedObject.value = oValue.value;
        }
        if (Object.hasOwnProperty.call(oValue, "extendedValue", this.oSystemContextMock)) {
            oSavedObject.extendedValue = oValue.extendedValue;
        }
        await this.oService.saveParameterValue("AKEY", oSavedObject, this.oSystemContextMock);

        assert.ok(true, "saved");
        const oResult = await this.oService.loadParameterValue("AKEY", this.oSystemContextMock);

        assert.ok(true, "saved");
        assert.deepEqual(oResult, oExpectedValue, "loaded value ok");
        assert.strictEqual(this.oAdapter.saveParameterValue.callCount, 1, "'saveParameterValue' was called exactly once");
        assert.deepEqual(this.oAdapter.saveParameterValue.getCall(0).args, ["AKEY", oExpectedValue, this.oSystemContextMock], "'saveParameterValue' was called with the right arguments");
    });
});
