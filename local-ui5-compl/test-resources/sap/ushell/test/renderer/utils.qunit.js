// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.renderer.utils
 */
sap.ui.define([
    "sap/ui/core/EventBus",
    "sap/ushell/renderer/utils"
], function (
    EventBus,
    RendererUtils
) {
    "use strict";

    /* global QUnit */

    QUnit.test("test publishing public event", function (assert) {
        var done = assert.async();

        EventBus.getInstance().subscribe("sap.ushell.renderers.fiori2.Renderer", "testEvent", function () {
            assert.ok(true, "the event was thrown as expected");
            done();
        });
        RendererUtils.publishExternalEvent("testEvent");
    });
});
