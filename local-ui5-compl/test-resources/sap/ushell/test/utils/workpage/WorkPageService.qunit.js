// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.utils.workpage.WorkPageService
 */
sap.ui.define([
    "sap/base/i18n/Localization",
    "sap/ushell/utils/workpage/WorkPageService",
    "sap/ushell/Config",
    "sap/ushell/Container",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readUtils",
    "sap/base/util/extend",
    "sap/base/util/ObjectPath"
], function (
    Localization,
    WorkPageService,
    Config,
    Container,
    readUtils,
    extend,
    ObjectPath
) {
    "use strict";
    /* global sinon QUnit */

    var sandbox = sinon.createSandbox({});

    QUnit.module("WorkPages Service", {
        beforeEach: function () {
            this.oConfigLastStub = sandbox.stub(Config, "last")
                .withArgs("/core/site/siteId")
                .returns("test-site-id");

            this.oWorkPageService = new WorkPageService();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("instantiation works", function (assert) {
        assert.ok(this.oWorkPageService, "The service was instantiated.");
        assert.ok(this.oConfigLastStub.calledWith("/core/site/siteId"), "Config.last was called.");
    });

    QUnit.module("createWorkPageQuery", {
        beforeEach: function () {
            this.oConfigLastStub = sandbox.stub(Config, "last")
                .withArgs("/core/site/siteId")
                .returns("test-site-id");

            this.oWorkPageService = new WorkPageService();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("returns a correct string given all needed data", function (assert) {

        const sSiteId = "test-site-id";
        const sPageId = "test-page-id";
        const bIncludeWorkPage = false;
        const sEndCursor = "1";
        const bUseIntentNavigation = false;

        const sExpectedQuery = `{
            workPage(
                siteId: "${sSiteId}",
                workPageId: "${sPageId}"
                ) {
                    usedVisualizations(after:"${sEndCursor}"){
                        pageInfo{
                            endCursor,
                            hasNextPage
                        }
                        nodes{
                            id,
                            type,
                            descriptor{
                                value
                            },
                            descriptorResources{
                                baseUrl,
                                descriptorPath
                            },
                            provider{
                                id
                            },
                            indicatorDataSource{
                                url,
                                refreshInterval
                            }
                        }
                    }
                }
            }`.replace(/\s\s+/g, "").replace(/\n/gm, "");

        const sQuery = this.oWorkPageService._createWorkPageQuery(sSiteId, sPageId, bIncludeWorkPage, sEndCursor, bUseIntentNavigation);
        assert.equal(sQuery, sExpectedQuery, "returned correct query string");
    });

    QUnit.test("returns a correct string given all needed data with bInclueWorkPage = true", function (assert) {

        const sSiteId = "test-site-id";
        const sPageId = "test-page-id";
        const oIncludeWorkPage = true;
        const sEndCursor = "1";
        const bUseIntentNavigation = false;

        const sExpectedQuery = `{
            workPage(
                siteId: "${sSiteId}",
                workPageId: "${sPageId}"
                ) {
                    id,
                    contents,
                    editable,
                    usedVisualizations(after:"${sEndCursor}"){
                        pageInfo{
                            endCursor,
                            hasNextPage
                        }
                        nodes{
                            id,
                            type,
                            descriptor{
                                value
                            },
                            descriptorResources{
                                baseUrl,
                                descriptorPath
                            },
                            provider{
                                id
                            },
                            indicatorDataSource{
                                url,
                                refreshInterval
                            }
                        }
                    }
                }
            }`.replace(/\s\s+/g, "").replace(/\n/gm, "");

        const sQuery = this.oWorkPageService._createWorkPageQuery(sSiteId, sPageId, oIncludeWorkPage, sEndCursor, bUseIntentNavigation);
        assert.equal(sQuery, sExpectedQuery, "returned correct query string");
    });

    QUnit.test("returns a correct string given all needed data with bIncludeWorkPage = true and no sEndCursor", function (assert) {

        const sSiteId = "test-site-id";
        const sPageId = "test-page-id";
        const oIncludeWorkPage = true;
        const sEndCursor = null;
        const bUseIntentNavigation = false;

        const sExpectedQuery = `{
            workPage(
                siteId: "${sSiteId}",
                workPageId: "${sPageId}"
                ) {
                    id,
                    contents,
                    editable,
                    usedVisualizations{
                        pageInfo{
                            endCursor,
                            hasNextPage
                        }
                        nodes{
                            id,
                            type,
                            descriptor{
                                value
                            },
                            descriptorResources{
                                baseUrl,
                                descriptorPath
                            },
                            provider{
                                id
                            },
                            indicatorDataSource{
                                url,
                                refreshInterval
                            }
                        }
                    }
                }
            }`.replace(/\s\s+/g, "").replace(/\n/gm, "");

        const sQuery = this.oWorkPageService._createWorkPageQuery(sSiteId, sPageId, oIncludeWorkPage, sEndCursor, bUseIntentNavigation);
        assert.equal(sQuery, sExpectedQuery, "returned correct query string");
    });

    QUnit.test("returns a correct string given all needed data with bUseIntentNavigation = true", function (assert) {

        const sSiteId = "test-site-id";
        const sPageId = "test-page-id";
        const oIncludeWorkPage = true;
        const sEndCursor = null;
        const bUseIntentNavigation = true;

        const sExpectedQuery = `{
            workPage(
                siteId: "${sSiteId}",
                workPageId: "${sPageId}"
                ) {
                    id,
                    contents,
                    editable,
                    usedVisualizations{
                        pageInfo{
                            endCursor,
                            hasNextPage
                        }
                        nodes{
                            id,
                            targetAppIntent{
                                semanticObject,
                                action,
                                businessAppId
                            },
                            type,
                            descriptor{
                                value
                            },
                            descriptorResources{
                                baseUrl,
                                descriptorPath
                            },
                            provider{
                                id
                            },
                            indicatorDataSource{
                                url,
                                refreshInterval
                            }
                        }
                    }
                }
            }`.replace(/\s\s+/g, "").replace(/\n/gm, "");

        const sQuery = this.oWorkPageService._createWorkPageQuery(sSiteId, sPageId, oIncludeWorkPage, sEndCursor, bUseIntentNavigation);
        assert.equal(sQuery, sExpectedQuery, "returned correct query string");
    });

    QUnit.test("expect to throw an error if called with invalid arguments", function (assert) {
        assert.throws(() => this.oWorkPageService._createWorkPageQuery("valid-id", undefined, undefined, undefined, undefined));
        assert.throws(() => this.oWorkPageService._createWorkPageQuery(undefined, "valid-id", undefined, undefined, undefined));
        assert.throws(() => this.oWorkPageService._createWorkPageQuery(undefined, undefined, undefined, undefined, undefined));
    });

    QUnit.module("loadWorkPageAndVisualizations", {
        beforeEach: function () {
            this.oConfigLastStub = sandbox.stub(Config, "last")
                .withArgs("/core/site/siteId")
                .returns("test-site-id");
            this.oConfigLastStub.withArgs("/core/workPages/contentApiUrl")
                .returns("/content-api/base");
            this.oWorkPageContents = {
                test: "object"
            };
            this.aUsedVisualizations = [
                { id: "a" },
                { id: "b" },
                { id: "c" },
                { id: "d" }
            ];
            this.oWorkPageService = new WorkPageService();

            this.oGetStub = sandbox.stub().resolves({
                status: 200,
                responseText: JSON.stringify({
                    data: {
                        workPage: {
                            contents: this.oWorkPageContents,
                            usedVisualizations: {
                                nodes: this.aUsedVisualizations
                            }
                        }
                    }
                })
            });

            this.oWorkPageService.httpClient = {
                get: this.oGetStub
            };

            sandbox.stub(this.oWorkPageService, "_transformVizData").callsFake((aVizData) => {
                const aTransformedVizData = aVizData.map((oVizData) => {
                    return extend({}, oVizData, {
                        _siteData: {}
                    });
                });
                return Promise.resolve(aTransformedVizData);
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("calls the service with correct URI", function (assert) {
        const sPageId = "test-page-id";
        // Act
        return this.oWorkPageService.loadWorkPageAndVisualizations(sPageId).then(function () {
            // Assert
            const sExpectedQuery = `{
                workPage(
                    siteId: "test-site-id",
                    workPageId: "${sPageId}"
                    ) {
                        id,
                        contents,
                        editable,
                        usedVisualizations{
                            pageInfo{
                                endCursor,
                                hasNextPage
                            }
                            nodes{
                                id,
                                type,
                                descriptor{
                                    value
                                },
                                descriptorResources{
                                    baseUrl,
                                    descriptorPath
                                },
                                provider{
                                    id
                                },
                                indicatorDataSource{
                                    url,
                                    refreshInterval
                                }
                            }
                        }
                    }
                }`.replace(/\s\s+/g, "").replace(/\n/gm, ""); // trim spaces and new line

            const oUri = new URL(this.oGetStub.getCall(0).args[0], "http://host/");
            const sQueryParam = oUri.searchParams.get("query");
            assert.strictEqual(sQueryParam, sExpectedQuery, "The query parameter is set correctly.");
        }.bind(this));

    });

    QUnit.test("returns a correct string given all needed data with bFilterByDevice = true", function (assert) {

        const sSiteId = "test-site-id";
        const sPageId = "test-page-id";
        const oIncludeWorkPage = true;
        const sEndCursor = "1";
        const bUseIntentNavigation = false;
        const bFilterByDevice = true;

        const sExpectedQuery = `{
            workPage(
                siteId: "${sSiteId}",
                workPageId: "${sPageId}"
                ) {
                    id,
                    contents(queryInput: {filterWidgets: {
                                            visualization: {
                                                targetApp: {
                                                    deviceType: { eq: "desktop" },
                                                    launchType: { in: ["embedded", "standalone"] }
                                                }
                                            }
                                        }
                                    }
                                ),
                    editable,
                    usedVisualizations(after:"${sEndCursor}"){
                        pageInfo{
                            endCursor,
                            hasNextPage
                        }
                        nodes{
                            id,
                            type,
                            descriptor{
                                value
                            },
                            descriptorResources{
                                baseUrl,
                                descriptorPath
                            },
                            provider{
                                id
                            },
                            indicatorDataSource{
                                url,
                                refreshInterval
                            }
                        }
                    }
                }
            }`.replace(/\s\s+/g, "").replace(/\n/gm, "");

        const sQuery = this.oWorkPageService._createWorkPageQuery(sSiteId, sPageId, oIncludeWorkPage, sEndCursor, bUseIntentNavigation, bFilterByDevice);
        assert.equal(sQuery, sExpectedQuery, "returned correct query string");
    });

    QUnit.test("returns the expected data", function (assert) {
        // Act
        return this.oWorkPageService.loadWorkPageAndVisualizations("test-page-id").then(function (oData) {
            // Assert
            assert.deepEqual(oData, {
                workPage: {
                    editable: false,
                    usedVisualizations: {
                        nodes: [
                            { id: "a", _siteData: {} },
                            { id: "b", _siteData: {} },
                            { id: "c", _siteData: {} },
                            { id: "d", _siteData: {} }
                        ]
                    },
                    contents: {
                        test: "object"
                    }
                }
            }, "The data was returned as expected.");
        });

    });

    QUnit.test("Rejects if _doRequest fails", function (assert) {
        // Arrange
        this.oWorkPageService.httpClient = {
            get: sandbox.stub().rejects()
        };
        assert.expect(1);
        // Act
        return this.oWorkPageService.loadWorkPageAndVisualizations("test-site-id", "test-page-id").catch(function () {
            // Assert
            assert.ok(true, "Exception was caught");
        });
    });

    QUnit.module("loadWorkPageAndVisualizations with pagination", {
        beforeEach: function () {
            this.oConfigLastStub = sandbox.stub(Config, "last")
                .withArgs("/core/site/siteId")
                .returns("test-site-id");
            this.oConfigLastStub.withArgs("/core/workPages/contentApiUrl")
                .returns("/content-api/base");
            this.oWorkPageContents = {
                test: "object"
            };
            this.aUsedVisualizations = [
                { id: "0" },
                { id: "1" },
                { id: "2" },
                { id: "3" },
                { id: "4" },
                { id: "5" },
                { id: "6" },
                { id: "7" },
                { id: "8" },
                { id: "9" },
                { id: "10" },
                { id: "11" },
                { id: "12" },
                { id: "13" },
                { id: "14" },
                { id: "15" },
                { id: "16" },
                { id: "17" },
                { id: "18" },
                { id: "19" }
            ];
            this.oWorkPageService = new WorkPageService();

            this.oGetStub = sandbox.stub();

            this.oGetStub
                .onFirstCall()
                .resolves({
                    status: 200,
                    responseText: JSON.stringify({
                        data: {
                            workPage: {
                                contents: this.oWorkPageContents,
                                usedVisualizations: {
                                    nodes: this.aUsedVisualizations.slice(0, 10),
                                    pageInfo: {
                                        endCursor: "9",
                                        hasNextPage: true
                                    }
                                }
                            }
                        }
                    })
                })
                .onSecondCall()
                .resolves({
                    status: 200,
                    responseText: JSON.stringify({
                        data: {
                            workPage: {
                                contents: this.oWorkPageContents,
                                usedVisualizations: {
                                    nodes: this.aUsedVisualizations.slice(10, 20),
                                    pageInfo: {
                                        endCursor: null,
                                        hasNextPage: false
                                    }
                                }
                            }
                        }
                    })
                });

            this.oWorkPageService.httpClient = {
                get: this.oGetStub
            };

            sandbox.stub(this.oWorkPageService, "_transformVizData").callsFake((aVizData) => {
                const aTransformedVizData = aVizData.map((oVizData) => {
                    return extend({}, oVizData, {
                        _siteData: {}
                    });
                });
                return Promise.resolve(aTransformedVizData);
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("calls the service with correct URI", function (assert) {
        const sPageId = "test-page-id";
        // Act
        return this.oWorkPageService.loadWorkPageAndVisualizations(sPageId).then(function () {
            // Assert
            {
                // First Call
                const sExpectedQuery = `{
                workPage(
                    siteId: "test-site-id",
                    workPageId: "${sPageId}"
                    ) {
                        id,
                        contents,
                        editable,
                        usedVisualizations{
                            pageInfo{
                                endCursor,
                                hasNextPage
                            }
                            nodes{
                                id,
                                type,
                                descriptor{
                                    value
                                },
                                descriptorResources{
                                    baseUrl,
                                    descriptorPath
                                },
                                provider{
                                    id
                                },
                                indicatorDataSource{
                                    url,
                                    refreshInterval
                                }
                            }
                        }
                    }
                }`.replace(/\s\s+/g, "").replace(/\n/gm, ""); // trim spaces and new line
                const oUri = new URL(this.oGetStub.getCall(0).args[0], "http://host/");
                const sQueryParam = oUri.searchParams.get("query");

                assert.strictEqual(sQueryParam, sExpectedQuery, "The query parameter is set correctly.");
            }
            {
                // Second Call
                const sExpectedQuery = `{
                workPage(
                    siteId: "test-site-id",
                    workPageId: "${sPageId}"
                    ) {
                        usedVisualizations(after:"9"){
                            pageInfo{
                                endCursor,
                                hasNextPage
                            }
                            nodes{
                                id,
                                type,
                                descriptor{
                                    value
                                },
                                descriptorResources{
                                    baseUrl,
                                    descriptorPath
                                },
                                provider{
                                    id
                                },
                                indicatorDataSource{
                                    url,
                                    refreshInterval
                                }
                            }
                        }
                    }
                }`.replace(/\s\s+/g, "").replace(/\n/gm, ""); // trim spaces and new line
                const oUri = new URL(this.oGetStub.getCall(1).args[0], "http://host/");
                const sQueryParam = oUri.searchParams.get("query");

                assert.strictEqual(sQueryParam, sExpectedQuery, "The query parameter is set correctly.");
            }
        }.bind(this));

    });

    QUnit.test("returns the expected data", function (assert) {
        // Act
        return this.oWorkPageService.loadWorkPageAndVisualizations("test-page-id").then(function (oData) {

            // Assert
            assert.deepEqual(oData, {
                workPage: {
                    editable: false,
                    usedVisualizations: {
                        nodes: [
                            { id: "0", _siteData: {} },
                            { id: "1", _siteData: {} },
                            { id: "2", _siteData: {} },
                            { id: "3", _siteData: {} },
                            { id: "4", _siteData: {} },
                            { id: "5", _siteData: {} },
                            { id: "6", _siteData: {} },
                            { id: "7", _siteData: {} },
                            { id: "8", _siteData: {} },
                            { id: "9", _siteData: {} },
                            { id: "10", _siteData: {} },
                            { id: "11", _siteData: {} },
                            { id: "12", _siteData: {} },
                            { id: "13", _siteData: {} },
                            { id: "14", _siteData: {} },
                            { id: "15", _siteData: {} },
                            { id: "16", _siteData: {} },
                            { id: "17", _siteData: {} },
                            { id: "18", _siteData: {} },
                            { id: "19", _siteData: {} }
                        ]
                    },
                    contents: {
                        test: "object"
                    }
                }
            }, "The data was returned as expected.");
        });
    });

    // Order of these tests is important, you do not need to set up the stub again this way
    QUnit.test("Rejects if _doRequest fails onSecondCall", function (assert) {
        // Arrange
        this.oWorkPageService.httpClient = {
            get: sandbox.stub().onSecondCall().rejects()
        };
        assert.expect(1);
        // Act
        return this.oWorkPageService.loadWorkPageAndVisualizations("test-site-id", "test-page-id").catch(function () {
            // Assert
            assert.ok(true, "Exception was caught");
        });
    });

    QUnit.test("Rejects if _doRequest fails onFirstCall", function (assert) {
        // Arrange
        this.oWorkPageService.httpClient = {
            get: sandbox.stub().onFirstCall().rejects()
        };
        assert.expect(1);
        // Act
        return this.oWorkPageService.loadWorkPageAndVisualizations("test-site-id", "test-page-id").catch(function () {
            // Assert
            assert.ok(true, "Exception was caught");
        });
    });

    QUnit.module("_doRequest", {
        beforeEach: function () {
            this.oConfigLastStub = sandbox.stub(Config, "last")
                .withArgs("/core/workPages/contentApiUrl")
                .returns("/content-api/base");

            this.oWorkPageService = new WorkPageService();

            this.oResponseMock = {
                status: 200,
                responseText: JSON.stringify({
                    some: "test-data"
                })
            };
            this.oGetStub = sandbox.stub().resolves(this.oResponseMock);

            this.oWorkPageService.httpClient = {
                get: this.oGetStub
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });



    QUnit.test("URI is set correctly", function (assert) {
        // Act & Assert
        return this.oWorkPageService._doRequest("test-query").then(function () {
            var oUri = new URL(this.oGetStub.args[0][0], "http://host/");
            assert.strictEqual(oUri.pathname, "/content-api/base", "The path was set correctly.");
            assert.strictEqual(oUri.search, "?query=test-query", "The query was set correctly.");
        }.bind(this));
    });

    QUnit.test("Query and variables are set correctly", function (assert) {
        // Arrange
        const sVariables = JSON.stringify({
            top: 30,
            skip: 0,
            filter: [
                {
                    type: [
                        {
                            eq: "sap.ushell.StaticAppLauncher"
                        },
                        {
                            eq: "sap.ushell.DynamicAppLauncher"
                        }
                    ],
                    descriptor: [
                        {
                            conditions: [
                                {
                                    propertyPath: "/sap.app/title",
                                    stringFilter: [
                                        {
                                            containsIgnoreCase: "testSearch"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            conditions: [
                                {
                                    propertyPath: "/sap.app/subTitle",
                                    stringFilter: [
                                        {
                                            containsIgnoreCase: "testSearch"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            conditions: [
                                {
                                    propertyPath: "/sap.app/info",
                                    stringFilter: [
                                        {
                                            containsIgnoreCase: "testSearch"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            conditions: [
                                {
                                    propertyPath: "/sap.fiori/registrationIds",
                                    anyFilter: [
                                        {
                                            conditions: [
                                                {
                                                    stringFilter: [
                                                        {
                                                            containsIgnoreCase: "testSearch"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        const sExpectedQueryWithVariables = "?query=test-query&variables=%7B%22top%22%3A30%2C%22skip%22%3A0%2C%22filter%22%3A%5B%7B%22type%22%3A%5B%7B%22eq%22%3A%22sap.ushell.StaticAppLauncher" +
            "%22%7D%2C%7B%22eq%22%3A%22sap.ushell.DynamicAppLauncher%22%7D%5D%2C%22descriptor%22%3A%5B%7B%22conditions%22%3A%5B%7B%22propertyPath%22%3A%22%2Fsap.app%2Ftitle%22%2C%22stringFilter%" +
            "22%3A%5B%7B%22containsIgnoreCase%22%3A%22testSearch%22%7D%5D%7D%5D%7D%2C%7B%22conditions%22%3A%5B%7B%22propertyPath%22%3A%22%2Fsap.app%2FsubTitle%22%2C%22stringFilter%22%3A%5B%7B%22" +
            "containsIgnoreCase%22%3A%22testSearch%22%7D%5D%7D%5D%7D%2C%7B%22conditions%22%3A%5B%7B%22propertyPath%22%3A%22%2Fsap.app%2Finfo%22%2C%22stringFilter%22%3A%5B%7B%22containsIgnoreCase" +
            "%22%3A%22testSearch%22%7D%5D%7D%5D%7D%2C%7B%22conditions%22%3A%5B%7B%22propertyPath%22%3A%22%2Fsap.fiori%2FregistrationIds%22%2C%22anyFilter%22%3A%5B%7B%22conditions%22%3A%5B%7B%22" +
            "stringFilter%22%3A%5B%7B%22containsIgnoreCase%22%3A%22testSearch%22%7D%5D%7D%5D%7D%5D%7D%5D%7D%5D%7D%5D%7D";

        // Act & Assert
        return this.oWorkPageService._doRequest("test-query", sVariables).then(function () {
            var oUri = new URL(this.oGetStub.args[0][0], "http://host/");
            assert.strictEqual(oUri.pathname, "/content-api/base", "The path was set correctly.");
            assert.strictEqual(oUri.search, sExpectedQueryWithVariables, "The query and variables were set correctly.");
        }.bind(this));
    });

    QUnit.test("Headers are set correctly", function (assert) {
        // Act & Assert
        return this.oWorkPageService._doRequest("test-query").then(function () {
            var oHeaders = this.oGetStub.args[0][1].headers;
            assert.strictEqual(oHeaders.Accept, "application/json", "The Accept header was added correctly.");
            assert.strictEqual(oHeaders["Content-Type"], "application/json", "The Content-Type header was added correctly.");
            assert.strictEqual(oHeaders["Accept-Language"], Localization.getLanguageTag().toString(),
                "The Accept-Language header was added correctly.");
        }.bind(this));
    });

    QUnit.test("Resolves with the data", function (assert) {
        return this.oWorkPageService._doRequest("test-query").then(function (oResult) {
            assert.deepEqual(oResult, {
                some: "test-data"
            }, "The data was returned as expected");
        });
    });

    QUnit.test("Resolves with the data if status code is 200 and statusText is empty", function (assert) {
        return this.oWorkPageService._doRequest("test-query").then(function (oResult) {
            assert.deepEqual(oResult, {
                some: "test-data"
            }, "The data was returned as expected");
        });
    });

    QUnit.test("Resolves with the data if status code is 201 and statusText is empty", function (assert) {
        // Arrange
        this.oResponseMock.status = 201;
        this.oGetStub.resolves(this.oResponseMock);
        // Act
        return this.oWorkPageService._doRequest("test-query")
            .then(function (oResult) {
                // Assert
                assert.deepEqual(oResult, {
                    some: "test-data"
                }, "The data was returned as expected");
            });
    });

    QUnit.test("Rejects if statusCode is 404", function (assert) {
        // Arrange
        this.oWorkPageService.httpClient = {
            get: sandbox.stub().resolves({
                statusText: "Not Found",
                status: 404
            })
        };
        assert.expect(1);
        // Act
        return this.oWorkPageService._doRequest("test-query").catch(function (sError) {
            // Assert
            assert.strictEqual(sError, "HTTP request failed with status: 404 - Not Found", "The expected error was thrown");
        });
    });

    QUnit.test("Rejects if httpClient rejects", function (assert) {
        // Arrange
        this.oWorkPageService.httpClient = {
            get: sandbox.stub().rejects()
        };
        assert.expect(1);
        // Act
        return this.oWorkPageService._doRequest("test-query").catch(function (sError) {
            // Assert
            assert.ok(true, "An error was thrown");
        });
    });

    QUnit.module("_validateData", {
        beforeEach: function () {
            this.oWorkPageService = new WorkPageService();
        }
    });

    QUnit.test("Rejects the promise if the page data contains errors", function (assert) {
        return this.oWorkPageService._validateData({
            data: {
                workPage: {
                    ID: 1
                }
            },
            errors: [{
                message: "The WorkPage is not valid"
            }, {
                message: "The WorkPage data is outdated"
            }]
        }).then(function () {
            assert.ok(false, "The promise was resolved");
        }).catch(function (sError) {
            assert.ok(true, "The promise was rejected");
            assert.strictEqual(sError, "The WorkPage is not valid,\nThe WorkPage data is outdated");
        });
    });
    QUnit.test("Rejects the promise if the work page is null", function (assert) {
        // Arrange
        assert.expect(1);
        // Act
        return this.oWorkPageService._validateData({
            data: {
                workPage: null
            },
            errors: []
        }).catch(function (sError) {
            // Assert
            assert.ok(true, "The promise was rejected");
        });
    });

    QUnit.test("Resolves the promise if no errors exist and the Workpage is not null", function (assert) {
        return this.oWorkPageService._validateData({
            data: {
                workPage: {
                    ID: 1
                }
            },
            errors: []
        }).then(function () {
            assert.ok(true, "The promise was resolved");
        });
    });

    QUnit.module("_transformVizData", {
        beforeEach: function () {

            this.oCdmApplications = {
                "app-1": {},
                "app-2": {}
            };
            this.oCdmServiceStub = {
                getApplications: sandbox.stub().resolves(this.oCdmApplications)
            };

            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
            this.oGetServiceAsyncStub.withArgs("CommonDataModel").resolves(this.oCdmServiceStub);
            this.oWorkPageService = new WorkPageService();
            this.oSetApplicationPropertiesStub =
                sandbox.stub(this.oWorkPageService, "_setApplicationProperties").callsFake((oVizData) => {
                    const oExtendedVizData = extend({}, oVizData, {
                        _appProperties: "target app properties"
                    });
                    return Promise.resolve(oExtendedVizData);
                });
            this.oSetSmartBusinessTilesPropertiesStub = sandbox.stub(this.oWorkPageService, "_setSmartBusinessTilesProperties").callsFake((oVizData) => {
                const oExtendedVizData = extend({}, oVizData, {
                    _smartBusiness: "smartBusinessProperties"
                });
                return Promise.resolve(oExtendedVizData);
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    [{
        isFeatureFlagSmartBusinessEnabled: true,
        description: "with feature flag enableSmartBusiness is enabled"
    }, {
        isFeatureFlagSmartBusinessEnabled: false,
        description: "with feature flag enableSmartBusiness is disabled"
    }].forEach(function (oFeatureFlag) {
        QUnit.test("loads CommonDataModel service and calls _setApplicationProperties for all app launchers " + oFeatureFlag.description, function (assert) {
            var aVizData = [{
                id: "static-app-launcher-1",
                type: "sap.ushell.StaticAppLauncher"
            }, {
                id: "static-app-launcher-2",
                type: "sap.ushell.StaticAppLauncher"
            }, {
                id: "dynamic-app-launcher-1",
                type: "sap.ushell.DynamicAppLauncher"
            }, {
                id: "dynamic-app-launcher-2",
                type: "sap.ushell.DynamicAppLauncher"
            }, {
                type: "some.other.VizType"
            }
            ];

            this.oConfigLastStub = sandbox.stub(Config, "last")
                .withArgs("/core/workPages/enableSmartBusiness")
                .returns(oFeatureFlag.isFeatureFlagSmartBusinessEnabled);

            return this.oWorkPageService._transformVizData(aVizData).then(function (aResults) {
                assert.strictEqual(this.oGetServiceAsyncStub.callCount, 1, "Container.getServiceAsync was called exactly once");
                assert.strictEqual(this.oCdmServiceStub.getApplications.callCount, 1, "CommonDataModel.getApplications was called exactly once");
                assert.strictEqual(this.oSetApplicationPropertiesStub.callCount, 4, "_setApplicationProperties was called twice");
                assert.strictEqual(this.oSetSmartBusinessTilesPropertiesStub.callCount, 0, "_setSmartBusinessTilesProperties was not called");
                assert.strictEqual(this.oConfigLastStub.callCount, 1, "Config.last was called once");
                assert.deepEqual(this.oSetApplicationPropertiesStub.getCall(0).args, [{
                    id: "static-app-launcher-1",
                    type: "sap.ushell.StaticAppLauncher"
                }, this.oCdmApplications], "_setApplicationProperties was called with correct arguments");
                assert.deepEqual(this.oSetApplicationPropertiesStub.getCall(1).args, [{
                    id: "static-app-launcher-2",
                    type: "sap.ushell.StaticAppLauncher"
                }, this.oCdmApplications], "_setApplicationProperties was called with correct arguments");
                assert.deepEqual(this.oSetApplicationPropertiesStub.getCall(2).args, [{
                    id: "dynamic-app-launcher-1",
                    type: "sap.ushell.DynamicAppLauncher"
                }, this.oCdmApplications], "_setApplicationProperties was called with correct arguments");
                assert.deepEqual(this.oSetApplicationPropertiesStub.getCall(3).args, [{
                    id: "dynamic-app-launcher-2",
                    type: "sap.ushell.DynamicAppLauncher"
                }, this.oCdmApplications], "_setApplicationProperties was called with correct arguments");
                assert.deepEqual(
                    aResults,
                    [{
                        id: "static-app-launcher-1",
                        type: "sap.ushell.StaticAppLauncher",
                        _appProperties: "target app properties"
                    }, {
                        id: "static-app-launcher-2",
                        type: "sap.ushell.StaticAppLauncher",
                        _appProperties: "target app properties"
                    }, {
                        id: "dynamic-app-launcher-1",
                        type: "sap.ushell.DynamicAppLauncher",
                        _appProperties: "target app properties"
                    }, {
                        id: "dynamic-app-launcher-2",
                        type: "sap.ushell.DynamicAppLauncher",
                        _appProperties: "target app properties"
                    }, {
                        type: "some.other.VizType"
                    }],
                    "data transformation is correct");
            }.bind(this));
        });

        QUnit.test("does not load CommonDataModel service if vizData contains no standard App launchers or ssuite.smartbusiness.tiles.* " + oFeatureFlag.description, function (assert) {
            var aVizData = [{
                type: "sap.card"
            }, {
                type: "some.other.VizType"
            }
            ];

            this.oConfigLastStub = sandbox.stub(Config, "last")
                .withArgs("/core/workPages/enableSmartBusiness")
                .returns(oFeatureFlag.isFeatureFlagSmartBusinessEnabled);

            return this.oWorkPageService._transformVizData(aVizData).then(function (aResults) {
                assert.deepEqual(
                    aResults,
                    aVizData,
                    "returns unmodified viz data");
                assert.strictEqual(this.oGetServiceAsyncStub.callCount, 0,
                    "Container.getServiceAsync was not called");
                assert.strictEqual(this.oSetApplicationPropertiesStub.callCount, 0,
                    "_setApplicationProperties was not called");
                assert.strictEqual(this.oConfigLastStub.callCount, 2, "Config.last was called once");
                assert.strictEqual(this.oSetSmartBusinessTilesPropertiesStub.callCount, 0,
                    "_setSmartBusinessTilesProperties was not called");
            }.bind(this));
        });
    });

    QUnit.test("does not loads CommonDataModel service and calls _setSmartBusinessTilesProperties for ssuite.smartbusiness.tiles.*"
        + "with feature flag enableSmartBusiness is disabled", function (assert) {
            var aVizData = [{
                id: "smart-business-tile-01",
                type: "ssuite.smartbusiness.tiles.one"
            }, {
                id: "smart-business-tile-02",
                type: "ssuite.smartbusiness.tiles.two"
            }, {
                type: "some.other.VizType"
            }];

            this.oConfigLastStub = sandbox.stub(Config, "last")
                .withArgs("/core/workPages/enableSmartBusiness")
                .returns(false);

            return this.oWorkPageService._transformVizData(aVizData).then(function (aResults) {
                assert.strictEqual(this.oConfigLastStub.callCount, 3, "Config.last was called 3 times");
                assert.strictEqual(this.oGetServiceAsyncStub.callCount, 0,
                    "Container.getServiceAsync was not called");
                assert.strictEqual(this.oCdmServiceStub.getApplications.callCount, 0,
                    "CommonDataModel.getApplications was not called");
                assert.strictEqual(this.oSetApplicationPropertiesStub.callCount, 0,
                    "_setApplicationProperties was not called");
                assert.strictEqual(this.oSetSmartBusinessTilesPropertiesStub.callCount, 0,
                    "_setSmartBusinessTilesProperties was not called");
                    assert.deepEqual(
                        aResults,
                        aVizData,
                        "data was not transformed");
            }.bind(this));
    });

    QUnit.test("loads CommonDataModel service and calls _setSmartBusinessTilesProperties for ssuite.smartbusiness.tiles.*"
        + "with feature flag enableSmartBusiness is enabled", function (assert) {
            var aVizData = [{
                id: "smart-business-tile-01",
                type: "ssuite.smartbusiness.tiles.one"
            }, {
                id: "smart-business-tile-02",
                type: "ssuite.smartbusiness.tiles.two"
            }, {
                type: "some.other.VizType"
            }];

            this.oConfigLastStub = sandbox.stub(Config, "last")
                .withArgs("/core/workPages/enableSmartBusiness")
                .returns(true);

            return this.oWorkPageService._transformVizData(aVizData).then(function (aResults) {
                assert.strictEqual(this.oGetServiceAsyncStub.callCount, 1,
                    "Container.getServiceAsync was called exactly once");
                assert.strictEqual(this.oCdmServiceStub.getApplications.callCount, 1,
                    "CommonDataModel.getApplications was called exactly once");
                assert.strictEqual(this.oSetApplicationPropertiesStub.callCount, 0,
                    "_setApplicationProperties was not called");
                assert.strictEqual(this.oConfigLastStub.callCount, 4, "Config.last was called 4 times");
                assert.strictEqual(this.oSetSmartBusinessTilesPropertiesStub.callCount, 2,
                    "_setSmartBusinessTilesProperties was called 2 times");
                    assert.deepEqual(
                        aResults,
                        [{
                            id: "smart-business-tile-01",
                            type: "ssuite.smartbusiness.tiles.one",
                             _smartBusiness: "smartBusinessProperties"
                        }, {
                            id: "smart-business-tile-02",
                            type: "ssuite.smartbusiness.tiles.two",
                             _smartBusiness: "smartBusinessProperties"
                        }, {
                            type: "some.other.VizType"
                        }],
                        "data transformation is correct");
            }.bind(this));
    });

    QUnit.module("_isSmartBusinessVizType", {
        beforeEach: function () {
            this.oWorkPageService = new WorkPageService();
        },

        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("returns true for ssuite.smartbusiness.tiles.* if feature flag enabled and false for other types", function (assert) {
        this.oConfigLastStub = sandbox.stub(Config, "last")
            .withArgs("/core/workPages/enableSmartBusiness")
            .returns(true);

        assert.strictEqual(this.oWorkPageService._isSmartBusinessVizType({type: "ssuite.smartbusiness.tiles.one"}), true);
        assert.strictEqual(this.oWorkPageService._isSmartBusinessVizType({type: "ssuite.smartbusiness.tiles"}), false);
        assert.strictEqual(this.oWorkPageService._isSmartBusinessVizType({type: "any.type"}), false);
    });

    QUnit.test("returns false for all types if feature flag disabled", function (assert) {
        this.oConfigLastStub = sandbox.stub(Config, "last")
            .withArgs("/core/workPages/enableSmartBusiness")
            .returns(false);

        assert.strictEqual(this.oWorkPageService._isSmartBusinessVizType({type: "ssuite.smartbusiness.tiles.one"}), false);
        assert.strictEqual(this.oWorkPageService._isSmartBusinessVizType({type: "any.type"}), false);
    });

    QUnit.module("_setApplicationProperties", {
        beforeEach: function () {

            this.oApplications = {
                "app-1": {
                    "sap.app": {
                        contentProviderId: "test-content-provider",
                        dataSources: {
                            "dataSource-1": {
                                uri: "/app/service-uri"
                            }
                        },
                        crossNavigation: {
                            inbounds: {
                                "inbound-1": {
                                    semanticObject: "SemanticObject",
                                    action: "action"
                                }
                            }
                        }
                    }
                },
                "app-2": {}
            };

            this.oReadUtilsGetContentProviderLabelStub = sandbox.stub(readUtils, "getContentProviderLabel")
                .withArgs("test-content-provider")
                .resolves("Test Content Provider Label");
            this.oWorkPageService = new WorkPageService();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("sets the target and targetURL properties", async function (assert) {
        const oVizData = {
            id: "viz-1",
            type: "sap.ushell.StaticAppLauncher",
            descriptor: {
                value: {
                    "sap.flp": {
                        target: {
                            type: "IBN",
                            appId: "app-1",
                            inboundId: "inbound-1",
                            parameters: {
                                "param-from-viz": {
                                    value: "value",
                                    format: "plain"
                                }
                            }
                        }
                    }
                }
            }
        };
        // Act
        const oVizDataWithApplicationProperties = await this.oWorkPageService._setApplicationProperties(oVizData, this.oApplications);

        // Assert
        assert.deepEqual(oVizDataWithApplicationProperties._siteData.target, {
            type: "IBN",
            appId: "app-1",
            inboundId: "inbound-1",
            parameters: {
                "param-from-viz": {
                    value: {
                        format: "plain",
                        value: "value"
                    }
                },
                "sap-ui-app-id-hint": {
                    value: {
                        format: "plain",
                        value: "app-1"
                    }
                }
            }
        }, "target is set correctly");
        assert.strictEqual(oVizDataWithApplicationProperties._siteData.targetURL,
            "#SemanticObject-action?param-from-viz=value&sap-ui-app-id-hint=app-1", "targetURL is set correctly");
    });

    QUnit.test("sets the target & targetURL properties from content api when intentNavigation config is true", async function (assert) {
        const oVizData = {
            id: "viz-1",
            type: "sap.ushell.StaticAppLauncher",
            descriptor: {
                value: {
                    "sap.flp": {
                        target: {
                            type: "IBN",
                            appId: "app-1",
                            inboundId: "inbound-1",
                            parameters: {
                                "param-from-viz": {
                                    value: "param-value-1",
                                    format: "plain"
                                }
                            }
                        }
                    }
                }
            },
            targetAppIntent: {
                semanticObject: "SemanticObject",
                action: "action",
                businessAppId: "app-1"
            }
        };

        this.oConfigLastStub = sandbox.stub(Config, "last")
            .withArgs("/core/shell/intentNavigation")
            .returns(true);

        // Act
        const oVizDataWithApplicationProperties = await this.oWorkPageService._setApplicationProperties(oVizData, this.oApplications);

        // Assert
        assert.deepEqual(oVizDataWithApplicationProperties.target, {
            type: "IBN",
            appId: "app-1",
            inboundId: "inbound-1",
            parameters: {
                "param-from-viz": {
                    value: {
                        format: "plain",
                        value: "param-value-1"
                    }
                },
                "sap-ui-app-id-hint": {
                    value: {
                        format: "plain",
                        value: "app-1"
                    }
                }
            }
        }, "target is set correctly");
        assert.strictEqual(oVizDataWithApplicationProperties.targetURL,
            "#SemanticObject-action?param-from-viz=param-value-1&sap-ui-app-id-hint=app-1", "targetURL is set correctly");
    });

    QUnit.test("sets the indicator data source from the application if it can be resolved", async function (assert) {
        const oVizData = {
            id: "viz-1",
            type: "sap.ushell.DynamicAppLauncher",
            descriptor: {
                value: {
                    "sap.app": {
                        dataSources: {
                            "dataSource-1": {
                                uri: "/viz/service-uri"
                            }
                        }
                    },
                    "sap.flp": {
                        target: {
                            type: "IBN",
                            appId: "app-1"
                        },
                        indicatorDataSource: {
                            dataSource: "dataSource-1"
                        }
                    }
                }
            }
        };

        // Act
        const oVizDataWithReplacedIndicatorDataSource = await this.oWorkPageService._setApplicationProperties(oVizData, this.oApplications);

        // Assert
        const oDataSource = ObjectPath.get(["_siteData", "dataSource"], oVizDataWithReplacedIndicatorDataSource);
        assert.deepEqual(oDataSource, {
            uri: "/app/service-uri"
        }, "app data source is set correctly");
    });

    QUnit.test("sets the content provider id and label from the application if it can be resolved", async function (assert) {
        const oVizData = {
            id: "viz-1",
            type: "sap.ushell.StaticAppLauncher",
            descriptor: {
                value: {
                    "sap.flp": {
                        target: {
                            type: "IBN",
                            appId: "app-1"
                        }
                    }
                }
            }
        };

        // Act
        const oVizDataWithApplicationProperties = await this.oWorkPageService._setApplicationProperties(oVizData, this.oApplications);

        // Assert
        assert.strictEqual(oVizDataWithApplicationProperties._siteData.contentProviderId, "test-content-provider",
            "contentProviderId is set correctly");
        assert.strictEqual(this.oReadUtilsGetContentProviderLabelStub.callCount, 1, "readUtils.getContentProviderLabel was called once.");
        assert.strictEqual(oVizDataWithApplicationProperties._siteData.contentProviderLabel, "Test Content Provider Label",
            "contentProviderLabel is set correctly");
    });

    QUnit.module("_setSmartBusinessTilesProperties", {
        beforeEach: function () {
            this.oCdmVizTypes = {
                "viz-1": {},
                "viz-2": {}
            };
            this.oCdmServiceStub = {
                getVizTypes: sandbox.stub().resolves(this.oCdmVizTypes)
            };
            this.oWorkPageService = new WorkPageService();
        },

        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("sets the smart business properties", async function (assert) {
        const oVizData = {
            id: "viz-1",
            type: "ssuite.smartbusiness.tiles.one",
            descriptor: {
                value: "descriptor-value"
            }
        };

        const oSite = {
            vizTypes: this.oCdmVizTypes,
            visualizations: {
                "viz-1": {
                    vizType: oVizData,
                    vizConfig: "descriptor-value"
                }
            }
        };
        const oVizReference = {
            id: "random-uid",
            vizId: "viz-1",
            vizType: "ssuite.smartbusiness.tiles.one"
        };
        const oSMBVizData = {
            _instantiationData: {
                type: "ssuite.smartbusiness.tiles.one"
            },
            vizConfig: "vizConfig"
        };

        this.oReadUtilsGetVizData = sandbox.stub(readUtils, "getVizData").callsFake(() => {
            return Promise.resolve(oSMBVizData);
        });

        const oResult = await this.oWorkPageService._setSmartBusinessTilesProperties(oVizData, this.oCdmServiceStub);

        assert.strictEqual(this.oCdmServiceStub.getVizTypes.callCount, 1, "getVizTypes was called once.");
        assert.strictEqual(this.oReadUtilsGetVizData.callCount, 1, "readUtils.getVizData was called once.");
        assert.deepEqual(this.oReadUtilsGetVizData.getCall(0).args[0], oSite, "readUtils.getVizData was called with the correct arguments.");
        // Cannot think of how to stub uid package, so i'm just expecting the correct vizId
        assert.strictEqual(this.oReadUtilsGetVizData.getCall(0).args[1].vizId, oVizReference.vizId, "readUtils.getVizData was called with the correct arguments 2nd argument with vizId.");
        assert.deepEqual(oResult,
            {
              _siteData: {
                _instantiationData: {
                  type: "ssuite.smartbusiness.tiles.one"
                },
                vizConfig: "vizConfig"
              },
              descriptor: {
                value: "vizConfig"
              },
              id: "viz-1",
              type: "ssuite.smartbusiness.tiles.one"
            },
            "smartBusinessProperties is set correctly");
    });

    QUnit.module("loadVisualizations", {
        beforeEach: function () {
            this.oWorkPageService = new WorkPageService();

            this.oWorkPageService._sSiteId = "123-test-site-id-321";

            this.oVizData = {
                data: {
                    visualizations: {
                        nodes: [
                            { id: "viz-0" },
                            { id: "viz-1" },
                            { id: "viz-2" },
                            { id: "viz-3" },
                            { id: "viz-4" },
                            { id: "viz-5" }
                        ]
                    },
                    totalCount: 512
                }
            };

            this.oDoRequestStub = sandbox.stub(this.oWorkPageService, "_doRequest").resolves(this.oVizData);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("calls _doRequest with the expected query", function (assert) {
        // Arrange
        const bFilterByDevice = false;
        this.oFilterParams = {
            top: 30,
            skip: 0,
            filter: [
                {
                    type: [
                        {
                            eq: "sap.ushell.StaticAppLauncher"
                        },
                        {
                            eq: "sap.ushell.DynamicAppLauncher"
                        }
                    ],
                    descriptor: [
                        {
                            conditions: [
                                {
                                    propertyPath: "/sap.app/title",
                                    stringFilter: [
                                        {
                                            containsIgnoreCase: "testSearch"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            conditions: [
                                {
                                    propertyPath: "/sap.app/subTitle",
                                    stringFilter: [
                                        {
                                            containsIgnoreCase: "testSearch"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            conditions: [
                                {
                                    propertyPath: "/sap.app/info",
                                    stringFilter: [
                                        {
                                            containsIgnoreCase: "testSearch"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            conditions: [
                                {
                                    propertyPath: "/sap.fiori/registrationIds",
                                    anyFilter: [
                                        {
                                            conditions: [
                                                {
                                                    stringFilter: [
                                                        {
                                                            containsIgnoreCase: "testSearch"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        let sExpectedQuery = `
        visualizations($queryInput: QueryVisualizationsInput) {
            visualizations(queryInput: $queryInput, siteId: "123-test-site-id-321") {
                totalCount,
                nodes {
                    id,
                    type,
                    descriptor {
                        value,
                        schemaVersion
                    },
                    descriptorResources {
                        baseUrl,
                        descriptorPath
                    },
                    indicatorDataSource {
                        url,
                        refreshInterval
                    },
                    targetAppIntent {
                        semanticObject,
                        action,
                        businessAppId
                    },
                    systemLabel
                }
            }
        }`;

        // Replace line breaks and spaces
        sExpectedQuery = sExpectedQuery
            .replace(/\n/g, "")
            .replace(/ /g, "");

        sExpectedQuery = `query ${sExpectedQuery}`;


        const sExpectedVariables = "{\"queryInput\":{\"top\":30,\"skip\":0,\"filter\":[{\"type\":[{\"eq\":\"sap.ushell.StaticAppLauncher\"},{\"eq\":\"sap.ushell.Dyna" +
            "micAppLauncher\"}],\"descriptor\":[{\"conditions\":[{\"propertyPath\":\"/sap.app/title\",\"stringFilter\":[{\"containsIgnoreCase\":\"testSearch\"}]}]},{\"conditi" +
            "ons\":[{\"propertyPath\":\"/sap.app/subTitle\",\"stringFilter\":[{\"containsIgnoreCase\":\"testSearch\"}]}]},{\"conditions\":[{\"propertyPath\":\"/sap.app" +
            "/info\",\"stringFilter\":[{\"containsIgnoreCase\":\"testSearch\"}]}]},{\"conditions\":[{\"propertyPath\":\"/sap.fiori/registrationIds\",\"anyFilter\":[{\"con" +
            "ditions\":[{\"stringFilter\":[{\"containsIgnoreCase\":\"testSearch\"}]}]}]}]}]}]}}";

        // Act
        return this.oWorkPageService.loadVisualizations(this.oFilterParams, bFilterByDevice).then((oResult) => {
            assert.ok(this.oDoRequestStub.calledOnce, "_doRequest was called once.");
            assert.strictEqual(this.oDoRequestStub.firstCall.args[0], sExpectedQuery, "_doRequest was called with the expected arguments.");
            assert.strictEqual(this.oDoRequestStub.firstCall.args[1], sExpectedVariables, "_doRequest was called with the expected arguments.");

            assert.deepEqual(oResult, {
                visualizations: {
                    nodes: [
                        { id: "viz-0" },
                        { id: "viz-1" },
                        { id: "viz-2" },
                        { id: "viz-3" },
                        { id: "viz-4" },
                        { id: "viz-5" }
                    ]
                },
                totalCount: 512
            }, "The function call had the expected result.");
        });
    });

    QUnit.test("calls _doRequest with the expected query with bFilterByDevice", function (assert) {
        // Arrange
        const bFilterByDevice = true;
        this.oFilterParams = {
            top: 30,
            skip: 0,
            filter: [
                {
                    type: [
                        {
                            eq: "sap.ushell.StaticAppLauncher"
                        },
                        {
                            eq: "sap.ushell.DynamicAppLauncher"
                        }
                    ],
                    descriptor: [
                        {
                            conditions: [
                                {
                                    propertyPath: "/sap.app/title",
                                    stringFilter: [
                                        {
                                            containsIgnoreCase: "testSearch"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            conditions: [
                                {
                                    propertyPath: "/sap.app/subTitle",
                                    stringFilter: [
                                        {
                                            containsIgnoreCase: "testSearch"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            conditions: [
                                {
                                    propertyPath: "/sap.app/info",
                                    stringFilter: [
                                        {
                                            containsIgnoreCase: "testSearch"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            conditions: [
                                {
                                    propertyPath: "/sap.fiori/registrationIds",
                                    anyFilter: [
                                        {
                                            conditions: [
                                                {
                                                    stringFilter: [
                                                        {
                                                            containsIgnoreCase: "testSearch"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        let sExpectedQuery = `
        visualizations($queryInput: QueryVisualizationsInput) {
            visualizations(queryInput: $queryInput, siteId: "123-test-site-id-321") {
                totalCount,
                nodes {
                    id,
                    type,
                    descriptor {
                        value,
                        schemaVersion
                    },
                    descriptorResources {
                        baseUrl,
                        descriptorPath
                    },
                    indicatorDataSource {
                        url,
                        refreshInterval
                    },
                    targetAppIntent {
                        semanticObject,
                        action,
                        businessAppId
                    },
                    systemLabel
                }
            }
        }`;

        // Replace line breaks and spaces
        sExpectedQuery = sExpectedQuery
            .replace(/\n/g, "")
            .replace(/ /g, "");

        sExpectedQuery = `query ${sExpectedQuery}`;


        const sExpectedVariables = `{
            "queryInput":{"top":30,"skip":0,
            "filter":[{
                "type":[
                    {"eq":"sap.ushell.StaticAppLauncher"},
                    {"eq":"sap.ushell.DynamicAppLauncher"}],
                "descriptor":[
                    {"conditions":[{"propertyPath":"/sap.app/title","stringFilter":[{"containsIgnoreCase":"testSearch"}]}]},
                    {"conditions":[{"propertyPath":"/sap.app/subTitle","stringFilter":[{"containsIgnoreCase":"testSearch"}]}]},
                    {"conditions":[{"propertyPath":"/sap.app/info","stringFilter":[{"containsIgnoreCase":"testSearch"}]}]},
                    {"conditions":[{"propertyPath":"/sap.fiori/registrationIds","anyFilter":[{"conditions":[{"stringFilter":[{"containsIgnoreCase":"testSearch"}]}]}]}]}
                ],
                "targetApp":{"deviceType":{"eq":"desktop"},
                "launchType":{"in":["embedded","standalone"]}}}]}}`.replace(/\s\s+/g, "").replace(/\n/gm, "");

        // Act
        return this.oWorkPageService.loadVisualizations(this.oFilterParams, bFilterByDevice).then((oResult) => {
            assert.ok(this.oDoRequestStub.calledOnce, "_doRequest was called once.");
            assert.strictEqual(this.oDoRequestStub.firstCall.args[0], sExpectedQuery, "_doRequest was called with the expected arguments.");
            assert.strictEqual(this.oDoRequestStub.firstCall.args[1], sExpectedVariables, "_doRequest was called with the expected arguments.");

            assert.deepEqual(oResult, {
                visualizations: {
                    nodes: [
                        { id: "viz-0" },
                        { id: "viz-1" },
                        { id: "viz-2" },
                        { id: "viz-3" },
                        { id: "viz-4" },
                        { id: "viz-5" }
                    ]
                },
                totalCount: 512
            }, "The function call had the expected result.");
        });
    });

});
