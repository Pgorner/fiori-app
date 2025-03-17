// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.utils.DynamicTileRequest
 */
sap.ui.define([
    "sap/base/i18n/Localization",
    "sap/ushell/utils/DynamicTileRequest",
    "sap/base/Log",
    "sap/ushell/utils/HttpClient",
    "sap/ushell/Container"
], function (
    Localization,
    DynamicTileRequest,
    Log,
    HttpClient,
    Container
) {
    "use strict";

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox({});

    QUnit.module("Constructor", {
        beforeEach: function () {
            this.oLogErrorStub = sandbox.stub(Log, "error");

            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.sContentProvider = "someContentProvider";
            const sUrlWithResolvedUserDefaults = "http://b.c/some/resolved/absolute/url?sap-language=";

            this.oGetServiceAsyncStub.withArgs("ClientSideTargetResolution").resolves({
                getSystemContext: sandbox.stub().callsFake((sContentProviderId) => Promise.resolve({ id: sContentProviderId }))
            });
            this.oReferenceResolverService = {
                resolveUserDefaultParameters: sandbox.stub().resolves({ url: sUrlWithResolvedUserDefaults })
            };
            this.oGetServiceAsyncStub.withArgs("ReferenceResolver").resolves(this.oReferenceResolverService);

            this.oRefreshStub = sandbox.stub(DynamicTileRequest.prototype, "refresh").resolves();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls refresh when url can be resolved", async function (assert) {
        // Arrange
        const sUrl = "initialUrl";
        const sContentProvider = "someContentProvider";
        const oExpectedSystemContext = { id: sContentProvider };

        // Act
        const oRequest = new DynamicTileRequest(sUrl, /*fnSuccess*/ sandbox.stub(), /*fnError*/ sandbox.stub(), sContentProvider);
        await oRequest._oInitialRefreshPromise;

        // Assert
        assert.deepEqual(this.oReferenceResolverService.resolveUserDefaultParameters.getCall(0).args, [sUrl, oExpectedSystemContext],
            "resolveUserDefaultParameters was called with correct args");
        assert.strictEqual(this.oRefreshStub.callCount, 1, "refresh was called once");
    });

    QUnit.test("Does not call refresh when the url from resolvedUserDefaults is empty", async function (assert) {
        // Arrange
        this.oReferenceResolverService.resolveUserDefaultParameters.resolves({});

        // Act
        const oRequest = new DynamicTileRequest("initialUrl", /*fnSuccess*/ sandbox.stub(), /*fnError*/ sandbox.stub(), "someContentProvider");
        await oRequest._oInitialRefreshPromise;

        // Assert
        assert.strictEqual(this.oRefreshStub.callCount, 0, "refresh was not called");
        assert.strictEqual(oRequest.sUrlResolvedUserDefaults, undefined, "Resolved url was not set");
    });

    QUnit.test("Does not call refresh and logs an error when the url from resolvedUserDefaults is empty", async function (assert) {
        // Arrange
        const sExpectedMessage = "Was not able to create a DynamicTileRequest:";
        const oError = new Error("someError");
        this.oReferenceResolverService.resolveUserDefaultParameters.rejects(oError);

        // Act
        const oRequest = new DynamicTileRequest("initialUrl", /*fnSuccess*/ sandbox.stub(), /*fnError*/ sandbox.stub(), "someContentProvider");
        await oRequest._oInitialRefreshPromise;

        // Assert
        assert.deepEqual(this.oLogErrorStub.getCall(0).args[0], sExpectedMessage, "error was called with correct message");
        assert.deepEqual(this.oLogErrorStub.getCall(0).args[1], oError, "error was called with correct error");
        assert.strictEqual(this.oRefreshStub.callCount, 0, "refresh was not called");
        assert.strictEqual(oRequest.sUrlResolvedUserDefaults, undefined, "Resolved url was not set");
    });

    QUnit.module("refresh", {
        beforeEach: async function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oGetServiceAsyncStub.withArgs("ClientSideTargetResolution").resolves({
                getSystemContext: sandbox.stub().callsFake((sContentProviderId) => Promise.resolve({ id: sContentProviderId }))
            });

            this.sUrlWithResolvedUserDefaults = "http://b.c/some/resolved/absolute/url?sap-language=";
            this.oReferenceResolverService = {
                resolveUserDefaultParameters: sandbox.stub().resolves({ url: this.sUrlWithResolvedUserDefaults }),
                resolveSemanticDateRanges: sandbox.stub().callsFake((sUrl) => Promise.resolve({ url: sUrl }))
            };
            this.oGetServiceAsyncStub.withArgs("ReferenceResolver").resolves(this.oReferenceResolverService);

            const oFakeServer = sandbox.useFakeServer();
            oFakeServer.configure({ autoRespond: true });
            this.oPayload = { number: 42 };
            oFakeServer.respondWith("GET", this.sUrlWithResolvedUserDefaults, JSON.stringify(this.oPayload));

            this.fnSuccess = sandbox.stub();
            this.fnError = sandbox.stub();

            // refresh is called implicitly by constructor
            const oRefreshStub = sandbox.stub(DynamicTileRequest.prototype, "refresh").resolves();
            this.oRequest = new DynamicTileRequest("initialUrl", this.fnSuccess, this.fnError, "someContentProvider");
            await this.oRequest._oInitialRefreshPromise;
            oRefreshStub.restore();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Creates a new request when no request exists", async function (assert) {
        // Act
        await this.oRequest.refresh();

        // Assert
        assert.strictEqual(sandbox.server.requestCount, 1, "fake server handled one request");
        assert.strictEqual(sandbox.server.getRequest(0).url, this.sUrlWithResolvedUserDefaults, "called server with correct url");

        assert.strictEqual(this.fnSuccess.callCount, 1, "success handler was called once");
        assert.deepEqual(this.fnSuccess.getCall(0).args[0], this.oPayload, "success handler was called with correct payload");

        assert.strictEqual(this.oReferenceResolverService.resolveSemanticDateRanges.callCount, 1, "resolveSemanticDateRanges was called once");
    });

    QUnit.test("Does not create a new request when a request exists", async function (assert) {
        // Act
        await Promise.all([
            this.oRequest.refresh(),
            this.oRequest.refresh()
        ]);

        // Assert
        assert.strictEqual(sandbox.server.requestCount, 1, "fake server handled one request");
        assert.strictEqual(sandbox.server.getRequest(0).url, this.sUrlWithResolvedUserDefaults, "called server with correct url");

        assert.strictEqual(this.fnSuccess.callCount, 1, "success handler was called once");
        assert.deepEqual(this.fnSuccess.getCall(0).args[0], this.oPayload, "success handler was called with correct payload");
    });

    QUnit.module("Resolving SemanticDateRanges", {
        beforeEach: async function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            const oFakeServer = sandbox.useFakeServer();
            oFakeServer.configure({ autoRespond: true });

            this.oGetServiceAsyncStub.withArgs("ClientSideTargetResolution").resolves({
                getSystemContext: sandbox.stub().callsFake((sContentProviderId) => Promise.resolve({ id: sContentProviderId }))
            });

            this.sUrlWithResolvedUserDefaults = "http://b.c/some/resolved/absolute/url?sap-language=";
            this.oResolveSemanticDateRangesStub = sandbox.stub();
            this.oGetServiceAsyncStub.withArgs("ReferenceResolver").resolves({
                resolveUserDefaultParameters: sandbox.stub().resolves({ url: this.sUrlWithResolvedUserDefaults }),
                resolveSemanticDateRanges: this.oResolveSemanticDateRangesStub
            });

            const oOptions = {
                dataSource: {
                    settings: {
                        odataVersion: "4.0"
                    }
                }
            };
            // refresh is called implicitly by constructor
            const oRefreshStub = sandbox.stub(DynamicTileRequest.prototype, "refresh").resolves();
            this.oRequest = new DynamicTileRequest("initialUrl", /*fnSuccess*/ sandbox.stub(), /*fnError*/ sandbox.stub(), "someContentProvider", oOptions);
            await this.oRequest._oInitialRefreshPromise;
            oRefreshStub.restore();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Resolves with correct url and passes the OData version", async function (assert) {
        // Arrange
        const oSemanticDateRangeResult = { url: "http://b.c/some/resolved/absolute/url?sap-language=" };
        this.oResolveSemanticDateRangesStub.withArgs(this.sUrlWithResolvedUserDefaults, "4.0").returns(oSemanticDateRangeResult);

        // Act
        await this.oRequest.refresh();

        // Assert
        assert.strictEqual(sandbox.server.requestCount, 1, "fake server handled one request");
        assert.strictEqual(sandbox.server.getRequest(0).url, oSemanticDateRangeResult.url, "called server with correct url");
        assert.strictEqual(this.oResolveSemanticDateRangesStub.callCount, 1, "ReferenceResolver.resolveSemanticDateRanges was called once");
    });

    QUnit.test("Resolves without url because of ignored references", async function (assert) {
        // Arrange
        this.oResolveSemanticDateRangesStub.returns({
            url: undefined,
            ignoredReferences: ["ABC", "DynamicDate.DEF"]
        });
        const oLogErrorStub = sandbox.stub(Log, "error");
        const sExpectedMessage = "The service URL contains invalid Reference(s): ABC, DynamicDate.DEF";

        // Act
        await this.oRequest.refresh();

        // Assert
        assert.strictEqual(sandbox.server.requestCount, 0, "fake server handled no request");
        assert.strictEqual(oLogErrorStub.getCall(0).args[0], sExpectedMessage, "error was called with correct message");
        assert.strictEqual(this.oResolveSemanticDateRangesStub.callCount, 1, "ReferenceResolver.resolveSemanticDateRanges was called once");
    });

    QUnit.test("Resolves without url because of invalidSemanticDates references", async function (assert) {
        // Arrange
        this.oResolveSemanticDateRangesStub.returns({
            url: undefined,
            invalidSemanticDates: ["DynamicDate.DEF"]
        });
        const oLogErrorStub = sandbox.stub(Log, "error");
        const sExpectedMessage = "The service URL contains invalid Reference(s): DynamicDate.DEF";

        // Act
        await this.oRequest.refresh();

        // Assert
        assert.strictEqual(sandbox.server.requestCount, 0, "fake server handled no request");
        assert.strictEqual(oLogErrorStub.getCall(0).args[0], sExpectedMessage, "error was called with correct message");
        assert.strictEqual(this.oResolveSemanticDateRangesStub.callCount, 1, "ReferenceResolver.resolveSemanticDateRanges was called once");
    });

    QUnit.test("Resolves without url because of ignored references and invalidSemanticDates", async function (assert) {
        // Arrange
        this.oResolveSemanticDateRangesStub.returns({
            url: undefined,
            ignoredReferences: ["ABC", "DynamicDate.DEF"],
            invalidSemanticDates: ["DynamicDate.XYZ"]
        });
        const oLogErrorStub = sandbox.stub(Log, "error");
        const sExpectedMessage = "The service URL contains invalid Reference(s): DynamicDate.XYZ, ABC, DynamicDate.DEF";

        // Act
        await this.oRequest.refresh();

        // Assert
        assert.strictEqual(sandbox.server.requestCount, 0, "fake server handled no request");
        assert.strictEqual(oLogErrorStub.getCall(0).args[0], sExpectedMessage, "error was called with correct message");
        assert.strictEqual(this.oResolveSemanticDateRangesStub.callCount, 1, "ReferenceResolver.resolveSemanticDateRanges was called once");
    });

    QUnit.test("Tries to resolve semantic date ranges only once if the URL doesn't contain any", async function (assert) {
        // Arrange
        const oSemanticDateRangeResult = {
            url: "http://b.c/some/resolved/absolute/url?sap-language=",
            hasSemanticDateRanges: false
        };
        this.oResolveSemanticDateRangesStub.withArgs(this.sUrlWithResolvedUserDefaults, "4.0").returns(oSemanticDateRangeResult);

        // Act
        await this.oRequest.refresh();
        await this.oRequest.refresh();

        // Assert
        assert.strictEqual(sandbox.server.requestCount, 2, "fake server handled two requests");
        assert.strictEqual(sandbox.server.getRequest(0).url, oSemanticDateRangeResult.url, "called server with correct url");
        assert.strictEqual(sandbox.server.getRequest(1).url, oSemanticDateRangeResult.url, "called server with correct url");
        assert.strictEqual(this.oResolveSemanticDateRangesStub.callCount, 1, "ReferenceResolver.resolveSemanticDateRanges was called once");
    });

    QUnit.test("Resolves semantic date ranges on subsequent calls", async function (assert) {
        // Arrange
        const oSemanticDateRangeResult = {
            url: "http://b.c/some/resolved/absolute/url?sap-language=",
            hasSemanticDateRanges: true
        };
        this.oResolveSemanticDateRangesStub.withArgs(this.sUrlWithResolvedUserDefaults, "4.0").returns(oSemanticDateRangeResult);

        // Act
        await this.oRequest.refresh();
        await this.oRequest.refresh();

        // Assert
        assert.strictEqual(sandbox.server.requestCount, 2, "fake server handled two requests");
        assert.strictEqual(sandbox.server.getRequest(0).url, oSemanticDateRangeResult.url, "called server with correct url");
        assert.strictEqual(sandbox.server.getRequest(1).url, oSemanticDateRangeResult.url, "called server with correct url");
        assert.strictEqual(this.oResolveSemanticDateRangesStub.callCount, 2, "ReferenceResolver.resolveSemanticDateRanges was called twice");
    });

    QUnit.test("Rejects the Promise and logs an error if the Semantic Date Range resolver rejects", function (assert) {
        // Arrange
        this.oResolveSemanticDateRangesStub.rejects();
        const oLogErrorStub = sandbox.stub(Log, "error");

        // Act
        return this.oRequest.refresh().catch(() => {
            // Assert
            assert.ok(true, "The call was rejected");
            assert.strictEqual(sandbox.server.requestCount, 0, "fake server handled no request");
            assert.strictEqual(this.oResolveSemanticDateRangesStub.callCount, 1, "ReferenceResolver.resolveSemanticDateRanges was called once");
            assert.strictEqual(oLogErrorStub.callCount, 1, "An error message was logged");
        });
    });

    QUnit.module("Sending Requests", {
        beforeEach: async function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            const oFakeServer = sandbox.useFakeServer();
            oFakeServer.configure({ autoRespond: true });

            this.oGetServiceAsyncStub.withArgs("ClientSideTargetResolution").resolves({
                getSystemContext: sandbox.stub().callsFake((sContentProviderId) => Promise.resolve({ id: sContentProviderId }))
            });

            this.sUrlWithResolvedUserDefaults = "http://b.c/some/resolved/absolute/url?sap-language=";
            this.oReferenceResolverService = {
                resolveUserDefaultParameters: sandbox.stub().resolves({ url: this.sUrlWithResolvedUserDefaults }),
                resolveSemanticDateRanges: sandbox.stub().callsFake((sUrl) => Promise.resolve({ url: sUrl }))
            };
            this.oGetServiceAsyncStub.withArgs("ReferenceResolver").resolves(this.oReferenceResolverService);

            this.fnSuccess = sandbox.stub();
            this.fnError = sandbox.stub();
            // refresh is called implicitly by constructor
            const oRefreshStub = sandbox.stub(DynamicTileRequest.prototype, "refresh").resolves();
            this.oRequest = new DynamicTileRequest("initialUrl", this.fnSuccess, this.fnError, "someContentProvider");
            await this.oRequest._oInitialRefreshPromise;
            oRefreshStub.restore();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls success handler when request resolves", async function (assert) {
        // Arrange
        sandbox.server.respondWith("GET", this.sUrlWithResolvedUserDefaults, "22");

        // Act
        await this.oRequest.refresh();

        // Assert
        assert.strictEqual(sandbox.server.requestCount, 1, "fake server handled one request");
        assert.strictEqual(this.fnSuccess.callCount, 1, "onSuccess was called once");
        assert.strictEqual(this.fnError.callCount, 0, "onError was not called");
    });

    QUnit.test("Calls error handler when request rejects", async function (assert) {
        // Act
        await this.oRequest.refresh();

        // Assert
        assert.strictEqual(sandbox.server.requestCount, 1, "fake server handled one request");
        assert.strictEqual(this.fnSuccess.callCount, 0, "onSuccess was not called");
        assert.strictEqual(this.fnError.callCount, 1, "onError was called once");
    });


    QUnit.test("Adds sap-language as new parameter", async function (assert) {
        // Arrange
        const sExpectedUrl = "http://b.c/some/resolved/absolute/url?sap-language=EN";
        this.oReferenceResolverService.resolveSemanticDateRanges.resolves({ url: "http://b.c/some/resolved/absolute/url" });

        // Act
        await this.oRequest.refresh();

        // Assert
        assert.strictEqual(sandbox.server.requestCount, 1, "fake server handled one request");
        assert.strictEqual(sandbox.server.getRequest(0).url, sExpectedUrl, "called server with correct url");
    });

    QUnit.test("Adds sap-language to existing parameters", async function (assert) {
        // Arrange
        const sExpectedUrl = "http://b.c/some/resolved/absolute/url?a=b&sap-language=EN";
        this.oReferenceResolverService.resolveSemanticDateRanges.resolves({ url: "http://b.c/some/resolved/absolute/url?a=b" });

        // Act
        await this.oRequest.refresh();

        // Assert
        assert.strictEqual(sandbox.server.requestCount, 1, "fake server handled one request");
        assert.strictEqual(sandbox.server.getRequest(0).url, sExpectedUrl, "called server with correct url");
    });

    QUnit.test("Handles relative urls correctly", async function (assert) {
        // Arrange
        sandbox.stub(Container, "getLogonSystem");
        const sExpectedUrl = location.origin + "/some/resolved/relative/url?a=b&sap-language=EN";
        this.oReferenceResolverService.resolveSemanticDateRanges.resolves({ url: "/some/resolved/relative/url?a=b" });

        // Act
        await this.oRequest.refresh();

        // Assert
        assert.strictEqual(sandbox.server.requestCount, 1, "fake server handled one request");
        assert.strictEqual(sandbox.server.getRequest(0).url, sExpectedUrl, "called server with correct url");
    });

    QUnit.test("Encodes parameters with spaces correctly", async function (assert) {
        // Arrange
        const sExpectedUrl = "http://b.c/some/resolvedUrl?%24filter=Name%20eq%20%27Value%27&sap-language=EN";
        this.oReferenceResolverService.resolveSemanticDateRanges.resolves({ url: "http://b.c/some/resolvedUrl?$filter=Name eq 'Value'" });

        // Act
        await this.oRequest.refresh();

        // Assert
        assert.strictEqual(sandbox.server.requestCount, 1, "fake server handled one request");
        assert.strictEqual(sandbox.server.getRequest(0).url, sExpectedUrl, "called server with correct url");
    });

    QUnit.test("Handles encoded \"+\" character correctly", async function (assert) {
        // Arrange
        const sExpectedUrl = "http://b.c/some/resolvedUrl?%24filter=Time%20lt%202021-07-01T10%3A45%3A39%2B02%3A00&sap-language=EN";
        this.oReferenceResolverService.resolveSemanticDateRanges.resolves({ url: "http://b.c/some/resolvedUrl?$filter=Time%20lt%202021-07-01T10:45:39%2B02:00" });

        // Act
        await this.oRequest.refresh();

        // Assert
        assert.strictEqual(sandbox.server.requestCount, 1, "fake server handled one request");
        assert.strictEqual(sandbox.server.getRequest(0).url, sExpectedUrl, "called server with correct url");
    });


    QUnit.module("abort", {
        beforeEach: async function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            sandbox.useFakeServer();

            this.oGetServiceAsyncStub.withArgs("ClientSideTargetResolution").resolves({
                getSystemContext: sandbox.stub().callsFake((sContentProviderId) => Promise.resolve({ id: sContentProviderId }))
            });

            this.sUrlWithResolvedUserDefaults = "http://b.c/some/resolved/absolute/url?sap-language=";
            this.oGetServiceAsyncStub.withArgs("ReferenceResolver").resolves({
                resolveUserDefaultParameters: sandbox.stub().resolves({ url: this.sUrlWithResolvedUserDefaults }),
                resolveSemanticDateRanges: sandbox.stub().callsFake((sUrl) => Promise.resolve({ url: sUrl }))
            });

            this.oAbortAllStub = sandbox.stub(HttpClient.prototype, "abortAll");

            // refresh is called implicitly by constructor
            const oRefreshStub = sandbox.stub(DynamicTileRequest.prototype, "refresh").resolves();
            this.oRequest = new DynamicTileRequest("initialUrl", /*fnSuccess*/ sandbox.stub(), /*fnError*/ sandbox.stub(), "someContentProvider");
            await this.oRequest._oInitialRefreshPromise;
            oRefreshStub.restore();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Aborts and reset request", function (assert) {
        // Arrange
        const done = assert.async();
        this.oRequest.refresh();
        setTimeout(() => {
            // Act
            const bResult = this.oRequest.abort();

            // Assert
            assert.strictEqual(bResult, true, "the correct value was returned");
            assert.strictEqual(this.oAbortAllStub.callCount, 1, "abortAll was called once");
            done();
        }, 0);
    });

    QUnit.test("Does not abort if no request exists", function (assert) {
        // Act
        const bResult = this.oRequest.abort();

        // Assert
        assert.strictEqual(bResult, false, "the correct value was returned");
        assert.strictEqual(this.oAbortAllStub.callCount, 0, "abortAll was not called");
    });

    QUnit.module("Response Handler", {
        beforeEach: async function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            const oFakeServer = sandbox.useFakeServer();
            oFakeServer.configure({ autoRespond: true });

            this.oGetServiceAsyncStub.withArgs("ClientSideTargetResolution").resolves({
                getSystemContext: sandbox.stub().callsFake((sContentProviderId) => Promise.resolve({ id: sContentProviderId }))
            });

            this.sUrlWithResolvedUserDefaults = "http://b.c/some/resolved/absolute/url?sap-language=";
            this.oReferenceResolverService = {
                resolveUserDefaultParameters: sandbox.stub().resolves({ url: this.sUrlWithResolvedUserDefaults }),
                resolveSemanticDateRanges: sandbox.stub().callsFake((sUrl) => Promise.resolve({ url: sUrl }))
            };
            this.oGetServiceAsyncStub.withArgs("ReferenceResolver").resolves(this.oReferenceResolverService);

            this.fnSuccess = sandbox.stub();
            this.fnError = sandbox.stub();
            // refresh is called implicitly by constructor
            const oRefreshStub = sandbox.stub(DynamicTileRequest.prototype, "refresh").resolves();
            this.oRequest = new DynamicTileRequest("initialUrl", this.fnSuccess, this.fnError, "someContentProvider");
            await this.oRequest._oInitialRefreshPromise;
            oRefreshStub.restore();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Handles plain data correctly", async function (assert) {
        // Arrange
        sandbox.server.respondWith("GET", this.sUrlWithResolvedUserDefaults, "22");
        const oExpectedData = {
            number: 22
        };

        // Act
        await this.oRequest.refresh();

        // Assert
        assert.strictEqual(sandbox.server.requestCount, 1, "fake server handled one request");
        const oResult = this.fnSuccess.getCall(0).args[0];
        assert.deepEqual(oResult, oExpectedData, "called tile success handler with correct data");
    });

    QUnit.test("Handles $inlinecount=allpages correctly", async function (assert) {
        // Arrange
        const sResolvedUrl = `http://b.c/some/resolved/absolute/url?sap-language=&${encodeURIComponent("$inlinecount")}=allpages`;
        this.oReferenceResolverService.resolveSemanticDateRanges.resolves({ url: sResolvedUrl });

        const oPayload = { d: { __count: 22 } };
        sandbox.server.respondWith("GET", sResolvedUrl, JSON.stringify(oPayload));
        const oExpectedData = {
            number: 22
        };

         // Act
         await this.oRequest.refresh();

         // Assert
         assert.strictEqual(sandbox.server.requestCount, 1, "fake server handled one request");
         const oResult = this.fnSuccess.getCall(0).args[0];
         assert.deepEqual(oResult, oExpectedData, "called tile success handler with correct data");
    });

    QUnit.test("Handles $count=true correctly", async function (assert) {
        // Arrange
        const sResolvedUrl = `http://b.c/some/resolved/absolute/url?sap-language=&${encodeURIComponent("$count")}=true`;
        this.oReferenceResolverService.resolveSemanticDateRanges.resolves({ url: sResolvedUrl });

        const oPayload = { "@odata.count": 22 };
        sandbox.server.respondWith("GET", sResolvedUrl, JSON.stringify(oPayload));
        const oExpectedData = {
            number: 22
        };

         // Act
         await this.oRequest.refresh();

         // Assert
         assert.strictEqual(sandbox.server.requestCount, 1, "fake server handled one request");
         const oResult = this.fnSuccess.getCall(0).args[0];
         assert.deepEqual(oResult, oExpectedData, "called tile success handler with correct data");
    });

    QUnit.test("Handles OData v4 response correctly", async function (assert) {
        // Arrange
        const oPayload = {
            icon: "sap-icon://travel-expense",
            info: "OData v4",
            infoState: "Critical",
            number: 43.333,
            numberDigits: 1,
            numberFactor: "k",
            numberState: "Positive",
            numberUnit: "EUR",
            stateArrow: "Up",
            subtitle: "Quarterly overview",
            title: "Travel Expenses"
        };
        sandbox.server.respondWith("GET", this.sUrlWithResolvedUserDefaults, JSON.stringify(oPayload));

        // Act
        await this.oRequest.refresh();

        // Assert
        assert.strictEqual(sandbox.server.requestCount, 1, "fake server handled one request");
        const oResult = this.fnSuccess.getCall(0).args[0];
        assert.deepEqual(oResult, oPayload, "called tile success handler with correct data");
    });

    QUnit.test("Handles OData v2 response correctly", async function (assert) {
        // Arrange
        const oPayload = {
            d: {
                icon: "sap-icon://travel-expense",
                info: "OData v4",
                infoState: "Critical",
                number: 43.333,
                numberDigits: 1,
                numberFactor: "k",
                numberState: "Positive",
                numberUnit: "EUR",
                stateArrow: "Up",
                subtitle: "Quarterly overview",
                title: "Travel Expenses"
            }
        };
        sandbox.server.respondWith("GET", this.sUrlWithResolvedUserDefaults, JSON.stringify(oPayload));

        // Act
        await this.oRequest.refresh();

        // Assert
        assert.strictEqual(sandbox.server.requestCount, 1, "fake server handled one request");
        const oResult = this.fnSuccess.getCall(0).args[0];
        assert.deepEqual(oResult, oPayload.d, "called tile success handler with correct data");
    });

    QUnit.test("Throws an error when response is not parsable and calls the error handler", async function (assert) {
        // Arrange
        const sExpectedError = "Was not able to parse response of dynamic tile request";
        sandbox.server.respondWith("GET", this.sUrlWithResolvedUserDefaults, "broken{JSON]");

        // Act
        await this.oRequest.refresh();

        // Assert
        assert.strictEqual(sandbox.server.requestCount, 1, "fake server handled one request");
        const oError = this.fnError.getCall(0).args[0];
        assert.strictEqual(oError.message, sExpectedError, "Returned the correct error");
    });

    QUnit.module("Data Handling", {
        beforeEach: async function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            const oFakeServer = sandbox.useFakeServer();
            oFakeServer.configure({ autoRespond: true });

            this.oGetServiceAsyncStub.withArgs("ClientSideTargetResolution").resolves({
                getSystemContext: sandbox.stub().callsFake((sContentProviderId) => Promise.resolve({ id: sContentProviderId }))
            });

            this.sUrlWithResolvedUserDefaults = "http://b.c/some/resolved/absolute/url?sap-language=";
            this.oGetServiceAsyncStub.withArgs("ReferenceResolver").resolves({
                resolveUserDefaultParameters: sandbox.stub().resolves({ url: this.sUrlWithResolvedUserDefaults }),
                resolveSemanticDateRanges: sandbox.stub().callsFake((sUrl) => Promise.resolve({ url: sUrl }))
            });

            this.fnSuccess = sandbox.stub();
            this.fnError = sandbox.stub();

            // refresh is called implicitly by constructor
            const oRefreshStub = sandbox.stub(DynamicTileRequest.prototype, "refresh").resolves();
            this.oRequest = new DynamicTileRequest("initialUrl", this.fnSuccess, this.fnError, "someContentProvider");
            await this.oRequest._oInitialRefreshPromise;
            oRefreshStub.restore();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Filters non supported keys", async function (assert) {
        // Arrange
        const oPayload = {
            nonSupportedKey: "nonSupportedKeyValue",
            results: "someResults",
            icon: "someIcon",
            title: "someTitle",
            number: "someNumber",
            numberUnit: "someNumberUnit",
            info: "someInfo",
            infoState: "someInfoState",
            infoStatus: "someInfoStatus",
            targetParams: "someTargetParams",
            subtitle: "someSubtitle",
            stateArrow: "someStateArrow",
            numberState: "someNumberState",
            numberDigits: "someNumberDigits",
            numberFactor: "someNumberFactor"
        };
        sandbox.server.respondWith("GET", this.sUrlWithResolvedUserDefaults, JSON.stringify(oPayload));
        const oExpectedData = {
            results: "someResults",
            icon: "someIcon",
            title: "someTitle",
            number: "someNumber",
            numberUnit: "someNumberUnit",
            info: "someInfo",
            infoState: "someInfoState",
            infoStatus: "someInfoStatus",
            targetParams: "someTargetParams",
            subtitle: "someSubtitle",
            stateArrow: "someStateArrow",
            numberState: "someNumberState",
            numberDigits: "someNumberDigits",
            numberFactor: "someNumberFactor"
        };

        // Act
        await this.oRequest.refresh();

        // Assert
        assert.strictEqual(sandbox.server.requestCount, 1, "fake server handled one request");
        const oResult = this.fnSuccess.getCall(0).args[0];
        assert.deepEqual(oResult, oExpectedData, "called tile success handler with correct data");
    });

    QUnit.test("Handles OData function imports correctly", async function (assert) {
        // Arrange
        const oPayload = {
            DynamicTileParameters: {
                __metadathttp: {},
                number: 392,
                numberState: "Negative"
            }
        };
        sandbox.server.respondWith("GET", this.sUrlWithResolvedUserDefaults, JSON.stringify(oPayload));
        const oExpectedData = {
            number: 392,
            numberState: "Negative"
        };

        // Act
        await this.oRequest.refresh();

        // Assert
        assert.strictEqual(sandbox.server.requestCount, 1, "fake server handled one request");
        const oResult = this.fnSuccess.getCall(0).args[0];
        assert.deepEqual(oResult, oExpectedData, "called tile success handler with correct data");
    });

    QUnit.test("Handles invalid response correctly", async function (assert) {
        // Arrange
        const oPayload = {
            someInvalidProperty: {},
            anotherInvalidProperty: {}
        };
        sandbox.server.respondWith("GET", this.sUrlWithResolvedUserDefaults, JSON.stringify(oPayload));

        // Act
        await this.oRequest.refresh();

        // Assert
        assert.strictEqual(sandbox.server.requestCount, 1, "fake server handled one request");
        const oResult = this.fnSuccess.getCall(0).args[0];
        assert.deepEqual(oResult, {}, "called tile success handler with correct data");
    });

    QUnit.module("Request Headers", {
        beforeEach: async function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
            this.oGetClientStub = sandbox.stub().returns("100");
            sandbox.stub(Container, "getLogonSystem").returns({getClient: this.oGetClientStub});

            const oFakeServer = sandbox.useFakeServer();
            oFakeServer.configure({ autoRespond: true });

            this.oGetServiceAsyncStub.withArgs("ClientSideTargetResolution").resolves({
                getSystemContext: sandbox.stub().callsFake((sContentProviderId) => Promise.resolve({ id: sContentProviderId }))
            });

            this.sUrlWithResolvedUserDefaults = "http://b.c/some/resolved/absolute/url?sap-language=";
            this.oReferenceResolverService = {
                resolveUserDefaultParameters: sandbox.stub().resolves({ url: this.sUrlWithResolvedUserDefaults }),
                resolveSemanticDateRanges: sandbox.stub().callsFake((sUrl) => Promise.resolve({ url: sUrl }))
            };
            this.oGetServiceAsyncStub.withArgs("ReferenceResolver").resolves(this.oReferenceResolverService);

            // refresh is called implicitly by constructor
            const oRefreshStub = sandbox.stub(DynamicTileRequest.prototype, "refresh").resolves();
            this.oRequest = new DynamicTileRequest("initialUrl", /*fnSuccess*/ sandbox.stub(), /*fnError*/ sandbox.stub(), "someContentProvider");
            await this.oRequest._oInitialRefreshPromise;
            oRefreshStub.restore();

            this.oGetSAPLogonLanguageStub = sandbox.stub(Localization, "getSAPLogonLanguage");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns default headers", async function (assert) {
        // Arrange
        const oExpectedHeaders = {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
            "Accept-Language": "en",
            Accept: "application/json, text/plain"
        };

        // Act
        await this.oRequest.refresh();

        // Assert
        assert.strictEqual(sandbox.server.requestCount, 1, "fake server handled one request");
        const oRequestHeaders = sandbox.server.getRequest(0).requestHeaders;
        Object.keys(oExpectedHeaders).forEach((sHeader) => {
            assert.strictEqual(oRequestHeaders[sHeader], oExpectedHeaders[sHeader], `Found correct header for ${sHeader}`);
        });
    });

    QUnit.test("Adds sap-language when LogonLanguage is available", async function (assert) {
        // Arrange
        this.oGetSAPLogonLanguageStub.returns("EN");
        const oExpectedHeaders = {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
            "Accept-Language": "en",
            "sap-language": "EN",
            Accept: "application/json, text/plain"
        };

        // Act
        await this.oRequest.refresh();

        // Assert
        assert.strictEqual(sandbox.server.requestCount, 1, "fake server handled one request");
        const oRequestHeaders = sandbox.server.getRequest(0).requestHeaders;
        Object.keys(oExpectedHeaders).forEach((sHeader) => {
            assert.strictEqual(oRequestHeaders[sHeader], oExpectedHeaders[sHeader], `Found correct header for ${sHeader}`);
        });
    });

    QUnit.test("Adds sap-client when the parameter and client are available", async function (assert) {
        // Arrange
        const sRelativeUrl = "/some/resolved/absolute/url?sap-language=";
        this.oReferenceResolverService.resolveSemanticDateRanges.resolves({ url: sRelativeUrl });

        this.oGetSAPLogonLanguageStub.returns("EN");

        const oExpectedHeaders = {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
            "Accept-Language": "en",
            "sap-language": "EN",
            "sap-client": "100",
            Accept: "application/json, text/plain"
        };

        // Act
        await this.oRequest.refresh();

        // Assert
        assert.strictEqual(sandbox.server.requestCount, 1, "fake server handled one request");
        const oRequestHeaders = sandbox.server.getRequest(0).requestHeaders;
        Object.keys(oExpectedHeaders).forEach((sHeader) => {
            assert.strictEqual(oRequestHeaders[sHeader], oExpectedHeaders[sHeader], `Found correct header for ${sHeader}`);
        });
    });

    QUnit.test("Does not add sap-client when the parameter is available but the client not", async function (assert) {
        // Arrange
        const sRelativeUrl = "/some/resolved/absolute/url?sap-language=";
        this.oReferenceResolverService.resolveSemanticDateRanges.resolves({ url: sRelativeUrl });

        this.oGetSAPLogonLanguageStub.returns("EN");
        this.oGetClientStub.returns(null);

        const oExpectedHeaders = {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
            "Accept-Language": "en",
            "sap-language": "EN",
            Accept: "application/json, text/plain"
        };

        // Act
        await this.oRequest.refresh();

        // Assert
        assert.strictEqual(sandbox.server.requestCount, 1, "fake server handled one request");
        const oRequestHeaders = sandbox.server.getRequest(0).requestHeaders;
        Object.keys(oExpectedHeaders).forEach((sHeader) => {
            assert.strictEqual(oRequestHeaders[sHeader], oExpectedHeaders[sHeader], `Found correct header for ${sHeader}`);
        });
    });

    QUnit.module("Resolving UserDefaults", {
        beforeEach: async function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oLogErrorStub = sandbox.stub(Log, "error");

            const oFakeServer = sandbox.useFakeServer();
            oFakeServer.configure({ autoRespond: true });

            this.oSystemContext = {};
            this.oGetServiceAsyncStub.withArgs("ClientSideTargetResolution").resolves({
                getSystemContext: sandbox.stub().callsFake((sContentProviderId) => Promise.resolve({ id: sContentProviderId }))
            });

            this.sUrlWithResolvedUserDefaults = "http://b.c/some/resolved/absolute/url?sap-language=";
            this.oReferenceResolverService = {
                resolveUserDefaultParameters: sandbox.stub().resolves({ url: this.sUrlWithResolvedUserDefaults }),
                resolveSemanticDateRanges: sandbox.stub().callsFake((sUrl) => Promise.resolve({ url: sUrl }))
            };
            this.oGetServiceAsyncStub.withArgs("ReferenceResolver").resolves(this.oReferenceResolverService);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the resolved url", async function (assert) {
        // Arrange
        const sUrl = "initialUrl";
        const sContentProviderId = "someContentProvider";
        const oExpectedSystemContext = {
            id: sContentProviderId
        };

        // Act
        const oRequest = new DynamicTileRequest(sUrl, /*fnSuccess*/ sandbox.stub(), /*fnError*/ sandbox.stub(), sContentProviderId); // UserDefaults are resolved by constructor
        await oRequest._oInitialRefreshPromise;

        // Assert
        assert.strictEqual(sandbox.server.requestCount, 1, "fake server handled one request");
        assert.strictEqual(sandbox.server.getRequest(0).url, this.sUrlWithResolvedUserDefaults, "Called correct url");
        assert.deepEqual(this.oReferenceResolverService.resolveUserDefaultParameters.getCall(0).args, [sUrl, oExpectedSystemContext],
            "resolveUserDefaultParameters was called with the correct args");
    });

    QUnit.test("Returns undefined when user default values are missing", async function (assert) {
        // Arrange
        const sUrl = "initialUrl";
        const sContentProviderId = "someContentProvider";
        const oResolvedUrl = {
            defaultsWithoutValue: ["UserDefault.ABC"]
        };
        this.oReferenceResolverService.resolveUserDefaultParameters.resolves(oResolvedUrl);
        const sExpectedMessage = "The service URL contains User Default(s) with no set value: UserDefault.ABC";

        // Act
        const oRequest = new DynamicTileRequest(sUrl, /*fnSuccess*/ sandbox.stub(), /*fnError*/ sandbox.stub(), sContentProviderId); // UserDefaults are resolved by constructor
        await oRequest._oInitialRefreshPromise;

        // Assert
        assert.strictEqual(sandbox.server.requestCount, 0, "fake server handled no request");
        assert.strictEqual(this.oLogErrorStub.getCall(0).args[0], sExpectedMessage, "error was called with correct message");
    });

    QUnit.test("Returns undefined when user default values contain ignored references", async function (assert) {
        // Arrange
        const sUrl = "initialUrl";
        const sContentProviderId = "someContentProvider";
        const oResolvedUrl = {
            ignoredReferences: ["ABC", "DEF", "DynamicDate.GHI"]
        };
        this.oReferenceResolverService.resolveUserDefaultParameters.resolves(oResolvedUrl);
        const sExpectedMessage = "The service URL contains invalid Reference(s): ABC, DEF";

        // Act
        const oRequest = new DynamicTileRequest(sUrl, /*fnSuccess*/ sandbox.stub(), /*fnError*/ sandbox.stub(), sContentProviderId); // UserDefaults are resolved by constructor
        await oRequest._oInitialRefreshPromise;

        // Assert
        assert.strictEqual(sandbox.server.requestCount, 0, "fake server handled no request");
        assert.strictEqual(this.oLogErrorStub.getCall(0).args[0], sExpectedMessage, "error was called with correct message");
    });

    QUnit.module("destroy", {
        beforeEach: async function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oSystemContext = {};
            this.oGetServiceAsyncStub.withArgs("ClientSideTargetResolution").resolves({
                getSystemContext: sandbox.stub().callsFake((sContentProviderId) => Promise.resolve({ id: sContentProviderId }))
            });

            this.sUrlWithResolvedUserDefaults = "http://b.c/some/resolved/absolute/url?sap-language=";
            this.oGetServiceAsyncStub.withArgs("ReferenceResolver").resolves({
                resolveUserDefaultParameters: sandbox.stub().resolves({ url: this.sUrlWithResolvedUserDefaults })
            });

            this.oAbortStub = sandbox.stub(DynamicTileRequest.prototype, "abort");

            // refresh is called implicitly by constructor
            const oRefreshStub = sandbox.stub(DynamicTileRequest.prototype, "refresh").resolves();
            this.oRequest = new DynamicTileRequest("initialUrl", /*fnSuccess*/ sandbox.stub(), /*fnError*/ sandbox.stub(), "someContentProvider");
            await this.oRequest._oInitialRefreshPromise;
            oRefreshStub.restore();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Aborts running requests", function (assert) {
        // Act
        this.oRequest.destroy();

        // Assert
        assert.strictEqual(this.oAbortStub.callCount, 1, "abort was called once");
    });
});
