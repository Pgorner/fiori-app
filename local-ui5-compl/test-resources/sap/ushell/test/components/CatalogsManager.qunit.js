// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.CatalogsManager
 *
 * @deprecated since 1.112
 */
sap.ui.define([
    "sap/base/util/extend",
    "sap/ui/core/Core",
    "sap/ushell/components/CatalogsManager",
    "sap/ushell/components/HomepageManager",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Config",
    "sap/ui/thirdparty/sinon-4",
    "sap/ushell/components/MessagingHelper",
    "sap/ui/thirdparty/jquery",
    "sap/ui/model/Context",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readUtils",
    "sap/ushell/Container",
    "sap/ushell/EventHub",
    "sap/ushell/resources",
    "sap/ushell/shells/demo/fioriDemoConfig"
], function (
    extend,
    Core,
    CatalogsManager,
    HomepageManager,
    JSONModel,
    Config,
    sinon,
    MessagingHelper,
    jQuery,
    Context,
    LaunchPageReadUtils,
    Container
) {
    "use strict";

    /* global QUnit */

    var sandbox = sinon.createSandbox({});

    var oCatalogsManager = null;
    var oHomepageManager = null;
    var oEventBus = Core.getEventBus();
    var mockData;
    var oLaunchPageService;
    var oUserRecentsStub;

    // avoid creating the real local LaunchPageAdapter
    function overrideLaunchPageAdapter(oService) {
        extend(oService, {
            moveTile: function () { return new jQuery.Deferred().resolve(); },
            getTileView: function () {
                var oDfd = new jQuery.Deferred();
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
            setTileVisible: function () {
            },
            isTileIntentSupported: function (oTile) {
                return (oTile.properties.formFactor.indexOf("Desktop") !== -1);
            },
            addTile: function (oCatalogTile, oGroup) {
                var oDfd = new jQuery.Deferred();
                oDfd.resolve(oCatalogTile);
                return oDfd.promise();
            },
            isCatalogsValid: function (oCatalog) {
                return true;
            },
            getGroups: function () {
                return new jQuery.Deferred().resolve(mockData.groups);
            },
            addGroup: function (sTitle) {
                var oGroup = {
                    id: sTitle,
                    groupId: sTitle,
                    title: sTitle,
                    tiles: []
                };
                return new jQuery.Deferred().resolve(oGroup);
            },
            getCatalogs: function () {
                var oDfd = new jQuery.Deferred();

                //Simulate an async function with a loading delay of up to 5 sec
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
                return new jQuery.Deferred().resolve([mockData.groups[0]]);
            },
            getGroupTiles: function (oGroup) {
                return oGroup.tiles;
            },
            getGroupTitle: function (oGroup) {
                return oGroup.title;
            },
            setGroupTitle: function (oGroup, sTitle) {
                var oDfd = new jQuery.Deferred();
                oDfd.resolve();
                return oDfd.promise();
            },
            moveGroup: function (oGroup, iIndex) {
                var oDfd = new jQuery.Deferred();
                oDfd.resolve();
                return oDfd.promise();
            },
            removeGroup: function (oGroup, iIndex) {
                var oDfd = new jQuery.Deferred();
                oDfd.resolve();
                return oDfd.promise();
            },
            removeTile: function (oGroup, oTile) {
                var oDfd = new jQuery.Deferred();
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
                return new jQuery.Deferred().resolve(oCatalog.tiles);
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

    QUnit.module("sap.ushell.components.CatalogsManager", {
        beforeEach: function (assert) {
            var done = assert.async();
            sap.ushell.components = {};
            Container.init("local")
                .then(function () {
                    Promise.all([
                        Container.getServiceAsync("UserRecents"),
                        Container.getServiceAsync("FlpLaunchPage")
                    ]).then(function (aServices) {
                        jQuery("<div id=\"layoutWrapper\"></div>").width(1800).appendTo("body");
                        oUserRecentsStub = sinon.stub(aServices[0], "addAppUsage");
                        oLaunchPageService = aServices[1];
                        overrideLaunchPageAdapter(oLaunchPageService);
                        mockData = {
                            enableCatalogTagFilter: true,
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
                                        properties: {
                                            formFactor: "Desktop,Phone"
                                        },
                                        content: []
                                    }, {
                                        id: "tile_01",
                                        uuid: "tile_01",
                                        isTileIntentSupported: false,
                                        object: {
                                            id: "tile_01",
                                            uuid: "tile_01"
                                        },
                                        properties: {
                                            formFactor: "Tablet,Phone"
                                        },
                                        content: []
                                    }, {
                                        id: "tile_02",
                                        uuid: "tile_02",
                                        isTileIntentSupported: true,
                                        object: {
                                            id: "tile_02",
                                            uuid: "tile_02"
                                        },
                                        properties: {
                                            formFactor: "Desktop"
                                        },
                                        content: []
                                    }, {
                                        id: "tile_03",
                                        uuid: "tile_03",
                                        isTileIntentSupported: false,
                                        object: {
                                            id: "tile_03",
                                            uuid: "tile_03"
                                        },
                                        properties: {
                                            formFactor: "Phone"
                                        },
                                        content: []
                                    }, {
                                        id: "tile_04",
                                        uuid: "tile_04",
                                        isTileIntentSupported: true,
                                        object: {
                                            id: "tile_04",
                                            uuid: "tile_04"
                                        },
                                        properties: {
                                            formFactor: "Desktop,Tablet"
                                        },
                                        content: []
                                    }, {
                                        id: "tile_05",
                                        uuid: "tile_05",
                                        isTileIntentSupported: false,
                                        object: {
                                            id: "tile_05",
                                            uuid: "tile_05"
                                        },
                                        properties: {
                                            formFactor: "Tablet"
                                        },
                                        content: []
                                    }, {
                                        id: "tile_000",
                                        uuid: "tile_000",
                                        isTileIntentSupported: true,
                                        isLink: true,
                                        object: {
                                            id: "tile_000",
                                            uuid: "tile_000"
                                        },
                                        properties: {
                                            formFactor: "Desktop,Phone"
                                        },
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
                                    properties: {
                                        formFactor: "Desktop,Phone"
                                    },
                                    content: []
                                }, {
                                    id: "tile_01",
                                    uuid: "tile_01",
                                    isTileIntentSupported: false,
                                    object: {
                                        id: "tile_01",
                                        uuid: "tile_01"
                                    },
                                    properties: {
                                        formFactor: "Tablet,Phone"
                                    },
                                    content: []
                                }, {
                                    id: "tile_02",
                                    uuid: "tile_02",
                                    isTileIntentSupported: true,
                                    object: {
                                        id: "tile_02",
                                        uuid: "tile_02"
                                    },
                                    properties: {
                                        formFactor: "Desktop"
                                    },
                                    content: []
                                }, {
                                    id: "tile_03",
                                    uuid: "tile_03",
                                    isTileIntentSupported: false,
                                    object: {
                                        id: "tile_03",
                                        uuid: "tile_03"
                                    },
                                    properties: {
                                        formFactor: "Phone"
                                    },
                                    content: []
                                }, {
                                    id: "tile_04",
                                    uuid: "tile_04",
                                    isTileIntentSupported: true,
                                    object: {
                                        id: "tile_04",
                                        uuid: "tile_04"
                                    },
                                    properties: {
                                        formFactor: "Desktop,Tablet"
                                    },
                                    content: []
                                }, {
                                    id: "tile_05",
                                    uuid: "tile_05",
                                    isTileIntentSupported: false,
                                    object: {
                                        id: "tile_05",
                                        uuid: "tile_05"
                                    },
                                    properties: {
                                        formFactor: "Tablet"
                                    },
                                    content: []
                                }, {
                                    id: "tile_000",
                                    uuid: "tile_000",
                                    isTileIntentSupported: true,
                                    isLink: true,
                                    object: {
                                        id: "tile_000",
                                        uuid: "tile_000"
                                    },
                                    properties: {
                                        formFactor: "Desktop,Phone"
                                    },
                                    content: []
                                }],
                                pendingLinks: [
                                    {
                                        id: "tile_001",
                                        uuid: "tile_001",
                                        size: "1x1",
                                        isLink: true,
                                        object: {
                                            id: "tile_000",
                                            uuid: "tile_000"
                                        },
                                        properties: {
                                            formFactor: "Desktop,Phone"
                                        },
                                        content: []
                                    }
                                ],
                                links: [{
                                    id: "tile_001",
                                    uuid: "tile_001",
                                    size: "1x1",
                                    isLink: true,
                                    object: {
                                        id: "tile_000",
                                        uuid: "tile_000"
                                    },
                                    properties: {
                                        formFactor: "Desktop,Phone"
                                    },
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
                                        properties: {
                                            formFactor: "Desktop,Phone"
                                        },
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
                                    properties: {
                                        formFactor: "Desktop,Phone"
                                    },
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
                                    properties: {
                                        formFactor: "Desktop,Phone"
                                    },
                                    content: []
                                }, {
                                    id: "tile_01",
                                    uuid: "tile_01",
                                    isTileIntentSupported: true,
                                    object: {
                                        id: "tile_01",
                                        uuid: "tile_01"
                                    },
                                    properties: {
                                        formFactor: "Desktop,Tablet,Phone"
                                    },
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
                                    properties: {
                                        formFactor: "Desktop,Phone"
                                    },
                                    getChip: function () {
                                        return {
                                            getBaseChipId: function () {
                                                return "X-SAP-UI2-CHIP:/UI2/DYNAMIC_APPLAUNCHER";
                                            }
                                        };
                                    },
                                    content: []
                                }, {
                                    id: "tile_01",
                                    uuid: "tile_01",
                                    object: {
                                        id: "tile_01",
                                        uuid: "tile_01"
                                    },
                                    properties: {
                                        formFactor: "Tablet,Phone"
                                    },
                                    getChip: function () {
                                        return {
                                            getBaseChipId: function () {
                                                return "X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER";
                                            }
                                        };
                                    },
                                    content: []
                                }, {
                                    id: "tile_02",
                                    uuid: "tile_02",
                                    object: {
                                        id: "tile_02",
                                        uuid: "tile_02"
                                    },
                                    properties: {
                                        formFactor: "Desktop"
                                    },
                                    getChip: function () {
                                        return {
                                            getBaseChipId: function () {
                                                return "X-SAP-UI2-CHIP:/UI2/DYNAMIC_APPLAUNCHER";
                                            }
                                        };
                                    },
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
                                    properties: {
                                        formFactor: "Desktop,Tablet"
                                    },
                                    content: []
                                }, {
                                    id: "tile_12",
                                    uuid: "tile_12",
                                    properties: {
                                        formFactor: "Tablet"
                                    },
                                    content: []
                                }]
                            }, {
                                id: "catalog_2",
                                title: "catalog_1",
                                tiles: [{
                                    id: "tile_21",
                                    uuid: "tile_21",
                                    object: {
                                        id: "tile_21",
                                        uuid: "tile_21"
                                    },
                                    properties: {
                                        formFactor: "Desktop,Tablet"
                                    },
                                    content: []
                                }]
                            }, {
                                id: "catalog_3",
                                title: "no tiles",
                                tiles: []
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
                                    properties: {
                                        formFactor: "Desktop,Phone"
                                    }
                                },
                                properties: {
                                    formFactor: "Desktop,Phone"
                                },
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
                                    properties: {
                                        formFactor: "Tablet,Phone"
                                    }
                                },
                                properties: {
                                    formFactor: "Tablet,Phone"
                                },
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
                                    properties: {
                                        formFactor: "Desktop"
                                    }
                                },
                                properties: {
                                    formFactor: "Desktop"
                                },
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
                                    properties: {
                                        formFactor: "Desktop,Tablet"
                                    }
                                },
                                properties: {
                                    formFactor: "Desktop,Tablet"
                                },
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
                                    properties: {
                                        formFactor: "Tablet"
                                    }
                                },
                                properties: {
                                    formFactor: "Tablet"
                                },
                                associatedGroups: []
                            }, {
                                id: "tile_21",
                                uuid: "tile_21",
                                src: {
                                    id: "tile_21",
                                    uuid: "tile_21",
                                    object: {
                                        id: "tile_21",
                                        uuid: "tile_21"
                                    },
                                    properties: {
                                        formFactor: "Tablet"
                                    }
                                },
                                properties: {
                                    formFactor: "Tablet"
                                },
                                associatedGroups: []
                            }],
                            tagList: []
                        };

                        oHomepageManager = new HomepageManager("homepageMgr", { model: new JSONModel(mockData) });
                        oCatalogsManager = new CatalogsManager("catalogsMgr", { model: new JSONModel(mockData) });
                        done();
                    });
                });
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        afterEach: function () {
            if (oCatalogsManager) {
                oCatalogsManager.destroy();
            }
            if (oHomepageManager) {
                oHomepageManager.destroy();
            }
            oCatalogsManager = null;
            oHomepageManager = null;
            oUserRecentsStub.restore();
        }
    });
    QUnit.test("create instance", function (assert) {
        assert.ok(oCatalogsManager, "Instance was created");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("update association after failure", function (assert) {
        var oUpdateTilesAssociationStub = sinon.stub(oCatalogsManager, "updateTilesAssociation"),
            oNotifyStub = sinon.stub(oCatalogsManager, "notifyOnActionFailure"),
            oClock = sinon.useFakeTimers();

        oCatalogsManager.resetAssociationOnFailure("msg");
        oClock.tick(100);

        assert.ok(oUpdateTilesAssociationStub.calledOnce, "update association called after error");
        assert.ok(oNotifyStub.calledOnce, "Error should be notified");

        oUpdateTilesAssociationStub.restore();
        oNotifyStub.restore();
        oClock.restore();
    });

    QUnit.test("notify on action failure", function (assert) {
        var oNotifyStub = sinon.stub(MessagingHelper, "showLocalizedError"),
            oClock = sinon.useFakeTimers();

        oCatalogsManager.notifyOnActionFailure("msg");
        oClock.tick(100);

        assert.ok(oNotifyStub.calledOnce, "showLocalizedError should be called");

        oNotifyStub.restore();
        oClock.restore();
    });

    QUnit.test("map tiles in groups", function (assert) {
        oCatalogsManager.mapCatalogTilesToGroups();
        var oTileGroups = oCatalogsManager.oTileCatalogToGroupsMap.tile_00;

        assert.ok(oTileGroups.length === 2, "Two groups were mapped for 'tile_00'");

        oTileGroups = oCatalogsManager.oTileCatalogToGroupsMap.tile_01;
        assert.ok(oTileGroups.length === 1, "One groups were mapped for 'tile_01'");
        oTileGroups = oCatalogsManager.oTileCatalogToGroupsMap.tile_11;
        assert.ok(oTileGroups === undefined, "Zero groups were mapped for 'tile_11'");

        //check link
        oTileGroups = oCatalogsManager.oTileCatalogToGroupsMap.tile_000;
        assert.ok(oTileGroups.length === 1, "One groups were mapped for 'tile_000'");
    });

    QUnit.test("deleteCatalogTileFromGroup: test remove tile from group", function (assert) {
        var done = assert.async();
        var aGroups,
            oData,
            nTiles;

        aGroups = oCatalogsManager.getModel().getProperty("/groups");
        oData = { tileId: "tile_03", groupIndex: 0 };
        nTiles = aGroups[0].tiles.length;

        oCatalogsManager.deleteCatalogTileFromGroup(oData);

        setTimeout(function () {
            aGroups = oCatalogsManager.getModel().getProperty("/groups");
            assert.ok(aGroups[0].tiles.length === nTiles - 1, "Tile should be deleted from group");
            done();
        }, 1000);
    });

    QUnit.test("deleteCatalogTileFromGroup: test remove link from group", function (assert) {
        var done = assert.async();
        var aGroups,
            oData,
            nLinks;

        aGroups = oCatalogsManager.getModel().getProperty("/groups");
        oData = { tileId: "tile_000", groupIndex: 0 };
        nLinks = aGroups[0].links.length;

        oCatalogsManager.deleteCatalogTileFromGroup(oData);

        setTimeout(function () {
            aGroups = oCatalogsManager.getModel().getProperty("/groups");
            assert.ok(aGroups[0].links.length === nLinks - 1, "Link should be deleted from group");
            done();
        }, 1000);
    });

    // asserts that Catalogs with the same title can be handled, too.
    QUnit.test("verify tiles catalog model", function (assert) {
        var done = assert.async();

        var isTileInMock = function (oTile) {
            var oCatalogs = mockData.catalogs,
                i,
                j;
            for (i = 0; i < oCatalogs.length; i++) {
                for (j = 0; j < oCatalogs[i].tiles.length; j++) {
                    if (oCatalogs[i].tiles[j].id === oTile.id) {
                        return true;
                    }
                }
            }
            return false;
        };

        assert.expect(6);
        oHomepageManager.oModel = new JSONModel({});
        oCatalogsManager.oModel = new JSONModel({});
        var iPreviousInitialLoad = oCatalogsManager;
        oCatalogsManager.iInitialLoad = 1;
        oCatalogsManager.getModel().setProperty("/enableCatalogTagFilter", true);
        oEventBus.publish("renderCatalog", {});
        setTimeout(function () { //since the showCatalog flow is asynchronous
            var oModel = oCatalogsManager.getModel(),
                aTileCatalogs = oModel.getProperty("/catalogs"),
                i,
                iIndexTiles;
            assert.deepEqual(oCatalogsManager.getModel().getProperty("/tagList"), [], "tag list was created");
            // empty catalog shall not be in this array
            assert.equal(aTileCatalogs.length, 2, "tile catalogs array should contain 2 items");
            for (i = 0; i < aTileCatalogs.length; i++) {
                for (iIndexTiles = 0; iIndexTiles < aTileCatalogs[i].customTiles.length; iIndexTiles++) {
                    assert.equal(
                        isTileInMock(aTileCatalogs[i].customTiles[iIndexTiles]),
                        true,
                        "tile with id " + aTileCatalogs[i].id + " should appear in the mock data"
                    );
                }
            }
            oCatalogsManager.getModel().setProperty("/enableCatalogTagFilter", false);
            oCatalogsManager.iInitialLoad = iPreviousInitialLoad;
            done();
        }, 1500);
    });

    QUnit.test("verify catalogs order", function (assert) {
        var done = assert.async();
        var isCatalogEqual = function (oCatalog, index) {
            var oCatalogs = mockData.catalogs;
            return oCatalog.title === oCatalogs[index].title;
        };
        oHomepageManager.oModel = new JSONModel({});
        oCatalogsManager.oModel = new JSONModel({});
        oEventBus.publish("renderCatalog", {});

        setTimeout(function () { //since the showCatalog flow is asynchronous
            var oModel = oCatalogsManager.getModel(),
                aTileCatalogs = oModel.getProperty("/catalogs"),
                i;

            assert.equal(aTileCatalogs.length, 2, "tile catalogs array should contain 2 items");
            for (i = 0; i < aTileCatalogs.length; i++) {
                assert.equal(isCatalogEqual(aTileCatalogs[i], i), true, "Catalogs are not in the right order");
            }
            done();
        }, 1500);
    });

    QUnit.test("verify catalog tile tag list", function (assert) {
        var aMockTagPool = ["tag2", "tag4", "tag2", "tag4", "tag1", "tag2", "tag2", "tag3", "tag1", "tag3", "tag2", "tag4"],
            aModelTagList;

        oCatalogsManager.tagsPool = aMockTagPool;

        // Calling the tested function:
        // Reads the tags from initialTagPool, aggregates them and inserts them to tagList property of the model
        oCatalogsManager.getTagList();
        // get tagList from model
        aModelTagList = oCatalogsManager.getModel().getProperty("/tagList");

        assert.equal(aModelTagList.length, 4, "Length of tag list in the model is 4");
        assert.equal(aModelTagList[0].occ, 5, "Tag2 appears 5 times");
        assert.equal(aModelTagList[0].tag, "tag2", "Tag2 has the most occurrences");
        assert.equal(aModelTagList[3].occ, 2, "Tag3 appears 2 times");
        assert.equal(aModelTagList[3].tag, "tag3", "Tag3 has the least occurrences");
    });

    QUnit.test("verify isTileIntentSupported property", function (assert) {
        var done = assert.async();
        var getIsTileIntentSupportedFromMock = function (sTileId) {
            var oCatalogs = mockData.catalogs,
                aTiles,
                i,
                j;

            for (i = 0; i < oCatalogs.length; i++) {
                aTiles = oCatalogs[i].tiles;
                for (j = 0; j < aTiles.length; j++) {
                    if (aTiles[j].id === sTileId) {
                        return (aTiles[j].properties.formFactor.indexOf("Desktop") !== -1);
                    }
                }
            }
            return false;
        };

        assert.expect(5);
        oHomepageManager.oModel = new JSONModel({});
        oCatalogsManager.oModel = new JSONModel({});
        oEventBus.publish("renderCatalog", {});

        setTimeout(function () { //since the showCatalog flow is asynchronous
            var oModel = oCatalogsManager.getModel(),
                aTileCatalogs = oModel.getProperty("/catalogs"),
                i,
                iIndexTiles;

            assert.equal(aTileCatalogs.length, 2, "tile catalogs array should contain 2 items");

            for (i = 0; i < aTileCatalogs.length; i++) {
                for (iIndexTiles = 0; iIndexTiles < aTileCatalogs[i].customTiles.length; iIndexTiles++) {
                    assert.equal(
                        aTileCatalogs[i].customTiles[iIndexTiles].isTileIntentSupported,
                        getIsTileIntentSupportedFromMock(aTileCatalogs[i].customTiles[iIndexTiles].id),
                        "tile " + aTileCatalogs[i].customTiles[iIndexTiles].id + " supposed not to be supported in Desktop"
                    );
                }
            }

            done();
        }, 1800);
    });

    QUnit.test("create a new group and save tile", function (assert) {
        var done = assert.async();

        var oModel = oCatalogsManager.getModel(),
            aGroups = oModel.getProperty("/groups"),
            iOriginalGroupsLength = aGroups.length,
            catalogTileContext = new Context(oModel, "/catalogTiles/0"),
            newGroupName = "group_4",
            catalogTileId,
            newGroupTile;

        oCatalogsManager.createGroupAndSaveTile({
            catalogTileContext: catalogTileContext,
            newGroupName: newGroupName
        });

        setTimeout(function () {
            aGroups = oCatalogsManager.getModel().getProperty("/groups");
            catalogTileId = oCatalogsManager.getModel().getProperty("/catalogTiles/0/id");
            newGroupTile = aGroups[aGroups.length - 1].tiles[0].object.id;

            assert.ok(aGroups.length === iOriginalGroupsLength + 1, "Original groups length increased by 1");
            assert.equal(aGroups[aGroups.length - 1].title, "group_4", "Expected group was added");
            assert.ok(newGroupTile === catalogTileId, "A tile was added to the new group");

            done();
        }, 1000);
    });

    QUnit.test("verify new group creation and failure in adding tile", function (assert) {
        var done = assert.async();
        var oModel = oCatalogsManager.getModel(),
            aGroups = oModel.getProperty("/groups"),
            iOriginalGroupsLength = aGroups.length,
            catalogTileContext = new Context(oModel, "/catalogTiles/0"),
            newGroupName = "group_4",
            tmpFunction = oCatalogsManager.createTile,
            deferred;

        oCatalogsManager.createTile = function () {
            deferred = new jQuery.Deferred();
            deferred.resolve({ group: null, status: 0, action: "add" }); // 0 - failure
            return deferred.promise();
        };

        oCatalogsManager.createGroupAndSaveTile({
            catalogTileContext: catalogTileContext,
            newGroupName: newGroupName
        });

        setTimeout(function () {
            aGroups = oCatalogsManager.getModel().getProperty("/groups");

            assert.ok(aGroups.length === iOriginalGroupsLength + 1, "Original groups length increased by 1");
            assert.ok(aGroups[aGroups.length - 1].tiles.length === 0, "Tile was not added to the new group");
            done();

            oCatalogsManager.createTile = tmpFunction;
        }, 1000);
    });

    QUnit.test("verify new group validity", function (assert) {
        var oModel = oCatalogsManager.getModel(),
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

        aGroups = oCatalogsManager.getModel().getProperty("/groups");
        assert.ok(aGroups.length === iOriginalGroupsLength, "New group was not added");
    });

    QUnit.test("Does not call loadPersonalizedGroups if spaces is enabled", function (assert) {
        // Arrange
        oHomepageManager.oModel = new JSONModel({});
        var oLoadPersonalizedGroupsStub = sinon.stub(oHomepageManager, "loadPersonalizedGroups");
        oLoadPersonalizedGroupsStub.returns(new jQuery.Deferred());

        var oLastStub = sinon.stub(Config, "last");
        oLastStub.withArgs("/core/spaces/enabled").returns(true);

        oCatalogsManager.oModel = new JSONModel({});
        // Act
        oCatalogsManager.loadAllCatalogs();
        //Assert
        assert.strictEqual(oLastStub.callCount, 1, "last was called once");
        assert.strictEqual(oLoadPersonalizedGroupsStub.callCount, 0, "loadPersonalizedGroups was not called");

        //Cleanup
        oLastStub.restore();
        oHomepageManager.destroy();
        oCatalogsManager.destroy();
    });

    QUnit.test("Calls loadPersonalizedGroups if spaces is disabled", function (assert) {
        // Arrange
        oHomepageManager.oModel = new JSONModel({});
        oCatalogsManager.oModel = new JSONModel({});
        var oLoadPersonalizedGroupsStub = sinon.stub(oHomepageManager, "loadPersonalizedGroups");
        oLoadPersonalizedGroupsStub.returns(new jQuery.Deferred());

        var oLastStub = sinon.stub(Config, "last");
        oLastStub.withArgs("/core/spaces/enabled").returns(false);

        // Act
        oCatalogsManager.loadAllCatalogs();

        //Assert
        assert.strictEqual(oLastStub.callCount, 1, "last was called once");
        assert.strictEqual(oLoadPersonalizedGroupsStub.callCount, 1, "loadPersonalizedGroups was called once");

        //Cleanup
        oLastStub.restore();
        oHomepageManager.destroy();
        oCatalogsManager.destroy();
    });

    QUnit.module("The function createCatalogAppBoxes", {
        beforeEach: function () {
            this.oConfigLastStub = sandbox.stub(Config, "last");

            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oCatalogTile = {
                id: "catalogId",
                title: "catalogTitle"
            };

            this.oGetStableCatalogTileIdStub = sandbox.stub().withArgs(this.oCatalogTile).returns("stableId");

            this.oGetServiceAsyncStub.withArgs("FlpLaunchPage").resolves({
                getCatalogTileId: sandbox.stub().withArgs(this.oCatalogTile).returns("id"),
                getStableCatalogTileId: this.oGetStableCatalogTileIdStub,
                getCatalogTileTags: sandbox.stub().withArgs(this.oCatalogTile).returns(["tag1", "tag2"]),
                getCatalogTilePreviewTitle: sandbox.stub().withArgs(this.oCatalogTile).returns("previewTitle"),
                getCatalogTilePreviewSubtitle: sandbox.stub().withArgs(this.oCatalogTile).returns("previewSubtitle"),
                getCatalogTilePreviewIcon: sandbox.stub().withArgs(this.oCatalogTile).returns("previewIcon"),
                getCatalogTileKeywords: sandbox.stub().withArgs(this.oCatalogTile).returns(["keyword1", "keyword2"]),
                getCatalogTileTargetURL: sandbox.stub().withArgs(this.oCatalogTile).returns("targetURL"),
                getCatalogTileContentProviderId: sandbox.stub().withArgs(this.oCatalogTile).returns("contentProviderId")
            });

            sandbox.stub(LaunchPageReadUtils, "getContentProviderLabel").resolves("contentProviderId");

            sap.ushell.components = {
                getHomepageManager: sandbox.stub()
            };

            var oModel = new JSONModel({});
            this.oCatalogsManager = new CatalogsManager("catalogsMgr", { model: oModel });

            return Container.getServiceAsync("FlpLaunchPage");
        },
        afterEach: function () {
            sandbox.restore();
            this.oCatalogsManager.destroy();
            delete sap.ushell.components;
        }
    });

    QUnit.test("Returns an AppBox with stableIds when spaces are enabled", async function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(true);

        const oExpectedResult = {
            id: "stableId",
            associatedGroups: [],
            src: this.oCatalogTile,
            title: "previewTitle",
            subtitle: "previewSubtitle",
            icon: "previewIcon",
            keywords: "keyword1,keyword2",
            tags: ["tag1", "tag2"],
            navigationMode: undefined,
            url: "targetURL",
            contentProviderLabel: "contentProviderId"
        };
        // Act
        const oResult = await this.oCatalogsManager.createCatalogAppBoxes(this.oCatalogTile, true);
        // Assert
        assert.deepEqual(oResult, oExpectedResult, "Returned the correct result");
    });

    QUnit.test("Returns an AppBox with regular ids when spaces are enabled, but the LaunchPageAdapter does not implement getStableCatalogTileId", async function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(true);
        this.oGetStableCatalogTileIdStub.returns(null);

        const oExpectedResult = {
            id: "id",
            associatedGroups: [],
            src: this.oCatalogTile,
            title: "previewTitle",
            subtitle: "previewSubtitle",
            icon: "previewIcon",
            keywords: "keyword1,keyword2",
            tags: ["tag1", "tag2"],
            navigationMode: undefined,
            url: "targetURL",
            contentProviderLabel: "contentProviderId"
        };
        // Act
        const oResult = await this.oCatalogsManager.createCatalogAppBoxes(this.oCatalogTile, true);
        // Assert
        assert.deepEqual(oResult, oExpectedResult, "Returned the correct result");
    });

    QUnit.test("Returns an AppBox with regular ids when spaces are disabled", async function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/stableIDs/enabled").returns(true);
        this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(false);

        const oExpectedResult = {
            id: "id",
            associatedGroups: [],
            src: this.oCatalogTile,
            title: "previewTitle",
            subtitle: "previewSubtitle",
            icon: "previewIcon",
            keywords: "keyword1,keyword2",
            tags: ["tag1", "tag2"],
            navigationMode: undefined,
            url: "targetURL",
            contentProviderLabel: "contentProviderId"
        };
        // Act
        const oResult = await this.oCatalogsManager.createCatalogAppBoxes(this.oCatalogTile, true);
        // Assert
        assert.deepEqual(oResult, oExpectedResult, "Returned the correct result");
    });

    QUnit.test("Returns an AppBox with regular ids when stableIds and spaces are disabled", async function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/stableIDs/enabled").returns(false);
        this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(false);

        const oExpectedResult = {
            id: "id",
            associatedGroups: [],
            src: this.oCatalogTile,
            title: "previewTitle",
            subtitle: "previewSubtitle",
            icon: "previewIcon",
            keywords: "keyword1,keyword2",
            tags: ["tag1", "tag2"],
            navigationMode: undefined,
            url: "targetURL",
            contentProviderLabel: "contentProviderId"
        };
        // Act
        const oResult = await this.oCatalogsManager.createCatalogAppBoxes(this.oCatalogTile, true);
        // Assert
        assert.deepEqual(oResult, oExpectedResult, "Returned the correct result");
    });

    QUnit.module("The function createCatalogTiles", {
        beforeEach: function () {
            this.oConfigLastStub = sandbox.stub(Config, "last");

            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oCatalogTile = {
                id: "catalogId",
                title: "catalogTitle",
                tileType: "catalogTitleType",
                getChip: sandbox.stub().returns({
                    getBaseChipId: sandbox.stub().returns("X-SAP-UI2-CHIP:/UI2/CUSTOM")
                })
            };
            this.oTileView = { id: "tileView" };

            this.oGetStableCatalogTileIdStub = sandbox.stub().withArgs(this.oCatalogTile).returns("stableId");

            this.oGetServiceAsyncStub.withArgs("FlpLaunchPage").resolves({
                getCatalogTileId: sandbox.stub().withArgs(this.oCatalogTile).returns("id"),
                getStableCatalogTileId: this.oGetStableCatalogTileIdStub,
                getCatalogTileTags: sandbox.stub().withArgs(this.oCatalogTile).returns(["tag1", "tag2"]),
                getCatalogTilePreviewTitle: sandbox.stub().withArgs(this.oCatalogTile).returns("previewTitle"),
                getCatalogTileKeywords: sandbox.stub().withArgs(this.oCatalogTile).returns(["keyword1", "keyword2"]),
                getCatalogTileSize: sandbox.stub().withArgs(this.oCatalogTile).returns("1x1"),
                isTileIntentSupported: sandbox.stub().withArgs(this.oCatalogTile).returns(true),
                getCatalogTileViewControl: sandbox.stub().withArgs(this.oCatalogTile).returns(new jQuery.Deferred().resolve(this.oTileView).promise()),
                getCatalogTileContentProviderId: sandbox.stub().withArgs(this.oCatalogTile).returns("contentProviderId")
            });

            sandbox.stub(LaunchPageReadUtils, "getContentProviderLabel").resolves("contentProviderId");

            sap.ushell.components = {
                getHomepageManager: sandbox.stub()
            };

            let oModel = new JSONModel({});
            this.oCatalogsManager = new CatalogsManager("catalogsMgr", { model: oModel });

            return Container.getServiceAsync("FlpLaunchPage");
        },
        afterEach: function () {
            sandbox.restore();
            this.oCatalogsManager.destroy();
            delete sap.ushell.components;
        }
    });

    QUnit.test("Resolves a tile with stableIds when spaces are enabled", async function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(true);

        const oExpectedResult = {
            associatedGroups: [],
            src: this.oCatalogTile,
            catalog: "catalogTitle",
            catalogId: "catalogId",
            title: "previewTitle",
            tags: ["tag1", "tag2"],
            keywords: "keyword1,keyword2",
            id: "stableId",
            size: "1x1",
            content: [this.oTileView],
            isTileIntentSupported: true,
            tileType: "catalogTitleType",
            contentProviderLabel: "contentProviderId"
        };
        // Act
        const oResult = await this.oCatalogsManager.createCatalogTiles(this.oCatalogTile, true);
        // Assert
        assert.deepEqual(oResult, oExpectedResult, "Resolved the correct result");
    });

    QUnit.test("Resolves a tile with regular ids when spaces are enabled, but the LaunchPageAdapter does not implement getStableCatalogTileId", async function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(true);
        this.oGetStableCatalogTileIdStub.returns(null);

        const oExpectedResult = {
            associatedGroups: [],
            src: this.oCatalogTile,
            catalog: "catalogTitle",
            catalogId: "catalogId",
            title: "previewTitle",
            tags: ["tag1", "tag2"],
            keywords: "keyword1,keyword2",
            id: "id",
            size: "1x1",
            content: [this.oTileView],
            isTileIntentSupported: true,
            tileType: "catalogTitleType",
            contentProviderLabel: "contentProviderId"
        };
        // Act
        const oResult = await this.oCatalogsManager.createCatalogTiles(this.oCatalogTile, true);
        // Assert
        assert.deepEqual(oResult, oExpectedResult, "Resolved the correct result");
    });

    QUnit.test("Resolves a tile with regular ids when spaces is disabled", async function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/stableIDs/enabled").returns(true);
        this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(false);

        const oExpectedResult = {
            associatedGroups: [],
            src: this.oCatalogTile,
            catalog: "catalogTitle",
            catalogId: "catalogId",
            title: "previewTitle",
            tags: ["tag1", "tag2"],
            keywords: "keyword1,keyword2",
            id: "id",
            size: "1x1",
            content: [this.oTileView],
            isTileIntentSupported: true,
            tileType: "catalogTitleType",
            contentProviderLabel: "contentProviderId"
        };
        // Act
        const oResult = await this.oCatalogsManager.createCatalogTiles(this.oCatalogTile, true);
        // Assert
        assert.deepEqual(oResult, oExpectedResult, "Resolved the correct result");

    });

    QUnit.test("Resolves a tile with regular ids when stableIds and spaces are disabled", async function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/stableIDs/enabled").returns(false);
        this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(false);

        const oExpectedResult = {
            associatedGroups: [],
            src: this.oCatalogTile,
            catalog: "catalogTitle",
            catalogId: "catalogId",
            title: "previewTitle",
            tags: ["tag1", "tag2"],
            keywords: "keyword1,keyword2",
            id: "id",
            size: "1x1",
            content: [this.oTileView],
            isTileIntentSupported: true,
            tileType: "catalogTitleType",
            contentProviderLabel: "contentProviderId"
        };
        // Act
        const oResult = await this.oCatalogsManager.createCatalogTiles(this.oCatalogTile, true);
        // Assert
        assert.deepEqual(oResult, oExpectedResult, "Resolved the correct result");
    });

    QUnit.module("The function createCatalogAppBoxes", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oCatalogTile = {
                id: "catalogId",
                title: "catalogTitle"
            };

            this.oGetServiceAsyncStub.withArgs("FlpLaunchPage").resolves({
                getCatalogTilePreviewTitle: sandbox.stub().withArgs(this.oCatalogTile).returns("previewTitle"),
                getCatalogTilePreviewSubtitle: sandbox.stub().withArgs(this.oCatalogTile).returns("previewSubtitle"),
                getCatalogTileTargetURL: sandbox.stub().withArgs(this.oCatalogTile).returns("targetURL")
            });

            sandbox.stub(LaunchPageReadUtils, "getContentProviderLabel").resolves("contentProviderId");

            sap.ushell.components = {
                getHomepageManager: sandbox.stub()
            };

            this.oModel = new JSONModel({});
            this.oCatalogsManager = new CatalogsManager("catalogsMgr", { model: this.oModel });

            return Container.getServiceAsync("FlpLaunchPage");
        },
        afterEach: function () {
            sandbox.restore();
            this.oCatalogsManager.destroy();
            delete sap.ushell.components;
        }
    });

    QUnit.test("_getIsAppBox accepts lower case value \"tiles\"", async function (assert) {
        // Arrange
        this.oModel.setProperty("/appFinderDisplayMode", "tiles");

        // Act
        const bResult = this.oCatalogsManager._getIsAppBox(this.oCatalogTile);

        // Assert
        assert.strictEqual(bResult, false, "lower case \"tiles\" returned false.");
    });

    QUnit.test("_getIsAppBox accepts upper case value \"Tiles\"", async function (assert) {
        // Arrange
        this.oModel.setProperty("/appFinderDisplayMode", "Tiles");

        // Act
        const bResult = this.oCatalogsManager._getIsAppBox(this.oCatalogTile);

        // Assert
        assert.strictEqual(bResult, false, "upper case \"Tiles\" returned false.");
    });

    QUnit.test("_getIsAppBox defaults to appBoxes #1", async function (assert) {
        // Arrange
        this.oModel.setProperty("/appFinderDisplayMode", "something");

        // Act
        const bResult = this.oCatalogsManager._getIsAppBox(this.oCatalogTile);

        // Assert
        assert.strictEqual(bResult, true, "should use appBoxes.");
    });

    QUnit.test("_getIsAppBox defaults to appBoxes #2", async function (assert) {
        // Arrange
        this.oModel.setProperty("/appFinderDisplayMode", undefined);

        // Act
        const bResult = this.oCatalogsManager._getIsAppBox(this.oCatalogTile);

        // Assert
        assert.strictEqual(bResult, true, "should use appBoxes.");
    });
});
