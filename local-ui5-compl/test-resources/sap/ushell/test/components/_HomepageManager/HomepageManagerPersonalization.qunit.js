// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileoverview QUnit tests for "sap.ushell.components.HomepageManager"
 * This file tests partially _changeGroupTitle and _moveTile
 * @deprecated since 1.120
 */
sap.ui.define([
    "sap/ushell/components/HomepageManager",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/utils",
    "sap/ushell/EventHub",
    "sap/base/util/deepClone",
    "sap/ushell/Container"
], function (
    HomepageManager,
    JSONModel,
    ushellUtils,
    EventHub,
    deepClone,
    Container
) {
    "use strict";

    /* global QUnit, sinon */

    QUnit.dump.maxDepth = 10;

    var sandbox = sinon.createSandbox({});

    function beforeEach () {
        this.oGetServiceStub = sandbox.stub(Container, "getServiceAsync");
        this.oGetServiceStub.withArgs("FlpLaunchPage").resolves({
            registerTileActionsProvider: sandbox.stub(),
            isLinkPersonalizationSupported: sandbox.stub()
        });

        this.oModel = new JSONModel({});
        this.oComponent = new HomepageManager(null, { model: this.oModel });
    }

    function afterEach () {
        this.oComponent.destroy();
        this.oModel.destroy();
        sandbox.restore();
    }

    QUnit.module("_changeGroupTitle", {
        beforeEach: function () {
            beforeEach.call(this);
            this.aGroups = [{
                groupId: "0",
                title: "default",
                tiles: ["tile0"],
                links: ["link0"]
            }, {
                groupId: "1",
                title: "nondefault",
                tiles: ["tile1"],
                links: ["link1"],
                isLastGroup: true
            }];
            this.aGroups.indexOfDefaultGroup = 0;
            this.oModel.setProperty("/groups", this.aGroups);

            var oBackendGroup = {
                fromBackend: true,
                title: "some backend title",
                tiles: [],
                links: []
            };
            this.oAddGroupAtStub = sandbox.stub().returns({
                then: sandbox.stub().callsArgWith(0, oBackendGroup)
            });
            this.oComponent.oPageOperationAdapter = {
                addGroupAt: this.oAddGroupAtStub
            };
            this.oAddRequestStub = sandbox.stub(this.oComponent, "_addRequest");
            this.oCheckRequestQueueStub = sandbox.stub(this.oComponent, "_checkRequestQueue");
            this.oHandleAfterSortableStub = sandbox.stub(this.oComponent, "_handleAfterSortable").returnsArg(0);
            this.oRefreshSpy = sandbox.spy(this.oModel, "refresh");
        },
        afterEach: function () {
            afterEach.call(this);
        }
    });

    QUnit.test("Updates the model and adds a request", function (assert) {
        // Arrange
        var oData = {
            groupId: "1",
            newTitle: "some new title"
        };

        // Act
        this.oComponent._changeGroupTitle(null, null, oData);
        // Assert
        assert.strictEqual(this.oAddRequestStub.callCount, 1, "_addRequest was called once");
        assert.strictEqual(this.oModel.getProperty("/groups/1/title"), "some new title", "saved the title");
    });

    QUnit.test("Calls the request handler", function (assert) {
        // Arrange
        this.oAddRequestStub.callsArg(0);
        var oData = {
            groupId: "1",
            newTitle: "some new title"
        };

        // Act
        this.oComponent._changeGroupTitle(null, null, oData);
        // Assert
        var oGroup = this.oModel.getProperty("/groups/1");

        assert.deepEqual(this.oAddGroupAtStub.getCall(0).args, [oGroup, undefined, false], "addGroupAt was called with correct args");
        assert.strictEqual(oGroup.fromBackend, true, "saved additional property from backend");
        assert.strictEqual(oGroup.title, "some backend title", "title was overwritten from backend");
        assert.deepEqual(oGroup.tiles, ["tile1"], "tile array was not overwritten");
        assert.deepEqual(oGroup.links, ["link1"], "link array was not overwritten");
        assert.strictEqual(this.oRefreshSpy.callCount, 1, "refresh was called once");

        assert.strictEqual(this.oCheckRequestQueueStub.callCount, 2, "_checkRequestQueue was callled twice");
    });

    QUnit.test("Calls the request handler during sorting", function (assert) {
        // Arrange
        var oHandlerStub = sandbox.stub();
        this.oHandleAfterSortableStub.withArgs(sinon.match.any).returns(oHandlerStub);
        this.oAddRequestStub.callsArg(0);
        var oData = {
            groupId: "1",
            newTitle: "some new title"
        };

        // Act
        this.oComponent._changeGroupTitle(null, null, oData);
        // Assert
        assert.strictEqual(this.oCheckRequestQueueStub.callCount, 1, "_checkRequestQueue was callled once");
    });

    QUnit.module("_moveTile", {
        beforeEach: function () {
            beforeEach.call(this);
            this.oDestroyStub = sandbox.stub();
            this.aGroups = [{
                groupId: "group0",
                title: "newly created group",
                tiles: [],
                links: [],
                object: null
            }, {
                groupId: "group1",
                title: "nondefault",
                tiles: [{
                    uuid: "tile1"
                }],
                links: [],
                isLastGroup: true,
                object: {}
            }];
            this.oModel.setData({
                groups: this.aGroups,
                tileActionModeActive: false,
                personalization: true
            });

            this.oCalcVisibilityModesStub = sandbox.stub(ushellUtils, "calcVisibilityModes").returns([true, true]);
            this.oHandleTilesVisibilityStub = sandbox.stub(ushellUtils, "handleTilesVisibility");
            this.oEventHubEmitStub = sandbox.stub(EventHub, "emit");
            this.oAddRequestStub = sandbox.stub(this.oComponent, "_addRequest");

            this.oThenStub = sandbox.stub();
            this.oMoveTileStub = sandbox.stub().returns({
                then: this.oThenStub
            });
            this.oComponent.oPageOperationAdapter = {
                moveTile: this.oMoveTileStub
            };
            this.oCheckRequestQueueStub = sandbox.stub(this.oComponent, "_checkRequestQueue");
        },
        afterEach: function () {
            afterEach.call(this);
        }
    });

    QUnit.test("Changes the model after: Dragging the last tile from group \"1\" to group \"0\"", function (assert) {
        // Arrange
        sandbox.useFakeTimers();
        var oData = {
            sTileId: "tile1",
            sToItems: "tiles",
            sFromItems: "tiles",
            sTileType: "tile",
            toGroupId: "group0",
            toIndex: 0,
            longDrop: true
        };

        var aExpectedGroups = [{
            groupId: "group0",
            links: [],
            object: null,
            tiles: [{
                uuid: "tile1"
            }],
            title: "newly created group",
            visibilityModes: [true, true]
        }, {
            groupId: "group1",
            isLastGroup: true,
            links: [],
            object: {},
            tiles: [],
            title: "nondefault",
            visibilityModes: [true, true]
        }];
        // Act
        this.oComponent._moveTile(null, null, oData);
        // Assert
        assert.strictEqual(this.oAddRequestStub.callCount, 1, "_addRequest was called once");
        var aGroups = this.oModel.getProperty("/groups");
        assert.deepEqual(aGroups, aExpectedGroups, "groups were adapted successfully");

        assert.deepEqual(this.oCalcVisibilityModesStub.getCall(0).args, [this.aGroups[1], true], "calcVisibilityModes was called the first time with correct args");
        assert.deepEqual(this.oCalcVisibilityModesStub.getCall(1).args, [this.aGroups[0], true], "calcVisibilityModes was called the second time  with correct args");
        assert.deepEqual(this.oEventHubEmitStub.getCall(0).args, ["updateGroups", Date.now()], "emit was called with correct args");
        assert.deepEqual(this.oHandleTilesVisibilityStub.callCount, 1, "handleTilesVisibility was called once");
    });

    QUnit.test("Calls the request handler after: Dragging the last tile from group \"1\" to group \"0\"", function (assert) {
        // Arrange
        var oData = {
            sTileId: "tile1",
            sToItems: "tiles",
            sFromItems: "tiles",
            sTileType: "tile",
            toGroupId: "group0",
            toIndex: 0,
            longDrop: true
        };

        var oNewTile = {
            content: { id: "someContent" },
            originalTileId: "tile1_orignal",
            object: { id: "tile object" }
        };
        this.oThenStub.callsArgWith(0, oNewTile);

        var oPageInstance = {
            id: "group object"
        };

        this.oComponent._moveTile(null, null, oData);

        // modify group to simulate addGroup backend result
        var oGroup = deepClone(this.oModel.getProperty("/groups/0"));
        oGroup.object = oPageInstance;
        this.oModel.setProperty("/groups/0", oGroup);
        var fnHandler = this.oAddRequestStub.getCall(0).args[0];

        // Act
        fnHandler();

        // Assert
        var oExpectedIndexInfo = {
            newTileIndex: 0,
            tileIndex: 0
        };
        var aMoveTileStubArgs = this.oMoveTileStub.getCall(0).args;
        assert.deepEqual(aMoveTileStubArgs[1], oExpectedIndexInfo, "moveTile was called with the correct index info");
        assert.strictEqual(aMoveTileStubArgs[2], this.oModel.getProperty("/groups/1"), "moveTile was called with the correct source group object reference");
        assert.strictEqual(aMoveTileStubArgs[3], this.oModel.getProperty("/groups/0"), "moveTile was called with the correct target group object reference");
        assert.strictEqual(this.oModel.getProperty("/groups/0/tiles/0/object"), oNewTile.object, "object was saved to the model");
        assert.strictEqual(this.oModel.getProperty("/groups/0/tiles/0/originalTileId"), oNewTile.originalTileId, "originalTileId was saved to the model");
        assert.strictEqual(this.oModel.getProperty("/groups/0/tiles/0/content/0"), oNewTile.content, "content was saved to the model");
        assert.strictEqual(this.oModel.getProperty("/groups/0/tiles/0/tileIsBeingMoved"), false, "tileIsBeingMoved flag was reset");

        assert.strictEqual(this.oCheckRequestQueueStub.callCount, 1, "_checkRequestQueue was callled once");
    });
});

