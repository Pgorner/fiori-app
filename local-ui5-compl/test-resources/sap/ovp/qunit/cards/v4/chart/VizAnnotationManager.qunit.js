/*global QUnit*/

sap.ui.define([
    "sap/ovp/cards/v4/charts/VizAnnotationManager",
    "sap/viz/ui5/controls/VizFrame",
    "test-resources/sap/ovp/Mockserver/MockServerHelper",
    "sap/ovp/cards/v4/V4AnnotationHelper",
    "sap/ovp/cards/charts/VizAnnotationManager"
], function (
    VizAnnotationManager,
    VizFrame,
    MockServerHelper,
    V4AnnotationHelper,
    ChartVizAnnotationManager
) {
    'use strict';

    var oConfig;

    QUnit.module("sap.ovp.qunit.cards.v4.charts.VizAnnotationManager", {
        beforeEach: function () {
            oConfig = {
                model: "CATALOG_MODEL_V4",
                template: "sap.ovp.cards.v4.charts.analytical",
                settings: {
                    title: "Most Popular Products V4",
                    subTitle: "In the last six months",
                    entitySet: "Books",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#donutchart",
                },
                id: "card010",
            };
        },
        afterEach: function () {
            MockServerHelper.closeServer();
        }
    });

    QUnit.test("VizAnnotationManager - function formGroupByList", function (assert) {
        var aUnitMeasureList = ["currencyCode"];
        var aDimensionsList = ["category", "currencyCode", "price", "title"];
        var actualResult = VizAnnotationManager.formGroupByList(aUnitMeasureList, aDimensionsList);
        var expectedResult = ["category", "currencyCode", "price", "title"];
        assert.deepEqual(actualResult, expectedResult, "unique groupByList is formed")
    });

    QUnit.test("VizAnnotationManager - function formatItems, when field in selectionVariant is not a part of groupby", function (assert) {
        var oMeasures = [
            {
                "$Type": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
                "Measure": {
                    "$PropertyPath": "stock"
                },
                "Role": {
                    "$EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
                }
            }
        ];
        var oEntitySet = {
            "$kind": "EntitySet",
            "$Type": "CatalogService.Books",
            "$NavigationPropertyBinding": {
                "author": "Authors"
            }
        };
        var oSelectionVariant = {
            "SelectOptions": [
                {
                    "PropertyName": {
                        "$PropertyPath": "ID"
                    },
                    "Ranges": [
                        {
                            "Sign": {
                                "$EnumMember": "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I"
                            },
                            "Option": {
                                "$EnumMember": "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/EQ"
                            },
                            "Low": "201"
                        }
                    ]
                }
            ]
        };
        var oDimensions = [
            {
                "$Type": "com.sap.vocabularies.UI.v1.ChartDimensionAttributeType",
                "Dimension": {
                    "$PropertyPath": "category"
                },
                "Role": {
                    "$EnumMember": "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category"
                }
            },
            {
                "$Type": "com.sap.vocabularies.UI.v1.ChartDimensionAttributeType",
                "Dimension": {
                    "$PropertyPath": "price"
                },
                "Role": {
                    "$EnumMember": "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category"
                }
            },
            {
                "$Type": "com.sap.vocabularies.UI.v1.ChartDimensionAttributeType",
                "Dimension": {
                    "$PropertyPath": "title"
                },
                "Role": {
                    "$EnumMember": "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category"
                }
            }
        ];
        var chartType = {
            "$EnumMember": "com.sap.vocabularies.UI.v1.ChartType/Donut"
        };
        var oOvpModel = {
            getProperty: function (sPath) {
                if (sPath == "/metaModel") {
                    return {
                        getObject: function (sPath) {
                            if (sPath === "/") {
                                return {
                                    "$kind": "EntityContainer",
                                    "Books": {
                                        "$kind": "EntitySet",
                                        "$Type": "CatalogService.Books",
                                        "$NavigationPropertyBinding": {
                                            "author": "Authors"
                                        }
                                    },
                                    "Authors": {
                                        "$kind": "EntitySet",
                                        "$Type": "CatalogService.Authors",
                                        "$NavigationPropertyBinding": {
                                            "books": "Books"
                                        }
                                    },
                                    "Orders": {
                                        "$kind": "EntitySet",
                                        "$Type": "CatalogService.Orders",
                                        "$NavigationPropertyBinding": {
                                            "book": "Books",
                                            "country": "Countries"
                                        }
                                    },
                                    "Countries": {
                                        "$kind": "EntitySet",
                                        "$Type": "CatalogService.Countries",
                                        "$NavigationPropertyBinding": {
                                            "texts": "Countries_texts",
                                            "localized": "Countries_texts"
                                        }
                                    },
                                    "Countries_texts": {
                                        "$kind": "EntitySet",
                                        "$Type": "CatalogService.Countries_texts"
                                    }
                                }
                            } else if (sPath === "/CatalogService.Books@com.sap.vocabularies.UI.v1.Chart#year") {
                                return {
                                    "MeasureAttributes" : [{}]  
                                }
                            }
                        },
                        getData: function() {
                            return  {
                                $Annotations: {
                                    'CatalogService.Books': {}
                                }
                            }
                        }
                    };
                } else if (sPath == "/entitySet") {
                    return "Books";
                } else if (sPath == "/chartAnnotationPath") {
                    return 'com.sap.vocabularies.UI.v1.Chart#year';
                }
            },
            getId: function () {
                return undefined;
            },
            getMetaModel: function () {
                return {
                    getData: function () {
                        return {
                            $Annotations: {}
                        }
                    },
                    getObject: function () {
                        return {
                            $Annotations: {}
                        }
                    }
                }
            },
            getODataVersion: function() {
                return "4.0";
            }
        };
        var iContext = {
            getSetting: function (sModel) {
                if (sModel == "dataModel") {
                    return oOvpModel;
                } else if (sModel == "ovpCardProperties") {
                    return oOvpModel;
                }
            },
        };
        var expectedResult =
            "{path: '/Books', parameters: {$apply:'groupby((category,price,title),aggregate(stock with sum as stockAggregate))'}, filters: []}";
        var actualResult = VizAnnotationManager.formatItems(
            iContext,
            oEntitySet,
            oSelectionVariant,
            undefined,
            oDimensions,
            oMeasures,
            chartType
        );
        assert.ok(expectedResult == actualResult, "formatItems method returns the correct resultant string with empty filters");
    });

    QUnit.test("VizAnnotationManager - function formatItems, when field in selectionVariant is a part of groupby", function (assert) {
        var oMeasures = [
            {
                "$Type": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
                "Measure": {
                    "$PropertyPath": "stock"
                },
                "Role": {
                    "$EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
                }
            }
        ];
        var oEntitySet = {
            "$kind": "EntitySet",
            "$Type": "CatalogService.Books",
            "$NavigationPropertyBinding": {
                "author": "Authors"
            }
        };
        var oSelectionVariant = {
            "SelectOptions": [
                {
                    "PropertyName": {
                        "$PropertyPath": "category"
                    },
                    "Ranges": [
                        {
                            "Sign": {
                                "$EnumMember": "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I"
                            },
                            "Option": {
                                "$EnumMember": "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/EQ"
                            },
                            "Low": "Horror"
                        }
                    ]
                }
            ]
        };
        var oDimensions = [
            {
                "$Type": "com.sap.vocabularies.UI.v1.ChartDimensionAttributeType",
                "Dimension": {
                    "$PropertyPath": "category"
                },
                "Role": {
                    "$EnumMember": "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category"
                }
            },
            {
                "$Type": "com.sap.vocabularies.UI.v1.ChartDimensionAttributeType",
                "Dimension": {
                    "$PropertyPath": "price"
                },
                "Role": {
                    "$EnumMember": "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category"
                }
            },
            {
                "$Type": "com.sap.vocabularies.UI.v1.ChartDimensionAttributeType",
                "Dimension": {
                    "$PropertyPath": "title"
                },
                "Role": {
                    "$EnumMember": "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category"
                }
            }
        ];
        var chartType = {
            "$EnumMember": "com.sap.vocabularies.UI.v1.ChartType/Donut"
        };
        var oOvpModel = {
            getProperty: function (sPath) {
                if (sPath == "/metaModel") {
                    return {
                        getObject: function (sPath) {
                            if (sPath === "/") {
                                return {
                                    "$kind": "EntityContainer",
                                    "Books": {
                                        "$kind": "EntitySet",
                                        "$Type": "CatalogService.Books",
                                        "$NavigationPropertyBinding": {
                                            "author": "Authors"
                                        }
                                    },
                                    "Authors": {
                                        "$kind": "EntitySet",
                                        "$Type": "CatalogService.Authors",
                                        "$NavigationPropertyBinding": {
                                            "books": "Books"
                                        }
                                    },
                                    "Orders": {
                                        "$kind": "EntitySet",
                                        "$Type": "CatalogService.Orders",
                                        "$NavigationPropertyBinding": {
                                            "book": "Books",
                                            "country": "Countries"
                                        }
                                    },
                                    "Countries": {
                                        "$kind": "EntitySet",
                                        "$Type": "CatalogService.Countries",
                                        "$NavigationPropertyBinding": {
                                            "texts": "Countries_texts",
                                            "localized": "Countries_texts"
                                        }
                                    },
                                    "Countries_texts": {
                                        "$kind": "EntitySet",
                                        "$Type": "CatalogService.Countries_texts"
                                    }
                                }
                            } else if (sPath === "/CatalogService.Books@com.sap.vocabularies.UI.v1.Chart#year") {
                                return {
                                    "MeasureAttributes" : [{}]  
                                }
                            }
                        },
                        getData: function() {
                            return  {
                                $Annotations: {
                                    'CatalogService.Books': {}
                                }
                            }
                        }
                    };
                } else if (sPath == "/entitySet") {
                    return "Books";
                } else if (sPath == "/chartAnnotationPath") {
                    return 'com.sap.vocabularies.UI.v1.Chart#year';
                }
            },
            getId: function () {
                return undefined;
            },
            getMetaModel: function () {
                return {
                    getData: function () {
                        return {
                            $Annotations: {}
                        }
                    },
                    getObject: function () {
                        return {
                            $Annotations: {}
                        }
                    }
                }
            },
            getODataVersion: function() {
                return "4.0";
            }
        };
        var iContext = {
            getSetting: function (sModel) {
                if (sModel == "dataModel") {
                    return oOvpModel;
                } else if (sModel == "ovpCardProperties") {
                    return oOvpModel;
                }
            },
        };
        var expectedResult = `{path: '/Books', parameters: {$apply:'groupby((category,price,title),aggregate(stock with sum as stockAggregate))'}, filters: [{"path":"category","operator":"EQ","value1":"Horror","sign":"I"}]}`;
        var actualResult = VizAnnotationManager.formatItems(
            iContext,
            oEntitySet,
            oSelectionVariant,
            undefined,
            oDimensions,
            oMeasures,
            chartType
        );
        assert.ok(expectedResult == actualResult, "formatItems method returns the correct resultant string with non empty filters");
    });

    QUnit.test("VizAnnotationManager - function formatItems, when there is a dynamic measure", function (assert) {
        var oMeasures = [
            {
                "$Type": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
                "Measure": {
                    "$PropertyPath": "sale"
                },
                "Role": {
                    "$EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
                }
            },
            {
                "$Type": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
                "Measure": {
                    "$PropertyPath": "price"
                },
                "Role": {
                    "$EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis2"
                }
            },
            {
                "$Type": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
                "DynamicMeasure": {
                    "$AnnotationPath": "@com.sap.vocabularies.Analytics.v1.AggregatedProperty#MAX"
                },
                "Role": {
                    "$EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis3"
                }
            }
        ];
        var oEntitySet = {
            "$kind": "EntitySet",
            "$Type": "CatalogService.Books",
            "$NavigationPropertyBinding": {
                "author": "Authors",
                "purchases": "Purchases"
            }
        };
        var oDimensions = [
            {
                "$Type": "com.sap.vocabularies.UI.v1.ChartDimensionAttributeType",
                "Dimension": {
                    "$PropertyPath": "DeliveryCalendarYear"
                },
                "Role": {
                    "$EnumMember": "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category"
                }
            }
        ];
        var chartType = {
            "$EnumMember": "com.sap.vocabularies.UI.v1.ChartType/Line"
        };
        var oOvpModel = {
            getProperty: function (sPath) {
                if (sPath == "/metaModel") {
                    return {
                        getObject: function (sPath) {
                            if (sPath === "/") {
                                return {
                                    "$kind": "EntityContainer",
                                    "Books": {
                                        "$kind": "EntitySet",
                                        "$Type": "CatalogService.Books"
                                    }
                                }
                            } else if (sPath === "/CatalogService.Books/@") {
                                return {
                                    '@com.sap.vocabularies.Analytics.v1.AggregatedProperty#MAX': {
                                        "@com.sap.vocabularies.Common.v1.Label": "Maximum Stock Price",
                                        "$Type": "com.sap.vocabularies.Analytics.v1.AggregatedPropertyType",
                                        "Name": "maxStock",
                                        "AggregationMethod": "max",
                                        "AggregatableProperty": {
                                            "$PropertyPath": "stock"
                                        }
                                    }
                                }
                            } else if (sPath === "/CatalogService.Books/@com.sap.vocabularies.Analytics.v1.AggregatedProperty#MAX") {
                                return {
                                    "@com.sap.vocabularies.Common.v1.Label": "Maximum Stock Price",
                                    "$Type": "com.sap.vocabularies.Analytics.v1.AggregatedPropertyType",
                                    "Name": "maxStock",
                                    "AggregationMethod": "max",
                                    "AggregatableProperty": {
                                        "$PropertyPath": "stock"
                                    }
                                }
                            } else if (sPath === "/CatalogService.Books@com.sap.vocabularies.UI.v1.Chart#year") {
                                return {
                                    "$Type": "com.sap.vocabularies.UI.v1.ChartDefinitionType",
                                    "Title": "Item Category Chart",
                                    "Description": "Testing Item Category Chart",
                                    "ChartType": {
                                        "$EnumMember": "com.sap.vocabularies.UI.v1.ChartType/Line"
                                    },
                                    "Measures": [
                                        {
                                            "$PropertyPath": "sale"
                                        },
                                        {
                                            "$PropertyPath": "price"
                                        }
                                    ],
                                    "DynamicMeasures": [
                                        {
                                            "$AnnotationPath": "@com.sap.vocabularies.Analytics.v1.AggregatedProperty#MAX"
                                        }
                                    ],
                                    "Dimensions": [
                                        {
                                            "$PropertyPath": "DeliveryCalendarYear"
                                        }
                                    ],
                                    "MeasureAttributes": [
                                        {
                                            "$Type": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
                                            "Measure": {
                                                "$PropertyPath": "sale"
                                            },
                                            "Role": {
                                                "$EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
                                            }
                                        },
                                        {
                                            "$Type": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
                                            "Measure": {
                                                "$PropertyPath": "price"
                                            },
                                            "Role": {
                                                "$EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis2"
                                            }
                                        },
                                        {
                                            "$Type": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
                                            "DynamicMeasure": {
                                                "$AnnotationPath": "@com.sap.vocabularies.Analytics.v1.AggregatedProperty#MAX"
                                            },
                                            "Role": {
                                                "$EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis3"
                                            }
                                        }
                                    ],
                                    "DimensionAttributes": [
                                        {
                                            "$Type": "com.sap.vocabularies.UI.v1.ChartDimensionAttributeType",
                                            "Dimension": {
                                                "$PropertyPath": "DeliveryCalendarYear"
                                            },
                                            "Role": {
                                                "$EnumMember": "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category"
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    };
                } else if (sPath == "/entitySet") {
                    return "Books";
                } else if (sPath == "/measureAggregate") {
                    return {
                        "Axis2": "min"
                    }
                } else if (sPath == "/chartAnnotationPath") {
                    return 'com.sap.vocabularies.UI.v1.Chart#year';
                }
            },
            getId: function () {
                return undefined;
            },
            getMetaModel: function () {
                return {
                    getData: function () {
                        return {}
                    },
                    getObject: function () {
                        return {}
                    }
                }
            },
            getODataVersion: function() {
                return "4.0";
            }
        };
        var iContext = {
            getSetting: function (sModel) {
                if (sModel == "dataModel") {
                    return oOvpModel;
                } else if (sModel == "ovpCardProperties") {
                    return oOvpModel;
                }
            }
        };
        var expectedResult = "{path: '/Books', parameters: {$apply:'groupby((DeliveryCalendarYear),aggregate(sale with sum as saleAggregate,price with min as priceAggregate,stock with max as stockAggregate))'}}";
        var actualResult = VizAnnotationManager.formatItems(
            iContext,
            oEntitySet,
            undefined,
            undefined,
            oDimensions,
            oMeasures,
            chartType
        );
        assert.ok(expectedResult == actualResult, "formatItems method returns the correct resultant string with dynamic measure aggregation value used for aggregation");
    });

    QUnit.test("VizAnnotationManager - function setChartUoMTitle, appends the unit of measure to the chart title", function (assert) {
        var fnDone = assert.async();
        MockServerHelper.startServer().then(function (oModel) {
            MockServerHelper.createXMLView(oConfig, oModel).then(function (oView) {
                var oController = oView.getController();
                var oVizFrame = new VizFrame(
                    "Vcard010_cardchartsdonut--analyticalChart",
                    {
                        uiConfig: { applicationSet: "fiori" },
                        vizCustomizations: null,
                        vizProperties: null,
                        vizScales: null,
                        vizType: "donut",
                        width: "100%",
                    }
                );
                oVizFrame.setModel(oController.getCardPropertiesModel(), "ovpCardProperties");
                oVizFrame.getModel = function () {
                    return {
                        getId: function () {
                            return 'id-1675424757965-18';
                        },
                        getMetaModel: function () {
                            return {
                                getObject: function (sPath) {
                                    if (sPath === "/") {
                                        return {
                                            "$kind": "EntityContainer",
                                            "Books": {
                                                "$kind": "EntitySet",
                                                "$Type": "CatalogService.Books",
                                                "$NavigationPropertyBinding": {
                                                    "author": "Authors"
                                                }
                                            }
                                        };
                                    } else if (sPath === "/CatalogService.Books") {
                                        return {
                                            "$kind": "EntityType",
                                            "$Key": [
                                                "ID"
                                            ],
                                            "stock": {
                                                "$kind": "Property",
                                                "$Type": "Edm.Int32",
                                                "annotations": {
                                                    "@com.sap.vocabularies.Analytics.v1.Measure": true,
                                                    "@com.sap.vocabularies.Common.v1.Label": "Stock",
                                                    "@Org.OData.Measures.V1.ISOCurrency": {
                                                        "$Path": "code"
                                                    },
                                                    "@com.sap.vocabularies.UI.v1.DataFieldDefault": {
                                                        "$Type": "com.sap.vocabularies.UI.v1.DataField",
                                                        "Value": {
                                                            "$Path": "stock"
                                                        }
                                                    }
                                                },
                                                "$ui5.type": {
                                                    "oFormat": null
                                                }
                                            },
                                            "code": {
                                                "$kind": "Property",
                                                "$Type": "Edm.String",
                                                "annotations": {
                                                    "@com.sap.vocabularies.Common.v1.Text": {
                                                        "$Path": "CurrencyCodeText"
                                                    },
                                                    "@com.sap.vocabularies.UI.v1.DataFieldDefault": {
                                                        "$Type": "com.sap.vocabularies.UI.v1.DataField",
                                                        "Value": {
                                                            "$Path": "code"
                                                        }
                                                    }
                                                },
                                                "$ui5.type": {
                                                    "_sParsedEmptyString": null
                                                }
                                            }
                                        }
                                    }
                                }
                            };
                        },
                        getProperty: function (sPath) {
                            if (sPath === "/entitySet") {
                                return "Books";
                            } else if (sPath === "/entityType") {
                                return {
                                    "$kind": "EntitySet",
                                    "$Type": "CatalogService.Books",
                                    "$NavigationPropertyBinding": {
                                        "author": "Authors"
                                    }
                                };
                            } else if (sPath === "/chartAnnotationPath") {
                                return 'com.sap.vocabularies.UI.v1.Chart#donutchart';
                            }
                        },
                        getODataVersion: function() {
                            return "4.0";
                        }
                    };
                };
                oVizFrame.getFeeds = function () {
                    return [
                        {
                            getType: function () {
                                return "Measure";
                            },
                            getValues: function () {
                                return ['Stock'];
                            }
                        }
                    ]
                }
                oVizFrame.setVizProperties({ title: { text: 'Stock by category, price and Title' } });
                var vizData = [
                    {
                        "stockAggregate@odata.type": "#Decimal",
                        "stockAggregate": "1341",
                        "category": "Novel",
                        "price": 100,
                        "code": "USD",
                        "title": "Jane Eyre",
                        "@odata.id": null
                    },
                    {
                        "stockAggregate@odata.type": "#Decimal",
                        "stockAggregate": "1331",
                        "category": "Novel",
                        "price": 100,
                        "code": "USD",
                        "title": "MRF",
                        "@odata.id": null
                    }
                ];
                var entityType = {
                    "CatalogService.Books": {
                        "@Org.OData.Aggregation.V1.ApplySupported": {
                            "$Type": "Org.OData.Aggregation.V1.ApplySupportedType",
                            "PropertyRestrictions": true
                        },
                        "@com.sap.vocabularies.UI.v1.Chart#donutchart": {
                            "MeasureAttributes": [
                                {
                                    "$Type": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
                                    "Measure": {
                                        "$PropertyPath": "stock"
                                    },
                                    "Role": {
                                        "$EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
                                    }
                                }
                            ],
                            "DimensionAttributes": [
                                {
                                    "$Type": "com.sap.vocabularies.UI.v1.ChartDimensionAttributeType",
                                    "Dimension": {
                                        "$PropertyPath": "category"
                                    },
                                    "Role": {
                                        "$EnumMember": "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category"
                                    }
                                },
                                {
                                    "$Type": "com.sap.vocabularies.UI.v1.ChartDimensionAttributeType",
                                    "Dimension": {
                                        "$PropertyPath": "price"
                                    },
                                    "Role": {
                                        "$EnumMember": "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category"
                                    }
                                },
                                {
                                    "$Type": "com.sap.vocabularies.UI.v1.ChartDimensionAttributeType",
                                    "Dimension": {
                                        "$PropertyPath": "title"
                                    },
                                    "Role": {
                                        "$EnumMember": "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category"
                                    }
                                }
                            ],
                            "ChartType": {
                                "$EnumMember": "com.sap.vocabularies.UI.v1.ChartType/Donut"
                            }
                        }
                    }
                };
                var expectedResult = oVizFrame.getVizProperties().title.text + " | USD";
                VizAnnotationManager.setChartUoMTitle(oVizFrame, vizData, entityType);
                var actualResult = oVizFrame.getVizProperties().title.text;
                assert.ok(expectedResult == actualResult, "setChartUoMTitle is appending UoM to the title");
                fnDone();
            });
        });
    });

    QUnit.test("VizAnnotationManager - function getChartTitle, is fetching the chart title correctly from i18n resource bundle", function (assert) {
        var fnDone = assert.async();
        MockServerHelper.startServer().then(function (oModel) {
            MockServerHelper.createXMLView(oConfig, oModel).then(function (oView) {
                var oController = oView.getController();
                var oVizFrame = new VizFrame(
                    "Vcard011_cardchartsdonut--analyticalChart",
                    {
                        uiConfig: { applicationSet: "fiori" },
                        vizCustomizations: null,
                        vizProperties: null,
                        vizScales: null,
                        vizType: "donut",
                        width: "100%",
                    }
                );
                oVizFrame.getModel = function (sPath) {
                    if (sPath === 'i18n') {
                        return {
                            getResourceBundle: function() {
                                return {
                                    getText: function(sPath) {
                                        if (sPath === 'CombinationChartTitle') {
                                           return 'Sales and Total Sales';
                                        }
                                    }
                                }
                            }
                        }
                    } else if (sPath === "ovpCardProperties") {
                        return oController.getCardPropertiesModel();
                    }
                };
                var sEntityType = oVizFrame.getModel("ovpCardProperties").getProperty("/entityType").$Type;
                var oEntityType = oController.getMetaModel().getData().$Annotations[sEntityType];
                var sChartAnnotationPath = 'com.sap.vocabularies.UI.v1.Chart#Eval_by_Combination';
                var expectedResult =  'Sales and Total Sales';
                var actualResult = VizAnnotationManager.getChartTitle(oEntityType, sChartAnnotationPath, oVizFrame);
                assert.ok(expectedResult == actualResult, "chart title is getting fetched correctly, when chart title is given from cds");   
                fnDone();
            });
        });
    });

    QUnit.test("VizAnnotationManager - function getPropertyTextColumnMap, map PropertTextColumn", function (assert) {
        var sProperty = "category";
        var sTextColumn = "network";
        var aVizData = [{title: 'Bislery', category: 'Horror', network: 'Prime', price: '600'},
        {title: 'Catweazle', category: 'Horror', network: 'Prime', price: '600'},
        {title: 'Eleonora', category: 'Adventure', network: 'Netflix', price: '450'},
        {title: 'Jane Eyre', category: 'Novel', network: 'Disney', price: '100'}];

        var expectedResult = {Horror: "Prime",Adventure: "Netflix", Novel: "Disney"} 
        var actualResult = ChartVizAnnotationManager.getPropertyTextColumnMap(sProperty, sTextColumn, aVizData);
        assert.ok(JSON.stringify(expectedResult) === JSON.stringify(actualResult), "Text Arrangement for Legends is mapped with Propety text column"); 
    });

    QUnit.test("VizAnnotationManager - function formatItems, when there is a Presentation Variant with sorter-ascending applied", function (assert) {
        var oMeasures = [
            {
                "$Type": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
                "Measure": {
                    "$PropertyPath": "sale"
                },
                "Role": {
                    "$EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
                }
            },
            {
                "$Type": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
                "Measure": {
                    "$PropertyPath": "price"
                },
                "Role": {
                    "$EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis2"
                }
            },
            {
                "$Type": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
                "DynamicMeasure": {
                    "$AnnotationPath": "@com.sap.vocabularies.Analytics.v1.AggregatedProperty#MAX"
                },
                "Role": {
                    "$EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis3"
                }
            }
        ];
        var oEntitySet = {
            "$kind": "EntitySet",
            "$Type": "CatalogService.Books",
            "$NavigationPropertyBinding": {
                "author": "Authors",
                "purchases": "Purchases"
            }
        };
        var oDimensions = [
            {
                "$Type": "com.sap.vocabularies.UI.v1.ChartDimensionAttributeType",
                "Dimension": {
                    "$PropertyPath": "DeliveryCalendarYear"
                },
                "Role": {
                    "$EnumMember": "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category"
                }
            }
        ];
        var chartType = {
            "$EnumMember": "com.sap.vocabularies.UI.v1.ChartType/Line"
        };
        var oPresentationVariant = {
            "$Type": "com.sap.vocabularies.UI.v1.PresentationVariantType",
            "SortOrder": [
                {
                    "$Type": "com.sap.vocabularies.Common.v1.SortOrderType",
                    "Property": {
                        "$PropertyPath": "DeliveryCalendarYear"
                    },
                    "Descending": false
                }
            ]      
        };
        var oOvpModel = {
            getProperty: function (sPath) {
                if (sPath == "/metaModel") {
                    return {
                        getObject: function (sPath) {
                            if (sPath === "/") {
                                return {
                                    "$kind": "EntityContainer",
                                    "Books": {
                                        "$kind": "EntitySet",
                                        "$Type": "CatalogService.Books"
                                    }
                                }
                            } else if (sPath === "/CatalogService.Books/@") {
                                return {
                                    '@com.sap.vocabularies.Analytics.v1.AggregatedProperty#MAX': {
                                        "@com.sap.vocabularies.Common.v1.Label": "Maximum Stock Price",
                                        "$Type": "com.sap.vocabularies.Analytics.v1.AggregatedPropertyType",
                                        "Name": "maxStock",
                                        "AggregationMethod": "max",
                                        "AggregatableProperty": {
                                            "$PropertyPath": "stock"
                                        }
                                    }
                                }
                            } else if (sPath === "/CatalogService.Books/@com.sap.vocabularies.Analytics.v1.AggregatedProperty#MAX") {
                                return {
                                    "@com.sap.vocabularies.Common.v1.Label": "Maximum Stock Price",
                                    "$Type": "com.sap.vocabularies.Analytics.v1.AggregatedPropertyType",
                                    "Name": "maxStock",
                                    "AggregationMethod": "max",
                                    "AggregatableProperty": {
                                        "$PropertyPath": "stock"
                                    }
                                }
                            } else if (sPath === "/CatalogService.Books@com.sap.vocabularies.UI.v1.Chart#year") {
                                return {
                                    "$Type": "com.sap.vocabularies.UI.v1.ChartDefinitionType",
                                    "Title": "Item Category Chart",
                                    "Description": "Testing Item Category Chart",
                                    "ChartType": {
                                        "$EnumMember": "com.sap.vocabularies.UI.v1.ChartType/Line"
                                    },
                                    "Measures": [
                                        {
                                            "$PropertyPath": "sale"
                                        },
                                        {
                                            "$PropertyPath": "price"
                                        }
                                    ],
                                    "DynamicMeasures": [
                                        {
                                            "$AnnotationPath": "@com.sap.vocabularies.Analytics.v1.AggregatedProperty#MAX"
                                        }
                                    ],
                                    "Dimensions": [
                                        {
                                            "$PropertyPath": "DeliveryCalendarYear"
                                        }
                                    ],
                                    "MeasureAttributes": [
                                        {
                                            "$Type": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
                                            "Measure": {
                                                "$PropertyPath": "sale"
                                            },
                                            "Role": {
                                                "$EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
                                            }
                                        },
                                        {
                                            "$Type": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
                                            "Measure": {
                                                "$PropertyPath": "price"
                                            },
                                            "Role": {
                                                "$EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis2"
                                            }
                                        },
                                        {
                                            "$Type": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
                                            "DynamicMeasure": {
                                                "$AnnotationPath": "@com.sap.vocabularies.Analytics.v1.AggregatedProperty#MAX"
                                            },
                                            "Role": {
                                                "$EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis3"
                                            }
                                        }
                                    ],
                                    "DimensionAttributes": [
                                        {
                                            "$Type": "com.sap.vocabularies.UI.v1.ChartDimensionAttributeType",
                                            "Dimension": {
                                                "$PropertyPath": "DeliveryCalendarYear"
                                            },
                                            "Role": {
                                                "$EnumMember": "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category"
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    };
                } else if (sPath == "/entitySet") {
                    return "Books";
                } else if (sPath == "/measureAggregate") {
                    return {
                        "Axis2": "min"
                    }
                } else if (sPath == "/chartAnnotationPath") {
                    return 'com.sap.vocabularies.UI.v1.Chart#year';
                }
            },
            getId: function () {
                return undefined;
            },
            getMetaModel: function () {
                return {
                    getData: function () {
                        return {}
                    },
                    getObject: function () {
                        return {}
                    }
                }
            },
            getODataVersion: function() {
                return "4.0";
            }
        };
        var iContext = {
            getSetting: function (sModel) {
                if (sModel == "dataModel") {
                    return oOvpModel;
                } else if (sModel == "ovpCardProperties") {
                    return oOvpModel;
                }
            }
        };
        var expectedResult = "{path: '/Books', sorter: [{path: 'DeliveryCalendarYear',descending: false}], parameters: {$apply:'groupby((DeliveryCalendarYear),aggregate(sale with sum as saleAggregate,price with min as priceAggregate,stock with max as stockAggregate))'}}";
        var actualResult = VizAnnotationManager.formatItems(
            iContext,
            oEntitySet,
            undefined,
            oPresentationVariant,
            oDimensions,
            oMeasures,
            chartType
        );
        assert.ok(expectedResult == actualResult, "formatItems method returns the correct sorter based on presentation variant");
    });
    QUnit.test("VizAnnotationManager - function formatItems, when there is a Presentation Variant with sorter-descending applied", function (assert) {
        var oMeasures = [
            {
                "$Type": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
                "Measure": {
                    "$PropertyPath": "sale"
                },
                "Role": {
                    "$EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
                }
            },
            {
                "$Type": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
                "Measure": {
                    "$PropertyPath": "price"
                },
                "Role": {
                    "$EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis2"
                }
            },
            {
                "$Type": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
                "DynamicMeasure": {
                    "$AnnotationPath": "@com.sap.vocabularies.Analytics.v1.AggregatedProperty#MAX"
                },
                "Role": {
                    "$EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis3"
                }
            }
        ];
        var oEntitySet = {
            "$kind": "EntitySet",
            "$Type": "CatalogService.Books",
            "$NavigationPropertyBinding": {
                "author": "Authors",
                "purchases": "Purchases"
            }
        };
        var oDimensions = [
            {
                "$Type": "com.sap.vocabularies.UI.v1.ChartDimensionAttributeType",
                "Dimension": {
                    "$PropertyPath": "DeliveryCalendarYear"
                },
                "Role": {
                    "$EnumMember": "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category"
                }
            }
        ];
        var chartType = {
            "$EnumMember": "com.sap.vocabularies.UI.v1.ChartType/Line"
        };
        var oPresentationVariant = {
            "$Type": "com.sap.vocabularies.UI.v1.PresentationVariantType",
            "SortOrder": [
                {
                    "$Type": "com.sap.vocabularies.Common.v1.SortOrderType",
                    "Property": {
                        "$PropertyPath": "DeliveryCalendarYear"
                    },
                    "Descending": true
                }
            ]      
        };
        var oOvpModel = {
            getProperty: function (sPath) {
                if (sPath == "/metaModel") {
                    return {
                        getObject: function (sPath) {
                            if (sPath === "/") {
                                return {
                                    "$kind": "EntityContainer",
                                    "Books": {
                                        "$kind": "EntitySet",
                                        "$Type": "CatalogService.Books"
                                    }
                                }
                            } else if (sPath === "/CatalogService.Books/@") {
                                return {
                                    '@com.sap.vocabularies.Analytics.v1.AggregatedProperty#MAX': {
                                        "@com.sap.vocabularies.Common.v1.Label": "Maximum Stock Price",
                                        "$Type": "com.sap.vocabularies.Analytics.v1.AggregatedPropertyType",
                                        "Name": "maxStock",
                                        "AggregationMethod": "max",
                                        "AggregatableProperty": {
                                            "$PropertyPath": "stock"
                                        }
                                    }
                                }
                            } else if (sPath === "/CatalogService.Books/@com.sap.vocabularies.Analytics.v1.AggregatedProperty#MAX") {
                                return {
                                    "@com.sap.vocabularies.Common.v1.Label": "Maximum Stock Price",
                                    "$Type": "com.sap.vocabularies.Analytics.v1.AggregatedPropertyType",
                                    "Name": "maxStock",
                                    "AggregationMethod": "max",
                                    "AggregatableProperty": {
                                        "$PropertyPath": "stock"
                                    }
                                }
                            } else if (sPath === "/CatalogService.Books@com.sap.vocabularies.UI.v1.Chart#year") {
                                return {
                                    "$Type": "com.sap.vocabularies.UI.v1.ChartDefinitionType",
                                    "Title": "Item Category Chart",
                                    "Description": "Testing Item Category Chart",
                                    "ChartType": {
                                        "$EnumMember": "com.sap.vocabularies.UI.v1.ChartType/Line"
                                    },
                                    "Measures": [
                                        {
                                            "$PropertyPath": "sale"
                                        },
                                        {
                                            "$PropertyPath": "price"
                                        }
                                    ],
                                    "DynamicMeasures": [
                                        {
                                            "$AnnotationPath": "@com.sap.vocabularies.Analytics.v1.AggregatedProperty#MAX"
                                        }
                                    ],
                                    "Dimensions": [
                                        {
                                            "$PropertyPath": "DeliveryCalendarYear"
                                        }
                                    ],
                                    "MeasureAttributes": [
                                        {
                                            "$Type": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
                                            "Measure": {
                                                "$PropertyPath": "sale"
                                            },
                                            "Role": {
                                                "$EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
                                            }
                                        },
                                        {
                                            "$Type": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
                                            "Measure": {
                                                "$PropertyPath": "price"
                                            },
                                            "Role": {
                                                "$EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis2"
                                            }
                                        },
                                        {
                                            "$Type": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
                                            "DynamicMeasure": {
                                                "$AnnotationPath": "@com.sap.vocabularies.Analytics.v1.AggregatedProperty#MAX"
                                            },
                                            "Role": {
                                                "$EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis3"
                                            }
                                        }
                                    ],
                                    "DimensionAttributes": [
                                        {
                                            "$Type": "com.sap.vocabularies.UI.v1.ChartDimensionAttributeType",
                                            "Dimension": {
                                                "$PropertyPath": "DeliveryCalendarYear"
                                            },
                                            "Role": {
                                                "$EnumMember": "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category"
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    };
                } else if (sPath == "/entitySet") {
                    return "Books";
                } else if (sPath == "/measureAggregate") {
                    return {
                        "Axis2": "min"
                    }
                } else if (sPath == "/chartAnnotationPath") {
                    return 'com.sap.vocabularies.UI.v1.Chart#year';
                }
            },
            getId: function () {
                return undefined;
            },
            getMetaModel: function () {
                return {
                    getData: function () {
                        return {}
                    },
                    getObject: function () {
                        return {}
                    }
                }
            },
            getODataVersion: function() {
                return "4.0";
            }
        };
        var iContext = {
            getSetting: function (sModel) {
                if (sModel == "dataModel") {
                    return oOvpModel;
                } else if (sModel == "ovpCardProperties") {
                    return oOvpModel;
                }
            }
        };
        var expectedResult = "{path: '/Books', sorter: [{path: 'DeliveryCalendarYear',descending: true}], parameters: {$apply:'groupby((DeliveryCalendarYear),aggregate(sale with sum as saleAggregate,price with min as priceAggregate,stock with max as stockAggregate))'}}";
        var actualResult = VizAnnotationManager.formatItems(
            iContext,
            oEntitySet,
            undefined,
            oPresentationVariant,
            oDimensions,
            oMeasures,
            chartType
        );
        assert.ok(expectedResult == actualResult, "formatItems method returns the correct sorter based on presentation variant");
    });
});