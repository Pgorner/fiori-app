sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "sap/ovp/cards/NavigationHelper",
    "sap/ui/model/json/JSONModel",
    "sap/ovp/cards/CommonUtils",
    "sap/ovp/cards/AnnotationHelper",
    "sap/fe/navigation/SelectionVariant",
    "sap/base/Log"
], function(
    CardUtils,
    NavigationHelper,
    JSONModel,
    CommonUtils,
    AnnotationHelper,
    SelectionVariant,
    Log
) {

    "use strict";
    
    QUnit.module("NavigationHelper- Test navigationEntries for OData V2 model", {
        beforeEach: function() {},
        afterEach: function() {},
    });

    QUnit.test("getEntityNavigationEntries - without context and annotation path", function(assert){
        var cardTestData = {
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotationsKPI.xml"
            }
        };
        var oModel = CardUtils.createCardModel(cardTestData);
        var oEntityType = {
            property: [{ name: "key1" }, { name: "key2" }, { name: "key3" }]
        };
        var oCardPropertiesModel = new JSONModel({
            template: "sap.ovp.cards.list"
        });
        var aNavigationFields = NavigationHelper.getEntityNavigationEntries(null, oModel, oEntityType, oCardPropertiesModel);
        assert.ok(aNavigationFields.length === 0, "Navigation fields should be empty if there is no identification annotation");
    });

    QUnit.test("getEntityNavigationEntries - with identification annotation path", function(assert){
        var cardTestData = {
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotationsKPI.xml"
            }
        };
        var aExpectedResponse =  [{
            "type": "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
            "semanticObject": "Action",
            "action": "toappnavsample",
            "label": "To Details Page"
        }];
        var oModel = CardUtils.createCardModel(cardTestData);
        var oEntityType = {
            property: [{ name: "key1" }, { name: "key2" }, { name: "key3" }],
            "com.sap.vocabularies.UI.v1.Identification#New": [{
                SemanticObject: { String: "Action" },
                Action: { String: "toappnavsample" },
                Label: { String: "To Details Page" },
                RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
            }]
        };
        var oCardPropertiesModel = new JSONModel({
            template: "sap.ovp.cards.list",
            identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#New"
        });
        var aNavigationFields = NavigationHelper.getEntityNavigationEntries(null, oModel, oEntityType, oCardPropertiesModel);

        assert.deepEqual(aNavigationFields, aExpectedResponse, "Navigation fields has an object with identification annotation details");
    });

    QUnit.test("getEntityNavigationEntries - with identification annotation path and importance", function(assert){
        var cardTestData = {
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotationsKPI.xml"
            }
        };
        var aExpectedResponse =  [{
            "type": "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
            "semanticObject": "Action1",
            "action": "toappnavsample1",
            "label": "To Details Page 1"
        }];
        var oModel = CardUtils.createCardModel(cardTestData);
        var oEntityType = {
            property: [{ name: "key1" }, { name: "key2" }, { name: "key3" }],
            "com.sap.vocabularies.UI.v1.Identification": [{
                SemanticObject: { String: "Action" },
                Action: { String: "toappnavsample" },
                Label: { String: "To Details Page" },
                RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
                "com.sap.vocabularies.UI.v1.Importance": {
                    EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/Medium"
                }
            }],
            "com.sap.vocabularies.UI.v1.Identification": [{
                SemanticObject: { String: "Action1" },
                Action: { String: "toappnavsample1" },
                Label: { String: "To Details Page 1" },
                RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
                "com.sap.vocabularies.UI.v1.Importance": {
                    EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
                }
            }]
        };
        var oCardPropertiesModel = new JSONModel({
            template: "sap.ovp.cards.list",
            identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification"
        });
        var aNavigationFields = NavigationHelper.getEntityNavigationEntries(null, oModel, oEntityType, oCardPropertiesModel);

        assert.deepEqual(aNavigationFields, aExpectedResponse, "Navigation fields has an object with identification annotation details based on priority");
    });

    QUnit.test("checkHeaderNavigationDisabledForAnalyticalCard - verify if header should have navigation for analytical card", function(assert){
        var oCardPropertiesModel = new JSONModel({
            template: "sap.ovp.cards.charts.analytical",
            navigation: "noHeaderNav"
        });
        var bNavigationEnabled = NavigationHelper.checkHeaderNavigationDisabledForAnalyticalCard(oCardPropertiesModel);
        assert.ok(bNavigationEnabled === true, "Header navigation is disabled");
    });

    QUnit.test("checkNavigation - verify if navigation is enabled for a card", function(assert){
        var cardTestData = {
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotationsKPI.xml"
            }
        };
        var oModel = CardUtils.createCardModel(cardTestData);
        var oCardPropertiesModel = new JSONModel({
            identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification"
        });
        var oEntityType = {
            property: [{ name: "key1" }, { name: "key2" }, { name: "key3" }],
            "com.sap.vocabularies.UI.v1.Identification": [{
                SemanticObject: { String: "Action" },
                Action: { String: "toappnavsample" },
                Label: { String: "To Details Page" },
                RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
                "com.sap.vocabularies.UI.v1.Importance": {
                    EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/Medium"
                }
            }]
        };
        var bNavigationEnabled = NavigationHelper.checkNavigation(oModel, oEntityType, oCardPropertiesModel);
        assert.ok(bNavigationEnabled === true, "Card navigation is enabled");
    });

    QUnit.test("checkNavigation - verify if navigation is enabled for an analytical card with KPI annotation, without identification annotation", function(assert){
        var cardTestData = {
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotationsKPI.xml"
            }
        };
        var oModel = CardUtils.createCardModel(cardTestData);
        var oCardPropertiesModel = new JSONModel({
            template: "sap.ovp.cards.charts.analytical",
            kpiAnnotationPath: "com.sap.vocabularies.UI.v1.KPI#AllActualCosts"
        });
        var oEntityType = {
            property: [{ name: "key1" }, { name: "key2" }, { name: "key3" }],
            "com.sap.vocabularies.UI.v1.KPI#AllActualCosts": {
                "Detail": {
                    "SemanticObject": { "String": "Action" },
                    "Action": { "String": "toappnavsample" },
                    "RecordType": "com.sap.vocabularies.UI.v1.KPIDetailType"
                },
                "RecordType": "com.sap.vocabularies.UI.v1.KPIType"
            }
        };
        var bNavigationEnabled = NavigationHelper.checkNavigation(oModel, oEntityType, oCardPropertiesModel);
        assert.ok(bNavigationEnabled === true, "Card navigation is enabled");
    });

    QUnit.test("getEntityNavigationParameters - get navigation parameters for static link list card with semantic object and action", function(assert){
        var cardTestData = {
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotationsKPI.xml"
            }
        };
        var oModel = CardUtils.createCardModel(cardTestData);
        var oMainComponent = {
            templateBaseExtension: {
                provideCustomParameter: function () { }
            },
            onCustomParams: function (sCustomParams) {
                if (sCustomParams === "getParameters") {
                    return function () {
                        var aCustomSelectionVariant = [];
                        var oSupplierName = {
                            path: "SupplierName",
                            operator: "EQ",
                            value1: "Sunny",
                            value2: null,
                            sign: "I"
                        };
                        var oCustomSelectionVariant = {
                            path: "TaxTarifCode",
                            operator: "BT",
                            value1: 5,
                            value2: 7,
                            sign: "I"
                        };
                        var oCustomCountry_1 = {
                            path: "Country",
                            operator: "EQ",
                            value1: "USA",
                            value2: null,
                            sign: "I"
                        };
                        var oCustomCountry_2 = {
                            path: "Country",
                            operator: "EQ",
                            value1: "UK",
                            value2: null,
                            sign: "I"
                        };
                        var oCustomCountry_remove = {
                            path: "Country",
                            operator: "EQ",
                            value1: "",
                            value2: null,
                            sign: "I"
                        };
                        var oCustomCountry_3 = {
                            path: "Country",
                            operator: "EQ",
                            value1: "IND",
                            value2: null,
                            sign: "I"
                        };
                        aCustomSelectionVariant.push(oCustomSelectionVariant);
                        aCustomSelectionVariant.push(oSupplierName);
                        aCustomSelectionVariant.push(oCustomCountry_1);
                        aCustomSelectionVariant.push(oCustomCountry_2);
                        aCustomSelectionVariant.push(oCustomCountry_remove);
                        aCustomSelectionVariant.push(oCustomCountry_3);

                        return {
                            aSelectionVariant: aCustomSelectionVariant,
                            bIgnoreEmptyString: true
                        };
                    };
                }
            }
        };
        var oComponentData = {
            globalFilter: {
                getUiState: function () {
                    var oSelectionVariant = JSON.parse(
                        '{"SelectionVariantID":"","SelectOptions":[{"PropertyName":"CurrencyCode","Ranges":[{"Sign":"I","Option":"EQ","Low":"EUR","High":""}]}]}'
                    );
                    return {
                        selectionVariant: oSelectionVariant,
                        getSelectionVariant: function () {
                            return oSelectionVariant;
                        }
                    };
                }
            }
        };
        var oCustomParameters = {
            bStaticLinkListIndex: true,
            iStaticLinkListIndex: 1,
        };
        var oCardPropertiesModel = new JSONModel({
            template: "sap.ovp.cards.linklist",
            staticContent: [{
                title: "Jim Smith",
                subTitle: "Buyer",
                imageUri: "img/JD.png",
                imageAltText: "Jim Smith",
                targetUri: "https://google.com",
                openInNewWindow: true
            },
            {
                title: "Jaden Lee",
                subTitle: "Sales Manager",
                imageUri: "img/YM.png",
                imageAltText: "Jim Smith",
                semanticObject: "Action",
                action: "toappnavsample",
                customParams: "getParameters",
                params: {
                    param1: "value1",
                    param2: "value2",
                }
            }]
        });
        var oEntityType = {
            property: [{ name: "key1" }, { name: "key2" }, { name: "key3" }],
            "com.sap.vocabularies.UI.v1.KPI#AllActualCosts": {
                "Detail": {
                    "SemanticObject": { "String": "Action" },
                    "Action": { "String": "toappnavsample" },
                    "RecordType": "com.sap.vocabularies.UI.v1.KPIDetailType"
                },
                "RecordType": "com.sap.vocabularies.UI.v1.KPIType"
            }
        };

        var getNavigationHandlerStub = sinon.stub(CommonUtils, "getNavigationHandler").returns({
            mixAttributesAndSelectionVariant: function (oContextParameters, oSelectionVariant, iSuppressionBehavior) {
                return {
                    toJSONString: function () {
                        return {
                            oContextParameters: oContextParameters,
                            oSelectionVariant: oSelectionVariant,
                            iSuppressionBehavior: iSuppressionBehavior,
                        };
                    }
                };
            }
        });
        var oNavigationParams = NavigationHelper.getEntityNavigationParameters(
            oMainComponent, 
            oModel, 
            oComponentData, 
            oCardPropertiesModel, 
            oEntityType, 
            null /* oEntity */, 
            oCustomParameters, 
            null /* oContext- donut card others data point */
        );
        var oUpdatedCustomVariant = JSON.parse(oNavigationParams.sNavSelectionVariant.oSelectionVariant);
        var sActualResult = oUpdatedCustomVariant.SelectOptions[3].Ranges[0].Low;

        assert.ok(
            sActualResult === "IND",
            "When bIgnoreEmptyString is true and sValue1 is empty, the empty value is removed."
        );

        var oCurrencyCode, oTaxTarifCode, oSupplierName;
        if (oNavigationParams) {
            var aSelectOptions = JSON.parse(oNavigationParams.sNavSelectionVariant.oSelectionVariant).SelectOptions;
            for (var i = 0; i < aSelectOptions.length; i++) {
                if (aSelectOptions[i].PropertyName == "CurrencyCode") {
                    oCurrencyCode = aSelectOptions[i];
                } else if (aSelectOptions[i].PropertyName == "TaxTarifCode") {
                    oTaxTarifCode = aSelectOptions[i];
                } else if (aSelectOptions[i].PropertyName == "SupplierName") {
                    oSupplierName = aSelectOptions[i];
                }
            }
        }
        assert.ok(oNavigationParams.sNavSelectionVariant.iSuppressionBehavior === 1, "bIgnoreEmptyString is true in customParam so function processCustomParameters returns 1");
        assert.ok(
            oNavigationParams.sNavSelectionVariant.oContextParameters.hasOwnProperty("param1") &&
            oNavigationParams.sNavSelectionVariant.oContextParameters.param1 === "value1" &&
            oNavigationParams.sNavSelectionVariant.oContextParameters.hasOwnProperty("param2") &&
            oNavigationParams.sNavSelectionVariant.oContextParameters.param1 === "value1",
            "staticParam for static link list card are validated"
        );
        assert.ok(oCurrencyCode && oCurrencyCode.Ranges[0].Low == "EUR", "CurrencyCode from global filter");
        assert.ok(oTaxTarifCode && oTaxTarifCode.Ranges[0].High == "7" && oTaxTarifCode.Ranges[0].Low == "5", "TaxTarifCode from customParam function");
        assert.ok(oSupplierName && oSupplierName.Ranges[0].Low == "Sunny", "oSupplierName from customParam function");
        getNavigationHandlerStub.restore();
    });

    QUnit.test("getEntityNavigationParameters - get navigation parameters without filters, cards and entity", function(assert){
        var cardTestData = {
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotationsKPI.xml"
            }
        };
        var oModel = CardUtils.createCardModel(cardTestData);
        var oCardPropertiesModel = new JSONModel({
            template: "sap.ovp.cards.list",
            entityType: "SalesOrder"
        });
        var oEntityType = {
            property: [{ name: "key1" }, { name: "key2" }, { name: "key3" }]
        };
        var getCardSelectionsStub = sinon.stub(AnnotationHelper, "getCardSelections").returns({});
        var _buildSelectionVariantStub = sinon.stub(NavigationHelper, "_buildSelectionVariant").returns(new SelectionVariant());
        var getNavigationHandlerStub = sinon.stub(CommonUtils, "getNavigationHandler").returns({
            mixAttributesAndSelectionVariant: function (oContextParameters, oSelectionVariant, iSuppressionBehavior) {
                return {
                    toJSONString: function () {
                        return {
                            oContextParameters: oContextParameters,
                            oSelectionVariant: oSelectionVariant,
                            iSuppressionBehavior: iSuppressionBehavior,
                        };
                    }
                };
            }
        });
        var oNavigationParams = NavigationHelper.getEntityNavigationParameters(
            {} /* oMainComponent */, 
            oModel, 
            {}, 
            oCardPropertiesModel, 
            oEntityType, 
            null /* oEntity */, 
            null /* oCustomParameters */,
            null /* oContext- donut card others data point */
        );
        assert.ok(typeof oNavigationParams === "object", "Navigation parameters are returned as object");
        assert.ok(oNavigationParams.sNavPresentationVariant === null, "Presentation variant are not defined");
        assert.ok(Object.keys(oNavigationParams.sNavSelectionVariant.oContextParameters).length === 0, "Context Paramters in selection variant are empty");

        var oSelectionVariant = JSON.parse(oNavigationParams.sNavSelectionVariant.oSelectionVariant);
        assert.ok(oSelectionVariant.Parameters.length === 0, "There are no parameters in selection variant");
        assert.ok(oSelectionVariant.SelectOptions.length === 0, "There are no select options as part of selection variant");
        getCardSelectionsStub.restore();
        _buildSelectionVariantStub.restore();
        getNavigationHandlerStub.restore();
    });

    QUnit.test("getEntityNavigationParameters - get navigation parameters with card filters and without entity or global filters", function(assert){
        var cardTestData = {
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotationsKPI.xml"
            }
        };
        var oModel = CardUtils.createCardModel(cardTestData);
        var oCardPropertiesModel = new JSONModel({
            template: "sap.ovp.cards.list",
            entityType: "SalesOrder"
        });
        var oEntityType = {
            property: [{ name: "key1" }, { name: "key2" }, { name: "key3" }]
        };
        var getCardSelectionsStub = sinon.stub(AnnotationHelper, "getCardSelections").returns({
            filters: [
                {
                    path: "GrossAmount",
                    operator: "BT",
                    value1: 0,
                    value2: 800000,
                    sign: "I",
                },
                {
                    path: "SupplierName",
                    operator: "EQ",
                    value1: 0,
                    sign: "I",
                },
            ],
            parameters: []
        });
        var oNavigationParams = NavigationHelper.getEntityNavigationParameters(
            {} /* oMainComponent */, 
            oModel, 
            {}, 
            oCardPropertiesModel, 
            oEntityType, 
            null /* oEntity */, 
            null /* oCustomParameters */,
            null /* oContext- donut card others data point */
        );
        assert.ok(typeof oNavigationParams === "object", "Navigation parameters are returned as object");
        assert.ok(oNavigationParams.sNavPresentationVariant === null, "Presentation variant are not defined");
        assert.ok(oNavigationParams.sNavSelectionVariant === null, "Selection variant are not defined");

        getCardSelectionsStub.restore();
    });

    QUnit.test("getEntityNavigationParameters - verify if selection variant is added with select options having null value if selected field has null value", function(assert) {
        var cardTestData = {
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotationsKPI.xml"
            }
        };
        var oModel = CardUtils.createCardModel(cardTestData);
        var oMainComponent = {
            templateBaseExtension: {
                provideCustomParameter: function () { }
            },
            onCustomParams: function (sCustomParams) {
                if (sCustomParams === "getParameters") {
                    return function () {
                        var aCustomSelectionVariant = [];
                        var oSupplierName = {
                            path: "SupplierName",
                            operator: "EQ",
                            value1: "Sunny",
                            value2: null,
                            sign: "I"
                        };
                        var oCustomSelectionVariant = {
                            path: "TaxTarifCode",
                            operator: "BT",
                            value1: 5,
                            value2: 7,
                            sign: "I"
                        };
                        var oCustomCountry_1 = {
                            path: "Country",
                            operator: "EQ",
                            value1: "USA",
                            value2: null,
                            sign: "I"
                        };
                        var oCustomCountry_2 = {
                            path: "Country",
                            operator: "EQ",
                            value1: "UK",
                            value2: null,
                            sign: "I"
                        };
                        var oCustomCountry_remove = {
                            path: "Country",
                            operator: "EQ",
                            value1: "",
                            value2: null,
                            sign: "I"
                        };
                        var oCustomCountry_3 = {
                            path: "Country",
                            operator: "EQ",
                            value1: "IND",
                            value2: null,
                            sign: "I"
                        };
                        aCustomSelectionVariant.push(oCustomSelectionVariant);
                        aCustomSelectionVariant.push(oSupplierName);
                        aCustomSelectionVariant.push(oCustomCountry_1);
                        aCustomSelectionVariant.push(oCustomCountry_2);
                        aCustomSelectionVariant.push(oCustomCountry_remove);
                        aCustomSelectionVariant.push(oCustomCountry_3);

                        return {
                            aSelectionVariant: aCustomSelectionVariant,
                            bIgnoreEmptyString: true
                        };
                    };
                }
            }
        };
        var oComponentData = {
            globalFilter: {
                getUiState: function () {
                    var oSelectionVariant = JSON.parse(
                        '{"SelectionVariantID":"","SelectOptions":[{"PropertyName":"CurrencyCode","Ranges":[{"Sign":"I","Option":"EQ","Low":"EUR","High":""}]}]}'
                    );
                    return {
                        selectionVariant: oSelectionVariant,
                        getSelectionVariant: function () {
                            return oSelectionVariant;
                        }
                    };
                }
            }
        };
        var oCustomParameters = {
            "Product": null,
            "TotalSales": "685",
            "TotalSales_CURRENCY": "EUR"
        };
        var oCardPropertiesModel = new JSONModel({
            selectionAnnotationPath:  "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency_1",
            entityType: {
                "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency_1" : {
                    "SelectOptions": [
                        {
                            "PropertyName": {
                                "PropertyPath": "Country"
                            },
                            "Ranges": [
                                {
                                    "Sign": {
                                        "EnumMember": "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I"
                                    },
                                    "Option": {
                                        "EnumMember": "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/EQ"
                                    },
                                    "Low": {
                                        "String": "IN"
                                    }
                                }
                            ],
                            "id": "headerFilterText--1"
                        }
                    ],
                    "Parameters": [
                        {
                            "PropertyName": {
                                "PropertyPath": "Currency_Target"
                            },
                            "PropertyValue": {
                                "String": "EUR"
                            },
                            "RecordType": "com.sap.vocabularies.UI.v1.Parameter"
                        },
                        {
                            "PropertyName": {
                                "PropertyPath": "UoM_Target"
                            },
                            "PropertyValue": {
                                "String": "KGM"
                            },
                            "RecordType": "com.sap.vocabularies.UI.v1.Parameter"
                        }
                    ]
                }
            }       
        });
        var oEntityType = {
            property: [{ name: "Product", nullable: "true", maxLength: "1024" }, { name: "ProductId", nullable: "true", maxLength: "1024" }],
            "com.sap.vocabularies.UI.v1.KPI#AllActualCosts": {
                "Detail": {
                    "SemanticObject": { "String": "Action" },
                    "Action": { "String": "toappnavsample" },
                    "RecordType": "com.sap.vocabularies.UI.v1.KPIDetailType"
                },
                "RecordType": "com.sap.vocabularies.UI.v1.KPIType"
            }
        };
        var oEntity = {
            "Product": null,
            "ProductId": null
        };
        var oContext = {
            getAllData: function() {
                return {};
            },
            getObject: function() {
                return {};
            }
        };
        var getNavigationHandlerStub = sinon.stub(CommonUtils, "getNavigationHandler").returns({
            mixAttributesAndSelectionVariant: function (oContextParameters, oSelectionVariant, iSuppressionBehavior) {
                return {
                    toJSONString: function () {
                        return {
                            oContextParameters: oContextParameters,
                            oSelectionVariant: oSelectionVariant,
                            iSuppressionBehavior: iSuppressionBehavior,
                        };
                    }
                };
            }
        });
        var oNavigationParams = NavigationHelper.getEntityNavigationParameters(
            oMainComponent, 
            oModel, 
            oComponentData, 
            oCardPropertiesModel, 
            oEntityType, 
            oEntity, 
            oCustomParameters, 
            oContext
        );
        var oUpdatedCustomVariant = JSON.parse(oNavigationParams.sNavSelectionVariant.oSelectionVariant);
        var oSelectOptions = oUpdatedCustomVariant.SelectOptions.filter(function (obj) {
            return obj.PropertyName === Object.keys(oEntity)[0];
        })[0];
        var sLow = oSelectOptions.Ranges[0].Low;
        var oHigh = oSelectOptions.Ranges[0].High;
        assert.ok(sLow === "", "Low will have empty string value");
        assert.ok(oHigh === null, "High will have null value");
        oSelectOptions = oUpdatedCustomVariant.SelectOptions.filter(function (obj) {
            return obj.PropertyName === Object.keys(oEntity)[1];
        })[0];
        sLow = oSelectOptions.Ranges[0].Low;
        oHigh = oSelectOptions.Ranges[0].High;
        assert.ok(sLow === "", "Low will have empty string value");
        assert.ok(oHigh === null, "High will have null value");
        getNavigationHandlerStub.restore();
    });

    QUnit.test("getContextParametersForV2 - get context parameters for v2 cards", function (assert) {
        var oEntityType = {
            property: [{ name: "key1" }, { name: "key2" }, { name: "key3" }, {
                "name": "PurReqnItemClassification",
                "type": "Edm.String",
                "maxLength": "2"
            }]
        };
        var oEntity = { PurReqnItemClassification: "04" };
        var oContextParams = NavigationHelper.getContextParametersForV2(oEntity, oEntityType);
        assert.ok(typeof oContextParams === "object", "Context parameters for v2 are returned as object");
        assert.ok(JSON.stringify(oContextParams) === JSON.stringify(oEntity), "Context parameters has entity propertie");
    });
    QUnit.test("getContextParametersForV4 - get context parameters for v4 cards", function (assert) {
        var oEntityType = {
            property: {
                $kind: "EntityType",
                moduleName: {
                    "$kind": "Property",
                    "$Type": "Edm.String",
                },
                moduleCode: {
                    "$kind": "Property",
                    "$Type": "Edm.String",
                    "$MaxLength": 20,
                }
            }
        };
        var oEntity = { moduleCode: "CO", scope: "In Scope" };
        var oContextParams = NavigationHelper.getContextParametersForV4(oEntity, oEntityType);
        assert.ok(typeof oContextParams === "object", "Context parameters for v4 are returned as object");
        assert.ok(oContextParams.hasOwnProperty("moduleCode") == true, "Context parameters has entity propertie");
        assert.ok(oContextParams.hasOwnProperty("scope") == false, "Context parameters don't have entity propertie");
    });

    QUnit.test("_buildSelectionVariant - build selection variant with entity global filter and card filter", function(assert){
       var oGlobalFilter = {
            getUiState: function () {
                var oSelectionVariant = JSON.parse(
                    '{"SelectionVariantID":"","SelectOptions":[{"PropertyName":"SupplierName","Ranges":[{"Sign":"I","Option":"CP","Low":"*BBB*","High":""},{"Sign":"I","Option":"CP","Low":"*AAA*","High":""}]},{"PropertyName":"CurrencyCode","Ranges":[{"Sign":"I","Option":"EQ","Low":"EUR","High":""}]}]}'
                );
                return {
                    selectionVariant: oSelectionVariant,
                    getSelectionVariant: function () {
                        return oSelectionVariant;
                    },
                };
            },
        };
        var oCardSelections = {
            filters: [
                { path: "GrossAmount", operator: "BT", value1: 0, value2: 800000, sign: "I" },
                { path: "SupplierName", operator: "CP", value1: 0, sign: "I" },
                { path: "key1", operator: "EQ", value1: "value1", sign: "I" },
                { path: "key4", operator: "EQ", value1: "value4", sign: "I" },
                { path: "key5", operator: "BT", value1: 0, value2: 1000, sign: "I" }
            ],
            parameters: [],
        };

        var oSupplierName = [
            { High: null, Low: "*BBB*", Option: "CP", Sign: "I" },
            { High: null, Low: "*AAA*", Option: "CP", Sign: "I" },
            { High: null, Low: "0", Option: "CP", Sign: "I" }
        ];

        var oSelectionVariant = NavigationHelper._buildSelectionVariant(oGlobalFilter, oCardSelections);
        assert.ok(oSelectionVariant.getSelectOptionsPropertyNames().length === 6, "Total 6 properties are part of selection variant");
        assert.deepEqual(
            oSelectionVariant.getSelectOption("GrossAmount")[0],
            {
                Sign: "I",
                Option: "BT",
                Low: "0",
                High: "800000",
            },
            "Between was built as expexted"
        );
        assert.deepEqual(
            oSelectionVariant.getSelectOption("SupplierName")[0],
            oSupplierName[0],
            "Selection variant object was build as expected"
        );
        assert.deepEqual(
            oSelectionVariant.getSelectOption("SupplierName")[1],
            oSupplierName[1],
            "Selection variant object was build as expected"
        );
        assert.deepEqual(
            oSelectionVariant.getSelectOption("SupplierName")[2],
            oSupplierName[2],
            "Selection variant object was build as expected"
        );
        assert.deepEqual(
            oSelectionVariant.getSelectOption("key1")[0],
            {
                High: null,
                Low: "value1",
                Option: "EQ",
                Sign: "I",
            },
            "Selection variant object was build as expected"
        );
    });

    QUnit.test("_checkIfCardFiltersAreValid - Validation of card filters", function (assert) {
        var mFilterPreference;
        var sPropertyName = "CurrencyCode";
        
        assert.ok(NavigationHelper._checkIfCardFiltersAreValid(mFilterPreference, sPropertyName) === true, "If there is no filter preference");

        mFilterPreference = {
            filterAll: "global",
        };
        assert.ok(NavigationHelper._checkIfCardFiltersAreValid(mFilterPreference, sPropertyName) === false, "Filter preference ---> Filter all global");

        mFilterPreference = {
            globalFilter: ["lol", "ro"],
        };
        assert.ok(NavigationHelper._checkIfCardFiltersAreValid(mFilterPreference, sPropertyName) === true, "Filter preference ---> Global filter array ---> sPropertyName is no present");

        mFilterPreference = {
            globalFilter: ["lol", "ro", "CurrencyCode"],
        };
        assert.ok(NavigationHelper._checkIfCardFiltersAreValid(mFilterPreference, sPropertyName) === false, "Filter preference ---> Global filter array ---> sPropertyName is present");
    });

    QUnit.test("removeFilterFromGlobalFilters - verify invalid filters are removed from global filters w.r.t filter preference", function (assert) {
        var mFilterPreference;
        var oSelectionVariant = new SelectionVariant();  

        oSelectionVariant = NavigationHelper.removeFilterFromGlobalFilters(mFilterPreference, oSelectionVariant);
        assert.ok(oSelectionVariant.getPropertyNames().length === 0, "There should be no properties in selection variant with No filter preference and filters");

        var oResult = ["$.basicSearch"];
        oSelectionVariant.addSelectOption("$.basicSearch", "I", "EQ", "lol", null);
        oSelectionVariant = NavigationHelper.removeFilterFromGlobalFilters(mFilterPreference, oSelectionVariant);
        assert.ok(oSelectionVariant.getPropertyNames().length === 1, "There should be one property with one select option and no filter preference");
        assert.ok(JSON.stringify(oSelectionVariant.getPropertyNames()) === JSON.stringify(oResult), "Property Value matches the added option");

        oResult = ["$.basicSearch", "SalesOrderId"];
        oSelectionVariant.addSelectOption("SalesOrderId", "I", "BT", "5000001", "5000009");
        oSelectionVariant.addSelectOption("CurrencyCode", "I", "EQ", "INR", null);
        mFilterPreference = {
            cardFilter: ["CurrencyCode"],
        };
        oSelectionVariant = NavigationHelper.removeFilterFromGlobalFilters(mFilterPreference, oSelectionVariant);
        assert.ok(oSelectionVariant.getPropertyNames().length === 2, "There should be 2 select options considering filter preferences");
        assert.ok(JSON.stringify(oSelectionVariant.getPropertyNames()) === JSON.stringify(oResult), "Selection variant has 2 properties considering filter preference");

        oResult = ["$.basicSearch"];
        oSelectionVariant.addSelectOption("ProductId", "I", "EQ", "PC001", null);
        mFilterPreference = {
            filterAll: "card",
        };
        oSelectionVariant = NavigationHelper.removeFilterFromGlobalFilters(mFilterPreference, oSelectionVariant);
        assert.ok(oSelectionVariant.getPropertyNames().length === 1, "There is one property in selection variant considerting filter preference and card filters");
        assert.ok(JSON.stringify(oSelectionVariant.getPropertyNames()) === JSON.stringify(oResult), "Selection variant has the global filter property");
    });

    QUnit.test("processCustomParameters - return undefined if custom navigation extension throws an error", function(assert){
        var oMainComponent = {
            templateBaseExtension: {
                provideCustomParameter: function () { }
            },
            onCustomParams: function (sCustomParams) {
                if(sCustomParams === "fnInduceError") {
                    return function() {
                        throw new Error();
                    }
                }
            }
        };

        var fnLogErrorSpy = sinon.spy(Log, "error");
        var oCustomParameters = {
            bStaticLinkListIndex: true,
            iStaticLinkListIndex: 0,
        };
        var oCardPropertiesModel = new JSONModel({
            template: "sap.ovp.cards.linklist",
            staticContent: [{
                title: "Alice Wilson",
                subTitle: "Strategic Buyer",
                imageUri: "img/YM.png",
                imageAltText: "Jim Smith",
                semanticObject: "Action",
                action: "toappnavsample",
                customParams: "fnInduceError",
                params: {
                    param1: "value1",
                    param2: "value2",
                }
            }]
        });
       
        var bIgnoreEmptyString = NavigationHelper.processCustomParameters(
            oMainComponent, 
            oCardPropertiesModel, 
            oCustomParameters, 
            new SelectionVariant('{"SelectionVariantID":"","SelectOptions":[{"PropertyName":"CurrencyCode","Ranges":[{"Sign":"I","Option":"EQ","Low":"EUR","High":""}]}]}')
        );
        assert.ok(bIgnoreEmptyString === undefined, "processCustomParameters function returns undefined.");
        assert.equal(fnLogErrorSpy.calledOnce, true, "should throw an error.");
        fnLogErrorSpy.restore();
    });

    QUnit.test("getEntityNavigationParameters - get navigation parameters with card filters having a mixture of exclude and include params and without entity or global filters", function(assert){
        var cardTestData = {
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotationsKPI.xml"
            }
        };

        // var oNavigationHandlerMock = sinon.stub(CommonUtils, "getNavigationHandler").returns(new NavigationHandler({}));
        var oModel = CardUtils.createCardModel(cardTestData);
        var oCardPropertiesModel = new JSONModel({
            template: "sap.ovp.cards.list",
            entityType: {
                "selectionAnnotationPath" : {
                    SelectOptions: [
                        {
                            PropertyName: { PropertyPath: "ID" },
                            Ranges: [
                                {
                                    Low: { String: "201" },
                                    Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/Contains" },
                                    Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/E" }
                                },
                                {
                                    Low: { String: "207" },
                                    Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/NotContains" },
                                    Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" }
                                },
                                {
                                    Low: { String: "208" },
                                    High: { String: "210" },
                                    Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/BT" },
                                    Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/E" }
                                },
                                {
                                    Low: { String: "207" },
                                    Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/NotStartsWith" },
                                    Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" }
                                },
                                {
                                    Low: { String: "208" },
                                    High: { String: "215" },
                                    Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/BT" },
                                    Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" }
                                },
                                {
                                    Low: { String: "20" },
                                    Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/StartsWith" },
                                    Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" }
                                }
                            ],
                        },
                        {
                            PropertyName: { PropertyPath: "GrossAmount" },
                            Ranges: [
                                {
                                    Low: {String: "70000"},
                                    Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/NE" },
                                    Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" }
                                },
                                {
                                    Low: {String: "5000"},
                                    Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/LE" },
                                    Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/E" }
                                },
                                {
                                    Low: {String: "500000"},
                                    Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/GE" },
                                    Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/E" }
                                },
                                {
                                    Low: {String: "10000"},
                                    High: {String: "40000"},
                                    Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/BT" },
                                    Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" }
                                },
                                {
                                    Low: {String: "30000"},
                                    Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/LE" },
                                    Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" }
                                },
                                {
                                    Low: {String: "15000"},
                                    Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/GE" },
                                    Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" }
                                },
                            ],
                        },
                        {
                            PropertyName: { PropertyPath: "CityName" },
                            Ranges: [
                                {
                                    Low: { String: "BLR" },
                                    Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/NE" },
                                    Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" }
                                },
                                {
                                    Low: { String: "DEL" },
                                    Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/EQ" },
                                    Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/E" }
                                }
                            ],
                        }
                    ]
                }
            },
            selectionAnnotationPath: "selectionAnnotationPath"
        }); 

        var getNavigationHandlerStub = sinon.stub(CommonUtils, "getNavigationHandler").returns({
            mixAttributesAndSelectionVariant: function (oContextParameters, oSelectionVariant, iSuppressionBehavior) {
                return {
                    toJSONString: function () {
                        return {
                            oContextParameters: oContextParameters,
                            oSelectionVariant: oSelectionVariant,
                            iSuppressionBehavior: iSuppressionBehavior,
                        };
                    }
                };
            }
        });

        var _removeSensitiveAttributesFromNavSelectionVariantForODataV2ModelStub = sinon.stub(NavigationHelper, "_removeSensitiveAttributesFromNavSelectionVariantForODataV2Model").returns({});

        var oEntityType = [];

        var oNavigationParams = NavigationHelper.getEntityNavigationParameters(
            {} /* oMainComponent */, 
            oModel, 
            {}, 
            oCardPropertiesModel, 
            oEntityType, 
            null /* oEntity */, 
            null /* oCustomParameters */,
            null /* oContext- donut card others data point */
        );
        var aExpectedResponse = [
            {
                "PropertyName": "ID",
                "Ranges": [
                    {
                        "Sign": "E",
                        "Option": "CP",
                        "Low": "*201*",
                        "High": null
                    },
                    {
                        "Sign": "E",
                        "Option": "CP",
                        "Low": "*207*",
                        "High": null
                    },
                    {
                        "Sign": "E",
                        "Option": "BT",
                        "Low": "208",
                        "High": "210"
                    },
                    {
                        "Sign": "E",
                        "Option": "CP",
                        "Low": "207*",
                        "High": null
                    },
                    {
                        "Sign": "I",
                        "Option": "BT",
                        "Low": "208",
                        "High": "215"
                    },
                    {
                        "Sign": "I",
                        "Option": "CP",
                        "Low": "20*",
                        "High": null
                    }
                ]
            },
            {
                "PropertyName": "GrossAmount",
                "Ranges": [
                    {
                        "Sign": "E",
                        "Option": "EQ",
                        "Low": "70000",
                        "High": null
                    },
                    {
                        "Sign": "I",
                        "Option": "GT",
                        "Low": "5000",
                        "High": null
                    },
                    {
                        "Sign": "I",
                        "Option": "LT",
                        "Low": "500000",
                        "High": null
                    },
                    {
                        "Sign": "I",
                        "Option": "BT",
                        "Low": "10000",
                        "High": "40000"
                    },
                    {
                        "Sign": "I",
                        "Option": "LE",
                        "Low": "30000",
                        "High": null
                    },
                    {
                        "Sign": "I",
                        "Option": "GE",
                        "Low": "15000",
                        "High": null
                    }
                ]
            },
            {
                "PropertyName": "CityName",
                "Ranges": [
                    {
                        "Sign": "E",
                        "Option": "EQ",
                        "Low": "BLR",
                        "High": null
                    },
                    {
                        "Sign": "E",
                        "Option": "EQ",
                        "Low": "DEL",
                        "High": null
                    }
                ]
            }
        ];
        assert.ok(typeof oNavigationParams === "object", "Navigation parameters are returned as object");
        assert.ok(oNavigationParams.sNavPresentationVariant === null, "Presentation variant are not defined");
        assert.ok(oNavigationParams.sNavSelectionVariant, "Selection variant are defined");
        assert.ok(JSON.stringify(JSON.parse(oNavigationParams.sNavSelectionVariant.oSelectionVariant).SelectOptions) === JSON.stringify(aExpectedResponse), "The filters are generated properly")
        getNavigationHandlerStub.restore();
        _removeSensitiveAttributesFromNavSelectionVariantForODataV2ModelStub.restore(); 
        // oNavigationHandlerMock.restore();
    });

    QUnit.test("_processCustomParameters - validate if static parameter is passed to mixAttributesAndSelectionVariant and is included in the returned result", function(assert){
        var oCustomParameters = {
            iStaticLinkListIndex: 0,
            bStaticLinkListIndex: true
        };
        var oMainComponent = {
            oMacroFilterBar: {
                sId: "application-browse-books-component---mainView--ovpGlobalMacroFilter"
            }
        };
        var oCardPropertiesModel = {
            getProperty: function(key) {
                if (key === "/staticContent") {
                    return [
                        {
                            title: "Jaden Lee",
                            subTitle: "Sales Manager",
                            imageUri: "img/YM.png",
                            imageAltText: "Jim Smith",
                            semanticObject: "sales",
                            action: "overview",
                            staticParameters: {
                                "SalesManager": "Jaden Lee"
                            },
                            id: "linkListItem--1"
                        }
                    ]
                }
            }
        };
        var oJsonObject = {
            Version: {
                "Major": "1",
                "Minor": "0",
                "Patch": "0"
            },
            SelectionVariantID: "",
            Text: "Selection Variant with ID ",
            ODataFilterExpression: "",
            Parameters: [],
            SelectOptions: [{}]
        }
        var oSelectionVariant = {
            id: "",
            parameters: {},
            selectOptions: {},
            toJSONString() {
                return JSON.stringify(oJsonObject);
            }
        };
        var oContextParameters = {};
        var oEntityType;
        var oModel = {
            getODataVersion: function() {
                return "4.0";
            }
        }
        var oPresentationVariant;
        var oStaticParameters = {
            "SalesManager": "Jaden Lee"
        }
        var getNavigationHandlerStub = sinon.stub(CommonUtils, "getNavigationHandler").returns({
            mixAttributesAndSelectionVariant: function (oContextParameters, oSelectionVariant, iSuppressionBehavior) {
                return {
                    toJSONString: function () {
                        return {
                            oContextParameters: oContextParameters,
                            oSelectionVariant: oSelectionVariant,
                            iSuppressionBehavior: iSuppressionBehavior,
                        };
                    }
                };
            }
        });
        
        var oResult = NavigationHelper._processCustomParameters(
            oCustomParameters, oMainComponent, oCardPropertiesModel, oSelectionVariant, oContextParameters, oEntityType, oModel, oPresentationVariant, oStaticParameters
        );
        var oExpectedResult = {
            sNavSelectionVariant: {
                iSuppressionBehavior: undefined,
                oContextParameters: {
                    "SalesManager": "Jaden Lee"
                },
                oSelectionVariant: "{\"Version\":{\"Major\":\"1\",\"Minor\":\"0\",\"Patch\":\"0\"},\"SelectionVariantID\":\"\",\"Text\":\"Selection Variant with ID \",\"ODataFilterExpression\":\"\",\"Parameters\":[],\"SelectOptions\":[{}]}"
            },
            sNavPresentationVariant: null
        }
        assert.deepEqual(oResult, oExpectedResult, "static parameter is passed to mixAttributesAndSelectionVariant and is included in the returned result");
        getNavigationHandlerStub.restore();
    });
});