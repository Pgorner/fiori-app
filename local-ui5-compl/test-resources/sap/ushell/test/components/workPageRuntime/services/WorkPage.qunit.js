// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.workPageRuntime.services.WorkPage
 */
sap.ui.define([
    "sap/base/i18n/Localization",
    "sap/ushell/components/workPageRuntime/services/WorkPage"
], function (
    Localization,
    WorkPageService
) {
    "use strict";
    /* global sinon QUnit */

    var sandbox = sinon.createSandbox({});

    QUnit.module("WorkPages Service", {
        beforeEach: function () {
            this.oWorkPageService = new WorkPageService();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });
    QUnit.test("instantiation works", function (assert) {
        assert.ok(this.oWorkPageService, "The service was instantiated.");
    });

    QUnit.module("loadWorkPageAndVisualizations", {
        beforeEach: function () {
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
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("returns the expected data", function (assert) {
        // Act
        return this.oWorkPageService.loadWorkPageAndVisualizations("test-site-id", "test-page-id").then(function (oData) {
            // Assert
            assert.deepEqual(oData, {
                workPage: {
                    editable: false,
                    usedVisualizations: {
                        nodes: [
                            { id: "a" },
                            { id: "b" },
                            { id: "c" },
                            { id: "d" }
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

    QUnit.module("_doRequest", {
        beforeEach: function () {
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

});
