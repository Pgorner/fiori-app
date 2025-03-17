// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.appRuntime.ui5.services.AppLifeCycleAgent
 */
sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/ui/thirdparty/URI",
    "sap/ushell/appRuntime/ui5/services/AppLifeCycleAgent",
    "sap/ushell/appRuntime/ui5/AppCommunicationMgr",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/resources",
    "sap/ushell/appRuntime/ui5/services/Container",
    "sap/ui/core/BusyIndicator"
], function (jQuery, URI, AppLifeCycleAgent, AppCommunicationMgr, AppRuntimeService, resources, Container, BusyIndicator) {
    "use strict";

    /* global sinon, QUnit */

    var sandbox = sinon.createSandbox({});

    QUnit.module("sap.ushell.test.appRuntime.ui5.services.AppLifeCycleAgent", {
        beforeEach: function (assert) {
            sandbox.stub(BusyIndicator, "show");
            sandbox.stub(BusyIndicator, "hide");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("test lifecycle basic flow", function (assert) {
        var done = assert.async();

        sandbox.stub(AppLifeCycleAgent, "getAppInfo").returns(new jQuery.Deferred().resolve({ test: 1 }).promise());

        var ofnCreateApplication = function (sStorageKey, appId, oAppInfo) {
            return new jQuery.Deferred().resolve({
                runtest: 1
            }).promise();
        };
        var oRouterObj = {
            initialize: sandbox.spy(),
            stop: sandbox.spy()
        };
        var oCompInst = {
            suspend: sandbox.spy(),
            restore: sandbox.spy(),
            getRouter: function () {
                return oRouterObj;
            },
            getId: function () { return "ABCD"; }
        };
        var oComponentMock = {
            setVisible: sandbox.spy(),
            getComponentInstance: function () {
                return oCompInst;
            }
        };
        var fnRenderApp = function (oResolutionResult) {
            AppLifeCycleAgent.setCurrentApp(oComponentMock);
        };
        AppLifeCycleAgent.init("", ofnCreateApplication, fnRenderApp);

        AppLifeCycleAgent.create({
               body: {
                   sUrl: "http://xxx.yyyy?sap-ui-app-id=testapp1"
               }}).then(function () {
            AppLifeCycleAgent.store({
                body: {
                    sCacheId: "storage1"
                }});
            assert.ok(oComponentMock.setVisible.args.length === 1, "set visible invoked once");
            assert.ok(oComponentMock.setVisible.args[0][0] === false, "after store is visibility is false");

            assert.ok(oCompInst.suspend.args.length === 1, "validate suspended called");
            assert.ok(oRouterObj.stop.args.length === 1, "validate router stopped");

            sandbox.stub(AppRuntimeService, "postMessageToFLP");
            AppLifeCycleAgent.restore({
                body: {
                    sCacheId: "storage1"
                }});

            assert.ok(oCompInst.restore.args.length === 1, "validate suspended called");
            assert.ok(oRouterObj.initialize.args.length === 1, "validate router stopped");

            assert.ok(oComponentMock.setVisible.args.length === 2, "set visible invoked once");
            assert.ok(oComponentMock.setVisible.args[1][0] === true, "after store is visibility is false");

            setTimeout(function () {
                assert.ok(AppRuntimeService.postMessageToFLP.calledOnce, "PostMessage Called Once");
                assert.ok(AppRuntimeService.postMessageToFLP.args[0][0] === "sap.ushell.services.AppLifeCycle.setNewAppInfo", "correct post mesage id");
                done();
            }, 1000);
        });
    });

    QUnit.test("test lifecycle multiple application flow", function (assert) {
        var done = assert.async();
        sandbox.stub(AppLifeCycleAgent, "getAppInfo").returns(new jQuery.Deferred().resolve({ test: 1 }).promise());

        var ofnCreateApplication = function (sStorageKey, appId, oAppInfo) {
            return new jQuery.Deferred().resolve({
                sStorageKey: sStorageKey
            }).promise();
        };
        var oRouterObj = {
            initialize: sandbox.spy(),
            stop: sandbox.spy()
        };
        var oCompInst = {
            suspend: sandbox.spy(),
            restore: sandbox.spy(),
            getRouter: function () {
                return oRouterObj;
            },
            getId: function () { return "ABCD"; }
        };
        var oComponentMock = {
            setVisible: sandbox.spy(),
            getComponentInstance: function () {
                return oCompInst;
            }
        };
        var fnRenderApp = function (oResolutionResult) {
            AppLifeCycleAgent.setCurrentApp(oComponentMock);
        };

        AppLifeCycleAgent.init("", ofnCreateApplication, fnRenderApp);

        AppLifeCycleAgent.create({
                body: {
                    sUrl: "http://xxx.yyyy?sap-ui-app-id=testapp1"
                }}).then(function () {
            AppLifeCycleAgent.store({
                body: {
                    sCacheId: "storage1"
                }});

            AppLifeCycleAgent.create({
                    body: {
                        sUrl: "http://xxx.yyyy?sap-ui-app-id=testapp2"
                    }}).then(function () {
                AppLifeCycleAgent.store({
                    body: {
                        sCacheId: "storage2"
                    }});
                assert.ok(oComponentMock.setVisible.args.length === 2, "set visible invoked once");
                assert.ok(oComponentMock.setVisible.args[0][0] === false, "after store is visibility first call invoked with false");
                assert.ok(oComponentMock.setVisible.args[1][0] === false, "after store is visibility secound call invoked with false");

                assert.ok(oCompInst.suspend.args.length === 2, "validate suspended called");
                assert.ok(oRouterObj.stop.args.length === 2, "validate router stopped");

                AppLifeCycleAgent.restore({
                    body: {
                        sCacheId: "storage1"
                    }});

                assert.ok(oCompInst.restore.args.length === 1, "validate suspended called");
                assert.ok(oRouterObj.initialize.args.length === 1, "validate router stopped");

                assert.ok(oComponentMock.setVisible.args.length === 3, "set visible invoked 3 times");
                assert.ok(oComponentMock.setVisible.args[0][0] === false, "after restore visibility 1 call is false");
                assert.ok(oComponentMock.setVisible.args[1][0] === false, "after store is visibility 2 call is false");
                assert.ok(oComponentMock.setVisible.args[2][0] === true, "after store is visibility 3 call is true");

                done();
            });
        });
    });

    [{
        name: "no parameters passed",
        input: {
            oAppInfo: { url: "/a/b/c" },
            oParams: new URI("?").query(true)
        },
        output: {
            oAppInfo: { url: "/a/b/c" }
        }
    }, {
        name: "simple list of parameters",
        input: {
            oAppInfo: { url: "/a/b/c" },
            oParams: new URI("?sap-startup-params=" + encodeURIComponent("a=1&b=2&c=3")).query(true)
        },
        output: {
            oAppInfo: { url: "/a/b/c?a=1&b=2&c=3" }
        }
    }, {
        name: "sap-intent-param single parameter",
        input: {
            oAppInfo: { url: "/a/b/c" },
            oParams: new URI("?sap-startup-params=" + encodeURIComponent("sap-intent-param=abcd")).query(true),
            appState: { abcd: "x=1&y=2&z=3" }
        },
        output: {
            oAppInfo: { url: "/a/b/c?x=1&y=2&z=3" }
        }
    }, {
        name: "simple parameters with sap-intent-param",
        input: {
            oAppInfo: { url: "/a/b/c" },
            oParams: new URI("?sap-startup-params=" + encodeURIComponent("a=1&sap-intent-param=abcd&b=2")).query(true),
            appState: { abcd: "x=1&y=2&z=3" }
        },
        output: {
            oAppInfo: { url: "/a/b/c?a=1&b=2&x=1&y=2&z=3" }
        }
    }].forEach(function (oFixture) {
        QUnit.test("getApplicationParameters - " + oFixture.name, function (assert) {
            var done = assert.async();
            sandbox.stub(AppRuntimeService, "postMessageToFLP").callsFake(
                function (sMessageId, oParams) {
                    return Promise.resolve(oFixture.input.appState[oParams.sAppStateKey]);
                });

            AppLifeCycleAgent.getApplicationParameters(oFixture.input.oParams).then(function (result) {
                if (result) {
                    assert.ok(oFixture.input.oAppInfo.url + result === oFixture.output.oAppInfo.url, "getApplicationParameters - parameters were successfully set in the URL");
                } else {
                    assert.ok(oFixture.input.oAppInfo.url === oFixture.output.oAppInfo.url, "getApplicationParameters - parameters were successfully set in the URL");
                }
                done();
            }, function () {
                assert.ok(false, "setApplicationParameters - parameters were NOT properly set in the URL");
                done();
            });
        });
    });

    [{
        name: "no parameters",
        urlIn: "http://www.a.com",
        paramsOut: new URI("?").query(true)
    }, {
        name: "simple parameters",
        urlIn: "http://www.a.com?a=1&b=2&c=3&d=4",
        paramsOut: new URI("?a=1&b=2&c=3&d=4").query(true)
    }, {
        name: "sap-intent-param single parameter",
        urlIn: "http://www.a.com?sap-intent-param=abcd",
        paramsOut: new URI("?a=1&b=2&c=3&d=4").query(true),
        appState: { abcd: "a=1&b=2&c=3&d=4" }
    }, {
        name: "sap-intent-param with other params",
        urlIn: "http://www.a.com?sap-intent-param=abcd&x=1&y=2",
        paramsOut: new URI("?a=1&b=2&c=3&d=4&x=1&y=2").query(true),
        appState: { abcd: "a=1&b=2&c=3&d=4" }
    }].forEach(function (oFixture) {
        QUnit.test("expandSapIntentParams - " + oFixture.name, function (assert) {
            const done = assert.async();
            sandbox.stub(AppRuntimeService, "postMessageToFLP").callsFake(function (sName, sKey) {
                if (sName === "sap.ushell.services.CrossApplicationNavigation.getAppStateData") {
                    return Promise.resolve(oFixture.appState[sKey.sAppStateKey]);
                }
                return Promise.resolve();
            });
            AppLifeCycleAgent.expandSapIntentParams(new URI(oFixture.urlIn).query(true)).then(function (oUrlParameters) {
                assert.deepEqual(oFixture.paramsOut, oUrlParameters, "parameters are the same");
                done();
            });
        });
    });

    QUnit.test("on unload with data loss", function (assert) {
        AppLifeCycleAgent.init("", Function.prototype, Function.prototype);

        //not dirty
        sandbox.stub(Container, "getDirtyFlag").returns(false);
        assert.strictEqual(window.onbeforeunload(), undefined, "not dirty");

        //dirty
        Container.getDirtyFlag.restore();
        sandbox.stub(Container, "getDirtyFlag").returns(true);
        assert.strictEqual(window.onbeforeunload(), resources.browserI18n.getText("dataLossExternalMessage"), "dirty");
    });

    QUnit.test("test full appruntime setup", function (assert) {
        const oOldConfig = window["sap-ushell-config"];

        window["sap-ushell-config"] = {
            ui5appruntime: {
                config: {}
            }
        };

        sandbox.stub(AppRuntimeService, "postMessageToFLP");
        AppLifeCycleAgent._sendAppRuntimeSetup();

        assert.ok(AppRuntimeService.postMessageToFLP.calledOnce, "PostMessage Called Once");
        assert.strictEqual(AppRuntimeService.postMessageToFLP.args[0][0], "sap.ushell.services.appLifeCycle.setup", "correct post mesage id");
        assert.deepEqual(AppRuntimeService.postMessageToFLP.args[0][1], {
            isStateful: true,
            isKeepAlive: true,
            isIframeValid: true,
            session: {
                bLogoutSupport: true
            }
        }, "correct setup");

        if (oOldConfig) {
            window["sap-ushell-config"] = oOldConfig;
        } else {
            delete window["sap-ushell-config"];
        }
    });

    QUnit.test("test minimal appruntime setup", function (assert) {
        const oOldConfig = window["sap-ushell-config"];

        window["sap-ushell-config"] = {
            ui5appruntime: {
                config: {
                    stateful: false
                }
            }
        };

        sandbox.stub(AppRuntimeService, "postMessageToFLP");
        AppLifeCycleAgent._sendAppRuntimeSetup();

        assert.ok(AppRuntimeService.postMessageToFLP.calledOnce, "PostMessage Called Once");
        assert.strictEqual(AppRuntimeService.postMessageToFLP.args[0][0], "sap.ushell.services.appLifeCycle.setup", "correct post mesage id");
        assert.deepEqual(AppRuntimeService.postMessageToFLP.args[0][1], {
            session: {
                bLogoutSupport: true
            }
        }, "correct setup");

        if (oOldConfig) {
            window["sap-ushell-config"] = oOldConfig;
        } else {
            delete window["sap-ushell-config"];
        }
    });
});
