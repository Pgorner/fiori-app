// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

// The functionality of the sap.ui.core.routing.History heavily depends on the events of the HashChanger.
// The HashChanger allows to replace the default instance with a custom implementation to intercept the logic -
// this is currently done by the unified shell in order to handle cross-application navigation.

// This test executes the History test suite of ui5 core in the shell context. Therefore, failures might also be caused
// by regressions in sap.ui.core.routing.History

/**
 * @fileOverview integration tests for testing sap.ui.core.routing.History in the unified shell context (sap.ushell.services.ShellNavigationInternal replaces the sap.ui.core.routing.HashChanger)
 */
sap.ui.define([
    "sap/ushell/services/ShellNavigationHashChanger",
    "sap/ui/core/routing/HashChanger",
    "sap/ushell/Container"
], function (ShellNavigationHashChanger, HashChanger, Container) {
    "use strict";

    /* global QUnit */

    var sOldHash = "",
        oHashChanger = null,
        fnShellCallback = function () { /* dummy */ },
        oStandardHashChanger = new HashChanger();

    window.sHashPrefix = "dummySO-action&/";

    QUnit.module("History in shell context", {
        beforeEach: function () {
            sOldHash = window.location.hash;

            // bootstrap required due to URLParsing service
            return Container.init("local")
                .then(function () {
                    oStandardHashChanger.replaceHash(window.sHashPrefix); // set a fake shell hash TODO: test with empty shell hash

                    oHashChanger = new ShellNavigationHashChanger();
                    oHashChanger.initShellNavigation(fnShellCallback);
                    oHashChanger.init();
                    HashChanger.replaceHashChanger(oHashChanger);
                    HashChanger.getInstance().replaceHash(""); //since the initial hash will be parsed, we want it to be empty on every test
                });
        },
        afterEach: function () {
            if (oHashChanger) {
                oHashChanger.destroy();
            }

            oStandardHashChanger.replaceHash("");
            HashChanger.replaceHashChanger(oStandardHashChanger);

            window.location.hash = sOldHash;
        }
    });

    QUnit.test("Wrapper Test", function (assert) {
        var done = assert.async();
        sap.ui.require(["sap/ui/core/qunit/routing/HistoryQunit"], function (QUnitTests) {
            assert.ok(true, "Done!");
            done();
        });
    });
});
