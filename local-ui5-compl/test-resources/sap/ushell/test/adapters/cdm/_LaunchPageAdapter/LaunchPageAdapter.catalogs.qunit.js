// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.adapters.cdm.LaunchPageAdapter / CDM Version 3
 *
 * @deprecated since 1.112
 */
sap.ui.define([
    "sap/base/util/deepExtend",
    "sap/base/util/ObjectPath",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readVisualizations",
    "sap/ushell/adapters/cdm/v3/LaunchPageAdapter",
    "sap/ushell/Container",
    "sap/ushell/test/adapters/cdm/LaunchPageAdapter.testData",
    "sap/ushell/test/utils",
    "sap/ushell/utils",
    "sap/ushell/utils/utilsCdm"
], function (
    deepExtend,
    ObjectPath,
    jQuery,
    oReadVisualization,
    LaunchPageAdapter,
    Container,
    testData,
    testUtils,
    utils,
    utilsCdm
) {
    "use strict";

    /* global sinon, QUnit */

    var sandbox = sinon.createSandbox({});

    var O_CDM_SITE_SERVICE_MOCK_DATA = testData.getCommonDataModelData(),
        O_CDM_SITE = O_CDM_SITE_SERVICE_MOCK_DATA.site,
        O_CSTR = testData.getClientSideTargetResolutionData().resolvedTileHashes,
        O_LPA_CATALOGS_EXPOSED = testData.getLaunchPageAdapterData().catalogs,
        O_LPA_CATALOG_TILES_EXPOSED = testData.getLaunchPageAdapterData().catalogTiles,
        fnResolveTileIntentSpy;

    /**
     * TODO: a possibly more efficient strategy would be to add required groups
     * instead of doing a heavy copy only to delete some of the copied groups later?
     *
     * @param {object} oFilters
     *  Filter collection
     * @param {array} oFilters.groupsFilter
     *  Filters the groups based on the given IDs.
     *  The order in this array also defines the order of the groups.
     * @param {object} oFilters.tilesFilter
     *  Map of groupIds. Maps to an array of tile IDs to be filtered for.
     *  Note: all groupIds must also be available in oFilters.groupsFilter (if set)
     * @returns {object}
     *  Returns a site copy where the defined filters have been applied
     */
    function getFilteredSite (oFilters) {
        // TODO: if the objects in O_CDM_SITE were immutable,
        // and the arrays were returned via a getter then the
        // following expensive extend call would not be need.
        var oSiteCopy = deepExtend({}, O_CDM_SITE);

        if (oFilters && oFilters.groupsFilter) {
            // filter groups (based on oFilters.groupsFilter)
            Object.keys(oSiteCopy.groups).forEach(function (sGroupId) {
                // TODO: remove pointless immediately following if statement
                // because Object.keys always only return array of own
                // properties.
                if (!oSiteCopy.groups.hasOwnProperty(sGroupId)) {
                    return; // skip prototype properties
                }

                if (oFilters.groupsFilter.indexOf(sGroupId) === -1) {
                    // group must be filtered out
                    delete oSiteCopy.groups[sGroupId];
                    // entry in groupsOrder array needs to be adapted
                    oSiteCopy.site.payload.groupsOrder = oSiteCopy.site.payload.groupsOrder.filter(function (sId) {
                        return sId !== sGroupId;
                    });
                }
            });

            // Overwrite groupsOrder based on oFilters.groupsFilter
            oSiteCopy.site.payload.groupsOrder = oFilters.groupsFilter;
        }

        if (oFilters && typeof oFilters.catalogsFilter === "object") {
            var oFilteredCatalogs = {};

            oFilters.catalogsFilter.forEach(function (sCatalogId) {
                if (!oSiteCopy.catalogs.hasOwnProperty(sCatalogId)) {
                    return;
                }

                oFilteredCatalogs[sCatalogId] = oSiteCopy.catalogs[sCatalogId];
            });

            oSiteCopy.catalogs = oFilteredCatalogs;
        }
        return oSiteCopy;
    }

    /**
     * Stubs the CommonDataModel and the ClientSideTargetResolution services
     *
     * @param {object} oSite
     *  The main site to be used
     *
     * @param {object} oServiceSpecifications
     *  An object indicating how a certain mocked service should behave
     * @param {objec} [oAdapter]
     *  LaunchPageAdapter. If the adapter is provided, oCDMService variable of the adapter is replaced
     *
     * @returns {object}
     *  Site Object based on the common data model
     */
    function stubUsedServices (oSite, oServiceSpecifications, oAdapter) {
        fnResolveTileIntentSpy = sandbox.spy(async function (sHash) {
            // ignore the Hash parameters in order to simplify test data complexity
            var oHash = /(#[A-Za-z0-9-]+)(\?.+)?/.exec(sHash),
                sHashWithoutParameters = oHash.length > 1 ? oHash[1] : sHash,
                oResolutionResult = O_CSTR[sHashWithoutParameters];

            if (oResolutionResult) {
                return oResolutionResult;
            }
            throw new Error("stubbed CSTR: no resolution result found for '" + sHash + "'");

        });

        var oCommonDataModelService = {
            getSite: function () {
                var oGetSiteDeferred = new jQuery.Deferred();

                if (oServiceSpecifications && oServiceSpecifications.CommonDataModel &&
                    oServiceSpecifications.CommonDataModel.getSite &&
                    oServiceSpecifications.CommonDataModel.getSite.shouldReject === true) {
                    oGetSiteDeferred.reject(oServiceSpecifications.CommonDataModel.getSite.errorMessage || "");
                } else {
                    oGetSiteDeferred.resolve(oSite);
                }

                return oGetSiteDeferred.promise();
            },
            save: function () {
                var oDeferred = new jQuery.Deferred();

                if (oServiceSpecifications && oServiceSpecifications.CommonDataModel &&
                    oServiceSpecifications.CommonDataModel.save &&
                    oServiceSpecifications.CommonDataModel.save.shouldReject === true) {
                    oDeferred.reject(oServiceSpecifications.CommonDataModel.save.errorMessage || "");
                } else {
                    oDeferred.resolve();
                }

                return oDeferred.promise();
            },
            getGroupFromOriginalSite: function () {
                var oDeferred = new jQuery.Deferred();

                if (oServiceSpecifications && oServiceSpecifications.CommonDataModel &&
                    oServiceSpecifications.CommonDataModel.getGroupFromOriginalSite &&
                    oServiceSpecifications.CommonDataModel.getGroupFromOriginalSite.shouldReject === true) {
                    oDeferred.reject(oServiceSpecifications.CommonDataModel.getGroupFromOriginalSite.errorMessage || "");
                } else if (oServiceSpecifications && oServiceSpecifications.CommonDataModel &&
                    oServiceSpecifications.CommonDataModel.getGroupFromOriginalSite &&
                    oServiceSpecifications.CommonDataModel.getGroupFromOriginalSite.returnValue) {
                    oDeferred.resolve(deepExtend({}, oServiceSpecifications.CommonDataModel.getGroupFromOriginalSite.returnValue));
                }
                return oDeferred.promise();
            }
        };

        var oClientSideTargetResolutionService = {
            resolveTileIntent: fnResolveTileIntentSpy,
            resolveTileIntentInContext: async function (aInbounds, sHash) {
                var oResolvedTileIntents = ObjectPath.get(
                    "ClientSideTargetResolution.resolveTileIntentInContext.resolvedTileIntents",
                    oServiceSpecifications
                ) || {};

                if (oResolvedTileIntents[sHash]) {
                    return oResolvedTileIntents[sHash];
                }
                throw new Error("Could not resolve tile intent '" + sHash + "'");
            }
        };

        var oGetServiceStub = sandbox.stub(sap.ushell.Container, "_getServiceAsync");

        // As sinon does not match sandbox.match.falsy if the parameter does not exist in the arguments array, we have to
        // fake the function calls instead of simply using oGetServiceStub.withArgs("name", sandbox.match.any) :(
        oGetServiceStub.withArgs("CommonDataModel").callsFake(function (serviceName, parameter) {
            return Promise.resolve(oCommonDataModelService);
        });

        if (oAdapter) {
            oAdapter.oCDMService = oCommonDataModelService;
            oAdapter.oCDMServicePromise = Promise.resolve(oCommonDataModelService);
        }
        oGetServiceStub.withArgs("ClientSideTargetResolution").callsFake(function (serviceName, parameter) {
            return Promise.resolve(oClientSideTargetResolutionService);

        });

        oGetServiceStub.callThrough();

        return oSite;
    }

    /**
     * Test equivalent of _getTileFromHash.
     * Creates an entry for _mResolvedTiles based on a group item (tile or link)
     * and a hash.
     *
     * @param {string} sHash
     *  hash referring to O_CSTR
     * @param {boolean} bIsLink
     *  Specifies if the tile is displayed as link
     * @param {boolean} bIsCatalogTile
     *  Specifies if the tile is a catalog tile
     *
     * @returns {object}
     *   the resolved tile
     *
     */
    function createResolvedTile (sHash, bIsLink, bIsCatalogTile) {
        var oResolvedTile = {
            tileIntent: sHash,
            tileResolutionResult: O_CSTR[sHash]
        };

        if (bIsCatalogTile === true) {
            oResolvedTile.id = sHash;
        }

        if (bIsLink !== undefined && bIsCatalogTile === false) {
            oResolvedTile.isLink = !!bIsLink;
        }

        return oResolvedTile;
    }

    /**
     * Prepares this.oAdapter to "know" the resolved tile information. This does the same as getGroups would do.
     * Calls createResolvedTile and adds the result to this.oAdapter._mResolvedTiles for oTile
     *
     * @param {object} [oLaunchPageAdapter]
     *  CDM LaunchPageAdapter instance to add the resolved tile to
     * @param {string} sHash
     *  hash referring to O_CSTR
     * @param {object} oTile
     *  tile as returned by this.oAdapter.getGroupTiles(oGroup)
     * @param {boolean} bIsLink
     *  Specifies if the tile is displayed as link
     * @param {boolean} bIsCatalogTile
     *  Specifies if the tile is a catalog tile
     *
     */
    function addResolvedTileToAdapter (oLaunchPageAdapter, sHash, oTile, bIsLink, bIsCatalogTile) {
        oLaunchPageAdapter = oLaunchPageAdapter || this.oAdapter;

        if (bIsCatalogTile === true) {
            oLaunchPageAdapter._mResolvedCatalogTiles[sHash] = createResolvedTile(sHash, false, true);
        } else {
            oLaunchPageAdapter._mResolvedTiles[oTile.id] = createResolvedTile(sHash, bIsLink, false);
        }
    }

    QUnit.module("sap.ushell.adapters.cdm.v3.LaunchPageAdapter", {
        beforeEach: function (assert) {
            var done = assert.async();
            // local bootstrap, so not all needs to be done manually.
            // note: some adapters are stubbed later
            Container.init("local")
                .then(function () {
                    this.oAdapter = new LaunchPageAdapter(
                        undefined, undefined, {
                        config: {}
                    });
                    done();
                }.bind(this));
        },
        afterEach: function () {
            delete this.oAdapter;
            delete sap.ushell.Container;
            sandbox.restore();
        }
    });

    [{
        testDescription: "catalog tile with only title and subtitle given",
        input: O_LPA_CATALOG_TILES_EXPOSED.AppDesc1,
        expected: [
            "title - Static App Launcher 1",
            "subtitle - Static App Launcher 1"
        ]
    }, {
        testDescription: "catalog tile with keywords, title and subtitle given",
        input: O_LPA_CATALOG_TILES_EXPOSED.AppDesc2,
        expected: [
            "keyword1 - App2",
            "keyword2 - App2",
            "App desc 2 title",
            "subtitle - App2"
        ]
    }].forEach(function (oFixture) {
        QUnit.test("getCatalogTileKeywords when " + oFixture.testDescription, function (assert) {
            var aActualKeywords,
                catalogTile = oFixture.input,
                //TODO: clarify other keywords like info, description
                aExpectedKeywords = oFixture.expected;

            // act
            aActualKeywords = this.oAdapter.getCatalogTileKeywords(catalogTile);

            // assert
            assert.deepEqual(aActualKeywords, aExpectedKeywords, "Keywords returned as expected");
        });
    });

    [{
        testDescription: "catalog tile",
        input: {
            oTile: O_LPA_CATALOG_TILES_EXPOSED.AppDesc1
        },
        expected: {
            title: "title - Static App Launcher 1",
            subTitle: "subtitle - Static App Launcher 1",
            icon: "sap-icon://Fiori2/F0018",
            info: "info - Static App Launcher 1",
            url: "#App1-viaStatic?sap-ui-app-id-hint=AppDesc1"
        }
    }, {
        testDescription: "custom catalog tile with target",
        input: {
            oTile: O_LPA_CATALOG_TILES_EXPOSED.CustomTileApplication
        },
        expected: {
            title: "title - Custom Tile",
            subTitle: "subtitle - Custom Tile",
            icon: "sap-icon://time-entry-request",
            info: "",
            url: "#Shell-customTileWithTargetOutbound"
        }
    }, {
        testDescription: "custom catalog tile w/o target",
        input: {
            oTile: O_LPA_CATALOG_TILES_EXPOSED.CustomTileApplicationWithoutTarget
        },
        expected: {
            title: "title - Custom Tile w/o Target",
            subTitle: "subtitle - Custom Tile w/o Target",
            icon: "sap-icon://time-entry-request",
            info: "info - Custom Tile w/o Target",
            url: "#Shell-customTileWithOutTargetOutbound"
        }
    }, {
        testDescription: "catalog tile data shines through when group tile has NO own properties",
        input: {
            sHash: "#App1-viaStatic",
            oTile: {
                id: "012234553",
                appId: "AppDesc1",
                // no title, subTitle, icon & info
                target: {
                    SemanticObject: "App1",
                    Action: "viaStatic"
                }
            }
        },
        expected: {
            title: "title - Static App Launcher 1",
            subTitle: "subtitle - Static App Launcher 1",
            icon: "sap-icon://Fiori2/F0018",
            info: "info - Static App Launcher 1",
            url: "#App1-viaStatic"
        }
    }, {
        testDescription: "catalog tile data is hidden because group tile has own properties",
        input: {
            sHash: "#App1-viaStatic",
            oTile: {
                id: "012234553",
                appId: "AppDesc1",
                title: "group tile title",
                subTitle: "group tile subtitle",
                icon: "group/tile/icon",
                info: "group tile info",
                target: {
                    SemanticObject: "App1",
                    Action: "viaStatic"
                }
            }
        },
        expected: {
            title: "group tile title",
            subTitle: "group tile subtitle",
            icon: "group/tile/icon",
            info: "group tile info",
            url: "#App1-viaStatic"
        }
    }].forEach(function (oFixture) {
        QUnit.test("getCatalogTilePreviewTitle when " + oFixture.testDescription, function (assert) {
            // arrange
            if (oFixture.input.sHash) {
                addResolvedTileToAdapter(this.oAdapter, oFixture.input.sHash, oFixture.input.oTile, null, false);
            }
            // act
            var sValue = this.oAdapter.getCatalogTilePreviewTitle(oFixture.input.oTile);
            // assert
            assert.strictEqual(sValue, oFixture.expected.title, "title");
        });

        QUnit.test("getCatalogTilePreviewSubtitle when " + oFixture.testDescription, function (assert) {
            // arrange
            if (oFixture.input.sHash) {
                addResolvedTileToAdapter(this.oAdapter, oFixture.input.sHash, oFixture.input.oTile, null, false);
            }
            // act
            var sValue = this.oAdapter.getCatalogTilePreviewSubtitle(oFixture.input.oTile);
            // assert
            assert.strictEqual(sValue, oFixture.expected.subTitle, "subTitle");
        });

        QUnit.test("getCatalogTilePreviewIcon when " + oFixture.testDescription, function (assert) {
            // arrange
            if (oFixture.input.sHash) {
                addResolvedTileToAdapter(this.oAdapter, oFixture.input.sHash, oFixture.input.oTile, null, false);
            }
            // act
            var sValue = this.oAdapter.getCatalogTilePreviewIcon(oFixture.input.oTile);
            // assert
            assert.strictEqual(sValue, oFixture.expected.icon, "icon");
        });

        QUnit.test("getCatalogTilePreviewInfo when " + oFixture.testDescription, function (assert) {
            // arrange
            if (oFixture.input.sHash) {
                addResolvedTileToAdapter(this.oAdapter, oFixture.input.sHash, oFixture.input.oTile, null, false);
            }
            // act
            var sValue = this.oAdapter.getCatalogTilePreviewInfo(oFixture.input.oTile);
            // assert
            assert.strictEqual(sValue, oFixture.expected.info, "info");
        });

        QUnit.test("getCatalogTileTargetURL when " + oFixture.testDescription, function (assert) {
            // arrange
            if (oFixture.input.sHash) {
                addResolvedTileToAdapter(this.oAdapter, oFixture.input.sHash, oFixture.input.oTile, null, false);
            }
            // act
            var sValue = this.oAdapter.getCatalogTileTargetURL(oFixture.input.oTile);
            // assert
            assert.strictEqual(sValue, oFixture.expected.url, "url");
        });
    });

    [
        { testDescription: "null tile", inputTile: null }
    ].forEach(function (oFixture) {
        QUnit.test("getCatalogTilePreviewTitle FAILS when " + oFixture.testDescription, function (assert) {
            assert.throws(function () {
                // act
                this.oAdapter.getCatalogTilePreviewTitle(oFixture.inputTile);
            });
        });

        QUnit.test("getCatalogTilePreviewSubtitle FAILS when " + oFixture.testDescription, function (assert) {
            assert.throws(function () {
                // act
                this.oAdapter.getCatalogTilePreviewSubtitle(oFixture.inputTile);
            });
        });

        QUnit.test("getCatalogTilePreviewIcon FAILS when " + oFixture.testDescription, function (assert) {
            assert.throws(function () {
                // act
                this.oAdapter.getCatalogTilePreviewIcon(oFixture.inputTile);
            });
        });

        QUnit.test("getCatalogTilePreviewInfo FAILS when " + oFixture.testDescription, function (assert) {
            assert.throws(function () {
                // act
                this.oAdapter.getCatalogTilePreviewInfo(oFixture.inputTile);
            });
        });

        QUnit.test("getCatalogTileTargetURL FAILS when " + oFixture.testDescription, function (assert) {
            assert.throws(function () {
                // act
                this.oAdapter.getCatalogTileTargetURL(oFixture.inputTile);
            });
        });
    });

    QUnit.test("getCatalogTileSize: FAILS when undefined parameter", function (assert) {
        var oAdapter = this.oAdapter;

        // assert
        assert.throws(function () {
            // act
            oAdapter.getCatalogTileSize();
        });
    });

    QUnit.test("getCatalogTileSize: without tile size", function (assert) {
        var oAdapter = this.oAdapter,
            oTile = { id: "tile", tileResolutionResult: "" },
            expectedSize = "1x1",
            sSize;

        // act
        sSize = oAdapter.getCatalogTileSize(oTile);

        // assert
        assert.strictEqual(sSize, expectedSize, "returned size 1x1, if no size was given before ");
    });

    QUnit.test("getCatalogTileSize: 1x2 tile ", function (assert) {
        var oAdapter = this.oAdapter,
            oTile = { id: "tile", tileResolutionResult: { size: "1x2" } },
            expectedSize = "1x2",
            sSize;

        // act
        sSize = oAdapter.getCatalogTileSize(oTile);

        // assert
        assert.strictEqual(sSize, expectedSize, "returned expected size 1x2");
    });

    QUnit.test("getCatalogTileViewControl: _getCatalogTileViewControl throws error", function (assert) {
        var done = assert.async();
        var oAdapter = this.oAdapter,
            oCatalogTile = undefined;

        // Act and assert
        oAdapter.getCatalogTileViewControl(oCatalogTile)
            .fail(function () {
                assert.ok(true, "Throws error as expected");
                done();
            })
            .done(function () {
                assert.ok(false, "Error is not thrown");
                done();
            });
    });

    QUnit.test("_getCatalogTileViewControl : Returns correct tile ui", function (assert) {
        var done = assert.async();
        var oAdapter = this.oAdapter,
            oCatalogTile = {},
            oCatalogTileUi = { foo: "bar" },
            oCatalogTileUiPromise = new jQuery.Deferred().resolve(oCatalogTileUi).promise();

        // Arrange
        sandbox.stub(oAdapter, "_getTileUiComponentContainer").returns(oCatalogTileUiPromise);

        // Act
        oAdapter._getCatalogTileViewControl(oCatalogTile)
            .fail(function (sMessage) {
                assert.ok(false, "unexpected failure: " + sMessage);
                done();
            })
            .done(function (oResult) {
                // Assert
                assert.ok(oAdapter._getTileUiComponentContainer.called, "_getTileUiComponentContainer called");
                assert.deepEqual(oResult, oCatalogTileUi, "correct value returned");
                done();
            });
    });

    [{
        testDescription: "_compareCatalogs A and B",
        input: {
            oCatalogA: { identification: { id: "A", title: "A" } },
            oCatalogB: { identification: { id: "B", title: "B" } }
        },
        expectedResult: -1
    }, {
        testDescription: "_compareCatalogs B and A",
        input: {
            oCatalogA: { identification: { id: "B", title: "B" } },
            oCatalogB: { identification: { id: "A", title: "A" } }
        },
        expectedResult: 1
    }].forEach(function (oFixture) {
        QUnit.test(oFixture.testDescription, function (assert) {
            // act
            var comparison = this.oAdapter._compareCatalogs(oFixture.input.oCatalogA, oFixture.input.oCatalogB);
            // assert
            assert.strictEqual(comparison, oFixture.expectedResult, "Catalog A bigger than Catalog B (-1 / false ) or Catalog B bigger than Catalog A (1 / true )");
        });
    });

    QUnit.test("getCatalogTiles: empty catalog", function (assert) {
        var done = assert.async();
        var that = this;

        // Arrange
        stubUsedServices(getFilteredSite(), null, that.oAdapter);

        // Act
        that.oAdapter.getCatalogTiles({}) // note: empty
            .fail(function () {
                assert.ok(false, "promise was resolved");
            })
            .done(function (aTiles) {
                assert.ok(true, "promise was resolved");

                assert.deepEqual(aTiles, [],
                    "promise was resolved with an empty array");
            })
            .always(function () {
                done();
            });
    });

    QUnit.test("getCatalogs", function (assert) {
        var done = assert.async();
        var aExpectedCatalogs = Object.keys(O_LPA_CATALOGS_EXPOSED)
            .map(function (sKey) {
                return O_LPA_CATALOGS_EXPOSED[sKey];
            }),
            aActualCatalogs = [],
            oGetServiceAsyncSpy;

        // Arrange
        stubUsedServices(getFilteredSite(), null, this.oAdapter);
        oGetServiceAsyncSpy = sandbox.spy(sap.ushell.Container, "getServiceAsync");

        // Act
        this.oAdapter.getCatalogs()
            .fail(function () {
                assert.ok(false, "unexpected failure");
                done();
            })
            .progress(function (oCatalog) {
                // add the catalogs for later check in the done handler
                aActualCatalogs.push(oCatalog);
            })
            .done(function () {
                // Assert
                assert.strictEqual(oGetServiceAsyncSpy.callCount, 1, "getServiceAsync in getCatalogs called");
                assert.deepEqual(aActualCatalogs, aExpectedCatalogs, "catalogs exposed as expected");
                oGetServiceAsyncSpy.restore();
                done();
            });
    });

    QUnit.test("getCatalogId", function (assert) {
        var oCatalog = O_LPA_CATALOGS_EXPOSED.cat1,
            sExpected = "cat1",
            sActual;

        // act
        sActual = this.oAdapter.getCatalogId(oCatalog);

        // assert
        assert.strictEqual(sActual, sExpected, "catalog ID");
    });

    QUnit.test("getCatalogTitle", function (assert) {
        var oCatalog = O_LPA_CATALOGS_EXPOSED.cat2,
            sExpected = "Accounts Payable - Checks",
            sActual;

        // act
        sActual = this.oAdapter.getCatalogTitle(oCatalog);

        // assert
        assert.strictEqual(sActual, sExpected, "catalog title");
    });

    [{
        testDescription: "Catalog cat1",
        input: O_LPA_CATALOGS_EXPOSED.cat1,
        expected: [
            O_LPA_CATALOG_TILES_EXPOSED.AppDesc1,
            O_LPA_CATALOG_TILES_EXPOSED.AppDesc2
        ]
    }, {
        testDescription: "Catalog cat2",
        input: O_LPA_CATALOGS_EXPOSED.cat2,
        expected: [
            O_LPA_CATALOG_TILES_EXPOSED.AppDesc1
            // "AppDesc3" does not exist
        ]
    }, {
        testDescription: "Catalog customTileCatalog",
        input: O_LPA_CATALOGS_EXPOSED.customTileCatalog,
        expected: [
            O_LPA_CATALOG_TILES_EXPOSED.CustomTileApplication1
        ]
    }, {
        testDescription: "Catalog urlTileCatalog",
        input: O_LPA_CATALOGS_EXPOSED.urlTileCatalog,
        expected: [
            O_LPA_CATALOG_TILES_EXPOSED.urlTile
        ]
    }, {
        testDescription: "Catalog pluginCatalog",
        input: O_LPA_CATALOGS_EXPOSED.pluginCatalog,
        expected: [
            O_LPA_CATALOG_TILES_EXPOSED.AppDesc1,
            // UIPLUGINSAMPLE is not exposed as a catalog tile
            O_LPA_CATALOG_TILES_EXPOSED.AppDesc2
        ]
    }].forEach(function (oFixture) {
        QUnit.test("getCatalogTiles for " + oFixture.testDescription, function (assert) {
            var done = assert.async();
            var oCatalog = oFixture.input,
                aExpectedCatalogTiles = oFixture.expected,
                fnMapOne = sandbox.spy(utilsCdm, "mapOne");

            // arrange
            stubUsedServices(getFilteredSite(), null, this.oAdapter);

            // act
            this.oAdapter.getCatalogTiles(oCatalog)
                .done(function (aActualCatalogTiles) {
                    // assert
                    assert.strictEqual(aActualCatalogTiles.length, aExpectedCatalogTiles.length,
                        "number of catalog tiles");
                    assert.deepEqual(aActualCatalogTiles,
                        aExpectedCatalogTiles, "catalog tiles"
                    );

                    if (fnMapOne.callCount > 0) {
                        fnMapOne.args.forEach(function (oCallArgs) {
                            var sKey = oCallArgs[0],
                                oInbound = oCallArgs[1],
                                oApp = oCallArgs[2],
                                oVisualization = oCallArgs[3];

                            if (!utils.getMember(oReadVisualization.getConfig(oVisualization), "sap|flp.target.type") === "URL") {
                                assert.strictEqual(
                                    oInbound,
                                    oApp["sap.app"].crossNavigation.inbounds[sKey],
                                    "inbound is given as oSrc. So title, subtitle ... deviceTypes from inbound are considered"
                                );
                            }
                        });
                    }

                    done();
                });
        });
    });

    [{
        testDescription: "invalid input parameter 'undefined'",
        oCatalogs: undefined,
        expectedError: "Invalid input parameter 'undefined' passed to getCatalogTiles."
    }, {
        testDescription: "invalid string input parameter is provided",
        oCatalogs: "SomeCatalogId",
        expectedError: "Invalid input parameter 'SomeCatalogId' passed to getCatalogTiles."
    }, {
        testDescription: "invalid input parameter 'null'",
        oCatalogs: null,
        expectedError: "Invalid input parameter 'null' passed to getCatalogTiles."
    }].forEach(function (oFixture) {
        QUnit.test("getCatalogTiles: rejects promise with expected error message when " + oFixture.testDescription, function (assert) {
            var done = assert.async();
            var that = this;
            // Arrange
            stubUsedServices(getFilteredSite());

            // Act
            that.oAdapter.getCatalogTiles(oFixture.oCatalogs)
                .fail(function (sErrorMessage) {
                    // Assert
                    assert.ok(true, "promise was rejected");
                    assert.strictEqual(sErrorMessage, oFixture.expectedError,
                        "correct error message rejected");
                    done();
                })
                .done(function (/*aCatalogTiles*/) {
                    assert.ok(false, "promise was rejected");
                    done();
                });
        });
    });

    [{
        testDescription: "catalog tile is given",
        oGroupOrCatalogTile: O_LPA_CATALOG_TILES_EXPOSED.AppDesc1,
        expectedId: "AppDesc1"
    }, {
        testDescription: "group bookmark tile is given",
        oGroupOrCatalogTile: {
            id: "id-1501141576030-244",
            target: {
                url: "https://www.example.com"
            },
            title: "SAPUI5",
            icon: "sap-icon://some-icon",
            subTitle: "Subtitle",
            info: "Info",
            isBookmark: true // note
        },
        expectedId: "https://www.example.com"
    }, {
        testDescription: "non-bookmark group tile is given",
        oGroupOrCatalogTile: {
            id: "static_tile_id",
            vizId: "static_tile_id",
            icon: "sap-icon://family-care",
            title: "Title and icon Overwritten on Group",
            subTitle: "Static Tile - modified properties!",
            target: {
                semanticObject: "Custom",
                action: "StaticTile",
                parameters: []
            }
        },
        oResolvedTiles: {
            static_tile_id: {
                // other fields irrelevant ...
                tileIntent: "#Custom-StaticTile"
            }
        },
        expectedId: "static_tile_id"
    }, {
        testDescription: "non-bookmark failed group tile is given",
        oGroupOrCatalogTile: {
            // TODO still CDM 1.0 structure
            id: "static_tile_id",
            vizId: "static_tile_id",
            icon: "sap-icon://family-care",
            title: "Title and icon Overwritten on Group",
            subTitle: "Static Tile - modified properties!",
            target: {
                semanticObject: "Custom",
                action: "StaticTile",
                parameters: []
            }
        },
        oResolvedTiles: {
            static_tile_id: { // it can't be, but still provide it to
                // make sure that fail condition is evaluated before the success
                // condition.
                tileIntent: "#Custom-StaticTile"
            }
        },
        oFailedTiles: {
            static_tile_id: true // note
        },
        expectedId: undefined
    }, {
        testDescription: "non-bookmark group tile is given but contract was not respected",
        oGroupOrCatalogTile: {
            id: "static_tile_id",
            icon: "sap-icon://family-care",
            title: "Title and icon Overwritten on Group",
            subTitle: "Static Tile - modified properties!",
            target: {
                semanticObject: "Custom",
                action: "StaticTile",
                parameters: []
            }
        },
        oResolvedTiles: { // should have been resolved before!
        },
        expectedId: undefined // don't throw
    }].forEach(function (oFixture) {
        QUnit.test("getCatalogTileId: returns the expected id when " + oFixture.testDescription, function (assert) {
            this.oAdapter._mResolvedTiles = oFixture.oResolvedTiles || {};
            this.oAdapter._mFailedResolvedTiles = oFixture.oFailedTiles || {};

            assert.strictEqual(
                this.oAdapter.getCatalogTileId(oFixture.oGroupOrCatalogTile),
                oFixture.expectedId,
                "obtained the expected id"
            );
        });
    });

    //TODO add test which compares getCatalogTileId(GroupTile) with corresponding getCatalogTileId(CatalogTile)
    //     (app finder does this for the pin detection

    QUnit.test("add Catalog Tile to a group: basic call", function (assert) {
        var done = assert.async();
        var that = this,
            aCatalogs = [];

        // Arrange
        stubUsedServices(getFilteredSite({
            groupsFilter: ["ONE"]
        }), null, this.oAdapter);

        sandbox.stub(utils, "generateUniqueId").returns("12345");

        // Act
        this.oAdapter.getCatalogs().done(function (oCatalogs) {
            // tests
            assert.deepEqual(that.oAdapter.getCatalogId(aCatalogs[0]), "cat1", "id 1");
            assert.deepEqual(that.oAdapter.getCatalogId(aCatalogs[1]), "cat2", "id 2");
            assert.deepEqual(that.oAdapter.getCatalogTitle(aCatalogs[1]), "Accounts Payable - Checks", "title");
            that.oAdapter.getCatalogTiles(aCatalogs[0]).done(function (aTiles) {
                // Assert
                var oCatalogTile;

                assert.deepEqual(aTiles.length, 2, "tile length ok");
                oCatalogTile = aTiles[1];

                assert.strictEqual(that.oAdapter.getCatalogTileTargetURL(oCatalogTile), "#App2-viaStatic?sap-ui-app-id-hint=AppDesc2", "correct TargetURL");
                assert.strictEqual(that.oAdapter.getCatalogTileSize(oCatalogTile), "1x1", "size ok");
                assert.strictEqual(that.oAdapter.getCatalogTileTitle(oCatalogTile), "App desc 2 title", "title ok");
                that.oAdapter.getGroups().done(function (aGroups) {
                    var oGroup = aGroups[1]; // because group with index 0 is default group
                    that.oAdapter.addTile(oCatalogTile, oGroup)
                        .done(function (oNewTile) {
                            // check some things on the tile:
                            assert.strictEqual(that.oAdapter.getTileId(oNewTile), "12345", "correct id");
                            assert.strictEqual(oNewTile.vizId, "AppDesc2", "Correct app ID provided for added tile");
                            // TODO may be wrong: strictEqual(that.oAdapter.getTileTitle(oNewTile), "title - App2", "title ok");
                            that.oAdapter.getGroups().done(function (aGroups) {
                                var nLen = 3;
                                assert.strictEqual(aGroups[1].payload.tiles.length, nLen, "new length ok"); // because group with index 0 is default group
                                done();
                            });
                        })
                        .fail(function () {
                            assert.ok(false, "unexpected addTile failure");
                            done();
                        });
                });
            });
        }).progress(function (oCatalog) {
            aCatalogs.push(oCatalog);
        });
    });

    [{
        description: "no valid inbound",
        oInbound: {},
        expectedResult: false
    }, {
        description: "no Action",
        oInbound: {
            semanticObject: "SemanticObject",
            signature: {
                parameters: {
                    P1: { defaultValue: { value: "ABC" } }
                }
            }
        },
        expectedResult: false
    }, {
        description: "no SemanticObject",
        oInbound: {
            action: "action",
            signature: {
                parameters: {
                    P1: { defaultValue: { value: "ABC" } }
                }
            }
        },
        expectedResult: false
    }, {
        description: "Shell-plugin",
        oInbound: {
            semanticObject: "Shell",
            action: "plugin",
            signature: {
                parameters: {},
                additionalParameters: "allowed"
            }
        },
        expectedResult: false
    }, {
        description: "Shell-bootConfig", // should never be the case
        oInbound: {
            semanticObject: "Shell",
            action: "bootConfig",
            signature: {
                parameters: {},
                additionalParameters: "allowed"
            }
        },
        expectedResult: false
    }].forEach(function (oFixture) {
        QUnit.test("isStartableInbound when " + oFixture.description, function (assert) {
            var bResult = this.oAdapter._isStartableInbound(oFixture.oInbound);
            assert.strictEqual(bResult, oFixture.expectedResult, "correct result");
        });
    });

    QUnit.test("getCatalogTilePreviewIndicatorDataSource: returns the indicator data source of the catalog or group tile", function (assert) {
        // Arrange
        var oExpectedIndicatorDataSource = {
            path: "/sap/opu/odata/UI2/PAGE_BUILDER_PERS/PageSets('%2FUI2%2FFiori2LaunchpadHome')/Pages/$count",
            refresh: 900
        };

        // Act
        var oIndicatorDataSource = this.oAdapter.getCatalogTilePreviewIndicatorDataSource(O_LPA_CATALOG_TILES_EXPOSED.CustomTileApplication);

        // Assert
        assert.deepEqual(oIndicatorDataSource, oExpectedIndicatorDataSource, "The function getCatalogTilePreviewIndicatorDataSource returns the correct indicator data source.");
    });

    QUnit.module("_isStartableVisualization", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub();
            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };
            this.oAdapter = new LaunchPageAdapter(undefined, undefined, { config: {} });
            this.oInbound = {
                signature: {
                    parameters: {}
                }
            };
            this.oVisualization = {
                vizConfig: {
                    "sap.flp": { target: { parameters: {} } }
                }
            };
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Returns true if the inbound doesn't have any parameters", function (assert) {
        //Arrange
        this.oVisualization = {};
        this.oInbound = {};

        //Act
        var bIsStartableVisualization = this.oAdapter._isStartableVisualization(this.oVisualization, this.oInbound);

        //Assert
        assert.strictEqual(bIsStartableVisualization, true, "The visualization is startable");
    });

    QUnit.test("Returns true for legacy URL applications", function (assert) {
        //Arrange
        this.oVisualization = {};
        this.oInbound.signature.parameters = {
            "sap-external-url": {}
        };

        //Act
        var bIsStartableVisualization = this.oAdapter._isStartableVisualization(this.oVisualization, this.oInbound);

        //Assert
        assert.strictEqual(bIsStartableVisualization, true, "The visualization is startable");
    });

    QUnit.test("Returns true if the inbound parameters don't have a filter", function (assert) {
        //Arrange
        this.oVisualization = {};
        this.oInbound.signature.parameters = {
            a: {}
        };

        //Act
        var bIsStartableVisualization = this.oAdapter._isStartableVisualization(this.oVisualization, this.oInbound);

        //Assert
        assert.strictEqual(bIsStartableVisualization, true, "The visualization is startable");
    });

    QUnit.test("Returns true if the inbound parameter's filter doesn't expect a plain value", function (assert) {
        //Arrange
        this.oVisualization = {};
        this.oInbound.signature.parameters = {
            a: { filter: { value: "1", format: "regexp" } }
        };

        //Act
        var bIsStartableVisualization = this.oAdapter._isStartableVisualization(this.oVisualization, this.oInbound);

        //Assert
        assert.strictEqual(bIsStartableVisualization, true, "The visualization is startable");
    });

    QUnit.test("Returns true if the visualization's parameters match the inbound's expected filter values", function (assert) {
        //Arrange
        this.oVisualization.vizConfig["sap.flp"].target.parameters = {
            a: { value: { value: "1", format: "plain" } },
            b: { value: { value: "2", format: "plain" } }
        };
        this.oInbound.signature.parameters = {
            a: { filter: { value: "1", format: "plain" } },
            b: { filter: { value: "2", format: "plain" } }
        };

        //Act
        var bIsStartableVisualization = this.oAdapter._isStartableVisualization(this.oVisualization, this.oInbound);

        //Assert
        assert.strictEqual(bIsStartableVisualization, true, "The visualization is startable");
    });

    QUnit.test("Returns false if the visualization's parameters don't match one of the inbound's expected filter value", function (assert) {
        //Arrange
        this.oVisualization.vizConfig["sap.flp"].target.parameters = {
            a: { value: { value: "2", format: "plain" } },
            b: { value: { value: "5", format: "plain" } }
        };
        this.oInbound.signature.parameters = {
            a: { filter: { value: "1", format: "plain" } },
            b: { filter: { value: "2", format: "plain" } }
        };

        //Act
        var bIsStartableVisualization = this.oAdapter._isStartableVisualization(this.oVisualization, this.oInbound);

        //Assert
        assert.strictEqual(bIsStartableVisualization, false, "The visualization is not startable");
    });

    QUnit.test("Returns false if the inbound's expected filter parameter is not present in the visualization", function (assert) {
        //Arrange
        this.oVisualization = {};
        this.oInbound.signature.parameters = {
            a: { filter: { value: "1", format: "plain" } }
        };

        //Act
        var bIsStartableVisualization = this.oAdapter._isStartableVisualization(this.oVisualization, this.oInbound);

        //Assert
        assert.strictEqual(bIsStartableVisualization, false, "The visualization is not startable");
    });
});
