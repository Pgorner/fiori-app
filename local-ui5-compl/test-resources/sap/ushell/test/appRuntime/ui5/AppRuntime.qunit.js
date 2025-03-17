// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

QUnit.config.testTimeout = 240000;

/**
 * @fileOverview QUnit tests for sap.ushell.appRuntime.ui5.AppRuntime
 */
sap.ui.define([
    "sap/ui/thirdparty/URI",
    "sap/ushell/appRuntime/ui5/AppRuntime",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/utils/WindowUtils",
    "sap/ui/core/BusyIndicator",
    "sap/m/library",
    "sap/ushell/appRuntime/ui5/AppRuntimeContext",
    "sap/ushell/Container",
    "sap/ushell/appRuntime/ui5/AppCommunicationMgr",
    "sap/ui/thirdparty/hasher"
], function (
    URI,
    AppRuntime,
    jQuery,
    AppRuntimeService,
    WindowUtils,
    BusyIndicator,
    mobileLibrary,
    AppRuntimeContext,
    Container,
    AppCommunicationMgr,
    hasher
) {
    "use strict";

    /* global QUnit, sinon */

    // shortcut for sap.m.URLHelper
    const URLHelper = mobileLibrary.URLHelper;

    QUnit.config.reorder = false;
    const sandbox = sinon.createSandbox({});

    const fnRedirectOrig = URLHelper.redirect;
    let sParamURL;
    let bParambNewWindow;
    function resetRedirectParams () {
        sParamURL = "****";
        bParambNewWindow = "****";
    }
    URLHelper.redirect = function (sURL, bNewWindow) {
        sParamURL = sURL;
        bParambNewWindow = bNewWindow;
    };

    BusyIndicator.hide();

    QUnit.module("sap.ushell.appRuntime.ui5.appRuntime", {
        after: function () {
            URLHelper.redirect = fnRedirectOrig;
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("test getPageConfig", function (assert) {
        const oConfig = {
            services: {
            },
            bootstrapPlugins: {
                WAPluginAgent: {
                    component: "a.b.c",
                    config: {
                        "sap-plugin-agent": true
                    }
                }
            }
        };
        const oUrlData = new URI("http://www.test.com?sap-remote-intent=A-B").query(true);
        jQuery("head").append("<meta name='sap.ushellConfig.ui5appruntime' content='" + JSON.stringify(oConfig) + "'/>");

        AppRuntime._prepareUshellConfig();
        AppRuntime.getPageConfig(oUrlData);
        assert.ok(!window["sap-ushell-config"].bootstrapPlugins.WAPluginAgent.config.hasOwnProperty("sap-plugin-agent"),
            "in scube, WAPluginAgent should not have sap-plugin-agent");
        jQuery("[name='sap.ushellConfig.ui5appruntime']").remove();
    });

    QUnit.test("getAppInfo from adapter", function (assert) {
        const done = assert.async();
        const sap_ushell_config = window["sap-ushell-config"];
        window["sap-ushell-config"] = {
            ui5appruntime: {
                config: {
                    appIndex: {
                        module: "sap.ushell.shells.demo.cspJSFiles.AppInfoAdapterSample",
                        data: {}
                    }
                }
            }
        };

        const result = {
            ui5ComponentName: "sap.ushell.demo.FioriSandboxDefaultApp",
            url: sap.ui.require.toUrl("sap/ushell/demoapps/FioriSandboxDefaultApp")
        };

        AppRuntime.getAppInfo("sap.ushell.demo.FioriSandboxDefaultApp").then(function (appInfo) {
            assert.ok(JSON.stringify(appInfo.oResolvedHashFragment) === JSON.stringify(result), 'getAppInfo - data was successfully received from the "module" parameter');
            window["sap-ushell-config"] = sap_ushell_config;
            done();
        });
    });

    QUnit.test("getAppInfo from html page", function (assert) {
        const done = assert.async();
        const oAppIndexInfo = {
            ui5ComponentName: "sap.ushell.demo.testApp",
            url: sap.ui.require.toUrl("sap/ushell/demoapps/testApp")
        };
        const sap_ushell_config = window["sap-ushell-config"];
        window["sap-ushell-config"] = {
            ui5appruntime: {
                config: {
                    appIndex: {
                        module: "sap.ushell.shells.demo.cspJSFiles.AppInfoAdapterSample",
                        data: oAppIndexInfo
                    }
                }
            }
        };

        AppRuntime.getAppInfo("sap.ushell.demo.FioriSandboxDefaultApp").then(function (appInfo) {
            assert.ok(JSON.stringify(appInfo.oResolvedHashFragment) === JSON.stringify(oAppIndexInfo), 'getAppInfo - data was successfully received from the "module" parameter');
            window["sap-ushell-config"] = sap_ushell_config;
            done();
        });
    });

    QUnit.test("getAppInfo for S/Cube", function (assert) {
        const done = assert.async();

        setTimeout(function () {
            const result = {
                app: 1
            };

            const oStubResolve = sandbox.stub().callsFake(function (sIntentPlusParams) {
                return new jQuery.Deferred().resolve(result).promise();
            });

            sandbox.stub(Container, "getServiceAsync").callsFake(function () {
                return Promise.resolve({
                    resolveHashFragmentLocal: oStubResolve
                });
            });

            AppRuntime.getAppInfo(undefined, "Test-App").then(function (appInfo) {
                assert.ok(JSON.stringify(appInfo.oResolvedHashFragment) === JSON.stringify(result), 'getAppInfo - data was successfully received from the "module" parameter');
                assert.ok(JSON.stringify(appInfo.oParsedHash) === JSON.stringify({
                    semanticObject: "Test",
                    action: "App",
                    params: {}
                }), 'getAppInfo - data was successfully received from the "module" parameter');
                Container.getServiceAsync("NavTargetResolutionInternal").then(function (oNavTargetResolution) {
                    assert.ok(oNavTargetResolution.resolveHashFragmentLocal.callCount === 1, "");
                    assert.ok(oNavTargetResolution.resolveHashFragmentLocal.args[0][0], "#Test-App");
                    done();
                });
            });
        }, 6000);
    });

    QUnit.test("send email", function (assert) {
        const done = assert.async();
        setTimeout(function () {
            const oStub = sandbox.stub(AppRuntimeService, "postMessageToFLP");
            AppRuntime.overrideUrlHelperFuncs();
            AppRuntime.overrideUrlHelperFuncs();
            URLHelper.triggerEmail();

            setTimeout(function () {
                assert.ok(oStub.calledOnce, "Our 'triggerEmail' function was overrided more than one time. " +
                    "This test was created for navigating between two IFrames in one blue box and verified that the triggerEmail function was not override more than one time");
                done();
            }, 500);
        }, 1000);//be sure that Container created all services
    });

    QUnit.test("loadPlugins", function (assert) {
        const done = assert.async();
        setTimeout(function () {
            Container.getServiceAsync("PluginManager").then(function (PluginManager) {
                const oStub = sandbox.stub(PluginManager, "loadPlugins").callsFake(function () { });

                AppRuntime.loadPlugins();
                AppRuntime.loadPlugins();

                setTimeout(function () {
                    assert.ok(oStub.calledOnce, "loadPlugins should be called only once");
                    done();
                }, 500);
            });
        }, 6000);
    });

    [{
        name: "1 - no 'sap-manifest-width' parameter passed through the Iframe URL. manifest has no fullwidth parameter. Default full width",
        input: {
            urlSapManifestWidth: undefined,
            manifestFullwidthVal: undefined
        },
        output: {
            hasClassSapUiSizeCompact: false, // do not have this class, but the default is full width.
            hasClassSapUShellApplicationContainerLimitedWidth: false,
            hasClassSapUShellApplicationContainer: false
        }
    }, {
        name: "2 - 'sap-manifest-width' parameter passed through the Iframe URL with value other than true. manifest has no fullwidth parameter. Default full width",
        input: {
            urlSapManifestWidth: "nottrue", // do not have this class, but the default is full width.
            manifestFullwidthVal: undefined
        },
        output: {
            hasClassSapUiSizeCompact: false,
            hasClassSapUShellApplicationContainerLimitedWidth: false,
            hasClassSapUShellApplicationContainer: false
        }
    }, {
        name: "3 - 'sap-manifest-width' parameter passed through the Iframe URL with value true. manifest has no fullwidth parameter",
        input: {
            urlSapManifestWidth: "true",
            manifestFullwidthVal: undefined
        },
        output: {
            hasClassSapUiSizeCompact: false,
            hasClassSapUShellApplicationContainerLimitedWidth: true,
            hasClassSapUShellApplicationContainer: true
        }
    }, {
        name: "4- sap-manifest-width parameter passed through the Iframe URL with value true. manifest has fullwidth=true",
        input: {
            urlSapManifestWidth: "true",
            manifestFullwidthVal: true
        },
        output: {
            hasClassSapUiSizeCompact: true,
            hasClassSapUShellApplicationContainerLimitedWidth: false,
            hasClassSapUShellApplicationContainer: false
        }
    }, {
        name: "5 - sap-manifest-width parameter passed through the Iframe URL with value true. manifest has fullwidth=false",
        input: {
            urlSapManifestWidth: "true",
            manifestFullwidthVal: false
        },
        output: {
            hasClassSapUiSizeCompact: false,
            hasClassSapUShellApplicationContainerLimitedWidth: true,
            hasClassSapUShellApplicationContainer: true
        }
    }, {
        name: "6 - no 'sap-manifest-width' parameter passed through the Iframe URL. manifest has fullwidth=false",
        input: {
            urlSapManifestWidth: undefined,
            manifestFullwidthVal: false
        },
        output: {
            hasClassSapUiSizeCompact: false,
            hasClassSapUShellApplicationContainerLimitedWidth: true,
            hasClassSapUShellApplicationContainer: true
        }
    }, {
        name: "7 - no 'sap-manifest-width' parameter passed through the Iframe URL. manifest has fullwidth=true",
        input: {
            urlSapManifestWidth: undefined,
            manifestFullwidthVal: true
        },
        output: {
            hasClassSapUiSizeCompact: true,
            hasClassSapUShellApplicationContainerLimitedWidth: false,
            hasClassSapUShellApplicationContainer: false
        }
    }, {
        name: "8 - sap-manifest-width' parameter passed through the Iframe URL with value other than true. manifest has fullwidth=false",
        input: {
            urlSapManifestWidth: "nottrue",
            manifestFullwidthVal: false
        },
        output: {
            hasClassSapUiSizeCompact: false,
            hasClassSapUShellApplicationContainerLimitedWidth: true,
            hasClassSapUShellApplicationContainer: true
        }
    }, {
        name: "9 - sap-manifest-width' parameter passed through the Iframe URL with value other than true. manifest has fullwidth=true",
        input: {
            urlSapManifestWidth: "nottrue",
            manifestFullwidthVal: true
        },
        output: {
            hasClassSapUiSizeCompact: true,
            hasClassSapUShellApplicationContainerLimitedWidth: false,
            hasClassSapUShellApplicationContainer: false
        }
    }, {
        name: "10 - sap-manifest-width' parameter passed through the Iframe URL with false value. manifest has no fullwidth parameter",
        input: {
            urlSapManifestWidth: "false",
            manifestFullwidthVal: undefined
        },
        output: {
            hasClassSapUiSizeCompact: true,
            hasClassSapUShellApplicationContainerLimitedWidth: false,
            hasClassSapUShellApplicationContainer: false
        }
    }, {
        name: "11 - sap-manifest-width' parameter passed through the Iframe URL with false value. manifest has fullwidth=false",
        input: {
            urlSapManifestWidth: "false",
            manifestFullwidthVal: false
        },
        output: {
            hasClassSapUiSizeCompact: false,
            hasClassSapUShellApplicationContainerLimitedWidth: true,
            hasClassSapUShellApplicationContainer: true
        }
    }, {
        name: "12 - sap-manifest-width' parameter passed through the Iframe URL with false value. manifest has fullwidth=true",
        input: {
            urlSapManifestWidth: "false",
            manifestFullwidthVal: true
        },
        output: {
            hasClassSapUiSizeCompact: true,
            hasClassSapUShellApplicationContainerLimitedWidth: false,
            hasClassSapUShellApplicationContainer: false
        }
    }].forEach(function (oFixture) {
        QUnit.test("considerChangingTheDefaultFullWidthVal - " + oFixture.name, function (assert) {
            const done = assert.async();
            const oUrlParams = sandbox.stub(AppRuntime, "_getURIParams").callsFake(function () {
                return { "sap-manifest-width": oFixture.input.urlSapManifestWidth };
            });
            AppRuntime.init();

            const oResolutionResultWithComponentHandle = {
                componentHandle: {
                    getInstance: sandbox.stub().returns({
                        getManifestEntry: sandbox.stub().returns(oFixture.input.manifestFullwidthVal),
                        getMetadata: sandbox.stub().returns({})
                    })
                }
            };

            AppRuntime.considerChangingTheDefaultFullWidthVal(oResolutionResultWithComponentHandle);
            setTimeout(function () {
                const iframe = jQuery("body");
                assert.strictEqual(iframe.hasClass("sapUiSizeCompact"), oFixture.output.hasClassSapUiSizeCompact, "Class sapUiSizeCompact was not found");
                assert.strictEqual(iframe.hasClass("sapUShellApplicationContainerLimitedWidth"), oFixture.output.hasClassSapUShellApplicationContainerLimitedWidth,
                    "Class sapUShellApplicationContainerLimitedWidth was not found");
                assert.strictEqual(iframe.hasClass("sapUShellApplicationContainer"), oFixture.output.hasClassSapUShellApplicationContainer, "Class sapUShellApplicationContainer was not found");
                oUrlParams.restore();
                done();
            }, 1000);

        });


    });

    QUnit.test("redirect no overide", function (assert) {
        const done = assert.async();
        setTimeout(function () {
            sandbox.stub(Container, "getFLPUrlAsync").returns(
                new jQuery.Deferred().resolve("http://www.flp.com").promise()
            );

            resetRedirectParams();
            URLHelper.redirect("http://www.dummy1234.com");
            setTimeout(function () {
                assert.strictEqual(sParamURL, "http://www.dummy1234.com");
                assert.strictEqual(bParambNewWindow, undefined);
                done();
            }, 500);
        }, 6000);
    });

    QUnit.test("redirect no overide with params and route", function (assert) {
        const done = assert.async();
        setTimeout(function () {
            sandbox.stub(Container, "getFLPUrlAsync").returns(
                new jQuery.Deferred().resolve("http://www.flp.com#A-B?param1=1&/app/view1").promise()
            );

            resetRedirectParams();
            URLHelper.redirect("http://www.flp.com#A-B?param1=1&/app/view1");
            setTimeout(function () {
                assert.strictEqual(sParamURL, "http://www.flp.com#A-B?param1=1&/app/view1");
                assert.strictEqual(bParambNewWindow, undefined);
                done();
            }, 500);
        }, 6000);
    });

    QUnit.test("redirect overide", function (assert) {
        const done = assert.async();
        setTimeout(function () {
            sandbox.stub(Container, "getFLPUrlAsync").returns(
                new jQuery.Deferred().resolve("http://www.flp.com").promise()
            );

            resetRedirectParams();
            URLHelper.redirect(document.URL + "#ABCD-1234", true);
            setTimeout(function () {
                assert.strictEqual(sParamURL, "http://www.flp.com#ABCD-1234");
                assert.strictEqual(bParambNewWindow, true);
                done();
            }, 500);
        }, 6000);
    });

    [{
        name: "for <DIV>",
        input: { event: { target: { tagName: "DIV" } } },
        output: { nWinOpenCalls: 0 }
    }, {
        name: "for <A> no target",
        input: { event: { target: { tagName: "A" } } },
        output: { nWinOpenCalls: 0 }
    }, {
        name: "for <A> target=_blank no hash",
        input: {
            event: {
                target: {
                    tagName: "A",
                    target: "_blank",
                    href: "http://www.dummy.com?a=1&b=2"
                }
            }
        },
        output: { nWinOpenCalls: 0 }
    }, {
        name: "for <A> target=_blank with hash, not iframe URL",
        input: {
            event: {
                target: {
                    tagName: "A",
                    target: "_blank",
                    href: "http://www.dummy.com?a=1&b=2#A-B"
                }
            }
        },
        output: { nWinOpenCalls: 0 }
    }, {
        name: "for <A> target=_blank with hash, iframe URL",
        input: {
            event: {
                target: {
                    tagName: "A",
                    target: "_blank",
                    href: document.URL.split("#")[0] + "#A-B"
                }
            },
            url: "http://www.flp.com?a=1"
        },
        output: {
            nWinOpenCalls: 1,
            url: "http://www.flp.com?a=1#A-B"
        }
    }, {
        name: "for <A> S/Cube - target=_top with hash, iframe URL",
        input: {
            event: {
                target: {
                    tagName: "A",
                    target: "_top",
                    href: document.URL.split("#")[0] + "#A-B"
                }
            },
            url: "http://www.flp.com?a=1"
        },
        output: {
            nWinOpenCalls: 0,
            url: "http://www.flp.com?a=1#A-B"
        }
    }, {
        name: "for <A> S/Cube - target=_self with hash, iframe URL",
        input: {
            event: {
                target: {
                    tagName: "A",
                    target: "_self",
                    href: document.URL.split("#")[0] + "#A-B"
                }
            },
            url: "http://www.flp.com?a=1"
        },
        output: {
            nWinOpenCalls: 0,
            url: "http://www.flp.com?a=1#A-B"
        }
    }].forEach(function (oFixture) {
        QUnit.test("handleLinkElementOpen - " + oFixture.name, function (assert) {
            const done = assert.async();
            const oStubWinOpen = sandbox.stub(WindowUtils, "openURL");
            AppRuntime.handleLinkElementOpen(oFixture.input.url, oFixture.input.event);
            setTimeout(function () {
                assert.strictEqual(oStubWinOpen.callCount, oFixture.output.nWinOpenCalls);
                if (oStubWinOpen.callCount > 0) {
                    assert.strictEqual(oStubWinOpen.args[0][0], oFixture.output.url);
                }
                oStubWinOpen.restore();
                done();
            }, 1000);
        });
    });

    QUnit.test("test rebuildNewAppUrl", async function (assert) {
        const done = assert.async();

        //test 1
        let sUrl = await AppRuntime.rebuildNewAppUrl("http://www.test.com", "http://www.flp.com");
        assert.strictEqual(sUrl, "http://www.test.com");

        //test 2
        sUrl = await AppRuntime.rebuildNewAppUrl(document.URL + "#A-B", "http://www.flp.com");
        assert.strictEqual(sUrl, "http://www.flp.com#A-B");

        //test 3
        sandbox.stub(AppRuntimeContext, "getIsScube").returns(false);
        sUrl = await AppRuntime.rebuildNewAppUrl("http://www.test.com#A-B", "http://www.flp.com");
        assert.strictEqual(sUrl, "http://www.test.com#A-B");
        AppRuntimeContext.getIsScube.restore();

        //test 4
        sandbox.stub(AppRuntimeContext, "getIsScube").returns(true);
        sandbox.stub(AppRuntimeContext, "checkIntentsConversionForScube").callsFake((aAppsIntents) => {
            if (aAppsIntents[0].intent === "#A-B") {
                return Promise.resolve([{
                    intent: "#C-D"
                }]);
            }
            return Promise.resolve(aAppsIntents);
        });
        sUrl = await AppRuntime.rebuildNewAppUrl("#A-B", "http://www.flp.com");
        assert.strictEqual(sUrl, "http://www.flp.com#C-D");

        AppRuntimeContext.getIsScube.restore();
        AppRuntimeContext.checkIntentsConversionForScube.restore();

        //test 5
        sandbox.stub(AppRuntimeContext, "getIsScube").returns(true);
        sandbox.stub(AppRuntimeContext, "checkIntentsConversionForScube").callsFake((aAppsIntents) => {
            if (aAppsIntents[0].intent === "#A-B") {
                return Promise.resolve([{
                    intent: "#C-D"
                }]);
            }
            return Promise.resolve(aAppsIntents);
        });
        sUrl = await AppRuntime.rebuildNewAppUrl(document.URL + "#A-B", "http://www.flp.com");
        assert.strictEqual(sUrl, "http://www.flp.com#C-D");

        AppRuntimeContext.getIsScube.restore();
        AppRuntimeContext.checkIntentsConversionForScube.restore();

        done();
    });

    [{
        testedParameter: "sap-ushell-navmode",
        ui5ComponentName: "sap.ushell.demo.NavmodeComponent",
        urlParameters: {
            "sap-startup-params": "sap-ushell-defaultedParameterNames=[\"sap-ushell-navmode\"]"
        },
        expectedCalledWith: [
            "appId",
            "appSupportInfo"
        ]
    }, {
        testedParameter: "sap-fiori-id",
        ui5ComponentName: "sap.ushell.demo.FioriIdComponent",
        urlParameters: {
            "sap-startup-params": "sap-ushell-defaultedParameterNames=[\"sap-fiori-id\"]"
        },
        expectedCalledWith: [
            "appSupportInfo"
        ]
    }, {
        testedParameter: "sap-ach",
        ui5ComponentName: "sap.ushell.demo.SupportInfoComponent",
        urlParameters: {
            "sap-startup-params": "sap-ushell-defaultedParameterNames=[\"sap-ach\"]"
        },
        expectedCalledWith: [
            "appId"
        ]
    }].forEach(async function (oFixture) {

        QUnit.test("test AppInfo params handling for parameter: " + oFixture.testedParameter, async function (assert) {

            const done = assert.async(),
                oAppLifeCycleService = await Container.getServiceAsync("AppLifeCycle"),
                oGetInfoStub = sandbox.stub().returns(Promise.resolve({})),
                oCurrentApplicationStub = sandbox.stub(oAppLifeCycleService, "getCurrentApplication").returns({
                    getInfo: oGetInfoStub
                });

            AppRuntime.getCurrentAppInfo(oAppLifeCycleService, oFixture.urlParameters, {ui5ComponentName: oFixture.ui5ComponentName});

            setTimeout(function () {
                const oAppInfo = oGetInfoStub.getCall(0).args[0];
                assert.ok(oFixture.expectedCalledWith.every((v) => oAppInfo.includes(v)), "the " + oFixture.testedParameter + " getInfo was called with the expected arguments");
                oCurrentApplicationStub.restore();
                done();
                }, 500);
        });
    });

    QUnit.test("setHashChangedCallback with different hashes", async function (assert) {
        // Arrange
        const sHash1 = "#SO1-action1?ABC=DEF&HIJ=KLM&/sometest#more";
        const sHash2 = "#SO2-action2?ABC=DEF&HIJ=XYZ&/sometest#more";

        const oPostMessageStub = sandbox.stub(AppRuntimeService, "postMessageToFLP");
        const oNavigationMock = { navigate: sandbox.stub().resolves() };
        sandbox.stub(Container, "getServiceAsync").withArgs("Navigation").resolves(oNavigationMock);

        // Act
        await AppRuntime._treatHashChanged(sHash1, sHash2);

        // Assert
        assert.strictEqual(oPostMessageStub.callCount, 0, "postMessageToFLP was not called");
        assert.strictEqual(oNavigationMock.navigate.callCount, 1, "navigate was called");
    });

    QUnit.test("setHashChangedCallback with the same hashes", async function (assert) {
        // Arrange
        const sHash1 = "#SO-action?ABC=DEF&HIJ=KLM&/sometest#more";
        const sHash2 = "#SO-action?ABC=DEF&HIJ=KLM&/sometest#more";

        const oPostMessageStub = sandbox.stub(AppRuntimeService, "postMessageToFLP");
        const oNavigationMock = { navigate: sandbox.stub().resolves() };
        sandbox.stub(Container, "getServiceAsync").withArgs("Navigation").resolves(oNavigationMock);

        // Act
        await AppRuntime._treatHashChanged(sHash1, sHash2);

        // Assert
        assert.strictEqual(oPostMessageStub.callCount, 1, "postMessageToFLP was called");
        assert.strictEqual(oNavigationMock.navigate.callCount, 0, "navigate was not called");
    });

    QUnit.test("setHashChangedCallback with the same hashes but different parameter order", async function (assert) {
        // Arrange
        const sHash1 = "#SO-action?ABC=DEF&HIJ=KLM&/sometest#more";
        const sHash2 = "#SO-action?HIJ=KLM&ABC=DEF&/sometest#more";

        const oPostMessageStub = sandbox.stub(AppRuntimeService, "postMessageToFLP");
        const oNavigationMock = { navigate: sandbox.stub().resolves() };
        sandbox.stub(Container, "getServiceAsync").withArgs("Navigation").resolves(oNavigationMock);

        // Act
        await AppRuntime._treatHashChanged(sHash1, sHash2);

        // Assert
        assert.strictEqual(oPostMessageStub.callCount, 1, "postMessageToFLP was called");
        assert.strictEqual(oNavigationMock.navigate.callCount, 0, "navigate was not called");
    });

    QUnit.module("The function _prepareUshellConfig", {
        before: function () {
            this.oOriginalConfig = window["sap-ushell-config"];
        },
        beforeEach: function () {

        },
        afterEach: function () {
            sandbox.restore();
            delete window["sap-ushell-config"];
        },
        after: function () {
            window["sap-ushell-config"] = this.oOriginalConfig;
        }
    });

    QUnit.test("Gets the config from the meta tag", function (assert) {
        //Arrange
        const oConfig = {
            services: {
                foo: "bar"
            }
        };
        const oMetaData = {content: JSON.stringify(oConfig)};
        sandbox.stub(document, "querySelector").withArgs("meta[name='sap.ushellConfig.ui5appruntime']").returns(oMetaData);

        //Act
        AppRuntime._prepareUshellConfig();

        //Assert
        assert.deepEqual(window["sap-ushell-config"], oConfig, "The config was set correctly");
    });

    QUnit.test("Sets the spaces.enabled config if the sap-spaces URL parameter is true", (assert) => {
        //Arrange
        sandbox.stub(URLSearchParams.prototype, "has").withArgs("sap-spaces").returns(true);
        sandbox.stub(URLSearchParams.prototype, "get").withArgs("sap-spaces").returns("true");

        //Act
        AppRuntime._prepareUshellConfig();

        //Assert
        assert.strictEqual(window["sap-ushell-config"].ushell.spaces.enabled, true, "The spaces.enabled config was set correctly");
    });

    QUnit.test("Does not set the spaces.enabled config if the sap-spaces URL parameter is false", (assert) => {
        //Arrange
        sandbox.stub(URLSearchParams.prototype, "has").withArgs("sap-spaces").returns(true);
        sandbox.stub(URLSearchParams.prototype, "get").withArgs("sap-spaces").returns("false");

        //Act
        AppRuntime._prepareUshellConfig();

        //Assert
        assert.strictEqual(window["sap-ushell-config"]?.ushell?.spaces?.enabled, undefined, "The spaces.enabled config was not set");
    });

    QUnit.test("Does not set the spaces.enabled config if the sap-spaces URL parameter is not available", (assert) => {
        //Arrange
        sandbox.stub(URLSearchParams.prototype, "has").withArgs("sap-spaces").returns(false);

        //Act
        AppRuntime._prepareUshellConfig();

        //Assert
        assert.strictEqual(window["sap-ushell-config"]?.ushell?.spaces?.enabled, undefined, "The spaces.enabled config was not set");
    });

    QUnit.test("Sets the enablePersonalization config if the sap-personalization URL parameter is false", (assert) => {
        //Arrange
        sandbox.stub(URLSearchParams.prototype, "has").withArgs("sap-personalization").returns(true);
        sandbox.stub(URLSearchParams.prototype, "get").withArgs("sap-personalization").returns("false");

        //Act
        AppRuntime._prepareUshellConfig();

        //Assert
        assert.strictEqual(window["sap-ushell-config"].renderers.fiori2.componentData.config.enablePersonalization, false, "The enablePersonalization config was set correctly");
    });

    QUnit.test("Does not set the enablePersonalization config if the sap-personalization URL parameter is true", (assert) => {
        //Arrange
        sandbox.stub(URLSearchParams.prototype, "has").withArgs("sap-personalization").returns(true);
        sandbox.stub(URLSearchParams.prototype, "get").withArgs("sap-personalization").returns("true");

        //Act
        AppRuntime._prepareUshellConfig();

        //Assert
        assert.strictEqual(window["sap-ushell-config"]?.renderers?.fiori2?.componentData?.config?.enablePersonalization, undefined, "The enablePersonalization config was not set");
    });

    QUnit.test("Does not set the enablePersonalization config if the sap-personalization URL parameter is not available", (assert) => {
        //Arrange
        sandbox.stub(URLSearchParams.prototype, "has").withArgs("sap-personalization").returns(false);

        //Act
        AppRuntime._prepareUshellConfig();

        //Assert
        assert.strictEqual(window["sap-ushell-config"]?.renderers?.fiori2?.componentData?.config?.enablePersonalization, undefined, "The enablePersonalization config was not set");
    });

    QUnit.test("Process correctly sap.ushell.appRuntime.innerAppRouteChange message", (assert) => {
        //Arrange
        const oMessage = {};
        const oMessageData = {
            type: "request",
            request_id: "1728473214190",
            service: "sap.ushell.appRuntime.innerAppRouteChange",
            body: {
                oHash: {
                    newHash: "REQUESTFORM_TYPE=ABCD/LANGUAGE=E",
                    oldHash: "REQUESTFORM_TYPE=NDAG/LANGUAGE=E",
                    fullHash: "mdsdlccrf1-Display?sap-ui-app-id-hint=87064e29-3592-4c3b-ba49-21086265e2ba&/REQUESTFORM_TYPE=ABCD/LANGUAGE=E"
                }
            }
        };
        sandbox.stub(AppCommunicationMgr, "_isTrustedPostMessageSource").withArgs(AppCommunicationMgr, oMessage).returns(true);
        sandbox.stub(AppCommunicationMgr, "sendResponseMessage");
        sandbox.stub(hasher, "setHash");
        sandbox.stub(hasher, "replaceHash");

        //Act
        AppCommunicationMgr._handleMessageRequest(AppCommunicationMgr, oMessage, oMessageData);

        //Assert
        assert.ok(hasher.setHash.notCalled, "hasher.setHash was not called");
        assert.ok(hasher.replaceHash.calledOnce, "hasher.replaceHash was called");
        assert.ok(hasher.replaceHash.calledWith(oMessageData.body.oHash.fullHash), "hasher.replaceHash was called with right value");
    });
});
