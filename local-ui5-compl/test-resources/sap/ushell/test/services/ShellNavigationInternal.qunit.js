// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.ShellNavigationInternal
 */
sap.ui.define([
    "sap/ui/core/routing/HashChanger",
    "sap/ui/core/UIComponent",
    "sap/ui/thirdparty/hasher",
    "sap/ushell/Container",
    "sap/ushell/services/ShellNavigationInternal",
    "sap/ushell/services/ShellNavigationHashChanger"
], function (
    HashChanger,
    UIComponent,
    hasher,
    Container,
    ShellNavigationInternal,
    ShellNavigationHashChanger
) {
    "use strict";

    /* global QUnit, sinon*/

    var sandbox = sinon.createSandbox({});

    var O_NAVIGATION_FILTER_STATUS = {
        Continue: "Continue",
        Custom: "Custom",
        Abandon: "Abandon",
        Keep: "Keep"
    };

    QUnit.module("sap.ushell.services.ShellNavigationInternal", {
        beforeEach: function (assert) {
            var fnDone = assert.async();

            Container.init("local")
                .then(function () {
                    Promise.all([
                        Container.getServiceAsync("ShellNavigationInternal"),
                        Container.getServiceAsync("AppState")
                    ])
                        .then(function (aServices) {
                            this.ShellNavigationInternal = aServices[0];
                            this.AppState = aServices[1];

                            if (typeof this.ShellNavigationInternal._lastHashChangeMode !== "undefined") {
                                throw new Error("Sanity: the _lastHashChangeMode is expected to be undefined at the beginning of a test");
                            }
                            fnDone();
                        }.bind(this));
                }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
            this.ShellNavigationInternal.hashChanger.destroy();

            // reset the hash via hasher API after each test
            if (hasher) {
                hasher.setHash("");
            }
            Container.resetServices();
        }
    });

    // Shell navigation services
    // registration of hasher events for onhashchange
    // forwarding to callbacks of application
    QUnit.test("getServiceAsync", function (assert) {
        // modules cannot be unloaded; so this test should be the first in order
        assert.ok(typeof this.ShellNavigationInternal === "object");
    });

    QUnit.test("getNavigationContext", function (assert) {
        // Arrange
        var oGetCurrentNavigationStateStub = sandbox.stub(this.ShellNavigationInternal.hashChanger, "getCurrentNavigationState");
        oGetCurrentNavigationStateStub.returns({ status: "test" });
        var oIsInnerAppNavigationStub = sandbox.stub(this.ShellNavigationInternal.hashChanger, "isInnerAppNavigation");
        oIsInnerAppNavigationStub.returns(true);

        //Act
        var oNavigationContext = this.ShellNavigationInternal.getNavigationContext();

        //assert
        assert.strictEqual(oGetCurrentNavigationStateStub.callCount, 1, "getCurrentNavigationState was only called once.");
        assert.strictEqual(oIsInnerAppNavigationStub.callCount, 1, "isInnerAppNavigation was only called once.");
        assert.strictEqual(oNavigationContext.innerAppRoute, "");
        assert.strictEqual(oNavigationContext.isCrossAppNavigation, false);
        assert.strictEqual(oNavigationContext.status, "test");
    });

    // currently we double encode url parameters
    QUnit.test("compactParameter with promise (async)", function (assert) {
        // Arrange
        var sx = ("this&that is Space");
        var oComponent = new UIComponent();
        // check that the personalization service was invoked correctly
        var oCreateEmptyAppStateSpy = sandbox.spy(this.AppState, "createEmptyAppState");

        // Act
        return this.ShellNavigationInternal.compactParams({
            OnceMoreIntoTheBreachOrFillTheWallsUpWithOurEnglishDead: [1, 2, 3, 4, 5, 6],
            VeryLongNamesAreAlsoProblematicEspIfMultipliedOften: [
                "That getting too long to be handled 1",
                "THIS is getting too long to be handled 2",
                "THIS is getting too long to be handled 3",
                "THIS is getting too long to be handled 4",
                "THIS is getting too long to be handled 5",
                "THIS is getting too long to be handled 6",
                "THIS is getting too long to be handled 7"
            ],
            B: [
                "THIS is getting too long to be handled 1",
                "THIS is getting too long to be handled 2",
                "THIS is getting too long to be handled 3",
                "THIS is getting too long to be handled 4",
                "THIS is getting too long to be handled 5",
                "THIS is getting too long to be handled 6",
                "THIS is getting too long to be handled 7"
            ],
            A: [sx, 1]
        }, undefined, oComponent).done(function (oResultParams) {
            // Assert
            // extract a Shell Parameter
            var sKey = oResultParams["sap-intent-param"][0];
            assert.deepEqual(oResultParams, {
                A: [
                    "this&that is Space",
                    "1"
                ],
                B: [
                    "THIS is getting too long to be handled 1",
                    "THIS is getting too long to be handled 2",
                    "THIS is getting too long to be handled 3",
                    "THIS is getting too long to be handled 4",
                    "THIS is getting too long to be handled 5",
                    "THIS is getting too long to be handled 6",
                    "THIS is getting too long to be handled 7"
                ],
                OnceMoreIntoTheBreachOrFillTheWallsUpWithOurEnglishDead: [
                    "1",
                    "2",
                    "3"
                ],
                "sap-intent-param": [sKey]
            });
            assert.strictEqual(oCreateEmptyAppStateSpy.callCount, 1, "createEmptyAppState invoked");
            assert.equal(oCreateEmptyAppStateSpy.args[0][0], oComponent, "component passed");
        });
    });

    QUnit.test("compactParameter with transient app state creation !(async)", function (assert) {
        // Arrange
        var sx = ("this&that is Space");
        var oComponent = new UIComponent();
        // check that the personalization service was invoked correctly
        var oCreateEmptyAppStateSpy = sandbox.spy(this.AppState, "createEmptyAppState");

        // Act
        return this.ShellNavigationInternal.compactParams({
            OnceMoreIntoTheBreachOrFillTheWallsUpWithOurEnglishDead: [1, 2, 3, 4, 5, 6],
            VeryLongNamesAreAlsoProblematicEspIfMultipliedOften: [
                "That getting too long to be handled 1",
                "THIS is getting too long to be handled 2",
                "THIS is getting too long to be handled 3",
                "THIS is getting too long to be handled 4",
                "THIS is getting too long to be handled 5",
                "THIS is getting too long to be handled 6",
                "THIS is getting too long to be handled 7"
            ],
            B: [
                "THIS is getting too long to be handled 1",
                "THIS is getting too long to be handled 2",
                "THIS is getting too long to be handled 3",
                "THIS is getting too long to be handled 4",
                "THIS is getting too long to be handled 5",
                "THIS is getting too long to be handled 6",
                "THIS is getting too long to be handled 7"
            ],
            A: [sx, 1]
        }, undefined, oComponent, true /*transient*/).done(function (oResultParams) {
            // Assert
            assert.deepEqual(oCreateEmptyAppStateSpy.args[0][1], true, " transient(!) appstate created");
            // extract a Shell Parameter
            var sKey = oResultParams["sap-intent-param"][0];
            assert.deepEqual(oResultParams, {
                A: [
                    "this&that is Space",
                    "1"
                ],
                B: [
                    "THIS is getting too long to be handled 1",
                    "THIS is getting too long to be handled 2",
                    "THIS is getting too long to be handled 3",
                    "THIS is getting too long to be handled 4",
                    "THIS is getting too long to be handled 5",
                    "THIS is getting too long to be handled 6",
                    "THIS is getting too long to be handled 7"
                ],
                OnceMoreIntoTheBreachOrFillTheWallsUpWithOurEnglishDead: [
                    "1",
                    "2",
                    "3"
                ],
                "sap-intent-param": [sKey]
            });
            assert.strictEqual(oCreateEmptyAppStateSpy.callCount, 1, "createEmptyAppState invoked");
            assert.equal(oCreateEmptyAppStateSpy.args[0][0], oComponent, "component passed");
        });
    });

    QUnit.test("compactParameter with short params", function (assert) {
        // Arrange
        var sx = ("this&that is Space");
        // check that the personalization service was invoked correctly
        var oCreateEmptyAppStateSpy = sandbox.spy(this.AppState, "createEmptyAppState");

        // Act
        return this.ShellNavigationInternal.compactParams({
            OnceMoreIntoTheBreachOrFillTheWallsUpWithOurEnglishDead: [1, 2, 3, 4, 5, 6],
            VeryLongNamesAreAlsoProblematicEspIfMultipliedOften: ["That getting too long to be handled 1"],
            A: [sx, 1]
        }, undefined, undefined).done(function (oResultParams) {
            // Assert
            // extract a Shell Parameter
            assert.deepEqual(oResultParams, {
                OnceMoreIntoTheBreachOrFillTheWallsUpWithOurEnglishDead: ["1", "2", "3", "4", "5", "6"],
                VeryLongNamesAreAlsoProblematicEspIfMultipliedOften: ["That getting too long to be handled 1"],
                A: [sx, "1"]
            });
            assert.equal(oCreateEmptyAppStateSpy.calledOnce, false, "createEmptyAppState invoked");
        });
    });

    QUnit.test("compactParameter with trivial params undefined", function (assert) {
        // Arrange
        // check that the personalization service was invoked correctly
        sandbox.spy(this.AppState, "createEmptyAppState");

        // Act
        return this.ShellNavigationInternal.compactParams(undefined, undefined, undefined).done(function (oResultParams) {
            // Assert
            // extract a Shell Parameter
            assert.deepEqual(oResultParams, undefined, "params ok");
        });
    });

    QUnit.test("compactParameter with trivial params empty object", function (assert) {
        // Arrange
        // check that the personalization service was invoked correctly
        sandbox.spy(this.AppState, "createEmptyAppState");

        // Act
        return this.ShellNavigationInternal.compactParams({}, undefined, undefined).done(function (oResultParams) {
            // Assert
            // extract a Shell Parameter
            assert.deepEqual(oResultParams, {}, "params ok");
        });
    });

    QUnit.test("compactParameter with trivial params short enough", function (assert) {
        // Arrange
        // check that the personalization service was invoked correctly
        sandbox.spy(this.AppState, "createEmptyAppState");

        // Act
        return this.ShellNavigationInternal.compactParams({ A: ["1"] }, undefined, undefined).done(function (oResultParams) {
            // Assert
            // extract a Shell Parameter
            assert.deepEqual(oResultParams, { A: ["1"] }, "params ok");
        });
    });

    QUnit.test("isInitialNavigation returns undefined when service init method is not called", function (assert) {
        assert.strictEqual(this.ShellNavigationInternal.isInitialNavigation(), undefined, "returns expected result");
    });

    QUnit.test("isInitialNavigation returns true when service init method is called", function (assert) {
        this.ShellNavigationInternal.init(sandbox.stub());
        assert.strictEqual(this.ShellNavigationInternal.isInitialNavigation(), true, "returns expected result");
    });

    QUnit.test("isInitialNavigation returns the value the the property _bIsInitialNavigation of the service", function (assert) {
        this.ShellNavigationInternal.init(sandbox.stub())._bIsInitialNavigation = "foo";
        assert.strictEqual(this.ShellNavigationInternal.isInitialNavigation(), "foo", "returns expected result");
    });

    QUnit.test("setIsInitialNavigation set the value the the property _bIsInitialNavigation of the service", function (assert) {
        this.ShellNavigationInternal.init(sandbox.stub());
        this.ShellNavigationInternal.setIsInitialNavigation("foo");
        assert.strictEqual(this.ShellNavigationInternal.isInitialNavigation(), "foo", "aa", "returns expected result");
    });

    QUnit.test("init", function (assert) {
        // Arrange
        var fnCallback = sandbox.stub();
        var oInitShellNavigationStub = sandbox.stub(this.ShellNavigationInternal.hashChanger, "initShellNavigation");
        var oEnableHistoryEntryReplacedDetectionStub = sandbox.stub(this.ShellNavigationInternal, "_enableHistoryEntryReplacedDetection");

        // Act
        // we use a stub for the initShellNavigation navigation method to avoid registration of event handler on the hasher;
        // it's difficult to destroy the central hash changer instance and it causes side effects if not destroyed
        this.ShellNavigationInternal.init(fnCallback);

        // Assert
        this.ShellNavigationInternal.hashChanger = HashChanger.getInstance();
        assert.ok(this.ShellNavigationInternal.hashChanger instanceof ShellNavigationHashChanger, "hashChanger instanceof ShellNavigationHashChanger");
        assert.ok(oInitShellNavigationStub.getCall(0).args[0], fnCallback, "call with correct callback");
        assert.strictEqual(oEnableHistoryEntryReplacedDetectionStub.callCount, 1);
    });

    QUnit.test("_enableHistoryEntryReplacedDetection: sets correct internal state when no hasher methods are called", function (assert) {
        // Arrange
        var oSetHashStub = sandbox.stub(hasher, "setHash");
        var oReplaceHashStub = sandbox.stub(hasher, "replaceHash");

        // Act
        this.ShellNavigationInternal._enableHistoryEntryReplacedDetection();

        // Assert
        assert.strictEqual(this.ShellNavigationInternal._lastHashChangeMode, null);
        assert.strictEqual(this.ShellNavigationInternal._fnOriginalSetHash, oSetHashStub);
        assert.strictEqual(this.ShellNavigationInternal._fnOriginalReplaceHash, oReplaceHashStub);
    });

    QUnit.test("_enableHistoryEntryReplacedDetection: correct internal state when setHash is called", function (assert) {
        // Arrange
        sandbox.stub(hasher, "setHash");
        sandbox.stub(hasher, "replaceHash");

        // Act
        this.ShellNavigationInternal._enableHistoryEntryReplacedDetection();
        hasher.setHash("#Some-hash");

        // Assert
        assert.strictEqual(this.ShellNavigationInternal._lastHashChangeMode, "setHash");
        assert.strictEqual(this.ShellNavigationInternal._fnOriginalSetHash.callCount, 1, "original method called once");
    });

    QUnit.test("_enableHistoryEntryReplacedDetection: correct internal state when hasher replaceHash is called", function (assert) {
        // Arrange
        sandbox.stub(hasher, "setHash");
        sandbox.stub(hasher, "replaceHash");

        // Act
        this.ShellNavigationInternal._enableHistoryEntryReplacedDetection();
        hasher.replaceHash("#Some-hash");

        // Assert
        assert.strictEqual(this.ShellNavigationInternal._lastHashChangeMode, "replaceHash");
        assert.strictEqual(this.ShellNavigationInternal._fnOriginalReplaceHash.callCount, 1, "original method called once");
    });

    QUnit.test("wasHistoryEntryReplaced: correct result when shell navigation is initialized", function (assert) {
        // Arrange

        // Act
        var bHistoryEntryReplaced = this.ShellNavigationInternal.wasHistoryEntryReplaced();

        // Assert
        assert.strictEqual(bHistoryEntryReplaced, false);
    });

    QUnit.test("wasHistoryEntryReplaced: correct result when replaceHash is called", function (assert) {
        // Arrange
        sandbox.stub(hasher, "setHash");
        sandbox.stub(hasher, "replaceHash");
        this.ShellNavigationInternal._enableHistoryEntryReplacedDetection();

        // Act
        hasher.replaceHash("#Some-targetApp");
        var bHistoryEntryReplaced = this.ShellNavigationInternal.wasHistoryEntryReplaced();

        // Assert
        assert.strictEqual(bHistoryEntryReplaced, true);
    });

    QUnit.test("wasHistoryEntryReplaced: correct result when setHash is the last operation made", function (assert) {
        // Arrange
        sandbox.stub(hasher, "setHash");
        sandbox.stub(hasher, "replaceHash");
        this.ShellNavigationInternal._enableHistoryEntryReplacedDetection();

        // Act
        hasher.replaceHash("#Some-targetApp1");
        hasher.setHash("#Some-targetApp2");
        hasher.replaceHash("#Some-targetApp3");
        hasher.setHash("#Some-targetApp4");
        var bHistoryEntryReplaced = this.ShellNavigationInternal.wasHistoryEntryReplaced();

        // Assert
        assert.strictEqual(bHistoryEntryReplaced, false);
    });

    QUnit.test("wasHistoryEntryReplaced: correct result when replaceHash is the last operation made", function (assert) {
        // Arrange
        sandbox.stub(hasher, "setHash");
        sandbox.stub(hasher, "replaceHash");
        this.ShellNavigationInternal._enableHistoryEntryReplacedDetection();

        // Act
        hasher.replaceHash("#Some-targetApp1");
        hasher.setHash("#Some-targetApp2");
        hasher.replaceHash("#Some-targetApp3");
        var bHistoryEntryReplaced = this.ShellNavigationInternal.wasHistoryEntryReplaced();

        // Assert
        assert.strictEqual(bHistoryEntryReplaced, true);
    });

    QUnit.test("resetHistoryEntryReplaced: resets internal flag when called", function (assert) {
        // Arrange
        sandbox.stub(hasher, "setHash");
        sandbox.stub(hasher, "replaceHash");
        this.ShellNavigationInternal._enableHistoryEntryReplacedDetection();

        // Act
        hasher.replaceHash("#Some-targetApp1");
        this.ShellNavigationInternal.resetHistoryEntryReplaced();

        // Assert
        assert.strictEqual(this.ShellNavigationInternal._lastHashChangeMode, null);
    });

    QUnit.test("navigation filters - Abandon", function (assert) {
        // Arrange
        var oHashChangeCallbackStub = sandbox.stub();
        var fnFilter = sandbox.stub().returns(O_NAVIGATION_FILTER_STATUS.Abandon);
        this.ShellNavigationInternal.init(oHashChangeCallbackStub);

        assert.strictEqual(oHashChangeCallbackStub.callCount, 1, "Hash change callback called in init");

        this.ShellNavigationInternal.registerNavigationFilter(fnFilter);

        // Act
        return this.ShellNavigationInternal.toExternal({
            target: {
                semanticObject: "SO",
                action: "AC"
            }
        }).then(function () {
            // Assert
            assert.strictEqual(oHashChangeCallbackStub.callCount, 1, "Hash change callback called when filter Abandon the navigation");
            assert.strictEqual(hasher.getHash(), "", "Hash changed when filter Abandon the navigation");
        });
    });

    QUnit.test("navigation filters - Keep", function (assert) {
        var oHashChangeCallbackStub = sandbox.stub();
        var fnFilter = sandbox.stub().returns(O_NAVIGATION_FILTER_STATUS.Keep);
        this.ShellNavigationInternal.init(oHashChangeCallbackStub);

        assert.strictEqual(oHashChangeCallbackStub.callCount, 1, "Hash change callback called in init");

        this.ShellNavigationInternal.registerNavigationFilter(fnFilter);

        // Act
        return this.ShellNavigationInternal.toExternal({
            target: {
                semanticObject: "SO",
                action: "AC"
            }
        }).then(function () {
            // Assert
            assert.strictEqual(oHashChangeCallbackStub.callCount, 1, "Hash change callback called when filter Keep the navigation");
            assert.strictEqual(hasher.getHash(), "SO-AC", "Hash changed when filter Keep the navigation");
        });
    });

    [{
        testDescription: "Custom as a plain value",
        testNavigateToHash: "Object-actionCustomPlain",
        vFilterReturnValue: O_NAVIGATION_FILTER_STATUS.Custom,
        expectedHash: "Object-actionCustomPlain",
        expectedHashChanges: 0
    }, {
        testDescription: "Custom as an object",
        testNavigateToHash: "Object-actionCustomObj",
        vFilterReturnValue: { status: O_NAVIGATION_FILTER_STATUS.Custom },
        expectedHash: "Object-actionCustomObj",
        expectedHashChanges: 0
    }, {
        testDescription: "Continue as a plain value",
        testNavigateToHash: "Object-actionContinuePlain",
        vFilterReturnValue: O_NAVIGATION_FILTER_STATUS.Continue,
        expectedHash: "Object-actionContinuePlain",
        expectedHashChanges: 1
    }, {
        testDescription: "Unknown status",
        testNavigateToHash: "Object-actionContinueUnknown",
        vFilterReturnValue: "Unknown",
        expectedHash: "Object-actionContinueUnknown",
        expectedHashChanges: 1
    }, {
        testDescription: "Abandon",
        testNavigateToHash: "Object-actionContinueUnknown",
        vFilterReturnValue: O_NAVIGATION_FILTER_STATUS.Abandon,
        expectedHash: "",
        expectedHashChanges: 0
    }, {
        testDescription: "Custom with hash change",
        testNavigateToHash: "Object-actionContinueUnknown?p1=v1",
        vFilterReturnValue: { status: O_NAVIGATION_FILTER_STATUS.Custom, hash: "Intercepted-hash" },
        expectedHash: "Intercepted-hash",
        expectedHashChanges: 0
    }, {
        testDescription: "Filter function throws",
        testNavigateToHash: "Object-filterThrows",
        fnFilter: function () { throw new Error("Error in filter"); },
        expectedHash: "Object-filterThrows",
        expectedHashChanges: 1
    }].forEach(function (oFixture) {
        QUnit.test("navigation filters when " + oFixture.testDescription, function (assert) {
            // Arrange
            var fnFilter;
            var oHashChangeCallbackStub = sandbox.stub();

            if (oFixture.fnFilter) {
                fnFilter = oFixture.fnFilter;
            } else {
                fnFilter = function (/*sNewHash, sOldHash*/) {
                    return oFixture.vFilterReturnValue;
                };
            }
            this.ShellNavigationInternal.init(oHashChangeCallbackStub);

            // Hash changes during init
            assert.strictEqual(oHashChangeCallbackStub.callCount, 1, "Hash change callback called in init");

            this.ShellNavigationInternal.registerNavigationFilter(fnFilter);

            // Act
            return this.ShellNavigationInternal.toExternal({ target: { shellHash: oFixture.testNavigateToHash } }).then(function () {
                // Assert
                // Check how many times hash *changed* after init
                assert.strictEqual(oHashChangeCallbackStub.callCount - 1, oFixture.expectedHashChanges, "Hash change callback was called");
                assert.strictEqual(hasher.getHash(), oFixture.expectedHash, "Hash is as expected");
            });
        });
    });

    QUnit.test("navigation filter can be deregisteded", function (assert) {
        // Arrange
        var oHashChangeCallbackStub = sandbox.stub();
        var fnFilter = sandbox.stub().returns(O_NAVIGATION_FILTER_STATUS.Abandon);
        this.ShellNavigationInternal.init(oHashChangeCallbackStub);

        // Hash changes during init
        assert.strictEqual(oHashChangeCallbackStub.callCount, 1, "Hash change callback called in init");

        // Act & Assert
        // This has effect (no abandon filter registered)
        return this.ShellNavigationInternal.toExternal({ target: { shellHash: "#Action-tonav1" } })
            .then(function () {
                assert.strictEqual(oHashChangeCallbackStub.callCount - 1, 1, "Hash change callback was made");

                // Now we register a navigation filter
                this.ShellNavigationInternal.registerNavigationFilter(fnFilter);

                // This has no effect: abandon filter is registered
                return this.ShellNavigationInternal.toExternal({ target: { shellHash: "#Action-tonav2" } });
            }.bind(this))
            .then(function () {
                assert.strictEqual(oHashChangeCallbackStub.callCount - 1, 1, "No additional navigation was made");

                // Filter is unregistered, now navigation can take place
                this.ShellNavigationInternal.unregisterNavigationFilter(fnFilter);

                return this.ShellNavigationInternal.toExternal({ target: { shellHash: "#Action-tonav3" } });
            }.bind(this))
            .then(function () {
                assert.strictEqual(oHashChangeCallbackStub.callCount - 1, 2, "Hash change callback was called again");
            });
    });

    QUnit.test("replaceHashWithoutNavigation: rewite the hash without navigation", function (assert) {
        // Arrange
        sandbox.stub(hasher, "setHash");
        sandbox.stub(hasher, "replaceHash");
        var oFnOriginalSetHashStub = sandbox.stub();
        this.ShellNavigationInternal._fnOriginalSetHash = oFnOriginalSetHashStub;

        // Act
        this.ShellNavigationInternal.replaceHashWithoutNavigation("#New-hash");
        hasher.replaceHash("#Some-hash");

        // Assert
        assert.strictEqual(oFnOriginalSetHashStub.callCount, 1, "original method called once");
        assert.deepEqual(oFnOriginalSetHashStub.getCall(0).args, ["#New-hash"], "the correct hash is set");
        assert.strictEqual(hasher.changed.active, true, "the hasher is acrive after setHash");
    });

    QUnit.module("registerPrivateFilters", {
        beforeEach: function () {
            this.ShellNavigationInternal = new ShellNavigationInternal();

            this.oRegisterNavigationFilterStub = sandbox.stub(this.ShellNavigationInternal, "registerNavigationFilter");
        },
        afterEach: function () {
            Container.resetServices();
            sandbox.restore();
        }
    });

    QUnit.test("Registers _navigationFilterForForwardingToRegisteredRouters with correct scope", function (assert) {
        assert.expect(4);
        // Arrange
        var oAppLifeCycleMock = {};
        var oShellNavigationInternal = this.ShellNavigationInternal;
        oShellNavigationInternal._navigationFilterForForwardingToRegisteredRouters = function (AppLifeCycle, sHash) {
            assert.strictEqual(this, oShellNavigationInternal, "bound the scope to the ShellNavigationInternal service");
            assert.strictEqual(AppLifeCycle, oAppLifeCycleMock, "bound the AppLifeCycle service to the arguments");
            assert.strictEqual(sHash, "#Action-toTest", "The hash gets forwarded");
        };

        // Act
        this.ShellNavigationInternal.registerPrivateFilters(oAppLifeCycleMock);

        // Assert
        assert.strictEqual(this.oRegisterNavigationFilterStub.callCount, 1, "Registered one filter");
        this.oRegisterNavigationFilterStub.getCall(0).callArgWith(0, "#Action-toTest");
    });

    QUnit.module("hrefForExternal (async)", {
        beforeEach: function (assert) {
            var fnDone = assert.async();

            Container.init("local")
            .then(function () {
                Promise.all([
                    Container.getServiceAsync("ShellNavigationInternal"),
                    Container.getServiceAsync("AppState")
                ])
                .then(function (aServices) {
                    this.ShellNavigationInternal = aServices[0];
                    this.AppState = aServices[1];

                    if (typeof this.ShellNavigationInternal._lastHashChangeMode !== "undefined") {
                        throw new Error("Sanity: the _lastHashChangeMode is expected to be undefined at the beginning of a test");
                    }
                    fnDone();
                }.bind(this));
            }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
            this.ShellNavigationInternal.hashChanger.destroy();

            // reset the hash via hasher API after each test
            if (hasher) {
                hasher.setHash("");
            }

            Container.resetServices();
        }
    });

    QUnit.test("WithSoActionTargetAndParams", function (assert) {
        return this.ShellNavigationInternal.hrefForExternal({
            target: {
                semanticObject: "SO",
                action: "ABC"
            },
            params: { A: "A1" }
        }).then(function (sShellHash) {
            assert.strictEqual(sShellHash, "#SO-ABC?A=A1");
        });
    });

    QUnit.test("Is idempotent", function (assert) {
        var sVeryLongShellHash = "#SO-act?iAmLong1=iAmLongVal1&iAmLong2=iAmLongVal2&iAmLong3=iAmLongVal3&iAmLong4=iAmLongVal4&iAmLong5=iAmLongVal5&" +
            "iAmLong6=iAmLongVal6&iAmLong7=iAmLongVal7&iAmLong8=iAmLongVal8&iAmLong9=iAmLongVal9&iAmLong10=iAmLongVal10&iAmLong11=iAmLongVal11&" +
            "iAmLong12=iAmLongVal12&iAmLong13=iAmLongVal13&iAmLong14=iAmLongVal14&iAmLong15=iAmLongVal15&iAmLong16=iAmLongVal16&" +
            "iAmLong17=iAmLongVal17&iAmLong18=iAmLongVal18&iAmLong19=iAmLongVal19&iAmLong20=iAmLongVal20&iAmLong21=iAmLongVal21&" +
            "iAmLong22=iAmLongVal22&iAmLong23=iAmLongVal23&iAmLong24=iAmLongVal24&iAmLong25=iAmLongVal25&iAmLong26=iAmLongVal26&" +
            "iAmLong27=iAmLongVal27&iAmLong28=iAmLongVal28&iAmLong29=iAmLongVal29&iAmLong30=iAmLongVal30&iAmLong31=iAmLongVal31&" +
            "iAmLong32=iAmLongVal32&iAmLong33=iAmLongVal33&iAmLong34=iAmLongVal34&iAmLong35=iAmLongVal35&iAmLong36=iAmLongVal36&" +
            "iAmLong37=iAmLongVal37&iAmLong38=iAmLongVal38&iAmLong39=iAmLongVal39&iAmLong40=iAmLongVal40&iAmLong41=iAmLongVal41&" +
            "iAmLong42=iAmLongVal42&iAmLong43=iAmLongVal43&iAmLong44=iAmLongVal44&iAmLong45=iAmLongVal45&iAmLong46=iAmLongVal46&" +
            "iAmLong47=iAmLongVal47&iAmLong48=iAmLongVal48&iAmLong49=iAmLongVal49&iAmLong50=iAmLongVal50&iAmLong51=iAmLongVal51&" +
            "iAmLong52=iAmLongVal52&iAmLong53=iAmLongVal53&iAmLong54=iAmLongVal54&iAmLong55=iAmLongVal55&iAmLong56=iAmLongVal56&" +
            "iAmLong57=iAmLongVal57&iAmLong58=iAmLongVal58&iAmLong59=iAmLongVal59&iAmLong60=iAmLongVal60&iAmLong61=iAmLongVal61&" +
            "iAmLong62=iAmLongVal62&iAmLong63=iAmLongVal63&iAmLong64=iAmLongVal64&iAmLong65=iAmLongVal65&iAmLong66=iAmLongVal66&" +
            "iAmLong67=iAmLongVal67&iAmLong68=iAmLongVal68&iAmLong69=iAmLongVal69&iAmLong70=iAmLongVal70&iAmLong71=iAmLongVal71&" +
            "iAmLong72=iAmLongVal72&iAmLong73=iAmLongVal73&iAmLong74=iAmLongVal74&iAmLong75=iAmLongVal75&iAmLong76=iAmLongVal76&" +
            "iAmLong77=iAmLongVal77&iAmLong78=iAmLongVal78&iAmLong79=iAmLongVal79&iAmLong80=iAmLongVal80&iAmLong81=iAmLongVal81&" +
            "iAmLong82=iAmLongVal82&iAmLong83=iAmLongVal83&iAmLong84=iAmLongVal84&iAmLong85=iAmLongVal85&iAmLong86=iAmLongVal86&" +
            "iAmLong87=iAmLongVal87&iAmLong88=iAmLongVal88&iAmLong89=iAmLongVal89&iAmLong90=iAmLongVal90&iAmLong91=iAmLongVal91&" +
            "iAmLong92=iAmLongVal92&iAmLong93=iAmLongVal93&iAmLong94=iAmLongVal94&iAmLong95=iAmLongVal95&iAmLong96=iAmLongVal96&" +
            "iAmLong97=iAmLongVal97&iAmLong98=iAmLongVal98&iAmLong99=iAmLongVal99&iAmLong100=iAmLongVal100&iAmLong101=iAmLongVal101&" +
            "iAmLong102=iAmLongVal102&iAmLong103=iAmLongVal103&iAmLong104=iAmLongVal104&iAmLong105=iAmLongVal105&iAmLong106=iAmLongVal106&" +
            "iAmLong107=iAmLongVal107&iAmLong108=iAmLongVal108&iAmLong109=iAmLongVal109&iAmLong110=iAmLongVal110&iAmLong111=iAmLongVal111&" +
            "iAmLong112=iAmLongVal112&iAmLong113=iAmLongVal113&iAmLong114=iAmLongVal114&iAmLong115=iAmLongVal115&iAmLong116=iAmLongVal116&" +
            "iAmLong117=iAmLongVal117&iAmLong118=iAmLongVal118&iAmLong119=iAmLongVal119&iAmLong120=iAmLongVal120&iAmLong121=iAmLongVal121&" +
            "iAmLong122=iAmLongVal122&iAmLong123=iAmLongVal123&iAmLong124=iAmLongVal124&iAmLong125=iAmLongVal125&iAmLong126=iAmLongVal126&" +
            "iAmLong127=iAmLongVal127&iAmLong128=iAmLongVal128&iAmLong129=iAmLongVal129&iAmLong130=iAmLongVal130&iAmLong131=iAmLongVal131&" +
            "iAmLong132=iAmLongVal132&iAmLong133=iAmLongVal133&iAmLong134=iAmLongVal134&iAmLong135=iAmLongVal135&iAmLong136=iAmLongVal136&" +
            "iAmLong137=iAmLongVal137&iAmLong138=iAmLongVal138&iAmLong139=iAmLongVal139&iAmLong140=iAmLongVal140&iAmLong141=iAmLongVal141&" +
            "iAmLong142=iAmLongVal142&iAmLong143=iAmLongVal143&iAmLong144=iAmLongVal144&iAmLong145=iAmLongVal145&iAmLong146=iAmLongVal146&" +
            "iAmLong147=iAmLongVal147&iAmLong148=iAmLongVal148&iAmLong149=iAmLongVal149&iAmLong150=iAmLongVal150&iAmLong151=iAmLongVal151&" +
            "iAmLong152=iAmLongVal152&iAmLong153=iAmLongVal153&iAmLong154=iAmLongVal154&iAmLong155=iAmLongVal155&iAmLong156=iAmLongVal156&" +
            "iAmLong157=iAmLongVal157&iAmLong158=iAmLongVal158&iAmLong159=iAmLongVal159&iAmLong160=iAmLongVal160&iAmLong161=iAmLongVal161&" +
            "iAmLong162=iAmLongVal162&iAmLong163=iAmLongVal163&iAmLong164=iAmLongVal164&iAmLong165=iAmLongVal165&iAmLong166=iAmLongVal166&" +
            "iAmLong167=iAmLongVal167&iAmLong168=iAmLongVal168&iAmLong169=iAmLongVal169&iAmLong170=iAmLongVal170&iAmLong171=iAmLongVal171&" +
            "iAmLong172=iAmLongVal172&iAmLong173=iAmLongVal173&iAmLong174=iAmLongVal174&iAmLong175=iAmLongVal175&iAmLong176=iAmLongVal176&" +
            "iAmLong177=iAmLongVal177&iAmLong178=iAmLongVal178&iAmLong179=iAmLongVal179&iAmLong180=iAmLongVal180&iAmLong181=iAmLongVal181&" +
            "iAmLong182=iAmLongVal182&iAmLong183=iAmLongVal183&iAmLong184=iAmLongVal184&iAmLong185=iAmLongVal185";
        return this.ShellNavigationInternal.hrefForExternal({
            target: { shellHash: sVeryLongShellHash }
        }).then((sCompactShellHash1) => {
            return Promise.all([
                // Call second time
                this.ShellNavigationInternal.hrefForExternal({
                    target: { shellHash: sCompactShellHash1 }
                }),
                // Provide first result
                Promise.resolve(sCompactShellHash1)
            ]);
        }).then((sCompactShellHashes) => {
            assert.strictEqual(sCompactShellHashes[0], sCompactShellHashes[1], "The same (compacted) shell hash is returned if hrefForExternal is called twice");
        });

    });

    QUnit.test("Does not expand very long URL if sap-intent-parm is found", function (assert) {
        var sVeryLongShellHash = "#SO-act?iAmLong1=iAmLongVal1&iAmLong2=iAmLongVal2&iAmLong3=iAmLongVal3&iAmLong4=iAmLongVal4&iAmLong5=iAmLongVal5&" +
            "iAmLong6=iAmLongVal6&iAmLong7=iAmLongVal7&iAmLong8=iAmLongVal8&iAmLong9=iAmLongVal9&iAmLong10=iAmLongVal10&iAmLong11=iAmLongVal11&" +
            "iAmLong12=iAmLongVal12&iAmLong13=iAmLongVal13&iAmLong14=iAmLongVal14&iAmLong15=iAmLongVal15&iAmLong16=iAmLongVal16&" +
            "iAmLong17=iAmLongVal17&iAmLong18=iAmLongVal18&iAmLong19=iAmLongVal19&iAmLong20=iAmLongVal20&iAmLong21=iAmLongVal21&" +
            "iAmLong22=iAmLongVal22&iAmLong23=iAmLongVal23&iAmLong24=iAmLongVal24&iAmLong25=iAmLongVal25&iAmLong26=iAmLongVal26&" +
            "iAmLong27=iAmLongVal27&iAmLong28=iAmLongVal28&iAmLong29=iAmLongVal29&iAmLong30=iAmLongVal30&iAmLong31=iAmLongVal31&" +
            "iAmLong32=iAmLongVal32&iAmLong33=iAmLongVal33&iAmLong34=iAmLongVal34&iAmLong35=iAmLongVal35&iAmLong36=iAmLongVal36&" +
            "iAmLong37=iAmLongVal37&iAmLong38=iAmLongVal38&iAmLong39=iAmLongVal39&iAmLong40=iAmLongVal40&iAmLong41=iAmLongVal41&" +
            "iAmLong42=iAmLongVal42&iAmLong43=iAmLongVal43&iAmLong44=iAmLongVal44&iAmLong45=iAmLongVal45&iAmLong46=iAmLongVal46&" +
            "iAmLong47=iAmLongVal47&iAmLong48=iAmLongVal48&iAmLong49=iAmLongVal49&iAmLong50=iAmLongVal50&iAmLong51=iAmLongVal51&" +
            "iAmLong52=iAmLongVal52&iAmLong53=iAmLongVal53&iAmLong54=iAmLongVal54&iAmLong55=iAmLongVal55&iAmLong56=iAmLongVal56&" +
            "iAmLong57=iAmLongVal57&iAmLong58=iAmLongVal58&iAmLong59=iAmLongVal59&iAmLong60=iAmLongVal60&iAmLong61=iAmLongVal61&" +
            "iAmLong62=iAmLongVal62&iAmLong63=iAmLongVal63&iAmLong64=iAmLongVal64&iAmLong65=iAmLongVal65&iAmLong66=iAmLongVal66&" +
            "iAmLong67=iAmLongVal67&iAmLong68=iAmLongVal68&iAmLong69=iAmLongVal69&iAmLong70=iAmLongVal70&iAmLong71=iAmLongVal71&" +
            "iAmLong72=iAmLongVal72&iAmLong73=iAmLongVal73&iAmLong74=iAmLongVal74&iAmLong75=iAmLongVal75&iAmLong76=iAmLongVal76&" +
            "iAmLong77=iAmLongVal77&iAmLong78=iAmLongVal78&iAmLong79=iAmLongVal79&iAmLong80=iAmLongVal80&iAmLong81=iAmLongVal81&" +
            "iAmLong82=iAmLongVal82&iAmLong83=iAmLongVal83&iAmLong84=iAmLongVal84&iAmLong85=iAmLongVal85&iAmLong86=iAmLongVal86&" +
            "iAmLong87=iAmLongVal87&iAmLong88=iAmLongVal88&iAmLong89=iAmLongVal89&iAmLong90=iAmLongVal90&iAmLong91=iAmLongVal91&" +
            "iAmLong92=iAmLongVal92&iAmLong93=iAmLongVal93&iAmLong94=iAmLongVal94&iAmLong95=iAmLongVal95&iAmLong96=iAmLongVal96&" +
            "iAmLong97=iAmLongVal97&iAmLong98=iAmLongVal98&iAmLong99=iAmLongVal99&iAmLong100=iAmLongVal100&iAmLong101=iAmLongVal101&" +
            "iAmLong102=iAmLongVal102&iAmLong103=iAmLongVal103&iAmLong104=iAmLongVal104&iAmLong105=iAmLongVal105&iAmLong106=iAmLongVal106&" +
            "iAmLong107=iAmLongVal107&iAmLong108=iAmLongVal108&iAmLong109=iAmLongVal109&iAmLong110=iAmLongVal110&iAmLong111=iAmLongVal111&" +
            "iAmLong112=iAmLongVal112&iAmLong113=iAmLongVal113&iAmLong114=iAmLongVal114&iAmLong115=iAmLongVal115&iAmLong116=iAmLongVal116&" +
            "iAmLong117=iAmLongVal117&iAmLong118=iAmLongVal118&iAmLong119=iAmLongVal119&iAmLong120=iAmLongVal120&iAmLong121=iAmLongVal121&" +
            "iAmLong122=iAmLongVal122&iAmLong123=iAmLongVal123&iAmLong124=iAmLongVal124&iAmLong125=iAmLongVal125&iAmLong126=iAmLongVal126&" +
            "iAmLong127=iAmLongVal127&iAmLong128=iAmLongVal128&iAmLong129=iAmLongVal129&iAmLong130=iAmLongVal130&iAmLong131=iAmLongVal131&" +
            "iAmLong132=iAmLongVal132&iAmLong133=iAmLongVal133&iAmLong134=iAmLongVal134&iAmLong135=iAmLongVal135&iAmLong136=iAmLongVal136&" +
            "iAmLong137=iAmLongVal137&iAmLong138=iAmLongVal138&iAmLong139=iAmLongVal139&iAmLong140=iAmLongVal140&iAmLong141=iAmLongVal141&" +
            "iAmLong142=iAmLongVal142&iAmLong143=iAmLongVal143&iAmLong144=iAmLongVal144&iAmLong145=iAmLongVal145&iAmLong146=iAmLongVal146&" +
            "iAmLong147=iAmLongVal147&iAmLong148=iAmLongVal148&iAmLong149=iAmLongVal149&iAmLong150=iAmLongVal150&iAmLong151=iAmLongVal151&" +
            "iAmLong152=iAmLongVal152&iAmLong153=iAmLongVal153&iAmLong154=iAmLongVal154&iAmLong155=iAmLongVal155&iAmLong156=iAmLongVal156&" +
            "iAmLong157=iAmLongVal157&iAmLong158=iAmLongVal158&iAmLong159=iAmLongVal159&iAmLong160=iAmLongVal160&iAmLong161=iAmLongVal161&" +
            "iAmLong162=iAmLongVal162&iAmLong163=iAmLongVal163&iAmLong164=iAmLongVal164&iAmLong165=iAmLongVal165&iAmLong166=iAmLongVal166&" +
            "iAmLong167=iAmLongVal167&iAmLong168=iAmLongVal168&iAmLong169=iAmLongVal169&iAmLong170=iAmLongVal170&iAmLong171=iAmLongVal171&" +
            "iAmLong172=iAmLongVal172&iAmLong173=iAmLongVal173&iAmLong174=iAmLongVal174&iAmLong175=iAmLongVal175&iAmLong176=iAmLongVal176&" +
            "iAmLong177=iAmLongVal177&iAmLong178=iAmLongVal178&iAmLong179=iAmLongVal179&iAmLong180=iAmLongVal180&iAmLong181=iAmLongVal181&" +
            "iAmLong182=iAmLongVal182&iAmLong183=iAmLongVal183&iAmLong184=iAmLongVal184&iAmLong185=iAmLongVal185&sap-intent-param=A123B456C789";
        return this.ShellNavigationInternal.hrefForExternal({
            target: { shellHash: sVeryLongShellHash }
        }).then((sStillLongHash) => {
            assert.strictEqual(sStillLongHash, sVeryLongShellHash, "A long hash fragment with sap-intent-param is not compacted");
        });
    });

    // currently we double encode url parameters
    QUnit.test("WithSoActionTargetAndParams_DoubleEncode", function (assert) {
        var sx = ("this&that is Space");
        return this.ShellNavigationInternal.hrefForExternal({
            target: {
                semanticObject: "SO",
                action: "ABC"
            },
            params: { A: [sx, 1] }
        }).then((sShellHashHref) => {
            assert.strictEqual(encodeURIComponent(sx), "this%26that%20is%20Space");
            assert.strictEqual(sShellHashHref, "#SO-ABC?A=this%2526that%2520is%2520Space&A=1");
        });
    });

    QUnit.test("WithShellHashTarget", function (assert) {
        return this.ShellNavigationInternal.hrefForExternal({
            target: { shellHash: "SO-Action" }
        }).then((sShellHash) => {
            assert.strictEqual(sShellHash, "#SO-Action");
        });
    });

    QUnit.test("WithShellHashTarget_DoubleEncode", function (assert) {
        var encodedParam = encodeURIComponent("needs%& encoding");
        return this.ShellNavigationInternal.hrefForExternal({
            target: { shellHash: "S O-Action?p=v%&p2=" + encodedParam }
        }).then((sShellHash) => {
            assert.strictEqual(sShellHash, "#S%20O-Action?p=v%25&p2=needs%2525%2526%2520encoding");
        });
    });

    // currently we double encode url parameters
    QUnit.test("URLNoTruncationVerbose", function (assert) {
        var sx = ("this&that is Space");
        var oParams = {
            OnceMoreIntoTheBreachOrFillTheWallsUpWithOurEnglishDead: [1, 2, 3, 4, 5, 6],
            VeryLongNamesAreAlsoProblematicEspIfMultipliedOften: [
                "That getting too long to be handled 1",
                "THIS is getting too long to be handled 2",
                "THIS is getting too long to be handled 7"
            ],
            B: [
                "THIS is getting too long to be handled 1",
                "THIS is getting too long to be handled 7"
            ],
            A: [sx, 1]
        };
        return this.ShellNavigationInternal.hrefForExternal({
            target: {
                semanticObject: "SO",
                action: "ABC"
            },
            params: oParams
        }, true).then((oShellHashHref) => {
            assert.strictEqual(oShellHashHref.hash, "#SO-ABC?A=this%2526that%2520is%2520Space&A=1&B=THIS%2520is%2520getting%2520too%2520long%2520to%2520be%2520handled%25201&" +
                "B=THIS%2520is%2520getting%2520too%2520long%2520to%2520be%2520handled%25207&OnceMoreIntoTheBreachOrFillTheWallsUpWithOurEnglishDead=1&" +
                "OnceMoreIntoTheBreachOrFillTheWallsUpWithOurEnglishDead=2&OnceMoreIntoTheBreachOrFillTheWallsUpWithOurEnglishDead=3&" +
                "OnceMoreIntoTheBreachOrFillTheWallsUpWithOurEnglishDead=4&OnceMoreIntoTheBreachOrFillTheWallsUpWithOurEnglishDead=5&" +
                "OnceMoreIntoTheBreachOrFillTheWallsUpWithOurEnglishDead=6&" +
                "VeryLongNamesAreAlsoProblematicEspIfMultipliedOften=That%2520getting%2520too%2520long%2520to%2520be%2520handled%25201&" +
                "VeryLongNamesAreAlsoProblematicEspIfMultipliedOften=THIS%2520is%2520getting%2520too%2520long%2520to%2520be%2520handled%25202&" +
                "VeryLongNamesAreAlsoProblematicEspIfMultipliedOften=THIS%2520is%2520getting%2520too%2520long%2520to%2520be%2520handled%25207");
            assert.strictEqual(oShellHashHref.params, undefined, "undefined if no truncation (!) ");
            assert.strictEqual(oShellHashHref.skippedParams, undefined, "undefined if no truncation");
        });
    });

    // currently we double encode url parameters
    QUnit.test("query parameters added to the action are stripped", function (assert) {
        // Arrange
        var oComponent = new UIComponent();
        // check that the personalization service was invoked correctly
        var oCreateEmptyAppStateSpy = sandbox.spy(this.AppState, "createEmptyAppState");

        // Act
        return this.ShellNavigationInternal.hrefForExternal({
            target: {
                semanticObject: "SO",
                action: "ABC?aaa=BBB"
            },
            params: {
                C: [1],
                D: [2]
            }
        }, true, oComponent).then((oShellHashHref) => {
            // Assert
            // extract a Shell Parameter
            assert.strictEqual(oShellHashHref.hash,
                "#SO-ABC?C=1&D=2", "correct hash");
            assert.deepEqual(oShellHashHref.params, undefined);
            assert.deepEqual(oShellHashHref.skippedParams, undefined, "no skipped params");
            assert.equal(oCreateEmptyAppStateSpy.calledOnce, false, "createEmptyAppState not invoked");
        });
    });


    /**
     * Duplicated tests for the synchronous path of the hrefForExternal function.
     *
     * The hrefForExternal function does not have the "async" option anymore.
     * The synchronous path has been outsourced to its own function "hrefForExternalSync" which
     * is deprecated.
     *
     * @deprecated since 1.119.0
     */
    QUnit.module("hrefForExternalSync", {
        beforeEach: function (assert) {
            var fnDone = assert.async();

            Container.init("local")
            .then(function () {
                Promise.all([
                    Container.getServiceAsync("ShellNavigationInternal"),
                    Container.getServiceAsync("AppState")
                ])
                .then(function (aServices) {
                    this.ShellNavigationInternal = aServices[0];
                    this.AppState = aServices[1];

                    if (typeof this.ShellNavigationInternal._lastHashChangeMode !== "undefined") {
                        throw new Error("Sanity: the _lastHashChangeMode is expected to be undefined at the beginning of a test");
                    }
                    fnDone();
                }.bind(this));
            }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
            this.ShellNavigationInternal.hashChanger.destroy();

            // reset the hash via hasher API after each test
            if (hasher) {
                hasher.setHash("");
            }

            Container.resetServices();
        }
    });

    QUnit.test("WithSoActionTargetAndParams", function (assert) {
        var sShellHash = this.ShellNavigationInternal.hrefForExternalSync({
            target: {
                semanticObject: "SO",
                action: "ABC"
            },
            params: { A: "A1" }
        });
        assert.strictEqual(sShellHash, "#SO-ABC?A=A1");
    });

    QUnit.test("Is idempotent", function (assert) {
        var sVeryLongShellHash = "#SO-act?iAmLong1=iAmLongVal1&iAmLong2=iAmLongVal2&iAmLong3=iAmLongVal3&iAmLong4=iAmLongVal4&iAmLong5=iAmLongVal5&" +
            "iAmLong6=iAmLongVal6&iAmLong7=iAmLongVal7&iAmLong8=iAmLongVal8&iAmLong9=iAmLongVal9&iAmLong10=iAmLongVal10&iAmLong11=iAmLongVal11&" +
            "iAmLong12=iAmLongVal12&iAmLong13=iAmLongVal13&iAmLong14=iAmLongVal14&iAmLong15=iAmLongVal15&iAmLong16=iAmLongVal16&" +
            "iAmLong17=iAmLongVal17&iAmLong18=iAmLongVal18&iAmLong19=iAmLongVal19&iAmLong20=iAmLongVal20&iAmLong21=iAmLongVal21&" +
            "iAmLong22=iAmLongVal22&iAmLong23=iAmLongVal23&iAmLong24=iAmLongVal24&iAmLong25=iAmLongVal25&iAmLong26=iAmLongVal26&" +
            "iAmLong27=iAmLongVal27&iAmLong28=iAmLongVal28&iAmLong29=iAmLongVal29&iAmLong30=iAmLongVal30&iAmLong31=iAmLongVal31&" +
            "iAmLong32=iAmLongVal32&iAmLong33=iAmLongVal33&iAmLong34=iAmLongVal34&iAmLong35=iAmLongVal35&iAmLong36=iAmLongVal36&" +
            "iAmLong37=iAmLongVal37&iAmLong38=iAmLongVal38&iAmLong39=iAmLongVal39&iAmLong40=iAmLongVal40&iAmLong41=iAmLongVal41&" +
            "iAmLong42=iAmLongVal42&iAmLong43=iAmLongVal43&iAmLong44=iAmLongVal44&iAmLong45=iAmLongVal45&iAmLong46=iAmLongVal46&" +
            "iAmLong47=iAmLongVal47&iAmLong48=iAmLongVal48&iAmLong49=iAmLongVal49&iAmLong50=iAmLongVal50&iAmLong51=iAmLongVal51&" +
            "iAmLong52=iAmLongVal52&iAmLong53=iAmLongVal53&iAmLong54=iAmLongVal54&iAmLong55=iAmLongVal55&iAmLong56=iAmLongVal56&" +
            "iAmLong57=iAmLongVal57&iAmLong58=iAmLongVal58&iAmLong59=iAmLongVal59&iAmLong60=iAmLongVal60&iAmLong61=iAmLongVal61&" +
            "iAmLong62=iAmLongVal62&iAmLong63=iAmLongVal63&iAmLong64=iAmLongVal64&iAmLong65=iAmLongVal65&iAmLong66=iAmLongVal66&" +
            "iAmLong67=iAmLongVal67&iAmLong68=iAmLongVal68&iAmLong69=iAmLongVal69&iAmLong70=iAmLongVal70&iAmLong71=iAmLongVal71&" +
            "iAmLong72=iAmLongVal72&iAmLong73=iAmLongVal73&iAmLong74=iAmLongVal74&iAmLong75=iAmLongVal75&iAmLong76=iAmLongVal76&" +
            "iAmLong77=iAmLongVal77&iAmLong78=iAmLongVal78&iAmLong79=iAmLongVal79&iAmLong80=iAmLongVal80&iAmLong81=iAmLongVal81&" +
            "iAmLong82=iAmLongVal82&iAmLong83=iAmLongVal83&iAmLong84=iAmLongVal84&iAmLong85=iAmLongVal85&iAmLong86=iAmLongVal86&" +
            "iAmLong87=iAmLongVal87&iAmLong88=iAmLongVal88&iAmLong89=iAmLongVal89&iAmLong90=iAmLongVal90&iAmLong91=iAmLongVal91&" +
            "iAmLong92=iAmLongVal92&iAmLong93=iAmLongVal93&iAmLong94=iAmLongVal94&iAmLong95=iAmLongVal95&iAmLong96=iAmLongVal96&" +
            "iAmLong97=iAmLongVal97&iAmLong98=iAmLongVal98&iAmLong99=iAmLongVal99&iAmLong100=iAmLongVal100&iAmLong101=iAmLongVal101&" +
            "iAmLong102=iAmLongVal102&iAmLong103=iAmLongVal103&iAmLong104=iAmLongVal104&iAmLong105=iAmLongVal105&iAmLong106=iAmLongVal106&" +
            "iAmLong107=iAmLongVal107&iAmLong108=iAmLongVal108&iAmLong109=iAmLongVal109&iAmLong110=iAmLongVal110&iAmLong111=iAmLongVal111&" +
            "iAmLong112=iAmLongVal112&iAmLong113=iAmLongVal113&iAmLong114=iAmLongVal114&iAmLong115=iAmLongVal115&iAmLong116=iAmLongVal116&" +
            "iAmLong117=iAmLongVal117&iAmLong118=iAmLongVal118&iAmLong119=iAmLongVal119&iAmLong120=iAmLongVal120&iAmLong121=iAmLongVal121&" +
            "iAmLong122=iAmLongVal122&iAmLong123=iAmLongVal123&iAmLong124=iAmLongVal124&iAmLong125=iAmLongVal125&iAmLong126=iAmLongVal126&" +
            "iAmLong127=iAmLongVal127&iAmLong128=iAmLongVal128&iAmLong129=iAmLongVal129&iAmLong130=iAmLongVal130&iAmLong131=iAmLongVal131&" +
            "iAmLong132=iAmLongVal132&iAmLong133=iAmLongVal133&iAmLong134=iAmLongVal134&iAmLong135=iAmLongVal135&iAmLong136=iAmLongVal136&" +
            "iAmLong137=iAmLongVal137&iAmLong138=iAmLongVal138&iAmLong139=iAmLongVal139&iAmLong140=iAmLongVal140&iAmLong141=iAmLongVal141&" +
            "iAmLong142=iAmLongVal142&iAmLong143=iAmLongVal143&iAmLong144=iAmLongVal144&iAmLong145=iAmLongVal145&iAmLong146=iAmLongVal146&" +
            "iAmLong147=iAmLongVal147&iAmLong148=iAmLongVal148&iAmLong149=iAmLongVal149&iAmLong150=iAmLongVal150&iAmLong151=iAmLongVal151&" +
            "iAmLong152=iAmLongVal152&iAmLong153=iAmLongVal153&iAmLong154=iAmLongVal154&iAmLong155=iAmLongVal155&iAmLong156=iAmLongVal156&" +
            "iAmLong157=iAmLongVal157&iAmLong158=iAmLongVal158&iAmLong159=iAmLongVal159&iAmLong160=iAmLongVal160&iAmLong161=iAmLongVal161&" +
            "iAmLong162=iAmLongVal162&iAmLong163=iAmLongVal163&iAmLong164=iAmLongVal164&iAmLong165=iAmLongVal165&iAmLong166=iAmLongVal166&" +
            "iAmLong167=iAmLongVal167&iAmLong168=iAmLongVal168&iAmLong169=iAmLongVal169&iAmLong170=iAmLongVal170&iAmLong171=iAmLongVal171&" +
            "iAmLong172=iAmLongVal172&iAmLong173=iAmLongVal173&iAmLong174=iAmLongVal174&iAmLong175=iAmLongVal175&iAmLong176=iAmLongVal176&" +
            "iAmLong177=iAmLongVal177&iAmLong178=iAmLongVal178&iAmLong179=iAmLongVal179&iAmLong180=iAmLongVal180&iAmLong181=iAmLongVal181&" +
            "iAmLong182=iAmLongVal182&iAmLong183=iAmLongVal183&iAmLong184=iAmLongVal184&iAmLong185=iAmLongVal185";
        var sCompactShellHash1 = this.ShellNavigationInternal.hrefForExternalSync({
            target: { shellHash: sVeryLongShellHash }
        });
        var sCompactShellHash2 = this.ShellNavigationInternal.hrefForExternalSync({
            target: { shellHash: sCompactShellHash1 }
        });

        assert.strictEqual(sCompactShellHash2, sCompactShellHash1, "The same (compacted) shell hash is returned if hrefForExternal is called twice");
    });

    QUnit.test("Does not expand very long URL if sap-intent-parm is found", function (assert) {
        var sVeryLongShellHash = "#SO-act?iAmLong1=iAmLongVal1&iAmLong2=iAmLongVal2&iAmLong3=iAmLongVal3&iAmLong4=iAmLongVal4&iAmLong5=iAmLongVal5&" +
            "iAmLong6=iAmLongVal6&iAmLong7=iAmLongVal7&iAmLong8=iAmLongVal8&iAmLong9=iAmLongVal9&iAmLong10=iAmLongVal10&iAmLong11=iAmLongVal11&" +
            "iAmLong12=iAmLongVal12&iAmLong13=iAmLongVal13&iAmLong14=iAmLongVal14&iAmLong15=iAmLongVal15&iAmLong16=iAmLongVal16&" +
            "iAmLong17=iAmLongVal17&iAmLong18=iAmLongVal18&iAmLong19=iAmLongVal19&iAmLong20=iAmLongVal20&iAmLong21=iAmLongVal21&" +
            "iAmLong22=iAmLongVal22&iAmLong23=iAmLongVal23&iAmLong24=iAmLongVal24&iAmLong25=iAmLongVal25&iAmLong26=iAmLongVal26&" +
            "iAmLong27=iAmLongVal27&iAmLong28=iAmLongVal28&iAmLong29=iAmLongVal29&iAmLong30=iAmLongVal30&iAmLong31=iAmLongVal31&" +
            "iAmLong32=iAmLongVal32&iAmLong33=iAmLongVal33&iAmLong34=iAmLongVal34&iAmLong35=iAmLongVal35&iAmLong36=iAmLongVal36&" +
            "iAmLong37=iAmLongVal37&iAmLong38=iAmLongVal38&iAmLong39=iAmLongVal39&iAmLong40=iAmLongVal40&iAmLong41=iAmLongVal41&" +
            "iAmLong42=iAmLongVal42&iAmLong43=iAmLongVal43&iAmLong44=iAmLongVal44&iAmLong45=iAmLongVal45&iAmLong46=iAmLongVal46&" +
            "iAmLong47=iAmLongVal47&iAmLong48=iAmLongVal48&iAmLong49=iAmLongVal49&iAmLong50=iAmLongVal50&iAmLong51=iAmLongVal51&" +
            "iAmLong52=iAmLongVal52&iAmLong53=iAmLongVal53&iAmLong54=iAmLongVal54&iAmLong55=iAmLongVal55&iAmLong56=iAmLongVal56&" +
            "iAmLong57=iAmLongVal57&iAmLong58=iAmLongVal58&iAmLong59=iAmLongVal59&iAmLong60=iAmLongVal60&iAmLong61=iAmLongVal61&" +
            "iAmLong62=iAmLongVal62&iAmLong63=iAmLongVal63&iAmLong64=iAmLongVal64&iAmLong65=iAmLongVal65&iAmLong66=iAmLongVal66&" +
            "iAmLong67=iAmLongVal67&iAmLong68=iAmLongVal68&iAmLong69=iAmLongVal69&iAmLong70=iAmLongVal70&iAmLong71=iAmLongVal71&" +
            "iAmLong72=iAmLongVal72&iAmLong73=iAmLongVal73&iAmLong74=iAmLongVal74&iAmLong75=iAmLongVal75&iAmLong76=iAmLongVal76&" +
            "iAmLong77=iAmLongVal77&iAmLong78=iAmLongVal78&iAmLong79=iAmLongVal79&iAmLong80=iAmLongVal80&iAmLong81=iAmLongVal81&" +
            "iAmLong82=iAmLongVal82&iAmLong83=iAmLongVal83&iAmLong84=iAmLongVal84&iAmLong85=iAmLongVal85&iAmLong86=iAmLongVal86&" +
            "iAmLong87=iAmLongVal87&iAmLong88=iAmLongVal88&iAmLong89=iAmLongVal89&iAmLong90=iAmLongVal90&iAmLong91=iAmLongVal91&" +
            "iAmLong92=iAmLongVal92&iAmLong93=iAmLongVal93&iAmLong94=iAmLongVal94&iAmLong95=iAmLongVal95&iAmLong96=iAmLongVal96&" +
            "iAmLong97=iAmLongVal97&iAmLong98=iAmLongVal98&iAmLong99=iAmLongVal99&iAmLong100=iAmLongVal100&iAmLong101=iAmLongVal101&" +
            "iAmLong102=iAmLongVal102&iAmLong103=iAmLongVal103&iAmLong104=iAmLongVal104&iAmLong105=iAmLongVal105&iAmLong106=iAmLongVal106&" +
            "iAmLong107=iAmLongVal107&iAmLong108=iAmLongVal108&iAmLong109=iAmLongVal109&iAmLong110=iAmLongVal110&iAmLong111=iAmLongVal111&" +
            "iAmLong112=iAmLongVal112&iAmLong113=iAmLongVal113&iAmLong114=iAmLongVal114&iAmLong115=iAmLongVal115&iAmLong116=iAmLongVal116&" +
            "iAmLong117=iAmLongVal117&iAmLong118=iAmLongVal118&iAmLong119=iAmLongVal119&iAmLong120=iAmLongVal120&iAmLong121=iAmLongVal121&" +
            "iAmLong122=iAmLongVal122&iAmLong123=iAmLongVal123&iAmLong124=iAmLongVal124&iAmLong125=iAmLongVal125&iAmLong126=iAmLongVal126&" +
            "iAmLong127=iAmLongVal127&iAmLong128=iAmLongVal128&iAmLong129=iAmLongVal129&iAmLong130=iAmLongVal130&iAmLong131=iAmLongVal131&" +
            "iAmLong132=iAmLongVal132&iAmLong133=iAmLongVal133&iAmLong134=iAmLongVal134&iAmLong135=iAmLongVal135&iAmLong136=iAmLongVal136&" +
            "iAmLong137=iAmLongVal137&iAmLong138=iAmLongVal138&iAmLong139=iAmLongVal139&iAmLong140=iAmLongVal140&iAmLong141=iAmLongVal141&" +
            "iAmLong142=iAmLongVal142&iAmLong143=iAmLongVal143&iAmLong144=iAmLongVal144&iAmLong145=iAmLongVal145&iAmLong146=iAmLongVal146&" +
            "iAmLong147=iAmLongVal147&iAmLong148=iAmLongVal148&iAmLong149=iAmLongVal149&iAmLong150=iAmLongVal150&iAmLong151=iAmLongVal151&" +
            "iAmLong152=iAmLongVal152&iAmLong153=iAmLongVal153&iAmLong154=iAmLongVal154&iAmLong155=iAmLongVal155&iAmLong156=iAmLongVal156&" +
            "iAmLong157=iAmLongVal157&iAmLong158=iAmLongVal158&iAmLong159=iAmLongVal159&iAmLong160=iAmLongVal160&iAmLong161=iAmLongVal161&" +
            "iAmLong162=iAmLongVal162&iAmLong163=iAmLongVal163&iAmLong164=iAmLongVal164&iAmLong165=iAmLongVal165&iAmLong166=iAmLongVal166&" +
            "iAmLong167=iAmLongVal167&iAmLong168=iAmLongVal168&iAmLong169=iAmLongVal169&iAmLong170=iAmLongVal170&iAmLong171=iAmLongVal171&" +
            "iAmLong172=iAmLongVal172&iAmLong173=iAmLongVal173&iAmLong174=iAmLongVal174&iAmLong175=iAmLongVal175&iAmLong176=iAmLongVal176&" +
            "iAmLong177=iAmLongVal177&iAmLong178=iAmLongVal178&iAmLong179=iAmLongVal179&iAmLong180=iAmLongVal180&iAmLong181=iAmLongVal181&" +
            "iAmLong182=iAmLongVal182&iAmLong183=iAmLongVal183&iAmLong184=iAmLongVal184&iAmLong185=iAmLongVal185&sap-intent-param=A123B456C789";
        var sStillLongHash = this.ShellNavigationInternal.hrefForExternalSync({
            target: { shellHash: sVeryLongShellHash }
        });

        assert.strictEqual(sStillLongHash, sVeryLongShellHash, "A long hash fragment with sap-intent-param is not compacted");
    });

    // currently we double encode url parameters
    QUnit.test("WithSoActionTargetAndParams_DoubleEncode", function (assert) {
        var sx = ("this&that is Space");
        var sShellHashHref = this.ShellNavigationInternal.hrefForExternalSync({
            target: {
                semanticObject: "SO",
                action: "ABC"
            },
            params: { A: [sx, 1] }
        });
        assert.strictEqual(encodeURIComponent(sx), "this%26that%20is%20Space");
        assert.strictEqual(sShellHashHref, "#SO-ABC?A=this%2526that%2520is%2520Space&A=1");
    });

    QUnit.test("WithShellHashTarget", function (assert) {
        var sShellHash = this.ShellNavigationInternal.hrefForExternalSync({
            target: { shellHash: "SO-Action" }
        });
        assert.strictEqual(sShellHash, "#SO-Action");
    });

    QUnit.test("WithShellHashTarget_DoubleEncode", function (assert) {
        var encodedParam = encodeURIComponent("needs%& encoding");
        var sShellHash = this.ShellNavigationInternal.hrefForExternalSync({ target: { shellHash: "S O-Action?p=v%&p2=" + encodedParam } });
        assert.strictEqual(sShellHash, "#S%20O-Action?p=v%25&p2=needs%2525%2526%2520encoding");
    });

    // currently we double encode url parameters
    QUnit.test("URLNoTruncationVerbose", function (assert) {
        var sx = ("this&that is Space");
        var oParams = {
            OnceMoreIntoTheBreachOrFillTheWallsUpWithOurEnglishDead: [1, 2, 3, 4, 5, 6],
            VeryLongNamesAreAlsoProblematicEspIfMultipliedOften: [
                "That getting too long to be handled 1",
                "THIS is getting too long to be handled 2",
                "THIS is getting too long to be handled 7"
            ],
            B: [
                "THIS is getting too long to be handled 1",
                "THIS is getting too long to be handled 7"
            ],
            A: [sx, 1]
        };
        var oShellHashHref = this.ShellNavigationInternal.hrefForExternalSync({
            target: {
                semanticObject: "SO",
                action: "ABC"
            },
            params: oParams
        }, true);
        assert.strictEqual(oShellHashHref.hash, "#SO-ABC?A=this%2526that%2520is%2520Space&A=1&B=THIS%2520is%2520getting%2520too%2520long%2520to%2520be%2520handled%25201&" +
            "B=THIS%2520is%2520getting%2520too%2520long%2520to%2520be%2520handled%25207&OnceMoreIntoTheBreachOrFillTheWallsUpWithOurEnglishDead=1&" +
            "OnceMoreIntoTheBreachOrFillTheWallsUpWithOurEnglishDead=2&OnceMoreIntoTheBreachOrFillTheWallsUpWithOurEnglishDead=3&" +
            "OnceMoreIntoTheBreachOrFillTheWallsUpWithOurEnglishDead=4&OnceMoreIntoTheBreachOrFillTheWallsUpWithOurEnglishDead=5&" +
            "OnceMoreIntoTheBreachOrFillTheWallsUpWithOurEnglishDead=6&" +
            "VeryLongNamesAreAlsoProblematicEspIfMultipliedOften=That%2520getting%2520too%2520long%2520to%2520be%2520handled%25201&" +
            "VeryLongNamesAreAlsoProblematicEspIfMultipliedOften=THIS%2520is%2520getting%2520too%2520long%2520to%2520be%2520handled%25202&" +
            "VeryLongNamesAreAlsoProblematicEspIfMultipliedOften=THIS%2520is%2520getting%2520too%2520long%2520to%2520be%2520handled%25207");
        assert.strictEqual(oShellHashHref.params, undefined, "undefined if no truncation (!) ");
        assert.strictEqual(oShellHashHref.skippedParams, undefined, "undefined if no truncation");
    });
});
