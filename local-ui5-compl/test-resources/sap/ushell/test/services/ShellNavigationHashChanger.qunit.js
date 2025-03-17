// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.ShellNavigationHashChanger
 */
sap.ui.define([
    "sap/base/Log",
    "sap/ui/performance/trace/Interaction",
    "sap/ushell/Container",
    "sap/ushell/library",
    "sap/ushell/services/ShellNavigationHashChanger",
    "sap/ushell/utils/UrlShortening"
], function (
    Log,
    Interaction,
    Container,
    ushellLibrary,
    ShellNavigationHashChanger,
    UrlShortening
) {
    "use strict";

    // shortcut for sap.ushell.NavigationState
    var NavigationState = ushellLibrary.NavigationState;

    /* global QUnit, sinon, hasher */

    var sandbox = sinon.createSandbox();

    QUnit.module("sap.ushell.services.ShellNavigationHashChanger", {
        beforeEach: function (assert) {
            var done = assert.async();
            Container.init("local")
                .then(function () {
                    this.oHashChanger = new ShellNavigationHashChanger();
                    this.oShellCallback = sandbox.stub();
                    this.oHashChanger.initShellNavigation(this.oShellCallback);
                    Container.getServiceAsync("ShellNavigationInternal").then(function (ShellNavigationInternal) {
                        this.ShellNavigationInternal = ShellNavigationInternal;
                        done();
                    }.bind(this));
                }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
            Container.resetServices();
        }
    });

    QUnit.test("getRelevantEventsInfo: returns the expected events to UI5", function (assert) {
        var oHashChanger = new ShellNavigationHashChanger();
        var aUi5EventInfo = oHashChanger.getRelevantEventsInfo();
        var aExpectedUi5EventInfo = [{
            name: "shellHashChanged",
            paramMapping: {
                newHash: "newAppSpecificRouteNoSeparator",
                oldHash: "oldAppSpecificRouteNoSeparator"
            },
            updateHashOnly: true
        }, {
            name: "hashChanged",
            paramMapping: {
                fullHash: "fullHash",
                newHash: "newHash"
            }
        }];

        assert.deepEqual(aUi5EventInfo, aExpectedUi5EventInfo, "expected data were returned");
    });

    QUnit.test("HashChanger.getReplaceHashEvents: returns the expected list of events", function (assert) {
        var oShellNavigationHashChanger = this.ShellNavigationInternal.hashChanger;
        var aReplaceEvents = oShellNavigationHashChanger.getReplaceHashEvents();
        assert.deepEqual(aReplaceEvents, ["hashReplaced", "hashChanged"], "got expected event names");
    });

    QUnit.test("HashChanger.geSetHashEvents: returns the expected list of events", function (assert) {
        var oShellNavigationHashChanger = this.ShellNavigationInternal.hashChanger;
        var aSetEvents = oShellNavigationHashChanger.getSetHashEvents();
        assert.deepEqual(aSetEvents, ["hashSet", "shellHashChanged"], "got expected event names");
    });

    QUnit.test("HashChanger.hrefForAppSpecificHash", function (assert) {
        var sAppSpecificHash; var sExpectedHash; var sActualHash;
        return this.oHashChanger.toExternal({
            target: {
                semanticObject: "AnObject",
                action: "Action"
            }
        })
            .then(function () {
                sAppSpecificHash = "app/specific&/hash needs &/?% encoding";
                sExpectedHash = encodeURI("#AnObject-Action&/" + sAppSpecificHash);
                sActualHash = this.oHashChanger.hrefForAppSpecificHash(sAppSpecificHash);
                assert.strictEqual(sActualHash, sExpectedHash);
            }.bind(this));
    });

    QUnit.module("checks HashChanger.toExternal function", {
        beforeEach: function () {
            return Container.init("local")
                .then(function () {
                    this.oHashChanger = new ShellNavigationHashChanger();
                    this.oShellCallback = sandbox.stub();
                    this.oHashChanger.initShellNavigation(this.oShellCallback);
                }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
            Container.resetServices();
        }
    });

    QUnit.test("HashChanger.toExternal with object, action and parameters", function (assert) {
        return this.oHashChanger.toExternal({
            target: {
                semanticObject: "AnObject",
                action: "Action"
            },
            params: {
                A: "Needs encoding&/",
                B: "anotherValue"
            }
        })
            .then(function () {
                var sExpectedHash = "AnObject-Action?A=" + encodeURIComponent("Needs encoding&/") + "&B=anotherValue";

                assert.ok(this.oShellCallback.calledWith(sExpectedHash, null), "ShellCallback called at least once with the sExpectedHash and null");
            }.bind(this));
    });

    QUnit.test("HashChanger.init and destroy", function (assert) {
        this.oShellCallback.reset();
        this.oHashChanger.destroy();

        return this.oHashChanger.toExternal({
            target: {
                semanticObject: "AnObject",
                action: "Action"
            }
        })
            .then(function () {
                assert.strictEqual(this.oShellCallback.callCount, 0, "ShellCallback not called");
            }.bind(this));
    });

    QUnit.module("checks HashChanger.toExternal function with changing bWriteHistory flags", {
        beforeEach: function () {
            return Container.init("local")
                .then(function () {
                    this.oHashChanger = new ShellNavigationHashChanger();
                    this.oShellCallback = sandbox.stub();
                    this.oHashChanger.initShellNavigation(this.oShellCallback);
                }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
            Container.resetServices();
        }
    });

    QUnit.test("HashChanger.toExternal - when write history true", function (assert) {
        var sExpectedAppHash;
        var bWriteHistory = true;

        return this.oHashChanger.toExternal({ target: { shellHash: "AnObject-Action" } })
            .then(function () {
                this.oShellCallback.reset();
                this.oSetHashStub = sandbox.stub(hasher, "setHash");
                this.oReplaceHashStub = sandbox.stub(hasher, "replaceHash");

                sExpectedAppHash = "#Abc-def?A=B";
                return this.oHashChanger.toExternal({ target: { shellHash: sExpectedAppHash } }, undefined, bWriteHistory);
            }.bind(this))
            .then(function () {
                assert.equal(this.oSetHashStub.callCount, 1, "correct call count");
                assert.equal(this.oReplaceHashStub.callCount, 0, "correct call count");
                assert.equal(this.oSetHashStub.args[0][0], "Abc-def?A=B", "correct hash");
            }.bind(this));
    });

    QUnit.test("HashChanger.toExternal - when write history undefined", function (assert) {
        var bWriteHistory;
        this.oSetHashStub = sandbox.stub(hasher, "setHash");
        this.oReplaceHashStub = sandbox.stub(hasher, "replaceHash");

        var sExpectedAppHash = "#Abc-def?A=B";
        return this.oHashChanger.toExternal({ target: { shellHash: sExpectedAppHash } }, undefined, bWriteHistory)
            .then(function () {
                assert.equal(this.oSetHashStub.callCount, 1, "correct call count");
                assert.equal(this.oReplaceHashStub.callCount, 0, "correct call count");
                assert.equal(this.oSetHashStub.args[0][0], "Abc-def?A=B", "correct hash");
            }.bind(this));
    });

    QUnit.test("HashChanger.toExternal - when write history false", function (assert) {
        var sExpectedAppHash;
        var bWriteHistory = false;

        this.oSetHashStub = sandbox.stub(hasher, "setHash");
        this.oReplaceHashStub = sandbox.stub(hasher, "replaceHash");
        sExpectedAppHash = "#Abc-def?A=B";
        return this.oHashChanger.toExternal({ target: { shellHash: sExpectedAppHash } }, undefined, bWriteHistory)
            .then(function () {
                assert.equal(this.oSetHashStub.callCount, 0, "correct call count");
                assert.equal(this.oReplaceHashStub.callCount, 1, "correct call count");
                assert.equal(this.oReplaceHashStub.args[0][0], "Abc-def?A=B", "correct hash");
            }.bind(this));
    });

    QUnit.module("checks the function privsplitHash", {
        beforeEach: function () {
            return Container.init("local")
                .then(function () {
                    this.oHashChanger = new ShellNavigationHashChanger();
                    this.oShellCallback = sandbox.stub();
                    this.oHashChanger.initShellNavigation(this.oShellCallback);
                }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
            Container.resetServices();
        }
    });

    QUnit.test("Initial Shell navigation part is handled equally", function (assert) {
        return this.oHashChanger.toExternal({ target: { shellHash: "" } })
            .then(function () {
                this.oShellCallback.reset();
                var oShellHash1 = this.oHashChanger.privsplitHash("");
                var oShellHash2 = this.oHashChanger.privsplitHash("&/detail");

                assert.strictEqual(oShellHash1.shellPart, oShellHash2.shellPart, "shell parts equal");
            }.bind(this));
    });

    QUnit.module("checks the Navigation Filters", {
        beforeEach: function (assert) {
            var done = assert.async();
            Container.init("local")
                .then(function () {
                    this.oHashChanger = new ShellNavigationHashChanger();
                    this.oShellCallback = sandbox.stub();
                    this.oHashChanger.initShellNavigation(this.oShellCallback);
                    Container.getServiceAsync("ShellNavigationInternal").then(function (ShellNavigationInternal) {
                        this.ShellNavigationInternal = ShellNavigationInternal;
                        done();
                    }.bind(this));
                }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
            Container.resetServices();
        }
    });

    QUnit.test("Check initial Navigation Filter", function (assert) {
        // Act
        var oHashChanger = this.ShellNavigationInternal.hashChanger;

        // Assert
        assert.strictEqual(oHashChanger.aNavigationFilters.length, 1, "One filter was registered initially");
    });

    QUnit.test("registerNavigationFilter new filter", function (assert) {
        // Arrange
        var fnFilter = function () { };
        var oHashChanger = this.ShellNavigationInternal.hashChanger;

        // ignore existing filters registered during init
        oHashChanger.aNavigationFilters = [];

        // Act
        this.ShellNavigationInternal.registerNavigationFilter(fnFilter);

        // Assert
        assert.deepEqual(oHashChanger.aNavigationFilters, [fnFilter], "filter is registered among the navigation filters");
    });

    QUnit.test("unregisterNavigationFilter filter", function (assert) {
        // Arrange
        var fnFilter = function () { };
        var oHashChanger = this.ShellNavigationInternal.hashChanger;

        // ignore existing filters registered during init
        oHashChanger.aNavigationFilters = [fnFilter];

        // Act
        this.ShellNavigationInternal.unregisterNavigationFilter(fnFilter);

        // Assert
        assert.deepEqual(oHashChanger.aNavigationFilters, [], "filter is removed from aNavigationFilters member");
    });

    QUnit.module("checks the init function", {
        beforeEach: function () {
            return Container.init("local")
                .then(function () {
                    this.oHashChanger = new ShellNavigationHashChanger();
                    this.oShellCallback = sandbox.stub();
                    this.oHashChanger.initShellNavigation(this.oShellCallback);
                }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
            Container.resetServices();
        }
    });

    QUnit.test("init: parameter full hash is set when app specific route is null", function (assert) {
        var oHashChanger = new ShellNavigationHashChanger();
        var oInputHash = {
            appSpecificRoute: null,
            shellPart: "SO-ACTION"
        };
        var sExpectedFullHash = "SO-ACTION";

        var oPrivSplitHashStub = sandbox.stub(oHashChanger, "privsplitHash");
        oPrivSplitHashStub.returns(oInputHash);

        var oFireEventStub = sandbox.stub(oHashChanger, "fireEvent");

        oHashChanger.init();
        assert.deepEqual(oFireEventStub.calledWith("hashChanged",
            sandbox.match({ fullHash: sExpectedFullHash })), true, "event was fired with expectedFullHash");
    });

    QUnit.test("init: parameter full hash is set when app specific route does exist", function (assert) {
        var oHashChanger = new ShellNavigationHashChanger();
        var oInputHash = {
            appSpecificRoute: "&/appSpecific",
            shellPart: "SO-ACTION"
        };
        var sExpectedFullHash = "SO-ACTION&/appSpecific";

        var oPrivSplitHashStub = sandbox.stub(oHashChanger, "privsplitHash");
        oPrivSplitHashStub.returns(oInputHash);

        var oFireEventStub = sandbox.stub(oHashChanger, "fireEvent");

        oHashChanger.init();
        assert.deepEqual(oFireEventStub.calledWith("hashChanged",
            sandbox.match({ fullHash: sExpectedFullHash })), true, "event was fired with expectedFullHash");
    });

    QUnit.test("init: parameter full hash is set when hash is null", function (assert) {
        var oHashChanger = new ShellNavigationHashChanger();
        var oInputHash = null;
        var sExpectedFullHash = "";

        var oPrivSplitHashStub = sandbox.stub(oHashChanger, "privsplitHash");
        oPrivSplitHashStub.returns(oInputHash);

        var oFireEventStub = sandbox.stub(oHashChanger, "fireEvent");

        oHashChanger.init();
        assert.deepEqual(oFireEventStub.calledWith("hashChanged",
            sandbox.match({ fullHash: sExpectedFullHash })), true, "event was fired with expectedFullHash");
    });

    QUnit.module("checks the hash changed events", {
        beforeEach: function () {
            return Container.init("local")
                .then(function () {
                    window.location.hash = "";
                    this.oHashChanger = new ShellNavigationHashChanger();
                    this.oShellCallback = sandbox.stub();
                    this.oHashChanger.initShellNavigation(this.oShellCallback);
                    this.oResult = {
                        callCount: 0,
                        parameters: null
                    };
                    this.oSetHashSpy = sandbox.spy(hasher, "setHash");
                    this.oReplaceHashSpy = sandbox.spy(hasher, "replaceHash");

                    this.fnHashChangedHandler = function (oEvent) {
                        this.oResult.callCount += 1;
                        this.oResult.parameters = oEvent.getParameters();
                    }.bind(this);
                }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
            Container.resetServices();
        }
    });

    QUnit.test("HashChanger.toExternal with shellHash", function (assert) {
        var sExpectedHash;

        this.oHashChanger.attachEvent("hashSet", this.fnHashChangedHandler);

        sExpectedHash = "AnObject-Action?A=" + encodeURIComponent("Needs encoding&/") + "&B=anotherValue";
        return this.oHashChanger.toExternal({ target: { shellHash: sExpectedHash } })
            .then(function () {
                assert.ok(this.oShellCallback.calledWith(sExpectedHash, null), "the callback was called with the expected hash");

                assert.strictEqual(this.oResult.callCount, 1, "hashSet handler called once");
                assert.strictEqual(this.oResult.parameters.sHash, "", "expected sHash parameter set to empty string in hashChanged event");
            }.bind(this));
    });

    QUnit.test("HashChanger.toExternal with shellHash including app-specific part", function (assert) {
        var oExpandHashSpy = sandbox.spy(UrlShortening, "expandHash");

        this.oHashChanger.attachEvent("hashSet", this.fnHashChangedHandler);

        var sShellHash = "AnObject-Action?A=" + encodeURIComponent("Needs encoding&/") + "&B=anotherValue";
        var sAppHash = "/my/appspecific/route";
        return this.oHashChanger.toExternal({ target: { shellHash: sShellHash + "&/" + sAppHash } })
            .then(function () {
                assert.strictEqual(oExpandHashSpy.args[0][0], "AnObject-Action?A=Needs%20encoding%26%2F&B=anotherValue&//my/appspecific/route", "URLShortening.expandHash called with new Hash");
                assert.strictEqual(oExpandHashSpy.args[1][0], "", "URLShortening.expandHash called with old Hash");

                assert.ok(this.oShellCallback.calledWith(sShellHash, "&/" + sAppHash, null), "callback was called with the right parameters");

                assert.strictEqual(this.oResult.callCount, 1, "hashSet handler called once");
                assert.strictEqual(this.oResult.parameters.sHash, sAppHash, "expected sHash parameter set to app-specific part in hashChanged event");
            }.bind(this));
    });

    QUnit.test("HashChanger.toAppHash - writeHistory true for hashChanged", function (assert) {
        var sExpectedAppHash;

        return this.oHashChanger.toExternal({ target: { shellHash: "AnObject-Action" } })
            .then(function () {
                this.oShellCallback.reset();
                this.oHashChanger.attachEvent("hashChanged", this.fnHashChangedHandler);
                sExpectedAppHash = "my app hash";

                this.oHashChanger.toAppHash(sExpectedAppHash, true);

                assert.strictEqual(this.oShellCallback.callCount, 0, "the callback was not called.");

                assert.ok(this.oSetHashSpy.calledWith("AnObject-Action&/my app hash"), "setHash was called with the right parameters");

                assert.strictEqual(this.oResult.callCount, 1, "hashChanged handler called once");
                assert.strictEqual(this.oResult.parameters.newHash, sExpectedAppHash, "newHash parameter set in hashChanged event");
            }.bind(this));
    });

    QUnit.test("HashChanger.toAppHash - writeHistory true  for hashSet", function (assert) {
        var sExpectedAppHash;

        return this.oHashChanger.toExternal({ target: { shellHash: "AnObject-Action" } })
            .then(function () {
                this.oShellCallback.reset();
                this.oHashChanger.attachEvent("hashSet", this.fnHashChangedHandler);
                sExpectedAppHash = "my app hash";

                this.oHashChanger.toAppHash(sExpectedAppHash, true);

                assert.strictEqual(this.oShellCallback.callCount, 0, "the callback was not called.");

                assert.ok(this.oSetHashSpy.calledWith("AnObject-Action&/my app hash"), "setHash was called with the right parameters");

                assert.strictEqual(this.oResult.callCount, 1, "hashSet handler called once");
                assert.strictEqual(this.oResult.parameters.sHash, sExpectedAppHash, "sHash parameter set in hashChanged event");
            }.bind(this));
    });

    QUnit.test("HashChanger.setHash for hashChanged", function (assert) {
        var sExpectedAppHash;

        return this.oHashChanger.toExternal({ target: { shellHash: "AnObject-Action" } })
            .then(function () {
                this.oShellCallback.reset();
                this.oHashChanger.attachEvent("hashChanged", this.fnHashChangedHandler);
                sExpectedAppHash = "my app hash";

                this.oHashChanger.setHash(sExpectedAppHash);

                assert.strictEqual(this.oShellCallback.callCount, 0, "the callback was not called");

                assert.ok(this.oSetHashSpy.calledWith("AnObject-Action&/my app hash"), "setHash was called with the right parameters");

                assert.strictEqual(this.oResult.callCount, 1, "hashChanged handler called once");
                assert.strictEqual(this.oResult.parameters.newHash, sExpectedAppHash, "newHash parameter set in hashChanged event");
            }.bind(this));
    });

    QUnit.test("HashChanger.setHash for hashSet", function (assert) {
        var sExpectedAppHash;

        return this.oHashChanger.toExternal({ target: { shellHash: "AnObject-Action" } })
            .then(function () {
                this.oShellCallback.reset();
                this.oHashChanger.attachEvent("hashSet", this.fnHashChangedHandler);
                sExpectedAppHash = "my app hash";

                this.oHashChanger.setHash(sExpectedAppHash);

                assert.strictEqual(this.oShellCallback.callCount, 0, "the callback was not called");

                assert.ok(this.oSetHashSpy.calledWith("AnObject-Action&/my app hash"), "setHash was called with the right parameters");

                assert.strictEqual(this.oResult.callCount, 1, "hashSet handler called once");
                assert.strictEqual(this.oResult.parameters.sHash, sExpectedAppHash, "sHash parameter set in hashChanged event");
            }.bind(this));
    });

    QUnit.test("HashChanger.toAppHash - writeHistory false for hashChanged", function (assert) {
        var sExpectedAppHash;

        return this.oHashChanger.toExternal({ target: { shellHash: "AnObject-Action" } })
            .then(function () {
                this.oShellCallback.reset();
                this.oHashChanger.attachEvent("hashChanged", this.fnHashChangedHandler);
                sExpectedAppHash = "my app hash";

                this.oHashChanger.toAppHash(sExpectedAppHash, false);

                assert.strictEqual(this.oShellCallback.callCount, 0, "the callback was not called");

                assert.ok(this.oReplaceHashSpy.calledWith("AnObject-Action&/my app hash"), "replaceHash was called with the right parameters.");

                assert.strictEqual(this.oResult.callCount, 1, "hashChanged handler called once");
                assert.strictEqual(this.oResult.parameters.newHash, sExpectedAppHash, "newHash parameter set in hashChanged event");
            }.bind(this));
    });

    QUnit.test("HashChanger.toAppHash - writeHistory false for hashReplaced", function (assert) {
        var sExpectedAppHash;

        return this.oHashChanger.toExternal({ target: { shellHash: "AnObject-Action" } })
            .then(function () {
                this.oShellCallback.reset();
                this.oHashChanger.attachEvent("hashReplaced", this.fnHashChangedHandler);
                sExpectedAppHash = "my app hash";

                this.oHashChanger.toAppHash(sExpectedAppHash, false);

                assert.strictEqual(this.oShellCallback.callCount, 0, "the callback was not called");

                assert.ok(this.oReplaceHashSpy.calledWith("AnObject-Action&/my app hash"), "replaceHash was called with the right parameters.");

                assert.strictEqual(this.oResult.callCount, 1, "hashReplaced handler called once");
                assert.strictEqual(this.oResult.parameters.sHash, sExpectedAppHash, "sHash parameter set in hashReplaced event");
            }.bind(this));
    });

    QUnit.test("HashChanger.replaceHash for hashChanged", function (assert) {
        var sExpectedAppHash;

        return this.oHashChanger.toExternal({ target: { shellHash: "AnObject-Action" } })
            .then(function () {
                this.oShellCallback.reset();
                this.oHashChanger.attachEvent("hashChanged", this.fnHashChangedHandler);
                sExpectedAppHash = "my app hash";

                this.oHashChanger.replaceHash(sExpectedAppHash);

                assert.strictEqual(this.oShellCallback.callCount, 0, "the callback was not called");

                assert.ok(this.oReplaceHashSpy.calledWith("AnObject-Action&/my app hash"), "replaceHash was called with the right parameters");

                assert.strictEqual(this.oResult.callCount, 1, "hashChanged handler called once");
                assert.strictEqual(this.oResult.parameters.newHash, sExpectedAppHash, "newHash parameter set in hashChanged event");
            }.bind(this));
    });

    QUnit.test("HashChanger.replaceHash for hashReplaced", function (assert) {
        var sExpectedAppHash;

        return this.oHashChanger.toExternal({ target: { shellHash: "AnObject-Action" } })
            .then(function () {
                this.oShellCallback.reset();
                this.oHashChanger.attachEvent("hashReplaced", this.fnHashChangedHandler);
                sExpectedAppHash = "my app hash";

                this.oHashChanger.replaceHash(sExpectedAppHash);

                assert.strictEqual(this.oShellCallback.callCount, 0, "the callback was not called");

                assert.ok(this.oReplaceHashSpy.calledWith("AnObject-Action&/my app hash"), "replaceHash was called with the right parameters");

                assert.strictEqual(this.oResult.callCount, 1, "hashSet handler called once");
                assert.strictEqual(this.oResult.parameters.sHash, sExpectedAppHash, "sHash parameter set in hashReplaced event");
            }.bind(this));
    });

    // see I-CSN 0001102839 2014
    QUnit.test("robust error handling for hash change with illegal new hash", function (assert) {
        return this.oHashChanger.toExternal({ target: { shellHash: "" } })
            .then(function () {
                this.oShellCallback.reset();
                this.oHashChanger.attachEvent("shellHashChanged", this.fnHashChangedHandler);
                this.oHashChanger.treatHashChanged("illegalhash", "SO-action&/app-specific-route");

                assert.ok(this.oShellCallback.calledWith("illegalhash", null,
                    "SO-action", "&/app-specific-route", sandbox.match.instanceOf(Error)), "callback was called with the right parameters");

                assert.strictEqual(this.oResult.callCount, 1, "shellHashChanged handler called once");
                assert.strictEqual(this.oResult.parameters.newShellHash, "illegalhash", "shellHashChanged called with newShellHash");
                assert.strictEqual(this.oResult.parameters.newAppSpecificRoute, null, "shellHashChanged called with newAppSpecificRoute");
                assert.strictEqual(this.oResult.parameters.oldShellHash, "SO-action", "shellHashChanged called with oldShellHash");
                assert.ok(this.oResult.parameters.error instanceof Error, "shellHashChanged called with error");
            }.bind(this));
    });

    QUnit.test("robust error handling for hash change with illegal new and old hash", function (assert) {
        return this.oHashChanger.toExternal({ target: { shellHash: "" } })
            .then(function () {
                this.oShellCallback.reset();
                this.oHashChanger.attachEvent("shellHashChanged", this.fnHashChangedHandler);
                this.oHashChanger.treatHashChanged("illegalNewHash", "illegalOldHash");

                assert.ok(this.oShellCallback.calledWith("illegalNewHash", null, "illegalOldHash", null,
                    sandbox.match.instanceOf(Error)), "callback was called with the right parameters");

                assert.strictEqual(this.oResult.callCount, 1, "shellHashChanged handler called once");
                assert.strictEqual(this.oResult.parameters.newShellHash, "illegalNewHash", "shellHashChanged called with newShellHash");
                assert.strictEqual(this.oResult.parameters.newAppSpecificRoute, null, "shellHashChanged called with newAppSpecificRoute");
                assert.strictEqual(this.oResult.parameters.oldShellHash, "illegalOldHash", "shellHashChanged called with oldShellHash");
                assert.ok(this.oResult.parameters.error instanceof Error, "shellHashChanged called with error");
            }.bind(this));
    });

    QUnit.test("robust error handling for hash change with illegal old hash", function (assert) {
        return this.oHashChanger.toExternal({ target: { shellHash: "" } })
            .then(function () {
                this.oShellCallback.reset();
                this.oHashChanger.attachEvent("shellHashChanged", this.fnHashChangedHandler);
                this.oHashChanger.treatHashChanged("SO-action&/app-specific-route", "illegalhash");

                assert.ok(this.oShellCallback.calledWith("SO-action", "&/app-specific-route", "illegalhash", null), "callback was called with the right parameters");

                assert.strictEqual(this.oResult.callCount, 1, "shellHashChanged handler called once");
                assert.strictEqual(this.oResult.parameters.newShellHash, "SO-action", "shellHashChanged called with newShellHash");
                assert.strictEqual(this.oResult.parameters.newAppSpecificRoute, "&/app-specific-route", "shellHashChanged called with newAppSpecificRoute");
                assert.strictEqual(this.oResult.parameters.oldShellHash, "illegalhash", "shellHashChanged called with oldShellHash");
            }.bind(this));
    });

    QUnit.test("treatHashChanged - shellHashParameterChanged event fired if parameters have changed", function (assert) {
        this.oHashChanger.attachEvent("shellHashParameterChanged", this.fnHashChangedHandler);
        this.oHashChanger.treatHashChanged("SO-action?param1=newValue&/app-specific-route", "SO-action?param1=oldValue&/app-specific-route");

        assert.strictEqual(this.oResult.callCount, 1, "shellHashParameterChanged handler called once");
        assert.deepEqual(this.oResult.parameters.oNewParameters,
            { param1: ["newValue"] }, "shellHashParameterChanged called with new parameters");
        assert.deepEqual(this.oResult.parameters.oOldParameters,
            { param1: ["oldValue"] }, "shellHashParameterChanged called with old parameters");
    });

    QUnit.test("treatHashChanged - hashChanged event fired if parameters have not changed (change of AppSpecificRoute)", function (assert) {
        this.oHashChanger.attachEvent("hashChanged", this.fnHashChangedHandler);
        this.oHashChanger.treatHashChanged("SO-action?param1=oldValue&/new-app-specific-route",
            "SO-action?param1=oldValue&/old-app-specific-route");

        assert.strictEqual(this.oResult.callCount, 1, "hashChanged handler called once");
        assert.strictEqual(this.oResult.parameters.newHash,
            "new-app-specific-route", "hashChanged called with new parameters");
        assert.strictEqual(this.oResult.parameters.oldHash,
            "old-app-specific-route", "hashChanged called with old parameters");
    });

    QUnit.test("treatHashChanged - hashChanged event fired if old shell part is empty", function (assert) {
        this.oHashChanger.attachEvent("hashChanged", this.fnHashChangedHandler);
        this.oHashChanger.treatHashChanged("&/new-app-specific-route", "");

        assert.strictEqual(this.oResult.callCount, 1, "hashChanged handler called once");
        assert.strictEqual(this.oResult.parameters.newHash,
            "new-app-specific-route", "hashChanged called with new app-specific route");
        assert.strictEqual(this.oResult.parameters.oldHash, "", "hashChanged called with old app-specific route");
    });

    QUnit.test("treatHashChanged - shellHashChanged event fired if there are no listeners for shellHashParameterChanged event", function (assert) {
        this.oHashChanger.attachEvent("shellHashChanged", this.fnHashChangedHandler);
        this.oHashChanger.treatHashChanged("SO-action?param1=newValue&/new-app-specific-route",
            "SO-action?param1=oldValue&/old-app-specific-route");

        assert.ok(this.oShellCallback.calledWith("SO-action?param1=newValue", "&/new-app-specific-route",
            "SO-action?param1=oldValue", "&/old-app-specific-route"), "callback was called with the right parameters");

        assert.strictEqual(this.oResult.callCount, 1, "shellHashChanged handler called once");
        assert.strictEqual(this.oResult.parameters.newShellHash,
            "SO-action?param1=newValue", "shellHashChanged called with newShellHash");
        assert.strictEqual(this.oResult.parameters.newAppSpecificRoute,
            "&/new-app-specific-route", "shellHashChanged called with newAppSpecificRoute");
        assert.strictEqual(this.oResult.parameters.oldShellHash,
            "SO-action?param1=oldValue", "shellHashChanged called with oldShellHash");
        assert.strictEqual(this.oResult.parameters.oldAppSpecificRoute,
            "&/old-app-specific-route", "shellHashChanged called with oldAppSpecificRoute");
    });

    QUnit.module("checks the navigation state functions", {
        beforeEach: function () {
            return Container.init("local")
                .then(function () {
                    this.oHashChanger = new ShellNavigationHashChanger();
                    this.oShellCallback = sandbox.stub();
                    this.oHashChanger.initShellNavigation(this.oShellCallback);
                    this.oShellCallback.reset();
                }.bind(this));
        },
        afterEach: function () {
            this.oHashChanger.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("checks the _trackNavigation method", function (assert) {
        // Arrange
        var sNewHash = "Test";
        var sOldHash = "";

        // Act
        this.oHashChanger._trackNavigation(sNewHash, sOldHash);

        // Assert
        assert.strictEqual(this.oHashChanger._oNavigationState.newHash, sNewHash, "the new hash was set correctly.");
        assert.strictEqual(this.oHashChanger._oNavigationState.oldHash, sOldHash, "the old hash was set correctly.");
    });

    QUnit.test("checks the _setNavigationStatus method", function (assert) {
        // Arrange
        var oNavigationStatus = ushellLibrary.NavigationState.InProgress;

        // Act
        this.oHashChanger._setNavigationStatus(oNavigationStatus);

        // Assert
        assert.strictEqual(this.oHashChanger._oNavigationState.status, oNavigationStatus);
    });

    QUnit.test("checks the getCurrentNavigationState method", function (assert) {
        // Arrange
        this.oHashChanger._oNavigationState = ushellLibrary.NavigationState.InProgress;

        var oCurrentNavigationState = this.oHashChanger.getCurrentNavigationState();

        // Assert
        assert.strictEqual(ushellLibrary.NavigationState.InProgress, oCurrentNavigationState);
    });

    QUnit.module("treatHashChanged", {
        beforeEach: function () {
            this.oResolveAsyncStepStub = sandbox.stub();
            this.oNotifyAsyncStepStub = sandbox.stub(Interaction, "notifyAsyncStep").returns(this.oResolveAsyncStepStub);
            this.oLogInfoStub = sandbox.stub(Log, "info");
            this.oLogErrorStub = sandbox.stub(Log, "error");
            sandbox.stub(Container, "getServiceAsync").resolves();
            this.oHashChanger = new ShellNavigationHashChanger();
            this.oPrivfnShellCallbackStub = sandbox.stub();
            this.oHashChanger.privfnShellCallback = this.oPrivfnShellCallbackStub;

            this.NavigationFilterStatus = this.oHashChanger.NavigationFilterStatus;

            this.oNavigationFilterStub = sandbox.stub();
            this.oHashChanger.aNavigationFilters = [
                this.oNavigationFilterStub
            ];

            this.oTrackNavigationStub = sandbox.stub(this.oHashChanger, "_trackNavigation");
            this.oSetNavigationStatusSpy = sandbox.spy(this.oHashChanger, "_setNavigationStatus");
            this.oFireEventStub = sandbox.stub(this.oHashChanger, "fireEvent");
            this.oTreatHashChangedSpy = sandbox.spy(this.oHashChanger, "treatHashChanged");
        },
        afterEach: function () {
            sandbox.restore();
            Container.resetServices();
        }
    });

    QUnit.test("Prepares hash treatment", function (assert) {
        // Arrange
        this.oExpandHashStub = sandbox.stub(UrlShortening, "expandHash").returnsArg(0);
        this.oPrivSplitHashStub = sandbox.stub(this.oHashChanger, "privsplitHash").returns({});
        this.oNavigationFilterStub.withArgs("a", "b").returns({
            status: this.NavigationFilterStatus.Custom
        });
        // Act
        var oResult = this.oHashChanger.treatHashChanged("a", "b");
        // Assert
        assert.strictEqual(oResult, undefined, "returned the correct result");
        assert.deepEqual(this.oTrackNavigationStub.getCall(0).args, ["a", "b"], "_trackNavigation was called with correct args");
        assert.deepEqual(this.oSetNavigationStatusSpy.getCall(0).args, [NavigationState.InProgress], "_setNavigationStatus was called the first time with correct args");
        assert.deepEqual(this.oExpandHashStub.getCall(0).args, ["a"], "expandHash was called the first time with correct args");
        assert.deepEqual(this.oExpandHashStub.getCall(1).args, ["b"], "expandHash was called the second time with correct args");
        assert.deepEqual(this.oPrivSplitHashStub.getCall(0).args, ["a"], "privSplitHash was called the first time with correct args");
        assert.deepEqual(this.oPrivSplitHashStub.getCall(1).args, ["b"], "privSplitHash was called the second time with correct args");
        // Assert Interactions
        assert.strictEqual(this.oNotifyAsyncStepStub.callCount, 1, "notifyAsyncStep was called");
        assert.strictEqual(this.oResolveAsyncStepStub.callCount, 1, "notifyAsyncStep-resolve was called");
    });

    QUnit.test("Navigation to an invalid intent", function (assert) {
        // Arrange
        var sNewHash = "%%";
        var sOldHash = "Action-fromObject?oldParam=oldValue&/old/inner/app/route";
        this.oHashChanger.setReloadApplication(true);
        this.oHashChanger.aNavigationFilters = [];

        var aExpectedEvent = [
            "shellHashChanged",
            {
                newShellHash: "%%",
                newAppSpecificRoute: null,
                fullHash: "%%",
                oldShellHash: "Action-fromObject?oldParam=oldValue",
                error: new Error("Illegal new hash - cannot be parsed: '%%'")
            }
        ];
        var aExpectedCallbackArgs = [
            "%%",
            null,
            "Action-fromObject?oldParam=oldValue",
            "&/old/inner/app/route",
            new Error("Illegal new hash - cannot be parsed: '%%'")
        ];

        // Act
        this.oHashChanger.treatHashChanged(sNewHash, sOldHash);

        // Assert
        assert.strictEqual(this.oFireEventStub.callCount, 1, "hash event was fired");
        assert.deepEqual(this.oFireEventStub.getCall(0).args, aExpectedEvent, "the event has the correct properties");
        assert.deepEqual(this.oPrivfnShellCallbackStub.getCall(0).args, aExpectedCallbackArgs, "privfnShellCallback was called with correct args");
        // Assert NavigationStatus flow
        assert.strictEqual(this.oTreatHashChangedSpy.callCount, 1, "treatHashChanged was called once");
        assert.strictEqual(this.oSetNavigationStatusSpy.getCall(0).args[0], NavigationState.InProgress, "Initial Navigation was started");
        assert.strictEqual(this.oSetNavigationStatusSpy.getCall(1).args[0], NavigationState.Finished, "Initial Navigation was finished");
        // Assert cleanup of flags
        assert.strictEqual(this.oHashChanger.getReloadApplication(), false, "Reload Application flag was reset");
        assert.notOk(this.oHashChanger.inAbandonFlow, "abandon flow flag was cleared");
        // Assert Interactions
        assert.strictEqual(this.oNotifyAsyncStepStub.callCount, 1, "notifyAsyncStep was called");
        assert.strictEqual(this.oResolveAsyncStepStub.callCount, 1, "notifyAsyncStep-resolve was called");
    });

    QUnit.test("NavigationFilter returns NavigationStatus Abandon and hash changer stops navigation", function (assert) {
        // Arrange
        var sNewHash = "Action-from";
        var sOldHash = "Action-to";
        this.oHashChanger.setReloadApplication(true);

        this.oNavigationFilterStub.returns({
            status: this.NavigationFilterStatus.Abandon
        });

        // revert navigation on replaceHash
        sandbox.stub(hasher, "replaceHash").withArgs(sOldHash).callsFake(function () {
            this.oHashChanger.treatHashChanged(sOldHash, sNewHash);
        }.bind(this));

        // Act
        this.oHashChanger.treatHashChanged(sNewHash, sOldHash);

        // Assert
        assert.strictEqual(this.oFireEventStub.callCount, 0, "no hash event was fired");
        assert.strictEqual(this.oPrivfnShellCallbackStub.callCount, 0, "privfnShellCallback was not called");
        // Assert NavigationStatus flow
        assert.strictEqual(this.oTreatHashChangedSpy.callCount, 2, "treatHashChanged was called twice");
        assert.strictEqual(this.oSetNavigationStatusSpy.getCall(0).args[0], NavigationState.InProgress, "Initial Navigation was started");
        assert.strictEqual(this.oSetNavigationStatusSpy.getCall(1).args[0], NavigationState.InProgress, "Navigation was started by the replaceHash");
        assert.strictEqual(this.oSetNavigationStatusSpy.getCall(2).args[0], NavigationState.Finished, "Navigation triggered by replaceHash was finished");
        assert.strictEqual(this.oSetNavigationStatusSpy.getCall(3).args[0], NavigationState.Finished, "Initial Navigation was finished");
        // Assert cleanup of flags
        assert.strictEqual(this.oHashChanger.getReloadApplication(), false, "Reload Application flag was reset");
        assert.notOk(this.oHashChanger.inAbandonFlow, "abandon flow flag was cleared");
        // Assert Interactions
        assert.strictEqual(this.oNotifyAsyncStepStub.callCount, 1, "notifyAsyncStep was called");
        assert.strictEqual(this.oResolveAsyncStepStub.callCount, 1, "notifyAsyncStep-resolve was called");
    });

    QUnit.test("NavigationFilter returns NavigationStatus Custom w/o a hash and hash changer stops navigation", function (assert) {
        // Arrange
        var sNewHash = "Action-from";
        var sOldHash = "Action-to";
        this.oHashChanger.setReloadApplication(true);

        this.oNavigationFilterStub.returns({
            status: this.NavigationFilterStatus.Custom
        });

        // revert navigation on replaceHash
        sandbox.stub(hasher, "replaceHash").withArgs(sOldHash).callsFake(function () {
            this.oHashChanger.treatHashChanged(sOldHash, sNewHash);
        }.bind(this));

        // Act
        this.oHashChanger.treatHashChanged(sNewHash, sOldHash);

        // Assert
        assert.strictEqual(this.oFireEventStub.callCount, 0, "no hash event was fired");
        assert.strictEqual(this.oPrivfnShellCallbackStub.callCount, 0, "privfnShellCallback was not called");
        // Assert NavigationStatus flow
        assert.strictEqual(this.oTreatHashChangedSpy.callCount, 1, "treatHashChanged was called once");
        assert.strictEqual(this.oSetNavigationStatusSpy.getCall(0).args[0], NavigationState.InProgress, "Initial Navigation was started");
        assert.strictEqual(this.oSetNavigationStatusSpy.getCall(1).args[0], NavigationState.Finished, "Initial Navigation was finished");
        // Assert cleanup of flags
        assert.strictEqual(this.oHashChanger.getReloadApplication(), false, "Reload Application flag was reset");
        assert.notOk(this.oHashChanger.inAbandonFlow, "abandon flow flag was cleared");
        // Assert Interactions
        assert.strictEqual(this.oNotifyAsyncStepStub.callCount, 1, "notifyAsyncStep was called");
        assert.strictEqual(this.oResolveAsyncStepStub.callCount, 1, "notifyAsyncStep-resolve was called");
    });

    QUnit.test("NavigationFilter returns NavigationStatus Custom w/ a hash and hash changer stops navigation", function (assert) {
        // Arrange
        var sNewHash = "Action-from";
        var sOldHash = "Action-to";
        var sFilterHash = "Action-filter";
        this.oHashChanger.setReloadApplication(true);

        this.oNavigationFilterStub.returns({
            status: this.NavigationFilterStatus.Custom,
            hash: sFilterHash
        });

        // revert navigation on replaceHash
        sandbox.stub(hasher, "replaceHash").withArgs(sFilterHash).callsFake(function () {
            this.oHashChanger.treatHashChanged(sFilterHash, sNewHash);
        }.bind(this));

        // Act
        this.oHashChanger.treatHashChanged(sNewHash, sOldHash);

        // Assert
        assert.strictEqual(this.oFireEventStub.callCount, 0, "no hash event was fired");
        assert.strictEqual(this.oPrivfnShellCallbackStub.callCount, 0, "privfnShellCallback was not called");
        // Assert NavigationStatus flow
        assert.strictEqual(this.oTreatHashChangedSpy.callCount, 2, "treatHashChanged was called twice");
        assert.strictEqual(this.oSetNavigationStatusSpy.getCall(0).args[0], NavigationState.InProgress, "Initial Navigation was started");
        assert.strictEqual(this.oSetNavigationStatusSpy.getCall(1).args[0], NavigationState.InProgress, "Navigation was started by the replaceHash");
        assert.strictEqual(this.oSetNavigationStatusSpy.getCall(2).args[0], NavigationState.Finished, "Navigation triggered by replaceHash was finished");
        assert.strictEqual(this.oSetNavigationStatusSpy.getCall(3).args[0], NavigationState.Finished, "Initial Navigation was finished");
        // Assert cleanup of flags
        assert.strictEqual(this.oHashChanger.getReloadApplication(), false, "Reload Application flag was reset");
        assert.notOk(this.oHashChanger.inAbandonFlow, "abandon flow flag was cleared");
        // Assert Interactions
        assert.strictEqual(this.oNotifyAsyncStepStub.callCount, 1, "notifyAsyncStep was called");
        assert.strictEqual(this.oResolveAsyncStepStub.callCount, 1, "notifyAsyncStep-resolve was called");
    });

    QUnit.test("NavigationFilter returns NavigationStatus Keep", function (assert) {
        // Arrange
        var sNewHash = "Action-from";
        var sOldHash = "Action-to";
        this.oHashChanger.setReloadApplication(true);

        this.oNavigationFilterStub.returns({
            status: this.NavigationFilterStatus.Keep
        });

        var aExpectedEvent = [
            "hashChanged",
            {
                newHash: sNewHash,
                oldHash: sOldHash,
                fullHash: sNewHash
            }
        ];

        // Act
        this.oHashChanger.treatHashChanged(sNewHash, sOldHash);

        // Assert
        assert.strictEqual(this.oFireEventStub.callCount, 1, "hash event was fired");
        assert.deepEqual(this.oFireEventStub.getCall(0).args, aExpectedEvent, "the event has the correct properties");
        assert.strictEqual(this.oPrivfnShellCallbackStub.callCount, 0, "privfnShellCallback was not called");
        // Assert NavigationStatus flow
        assert.strictEqual(this.oTreatHashChangedSpy.callCount, 1, "treatHashChanged was called once");
        assert.strictEqual(this.oSetNavigationStatusSpy.getCall(0).args[0], NavigationState.InProgress, "Initial Navigation was started");
        assert.strictEqual(this.oSetNavigationStatusSpy.getCall(1).args[0], NavigationState.Finished, "Initial Navigation was finished");
        // Assert cleanup of flags
        assert.strictEqual(this.oHashChanger.getReloadApplication(), false, "Reload Application flag was reset");
        assert.notOk(this.oHashChanger.inAbandonFlow, "abandon flow flag was cleared");
        // Assert Interactions
        assert.strictEqual(this.oNotifyAsyncStepStub.callCount, 1, "notifyAsyncStep was called");
        assert.strictEqual(this.oResolveAsyncStepStub.callCount, 1, "notifyAsyncStep-resolve was called");
    });

    QUnit.test("Navigation to same intent w/ change in technical params", function (assert) {
        // Arrange
        var sNewHash = "Action-toObject?param=value&/inner/app/route";
        var sOldHash = "Action-toObject?param=value&sap-ui-fl-control-variant-id=variant123&/inner/app/route";
        this.oHashChanger.setReloadApplication(true);
        this.oHashChanger.aNavigationFilters = [];

        var aExpectedEvent = [
            "hashChanged",
            {
                newHash: "inner/app/route",
                oldHash: "inner/app/route",
                fullHash: sNewHash
            }
        ];

        // Act
        this.oHashChanger.treatHashChanged(sNewHash, sOldHash);

        // Assert
        assert.strictEqual(this.oFireEventStub.callCount, 1, "hash event was fired");
        assert.deepEqual(this.oFireEventStub.getCall(0).args, aExpectedEvent, "the event has the correct properties");
        assert.strictEqual(this.oPrivfnShellCallbackStub.callCount, 0, "privfnShellCallback was not called");
        // Assert NavigationStatus flow
        assert.strictEqual(this.oTreatHashChangedSpy.callCount, 1, "treatHashChanged was called once");
        assert.strictEqual(this.oSetNavigationStatusSpy.getCall(0).args[0], NavigationState.InProgress, "Initial Navigation was started");
        assert.strictEqual(this.oSetNavigationStatusSpy.getCall(1).args[0], NavigationState.Finished, "Initial Navigation was finished");
        // Assert cleanup of flags
        assert.strictEqual(this.oHashChanger.getReloadApplication(), false, "Reload Application flag was reset");
        assert.notOk(this.oHashChanger.inAbandonFlow, "abandon flow flag was cleared");
        // Assert Logs
        var aExpectedArgs = [
            "Navigation happened but hash stayed the same",
            null,
            "sap.ushell.services.ShellNavigationHashChanger"
        ];
        assert.deepEqual(this.oLogInfoStub.getCall(0).args, aExpectedArgs, "Log.info was called with correct args");
        // Assert Interactions
        assert.strictEqual(this.oNotifyAsyncStepStub.callCount, 1, "notifyAsyncStep was called");
        assert.strictEqual(this.oResolveAsyncStepStub.callCount, 1, "notifyAsyncStep-resolve was called");
    });

    QUnit.test("Navigation to same intent w/ change in inner app route and 'reloadApplication=false'", function (assert) {
        // Arrange
        var sNewHash = "Action-toObject?param=value&/new/inner/app/route";
        var sOldHash = "Action-toObject?param=value&/inner/app/route";
        this.oHashChanger.setReloadApplication(false);
        this.oHashChanger.aNavigationFilters = [];

        var aExpectedEvent = [
            "hashChanged",
            {
                newHash: "new/inner/app/route",
                oldHash: "inner/app/route",
                fullHash: sNewHash
            }
        ];

        // Act
        this.oHashChanger.treatHashChanged(sNewHash, sOldHash);

        // Assert
        assert.strictEqual(this.oFireEventStub.callCount, 1, "hash event was fired");
        assert.deepEqual(this.oFireEventStub.getCall(0).args, aExpectedEvent, "the event has the correct properties");
        assert.strictEqual(this.oPrivfnShellCallbackStub.callCount, 0, "privfnShellCallback was not called");
        // Assert NavigationStatus flow
        assert.strictEqual(this.oTreatHashChangedSpy.callCount, 1, "treatHashChanged was called once");
        assert.strictEqual(this.oSetNavigationStatusSpy.getCall(0).args[0], NavigationState.InProgress, "Initial Navigation was started");
        assert.strictEqual(this.oSetNavigationStatusSpy.getCall(1).args[0], NavigationState.Finished, "Initial Navigation was finished");
        // Assert cleanup of flags
        assert.strictEqual(this.oHashChanger.getReloadApplication(), false, "Reload Application flag was reset");
        assert.notOk(this.oHashChanger.inAbandonFlow, "abandon flow flag was cleared");
        // Assert Logs
        var aExpectedArgs = [
            "Inner App Hash changed from 'inner/app/route' to 'new/inner/app/route'",
            null,
            "sap.ushell.services.ShellNavigationHashChanger"
        ];
        assert.deepEqual(this.oLogInfoStub.getCall(0).args, aExpectedArgs, "Log.info was called with correct args");
        // Assert Interactions
        assert.strictEqual(this.oNotifyAsyncStepStub.callCount, 1, "notifyAsyncStep was called");
        assert.strictEqual(this.oResolveAsyncStepStub.callCount, 1, "notifyAsyncStep-resolve was called");
    });

    QUnit.test("Navigation to same intent w/o the inner app route and 'reloadApplication=true'", function (assert) {
        // Arrange
        var sNewHash = "Action-toObject?param=value";
        var sOldHash = "Action-toObject?param=value&/old/inner/app/route";
        this.oHashChanger.setReloadApplication(true);
        this.oHashChanger.aNavigationFilters = [];

        var aExpectedEvent = [
            "shellHashChanged",
            {
                newShellHash: "Action-toObject?param=value",
                newAppSpecificRoute: null,
                fullHash: sNewHash,
                oldShellHash: "Action-toObject?param=value",
                oldAppSpecificRoute: "&/old/inner/app/route",
                error: "",
                oldAppSpecificRouteNoSeparator: "old/inner/app/route",
                newAppSpecificRouteNoSeparator: ""
            }
        ];

        var aExpectedCallbackArgs = [
            "Action-toObject?param=value",
            null,
            "Action-toObject?param=value",
            "&/old/inner/app/route"
        ];

        // Act
        this.oHashChanger.treatHashChanged(sNewHash, sOldHash);

        // Assert
        assert.strictEqual(this.oFireEventStub.callCount, 1, "hash event was fired");
        assert.deepEqual(this.oFireEventStub.getCall(0).args, aExpectedEvent, "the event has the correct properties");
        assert.deepEqual(this.oPrivfnShellCallbackStub.getCall(0).args, aExpectedCallbackArgs, "privfnShellCallback was called with correct args");
        // Assert NavigationStatus flow
        assert.strictEqual(this.oTreatHashChangedSpy.callCount, 1, "treatHashChanged was called once");
        assert.strictEqual(this.oSetNavigationStatusSpy.getCall(0).args[0], NavigationState.InProgress, "Initial Navigation was started");
        assert.strictEqual(this.oSetNavigationStatusSpy.getCall(1).args[0], NavigationState.Finished, "Initial Navigation was finished");
        // Assert cleanup of flags
        assert.strictEqual(this.oHashChanger.getReloadApplication(), false, "Reload Application flag was reset");
        assert.notOk(this.oHashChanger.inAbandonFlow, "abandon flow flag was cleared");
        // Assert Interactions
        assert.strictEqual(this.oNotifyAsyncStepStub.callCount, 1, "notifyAsyncStep was called");
        assert.strictEqual(this.oResolveAsyncStepStub.callCount, 1, "notifyAsyncStep-resolve was called");
    });

    QUnit.test("Navigation to same intent but w/ change in parameters and listeners", function (assert) {
        // Arrange
        var sNewHash = "Action-toObject?param=value&newParam=newValue";
        var sOldHash = "Action-toObject?param=value";
        this.oHashChanger.setReloadApplication(true);
        this.oHashChanger.aNavigationFilters = [];

        sandbox.stub(this.oHashChanger, "hasListeners").withArgs("shellHashParameterChanged").returns(true);

        var aExpectedEvent = [
            "shellHashParameterChanged",
            {
                oNewParameters: {
                    param: ["value"],
                    newParam: ["newValue"]
                },
                oOldParameters: {
                    param: ["value"]
                }
            }
        ];

        // Act
        this.oHashChanger.treatHashChanged(sNewHash, sOldHash);

        // Assert
        assert.strictEqual(this.oFireEventStub.callCount, 1, "hash event was fired");
        assert.deepEqual(this.oFireEventStub.getCall(0).args, aExpectedEvent, "the event has the correct properties");
        assert.strictEqual(this.oPrivfnShellCallbackStub.callCount, 0, "privfnShellCallback was not called");
        // Assert NavigationStatus flow
        assert.strictEqual(this.oTreatHashChangedSpy.callCount, 1, "treatHashChanged was called once");
        assert.strictEqual(this.oSetNavigationStatusSpy.getCall(0).args[0], NavigationState.InProgress, "Initial Navigation was started");
        assert.strictEqual(this.oSetNavigationStatusSpy.getCall(1).args[0], NavigationState.Finished, "Initial Navigation was finished");
        // Assert cleanup of flags
        assert.strictEqual(this.oHashChanger.getReloadApplication(), false, "Reload Application flag was reset");
        assert.notOk(this.oHashChanger.inAbandonFlow, "abandon flow flag was cleared");
        // Assert Logs
        var aExpectedArgs = [
            "Shell hash parameters changed from 'param=value' to 'newParam=newValue&param=value'",
            null,
            "sap.ushell.services.ShellNavigationHashChanger"
        ];
        assert.deepEqual(this.oLogInfoStub.getCall(0).args, aExpectedArgs, "Log.info was called with correct args");
        // Assert Interactions
        assert.strictEqual(this.oNotifyAsyncStepStub.callCount, 1, "notifyAsyncStep was called");
        assert.strictEqual(this.oResolveAsyncStepStub.callCount, 1, "notifyAsyncStep-resolve was called");
    });

    QUnit.test("Navigation to new intent", function (assert) {
        // Arrange
        var sNewHash = "Action-toObject?newParam=newValue&/new/inner/app/route";
        var sOldHash = "Action-fromObject?oldParam=oldValue&/old/inner/app/route";
        this.oHashChanger.setReloadApplication(true);
        this.oHashChanger.aNavigationFilters = [];

        var aExpectedEvent = [
            "shellHashChanged",
            {
                newShellHash: "Action-toObject?newParam=newValue",
                newAppSpecificRoute: "&/new/inner/app/route",
                fullHash: sNewHash,
                oldShellHash: "Action-fromObject?oldParam=oldValue",
                oldAppSpecificRoute: "&/old/inner/app/route",
                error: "",
                oldAppSpecificRouteNoSeparator: "old/inner/app/route",
                newAppSpecificRouteNoSeparator: "new/inner/app/route"
            }
        ];
        var aExpectedCallbackArgs = [
            "Action-toObject?newParam=newValue",
            "&/new/inner/app/route",
            "Action-fromObject?oldParam=oldValue",
            "&/old/inner/app/route"
        ];

        // Act
        this.oHashChanger.treatHashChanged(sNewHash, sOldHash);

        // Assert
        assert.strictEqual(this.oFireEventStub.callCount, 1, "hash event was fired");
        assert.deepEqual(this.oFireEventStub.getCall(0).args, aExpectedEvent, "the event has the correct properties");
        assert.deepEqual(this.oPrivfnShellCallbackStub.getCall(0).args, aExpectedCallbackArgs, "privfnShellCallback was called with correct args");
        // Assert NavigationStatus flow
        assert.strictEqual(this.oTreatHashChangedSpy.callCount, 1, "treatHashChanged was called once");
        assert.strictEqual(this.oSetNavigationStatusSpy.getCall(0).args[0], NavigationState.InProgress, "Initial Navigation was started");
        assert.strictEqual(this.oSetNavigationStatusSpy.getCall(1).args[0], NavigationState.Finished, "Initial Navigation was finished");
        // Assert cleanup of flags
        assert.strictEqual(this.oHashChanger.getReloadApplication(), false, "Reload Application flag was reset");
        assert.notOk(this.oHashChanger.inAbandonFlow, "abandon flow flag was cleared");
        // Assert Logs
        var aExpectedArgs = [
            "Outer shell hash changed from '" + sOldHash + "' to '" + sNewHash + "'",
            null,
            "sap.ushell.services.ShellNavigationHashChanger"
        ];
        assert.deepEqual(this.oLogInfoStub.getCall(0).args, aExpectedArgs, "Log.info was called with correct args");
        // Assert Interactions
        assert.strictEqual(this.oNotifyAsyncStepStub.callCount, 1, "notifyAsyncStep was called");
        assert.strictEqual(this.oResolveAsyncStepStub.callCount, 1, "notifyAsyncStep-resolve was called");
    });

    QUnit.test("Navigation to new intent w/ an failing NavigationFilter", function (assert) {
        // Arrange
        var sNewHash = "Action-toObject?newParam=newValue&/new/inner/app/route";
        var sOldHash = "Action-fromObject?oldParam=oldValue&/old/inner/app/route";
        this.oHashChanger.setReloadApplication(true);
        this.oHashChanger.aNavigationFilters = [
            function () {
                throw new Error("NavigationFilter failed intentionally");
            }
        ];

        var aExpectedEvent = [
            "shellHashChanged",
            {
                newShellHash: "Action-toObject?newParam=newValue",
                newAppSpecificRoute: "&/new/inner/app/route",
                fullHash: sNewHash,
                oldShellHash: "Action-fromObject?oldParam=oldValue",
                oldAppSpecificRoute: "&/old/inner/app/route",
                error: "",
                oldAppSpecificRouteNoSeparator: "old/inner/app/route",
                newAppSpecificRouteNoSeparator: "new/inner/app/route"
            }
        ];
        var aExpectedCallbackArgs = [
            "Action-toObject?newParam=newValue",
            "&/new/inner/app/route",
            "Action-fromObject?oldParam=oldValue",
            "&/old/inner/app/route"
        ];

        // Act
        this.oHashChanger.treatHashChanged(sNewHash, sOldHash);

        // Assert
        assert.strictEqual(this.oFireEventStub.callCount, 1, "hash event was fired");
        assert.deepEqual(this.oFireEventStub.getCall(0).args, aExpectedEvent, "the event has the correct properties");
        assert.deepEqual(this.oPrivfnShellCallbackStub.getCall(0).args, aExpectedCallbackArgs, "privfnShellCallback was called with correct args");
        // Assert NavigationStatus flow
        assert.strictEqual(this.oTreatHashChangedSpy.callCount, 1, "treatHashChanged was called once");
        assert.strictEqual(this.oSetNavigationStatusSpy.getCall(0).args[0], NavigationState.InProgress, "Initial Navigation was started");
        assert.strictEqual(this.oSetNavigationStatusSpy.getCall(1).args[0], NavigationState.Finished, "Initial Navigation was finished");
        // Assert cleanup of flags
        assert.strictEqual(this.oHashChanger.getReloadApplication(), false, "Reload Application flag was reset");
        assert.notOk(this.oHashChanger.inAbandonFlow, "abandon flow flag was cleared");
        // Assert Logs
        var aExpectedArgs = [
            "Error while calling Navigation filter! ignoring filter...",
            "NavigationFilter failed intentionally",
            "sap.ushell.services.ShellNavigationHashChanger"
        ];
        assert.deepEqual(this.oLogErrorStub.getCall(0).args, aExpectedArgs, "Log.error was called with correct args");
        // Assert Interactions
        assert.strictEqual(this.oNotifyAsyncStepStub.callCount, 1, "notifyAsyncStep was called");
        assert.strictEqual(this.oResolveAsyncStepStub.callCount, 1, "notifyAsyncStep-resolve was called");
    });

    QUnit.test("Navigation from an invalid intent", function (assert) {
        // Arrange
        var sNewHash = "Action-toObject?newParam=newValue&/new/inner/app/route";
        var sOldHash = "%%";
        this.oHashChanger.setReloadApplication(true);
        this.oHashChanger.aNavigationFilters = [];

        var aExpectedEvent = [
            "shellHashChanged",
            {
                newShellHash: "Action-toObject?newParam=newValue",
                newAppSpecificRoute: "&/new/inner/app/route",
                fullHash: sNewHash,
                oldShellHash: "%%",
                oldAppSpecificRoute: null,
                error: "",
                oldAppSpecificRouteNoSeparator: "",
                newAppSpecificRouteNoSeparator: "new/inner/app/route"
            }
        ];
        var aExpectedCallbackArgs = [
            "Action-toObject?newParam=newValue",
            "&/new/inner/app/route",
            "%%",
            null
        ];

        // Act
        this.oHashChanger.treatHashChanged(sNewHash, sOldHash);

        // Assert
        assert.strictEqual(this.oFireEventStub.callCount, 1, "hash event was fired");
        assert.deepEqual(this.oFireEventStub.getCall(0).args, aExpectedEvent, "the event has the correct properties");
        assert.deepEqual(this.oPrivfnShellCallbackStub.getCall(0).args, aExpectedCallbackArgs, "privfnShellCallback was called with correct args");
        // Assert NavigationStatus flow
        assert.strictEqual(this.oTreatHashChangedSpy.callCount, 1, "treatHashChanged was called once");
        assert.strictEqual(this.oSetNavigationStatusSpy.getCall(0).args[0], NavigationState.InProgress, "Initial Navigation was started");
        assert.strictEqual(this.oSetNavigationStatusSpy.getCall(1).args[0], NavigationState.Finished, "Initial Navigation was finished");
        // Assert cleanup of flags
        assert.strictEqual(this.oHashChanger.getReloadApplication(), false, "Reload Application flag was reset");
        assert.notOk(this.oHashChanger.inAbandonFlow, "abandon flow flag was cleared");
        // Assert Interactions
        assert.strictEqual(this.oNotifyAsyncStepStub.callCount, 1, "notifyAsyncStep was called");
        assert.strictEqual(this.oResolveAsyncStepStub.callCount, 1, "notifyAsyncStep-resolve was called");
    });

    QUnit.module("The function hrefForExternalNoEncAsync", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub();
            sandbox.stub(Container, "getServiceAsync").callsFake(this.oGetServiceAsyncStub);
            this.oCreateEmptyAppStateStub = sandbox.stub().returns({
                getKey: sandbox.stub().returns("AppStateKey")
            });
            this.oGetServiceAsyncStub.withArgs("AppState").resolves({
                createEmptyAppState: this.oCreateEmptyAppStateStub
            });

            this.oHashChanger = new ShellNavigationHashChanger();

            this.oPrivhrefForExternalNoEncStub = sandbox.stub(this.oHashChanger, "privhrefForExternalNoEnc").returns({
                hash: "hash",
                params: "params",
                skippedParams: "skippedParams",
                ignoredParam: "will not be forwarded to the results"
            });
        },
        afterEach: function () {
            sandbox.restore();
            Container.resetServices();
        }
    });

    QUnit.test("Resolves a verbose result", function (assert) {
        // Arrange
        var oArgs = {};
        var oComponent = {};
        var oExpectedResult = {
            hash: "hash",
            params: "params",
            skippedParams: "skippedParams"
        };

        // Act
        return this.oHashChanger.hrefForExternalNoEncAsync(oArgs, true, oComponent)
            .then(function (oResult) {
                // Assert
                assert.deepEqual(oResult, oExpectedResult, "Resolved the correct verbose result");

                assert.strictEqual(this.oPrivhrefForExternalNoEncStub.getCall(0).args[0], oArgs, "called privhrefForExternalNoEnc with correct args");
            }.bind(this));
    });

    QUnit.test("Resolves a non-verbose result", function (assert) {
        // Arrange
        var oArgs = {};
        var oComponent = {};

        // Act
        return this.oHashChanger.hrefForExternalNoEncAsync(oArgs, false, oComponent)
            .then(function (sResult) {
                // Assert
                assert.deepEqual(sResult, "hash", "Resolved the correct result");
                assert.strictEqual(this.oPrivhrefForExternalNoEncStub.getCall(0).args[0], oArgs, "called privhrefForExternalNoEnc with correct args");
            }.bind(this));
    });

    QUnit.module("The functions getReloadApplication and setReloadApplication", {
        beforeEach: function () {
            this.oHashChanger = new ShellNavigationHashChanger();
        }
    });

    QUnit.test("flag behavior", function (assert) {
        // Act & Assert
        assert.strictEqual(this.oHashChanger.getReloadApplication(), false, "Initially set to false.");

        // Arrange
        this.oHashChanger.setReloadApplication(true);

        // Act & Assert
        assert.strictEqual(this.oHashChanger.getReloadApplication(), true, "Flag is now set to true.");

        // Arrange
        this.oHashChanger.setReloadApplication(false);

        // Act & Assert
        assert.strictEqual(this.oHashChanger.getReloadApplication(), false, "Flag is now set to false.");
    });
});
