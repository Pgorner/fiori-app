// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.URLShortening
 *
 * @deprecated since 1.119
 */
sap.ui.define([
    "sap/ushell/utils/UrlShortening",
    "sap/base/Log",
    "sap/ushell/Container"
], function (
    UrlShortening,
    Log,
    Container
) {
    "use strict";

    /* global QUnit */

    QUnit.module("sap.ushell.services.URLShortening", {
        beforeEach: function () {
            return Container.init("local");
        },
        // This method is called after each test. Add every restoration code here.
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("getServiceURLShortening", function (assert) {
        var done = assert.async();
        sap.ushell.Container.getServiceAsync("URLShortening").then(function (oURLShortening) {
            assert.ok(oURLShortening !== undefined);
            done();
        });
    });

    QUnit.test("shortenURLEmpty", function (assert) {
        var done = assert.async();
        sap.ushell.Container.getServiceAsync("URLShortening").then(function (oService) {
            assert.deepEqual({ hash: "#" }, oService.compactHash("#"));
            assert.deepEqual({ hash: "#ABC-DEF~HIJ&/ABC=DEF" }, oService.compactHash("#ABC-DEF~HIJ&/ABC=DEF"));
            done();
        });
    });
});
