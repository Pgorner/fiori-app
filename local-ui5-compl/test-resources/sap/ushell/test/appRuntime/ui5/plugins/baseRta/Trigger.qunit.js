// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/* global QUnit */

// eslint-disable-next-line no-unused-expressions
window.blanket && window.blanket.options("sap-ui-cover-only", "[sap/ushell/plugins]");

sap.ui.define([
    "sap/ushell/appRuntime/ui5/plugins/baseRta/BaseRTAPluginStatus",
    "sap/ushell/appRuntime/ui5/plugins/baseRta/AppLifeCycleUtils",
    "sap/ushell/appRuntime/ui5/plugins/baseRta/CheckConditions",
    "sap/ushell/appRuntime/ui5/plugins/baseRta/Trigger",
    "sap/ushell/appRuntime/ui5/plugins/baseRta/Renderer",
    "sap/ushell/plugin/utils/TestUtil",
    "sap/ui/core/BusyIndicator",
    "sap/ui/core/EventBus",
    "sap/ui/core/Lib",
    "sap/ui/thirdparty/sinon-4"
], function (
    PluginStatus,
    AppLifeCycleUtils,
    CheckConditions,
    Trigger,
    Renderer,
    TestUtil,
    BusyIndicator,
    EventBus,
    Lib,
    sinon
) {
    "use strict";

    var STATUS_STARTING = PluginStatus.STATUS_STARTING;
    var STATUS_STARTED = PluginStatus.STATUS_STARTED;
    var STATUS_STOPPING = PluginStatus.STATUS_STOPPING;
    var STATUS_STOPPED = PluginStatus.STATUS_STOPPED;

    var sandbox = sinon.sandbox.create();

    QUnit.module("Start/stop phases", {
        beforeEach: function () {
            sandbox.stub(AppLifeCycleUtils, "getContainer").returns({
                getServiceAsync: function (sService) {
                    var oService;
                    if (sService === "AppLifeCycle") {
                        oService = {
                            attachAppLoaded: function () { },
                            detachAppLoaded: function () { },
                            getHash: function () { }
                        };
                    } else if (sService === "URLParsing") {
                        oService = {
                            parseShellHash: function () {
                                return {
                                    semanticObject: undefined,
                                    action: undefined,
                                    contextRaw: undefined,
                                    params: {},
                                    appSpecificRoute: undefined
                                };
                            }
                        };
                    }
                    return Promise.resolve(oService);
                },
                registerDirtyStateProvider: function () { }
            });
            sandbox.stub(CheckConditions, "checkUI5App").resolves(true);
            sandbox.stub(AppLifeCycleUtils, "getCurrentRunningApplication").resolves({
                componentInstance: {
                    getAggregation: function () { }
                }
            });
            sandbox.stub(Trigger.prototype, "_startRta").callsFake(function () {
                return new Promise(function (fnResolve) {
                    this.sStatus = STATUS_STARTING;
                    setTimeout(function () {
                        this.sStatus = STATUS_STARTED;
                        fnResolve();
                    }.bind(this), 16);
                }.bind(this));
            });
            sandbox.stub(Trigger.prototype, "_stopRta").callsFake(function () {
                this.sStatus = STATUS_STOPPING;
                return new Promise(function (fnResolve) {
                    setTimeout(function () {
                        this.sStatus = STATUS_STOPPED;
                        fnResolve();
                    }.bind(this), 16);
                }.bind(this));
            });

            var mConfig = {
                loadPlugins: function () { },
                onStartHandler: function () { },
                onErrorHandler: function () { },
                onStopHandler: function () { }
            };

            this.oTrigger = new Trigger(mConfig);
            return this.oTrigger.getInitPromise();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });
    // ---------------------------------- _startRta() ----------------------------------
    QUnit.test("_startRta() with initial status '" + STATUS_STARTING + "'", function (assert) {
        this.oTrigger.triggerStartRta();
        assert.equal(this.oTrigger.sStatus, STATUS_STARTING, "initial status is '" + STATUS_STARTING + "'");
        var oStartingPromise = this.oTrigger.oStartingPromise;
        this.oTrigger.triggerStartRta();
        assert.equal(this.oTrigger.sStatus, STATUS_STARTING, "status is '" + STATUS_STARTING + "'");
        assert.ok(oStartingPromise === this.oTrigger.oStartingPromise, "starting Promise should be referentially same object");
        return this.oTrigger.oStartingPromise.then(function () {
            assert.equal(this.oTrigger.oStartingPromise, null, "starting Promise was cleaned properly");
        }.bind(this));
    });

    QUnit.test("_startRta() with initial status '" + STATUS_STARTED + "'", function (assert) {
        return this.oTrigger.triggerStartRta().then(function () {
            assert.equal(this.oTrigger.sStatus, STATUS_STARTED, "initial status is '" + STATUS_STARTED + "'");
            var fnPromiseResolve = sandbox.spy(Promise, "resolve");
            var oAfterStart = this.oTrigger.triggerStartRta().then(function () {
                assert.equal(this.oTrigger.oStartingPromise, null, "starting Promise was cleaned properly");
            }.bind(this));
            assert.ok(this.oTrigger.oStartingPromise instanceof Promise, "starting Promise is a Promise");
            assert.ok(fnPromiseResolve.calledOnce, "starting Promise is Promise.resolve()");
            return oAfterStart;
        }.bind(this));
    });

    QUnit.test("_startRta() with initial status '" + STATUS_STOPPING + "'", function (assert) {
        return this.oTrigger.triggerStartRta().then(function () {
            this.oTrigger.triggerStopRta();
            assert.equal(this.oTrigger.sStatus, STATUS_STOPPING, "initial status is '" + STATUS_STOPPING + "'");
            var spy1 = sandbox.spy();
            var spy2 = sandbox.spy();
            this.oTrigger.oStoppingPromise.then(spy1);
            return this.oTrigger.triggerStartRta().then(function () {
                spy2();
                assert.ok(spy1.calledBefore(spy2), "start should wait until stop is done");
                assert.equal(this.oTrigger.oStartingPromise, null, "starting Promise was cleaned properly");
            }.bind(this));
        }.bind(this));
    });

    QUnit.test("_startRta() with initial status '" + STATUS_STOPPED + "'", function (assert) {
        assert.equal(this.oTrigger.sStatus, STATUS_STOPPED, "initial status is '" + STATUS_STOPPED + "'");
        this.oTrigger.triggerStartRta();
        assert.ok(this.oTrigger.oStartingPromise instanceof Promise, "starting Promise is created");
        assert.equal(this.oTrigger.sStatus, STATUS_STARTING, "status changed to '" + STATUS_STARTING + "'");

        return this.oTrigger.oStartingPromise.then(function () {
            assert.equal(this.oTrigger.sStatus, STATUS_STARTED, "status changed to '" + STATUS_STARTED + "'");
            assert.equal(this.oTrigger.oStartingPromise, null, "starting Promise was cleaned properly");
        }.bind(this));
    });

    // ---------------------------------- _stopRta() ----------------------------------
    QUnit.test("_stopRta() with initial status '" + STATUS_STARTING + "'", function (assert) {
        this.oTrigger.triggerStartRta();
        assert.equal(this.oTrigger.sStatus, STATUS_STARTING, "initial status is '" + STATUS_STARTING + "'");
        var spy1 = sandbox.spy();
        var spy2 = sandbox.spy();
        this.oTrigger.oStartingPromise.then(spy1);
        this.oTrigger.triggerStopRta();
        return this.oTrigger.oStoppingPromise.then(function () {
            spy2();
            assert.ok(spy1.calledBefore(spy2), "stop should wait until start is done");
            assert.equal(this.oTrigger.oStoppingPromise, null, "stopping Promise was cleaned properly");
        }.bind(this));
    });

    QUnit.test("_stopRta() with initial status '" + STATUS_STARTED + "'", function (assert) {
        return this.oTrigger.triggerStartRta().then(function () {
            assert.equal(this.oTrigger.sStatus, STATUS_STARTED, "initial status is '" + STATUS_STARTED + "'");
            var oAfterStop = this.oTrigger.triggerStopRta().then(function () {
                assert.equal(this.oTrigger.oStoppingPromise, null, "stopping Promise was cleaned properly");
            }.bind(this));
            assert.ok(this.oTrigger.oStoppingPromise instanceof Promise, "stopping Promise is created");
            assert.equal(this.oTrigger.sStatus, STATUS_STOPPING, "status changed to '" + STATUS_STOPPING + "'");
            return oAfterStop;
        }.bind(this));
    });

    QUnit.test("_stopRta() with initial status '" + STATUS_STOPPING + "'", function (assert) {
        return this.oTrigger.triggerStartRta().then(function () {
            this.oTrigger.triggerStopRta();
            assert.equal(this.oTrigger.sStatus, STATUS_STOPPING, "initial status is '" + STATUS_STOPPING + "'");
            var oStoppingPromise = this.oTrigger.oStoppingPromise;
            var oAfterStop = this.oTrigger.triggerStopRta().then(function () {
                assert.equal(this.oTrigger.oStoppingPromise, null, "stopping Promise was cleaned properly");
            }.bind(this));
            assert.equal(this.oTrigger.sStatus, STATUS_STOPPING, "status is '" + STATUS_STOPPING + "'");
            assert.ok(oStoppingPromise === this.oTrigger.oStoppingPromise, "stopping Promise should be referentially same object");
            return oAfterStop;
        }.bind(this));
    });

    QUnit.test("_stopRta() with initial status '" + STATUS_STOPPED + "'", function (assert) {
        assert.equal(this.oTrigger.sStatus, STATUS_STOPPED, "initial status is '" + STATUS_STOPPED + "'");
        var fnPromiseResolve = sandbox.spy(Promise, "resolve");
        var oAfterStop = this.oTrigger.triggerStopRta().then(function () {
            assert.equal(this.oTrigger.oStoppingPromise, null, "stopping Promise was cleaned properly");
        }.bind(this));
        assert.ok(this.oTrigger.oStoppingPromise instanceof Promise, "stopping Promise is a Promise");
        assert.ok(fnPromiseResolve.calledOnce, "stopping Promise is Promise.resolve()");
        return oAfterStop;
    });

    QUnit.module("Given a application that is of type UI5", {
        beforeEach: function () {
            var oContainer = TestUtil.createContainerObject.call(this, "UI5");
            sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
            var mConfig = {
                layer: "CUSTOMER",
                developerMode: false,
                i18n: {
                    getText: function (sName) {
                        return sName;
                    }
                },
                loadPlugins: function () { },
                onStartHandler: function () { },
                onErrorHandler: function () { },
                onStopHandler: function () { }
            };

            this.oTrigger = new Trigger(mConfig);
            return this.oTrigger.getInitPromise();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("when _startRta() is called and RTA start throwing an error'", function (assert) {
        sandbox.stub(Lib, "load").returns(Promise.resolve());
        sandbox.stub(sap.ui, "require")
            .withArgs(["sap/ui/rta/api/startAdaptation"])
            .callsArgWithAsync(1, function () {
                return Promise.reject({});
            });
        var oErrorHandler = sandbox.stub(this.oTrigger.mConfig, "onErrorHandler");

        return this.oTrigger._startRta()
            .then(function () {
                assert.strictEqual(oErrorHandler.callCount, 0, "the error handler was not called");
            });
    });

    QUnit.test("when _startRta() is called and RTA start throwing an 'flexEnabled' error'", function (assert) {
        sandbox.stub(Lib, "load").returns(Promise.resolve());
        sandbox.stub(sap.ui, "require")
            .withArgs(["sap/ui/rta/api/startAdaptation"])
            .callsArgWithAsync(1, function () {
                return Promise.reject({ reason: "flexEnabled" });
            });
        var oHandleFlexDisabled = sandbox.stub(this.oTrigger, "handleFlexDisabledOnStart");
        var oErrorHandler = sandbox.stub(this.oTrigger.mConfig, "onErrorHandler");

        return this.oTrigger._startRta()
            .then(function () {
                assert.strictEqual(oErrorHandler.callCount, 0, "the error handler was not called");
                assert.strictEqual(oHandleFlexDisabled.callCount, 1, "the flex disabled handler was called");
                assert.strictEqual(this.oTrigger.sStatus, PluginStatus.STATUS_STOPPED, "the trigger sets the plugin status to 'stopped'");
            }.bind(this));
    });

    QUnit.test("when _startRta() is called and RTA start throwing an 'Reload triggered' error'", function (assert) {
        sandbox.stub(Lib, "load").returns(Promise.resolve());
        sandbox.stub(sap.ui, "require")
            .withArgs(["sap/ui/rta/api/startAdaptation"])
            .callsArgWithAsync(1, function () {
                return Promise.reject("Reload triggered");
            });
        var oHandleFlexDisabled = sandbox.stub(this.oTrigger, "handleFlexDisabledOnStart");
        var oErrorHandler = sandbox.stub(this.oTrigger.mConfig, "onErrorHandler");

        return this.oTrigger._startRta()
            .then(function () {
                assert.strictEqual(oErrorHandler.callCount, 0, "the error handler was not called");
                assert.strictEqual(oHandleFlexDisabled.callCount, 0, "the flex disabled handler was not called");
                assert.strictEqual(this.oTrigger.sStatus, STATUS_STOPPED, "status changed to '" + STATUS_STOPPED + "'");
            }.bind(this));
    });

    [true, false].forEach(function (bErrorInstance) {
        var sText = "when RTA fires a failed event ";
        sText += bErrorInstance ? "with an error instance" : "with a string as error";
        QUnit.test(sText, function (assert) {
            var oUtilsStub = sandbox.stub().returns("myStyleClass");
            var oMessageBoxStub = sandbox.stub();
            sandbox.stub(sap.ui, "require").callsFake(function (aModules, fnCallback) {
                if (
                    aModules.length && aModules.length === 2
                    && aModules[0] === "sap/ui/rta/Utils"
                    && aModules[1] === "sap/m/MessageBox"
                ) {
                    return fnCallback({ getRtaStyleClassName: oUtilsStub }, { error: oMessageBoxStub });
                }
                return sap.ui.require.wrappedMethod.apply(this, arguments);
            });
            var oBusySpy = sandbox.spy(BusyIndicator, "hide");
            var oHandleFlexDisabled = sandbox.stub(this.oTrigger, "handleFlexDisabledOnStart");
            var oErrorHandler = sandbox.stub(this.oTrigger.mConfig, "onErrorHandler");

            var oError = bErrorInstance ? Error("myFancyError") : "myText";
            var sExpectedMessage = bErrorInstance ? "TECHNICAL_ERROR" : "myText";
            this.oTrigger._onRtaFailed({
                getParameter: function () { return oError; },
                getSource: function () { return "foo"; }
            });
            assert.strictEqual(oUtilsStub.callCount, 1, "the rta utils was called");
            assert.strictEqual(oMessageBoxStub.callCount, 1, "the message box error function was called");
            assert.strictEqual(oMessageBoxStub.lastCall.args[0], sExpectedMessage, "the correct message was passed");
            assert.strictEqual(oMessageBoxStub.lastCall.args[1].title, "ERROR_TITLE", "the correct title was passed");
            assert.strictEqual(oMessageBoxStub.lastCall.args[1].styleClass, "myStyleClass", "the correct style class was passed");
            assert.strictEqual(oErrorHandler.callCount, 1, "the error handler was called");
            assert.strictEqual(oBusySpy.callCount, 1, "the busy indicator is hidden");
            assert.strictEqual(this.oTrigger._oRTA, "foo", "the source of the event is set as rta");
            assert.strictEqual(oHandleFlexDisabled.callCount, 0, "the flex disabled handler was not called");
        });
    });

    QUnit.test("when _triggerStartRta is called", function (assert) {
        sandbox.stub(BusyIndicator, "show").callsFake(function () {
            assert.ok(true, "BusyIndicator is shown");
        });

        sandbox.stub(BusyIndicator, "hide").callsFake(function () {
            assert.ok(true, "BusyIndicator is hidden again");
        });

        var oRtaStub = function (mPropertyBag, loadPlugins, onStart, onFailed, onStop) {
            this.rootControl = mPropertyBag.rootControl;
            this.flexSettings = mPropertyBag.flexSettings;
            assert.ok(typeof loadPlugins === "function", "then function for loadPlugins is passed");
            assert.ok(typeof onStart === "function", "then function for onStart is passed");
            assert.ok(typeof onFailed === "function", "then function for onFailed is passed");
            assert.ok(typeof onStop === "function", "then function for onStop is passed");
            return Promise.resolve({ test: "startAdaptationTest" });
        }.bind(this);

        sandbox.stub(Lib, "load").returns(Promise.resolve());
        var oRequireStub = sandbox.stub(sap.ui, "require");
        oRequireStub.withArgs(["sap/ui/rta/api/startAdaptation"]).callsArgWithAsync(1, oRtaStub);

        return this.oTrigger._startRta().then(function () {
            assert.strictEqual(this.oTrigger._oRTA.test, "startAdaptationTest", "then the rta instance is attached to the trigger");
            assert.equal(this.rootControl.getId(), "root", "the root Control is correct");
            assert.equal(this.flexSettings.layer, this.oTrigger.mConfig.layer, "the layer is correct");
            assert.equal(this.flexSettings.developerMode, this.oTrigger.mConfig.developerMode, "the developerMode is correct");
        }.bind(this));
    });

    function prepareRtaStart () {
        sandbox.stub(BusyIndicator, "show");
        sandbox.stub(BusyIndicator, "hide");
        var oRtaStub = function () {
            return Promise.resolve();
        };
        var oStopStub = sandbox.stub(Trigger.prototype, "triggerStopRta");

        sandbox.stub(Lib, "load").returns(Promise.resolve());
        var oRequireStub = sandbox.stub(sap.ui, "require");
        oRequireStub.withArgs(["sap/ui/rta/api/startAdaptation"]).callsArgWithAsync(1, oRtaStub);
        return oStopStub;
    }

    QUnit.test("when _triggerStart was called and an 'appClosed' event is published", function (assert) {
        var oStopStub = prepareRtaStart();
        return this.oTrigger._startRta(this.oPlugin, "root").then(function () {
            EventBus.getInstance().publish("sap.ushell.renderers.fiori2.Renderer", "appClosed");
            assert.ok(oStopStub.called, "the event triggered _stopRta to be called");
        });
    });

    QUnit.test("when _triggerStart was called and an 'appKeepAliveDeactivate' event is published", function (assert) {
        var oStopStub = prepareRtaStart();
        return this.oTrigger._startRta(this.oPlugin, "root").then(function () {
            EventBus.getInstance().publish("sap.ushell", "appKeepAliveDeactivate");
            assert.ok(oStopStub.called, "the event triggered _stopRta to be called");
        });
    });

    QUnit.test("when _triggerStopRta is called", function (assert) {
        this.oTrigger._oRTA = {
            destroy: function () {
                assert.ok(true, "RTA destroy is called");
            },
            stop: function () {
                return Promise.resolve();
            }
        };
        var oEventBusSpy = sandbox.spy(EventBus.getInstance(), "unsubscribe");

        return this.oTrigger._stopRta().then(function () {
            assert.equal(this.oTrigger.sStatus, STATUS_STOPPED, "the status is set to stopped");
            assert.notOk(this.oTrigger.oStartingPromise, "the promises got cleaned up");
            assert.notOk(this.oTrigger.oStoppingPromise, "the promises got cleaned up");
            assert.equal(this.oTrigger._oRTA, null, "the variable got reset to null");
            assert.equal(oEventBusSpy.callCount, 2, "two events got unsubscribed");
            assert.equal(oEventBusSpy.firstCall.args[1], "appClosed", "the appClosed event got unsubscribed");
            assert.equal(oEventBusSpy.lastCall.args[1], "appKeepAliveDeactivate", "the appKeepAliveDeactivate event got unsubscribed");
        }.bind(this));
    });

    QUnit.test("when navigation is happening", function (assert) {
        sandbox.stub(this.oTrigger.oURLParsingService, "parseShellHash")
            .callsFake(function (oReturn) {
                return oReturn || {
                    semanticObject: "a",
                    action: "b",
                    appSpecificRoute: "c"
                };
            });
        this.oTrigger._bDirtyState = true;

        assert.notOk(this.oTrigger._dirtyStateProvider(), "without RTA available dirty state is never set");

        this.oTrigger._oRTA = {
            canSave: function () {
                return true;
            }
        };
        assert.notOk(this.oTrigger._dirtyStateProvider(), "without RTA started dirty state is never set");

        this.oTrigger.sStatus = STATUS_STARTED;
        this.oTrigger.sOldHash = {
            semanticObject: "a",
            action: "b",
            appSpecificRoute: "d"
        };
        assert.notOk(this.oTrigger._dirtyStateProvider(), "with in-app navigation dirty state is not set");

        this.oTrigger.sOldHash = {
            semanticObject: "a",
            action: "e",
            appSpecificRoute: "c"
        };
        assert.ok(this.oTrigger._dirtyStateProvider(), "with cross-app navigation dirty state is set");

        this.oTrigger.sOldHash = {
            semanticObject: "e",
            action: "b",
            appSpecificRoute: "c"
        };
        assert.ok(this.oTrigger._dirtyStateProvider(), "with cross-app navigation dirty state is set");

        this.oTrigger.sOldHash = {
            semanticObject: "a",
            action: "b",
            appSpecificRoute: "c"
        };
        assert.ok(this.oTrigger._dirtyStateProvider(), "with in-app navigation but no change in appSpecificRoute dirty state is set");
    });

    QUnit.test("when handleFlexDisabledOnStart is called", function (assert) {
        var oMessageBoxStub = {
            Action: {
                OK: "myOk"
            },
            Icon: {
                INFORMATION: "myInfo"
            }
        };
        var oShowMessageBoxStub = sandbox.stub();
        sandbox.stub(sap.ui, "require").callsFake(function (aModules, fnCallback) {
            if (
                aModules.length && aModules.length === 2
                && aModules[0] === "sap/ui/rta/util/showMessageBox"
                && aModules[1] === "sap/m/MessageBox"
            ) {
                fnCallback(oShowMessageBoxStub, oMessageBoxStub);
                return undefined;
            }
            return sap.ui.require.wrappedMethod.apply(this, arguments);
        });
        this.oTrigger.handleFlexDisabledOnStart();

        var oExpectedObject = {
            icon: "myInfo",
            title: "HEADER_FLEX_DISABLED",
            actions: ["myOk"],
            initialFocus: null,
            isCustomAction: false
        };
        assert.strictEqual(oShowMessageBoxStub.callCount, 1, "the util to show the messagebox was called");
        assert.strictEqual(oShowMessageBoxStub.getCall(0).args[0], "MSG_FLEX_DISABLED", "the first argument is a i18n key");
        assert.deepEqual(oShowMessageBoxStub.getCall(0).args[1], oExpectedObject, "the second argument is the object with information for the MessageBox");
    });
});
