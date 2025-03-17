// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.performance.FesrEnhancer
 */
sap.ui.define([
    "sap/base/util/deepClone",
    "sap/ui/performance/trace/FESR",
    "sap/ushell/EventHub",
    "sap/ushell/performance/FesrEnhancer",
    "sap/ushell/performance/ShellAnalytics",
    "sap/ushell/performance/StatisticalRecord"
], function (
    deepClone,
    FESR,
    EventHub,
    FesrEnhancer,
    ShellAnalytics,
    StatisticalRecord
) {
    "use strict";

    /* global QUnit, sinon */

    const sandbox = sinon.sandbox.create();

    QUnit.module("Integration (mocked) with FESR and ShellAnalytics", {
        beforeEach: function () {
            this.ShellAnalyticsEnableStub = sandbox.stub(ShellAnalytics, "enable");
            this.ShellAnalyticsDisableStub = sandbox.stub(ShellAnalytics, "disable");

            // Arrange UI5 FESR
            this.oFesrGetActiveStub = sandbox.stub(FESR, "getActive");
            this.originalFesrOnBeforeCreated = FESR.onBeforeCreated;
        },
        afterEach: function () {
            FESR.onBeforeCreated = this.originalFesrOnBeforeCreated;
            sandbox.restore();
            FesrEnhancer.reset();
        }
    });

    QUnit.test("reset does not throw when init was never called", function (assert) {
        // Act
        FesrEnhancer.reset();

        // Assert
        assert.ok(true, "no error was thrown by reset");
    });

    QUnit.test("consecutive reset calls", function (assert) {
        function fnDoAsserts (iExecution) {
            const sPrefix = "(reset call #" + (iExecution || 1) + ") ";

            assert.strictEqual(FESR.onBeforeCreated, this.originalFesrOnBeforeCreated, sPrefix + "FESR.onBeforeCreated was reset");
            assert.strictEqual(
                this.ShellAnalyticsDisableStub.callCount,
                iExecution || 1,
                sPrefix + "Number of disable calls for ShellAnalytics is " + iExecution
            );

            assert.strictEqual(FesrEnhancer._getLastTrackedRecord(), null, sPrefix + "latest navigation record cleared");
        }

        // Arrange
        this.oFesrGetActiveStub.returns(true);
        FesrEnhancer.init();
        FesrEnhancer._setLastTrackedRecord({});
        assert.ok(this.ShellAnalyticsEnableStub.callCount > 0, "prerequisite: attachment(s) to EventHub were done");

        // Act #1
        FesrEnhancer.reset();

        // Assert #1
        fnDoAsserts.call(this);

        // Act #2
        // a second reset call should not harm!
        FesrEnhancer.reset();

        // Assert #2
        fnDoAsserts.call(this, 2);
    });

    QUnit.test("init when UI5 FESR is inactive", function (assert) {
        // Arrange
        this.oFesrGetActiveStub.returns(false);

        // Act
        FesrEnhancer.init();

        // Assert
        assert.strictEqual(this.ShellAnalyticsEnableStub.callCount, 0, "ShellAnalytics was not enabled");
        assert.strictEqual(FESR.onBeforeCreated, this.originalFesrOnBeforeCreated, "onBeforeCreated not overwritten");
    });

    QUnit.test("init when UI5 FESR is active", function (assert) {
        // Arrange
        this.oFesrGetActiveStub.returns(true);

        // Act
        FesrEnhancer.init();

        // Assert
        assert.strictEqual(this.ShellAnalyticsEnableStub.callCount, 1, "ShellAnalytics was not enabled");
        assert.notStrictEqual(FESR.onBeforeCreated, this.originalFesrOnBeforeCreated, "onBeforeCreated has been overwritten");
    });

    QUnit.module("set and get last tracked record", {
        beforeEach: function () {
            this.ShellAnalyticsEnableStub = sandbox.stub(ShellAnalytics, "enable");
            this.ShellAnalyticsDisableStub = sandbox.stub(ShellAnalytics, "disable");
            FesrEnhancer.init();
        },
        afterEach: function () {
            sandbox.restore();
            FesrEnhancer.reset();
        }
    });

    QUnit.test("setter and getter", function (assert) {
        // Act & assert #1
        assert.strictEqual(FesrEnhancer._getLastTrackedRecord(), null, "initially no records are set");

        // Act #2
        const oTestRecord = new StatisticalRecord();
        FesrEnhancer._setLastTrackedRecord(oTestRecord);
        assert.strictEqual(FesrEnhancer._getLastTrackedRecord(), oTestRecord, "latest record is returned");
    });

    QUnit.module("_onBeforeCreatedHandler: ignore scenario", {
        beforeEach: function () {
            this.ShellAnalyticsEnableStub = sandbox.stub(ShellAnalytics, "enable");
            this.ShellAnalyticsDisableStub = sandbox.stub(ShellAnalytics, "disable");
            this.ShellAnalyticGetCurrentAppStub = sandbox.stub(ShellAnalytics, "getCurrentApplication");
            // shared input
            this.oInput = {
                oFesrHandle: {
                    // stepName must be defined in the test
                    appNameLong: "initialAppNameLong",
                    appNameShort: "initialAppNameShort",
                    timeToInteractive: 99999
                },
                oInteraction: {
                    event: "foo",
                    trigger: "bar",
                    component: "baz"
                    // ...
                }
            };
        },
        afterEach: function () {
            sandbox.restore();
            FesrEnhancer.reset();
        }
    });

    QUnit.test("FESR step is unknown & no Fiori ID remembered", function (assert) {
        // Arrange
        this.oInput.oFesrHandle.stepName = "foo";
        const oExpectedFesrHandle = deepClone(this.oInput.oFesrHandle);
        this.ShellAnalyticGetCurrentAppStub.returns(null);

        // Act
        const oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(this.oInput.oFesrHandle, this.oInput.oInteraction);

        // Assert
        assert.deepEqual(oReturnedFesrHandle, oExpectedFesrHandle, "Correct FESR result was returned");
    });

    QUnit.test("FESR step is unknown & Fiori ID remembered", function (assert) {
        // Arrange
        this.oInput.oFesrHandle.stepName = "foo";
        this.ShellAnalyticGetCurrentAppStub.returns({ id: "F01234" });
        const oExpectedFesrHandle = deepClone(this.oInput.oFesrHandle);
        oExpectedFesrHandle.appNameShort = "F01234";

        // Act
        const oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(this.oInput.oFesrHandle, this.oInput.oInteraction);

        // Assert
        assert.deepEqual(oReturnedFesrHandle, oExpectedFesrHandle, "Correct FESR result was returned");
    });

    QUnit.test("remembered Fiori ID is added to all consecutive records", function (assert) {
        const oOriginalFesrHandle = this.oInput.oFesrHandle;

        this.ShellAnalyticGetCurrentAppStub
            .onFirstCall().returns(null)
            .onSecondCall().returns({ id: "F01234" })
            .onThirdCall().returns(null);

        // Arrange #1
        oOriginalFesrHandle.stepName = "foo";

        // Act #1
        let oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(deepClone(oOriginalFesrHandle), this.oInput.oInteraction);

        // Assert #1
        assert.deepEqual(oReturnedFesrHandle, oOriginalFesrHandle, "FESR handle information was not modified");

        // Arrange #2
        //.onSecondCall().returns({id: "F01234"}) defined above

        // Act #2
        oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(deepClone(oOriginalFesrHandle), this.oInput.oInteraction);

        // Assert #2
        assert.deepEqual(oReturnedFesrHandle.appNameShort, "F01234", "appNameShort was overwritten with remembered fiori ID");
        assert.deepEqual(oReturnedFesrHandle.stepName, oOriginalFesrHandle.stepName, "stepName was not modified");
        assert.deepEqual(oReturnedFesrHandle.appNameLong, oOriginalFesrHandle.appNameLong, "appNameLong was not modified");
        assert.deepEqual(oReturnedFesrHandle.timeToInteractive, oOriginalFesrHandle.timeToInteractive, "timeToInteractive was not modified");

        // Arrange #3
        //.onThirdCall().returns(null) defined above

        // Act #3
        oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(deepClone(oOriginalFesrHandle), this.oInput.oInteraction);

        // Assert #3
        assert.deepEqual(oReturnedFesrHandle, oOriginalFesrHandle, "FESR handle information was not modified");
    });

    QUnit.module("_onBeforeCreatedHandler: Initial Pages scenario", {
        beforeEach: function () {
            //ShellAnalytics
            this.ShellAnalyticsDisableStub = sandbox.stub(ShellAnalytics, "disable");
            this.oStatisticalRecord = {
                getTargetAppNameShort: sandbox.stub(),
                getTargetIsHomeApp: sandbox.stub(),
                getTargetApplication: sandbox.stub().returns("FLP_PAGE"),
                getStep: sandbox.stub(),
                getTimeStart: sandbox.stub().returns(0)
            };
            this.oGetLastClosedRecordStub = sandbox.stub(ShellAnalytics, "getLastClosedRecord").returns(this.oStatisticalRecord);
            // shared input
            this.oInput = {
                oFesrHandle: {
                    stepName: "undetermined_startup",
                    appNameLong: "sap.ushell.components.pages",
                    appNameShort: "components.pages",
                    timeToInteractive: 99999
                },
                oInteraction: {
                    event: "startup",
                    component: "undetermined",
                    stepComponent: "sap.ushell.components.pages",
                    trigger: "undetermined"
                    // more properties available ...
                }
            };

            // shared expectations
            this.oExpected = {
                oFesrHandle: {
                    stepName: "FLP@LOAD",
                    appNameLong: "sap.ushell.components.pages",
                    appNameShort: "FLP_PAGE",
                    interactionType: 1
                    // timeToInteractive must be defined in the test
                }
            };
            this.oGetPerformanceEntriesStub = sandbox.stub(FesrEnhancer, "_getPerformanceEntries").returns([]);
        },
        afterEach: function () {
            sandbox.restore();
            FesrEnhancer.reset();
        }
    });

    QUnit.test("FLP-TTI-Homepage performance mark does NOT exist", function (assert) {
        // Arrange
        // Note: As no performance mark exist the time should be kept
        this.oExpected.oFesrHandle.timeToInteractive = this.oInput.oFesrHandle.timeToInteractive;

        // Act
        const oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(this.oInput.oFesrHandle, this.oInput.oInteraction);

        // Assert
        assert.deepEqual(oReturnedFesrHandle, this.oExpected.oFesrHandle, "expected FESR handle information");
        assert.strictEqual(this.oGetPerformanceEntriesStub.firstCall.args[0], "FLP-TTI-Homepage", "correct performance mark read");
    });

    QUnit.test("FLP-TTI-Homepage performance mark exists", function (assert) {
        // Arrange
        const iPerformanceMarkStartTime = 500; // super fast FLP ;)
        this.oExpected.oFesrHandle.timeToInteractive = iPerformanceMarkStartTime;
        this.oGetPerformanceEntriesStub.returns([{ startTime: iPerformanceMarkStartTime }]);

        // Act
        const oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(this.oInput.oFesrHandle, this.oInput.oInteraction);

        // Assert
        assert.deepEqual(oReturnedFesrHandle, this.oExpected.oFesrHandle, "expected FESR handle information");
        assert.strictEqual(this.oGetPerformanceEntriesStub.firstCall.args[0], "FLP-TTI-Homepage", "correct performance mark read");
    });

    QUnit.test("Empty page returns mark FLP-Pages-Service-loadPage-end instead of TTI", function (assert) {
        // Arrange
        const iPerformanceMarkStartTime = 500; // super fast FLP ;)
        this.oExpected.oFesrHandle.timeToInteractive = iPerformanceMarkStartTime;
        // TTI does not exist
        this.oGetPerformanceEntriesStub.withArgs("FLP-TTI-Homepage").returns([]);
        this.oGetPerformanceEntriesStub.withArgs("FLP-Pages-Service-loadPage-end").returns([{ startTime: iPerformanceMarkStartTime}]);

        // Act
        const oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(this.oInput.oFesrHandle, this.oInput.oInteraction);

        // Assert
        assert.deepEqual(oReturnedFesrHandle, this.oExpected.oFesrHandle, "expected FESR handle information");
        assert.ok(true, this.oGetPerformanceEntriesStub.secondCall.calledWithMatch("FLP-Pages-Service-loadPage-end"), "correct performance mark read");
    });

    QUnit.test("FLP-TTI-Homepage-Custom performance mark exists", function (assert) {
        // Arrange
        this.oStatisticalRecord.getTargetApplication.returns("F2808");
        const iPerformanceMarkStartTime = 500; // super fast FLP ;)
        const oInput = {
            oFesrHandle: {
                stepName: "undetermined_startup",
                appNameLong: "sap.ushell.components.custom.home.page",
                appNameShort: "F2808",
                timeToInteractive: 99999
            },
            oInteraction: {
                event: "startup",
                component: "undetermined",
                stepComponent: "sap.ushell.components.custom homepage",
                trigger: "undetermined"
                // more properties available ...
            }
        };

        this.oStatisticalRecord.getTargetIsHomeApp.returns(true);
        this.oStatisticalRecord.getStep.returns("HOME@HOME");
        // shared expectations
        const oExpected = {
            oFesrHandle: {
                stepName: "FLPCUSTOMHOME@F2808",
                appNameLong: "sap.ushell.components.custom.home.page",
                appNameShort: "F2808",
                interactionType: 1
                // timeToInteractive must be defined in the test
            }
        };

        oExpected.oFesrHandle.timeToInteractive = iPerformanceMarkStartTime;
        this.oGetPerformanceEntriesStub.returns([{ startTime: iPerformanceMarkStartTime }]);

        // Act
        const oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(oInput.oFesrHandle, oInput.oInteraction);

        // Assert
        assert.deepEqual(oReturnedFesrHandle, oExpected.oFesrHandle, "expected FESR handle information");
        assert.strictEqual(this.oGetPerformanceEntriesStub.firstCall.args[0], "FLP-TTI-Homepage-Custom", "correct performance mark read");

    });

    QUnit.module("_onBeforeCreatedHandler: Initial AppFinder scenario", {
        beforeEach: function () {
            //ShellAnalytics
            this.ShellAnalyticsDisableStub = sandbox.stub(ShellAnalytics, "disable");
            this.oStatisticalRecord = {
                getTargetAppNameShort: sandbox.stub(),
                getTargetIsHomeApp: sandbox.stub(),
                getTargetApplication: sandbox.stub().returns("FLP_FINDER"),
                getTimeStart: sandbox.stub().returns(0)
            };
            this.oGetLastClosedRecordStub = sandbox.stub(ShellAnalytics, "getLastClosedRecord").returns(this.oStatisticalRecord);
            // shared input
            this.oInput = {
                oFesrHandle: {
                    stepName: "undetermined_startup",
                    appNameLong: "sap.ushell.components.appfinder",
                    appNameShort: "components.appfinder",
                    timeToInteractive: 99999
                },
                oInteraction: {
                    event: "startup",
                    component: "undetermined",
                    stepComponent: "sap.ushell.components.appfinder",
                    trigger: "undetermined"
                    // more properties available ...
                }
            };

            // shared expectations
            this.oExpected = {
                oFesrHandle: {
                    stepName: "FLP@LOAD_FINDER",
                    appNameLong: "sap.ushell.components.appfinder",
                    appNameShort: "FLP_FINDER", //20 characters are allowed
                    interactionType: 1
                    // timeToInteractive must be defined in the test
                }
            };
            this.oGetPerformanceEntriesStub = sandbox.stub(FesrEnhancer, "_getPerformanceEntries").returns([]);
        },
        afterEach: function () {
            sandbox.restore();
            FesrEnhancer.reset();
        }
    });

    QUnit.test("FLP-TTI-AppFinder performance mark does NOT exist", function (assert) {
        // Arrange
        // Note: As no performance mark exist the time should be kept
        this.oExpected.oFesrHandle.timeToInteractive = this.oInput.oFesrHandle.timeToInteractive;

        // Act
        const oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(this.oInput.oFesrHandle, this.oInput.oInteraction);

        // Assert
        assert.deepEqual(oReturnedFesrHandle, this.oExpected.oFesrHandle, "expected FESR handle information");
        assert.strictEqual(this.oGetPerformanceEntriesStub.firstCall.args[0], "FLP-TTI-AppFinder", "correct performance mark read");
    });

    QUnit.test("FLP-TTI-AppFinder performance mark exists", function (assert) {
        // Arrange
        const iPerformanceMarkStartTime = 500; // super fast AppFinder ;)
        this.oExpected.oFesrHandle.timeToInteractive = iPerformanceMarkStartTime;
        this.oGetPerformanceEntriesStub.returns([{ startTime: iPerformanceMarkStartTime }]);

        // Act
        const oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(this.oInput.oFesrHandle, this.oInput.oInteraction);

        // Assert
        assert.deepEqual(oReturnedFesrHandle, this.oExpected.oFesrHandle, "expected FESR handle information");
        assert.strictEqual(this.oGetPerformanceEntriesStub.firstCall.args[0], "FLP-TTI-AppFinder", "correct performance mark read");
    });

    QUnit.module("_onBeforeCreatedHandler: Direct (initial) app start scenario w/o ", {
        beforeEach: function () {
            //ShellAnalytics
            this.oEventHubStub = sandbox.stub(EventHub, "emit");
            this.ShellAnalyticsDisableStub = sandbox.stub(ShellAnalytics, "disable");
            this.ShellAnalyticGetCurrentAppStub = sandbox.stub(ShellAnalytics, "getCurrentApplication");
            this.oStatisticalRecord = {
                getTargetAppNameShort: sandbox.stub(),
                getTargetIsHomeApp: sandbox.stub(),
                getTargetApplicationType: sandbox.stub()
            };
            this.oGetLastClosedRecordStub = sandbox.stub(ShellAnalytics, "getLastClosedRecord").returns(this.oStatisticalRecord);
            // shared input
            this.oInput = {
                oFesrHandle: {
                    stepName: "undetermined_startup",
                    appNameLong: "sap.some.useful.App",
                    appNameShort: "sap.some.useful.App",
                    timeToInteractive: 99999
                },
                oInteraction: {
                    event: "startup",
                    component: "undetermined",
                    stepComponent: "sap.some.useful.App",
                    trigger: "undetermined"
                    // more properties available ...
                }
            };

            // Arrange _getPerformanceEntries
            this.oGetPerformanceEntriesStub = sandbox.stub(FesrEnhancer, "_getPerformanceEntries").returns([]);
        },
        afterEach: function () {
            sandbox.restore();
            FesrEnhancer.reset();
        }
    });

    QUnit.test("AppRendered event w/o fiori IDs was tracked", function (assert) {
        // Arrange
        const oExpectedFesrHandle = {
            stepName: "FLP@DEEP_LINK",
            appNameLong: "sap.some.useful.App",
            appNameShort: "sap.some.useful.App", // No Fiori Id present in tracked events, no changes for appNameShort
            timeToInteractive: this.oInput.oFesrHandle.timeToInteractive, // As no performance mark exist the time should be kept
            interactionType: 1
        };
        this.ShellAnalyticGetCurrentAppStub.returns({ id: "" });
        this.oStatisticalRecord.getTargetApplicationType.returns("UI5");

        // Act
        const oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(this.oInput.oFesrHandle, this.oInput.oInteraction);

        // Assert
        assert.deepEqual(oReturnedFesrHandle, oExpectedFesrHandle, "expected FESR handle information");
        assert.strictEqual(this.oGetPerformanceEntriesStub.callCount, 0, "no performance marks read");
        assert.ok(this.oEventHubStub.called, "'startUpFesrEnhanced' Event triggered");
    });

    QUnit.test("AppRendered event w/ fiori IDs was tracked", function (assert) {
        // Arrange
        const oExpectedFesrHandle = {
            stepName: "FLP@DEEP_LINK",
            appNameLong: "sap.some.useful.App",
            appNameShort: "F00000",
            timeToInteractive: this.oInput.oFesrHandle.timeToInteractive, // As no performance mark exist the time should be kept
            interactionType: 1
        };
        this.ShellAnalyticGetCurrentAppStub.returns({ id: "F00000" });
        this.oStatisticalRecord.getTargetApplicationType.returns("UI5");

        // Act
        const oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(this.oInput.oFesrHandle, this.oInput.oInteraction);

        // Assert
        assert.deepEqual(oReturnedFesrHandle, oExpectedFesrHandle, "expected FESR handle information");
        assert.strictEqual(this.oGetPerformanceEntriesStub.callCount, 0, "no performance marks read");
    });

    QUnit.test("Does not fail when no StatisticalRecord was found", function (assert) {
        // Arrange
        const oExpectedFesrHandle = deepClone(this.oInput.oFesrHandle);
        oExpectedFesrHandle.appNameShort = "F00000";
        this.oGetLastClosedRecordStub.returns();
        this.ShellAnalyticGetCurrentAppStub.returns({ id: "F00000" });

        // Act
        const oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(this.oInput.oFesrHandle, this.oInput.oInteraction);

        // Assert
        assert.deepEqual(oReturnedFesrHandle, oExpectedFesrHandle, "expected FESR handle information");
        assert.strictEqual(this.oGetPerformanceEntriesStub.callCount, 0, "no performance marks read");
    });

    QUnit.module("_onBeforeCreatedHandler: Navigation scenario", {
        beforeEach: function () {
            //ShellAnalytics
            this.ShellAnalyticsDisableStub = sandbox.stub(ShellAnalytics, "disable");
            this.ShellAnalyticGetCurrentAppStub = sandbox.stub(ShellAnalytics, "getCurrentApplication");
            this.ShellAnalyticGetNavRecordsStub = sandbox.stub(ShellAnalytics, "getNextNavigationRecords");
            // shared input
            this.oInput = {
                oFesrHandle: {
                    stepName: "some_id__click",
                    appNameLong: "sap.some.useful.App",
                    appNameShort: "sap.some.useful.App",
                    timeToInteractive: 99999,
                    interactionType: 2
                },
                oInteraction: {
                    event: "startup",
                    component: "undetermined",
                    stepComponent: "sap.some.useful.App",
                    trigger: "click"
                    // more properties available ...
                }
            };

            this.oGetPerformanceEntriesStub = sandbox.stub(FesrEnhancer, "_getPerformanceEntries").returns([]);
        },
        afterEach: function () {
            sandbox.restore();
            FesrEnhancer.reset();
        }
    });

    QUnit.test("App to app navigation scenario", function (assert) {
        const oExpectedFesrHandle = {
            stepName: "A2A@F9999",
            appNameLong: "sap.some.useful.App",
            appNameShort: "F00000",
            timeToInteractive: this.oInput.oFesrHandle.timeToInteractive, // As no performance mark exist the time should be kept
            interactionType: 1
        };

        // Arrange
        this.ShellAnalyticGetCurrentAppStub.returns({ id: "F00000" });
        const oStatisticalRecord = {
            getStep: sandbox.stub().returns("A2A@F9999"),
            getTargetApplicationType: sandbox.stub().returns("UI5"),
            getTargetAppNameShort: sandbox.stub(),
            getTargetApplication: sandbox.stub().returns("F00000"),
            getTargetIsHomeApp: sandbox.stub().returns(false)
        };
        this.ShellAnalyticGetNavRecordsStub.returns([oStatisticalRecord]);

        // Act
        const oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(this.oInput.oFesrHandle, this.oInput.oInteraction);

        // Assert
        assert.deepEqual(oReturnedFesrHandle, oExpectedFesrHandle, "expected FESR handle information");
        assert.strictEqual(this.oGetPerformanceEntriesStub.callCount, 0, "no performance marks read");
        assert.strictEqual(FesrEnhancer._getLastTrackedRecord(), oStatisticalRecord, "New statistical record was set");
    });

    QUnit.test("navigation scenario during loading of FLP", function (assert) {
        this.oInput.oFesrHandle.stepName = "SOME_STEP";
        const oExpectedFesrHandle = {
            stepName: "SOME_STEP",
            appNameLong: "sap.some.useful.App",
            appNameShort: "HOME",
            timeToInteractive: this.oInput.oFesrHandle.timeToInteractive, // As no performance mark exist the time should be kept
            interactionType: 1
        };

        // Arrange
        this.ShellAnalyticGetCurrentAppStub.returns({ id: "FLP_HOME" });
        const oStatisticalRecord = {
            getStep: sandbox.stub().returns("FLP@DURING_LOAD"),
            getTargetApplicationType: sandbox.stub().returns("UI5"),
            getTargetAppNameShort: sandbox.stub(),
            getTargetApplication: sandbox.stub().returns("HOME"),
            getTargetIsHomeApp: sandbox.stub().returns(false)
        };
        this.ShellAnalyticGetNavRecordsStub.returns([oStatisticalRecord]);

        // Act
        const oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(this.oInput.oFesrHandle, this.oInput.oInteraction);

        // Assert
        assert.deepEqual(oReturnedFesrHandle, oExpectedFesrHandle, "expected FESR handle information");
        assert.strictEqual(this.oGetPerformanceEntriesStub.callCount, 0, "no performance marks read");
        assert.strictEqual(FesrEnhancer._getLastTrackedRecord(), oStatisticalRecord, "New statistical record was set");
    });

    QUnit.test("a SAP gui transaction is recorded", function (assert) {

        this.ShellAnalyticGetCurrentAppStub.returns(
            {
                id: "SE38 (TR)",
                type: "TR"
            });
        assert.strictEqual(FesrEnhancer._getLastTrackedApplicationId(), "SE38 (TR)", "New application id name was determined");
    });

    QUnit.test("App to app navigation scenario when FESR does not record interaction", function (assert) {
        const oExpectedFesrHandle = {
            stepName: "A2A@F0000",
            appNameLong: "sap.some.useful.App",
            appNameShort: "F7777",
            timeToInteractive: this.oInput.oFesrHandle.timeToInteractive, // As no performance mark exist the time should be kept
            interactionType: 1
        };

        // Arrange
        this.ShellAnalyticGetCurrentAppStub.returns({ id: "F7777" });
        const oStatisticalRecord1 = {
            getStep: sandbox.stub().returns("A2A@F9999"),
            getTargetHash: sandbox.stub(),
            getTargetApplicationType: sandbox.stub().returns("UI5"),
            getTargetAppNameShort: sandbox.stub(),
            getTargetApplication: sandbox.stub().returns("F0000"),
            getTargetIsHomeApp: sandbox.stub().returns(false)
        };
        const oStatisticalRecord2 = {
            getStep: sandbox.stub().returns("A2A@F0000"),
            getTargetHash: sandbox.stub(),
            getTargetApplicationType: sandbox.stub().returns("UI5"),
            getTargetAppNameShort: sandbox.stub(),
            getTargetApplication: sandbox.stub().returns("F7777"),
            getTargetIsHomeApp: sandbox.stub().returns(false)
        };
        this.ShellAnalyticGetNavRecordsStub.returns([oStatisticalRecord1, oStatisticalRecord2]);

        // Act
        const oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(this.oInput.oFesrHandle, this.oInput.oInteraction);

        // Assert
        assert.deepEqual(oReturnedFesrHandle, oExpectedFesrHandle, "expected FESR handle information");
        assert.strictEqual(this.oGetPerformanceEntriesStub.callCount, 0, "no performance marks read");
        assert.strictEqual(FesrEnhancer._getLastTrackedRecord(), oStatisticalRecord2, "New statistical record was set");
    });

    QUnit.test("Navigation to the home page from DEEP_LINK application", function (assert) {
        const oExpectedFesrHandle = {
            stepName: "FLP_BACK@F1234",
            appNameLong: "sap.some.useful.App",
            appNameShort: "FLP_HOME",
            timeToInteractive: 50.0,
            interactionType: 1
        };

        // Arrange
        this.ShellAnalyticGetCurrentAppStub.returns({ id: "FLP_HOME" });
        const oStatisticalRecord = {
            getStep: sandbox.stub().returns("FLP_BACK@F1234"),
            getTargetApplicationType: sandbox.stub().returns("UI5"),
            getTargetAppNameShort: sandbox.stub(),
            getTargetApplication: sandbox.stub().returns("FLP_HOME"),
            getTargetIsHomeApp: sandbox.stub().returns(false),
            getTimeStart: sandbox.stub().returns(100.0)
        };
        this.ShellAnalyticGetNavRecordsStub.returns([oStatisticalRecord]);

        this.oGetPerformanceEntriesStub.returns([{ startTime: 150.0 }]);

        // Act
        const oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(this.oInput.oFesrHandle, this.oInput.oInteraction);

        // Assert
        assert.deepEqual(oReturnedFesrHandle, oExpectedFesrHandle, "expected FESR handle information");
        assert.strictEqual(this.oGetPerformanceEntriesStub.callCount, 1, "Performance marks was read");
        assert.strictEqual(FesrEnhancer._getLastTrackedRecord(), oStatisticalRecord, "New statistical record was set");
    });

    QUnit.test("Navigation to the home page when home page was already loaded", function (assert) {
        const oExpectedFesrHandle = {
            stepName: "FLP_BACK@F1234",
            appNameLong: "sap.some.useful.App",
            appNameShort: "FLP_HOME",
            timeToInteractive: this.oInput.oFesrHandle.timeToInteractive,
            interactionType: 1
        };

        // Arrange
        this.ShellAnalyticGetCurrentAppStub.returns({ id: "FLP_HOME" });
        const oStatisticalRecord = {
            getStep: sandbox.stub().returns("FLP_BACK@F1234"),
            getTargetApplicationType: sandbox.stub().returns("UI5"),
            getTargetAppNameShort: sandbox.stub(),
            getTargetApplication: sandbox.stub().returns("FLP_HOME"),
            getTargetIsHomeApp: sandbox.stub().returns(false),
            getTimeStart: sandbox.stub().returns(200.0)
        };
        this.ShellAnalyticGetNavRecordsStub.returns([oStatisticalRecord]);

        this.oGetPerformanceEntriesStub.returns([{ startTime: 150.0 }]);

        // Act
        const oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(this.oInput.oFesrHandle, this.oInput.oInteraction);

        // Assert
        assert.deepEqual(oReturnedFesrHandle, oExpectedFesrHandle, "expected FESR handle information");
        assert.strictEqual(this.oGetPerformanceEntriesStub.callCount, 1, "Performance marks was read");
        assert.strictEqual(FesrEnhancer._getLastTrackedRecord(), oStatisticalRecord, "New statistical record was set");
    });

    QUnit.test("App to app navigation scenario when target application is not UI5 application", function (assert) {
        const oExpectedFesrHandle = {
            stepName: "A2A@F9999",
            appNameLong: "sap.some.useful.App",
            appNameShort: "F00000",
            timeToInteractive: this.oInput.oFesrHandle.timeToInteractive, // As no performance mark exist the time should be kept
            interactionType: 2
        };

        // Arrange
        this.ShellAnalyticGetCurrentAppStub.returns({ id: "F00000" });
        const oStatisticalRecord = {
            getStep: sandbox.stub().returns("A2A@F9999"),
            getTargetApplicationType: sandbox.stub().returns("TR"),
            getTargetAppNameShort: sandbox.stub(),
            getTargetApplication: sandbox.stub().returns("F00000"),
            getTargetIsHomeApp: sandbox.stub().returns(false)
        };
        this.ShellAnalyticGetNavRecordsStub.returns([oStatisticalRecord]);

        // Act
        const oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(this.oInput.oFesrHandle, this.oInput.oInteraction);

        // Assert
        assert.deepEqual(oReturnedFesrHandle, oExpectedFesrHandle, "expected FESR handle information");
        assert.strictEqual(this.oGetPerformanceEntriesStub.callCount, 0, "no performance marks read");
        assert.strictEqual(FesrEnhancer._getLastTrackedRecord(), oStatisticalRecord, "New statistical record was set");
    });

    QUnit.module("Sanitize Enhancment", {});

    QUnit.test("long Step name", function (assert) {
        // Arrange
        const oGivenEnhancement = {
            stepName: "12345678901234567890123456789"
        };
        const oExpectedEnhancement = {
            stepName: "12345678901234567890"
        };
        // Act
        const oFormattedEnhancement = FesrEnhancer.sanitizeEnhancement(oGivenEnhancement);
        assert.deepEqual(oFormattedEnhancement, oExpectedEnhancement, "value is shortened to 20 chararacters");
    });

    QUnit.test("long Step name with postfix", function (assert) {
        // Arrange
        const oGivenEnhancement = {
            stepName: "12345678901234567890123456789@H2H"
        };
        const oExpectedEnhancement = {
            stepName: "1234567890123456@H2H"
        };
        // Act
        const oFormattedEnhancement = FesrEnhancer.sanitizeEnhancement(oGivenEnhancement);
        assert.deepEqual(oFormattedEnhancement, oExpectedEnhancement, "value is shortened to 20 chararacters, postfix is visible");
    });

    QUnit.test("sanitizeEnhancements interaction type", function (assert) {
        // Arrange
        const oGivenEnhancement = {
            interactionType: 1
        };
        const oExpectedEnhancement = {
            interactionType: 1
        };
        // Act
        const oFormattedEnhancement = FesrEnhancer.sanitizeEnhancement(oGivenEnhancement);
        assert.deepEqual(oFormattedEnhancement, oExpectedEnhancement, "value is unchanged");
    });
});
