// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components._HomepageManager.DashboardLoadingManager
 * @deprecated since 1.120
 */
sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "sap/ushell/components/HomepageManager",
    "sap/ushell/components/_HomepageManager/DashboardLoadingManager",
    "sap/ushell/shells/demo/fioriDemoConfig",
    "sap/ushell/Container"
], function (
    JSONModel,
    Device,
    HomepageManager,
    DashboardLoadingManager,
    fioriDemoConfig,
    Container
) {
    "use strict";

    /* global QUnit, sinon */

    var oHomepageManager = null;
    var oDashboardLoadingManager = null;
    var mockData = {};
    var oTestContent = {
        groups: []
    };

    var generateGroups = function (nNumberGroups, nNumberTileInEachGroups) {
        var iGroupInd = 0, iTileIndex = 0;

        for (iGroupInd = 0; iGroupInd < nNumberGroups; iGroupInd++) {
            var oGeneratedGroup = {
                id: "generated" + iGroupInd,
                tiles: [],
                title: "generated" + iGroupInd
            };
            oTestContent.groups.push(oGeneratedGroup);

            for (iTileIndex = 0; iTileIndex < nNumberTileInEachGroups; iTileIndex++) {
                var oGenTile = {
                    chipId: "genGroupTile_" + iGroupInd + "-" + iTileIndex,
                    title: "Generated " + iGroupInd + " - " + iTileIndex,
                    size: "1x1",
                    tileType: "sap.ushell.ui.tile.DynamicTile",
                    isLinkPersonalizationSupported: true,
                    keywords: ["risk", "neutral", "account"],
                    formFactor: "Desktop,Tablet,Phone",
                    tags: ["Liquidity", "Financial"],
                    properties: {
                        title: "Generated " + iGroupInd + " - " + iTileIndex,
                        subtitle: "Rating A- and below",
                        infoState: "Neutral",
                        info: "Today",
                        // icon: "sap-icon://flight",
                        numberValue: 106.6,
                        numberDigits: 1,
                        numberState: "Neutral",
                        numberUnit: "M€",
                        targetURL: "#Action-toappnavsample"
                    }
                };

                oGeneratedGroup.tiles.push(oGenTile);
            }
        }
        return oTestContent.groups;
    };

    QUnit.module("sap.ushell.components._HomepageManager.DashboardLoadingManager", {
        beforeEach: function (assert) {
            var done = assert.async();
            Container.init("local")
                .then(function () {
                    mockData = {
                        groups: [],
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
                        }],
                        tagList: []
                    };
                    done();
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

            if (oDashboardLoadingManager) {
                oDashboardLoadingManager.destroy();
            }
            oDashboardLoadingManager = null;
        }
    });

    QUnit.test("create instance", function (assert) {
        mockData.groups = generateGroups(20, 50);
        oHomepageManager = new HomepageManager("dashboardMgr", { model: new JSONModel(mockData) });
        assert.ok(oHomepageManager, "Instance dashboardMgr was created");
    });

    QUnit.test("create instance", function (assert) {
        oDashboardLoadingManager = new DashboardLoadingManager("dashboardLoadingMgr", { model: new JSONModel(mockData) });
        assert.ok(oDashboardLoadingManager, "Instance dashboardLoadingMgr was created");
    });

    QUnit.test("Constructor Test", function (assert) {
        oHomepageManager = new HomepageManager("dashboardMgr", { model: new JSONModel(mockData) });
        oDashboardLoadingManager = oHomepageManager.oDashboardLoadingManager;
        assert.ok(oDashboardLoadingManager.currentVisibleTiles.length === 0, "currentVisibleTiles");
        assert.ok(oDashboardLoadingManager.oBusyIndicatorTiles.constructor === Object, "oBusyIndicatorTiles");
        assert.ok(oDashboardLoadingManager.oActiveDynamicTiles.constructor === Object, "oActiveDynamicTiles");
        assert.ok(oDashboardLoadingManager.oResolvedTiles.constructor === Object, "oResolvedTiles");
        assert.ok(oDashboardLoadingManager.oInProgressTiles.constructor === Object, "oInProgressTiles");
        if (!(Device.browser.internet_explorer && Device.browser.version < 12)) {
            //internet explorer doesn't support the "name" property of function prior to version 12
            assert.ok(oDashboardLoadingManager.oDashboardManager.getTileView.name === "getTileView", "oHomepageManager - getTileView");
        }
    });

    QUnit.test("check on Visibility Changed", function (assert) {
        mockData.groups = generateGroups(20, 50);
        oHomepageManager = new HomepageManager("dashboardMgr", { model: new JSONModel(mockData) });
        oDashboardLoadingManager = oHomepageManager.oDashboardLoadingManager;
        var fnManageBusyIndicatorTiles = sinon.spy(oDashboardLoadingManager, "manageBusyIndicatorTiles");
        var fnManageDynamicTiles = sinon.spy(oDashboardLoadingManager, "manageDynamicTiles");
        sinon.stub(oHomepageManager, "isBlindLoading", function () {
            return true;
        });

        var visibleTiles = {
            bIsExtanded: false,
            oTile: mockData.groups[3],
            iGroup: 3
        };

        oDashboardLoadingManager._onVisibilityChanged("launchpad", "visibleTilesChanged", visibleTiles);
        assert.ok(fnManageBusyIndicatorTiles.calledOnce, "ManageTilesView was called once");
        assert.ok(fnManageBusyIndicatorTiles.calledOnce, "ManageBusyIndicatorTiles was called once");
        assert.ok(fnManageDynamicTiles.calledOnce, "ManageDynamicTiles was called once");
        assert.equal(oDashboardLoadingManager.currentVisibleTiles === visibleTiles, true, "Current VisibleTiles is ok");
    });

    QUnit.test("check is TileView Request ", function (assert) {
        mockData.groups = generateGroups(20, 50);
        oHomepageManager = new HomepageManager("dashboardMgr", { model: new JSONModel(mockData) });
        oDashboardLoadingManager = oHomepageManager.oDashboardLoadingManager;

        var tile1 = mockData.groups[3].tiles[0];
        var tile2 = mockData.groups[3].tiles[0];

        assert.equal(oDashboardLoadingManager.isTileViewRequestIssued(tile1), false, "this tile no issue requests");
        oDashboardLoadingManager.setTileResolved(tile1);
        assert.equal(oDashboardLoadingManager.isTileViewRequestIssued(tile1), true, "this tile is resolved tile1");
        oDashboardLoadingManager.setTileInProgress(tile2);
        assert.equal(oDashboardLoadingManager.isTileViewRequestIssued(tile2), true, "this tile is in progress tile2");
    });

    QUnit.test("check addTileToRefreshArray", function (assert) {
        // Arrange
        oHomepageManager = new HomepageManager("dashboardMgr", { model: new JSONModel(mockData) });
        oDashboardLoadingManager = oHomepageManager.oDashboardLoadingManager;
        oDashboardLoadingManager.aRefreshTiles = [];

        // Act
        oDashboardLoadingManager._addTileToRefreshArray(null, null, { id: 0 });

        // Assert
        assert.ok(oDashboardLoadingManager.aRefreshTiles.length === 1, "added one object successfully");
    });

    [{
        testDescription: "0 tiles visible and 0 tiles of these need to be refreshed",
        aTiles: [],
        iRefreshTiles: 0,
        oExpected: {
            iNumberOfRefreshCalled: 0
        }
    }, {
        testDescription: "3 tiles visible and 0 tiles of these need to be refreshed",
        aTiles: [{
            oTile: {
                content: [{ oParent: { id: 0 } }],
                object: {}
            }
        }, {
            oTile: {
                content: [{ oParent: { id: 1 } }],
                object: {}
            }
        }, {
            oTile: {
                content: [{ oParent: { id: 2 } }],
                object: {}
            }
        }],
        iRefreshTiles: 0,
        oExpected: {
            iNumberOfRefreshCalled: 0
        }
    }, {
        testDescription: "3 tiles visible and 1 tile of these needs to be refreshed",
        aTiles: [{
            oTile: {
                content: [{ oParent: { id: 0 } }],
                object: {}
            }
        }, {
            oTile: {
                content: [{ oParent: { id: 1 } }],
                object: {}
            }
        }, {
            oTile: {
                content: [{ oParent: { id: 2 } }],
                object: {}
            }
        }],
        iRefreshTiles: 1,
        oExpected: {
            iNumberOfRefreshCalled: 1
        }
    }, {
        testDescription: "3 tiles visible and 2 tiles of these needs to be refreshed",
        aTiles: [{
            oTile: {
                content: [{ oParent: { id: 0 } }],
                object: {}
            }
        }, {
            oTile: {
                content: [{ oParent: { id: 1 } }],
                object: {}
            }
        }, {
            oTile: {
                content: [{ oParent: { id: 2 } }],
                object: {}
            }
        }],
        iRefreshTiles: 2,
        oExpected: {
            iNumberOfRefreshCalled: 2
        }
    }].forEach(function (oFixture) {
        QUnit.test("refreshTiles - " + oFixture.testDescription, function (assert) {
            // Arrange
            mockData.groups = generateGroups(20, 50);
            oHomepageManager = new HomepageManager("dashboardMgr", { model: new JSONModel(mockData) });
            oDashboardLoadingManager = oHomepageManager.oDashboardLoadingManager;
            var fnSetTileVisibleStub = sinon.stub(oHomepageManager, "setTileVisible"),
                fnRefreshTileStub = sinon.stub(oHomepageManager, "refreshTile");

            oDashboardLoadingManager.currentVisibleTiles = oFixture.aTiles;
            oDashboardLoadingManager.aRefreshTiles = [];
            if (oFixture.iRefreshTiles > 0) {
                oDashboardLoadingManager.aRefreshTiles.push(oFixture.aTiles[0].oTile.uuid);
                if (oFixture.iRefreshTiles === 2) {
                    oDashboardLoadingManager.aRefreshTiles.push(oFixture.aTiles[1].oTile.uuid);
                }
            }

            // Act
            oDashboardLoadingManager._refreshTiles();

            // Assert
            assert.strictEqual(fnSetTileVisibleStub.callCount, oFixture.oExpected.iNumberOfRefreshCalled, "setTileVisible was called exactly " + oFixture.iNumberOfRefreshCalled);
            assert.strictEqual(fnRefreshTileStub.callCount, oFixture.oExpected.iNumberOfRefreshCalled, "refreshTile was called exactly " + oFixture.iNumberOfRefreshCalled);

            fnSetTileVisibleStub.restore();
            fnRefreshTileStub.restore();
        });
    });

    QUnit.test("check manage Busy IndicatorTiles ", function (assert) {
        mockData.groups = generateGroups(20, 50);
        oHomepageManager = new HomepageManager("dashboardMgr", { model: new JSONModel(mockData) });
        oDashboardLoadingManager = oHomepageManager.oDashboardLoadingManager;

        mockData.groups[3].object = true;
        mockData.groups[3].uuid = "tile_00";
        mockData.groups[4].uuid = "tile_04";
        mockData.groups[2].uuid = "tile_01";

        mockData.groups[3].content = [{
            setState: function (str) {
                mockData.groups[3].state = str;
            }
        }];

        mockData.groups[2].content = [{
            setState: function (str) {
                mockData.groups[2].state = str;
            }
        }];

        mockData.groups[4].content = [{
            setState: function (str) {
                mockData.groups[4].state = str;
            }
        }];

        var visibleTiles = {
            bIsExtanded: false,
            oTile: mockData.groups[3],
            iGroup: 3
        };
        var visibleTiles2 = {
            bIsExtanded: false,
            oTile: mockData.groups[4],
            iGroup: 3
        };

        var visibleTiles1 = {
            bIsExtanded: false,
            oTile: mockData.groups[2],
            iGroup: 3
        };

        oDashboardLoadingManager.oBusyIndicatorTiles = [visibleTiles2];
        oDashboardLoadingManager.currentVisibleTiles = [visibleTiles1, visibleTiles];
        oDashboardLoadingManager.manageBusyIndicatorTiles();

        assert.ok(mockData.groups[2].state === "Loading", "Add busy indicator.");
        assert.ok(mockData.groups[4].state === undefined, "Remove busy indicator for invisible tiles");
    });
});
