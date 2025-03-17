// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.adapters.local.UserInfoAdapter
 */
sap.ui.define([
    "sap/ushell/adapters/local/UserInfoAdapter",
    "sap/base/Log",
    "sap/ushell/Container",
    "sap/ushell/services/PersonalizationV2"
], function (
    UserInfoAdapter,
    Log,
    Container,
    PersonalizationV2
) {
    "use strict";

    const { KeyCategory, WriteFrequency } = PersonalizationV2.prototype;

    /* global QUnit sinon */

    var sandbox = sinon.sandbox.create();

    var aExpectedDefaultThemeConfiguration = [
            { id: "sap_horizon", name: "SAP Morning Horizon" },
            { id: "sap_horizon_dark", name: "SAP Evening Horizon" },
            { id: "sap_horizon_hcb", name: "SAP HCB (SAP Horizon)" },
            { id: "sap_horizon_hcw", name: "SAP HCW (SAP Horizon)" },
            { id: "sap_fiori_3", name: "SAP Quartz Light" },
            { id: "sap_fiori_3_dark", name: "SAP Quartz Dark" },
            { id: "sap_belize_plus", name: "SAP Belize Plus" },
            { id: "sap_belize", name: "SAP Belize" },
            { id: "theme1_id", name: "Custom Theme" },
            { id: "sap_fiori_3_hcb", name: "SAP Quartz HCB" },
            { id: "sap_fiori_3_hcw", name: "SAP Quartz HCW" }
        ],
        fnClone = function (oJson) {
            return JSON.parse(JSON.stringify(oJson));
        };

    QUnit.module("sap.ushell.adapters.local.UserInfoAdapter - getThemeList", {
        beforeEach: function (assert) {
            var done = assert.async();
            Container.init("local").then(done);
        }
    });

    [
        { testInput: {}, testDescription: "valid structure, emptyConfig" },
        { testInput: {}, testDescription: "no 'config' key provided" },
        { testInput: undefined, testDescription: "undefined config" }
    ].forEach(function (oTestCase) {
        var sTestDescription = oTestCase.testDescription;

        QUnit.test("getThemeList - returns default on " + sTestDescription, function (assert) {
            var done = assert.async();
            var oAdapter = new UserInfoAdapter(
                undefined, // unused parameter
                undefined, // unused parameter
                oTestCase.testInput
            );

            assert.expect(2);

            oAdapter.getThemeList()
                .done(function (oResultOptions) {
                    assert.equal(Object.prototype.toString.apply(oResultOptions), "[object Object]",
                        "got an object back on " + sTestDescription);

                    assert.deepEqual(oResultOptions.options, aExpectedDefaultThemeConfiguration,
                        "got expected configuration on " + sTestDescription);
                    done();
                });
        });
    });

    [
        {
            testDescription: "valid configuration specified",
            testInput: {
                config: {
                    themes: [
                        { id: "theme_id_1", name: "theme name 1" },
                        { id: "theme_id_2", name: "theme name 2" },
                        { id: "theme_id_3", name: "theme name 3", root: "rootName" }
                    ]
                }
            }
        }
    ].forEach(function (oTestCase) {
        var sTestDescription = oTestCase.testDescription;

        QUnit.test("getThemeList - expected theme list on " + sTestDescription, function (assert) {
            var done = assert.async();
            var oAdapter = new UserInfoAdapter(
                undefined, // unused parameter
                undefined, // unused parameter
                oTestCase.testInput
            );

            assert.expect(2);

            oAdapter.getThemeList()
                .done(function (oResultOptions) {
                    assert.equal(Object.prototype.toString.apply(oResultOptions), "[object Object]",
                        "got an object back on " + sTestDescription);

                    assert.deepEqual(oResultOptions.options, fnClone(oTestCase.testInput.config.themes),
                        "got specified list of themes on " + sTestDescription);
                    done();
                });
        });
    });

    QUnit.test("getThemeList - rejects on empty list of themes", function (assert) {
        var done = assert.async();
        var oAdapter = new UserInfoAdapter(
            undefined, // unused parameter
            undefined, // unused parameter
            {
                config: { // the input configuration
                    themes: []
                }
            }
        );

        assert.expect(2);

        oAdapter.getThemeList()
            .fail(function (sErrorMessage) {
                assert.ok(true, "getThemeList rejected");
                assert.ok(sErrorMessage.match("no themes were configured"), "expected error message returned");
            })
            .always(done);
    });

    QUnit.module("sap.ushell.adapters.local.UserInfoAdapter - updateUserPreferences", {
        beforeEach: function (assert) {
           Container.init("local").then(assert.async());
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    [{
        testDescription: "theme and trackUsageAnalytics changes are udated",
        input: {
            changedProperties: [{
                name: "THEME",
                newValue: "newTheme",
                oldValue: "oldTheme",
                propertyName: "theme"
            }, {
                name: "TRACKING_USAGE_ANALYTICS",
                newValue: true,
                oldValue: false,
                propertyName: "trackUsageAnalytics"
            }]
        },
        expectedSetItemValueCalls: [
            ["theme", "newTheme"],
            ["trackUsageAnalytics", true]
        ],
        expectedSaveCalls: 1
    }].forEach(function (oFixture) {
        QUnit.test("updateUserPreferences is correct when: " + oFixture.testDescription, function (assert) {
            var oGetServiceOriginal = Container.getServiceAsync,
                oAdapter = new UserInfoAdapter(),
                oSetItemValueStub = sandbox.stub().resolves(),
                done = assert.async(),
                oUser = {
                    getChangedProperties: function () {
                        return oFixture.input.changedProperties;
                    }
                },
                oSaveStub = sandbox.stub().resolves(),
                fnGetContainerStub = function () {
                    if (oFixture.input.getContainerError) {
                        return Promise.reject(oFixture.input.getContainerError);
                    }
                    return Promise.resolve({
                        setItemValue: oSetItemValueStub,
                        save: oSaveStub
                    });
                };

            fnGetContainerStub = sandbox.spy(fnGetContainerStub);
            sandbox.stub(Container, "getServiceAsync").callsFake(function (sService) {
                if (sService === "PersonalizationV2") {
                    return Promise.resolve({
                        getContainer: fnGetContainerStub,
                        KeyCategory,
                        WriteFrequency
                    });
                }
                return oGetServiceOriginal;
            });

            oAdapter.updateUserPreferences(oUser)
                .done(function () {
                    assert.strictEqual(fnGetContainerStub.callCount, 1,
                        "PersonalizationService.getContainer called once");
                    assert.deepEqual(fnGetContainerStub.args[0][0], "sap.ushell.UserProfile",
                        "PersonalizationService.getContainer called with correct arguments");
                    assert.strictEqual(oSetItemValueStub.callCount, oFixture.expectedSetItemValueCalls.length,
                        "setItemValue called expected number of times");
                    assert.deepEqual(oSetItemValueStub.args, oFixture.expectedSetItemValueCalls,
                        "setItemValue called with correct arguments");
                    assert.strictEqual(oSaveStub.callCount, oFixture.expectedSaveCalls,
                        "save called expected number of times");
                    done();
                })
                .fail(function () {
                    assert.ok(false, "expected that promise was resolved");
                    done();
                });
        });
    });

    [{
        testDescription: "getContainer fails with Error",
        input: {
            getContainerError: {
                message: "error message",
                stack: "stackTrace"
            }
        },
        expectedErrorLogCall: ["Failed to update user preferences: error message", "stackTrace", "com.sap.ushell.adapters.local.UserInfo"]
    }, {
        testDescription: "getContainer fails with message",
        input: { getContainerError: "error message" },
        expectedErrorLogCall: ["Failed to update user preferences: error message", undefined, "com.sap.ushell.adapters.local.UserInfo"]
    }, {
        testDescription: "save fails with Error",
        input: {
            saveError: {
                message: "error message",
                stack: "stackTrace"
            }
        },
        expectedErrorLogCall: ["Failed to update user preferences: error message", "stackTrace", "com.sap.ushell.adapters.local.UserInfo"]
    }, {
        testDescription: "save fails with message",
        input: { saveError: "error message" },
        expectedErrorLogCall: ["Failed to update user preferences: error message", undefined, "com.sap.ushell.adapters.local.UserInfo"]
    }].forEach(function (oFixture) {
        QUnit.test("updateUserPreferences does correct error handling when: " + oFixture.testDescription, function (assert) {
            var oGetServiceOriginal = Container.getServiceAsync,
                oAdapter = new UserInfoAdapter(),
                oSetItemValueStub = sandbox.stub().resolves(),
                done = assert.async(),
                oUser = {
                    getChangedProperties: function () {
                        return oFixture.input.changedProperties;
                    }
                },
                oSaveStub = function () {
                    if (oFixture.input.saveError) {
                        return Promise.reject(oFixture.input.saveError);
                    }
                    return Promise.resolve();
                },
                oLogMock = sandbox.spy(Log, "error"),
                fnGetContainerStub = function () {
                    if (oFixture.input.getContainerError) {
                        return Promise.reject(oFixture.input.getContainerError);
                    }
                    return Promise.resolve({
                        setItemValue: oSetItemValueStub,
                        save: oSaveStub
                    });
                },
                aExpectedArgs = oFixture.expectedErrorLogCall;

            oSaveStub = sandbox.spy(oSaveStub);
            fnGetContainerStub = sandbox.spy(fnGetContainerStub);
            sandbox.stub(Container, "getServiceAsync").callsFake(function (sService) {
                if (sService === "PersonalizationV2") {
                    return Promise.resolve({
                        getContainer: fnGetContainerStub,
                        KeyCategory,
                        WriteFrequency
                    });
                }
                return oGetServiceOriginal;
            });

            oAdapter.updateUserPreferences(oUser)
                .done(function () {
                    assert.ok(false, "expected that promise was rejected");
                    done();
                })
                .fail(function () {
                    assert.ok(true, "expected that promise was rejected");
                    assert.equal(oLogMock.callCount, 1, "error logged once");
                    assert.deepEqual(oLogMock.getCalls()[0].args, aExpectedArgs, "error message as expected");
                    done();
                });
        });
    });
});
