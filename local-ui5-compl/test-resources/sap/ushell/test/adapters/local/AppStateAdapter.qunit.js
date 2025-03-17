// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.adapters.local.AppStateAdapter
 */
sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/ushell/adapters/local/AppStateAdapter",
    "sap/ushell/Container",
    "sap/ushell/services/appstate/AppStatePersistencyMethod",
    "sap/ushell/services/PersonalizationV2"
], function (
    jQuery,
    AppStateAdapter,
    Container,
    AppStatePersistencyMethod,
    PersonalizationV2
) {
    "use strict";

    /* global QUnit, sinon */
    var sandbox = sinon.sandbox.create();
    const { KeyCategory, WriteFrequency } = PersonalizationV2.prototype;

    QUnit.module("sap.ushell.adapters.local.AppStateAdapter", {
        beforeEach: function () {
            sandbox.stub(Container, "getUser").returns({getId: () => "USERID"});
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Constructor signature", function (assert) {
        var oSystem,
            sParameters,
            oConfig,
            oAdapter;
        oAdapter = new AppStateAdapter(oSystem, sParameters, oConfig);
        assert.equal(typeof oAdapter, "object");
        ["saveAppState", "loadAppState"].forEach(function (sFctName) {
            assert.equal(typeof oAdapter[sFctName], "function", "Function " + sFctName + "present");
        });
    });

    function fakePersonalizationV2Service (sTestKey) {
        var oTheMockContainer;
        // fake Container Object
        oTheMockContainer = {
            setItemValue: function (/*sKey, sValue*/) {
                // do nothing;
            },
            save: function () {
                var savePromise = new jQuery.Deferred();
                if (this._sKey === sTestKey) {
                    savePromise.resolve();
                } else {
                    savePromise.reject("Simulated save failure");
                }
                return savePromise.promise();
            }
        };
        // fake PersonalizationService
        return {
            _oTheMockContainer: oTheMockContainer,
            createEmptyContainer: function (sActualKey/*, oScope*/) {
                oTheMockContainer._sKey = sActualKey;
                //  setTimeout(function () {
                if (sActualKey === "FAILONCREATE") {
                    return Promise.reject("createEmptyContainerFailed");
                }
                return Promise.resolve(oTheMockContainer);
            },
            KeyCategory,
            WriteFrequency
        };
    }

    QUnit.test("saveAppState", function (assert) {
        var done = assert.async();
        var oSystem,
            sParameters,
            oConfig,
            oAdapter,
            oFakePersService,
            oPromise,
            createEmptyContainerSpy,
            setItemValueSpy,
            saveSpy;
        oAdapter = new AppStateAdapter(oSystem, sParameters, oConfig);
        oFakePersService = fakePersonalizationV2Service("AKEY");
        oAdapter._getPersonalizationService = function () { return Promise.resolve(oFakePersService); };
        createEmptyContainerSpy = sinon.spy(oFakePersService, "createEmptyContainer");
        setItemValueSpy = sinon.spy(oFakePersService._oTheMockContainer, "setItemValue");
        saveSpy = sinon.spy(oFakePersService._oTheMockContainer, "save");
        // test
        oPromise = oAdapter.saveAppState("AKEY", "ASESSIONKEY", JSON.stringify({ a: 1 }), "appName", "aComponent");
        oPromise.done(function () {
            assert.ok(createEmptyContainerSpy.calledOnce, "createEmptyContainer called");
            assert.deepEqual(createEmptyContainerSpy.args[0], ["AKEY", {
                keyCategory: "GENERATED_KEY",
                writeFrequency: "HIGH",
                clientStorageAllowed: false
            }], "createEmptyContainer called with proper args");

            assert.deepEqual(setItemValueSpy.args[0], ["appStateData", JSON.stringify({
                a: 1
            })], "container.setData called with proper args");
            assert.ok(saveSpy.calledOnce, "container save called");
            done();
        }).fail(function () {
            assert.ok(false, "should succeed");
            done();
        });
    });

    QUnit.test("saveAppState fails", function (assert) {
        var done = assert.async();
        var oSystem,
            sParameters,
            oConfig,
            oAdapter,
            oFakePersService,
            createEmptyContainerSpy,
            setItemValueSpy,
            saveSpy;
        oAdapter = new AppStateAdapter(oSystem, sParameters, oConfig);
        oFakePersService = fakePersonalizationV2Service("AKEY");
        oAdapter._getPersonalizationService = function () { return Promise.resolve(oFakePersService); };
        createEmptyContainerSpy = sinon.spy(oFakePersService, "createEmptyContainer");
        setItemValueSpy = sinon.spy(oFakePersService._oTheMockContainer, "setItemValue");
        saveSpy = sinon.spy(oFakePersService._oTheMockContainer, "save");
        //test
        oAdapter.saveAppState("AFAILINGKEY", "ASESSIONKEY", JSON.stringify({ a: 1 }), "appName", "aComponent").done(function () {
            assert.ok(false, "expect fail");
            done();
        }).fail(function (sMsg) {
            assert.equal(sMsg, "Simulated save failure", "proper message propagated");
            assert.ok(createEmptyContainerSpy.calledOnce, "createEmptyContainer called");
            assert.deepEqual(createEmptyContainerSpy.args[0], ["AFAILINGKEY", {
                keyCategory: "GENERATED_KEY",
                writeFrequency: "HIGH",
                clientStorageAllowed: false
            }], "createEmptyContainer called with proper args");
            assert.deepEqual(setItemValueSpy.args[0], ["appStateData", JSON.stringify({
                a: 1
            })], "container.setData called with proper args");
            assert.ok(saveSpy.calledOnce, "container save called");
            assert.ok(true, "should succeed");
            done();
        });
    });

    QUnit.test("saveAppState fail on Create", function (assert) {
        var done = assert.async();
        var oSystem,
            sParameters,
            oConfig,
            oAdapter,
            oFakePersService,
            createEmptyContainerSpy,
            setItemValueSpy;
        oAdapter = new AppStateAdapter(oSystem, sParameters, oConfig);
        oFakePersService = fakePersonalizationV2Service("AKEY");
        oAdapter._getPersonalizationService = function () { return Promise.resolve(oFakePersService); };
        createEmptyContainerSpy = sinon.spy(oFakePersService, "createEmptyContainer");
        setItemValueSpy = sinon.spy(oFakePersService._oTheMockContainer, "setItemValue");
        sinon.spy(oFakePersService._oTheMockContainer, "save");
        //test
        oAdapter.saveAppState("FAILONCREATE", "ASESSIONKEY", JSON.stringify({ a: 1 }), "appName", "aComponent").done(function () {
            assert.ok(false, "expect fail");
            done();
        }).fail(function (sMsg) {
            assert.equal(sMsg, "createEmptyContainerFailed", "proper message propagated");
            assert.ok(createEmptyContainerSpy.calledOnce, "createEmptyContainer called");
            assert.deepEqual(createEmptyContainerSpy.args[0], ["FAILONCREATE", {
                keyCategory: "GENERATED_KEY",
                writeFrequency: "HIGH",
                clientStorageAllowed: false
            }], "createEmptyContainer called with proper args");
            assert.deepEqual(setItemValueSpy.called, false, "setItem etc. not called");
            assert.ok(true, "should succeed");
            done();
        });
    });

    function fakePersonalizationV2ServiceLoad (sTestKey, sValue) {
        var oTheMockContainer,
            oMap = {},
            sKey;
        // fake Container Object
        oTheMockContainer = {
            getItemValue: function (sKey) {
                return oMap[sKey];
            }
        };

        sKey = sTestKey;
        oMap.appStateData = sValue;
        // fake PersonalizationService
        return {
            _oTheMockContainer: oTheMockContainer,
            getContainer: function (sActualKey/*, oScope*/) {
                oTheMockContainer._sKey = sActualKey;
                //  setTimeout(function () {
                if (sActualKey === "FAILONGET") {
                    return Promise.reject("getContainerFailed");
                }
                return Promise.resolve(oTheMockContainer);
            },
            deleteContainer: function (sActualKey/*, oScope*/) {
                if (sKey !== sActualKey) {
                    return Promise.reject("delContainerFailed");
                }

                oMap = {};
                sKey = undefined;
                //  setTimeout(function () {
                if (sActualKey === "FAILONGET") {
                    return Promise.reject("delContainerFailed");
                }

                return Promise.resolve();
            },
            KeyCategory,
            WriteFrequency
        };
    }

    QUnit.test("loadAppState", function (assert) {
        var done = assert.async();
        var oSystem,
            sParameters,
            oConfig,
            oAdapter,
            oFakePersService,
            oPromise,
            getContainerSpy,
            getItemValueSpy;
        oAdapter = new AppStateAdapter(oSystem, sParameters, oConfig);
        oFakePersService = fakePersonalizationV2ServiceLoad("AKEY", JSON.stringify({ a: 2 }));
        oAdapter._getPersonalizationService = function () { return Promise.resolve(oFakePersService); };
        getContainerSpy = sinon.spy(oFakePersService, "getContainer");
        getItemValueSpy = sinon.spy(oFakePersService._oTheMockContainer, "getItemValue");
        // test
        oPromise = oAdapter.loadAppState("AKEY");
        oPromise.done(function (sKey, sValue) {
            assert.equal(sKey, "AKEY", "Key ok");
            assert.equal(sValue, JSON.stringify({ a: 2 }), "value ok");
            assert.ok(getContainerSpy.calledOnce, "getContainer called");
            assert.deepEqual(getContainerSpy.args[0], ["AKEY", {
                keyCategory: "GENERATED_KEY",
                writeFrequency: "HIGH",
                clientStorageAllowed: false
            }], "getContainer called with proper args");
            assert.deepEqual(getItemValueSpy.args[0], ["appStateData"], "container.setData called with proper args");
            done();
        }).fail(function () {
            assert.ok(false, "should succeed");
            done();
        });
    });

    QUnit.test("loadAppState fail", function (assert) {
        var done = assert.async();
        var oSystem,
            sParameters,
            oConfig,
            oAdapter,
            oFakePersService,
            oPromise;
        oAdapter = new AppStateAdapter(oSystem, sParameters, oConfig);
        oFakePersService = fakePersonalizationV2ServiceLoad("AKEY", JSON.stringify({ a: 2 }));
        oAdapter._getPersonalizationService = function () { return Promise.resolve(oFakePersService); };
        sinon.spy(oFakePersService, "getContainer");
        sinon.spy(oFakePersService._oTheMockContainer, "getItemValue");
        // test
        oPromise = oAdapter.loadAppState("FAILONGET");
        oPromise.done(function (/*sKey, sValue*/) {
            assert.ok(false, "should fail");
            done();
        }).fail(function (sMsg) {
            assert.ok(true, "should fail");
            assert.equal(sMsg, "getContainerFailed", "getContainer failed");
            assert.ok(oFakePersService.getContainer.calledOnce, "getContainer called");
            assert.deepEqual(oFakePersService.getContainer.args[0], ["FAILONGET", {
                keyCategory: "GENERATED_KEY",
                writeFrequency: "HIGH",
                clientStorageAllowed: false
            }], "getContainer called with proper args");
            done();
        });
    });

    QUnit.test("deleteAppState", function (assert) {
        var done = assert.async();
        var oSystem,
            sParameters,
            oConfig,
            oAdapter,
            oFakePersService,
            oPromise,
            deleteContainerSpy,
            getItemValueSpy;
        oAdapter = new AppStateAdapter(oSystem, sParameters, oConfig);
        oFakePersService = fakePersonalizationV2ServiceLoad("AKEY", JSON.stringify({ a: 2 }));
        oAdapter._getPersonalizationService = function () { return Promise.resolve(oFakePersService); };
        deleteContainerSpy = sinon.spy(oFakePersService, "deleteContainer");
        getItemValueSpy = sinon.spy(oFakePersService._oTheMockContainer, "getItemValue");
        // test
        oPromise = oAdapter.deleteAppState("AKEY");
        oPromise.done(function () {
            assert.ok(deleteContainerSpy.calledOnce, "deleteContainer called");
            assert.deepEqual(deleteContainerSpy.args[0], ["AKEY"], "delContainerSpy called with proper args");
            assert.ok(!getItemValueSpy.calledOnce, ["appStateData"], "getItemValue was not called");
            done();
        }).fail(function () {
            assert.ok(false, "should succeed");
            done();
        });
    });

    QUnit.test("deleteAppState fail", function (assert) {
        var done = assert.async();
        var oSystem,
            sParameters,
            oConfig,
            oAdapter,
            oFakePersService,
            oPromise,
            deleteContainerSpy,
            getItemValueSpy;
        oAdapter = new AppStateAdapter(oSystem, sParameters, oConfig);
        oFakePersService = fakePersonalizationV2ServiceLoad("AKEY", JSON.stringify({ a: 2 }));
        oAdapter._getPersonalizationService = function () { return Promise.resolve(oFakePersService); };
        deleteContainerSpy = sinon.spy(oFakePersService, "deleteContainer");
        getItemValueSpy = sinon.spy(oFakePersService._oTheMockContainer, "getItemValue");
        // test
        oPromise = oAdapter.deleteAppState("FAILONGET");
        oPromise.done(function () {
            assert.ok(false, "should fail");
            done();
        }).fail(function (sMsg) {
            assert.ok(true, "should fail");
            assert.equal(sMsg, "delContainerFailed", "deleteContainer failed");
            assert.ok(deleteContainerSpy.calledOnce, "deleteContainer called");
            assert.ok(!getItemValueSpy.calledOnce, ["appStateData"], "getItemValue was not called");
            assert.equal(oFakePersService.getContainer.args, undefined, "args should be undefined");
            done();
        });
    });

    QUnit.test("getSupportedPersistencyMethods", function (assert) {
        var oAdapter,
            aMethods;
        oAdapter = new AppStateAdapter();
        aMethods = oAdapter.getSupportedPersistencyMethods();
        assert.ok(true, "should pass");
        assert.deepEqual(aMethods, [], "correct persistancy methods");

        oAdapter.getSupportedPersistencyMethods = function () { return [AppStatePersistencyMethod.PersonalState]; };
        aMethods = oAdapter.getSupportedPersistencyMethods();
        assert.ok(true, "should pass");
        assert.deepEqual(aMethods, [AppStatePersistencyMethod.PersonalState],
            "correct persistancy methods");
    });
});
