// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.appRuntime.ui5.services.Container
 */
sap.ui.define([
    "sap/ushell/appRuntime/ui5/services/Container",
    "sap/ushell/appRuntime/ui5/AppRuntimeService"
], function (oContainer, AppRuntimeService) {
    "use strict";

    var bA1 = false,
        bA2 = false,
        bS1 = false,
        bS2 = false;

    function a1 () {
        if (!bA1) {
            bA1 = true;
        }
        return Promise.resolve();
    }
    function a2 () {
        if (!bA2) {
            bA2 = true;
        }
        return Promise.resolve();
    }
    function s1 () {
        if (!bS1) {
            bS1 = true;
        }
    }
    function s2 () {
        if (!bS2) {
            bS2 = true;
        }
    }

    /* global sinon, QUnit */

    QUnit.module("sap.ushell.test.appRuntime.ui5.services.Container", {
        beforeEach: function (assert) {
            var fnDone = assert.async();
            oContainer.init("local").then(fnDone);
        },
        afterEach: function () {
            bA1 = false;
            bA2 = false;
            bS1 = false;
            bS2 = false;

            sap.ushell.Container._clearAsyncFunctionsArray();
            sap.ushell.Container._clearSyncFunctionsArray();

            delete sap.ushell.Container;
        }
    });

    QUnit.test("test attachLogoutEvent() in cFLP", function (assert) {
        var asyncArr = [],
            syncArr = [];

        sinon.stub(AppRuntimeService, "postMessageToFLP"); // override without setting different functionality

        sap.ushell.Container.attachLogoutEvent(a1, true);
        asyncArr = sap.ushell.Container._getAsyncFunctionsArray();
        assert.ok(asyncArr.length === 1, `async functions array should contain only one function, actual length: ${asyncArr.length}`);
        assert.ok(asyncArr[0] === a1, `function a1 should exist in the async functions array, actual function: ${asyncArr[0]}`);
        assert.ok(AppRuntimeService.postMessageToFLP.callCount === 1, "post message to outer shell should be called only once");

        sap.ushell.Container.attachLogoutEvent(a1, true);
        asyncArr = sap.ushell.Container._getAsyncFunctionsArray();
        assert.ok(asyncArr.length === 1, `async functions array should still contain only one function, the exiting function was tried o be attached again , actual length: ${asyncArr.length}`);
        assert.ok(asyncArr[0] === a1, `function a1 should still exist in the async functions array, actual function: ${asyncArr[0]}`);
        assert.ok(AppRuntimeService.postMessageToFLP.callCount === 1, "post message to outer shell should be called only once");

        sap.ushell.Container.attachLogoutEvent(a2, true);
        asyncArr = sap.ushell.Container._getAsyncFunctionsArray();
        assert.ok(asyncArr.length === 2, `async functions array should contain two functions, actual length: ${asyncArr.length}`);
        assert.ok(asyncArr[1] === a2, `function a2 should exist in the async functions array, actual function: ${asyncArr[1]}`);
        assert.ok(AppRuntimeService.postMessageToFLP.callCount === 1, "post message to outer shell should be called only once");

        sap.ushell.Container.attachLogoutEvent(s1);
        syncArr = sap.ushell.Container._getSyncFunctionsArray();
        assert.ok(syncArr.length === 1, `sync functions array should contain only one function, actual length: ${syncArr.length}`);
        assert.ok(syncArr[0] === s1, `function s1 should exist in the sync functions array, actual function: ${syncArr[0]}`);
        assert.ok(AppRuntimeService.postMessageToFLP.callCount === 1, "post message to outer shell should be called only once");

        sap.ushell.Container.attachLogoutEvent(s1);
        syncArr = sap.ushell.Container._getSyncFunctionsArray();
        assert.ok(syncArr.length === 1, `sync functions array should still contain only one function, the exiting function was tried o be attached again, actual length: ${syncArr.length}`);
        assert.ok(syncArr[0] === s1, `function s1 should still exist in the sync functions array, actual function: ${syncArr[0]}`);
        assert.ok(AppRuntimeService.postMessageToFLP.callCount === 1, "post message to outer shell should be called only once");

        sap.ushell.Container.attachLogoutEvent(s2);
        syncArr = sap.ushell.Container._getSyncFunctionsArray();
        assert.ok(syncArr.length === 2, `sync functions array should contain two function, actual length: ${syncArr.length}`);
        assert.ok(syncArr[1] === s2, `function s2 should exist in the sync functions array, actual function: ${syncArr[1]}`);
        assert.ok(AppRuntimeService.postMessageToFLP.callCount === 1, "post message to outer shell should be called only once");

        AppRuntimeService.postMessageToFLP.restore();
    });

    QUnit.test("test executeAsyncAndSyncLogoutFunctions() in cFLP", function (assert) {
        assert.ok(true);
        var syncArr,
            asyncArr;

        sap.ushell.Container.attachLogoutEvent(a1, true);
        asyncArr = sap.ushell.Container._getAsyncFunctionsArray();
        assert.ok(asyncArr.length === 1, `async function array should contain one function, actual length: ${asyncArr.length}`);

        sap.ushell.Container.executeAsyncAndSyncLogoutFunctions();
        assert.ok(bA1 === true, "async function a1 should been executed");

        sap.ushell.Container.attachLogoutEvent(a2, true);
        sap.ushell.Container.attachLogoutEvent(s1);
        asyncArr = sap.ushell.Container._getAsyncFunctionsArray();
        syncArr = sap.ushell.Container._getSyncFunctionsArray();
        assert.ok(asyncArr.length === 2, `async function array should contain two function, actual length: ${asyncArr.length}`);
        assert.ok(syncArr.length === 1, `sync function array should contain one function, actual length: ${syncArr.length}`);

        sap.ushell.Container.executeAsyncAndSyncLogoutFunctions();
        assert.ok(bA2 === true, "async function a2 should been executed");
        assert.ok(bS1 === true, "sync function s1 should been executed");
    });

    QUnit.test("test detachLogoutEvent() in cFLP", function (assert) {
        var asyncArr = [],
            syncArr = [];

        sap.ushell.Container.attachLogoutEvent(a1, true);
        asyncArr = sap.ushell.Container._getAsyncFunctionsArray();
        assert.ok(asyncArr.length === 1, `async function array should contain one function, actual length: ${asyncArr.length}`);
        sap.ushell.Container.detachLogoutEvent(a1);
        asyncArr = sap.ushell.Container._getAsyncFunctionsArray();
        assert.ok(asyncArr.length === 0, `async function array should not contain functions, actual length: ${asyncArr.length}`);

        sap.ushell.Container.attachLogoutEvent(s1);
        syncArr = sap.ushell.Container._getSyncFunctionsArray();
        assert.ok(syncArr.length === 1, `sync function array should contain one function, actual length: ${syncArr.length}`);
        sap.ushell.Container.detachLogoutEvent(s1);
        syncArr = sap.ushell.Container._getSyncFunctionsArray();
        assert.ok(syncArr.length === 0, `sync function array should not contain functions, actual length: ${syncArr.length}`);

        sap.ushell.Container.attachLogoutEvent(a1, true);
        sap.ushell.Container.attachLogoutEvent(a2, true);
        asyncArr = sap.ushell.Container._getAsyncFunctionsArray();
        assert.ok(asyncArr.length === 2, `async function array should contain two function, actual length: ${asyncArr.length}`);
        sap.ushell.Container.detachLogoutEvent(a2);
        asyncArr = sap.ushell.Container._getAsyncFunctionsArray();
        assert.ok(asyncArr.length === 1, `async function array should contain one function, actual length: ${syncArr.length}`);

        sap.ushell.Container.attachLogoutEvent(s1);
        sap.ushell.Container.attachLogoutEvent(s2);
        syncArr = sap.ushell.Container._getSyncFunctionsArray();
        assert.ok(syncArr.length === 2, `sync function array should contain two function, actual length: ${syncArr.length}`);
        sap.ushell.Container.detachLogoutEvent(s2);
        syncArr = sap.ushell.Container._getSyncFunctionsArray();
        assert.ok(syncArr.length === 1, `sync function array should contain one function, actual length: ${syncArr.length}`);

        sap.ushell.Container.detachLogoutEvent(a1);
        sap.ushell.Container.detachLogoutEvent(s1);
        asyncArr = sap.ushell.Container._getAsyncFunctionsArray();
        syncArr = sap.ushell.Container._getSyncFunctionsArray();
        assert.ok(asyncArr.length === 0, `async function array should not contain functions, actual length: ${asyncArr.length}`);
        assert.ok(syncArr.length === 0, `sync function array should not contain functions, actual length: ${syncArr.length}`);
    });
});
