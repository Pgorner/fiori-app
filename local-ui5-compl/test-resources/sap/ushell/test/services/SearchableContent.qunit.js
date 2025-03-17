// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.SearchableContent
 */
sap.ui.define([
    "sap/base/Log",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readApplications",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readPages",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readUtils",
    "sap/ushell/Config",
    "sap/ushell/Container",
    "sap/ushell/library",
    "sap/ushell/services/SearchableContent",
    "sap/ushell/utils/UrlParsing"
], function (
    Log,
    jQuery,
    readApplications,
    readPages,
    readUtils,
    Config,
    Container,
    ushellLibrary,
    SearchableContent,
    urlParsing
) {
    "use strict";

    var DisplayFormat = ushellLibrary.DisplayFormat;

    /* global QUnit, sinon*/

    var sandbox = sinon.createSandbox({});

    QUnit.module("Constructor");

    QUnit.test("Initial Properties are set correctly", function (assert) {
        // Act
        var oSearchableContentService = new SearchableContent();

        // Assert
        assert.deepEqual(Object.keys(oSearchableContentService), [], "SearchableContent has no properties");
        assert.strictEqual(SearchableContent.COMPONENT_NAME, "sap/ushell/services/SearchableContent", "initial value was successfully set");
    });

    QUnit.module("The getApps function", {
        beforeEach: function () {
            this.oOptions = {
                default: {
                    includeAppsWithoutVisualizations: false,
                    enableVisualizationPreview: true
                },
                includeAppsWithoutVisualizations: {
                    includeAppsWithoutVisualizations: true,
                    enableVisualizationPreview: true
                }
            };

            this.aAppDataMock = [
                { id: "firstApp" },
                { id: "secondApp" }
            ];
            this.aReducedAppDataMock = [
                { id: "firstApp" }
            ];
            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(true);

            this.oSearchableContentService = new SearchableContent();

            this.oGetPagesAppDataStub = sandbox.stub(this.oSearchableContentService, "_getPagesAppData");
            this.oGetPagesAppDataStub.resolves(this.aAppDataMock);
            this.oGetLaunchPageAppDataStub = sandbox.stub(this.oSearchableContentService, "_getLaunchPageAppData");
            this.oGetLaunchPageAppDataStub.resolves(this.aAppDataMock);
            this.oFilterGetAppsStub = sandbox.stub(this.oSearchableContentService, "_filterGetApps");
            this.oFilterGetAppsStub.withArgs(this.aAppDataMock).resolves(this.aReducedAppDataMock);
            this.oFilterGetAppsStub.withArgs(this.aAppDataMock, this.oOptions.default).resolves(this.aReducedAppDataMock);
            this.oFilterGetAppsStub.withArgs(this.aAppDataMock, this.oOptions.includeAppsWithoutVisualizations).resolves(this.aAppDataMock);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the correct values if spaces is enabled", function (assert) {
        // Arrange
        const oExpectedOptions = this.oOptions.default;
        // Act
        return this.oSearchableContentService.getApps().then(function (aResult) {
            // Assert
            assert.deepEqual(aResult, this.aReducedAppDataMock, "The correct result was returned");
            assert.strictEqual(this.oGetPagesAppDataStub.callCount, 1, "_getPagesAppData was called once");
            assert.deepEqual(this.oGetPagesAppDataStub.getCall(0).args, [oExpectedOptions], "_getPagesAppData was called with correct arguments");
            assert.strictEqual(this.oGetLaunchPageAppDataStub.callCount, 0, "_getLaunchPageAppData was not called");
            assert.strictEqual(this.oFilterGetAppsStub.callCount, 1, "_filterGetApps was called once");
            assert.deepEqual(this.oFilterGetAppsStub.getCall(0).args, [this.aAppDataMock, oExpectedOptions], "_filterGetApps was called with correct arguments");
        }.bind(this));
    });

    QUnit.test("Returns the correct values if spaces is enabled and includeAppsWithoutVisualizations is true", function (assert) {
        // Arrange
        const oExpectedOptions = this.oOptions.includeAppsWithoutVisualizations;
        // Act
        return this.oSearchableContentService.getApps({
            includeAppsWithoutVisualizations: true
        }).then(function (aResult) {
            // Assert
            assert.deepEqual(aResult, this.aAppDataMock, "The correct result was returned");
            assert.strictEqual(this.oGetPagesAppDataStub.callCount, 1, "_getPagesAppData was called once");
            assert.deepEqual(this.oGetPagesAppDataStub.getCall(0).args, [oExpectedOptions], "_getPagesAppData was called with correct arguments");
            assert.strictEqual(this.oGetLaunchPageAppDataStub.callCount, 0, "_getLaunchPageAppData was not called");
            assert.strictEqual(this.oFilterGetAppsStub.callCount, 1, "_filterGetApps was called once");
            assert.deepEqual(this.oFilterGetAppsStub.getCall(0).args, [this.aAppDataMock, oExpectedOptions], "_filterGetApps was called with correct arguments");
        }.bind(this));
    });

    /**
     * @deprecated since 1.120
     */
    QUnit.test("Returns the correct values if spaces is disabled", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(false);

        // Act
        return this.oSearchableContentService.getApps().then(function (aResult) {
            // Assert
            assert.deepEqual(aResult, this.aReducedAppDataMock, "The correct result was returned");
            assert.strictEqual(this.oGetPagesAppDataStub.callCount, 0, "_getPagesAppData was not called");
            assert.strictEqual(this.oGetLaunchPageAppDataStub.callCount, 1, "_getLaunchPageAppData was called once");
            assert.strictEqual(this.oFilterGetAppsStub.callCount, 1, "_filterGetApps was called once");
        }.bind(this));
    });

    QUnit.module("The _filterGetApps function", {
        beforeEach: function () {
            this.oOptions = {
                default: {
                    includeAppsWithoutVisualizations: false,
                    enableVisualizationPreview: true
                },
                includeAppsWithoutVisualizations: {
                    includeAppsWithoutVisualizations: true,
                    enableVisualizationPreview: true
                }
            };

            this.aAppDataMock = [{
                id: "appId1Mock",
                title: "appTitleMock",
                subtitle: "appSubtitleMock",
                icon: "appIconMock",
                info: "appInfoMock",
                keywords: ["appKeywordMock"],
                target: { id: "targetMock" },
                visualizations: [{
                    id: "vizDataId1Mock",
                    vizId: "vizDataVizIdMock",
                    vizType: "vizDataVizTypeMock",
                    title: "vizDataTitleMock",
                    subtitle: "vizDataSubtitleMock",
                    icon: "vizDataIconMock",
                    info: "vizDataInfoMock",
                    keywords: ["vizDataKeywordMock"],
                    target: { id: "targetMock" }
                }, {
                    id: "vizDataId2Mock",
                    vizId: "vizDataVizIdMock",
                    vizType: "vizDataVizTypeMock",
                    title: "vizDataTitleMock",
                    subtitle: "vizDataSubtitleMock",
                    icon: "vizDataIconMock",
                    info: "vizDataInfoMock",
                    keywords: ["vizDataKeywordMock"],
                    target: { id: "targetMock" }
                }, {
                    id: "vizDataId3Mock",
                    vizId: "vizDataVizIdMock",
                    vizType: "vizDataVizTypeMock",
                    title: "ImSpecial",
                    subtitle: "vizDataSubtitleMock",
                    icon: "vizDataIconMock",
                    info: "vizDataInfoMock",
                    keywords: ["vizDataKeywordMock"],
                    target: { id: "targetMock" }
                }]
            }, {
                id: "appId2Mock",
                title: "ImEmpty",
                subtitle: "appSubtitleMock",
                icon: "appIconMock",
                info: "appInfoMock",
                keywords: ["appKeywordMock"],
                target: { id: "targetMock" },
                visualizations: []
            }];
            this.aFilteredAppData = [{
                id: "appId1Mock",
                title: "appTitleMock",
                subtitle: "appSubtitleMock",
                icon: "appIconMock",
                info: "appInfoMock",
                keywords: ["appKeywordMock"],
                target: { id: "targetMock" },
                visualizations: [{
                    id: "vizDataId1Mock",
                    vizId: "vizDataVizIdMock",
                    vizType: "vizDataVizTypeMock",
                    title: "vizDataTitleMock",
                    subtitle: "vizDataSubtitleMock",
                    icon: "vizDataIconMock",
                    info: "vizDataInfoMock",
                    keywords: ["vizDataKeywordMock"],
                    target: { id: "targetMock" }
                }, {
                    id: "vizDataId3Mock",
                    vizId: "vizDataVizIdMock",
                    vizType: "vizDataVizTypeMock",
                    title: "ImSpecial",
                    subtitle: "vizDataSubtitleMock",
                    icon: "vizDataIconMock",
                    info: "vizDataInfoMock",
                    keywords: ["vizDataKeywordMock"],
                    target: { id: "targetMock" }
                }]
            }];
            this.oSearchableContentService = new SearchableContent();
        }
    });

    QUnit.test("Filters duplicates and apps without visualizations if includeAppsWithoutVisualizations is not set", function (assert) {
        // Arrange
        // Act
        var aResult = this.oSearchableContentService._filterGetApps(this.aAppDataMock, this.oOptions.default);

        // Assert
        assert.deepEqual(aResult, this.aFilteredAppData, "returned the correct result");
    });

    QUnit.test("Filters duplicates but includes apps without visualizations if includeAppsWithoutVisualizations is true", function (assert) {
        // Arrange
        // Act
        var aResult = this.oSearchableContentService._filterGetApps(this.aAppDataMock, this.oOptions.includeAppsWithoutVisualizations);

        // Assert
        var aExpectedResult = [].concat(this.aFilteredAppData, this.aAppDataMock[1]);
        assert.deepEqual(aResult, aExpectedResult, "returned the correct result");
    });

    /**
     * @deprecated since 1.120
     */
    QUnit.module("The _getLaunchPageAppData function", {
        beforeEach: function () {
            this.oDestroyStub = sandbox.stub();
            var oViewMock = {
                destroy: this.oDestroyStub
            };
            this.oGetCatalogTilePreviewTitleStub = sandbox.stub().returns("someTitle");
            this.iViewCount = 0;
            function getViewMock (bSupportsCatalogTiles, oTile) {
                if (bSupportsCatalogTiles === oTile.isCatalogTile) {
                    this.iViewCount += 1;
                    return new jQuery.Deferred().resolve(oViewMock).promise();
                }
                return new jQuery.Deferred().reject(new Error("Unsupported Tile type")).promise();
            }
            this.oLaunchPageServiceMock = {
                getCatalogTilePreviewTitle: this.oGetCatalogTilePreviewTitleStub,
                getCatalogTileViewControl: sandbox.stub().callsFake(getViewMock.bind(this, true)),
                getTileView: sandbox.stub().callsFake(getViewMock.bind(this, false)),
                getCatalogTileId: sandbox.stub().callsFake(function (oTile) {
                    return oTile.catalogTileId;
                }),
                getTileId: sandbox.stub().callsFake(function (oTile) {
                    return oTile.id;
                })
            };

            this.aCollectLaunchPageTilesMock = [
                [{
                    catalogTileId: "CatalogTile1",
                    isCatalogTile: true,
                    vizData: { id: "vizData1", targetURL: "#Action-toSample1" }
                }, {
                    catalogTileId: "CatalogTile2",
                    isCatalogTile: true,
                    vizData: { id: "vizData2", targetURL: "#Action-toSample2" }
                }], [{
                    id: "GroupTile1",
                    isCatalogTile: false,
                    vizData: undefined
                }, {
                    id: "GroupTile2",
                    isCatalogTile: false,
                    vizData: { id: "vizData3", targetURL: "#Action-toSample1" }
                }]
            ];

            this.oErrorStub = sandbox.stub(Log, "error");

            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oGetServiceAsyncStub.withArgs("FlpLaunchPage").resolves(this.oLaunchPageServiceMock);

            this.oSearchableContentService = new SearchableContent();

            this.oCollectLaunchPageTilesStub = sandbox.stub(this.oSearchableContentService, "_collectLaunchPageTiles");
            this.oCollectLaunchPageTilesStub.resolves(this.aCollectLaunchPageTilesMock);
            this.oBuildVizDataFromLaunchPageTileStub = sandbox.stub(this.oSearchableContentService, "_buildVizDataFromLaunchPageTile");
            this.oBuildVizDataFromLaunchPageTileStub.callsFake(function (oTile) {
                return oTile.vizData;
            });
            this.oBuildAppDataFromVizStub = sandbox.stub(this.oSearchableContentService, "_buildAppDataFromViz");
            this.oBuildAppDataFromVizStub.callsFake(function (oVizData) {
                return {
                    id: oVizData.targetURL,
                    visualizations: [oVizData]
                };
            });
        },
        afterEach: function () {
            sandbox.restore();
            Container.reset();
        }
    });

    QUnit.test("Returns the correct value", function (assert) {
        // Arrange
        var aExpectedResult = [{
            id: "#Action-toSample1",
            visualizations: [
                { id: "vizData1", targetURL: "#Action-toSample1" },
                { id: "vizData3", targetURL: "#Action-toSample1" }
            ]
        }, {
            id: "#Action-toSample2",
            visualizations: [
                { id: "vizData2", targetURL: "#Action-toSample2" }
            ]
        }];

        // Act
        return this.oSearchableContentService._getLaunchPageAppData().then(function (aResult) {
            // Assert
            assert.deepEqual(aResult, aExpectedResult, "Returned the correct result");
            assert.strictEqual(this.oSearchableContentService._oLaunchPageService, this.oLaunchPageServiceMock, "LaunchPageService was set");

            assert.strictEqual(this.oCollectLaunchPageTilesStub.callCount, 1, "_collectLaunchPageTiles was called once");
            assert.strictEqual(this.oBuildVizDataFromLaunchPageTileStub.callCount, 4, "_buildVizDataFromLaunchPageTile was called four times");
            assert.strictEqual(this.oBuildAppDataFromVizStub.callCount, 2, "_buildAppDataFromViz was called twice");
        }.bind(this));
    });

    QUnit.test("Still returns a result if the data collection for some tiles fail", function (assert) {
        // Arrange
        this.oGetCatalogTilePreviewTitleStub.withArgs(this.aCollectLaunchPageTilesMock[1][1]).throws(); // GroupTile2
        this.oBuildVizDataFromLaunchPageTileStub.withArgs(this.aCollectLaunchPageTilesMock[0][0]).throws(); // CatalogTile1
        var aExpectedResult = [{
            id: "#Action-toSample2",
            visualizations: [
                { id: "vizData2", targetURL: "#Action-toSample2" }
            ]
        }, {
            id: "#Action-toSample1",
            visualizations: [
                { id: "vizData3", targetURL: "#Action-toSample1" }
            ]
        }];

        // Act
        return this.oSearchableContentService._getLaunchPageAppData().then(function (aResult) {
            // Assert
            assert.deepEqual(aResult, aExpectedResult, "Returned the correct result");
            assert.ok(this.oErrorStub.getCall(0).args[0].includes("GroupTile2"), "An error message with the tile id was logged");
            assert.ok(this.oErrorStub.getCall(1).args[0].includes("CatalogTile1"), "An error message with the tile id was logged");
        }.bind(this));
    });

    QUnit.test("Creates and destroy all the views when the preview title is missing", function (assert) {
        // Arrange
        this.oGetCatalogTilePreviewTitleStub.returns("");

        // Act
        return this.oSearchableContentService._getLaunchPageAppData().then(function () {
            assert.strictEqual(this.iViewCount, 4, "4 views were created");
            assert.strictEqual(this.oDestroyStub.callCount, 4, "destroy was called 4 times");
        }.bind(this));
    });

    QUnit.test("Still returns a result if the creation of single views fails", function (assert) {
        // Arrange
        this.oGetCatalogTilePreviewTitleStub.returns("");
        this.oLaunchPageServiceMock.getCatalogTileViewControl.onFirstCall().returns(new jQuery.Deferred().reject().promise());

        // Act
        return this.oSearchableContentService._getLaunchPageAppData().then(function (aResult) {
            assert.strictEqual(aResult.length, 2, "returned a result");
            assert.strictEqual(this.iViewCount, 3, "views were created");
            assert.strictEqual(this.oDestroyStub.callCount, 3, "the views that could be created were destroyed");
        }.bind(this));
    });

    QUnit.test("Logs an error when tileViews cannot be destroyed", function (assert) {
        // Arrange
        this.oGetCatalogTilePreviewTitleStub.returns("");
        this.oLaunchPageServiceMock.getCatalogTileViewControl.returns(new jQuery.Deferred().resolve({}).promise());

        // Act
        return this.oSearchableContentService._getLaunchPageAppData().then(function () {
            assert.strictEqual(this.oErrorStub.callCount, 2, "Log.error was called 4 times");
            assert.deepEqual(this.oErrorStub.getCall(0).args, ["The tile with id 'CatalogTile1' does not implement mandatory function destroy"]);
            assert.deepEqual(this.oErrorStub.getCall(1).args, ["The tile with id 'CatalogTile2' does not implement mandatory function destroy"]);
        }.bind(this));
    });

    /**
     * @deprecated since 1.120
     */
    QUnit.module("The _collectLaunchPageTiles function", {
        beforeEach: function () {
            this.aCatalogsMock = [
                { id: "Catalog1" },
                { id: "Catalog2" }
            ];
            this.aCatalogTilesMock = [[
                { id: "CatalogTile1" },
                { id: "CatalogTile2" }
            ], [
                { id: "CatalogTile3" }
            ]];
            this.aGroupsMock = [
                { id: "Group1" },
                { id: "Group2" }
            ];
            this.aGroupTilesMock = [[
                { id: "GroupTile1" },
                { id: "GroupTile2" }
            ], [
                { id: "GroupTile3" }
            ]];

            this.oSearchableContentService = new SearchableContent();

            this.oGetCatalogsStub = sandbox.stub();
            this.oGetCatalogsStub.returns(new jQuery.Deferred().resolve(this.aCatalogsMock));
            this.oGetCatalogTilesStub = sandbox.stub();
            this.oGetCatalogTilesStub.callsFake(function (oCatalog) {
                var iIndex = this.aCatalogsMock.indexOf(oCatalog);
                return new jQuery.Deferred().resolve(this.aCatalogTilesMock[iIndex]);
            }.bind(this));
            this.oGetGroupsStub = sandbox.stub();
            this.oGetGroupsStub.returns(new jQuery.Deferred().resolve(this.aGroupsMock));
            this.oGetGroupTilesForSearchStub = sandbox.stub();
            this.oGetGroupTilesForSearchStub.callsFake(function (oGroup) {
                var iIndex = this.aGroupsMock.indexOf(oGroup);
                return Promise.resolve(this.aGroupTilesMock[iIndex]);
            }.bind(this));

            this.oSearchableContentService._oLaunchPageService = {
                getCatalogs: this.oGetCatalogsStub,
                getCatalogTiles: this.oGetCatalogTilesStub,
                getGroups: this.oGetGroupsStub,
                getGroupTilesForSearch: this.oGetGroupTilesForSearchStub
            };
        },
        afterEach: function () {
            sandbox.restore();
            Container.reset();
        }
    });

    QUnit.test("Returns the correct result", function (assert) {
        // Arrange
        var aExpectedResult = [[
            { id: "CatalogTile1" },
            { id: "CatalogTile2" },
            { id: "CatalogTile3" }
        ], [
            { id: "GroupTile1" },
            { id: "GroupTile2" },
            { id: "GroupTile3" }
        ]];

        // Act
        return this.oSearchableContentService._collectLaunchPageTiles().then(function (aResult) {
            // Assert
            assert.deepEqual(aResult, aExpectedResult, "Returned the correct result");

            assert.strictEqual(this.oGetCatalogsStub.callCount, 1, "getCatalogs was called once");
            assert.strictEqual(this.oGetCatalogTilesStub.callCount, 2, "getCatalogTiles was called twice");
            assert.strictEqual(this.oGetGroupsStub.callCount, 1, "getGroups was called once");
            assert.strictEqual(this.oGetGroupTilesForSearchStub.callCount, 2, "getGroupTilesForSearch was called twice");
        }.bind(this));
    });

    QUnit.module("The _getPagesAppData function", {
        beforeEach: function () {
            this.oOptions = {
                default: {
                    includeAppsWithoutVisualizations: false,
                    enableVisualizationPreview: true
                },
                includeAppsWithoutVisualizations: {
                    includeAppsWithoutVisualizations: true,
                    enableVisualizationPreview: true
                }
            };

            this.aPagesMock = [
                { id: "page1" }
            ];
            this.oSiteMock = {
                visualizations: {
                    id: "visualizations"
                },
                applications: {
                    app1: { id: "app1" }
                },
                vizTypes: { id: "vizTypes" }
            };
            this.oCSTRMock = { id: "ClientSideTargetResolution" };

            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oGetAllPagesStub = sandbox.stub();
            this.oGetAllPagesStub.withArgs({ personalizedPages: true }).resolves(this.aPagesMock);
            this.oGetApplicationsStub = sandbox.stub();
            this.oGetApplicationsStub.resolves(this.oSiteMock.applications);
            this.oGetVisualizationsStub = sandbox.stub();
            this.oGetVisualizationsStub.resolves(this.oSiteMock.visualizations);
            this.oGetVizTypesStub = sandbox.stub();
            this.oGetVizTypesStub.resolves(this.oSiteMock.vizTypes);
            this.oGetServiceAsyncStub.withArgs("CommonDataModel").resolves({
                getAllPages: this.oGetAllPagesStub,
                getApplications: this.oGetApplicationsStub,
                getVisualizations: this.oGetVisualizationsStub,
                getVizTypes: this.oGetVizTypesStub
            });

            this.oGetServiceAsyncStub.withArgs("ClientSideTargetResolution").resolves(this.oCSTRMock);

            this.oSearchableContentService = new SearchableContent();

            this.oApplyCdmVisualizationsStub = sandbox.stub(this.oSearchableContentService, "_applyCdmVisualizations");
            this.oApplyCdmVisualizationsStub.withArgs(this.oSiteMock, sinon.match.any).callsFake(function (oSite, oAppData) {
                oAppData._applyCdmVisualizations = {
                    id: "_applyCdmVisualizations was here"
                };
            });

            this.oApplyCdmPagesStub = sandbox.stub(this.oSearchableContentService, "_applyCdmPages");
            this.oApplyCdmPagesStub.withArgs(this.oSiteMock, this.aPagesMock, sinon.match.any).callsFake(function (oSite, aPages, oAppData) {
                oAppData._applyCdmPages = {
                    id: "_applyCdmPages was here"
                };
            });

            this.oFilterAppDataByIntentStub = sandbox.stub(this.oSearchableContentService, "_filterAppDataByIntent");
            this.oFilterAppDataByIntentStub.withArgs(sinon.match.any, this.oCSTRMock).callsFake(function (oAppData, oCSTR) {
                oAppData._filterAppDataByIntent = {
                    id: "_filterAppDataByIntent was here"
                };
            });

            this.oApplyCdmApplicationsStub = sandbox.stub(this.oSearchableContentService, "_applyCdmApplications");
            this.oApplyCdmApplicationsStub.withArgs(this.oSiteMock).callsFake(
                function (oSite, oAppData, oGetAppsOptions) {
                    if (oGetAppsOptions.includeAppsWithoutVisualizations) {
                        oAppData._applyCdmApplications = {
                            id: "_applyCdmApplications(includeAppsWithoutVisualizations=true) was here"
                        };
                    } else {
                        oAppData._applyCdmApplications = {
                            id: "_applyCdmApplications was here"
                        };
                    }
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the correct Result when called with includeAppsWithoutVisualizations=false", function (assert) {
        // Arrange
        var aExpectedResult = [
            { id: "_applyCdmVisualizations was here" },
            { id: "_applyCdmPages was here" },
            { id: "_filterAppDataByIntent was here" },
            { id: "_applyCdmApplications was here" }
        ];

        // Act
        return this.oSearchableContentService._getPagesAppData(this.oOptions.default).then(function (aResult) {
            // Assert
            assert.deepEqual(aResult, aExpectedResult, "returned the correct result");
            assert.strictEqual(this.oApplyCdmApplicationsStub.callCount, 1, "_applyCdmApplications was called once");
            assert.strictEqual(this.oApplyCdmPagesStub.callCount, 1, "_applyCdmPages was called once");
        }.bind(this));
    });

    QUnit.test("Returns the correct Result when called with includeAppsWithoutVisualizations set to true", function (assert) {
        // Arrange
        var aExpectedResult = [
            { id: "_applyCdmVisualizations was here" },
            { id: "_applyCdmPages was here" },
            { id: "_filterAppDataByIntent was here" },
            { id: "_applyCdmApplications(includeAppsWithoutVisualizations=true) was here" }
        ];

        // Act
        return this.oSearchableContentService._getPagesAppData(this.oOptions.includeAppsWithoutVisualizations).then(function (aResult) {
            // Assert
            assert.deepEqual(aResult, aExpectedResult, "returned the correct result");
            assert.strictEqual(this.oApplyCdmApplicationsStub.callCount, 1, "_applyCdmApplications was called once");
            assert.strictEqual(this.oApplyCdmPagesStub.callCount, 1, "_applyCdmPages was called once");
        }.bind(this));
    });

    QUnit.module("The _filterAppDataByIntent, function", {
        beforeEach: function () {
            this.oIsIntentUrlAsyncStub = sandbox.stub(urlParsing, "isIntentUrlAsync");
            this.oIsIntentUrlAsyncStub.resolves(true);

            this.oSupportedMock = {
                "#Action-toSample": {
                    supported: true
                },
                "#Action-toNotSupported": {
                    supported: false
                }
            };

            this.oIsIntentSupportedStub = sandbox.stub().resolves();
            this.oIsIntentSupportedStub.resolves(this.oSupportedMock);
            this.oCSTRMock = {
                isIntentSupported: this.oIsIntentSupportedStub
            };
            this.oSearchableContentService = new SearchableContent();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Filters unsupported intents", function (assert) {
        // Arrange
        var oAppData = {
            "#Action-toSample": { id: "#Action-toSample" },
            "#Action-toNotSupported": { id: "#Action-toNotSupported" }
        };
        var oExpectedAppData = {
            "#Action-toSample": { id: "#Action-toSample" }
        };

        // Act
        return this.oSearchableContentService._filterAppDataByIntent(oAppData, this.oCSTRMock).then(function () {
            // Assert
            assert.deepEqual(oAppData, oExpectedAppData, "applied the correct result");

            assert.strictEqual(this.oIsIntentUrlAsyncStub.callCount, 2, "isIntentUrlAsync was called twice");
            assert.strictEqual(this.oIsIntentSupportedStub.callCount, 1, "isIntentSupported was called once");
        }.bind(this));
    });

    QUnit.test("Keeps url targets", function (assert) {
        // Arrange
        this.oIsIntentUrlAsyncStub.withArgs("www.sap.com").resolves(false);
        var oAppData = {
            "www.sap.com": { id: "www.sap.com" }
        };
        var oExpectedAppData = {
            "www.sap.com": { id: "www.sap.com" }
        };

        // Act
        return this.oSearchableContentService._filterAppDataByIntent(oAppData, this.oCSTRMock).then(function () {
            // Assert
            assert.deepEqual(oAppData, oExpectedAppData, "applied the correct result");

            assert.strictEqual(this.oIsIntentUrlAsyncStub.callCount, 1, "isIntentUrlAsync was called once");
            assert.strictEqual(this.oIsIntentSupportedStub.callCount, 0, "isIntentSupported was not called");
        }.bind(this));
    });

    QUnit.test("Resolves without filtering if isIntentSupported returns an error", function (assert) {
        // Arrange
        var oAppData = {
            "#Action-toSample": { id: "#Action-toSample" },
            "#Action-toNotSupported": { id: "#Action-toNotSupported" }
        };
        var oExpectedAppData = {
            "#Action-toSample": { id: "#Action-toSample" },
            "#Action-toNotSupported": { id: "#Action-toNotSupported" }
        };

        this.oIsIntentSupportedStub.returns(new jQuery.Deferred().reject());

        // Act
        return this.oSearchableContentService._filterAppDataByIntent(oAppData, this.oCSTRMock).then(function () {
            // Assert
            assert.deepEqual(oAppData, oExpectedAppData, "Did not filter anything");
        });
    });

    QUnit.test("Packages the isIntentSupported calls", function (assert) {
        // Arrange
        var oAppData = {};
        var oExpectedAppData = {};
        var aIntentPackages = [];
        var aSupportedMockPackages = {};
        var i;
        var iIsIntentSupportedPackage = -1;

        // create mass data to test the packaging
        for (i = 0; i < 1050; i++) {
            var sIntent = "#Action-toSample" + i;
            oAppData[sIntent] = { id: sIntent };
            oExpectedAppData[sIntent] = { id: sIntent };

            // create data for each package
            if (i % 500 === 0) {
                iIsIntentSupportedPackage++;
                aIntentPackages[iIsIntentSupportedPackage] = [];
                aSupportedMockPackages[iIsIntentSupportedPackage] = {};
            }
            aIntentPackages[iIsIntentSupportedPackage].push(sIntent);
            aSupportedMockPackages[iIsIntentSupportedPackage][sIntent] = { supported: true };
        }

        aSupportedMockPackages[0]["#Action-toSample10"].supported = false;
        delete oExpectedAppData["#Action-toSample10"];
        aSupportedMockPackages[1]["#Action-toSample520"].supported = false;
        delete oExpectedAppData["#Action-toSample520"];
        aSupportedMockPackages[2]["#Action-toSample1030"].supported = false;
        delete oExpectedAppData["#Action-toSample1030"];

        for (i = 0; i < aIntentPackages.length; i++) {
            this.oIsIntentSupportedStub.withArgs(aIntentPackages[i]).returns(new jQuery.Deferred().resolve(aSupportedMockPackages[i]));
        }

        // Act
        return this.oSearchableContentService._filterAppDataByIntent(oAppData, this.oCSTRMock).then(function () {
            // Assert
            assert.deepEqual(oAppData, oExpectedAppData, "applied the correct result");
            assert.strictEqual(this.oIsIntentSupportedStub.callCount, 3, "isIntentSupported was called for each package");
        }.bind(this));
    });

    QUnit.module("The _applyCdmApplications function", {
        beforeEach: function () {
            this.oOptions = {
                default: {
                    includeAppsWithoutVisualizations: false,
                    enableVisualizationPreview: true
                },
                includeAppsWithoutVisualizations: {
                    includeAppsWithoutVisualizations: true,
                    enableVisualizationPreview: true
                }
            };
            this.oSiteMock = {
                visualizations: { id: "visualizations" },
                applications: {
                    someAppId: {
                        "sap.app": {
                            id: "someAppId",
                            title: "Some App",
                            crossNavigation: {
                                inbounds: {
                                    someInboundId: {
                                        semanticObject: "SemanticObject-1",
                                        action: "action-1",
                                        title: "Inbound title"
                                    }
                                }
                            }
                        }
                     },
                    appWithoutVizId: {
                        "sap.app": {
                            id: "appWithoutVizId",
                            title: "App w/o viz",
                            crossNavigation: {
                                inbounds: {
                                    inbound1: {
                                        semanticObject: "SemanticObject1",
                                        action: "action1"
                                    },
                                    inbound2: {
                                        semanticObject: "SemanticObject2",
                                        action: "action2"
                                    }
                                }
                            }
                        }
                    }
                }
            };

            this.oAppDataMock = {
                toAppWithAppId: {
                    visualizations: [{
                        target: { appId: "someAppId", inboundId: "someInboundId" }
                    }]
                },
                toAppWithSemanticObject: {
                    visualizations: [{
                        target: { semanticObject: "someSemanticObject", action: "someAction" }
                    }]
                }
            };

            this.oSearchableContentService = new SearchableContent();

            this.oBuildAppDataFromVizStub = sandbox.stub(this.oSearchableContentService, "_buildAppDataFromViz");
            this.oBuildAppDataFromVizStub.withArgs(this.oAppDataMock.toAppWithSemanticObject.visualizations[0])
                .returns({ id: "builtWithVizData" });
            this.oBuildAppDataFromAppAndInboundStub = sandbox.stub(this.oSearchableContentService, "_buildAppDataFromAppAndInbound");
            this.oBuildAppDataFromAppAndInboundStub.callsFake(function (oSiteApp, oInbound, bAddTargetURL) {
                var oResult = {
                    id: readApplications.getId(oSiteApp),
                    title: (oInbound && oInbound.title) || readApplications.getTitle(oSiteApp)
                };

                if (bAddTargetURL && oInbound) {
                    oResult.targetURL = "#" + oInbound.semanticObject + "-" + oInbound.action;
                }

                return oResult;
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Adds appData based on application", function (assert) {
        // Arrange
        delete this.oAppDataMock.toAppWithSemanticObject;

        var oExpectedAppData = {
            toAppWithAppId: {
                id: "someAppId",
                title: "Inbound title",
                target: { appId: "someAppId", inboundId: "someInboundId" },
                visualizations: [
                    { target: { appId: "someAppId", inboundId: "someInboundId" } }
                ]
            }
        };

        // Act
        this.oSearchableContentService._applyCdmApplications(this.oSiteMock, this.oAppDataMock, this.oOptions.default);

        // Assert
        assert.deepEqual(this.oAppDataMock, oExpectedAppData, "applied the correct result");

        assert.strictEqual(this.oBuildAppDataFromAppAndInboundStub.callCount, 1, "_buildAppDataFromAppAndInbound was called once");
        assert.strictEqual(this.oBuildAppDataFromVizStub.callCount, 0, "_buildAppDataFromViz was not called");
    });

    QUnit.test("Adds appData based on vizData", function (assert) {
        // Arrange
        delete this.oAppDataMock.toAppWithAppId;

        var oExpectedAppData = {
            toAppWithSemanticObject: {
                id: "builtWithVizData",
                target: { semanticObject: "someSemanticObject", action: "someAction" },
                visualizations: [
                    { target: { semanticObject: "someSemanticObject", action: "someAction" } }
                ]
            }
        };

        // Act
        this.oSearchableContentService._applyCdmApplications(this.oSiteMock, this.oAppDataMock, this.oOptions.default);

        // Assert
        assert.deepEqual(this.oAppDataMock, oExpectedAppData, "applied the correct result");

        assert.strictEqual(this.oBuildAppDataFromAppAndInboundStub.callCount, 0, "_buildAppDataFromAppAndInbound was not called");
        assert.strictEqual(this.oBuildAppDataFromVizStub.callCount, 1, "_buildAppDataFromViz was called once");
    });

    QUnit.test("Adds appData even if there is an error for an app", function (assert) {
        // Arrange
        var oLogErrorStub = sandbox.stub(Log, "error");
        this.oBuildAppDataFromAppAndInboundStub.withArgs(this.oSiteMock.applications.someAppId, sinon.match.any).throws();
        var oExpectedAppData = {
            toAppWithAppId: {
                visualizations: [
                    { target: { appId: "someAppId", inboundId: "someInboundId" } }
                ]
            },
            toAppWithSemanticObject: {
                id: "builtWithVizData",
                target: { semanticObject: "someSemanticObject", action: "someAction" },
                visualizations: [
                    { target: { semanticObject: "someSemanticObject", action: "someAction" } }
                ]
            }
        };

        // Act
        this.oSearchableContentService._applyCdmApplications(this.oSiteMock, this.oAppDataMock, this.oOptions.default);

        // Assert
        assert.deepEqual(this.oAppDataMock, oExpectedAppData, "applied the correct result");
        assert.ok(oLogErrorStub.getCall(0).args[0].includes("toAppWithAppId"), "An error with the error application ID was logged");
    });

    QUnit.test("Adds appData for applications without visualization if includeAppsWithoutVisualizations=true", function (assert) {
        // Arrange
        delete this.oAppDataMock.toAppWithSemanticObject;

        var oExpectedAppData = {
            toAppWithAppId: {
                id: "someAppId",
                title: "Inbound title",
                target: { appId: "someAppId", inboundId: "someInboundId" },
                visualizations: [
                    { target: { appId: "someAppId", inboundId: "someInboundId" } }
                ]
            },
            appWithoutVizId: {
                id: "appWithoutVizId",
                title: "App w/o viz",
                targetURL: "#SemanticObject1-action1"
            }
        };

        // Act
        this.oSearchableContentService._applyCdmApplications(this.oSiteMock, this.oAppDataMock, this.oOptions.includeAppsWithoutVisualizations);

        // Assert
        assert.deepEqual(this.oAppDataMock, oExpectedAppData, "applied the correct result");

        assert.strictEqual(this.oBuildAppDataFromAppAndInboundStub.callCount, 2, "_buildAppDataFromAppAndInbound was called twice");
        assert.strictEqual(this.oBuildAppDataFromVizStub.callCount, 0, "_buildAppDataFromViz was not called");
    });

    QUnit.module("The _applyCdmVisualizations function", {
        beforeEach: function () {
            this.oOptions = {
                default: {
                    includeAppsWithoutVisualizations: false,
                    enableVisualizationPreview: true
                },
                previewDisabled: {
                    includeAppsWithoutVisualizations: false,
                    enableVisualizationPreview: false
                }
            };

            this.oSiteMock = {
                visualizations: {
                    viz1: { id: "viz1" },
                    viz2: { id: "viz2" }
                }
            };

            this.oGetVizDataStub = sandbox.stub(readUtils, "getVizData");
            this.oGetVizDataStubThrowsOn = null;
            this.oGetVizDataStub.withArgs(this.oSiteMock, sinon.match.any).callsFake(function (oSite, oVizRef) {
                if (oVizRef.vizId === this.oGetVizDataStubThrowsOn) {
                    throw new Error();
                }
                const oViz = oSite.visualizations[oVizRef.vizId] || {};

                const oVizData = {
                    id: oVizRef.vizId,
                    targetURL: "#Action-toSample",
                    displayFormatHint: oVizRef.displayFormatHint,
                    vizType: oViz.vizType || "some.custom.viz.type"
                };
                if (oViz && oViz._instantiationData) {
                    oVizData._instantiationData = oViz._instantiationData;
                }
                return oVizData;
            }.bind(this));

            this.oSearchableContentService = new SearchableContent();
            this.oChangeVizTypeStub = sandbox.stub(this.oSearchableContentService, "_changeVizType");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the correct result", async function (assert) {
        // Arrange
        var oAppData = {};
        var oExpectedAppData = {
            "#Action-toSample": {
                visualizations: [{
                    id: "viz1",
                    targetURL: "#Action-toSample",
                    displayFormatHint: DisplayFormat.Standard,
                    preview: true,
                    vizType: "some.custom.viz.type"
                }, {
                    id: "viz2",
                    targetURL: "#Action-toSample",
                    displayFormatHint: DisplayFormat.Standard,
                    preview: true,
                    vizType: "some.custom.viz.type"
                }]
            }
        };

        // Act
        await this.oSearchableContentService._applyCdmVisualizations(this.oSiteMock, oAppData, this.oOptions.default);

        // Assert
        assert.deepEqual(oAppData, oExpectedAppData, "Applied the correct result");
    });

    QUnit.test("Transforms custom tiles and keeps standard tiles on the cdm platform", async function (assert) {
        // Arrange
        this.oChangeVizTypeStub.restore();
        // viz1
        this.oSiteMock.visualizations.viz1.vizType = "some.custom.viz.type";
        this.oSiteMock.visualizations.viz1._instantiationData = { platform: "CDM" };
        // viz2
        this.oSiteMock.visualizations.viz2.vizType = "sap.ushell.DynamicAppLauncher";
        this.oSiteMock.visualizations.viz2._instantiationData = { platform: "CDM" };
        // viz3
        this.oSiteMock.visualizations.viz3 = {
            id: "viz3",
            vizType: "sap.ushell.StaticAppLauncher",
            _instantiationData: { platform: "CDM" }
        };
        var oAppData = {};
        var oExpectedResult = {
            "#Action-toSample": {
                visualizations: [{
                    id: "viz1",
                    targetURL: "#Action-toSample",
                    preview: true,
                    vizType: "sap.ushell.StaticAppLauncher",
                    displayFormatHint: DisplayFormat.Standard,
                    _instantiationData: {
                        platform: "CDM",
                        vizType: {
                            "sap.ui5": {
                                componentName: "sap.ushell.components.tiles.cdm.applauncher"
                            }
                        }
                    }
                }, {
                    id: "viz2",
                    targetURL: "#Action-toSample",
                    preview: true,
                    vizType: "sap.ushell.DynamicAppLauncher",
                    displayFormatHint: DisplayFormat.Standard,
                    _instantiationData: {
                        platform: "CDM"
                    }
                }, {
                    id: "viz3",
                    targetURL: "#Action-toSample",
                    preview: true,
                    vizType: "sap.ushell.StaticAppLauncher",
                    displayFormatHint: DisplayFormat.Standard,
                    _instantiationData: {
                        platform: "CDM"
                    }
                }]
            }
        };

        // Act
        await this.oSearchableContentService._applyCdmVisualizations(this.oSiteMock, oAppData, this.oOptions.default);

        // Assert
        assert.deepEqual(oAppData, oExpectedResult, "returned the correct result");
    });

    QUnit.test("Keeps custom tiles on the cdm platform when enableVisualizationPreview=false", async function (assert) {
        // Arrange
        this.oChangeVizTypeStub.restore();
        // viz1
        this.oSiteMock.visualizations.viz1.vizType = "some.custom.viz.type";
        this.oSiteMock.visualizations.viz1._instantiationData = { platform: "CDM" };
        // viz2
        this.oSiteMock.visualizations.viz2.vizType = "sap.ushell.DynamicAppLauncher";
        this.oSiteMock.visualizations.viz2._instantiationData = { platform: "CDM" };
        // viz3
        this.oSiteMock.visualizations.viz3 = {
            id: "viz3",
            vizType: "sap.ushell.StaticAppLauncher",
            _instantiationData: { platform: "CDM" }
        };
        var oAppData = {};
        var oExpectedResult = {
            "#Action-toSample": {
                visualizations: [{
                    id: "viz1",
                    targetURL: "#Action-toSample",
                    vizType: "some.custom.viz.type",
                    displayFormatHint: DisplayFormat.Standard,
                    _instantiationData: {
                        platform: "CDM"
                    }
                }, {
                    id: "viz2",
                    targetURL: "#Action-toSample",
                    vizType: "sap.ushell.DynamicAppLauncher",
                    displayFormatHint: DisplayFormat.Standard,
                    _instantiationData: {
                        platform: "CDM"
                    }
                }, {
                    id: "viz3",
                    targetURL: "#Action-toSample",
                    vizType: "sap.ushell.StaticAppLauncher",
                    displayFormatHint: DisplayFormat.Standard,
                    _instantiationData: {
                        platform: "CDM"
                    }
                }]
            }
        };

        // Act
        await this.oSearchableContentService._applyCdmVisualizations(this.oSiteMock, oAppData, this.oOptions.previewDisabled);

        // Assert
        assert.deepEqual(oAppData, oExpectedResult, "returned the correct result");
    });

    QUnit.test("Runs the vizType check", async function (assert) {
        // Arrange
        var oAppData = {};
        var aVisualizations = [{
            id: "viz1",
            targetURL: "#Action-toSample",
            displayFormatHint: DisplayFormat.Standard,
            preview: true,
            vizType: "some.custom.viz.type"
        }, {
            id: "viz2",
            targetURL: "#Action-toSample",
            displayFormatHint: DisplayFormat.Standard,
            preview: true,
            vizType: "some.custom.viz.type"
        }];

        // Act
        await this.oSearchableContentService._applyCdmVisualizations(this.oSiteMock, oAppData, this.oOptions.default);

        // Assert
        assert.deepEqual(this.oChangeVizTypeStub.getCall(0).args[0], aVisualizations[0], "The first visualization was checked");
        assert.deepEqual(this.oChangeVizTypeStub.getCall(1).args[0], aVisualizations[1], "The second visualization was checked");
    });

    QUnit.test("Returns a result even if there is an error for one of the tiles", async function (assert) {
        // Arrange
        this.oGetVizDataStubThrowsOn = "viz1";
        var oLogErrorStub = sandbox.stub(Log, "error");
        var oAppData = {};
        var oExpectedAppData = {
            "#Action-toSample": {
                visualizations: [{
                    id: "viz2",
                    targetURL: "#Action-toSample",
                    displayFormatHint: DisplayFormat.Standard,
                    preview: true,
                    vizType: "some.custom.viz.type"
                }]
            }
        };

        // Act
        await this.oSearchableContentService._applyCdmVisualizations(this.oSiteMock, oAppData, this.oOptions.default);

        // Assert
        assert.deepEqual(oAppData, oExpectedAppData, "Applied the correct result");
        assert.ok(oLogErrorStub.getCall(0).args[0].includes("viz1"), "An error with the error tile ID was logged");
    });

    QUnit.module("The _applyCdmPages function", {
        beforeEach: function () {
            this.oOptions = {
                default: {
                    includeAppsWithoutVisualizations: false,
                    enableVisualizationPreview: true
                },
                previewDisabled: {
                    includeAppsWithoutVisualizations: false,
                    enableVisualizationPreview: false
                }
            };

            this.aPagesMock = [
                { id: "page1" },
                { id: "page2" }
            ];
            this.aVizRefMock = [[
                { id: "vizRef1", targetURL: "#Action-toSample1" },
                { id: "vizRef2", targetURL: "#Action-toSample2" }
            ], [
                { id: "vizRef3", targetURL: "#Action-toSample1" }
            ]];
            this.oSiteMock = { id: "site" };

            this.oGetVisualizationReferencesStub = sandbox.stub(readPages, "getVisualizationReferences");
            this.oGetVisualizationReferencesStub.withArgs(this.aPagesMock[0]).returns(this.aVizRefMock[0]);
            this.oGetVisualizationReferencesStub.withArgs(this.aPagesMock[1]).returns(this.aVizRefMock[1]);

            this.oGetVizDataStub = sandbox.stub(readUtils, "getVizData");
            this.oGetVizDataStubThrowsOn = null;
            this.oGetVizDataStub.withArgs(this.oSiteMock, sinon.match.any).callsFake(function (oSite, oVizRef) {
                if (oVizRef.id === this.oGetVizDataStubThrowsOn) {
                    throw new Error();
                }
                var oVizData = JSON.parse(JSON.stringify(oVizRef));
                if (!oVizRef.vizType) {
                    oVizData.vizType = "some.custom.viz.type";
                }

                return oVizData;
            }.bind(this));

            this.oSearchableContentService = new SearchableContent();
            this.oChangeVizTypeStub = sandbox.stub(this.oSearchableContentService, "_changeVizType");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Adds vizData to existing appData and creates new appData", async function (assert) {
        // Arrange
        var oAppData = {};
        var oExpectedResult = {
            "#Action-toSample1": {
                visualizations: [{
                    id: "vizRef1",
                    targetURL: "#Action-toSample1",
                    preview: true,
                    vizType: "some.custom.viz.type"
                }, {
                    id: "vizRef3",
                    targetURL: "#Action-toSample1",
                    preview: true,
                    vizType: "some.custom.viz.type"
                }]
            },
            "#Action-toSample2": {
                visualizations: [{
                    id: "vizRef2",
                    targetURL: "#Action-toSample2",
                    preview: true,
                    vizType: "some.custom.viz.type"
                }]
            }
        };

        // Act
        await this.oSearchableContentService._applyCdmPages(this.oSiteMock, this.aPagesMock, oAppData, this.oOptions.default);

        // Assert
        assert.deepEqual(oAppData, oExpectedResult, "returned the correct result");
        assert.strictEqual(this.oGetVisualizationReferencesStub.callCount, 2, "getVisualizationReferences was called twice");
        assert.strictEqual(this.oGetVizDataStub.callCount, 3, "getVizData was called three times");
    });

    QUnit.test("Adds vizData to existing appData even if there is an error for one of the tiles", async function (assert) {
        // Arrange
        this.oGetVizDataStubThrowsOn = "vizRef1";
        var oLogErrorStub = sandbox.stub(Log, "error");
        var oAppData = {};
        var oExpectedResult = {
            "#Action-toSample1": {
                visualizations: [{
                    id: "vizRef3",
                    targetURL: "#Action-toSample1",
                    preview: true,
                    vizType: "some.custom.viz.type"
                }]
            },
            "#Action-toSample2": {
                visualizations: [{
                    id: "vizRef2",
                    targetURL: "#Action-toSample2",
                    preview: true,
                    vizType: "some.custom.viz.type"
                }]
            }
        };

        // Act
        await this.oSearchableContentService._applyCdmPages(this.oSiteMock, this.aPagesMock, oAppData, this.oOptions.default);

        // Assert
        assert.deepEqual(oAppData, oExpectedResult, "returned the correct result");
        assert.ok(oLogErrorStub.getCall(0).args[0].includes("vizRef1"), "An error with the error tile ID was logged");
    });

    QUnit.test("Transforms custom tiles and keeps standard tiles on the cdm platform", async function (assert) {
        // Arrange
        this.oChangeVizTypeStub.restore();
        // vizRef1
        this.aVizRefMock[0][0].vizType = "some.custom.viz.type";
        this.aVizRefMock[0][0]._instantiationData = { platform: "CDM" };
        // vizRef2
        this.aVizRefMock[0][1].vizType = "sap.ushell.DynamicAppLauncher";
        this.aVizRefMock[0][1]._instantiationData = { platform: "CDM" };
        // vizRef3
        this.aVizRefMock[1][0].vizType = "sap.ushell.StaticAppLauncher";
        this.aVizRefMock[1][0]._instantiationData = { platform: "CDM" };
        var oAppData = {};
        var oExpectedResult = {
            "#Action-toSample1": {
                visualizations: [{
                    id: "vizRef1",
                    targetURL: "#Action-toSample1",
                    preview: true,
                    vizType: "sap.ushell.StaticAppLauncher",
                    _instantiationData: {
                        platform: "CDM",
                        vizType: {
                            "sap.ui5": {
                                componentName: "sap.ushell.components.tiles.cdm.applauncher"
                            }
                        }
                    }
                }, {
                    id: "vizRef3",
                    targetURL: "#Action-toSample1",
                    preview: true,
                    vizType: "sap.ushell.StaticAppLauncher",
                    _instantiationData: {
                        platform: "CDM"
                    }
                }]
            },
            "#Action-toSample2": {
                visualizations: [{
                    id: "vizRef2",
                    targetURL: "#Action-toSample2",
                    preview: true,
                    vizType: "sap.ushell.DynamicAppLauncher",
                    _instantiationData: {
                        platform: "CDM"
                    }
                }]
            }
        };

        // Act
        await this.oSearchableContentService._applyCdmPages(this.oSiteMock, this.aPagesMock, oAppData, this.oOptions.default);

        // Assert
        assert.deepEqual(oAppData, oExpectedResult, "returned the correct result");
        assert.strictEqual(this.oGetVisualizationReferencesStub.callCount, 2, "getVisualizationReferences was called twice");
        assert.strictEqual(this.oGetVizDataStub.callCount, 3, "getVizData was called three times");
    });

    QUnit.test("Keeps custom tiles on the cdm platform when enableVisualizationPreview=false", async function (assert) {
        // Arrange
        this.oChangeVizTypeStub.restore();
        // vizRef1
        this.aVizRefMock[0][0].vizType = "some.custom.viz.type";
        this.aVizRefMock[0][0]._instantiationData = { platform: "CDM" };
        // vizRef2
        this.aVizRefMock[0][1].vizType = "sap.ushell.DynamicAppLauncher";
        this.aVizRefMock[0][1]._instantiationData = { platform: "CDM" };
        // vizRef3
        this.aVizRefMock[1][0].vizType = "sap.ushell.StaticAppLauncher";
        this.aVizRefMock[1][0]._instantiationData = { platform: "CDM" };
        var oAppData = {};
        var oExpectedResult = {
            "#Action-toSample1": {
                visualizations: [{
                    id: "vizRef1",
                    targetURL: "#Action-toSample1",
                    vizType: "some.custom.viz.type",
                    _instantiationData: {
                        platform: "CDM"
                    }
                }, {
                    id: "vizRef3",
                    targetURL: "#Action-toSample1",
                    vizType: "sap.ushell.StaticAppLauncher",
                    _instantiationData: {
                        platform: "CDM"
                    }
                }]
            },
            "#Action-toSample2": {
                visualizations: [{
                    id: "vizRef2",
                    targetURL: "#Action-toSample2",
                    vizType: "sap.ushell.DynamicAppLauncher",
                    _instantiationData: {
                        platform: "CDM"
                    }
                }]
            }
        };

        // Act
        await this.oSearchableContentService._applyCdmPages(this.oSiteMock, this.aPagesMock, oAppData, this.oOptions.previewDisabled);

        // Assert
        assert.deepEqual(oAppData, oExpectedResult, "returned the correct result");
        assert.strictEqual(this.oGetVisualizationReferencesStub.callCount, 2, "getVisualizationReferences was called twice");
        assert.strictEqual(this.oGetVizDataStub.callCount, 3, "getVizData was called three times");
    });

    QUnit.test("Changes the displayFormatHint to standard for non-standard display formats", function (assert) {
        // Arrange
        var oAppData = {};
        this.aVizRefMock[0][0].displayFormatHint = DisplayFormat.Compact;

        // Act
        return this.oSearchableContentService._applyCdmPages(this.oSiteMock, this.aPagesMock, oAppData, this.oOptions.default)
            .then(() => {
                // Assert
                assert.deepEqual(oAppData["#Action-toSample1"].visualizations[0].displayFormatHint, DisplayFormat.Standard, "the correct display format was set");
                assert.deepEqual(this.aVizRefMock[0][0].displayFormatHint, DisplayFormat.Compact, "the original vizRef's display format was not changed");
            });
    });

    QUnit.test("Runs the vizType check", async function (assert) {
        // Arrange
        var oAppData = {};
        var aVisualizations = [{
            id: "vizRef1",
            targetURL: "#Action-toSample1",
            preview: true,
            vizType: "some.custom.viz.type"
        }, {
            id: "vizRef2",
            targetURL: "#Action-toSample2",
            preview: true,
            vizType: "some.custom.viz.type"
        }];

        // Act
        await this.oSearchableContentService._applyCdmPages(this.oSiteMock, this.aPagesMock, oAppData, this.oOptions.default);

        // Assert
        assert.deepEqual(this.oChangeVizTypeStub.getCall(0).args[0], aVisualizations[0], "The first visualization was checked");
        assert.deepEqual(this.oChangeVizTypeStub.getCall(1).args[0], aVisualizations[1], "The second visualization was checked");
    });

    QUnit.module("The _changeVizType function", {
        beforeEach: function () {
            this.oSearchableContentService = new SearchableContent();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Changes CDM custom tiles to static tiles", function (assert) {
        // Arrange
        var oVizData = {
            vizType: "custom.tile.vizType",
            _instantiationData: {
                platform: "CDM",
                vizType: {
                    "sap.ui5": {
                        componentName: "custom.tile.component"
                    }
                }
            }
        };

        var oExpectedResult = {
            vizType: "sap.ushell.StaticAppLauncher",
            _instantiationData: {
                platform: "CDM",
                vizType: {
                    "sap.ui5": {
                        componentName: "sap.ushell.components.tiles.cdm.applauncher"
                    }
                }
            }
        };

        // Act
        this.oSearchableContentService._changeVizType(oVizData);

        // Assert
        assert.deepEqual(oVizData, oExpectedResult, "The tile was changed to a static tile");
    });

    QUnit.test("Doesn't change CDM dynamic tiles", function (assert) {
        // Arrange
        var oVizData = {
            vizType: "sap.ushell.DynamicAppLauncher",
            _instantiationData: {
                platform: "CDM",
                vizType: {
                    "sap.ui5": {
                        componentName: "sap.ushell.components.tiles.cdm.applauncherdynamic"
                    }
                }
            }
        };

        var oExpectedResult = {
            vizType: "sap.ushell.DynamicAppLauncher",
            _instantiationData: {
                platform: "CDM",
                vizType: {
                    "sap.ui5": {
                        componentName: "sap.ushell.components.tiles.cdm.applauncherdynamic"
                    }
                }
            }
        };

        // Act
        this.oSearchableContentService._changeVizType(oVizData);

        // Assert
        assert.deepEqual(oVizData, oExpectedResult, "The tile was not changed to a static tile");
    });

    QUnit.test("Doesn't change ABAP custom tiles", function (assert) {
        // Arrange
        var oVizData = {
            vizType: "CHIP_BASED_VIZ_TYPE",
            _instantiationData: {
                platform: "ABAP",
                chip: { some: "data" }
            }
        };

        var oExpectedResult = {
            vizType: "CHIP_BASED_VIZ_TYPE",
            _instantiationData: {
                platform: "ABAP",
                chip: { some: "data" }
            }
        };

        // Act
        this.oSearchableContentService._changeVizType(oVizData);

        // Assert
        assert.deepEqual(oVizData, oExpectedResult, "The tile was not changed to a static tile");
    });

    QUnit.module("The _buildAppDataFromAppAndInbound function", {
        beforeEach: function () {
            this.oApplicationMock = {
                id: "application"
            };
            this.oGetIdStub = sandbox.stub(readApplications, "getId");
            this.oGetIdStub.withArgs(this.oApplicationMock).returns("id");
            this.oGetTitleStub = sandbox.stub(readApplications, "getTitle");
            this.oGetTitleStub.withArgs(this.oApplicationMock).returns("title");
            this.oGetSubTitleStub = sandbox.stub(readApplications, "getSubTitle");
            this.oGetSubTitleStub.withArgs(this.oApplicationMock).returns("subTitle");
            this.oGetIconStub = sandbox.stub(readApplications, "getIcon");
            this.oGetIconStub.withArgs(this.oApplicationMock).returns("icon");
            this.oGetInfoStub = sandbox.stub(readApplications, "getInfo");
            this.oGetInfoStub.withArgs(this.oApplicationMock).returns("info");
            this.oGetKeywordsStub = sandbox.stub(readApplications, "getKeywords");
            this.oGetKeywordsStub.withArgs(this.oApplicationMock).returns(["keywords"]);
            this.oGetTechnicalAttributesStub = sandbox.stub(readApplications, "getTechnicalAttributes");
            this.oGetTechnicalAttributesStub.withArgs(this.oApplicationMock).returns(["attribute-1", "attribute-2"]);

            this.oSearchableContentService = new SearchableContent();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns correct appData when inbound is not provided", function (assert) {
        // Arrange
        var oExpectedResult = {
            id: "id",
            title: "title",
            subtitle: "subTitle",
            icon: "icon",
            info: "info",
            keywords: ["keywords"],
            technicalAttributes: ["attribute-1", "attribute-2"],
            visualizations: []
        };

        // Act
        var oResult = this.oSearchableContentService._buildAppDataFromAppAndInbound(this.oApplicationMock);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "returned the correct Result");

        assert.strictEqual(this.oGetIdStub.callCount, 1, "getId was called once");
        assert.strictEqual(this.oGetTitleStub.callCount, 1, "getTitle was called once");
        assert.strictEqual(this.oGetSubTitleStub.callCount, 1, "getSubTitle was called once");
        assert.strictEqual(this.oGetIconStub.callCount, 1, "getIcon was called once");
        assert.strictEqual(this.oGetInfoStub.callCount, 1, "getInfo was called once");
        assert.strictEqual(this.oGetKeywordsStub.callCount, 1, "getKeywords was called once");
        assert.strictEqual(this.oGetTechnicalAttributesStub.callCount, 1, "getTechnicalAttributes was called once");
    });

    QUnit.test("Returns correct appData with empty inbound", function (assert) {
        // Arrange
        var oInbound = {};
        var oExpectedResult = {
            id: "id",
            title: "title",
            subtitle: "subTitle",
            icon: "icon",
            info: "info",
            keywords: ["keywords"],
            technicalAttributes: ["attribute-1", "attribute-2"],
            visualizations: []
        };

        // Act
        var oResult = this.oSearchableContentService._buildAppDataFromAppAndInbound(this.oApplicationMock, oInbound);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "returned the correct Result");

        assert.strictEqual(this.oGetIdStub.callCount, 1, "getId was called once");
        assert.strictEqual(this.oGetTitleStub.callCount, 1, "getTitle was called once");
        assert.strictEqual(this.oGetSubTitleStub.callCount, 1, "getSubTitle was called once");
        assert.strictEqual(this.oGetIconStub.callCount, 1, "getIcon was called once");
        assert.strictEqual(this.oGetInfoStub.callCount, 1, "getInfo was called once");
        assert.strictEqual(this.oGetKeywordsStub.callCount, 1, "getKeywords was called once");
        assert.strictEqual(this.oGetTechnicalAttributesStub.callCount, 1, "getTechnicalAttributes was called once");
    });

    QUnit.test("Returns correct appData with an inbound", function (assert) {
        // Arrange
        var oInbound = {
            title: "inboundTitle",
            subTitle: "inboundSubTitle",
            icon: "inboundIcon",
            info: "inboundInfo",
            keywords: ["inboundKeywords"]
        };
        var oExpectedResult = {
            id: "id",
            title: "inboundTitle",
            subtitle: "inboundSubTitle",
            icon: "inboundIcon",
            info: "inboundInfo",
            keywords: ["inboundKeywords"],
            technicalAttributes: ["attribute-1", "attribute-2"],
            visualizations: []
        };

        // Act
        var oResult = this.oSearchableContentService._buildAppDataFromAppAndInbound(this.oApplicationMock, oInbound);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "returned the correct Result");

        assert.strictEqual(this.oGetIdStub.callCount, 1, "getId was called once");
        assert.strictEqual(this.oGetTitleStub.callCount, 0, "getTitle was not called");
        assert.strictEqual(this.oGetSubTitleStub.callCount, 0, "getSubTitle was not called");
        assert.strictEqual(this.oGetIconStub.callCount, 0, "getIcon was not called");
        assert.strictEqual(this.oGetInfoStub.callCount, 0, "getInfo was not called");
        assert.strictEqual(this.oGetKeywordsStub.callCount, 0, "getKeywords was not called");
        assert.strictEqual(this.oGetTechnicalAttributesStub.callCount, 1, "getTechnicalAttributes was called once");
    });

    QUnit.test("Returns correct appData with an inbound and bAddTargetURL=true", function (assert) {
        // Arrange
        var oInbound = {
            semanticObject: "SemanticObject",
            action: "action",
            title: "inboundTitle",
            subTitle: "inboundSubTitle",
            icon: "inboundIcon",
            info: "inboundInfo",
            keywords: ["inboundKeywords"]
        };
        var oExpectedResult = {
            id: "id",
            title: "inboundTitle",
            subtitle: "inboundSubTitle",
            icon: "inboundIcon",
            info: "inboundInfo",
            keywords: ["inboundKeywords"],
            technicalAttributes: ["attribute-1", "attribute-2"],
            targetURL: "#SemanticObject-action?sap-ui-app-id-hint=id",
            visualizations: []
        };

        // Act
        var oResult = this.oSearchableContentService._buildAppDataFromAppAndInbound(
            this.oApplicationMock, oInbound, true /* bAddTargetURL */);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "returned the correct Result");

        assert.strictEqual(this.oGetIdStub.callCount, 1, "getId was called once");
        assert.strictEqual(this.oGetTitleStub.callCount, 0, "getTitle was not called");
        assert.strictEqual(this.oGetSubTitleStub.callCount, 0, "getSubTitle was not called");
        assert.strictEqual(this.oGetIconStub.callCount, 0, "getIcon was not called");
        assert.strictEqual(this.oGetInfoStub.callCount, 0, "getInfo was not called");
        assert.strictEqual(this.oGetKeywordsStub.callCount, 0, "getKeywords was not called");
        assert.strictEqual(this.oGetTechnicalAttributesStub.callCount, 1, "getTechnicalAttributes was called once");
    });

    QUnit.module("The _buildAppDataFromViz function", {
        beforeEach: function () {
            this.oSearchableContentService = new SearchableContent();
        }
    });

    QUnit.test("Builds the appData based on vizData", function (assert) {
        // Arrange
        var oVizData = {
            id: "idMock",
            vizId: "vizIdMock",
            title: "titleMock",
            subtitle: "subtitleMock",
            icon: "iconMock",
            info: "infoMock",
            keywords: ["keywordsMock"],
            technicalAttributes: ["technicalAttributesMock"],
            target: { id: "targetMock" }
        };
        var oExpectedResult = {
            id: "vizIdMock",
            title: "titleMock",
            subtitle: "subtitleMock",
            icon: "iconMock",
            info: "infoMock",
            keywords: ["keywordsMock"],
            technicalAttributes: ["technicalAttributesMock"],
            target: { id: "targetMock" },
            visualizations: [{
                id: "idMock",
                vizId: "vizIdMock",
                title: "titleMock",
                subtitle: "subtitleMock",
                icon: "iconMock",
                info: "infoMock",
                keywords: ["keywordsMock"],
                technicalAttributes: ["technicalAttributesMock"],
                target: { id: "targetMock" }
            }]
        };

        // Act
        var oResult = this.oSearchableContentService._buildAppDataFromViz(oVizData);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "returned the correct result");
    });

    /**
     * @deprecated since 1.120
     */
    QUnit.module("The _buildVizDataFromLaunchPageTile function", {
        beforeEach: function () {
            this.oOptions = {
                default: {
                    includeAppsWithoutVisualizations: false,
                    enableVisualizationPreview: true
                },
                previewDisabled: {
                    includeAppsWithoutVisualizations: false,
                    enableVisualizationPreview: false
                }
            };

            this.oFirstOptionTileMock = { id: "FirstOptionTile", getChip: function () { } };
            this.oSecondOptionTileMock = { id: "SecondOptionTile", getChip: function () { } };
            this.oThirdOptionTileMock = { id: "ThirdOptionTile", getChip: function () { } };

            this.oSearchableContentService = new SearchableContent();

            this.oIsTileIntentSupportedStub = sandbox.stub();
            this.oIsTileIntentSupportedStub.withArgs(this.oFirstOptionTileMock).returns(true);
            this.oIsTileIntentSupportedStub.withArgs(this.oSecondOptionTileMock).returns(true);
            this.oIsTileIntentSupportedStub.withArgs(this.oThirdOptionTileMock).returns(true);
            this.oGetCatalogTileTargetURLStub = sandbox.stub();
            this.oGetCatalogTileTargetURLStub.withArgs(this.oFirstOptionTileMock).returns("someUrl");
            this.oGetCatalogTileTargetURLStub.withArgs(this.oSecondOptionTileMock).returns("someUrl");
            this.oGetCatalogTileTargetURLStub.withArgs(this.oThirdOptionTileMock).returns("someUrl");
            this.oGetTileIdStub = sandbox.stub();
            this.oGetTileIdStub.withArgs(this.oFirstOptionTileMock).returns("tileId");
            this.oGetTileIdStub.withArgs(this.oThirdOptionTileMock).returns("tileId");
            this.oGetCatalogTileIdStub = sandbox.stub();
            this.oGetCatalogTileIdStub.withArgs(this.oFirstOptionTileMock).returns("catalogTileId");
            this.oGetCatalogTileIdStub.withArgs(this.oSecondOptionTileMock).returns("catalogTileId");
            this.oGetCatalogTilePreviewTitleStub = sandbox.stub();
            this.oGetCatalogTilePreviewTitleStub.withArgs(this.oFirstOptionTileMock).returns("previewTitle");
            this.oGetCatalogTileTitleStub = sandbox.stub();
            this.oGetCatalogTileTitleStub.withArgs(this.oSecondOptionTileMock).returns("catalogTitle");
            this.oGetTileTitleStub = sandbox.stub();
            this.oGetTileTitleStub.withArgs(this.oThirdOptionTileMock).returns("tileTitle");
            this.oGetCatalogTilePreviewSubtitleStub = sandbox.stub();
            this.oGetCatalogTilePreviewSubtitleStub.withArgs(this.oFirstOptionTileMock).returns("previewSubtitle");
            this.oGetCatalogTilePreviewIconStub = sandbox.stub();
            this.oGetCatalogTilePreviewIconStub.withArgs(this.oFirstOptionTileMock).returns("previewIcon");
            this.oGetCatalogTilePreviewInfoStub = sandbox.stub();
            this.oGetCatalogTilePreviewInfoStub.withArgs(this.oFirstOptionTileMock).returns("previewInfo");
            this.oGetCatalogTileKeywordsStub = sandbox.stub();
            this.oGetCatalogTileKeywordsStub.withArgs(this.oFirstOptionTileMock).returns(["previewKeyword"]);
            this.oGetCatalogTileTechnicalAttributesStub = sandbox.stub();
            this.oGetCatalogTileTechnicalAttributesStub.withArgs(this.oFirstOptionTileMock).returns(["previewTechnicalAttributes"]);

            this.oSearchableContentService._oLaunchPageService = {
                isTileIntentSupported: this.oIsTileIntentSupportedStub,
                getCatalogTileTargetURL: this.oGetCatalogTileTargetURLStub,
                getTileId: this.oGetTileIdStub,
                getCatalogTileId: this.oGetCatalogTileIdStub,
                getCatalogTilePreviewTitle: this.oGetCatalogTilePreviewTitleStub,
                getCatalogTileTitle: this.oGetCatalogTileTitleStub,
                getTileTitle: this.oGetTileTitleStub,
                getCatalogTilePreviewSubtitle: this.oGetCatalogTilePreviewSubtitleStub,
                getCatalogTilePreviewIcon: this.oGetCatalogTilePreviewIconStub,
                getCatalogTilePreviewInfo: this.oGetCatalogTilePreviewInfoStub,
                getCatalogTileKeywords: this.oGetCatalogTileKeywordsStub,
                getCatalogTileTechnicalAttributes: this.oGetCatalogTileTechnicalAttributesStub
            };

            this.oExpectedResult = {
                id: "tileId",
                vizId: "catalogTileId",
                vizType: "",
                target: { type: "URL", url: "someUrl" },
                targetURL: "someUrl"
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the correct result if every property is present", function (assert) {
        // Arrange
        this.oExpectedResult.title = "previewTitle";
        this.oExpectedResult.subtitle = "previewSubtitle";
        this.oExpectedResult.icon = "previewIcon";
        this.oExpectedResult.info = "previewInfo";
        this.oExpectedResult.keywords = ["previewKeyword"];
        this.oExpectedResult.technicalAttributes = ["previewTechnicalAttributes"];
        this.oExpectedResult._instantiationData = {
            platform: "LAUNCHPAGE",
            launchPageTile: this.oFirstOptionTileMock
        };

        // Act
        var oResult = this.oSearchableContentService._buildVizDataFromLaunchPageTile(this.oFirstOptionTileMock, this.oOptions.default);

        // Assert
        assert.deepEqual(oResult, this.oExpectedResult, "Returned the correct Result");
    });

    QUnit.test("Returns the correct result for first fallback", function (assert) {
        // Arrange
        this.oExpectedResult.id = "catalogTileId";
        this.oExpectedResult.title = "catalogTitle";
        this.oExpectedResult.subtitle = "";
        this.oExpectedResult.icon = "sap-icon://business-objects-experience";
        this.oExpectedResult.info = "";
        this.oExpectedResult.keywords = [];
        this.oExpectedResult.technicalAttributes = [];
        this.oExpectedResult._instantiationData = {
            platform: "LAUNCHPAGE",
            launchPageTile: this.oSecondOptionTileMock
        };

        // Act
        var oResult = this.oSearchableContentService._buildVizDataFromLaunchPageTile(this.oSecondOptionTileMock, this.oOptions.default);

        // Assert
        assert.deepEqual(oResult, this.oExpectedResult, "Returned the correct Result");
    });

    QUnit.test("Returns the correct result for second fallback", function (assert) {
        // Arrange
        this.oExpectedResult.vizId = "tileId";
        this.oExpectedResult.title = "tileTitle";
        this.oExpectedResult.subtitle = "";
        this.oExpectedResult.icon = "sap-icon://business-objects-experience";
        this.oExpectedResult.info = "";
        this.oExpectedResult.keywords = [];
        this.oExpectedResult.technicalAttributes = [];
        this.oExpectedResult._instantiationData = {
            platform: "LAUNCHPAGE",
            launchPageTile: this.oThirdOptionTileMock
        };

        // Act
        var oResult = this.oSearchableContentService._buildVizDataFromLaunchPageTile(this.oThirdOptionTileMock, this.oOptions.default);

        // Assert
        assert.deepEqual(oResult, this.oExpectedResult, "Returned the correct Result");
    });

    QUnit.test("Returns undefined if target url is missing", function (assert) {
        // Arrange
        this.oGetCatalogTileTargetURLStub.withArgs(this.oFirstOptionTileMock).returns();

        // Act
        var oResult = this.oSearchableContentService._buildVizDataFromLaunchPageTile(this.oFirstOptionTileMock, this.oOptions.default);

        // Assert
        assert.deepEqual(oResult, undefined, "Returned the correct Result");
    });

    QUnit.test("Returns undefined if tile intent is not supported", function (assert) {
        // Arrange
        this.oIsTileIntentSupportedStub.withArgs(this.oFirstOptionTileMock).returns(false);

        // Act
        var oResult = this.oSearchableContentService._buildVizDataFromLaunchPageTile(this.oFirstOptionTileMock, this.oOptions.default);

        // Assert
        assert.deepEqual(oResult, undefined, "Returned the correct Result");
    });

    QUnit.test("Changes all non-ABAP tiles to CDM static tiles", function (assert) {
        // Arrange
        delete this.oFirstOptionTileMock.getChip;
        var oExpectedInstantiationData = {
            platform: "CDM",
            vizType: {
                "sap.ui5": {
                    componentName: "sap.ushell.components.tiles.cdm.applauncher"
                }
            }
        };

        // Act
        var oResult = this.oSearchableContentService._buildVizDataFromLaunchPageTile(this.oFirstOptionTileMock, this.oOptions.default);

        // Assert
        assert.deepEqual(oResult._instantiationData, oExpectedInstantiationData, "The tile was changed to a CDM static tile");
    });

    QUnit.test("Keeps all tiles as is when enableVisualizationPreview=false", function (assert) {
        // Arrange
        delete this.oFirstOptionTileMock.getChip;
        var oExpectedInstantiationData = {
            launchPageTile: this.oFirstOptionTileMock,
            platform: "LAUNCHPAGE"
        };

        // Act
        var oResult = this.oSearchableContentService._buildVizDataFromLaunchPageTile(this.oFirstOptionTileMock, this.oOptions.previewDisabled);

        // Assert
        assert.deepEqual(oResult._instantiationData, oExpectedInstantiationData, "The tile was changed to a CDM static tile");
    });

    QUnit.test("Disables preview contract for abap tiles when enableVisualizationPreview=false", function (assert) {
        // Arrange
        const oPreviewSetEnabledStub = sandbox.stub();
        this.oFirstOptionTileMock.getContract = sandbox.stub().withArgs("preview").returns({
            setEnabled: oPreviewSetEnabledStub
        });
        var oExpectedInstantiationData = {
            launchPageTile: this.oFirstOptionTileMock,
            platform: "LAUNCHPAGE"
        };

        // Act
        var oResult = this.oSearchableContentService._buildVizDataFromLaunchPageTile(this.oFirstOptionTileMock, this.oOptions.previewDisabled);

        // Assert
        assert.deepEqual(oResult._instantiationData, oExpectedInstantiationData, "The tile was changed to a CDM static tile");
        assert.strictEqual(oPreviewSetEnabledStub.getCall(0).args[0], false, "preview contract was disabled");
    });
});
