// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for common.load.script
 */
sap.ui.define([
    "sap/ushell/bootstrap/common/common.load.script"
], function (oScriptLoader) {
    /* global QUnit */
    "use strict";

    var PATH_TO_SCRIPT = sap.ui.require.toUrl("sap/ushell/test/bootstrap/common/dummyFileToLoad") + ".js";

    var sScriptId;

    QUnit.module("common.load.script", {
        beforeEach: function () {
        },
        afterEach: function () {
            if (sScriptId) {
                document.getElementById(sScriptId).remove();
            }
        }
    });

    [{
        testDescription: "The script should be loaded and promise should be relolved",
        scriptPath: PATH_TO_SCRIPT,
        expectedError: false
    }, {
        testDescription: "The script should not be loaded, because link is not correct and promise should be rejected",
        scriptPath: "some/not/existing/link",
        expectedError: true
    }].forEach(function (oFixture) {
        QUnit.test(oFixture.testDescription, function (assert) {
            var fnDone = assert.async();
            sScriptId = "promiseTest";
            // act
            oScriptLoader.loadScript(oFixture.scriptPath, sScriptId)
                .then(function () {
                    assert.ok(!oFixture.expectedError, "Promise should be resolved");
                    fnDone();
                })
                .catch(function () {
                    assert.ok(oFixture.expectedError, "Promise should be rejected");
                    fnDone();
                });
        });
    });

    [{
        testDescription: "check src set correct",
        scriptPath: PATH_TO_SCRIPT,
        sAttributeToTest: "src",
        sResult: PATH_TO_SCRIPT
    }, {
        testDescription: "check id set correct",
        scriptPath: PATH_TO_SCRIPT,
        sScriptId: "testId",
        sAttributeToTest: "id",
        sResult: "testId"
    }, {
        testDescription: "check defer set correct",
        scriptPath: PATH_TO_SCRIPT,
        bDefer: true,
        sAttributeToTest: "defer",
        sResult: ""
    }, {
        testDescription: "check defer does not set",
        scriptPath: PATH_TO_SCRIPT,
        bDefer: false,
        sAttributeToTest: "defer",
        sResult: undefined
    }].forEach(function (oFixture) {
        QUnit.test(oFixture.testDescription, function (assert) {
            var fnDone = assert.async(),
                bDefer = oFixture.bDefer || false;
            sScriptId = oFixture.sScriptId || "scriptToRemove";
            // act
            oScriptLoader.loadScript(oFixture.scriptPath, sScriptId, bDefer)
                .then(function () {
                    assert.equal(
                        document.getElementById(sScriptId).getAttribute(oFixture.sAttributeToTest),
                        oFixture.sResult,
                        oFixture.sAttributeToTest + " attribute should be equal: " + oFixture.sResult
                    );
                    fnDone();
                })
                .catch(function () {
                    assert.ok(false, "Promise must be resolved");
                    fnDone();
                });
        });
    });
});
