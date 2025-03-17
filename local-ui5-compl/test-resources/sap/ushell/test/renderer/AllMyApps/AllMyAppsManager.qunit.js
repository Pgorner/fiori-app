// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.renderer.AllMyAppsManager.
 * Testing the consumptions of groups data, external providers data and catalogs data
 * and how the model is updated in each use-case.
 *
 * Tested functions:
 * - _handleGroupsData
 * - _getGroupsData
 * - _handleExternalProvidersData
 * - _addCatalogToModel
 */
sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/Container",
    "sap/ushell/library",
    "sap/ushell/renderer/allMyApps/AllMyAppsManager"
], function (
    JSONModel,
    jQuery,
    Container,
    ushellLibrary,
    oAllMyAppsManager
) {
    "use strict";

    /* global QUnit, sinon */

    var AllMyAppsProviderType = ushellLibrary.AllMyAppsProviderType;

    var sandbox = sinon.createSandbox();

    var oGetGroupsDataResponse = [{
        title: "Group 0",
        apps: [
            { title: "Tile 0", url: "#a-b" },
            { title: "Tile 1", url: "#a-b" },
            { title: "Tile 2", url: "#a-b" }
        ]
    }, {
        title: "Group 1",
        apps: [
            { title: "Tile 0", url: "#a-b" },
            { title: "Tile 1", url: "#a-b" },
            { title: "Tile 2", url: "#a-b" }
        ]
    }, {
        title: "Group 2",
        apps: [
            { title: "Tile 0", url: "#a-b" },
            { title: "Tile 1", url: "#a-b" },
            { title: "Tile 2", url: "#a-b" }
        ]
    }],
        oLaunchPageGetGroupsResponse = [{
            id: "group_0",
            title: "Group 0",
            isPreset: true,
            isVisible: true,
            tiles: [{
                id: "tile_1",
                title: "Tile 1",
                tileType: "sap.ushell.ui.tile.StaticTile",
                isLink: true,
                properties: {
                    text: "I am a long long long long long long long long long long long long link!",
                    href: "#a1-b1"
                }
            }, {
                id: "tile_2",
                title: "Tile 2",
                tileType: "sap.ushell.ui.tile.StaticTile",
                isLink: true,
                properties: {
                    text: "I am a link!",
                    href: "#Action-todefaultapp"
                }
            }, {
                id: "tile_3",
                title: "Tile 3",
                tileType: "sap.ushell.ui.tile.StaticTile",
                formFactor: "Tablet,Phone",
                chipId: "catalogTile_34",
                properties: {
                    title: "WEB GUI",
                    subtitle: "Opens WEB GUI",
                    targetURL: "#Action-WEBGUI"
                }
            }, {
                id: "Tile_Intent_not_supported",
                title: "Tile_Intent_not_supported",
                tileType: "sap.ushell.ui.tile.StaticTile",
                formFactor: "Tablet,Phone",
                chipId: "catalogTile_34",
                properties: {
                    title: "Tile_Intent_not_supported",
                    subtitle: "Opens WEB GUI",
                    targetURL: "#Action-WEBGUI"
                }
            }, {
                id: "Tile_no_title",
                tileType: "sap.ushell.ui.tile.StaticTile",
                formFactor: "Tablet,Phone",
                chipId: "catalogTile_34",
                properties: {
                    subtitle: "Opens WEB GUI",
                    targetURL: "#Action-WEBGUI"
                }
            }, {
                id: "Tile_No_Url",
                title: "Tile No Url",
                size: "1x1",
                tileType: "sap.ushell.ui.tile.StaticTile",
                formFactor: "Tablet,Phone",
                chipId: "catalogTile_34",
                properties: {
                    title: "WEB GUI",
                    subtitle: "Opens WEB GUI"
                }
            }]
        }, {
            id: "group_1",
            title: "Group 1",
            isPreset: false,
            isVisible: true,
            tiles: [{
                id: "tile_30",
                title: "Long Tile 1",
                tileType: "sap.ushell.ui.tile.StaticTile",
                chipId: "catalogTile_38",
                properties: {
                    title: "Long Tile 1",
                    subtitle: "Long Tile 1",
                    targetURL: "#Action-todefaultapp"
                }
            }, {
                id: "tile_31",
                title: "Long Tile 2",
                tileType: "sap.ushell.ui.tile.StaticTile",
                chipId: "catalogTile_38",
                properties: {
                    title: "Long Tile 2",
                    subtitle: "Long Tile 2",
                    targetURL: "#Action-todefaultapp"
                }
            }, {
                id: "tile_33",
                title: "Regular Tile 2",
                tileType: "sap.ushell.ui.tile.StaticTile",
                chipId: "catalogTile_10",
                properties: {
                    title: "Regular Tile 2",
                    subtitle: "Regular Tile 2",
                    targetURL: "http://www.heise.de"
                }
            }]
        }, {
            id: "group_2",
            title: "Group 2",
            isPreset: true,
            isVisible: true,
            tiles: [{
                chipId: "catalogTile_35",
                title: "US Profit Margin is at",
                tileType: "sap.ushell.ui.tile.DynamicTile",
                properties: {
                    title: "US Profit Margin is at",
                    targetURL: "#Action-toappnavsample"
                }
            }, {
                chipId: "catalogTile_36",
                title: "Gross Revenue under Target at",
                tileType: "sap.ushell.ui.tile.DynamicTile",
                properties: {
                    title: "Gross Revenue under Target at",
                    targetURL: "#Action-approvepurchaseorders"
                }
            }, {
                chipId: "catalogTile_35",
                title: "US Profit Margin is at",
                tileType: "sap.ushell.ui.tile.DynamicTile",
                properties: {
                    title: "US Profit Margin is at",
                    targetURL: "#Action-toappnavsample"
                }
            }]
        }, {
            id: "Hidden_Group",
            title: "Hidden Group",
            isPreset: true,
            isVisible: false,
            tiles: [{
                id: "Hidden_tile_1_id",
                title: "Hidden title 1",
                tileType: "sap.ushell.ui.tile.StaticTile",
                chipId: "catalogTile_38",
                properties: {
                    title: "Long Tile 2",
                    subtitle: "Long Tile 1",
                    targetURL: "#Action-todefaultapp"
                }
            }, {
                id: "Hidden_tile_2_id",
                title: "Hidden title 2",
                tileType: "sap.ushell.ui.tile.StaticTile",
                chipId: "catalogTile_38",
                properties: {
                    title: "Long Tile 2",
                    subtitle: "Long Tile 2",
                    targetURL: "#Action-todefaultapp"
                }
            }]
        }, {
            id: "group_No_Valid_Tiles",
            title: "No valid tiles",
            isPreset: true,
            isVisible: true,
            tiles: [{
                id: "tile_no_title",
                tileType: "sap.ushell.ui.tile.StaticTile",
                chipId: "catalogTile_38",
                properties: {
                    subtitle: "Long Tile 1",
                    targetURL: "#Action-todefaultapp"
                }
            }, {
                id: "tile_no_url",
                title: "tile_no_url",
                tileType: "sap.ushell.ui.tile.StaticTile",
                chipId: "catalogTile_38",
                properties: {
                    title: "Long Tile 2",
                    subtitle: "Long Tile 2"
                }
            }]
        }],
        aExternalProviderData0 = [{
            // Group 1
            title: "Group01",
            apps: [
                { title: "P0_G1_Title1", subTitle: "P0_G1_SubTitle1", url: "#Action-todefaultapp" },
                { title: "P0_G1_Title2", subTitle: "P0_G1_SubTitle2", url: "https://www.youtube.com/" }
            ]
        }, {
            // Group 2
            title: "Group02",
            apps: [
                { title: "P0_G2_Title1", subTitle: "P0_G2_SubTitle1", url: "http://www.ynet.co.il" },
                { title: "P0_G2_Title2", subTitle: "P0_G2_SubTitle2", url: "#Action-todefaultapp" }
            ]
        }],
        aExternalProviderData1 = [{
            // Group 1
            title: "Group11",
            apps: [
                { title: "P1_G1_Title1", subTitle: "P1_G1_SubTitle1", url: "#Action-todefaultapp" },
                { title: "P1_G1_Title2", subTitle: "P1_G1_SubTitle2", url: "https://www.youtube.com/" }
            ]
        }, {
            // Group 2
            title: "Group12",
            apps: [
                { title: "P1_G2_Title1", subTitle: "P1_G2_SubTitle1", url: "http://www.ynet.co.il" },
                { title: "P1_G2_Title2", subTitle: "P1_G2_SubTitle2", url: "#Action-todefaultapp" }
            ]
        }],
        oAllMyAppsGetDataProvidersResponse = {
            ExternalProvider0: {
                getTitle: function () {
                    return "ExternalProvider0";
                },
                getData: function () {
                    var oDeferred = new jQuery.Deferred();
                    oDeferred.resolve(aExternalProviderData0);
                    return oDeferred.promise();
                }
            },
            ExternalProvider1: {
                getTitle: function () {
                    return "ExternalProvider1";
                },
                getData: function () {
                    var oDeferred = new jQuery.Deferred();
                    oDeferred.resolve(aExternalProviderData1);
                    return oDeferred.promise();
                }
            }
        },

        // Only the 2nd tile (Catalog Tile 02) is valid and should be inserted to the model
        oCatalog0 = {
            id: "Catalog_0",
            title: "Catalog 0",
            tiles: [{
                chipId: "catalogTile_01",
                formFactor: "Desktop,Tablet,Phone",
                id: "catalogTile_01_id",
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    subtitle: "",
                    targetURL: "#UI2Fiori2SampleApps-approvepurchaseorders",
                    title: "" // No Title and no SubTitle => this tile should not be filtered out by _addCatalogToModel
                }
            }, {
                chipId: "catalogTile_02",
                formFactor: "Tablet,Phone",
                id: "catalogTile_02_id",
                tileType: "sap.ushell.ui.tile.ImageTile",
                properties: {
                    subtitle: "SubTitle 02",
                    targetURL: "#UI2Fiori2SampleApps-approvepurchaseorders",
                    title: "Catalog Tile 02"
                }
            }]
        },

        // Only the 2nd tile (Catalog Tile 12) is valid and should be inserted to the model
        oCatalog1 = {
            id: "Catalog_1",
            title: "Catalog 1",
            tiles: [{
                chipId: "catalogTile_11",
                formFactor: "Desktop,Tablet,Phone",
                id: "catalogTile_11_id",
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    subtitle: "",
                    targetURL: "",
                    title: "Catalog Tile 11"
                }
            }, {
                chipId: "catalogTile_12",
                formFactor: "Tablet,Phone",
                id: "catalogTile_12_id",
                tileType: "sap.ushell.ui.tile.ImageTile",
                properties: {
                    subtitle: "SubTitle 12",
                    targetURL: "#UI2Fiori2SampleApps-approvepurchaseorders",
                    title: "Catalog Tile 12"
                }
            }]
        },

        // Only the 1st tile (Catalog Tile 12) is valid and should be inserted to the model
        oCatalog2 = {
            id: "Catalog_2",
            title: "Catalog 1", // Same title as the previous catalog => the two catalogs should be merged
            tiles: [{
                chipId: "catalogTile_21",
                formFactor: "Desktop,Tablet,Phone",
                id: "catalogTile_1_id",
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    subtitle: "SubTitle 21",
                    targetURL: "#UI2Fiori2SampleApps-approvepurchaseorders",
                    title: "Catalog Tile 21"
                }
            }, {
                chipId: "catalogTile_22",
                formFactor: "Tablet,Phone",
                tileType: "sap.ushell.ui.tile.ImageTile",
                properties: {
                    subtitle: "",
                    targetURL: "", // No TargetUrl => this tile should not be filtered out by _addCatalogToModel
                    title: "Catalog Tile 22" // Title taken from here
                }
            }]
        },

        // Only the 1st tile (Catalog Tile 12) is valid and should be inserted to the model
        oCatalog3 = {
            id: "Catalog_3",
            title: "Catalog 3 Custom", // Same title as the previous catalog => the two catalogs should be merged
            tiles: [{
                chipId: "catalogTile_31",
                formFactor: "Desktop,Tablet,Phone",
                id: "catalogTile_3_id",
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    subtitle: "SubTitle 31",
                    title: "Catalog Tile 31"
                }
            }, {
                chipId: "catalogTile_32",
                formFactor: "Desktop,Tablet,Phone",
                tileType: "sap.ushell.ui.tile.ImageTile",
                properties: {
                    subtitle: "",
                    targetURL: "#UI2Fiori2SampleApps-approvepurchaseorders",
                    title: "Catalog Tile 32" // Title taken from here
                }
            }]
        };

    QUnit.module("sap.ushell.renderer.AllMyApps.AllMyAppsManager", {
        beforeEach: function (assert) {
            var done = assert.async();
            Container.init("local")
                .then(function () {
                    oAllMyAppsManager.oModel = new JSONModel();
                    oAllMyAppsManager.oModel.setProperty("/AppsData", []);
                    oAllMyAppsManager.iNumberOfProviders = 0;
                    oAllMyAppsManager.aPromises = [];

                    this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
                    this.oGetServiceAsyncStub.callThrough();
                    Container.getServiceAsync("AllMyApps").then(function (AllMyApps) {
                        this.AllMyApps = AllMyApps;
                        done();
                    }.bind(this));
                }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    // -------------------------------------------------------------------------------
    // ----------------------------------   TESTS   ----------------------------------
    // -------------------------------------------------------------------------------

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("test _handleGroupsData", function (assert) {
        sandbox.stub(oAllMyAppsManager, "_getGroupsData").returns(new jQuery.Deferred().resolve(oGetGroupsDataResponse));

        return oAllMyAppsManager._handleGroupsData()
            .then(function () {
                assert.ok(oAllMyAppsManager.oModel.getProperty("/AppsData")[0].title === "Home Page Apps", "First element in AppsData (in the model) is Home");
                assert.ok(
                    oAllMyAppsManager.oModel.getProperty("/AppsData")[0].type === AllMyAppsProviderType.HOME,
                    "First element in AppsData (in the model) is of type HOME");
                assert.ok(oAllMyAppsManager.oModel.getProperty("/AppsData")[0].groups.length === 3, "Home entry in AppsData has 3 elements (groups)");
        });
    });

    QUnit.test("test _handleCatalogs first load", function (assert) {
        var oHandleNotFirstCatalogsLoadSpy = sandbox.spy(oAllMyAppsManager, "_handleNotFirstCatalogsLoad");
        this.oGetServiceAsyncStub.withArgs("FlpLaunchPage").resolves({
            getCatalogs: sandbox.stub().returns(new jQuery.Deferred()),
            isHomePageAppsEnabled: sandbox.stub().returns(true)
        });

        return oAllMyAppsManager._handleCatalogs(true)
            .then(function () {
                assert.ok(oHandleNotFirstCatalogsLoadSpy.calledOnce === false, "On first load of all my apps _handleNotFirstCatalogsLoad should not be called");
            });
    });

    QUnit.test("test _handleCatalogs second load", function (assert) {
        var oHandleNotFirstCatalogsLoadSpy = sandbox.stub(oAllMyAppsManager, "_handleNotFirstCatalogsLoad").resolves();
        this.oGetServiceAsyncStub.withArgs("FlpLaunchPage").resolves({
            getCatalogs: sandbox.stub().returns(new jQuery.Deferred())
        });

        return oAllMyAppsManager._handleCatalogs(false)
            .then(function () {
                assert.ok(oHandleNotFirstCatalogsLoadSpy.calledOnce === true, "On first load of all my apps _handleNotFirstCatalogsLoad should be called");
            });
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("test _handleGroupsData - verify Home provider location is first", function (assert) {
        var oTempFirstProviderInModel = {
            title: "TempProvider",
            type: 1,
            groups: []
        };
        sandbox.stub(oAllMyAppsManager, "_getGroupsData").returns(new jQuery.Deferred().resolve(oGetGroupsDataResponse));
        oAllMyAppsManager.oModel.setProperty("/AppsData/0", oTempFirstProviderInModel);

        return oAllMyAppsManager._handleGroupsData()
            .then(function () {
                assert.ok(oAllMyAppsManager.oModel.getProperty("/AppsData")[0].title === "Home Page Apps", "First element in AppsData (in the model) is Home");
                assert.ok(oAllMyAppsManager.oModel.getProperty("/AppsData")[1].title === "TempProvider", "Second element in AppsData (in the model) is TempProvider");
            });
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("test _getGroupsData", function (assert) {
        var fnDone = assert.async();

        this.oGetServiceAsyncStub.withArgs("FlpLaunchPage").resolves({
            getGroups: function () {
                return new jQuery.Deferred().resolve(oLaunchPageGetGroupsResponse);
            },
            getDefaultGroup: function () {
                return new jQuery.Deferred().resolve(oLaunchPageGetGroupsResponse[0]);
            },
            getGroupId: function () {
                return new jQuery.Deferred().resolve(oLaunchPageGetGroupsResponse[0].id);
            },
            getGroupTitle: function (oGroup) {
                return oGroup.title;
            },
            getGroupTiles: function (oGroup) {
                return oGroup.tiles;
            },
            isGroupVisible: function (oGroup) {
                return oGroup.isVisible;
            },
            isTileIntentSupported: function (oTile) {
                return oTile.id !== "Tile_Intent_not_supported";
            },
            getTileTitle: function (oTile) {
                return oTile.title;
            },
            getCatalogTitle: function (oCatalog) {
                return oCatalog.title;
            },
            getCatalogTilePreviewTitle: function (oCatlaogTile) {
                return oCatlaogTile.properties.title;
            },
            getCatalogTilePreviewSubtitle: function (oCatlaogTile) {
                return oCatlaogTile.properties.subtitle;
            },
            getCatalogTileTargetURL: function (oCatlaogTile) {
                return oCatlaogTile.properties.targetURL;
            },
            getTileTarget: function (oTile) {
                var sUrlFromTileProperties;

                if (oTile.properties) {
                    sUrlFromTileProperties = oTile.properties.href || oTile.properties.targetURL;
                }
                return oTile.target_url || sUrlFromTileProperties || "";
            }
        });

        oAllMyAppsManager._getGroupsData()
            .done(function (oGroupsData) {
                assert.strictEqual(oGroupsData.length, 4, "4 groups returned, the 4th group is not included");
                assert.strictEqual(oGroupsData[0].title, "Group 0", "First group is correct");
                assert.strictEqual(oGroupsData[2].title, "Group 2", "Third group is correct");
                assert.strictEqual(oGroupsData[0].apps.length, 2, "First group contains 2 tiles");
                assert.strictEqual(oGroupsData[0].apps[0].title, "WEB GUI", "First group: 1st tile title correct");
                assert.strictEqual(oGroupsData[0].apps[1].title, "Opens WEB GUI", "First group: 2nd tile title correct");
                assert.strictEqual(oGroupsData[0].apps[0].url, "#Action-WEBGUI", "First group's tile utl correct");

                assert.strictEqual(oGroupsData[2].title, "Group 2", "Last group title correct");
            }).always(fnDone);
    });

    QUnit.test("test _handleExternalProvidersData", function (assert) {
        this.oGetServiceAsyncStub.withArgs("AllMyApps").resolves({
            getDataProviders: function () {
                return oAllMyAppsGetDataProvidersResponse;
            }
        });

        return oAllMyAppsManager._handleExternalProvidersData()
            .then(function () {
                assert.ok(oAllMyAppsManager.oModel.getProperty("/AppsData").length === 2, "Two External providers inserted to the model");
                assert.ok(oAllMyAppsManager.oModel.getProperty("/AppsData")[0].title === "ExternalProvider0", "1st provider title is ExternalProvider0");
                assert.ok(oAllMyAppsManager.oModel.getProperty("/AppsData")[0].groups.length === 2, "1st provider has two groups");
                assert.ok(oAllMyAppsManager.oModel.getProperty("/AppsData")[1].title === "ExternalProvider1", "2nd provider title is ExternalProvider1");
                assert.ok(oAllMyAppsManager.oModel.getProperty("/AppsData")[1].groups.length === 2, "2nd provider has two groups");
            });
    });

    QUnit.test("test _addCatalogToModel", function (assert) {
        var oDeferred;

        this.oGetServiceAsyncStub.withArgs("FlpLaunchPage").resolves({
            getCatalogTitle: function (oCatalog) {
                return oCatalog.title;
            },
            getCatalogTiles: function (oCatalog) {
                oDeferred = new jQuery.Deferred();
                oDeferred.resolve(oCatalog.tiles);
                return oDeferred.promise();
            },
            isTileIntentSupported: function (oTile) {
                return oTile.id !== "Tile_Intent_not_supported";
            },
            getCatalogTilePreviewTitle: function (oCatlaogTile) {
                return oCatlaogTile.properties.title;
            },
            getCatalogTilePreviewSubtitle: function (oCatlaogTile) {
                return oCatlaogTile.properties.subtitle;
            },
            getCatalogTileTargetURL: function (oCatlaogTile) {
                return oCatlaogTile.properties.targetURL;
            }
        });

        return Promise.all([
            oAllMyAppsManager._addCatalogToModel(oCatalog0),
            oAllMyAppsManager._addCatalogToModel(oCatalog1),
            oAllMyAppsManager._addCatalogToModel(oCatalog2)
        ])
            .then(function () {
                assert.strictEqual(oAllMyAppsManager.oModel.getProperty("/AppsData").length, 2, "Two catalog providers inserted to the model");

                assert.strictEqual(
                    oAllMyAppsManager.oModel.getProperty("/AppsData/0/type"), AllMyAppsProviderType.CATALOG,
                    "First data_source (catalog) in the model is of type CATALOG");
                assert.strictEqual(oAllMyAppsManager.oModel.getProperty("/AppsData/0/title"), "Catalog 0", "First data_source (catalog) in the model has title: Catalog 0");
                assert.strictEqual(oAllMyAppsManager.oModel.getProperty("/AppsData/0/apps").length, 1, "First data_source (catalog) in the model has one app");
                assert.strictEqual(oAllMyAppsManager.oModel.getProperty("/AppsData/0/apps/0").title, "Catalog Tile 02", "data_source/catalog tile/app in the model is correct");

                assert.strictEqual(
                    oAllMyAppsManager.oModel.getProperty("/AppsData/1/type"), AllMyAppsProviderType.CATALOG,
                    "Second data_source (catalog) in the model is of type CATALOG");
                assert.strictEqual(oAllMyAppsManager.oModel.getProperty("/AppsData/1/title"), "Catalog 1", "Second data_source (catalog) in the model has title: Catalog 1");
                assert.strictEqual(oAllMyAppsManager.oModel.getProperty("/AppsData/1/apps").length, 2, "Second data_source (catalog) in the model has two apps");
                assert.strictEqual(oAllMyAppsManager.oModel.getProperty("/AppsData/1/apps/0").title, "Catalog Tile 12", "First data_source/catalog tile/app in the model is correct");
                assert.strictEqual(oAllMyAppsManager.oModel.getProperty("/AppsData/1/apps/1").title, "Catalog Tile 21", "Second data_source/catalog tile/app in the model is correct");
            });
    });

    QUnit.test("test _CustomTileToModel", function (assert) {
        var oDeferred;

        this.oGetServiceAsyncStub.withArgs("FlpLaunchPage").resolves({
            getCatalogTitle: function (oCatalog) {
                return oCatalog.title;
            },
            getCatalogTiles: function (oCatalog) {
                oDeferred = new jQuery.Deferred();
                oDeferred.resolve(oCatalog.tiles);
                return oDeferred.promise();
            },
            getCatalogTilePreviewTitle: function (oCatlaogTile) {
                return oCatlaogTile.properties.title;
            },
            getCatalogTilePreviewSubtitle: function (oCatlaogTile) {
                return oCatlaogTile.properties.subtitle;
            },
            isTileIntentSupported: function (oTile) {
                return oTile.id !== "Tile_Intent_not_supported";
            },
            getCatalogTileTargetURL: function (oCatlaogTile) {
                return oCatlaogTile.properties.targetURL;
            }
        });

        return oAllMyAppsManager._addCatalogToModel(oCatalog3)
            .then(function () {
                assert.ok(oAllMyAppsManager.oModel.getProperty("/AppsData").length === 1, "One catalog providers inserted to the model");

                assert.ok(
                    oAllMyAppsManager.oModel.getProperty("/AppsData/0/type") === AllMyAppsProviderType.CATALOG,
                    "First data_source (catalog) in the model is of type CATALOG");
                assert.ok(oAllMyAppsManager.oModel.getProperty("/AppsData/0/title") === "Catalog 3 Custom", "First data_source (catalog) in the model has title: Catalog 3");
                assert.ok(oAllMyAppsManager.oModel.getProperty("/AppsData/0/apps").length === 1, "First data_source (catalog) in the model has one app");
                assert.ok(oAllMyAppsManager.oModel.getProperty("/AppsData/0/apps/0").title === "Catalog Tile 32", "data_source/catalog tile/app in the model is correct");
                assert.ok(oAllMyAppsManager.oModel.getProperty("/AppsData/0").numberCustomTiles === 1, "We should have One custom tile");
            });
    });
});
