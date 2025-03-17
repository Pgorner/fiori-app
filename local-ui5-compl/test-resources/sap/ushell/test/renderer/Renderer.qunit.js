// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.renderer.Shell
 */
sap.ui.define([
    "sap/base/util/deepClone",
    "sap/base/util/ObjectPath",
    "sap/m/Bar",
    "sap/m/Button",
    "sap/ui/core/Component",
    "sap/ui/core/Element",
    "sap/ui/core/UIComponent",
    "sap/ui/qunit/utils/nextUIUpdate",
    "sap/ui/thirdparty/sinon-4",
    "sap/ushell/components/appfinder/AppFinder.controller",
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/Config",
    "sap/ushell/Container",
    "sap/ushell/EventHub",
    "sap/ushell/library",
    "sap/ushell/renderer/Renderer",
    "sap/ushell/resources",
    "sap/ushell/shells/demo/fioriDemoConfig",
    "sap/ushell/test/utils",
    "sap/ushell/ui/launchpad/ActionItem",
    "sap/ushell/renderer/Shell.controller",
    "sap/ushell/renderer/Shell.view",
    "sap/ushell/renderer/ShellLayout",
    "sap/ushell/state/StateManager",
    "sap/ushell/state/ShellModel"
], function (
    deepClone,
    ObjectPath,
    Bar,
    Button,
    Component,
    Element,
    UIComponent,
    nextUIUpdate,
    sinon,
    AppFinderController,
    AppLifeCycleAI,
    Config,
    Container,
    EventHub,
    ushellLibrary,
    Renderer,
    ushellResources,
    fioriDemoConfig, // required for globals used in this test
    testUtils,
    ActionItem,
    ShellController,
    ShellView,
    ShellLayout,
    StateManager,
    ShellModel
) {
    "use strict";

    /* global QUnit */

    // shortcut for sap.ushell.state.StateManager.ShellMode
    const ShellMode = StateManager.ShellMode;

    // shortcut for sap.ushell.AppType
    const AppType = ushellLibrary.AppType;

    // shortcut for sap.ushell.renderer.ShellLayout.ShellArea
    const ShellArea = ShellLayout.ShellArea;

    const sandbox = sinon.createSandbox({});

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
     * Creates the Renderer and places it in the qunit-fixture DOM element.
     * By placing the Renderer the ShellLayout gets created.
     * @returns {sap.ui.core.Control} The control root of the renderer
     * @deprecated since 1.120.0
     */
    function _createAndPlaceRendererSync () {
        var oQunitThis = QUnit.config.current.testEnvironment;
        var oSyncRendererControl = Container.createRenderer("fiori2", false);
        oQunitThis.oRendererControl = oSyncRendererControl;
        oSyncRendererControl.placeAt("qunit-canvas");
        return oSyncRendererControl;
    }

    QUnit.test("default Home title", async function (assert) {
        await Container.init("local");
        await _createAndPlaceRenderer();
        await testUtils.waitForEventHubEvent("TitleChanged");

        const sHomeTitle = Element.getElementById("shellAppTitle").getTitle();
        assert.strictEqual(sHomeTitle, ushellResources.i18n.getText("homeBtn_tooltip"), "Default home title is correctly set");
    });

    QUnit.test("custom Home title as plain text", async function (assert) {
        // Set custom home title "ABC"
        ObjectPath.set("ushell.header.title.home", "ABC", window["sap-ushell-config"]);
        resetConfig();

        await Container.init("local");
        await _createAndPlaceRenderer();
        await testUtils.waitForEventHubEvent("TitleChanged");

        const sHomeTitle = Element.getElementById("shellAppTitle").getTitle();
        assert.strictEqual(sHomeTitle, "ABC", "Custom home title is correctly set");
    });

    QUnit.test("custom Home title as JSON", async function (assert) {
        // Set custom home title as JSON with default value "DEF" (runs for all languages)
        ObjectPath.set("ushell.header.title.home", "{\"zz-ZZ\":\"ZZZ\", \"default\":\"DEF\"}", window["sap-ushell-config"]);
        resetConfig();

        await Container.init("local");
        await _createAndPlaceRenderer();
        await testUtils.waitForEventHubEvent("TitleChanged");

        const sHomeTitle = Element.getElementById("shellAppTitle").getTitle();
        assert.strictEqual(sHomeTitle, "DEF", "Custom home title is correctly set");
    });

    QUnit.test("disable search", function (assert) {
        ObjectPath.set("renderers.fiori2.componentData.config.enableSearch", false, window["sap-ushell-config"]);
        ObjectPath.set("renderers.fiori2.componentData.config.openSearchAsDefault", false, window["sap-ushell-config"]);
        resetConfig();

        return Container.init("local")
            .then(_createAndPlaceRenderer)
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(function () {
                return Component.create({
                    id: "applicationsap-ushell-components-search-component",
                    name: "sap.ushell.components.shell.Search",
                    componentData: {}
                });
            })
            .then(function (oComponent) {
                var search = Element.getElementById("sf");
                assert.notOk(search, "verify search field is hidden");

                return oComponent.destroy();
            });
    });

    QUnit.test("enable search", function (assert) {
        ObjectPath.set("renderers.fiori2.componentData.config.appState", "merged", window["sap-ushell-config"]);
        ObjectPath.set("renderers.fiori2.componentData.config.esearch", { sinaConfiguration: "sample" }, window["sap-ushell-config"]);
        ObjectPath.set("renderers.fiori2.componentData.config.enableSearch", true, window["sap-ushell-config"]);
        ObjectPath.set("renderers.fiori2.componentData.config.openSearchAsDefault", true, window["sap-ushell-config"]);
        resetConfig();

        return Container.init("local")
            .then(_createAndPlaceRenderer)
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(function () {
                return Component.create({
                    id: "applicationsap-ushell-components-search-component",
                    name: "sap.ushell.components.shell.Search",
                    componentData: {}
                });
            })
            .then(function (oComponent) {
                return oComponent._searchShellHelperPromise.then(function () {
                    var oSearchField = Element.getElementById("sf");
                    assert.ok(oSearchField, "verify search field is visible");

                    return oComponent.destroy();
                });
            });
    });

    QUnit.test("test Button-ActionItem conversion", function (assert) {
        return Container.init("local")
            .then(_createAndPlaceRenderer)
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(function () {
                var oRenderer = Container.getRenderer("fiori2");
                var oButton = new Button({
                    id: "test_test",
                    text: "testAction",
                    icon: "iconName",
                    press: function () {
                        return true;
                    }
                });
                var oAction;

                oRenderer.convertButtonsToActions([oButton.getId()]);
                oAction = Element.getElementById("test_test");
                assert.ok(oAction instanceof ActionItem === true, "sap.m.Button should be converted to Action Item");
                oRenderer.hideActionButton(oAction.getId());


                oAction.destroy();
            });
    });

    QUnit.test("test hideActionButton API", function (assert) {
        return Container.init("local")
            .then(_createAndPlaceRenderer)
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(function () {
                var oRenderer = Container.getRenderer("fiori2");
                var oButton = new Button({
                    id: "testActionId",
                    text: "testAction",
                    icon: "iconName",
                    press: function () {
                        return true;
                    }
                });
                var aActions;

                oRenderer.showActionButton([oButton.getId()], true, undefined, false);
                aActions = ShellModel.getModel().getProperty("/userActions/items");
                assert.ok(aActions.indexOf("testActionId") > -1);

                oRenderer.hideActionButton(["testActionId"], true, undefined);
                aActions = ShellModel.getModel().getProperty("/userActions/items");
                assert.strictEqual(aActions.indexOf("testActionId"), -1);
            });
    });

    QUnit.test("test addDisabledActionButton", function (assert) {
        //check that when a sap.m.button is added to user action as disabled, is added correctly and converted to sap.ushell.ui.launchpad.ActionItem
        return Container.init("local")
            .then(_createAndPlaceRenderer)
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(function () {
                var oRenderer = Container.getRenderer("fiori2");
                var oButton = new Button({
                    id: "disabledBtn",
                    text: "testAction",
                    icon: "iconName",
                    press: function () {
                        return true;
                    }
                });
                var aActions;

                oButton.setEnabled(false);
                oRenderer.showActionButton([oButton.getId()], true, undefined, false);
                aActions = ShellModel.getModel().getProperty("/userActions/items");
                assert.ok(aActions.indexOf("disabledBtn") > -1);

                var oConvertedButton = Element.getElementById("disabledBtn");
                assert.strictEqual(oConvertedButton.getEnabled(), false);

                var oMetadata = oConvertedButton.getMetadata();
                assert.strictEqual(oMetadata.getName(), "sap.ushell.ui.launchpad.ActionItem");
            });
    });

    QUnit.test("addUserAction: given existing control", function (assert) {
        var oAddActionButtonParameters = {
            oControlProperties: {
                id: "SomeExistingButton"
            },
            bIsVisible: true,
            bCurrentState: {}
        };
        var oButton = new ActionItem({
            id: "SomeExistingButton"
        });
        var oExpectedParameters = deepClone(oAddActionButtonParameters);

        return Container.init("local")
            .then(_createAndPlaceRenderer)
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(function () {
                var oRenderer = Container.getRenderer("fiori2");

                return testUtils.promisify(oRenderer.addUserAction(oAddActionButtonParameters));
            })
            .then(function (oControl) {
                assert.strictEqual(oControl, oButton, "oRenderer.addUserAction returned the correct control");
                assert.deepEqual(oAddActionButtonParameters, oExpectedParameters, "parameters were not modified");
                oButton.destroy();
            });
    });

    QUnit.test("addUserAction: given control type", function (assert) {
        var oAddActionButtonParameters = {
            oControlProperties: {},
            controlType: "sap.m.Button",
            bIsVisible: true,
            bCurrentState: {}
        };

        return Container.init("local")
            .then(_createAndPlaceRenderer)
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(function () {
                var oRenderer = Container.getRenderer("fiori2");

                return testUtils.promisify(oRenderer.addUserAction(oAddActionButtonParameters));
            })
            .then(function (oControl) {
                assert.strictEqual(oControl.getActionType(), "standard", "oRenderer.addUserAction returned sap.ushell.ui.launchpad.ActionItem with standard actionType");
                oControl.destroy();
            });
    });

    QUnit.test("addUserAction: multiple subsequent calls with same id", function (assert) {
        var oAddActionButtonParameters = {
            oControlProperties: {
                id: "SomeButton"
            },
            controlType: "sap.m.Button",
            bIsVisible: true,
            bCurrentState: {}
        };

        return Container.init("local")
            .then(_createAndPlaceRenderer)
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(function () {
                var oRenderer = Container.getRenderer("fiori2");

                return Promise.all([
                    testUtils.promisify(oRenderer.addUserAction(oAddActionButtonParameters)),
                    testUtils.promisify(oRenderer.addUserAction(oAddActionButtonParameters))
                ]);
            })
            .then(function ([oControl1, oControl2]) {
                assert.strictEqual(oControl1.getActionType(), "standard", "oRenderer.addUserAction returned sap.ushell.ui.launchpad.ActionItem with standard actionType");
                assert.strictEqual(oControl1, oControl2, "oRenderer.addUserAction returned the same instance");
                oControl1.destroy();
            });
    });

    QUnit.test("addUserAction: No control or control type given", function (assert) {
        var oAddActionButtonParameters = {};

        return Container.init("local")
            .then(_createAndPlaceRenderer)
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(function () {
                var oRenderer = Container.getRenderer("fiori2");

                return testUtils.promisify(oRenderer.addUserAction(oAddActionButtonParameters));
            })
            .catch(function (sError) {
                assert.strictEqual(sError, "You must specify control type in order to create it", "oRenderer.addUserAction promise rejected and returned error message");
            });
    });

    QUnit.test("test logRecentActivity API", function (assert) {
        return Container.init("local")
            .then(_createAndPlaceRenderer)
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(function () {
                var oRenderer = Container.getRenderer("fiori2");
                var oRecentEntry = {};

                ShellModel.getConfigModel().setProperty("/enableTrackingActivity", true);

                // add theURL to recent activity log
                oRecentEntry.title = "URL tile text";
                oRecentEntry.appType = AppType.URL;
                oRecentEntry.url = "https://www.google.com";
                oRecentEntry.appId = "https://www.google.com";

                return oRenderer.logRecentActivity(oRecentEntry);
            })
            .then(function () {
                return Container.getServiceAsync("UserRecents").then(function (UserRecents) {
                    return testUtils.promisify(UserRecents.getRecentActivity());
                });
            })
            .then(function (aActivity) {
                assert.strictEqual(aActivity[0].title, "URL tile text");
                assert.strictEqual(aActivity[0].appType, AppType.URL);
                assert.strictEqual(aActivity[0].url, "https://www.google.com");
                assert.strictEqual(aActivity[0].appId, "https://www.google.com");
            });
    });

    QUnit.test("Floating container - test setFloatingContainerContent", function (assert) {
        /**
         * Verify that the renderer API function setFloatingContainerContent eventually calls the shell.controller function _setShellItem,
         * with the correct PropertyString and statuses
         */
        return Container.init("local")
            .then(_createAndPlaceRenderer)
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(function () {
                var oRenderer = Container.getRenderer("fiori2");
                AppLifeCycleAI.switchViewState("home");

                var oButton = new Button("testButton", { text: "testButton" });
                var oWrapperDomElement = document.createElement("DIV");
                oWrapperDomElement.className = "sapUshellShellFloatingContainerWrapper";
                var oDomNode = document.getElementById("qunit");
                oDomNode.appendChild(oWrapperDomElement);

                oRenderer.setFloatingContainerContent(oButton, false, ["home", "app"]);

                const oHomeFloatingContainer = ShellModel.getModel().getProperty("/floatingContainer");

                AppLifeCycleAI.switchViewState("app");

                const oAppFloatingContainer = ShellModel.getModel().getProperty("/floatingContainer");

                assert.ok(oAppFloatingContainer.items.includes(oButton.getId()), "FloatingContainer was added to app");
                assert.ok(oHomeFloatingContainer.items.includes(oButton.getId()), "FloatingContainer was added to home");
            });
    });

    QUnit.test("Floating container - test setFloatingContainerVisible / getFloatingContainerVisible", function (assert) {
        /**
         * Verify that the renderer API function setFloatingContainerVisibility eventually saves the visibility
         * with the correct boolean parameter
         */
        return Container.init("local")
            .then(_createAndPlaceRenderer)
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(function () {
                var oRenderer = Container.getRenderer("fiori2");
                AppLifeCycleAI.switchViewState("home");

                oRenderer.setFloatingContainerVisibility(true);

                var bFloatingContainerVisible = ShellModel.getModel().getProperty("/floatingContainer/visible");
                assert.strictEqual(bFloatingContainerVisible, true, "Saved the correct visibility boolean");

                bFloatingContainerVisible = oRenderer.getFloatingContainerVisiblity(true);
                assert.strictEqual(bFloatingContainerVisible, true, "Renderer.getFloatingContainerVisiblity returned the correct value");
            });
    });

    QUnit.test("Renderer API - setHeaderVisibility", function (assert) {
        return Container.init("local")
            .then(_createAndPlaceRenderer)
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(function () {
                const oShellModel = ShellModel.getModel();
                var oRenderer = Container.getRenderer("fiori2");

                AppLifeCycleAI.switchViewState("home");

                var bHeaderVisible = oShellModel.getProperty("/header/visible");
                assert.strictEqual(bHeaderVisible, true, "Header visibility = true by default");

                oRenderer.setHeaderVisibility(false, true);
                bHeaderVisible = oShellModel.getProperty("/header/visible");
                assert.strictEqual(bHeaderVisible, false, "Header visibility = false after calling the API");
                AppLifeCycleAI.switchViewState("app");
                bHeaderVisible = oShellModel.getProperty("/header/visible");
                assert.strictEqual(bHeaderVisible, true, "Header visibility = true after changing the state");
                AppLifeCycleAI.switchViewState("home");
                bHeaderVisible = oShellModel.getProperty("/header/visible");
                assert.strictEqual(bHeaderVisible, true, "Header visibility = true after changing the state to home");

                oRenderer.setHeaderVisibility(false, false, ["home"]);
                bHeaderVisible = oShellModel.getProperty("/header/visible");
                assert.strictEqual(bHeaderVisible, false, "Header visibility = false after calling the API on state home");
                AppLifeCycleAI.switchViewState("app");
                bHeaderVisible = oShellModel.getProperty("/header/visible");
                assert.strictEqual(bHeaderVisible, true, "Header visibility = true after changing the state toa app");
                AppLifeCycleAI.switchViewState("home");
                bHeaderVisible = oShellModel.getProperty("/header/visible");
                assert.strictEqual(bHeaderVisible, false, "Header visibility = false after changing the state to home again");

                oRenderer.setHeaderVisibility(false, false, ["home", "app"]);
                bHeaderVisible = oShellModel.getProperty("/header/visible");
                assert.strictEqual(bHeaderVisible, false, "Header visibility = false after calling the API on state home and app");
                AppLifeCycleAI.switchViewState("app");
                bHeaderVisible = oShellModel.getProperty("/header/visible");
                assert.strictEqual(bHeaderVisible, false, "Header visibility = false after changing the state toa app");
                AppLifeCycleAI.switchViewState("home");
                bHeaderVisible = oShellModel.getProperty("/header/visible");
                assert.strictEqual(bHeaderVisible, false, "Header visibility = false after changing the state to home again");
            });
    });

    QUnit.test("addHeader(End)Item API", function (assert) {
        return Container.init("local")
            .then(_createAndPlaceRenderer)
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(function () {
                var oRenderer = Container.getRenderer("fiori2");
                AppLifeCycleAI.switchViewState("home");

                var oHeaderItem = {
                    id: "headerItem",
                    icon: "sap-icon://nav-back",
                    target: "#Shell-home",
                    ariaLabel: "Back"
                };
                var oHeaderEndItem = {
                    id: "headerEndItem",
                    icon: "sap-icon://action-settings",
                    ariaLabel: "User Settings",
                    ariaHaspopup: "dialog"
                };

                function checkItems () {
                    var oControl = Element.getElementById("headerItem");
                    assert.strictEqual(oControl.getIcon(), "sap-icon://nav-back", "header icon is set");
                    assert.strictEqual(oControl.getTarget(), "#Shell-home", "target is set");
                    assert.strictEqual(oControl.getAriaLabel(), "Back", "ariaLabel is set");
                    assert.strictEqual(oControl.getAriaHaspopup(), "", "ariaHaspopup is not set");
                    oControl.destroy();

                    oControl = Element.getElementById("headerEndItem");
                    assert.strictEqual(oControl.getIcon(), "sap-icon://action-settings", "header icon is set");
                    assert.strictEqual(oControl.getTarget(), "", "target is not set");
                    assert.strictEqual(oControl.getAriaLabel(), "User Settings", "ariaLabel is set");
                    assert.strictEqual(oControl.getAriaHaspopup(), "dialog", "ariaHaspopup is set");
                    oControl.destroy();
                }

                //check API with controlType
                oRenderer.addHeaderItem(undefined, oHeaderItem, false, true);
                oRenderer.addHeaderEndItem(undefined, oHeaderEndItem, false, true);
                checkItems();

                //check API without controlType
                oRenderer.addHeaderItem(oHeaderItem, false, true);
                oRenderer.addHeaderEndItem(oHeaderEndItem, false, true);
                checkItems();
            });
    });

    QUnit.test("updateHeaderItem API", function (assert) {
        return Container.init("local")
            .then(_createAndPlaceRenderer)
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(function () {
                var oRenderer = Container.getRenderer("fiori2");
                AppLifeCycleAI.switchViewState("home");

                var oHeaderItem = {
                    id: "headerItem",
                    icon: "sap-icon://nav-back",
                    target: "#Shell-home",
                    ariaLabel: "Back",
                    floatingNumber: 10
                };
                var oHeaderEndItem = {
                    id: "headerEndItem",
                    icon: "sap-icon://action-settings",
                    ariaLabel: "User Settings",
                    ariaHaspopup: "dialog",
                    floatingNumber: 20
                };

                function checkItems (delta) {
                    var oControl = Element.getElementById("headerItem");
                    assert.strictEqual(oControl.getFloatingNumber(), 10 + delta, "floating number is valid");
                    if (delta > 0) {
                        oControl.destroy();
                    }

                    oControl = Element.getElementById("headerEndItem");
                    assert.strictEqual(oControl.getFloatingNumber(), 20 + delta, "floating number is valid");
                    if (delta > 0) {
                        oControl.destroy();
                    }
                }

                //check API with controlType
                oRenderer.addHeaderItem(undefined, oHeaderItem, false, true);
                oRenderer.addHeaderEndItem(undefined, oHeaderEndItem, false, true);
                checkItems(0);
                oRenderer.updateHeaderItem("headerItem", { floatingNumber: 20 });
                oRenderer.updateHeaderItem("headerEndItem", { floatingNumber: 30 });
                checkItems(10);

                //check API without controlType
                oRenderer.addHeaderItem(oHeaderItem, false, true);
                oRenderer.addHeaderEndItem(oHeaderEndItem, false, true);
                checkItems(0);
                oRenderer.updateHeaderItem("headerItem", { floatingNumber: 20 });
                oRenderer.updateHeaderItem("headerEndItem", { floatingNumber: 30 });
                checkItems(10);
            });
    });

    QUnit.test("test destroyButton", function (assert) {
        return Container.init("local")
            .then(_createAndPlaceRenderer)
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(function () {
                var oRenderer = Container.getRenderer("fiori2");

                var oButton1 = new Button({
                    id: "testButton1",
                    text: "testAction",
                    icon: "iconName",
                    press: function () {
                        return true;
                    }
                });
                var oButton2 = new Button({
                    id: "testButton2",
                    text: "testAction",
                    icon: "iconName",
                    press: function () {
                        return true;
                    }
                });

                assert.ok(oButton1 !== undefined);
                assert.ok(oButton2 !== undefined);
                oRenderer.destroyButton(["testButton1", "testButton2", "testButtonDummy"]);
                assert.strictEqual(Element.getElementById("testButton1"), undefined);
                assert.strictEqual(Element.getElementById("testButton2"), undefined);
                assert.strictEqual(Element.getElementById("testButtonDummy"), undefined);
            });
    });

    QUnit.test("Header Items - showSignOut item", function (assert) {
        return Container.init("local")
            .then(_createAndPlaceRenderer)
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(function () {
                AppLifeCycleAI.switchViewState("home");
                var oRenderer = Container.getRenderer("fiori2");

                var aActions = ShellModel.getModel().getProperty("/userActions/items");
                assert.strictEqual(aActions.indexOf("logoutBtn"), -1, "Signout should not be in the model");

                oRenderer.showSignOutItem(true);

                aActions = ShellModel.getModel().getProperty("/userActions/items");
                assert.ok(aActions.indexOf("logoutBtn") >= 0, "Signout should be in the model!");
            });
    });

    QUnit.test("Header Items - showSettings item", function (assert) {
        return Container.init("local")
            .then(_createAndPlaceRenderer)
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(function () {
                var oRenderer = Container.getRenderer("fiori2");

                sandbox.stub(StateManager, "getShellMode").returns(ShellMode.Blank);
                AppLifeCycleAI.switchViewState("home");
                var aActions = ShellModel.getModel().getProperty("/userActions/items");
                assert.notOk(aActions.includes("userSettingsBtn"), "userSettingsBtn should not be in the model");

                oRenderer.showSettingsItem(true);

                aActions = ShellModel.getModel().getProperty("/userActions/items");
                assert.ok(aActions.includes("userSettingsBtn"), "userSettingsBtn should be in the model!");
            });
    });

    QUnit.test("Header Items - check argumentDeprecation: 'controlType'", function (assert) {
        return Container.init("local")
            .then(_createAndPlaceRenderer)
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(function () {
                var oRenderer = Container.getRenderer("fiori2");

                AppLifeCycleAI.switchViewState("home");
                // Check adding Header Item without providing deprecated arg 'controlType'.
                oRenderer.addHeaderItem({ id: "headerItem" }, false, true);
                var oControl = Element.getElementById("headerItem");
                assert.ok(oControl, "addHeaderItem is created when not providing deprecated arg 'controlType'");
                oControl.destroy();

                // Check backwards compatibility -  adding Header Item with providing deprecated arg 'controlType'.
                oRenderer.addHeaderItem("testControlType", { id: "headerItem2" }, false, true);
                oControl = Element.getElementById("headerItem2");
                assert.ok(oControl, "addHeaderItem is created when providing deprecated arg 'controlType' - backwards compatibility");
                oControl.destroy();
            });
    });

    QUnit.test("Renderer API - setFooterControl", function (assert) {
        return Container.init("local")
            .then(_createAndPlaceRenderer)
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(async function () {
                var oRenderer = Container.getRenderer("fiori2");

                AppLifeCycleAI.switchViewState("home");

                // Act
                var oControl = oRenderer.setFooterControl("sap.m.Bar", { id: "testFooterId" });
                await nextUIUpdate();

                // Assert
                var oFooterContainer = document.getElementById(ShellArea.Footer);
                var oFooterControl = oFooterContainer.childNodes[0];
                assert.ok(oControl, "footer is created");
                assert.strictEqual(oRenderer.lastFooterId, "testFooterId", "oRenderer.lastFooterId initialized to the created footer id");
                assert.ok(oFooterControl, "The footer control was rendered.");
                assert.strictEqual(oFooterControl.id, "testFooterId", "The footer control had the expected id.");

                oRenderer.removeFooter();
                await nextUIUpdate();

                oControl = Element.getElementById("testFooterId");
                assert.notOk(oControl, "oControl was destroyed - does not exist");
                assert.notOk(oRenderer.lastFooterId, "oRenderer.lastFooterId parameter was set to undefined");
                assert.strictEqual(oFooterContainer.childNodes.length, 0, "The footer control was removed.");
            });
    });

    QUnit.test("Renderer API - setFooter", function (assert) {
        return Container.init("local")
            .then(_createAndPlaceRenderer)
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(async function () {
                var oRenderer = Container.getRenderer("fiori2");

                AppLifeCycleAI.switchViewState("home");

                var oControl = new Bar({ id: "testFooterId" });

                // Act
                oRenderer.setFooter(oControl);
                await nextUIUpdate();

                // Assert
                var oFooterContainer = document.getElementById(ShellArea.Footer);
                var oFooterControl = oFooterContainer.childNodes[0];
                assert.notOk(oRenderer.lastFooterId, "oRenderer.lastFooterId parameter is undefined");
                assert.ok(oFooterControl, "The footer control was rendered.");
                assert.strictEqual(oFooterControl.id, "testFooterId", "The footer control had the expected id.");

                oRenderer.removeFooter();
                await nextUIUpdate();

                assert.ok(oControl, "footer wasn't destroyed by the removeFooter API");
                assert.strictEqual(oFooterContainer.childNodes.length, 0, "The footer control was removed.");
                oControl.destroy();
            });
    });

    QUnit.test("Renderer API - removeFooter", function (assert) {
        return Container.init("local")
            .then(_createAndPlaceRenderer)
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(async function () {
                var oRenderer = Container.getRenderer("fiori2");

                AppLifeCycleAI.switchViewState("home");

                // Act
                var oControl = oRenderer.setFooterControl("sap.m.Bar", { id: "testFooterId" });
                await nextUIUpdate();

                // Assert
                var oFooterContainer = document.getElementById(ShellArea.Footer);
                var oFooterControl = oFooterContainer.childNodes[0];
                assert.ok(oControl, "The footer was created");
                assert.strictEqual(oRenderer.lastFooterId, "testFooterId", "oRenderer.lastFooterId parameter initialized to testFooterId");
                assert.ok(oFooterControl, "The footer control was rendered.");
                assert.strictEqual(oFooterControl.id, "testFooterId", "The footer control had the expected id.");

                oControl.destroy();
                oRenderer.removeFooter();
                await nextUIUpdate();

                assert.notOk(
                    oRenderer.lastFooterId,
                    "The footer control was destroyed before calling the removeFooter function,"
                    + "the function initialized the oRenderer.lastFooterId parameter without trying to destroy the footer control"
                );
                assert.strictEqual(oFooterContainer.childNodes.length, 0, "The footer was removed.");
            });
    });

    QUnit.test("Renderer API - setSideNavigation", function (assert) {
        return Container.init("local")
            .then(_createAndPlaceRenderer)
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(async function () {
                var oRenderer = Container.getRenderer("fiori2");

                AppLifeCycleAI.switchViewState("home");

                var oControl = new Bar({ id: "sideNavigationTestId" });

                // Act
                oRenderer.setSideNavigation(oControl);
                await nextUIUpdate();

                // Assert
                var oSideNavigation = document.getElementById(ShellArea.SideNavigation);
                var oFirstDomNode = oSideNavigation.childNodes[0];
                assert.strictEqual(oFirstDomNode, oControl.getDomRef(), "The SideNavigation control was rendered.");

                oControl.destroy();
            });
    });

    QUnit.test("async mode", function (assert) {
        return Container.init("local")
            .then(_createAndPlaceRenderer)
            .then(testUtils.waitForEventHubEvent.bind(null, "RendererLoaded")) // Renderer API is available
            .then(function () {
                var oRenderer = Container.getRenderer("fiori2");

                assert.ok(oRenderer.getRootControl().isA("sap.ui.core.mvc.View"), "View was created in async mode.");
                assert.ok(oRenderer.shellCtrl.isA("sap.ushell.renderer.Shell"), "Controller was set in async mode.");
            });
    });

    /**
     * @deprecated since 1.120.0
     */
    QUnit.test("sync mode", function (assert) {
        return Container.init("local")
            .then(function () {
                _createAndPlaceRendererSync();
                return testUtils.waitForEventHubEvent("RendererLoaded"); // Renderer API is available
            })
            .then(function () {
                var oRenderer = Container.getRenderer("fiori2");

                assert.ok(oRenderer.getRootControl().isA("sap.ui.core.mvc.View"), "View was created in sync mode.");
                assert.ok(oRenderer.shellCtrl.isA("sap.ushell.renderer.Shell"), "Controller was set in sync mode.");
            });
    });

    QUnit.module("_isBuiltInIntent", {
        beforeEach: function () {
            sandbox.stub(Renderer.prototype, "init");
            this.oRenderer = new Renderer();

            // reset the cache of built-in routes
            delete Renderer._aBuiltInRoutes;
        },
        afterEach: function () {
            sandbox.restore();
            return this.oRenderer.destroy();
        }
    });

    QUnit.test("returns false if parameter is empty object ", function (assert) {
        // Act
        var bIntent = this.oRenderer._isBuiltInIntent({});

        // Assert
        assert.notOk(bIntent, "If parameter is an empty object, return false");
    });

    QUnit.test("returns false if parameter is string", function (assert) {
        // Act
        var bIntent = this.oRenderer._isBuiltInIntent("#bla-blup");

        // Assert
        assert.notOk(bIntent, "If parameter is a string, return false");
    });

    QUnit.test("constructs a concatenation of routes", function (assert) {
        // Arrange
        var oFakeRoutes = [{
            name: "kartoffel",
            pattern: "taste-eliminate"
        }, {
            name: "ShellAndStuff",
            pattern: [
                "Shell-home?some-parameter",
                "Shell-home"
            ]
        }];
        var aExpectedArray = ["taste-eliminate", "Shell-home?some-parameter", "Shell-home"];

        sandbox.stub(this.oRenderer, "getManifestEntry").withArgs("/sap.ui5/routing/routes").returns(oFakeRoutes);

        // Act
        var bInitialNoArray = this.oRenderer._aBuiltInRoutes === undefined;
        this.oRenderer._isBuiltInIntent();
        var bIsArray = Array.isArray(Renderer._aBuiltInRoutes);

        // Assert
        assert.ok(bInitialNoArray, "No array exists on instantiation");
        assert.ok(bIsArray, "Array is present after first call");
        assert.deepEqual(Renderer._aBuiltInRoutes, aExpectedArray, "The routes were concatenated");
    });

    QUnit.test("returns false if intent is not built-in", function (assert) {
        // Arrange
        var oFakeMetadata = [
            { name: "kartoffel", pattern: "taste-eliminate" }
        ];

        sandbox.stub(Renderer, "getMetadata").returns({
            getRoutes: sandbox.stub().returns(oFakeMetadata)
        });

        // Act
        var bIntent = this.oRenderer._isBuiltInIntent({
            semanticObject: "Shell",
            action: "Home"
        });

        // Assert
        assert.notOk(bIntent, "Returns true for built-in intent");
    });

    QUnit.test("returns true if intent is built-in", function (assert) {
        var oFakeMetadata = [{
            name: "kartoffel",
            pattern: "taste-eliminate"
        }, {
            name: "ShellAndStuff",
            pattern: [
                "Shell-home?some-parameter",
                "Shell-home"
            ]
        }];

        sandbox.stub(Renderer, "getMetadata").returns({
            getRoutes: sandbox.stub().returns(oFakeMetadata)
        });

        // Act
        var bIntent = this.oRenderer._isBuiltInIntent({
            semanticObject: "Shell",
            action: "home"
        });

        // Assert
        assert.ok(bIntent, "Returns true for built-in intent");
    });

    QUnit.module("_getHomeAppTarget", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub();

            sandbox.stub(Container, "getServiceAsync").callsFake(this.oGetServiceAsyncStub);

            this.oGetServiceAsyncStub.withArgs("Ui5ComponentLoader").resolves({
                getCoreResourcesComplementBundle: sandbox.stub().returns([
                    "bundle/path/core-ext-light-0.js",
                    "bundle/path/core-ext-light-1.js",
                    "bundle/path/core-ext-light-2.js",
                    "bundle/path/core-ext-light-3.js"
                ])
            });

            sandbox.stub(Renderer.prototype, "init");
            this.oRenderer = new Renderer();

            this.oConfigLastStub = sandbox.stub(Config, "last");
        },
        afterEach: function () {
            sandbox.restore();
            return this.oRenderer.destroy();
        }
    });

    QUnit.test("Returns the homeApp target config when url is set", function (assert) {
        // Arrange
        var oHomeApp = {
            name: "HomeApp",
            url: "path/to/home/app",
            asyncHints: {}
        };

        this.oConfigLastStub.withArgs("/core/homeApp/component").returns(oHomeApp);

        var oExpectedTarget = {
            name: "HomeApp",
            type: "Component",
            id: "homeApp-component",
            path: "",
            options: {
                url: "path/to/home/app",
                componentData: {},
                asyncHints: {
                    preloadBundles: [
                        "bundle/path/core-ext-light-0.js",
                        "bundle/path/core-ext-light-1.js",
                        "bundle/path/core-ext-light-2.js",
                        "bundle/path/core-ext-light-3.js"
                    ]
                }
            }
        };
        // Act
        return this.oRenderer._getHomeAppTarget().then(function (oTargetConfig) {
            // Assert
            assert.deepEqual(oTargetConfig, oExpectedTarget, "Resolved the correct config");
        });
    });

    QUnit.test("Returns an empty target config when url is empty", function (assert) {
        // Arrange
        var oHomeApp = {
            name: "HomeApp",
            url: "",
            messages: []
        };

        this.oConfigLastStub.withArgs("/core/homeApp/component").returns(oHomeApp);

        var oExpectedTarget = {
            name: "error",
            type: "Component",
            id: "homeApp-component",
            path: "sap/ushell/components/homeApp", // needed, otherwise sap/ushell/components is used
            options: {
                componentData: {},
                asyncHints: {
                    preloadBundles: [
                        "bundle/path/core-ext-light-0.js",
                        "bundle/path/core-ext-light-1.js",
                        "bundle/path/core-ext-light-2.js",
                        "bundle/path/core-ext-light-3.js"
                    ]
                }
            }
        };
        // Act
        return this.oRenderer._getHomeAppTarget().then(function (oTargetConfig) {
            // Assert
            assert.deepEqual(oTargetConfig, oExpectedTarget, "Resolved the correct config");
        });
    });

    QUnit.module("init", {
        beforeEach: function () {
            sandbox.stub(Renderer.prototype, "createContent");
            // Stub to avoid implicit init call
            var oInitStub = sandbox.stub(Renderer.prototype, "init");
            this.oConfigLastStub = sandbox.stub(Config, "last");

            this.oRenderer = new Renderer();
            sandbox.stub(this.oRenderer, "_getHomeAppTarget").returns({
                then: sandbox.stub().callsArgWith(0, {
                    name: "HomeApp",
                    type: "Component",
                    id: "homeApp-component"
                })
            });

            // Restore to enable internal init
            oInitStub.restore();
        },
        afterEach: function () {
            sandbox.restore();
            return this.oRenderer.destroy();
        }
    });

    QUnit.test("Adds the homeApp target when the homeApp is enabled", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/homeApp/enabled").returns(true);
        this.oConfigLastStub.withArgs("/core/homeApp/component").returns({
            name: "HomeApp",
            url: "path/to/home/app"
        });
        // Act
        this.oRenderer.init();
        // Assert
        var oTarget = this.oRenderer.getRouter().getTarget("homeapp");
        assert.ok(oTarget, "Returned a non empty target");
    });

    QUnit.test("Does not add the homeApp target when the homeApp is disabled", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/homeApp/enabled").returns(false);
        // Act
        this.oRenderer.init();
        // Assert
        var oTarget = this.oRenderer.getRouter().getTarget("homeapp");
        assert.notOk(oTarget, "Returned a non empty target");
    });

    QUnit.test("Emits \"CoreResourcesComplementLoaded\" when homeApp is displayed", function (assert) {
        // Arrange
        var done = assert.async();
        this.oConfigLastStub.withArgs("/core/homeApp/enabled").returns(true);
        this.oConfigLastStub.withArgs("/core/homeApp/component").returns({
            name: "HomeApp",
            url: "path/to/home/app"
        });
        this.oRenderer.init();
        var oTarget = this.oRenderer.getRouter().getTarget("homeapp");

        // Assert
        EventHub.once("CoreResourcesComplementLoaded").do(function (oEvent) {
            assert.deepEqual(oEvent, { status: "success" }, "Emitted event successfully");
            done();
        });

        // Act
        oTarget.fireDisplay();
    });

    QUnit.module("destroy", {
        beforeEach: function () {
            this.oDestroySpy = sandbox.spy(UIComponent.prototype, "destroy");
            sandbox.stub(Renderer.prototype, "init"); //Stub to avoid implicit init call
            this.oRenderer = new Renderer();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls destroy of super class and returns a thenable", function (assert) {
        // Act
        var oDestroyResult = this.oRenderer.destroy();
        assert.ok(typeof oDestroyResult.then === "function", "Returned a thenable");
        return oDestroyResult.then(function () {
            // Assert
            assert.strictEqual(this.oDestroySpy.callCount, 1, "destroy of super class was called");
        }.bind(this));
    });

    QUnit.test("Waits for controller initializations", function (assert) {
        // Arrange
        this.oRenderer.shellCtrl = {
            awaitPendingInitializations: sandbox.stub().resolves()
        };
        // Act
        var oDestroyResult = this.oRenderer.destroy();
        assert.ok(typeof oDestroyResult.then === "function", "Returned a thenable");
        return oDestroyResult.then(function () {
            // Assert
            assert.strictEqual(this.oRenderer.shellCtrl.awaitPendingInitializations.callCount, 1, "awaitPendingInitializations was called");
            assert.strictEqual(this.oDestroySpy.callCount, 1, "destroy of super class was called");
        }.bind(this));
    });

    QUnit.module("appfinder routing", {
        beforeEach: function () {
            this.oConfigLastStub = sandbox.stub(Config, "last");
            sandbox.stub(Renderer.prototype, "init"); //Stub to avoid implicit init call
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("the contentfinder target exists", function (assert) {
        // Arrange
        this.oRenderer = new Renderer();

        const oContentFinderTarget = this.oRenderer.getManifestEntry("/sap.ui5/routing/targets").contentfinder;
        assert.deepEqual(oContentFinderTarget, {
            name: "sap.ushell.components.contentFinderStandalone",
            type: "Component",
            id: "Shell-appfinder-component",
            options: {
                manifest: true,
                asyncHints: {
                    preloadBundles: []
                },
                componentData: {}
            }
        }, "The contentfinder target was as expected");
    });
});
