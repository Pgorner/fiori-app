// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for AccessKeysHandler
 */
sap.ui.define([
    "sap/m/Table",
    "sap/ui/core/Component",
    "sap/ui/Device",
    "sap/ui/core/Element",
    "sap/ui/model/json/JSONModel",
    "sap/ui/qunit/utils/nextUIUpdate",
    "sap/ui/thirdparty/hasher",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/components/ComponentKeysHandler",
    "sap/ushell/Config",
    "sap/ushell/renderer/AccessKeysHandler",
    "sap/ushell/resources",
    "sap/ushell/Container",
    "sap/ushell/renderer/ShellLayout",
    "sap/ushell/state/StateManager"
], function (
    Table,
    Component,
    Device,
    Element,
    JSONModel,
    nextUIUpdate,
    hasher,
    jQuery,
    ComponentKeysHandler,
    Config,
    AccessKeysHandler,
    resources,
    Container,
    ShellLayout,
    StateManager
) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox();

    // init must be only called once over all the tests
    AccessKeysHandler.init(new JSONModel({
        searchAvailable: false
    }));

    QUnit.module("AccessKeysHandler", {
        beforeEach: function () {
            QUnit.sap.ushell.createTestDomRef(); // used to place the Renderer
            sandbox.stub(AccessKeysHandler, "init");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("check AccessKeysHandler Class init flags values", function (assert) {
        assert.strictEqual(AccessKeysHandler.bFocusOnShell, true, "flag init value should be true");
        assert.strictEqual(AccessKeysHandler.bFocusPassedToExternalHandlerFirstTime, true, "flag init value should be true");
        assert.strictEqual(AccessKeysHandler.isFocusHandledByAnotherHandler, false, "flag init value should be false");
    });

    QUnit.test("move focus to inner application", function (assert) {
        var done = assert.async();
        var fnCallbackAppKeysHandler = sandbox.spy();
        sandbox.stub(hasher, "getHash").returns("shell-home");

        // register inner application keys handler
        AccessKeysHandler.registerAppKeysHandler(fnCallbackAppKeysHandler);
        // Trigger the F6 key event to move keys handling to inner application
        var F6keyCode = 117;
        var oEvent;
        // IE doesn't support creating the KeyboardEvent object with a the "new" constructor, hence if this will fail, it will be created
        // using the document object- https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/KeyboardEvent
        // This KeyboardEvent has a constructor, so checking for its ecsitaance will not solve this, hence, only solution found is try-catch
        try {
            oEvent = new KeyboardEvent("keydown");
        } catch (err) {
            var IEevent = document.createEvent("KeyboardEvent");
            // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/initKeyboardEvent
            IEevent.initKeyboardEvent("keydown", false, false, null, 0, 0, 0, 0, false);
            oEvent = IEevent;
        }

        oEvent.oEventkeyCode = F6keyCode;
        // Set flag to false because the focus moves to the application responsibility
        AccessKeysHandler.bFocusOnShell = false;
        document.dispatchEvent(oEvent);

        setTimeout(function () {
            assert.ok(fnCallbackAppKeysHandler.calledOnce, "Application's keys handler function was not executed");
            done();
        }, 100);
    });

    QUnit.test("check focus back to shell flags validity", function (assert) {
        var instance = AccessKeysHandler;

        // Set flag to false because the focus moves to the application responsibility
        AccessKeysHandler.bFocusOnShell = false;

        // Move focus back to shell
        var F6keyCode = 117;
        var oEvent = new jQuery.Event("keydown", { keyCode: F6keyCode, shiftKey: true });

        AccessKeysHandler.sendFocusBackToShell(oEvent);

        assert.strictEqual(instance.bFocusOnShell, true, "flag value should be true");
    });

    QUnit.test("test reset handlers after navigating to another application", function (assert) {
        var fnCallbackAppKeysHandler = sandbox.spy();
        var hasherGetHashStub = sandbox.stub(hasher, "getHash").returns("some-app");

        // register inner application keys handler
        AccessKeysHandler.registerAppKeysHandler(fnCallbackAppKeysHandler);

        var currentKeysHandler = AccessKeysHandler.getAppKeysHandler();
        assert.ok(currentKeysHandler, "currently there is a registered keys handler");

        // this function will be called once 'appOpened' event will be fired
        hasherGetHashStub.returns("another-app");
        AccessKeysHandler.appOpenedHandler();
        currentKeysHandler = AccessKeysHandler.getAppKeysHandler();
        assert.strictEqual(currentKeysHandler, null, "currently there is no registered keys handler");
    });

    [
        {
            sTestDescription: "ALT was pressed",
            oEvent: { altKey: true },
            bExpectedHandleAltShortcutKeys: true,
            bExpectedHandleCtrlShortcutKeys: false
        }, {
            sTestDescription: "CTRL was pressed",
            oEvent: { ctrlKey: true },
            bExpectedHandleAltShortcutKeys: false,
            bExpectedHandleCtrlShortcutKeys: true
        }, {
            sTestDescription: "CMD + SHIFT + F was pressed",
            oEvent: {
                metaKey: true,
                shiftKey: true,
                keyCode: 70,
                preventDefault: function () { }
            },
            bExpectedHandleAltShortcutKeys: false,
            bExpectedHandleCtrlShortcutKeys: false
        }
    ].forEach(function (oFixture) {
        QUnit.test("handleShortcuts: " + oFixture.sTestDescription, function (assert) {
            // Arrange
            var oAccessKeysHandler = AccessKeysHandler,
                fnHandleAltShortcutKeysStub = sandbox.stub(oAccessKeysHandler, "_handleAltShortcutKeys"),
                fnHandleCtrlShortcutKeysStub = sandbox.stub(oAccessKeysHandler, "_handleCtrlShortcutKeys"),
                bTempMacintosh = Device.os.macintosh;

            Device.os.macintosh = true;

            // Act
            oAccessKeysHandler.handleShortcuts(oFixture.oEvent);

            // Assert
            assert.strictEqual(fnHandleAltShortcutKeysStub.called, oFixture.bExpectedHandleAltShortcutKeys,
                "_handleAltShortcutKeys was (not) called when ");
            assert.strictEqual(fnHandleCtrlShortcutKeysStub.called, oFixture.bExpectedHandleCtrlShortcutKeys,
                "_handleCtrlShortcutKeys was (not) called when ");

            Device.os.macintosh = bTempMacintosh;
        });
    });

    var aTestCases = [{
        sTestDescription: "ALT + A was pressed",
        oEvent: { keyCode: 65 },
        bAdvancedShellActions: true,
        bExpectedBlockBrowserDefault: true,
        bExpectedFocusItemInUserMenu: true,
        bExpectedFocusItemInOverflowPopover: false
    }, {
        sTestDescription: "ALT + A was pressed, but bAdvancedShellActions is false",
        oEvent: { keyCode: 65 },
        bAdvancedShellActions: false,
        bExpectedBlockBrowserDefault: false,
        bExpectedFocusItemInUserMenu: false,
        bExpectedFocusItemInOverflowPopover: false
    }, {
        sTestDescription: "ALT + A was pressed and moveAppFinderToShellHeader is true",
        oEvent: { keyCode: 65 },
        bAdvancedShellActions: true,
        bMoveAppFinderActionToShellHeader: true,
        bExpectedBlockBrowserDefault: true,
        bExpectedFocusItemInUserMenu: false,
        bExpectedFocusItemInOverflowPopover: true
    }, {
        sTestDescription: "ALT + B was pressed (hotkey not in use)",
        oEvent: { keyCode: 66 },
        bExpectedBlockBrowserDefault: false,
        bExpectedFocusItemInUserMenu: false,
        bExpectedFocusItemInOverflowPopover: false
    }, {
        sTestDescription: "ALT + F was pressed",
        oEvent: { keyCode: 70 },
        bExpectedBlockBrowserDefault: true,
        bExpectedFocusItemInUserMenu: false,
        bExpectedFocusItemInOverflowPopover: false
    }, {
        sTestDescription: "ALT + H was pressed",
        oEvent: { keyCode: 72 },
        bExpectedBlockBrowserDefault: true,
        bExpectedFocusItemInUserMenu: false,
        bExpectedFocusItemInOverflowPopover: false
    }, {
        sTestDescription: "ALT + M was pressed",
        oEvent: { keyCode: 77 },
        bExpectedBlockBrowserDefault: true,
        bExpectedFocusItemInUserMenu: false,
        bExpectedFocusItemInOverflowPopover: false
    }, {
        sTestDescription: "ALT + N was pressed",
        oEvent: { keyCode: 78 },
        bExpectedBlockBrowserDefault: true,
        bExpectedFocusItemInUserMenu: false,
        bExpectedFocusItemInOverflowPopover: false
    }, {
        sTestDescription: "ALT + S was pressed",
        oEvent: { keyCode: 83 },
        bAdvancedShellActions: true,
        bExpectedBlockBrowserDefault: true,
        bExpectedFocusItemInUserMenu: true,
        bExpectedFocusItemInOverflowPopover: false
    }, {
        sTestDescription: "ALT + s was pressed, but bAdvancedShellActions is false",
        oEvent: { keyCode: 83 },
        bAdvancedShellActions: false,
        bExpectedBlockBrowserDefault: false,
        bExpectedFocusItemInUserMenu: false,
        bExpectedFocusItemInOverflowPopover: false
    }, {
        sTestDescription: "ALT + S was pressed and moveUserSettingsActionToShellHeader is true",
        oEvent: { keyCode: 83 },
        bAdvancedShellActions: true,
        bMoveUserSettingsActionToShellHeader: true,
        bExpectedBlockBrowserDefault: true,
        bExpectedFocusItemInUserMenu: false,
        bExpectedFocusItemInOverflowPopover: true
    }];


    aTestCases.forEach(function (oFixture) {
        QUnit.test("_handleAltShortcutKeys: " + oFixture.sTestDescription, function (assert) {
            var done = assert.async();
            // Arrange
            var fnBlockBrowserDefaultStub = sandbox.spy(AccessKeysHandler, "_blockBrowserDefault");
            sandbox.stub(Element, "getElementById").returns(function (sId) {
                if (sId === "shell-header") {
                    return {
                        getHomeUri: function () {
                            return "#Shell-home";
                        }
                    };
                }
                return {
                    isOpen: function () {
                        return true;
                    }
                };
            });

            sandbox.stub(Container, "getRendererInternal").returns({
                getShellConfig: function () {
                    return {
                        moveAppFinderActionToShellHeader: oFixture.bMoveAppFinderActionToShellHeader,
                        moveUserSettingsActionToShellHeader: oFixture.bMoveUserSettingsActionToShellHeader
                    };
                }});

            // Act
            AccessKeysHandler._handleAltShortcutKeys(oFixture.oEvent, oFixture.bAdvancedShellActions);

            // Assert
            window.setTimeout(function () {
                assert.strictEqual(fnBlockBrowserDefaultStub.called, oFixture.bExpectedBlockBrowserDefault,
                    "Default Event prevented when " + oFixture.sTestDescription);
                sandbox.restore();
                done();
            }, 0);
        });
    });

    [
        {
            sTestDescription: "CTRL + SHIFT + F was pressed",
            oEvent: { keyCode: 70, shiftKey: true, preventDefault: function () { }, stopPropagation: function () { } },
            bExpectedSettingsButtonPressed: false,
            bExpectedDoneButtonPressed: false,
            bExpectedHandleAccessOverviewKey: false
        }, {
            sTestDescription: "CTRL + F was pressed (hotkey not in use)",
            oEvent: { keyCode: 70, preventDefault: function () { }, stopPropagation: function () { } },
            bExpectedSettingsButtonPressed: false,
            bExpectedDoneButtonPressed: false,
            bExpectedHandleAccessOverviewKey: false
        }, {
            sTestDescription: "CTRL + F1 was pressed",
            oEvent: { keyCode: 112, preventDefault: function () { }, stopPropagation: function () { } },
            bExpectedSettingsButtonPressed: false,
            bExpectedDoneButtonPressed: false,
            bExpectedHandleAccessOverviewKey: true
        }, {
            sTestDescription: "CTRL + S was pressed",
            oEvent: {
                keyCode: 83,
                preventDefault: function () { }
            },
            bExpectedSettingsButtonPressed: false,
            bExpectedDoneButtonPressed: false,
            bExpectedHandleAccessOverviewKey: false
        }, {
            sTestDescription: "CTRL + Enter was pressed",
            oEvent: { keyCode: 13, preventDefault: function () { }, stopPropagation: function () { } },
            bExpectedSettingsButtonPressed: false,
            bExpectedDoneButtonPressed: true,
            bExpectedHandleAccessOverviewKey: false
        }
    ].forEach(function (oFixture) {
        QUnit.test("_handleCtrlShortcutKeys: " + oFixture.sTestDescription, function (assert) {
            // Arrange
            var fnHandleAccessOverviewKeyStub = sandbox.stub(AccessKeysHandler, "_handleAccessOverviewKey");
            var bSettingsButtonPressed = false;
            var bDoneButtonPressed = false;
            sandbox.stub(Element, "getElementById").callsFake(function (sId) {
                if (sId === "userSettingsBtn") {
                    return {
                        firePress: function () {
                            bSettingsButtonPressed = true;
                        }
                    };
                } else if (sId === "sapUshellDashboardFooterDoneBtn") {
                    return {
                        getDomRef: function () {
                            return {};
                        },
                        firePress: function () {
                            bDoneButtonPressed = true;
                        }
                    };
                }
            });

            // Act
            AccessKeysHandler._handleCtrlShortcutKeys(oFixture.oEvent, oFixture.bAdvancedShellActions);

            // Assert
            assert.strictEqual(fnHandleAccessOverviewKeyStub.called, oFixture.bExpectedHandleAccessOverviewKey,
                "AccessOverview Dialog was (not) created when ");
            assert.strictEqual(bSettingsButtonPressed, oFixture.bExpectedSettingsButtonPressed,
                "Settings Dialog was (not) created when ");
            assert.strictEqual(bDoneButtonPressed, oFixture.bExpectedDoneButtonPressed,
                "Done button was (not) pressed when ");
        });
    });

    QUnit.test("_handleCtrlShortcutKeys: CTRL + COMMA was pressed with limited shell actions", function (assert) {
        // Arrange
        var oEvent = {
            keyCode: 188,
            preventDefault: sandbox.stub(),
            stopPropagation: sandbox.stub()
        };
        var fnSettingsButtonPress = sandbox.stub();
        sandbox.stub(Element, "getElementById").withArgs("userSettingsBtn").returns({
            firePress: fnSettingsButtonPress
        });

        // Act
        AccessKeysHandler._handleCtrlShortcutKeys(oEvent, false);

        // Assert
        assert.strictEqual(fnSettingsButtonPress.callCount, 0, "The settings button was not pressed.");
    });

    QUnit.test("_handleCtrlShortcutKeys: CTRL + COMMA was pressed with advanced shell actions enabled", function (assert) {
        // Arrange
        var oEvent = {
            keyCode: 188,
            preventDefault: sandbox.stub(),
            stopPropagation: sandbox.stub()
        };
        var fnSettingsButtonPress = sandbox.stub();
        sandbox.stub(Element, "getElementById").withArgs("userSettingsBtn").returns({
            firePress: fnSettingsButtonPress
        });

        // Act
        AccessKeysHandler._handleCtrlShortcutKeys(oEvent, true);

        // Assert
        assert.strictEqual(fnSettingsButtonPress.callCount, 1, "The settings button was pressed.");
    });

    QUnit.test("_handleCtrlShortcutKeys: CTRL + COMMA was pressed with advanced shell actions enabled in a sap.m.Table", async function (assert) {
        // Arrange
        var oTable = new Table();
        oTable.placeAt("qunit-fixture");
        await nextUIUpdate();
        oTable.focus();
        var oEvent = {
            keyCode: 188,
            preventDefault: sandbox.stub(),
            stopPropagation: sandbox.stub()
        };
        var fnSettingsButtonPress = sandbox.stub();
        sandbox.stub(Element, "getElementById").withArgs("userSettingsBtn").returns({
            firePress: fnSettingsButtonPress
        });

        // Act
        AccessKeysHandler._handleCtrlShortcutKeys(oEvent, true);

        // Assert
        assert.strictEqual(fnSettingsButtonPress.callCount, 0, "The settings button was not pressed.");

        oTable.destroy();
    });

    /**
     * sap.ushell.components.homepage was deprecated in 1.112
     * @deprecated since 1.112
     */
    QUnit.test("check that mobile does not init the key handlers", function (assert) {
        var done = assert.async();
        var oRenderer;

        var ComponentKeysHandlerInit = sandbox.stub(ComponentKeysHandler.prototype, "_init").resolves();
        Device.system.desktop = false;
        Device.system.phone = true;
        Device.system.tablet = false;

        Container.init("local")
            .then(function () {
                Container.createRendererInternal("fiori2")
                    .then(function (oFiori2Renderer) {
                        oRenderer = oFiori2Renderer;
                        oFiori2Renderer.placeAt("qunit-canvas");

                        return Component.create({
                            name: "sap.ushell.components.homepage",
                            componentData: {
                                properties: {},
                                config: {}
                            }
                        });
                    })
                    .then(function (oHomepageComponent) {
                        assert.ok(!ComponentKeysHandlerInit.called, "Keys handler init was not called in phone mode");

                        oHomepageComponent.destroy();
                        oRenderer.destroy().then(function () {
                            Container.resetServices();
                            StateManager.resetAll();
                            done();
                        });
                    });
            });
    });

    /**
     * sap.ushell.components.homepage was deprecated in 1.112
     * @deprecated since 1.112
     */
    QUnit.test("check that tablet does not init the key handlers", function (assert) {
        var done = assert.async();
        var oRenderer;

        var ComponentKeysHandlerInit = sandbox.stub(ComponentKeysHandler.prototype, "_init").resolves();
        Device.system.desktop = false;
        Device.system.phone = false;
        Device.system.tablet = true;

        Container.init("local")
            .then(function () {
                Container.createRendererInternal("fiori2")
                    .then(function (oFiori2Renderer) {
                        oRenderer = oFiori2Renderer;
                        oFiori2Renderer.placeAt("qunit-canvas");

                        return Component.create({
                            name: "sap.ushell.components.homepage",
                            componentData: {
                                properties: {},
                                config: {}
                            }
                        });
                    })
                    .then(function (oHomepageComponent) {
                        assert.ok(!ComponentKeysHandlerInit.called, "Keys handler init was not called in tablet mode");

                        oHomepageComponent.destroy();
                        oRenderer.destroy().then(function () {
                            Container.resetServices();
                            StateManager.resetAll();
                            done();
                        });
                    });
            });
    });

    QUnit.test("Triggers the editModeDone event for Control + Enter if in spaces mode", function (assert) {
        // Arrange
        sandbox.stub(AccessKeysHandler, "_isFocusInDialog").returns(false);
        sandbox.stub(Config, "last").withArgs("/core/spaces/enabled").returns(true);
        var oFireEventStub = sandbox.stub(AccessKeysHandler, "fireEvent");

        var oEvent = {
            keyCode: 13
        };

        // Act
        AccessKeysHandler._handleCtrlShortcutKeys(oEvent);

        // Assert
        assert.strictEqual(oFireEventStub.callCount, 1, "The function fireEvent has been called once.");
        assert.deepEqual(oFireEventStub.firstCall.args, ["editModeDone"], "The function fireEvent has been called once.");
    });

    QUnit.module("_handleAccessOverviewKey method", {
        beforeEach: function () {
            sandbox.stub(AccessKeysHandler, "init");
            this.oGetTextSpy = sandbox.spy(resources.i18n, "getText");
            this.oConfigStub = sandbox.stub(Config, "last");

            // the config model updates delayed
            this.oOriginalModel = AccessKeysHandler.oConfigModel;
            AccessKeysHandler.oConfigModel = new JSONModel({
                searchAvailable: true,
                personalization: true
            });

            this.oConfigStub.withArgs("/core/shell/model/enableNotifications").returns(true);
            this.oConfigStub.withArgs("/core/catalog/enabled").returns(true);

            this.oShellHeader = document.createElement("div");

            this.oShellHeader.setAttribute("id", "shell-header");
            document.body.appendChild(this.oShellHeader);

            this.oRequireStub = sandbox.stub(sap.ui, "require");
        },
        afterEach: function () {
            AccessKeysHandler.oConfigModel = this.oOriginalModel;

            document.body.removeChild(this.oShellHeader);
            sandbox.restore();
        }
    });

    QUnit.test("Check short keys dialog is creating successfully with every shortcut available", function (assert) {
        // Arrange

        // Act
        AccessKeysHandler._handleAccessOverviewKey(true);

        // Assert
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnAppFinderButton").callCount, 1, "The focus appfinder text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchButton").callCount, 1, "The focus search button text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyHomePage").callCount, 1, "The homepage text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnUserActionMenu").callCount, 1, "The focus user actions menu text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnNotifications").callCount, 1, "The focus notifications text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSettingsButton").callCount, 1, "The focus settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyOpenSettings").callCount, 1, "The open settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyExitEditing").callCount, 1, "The save changes text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchField").callCount, 1, "The focus search field text was requested.");
    });

    QUnit.test("Check short keys dialog is creating successfully with notifications disabled", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/shell/model/enableNotifications").returns(false);

        // Act
        AccessKeysHandler._handleAccessOverviewKey(true);

        // Assert
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnAppFinderButton").callCount, 1, "The focus appfinder text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchButton").callCount, 1, "The focus search button text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyHomePage").callCount, 1, "The homepage text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnUserActionMenu").callCount, 1, "The focus user actions menu text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnNotifications").callCount, 0, "The focus notifications text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSettingsButton").callCount, 1, "The focus settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyOpenSettings").callCount, 1, "The open settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyExitEditing").callCount, 1, "The save changes text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchField").callCount, 1, "The focus search field text was requested.");
    });

    QUnit.test("Check short keys dialog is creating successfully with personalization disabled", function (assert) {
        // Arrange
        AccessKeysHandler.oConfigModel.setProperty("/personalization", false);

        // Act
        AccessKeysHandler._handleAccessOverviewKey(true);

        // Assert
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnAppFinderButton").callCount, 1, "The focus appfinder text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchButton").callCount, 1, "The focus search button text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyHomePage").callCount, 1, "The homepage text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnUserActionMenu").callCount, 1, "The focus user actions menu text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnNotifications").callCount, 1, "The focus notifications text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSettingsButton").callCount, 1, "The focus settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyOpenSettings").callCount, 1, "The open settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyExitEditing").callCount, 0, "The save changes text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchField").callCount, 1, "The focus search field text was requested.");
    });

    QUnit.test("Check short keys dialog is creating successfully with appfinder disabled", function (assert) {
        // Arrange
        AccessKeysHandler.oConfigModel.setProperty("/personalization", true);
        this.oConfigStub.withArgs("/core/catalog/enabled").returns(false);

        // Act
        AccessKeysHandler._handleAccessOverviewKey(true);

        // Assert
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnAppFinderButton").callCount, 0, "The focus appfinder text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchButton").callCount, 1, "The focus search button text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyHomePage").callCount, 1, "The homepage text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnUserActionMenu").callCount, 1, "The focus user actions menu text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnNotifications").callCount, 1, "The focus notifications text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSettingsButton").callCount, 1, "The focus settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyOpenSettings").callCount, 1, "The open settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyExitEditing").callCount, 0, "The save changes text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchField").callCount, 1, "The focus search field text was requested.");
    });

    QUnit.test("Check short keys dialog is creating successfully with search unavailable", function (assert) {
        // Arrange
        AccessKeysHandler.oConfigModel.setProperty("/searchAvailable", false);

        // Act
        AccessKeysHandler._handleAccessOverviewKey(true);

        // Assert
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnAppFinderButton").callCount, 1, "The focus appfinder text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchButton").callCount, 0, "The focus search button text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyHomePage").callCount, 1, "The homepage text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnUserActionMenu").callCount, 1, "The focus user actions menu text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnNotifications").callCount, 1, "The focus notifications text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSettingsButton").callCount, 1, "The focus settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyOpenSettings").callCount, 1, "The open settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyExitEditing").callCount, 1, "The save changes text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchField").callCount, 0, "The focus search field text was requested.");
    });

    QUnit.test("Check short keys dialog is creating successfully with advancedShellActions unavailable", function (assert) {
        // Arrange

        // Act
        AccessKeysHandler._handleAccessOverviewKey(false);

        // Assert
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnAppFinderButton").callCount, 0, "The focus appfinder text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchButton").callCount, 1, "The focus search button text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyHomePage").callCount, 1, "The homepage text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnUserActionMenu").callCount, 1, "The focus user actions menu text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnNotifications").callCount, 1, "The focus notifications text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSettingsButton").callCount, 0, "The focus settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyOpenSettings").callCount, 0, "The open settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyExitEditing").callCount, 1, "The save changes text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchField").callCount, 1, "The focus search field text was requested.");
    });

    QUnit.test("Check short keys dialog is creating successfully with every flag on false", function (assert) {
        // Arrange
        AccessKeysHandler.oConfigModel.setProperty("/searchAvailable", false);
        AccessKeysHandler.oConfigModel.setProperty("/personalization", false);
        this.oConfigStub.withArgs("/core/shell/model/enableNotifications").returns(false);
        this.oConfigStub.withArgs("/core/catalog/enabled").returns(false);

        // Act
        AccessKeysHandler._handleAccessOverviewKey(false);

        // Assert
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnAppFinderButton").callCount, 0, "The focus appfinder text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchButton").callCount, 0, "The focus search button text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyHomePage").callCount, 1, "The homepage text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnUserActionMenu").callCount, 1, "The focus user actions menu text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnNotifications").callCount, 0, "The focus notifications text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSettingsButton").callCount, 0, "The focus settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyOpenSettings").callCount, 0, "The open settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyExitEditing").callCount, 0, "The save changes text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchField").callCount, 0, "The focus search field text was requested.");
    });
});
