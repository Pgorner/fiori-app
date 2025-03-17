// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @deprecated As of version 1.120
 * @fileoverview Classical home page layout qUnit test
 */
sap.ui.define([
    "sap/m/GenericTile",
    "sap/m/library",
    "sap/ui/core/mvc/Controller",
    "sap/ui/qunit/utils/nextUIUpdate",
    "sap/ushell/Container",
    "sap/ushell/Layout",
    "sap/ushell/ui/launchpad/TileContainer"
], function (
    GenericTile,
    mobileLibrary,
    Controller,
    nextUIUpdate,
    Container,
    Layout,
    TileContainer
) {
    "use strict";

    /* global QUnit, sinon */

    // shortcut for sap.m.HeaderLevel
    var HeaderLevel = mobileLibrary.HeaderLevel;

    // shortcut for sap.m.GenericTileMode
    var GenericTileMode = mobileLibrary.GenericTileMode;

    var sandbox = sinon.createSandbox({});

    function Tile (size, text) {
        this.size = size;
        this._long = this.size === "2x1";
        this.domRef = document.createElement("div");
        this.oData = {};
        this.metadata = {
            getName: sandbox.stub()
        };
    }
    Tile.prototype = {
        getLong: function () {
            return this._long;
        },
        getDomRef: function () {
            return this.domRef;
        },
        data: function (prop, val) {
            this.oData[prop] = val;
        },
        getParent: sandbox.stub(),
        getMetadata: function () {
            return this.metadata;
        }
    };

    function Group (tiles) {
        this._innerContainer = document.createElement("div");
        this.tiles = tiles;
        this.oData = {};
    }
    Group.prototype = {
        getInnerContainersDomRefs: function () {
            return this._innerContainer;
        },
        getTiles: function () {
            return this.tiles;
        },
        data: function (prop, val) {
            this.oData[prop] = val;
        },
        getShowPlaceholder: function () {
            return false;
        },
        getIsGroupLocked: function () {
            return false;
        },
        $: function () {
            return document.createElement("div");
        }
    };

    QUnit.module("sap.ushell.components.tiles.layout.Layout", {
        beforeEach: function (assert) {
            var done = assert.async();
            Container.init("local")
                .then(function () {
                    this.oContainerElement = document.createElement("div");
                    this.oContainerElement.setAttribute("id", "layoutWrapper");
                    this.oContainerElement.style.width = "1800px";
                    document.body.appendChild(this.oContainerElement);
                    var demiItemData = {
                        showHeader: false,
                        showPlaceholder: false,
                        showGroupHeader: true,
                        groupHeaderLevel: HeaderLevel.H3,
                        showNoData: true,
                        tiles: {},
                        supportLinkPersonalization: true
                    };
                    this.oTileContainer = new TileContainer(demiItemData);
                    Layout.init({ getGroups: function () { return []; }, container: this.oContainerElement }).then(function () {
                        done();
                    });
                }.bind(this));
        },

        afterEach: function () {
            document.body.removeChild(this.oContainerElement);
            this.oTileContainer.destroy();
            delete Layout.cfg;
            delete Layout.container;
            Layout.isInited = false;
            sandbox.restore();
        }
    });

    QUnit.test("Test _addLinkToHashMap", async function (assert) {
        var collidedLinksHashMap = [];
        var oLink = new GenericTile({
            mode: GenericTileMode.LineMode,
            subheader: "subtitle 1",
            header: "header 1"
        });
        this.oTileContainer.addLink(oLink);
        this.oTileContainer.placeAt("layoutWrapper");

        await nextUIUpdate();

        Layout.layoutEngine._addLinkToHashMap(collidedLinksHashMap, this.oTileContainer, { width: 100 }, 0, oLink);
        assert.ok(collidedLinksHashMap[0].length === 7, "link og width 100 should be duplicated 7=((100+20)/20 + 1) times in the map");
        assert.ok(collidedLinksHashMap[0][3].leftSide, "the left area of the link is marked with leftSide flag");
        assert.ok(!collidedLinksHashMap[0][4].leftSide, "the right area of the link is marked with leftSide==flase flag");
    });

    QUnit.test("Test handlePlaceHolder", function (assert) {
        var removeLinkDropMarkerStub = sandbox.stub(Layout.layoutEngine, "_removeLinkDropMarker").returns(true);
        var handlePlaceholderChangeStub = sandbox.stub(Layout.layoutEngine, "handlePlaceholderChange").returns(true);
        var changeLinkPlaceholderStub = sandbox.stub(Layout.layoutEngine, "_changeLinkPlaceholder").returns(true);

        Layout.layoutEngine.endAreaChanged = true;
        Layout.layoutEngine.endArea = "tiles";
        Layout.layoutEngine.handlePlaceHolder();
        assert.ok(removeLinkDropMarkerStub.calledOnce, "should be called once");
        assert.ok(handlePlaceholderChangeStub.calledOnce, "should be called once");
        assert.ok(!changeLinkPlaceholderStub.calledOnce, "should not be called");
        removeLinkDropMarkerStub.reset();
        handlePlaceholderChangeStub.reset();
        changeLinkPlaceholderStub.reset();

        Layout.layoutEngine.intersectedLink = true;
        Layout.layoutEngine.endAreaChanged = true;
        Layout.layoutEngine.endArea = "links";
        Layout.layoutEngine.handlePlaceHolder();
        assert.ok(changeLinkPlaceholderStub.calledOnce, "should be called once");
        assert.ok(handlePlaceholderChangeStub.calledOnce, "should be called once");
        assert.ok(!removeLinkDropMarkerStub.calledOnce, "should not be called");
        removeLinkDropMarkerStub.reset();
        handlePlaceholderChangeStub.reset();
        changeLinkPlaceholderStub.reset();

        Layout.layoutEngine.endArea = "tiles";
        Layout.layoutEngine.endAreaChanged = false;
        Layout.layoutEngine.handlePlaceHolder();
        assert.ok(!changeLinkPlaceholderStub.calledOnce, "should not be called");
        assert.ok(handlePlaceholderChangeStub.calledOnce, "should be called once");
        assert.ok(!removeLinkDropMarkerStub.calledOnce, "should not be called");
        removeLinkDropMarkerStub.reset();
        handlePlaceholderChangeStub.reset();
        changeLinkPlaceholderStub.reset();

        Layout.layoutEngine.endArea = "links";

        Layout.layoutEngine.handlePlaceHolder();
        assert.ok(changeLinkPlaceholderStub.calledOnce, "should not be called");
        assert.ok(!handlePlaceholderChangeStub.calledOnce, "should be called once");
        assert.ok(!removeLinkDropMarkerStub.calledOnce, "should not be called");
    });

    QUnit.test("Test _getDestinationIndex", function (assert) {
        var oLink = new GenericTile({
            mode: GenericTileMode.LineMode,
            subheader: "subtitle 1",
            header: "header 1"
        });
        var oGetDestinationTileIndexStub = sandbox.stub(Layout.layoutEngine, "_getDestinationTileIndex").returns(true);

        Layout.layoutEngine._getDestinationIndex("tiles");
        assert.ok(oGetDestinationTileIndexStub.called, "if the passed param is not 'links' then '_getDestinationTileIndex' function should compute the return value");

        this.oTileContainer.addLink(oLink);
        Layout.layoutEngine.item = oLink;
        Layout.layoutEngine.endGroup = this.oTileContainer;

        Layout.layoutEngine.intersectedLink = undefined;
        assert.ok(Layout.layoutEngine._getDestinationIndex("links"), "the return value should be the number of links in endGroup");

        Layout.layoutEngine.intersectedLink = {
            link: oLink,
            leftSide: false
        };
        assert.ok(Layout.layoutEngine._getDestinationIndex("links") === 0, "the return value should be 0 because intersectedl.id === draggedLink.id and we dropped on the right");
    });

    QUnit.test("Test _handleLinkAreaIntersection", function (assert) {
        sandbox.stub(Layout.layoutEngine, "_getIntersectedLink").returns(true);
        var oMapGroupLinksStub = sandbox.stub(Layout.layoutEngine, "_mapGroupLinks").returns(true);
        var oMarkEmptyLinkArea = sandbox.stub(Layout.layoutEngine, "_markEmptyLinkArea").returns(true);

        Layout.layoutEngine.matrix = {};
        Layout.layoutEngine._handleLinkAreaIntersection(this.oTileContainer, 0, 0);

        assert.ok(Layout.layoutEngine.intersectedLink, "if intersected link is found then we should save it");
        assert.ok(oMapGroupLinksStub.called, "we should map the group links");
        assert.ok(oMarkEmptyLinkArea.called, "we should mark empty lionk area");
    });

    QUnit.test("Test _isLinksEquals", function (assert) {
        var oLinkA = {
            link: new GenericTile({
                mode: GenericTileMode.LineMode,
                subheader: "subtitle 1",
                header: "header 1"
            })
        };
        var oLinkB = {
            link: new GenericTile({
                mode: GenericTileMode.LineMode,
                subheader: "subtitle 2",
                header: "header 2"
            })
        };
        assert.ok(!Layout.layoutEngine._isLinksEquals(oLinkA, oLinkB), "links should be different");
        assert.ok(Layout.layoutEngine._isLinksEquals(oLinkA, oLinkA), "links should be equal");
        oLinkA.link.destroy();
        oLinkB.link.destroy();
    });

    QUnit.test("Test _markEmptyLinkArea", async function (assert) {
        this.oTileContainer.placeAt("layoutWrapper");

        await nextUIUpdate();

        Layout.layoutEngine._markEmptyLinkArea(this.oTileContainer);
        assert.ok(document.getElementsByClassName("sapUshellEmptyLinkAreaHover").length, "there's no links, therefor this container should be marked with 'sapUshellEmptyLinkAreaHover' class");
    });

    QUnit.test("Test _removeEmptyLinkAreaMark", async function (assert) {
        this.oTileContainer.placeAt("layoutWrapper");

        await nextUIUpdate();

        Layout.layoutEngine._markEmptyLinkArea(this.oTileContainer);
        assert.ok(document.getElementsByClassName("sapUshellEmptyLinkAreaHover").length, "there's no links, therefor this container should be marked with 'sapUshellEmptyLinkAreaHover' class");
        Layout.layoutEngine._removeEmptyLinkAreaMark(this.oTileContainer);
        assert.ok(!document.getElementsByClassName("sapUshellEmptyLinkAreaHover").length, "this container should not be marked with 'sapUshellEmptyLinkAreaHover' class");
    });

    QUnit.test("Test saveLinkBoundingRects", async function (assert) {
        var oLink = new GenericTile({
            mode: GenericTileMode.LineMode,
            subheader: "subtitle 1",
            header: "header 1"
        });
        oLink.placeAt("layoutWrapper");

        await nextUIUpdate();

        Layout.layoutEngine.saveLinkBoundingRects(oLink.getDomRef());
        assert.ok(Layout.layoutEngine.draggedLinkBoundingRects);//we should only test that the object was created (the rest is up to UI5)
        oLink.destroy();
    });

    QUnit.test("Test _getLinkDropMarkerElement", function (assert) {
        var elDropMarker = Layout.layoutEngine._getLinkDropMarkerElement();
        assert.ok(elDropMarker.id === "sapUshellLinkDropMarker", "the id should be 'sapUshellLinkDropMarker' and cannot be change without changing it in all relevant places");
    });

    QUnit.test("Test _removeLinkDropMarker", function (assert) {
        var elDropMarker = Layout.layoutEngine._getLinkDropMarkerElement();
        this.oContainerElement.appendChild(elDropMarker);
        assert.ok(document.getElementById(elDropMarker.getAttribute("id")), "dropmarker should be on dom");
        Layout.layoutEngine._removeLinkDropMarker();
        assert.ok(!document.getElementById(elDropMarker.getAttribute("id")), "dropmarker should not be on dom");
    });

    QUnit.test("Test _getLinkBoundingRects - case: current dragged item id not equals given link id", async function (assert) {
        var oLinkA = new GenericTile({
            mode: GenericTileMode.LineMode,
            subheader: "subtitle 1",
            header: "header 1"
        });
        sandbox.stub(oLinkA, "getBoundingRects").returns({
            id: "identifier2",
            length: 0
        });
        Layout.layoutEngine.draggedLinkBoundingRects = {
            id: "identifier1",
            length: 0
        };
        this.oTileContainer.addLink(oLinkA);
        this.oTileContainer.placeAt("layoutWrapper");

        await nextUIUpdate();

        var boundingRects = Layout.layoutEngine._getLinkBoundingRects(oLinkA, this.oTileContainer);
        assert.ok(boundingRects.id === "identifier2", "the dragged item is not equal to oLinkA, therefor we should get the bounding rect of oLinkA");
        Layout.layoutEngine.item = oLinkA;
        boundingRects = Layout.layoutEngine._getLinkBoundingRects(oLinkA, this.oTileContainer);
        assert.ok(boundingRects.id === "identifier1", "the dragged item is equal to oLinkA, therefor we should get the bounding rect of the dragged item");
    });

    QUnit.test("Test switchLinkWithClone", async function (assert) {
        var oLink = new GenericTile({
            mode: GenericTileMode.LineMode,
            subheader: "subtitle 1",
            header: "header 1"
        });
        oLink.placeAt("layoutWrapper");

        await nextUIUpdate();

        assert.ok(oLink.getDomRef(), "oLink should be on the dom");
        Layout.layoutEngine.switchLinkWithClone(oLink);
        assert.ok(!oLink.getDomRef(), "oLink should not be on the dom");
        var oIntersectedLinkPlaceHolder = document.getElementById("sapUshellIntersectedLinkPlaceHolder");
        assert.ok(oIntersectedLinkPlaceHolder, "the clone should be on the dom");
        oLink.destroy();
    });

    QUnit.test("Test isAreaChanged", function (assert) {
        var oLink = new GenericTile({
            mode: GenericTileMode.LineMode,
            subheader: "subtitle 1",
            header: "header 1"
        });
        Layout.layoutEngine.currentArea = undefined;
        Layout.layoutEngine.endArea = "links";
        assert.ok(!Layout.layoutEngine.isAreaChanged(oLink), "area was not changed if currentArea = undefined");
        Layout.layoutEngine.currentArea = "links";
        Layout.layoutEngine.endArea = undefined;
        assert.ok(!Layout.layoutEngine.isAreaChanged(oLink), "area was not changed if endArea = undefined");
        Layout.layoutEngine.currentArea = "links";
        Layout.layoutEngine.endArea = "tiles";
        assert.ok(Layout.layoutEngine.isAreaChanged(oLink), "area has changed");
        Layout.layoutEngine.currentArea = "links";
        Layout.layoutEngine.endArea = "links";
        assert.ok(!Layout.layoutEngine.isAreaChanged(oLink), "area did not change");
        oLink.destroy();
    });

    QUnit.test("Test _mapGroupLinks", async function (assert) {
        var oLink = new GenericTile({
            mode: GenericTileMode.LineMode,
            subheader: "subtitle 1",
            header: "header 1"
        });
        sandbox.stub(Layout.layoutEngine, "_addLinkToHashMap").returns(true);
        this.oTileContainer.placeAt("layoutWrapper");
        this.oTileContainer.addLink(oLink);
        await nextUIUpdate();
        Layout.layoutEngine._mapGroupLinks(this.oTileContainer);
        // we test only that the group was added. '_addLinkToHashMap' is responsible for population of the object we added to the map so in it's qUnit we will test the rest of the hash mechanism logic
        assert.ok(Layout.layoutEngine.collidedLinkAreas[this.oTileContainer.getId()], "group was added to the map");
    });

    QUnit.test("Test _isLinkAreaIntersection", async function (assert) {
        var oLink = new GenericTile({
            mode: GenericTileMode.LineMode,
            subheader: "subtitle 1",
            header: "header 1"
        });
        this.oTileContainer.placeAt("layoutWrapper");
        this.oTileContainer.addLink(oLink);
        await nextUIUpdate();
        var containerRect = oLink.getDomRef().getBoundingClientRect();
        var bIntesected = Layout.layoutEngine._isLinkAreaIntersection(this.oTileContainer, containerRect.left, containerRect.top);
        assert.ok(bIntesected, "we intersected link area");
    });

    QUnit.test("Test _changeLinkPlaceholder", async function (assert) {
        var oLink = {
            link: new GenericTile({
                mode: GenericTileMode.LineMode,
                subheader: "subtitle 1",
                header: "header 1"
            })
        };
        this.oTileContainer.addLink(oLink.link);
        Layout.layoutEngine.aLinksBoundingRects[oLink.link.getId()] = {
            left: 1,
            topLeft: 2,
            right: 3,
            topRight: 4
        };
        this.oTileContainer.placeAt("layoutWrapper");

        await nextUIUpdate();

        Layout.layoutEngine.LinkDropMarker = Layout.layoutEngine._getLinkDropMarkerElement();
        oLink.leftSide = true;
        Layout.layoutEngine._changeLinkPlaceholder(oLink, this.oTileContainer);
        var oLinkDropMarker = Layout.layoutEngine.LinkDropMarker;
        assert.strictEqual(oLinkDropMarker.style.left, "1px");
        assert.strictEqual(oLinkDropMarker.style.top, "2px");
        oLink.leftSide = false;
        Layout.layoutEngine._changeLinkPlaceholder(oLink, this.oTileContainer);
        oLinkDropMarker = Layout.layoutEngine.LinkDropMarker;
        assert.strictEqual(oLinkDropMarker.style.left, "3px");
        assert.strictEqual(oLinkDropMarker.style.top, "4px");
    });

    QUnit.test("Test getCollisionObject - behavior when TabBar is active or not", function (assert) {
        sandbox.stub(Layout.getLayoutEngine(), "_isTabBarCollision").returns(true);
        var oIsTabBarActiveStub = sandbox.stub(Layout.getLayoutEngine().thisLayout, "isTabBarActive").returns(true);
        var oGetGroupCollisionObjectStub = sandbox.stub(Layout.getLayoutEngine(), "_getGroupCollisionObject");
        sandbox.stub(window, "clearTimeout").returns(true);
        var oGetCollisionObjectResult;

        Layout.oTabBarItemClickTimer = {};
        oGetCollisionObjectResult = Layout.getLayoutEngine().getCollisionObject();
        assert.ok(oGetCollisionObjectResult.collidedObjectType === "TabBar", "On TabBar collision - the string TabBar is returned");
        assert.ok(clearTimeout.calledOnce === true, "On entering getCollisionObject - clearing the timeout if oTabBarItemClickTimer is true");

        oIsTabBarActiveStub.restore();

        // Not TabBar collision use-case
        oIsTabBarActiveStub = sandbox.stub(Layout.getLayoutEngine().thisLayout, "isTabBarActive").returns(false);
        Layout.oTabBarItemClickTimer = undefined;

        oGetCollisionObjectResult = Layout.getLayoutEngine().getCollisionObject(100, 200);
        assert.ok(oGetGroupCollisionObjectStub.calledOnce === true, "When not TabBar collision - _getGroupCollisionObject called");
        assert.ok(oGetGroupCollisionObjectStub.args[0][0] === 100, "When not TabBar collision - _getGroupCollisionObject called with correct moveX");
        assert.ok(oGetGroupCollisionObjectStub.args[0][1] === 200, "When not TabBar collision - _getGroupCollisionObject called with correct moveY");
        assert.ok(clearTimeout.calledOnce === true, "On entering getCollisionObject - not clearing the timeout if oTabBarItemClickTimer is not defined");
    });

    QUnit.test("Test _getGroupCollisionObject", function (assert) {
        var bIsGroupLockedResult = true;
        sandbox.stub(Layout.getLayoutEngine(), "_getCollidedGroup").returns({
            groupId: "group1",
            getIsGroupLocked: function () {
                return bIsGroupLockedResult;
            },
            getTiles: function () {
                return [];
            },
            getShowPlaceholder: function () {
                return null;
            }
        });
        var oIsLinkAreaIntersectionStub = sandbox.stub(Layout.getLayoutEngine(), "_isLinkAreaIntersection").returns(true);

        var oGetCollidedGroupResult = Layout.getLayoutEngine()._getGroupCollisionObject(100, 200);
        assert.ok(oGetCollidedGroupResult === undefined, "_getGroupCollisionObject return undefined when the collided group is locked");

        // Group is not locked
        bIsGroupLockedResult = false;
        oGetCollidedGroupResult = Layout.getLayoutEngine()._getGroupCollisionObject(100, 200);
        assert.ok(oGetCollidedGroupResult.collidedObjectType === "Group-link", "Returned collidedObjectType is Group-link, according to _isLinkAreaIntersection");
        assert.ok(oGetCollidedGroupResult.collidedObject.groupId === "group1", "Correct group object returned");

        oIsLinkAreaIntersectionStub.restore();
        oIsLinkAreaIntersectionStub = sandbox.stub(Layout.getLayoutEngine(), "_isLinkAreaIntersection").returns(false);
        oGetCollidedGroupResult = Layout.getLayoutEngine()._getGroupCollisionObject(100, 200);
        assert.ok(oGetCollidedGroupResult.collidedObjectType === "Group-tile", "Returned collidedObjectType is Group-tile, according to _isLinkAreaIntersection");
    });

    QUnit.test("Test _handleTabBarCollision", function (assert) {
        var oClock = sandbox.useFakeTimers();
        var oTabBarItem = {
            getAttribute: function (sAttrId) {
                if (sAttrId === "modelGroupId") {
                    return "modelId";
                }
                return undefined;
            },
            classList: {
                add: sandbox.stub()
            }
        };
        var oTabBarItem2 = {
            getAttribute: function (sAttrId) {
                if (sAttrId === "modelGroupId") {
                    return "modelId2";
                }
                return undefined;
            },
            classList: {
                add: sandbox.stub()
            }
        };
        var oGetPathSpy = sandbox.spy();
        var oItemModelSetPropertySpy = sandbox.spy();
        var oItemGetBindingContext = function () {
            return {
                getPath: oGetPathSpy,
                oModel: {
                    setProperty: oItemModelSetPropertySpy
                }
            };
        };
        var oGetTabBarHoverItemStub = sandbox.stub(Layout.getLayoutEngine(), "_getTabBarHoverItem").returns(oTabBarItem);
        sandbox.stub(Layout.getLayoutEngine(), "_getTabBarGroupIndexByModelId").returns(8);
        sandbox.stub(Layout, "setOnTabBarElement").returns({});
        sandbox.stub(Layout.getLayoutEngine(), "_handleOverflowCollision").returns(false);
        sandbox.stub(Layout.getLayoutEngine(), "_prepareDomForDragAndDrop").returns();
        sandbox.stub(Layout.getLayoutEngine(), "_getSelectedTabBarItem").returns(oTabBarItem);
        var bIsGroupLockedResult = false;
        sandbox.stub(Layout.getLayoutEngine(), "_getDropTargetGroup").returns({
            groupId: "groupId"
        });
        sandbox.stub(Layout, "getGroupTiles").returns([]);
        sandbox.stub(Layout.getLayoutEngine(), "_getModelGroupById").returns({
            isGroupLocked: bIsGroupLockedResult
        });
        sandbox.stub(Layout.getLayoutEngine(), "_toggleAnchorItemHighlighting");
        var oRemoveAggregationSpy = sandbox.spy();

        Layout.getLayoutEngine().item = {
            getBindingContext: oItemGetBindingContext,
            getDomRef: sandbox.stub()
        };
        Layout.getLayoutEngine().startGroup = {
            removeAggregation: oRemoveAggregationSpy,
            getGroupId: function () {
                return "startGroupId";
            }
        };

        // Test flow 1:
        // Calling _handleTabBarCollision, in which passing 800ms are passed and the collided tab is the one which is already highlighted.
        // The test itself is verifying that the function returns before long-drag use-case is being processed
        Layout.getLayoutEngine().lastHighlitedTabItem = oTabBarItem;
        Layout.getLayoutEngine()._handleTabBarCollision();
        oClock.tick(1000);
        assert.ok(oGetPathSpy.callCount === 0, "If lastHighlitedTabItem equals _getSelectedTabBarItem - then return");
        assert.ok(oRemoveAggregationSpy.callCount === 0, "If lastHighlitedTabItem equals _getSelectedTabBarItem - then the tile is not removed from the source group");

        // Test flow 2:
        // Calling _handleTabBarCollision, in which passing 800ms are passed and the collided tab is NOT the one which is already highlighted.
        // The test itself is verifying that the function perform the switch-tab flow
        oGetTabBarHoverItemStub.restore();
        oGetTabBarHoverItemStub = sandbox.stub(Layout.getLayoutEngine(), "_getTabBarHoverItem").returns(oTabBarItem2);
        Layout.getLayoutEngine()._handleTabBarCollision();
        oClock.tick(1000);
        assert.ok(oGetPathSpy.callCount === 1, "If lastHighlitedTabItem does not equal _getSelectedTabBarItem - continue proccessing of long-drag");
        assert.ok(oRemoveAggregationSpy.callCount === 1, "If lastHighlitedTabItem does not equal _getSelectedTabBarItem - then the tile is removed from the source group");
    });

    QUnit.test("styleInfo Test", function (assert) {
        //Layout.init({getGroups: function(){}, container: document.body});
        var styleInfo = Layout.getStyleInfo(document.body);
        assert.ok(typeof styleInfo === "object");
        assert.ok(typeof styleInfo.tileMarginWidth === "number");
        assert.ok(typeof styleInfo.tileMarginHeight === "number");
        assert.ok(typeof styleInfo.tileWidth === "number" && styleInfo.tileWidth > 0);
        assert.ok(typeof styleInfo.tileHeight === "number" && styleInfo.tileHeight > 0);
        assert.ok(typeof styleInfo.containerWidth === "number" && styleInfo.containerWidth > 0);
    });

    QUnit.test("organizeGroup Test", function (assert) {
        var tile1 = new Tile("1x1");
        var tile2 = new Tile("2x1");
        Layout.tilesInRow = 5;
        var matrix = Layout.organizeGroup([tile1, tile2]);
        assert.ok(matrix[0][0] === tile1);
        assert.ok(matrix[0][1] === tile2);
        assert.ok(matrix[0][2] === tile2);
    });

    QUnit.test("calcTilesInRow Test", function (assert) {
        var tilesInRow = Layout.calcTilesInRow(500, 130, 5);
        assert.ok(tilesInRow === 3);
        tilesInRow = Layout.calcTilesInRow(5000, 130, 5);
        assert.ok(tilesInRow === 37);
    });

    QUnit.test("Layout calculation Test", function (assert) {
        return Controller.create({
            name: "sap.ushell.components.homepage.DashboardContent"
        }).then(function (oController) {
            oController.getView = sandbox.stub().returns({
                getParent: sandbox.stub().returns({
                    getCurrentPage: sandbox.stub().returns({
                        getViewName: sandbox.stub().returns(function () {
                            return "name";
                        })
                    })
                }),
                getViewName: sandbox.stub().returns(function () {
                    return "otherName";
                }),
                getModel: sandbox.stub().returns({
                    getProperty: sandbox.stub().returns("home")
                })
            });

            try {
                oController.resizeHandler();
            } catch (e) {
                assert.ok(false, "Layout calculation was done not in home page");
            }

            assert.ok(true, "Layout calculation Test");
            oController.destroy();
        }).catch(function () {
            assert.ok(false, "An error occurred.");
        });
    });

    QUnit.test("reRenderGroupsLayout Test", function (assert) {
        var group1 = new Group([new Tile("2x2"), new Tile("1x1")]);
        var group2 = new Group([new Tile("2x2"), new Tile("1x1")]);
        Layout.reRenderGroupsLayout([group1, group2], true);
        assert.ok(typeof group1.oData.containerHeight === "undefined");
        assert.ok(typeof group2.oData.containerHeight === "undefined");
        Layout.reRenderGroupsLayout([group1, group2]);

        var style = Layout.getStyleInfo(Layout.container);
        assert.ok(Layout.styleInfo.containerWidth === style.containerWidth);
        var tilesInRow = Layout.calcTilesInRow(style.containerWidth, style.tileWidth, style.tileMarginWidth);
        assert.ok(Layout.tilesInRow === tilesInRow);
    });

    QUnit.test("getTilePositionInMatrix Test", function (assert) {
        var tile1 = new Tile("1x1");
        var tile2 = new Tile("2x1");
        var tile3 = new Tile("2x1");
        var tile4 = new Tile("2x1");
        var tile5 = new Tile("2x1");
        var tile6 = new Tile("1x1");
        Layout.tilesInRow = 2;
        var matrix = Layout.organizeGroup([tile1, tile2, tile3, tile4, tile5, tile6]);
        var place = Layout.getTilePositionInMatrix(tile1, matrix);
        assert.deepEqual(place, { row: 0, col: 0 });
        place = Layout.getTilePositionInMatrix(tile2, matrix);
        assert.deepEqual(place, { row: 1, col: 0 });
        place = Layout.getTilePositionInMatrix(tile5, matrix);
        assert.deepEqual(place, { row: 4, col: 0 });
    });

    QUnit.test("findTileToPlaceAfter Test", function (assert) {
        var tile1 = new Tile("1x1");
        var tile2 = new Tile("2x1");
        var tile3 = new Tile("1x1");
        var tile4 = new Tile("2x1");
        Layout.tilesInRow = 4;
        var matrix = Layout.organizeGroup([tile1, tile2, tile3, tile4]);
        Layout.layoutEngine.init();
        Layout.layoutEngine.curTouchMatrixCords.column = 2;
        Layout.layoutEngine.curTouchMatrixCords.row = 1;
        var maxTileIndex = Layout.layoutEngine.findTileToPlaceAfter(matrix, [tile1, tile2, tile3, tile4]);
        assert.equal(maxTileIndex, 3);
    });

    QUnit.test("handlePlaceholderChange Test", function (assert) {
        var le = Layout.layoutEngine;
        var tile1 = new Tile("1x1");
        var tile2 = new Tile("1x1");
        var tile3 = new Tile("1x1");
        var tile4 = new Tile("1x1");
        var tile5 = new Tile("2x1");
        var group = new Group([tile1, tile2, tile3, tile4]);
        Layout.tilesInRow = 4;
        var matrix = Layout.organizeGroup([tile1, tile2, tile3, tile4]);
        le.init();
        le.curTouchMatrixCords.column = 2;
        le.curTouchMatrixCords.row = 1;
        le.startGroup = le.currentGroup = le.endGroup = group;
        le.matrix = matrix;
        le.item = tile5;
        le.reorderTilesInDom = sandbox.stub().returns();
        le.handlePlaceholderChange();
        assert.ok(le.matrix[1][1] === tile5);
        le.item = tile4;
        le.curTouchMatrixCords.column = 3;
        le.curTouchMatrixCords.row = 3;
        assert.ok(le.matrix[0][3] === tile4);
    });

    QUnit.test("changeTilesOrder Test", function (assert) {
        var le = Layout.layoutEngine;
        var tile1 = new Tile("1x1");
        var tile2 = new Tile("1x2");
        var tile3 = new Tile("1x1");
        var tile4 = new Tile("2x2");
        var tile5 = new Tile("1x1");
        Layout.tilesInRow = 4;
        var matrix = Layout.organizeGroup([tile1, tile2, tile3, tile4, tile5]);
        le.init();
        le.item = tile5;
        var tilesArray = le.changeTilesOrder(tile5, tile3, [tile1, tile2, tile3, tile4, tile5], matrix);
        assert.ok(tilesArray[2] === tile5);
    });

    QUnit.test("compareArrays Test", function (assert) {
        var le = Layout.layoutEngine;
        assert.equal(le.compareArrays([0, 1, 2, 3, 4], [0, 1, 2, 3, 4, 5]), false);
        assert.equal(le.compareArrays([0, 1, 2, 3, 4], [0, 2, 2, 3, 4]), false);
        assert.equal(le.compareArrays([0, 1, 2, 3, 4], [0, 1, 2, 3, 4]), true);
    });
});
