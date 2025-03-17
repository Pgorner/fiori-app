/*global QUnit*/

sap.ui.define([
    "sap/ovp/filter/FilterUtils", 
    "sap/ui/model/Filter"
], function (
    FilterUtils, 
    FilterModel
) {
    "use strict";

    QUnit.test("Apply filters to List Card v2 - test function applyFiltersToV2Card", function (assert) {
        var aFilters = [];
        aFilters.push(
            new FilterModel({
                path: "ID",
                operator: "EQ",
                value1: 201,
                value2: undefined,
            })
        );
        var allFilters = [];
        allFilters.push(
            new FilterModel({
                filters: aFilters,
            })
        );

        var aFilters = allFilters;
        var fnFilter = sinon.spy();
        var fnFilterCardBinding = sinon.spy();
        var cardTestData = {
            cardId: "card001",
            counter: 7,
            enableClick: true,
            entitySet: {
                entityType: "CatalogService.Books",
                name: "Books",
            },
            entityType: {
                name: "Books",
                namespace: "CatalogService",
                property: [{ name: "ID", type: "Edm.Int32", extensions: [], "sap:label": "ID" }],
            },
            oMainComponent: {
                getGlobalFilter: function () {
                    return {
                        getModel: function () {
                            return {};
                        },
                    };
                },
                getMacroFilterBar: function () {
                    return false;
                },
            },
            getCardPropertiesModel: function () {
                return {
                    getProperty: function (sPath) {
                        return "sap.ovp.cards.list";
                    },
                };
            },
            getView: function () {
                return {
                    getModel: function (sParam) {
                        return {
                            getProperty: function (sParam) {
                                return {
                                    name: "Books",
                                    namespace: "CatalogService",
                                    property: [{ name: "ID", type: "Edm.Int32", extensions: [], "sap:label": "ID" }],
                                };
                            },
                        };
                    },
                };
            },
            getCardItemsBinding: function () {
                return {
                    filter: fnFilterCardBinding,
                };
            },
            getKPIBinding: function () {
                return {
                    filter: fnFilter,
                };
            },
            getEntityType: function () {
                return {
                    name: "Books",
                    namespace: "CatalogService",
                    property: [{ name: "ID", type: "Edm.Int32", extensions: [], "sap:label": "ID" }],
                };
            },
        };

        FilterUtils.applyFiltersToV2Card(aFilters, cardTestData);
        assert.ok(fnFilter.calledOnce === true, "KPI Binding filter is called once");
        assert.ok(fnFilterCardBinding.calledOnce === true, "KPI Binding filter is called once");
    });

    QUnit.test("Apply filters to List Card v4 - test function applyFiltersToV4Card", function (assert) {
        var aFilters = [];
        aFilters.push(
            new FilterModel({
                path: "ID",
                operator: "EQ",
                value1: 201,
                value2: undefined,
            })
        );
        var allFilters = [];
        allFilters.push(
            new FilterModel({
                filters: aFilters,
            })
        );

        var aFilters = allFilters;
        var fnFilterv4 = sinon.spy();
        var fnFilterCardBindingv4 = sinon.spy();
        var cardTestData = {
            cardId: "card001",
            counter: 7,
            enableClick: true,
            entitySet: {
                entityType: "CatalogService.Books",
                name: "Books",
            },
            entityType: {
                name: "Books",
                namespace: "CatalogService",
                property: [{ name: "ID", type: "Edm.Int32", extensions: [], "sap:label": "ID" }],
            },
            oMainComponent: {
                getGlobalFilter: function () {
                    return {
                        getModel: function () {
                            return {};
                        },
                    };
                },
                getMacroFilterBar: function () {
                    return false;
                },
            },
            getCardPropertiesModel: function () {
                return {
                    getProperty: function (sPath) {
                        return "sap.ovp.cards.v4.list";
                    },
                };
            },
            getView: function () {
                return {
                    getModel: function (sParam) {
                        return {
                            getProperty: function (sParam) {
                                return {
                                    name: "Books",
                                    namespace: "CatalogService",
                                    property: [{ name: "ID", type: "Edm.Int32", extensions: [], "sap:label": "ID" }],
                                    $Type: "CatalogService.Books",
                                };
                            },
                            getMetadata: function () {
                                return {
                                    getData: function () {},
                                };
                            },
                            getMetaModel: function () {
                                return {
                                    getData: function () {
                                        return {
                                            "CatalogService.Books": {
                                                name: "Books",
                                                namespace: "CatalogService",
                                                property: [
                                                    {
                                                        name: "ID",
                                                        type: "Edm.Int32",
                                                        extensions: [],
                                                        "sap:label": "ID",
                                                    },
                                                ],
                                            },
                                        };
                                    },
                                };
                            },
                        };
                    },
                };
            },
            getCardItemsBinding: function () {
                return {
                    filter: fnFilterCardBindingv4,
                };
            },
            getKPIBinding: function () {
                return {
                    filter: fnFilterv4,
                };
            },
            getEntityType: function () {
                return {
                    name: "Books",
                    namespace: "CatalogService",
                    property: [{ name: "ID", type: "Edm.Int32", extensions: [], "sap:label": "ID" }],
                };
            },
        };

        FilterUtils.applyFiltersToV4Card(aFilters, cardTestData, false);
        assert.ok(fnFilterv4.calledOnce === true, "KPI Binding filter is called once");
        assert.ok(fnFilterCardBindingv4.calledOnce === true, "KPI Binding filter is called once");
    });

    QUnit.test("Apply filters to analytical Card v4 - test function applyFiltersToV4AnalyticalCard", function (assert) {
        var aFilters = [];
        aFilters.push(
            new FilterModel({
                path: "ID",
                operator: "EQ",
                value1: 201,
                value2: undefined,
            })
        );
        var allFilters = [];
        allFilters.push(
            new FilterModel({
                filters: aFilters,
            })
        );

        var aFilters = allFilters;
        var fnFilterv4 = sinon.spy();
        var fnFilterCardBindingv4 = sinon.spy();
        var cardTestData = {
            cardId: "card001",
            counter: 7,
            enableClick: true,
            entitySet: {
                entityType: "CatalogService.Books",
                name: "Books",
            },
            entityType: {
                name: "Books",
                namespace: "CatalogService",
                property: [{ name: "ID", type: "Edm.Int32", extensions: [], "sap:label": "ID" }],
            },
            oMainComponent: {
                getGlobalFilter: function () {
                    return {
                        getModel: function () {
                            return {};
                        },
                    };
                },
                getMacroFilterBar: function () {
                    return false;
                },
            },
            getCardPropertiesModel: function () {
                return {
                    getProperty: function (sPath) {
                        return "sap.ovp.cards.v4.analytical";
                    },
                };
            },
            getView: function () {
                return {
                    getModel: function (sParam) {
                        return {
                            getProperty: function (sParam) {
                                return {
                                    name: "Books",
                                    namespace: "CatalogService",
                                    property: [{ name: "ID", type: "Edm.Int32", extensions: [], "sap:label": "ID" }],
                                    $Type: "CatalogService.Books",
                                };
                            },
                            getMetadata: function () {
                                return {
                                    getData: function () {},
                                };
                            },
                            getMetaModel: function () {
                                return {
                                    getData: function () {
                                        return {
                                            "CatalogService.Books": {
                                                ID: {
                                                    name: "ID",
                                                    type: "Edm.Int32",
                                                    extensions: [],
                                                    "sap:label": "ID",
                                                },
                                            },
                                        };
                                    },
                                };
                            },
                            getData: function () {
                                return {
                                    entityType: {
                                        $Type: "CatalogService.Books",
                                    },
                                };
                            },
                        };
                    },
                };
            },
            getCardItemsBinding: function () {
                return {
                    sPath: "ID",
                    oContext: {},
                    filter: function () {},
                    oModel: {
                        getMetaModel: function () {
                            return {
                                getMetaContext: function () {},
                                resolve: function (sParam) {
                                    return Promise.resolve("ID");
                                },
                                fetchObject: function () {
                                    return Promise.resolve({ $Type: "Edm.Int32" });
                                },
                            };
                        },
                        resolve: function (sParam) {
                            Promise.resolve(sParam);
                        },
                    },
                    mParameters: {
                        $apply: "groupby((buzFunc),aggregate(counter with sum as counterAggregate))",
                    },
                    setAggregation: fnFilterv4,
                };
            },
            getKPIBinding: function () {
                return {
                    filter: fnFilterCardBindingv4,
                };
            },
            getEntityType: function () {
                return {
                    name: "Books",
                    namespace: "CatalogService",
                    property: [{ name: "ID", type: "Edm.Int32", extensions: [], "sap:label": "ID" }],
                };
            },
        };

        FilterUtils.applyFiltersToV4AnalyticalCard(aFilters, cardTestData, true);
        assert.ok(fnFilterCardBindingv4.calledOnce === true, "KPI Binding filter is called once");
    });

    QUnit.test("No filters applied to analytical Card v4 - test function applyFiltersToV4AnalyticalCard", function (assert) {
        var aFilters = [];
        aFilters.push(
            new FilterModel({
                path: "ID",
                operator: "EQ",
                value1: 201,
                value2: undefined,
            })
        );
        var allFilters = [];
        allFilters.push(
            new FilterModel({
                filters: aFilters,
            })
        );

        var aFilters = allFilters;
        var fnFilterv4 = sinon.spy();
        var fnFilterCardBindingv4 = sinon.spy();
        var cardTestData = {
            cardId: "card001",
            counter: 7,
            enableClick: true,
            entitySet: {
                entityType: "CatalogService.Books",
                name: "Books",
            },
            entityType: {
                name: "Books",
                namespace: "CatalogService",
                property: [{ name: "ID", type: "Edm.Int32", extensions: [], "sap:label": "ID" }],
            },
            oMainComponent: {
                getGlobalFilter: function () {
                    return {
                        getModel: function () {
                            return {};
                        },
                    };
                },
                getMacroFilterBar: function () {
                    return false;
                },
            },
            getCardPropertiesModel: function () {
                return {
                    getProperty: function (sPath) {
                        return "sap.ovp.cards.v4.analytical";
                    },
                };
            },
            getView: function () {
                return {
                    getModel: function (sParam) {
                        return {
                            getProperty: function (sParam) {
                                return {
                                    name: "Books",
                                    namespace: "CatalogService",
                                    property: [{ name: "ID", type: "Edm.Int32", extensions: [], "sap:label": "ID" }],
                                    $Type: "CatalogService.Books",
                                };
                            },
                            getMetadata: function () {
                                return {
                                    getData: function () {},
                                };
                            },
                            getMetaModel: function () {
                                return {
                                    getData: function () {
                                        return {
                                            "CatalogService.Books": {},
                                        };
                                    },
                                };
                            },
                            getData: function () {
                                return {
                                    entityType: {
                                        $Type: "CatalogService.Books",
                                    },
                                };
                            },
                        };
                    },
                };
            },
            getCardItemsBinding: function () {
                return {
                    sPath: "ID",
                    oContext: {},
                    filter: function () {},
                    oModel: {
                        getMetaModel: function () {
                            return {
                                getMetaContext: function () {},
                                resolve: function (sParam) {
                                    return Promise.resolve("ID");
                                },
                                fetchObject: function () {
                                    return Promise.resolve({ $Type: "Edm.Int32" });
                                },
                            };
                        },
                        resolve: function (sParam) {
                            Promise.resolve(sParam);
                        },
                    },
                    mParameters: {
                        $apply: "filter(prdVerDesc eq 'SAP S/4HANA 2021')/groupby((buzFunc),aggregate(counter with sum as counterAggregate))",
                    },
                    setAggregation: fnFilterv4,
                };
            },
            getKPIBinding: function () {
                return {
                    filter: fnFilterCardBindingv4,
                };
            },
            getEntityType: function () {
                return {
                    name: "Books",
                    namespace: "CatalogService",
                    property: [{ name: "ID", type: "Edm.Int32", extensions: [], "sap:label": "ID" }],
                };
            },
        };

        FilterUtils.applyFiltersToV4AnalyticalCard(aFilters, cardTestData, true);
        assert.ok(fnFilterv4.calledOnce === true, "cardBinding.setAggregation() is called once");
        assert.ok(fnFilterCardBindingv4.calledOnce === true, "KPI Binding filter is called once");
    });
});
