// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
* @fileOverview QUnit tests for sap.ushell.components.contentFinder.CatalogService
*/
sap.ui.define([
    "sap/ushell/components/contentFinder/CatalogService",
    "./mockData/contentFinderCategoryTree",
    "./mockData/contentFinderVisualizations",
    "sap/ushell/Config"
], function (
    CatalogService,
    contentFinderCategoryTree,
    contentFinderVisualizations,
    Config
) {
    "use strict";

    /* global QUnit, sinon */
    const sandbox = sinon.createSandbox();

    const sSiteId = "myTestSiteId";
    const sCatalogId = "myTestCatalogId";
    const sMParameters = "myTestParams";

    const oCatalogData = {
        data: {
            catalogs: {
                totalCount: 3,
                nodes: contentFinderCategoryTree
            }
        }
    };

    const oCatalogDataResult = {
        catalogs: [
          {
            id: "cat0",
            title: "All Tiles"
          },
          {
            id: "cat1",
            title: "Catalog"
          },
          {
            id: "cat2",
            title: "Roles"
          },
          {
            id: "cat3",
            title: "Groups"
          }
        ],
        totalCount: 3
    };

    const oCatalogVizData = {
        data: {
            catalog: {
                visualizations: {
                    nodes: contentFinderVisualizations
                }

            }
        }
    };

    const oCatalogVizDataResult = {
        visualizations: {
            nodes: contentFinderVisualizations
        },
        totalCount: 0
    };

    QUnit.module("The 'getCatalogs' and 'loadVisualizations' functions gets called without siteId parameter", {
        beforeEach: function () {
            this.oCatalogService = new CatalogService();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("and 'getCatalogs' resolves successfully", async function (assert) {
        // Arrange
        sandbox.stub(CatalogService.prototype, "_doRequest").resolves(oCatalogData);

        // Act
        const aResult = await this.oCatalogService.getCatalogs();

        // Assert
        assert.deepEqual(aResult, oCatalogDataResult, "with the correct Catalogs data");
    });

    QUnit.test("and 'getCatalogs' rejects successfully", async function (assert) {
        // Arrange
        const oError = new Error("Catalogs not found");

        sandbox.stub(CatalogService.prototype, "_doRequest").rejects(oError);

        // Act
            await this.oCatalogService.getCatalogs().catch((oResult) => {
            // Assert
            assert.strictEqual(oResult, oError, "with the correct Error");
        });
    });

    QUnit.test("and 'loadVisualizations' resolves successfully", async function (assert) {
        // Arrange
        const oDoRequestStub = sandbox.stub(CatalogService.prototype, "_doRequest");
        oDoRequestStub.resolves(oCatalogVizData);

        // Act
        const aResult = await this.oCatalogService.loadVisualizations(sCatalogId, sMParameters);

        // Assert
        assert.deepEqual(aResult, oCatalogVizDataResult, "with the correct Visualizations data");
        assert.strictEqual(JSON.parse(oDoRequestStub.getCall(0).args[1]).filterQuery, sMParameters, "and _doRequest is called with the correct mParameters");
        assert.strictEqual(oDoRequestStub.getCall(0).args[0].includes(`catalogId:"${sCatalogId}"`), true, "and _doRequest is called with the correct catalogId");
        assert.strictEqual(oDoRequestStub.calledOnce, true, "and _doRequest was called only once");
     });

    QUnit.test("and 'loadVisualizations' rejects successfully", async function (assert) {
        // Act
        await this.oCatalogService.loadVisualizations().catch((oResult) => {
            assert.strictEqual(oResult, "Catalog ID is mandatory", "with the correct Error");
        });
     });

    QUnit.module("The 'getCatalogs' and 'loadVisualizations' functions gets called with siteId parameter", {
        beforeEach: function () {
            sandbox.stub(Config, "last").withArgs("/core/site/siteId").returns(sSiteId);
            this.oCatalogService = new CatalogService();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("and 'getCatalogs' resolves successfully", async function (assert) {
        // Arrange
        const oDoRequestStub = sandbox.stub(CatalogService.prototype, "_doRequest");
        oDoRequestStub.resolves(oCatalogData);

        // Act
        const aResult = await this.oCatalogService.getCatalogs();
        // Assert
        assert.deepEqual(aResult, oCatalogDataResult, "with the correct Catalogs data");
        assert.strictEqual(JSON.parse(oDoRequestStub.getCall(0).args[1]).siteId, sSiteId, "and siteId value is passed correctly");
    });

    QUnit.test("and 'loadVisualizations' resolves successfully", async function (assert) {
        // Arrange
        const oDoRequestStub = sandbox.stub(CatalogService.prototype, "_doRequest");
        oDoRequestStub.resolves(oCatalogVizData);

        // Act
        const aResult = await this.oCatalogService.loadVisualizations(sCatalogId);

        // Assert
        assert.deepEqual(aResult, oCatalogVizDataResult, "with the correct Visualizations data");
        assert.strictEqual(JSON.parse(oDoRequestStub.getCall(0).args[1]).siteId, sSiteId, "and siteId value is passed correctly");
        assert.strictEqual(oDoRequestStub.calledOnce, true, "and _doRequest was called only once");
     });

});
