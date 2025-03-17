// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview API facade for the DWS work page builder for usage in Runtime.
 */
sap.ui.define([
    "sap/ushell/api/workpage/Runtime",
    "sap/ushell/utils/workpage/WorkPageVizInstantiation",
    "sap/ushell/utils/workpage/WorkPageService",
    "sap/ui/integration/Host",
    "sap/base/util/extend",
    "sap/ushell/EventHub"
], function (
    Runtime,
    WorkPageVizInstantiation,
    WorkPageService,
    Host,
    extend,
    EventHub
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
        return Runtime.getInstance().then((oRuntime) => {
            assert.ok(oRuntime, "The Runtime was instantiated.");
            assert.deepEqual(oRuntime._oWorkPageVizInstantiation, this.oFakeWorkPageVizInstantiation, "Runtime was constructed with correct WorkPageVizInstantiation");
            assert.ok(oRuntime._oWorkPageService instanceof WorkPageService, "The Runtime  was constructed with a WorkPageService.");
            assert.strictEqual(this.oWorkPageVizInstantiationGetInstanceStub.callCount, 1, "WorkPageVizInstantiation.getInstance was called once");
        });
    });

    QUnit.module("createVizInstance", {
        beforeEach: function () {
            this.oFakeVizInstance = {
                test: "VizInstance"
            };
            this.oCreateVizInstanceStub = sandbox.stub().returns(this.oFakeVizInstance);
                const oWorkPageVizInstantiationStub = {
                createVizInstance: this.oCreateVizInstanceStub
            };
            this.oRuntime = new Runtime(oWorkPageVizInstantiationStub);
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
            preview: false
        });

        const oVizInstance = this.oRuntime.createVizInstance(oVizData);

        assert.strictEqual(this.oCreateVizInstanceStub.callCount, 1, "createVizInstance was called once.");
        assert.deepEqual(this.oCreateVizInstanceStub.firstCall.args, [oExpectedVizData], "createVizInstance was called with correct arguments.");
        assert.deepEqual(oVizInstance, this.oFakeVizInstance, "viz instance was returned.");
    });

    QUnit.module("fetchPageData", {
        beforeEach: function () {
            this.oFakePageData = {
                test: "Workpage Data"
            };
            this.oLoadWorkPageAndVisualizationsStub = sandbox.stub().returns(this.oFakePageData);
                const oWorkPageServiceStub = {
                loadWorkPageAndVisualizations: this.oLoadWorkPageAndVisualizationsStub
            };
            this.oRuntime = new Runtime(null, oWorkPageServiceStub);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("calls WorkPageService.loadWorkPageAndVisualizations with the correct data", function (assert) {
        const sPageId = "test-page-id";

        const oPageData = this.oRuntime.fetchPageData(sPageId);

        assert.strictEqual(this.oLoadWorkPageAndVisualizationsStub.callCount, 1,
            "WorkPageService.loadWorkPageAndVisualizations was called once.");
        assert.deepEqual(this.oLoadWorkPageAndVisualizationsStub.firstCall.args, [sPageId, true],
            "WorkPageService.loadWorkPageAndVisualizations was called with correct arguments.");
        assert.deepEqual(oPageData, this.oFakePageData, "page data was returned.");
    });

    QUnit.module("fireAfterContentAdded", {
        beforeEach: function () {
            this.oEventHubEmitStub = sandbox.stub(EventHub, "emit");
            this.oRuntime = new Runtime();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("calls EventHub.emit with the correct data", function (assert) {
        this.oRuntime.fireAfterContentAdded();

        assert.strictEqual(this.oEventHubEmitStub.callCount, 1,
            "EventHub.emit was called once.");
        assert.deepEqual(this.oEventHubEmitStub.firstCall.args, ["CenterViewPointContentRendered"],
            "EventHub.emit was called with correct arguments.");
    });

    QUnit.module("createHost", {
        beforeEach: function () {
            this.oRuntime = new Runtime();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("creates an instance of sap/ui/integration/Host", function (assert) {
        const oWorkPageHost = this.oRuntime.createHost();

        assert.ok(oWorkPageHost instanceof Host,
            "Created instance is an instance of sap/ui/integration/Host.");
    });

    QUnit.test("passes the ID correctly", function (assert) {
        const oWorkPageHost = this.oRuntime.createHost("host-id");

        assert.strictEqual(oWorkPageHost.getId(), "host-id",
            "Created instance has correct ID.");
    });

});
