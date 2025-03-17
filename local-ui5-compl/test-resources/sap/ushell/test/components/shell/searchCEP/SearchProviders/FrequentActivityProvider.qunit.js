// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileoverview QUnit tests for sap.ushell.components.shell.searchCEP.SearchProviders.FrequentActivityProvider
 */

sap.ui.define([
    "sap/ushell/components/shell/SearchCEP/SearchProviders/FrequentActivityProvider",
    "sap/ushell/Container"
], function (FrequentActivityProvider, Container) {
    "use strict";

    /* global QUnit sinon */

    var sandbox = sinon.sandbox.create();

    QUnit.module("execSearch", {
        beforeEach: function (assert) {
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("getName returns string", function (assert) {
        assert.ok(typeof FrequentActivityProvider.getName() === "string", "getName returned a string");
    });

    QUnit.module("execSearch", {
        beforeEach: function (assert) {
            var fnDone = assert.async();
            Container.init("local").then(function () {
                // Remove possibly existing User Recents from local storage
                Container.getServiceAsync("UserRecents").then(function (UserRecents) {
                    UserRecents.clearRecentActivities();
                    fnDone();
                });
            });
        },
        afterEach: function () {
            sandbox.restore();
            // delete Container;
        }
    });

    QUnit.test("execSearch result ok", function (assert) {
        var done = assert.async();
        FrequentActivityProvider.execSearch().then(function (aResult) {
            assert.ok(true, "The promise was resolved");
            assert.strictEqual(Array.isArray(aResult), true, "The promise was resolved with array");
            done();
        }, function () {
            assert.ok(false, "The promise was rejected");
            done();
        });
    });
});
