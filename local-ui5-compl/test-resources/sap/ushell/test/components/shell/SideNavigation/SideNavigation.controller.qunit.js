// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.shell.SideNavigation.controller
 */
sap.ui.define([
    "sap/ui/core/EventBus",
    "sap/ui/model/Context",
    "sap/ui/model/json/JSONModel",
    "sap/tnt/NavigationListItem",
    "sap/ushell/components/shell/SideNavigation/controller/SideNavigation.controller",
    "sap/ushell/Container",
    "sap/ushell/EventHub",
    "sap/ushell/library",
    "sap/ushell/utils/UrlParsing",
    "sap/ushell/utils/WindowUtils"
], function (
    EventBus,
    Context,
    JSONModel,
    NavigationListItem,
    SideNavigationController,
    Container,
    EventHub,
    ushellLibrary,
    UrlParsing,
    WindowUtils
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
            this.oController = new SideNavigationController();
            sandbox.stub(this.oController, "byId").withArgs("sideNavigation").returns({
                addStyleClass: sandbox.stub()
            });


            this.oEventHubDoStub = sandbox.stub().returns({
                off: sandbox.stub()
            });
            this.oEventHubOnStub = sandbox.stub(EventHub, "on");
            this.oEventHubOnStub.withArgs("enableMenuBarNavigation").returns({
                do: this.oEventHubDoStub
            });
            this.oEventHubOnStub.withArgs("appOpened").returns({
                do: this.oEventHubDoStub
            });

            this.oEventBusSubscribeStub = sandbox.stub();
            this.oEventBusGetInstanceStub = sandbox.stub().returns({
                subscribe: this.oEventBusSubscribeStub
            });
            sandbox.stub(EventBus, "getInstance").callsFake(this.oEventBusGetInstanceStub);

            this.oAttachMatchedStub = sandbox.stub();
            this.oGetServiceAsyncStub = sandbox.stub();
            sandbox.stub(Container, "getServiceAsync").callsFake(this.oGetServiceAsyncStub);
            sandbox.stub(Container, "getRendererInternal").callsFake(sandbox.stub().returns({
                getRouter: sandbox.stub().returns({
                    getRoute: sandbox.stub().returns({
                        attachMatched: this.oAttachMatchedStub
                    })
                })
            }));

            this.oGetModelStub = sandbox.stub();
            this.oGetServiceAsyncStub.withArgs("Pages").resolves({
                getModel: this.oGetModelStub
            });

            this.oGetDefaultSpaceStub = sandbox.stub();
            this.oGetServiceAsyncStub.withArgs("Menu").resolves({
                getDefaultSpace: this.oGetDefaultSpaceStub
            });

            this.oSelectIndexAfterRouteChangeStub = sandbox.stub(this.oController, "_selectIndexAfterRouteChange");

            this.oSetModelStub = sandbox.stub();
            this.oSetPropertyStub = sandbox.stub();
            this.oGetModelStub = sandbox.stub();
            this.oGetModelStub.withArgs("viewConfiguration").returns({
                setProperty: this.oSetPropertyStub
            });
            this.oController.getView = sandbox.stub().returns({
                setModel: this.oSetModelStub,
                getModel: this.oGetModelStub
            });
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
            selectedKey: "NONE",
            enableSideNavigation: true
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

    QUnit.test("Attaches EventHub Listener and subscribes to EventBus event", function (assert) {
        //Act
        this.oController.onInit();

        //Assert
        assert.strictEqual(this.oEventHubOnStub.callCount, 1, "EventHub Listener was attached");

        assert.strictEqual(this.oEventBusSubscribeStub.callCount, 1, "EventBus subscription was made");
        assert.strictEqual(this.oEventBusSubscribeStub.getCall(0).args[0], "sap.ushell", "Correct EventBus channel was used");
        assert.strictEqual(this.oEventBusSubscribeStub.getCall(0).args[1], "appOpened", "Correct event name was used");
        assert.strictEqual(this.oEventBusSubscribeStub.getCall(0).args[2], this.oController.deselectSideNavigationEntryOnAppOpened, "Correct handler function was used");
        assert.strictEqual(this.oEventBusSubscribeStub.getCall(0).args[3], this.oController, "Correct context was used");
    });

    QUnit.module("The functions deselectSideNavigationEntryOnAppOpened and onEnableSideNavigation", {
        beforeEach: function () {
            this.oController = new SideNavigationController();
            this.oSetPropertyStub = sandbox.stub();
            this.oGetModelStub = sandbox.stub();
            this.oGetModelStub.withArgs("viewConfiguration").returns({
                setProperty: this.oSetPropertyStub
            });
            this.oController.getView = sandbox.stub().returns({
                getModel: this.oGetModelStub
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls the deselectSideNavigationEntryOnAppOpened event listener", function (assert) {
        //Act
        this.oController.deselectSideNavigationEntryOnAppOpened();

        //Assert
        assert.strictEqual(this.oSetPropertyStub.callCount, 1, "setProperty was called once");
        assert.deepEqual(this.oSetPropertyStub.getCall(0).args, ["/selectedKey", undefined], "setProperty was called with the correct parameter");
    });

    QUnit.test("Calls the onEnableSideNavigation event listener with parameter false", function (assert) {
        // Arrange
        const bEnableSideNavigation = false;

        //Act
        this.oController.onEnableSideNavigation(bEnableSideNavigation);

        //Assert
        assert.strictEqual(this.oSetPropertyStub.callCount, 1, "setProperty was called once");
        assert.deepEqual(this.oSetPropertyStub.getCall(0).args, ["/enableSideNavigation", false], "setProperty was called with the correct parameter");
    });

    QUnit.test("Calls the onEnableSideNavigation event listener with parameter true", function (assert) {
        // Arrange
        const bEnableSideNavigation = true;

        //Act
        this.oController.onEnableSideNavigation(bEnableSideNavigation);

        //Assert
        assert.strictEqual(this.oSetPropertyStub.callCount, 1, "setProperty was called once");
        assert.deepEqual(this.oSetPropertyStub.getCall(0).args, ["/enableSideNavigation", true], "setProperty was called with the correct parameter");
    });

    QUnit.module("The function onSideNavigationItemSelection", {
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
            this.oGetPropertyStub = sandbox.stub();
            this.oGetParameterStub = sandbox.stub();
            this.oGetParameterStub.withArgs("item").returns({
                getProperty: this.oGetPropertyStub
            });
            this.oGetPropertyStub.withArgs("/").returns(this.aMenuMock);
            this.oUIBaseEvent = {
                getParameter: this.oGetParameterStub
            };
            this.oController = new SideNavigationController();
            this.oController.getView = sandbox.stub().returns({
                getModel: sandbox.stub().returns({
                    getProperty: this.oGetPropertyStub
                })
            });
            this.oGetNestedSideNavigationEntryByUidStub = sandbox.stub(this.oController, "_getNestedSideNavigationEntryByUid");
            this.oPerformNavigationStub = sandbox.stub(this.oController, "_performNavigation");
            this.oOpenURLStub = sandbox.stub(this.oController, "_openURL");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Handles menuEntry correctly if the navigation type is 'IBN'", function (assert) {
        // Arrange
        this.oGetPropertyStub.withArgs("key").returns("ID-1");
        this.oGetNestedSideNavigationEntryByUidStub.withArgs(this.aMenuMock, "ID-1").returns(this.oCANEntryMock);

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
        this.oController.onSideNavigationItemSelection(this.oUIBaseEvent);

        // Assert
        assert.strictEqual(this.oGetNestedSideNavigationEntryByUidStub.callCount, 1, "_getNestedSideNavigationEntryByUid was called once");
        assert.deepEqual(this.oPerformNavigationStub.firstCall.args, [oExpectedDestinationTarget], "The _performNavigation function was called with the right destination target.");
        assert.strictEqual(this.oOpenURLStub.callCount, 0, "The _openURL function was not called.");
    });

    QUnit.test("Handles menuEntry correctly if navigation type is 'URL'", function (assert) {
        // Arrange
        this.oGetPropertyStub.withArgs("key").returns("ID-2");
        this.oGetNestedSideNavigationEntryByUidStub.withArgs(this.aMenuMock, "ID-2").returns(this.oUrlEntryMock);

        var oExpectedDestinationTarget = {
            url: "https://sap.com"
        };

        // Act
        this.oController.onSideNavigationItemSelection(this.oUIBaseEvent);

        // Assert
        assert.strictEqual(this.oGetNestedSideNavigationEntryByUidStub.callCount, 1, "_getNestedSideNavigationEntryByUid was called once");
        assert.deepEqual(this.oOpenURLStub.firstCall.args, [oExpectedDestinationTarget], "The _openURL function was called with the right destination target.");
        assert.strictEqual(this.oPerformNavigationStub.callCount, 0, "The _performNavigation function was not called.");
    });

    QUnit.test("Handles menuEntry correctly if the navigation type is not 'URL' or 'IBN'", function (assert) {
        // Arrange
        this.oGetPropertyStub.withArgs("key").returns("ID-3");
        this.oGetNestedSideNavigationEntryByUidStub.withArgs(this.aMenuMock, "ID-3").returns(this.oTextEntryMock);

        // Act
        this.oController.onSideNavigationItemSelection(this.oUIBaseEvent);

        // Assert
        assert.strictEqual(this.oGetNestedSideNavigationEntryByUidStub.callCount, 1, "_getNestedSideNavigationEntryByUid was called once");
        assert.strictEqual(this.oOpenURLStub.callCount, 0, "The _openURL function was not called.");
        assert.strictEqual(this.oPerformNavigationStub.callCount, 0, "The _performNavigation function was not called.");
    });

    QUnit.module("The function _getNestedSideNavigationEntry", {
        beforeEach: function () {
            this.aMenuEntriesMock = [
                { id: 1 },
                { id: 2, menuEntries: [{ id: 3 }] }
            ];
            this.oCheckStub = sandbox.stub();
            this.oCheckStub.withArgs(this.aMenuEntriesMock[1].menuEntries[0]).returns(true);
            this.oController = new SideNavigationController();
        }
    });

    QUnit.test("Returns the correct result", function (assert) {
        // Act
        var oResult = this.oController._getNestedSideNavigationEntry(this.aMenuEntriesMock, this.oCheckStub);

        // Assert
        assert.strictEqual(oResult, this.aMenuEntriesMock[1].menuEntries[0], "Returned the correct result");
        assert.strictEqual(this.oCheckStub.callCount, 3, "check was called three times");
    });

    QUnit.test("Returns undefined if menu entry is not present", function (assert) {
        // Arrange
        this.oCheckStub.withArgs(sinon.match.any).returns(false);

        // Act
        var oResult = this.oController._getNestedSideNavigationEntry(this.aMenuEntriesMock, this.oCheckStub);

        // Assert
        assert.strictEqual(oResult, undefined, "Returned undefined");
        assert.strictEqual(this.oCheckStub.callCount, 3, "check was called three times");
    });

    QUnit.module("The function _getNestedSideNavigationEntryByUid", {
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
            this.oController = new SideNavigationController();
        }
    });

    QUnit.test("Returns the first menu item if one or more are present in the first level", function (assert) {
        // Arrange
        var sUid = "ID-1";

        // Act
        var oResult = this.oController._getNestedSideNavigationEntryByUid(this.aMenuEntriesMock, sUid);

        // Assert
        assert.strictEqual(oResult, this.aMenuEntriesMock[0], "Returned the correct result");
    });

    QUnit.test("Returns the first menu item if one or more are present in the second level", function (assert) {
        // Arrange
        var sUid = "ID-2";

        // Act
        var oResult = this.oController._getNestedSideNavigationEntryByUid(this.aMenuEntriesMock, sUid);

        // Assert
        assert.strictEqual(oResult, this.aMenuEntriesMock[1].menuEntries[0], "Returned the correct result");
    });

    QUnit.test("Returns undefined if the key is not present in any level", function (assert) {
        // Arrange
        var sUid = "ID-3";

        // Act
        var oResult = this.oController._getNestedSideNavigationEntryByUid(this.aMenuEntriesMock, sUid);

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
            this.oController = new SideNavigationController();
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
            this.oController = new SideNavigationController();
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
            this.oController = new SideNavigationController();

            this.oGetHashStub = sandbox.stub();
            this.oGetHashStub.returns("some-intent");
            window.hasher = {
                getHash: this.oGetHashStub
            };

            this.oParseShellHashStub = sandbox.stub();
            sandbox.stub(UrlParsing, "parseShellHash").callsFake(this.oParseShellHashStub);

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
            this.oGetModelStub.withArgs("sideNavigation").returns({
                getProperty: sandbox.stub().withArgs("/").returns(this.aMenuEntriesMock)
            });
            this.oController.getView = sandbox.stub().returns({
                getModel: this.oGetModelStub
            });

            this.oGetMenuUIDStub = sandbox.stub(this.oController, "_getMenuUID");
            this._getNestedSideNavigationEntryByUid = sandbox.stub(this.oController, "_getNestedSideNavigationEntryByUid");
            this._getNestedSideNavigationEntryByUid.withArgs(this.aMenuEntriesMock, this.sSelectedKeyMock).returns(this.oMenuEntryMock);
            this._getNestedSideNavigationEntryByUid.withArgs(this.aMenuEntriesMock, this.oMenuEntryMock.uid).returns(this.oMenuEntryMock);
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

    QUnit.test("Sets selectedKey equal to \"NONE\" if a menu entry couldn't be determined for the provided space & page id", function (assert) {
        // Arrange
        this.oParseShellHashStub.returns({
            params: {
                "sap-ui-debug": [true]
            }
        });

        this.oGetMenuUIDStub.returns("NONE");

        // Act
        return this.oController._selectIndexAfterRouteChange().then(function () {
            // Assert
            assert.strictEqual(this.oSetPropertyStub.callCount, 1, "The setProperty function of the viewConfiguration model was called once.");
            assert.deepEqual(this.oSetPropertyStub.firstCall.args, ["/selectedKey", "NONE"], "The selected key was set to \"NONE\".");
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
            this.oController = new SideNavigationController();
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

    QUnit.module("The function _hasSpaceIdAndPageId", {
        beforeEach: function () {
            this.oController = new SideNavigationController();
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

    QUnit.module("The _sideNavigationFactory function", {
        beforeEach: function () {
            this.oController = new SideNavigationController();
            this.oResult = new NavigationListItem();
        },
        afterEach: function () {
            this.oResult.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Returns the correct control for menu items", function (assert) {
        // Arrange
        const oData = {
            uid: "some-id",
            title: "someTitle",
            "help-id": "dataHelpId",
            menuEntries: [
                { id: "anotherMenuEntry" }
            ]
        };
        const oContext = new Context(new JSONModel(oData, "sideNavigation"), "/");

        // Act
        this.oResult = this.oController._sideNavigationFactory("someId", oContext);

        // Assert
        assert.ok(this.oResult instanceof NavigationListItem, "Result is a NavigationListItem");
        assert.strictEqual(this.oResult.getId(), "someId", "Returned NavigationListItem has the expected id");
    });

    QUnit.test("Top level icon fallback - Correct fiori icon", function (assert) {
        // Arrange
        const oData = {
            uid: "some-id",
            title: "someTitle",
            "help-id": "dataHelpId",
            menuEntries: [
                { id: "anotherMenuEntry" }
            ],
            icon: "sap-icon://accept"
        };
        const oContext = new Context(new JSONModel(oData, "sideNavigation"), "/");

        // Act
        this.oResult = this.oController._sideNavigationFactory("someId", oContext);

        // Assert
        assert.strictEqual(this.oResult.getProperty("icon"), "sap-icon://accept", "Top level entry has the expected icon");
    });

    QUnit.test("Top level icon fallback - Undefined fiori icon", function (assert) {
        // Arrange
        const oData = {
            uid: "some-id",
            title: "someTitle",
            "help-id": "dataHelpId",
            menuEntries: [
                { id: "anotherMenuEntry" }
            ],
            icon: undefined
        };
        const oContext = new Context(new JSONModel(oData, "sideNavigation"), "/");

        // Act
        this.oResult = this.oController._sideNavigationFactory("someId", oContext);

        // Assert
        assert.strictEqual(this.oResult.getProperty("icon"), "sap-icon://document-text", "Top level entry has the expected fallback icon");
    });

    QUnit.test("Sub level icon fallback - Omit icon fallback", function (assert) {
        // Arrange
        const oData = {
            uid: "some-id",
            title: "someTitle",
            "help-id": "dataHelpId",
            menuEntries: [
                { id: "anotherMenuEntry" }
            ],
            icon: ""
        };
        const oContext = new Context(new JSONModel(oData, "sideNavigation"), "/0/menuEntries/1");

        // Act
        this.oResult = this.oController._sideNavigationFactory("someId", oContext);

        // Assert
        assert.strictEqual(this.oResult.getProperty("icon"), "", "Sub menu entry has no fallback icon");
    });

    QUnit.module("The onExit function", {
        beforeEach: function () {
            this.oEventHubOffStub = sandbox.stub();

            this.oController = new SideNavigationController();
            this.oController.oEnableMenuBarNavigationListener = {
                off: this.oEventHubOffStub
            };

            this.oEventBusUnsubscribeStub = sandbox.stub();
            this.oEventBusGetInstanceStub = sandbox.stub().returns({
                unsubscribe: this.oEventBusUnsubscribeStub
            });
            sandbox.stub(EventBus, "getInstance").callsFake(this.oEventBusGetInstanceStub);
        },
        afterEach: function () {
            this.oController.destroy();
        }
    });

    QUnit.test("Detaches EventHub Listener and unsubscribes from EventBus event", function (assert) {
        //Act
        this.oController.onExit();

        //Assert
        assert.strictEqual(this.oEventHubOffStub.callCount, 1, "off was called once to detach the EventHub listener");

        assert.strictEqual(this.oEventBusUnsubscribeStub.callCount, 1, "EventBus unsubscription was made");
        assert.strictEqual(this.oEventBusUnsubscribeStub.getCall(0).args[0], "sap.ushell", "Correct EventBus channel was used");
        assert.strictEqual(this.oEventBusUnsubscribeStub.getCall(0).args[1], "appOpened", "Correct event name was used");
        assert.strictEqual(this.oEventBusUnsubscribeStub.getCall(0).args[2], this.oController.deselectSideNavigationEntryOnAppOpened, "Correct handler function was used");
    });
});
