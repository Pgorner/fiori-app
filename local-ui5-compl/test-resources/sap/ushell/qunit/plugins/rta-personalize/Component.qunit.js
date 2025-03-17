// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/ushell/plugins/rta-personalize/Component"
], function (
    Log,
    RTAPlugin
) {
    "use strict";

    /* global QUnit sinon*/
    var sandbox = sinon.createSandbox();

    QUnit.module("init functionality", {
        beforeEach: function () {
            this.oLogSpy = sandbox.spy(Log, "error");
            this.oPlugin = new RTAPlugin();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("After the rta-personalize plugin is initialized", function (assert) {
        assert.equal(this.oLogSpy.callCount, 1, "then log error was called once");
        // eslint-disable-next-line max-len
        assert.ok(this.oLogSpy.calledWith("[Deprecated] The FLP plugin for RTA Personalization (sap.ushell.plugins.rta-personalize) is no longer supported."), "and log error was called with correct message");
    });

});
