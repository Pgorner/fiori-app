// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.applicationIntegration.AppLifeCyclejs
 */
sap.ui.define([
    "sap/ushell/components/applicationIntegration/Storage"
], function (
    Storage
) {
    "use strict";

    /* global QUnit */

    QUnit.module("sap.ushell.test.components.applicationIntegration.Storage", {
        beforeEach: function () {
            Storage._clean();
        },
        afterEach: function () {
        }
    });

    QUnit.test("check set/get", function (assert) {
        assert.equal(Storage.length(), 0, "Storage.length() should be 0");

        Storage.set("A", 1);
        assert.equal(Storage.length(), 1, "Storage.length() should be 1");
        Storage.set("A", 4);
        assert.equal(Storage.length(), 1, "Storage.length() should be 1");
        Storage.set("B", 1);
        assert.equal(Storage.length(), 2, "Storage.length() should be 2");
        Storage.set("B", 8);
        assert.equal(Storage.length(), 2, "Storage.length() should be 3");

        assert.equal(Storage.get("A"), 4, "A should be 4");
        assert.equal(Storage.get("B"), 8, "B should be 8");
        assert.equal(Storage.get("C"), undefined, "C should be undefined");

        Storage.forEach(function doTest (iVal, sKey, oStorage) {
            if (sKey === "A") {
                assert.equal(iVal, 4, "value should be 4");
            } else if (sKey === "B") {
                assert.equal(iVal, 8, "value should be 8");
            } else {
                assert.ok(false, "should not reach this");
            }
        });

        Storage.removeById("C");
        assert.equal(Storage.length(), 2, "Storage.length() should be 2");
        Storage.removeById("B");
        assert.equal(Storage.length(), 1, "Storage.length() should be 1");
        Storage.removeById("A");
        assert.equal(Storage.length(), 0, "Storage.length() should be 0");
    });

    QUnit.test("check removeByContainer", function (assert) {
        assert.equal(Storage.length(), 0, "Storage.length() should be 0");

        var oContainer = "DUMMY-CONTAINER";
        var oEntry = {
            container: oContainer
        };

        Storage.set("A", {
            container: "1"
        });
        Storage.set("B", oEntry);
        Storage.set("C", {
            container: "2"
        });
        Storage.set("D", oEntry);
        Storage.set("E", {
            container: "3"
        });

        assert.equal(Storage.length(), 5, "Storage.length() should be 5");
        Storage.removeByContainer(oContainer);
        assert.equal(Storage.length(), 3, "Storage.length() should be 3");
        assert.ok(Storage.get("A") !== undefined);
        assert.ok(Storage.get("B") === undefined);
        assert.ok(Storage.get("C") !== undefined);
        assert.ok(Storage.get("D") === undefined);
        assert.ok(Storage.get("E") !== undefined);
    });
});
