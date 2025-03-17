// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.renderer.Renderer
 * Tests specific shell (app)state scenarios
 */
sap.ui.define([
    "sap/base/util/ObjectPath",
    "sap/ui/core/Element",
    "sap/ui/core/EventBus",
    "sap/ui/thirdparty/sinon-4",
    "sap/ushell/components/appfinder/AppFinder.controller",
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/components/homepage/ActionMode",
    "sap/ushell/Config",
    "sap/ushell/Container",
    "sap/ushell/EventHub",
    "sap/ushell/renderer/Renderer",
    "sap/ushell/resources",
    "sap/ushell/shells/demo/fioriDemoConfig",
    "sap/ushell/test/utils",
    "sap/ushell/renderer/Shell.controller",
    "sap/ushell/renderer/Shell.view",
    "sap/ushell/state/StateManager",
    "sap/ushell/state/ShellModel"
], function (
    ObjectPath,
    Element,
    EventBus,
    sinon,
    AppFinderController,
    AppLifeCycle,
    ActionMode,
    Config,
    Container,
    EventHub,
    Renderer,
    ushellResources,
    fioriDemoConfig, // required for globals used in this test
    testUtils,
    ShellController,
    ShellView,
    StateManager,
    ShellModel
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

    QUnit.test("Headerless application state & personalization enablement 1", function (assert) {
        ObjectPath.set("renderers.fiori2.componentData.config.appState", "headerless", window["sap-ushell-config"]);
        resetConfig();

        // first test is to see that personalization is off due to the headerless mode
        return Container.init("local")
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
                assert.strictEqual(Config.last("/core/shell/model/personalization"), false, "verify personalization is off due to appstate headerless mode");
            });
    });

    QUnit.test("Merged application state & personalization enablement 1", function (assert) {
        // first test is to see that personalization is off due to the merged mode
        ObjectPath.set("renderers.fiori2.componentData.config.appState", "merged", window["sap-ushell-config"]);
        resetConfig();

        return Container.init("local")
            .then(_createAndPlaceRenderer)
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(function () {
                var bEnablePers = Config.last("/core/shell/model/personalization");

                assert.strictEqual(bEnablePers, false, "verify personalization is off due to appstate merged mode");
            });
    });

    QUnit.test("Headerless application state & personalization enablement 2", function (assert) {
        // second test is to see that personalization is off due to headerless mode (even though configuration indicates that personalization if enabled)
        ObjectPath.set("renderers.fiori2.componentData.config.appState", "headerless", window["sap-ushell-config"]);
        ObjectPath.set("renderers.fiori2.componentData.config.enablePersonalization", true, window["sap-ushell-config"]);
        resetConfig();

        return Container.init("local")
            .then(_createAndPlaceRenderer)
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(function () {
                var bEnablePers = Config.last("/core/shell/model/personalization");

                assert.strictEqual(bEnablePers, false, "verify personalization is off due to appstate headerless mode even when configuration allows personalization");
                const bHeaderVisible = ShellModel.getModel().getProperty("/header/visible");
                assert.strictEqual(bHeaderVisible, false, "verify header visibility is false");
            });
    });

    QUnit.test("Merged application state & personalization enablement 2", function (assert) {
        // second test is to see that personalization is off due to merged mode (even though configuration indicates that personalization if enabled)
        ObjectPath.set("renderers.fiori2.componentData.config.appState", "merged", window["sap-ushell-config"]);
        ObjectPath.set("renderers.fiori2.componentData.config.enablePersonalization", true, window["sap-ushell-config"]);
        resetConfig();

        return Container.init("local")
            .then(_createAndPlaceRenderer)
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(function () {
                var bEnablePers = Config.last("/core/shell/model/personalization");

                assert.strictEqual(bEnablePers, false, "verify personalization is off due to appstate merged mode even when configuration allows personalization");
                const bHeaderVisible = ShellModel.getModel().getProperty("/header/visible");
                assert.strictEqual(bHeaderVisible, true, "verify header visibility is true");
            });
    });

    QUnit.test("Headerless application state & personalization enablement 3", function (assert) {
        // third test is to see that personalization is off due to non-headerless mode BUT configuration set personalization off
        ObjectPath.set("renderers.fiori2.componentData.config.appState", "standalone", window["sap-ushell-config"]);
        ObjectPath.set("renderers.fiori2.componentData.config.enablePersonalization", false, window["sap-ushell-config"]);
        resetConfig();

        return Container.init("local")
            .then(_createAndPlaceRenderer)
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(function () {
                var bEnablePers = Config.last("/core/shell/model/personalization");

                assert.strictEqual(bEnablePers, false, "verify personalization is off due to non-headerless mode BUT configuration set personalization off");
            });
    });

    QUnit.test("Merged application state & personalization enablement 4", function (assert) {
        // fourth test is to see that personalization is off due to non-merged mode BUT configuration set personalization off
        ObjectPath.set("renderers.fiori2.componentData.config.appState", "merged", window["sap-ushell-config"]);
        ObjectPath.set("renderers.fiori2.componentData.config.enablePersonalization", false, window["sap-ushell-config"]);
        resetConfig();

        return Container.init("local")
            .then(_createAndPlaceRenderer)
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(function () {
                var bEnablePers = Config.last("/core/shell/model/personalization");

                assert.strictEqual(bEnablePers, false, "verify personalization is off due to non-merged mode BUT configuration set personalization off");
            });
    });

    QUnit.test("Headerless application state & personalization enablement 5", function (assert) {
        // fifth test is to see that personalization is on due to non-headerless mode and configuration enables personalization
        ObjectPath.set("renderers.fiori2.componentData.config.appState", "standalone", window["sap-ushell-config"]);
        ObjectPath.set("renderers.fiori2.componentData.config.enablePersonalization", true, window["sap-ushell-config"]);
        resetConfig();

        return Container.init("local")
            .then(_createAndPlaceRenderer)
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(function () {
                var bEnablePers = Config.last("/core/shell/model/personalization");

                assert.strictEqual(bEnablePers, true, "verify personalization is on due to non-headerless mode and configuration enables personalization");
            });
    });
});
