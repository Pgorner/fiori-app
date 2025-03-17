// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileoverview QUnit tests for "sap.ushell.components.HomepageManager"
 *
 * @deprecated since 1.112
 */
sap.ui.define([
    "sap/ui/model/Context",
    "sap/base/util/extend",
    "sap/ui/core/Core",
    "sap/ui/core/Theming",
    "sap/m/MessageToast",
    "sap/ushell/components/HomepageManager",
    "sap/ushell/components/_HomepageManager/PersistentPageOperationAdapter",
    "sap/ushell/EventHub",
    "sap/ushell/utils",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Container",
    "sap/ushell/components/homepage/ActionMode",
    "sap/ushell/components/ComponentKeysHandler",
    "sap/ushell/resources",
    "sap/ui/thirdparty/jquery",
    "sap/m/GenericTile",
    "sap/m/library",
    "sap/m/TileContent"
], function (
    Context,
    extend,
    Core,
    Theming,
    MessageToast,
    HomepageManager,
    PersistentPageOperationAdapter,
    EventHub,
    ushellUtils,
    JSONModel,
    Container,
    ActionMode,
    ComponentKeysHandler,
    ushellResources,
    jQuery,
    GenericTile,
    mobileLibrary,
    TileContent
) {
    "use strict";

    /* global QUnit, sinon */

    // shortcut for sap.m.GenericTileScope
    var GenericTileScope = mobileLibrary.GenericTileScope;

    var sandbox = sinon.createSandbox();

    // avoid creating the real local LaunchPageAdapter
    function overrideLaunchPageAdapter (oLaunchpageService) {
        extend(oLaunchpageService, {
            moveTile: function () { return jQuery.Deferred().resolve(); },
            getTileView: function () {
                var oDfd = jQuery.Deferred();
                oDfd.resolve({
                    destroy: function () { },
                    attachPress: function () { }
                });
                return oDfd.promise();
            },
            getTileId: function (oTile) {
                if (oTile) {
                    return oTile.id;
                }
                return undefined;
            },
            getTileTarget: function () { },
            getTileTitle: function () {
                return "TileDummyTitle";
            },
            setTileVisible: function () { },
            isTileIntentSupported: function (oTile) {
                return (oTile.properties.formFactor.indexOf("Desktop") !== -1);
            },
            addTile: function (oCatalogTile/*, oGroup*/) {
                var oDfd = jQuery.Deferred();
                oDfd.resolve(oCatalogTile);
                return oDfd.promise();
            },
            isCatalogsValid: function (/*oCatalog*/) {
                return true;
            },
            getGroups: function () {
                return jQuery.Deferred().resolve(mockData.groups);
            },
            addGroup: function (sTitle) {
                var oGroup = {
                    id: sTitle,
                    groupId: sTitle,
                    title: sTitle,
                    tiles: []
                };
                return jQuery.Deferred().resolve(oGroup);
            },
            getCatalogs: function () {
                var oDfd = jQuery.Deferred();

                // Simulate an async function with a loading delay of up to 5 sec
                // Simulates a progress call (the progress function of the promise will be called)
                mockData.catalogs.forEach(function (oCatalog) {
                    window.setTimeout(function () {
                        oDfd.notify(oCatalog);
                    }, 50);
                });
                // TODO: simulate a failure (which will trigger the fail function of the promise)
                //oDfd.reject();

                window.setTimeout(function () {
                    oDfd.resolve(mockData.catalogs);
                }, 350);

                return oDfd.promise();
            },
            getGroupId: function (oGroup) {
                return oGroup.id;
            },
            getDefaultGroup: function () {
                return jQuery.Deferred().resolve([mockData.groups[0]]);
            },
            getGroupTiles: function (oGroup) {
                return oGroup.tiles;
            },
            getGroupTitle: function (oGroup) {
                return oGroup.title;
            },
            setGroupTitle: function (/*oGroup, sTitle*/) {
                var oDfd = jQuery.Deferred();
                oDfd.resolve();
                return oDfd.promise();
            },
            moveGroup: function (/*oGroup, iIndex*/) {
                var oDfd = jQuery.Deferred();
                oDfd.resolve();
                return oDfd.promise();
            },
            removeGroup: function (/*oGroup, iIndex*/) {
                var oDfd = jQuery.Deferred();
                oDfd.resolve();
                return oDfd.promise();
            },
            removeTile: function (/*oGroup, oTile*/) {
                var oDfd = jQuery.Deferred();
                oDfd.resolve();
                return oDfd.promise();
            },
            isGroupRemovable: function () {
                return true;
            },
            getTileSize: function () {
                return "1x1";
            },
            getCatalogTileSize: function () {
                return "1x1";
            },
            getTileDebugInfo: function () {
                return "";
            },
            getCatalogError: function () {
                return "";
            },
            getCatalogId: function (oCatalog) {
                return oCatalog.id;
            },
            getCatalogTitle: function (oCatalog) {
                return oCatalog.title;
            },
            getCatalogTiles: function (oCatalog) {
                return jQuery.Deferred().resolve(oCatalog.tiles);
            },
            getCatalogTileTitle: function (oCatalogTile) {
                return oCatalogTile ? oCatalogTile.id : undefined;
            },
            getCatalogTileKeywords: function () {
                return [];
            },
            getCatalogTileId: function (oCatalogTile) {
                return oCatalogTile ? oCatalogTile.id : undefined;
            },
            getCatalogTileView: function () {
                return { destroy: function () { } };
            },
            isLinkPersonalizationSupported: function (oTile) {
                if (oTile) {
                    return oTile.isLinkPersonalizationSupported;
                }
                return false;
            }
        });
    }

    var oHomepageManager = null,
        oEventBus = Core.getEventBus(),
        mockData,
        oMoveScrollDashboardStub,
        oLaunchPageService;

    QUnit.module("sap.ushell.components.HomepageManager", {
        beforeEach: function (assert) {
            var fnDone = assert.async();
            Container.init("local").then(function () {
                return Promise.all([
                    Container.getServiceAsync("UserRecents"),
                    Container.getServiceAsync("FlpLaunchPage"),
                    ComponentKeysHandler.getInstance()
                ]).then(function (aServices) {
                    var oDivElement = document.createElement("div");
                    oDivElement.setAttribute("id", "layoutWrapper");
                    oDivElement.setAttribute("width", 1800);
                    document.body.appendChild(oDivElement);
                    sandbox.stub(aServices[0], "addAppUsage");
                    oLaunchPageService = aServices[1];
                    overrideLaunchPageAdapter(oLaunchPageService);
                    mockData = {
                        groups: [{
                            id: "group_0",
                            groupId: "group_0",
                            title: "group_0",
                            isGroupVisible: true,
                            isRendered: false,
                            index: 0,
                            object: {
                                id: "group_0",
                                groupId: "group_0",
                                title: "group_0",
                                tiles: [{
                                    id: "tile_00",
                                    uuid: "tile_00",
                                    isTileIntentSupported: true,
                                    object: {
                                        id: "tile_00",
                                        uuid: "tile_00"
                                    },
                                    properties: { formFactor: "Desktop,Phone" },
                                    content: []
                                }, {
                                    id: "tile_01",
                                    uuid: "tile_01",
                                    isTileIntentSupported: false,
                                    object: {
                                        id: "tile_01",
                                        uuid: "tile_01"
                                    },
                                    properties: { formFactor: "Tablet,Phone" },
                                    content: []
                                }, {
                                    id: "tile_02",
                                    uuid: "tile_02",
                                    isTileIntentSupported: true,
                                    object: {
                                        id: "tile_02",
                                        uuid: "tile_02"
                                    },
                                    properties: { formFactor: "Desktop" },
                                    content: []
                                }, {
                                    id: "tile_03",
                                    uuid: "tile_03",
                                    isTileIntentSupported: false,
                                    object: {
                                        id: "tile_03",
                                        uuid: "tile_03"
                                    },
                                    properties: { formFactor: "Phone" },
                                    content: []
                                }, {
                                    id: "tile_04",
                                    uuid: "tile_04",
                                    isTileIntentSupported: true,
                                    object: {
                                        id: "tile_04",
                                        uuid: "tile_04"
                                    },
                                    properties: { formFactor: "Desktop,Tablet" },
                                    content: []
                                }, {
                                    id: "tile_05",
                                    uuid: "tile_05",
                                    isTileIntentSupported: false,
                                    object: {
                                        id: "tile_05",
                                        uuid: "tile_05"
                                    },
                                    properties: { formFactor: "Tablet" },
                                    content: []
                                }, {
                                    id: "tile_100",
                                    uuid: "tile_100",
                                    isTileIntentSupported: true,
                                    isLink: true,
                                    object: {
                                        id: "tile_100",
                                        uuid: "tile_100"
                                    },
                                    properties: { formFactor: "Desktop,Phone" },
                                    content: []
                                }]
                            },
                            tiles: [{
                                id: "tile_00",
                                uuid: "tile_00",
                                isTileIntentSupported: true,
                                object: {
                                    id: "tile_00",
                                    uuid: "tile_00"
                                },
                                properties: { formFactor: "Desktop,Phone" },
                                content: []
                            }, {
                                id: "tile_01",
                                uuid: "tile_01",
                                isTileIntentSupported: false,
                                object: {
                                    id: "tile_01",
                                    uuid: "tile_01"
                                },
                                properties: { formFactor: "Tablet,Phone" },
                                content: []
                            }, {
                                id: "tile_02",
                                uuid: "tile_02",
                                isTileIntentSupported: true,
                                object: {
                                    id: "tile_02",
                                    uuid: "tile_02"
                                },
                                properties: { formFactor: "Desktop" },
                                content: []
                            }, {
                                id: "tile_03",
                                uuid: "tile_03",
                                isTileIntentSupported: false,
                                object: {
                                    id: "tile_03",
                                    uuid: "tile_03"
                                },
                                properties: { formFactor: "Phone" },
                                content: []
                            }, {
                                id: "tile_04",
                                uuid: "tile_04",
                                isTileIntentSupported: true,
                                object: {
                                    id: "tile_04",
                                    uuid: "tile_04"
                                },
                                properties: { formFactor: "Desktop,Tablet" },
                                content: []
                            }, {
                                id: "tile_05",
                                uuid: "tile_05",
                                isTileIntentSupported: false,
                                object: {
                                    id: "tile_05",
                                    uuid: "tile_05"
                                },
                                properties: { formFactor: "Tablet" },
                                content: []
                            }],
                            pendingLinks: [{
                                id: "tile_100",
                                uuid: "tile_100",
                                size: "1x1",
                                isLink: true,
                                object: {
                                    id: "tile_100",
                                    uuid: "tile_100"
                                },
                                properties: { formFactor: "Desktop,Phone" },
                                content: []
                            }],
                            links: [{
                                id: "tile_100",
                                uuid: "tile_100",
                                size: "1x1",
                                isLink: true,
                                object: {
                                    id: "tile_100",
                                    uuid: "tile_100"
                                },
                                properties: { formFactor: "Desktop,Phone" },
                                content: []
                            }]
                        }, {
                            id: "group_1",
                            groupId: "group_1",
                            title: "group_1",
                            isGroupVisible: true,
                            isRendered: false,
                            index: 1,
                            object: {
                                id: "group_1",
                                groupId: "group_1",
                                title: "group_1"
                            },
                            tiles: [],
                            pendingLinks: [],
                            links: []
                        }, {
                            id: "group_2",
                            groupId: "group_2",
                            title: "group_2",
                            isGroupVisible: true,
                            isRendered: false,
                            index: 2,
                            object: {
                                id: "group_2",
                                groupId: "group_2",
                                title: "group_2",
                                tiles: [{
                                    id: "tile_00",
                                    uuid: "tile_00",
                                    isTileIntentSupported: true,
                                    object: {
                                        id: "tile_00",
                                        uuid: "tile_00"
                                    },
                                    properties: { formFactor: "Desktop,Phone" },
                                    content: []
                                }]
                            },
                            tiles: [{
                                id: "tile_00",
                                uuid: "tile_00",
                                isTileIntentSupported: true,
                                object: {
                                    id: "tile_00",
                                    uuid: "tile_00"
                                },
                                properties: { formFactor: "Desktop,Phone" },
                                content: []
                            }],
                            pendingLinks: [],
                            links: []
                        }, {
                            id: "group_hidden",
                            groupId: "group_hidden",
                            title: "group_hidden",
                            isGroupVisible: false,
                            isRendered: false,
                            index: 3,
                            object: {
                                id: "group_hidden",
                                groupId: "group_hidden",
                                title: "group_hidden"
                            },
                            tiles: [{
                                id: "tile_00",
                                uuid: "tile_00",
                                isTileIntentSupported: true,
                                object: {
                                    id: "tile_00",
                                    uuid: "tile_00"
                                },
                                properties: { formFactor: "Desktop,Phone" },
                                content: []
                            }, {
                                id: "tile_01",
                                uuid: "tile_01",
                                isTileIntentSupported: true,
                                object: {
                                    id: "tile_01",
                                    uuid: "tile_01"
                                },
                                properties: { formFactor: "Desktop,Tablet,Phone" },
                                content: []
                            }],
                            pendingLinks: [],
                            links: []
                        }, {
                            id: "group_03",
                            groupId: "group_03",
                            title: "group_03",
                            isGroupVisible: true,
                            isRendered: false,
                            index: 4,
                            object: {
                                id: "group_03",
                                groupId: "group_03",
                                title: "group_03"
                            },
                            tiles: [],
                            pendingLinks: [],
                            links: []
                        }],
                        catalogs: [{
                            id: "catalog_0",
                            title: "catalog_0",
                            tiles: [{
                                id: "tile_00",
                                uuid: "tile_00",
                                object: {
                                    id: "tile_00",
                                    uuid: "tile_00"
                                },
                                properties: { formFactor: "Desktop,Phone" },
                                content: []
                            }, {
                                id: "tile_01",
                                uuid: "tile_01",
                                object: {
                                    id: "tile_01",
                                    uuid: "tile_01"
                                },
                                properties: { formFactor: "Tablet,Phone" },
                                content: []
                            }, {
                                id: "tile_02",
                                uuid: "tile_02",
                                object: {
                                    id: "tile_02",
                                    uuid: "tile_02"
                                },
                                properties: { formFactor: "Desktop" },
                                content: []
                            }]
                        }, {
                            id: "catalog_1",
                            title: "catalog_1",
                            tiles: [{
                                id: "tile_11",
                                uuid: "tile_11",
                                object: {
                                    id: "tile_11",
                                    uuid: "tile_11"
                                },
                                properties: { formFactor: "Desktop,Tablet" },
                                content: []
                            }, {
                                id: "tile_12",
                                uuid: "tile_12",
                                properties: { formFactor: "Tablet" },
                                content: []
                            }]
                        }],
                        catalogTiles: [{
                            id: "tile_00",
                            uuid: "tile_00",
                            src: {
                                id: "tile_00",
                                uuid: "tile_00",
                                object: {
                                    id: "tile_00",
                                    uuid: "tile_00"
                                },
                                properties: { formFactor: "Desktop,Phone" }
                            },
                            properties: { formFactor: "Desktop,Phone" },
                            associatedGroups: []
                        }, {
                            id: "tile_01",
                            uuid: "tile_01",
                            object: {
                                id: "tile_01",
                                uuid: "tile_01"
                            },
                            src: {
                                id: "tile_01",
                                uuid: "tile_01",
                                properties: { formFactor: "Tablet,Phone" }
                            },
                            properties: { formFactor: "Tablet,Phone" },
                            associatedGroups: []
                        }, {
                            id: "tile_02",
                            uuid: "tile_02",
                            object: {
                                id: "tile_02",
                                uuid: "tile_02"
                            },
                            src: {
                                id: "tile_02",
                                uuid: "tile_02",
                                properties: { formFactor: "Desktop" }
                            },
                            properties: { formFactor: "Desktop" },
                            associatedGroups: []
                        }, {
                            id: "tile_11",
                            uuid: "tile_11",
                            src: {
                                id: "tile_11",
                                uuid: "tile_11",
                                object: {
                                    id: "tile_11",
                                    uuid: "tile_11"
                                },
                                properties: { formFactor: "Desktop,Tablet" }
                            },
                            properties: { formFactor: "Desktop,Tablet" },
                            associatedGroups: []
                        }, {
                            id: "tile_12",
                            uuid: "tile_12",
                            src: {
                                id: "tile_12",
                                uuid: "tile_12",
                                object: {
                                    id: "tile_12",
                                    uuid: "tile_12"
                                },
                                properties: { formFactor: "Tablet" }
                            },
                            properties: { formFactor: "Tablet" },
                            associatedGroups: []
                        }],
                        tagList: []
                    };
                    oHomepageManager = new HomepageManager("homepageMgr", { model: new JSONModel(mockData) });
                    oMoveScrollDashboardStub = sandbox.stub(aServices[2], "moveScrollDashboard");
                    fnDone();
                }).then(function (ComponentKeysHandlerInstance) {
                });
            });
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        afterEach: function () {
            if (oHomepageManager) {
                oHomepageManager.destroy();
            }
            oHomepageManager = null;
            EventHub._reset();
            Container.resetServices();
            sandbox.restore();
        }
    });

    QUnit.test("create instance", function (assert) {
        assert.ok(oHomepageManager, "Instance was created");
    });

    QUnit.test("Test _getGroupIndex", function (assert) {
        assert.ok(!oHomepageManager._getGroupIndex("bbb"), "if not found we will return undefined");
        assert.equal(oHomepageManager._getGroupIndex("group_2"), 2);
    });

    QUnit.test("Test _getIndexForConvert", function (assert) {
        var result = oHomepageManager._getIndexForConvert("links", 0, 2, { tiles: [1, 2, 3] });
        assert.equal(result.tileIndex, 3);
        assert.equal(result.newTileIndex, 2);

        result = oHomepageManager._getIndexForConvert("tiles", 0, 2, { tiles: [1, 2, 3], groupId: "id1" }, { tiles: [1, 2, 3], groupId: "id1" });
        assert.equal(result.tileIndex, 0);
        assert.equal(result.newTileIndex, 4);

        result = oHomepageManager._getIndexForConvert("tiles", 0, 2, { tiles: [1, 2, 3], groupId: "id1" }, { tiles: [1, 2, 3], groupId: "id2" });
        assert.equal(result.tileIndex, 0);
        assert.equal(result.newTileIndex, 5);
    });

    QUnit.test("test _changeLinkScope", function (assert) {
        var setScopeCallCount = 0,
            setScopeParam,
            oLink = {
                getScope: function () {
                    return "Actions";
                },
                setScope: function (scope) {
                    setScopeCallCount++;
                    setScopeParam = scope;
                }
            };

        oHomepageManager.bLinkPersonalizationSupported = true;
        oHomepageManager._changeLinkScope(oLink, "Actions");
        assert.ok(setScopeCallCount === 1, "setScope was called once");
        assert.ok(setScopeParam === "Actions", "setScope was called with scope === Actions");
    });

    QUnit.test("test _changeGroupLinksScope", function (assert) {
        var setScopeCallCount = 0,
            oLink = {
                content: [{
                    getScope: function () {
                        return "Actions";
                    },
                    setScope: function (/*scope*/) {
                        setScopeCallCount++;
                    }
                }]
            },
            oGroup = { links: [oLink, oLink, oLink, oLink] };

        oHomepageManager.bLinkPersonalizationSupported = true;
        oHomepageManager._changeGroupLinksScope(oGroup, "Actions");
        assert.ok(setScopeCallCount === 4, "setScope was called once");
    });

    QUnit.test(" test _changeLinksScope", function (assert) {
        var oEvent = {
            getSource: function () {
                return {
                    getValue: function () {
                        return true;
                    }
                };
            }
        },
            stubChangeLinkScope = sandbox.stub(oHomepageManager, "_changeLinkScope");

        oHomepageManager.bLinkPersonalizationSupported = true;
        oHomepageManager._changeLinksScope(oEvent);
        assert.ok(stubChangeLinkScope.callCount === 1, "all links scope was set to Actions");

        stubChangeLinkScope.restore();
    });

    QUnit.test(" test _attachLinkPressHandlers - open action menu", function (assert) {
        var oGenericTile = new GenericTile({
            header: "header",
            subheader: "subheader",
            scope: GenericTileScope.Actions,
            tileContent: new TileContent({
                footer: "footer"
            })
        });

        oGenericTile.getBindingContext = function () {
            return {
                getObject: function () {
                    return {
                        tileIsBeingMoved: false
                    };
                }
            };
        };

        var _openActionsMenuStub  = sandbox.stub(ActionMode, "_openActionsMenu");

        oHomepageManager._attachLinkPressHandlers(oGenericTile);

        oGenericTile.firePress({ action: "Press" });

        assert.strictEqual(_openActionsMenuStub.callCount, 1, "action menu was opened");
    });

    QUnit.test(" test _attachLinkPressHandlers - delete link", function (assert) {
        var oGenericTile = new GenericTile({
            header: "header",
            subheader: "subheader",
            scope: GenericTileScope.Actions,
            tileContent: new TileContent({
                footer: "footer"
            })
        }),
            oDeleteTileParams,
            publishEventStub = sandbox.stub(Core.getEventBus(), "publish").callsFake(function () {
                if (arguments[1] === "deleteTile") {
                    oDeleteTileParams = arguments;
                }
            });

        oGenericTile.getBindingContext = function () {
            return {
                getObject: function () {
                    return {
                        tileIsBeingMoved: false,
                        uuid: "1"
                    };
                }
            };
        };

        oHomepageManager._attachLinkPressHandlers(oGenericTile);

        oGenericTile.firePress({ action: "Remove" });

        assert.ok(oDeleteTileParams[1] === "deleteTile", "action menu was opened");

        publishEventStub.restore();
    });

    QUnit.test("test instance is created with bLinkPersonalizationSupported parameter", function (assert) {
        assert.ok(oHomepageManager.bLinkPersonalizationSupported !== undefined, "Instance was created");
    });

    QUnit.test("create instance of oPageOperationAdapter", function (assert) {
        assert.ok(oHomepageManager.oPageOperationAdapter !== undefined, "Instance of oPageOperationAdapter was created");
    });

    QUnit.test("test createMoveActionDialog function", function (assert) {
        var moveActionDialog = oHomepageManager.createMoveActionDialog("moveDialog");
        assert.ok(moveActionDialog && moveActionDialog.getId() === "moveDialog", "dialog has been created with correct id");
    });

    QUnit.test("test publishMoveActionEvents function", function (assert) {
        var done = assert.async();
        var oMoveTileEventParams,
            oScrollToGroupParams,
            publishEventStub = sandbox.stub(Core.getEventBus(), "publish").callsFake(function () {
                if (arguments[1] === "movetile") {
                    oMoveTileEventParams = arguments;
                } else if (arguments[1] === "scrollToGroup") {
                    oScrollToGroupParams = arguments;
                }
            }),
            aContexts = [],
            oMockContext = {
                tileUuid: "0",
                tileType: "tile"
            };
        aContexts[0] = {
            getObject: function () {
                return {
                    groupId: "0",
                    tiles: [],
                    pendingLinks: []
                };
            }
        };

        oHomepageManager.publishMoveActionEvents.call(oMockContext, aContexts, "0");
        //check that the event is fired with the right properties
        setTimeout(function () {
            assert.ok(oMoveTileEventParams[2].hasOwnProperty("toIndex"), "event object has property toIndex");
            assert.ok(oMoveTileEventParams[2].hasOwnProperty("toGroupId"), "event object has property toGroupId");
            assert.ok(oMoveTileEventParams[2].hasOwnProperty("source"), "event object has property source");
            assert.ok(oMoveTileEventParams[2].hasOwnProperty("sTileType"), "event object has property sTileType");
            assert.ok(oMoveTileEventParams[2].hasOwnProperty("sTileId"), "event object has property sTileId");

            assert.ok(oScrollToGroupParams[2].hasOwnProperty("groupId"), "event object has property groupId");
            publishEventStub.restore();
            done();
        }, 0);
    });

    QUnit.test("test _addFLPActionsToTile - check case: Link Personalization is supported on the platform", function (assert) {
        var oTile = {
            id: "tile_001",
            title: "I am a long long long long long long long long long long long long link! 00",
            size: "1x1",
            tileType: "sap.ushell.ui.tile.StaticTile",
            isLinkPersonalizationSupported: true,
            isLink: true,
            properties: {
                title: "I am a long long long long long long long long long long long long link! 00",
                subtitle: "subtitle 00",
                icon: "sap-icon://syringe",
                href: "#Action-todefaultapp"
            }
        };
        var aActions;

        oHomepageManager.bLinkPersonalizationSupported = true;
        aActions = oHomepageManager._addFLPActionsToTile(oTile);
        assert.ok(aActions.length === 2, "Link Personalization is Supported on platform and on tile, therefor there's 2 actions on the link");
    });

    QUnit.test("test _addFLPActionsToTile - check case: platform Link Personalization not supported on the platform", function (assert) {
        var oTile = {
            id: "tile_001",
            title: "I am a long long long long long long long long long long long long link! 00",
            size: "1x1",
            tileType: "sap.ushell.ui.tile.StaticTile",
            isLinkPersonalizationSupported: true,
            isLink: true,
            properties: {
                title: "I am a long long long long long long long long long long long long link! 00",
                subtitle: "subtitle 00",
                icon: "sap-icon://syringe",
                href: "#Action-todefaultapp"
            }
        };
        var aActions;
        oHomepageManager.bLinkPersonalizationSupported = false;
        aActions = oHomepageManager._addFLPActionsToTile(oTile);
        assert.ok(aActions.length === 1, "Link Personalization not supported on platform, therefor there's 1 action on the link");
    });

    QUnit.test("test _addFLPActionsToTile - check case: Link Personalization is supported on the platform, but the lnk does not support it", function (assert) {
        var oTile = {
            id: "tile_001",
            title: "I am a long long long long long long long long long long long long link! 00",
            size: "1x1",
            tileType: "sap.ushell.ui.tile.StaticTile",
            isLinkPersonalizationSupported: false,
            isLink: true,
            properties: {
                title: "I am a long long long long long long long long long long long long link! 00",
                subtitle: "subtitle 00",
                icon: "sap-icon://syringe",
                href: "#Action-todefaultapp"
            }
        };
        var aActions;
        oHomepageManager.bLinkPersonalizationSupported = true;
        aActions = oHomepageManager._addFLPActionsToTile(oTile);
        assert.ok(aActions.length === 1, "the link does not support Personalization, therefor there's 1 action on the link");
    });

    QUnit.test("test _getConvertTileAction", function (assert) {
        var done = assert.async();
        var oTile = {
            id: "tile_001",
            title: "I am a long long long long long long long long long long long long link! 00",
            size: "1x1",
            tileType: "sap.ushell.ui.tile.StaticTile",
            isLinkPersonalizationSupported: false,
            isLink: true,
            properties: {
                title: "I am a long long long long long long long long long long long long link! 00",
                subtitle: "subtitle 00",
                icon: "sap-icon://syringe",
                href: "#Action-todefaultapp"
            }
        };
        var oAction,
            bConvertTileEventPublished = false,
            publishEventStub = sandbox.stub(Core.getEventBus(), "publish").callsFake(function () {
                if (arguments[1] === "convertTile") {
                    bConvertTileEventPublished = true;
                }
            });
        oAction = oHomepageManager._getConvertTileAction(oTile);
        oAction.press({
            getParent: function () {
                return {
                    getBindingContext: function () {
                        return {
                            getObject: function () {
                                return { groupId: "0" };
                            }
                        };
                    }
                };
            }
        });
        setTimeout(function () {
            assert.ok(bConvertTileEventPublished, "convert tile event is published");
            publishEventStub.restore();
            done();
        }, 0);
    });

    QUnit.test("test _getMoveTileAction", function (assert) {
        var oTile = {
            id: "tile_100",
            title: "I am a long long long long long long long long long long long long link! 00",
            size: "1x1",
            tileType: "sap.ushell.ui.tile.StaticTile",
            isLinkPersonalizationSupported: false,
            isLink: true,
            properties: {
                title: "I am a long long long long long long long long long long long long link! 00",
                subtitle: "subtitle 00",
                icon: "sap-icon://syringe",
                href: "#Action-todefaultapp"
            }
        };
        var oAction,
            bOpen = false,
            bSetModel = false,
            oCreateMoveActionDialogStub = sandbox.stub(oHomepageManager, "createMoveActionDialog").returns({
                open: function () {
                    bOpen = true;
                },
                setModel: function () {
                    bSetModel = true;
                },
                getBinding: function () {
                    return {
                        filter: function () {
                            return true;
                        }
                    };
                },
                attachSearch: sandbox.stub(),
                detachSearch: sandbox.stub()
            });

        var oGivenPressedTile = {
            getParent: sandbox.stub().returns({
                getProperty: sandbox.stub()
            })
        };

        oAction = oHomepageManager._getMoveTileAction(oTile);
        oAction.press(oGivenPressedTile);

        assert.ok(oCreateMoveActionDialogStub.called, "moveDialog was was created");
        assert.ok(bOpen, "open function of moveDialog was called");
        assert.ok(bSetModel, "setModel function of moveDialog was called");

        //call press the action in the second time (when moveDialog is already created)
        bSetModel = false;
        bOpen = false;
        oCreateMoveActionDialogStub.reset();
        oAction.press(oGivenPressedTile);
        assert.ok(!oCreateMoveActionDialogStub.called, "moveDialog was was created");
        assert.ok(!bSetModel, "setModel function of moveDialog was called");
        assert.ok(bOpen, "open function of moveDialog was called");
        oCreateMoveActionDialogStub.restore();
    });

    QUnit.test("test _handleTileAppearanceAnimation", function (assert) {
        var oGenericTile = new GenericTile({
            header: "header",
            subheader: "subheader",
            tileContent: new TileContent({
                footer: "footer"
            })
        });

        oHomepageManager._handleTileAppearanceAnimation(oGenericTile);
        assert.ok(oGenericTile.hasStyleClass("sapUshellTileEntrance"), "tile view has class sapUshellTileEntrance");
    });

    QUnit.test("Split groups data to segments", function (assert) {
        oHomepageManager.PagingManager = {};
        oHomepageManager.PagingManager.getGroupHeight = sandbox.stub().returns(0.1);
        oHomepageManager.segmentsStore.push = sandbox.spy();
        oHomepageManager._splitGroups(mockData.groups);

        assert.ok(oHomepageManager.segmentsStore.push.calledOnce, "oHomepageManager.push was not called once");
    });

    QUnit.test("Check binding segment of mock data", function (assert) {
        var groupsSkeleton,
            mergedGroups,
            groupindex,
            tilesIndex,
            oMergedGrp,
            oMockGrp,
            oMergedGrpTile,
            oMockGrpTile,
            oSeg;

        oHomepageManager.PagingManager = {
            getGroupHeight: function () {
                return 0.1;
            }
        };
        groupsSkeleton = oHomepageManager.createGroupsModelFrame(mockData.groups, true);

        oHomepageManager._splitGroups(mockData.groups);
        mergedGroups = groupsSkeleton;

        while (oHomepageManager.segmentsStore.length > 0) {
            oSeg = oHomepageManager.segmentsStore.shift();
            mergedGroups = oHomepageManager._bindSegment(mergedGroups, oSeg);
        }

        assert.ok(mergedGroups.length === mockData.groups.length, "validate same number of groups in the model");

        //validate that the mockData and the mergedGroups contains all the tile / links.
        for (groupindex = 0; groupindex < mergedGroups.length; groupindex++) {
            oMergedGrp = mergedGroups[groupindex];
            oMockGrp = mockData.groups[groupindex];

            assert.ok(oMergedGrp.tiles.length === oMockGrp.tiles.length, "validate group model [" + groupindex + "] has same number of tiles");

            for (tilesIndex = 0; tilesIndex < oMergedGrp.tiles.length; tilesIndex++) {
                oMockGrpTile = oMockGrp.tiles[tilesIndex];
                oMergedGrpTile = oMergedGrp.tiles[tilesIndex];

                assert.ok(oMockGrpTile.id === oMergedGrpTile.id, "validate tile [" + tilesIndex + "] has same id");
            }
        }
    });

    QUnit.test("move tile to empty group", function (assert) {

        var aGroups = oHomepageManager.getModel().getProperty("/groups"),
            iOriginalGroupTilesLength = aGroups[0].tiles.length,
            bUpdateGroupEventFired = false,
            oEventHubEmitStub = sandbox.stub(EventHub, "emit").callsFake(function (sEventName) {
                if (sEventName === "updateGroups") {
                    bUpdateGroupEventFired = true;
                }
            });
        oEventBus.publish("launchpad", "movetile", {
            sTileId: "tile_02",
            sToItems: "tiles",
            sFromItems: "tiles",
            sTileType: "tiles",
            toGroupId: "group_1",
            toIndex: 2
        });

        aGroups = oHomepageManager.getModel().getProperty("/groups");
        assert.ok(aGroups[0].tiles.length === iOriginalGroupTilesLength - 1, "Original group length decreased by 1");
        assert.ok(bUpdateGroupEventFired, "updateGroups event should be emitted");
        assert.equal(aGroups[1].tiles[0].id, "tile_02", "Expected tile was moved to the second group");

        oEventHubEmitStub.restore();
    });

    QUnit.test("move tile to another group with null index", function (assert) {
        var done = assert.async();

        var aGroups = oHomepageManager.getModel().getProperty("/groups"),
            iOriginalGroupTilesLength = aGroups[0].tiles.length,
            bUpdateGroupEventFired = false,
            oEventHubEmitStub = sandbox.stub(EventHub, "emit").callsFake(function (sEventName) {
                if (sEventName === "updateGroups") {
                    bUpdateGroupEventFired = true;
                }
            });

        oEventBus.publish("launchpad", "movetile", {
            sTileId: "tile_02",
            sToItems: "tiles",
            sFromItems: "tiles",
            sTileType: "tiles",
            toGroupId: "group_1",
            toIndex: null
        });

        aGroups = oHomepageManager.getModel().getProperty("/groups");
        assert.ok(aGroups[0].tiles.length === iOriginalGroupTilesLength - 1, "Original group length decreased by 1");
        assert.equal(aGroups[1].tiles[aGroups[1].tiles.length - 1].id, "tile_02", "Tile which moved with null index should be added to the last position in the tiles array");
        window.setTimeout(function () {
            assert.ok(bUpdateGroupEventFired, "updateGroups event should be emitted");
            oEventHubEmitStub.restore();
            done();
        }, 0);
    });

    QUnit.test("_checkRequestQueue check enqueue and dequque functionslity works", function (assert) {
        var done = assert.async();
        var aGroups = oHomepageManager.getModel().getProperty("/groups"),
            iOriginalGroupTilesLength = aGroups[2].tiles.length,
            iOriginalTileIndexInGroup = 1,
            bUpdateGroupEventFired = false,
            oEventHubEmitStub = sandbox.stub(EventHub, "emit").callsFake(function (sEventName) {
                if (sEventName === "updateGroups") {
                    bUpdateGroupEventFired = true;
                }
            });

        oEventBus.publish("launchpad", "movetile", {
            sTileId: "tile_02",
            sToItems: "tiles",
            sFromItems: "tiles",
            sTileType: "tiles",
            toGroupId: "group_0",
            toIndex: null
        });

        oEventBus.publish("launchpad", "movetile", {
            sTileId: "tile_02",
            sToItems: "tiles",
            sFromItems: "tiles",
            sTileType: "tiles",
            toGroupId: "group_1",
            toIndex: null
        });

        oEventBus.publish("launchpad", "movetile", {
            sTileId: "tile_02",
            sToItems: "tiles",
            sFromItems: "tiles",
            sTileType: "tiles",
            toGroupId: "group_2",
            toIndex: null
        });
        setTimeout(function () {
            aGroups = oHomepageManager.getModel().getProperty("/groups");
            assert.ok(aGroups[2].tiles.length === iOriginalGroupTilesLength + 1, "validate group 2 has an additional tile");
            assert.equal(aGroups[2].tiles[iOriginalTileIndexInGroup].id, "tile_02", "Tile which moved with null index should stay in the same position as before");
            assert.ok(bUpdateGroupEventFired, "updateGroups event should be emitted");
            oEventHubEmitStub.restore();
            done();
        }, 0);
    });

    QUnit.test("move tile to the same group with null index", function (assert) {
        var aGroups = oHomepageManager.getModel().getProperty("/groups"),
            iOriginalGroupTilesLength = aGroups[0].tiles.length,
            iOriginalTileIndexInGroup = 2;

        oEventBus.publish("launchpad", "movetile", {
            sTileId: "tile_02",
            sToItems: "tiles",
            sFromItems: "tiles",
            sTileType: "tiles",
            toGroupId: "group_0",
            toIndex: null
        });

        aGroups = oHomepageManager.getModel().getProperty("/groups");
        assert.ok(aGroups[0].tiles.length === iOriginalGroupTilesLength, "Original group length stayed the same");
        assert.equal(aGroups[0].tiles[iOriginalTileIndexInGroup].id, "tile_02", "Tile which moved with null index should stay in the same position as before");
    });

    QUnit.test("move tile to empty group and back", function (assert) {
        var done = assert.async();
        var aGroups = oHomepageManager.getModel().getProperty("/groups"),
            iOriginalGroupTilesLength = aGroups[0].tiles.length,
            bUpdateGroupEventFired = false,
            oEventHubEmitStub = sandbox.stub(EventHub, "emit").callsFake(function (sEventName) {
                if (sEventName === "updateGroups") {
                    bUpdateGroupEventFired = true;
                }
            });

        oEventBus.publish("launchpad", "movetile", {
            sTileId: "tile_04",
            sToItems: "tiles",
            sFromItems: "tiles",
            sTileType: "tiles",
            toGroupId: "group_1",
            toIndex: 0
        });
        aGroups = oHomepageManager.getModel().getProperty("/groups");
        assert.ok(aGroups[0].tiles.length === iOriginalGroupTilesLength - 1, "Original group length decreased by 1");
        assert.equal(aGroups[1].tiles[0].id, "tile_04", "Expected tile was moved to the second group");

        oEventBus.publish("launchpad", "movetile", {
            sTileId: "tile_04",
            sToItems: "tiles",
            sFromItems: "tiles",
            sTileType: "tiles",
            toGroupId: "group_0",
            toIndex: 0
        });

        assert.ok(aGroups[0].tiles.length === iOriginalGroupTilesLength, "Original group length increased by 1");
        assert.equal(aGroups[0].tiles[0].id, "tile_04", "Expected tile was moved back to the first group");
        window.setTimeout(function () {
            assert.ok(bUpdateGroupEventFired, "updateGroups event should be emitted");
            oEventHubEmitStub.restore();
            done();
        }, 0);
    });

    QUnit.test("move tile left in the same group with hidden tiles", function (assert) {
        var done = assert.async();
        var aGroups = oHomepageManager.getModel().getProperty("/groups"),
            iOriginalGroupTilesLength = aGroups[0].tiles.length;

        oEventBus.publish("launchpad", "movetile", {
            sTileId: "tile_04",
            sToItems: "tiles",
            sFromItems: "tiles",
            sTileType: "tiles",
            toGroupId: "group_0",
            toIndex: 1
        });

        aGroups = oHomepageManager.getModel().getProperty("/groups");
        assert.ok(aGroups[0].tiles.length === iOriginalGroupTilesLength, "Original group length stayed the same");
        assert.equal(aGroups[0].tiles[1].id, "tile_04", "Expected tile was moved to index 1 in the model (before the hidden tile)");
        window.setTimeout(function () {
            done();
        }, 0);
    });

    QUnit.test("Abort invalid moves (to the same position) with hidden tiles", function (assert) {
        var done = assert.async();
        var aGroups = oHomepageManager.getModel().getProperty("/groups"),
            iOriginalGroupTilesLength = aGroups[0].tiles.length;

        oEventBus.publish("launchpad", "movetile", {
            sTileId: "tile_02",
            sToItems: "tiles",
            sFromItems: "tiles",
            sTileType: "tiles",
            toGroupId: "group_0",
            toIndex: 2
        });

        aGroups = oHomepageManager.getModel().getProperty("/groups");
        assert.strictEqual(aGroups[0].tiles.length, iOriginalGroupTilesLength, "Original group length was not changed");
        assert.equal(aGroups[0].tiles[2].id, "tile_02", "The Tile was not moved");
        window.setTimeout(function () {
            done();
        });
    });

    QUnit.test("verify new group validity", function (assert) {
        var oModel = oHomepageManager.getModel(),
            aGroups = oModel.getProperty("/groups"),
            iOriginalGroupsLength = aGroups.length,
            catalogTileContext = new Context(oModel, "/catalogTiles/0"),
            newGroupName;

        oEventBus.publish("launchpad", "createGroupAndSaveTile", {
            catalogTileContext: catalogTileContext,
            newGroupName: newGroupName
        });

        newGroupName = "";
        oEventBus.publish("launchpad", "createGroupAndSaveTile", {
            catalogTileContext: catalogTileContext,
            newGroupName: newGroupName
        });

        newGroupName = " ";
        oEventBus.publish("launchpad", "createGroupAndSaveTile", {
            catalogTileContext: catalogTileContext,
            newGroupName: newGroupName
        });

        newGroupName = undefined;
        oEventBus.publish("launchpad", "createGroupAndSaveTile", {
            catalogTileContext: catalogTileContext,
            newGroupName: newGroupName
        });

        newGroupName = { a: "1", b: "2", c: "3" }; //object
        oEventBus.publish("launchpad", "createGroupAndSaveTile", {
            catalogTileContext: catalogTileContext,
            newGroupName: newGroupName
        });

        newGroupName = function () { };
        oEventBus.publish("launchpad", "createGroupAndSaveTile", {
            catalogTileContext: catalogTileContext,
            newGroupName: newGroupName
        });

        newGroupName = 1; //digit
        oEventBus.publish("launchpad", "createGroupAndSaveTile", {
            catalogTileContext: catalogTileContext,
            newGroupName: newGroupName
        });

        newGroupName = true; // boolean
        oEventBus.publish("launchpad", "createGroupAndSaveTile", {
            catalogTileContext: catalogTileContext,
            newGroupName: newGroupName
        });

        aGroups = oHomepageManager.getModel().getProperty("/groups");
        assert.ok(aGroups.length === iOriginalGroupsLength, "New group was not added");
    });

    QUnit.test("verify change group title", function (assert) {
        var done = assert.async();
        var aGroups = oHomepageManager.getModel().getProperty("/groups"),
            sOriginalGroupTitle = aGroups[0].title,
            sNewGroupTitle;

        oEventBus.publish("launchpad", "changeGroupTitle", {
            newTitle: "new_group_title",
            groupId: "group_0"
        });

        window.setTimeout(function () {
            aGroups = oHomepageManager.getModel().getProperty("/groups");
            sNewGroupTitle = aGroups[0].title;
            assert.ok(sNewGroupTitle !== sOriginalGroupTitle, "Group title changed");
            assert.equal(sNewGroupTitle, "new_group_title", "Expected title was set");
            done();
        }, 0);
    });

    QUnit.test("verify move group", function (assert) {
        var done = assert.async();
        var aGroups = oHomepageManager.getModel().getProperty("/groups"),
            sGroup0Id = aGroups[0].id,
            sGroup1Id = aGroups[1].id,
            sGroup2Id = aGroups[2].id;

        oEventBus.publish("launchpad", "moveGroup", {
            fromIndex: 2,
            toIndex: 0
        });

        aGroups = oHomepageManager.getModel().getProperty("/groups");
        assert.equal(aGroups[0].id, sGroup2Id, "Group 2 moved to index 0");
        assert.equal(aGroups[1].id, sGroup0Id, "Group 0 moved to index 1");
        assert.equal(aGroups[2].id, sGroup1Id, "Group 1 moved to index 2");
        window.setTimeout(function () {
            done();
        }, 0);
    });

    QUnit.test("verify move group with Hidden groups", function (assert) {
        var done = assert.async();
        var aGroups = oHomepageManager.getModel().getProperty("/groups"),
            sGroup0Id = aGroups[0].id,
            sGroup1Id = aGroups[1].id,
            sGroup2Id = aGroups[2].id,
            sGroup3Id = aGroups[3].id, //hidden
            sGroup4Id = aGroups[4].id;

        oEventBus.publish("launchpad", "moveGroup", { //Move second group to the end (not counting one hidden group and the moving group itself)
            fromIndex: 1,
            toIndex: 3
        });

        window.setTimeout(function () {
            aGroups = oHomepageManager.getModel().getProperty("/groups");
            assert.equal(aGroups[4].id, sGroup1Id, "Group in index 1 moved to index 4 in the model");
            assert.equal(aGroups[1].id, sGroup2Id, "Group in index 2 moved to index 1 in the model");
            assert.equal(aGroups[2].id, sGroup3Id, "Group in index 3 moved to index 2 in the model");
            assert.equal(aGroups[3].id, sGroup4Id, "Group in index 4 moved to index 3 in the model");
            //sGroup0Id
            //sGroup2Id
            //sGroup3Id - hidden
            //sGroup4Id
            //sGroup1Id

            oEventBus.publish("launchpad", "moveGroup", { //Move second group to the end (not counting one hidden group and the moving group itself)
                fromIndex: 0,
                toIndex: 1
            });

            window.setTimeout(function () {
                assert.equal(aGroups[0].id, sGroup2Id, "Group in index 0 is 2");
                assert.equal(aGroups[1].id, sGroup0Id, "Group in index 1 is 0");
                assert.equal(aGroups[2].id, sGroup3Id, "Group in index 2 is 3");
                assert.equal(aGroups[4].id, sGroup1Id, "Group in index 3 is 1");
                //sGroup2Id
                //sGroup0Id
                //sGroup3Id - hidden
                //sGroup4Id
                //sGroup1Id
                oEventBus.publish("launchpad", "moveGroup", { //Move second group to the end (not counting one hidden group and the moving group itself)
                    fromIndex: 3,
                    toIndex: 1
                });

                window.setTimeout(function () {
                    assert.equal(aGroups[0].id, sGroup2Id, "Group in index 0 is 2");
                    assert.equal(aGroups[1].id, sGroup1Id, "Group in index 1 is 1");
                    assert.equal(aGroups[2].id, sGroup0Id, "Group in index 2 is 0");
                    assert.equal(aGroups[3].id, sGroup3Id, "Group in index 3 is 3");
                    //sGroup2Id
                    //sGroup1Id
                    //sGroup0Id
                    //sGroup3Id - hidden
                    //sGroup4Id
                    var model = oHomepageManager.getModel(),
                        groups = model.getProperty("/groups");
                    groups.push({
                        id: "group_007",
                        groupId: "group_007",
                        title: "group_007",
                        isGroupVisible: true,
                        object: {
                            id: "group_007",
                            groupId: "group_007"
                        },
                        tiles: []
                    });
                    model.setProperty("/groups", groups);
                    //sGroup2Id
                    //sGroup1Id
                    //sGroup0Id
                    //sGroup3Id - hidden
                    //sGroup4Id
                    //group_007

                    oEventBus.publish("launchpad", "moveGroup", { //Move second group to the end (not counting one hidden group and the moving group itself)
                        fromIndex: 4,
                        toIndex: 3
                    });
                    window.setTimeout(function () {
                        assert.equal(aGroups[2].id, sGroup0Id, "Group in index 2 is 0");
                        assert.equal(aGroups[3].id, "group_007", "Group in index 3 is 007");
                        assert.equal(aGroups[4].id, sGroup3Id, "Group in index 4 is 3");
                        assert.equal(aGroups[5].id, sGroup4Id, "Group in index 5 is 4");

                        //sGroup2Id
                        //sGroup1Id
                        //sGroup0Id
                        //group_007
                        //sGroup3Id - hidden
                        //sGroup4Id

                        //Replace without hidden groups "impact"
                        oEventBus.publish("launchpad", "moveGroup", { //Move second group to the end (not counting one hidden group and the moving group itself)
                            fromIndex: 0,
                            toIndex: 2
                        });
                        window.setTimeout(function () {
                            assert.equal(aGroups[0].id, sGroup1Id, "Group in index 0 is 1");
                            assert.equal(aGroups[1].id, sGroup0Id, "Group in index 1 is 0");
                            assert.equal(aGroups[2].id, sGroup2Id, "Group in index 2 is 2");
                            //sGroup1Id
                            //sGroup0Id
                            //sGroup2Id
                            //group_007
                            //sGroup3Id - hidden
                            //sGroup4Id
                            oEventBus.publish("launchpad", "moveGroup", { //Move second group to the end (not counting one hidden group and the moving group itself)
                                fromIndex: 3,
                                toIndex: 1
                            });
                            assert.equal(aGroups[0].id, sGroup1Id, "Group in index 0 is 1");
                            assert.equal(aGroups[1].id, "group_007", "Group in index 1 is 007");
                            assert.equal(aGroups[2].id, sGroup0Id, "Group in index 2 is 0");
                            assert.equal(aGroups[3].id, sGroup2Id, "Group in index 3 is 2");
                            //sGroup1Id
                            //group_007
                            //sGroup0Id
                            //sGroup2Id
                            //sGroup3Id - hidden
                            //sGroup4Id
                            done();
                        }, 0);
                    }, 0);
                }, 0);
            }, 0);
        }, 0);
    });

    QUnit.test("verify delete group", function (assert) {
        var done = assert.async();
        var aGroups = oHomepageManager.getModel().getProperty("/groups"),
            iOriginalGroupsLength = aGroups.length;

        oEventBus.publish("launchpad", "deleteGroup", {
            groupId: "group_0"
        });

        setTimeout(function () {
            aGroups = oHomepageManager.getModel().getProperty("/groups");
            assert.equal(aGroups.length, iOriginalGroupsLength - 1, "Groups length decreased by 1");
            done();
        }, 0);
    });

    QUnit.test("isBlindLoading true _processSegment", function (assert) {
        var aGroups = oHomepageManager.getModel().getProperty("/groups"),
            fHandleTilesVisibility = sandbox.stub(ushellUtils, "handleTilesVisibility");
        oHomepageManager.segmentsStore = [aGroups];
        oHomepageManager.getSegmentContentViews = sandbox.spy();
        oHomepageManager._bindSegment = sandbox.spy();
        oHomepageManager.isBlindLoading = function () {
            return true;
        };
        oHomepageManager._processSegment(aGroups);
        assert.ok(oHomepageManager._bindSegment.callCount === 1, "sBlindLoading true and _bindSegment was called once");
        fHandleTilesVisibility.restore();
    });

    QUnit.test("isBlindLoading false tab mode _processSegment", function (assert) {
        var aGroups = oHomepageManager.getModel().getProperty("/groups"),
            fHandleTilesVisibility = sandbox.stub(ushellUtils, "handleTilesVisibility");
        oHomepageManager.segmentsStore = [aGroups];
        oHomepageManager.getSegmentContentViews = sandbox.spy();
        oHomepageManager._bindSegment = sandbox.spy();

        oHomepageManager.getModel().setProperty("/homePageGroupDisplay", "tabs");
        oHomepageManager._processSegment(aGroups);
        assert.ok(oHomepageManager._bindSegment.callCount === 1, "isBlindLoading false  with tab mode and _bindSegment was called once");

        oHomepageManager.getModel().setProperty("/homePageGroupDisplay", "");
        fHandleTilesVisibility.restore();
    });

    QUnit.test("verify delete tile", function (assert) {
        var done = assert.async();
        var aGroups = oHomepageManager.getModel().getProperty("/groups"),
            oGroup = aGroups[0],
            iOriginalGroupLength = oGroup.tiles.length,
            oByIdStub = sandbox.stub(Core, "byId");

        oByIdStub.withArgs("dashboardGroups").returns({
            getGroups: function () {
                return [];
            },
            getGroupControlByGroupId: function () {
                return {
                    oPlusTile: {},
                    getLinks: function () {
                        return oGroup.links;
                    }
                };
            }
        });

        oEventBus.publish("launchpad", "deleteTile", {
            tileId: "tile_01",
            items: "tiles"
        });

        setTimeout(function () {
            aGroups = oHomepageManager.getModel().getProperty("/groups");
            assert.equal(oGroup.tiles.length, iOriginalGroupLength - 1, "Group length decreased by 1");

            oByIdStub.restore();
            done();
        }, 1);
    });

    QUnit.test("verify delete link", function (assert) {
        var done = assert.async();
        var aGroups = oHomepageManager.getModel().getProperty("/groups"),
            oGroup = aGroups[0],
            iOriginalGroupLength = oGroup.links.length,
            oByIdStub = sandbox.stub(Core, "byId"),
            sLinkId = oGroup.links[0].uuid,
            oPlusTileJQueryStub = sandbox.stub();

        oByIdStub.withArgs("dashboardGroups").returns({
            getGroups: function () {
                return [];
            },
            getGroupControlByGroupId: function () {
                return {
                    oPlusTile: {
                        $: oPlusTileJQueryStub
                    },
                    getLinks: function () {
                        return oGroup.links;
                    }
                };
            }
        });

        oEventBus.publish("launchpad", "deleteTile", {
            tileId: sLinkId,
            items: "links"
        });

        setTimeout(function () {
            aGroups = oHomepageManager.getModel().getProperty("/groups");
            assert.equal(oGroup.links.length, iOriginalGroupLength - 1, "Group length decreased by 1");
            assert.equal(oPlusTileJQueryStub.callCount, 1, "PlusTile has to be focused next");
            assert.equal(oMoveScrollDashboardStub.callCount, 1, "Focus was adjusted");

            oByIdStub.restore();
            done();
        }, 1);
    });

    QUnit.test("verify link tile loaded correctly", function (assert) {
        var done = assert.async();
        oHomepageManager.oModel = new JSONModel();
        var fGetDefaultGroupStub = sandbox.stub(oLaunchPageService, "getDefaultGroup"),
            aGroups;

        fGetDefaultGroupStub.returns(jQuery.Deferred().resolve(mockData.groups[0]));
        oHomepageManager._setGroupModel(mockData.groups);

        setTimeout(function () {
            aGroups = oHomepageManager.getModel().getProperty("/groups");
            assert.equal(aGroups[0].links.length, 1, "Link type tile was added to the group model");

            done();
        }, 1);
    });

    QUnit.test("verify that handleFirstSegmentLoaded called after firstSegmentCompleteLoaded if there is blind loading", function (assert) {
        oHomepageManager.oModel = new JSONModel();
        oHomepageManager.oDashboardView = {};
        oHomepageManager = new HomepageManager("homepageMgr", { model: new JSONModel(), view: {} });
        var done = assert.async(),
            fGetDefaultGroupStub = sandbox.stub(oLaunchPageService, "getDefaultGroup"),
            fHandleSegmentStub = sandbox.stub(oHomepageManager, "handleFirstSegmentLoaded"),
            fProcessRemainingSegmentsStub = sandbox.stub(oHomepageManager, "_processRemainingSegments"),
            fIsBlindLoadingStub = sandbox.stub(oHomepageManager, "isBlindLoading");

        fGetDefaultGroupStub.returns(jQuery.Deferred().resolve(mockData.groups[0]));
        fIsBlindLoadingStub.returns(true);
        oHomepageManager._setGroupModel(mockData.groups);

        setTimeout(function () {
            assert.ok(oHomepageManager.bIsFirstSegmentViewLoaded === false, "The tile views load later if there is blind loading");
            assert.ok(fHandleSegmentStub.notCalled, "handleFirstSegmentLoaded should not called before firstSegmentCompleteLoaded event from EventHub");
            assert.ok(fProcessRemainingSegmentsStub.notCalled, "_processRemainingSegments should not called before firstSegmentCompleteLoaded event from EventHub");
            EventHub.emit("firstSegmentCompleteLoaded", true);
            setTimeout(function () {
                assert.ok(fHandleSegmentStub.called, "handleFirstSegmentLoaded should called after firstSegmentCompleteLoaded event from EventHub");
                fGetDefaultGroupStub.restore();
                fHandleSegmentStub.restore();
                fProcessRemainingSegmentsStub.restore();
                fIsBlindLoadingStub.restore();
                done();
            }, 100);
        }, 500);
    });

    QUnit.test("verify that _processRemainingSegments called without waiting firstSegmentCompleteLoaded event when loadGroupd is called from AppFinder", function (assert) {
        oHomepageManager.oModel = new JSONModel();
        var done = assert.async(),
            fGetDefaultGroupStub = sandbox.stub(oLaunchPageService, "getDefaultGroup"),
            fHandleSegmentStub = sandbox.stub(oHomepageManager, "handleFirstSegmentLoaded"),
            fProcessRemainingSegmentsStub = sandbox.stub(oHomepageManager, "_processRemainingSegments"),
            fIsBlindLoadingStub = sandbox.stub(oHomepageManager, "isBlindLoading");

        fGetDefaultGroupStub.returns(jQuery.Deferred().resolve(mockData.groups[0]));
        fIsBlindLoadingStub.returns(true);
        oHomepageManager._setGroupModel(mockData.groups);

        setTimeout(function () {
            assert.ok(oHomepageManager.bIsFirstSegmentViewLoaded === false, "The tile views load later if there is blind loading");
            assert.ok(oHomepageManager.bStartLoadRemainSegment, "bStartLoadRemainSegment flag is set to true, in order to prevent recalling _processRemainingSegments");
            assert.ok(fHandleSegmentStub.notCalled, "handleFirstSegmentLoaded should not called before firstSegmentCompleteLoaded event from EventHub");
            assert.ok(fProcessRemainingSegmentsStub.called, "_processRemainingSegments should called when loadGroupd called not from home page");

            fGetDefaultGroupStub.restore();
            fHandleSegmentStub.restore();
            fProcessRemainingSegmentsStub.restore();
            fIsBlindLoadingStub.restore();
            done();
        }, 100);
    });

    QUnit.test("verify the order of setting the group model", function (assert) {
        oHomepageManager.oModel = new JSONModel();
        oHomepageManager.oDashboardView = {};
        var done = assert.async(),
            fIsBlindLoadingStub = sandbox.stub(oHomepageManager, "isBlindLoading"),
            fProcessRemainingSegmentsStub = sandbox.stub(oHomepageManager, "_processRemainingSegments");

        oHomepageManager.PagingManager = {};
        oHomepageManager.PagingManager.getGroupHeight = sandbox.stub().returns(1);
        fIsBlindLoadingStub.returns(true);
        oHomepageManager._setGroupModel(mockData.groups);

        setTimeout(function () {
            assert.equal(oHomepageManager.oModel.getProperty("/groups").length, 1, "Firstly, the only visible group is set during the first rendering");
            //-1 first visible group
            // _setGroupModel receives all groups including default group
            assert.equal(oHomepageManager.aGroupsFrame.length, mockData.groups.length - 1, "aGroupsFrame should be reset");
            EventHub.emit("firstSegmentCompleteLoaded", true);
            setTimeout(function () {
                assert.equal(oHomepageManager.oModel.getProperty("/groups").length, mockData.groups.length, "The rest groups is set after firstSegmentCompleteLoaded");
                assert.equal(oHomepageManager.aGroupsFrame, null, "aGroupsFrame should be reset");
                fIsBlindLoadingStub.restore();
                fProcessRemainingSegmentsStub.restore();
                done();
            }, 100);
        }, 500);
    });

    QUnit.test("verify that firstSegmentCompleteLoaded is emitted if there is no blind loading", function (assert) {
        oHomepageManager.oModel = new JSONModel();
        oHomepageManager.oDashboardView = {};
        var done = assert.async();
        var fGetDefaultGroupStub = sandbox.stub(oLaunchPageService, "getDefaultGroup"),
            fIsBlindLoadingStub = sandbox.stub(oHomepageManager, "isBlindLoading");

        fGetDefaultGroupStub.returns(jQuery.Deferred().resolve(mockData.groups[0]));
        fIsBlindLoadingStub.returns(false);
        oHomepageManager._setGroupModel(mockData.groups);

        setTimeout(function () {
            assert.ok(oHomepageManager.bIsFirstSegmentViewLoaded, "The tile view is loaded during _setGroupModel if there is no blind loading");
            assert.ok(EventHub.last("firstSegmentCompleteLoaded"), "firstSegmentCompleteLoaded should be emitted if there is no blind loading");
            done();
        }, 250);
    });

    QUnit.test("_processSegment called for each segment", function (assert) {
        var done = assert.async();
        var aGroups = oHomepageManager.getModel().getProperty("/groups");
        var fGetSegmentContentViews = sandbox.stub(oHomepageManager, "getSegmentContentViews");
        var fBindSegment = sandbox.stub(oHomepageManager, "_bindSegment");
        var fHandleTilesVisibility = sandbox.stub(ushellUtils, "handleTilesVisibility");

        oHomepageManager.segmentsStore = [aGroups.slice(0, 1), aGroups.slice(1)];
        oHomepageManager.isBlindLoading = function () {
            return true;
        };
        oHomepageManager.bIsGroupsModelLoading = true;
        oHomepageManager._processRemainingSegments();

        setTimeout(function () {
            assert.ok(fBindSegment.calledTwice, "_bindSegment should called for each segment");
            assert.ok(fHandleTilesVisibility.calledOnce, "handleTilesVisibility should called once (when all segment was loaded)");
            assert.ok(!oHomepageManager.bIsGroupsModelLoading, "bIsGroupsModelLoading should be set to false when all segments were loaded");
            fGetSegmentContentViews.restore();
            fBindSegment.restore();
            fHandleTilesVisibility.restore();
            done();
        }, 600);
    });

    QUnit.test("Verify locked groups are sorted in lexicographic order", function (assert) {
        oHomepageManager.oModel = new JSONModel({ groups: [] });

        var fGetDefaultGroupStub = sandbox.stub(oLaunchPageService, "getDefaultGroup"),
            numOfLockedGroup,
            isSorted = true,
            index,
            aGroups;

        fGetDefaultGroupStub.returns(jQuery.Deferred().resolve(mockData.groups[0]));
        oHomepageManager._setGroupModel(mockData.groups);
        aGroups = oHomepageManager.getModel().getProperty("/groups");

        numOfLockedGroup = aGroups.filter(function (group) {
            return group.isGroupLocked;
        }).length;

        for (index = 1; index < numOfLockedGroup; index++) {
            if (aGroups[index - 1].title.toLowerCase() > aGroups[index].title.toLowerCase()) {
                isSorted = false;
                break;
            }
        }

        assert.ok(isSorted, "All locked groups sorted in lexicographic order correctly");
        fGetDefaultGroupStub.restore();
    });

    QUnit.test("Verify no _addBookmarkToModel is not processing the model in parallel", function (assert) {
        oHomepageManager.oModel = new JSONModel();
        var fGetDefaultGroupStub = sandbox.stub(oLaunchPageService, "getDefaultGroup"),
            fLoadPersonalizedGroupsStub = sandbox.stub(oHomepageManager, "loadPersonalizedGroups");

        fGetDefaultGroupStub.returns(jQuery.Deferred().resolve(mockData.groups[0]));
        fLoadPersonalizedGroupsStub.returns(function () { });
        oHomepageManager._addBookmarkToModel(undefined, undefined, { tile: undefined, group: undefined });
        oHomepageManager._addBookmarkToModel(undefined, undefined, { tile: undefined, group: undefined });

        assert.ok(fLoadPersonalizedGroupsStub.calledOnce, "Validate loadgroups from area called once");

        fGetDefaultGroupStub.restore();
        fLoadPersonalizedGroupsStub.restore();
    });

    QUnit.test("handleDisplayModeChange: skip update model when there is scroll mode and blindLoading", function (assert) {
        var fIsBlindLoadingStub = sandbox.stub(oHomepageManager, "isBlindLoading").callsFake(function () {
            return true;
        }),
            fGetTileViewSpy = sandbox.spy(oHomepageManager, "getTileView"),
            fRefreshSpy = sandbox.spy(oHomepageManager.getModel(), "refresh");

        oHomepageManager.handleDisplayModeChange("scroll");

        assert.ok(fRefreshSpy.notCalled, "refresh model should not be called");
        assert.ok(fGetTileViewSpy.notCalled, "getTileView should not be called");
        fIsBlindLoadingStub.restore();
        fGetTileViewSpy.restore();
        fRefreshSpy.restore();
    });

    QUnit.test("handleDisplayModeChange: update model when there is scroll mode and no blindLoading", function (assert) {
        oHomepageManager.oModel = new JSONModel();
        var modelGroup = mockData.groups[0],
            fIsBlindLoadingStub = sandbox.stub(oHomepageManager, "isBlindLoading").callsFake(function () {
                return false;
            }),
            fGetTileViewSpy = sandbox.stub(oHomepageManager, "getTileView"),
            fRefreshSpy = sandbox.stub(oHomepageManager.getModel(), "refresh");

        oHomepageManager.getModel().setProperty("/groups", [modelGroup]);
        oHomepageManager.handleDisplayModeChange("scroll");

        assert.equal(fGetTileViewSpy.callCount, modelGroup.tiles.length + modelGroup.links.length, "refresh model should be called once");
        assert.ok(fRefreshSpy.calledOnce, "refresh model should be called once");
        fIsBlindLoadingStub.restore();
        fGetTileViewSpy.restore();
        fRefreshSpy.restore();
    });

    QUnit.test("handleDisplayModeChange: update isGroupSelected of groups when there is tabs model", function (assert) {
        var aGroups = oHomepageManager.getModel().getProperty("/groups"),
            oManageTilesViewStub = sandbox.stub(oHomepageManager.oDashboardLoadingManager, "manageTilesView"),
            iNewSelectedAnchorItem = 1;

        oHomepageManager.getModel().setProperty("/iSelectedGroup", iNewSelectedAnchorItem);
        oHomepageManager.handleDisplayModeChange("tabs");
        for (var i = 0; i < aGroups.length; i++) {
            if (i === iNewSelectedAnchorItem) {
                assert.ok(aGroups[i].isGroupSelected, "The group " + iNewSelectedAnchorItem + " should be selected, because this anchorItem is selected");
            } else {
                assert.ok(!aGroups[i].isGroupSelected, "The group " + i + " should not be selected");
            }
        }
        assert.ok(oManageTilesViewStub.calledOnce, "The method manageTilesView is called once on DashboardLoadingManager");
    });

    QUnit.test("Verify that the header is not hidden if there is only 1 visible group", function (assert) {
        oHomepageManager.oModel = new JSONModel({ groups: [] });

        var fnDone = assert.async(),
            aGroups;

        oHomepageManager._setGroupModel(mockData.groups.slice(0, 1));

        setTimeout(function () {
            aGroups = oHomepageManager.getModel().getProperty("/groups");
            assert.ok(aGroups[0].showGroupHeader !== false, "The header of the first visible group is shown, if there is only 1 group");
            fnDone();
        }, 500);
    });

    QUnit.test("Verify that the header of the first group is hidden if there is more than 1 visible group", function (assert) {
        oHomepageManager.oModel = new JSONModel({ groups: [] });

        var fnDone = assert.async(),
            fGetDefaultGroupStub = sandbox.stub(oLaunchPageService, "getDefaultGroup"),
            aGroups;

        fGetDefaultGroupStub.returns(jQuery.Deferred().resolve(mockData.groups[0]));
        oHomepageManager._setGroupModel(mockData.groups);

        setTimeout(function () {
            aGroups = oHomepageManager.getModel().getProperty("/groups");
            assert.equal(aGroups[0].showGroupHeader, false, "The header of the first visible group is shown, if there is only 1 group");
            fGetDefaultGroupStub.restore();
            fnDone();
        }, 500);
    });

    QUnit.test("deleteTilesFromGroup: test tile deletion", function (assert) {
        oHomepageManager.oModel = new JSONModel();

        var fnDone = assert.async(),
            fDeleteTilesFromGroupStub = sandbox.stub(oLaunchPageService, "getDefaultGroup"),
            aGroups,
            aRemovedTilesIds = [],
            nTiles;

        fDeleteTilesFromGroupStub.returns(jQuery.Deferred().resolve(mockData.groups[0]));
        oHomepageManager._setGroupModel(mockData.groups);

        setTimeout(function () {
            aGroups = oHomepageManager.getModel().getProperty("/groups");

            nTiles = aGroups[0].tiles.length;
            aRemovedTilesIds[0] = aGroups[0].tiles[0].uuid;
            oHomepageManager.deleteTilesFromGroup(aGroups[0].groupId, aRemovedTilesIds);

            aGroups = oHomepageManager.getModel().getProperty("/groups");

            assert.equal(aGroups[0].tiles.length, nTiles - 1, "Tile should be deleted from group");
            fDeleteTilesFromGroupStub.restore();
            fnDone();
        }, 500);
    });

    QUnit.test("deleteTilesFromGroup: test link deletion", function (assert) {
        oHomepageManager.oModel = new JSONModel();

        var fnDone = assert.async(),
            fDeleteTilesFromGroupStub = sandbox.stub(oLaunchPageService, "getDefaultGroup"),
            aGroups,
            aRemovedLinksIds = [],
            nLinks;

        fDeleteTilesFromGroupStub.returns(jQuery.Deferred().resolve(mockData.groups[0]));
        oHomepageManager._setGroupModel(mockData.groups);

        setTimeout(function () {
            aGroups = oHomepageManager.getModel().getProperty("/groups");

            nLinks = aGroups[0].links.length;
            aRemovedLinksIds[0] = aGroups[0].links[0].uuid;
            oHomepageManager.deleteTilesFromGroup(aGroups[0].groupId, aRemovedLinksIds);

            aGroups = oHomepageManager.getModel().getProperty("/groups");

            assert.equal(aGroups[0].links.length, nLinks - 1, "Link should be deleted from group");
            fDeleteTilesFromGroupStub.restore();
            fnDone();
        }, 500);
    });

    QUnit.test("deleteTilesFromGroup: test tile and link deletion", function (assert) {
        oHomepageManager.oModel = new JSONModel();

        var fnDone = assert.async(),
            fDeleteTilesFromGroupStub = sandbox.stub(oLaunchPageService, "getDefaultGroup");

        fDeleteTilesFromGroupStub.returns(jQuery.Deferred().resolve(mockData.groups[0]));
        oHomepageManager._setGroupModel(mockData.groups);

        setTimeout(function () {
            var aGroups = oHomepageManager.getModel().getProperty("/groups"),
                oGroup = aGroups[0],
                nTiles = oGroup.tiles.length,
                nLinks = oGroup.links.length;

            oHomepageManager.deleteTilesFromGroup(oGroup.groupId, [
                oGroup.tiles[0].uuid,
                oGroup.links[0].uuid
            ]);

            aGroups = oHomepageManager.getModel().getProperty("/groups");
            oGroup = aGroups[0];

            // aGroups = mockData.groups;
            assert.equal(oGroup.tiles.length, nTiles - 1, "Tile should be deleted from group");
            assert.equal(oGroup.links.length, nLinks - 1, "Link should be deleted from group");
            fDeleteTilesFromGroupStub.restore();
            fnDone();
        }, 500);
    });

    QUnit.test("Verify that group model will not load again until it is completely loaded", function (assert) {
        oHomepageManager.oModel = new JSONModel({ groups: [] });

        var fSplitGroupStub = sandbox.spy(oHomepageManager, "_splitGroups");

        oHomepageManager._setGroupModel(mockData.groups);
        oHomepageManager._setGroupModel(mockData.groups);

        assert.ok(oHomepageManager.bIsGroupsModelLoading, "bIsGroupsModelLoading flag should be true until model completely loading of the model");
        assert.ok(fSplitGroupStub.calledOnce, "Group model loading should be processed only once");
        fSplitGroupStub.restore();
    });

    QUnit.module("_isAtLeastOneTileVisibleInASegment", {
        beforeEach: function () {
            return Container.init("local").then(() => {
                this.oHomepageManager = new HomepageManager("homepageMgr", { model: new JSONModel({ groups: {} }) });
            });
        },
        afterEach: function () {
            this.oHomepageManager.destroy();
        }
    });

    QUnit.test("no tiles with supported tile intent", function (assert) {
        // Arrange
        const aSegment = [
            { tiles: [ { isTileIntentSupported: false }, { isTileIntentSupported: false } ]},
            { tiles: [ { isTileIntentSupported: false }, { isTileIntentSupported: false }, { isTileIntentSupported: false }, { isTileIntentSupported: false } ]},
            { tiles: [ { isTileIntentSupported: false }, { isTileIntentSupported: false }, { isTileIntentSupported: false } ]}
        ];

        // Act
        const bResult = this.oHomepageManager._isAtLeastOneTileVisibleInASegment(aSegment);

        // Assert
        assert.notOk(bResult, "no tiles with supported tile intent found.");
    });

    QUnit.test("no tiles with supported tile intent", function (assert) {
        // Arrange
        const aSegment = [
            { tiles: [ { isTileIntentSupported: false }, { isTileIntentSupported: false } ]},
            { tiles: [ { isTileIntentSupported: false }, { isTileIntentSupported: true }, { isTileIntentSupported: false }, { isTileIntentSupported: false } ]},
            { tiles: [ { isTileIntentSupported: false }, { isTileIntentSupported: false }, { isTileIntentSupported: true } ]}
        ];

        // Act
        const bResult = this.oHomepageManager._isAtLeastOneTileVisibleInASegment(aSegment);

        // Assert
        assert.ok(bResult, "tiles with supported tile intent found.");
    });

    var aGroups,
        oTileContent,
        oHandleTilesVisibilityStub;

    QUnit.module("sap.ushell.components.HomepageManager-2", {
        beforeEach: function (assert) {
            var fnDone = assert.async();
            Container.init("local")
                .then(function () {
                    Promise.all([
                        Container.getServiceAsync("UserRecents"),
                        Container.getServiceAsync("FlpLaunchPage")
                    ]).then(function (aServices) {
                        sandbox.stub(aServices[0], "addAppUsage");
                        oLaunchPageService = aServices[1];
                        aGroups = [{
                            id: "group_0",
                            title: "KPIs",
                            isPreset: true,
                            tiles: [{
                                id: "tile_00",
                                title: "Sales Performance",
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.DynamicTile"
                            }, {
                                id: "tile_01",
                                title: "WEB GUI",
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.TileBase"
                            }]
                        }];
                        oTileContent = { destroy: function () { } };
                        oHandleTilesVisibilityStub = sandbox.stub(ushellUtils, "handleTilesVisibility");
                        oHomepageManager = new HomepageManager("homepageMgr", { model: new JSONModel({ groups: {} }) });
                        fnDone();
                    });
                });
        },
        // This method is called after each test. Add every restoration code here.
        afterEach: function () {
            if (oHomepageManager) {
                oHomepageManager.destroy();
            }
            oHomepageManager = null;
            sandbox.restore();
        }
    });

    QUnit.test("getTileView - load tiles", function (assert) {
        var fGetGroupsStub,
            fGetDefaultGroup,
            fGetTileView,
            aModelGroups,
            oLoadTileDataStub,
            fnDone = assert.async();
        fGetGroupsStub = sandbox.stub(oLaunchPageService, "getGroups");
        fGetGroupsStub.returns(jQuery.Deferred().resolve(aGroups));
        fGetDefaultGroup = sandbox.stub(oLaunchPageService, "getDefaultGroup");
        fGetDefaultGroup.returns(jQuery.Deferred().resolve(aGroups[0]));
        fGetTileView = sandbox.stub(oLaunchPageService, "getTileView");
        fGetTileView.returns(jQuery.Deferred().resolve(oTileContent));

        oLoadTileDataStub = sandbox.spy(oHomepageManager, "_loadTileData");

        var oPromise = oHomepageManager.loadPersonalizedGroups();
        oPromise.then(function () {
            aModelGroups = oHomepageManager.getModel().getProperty("/groups");
            assert.ok(aModelGroups.length === 1, "groups length should be 1 :" + aModelGroups.length);
            assert.ok(aModelGroups[0].tiles.length === 2, "tiles length should be 2 :" + aModelGroups[0].tiles.length);
            assert.ok(aModelGroups[0].tiles[0].content[0] === oTileContent, "tile 0 view");
            assert.ok(aModelGroups[0].tiles[1].content[0] === oTileContent, "tile 1 view");
            assert.ok(oLoadTileDataStub.called, "_loadTileData was called");

            fGetGroupsStub.restore();
            fGetDefaultGroup.restore();
            fGetTileView.restore();
            oLoadTileDataStub.restore();
            fnDone();
        });
    });

    QUnit.test("getTileView - load cards", function (assert) {
        var oGetTileTypeStub,
            oSetTileVisibleStub,
            oLoadCardDataStub,
            oLoadTileDataStub,
            oDummyTile = { object: "someObject" };

        // Arrange
        oHomepageManager.loadPersonalizedGroups();

        oHomepageManager.oDashboardLoadingManager = {
            isTileViewRequestIssued: sandbox.stub().returns(false),
            setTileInProgress: sandbox.stub()
        };
        oGetTileTypeStub = sandbox.stub(oLaunchPageService, "getTileType").returns("card");
        oSetTileVisibleStub = sandbox.stub(oLaunchPageService, "setTileVisible");
        oLoadCardDataStub = sandbox.stub(oHomepageManager, "_loadCardData");
        oLoadTileDataStub = sandbox.stub(oHomepageManager, "_loadTileData");

        // Act
        oHomepageManager.getTileView(oDummyTile);

        // Assert
        assert.ok(oGetTileTypeStub.called, "getTileType was called");
        assert.ok(oSetTileVisibleStub.called, "setTileVisible was called");
        assert.deepEqual(oLoadCardDataStub.args[0][0], oDummyTile, "_loadCardData was called with the correct argument");
        assert.ok(oLoadTileDataStub.notCalled, "_loadTileData was not called");

        // Cleanup
        oGetTileTypeStub.restore();
        oSetTileVisibleStub.restore();
        oLoadCardDataStub.restore();
        oLoadTileDataStub.restore();
    });

    QUnit.test("getTileView - do not load personalized groups if request is pending", function (assert) {
        var oLoadTileDataStub,
            fnDone = assert.async();

        // Arrange
        oLoadTileDataStub = sandbox.spy(oHomepageManager, "_loadTileData");
        oHomepageManager.bIsGroupsRequestPending = true;

        // Act
        var oPromise = oHomepageManager.loadPersonalizedGroups();

        // Assert
        oPromise.then(function () {
            assert.notOk(true, "The promise was not rejected.");
        }).catch(function () {
            assert.ok(oLoadTileDataStub.notCalled, "_loadTileData was not called.");
            assert.ok(true, "The promise was rejected.");
            fnDone();
        });

        // Cleanup
        oLoadTileDataStub.restore();
    });

    QUnit.test("getTileView - don't load tiles or cards when the loading has already been triggered", function (assert) {
        var oGetTileTypeStub,
            oSetTileVisibleStub,
            oLoadCardDataStub,
            oLoadTileDataStub,
            oDummyTile = { object: "someObject" };

        // Arrange
        oHomepageManager.oDashboardLoadingManager = {
            isTileViewRequestIssued: sandbox.stub().returns(true),
            setTileInProgress: sandbox.stub()
        };
        oGetTileTypeStub = sandbox.stub(oLaunchPageService, "getTileType").returns("card");
        oSetTileVisibleStub = sandbox.stub(oLaunchPageService, "setTileVisible");
        oLoadCardDataStub = sandbox.stub(oHomepageManager, "_loadCardData");
        oLoadTileDataStub = sandbox.stub(oHomepageManager, "_loadTileData");

        // Act
        oHomepageManager.getTileView(oDummyTile);

        // Assert
        assert.ok(oGetTileTypeStub.called, "getTileType was called");
        assert.ok(oSetTileVisibleStub.notCalled, "setTileVisible was not called");
        assert.ok(oLoadCardDataStub.notCalled, "_loadCardData was not called");
        assert.ok(oLoadTileDataStub.notCalled, "_loadTileData was not called");

        // Cleanup
        oGetTileTypeStub.restore();
        oSetTileVisibleStub.restore();
        oLoadCardDataStub.restore();
        oLoadTileDataStub.restore();
    });

    QUnit.test("_loadCardData - Set the proper properties when no blind loading is active", function (assert) {
        var oByIdStub,
            oIsBlindLoadingStub,
            oSetManifestStub,
            oSetTileResolvedStub,
            oDummyTile = {
                controlId: "someId",
                object: "someObject",
                manifest: "someManifest"
            };

        // Arrange
        oSetManifestStub = sandbox.stub();
        oByIdStub = sandbox.stub(Core, "byId").returns({
            setManifest: oSetManifestStub
        });
        oIsBlindLoadingStub = sandbox.stub(oHomepageManager, "isBlindLoading").returns(false);
        oSetTileResolvedStub = sandbox.stub(oHomepageManager.oDashboardLoadingManager, "setTileResolved");

        // Act
        oHomepageManager._loadCardData(oDummyTile);

        // Assert
        assert.deepEqual(oDummyTile.content, [oDummyTile.manifest], "The cards content is properly set");
        assert.ok(oByIdStub.called, "byId was called");
        assert.ok(oIsBlindLoadingStub.called, "isBlindLoading was called");
        assert.ok(oSetManifestStub.notCalled, "setManifest was not called");
        assert.ok(oSetTileResolvedStub.called, "setTileResolved was called");

        // Cleanup
        oByIdStub.restore();
        oIsBlindLoadingStub.restore();
        oSetTileResolvedStub.restore();
    });

    QUnit.test("Verify that _addBookmarkToModel adds bookmark to default group if no target group was specified", function (assert) {
        var oTempModel = new JSONModel(),
            oModelGroup,
            fGetDefaultGroupStub,
            fLoadPersonalizedGroupsStub,
            fGetTileTypeStub,
            fGetTileViewStub,
            fUpdateTileModelStub,
            fUtilsCalcVisibilityStub,
            fGetGroupIdStub,
            fIsLockedGroup,
            oDefaultGroup = {
                isDefaultGroup: true,
                isGroupLocked: function () { return false; },
                visibilityModes: {},
                groupId: "group2ID",
                tiles: [],
                object: {
                    groupId: "group2ID",
                    isGroupLocked: false
                }
            };

        // Fill the model with 3 groups, the 2nd one (id: group2ID) is the default group
        oTempModel.setProperty(
            "/groups",
            [
                { isDefaultGroup: false, groupId: "group1ID", object: { groupId: "group1ID" } },
                oDefaultGroup,
                { isDefaultGroup: false, groupId: "group3ID", object: { groupId: "group3ID" } }
            ]
        );
        oHomepageManager.oModel = oTempModel;

        // LaunchPage service stubs:
        fGetDefaultGroupStub = sandbox.stub(oLaunchPageService, "getDefaultGroup");
        fGetGroupIdStub = sandbox.stub(oLaunchPageService, "getGroupId").callsFake(function (oGroupObject) {
            return oGroupObject.groupId;
        });
        fIsLockedGroup = sandbox.stub(oLaunchPageService, "isGroupLocked").callsFake(function (oGroupObject) {
            return oGroupObject.isGroupLocked;
        });

        // HomepageManager stubs:
        fLoadPersonalizedGroupsStub = sandbox.stub(oHomepageManager, "loadPersonalizedGroups");
        fGetTileTypeStub = sandbox.stub(oLaunchPageService, "getTileType");
        fGetTileViewStub = sandbox.stub(oHomepageManager, "getTileView");
        fUpdateTileModelStub = sandbox.stub(oHomepageManager, "_updateModelWithTileView");

        fUtilsCalcVisibilityStub = sandbox.stub(ushellUtils, "calcVisibilityModes").returns({});

        oHomepageManager._addBookmarkToModel(undefined, undefined, { tile: {}, group: undefined });

        assert.ok(fUtilsCalcVisibilityStub.args[0][0] === oDefaultGroup, "Function sap.ushell.utils.calcVisibilityModes is called with the default group");
        oModelGroup = oTempModel.getProperty("/groups/1");
        assert.ok(oModelGroup.tiles.length === 1, "Verify adding the bookmark to the dafault group");

        fGetDefaultGroupStub.restore();
        fLoadPersonalizedGroupsStub.restore();
        fGetTileTypeStub.restore();
        fGetTileViewStub.restore();
        fUpdateTileModelStub.restore();
        fUtilsCalcVisibilityStub.restore();
        fGetGroupIdStub.restore();
        fIsLockedGroup.restore();
    });

    QUnit.test("getTileViewFromArray - should set property for model only once when blind loading and standard tiles", function (assert) {
        var fIsBlindLoading,
            fGetTileView,
            fRefreshSpy,
            aRequestTileView;

        aRequestTileView = [{
            oTile: {
                isCustomTile: true,
                object: {
                    id: "tile0",
                    appIDHint: "App0"
                },
                content: [],
                target: "#PUBLIC-App0Action",
                navigationMode: "embedded"
            },
            iGroup: 1,
            bIsExtended: false
        }, {
            oTile: {
                isCustomTile: true,
                object: {
                    id: "tile1",
                    appIDHint: "App1"
                },
                content: [],
                target: "#PUBLIC-App1Action",
                navigationMode: "embedded"
            },
            iGroup: 1,
            bIsExtended: false
        }];

        fGetTileView = sandbox.stub(oLaunchPageService, "getTileView");
        fGetTileView.returns(jQuery.Deferred().resolve(oTileContent));

        fIsBlindLoading = sandbox.stub(oHomepageManager, "isBlindLoading").returns(true);
        fRefreshSpy = sandbox.spy(oHomepageManager.getModel(), "refresh");

        oHomepageManager.getTileViewsFromArray(aRequestTileView);
        assert.ok(fRefreshSpy.calledOnce, "set property for the model should be called once");

        fGetTileView.restore();
        fIsBlindLoading.restore();
    });

    QUnit.test("getTileViewFromArray - skip execution when empty input", function (assert) {
        var fRefresh,
            aRequestTileView = [];

        fRefresh = sandbox.spy(oHomepageManager.getModel(), "refresh");

        oHomepageManager.getTileViewsFromArray(aRequestTileView);
        assert.ok(!fRefresh.called, "getTileViewFromArray should skip execution when call with empty input");
    });

    QUnit.test("Trigger handleTilesVisibility after a theme change", function (assert) {
        var done = assert.async(),
            iCallCount;

        var sCurrentTheme = sap.ui.getCore().getConfiguration().getTheme();
        var sSecondTheme = sCurrentTheme === "sap_fiori_3" ? "sap_fiori_3_hcb" : "sap_fiori_3";

        Theming.attachApplied(checkAndCleanup);
        // apply a theme that is different from the current theme
        // Please note: This MUST be a valid theme for the current release - otherwise, "ThemeChanged" event will not be called.
        Core.applyTheme(sSecondTheme);

        function checkAndCleanup () {
            assert.ok(oHandleTilesVisibilityStub.called, "The tile visibility was recalculated after the theme change");
            iCallCount = oHandleTilesVisibilityStub.callCount;

            oHomepageManager = oHomepageManager.destroy();

            Theming.detachApplied(checkAndCleanup);
            Theming.attachApplied(cleanupAndDone);
            Core.applyTheme(sCurrentTheme);
        }

        function cleanupAndDone () {
            assert.strictEqual(oHandleTilesVisibilityStub.callCount, iCallCount, "The theme changed event handler was successfully deregistered during destroying the HomepageManager");
            Theming.detachApplied(cleanupAndDone);
            done();
        }
    });

    QUnit.test("test tabsModeVisibilityChanged called", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oManageTilesViewStub = sandbox.stub(oHomepageManager.oDashboardLoadingManager, "manageTilesView");
        oHomepageManager.bIsFirstSegmentViewLoaded = false;
        oHomepageManager.oModel.setProperty("/homePageGroupDisplay", "tabs");

        EventHub.on("firstSegmentCompleteLoaded").do(function () {
            assert.ok(true, "firstSegmentCompleteLoaded event was fired");
            fnDone();
        });

        // Act
        oHomepageManager.tabsModeVisibilityChanged();

        // Assert
        assert.strictEqual(oManageTilesViewStub.callCount, 1, "manageTilesView was called once");
        assert.strictEqual(oHomepageManager.bIsFirstSegmentViewLoaded, true, "bIsFirstSegmentViewLoaded was set to true");
    });

    QUnit.test("test tabsModeVisibilityChanged not called if bIsFirstSegmentViewLoaded is already true", function (assert) {
        // Arrange
        var oManageTilesViewStub = sandbox.stub(oHomepageManager.oDashboardLoadingManager, "manageTilesView");
        oHomepageManager.bIsFirstSegmentViewLoaded = true;
        oHomepageManager.oModel.setProperty("/homePageGroupDisplay", "tabs");

        oHomepageManager.tabsModeVisibilityChanged();
        assert.strictEqual(oManageTilesViewStub.callCount, 0, "manageTilesView was not called");
    });

    QUnit.test("test tabsModeVisibilityChanged not called if not tabs mode", function (assert) {
        // Arrange
        var oManageTilesViewStub = sandbox.stub(oHomepageManager.oDashboardLoadingManager, "manageTilesView");
        oHomepageManager.bIsFirstSegmentViewLoaded = false;
        oHomepageManager.oModel.setProperty("/homePageGroupDisplay", "scroll");

        oHomepageManager.tabsModeVisibilityChanged();
        assert.strictEqual(oManageTilesViewStub.callCount, 0, "manageTilesView was not called");
    });

    QUnit.module("_convertTile", {
        beforeEach: function () {
            this.ushellResourcesGetTextSpy = sandbox.spy(ushellResources.i18n, "getText");
            this.MessageToastShowSpy = sandbox.spy(MessageToast, "show");

            this.oPageOperationAdapter = {
                moveTile: sandbox.stub().resolves({}),
                isLinkPersonalizationSupported: sandbox.stub(),
                getTileTitle: sandbox.stub()
            };
            this.getBindingContextStubReturnObject = {
                getObject: sandbox.stub().returns({}),
                sPath: "STUB_PATH/1/<TILE_TYPE_HERE>/3"
            };
            this.getBindingContextStub = sandbox.stub().returns(this.getBindingContextStubReturnObject);

            sandbox.stub(Container, "getServiceAsync").callsFake(function () {
                return Promise.resolve({
                    registerTileActionsProvider: sandbox.stub()
                });
            });
            this.getInstanceStub = sandbox.stub(PersistentPageOperationAdapter, "getInstance").returns(this.oPageOperationAdapter);
            this.aGroup1 = [
                { tiles: [], links: [] }
            ];
            this.aGroup2 = [
                { tiles: [], links: [] },
                { tiles: [], links: [] }
            ];

            this.oHomepageManager = new HomepageManager(undefined, {
                model: {
                    getProperty: function (sPath) {
                        switch (sPath) {
                            case "/groups/1": return this.aGroup1;
                            case "/groups/2": return this.aGroup2;
                            default: return [];
                        }
                    }.bind(this),
                    bindProperty: sandbox.stub().returns({
                        attachChange: sandbox.stub()
                    })
                }
            });
            this.oHomepageManager.oPageOperationAdapter = this.oPageOperationAdapter;
            this._getIndexForConvertStub = sandbox.stub(this.oHomepageManager, "_getIndexForConvert").returns({
                oGroup: {
                    sOldType: [],
                    oSourceGroup: { groupId: 1 },
                    oTargetGroup: { groupId: 2 }
                }
            });
            this._getPathOfTileStub = sandbox.stub(this.oHomepageManager, "_getPathOfTile").returns("STUB_PATH");
            this._getGroupIndexStub = sandbox.stub(this.oHomepageManager, "_getGroupIndex").returnsArg(0);
            this.replaceTileViewAfterConvertStub = sandbox.stub(this.oHomepageManager, "replaceTileViewAfterConvert");
            this._attachLinkPressHandlersStub = sandbox.stub(this.oHomepageManager, "_attachLinkPressHandlers");
            this._changeLinkScopeStub = sandbox.stub(this.oHomepageManager, "_changeLinkScope");
        },
        afterEach: function () {
            this.oHomepageManager.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("MessageToast.show() is called when converting a Link to a Tile", function (assert) {
        // Arrange
        var done = assert.async();
        this.getBindingContextStubReturnObject.sPath = "STUB_PATH/1/links/3"; // source (old) Visualization path

        // Act
        this.oHomepageManager._convertTile(undefined, undefined, {
            getParent: sandbox.stub().returns({
                getBindingContext: this.getBindingContextStub
            }),
            sOldType: "links",
            srcGroupId: 1,
            toGroupId: 1,
            getBindingContext: this.getBindingContextStub
        });

        // Assert
        window.setTimeout(function () { // needed because "convertTile" is called asynchronously
            assert.strictEqual(this.MessageToastShowSpy.callCount, 1, "MessageToast.show() was called once");
            assert.strictEqual(this.MessageToastShowSpy.args[0][0], ushellResources.i18n.getText("PageRuntime.Message.VisualizationConverted"),
                "MessageToast.show() was called with the expected arguments");
            done();
        }.bind(this), 0);

    });

    QUnit.test("MessageToast.show() is called when converting a Link to a Tile and moving to a different Group", function (assert) {
        // Arrange
        var done = assert.async();
        this.getBindingContextStubReturnObject.sPath = "STUB_PATH/1/links/3"; // source (old) Visualization path

        // Act
        this.oHomepageManager._convertTile(undefined, undefined, {
            getParent: sandbox.stub().returns({
                getBindingContext: this.getBindingContextStub
            }),
            sOldType: "links",
            srcGroupId: 1,
            toGroupId: 2,
            getBindingContext: this.getBindingContextStub
        });

        // Assert
        window.setTimeout(function () { // needed because "convertTile" is called asynchronously
            assert.strictEqual(this.MessageToastShowSpy.callCount, 1, "MessageToast.show() was called once");
            assert.strictEqual(this.MessageToastShowSpy.args[0][0], ushellResources.i18n.getText("PageRuntime.Message.VisualizationMovedAndConverted"),
                "MessageToast.show() was called with the expected arguments");
            done();
        }.bind(this), 0);

    });

    QUnit.test("MessageToast.show() is called when converting a Tile to a Link", function (assert) {
        // Arrange
        var done = assert.async();
        this.getBindingContextStubReturnObject.sPath = "STUB_PATH/1/tiles/3"; // source (old) Visualization path

        // Act
        this.oHomepageManager._convertTile(undefined, undefined, {
            getParent: sandbox.stub().returns({
                getBindingContext: this.getBindingContextStub
            }),
            sOldType: "tiles",
            srcGroupId: 1,
            toGroupId: 1,
            getBindingContext: this.getBindingContextStub
        });

        // Assert
        window.setTimeout(function () { // needed because "convertTile" is called asynchronously
            assert.strictEqual(this.MessageToastShowSpy.callCount, 1, "MessageToast.show() was called once");
            assert.strictEqual(this.MessageToastShowSpy.args[0][0], ushellResources.i18n.getText("PageRuntime.Message.VisualizationConverted"),
                "MessageToast.show() was called with the expected arguments");
            done();
        }.bind(this), 0);
    });

    QUnit.test("MessageToast.show() is called when converting a Tile to a Link and moving to a different Group", function (assert) {
        // Arrange
        var done = assert.async();
        this.getBindingContextStubReturnObject.sPath = "STUB_PATH/1/tiles/3"; // source (old) Visualization path

        // Act
        this.oHomepageManager._convertTile(undefined, undefined, {
            getParent: sandbox.stub().returns({
                getBindingContext: this.getBindingContextStub
            }),
            sOldType: "tiles",
            srcGroupId: 1,
            toGroupId: 2,
            getBindingContext: this.getBindingContextStub
        });

        // Assert
        window.setTimeout(function () { // needed because "convertTile" is called asynchronously
            assert.strictEqual(this.MessageToastShowSpy.callCount, 1, "MessageToast.show() was called once");
            assert.strictEqual(this.MessageToastShowSpy.args[0][0], ushellResources.i18n.getText("PageRuntime.Message.VisualizationMovedAndConverted"),
                "MessageToast.show() was called with the expected arguments");
            done();
        }.bind(this), 0);
    });

    QUnit.module("_moveTile", {
        beforeEach: function () {
            this.ushellResourcesGetTextSpy = sandbox.spy(ushellResources.i18n, "getText");
            this.MessageToastShowSpy = sandbox.spy(MessageToast, "show");

            this.oPageOperationAdapter = {
                moveTile: sandbox.stub().resolves({
                    content: {}
                }),
                isLinkPersonalizationSupported: sandbox.stub(),
                getTileTitle: sandbox.stub()
            };
            this.getBindingContextStubReturnObject = {
                getObject: sandbox.stub().returns({}),
                sPath: "STUB_PATH/1/<TILE_TYPE_HERE>/3"
            };
            this.getBindingContextStub = sandbox.stub().returns(this.getBindingContextStubReturnObject);
            sandbox.stub(Container, "getServiceAsync").callsFake(function () {
                return Promise.resolve({
                    registerTileActionsProvider: sandbox.stub()
                });
            });
            this.getInstanceStub = sandbox.stub(PersistentPageOperationAdapter, "getInstance").returns(this.oPageOperationAdapter);
            this.oHomepageManager = new HomepageManager(undefined, {
                model: {
                    getProperty: sandbox.stub().returns([
                        { tiles: [], links: [] },
                        { tiles: [], links: [] },
                        { tiles: [], links: [] }
                    ]),
                    bindProperty: sandbox.stub().returns({
                        attachChange: sandbox.stub()
                    }),
                    setProperty: sandbox.stub()
                }
            });
            this.oHomepageManager.oPageOperationAdapter = this.oPageOperationAdapter;
            this._getIndexForMoveStub = sandbox.stub(this.oHomepageManager, "_getIndexForMove").returns({});
            this._getPathOfTileStub = sandbox.stub(this.oHomepageManager, "_getPathOfTile").returns("STUB_PATH");
            this._getTileInfoStub = sandbox.stub(this.oHomepageManager, "_getTileInfo").returns({
                oGroup: {
                    groupId: 1,
                    sFromItems: []
                },
                oTile: { content: [{ addStyleClass: sandbox.stub() }] }
            });
            this._getNewGroupInfoStub = sandbox.stub(this.oHomepageManager, "_getNewGroupInfo").returns({
                oNewGroup: {
                    groupId: 2,
                    sToItems: [{ length: sandbox.stub() }],
                    tiles: [{ length: sandbox.stub() }]
                }
            });
            this._attachLinkPressHandlersStub = sandbox.stub(this.oHomepageManager, "_attachLinkPressHandlers");
            this._changeLinkScopeStub = sandbox.stub(this.oHomepageManager, "_changeLinkScope");
        },
        afterEach: function () {
            this.oHomepageManager.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("MessageToast.show() is called when moving a Tile to another Group", function (assert) {
        // Arrange
        var done = assert.async();

        // Act
        this.oHomepageManager._moveTile(undefined, undefined, {
            getParent: sandbox.stub().returns({
                getBindingContext: this.getBindingContextStub
            }),
            sFromItems: "sFromItems",
            sToItems: "sToItems",
            sTileType: "tiles",
            groupId: 1,
            toGroupId: 2,
            getBindingContext: this.getBindingContextStub
        });

        // Assert
        window.setTimeout(function () { // needed because "moveTile" is called asynchronously
            assert.strictEqual(this.MessageToastShowSpy.callCount, 1, "MessageToast.show() was called once");
            assert.strictEqual(this.MessageToastShowSpy.args[0][0], ushellResources.i18n.getText("PageRuntime.Message.VisualizationMoved"),
                "MessageToast.show() was called with the expected arguments");
            done();
        }.bind(this), 0);
    });

    QUnit.test("MessageToast.show() is called when moving a Tile within the Group", function (assert) {
        // Arrange
        var done = assert.async();

        // Act
        this.oHomepageManager._moveTile(undefined, undefined, {
            getParent: sandbox.stub().returns({
                getBindingContext: this.getBindingContextStub
            }),
            sFromItems: "sFromItems",
            sToItems: "sToItems",
            sTileType: "tiles",
            groupId: 1,
            toGroupId: 1,
            getBindingContext: this.getBindingContextStub
        });

        // Assert
        window.setTimeout(function () { // needed because "moveTile" is called asynchronously
            assert.strictEqual(this.MessageToastShowSpy.callCount, 1, "MessageToast.show() was called once");
            assert.strictEqual(this.MessageToastShowSpy.args[0][0], ushellResources.i18n.getText("PageRuntime.Message.VisualizationMoved"),
                "MessageToast.show() was called with the expected arguments");
            done();
        }.bind(this), 0);
    });

    QUnit.test("MessageToast.show() is called when moving a Link to another Group", function (assert) {
        // Arrange
        var done = assert.async();

        // Act
        this.oHomepageManager._moveTile(undefined, undefined, {
            getParent: sandbox.stub().returns({
                getBindingContext: this.getBindingContextStub
            }),
            sFromItems: "sFromItems",
            sToItems: "sToItems",
            sTileType: "links",
            groupId: 1,
            toGroupId: 2,
            getBindingContext: this.getBindingContextStub
        });

        // Assert
        window.setTimeout(function () { // needed because "moveTile" is called asynchronously
            assert.strictEqual(this.MessageToastShowSpy.callCount, 1, "MessageToast.show() was called once");
            assert.strictEqual(this.MessageToastShowSpy.args[0][0], ushellResources.i18n.getText("PageRuntime.Message.VisualizationMoved"),
                "MessageToast.show() was called with the expected arguments");
            done();
        }.bind(this), 0);
    });

    QUnit.test("MessageToast.show() is called when moving a Link within the Group", function (assert) {
        // Arrange
        var done = assert.async();

        // Act
        this.oHomepageManager._moveTile(undefined, undefined, {
            getParent: sandbox.stub().returns({
                getBindingContext: this.getBindingContextStub
            }),
            sFromItems: "sFromItems",
            sToItems: "sToItems",
            sTileType: "links",
            groupId: 1,
            toGroupId: 1,
            getBindingContext: this.getBindingContextStub
        });

        // Assert
        window.setTimeout(function () { // needed because "moveTile" is called asynchronously
            assert.strictEqual(this.MessageToastShowSpy.callCount, 1, "MessageToast.show() was called once");
            assert.strictEqual(this.MessageToastShowSpy.args[0][0], ushellResources.i18n.getText("PageRuntime.Message.VisualizationMoved"),
                "MessageToast.show() was called with the expected arguments");
            done();
        }.bind(this), 0);
    });

    QUnit.module("getPersonalizableGroups", {
        beforeEach: function () {
            this.oGetPropertyStub = sandbox.stub();
            this.oGivenContext = {
                getModel: sandbox.stub().returns({
                    getProperty: this.oGetPropertyStub
                })
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the personalizable Groups (some personalizable Groups)", function (assert) {
        // Arrange
        var aGivenGroupData = [
            { groupId: 1, isGroupLocked: false },
            { groupId: 2, isGroupLocked: true },
            { groupId: 3, isGroupLocked: false }
        ];
        var aExpectedPersonalizableGroups = [
            { groupId: 1, isGroupLocked: false },
            { groupId: 3, isGroupLocked: false }
        ];
        this.oGetPropertyStub.returns(aGivenGroupData);

        // Act
        var aReturnedPersonalizableGroups = HomepageManager.prototype.getPersonalizableGroups.call(this.oGivenContext);

        // Assert
        assert.deepEqual(aReturnedPersonalizableGroups, aExpectedPersonalizableGroups, "Returns the expected value");
    });

    QUnit.test("Returns the personalizable Groups (no personalizable Groups)", function (assert) {
        // Arrange
        var aGivenGroupData = [
            { groupId: 1, isGroupLocked: true },
            { groupId: 2, isGroupLocked: true },
            { groupId: 3, isGroupLocked: true }
        ];
        var aExpectedPersonalizableGroups = [];
        this.oGetPropertyStub.returns(aGivenGroupData);

        // Act
        var aReturnedPersonalizableGroups = HomepageManager.prototype.getPersonalizableGroups.call(this.oGivenContext);

        // Assert
        assert.deepEqual(aReturnedPersonalizableGroups, aExpectedPersonalizableGroups, "Returns the expected value");
    });
});
