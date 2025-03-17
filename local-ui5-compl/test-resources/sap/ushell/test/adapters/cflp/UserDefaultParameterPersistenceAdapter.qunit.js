// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap/ushell/adapters/cflp/UserDefaultParameterPersistenceAdapter
 */
sap.ui.define([
    "sap/base/Log",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/adapters/cflp/UserDefaultParameterPersistenceAdapter",
    "sap/base/util/ObjectPath",
    "sap/ushell/Container"
], function (
    Log,
    jQuery,
    PersistenceAdapter,
    ObjectPath,
    Container
) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    function beforeEach () {
        this.sLanguage = "EN";
        this.sClient = "120";
        this.oGetUserStub = {
            getLanguage: sandbox.stub().returns(this.sLanguage)
        };
        this.oGetClientStub = {
            getClient: sandbox.stub().returns(this.sClient)
        };

        sandbox.stub(Container, "getUser").returns(this.oGetUserStub);
        sandbox.stub(Container, "getLogonSystem").returns(this.oGetClientStub);
    }

    QUnit.module("Constructor", {
        beforeEach: function () {
            beforeEach.call(this);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("storage for the Http Wrappers and containers is created", function (assert) {
        var oAdapter = new PersistenceAdapter();

        var bHasStorage = typeof oAdapter._mSystems === "object";

        assert.ok(bHasStorage, "a storage object is created");
    });

    QUnit.test("has the correct user default path configured", function (assert) {
        var oAdapter = new PersistenceAdapter();
        var sExpectedPathDefault = "/sap/opu/odata/UI2/INTEROP/";

        var bHasConfigObject = typeof oAdapter.oConfig === "object";

        assert.ok(bHasConfigObject, "a configuration object is created");
        assert.strictEqual(oAdapter.sBaseServicePath, sExpectedPathDefault, "base service path is set");
    });

    QUnit.test("uses a default service path if none provided", function (assert) {
        var oAdapter = new PersistenceAdapter();

        var bHasConfigObject = typeof oAdapter.oConfig === "object";

        assert.ok(bHasConfigObject, "a configuration object is created");
        assert.strictEqual(oAdapter.oConfig.sServicePath, oAdapter.sDefaultServicePath, "default service path is set");
        assert.strictEqual(oAdapter.oConfig.sBaseServicePath, oAdapter.sBaseServicePath, "base service path is set");
    });

    QUnit.test("uses a service path if provided", function (assert) {
        var oConfig = {
            userBaseServicePath: "my/path"
        };

        var oAdapter = new PersistenceAdapter({}, {}, oConfig);

        var bHasConfigObject = typeof oAdapter.oConfig === "object";

        assert.ok(bHasConfigObject, "a configuration object was created");
        assert.strictEqual(oAdapter.oConfig.sBaseServicePath, oConfig.userBaseServicePath, "provided service path is used");
    });

    QUnit.test("HTTP configuration created", function (assert) {
        var oAdapter = new PersistenceAdapter();

        var bHasConfig = typeof oAdapter.oConfig.oHttpClientConfig === "object";

        assert.ok(bHasConfig, "a config object was created");
    });

    QUnit.test("HTTP configuration: sap-language", function (assert) {
        var oAdapter = new PersistenceAdapter();

        assert.ok(this.oGetUserStub.getLanguage.calledOnce, "sap.ushell.Container.getUser().getLanguage was called");
        assert.strictEqual(oAdapter.oConfig.oHttpClientConfig["sap-language"], this.sLanguage, "language was set in configuration object");
    });

    QUnit.test("HTTP configuration: sap-client", function (assert) {
        var oAdapter = new PersistenceAdapter();

        assert.ok(this.oGetClientStub.getClient.calledOnce, "sap.ushell.Container.getLogonSystem().getClient was called");
        assert.strictEqual(oAdapter.oConfig.oHttpClientConfig["sap-client"], this.sClient, "client was set in configuration object");
    });

    QUnit.test("HTTP configuration: sap-statistics", function (assert) {
        var oAdapter = new PersistenceAdapter();

        assert.strictEqual(oAdapter.oConfig.oHttpClientConfig["sap-statistics"], true, "client was set in configuration object");
    });

    QUnit.test("HTTP configuration: headers' config initialized", function (assert) {
        var oAdapter = new PersistenceAdapter();

        var bHasHeader = typeof oAdapter.oConfig.oHttpClientConfig.headers === "object";

        assert.ok(bHasHeader, "header config created");
    });

    QUnit.test("HTTP configuration: headers - Accept", function (assert) {
        var oAdapter = new PersistenceAdapter();

        var bHasAcceptHeader = typeof oAdapter.oConfig.oHttpClientConfig.headers.Accept === "string";

        assert.ok(bHasAcceptHeader, "accept header was created");
        assert.strictEqual(oAdapter.oConfig.oHttpClientConfig.headers.Accept, "application/json", "Accept header was correctly set in configuration object");
    });

    QUnit.module("_getXHttpWrapper", {
        beforeEach: function () {
            beforeEach.call(this);
            this.sSystemAliasId = "systemAliasId";
            this.sFullyQualifiedXhrUrl = "test/";
            this.oGetFullyQualifiedXhrUrlStub = sandbox.stub().returns(this.sFullyQualifiedXhrUrl);
            this.oSystemContext = {
                id: this.sSystemAliasId,
                getFullyQualifiedXhrUrl: this.oGetFullyQualifiedXhrUrlStub
            };

            this.oConfig = {
                userBaseServicePath: "somePath"
            };

            this.oAdapter = new PersistenceAdapter({}, {}, this.oConfig);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("returns an XHttpClient instance", function (assert) {
        // It is NOT possible to stub the XHttpClient in any way!
        var oWrapper = this.oAdapter._getXHttpWrapper(this.oSystemContext);

        // There is no way to test for the instance itself. This is the closest you can get and
        // is similar to the method the HttpClient's own qUnit uses.
        var bIsWrapper = typeof oWrapper.post === "function" && typeof oWrapper.get === "function" &&
            typeof oWrapper.put === "function" && typeof oWrapper.delete === "function" &&
            typeof oWrapper.options === "function";

        assert.ok(bIsWrapper, "_getXHttpWrapper returns an XHttpClient instance");
    });

    QUnit.test("calls getFullyQualifiedXhrUrl correctly", function (assert) {
        this.oAdapter._getXHttpWrapper(this.oSystemContext);

        assert.strictEqual(this.oGetFullyQualifiedXhrUrlStub.callCount, 1, "getFullyQualifiedXhrUrl was called once");
        assert.deepEqual(this.oGetFullyQualifiedXhrUrlStub.getCall(0).args, [this.oConfig.userBaseServicePath], "getFullyQualifiedXhrUrl called with the correct parameter");
    });

    QUnit.test("stores the XHttpClient instance correctly", function (assert) {
        this.oAdapter._mSystems = {};

        var oWrapper = this.oAdapter._getXHttpWrapper(this.oSystemContext);

        var bPropertyExists = typeof this.oAdapter._mSystems[this.sSystemAliasId] === "object";
        var oStoredWrapper = this.oAdapter._mSystems[this.sSystemAliasId].oHttpWrapper;

        assert.ok(bPropertyExists, "an entry for the wrapper was created");
        assert.strictEqual(oWrapper, oStoredWrapper, "the wrapper was stored");
    });

    QUnit.test("returns the correct XHttpClient instance", function (assert) {
        this.oAdapter._mSystems = {
            wrapper1: 1,
            wrapper2: 2
        };
        var oTestWrapper = {
            my: "wrapper"
        };
        this.oAdapter._mSystems[this.sSystemAliasId] = { oHttpWrapper: oTestWrapper };

        var oWrapper = this.oAdapter._getXHttpWrapper(this.oSystemContext);

        assert.strictEqual(oWrapper, oTestWrapper, "the correct wrapper was returned");
    });

    QUnit.module("_isValidParameterName", {
        beforeEach: function () {
            beforeEach.call(this);
            this.oAdapter = new PersistenceAdapter();
            this.oLogSpy = sandbox.spy(Log, "error");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("returns true if parameter name valid", function (assert) {
        var bVAlidity = this.oAdapter._isValidParameterName("SomeParmeterName");

        assert.ok(bVAlidity, "_isValidParameterName returned true");
    });

    QUnit.test("returns false if parameter name is too long and logs the error", function (assert) {
        var sParameterName = "SomeParmeterNameThatIsWayTooLongItAlmostTellsYouAStoryInsteadOfBeingAConciseAParameterName";
        var sExpectedErrorMessage = "Illegal Parameter Key. Parameter must be less than 40 characters and [A-Za-z0-9.-_]+ :\"" + sParameterName + "\"";

        var bVAlidity = this.oAdapter._isValidParameterName(sParameterName);

        assert.notOk(bVAlidity, "_isValidParameterName returned true");
        assert.ok(this.oLogSpy.calledOnce, "Log was called");
        assert.ok(this.oLogSpy.calledWith(sExpectedErrorMessage), "correct message was logged");
    });

    QUnit.test("returns false if parameter contains special characters and logs the error", function (assert) {
        var sParameterName = "$1";
        var sExpectedErrorMessage = "Illegal Parameter Key. Parameter must be less than 40 characters and [A-Za-z0-9.-_]+ :\"" + sParameterName + "\"";

        var bVAlidity = this.oAdapter._isValidParameterName(sParameterName);

        assert.notOk(bVAlidity, "_isValidParameterName returned true");
        assert.ok(this.oLogSpy.calledOnce, "Log was called");
        assert.ok(this.oLogSpy.calledWith(sExpectedErrorMessage), "correct message was logged");
    });

    QUnit.test("returns false if parameter is empty and logs the error", function (assert) {
        var sParameterName = "";
        var sExpectedErrorMessage = "Illegal Parameter Key. Parameter must be less than 40 characters and [A-Za-z0-9.-_]+ :\"" + sParameterName + "\"";

        var bVAlidity = this.oAdapter._isValidParameterName(sParameterName);

        assert.notOk(bVAlidity, "_isValidParameterName returned true");
        assert.ok(this.oLogSpy.calledOnce, "Log was called");
        assert.ok(this.oLogSpy.calledWith(sExpectedErrorMessage), "correct message was logged");
    });

    QUnit.module("_getUserDefaultParameterContainer", {
        beforeEach: function () {
            beforeEach.call(this);
            this.oAdapter = new PersistenceAdapter();
            this.sSystemAliasId = "systemAliasId";
            this.oSystemContext = {
                id: this.sSystemAliasId
            };

            this.aContainerDataMock = [
                {
                    containerId: "sap.ushell.UserDefaultParameter",
                    containerCategory: "P",
                    id: this.sSystemAliasId,
                    category: "P",
                    value: "myData"
                }
            ];

            var oResponseTextMock = {
                d: {
                    PersContainerItems: {
                        results: this.aContainerDataMock
                    }
                }
            };

            /** From _HttpClient/internals.summariseResponse, a response looks like:
            {
                status: oXhr.status,
                statusText: oXhr.statusText,
                responseText: oXhr.responseText,
                responseHeaders: oXhr.getAllResponseHeaders()
            }
            */
            this.oServerResponseData = {
                status: "oXhr.status",
                statusText: "oXhr.statusText",
                responseText: JSON.stringify(oResponseTextMock),
                responseHeaders: "oXhr.getAllResponseHeaders()"
            };

            this.oHttpClientStub = {
                get: sandbox.stub().resolves(this.oServerResponseData)
            };

            // Indirect stubbing of HttpClient - no other way to do this, as HttpClient is non-writable
            this.oStub = sandbox.stub(this.oAdapter, "_getXHttpWrapper").callsFake(function (oSystemContext) {
                if (!this.oAdapter._mSystems[oSystemContext.id]) {
                    this.oAdapter._mSystems[oSystemContext.id] = {};
                }
                return this.oHttpClientStub;
            }.bind(this));

            this.oAdapter._mSystems = {};
            this.oAdapter._mSystems[this.sSystemAliasId] = {
                oHttpWrapper: this.oHttpClientStub
            };
        },

        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("returns a JQuery promise", function (assert) {
        var fnDone = assert.async();
        var oReturnValue = this.oAdapter._getUserDefaultParameterContainer(this.oSystemContext);

        oReturnValue.always(function () {
            assert.ok(true, "returns a JQuery promise");
            fnDone();
        });
    });

    QUnit.test("returns the cached data if existent", function (assert) {
        var fnDone = assert.async();
        var oDeferred = new jQuery.Deferred();

        this.testData = { some: "Data" };
        this.oAdapter._mSystems[this.oSystemContext.id] = {
            oHttpWrapper: {},
            oContainerCache: oDeferred.resolve(this.testData).promise()
        };

        var oReturnValue = this.oAdapter._getUserDefaultParameterContainer(this.oSystemContext);

        oReturnValue.done(function (oData) {
            assert.strictEqual(oData, this.testData, "the cached data was retrieved");
            fnDone();
        }.bind(this));
    });

    QUnit.test("requests an HttpWrapper to _getXHttpWrapper if none exists", function (assert) {
        var fnDone = assert.async();
        this.oAdapter._mSystems = {};

        var oReturnValue = this.oAdapter._getUserDefaultParameterContainer(this.oSystemContext);

        oReturnValue.done(function () {
            assert.ok(this.oStub.calledOnce, "_getXHttpWrapper was called");
            assert.ok(this.oStub.calledWith(this.oSystemContext), "_getXHttpWrapper called with the correct parameter");
            fnDone();
        }.bind(this));
    });

    QUnit.test("returns a rejected promise if the HttpWrapper creation fails", function (assert) {
        var fnDone = assert.async();
        this.oAdapter._mSystems = {};
        var sErrorMessage = "IllegalArgumentError: one or more of the arguments is invalid";
        // Need a different stub for the error
        this.oStub.callsFake(function () {
            throw new Error(sErrorMessage);
        });

        var oReturnValue = this.oAdapter._getUserDefaultParameterContainer(this.oSystemContext);

        oReturnValue.done(function () {
            assert.ok(false, "the promise was rejected");
            fnDone();
        });
        oReturnValue.fail(function (oError) {
            assert.ok(true, "the promise was rejected");
            assert.strictEqual(oError, sErrorMessage, "the expected error message was returned");
            fnDone();
        });
    });

    QUnit.test("(server call) makes a get call if no container is cached", function (assert) {
        var fnDone = assert.async();

        var oReturnValue = this.oAdapter._getUserDefaultParameterContainer(this.oSystemContext);

        oReturnValue.done(function () {
            assert.ok(this.oHttpClientStub.get.calledOnce, "The get method was called");
            fnDone();
        }.bind(this));
    });

    QUnit.test("(server call) requests data with a get call using the correct parameters", function (assert) {
        var fnDone = assert.async();

        var sExpectedPathParameter = "PersContainers(category='P',id='sap.ushell.UserDefaultParameter')?$expand=PersContainerItems";

        var oReturnValue = this.oAdapter._getUserDefaultParameterContainer(this.oSystemContext);

        oReturnValue.done(function () {
            assert.ok(this.oHttpClientStub.get.calledOnce, "The get method was called");
            assert.ok(this.oHttpClientStub.get.calledWith(sExpectedPathParameter), "The get method was called with the expected parameters");
            fnDone();
        }.bind(this));
    });

    QUnit.test("(server call) stores the data in the corresponding cache", function (assert) {
        var fnDone = assert.async();
        var oReturnValue = this.oAdapter._getUserDefaultParameterContainer(this.oSystemContext);

        oReturnValue.done(function () {
            var oStoredDataPromise = this.oAdapter._mSystems[this.sSystemAliasId].oContainerCache;
            oStoredDataPromise.done(function (aStoredData) {
                assert.deepEqual(aStoredData, this.aContainerDataMock, "returned data was stored in the cache");
                fnDone();
            }.bind(this));
        }.bind(this));
    });

    QUnit.test("(server call) JSON.parses responseText", function (assert) {
        var fnDone = assert.async();
        sandbox.spy(JSON, "parse");
        var oReturnValue = this.oAdapter._getUserDefaultParameterContainer(this.oSystemContext);

        oReturnValue.done(function () {
            assert.ok(JSON.parse.calledOnce, "JSON.parse was called");
            assert.ok(JSON.parse.calledWith(this.oServerResponseData.responseText), "JSON.parse was called with the corresponding data");
            fnDone();
        }.bind(this));
    });

    QUnit.test("(server call) returns the parsed data", function (assert) {
        var fnDone = assert.async();
        var oReturnValue = this.oAdapter._getUserDefaultParameterContainer(this.oSystemContext);

        oReturnValue.done(function (aReturnedData) {
            assert.deepEqual(aReturnedData, this.aContainerDataMock, "correct data was returned");
            fnDone();
        }.bind(this));
    });

    QUnit.test("(server call) rejects the promise if the HTTP call fails", function (assert) {
        var fnDone = assert.async();
        var oServerResponseData = {
            status: 500,
            statusText: "Something went wrong",
            responseText: "",
            responseHeaders: "oXhr.getAllResponseHeaders()"
        };
        this.sErrorMessage = "Server error: Something went wrong";

        this.oHttpClientStub.get.returns(Promise.reject(oServerResponseData));

        var oReturnValue = this.oAdapter._getUserDefaultParameterContainer(this.oSystemContext);

        oReturnValue.fail(function (sMessage) {
            assert.ok(true, "promise was rejected");
            assert.strictEqual(sMessage, this.sErrorMessage, "error message was forwarded");
            fnDone();
        }.bind(this));
        oReturnValue.done(function () {
            assert.ok(false, "promise was rejected");
            fnDone();
        });
    });

    QUnit.test("(server call) handles a 404 response as an empty responseText", function (assert) {
        // not found is not an error, it simply means
        // there's nothing to load
        var fnDone = assert.async();
        var oServerResponseData = {
            status: 404,
            statusText: "Not found",
            responseText: "",
            responseHeaders: "oXhr.getAllResponseHeaders()"
        };
        this.oHttpClientStub.get.returns(Promise.reject(oServerResponseData));

        var oReturnValue = this.oAdapter._getUserDefaultParameterContainer(this.oSystemContext);

        oReturnValue.done(function () {
            var oStoredDataPromise = this.oAdapter._mSystems[this.sSystemAliasId].oContainerCache;
            assert.ok(true, "the promise was resolved");
            oStoredDataPromise.done(function (oStoredData) {
                assert.deepEqual(oStoredData, [], "empty data was stored in the cache");
                fnDone();
            });
        }.bind(this));
        oReturnValue.fail(function () {
            assert.ok(false, "The promise was rejected");
            fnDone();
        });
    });

    QUnit.module("loadParameterValue", {
        beforeEach: function () {
            beforeEach.call(this);
            this.oAdapter = new PersistenceAdapter();
            this.sParameterName = "ChartOfAccounts";
            this.oSystemContext = {
                the: "context"
            };

            var oDeferred = new jQuery.Deferred();

            this.oCachedData = [{
                id: "CompanyCode",
                value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 10:08:09 GMT+0200 (Central European Summer Time)\"}, \"value\": \"someCompanyCode\"}"
            }, {
                id: "ChartOfAccounts",
                value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 10:08:09 GMT+0200 (Central European Summer Time)\"}, \"value\": \"someCompanyCode\"}"
            }];

            this.oGetUserDefaultParameterContainerStub = sandbox.stub(this.oAdapter, "_getUserDefaultParameterContainer");
            this.oGetUserDefaultParameterContainerStub.returns(oDeferred.resolve(this.oCachedData).promise());

            this.oValidatorStub = sandbox.stub(this.oAdapter, "_isValidParameterName").returns(true);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("returns a jQuery promise", function (assert) {
        var fnDone = assert.async();
        var oReturnValue = this.oAdapter.loadParameterValue(this.sParameterName, this.oSystemContext);

        oReturnValue.always(function () {
            assert.ok(true, "returns a JQuery promise");
            fnDone();
        });
    });

    QUnit.test("request the container calling _getUserDefaultParameterContainer", function (assert) {
        var fnDone = assert.async();
        var oReturnValue = this.oAdapter.loadParameterValue(this.sParameterName, this.oSystemContext);

        oReturnValue.always(function () {
            assert.ok(this.oAdapter._getUserDefaultParameterContainer.calledOnce, "_getUserDefaultParameterContainer was called");
            fnDone();
        }.bind(this));
    });

    QUnit.test("calls _getUserDefaultParameterContainer with the correct parameters", function (assert) {
        var fnDone = assert.async();
        var oReturnValue = this.oAdapter.loadParameterValue(this.sParameterName, this.oSystemContext);

        oReturnValue.always(function () {
            assert.ok(this.oAdapter._getUserDefaultParameterContainer(this.oSystemContext), "_getUserDefaultParameterContainer called with the correct parameter");
            fnDone();
        }.bind(this));
    });

    QUnit.test("Promise resolves to a rich parameter object {value: \"value\"}", function (assert) {
        var fnDone = assert.async();

        var oReturnValue = this.oAdapter.loadParameterValue(this.sParameterName, this.oSystemContext);

        oReturnValue.always(function (oReturnedData) {
            var bIsObject = typeof oReturnedData === "object";
            var bHasValue = oReturnedData.hasOwnProperty("value");
            assert.ok(bIsObject, "Promise resolves to an object");
            assert.ok(bHasValue, "Object contains a value");
            fnDone();
        });
    });

    QUnit.test("processes and returns the requested data correctly", function (assert) {
        var fnDone = assert.async();

        var oReturnValue = this.oAdapter.loadParameterValue(this.sParameterName, this.oSystemContext);

        oReturnValue.always(function (oReturnedData) {
            var oExpectedResponse = JSON.parse(this.oCachedData[0].value);
            assert.deepEqual(oReturnedData, oExpectedResponse, "The expected data was returned");
            fnDone();
        }.bind(this));
    });

    QUnit.test("checks if the parameter name is valid", function (assert) {
        var fnDone = assert.async();

        var oReturnValue = this.oAdapter.loadParameterValue(this.sParameterName, this.oSystemContext);

        oReturnValue.done(function () {
            assert.ok(this.oAdapter._isValidParameterName.calledOnce, "The validator was called");
            assert.ok(this.oAdapter._isValidParameterName.calledWith(this.sParameterName), "The validator was called with the correct parameter");
            fnDone();
        }.bind(this));
    });

    QUnit.test("rejects the promise if parameterName is not valid", function (assert) {
        var fnDone = assert.async();
        this.oAdapter._isValidParameterName.returns(false);

        var oReturnValue = this.oAdapter.loadParameterValue(this.sParameterName, this.oSystemContext);

        oReturnValue.fail(function () {
            assert.ok(true, "Promise was rejected");
            fnDone();
        });
        oReturnValue.done(function () {
            assert.ok(false, "Promise wasn't rejected");
        });
    });

    QUnit.test("rejects the promise with an error message if parameterName is not valid", function (assert) {
        var fnDone = assert.async();
        this.oAdapter._isValidParameterName.returns(false);

        var oReturnValue = this.oAdapter.loadParameterValue(this.sParameterName, this.oSystemContext);

        oReturnValue.fail(function (oReturnedData) {
            var sExpectedResponse = "Illegal Parameter Key. Parameter must be less than 40 characters and [A-Za-z0-9.-_]+ :\"" + this.sParameterName + "\"";
            assert.ok(true, "Promise was rejected");
            assert.notOk(this.oAdapter._getUserDefaultParameterContainer.called, "No atempt was made to retrieve the data");
            assert.strictEqual(oReturnedData, sExpectedResponse, "The expected data was returned");
            fnDone();
        }.bind(this));
        oReturnValue.done(function () {
            assert.ok(false, "Promise wasn't rejected");
        });
    });

    QUnit.test("rejects the promise if parameter does not exist", function (assert) {
        var fnDone = assert.async();
        var sFakeParameter = "MySuperDuperParameter";
        var sExpectedMessage = "Parameter does not exist: " + sFakeParameter;

        var oReturnValue = this.oAdapter.loadParameterValue(sFakeParameter, this.oSystemContext);

        oReturnValue.fail(function (oReturnedData) {
            assert.strictEqual(oReturnedData, sExpectedMessage, "The correct error message was returned");
            fnDone();
        });
        oReturnValue.done(function () {
            assert.notOk(true, "promise was resolved");
        });
    });

    QUnit.test("rejects the promsise if call to _getUserDefaultParameterContainer fails", function (assert) {
        var fnDone = assert.async();
        var oDeferred = new jQuery.Deferred();
        var sErrorMessage = "Some error message";

        this.oAdapter._getUserDefaultParameterContainer.returns(oDeferred.reject(sErrorMessage).promise());

        var oReturnValue = this.oAdapter.loadParameterValue(this.sParameterName, this.oSystemContext);

        oReturnValue.fail(function (oReturnedData) {
            assert.strictEqual(oReturnedData, sErrorMessage, "The correct error message was returned");
            fnDone();
        });
        oReturnValue.done(function () {
            assert.notOk(true, "promise was resolved");
        });
    });

    QUnit.module("getStoredParameterNames", {
        beforeEach: function () {
            beforeEach.call(this);
            this.oAdapter = new PersistenceAdapter();
            this.oSystemContext = {
                the: "context"
            };

            var oDeferred = new jQuery.Deferred();

            this.oCachedData = [{
                id: "CompanyCode",
                value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 10:08:09 GMT+0200 (Central European Summer Time)\"}}"
            }, {
                id: "ChartOfAccounts",
                value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 10:08:09 GMT+0200 (Central European Summer Time)\"}}"
            }];

            this.oGetUserDefaultParameterContainerStub = sandbox.stub(this.oAdapter, "_getUserDefaultParameterContainer");
            this.oGetUserDefaultParameterContainerStub.returns(oDeferred.resolve(this.oCachedData).promise());
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("getStoredParameterNames retrieves the stored data from _getUserDefaultParameterContainer", function (assert) {
        var fnDone = assert.async();
        var oReturnValue = this.oAdapter.getStoredParameterNames(this.oSystemContext);

        oReturnValue.always(function () {
            assert.ok(true, "returns a JQuery promise");
            assert.ok(this.oAdapter._getUserDefaultParameterContainer.calledOnce, "_getUserDefaultParameterContainer was called");
            assert.ok(this.oAdapter._getUserDefaultParameterContainer.calledWith(this.oSystemContext), "_getUserDefaultParameterContainer was called with the system context");
            fnDone();
        }.bind(this));
    });

    QUnit.test("getStoredParameterNames returns an array with the parameter names", function (assert) {
        var fnDone = assert.async();
        var aExpectedReturn = [
            "CompanyCode",
            "ChartOfAccounts"
        ];

        var oReturnValue = this.oAdapter.getStoredParameterNames(this.oSystemContext);

        oReturnValue.done(function (oResponse) {
            // Test does not assume any order for the array
            oResponse.sort();
            aExpectedReturn.sort();
            assert.deepEqual(oResponse, aExpectedReturn, "The expected parameters were returned");
            fnDone();
        });
    });

    QUnit.test("getStoredParameterNames returns an ordered array with the parameter names", function (assert) {
        var fnDone = assert.async();
        var aExpectedReturn = [
            "ChartOfAccounts",
            "CompanyCode"
        ];

        var oReturnValue = this.oAdapter.getStoredParameterNames(this.oSystemContext);

        oReturnValue.done(function (oResponse) {
            assert.deepEqual(oResponse, aExpectedReturn, "The expected parameters were returned");
            fnDone();
        });
    });

    QUnit.test("getStoredParameterNames forwards the error message from _getUserDefaultParameterContainer", function (assert) {
        var fnDone = assert.async();
        var oDeferred = new jQuery.Deferred();
        var sErrorMessage = "Some error message";

        this.oAdapter._getUserDefaultParameterContainer.returns(oDeferred.reject(sErrorMessage).promise());

        var oReturnValue = this.oAdapter.getStoredParameterNames(this.oSystemContext);

        oReturnValue.fail(function (oResponse) {
            assert.strictEqual(oResponse, sErrorMessage, "The expected parameters were returned");
            fnDone();
        });
    });

    QUnit.module("saveParameterValue", {
        beforeEach: function () {
            beforeEach.call(this);
            this.sParameterNameMock = "someParameter";
            this.oValueMock = {
                value: "someValue"
            };
            this.oSystemContextMock = {
                id: "system1"
            };
            this.aContainerMock = [
                {
                    id: "anotherParameter",
                    value: "{\"value\":\"anotherValue\"}"
                }
            ];
            this.oRequestMock = {
                id: "someRequest"
            };

            this.oAdapter = new PersistenceAdapter();

            this.oIsValidParameterNameStub = sandbox.stub(this.oAdapter, "_isValidParameterName");
            this.oIsValidParameterNameStub.withArgs(this.sParameterNameMock).returns(true);
            this.oPostStub = sandbox.stub();
            this.oPostStub.withArgs("PersContainers", this.oRequestMock).resolves();
            this.oGetXHttpWrapperStub = sandbox.stub(this.oAdapter, "_getXHttpWrapper");
            this.oGetXHttpWrapperStub.withArgs(this.oSystemContextMock).returns({
                post: this.oPostStub
            });
            this.oGetUserDefaultParameterContainerStub = sandbox.stub(this.oAdapter, "_getUserDefaultParameterContainer");
            this.oGetUserDefaultParameterContainerStub.withArgs(this.oSystemContextMock).returns(new jQuery.Deferred().resolve(this.aContainerMock));
            this.oCreateRequestStub = sandbox.stub(this.oAdapter, "_createRequest");
            this.oCreateRequestStub.returns(this.oRequestMock);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Resolves if saving was successful", function (assert) {
        // Arrange
        // Act
        return this.oAdapter.saveParameterValue(this.sParameterNameMock, this.oValueMock, this.oSystemContextMock)
            .then(function () {
                // Assert
                assert.ok(true, "Promise resolved");
            });
    });

    QUnit.test("Calls necessary private methods", function (assert) {
        // Arrange
        // Act
        return this.oAdapter.saveParameterValue(this.sParameterNameMock, this.oValueMock, this.oSystemContextMock)
            .then(function () {
                // Assert
                assert.strictEqual(this.oIsValidParameterNameStub.callCount, 1, "_isValidParameterName was called once");
                assert.strictEqual(this.oPostStub.callCount, 1, "post was called once");
                assert.strictEqual(this.oGetXHttpWrapperStub.callCount, 1, "_getXHttpWrapper was called once");
                assert.strictEqual(this.oGetUserDefaultParameterContainerStub.callCount, 1, "_getUserDefaultParameterContainer was called once");
                assert.strictEqual(this.oCreateRequestStub.callCount, 1, "_createRequest was called once");
            }.bind(this));
    });

    QUnit.test("Updates cache if value didn't exist", function (assert) {
        // Arrange
        var aExpectedContainer = [
            {
                id: "anotherParameter",
                value: "{\"value\":\"anotherValue\"}"
            }, {
                category: "I",
                containerCategory: "P",
                containerId: "sap.ushell.UserDefaultParameter",
                id: "someParameter",
                value: "{\"value\":\"someValue\"}"
            }
        ];
        // Act
        return this.oAdapter.saveParameterValue(this.sParameterNameMock, this.oValueMock, this.oSystemContextMock)
            .then(function () {
                // Assert
                assert.deepEqual(this.aContainerMock, aExpectedContainer, "cache was updated");
            }.bind(this));
    });

    QUnit.test("Updates cache if value exists", function (assert) {
        // Arrange
        this.oIsValidParameterNameStub.withArgs("anotherParameter").returns(true);
        var aExpectedContainer = [
            {
                id: "anotherParameter",
                value: "{\"value\":\"someValue\"}"
            }
        ];
        // Act
        return this.oAdapter.saveParameterValue("anotherParameter", this.oValueMock, this.oSystemContextMock)
            .then(function () {
                // Assert
                assert.deepEqual(this.aContainerMock, aExpectedContainer, "cache was updated");
            }.bind(this));
    });

    QUnit.test("Rejects if post fails", function (assert) {
        var done = assert.async();
        // Arrange
        var oExpectedError = {
            message: "someMessage"
        };
        this.oPostStub.withArgs("PersContainers", sinon.match.any).rejects(oExpectedError);
        // Act
        this.oAdapter.saveParameterValue(this.sParameterNameMock, this.oValueMock, this.oSystemContextMock)
            .then(function () {
                assert.ok(false, "Promise should be rejected");
            })
            .fail(function (oError) {
                // Assert
                assert.ok(true, "Rejected as expected");
                assert.strictEqual(oError, oExpectedError, "Returned the correct error message");
            })
            .always(done);
    });

    QUnit.test("Rejects if _getUserDefaultParameterContainer fails", function (assert) {
        var done = assert.async();
        // Arrange
        var oExpectedError = {
            message: "someMessage"
        };
        this.oGetUserDefaultParameterContainerStub.withArgs(this.oSystemContextMock).returns(new jQuery.Deferred().reject(oExpectedError));
        // Act
        this.oAdapter.saveParameterValue(this.sParameterNameMock, this.oValueMock, this.oSystemContextMock)
            .then(function () {
                assert.ok(false, "Promise should be rejected");
            })
            .fail(function (sError) {
                // Assert
                assert.ok(true, "Rejected as expected");
                assert.strictEqual(sError, oExpectedError, "Returned the correct error message");
            })
            .always(done);
    });

    QUnit.test("Rejects if parameterName is invalid", function (assert) {
        var done = assert.async();
        // Arrange
        this.oIsValidParameterNameStub.withArgs("anotherParam").returns(false);
        var sExpectedError = "Illegal Parameter Key. Parameter must be less than 40 characters and [A-Za-z0-9.-_]+ :\"anotherParam\"";
        // Act
        this.oAdapter.saveParameterValue("anotherParam", this.oValueMock, this.oSystemContextMock)
            .then(function () {
                assert.ok(false, "Promise should be rejected");
            })
            .fail(function (sError) {
                // Assert
                assert.ok(true, "Rejected as expected");
                assert.strictEqual(sError, sExpectedError, "Returned the correct error message");
            })
            .always(done);
    });

    QUnit.module("deleteParameter", {
        beforeEach: function () {
            beforeEach.call(this);
            this.sParameterNameMock = "someParameter";
            this.oValueMock = {
                value: "someValue"
            };
            this.oSystemContextMock = {
                id: "system1"
            };
            this.aContainerMock = [
                {
                    id: "someParameter",
                    value: "{\"value\":\"someValue\"}"
                }, {
                    id: "anotherParameter",
                    value: "{\"value\":\"anotherValue\"}"
                }
            ];
            this.oRequestMock = {
                id: "someRequest"
            };

            this.oAdapter = new PersistenceAdapter();

            this.oIsValidParameterNameStub = sandbox.stub(this.oAdapter, "_isValidParameterName");
            this.oIsValidParameterNameStub.withArgs(this.sParameterNameMock).returns(true);
            this.oPostStub = sandbox.stub();
            this.oPostStub.withArgs("PersContainers", this.oRequestMock).resolves();
            this.oGetXHttpWrapperStub = sandbox.stub(this.oAdapter, "_getXHttpWrapper");
            this.oGetXHttpWrapperStub.withArgs(this.oSystemContextMock).returns({
                post: this.oPostStub
            });
            this.oGetUserDefaultParameterContainerStub = sandbox.stub(this.oAdapter, "_getUserDefaultParameterContainer");
            this.oGetUserDefaultParameterContainerStub.withArgs(this.oSystemContextMock).returns(new jQuery.Deferred().resolve(this.aContainerMock));
            this.oCreateRequestStub = sandbox.stub(this.oAdapter, "_createRequest");
            this.oCreateRequestStub.returns(this.oRequestMock);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Resolves if deleting was successful", function (assert) {
        // Arrange
        // Act
        return this.oAdapter.deleteParameter(this.sParameterNameMock, this.oSystemContextMock)
            .then(function () {
                // Assert
                assert.ok(true, "Promise resolved");
            });
    });

    QUnit.test("Calls necessary private methods", function (assert) {
        // Arrange
        // Act
        return this.oAdapter.deleteParameter(this.sParameterNameMock, this.oSystemContextMock)
            .then(function () {
                // Assert
                assert.strictEqual(this.oIsValidParameterNameStub.callCount, 1, "_isValidParameterName was called once");
                assert.strictEqual(this.oPostStub.callCount, 1, "post was called once");
                assert.strictEqual(this.oGetXHttpWrapperStub.callCount, 1, "_getXHttpWrapper was called once");
                assert.strictEqual(this.oGetUserDefaultParameterContainerStub.callCount, 1, "_getUserDefaultParameterContainer was called once");
                assert.strictEqual(this.oCreateRequestStub.callCount, 1, "_createRequest was called once");
            }.bind(this));
    });

    QUnit.test("Updates cache if value exist", function (assert) {
        // Arrange
        var aExpectedContainer = [
            {
                id: "anotherParameter",
                value: "{\"value\":\"anotherValue\"}"
            }
        ];
        // Act
        return this.oAdapter.deleteParameter(this.sParameterNameMock, this.oSystemContextMock)
            .then(function () {
                // Assert
                assert.deepEqual(this.aContainerMock, aExpectedContainer, "cache was updated");
            }.bind(this));
    });

    QUnit.test("Does not do any update if value does not exist", function (assert) {
        // Arrange
        this.oIsValidParameterNameStub.withArgs("unknownParameter").returns(true);
        var aExpectedContainer = [
            {
                id: "someParameter",
                value: "{\"value\":\"someValue\"}"
            }, {
                id: "anotherParameter",
                value: "{\"value\":\"anotherValue\"}"
            }
        ];
        // Act
        return this.oAdapter.deleteParameter("unknownParameter", this.oSystemContextMock)
            .then(function () {
                // Assert
                assert.deepEqual(this.aContainerMock, aExpectedContainer, "cache was not updated");
                assert.strictEqual(this.oPostStub.callCount, 0, "post was not called");
            }.bind(this));
    });

    QUnit.test("Rejects if post fails", function (assert) {
        var done = assert.async();
        // Arrange
        var oExpectedError = {
            message: "someMessage"
        };
        this.oPostStub.withArgs("PersContainers", sinon.match.any).rejects(oExpectedError);
        // Act
        this.oAdapter.deleteParameter(this.sParameterNameMock, this.oSystemContextMock)
            .then(function () {
                assert.ok(false, "Promise should be rejected");
            })
            .fail(function (oError) {
                // Assert
                assert.ok(true, "Rejected as expected");
                assert.strictEqual(oError, oExpectedError, "Returned the correct error message");
            })
            .always(done);
    });

    QUnit.test("Rejects if _getUserDefaultParameterContainer fails", function (assert) {
        var done = assert.async();
        // Arrange
        var oExpectedError = {
            message: "someMessage"
        };
        this.oGetUserDefaultParameterContainerStub.withArgs(this.oSystemContextMock).returns(new jQuery.Deferred().reject(oExpectedError));
        // Act
        this.oAdapter.deleteParameter(this.sParameterNameMock, this.oSystemContextMock)
            .then(function () {
                assert.ok(false, "Promise should be rejected");
            })
            .fail(function (sError) {
                // Assert
                assert.ok(true, "Rejected as expected");
                assert.strictEqual(sError, oExpectedError, "Returned the correct error message");
            })
            .always(done);
    });

    QUnit.test("Rejects if parameterName is invalid", function (assert) {
        var done = assert.async();
        // Arrange
        this.oIsValidParameterNameStub.withArgs("anotherParam").returns(false);
        var sExpectedError = "Illegal Parameter Key. Parameter must be less than 40 characters and [A-Za-z0-9.-_]+ :\"anotherParam\"";
        // Act
        this.oAdapter.deleteParameter("anotherParam", this.oSystemContextMock)
            .then(function () {
                assert.ok(false, "Promise should be rejected");
            })
            .fail(function (sError) {
                // Assert
                assert.ok(true, "Rejected as expected");
                assert.strictEqual(sError, sExpectedError, "Returned the correct error message");
            })
            .always(done);
    });

    QUnit.module("_createRequest", {
        beforeEach: function () {
            beforeEach.call(this);
            this.oAdapter = new PersistenceAdapter();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the correct Object", function (assert) {
        // Arrange
        var aContainerMock = [
            {
                id: "someParameter",
                value: "{\"value\":\"someValue\"}"
            }
        ];
        var oExpectedResult = {
            data: {
                PersContainerItems: aContainerMock,
                appName: "",
                category: "P",
                component: "",
                id: "sap.ushell.UserDefaultParameter"
            },
            headers: {
                "content-type": "application/json",
                accept: "application/json"
            }
        };
        // Act
        var oResult = this.oAdapter._createRequest(aContainerMock);
        // Assert
        assert.deepEqual(oResult, oExpectedResult, "returned the correct result");
    });

    QUnit.module("Component tests - server success", {
        // Note: using one module for the whole API to avoid adding some 75 lines of raw data twice or thrice.
        beforeEach: function () {
            beforeEach.call(this);
            this.oAdapter = new PersistenceAdapter();

            // We want to test responses from several systems
            this.oFakeSystems = {
                firstSystem: {
                    systemContext: {
                        getFullyQualifiedXhrUrl: sandbox.stub().returns("http://first.sys.tem"),
                        id: "firstSystem"
                    },
                    httpClientStub: {}
                },
                secondSystem: {
                    systemContext: {
                        getFullyQualifiedXhrUrl: sandbox.stub().returns("http://second.sys.tem"),
                        id: "secondSystem"
                    },
                    httpClientStub: {}
                }
            };

            var mSystemsResponses = {
                "http://first.sys.tem": {
                    d: {
                        __metadata: {
                            id: "/sap/opu/odata/UI2/INTEROP/PersContainers(id='sap.ushell.UserDefaultParameter',category='P')",
                            uri: "/sap/opu/odata/UI2/INTEROP/PersContainers(id='sap.ushell.UserDefaultParameter',category='P')",
                            type: "INTEROP.PersContainer"
                        },
                        id: "sap.ushell.UserDefaultParameter",
                        category: "P",
                        validity: 0,
                        clientExpirationTime: "Date(253373439600000)",
                        component: "",
                        appName: "",
                        PersContainerItems: {
                            results: [{
                                __metadata: {
                                    id: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='CompanyCode',category='I')",
                                    uri: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='CompanyCode',category='I')",
                                    type: "INTEROP.PersContainerItem"
                                },
                                containerId: "sap.ushell.UserDefaultParameter",
                                containerCategory: "P",
                                id: "CompanyCode",
                                category: "I",
                                value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 10:08:09 GMT+0200 (Central European Summer Time)\"}}"
                            }, {
                                __metadata: {
                                    id: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='ChartOfAccounts',category='I')",
                                    uri: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='ChartOfAccounts',category='I')",
                                    type: "INTEROP.PersContainerItem"
                                },
                                containerId: "sap.ushell.UserDefaultParameter",
                                containerCategory: "P",
                                id: "ChartOfAccounts",
                                category: "I",
                                value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 10:08:09 GMT+0200 (Central European Summer Time)\"}}"
                            }, {
                                __metadata: {
                                    id: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='ChartOfAccounts',category='I')",
                                    uri: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='ChartOfAccounts',category='I')",
                                    type: "INTEROP.PersContainerItem"
                                },
                                containerId: "sap.ushell.UserDefaultParameter",
                                containerCategory: "P",
                                id: "DoubleData",
                                category: "I",
                                value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 10:08:09 GMT+0200 (Central European Summer Time)\"}}"
                            }]
                        }
                    }
                },
                "http://second.sys.tem": {
                    d: {
                        __metadata: {
                            id: "/sap/opu/odata/UI2/INTEROP/PersContainers(id='sap.ushell.UserDefaultParameter',category='P')",
                            uri: "/sap/opu/odata/UI2/INTEROP/PersContainers(id='sap.ushell.UserDefaultParameter',category='P')",
                            type: "INTEROP.PersContainer"
                        },
                        id: "sap.ushell.UserDefaultParameter",
                        category: "P",
                        validity: 0,
                        clientExpirationTime: "Date(253373439600000)",
                        component: "",
                        appName: "",
                        PersContainerItems: {
                            results: [{
                                __metadata: {
                                    id: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='CompanyCode',category='I')",
                                    uri: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='CompanyCode',category='I')",
                                    type: "INTEROP.PersContainerItem"
                                },
                                containerId: "sap.ushell.UserDefaultParameter",
                                containerCategory: "P",
                                id: "CompanyPO",
                                category: "I",
                                value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 10:08:09 GMT+0200 (Central European Summer Time)\"}}"
                            }, {
                                __metadata: {
                                    id: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='ChartOfAccounts',category='I')",
                                    uri: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='ChartOfAccounts',category='I')",
                                    type: "INTEROP.PersContainerItem"
                                },
                                containerId: "sap.ushell.UserDefaultParameter",
                                containerCategory: "P",
                                id: "ChartOfDevelopers",
                                category: "I",
                                value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 10:08:09 GMT+0200 (Central European Summer Time)\"}}"
                            }, {
                                __metadata: {
                                    id: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='ChartOfAccounts',category='I')",
                                    uri: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='ChartOfAccounts',category='I')",
                                    type: "INTEROP.PersContainerItem"
                                },
                                containerId: "sap.ushell.UserDefaultParameter",
                                containerCategory: "P",
                                id: "DoubleData",
                                category: "I",
                                value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 24 2019 10:08:09 GMT+0200 (Central European Summer Time)\"}}"
                            }]
                        }
                    }
                }
            };

            // Indirect stubbing of HttpClient - no other way to do this, as HttpClient is non-writable
            this.oStub = sandbox.stub(this.oAdapter, "_getXHttpWrapper").callsFake(function (oSystemContext) {
                var sUrl = oSystemContext.getFullyQualifiedXhrUrl();
                var sData = JSON.stringify(mSystemsResponses[sUrl]);
                var oServerResponseData = {
                    status: 200,
                    statusText: "ok",
                    responseText: sData,
                    responseHeaders: ""
                };
                var oFakeClient = {
                    get: sandbox.stub().returns(Promise.resolve(oServerResponseData))
                };
                // store the stub for reference in the tests!
                this.oAdapter._mSystems[oSystemContext.id] = {};
                this.oAdapter._mSystems[oSystemContext.id].oHttpWrapper = oFakeClient;
                this.oFakeSystems[oSystemContext.id].httpClientStub = oFakeClient;
                return oFakeClient;
            }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("getStoredParameterNames - requests data from the server and returns it", function (assert) {
        var fnDone = assert.async();
        var aExpectedNames = [
            "ChartOfAccounts",
            "CompanyCode",
            "DoubleData"
        ];
        var oFirstSystemContext = this.oFakeSystems.firstSystem.systemContext;

        var oReturnValue = this.oAdapter.getStoredParameterNames(oFirstSystemContext);

        oReturnValue.done(function (aDataReceived) {
            assert.ok(true, "returns a JQuery promise");
            assert.ok(this.oFakeSystems.firstSystem.httpClientStub.get.calledOnce, "HttpClient was called");
            assert.deepEqual(aDataReceived, aExpectedNames, "the requested data was successfully returned");
            fnDone();
        }.bind(this));
    });

    QUnit.test("getStoredParameterNames - several calls trigger only one request", function (assert) {
        var fnDone = assert.async();
        var aExpectedNames = [
            "ChartOfAccounts",
            "CompanyCode",
            "DoubleData"
        ];
        var oFirstSystemContext = this.oFakeSystems.firstSystem.systemContext;
        var oReturnValue = this.oAdapter.getStoredParameterNames(oFirstSystemContext);

        oReturnValue.done(function () {
            var oSecondCall = this.oAdapter.getStoredParameterNames(oFirstSystemContext);
            oSecondCall.done(function (aDataReceived) {
                assert.ok(true, "returns a JQuery promise");
                assert.deepEqual(aDataReceived, aExpectedNames, "the requested data was successfully returned");
                assert.ok(this.oFakeSystems.firstSystem.httpClientStub.get.calledOnce, "HttpClient was called only once");
                fnDone();
            }.bind(this));
        }.bind(this));
    });

    QUnit.test("getStoredParameterNames - calls to different systems return different data", function (assert) {
        var fnDone = assert.async();
        var aFirstExpectedNames = [
            "ChartOfAccounts",
            "CompanyCode",
            "DoubleData"
        ];
        var aSecondExpectedNames = [
            "ChartOfDevelopers",
            "CompanyPO",
            "DoubleData"
        ];
        var oFirstSystemContext = this.oFakeSystems.firstSystem.systemContext;
        var oSecondSystemContext = this.oFakeSystems.secondSystem.systemContext;

        var oFirstReturnValue = this.oAdapter.getStoredParameterNames(oFirstSystemContext);
        var oSecondReturnValue = this.oAdapter.getStoredParameterNames(oSecondSystemContext);

        jQuery.when(oFirstReturnValue, oSecondReturnValue).done(function (aFirstDataReceived, aSecondDataReceived) {
            assert.deepEqual(aFirstDataReceived, aFirstExpectedNames, "the requested data was successfully returned from the first system");
            assert.deepEqual(aSecondDataReceived, aSecondExpectedNames, "the requested data was successfully returned from the second system");
            fnDone();
        });
    });

    QUnit.test("loadParameterValue - requests data from the server and returns it", function (assert) {
        var fnDone = assert.async();
        var oFirstSystemContext = this.oFakeSystems.firstSystem.systemContext;
        var sParameterName = "ChartOfAccounts";
        var oExpectedData = JSON.parse("{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 10:08:09 GMT+0200 (Central European Summer Time)\"}}");

        var oReturnValue = this.oAdapter.loadParameterValue(sParameterName, oFirstSystemContext);

        oReturnValue.done(function (oDataReceived) {
            assert.deepEqual(oDataReceived, oExpectedData, "the expected data was returned");
            fnDone();
        });
    });

    QUnit.test("loadParameterValue - several calls only retrieve the data from the server once", function (assert) {
        var fnDone = assert.async();
        var oFirstSystemContext = this.oFakeSystems.firstSystem.systemContext;
        var sFirstParameterName = "ChartOfAccounts";
        var sSecondParameterName = "CompanyCode";

        var oFirstReturnValue = this.oAdapter.loadParameterValue(sFirstParameterName, oFirstSystemContext);
        var oSecondReturnValue = this.oAdapter.loadParameterValue(sSecondParameterName, oFirstSystemContext);

        jQuery.when(oFirstReturnValue, oSecondReturnValue).done(function () {
            assert.ok(this.oFakeSystems.firstSystem.httpClientStub.get.calledOnce, "HttpClient was called only once");
            fnDone();
        }.bind(this));
    });

    QUnit.test("loadParameterValue - different data is returned for different systems", function (assert) {
        var fnDone = assert.async();

        var oFirstSystemContext = this.oFakeSystems.firstSystem.systemContext;
        var oSecondSystemContext = this.oFakeSystems.secondSystem.systemContext;
        var sParameterName = "DoubleData";
        var oFirstExpectedData = JSON.parse("{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 10:08:09 GMT+0200 (Central European Summer Time)\"}}");
        var oSecondExpectedData = JSON.parse("{\"_shellData\":{\"storeDate\":\"Fri Aug 24 2019 10:08:09 GMT+0200 (Central European Summer Time)\"}}");

        var oFirstReturnValue = this.oAdapter.loadParameterValue(sParameterName, oFirstSystemContext);
        var oSecondReturnValue = this.oAdapter.loadParameterValue(sParameterName, oSecondSystemContext);

        jQuery.when(oFirstReturnValue, oSecondReturnValue).done(function (oFirstDataReceived, oSecondDataReceived) {
            assert.deepEqual(oFirstDataReceived, oFirstExpectedData, "the requested data was successfully returned from the first system");
            assert.deepEqual(oSecondDataReceived, oSecondExpectedData, "the requested data was successfully returned from the second system");
            fnDone();
        });
    });

    QUnit.test("loadParameterValue & getStoredParameterNames - several calls only retrieve the data from the server once", function (assert) {
        var fnDone = assert.async();
        var oFirstSystemContext = this.oFakeSystems.firstSystem.systemContext;
        var sFirstParameterName = "ChartOfAccounts";
        var sSecondParameterName = "CompanyCode";

        var oFirstReturnValue = this.oAdapter.getStoredParameterNames(oFirstSystemContext);
        var oSecondReturnValue = this.oAdapter.loadParameterValue(sFirstParameterName, oFirstSystemContext);
        var oThirdReturnValue = this.oAdapter.loadParameterValue(sSecondParameterName, oFirstSystemContext);

        jQuery.when(oFirstReturnValue, oSecondReturnValue, oThirdReturnValue).done(function (oDataReceived) {
            assert.ok(this.oFakeSystems.firstSystem.httpClientStub.get.calledOnce, "HttpClient was called only once");
            fnDone();
        }.bind(this));
    });

    QUnit.test("loadParameterValue - failure, parameter name doesn't exist", function (assert) {
        var fnDone = assert.async();
        var oFirstSystemContext = this.oFakeSystems.firstSystem.systemContext;
        var sFakeParameter = "aVeryStableGenius";
        var sExpectedMessage = "Parameter does not exist: " + sFakeParameter;
        var oReturnValue = this.oAdapter.loadParameterValue(sFakeParameter, oFirstSystemContext);

        oReturnValue.fail(function (oError) {
            assert.ok(true, "promise was rejected");
            assert.ok(this.oFakeSystems.firstSystem.httpClientStub.get.called, "HttpClient was called");
            assert.strictEqual(oError, sExpectedMessage, "the expected error message was returned");
            fnDone();
        }.bind(this));
    });

    QUnit.test("loadParameterValue - failure, parameter name invalid", function (assert) {
        var fnDone = assert.async();
        var oFirstSystemContext = this.oFakeSystems.firstSystem.systemContext;
        var sParameterName = "WayTooLong&%$/()_>2332andinvalidCharacters";
        var sExpectedErrorMessage = "Illegal Parameter Key. Parameter must be less than 40 characters and [A-Za-z0-9.-_]+ :\"" + sParameterName + "\"";

        var oReturnValue = this.oAdapter.loadParameterValue(sParameterName, oFirstSystemContext);

        oReturnValue.fail(function (oError) {
            var bHttpWrapperExists = !!this.oAdapter._mSystems[oFirstSystemContext.id];
            assert.ok(true, "promise was rejected");
            assert.notOk(bHttpWrapperExists, "HttpClient was not initialized");
            assert.strictEqual(oError, sExpectedErrorMessage, "the expected error message was returned");
            fnDone();
        }.bind(this));
    });

    QUnit.module("Component tests - test failure", {
        beforeEach: function () {
            beforeEach.call(this);
            this.oAdapter = new PersistenceAdapter();

            // We want to test responses from several systems
            this.oFakeSystems = {
                firstSystem: {
                    systemContext: {
                        getFullyQualifiedXhrUrl: sandbox.stub().returns("http://first.sys.tem"),
                        id: "firstSystem"
                    },
                    httpClientStub: {}
                }
            };
            this.oSystemContext = this.oFakeSystems.firstSystem.systemContext;

            this.oServerResponseData = {
                status: 200,
                statusText: "ok",
                responseText: "",
                responseHeaders: ""
            };
            this.oFakeClient = {
                get: sandbox.stub().returns(Promise.resolve(this.oServerResponseData))
            };
            this.fnFakeHttpClient = function (oSystemContext) {
                // store the stub for reference in the tests!
                this.oAdapter._mSystems[oSystemContext.id] = {
                    oHttpWrapper: this.oFakeClient
                };
                this.oFakeSystems[oSystemContext.id].httpClientStub = this.oFakeClient;
                return this.oFakeClient;
            }.bind(this);

            // Indirect stubbing of HttpClient - no other way to do this, as HttpClient is non-writable
            this.oStub = sandbox.stub(this.oAdapter, "_getXHttpWrapper").callsFake(this.fnFakeHttpClient);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("getStoredParameterNames - HttpClient rejects the promise without a 404", function (assert) {
        var fnDone = assert.async();
        this.oServerResponseData = {
            status: 150,
            statusText: "so not ok",
            responseText: "",
            responseHeaders: ""
        };
        this.oFakeClient = {
            get: sandbox.stub().returns(Promise.reject(this.oServerResponseData))
        };
        var sExpectedErrorMessage = "Server error: " + this.oServerResponseData.statusText;

        var oReturnValue = this.oAdapter.getStoredParameterNames(this.oSystemContext);

        oReturnValue.fail(function (oError) {
            assert.ok(true, "promise was rejected");
            assert.strictEqual(oError, sExpectedErrorMessage, "the expected error message was returned");
            fnDone();
        });
    });

    QUnit.test("getStoredParameterNames - HttpClient rejects the promise with a 404", function (assert) {
        var fnDone = assert.async();
        this.oServerResponseData = {
            status: 404,
            statusText: "so not ok",
            responseText: "",
            responseHeaders: ""
        };
        this.oFakeClient = {
            get: sandbox.stub().returns(Promise.reject(this.oServerResponseData))
        };
        // An empty response will be treated as empty array by the internal parser
        var sExpectedData = [];

        var oReturnValue = this.oAdapter.getStoredParameterNames(this.oSystemContext);

        oReturnValue.done(function (oData) {
            assert.ok(true, "promise was resolved");
            assert.deepEqual(oData, sExpectedData, "a 404 response generated an empty response");
            fnDone();
        });
    });
});

