/*global QUnit*/

sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/mockservers",
    "sap/ovp/cards/AnnotationHelper",
    "sap/ovp/cards/Constants",
    "sap/base/i18n/Formatting"
], function (
    utils,
    mockservers,
    AnnotationHelper,
    CardConstants,
    Formatting
) {
    "use strict";

    QUnit.module("sap.ovp.app.Main", {
        beforeEach: function () { },
        afterEach: function () { }
    });

    QUnit.test("AnnotationHelper - checkFilterPreference function test", function (assert) {
        var oSettings = {};
        var oModel = {
            getData: function () {
                return oSettings;
            }
        };

        assert.ok(!AnnotationHelper.checkFilterPreference(oModel), "If Filter Preference is not present");
        
        oSettings = {
            mFilterPreference: "Outside tab level",
        };
        assert.ok(!!AnnotationHelper.checkFilterPreference(oModel), "If Filter Preference is Outside tab level");

        oSettings.tabs = [{
            mFilterPreference: "Inside tab level -> First tab",
        }];
        assert.ok(
            !!AnnotationHelper.checkFilterPreference(oModel),
            "If Filter Preference is Inside tab level -> First tab"
        );

        oSettings.tabs.push({
            mFilterPreference: "Inside tab level -> Second tab",
        });
        oSettings.selectedKey = 2;
        assert.ok(
            !!AnnotationHelper.checkFilterPreference(oModel),
            "If Filter Preference is Inside tab level -> Second tab"
        );
    });

    QUnit.test("AnnotationHelper - formartItems expand, sorter, filters and select", function (assert) {
        mockservers.loadMockServer(utils.odataBaseUrl_salesOrder, utils.odataRootUrl_salesOrder);
        var cardTestData = {
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations_for_formatItems.xml",
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();
        var oMetaModel = oModel.getMetaModel();

        oMetaModel.loaded().then(function () {
            var oCardProperties = {
                "/contentFragment": "sap.ovp.cards.list.List",
                "/metaModel": oMetaModel,
                "/cardId": "card_1",
            };
            var ctx = new utils.ContextMock({
                ovpCardProperties: oCardProperties,
            });

            var oEntitySet = oMetaModel.getODataEntitySet("SalesOrderSet");

            //check simple case of no special configuration
            var result = AnnotationHelper.formatItems(ctx, oEntitySet, "com.sap.vocabularies.UI.v1.LineItem");
            assert.ok(result.indexOf("expand") === -1, "simple - check no expand");
            assert.ok(result.indexOf("filters") === -1, "simple - check no filters");
            assert.ok(result.indexOf("sorter") === -1, "simple - check no sorter");

            //check one filter from annotation
            oCardProperties["/selectionAnnotationPath"] = "com.sap.vocabularies.UI.v1.SelectionVariant#oneFilter";
            var aFilters = [];
            aFilters.push({
                path: "GrossAmount",
                operator: "BT",
                value1: 0,
                value2: 800000,
                sign: "I",
            });

            result = AnnotationHelper.formatItems(ctx, oEntitySet);
            assert.ok(result.indexOf("expand") === -1, "oneFilter - check no expand");
            assert.ok(result.indexOf("filters") > 0, "oneFilter - check filters existence");
            assert.ok(result.indexOf("filters:" + JSON.stringify(aFilters)) > 0, "oneFilter - check filters value");
            assert.ok(result.indexOf("sorter") === -1, "oneFilter - check no sorter");

            //check two filters from annotation
            oCardProperties["/selectionAnnotationPath"] = "com.sap.vocabularies.UI.v1.SelectionVariant#twoFilters";
            result = AnnotationHelper.formatItems(ctx, oEntitySet);
            aFilters.push({
                path: "LifecycleStatus",
                operator: "EQ",
                value1: "N",
                sign: "I",
            });

            assert.ok(result.indexOf("expand") === -1, "twoFilters - check no expand");
            assert.ok(result.indexOf("filters") > 0, "twoFilters - filters existence");
            assert.ok(result.indexOf("filters:" + JSON.stringify(aFilters)) > 0, "twoFilters - check filters value");
            assert.ok(result.indexOf("sorter") === -1, "twoFilters - check no sorter");

            //check two filters from annotation + config filter
            var oConfigFilter = {
                path: "configFilter",
                operator: "EQ",
                value1: "configValue",
                sign: "I",
            };

            oCardProperties["/filters"] = [oConfigFilter];
            result = AnnotationHelper.formatItems(ctx, oEntitySet);
            aFilters.unshift(oConfigFilter);

            assert.ok(result.indexOf("expand") === -1, "twoFilters + config filter - check no expand");
            assert.ok(result.indexOf("filters") > 0, "twoFilters + config filter - check filters existence");
            assert.ok(
                result.indexOf("filters:" + JSON.stringify(aFilters)) > 0,
                "twoFilters + config filter - check filters value"
            );
            assert.ok(result.indexOf("sorter") === -1, "twoFilters + config filter - check no sorter");

            //check config filter
            oCardProperties["/selectionAnnotationPath"] = undefined;
            result = AnnotationHelper.formatItems(ctx, oEntitySet);
            aFilters = [oConfigFilter];

            assert.ok(result.indexOf("expand") === -1, "config filter - check no expand");
            assert.ok(result.indexOf("filters") > 0, "config filter - check filters existence");
            assert.ok(result.indexOf("filters:" + JSON.stringify(aFilters)) > 0, "config filter - check filters value");
            assert.ok(result.indexOf("sorter") === -1, "config filter - check no sorter");

            //check no filters and one sorter from annotation
            oCardProperties["/filters"] = undefined;
            oCardProperties["/presentationAnnotationPath"] =
                "com.sap.vocabularies.UI.v1.PresentationVariant#oneSorter";

            result = AnnotationHelper.formatItems(ctx, oEntitySet);
            var aSorters = [];
            aSorters.push({
                path: "GrossAmount",
                descending: false,
            });

            assert.ok(result.indexOf("expand") === -1, "oneSorter - check no expand");
            assert.ok(result.indexOf("filters") === -1, "oneSorter - check no filters");
            assert.ok(result.indexOf("sorter") > 0, "oneSorter - check sorter existence");
            assert.ok(result.indexOf("sorter:" + JSON.stringify(aSorters)) > 0, "oneSorter - check sorter value");

            //check no filters and three sorters from annotation
            oCardProperties["/presentationAnnotationPath"] =
                "com.sap.vocabularies.UI.v1.PresentationVariant#threeSorters";
            oCardProperties["mFilterPreference"] = {};

            result = AnnotationHelper.formatItems(ctx, oEntitySet);
            aSorters.push({
                path: "NetAmount",
                descending: true,
            });
            aSorters.push({
                path: "TaxAmount",
                descending: true,
            });

            assert.ok(result.indexOf("expand") === -1, "threeSorters - check no expand");
            assert.ok(result.indexOf("filters") === -1, "threeSorters - check no filters");
            assert.ok(result.indexOf("sorter") > 0, "threeSorters - check sorter existence");
            assert.ok(result.indexOf("sorter:" + JSON.stringify(aSorters)) > 0, "threeSorters - check sorter value");
            assert.ok(result.indexOf("parameters: {custom: {cardId: 'card_1', _requestFrom: 'ovp_internal'}}") > 0, "Parameters - custom parameter as card id");
            delete oCardProperties.mFilterPreference;

            //check no filters, three sorters from annotation and one from config
            oCardProperties["/sortBy"] = "configSortBy";
            result = AnnotationHelper.formatItems(ctx, oEntitySet);
            aSorters.unshift({
                path: "configSortBy",
                descending: true,
            });

            assert.ok(result.indexOf("expand") === -1, "threeSorters + config sorter - check no expand");
            assert.ok(result.indexOf("filters") === -1, "threeSorters + config sorter - check no filters");
            assert.ok(result.indexOf("sorter") > 0, "threeSorters + config sorter - check sorter existence");
            assert.ok(
                result.indexOf("sorter:" + JSON.stringify(aSorters)) > 0,
                "threeSorters + config sorter - check sorter value"
            );

            //check no filters and one sorter from config
            oCardProperties["/presentationAnnotationPath"] = undefined;
            result = AnnotationHelper.formatItems(ctx, oEntitySet);
            aSorters = [
                {
                    path: "configSortBy",
                    descending: true,
                },
            ];

            assert.ok(result.indexOf("expand") === -1, "config sorter - check no expand");
            assert.ok(result.indexOf("filters") === -1, "config sorter - check no filters");
            assert.ok(result.indexOf("sorter") > 0, "config sorter - check sorter existence");
            assert.ok(result.indexOf("sorter:" + JSON.stringify(aSorters)) > 0, "config sorter - check sorter value");

            //check expand
            oCardProperties["/sortBy"] = undefined;
            oCardProperties["mFilterPreference"] = {};
            result = AnnotationHelper.formatItems(ctx, oEntitySet, "com.sap.vocabularies.UI.v1.LineItem#expand");
            assert.ok(result.indexOf("expand") > 0, "expand - check expand existence");
            assert.ok(result.indexOf("parameters: {expand: 'ToBusinessPartner'") > 0, "expand - check expand value");
            assert.ok(result.indexOf("filters") === -1, "expand - check no filters");
            assert.ok(result.indexOf("sorter") === -1, "expand - check no sorter");
            assert.ok(result.indexOf(", custom: {cardId: 'card_1', _requestFrom: 'ovp_internal'}") > 0, "Parameters - custom parameter as card id");
            delete oCardProperties.mFilterPreference;

            //check select flag is true
            oCardProperties["/addODataSelect"] = true;
            result = AnnotationHelper.formatItems(ctx, oEntitySet, "com.sap.vocabularies.UI.v1.LineItem");
            assert.ok(result.indexOf("expand") === -1, "select - check no expand");
            assert.ok(result.indexOf("select") > 0, "select - check select existence");
            assert.ok(
                result.indexOf(
                    "parameters: {select: 'SalesOrderID,CustomerName,GrossAmount,NetAmount,CurrencyCode,LifecycleStatus,CreatedAt,ChangedAt,LifecycleStatusDescription', custom: {_requestFrom: 'ovp_internal'}}"
                ) > 0,
                "select - check select value"
            );
            assert.ok(result.indexOf("filters") === -1, "select - check no filters");
            assert.ok(result.indexOf("sorter") === -1, "select - check no sorter");

            //check select flag is false
            oCardProperties["/addODataSelect"] = false;
            result = AnnotationHelper.formatItems(ctx, oEntitySet, "com.sap.vocabularies.UI.v1.LineItem");
            assert.ok(result.indexOf("expand") === -1, "select - check no expand");
            assert.ok(result.indexOf("select") === -1, "select - check no select");
            assert.ok(result.indexOf("filters") === -1, "select - check no filters");
            assert.ok(result.indexOf("sorter") === -1, "select - check no sorter");

            //check select flag is undefined
            oCardProperties["/addODataSelect"] = undefined;
            result = AnnotationHelper.formatItems(ctx, oEntitySet, "com.sap.vocabularies.UI.v1.LineItem");
            assert.ok(result.indexOf("expand") === -1, "select - check no expand");
            assert.ok(result.indexOf("select") === -1, "select - check no select");
            assert.ok(result.indexOf("filters") === -1, "select - check no filters");
            assert.ok(result.indexOf("sorter") === -1, "select - check no sorter");

            //check filters and sorterds from annotation and config and select flag is true
            oCardProperties["/sortBy"] = "configSortBy";
            oCardProperties["/presentationAnnotationPath"] =
                "com.sap.vocabularies.UI.v1.PresentationVariant#threeSorters";
            oCardProperties["/filters"] = [oConfigFilter];
            oCardProperties["/selectionAnnotationPath"] = "com.sap.vocabularies.UI.v1.SelectionVariant#twoFilters";
            oCardProperties["/addODataSelect"] = true;

            aSorters = [];
            aSorters.push({
                path: "configSortBy",
                descending: true,
            });
            aSorters.push({
                path: "GrossAmount",
                descending: false,
            });
            aSorters.push({
                path: "NetAmount",
                descending: true,
            });
            aSorters.push({
                path: "TaxAmount",
                descending: true,
            });

            aFilters = [];
            aFilters.push(oConfigFilter);
            aFilters.push({
                path: "GrossAmount",
                operator: "BT",
                value1: 0,
                value2: 800000,
                sign: "I",
            });
            aFilters.push({
                path: "LifecycleStatus",
                operator: "EQ",
                value1: "N",
                sign: "I",
            });

            result = AnnotationHelper.formatItems(ctx, oEntitySet, "com.sap.vocabularies.UI.v1.LineItem#expand");
            assert.ok(result.indexOf("expand") > 0, "expand - check expand existence");
            assert.ok(result.indexOf("expand: 'ToBusinessPartner'") > 0, "expand - check expand value");
            assert.ok(result.indexOf("filters") > 0, "oneFilter - check filters existence");
            assert.ok(result.indexOf("filters:" + JSON.stringify(aFilters)) > 0, "oneFilter - check filters value");
            assert.ok(result.indexOf("sorter") > 0, "threeSorters + config sorter - check sorter existence");
            assert.ok(
                result.indexOf("sorter:" + JSON.stringify(aSorters)) > 0,
                "threeSorters + config sorter - check sorter value"
            );
            assert.ok(result.indexOf("select") > 0, "select - check select existence");
            assert.ok(
                result.indexOf(
                    "select: 'SalesOrderID,ToBusinessPartner/CompanyName,ToBusinessPartner/EmailAddress,NetAmount,CurrencyCode,LifecycleStatus,CreatedAt,ChangedAt,LifecycleStatusDescription'"
                ) > 0,
                "select - check select value"
            );

            // Expand if UOM is an associate property
            var sNavigatedProperty = 'ToBusinessPartner/CompanyName';
            var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
            var oEnityTypeProperty = oMetaModel.getODataProperty(oEntityType, 'CustomerName');
            oEnityTypeProperty['Org.OData.Measures.V1.Unit'] = {Path: sNavigatedProperty};
            var result = AnnotationHelper.formatItems(ctx, oEntitySet, "com.sap.vocabularies.UI.v1.LineItem");
            assert.ok(result.indexOf("expand: 'ToBusinessPartner'") > -1, "association - path will be expanded");

            //expand if UOM has a Text annotation which is an assosciated property
            var sUnitPath = 'CustomerID';
            delete oEnityTypeProperty['Org.OData.Measures.V1.Unit'];
            var result = AnnotationHelper.formatItems(ctx, oEntitySet, "com.sap.vocabularies.UI.v1.LineItem");
            assert.ok(result.indexOf("expand") === -1, "no expand");

            oEnityTypeProperty['Org.OData.Measures.V1.Unit'] = {Path: sUnitPath};
            var oUnitEntityTypeProperty = oMetaModel.getODataProperty(oEntityType, sUnitPath);
            oUnitEntityTypeProperty['com.sap.vocabularies.Common.v1.Text'] = {Path: sNavigatedProperty};
            var result = AnnotationHelper.formatItems(ctx, oEntitySet, "com.sap.vocabularies.UI.v1.LineItem");
            assert.ok(result.indexOf("expand: 'ToBusinessPartner'") > -1, "association - path will be expanded");

            mockservers.close();
            fnDone();
        });
    });

    QUnit.test("Annotation Helper  _criticalityToValue", function (assert) {
        var criticality = {};

        criticality.EnumMember = "com.sap.vocabularies.UI.v1.CriticalityType/Negative";
        var result = AnnotationHelper._criticality2state(
            criticality,
            CardConstants.Criticality.StateValues
        );
        assert.ok(result === "Error");

        criticality.EnumMember = "com.sap.vocabularies.UI.v1.CriticalityType/Critical";
        var result = AnnotationHelper._criticality2state(
            criticality,
            CardConstants.Criticality.StateValues
        );
        assert.ok(result === "Warning");

        criticality.EnumMember = "com.sap.vocabularies.UI.v1.CriticalityType/Positive";
        var result = AnnotationHelper._criticality2state(
            criticality,
            CardConstants.Criticality.StateValues
        );
        assert.ok(result === "Success");

        criticality.EnumMember = "";
        var result = AnnotationHelper._criticality2state(
            criticality,
            CardConstants.Criticality.StateValues
        );
        assert.ok(result === "None");

        criticality.EnumMember = null;
        var result = AnnotationHelper._criticality2state(
            criticality,
            CardConstants.Criticality.StateValues
        );
        assert.ok(result === "None");

        criticality = null;
        var result = AnnotationHelper._criticality2state(
            criticality,
            CardConstants.Criticality.StateValues
        );
        assert.ok(result === "None");
    });

    QUnit.test("Annotation Helper  _calculateCriticalityState", function (assert) {
        var sResult;

        sResult = AnnotationHelper._calculateCriticalityState(
            501,
            "com.sap.vocabularies.UI.v1.CriticalityCalculationType/Maximize",
            500,
            undefined,
            5000,
            undefined,
            CardConstants.Criticality.StateValues
        );
        assert.ok(sResult === "Warning");

        sResult = AnnotationHelper._calculateCriticalityState(
            5001,
            "com.sap.vocabularies.UI.v1.CriticalityCalculationType/Maximize",
            500,
            undefined,
            5000,
            undefined,
            CardConstants.Criticality.StateValues
        );
        assert.ok(sResult === "Success");

        sResult = AnnotationHelper._calculateCriticalityState(
            4999,
            "com.sap.vocabularies.UI.v1.CriticalityCalculationType/Maximize",
            500,
            undefined,
            5000,
            undefined,
            CardConstants.Criticality.StateValues
        );
        assert.ok(sResult === "Warning");

        sResult = AnnotationHelper._calculateCriticalityState(
            19,
            "com.sap.vocabularies.UI.v1.CriticalityCalculationType/Maximize",
            30,
            undefined,
            50,
            undefined,
            CardConstants.Criticality.StateValues
        );
        assert.ok(sResult === "Error");

        sResult = AnnotationHelper._calculateCriticalityState(
            501,
            "com.sap.vocabularies.UI.v1.CriticalityCalculationType/Minimize",
            undefined,
            "500",
            undefined,
            "5000",
            CardConstants.Criticality.StateValues
        );
        assert.ok(sResult === "Success");

        sResult = AnnotationHelper._calculateCriticalityState(
            4999,
            "com.sap.vocabularies.UI.v1.CriticalityCalculationType/Minimize",
            undefined,
            "500",
            undefined,
            5000,
            CardConstants.Criticality.StateValues
        );
        assert.ok(sResult === "Success");

        sResult = AnnotationHelper._calculateCriticalityState(
            49999,
            "com.sap.vocabularies.UI.v1.CriticalityCalculationType/Minimize",
            undefined,
            "500",
            undefined,
            5000,
            CardConstants.Criticality.StateValues
        );
        assert.ok(sResult === "Error");

        sResult = AnnotationHelper._calculateCriticalityState(
            31,
            "com.sap.vocabularies.UI.v1.CriticalityCalculationType/Minimize",
            undefined,
            50,
            undefined,
            30,
            CardConstants.Criticality.StateValues
        );
        assert.ok(sResult === "Warning");

        sResult = AnnotationHelper._calculateCriticalityState(
            31,
            "com.sap.vocabularies.UI.v1.CriticalityCalculationType/Target",
            undefined,
            "50",
            undefined,
            30,
            CardConstants.Criticality.StateValues
        );
        assert.ok(sResult === "None");

        sResult = AnnotationHelper._calculateCriticalityState(
            31,
            "com.sap.vocabularies.UI.v1.CriticalityCalculationType/Target",
            30,
            50,
            "30",
            "45",
            CardConstants.Criticality.StateValues
        );
        assert.ok(sResult === "Success");

        sResult = AnnotationHelper._calculateCriticalityState(
            10,
            "com.sap.vocabularies.UI.v1.CriticalityCalculationType/Target",
            30,
            50,
            30,
            "45",
            CardConstants.Criticality.StateValues
        );
        assert.ok(sResult === "Error");

        sResult = AnnotationHelper._calculateCriticalityState(
            undefined,
            "com.sap.vocabularies.UI.v1.CriticalityCalculationType/Target",
            30,
            50,
            30,
            "45",
            CardConstants.Criticality.StateValues
        );
        assert.ok(sResult === "None");

        // empty arguments
        sResult = AnnotationHelper._calculateCriticalityState();
        assert.ok(!sResult);

        // all arguments undefined/null - for state
        sResult = AnnotationHelper._calculateCriticalityState(
            undefined,
            undefined,
            null,
            null,
            undefined,
            undefined,
            CardConstants.Criticality.StateValues
        );
        assert.ok(sResult === "None");

        // all arguments undefined/null - for color
        sResult = AnnotationHelper._calculateCriticalityState(
            undefined,
            undefined,
            null,
            null,
            undefined,
            undefined,
            CardConstants.Criticality.ColorValues
        );
        assert.ok(sResult === "Neutral");

        // value exist, all thresholds undefined
        sResult = AnnotationHelper._calculateCriticalityState(
            19,
            undefined,
            null,
            null,
            undefined,
            undefined,
            CardConstants.Criticality.StateValues
        );
        assert.ok(sResult === "None");

        sResult = AnnotationHelper._calculateCriticalityState(
            19,
            "com.sap.vocabularies.UI.v1.CriticalityCalculationType/Maximize",
            undefined,
            undefined,
            undefined,
            undefined,
            CardConstants.Criticality.StateValues
        );
        assert.ok(sResult === "None");
    });

    QUnit.test("Annotation Helper - calculateTrendDirection", function (assert) {
        var aggregateValue;
        var referenceValue;
        var downDirection;
        var upDirection;

        aggregateValue = 200;
        referenceValue = 1000;
        downDirection = "10";
        upDirection = "100";
        assert.ok(
            AnnotationHelper._calculateTrendDirection(
                aggregateValue,
                referenceValue,
                downDirection,
                upDirection
            ) === "Down"
        );

        aggregateValue = 200;
        referenceValue = 100;
        downDirection = "10";
        upDirection = "100";
        assert.ok(
            AnnotationHelper._calculateTrendDirection(
                aggregateValue,
                referenceValue,
                downDirection,
                upDirection
            ) === "Up"
        );

        aggregateValue = 50;
        referenceValue = undefined;
        downDirection = "10";
        upDirection = "100";
        assert.ok(!AnnotationHelper._calculateTrendDirection(aggregateValue, referenceValue, downDirection, upDirection));

        aggregateValue = 50;
        referenceValue = undefined;
        downDirection = "10";
        upDirection = "100";
        assert.ok(!AnnotationHelper._calculateTrendDirection(aggregateValue, referenceValue, downDirection, upDirection));

        aggregateValue = 50;
        referenceValue = undefined;
        downDirection = "10";
        upDirection = "100";
        assert.ok(!AnnotationHelper._calculateTrendDirection(aggregateValue, referenceValue, downDirection, upDirection));

        aggregateValue = 50;
        referenceValue = undefined;
        downDirection = undefined;
        upDirection = "100";
        assert.ok(!AnnotationHelper._calculateTrendDirection(aggregateValue, referenceValue, downDirection, upDirection));

        aggregateValue = 50;
        referenceValue = undefined;
        downDirection = "10";
        upDirection = undefined;
        assert.ok(!AnnotationHelper._calculateTrendDirection(aggregateValue, referenceValue, downDirection, upDirection));

        aggregateValue = 50;
        referenceValue = undefined;
        downDirection = undefined;
        upDirection = undefined;
        assert.ok(!AnnotationHelper._calculateTrendDirection(aggregateValue, referenceValue, downDirection, upDirection));
    });

    QUnit.test("Annotation Helper - formatItems - one sort via card configuration", function (assert) {
        // preparing the entity set
        var oEntitySet = {};
        oEntitySet.name = "entitySetName";

        // preparing the context
        var ctx = new utils.ContextMock({
            ovpCardProperties: {
                "/sortBy": "sortByConfiguration_1",
                "/sortOrder": "descending",
                "/contentFragment": "sap.ovp.cards.table.Table",
                "/metaModel": utils.createMetaModel(),
            },
        });

        // format items
        var result = AnnotationHelper.formatItems(ctx, oEntitySet);
        assert.ok(
            result ===
            '{path: \'/entitySetName\', length: 5, parameters: {custom: {_requestFrom: \'ovp_internal\'}}, sorter:[{"path":"sortByConfiguration_1","descending":true}]}'
        );
    });

    QUnit.test("Annotation Helper - formatItems - with expand parameter of annotationPath that do not exists", function (assert) {
        var oEntitySet = [];
        oEntitySet.name = "entitySetName";

        // preparing the entity set
        var oEntitySet = [];
        oEntitySet.name = "entitySetName";

        // preparing the context
        var ctx = new utils.ContextMock({
            ovpCardProperties: {
                "/contentFragment": "sap.ovp.cards.table.Table",
                "/annotationPath": "annotationThatDoNotExists",
                "/metaModel": utils.createMetaModel(),
            },
        });

        // format items
        var result = AnnotationHelper.formatItems(ctx, oEntitySet, "annotationThatDoNotExists");
        assert.ok(result === "{path: '/entitySetName', length: 5, parameters: {custom: {_requestFrom: 'ovp_internal'}}}");
    });

    QUnit.test("Annotation Helper - formatItems - with filter", function (assert) {
        var oEntitySet = [];
        oEntitySet.name = "entitySetName";

        // preparing the context
        var ctx = new utils.ContextMock({
            ovpCardProperties: {
                "/contentFragment": "sap.ovp.cards.table.Table",
                "/annotationPath": "annotationThatDoNotExists",
                "/metaModel": utils.createMetaModel(),
                "/filters": [{ value1: "testVal", operator: "EQ", path: "CustomerID", sign: "I" }],
            },
        });

        // format items
        var result = AnnotationHelper.formatItems(ctx, oEntitySet, "annotationThatDoNotExists");
        assert.ok(
            result ===
            '{path: \'/entitySetName\', length: 5, parameters: {custom: {_requestFrom: \'ovp_internal\'}}, filters:[{"value1":"testVal","operator":"EQ","path":"CustomerID","sign":"I"}]}'
        );
    });

    QUnit.test("Annotation Helper - getItemsLength - TableCard Desktop", function (assert) {
        // preparing the entity set
        var oEntitySet = {};
        oEntitySet.name = "entitySetName";

        // preparing the context
        var ctx = new utils.ContextMock({
            ovpCardProperties: {
                "/contentFragment": "sap.ovp.cards.table.Table",
                "/metaModel": utils.createMetaModel(),
            },
        });

        // format items
        var result = AnnotationHelper.formatItems(ctx, oEntitySet);
        assert.ok(result === "{path: '/entitySetName', length: 5, parameters: {custom: {_requestFrom: 'ovp_internal'}}}");
    });

    QUnit.test("Annotation Helper - getItemsLength - CondensedListCard Desktop", function (assert) {
        // preparing the entity set
        var oEntitySet = {};
        oEntitySet.name = "entitySetName";

        // preparing the context
        var ctx = new utils.ContextMock({
            ovpCardProperties: {
                "/contentFragment": "sap.ovp.cards.list.List",
                "/metaModel": utils.createMetaModel(),
            },
        });

        // format items
        var result = AnnotationHelper.formatItems(ctx, oEntitySet);
        assert.ok(result === "{path: '/entitySetName', length: 5, parameters: {custom: {_requestFrom: 'ovp_internal'}}}");
    });

    QUnit.test("Annotation Helper - getItemsLength - Extended Card Desktop", function (assert) {
        // preparing the entity set
        var oEntitySet = {};
        oEntitySet.name = "entitySetName";

        // preparing the context
        var ctx = new utils.ContextMock({
            ovpCardProperties: {
                "/contentFragment": "sap.ovp.cards.list.List",
                "/listType": "extended",
                "/metaModel": utils.createMetaModel(),
            },
        });

        // format items
        var result = AnnotationHelper.formatItems(ctx, oEntitySet);
        assert.ok(result === "{path: '/entitySetName', length: 3, parameters: {custom: {_requestFrom: 'ovp_internal'}}}");
    });

    QUnit.test("Annotation Helper - getItemsLength - Condensed BAR ListCard Desktop", function (assert) {
        // preparing the entity set
        var oEntitySet = {};
        oEntitySet.name = "entitySetName";

        // preparing the context
        var ctx = new utils.ContextMock({
            ovpCardProperties: {
                "/contentFragment": "sap.ovp.cards.list.List",
                "/listFlavor": "bar",
                "/metaModel": utils.createMetaModel(),
            },
        });

        // format items
        var result = AnnotationHelper.formatItems(ctx, oEntitySet);
        assert.ok(result === "{path: '/entitySetName', length: 5, parameters: {custom: {_requestFrom: 'ovp_internal'}}}");
    });

    QUnit.test("Annotation Helper - getItemsLength - Extended BAR Card Desktop", function (assert) {
        // preparing the entity set
        var oEntitySet = {};
        oEntitySet.name = "entitySetName";

        // preparing the context
        var ctx = new utils.ContextMock({
            ovpCardProperties: {
                "/contentFragment": "sap.ovp.cards.list.List",
                "/listType": "extended",
                "/listFlavor": "bar",
                "/metaModel": utils.createMetaModel(),
            },
        });

        // format items
        var result = AnnotationHelper.formatItems(ctx, oEntitySet);
        assert.ok(result === "{path: '/entitySetName', length: 3, parameters: {custom: {_requestFrom: 'ovp_internal'}}}");
    });

    QUnit.test("Annotation Helper - getItemsLength - No Card Type Desktop", function (assert) {
        // preparing the entity set
        var oEntitySet = {};
        oEntitySet.name = "entitySetName";

        // preparing the context
        var ctx = new utils.ContextMock({
            ovpCardProperties: {
                "/metaModel": utils.createMetaModel(),
            },
        });

        // format items
        var result = AnnotationHelper.formatItems(ctx, oEntitySet);
        assert.ok(result === "{path: '/entitySetName', length: 5, parameters: {custom: {_requestFrom: 'ovp_internal'}}}");
    });

    QUnit.test("Annotation Helper - getDataPointsCount - only relevant items exist", function (assert) {
        var ctx = new utils.ContextMock();
        var aCollection = [];
        aCollection[0] = {};
        aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataFieldForAnnotation";
        aCollection[0].Target = {};
        aCollection[0].Target.AnnotationPath = "@com.sap.vocabularies.UI.v1.DataPoint#SomeValue_1";

        aCollection[1] = {};
        aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataFieldForAnnotation";
        aCollection[1].Target = {};
        aCollection[1].Target.AnnotationPath = "@com.sap.vocabularies.UI.v1.DataPoint#SomeValue_2";

        aCollection[2] = {};
        aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataFieldForAnnotation";
        aCollection[2].Target = {};
        aCollection[2].Target.AnnotationPath = "@com.sap.vocabularies.UI.v1.DataPoint#SomeValue_3";

        var result = AnnotationHelper.getDataPointsCount(ctx, aCollection);
        assert.ok(result === 3);
    });

    QUnit.test("Annotation Helper - getDataPointsCount - items contains some not-relevant annotation targets", function (assert) {
        var ctx = new utils.ContextMock();
        var aCollection = [];
        aCollection[0] = {};
        aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataFieldForAnnotation";
        aCollection[0].Target = {};
        aCollection[0].Target.AnnotationPath = "someValue_1";

        aCollection[1] = {};
        aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataFieldForAnnotation";
        aCollection[1].Target = {};
        aCollection[1].Target.AnnotationPath = "@com.sap.vocabularies.UI.v1.DataPoint#SomeValue_2";

        aCollection[2] = {};
        aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataFieldForAnnotation";
        aCollection[2].Target = {};
        aCollection[2].Target.AnnotationPath = "@com.sap.vocabularies.UI.v1.DataPoint#SomeValue_3";

        var result = AnnotationHelper.getDataPointsCount(ctx, aCollection);
        assert.ok(result === 2);
    });

    QUnit.test("Annotation Helper - getFirstDataFieldName - 4 items, no Importance", function (assert) {
        var ctx = new utils.ContextMock();
        var aCollection = [];
        aCollection[0] = {};
        aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[0].Label = {};
        aCollection[0].Label.String = "Property 0";
        aCollection[0].Value = {};
        aCollection[0].Value.Path = "Property_0";

        aCollection[1] = {};
        aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[1].Label = {};
        aCollection[1].Label.String = "Property 1";
        aCollection[1].Value = {};
        aCollection[1].Value.Path = "Property_1";

        aCollection[2] = {};
        aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[2].Label = {};
        aCollection[2].Label.String = "Property 2";
        aCollection[2].Value = {};
        aCollection[2].Value.Path = "Property_2";

        aCollection[3] = {};
        aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[3].Label = {};
        aCollection[3].Label.String = "Property 3";
        aCollection[3].Value = {};
        aCollection[3].Value.Path = "Property_3";

        var result = AnnotationHelper.getFirstDataFieldName(ctx, aCollection);
        assert.ok(result === "Property 0");
    });

    QUnit.test("Annotation Helper - getFirstDataFieldName - 4 items, with Importance", function (assert) {
        var ctx = new utils.ContextMock();
        var aCollection = [];
        aCollection[0] = [];
        aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[0].Label = {};
        aCollection[0].Label.String = "Property 0";
        aCollection[0].Value = {};
        aCollection[0].Value.Path = "Property_0";

        aCollection[1] = [];
        aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[1].Label = {};
        aCollection[1].Label.String = "Property 1";
        aCollection[1].Value = {};
        aCollection[1].Value.Path = "Property_1";

        aCollection[2] = [];
        aCollection[2]["com.sap.vocabularies.UI.v1.Importance"] = [];
        aCollection[2]["com.sap.vocabularies.UI.v1.Importance"].EnumMember =
            "com.sap.vocabularies.UI.v1.ImportanceType/Medium";
        aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[2].Label = {};
        aCollection[2].Label.String = "Property 2";
        aCollection[2].Value = {};
        aCollection[2].Value.Path = "Property_2";

        aCollection[3] = {};
        aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[3].Label = {};
        aCollection[3].Label.String = "Property 3";
        aCollection[3].Value = {};
        aCollection[3].Value.Path = "Property_3";

        var result = AnnotationHelper.getFirstDataFieldName(ctx, aCollection);
        assert.ok(result === "Property 2");
    });

    QUnit.test("Annotation Helper - getSecondDataFieldName - 4 items, no Importance", function (assert) {
        var ctx = new utils.ContextMock();
        var aCollection = [];
        aCollection[0] = {};
        aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[0].Label = {};
        aCollection[0].Label.String = "Property 0";
        aCollection[0].Value = {};
        aCollection[0].Value.Path = "Property_0";

        aCollection[1] = {};
        aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[1].Label = {};
        aCollection[1].Label.String = "Property 1";
        aCollection[1].Value = {};
        aCollection[1].Value.Path = "Property_1";

        aCollection[2] = {};
        aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[2].Label = {};
        aCollection[2].Label.String = "Property 2";
        aCollection[2].Value = {};
        aCollection[2].Value.Path = "Property_2";

        aCollection[3] = {};
        aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[3].Label = {};
        aCollection[3].Label.String = "Property 3";
        aCollection[3].Value = {};
        aCollection[3].Value.Path = "Property_3";

        var result = AnnotationHelper.getSecondDataFieldName(ctx, aCollection);
        assert.ok(result === "Property 1");
    });

    QUnit.test("Annotation Helper - getSecondDataFieldName - 4 items, with Importance", function (assert) {
        var ctx = new utils.ContextMock();
        var aCollection = [];
        aCollection[0] = [];
        aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[0].Label = {};
        aCollection[0].Label.String = "Property 0";
        aCollection[0].Value = {};
        aCollection[0].Value.Path = "Property_0";

        aCollection[1] = [];
        aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[1].Label = {};
        aCollection[1].Label.String = "Property 1";
        aCollection[1].Value = {};
        aCollection[1].Value.Path = "Property_1";

        aCollection[2] = [];
        aCollection[2]["com.sap.vocabularies.UI.v1.Importance"] = [];
        aCollection[2]["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Medium";
        aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[2].Label = {};
        aCollection[2].Label.String = "Property 2";
        aCollection[2].Value = {};
        aCollection[2].Value.Path = "Property_2";

        aCollection[3] = {};
        aCollection[3]["com.sap.vocabularies.UI.v1.Importance"] = [];
        aCollection[3]["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Low";
        aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[3].Label = {};
        aCollection[3].Label.String = "Property 3";
        aCollection[3].Value = {};
        aCollection[3].Value.Path = "Property_3";

        var result = AnnotationHelper.getSecondDataFieldName(ctx, aCollection);
        assert.ok(result === "Property 3");
    });

    QUnit.test("Annotation Helper - getThirdDataFieldName - 4 items, no Importance", function (assert) {
        var ctx = new utils.ContextMock();
        var aCollection = [];
        aCollection[0] = {};
        aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[0].Label = {};
        aCollection[0].Label.String = "Property 0";
        aCollection[0].Value = {};
        aCollection[0].Value.Path = "Property_0";

        aCollection[1] = {};
        aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[1].Label = {};
        aCollection[1].Label.String = "Property 1";
        aCollection[1].Value = {};
        aCollection[1].Value.Path = "Property_1";

        aCollection[2] = {};
        aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[2].Label = {};
        aCollection[2].Label.String = "Property 2";
        aCollection[2].Value = {};
        aCollection[2].Value.Path = "Property_2";

        aCollection[3] = {};
        aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[3].Label = {};
        aCollection[3].Label.String = "Property 3";
        aCollection[3].Value = {};
        aCollection[3].Value.Path = "Property_3";

        var result = AnnotationHelper.getThirdDataFieldName(ctx, aCollection);
        assert.ok(result === "Property 2");
    });

    QUnit.test("Annotation Helper - getThirdDataFieldName - 4 items, with Importance", function (assert) {
        var ctx = new utils.ContextMock();
        var aCollection = [];
        aCollection[0] = [];
        aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[0].Label = {};
        aCollection[0].Label.String = "Property 0";
        aCollection[0].Value = {};
        aCollection[0].Value.Path = "Property_0";

        aCollection[1] = [];
        aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[1]["com.sap.vocabularies.UI.v1.Importance"] = [];
        aCollection[1]["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Low";
        aCollection[1].Label = {};
        aCollection[1].Label.String = "Property 1";
        aCollection[1].Value = {};
        aCollection[1].Value.Path = "Property_1";

        aCollection[2] = [];
        aCollection[2]["com.sap.vocabularies.UI.v1.Importance"] = [];
        aCollection[2]["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Medium";
        aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[2].Label = {};
        aCollection[2].Label.String = "Property 2";
        aCollection[2].Value = {};
        aCollection[2].Value.Path = "Property_2";

        aCollection[3] = {};
        aCollection[3]["com.sap.vocabularies.UI.v1.Importance"] = [];
        aCollection[3]["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Low";
        aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[3].Label = {};
        aCollection[3].Label.String = "Property 3";
        aCollection[3].Value = {};
        aCollection[3].Value.Path = "Property_3";

        var result = AnnotationHelper.getThirdDataFieldName(ctx, aCollection);
        assert.ok(result === "Property 3");
    });

    QUnit.test("Annotation Helper - hasActions", function (assert) {
        var ctx = new utils.ContextMock();

        var aCollection = [
            { RecordType: "com.sap.vocabularies.UI.v1.DataField" },
            { RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction" },
            { RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction" },
        ];

        var result = AnnotationHelper.hasActions(ctx, aCollection);
        assert.ok(result, "only DataFieldForAction exists");

        var aCollection = [
            { RecordType: "com.sap.vocabularies.UI.v1.DataField" },
            { RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" },
        ];

        var result = AnnotationHelper.hasActions(ctx, aCollection);
        assert.ok(result, "only DataFieldForIntentBasedNavigation exists");

        var aCollection = [
            { RecordType: "com.sap.vocabularies.UI.v1.DataField" },
            { RecordType: "com.sap.vocabularies.UI.v1.DataFieldWithUrl" },
        ];

        var result = AnnotationHelper.hasActions(ctx, aCollection);
        assert.ok(result, "only DataFieldWithUrl exists");

        var aCollection = [
            { RecordType: "com.sap.vocabularies.UI.v1.DataField" },
            { RecordType: "com.sap.vocabularies.UI.v1.DataFieldWithUrl" },
            { RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" },
            { RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction" },
        ];

        var result = AnnotationHelper.hasActions(ctx, aCollection);
        assert.ok(result, "all actions types exists");

        var aCollection = [
            { RecordType: "com.sap.vocabularies.UI.v1.DataField" },
            { RecordType: "com.sap.vocabularies.UI.v1.DataField" },
            { RecordType: "com.sap.vocabularies.UI.v1.DataField" },
            { RecordType: "com.sap.vocabularies.UI.v1.DataField" },
        ];

        var result = AnnotationHelper.hasActions(ctx, aCollection);
        assert.ok(!result, "no actions exists");
    });

    QUnit.test("Annotation Helper - formatFirstDataFieldValue - 4 items, no Importance", function (assert) {
        var ctx = new utils.ContextMock({
            ovpCardProperties: {
                "/entityType": {},
                "/metaModel": utils.createMetaModel({}, {}),
            },
        });
        var aCollection = [];
        aCollection[0] = {};
        aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[0].Label = {};
        aCollection[0].Label.String = "Property 0";
        aCollection[0].Value = {};
        aCollection[0].Value.Path = "Property_0";

        aCollection[1] = {};
        aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[1].Label = {};
        aCollection[1].Label.String = "Property 1";
        aCollection[1].Value = {};
        aCollection[1].Value.Path = "Property_1";

        aCollection[2] = {};
        aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[2].Label = {};
        aCollection[2].Label.String = "Property 2";
        aCollection[2].Value = {};
        aCollection[2].Value.Path = "Property_2";

        aCollection[3] = {};
        aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[3].Label = {};
        aCollection[3].Label.String = "Property 3";
        aCollection[3].Value = {};
        aCollection[3].Value.Path = "Property_3";

        var result = AnnotationHelper.formatDataFieldValueOnIndex(ctx, aCollection, 0);
        assert.ok(result === "{Property_0}");
    });

    QUnit.test("Annotation Helper - formatFirstDataFieldValue - 4 items, with Importance", function (assert) {
        var ctx = new utils.ContextMock({
            ovpCardProperties: {
                "/entityType": {},
                "/metaModel": utils.createMetaModel({}, {}),
            },
        });
        var aCollection = [];
        aCollection[0] = {};
        aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[0].Label = {};
        aCollection[0].Label.String = "Property 0";
        aCollection[0].Value = {};
        aCollection[0].Value.Path = "Property_0";

        aCollection[1] = {};
        aCollection[1]["com.sap.vocabularies.UI.v1.Importance"] = [];
        aCollection[1]["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Low";
        aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[1].Label = {};
        aCollection[1].Label.String = "Property 1";
        aCollection[1].Value = {};
        aCollection[1].Value.Path = "Property_1";

        aCollection[2] = {};
        aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[2].Label = {};
        aCollection[2].Label.String = "Property 2";
        aCollection[2].Value = {};
        aCollection[2].Value.Path = "Property_2";

        aCollection[3] = {};
        aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[3].Label = {};
        aCollection[3].Label.String = "Property 3";
        aCollection[3].Value = {};
        aCollection[3].Value.Path = "Property_3";

        var result = AnnotationHelper.formatDataFieldValueOnIndex(ctx, aCollection, 0);
        assert.ok(result === "{Property_1}");
    });

    QUnit.test("Annotation Helper - formatSecondDataFieldValue - 4 items, no Importance", function (assert) {
        var ctx = new utils.ContextMock({
            ovpCardProperties: {
                "/entityType": {},
                "/metaModel": utils.createMetaModel({}, {}),
            },
        });
        var aCollection = [];
        aCollection[0] = {};
        aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[0].Label = {};
        aCollection[0].Label.String = "Property 0";
        aCollection[0].Value = {};
        aCollection[0].Value.Path = "Property_0";

        aCollection[1] = {};
        aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[1].Label = {};
        aCollection[1].Label.String = "Property 1";
        aCollection[1].Value = {};
        aCollection[1].Value.Path = "Property_1";

        aCollection[2] = {};
        aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[2].Label = {};
        aCollection[2].Label.String = "Property 2";
        aCollection[2].Value = {};
        aCollection[2].Value.Path = "Property_2";

        aCollection[3] = {};
        aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[3].Label = {};
        aCollection[3].Label.String = "Property 3";
        aCollection[3].Value = {};
        aCollection[3].Value.Path = "Property_3";

        var result = AnnotationHelper.formatDataFieldValueOnIndex(ctx, aCollection, 1);
        assert.ok(result === "{Property_1}");
    });

    QUnit.test("Annotation Helper - formatSecondDataFieldValue - 4 items, with 2 Importance fields ", function (assert) {
        var ctx = new utils.ContextMock({
            ovpCardProperties: {
                "/entityType": {},
                "/metaModel": utils.createMetaModel({}, {}),
            },
        });
        var aCollection = [];
        aCollection[0] = {};
        aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[0].Label = {};
        aCollection[0].Label.String = "Property 0";
        aCollection[0].Value = {};
        aCollection[0].Value.Path = "Property_0";

        aCollection[1] = {};
        aCollection[1]["com.sap.vocabularies.UI.v1.Importance"] = [];
        aCollection[1]["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Low";
        aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[1].Label = {};
        aCollection[1].Label.String = "Property 1";
        aCollection[1].Value = {};
        aCollection[1].Value.Path = "Property_1";

        aCollection[2] = {};
        aCollection[2]["com.sap.vocabularies.UI.v1.Importance"] = [];
        aCollection[2]["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Medium";
        aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[2].Label = {};
        aCollection[2].Label.String = "Property 2";
        aCollection[2].Value = {};
        aCollection[2].Value.Path = "Property_2";

        aCollection[3] = {};
        aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[3].Label = {};
        aCollection[3].Label.String = "Property 3";
        aCollection[3].Value = {};
        aCollection[3].Value.Path = "Property_3";

        var result = AnnotationHelper.formatDataFieldValueOnIndex(ctx, aCollection, 1);
        assert.ok(result === "{Property_1}");
    });

    QUnit.test("Annotation Helper - formatThirdDataFieldValue - 4 items, no Importance", function (assert) {
        var ctx = new utils.ContextMock({
            ovpCardProperties: {
                "/entityType": {},
                "/metaModel": utils.createMetaModel({}, {}),
            },
        });
        var aCollection = [];
        aCollection[0] = {};
        aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[0].Label = {};
        aCollection[0].Label.String = "Property 0";
        aCollection[0].Value = {};
        aCollection[0].Value.Path = "Property_0";

        aCollection[1] = {};
        aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[1].Label = {};
        aCollection[1].Label.String = "Property 1";
        aCollection[1].Value = {};
        aCollection[1].Value.Path = "Property_1";

        aCollection[2] = {};
        aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[2].Label = {};
        aCollection[2].Label.String = "Property 2";
        aCollection[2].Value = {};
        aCollection[2].Value.Path = "Property_2";

        aCollection[3] = {};
        aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[3].Label = {};
        aCollection[3].Label.String = "Property 3";
        aCollection[3].Value = {};
        aCollection[3].Value.Path = "Property_3";

        var result = AnnotationHelper.formatDataFieldValueOnIndex(ctx, aCollection, 2);
        assert.ok(result === "{Property_2}");
    });

    QUnit.test("Annotation Helper - formatThirdDataFieldValue - 4 items, with 2 Importance fields ", function (assert) {
        var ctx = new utils.ContextMock({
            ovpCardProperties: {
                "/entityType": {},
                "/metaModel": utils.createMetaModel({}, {}),
            },
        });
        var aCollection = [];
        aCollection[0] = {};
        aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[0].Label = {};
        aCollection[0].Label.String = "Property 0";
        aCollection[0].Value = {};
        aCollection[0].Value.Path = "Property_0";

        aCollection[1] = {};
        aCollection[1]["com.sap.vocabularies.UI.v1.Importance"] = [];
        aCollection[1]["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Low";
        aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[1].Label = {};
        aCollection[1].Label.String = "Property 1";
        aCollection[1].Value = {};
        aCollection[1].Value.Path = "Property_1";

        aCollection[2] = {};
        aCollection[2]["com.sap.vocabularies.UI.v1.Importance"] = [];
        aCollection[2]["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Medium";
        aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[2].Label = {};
        aCollection[2].Label.String = "Property 2";
        aCollection[2].Value = {};
        aCollection[2].Value.Path = "Property_2";

        aCollection[3] = {};
        aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[3].Label = {};
        aCollection[3].Label.String = "Property 3";
        aCollection[3].Value = {};
        aCollection[3].Value.Path = "Property_3";

        var result = AnnotationHelper.formatDataFieldValueOnIndex(ctx, aCollection, 2);
        assert.ok(result === "{Property_0}");
    });

    QUnit.test("Annotation Helper - formatFourthDataFieldValue - 4 items, no Importance", function (assert) {
        var ctx = new utils.ContextMock({
            ovpCardProperties: {
                "/entityType": {},
                "/metaModel": utils.createMetaModel({}, {}),
            },
        });
        var aCollection = [];
        aCollection[0] = {};
        aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[0].Label = {};
        aCollection[0].Label.String = "Property 0";
        aCollection[0].Value = {};
        aCollection[0].Value.Path = "Property_0";

        aCollection[1] = {};
        aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[1].Label = {};
        aCollection[1].Label.String = "Property 1";
        aCollection[1].Value = {};
        aCollection[1].Value.Path = "Property_1";

        aCollection[2] = {};
        aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[2].Label = {};
        aCollection[2].Label.String = "Property 2";
        aCollection[2].Value = {};
        aCollection[2].Value.Path = "Property_2";

        aCollection[3] = {};
        aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[3].Label = {};
        aCollection[3].Label.String = "Property 3";
        aCollection[3].Value = {};
        aCollection[3].Value.Path = "Property_3";

        var result = AnnotationHelper.formatDataFieldValueOnIndex(ctx, aCollection, 3);
        assert.ok(result === "{Property_3}");
    });

    QUnit.test("Annotation Helper - formatFourthDataFieldValue - 4 items, with 2 Importance fields ", function (assert) {
        var ctx = new utils.ContextMock({
            ovpCardProperties: {
                "/entityType": {},
                "/metaModel": utils.createMetaModel({}, {}),
            },
        });
        var aCollection = [];
        aCollection[0] = {};
        aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[0].Label = {};
        aCollection[0].Label.String = "Property 0";
        aCollection[0].Value = {};
        aCollection[0].Value.Path = "Property_0";

        aCollection[1] = {};
        aCollection[1]["com.sap.vocabularies.UI.v1.Importance"] = [];
        aCollection[1]["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Low";
        aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[1].Label = {};
        aCollection[1].Label.String = "Property 1";
        aCollection[1].Value = {};
        aCollection[1].Value.Path = "Property_1";

        aCollection[2] = {};
        aCollection[2]["com.sap.vocabularies.UI.v1.Importance"] = [];
        aCollection[2]["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Medium";
        aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[2].Label = {};
        aCollection[2].Label.String = "Property 2";
        aCollection[2].Value = {};
        aCollection[2].Value.Path = "Property_2";

        aCollection[3] = {};
        aCollection[3]["com.sap.vocabularies.UI.v1.Importance"] = [];
        aCollection[3]["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Medium";
        aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[3].Label = {};
        aCollection[3].Label.String = "Property 3";
        aCollection[3].Value = {};
        aCollection[3].Value.Path = "Property_3";

        var result = AnnotationHelper.formatDataFieldValueOnIndex(ctx, aCollection, 3);
        assert.ok(result === "{Property_0}");
    });

    QUnit.test("Annotation Helper - formatFifthDataFieldValue -7 items, no Importance", function (assert) {
        var ctx = new utils.ContextMock({
            ovpCardProperties: {
                "/entityType": {},
                "/metaModel": utils.createMetaModel({}, {}),
            },
        });
        var aCollection = [];
        aCollection[0] = {};
        aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[0].Label = {};
        aCollection[0].Label.String = "Property 0";
        aCollection[0].Value = {};
        aCollection[0].Value.Path = "Property_0";

        aCollection[1] = {};
        aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[1].Label = {};
        aCollection[1].Label.String = "Property 1";
        aCollection[1].Value = {};
        aCollection[1].Value.Path = "Property_1";

        aCollection[2] = {};
        aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[2].Label = {};
        aCollection[2].Label.String = "Property 2";
        aCollection[2].Value = {};
        aCollection[2].Value.Path = "Property_2";

        aCollection[3] = {};
        aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[3].Label = {};
        aCollection[3].Label.String = "Property 3";
        aCollection[3].Value = {};
        aCollection[3].Value.Path = "Property_3";

        aCollection[4] = {};
        aCollection[4].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[4].Label = {};
        aCollection[4].Label.String = "Property 4";
        aCollection[4].Value = {};
        aCollection[4].Value.Path = "Property_4";

        aCollection[5] = {};
        aCollection[5].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[5].Label = {};
        aCollection[5].Label.String = "Property 5";
        aCollection[5].Value = {};
        aCollection[5].Value.Path = "Property_5";

        aCollection[6] = {};
        aCollection[6].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[6].Label = {};
        aCollection[6].Label.String = "Property 6";
        aCollection[6].Value = {};
        aCollection[6].Value.Path = "Property_6";

        var result = AnnotationHelper.formatDataFieldValueOnIndex(ctx, aCollection, 4);
        assert.ok(result === "{Property_4}");
    });

    QUnit.test("Annotation Helper - formatFifthDataFieldValue - 7 items, with 2 Importance fields ", function (assert) {
        var ctx = new utils.ContextMock({
            ovpCardProperties: {
                "/entityType": {},
                "/metaModel": utils.createMetaModel({}, {}),
            },
        });
        var aCollection = [];
        aCollection[0] = {};
        aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[0].Label = {};
        aCollection[0].Label.String = "Property 0";
        aCollection[0].Value = {};
        aCollection[0].Value.Path = "Property_0";

        aCollection[1] = {};
        aCollection[1]["com.sap.vocabularies.UI.v1.Importance"] = [];
        aCollection[1]["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Low";
        aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[1].Label = {};
        aCollection[1].Label.String = "Property 1";
        aCollection[1].Value = {};
        aCollection[1].Value.Path = "Property_1";

        aCollection[2] = {};
        aCollection[2]["com.sap.vocabularies.UI.v1.Importance"] = [];
        aCollection[2]["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Medium";
        aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[2].Label = {};
        aCollection[2].Label.String = "Property 2";
        aCollection[2].Value = {};
        aCollection[2].Value.Path = "Property_2";

        aCollection[3] = {};
        aCollection[3]["com.sap.vocabularies.UI.v1.Importance"] = [];
        aCollection[3]["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Medium";
        aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[3].Label = {};
        aCollection[3].Label.String = "Property 3";
        aCollection[3].Value = {};
        aCollection[3].Value.Path = "Property_3";

        aCollection[4] = {};
        aCollection[4]["com.sap.vocabularies.UI.v1.Importance"] = [];
        aCollection[4]["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Medium";
        aCollection[4].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[4].Label = {};
        aCollection[4].Label.String = "Property 4";
        aCollection[4].Value = {};
        aCollection[4].Value.Path = "Property_4";

        aCollection[5] = {};
        aCollection[5].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[5].Label = {};
        aCollection[5].Label.String = "Property 5";
        aCollection[5].Value = {};
        aCollection[5].Value.Path = "Property_5";

        aCollection[6] = {};
        aCollection[6]["com.sap.vocabularies.UI.v1.Importance"] = [];
        aCollection[6]["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Low";
        aCollection[6].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[6].Label = {};
        aCollection[6].Label.String = "Property 6";
        aCollection[6].Value = {};
        aCollection[6].Value.Path = "Property_6";

        var result = AnnotationHelper.formatDataFieldValueOnIndex(ctx, aCollection, 4);
        assert.ok(result === "{Property_6}");
    });

    QUnit.test("Annotation Helper - formatSixthDataFieldValue - 7 items, no Importance", function (assert) {
        var ctx = new utils.ContextMock({
            ovpCardProperties: {
                "/entityType": {},
                "/metaModel": utils.createMetaModel({}, {}),
            },
        });
        var aCollection = [];
        aCollection[0] = {};
        aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[0].Label = {};
        aCollection[0].Label.String = "Property 0";
        aCollection[0].Value = {};
        aCollection[0].Value.Path = "Property_0";

        aCollection[1] = {};
        aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[1].Label = {};
        aCollection[1].Label.String = "Property 1";
        aCollection[1].Value = {};
        aCollection[1].Value.Path = "Property_1";

        aCollection[2] = {};
        aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[2].Label = {};
        aCollection[2].Label.String = "Property 2";
        aCollection[2].Value = {};
        aCollection[2].Value.Path = "Property_2";

        aCollection[3] = {};
        aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[3].Label = {};
        aCollection[3].Label.String = "Property 3";
        aCollection[3].Value = {};
        aCollection[3].Value.Path = "Property_3";

        aCollection[4] = {};
        aCollection[4].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[4].Label = {};
        aCollection[4].Label.String = "Property 4";
        aCollection[4].Value = {};
        aCollection[4].Value.Path = "Property_4";

        aCollection[5] = {};
        aCollection[5].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[5].Label = {};
        aCollection[5].Label.String = "Property 5";
        aCollection[5].Value = {};
        aCollection[5].Value.Path = "Property_5";

        aCollection[6] = {};
        aCollection[6].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[6].Label = {};
        aCollection[6].Label.String = "Property 6";
        aCollection[6].Value = {};
        aCollection[6].Value.Path = "Property_6";

        var result = AnnotationHelper.formatDataFieldValueOnIndex(ctx, aCollection, 5);
        assert.ok(result === "{Property_5}");
    });

    QUnit.test("Annotation Helper - formatSixthDataFieldValue - 7 items, with 2 Importance fields ", function (assert) {
        var ctx = new utils.ContextMock({
            ovpCardProperties: {
                "/entityType": {},
                "/metaModel": utils.createMetaModel({}, {}),
            },
        });
        var aCollection = [];
        aCollection[0] = {};
        aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[0].Label = {};
        aCollection[0].Label.String = "Property 0";
        aCollection[0].Value = {};
        aCollection[0].Value.Path = "Property_0";

        aCollection[1] = {};
        aCollection[1]["com.sap.vocabularies.UI.v1.Importance"] = [];
        aCollection[1]["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Low";
        aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[1].Label = {};
        aCollection[1].Label.String = "Property 1";
        aCollection[1].Value = {};
        aCollection[1].Value.Path = "Property_1";

        aCollection[2] = {};
        aCollection[2]["com.sap.vocabularies.UI.v1.Importance"] = [];
        aCollection[2]["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Medium";
        aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[2].Label = {};
        aCollection[2].Label.String = "Property 2";
        aCollection[2].Value = {};
        aCollection[2].Value.Path = "Property_2";

        aCollection[3] = {};
        aCollection[3]["com.sap.vocabularies.UI.v1.Importance"] = [];
        aCollection[3]["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Medium";
        aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[3].Label = {};
        aCollection[3].Label.String = "Property 3";
        aCollection[3].Value = {};
        aCollection[3].Value.Path = "Property_3";

        aCollection[4] = {};
        aCollection[4]["com.sap.vocabularies.UI.v1.Importance"] = [];
        aCollection[4]["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Medium";
        aCollection[4].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[4].Label = {};
        aCollection[4].Label.String = "Property 4";
        aCollection[4].Value = {};
        aCollection[4].Value.Path = "Property_4";

        aCollection[5] = {};
        aCollection[5].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[5].Label = {};
        aCollection[5].Label.String = "Property 5";
        aCollection[5].Value = {};
        aCollection[5].Value.Path = "Property_5";

        aCollection[6] = {};
        aCollection[6]["com.sap.vocabularies.UI.v1.Importance"] = [];
        aCollection[6]["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Low";
        aCollection[6].RecordType = "com.sap.vocabularies.UI.v1.DataField";
        aCollection[6].Label = {};
        aCollection[6].Label.String = "Property 6";
        aCollection[6].Value = {};
        aCollection[6].Value.Path = "Property_6";

        var result = AnnotationHelper.formatDataFieldValueOnIndex(ctx, aCollection, 5);
        assert.ok(result === "{Property_0}");
    });

    QUnit.test("Annotation Helper - formatDataPoint with valueFormat annotation", function (assert) {
        var ctx = new utils.ContextMock({
            ovpCardProperties: {
                "/entityType": {},
                "/metaModel": utils.createMetaModel({}, {}),
            },
            model: {
                "com.sap.vocabularies.UI.v1.DataPoint": {
                    Value: {
                        Path: "dataPoint",
                    },
                    ValueFormat: {
                        NumberOfFractionalDigits: {
                            Int: 2,
                        },
                    },
                },
            },
        }),
            oStaticValue = {
                numberOfFractionalDigits: 2,
                functionName: "CardAnnotationhelper.formatNumberCalculation"
            },
            sExpectedResult = "{value:" + JSON.stringify(oStaticValue) + ", model: 'ovpCardProperties'}";
        var aCollection = [];
        aCollection[0] = {};
        aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataFieldForAnnotation";
        aCollection[0].Target = {};
        aCollection[0].Target.AnnotationPath = "@com.sap.vocabularies.UI.v1.DataPoint";

        var result = AnnotationHelper.formatDataPointValueOnIndex(ctx, aCollection, 0);
        assert.ok(result.indexOf(sExpectedResult) > -1);
    });

    QUnit.test("Annotation Helper - formatDataPoint with valueFormat annotation and 'scale' attribute in the metadata", function (assert) {
        var oOdataProperty = { scale: "3" };
        var ctx = new utils.ContextMock({
            ovpCardProperties: {
                "/entityType": {},
                "/metaModel": utils.createMetaModel({}, oOdataProperty),
            },
            model: {
                "com.sap.vocabularies.UI.v1.DataPoint": {
                    Value: {
                        Path: "dataPoint",
                    },
                    ValueFormat: {
                        NumberOfFractionalDigits: {
                            Int: 2,
                        },
                    },
                },
            },
        }),
        oStaticValue = {
            numberOfFractionalDigits: 2,
            functionName: "CardAnnotationhelper.formatNumberCalculation"
        },
        sExpectedResult = "{value:" + JSON.stringify(oStaticValue) + ", model: 'ovpCardProperties'}";
        var aCollection = [];
        aCollection[0] = {};
        aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataFieldForAnnotation";
        aCollection[0].Target = {};
        aCollection[0].Target.AnnotationPath = "@com.sap.vocabularies.UI.v1.DataPoint";

        var result = AnnotationHelper.formatDataPointValueOnIndex(ctx, aCollection, 0);
        assert.ok(
            result.indexOf(sExpectedResult) > -1,
            "The number format function takes the numberOfFractionalDigits as the static value"
        );
    });

    QUnit.test("Annotation Helper - formatDataPoint with no valueFormat annotation and with 'scale' attribute in the metadata will have default value as Zero", function (assert) {
        var oOdataProperty = { scale: "3" };
        var ctx = new utils.ContextMock({
            ovpCardProperties: {
                "/entityType": {},
                "/metaModel": utils.createMetaModel({}, oOdataProperty),
            },
            model: {
                "com.sap.vocabularies.UI.v1.DataPoint": {
                    Value: {
                        Path: "dataPoint",
                    },
                },
            },
        }),
        oStaticValue = {
            numberOfFractionalDigits: 0,
            functionName: "CardAnnotationhelper.formatNumberCalculation"
        },
        sExpectedResult = "{value:" + JSON.stringify(oStaticValue) + ", model: 'ovpCardProperties'}";
        var aCollection = [];
        aCollection[0] = {};
        aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataFieldForAnnotation";
        aCollection[0].Target = {};
        aCollection[0].Target.AnnotationPath = "@com.sap.vocabularies.UI.v1.DataPoint";

        var result = AnnotationHelper.formatDataPointValueOnIndex(ctx, aCollection, 0);
        assert.ok(
            result.indexOf(sExpectedResult) > -1,
            "he number format function takes the numberOfFractionalDigits as the static value"
        );
    });

    QUnit.test("Annotation Helper - formatDataPoint with no valueFormat annotation and no 'scale' attribute in the metadata", function (assert) {
        var ctx = new utils.ContextMock({
            ovpCardProperties: {
                "/entityType": {},
                "/metaModel": utils.createMetaModel({}, {}),
            },
            model: {
                "com.sap.vocabularies.UI.v1.DataPoint": {
                    Value: {
                        Path: "dataPointPath",
                    },
                },
            },
        });

        var aCollection = [];
        aCollection[0] = {};
        aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataFieldForAnnotation";
        aCollection[0].Target = {};
        aCollection[0].Target.AnnotationPath = "@com.sap.vocabularies.UI.v1.DataPoint";

        var result = AnnotationHelper.formatDataPointValueOnIndex(ctx, aCollection, 0);
        assert.ok(result.indexOf("dataPointPath") > -1, "formatField formatted the field with the standard UI5 formatter");
        assert.ok(result.indexOf("formatNumberCalculation") <= -1, "no numberFormat was generated");
    });

    QUnit.test("Annotation Helper - formatDataPoint with 'Org.OData.Measures.V1.ISOCurrency' annotation", function (assert) {
        var oOdataProperty = { "Org.OData.Measures.V1.ISOCurrency": { Path: "currencyCode" } };
        var ctx = new utils.ContextMock({
            ovpCardProperties: {
                "/entityType": {},
                "/metaModel": utils.createMetaModel({}, oOdataProperty)
            },
            model: {
                "com.sap.vocabularies.UI.v1.DataPoint": {
                    Value: {
                        Path: "dataPointPath",
                    }
                }
            }
        });

        var aCollection = [];
        aCollection[0] = {};
        aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataFieldForAnnotation";
        aCollection[0].Target = {};
        aCollection[0].Target.AnnotationPath = "@com.sap.vocabularies.UI.v1.DataPoint";

        var result = AnnotationHelper.formatDataPointValueOnIndex(ctx, aCollection, 0);
        assert.ok(result.indexOf("currencyCode") > -1, "formatField added the currency path to the formatted value");

        // Format Unit for ISO currency annotation
        result = AnnotationHelper.formatUnit(ctx, aCollection, 0);
        assert.ok(result.indexOf("currencyCode") > -1, "formatField added the currency path to the formatted value");
    });

    QUnit.test("Annotation Helper - formatDataPoint with 'Org.OData.Measures.V1.Unit' annotation", function (assert) {
        var oOdataProperty = { "Org.OData.Measures.V1.ISOCurrency": { Path: "unitCode" } };
        var ctx = new utils.ContextMock({
            ovpCardProperties: {
                "/entityType": {},
                "/metaModel": utils.createMetaModel({}, oOdataProperty),
            },
            model: {
                "com.sap.vocabularies.UI.v1.DataPoint": {
                    Value: {
                        Path: "dataPoint"
                    }
                }
            }
        });

        var aCollection = [];
        aCollection[0] = {};
        aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataFieldForAnnotation";
        aCollection[0].Target = {};
        aCollection[0].Target.AnnotationPath = "@com.sap.vocabularies.UI.v1.DataPoint";

        var result = AnnotationHelper.formatDataPointValueOnIndex(ctx, aCollection, 0);
        assert.ok(result.indexOf("unitCode") > -1, "formatField added the unit path to the formatted value");
    });

    QUnit.test("Annotation Helper - getPropertiesFromBindingString", function (assert) {
        var sBinding;
        var aResult;

        var aExpectedResult = ["P1", "P2", "P3"];

        sBinding = "{P1} {P2}/{P3}";
        aResult = AnnotationHelper._getPropertiesFromBindingString(sBinding);
        assert.ok(aResult.length == 3);
        assert.deepEqual(aResult, aExpectedResult, "Properties evaluated correctly from binding string.");

        sBinding = "{    path  :'P1'} / {path:   'P2'} / {path       :         'P3' }";
        aResult = AnnotationHelper._getPropertiesFromBindingString(sBinding);
        assert.ok(aResult.length == 3);
        assert.deepEqual(aResult, aExpectedResult, "Properties evaluated correctly from binding string.");

        var aExpectedResult1 = ["Address/Street", "Address/City"];

        sBinding =
            "{=odata.fillUriTemplate('https://www.google.de/maps/place/{street},{city}',{'street':odata.uriEncode(${Address/Street},undefined),'city':odata.uriEncode(${Address/City},undefined)})}";
        aResult = AnnotationHelper._getPropertiesFromBindingString(sBinding);
        assert.ok(aResult.length == 2);
        assert.deepEqual(aResult, aExpectedResult1, "Properties evaluated correctly from binding string.");

        var aExpectedResult2 = ["P1", "P2"];
        sBinding =
            "{P1} {parts:[{path: 'P2'}, {value:{'dateFormat':{'prop1':'abc'},'prop2':true}, model: 'ovpCardProperties'}], formatter: 'CardAnnotationhelper.formatDate'}";
        aResult = AnnotationHelper._getPropertiesFromBindingString(sBinding);
        assert.ok(aResult.length == 2);
        assert.deepEqual(aResult, aExpectedResult2, "Properties evaluated correctly from binding string.");
    });

    QUnit.test("Annotation Helper - getRequestFields", function (assert) {
        var oPresentationVariant = {
            RequestAtLeast: [
                {
                    PropertyPath: "CustomerName",
                },
                {
                    PropertyPath: "Supplier_Name",
                },
                {
                    PropertyPath: "CustomerID",
                },
            ],
        };
        var oExpected = ["CustomerName", "Supplier_Name", "CustomerID"];
        var nResult = AnnotationHelper.getRequestFields(oPresentationVariant);
        assert.ok(JSON.stringify(oExpected) === JSON.stringify(nResult));
    });

    QUnit.test("Annotation Helper - getRequestFields presentationVariant is undefined", function (assert) {
        var oPresentationVariant = undefined;
        var oExpected = [];
        var nResult = AnnotationHelper.getRequestFields(oPresentationVariant);
        assert.ok(JSON.stringify(oExpected) === JSON.stringify(nResult));
    });

    QUnit.test("Annotation Helper - getRequestFields RequestAtleast is undefined", function (assert) {
        var oPresentationVariant = {
            GroupBy: {
                PropertyPath: "BillingStatusDescription",
            },
        };
        var oExpected = [];
        var nResult = AnnotationHelper.getRequestFields(oPresentationVariant);
        assert.ok(JSON.stringify(oExpected) === JSON.stringify(nResult));
    });

    QUnit.test("Annotation Helper - TargetValueFormatter", function (assert) {
        var sKpiValue = "25867",
            sTargetValue = "85000";
        var oExpected = {
            sValue: "85.0K",
        };
        var oStaticValues = {   
            numberOfFractionalDigits: 1,
            percentageAvailable: false,
            manifestTargetValue: undefined
        }
        var nResult = AnnotationHelper.TargetValueFormatter(sKpiValue, sTargetValue, oStaticValues);
        assert.ok(nResult === oExpected.sValue);
    });

    QUnit.test("Annotation Helper - returnPercentageChange", function (assert) {
        var sKpiValue = "25867",
            sTargetValue = "85000";
        var oExpected = {
            sValue: "-69.57%",
        };
        var oStaticValues = {
            numberOfFractionalDigits: 2,
            manifestTargetValue: undefined
        }
        var nResult = AnnotationHelper.returnPercentageChange(sKpiValue, sTargetValue, oStaticValues);
        assert.ok(nResult === oExpected.sValue);
    });

    QUnit.test("Annotation Helper - checkNavTargetForContactAnno", function (assert) {
        var item = {
            Label: { String: "Supplier" },
            Value: { Path: "CustomerName" },
            RecordType: "com.sap.vocabularies.UI.v1.DataField",
            EdmType: "Edm.String",
        };
        var oExpected = {
            sValue: "",
        };
        var oContext = {
            ovpCardProperties: {
                oData: {
                    iNumberOfFractionalDigits: 2,
                },
                getProperty: function (iKey) {
                    return this.oData[iKey.split("/")[1]];
                },
            },
            getModel: function () {
                return this.ovpCardProperties;
            },
        };
        var nResult = AnnotationHelper.checkNavTargetForContactAnno(oContext, item);
        assert.ok(nResult === oExpected.sValue);
    });

    QUnit.test("Annotation Helper - checkForContactAnnotation", function (assert) {
        mockservers.loadMockServer(utils.odataBaseUrl_salesOrder, utils.odataRootUrl_salesOrder);
        var cardTestData = {
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations_for_formatItems.xml",
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        var oMetaModel = oModel.getMetaModel();
        oMetaModel.loaded().then(function () {
            var oEntitySet = oMetaModel.getODataEntitySet("SalesOrderSet");
            var oExpected = {
                sValue: true
            };
            var oContext = {
                ovpCardProperties: {
                    getProperty: function (sProperty) {
                        if (sProperty === "/metaModel") {
                            return oMetaModel;
                        }
                    },
                },
                getSetting: function () {
                    return this.ovpCardProperties;
                },
            };
            var nResult = AnnotationHelper.checkForContactAnnotation(oContext, oEntitySet);
            assert.ok(nResult === oExpected.sValue);
            mockservers.close();
            fnDone();
        });
    });

    QUnit.module("Support for Semantic Date", {
        beforeEach: function () {
            this.oDateSettings = {
                DeliveryDate: {
                    selectedValues: "FROM,TO,DAYS,WEEK,MONTH,DATERANGE,TODAY,TOMORROW,YEAR,YESTERDAY",
                    exclude: true,
                },
                SubmittedDate: {
                    filter: [{ path: "key", contains: "TOMORROW", exclude: false }],
                },
                CreatedDate: {
                    customDateRangeImplementation: "sap.ovp.demo.ext.customDateRangeType",
                },
                LastUpdatedDate: {
                    selectedValues: "DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR",
                    exclude: true,
                },
                StartDate: {
                    selectedValues: "DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR",
                    exclude: true,
                },
                EndDate: {
                    selectedValues: "DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR",
                    exclude: true,
                },
            };
            this.allControlConfiguration = [
                { PropertyPath: "SupplierName" },
                { PropertyPath: "Land1" },
                { PropertyPath: "MaterialName" },
                { PropertyPath: "MaterialGroup" },
                { PropertyPath: "PurchasingCategory" },
                { PropertyPath: "PurchasingGroup" },
                { PropertyPath: "PurchasingOrganization" },
                { PropertyPath: "CurrencyCode" },
                { PropertyPath: "DeliveryDate" },
                { PropertyPath: "CreatedDate" },
                { PropertyPath: "LastUpdatedDate" },
                { PropertyPath: "StartDate", bNotPartOfSelectionField: true },
                { PropertyPath: "EndDate", bNotPartOfSelectionField: true },
            ];
            this.allDateControlConfiguration = [
                { PropertyPath: "DeliveryDate" },
                { PropertyPath: "SubmittedDate" },
                { PropertyPath: "CreatedDate" },
                { PropertyPath: "LastUpdatedDate" },
                { PropertyPath: "StartDate", bNotPartOfSelectionField: true },
                { PropertyPath: "EndDate", bNotPartOfSelectionField: true },
            ];
        },
        afterEach: function () {
            this.oDateSettings = {};
            this.allControlConfiguration = [];
            this.allDateControlConfiguration = [];
        }
    });
    QUnit.test("Annotation Helper - isDateRangeType", function (assert) {
        var oExpectedResult = {
            SupplierName: false,
            Land1: false,
            MaterialName: false,
            MaterialGroup: false,
            PurchasingCategory: false,
            PurchasingGroup: false,
            PurchasingOrganization: false,
            CurrencyCode: false,
            DeliveryDate: true,
            CreatedDate: true,
            LastUpdatedDate: true,
            StartDate: true,
            EndDate: true,
        },
        bResult;
        for (var i = 0; i < this.allControlConfiguration.length; i++) {
            bResult = AnnotationHelper.isDateRangeType(
                this.allControlConfiguration[i].PropertyPath,
                this.oDateSettings
            );
            assert.ok(bResult === oExpectedResult[this.allControlConfiguration[i].PropertyPath]);
        }
    });

    QUnit.test("Annotation Helper - getConditionTypeForDateProperties", function (assert) {
        var oExpectedResult = {
            DeliveryDate: JSON.stringify({
                module: "sap.ui.comp.config.condition.DateRangeType",
                operations: {
                    filter: [
                        {
                            path: "key",
                            contains: "FROM,TO,DAYS,WEEK,MONTH,DATERANGE,TODAY,TOMORROW,YEAR,YESTERDAY",
                            exclude: true,
                        },
                    ],
                },
            }),
            SubmittedDate: JSON.stringify({
                module: "sap.ui.comp.config.condition.DateRangeType",
                operations: {
                    filter: this.oDateSettings.SubmittedDate.filter,
                },
            }),
            CreatedDate: "sap.ovp.demo.ext.customDateRangeType",
            LastUpdatedDate: JSON.stringify({
                module: "sap.ui.comp.config.condition.DateRangeType",
                operations: {
                    filter: [
                        {
                            path: "key",
                            contains: "DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR",
                            exclude: true,
                        },
                    ],
                },
            }),
            StartDate: JSON.stringify({
                module: "sap.ui.comp.config.condition.DateRangeType",
                operations: {
                    filter: [
                        {
                            path: "key",
                            contains: "DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR",
                            exclude: true,
                        },
                    ],
                },
            }),
            EndDate: JSON.stringify({
                module: "sap.ui.comp.config.condition.DateRangeType",
                operations: {
                    filter: [
                        {
                            path: "key",
                            contains: "DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR",
                            exclude: true,
                        },
                    ],
                },
            }),
        },
        bResult;
        for (var i = 0; i < this.allDateControlConfiguration.length; i++) {
            bResult = AnnotationHelper.getConditionTypeForDateProperties(
                this.allDateControlConfiguration[i].PropertyPath,
                this.oDateSettings
            );
            assert.ok(bResult === oExpectedResult[this.allDateControlConfiguration[i].PropertyPath]);
        }
    });
    QUnit.test("Annotation Helper - getGroupID", function (assert) {
        var oExpectedResult = {
            SupplierName: "_BASIC",
            Land1: "_BASIC",
            MaterialName: "_BASIC",
            MaterialGroup: "_BASIC",
            PurchasingCategory: "_BASIC",
            PurchasingGroup: "_BASIC",
            PurchasingOrganization: "_BASIC",
            CurrencyCode: "_BASIC",
            DeliveryDate: "_BASIC",
            CreatedDate: "_BASIC",
            LastUpdatedDate: "_BASIC",
            StartDate: undefined,
            EndDate: undefined,
        },
        bResult;
        for (var i = 0; i < this.allControlConfiguration.length; i++) {
            bResult = AnnotationHelper.getGroupID(this.allControlConfiguration[i].bNotPartOfSelectionField);
            assert.ok(bResult === oExpectedResult[this.allControlConfiguration[i].PropertyPath]);
        }
    });

    QUnit.module("AH", {
        beforeEach: function () {
            this.sAnnotationType = "com.sap.vocabularies.Common.v1.IsFiscalYearPeriod";
            this.sFiscalData = '202102';
        },
        afterEach: function () {
            this.sAnnotationType = null;
            this.sFiscalData = null;
        }
    });
    
    QUnit.test('PPP/YYYY - Get formatted data for category or x axis for fiscalyearperiod annoatation',function(assert){
        var sFormatFiscalData = AnnotationHelper.getFormattedFiscalData(this.sFiscalData, this.sAnnotationType);
        assert.equal(sFormatFiscalData, '002/2021');
    });
    
    QUnit.test('PPP.YYYY - Get formatted data for category or x axis for fiscalyearperiod annoatation',function(assert){
        var oStubbedLocaleData = {
            "dateFormats-short": "dd.MM.yyyy",
            "dateFormats-medium": "dd.MM.yyyy",
            "symbols-latn-group": ".",
            "symbols-latn-decimal": ",",
            "timeFormats-short": "HH:mm",
            "timeFormats-medium": "HH:mm:ss",
        };

        var formatSettingsStub = sinon.stub(Formatting, 'getCustomLocaleData');
        formatSettingsStub.returns(oStubbedLocaleData);
        var sFormatFiscalData = AnnotationHelper.getFormattedFiscalData(this.sFiscalData, this.sAnnotationType);
        assert.equal(sFormatFiscalData, '002.2021');
        formatSettingsStub.restore();
    });
    
    QUnit.test('No formatting for fiscal data without a valid annotation',function(assert){
        this.sAnnotationType = null;
        var sFormatFiscalData = AnnotationHelper.getFormattedFiscalData(this.sFiscalData, this.sAnnotationType);
        assert.equal(sFormatFiscalData, this.sFiscalData);
    });
    
    QUnit.test('format with sap:text or com.sap.vocabularies.Common.v1.Text annotation',function(assert){
        mockservers.loadMockServer(utils.odataBaseUrl_salesOrder, utils.odataRootUrl_salesOrder);
        var cardTestData = {
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations_for_formatItems.xml",
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();
        var oMetaModel = oModel.getMetaModel();
        oMetaModel.loaded().then(function () {
            var oEntitySet = oMetaModel.getODataEntitySet("SalesOrderSet");
            var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
            var sUnitPath = "CurrencyCode";
            var sTextPath = "SalesOrderID";
            var oUnitEntityTypeProperty;

            oUnitEntityTypeProperty = oMetaModel.getODataProperty(oEntityType, sUnitPath);
            oUnitEntityTypeProperty['com.sap.vocabularies.Common.v1.Text'] = undefined;
            var result = AnnotationHelper.getSapTextPathForUOM(sUnitPath, oMetaModel, oEntityType);
            assert.ok(result.indexOf(sTextPath) === -1, "A UOM property without Text Annotation should not return text path");

            oUnitEntityTypeProperty = oMetaModel.getODataProperty(oEntityType, sUnitPath);
            oUnitEntityTypeProperty['com.sap.vocabularies.Common.v1.Text'] = {Path: sTextPath};
            var result = AnnotationHelper.getSapTextPathForUOM(sUnitPath, oMetaModel, oEntityType);
            assert.ok(result.indexOf(sTextPath) > -1, "A UOM property with Text Annotation should return Text path");
            mockservers.close();
            fnDone();
        });
    });

    QUnit.test('Test formatKPIHeaderState function for v2 cards',function(assert){

        var oDataPoint = {
            Criticality : {
                Path : "product"
            }
        };

        assert.ok(
            AnnotationHelper.formatKPIHeaderState(null, oDataPoint) === "{parts: [{path:'product'}], formatter: 'CardAnnotationhelper.kpiValueCriticality'}",
            "The expression is generated for formatKPIHeaderState."
        );
    });

    QUnit.test('Test formPathForPercentageChange function for v2 cards',function(assert){

        var ctx = new utils.ContextMock({});

        var oDataPoint = {
            "Value": {
                "Path": "GrossAmount",
                "EdmType": "Edm.Decimal"
            },
            "ValueFormat": {
                "NumberOfFractionalDigits": {
                    "Int": "1"
                },
                "RecordType": "com.sap.vocabularies.UI.v1.NumberFormat"
            },
            "TrendCalculation": {
                "ReferenceValue": {
                    "String": "85000"
                }
            }
        };
        
        assert.ok(
            AnnotationHelper.formPathForPercentageChange(ctx, oDataPoint) === `{parts:[{path: 'GrossAmount'}, {value:{"numberOfFractionalDigits":0}, model: 'ovpCardProperties'}], formatter: 'CardAnnotationhelper.returnPercentageChange'}`,
            "The expression is generated for formPathForPercentageChange."
        );

        oDataPoint.TrendCalculation.ReferenceValue.Path = "TaxAmount";
        assert.ok(
            AnnotationHelper.formPathForPercentageChange(ctx, oDataPoint) === `{parts:[{path: 'GrossAmount'}, {path: 'TaxAmount'}, {value:{"numberOfFractionalDigits":0}, model: 'ovpCardProperties'}], formatter: 'CardAnnotationhelper.returnPercentageChange'}`,
            "The expression is generated for formPathForPercentageChange."
        );
    });

    QUnit.test('Test formPathForPercentageChange function for v4 cards',function(assert){

        var ctx = new utils.ContextMock({
            model: {
                oModel: {
                    getODataVersion: function() {
                        return "4.0";
                    }
                }
            },
        });

        var oDataPoint = {
            "Value": {
                "$Path": "GrossAmount",
                "EdmType": "Edm.Decimal"
            },
            "ValueFormat": {
                "NumberOfFractionalDigits": {
                    "Int": "1"
                }
            },
            "TrendCalculation": {
                "ReferenceValue": {
                    "String": "85000"
                }
            }
        };
        
        assert.ok(
            AnnotationHelper.formPathForPercentageChange(ctx, oDataPoint) === `{parts:[{path: 'GrossAmountAgg',type:'sap.ui.model.odata.type.Decimal'}, {value:{"numberOfFractionalDigits":0}, model: 'ovpCardProperties'}], formatter: 'CardAnnotationhelper.returnPercentageChange'}`,
            "The expression is generated for formPathForPercentageChange."
        );

        oDataPoint.TrendCalculation.ReferenceValue.$Path = "TaxAmount";
        assert.ok(
            AnnotationHelper.formPathForPercentageChange(ctx, oDataPoint) === `{parts:[{path: 'GrossAmountAgg',type:'sap.ui.model.odata.type.Decimal'}, {path: 'TaxAmount',type:'sap.ui.model.odata.type.Decimal'}, {value:{"numberOfFractionalDigits":0}, model: 'ovpCardProperties'}], formatter: 'CardAnnotationhelper.returnPercentageChange'}`,
            "The expression is generated for formPathForPercentageChange."
        );
    });

    QUnit.test("Annotation Helper - getKPIHeaderAggregateNumber", function (assert) {
        var iContext = {
            ovpCardProperties: {
                oData: {
                    NumberOfFractionalDigits: 2,
                    percentageAvailable: true
                }
            },
            getSetting: function () {
                return this.ovpCardProperties;
            },
            getModel: function () {
                return {
                    oModel: {
                        getODataVersion: function () {
                            return "4.0";
                        }
                    }
                }
            }
        };
        var oDataPoint = {
            "$Type": "com.sap.vocabularies.UI.v1.DataPointType",
            "Title": "stock",
            "Value": {
                "$Path": "stock"
            },
            "Description": {
                "$Path": "title"
            }
        };
        var sExpectedResult = `{parts:[{path: 'stockAgg'}, {value:{"NumberOfFractionalDigits":2,"percentageAvailable":true}, model: 'ovpCardProperties'}], formatter: 'CardAnnotationhelper.KpiValueFormatter'}`;
        var sResult = AnnotationHelper.getKPIHeaderAggregateNumber(iContext, oDataPoint);
        assert.ok(sResult === sExpectedResult, "Resultant string is formed correctly with path appended with Agg if oDataModel is V4");
        iContext = {
            ovpCardProperties: {
                oData: {
                    NumberOfFractionalDigits: 2,
                    percentageAvailable: true
                }
            },
            getSetting: function () {
                return this.ovpCardProperties;
            },
            getModel: function () {
                return {
                    oModel: {
                        getODataVersion: function () {
                            return "2.0";
                        }
                    }
                }
            }
        };
        oDataPoint = {
            "Title": "stock",
            "Value": {
                "Path": "stock"
            }
        }
        var sExpectedResult = `{parts:[{path: 'stock'}, {value:{"NumberOfFractionalDigits":2,"percentageAvailable":true}, model: 'ovpCardProperties'}], formatter: 'CardAnnotationhelper.KpiValueFormatter'}`;
        var sResult = AnnotationHelper.getKPIHeaderAggregateNumber(iContext, oDataPoint);
        assert.ok(sResult === sExpectedResult, "Resultant string is formed correctly without path appended with Agg if oDataModel is V2");
    });
    
    QUnit.test("Annotation Helper - getAggregateNumber", function (assert) {
        mockservers.loadMockServer(utils.odataBaseUrl_salesOrder, utils.odataRootUrl_salesOrder);
        var cardTestData = {
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations_for_formatItems.xml",
            },
        };
        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();
        var oMetaModel = oModel.getMetaModel();
        oMetaModel.loaded().then(function () {
            var iContext = {
                ovpCardProperties: {
                    getProperty: function (sProperty) {
                        if (sProperty === "/metaModel") {
                            return oMetaModel;
                        } else if (sProperty === '/entityType') {
                            return {
                                property: [
                                    {
                                        "name": "ID",
                                        "type": "Edm.String",
                                        "nullable": "false",
                                        "extensions": [
                                            {
                                                "name": "sortable",
                                                "value": "false",
                                                "namespace": "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name": "filterable",
                                                "value": "false",
                                                "namespace": "http://www.sap.com/Protocols/SAPData"
                                            }
                                        ],
                                        "sap:sortable": "false",
                                        "sap:filterable": "false",
                                        "com.sap.vocabularies.UI.v1.Hidden": {
                                            "Bool": "true"
                                        }
                                    }
                                ]
                            }
                        } else if (sProperty === '/filters') {
                            return [
                                {
                                    "path": "CompanyCode",
                                    "operator": "EQ",
                                    "value1": "1010",
                                    "sign": "I"
                                }
                            ];
                        } else if (sProperty === '/searchQuery') {
                            return 'SP';
                        } else if (sProperty === '/enableOVPCardAsAPI') {
                            return true;
                        }
                    }
                },
                getSetting: function () {
                    return this.ovpCardProperties;
                },
            };
            var oEntitySet = oMetaModel.getODataEntitySet("SalesOrderSet");
            var oDataPoint = {
                "Value": {
                    "Path": "DifferencePercent",
                    "EdmType": "Edm.Decimal"
                },
                "Title": {
                    "String": "Year Over Year"
                },
                "Description": {
                    "String": "Difference to Previous Year Same Quarter"
                },
                "Visualization": {
                    "EnumMember": "com.sap.vocabularies.UI.v1.VisualizationType/Number"
                },
                "ValueFormat": {
                    "ScaleFactor": {
                        "Decimal": "1000"
                    },
                    "NumberOfFractionalDigits": {
                        "Int": "2"
                    }
                }
            };
            var oSelectionVariant = {
                "id": "",
                "parameters": {
                    "P_KeyDate": "2023-09-14T00:00:00Z",
                    "P_NetDueInterval1InDays": "30",
                    "P_NetDueInterval2InDays": "60",
                    "P_NetDueInterval3InDays": "90",
                    "P_DisplayCurrency": "AED",
                    "P_GeneralLedgerValuationArea": "IF"
                },
                "selectOptions": {
                    "CompanyCode": [
                        {
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "1010",
                            "High": null
                        }
                    ]
                }
            };
            var sExpectedResult = `{path: '/SalesOrderSet', length: 1, parameters:{select:'DifferencePercent', custom: {search: 'SP', _requestFrom: 'ovp_internal'}}, filters: [{"path":"CompanyCode","operator":"EQ","value1":"1010","sign":"I"}]}`;
            var sResult = AnnotationHelper.getAggregateNumber(iContext, oEntitySet, oDataPoint, oSelectionVariant);
            assert.ok(
                sResult === sExpectedResult, "Resultant string is formed correctly with the searchQuery passed as custom parameter"
            );
            
            iContext = {
                ovpCardProperties: {
                    getProperty: function (sProperty) {
                        if (sProperty === "/metaModel") {
                            return oMetaModel;
                        } else if (sProperty === '/entityType') {
                            return {
                                property: [
                                    {
                                        "name": "ID",
                                        "type": "Edm.String",
                                        "nullable": "false",
                                        "extensions": [
                                            {
                                                "name": "sortable",
                                                "value": "false",
                                                "namespace": "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name": "filterable",
                                                "value": "false",
                                                "namespace": "http://www.sap.com/Protocols/SAPData"
                                            }
                                        ],
                                        "sap:sortable": "false",
                                        "sap:filterable": "false",
                                        "com.sap.vocabularies.UI.v1.Hidden": {
                                            "Bool": "true"
                                        }
                                    }
                                ]
                            }
                        } else if (sProperty === '/filters') {
                            return [
                                {
                                    "path": "CompanyCode",
                                    "operator": "EQ",
                                    "value1": "1010",
                                    "sign": "I"
                                }
                            ];
                        } else if (sProperty === '/searchQuery') {
                            return undefined;
                        } else if (sProperty === '/enableOVPCardAsAPI') {
                            return false;
                        }
                    }
                },
                getSetting: function () {
                    return this.ovpCardProperties;
                },
            };
            sExpectedResult = `{path: '/SalesOrderSet', length: 1, parameters:{select:'DifferencePercent', custom: {_requestFrom: 'ovp_internal'}}, filters: [{"path":"CompanyCode","operator":"EQ","value1":"1010","sign":"I"}]}`;
            var sResult = AnnotationHelper.getAggregateNumber(iContext, oEntitySet, oDataPoint, oSelectionVariant);
            assert.ok(
                sResult === sExpectedResult, "Resultant string is formed correctly without the searchQuery passed as custom parameter"
            );
            mockservers.close();
            fnDone();
        });
    });

    QUnit.test("checkExists", function (assert) {
        //check for chart annotation type when chart type has enum member and bODataV4 is provided
        var term = "com.sap.vocabularies.UI.v1.Chart#statusKPI";
        var annoatation = {
            "@com.sap.vocabularies.UI.v1.Chart#statusKPI": {
                "$Type": "com.sap.vocabularies.UI.v1.ChartDefinitionType",
                "ChartType": {
                    "$EnumMember": "com.sap.vocabularies.UI.v1.ChartType/ColumnStacked"
                },
                "Measures": [
                    {
                        "$PropertyPath": "hasContract"
                    }
                ],
                "Dimensions": [
                    {
                        "$PropertyPath": "conversionCategeoryName"
                    },
                    {
                        "$PropertyPath": "boardArea"
                    }
                ],
                "MeasureAttributes": [
                    {
                        "$Type": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
                        "Measure": {
                            "$PropertyPath": "hasContract"
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
                            "$PropertyPath": "conversionCategeoryName"
                        },
                        "Role": {
                            "$EnumMember": "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Series"
                        }
                    },
                    {
                        "$Type": "com.sap.vocabularies.UI.v1.ChartDimensionAttributeType",
                        "Dimension": {
                            "$PropertyPath": "boardArea"
                        },
                        "Role": {
                            "$EnumMember": "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category"
                        }
                    }
                ]
            }
        };
        var type = "Chart Annotation";
        var logViewId = "[application-Dashboard-Overview-component---ConvertedStudentsOriginal_Tab1] ";
        var contentFragment = "sap.ovp.cards.v4.charts.analytical.analyticalChart";
        var result = AnnotationHelper.checkExists(term, annoatation, type, true, logViewId, contentFragment, true);
        assert.strictEqual(result, true, "Should return true when term is defined and corresponding annotation exists for the provided term");
    
        //check for identification annotation type when bODataV4 is provided
        term = "com.sap.vocabularies.UI.v1.Identification";
        annoatation = {
            "@com.sap.vocabularies.UI.v1.Identification": [
                {
                    "$Type": "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
                    "SemanticObject": "Conversion",
                    "Action": "Analysis"
                }
            ]
        }
        type = "Identification Annotation";
        result = AnnotationHelper.checkExists(term, annoatation, type, true, logViewId, contentFragment, true);
        assert.strictEqual(result, true, "Should return true when term is defined and corresponding annotation exists for the provided term");

        //check for datapoint annotation type when bODataV4 is provided
        term = "com.sap.vocabularies.UI.v1.DataPoint#contractsSigned";
        annoatation = {
            "@com.sap.vocabularies.UI.v1.DataPoint#contractsSigned": {
                "$Type": "com.sap.vocabularies.UI.v1.DataPointType",
                "Value": {
                    "$Path": "hasContract"
                }
            }
        }
        type = "Data Point";
        result = AnnotationHelper.checkExists(term, annoatation, type, true, logViewId, contentFragment, true);
        assert.strictEqual(result, true, "Should return true when term is defined and corresponding annotation exists for the provided term");

        //check for presentation annotation type when bODataV4 is provided
        term = "com.sap.vocabularies.UI.v1.PresentationVariant#semesters";
        annoatation = {
            "@com.sap.vocabularies.UI.v1.PresentationVariant#semesters": {
                "$Type": "com.sap.vocabularies.UI.v1.PresentationVariantType",
                "SortOrder": [
                    {
                        "$Type": "com.sap.vocabularies.Common.v1.SortOrderType",
                        "Property": {
                            "$PropertyPath": "semester"
                        },
                        "Descending": false
                    }
                ]
            }
        }
        type = "Presentation Variant";
        result = AnnotationHelper.checkExists(term, annoatation, type, false, logViewId, contentFragment, true);
        assert.strictEqual(result, true, "Should return true when term is defined and corresponding annotation exists for the provided term");

        //check for presentation annotation type when the corresponding annotation exists for the term and bODataV4 is not provided
        term = "com.sap.vocabularies.UI.v1.PresentationVariant#semesters";
        annoatation = {
            "@com.sap.vocabularies.UI.v1.PresentationVariant#semesters": {}
        }
        type = "Presentation Variant";
        result = AnnotationHelper.checkExists(term, annoatation, type, false, logViewId, contentFragment);
        assert.strictEqual(result, false, "returns false when term is defined and corresponding annotation exists but bODataV4 is not provided");

        //check for chart annotation type when the corresponding annotation exists for the term and bODataV4 is not provided
        term = "com.sap.vocabularies.UI.v1.Chart#statusKPI";
        var annoatation = {
            "@com.sap.vocabularies.UI.v1.Chart#statusKPI": {
                "$Type": "com.sap.vocabularies.UI.v1.ChartDefinitionType",
                "ChartType": {
                    "$EnumMember": "com.sap.vocabularies.UI.v1.ChartType/ColumnStacked"
                },
                "Measures": [
                    {
                        "$PropertyPath": "hasContract"
                    }
                ],
                "Dimensions": [
                    {
                        "$PropertyPath": "conversionCategeoryName"
                    },
                    {
                        "$PropertyPath": "boardArea"
                    }
                ]
            }
        };
        type = "Chart Annotation";
        result = AnnotationHelper.checkExists(term, annoatation, type, true, logViewId, contentFragment);
        assert.strictEqual(result, false, "returns false when term is defined and corresponding annotation exists but bODataV4 is not provided");
    });
});
