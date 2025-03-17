// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileoverview QUnit tests for sap.ushell.adapters.cep.SearchCEPAdapter
 */

sap.ui.define([
    "sap/ushell/adapters/cep/SearchCEPAdapter",
    "sap/ui/model/Filter",
    "sap/ui/model/Sorter",
    "sap/ushell/Container"
], function (
    SearchCEPAdapter,
    Filter,
    Sorter,
    Container
) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    function getSampleData (sId, sTitle, sSubtitle, aKeywords, aTechnicalAttributes, sContentProviderLabel) {
        return {
            id: sId || "sap.ushell.sampletile",
            title: sTitle || "News",
            subtitle: sSubtitle || "no subtitle",
            icon: "sap-icon://time-entry-request",
            info: "An Info Text",
            keywords: aKeywords || ["keyword-1", "keyword-2"],
            technicalAttributes: aTechnicalAttributes || ["APPTYPE_SEARCHAPP", "APPTYPE_HOMEPAGE"],
            target: { semanticObject: "Action", action: "toappnavsample" },
            visualizations: [
                {
                    vizId: "sap.ushell.demotiles.cdm.newstile",
                    vizType: "sap.ushell.StaticAppLauncher",
                    vizConfig: {
                        "sap.app": {
                            title: sTitle || "News",
                            subTitle: sSubtitle || "no subtitle"
                        },
                        "sap.ui": {
                            icons: { icon: "sap-icon://time-entry-request" },
                            deviceTypes: {
                                desktop: true,
                                tablet: true,
                                phone: true
                            }
                        },
                        "sap.flp": {
                            target: {
                                semanticObject: "Action",
                                action: "toappnavsample"
                            }
                        }
                    },
                    title: sTitle || "News",
                    subtitle: sSubtitle || "no subtitle",
                    icon: "sap-icon://time-entry-request",
                    keywords: aKeywords || ["Keyword1", "Keyword2"],
                    info: "An Info Text",
                    target: {
                        semanticObject: "Action",
                        action: "toappnavsample"
                    },
                    isBookmark: false,
                    contentProviderId: "contentProviderId1",
                    contentProviderLabel: sContentProviderLabel,
                    displayFormatHint: "standardWide",
                    _instantiationData: {
                        platform: "CDM",
                        vizType: {
                            "sap.ui5": {
                                componentName: "sap.ushell.components.tiles.cdm.applauncher"
                            }
                        }
                    },
                    targetURL: "#Action-toappnavsample",
                    supportedDisplayFormats: ["standardWide", "compact"],
                    preview: true
                }
            ]
        };
    }

    QUnit.module("_normalizeSearchableContentServiceResult", {
        beforeEach: function (assert) {
            this.oAdapter = new SearchCEPAdapter({}, {}, {});
        }
    });

    QUnit.test("returns an empty array when called without app array", function (assert) {
        var aResult = this.oAdapter._normalizeSearchableContentServiceResult();
        assert.equal(Array.isArray(aResult), true,
            "returns an array");
        assert.equal(aResult.length, 0,
            "returns an array with length 0");
    });

    QUnit.test("returns the correct result for 1 app with 1 visualization without vizConfig", function (assert) {
        var aApps = [{
            id: "appWithVizWithoutVizConfig",
            title: "App Title",
            technicalAttributes: ["attribute-1", "attribute-2"],
            visualizations: [{
                title: "Viz Title",
                subtitle: "Viz Subtitle",
                keywords: ["viz-keyword-1", "viz-keyword-2"],
                icon: "viz-icon-uri",
                description: "Long description",
                targetURL: "#SomeObject-action"
            }]
        }];
        var aResult = this.oAdapter._normalizeSearchableContentServiceResult(aApps);

        assert.deepEqual(aResult, [{
            fioriAppId: "",
            title: "Viz Title",
            description: "Viz Subtitle",
            keywords: "viz-keyword-1 viz-keyword-2",
            icon: "viz-icon-uri",
            label: "Viz Title - Viz Subtitle",
            contentProviderLabel: "",
            longDescription: "Long description",
            visualization: aApps[0].visualizations[0],
            url: "#SomeObject-action",
            technicalAttributes: "attribute-1 attribute-2"
        }], "result is correct");
    });

    QUnit.test("returns the correct result for 1 app with 1 visualization and vizConfig", function (assert) {
        var aApps = [{
            id: "appWithVizAndVizConfig",
            title: "App Title",
            technicalAttributes: ["attribute-1", "attribute-2"],
            visualizations: [{
                contentProviderLabel: "SystemNine",
                vizConfig: {
                    "sap.app": {
                        title: "VizConfig Title",
                        subTitle: "VizConfig Subtitle"
                    },
                    "sap.fiori": {
                        "registrationIds": [
                            "F2358"
                        ]
                    }
                },
                keywords: ["viz-keyword-1", "viz-keyword-2"],
                icon: "viz-icon-uri",
                targetURL: "#SomeObject-action"
            }]
        }];
        var aResult = this.oAdapter._normalizeSearchableContentServiceResult(aApps);

        assert.deepEqual(aResult, [{
            fioriAppId: "F2358",
            title: "VizConfig Title",
            description: "VizConfig Subtitle",
            keywords: "viz-keyword-1 viz-keyword-2",
            icon: "viz-icon-uri",
            label: "VizConfig Title - VizConfig Subtitle",
            longDescription: "",
            contentProviderLabel: "SystemNine",
            visualization: aApps[0].visualizations[0],
            url: "#SomeObject-action",
            technicalAttributes: "attribute-1 attribute-2"
        }], "result is correct");
    });

    QUnit.test("returns the correct result for 1 app with 1 visualization and vizConfig including longDescription", function (assert) {
        var aApps = [{
            id: "appWithVizAndVizConfig",
            title: "App Title",
            technicalAttributes: ["attribute-1", "attribute-2"],
            visualizations: [{
                contentProviderLabel: "SystemNine",
                vizConfig: {
                    "sap.app": {
                        title: "VizConfig Title",
                        subTitle: "VizConfig Subtitle",
                        description: "Long description"
                    }
                },
                keywords: ["viz-keyword-1", "viz-keyword-2"],
                icon: "viz-icon-uri",
                targetURL: "#SomeObject-action"
            }]
        }];
        var aResult = this.oAdapter._normalizeSearchableContentServiceResult(aApps);

        assert.deepEqual(aResult, [{
            fioriAppId: "",
            title: "VizConfig Title",
            description: "VizConfig Subtitle",
            keywords: "viz-keyword-1 viz-keyword-2",
            icon: "viz-icon-uri",
            label: "VizConfig Title - VizConfig Subtitle",
            longDescription: "Long description",
            contentProviderLabel: "SystemNine",
            visualization: aApps[0].visualizations[0],
            url: "#SomeObject-action",
            technicalAttributes: "attribute-1 attribute-2"
        }], "result is correct");
    });

    QUnit.test("returns the correct result for 1 app without visualizations", function (assert) {
        var aApps = [{
            id: "appWithoutViz",
            title: "App Title",
            subtitle: "App Subtitle",
            technicalAttributes: ["attribute-1", "attribute-2"],
            keywords: ["app-keyword-1", "app-keyword-2"],
            icon: "app-icon-uri",
            targetURL: "#SomeObject-action",
            visualizations: []
        }];
        var aResult = this.oAdapter._normalizeSearchableContentServiceResult(aApps);

        assert.deepEqual(aResult, [{
            title: "App Title",
            description: "App Subtitle",
            keywords: "app-keyword-1 app-keyword-2",
            icon: "app-icon-uri",
            label: "App Title - App Subtitle",
            longDescription: "",
            url: "#SomeObject-action",
            technicalAttributes: "attribute-1 attribute-2"
        }], "result is correct");
    });

    QUnit.module("_createFilters", {
        beforeEach: function (assert) {
            this.oAdapter = new SearchCEPAdapter({}, {}, {});
        }
    });

    QUnit.test("creates correct result for a single filter object", function (assert) {
        var aFilters = this.oAdapter._createFilters(
            {
                path: "technicalAttributes",
                operator: "Contains",
                value1: "attributeB1"
            }
        );

        assert.equal(Array.isArray(aFilters), true,
            "json, filters is an array");
        assert.equal(aFilters.length, 1,
            "json, filters has 1 entry");
        assert.equal(aFilters[0] instanceof Filter, true,
            "json, filters[0] is a Filter instance");
    });

    QUnit.test("creates correct result for a single Filter instance", function (assert) {
        var aFilters = this.oAdapter._createFilters(
            new Filter({
                path: "technicalAttributes",
                operator: "Contains",
                value1: "attributeB1"
            })
        );
        assert.equal(Array.isArray(aFilters), true,
            "Filter instance, filters is an array");
        assert.equal(aFilters.length, 1,
            "Filter instance,filters has 1 entry");
        assert.equal(aFilters[0] instanceof Filter, true,
            "Filter instance, is a Filter instance");
    });

    QUnit.test("creates correct result for a filter object with multiple filters", function (assert) {
        var aFilters = this.oAdapter._createFilters(
            {
                filters: [{
                    path: "technicalAttributes",
                    operator: "Contains",
                    value1: "attributeB1"
                }, new Filter({
                    path: "technicalAttributes",
                    operator: "Contains",
                    value1: "attributeA"
                })],
                and: true
            }
        );
        assert.equal(Array.isArray(aFilters), true,
            "multiple filters (json, Filter instance), filters is an array");
        assert.equal(aFilters.length, 1,
            "multiple filters (json, Filter instance), filters has 1 entry");
        assert.equal(aFilters[0] instanceof Filter, true,
            "multiple filters (json, Filter instance), filters[0] is a Filter instance");
        assert.equal(Array.isArray(aFilters[0].getFilters()), true,
            "multiple filters (json, Filter instance), filters[0] contains nested filters array");
        assert.equal(aFilters[0].getFilters().length, 2,
            "multiple filters (json, Filter instance), filters[0] contains 2 nested filters");
        assert.equal(aFilters[0].getFilters()[0] instanceof Filter, true,
            "multiple filters (json, Filter instance), filters[0] contains 2 nested filters, type Filter - passed as json");
        assert.equal(aFilters[0].getFilters()[1] instanceof Filter, true,
            "multiple filters (json, Filter instance), filters[0] contains 2 nested filters, type Filter - passed as filter instance");
    });

    QUnit.module("_createSorters", {
        beforeEach: function (assert) {
            this.oAdapter = new SearchCEPAdapter({}, {}, {});
        }
    });

    QUnit.test("creates correct result for a single object", function (assert) {
        var aSorters = this.oAdapter._createSorters(
            {
                path: "title",
                descending: false
            }
        );
        assert.equal(Array.isArray(aSorters), true,
            "sorters is an array");
        assert.equal(aSorters.length, 1,
            "sorters has 1 entry");
        assert.equal(aSorters[0] instanceof Sorter, true,
            "sorters[0] is a Sorter instance");
    });

    QUnit.test("creates correct result for an array with JSON and Sorter objects", function (assert) {
        var aSorters = this.oAdapter._createSorters([
            {
                path: "title",
                descending: false
            },
            new Sorter({
                path: "subtitle",
                descending: true
            })
        ]);
        assert.equal(Array.isArray(aSorters), true,
            "sorters is an array");
        assert.equal(aSorters.length, 2,
            "sorters has 2 entry");
        assert.equal(aSorters[0] instanceof Sorter, true,
            "sorters[0] is a Sorter instance");
        assert.equal(aSorters[1] instanceof Sorter, true,
            "sorters[1] is a Sorter instance");
    });

    QUnit.module("Search, Filter and Sort", {
        beforeEach: function (assert) {
            this.aSearchableContent = [];
            for (var i = 0; i < 100; i++) {
                this.aSearchableContent.push(
                    getSampleData(
                        "id" + i,
                        "title" + i,
                        "subtitle" + (i % 2),
                        ["keyword-1" + i, "keyword-2" + i],
                        i >= 25 ? ["attributeA"] : ["attributeA", "attributeB" + i],
                        "System" + i
                    )
                );
            }

            this.oSearchableContentStub = {
                getApps: sandbox.stub().resolves(this.aSearchableContent)
            };
            this.oContainerGetServiceAsyncStub = function (sService) {
                if (sService === "SearchableContent") {
                    return Promise.resolve(this.oSearchableContentStub);
                }
            }.bind(this);

            sandbox.stub(Container, "getServiceAsync").callsFake(this.oContainerGetServiceAsyncStub);
            this.oAdapter = new SearchCEPAdapter({}, {}, {});
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("search with empty searchTerm and includeAppsWithoutVisualization=true", function (assert) {
        return this.oAdapter.search({
            includeAppsWithoutVisualizations: true
        }).then(function (oResult) {
            assert.equal(oResult.count, 100,
                "search return object.count=100");
            assert.equal(Array.isArray(oResult.data), true,
                "search return object.data=array");
            assert.equal(oResult.data.length, 10,
                "search return object.data.length=10");

            assert.strictEqual(this.oSearchableContentStub.getApps.callCount, 1,
                "SearchableContent.getApps was called once");
            assert.deepEqual(this.oSearchableContentStub.getApps.getCall(0).args, [{
                enableVisualizationPreview: true,
                includeAppsWithoutVisualizations: true
            }], "SearchableContent.getApps was called with correct arguments");
        }.bind(this));
    });

    QUnit.test("search with searchTerm='100', no results", function (assert) {
        var done = assert.async();
        return this.oAdapter.search({
            searchTerm: "100"
        }).then(function (oResult) {
            assert.equal(oResult.count, 0,
                "search return object.count=0");
            assert.equal(Array.isArray(oResult.data), true,
                "search return object.data=array");
            assert.equal(oResult.data.length, 0,
                "search return object.data.length=0");
            done();
        });
    });

    QUnit.test("search with searchTerm='10', 2 results", function (assert) {
        var done = assert.async();
        return this.oAdapter.search({
            searchTerm: "10"
        }).then(function (oResult) {
            assert.equal(oResult.count, 2,
                "search return object.count=2");
            assert.equal(Array.isArray(oResult.data), true,
                "search return object.data=array");
            assert.equal(oResult.data.length, 2,
                "search return object.data.length=2");
            done();
        });
    });

    QUnit.test("search with searchTerm= 'keyword-', 10 results, defaults to top 10", function (assert) {
        var done = assert.async();
        var aSearchableContent = this.aSearchableContent;
        return this.oAdapter.search({
            searchTerm: "keyword-"
        }).then(function (oResult) {
            assert.equal(oResult.count, 100,
                "search return object.count=100");
            assert.equal(Array.isArray(oResult.data), true,
                "search return object.data=array");
            assert.equal(oResult.data.length, 10,
                "search return object.data.length=10, no top defined");
            for (var i = 0; i < oResult.data.length; i++) {
                assert.equal(oResult.data[i].title,
                    aSearchableContent[i].title,
                    "results objects title matches");
                assert.equal(oResult.data[i].subtitle,
                    aSearchableContent[i].description,
                    "results objects description matches");
            }
            done();
        });
    });

    QUnit.test("search with searchTerm= 'keyword-', top=100", function (assert) {
        var done = assert.async();
        return this.oAdapter.search({
            searchTerm: "keyword-",
            top: 100
        }).then(function (oResult) {
            assert.equal(oResult.count, 100,
                "search return object.count=100");
            assert.equal(Array.isArray(oResult.data), true,
                "search return object.data=array");
            assert.equal(oResult.data.length, 100,
                "search return object.data.length=100");
            done();
        });
    });

    QUnit.test("search with searchTerm= 'keyword-', top=50, skip=0, filter=technicalAttributes contains attributeB", function (assert) {
        var done = assert.async();
        return this.oAdapter.search({
            searchTerm: "keyword-",
            top: 50,
            skip: 0,
            filter: {
                path: "technicalAttributes",
                operator: "Contains",
                value1: "attributeB"
            },
            sort: {
                path: "title",
                descending: true
            }
        }).then(function (oResult) {
            assert.equal(oResult.count, 25,
                "search return object.count=25");
            assert.equal(Array.isArray(oResult.data), true,
                "search return object.data=array");
            assert.equal(oResult.data.length, 25,
                "search return object.data.length=25");

            //sorted result top 25 page sorted desc by title
            assert.equal(oResult.data[0].title, "title9",
                "check sorted title value title9");
            assert.equal(oResult.data[1].title, "title8",
                "check sorted title value title8");
            assert.equal(oResult.data[8].title, "title23",
                "check sorted title value title23");
            assert.equal(oResult.data[20].title, "title12",
                "check sorted title value title12");
            assert.equal(oResult.data[24].title, "title0",
                "check sorted title value title0");
            done();
        });
    });

    QUnit.test("search with searchTerm= 'keyword-', top=10, skip=20, filter=technicalAttributes contains attributeB", function (assert) {
        var done = assert.async();
        return this.oAdapter.search({
            searchTerm: "keyword-",
            top: 10,
            skip: 20,
            filter: {
                path: "technicalAttributes",
                operator: "Contains",
                value1: "attributeB"
            },
            sort: {
                path: "title",
                descending: true
            }
        }).then(function (oResult) {
            assert.equal(oResult.count, 25,
                "search return object.count=25");
            assert.equal(Array.isArray(oResult.data), true,
                "search return object.data=array");
            assert.equal(oResult.data.length, 5,
                "search return object.data.length=5");

            //sorted result third page sorted desc by title
            assert.equal(oResult.data[0].title, "title12",
                "check sorted title value title12");
            assert.equal(oResult.data[1].title, "title11",
                "check sorted title value title11");
            assert.equal(oResult.data[2].title, "title10",
                "check sorted title value title10");
            assert.equal(oResult.data[3].title, "title1",
                "check sorted title value title0");
            assert.equal(oResult.data[4].title, "title0",
                "check sorted title value title0");
            done();
        });
    });

    QUnit.test("search with searchTerm= 'keyword-', top=10, skip=0, filter=technicalAttributes contains attributeB1 and technicalAttributes contains attributeA", function (assert) {
        var done = assert.async();
        return this.oAdapter.search({
            searchTerm: "keyword-",
            top: 10,
            skip: 0,
            filter: {
                filters: [
                    {
                        path: "technicalAttributes",
                        operator: "Contains",
                        value1: "attributeB1"
                    },
                    {
                        path: "technicalAttributes",
                        operator: "Contains",
                        value1: "attributeA"
                    }
                ],
                and: true
            },
            sorter: [
                {
                    path: "subtitle",
                    descending: false
                },
                {
                    path: "title",
                    descending: true
                }
            ]
        }).then(function (oResult) {
            assert.equal(oResult.count, 11,
                "search return object.count=11");
            assert.equal(Array.isArray(oResult.data), true,
                "search return object.data=array");
            assert.equal(oResult.data.length, 10,
                "search return object.data.length=10");

            //sorted result third page sorted desc by title
            assert.equal(oResult.data[0].title, "title1",
                "check sorted title value title1");
            assert.equal(oResult.data[0].description, "subtitle1",
                "check sorted title value subtitle1");
            assert.equal(oResult.data[1].title, "title10",
                "check sorted title value title10");
            assert.equal(oResult.data[1].description, "subtitle0",
                "check sorted title value subtitle0");
            assert.equal(oResult.data[2].title, "title11",
                "check sorted title value title11");
            assert.equal(oResult.data[3].title, "title12",
                "check sorted title value title12");
            assert.equal(oResult.data[4].title, "title13",
                "check sorted title value title12");
            done();
        });
    });

    QUnit.test("search for specific entry by contentProviderLabel", function (assert) {
        return this.oAdapter.search({
            searchTerm: "system12"
        }).then(function (oResult) {
            assert.equal(oResult.count, 1,
                "search return object.count=1");
            assert.equal(oResult.data[0].title, "title12",
                "check sorted title value title12");
        });
    });
});
