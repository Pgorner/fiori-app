// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.ShellNavigation
 */
sap.ui.define([
    "sap/ui/core/routing/HashChanger",
    "sap/ui/core/UIComponent",
    "sap/ui/thirdparty/hasher",
    "sap/ushell/Container",
    "sap/ushell/services/ShellNavigationHashChanger"
], function (
    HashChanger,
    UIComponent,
    hasher,
    Container,
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

    QUnit.module("sap.ushell.services.ShellNavigation", {
        beforeEach: function (assert) {
            var fnDone = assert.async();

            Container.init("local")
                .then(function () {
                    Promise.all([
                        Container.getServiceAsync("ShellNavigation"),
                        Container.getServiceAsync("AppState")
                    ])
                        .then(function (aServices) {
                            this.ShellNavigation = aServices[0];
                            this.ShellNavigationInternal = this.ShellNavigation._oShellNavigationInternal;
                            this.AppState = aServices[1];

                            if (typeof this.ShellNavigation._lastHashChangeMode !== "undefined") {
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
        assert.ok(typeof this.ShellNavigation === "object");
    });

    QUnit.test("getNavigationContext", function (assert) {
        // Arrange
        var oGetCurrentNavigationStateStub = sandbox.stub(this.ShellNavigationInternal.hashChanger, "getCurrentNavigationState");
        oGetCurrentNavigationStateStub.returns({ status: "test" });
        var oIsInnerAppNavigationStub = sandbox.stub(this.ShellNavigationInternal.hashChanger, "isInnerAppNavigation");
        oIsInnerAppNavigationStub.returns(true);

        //Act
        var oNavigationContext = this.ShellNavigation.getNavigationContext();

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
        return this.ShellNavigation.compactParams({
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
        return this.ShellNavigation.compactParams({
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
        return this.ShellNavigation.compactParams({
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
        return this.ShellNavigation.compactParams(undefined, undefined, undefined).done(function (oResultParams) {
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
        return this.ShellNavigation.compactParams({}, undefined, undefined).done(function (oResultParams) {
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
        return this.ShellNavigation.compactParams({ A: ["1"] }, undefined, undefined).done(function (oResultParams) {
            // Assert
            // extract a Shell Parameter
            assert.deepEqual(oResultParams, { A: ["1"] }, "params ok");
        });
    });

    QUnit.test("init", function (assert) {
        // Arrange
        var fnCallback = sandbox.stub();
        var oInitShellNavigationStub = sandbox.stub(this.ShellNavigationInternal.hashChanger, "initShellNavigation");
        var oEnableHistoryEntryReplacedDetectionStub = sandbox.stub(this.ShellNavigationInternal, "_enableHistoryEntryReplacedDetection");

        // Act
        // we use a stub for the initShellNavigation navigation method to avoid registration of event handler on the hasher;
        // it's difficult to destroy the central hash changer instance and it causes side effects if not destroyed
        this.ShellNavigation.init(fnCallback);

        // Assert
        this.ShellNavigationInternal.hashChanger = HashChanger.getInstance();
        assert.ok(this.ShellNavigationInternal.hashChanger instanceof ShellNavigationHashChanger, "hashChanger instanceof ShellNavigationHashChanger");
        assert.ok(oInitShellNavigationStub.getCall(0).args[0], fnCallback, "call with correct callback");
        assert.strictEqual(oEnableHistoryEntryReplacedDetectionStub.callCount, 1);
    });

    QUnit.test("wasHistoryEntryReplaced: correct result when shell navigation is initialized", function (assert) {
        // Arrange

        // Act
        var bHistoryEntryReplaced = this.ShellNavigation.wasHistoryEntryReplaced();

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
        var bHistoryEntryReplaced = this.ShellNavigation.wasHistoryEntryReplaced();

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
        var bHistoryEntryReplaced = this.ShellNavigation.wasHistoryEntryReplaced();

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
        var bHistoryEntryReplaced = this.ShellNavigation.wasHistoryEntryReplaced();

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
        this.ShellNavigation.init(oHashChangeCallbackStub);

        assert.strictEqual(oHashChangeCallbackStub.callCount, 1, "Hash change callback called in init");

        this.ShellNavigation.registerNavigationFilter(fnFilter);

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

        this.ShellNavigation.registerNavigationFilter(fnFilter);

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
            this.ShellNavigation.init(oHashChangeCallbackStub);

            // Hash changes during init
            assert.strictEqual(oHashChangeCallbackStub.callCount, 1, "Hash change callback called in init");

            this.ShellNavigation.registerNavigationFilter(fnFilter);

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
        this.ShellNavigation.init(oHashChangeCallbackStub);

        // Hash changes during init
        assert.strictEqual(oHashChangeCallbackStub.callCount, 1, "Hash change callback called in init");

        // Act & Assert
        // This has effect (no abandon filter registered)
        return this.ShellNavigationInternal.toExternal({ target: { shellHash: "#Action-tonav1" } })
            .then(function () {
                assert.strictEqual(oHashChangeCallbackStub.callCount - 1, 1, "Hash change callback was made");

                // Now we register a navigation filter
                this.ShellNavigation.registerNavigationFilter(fnFilter);

                // This has no effect: abandon filter is registered
                return this.ShellNavigationInternal.toExternal({ target: { shellHash: "#Action-tonav2" } });
            }.bind(this))
            .then(function () {
                assert.strictEqual(oHashChangeCallbackStub.callCount - 1, 1, "No additional navigation was made");

                // Filter is unregistered, now navigation can take place
                this.ShellNavigation.unregisterNavigationFilter(fnFilter);

                return this.ShellNavigationInternal.toExternal({ target: { shellHash: "#Action-tonav3" } });
            }.bind(this))
            .then(function () {
                assert.strictEqual(oHashChangeCallbackStub.callCount - 1, 2, "Hash change callback was called again");
            });
    });

    QUnit.test("replaceHashWithoutNavigation: rewrite the hash without navigation", function (assert) {
        // Arrange
        sandbox.stub(hasher, "setHash");
        sandbox.stub(hasher, "replaceHash");
        var oFnOriginalSetHashStub = sandbox.stub();
        this.ShellNavigationInternal._fnOriginalSetHash = oFnOriginalSetHashStub;

        // Act
        this.ShellNavigation.replaceHashWithoutNavigation("#New-hash");
        hasher.replaceHash("#Some-hash");

        // Assert
        assert.strictEqual(oFnOriginalSetHashStub.callCount, 1, "original method called once");
        assert.deepEqual(oFnOriginalSetHashStub.getCall(0).args, ["#New-hash"], "the correct hash is set");
        assert.strictEqual(hasher.changed.active, true, "the hasher is active after setHash");
    });
});
