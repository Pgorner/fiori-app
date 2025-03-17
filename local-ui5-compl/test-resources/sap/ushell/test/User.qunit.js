// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap/ushell/User.js
 */
sap.ui.define([
    "sap/base/Log",
    "sap/base/i18n/Localization",
    "sap/ushell/User",
    "sap/ui/thirdparty/URI",
    "sap/ui/core/Core",
    "sap/ui/core/Theming"
], function (
    Log,
    Localization,
    User,
    URI,
    Core,
    Theming
) {
    "use strict";

    /* global QUnit, sinon */

    function getDocumentLocationOrigin () {
        var oUri = new URI(document.location);
        return oUri.protocol() + "://" + oUri.host();
    }

    QUnit.module("User", {
        afterEach: function () {
            Core.applyTheme?.restore?.();
            Theming.setTheme.restore?.();
        }
    });

    QUnit.test("constructor is robust enough to deal with an empty container adapter config", function (assert) {
        // Arrange
        var oContainerAdapterConfig = {};

        // Act
        new User(oContainerAdapterConfig);

        // Assert
        assert.ok(true, "Success: Constructor can deal with empty container adapter config");
        // not sure if all methods run through
    });

    QUnit.test("setAccessibilityMode throws if it is not allowed to set the accessibility mode", function (assert) {
        var oUser = new User({});

        sinon.stub(oUser, "isSetAccessibilityPermitted").returns(false);

        assert.throws(oUser.setAccessibilityMode.bind(oUser, "some accessibility mode"), /setAccessibilityMode not permitted/,
            "exception was thrown");
    });

    QUnit.test("setAccessibilityMode logs an error if it is not allowed to set the accessibility mode", function (assert) {
        var oUser = new User({});

        sinon.stub(oUser, "isSetAccessibilityPermitted").returns(false);
        sinon.spy(Log, "error");

        try {
            oUser.setAccessibilityMode("some accessibility mode");
        } catch (e) {
            // do nothing
        }

        assert.strictEqual(Log.error.getCall(0).args[0], "setAccessibilityMode not permitted", "expected error message was logged");

        Log.error.restore();
    });

    /* ****************************************************************
     *   User Image tests
     * **************************************************************** */

    QUnit.test("User image can be retrieved after setting it", function (assert) {
        var sDummyUserURI = "http://dummyUsrURI";

        // Arrange
        var oContainerAdapterConfig = {};

        // Act
        var oUser = new User(oContainerAdapterConfig);
        oUser.setImage(sDummyUserURI);
        var sRetrievedUserURI = oUser.getImage();

        // Assert
        assert.strictEqual(sRetrievedUserURI, sDummyUserURI);
    });

    QUnit.test("Attached callbacks are being called upon setting user image", function (assert) {
        var sDummyUserURI = "http://dummyUsrURI";
        var sRetrievedUserURI;
        var fnMockCallback = sinon.spy(function (param) {
            sRetrievedUserURI = param.mParameters;
        });

        // Arrange
        var oContainerAdapterConfig = {};

        // Act
        var oUser = new User(oContainerAdapterConfig);
        oUser.attachOnSetImage(fnMockCallback);
        oUser.setImage(sDummyUserURI);

        // Assert
        assert.ok(fnMockCallback.calledOnce, "fnMockCallback is expected to be called one");
        assert.strictEqual(sRetrievedUserURI, sDummyUserURI, "Failed retrieving image URI from event object");
    });

    /* ****************************************************************
     *   Theming tests
     * **************************************************************** */

    [{
        testDescription: "oThemeInput and oSystemTheme are undefined",
        oThemeInput: undefined,
        oSystemTheme: undefined,
        expected: {
            originalTheme: {
                theme: "",
                root: ""
            },
            theme: "",
            suppliedRoot: "",
            path: "",
            locationPath: "",
            locationOrigin: ""
        }
    }, {
        testDescription: "oThemeInput and oSystemTheme are empty objects",
        oThemeInput: {},
        oSystemTheme: {},
        expected: {
            originalTheme: {
                theme: "",
                root: ""
            },
            theme: "",
            suppliedRoot: "",
            path: "",
            locationPath: "",
            locationOrigin: ""
        }
    }, {
        testDescription: "oThemeInput is an empty object",
        oThemeInput: {},
        oSystemTheme: {
            locationPathUi5: "/UI5/theme/path",
            locationPathCustom: "/custom/theme/path",
            locationOrigin: "https://frontendserver.sap.com:4711"
        },
        expected: {
            originalTheme: {
                theme: "",
                root: ""
            },
            theme: "",
            suppliedRoot: "",
            path: "",
            locationPath: "",
            locationOrigin: ""
        }
    }, {
        testDescription: "oThemeInput.theme is undefined",
        oThemeInput: {
            theme: undefined,
            root: undefined
        },
        oSystemTheme: {
            locationPathUi5: "/UI5/theme/path",
            locationPathCustom: "/custom/theme/path",
            locationOrigin: "https://frontendserver.sap.com:4711"
        },
        expected: {
            originalTheme: {
                theme: "",
                root: ""
            },
            theme: "",
            suppliedRoot: "",
            path: "",
            locationPath: "",
            locationOrigin: ""
        }
    }, {
        testDescription: "oThemeInput is an sap_ theme",
        oThemeInput: {
            theme: "sap_hcb",
            root: ""
        },
        oSystemTheme: {
            locationPathUi5: "/UI5/theme/path",
            locationPathCustom: "/custom/theme/path",
            locationOrigin: "https://frontendserver.sap.com:4711"
        },
        expected: {
            originalTheme: {
                theme: "sap_hcb",
                root: ""
            },
            theme: "sap_hcb",
            suppliedRoot: "",
            path: "",
            locationPath: "/UI5/theme/path",
            locationOrigin: "https://frontendserver.sap.com:4711"
        }
    }, {
        testDescription: "oThemeInput is an sap_ theme with path as theme root",
        oThemeInput: {
            theme: "sap_hcb",
            root: "/some/supplied/theme/path"
        },
        oSystemTheme: {
            locationPathUi5: "/UI5/theme/path",
            locationPathCustom: "/custom/theme/path",
            locationOrigin: "https://frontendserver.sap.com:4711"
        },
        expected: {
            originalTheme: {
                theme: "sap_hcb",
                root: "/some/supplied/theme/path"
            },
            theme: "sap_hcb",
            suppliedRoot: "/some/supplied/theme/path",
            path: "/some/supplied/theme/path",
            locationPath: "/some/supplied/theme/path",
            locationOrigin: "https://frontendserver.sap.com:4711"
        }
    }, {
        testDescription: "oThemeInput is an sap_ theme with full URL as theme root",
        oThemeInput: {
            theme: "sap_hcb",
            root: "https://someotherfrontendserver.sap.com:3270/some/supplied/theme/path"
        },
        oSystemTheme: {
            locationPathUi5: "/UI5/theme/path",
            locationPathCustom: "/custom/theme/path",
            locationOrigin: "https://frontendserver.sap.com:4711"
        },
        expected: {
            originalTheme: {
                theme: "sap_hcb",
                root: "https://someotherfrontendserver.sap.com:3270/some/supplied/theme/path"
            },
            theme: "sap_hcb",
            suppliedRoot: "https://someotherfrontendserver.sap.com:3270/some/supplied/theme/path",
            path: "/some/supplied/theme/path",
            locationPath: "/some/supplied/theme/path",
            locationOrigin: "https://someotherfrontendserver.sap.com:3270"
        }
    }, {
        testDescription: "oThemeInput is a custom theme",
        oThemeInput: {
            theme: "customTheme",
            root: "/supplied/custom/theme/path"
        },
        oSystemTheme: {
            locationPathUi5: "/UI5/theme/path",
            locationPathCustom: "/custom/theme/path",
            locationOrigin: "https://frontendserver.sap.com:4711"
        },
        expected: {
            originalTheme: {
                theme: "customTheme",
                root: "/supplied/custom/theme/path"
            },
            theme: "customTheme",
            suppliedRoot: "/supplied/custom/theme/path",
            path: "/supplied/custom/theme/path",
            locationPath: "/supplied/custom/theme/path",
            locationOrigin: "https://frontendserver.sap.com:4711"
        }
    }, {
        testDescription: "oThemeInput is a custom theme with no theme root",
        oThemeInput: {
            theme: "customTheme",
            root: ""
        },
        oSystemTheme: {
            locationPathUi5: "/UI5/theme/path",
            locationPathCustom: "/custom/theme/path",
            locationOrigin: "https://frontendserver.sap.com:4711"
        },
        expected: {
            originalTheme: {
                theme: "customTheme",
                root: ""
            },
            theme: "customTheme",
            suppliedRoot: "",
            path: "/custom/theme/path",
            locationPath: "/custom/theme/path",
            locationOrigin: "https://frontendserver.sap.com:4711"
        }
    }, {
        testDescription: "oThemeInput is a custom theme with path as theme root",
        oThemeInput: {
            theme: "customTheme",
            root: "/some/supplied/theme/path"
        },
        oSystemTheme: {
            locationPathUi5: "/UI5/theme/path",
            locationPathCustom: "/custom/theme/path",
            locationOrigin: "https://frontendserver.sap.com:4711"
        },
        expected: {
            originalTheme: {
                theme: "customTheme",
                root: "/some/supplied/theme/path"
            },
            theme: "customTheme",
            suppliedRoot: "/some/supplied/theme/path",
            path: "/some/supplied/theme/path",
            locationPath: "/some/supplied/theme/path",
            locationOrigin: "https://frontendserver.sap.com:4711"
        }
    }, {
        testDescription: "oThemeInput is a custom theme with full URL as theme root",
        oThemeInput: {
            theme: "customTheme",
            root: "https://someotherfrontendserver.sap.com:3270/some/supplied/theme/path"
        },
        oSystemTheme: {
            locationPathUi5: "/UI5/theme/path",
            locationPathCustom: "/custom/theme/path",
            locationOrigin: "https://frontendserver.sap.com:4711"
        },
        expected: {
            originalTheme: {
                theme: "customTheme",
                root: "https://someotherfrontendserver.sap.com:3270/some/supplied/theme/path"
            },
            theme: "customTheme",
            suppliedRoot: "https://someotherfrontendserver.sap.com:3270/some/supplied/theme/path",
            path: "/some/supplied/theme/path",
            locationPath: "/some/supplied/theme/path",
            locationOrigin: "https://someotherfrontendserver.sap.com:3270"
        }
    }].forEach(function (oFixture) {
        QUnit.test("_AmendTheme returns the correct result when " + oFixture.testDescription, function (assert) {
            assert.expect(1);

            // Act
            var oCompleteTheme = User.prototype._amendTheme(oFixture.oThemeInput, oFixture.oSystemTheme);

            // Assert
            assert.deepEqual(oCompleteTheme, oFixture.expected, "Theme is completed correctly");
        });
    });

    /* **************************************************************** */

    [{
        testDescription: "boot theme is undefined and sThemeRoot is undefined",
        oBootTheme: undefined,
        sThemeRoot: undefined,
        expected: {
            themeName: "",
            originalTheme: "",
            themePlusUrl: "",
            NWBC: ""
        }
    }, {
        testDescription: "boot theme is undefined and sThemeRoot is initialized",
        oBootTheme: undefined,
        sThemeRoot: "/theme/root",
        expected: {
            themeName: "",
            originalTheme: "",
            themePlusUrl: "",
            NWBC: ""
        }
    }, {
        testDescription: "boot theme is a sap_ theme with undefined root",
        oBootTheme: {
            theme: "sap_hcb",
            root: undefined
        },
        sThemeRoot: "/theme/root",
        expected: {
            themeName: "sap_hcb",
            originalTheme: "sap_hcb",
            themePlusUrl: "sap_hcb@" + getDocumentLocationOrigin() + (new URI(sap.ui.require.toUrl(""))).absoluteTo(document.location).pathname(),
            NWBC: "sap_hcb"
        }
    }, {
        testDescription: "boot theme is a sap_ theme with '' root",
        oBootTheme: {
            theme: "sap_hcb",
            root: ""
        },
        sThemeRoot: "/theme/root",
        expected: {
            themeName: "sap_hcb",
            originalTheme: "sap_hcb",
            themePlusUrl: "sap_hcb@" + getDocumentLocationOrigin() + (new URI(sap.ui.require.toUrl(""))).absoluteTo(document.location).pathname(),
            NWBC: "sap_hcb"
        }
    }, {
        testDescription: "boot theme is a sap_ theme with a root",
        oBootTheme: {
            theme: "sap_hcb",
            root: "/theme/specific/root"
        },
        sThemeRoot: "/theme/root",
        expected: {
            themeName: "sap_hcb",
            originalTheme: "sap_hcb",
            themePlusUrl: "sap_hcb@" + getDocumentLocationOrigin() + "/theme/specific/root",
            NWBC: "sap_hcb"
        }
    }, {
        testDescription: "boot theme is a sap_ theme with a URL as root",
        oBootTheme: {
            theme: "sap_hcb",
            root: "https://frontendserver.sap.com/theme/specific/root"
        },
        sThemeRoot: "/theme/root",
        expected: {
            themeName: "sap_hcb",
            originalTheme: "sap_hcb",
            themePlusUrl: "sap_hcb@https://frontendserver.sap.com/theme/specific/root",
            NWBC: "sap_hcb"
        }
    }, {
        testDescription: "boot theme is a custom theme with '' root",
        oBootTheme: {
            theme: "red_crystal",
            root: ""
        },
        sThemeRoot: "/system/theme/root",
        expected: {
            themeName: "red_crystal",
            originalTheme: "red_crystal",
            themePlusUrl: "red_crystal@" + getDocumentLocationOrigin() + "/system/theme/root",
            NWBC: "red_crystal@" + getDocumentLocationOrigin() + "/system/theme/root"
        }
    }, {
        testDescription: "boot theme is a custom theme with a root",
        oBootTheme: {
            theme: "red_crystal",
            root: "/theme/specific/root"
        },
        sThemeRoot: "/system/theme/root",
        expected: {
            themeName: "red_crystal",
            originalTheme: "red_crystal",
            themePlusUrl: "red_crystal@" + getDocumentLocationOrigin() + "/theme/specific/root",
            NWBC: "red_crystal@" + getDocumentLocationOrigin() + "/theme/specific/root"
        }
    }, {
        testDescription: "boot theme is a custom theme @ root",
        oBootTheme: {
            theme: "red_crystal@/theme/specific/root",
            root: ""
        },
        sThemeRoot: "/system/theme/root",
        expected: {
            themeName: "red_crystal",
            originalTheme: "red_crystal@/theme/specific/root",
            themePlusUrl: "red_crystal@" + getDocumentLocationOrigin() + "/theme/specific/root",
            NWBC: "red_crystal@" + getDocumentLocationOrigin() + "/theme/specific/root"
        }
    }, {
        testDescription: "boot theme is a sap_ theme with a URL as root",
        oBootTheme: {
            theme: "red_crystal",
            root: "https://frontendserver.sap.com/theme/specific/root"
        },
        sThemeRoot: "/system/theme/root",
        expected: {
            originalTheme: "red_crystal",
            themeName: "red_crystal",
            themePlusUrl: "red_crystal@https://frontendserver.sap.com/theme/specific/root",
            NWBC: "red_crystal@https://frontendserver.sap.com/theme/specific/root"
        }
    }, {
        testDescription: "boot theme is a sap_ theme @ URL",
        oBootTheme: {
            theme: "red_crystal@https://frontendserver.sap.com/theme/specific/root",
            root: ""
        },
        sThemeRoot: "/system/theme/root",
        expected: {
            originalTheme: "red_crystal@https://frontendserver.sap.com/theme/specific/root",
            themeName: "red_crystal",
            themePlusUrl: "red_crystal@https://frontendserver.sap.com/theme/specific/root",
            NWBC: "red_crystal@https://frontendserver.sap.com/theme/specific/root"
        }
    }].forEach(function (oFixture) {
        QUnit.test("The User object is correctly initialized rgd. theme when " + oFixture.testDescription, function (assert) {
            assert.expect(4);

            // Arrange
            var oContainerAdapterConfig = {
                bootTheme: oFixture.oBootTheme,
                themeRoot: oFixture.sThemeRoot
            };

            // Act
            var oUser = new User(oContainerAdapterConfig);

            // Assert
            assert.strictEqual(oUser.getTheme(), oFixture.expected.themeName,
                "Theme name is set correctly (no parameter supplied to getTheme)");
            assert.strictEqual(oUser.getTheme(User.prototype.constants.themeFormat.ORIGINAL_THEME), oFixture.expected.originalTheme,
                "Original theme is set correctly (parameter supplied to getTheme)");
            assert.strictEqual(oUser.getTheme(User.prototype.constants.themeFormat.THEME_NAME_PLUS_URL), oFixture.expected.themePlusUrl,
                "Theme name and location URL is set correctly");
            assert.strictEqual(oUser.getTheme(User.prototype.constants.themeFormat.NWBC), oFixture.expected.NWBC,
                "Theme is set correctly");
        });
    });

    /* **************************************************************** */

    [{
        testDescription: "a sap theme is set where the boot theme was a custom boot theme",
        oBootTheme: {
            theme: "customTheme",
            root: "/sap/public/bc/themes/~client120"
        },
        sThemeRoot: "/sap/public/bc/themes/~client120",
        sNewTheme: "sap_horizon",
        expected: ["sap_horizon"]
    }, {
        testDescription: "a custom theme is set where the boot theme was an sap theme",
        oBootTheme: {
            theme: "sap_horizon",
            root: ""
        },
        sThemeRoot: "/sap/public/bc/themes/~client120",
        sNewTheme: "customTheme@/sap/public/bc/themes/~client120",
        expected: ["customTheme", "/sap/public/bc/themes/~client120/UI5/"]
    }, {
        testDescription: "a custom theme is set where the boot theme was a custom theme",
        oBootTheme: {
            theme: "customThemeGreen",
            root: "/sap/public/bc/themes/~client120"
        },
        sThemeRoot: "/sap/public/bc/themes/~client120",
        sNewTheme: "customTheme",
        expected: ["customTheme", "/sap/public/bc/themes/~client120/UI5/"]
    }, {
        testDescription: "a custom theme with a path is set",
        oBootTheme: {
            theme: "sap_horizon",
            root: ""
        },
        sThemeRoot: "/sap/public/bc/themes/~client120",
        sNewTheme: "customTheme@/custom/theme/path",
        expected: ["customTheme", "/custom/theme/path/UI5/"]
    }, {
        testDescription: "an sap_ theme with a theme URL is set",
        oBootTheme: {
            theme: "customTheme",
            root: "/sap/public/bc/themes/~client120"
        },
        sThemeRoot: "/sap/public/bc/themes/~client120",
        sNewTheme: "sap_hcb@https://frontendserver.customer.com/his/theme/path",
        expected: ["sap_hcb", "https://frontendserver.customer.com/his/theme/path/UI5/"]
    }, {
        testDescription: "a custom theme with a theme URL is set",
        oBootTheme: {
            theme: "customTheme",
            root: "/sap/public/bc/themes/~client120"
        },
        sThemeRoot: "/sap/public/bc/themes/~client120",
        sNewTheme: "greencrystal@https://frontendserver.customer.com/his/theme/path",
        expected: ["greencrystal", "https://frontendserver.customer.com/his/theme/path/UI5/"]
    }].forEach(function (oFixture) {
        QUnit.test("setTheme applies the new theme correctly when " + oFixture.testDescription, function (assert) {
            assert.expect(3);

            // Arrange
            var oContainerAdapterConfig = {
                bootTheme: oFixture.oBootTheme,
                themeRoot: oFixture.sThemeRoot
            };
            const bLegacyUI5 = !!Core.applyTheme;
            var fnApplyTheme = bLegacyUI5 ? sinon.stub(Core, "applyTheme") : sinon.stub(Theming, "setTheme");
            var oUser = new User(oContainerAdapterConfig);

            // Act
            oUser.setTheme(oFixture.sNewTheme);

            // Assert
            assert.ok(fnApplyTheme.calledOnce, "Success: applyTheme was called once");
            if (bLegacyUI5) {
                assert.deepEqual(fnApplyTheme.args[0], oFixture.expected, "correct arguments");
            } else {
                assert.strictEqual(fnApplyTheme.args[0], oFixture.expected[0], "correct arguments");
            }
            assert.strictEqual(oUser.getTheme(), oFixture.expected[0], "getTheme returns the set theme");
        });
    });

    /* **************************************************************** */

    /* **************************************************************** */

    QUnit.test("User: changed property handling", function (assert) {
        // 1 - get
        // 2 - set get
        // 3 - reset get

        // Arrange
        var aExpectedChangedProperties = [{
            propertyName: "Property1",
            name: "Property1",
            newValue: "newValue",
            oldValue: "oldValue"
        }];
        var oContainerAdapterConfig = {};
        var oUser = new User(oContainerAdapterConfig);

        // Act - Step 1
        var aReturnedChangedProperties = oUser.getChangedProperties();

        // Assert
        assert.deepEqual(aReturnedChangedProperties, [], "Success: Step 1 - empty changed properties");

        // Act - Step 2
        oUser.setChangedProperties(
            {
                propertyName: aExpectedChangedProperties[0].propertyName,
                name: aExpectedChangedProperties[0].name
            },
            aExpectedChangedProperties[0].oldValue,
            aExpectedChangedProperties[0].newValue
        );

        // Assert
        assert.deepEqual(aReturnedChangedProperties, [], "Success: Step 2 - set did not affect the value returned by the first get");
        // to check that the live object is not returned but only a copied object
        aReturnedChangedProperties = oUser.getChangedProperties();
        assert.deepEqual(aReturnedChangedProperties, aExpectedChangedProperties, "Success: Step 2 - changed properties were set correctly");

        // Act - Step 3
        oUser.resetChangedProperties();

        // Assert
        assert.deepEqual(aReturnedChangedProperties, aExpectedChangedProperties,
            "Success: Step 3 - reset did not affect the value returned by the second get");
        aReturnedChangedProperties = oUser.getChangedProperties();
        assert.deepEqual(aReturnedChangedProperties, [], "Success: Step 3 - changed properties were reset correctly");
    });

    QUnit.test("User: does not warn if constructed with an adapter configuration that does not specify a content density", function (assert) {
        // Arrange
        sinon.spy(Log, "warning");

        // Act
        new User({ // the container adapter configuration
            userProfile: [{
                id: "CONTENT_DENSITY",
                value: "compact"
            }],
            bootTheme: {
                theme: "customTheme",
                root: "/sap/public/bc/themes/~client120"
            },
            themeRoot: "/sap/public/bc/themes/~client120"
        });

        // Assert
        assert.strictEqual(Log.warning.callCount, 0, "Log.warning was not called");

        Log.warning.restore();
    });

    [{
        testDescription: "user profile doesn't contain CONTENT_DENSITY",
        containerAdapterConfig: {
            userProfile: [{
                id: "SOMETHING_ELSE",
                value: "something"
            }]
        },
        expectedValue: undefined
    }].forEach(function (oFixture) {
        QUnit.test("User: getContentDensity returns the correct value when " + oFixture.testDescription, function (assert) {
            // Act
            var oUser = new User(oFixture.containerAdapterConfig);

            // Assert
            assert.strictEqual(oUser.getContentDensity(), oFixture.expectedValue, "expected value was returned");
        });
    });

    [{
        testDescription: "containerAdapterConfig has a ranges.theme which contains the given theme name",
        input: {
            containerAdapterConfig: {
                ranges: {
                    theme: {
                        custom_cool_theme: {
                            displayName: "Custom Theme",
                            themeRoot: "myThemeRoot"
                        }
                    }
                }
            },
            givenTheme: "custom_cool_theme"
        },
        expectedThemeRoot: "myThemeRoot"
    }, {
        testDescription: "Meta Data contains of ranges and theme root undefined",
        input: {
            containerAdapterConfig: { ranges: { theme: { custom_cool_theme: { displayName: "Custom Theme" } } } },
            givenTheme: "custom_cool_theme"
        },
        expectedThemeRoot: ""
    }, {
        testDescription: "Meta Data contains of ranges and no themes",
        input: {
            containerAdapterConfig: { ranges: {} },
            givenTheme: "custom_cool_theme"
        },
        expectedThemeRoot: ""
    }, {
        testDescription: "Meta Data does not contain ranges, to stay compatible ",
        input: {
            containerAdapterConfig: {},
            givenTheme: "custom_cool_theme"
        },
        expectedThemeRoot: ""
    }].forEach(function (oFixture) {
        QUnit.test("User: getThemeRoot returns correct value when " + oFixture.testDescription, function (assert) {
            // Arrange
            var oUser = new User(oFixture.input.containerAdapterConfig);

            // Act && Assert
            assert.strictEqual(oUser.getThemeRoot(oFixture.input.givenTheme), oFixture.expectedThemeRoot,
                "expected theme root was returned");
        });
    });

    [{
        testDescription: "cozy contentDensity is set and isSetContentDensityPermitted is false",
        contentDensity: "cozy"
    }, {
        testDescription: "'any value' contentDensity is set and isSetContentDensityPermitted is false",
        contentDensity: "any value"
    }].forEach(function (oFixture) {
        QUnit.test("User: setContentDensity throws when " + oFixture.testDescription, function (assert) {
            var oUser = new User({}); // configuration doesn't matter
            sinon.stub(oUser, "isSetContentDensityPermitted").returns(false);

            assert.throws(oUser.setContentDensity.bind(oUser, oFixture.contentDensity), /setContentDensity not permitted/,
                "exception was thrown");
        });

        QUnit.test("User: setContentDensity logs an error when " + oFixture.testDescription, function (assert) {
            var oUser = new User({}); // configuration doesn't matter
            sinon.stub(oUser, "isSetContentDensityPermitted").returns(false);
            sinon.spy(Log, "error");

            try {
                oUser.setContentDensity(oFixture.contentDensity);
            } catch (e) {
                // do nothing
            }

            assert.strictEqual(Log.error.getCall(0).args[0], "setContentDensity not permitted", "expected error message was logged");

            Log.error.restore();
        });
    });

    // test that setChangedProperties is called if it is allowed to change contentDensity

    // Language tests

    QUnit.test("User: getLanguage and getLanguageBcp47 return the expected values", function (assert) {
        // Arrange
        var sLanguage = "en_us";
        var sBcpLanguage = "en";

        var oContainerAdapterConfig = {
            language: sLanguage,
            languageBcp47: sBcpLanguage
        };
        // Act
        var oUser = new User(oContainerAdapterConfig);

        // Assert
        assert.strictEqual(oUser.getLanguage(), sLanguage, "Correct (technical) language returned");
        assert.strictEqual(oUser.getLanguageBcp47(), sBcpLanguage, "Correct (bcp47) language returned");
    });

    QUnit.test("User: getLanguageText returns the correct language text", function (assert) {
        // Arrange
        var sLanguage = "en-US";
        var oContainerAdapterConfig = {};
        var oGetLanguageTagStub = sinon.stub(Localization, "getLanguageTag").returns(sLanguage);

        // Act
        var oUser = new User(oContainerAdapterConfig);

        // Assert
        assert.strictEqual(oUser.getLanguageText(), "American English", "Local returned the correct language text");

        oGetLanguageTagStub.restore();
    });

    QUnit.test("User: getLanguageText returns the technical name if no language text found", function (assert) {
        // Arrange
        var sLanguage = "en-us";
        var sBcpLanguage = "en";
        var sWrongLanguage = "enus";
        var oContainerAdapterConfig = {
            language: sLanguage,
            languageBcp47: sBcpLanguage
        };

        var oGetLanguageTagStub = sinon.stub(Localization, "getLanguageTag").returns(sWrongLanguage);

        // Act
        var oUser = new User(oContainerAdapterConfig);

        // Assert
        assert.strictEqual(oUser.getLanguageText(), sLanguage, "Local returned the language's technical name");

        oGetLanguageTagStub.restore();
    });

    QUnit.test("User: getEditState when userProfile is available", function (assert) {
        var oContainerAdapterConfig = {
            userProfile: [
                {
                    id: "ID1",
                    editState: 1
                },
                {
                    id: "ID2",
                    editState: 3
                }
            ]
        };
        var oUser = new User(oContainerAdapterConfig);

        assert.strictEqual(oUser.getEditState("ID1"), 1, "Edit state for the first field");
        assert.strictEqual(oUser.getEditState("ID2"), 3, "Edit state for the second field");
        assert.strictEqual(oUser.getEditState("SOME_ID"), undefined, "Edit state for a field that is not present in the user profile");
    });

    QUnit.test("User: getEditState when userProfile is not available", function (assert) {
        var oUser = new User({});
        assert.strictEqual(oUser.getEditState("ID1"), undefined, "Edit state undefined for all fields");
    });

    QUnit.module("getInitials");

    QUnit.test("The fullName property is not given", function (assert) {
        // Arrange
        var oUser = new User({});

        // Act
        var sResult = oUser.getInitials();

        // Assert
        assert.strictEqual(sResult, "", "An empty string is returned.");
    });

    QUnit.test("The fullName property consists of 1 name", function (assert) {
        // Arrange
        var oUser = new User({
            fullName: "Joe"
        });

        // Act
        var sResult = oUser.getInitials();

        // Assert
        assert.strictEqual(sResult, "J", 'The initial "J" is returned.');
    });

    QUnit.test("The fullName property consists of 2 names", function (assert) {
        // Arrange
        var oUser = new User({
            fullName: "Joe Doe"
        });

        // Act
        var sResult = oUser.getInitials();

        // Assert
        assert.strictEqual(sResult, "JD", 'The initial "JD" are returned.');
    });

    QUnit.test("The fullName property consists of 3 names", function (assert) {
        // Arrange
        var oUser = new User({
            fullName: "Joe Jack Doe"
        });

        // Act
        var sResult = oUser.getInitials();

        // Assert
        assert.strictEqual(sResult, "JJD", 'The initial "JJD" are returned.');
    });

    QUnit.test("The fullName property consists of special symbols", function (assert) {
        // Arrange
        var oUser = new User({
            fullName: "Ägidius Schneider"
        });

        // Act
        var sResult = oUser.getInitials();

        // Assert
        assert.strictEqual(sResult, "ÄS", 'The initial "ÄS" are returned.');
    });

    QUnit.test("The fullName property consists of special symbols", function (assert) {
        // Arrange
        var oUser = new User({
            fullName: "Ägidius Schneider"
        });

        // Act
        var sResult = oUser.getInitials();

        // Assert
        assert.strictEqual(sResult, "ÄS", 'The initial "ÄS" are returned.');
    });

    QUnit.test("The fullName property consists of numbers", function (assert) {
        // Arrange
        var oUser = new User({
            fullName: "1234 5678"
        });

        // Act
        var sResult = oUser.getInitials();

        // Assert
        assert.strictEqual(sResult, "15", 'The initial "15" are returned.');
    });

    QUnit.test("The fullName property consists of a name with to many spaces", function (assert) {
        // Arrange
        var oUser = new User({
            fullName: " Some  Name "
        });

        // Act
        var sResult = oUser.getInitials();

        // Assert
        assert.strictEqual(sResult, "SN", 'The initial "SN" are returned.');
    });

    QUnit.test("The fullName property consists of lowercase name parts", function (assert) {
        // Arrange
        var oUser = new User({
            fullName: "Walter von der Vogelweide"
        });

        // Act
        var sResult = oUser.getInitials();

        // Assert
        assert.strictEqual(sResult, "WvdV", 'The initial "WvdV" are returned.');
    });
});
