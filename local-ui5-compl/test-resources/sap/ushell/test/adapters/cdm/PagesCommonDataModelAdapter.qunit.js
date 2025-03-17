// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.adapters.cdm.PagesCommonDataModelAdapter
 */
sap.ui.define([
    "sap/base/Log",
    "sap/base/util/ObjectPath",
    "sap/ushell/adapters/cdm/PagesCommonDataModelAdapter",
    "sap/ushell/adapters/cdm/util/cdmSiteUtils",
    "sap/ushell/services/PersonalizationV2",
    "sap/ushell/Config",
    "sap/ushell/library",
    "sap/ushell/Container"
], function (
    Log,
    ObjectPath,
    PagesCDMAdapter,
    cdmSiteUtils,
    PersonalizationV2,
    Config,
    ushellLibrary,
    Container
) {
    "use strict";

    var DisplayFormat = ushellLibrary.DisplayFormat;
    const { KeyCategory, WriteFrequency } = PersonalizationV2.prototype;

    /* global sinon, QUnit */

    var sandbox = sinon.createSandbox({});

    QUnit.dump.maxDepth = 10;

    QUnit.module("The constructor");

    QUnit.test("initializes all the class properties", function (assert) {
        // Act
        var oCDMAdapter = new PagesCDMAdapter();

        // Assert
        assert.deepEqual(oCDMAdapter._oCDMPagesRequests, {}, "The constructor sets the property _oCDMPagesRequests to an empty object.");
        assert.deepEqual(oCDMAdapter._oUnstableVisualizations, {}, "The constructor sets the property _oUnstableVisualizations to an empty object.");
        assert.strictEqual(oCDMAdapter._sComponent, "sap.ushell.adapters.cdm.PagesCommonDataModelAdapter",
            "The constructor sets the property _sComponent to 'sap.ushell.adapters.cdm.PagesCommonDataModelAdapter'.");
        assert.ok(oCDMAdapter.oSitePromise instanceof Promise, "The constructor sets the property oSitePromise to a Promise");
    });

    QUnit.module("The function getPersonalization", {
        beforeEach: function () {
            this.oExpectedScope = {
                validity: "Infinity",
                keyCategory: "GENERATED_KEY",
                writeFrequency: "HIGH",
                clientStorageAllowed: false
            };

            this.oExpectedPersId = {
                container: "sap.ushell.cdm3-1.personalization",
                item: "data"
            };
            this.oGetServiceAsyncStub = sandbox.stub();
            this.oGetPersonalizerStub = sandbox.stub();
            this.oGetPersDataStub = sandbox.stub();

            this.oGetPersDataStub.resolves({});
            this.oGetPersonalizerStub.resolves({
                getPersData: this.oGetPersDataStub
            });
            this.oGetServiceAsyncStub.withArgs("PersonalizationV2").resolves({
                getPersonalizer: this.oGetPersonalizerStub,
                KeyCategory,
                WriteFrequency
            });
            sandbox.stub(Container, "getServiceAsync").callsFake(this.oGetServiceAsyncStub);

            this.oCDMAdapter = new PagesCDMAdapter();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("gets the correct container for version 3.1.0", function (assert) {
        var fnDone = assert.async();

        this.oCDMAdapter.getPersonalization("3.1.0")
            .done(function () {
                assert.ok(true);
                assert.strictEqual(this.oGetPersonalizerStub.callCount, 1, "getPersonalization is called exactly once");
                assert.deepEqual(this.oGetPersonalizerStub.getCall(0).args, [this.oExpectedPersId, this.oExpectedScope],
                    "getPersonalizer is called with correct parameters meaning correct container is used");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "Promise was rejected");
            })
            .always(function () {
                fnDone();
            });
    });

    QUnit.test("gets the correct container for version 3.2.0", function (assert) {
        var fnDone = assert.async();

        this.oCDMAdapter.getPersonalization("3.2.0")
            .done(function () {
                assert.strictEqual(this.oGetPersonalizerStub.callCount, 1, "getPersonalization is called exactly once");
                assert.deepEqual(this.oGetPersonalizerStub.getCall(0).args, [this.oExpectedPersId, this.oExpectedScope],
                    "getPersonalizer is called with correct parameters meaning correct container is used");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "Promise was rejected");
            })
            .always(function () {
                fnDone();
            });
    });

    QUnit.test("returns a personalization delta", function (assert) {
        var fnDone = assert.async();
        this.oCDMAdapter.getPersonalization("page1")
            .done(function (oPersDelta) {
                assert.ok(oPersDelta, {}, "delta was returned");
            })
            .fail(function () {
                assert.ok(false, "Should not fail when Page Id was provided");
            })
            .always(function () {
                fnDone();
            });
    });

    QUnit.test("rejects when getPersonalizer rejects", function (assert) {
        var fnDone = assert.async();
        this.oGetPersDataStub.returns(Promise.reject("getPersData rejected"));
        this.oCDMAdapter.getPersonalization("page1")
            .done(function () {
                assert.ok(false, "should have rejected and failed");
            })
            .fail(function () {
                assert.ok(true, "Promise was rejected successfully");
            })
            .always(function () {
                fnDone();
            });
    });

    QUnit.test("errors out when the Personalization service could not be loaded", function (assert) {
        var fnDone = assert.async();
        this.oGetServiceAsyncStub.withArgs("PersonalizationV2").rejects({});
        this.oCDMAdapter.getPersonalization("page1")
            .done(function () {
                assert.ok(false, "should have rejected and failed");
            })
            .fail(function () {
                assert.ok(true, "Promise was rejected successfully");
            })
            .always(function () {
                fnDone();
            });
    });

    QUnit.module("The function setPersonalization", {
        beforeEach: function () {
            this.oExpectedScope = {
                validity: "Infinity",
                keyCategory: "GENERATED_KEY",
                writeFrequency: "HIGH",
                clientStorageAllowed: false
            };

            this.oExpectedPersId = {
                container: "sap.ushell.cdm3-1.personalization",
                item: "data"
            };

            this.oGetServiceAsyncStub = sandbox.stub();
            this.oGetPersonalizerStub = sandbox.stub();
            this.oGetPersDataStub = sandbox.stub();
            this.oSetPersDataStub = sandbox.stub();

            this.oGetPersDataStub.resolves({});
            this.oSetPersDataStub.resolves({});

            this.oGetPersonalizerStub.resolves({
                getPersData: this.oGetPersDataStub,
                setPersData: this.oSetPersDataStub
            });
            this.oGetServiceAsyncStub.withArgs("PersonalizationV2").resolves({
                getPersonalizer: this.oGetPersonalizerStub,
                KeyCategory,
                WriteFrequency
            });

            sandbox.stub(Container, "getServiceAsync").callsFake(this.oGetServiceAsyncStub);

            this.oCDMAdapter = new PagesCDMAdapter();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("saves to the correct container for version 3.1.0", function (assert) {
        var fnDone = assert.async();

        this.oCDMAdapter.setPersonalization({ version: "3.1.0" })
            .done(function () {
                assert.strictEqual(this.oGetPersonalizerStub.callCount, 1, "getPersonalization is called exactly once");
                assert.deepEqual(this.oGetPersonalizerStub.getCall(0).args, [this.oExpectedPersId, this.oExpectedScope],
                    "getPersonalizer is called with correct parameters meaning correct container is used");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "Promise was rejected");
            })
            .always(function () {
                fnDone();
            });
    });

    QUnit.test("saves to the correct container for version 3.2.0", function (assert) {
        var fnDone = assert.async();

        this.oCDMAdapter.setPersonalization({ version: "3.2.0" })
            .done(function () {
                assert.strictEqual(this.oGetPersonalizerStub.callCount, 1, "getPersonalization is called exactly once");
                assert.deepEqual(this.oGetPersonalizerStub.getCall(0).args, [this.oExpectedPersId, this.oExpectedScope],
                    "getPersonalizer is called with correct parameters meaning correct container is used");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "Promise was rejected");
            })
            .always(function () {
                fnDone();
            });
    });

    QUnit.test("errors out if the personalization service could not be loaded", function (assert) {
        var fnDone = assert.async();
        this.oGetServiceAsyncStub.withArgs("PersonalizationV2").rejects({});

        this.oCDMAdapter.setPersonalization({})
            .done(function () {
                assert.ok(false, "The promise was not rejected");
            })
            .fail(function () {
                assert.ok(true, "The method rejects if the personalization service is not available");
            })
            .always(function () {
                fnDone();
            });
    });

    QUnit.test("saves the personalization and resolves promise", function (assert) {
        var fnDone = assert.async();
        this.oGetPersDataStub.resolves(undefined);
        this.oCDMAdapter.setPersonalization({}, "page1")
            .done(function () {
                assert.ok(true, "promise was correctly resolved after saving delta");
                assert.strictEqual(this.oSetPersDataStub.callCount, 1, "SetPersData was called exactly once");
            }.bind(this))
            .always(function () {
                fnDone();
            });
    });

    QUnit.test("rejects when getPersonalizer rejects", function (assert) {
        var fnDone = assert.async();
        this.oSetPersDataStub.returns(Promise.reject("getPersData rejected"));
        this.oCDMAdapter.setPersonalization({}, "page1")
            .done(function () {
                assert.ok(false, "should have rejected and failed");
            })
            .fail(function () {
                assert.ok(true, "Promise was rejected successfully");
            })
            .always(function () {
                fnDone();
            });
    });

    QUnit.module("The function getSite", {
        beforeEach: function () {
            this.oNavigationDataMock = {
                inbounds: [{ "inbound-1": { permanentKey: "permanentKey-1" } }],
                systemAliases: { id: "systemAliases" }
            };

            this.oGetNavigationDataStub = sandbox.stub().returns(this.oNavigationDataMock);

            this.oGetServiceAsyncStub = sandbox.stub();
            this.oGetServiceAsyncStub.withArgs("NavigationDataProvider").resolves({
                getNavigationData: this.oGetNavigationDataStub
            });

            sandbox.stub(Container, "getServiceAsync").callsFake(this.oGetServiceAsyncStub);

            this.oApplicationsMock = {
                "application-1": { id: "application-1" },
                "application-2": { id: "application-2" }
            };

            this.oGetApplicationsStub = sandbox.stub(cdmSiteUtils, "getApplications").returns(this.oApplicationsMock);

            this.oCDMAdapter = new PagesCDMAdapter();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("resolves to a CDM 3.1 site with visualizations, applications, vizTypes and systemsAlias filled", function (assert) {
        // Arrange
        var oExpectedResult = {
            _version: "3.1.0",
            site: {},
            catalogs: {},
            groups: {},
            visualizations: {},
            applications: this.oApplicationsMock,
            vizTypes: {},
            systemAliases: { id: "systemAliases" },
            pages: {}
        };

        // Act
        return this.oCDMAdapter.getSite().done(function (site) {
            assert.deepEqual(site, oExpectedResult, "A CDM 3.1 site with correct data is returned.");
            assert.strictEqual(this.oGetServiceAsyncStub.callCount, 1, "The function 'GetServiceAsync' is called three times.");
            assert.strictEqual(this.oGetNavigationDataStub.callCount, 1, "The function 'getNavigationData' is called once.");
            assert.strictEqual(this.oGetApplicationsStub.callCount, 1, "The function 'getApplications' is called once.");
            this.oCDMAdapter.oSitePromise.then(function (oSite) {
                assert.deepEqual(oSite, oExpectedResult, "The property 'oSitePromise' resolves to a site oject with correct data.");
            });
        }.bind(this));
    });

    QUnit.test("rejects the jQuery.Deferred.Promise and the oSitePromise if 'getServiceAsync' fails", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oGetServiceAsyncStub.withArgs("NavigationDataProvider").rejects();
        this.oGetServiceAsyncStub.withArgs("VisualizationDataProvider").rejects();

        // Act
        this.oCDMAdapter.getSite()
            .done(function () {
                assert.ok(false, "The jQuery.Deferred.Promise was resolved instead of rejected.");
            })
            .fail(function () {
                assert.ok(true, "The jQuery.Deferred.Promise was rejected.");
                this.oCDMAdapter.oSitePromise.catch(function () {
                    assert.ok(true, "The oSitePromise was rejected.");
                });
            }.bind(this))
            .always(function () {
                fnDone();
            });
    });

    QUnit.test("rejects the jQuery.Deferred.Promise and the oSitePromise if 'getNavigationData' fails", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oGetNavigationDataStub.rejects();

        // Act
        this.oCDMAdapter.getSite()
            .done(function () {
                assert.ok(false, "The jQuery.Deferred.Promise was resolved instead of rejected.");
            })
            .fail(function () {
                assert.ok(true, "The jQuery.Deferred.Promise was rejected.");
                this.oCDMAdapter.oSitePromise.catch(function () {
                    assert.ok(true, "The oSitePromise was rejected.");
                });
            }.bind(this))
            .always(function () {
                fnDone();
            });
    });

    QUnit.module("The function getPage", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub();
            sandbox.stub(Container, "getServiceAsync").callsFake(this.oGetServiceAsyncStub);

            this.oPage1 = { id: "page-1" };
            this.oPage2 = { id: "page-2" };
            this.oViz1 = { id: "viz-1" };
            this.oVizType1 = { id: "vizType-1" };
            this.oSiteMock = {
                pages: { "page-1": this.oPage1 },
                visualizations: {},
                vizTypes: {}
            };

            this.oNavigationDataMock = { id: "NavigationData" };
            this.oGetNavigationDataStub = sandbox.stub().resolves(this.oNavigationDataMock);
            this.oGetServiceAsyncStub.withArgs("NavigationDataProvider").resolves({
                getNavigationData: this.oGetNavigationDataStub
            });

            this.oPagePersistenceDataMock = {
                page: this.oPage2,
                visualizations: { "viz-1": this.oViz1 },
                vizTypes: { "vizType-1": this.oVizType1 }
            };
            this.oGetPageStub = sandbox.stub().withArgs("page-2").resolves(this.oPagePersistenceDataMock);
            this.oGetServiceAsyncStub.withArgs("PagePersistence").resolves({
                getPage: this.oGetPageStub
            });

            this.oLogFatalStub = sandbox.stub(Log, "fatal");

            this.oCDMAdapter = new PagesCDMAdapter();
            this.oCDMAdapter.oSitePromise = Promise.resolve(this.oSiteMock);

            this.oAddPageToSiteStub = sandbox.stub(this.oCDMAdapter, "_addPageToSite").callsFake(function (oSite, oPage /*oNavigationData*/) {
                oSite.pages[oPage.id] = oPage;
            });
            this.oAddVisualizationsToSiteStub = sandbox.stub(this.oCDMAdapter, "_addVisualizationsToSite").callsFake(function (oSite, oVisualizations /*oUrlParsingService*/) {
                var oFirstViz = Object.values(oVisualizations)[0];
                oSite.visualizations[oFirstViz.id] = oFirstViz;
            });
            this.oAddVizTypesToSiteStub = sandbox.stub(this.oCDMAdapter, "_addVizTypesToSite").callsFake(function (oSite, oData) {
                var oFirstVizType = Object.values(oData.vizTypes)[0];
                oSite.vizTypes[oFirstVizType.id] = oFirstVizType;
            });
            this.oStoreUnstableVisualizationsStub = sandbox.stub(this.oCDMAdapter, "_storeUnstableVisualizations");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the existing page if the page with given pageId already exists in the CDM 3.1 site", function (assert) {
        //Act
        return this.oCDMAdapter.getPage("page-1")
            .then(function (page) {
                //Assert
                assert.strictEqual(page, this.oPage1, "The existing page was returned");
            }.bind(this));
    });

    QUnit.test("Inserts the page into the CDM site and returns the page when all services are working properly", function (assert) {
        //Act
        return this.oCDMAdapter.getPage("page-2")
            .then(function (page) {
                //Assert
                assert.deepEqual(page, this.oPage2, "Expected result was returned");

                var aExpectedArgs = [this.oSiteMock, this.oPage2, this.oNavigationDataMock];
                assert.deepEqual(this.oAddPageToSiteStub.getCall(0).args, aExpectedArgs, "_addPageToSite was called with correct args");

                assert.strictEqual(this.oSiteMock.pages[this.oPage2.id], this.oPage2, "The page was correctly added");
            }.bind(this));
    });

    QUnit.test("Inserts the visualizations and vizTypes to the site", function (assert) {
        //Act
        return this.oCDMAdapter.getPage("page-2")
            .then(function () {
                //Assert
                var aExpectedArgs = [this.oSiteMock, this.oPagePersistenceDataMock.visualizations];
                assert.deepEqual(this.oAddVisualizationsToSiteStub.getCall(0).args, aExpectedArgs, "_addVisualizationsToSite was called with correct args");
                assert.strictEqual(this.oSiteMock.visualizations[this.oViz1.id], this.oViz1, "The visualization was correctly added");

                aExpectedArgs = [this.oSiteMock, this.oPagePersistenceDataMock];
                assert.deepEqual(this.oAddVizTypesToSiteStub.getCall(0).args, aExpectedArgs, "_addVizTypesToSite was called with correct args");
                assert.strictEqual(this.oSiteMock.vizTypes[this.oVizType1.id], this.oVizType1, "The vizType was correctly added");
            }.bind(this));
    });

    QUnit.test("Stores the unstable visualizations", function (assert) {
        //Act
        this.oPagePersistenceDataMock.unstableVisualizations = {
            "viz-1": this.oViz1
        };
        var oExpectedUnstableViz = {
            "viz-1": {
                id: "viz-1"
            }
        };

        return this.oCDMAdapter.getPage("page-2")
            .then(function () {
                //Assert
                assert.deepEqual(this.oStoreUnstableVisualizationsStub.getCall(0).args, ["page-2", oExpectedUnstableViz], "_storeUnstableVisualizations was called with correct args");
            }.bind(this));
    });

    QUnit.test("Rejects the promise if getPage is called without parameter", function (assert) {
        //Act
        return this.oCDMAdapter.getPage()
            .then(function () {
                assert.ok(false, "Promise was resolved");
            }).catch(function () {
                //Assert
                assert.ok(true, "Promise was rejected");
                assert.strictEqual(this.oLogFatalStub.callCount, 1, "Log.fatal was called once.");
            }.bind(this));
    });

    QUnit.test("Rejects the promise when NavigationDataProvider service is not available", function (assert) {
        // Arrange
        this.oGetServiceAsyncStub.withArgs("NavigationDataProvider").rejects();

        // Act
        return this.oCDMAdapter.getPage("page-2")
            .then(function () {
                assert.ok(false, "Promise was resolved");
            }).catch(function () {
                //Assert
                assert.ok(true, "Promise was rejected");
                assert.strictEqual(this.oLogFatalStub.callCount, 1, "Log.fatal was called once.");
            }.bind(this));
    });

    QUnit.test("Rejects the promise when PagePersistence service is not available", function (assert) {
        // Arrange
        this.oGetServiceAsyncStub.withArgs("PagePersistence").rejects();

        // Act
        return this.oCDMAdapter.getPage("page-2")
            .then(function () {
                assert.ok(false, "Promise was resolved");
            }).catch(function () {
                //Assert
                assert.ok(true, "Promise was rejected");
                assert.strictEqual(this.oLogFatalStub.callCount, 1, "Log.fatal was called once.");
            }.bind(this));
    });

    QUnit.test("Rejects the promise when NavigationDataProvider.getNavigationData is rejected", function (assert) {
        // Arrange
        this.oGetNavigationDataStub.rejects("Error");

        // Act
        return this.oCDMAdapter.getPage("page-2")
            .then(function () {
                assert.ok(false, "Promise was resolved");
            }).catch(function () {
                //Assert
                assert.ok(true, "Promise was rejected");
                assert.strictEqual(this.oLogFatalStub.callCount, 1, "Log.fatal was called once.");
            }.bind(this));
    });

    QUnit.test("Rejects the promise when PagePersistence.getPage is rejected", function (assert) {
        // Arrange
        this.oGetPageStub.rejects("Error");

        //Act
        return this.oCDMAdapter.getPage("page-2")
            .then(function () {
                assert.ok(false, "Promise was resolved");
            }).catch(function () {
                //Assert
                assert.ok(true, "Promise was rejected");
                assert.strictEqual(this.oLogFatalStub.callCount, 1, "Log.fatal was called once.");
            }.bind(this));
    });

    QUnit.module("The function getPages", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub();
            sandbox.stub(Container, "getServiceAsync").callsFake(this.oGetServiceAsyncStub);

            this.oPage1 = { id: "page-1" };
            this.oPage2 = { id: "page-2" };
            this.oViz1 = { id: "viz-1" };
            this.oViz2 = { id: "viz-2" };
            this.oVizType1 = { id: "vizType-1" };
            this.oVizType2 = { id: "vizType-2" };
            this.oSiteMock = {
                pages: { "page-1": this.oPage1 },
                visualizations: { "viz-1": this.oViz1 },
                vizTypes: { "vizType-1": this.oVizType1 }
            };

            this.oNavigationDataMock = { id: "NavigationData" };
            this.oGetNavigationDataStub = sandbox.stub().resolves(this.oNavigationDataMock);
            this.oGetServiceAsyncStub.withArgs("NavigationDataProvider").resolves({
                getNavigationData: this.oGetNavigationDataStub
            });

            this.aPagesMock = [{
                page: this.oPage2,
                visualizations: { "viz-2": this.oViz2 },
                vizTypes: { "vizType-2": this.oVizType2 }
            }];
            this.oGetPagesStub = sandbox.stub().withArgs(["page-2"]).resolves(this.aPagesMock);
            this.oGetServiceAsyncStub.withArgs("PagePersistence").resolves({
                getPages: this.oGetPagesStub
            });

            this.oLogFatalStub = sandbox.stub(Log, "fatal");

            this.oCDMAdapter = new PagesCDMAdapter();
            this.oCDMAdapter.oSitePromise = Promise.resolve(this.oSiteMock);

            this.oAddPageToSiteStub = sandbox.stub(this.oCDMAdapter, "_addPageToSite").callsFake(function (oSite, oPage /*oNavigationData*/) {
                oSite.pages[oPage.id] = oPage;
            });
            this.oAddVisualizationsToSiteStub = sandbox.stub(this.oCDMAdapter, "_addVisualizationsToSite").callsFake(function (oSite, oVisualizations) {
                var oFirstViz = Object.values(oVisualizations)[0];
                if (oFirstViz) {
                    oSite.visualizations[oFirstViz.id] = oFirstViz;
                }
            });
            this.oAddVizTypesToSiteStub = sandbox.stub(this.oCDMAdapter, "_addVizTypesToSite").callsFake(function (oSite, oData) {
                var oFirstVizType = Object.values(oData.vizTypes)[0];
                if (oFirstVizType) {
                    oSite.vizTypes[oFirstVizType.id] = oFirstVizType;
                }
            });
            this.oStoreUnstableVisualizationsStub = sandbox.stub(this.oCDMAdapter, "_storeUnstableVisualizations");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the already loaded pages from the site", function (assert) {
        var oExpectedPages = {
            "page-1": this.oPage1
        };

        //Act
        return this.oCDMAdapter.getPages(["page-1"])
            .then(function (oPages) {
                //Assert
                assert.deepEqual(oPages, oExpectedPages, "The existing page was returned");
            });
    });

    QUnit.test("Loads the not yet loaded page and adds it to the site", function (assert) {
        var oExpectedPages = {
            "page-2": this.oPage2
        };

        //Act
        return this.oCDMAdapter.getPages(["page-2"])
            .then(function (oPages) {
                //Assert
                assert.deepEqual(oPages, oExpectedPages, "Expected result was returned");

                var aExpectedArgs = [this.oSiteMock, this.oPage2, this.oNavigationDataMock];
                assert.deepEqual(this.oAddPageToSiteStub.getCall(0).args, aExpectedArgs, "_addPageToSite was called with correct args");

                assert.strictEqual(this.oSiteMock.pages[this.oPage2.id], this.oPage2, "The page was correctly added to the site");
            }.bind(this));
    });

    QUnit.test("Loads the not yet loaded page and returns it with the already loaded page", function (assert) {
        var oExpectedSite = {
            pages: {
                "page-1": this.oPage1,
                "page-2": this.oPage2
            },
            visualizations: {
                "viz-1": this.oViz1,
                "viz-2": this.oViz2
            },
            vizTypes: {
                "vizType-1": this.oVizType1,
                "vizType-2": this.oVizType2
            }
        };

        //Act
        return this.oCDMAdapter.getPages(["page-1", "page-2"])
            .then(function (oPages) {
                //Assert
                assert.deepEqual(oPages, this.oSiteMock.pages, "Expected result was returned");

                var aExpectedArgs = [this.oSiteMock, this.oPage2, this.oNavigationDataMock];
                assert.deepEqual(this.oAddPageToSiteStub.getCall(0).args, aExpectedArgs, "_addPageToSite was called with correct args");

                assert.deepEqual(this.oSiteMock, oExpectedSite, "The new objects were added to the site");
            }.bind(this));
    });

    QUnit.test("Inserts the visualizations and vizTypes to the site", function (assert) {
        //Act
        return this.oCDMAdapter.getPages(["page-2"])
            .then(function () {
                //Assert
                assert.strictEqual(this.oSiteMock.visualizations[this.oViz2.id], this.oViz2, "The visualization was correctly added");
                assert.strictEqual(this.oAddVisualizationsToSiteStub.callCount, 1, "_addVizTypesToSite was called");
                var aExpectedArgs = [this.oSiteMock, this.aPagesMock[0].visualizations, true];
                assert.deepEqual(this.oAddVisualizationsToSiteStub.getCall(0).args, aExpectedArgs, "_addVisualizationsToSite was called with correct args");

                assert.strictEqual(this.oSiteMock.vizTypes[this.oVizType2.id], this.oVizType2, "The vizType was correctly added");
                assert.strictEqual(this.oAddVizTypesToSiteStub.callCount, 1, "_addVizTypesToSite was called");
                aExpectedArgs = [this.oSiteMock, this.aPagesMock[0]];
                assert.deepEqual(this.oAddVizTypesToSiteStub.getCall(0).args, aExpectedArgs, "_addVizTypesToSite was called with correct args");
            }.bind(this));
    });

    QUnit.test("Stores the unstable visualizations", function (assert) {
        //Act
        this.aPagesMock[0].unstableVisualizations = {
            "viz-2": this.oViz2
        };

        return this.oCDMAdapter.getPages(["page-2"])
            .then(function () {
                //Assert
                var oExpectedUnstableViz = {
                    "viz-2": {
                        id: "viz-2"
                    }
                };
                assert.deepEqual(this.oStoreUnstableVisualizationsStub.getCall(0).args, ["page-2", oExpectedUnstableViz], "_storeUnstableVisualizations was called with correct args");
            }.bind(this));
    });

    QUnit.test("Rejects the promise if getPages is called without parameter", function (assert) {
        //Act
        return this.oCDMAdapter.getPages()
            .then(function () {
                assert.ok(false, "Promise was resolved");
            })
            .catch(function () {
                //Assert
                assert.ok(true, "Promise was rejected");
                assert.strictEqual(this.oLogFatalStub.callCount, 1, "Log.fatal was called once.");
            }.bind(this));
    });

    QUnit.test("Rejects the promise when PagePersistence service is not available", function (assert) {
        // Arrange
        this.oGetServiceAsyncStub.withArgs("PagePersistence").rejects("Error");

        // Act
        return this.oCDMAdapter.getPages(["page-2"])
            .then(function () {
                assert.ok(false, "Promise was resolved");
            })
            .catch(function () {
                //Assert
                assert.ok(true, "Promise was rejected");
                assert.strictEqual(this.oLogFatalStub.callCount, 1, "Log.fatal was called once.");
            }.bind(this));
    });

    QUnit.test("Rejects the promise when PagePersistence.getPages is rejected", function (assert) {
        // Arrange
        this.oGetPagesStub.rejects("Error");

        //Act
        return this.oCDMAdapter.getPages(["page-2"])
            .then(function () {
                assert.ok(false, "Promise was resolved");
            })
            .catch(function () {
                //Assert
                assert.ok(true, "Promise was rejected");
                assert.strictEqual(this.oLogFatalStub.callCount, 1, "Log.fatal was called once.");
            }.bind(this));
    });

    QUnit.test("Rejects the promise when NavigationDataProvider service is not available", function (assert) {
        // Arrange
        this.oGetServiceAsyncStub.withArgs("NavigationDataProvider").rejects("Error");

        // Act
        return this.oCDMAdapter.getPages(["page-2"])
            .then(function () {
                assert.ok(false, "Promise was resolved");
            })
            .catch(function () {
                //Assert
                assert.ok(true, "Promise was rejected");
                assert.strictEqual(this.oLogFatalStub.callCount, 1, "Log.fatal was called once.");
            }.bind(this));
    });

    QUnit.test("Rejects the promise when NavigationDataProvider.getNavigationData is rejected", function (assert) {
        // Arrange
        this.oGetNavigationDataStub.rejects("Error");

        // Act
        return this.oCDMAdapter.getPages(["page-2"])
            .then(function () {
                assert.ok(false, "Promise was resolved");
            })
            .catch(function () {
                //Assert
                assert.ok(true, "Promise was rejected");
                assert.strictEqual(this.oLogFatalStub.callCount, 1, "Log.fatal was called once.");
            }.bind(this));
    });

    QUnit.module("The function _addPageToSite", {
        beforeEach: function () {
            this.oSite = {
                pages: {},
                visualizations: {
                    "vizId-1": {}
                }
            };

            this.oNavigationData = {
                inbounds: [{
                    id: "inbound-1",
                    permanentKey: "permanentKey-1"
                }]
            };

            this.oPageContent = {
                id: "page-1",
                title: "Page 1",
                description: "",
                sections: [{
                    id: "section-1",
                    title: "Section 1",
                    viz: []
                }]
            };

            this.oLogErrorStub = sandbox.stub(Log, "error");
            this.oCDMAdapter = new PagesCDMAdapter();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("adds the given page to the CDM 3.1 site in the required format", function (assert) {
        // Arrange
        var oVizRef = {
            id: "viz-1",
            vizId: "vizId-1",
            targetMappingId: "permanentKey-1",
            displayFormatHint: DisplayFormat.FlatWide
        };
        this.oPageContent.sections[0].viz.push(oVizRef);

        var oExpectedResult = {
            pages: {
                "page-1": {
                    identification: {
                        id: "page-1",
                        title: "Page 1"
                    },
                    payload: {
                        layout: { sectionOrder: ["section-1"] },
                        sections: {
                            "section-1": {
                                id: "section-1",
                                title: "Section 1",
                                layout: { vizOrder: ["viz-1"] },
                                viz: {
                                    "viz-1": {
                                        id: "viz-1",
                                        vizId: "vizId-1",
                                        displayFormatHint: DisplayFormat.FlatWide
                                    }
                                }
                            }
                        }
                    }
                }
            },
            visualizations: {
                "vizId-1": {}
            }
        };

        // Act
        this.oCDMAdapter._addPageToSite(this.oSite, this.oPageContent, this.oNavigationData);

        // Assert
        assert.deepEqual(this.oSite, oExpectedResult, "The page is added to the site correctly");
    });

    QUnit.test("filters out vizRefs which reference a missing visualization", function (assert) {
        // Arrange
        var oVizRef = {
            id: "viz-1",
            vizId: "vizId-missing",
            targetMappingId: "permanentKey-1"
        };
        this.oPageContent.sections[0].viz.push(oVizRef);

        var oExpectedResult = {
            pages: {
                "page-1": {
                    identification: {
                        id: "page-1",
                        title: "Page 1"
                    },
                    payload: {
                        layout: { sectionOrder: ["section-1"] },
                        sections: {
                            "section-1": {
                                id: "section-1",
                                title: "Section 1",
                                layout: { vizOrder: [] },
                                viz: {}
                            }
                        }
                    }
                }
            },
            visualizations: {
                "vizId-1": {}
            }
        };
        var aExpectedError = [
            "Tile 'viz-1' with vizId 'vizId-missing' has no matching visualization. As the tile cannot be used to start an app it is removed from the page.",
            null,
            this.oCDMAdapter._sComponent
        ];

        // Act
        this.oCDMAdapter._addPageToSite(this.oSite, this.oPageContent, this.oNavigationData);

        // Assert
        assert.deepEqual(this.oSite, oExpectedResult, "The page is added to the site correctly");
        assert.strictEqual(this.oLogErrorStub.callCount, 1, "Log.error is called once");
        assert.deepEqual(this.oLogErrorStub.getCall(0).args, aExpectedError, "Log.error is called with correct error message ");
    });

    QUnit.test("adds no appId and inboundId to the visualization in CDM 3.1 site if the type of the visualization is URL", function (assert) {
        // Arrange
        var oVizRef = {
            id: "viz-1",
            vizId: "vizId-1",
            targetMappingId: "permanentKey-1"
        };
        this.oPageContent.sections[0].viz.push(oVizRef);

        ObjectPath.set(["visualizations", "vizId-1", "vizConfig", "sap.flp", "target", "type"], "URL", this.oSite);

        var oExpectedResult = {
            pages: {
                "page-1": {
                    identification: {
                        id: "page-1",
                        title: "Page 1"
                    },
                    payload: {
                        layout: { sectionOrder: ["section-1"] },
                        sections: {
                            "section-1": {
                                id: "section-1",
                                title: "Section 1",
                                layout: { vizOrder: ["viz-1"] },
                                viz: {
                                    "viz-1": {
                                        id: "viz-1",
                                        vizId: "vizId-1",
                                        displayFormatHint: undefined
                                    }
                                }
                            }
                        }
                    }
                }
            },
            visualizations: { "vizId-1": { vizConfig: { "sap.flp": { target: { type: "URL" } } } } }
        };

        // Act
        this.oCDMAdapter._addPageToSite(this.oSite, this.oPageContent, this.oNavigationData);

        // Assert
        assert.deepEqual(this.oSite, oExpectedResult, "The page is added to the site correctly");
    });

    QUnit.module("The function getVisualizations", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub();
            sandbox.stub(Container, "getServiceAsync").callsFake(this.oGetServiceAsyncStub);

            this.oViz1 = { id: "viz1" };
            this.oSiteMock = { visualizations: {} };

            this.oVisualizationDataMock = { visualizations: { viz1: this.oViz1 } };
            this.oGetVisualizationDataStub = sandbox.stub().resolves(this.oVisualizationDataMock);
            this.oGetServiceAsyncStub.withArgs("VisualizationDataProvider").resolves({
                getVisualizationData: this.oGetVisualizationDataStub
            });

            this.oLogErrorStub = sandbox.stub(Log, "error");

            this.oCDMAdapter = new PagesCDMAdapter();
            this.oCDMAdapter.oSitePromise = Promise.resolve(this.oSiteMock);

            this.oAddVisualizationsToSiteStub = sandbox.stub(this.oCDMAdapter, "_addVisualizationsToSite").callsFake(function (oSite, oVisualizations) {
                var oFirstViz = Object.values(oVisualizations)[0];
                oSite.visualizations[oFirstViz.id] = oFirstViz;
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Inserts the visualization into the site", function (assert) {
        // Arrange
        // Act
        return this.oCDMAdapter.getVisualizations().then(function (oVisualizations) {
            // Assert
            assert.strictEqual(oVisualizations, this.oSiteMock.visualizations, "The correct reference was returned");
            assert.strictEqual(oVisualizations.viz1, this.oViz1, "viz1 was correctly inserted");

            var aExpectedArgs = [this.oSiteMock, this.oVisualizationDataMock.visualizations];
            assert.deepEqual(this.oAddVisualizationsToSiteStub.getCall(0).args, aExpectedArgs, "_addVisualizationsToSite was called with correct args");
            assert.strictEqual(this.oSiteMock.visualizations[this.oViz1.id], this.oViz1, "The visualization was correctly added");
        }.bind(this));
    });

    QUnit.test("Rejects when VisualizationDataProvider unavailable", function (assert) {
        // Arrange
        this.oGetServiceAsyncStub.withArgs("VisualizationDataProvider").rejects();
        // Act
        return this.oCDMAdapter.getVisualizations()
            .then(function () {
                assert.ok(false, "Promise resolved");
            }).catch(function () {
                // Assert
                assert.ok(true, "Promise rejected");
            });
    });

    QUnit.test("Rejects when VisualizationDataProvider.getVisualizationData fails", function (assert) {
        // Arrange
        this.oGetVisualizationDataStub.rejects();
        // Act
        return this.oCDMAdapter.getVisualizations()
            .then(function () {
                assert.ok(false, "Promise resolved");
            }).catch(function () {
                // Assert
                assert.ok(true, "Promise rejected");
            });
    });

    QUnit.module("The function getVizTypes", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub();
            sandbox.stub(Container, "getServiceAsync").callsFake(this.oGetServiceAsyncStub);

            this.oVizType1 = { id: "vizType1" };
            this.oSiteMock = { vizTypes: {} };

            this.oVisualizationDataMock = { vizTypes: { vizType1: this.oVizType1 } };
            this.oGetVisualizationDataStub = sandbox.stub().resolves(this.oVisualizationDataMock);
            this.oGetServiceAsyncStub.withArgs("VisualizationDataProvider").resolves({
                getVisualizationData: this.oGetVisualizationDataStub
            });

            this.oLogErrorStub = sandbox.stub(Log, "error");

            this.oCDMAdapter = new PagesCDMAdapter();
            this.oCDMAdapter.oSitePromise = Promise.resolve(this.oSiteMock);

            this.oAddVizTypesToSiteStub = sandbox.stub(this.oCDMAdapter, "_addVizTypesToSite").callsFake(function (oSite, oData) {
                var oFirstVizType = Object.values(oData.vizTypes)[0];
                oSite.vizTypes[oFirstVizType.id] = oFirstVizType;
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Inserts the vizType into the site", function (assert) {
        // Arrange
        // Act
        return this.oCDMAdapter.getVizTypes().then(function (oVizTypes) {
            // Assert
            assert.strictEqual(oVizTypes, this.oSiteMock.vizTypes, "The correct reference was returned");
            assert.strictEqual(oVizTypes.vizType1, this.oVizType1, "vizType1 was correctly inserted");

            var aExpectedArgs = [this.oSiteMock, this.oVisualizationDataMock];
            assert.deepEqual(this.oAddVizTypesToSiteStub.getCall(0).args, aExpectedArgs, "_addVizTypesToSite was called with correct args");
            assert.strictEqual(this.oSiteMock.vizTypes[this.oVizType1.id], this.oVizType1, "The vizType was correctly added");
        }.bind(this));
    });

    QUnit.test("Rejects when VisualizationDataProvider unavailable", function (assert) {
        // Arrange
        this.oGetServiceAsyncStub.withArgs("VisualizationDataProvider").rejects();
        // Act
        return this.oCDMAdapter.getVizTypes()
            .then(function () {
                assert.ok(false, "Promise resolved");
            }).catch(function () {
                // Assert
                assert.ok(true, "Promise rejected");
            });
    });

    QUnit.test("Rejects when VisualizationDataProvider.getVisualizationData fails", function (assert) {
        // Arrange
        this.oGetVisualizationDataStub.rejects();
        // Act
        return this.oCDMAdapter.getVizTypes()
            .then(function () {
                assert.ok(false, "Promise resolved");
            }).catch(function () {
                // Assert
                assert.ok(true, "Promise rejected");
            });
    });

    QUnit.module("The function getCachedVisualizations", {
        beforeEach: function () {
            this.oLogErrorStub = sandbox.stub(Log, "error");
            var oSite = {
                pages: {},
                visualizations: { "vizId-1": { vizConfig: { "sap.flp": { target: { type: "URL" } } } } }
            };
            this.oCDMAdapter = new PagesCDMAdapter();
            this.oCDMAdapter.oSitePromise = Promise.resolve(oSite);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns all visualizations which are currently cached inside the CDM site object", function (assert) {
        // Act
        return this.oCDMAdapter.getCachedVisualizations().then(function (oCachedVisualizations) {
            var oExpectedVisualizations = { "vizId-1": { vizConfig: { "sap.flp": { target: { type: "URL" } } } } };
            assert.deepEqual(oCachedVisualizations, oExpectedVisualizations, "The function returns the correct visualizations.");
        });
    });

    QUnit.module("The function getCachedVizTypes", {
        beforeEach: function () {
            this.oLogErrorStub = sandbox.stub(Log, "error");
            var oSite = {
                pages: {},
                vizTypes: {
                    vizType1: {
                        "sap.flp": {
                            vizOptions: {
                                displayFormats: {
                                    supported: [DisplayFormat.Standard, DisplayFormat.Compact, DisplayFormat.Flat, DisplayFormat.StandardWide],
                                    default: DisplayFormat.Standard
                                }
                            }
                        }
                    }
                }
            };
            this.oCDMAdapter = new PagesCDMAdapter();
            this.oCDMAdapter.oSitePromise = Promise.resolve(oSite);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns all vizTypes which are currently cached inside the CDM site object", function (assert) {
        // Act
        return this.oCDMAdapter.getCachedVizTypes().then(function (oCachedVizTypes) {
            var oExpectedVizTypes = {
                vizType1: {
                    "sap.flp": {
                        vizOptions: {
                            displayFormats: {
                                supported: [DisplayFormat.Standard, DisplayFormat.Compact, DisplayFormat.Flat, DisplayFormat.StandardWide],
                                default: DisplayFormat.Standard
                            }
                        }
                    }
                }
            };
            assert.deepEqual(oCachedVizTypes, oExpectedVizTypes, "The function returns the correct vizTypes.");
        });
    });

    QUnit.module("The function _storeUnstableVisualizations", {
        beforeEach: function () {
            this.oCDMAdapter = new PagesCDMAdapter();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Stores unstable visualizations", function (assert) {
        // Arrange
        var oUnstableVisualizations = {
            "viz-1": { id: "viz-1" }
        };
        var oExpectedUnstableVisualizations = {
            page1: {
                "viz-1": { id: "viz-1" }
            }
        };
        // Act
        this.oCDMAdapter._storeUnstableVisualizations("page1", oUnstableVisualizations);
        // Assert
        assert.deepEqual(this.oCDMAdapter._oUnstableVisualizations, oExpectedUnstableVisualizations, "Saved the unstable visualizations");
    });

    QUnit.test("Overwrites existing unstableVisualizations", function (assert) {
        // Arrange
        this.oCDMAdapter._oUnstableVisualizations = {
            page1: {
                "viz-1": { id: "viz-1" }
            },
            page2: {
                "viz-2": { id: "viz-2" }
            }
        };
        var oUnstableVisualizations = {
            "viz-1a": { id: "viz-1a" }
        };
        var oExpectedUnstableVisualizations = {
            page1: {
                "viz-1a": { id: "viz-1a" }
            },
            page2: {
                "viz-2": { id: "viz-2" }
            }
        };
        // Act
        this.oCDMAdapter._storeUnstableVisualizations("page1", oUnstableVisualizations);
        // Assert
        assert.deepEqual(this.oCDMAdapter._oUnstableVisualizations, oExpectedUnstableVisualizations, "Saved the unstable visualizations");
    });

    QUnit.test("Ignores 'null' unstableVisualizations", function (assert) {
        // Act
        this.oCDMAdapter._storeUnstableVisualizations("page1", null);
        // Assert
        assert.deepEqual(this.oCDMAdapter._oUnstableVisualizations, {}, "Saved the unstable visualizations");
    });

    QUnit.module("The function _addVizTypesToSite", {
        beforeEach: function () {
            this.oSiteMock = {
                vizTypes: {
                    vizType0: { id: "vizType0" }
                }
            };

            this.oPagePersistenceDataMock = {
                visualizations: {
                    viz1: { isCustomTile: false, vizType: "vizType1" },
                    viz2: { isCustomTile: true, vizType: "vizType2" }
                },
                vizTypes: {
                    vizType1: { id: "vizType1" },
                    vizType2: { id: "vizType2" }
                }
            };

            this.oGetVizTypesStub = sandbox.stub(cdmSiteUtils, "getVizTypes").returnsArg(0);

            this.oCDMAdapter = new PagesCDMAdapter();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Inserts all vizTypes into the site", function (assert) {
        // Arrange
        // Act
        this.oCDMAdapter._addVizTypesToSite(this.oSiteMock, this.oPagePersistenceDataMock);
        // Assert
        assert.strictEqual(this.oSiteMock.vizTypes.vizType1, this.oPagePersistenceDataMock.vizTypes.vizType1, "vizType2 was correctly inserted");
        assert.strictEqual(this.oSiteMock.vizTypes.vizType2, this.oPagePersistenceDataMock.vizTypes.vizType2, "custom vizType2 was correctly inserted");
        assert.notStrictEqual(this.oSiteMock.vizTypes.vizType0, undefined, "vizType0 was not overwritten");
    });

    QUnit.test("Ignores vizTypes which are already part of the site", function (assert) {
        // Arrange
        var oVizType = {
            id: "vizType1"
        };
        this.oSiteMock.vizTypes.vizType1 = oVizType;
        // Act
        this.oCDMAdapter._addVizTypesToSite(this.oSiteMock, this.oPagePersistenceDataMock);
        // Assert
        assert.strictEqual(this.oSiteMock.vizTypes.vizType1, oVizType, "vizType1 was not overwritten");
    });

    QUnit.module("The function _addVisualizationsToSite", {
        beforeEach: function () {
            this.oSiteMock = { visualizations: { viz0: { id: "viz0" } } };

            this.oVisualizationsMock = { viz1: { id: "viz1" } };

            this.oGetVizTypesStub = sandbox.stub(cdmSiteUtils, "getVisualizations").withArgs(this.oVisualizationsMock).returnsArg(0);

            this.oCDMAdapter = new PagesCDMAdapter();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Inserts visualization into the site", function (assert) {
        // Arrange
        // Act
        this.oCDMAdapter._addVisualizationsToSite(this.oSiteMock, this.oVisualizationsMock);
        // Assert
        assert.strictEqual(this.oSiteMock.visualizations.viz1, this.oVisualizationsMock.viz1, "viz1 was correctly inserted");
        assert.notStrictEqual(this.oSiteMock.visualizations.viz0, undefined, "viz0 was not overwritten");
    });

    QUnit.test("Overwrites visualizations which are already part of the site when bCheckExistence is set to false", function (assert) {
        // Arrange
        var oViz = {
            id: "viz1"
        };
        this.oSiteMock.visualizations.viz1 = oViz;
        // Act
        this.oCDMAdapter._addVisualizationsToSite(this.oSiteMock, this.oVisualizationsMock, false);
        // Assert
        assert.strictEqual(this.oSiteMock.visualizations.viz1, this.oVisualizationsMock.viz1, "viz1 was overwritten");
    });

    QUnit.test("Ignores visualizations which are already part of the site when bCheckExistence is set to true", function (assert) {
        // Arrange
        var oViz = {
            id: "viz1"
        };
        this.oSiteMock.visualizations.viz1 = oViz;
        // Act
        this.oCDMAdapter._addVisualizationsToSite(this.oSiteMock, this.oVisualizationsMock, true);
        // Assert
        assert.strictEqual(this.oSiteMock.visualizations.viz1, oViz, "viz1 was not overwritten");
    });

    QUnit.module("The function getVizType", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub();
            sandbox.stub(Container, "getServiceAsync").callsFake(this.oGetServiceAsyncStub);

            this.oSiteMock = { vizTypes: { vizType0: { id: "vizType0" } } };
            this.oVizTypeData = { id: "X-SAP-UI2-CHIP:/UI2/CUSTOM_TILE" };

            this.oLoadVizTypeStub = sandbox.stub().resolves(this.oVizTypeData);
            this.oGetServiceAsyncStub.withArgs("VisualizationDataProvider").resolves({
                loadVizType: this.oLoadVizTypeStub
            });

            this.oCDMAdapter = new PagesCDMAdapter();
            this.oCDMAdapter.oSitePromise = Promise.resolve(this.oSiteMock);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Resolves already cached vizTypes", function (assert) {
        // Arrange
        var sVizType = "vizType0";
        // Act
        return this.oCDMAdapter.getVizType(sVizType).then(function (oVizType) {
            // Assert
            assert.strictEqual(oVizType, this.oSiteMock.vizTypes.vizType0, "Resolved the correct vizType");
            assert.strictEqual(this.oLoadVizTypeStub.callCount, 0, "loadVizType was not called");
        }.bind(this));
    });

    QUnit.test("Does not load cdm vizTypes ", function (assert) {
        // Arrange
        var sVizType = "some.cdm.viz.type";
        // Act
        return this.oCDMAdapter.getVizType(sVizType).then(function (oVizType) {
            // Assert
            assert.strictEqual(oVizType, undefined, "Resolved undefined");
            assert.strictEqual(this.oLoadVizTypeStub.callCount, 0, "loadVizType was not called");
        }.bind(this));
    });

    QUnit.test("Loads chipIds via the VisualizationDataProvider", function (assert) {
        // Arrange
        var sVizType = "X-SAP-UI2-CHIP:/UI2/CUSTOM_TILE";
        var oExpectedVizType = {
            "sap.app": {
                id: "X-SAP-UI2-CHIP:/UI2/CUSTOM_TILE",
                type: "chipVizType"
            },
            "sap.flp": {
                tileSize: undefined,
                vizOptions: undefined
            }
        };
        // Act
        return this.oCDMAdapter.getVizType(sVizType).then(function (oVizType) {
            // Assert
            assert.deepEqual(oVizType, oExpectedVizType, "Resolved the correct vizType");
            var oVizTypes = this.oSiteMock.vizTypes;
            assert.deepEqual(oVizTypes[sVizType], oVizType, "Saved the vizType to the site");
        }.bind(this));
    });

    QUnit.module("The function migratePersonalizedPages", {
        beforeEach: function () {
            this.oCDMAdapter = new PagesCDMAdapter();
            this.oCDMAdapter._oUnstableVisualizations = {
                "page-1": {
                    "unstableViz-1": {
                        vizId: "stableViz-1"
                    },
                    "unstableViz-3": {
                        vizId: "stableViz-3"
                    }
                },
                "page-3": {
                    "unstableViz-4": {
                        vizId: "stableViz-4"
                    }
                }
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Migrates pages in-place and deletes cache", function (assert) {
        // Arrange
        var aPages = [{
            identification: { id: "page-1" },
            payload: {
                sections: {
                    "section-1": {
                        viz: {
                            "vizRef-1": {
                                vizId: "unstableViz-1"
                            },
                            "vizRef-2": {
                                vizId: "stableViz-2"
                            },
                            "vizRef-3": {
                                vizId: "unstableViz-3"
                            }
                        }
                    }
                }
            }
        }, {
            identification: { id: "page-2" },
            payload: {
                sections: {
                    "section-2": {
                        viz: {
                            "vizRef-4": {
                                vizId: "stableViz-4"
                            }
                        }
                    }
                }
            }
        }];
        var aExpectedPages = [{
            identification: { id: "page-1" },
            payload: {
                sections: {
                    "section-1": {
                        viz: {
                            "vizRef-1": {
                                vizId: "stableViz-1"
                            },
                            "vizRef-2": {
                                vizId: "stableViz-2"
                            },
                            "vizRef-3": {
                                vizId: "stableViz-3"
                            }
                        }
                    }
                }
            }
        }, {
            identification: { id: "page-2" },
            payload: {
                sections: {
                    "section-2": {
                        viz: {
                            "vizRef-4": {
                                vizId: "stableViz-4"
                            }
                        }
                    }
                }
            }
        }];
        // Act
        return this.oCDMAdapter.migratePersonalizedPages(aPages)
            .then(function (aPageIds) {
                // Assert
                assert.deepEqual(aPageIds, ["page-1"], "Resolved the migrated pages");
                assert.deepEqual(aPages, aExpectedPages, "Migrated the pages in-place");

                assert.strictEqual(this.oCDMAdapter._oUnstableVisualizations["page-1"], null, "cache for 'page-1' was deleted");
                assert.ok(this.oCDMAdapter._oUnstableVisualizations["page-3"], "cache for 'page-3' was not deleted");
            }.bind(this));
    });
});
