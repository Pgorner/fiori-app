// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.shell.NavigationBarMenu.controller
 */
sap.ui.define([
    "sap/m/Popover",
    "sap/ui/core/InvisibleMessage",
    "sap/ui/core/library",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/components/shell/NavigationBarMenu/controller/NavigationBarMenu.controller",
    "sap/ushell/resources",
    "../../../../playground/testData/NavigationBarMenu/NavigationBarMenuSpaces",
    "sap/ushell/utils/WindowUtils",
    "sap/ushell/Container",
    "sap/ushell/EventHub"
], function (
    Popover,
    InvisibleMessage,
    coreLibrary,
    Device,
    JSONModel,
    NavigationBarMenuController,
    resources,
    testData,
    WindowUtils,
    Container,
    EventHub
) {
    "use strict";

    /* global QUnit, sinon */

    // shortcut for sap.ui.core.dnd.RelativeDropPosition
    var RelativeDropPosition = coreLibrary.dnd.RelativeDropPosition;

    // shortcut for sap.ui.core.InvisibleMessageMode
    var InvisibleMessageMode = coreLibrary.InvisibleMessageMode;

    var sandbox = sinon.createSandbox({});
    var oGetOwnerComponentStub = sandbox.stub().returns({
        getModel: sandbox.stub().returns({}),
        oPropagatedProperties: {
            oModels: {
                menu: new JSONModel()
            }
        }
    });

    var oDummyModel = new JSONModel(testData);
    var oGetModelStub = sandbox.stub().withArgs("spaces").returns(oDummyModel);
    var oPopover = {
        getModel: oGetModelStub,
        openBy: sandbox.stub(),
        close: sandbox.stub()
    };

    const aPinnedSpaceItems = [
        { getBindingContextPath: sandbox.stub(), focus: sandbox.stub() },
        { getBindingContextPath: sandbox.stub(), focus: sandbox.stub() },
        { getBindingContextPath: sandbox.stub(), focus: sandbox.stub() },
        { getBindingContextPath: sandbox.stub(), focus: sandbox.stub() },
        { getBindingContextPath: sandbox.stub(), focus: sandbox.stub() },
        { getBindingContextPath: sandbox.stub(), focus: sandbox.stub() },
        { getBindingContextPath: sandbox.stub(), focus: sandbox.stub() },
        { getBindingContextPath: sandbox.stub(), focus: sandbox.stub() },
        { getBindingContextPath: sandbox.stub(), focus: sandbox.stub() },
        { getBindingContextPath: sandbox.stub(), focus: sandbox.stub() }
    ];

    const oPinnedSpaces = {
        getItems: sandbox.stub().returns(aPinnedSpaceItems),
        indexOfItem: sandbox.stub(),
        unbindItems: sandbox.stub(),
        getModel: sandbox.stub(),
        getId: sandbox.stub().returns("PinnedSpaces")
    };

    const oAllSpaces = {
        getItems: sandbox.stub().returns([ {}, {}, {}, {}, {}, {} ]),
        indexOfItem: sandbox.stub(),
        unbindItems: sandbox.stub(),
        getModel: sandbox.stub(),
        getId: sandbox.stub().returns("AllSpaces")
    };

    QUnit.module("The function onInit", {
        beforeEach: function () {


            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
            this.oGetServiceAsyncStub.withArgs("Menu").resolves();

            this.oController = new NavigationBarMenuController();
            this.oController.getOwnerComponent = oGetOwnerComponentStub;

            this.oViewModel = null;
            const oMockView = {
                setModel: sandbox.stub().withArgs(sinon.match.instanceOf(JSONModel), "viewConfiguration").callsFake((oModel) => { this.oViewModel = oModel; }),
                getModel: sandbox.stub().withArgs("viewConfiguration").callsFake(() => this.oViewModel)
            };
            sandbox.stub(this.oController, "getView").returns(oMockView);

            this.oGetInstanceStub = sandbox.stub(InvisibleMessage, "getInstance");
        },

        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Initializes the controller.", function (assert) {
        // Arrange
        // Act
        this.oController.onInit();

        // Assert
        assert.strictEqual(this.oGetInstanceStub.callCount, 1, "getInstance from InvisibleMessage was called once.");
        assert.deepEqual(this.oGetServiceAsyncStub.getCall(0).args, ["Menu"], "Menu Service was assigned properly.");
        assert.strictEqual(this.oViewModel.getProperty("/enableMenuBarNavigation"), true, "The menu bar navigation is enabled by default.");
    });

    QUnit.test("Initializes the handler for the enableMenuBarNavigation event", function (assert) {
        //Arrange
        sandbox.stub(EventHub, "on").withArgs("enableMenuBarNavigation").returns({
            do: sandbox.stub().yields(false)
        });

        //Act
        this.oController.onInit();

        //Assert
        const bEnableMenuBarNavigation = this.oViewModel.getProperty("/enableMenuBarNavigation");
        assert.strictEqual(bEnableMenuBarNavigation, false, "The enableMenuBarNavigation event was handled correctly.");
    });

    QUnit.module("The function _onPinnedSpacesUpdateFinished", {
        beforeEach: function () {
            sandbox.stub(resources.i18n, "getText").returnsArg(0);
            this.oController = new NavigationBarMenuController();
            this.oController.oResourceBundle = resources.i18n;
            this.oController.byId = sandbox.stub().withArgs("PinnedSpacesTreeTitle").returns({
                setText: sandbox.stub()
            });
        },

        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Defaults the item count to zero if no total parameter is given", function (assert) {
        // Arrange
        var oEventStub = { getParameter: sandbox.stub() };

        // Act
        this.oController._onPinnedSpacesUpdateFinished(oEventStub);

        // Assert
        assert.strictEqual(resources.i18n.getText.args[0][1][0], 0, "The number of items was defaulted to 0.");
    });

    QUnit.test("Updates the pinned spaces count with sending a total number", function (assert) {
        // Arrange
        var TOTAL_NUMBER_OF_ITEMS = 42;
        var oEventStub = { getParameter: sandbox.stub().withArgs("total").returns(TOTAL_NUMBER_OF_ITEMS) };

        // Act
        this.oController._onPinnedSpacesUpdateFinished(oEventStub);

        // Assert
        assert.strictEqual(resources.i18n.getText.args[0][1][0], TOTAL_NUMBER_OF_ITEMS, "The total number of items was correct: " + TOTAL_NUMBER_OF_ITEMS);
    });

    QUnit.module("The function openNavigationBarMenuPopover", {
        beforeEach: function () {
            this.oController = new NavigationBarMenuController();
            var fnResolveAfterBind;
            this.oAfterBindPromise = new Promise(function (resolve) {
                fnResolveAfterBind = resolve;
            });
            this.oBindPinnedSpacesStub = sandbox.stub(this.oController, "_bindPinnedSpaces").callsFake(function () {
                fnResolveAfterBind();
                return Promise.resolve();
            });
            this.oController.getView = function () {
                return {
                    addDependent: sandbox.stub(),
                    getId: sandbox.stub()
                };
            };
        },

        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Loads the fragment", function (assert) {
        // Arrange
        var done = assert.async();
        var popoverId = "NavigationBarMenuPopover";
        var oEventStub = { getSource: sandbox.stub() };
        this.oController.getOwnerComponent = oGetOwnerComponentStub;
        Popover.prototype.openBy = sandbox.stub();

        // Act
        this.oController.openNavigationBarMenuPopover(oEventStub);

        // Assert
        this.oController._pPopoverPromise.then(function (oLoadedPopover) {
            assert.strictEqual(oLoadedPopover !== undefined, true, "The popover fragment has been loaded");
            assert.strictEqual(oLoadedPopover.getId(), popoverId, "The popover has the correct ID: " + popoverId);
            done();
        });
    });

    QUnit.test("Opens the popover", function (assert) {
        // Arrange
        var done = assert.async();
        var oEventStub = { getSource: sandbox.stub() };
        var pPopoverPromiseStub = Promise.resolve(oPopover);
        this.oController._pPopoverPromise = pPopoverPromiseStub;

        // Act
        this.oController.openNavigationBarMenuPopover(oEventStub);

        // Assert
        var oLP;
        this.oController._pPopoverPromise
            .then(function (oLoadedPopover) {
                oLP = oLoadedPopover;
                assert.strictEqual(this.oBindPinnedSpacesStub.callCount, 1, "The bind spaces are bound");
                assert.strictEqual(oLP.openBy.callCount, 0, "The popover was not opened yet");
                return this.oAfterBindPromise;
            }.bind(this))
            .then(function () {
                assert.strictEqual(oLP.openBy.callCount, 1, "The popover was opened");
                done();
            });
    });

    QUnit.module("The function closeNavigationBarMenuPopover", {
        beforeEach: function () {
            this.oController = new NavigationBarMenuController();
        },

        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Closes the popover", function (assert) {
        // Arrange
        var done = assert.async();
        var pPopoverPromiseStub = Promise.resolve(oPopover);
        this.oController._pPopoverPromise = pPopoverPromiseStub;

        // Act
        this.oController.closeNavigationBarMenuPopover();

        // Assert
        this.oController._pPopoverPromise.then(function (oLoadedPopover) {
            assert.strictEqual(oLoadedPopover.close.callCount, 1, "The popover's close function was called");
            done();
        });
    });

    QUnit.module("The function handlePinButtonPress", {
        beforeEach: function () {
            this.oController = new NavigationBarMenuController();
            this.oController._pinSpace = sandbox.stub();
            this.oController._unpinSpace = sandbox.stub();
            this.oController.oModel = oDummyModel;

            this.oGetPathStub = sandbox.stub();
            this.oPinButtonStub = {
                getId: sandbox.stub().returns("id"),
                getBindingContext: sandbox.stub().returns({
                    getPath: this.oGetPathStub
                })
            };
            this.oEventStub = {
                getSource: sandbox.stub().returns(this.oPinButtonStub)
            };
        },

        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Triggers pinning an unpinned space", function (assert) {
        // Arrange
        this.oGetPathStub.returns("/3");

        // Act
        this.oController.handlePinButtonPress(this.oEventStub);

        // Assert
        assert.strictEqual(this.oController._pinSpace.callCount, 1, "The unpinned space has been pinned.");
        assert.strictEqual(this.oController._unpinSpace.callCount, 0, "The unpin function has not been called.");
    });

    QUnit.test("Triggers unpinning a pinned space", function (assert) {
        // Arrange
        this.oGetPathStub.returns("/4");

        // Act
        this.oController.handlePinButtonPress(this.oEventStub);

        // Assert
        assert.strictEqual(this.oController._unpinSpace.callCount, 1, "The pinned space has been unpinned.");
        assert.strictEqual(this.oController._pinSpace.callCount, 0, "The pin function has not been called.");
    });

    QUnit.test("Focuses the pinned spaces list after unpinning a space from it", function (assert) {
        // Arrange
        this.oGetPathStub.returns("/0");
        this.oPinButtonStub.getId.returns("something-PinnedSpaces-something");
        var oByIdStub = sandbox.stub(this.oController, "byId");
        var oPinnedSpacesListStub = {
            focus: sandbox.stub(),
            addEventDelegate: sandbox.stub(),
            removeEventDelegate: sandbox.stub()
        };
        oByIdStub.withArgs("PinnedSpaces").returns(oPinnedSpacesListStub);
        var oPopoverStub = {
            focus: sandbox.stub()
        };
        oByIdStub.withArgs("NavigationBarMenuPopover").returns(oPopoverStub);

        // Act
        this.oController.handlePinButtonPress(this.oEventStub);
        oPinnedSpacesListStub.addEventDelegate.args[0][0].onAfterRendering();

        // Assert
        assert.strictEqual(oPopoverStub.focus.callCount, 1, "Focus was set on the popover first");
        assert.strictEqual(oPinnedSpacesListStub.focus.callCount, 1, "Focus was set on the pinned spaces list");
        assert.strictEqual(oPinnedSpacesListStub.removeEventDelegate.callCount, 1, "The event delegate was removed again");
    });

    QUnit.module("The function unpinAllSpaces", {
        beforeEach: function () {
            this.oController = new NavigationBarMenuController();
            this.oController._savePinnedSpaces = sandbox.stub();
            this.oController.byId = sandbox.stub().withArgs("PinnedSpaces").returns(oPinnedSpaces);
        },

        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Calls n times unpinSpace for n pinned spaces", function (assert) {
        // Arrange
        var oData = [
            { type: "separator", pinned: true, pinnedSortOrder: "0" },
            { type: "IBN", pinned: true, pinnedSortOrder: "3" },
            { type: "IBN", pinned: true, pinnedSortOrder: "1" },
            { type: "IBN", pinned: false, pinnedSortOrder: "-1" },
            { type: "IBN", pinned: true, pinnedSortOrder: "2" }
        ];
        oPinnedSpaces.getModel.returns({
            getData: sandbox.stub().returns(oData)
        });
        var oExpectedData = [
            { type: "separator", pinned: true, pinnedSortOrder: "0" },
            { type: "IBN", pinned: false, pinnedSortOrder: "-1" },
            { type: "IBN", pinned: false, pinnedSortOrder: "-1" },
            { type: "IBN", pinned: false, pinnedSortOrder: "-1" },
            { type: "IBN", pinned: false, pinnedSortOrder: "-1" }
        ];

        // Act
        this.oController.unpinAllSpaces();

        // Assert
        assert.deepEqual(oData, oExpectedData, "all pinned spaces were unpinned.");
        assert.strictEqual(this.oController._savePinnedSpaces.callCount, 1, "pinned spaces were saved.");
    });

    QUnit.test("Calls n times unpinSpace for n pinned spaces (MY_HOME)", function (assert) {
        // Arrange
        var oData = [
            { type: "separator", pinned: true, pinnedSortOrder: "1" },
            { type: "IBN", pinned: true, pinnedSortOrder: "3" },
            { type: "IBN", pinned: true, pinnedSortOrder: "0" },
            { type: "IBN", pinned: false, pinnedSortOrder: "-1" },
            { type: "IBN", pinned: true, pinnedSortOrder: "2" }
        ];
        oPinnedSpaces.getModel.returns({
            getData: sandbox.stub().returns(oData)
        });
        var oExpectedData = [
            { type: "separator", pinned: true, pinnedSortOrder: "1" },
            { type: "IBN", pinned: false, pinnedSortOrder: "-1" },
            { type: "IBN", pinned: true, pinnedSortOrder: "0" },
            { type: "IBN", pinned: false, pinnedSortOrder: "-1" },
            { type: "IBN", pinned: false, pinnedSortOrder: "-1" }
        ];

        // Act
        this.oController.unpinAllSpaces();

        // Assert
        assert.deepEqual(oData, oExpectedData, "all pinned spaces were unpinned.");
        assert.strictEqual(this.oController._savePinnedSpaces.callCount, 1, "pinned spaces were saved.");
    });

    QUnit.module("The function rearrangePinnedSpaces", {
        beforeEach: function () {
            this.oController = new NavigationBarMenuController();
            this.oController.oModel = new JSONModel([
                { pinnedSortOrder: 0 },
                { pinnedSortOrder: 1 },
                { pinnedSortOrder: 2 }
            ]);

            this.oEventStub = {
                getParameter: sandbox.stub()
            };

            this.oController.byId = sandbox.stub().withArgs("PinnedSpaces").returns(oPinnedSpaces);

            this.oGetSourcePathStub = sandbox.stub();
            this.oGetTargetPathStub = sandbox.stub();
            this.oEventStub.getParameter.withArgs("draggedControl").returns({
                getBindingContext: sandbox.stub().withArgs("spaces").returns({
                    getPath: this.oGetSourcePathStub
                })
            });
            this.oEventStub.getParameter.withArgs("droppedControl").returns({
                getBindingContext: sandbox.stub().withArgs("spaces").returns({
                    getPath: this.oGetTargetPathStub
                }),
                addEventDelegate: sandbox.stub()
            });

            var fnResolvePersonalizationSave;
            this.oSavePersonalizationPromise = new Promise(function (resolve) {
                fnResolvePersonalizationSave = resolve;
            });
            this.oMenuServiceStub = {
                moveMenuEntry: sandbox.stub(),
                savePersonalization: sandbox.stub().callsFake(fnResolvePersonalizationSave)
            };

            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync").withArgs("Menu").resolves(this.oMenuServiceStub);
            sandbox.stub(this.oController, "getView").returns({
                setModel: sandbox.stub()
            });
            this.oController.onInit();

            this.oAnnounceStub = sandbox.stub(this.oController._oInvisibleMessageInstance, "announce");

        },
        afterEach: function () {
            sandbox.restore();
            this.oController.onExit();
            this.oController.destroy();
        }
    });

    QUnit.test("Moves the menu entry correctly if it is dropped before another menu entry", function (assert) {
        // Arrange
        this.oGetSourcePathStub.returns("/2");
        this.oGetTargetPathStub.returns("/0");
        this.oEventStub.getParameter.withArgs("dropPosition").returns("Before");
        const aExpectedArguments = [
            resources.i18n.getText("NavigationBarMenu.PinnedSpaces.Moved"), InvisibleMessageMode.Polite
        ];

        // Act
        this.oController.rearrangePinnedSpaces(this.oEventStub);

        // Assert
        return this.oSavePersonalizationPromise
            .then(function () {
                assert.deepEqual(this.oMenuServiceStub.moveMenuEntry.callCount, 1, "The menu entry was moved once.");
                assert.deepEqual(this.oMenuServiceStub.moveMenuEntry.firstCall.args, [2, 0], "The menu entry was moved correctly.");
                assert.strictEqual(this.oAnnounceStub.callCount, 1, "Move announced once.");
                assert.deepEqual(this.oAnnounceStub.firstCall.args, aExpectedArguments, "Move announced correctly.");
                assert.strictEqual(this.oMenuServiceStub.savePersonalization.calledOnce, true, "The menu personalization was saved.");
            }.bind(this));
    });

    QUnit.test("Moves the menu entry correctly if it is dropped after another menu entry", function (assert) {
        // Arrange
        this.oGetSourcePathStub.returns("/0");
        this.oGetTargetPathStub.returns("/2");
        this.oEventStub.getParameter.withArgs("dropPosition").returns("After");
        const aExpectedArguments = [
            resources.i18n.getText("NavigationBarMenu.PinnedSpaces.Moved"), InvisibleMessageMode.Polite
        ];

        // Act
        this.oController.rearrangePinnedSpaces(this.oEventStub);

        // Assert
        return this.oSavePersonalizationPromise
        .then(function () {
                assert.deepEqual(this.oMenuServiceStub.moveMenuEntry.callCount, 1, "The menu entry was moved once.");
                assert.deepEqual(this.oMenuServiceStub.moveMenuEntry.firstCall.args, [0, 3], "The menu entry was moved correctly.");
                assert.strictEqual(this.oAnnounceStub.callCount, 1, "Move announced once.");
                assert.deepEqual(this.oAnnounceStub.firstCall.args, aExpectedArguments, "Move announced correctly.");
                assert.strictEqual(this.oMenuServiceStub.savePersonalization.calledOnce, true, "The menu personalization was saved.");
            }.bind(this));
    });

    QUnit.module("The function allSpacesFactory", {
        beforeEach: function () {
            this.oController = new NavigationBarMenuController();

            this.oModel = new JSONModel();
            this.oContext = {
                getModel: sandbox.stub().returns(this.oModel),
                getPath: sandbox.stub().returns("/0")
            };

            var oListItemStub = {
                setType: sandbox.stub(),
                attachPress: sandbox.stub(),
                addStyleClass: sandbox.stub(),
                setVisible: sandbox.stub()
            };
            sandbox.stub(this.oController, "byId").withArgs("AllSpaces").returns({
                getDependents: sandbox.stub().returns([{
                    clone: sandbox.stub().returns(oListItemStub)
                }])
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Hides the expander and enables the navigation if there are no sub menu entries", function (assert) {
        // Arrange
        this.oModel.setData([
            {
                menuEntries: []
            }
        ]);

        // Act
        var oListItem = this.oController.allSpacesFactory("a", this.oContext);

        // Assert
        assert.strictEqual(oListItem.addStyleClass.args[0][0], "sapMTreeItemBaseLeaf", "The expander was hidden");
    });

    QUnit.test("Hides the separator", function (assert) {
        // Arrange
        this.oModel.setData([
            {
                type: "separator"
            }
        ]);

        // Act
        var oListItem = this.oController.allSpacesFactory("a", this.oContext);

        // Assert
        assert.strictEqual(oListItem.setVisible.args[0][0], false, "The separator was hidden");
    });

    QUnit.test("Hides the home entry", function (assert) {
        // Arrange
        this.oModel.setData([
            {
                isHomeEntry: true
            }
        ]);

        // Act
        var oListItem = this.oController.allSpacesFactory("a", this.oContext);

        // Assert
        assert.strictEqual(oListItem.setVisible.args[0][0], false, "The home entry was hidden");
    });

    QUnit.module("The function _unpinSpace", {
        beforeEach: function () {
            this.oController = new NavigationBarMenuController();
            this.oController._savePinnedSpaces = sandbox.stub();
            this.oTestModel = new JSONModel(testData);
            this.oController.oModel = this.oTestModel;
        },

        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
            this.oTestModel.destroy();
            this.oTestModel = undefined;
        }
    });

    QUnit.test("Sets pinned property to false and pinnedSortOrder to -1 for a given sSpacePath", function (assert) {
        // Arrange
        var unpinnedSpacePath = "/4";

        // Assert before change pinned = true, pinnedSortOrder > -1
        assert.strictEqual(this.oController.oModel.getProperty(unpinnedSpacePath).pinned, true, "The pinned property is true before _unpinSpace is called.");
        assert.strictEqual(this.oController.oModel.getProperty(unpinnedSpacePath).pinnedSortOrder, "2", "The pinnedSortOrder property is larger than -1 before _unpinSpace is called.");

        // Act
        this.oController._unpinSpace(unpinnedSpacePath, false);

        // Assert
        assert.strictEqual(this.oController.oModel.getProperty(unpinnedSpacePath).pinned, false, "The pinned property is true before _unpinSpace is called.");
        assert.strictEqual(this.oController.oModel.getProperty(unpinnedSpacePath).pinnedSortOrder, "-1", "The pinnedSortOrder property is larger than -1 before _unpinSpace is called.");
    });

    QUnit.test("Calls _savePinnedSpace 0 times if bSaveunpinning is set to false", function (assert) {
        // Arrange

        // Act
        this.oController._unpinSpace("/4", false);

        // Assert
        assert.strictEqual(this.oController._savePinnedSpaces.callCount, 0, "_savePinnedSpace was not called.");
    });

    QUnit.test("Calls _savePinnedSpace once if bSaveunpinning is set to true", function (assert) {
        // Arrange
        //var oSpaceModel = new

        // Act
        this.oController._unpinSpace("/4", true);

        // Assert
        assert.strictEqual(this.oController._savePinnedSpaces.callCount, 1, "_savePinnedSpace was called once.");
    });

    QUnit.module("The function _pinSpace", {
        beforeEach: function () {
            this.oController = new NavigationBarMenuController();
            this.oController._savePinnedSpaces = sandbox.stub();
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Pins a 1st space, pinnedSortOrder is 2", function (assert) {
        // Arrange
        this.oController.byId = sandbox.stub().withArgs("PinnedSpaces").returns({ getItems: function () { return []; } });
        oPinnedSpaces.getProperty = sandbox.stub();
        oPinnedSpaces.setProperty = sandbox.stub();
        this.oController.oModel = oPinnedSpaces;

        // Act
        this.oController._pinSpace("/0");

        // Assert
        assert.strictEqual(oPinnedSpaces.setProperty.args[0][1], 2, "The new pinnedSortOrder is 2.");
        assert.strictEqual(oPinnedSpaces.setProperty.args[1][1], true, "The space is pinned.");
    });

    QUnit.test("Pins a 2nd space, pinnedSortOrder is correctly calculated", function (assert) {
        // Arrange
        this.oController.byId = sandbox.stub().withArgs("PinnedSpaces").returns(oPinnedSpaces);
        // let's assume the last pinnedSortOrder is equal to the length of the pinned items tree
        oPinnedSpaces.getProperty = sandbox.stub().returns(aPinnedSpaceItems.length);
        oPinnedSpaces.setProperty = sandbox.stub();
        this.oController.oModel = oPinnedSpaces;
        var assertedNewPinnedSortOrder = aPinnedSpaceItems.length + 1;

        // Act
        this.oController._pinSpace("/0");

        // Assert
        assert.strictEqual(oPinnedSpaces.setProperty.args[0][1], assertedNewPinnedSortOrder, "The new pinnedSortOrder is " + assertedNewPinnedSortOrder + ".");
        assert.strictEqual(oPinnedSpaces.setProperty.args[1][1], true, "The space is pinned.");
    });

    QUnit.module("The function onMenuItemSelection", {
        beforeEach: function () {
            this.oController = new NavigationBarMenuController();
            this.oTestModel = new JSONModel(testData);
            this.oController.oModel = this.oTestModel;

            this.oListItemStub = {
                isLeaf: sandbox.stub(),
                getBindingContextPath: sandbox.stub(),
                getParent: sandbox.stub(),
                getExpanded: sandbox.stub()
            };
            this.oEventStub = {
                getParameter: sandbox.stub().withArgs("id").returns("AllSpaces"),
                getSource: sandbox.stub().returns(this.oListItemStub)
            };
        },

        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
            this.oTestModel.destroy();
            this.oTestModel = undefined;
        }
    });

    QUnit.test("Does nothing if the item is not in AllSpaces tree", function (assert) {
        // Arrange
        this.oEventStub.getParameter.withArgs("id").returns("PinnedSpaces");

        // Act
        this.oController.onMenuItemSelection(this.oEventStub);

        // Assert
        assert.strictEqual(this.oListItemStub.isLeaf.callCount, 0, "Nothing has happened with an item that is not part of the AllSpaces Tree.");
    });

    QUnit.test("Perform Navigation on pages of type IBN", function (assert) {
        // Arrange
        this.oListItemStub.isLeaf.returns(true);
        this.oListItemStub.getBindingContextPath.withArgs("spaces").returns("/2");

        var oNavigationService = {
            navigate: sandbox.stub().resolves()
        };

        this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync").withArgs("Navigation").resolves(oNavigationService);

        var oDonePromise = new Promise(function (resolve) {
            sandbox.stub(this.oController, "closeNavigationBarMenuPopover").callsFake(resolve);
        }.bind(this));

        var oExpectedNavigationParameters = {
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage"
            },
            params: {
                spaceId: ["ZSJW_TEST_SPACE_01"],
                pageId: ["ZSJW_TEST_PAGE"]
            }
        };

        // Act
        this.oController.onMenuItemSelection(this.oEventStub);

        // Assert
        return oDonePromise.then(function () {
            assert.deepEqual(oNavigationService.navigate.args[0][0], oExpectedNavigationParameters, "The Navigation is done for type IBN");
        });
    });

    QUnit.test("Perform external Navigation on spaces of type URL", function (assert) {
        // Arrange
        this.oListItemStub.isLeaf.returns(true);
        this.oListItemStub.getBindingContextPath.withArgs("spaces").returns("/9");
        var oOpenURLStub = sandbox.stub(WindowUtils, "openURL");
        sandbox.stub(this.oController, "closeNavigationBarMenuPopover");
        var oExpectedParameters = [
            "http://external.url",
            "_blank"
        ];

        // Act
        this.oController.onMenuItemSelection(this.oEventStub);

        // Assert
        assert.deepEqual(oOpenURLStub.args[0], oExpectedParameters, "The URL has been opened.");
    });

    QUnit.module("The function _savePinnedSpaces", {
        beforeEach: function () {
            this.oSavePersonalizationStub = sandbox.stub();
            this.oMenuServicePromiseStub = new Promise(function (resolve) {
                resolve({ savePersonalization: this.oSavePersonalizationStub });
            }.bind(this));

            this.oController = new NavigationBarMenuController();
            this.oTestModel = new JSONModel(testData);
            this.oController.oModel = this.oTestModel;
            this.oController.pMenuServicePromise = this.oMenuServicePromiseStub;
        },

        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
            this.oTestModel.destroy();
            this.oTestModel = undefined;
        }
    });

    QUnit.test("Saves the pinned spaces via menu service promise.", function (assert) {
        // Arrange
        var done = assert.async();
        var oRefreshStub = sandbox.stub(this.oTestModel, "refresh");

        // Act
        this.oController._savePinnedSpaces();

        // Assert
        this.oController.pMenuServicePromise.then(function () {
            assert.strictEqual(oRefreshStub.args[0][0], true, "The menu model was refreshed before saving.");
            assert.strictEqual(this.oSavePersonalizationStub.callCount, 1, "The menu service was successfully called to save the personalization.");
            done();
        }.bind(this));
    });

    QUnit.module("_handleSpacesSwap function", {
        beforeEach: function () {
            this.oController = new NavigationBarMenuController();
            this.oController.oModel = new JSONModel({
                spaces: [
                    { pinnedSortOrder: 4 },
                    { pinnedSortOrder: 5 },
                    { pinnedSortOrder: 7 }
                ]
            });

            var oByIdStub = sandbox.stub(this.oController, "byId");

            this.oFirstItem = {
                getFocusDomRef: sandbox.stub(),
                getBindingContext: sandbox.stub().returns({
                    getPath: sandbox.stub().returns("/spaces/0")
                })
            };
            this.oSecondItem = {
                getFocusDomRef: sandbox.stub().returns(document.activeElement),
                getBindingContext: sandbox.stub().returns({
                    getPath: sandbox.stub().returns("/spaces/1")
                })
            };
            this.oThirdItem = {
                getFocusDomRef: sandbox.stub(),
                getBindingContext: sandbox.stub().returns({
                    getPath: sandbox.stub().returns("/spaces/2")
                })
            };
            oByIdStub.withArgs("PinnedSpaces").returns({
                getItems: sandbox.stub().returns([
                    this.oFirstItem,
                    this.oSecondItem,
                    this.oThirdItem
                ])
            });

            this.oRearrangePinnedSpacesStub = sandbox.stub(this.oController, "_rearrangePinnedSpaces");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Move Up", function (assert) {
        // Arrange
        const bSwapUp = true;
        const aExpectedArguments = [ 5, 4, this.oFirstItem, RelativeDropPosition.Before ];

        // Act
        const bSwapResult = this.oController._handleSpacesSwap(bSwapUp);

        // Assert
        assert.strictEqual(this.oRearrangePinnedSpacesStub.callCount, 1, "_rearrangePinnedSpaces was called once.");
        assert.deepEqual(this.oRearrangePinnedSpacesStub.firstCall.args, aExpectedArguments, "_rearrangePinnedSpaces was called correctly.");
        assert.strictEqual(bSwapResult, true, "The swapping up of a space returned true.");
    });

    QUnit.test("Move Down", function (assert) {
        // Arrange
        const bSwapUp = false;
        const aExpectedArguments = [ 5, 8, this.oThirdItem, RelativeDropPosition.After ];

        // Act
        const bSwapResult = this.oController._handleSpacesSwap(bSwapUp);

        // Assert
        assert.strictEqual(this.oRearrangePinnedSpacesStub.callCount, 1, "_rearrangePinnedSpaces was called once.");
        assert.deepEqual(this.oRearrangePinnedSpacesStub.firstCall.args, aExpectedArguments, "_rearrangePinnedSpaces was called correctly.");
        assert.strictEqual(bSwapResult, true, "The swapping up of a space returned true.");
    });

    QUnit.module("_moveSpaceUp function", {
        beforeEach: function () {
            this.oController = new NavigationBarMenuController();
            this.oController.oModel = new JSONModel({
                spaces: [
                    { pinnedSortOrder: 4 },
                    { pinnedSortOrder: 5 },
                    { pinnedSortOrder: 7 }
                ]
            });

            var oByIdStub = sandbox.stub(this.oController, "byId");

            this.oFirstItem = {
                getFocusDomRef: sandbox.stub(),
                getBindingContext: sandbox.stub().returns({
                    getPath: sandbox.stub().returns("/spaces/0")
                })
            };
            this.oSecondItem = {
                getFocusDomRef: sandbox.stub().returns(document.activeElement),
                getBindingContext: sandbox.stub().returns({
                    getPath: sandbox.stub().returns("/spaces/1")
                })
            };
            this.oThirdItem = {
                getFocusDomRef: sandbox.stub(),
                getBindingContext: sandbox.stub().returns({
                    getPath: sandbox.stub().returns("/spaces/2")
                })
            };
            oByIdStub.withArgs("PinnedSpaces").returns({
                getItems: sandbox.stub().returns([
                    this.oFirstItem,
                    this.oSecondItem,
                    this.oThirdItem
                ])
            });

            this.oRearrangePinnedSpacesStub = sandbox.stub(this.oController, "_rearrangePinnedSpaces");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Keyboard Move Up", function (assert) {
        // Arrange
        var oEvent = {
            type: "sapupmodifiers",
            preventDefault: sandbox.stub(),
            stopPropagation: sandbox.stub()
        };
        var aExpectedArguments = [ 5, 4, this.oFirstItem, RelativeDropPosition.Before ];

        // Act
        this.oController._moveSpaceUp(oEvent);

        // Assert
        assert.strictEqual(this.oRearrangePinnedSpacesStub.callCount, 1, "_rearrangePinnedSpaces was called once.");
        assert.deepEqual(this.oRearrangePinnedSpacesStub.firstCall.args, aExpectedArguments, "_rearrangePinnedSpaces was called correctly.");
        assert.strictEqual(oEvent.preventDefault.callCount, 1, "preventDefault was called exactly once.");
        assert.strictEqual(oEvent.stopPropagation.callCount, 1, "stopPropagation was called exactly once.");
    });

    QUnit.test("Context Menu Move Up", function (assert) {
        // Arrange
        var oEvent = {
            preventDefault: sandbox.stub()
        };
        var aExpectedArguments = [ 5, 4, this.oFirstItem, RelativeDropPosition.Before ];

        // Act
        this.oController._moveSpaceUp(oEvent);

        // Assert
        assert.strictEqual(this.oRearrangePinnedSpacesStub.callCount, 1, "_rearrangePinnedSpaces was called once.");
        assert.deepEqual(this.oRearrangePinnedSpacesStub.firstCall.args, aExpectedArguments, "_rearrangePinnedSpaces was called correctly.");
        assert.strictEqual(oEvent.preventDefault.callCount, 1, "preventDefault was called exactly once.");
    });

    QUnit.module("_moveSpaceDown function", {
        beforeEach: function () {
            this.oController = new NavigationBarMenuController();
            this.oController.oModel = new JSONModel({
                spaces: [
                    { pinnedSortOrder: 4 },
                    { pinnedSortOrder: 5 },
                    { pinnedSortOrder: 7 }
                ]
            });

            var oByIdStub = sandbox.stub(this.oController, "byId");

            this.oFirstItem = {
                getFocusDomRef: sandbox.stub(),
                getBindingContext: sandbox.stub().returns({
                    getPath: sandbox.stub().returns("/spaces/0")
                })
            };
            this.oSecondItem = {
                getFocusDomRef: sandbox.stub().returns(document.activeElement),
                getBindingContext: sandbox.stub().returns({
                    getPath: sandbox.stub().returns("/spaces/1")
                })
            };
            this.oThirdItem = {
                getFocusDomRef: sandbox.stub(),
                getBindingContext: sandbox.stub().returns({
                    getPath: sandbox.stub().returns("/spaces/2")
                })
            };
            oByIdStub.withArgs("PinnedSpaces").returns({
                getItems: sandbox.stub().returns([
                    this.oFirstItem,
                    this.oSecondItem,
                    this.oThirdItem
                ])
            });

            this.oRearrangePinnedSpacesStub = sandbox.stub(this.oController, "_rearrangePinnedSpaces");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Keyboard Move Down", function (assert) {
        // Arrange
        var oEvent = {
            type: "sapupmodifiers",
            preventDefault: sandbox.stub(),
            stopPropagation: sandbox.stub().returns(undefined)
        };
        var aExpectedArguments = [
            5, 8, this.oThirdItem, RelativeDropPosition.After
        ];

        // Act
        this.oController._moveSpaceDown(oEvent);

        // Assert
        assert.strictEqual(this.oRearrangePinnedSpacesStub.callCount, 1, "_rearrangePinnedSpaces was called once.");
        assert.deepEqual(this.oRearrangePinnedSpacesStub.firstCall.args, aExpectedArguments, "_rearrangePinnedSpaces was called correctly.");
        assert.strictEqual(oEvent.preventDefault.callCount, 1, "preventDefault was called exactly once.");
        assert.strictEqual(oEvent.stopPropagation.callCount, 1, "stopPropagation was called exactly once.");
    });

    QUnit.test("Context Menu Move Down", function (assert) {
        // Arrange
        var oEvent = {
            preventDefault: sandbox.stub()
        };
        var aExpectedArguments = [ 5, 8, this.oThirdItem, RelativeDropPosition.After ];

        // Act
        this.oController._moveSpaceDown(oEvent);

        // Assert
        assert.strictEqual(this.oRearrangePinnedSpacesStub.callCount, 1, "_rearrangePinnedSpaces was called once.");
        assert.deepEqual(this.oRearrangePinnedSpacesStub.firstCall.args, aExpectedArguments, "_rearrangePinnedSpaces was called correctly.");
        assert.strictEqual(oEvent.preventDefault.callCount, 1, "preventDefault was called exactly once.");
    });

    QUnit.module("The function _configureContextMenuEnablement", {
        beforeEach: function () {
            this.oController = new NavigationBarMenuController();
        },

        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("context menu is opened by a page item from the AllSpaces tree", function (assert) {
        // Arrange
        this.oController.oViewConfigurationModel = new JSONModel({
            contextMenu: {}
        });
        oAllSpaces.indexOfItem.returns(4);
        const oEvent = {
            getSource: sandbox.stub().returns(oAllSpaces),
            getParameter: sandbox.stub().withArgs("listItem").returns({
                getBindingContext: sandbox.stub().returns({
                    getProperty: sandbox.stub()
                })
            })
        };

        const oExpectedModelData = {
            contextMenu: {
                enableMoveDown: false,
                enableMoveUp: false,
                enablePin: false
            }
        };


        // Act
        this.oController._configureContextMenuEnablement(oEvent);

        // Assert
        assert.deepEqual(this.oController.oViewConfigurationModel.getData(), oExpectedModelData, "The model data was adjusted as expected.");

        // Clean-up
        this.oController.oViewConfigurationModel.destroy();
    });

    QUnit.test("context menu is opened by a space item from the AllSpaces tree", function (assert) {
        // Arrange
        this.oController.oViewConfigurationModel = new JSONModel({
            contextMenu: {}
        });
        oAllSpaces.indexOfItem.returns(4);
        const oEvent = {
            getSource: sandbox.stub().returns(oAllSpaces),
            getParameter: sandbox.stub().withArgs("listItem").returns({
                getBindingContext: sandbox.stub().returns({
                    getProperty: sandbox.stub().returns(true)
                })
            })
        };

        const oExpectedModelData = {
            contextMenu: {
                enableMoveDown: false,
                enableMoveUp: false,
                enablePin: true
            }
        };


        // Act
        this.oController._configureContextMenuEnablement(oEvent);

        // Assert
        assert.deepEqual(this.oController.oViewConfigurationModel.getData(), oExpectedModelData, "The model data was adjusted as expected.");

        // Clean-up
        this.oController.oViewConfigurationModel.destroy();
    });

    QUnit.test("context menu is opened by an item from the PinnedSpaces tree", function (assert) {
        // Arrange
        this.oController.oViewConfigurationModel = new JSONModel({
            contextMenu: {}
        });
        oPinnedSpaces.indexOfItem.returns(4);
        const oEvent = {
            getSource: sandbox.stub().returns(oPinnedSpaces),
            getParameter: sandbox.stub().withArgs("listItem").returns({
                getBindingContext: sandbox.stub().returns({
                    getProperty: sandbox.stub().returns(true)
                })
            })
        };

        const oExpectedModelData = {
            contextMenu: {
                enableMoveDown: true,
                enableMoveUp: true,
                enablePin: true
            }
        };


        // Act
        this.oController._configureContextMenuEnablement(oEvent);

        // Assert
        assert.deepEqual(this.oController.oViewConfigurationModel.getData(), oExpectedModelData, "The model data was adjusted as expected.");

        // Clean-up
        this.oController.oViewConfigurationModel.destroy();
    });

    QUnit.test("context menu is opened by the first item from the PinnedSpaces tree", function (assert) {
        // Arrange
        this.oController.oViewConfigurationModel = new JSONModel({
            contextMenu: {}
        });
        oPinnedSpaces.indexOfItem.returns(0);
        const oEvent = {
            getSource: sandbox.stub().returns(oPinnedSpaces),
            getParameter: sandbox.stub().withArgs("listItem").returns({
                getBindingContext: sandbox.stub().returns({
                    getProperty: sandbox.stub().returns(true)
                })
            })
        };

        const oExpectedModelData = {
            contextMenu: {
                enableMoveDown: true,
                enableMoveUp: false,
                enablePin: true
            }
        };


        // Act
        this.oController._configureContextMenuEnablement(oEvent);

        // Assert
        assert.deepEqual(this.oController.oViewConfigurationModel.getData(), oExpectedModelData, "The model data was adjusted as expected.");

        // Clean-up
        this.oController.oViewConfigurationModel.destroy();
    });

    QUnit.test("context menu is opened by the last item from the PinnedSpaces tree", function (assert) {
        // Arrange
        this.oController.oViewConfigurationModel = new JSONModel({
            contextMenu: {}
        });
        oPinnedSpaces.indexOfItem.returns(aPinnedSpaceItems.length - 1);
        const oEvent = {
            getSource: sandbox.stub().returns(oPinnedSpaces),
            getParameter: sandbox.stub().withArgs("listItem").returns({
                getBindingContext: sandbox.stub().returns({
                    getProperty: sandbox.stub().returns(true)
                })
            })
        };

        const oExpectedModelData = {
            contextMenu: {
                enableMoveDown: false,
                enableMoveUp: true,
                enablePin: true
            }
        };


        // Act
        this.oController._configureContextMenuEnablement(oEvent);

        // Assert
        assert.deepEqual(this.oController.oViewConfigurationModel.getData(), oExpectedModelData, "The model data was adjusted as expected.");

        // Clean-up
        this.oController.oViewConfigurationModel.destroy();
    });
});
