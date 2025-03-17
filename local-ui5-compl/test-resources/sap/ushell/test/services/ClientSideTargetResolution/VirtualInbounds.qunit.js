// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for ClientSideTargetResolution's VirtualInbound
 */
sap.ui.define([
    "sap/ushell/services/ClientSideTargetResolution/VirtualInbounds"
], function (VirtualInbounds) {
    "use strict";

    /* global QUnit */

    QUnit.module("VirtualInbounds");

    QUnit.test("VirtualInbounds: getInbounds should return array", function (assert) {
        assert.ok(Array.isArray(VirtualInbounds.getInbounds()), "VirtualInbounds.getInbounds() should return array");
    });
});
