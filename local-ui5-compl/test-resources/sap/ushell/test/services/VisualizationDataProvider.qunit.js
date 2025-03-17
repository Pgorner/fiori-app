// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.VisualizationDataProvider
 */

/* global QUnit, sinon */
sap.ui.define([
    "sap/ushell/services/VisualizationDataProvider",
    "sap/ushell/resources",
    "sap/ushell/library",
    "sap/ushell/utils/chipsUtils",
    "sap/base/Log",
    "sap/ushell/Config",
    "sap/ui/thirdparty/jquery"
], function (VisualizationDataProvider, resources, ushellLibrary, chipsUtils, Log, Config, jQuery) {
    "use strict";

    var DisplayFormat = ushellLibrary.DisplayFormat;

    var sandbox = sinon.createSandbox({});

    QUnit.module("The constructor");

    QUnit.test("Sets the right class properties", function (assert) {
        // Arrange
        var oLaunchPageAdapter = {
            getCatalogTileId: function () {
            }
        };

        // Act
        var oService = new VisualizationDataProvider(oLaunchPageAdapter);

        // Assert
        assert.strictEqual(oService.oLaunchPageAdapter, oLaunchPageAdapter, "The constructor sets the oLaunchPageAdapter property correctly.");
        assert.equal(oService.S_COMPONENT_NAME, "sap.ushell.services.VisualizationDataProvider", "The component name is set correctly.");
    });

    QUnit.module("The function getVisualizationData", {
        beforeEach: function () {
            this.aCatalogs = [{
                data: {},
                id: "X-SAP-UI2-CATALOGPAGE:/UI2/CONFIG_NAVIGATION_MODE",
                title: "Configuration for in-place navigation of classic UIs",
                tiles: []
            }, {
                data: {},
                id: "X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_CLIENT_TRESOLUTION",
                title: "/UI2/FLP_DEMO_CLIENT_TRESOLUTION",
                tiles: [{
                    id: 1,
                    idStable: "stable-1",
                    title: "Tile 1",
                    subtitle: "Subtitle tile 1",
                    icon: "sap-icon://add",
                    info: "",
                    numberUnit: "EUR",
                    keywords: ["someKeyword"],
                    size: "1x1",
                    indicatorDataSource: {
                        path: "url/to/odata/service1/$count",
                        refresh: 200
                    },
                    isCustomTile: false,
                    getChip: sinon.stub().returns({
                        getBaseChipId: sinon.stub().returns("/UI2/BASE_CHIP1")
                    }),
                    getContract: sinon.stub().withArgs("types").returns({
                        getAvailableTypes: sinon.stub().returns(["standard", "standardWide", "compact"]),
                        getDefaultType: sinon.stub().returns("standard")
                    })
                }, {
                    id: 2,
                    idStable: "stable-2",
                    title: "Tile 2",
                    subtitle: "Subtitle tile 2",
                    icon: "sap-icon://mail",
                    numberUnit: "EUR",
                    info: "info 2",
                    keywords: [],
                    size: "1x1",
                    indicatorDataSource: {
                        path: "url/to/odata/service2/$count",
                        refresh: 800
                    },
                    isCustomTile: false,
                    getChip: sinon.stub().returns({
                        getBaseChipId: sinon.stub().returns("/UI2/BASE_CHIP2")
                    }),
                    getContract: sinon.stub().withArgs("types").returns(undefined)
                }, {
                    id: 3,
                    idStable: "stable-3",
                    title: "Tile 3",
                    subtitle: "Subtitle tile 3",
                    icon: "sap-icon://documents",
                    numberUnit: "EUR",
                    info: "info 3",
                    keywords: [],
                    size: "1x1",
                    indicatorDataSource: {
                        path: "url/to/odata/service3/$count"
                    },
                    isCustomTile: true,
                    getChip: sinon.stub().returns({
                        getBaseChipId: sinon.stub().returns("/UI2/BASE_CHIP3")
                    }),
                    getContract: sinon.stub().withArgs("types").returns(undefined)
                }, {
                    id: 5,
                    idStable: "stable-5",
                    title: "Tile 5",
                    subtitle: "Subtitle tile 5",
                    icon: "sap-icon://workflow",
                    numberUnit: "EUR",
                    info: "",
                    keywords: [],
                    size: "1x1",
                    indicatorDataSource: undefined,
                    isCustomTile: false,
                    url: "www.sap.url.com",
                    getChip: sinon.stub().returns({
                        getBaseChipId: sinon.stub().returns("/UI2/BASE_CHIP5")
                    }),
                    getContract: sinon.stub().withArgs("types").returns({
                        getAvailableTypes: sinon.stub().returns(["tile", "link"]),
                        getDefaultType: sinon.stub().returns("tile")
                    })
                }]
            }, {
                data: {},
                id: "X-SAP-UI2-CATALOGPAGE:SAP_PRC_BC_PURCHASER_PIR",
                title: "Purchasing - Source Assignment",
                tiles: [{
                    id: 4,
                    idStable: "stable-4",
                    title: "Tile 4",
                    subtitle: "Subtitle tile 4",
                    icon: "sap-icon://workflow",
                    numberUnit: "EUR",
                    info: "",
                    keywords: [],
                    size: "1x2",
                    indicatorDataSource: undefined,
                    isCustomTile: true,
                    getChip: sinon.stub().returns({
                        getBaseChipId: sinon.stub().returns("/UI2/BASE_CHIP4")
                    }),
                    getContract: sinon.stub().withArgs("types").returns({
                        getAvailableTypes: sinon.stub().returns(["tile", "link"]),
                        getDefaultType: sinon.stub().returns("tile")
                    })
                }]
            }];

            var oCatalogTileIndex = {
                "stable-1": { CHIP: "data1" },
                "stable-2": { CHIP: "data2" },
                "stable-3": { CHIP: "data3" }
            };

            this.oLaunchPageGetCatalogsStub = sinon.stub().returns(
                new jQuery.Deferred().resolve(this.aCatalogs).promise()
            );

            this.oIsTileIntentSupportedAsyncStub = sandbox.stub().resolves(true);
            this.oGetCatalogTileViewControlStub = sandbox.stub().returns(new jQuery.Deferred().resolve().promise());

            this.oLaunchPageAdapter = {
                getCatalogs: this.oLaunchPageGetCatalogsStub,
                getCatalogTiles: function (catalog) {
                    return new jQuery.Deferred().resolve(catalog.tiles).promise();
                },
                getCatalogTileId: function (tile) {
                    return tile.id;
                },
                getStableCatalogTileId: function (tile) {
                    return tile.idStable;
                },
                getCatalogTilePreviewTitle: function (tile) {
                    return tile.title;
                },
                getCatalogTilePreviewSubtitle: function (tile) {
                    return tile.subtitle;
                },
                getCatalogTileKeywords: function (tile) {
                    return tile.keywords || [];
                },
                getCatalogTilePreviewIcon: function (tile) {
                    return tile.icon;
                },
                getCatalogTilePreviewInfo: function (tile) {
                    return tile.info;
                },
                getCatalogTileNumberUnit: function (tile) {
                    return tile.numberUnit;
                },
                getCatalogTileSize: function (tile) {
                    return tile.size;
                },
                getCatalogTilePreviewIndicatorDataSource: function (tile) {
                    return tile.indicatorDataSource;
                },
                getCatalogTileTargetURL: function (tile) {
                    return tile.url || undefined;
                },
                setTileVisible: sandbox.stub(),
                isCustomTile: function (tile) {
                    return tile.isCustomTile;
                },
                isTileIntentSupportedAsync: this.oIsTileIntentSupportedAsyncStub,
                getCatalogTileViewControl: this.oGetCatalogTileViewControlStub
            };

            this.oService = new VisualizationDataProvider(this.oLaunchPageAdapter);
            sandbox.stub(this.oService, "_getCatalogTileIndex").returns(oCatalogTileIndex);
            this.oResourceI18nGetTextStub = sandbox.stub(resources.i18n, "getText").returns("This is the translated error message.");
            this.oGetDisplayFormatsStub = sandbox.stub(this.oService, "_getDisplayFormats");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns a promise containing an object of formatted catalog tiles & vizTypes for every custom tile", function (assert) {
        // Arrange
        // tile id=2
        this.oGetDisplayFormatsStub
            .withArgs(this.aCatalogs[1].tiles[2], "1x1")
            .returns({
                supported: [DisplayFormat.Standard, DisplayFormat.Compact, DisplayFormat.Flat],
                default: DisplayFormat.Standard
            });

        // tile id=4
        this.oGetDisplayFormatsStub
            .withArgs(this.aCatalogs[2].tiles[0], "1x2")
            .returns({
                supported: [DisplayFormat.StandardWide, DisplayFormat.FlatWide],
                default: DisplayFormat.StandardWide
            });

        var oExpectedData = {
            visualizations: {
                "stable-1": {
                    vizType: "/UI2/BASE_CHIP1",
                    icon: "sap-icon://add",
                    numberUnit: "EUR",
                    info: "",
                    size: "1x1",
                    subTitle: "Subtitle tile 1",
                    title: "Tile 1",
                    keywords: ["someKeyword"],
                    isCustomTile: false,
                    indicatorDataSource: {
                        path: "url/to/odata/service1/$count",
                        refresh: 200
                    },
                    url: undefined,
                    _instantiationData: {
                        chip: { CHIP: "data1" },
                        platform: "ABAP",
                        simplifiedChipFormat: false
                    }
                },
                "stable-2": {
                    vizType: "/UI2/BASE_CHIP2",
                    icon: "sap-icon://mail",
                    numberUnit: "EUR",
                    info: "info 2",
                    size: "1x1",
                    subTitle: "Subtitle tile 2",
                    title: "Tile 2",
                    keywords: [],
                    isCustomTile: false,
                    indicatorDataSource: {
                        path: "url/to/odata/service2/$count",
                        refresh: 800
                    },
                    url: undefined,
                    _instantiationData: {
                        platform: "ABAP",
                        simplifiedChipFormat: false,
                        chip: { CHIP: "data2" }
                    }
                },
                "stable-3": {
                    vizType: "/UI2/BASE_CHIP3",
                    icon: "sap-icon://documents",
                    numberUnit: "EUR",
                    info: "info 3",
                    size: "1x1",
                    subTitle: "Subtitle tile 3",
                    title: "Tile 3",
                    keywords: [],
                    isCustomTile: true,
                    indicatorDataSource: {
                        path: "url/to/odata/service3/$count"
                    },
                    url: undefined,
                    _instantiationData: {
                        platform: "ABAP",
                        simplifiedChipFormat: false,
                        chip: { CHIP: "data3" }
                    }
                },
                "stable-4": {
                    vizType: "/UI2/BASE_CHIP4",
                    icon: "sap-icon://workflow",
                    numberUnit: "EUR",
                    info: "",
                    size: "1x2",
                    subTitle: "Subtitle tile 4",
                    title: "Tile 4",
                    keywords: [],
                    isCustomTile: true,
                    indicatorDataSource: undefined,
                    url: undefined
                },
                "stable-5": {
                    vizType: "/UI2/BASE_CHIP5",
                    title: "Tile 5",
                    subTitle: "Subtitle tile 5",
                    icon: "sap-icon://workflow",
                    numberUnit: "EUR",
                    info: "",
                    keywords: [],
                    size: "1x1",
                    indicatorDataSource: undefined,
                    isCustomTile: false,
                    url: "www.sap.url.com"
                }
            },
            vizTypes: {
                "/UI2/BASE_CHIP3": {
                    id: "/UI2/BASE_CHIP3",
                    url: undefined,
                    vizOptions: {
                        displayFormats: {
                            supported: [DisplayFormat.Standard, DisplayFormat.Compact, DisplayFormat.Flat],
                            default: DisplayFormat.Standard
                        }
                    },
                    tileSize: "1x1"
                },
                "/UI2/BASE_CHIP4": {
                    id: "/UI2/BASE_CHIP4",
                    url: undefined,
                    vizOptions: {
                        displayFormats: {
                            supported: [DisplayFormat.StandardWide, DisplayFormat.FlatWide],
                            default: DisplayFormat.StandardWide
                        }
                    },
                    tileSize: "1x2"
                }
            },
            page: {}
        };

        // Act
        return this.oService.getVisualizationData().then(function (oData) {
            // Assert
            assert.deepEqual(oData, oExpectedData, "The function returns the correct data.");
            assert.strictEqual(this.oLaunchPageAdapter.setTileVisible.withArgs(sinon.match.any /* chipInstance */, false).callCount, 5, "All chips were set to invisible");
        }.bind(this));
    });

    QUnit.test("Filters out a tile without supported target mapping.", function (assert) {
        // Arrange
        this.oIsTileIntentSupportedAsyncStub
            .withArgs(this.aCatalogs[1].tiles[0])
            .resolves(false);

        // tile id=2
        this.oGetDisplayFormatsStub
            .withArgs(this.aCatalogs[1].tiles[2], "1x1")
            .returns({
                supported: [DisplayFormat.Standard, DisplayFormat.Compact, DisplayFormat.Flat],
                default: DisplayFormat.Standard
            });

        // tile id=4
        this.oGetDisplayFormatsStub
            .withArgs(this.aCatalogs[2].tiles[0], "1x2")
            .returns({
                supported: [DisplayFormat.StandardWide, DisplayFormat.FlatWide],
                default: DisplayFormat.StandardWide
            });

        var oExpectedData = {
            visualizations: {
                "stable-2": {
                    vizType: "/UI2/BASE_CHIP2",
                    icon: "sap-icon://mail",
                    numberUnit: "EUR",
                    info: "info 2",
                    size: "1x1",
                    subTitle: "Subtitle tile 2",
                    title: "Tile 2",
                    keywords: [],
                    isCustomTile: false,
                    indicatorDataSource: {
                        path: "url/to/odata/service2/$count",
                        refresh: 800
                    },
                    url: undefined,
                    _instantiationData: {
                        platform: "ABAP",
                        simplifiedChipFormat: false,
                        chip: { CHIP: "data2" }
                    }
                },
                "stable-3": {
                    vizType: "/UI2/BASE_CHIP3",
                    icon: "sap-icon://documents",
                    numberUnit: "EUR",
                    info: "info 3",
                    size: "1x1",
                    subTitle: "Subtitle tile 3",
                    title: "Tile 3",
                    keywords: [],
                    isCustomTile: true,
                    indicatorDataSource: {
                        path: "url/to/odata/service3/$count"
                    },
                    url: undefined,
                    _instantiationData: {
                        platform: "ABAP",
                        simplifiedChipFormat: false,
                        chip: { CHIP: "data3" }
                    }
                },
                "stable-4": {
                    vizType: "/UI2/BASE_CHIP4",
                    icon: "sap-icon://workflow",
                    numberUnit: "EUR",
                    info: "",
                    size: "1x2",
                    subTitle: "Subtitle tile 4",
                    title: "Tile 4",
                    keywords: [],
                    isCustomTile: true,
                    indicatorDataSource: undefined,
                    url: undefined
                },
                "stable-5": {
                    vizType: "/UI2/BASE_CHIP5",
                    title: "Tile 5",
                    subTitle: "Subtitle tile 5",
                    icon: "sap-icon://workflow",
                    numberUnit: "EUR",
                    info: "",
                    keywords: [],
                    size: "1x1",
                    indicatorDataSource: undefined,
                    isCustomTile: false,
                    url: "www.sap.url.com"
                }
            },
            vizTypes: {
                "/UI2/BASE_CHIP3": {
                    id: "/UI2/BASE_CHIP3",
                    url: undefined,
                    vizOptions: {
                        displayFormats: {
                            supported: [DisplayFormat.Standard, DisplayFormat.Compact, DisplayFormat.Flat],
                            default: DisplayFormat.Standard
                        }
                    },
                    tileSize: "1x1"
                },
                "/UI2/BASE_CHIP4": {
                    id: "/UI2/BASE_CHIP4",
                    url: undefined,
                    vizOptions: {
                        displayFormats: {
                            supported: [DisplayFormat.StandardWide, DisplayFormat.FlatWide],
                            default: DisplayFormat.StandardWide
                        }
                    },
                    tileSize: "1x2"
                }
            },
            page: {}
        };

        // Act
        return this.oService.getVisualizationData().then(function (oData) {
            // Assert
            assert.deepEqual(oData, oExpectedData, "The function returns the correct data.");
        });
    });

    QUnit.test("Filters out a tile for which the data retrieval fails.", function (assert) {
        // Arrange
        var oLogErrorStub = sandbox.stub(Log, "error");

        var oGetCatalogTilePreviewIconStub = sandbox.stub(this.oLaunchPageAdapter, "getCatalogTilePreviewIcon");
        oGetCatalogTilePreviewIconStub
            .withArgs(this.aCatalogs[1].tiles[0])
            .throws("Error");
        oGetCatalogTilePreviewIconStub.callThrough();

        // tile id=2
        this.oGetDisplayFormatsStub
            .withArgs(this.aCatalogs[1].tiles[2], "1x1")
            .returns({
                supported: [DisplayFormat.Standard, DisplayFormat.Compact, DisplayFormat.Flat],
                default: DisplayFormat.Standard
            });

        // tile id=4
        this.oGetDisplayFormatsStub
            .withArgs(this.aCatalogs[2].tiles[0], "1x2")
            .returns({
                supported: [DisplayFormat.StandardWide, DisplayFormat.FlatWide],
                default: DisplayFormat.StandardWide
            });

        var oExpectedData = {
            visualizations: {
                "stable-2": {
                    vizType: "/UI2/BASE_CHIP2",
                    icon: "sap-icon://mail",
                    numberUnit: "EUR",
                    info: "info 2",
                    size: "1x1",
                    subTitle: "Subtitle tile 2",
                    title: "Tile 2",
                    keywords: [],
                    isCustomTile: false,
                    indicatorDataSource: {
                        path: "url/to/odata/service2/$count",
                        refresh: 800
                    },
                    url: undefined,
                    _instantiationData: {
                        platform: "ABAP",
                        simplifiedChipFormat: false,
                        chip: { CHIP: "data2" }
                    }
                },
                "stable-3": {
                    vizType: "/UI2/BASE_CHIP3",
                    icon: "sap-icon://documents",
                    numberUnit: "EUR",
                    info: "info 3",
                    size: "1x1",
                    subTitle: "Subtitle tile 3",
                    title: "Tile 3",
                    keywords: [],
                    isCustomTile: true,
                    indicatorDataSource: {
                        path: "url/to/odata/service3/$count"
                    },
                    url: undefined,
                    _instantiationData: {
                        platform: "ABAP",
                        simplifiedChipFormat: false,
                        chip: { CHIP: "data3" }
                    }
                },
                "stable-4": {
                    vizType: "/UI2/BASE_CHIP4",
                    icon: "sap-icon://workflow",
                    numberUnit: "EUR",
                    info: "",
                    size: "1x2",
                    subTitle: "Subtitle tile 4",
                    title: "Tile 4",
                    keywords: [],
                    isCustomTile: true,
                    indicatorDataSource: undefined,
                    url: undefined
                },
                "stable-5": {
                    vizType: "/UI2/BASE_CHIP5",
                    title: "Tile 5",
                    subTitle: "Subtitle tile 5",
                    icon: "sap-icon://workflow",
                    numberUnit: "EUR",
                    info: "",
                    keywords: [],
                    size: "1x1",
                    indicatorDataSource: undefined,
                    isCustomTile: false,
                    url: "www.sap.url.com"
                }
            },
            vizTypes: {
                "/UI2/BASE_CHIP3": {
                    id: "/UI2/BASE_CHIP3",
                    url: undefined,
                    vizOptions: {
                        displayFormats: {
                            supported: [DisplayFormat.Standard, DisplayFormat.Compact, DisplayFormat.Flat],
                            default: DisplayFormat.Standard
                        }
                    },
                    tileSize: "1x1"
                },
                "/UI2/BASE_CHIP4": {
                    id: "/UI2/BASE_CHIP4",
                    url: undefined,
                    vizOptions: {
                        displayFormats: {
                            supported: [DisplayFormat.StandardWide, DisplayFormat.FlatWide],
                            default: DisplayFormat.StandardWide
                        }
                    },
                    tileSize: "1x2"
                }
            },
            page: {}
        };

        // Act
        return this.oService.getVisualizationData().then(function (oData) {
            // Assert
            assert.deepEqual(oData, oExpectedData, "The function returns the correct data.");
            assert.ok(oLogErrorStub.firstCall.args[0].includes("stable-1"), "The function logs an error message.");
        });
    });

    QUnit.test("Creates and destroys the tile view if needed", function (assert) {
        //Arrange
        this.aCatalogs[1].tiles[0].title = undefined;
        var oCatalogTileView = {
            destroy: sandbox.stub()
        };
        this.oGetCatalogTileViewControlStub.returns(new jQuery.Deferred().resolve(oCatalogTileView).promise());

        // Act
        return this.oService.getVisualizationData().then(function (oData) {
            // Assert
            assert.deepEqual(this.oGetCatalogTileViewControlStub.callCount, 1, "The tile view was created.");
            assert.strictEqual(oCatalogTileView.destroy.callCount, 1, "The tile view was destroyed.");
        }.bind(this));
    });

    QUnit.test("Destroys the tile view for faulty tiles", function (assert) {
        //Arrange
        this.aCatalogs[1].tiles[0].title = undefined;
        var oCatalogTileView = {
            destroy: sandbox.stub()
        };
        this.oGetCatalogTileViewControlStub.returns(new jQuery.Deferred().resolve(oCatalogTileView).promise());

        var oGetCatalogTilePreviewIconStub = sandbox.stub(this.oLaunchPageAdapter, "getCatalogTilePreviewIcon");
        oGetCatalogTilePreviewIconStub
            .withArgs(this.aCatalogs[1].tiles[0])
            .throws("Error");
        oGetCatalogTilePreviewIconStub.callThrough();

        // Act
        return this.oService.getVisualizationData().then(function (oData) {
            // Assert
            assert.deepEqual(this.oGetCatalogTileViewControlStub.callCount, 1, "The tile view was created.");
            assert.ok(!oData.visualizations["stable-1"], "The faulty tile was filtered out.");
            assert.strictEqual(oCatalogTileView.destroy.callCount, 1, "The tile view was destroyed.");
        }.bind(this));
    });

    QUnit.test("Returns the stored Promise if the data has been requested before", function (assert) {
        //Arrange

        // Act
        var oPromise1 = this.oService.getVisualizationData();
        var oPromise2 = this.oService.getVisualizationData();

        // Assert
        assert.strictEqual(oPromise1, oPromise2, "Returns the same Promise.");
    });

    QUnit.test("Rejects the promise when the LaunchPageAdapter throws an error when getting the catalogs.", function (assert) {
        // Arrange
        this.oLaunchPageGetCatalogsStub.returns(new jQuery.Deferred().reject("LaunchPageAdapter error").promise());
        var oExpectedError = {
            component: "sap.ushell.services.VisualizationDataProvider",
            description: "This is the translated error message.",
            detail: "LaunchPageAdapter error"
        };

        // Act
        return this.oService.getVisualizationData().catch(function (error) {
            assert.ok(this.oResourceI18nGetTextStub.calledOnce, "The getText of resource.i18n is called once");
            assert.deepEqual(this.oResourceI18nGetTextStub.getCall(0).args, ["VisualizationDataProvider.CannotLoadData"], "The getText of resource.i18n is called with correct parameters");
            assert.deepEqual(error, oExpectedError, "The function returns a rejected promise containing an error message.");
        }.bind(this));
    });

    QUnit.module("The function _getCatalogTileIndex", {
        beforeEach: function () {
            this.oService = new VisualizationDataProvider();

            this.oCatalogTileIndexMock = { id: "SomeResult" };
            this.oGetCatalogTileIndexStub = sandbox.stub().resolves(this.oCatalogTileIndex);
            this.oService.oLaunchPageAdapter = {
                _getCatalogTileIndex: this.oGetCatalogTileIndexStub
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the result of LPA._getCatalogTileIndex()", function (assert) {
        //Arrange

        //Act
        var oCatalogTileIndexPromise = this.oService._getCatalogTileIndex();

        //Assert
        return oCatalogTileIndexPromise.then(function (oCatalogTileIndex) {
            assert.strictEqual(this.oCatalogTileIndex, oCatalogTileIndex, "The right result was returned");
            assert.strictEqual(this.oGetCatalogTileIndexStub.callCount, 1, "'getCatalogTileIndex was called exactly once'");
        }.bind(this));
    });

    QUnit.test("Returns the cached promise if the request has already been triggered", function (assert) {
        //Arrange
        var oCachedCatalogTileIndexPromise = Promise.resolve();
        this.oService._oCatalogTileIndexPromise = oCachedCatalogTileIndexPromise;

        //Act
        var oCatalogTileIndexPromise = this.oService._getCatalogTileIndex();

        //Assert
        return oCatalogTileIndexPromise.then(function () {
            assert.deepEqual(oCatalogTileIndexPromise, oCachedCatalogTileIndexPromise, "The cached promise was returned");
        });
    });

    QUnit.module("The function _getDisplayFormats", {
        beforeEach: function () {
            this.oService = new VisualizationDataProvider();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the right display formats if types contract is not available", function (assert) {
        // Arrange
        var oCatalogTile = {
            getContract: sandbox.stub().withArgs("types").returns(undefined)
        };

        // Act
        var oDisplayFormats = this.oService._getDisplayFormats(oCatalogTile, "1x1");

        // Assert
        var oExpectedDisplayFormats = {
            supported: [DisplayFormat.Standard],
            default: DisplayFormat.Standard
        };
        assert.deepEqual(oDisplayFormats, oExpectedDisplayFormats, "The function returns the correct display formats.");
    });

    QUnit.test("Returns the right display formats if types contract is not available when tileSize='1x2'", function (assert) {
        // Arrange
        var oCatalogTile = {
            getContract: sandbox.stub().withArgs("types").returns(undefined)
        };

        // Act
        var oDisplayFormats = this.oService._getDisplayFormats(oCatalogTile, "1x2");

        // Assert
        var oExpectedDisplayFormats = {
            supported: [DisplayFormat.StandardWide],
            default: DisplayFormat.StandardWide
        };
        assert.deepEqual(oDisplayFormats, oExpectedDisplayFormats, "The function returns the correct display formats.");
    });

    QUnit.test("Returns the right display formats if chip implements the types contract", function (assert) {
        // Arrange
        var oCatalogTile = {
            getContract: sandbox.stub().withArgs("types").returns({
                getAvailableTypes: sandbox.stub().returns(["tile", "link"]),
                getDefaultType: sandbox.stub().returns("link")
            })
        };

        // Act
        var oDisplayFormats = this.oService._getDisplayFormats(oCatalogTile, "1x1");

        // Assert
        var oExpectedDisplayFormats = {
            supported: [DisplayFormat.Standard, DisplayFormat.Compact],
            default: DisplayFormat.Compact
        };
        assert.deepEqual(oDisplayFormats, oExpectedDisplayFormats, "The function returns the correct display formats.");
    });

    QUnit.test("Maps tile types to display formats", function (assert) {
        // Arrange
        var oCatalogTile = {
            getContract: sandbox.stub().withArgs("types").returns({
                getAvailableTypes: sandbox.stub().returns(["flatwide"]),
                getDefaultType: sandbox.stub().returns("flatwide")
            })
        };

        // Act
        var oDisplayFormats = this.oService._getDisplayFormats(oCatalogTile, "1x1");

        // Assert
        var oExpectedDisplayFormats = {
            supported: [DisplayFormat.FlatWide],
            default: DisplayFormat.FlatWide
        };
        assert.deepEqual(oDisplayFormats, oExpectedDisplayFormats, "The function returns the correct display formats.");
    });

    QUnit.module("The function _mapDisplayFormats", {
        beforeEach: function () {
            this.oService = new VisualizationDataProvider();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Maps Chip formats to displayFormat when tileSize='1x1'", function (assert) {
        // Arrange
        var aChipFormats = ["tile", "tilewide", "link", "flat", "flatwide"];
        var aExpectedFormats = [
            DisplayFormat.Standard,
            DisplayFormat.StandardWide,
            DisplayFormat.Compact,
            DisplayFormat.Flat,
            DisplayFormat.FlatWide
        ];
        // Act
        var aResult = this.oService._mapDisplayFormats(aChipFormats, "1x1");
        // Assert
        assert.deepEqual(aResult, aExpectedFormats, "Returned the correct formats");
    });

    QUnit.test("Maps Chip formats to displayFormat when tileSize='1x2'", function (assert) {
        // Arrange
        var aChipFormats = ["tile", "link", "flat", "flatwide"];
        var aExpectedFormats = [DisplayFormat.StandardWide, DisplayFormat.Compact, DisplayFormat.Flat, DisplayFormat.FlatWide];
        // Act
        var aResult = this.oService._mapDisplayFormats(aChipFormats, "1x2");
        // Assert
        assert.deepEqual(aResult, aExpectedFormats, "Returned the correct formats");
    });

    QUnit.module("The function loadVizType ", {
        beforeEach: function () {
            this.oService = new VisualizationDataProvider();

            this.oChipInstanceMock = {
                id: "X-SAP-UI2-CHIP:/UI2/CUSTOM_TILE"
            };
            var sTileSize = "1x2";
            var oDisplayFormatsMock = {
                supported: ["standard", "flat"],
                default: "standard"
            };

            this.oLoadChipInstanceFromSimplifiedChipStub = sandbox.stub(chipsUtils, "loadChipInstanceFromSimplifiedChip");
            this.oLoadChipInstanceFromSimplifiedChipStub.resolves(this.oChipInstanceMock);

            this.oGetDisplayFormatsStub = sandbox.stub(this.oService, "_getDisplayFormats").withArgs(this.oChipInstanceMock, sTileSize).returns(oDisplayFormatsMock);
            this.oGetTileSizeStub = sandbox.stub(chipsUtils, "getTileSize").withArgs(this.oChipInstanceMock).returns(sTileSize);
            this.oLogErrorStub = sandbox.stub(Log, "error");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Loads the chip as vizType data", function (assert) {
        // Arrange
        var sChipId = "X-SAP-UI2-CHIP:/UI2/CUSTOM_TILE";
        var oExpectedSimplifiedChip = {
            chipId: sChipId
        };
        var oExpectedVizTypeData = {
            id: sChipId,
            url: undefined,
            vizOptions: {
                displayFormats: {
                    supported: ["standard", "flat"],
                    default: "standard"
                }
            },
            tileSize: "1x2"
        };
        // Act
        return this.oService.loadVizType(sChipId)
            .then(function (oVizType) {
                // Assert
                assert.deepEqual(oVizType, oExpectedVizTypeData, "Resolved the correct vizType data");
                assert.deepEqual(this.oLoadChipInstanceFromSimplifiedChipStub.getCall(0).args, [oExpectedSimplifiedChip], "built correct simplified chip");
                assert.strictEqual(this.oGetTileSizeStub.callCount, 1, "getTileSize was called once");
                assert.strictEqual(this.oGetDisplayFormatsStub.callCount, 1, "_getDisplayFormats was called once");
            }.bind(this));
    });

    QUnit.test("Resolves and logs an error when chip could not be loaded", function (assert) {
        // Arrange
        var sErrorMessage = "Some Error occurred";
        this.oLoadChipInstanceFromSimplifiedChipStub.rejects(sErrorMessage);
        var sExpectedErrorMessage = "The chipInstance 'X-SAP-UI2-CHIP:/UI2/FAILING_CUSTOM_TILE' could not be loaded: ";

        // Act
        return this.oService.loadVizType("X-SAP-UI2-CHIP:/UI2/FAILING_CUSTOM_TILE")
            .then(function (oVizType) {
                // Assert
                assert.deepEqual(oVizType, undefined, "Resolved undefined");
                assert.strictEqual(this.oLogErrorStub.getCall(0).args[0], sExpectedErrorMessage, "Logged the correct error message");
                assert.strictEqual(this.oLogErrorStub.getCall(0).args[1].toString(), sErrorMessage, "Logged the correct error");
            }.bind(this));
    });

    QUnit.module("_getCatalogTiles", {
        beforeEach: function () {
            this.aCatalogs = [{
                data: {},
                id: "X-SAP-UI2-CATALOGPAGE:/UI2/CONFIG_NAVIGATION_MODE",
                title: "Configuration for in-place navigation of classic UIs",
                tiles: [{
                    id: "someId",
                    idStable: "someStableId"
                }]
            }];

            this.oLaunchPageGetCatalogsStub = sinon.stub().returns(
                new jQuery.Deferred().resolve(this.aCatalogs).promise()
            );

            var oAdapterStub = {
                getCatalogs: this.oLaunchPageGetCatalogsStub,
                getCatalogTiles: function (catalog) {
                    return new jQuery.Deferred().resolve(catalog.tiles).promise();
                },
                getCatalogTileId: function (tile) {
                    return tile.id;
                },
                getStableCatalogTileId: function (tile) {
                    return tile.idStable;
                }
            };

            this.oService = new VisualizationDataProvider(oAdapterStub);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Uses stable IDs", function (assert) {
        // Arrange
        var oExpectedResult = {
            someStableId: {
                id: "someId",
                idStable: "someStableId"
            }
        };
        // Act
        return this.oService._getCatalogTiles()
            .then(function (oResult) {
                assert.deepEqual(oResult, oExpectedResult, "The stable ID was used");
            });
    });
});
