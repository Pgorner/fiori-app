// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.AppState
 */
sap.ui.define([
    "sap/base/Log",
    "sap/base/util/ObjectPath",
    "sap/ui/core/UIComponent",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/Container",
    "sap/ushell/services/AppState",
    "sap/ushell/services/appstate/AppStatePersistencyMethod",
    "sap/ushell/services/appstate/SequentializingAdapter",
    "sap/ushell/services/appstate/WindowAdapter",
    "sap/ushell/utils"
], function (
    Log,
    ObjectPath,
    UIComponent,
    jQuery,
    Container,
    AppState,
    AppStatePersistencyMethod,
    SequentializingAdapter,
    WindowAdapter,
    utils
) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox();

    QUnit.module("sap.ushell.services.AppState", {
        beforeEach: function () {
            if (WindowAdapter.prototype.data) {
                WindowAdapter.prototype.data._clear();
            }
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    // AppState Mock Adapter
    var AppStateMockAdapter = function () {
        this._oAppStateMap = new utils.Map();
        this._oErrorMap = new utils.Map();
    };
    ObjectPath.set("AppStateMockAdapter", AppStateMockAdapter);

    AppStateMockAdapter.prototype.saveAppState = function (sKey, sSessionKey, sData/*, sAppname, sComponent*/) {
        var deferred = new jQuery.Deferred();
        if (!this._oErrorMap.containsKey(sKey)) {
            this._oAppStateMap.put(sKey, sData);
            deferred.resolve();
        } else {
            deferred.reject("Save of AppState failed");
        }
        return deferred.promise();
    };

    AppStateMockAdapter.prototype.loadAppState = function (sKey) {
        var deferred = new jQuery.Deferred();
        if (!this._oErrorMap.containsKey(sKey) && this._oAppStateMap.containsKey(sKey)) {
            deferred.resolve(sKey, this._oAppStateMap.get(sKey));
        } else {
            deferred.reject("Key not found");
        }
        return deferred.promise();
    };

    AppStateMockAdapter.prototype.deleteAppState = function (sKey) {
        var deferred = new jQuery.Deferred();
        if (!this._oErrorMap.containsKey(sKey)) {
            if (this._oAppStateMap.containsKey(sKey)) {
                this._oAppStateMap.remove(sKey);
                deferred.resolve();
            } else {
                deferred.reject("delete of AppState failed");
            }
        } else {
            deferred.reject("delete of AppState failed");
        }
        return deferred.promise();
    };

    // util function to create correctly wrapped service config
    function createServiceConfig (bTransient) {
        var oServiceConfig = {
            config: {}
        };

        if (bTransient !== undefined) {
            oServiceConfig.config.transient = !!bTransient;
        }

        return oServiceConfig;
    }

    [{
        testDescription: "service config is undefined",
        oServiceConfig: undefined,
        oExpectedConfigInService: undefined
    }, {
        testDescription: "service config contains inner config object",
        oServiceConfig: { config: { some: "thing" } },
        oExpectedConfigInService: { some: "thing" }
    }].forEach(function (oFixture) {
        QUnit.test("Constructor extracts config object, passes original config to window adapter when " + oFixture.testDescription, function (assert) {
            var oDummyAdapter = { dummy: true },
                oAppStateServiceInstance,
                oWindowAdapterInitStub;

            oWindowAdapterInitStub = sandbox.stub(WindowAdapter.prototype, "_init");
            oAppStateServiceInstance = new AppState(oDummyAdapter, undefined, undefined, oFixture.oServiceConfig);

            assert.deepEqual(oAppStateServiceInstance._oConfig, oFixture.oExpectedConfigInService,
                "service config in instance set correctly");
            assert.strictEqual(oWindowAdapterInitStub.callCount, 1,
                "WindowAdapter._init called exactly once");
            assert.deepEqual(oWindowAdapterInitStub.args[0][2], oFixture.oServiceConfig,
                "service config passed to WindowWdapter correctly");
        });
    });

    // after calling setData on an AppState instance, the set data was cloned and cannot be changed anymore
    QUnit.test("constructor createEmptyAppState set get data, serialization", function (assert) {
        var oService = new AppState(),
            oAppState,
            data;
        sandbox.stub(oService, "_getGeneratedKey").returns("AKEY");
        oAppState = oService.createEmptyAppState();
        data = { a: 1, b: NaN };
        oAppState.setData(data);
        data.a = 2;
        assert.deepEqual(oAppState.getData(), { a: 1, b: null }, "value serialization");
        assert.equal(oAppState.getKey(), "AKEY", "key got");
    });

    QUnit.test("constructor createEmptyAppState, method signatures", function (assert) {
        var oService = new AppState(),
            oAppState;
        sandbox.stub(oService, "_getGeneratedKey").returns("AKEY");
        oAppState = oService.createEmptyAppState();
        ["getKey", "setData", "getData", "save"].forEach(function (sFctName) {
            assert.equal(typeof oAppState[sFctName], "function", "function " + sFctName + "present");
        });
    });

    QUnit.test("constructor createEmptyUnmodifiableAppState, method signatures", function (assert) {
        var oService = new AppState(),
            oAppState;
        sandbox.stub(oService, "_getGeneratedKey").returns("AKEY");
        oAppState = oService.createEmptyUnmodifiableAppState();
        ["getKey", "getData"].forEach(function (sFctName) {
            assert.equal(typeof oAppState[sFctName], "function", "function " + sFctName + "present");
        });
        ["setData", "save"].forEach(function (sFctName) {
            assert.equal(typeof oAppState[sFctName], "undefined", "function " + sFctName + "not present");
        });
    });

    QUnit.test("constructor, getAppState, signature , get available Key", function (assert) {
        var oService,
            oFakeAdapter;
        var done = assert.async();

        oFakeAdapter = new AppStateMockAdapter();
        oService = new AppState(oFakeAdapter);

        oFakeAdapter.saveAppState("ZKEY", undefined, JSON.stringify({ a: 1 }), undefined, undefined).done(function () {
            oService.getAppState("ZKEY").done(function (oAppState) {
                assert.deepEqual(oAppState.getKey(), "ZKEY", "key function ok");
                assert.deepEqual(oAppState.getData(), { a: 1 }, "key function ok");
                assert.equal(oAppState.save, undefined);
                assert.equal(oAppState.setData, undefined);
                done();
                ["getKey", "getData"].forEach(function (sFctName) {
                    assert.equal(typeof oAppState[sFctName], "function", "function " + sFctName + "present");
                });
                ["setData", "save", "setItemValue", "getItemValue"].forEach(function (sFctName) {
                    assert.equal(typeof oAppState[sFctName], "undefined", "function " + sFctName + " not  present");
                });
            }).fail(function () {
                done();
            });
        }).fail(function () {
            assert.ok(false, "expect ok");
        });
        sandbox.stub(oService, "_getGeneratedKey").returns("AKEY");
    });

    QUnit.test("constructor, initial keys, getAppState  read from window", function (assert) {
        var oService,
            oFakeAdapter,
            spyLoad;
        var done = assert.async();
        oFakeAdapter = new AppStateMockAdapter();
        oService = new AppState(oFakeAdapter, undefined, undefined, { config: { initialAppStates: { BKEY: JSON.stringify({ a: 2 }) } } });
        spyLoad = sandbox.spy(oFakeAdapter, "loadAppState");
        oService.getAppState("BKEY").done(function (oAppState) {
            assert.deepEqual(oAppState.getKey(), "BKEY", "key function ok");
            assert.deepEqual(oAppState.getData(), { a: 2 }, "value ok");
            assert.equal(spyLoad.callCount, 0, "loadAppState called once");
            done();
        }).fail(function () {
            assert.ok(false, " promise fullfilled");
            done();
        });
    });

    QUnit.test("constructor, getAppState read from appstate data", function (assert) {
        var oService,
            oFakeAdapter,
            spyLoad;
        var done = assert.async();
        var oAppStateData = {b: 3};
        var sAppStateKey = JSON.stringify(oAppStateData);
        oFakeAdapter = new AppStateMockAdapter();
        oService = new AppState(oFakeAdapter);
        spyLoad = sandbox.spy(oFakeAdapter, "loadAppState");
        oService.getAppState(sAppStateKey).done(function (oAppState) {
            assert.deepEqual(oAppState.getKey(), sAppStateKey, "key function ok");
            assert.deepEqual(oAppState.getData(), {b: 3}, "value ok");
            assert.equal(spyLoad.callCount, 0, "loadAppState not called");
            done();
        }).fail(function () {
            assert.ok(false, " promise fullfilled");
            done();
        });
    });

    QUnit.test("constructor, getAppState read from invalid appstate data", function (assert) {
        var oService,
            oFakeAdapter,
            spyLoad;
        var done = assert.async();
        var sAppStateKey = "ABCD";
        oFakeAdapter = new AppStateMockAdapter();
        oService = new AppState(oFakeAdapter);
        spyLoad = sandbox.spy(oFakeAdapter, "loadAppState");
        oService.getAppState(sAppStateKey).done(function (oAppState) {
            assert.deepEqual(oAppState.getKey(), sAppStateKey, "key function ok");
            assert.strictEqual(oAppState.getData(), undefined, "value should be undefined");
            assert.equal(spyLoad.callCount, 1, "loadAppState called once");
            done();
        }).fail(function () {
            assert.ok(false, " promise fullfilled");
            done();
        });
    });

    QUnit.test("constructor, initial keys via promise getAppState  read from window", function (assert) {
        var oService,
            oFakeAdapter,
            fnResolve,
            oInitialAppStatesPromise,
            spyLoad;
        var done = assert.async();
        oFakeAdapter = new AppStateMockAdapter();
        oInitialAppStatesPromise = new Promise(function (resolve) {
            fnResolve = resolve;
        });
        oService = new AppState(oFakeAdapter, undefined, undefined, {
            config: { initialAppStatesPromise: oInitialAppStatesPromise }
        });
        spyLoad = sandbox.spy(oFakeAdapter, "loadAppState");
        oService.getAppState("BKEY").done(function (oAppState) {
            assert.deepEqual(oAppState.getKey(), "BKEY", "key function ok");
            assert.deepEqual(oAppState.getData(), undefined, "value ok");
            assert.equal(spyLoad.callCount, 1, "loadAppState called once");
            fnResolve({ BKEY: JSON.stringify({ a: 2 }) });
            // timeout as ES6 promise is always async!
            setTimeout(function () {
                oService.getAppState("BKEY").done(function (oAppState) {
                    assert.deepEqual(oAppState.getKey(), "BKEY", "key function ok");
                    assert.deepEqual(oAppState.getData(), { a: 2 }, "value ok");
                    assert.equal(spyLoad.callCount, 1, "loadAppState called once");
                    done();
                }).fail(function () {
                    assert.ok(false, " promise fullfilled");
                    done();
                });
            }, 0);
        }).fail(function () {
            assert.ok(false, " promise fullfilled");
            done();
        });
    });

    QUnit.test("load present appstate, load again, 2nd served from cache!", function (assert) {
        var oService,
            oFakeAdapter,
            spyLoad;
        var done = assert.async();

        oFakeAdapter = new AppStateMockAdapter();
        oService = new AppState(oFakeAdapter);
        spyLoad = sandbox.spy(oFakeAdapter, "loadAppState");
        oFakeAdapter.saveAppState("ZKEY", undefined, JSON.stringify({ a: 1 }), undefined, undefined).done(function () {
            oService.getAppState("ZKEY").done(function (oAppState) {
                assert.deepEqual(oAppState.getKey(), "ZKEY", "key function ok");
                assert.deepEqual(oAppState.getData(), { a: 1 }, "key function ok");
                assert.equal(oAppState.save, undefined);
                assert.equal(oAppState.setData, undefined);
                ["getKey", "getData"].forEach(function (sFctName) {
                    assert.equal(typeof oAppState[sFctName], "function", "function " + sFctName + "present");
                });
                ["setData", "save", "setItemValue", "getItemValue"].forEach(function (sFctName) {
                    assert.equal(typeof oAppState[sFctName], "undefined", "function " + sFctName + " not  present");
                });
                assert.equal(spyLoad.callCount, 1, "loadAppState called once");
                oService.getAppState("ZKEY").done(function (oAppState2) {
                    assert.deepEqual(oAppState2.getKey(), "ZKEY", "key function ok");
                    assert.deepEqual(oAppState2.getData(), { a: 1 }, "key function ok");
                    assert.equal(spyLoad.callCount, 1, "loadAppState still caled once!");
                    spyLoad.restore();
                    done();
                }).fail(function () {
                    assert.ok(false, " promise fullfilled");
                    done();
                });
            }).fail(function () {
                assert.ok(false, " promise fullfilled");
                done();
            });
        }).fail(function () {
            assert.ok(false, " promise fullfilled");
        });
        sandbox.stub(oService, "_getGeneratedKey").returns("AKEY");
    });

    QUnit.test("constructor, getAppState, signature get Not available Key ", function (assert) {
        var oService,
            oFakeAdapter;
        var done = assert.async();

        oFakeAdapter = new AppStateMockAdapter();
        oService = new AppState(oFakeAdapter);

        oFakeAdapter.saveAppState("NOKEY", undefined, JSON.stringify({ a: 1 }), undefined, undefined).done(function () {
            oService.getAppState("BKEY").done(function (oAppState) {
                assert.deepEqual(oAppState.getKey(), "BKEY", "key fct ok");
                assert.deepEqual(oAppState.getData(), undefined, "key fct ok");
                assert.equal(oAppState.save, undefined);
                assert.equal(oAppState.setData, undefined);
                done();
                ["getKey", "getData"].forEach(function (sFctName) {
                    assert.equal(typeof oAppState[sFctName], "function", "function " + sFctName + "present");
                });
                ["setData", "save", "setItemValue", "getItemValue"].forEach(function (sFctName) {
                    assert.equal(typeof oAppState[sFctName], "undefined", "function " + sFctName + " not  present");
                });
            }).fail(function () {
                assert.ok(false, "expect ok");
                done();
            });
        }).fail(function () { });
        sandbox.stub(oService, "_getGeneratedKey").returns("AKEY");
    });

    QUnit.test("constructor createEmptyAppState, config set to 'not transient, not transient save", function (assert) {
        var oAppState,
            oAppComponent,
            oFakeAdapter,
            oService,
            spy;
        var done = assert.async();
        oAppComponent = new UIComponent();
        oFakeAdapter = new AppStateMockAdapter();
        spy = sandbox.spy(oFakeAdapter, "saveAppState");
        oService = new AppState(oFakeAdapter, {}, {}, createServiceConfig(false));

        sandbox.stub(oService, "_getGeneratedKey").returns("AKEY");

        oFakeAdapter.saveAppState("AKEY", undefined, JSON.stringify({ a: 1 }), undefined, undefined).done(function () {
            oAppState = oService.createEmptyAppState(oAppComponent, false);
            oAppState.setData({ a: "b" });
            oAppState.save().done(function () {
                assert.deepEqual(spy.args[1], ["AKEY", "AKEY", "{\"a\":\"b\"}", "sap.ui.core.UIComponent", "", undefined, undefined], "arguments ok");
                assert.ok(true, "save ok");
                done();
            }).fail(function () {
                assert.ok(false, "expect ok");
                done();
            });
        }).fail(function () { });
    });

    QUnit.test("constructor createEmptyAppState transient with transient save", function (assert) {
        var oAppState,
            oAppComponent,
            oFakeAdapter,
            oService,
            spy;
        var done = assert.async();
        oAppComponent = new UIComponent();
        oFakeAdapter = new AppStateMockAdapter();
        spy = sandbox.spy(oFakeAdapter, "saveAppState");
        oService = new AppState(oFakeAdapter, {}, {}, createServiceConfig(true));

        sandbox.stub(oService, "_getGeneratedKey").returns("AKEY");

        oFakeAdapter.saveAppState("AKEY", undefined, JSON.stringify({ a: 1 }), undefined, undefined).done(function () {
            oAppState = oService.createEmptyAppState(oAppComponent, true);
            oAppState.setData({ a: "b" });
            oAppState.save().done(function () {
                assert.deepEqual(spy.callCount, 1, "save only called once");
                assert.ok(true, "save ok");
                done();
            }).fail(function () {
                assert.ok(false, "expect ok");
                done();
            });
        }).fail(function () { });
    });

    QUnit.test("constructor createEmptyAppState, config transient AppState - not transient save", function (assert) {
        var oAppState,
            oAppComponent,
            oFakeAdapter,
            oService,
            spy;
        var done = assert.async();
        oAppComponent = new UIComponent();
        oFakeAdapter = new AppStateMockAdapter();
        spy = sandbox.spy(oFakeAdapter, "saveAppState");
        oService = new AppState(oFakeAdapter, {}, {}, createServiceConfig(true));

        sandbox.stub(oService, "_getGeneratedKey").returns("AKEY");
        oAppState = oService.createEmptyAppState(oAppComponent, false);
        oAppState.setData({ a: "b" });
        oAppState.save().done(function () {
            assert.equal(spy.called, false, " adapter save not called");
            oService.getAppState("AKEY").done(function (oas) {
                assert.deepEqual(oas.getData(), { a: "b" }, "data can be retrieved from window adapter");
                done();
            }).fail(function () {
                assert.ok(false, "expect ok");
                done();
            });
            assert.ok(true, "save ok");
        }).fail(function () {
            assert.ok(false, "expect ok");
            done();
        });
    });

    QUnit.test("constructor createEmptyAppState transient save", function (assert) {
        var oAppState,
            oAppComponent,
            oFakeAdapter,
            oService,
            spy;
        var done = assert.async();
        oAppComponent = new UIComponent();
        oFakeAdapter = new AppStateMockAdapter();
        spy = sandbox.spy(oFakeAdapter, "saveAppState");
        oService = new AppState(oFakeAdapter, {}, {}, createServiceConfig(true));

        sandbox.stub(oService, "_getGeneratedKey").returns("AKEY");
        oAppState = oService.createEmptyAppState(oAppComponent);
        oAppState.setData({ a: "b" });
        oAppState.save().done(function () {
            assert.equal(spy.called, false, " adapter save not called");
            oService.getAppState("AKEY").done(function (oas) {
                assert.deepEqual(oas.getData(), { a: "b" }, "data can be retrieved from window adapter");
                done();
            }).fail(function () {
                assert.ok(false, "expect ok");
                done();
            });
            assert.ok(true, "save ok");
        }).fail(function () {
            assert.ok(false, "expect ok");
            done();
        });
    });

    QUnit.test("constructor createEmptyAppState metadata extraction save", function (assert) {
        var done = assert.async();
        var oAppComponent = new UIComponent({ metadata: { "sap.app": "xxx" } });
        sandbox.stub(oAppComponent, "getManifest").returns({ "sap.app": { ach: "XX-UU" } });
        sandbox.stub(oAppComponent, "getMetadata").returns({
            getName: sandbox.stub().returns("myname"),
            isA: sandbox.stub().returns(true)
        });
        var oFakeAdapter = new AppStateMockAdapter();
        var spy = sandbox.spy(oFakeAdapter, "saveAppState");
        var oService = new AppState(oFakeAdapter, {}, {}, createServiceConfig(false));

        sandbox.stub(oService, "_getGeneratedKey").returns("AKEY");

        oFakeAdapter.saveAppState("AKEY", undefined, JSON.stringify({ a: 1 }), undefined, undefined)
            .done(function () {
                var oAppState = oService.createEmptyAppState(oAppComponent);
                oAppState.setData({ a: "b" });
                oAppState.save()
                    .done(function () {
                        assert.deepEqual(spy.args[1], ["AKEY", "AKEY", "{\"a\":\"b\"}", "myname", "XX-UU", undefined, undefined], "arguments ok");
                        assert.ok(true, "save ok");
                    })
                    .fail(function () {
                        assert.ok(false, "expect ok");
                    })
                    .always(done);
            })
            .fail(function () { });
    });

    QUnit.test("constructor createEmptyAppState, no component passed", function (assert) {
        var oFakeAdapter,
            oService,
            cnt = 0;

        oFakeAdapter = new AppStateMockAdapter();
        sandbox.spy(oFakeAdapter, "saveAppState");
        oService = new AppState(oFakeAdapter);

        sandbox.stub(oService, "_getGeneratedKey").returns("AKEY");

        try {
            // undefined is ok!, but not ok on CrossApplcationNavigation (!!!)
            oService.createEmptyAppState(undefined);
            cnt = cnt + 1;
        } catch (ex) {
            assert.ok(false, "should be ok");
        }
        try {
            // undefined is ok!, but not ok on CrossApplcationNavigation (!!!)
            oService.createEmptyAppState({});
            assert.ok(false, "should be ok");
        } catch (ex2) {
            cnt = cnt + 1;
        }
        assert.equal(cnt, 2, "Ran through relevant sections");
    });

    QUnit.test("test LimitedBuffer", function (assert) {
        new WindowAdapter(undefined, undefined);
        var cut = WindowAdapter.prototype.data,
            i;

        for (i = 0; i < 1000; i = i + 1) {
            cut.addAsHead(String(i), String(2 * i));
        }
        for (i = 500; i < 1000; i = i + 1) {
            assert.deepEqual(cut.getByKey(String(i)), { key: String(i), persistencyMethod: undefined, persistencySettings: undefined, value: String(2 * i) }, i + " found");
        }
        for (i = 0; i < 500; i = i + 1) {
            assert.equal(cut.getByKey(String(i)), undefined, i + "i no longer found");
        }
    });

    QUnit.test("test LimitedBuffer identical keys always last", function (assert) {
        // when starting to overwrite with identical keys, aunusedays the last record is found
        new WindowAdapter(undefined, undefined);
        var cut = WindowAdapter.prototype.data,
            i;

        for (i = 0; i < 80; i = i + 1) {
            cut.addAsHead(String(i % 3), String(2 * i));
            assert.deepEqual(cut.getByKey(String(i % 3)), { key: String(i % 3), persistencyMethod: undefined, persistencySettings: undefined, value: String(2 * i) }, i + " last found");
        }
        for (i = 1000; i < 1496; i = i + 1) {
            cut.addAsHead(String(i), String(2 * i));
            assert.equal(cut.getByKey(String(0)).value, String(156), i + " found");
            assert.equal(cut.getByKey(String(1)).value, String(158), i + " found");
            assert.equal(cut.getByKey(String(2)).value, String(154), i + " found");
        }
        cut.addAsHead(String(i), String(2 * i));
        assert.deepEqual(cut.getByKey(String(0)), { key: "0", persistencyMethod: undefined, persistencySettings: undefined, value: String(156) }, i + " 0 found");
        assert.deepEqual(cut.getByKey(String(1)), { key: "1", persistencyMethod: undefined, persistencySettings: undefined, value: String(158) }, i + " 1 found");
        assert.deepEqual(cut.getByKey(String(2)), { key: "2", persistencyMethod: undefined, persistencySettings: undefined, value: String(154) }, i + " 2 found");
        i = i + 1;
        cut.addAsHead(String(i), String(2 * i));
        assert.deepEqual(cut.getByKey(String(0)), { key: "0", persistencyMethod: undefined, persistencySettings: undefined, value: String(156) }, i + " 0 found");
        assert.deepEqual(cut.getByKey(String(1)), { key: "1", persistencyMethod: undefined, persistencySettings: undefined, value: String(158) }, i + " 1 found");
        assert.deepEqual(cut.getByKey(String(2)), undefined, i + " 2 found");
        i = i + 1;
        cut.addAsHead(String(i), String(2 * i));
        assert.deepEqual(cut.getByKey(String(0)), undefined, i + " 0 found");
        assert.deepEqual(cut.getByKey(String(1)), { key: "1", persistencyMethod: undefined, persistencySettings: undefined, value: String(158) }, i + " 1 found");
        assert.deepEqual(cut.getByKey(String(2)), undefined, i + " 2 found");
        i = i + 1;
        cut.addAsHead(String(i), String(2 * i));
        assert.deepEqual(cut.getByKey(String(0)), undefined, i + " 0 found");
        assert.deepEqual(cut.getByKey(String(1)), undefined, i + " 1 found");
        assert.deepEqual(cut.getByKey(String(2)), undefined, i + " 2 found");
    });

    QUnit.test("constructor createEmptyAppState, save fails", function (assert) {
        var oAppState,
            oAppComponent,
            oFakeAdapter,
            oService;
        var done = assert.async();
        oAppComponent = new UIComponent();
        oFakeAdapter = new AppStateMockAdapter();
        sandbox.spy(oFakeAdapter, "saveAppState");
        oService = new AppState(oFakeAdapter, {}, {}, createServiceConfig(false));

        sandbox.stub(oService, "_getGeneratedKey").returns("AKEY");

        oFakeAdapter.saveAppState("AKEY", undefined, JSON.stringify({ a: 1 }), undefined, undefined).done(function () {
            oFakeAdapter._oErrorMap.put("AKEY", "AKEY");
            oAppState = oService.createEmptyAppState(oAppComponent, false);
            oAppState.setData({ a: "b" });
            oAppState.save().done(function () {
                assert.ok(false, "save ok");
                done();
            }).fail(function () {
                assert.ok(true, "expect ok");
                done();
            });
        }).fail(function () { });
    });

    QUnit.test("constructor createEmptyAppState, not transient save with personal state", function (assert) {
        var oAppState,
            oService;
        var done = assert.async();

        Container.init("local").then(function () {
            var appStateAdapter = new AppStateMockAdapter();
            appStateAdapter.getSupportedPersistencyMethods = function () { return [AppStatePersistencyMethod.PersonalState]; };
            oService = new AppState(appStateAdapter, {}, {}, createServiceConfig(false));

            sandbox.stub(oService, "_getGeneratedKey").returns("AKEY1234");

            oAppState = oService.createEmptyAppState(undefined, false, AppStatePersistencyMethod.PersonalState);
            oAppState.setData({ a: "b" });
            oAppState.save().done(function () {
                oService.getAppState("AKEY1234").done(function (oAppState) {
                    assert.ok(oAppState._sKey === "AKEY1234", "Key ok");
                    assert.ok(oAppState._sData === JSON.stringify({ a: "b" }), "Data ok");
                    assert.ok(oAppState._sPersistencyMethod === AppStatePersistencyMethod.PersonalState, "PersistencyMethod ok");
                    done();
                }).fail(function () {
                    assert.ok(false, "expect ok");
                    done();
                });
            });
        });
    });

    QUnit.test("Sequentializer", function (assert) {
        var res = [],
            p1 = new jQuery.Deferred(), // promise 1
            p2 = new jQuery.Deferred(); // promise 2
        //= AppState._getSequentializer();
        function fn (pro, a2) {
            res.push("fn called " + a2);
            return pro.promise();
        }
        // non sequentialized execution
        fn(p1).done(function (a, b, c) {
            res.push({ status: "done c1", a: a, b: b, c: c });
        }).fail(function (a, b, c) {
            res.push({ status: "fail c1", a: a, b: b, c: c });
        });
        res.push("after f1");
        // non sequentialized execution
        fn(p2, true).done(function (a, b, c) {
            res.push({ status: "done c1", a: a, b: b, c: c });
        }).fail(function (a, b, c) {
            res.push({ status: "fail c1", a: a, b: b, c: c });
        });
        res.push("after f2");
        res.push("before p2 resolve");
        p2.resolve(1, "j");
        res.push("after p2 resolve");
        res.push("before p1 resolve");
        p1.resolve("k", "l");
        res.push("after p1 resolve");
        assert.deepEqual(res, [
            "fn called undefined",
            "after f1",
            "fn called true",
            "after f2",
            "before p2 resolve",
            {
                a: 1,
                b: "j",
                c: undefined,
                status: "done c1"
            },
            "after p2 resolve",
            "before p1 resolve",
            {
                a: "k",
                b: "l",
                c: undefined,
                status: "done c1"
            },
            "after p1 resolve"
        ], "sequence ok");
    });

    QUnit.test("With Sequentializer", function (assert) {
        var oSequentializer,
            res = [],
            p1 = new jQuery.Deferred(), // promise 1
            p2 = new jQuery.Deferred(); // promise 2
        oSequentializer = AppState._getSequentializer();
        function fn (pro, a2) {
            res.push("fn called " + a2);
            return pro.promise();
        }
        oSequentializer.addToQueue(fn.bind(undefined, p1)).done(function (a, b, c) {
            res.push({ status: "done c1", a: a, b: b, c: c });
        }).fail(function (a, b, c) {
            res.push({ status: "fail c1", a: a, b: b, c: c });
        });
        res.push("after f1");
        oSequentializer.addToQueue(fn.bind(undefined, p2, true)).done(function (a, b, c) {
            res.push({ status: "done c1", a: a, b: b, c: c });
        }).fail(function (a, b, c) {
            res.push({ status: "fail c1", a: a, b: b, c: c });
        });
        res.push("after f2");
        res.push("before p2 resolve");
        p2.resolve(1, "j");
        res.push("after p2 resolve");
        res.push("before p1 resolve");
        p1.resolve("k", "l");
        res.push("after p1 resolve");
        assert.deepEqual(res, [
            "fn called undefined",
            "after f1",
            "after f2",
            "before p2 resolve",
            "after p2 resolve",
            "before p1 resolve",
            {
                a: "k",
                b: "l",
                c: undefined,
                status: "done c1"
            },
            "fn called true",
            {
                a: 1,
                b: "j",
                c: undefined,
                status: "done c1"
            },
            "after p1 resolve"
        ], "sequence ok");
    });

    QUnit.test("With Sequentializer reject", function (assert) {
        var oSequentializer,
            res = [],
            p1 = new jQuery.Deferred(), // promise 1
            p2 = new jQuery.Deferred(); // promise 2
        oSequentializer = AppState._getSequentializer();
        function fn (pro, a2) {
            res.push("fn called " + a2);
            return pro.promise();
        }
        oSequentializer.addToQueue(fn.bind(undefined, p1)).done(function (a, b, c) {
            res.push({ status: "done c1", a: a, b: b, c: c });
        }).fail(function (a, b, c) {
            res.push({ status: "fail c1", a: a, b: b, c: c });
        });
        res.push("after f1");
        oSequentializer.addToQueue(fn.bind(undefined, p2, true)).done(function (a, b, c) {
            res.push({ status: "done c1", a: a, b: b, c: c });
        }).fail(function (a, b, c) {
            res.push({ status: "fail c1", a: a, b: b, c: c });
        });
        res.push("after f2");
        res.push("before p2 resolve");
        p2.reject(1, "j");
        res.push("after p2 resolve");
        res.push("before p1 resolve");
        p1.reject("k", "l");
        res.push("after p1 resolve");
        assert.deepEqual(res, [
            "fn called undefined",
            "after f1",
            "after f2",
            "before p2 resolve",
            "after p2 resolve",
            "before p1 resolve",
            {
                a: "k",
                b: "l",
                c: undefined,
                status: "fail c1"
            },
            "fn called true",
            {
                a: 1,
                b: "j",
                c: undefined,
                status: "fail c1"
            },
            "after p1 resolve"
        ], "sequence ok");
    });

    QUnit.test("SequentializingAdapter", function (assert) {
        var oFakeAdapter,
            res = [],
            pSave = [new jQuery.Deferred(), new jQuery.Deferred()],
            pLoad = new jQuery.Deferred(),
            callCnt = -1,
            oAdapter;
        oFakeAdapter = {
            saveAppState: function () {
                callCnt = callCnt + 1;
                return pSave[callCnt];
            },
            loadAppState: function () {
                return pLoad;
            }
        };
        oAdapter = new SequentializingAdapter(oFakeAdapter);
        sandbox.spy(oFakeAdapter, "loadAppState");
        oAdapter.loadAppState("123");
        assert.ok(oFakeAdapter.loadAppState.called, "load called");
        sandbox.spy(oFakeAdapter, "saveAppState");
        oAdapter.saveAppState("aaa", "bbb", "ccc", "ddd", "eee").done(function (arg1/*, arg2*/) {
            res.push("save aaa done " + arg1);
        });
        oAdapter.saveAppState("bbb", "bbb", "ccc", "ddd", "eee").done(function (arg1, arg2) {
            res.push("save bbb done " + arg2);
        });
        pSave[1].resolve("resolved1", "resolved1");
        pSave[0].resolve("resolved0", "resolved0");
        assert.equal(oFakeAdapter.saveAppState.callCount, 2, "save called");
        assert.deepEqual(res, ["save aaa done resolved0", "save bbb done resolved1"]);
    });

    /*
        * Window Caching (saving an application state in the window object is tested implicitly)
        */

    QUnit.test("getAppState scenario not transient - found in window cache", function (assert) {
        var oAppState,
            oFakeAdapter,
            oService,
            spySave,
            spyLoad;
        var done = assert.async();

        oFakeAdapter = new AppStateMockAdapter();
        oService = new AppState(oFakeAdapter, {}, {}, createServiceConfig(false));
        // clear window cache initially
        WindowAdapter.prototype.data._clear();

        sandbox.stub(oService, "_getGeneratedKey").returns("FROMWINDOWCACHE");
        spyLoad = sandbox.spy(oFakeAdapter, "loadAppState");
        spySave = sandbox.spy(oFakeAdapter, "saveAppState");

        oAppState = oService.createEmptyAppState(new UIComponent());
        oAppState.setData({ a: 1, b: NaN });
        oAppState.save().done(function () {
            assert.equal(spySave.callCount, 1, "AppState saved in window cache and in backend");
            oService.getAppState("FROMWINDOWCACHE").done(function (oAppState) {
                assert.deepEqual(oAppState.getData(), { a: 1, b: null }, "correct data retrieved from window cache");
                assert.equal(spyLoad.callCount, 0, "loadAppState of FakeAdapter was not called");
                done();
            }).fail(function () { });
        }).fail(function () { });
    });

    [{
        testCaseDescription: "not transient",
        bTransient: false,
        saveCallCount: 1,
        loadCallcount: 1,
        expectedData: {
            a: 1,
            b: null
        }
    }, {
        testCaseDescription: "transient",
        bTransient: true,
        saveCallCount: 0,
        loadCallcount: 1,
        expectedData: undefined
    }].forEach(function (Fixture) {
        QUnit.test("getAppState scenario - " + Fixture.testCaseDescription + " not found in window cache", function (assert) {
            var oAppState,
                oFakeAdapter,
                oService,
                spySave,
                spyLoad;
            var done = assert.async();

            oFakeAdapter = new AppStateMockAdapter();
            oService = new AppState(oFakeAdapter, {}, {}, createServiceConfig(false));
            // clear window cache initially
            WindowAdapter.prototype.data._clear();

            sandbox.stub(oService, "_getGeneratedKey").returns("FROMBACKEND");
            spyLoad = sandbox.spy(oFakeAdapter, "loadAppState");
            spySave = sandbox.spy(oFakeAdapter, "saveAppState");

            oAppState = oService.createEmptyAppState(new UIComponent(), Fixture.bTransient);
            oAppState.setData({ a: 1, b: NaN });
            oAppState.save().done(function () {
                // clear window cache
                WindowAdapter.prototype.data._clear();
                assert.equal(spySave.callCount, Fixture.saveCallCount, "AppState saved sucessfully");
                oService.getAppState("FROMBACKEND").done(function (oAppState) {
                    assert.deepEqual(oAppState.getData(), Fixture.expectedData, "correct data retrieved from backend");
                    assert.equal(spyLoad.callCount, Fixture.loadCallcount, "loadAppState of FakeAdapter was called");
                    done();
                }).fail(function () { });
            }).fail(function () { });
        });
    });

    QUnit.test("AppState default is transient", function (assert) {
        var oFakeAdapter = new AppStateMockAdapter(),
            oAppComponent = new UIComponent(),
            oService = new AppState(oFakeAdapter);

        sandbox.stub(oService, "_getGeneratedKey").returns("FOO");
        var oAppState = oService.createEmptyAppState(oAppComponent);

        assert.ok(oAppState._bTransient, "Check if default for AppState transient = true");
    });

    QUnit.test("AppState getAppState read from opening window when no window cache is available", function (assert) {
        var oFakeAdapter,
            oFakeOpener,
            oService,
            oInput = { sKey: "FooAppState" },
            oExpected = {
                sKey: "FooAppState",
                oAppState: { foo: "AppState" }
            },
            oOriginalOpener = window.opener;
        var done = assert.async();

        oFakeOpener = {
            sap: {
                ui: {
                    require: function () {
                        return {
                            WindowAdapter: {
                                prototype: {
                                    data: {
                                        getByKey: function (sKey) {
                                            return sKey === oExpected.sKey ? { value: oExpected.oAppState } : undefined;
                                        }
                                    }
                                }
                            }
                        };
                    }
                },
                ushell: "NeedsToBePresentToMakeTheAdapterThinkTheOpenerIsAFLP"
            }
        };

        oFakeAdapter = new AppStateMockAdapter();
        oService = new AppState(oFakeAdapter);
        // clear window cache initially
        WindowAdapter.prototype.data._clear();

        window.opener = oFakeOpener;

        oService._loadAppState(oInput.sKey)
            .done(function (sKey, oAppState) {
                assert.strictEqual(sKey, oExpected.sKey, "Correct key used");
                assert.deepEqual(oAppState, oExpected.oAppState, "AppState loaded from opener");
                window.opener = oOriginalOpener;
                done();
            });
    });

    QUnit.test("AppState getAppState read from window cache when opener is a FLP", function (assert) {
        var oFakeAdapter,
            oFakeOpener,
            oService,
            oInput = { sKey: "FooAppState" },
            oExpected = {
                sKey: "FooAppState",
                oAppState: { foo: "AppState" }
            },
            oOriginalOpener = window.opener;
        var done = assert.async();

        oFakeOpener = {
            sap: {
                ui: {
                    require: function () {
                        return {
                            WindowAdapter: {
                                prototype: {
                                    data: {
                                        getByKey: function (sKey) {
                                            return sKey === oExpected.sKey ? { value: { someAppState: "NotUsed!" } } : undefined;
                                        }
                                    }
                                }
                            }
                        };
                    }
                },
                ushell: "NeedsToBePresentToMakeTheAdapterThinkTheOpenerIsAFLP"
            }
        };

        oFakeAdapter = new AppStateMockAdapter();
        oService = new AppState(oFakeAdapter);
        // clear window cache initially
        WindowAdapter.prototype.data._clear();

        WindowAdapter.prototype.data.addAsHead(oInput.sKey, oExpected.oAppState);
        window.opener = oFakeOpener;

        oService._loadAppState(oInput.sKey)
            .done(function (sKey, oAppState) {
                assert.strictEqual(sKey, oExpected.sKey, "Correct key used");
                assert.deepEqual(oAppState, oExpected.oAppState, "AppState loaded from opener");
                window.opener = oOriginalOpener;
                done();
            });
    });

    QUnit.test("AppState getAppState fails when no window cache is available and opener is FLP"
        + " but cannot be loaded from there because WindowAdapter is not reachable and AppState is transient (no BackendAdapter)", function (assert) {
            var oFakeAdapter,
                oService,
                oLogSpy = sandbox.spy(Log, "warning"),
                oInput = { sKey: "FooAppState" },
                oExpected = { sMessage: "Key not found" },
                oOriginalOpener = window.opener,
                oFakeOpener = {
                    sap: {
                        ui: {
                            require: function () {
                                return;
                            }
                        },
                        ushell: "NeedsToBePresentToMakeTheAdapterThinkTheOpenerIsAFLP"
                    }
                };
            var done = assert.async();

            oFakeAdapter = new AppStateMockAdapter();
            oService = new AppState(oFakeAdapter);
            // clear window cache initially
            WindowAdapter.prototype.data._clear();

            window.opener = oFakeOpener;

            oService._loadAppState(oInput.sKey)
                .fail(function (sMessage) {
                    assert.strictEqual(sMessage, oExpected.sMessage, "Correct message returned");
                    assert.ok(oLogSpy.called, "Warning has been logged correctly");
                    window.opener = oOriginalOpener;
                    oLogSpy.restore();
                    done();
                });
        });

    QUnit.test("AppState getAppState read from Backend when no window cache is available and opener is FLP"
        + " but cannot be loaded from there because WindowAdapter is not reachable and AppState is not transient", function (assert) {
            var oFakeAdapter,
                oService,
                oInput = { sKey: "FooAppState" },
                oExpected = {
                    sKey: "FooAppState",
                    oAppState: { foo: "AppState" }
                },
                oOriginalOpener = window.opener,
                oBackendStub;
            var done = assert.async();

            oFakeAdapter = new AppStateMockAdapter();
            oService = new AppState(oFakeAdapter);
            // clear window cache initially
            WindowAdapter.prototype.data._clear();
            if (!oService._oAdapter._oBackendAdapter.loadAppState) {
                oService._oAdapter._oBackendAdapter.loadAppState = function () { };
            }

            window.opener = undefined;
            oBackendStub = sandbox.stub(oService._oAdapter._oBackendAdapter, "loadAppState").callsFake(function (sKey) {
                if (sKey === oExpected.sKey) {
                    return new jQuery.Deferred().resolve(oExpected.sKey, oExpected.oAppState);
                }
                return new jQuery.Deferred().reject();
            });

            oService._loadAppState(oInput.sKey)
                .done(function (sKey, oAppState) {
                    assert.strictEqual(sKey, oExpected.sKey, "Correct key used");
                    assert.strictEqual(oAppState, oExpected.oAppState, "Correct AppState returned");
                    assert.ok(oBackendStub.calledOnce, "Backend Adapter called");
                    window.opener = oOriginalOpener;
                    oBackendStub.restore();
                    done();
                });
        });

    QUnit.test("constructor createEmptyAppState persistent set data, delete", function (assert) {
        var oService,
            oFakeAdapter,
            oAppState,
            data;
        var done = assert.async();

        oFakeAdapter = new AppStateMockAdapter();
        oService = new AppState(oFakeAdapter, {}, {}, createServiceConfig(false));

        sandbox.stub(oService, "_getGeneratedKey").returns("AKEY");
        oAppState = oService.createEmptyAppState(undefined, false);
        data = { a: 1, b: NaN };
        oAppState.setData(data);
        oAppState.save().done(function () {
            oService.deleteAppState("AKEY")
                .done(function () {
                    assert.ok(true, "delete ok");
                    done();
                })
                .fail(function () {
                    assert.ok(false, "delete error");
                    done();
                });
        });
    });

    QUnit.test("constructor createEmptyAppState persistent set data, delete with fail", function (assert) {
        var oService,
            oFakeAdapter,
            oAppState,
            data;
        var done = assert.async();

        oFakeAdapter = new AppStateMockAdapter();
        oService = new AppState(oFakeAdapter);

        sandbox.stub(oService, "_getGeneratedKey").returns("AKEY");
        oAppState = oService.createEmptyAppState(undefined, false);
        data = { a: 1, b: NaN };
        oAppState.setData(data);
        oAppState.save().done(function () {
            oService.deleteAppState("DUMMY")
                .done(function () {
                    assert.ok(false, "delete ok");
                    done();
                })
                .fail(function () {
                    assert.ok(true, "delete error");
                    done();
                });
        });
    });

    QUnit.test("constructor createEmptyAppState transient set data, delete", function (assert) {
        var oService,
            oFakeAdapter,
            oAppState,
            data;
        var done = assert.async();

        oFakeAdapter = new AppStateMockAdapter();
        oService = new AppState(oFakeAdapter);

        sandbox.stub(oService, "_getGeneratedKey").returns("AKEY");
        oAppState = oService.createEmptyAppState();
        data = { a: 1, b: NaN };
        oAppState.setData(data);
        oAppState.save().done(function () {
            oService.deleteAppState("AKEY")
                .done(function () {
                    assert.ok(false, "delete ok");
                    done();
                })
                .fail(function () {
                    assert.ok(true, "delete error");
                    done();
                });
        });
    });

    QUnit.test("getSupportedPersistencyMethods", function (assert) {
        var oService,
            aMethods,
            oFakeAdapter;

        oService = new AppState();
        aMethods = oService.getSupportedPersistencyMethods();
        assert.ok(true, "should pass");
        assert.deepEqual(aMethods, [], "no persistancy methods");

        AppStateMockAdapter.prototype.getSupportedPersistencyMethods = function () {
            return [AppStatePersistencyMethod.PersonalState,
            AppStatePersistencyMethod.ACLProtectedState];
        };

        oFakeAdapter = new AppStateMockAdapter();
        oService = new AppState(oFakeAdapter);
        aMethods = oService.getSupportedPersistencyMethods();
        assert.ok(true, "should pass");
        assert.deepEqual(aMethods, [AppStatePersistencyMethod.PersonalState,
        AppStatePersistencyMethod.ACLProtectedState],
            "two persistancy methods");
    });

    QUnit.test("isPersistencyMethodSupported", function (assert) {
        var oService,
            bVal,
            oFakeAdapter;

        oService = new AppState();
        bVal = oService.isPersistencyMethodSupported();
        assert.ok(bVal === false, "undefined not supported");

        AppStateMockAdapter.prototype.getSupportedPersistencyMethods = function () {
            return [AppStatePersistencyMethod.PersonalState,
            AppStatePersistencyMethod.ACLProtectedState];
        };
        oFakeAdapter = new AppStateMockAdapter();
        oService = new AppState(oFakeAdapter);

        bVal = oService.isPersistencyMethodSupported(AppStatePersistencyMethod.PersonalState);
        assert.ok(bVal === true, "PersonalState supported");

        bVal = oService.isPersistencyMethodSupported(AppStatePersistencyMethod.AuthorizationProtectedState);
        assert.ok(bVal === false, "AuthorizationProtectedState not supported");
    });

    QUnit.test("makeStatePersistent - persistency method not supported", function (assert) {
        var oService,
            oFakeAdapter;
        var done = assert.async();

        AppStateMockAdapter.prototype.getSupportedPersistencyMethods = function () {
            return [];
        };
        oFakeAdapter = new AppStateMockAdapter();
        oService = new AppState(oFakeAdapter);
        oService.makeStatePersistent(undefined, AppStatePersistencyMethod.PersonalState)
            .done(function () {
                assert.ok(true, "should pass");
                done();
            })
            .fail(function () {
                assert.ok(false, "should not fail");
                done();
            });
    });

    QUnit.test("makeStatePersistent - persistency method not supported with adapter", function (assert) {
        var oService,
            oFakeAdapter;
        var done = assert.async();

        AppStateMockAdapter.prototype.getSupportedPersistencyMethods = function () {
            return [AppStatePersistencyMethod.PersonalState,
            AppStatePersistencyMethod.ACLProtectedState];
        };
        oFakeAdapter = new AppStateMockAdapter();
        oService = new AppState(oFakeAdapter);
        oService.makeStatePersistent(undefined, AppStatePersistencyMethod.AuthorizationProtectedState)
            .done(function () {
                assert.ok(false, "should fail");
                done();
            })
            .fail(function () {
                assert.ok(true, "should fail");
                done();
            });
    });

    QUnit.test("makeStatePersistent - persistency method supported with adapter", function (assert) {
        var oService,
            oFakeAdapter,
            oAppState,
            data;
        var done = assert.async();

        AppStateMockAdapter.prototype.getSupportedPersistencyMethods = function () {
            return [AppStatePersistencyMethod.PersonalState,
            AppStatePersistencyMethod.ACLProtectedState];
        };

        oFakeAdapter = new AppStateMockAdapter();
        oService = new AppState(oFakeAdapter);

        sandbox.stub(oService, "_getGeneratedKey").returns("AKEY");
        oAppState = oService.createEmptyAppState();
        data = { a: 1 };
        oAppState.setData(data);

        oService.makeStatePersistent("AKEY", AppStatePersistencyMethod.PersonalState)
            .done(function () {
                assert.ok(true, "should succeed");
                done();
            })
            .fail(function () {
                assert.ok(false, "should succeed");
                done();
            });
    });

    QUnit.module("createEmptyAppState", {
        beforeEach: function (assert) {
            var done = assert.async();

            Container.init("local").then(function () {
                sandbox.stub(utils, "generateRandomKey").returns("KEYA");

                this.oService = new AppState(new AppStateMockAdapter(), {}, {}, createServiceConfig(false));
                this.oComponent = new UIComponent();

                done();
            }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Not transient AppState", function (assert) {
        // Arrange
        var sExpectedKey = "ASKEYA";

        // Act
        var oResultAppState = this.oService.createEmptyAppState(this.oComponent, false);

        // Assert
        assert.strictEqual(oResultAppState.getKey("sKey"), sExpectedKey, "The expected result is returned");
    });

    QUnit.test("Transient AppState", function (assert) {
        // Arrange
        var sExpectedKey = "TASKEYA";

        // Act
        var oResultAppState = this.oService.createEmptyAppState(this.oComponent, true);

        // Assert
        assert.strictEqual(oResultAppState.getKey("sKey"), sExpectedKey, "The expected result is returned");
    });
});
