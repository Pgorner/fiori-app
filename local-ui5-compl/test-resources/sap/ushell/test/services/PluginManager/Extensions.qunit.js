// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.PluginManager.Extensions
 */
sap.ui.define([
    "sap/ushell/services/PluginManager/Extensions",
    "sap/ushell/services/PluginManager/HeaderExtensions",
    "sap/ushell/services/PluginManager/MenuExtensions"
], function (fnGetExtensions, HeaderExtensions, fnMenuExtensions) {
    "use strict";

    /* global QUnit */

    QUnit.module("sap.ushell.services.PluginManager.Extensions", {
    });

    QUnit.test("getExtensions return correct API when correct parameter", function (assert) {
        var fnDone = assert.async();

        Promise.all([
            fnGetExtensions("test-plugin", "Header"),
            fnGetExtensions("test-plugin", "Menu")
        ]).then(function (aExtensions) {
            assert.equal(aExtensions[0], HeaderExtensions, "HeaderExtensions is returned");
            assert.ok(aExtensions[1].hasOwnProperty("getMenuEntryProvider"), "MenuExtensions is returned");
            fnDone();
        });
    });

    QUnit.test("getExtensions reject when called with not existing extension parameter", function (assert) {
        var fnDone = assert.async();

        fnGetExtensions("test-plugin", "SomeWrongName").then(function () {
            assert.ok(false, "getExtensions must reject");
            fnDone();
        }).catch(function (sError) {
            assert.ok(true, "getExtensions must reject");
            assert.ok(sError.length > 0, "Error message is not empty");
            fnDone();
        });
    });
});
