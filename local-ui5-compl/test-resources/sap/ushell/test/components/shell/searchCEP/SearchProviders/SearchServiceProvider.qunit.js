// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileoverview QUnit tests for sap.ushell.components.shell.searchCEP.SearchProviders.SearchServiceProvider
 */

sap.ui.define([
    "sap/ushell/components/shell/SearchCEP/SearchProviders/SearchServiceProvider",
    "sap/ushell/Container"
], function (SearchServiceProvider, Container) {
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
        assert.ok(typeof SearchServiceProvider.getName() === "string", "getName returned a string");
    });

    QUnit.module("execSearch", {
        beforeEach: function (assert) {
            var fnDone = assert.async();
            Container.init("local").then(function () {
                fnDone();
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("execSearch result ok", function (assert) {
        var oPromises = {},
            done = assert.async(),
            oGroups = {
                applications: 12,
                homePageApplications: 10,
                externalSearchApplications: 3
            };

        Object.keys(oGroups).forEach(function (sGroupKey) {
            oPromises[sGroupKey] = SearchServiceProvider.execSearch("App", sGroupKey);
        });

        Promise.all(
            Object.values(oPromises)
        ).then(function (aResult) {
            assert.equal(aResult[0].length, oGroups.applications, "search returned " + aResult[0].length + " applications");
            assert.equal(aResult[1].length, oGroups.homePageApplications, "search returned " + aResult[1].length + " homePageApplications");
            assert.equal(aResult[2].length, oGroups.externalSearchApplications, "search returned " + aResult[2].length + " externalSearchApplications");
            done();
        }, function () {
            assert.ok(false, "The promise was rejected");
            done();
        });
    });
});
