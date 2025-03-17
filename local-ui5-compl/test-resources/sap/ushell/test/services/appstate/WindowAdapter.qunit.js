// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for _AppState's WindowAdapter
 */
sap.ui.define([
    "sap/ushell/services/appstate/WindowAdapter", "sap/ui/thirdparty/jquery"
], function (WindowAdapter, jQuery) {
    "use strict";

    /* global QUnit, sinon */

    QUnit.module("WindowAdapter", {
        beforeEach: function () {
            this.oldDataObject = WindowAdapter.prototype.data;
            WindowAdapter.prototype.data = {
                addAsHead: sinon.spy()
            };
        },
        afterEach: function () {
            WindowAdapter.prototype.data = this.oldDataObject;
        }
    });

    QUnit.test("WindowAdapter: buffer does not fill when no promise in config", function (assert) {
        var oAdapter = new WindowAdapter();
        assert.ok(oAdapter.data.addAsHead.notCalled, "buffer does not fill when no promise in config");
    });

    QUnit.test("WindowAdapter: state from promise is added to buffer", function (assert) {
        var fnDone = assert.async(),
            oAppStatePromise = Promise.resolve({
                ABC: JSON.stringify({ abc: 1 }),
                DEF: JSON.stringify({ def: 1 })
            }),
            oAdapterConfig = {
                config: {
                    initialAppStatesPromise: oAppStatePromise
                }
            };
        var oAdapter = new WindowAdapter(null, null, oAdapterConfig);
        setTimeout(function () {
            assert.ok(oAdapter.data.addAsHead.calledTwice, "addAsHead called for all states");
            assert.deepEqual(oAdapter.data.addAsHead.getCall(0).args, ["ABC", JSON.stringify({ abc: 1 })], "The correct state was added");
            assert.deepEqual(oAdapter.data.addAsHead.getCall(1).args, ["DEF", JSON.stringify({ def: 1 })], "The correct state was added");
            fnDone();
        }, 10);
    });

    QUnit.test("WindowAdapter: state from config is added to buffer", function (assert) {
        var oState = {
            ABC: JSON.stringify({ abc: 1 })
        };
        var oAdapterConfig = {
            config: {
                initialAppStates: oState
            }
        };
        var oAdapter = new WindowAdapter(null, null, oAdapterConfig);
        assert.ok(oAdapter.data.addAsHead.calledOnce, "addAsHead called for all states");
        assert.deepEqual(oAdapter.data.addAsHead.getCall(0).args, ["ABC", JSON.stringify({ abc: 1 })], "The correct state was added");
    });

    QUnit.module("checkIfTransient");

    QUnit.test("Not transient AppState", function (assert) {
        // Arrange
        var bExpectedResult = false;

        // Act
        var bResult = WindowAdapter.prototype._checkIfTransient("ASKEYA");

        // Assert
        assert.strictEqual(bResult, bExpectedResult, "The expected result is returned");
    });

    QUnit.test("Transient AppState", function (assert) {
        // Arrange
        var bExpectedResult = true;

        // Act
        var bResult = WindowAdapter.prototype._checkIfTransient("TASKEYA");

        // Assert
        assert.strictEqual(bResult, bExpectedResult, "The expected result is returned");
    });

    QUnit.module("loadAppState");

    QUnit.test("Backend call for not transient AppState", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oState = {
            ASKEYA: JSON.stringify({ askeya: 1 })
        };
        var oAdapterConfig = {
            config: {
                initialAppStates: oState
            }
        };
        var oLoadAppStateBackendStub = sinon.stub().returns(new jQuery.Deferred().resolve());
        var oAdapter = new WindowAdapter("serviceInstance", { loadAppState: oLoadAppStateBackendStub }, oAdapterConfig);
        var oAppStateFromWindowStub = sinon.stub(oAdapter.data, "getByKey");
        oAppStateFromWindowStub.withArgs("ASKEYA").returns(undefined);

        // Act
        oAdapter.loadAppState("ASKEYA")
            .done(function () {
                // Assert
                assert.ok(oLoadAppStateBackendStub.calledOnce, "backend call as expected");
                fnDone();
                oAppStateFromWindowStub.restore();
            });
    });

    QUnit.test("No backend call for transient AppState", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oState = {
            TASKEYA: JSON.stringify({ taskeya: 1 })
        };
        var oAdapterConfig = {
            config: {
                initialAppStates: oState
            }
        };
        var oLoadAppStateBackendStub = sinon.stub().returns(new jQuery.Deferred().resolve());
        var oAdapter = new WindowAdapter("serviceInstance", { loadAppState: oLoadAppStateBackendStub }, oAdapterConfig);
        var oAppStateFromWindowStub = sinon.stub(oAdapter.data, "getByKey");
        oAppStateFromWindowStub.withArgs("TASKEYA").returns(undefined);
        // Act
        oAdapter.loadAppState("TASKEYA")
            .fail(function () {
                // Assert
                assert.ok(oLoadAppStateBackendStub.notCalled, " no backend call as expected");
                fnDone();
                oAppStateFromWindowStub.restore();
            });
    });

    QUnit.module("deleteAppState");

    QUnit.test("Backend call for not transient AppState", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oState = {
            ASKEYA: JSON.stringify({ askeya: 1 })
        };
        var oAdapterConfig = {
            config: {
                initialAppStates: oState
            }
        };
        var oDeleteAppStateBackendStub = sinon.stub().returns(new jQuery.Deferred().resolve());
        var oAdapter = new WindowAdapter("serviceInstance", { deleteAppState: oDeleteAppStateBackendStub }, oAdapterConfig);

        // Act
        oAdapter.deleteAppState("ASKEYA")
            .done(function () {
                // Assert
                assert.ok(oDeleteAppStateBackendStub.calledOnce, "backend call as expected");
                fnDone();
            });
    });
});
