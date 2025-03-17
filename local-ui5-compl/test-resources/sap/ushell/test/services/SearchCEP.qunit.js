// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.SearchCEP
 */
sap.ui.define([
    "sap/ushell/services/SearchCEP",
    "sap/ushell/utils/WindowUtils",
    "sap/ushell/components/shell/SearchCEP/SearchProviders/SearchProvider",
    "sap/ushell/utils/UrlParsing",
    "sap/ushell/Container"
], function (
    SearchCEP,
    WindowUtils,
    SearchProvider,
    UrlParsing,
    Container
) {
    "use strict";

    /* global QUnit, sinon*/

    var sandbox = sinon.createSandbox({});

    QUnit.module("Constructor");

    QUnit.test("Initial Properties are set correctly", function (assert) {
        // Act
        var oFakeAdapter = {
            fake: true
        };
        var oSearchCEPService = new SearchCEP(oFakeAdapter);

        // Assert
        assert.strictEqual(oSearchCEPService.oAdapter, oFakeAdapter, "Adapter is initialized correctly");
    });

    QUnit.module("Test search function", {
        beforeEach: function () {
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("delegates to the adapter if it implements the search method", function (assert) {
        // Arrange
        var oFakeSearchResult = {
            result: "Fake"
        };
        var oAdapter = {
            search: sandbox.stub().resolves(oFakeSearchResult)
        };
        var oSearchCEPService = new SearchCEP(oAdapter);
        var oParameters = {
            searchTerm: "query"
        };

        // Act
        return oSearchCEPService.search(oParameters).then(function (oResult) {
            // Assert
            assert.deepEqual(oResult, oFakeSearchResult, "The correct result was returned");
            assert.strictEqual(oAdapter.search.callCount, 1, "oAdapter.search was called once");
            assert.deepEqual(oAdapter.search.getCall(0).args, [oParameters],
                "oAdapter.search was called with correct parameters");
        });
    });

    QUnit.module("The suggest function", {
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("delegates to the search method", function (assert) {
        // Arrange
        var oFakeSearchResult = {
            result: "Fake"
        };
        var oSearchCEPService = new SearchCEP();
        var oSearchStub = sandbox.stub(oSearchCEPService, "search").resolves(oFakeSearchResult);
        var oParameters = {
            searchTerm: "query"
        };

        // Act
        return oSearchCEPService.suggest(oParameters).then(function (oResult) {
            // Assert
            assert.deepEqual(oResult, oFakeSearchResult, "The correct result was returned");
            assert.strictEqual(oSearchStub.callCount, 1, "search was called once");
            assert.deepEqual(oSearchStub.getCall(0).args, [oParameters],
                "search was called with correct parameters");
        });
    });

    QUnit.test("resolves with an empty result if the adapter does not implement the search method", function (assert) {
        // Arrange
        var oSearchCEPService = new SearchCEP({});
        var oParameters = {
            searchTerm: "query"
        };

        // Act
        return oSearchCEPService.search(oParameters).then(function (oResult) {
            // Assert
            assert.strictEqual(oResult.count, 0,
                "The number of total results is zero");
            assert.deepEqual(oResult.data, [],
                "The results data is empty");
        });
    });

    QUnit.module("The navigate function", {
        beforeEach: function () {
            this.oSearchCEPService = new SearchCEP();
            this.oNavigationServiceStub = {
                navigate: sandbox.stub().resolves(undefined)
            };
            this.oContainerGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync").resolves(
                this.oNavigationServiceStub);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("resolves with undefined if called without url", function (assert) {
        // Arrange
        var oSearchResult = {
        };

        // Act
        return this.oSearchCEPService.navigate(oSearchResult).then(function (oResult) {
            // Assert
            assert.strictEqual(oResult, undefined, "The correct result was returned");
        });
    });

    QUnit.test("delegates to Navigation service if called with IBN URL", function (assert) {
        // Arrange
        var oSearchResult = {
            url: "#SemanticObject-action"
        };

        // Act
        return this.oSearchCEPService.navigate(oSearchResult).then(function (oResult) {
            // Assert
            assert.strictEqual(oResult, undefined, "The correct result was returned");
            assert.strictEqual(this.oNavigationServiceStub.navigate.callCount, 1,
                "oNavigationServiceStub.navigate was called once");
            assert.deepEqual(this.oNavigationServiceStub.navigate.getCall(0).args, [
                {
                    target: {
                        shellHash: oSearchResult.url
                    }
                }
            ],
            "NavigationService.navigate was called with correct parameters");
        }.bind(this));
    });

    QUnit.test("delegates to Navigation service if called with IBN URL and searchTerm", function (assert) {
        // Arrange
        var sSearchTerm = "Test",
            oShellHash = {
                semanticObject: "SemanticObject",
                action: "action",
                params: {
                    searchTerm: sSearchTerm
                }
            },
            sUrl = "SemanticObject-action?searchTerm=Test",
            oSearchResult = {
                url: "#SemanticObject-action"
        };
        this.oParseShellHashStub = sandbox.stub(UrlParsing, "parseShellHash").returns(oShellHash);
        // Act
        return this.oSearchCEPService.navigate(oSearchResult, sSearchTerm).then(function (oResult) {
            // Assert
            assert.strictEqual(oResult, undefined, "The correct result was returned");
            assert.strictEqual(this.oNavigationServiceStub.navigate.callCount, 1,
                "NavigationService.navigate was called once");
            assert.deepEqual(this.oNavigationServiceStub.navigate.getCall(0).args, [
                    {
                        target: {
                            shellHash: sUrl
                        }
                    }
                ],
                "NavigationService.navigate was called with correct parameters");
        }.bind(this));
    });

    QUnit.test("calls WindowUtils.openURL if called with standalone URL", function (assert) {
        // Arrange
        var oSearchResult = {
            url: "https://www.sap.com"
        };
        var oWindowUtilsOpenUrlStub = sandbox.stub(WindowUtils, "openURL");

        // Act
        return this.oSearchCEPService.navigate(oSearchResult).then(function (oResult) {
            // Assert
            assert.strictEqual(oResult, undefined, "The correct result was returned");
            assert.strictEqual(oWindowUtilsOpenUrlStub.callCount, 1,
                "WindowUtils.openURL was called once");
            assert.deepEqual(oWindowUtilsOpenUrlStub.getCall(0).args, [oSearchResult.url],
                "WindowUtils.openURL was called with correct parameters");
        });
    });

    QUnit.module("Test provider storage functions", {
        before: function () {
            var fnNoOpFunction = Function.prototype;
            this.oSearchCEPService = new SearchCEP();
            this.oDefaultProvider = SearchProvider.defaultProviders["applications"];
            this.oExternalProviderOne = {
                minQueryLength: 0,
                maxQueryLength: 0,
                priority: 5,
                execSearch: function () {
                    return Promise.resolve([{
                        icon: "sap-icon://flight",
                        text: "Check popular destinations",
                        press: fnNoOpFunction
                    }, {
                        icon: "sap-icon://suitcase",
                        text: "Book flights & hotels",
                        press: fnNoOpFunction
                    }, {
                        icon: "sap-icon://employee-lookup",
                        text: "Hire local guides",
                        press: fnNoOpFunction
                    }]);
                },
                id: "travelAppsList",
                title: "Your travel assistant"
            };
            this.oExternalProviderTwo = {
                priority: 3,
                execSearch: fnNoOpFunction,
                id: "travelAppsList2",
                title: "Your travel assistant"
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("add default provider", function (assert) {

        // Act
        return this.oSearchCEPService._registerDefaultSearchProvider(this.oDefaultProvider)
            .then(function (oResult) {
                // Assert
                assert.strictEqual(oResult, undefined, "The correct result was returned");
                return this.oSearchCEPService.getDefaultSearchProviders()
                    .then(function (aResult) {
                        assert.strictEqual(aResult.length, 1, "should be one default provider");
                        for (var sKey in this.oDefaultProvider) {
                            assert.propEqual(aResult[0][sKey], this.oDefaultProvider[sKey], "'" + sKey + "' property has correct value");
                        }
                    }.bind(this));
            }.bind(this));
    });

    QUnit.test("add two external providers", function (assert) {

        // Act
        var sKey,
            pFirstProviderPromise = this.oSearchCEPService.registerExternalSearchProvider(this.oExternalProviderOne),
            pSecondProviderPromise = this.oSearchCEPService.registerExternalSearchProvider(this.oExternalProviderTwo),
            pGetProvidersPromise = this.oSearchCEPService.getExternalSearchProviders();

        return Promise.all([
            pFirstProviderPromise,
            pSecondProviderPromise,
            pGetProvidersPromise
        ]).then(function (aResult) {
            // Assert
            assert.strictEqual(aResult[0], undefined, "Promise reolved for first provider");
            assert.strictEqual(aResult[1], undefined, "Promise reolved for second provider");
            assert.strictEqual(aResult[2].length, 2, "should be two external providers");

            var aProviders = aResult[2];

            for (sKey in this.oExternalProviderOne) {
                assert.propEqual(aProviders[0][sKey], this.oExternalProviderOne[sKey], "external provider 1 '" + sKey + "' property has correct value");
            }
            for (sKey in this.oExternalProviderTwo) {
                assert.propEqual(aProviders[1][sKey], this.oExternalProviderTwo[sKey], "external provider 2 '" + sKey + "' property has correct value");
            }
        }.bind(this));
    });

    QUnit.test("get all providers", function (assert) {

        // Act
        return this.oSearchCEPService.getSearchProviders()
            .then(function (oResult) {
                var sKey;
                // Assert
                assert.deepEqual(Object.keys(oResult), ["default", "external"], "object keys are correct");
                assert.ok(oResult["default"].hasOwnProperty(this.oDefaultProvider.id), true, "default provider is set");

                for (sKey in this.oDefaultProvider) {
                    assert.propEqual(oResult["default"][this.oDefaultProvider.id][sKey], this.oDefaultProvider[sKey], "default provider '" + sKey + "' property has correct value");
                }

                assert.ok(oResult["external"].hasOwnProperty(this.oExternalProviderTwo.id), true, "second external provider is set");
                for (sKey in this.oExternalProviderOne) {
                    assert.propEqual(oResult["external"][this.oExternalProviderTwo.id][sKey], this.oExternalProviderTwo[sKey], "external provider 1 '" + sKey + "' property has correct value");
                }

                assert.ok(oResult["external"].hasOwnProperty(this.oExternalProviderOne.id), true, "first external provider is set");
                for (sKey in this.oExternalProviderTwo) {
                    assert.propEqual(oResult["external"][this.oExternalProviderOne.id][sKey], this.oExternalProviderOne[sKey], "external provider 2 '" + sKey + "' property has correct value");
                }
            }.bind(this));
    });

    QUnit.test("get all providers sorted by priority", function (assert) {

        // Act
        return this.oSearchCEPService.getSearchProvidersPriorityArray()
            .then(function (aResult) {
                // Assert
                assert.strictEqual(aResult[0].id, this.oDefaultProvider.id, "first list is set according to its priority");
                assert.strictEqual(aResult[1].id, this.oExternalProviderTwo.id, "second list is set according to its priority");
                assert.strictEqual(aResult[2].id, this.oExternalProviderOne.id, "third list is set according to its priority");
            }.bind(this));
    });

    QUnit.test("get external providers sorted by priority", function (assert) {

        // Act
        return this.oSearchCEPService.getExternalSearchProvidersPriorityArray()
            .then(function (aResult) {
                // Assert
                assert.strictEqual(aResult[0].id, this.oExternalProviderTwo.id, "second list is set according to its priority");
                assert.strictEqual(aResult[1].id, this.oExternalProviderOne.id, "first list is set according to its priority");
            }.bind(this));
    });

    QUnit.test("remove external providers", function (assert) {

        // Act
        var pFirstProviderPromise = this.oSearchCEPService.unregisterExternalSearchProvider(this.oExternalProviderOne.id),
            pSecondProviderPromise = this.oSearchCEPService.unregisterExternalSearchProvider(this.oExternalProviderTwo.id),
            pGetProvidersPromise = this.oSearchCEPService.getExternalSearchProviders();

        return Promise.all([
            pFirstProviderPromise,
            pSecondProviderPromise,
            pGetProvidersPromise
        ]).then(function (aResult) {
            // Assert
            assert.strictEqual(aResult[0], undefined, "Promise reolved for first provider");
            assert.strictEqual(aResult[1], undefined, "Promise reolved for second provider");
            assert.strictEqual(aResult[2].length, 0, "should be no external providers");
        }.bind(this));
    });
});
