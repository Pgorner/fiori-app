// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.utils.Deferred
 */
sap.ui.define([
    "sap/ushell/utils/Deferred"
], function (
    Deferred
) {
    "use strict";

    /* global QUnit */

    QUnit.module("Deferred");

    QUnit.test("Resolve", async function (assert) {
        const oDeferred = new Deferred();
        const oPromise = oDeferred.promise();

        assert.strictEqual(oPromise.state(), "pending", "Unresolved promise has pending state");
        oDeferred.resolve("xyz");

        const result = await oPromise;
        assert.strictEqual(oPromise.state(), "resolved", "Resolved promise has resolved state");
        assert.strictEqual(result, "xyz", "Correct value returned");
    });

    QUnit.test("Reject", async function (assert) {
        const oDeferred = new Deferred();
        const oPromise = oDeferred.promise();

        oPromise.catch((v) => assert.strictEqual(v, "abc", "Rejected with correct value"));
        oPromise.then((v) => assert.notOk(true, "Rejected ptomise should never call .then callback"));

        assert.strictEqual(oPromise.state(), "pending", "Unresolved promise has pending state");

        oDeferred.reject("abc");
        await oPromise.catch(() => {});

        assert.strictEqual(oPromise.state(), "rejected", "Rejected promise has rejected state");
    });

    QUnit.test("Done", async function (assert) {
        const oDeferred = new Deferred();
        const oPromise = oDeferred.promise();

        oPromise.done((v) => assert.strictEqual(v, "xyz", "Done with correct value"));
        oDeferred.resolve("xyz");
        await oPromise;
    });

    QUnit.test("Fail", async function (assert) {
        const oDeferred = new Deferred();
        const oPromise = oDeferred.promise();

        oPromise.fail((v) => assert.strictEqual(v, "abc", "Failed with correct value"));

        oDeferred.reject("abc");
        await oPromise.catch(() => {});
    });

    QUnit.test("Always", async function (assert) {
        const oDeferred = new Deferred();
        const oPromise = oDeferred.promise();

        oPromise.always(() => assert.ok(true, "always is always called"));
        oDeferred.resolve("xyz");
        await oPromise;
    });

});
