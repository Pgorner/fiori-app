// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for bootstrap common.configure.ui5language.js
 */
sap.ui.define([
    "sap/base/i18n/Localization",
    "sap/ushell/bootstrap/common/common.configure.ui5language"
], function (Localization, fnConfigureUI5Language) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    QUnit.module("configureUI5Language", {
        beforeEach: function () {
            this.oConfigurationSetLanguageStub = sandbox.stub(Localization, "setLanguage");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("does not call Configuration.setLanguage if languageBcp47 is not is provided", function (assert) {
        // Arrange
        var oUshellConfig = {};

        // Act
        fnConfigureUI5Language(oUshellConfig);

        // Assert
        assert.strictEqual(this.oConfigurationSetLanguageStub.callCount, 0,
            "Configuration.setLanguage was not called");
    });

    QUnit.test("calls Configuration.setLanguage with languageBcp47 only, even if language is provided", function (assert) {
        // Arrange
        var oUshellConfig = {
            services: {
                Container: {
                    adapter: {
                        config: {
                            userProfile: {
                                defaults: {
                                    language: "ABAP Language Code",
                                    languageBcp47: "BCP-47 Language Code"
                                }
                            }
                        }
                    }
                }
            }
        };

        // Act
        fnConfigureUI5Language(oUshellConfig);

        // Assert
        assert.strictEqual(this.oConfigurationSetLanguageStub.callCount, 1, "Configuration.setLanguage was called once");
        assert.deepEqual(this.oConfigurationSetLanguageStub.getCall(0).args, [
            "BCP-47 Language Code"
        ], "Configuration.setLanguage was called with correct arguments");
    });

});
