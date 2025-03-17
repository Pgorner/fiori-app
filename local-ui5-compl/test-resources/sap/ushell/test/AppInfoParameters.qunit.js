// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/base/util/ObjectPath",
    "sap/ui/VersionInfo",
    "sap/ushell/AppInfoParameters",
    "sap/ushell/services/AppConfiguration",
    "sap/ushell/Container"
], function (
    Log,
    ObjectPath,
    VersionInfo,
    AppInfoParameters,
    AppConfiguration,
    Container
) {
    "use strict";

    /* global QUnit sinon */

    var sandbox = sinon.createSandbox({});

    // homepage missing array call not valid parameter

    QUnit.module("sap.ushell.AppInfoParameters", {
        afterEach: function () {
            sandbox.restore();
        }
    });

    // error cases
    QUnit.test("getInfo is called without a required object, an application", function (assert) {
        var done = assert.async();
        AppInfoParameters.getInfo(["appFrameworkId"] /* application is missing here */)
            .then(function (oInfo) {
                assert.ok(false, "Promise was not rejected");
                done();
            }, function (oResult) {
                assert.ok(true, "Promise was rejected with message " + oResult);
                done();
            });
    });

    QUnit.test("getInfo is called with an invalid parameter", function (assert) {
        return AppInfoParameters.getInfo(["invalidParameter"], { applicationType: "UI5" })
            .then(function (oInfo) {
                assert.strictEqual(oInfo.invalidParameter, undefined, "Promise resolved with value undefined");
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
            });
    });

    QUnit.test("getInfo resolves with the correct value for 'appId' if it is a function defined in a URL template", function (assert) {
        sandbox.stub(AppConfiguration, "getCurrentApplication").returns({
            appCapabilities: {
                appFrameworkId: "SCP",
                appId: function () { }
            }
        });
        return AppInfoParameters.getInfo(["appFrameworkId"], { applicationType: "URL" })
            .then(function (oInfo) {
                assert.strictEqual(oInfo.appId, undefined, "resolves with appId correctly");
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
            });
    });

    // end error cases

    QUnit.test("getInfo resolves with the correct values when given an array'", function (assert) {
        var oCurrentApplication = {
            applicationType: "UI5",
            getTechnicalParameter: function () {
                return Promise.resolve(["myValue"]);
            }
        };

        return AppInfoParameters.getInfo(["appId", "appSupportInfo"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.appId, "myValue", "resolves with 1st parameter correctly");
                assert.strictEqual(oInfo.appSupportInfo, "myValue", "resolves with 2 parameter correctly");
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
            });
    });

    QUnit.test("getInfo resolves with the correct values when given a home app", function (assert) {
        var oCurrentApplication = {
            applicationType: "UI5",
            getTechnicalParameter: function () {
                return Promise.resolve(["myValue"]);
            },
            homePage: true
        };
        assert.expect(1);
        return AppInfoParameters.getInfo(["appId", "appSupportInfo"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.appId, "LAUNCHPAD (myValue)", "resolves correctly");
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
            });
    });

    QUnit.test("getInfo resolves with the correct value when given a home app and an empty fiori ID", function (assert) {
        var oCurrentApplication = {
            applicationType: "UI5",
            getTechnicalParameter: function () {
                return Promise.resolve([""]);
            },
            homePage: true
        };
        assert.expect(1);
        return AppInfoParameters.getInfo(["appId"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.appId, "LAUNCHPAD", "resolves correctly");
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
            });
    });

    QUnit.test("getInfo resolves with the correct value for 'appFrameworkId'", function (assert) {
        return AppInfoParameters.getInfo(["appFrameworkId"], { applicationType: "UI5" })
            .then(function (oInfo) {
                assert.strictEqual(oInfo.appFrameworkId, "UI5", "resolves with appFrameworkId correctly");
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
            });
    });

    QUnit.test("getInfo resolves appFrameworkId with 'GUI'  for 'TR' apps", function (assert) {
        return AppInfoParameters.getInfo(["appFrameworkId"], { applicationType: "TR" })
            .then(function (oInfo) {
                assert.strictEqual(oInfo.appFrameworkId, "GUI", "resolves with rewritten appFrameworkId");
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
            });
    });

    QUnit.test("getInfo resolves with the correct value for 'appFrameworkId' if it is a URL template", function (assert) {
        sandbox.stub(AppConfiguration, "getCurrentApplication").returns(
            { appCapabilities: { appFrameworkId: "SCP" } }
        );
        return AppInfoParameters.getInfo(["appFrameworkId"], { applicationType: "URL" })
            .then(function (oInfo) {
                assert.strictEqual(oInfo.appFrameworkId, "SCP", "resolves with appFrameworkId correctly");
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
            });
    });

    // abap

    QUnit.test("getInfo resolves with the correct value LAUNCHPAD for 'appId'", function (assert) {
        var oCurrentApplication = {
            applicationType: "UI5",
            homePage: true,
            getTechnicalParameter: function () {
                return Promise.resolve(undefined);
            }
        };
        return AppInfoParameters.getInfo(["appId"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.appId, "LAUNCHPAD", "resolves with appId correctly");
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
            });
    });

    // plain vanilla use case
    QUnit.test("getInfo resolves with the correct value for 'appId'", function (assert) {
        var oCurrentApplication = {
            applicationType: "UI5",

            getTechnicalParameter: function () {
                return Promise.resolve().then(
                    function () {
                        return ["myApplicationId"];
                    }
                );
            }
        };
        return AppInfoParameters.getInfo(["appId"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.appId, "myApplicationId", "resolves with appId correctly");
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
            });
    });

    QUnit.test("getInfo resolves correctly for 'appFrameworkId', 'appId' in case of a url-template", function (assert) {
        sandbox.stub(AppConfiguration, "getCurrentApplication").returns({
            appCapabilities: {
                appFrameworkId: "UI5",
                appId: "myApplicationId"
            }
        });
        var oCurrentApplication = {
            applicationType: "URL",
            getTechnicalParameter: function () {
                return Promise.resolve(undefined);
            }
        };

        return AppInfoParameters.getInfo(["appFrameworkId", "appId"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.appFrameworkId, "UI5", "resolves with appFrameworkId correctly");
                assert.strictEqual(oInfo.appId, "myApplicationId", "resolves with appId correctly");
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
            });
    });

    QUnit.test("getInfo resolves with the correct value for 'appSupportInfo'", function (assert) {
        var oCurrentApplication = {
            applicationType: "UI5",
            getTechnicalParameter: function () {
                return Promise.resolve(["myAppSupportInfo"]);
            }
        };
        return AppInfoParameters.getInfo(["appId"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.appId, "myAppSupportInfo", "resolves with appSupportInfo correctly");
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
            });
    });

    QUnit.test("getInfo resolves correctly 'appSupportInfo' and 'technicalAppComponentId' for URL template", function (assert) {
        var oCurrentApplication = {
            applicationType: "URL",
            getTechnicalParameter: function () {
                return Promise.resolve(undefined);
            }
        };
        sandbox.stub(AppConfiguration, "getCurrentApplication").returns(
            {
                appCapabilities: {
                    appFrameworkId: "SCP",
                    appSupportInfo: "supportInfo",
                    technicalAppComponentId: "m.m"
                }
            }
        );
        return AppInfoParameters.getInfo(["appSupportInfo", "technicalAppComponentId"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.appSupportInfo, "supportInfo", "resolves with appSupportInfo correctly");
                assert.strictEqual(oInfo.technicalAppComponentId, "m.m", "resolves with technicalAppComponentId correctly");
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
            });
    });

    QUnit.test("getInfo resolves with the correct value for 'productName' and custom property", function (assert) {
        var oCurrentApplication = {
            applicationType: "UI5",
            getSystemContext: function () {
                return Promise.resolve().then(
                    function () {
                        return {
                            getProperty: function () {
                                return "foo";
                            }
                        };
                    }
                );
            }
        };

        return AppInfoParameters.getInfo(["productName", "myCustom.property"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.productName, "foo", "resolves with productName correctly");
                assert.strictEqual(oInfo["myCustom.property"], "foo", "resolves with custom property correctly");
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
            });
    });

    QUnit.test("getAllAppInfo resolves with the correct value for custom property, if getInfo is called beforehand and custom property was not defined", function (assert) {
        // Arrange
        sandbox.stub(Container, "getServiceAsync").withArgs("ReferenceResolver").resolves({
            resolveReferences: sandbox.stub().resolves({
                "User.env.sap-theme-NWBC": "blue",
                "User.env.sap-languagebcp47": "foo"
            })
        });

        var oCurrentApplication = {
            applicationType: "UI5",
            getSystemContext: function () {
                return Promise.resolve().then(
                    function () {
                        return {
                            getProperty: function (arg) {
                                return arg === "productName" ? "foo" : undefined;
                            }
                        };
                    }
                );
            },
            getTechnicalParameter: function () {
                return Promise.resolve(["myApplicationId"]);
            }
        };

        return AppInfoParameters.getInfo(["productName", "myCustom.property"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.productName, "foo", "getInfo resolves with productName correctly");
                assert.strictEqual(oInfo["myCustom.property"], undefined, "getInfo resolves with custom property correctly");
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
            })
            .then(function (oInfo) {
                // Act
                return AppInfoParameters.getAllAppInfo(false, oCurrentApplication);
            })
            // Assert
            .then(function (oAllAppInfo) {
                assert.strictEqual(oAllAppInfo.hasOwnProperty("myCustom.property"), false, "getAllAppInfo resolves with custom property correctly");
            });
    });

    /**
     * Values have to be provided as objects
     * @deprecated since 1.120
     */
    QUnit.test("getAllAppInfo resolves with the correct value for custom property, even if value is undefined", function (assert) {
        // Arrange
        sandbox.stub(Container, "getServiceAsync").withArgs("ReferenceResolver").resolves({
            resolveReferences: sandbox.stub().resolves({
                "User.env.sap-theme-NWBC": "blue",
                "User.env.sap-languagebcp47": "foo"
            })
        });
        var oCurrentApplication = {
            applicationType: "UI5",
            getSystemContext: function () {
                return Promise.resolve().then(
                    function () {

                        return {

                            getProperty: function (arg) {
                                return arg === "productName" ? "foo" : undefined;
                            }
                        };
                    }
                );
            },
            getTechnicalParameter: function () {
                return Promise.resolve(["myApplicationId"]);
            }
        };
        AppInfoParameters.setCustomAttributes({
            customProperties: {
                "wa.e": 5,
                "wa.f": undefined
            }
        });
        // Act
        return AppInfoParameters.getAllAppInfo(false, oCurrentApplication)
        // Assert
            .then(function (oAllAppInfo) {
                assert.strictEqual(oAllAppInfo["wa.e"], 5, "getAllAppInfo resolves with custom property with value 5 correctly");
                assert.strictEqual(oAllAppInfo["wa.f"], undefined, "getAllAppInfo resolves with correct value for a custom property with value undefined");
                assert.strictEqual(oAllAppInfo.hasOwnProperty("wa.f"), true, "getAllAppInfo resolves with correct property with custom property that has value undefined");
            });
    });



    QUnit.test("getInfo resolves technicalAppComponentId with the correct value (w/ componentInstance, w/ manifest)", function (assert) {
        var oCurrentApplication = {
            applicationType: "UI5",
            componentInstance: {
                getManifestEntry: sinon.stub().returns("myComponentName")
            }
        };

        return AppInfoParameters.getInfo(["technicalAppComponentId"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.technicalAppComponentId, "myComponentName", "resolves with technicalAppComponentId correctly");
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
            });
    });

    QUnit.test("getInfo resolves technicalAppComponentId with the correct value (w/ componentInstance, w/o manifest)", function (assert) {
        var oCurrentApplication = {
            applicationType: "UI5",
            componentInstance: {
                getManifestEntry: sinon.stub().returns(undefined),
                getMetadata: sinon.stub().returns({
                    getComponentName: sinon.stub().returns("myComponentName")
                })
            }
        };

        return AppInfoParameters.getInfo(["technicalAppComponentId"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.technicalAppComponentId, "myComponentName", "resolves with technicalAppComponentId correctly");
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
            });
    });

    QUnit.test("getInfo resolves technicalAppComponentId with the correct value (w/o componentInstance)", function (assert) {
        var oCurrentApplication = {
            applicationType: "UI5"
        };

        sandbox.stub(AppConfiguration, "getMetadata").returns({
            technicalName: "myComponentName"
        });

        return AppInfoParameters.getInfo(["technicalAppComponentId"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.technicalAppComponentId, "myComponentName", "resolves with technicalAppComponentId correctly");
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
            });
    });

    QUnit.test("getInfo resolves transaction with the correct value (with metadata) followed by a space and some characters", function (assert) {
        // Arrange
        sandbox.stub(AppConfiguration, "getMetadata").returns({
            technicalName: "myTransactionName (TCODE)"
        });
        var oCurrentApplication = {
            applicationType: "TR"
        };
        // Act
        return AppInfoParameters.getInfo(["technicalAppComponentId"], oCurrentApplication)
            .then(function (oInfo) {
                // Assert
                assert.strictEqual(oInfo.technicalAppComponentId, "myTransactionName", "resolves with technicalAppComponentId correctly");
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
            });
    });

    QUnit.test("getInfo resolves transaction with the correct value (with metadata) with a leading asterisk", function (assert) {
        // Arrange
        sandbox.stub(AppConfiguration, "getMetadata").returns({
            technicalName: "*myTransactionName (TCODE)"
        });
        var oCurrentApplication = {
            applicationType: "TR"
        };
        // Act
        return AppInfoParameters.getInfo(["technicalAppComponentId"], oCurrentApplication)
            .then(function (oInfo) {
                // Assert
                assert.strictEqual(oInfo.technicalAppComponentId, "myTransactionName", "resolves with technicalAppComponentId correctly");
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
            });
    });

    // plain vanilla use case
    QUnit.test("getInfo resolves with the correct value for 'appId'", function (assert) {
        var oCurrentApplication = {
            applicationType: "UI5",

            getTechnicalParameter: function () {
                return Promise.resolve(["myApplicationId"]);
            }
        };
        return AppInfoParameters.getInfo(["appId"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.appId, "myApplicationId", "resolves with appId correctly");
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
            });
    });

    QUnit.test("getInfo resolves with the correct value for 'appSupportInfo'", function (assert) {
        var oCurrentApplication = {
            applicationType: "UI5",
            getTechnicalParameter: function () {
                return Promise.resolve(["myAppSupportInfo"]);
            }
        };
        return AppInfoParameters.getInfo(["appId"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.appId, "myAppSupportInfo", "resolves with appSupportInfo correctly");
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
            });
    });

    QUnit.test("getInfo resolves with the correct value for 'productName'", function (assert) {
        var oCurrentApplication = {
            applicationType: "UI5",
            getSystemContext: function () {
                return Promise.resolve().then(
                    function () {
                        return {
                            getProperty: function () {
                                return "myProductName";
                            }
                        };
                    }
                );
            }
        };

        return AppInfoParameters.getInfo(["productName"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.productName, "myProductName", "resolves with productName correctly");
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
            });
    });

    QUnit.test("getInfo resolves with the correct value for 'technicalAppComponentId'", function (assert) {
        var oCurrentApplication = {
            applicationType: "UI5",
            componentInstance: {
                getManifestEntry: sinon.stub().returns("myComponentName")
            }
        };
        return AppInfoParameters.getInfo(["technicalAppComponentId"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.technicalAppComponentId, "myComponentName", "resolves with technicalAppComponentId correctly");
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
            });
    });

    QUnit.test("getInfo resolves with the correct value for appIntent", function (assert) {
        sandbox.stub(AppConfiguration, "getCurrentApplication").returns({
            appCapabilities: {
                appFrameworkId: "SCP"
            }
        });
        var oApplication = {
            applicationType: "URL",
            appCapabilities: {
                appFrameworkId: "SCP"
            }
        };
        window.hasher = window.hasher || { getHash: function () { } };
        sandbox.stub(window.hasher, "getHash").returns("Shell-hash");
        return AppInfoParameters.getInfo(["appIntent"], oApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.appIntent, "Shell-hash", "resolves with app intent correctly");
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
            });
    });

    QUnit.test("getInfo resolves appFrameworkVersion with the correct value for UI5 apps", function (assert) {
        var oVersionStub = {
            version: "myVersion",
            buildTimestamp: "myTimestamp"
        };
        sandbox.stub(VersionInfo, "load").returns(
            Promise.resolve(oVersionStub)
        );
        var oCurrentApplication = {
            applicationType: "UI5"
        };
        return AppInfoParameters.getInfo(["appFrameworkVersion"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(
                    oInfo.appFrameworkVersion,
                    "myVersion (myTimestamp)",
                    "resolves with the app framework version correctly"
                );
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
            });
    });

    QUnit.test("getInfo resolves appFrameworkVersion with undefined for non-UI5 apps", function (assert) {
        var oVersionStub = {
            version: "myVersion",
            buildTimestamp: "myTimestamp"
        };
        sandbox.stub(VersionInfo, "load").returns(
            Promise.resolve(oVersionStub)
        );
        var oCurrentApplication = {
            applicationType: "WDA"
        };
        return AppInfoParameters.getInfo(["appFrameworkVersion"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(
                    oInfo.appFrameworkVersion,
                    undefined,
                    "resolves with no framework version (undefined)"
                );
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
            });
    });

    QUnit.test("getInfo resolves with undefined for appFrameworkVersion if the VersionInfo cannot be loaded properly", function (assert) {
        sandbox.stub(VersionInfo, "load").returns(
            Promise.reject(undefined)
        );
        var oLogErrorStub = sandbox.stub(Log, "error");
        var oCurrentApplication = {
            applicationType: "UI5"
        };
        return AppInfoParameters.getInfo(["appFrameworkVersion"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.appFrameworkVersion, undefined, "resolves with the app framework verions correctly");
                assert.strictEqual(oLogErrorStub.firstCall.args[0], "VersionInfo could not be loaded", "Error was logged");
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
            });
    });

    QUnit.test("getInfo resolves with the correct value for appVersion", function (assert) {
        var oCurrentApplication = {
            applicationType: "UI5",
            componentInstance: {
                getManifestEntry: sinon.stub().returns("myVersion")
            }
        };
        return AppInfoParameters.getInfo(["appVersion"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.appVersion, "myVersion", "resolves with the app version id correctly");
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
            });
    });

    QUnit.test("getInfo resolves with the correct value for theme and language", function (assert) {
        sandbox.stub(AppConfiguration, "getCurrentApplication").returns({
            appCapabilities: {
                appFrameworkId: "URL"
            }
        });

        sandbox.stub(Container, "getServiceAsync").withArgs("ReferenceResolver").resolves({
            resolveReferences: sandbox.stub().resolves({
                "User.env.sap-theme-NWBC": "blue",
                "User.env.sap-languagebcp47": "foo"
            })
        });

        var oCurrentApplication = {
            applicationType: "URL"
        };
        return AppInfoParameters.getInfo(["theme", "languageTag"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.theme, "blue", "resolves with the appIcon id correctly");
                assert.strictEqual(oInfo.languageTag, "foo", "resolves with the appIcon id correctly");
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
            });
    });
});
