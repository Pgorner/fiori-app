// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @file QUnit tests for "sandbox".
 */
sap.ui.define([
    "sap/ui/thirdparty/URI",
    "sap/ushell/test/utils",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/bootstrap/sandbox"
], function (
    URI,
    testUtils,
    jQuery
) {
    "use strict";

    /* global sinon, QUnit */

    // get the URL of our own script; if included by ui2 qunitrunner, a global variable is filled
    var sOwnScriptUrl = window["sap-ushell-qunitrunner-currentTestScriptUrl"];

    var sCachedUshellConfig = JSON.stringify(window["sap-ushell-config"]),
        oBaseConfig = {
            defaultRenderer: "fiori2",
            services: {
                LaunchPage: {
                    adapter: {
                        config: {
                            catalogs: [{
                                id: "sample_catalog",
                                title: "Sample Application Catalog",
                                tiles: [{
                                    id: "tofoobar",
                                    title: "Foo Bar Application",
                                    size: "1x1",
                                    tileType: "sap.ushell.ui.tile.StaticTile",
                                    properties: {
                                        chipId: "catalogTile_00",
                                        title: "Foo Bar Application",
                                        info: "shows foo bar",
                                        icon: "sap-icon://Fiori2/F0001",
                                        targetURL: "#Foo-bar"
                                    }
                                }, {
                                    id: "tofoobar2",
                                    title: "Foo Bar 2 Application",
                                    size: "1x1",
                                    tileType: "sap.ushell.ui.tile.StaticTile",
                                    properties: {
                                        chipId: "catalogTile_01",
                                        title: "Foo Bar 2 Application",
                                        info: "shows foo bar 2",
                                        icon: "sap-icon://Fiori2/F0001",
                                        targetURL: "#Foo-bar2"
                                    }
                                }]
                            }],
                            groups: [{
                                id: "sample_group",
                                title: "Sample Applications",
                                isPreset: true,
                                isVisible: true,
                                isGroupLocked: false,
                                tiles: [{
                                    id: "tofoobar",
                                    title: "Foo Bar Application",
                                    size: "1x1",
                                    tileType: "sap.ushell.ui.tile.StaticTile",
                                    properties: {
                                        chipId: "catalogTile_00",
                                        title: "Foo Bar Application",
                                        info: "shows foo bar",
                                        icon: "sap-icon://Fiori2/F0001",
                                        targetURL: "#Foo-bar"
                                    }
                                }, {
                                    id: "tofoobar2",
                                    title: "Foo Bar 2 Application",
                                    size: "1x1",
                                    tileType: "sap.ushell.ui.tile.StaticTile",
                                    properties: {
                                        chipId: "catalogTile_01",
                                        title: "Foo Bar 2 Application",
                                        info: "shows foo bar 2",
                                        icon: "sap-icon://Fiori2/F0001",
                                        targetURL: "#Foo-bar2"
                                    }
                                }]
                            }]
                        }
                    }
                },
                FlpLaunchPage: {
                    adapter: {
                        config: {
                            catalogs: [{
                                id: "sample_catalog",
                                title: "Sample Application Catalog",
                                tiles: [{
                                    id: "tofoobar",
                                    title: "Foo Bar Application",
                                    size: "1x1",
                                    tileType: "sap.ushell.ui.tile.StaticTile",
                                    properties: {
                                        chipId: "catalogTile_00",
                                        title: "Foo Bar Application",
                                        info: "shows foo bar",
                                        icon: "sap-icon://Fiori2/F0001",
                                        targetURL: "#Foo-bar"
                                    }
                                }, {
                                    id: "tofoobar2",
                                    title: "Foo Bar 2 Application",
                                    size: "1x1",
                                    tileType: "sap.ushell.ui.tile.StaticTile",
                                    properties: {
                                        chipId: "catalogTile_01",
                                        title: "Foo Bar 2 Application",
                                        info: "shows foo bar 2",
                                        icon: "sap-icon://Fiori2/F0001",
                                        targetURL: "#Foo-bar2"
                                    }
                                }]
                            }],
                            groups: [{
                                id: "sample_group",
                                title: "Sample Applications",
                                isPreset: true,
                                isVisible: true,
                                isGroupLocked: false,
                                tiles: [{
                                    id: "tofoobar",
                                    title: "Foo Bar Application",
                                    size: "1x1",
                                    tileType: "sap.ushell.ui.tile.StaticTile",
                                    properties: {
                                        chipId: "catalogTile_00",
                                        title: "Foo Bar Application",
                                        info: "shows foo bar",
                                        icon: "sap-icon://Fiori2/F0001",
                                        targetURL: "#Foo-bar"
                                    }
                                }, {
                                    id: "tofoobar2",
                                    title: "Foo Bar 2 Application",
                                    size: "1x1",
                                    tileType: "sap.ushell.ui.tile.StaticTile",
                                    properties: {
                                        chipId: "catalogTile_01",
                                        title: "Foo Bar 2 Application",
                                        info: "shows foo bar 2",
                                        icon: "sap-icon://Fiori2/F0001",
                                        targetURL: "#Foo-bar2"
                                    }
                                }]
                            }]
                        }
                    }
                },
                NavTargetResolution: {
                    adapter: {
                        config: {
                            applications: {
                                "Foo-bar": {
                                    _comment: "Commenting the world famous foobar application!",
                                    additionalInformation: "SAPUI5.Component=sap.foo.bar.FooBarApplication",
                                    applicationType: "URL",
                                    url: "/foo/bar/application",
                                    description: "The world famous foobar application!"
                                },
                                "Foo-bar2": {
                                    _comment: "Commenting why the sequel is better than the original.",
                                    additionalInformation: "SAPUI5.Component=sap.foo.bar.FooBar2Application",
                                    applicationType: "URL",
                                    url: "/foo/bar2/application",
                                    description: "Second edition of the world famous foobar application!"
                                }
                            }
                        }
                    }
                },
                NavTargetResolutionInternal: {
                    adapter: {
                        config: {
                            applications: {
                                "Foo-bar": {
                                    _comment: "Commenting the world famous foobar application!",
                                    additionalInformation: "SAPUI5.Component=sap.foo.bar.FooBarApplication",
                                    applicationType: "URL",
                                    url: "/foo/bar/application",
                                    description: "The world famous foobar application!"
                                },
                                "Foo-bar2": {
                                    _comment: "Commenting why the sequel is better than the original.",
                                    additionalInformation: "SAPUI5.Component=sap.foo.bar.FooBar2Application",
                                    applicationType: "URL",
                                    url: "/foo/bar2/application",
                                    description: "Second edition of the world famous foobar application!"
                                }
                            }
                        }
                    }
                }
            }
        },
        oObsoleteConfigPart = {
            applications: {
                "Custom-action1": {
                    _comment: "We generate entries from this!",
                    additionalInformation: "SAPUI5.Component=sap.custom.action.Application",
                    applicationType: "URL",
                    url: "/custom/action/application",
                    description: "Our amazing custom test application!"
                },
                "Custom-action2": {
                    _comment: "Component without namespace",
                    additionalInformation: "SAPUI5.Component=Application",
                    applicationType: "URL",
                    url: "/custom/action/application",
                    description: "Our amazing custom test application!"
                },
                "Custom-action3": {
                    _comment: "Application with title",
                    additionalInformation: "SAPUI5.Component=sap.custom.action.Application",
                    applicationType: "URL",
                    url: "/custom/action/application",
                    description: "Our amazing custom test application!",
                    title: "My application title"
                }
            }
        },
        oGeneratedGroup = {
            id: "sap_ushell_generated_group_id",
            title: "Generated Group",
            tiles: [{
                id: "sap_ushell_generated_tile_id_0",
                title: "Application",
                size: "1x1",
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    chipId: "sap_ushell_generated_chip_id",
                    title: "Application",
                    info: "Our amazing custom test application!",
                    targetURL: "#Custom-action1"
                }
            }, {
                id: "sap_ushell_generated_tile_id_1",
                title: "Application",
                size: "1x1",
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    chipId: "sap_ushell_generated_chip_id",
                    title: "Application",
                    info: "Our amazing custom test application!",
                    targetURL: "#Custom-action2"
                }
            }, {
                id: "sap_ushell_generated_tile_id_2",
                title: "My application title",
                size: "1x1",
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    chipId: "sap_ushell_generated_chip_id",
                    title: "My application title",
                    info: "Our amazing custom test application!",
                    targetURL: "#Custom-action3"
                }
            }]
        };

    function cloneObject (oObject) {
        return JSON.parse(JSON.stringify(oObject));
    }

    QUnit.module("sap/ushell/bootstrap/sandbox.js", {
        beforeEach: function (assert) {
            var done = assert.async();
            sap.ushell.__sandbox__.init().then(function () {
                done();
            });
        },
        afterEach: function () {
            if (sCachedUshellConfig) {
                window["sap-ushell-config"] = JSON.parse(sCachedUshellConfig);
            }
        }
    });

    QUnit.test("_adjustApplicationConfiguration: adjust obsolete format", function (assert) {
        var oConfig = cloneObject(oBaseConfig),
            oResultingConfig = cloneObject(oBaseConfig),
            sApplication;

        oConfig.applications = cloneObject(oObsoleteConfigPart.applications);
        oResultingConfig.services.LaunchPage.adapter.config.groups.unshift(cloneObject(oGeneratedGroup));
        oResultingConfig.services.FlpLaunchPage.adapter.config.groups.unshift(cloneObject(oGeneratedGroup));
        for (sApplication in oObsoleteConfigPart.applications) {
            if (oObsoleteConfigPart.applications.hasOwnProperty(sApplication)) {
                oResultingConfig.services.NavTargetResolutionInternal.adapter.config.applications[sApplication] = oObsoleteConfigPart.applications[sApplication];
                oResultingConfig.services.NavTargetResolution.adapter.config.applications[sApplication] = oObsoleteConfigPart.applications[sApplication];
            }
        }

        // test successful adjustment, result should be new object (i.e. deepEqual)
        oConfig = sap.ushell.__sandbox__._adjustApplicationConfiguration(oConfig);

        // call deepEqual on relevant sub objects to get a nicer diff from qunit (seems to have some size/depth limit)
        assert.deepEqual(oConfig.services.LaunchPage.adapter.config, oResultingConfig.services.LaunchPage.adapter.config, "obsolete format was adjusted for LaunchPage adapter config");
        assert.deepEqual(oConfig.services.NavTargetResolutionInternal.adapter.config, oResultingConfig.services.NavTargetResolutionInternal.adapter.config,
            "obsolete format was adjusted for NavTargetResolutionInternal adapter config");
        assert.deepEqual(oConfig, oResultingConfig, "obsolete format was adjusted as expected");
    });

    QUnit.test("_applyJsonApplicationConfig: load config file and apply it", function (assert) {
        var oExpectedConfig = cloneObject(oObsoleteConfigPart),
            oLogMock,
            oAjaxStub;

        // prepare test data
        window["sap-ushell-config"] = {};

        // we have to simulate the sjax call to the backend
        oAjaxStub = sinon.stub(jQuery, "ajax");
        oAjaxStub.callsFake(function (oParameters) {
            if (oParameters.url === "success.json") {
                oParameters.success(cloneObject(oObsoleteConfigPart));
            } else {
                oParameters.error({
                    success: false,
                    error: "foo_error",
                    statusCode: 123,
                    status: "foo_error_status"
                });
            }
        });

        // provoke failure and check log
        oLogMock = testUtils.createLogMock()
            .error("Failed to load Fiori Launchpad Sandbox configuration from failure.json: " +
                "status: foo_error_status; error: foo_error")
            .sloppy(true);
        sap.ushell.__sandbox__._applyJsonApplicationConfig("failure.json", window["sap-ushell-config"]);
        oLogMock.verify();

        // run successful and check log
        oLogMock = testUtils.createLogMock()
            .debug("Evaluating fiori launchpad sandbox config JSON: " + JSON.stringify(oObsoleteConfigPart))
            .sloppy(true);
        sap.ushell.__sandbox__._applyJsonApplicationConfig("success.json", window["sap-ushell-config"]);
        oLogMock.verify();

        // check URL handling inside the function
        sap.ushell.__sandbox__._applyJsonApplicationConfig("foo.bar", window["sap-ushell-config"]);
        assert.ok(
            oAjaxStub.lastCall.args[0].url === "foo.bar.json" && oAjaxStub.lastCall.args[0].dataType === "json",
            "arguments for jQUery.ajax, 'url' and 'dataType', as expected"
        );
        sap.ushell.__sandbox__._applyJsonApplicationConfig("foobar.json", window["sap-ushell-config"]);
        assert.ok(
            oAjaxStub.lastCall.args[0].url === "foobar.json" && oAjaxStub.lastCall.args[0].dataType === "json",
            "arguments for jQUery.ajax, 'url' and 'dataType', as expected"
        );

        // check the resulting configuration
        oExpectedConfig.foo = "bar";
        window["sap-ushell-config"] = { foo: "bar" };
        sap.ushell.__sandbox__._applyJsonApplicationConfig("success.json", window["sap-ushell-config"]);
        assert.deepEqual(window["sap-ushell-config"], oExpectedConfig, "config merged as expected");
        oAjaxStub.restore();
    });

    QUnit.test("_evaluateCustomRenderer: url parameter is valid string", function (assert) {
        // first we test the clean-up, when foobar renderer is set
        window["sap-ushell-config"] = cloneObject(oBaseConfig);
        delete window["sap-ushell-config"].defaultRenderer;
        window["sap-ushell-config"].services.NavTargetResolutionInternal.adapter.config.applications[""] = { foo: "bar" };

        sap.ushell.__sandbox__._evaluateCustomRenderer("foobar", window["sap-ushell-config"]);

        assert.equal(window["sap-ushell-config"].defaultRenderer, "foobar", "default renderer set correctly");
        assert.equal(window["sap-ushell-config"].services.NavTargetResolutionInternal.adapter.config.applications[""], undefined, "nav target '' has been removed");
    });

    QUnit.test("_evaluateCustomRenderer: url parameter is empty string", function (assert) {
        window["sap-ushell-config"] = cloneObject(oBaseConfig);
        window["sap-ushell-config"].services.NavTargetResolutionInternal.adapter.config.applications[""] = { foo: "bar" };

        sap.ushell.__sandbox__._evaluateCustomRenderer("", window["sap-ushell-config"]);

        assert.equal(window["sap-ushell-config"].defaultRenderer, oBaseConfig.defaultRenderer, "default renderer is kept");
        assert.equal(window["sap-ushell-config"].services.NavTargetResolutionInternal.adapter.config.applications[""], undefined, "nav target '' has been removed");
    });

    QUnit.test("_evaluateCustomRenderer: url parameter is undefined", function (assert) {
        window["sap-ushell-config"] = cloneObject(oBaseConfig);
        window["sap-ushell-config"].services.NavTargetResolutionInternal.adapter.config.applications[""] = { foo: "bar" };

        sap.ushell.__sandbox__._evaluateCustomRenderer(undefined, window["sap-ushell-config"]);

        assert.equal(window["sap-ushell-config"].defaultRenderer, oBaseConfig.defaultRenderer, "default renderer is kept");
        assert.equal(window["sap-ushell-config"].services.NavTargetResolutionInternal.adapter.config.applications[""], undefined, "nav target '' has been removed");
    });

    QUnit.test("_evaluateCustomRenderer: url parameter is number", function (assert) {
        window["sap-ushell-config"] = cloneObject(oBaseConfig);
        window["sap-ushell-config"].services.NavTargetResolutionInternal.adapter.config.applications[""] = { foo: "bar" };

        sap.ushell.__sandbox__._evaluateCustomRenderer(16, window["sap-ushell-config"]);

        assert.equal(window["sap-ushell-config"].defaultRenderer, oBaseConfig.defaultRenderer, "default renderer is kept");
        assert.equal(window["sap-ushell-config"].services.NavTargetResolutionInternal.adapter.config.applications[""], undefined, "nav target '' has been removed");
    });

    QUnit.test("_evaluateCustomRenderer: url parameter is 'fiorisandbox'", function (assert) {
        var defaultNavTarget = { foo: "bar" };

        // first we test the clean-up, when foobar renderer is set
        window["sap-ushell-config"] = cloneObject(oBaseConfig);
        window["sap-ushell-config"].defaultRenderer = "foobar";
        window["sap-ushell-config"].services.NavTargetResolutionInternal.adapter.config.applications[""] = defaultNavTarget;

        sap.ushell.__sandbox__._evaluateCustomRenderer("fiorisandbox", window["sap-ushell-config"]);

        assert.equal(window["sap-ushell-config"].defaultRenderer, "fiorisandbox", "default renderer set correctly");
        assert.deepEqual(window["sap-ushell-config"].services.NavTargetResolutionInternal.adapter.config.applications[""], defaultNavTarget, "default nav target is kept");
    });

    QUnit.test("fioriSandboxConfig.json: parse file to check consistency", function (assert) {
        var done = assert.async();
        var sRelativeConfigJsonPath = sap.ui.require.toUrl("sap/ushell/shells/sandbox/fioriSandboxConfig.json");
        var sConfigJsonPath;

        if (sOwnScriptUrl) {
            sConfigJsonPath = new URI(sOwnScriptUrl).directory() + "/" + sRelativeConfigJsonPath;
        } else {
            sConfigJsonPath = sRelativeConfigJsonPath;
        }
        fetch(sConfigJsonPath)
        .then(function (response) {
            return response.json();
        })
        .then(function (oResponseData) {
            assert.ok(Object.prototype.toString.apply(oResponseData.services.LaunchPage.adapter.config.groups) === "[object Array]", "groups array detected in config");
            done();
        });
    });
});
