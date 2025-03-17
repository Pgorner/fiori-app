// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.renderer.Renderer
 * Tests specific navigation scenarios
 */
sap.ui.define([
    "sap/base/util/ObjectPath",
    "sap/ui/thirdparty/sinon-4",
    "sap/ushell/components/appfinder/AppFinder.controller",
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/Config",
    "sap/ushell/Container",
    "sap/ushell/EventHub",
    "sap/ushell/renderer/Renderer",
    "sap/ushell/services/AppConfiguration",
    "sap/ushell/shells/demo/fioriDemoConfig",
    "sap/ushell/test/utils",
    "sap/ushell/renderer/Shell.controller",
    "sap/ushell/renderer/Shell.view",
    "sap/ushell/state/StateManager"
], function (
    ObjectPath,
    sinon,
    AppFinderController,
    AppLifeCycle,
    Config,
    Container,
    EventHub,
    Renderer,
    AppConfiguration,
    fioriDemoConfig, // required for globals used in this test
    testUtils,
    ShellController,
    ShellView,
    StateManager
) {
    "use strict";

    /* global QUnit */

    var sandbox = sinon.createSandbox({});

    function resetConfig () {
        Config._resetContract();
        StateManager.resetAll();
    }

    QUnit.module("sap.ushell.renderer.Renderer", {
        beforeEach: function () {
            // Disable the _handleAppFinderNavigation function which might cause errors due to race conditions after
            // the test is already done and cleaned up.
            // This is the easiest way of achieving isolation without a huge refactoring of the App Finder Controller.
            sandbox.stub(AppFinderController.prototype, "_handleAppFinderNavigation");
            this.oHashChangeFailureStub = sandbox.stub(ShellController.prototype, "hashChangeFailure");

            // Stub createPostCoreExtControls and call it manually to avoid cleanup issues
            sandbox.stub(ShellView.prototype, "createPostCoreExtControls");

            QUnit.sap.ushell.createTestDomRef(); // used to place the Renderer

            this.sCachedConfig = JSON.stringify(window["sap-ushell-config"]);
            // Disable search (not necessary but creating requests for Enterprise Search)
            ObjectPath.create("sap-ushell-config.renderers.fiori2.componentData.config").enableSearch = false;
            // Disable Recent Activity as the User Recent service is not available and this test is very integrated
            ObjectPath.set("renderers.fiori2.componentData.config.enableRecentActivity", false, window["sap-ushell-config"]);
            // Base Config
            ObjectPath.set("renderers.fiori2.componentData.config.changeOpacity", "off", window["sap-ushell-config"]);
            ObjectPath.set("renderers.fiori2.componentData.config.rootIntent", "Shell-home", window["sap-ushell-config"]);
            ObjectPath.set("renderers.fiori2.componentData.config.applications", { "Shell-home": {} }, window["sap-ushell-config"]);
            ObjectPath.set("services.NavTargetResolutionInternal.config.resolveLocal", [{
                linkId: "Shell-home",
                resolveTo: {
                    additionalInformation: "SAPUI5.Component=sap.ushell.components.flp",
                    applicationType: "URL",
                    url: sap.ui.require.toUrl("sap/ushell/components/flp"),
                    loadCoreExt: false, // avoid loading of core-ext-light and default dependencies
                    loadDefaultDependencies: false
                }
            }], window["sap-ushell-config"]);
            resetConfig();

            // Do not bootstrap here; config must be set before

            window.location.hash = "";
            if (window.hasher && window.hasher.getHash()) {
                window.hasher.setHash("");
            }

            this.oHistoryBackStub = sandbox.stub(window.history, "back");

            // reset the cache of built-in routes
            delete Renderer._aBuiltInRoutes;
        },
        afterEach: async function () {
            if (!EventHub.last("CoreResourcesComplementLoaded")) {
                await testUtils.waitForEventHubEvent("CoreResourcesComplementLoaded");
            }
            await this.oRendererControl.destroy();

            sandbox.restore();
            Container.reset();
            EventHub._reset();

            window["sap-ushell-config"] = JSON.parse(this.sCachedConfig);
            resetConfig();
        }
    });

    /**
     * Creates the Renderer and places it in the qunit-fixture DOM element.
     * By placing the Renderer the ShellLayout gets created.
     * @returns {Promise<sap.ui.core.Control>} The control root of the renderer
     */
    function _createAndPlaceRenderer () {
        var oQunitThis = QUnit.config.current.testEnvironment;
        return Container.createRendererInternal("fiori2").then(function (oRendererControl) {
            oQunitThis.oRendererControl = oRendererControl;
            oRendererControl.placeAt("qunit-canvas");
            return oRendererControl;
        });
    }

    /**
     * Awaits navigation in the Renderer.
     * First the CurrentCoreView is checked and resolves
     * the promise instantly if it matches the expectation.
     * Second attaches to the specified routes and resolves once the matched event is published.
     * @param {string[]} aRoutes A list of routes.
     * @param {string} [sTargetCoreView] The CurrentCoreView to match.
     * @returns {Promise} Resolves once either the CurrentCoreView or the route matched.
     */
    function _attachRendererRouteMatched (aRoutes, sTargetCoreView) {
        var oRenderer = Container.getRendererInternal();
        if (!!sTargetCoreView && oRenderer.getCurrentCoreView() === sTargetCoreView) {
            return Promise.resolve();
        }

        var oRouter = oRenderer.getRouter();
        return new Promise(function (resolve) {
            var fnAttachRouteMatched = function (sRoute) {
                var oRoute = oRouter.getRoute(sRoute);
                oRoute.attachEventOnce("matched", resolve);
            };

            aRoutes.forEach(fnAttachRouteMatched);
        });
    }

    [
        { hash: "#Shell-home", targetCoreView: "home" },
        { hash: "#Shell-appfinder", targetCoreView: "appFinder" },
        { hash: "#Shell-home?sap-system=XYZ", targetCoreView: "home" },
        { hash: "#Shell-appfinder?sap-system=XYZ", targetCoreView: "appFinder" }
    ].forEach(function (oFixture) {
        var sHash = oFixture.hash;
        var sTargetCoreView = oFixture.targetCoreView;

        QUnit.test("Check correct current application is set after " + sHash + " is navigated", function (assert) {
            var done = assert.async();
            Container.init("local")
                .then(function () {
                    var oNavigationPromise = testUtils.waitForEventHubEvent("ShellNavigationInitialized").then(function () { // hasher was replaced
                        window.hasher.setHash(sHash);
                    });
                    var oRendererPromise = _createAndPlaceRenderer().then(function () {
                        AppConfiguration.setCurrentApplication({
                            somePreviousApplication: true
                        });
                    });
                    return Promise.all([
                        oNavigationPromise,
                        oRendererPromise
                    ]);
                })
                .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
                .then(function () {
                    var oRenderer = Container.getRendererInternal("fiori2");

                    assert.ok(oRenderer, "renderer instance is there");
                    if (!oRenderer) {
                        return;
                    }

                    return _attachRendererRouteMatched(["home", "appfinder"], sTargetCoreView);
                })
                .then(function () {
                    var oCurrentApplication = AppConfiguration.getCurrentApplication();

                    assert.strictEqual(this.oHashChangeFailureStub.callCount, 0, "0 error messages have been displayed");
                    assert.strictEqual(oCurrentApplication, null, "the current application was set to null (i.e., core component was routed)");

                    // Cleanup: Navigate to home and wait for asnyc processes...
                    window.hasher.setHash("#Shell-home");
                    setTimeout(done, 900);
                }.bind(this));
        });
    });

    QUnit.test("Check that appFinder redirect to home when appfinder is disabled", function (assert) {
        var fnNavToSpy;

        ObjectPath.set("renderers.fiori2.componentData.config.enableAppFinder", false, window["sap-ushell-config"]);
        ObjectPath.set("renderers.fiori2.componentData.config.enablePersonalization", false, window["sap-ushell-config"]);
        resetConfig();

        return Container.init("local")
            .then(_createAndPlaceRenderer)
            .then(testUtils.waitForEventHubEvent.bind(null, "ShellNavigationInitialized")) // hasher was replaced
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(function () {
                var oRenderer = Container.getRendererInternal("fiori2");

                assert.ok(oRenderer, "can get the renderer");
                if (!oRenderer) {
                    return;
                }

                var oRouter = oRenderer.getRouter();
                fnNavToSpy = sandbox.spy(oRouter, "navTo");

                return _attachRendererRouteMatched(["home"], "home");
            })
            .then(function () {
                var oAppFinderPromise = _attachRendererRouteMatched(["appfinder"], "appfinder");
                var oHomePromise = _attachRendererRouteMatched(["home"], "home");
                window.hasher.setHash("Shell-appfinder");
                return Promise.all([
                    oAppFinderPromise,
                    oHomePromise
                ]);
            })
            .then(function () {
                if (fnNavToSpy.callCount) {
                    assert.deepEqual(fnNavToSpy.getCall(0).args, ["home", null, true], "appFinder should be navigate to home");
                } else {
                    assert.ok(false, "navTo should be called");
                }
            });
    });

    QUnit.test("Check that hash is changed to Shell-home when pages is disabled and user navigates to Launchpad-openFLPPage", function (assert) {
        var oReplaceHashWithoutNavigationSpy;

        ObjectPath.set("ushell.spaces.enabled", false, window["sap-ushell-config"]);
        resetConfig();

        return Container.init("local")
            .then(function () {
                var oNavigationPromise = testUtils.waitForEventHubEvent("ShellNavigationInitialized").then(function () { // hasher was replaced
                    return Container.getServiceAsync("ShellNavigationInternal").then(function (ShellNavigationInternal) {
                        oReplaceHashWithoutNavigationSpy = sandbox.spy(ShellNavigationInternal, "replaceHashWithoutNavigation");
                        window.hasher.setHash("#Launchpad-openFLPPage");
                    });
                });
                var oRendererPromise = _createAndPlaceRenderer();
                return Promise.all([
                    oNavigationPromise,
                    oRendererPromise
                ]);
            })
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(function () {
                var oRenderer = Container.getRendererInternal("fiori2");

                assert.ok(oRenderer, "can get the renderer");
                if (!oRenderer) {
                    return;
                }
                return _attachRendererRouteMatched(["home", "openFLPPage"], "home");
            })
            .then(function () {
                assert.strictEqual(location.hash, "#Shell-home");
                assert.deepEqual(oReplaceHashWithoutNavigationSpy.getCall(0).args, ["Shell-home"], "replaceHashWithoutNavigation called with correct arguments");
            });
    });

    QUnit.test("Check ShellNavigationInternal.setIsInitialNavigation is called with parameter false when navigate to shell home and current application is not null", function (assert) {
        var oSetIsInitialNavigationStub,
            oGetCurrentApplicationSpy;

        return Container.init("local")
            .then(function () {
                return Container.getServiceAsync("ShellNavigationInternal").then(function (ShellNavigationInternal) {
                    window.hasher.setHash("shell-home");

                    oGetCurrentApplicationSpy = sandbox.spy(AppConfiguration, "getCurrentApplication");
                    oSetIsInitialNavigationStub = sandbox.stub(ShellNavigationInternal, "setIsInitialNavigation");
                    AppConfiguration.setCurrentApplication({
                        somePreviousApplication: true
                    });
                });
            })
            .then(_createAndPlaceRenderer)
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(function () {
                var oRenderer = Container.getRendererInternal("fiori2");

                assert.ok(oRenderer, "can get the renderer");
                if (!oRenderer) {
                    return;
                }
                return _attachRendererRouteMatched(["home"], "home");
            })
            .then(function () {
                assert.equal(oGetCurrentApplicationSpy.callCount, 1, "getCurrentApplication is called once");
                assert.equal(oSetIsInitialNavigationStub.callCount, 1, "setIsInitialNavigation is called");
                assert.equal(oSetIsInitialNavigationStub.firstCall.args[0], false, "setIsInitialNavigation is called with parameter false");
            });
    });

    QUnit.test("Check that state is set as \"app\", when root intent is not flp home", function (assert) {
        var oSwitchViewStateSpy;

        ObjectPath.set("renderers.fiori2.componentData.config.rootIntent", "Some-intent", window["sap-ushell-config"]);
        resetConfig();

        return Container.init("local")
            .then(function () {
                oSwitchViewStateSpy = sandbox.spy(AppLifeCycle, "switchViewState");
                var oNavigationPromise = testUtils.waitForEventHubEvent("ShellNavigationInitialized").then(function () { // hasher was replaced
                    window.hasher.setHash("Shell-home");
                });
                var oRendererPromise = _createAndPlaceRenderer();
                return Promise.all([
                    oNavigationPromise,
                    oRendererPromise
                ]);
            })
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(function () {
                var oRenderer = Container.getRendererInternal("fiori2");

                assert.ok(oRenderer, "can get the renderer");
                if (!oRenderer) {
                    return;
                }
                return _attachRendererRouteMatched(["home"], "home");
            })
            .then(function () {
                assert.equal(oSwitchViewStateSpy.callCount, 1, "getCurrentApplication is called once");
                assert.deepEqual(oSwitchViewStateSpy.getCall(0).args, ["app", false, "Shell-home"], "switchState is called with correct arguments");
            });
    });
});
