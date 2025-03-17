// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.shell.MenuBar.controller
 */
sap.ui.define([
    "sap/ui/model/Context",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/components/shell/MenuBar/controller/MenuBar.controller",
    "sap/ushell/EventHub",
    "sap/ushell/utils/WindowUtils",
    "sap/m/IconTabFilter",
    "sap/m/IconTabSeparator",
    "sap/ushell/Config",
    "sap/ushell/Container",
    "sap/ushell/resources",
    "sap/ushell/library"
], function (
    Context,
    JSONModel,
    MenuBarController,
    EventHub,
    WindowUtils,
    IconTabFilter,
    IconTabSeparator,
    Config,
    Container,
    resources,
    ushellLibrary
) {
    "use strict";

    /* global QUnit, sinon */

    // shortcut for sap.ushell.ContentNodeType
    var ContentNodeType = ushellLibrary.ContentNodeType;

    var sandbox = sinon.createSandbox({});

    QUnit.module("The function onInit", {
        before: function () {
            return Container.init("local");
        },
        beforeEach: function () {
            sandbox.stub(resources.i18n, "getText").returnsArg(0);

            this.oEventHubDoStub = sandbox.stub().returns({
                off: sandbox.stub()
            });
            this.oEventHubOnStub = sandbox.stub(EventHub, "on");
            this.oEventHubOnStub.withArgs("enableMenuBarNavigation").returns({
                do: this.oEventHubDoStub
            });

            this.oAttachMatchedStub = sandbox.stub();
            this.oGetServiceAsyncStub = sandbox.stub();
            sandbox.stub(Container, "getServiceAsync").callsFake(this.oGetServiceAsyncStub);
            sandbox.stub(Container, "getRendererInternal").callsFake(function () {
                return {
                    getRouter: function () {
                        return {
                            getRoute: function () {
                                return {
                                    attachMatched: this.oAttachMatchedStub
                                };
                            }.bind(this)
                        };
                    }.bind(this)
                };
            }.bind(this));

            this.oGetModelStub = sandbox.stub();
            this.oGetServiceAsyncStub.withArgs("Pages").returns(
                Promise.resolve({
                    getModel: this.oGetModelStub
                })
            );

            this.oGetDefaultSpaceStub = sandbox.stub();
            this.oGetServiceAsyncStub.withArgs("Menu").returns(
                Promise.resolve({
                    getDefaultSpace: this.oGetDefaultSpaceStub
                })
            );

            this.oController = new MenuBarController();

            this.oSelectIndexAfterRouteChangeStub = sandbox.stub(this.oController, "_selectIndexAfterRouteChange");

            this.oSetModelStub = sandbox.stub();
            this.oSetPropertyStub = sandbox.stub();
            this.oGetModelStub = sandbox.stub();
            this.oGetModelStub.withArgs("viewConfiguration").returns({
                setProperty: this.oSetPropertyStub
            });
            this.oController.getView = function () {
                return {
                    setModel: this.oSetModelStub,
                    getModel: this.oGetModelStub
                };
            }.bind(this);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Gets the pages service, the URL parsing service and the default space asynchronously", function (assert) {
        //Arrange
        var done = assert.async();
        var oExpectedDefaultSpace = {
            id: "EMPTY_SPACE",
            label: "Empty space",
            type: ContentNodeType.Space,
            isContainer: false,
            children: []
        };
        var oExpectedModelObject = {
            ariaTexts: {
                headerLabel: "SpacePageNavgiationRegion"
            },
            selectedKey: "None Existing Key",
            enableMenuBarNavigation: true
        };

        this.oGetDefaultSpaceStub.resolves(oExpectedDefaultSpace);
        // Act
        this.oController.onInit();

        // Assert
        assert.strictEqual(this.oSelectIndexAfterRouteChangeStub.callCount, 1, "The method _oSelectIndexAfterRouteChangeStub is called once");
        assert.strictEqual(this.oSetModelStub.callCount, 1, "The model was set once");
        assert.deepEqual(this.oSetModelStub.getCall(0).args[0].getProperty("/"), oExpectedModelObject, "The correct data was set in the model.");
        assert.strictEqual(this.oSetModelStub.getCall(0).args[1], "viewConfiguration", "The model has the correct name.");
        this.oController.oGetDefaultSpacePromise.then(function (oDefaultSpace) {
            assert.strictEqual(this.oGetDefaultSpaceStub.callCount, 1, "The menu service has been used to retrieve the default space.");
            assert.strictEqual(oDefaultSpace, oExpectedDefaultSpace, "The default space has been retrieved correctly.");
            done();
        }.bind(this));
    });

    QUnit.test("Attaches handlers to matched routes", function (assert) {
        // Act
        this.oController.onInit();

        // Assert
        assert.equal(this.oAttachMatchedStub.callCount, 3, "The function attachMatched is called twice");
        assert.strictEqual(this.oAttachMatchedStub.getCall(0).args[0], this.oSelectIndexAfterRouteChangeStub, "The function attachMatched is called with correct parameters");
        assert.strictEqual(this.oAttachMatchedStub.getCall(1).args[0], this.oSelectIndexAfterRouteChangeStub, "The function attachMatched is called with correct parameters");
        assert.strictEqual(this.oAttachMatchedStub.getCall(2).args[0], this.oSelectIndexAfterRouteChangeStub, "The function attachMatched is called with correct parameters");
    });

    QUnit.test("Attaches EventHub Listener", function (assert) {
        //Arrange
        //Act
        this.oController.onInit();

        //Assert
        assert.strictEqual(this.oEventHubOnStub.callCount, 1, "EventHub Listener was attached");
    });

    QUnit.test("Calls EventHub Listener with parameter true", function (assert) {
        //Arrange
        //Act
        this.oController.onInit();
        this.oEventHubDoStub.getCall(0).args[0](true); //simulate trigger EventHub

        //Assert
        assert.strictEqual(this.oSetPropertyStub.callCount, 1, "setProperty was called once");
        assert.deepEqual(this.oSetPropertyStub.getCall(0).args, ["/enableMenuBarNavigation", true], "setProperty was called with the correct parameters");
    });

    QUnit.test("Calls EventHub Listener with parameter false", function (assert) {
        //Arrange
        //Act
        this.oController.onInit();
        this.oEventHubDoStub.getCall(0).args[0](false); //simulate trigger EventHub

        //Assert
        assert.strictEqual(this.oSetPropertyStub.callCount, 1, "setProperty was called once");
        assert.deepEqual(this.oSetPropertyStub.getCall(0).args, ["/enableMenuBarNavigation", false], "setProperty was called with the correct parameters");
    });

    QUnit.test("Removes the style class sapContrast from the toolheader", function (assert) {
        //Arrange
        var oToolHeader = {
            removeStyleClass: sandbox.stub()
        };
        sandbox.stub(this.oController, "byId").withArgs("navigationBar").returns(oToolHeader);

        //Act
        this.oController.onInit();

        //Assert
        assert.strictEqual(oToolHeader.removeStyleClass.args[0][0], "sapContrast", "The style class was removed");
    });

    QUnit.module("The function onMenuItemSelection", {
        beforeEach: function () {
            this.aMenuMock = [
                { id: "menu" }
            ];
            this.oCANEntryMock = {
                uid: "ID-1",
                title: "Space title",
                description: "Space description",
                icon: "sap-icon://document",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        { name: "spaceId", value: "Z_TEST_SPACE" },
                        { name: "pageId", value: "Z_TEST_PAGE" }
                    ],
                    innerAppRoute: "&/some/in/app/route"
                },
                menuEntries: []
            };
            this.oUrlEntryMock = {
                uid: "ID-2",
                title: "Space title",
                description: "Space description",
                icon: "sap-icon://document",
                type: "URL",
                target: {
                    url: "https://sap.com"
                },
                menuEntries: []
            };
            this.oTextEntryMock = {
                uid: "ID-3",
                title: "Space title",
                description: "Space description",
                icon: "sap-icon://document",
                type: "text",
                menuEntries: []
            };
            this.oGetParameterStub = sandbox.stub();
            this.oGetPropertyStub = sandbox.stub();
            this.oGetPropertyStub.withArgs("/").returns(this.aMenuMock);
            this.oUIBaseEvent = {
                getParameter: this.oGetParameterStub
            };
            this.oController = new MenuBarController();
            this.oController.getView = function () {
                return {
                    getModel: function () {
                        return {
                            getProperty: this.oGetPropertyStub
                        };
                    }.bind(this)
                };
            }.bind(this);
            this.oGetNestedMenuEntryByUidStub = sandbox.stub(this.oController, "_getNestedMenuEntryByUid");
            this.oPerformNavigationStub = sandbox.stub(this.oController, "_performNavigation");
            this.oOpenURLStub = sandbox.stub(this.oController, "_openURL");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Handles menuEntry correctly if the navigation type is 'IBN'", function (assert) {
        // Arrange
        this.oGetParameterStub.withArgs("key").returns("ID-1");
        this.oGetNestedMenuEntryByUidStub.withArgs(this.aMenuMock, "ID-1").returns(this.oCANEntryMock);

        var oExpectedDestinationTarget = {
            semanticObject: "Launchpad",
            action: "openFLPPage",
            parameters: [
                { name: "spaceId", value: "Z_TEST_SPACE" },
                { name: "pageId", value: "Z_TEST_PAGE" }
            ],
            innerAppRoute: "&/some/in/app/route"
        };

        // Act
        this.oController.onMenuItemSelection(this.oUIBaseEvent);

        // Assert
        assert.strictEqual(this.oGetNestedMenuEntryByUidStub.callCount, 1, "_getNestedMenuEntryByUid was called once");
        assert.deepEqual(this.oPerformNavigationStub.firstCall.args, [oExpectedDestinationTarget], "The _performNavigation function was called with the right destination target.");
        assert.strictEqual(this.oOpenURLStub.callCount, 0, "The _openURL function was not called.");
    });

    QUnit.test("Handles menuEntry correctly if navigation type is 'URL'", function (assert) {
        // Arrange
        this.oGetParameterStub.withArgs("key").returns("ID-2");
        this.oGetNestedMenuEntryByUidStub.withArgs(this.aMenuMock, "ID-2").returns(this.oUrlEntryMock);

        var oExpectedDestinationTarget = {
            url: "https://sap.com"
        };

        // Act
        this.oController.onMenuItemSelection(this.oUIBaseEvent);

        // Assert
        assert.strictEqual(this.oGetNestedMenuEntryByUidStub.callCount, 1, "_getNestedMenuEntryByUid was called once");
        assert.deepEqual(this.oOpenURLStub.firstCall.args, [oExpectedDestinationTarget], "The _openURL function was called with the right destination target.");
        assert.strictEqual(this.oPerformNavigationStub.callCount, 0, "The _performNavigation function was not called.");
    });

    QUnit.test("Handles menuEntry correctly if the navigation type is not 'URL' or 'IBN'", function (assert) {
        // Arrange
        this.oGetParameterStub.withArgs("key").returns("ID-3");
        this.oGetNestedMenuEntryByUidStub.withArgs(this.aMenuMock, "ID-3").returns(this.oTextEntryMock);

        // Act
        this.oController.onMenuItemSelection(this.oUIBaseEvent);

        // Assert
        assert.strictEqual(this.oGetNestedMenuEntryByUidStub.callCount, 1, "_getNestedMenuEntryByUid was called once");
        assert.strictEqual(this.oOpenURLStub.callCount, 0, "The _openURL function was not called.");
        assert.strictEqual(this.oPerformNavigationStub.callCount, 0, "The _performNavigation function was not called.");
    });

    QUnit.module("The function _getNestedMenuEntry", {
        beforeEach: function () {
            this.aMenuEntriesMock = [
                { id: 1 },
                { id: 2, menuEntries: [{ id: 3 }] }
            ];
            this.oCheckStub = sandbox.stub();
            this.oCheckStub.withArgs(this.aMenuEntriesMock[1].menuEntries[0]).returns(true);
            this.oController = new MenuBarController();
        }
    });

    QUnit.test("Returns the correct result", function (assert) {
        // Arrange
        // Act
        var oResult = this.oController._getNestedMenuEntry(this.aMenuEntriesMock, this.oCheckStub);
        // Assert
        assert.strictEqual(oResult, this.aMenuEntriesMock[1].menuEntries[0], "Returned the correct result");
        assert.strictEqual(this.oCheckStub.callCount, 3, "check was called three times");
    });

    QUnit.test("Returns undefined if menu entry is not present", function (assert) {
        // Arrange
        this.oCheckStub.withArgs(sinon.match.any).returns(false);
        // Act
        var oResult = this.oController._getNestedMenuEntry(this.aMenuEntriesMock, this.oCheckStub);
        // Assert
        assert.strictEqual(oResult, undefined, "Returned undefined");
        assert.strictEqual(this.oCheckStub.callCount, 3, "check was called three times");
    });

    QUnit.module("The function _getNestedMenuEntryByUid", {
        beforeEach: function () {
            this.aMenuEntriesMock = [
                { id: 1, uid: "ID-1" },
                {
                    id: 2,
                    uid: "ID-1",
                    menuEntries: [
                        { id: 3, uid: "ID-2" },
                        { id: 4, uid: "ID-2" }
                    ]
                }
            ];
            this.oController = new MenuBarController();
        }
    });

    QUnit.test("Returns the first menu item if one or more are present in the first level", function (assert) {
        // Arrange
        var sUid = "ID-1";
        // Act
        var oResult = this.oController._getNestedMenuEntryByUid(this.aMenuEntriesMock, sUid);
        // Assert
        assert.strictEqual(oResult, this.aMenuEntriesMock[0], "Returned the correct result");
    });

    QUnit.test("Returns the first menu item if one or more are present in the second level", function (assert) {
        // Arrange
        var sUid = "ID-2";
        // Act
        var oResult = this.oController._getNestedMenuEntryByUid(this.aMenuEntriesMock, sUid);
        // Assert
        assert.strictEqual(oResult, this.aMenuEntriesMock[1].menuEntries[0], "Returned the correct result");
    });

    QUnit.test("Returns undefined if the key is not present in any level", function (assert) {
        // Arrange
        var sUid = "ID-3";
        // Act
        var oResult = this.oController._getNestedMenuEntryByUid(this.aMenuEntriesMock, sUid);
        // Assert
        assert.strictEqual(oResult, undefined, "Returned undefined");
    });

    QUnit.module("The function _performNavigation", {
        beforeEach: function () {
            this.oNavigateStub = sandbox.stub();
            this.oGetServiceAsyncStub = sandbox.stub();
            this.oNavigationService = {
                navigate: this.oNavigateStub
            };
            this.oGetServiceAsyncStub.withArgs("Navigation").resolves(this.oNavigationService);
            sandbox.stub(Container, "getServiceAsync").callsFake(this.oGetServiceAsyncStub);
            this.oController = new MenuBarController();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls 'navigate' of Navigation service with the right intent", function (assert) {
        // Arrange
        var oDestinationTarget = {
            semanticObject: "Launchpad",
            action: "openFLPPage",
            parameters: [
                { name: "spaceId", value: "Z_TEST_SPACE" },
                { name: "pageId", value: "Z_TEST_PAGE" }
            ]
        };

        var oExpectedIntent = {
            params: {
                pageId: [
                    "Z_TEST_PAGE"
                ],
                spaceId: [
                    "Z_TEST_SPACE"
                ]
            },
            target: {
                action: "openFLPPage",
                semanticObject: "Launchpad"
            }
        };

        // Act
        return this.oController._performNavigation(oDestinationTarget).then(function () {
            // Assert
            assert.deepEqual(this.oNavigateStub.firstCall.args, [oExpectedIntent], "The function calls 'navigate' of the Navigation service with the right intent.");
        }.bind(this));
    });

    QUnit.module("The function _openURL", {
        beforeEach: function () {
            this.oOpenStub = sandbox.stub(WindowUtils, "openURL");
            this.oController = new MenuBarController();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Opens the target URL in a new browser tab", function (assert) {
        // Act
        this.oController._openURL({
            url: "https://sap.com"
        });

        // Assert
        assert.deepEqual(this.oOpenStub.firstCall.args, ["https://sap.com", "_blank"], "The function opened the URL https://sap.com in a new browser tab.");
    });

    QUnit.module("The function _selectIndexAfterRouteChange", {
        beforeEach: function () {
            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oController = new MenuBarController();

            this.oGetHashStub = sandbox.stub();
            this.oGetHashStub.returns("some-intent");
            window.hasher = {
                getHash: this.oGetHashStub
            };

            this.oParseShellHashStub = sandbox.stub();
            this.oURLParsingService = {
                parseShellHash: this.oParseShellHashStub
            };
            this.oController.oURLParsingService = Promise.resolve(this.oURLParsingService);

            this.sSelectedKeyMock = "some-key";
            this.aMenuEntriesMock = [
                { id: "menu" }
            ];
            this.oMenuEntryMock = {
                uid: "some-id"
            };
            this.oSetPropertyStub = sandbox.stub();
            this.oGetModelStub = sandbox.stub();
            this.oGetModelStub.withArgs("viewConfiguration").returns({
                setProperty: this.oSetPropertyStub,
                getProperty: sandbox.stub().withArgs("/selectedKey").returns(this.sSelectedKeyMock)
            });
            this.oGetModelStub.withArgs("menu").returns({
                getProperty: sandbox.stub().withArgs("/").returns(this.aMenuEntriesMock)
            });
            this.oController.getView = function () {
                return {
                    getModel: this.oGetModelStub
                };
            }.bind(this);

            this.oGetMenuUIDStub = sandbox.stub(this.oController, "_getMenuUID");
            this.oGetHomeAppUIDStub = sandbox.stub(this.oController, "_getHomeAppUID");
            this.oGetNestedMenuEntryByUidStub = sandbox.stub(this.oController, "_getNestedMenuEntryByUid");
            this.oGetNestedMenuEntryByUidStub.withArgs(this.aMenuEntriesMock, this.sSelectedKeyMock).returns(this.oMenuEntryMock);
            this.oGetNestedMenuEntryByUidStub.withArgs(this.aMenuEntriesMock, this.oMenuEntryMock.uid).returns(this.oMenuEntryMock);
            this.oHasSpaceIdAndPageIdStub = sandbox.stub(this.oController, "_hasSpaceIdAndPageId");

            this.oGetOwnerComponentStub = sandbox.stub(this.oController, "getOwnerComponent").returns({
                oInitPromise: Promise.resolve()
            });
        },
        afterEach: function () {
            delete window.hasher;
            sandbox.restore();
        }
    });

    QUnit.test("Sets selectedKey to the ID of the users default page if the intent is Shell-home", function (assert) {
        // Arrange
        this.oGetHashStub.returns("Shell-home");
        this.oParseShellHashStub.returns({
            semanticObject: "Shell",
            action: "home"
        });
        this.oController.oGetDefaultSpacePromise = Promise.resolve({
            id: "ZTEST_SPACE",
            label: "ZTest space",
            type: ContentNodeType.Space,
            isContainer: false,
            children: [{
                id: "ZTEST_PAGE",
                label: "ZTest page",
                type: ContentNodeType.Page,
                isContainer: true,
                children: []
            }]
        });
        // ... Menu entry
        this.oGetMenuUIDStub.withArgs(sinon.match.any, "ZTEST_SPACE", "ZTEST_PAGE").returns(
            "menu-entry-ZTEST_SPACE"
        );

        // Act
        return this.oController._selectIndexAfterRouteChange().then(function () {
            // Assert
            assert.strictEqual(this.oSetPropertyStub.callCount, 1, "The setProperty function of the viewConfiguration model was called once.");
            assert.deepEqual(this.oSetPropertyStub.firstCall.args, ["/selectedKey", "menu-entry-ZTEST_SPACE"], "The selected key was set as expected.");
        }.bind(this));
    });

    QUnit.test("Sets selectedKey to the ID of the homeApp page if the intent is Shell-home and homeApp is enabled", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/homeApp/enabled").returns(true);
        this.oGetHashStub.returns("Shell-home");
        this.oParseShellHashStub.returns({
            semanticObject: "Shell",
            action: "home"
        });
        this.oGetHomeAppUIDStub.returns("menu-entry-home-app");

        // Act
        return this.oController._selectIndexAfterRouteChange().then(function () {
            // Assert
            assert.strictEqual(this.oSetPropertyStub.callCount, 1, "The setProperty function of the viewConfiguration model was called once.");
            assert.deepEqual(this.oSetPropertyStub.firstCall.args, ["/selectedKey", "menu-entry-home-app"], "The selected key was set as expected.");

            assert.strictEqual(this.oGetHomeAppUIDStub.callCount, 1, "_getHomeAppUID was called once");
            assert.strictEqual(this.oGetMenuUIDStub.callCount, 0, "_getMenuUID was not called");
        }.bind(this));
    });

    QUnit.test("Sets selectedKey to an empty string if the intent is Shell-home but there's no user default page in the default space.", function (assert) {
        // Arrange
        this.oGetHashStub.returns("Shell-home");
        this.oParseShellHashStub.returns({
            semanticObject: "Shell",
            action: "home"
        });
        this.oController.oGetDefaultSpacePromise = Promise.resolve({
            id: "EMPTY_SPACE",
            label: "Empty space",
            type: ContentNodeType.Space,
            isContainer: false,
            children: []
        });

        // Act
        return this.oController._selectIndexAfterRouteChange().then(function () {
            // Assert
            assert.strictEqual(this.oSetPropertyStub.callCount, 1, "The setProperty function of the viewConfiguration model was called once.");
            assert.deepEqual(this.oSetPropertyStub.firstCall.args, ["/selectedKey", ""], "The selected key was set to an empty string.");
            assert.deepEqual(this.oGetMenuUIDStub.callCount, 0, "The function '_getMenuUID' has not been called.");
        }.bind(this));
    });

    QUnit.test("Sets selectedKey to an empty string if the intent is Shell-home but the user default page has not been found in the menu entries.", function (assert) {
        // Arrange
        this.oGetHashStub.returns("Shell-home");
        this.oParseShellHashStub.returns({
            semanticObject: "Shell",
            action: "home"
        });
        this.oController.oGetDefaultSpacePromise = Promise.resolve({
            id: "ZTEST_SPACE",
            label: "ZTest space",
            type: ContentNodeType.Space,
            isContainer: false,
            children: [{
                id: "ZTEST_PAGE",
                label: "ZTest page",
                type: ContentNodeType.Page,
                isContainer: true,
                children: []
            }]
        });
        // ... ID of menu entry
        this.oGetMenuUIDStub.returns(undefined);

        // Act
        return this.oController._selectIndexAfterRouteChange().then(function () {
            // Assert
            assert.strictEqual(this.oSetPropertyStub.callCount, 1, "The setProperty function of the viewConfiguration model was called once.");
            assert.deepEqual(this.oSetPropertyStub.firstCall.args, ["/selectedKey", ""], "The selected key was set to an empty string.");
        }.bind(this));
    });

    QUnit.test("Sets selectedKey equal to 'None Existing Key' if a menu entry couldn't be determined for the provided space & page id", function (assert) {
        // Arrange
        this.oParseShellHashStub.returns({
            params: {
                "sap-ui-debug": [true]
            }
        });

        this.oGetMenuUIDStub.returns(undefined);

        // Act
        return this.oController._selectIndexAfterRouteChange().then(function () {
            // Assert
            assert.strictEqual(this.oSetPropertyStub.callCount, 1, "The setProperty function of the viewConfiguration model was called once.");
            assert.deepEqual(this.oSetPropertyStub.firstCall.args, ["/selectedKey", "None Existing Key"], "The selected key was set to 'None Existing Key'.");
        }.bind(this));
    });

    QUnit.test("Sets selectedKey equal to the right key", function (assert) {
        // Arrange
        this.oParseShellHashStub.returns({
            params: {
                spaceId: ["Z_TEST_SPACE"],
                pageId: ["Z_TEST_PAGE"]
            }
        });

        this.oGetMenuUIDStub.withArgs(this.aMenuEntriesMock, "Z_TEST_SPACE", "Z_TEST_PAGE").returns("ID-1");

        // Act
        return this.oController._selectIndexAfterRouteChange().then(function () {
            // Assert
            assert.strictEqual(this.oSetPropertyStub.callCount, 1, "The setProperty function of the viewConfiguration model was called once.");
            assert.deepEqual(this.oSetPropertyStub.firstCall.args, ["/selectedKey", "ID-1"], "The selected key was set to the correct menu entry UID.");
        }.bind(this));
    });

    QUnit.test("Prioritizes the last clicked key higher than a new search", function (assert) {
        // Arrange
        this.oParseShellHashStub.returns({
            params: {
                spaceId: ["Z_TEST_SPACE"],
                pageId: ["Z_TEST_PAGE"]
            }
        });
        this.oHasSpaceIdAndPageIdStub.withArgs(this.oMenuEntryMock, "Z_TEST_SPACE", "Z_TEST_PAGE").returns(true);
        // Act
        return this.oController._selectIndexAfterRouteChange().then(function () {
            // Assert
            assert.strictEqual(this.oSetPropertyStub.callCount, 1, "The setProperty function of the viewConfiguration model was called once.");
            assert.deepEqual(this.oSetPropertyStub.firstCall.args, ["/selectedKey", this.oMenuEntryMock.uid], "The selected key was set to the correct menu entry UID.");
        }.bind(this));
    });

    QUnit.module("The function _getMenuUID", {
        beforeEach: function () {
            this.aMenuEntriesMock = [{
                uid: "ID-1",
                target: {
                    parameters: [
                        { name: "spaceId", value: "Z_FIRST_SPACE" },
                        { name: "pageId", value: "Z_FIRST_PAGE" }
                    ]
                },
                menuEntries: []
            }, {
                uid: "ID-2",
                target: {
                    parameters: [
                        { name: "spaceId", value: "Z_SECOND_SPACE" },
                        { name: "pageId", value: "Z_SECOND_PAGE" }
                    ]
                },
                menuEntries: [{
                    uid: "ID-3",
                    target: {
                        parameters: [
                            { name: "spaceId", value: "Z_THIRD_SPACE" },
                            { name: "pageId", value: "Z_THIRD_PAGE" }
                        ]
                    },
                    menuEntries: []
                }, {
                    uid: "ID-4",
                    target: {
                        parameters: [
                            { name: "spaceId", value: "Z_THIRD_SPACE" },
                            { name: "pageId", value: "Z_THIRD_PAGE" }
                        ]
                    },
                    menuEntries: []
                }]
            }];
            this.oController = new MenuBarController();
        }
    });

    QUnit.test("Returns the UID of the menu entry which has a target with the matching space & page id parameters", function (assert) {
        // Act
        var sMenuEntryUID = this.oController._getMenuUID(this.aMenuEntriesMock, "Z_SECOND_SPACE", "Z_SECOND_PAGE");

        // Assert
        assert.strictEqual(sMenuEntryUID, "ID-2", "The function returned the correct menu UID: 'ID-2'.");
    });

    QUnit.test("Returns undefined if no matching menu entry could be found", function (assert) {
        // Act
        var sMenuEntryUID = this.oController._getMenuUID(this.aMenuEntriesMock, "Z_TEST_SPACE", "Z_SECOND_PAGE");

        // Assert
        assert.strictEqual(sMenuEntryUID, undefined, "The function returned undefined.");
    });

    QUnit.module("The function _getHomeAppUID", {
        beforeEach: function () {
            this.aMenuEntriesMock = [{
                uid: "ID-1",
                target: {
                    parameters: [
                        { name: "spaceId", value: "Z_SECOND_SPACE" },
                        { name: "pageId", value: "Z_SECOND_PAGE" }
                    ]
                },
                menuEntries: [{
                    uid: "ID-2",
                    target: {
                        parameters: [
                            { name: "spaceId", value: "Z_THIRD_SPACE" },
                            { name: "pageId", value: "Z_THIRD_PAGE" }
                        ]
                    },
                    menuEntries: []
                }]
            }];
            this.oHomeAppEntry = {
                uid: "ID-0",
                target: {
                    semanticObject: "Shell",
                    action: "home"
                },
                menuEntries: []
            };
            this.oController = new MenuBarController();
        }
    });

    QUnit.test("Returns undefined if no matching menu entry could be found", function (assert) {
        // Act
        var sMenuEntryUID = this.oController._getHomeAppUID(this.aMenuEntriesMock);

        // Assert
        assert.strictEqual(sMenuEntryUID, undefined, "Returned undefined.");
    });

    QUnit.test("Returns menu entry when added as first item", function (assert) {
        // Act
        this.aMenuEntriesMock.splice(0, 0, this.oHomeAppEntry);
        var sMenuEntryUID = this.oController._getHomeAppUID(this.aMenuEntriesMock);

        // Assert
        assert.strictEqual(sMenuEntryUID, "ID-0", "Returned correct uid.");
    });

    QUnit.test("Returns menu entry when added as nested item", function (assert) {
        // Act
        this.aMenuEntriesMock[0].menuEntries.push(this.oHomeAppEntry);
        var sMenuEntryUID = this.oController._getHomeAppUID(this.aMenuEntriesMock);

        // Assert
        assert.strictEqual(sMenuEntryUID, "ID-0", "Returned correct uid.");
    });

    QUnit.module("The function _hasSpaceIdAndPageId", {
        beforeEach: function () {
            this.oController = new MenuBarController();
        }
    });

    QUnit.test("Returns true if the parameters with correct values are present", function (assert) {
        // Arrange
        var oMenuEntry = {
            target: {
                parameters: [
                    { name: "spaceId", value: "ZSPACE1" },
                    { name: "pageId", value: "ZPAGE1" }
                ]
            }
        };
        // Act
        var bResult = this.oController._hasSpaceIdAndPageId(oMenuEntry, "ZSPACE1", "ZPAGE1");
        // Assert
        assert.strictEqual(bResult, true, "Returned the correct Result");
    });

    QUnit.test("Returns false if the parameters are not present", function (assert) {
        // Arrange
        var oMenuEntry = {
            target: {
                parameters: [
                    { name: "spaceId", value: "ZSPACE1" },
                    { name: "anotherParam", value: "ZPAGE1" }
                ]
            }
        };
        // Act
        var bResult = this.oController._hasSpaceIdAndPageId(oMenuEntry, "ZSPACE1", "ZPAGE1");
        // Assert
        assert.strictEqual(bResult, false, "Returned the correct Result");
    });

    QUnit.module("The _menuFactory function", {
        beforeEach: function () {
            this.oController = new MenuBarController();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the correct control for menu items", function (assert) {
        // Arrange
        var oData = {
            uid: "some-id",
            title: "someTitle",
            "help-id": "dataHelpId",
            menuEntries: [
                { id: "anotherMenuEntry" }
            ]
        };
        var oContext = new Context(new JSONModel(oData, "menu"), "/");

        // Act
        var oResult = this.oController._menuFactory("someId", oContext);

        // Assert
        assert.ok(oResult instanceof IconTabFilter, "Result is an IconTabFilter");
        assert.strictEqual(oResult.getId(), "someId", "Returned IconTabFilter has the expected id");
    });

    QUnit.test("Returns the correct control for a separator", function (assert) {
        // Arrange
        var oData = {
            type: "separator"
        };
        var oContext = new Context(new JSONModel(oData, "menu"), "/");

        // Act
        var oResult = this.oController._menuFactory("someId", oContext);

        // Assert
        assert.ok(oResult instanceof IconTabSeparator, "Result is an IconTabSeparator");
    });

    QUnit.module("The onExit function", {
        beforeEach: function () {
            this.oEventHubOffStub = sandbox.stub();

            this.oController = new MenuBarController();
            this.oController.oEventHubListener = {
                off: this.oEventHubOffStub
            };
        },
        afterEach: function () {
            this.oController.destroy();
        }
    });

    QUnit.test("Detaches EventHub Listener", function (assert) {
        //Arrange
        //Act
        this.oController.onExit();
        //Assert
        assert.strictEqual(this.oEventHubOffStub.callCount, 1, "off was called once");
    });
});
