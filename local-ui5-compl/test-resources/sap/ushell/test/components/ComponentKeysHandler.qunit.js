// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.flp.launchpad.ComponentKeysHandler
 */
sap.ui.define([
    "sap/base/i18n/Localization",
    "sap/m/Page",
    "sap/ui/core/EventBus",
    "sap/ui/core/ResizeHandler",
    "sap/ui/events/KeyCodes",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/components/ComponentKeysHandler",
    "sap/ushell/ui/launchpad/DashboardGroupsContainer",
    "sap/ushell/ui/launchpad/Tile",
    "sap/ushell/ui/launchpad/TileContainer",
    "sap/ui/thirdparty/jquery",
    "sap/ui/qunit/utils/nextUIUpdate",
    "sap/ushell/Container"
], function (
    Localization,
    Page,
    EventBus,
    ResizeHandler,
    KeyCodes,
    JSONModel,
    ComponentKeysHandler,
    DashboardGroupsContainer,
    Tile,
    TileContainer,
    jQuery,
    nextUIUpdate,
    Container
) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    QUnit.module("ComponentKeysHandler", {
        beforeEach: function () {
            // prevent sideeffects from messing with the tests
            sandbox.stub(ResizeHandler, "register");

            sandbox.stub(Container, "getServiceAsync").withArgs("FlpLaunchPage").resolves({
                isLinkPersonalizationSupported: sandbox.stub().returns(true)
            });
            sandbox.stub(Container, "getLogonSystem").returns({
                getPlatform: sandbox.stub()
            });

            return ComponentKeysHandler.getInstance().then(function (ComponentKeysHandlerInstance) {
                this.ComponentKeysHandlerInstance = ComponentKeysHandlerInstance;
            }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("create a new instance of ComponentKeysHandler Class", function (assert) {
        var instance = ComponentKeysHandler;
        assert.ok(instance, "create a new instance");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("_goToFirstTileOfNextGroup:", function (assert) {
        [{
            sTestDescription: "direction is up and info is undefined",
            sDirection: "up",
            bExpectedGetNextGroupCalled: false,
            bExpectedGoToTileOfGroupCalled: false
        }, {
            sTestDescription: "direction is up and there is not a next group",
            sDirection: "up",
            oInfo: { oGroup: { id: "group1" } },
            bExpectedGetNextGroupCalled: true,
            bExpectedGoToTileOfGroupCalled: false
        }, {
            sTestDescription: "direction is up and there is a next group",
            sDirection: "up",
            oInfo: { oGroup: { id: "group2" } },
            oNextGroup: { id: "group1" },
            bExpectedGetNextGroupCalled: true,
            bExpectedGoToTileOfGroupCalled: true
        }, {
            sTestDescription: "direction is down and info is undefined",
            sDirection: "down",
            bExpectedGetNextGroupCalled: false,
            bExpectedGoToTileOfGroupCalled: false
        }, {
            sTestDescription: "direction is down and there is not a next group",
            sDirection: "down",
            oInfo: { oGroup: { id: "group1" } },
            bExpectedGetNextGroupCalled: true,
            bExpectedGoToTileOfGroupCalled: false
        }, {
            sTestDescription: "direction is down and there is a next group",
            sDirection: "down",
            oInfo: { oGroup: { id: "group1" } },
            oNextGroup: { id: "group2" },
            bExpectedGetNextGroupCalled: true,
            bExpectedGoToTileOfGroupCalled: true
        }].forEach(function (oFixture) {
            // Arrange
            var fnPreventDefaultStub = sandbox.stub(this.ComponentKeysHandlerInstance, "_preventDefault"),
                fnGetGroupAndTilesInfoStub = sandbox.stub(this.ComponentKeysHandlerInstance, "_getGroupAndTilesInfo").returns(oFixture.oInfo),
                fnGetNextGroupStub = sandbox.stub(this.ComponentKeysHandlerInstance, "_getNextGroup").returns(oFixture.oNextGroup),
                fnGoToTileOfGroupStub = sandbox.stub(this.ComponentKeysHandlerInstance, "_goToTileOfGroup");

            // Act
            this.ComponentKeysHandlerInstance._goToFirstTileOfNextGroup(oFixture.sDirection, undefined);

            // Assert
            assert.strictEqual(fnPreventDefaultStub.calledOnce, true,
                "_preventDefault was called once when " + oFixture.sTestDescription);
            assert.strictEqual(fnGetGroupAndTilesInfoStub.calledOnce, true,
                "_getGroupAndTilesInfo was called once when " + oFixture.sTestDescription);
            assert.strictEqual(fnGetNextGroupStub.calledOnce, oFixture.bExpectedGetNextGroupCalled,
                "_getNextGroup was called once when " + oFixture.sTestDescription);
            if (oFixture.bExpectedGetNextGroupCalled) {
                assert.strictEqual(fnGetNextGroupStub.args[0][0], oFixture.sDirection,
                    "1. argument of _getNextGroup was as expected " + oFixture.sTestDescription);
                assert.strictEqual(fnGetNextGroupStub.args[0][1], oFixture.oInfo.oGroup,
                    "2. argument of _getNextGroup was as expected " + oFixture.sTestDescription);
                assert.strictEqual(fnGetNextGroupStub.args[0][2], false,
                    "3. argument of _getNextGroup was as expected " + oFixture.sTestDescription);
                assert.strictEqual(fnGetNextGroupStub.args[0][3], true,
                    "4. argument of _getNextGroup was as expected " + oFixture.sTestDescription);
            }
            assert.strictEqual(fnGoToTileOfGroupStub.calledOnce, oFixture.bExpectedGoToTileOfGroupCalled,
                "_goToTileOfGroup was called once when " + oFixture.sTestDescription);
            if (oFixture.bExpectedGoToTileOfGroupCalled) {
                assert.strictEqual(fnGoToTileOfGroupStub.args[0][0], "first",
                    "1. argument of _goToTileOfGroup was as expected " + oFixture.sTestDescription);
                assert.strictEqual(fnGoToTileOfGroupStub.args[0][1], oFixture.oNextGroup,
                    "2. argument of _goToTileOfGroup was as expected " + oFixture.sTestDescription);
            }

            fnPreventDefaultStub.restore();
            fnGetGroupAndTilesInfoStub.restore();
            fnGetNextGroupStub.restore();
            fnGoToTileOfGroupStub.restore();
        }.bind(this));
    });

    /**
     * @deprecated since 1.118.
     */
    QUnit.test("_dashboardKeydownHandle:", function (assert) {
        var oEvent = {};

        [{
            sTestDescription: "after \"F2\" button was pressed",
            nKeyCode: 113, // F2
            sExpectedFunctionName: "_renameGroup"
        }, {
            sTestDescription: "after \"Delete\" button was pressed",
            nKeyCode: 46, // Delete
            sExpectedFunctionName: "_deleteButtonHandler"
        }, {
            sTestDescription: "after \"Backspace\" button was pressed",
            nKeyCode: 8, // Backspace
            sExpectedFunctionName: "_deleteButtonHandler"
        }, {
            sTestDescription: "after \"Arrow UP\" button was pressed",
            nKeyCode: 38, // Arrow UP
            sExpectedFunctionName: "_arrowsButtonsHandler",
            aExpectedArguments: ["up", oEvent]
        }, {
            sTestDescription: "after \"Arrow DOWN\" button was pressed",
            nKeyCode: 40, // Arrow DOWN
            sExpectedFunctionName: "_arrowsButtonsHandler",
            aExpectedArguments: ["down", oEvent]
        }, {
            sTestDescription: "after \"Arrow RIGHT\" button was pressed",
            nKeyCode: 39, // Arrow RIGHT
            sExpectedFunctionName: "_arrowsButtonsHandler",
            aExpectedArguments: ["right", oEvent]
        }, {
            sTestDescription: "after \"Arrow LEFT\" button was pressed",
            nKeyCode: 37, // Arrow LEFT
            sExpectedFunctionName: "_arrowsButtonsHandler",
            aExpectedArguments: ["left", oEvent]
        }, {
            sTestDescription: "after \"Arrow RIGHT\" button was pressed and user has RTL",
            nKeyCode: 39, // Arrow RIGHT
            bRTL: true,
            sExpectedFunctionName: "_arrowsButtonsHandler",
            aExpectedArguments: ["left", oEvent]
        }, {
            sTestDescription: "after \"Arrow LEFT\" button was pressed and user has RTL",
            nKeyCode: 37, // Arrow LEFT
            bRTL: true,
            sExpectedFunctionName: "_arrowsButtonsHandler",
            aExpectedArguments: ["right", oEvent]
        }, {
            sTestDescription: "after \"Page UP\" button was pressed",
            nKeyCode: 33, // Page UP
            sExpectedFunctionName: "_goToFirstTileOfNextGroup",
            aExpectedArguments: ["up", oEvent]
        }, {
            sTestDescription: "after \"Page DOWN\" button was pressed",
            nKeyCode: 34, // Page DOWN
            sExpectedFunctionName: "_goToFirstTileOfNextGroup",
            aExpectedArguments: ["down", oEvent]
        }, {
            sTestDescription: "after \"HOME\" button was pressed",
            nKeyCode: 36, // HOME
            sExpectedFunctionName: "_homeEndButtonsHandler",
            aExpectedArguments: ["first", oEvent]
        }, {
            sTestDescription: "after \"END\" button was pressed",
            nKeyCode: 35, // END
            sExpectedFunctionName: "_homeEndButtonsHandler",
            aExpectedArguments: ["last", oEvent]
        }, {
            sTestDescription: "after \"SPACE\" button was pressed",
            nKeyCode: 32, // SPACE
            sExpectedFunctionName: "_spaceButtonHandler",
            aExpectedArguments: [oEvent]
        }, {
            sTestDescription: "after \"ENTER\" button was pressed",
            nKeyCode: 13, // ENTER
            sExpectedFunctionName: "_spaceButtonHandler"
        }].forEach(function (oFixture) {
            // Arrange
            var fnStub = sandbox.stub(this.ComponentKeysHandlerInstance, oFixture.sExpectedFunctionName);
            var fnGetRTLStub = sandbox.stub(Localization, "getRTL").returns(oFixture.bRTL);

            oEvent.keyCode = oFixture.nKeyCode;

            // Act
            this.ComponentKeysHandlerInstance._dashboardKeydownHandler(oEvent);

            // Assert
            assert.strictEqual(fnStub.calledOnce, true, oFixture.sExpectedFunctionName + " was called as expected " + oFixture.sTestDescription);
            if (oFixture.aExpectedArguments) {
                for (var i = 0; i < oFixture.aExpectedArguments.length; i++) {
                    assert.strictEqual(fnStub.args[0][i], oFixture.aExpectedArguments[i],
                        "argument " + i + " was given as expected " + oFixture.sTestDescription);
                }
            }

            fnStub.restore();
            fnGetRTLStub.restore();
        }.bind(this));
    });

    QUnit.test("handleFocusOnMe (spaces & pages):", function (assert) {
        [{
            sTestDescription: "a different current core view is given",
            sCurrentCoreView: "something",
            bExpectedGoToLastVisitedTile: false,
            bExpectedGoToSelectedAnchorNavigationItem: false,
            bExpectedDashboardKeydownHandler: false,
            bExpectedSetFocusOnCatalogTile: false,
            bExpectedAppFinderFocusMenuButtons: false,
            bExpectedAppFinderKeydownHandler: false
        }, {
            sTestDescription: "no current core view is given",
            bExpectedGoToLastVisitedTile: false,
            bExpectedGoToSelectedAnchorNavigationItem: false,
            bExpectedDashboardKeydownHandler: false,
            bExpectedSetFocusOnCatalogTile: false,
            bExpectedAppFinderFocusMenuButtons: false,
            bExpectedAppFinderKeydownHandler: false
        }, {
            sTestDescription: "appFinder is the current core view",
            sCurrentCoreView: "appFinder",
            bExpectedGoToLastVisitedTile: false,
            bExpectedGoToSelectedAnchorNavigationItem: false,
            bExpectedDashboardKeydownHandler: false,
            bExpectedSetFocusOnCatalogTile: false,
            bExpectedAppFinderFocusMenuButtons: false,
            bExpectedAppFinderKeydownHandler: true
        }, {
            sTestDescription: "appFinder is the current core view and we pass the first time",
            sCurrentCoreView: "appFinder",
            bFocusPassedFirstTime: true,
            bExpectedGoToLastVisitedTile: false,
            bExpectedGoToSelectedAnchorNavigationItem: false,
            bExpectedDashboardKeydownHandler: false,
            bExpectedSetFocusOnCatalogTile: false,
            bExpectedAppFinderFocusMenuButtons: true,
            bExpectedAppFinderKeydownHandler: false
        }, {
            sTestDescription: "appFinder is the current core view, we pass the first time and shift is pressed",
            sCurrentCoreView: "appFinder",
            bFocusPassedFirstTime: true,
            bShift: true,
            bExpectedGoToLastVisitedTile: false,
            bExpectedGoToSelectedAnchorNavigationItem: false,
            bExpectedDashboardKeydownHandler: false,
            bExpectedSetFocusOnCatalogTile: true,
            bExpectedAppFinderFocusMenuButtons: false,
            bExpectedAppFinderKeydownHandler: false
        }].forEach(function (oFixture) {
            // Arrange
            var oRendererInternalStub = sandbox.stub(Container, "getRendererInternal").returns({
                getCurrentCoreView: function () {
                    return oFixture.sCurrentCoreView;
                }
            });

            var oEvent = { shiftKey: oFixture.bShift };

            var fnGTLVTStub = sandbox.stub(this.ComponentKeysHandlerInstance, "goToLastVisitedTile"),
                fnGTSANIStub = sandbox.stub(this.ComponentKeysHandlerInstance, "goToSelectedAnchorNavigationItem").returns(
                    oFixture.bAnchorItemSelected
                ),
                fnSFOCT = sandbox.stub(this.ComponentKeysHandlerInstance, "setFocusOnCatalogTile"),
                fnAFFMB = sandbox.stub(this.ComponentKeysHandlerInstance, "appFinderFocusMenuButtons"),
                fnAFKH = sandbox.stub(this.ComponentKeysHandlerInstance, "_appFinderKeydownHandler");

            // Act
            this.ComponentKeysHandlerInstance.handleFocusOnMe(oEvent, oFixture.bFocusPassedFirstTime);

            // Assert
            assert.strictEqual(fnGTLVTStub.calledOnce, oFixture.bExpectedGoToLastVisitedTile,
                "goToLastVisitedTile was (not) called as expected when " + oFixture.sTestDescription);
            assert.strictEqual(fnGTSANIStub.calledOnce, oFixture.bExpectedGoToSelectedAnchorNavigationItem,
                "goToSelectedAnchorNavigationItem was (not) called as expected when " + oFixture.sTestDescription);
            assert.strictEqual(fnSFOCT.calledOnce, oFixture.bExpectedSetFocusOnCatalogTile,
                "setFocusOnCatalogTile was (not) called as expected when " + oFixture.sTestDescription);
            assert.strictEqual(fnAFFMB.calledOnce, oFixture.bExpectedAppFinderFocusMenuButtons,
                "appFinderFocusMenuButtons was (not) called as expected when " + oFixture.sTestDescription);
            assert.strictEqual(fnAFKH.calledOnce, oFixture.bExpectedAppFinderKeydownHandler,
                "_appFinderKeydownHandler was (not) called as expected when " + oFixture.sTestDescription);

            oRendererInternalStub.restore();
            fnGTLVTStub.restore();
            fnGTSANIStub.restore();
            fnSFOCT.restore();
            fnAFFMB.restore();
            fnAFKH.restore();
        }.bind(this));
    });

    /**
     * @deprecated since 1.118.
     */
    QUnit.test("handleFocusOnMe (classic homepage):", function (assert) {
        [{
            sTestDescription: "home is the current core view",
            sCurrentCoreView: "home",
            bExpectedGoToLastVisitedTile: false,
            bExpectedGoToSelectedAnchorNavigationItem: false,
            bExpectedDashboardKeydownHandler: true,
            bExpectedSetFocusOnCatalogTile: false,
            bExpectedAppFinderFocusMenuButtons: false,
            bExpectedAppFinderKeydownHandler: false
        }].forEach(function (oFixture) {
            // Arrange
            var oRendererInternalStub = sandbox.stub(Container, "getRendererInternal").returns({
                getCurrentCoreView: function () {
                    return oFixture.sCurrentCoreView;
                }
            });

            var oEvent = { shiftKey: oFixture.bShift };

            var fnGTLVTStub = sandbox.stub(this.ComponentKeysHandlerInstance, "goToLastVisitedTile"),
                fnGTSANIStub = sandbox.stub(this.ComponentKeysHandlerInstance, "goToSelectedAnchorNavigationItem").returns(
                    oFixture.bAnchorItemSelected
                ),
                fnDKHStub = sandbox.stub(this.ComponentKeysHandlerInstance, "_dashboardKeydownHandler"),
                fnSFOCT = sandbox.stub(this.ComponentKeysHandlerInstance, "setFocusOnCatalogTile"),
                fnAFFMB = sandbox.stub(this.ComponentKeysHandlerInstance, "appFinderFocusMenuButtons"),
                fnAFKH = sandbox.stub(this.ComponentKeysHandlerInstance, "_appFinderKeydownHandler");

            // Act
            this.ComponentKeysHandlerInstance.handleFocusOnMe(oEvent, oFixture.bFocusPassedFirstTime);

            // Assert
            assert.strictEqual(fnGTLVTStub.calledOnce, oFixture.bExpectedGoToLastVisitedTile,
                "goToLastVisitedTile was (not) called as expected when " + oFixture.sTestDescription);
            assert.strictEqual(fnGTSANIStub.calledOnce, oFixture.bExpectedGoToSelectedAnchorNavigationItem,
                "goToSelectedAnchorNavigationItem was (not) called as expected when " + oFixture.sTestDescription);
            assert.strictEqual(fnDKHStub.calledOnce, oFixture.bExpectedDashboardKeydownHandler,
                "_dashboardKeydownHandler was (not) called as expected when " + oFixture.sTestDescription);
            assert.strictEqual(fnSFOCT.calledOnce, oFixture.bExpectedSetFocusOnCatalogTile,
                "setFocusOnCatalogTile was (not) called as expected when " + oFixture.sTestDescription);
            assert.strictEqual(fnAFFMB.calledOnce, oFixture.bExpectedAppFinderFocusMenuButtons,
                "appFinderFocusMenuButtons was (not) called as expected when " + oFixture.sTestDescription);
            assert.strictEqual(fnAFKH.calledOnce, oFixture.bExpectedAppFinderKeydownHandler,
                "_appFinderKeydownHandler was (not) called as expected when " + oFixture.sTestDescription);

            oRendererInternalStub.restore();
            fnGTLVTStub.restore();
            fnGTSANIStub.restore();
            fnDKHStub.restore();
            fnSFOCT.restore();
            fnAFFMB.restore();
            fnAFKH.restore();
        }.bind(this));
    });
    /**
     * @deprecated since 1.119
     * Dedicated to the classic homepage
     */
    (function () {
        [{
            sTestDescription: "Some key is pressed",
            iKey: 35, // End
            bExpectedFocusOnTileContainerHeader: false
        }, {
            sTestDescription: "Enter key is pressed",
            iKey: 13, // Enter
            bExpectedFocusOnTileContainerHeader: true
        }].forEach(function (oFixture) {
            QUnit.test("handleFocusOnMe when inside an input field when " + oFixture.sTestDescription, function (assert) {
                // Arrange
                var oRendererInternalStub = sandbox.stub(Container, "getRendererInternal").returns({
                    getCurrentCoreView: sandbox.stub().returns("home")
                });

                var done = assert.async();
                var oEvent = { keyCode: oFixture.iKey },
                    oTileContainerHeader = window.document.createElement("div"),
                    oInput = window.document.createElement("input"),
                    oQunitFixture = window.document.getElementById("qunit-fixture");

                oTileContainerHeader.classList.add("sapUshellTileContainerHeader");
                oTileContainerHeader.setAttribute("tabindex", "0");
                oTileContainerHeader.setAttribute("id", "someId");
                oInput.setAttribute("tabindex", "0");
                oTileContainerHeader.appendChild(oInput);
                oQunitFixture.appendChild(oTileContainerHeader);
                oInput.focus();

                // Act
                this.ComponentKeysHandlerInstance.handleFocusOnMe(oEvent, false);

                // Assert
                window.setTimeout(function () {
                    if (oFixture.bExpectedFocusOnTileContainerHeader) {
                        assert.strictEqual(window.document.activeElement, oTileContainerHeader,
                            "focus was set on the tile container header");
                    } else {
                        assert.strictEqual(window.document.activeElement, oInput, "focus remains on the input");
                    }
                    oRendererInternalStub.restore();
                    oQunitFixture.removeChild(oTileContainerHeader);

                    done();
                }, 100);
            });
            QUnit.test("_dashboardKeydownHandler is not called on handleFocusOnMe when inside an input field when " + oFixture.sTestDescription, function (assert) {
                // Arrange
                var oRendererInternalStub = sandbox.stub(Container, "getRendererInternal").returns({
                    getCurrentCoreView: sandbox.stub().returns("home")
                });

                var done = assert.async();
                var fnDKHStub = sandbox.stub(this.ComponentKeysHandlerInstance, "_dashboardKeydownHandler");
                var oEvent = { keyCode: oFixture.iKey },
                    oTileContainerHeader = window.document.createElement("div"),
                    oInput = window.document.createElement("input"),
                    oQunitFixture = window.document.getElementById("qunit-fixture");

                oTileContainerHeader.classList.add("sapUshellTileContainerHeader");
                oTileContainerHeader.setAttribute("tabindex", "0");
                oTileContainerHeader.setAttribute("id", "someId");
                oInput.setAttribute("tabindex", "0");
                oTileContainerHeader.appendChild(oInput);
                oQunitFixture.appendChild(oTileContainerHeader);
                oInput.focus();

                // Act
                this.ComponentKeysHandlerInstance.handleFocusOnMe(oEvent, false);

                // Assert
                window.setTimeout(function () {
                    assert.strictEqual(fnDKHStub.callCount, 0, "_dashboardKeydownHandler was not called");

                    oRendererInternalStub.restore();
                    fnDKHStub.restore();
                    oQunitFixture.removeChild(oTileContainerHeader);

                    done();
                }, 100);
            });
        });
    })();

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("test anchor-navigation-bar, navigation between items:", function (assert) {
        [{
            sTestDescription: "after the right-arrow key was pressed",
            sDirection: "right",
            sExpectedFocusedElementId: "sapUshellAnchorBarOverflowButton"
        }, {
            sTestDescription: "after the down-arrow key was pressed",
            sDirection: "down",
            sExpectedFocusedElementId: "sapUshellAnchorBarOverflowButton"
        }, {
            sTestDescription: "after the left-arrow key was pressed",
            sDirection: "left",
            sExpectedFocusedElementId: "jqAnchorItem2"
        }, {
            sTestDescription: "after the up-arrow key was pressed",
            sDirection: "up",
            sExpectedFocusedElementId: "jqAnchorItem2"
        }].forEach(function (oFixture) {
            var oAnchorItem1 = document.createElement("div");
            oAnchorItem1.setAttribute("id", "jqAnchorItem1");
            oAnchorItem1.setAttribute("tabindex", "0");
            oAnchorItem1.classList.add("sapUshellAnchorItem");
            oAnchorItem1.style.height = "1rem";
            oAnchorItem1.style.width = "0";
            document.body.appendChild(oAnchorItem1);

            var oAnchorItem2 = document.createElement("div");
            oAnchorItem2.setAttribute("id", "jqAnchorItem2");
            oAnchorItem2.setAttribute("tabindex", "0");
            oAnchorItem2.classList.add("sapUshellAnchorItem");
            oAnchorItem2.style.height = "1rem";
            oAnchorItem2.style.width = "0";
            document.body.appendChild(oAnchorItem2);

            var oAnchorItem3 = document.createElement("div");
            oAnchorItem3.setAttribute("id", "jqAnchorItem3");
            oAnchorItem3.setAttribute("tabindex", "0");
            oAnchorItem3.classList.add("sapUshellAnchorItem");
            oAnchorItem3.style.height = "1rem";
            oAnchorItem3.style.width = "0";
            document.body.appendChild(oAnchorItem3);

            var oOverflowButton = document.createElement("button");
            oAnchorItem3.setAttribute("id", "sapUshellAnchorBarOverflowButton");
            oAnchorItem3.setAttribute("tabindex", "0");
            oAnchorItem3.classList.add("sapUshellAnchorItem");
            oAnchorItem3.style.height = "1rem";
            oAnchorItem3.style.width = "0";
            document.body.appendChild(oOverflowButton);

            oAnchorItem3.focus();
            this.ComponentKeysHandlerInstance._handleAnchorNavigationItemsArrowKeys(oFixture.sDirection, jQuery(oAnchorItem3));
            assert.strictEqual(document.activeElement.getAttribute("id"), oFixture.sExpectedFocusedElementId,
                "The focus has been moved correctly " + oFixture.sTestDescription);

            document.body.removeChild(oAnchorItem1);
            document.body.removeChild(oAnchorItem2);
            document.body.removeChild(oAnchorItem3);
            document.body.removeChild(oOverflowButton);
        }.bind(this));
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("test anchor-navigation-bar, navigation to overflow button:", function (assert) {
        [{
            sTestDescription: "after the right-arrow key was pressed",
            sDirection: "right",
            sExpectedFocusedElementId: "jqAnchorItem3"
        }, {
            sTestDescription: "after the down-arrow key was pressed",
            sDirection: "down",
            sExpectedFocusedElementId: "jqAnchorItem3"
        }, {
            sTestDescription: "after the left-arrow key was pressed",
            sDirection: "left",
            sExpectedFocusedElementId: "jqAnchorItem1"
        }, {
            sTestDescription: "after the up-arrow key was pressed",
            sDirection: "up",
            sExpectedFocusedElementId: "jqAnchorItem1"
        }].forEach(function (oFixture) {
            var oAnchorItem1 = document.createElement("div");
            oAnchorItem1.setAttribute("id", "jqAnchorItem1");
            oAnchorItem1.setAttribute("tabindex", "0");
            oAnchorItem1.classList.add("sapUshellAnchorItem");
            oAnchorItem1.style.height = "1rem";
            oAnchorItem1.style.width = "0";
            document.body.appendChild(oAnchorItem1);

            var oAnchorItem2 = document.createElement("div");
            oAnchorItem2.setAttribute("id", "jqAnchorItem2");
            oAnchorItem2.setAttribute("tabindex", "0");
            oAnchorItem2.classList.add("sapUshellAnchorItem");
            oAnchorItem2.style.height = "1rem";
            oAnchorItem2.style.width = "0";
            document.body.appendChild(oAnchorItem2);

            var oAnchorItem3 = document.createElement("div");
            oAnchorItem3.setAttribute("id", "jqAnchorItem3");
            oAnchorItem3.setAttribute("tabindex", "0");
            oAnchorItem3.classList.add("sapUshellAnchorItem");
            oAnchorItem3.style.height = "1rem";
            oAnchorItem3.style.width = "0";
            document.body.appendChild(oAnchorItem3);

            oAnchorItem2.focus();
            this.ComponentKeysHandlerInstance._handleAnchorNavigationItemsArrowKeys(oFixture.sDirection, jQuery(oAnchorItem2));
            assert.strictEqual(document.activeElement.getAttribute("id"), oFixture.sExpectedFocusedElementId,
                "The focus has been moved correctly " + oFixture.sTestDescription);

            document.body.removeChild(oAnchorItem1);
            document.body.removeChild(oAnchorItem2);
            document.body.removeChild(oAnchorItem3);
        }.bind(this));
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.module("goToLastVisitedTile", {
        beforeEach: async function () {
            sandbox.stub(Container, "getServiceAsync").withArgs("FlpLaunchPage").resolves({
                isLinkPersonalizationSupported: sandbox.stub().returns(true)
            });

            sandbox.stub(Container, "getLogonSystem").returns({
                getPlatform: sandbox.stub()
            });

            this.oGroup1 = new TileContainer({
                tiles: [
                    new Tile(),
                    new Tile()
                ]
            });
            this.oGroup2 = new TileContainer({
                tiles: [
                    new Tile("tile1_1"),
                    new Tile()
                ]
            });
            this.oDashboard = new DashboardGroupsContainer("dashboardGroups", {
                groups: [
                    this.oGroup1,
                    this.oGroup2
                ]
            }).placeAt("qunit-fixture");

            await nextUIUpdate();

            // enforce re-initalization
            ComponentKeysHandler._instance = undefined;
            return ComponentKeysHandler.getInstance().then(function (ComponentKeysHandlerInstance) {
                this.ComponentKeysHandlerInstance = ComponentKeysHandlerInstance;
                this.ComponentKeysHandlerInstance.oModel = new JSONModel({ topGroupInViewPortIndex: 0 });
                this.fnMoveScrollDashboardStub = sandbox.stub(this.ComponentKeysHandlerInstance, "moveScrollDashboard");
            }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
            this.oDashboard.destroy();
        }
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("no tabindex is set", function (assert) {
        // Arrange
        var sExpectedTileId = this.oGroup1.getTiles()[0].getId();

        // Act
        this.ComponentKeysHandlerInstance.goToLastVisitedTile();

        // Assert
        assert.strictEqual(this.fnMoveScrollDashboardStub.callCount, 1, "moveScrollDashboard was called exactly once.");
        assert.strictEqual(this.fnMoveScrollDashboardStub.args[0][0][0].id, sExpectedTileId, "focus has been set on the correct tile");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("no tabindex is set and a group is given", function (assert) {
        // Arrange
        var sExpectedTileId = this.oGroup2.getTiles()[0].getId();

        // Act
        this.ComponentKeysHandlerInstance.goToLastVisitedTile(this.oGroup2.$(), true);

        // Assert
        assert.strictEqual(this.fnMoveScrollDashboardStub.callCount, 1, "moveScrollDashboard was called exactly once.");
        assert.strictEqual(this.fnMoveScrollDashboardStub.args[0][0][0].id, sExpectedTileId, "focus has been set on the correct tile");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("a tabindex is set and no group is given", function (assert) {
        // Arrange
        var sExpectedTileId = this.oGroup2.getTiles()[1].getId();
        this.ComponentKeysHandlerInstance._setTileFocus(this.oGroup2.getTiles()[1].getDomRef());

        // Act
        this.ComponentKeysHandlerInstance.goToLastVisitedTile();

        // Assert
        assert.strictEqual(this.fnMoveScrollDashboardStub.callCount, 1, "moveScrollDashboard was called exactly once.");
        assert.strictEqual(this.fnMoveScrollDashboardStub.args[0][0][0].id, sExpectedTileId, "focus has been set on the correct tile");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("a tabindex is set and a different group is given", function (assert) {
        // Arrange
        var sExpectedTileId = this.oGroup1.getTiles()[0].getId();
        this.ComponentKeysHandlerInstance._setTileFocus(this.oGroup2.getTiles()[1].getDomRef());

        // Act
        this.ComponentKeysHandlerInstance.goToLastVisitedTile(this.oGroup1.$(), true);

        // Assert
        assert.strictEqual(this.fnMoveScrollDashboardStub.callCount, 1, "moveScrollDashboard was called exactly once.");
        assert.strictEqual(this.fnMoveScrollDashboardStub.args[0][0][0].id, sExpectedTileId, "focus has been set on the correct tile");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("a tabindex is set and the correct group is given", function (assert) {
        // Arrange
        var sExpectedTileId = this.oGroup2.getTiles()[1].getId();
        this.ComponentKeysHandlerInstance._setTileFocus(this.oGroup2.getTiles()[1].getDomRef());

        // Act
        this.ComponentKeysHandlerInstance.goToLastVisitedTile(this.oGroup2.$(), true);

        // Assert
        assert.strictEqual(this.fnMoveScrollDashboardStub.callCount, 1, "moveScrollDashboard was called exactly once.");
        assert.strictEqual(this.fnMoveScrollDashboardStub.args[0][0][0].id, sExpectedTileId, "focus has been set on the correct tile");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.module("_getGroupAndTilesInfo", {
        beforeEach: async function () {
            sandbox.stub(Container, "getServiceAsync").withArgs("FlpLaunchPage").resolves({
                isLinkPersonalizationSupported: sandbox.stub().returns(true)
            });

            sandbox.stub(Container, "getLogonSystem").returns({
                getPlatform: sandbox.stub()
            });

            this.oTile = new Tile();
            this.oGroup = new TileContainer("group", {
                tiles: [
                    this.oTile
                ]
            });
            this.oDashboard = new DashboardGroupsContainer("dashboardGroups", {
                groups: [
                    this.oGroup
                ]
            }).placeAt("qunit-fixture");

            await nextUIUpdate();

            return ComponentKeysHandler.getInstance().then(function (ComponentKeysHandlerInstance) {
                this.ComponentKeysHandlerInstance = ComponentKeysHandlerInstance;
            }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
            this.oDashboard.destroy();
        }
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("no tile is focused", function (assert) {
        // Arrange
        this.oDashboard.focus();

        // Act
        var oResult = this.ComponentKeysHandlerInstance._getGroupAndTilesInfo();

        // Assert
        assert.deepEqual(oResult, null, "the result was as expected");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("a tile is focused", function (assert) {
        // Arrange
        this.oTile.focus();
        var oExpectedResult = {
            oCurTile: this.oTile,
            oGroup: this.oGroup
        };

        // Act
        var oResult = this.ComponentKeysHandlerInstance._getGroupAndTilesInfo();

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "the result was as expected");
    });

    /**
     * @deprecated since 1.119
     * Dedicated to the classic homepage
     */
    QUnit.module("moving tiles with the keyboard", {
        beforeEach: async function () {
            sandbox.stub(Container, "getServiceAsync").withArgs("FlpLaunchPage").resolves({
                isLinkPersonalizationSupported: sandbox.stub().returns(true)
            });
            sandbox.stub(Container, "getLogonSystem").returns({
                getPlatform: sandbox.stub()
            });
            sandbox.stub(Container, "getRendererInternal").returns({
                getCurrentCoreView: sandbox.stub().returns("home")
            });

            this.oTile00 = new Tile("tile00");
            sandbox.stub(this.oTile00, "getBindingContext").returns({
                getObject: function () {
                    return {
                        object: "FakeTile00"
                    };
                }
            });
            this.oTile01 = new Tile("tile01");
            this.oTile02 = new Tile("tile02");

            this.oTileContainer0 = new TileContainer({
                groupId: "tc0",
                tiles: [
                    this.oTile00,
                    this.oTile01,
                    this.oTile02
                ]
            });

            this.oTile10 = new Tile("tile10");
            this.oTile11 = new Tile("tile11");

            this.oTileContainer1 = new TileContainer({
                groupId: "tc1",
                tiles: [
                    this.oTile10,
                    this.oTile11
                ]
            });

            this.oDashboardPage = new Page("sapUshellDashboardPage", {
                content: [
                    new DashboardGroupsContainer({
                        groups: [
                            this.oTileContainer0,
                            this.oTileContainer1
                        ]
                    })
                ]
            }).placeAt("qunit-fixture");

            await nextUIUpdate();

            this._getTileUuid = sandbox.stub();

            sandbox.stub(this.oDashboardPage, "getParent").returns({
                getController: sandbox.stub().returns({
                    _getTileUuid: this._getTileUuid
                })
            });

            this.oMovetileStub = sandbox.stub();
            this.oConvertTileStub = sandbox.stub();
            this.oEventBus = EventBus.getInstance();
            this.oEventBus.subscribe("launchpad", "movetile", this.oMovetileStub, this);
            this.oEventBus.subscribe("launchpad", "convertTile", this.oConvertTileStub, this);

            return ComponentKeysHandler.getInstance().then(function (ComponentKeysHandlerInstance) {
                this.ComponentKeysHandlerInstance = ComponentKeysHandlerInstance;
                this.ComponentKeysHandlerInstance.oModel.setProperty("/personalization", true);
                this.isLinkPersonalizationSupportedSpy = sandbox.spy(this.ComponentKeysHandlerInstance,
                    "_isLinkPersonalizationSupported");
            }.bind(this));
        },
        afterEach: function () {
            this.oEventBus.unsubscribe("launchpad", "movetile", this.oMovetileStub, this);
            this.oEventBus.unsubscribe("launchpad", "convertTile", this.oConvertTileStub, this);
            sandbox.restore();
            this.oDashboardPage.destroy();
        }
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("Move tile inside group to the right.", function (assert) {
        // Arrange
        var oEvent = {
            ctrlKey: true,
            keyCode: KeyCodes.ARROW_RIGHT,
            preventDefault: sandbox.stub(),
            stopImmediatePropagation: sandbox.stub(),
            stopPropagation: sandbox.stub()
        };
        this.oTile00.getDomRef().setAttribute("tabindex", "0");
        this.oTile00.focus();

        this._getTileUuid.returns("tile00");

        var aExpectedMoveTileArguments = [
            [
                "launchpad",
                "movetile",
                {
                    sTileId: "tile00",
                    toGroupId: "tc0",
                    srcGroupId: "tc0",
                    toIndex: 1,
                    tile: this.oTile00,
                    sToItems: "tiles",
                    sFromItems: "tiles",
                    sTileType: "tile",
                    longDrop: false
                }
            ]
        ];

        var aExpectedConvertTileArguments = [];


        // Act
        this.ComponentKeysHandlerInstance.handleFocusOnMe(oEvent);

        // Assert
        var aMovetileArguments = this.oMovetileStub.args.map(function (aArguments) {
            delete aArguments[2].callBack;
            return aArguments;
        });
        assert.deepEqual(aMovetileArguments, aExpectedMoveTileArguments, "The movetile event was fired with the correct arguments.");
        assert.deepEqual(this.oConvertTileStub.args, aExpectedConvertTileArguments, "The convertTile event was not fired.");

        assert.strictEqual(this.isLinkPersonalizationSupportedSpy.callCount, 1, "this._isLinkPersonalizationSupported called once");
        assert.deepEqual(this.isLinkPersonalizationSupportedSpy.getCall(0).args[0], "FakeTile00",
            "this._isLinkPersonalizationSupported called with correct arguments");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("Move tile inside group to the left.", function (assert) {
        // Arrange
        var oEvent = {
            ctrlKey: true,
            keyCode: KeyCodes.ARROW_LEFT,
            preventDefault: sandbox.stub(),
            stopImmediatePropagation: sandbox.stub(),
            stopPropagation: sandbox.stub()
        };
        this.oTile01.getDomRef().setAttribute("tabindex", "0");
        this.oTile01.focus();

        this._getTileUuid.returns("tile01");

        var aExpectedMoveTileArguments = [
            [
                "launchpad",
                "movetile",
                {
                    sTileId: "tile01",
                    toGroupId: "tc0",
                    srcGroupId: "tc0",
                    toIndex: 0,
                    tile: this.oTile01,
                    sToItems: "tiles",
                    sFromItems: "tiles",
                    sTileType: "tile",
                    longDrop: false
                }
            ]
        ];

        var aExpectedConvertTileArguments = [];


        // Act
        this.ComponentKeysHandlerInstance.handleFocusOnMe(oEvent);

        // Assert
        var aMovetileArguments = this.oMovetileStub.args.map(function (aArguments) {
            delete aArguments[2].callBack;
            return aArguments;
        });
        assert.deepEqual(aMovetileArguments, aExpectedMoveTileArguments, "The movetile event was fired with the correct arguments.");
        assert.deepEqual(this.oConvertTileStub.args, aExpectedConvertTileArguments, "The convertTile event was not fired.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("Move tile between groups from index 1 to 1 (down).", function (assert) {
        // Arrange
        var oEvent = {
            ctrlKey: true,
            keyCode: KeyCodes.ARROW_DOWN,
            preventDefault: sandbox.stub(),
            stopImmediatePropagation: sandbox.stub(),
            stopPropagation: sandbox.stub()
        };
        this.oTile01.getDomRef().setAttribute("tabindex", "0");
        this.oTile01.focus();

        this._getTileUuid.returns("tile01");

        var aExpectedMoveTileArguments = [
            [
                "launchpad",
                "movetile",
                {
                    sTileId: "tile01",
                    toGroupId: "tc1",
                    srcGroupId: "tc0",
                    toIndex: 1,
                    tile: this.oTile01,
                    sToItems: "tiles",
                    sFromItems: "tiles",
                    sTileType: "tile",
                    longDrop: false
                }
            ]
        ];

        var aExpectedConvertTileArguments = [];


        // Act
        this.ComponentKeysHandlerInstance.handleFocusOnMe(oEvent);

        // Assert
        var aMovetileArguments = this.oMovetileStub.args.map(function (aArguments) {
            delete aArguments[2].callBack;
            return aArguments;
        });
        assert.deepEqual(aMovetileArguments, aExpectedMoveTileArguments, "The movetile event was fired with the correct arguments.");
        assert.deepEqual(this.oConvertTileStub.args, aExpectedConvertTileArguments, "The convertTile event was not fired.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("Move tile between groups from index 2 to 2 (down).", function (assert) {
        // Arrange
        var oEvent = {
            ctrlKey: true,
            keyCode: KeyCodes.ARROW_DOWN,
            preventDefault: sandbox.stub(),
            stopImmediatePropagation: sandbox.stub(),
            stopPropagation: sandbox.stub()
        };
        this.oTile02.getDomRef().setAttribute("tabindex", "0");
        this.oTile02.focus();

        this._getTileUuid.returns("tile02");

        var aExpectedMoveTileArguments = [
            [
                "launchpad",
                "movetile",
                {
                    sTileId: "tile02",
                    toGroupId: "tc1",
                    srcGroupId: "tc0",
                    toIndex: 2,
                    tile: this.oTile02,
                    sToItems: "tiles",
                    sFromItems: "tiles",
                    sTileType: "tile",
                    longDrop: false
                }
            ]
        ];

        var aExpectedConvertTileArguments = [];


        // Act
        this.ComponentKeysHandlerInstance.handleFocusOnMe(oEvent);

        // Assert
        var aMovetileArguments = this.oMovetileStub.args.map(function (aArguments) {
            delete aArguments[2].callBack;
            return aArguments;
        });
        assert.deepEqual(aMovetileArguments, aExpectedMoveTileArguments, "The movetile event was fired with the correct arguments.");
        assert.deepEqual(this.oConvertTileStub.args, aExpectedConvertTileArguments, "The convertTile event was not fired.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("Move tile between groups from index 1 to 1 (up).", function (assert) {
        // Arrange
        var oEvent = {
            ctrlKey: true,
            keyCode: KeyCodes.ARROW_UP,
            preventDefault: sandbox.stub(),
            stopImmediatePropagation: sandbox.stub(),
            stopPropagation: sandbox.stub()
        };
        this.oTile11.getDomRef().setAttribute("tabindex", "0");
        this.oTile11.focus();

        this._getTileUuid.returns("tile11");

        var aExpectedMoveTileArguments = [
            [
                "launchpad",
                "movetile",
                {
                    sTileId: "tile11",
                    toGroupId: "tc0",
                    srcGroupId: "tc1",
                    toIndex: 1,
                    tile: this.oTile11,
                    sToItems: "tiles",
                    sFromItems: "tiles",
                    sTileType: "tile",
                    longDrop: false
                }
            ]
        ];

        var aExpectedConvertTileArguments = [];


        // Act
        this.ComponentKeysHandlerInstance.handleFocusOnMe(oEvent);

        // Assert
        var aMovetileArguments = this.oMovetileStub.args.map(function (aArguments) {
            delete aArguments[2].callBack;
            return aArguments;
        });
        assert.deepEqual(aMovetileArguments, aExpectedMoveTileArguments, "The movetile event was fired with the correct arguments.");
        assert.deepEqual(this.oConvertTileStub.args, aExpectedConvertTileArguments, "The convertTile event was not fired.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("Move tile between groups from index 0 to 0 (up).", function (assert) {
        // Arrange
        var oEvent = {
            ctrlKey: true,
            keyCode: KeyCodes.ARROW_UP,
            preventDefault: sandbox.stub(),
            stopImmediatePropagation: sandbox.stub(),
            stopPropagation: sandbox.stub()
        };
        this.oTile10.getDomRef().setAttribute("tabindex", "0");
        this.oTile10.focus();

        this._getTileUuid.returns("tile10");

        var aExpectedMoveTileArguments = [
            [
                "launchpad",
                "movetile",
                {
                    sTileId: "tile10",
                    toGroupId: "tc0",
                    srcGroupId: "tc1",
                    toIndex: 0,
                    tile: this.oTile10,
                    sToItems: "tiles",
                    sFromItems: "tiles",
                    sTileType: "tile",
                    longDrop: false
                }
            ]
        ];

        var aExpectedConvertTileArguments = [];


        // Act
        this.ComponentKeysHandlerInstance.handleFocusOnMe(oEvent);

        // Assert
        var aMovetileArguments = this.oMovetileStub.args.map(function (aArguments) {
            delete aArguments[2].callBack;
            return aArguments;
        });
        assert.deepEqual(aMovetileArguments, aExpectedMoveTileArguments, "The movetile event was fired with the correct arguments.");
        assert.deepEqual(this.oConvertTileStub.args, aExpectedConvertTileArguments, "The convertTile event was not fired.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("Move tile between groups from index 0 to 3 (left).", function (assert) {
        // Arrange
        var oEvent = {
            ctrlKey: true,
            keyCode: KeyCodes.ARROW_LEFT,
            preventDefault: sandbox.stub(),
            stopImmediatePropagation: sandbox.stub(),
            stopPropagation: sandbox.stub()
        };
        this.oTile10.getDomRef().setAttribute("tabindex", "0");
        this.oTile10.focus();

        this._getTileUuid.returns("tile10");

        var aExpectedMoveTileArguments = [
            [
                "launchpad",
                "movetile",
                {
                    sTileId: "tile10",
                    toGroupId: "tc0",
                    srcGroupId: "tc1",
                    toIndex: 3,
                    tile: this.oTile10,
                    sToItems: "tiles",
                    sFromItems: "tiles",
                    sTileType: "tile",
                    longDrop: false
                }
            ]
        ];

        var aExpectedConvertTileArguments = [];


        // Act
        this.ComponentKeysHandlerInstance.handleFocusOnMe(oEvent);

        // Assert
        var aMovetileArguments = this.oMovetileStub.args.map(function (aArguments) {
            delete aArguments[2].callBack;
            return aArguments;
        });
        assert.deepEqual(aMovetileArguments, aExpectedMoveTileArguments, "The movetile event was fired with the correct arguments.");
        assert.deepEqual(this.oConvertTileStub.args, aExpectedConvertTileArguments, "The convertTile event was not fired.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("Move tile between groups from index 2 to 0 (right).", function (assert) {
        // Arrange
        var oEvent = {
            ctrlKey: true,
            keyCode: KeyCodes.ARROW_RIGHT,
            preventDefault: sandbox.stub(),
            stopImmediatePropagation: sandbox.stub(),
            stopPropagation: sandbox.stub()
        };
        this.oTile02.getDomRef().setAttribute("tabindex", "0");
        this.oTile02.focus();

        this._getTileUuid.returns("tile02");

        var aExpectedMoveTileArguments = [
            [
                "launchpad",
                "movetile",
                {
                    sTileId: "tile02",
                    toGroupId: "tc1",
                    srcGroupId: "tc0",
                    toIndex: 0,
                    tile: this.oTile02,
                    sToItems: "tiles",
                    sFromItems: "tiles",
                    sTileType: "tile",
                    longDrop: false
                }
            ]
        ];

        var aExpectedConvertTileArguments = [];


        // Act
        this.ComponentKeysHandlerInstance.handleFocusOnMe(oEvent);

        // Assert
        var aMovetileArguments = this.oMovetileStub.args.map(function (aArguments) {
            delete aArguments[2].callBack;
            return aArguments;
        });
        assert.deepEqual(aMovetileArguments, aExpectedMoveTileArguments, "The movetile event was fired with the correct arguments.");
        assert.deepEqual(this.oConvertTileStub.args, aExpectedConvertTileArguments, "The convertTile event was not fired.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.module("_goToTileOfGroup", {
        beforeEach: function () {
            sandbox.stub(Container, "getServiceAsync").withArgs("FlpLaunchPage").resolves({
                isLinkPersonalizationSupported: sandbox.stub().returns(true)
            });

            sandbox.stub(Container, "getLogonSystem").returns({
                getPlatform: sandbox.stub()
            });

            this.oGroup = new TileContainer();
            this.oDashboardPage = new Page("sapUshellDashboardPage", {
                content: [
                    new DashboardGroupsContainer({
                        groups: [
                            this.oGroup
                        ]
                    })
                ]
            }).placeAt("qunit-fixture");

            // enforce re-initalization
            ComponentKeysHandler._instance = undefined;
            return ComponentKeysHandler.getInstance().then(function (ComponentKeysHandlerInstance) {
                this.ComponentKeysHandlerInstance = ComponentKeysHandlerInstance;
                this.ComponentKeysHandlerInstance.oModel.setProperty("/personalization", true);
                this.fnMoveScrollDashboard = sandbox.stub(this.ComponentKeysHandlerInstance, "moveScrollDashboard");
            }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
            this.oDashboardPage.destroy();
        }
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("vPosition and oGroup are not given", async function (assert) {
        // Arrange
        await nextUIUpdate();

        // Act
        this.ComponentKeysHandlerInstance._goToTileOfGroup();

        // Assert
        assert.strictEqual(this.fnMoveScrollDashboard.calledOnce, false, "moveScrollDashboard was not called");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("vPosition is not given and oGroup has no tiles or links and the user is not in edit mode", async function (assert) {
        // Arrange
        this.ComponentKeysHandlerInstance.oModel.setProperty("/tileActionModeActive", false);
        this.oGroup.setShowPlaceholder(false);
        this.oGroup.setTileActionModeActive(false);
        await nextUIUpdate();

        // Act
        this.ComponentKeysHandlerInstance._goToTileOfGroup(undefined, this.oGroup);

        // Assert
        assert.strictEqual(this.fnMoveScrollDashboard.calledOnce, false, "moveScrollDashboard was not called");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("vPosition is not given and oGroup has no tiles or links and the user is in edit mode", async function (assert) {
        this.ComponentKeysHandlerInstance.oModel.setProperty("/tileActionModeActive", true);
        this.oGroup.setShowPlaceholder(true);
        this.oGroup.setTileActionModeActive(true);
        await nextUIUpdate();

        // Act
        this.ComponentKeysHandlerInstance._goToTileOfGroup(undefined, this.oGroup);

        // Assert
        assert.strictEqual(this.fnMoveScrollDashboard.calledOnce, false, "moveScrollDashboard was not called");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("vPosition is not given and oGroup has tiles", async function (assert) {
        // Arrange
        this.ComponentKeysHandlerInstance.oModel.setProperty("/tileActionModeActive", false);
        this.oGroup.setShowPlaceholder(false);
        this.oGroup.setTileActionModeActive(false);
        this.oGroup.addTile(new Tile());
        this.oGroup.addTile(new Tile());
        await nextUIUpdate();

        // Act
        this.ComponentKeysHandlerInstance._goToTileOfGroup(undefined, this.oGroup);

        // Assert
        assert.strictEqual(this.fnMoveScrollDashboard.calledOnce, false, "moveScrollDashboard was not called");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("vPosition is \"first\" and oGroup has no tiles or links and the user is not in edit mode", async function (assert) {
        // Arrange
        this.ComponentKeysHandlerInstance.oModel.setProperty("/tileActionModeActive", false);
        this.oGroup.setShowPlaceholder(false);
        this.oGroup.setTileActionModeActive(false);
        await nextUIUpdate();

        // Act
        this.ComponentKeysHandlerInstance._goToTileOfGroup("first", this.oGroup);

        // Assert
        assert.strictEqual(this.fnMoveScrollDashboard.calledOnce, false, "moveScrollDashboard was not called");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("vPosition is \"first\" and oGroup has no tiles or links and the user is in edit mode", async function (assert) {
        // Arrange
        this.ComponentKeysHandlerInstance.oModel.setProperty("/tileActionModeActive", true);
        this.oGroup.setShowPlaceholder(true);
        this.oGroup.setTileActionModeActive(true);
        await nextUIUpdate();

        // Act
        this.ComponentKeysHandlerInstance._goToTileOfGroup("first", this.oGroup);

        // Assert
        assert.strictEqual(this.fnMoveScrollDashboard.calledOnce, true, "moveScrollDashboard was called");
        assert.strictEqual(this.fnMoveScrollDashboard.args[0][0][0], this.oGroup.oPlusTile.getDomRef(), "Scrolls to the correct tile.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("vPosition is \"first\" and oGroup has tiles and the user is not in edit mode", async function (assert) {
        // Arrange
        this.ComponentKeysHandlerInstance.oModel.setProperty("/tileActionModeActive", false);
        this.oGroup.setShowPlaceholder(false);
        this.oGroup.setTileActionModeActive(false);
        var oTile1 = new Tile();
        var oTile2 = new Tile();
        this.oGroup.addTile(oTile1);
        this.oGroup.addTile(oTile2);
        await nextUIUpdate();

        // Act
        this.ComponentKeysHandlerInstance._goToTileOfGroup("first", this.oGroup);

        // Assert
        assert.strictEqual(this.fnMoveScrollDashboard.calledOnce, true, "moveScrollDashboard was called");
        assert.strictEqual(this.fnMoveScrollDashboard.args[0][0][0], oTile1.getDomRef(), "Scrolls to the correct tile.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("vPosition is \"first\" and oGroup has tiles and the user is in edit mode", async function (assert) {
        // Arrange
        this.ComponentKeysHandlerInstance.oModel.setProperty("/tileActionModeActive", true);
        this.oGroup.setShowPlaceholder(true);
        this.oGroup.setTileActionModeActive(true);
        var oTile1 = new Tile();
        var oTile2 = new Tile();
        this.oGroup.addTile(oTile1);
        this.oGroup.addTile(oTile2);
        await nextUIUpdate();

        // Act
        this.ComponentKeysHandlerInstance._goToTileOfGroup("first", this.oGroup);

        // Assert
        assert.strictEqual(this.fnMoveScrollDashboard.calledOnce, true, "moveScrollDashboard was called");
        assert.strictEqual(this.fnMoveScrollDashboard.args[0][0][0], oTile1.getDomRef(), "Scrolls to the correct tile.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("vPosition is \"first\" and oGroup has links and the user is not in edit mode", async function (assert) {
        // Arrange
        this.ComponentKeysHandlerInstance.oModel.setProperty("/tileActionModeActive", false);
        this.oGroup.setShowPlaceholder(false);
        this.oGroup.setTileActionModeActive(false);
        var oLink1 = new Tile();
        var oLink2 = new Tile();
        this.oGroup.addLink(oLink1);
        this.oGroup.addLink(oLink2);
        await nextUIUpdate();

        // Act
        this.ComponentKeysHandlerInstance._goToTileOfGroup("first", this.oGroup);

        // Assert
        assert.strictEqual(this.fnMoveScrollDashboard.calledOnce, true, "moveScrollDashboard was called");
        assert.strictEqual(this.fnMoveScrollDashboard.args[0][0][0], oLink1.getDomRef(), "Scrolls to the correct tile.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("vPosition is \"first\" and oGroup has links and the user is in edit mode", async function (assert) {
        // Arrange
        this.ComponentKeysHandlerInstance.oModel.setProperty("/tileActionModeActive", true);
        this.oGroup.setShowPlaceholder(true);
        this.oGroup.setTileActionModeActive(true);
        var oLink1 = new Tile();
        var oLink2 = new Tile();
        this.oGroup.addLink(oLink1);
        this.oGroup.addLink(oLink2);
        await nextUIUpdate();

        // Act
        this.ComponentKeysHandlerInstance._goToTileOfGroup("first", this.oGroup);

        // Assert
        assert.strictEqual(this.fnMoveScrollDashboard.calledOnce, true, "moveScrollDashboard was called");
        assert.strictEqual(this.fnMoveScrollDashboard.args[0][0][0], this.oGroup.oPlusTile.getDomRef(), "Scrolls to the correct tile.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("vPosition is \"first\" and oGroup has tiles and links and the user is not in edit mode", async function (assert) {
        // Arrange
        this.ComponentKeysHandlerInstance.oModel.setProperty("/tileActionModeActive", false);
        this.oGroup.setShowPlaceholder(false);
        this.oGroup.setTileActionModeActive(false);
        var oTile1 = new Tile();
        var oTile2 = new Tile();
        this.oGroup.addTile(oTile1);
        this.oGroup.addTile(oTile2);
        var oLink1 = new Tile();
        var oLink2 = new Tile();
        this.oGroup.addLink(oLink1);
        this.oGroup.addLink(oLink2);
        await nextUIUpdate();

        // Act
        this.ComponentKeysHandlerInstance._goToTileOfGroup("first", this.oGroup);

        // Assert
        assert.strictEqual(this.fnMoveScrollDashboard.calledOnce, true, "moveScrollDashboard was called");
        assert.strictEqual(this.fnMoveScrollDashboard.args[0][0][0], oTile1.getDomRef(), "Scrolls to the correct tile.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("vPosition is \"first\" and oGroup has tiles and links and the user is in edit mode", async function (assert) {
        // Arrange
        this.ComponentKeysHandlerInstance.oModel.setProperty("/tileActionModeActive", true);
        this.oGroup.setShowPlaceholder(true);
        this.oGroup.setTileActionModeActive(true);
        var oTile1 = new Tile();
        var oTile2 = new Tile();
        this.oGroup.addTile(oTile1);
        this.oGroup.addTile(oTile2);
        var oLink1 = new Tile();
        var oLink2 = new Tile();
        this.oGroup.addLink(oLink1);
        this.oGroup.addLink(oLink2);
        await nextUIUpdate();

        // Act
        this.ComponentKeysHandlerInstance._goToTileOfGroup("first", this.oGroup);

        // Assert
        assert.strictEqual(this.fnMoveScrollDashboard.calledOnce, true, "moveScrollDashboard was called");
        assert.strictEqual(this.fnMoveScrollDashboard.args[0][0][0], oTile1.getDomRef(), "Scrolls to the correct tile.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("vPosition is \"last\" and oGroup has no tiles or links and the user is not in edit mode", async function (assert) {
        // Arrange
        this.ComponentKeysHandlerInstance.oModel.setProperty("/tileActionModeActive", false);
        this.oGroup.setShowPlaceholder(false);
        this.oGroup.setTileActionModeActive(false);
        await nextUIUpdate();

        // Act
        this.ComponentKeysHandlerInstance._goToTileOfGroup("last", this.oGroup);

        // Assert
        assert.strictEqual(this.fnMoveScrollDashboard.calledOnce, false, "moveScrollDashboard was called");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("vPosition is \"last\" and oGroup has no tiles or links and the user is in edit mode", async function (assert) {
        // Arrange
        this.ComponentKeysHandlerInstance.oModel.setProperty("/tileActionModeActive", true);
        this.oGroup.setShowPlaceholder(true);
        this.oGroup.setTileActionModeActive(true);
        await nextUIUpdate();

        // Act
        this.ComponentKeysHandlerInstance._goToTileOfGroup("last", this.oGroup);

        // Assert
        assert.strictEqual(this.fnMoveScrollDashboard.calledOnce, true, "moveScrollDashboard was called");
        assert.strictEqual(this.fnMoveScrollDashboard.args[0][0][0], this.oGroup.oPlusTile.getDomRef(), "Scrolls to the correct tile.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("vPosition is \"last\" and oGroup has tiles and the user is not in edit mode", async function (assert) {
        // Arrange
        this.ComponentKeysHandlerInstance.oModel.setProperty("/tileActionModeActive", false);
        this.oGroup.setShowPlaceholder(false);
        this.oGroup.setTileActionModeActive(false);
        var oTile1 = new Tile();
        var oTile2 = new Tile();
        this.oGroup.addTile(oTile1);
        this.oGroup.addTile(oTile2);
        await nextUIUpdate();

        // Act
        this.ComponentKeysHandlerInstance._goToTileOfGroup("last", this.oGroup);

        // Assert
        assert.strictEqual(this.fnMoveScrollDashboard.calledOnce, true, "moveScrollDashboard was called");
        assert.strictEqual(this.fnMoveScrollDashboard.args[0][0][0], oTile2.getDomRef(), "Scrolls to the correct tile.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("vPosition is \"last\" and oGroup has tiles and the user is in edit mode", async function (assert) {
        // Arrange
        this.ComponentKeysHandlerInstance.oModel.setProperty("/tileActionModeActive", true);
        this.oGroup.setShowPlaceholder(true);
        this.oGroup.setTileActionModeActive(true);
        var oTile1 = new Tile();
        var oTile2 = new Tile();
        this.oGroup.addTile(oTile1);
        this.oGroup.addTile(oTile2);
        await nextUIUpdate();

        // Act
        this.ComponentKeysHandlerInstance._goToTileOfGroup("last", this.oGroup);

        // Assert
        assert.strictEqual(this.fnMoveScrollDashboard.calledOnce, true, "moveScrollDashboard was called");
        assert.strictEqual(this.fnMoveScrollDashboard.args[0][0][0], this.oGroup.oPlusTile.getDomRef(), "Scrolls to the correct tile.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("vPosition is \"last\" and oGroup has links and the user is not in edit mode", async function (assert) {
        // Arrange
        this.ComponentKeysHandlerInstance.oModel.setProperty("/tileActionModeActive", false);
        this.oGroup.setShowPlaceholder(false);
        this.oGroup.setTileActionModeActive(false);
        var oLink1 = new Tile();
        var oLink2 = new Tile();
        this.oGroup.addLink(oLink1);
        this.oGroup.addLink(oLink2);
        await nextUIUpdate();

        // Act
        this.ComponentKeysHandlerInstance._goToTileOfGroup("last", this.oGroup);

        // Assert
        assert.strictEqual(this.fnMoveScrollDashboard.calledOnce, true, "moveScrollDashboard was called");
        assert.strictEqual(this.fnMoveScrollDashboard.args[0][0][0], oLink2.getDomRef(), "Scrolls to the correct tile.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("vPosition is \"last\" and oGroup has links and the user is in edit mode", async function (assert) {
        // Arrange
        this.ComponentKeysHandlerInstance.oModel.setProperty("/tileActionModeActive", true);
        this.oGroup.setShowPlaceholder(true);
        this.oGroup.setTileActionModeActive(true);
        var oLink1 = new Tile();
        var oLink2 = new Tile();
        this.oGroup.addLink(oLink1);
        this.oGroup.addLink(oLink2);
        await nextUIUpdate();

        // Act
        this.ComponentKeysHandlerInstance._goToTileOfGroup("last", this.oGroup);

        // Assert
        assert.strictEqual(this.fnMoveScrollDashboard.calledOnce, true, "moveScrollDashboard was called");
        assert.strictEqual(this.fnMoveScrollDashboard.args[0][0][0], oLink2.getDomRef(), "Scrolls to the correct tile.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("vPosition is \"last\" and oGroup has tiles and links and the user is not in edit mode", async function (assert) {
        // Arrange
        this.ComponentKeysHandlerInstance.oModel.setProperty("/tileActionModeActive", false);
        this.oGroup.setShowPlaceholder(false);
        this.oGroup.setTileActionModeActive(false);
        var oTile1 = new Tile();
        var oTile2 = new Tile();
        this.oGroup.addTile(oTile1);
        this.oGroup.addTile(oTile2);
        var oLink1 = new Tile();
        var oLink2 = new Tile();
        this.oGroup.addLink(oLink1);
        this.oGroup.addLink(oLink2);
        await nextUIUpdate();

        // Act
        this.ComponentKeysHandlerInstance._goToTileOfGroup("last", this.oGroup);

        // Assert
        assert.strictEqual(this.fnMoveScrollDashboard.calledOnce, true, "moveScrollDashboard was called");
        assert.strictEqual(this.fnMoveScrollDashboard.args[0][0][0], oLink2.getDomRef(), "Scrolls to the correct tile.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("vPosition is \"last\" and oGroup has tiles and links and the user is in edit mode", async function (assert) {
        // Arrange
        this.ComponentKeysHandlerInstance.oModel.setProperty("/tileActionModeActive", true);
        this.oGroup.setShowPlaceholder(true);
        this.oGroup.setTileActionModeActive(true);
        var oTile1 = new Tile();
        var oTile2 = new Tile();
        this.oGroup.addTile(oTile1);
        this.oGroup.addTile(oTile2);
        var oLink1 = new Tile();
        var oLink2 = new Tile();
        this.oGroup.addLink(oLink1);
        this.oGroup.addLink(oLink2);
        await nextUIUpdate();

        // Act
        this.ComponentKeysHandlerInstance._goToTileOfGroup("last", this.oGroup);

        // Assert
        assert.strictEqual(this.fnMoveScrollDashboard.calledOnce, true, "moveScrollDashboard was called");
        assert.strictEqual(this.fnMoveScrollDashboard.args[0][0][0], oLink2.getDomRef(), "Scrolls to the correct tile.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("vPosition is 1 and oGroup has no tiles or links and the user is not in edit mode", async function (assert) {
        // Arrange
        this.ComponentKeysHandlerInstance.oModel.setProperty("/tileActionModeActive", false);
        this.oGroup.setShowPlaceholder(false);
        this.oGroup.setTileActionModeActive(false);
        await nextUIUpdate();

        // Act
        this.ComponentKeysHandlerInstance._goToTileOfGroup(1, this.oGroup);

        // Assert
        assert.strictEqual(this.fnMoveScrollDashboard.calledOnce, false, "moveScrollDashboard was called");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("vPosition is 1 and oGroup has no tiles or links and the user is in edit mode", async function (assert) {
        // Arrange
        this.ComponentKeysHandlerInstance.oModel.setProperty("/tileActionModeActive", true);
        this.oGroup.setShowPlaceholder(true);
        this.oGroup.setTileActionModeActive(true);
        await nextUIUpdate();

        // Act
        this.ComponentKeysHandlerInstance._goToTileOfGroup(1, this.oGroup);

        // Assert
        assert.strictEqual(this.fnMoveScrollDashboard.calledOnce, false, "moveScrollDashboard was not called");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("vPosition is 1 and oGroup has tiles and the user is not in edit mode", async function (assert) {
        // Arrange
        this.ComponentKeysHandlerInstance.oModel.setProperty("/tileActionModeActive", false);
        this.oGroup.setShowPlaceholder(false);
        this.oGroup.setTileActionModeActive(false);
        var oTile1 = new Tile();
        var oTile2 = new Tile();
        this.oGroup.addTile(oTile1);
        this.oGroup.addTile(oTile2);
        await nextUIUpdate();

        // Act
        this.ComponentKeysHandlerInstance._goToTileOfGroup(1, this.oGroup);

        // Assert
        assert.strictEqual(this.fnMoveScrollDashboard.calledOnce, true, "moveScrollDashboard was called");
        assert.strictEqual(this.fnMoveScrollDashboard.args[0][0][0], oTile2.getDomRef(), "Scrolls to the correct tile.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("vPosition is 1 and oGroup has tiles and the user is in edit mode", async function (assert) {
        // Arrange
        this.ComponentKeysHandlerInstance.oModel.setProperty("/tileActionModeActive", true);
        this.oGroup.setShowPlaceholder(true);
        this.oGroup.setTileActionModeActive(true);
        var oTile1 = new Tile();
        var oTile2 = new Tile();
        this.oGroup.addTile(oTile1);
        this.oGroup.addTile(oTile2);
        await nextUIUpdate();

        // Act
        this.ComponentKeysHandlerInstance._goToTileOfGroup(1, this.oGroup);

        // Assert
        assert.strictEqual(this.fnMoveScrollDashboard.calledOnce, true, "moveScrollDashboard was called");
        assert.strictEqual(this.fnMoveScrollDashboard.args[0][0][0], oTile2.getDomRef(), "Scrolls to the correct tile.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("vPosition is 1 and oGroup has links and the user is not in edit mode", async function (assert) {
        // Arrange
        this.ComponentKeysHandlerInstance.oModel.setProperty("/tileActionModeActive", false);
        this.oGroup.setShowPlaceholder(false);
        this.oGroup.setTileActionModeActive(false);
        var oLink1 = new Tile();
        var oLink2 = new Tile();
        this.oGroup.addLink(oLink1);
        this.oGroup.addLink(oLink2);
        await nextUIUpdate();

        // Act
        this.ComponentKeysHandlerInstance._goToTileOfGroup(1, this.oGroup);

        // Assert
        assert.strictEqual(this.fnMoveScrollDashboard.calledOnce, true, "moveScrollDashboard was called");
        assert.strictEqual(this.fnMoveScrollDashboard.args[0][0][0], oLink2.getDomRef(), "Scrolls to the correct tile.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("vPosition is 1 and oGroup has links and the user is in edit mode", async function (assert) {
        // Arrange
        this.ComponentKeysHandlerInstance.oModel.setProperty("/tileActionModeActive", true);
        this.oGroup.setShowPlaceholder(true);
        this.oGroup.setTileActionModeActive(true);
        var oLink1 = new Tile();
        var oLink2 = new Tile();
        this.oGroup.addLink(oLink1);
        this.oGroup.addLink(oLink2);
        await nextUIUpdate();

        // Act
        this.ComponentKeysHandlerInstance._goToTileOfGroup(1, this.oGroup);

        // Assert
        assert.strictEqual(this.fnMoveScrollDashboard.calledOnce, true, "moveScrollDashboard was called");
        assert.strictEqual(this.fnMoveScrollDashboard.args[0][0][0], oLink1.getDomRef(), "Scrolls to the correct tile.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("vPosition is 1 and oGroup has tiles and links and the user is not in edit mode", async function (assert) {
        // Arrange
        this.ComponentKeysHandlerInstance.oModel.setProperty("/tileActionModeActive", false);
        this.oGroup.setShowPlaceholder(false);
        this.oGroup.setTileActionModeActive(false);
        var oTile1 = new Tile();
        var oTile2 = new Tile();
        this.oGroup.addTile(oTile1);
        this.oGroup.addTile(oTile2);
        var oLink1 = new Tile();
        var oLink2 = new Tile();
        this.oGroup.addLink(oLink1);
        this.oGroup.addLink(oLink2);
        await nextUIUpdate();

        // Act
        this.ComponentKeysHandlerInstance._goToTileOfGroup(1, this.oGroup);

        // Assert
        assert.strictEqual(this.fnMoveScrollDashboard.calledOnce, true, "moveScrollDashboard was called");
        assert.strictEqual(this.fnMoveScrollDashboard.args[0][0][0], oTile2.getDomRef(), "Scrolls to the correct tile.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("vPosition is 1 and oGroup has tiles and links and the user is in edit mode", async function (assert) {
        // Arrange
        this.ComponentKeysHandlerInstance.oModel.setProperty("/tileActionModeActive", true);
        this.oGroup.setShowPlaceholder(true);
        this.oGroup.setTileActionModeActive(true);
        var oTile1 = new Tile();
        var oTile2 = new Tile();
        this.oGroup.addTile(oTile1);
        this.oGroup.addTile(oTile2);
        var oLink1 = new Tile();
        var oLink2 = new Tile();
        this.oGroup.addLink(oLink1);
        this.oGroup.addLink(oLink2);
        await nextUIUpdate();

        // Act
        this.ComponentKeysHandlerInstance._goToTileOfGroup(1, this.oGroup);

        // Assert
        assert.strictEqual(this.fnMoveScrollDashboard.calledOnce, true, "moveScrollDashboard was called");
        assert.strictEqual(this.fnMoveScrollDashboard.args[0][0][0], oTile2.getDomRef(), "Scrolls to the correct tile.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.module("_getNextTile", {
        beforeEach: async function () {
            sandbox.stub(Container, "getServiceAsync").withArgs("FlpLaunchPage").resolves({
                isLinkPersonalizationSupported: sandbox.stub().returns(true)
            });

            sandbox.stub(Container, "getLogonSystem").returns({
                getPlatform: sandbox.stub()
            });

            this.oDashboardPage = new Page("sapUshellDashboardPage", {
                content: [
                    new DashboardGroupsContainer({
                        groups: [
                            new TileContainer({
                                showPlaceholder: false,
                                tiles: [
                                    new Tile(),
                                    new Tile()
                                ]
                            }),
                            new TileContainer({
                                showPlaceholder: false
                            }),
                            new TileContainer({
                                showPlaceholder: false,
                                tiles: [
                                    new Tile(),
                                    new Tile()
                                ]
                            })
                        ]
                    })
                ]
            }).placeAt("qunit-fixture");
            await nextUIUpdate();

            return ComponentKeysHandler.getInstance().then(function (ComponentKeysHandlerInstance) {
                this.ComponentKeysHandlerInstance = ComponentKeysHandlerInstance;
                this.ComponentKeysHandlerInstance.oModel.setProperty("/tileActionModeActive", false);
            }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
            this.oDashboardPage.destroy();
        }
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("direction right, with more tiles on the right", function (assert) {
        // Arrange
        var oGroup = this.oDashboardPage.getContent()[0].getGroups()[0];
        sandbox.stub(this.ComponentKeysHandlerInstance, "_getGroupAndTilesInfo").returns({
            oGroup: oGroup,
            oCurTile: oGroup.getTiles()[0]
        });
        var oExpectedTile = oGroup.getTiles()[1];

        // Act
        var oNextTile = this.ComponentKeysHandlerInstance._getNextTile("right");

        // Assert
        assert.strictEqual(oNextTile, oExpectedTile, "correct Tile was returned");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("direction right, with no more tiles on the right", function (assert) {
        // Arrange
        var oGroup = this.oDashboardPage.getContent()[0].getGroups()[2];
        sandbox.stub(this.ComponentKeysHandlerInstance, "_getGroupAndTilesInfo").returns({
            oGroup: oGroup,
            oCurTile: oGroup.getTiles()[1]
        });

        // Act
        var oNextTile = this.ComponentKeysHandlerInstance._getNextTile("right");

        // Assert
        assert.strictEqual(oNextTile, undefined, "no Tile was returned");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("direction right, with next tile in the next group after the empty group", function (assert) {
        // Arrange
        var oGroup = this.oDashboardPage.getContent()[0].getGroups()[0];
        sandbox.stub(this.ComponentKeysHandlerInstance, "_getGroupAndTilesInfo").returns({
            oGroup: oGroup,
            oCurTile: oGroup.getTiles()[1]
        });
        var oExpectedTile = this.oDashboardPage.getContent()[0].getGroups()[2].getTiles()[0];

        // Act
        var oNextTile = this.ComponentKeysHandlerInstance._getNextTile("right");

        // Assert
        assert.strictEqual(oNextTile, oExpectedTile, "correct Tile was returned");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("direction left, with more tiles on the left", function (assert) {
        // Arrange
        var oGroup = this.oDashboardPage.getContent()[0].getGroups()[0];
        sandbox.stub(this.ComponentKeysHandlerInstance, "_getGroupAndTilesInfo").returns({
            oGroup: oGroup,
            oCurTile: oGroup.getTiles()[1]
        });
        var oExpectedTile = this.oDashboardPage.getContent()[0].getGroups()[0].getTiles()[0];

        // Act
        var oNextTile = this.ComponentKeysHandlerInstance._getNextTile("left");

        // Assert
        assert.strictEqual(oNextTile, oExpectedTile, "correct Tile was returned");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("direction left, with no more tiles on the left", function (assert) {
        // Arrange
        var oGroup = this.oDashboardPage.getContent()[0].getGroups()[0];
        sandbox.stub(this.ComponentKeysHandlerInstance, "_getGroupAndTilesInfo").returns({
            oGroup: oGroup,
            oCurTile: oGroup.getTiles()[0]
        });

        // Act
        var oNextTile = this.ComponentKeysHandlerInstance._getNextTile("left");

        // Assert
        assert.strictEqual(oNextTile, undefined, "no Tile was returned");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("direction left, with next tile in the next group after the empty group", function (assert) {
        // Arrange
        var oGroup = this.oDashboardPage.getContent()[0].getGroups()[2];
        sandbox.stub(this.ComponentKeysHandlerInstance, "_getGroupAndTilesInfo").returns({
            oGroup: oGroup,
            oCurTile: oGroup.getTiles()[0]
        });
        var oExpectedTile = this.oDashboardPage.getContent()[0].getGroups()[0].getTiles()[1];

        // Act
        var oNextTile = this.ComponentKeysHandlerInstance._getNextTile("left");

        // Assert
        assert.strictEqual(oNextTile, oExpectedTile, "correct Tile was returned");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("direction up from first tile in group, with next tile in the next group after the empty group", function (assert) {
        // Arrange
        var oGroup = this.oDashboardPage.getContent()[0].getGroups()[2];
        sandbox.stub(this.ComponentKeysHandlerInstance, "_getGroupAndTilesInfo").returns({
            oGroup: oGroup,
            oCurTile: oGroup.getTiles()[0]
        });
        var oExpectedTile = this.oDashboardPage.getContent()[0].getGroups()[0].getTiles()[0];

        // Act
        var oNextTile = this.ComponentKeysHandlerInstance._getNextTile("up");

        // Assert
        assert.strictEqual(oNextTile, oExpectedTile, "correct Tile was returned");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("direction up from second tile in group, with next tile in the next group after the empty group", function (assert) {
        // Arrange
        var oGroup = this.oDashboardPage.getContent()[0].getGroups()[2];
        sandbox.stub(this.ComponentKeysHandlerInstance, "_getGroupAndTilesInfo").returns({
            oGroup: oGroup,
            oCurTile: oGroup.getTiles()[1]
        });
        var oExpectedTile = this.oDashboardPage.getContent()[0].getGroups()[0].getTiles()[1];

        // Act
        var oNextTile = this.ComponentKeysHandlerInstance._getNextTile("up");

        // Assert
        assert.strictEqual(oNextTile, oExpectedTile, "correct Tile was returned");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("direction down from first tile in group, with next tile in the next group after the empty group", function (assert) {
        // Arrange
        var oGroup = this.oDashboardPage.getContent()[0].getGroups()[0];
        sandbox.stub(this.ComponentKeysHandlerInstance, "_getGroupAndTilesInfo").returns({
            oGroup: oGroup,
            oCurTile: oGroup.getTiles()[0]
        });
        var oExpectedTile = this.oDashboardPage.getContent()[0].getGroups()[2].getTiles()[0];

        // Act
        var oNextTile = this.ComponentKeysHandlerInstance._getNextTile("down");

        // Assert
        assert.strictEqual(oNextTile, oExpectedTile, "correct Tile was returned");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("direction down from second tile in group, with next tile in the next group after the empty group", function (assert) {
        // Arrange
        var oGroup = this.oDashboardPage.getContent()[0].getGroups()[0];
        sandbox.stub(this.ComponentKeysHandlerInstance, "_getGroupAndTilesInfo").returns({
            oGroup: oGroup,
            oCurTile: oGroup.getTiles()[1]
        });
        var oExpectedTile = this.oDashboardPage.getContent()[0].getGroups()[2].getTiles()[1];

        // Act
        var oNextTile = this.ComponentKeysHandlerInstance._getNextTile("down");

        // Assert
        assert.strictEqual(oNextTile, oExpectedTile, "correct Tile was returned");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.module("_isLinkPersonalizationSupported", {
        beforeEach: function () {
            this.oIsLinkPersonalizationSupportedStub = sandbox.stub().returns(false);
            sandbox.stub(Container, "getServiceAsync").withArgs("FlpLaunchPage").resolves({
                isLinkPersonalizationSupported: this.oIsLinkPersonalizationSupportedStub
            });
            sandbox.stub(Container, "getLogonSystem").returns({
                getPlatform: sandbox.stub()
            });

            // enforce re-initalization
            ComponentKeysHandler._instance = undefined;
            return ComponentKeysHandler.getInstance().then(function (ComponentKeysHandlerInstance) {
                this.ComponentKeysHandlerInstance = ComponentKeysHandlerInstance;
            }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("calls Launchpage service if initialized", function (assert) {
        // Arrange
        var oDummyTile = {};

        // Act
        var bResult = this.ComponentKeysHandlerInstance._isLinkPersonalizationSupported(oDummyTile);

        // Assert
        assert.strictEqual(bResult, false, "correct result");
        assert.strictEqual(this.oIsLinkPersonalizationSupportedStub.callCount, 1,
            "Launchpage service isLinkPersonalizationSupported called once");
        assert.strictEqual(this.oIsLinkPersonalizationSupportedStub.getCall(0).args[0], oDummyTile,
            "Launchpage service isLinkPersonalizationSupported called with correct arguments");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("returns true if Launchpage service is not initialized", function (assert) {
        // Arrange
        var oDummyTile = {};
        var oLaunchPageService = this.ComponentKeysHandlerInstance.oLaunchPageService;
        var bResult;
        this.ComponentKeysHandlerInstance.oLaunchPageService = undefined;

        // Act
        try {
            bResult = this.ComponentKeysHandlerInstance._isLinkPersonalizationSupported(oDummyTile);
        } finally {
            this.ComponentKeysHandlerInstance.oLaunchPageService = oLaunchPageService;
        }

        // Assert
        assert.strictEqual(bResult, true, "correct result");
    });

    QUnit.module("_init", {
        beforeEach: function () {
            this.oDummyLaunchPageService = {};

            this.oGetPlatformStub = sandbox.stub();
            sandbox.stub(Container, "getServiceAsync")
                .withArgs("FlpLaunchPage")
                .resolves(this.oDummyLaunchPageService);
            sandbox.stub(Container, "getLogonSystem").returns({
                getPlatform: this.oGetPlatformStub
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("does not load launchpage service for CDM platform", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oGetPlatformStub.returns("cdm");
        var oComponentKeysHandler = new ComponentKeysHandler();

        // Act
        oComponentKeysHandler._init().then(function () {
            // Assert
            assert.strictEqual(oComponentKeysHandler.oLaunchPageService, undefined,
                "launchpage service is not initialized");

            fnDone();
        });
    });

});

