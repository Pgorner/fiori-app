// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.performance.ShellAnalytics
 */
sap.ui.define([
    "sap/ushell/EventHub",
    "sap/ushell/performance/ShellAnalytics",
    "sap/ushell/services/AppConfiguration",
    "sap/ushell/services/AppLifeCycle",
    "sap/ushell/Container",
    "sap/ushell/utils"
], function (EventHub, ShellAnalytics, AppConfiguration, AppLifeCycle, Container, ushellUtils) {
    "use strict";

    /* global QUnit, sinon */

    const ApplicationType = AppLifeCycle.prototype.ApplicationType;

    const sandbox = sinon.sandbox.create();
    let oCurrentApplication = null;

    async function emitEventHubAndWait (sEvent, value, iTimeout = 10) {
        EventHub.emit(sEvent, value);
        await new Promise((fnResolve) => {
            EventHub.once(sEvent).do(fnResolve);
        });
        // EventHub might take additional ticks for other listeners to be processed
        if (iTimeout) {
            await new Promise((fnResolve) => {
                setTimeout(fnResolve, iTimeout);
            });
        }
    }

    QUnit.module("Initialization of ShellAnalytics", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.aOffCallbacks = [];
            this.oDoableMock = {
                do: sandbox.stub().callsFake(() => {
                    const fnCallback = sandbox.stub();
                    this.aOffCallbacks.push(fnCallback);
                    return {
                        off: fnCallback
                    };
                })
            };
            this.oEventHubOnStub = sandbox.stub(EventHub, "on").returns(this.oDoableMock);
            this.oEventHubOnceStub = sandbox.stub(EventHub, "once").returns(this.oDoableMock);

            this.hashChanger = {
                detachEvent: sandbox.stub(),
                attachEvent: sandbox.stub()
            };

            this.oGetServiceAsyncStub.withArgs("ShellNavigationInternal").resolves({
                hashChanger: this.hashChanger
            });
        },
        afterEach: function () {
            sandbox.restore();
            ShellAnalytics.disable();
            EventHub._reset();
        }
    });

    QUnit.test("Subscribe to EventHub when ShellAnalytics is enabled", function (assert) {
        // Act
        ShellAnalytics.enable();
        // Assert
        assert.strictEqual(this.oEventHubOnceStub.withArgs("ShellNavigationInitialized").callCount, 1, "ShellNavigationInitialized was registered once");
        assert.strictEqual(this.oEventHubOnceStub.withArgs("firstSegmentCompleteLoaded").callCount, 1, "firstSegmentCompleteLoaded was registered once");
        assert.strictEqual(this.oEventHubOnceStub.withArgs("firstCatalogSegmentCompleteLoaded").callCount, 1, "firstCatalogSegmentCompleteLoaded was registered once");
        assert.strictEqual(this.oEventHubOnceStub.withArgs("PagesRuntimeRendered").callCount, 1, "PagesRuntimeRendered was registered once");
        assert.strictEqual(this.oEventHubOnceStub.withArgs("CustomHomeRendered").callCount, 1, "CustomHomeRendered was registered once");

        assert.strictEqual(this.oEventHubOnStub.withArgs("trackHashChange").callCount, 1, "trackHashChange was registered");
        assert.strictEqual(this.oEventHubOnStub.withArgs("doHashChangeError").callCount, 1, "doHashChangeError was registered");
        assert.strictEqual(this.oEventHubOnStub.withArgs("PageRendered").callCount, 1, "PageRendered was registered");
        assert.strictEqual(this.oEventHubOnStub.withArgs("FESRAppLoaded").callCount, 1, "FESRAppLoaded was registered");
        assert.strictEqual(this.oEventHubOnStub.withArgs("openedAppInNewWindow").callCount, 1, "openedAppInNewWindow was registered");
        assert.strictEqual(this.oEventHubOnStub.withArgs("CloseFesrRecord").callCount, 1, "CloseFesrRecord was registered");
    });

    QUnit.test("All EventHub events should be off when disable the analytics", function (assert) {
        // Arrange
        ShellAnalytics.enable();
        // Act
        ShellAnalytics.disable();
        // Assert
        assert.strictEqual(this.aOffCallbacks.length, 11, "11 callbacks were saved");
        const iCallbackCount = this.aOffCallbacks.reduce((iCount, oCallbackStub) => {
            iCount += oCallbackStub.callCount;
            return iCount;
        }, 0);
        assert.strictEqual(iCallbackCount, 11, "All callbacks were called");
    });

    QUnit.test("Enable shall subscribe only once", function (assert) {
        // Arrange
        ShellAnalytics.enable();
        // Assert #1
        assert.strictEqual(this.oEventHubOnStub.callCount, 6, "ShellAnalytics listens 6 EventHub events");
        assert.strictEqual(this.oEventHubOnceStub.callCount, 5, "ShellAnalytics listens once 5 EventHub event");
        // Act
        ShellAnalytics.enable();
        // Assert #2
        assert.strictEqual(this.oEventHubOnStub.callCount, 6, "ShellAnalytics should not subscribe to EventHub again");
        assert.strictEqual(this.oEventHubOnceStub.callCount, 5, "ShellAnalytics should not subscribe to EventHub again");
    });

    QUnit.test("_attachHashChangeListener is called when ShellNavigationInitialized", async function (assert) {
        // Arrange
        this.oEventHubOnStub.restore();
        this.oEventHubOnceStub.restore();
        // Act
        ShellAnalytics.enable();
        await emitEventHubAndWait("ShellNavigationInitialized", true);
        // Assert
        assert.ok(this.hashChanger.attachEvent.calledTwice, "ShellAnalytics is attached to the hasher events");
    });

    QUnit.test("_detachHashChangeListener is called when ShellAnalytics is disabled", async function (assert) {
        // Arrange
        this.oEventHubOnceStub.restore();
        this.oEventHubOnStub.restore();
        ShellAnalytics.enable();
        await emitEventHubAndWait("ShellNavigationInitialized", true);
        // Act
        ShellAnalytics.disable();
        // Assert
        setTimeout(() => {
            assert.ok(this.hashChanger.attachEvent.calledTwice, "ShellAnalytics is attached to the hasher events");
            assert.ok(this.hashChanger.detachEvent.calledTwice, "ShellAnalytics is detached to the hasher events");
        }, 0);
    });

    QUnit.module("Steps in ShellAnalytics", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oGetServiceAsyncStub.withArgs("AppLifeCycle").resolves({
                getCurrentApplication: sandbox.stub().callsFake(() => oCurrentApplication),
                ApplicationType: ApplicationType
            });

            this.oGetServiceAsyncStub.withArgs("ShellNavigationInternal").resolves({
                hashChanger: {
                    detachEvent: sandbox.stub(),
                    attachEvent: sandbox.stub()
                }
            });

            ShellAnalytics.enable();
        },
        afterEach: function () {
            sandbox.restore();
            ShellAnalytics.disable();
            EventHub._reset();
            oCurrentApplication = null;
        }
    });

    QUnit.test("Create a Record with status open", async function (assert) {
        // Act
        await emitEventHubAndWait("trackHashChange", "#Shell-home");
        // Assert
        const aRecords = ShellAnalytics.getAllRecords();
        assert.strictEqual(aRecords.length, 1, "Added one record");
        const oFirstRecord = aRecords[0];
        assert.strictEqual(oFirstRecord.isClosed(), false, "Record is not closed");
        assert.strictEqual(oFirstRecord.getTargetHash(), "#Shell-home", "Record has correct targetHash");
        assert.strictEqual(!!oFirstRecord.getTimeStart(), true, "Record has start time");
    });

    QUnit.test("Step FLP@DURING_LOAD", async function (assert) {
        // Arrange
        oCurrentApplication = {
            homePage: true
        };
        // Act
        await emitEventHubAndWait("trackHashChange", "#Shell-home");
        await emitEventHubAndWait("FESRAppLoaded", Date.now());
        await emitEventHubAndWait("trackHashChange", "#Action-toAppNavSample");
        // Assert
        const aRecords = ShellAnalytics.getAllRecords();
        assert.strictEqual(aRecords.length, 2, "shell analytics called for homepage and application");
        const oFirstRecord = aRecords[0];
        const oSecondRecord = aRecords[1];

        assert.strictEqual(oFirstRecord.getTargetHash(), "#Shell-home", "Record has correct targetHash");
        assert.strictEqual(!!oFirstRecord.getTimeStart(), true, "Record has start time");
        assert.strictEqual(!!oFirstRecord.getTimeEnd(), true, "Record has end time");
        assert.strictEqual(oFirstRecord.getStep(), "FLP@DURING_LOAD", "Record has correct step");
        assert.strictEqual(oFirstRecord.isClosed(), true, "Record is closed");

        assert.strictEqual(oSecondRecord.isClosed(), false, "Record is not closed");
    });

    QUnit.test("Step A2A@xxx", async function (assert) {
        // Arrange
        oCurrentApplication = {
            applicationType: "UI5",
            getTechnicalParameter: sandbox.stub().resolves(["F123"])
        };
        // Act
        await emitEventHubAndWait("trackHashChange", "#Action-toAppNavSample");
        await emitEventHubAndWait("FESRAppLoaded", Date.now());
        await emitEventHubAndWait("trackHashChange", "#Action-toAppNavSample2");
        oCurrentApplication = {
            applicationType: "UI5",
            getTechnicalParameter: sandbox.stub().resolves(["F987"])
        };
        await emitEventHubAndWait("FESRAppLoaded", Date.now());
        // Assert
        const aRecords = ShellAnalytics.getAllRecords();
        assert.strictEqual(aRecords.length, 2, "shell analytics called for deeplink and application");
        const oFirstRecord = aRecords[0];
        const oSecondRecord = aRecords[1];

        assert.strictEqual(oFirstRecord.getStep(), "FLP@DEEP_LINK", "Record has correct targetHash");

        assert.strictEqual(oSecondRecord.getTargetHash(), "#Action-toAppNavSample2", "Record has correct targetHash");
        assert.strictEqual(oSecondRecord.getStep(), "A2A@F123", "Record has correct step");
        assert.strictEqual(oSecondRecord.isClosed(), true, "Record is closed");
        assert.strictEqual(oSecondRecord.getSourceApplication(), "F123", "Record has correct source application");
        assert.strictEqual(oSecondRecord.getTargetApplication(), "F987", "Record has correct source application");
    });

    QUnit.test("Step FLP@DEEP_LINK", async function (assert) {
        // Arrange
        oCurrentApplication = {
            applicationType: "UI5",
            getTechnicalParameter: sandbox.stub().resolves(["F123"])
        };
        // Act
        await emitEventHubAndWait("trackHashChange", "#Action-toApp");
        await emitEventHubAndWait("FESRAppLoaded", Date.now());
        await emitEventHubAndWait("trackHashChange", "#Action-toAppNavSample");
        // Assert
        const aRecords = ShellAnalytics.getAllRecords();
        assert.strictEqual(aRecords.length, 2, "shell analytics called for homepage and application");
        const oFirstRecord = aRecords[0];
        const oSecondRecord = aRecords[1];

        assert.strictEqual(oFirstRecord.getTargetHash(), "#Action-toApp", "Record has correct targetHash");
        assert.strictEqual(!!oFirstRecord.getTimeStart(), true, "Record has start time");
        assert.strictEqual(!!oFirstRecord.getTimeEnd(), true, "Record has end time");
        assert.strictEqual(oFirstRecord.getStep(), "FLP@DEEP_LINK", "Record has correct step");
        assert.strictEqual(oFirstRecord.isClosed(), true, "Record is closed");

        assert.strictEqual(oSecondRecord.isClosed(), false, "Record is not closed");
    });

    QUnit.module("Application type detection", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oCurrentApplicationStub = sandbox.stub();
            this.oGetServiceAsyncStub.withArgs("AppLifeCycle").resolves({
                getCurrentApplication: this.oCurrentApplicationStub,
                ApplicationType: ApplicationType
            });

            this.oGetServiceAsyncStub.withArgs("ShellNavigationInternal").resolves({
                hashChanger: {
                    detachEvent: sandbox.stub(),
                    attachEvent: sandbox.stub()
                }
            });

            ShellAnalytics.enable();
        },
        afterEach: function () {
            sandbox.restore();
            ShellAnalytics.disable();
            EventHub._reset();
        }
    });

    QUnit.test("targetApplication is not set, when getCurrentApplication return nothing", async function (assert) {
        // Arrange
        this.oCurrentApplicationStub.returns(null);
        // Act
        await emitEventHubAndWait("trackHashChange", "#Action-toApp");
        await emitEventHubAndWait("FESRAppLoaded", Date.now());
        // Assert
        const aRecords = ShellAnalytics.getAllRecords();
        assert.strictEqual(aRecords.length, 1, "shell analytics called for one application");
        const oFirstRecord = aRecords[0];
        assert.strictEqual(oFirstRecord.targetApplication, undefined, "targetApplication was set correctly");
    });

    QUnit.test("targetApplication is set to FLP_HOME, when getCurrentApplication return homePage", async function (assert) {
        // Arrange
        this.oCurrentApplicationStub.returns({
            homePage: true
        });
        // Act
        await emitEventHubAndWait("trackHashChange", "#Shell-home");
        await emitEventHubAndWait("FESRAppLoaded", Date.now());
        // Assert
        const aRecords = ShellAnalytics.getAllRecords();
        assert.strictEqual(aRecords.length, 1, "shell analytics called for one application");
        const oFirstRecord = aRecords[0];
        assert.strictEqual(oFirstRecord.getTargetApplication(), "FLP_HOME", "targetApplication was set correctly");
    });

    QUnit.test("FioriId is set as targetApplication, when getCurrentApplication return UI5 application", async function (assert) {
        // Arrange
        const oGetTechnicalParameterStub = sandbox.stub().resolves([]);
        oGetTechnicalParameterStub.withArgs("sap-fiori-id").resolves(["F12345"]);
        this.oCurrentApplicationStub.returns({
            homePage: false,
            applicationType: "UI5",
            getTechnicalParameter: oGetTechnicalParameterStub
        });
        // Act
        await emitEventHubAndWait("trackHashChange", "#Action-toApp");
        await emitEventHubAndWait("FESRAppLoaded", Date.now());
        // Assert
        const aRecords = ShellAnalytics.getAllRecords();
        assert.strictEqual(aRecords.length, 1, "shell analytics called for one application");
        const oFirstRecord = aRecords[0];
        assert.strictEqual(oFirstRecord.getTargetApplication(), "F12345", "targetApplication was set correctly");
    });

    QUnit.test("SAP-GUI Application is correctly recorded", async function (assert) {
        // Arrange
        this.oCurrentApplicationStub.returns({
            applicationType: "TR",
            getTechnicalParameter: sandbox.stub().resolves()
        });
        sandbox.stub(AppConfiguration, "getMetadata").returns({ technicalName: "SU01" });
        // Act
        await emitEventHubAndWait("trackHashChange", "#Action-tosu01");
        await emitEventHubAndWait("FESRAppLoaded", Date.now());
        // Assert
        assert.deepEqual(ShellAnalytics.getCurrentApplication(), { id: "SU01", type: "TR" }, "the application was set");
        const aRecords = ShellAnalytics.getAllRecords();
        assert.strictEqual(aRecords.length, 1, "shell analytics called for homepage and application");
        const oFirstRecord = aRecords[0];
        assert.strictEqual(oFirstRecord.getTargetHash(), "#Action-tosu01", "Record has correct targetHash");
        assert.strictEqual(!!oFirstRecord.getTimeStart(), true, "Record has start time");
        assert.strictEqual(!!oFirstRecord.getTimeEnd(), true, "Record has no end time");
        assert.strictEqual(oFirstRecord.getTargetApplication(), "SU01", "targetApplication was set correctly");
        assert.strictEqual(oFirstRecord.isClosed(), true, "Record is closed");
    });

    QUnit.test("Component id is set as targetApplication, when getTechnicalParameter return no id for UI5 application", async function (assert) {
        // Arrange
        this.oCurrentApplicationStub.returns({
            homePage: false,
            applicationType: "UI5",
            getTechnicalParameter: sandbox.stub().resolves([]),
            componentInstance: {
                getManifest: sandbox.stub().returns({
                    "sap.app": {
                        id: "some.test.application"
                    }
                })
            }
        });
        // Act
        await emitEventHubAndWait("trackHashChange", "#Action-toApp");
        await emitEventHubAndWait("FESRAppLoaded", Date.now());
        // Assert
        const aRecords = ShellAnalytics.getAllRecords();
        assert.strictEqual(aRecords.length, 1, "shell analytics called for one application");
        const oFirstRecord = aRecords[0];
        assert.strictEqual(oFirstRecord.getTargetApplication(), "some.test.application", "targetApplication was set correctly");
    });

    QUnit.test("targetApplication is recognized as home app, when custom home", async function (assert) {
        // Arrange
        this.oCurrentApplicationStub.returns({
            homePage: false,
            applicationType: "UI5",
            getTechnicalParameter: sandbox.stub().resolves(["some.test.application"]),
            componentInstance: {
                getManifest: sandbox.stub().returns({
                    "sap.app": {
                        id: "some.test.application"
                    }
                }),
                sId: "foo-homeApp-component"
            }
        });
        // Act
        await emitEventHubAndWait("trackHashChange", "#Shell-home");
        await emitEventHubAndWait("FESRAppLoaded", Date.now());
        // Assert
        const aRecords = ShellAnalytics.getAllRecords();
        assert.strictEqual(aRecords.length, 1, "shell analytics called for one application");
        const oFirstRecord = aRecords[0];
        assert.strictEqual(oFirstRecord.getTargetApplication(), "some.test.application", "targetApplication was set correctly");
        assert.strictEqual(oFirstRecord.getTargetIsHomeApp(), true, "application is recognized as a home app");
    });

    QUnit.test("Component id without comma is set as targetApplication, when getTechnicalParameter return no id for UI5 application", async function (assert) {
        // Arrange
        this.oCurrentApplicationStub.returns({
            homePage: false,
            applicationType: "UI5",
            getTechnicalParameter: sandbox.stub().resolves([]),
            componentInstance: {
                getManifest: sandbox.stub().returns({
                    "sap.app": {
                        id: "a, b, c"
                    }
                })
            }
        });
        // Act
        await emitEventHubAndWait("trackHashChange", "#Action-toApp");
        await emitEventHubAndWait("FESRAppLoaded", Date.now());
        // Assert
        const aRecords = ShellAnalytics.getAllRecords();
        assert.strictEqual(aRecords.length, 1, "shell analytics called for one application");
        const oFirstRecord = aRecords[0];
        assert.strictEqual(oFirstRecord.getTargetApplication(), "a b c", "targetApplication was set correctly");
    });

    QUnit.test("Set technicalName as targetApplication, when current application is not UI5 application", async function (assert) {
        // Arrange
        this.oCurrentApplicationStub.returns({
            homePage: false,
            applicationType: "GUI"
        });
        sandbox.stub(AppConfiguration, "getMetadata").returns({ technicalName: "SU01" });
        // Act
        await emitEventHubAndWait("trackHashChange", "#Action-toApp");
        await emitEventHubAndWait("FESRAppLoaded", Date.now());
        // Assert
        const aRecords = ShellAnalytics.getAllRecords();
        assert.strictEqual(aRecords.length, 1, "shell analytics called for one application");
        const oFirstRecord = aRecords[0];
        assert.strictEqual(oFirstRecord.getTargetApplication(), "SU01", "targetApplication was set correctly");
    });

    QUnit.test("When current application is not a UI5 application, remove all comma signs from targetApplication", async function (assert) {
        // Arrange
        this.oCurrentApplicationStub.returns({
            homePage: false,
            applicationType: "GUI"
        });
        sandbox.stub(AppConfiguration, "getMetadata").returns({ technicalName: "SU01, GERMANY, (TCODE)" });
        // Act
        await emitEventHubAndWait("trackHashChange", "#Action-toApp");
        await emitEventHubAndWait("FESRAppLoaded", Date.now());
        // Assert
        const aRecords = ShellAnalytics.getAllRecords();
        assert.strictEqual(aRecords.length, 1, "shell analytics called for one application");
        const oFirstRecord = aRecords[0];
        assert.strictEqual(oFirstRecord.getTargetApplication(), "SU01 (TR)", "targetApplication was set correctly");
    });

    QUnit.test("When current application is a GUI application, remove all parameters from targetApplication", async function (assert) {
        // Arrange
        this.oCurrentApplicationStub.returns({
            homePage: false,
            applicationType: "GUI"
        });
        sandbox.stub(AppConfiguration, "getMetadata").returns({ technicalName: "*ME22N UITYPE=advancedNoPar (TCODE)" });
        // Act
        await emitEventHubAndWait("trackHashChange", "#Action-toApp");
        await emitEventHubAndWait("FESRAppLoaded", Date.now());
        // Assert
        const aRecords = ShellAnalytics.getAllRecords();
        assert.strictEqual(aRecords.length, 1, "shell analytics called for one application");
        const oFirstRecord = aRecords[0];
        assert.strictEqual(oFirstRecord.getTargetApplication(), "ME22N (TR)", "targetApplication was set correctly");
    });

    QUnit.module("Close record", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oCurrentApplicationStub = sandbox.stub();
            this.oGetServiceAsyncStub.withArgs("AppLifeCycle").resolves({
                getCurrentApplication: this.oCurrentApplicationStub,
                ApplicationType: ApplicationType
            });

            this.oGetServiceAsyncStub.withArgs("ShellNavigationInternal").resolves({
                hashChanger: {
                    detachEvent: sandbox.stub(),
                    attachEvent: sandbox.stub()
                }
            });

            ShellAnalytics.enable();
        },
        afterEach: function () {
            sandbox.restore();
            ShellAnalytics.disable();
            EventHub._reset();
        }
    });

    QUnit.test("Close inplace navigation", async function (assert) {
        // Arrange
        this.oCurrentApplicationStub.returns({
            homePage: false,
            applicationType: "UI5",
            getTechnicalParameter: sandbox.stub().resolves(["F12345"])
        });
        // Act
        await emitEventHubAndWait("trackHashChange", "#Action-toApp");
        await emitEventHubAndWait("FESRAppLoaded", Date.now());
        // Assert
        assert.deepEqual(ShellAnalytics.getCurrentApplication(), { type: "UI5", id: "F12345" }, "the application was set");
        const aRecords = ShellAnalytics.getAllRecords();
        assert.strictEqual(aRecords.length, 1, "shell analytics called for one application");
        const oFirstRecord = aRecords[0];
        assert.strictEqual(oFirstRecord.isClosed(), true, "Record was closed");
        assert.strictEqual(oFirstRecord.getTargetApplication(), "F12345", "target application was set correctly");
    });

    QUnit.test("Close inplace navigation for stateful applications", async function (assert) {
        // Arrange
        sandbox.stub(AppConfiguration, "getCurrentApplication").returns({});
        // will be overwritten
        this.oCurrentApplicationStub.returns({
            homePage: false,
            applicationType: "TR",
            getTechnicalParameter: sandbox.stub().resolves(["F12345"])
        });
        // Act
        await emitEventHubAndWait("trackHashChange", "#Action-toApp");
        await emitEventHubAndWait("CloseFesrRecord", { date: Date.now(), technicalName: "SUO1,MyVariant (TCODE)" });
        // Assert
        assert.deepEqual(ShellAnalytics.getCurrentApplication(), { type: "GUI", id: "SUO1MyVariant (TR)" }, "the application was set");
    });

    QUnit.test("Close explace navigation", async function (assert) {
        // Act
        await emitEventHubAndWait("trackHashChange", "#Action-toExplaceApp");
        await emitEventHubAndWait("openedAppInNewWindow", Date.now());
        // Assert
        assert.notOk(ShellAnalytics.getCurrentApplication(), "the application was not set");
        const aRecords = ShellAnalytics.getAllRecords();
        assert.strictEqual(aRecords.length, 1, "shell analytics called for one application");
        const oFirstRecord = aRecords[0];
        assert.strictEqual(oFirstRecord.isClosed(), true, "Record was closed");
        assert.strictEqual(oFirstRecord.getTargetApplication(), null, "targetApplication was set correctly");
    });

    QUnit.test("Close navigation with error", async function (assert) {
        // Act
        await emitEventHubAndWait("trackHashChange", "#Action-toExplaceApp");
        await emitEventHubAndWait("doHashChangeError", Date.now());
        // Assert
        assert.notOk(ShellAnalytics.getCurrentApplication(), "the application was not set");
        const aRecords = ShellAnalytics.getAllRecords();
        assert.strictEqual(aRecords.length, 1, "shell analytics called for one application");
        const oFirstRecord = aRecords[0];
        assert.strictEqual(oFirstRecord.isClosedWithError(), true, "Record was closed with error");
    });

    QUnit.module("getNextNavigationRecords", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oGetServiceAsyncStub.withArgs("AppLifeCycle").resolves({
                getCurrentApplication: sandbox.stub(),
                ApplicationType: ApplicationType
            });

            this.oGetServiceAsyncStub.withArgs("ShellNavigationInternal").resolves({
                hashChanger: {
                    detachEvent: sandbox.stub(),
                    attachEvent: sandbox.stub()
                }
            });

            ShellAnalytics.enable();
        },
        afterEach: function () {
            sandbox.restore();
            EventHub._reset();
            ShellAnalytics.disable();
        }
    });

    QUnit.test("Returns no open Records", async function (assert) {
        // Arrange
        await emitEventHubAndWait("trackHashChange", "#Action-toApp1");
        await emitEventHubAndWait("FESRAppLoaded");
        await emitEventHubAndWait("trackHashChange", "#Action-toApp2");
        // Act
        const aRecords = ShellAnalytics.getNextNavigationRecords();
        // Assert
        assert.strictEqual(aRecords.length, 1, "Returned the expected amount of Records");
        const bAllClosed = aRecords.every((oRecord) => oRecord.isClosed());
        assert.strictEqual(bAllClosed, true, "All returned Records are closed");
    });

    QUnit.test("Returns only newer Records", async function (assert) {
        // Arrange
        const oPerformanceNowStub = sandbox.stub(performance, "now");
        oPerformanceNowStub.returns(100);
        await emitEventHubAndWait("trackHashChange", "#Action-toApp1");
        await emitEventHubAndWait("FESRAppLoaded", "#Action-toApp1");
        oPerformanceNowStub.returns(200);
        await emitEventHubAndWait("trackHashChange", "#Action-toApp2");
        await emitEventHubAndWait("FESRAppLoaded", "#Action-toApp2");
        oPerformanceNowStub.returns(300);
        await emitEventHubAndWait("trackHashChange", "#Action-toApp3");
        await emitEventHubAndWait("FESRAppLoaded", "#Action-toApp3");
        const aAllRecords = ShellAnalytics.getAllRecords();
        // Act
        const aRecords = ShellAnalytics.getNextNavigationRecords(aAllRecords[1]);
        // Assert
        assert.strictEqual(aRecords.length, 1, "Returned the expected amount of Records");
        const bAllClosed = aRecords.every((oRecord) => oRecord.isClosed());
        assert.strictEqual(bAllClosed, true, "All returned Records are closed");
    });
});
