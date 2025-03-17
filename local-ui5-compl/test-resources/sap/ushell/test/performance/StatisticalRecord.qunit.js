// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.performance.StatisticalRecord
 */
sap.ui.define([
    "sap/ushell/performance/StatisticalRecord",
    "sap/ui/performance/trace/Interaction"
], function (
    StatisticalRecord,
    Interaction
) {
    "use strict";

    /* global QUnit, sinon */

    const sandbox = sinon.sandbox.create();

    QUnit.module("Create/close a StatisticalRecord", {
        beforeEach: function () {
            this.oResolveAsyncStepStub = sandbox.stub();
            this.oNotifyAsyncStepStub = sandbox.stub(Interaction, "notifyAsyncStep").returns(this.oResolveAsyncStepStub);
            this.oPerformanceStub = sandbox.stub(performance, "now");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Create StatisticalRecord with open status", function (assert) {
        // Act
        const oStatisticalRecord = new StatisticalRecord();
        // Assert
        assert.notOk(oStatisticalRecord.isClosed(), "Status of StatisticalRecord was opened when create the new instance");
        assert.strictEqual(this.oNotifyAsyncStepStub.callCount, 1, "notifyAsyncStep was called");
        assert.strictEqual(this.oResolveAsyncStepStub.callCount, 0, "notifyAsyncStep-resolve was not called");
    });

    QUnit.test("Close StatisticalRecord should calculate the step", function (assert) {
        // Arrange
        this.oPerformanceStub.returns(200.0);
        const oStatisticalRecord = new StatisticalRecord();
        oStatisticalRecord.setTimeStart(100.0);
        // Act
        oStatisticalRecord.closeRecord();
        // Assert
        assert.ok(oStatisticalRecord.isClosed(), "StatisticalRecord was closed");
        assert.ok(typeof oStatisticalRecord.getStep() === "string", "a step was calculated");
        assert.strictEqual(oStatisticalRecord.getTimeEnd(), 200.0, "TimeEnd was taken from performance.now()");
        assert.strictEqual(this.oNotifyAsyncStepStub.callCount, 1, "notifyAsyncStep was called");
        assert.strictEqual(this.oResolveAsyncStepStub.callCount, 1, "notifyAsyncStep-resolve was called");
    });

    QUnit.test("Close StatisticalRecord with error", function (assert) {
        // Arrange
        this.oPerformanceStub.returns(200.0);
        const oStatisticalRecord = new StatisticalRecord();
        oStatisticalRecord.setTimeStart(100.0);
        // Act
        oStatisticalRecord.closeRecordWithError();
        // Assert
        assert.ok(oStatisticalRecord.isClosedWithError(), "StatisticalRecord was closed with error");
        assert.strictEqual(oStatisticalRecord.getStep(), null, "no step was calculated");
        assert.strictEqual(oStatisticalRecord.getTimeEnd(), 200.0, "TimeEnd was taken from performance.now()");
        assert.strictEqual(this.oNotifyAsyncStepStub.callCount, 1, "notifyAsyncStep was called");
        assert.strictEqual(this.oResolveAsyncStepStub.callCount, 1, "notifyAsyncStep-resolve was called");
    });

    QUnit.test("isEqual calculates based on the start time", function (assert) {
        // Arrange
        const oStatisticalRecord = new StatisticalRecord();
        oStatisticalRecord.setTimeStart(100.0);
        const oAnotherRecord = new StatisticalRecord();
        oAnotherRecord.setTimeStart(200.0);
        // Act
        const bEqualToItself = oStatisticalRecord.isEqual(oStatisticalRecord);
        const bEqualToAnother = oStatisticalRecord.isEqual(oAnotherRecord);
        // Assert
        assert.ok(bEqualToItself, "StatisticalRecord was equal to the same record");
        assert.notOk(bEqualToAnother, "StatisticalRecords was equal if start time is different");
    });

    QUnit.module("Calculate steps for a StatisticalRecord", {
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("App to App navigation when source and target application is not FLP_HOME", function (assert) {
        // Arrange
        const oStatisticalRecord = new StatisticalRecord();
        oStatisticalRecord.setSourceApplication("F123");
        oStatisticalRecord.setTargetApplication("F321");
        // Act
        oStatisticalRecord.closeRecord();
        // Assert
        assert.strictEqual(oStatisticalRecord.getStep(), "A2A@F123", "Correct step was calculated");
    });

    QUnit.test("Navigation to home should return FLP_BACK step", function (assert) {
        // Arrange
        const oStatisticalRecord = new StatisticalRecord();
        oStatisticalRecord.setSourceApplication("F123");
        oStatisticalRecord.setTargetApplication("FLP_HOME");
        // Act
        oStatisticalRecord.closeRecord();
        // Assert
        assert.strictEqual(oStatisticalRecord.getStep(), "FLP_BACK@F123", "Correct step was calculated");
    });

    QUnit.test("Navigation to application from FLP_HOME should return FLP@HOMEPAGE_TILE", function (assert) {
        // Arrange
        const oStatisticalRecord = new StatisticalRecord();
        oStatisticalRecord.setSourceApplication("FLP_HOME");
        oStatisticalRecord.setTargetApplication("F123");
        // Act
        oStatisticalRecord.closeRecord();
        // Assert
        assert.strictEqual(oStatisticalRecord.getStep(), "FLP@HOMEPAGE_TILE", "Correct step was calculated");
    });

    QUnit.test("Open application directly should return FLP@DEEP_LINK", function (assert) {
        // Arrange
        const oStatisticalRecord = new StatisticalRecord();
        oStatisticalRecord.setSourceApplication(undefined);
        oStatisticalRecord.setTargetApplication("F123");
        // Act
        oStatisticalRecord.closeRecord();
        // Assert
        assert.strictEqual(oStatisticalRecord.getStep(), "FLP@DEEP_LINK", "Correct step was calculated");
    });

    QUnit.test("Open PageRuntime", function (assert) {
        // Arrange
        const oStatisticalRecord = new StatisticalRecord();
        oStatisticalRecord.setSourceApplication(undefined);
        oStatisticalRecord.setTargetApplication("FLP_PAGE");
        // Act
        oStatisticalRecord.closeRecord();
        // Assert
        assert.strictEqual(oStatisticalRecord.getStep(), "FLP@DURING_LOAD", "Correct step was calculated");
    });

    QUnit.test("Step: Home to Home while navigation to classical homepage", function (assert) {
        // Arrange
        const oStatisticalRecord = new StatisticalRecord();
        oStatisticalRecord.setSourceApplication("FLP_FINDER");
        oStatisticalRecord.setTargetApplication("FLP_HOME");
        oStatisticalRecord.enhanceTargetApplicationData({pageId: "myPageId"});
        // Act
        oStatisticalRecord.closeRecord();
        // Assert
        assert.strictEqual(oStatisticalRecord.getStep(), "FLP_HOME@H2H", "Correct step was calculated");
    });

    QUnit.test("Step: Home to Home while navigation to a page", function (assert) {
        // Arrange
        const oStatisticalRecord = new StatisticalRecord();
        oStatisticalRecord.setSourceApplication("FLP_PAGE");
        oStatisticalRecord.setTargetApplication("FLP_PAGE");
        oStatisticalRecord.enhanceTargetApplicationData({pageId: "myPageId"});
        // Act
        oStatisticalRecord.closeRecord();
        // Assert
        assert.strictEqual(oStatisticalRecord.getStep(), "myPageId@H2H", "Correct step was calculated");
    });

    QUnit.test("Step: Home to Home while navigation to the finder", function (assert) {
        // Arrange
        const oStatisticalRecord = new StatisticalRecord();
        oStatisticalRecord.setSourceApplication("FLP_HOME");
        oStatisticalRecord.setTargetApplication("FLP_FINDER");
        oStatisticalRecord.enhanceTargetApplicationData({pageId: "myPageId"});
        // Act
        oStatisticalRecord.closeRecord();
        // Assert
        assert.strictEqual(oStatisticalRecord.getStep(), "FLP_FINDER@H2H", "Correct step was calculated");
    });

    QUnit.test("Step: Home to Home while navigating to custom home", function (assert) {
        // Arrange
        const oStatisticalRecord = new StatisticalRecord();
        oStatisticalRecord.setSourceApplication("FLP_PAGE");
        oStatisticalRecord.setTargetApplication("custom.home");
        oStatisticalRecord.setTargetIsHomeApp(true);
        // Act
        oStatisticalRecord.closeRecord();
        // Assert
        assert.strictEqual(oStatisticalRecord.getStep(), "custom.home@H2H", "Correct step was calculated");
    });

    QUnit.test("Method getTargetAppNameShort while navigating to a page", function (assert) {
        // Arrange
        const oStatisticalRecord = new StatisticalRecord();
        oStatisticalRecord.setSourceApplication("custom.home");
        oStatisticalRecord.setSourceIsHomeApp(true);
        oStatisticalRecord.setTargetApplication("FLP_PAGE");
        oStatisticalRecord.enhanceTargetApplicationData({ pageId: "Hundred"})
        // Act
        ;
        const sAppNameShort = oStatisticalRecord.getTargetAppNameShort();
        // Assert
        assert.strictEqual(sAppNameShort, "FLP_PAGE", "Correct target short app name was calculated");
    });

    QUnit.test("Open classical homepage", function (assert) {
        // Arrange
        const oStatisticalRecord = new StatisticalRecord();
        oStatisticalRecord.setSourceApplication(undefined);
        oStatisticalRecord.setTargetApplication("FLP_HOME");
        // Act
        oStatisticalRecord.closeRecord();
        // Assert
        assert.strictEqual(oStatisticalRecord.getStep(), "FLP@DURING_LOAD", "Correct step was calculated");
    });

    QUnit.test("There is no status if target and source application is not defined", function (assert) {
        // Arrange
        const oStatisticalRecord = new StatisticalRecord();
        oStatisticalRecord.setSourceApplication(undefined);
        oStatisticalRecord.setTargetApplication(undefined);
        // Act
        oStatisticalRecord.closeRecord();
        // Assert
        assert.strictEqual(oStatisticalRecord.getStep(), "", "Correct step was calculated");
    });

    QUnit.test("Load homepage first time", function (assert) {
        // Arrange
        const oStatisticalRecord = new StatisticalRecord();
        oStatisticalRecord.setSourceApplication("F1234");
        oStatisticalRecord.setTargetApplication("FLP_HOME");
        oStatisticalRecord.setHomepageLoading(true);
        // Act
        oStatisticalRecord.closeRecord();
        // Assert
        assert.strictEqual(oStatisticalRecord.getStep(), "FLP_BACK@F1234", "Correct step was calculated");
    });

    QUnit.test("Navigate back from finder", function (assert) {
        // Arrange
        const oStatisticalRecord = new StatisticalRecord();
        oStatisticalRecord.setSourceApplication("F1234");
        oStatisticalRecord.setTargetApplication("FLP_FINDER");
        // Act
        oStatisticalRecord.closeRecord();
        // Assert
        assert.strictEqual(oStatisticalRecord.getStep(), "FLP_BACK@F1234", "Correct step was calculated");
    });

    QUnit.test("Load custom page", function (assert) {
        // Arrange
        const oStatisticalRecord = new StatisticalRecord();
        oStatisticalRecord.setSourceApplication(undefined);
        oStatisticalRecord.setTargetApplication("custom.home");
        oStatisticalRecord.setHomepageLoading(true);
        oStatisticalRecord.setTargetIsHomeApp(true);
        // Act
        oStatisticalRecord.closeRecord();
        // Assert
        assert.strictEqual(oStatisticalRecord.getStep(), "FLP@DURING_LOAD", "Correct step was calculated");
    });

    QUnit.test("Navigation to application from custom home should return APPSTART@CUSTOMHOME", function (assert) {
        // Arrange
        const oStatisticalRecord = new StatisticalRecord();
        oStatisticalRecord.setSourceApplication("custom.home");
        oStatisticalRecord.setTargetApplication("any.app");
        oStatisticalRecord.setSourceIsHomeApp(true);
        // Act
        oStatisticalRecord.closeRecord();
        // Assert
        assert.strictEqual(oStatisticalRecord.getStep(), "APPSTART@CUSTOMHOME", "Correct step was calculated");
        assert.strictEqual(oStatisticalRecord.getSourceIsHomeApp(), true, "SourceIsHomeApp was set as expected");
    });

    QUnit.test("Navigation to custom home from application should return FLP_BACK@any.app", function (assert) {
        // Arrange
        const oStatisticalRecord = new StatisticalRecord();
        oStatisticalRecord.setSourceApplication("any.app");
        oStatisticalRecord.setTargetApplication("custom.home");
        oStatisticalRecord.setTargetIsHomeApp(true);
        // Act
        oStatisticalRecord.closeRecord();
        // Assert
        assert.strictEqual(oStatisticalRecord.getStep(), "FLP_BACK@any.app", "Correct step was calculated");
    });
});
