// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileoverview QUnit tests for "sap.ushell.components.homepage.ActionMode".
 *
 * @deprecated since 1.112
 */
sap.ui.define([
    "sap/ui/core/Element",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/components/homepage/ActionMode"
], function (Element, JSONModel, ActionMode) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox();

    QUnit.module("sap.ushell.components.homepage.ActionMode", {
        beforeEach: function () {
            this.oModel = new JSONModel({
                tileActionModeActive: false,
                topGroupInViewPortIndex: 0
            });
            this.oEventBusStub = sandbox.stub(sap.ui.getCore().getEventBus(), "publish");

            sandbox.useFakeTimers();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("toggleActionMode when not in edit mode", function (assert) {
        // Arrange
        var fnActivationStub = sandbox.stub(ActionMode, "_activate");

        // Act
        ActionMode.toggleActionMode(this.oModel);
        sandbox.clock.tick(1);

        // Assert
        assert.ok(fnActivationStub.called, "_activate is called");
        assert.ok(this.oEventBusStub.called, "an Event was fired");
        assert.strictEqual(this.oEventBusStub.args[0][0], "launchpad", "1. parameter of Event was correct");
        assert.strictEqual(this.oEventBusStub.args[0][1], "scrollToGroup", "2. parameter of Event was correct");
    });

    QUnit.test("toggleActionMode when in edit mode", function (assert) {
        // Arrange
        var fnDeactivationStub = sandbox.stub(ActionMode, "_deactivate");
        this.oModel.oData.tileActionModeActive = true;

        // Act
        ActionMode.toggleActionMode(this.oModel);
        sandbox.clock.tick(1);

        // Assert
        assert.ok(fnDeactivationStub.called, "_deactivate is called");
        assert.ok(this.oEventBusStub.called, "an Event was fired");
        assert.strictEqual(this.oEventBusStub.args[0][0], "launchpad", "1. parameter of Event was correct");
        assert.strictEqual(this.oEventBusStub.args[0][1], "scrollToGroup", "2. parameter of Event was correct");
    });

    QUnit.module("_openActionsMenu", {
        beforeEach: function () {
            this.oActionModePrototype = Object.getPrototypeOf(ActionMode);
            this.aTileActions = [];
            this._openNoActionsPopoverStub = sandbox.stub(this.oActionModePrototype, "_openNoActionsPopover");
            this.oGetHomepageManagerStub = sandbox.stub(this.oActionModePrototype, "getHomepageManager").returns({
                getTileActions: sandbox.stub().returns(this.aTileActions)
            });
            this._filterActionsStub = sandbox.stub(this.oActionModePrototype, "_filterActions").returnsArg(0);
            this._openActionSheetStub = sandbox.stub(this.oActionModePrototype, "_openActionSheet");
            this.oEvent = {
                getSource: sandbox.stub().returns({
                    getBindingContext: sandbox.stub().returns({
                        getObject: sandbox.stub().returns({
                            object: []
                        })
                    }),
                    getModel: sandbox.stub().returns({
                        getProperty: sandbox.stub().returns(false) // "isGroupLocked"
                    }),
                    getDomRef: sandbox.stub().returns({
                        getElementsByClassName: sandbox.stub().returns([])
                    }),
                    getParent: sandbox.stub().returns({
                        getBindingContext: sandbox.stub().returns({
                            getPath: sandbox.stub()
                        })
                    }),
                    getId: sandbox.stub()
                })
            };
            sandbox.stub(Element, "getElementById").returns({}); // "TileActions" (ActionSheet)
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Keeps valid and discards invalid Tile actions", function (assert) {
        // Arrange
        assert.expect(1 + 3);
        this.aTileActions.push(
            { text: "TEST_1", icon: "TEST_1", press: "TEST" }, // should be kept
            { text: "TEST_2", icon: "TEST_2", targetURL: "TEST" }, // should be kept
            { text: "TEST_3", icon: "TEST_3", press: "TEST", targetURL: "TEST" }, // should be kept
            { text: "TEST_4", icon: "TEST_4" } // should be discarded (has no "press" or "targetURL")
        );

        // Act
        this.oActionModePrototype._openActionsMenu(this.oEvent);

        // Assert
        assert.strictEqual(this._openActionSheetStub.callCount, 1, "Method called the expected number of times");
        var aActionButtons = this._openActionSheetStub.args[0][1];
        for (var i = 0; i < aActionButtons.length; ++i) {
            // should assert 3 times: one for each kept Tile action
            assert.strictEqual(aActionButtons[i].getText(), this.aTileActions[i].text, "Method called with the expected argument #" + i);
        }
    });

    QUnit.test("Opens a popover when a Tile has no actions ", function (assert) {
        // Arrange
        this.aTileActions = [];

        // Act
        this.oActionModePrototype._openActionsMenu(this.oEvent);

        // Assert
        assert.strictEqual(this._openNoActionsPopoverStub.callCount, 1, "_openNoActionsPopover was called once");
        assert.strictEqual(this._openActionSheetStub.callCount, 0, "_openActionSheet was not called");
    });

    QUnit.test("Opens action sheet when a Tile has actions ", function (assert) {
        // Arrange
        this.aTileActions.push({ text: "TEST_1", icon: "TEST_1", press: "TEST" });

        // Act
        this.oActionModePrototype._openActionsMenu(this.oEvent);

        // Assert
        assert.strictEqual(this._openNoActionsPopoverStub.callCount, 0, "_openNoActionsPopover was not called");
        assert.strictEqual(this._openActionSheetStub.callCount, 1, "_openActionSheet was called once");
    });

    QUnit.module("_filterActions", {
        beforeEach: function () {
            this.oGivenTileControl = {
                getModel: sandbox.stub().returns({
                    getProperty: sandbox.stub()
                }),
                getParent: sandbox.stub().returns({
                    getBindingContext: sandbox.stub().returns({
                        getPath: sandbox.stub()
                    })
                })
            };
            this.oGetPersonalizableGroupsStub = sandbox.stub();
            this.oGivenContext = {
                getHomepageManager: sandbox.stub().returns({
                    getPersonalizableGroups: this.oGetPersonalizableGroupsStub
                })
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("No personalizable Groups", function (assert) {
        var aGivenActions = [
            { id: "moveTile_action" },
            { id: "Test1" },
            { id: "Test2" }
        ];
        var aExpectedActions = [
            { id: "Test1" },
            { id: "Test2" }
        ];
        this.oGetPersonalizableGroupsStub.returns([]);
        var aResultActions = Object.getPrototypeOf(ActionMode)._filterActions.call(this.oGivenContext, aGivenActions, this.oGivenTileControl);
        assert.deepEqual(aResultActions, aExpectedActions, "Returns the expected value");
    });

    QUnit.test("One personalizable Group", function (assert) {
        var aGivenActions = [
            { id: "moveTile_action" },
            { id: "Test1" },
            { id: "Test2" }
        ];
        var aExpectedActions = [
            { id: "Test1" },
            { id: "Test2" }
        ];
        this.oGetPersonalizableGroupsStub.returns([1]);
        var aResultActions = Object.getPrototypeOf(ActionMode)._filterActions.call(this.oGivenContext, aGivenActions, this.oGivenTileControl);
        assert.deepEqual(aResultActions, aExpectedActions, "Returns the expected value");
    });

    QUnit.test("Two personalizable Groups", function (assert) {
        var aGivenActions = [
            { id: "moveTile_action" },
            { id: "Test1" },
            { id: "Test2" }
        ];
        var aExpectedActions = [
            { id: "moveTile_action" },
            { id: "Test1" },
            { id: "Test2" }
        ];
        this.oGetPersonalizableGroupsStub.returns([1, 2]);
        var aResultActions = Object.getPrototypeOf(ActionMode)._filterActions.call(this.oGivenContext, aGivenActions, this.oGivenTileControl);
        assert.deepEqual(aResultActions, aExpectedActions, "Returns the expected value");
    });
});
