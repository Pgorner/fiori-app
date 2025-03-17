// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/Supportability",
    "sap/ushell/utils/HttpClient",
    "sap/ui/thirdparty/URI",
    "sap/ushell/utils"
], function (Supportability, HttpClient, URI, utils) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox();

    QUnit.module("The constructor");

    QUnit.test("Sets the correct absolute base path & request options", function (assert) {
        // Act
        var oClient = new HttpClient("/basePath/", {
            headers: { "Content-Type": "application/json" }
        });

        // Assert
        assert.ok(oClient._oBasePath instanceof URI, "The constructor instantiates the base path as an URI.");
        assert.strictEqual(oClient._oBasePath.href(), "/basePath/", "The constructor set the correct base path.");

        var oExpectedHeaders = {
            "Content-Type": "application/json"
        };
        assert.deepEqual(oClient._oDefaultOptions.headers, oExpectedHeaders, "The constructor sets the correct headers.");
    });

    QUnit.test("Sets the correct absolute base path without request options", function (assert) {
        // Act
        var oClient = new HttpClient("https://s4hana.ondemand.sap.com/basePath/");

        // Assert
        assert.ok(oClient._oBasePath instanceof URI, "The constructor instantiates the base path as an URI.");
        assert.strictEqual(oClient._oBasePath.href(), "https://s4hana.ondemand.sap.com/basePath/", "The constructor sets the correct base path.");
        assert.deepEqual(oClient._oDefaultOptions.headers, {}, "The constructor sets the correct headers.");
    });

    QUnit.test("Sets the correct request options without a base path", function (assert) {
        // Act
        var oClient = new HttpClient({
            headers: { "Content-Type": "application/json" }
        });

        // Assert
        assert.strictEqual(oClient._oBasePath, undefined, "The constructor sets the base path to undefined.");

        var oExpectedHeaders = {
            "Content-Type": "application/json"
        };
        assert.deepEqual(oClient._oDefaultOptions.headers, oExpectedHeaders, "The constructor sets the correct headers.");
    });

    QUnit.test("Sets the correct default base path & request options if non are provided", function (assert) {
        // Act
        var oClient = new HttpClient();

        // Assert
        assert.strictEqual(oClient._oBasePath, undefined, "The constructor sets the base path to undefined.");
        assert.deepEqual(oClient._oDefaultOptions.headers, {}, "The constructor sets the correct headers.");
    });

    QUnit.module("The function _executeRequest", {
        beforeEach: function () {
            this.oFakeServer = sinon.createFakeServer({
                respondImmediately: true
            });
            this.oFakeServer.respondWith([200, {}, "<responseText>OK</responseText>"]);

            this.oGetStatisticsEnabled = sandbox.stub(Supportability, "isStatisticsEnabled").returns(false);

            this.oHttpClient = new HttpClient("/basePath/", {
                headers: { "Content-Type": "application/json;charset=utf-8" }
            });

            this.oOnLoadStub = sandbox.stub(this.oHttpClient, "_onLoad").callsFake(function (resolve) {
                resolve();
            });

            this.oGetFormattedResponseStub = sandbox.stub(this.oHttpClient, "_getFormattedResponse").callsFake(function (oXhr) {
                return { responseText: oXhr.responseText };
            });

            this.oGenerateUniqueIdStub = sandbox.stub(utils, "generateUniqueId").returns("requestId");

            this.oGetCSRFTokenHeaderStub = sandbox.stub(this.oHttpClient, "_getCSRFTokenHeader");
            this.oGetCSRFTokenHeaderStub.resolves({});
        },
        afterEach: function () {
            this.oFakeServer.restore();
            sandbox.restore();
        }
    });

    QUnit.test("Sends an XHR request to the correct URL using the specified HTTP method", function (assert) {
        // Act
        return Promise.all([

            this.oHttpClient._executeRequest("GET", "/resource1"),
            this.oHttpClient._executeRequest("PUT", "/resource1?query=some,data"),
            this.oHttpClient._executeRequest("PUT", "/resource1#Hash&/some,special$§?\\characters/@üö"),
            this.oHttpClient._executeRequest("POST", "/resource1/$count"),
            this.oHttpClient._executeRequest("GET", "/resource1/SalesOrder('11224')"),
            this.oHttpClient._executeRequest("PATCH", "/resource1/resource2"),
            this.oHttpClient._executeRequest("DELETE", "/resource1/"),
            this.oHttpClient._executeRequest("OPTIONS", "resource1/resource2"),
            this.oHttpClient._executeRequest("OPTIONS", "resource1?query=search#Hash"),
            this.oHttpClient._executeRequest("GET", "https://sap.com/")
        ]).then(function () {
            // Assert
            var aRequests = this.oFakeServer.requests;
            assert.strictEqual(aRequests.length, 10, "An XHR request was performed ten times.");
            assert.strictEqual(aRequests[0].method, "GET", "The function sends an XHR request using the correct HTTP method.");
            assert.strictEqual(aRequests[0].url, "/resource1", "The function sends an XHR request to /resource1.");
            assert.strictEqual(aRequests[1].method, "PUT", "The function sends an XHR request using the correct HTTP method.");
            assert.strictEqual(aRequests[1].url, "/resource1?query=some,data", "The function sends an XHR request to /resource1?query=some,data.");
            assert.strictEqual(aRequests[2].method, "PUT", "The function sends an XHR request using the correct HTTP method.");
            assert.strictEqual(aRequests[2].url, "/resource1#Hash&/some,special$§?\\characters/@üö", "The function sends an XHR request to /resource1#Hash&/some,special$§?\\characters/@üö.");
            assert.strictEqual(aRequests[3].method, "POST", "The function sends an XHR request using the correct HTTP method.");
            assert.strictEqual(aRequests[3].url, "/resource1/$count", "The function sends an XHR request to /resource1/$count.");
            assert.strictEqual(aRequests[4].method, "GET", "The function sends an XHR request using the correct HTTP method.");
            assert.strictEqual(aRequests[4].url, "/resource1/SalesOrder('11224')", "The function sends an XHR request to /resource1/SalesOrder('11224').");
            assert.strictEqual(aRequests[5].method, "PATCH", "The function sends an XHR request using the correct HTTP method.");
            assert.strictEqual(aRequests[5].url, "/resource1/resource2", "The function sends an XHR request to /resource1/resource2.");
            assert.strictEqual(aRequests[6].method, "DELETE", "The function sends an XHR request using the correct HTTP method.");
            assert.strictEqual(aRequests[6].url, "/resource1/", "The function sends an XHR request to /resource1/.");
            assert.strictEqual(aRequests[7].method, "OPTIONS", "The function sends an XHR request using the correct HTTP method.");
            assert.strictEqual(aRequests[7].url, "/basePath/resource1/resource2", "The function sends an XHR request to /basePath/resource1/resource2.");
            assert.strictEqual(aRequests[8].method, "OPTIONS", "The function sends an XHR request using the correct HTTP method.");
            assert.strictEqual(aRequests[8].url, "/basePath/resource1?query=search#Hash", "The function sends an XHR request to /basePath/resource1?query=search#Hash.");
            assert.strictEqual(aRequests[9].method, "GET", "The function sends an XHR request using the correct HTTP method.");
            assert.strictEqual(aRequests[9].url, "https://sap.com/", "The function sends an XHR request to an external server (CORS).");
        }.bind(this));
    });

    QUnit.test("Sets the resource URL absolute to the base path only if it exists", function (assert) {
        // Arrange
        delete this.oHttpClient._oBasePath;

        // Act
        return this.oHttpClient._executeRequest("GET", "resource1").then(function () {
            // Assert
            assert.strictEqual(this.oFakeServer.requests[0].url, "resource1", "The request was performed with the correct URL.");
        }.bind(this));
    });

    QUnit.test("Rejects the promise if the provided resource path is undefined", function (assert) {
        // Act
        return this.oHttpClient._executeRequest("GET", undefined).catch(function (error) {
            // Assert
            assert.strictEqual(error.message, "The provided resource path is not a valid URL.", "The function rejects the promise with the correct error message.");
        });
    });

    QUnit.test("Rejects the promise if the provided resource path is not a valid URL", function (assert) {
        // Act
        return this.oHttpClient._executeRequest("GET", "mailto:info@sap.com").catch(function (error) {
            // Assert
            assert.strictEqual(error.message, "The provided resource path is not a valid URL.", "The function rejects the promise with the correct error message.");
        });
    });

    QUnit.test("Sends an XHR request with additional request headers", function (assert) {
        // Arrange
        var oAdditionalHeaders = {
            Accept: "application/json;charset=utf-8",
            Authorization: "Bearer token"
        };

        // Act
        return this.oHttpClient._executeRequest("GET", "$count", { headers: oAdditionalHeaders }).then(function () {
            var oExpectedHeaders = {
                "Content-Type": "application/json;charset=utf-8",
                Accept: "application/json;charset=utf-8",
                Authorization: "Bearer token"
            };

            // Assert
            assert.deepEqual(this.oFakeServer.requests[0].requestHeaders, oExpectedHeaders, "The function adds additional headers to the request.");
        }.bind(this));
    });

    QUnit.test("Sends an XHR request overwriting the default request headers", function (assert) {
        // Arrange
        var oCustomHeaders = {
            "Content-Type": "text/html;charset=utf-8",
            Authorization: "Bearer token"
        };

        // Act
        return this.oHttpClient._executeRequest("GET", "$count", { headers: oCustomHeaders }).then(function () {
            var oExpectedHeaders = {
                "Content-Type": "text/html;charset=utf-8",
                Authorization: "Bearer token"
            };

            // Assert
            assert.deepEqual(this.oFakeServer.requests[0].requestHeaders, oExpectedHeaders, "The function overwrites a default header and adds an additional custom header to the request.");
        }.bind(this));
    });

    QUnit.test("Adds the sap-statistics header to the request if sap-statistics is enabled", function (assert) {
        // Arrange
        this.oGetStatisticsEnabled.returns(true);

        // Act
        return this.oHttpClient._executeRequest("GET", "$count").then(function () {
            var oExpectedHeaders = {
                "Content-Type": "application/json;charset=utf-8",
                "sap-statistics": true
            };

            // Assert
            assert.deepEqual(this.oFakeServer.requests[0].requestHeaders, oExpectedHeaders, "The function adds the correct headers to the request headers.");
        }.bind(this));
    });

    QUnit.test("sap-statistics header can be overwritten by request", function (assert) {
        // Arrange
        this.oGetStatisticsEnabled.returns(true);
        var oRequestData = {
            headers: {
                "sap-statistics": false
            }
        };

        // Act
        return this.oHttpClient._executeRequest("GET", "$count", oRequestData).then(function () {
            var oExpectedHeaders = {
                "Content-Type": "application/json;charset=utf-8",
                "sap-statistics": false
            };

            // Assert
            assert.deepEqual(this.oFakeServer.requests[0].requestHeaders, oExpectedHeaders, "The function adds the correct headers to the request headers.");
        }.bind(this));
    });

    QUnit.test("Adds the x-csrf-token header to the request if a token exists", function (assert) {
        // Arrange
        this.oGetCSRFTokenHeaderStub.resolves({
            "x-csrf-token": "Token1234"
        });

        // Act
        return this.oHttpClient._executeRequest("GET", "$count").then(function () {
            var oExpectedHeaders = {
                "Content-Type": "application/json;charset=utf-8",
                "x-csrf-token": "Token1234"
            };

            // Assert
            assert.strictEqual(this.oGetCSRFTokenHeaderStub.callCount, 1, "The function gets the required x-csrf-token header value by calling _getCSRFTokenHeader once.");
            assert.deepEqual(this.oFakeServer.requests[0].requestHeaders, oExpectedHeaders, "The function adds the x-csrf-token header to the request headers.");
        }.bind(this));
    });

    QUnit.test("Sends an XHR request with the correct request body", function (assert) {
        // Arrange
        var oRequestData = {
            headers: {},
            data: {
                customerName: "SAP SE",
                shippingDate: "20201204",
                industry: "Digital Intelligence",
                isShipped: true
            }
        };
        // Act
        return this.oHttpClient._executeRequest("POST", "SalesOrder('')", oRequestData).then(function () {
            var sExpectedRequestBody = JSON.stringify({
                customerName: "SAP SE",
                shippingDate: "20201204",
                industry: "Digital Intelligence",
                isShipped: true
            });

            // Assert
            assert.deepEqual(this.oFakeServer.requests[0].requestBody, sExpectedRequestBody, "The function adds the correct request body to the XHR request.");
        }.bind(this));
    });

    QUnit.test("Sends an XHR request with the correct request body if the provided data is a string", function (assert) {
        // Arrange
        var oRequestData = {
            headers: {},
            data: "Lorem ipsum"
        };
        // Act
        return this.oHttpClient._executeRequest("POST", "SalesOrder('')", oRequestData).then(function () {
            // Assert
            assert.deepEqual(this.oFakeServer.requests[0].requestBody, "Lorem ipsum", "The function adds the correct request body to the XHR request.");
        }.bind(this));
    });

    QUnit.test("Rejects the promise with the correct error if the request was not successful", function (assert) {
        // Arrange
        this.oFakeServer.respondImmediately = false;
        this.oFakeServer.autoError = true;

        // Act
        var oRequestPromise = this.oHttpClient._executeRequest("GET", "SalesOrder('1243')");

        setTimeout(function () {
            this.oFakeServer.requests[0].error();
        }.bind(this), 0);

        // Assert
        return oRequestPromise.catch(function (oError) {
            assert.deepEqual(oError, { responseText: "" }, "The promise was rejected with the correct error.");
            assert.strictEqual(this.oOnLoadStub.callCount, 0, "The function _onLoad wasn't called.");
        }.bind(this));
    });

    QUnit.test("Rejects the promise with the correct error if the request was aborted", function (assert) {
        // Arrange
        this.oFakeServer.respondImmediately = false;

        // Act
        var oRequestPromise = this.oHttpClient._executeRequest("GET", "SalesOrder('1243')");

        setTimeout(function () {
            this.oFakeServer.requests[0].abort();
        }.bind(this), 0);

        // Assert
        return oRequestPromise.catch(function (oError) {
            assert.deepEqual(oError, { responseText: "" }, "The promise was rejected with the correct error.");
            assert.strictEqual(this.oOnLoadStub.callCount, 0, "The function _onLoad wasn't called.");
        }.bind(this));
    });

    QUnit.test("Attaches the correct event handlers to the 'load' event", function (assert) {
        // Arrange
        this.oFakeServer.respondImmediately = true;

        // Act
        var oRequestPromise = this.oHttpClient._executeRequest("POST", "SalesOrder('1243')", {
            headers: { "Content-type": "application/json" },
            data: { amount: 304 }
        });

        // Assert
        return oRequestPromise.then(function () {
            assert.strictEqual(this.oOnLoadStub.callCount, 1, "The function _onLoad was called once.");
            assert.strictEqual(typeof this.oOnLoadStub.firstCall.args[0], "function", "The function _onLoad was called with the resolve function of the Promise.");
            assert.strictEqual(typeof this.oOnLoadStub.firstCall.args[1], "function", "The function _onLoad was called with the reject function of the Promise.");
            var oExpectedOriginalRequest = {
                xhr: this.oFakeServer.requests[0],
                method: "POST",
                url: "/basePath/SalesOrder%28%271243%27%29",
                data: {
                    headers: { "Content-type": "application/json" },
                    data: { amount: 304 }
                }
            };
            assert.deepEqual(this.oOnLoadStub.firstCall.args[2], oExpectedOriginalRequest, "The function _onLoad was called with the original request options.");
        }.bind(this));
    });

    QUnit.test("Adds the XHR request with a unique ID to the map of ongoing requests", function (assert) {
        // Arrange
        this.oFakeServer.respondImmediately = false;
        this.oHttpClient._oOngoingRequests = {
            someId: {}
        };

        // Act
        this.oHttpClient._executeRequest("GET", "SalesOrder('1243')");
        assert.deepEqual(this.oGenerateUniqueIdStub.firstCall.args[0], ["someId"], "The function generateUniqueId was called with the already generated request IDs.");
        assert.ok(this.oHttpClient._oOngoingRequests.requestId instanceof XMLHttpRequest, "The function added the newly created XHR request to the ongoing request object.");
        assert.strictEqual(this.oFakeServer.requests[0]._sapUshellHttpClientId, "requestId", "The function added the generated id as a new _sapUshellHttpClientId property to the XHR request.");
    });

    QUnit.test("Removes the XHR request from the ongoing requests map if it is finished", function (assert) {
        // Arrange
        this.oHttpClient._oOngoingRequests = {
            requestId: {}
        };

        // Act
        return this.oHttpClient._executeRequest("GET", "SalesOrder('1243')").then(function () {
            // Assert
            assert.strictEqual(this.oHttpClient._oOngoingRequests.requestId, undefined, "The request with ID 'requestId' was removed from the queue after the XHR request finished.");
        }.bind(this));
    });

    QUnit.module("The function _onLoad", {
        beforeEach: function () {
            this.oFakeServer = sinon.createFakeServer();

            this.oHttpClient = new HttpClient();

            this.oRequestPromise = new Promise(function (resolve, reject) {
                var oXhr = new XMLHttpRequest();
                var sURL = "https://s4.cloud.sap/dynamic_dest/u1y200/sap/opu/odata/UI2/INTEROP";
                var sMethod = "GET";
                var oData = {
                    headers: {
                        "x-csrf-token": "invalidToken",
                        "x-powered-by": "SAP Gateway Server"
                    },
                    data: {
                        id: 1,
                        name: "Test"
                    }
                };
                var oOriginalRequest = {
                    xhr: oXhr,
                    method: sMethod,
                    url: sURL,
                    data: oData
                };
                oXhr.onload = this.oHttpClient._onLoad.bind(this.oHttpClient, resolve, reject, oOriginalRequest);
                oXhr.open(sMethod, sURL);
                oXhr.setRequestHeader("x-csrf-token", "invalidToken");
                oXhr.setRequestHeader("x-powered-by", "SAP Gateway Server");
                oXhr.send(JSON.stringify(oData.data));
            }.bind(this));

            this.oExecuteRequestStub = sandbox.stub(this.oHttpClient, "_executeRequest");

            this.oGetCSRFTokenFromHeaderStub = sandbox.stub(this.oHttpClient, "_getCSRFTokenFromHeader").returns(undefined);
            this.oGetCSRFTokenKeyStub = sandbox.stub(this.oHttpClient, "_getCSRFTokenKey").returns("https://s4.cloud.sap/dynamic_dest/u1y200/sap/opu/odata/UI2");
        },
        afterEach: function () {
            this.oFakeServer.restore();
            sandbox.restore();
        }
    });

    QUnit.test("Resolves the promise if the HTTP status code is 200 <= 300", function (assert) {
        // Arrange
        this.oFakeServer.respondWith([201, {}, "<responseText>Created</responseText>"]);

        // Act
        this.oFakeServer.respond();

        // Assert
        return this.oRequestPromise.then(function (oResult) {
            var oExpectedResult = {
                aborted: false,
                responseHeaders: [],
                responseText: "<responseText>Created</responseText>",
                status: 201,
                statusText: "Created"
            };
            assert.deepEqual(oResult, oExpectedResult, "The function resolves with the correct result object.");
        });
    });

    QUnit.test("Rejects the promise if the HTTP status code is not 'Success' (this is a value in the range [100 < 200, 301 <= 500])", function (assert) {
        // Arrange
        this.oFakeServer.respondWith([401, {}, "<responseText>Invalid CSRF token</responseText>"]);

        // Act
        this.oFakeServer.respond();

        // Assert
        return this.oRequestPromise.catch(function (oError) {
            var oExpectedResult = {
                aborted: false,
                responseHeaders: [],
                responseText: "<responseText>Invalid CSRF token</responseText>",
                status: 401,
                statusText: "Unauthorized"
            };
            assert.deepEqual(oError, oExpectedResult, "The function rejects with the correct error object.");
        });
    });

    QUnit.test("Adds the 'x-csrf-token' response value to the CSRF token cache", function (assert) {
        // Arrange
        this.oHttpClient._oCSRFTokens = {};
        var oResponseHeaders = {
            "x-csrf-token": "token1234",
            Accept: "application/json"
        };
        this.oGetCSRFTokenFromHeaderStub.returns("token1234");
        this.oFakeServer.respondWith([200, oResponseHeaders, "<responseText>OK</responseText>"]);

        // Act
        this.oFakeServer.respond();

        // Assert
        return this.oRequestPromise.then(function () {
            var aExpectedResponseHeaders = [
                { name: "x-csrf-token", value: "token1234" },
                { name: "Accept", value: "application/json" }
            ];
            assert.deepEqual(this.oGetCSRFTokenFromHeaderStub.firstCall.args[0], aExpectedResponseHeaders, "The function called _getCSRFTokenFromHeader with the correct response headers.");
            assert.strictEqual(this.oHttpClient._oCSRFTokens["https://s4.cloud.sap/dynamic_dest/u1y200/sap/opu/odata/UI2"],
                "token1234", "The function adds the token value with the correct key to the CSRF token cache.");
        }.bind(this));
    });

    QUnit.test("Deletes invalid CSRF token from cache and sends the request again if status code is 403 & csrf token is required", function (assert) {
        // Arrange
        this.oExecuteRequestStub.resolves({
            message: "_executeRequest was resolved"
        });
        this.oHttpClient._oCSRFTokens = {
            "https://s4.cloud.sap/dynamic_dest/u1y200/sap/opu/odata/UI2": "invalidToken"
        };
        this.oGetCSRFTokenFromHeaderStub.returns("Required");
        this.oFakeServer.respondWith([403, {}, "<responseText>Forbidden</responseText>"]);

        // Act
        this.oFakeServer.respond();

        // Assert
        return this.oRequestPromise.then(function (oResult) {
            assert.strictEqual(this.oHttpClient._oCSRFTokens["https://s4.cloud.sap/dynamic_dest/u1y200/sap/opu/odata/UI2"], undefined, "The function removes the invalid token from cache.");
            assert.strictEqual(this.oExecuteRequestStub.firstCall.args[0], "GET", "The function calls _executeRequest with the correct HTTP method.");
            assert.strictEqual(this.oExecuteRequestStub.firstCall.args[1], "https://s4.cloud.sap/dynamic_dest/u1y200/sap/opu/odata/UI2/INTEROP",
                "The function calls _executeRequest with the correct resource path.");
            var oExpectedRequestData = {
                headers: {
                    "x-csrf-token": "invalidToken",
                    "x-powered-by": "SAP Gateway Server"
                },
                data: {
                    id: 1,
                    name: "Test"
                }
            };
            assert.deepEqual(this.oExecuteRequestStub.firstCall.args[2], oExpectedRequestData, "The function calls _executeRequest with the correct request data (body & headers).");
            assert.strictEqual(oResult.message, "_executeRequest was resolved", "The function resolves with the data from _executeRequest.");
        }.bind(this));
    });

    QUnit.test("Rejects the promise if a new CSRF token cannot be retrieved", function (assert) {
        // Arrange
        this.oExecuteRequestStub.rejects({
            message: "_executeRequest was rejected"
        });
        this.oGetCSRFTokenFromHeaderStub.returns("Required");
        this.oFakeServer.respondWith([403, {}, "<responseText>Forbidden</responseText>"]);

        // Act
        this.oFakeServer.respond();

        // Assert
        return this.oRequestPromise.catch(function (oResult) {
            assert.strictEqual(oResult.message, "_executeRequest was rejected", "The function rejects with the data from _executeRequest.");
        });
    });

    QUnit.module("The function _getFormattedResponse", {
        beforeEach: function () {
            this.oFakeServer = sinon.createFakeServer();

            this.oHttpClient = new HttpClient();
        },
        afterEach: function () {
            this.oFakeServer.restore();
        }
    });

    QUnit.test("Returns the correct response object for an XHR request with multiple headers", function (assert) {
        // Arrange
        this.oFakeServer.respondWith([201, {
            "Content-type": "application/json",
            "x-powered-by": "SAP Gateway Server"
        }, "<responseText>Post successfully created.<responseText>"]);

        var oXhr = new XMLHttpRequest();
        oXhr.open();
        oXhr.send();
        this.oFakeServer.respond();

        // Act
        var oResponse = this.oHttpClient._getFormattedResponse(oXhr);

        // Assert
        var oExpectedResponse = {
            aborted: false,
            status: 201,
            statusText: "Created",
            responseText: "<responseText>Post successfully created.<responseText>",
            responseHeaders: [
                { name: "Content-type", value: "application/json" },
                { name: "x-powered-by", value: "SAP Gateway Server" }
            ]
        };
        assert.deepEqual(oResponse, oExpectedResponse, "The function returns the correct response object.");
    });

    QUnit.test("Returns the correct response object for an aborted XHR request", function (assert) {
        // Arrange
        var oXhr = new XMLHttpRequest();
        oXhr.open();
        oXhr.send();
        oXhr.onabort = function () {
            oXhr.bAborted = true;
        };
        this.oFakeServer.requests[0].abort();
        // Act
        var oResponse = this.oHttpClient._getFormattedResponse(oXhr);

        // Assert
        var oExpectedResponse = {
            aborted: true,
            status: 0,
            statusText: "",
            responseText: "",
            responseHeaders: []
        };
        assert.deepEqual(oResponse, oExpectedResponse, "The function returns the correct response object.");
    });

    QUnit.module("The function abortAll", {
        beforeEach: function () {
            this.oFakeServer = sinon.createFakeServer();

            this.oHttpClient = new HttpClient();
        },
        afterEach: function () {
            this.oFakeServer.restore();
        }
    });

    QUnit.test("Aborts all ongoing request in the map", function (assert) {
        // Arrange
        var aPromises = Promise.all([
            this.oHttpClient._executeRequest("GET", "/resource1"),
            this.oHttpClient._executeRequest("GET", "/resource2"),
            this.oHttpClient._executeRequest("GET", "/resource3")
        ]);

        // Act
        setTimeout(function () {
            this.oHttpClient.abortAll();
            this.oFakeServer.respond();
        }.bind(this), 0);

        // Assert
        return aPromises.catch(function () {
            var aRequests = this.oFakeServer.requests;
            assert.ok(aRequests[0].aborted, "GET request for '/resource1' was successfully aborted.");
            assert.ok(aRequests[1].aborted, "GET request for '/resource2' was successfully aborted.");
            assert.ok(aRequests[2].aborted, "GET request for '/resource3' was successfully aborted.");
            assert.deepEqual(this.oHttpClient._oOngoingRequests, {}, "The ongoing request queue was cleared.");
        }.bind(this));
    });

    QUnit.module("The function _getCSRFTokenHeader", {
        beforeEach: function () {
            this.oHttpClient = new HttpClient();
            this.oExecuteRequestStub = sandbox.stub(this.oHttpClient, "_executeRequest");
            this.oExecuteRequestStub.resolves({
                status: 200,
                statusText: "Success",
                responseText: "OK",
                responseHeaders: []
            });
            this.oGetCSRFTokenFromHeaderStub = sandbox.stub(this.oHttpClient, "_getCSRFTokenFromHeader");
            this.oGetCSRFTokenKeyStub = sandbox.stub(this.oHttpClient, "_getCSRFTokenKey");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Resolves with the correct x-csrf-token for HTTP method 'GET'", function (assert) {
        // Act
        return this.oHttpClient._getCSRFTokenHeader("GET").then(function (oHeader) {
            var oExpectedCSRFTokenHeader = {
                "x-csrf-token": "fetch"
            };

            assert.deepEqual(oHeader, oExpectedCSRFTokenHeader, "The function returns value 'fetch' for x-csrf-token.");
        });
    });

    QUnit.test("Resolves with no headers if provided HTTP method is not supported", function (assert) {
        // Act
        return this.oHttpClient._getCSRFTokenHeader("SOMETHING").then(function (oHeader) {
            assert.deepEqual(oHeader, {}, "The function returns an empty object.");
        });
    });

    QUnit.test("Resolves with the already cached CSRF token if it is available", function (assert) {
        // Arrange
        this.oGetCSRFTokenKeyStub.returns("/dynamic_dest/u1y200/sap/opu/odata/UI2/INTEROP");
        this.oHttpClient._oCSRFTokens = {
            "/dynamic_dest/u1y200/sap/opu/odata/UI2/INTEROP": "token1234"
        };

        var oURI = new URI("/dynamic_dest/u1y200/sap/opu/odata/UI2/INTEROP/PersContainer('')");

        // Act
        return this.oHttpClient._getCSRFTokenHeader("POST", oURI).then(function (oHeader) {
            // Assert
            var oExpectedHeader = {
                "x-csrf-token": "token1234"
            };

            assert.strictEqual(this.oGetCSRFTokenKeyStub.firstCall.args[0], oURI, "The function _getCSRFTokenKey was called with the complete request URI.");
            assert.deepEqual(oHeader, oExpectedHeader, "The function returns the correct token from cache.");
        }.bind(this));
    });

    QUnit.test("Fetches a new CSRF token by sending an 'OPTIONS' request to the original URL if basePath wasn't provided.", function (assert) {
        // Arrange
        var oRequestResponse = {
            status: 200,
            statusText: "Success",
            responseText: "OK",
            responseHeaders: [
                { name: "x-csrf-token", value: "newlyFetchedToken" }
            ]
        };
        this.oHttpClient._oCSRFTokens = {};
        this.oExecuteRequestStub.resolves(oRequestResponse);
        this.oGetCSRFTokenFromHeaderStub.returns("newlyFetchedToken");

        // Act
        return this.oHttpClient._getCSRFTokenHeader("POST", new URI("/dynamic_dest/u1y200/sap/opu/odata/UI2/INTEROP/PersContainer('')")).then(function (oHeader) {
            // Assert
            var oExpectedHeader = {
                "x-csrf-token": "newlyFetchedToken"
            };

            assert.strictEqual(this.oExecuteRequestStub.firstCall.args[0], "HEAD", "The function _executeRequest was called with HTTP method 'OPTIONS'.");
            assert.strictEqual(this.oExecuteRequestStub.firstCall.args[1], "/dynamic_dest/u1y200/sap/opu/odata/UI2/INTEROP/PersContainer('')",
                "The function _executeRequest was called with the correct resource URL.");
            assert.strictEqual(this.oGetCSRFTokenFromHeaderStub.firstCall.args[0], oRequestResponse.responseHeaders,
                "The function _getCSRFTokenFromHeader was called with the correct response headers.");
            assert.deepEqual(oHeader, oExpectedHeader, "The function returns the correct token which was retrieved using a new 'OPTIONS' call.");
        }.bind(this));
    });

    QUnit.test("Fetches a new CSRF token by sending an 'OPTIONS' request to the base path origin + directory.", function (assert) {
        // Arrange
        var oRequestResponse = {
            status: 200,
            statusText: "Success",
            responseText: "OK",
            responseHeaders: [
                { name: "x-csrf-token", value: "newlyFetchedToken" }
            ]
        };
        var oHttpClient = new HttpClient("/dynamic_dest/u1y200/");
        oHttpClient._oCSRFTokens = {};
        var oExecuteRequestStub = sandbox.stub(oHttpClient, "_executeRequest").resolves(oRequestResponse);
        var oGetCSRFTokenFromHeaderStub = sandbox.stub(oHttpClient, "_getCSRFTokenFromHeader").returns("newlyFetchedToken");

        // Act
        return oHttpClient._getCSRFTokenHeader("POST", new URI("/dynamic_dest/u1y200/sap/opu/odata/UI2/INTEROP/PersContainer('')")).then(function (oHeader) {
            // Assert
            var oExpectedHeader = {
                "x-csrf-token": "newlyFetchedToken"
            };

            assert.strictEqual(oExecuteRequestStub.firstCall.args[0], "HEAD", "The function _executeRequest was called with HTTP method 'OPTIONS'.");
            assert.strictEqual(oExecuteRequestStub.firstCall.args[1], "/dynamic_dest/u1y200", "The function _executeRequest was called with the correct resource URL.");
            assert.strictEqual(oGetCSRFTokenFromHeaderStub.firstCall.args[0], oRequestResponse.responseHeaders, "The function _getCSRFTokenFromHeader was called with the correct response headers.");
            assert.deepEqual(oHeader, oExpectedHeader, "The function returns the correct token which was retrieved using a new 'OPTIONS' call.");
        });
    });

    QUnit.test("Rejects the promise if no CSRF token can be fetched.", function (assert) {
        // Arrange
        var oRequestResponse = {
            status: 200,
            statusText: "Success",
            responseText: "OK",
            responseHeaders: []
        };
        this.oExecuteRequestStub.resolves(oRequestResponse);
        this.oGetCSRFTokenFromHeaderStub.returns(undefined);

        // Act
        return this.oHttpClient._getCSRFTokenHeader("POST", new URI("/dynamic_dest/u1y200/sap/opu/odata/UI2/INTEROP/PersContainer('')")).catch(function (oError) {
            // Assert
            assert.strictEqual(this.oGetCSRFTokenFromHeaderStub.firstCall.args[0], oRequestResponse.responseHeaders,
                "The function _getCSRFTokenFromHeader was called with the correct response headers.");
            assert.strictEqual(oError.message, "CSRF Token couldn't be fetched.", "The function rejects the promise with the correct error message.");
        }.bind(this));
    });

    QUnit.module("The function _getCSRFTokenKey");

    QUnit.test("Returns token key for basePath if relative basePath was provided in the constructor", function (assert) {
        // Arrange
        var oHttpClient = new HttpClient("/basePath/");
        var oURI = new URI();

        // Act
        var sTokenKey = oHttpClient._getCSRFTokenKey(oURI);

        // Assert
        assert.strictEqual(sTokenKey, "/basePath", "The function returns the correct token key.");
    });

    QUnit.test("Returns token key for basePath if absolute basePath has been provided in the constructor", function (assert) {
        // Arrange
        var oHttpClient = new HttpClient("https://s4hana.ondemand.sap.com/ODATA_SRV/SalesOrder?id=1234");
        var oURI = new URI();

        // Act
        var sTokenKey = oHttpClient._getCSRFTokenKey(oURI);

        // Assert
        assert.strictEqual(sTokenKey, "https://s4hana.ondemand.sap.com/ODATA_SRV", "The function returns the correct token key.");
    });

    QUnit.test("Returns token key for complete resource URI if basePath was not provided in the constructor", function (assert) {
        // Arrange
        var oHttpClient = new HttpClient();
        var oURI = new URI("https://s4hana.ondemand.sap.com/ODATA_SRV/SalesOrder?id=1234");

        // Act
        var sTokenKey = oHttpClient._getCSRFTokenKey(oURI);

        // Assert
        assert.strictEqual(sTokenKey, "https://s4hana.ondemand.sap.com/ODATA_SRV", "The function returns the correct token key.");
    });

    QUnit.module("The function _getCSRFTokenFromHeader", {
        beforeEach: function () {
            this.oHttpClient = new HttpClient();
        }
    });

    QUnit.test("Returns the value of response header 'x-csrf-token'", function (assert) {
        // Arrange
        var aResponseHeaders = [
            { name: "x-csrf-token", value: "token1234" },
            { name: "accept", value: "application/json" }
        ];

        // Act
        var sToken = this.oHttpClient._getCSRFTokenFromHeader(aResponseHeaders);

        // Assert
        assert.strictEqual(sToken, "token1234", "The function returns the correct token value.");
    });

    QUnit.test("Returns undefined if header 'x-csrf-token' doesn't exist", function (assert) {
        // Arrange
        var aResponseHeaders = [
            { name: "accept", value: "application/json" }
        ];

        // Act
        var sToken = this.oHttpClient._getCSRFTokenFromHeader(aResponseHeaders);

        // Assert
        assert.strictEqual(sToken, undefined, "The function returns undefined if the x-csrf-token header doesn't exist.");
    });

    QUnit.module("The function get", {
        beforeEach: function () {
            this.oHttpClient = new HttpClient("/basePath/");

            this.oExecuteRequestStub = sandbox.stub(this.oHttpClient, "_executeRequest").resolves({
                status: 201,
                statusText: "Created",
                responseText: "Post successfully created.",
                responseHeaders: [
                    { name: "x-csrf-token", value: "token1234" }
                ]
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls _executeRequest with the right parameters", function (assert) {
        // Arrange
        var oData = {
            headers: { Accept: "application/json" }
        };

        // Act
        return this.oHttpClient.get("resource1", oData).then(function () {
            // Assert
            assert.strictEqual(this.oExecuteRequestStub.firstCall.args[0], "GET", "The function calls _executeRequest with the correct HTTP method.");
            assert.strictEqual(this.oExecuteRequestStub.firstCall.args[1], "resource1", "The function calls _executeRequest with the correct resource path.");
            assert.deepEqual(this.oExecuteRequestStub.firstCall.args[2], oData, "The function calls _executeRequest with the correct request data (body & headers).");
        }.bind(this));
    });

    QUnit.module("The function put", {
        beforeEach: function () {
            this.oHttpClient = new HttpClient("/basePath/");

            this.oExecuteRequestStub = sandbox.stub(this.oHttpClient, "_executeRequest").resolves({
                status: 201,
                statusText: "Created",
                responseText: "Post successfully created.",
                responseHeaders: [
                    { name: "x-csrf-token", value: "token1234" }
                ]
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls _executeRequest with the right parameters", function (assert) {
        // Arrange
        var oData = {
            headers: { Accept: "application/json" },
            data: {
                id: 1,
                name: "Test"
            }
        };

        // Act
        return this.oHttpClient.put("resource1", oData).then(function () {
            // Assert
            assert.strictEqual(this.oExecuteRequestStub.firstCall.args[0], "PUT", "The function calls _executeRequest with the correct HTTP method.");
            assert.strictEqual(this.oExecuteRequestStub.firstCall.args[1], "resource1", "The function calls _executeRequest with the correct resource path.");
            assert.deepEqual(this.oExecuteRequestStub.firstCall.args[2], oData, "The function calls _executeRequest with the correct request data (body & headers).");
        }.bind(this));
    });

    QUnit.module("The function post", {
        beforeEach: function () {
            this.oHttpClient = new HttpClient("/basePath/");

            this.oExecuteRequestStub = sandbox.stub(this.oHttpClient, "_executeRequest").resolves({
                status: 201,
                statusText: "Created",
                responseText: "Post successfully created.",
                responseHeaders: [
                    { name: "x-csrf-token", value: "token1234" }
                ]
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls _executeRequest with the right parameters", function (assert) {
        // Arrange
        var oData = {
            headers: { Accept: "application/json" },
            data: {
                id: 1,
                name: "Test"
            }
        };

        // Act
        return this.oHttpClient.post("resource1", oData).then(function () {
            // Assert
            assert.strictEqual(this.oExecuteRequestStub.firstCall.args[0], "POST", "The function calls _executeRequest with the correct HTTP method.");
            assert.strictEqual(this.oExecuteRequestStub.firstCall.args[1], "resource1", "The function calls _executeRequest with the correct resource path.");
            assert.deepEqual(this.oExecuteRequestStub.firstCall.args[2], oData, "The function calls _executeRequest with the correct request data (body & headers).");
        }.bind(this));
    });

    QUnit.module("The function patch", {
        beforeEach: function () {
            this.oHttpClient = new HttpClient("/basePath/");

            this.oExecuteRequestStub = sandbox.stub(this.oHttpClient, "_executeRequest").resolves({
                status: 201,
                statusText: "Created",
                responseText: "Post successfully created.",
                responseHeaders: [
                    { name: "x-csrf-token", value: "token1234" }
                ]
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls _executeRequest with the right parameters", function (assert) {
        // Arrange
        var oData = {
            headers: { Accept: "application/json" },
            data: {
                id: 1,
                name: "Test"
            }
        };

        // Act
        return this.oHttpClient.patch("resource1", oData).then(function () {
            // Assert
            assert.strictEqual(this.oExecuteRequestStub.firstCall.args[0], "PATCH", "The function calls _executeRequest with the correct HTTP method.");
            assert.strictEqual(this.oExecuteRequestStub.firstCall.args[1], "resource1", "The function calls _executeRequest with the correct resource path.");
            assert.deepEqual(this.oExecuteRequestStub.firstCall.args[2], oData, "The function calls _executeRequest with the correct request data (body & headers).");
        }.bind(this));
    });

    QUnit.module("The function delete", {
        beforeEach: function () {
            this.oHttpClient = new HttpClient("/basePath/");

            this.oExecuteRequestStub = sandbox.stub(this.oHttpClient, "_executeRequest").resolves({
                status: 201,
                statusText: "Created",
                responseText: "Post successfully created.",
                responseHeaders: [
                    { name: "x-csrf-token", value: "token1234" }
                ]
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls _executeRequest with the right parameters", function (assert) {
        // Arrange
        var oData = {
            headers: { Accept: "application/json" }
        };

        // Act
        return this.oHttpClient.delete("resource1", oData).then(function () {
            // Assert
            assert.strictEqual(this.oExecuteRequestStub.firstCall.args[0], "DELETE", "The function calls _executeRequest with the correct HTTP method.");
            assert.strictEqual(this.oExecuteRequestStub.firstCall.args[1], "resource1", "The function calls _executeRequest with the correct resource path.");
            assert.deepEqual(this.oExecuteRequestStub.firstCall.args[2], oData, "The function calls _executeRequest with the correct request data (body & headers).");
        }.bind(this));
    });

    QUnit.module("The function options", {
        beforeEach: function () {
            this.oHttpClient = new HttpClient("/basePath/");

            this.oExecuteRequestStub = sandbox.stub(this.oHttpClient, "_executeRequest").resolves({
                status: 201,
                statusText: "Created",
                responseText: "Post successfully created.",
                responseHeaders: [
                    { name: "x-csrf-token", value: "token1234" }
                ]
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls _executeRequest with the right parameters", function (assert) {
        // Arrange
        var oData = {
            headers: { Accept: "application/json" }
        };

        // Act
        return this.oHttpClient.options("resource1", oData).then(function () {
            // Assert
            assert.strictEqual(this.oExecuteRequestStub.firstCall.args[0], "OPTIONS", "The function calls _executeRequest with the correct HTTP method.");
            assert.strictEqual(this.oExecuteRequestStub.firstCall.args[1], "resource1", "The function calls _executeRequest with the correct resource path.");
            assert.deepEqual(this.oExecuteRequestStub.firstCall.args[2], oData, "The function calls _executeRequest with the correct request data (body & headers).");
        }.bind(this));
    });
});
