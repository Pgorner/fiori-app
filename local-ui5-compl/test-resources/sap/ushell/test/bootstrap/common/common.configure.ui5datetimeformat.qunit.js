// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap/ushell/bootstrap/common/common.configure.ui5datetimeformat.js
 */
sap.ui.define([
    "sap/base/i18n/Formatting",
    "sap/ushell/test/utils",
    "sap/ushell/bootstrap/common/common.configure.ui5datetimeformat",
    "sap/base/Log"
], function (
    Formatting,
    testUtils,
    fnConfigureUI5DateTimeFormat,
    Log
) {
    "use strict";

    /* global sinon, QUnit */

    QUnit.module("sap.ushell.bootstrap.common.common.configure.ui5datetimeformat", {
        afterEach: function () {
            testUtils.restoreSpies(
                Formatting.setABAPDateFormat,
                Formatting.setABAPTimeFormat,
                Log.error
            );
        }
    });

    [{
        testDescription: "when the date and time format is correct",
        userProfile: {
            defaults: {
                sapDateFormat: "1",
                sapTimeFormat: "1"
            }
        }
    }, {
        testDescription: "when the userProfile is undefined",
        userProfile: undefined
    }, {
        testDescription: "when the date format is null and time format is undefined",
        userProfile: {
            defaults: {
                sapDateFormat: null,
                sapTimeFormat: undefined
            }
        }
    }, {
        testDescription: "when the date format and time format is a number",
        userProfile: {
            defaults: {
                sapDateFormat: 1,
                sapTimeFormat: 1
            }
        }
    }, {
        testDescription: "when the date and time format is not correct",
        userProfile: {
            defaults: {
                sapDateFormat: "-1",
                sapTimeFormat: "-1"
            }
        },
        sExpectedErrorMessageDate: "Date Format is incorrectly set for the User",
        sExpectedErrorMessageTime: "Time Format is incorrectly set for the User"
    }, {
        testDescription: "when the date format is not correct",
        userProfile: {
            defaults: {
                sapDateFormat: "-1",
                sapTimeFormat: "0"
            }
        },
        sExpectedErrorMessageDate: "Date Format is incorrectly set for the User"
    }, {
        testDescription: "when the time format is not correct",
        userProfile: {
            defaults: {
                sapDateFormat: "1",
                sapTimeFormat: "-1"
            }
        },
        sExpectedErrorMessageTime: "Time Format is incorrectly set for the User"
    }].forEach(function (oFixture) {
        QUnit.test("configureUI5DateTimeFormat: calls UI5 correctly " + oFixture.testDescription, function (assert) {
            //Arrange
            const oUshellConfig = {
                services: {
                    Container: { adapter: { config: { userProfile: oFixture.userProfile } } }
                }
            };

            sinon.stub(Log, "error");

            const spyDate = sinon.spy(Formatting, "setABAPDateFormat");

            const spyTime = sinon.spy(Formatting, "setABAPTimeFormat");

            //  regexp is used because the error messasge contains the given
            //errorstring and concatenated to it
            //  there is the ui5 error
            const rDate = new RegExp(oFixture.sExpectedErrorMessageDate);
            const rTime = new RegExp(oFixture.sExpectedErrorMessageTime);

            //Act
            fnConfigureUI5DateTimeFormat(oUshellConfig);

            //Assert
            if (oFixture.sExpectedErrorMessageDate && oFixture.sExpectedErrorMessageTime) {
                assert.equal(Log.error.callCount, 2,
                    "Log.error called twice as expected");

                assert.ok(rDate.test(Log.error.getCall(0).args[0]),
                    "Log.error was called with the expected error message for date");
                assert.ok(rTime.test(Log.error.getCall(1).args[0]),
                    "Log.error was called with the expected error message for time");
            } else if (oFixture.sExpectedErrorMessageDate) {
                assert.equal(Log.error.callCount, 1,
                    "Log.error called once as expected");
                assert.ok(rDate.test(Log.error.getCall(0).args[0]),
                    "Log.error was called with the expected error message for date");
            } else if (oFixture.sExpectedErrorMessageTime) {
                assert.equal(Log.error.callCount, 1,
                    "Log.error called once as expected");
                assert.ok(rTime.test(Log.error.getCall(0).args[0]),
                    "Log.error was called with the expected error message for time");
            }
            assert.ok(spyDate.calledWith(oFixture.userProfile && oFixture.userProfile.defaults.sapDateFormat), "Date format is set");
            assert.ok(spyTime.calledWith(oFixture.userProfile && oFixture.userProfile.defaults.sapTimeFormat), "Time format is set");
        });
    });

    [{
        testDescription: "when the date and time format is correct but old template is used",
        sDateFormat: "1",
        sTimeFormat: "1"
    }].forEach(function (oFixture) {
        QUnit.test("configureUI5DateTimeFormat: calls UI5 correctly " + oFixture.testDescription, function (assert) {
            // Act
            try {
                fnConfigureUI5DateTimeFormat({
                    services: {
                        Container: {
                            adapter: {
                                config: {
                                    userProfile: {
                                        defaults: {
                                            dateFormat: oFixture.sDateFormat,
                                            timeFormat: oFixture.sTimeFormat
                                        }
                                    }
                                }
                            }
                        }
                    }
                });

                // Assert
                assert.ok(true, "No exception was thrown!");
            } catch (exc) {
                // Assert
                assert.ok(false, "Exception was thrown!");
            }
        });
    });
});
