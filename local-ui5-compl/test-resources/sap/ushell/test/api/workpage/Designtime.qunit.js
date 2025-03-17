// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.api.workpage.Designtime
 */
sap.ui.define([
    "sap/ushell/api/workpage/Designtime",
    "sap/ushell/utils/workpage/WorkPageVizInstantiation",
    "sap/base/util/extend"
], function (
    Designtime,
    WorkPageVizInstantiation,
    extend
) {
    "use strict";

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox({});

    QUnit.module("getInstance", {
        beforeEach: function () {
            this.oFakeWorkPageVizInstantiation = {
                test: "WorkPageVizInstantiation"
            };
            this.oWorkPageVizInstantiationGetInstanceStub = sandbox.stub(WorkPageVizInstantiation, "getInstance").resolves(this.oFakeWorkPageVizInstantiation);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("instantiation works", function (assert) {
        return Designtime.getInstance().then((oDesigntime) => {
            assert.ok(oDesigntime, "The Designtime was instantiated.");
            assert.deepEqual(oDesigntime._oWorkPageVizInstantiation, this.oFakeWorkPageVizInstantiation, "Designtime was constructed with correct WorkPageVizInstantiation");
            assert.strictEqual(this.oWorkPageVizInstantiationGetInstanceStub.callCount, 1, "WorkPageVizInstantiation.getInstance was called once");
        });
    });

    QUnit.module("createVizInstance", {
        beforeEach: function () {
            this.oFakeVizInstance = {
                test: "VizInstance"
            };
            this.oFakeTileCardConfiguration = {
                test: "TileConfiguration"
            };
            this.oCreateVizInstanceStub = sandbox.stub().returns(this.oFakeVizInstance);
            this.oCreateTileCardConfiguration = sandbox.stub().returns(this.oFakeTileCardConfiguration);
            const oWorkPageVizInstantiationStub = {
                createVizInstance: this.oCreateVizInstanceStub,
                createTileCardConfiguration: this.oCreateTileCardConfiguration
            };
            this.oDesigntime = new Designtime(oWorkPageVizInstantiationStub);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("calls WorkPageVizInstantiation.createVizInstance with the correct data", function (assert) {
        const oVizData = {
            id: "test-viz"
        };
        const oExpectedVizData = extend({}, oVizData, {
            preview: true
        });

        const oVizInstance = this.oDesigntime.createVizInstance(oVizData);

        assert.strictEqual(this.oCreateVizInstanceStub.callCount, 1, "createVizInstance was called once.");
        assert.deepEqual(this.oCreateVizInstanceStub.firstCall.args, [oExpectedVizData], "createVizInstance was called with correct arguments.");
        assert.deepEqual(oVizInstance, this.oFakeVizInstance, "viz instance was returned.");
    });

    QUnit.test("WorkPageVizInstantiation.createVizInstance does not modify the vizData", function (assert) {
        const oVizData = {
            id: "test-viz"
        };
        const oOriginalVizData = extend({}, oVizData);

        this.oDesigntime.createVizInstance(oVizData);

        assert.deepEqual(oVizData, oOriginalVizData, "vizData was not modified.");
    });

    QUnit.test("calls WorkPageVizInstantiation.createTileCardConfiguration with the correct data", function (assert) {
        const oVizData = {
            id: "test-viz"
        };
        const oExpectedVizData = extend({}, oVizData, {
            preview: true
        });

        const oTileCardConfiguration = this.oDesigntime.createTileCardConfiguration(oVizData);

        assert.strictEqual(this.oCreateTileCardConfiguration.callCount, 1, "createVizInstance was called once.");
        assert.deepEqual(this.oCreateTileCardConfiguration.firstCall.args, [oExpectedVizData], "createVizInstance was called with correct arguments.");
        assert.deepEqual(oTileCardConfiguration, this.oFakeTileCardConfiguration, "ctile configuration was returned.");
    });

    QUnit.test("WorkPageVizInstantiation.createTileCardConfiguration does not modify the vizData", function (assert) {
        const oVizData = {
            id: "test-viz"
        };
        const oOriginalVizData = extend({}, oVizData);

        this.oDesigntime.createTileCardConfiguration(oVizData);

        assert.deepEqual(oVizData, oOriginalVizData, "vizData was not modified.");
    });

});
