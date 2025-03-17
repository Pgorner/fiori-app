/*global QUnit*/
sap.ui.define([
    "sap/ovp/insights/helpers/CardHeader",
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/mockservers",
    "sap/ovp/insights/helpers/Batch",
    "test-resources/sap/ovp/qunit/cards/charts/utils",
    "sap/ovp/cards/charts/VizAnnotationManager",
    "sap/ovp/helpers/ODataAnnotationHelper",
], function (
    CardHeader,
    Utils,
    mockservers,
    BatchHelper,
    ChartUtils,
    OvpVizAnnotationManager,
    ODataAnnotationHelper,
) {
    "use strict";
    QUnit.module("sap.ovp.insights.helpers.CardHeader", {
        beforeEach: function () {
            mockservers.loadMockServer(Utils.odataBaseUrl_salesShare, Utils.odataRootUrl_salesShare);
        },
        afterEach: function () {
            mockservers.close();
        },
    });

    QUnit.test("Test function generateDetailsExpression  of CardHeader when description is present", function (assert) {
        //oCardManifest.data.request.batch.header
        var oCardManifest = {
            "configuration" : {
                "parameters": {}
            },
            "data" : {
                "request" : {
                    "batch" : {
                        "header" : {}
                    }
                }
            }
        };
        var oCardSetting = {
            "description": "{{descriptionText}}"
        };
        var sCardId = "card01";
        var index = 0;
        var headerDetailsExpression = CardHeader.generateDetailsExpression(oCardManifest, oCardSetting, sCardId, index);
        assert.ok(headerDetailsExpression === "{{descriptionText}}", "The Card header details expression is generated correctly");
    });

    QUnit.test("Test function generateDetailsExpression  of CardHeader when valueSelectionInfo is present", function (assert) {
        var oCardManifest = {
            "configuration" : {
                "parameters": {}
            },
            "data" : {
                "request" : {
                    "batch" : {
                        "header" : {}
                    }
                }
            }
        };
        var oCardSetting = {
            "valueSelectionInfo": "{{descriptionText}}"
        };
        var sCardId = "card01";
        var index = 0;
        var headerDetailsExpression = CardHeader.generateDetailsExpression(oCardManifest, oCardSetting, sCardId, index);
        assert.ok(headerDetailsExpression === "{{descriptionText}}", "The Card header details expression is generated correctly");
    });

    QUnit.test("Test function generateDetailsExpression  of CardHeader when description and valueSelectionText both are present", function (assert) {
        var oCardManifest = {
            "configuration" : {
                "parameters": {}
            },
            "data" : {
                "request" : {
                    "batch" : {
                        "header" : {}
                    }
                }
            }
        };
        var oCardSetting = {
            "description": "{{descriptionText}}",
            "tabs": [
                {
                    "value" : "{{valueSelectionText}}"
                }
            ]
        };
        var sCardId = "card01";
        var index = 1;
        var headerDetailsExpression = CardHeader.generateDetailsExpression(oCardManifest, oCardSetting, sCardId, index);
        assert.ok(oCardManifest.configuration.parameters._detailsString1.value === "{{descriptionText}}", "The Description is first details string");
        assert.ok(oCardManifest.configuration.parameters._detailsString2.value === "{{valueSelectionText}}", "The valueSelectionText is second details string");
        assert.ok(headerDetailsExpression === "{{parameters._detailsString1}} | {{parameters._detailsString2}}", "The Card header details expression is generated correctly");
    });

    QUnit.test("Test function generateDetailsExpression  of CardHeader when valueSelectionInfo and valueSelectionText both are present", function (assert) {
        var oCardManifest = {
            "configuration" : {
                "parameters": {}
            },
            "data" : {
                "request" : {
                    "batch" : {
                        "header" : {}
                    }
                }
            }
        };
        var oCardSetting = {
            "valueSelectionInfo": "{{descriptionText}}",
            "tabs": [
                {
                    "value" : "{{valueSelectionText}}"
                }
            ]
        };
        var sCardId = "card01";
        var index = 1;
        var headerDetailsExpression = CardHeader.generateDetailsExpression(oCardManifest, oCardSetting, sCardId, index);
        assert.ok(oCardManifest.configuration.parameters._detailsString1.value === "{{descriptionText}}", "The Description is first details string");
        assert.ok(oCardManifest.configuration.parameters._detailsString2.value === "{{valueSelectionText}}", "The valueSelectionText is second details string");
        assert.ok(headerDetailsExpression === "{{parameters._detailsString1}} | {{parameters._detailsString2}}", "The Card header details expression is generated correctly");
    });

    QUnit.test("Test function generateDetailsExpression  of CardHeader when valueSelectionInfo, description and valueSelectionText both are present", function (assert) {
        var oCardManifest = {
            "configuration" : {
                "parameters": {}
            },
            "data" : {
                "request" : {
                    "batch" : {
                        "header" : {}
                    }
                }
            }
        };
        var oCardSetting = {
            "valueSelectionInfo": "{{descriptionText}}",
            "description": "{{descriptionText1}}",
            "tabs": [
                {
                    "value" : "{{valueSelectionText}}"
                }
            ]
        };
        var sCardId = "card01";
        var index = 1;
        var headerDetailsExpression = CardHeader.generateDetailsExpression(oCardManifest, oCardSetting, sCardId, index);
        assert.ok(oCardManifest.configuration.parameters._detailsString1.value === "{{descriptionText}}", "The Description is first details string");
        assert.ok(oCardManifest.configuration.parameters._detailsString2.value === "{{valueSelectionText}}", "The valueSelectionText is second details string");
        assert.ok(headerDetailsExpression === "{{parameters._detailsString1}} | {{parameters._detailsString2}}", "The Card header details expression is generated correctly");
    });

    QUnit.test("Test function generateDetailsExpression  of CardHeader when valueSelectionInfo and description are present and KPI header is not present", function (assert) {
        var oCardManifest = {
            "configuration" : {
                "parameters": {}
            },
            "data" : {
                "request" : {
                    "batch" : {
                    }
                }
            }
        };
        var oCardSetting = {
            "valueSelectionInfo": "{{valueSelectionText}}",
            "description": "{{descriptionText}}"
        };
        var sCardId = "card01";
        var index = 0;
        var headerDetailsExpression = CardHeader.generateDetailsExpression(oCardManifest, oCardSetting, sCardId, index);
        assert.ok(headerDetailsExpression === "{{descriptionText}}", "The Card header details expression is generated correctly");
    });

    QUnit.test("CardHeader - validate created chart header content.", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_26",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Test_Forecast",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr",
                }
            },
            dataSource: {
                baseUrl: ChartUtils.odataBaseUrl,
                rootUri: ChartUtils.odataRootUrl,
                annoUri: ChartUtils.testBaseUrl + "data/salesshare/annotations.xml",
            }
        };
        var oModel = Utils.createCardModel(cardTestData);
        var fnDone = assert.async();
        Utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oCardController = oView.getController();
            var oCardViz = oView.byId("analyticalChart");

            oCardController.vizFrame = oCardViz;
            var oHandler = oCardViz && oCardViz.getParent();
            var oController = {
                getView: function () {
                    return null;
                },
                getOwnerComponent: function () {
                    return null;
                },
            };
            OvpVizAnnotationManager.buildVizAttributes(oCardViz, oHandler, oController);

            oView.getController().oMainComponent = {
                getGlobalFilter: function () {
                    return null;
                }
            };
            oView.getController().oCardComponentData.mainComponent = oView.getController().oMainComponent;
            var oCardComponentData = oCardController.oCardComponentData;
            var oCardDefinition = {
                vizFrame: oCardController.vizFrame,
                entitySet: "SalesShareDonut",
                entityType: oCardController.getEntityType(),
                cardComponentName: "Analytical",
                cardComponentData: oCardComponentData,
                cardComponent: oCardController.oCardComponent,
                view: oView
            };

            var sHeaderType = CardHeader.getHeaderDetails(oCardDefinition);
            var oMainIndicator = CardHeader.mainIndicatorDetails(oCardDefinition);
            var sMainIndicatorNumber = CardHeader.mainIndicatorNumberPath(oMainIndicator.path, oMainIndicator.ovpProp);
            var oTargetValue = oMainIndicator.target;
            var oDeviationValue = oMainIndicator.deviation;
          
           var sTargetPath = CardHeader.targetDeviationValuePath(
                oTargetValue,
                oCardDefinition.view.getModel("ovpCardProperties"),
                "targetValueFormatter"
            );
            var  sDeviationPath = CardHeader.targetDeviationValuePath(
                oDeviationValue,
                oCardDefinition.view.getModel("ovpCardProperties"),
                "returnPercentageChange"
            );

            assert.deepEqual(sHeaderType, "Numeric", "checking analytical-chart header value type");

            assert.ok(oMainIndicator.hasOwnProperty("deviation"), "checking for deviation is added to the mainIndicator");
            assert.ok(oMainIndicator.hasOwnProperty("indicator"), "checking for chart main-indicator is having indicator as per configuration")

            assert.deepEqual(oMainIndicator.ovpProp.NumberOfFractionalDigits, 0, "checking for chart main-indicator is having ovpProp as per configuration");
            assert.ok(oMainIndicator.hasOwnProperty("path"), "checking for chart main-indicator is having path as per configuration")

            assert.deepEqual(oMainIndicator.target.parts.length, 2, "chart main-indicator has target set as per the configuration");
            assert.ok(oMainIndicator.hasOwnProperty("valueColor"), "check for valueColor is added to the mainIndicator");

            assert.ok(sMainIndicatorNumber === "{= extension.formatters.kpiformatter(${TotalSales},{NumberOfFractionalDigits:0, percentageAvailable:false})}", "check for mainIndicatorNumber, should have all the parameter passed to it.");

            assert.ok(sTargetPath === "{= extension.formatters.targetValueFormatter(${TotalSales},null,{NumberOfFractionalDigits:undefined, manifestTarget:21230000})}", "checking target path for card header for targetValueFormatter");

            assert.ok(sDeviationPath === "{= extension.formatters.returnPercentageChange(${TotalSales},null,{NumberOfFractionalDigits:undefined, manifestTarget:21230000})}", "checking deviation path for card header for targetValueFormatter");

            assert.ok(
                oCardViz.getVizProperties()["legend"].itemMargin === 1.25,
                "legends are set with the correct item margin"
            );
            fnDone();
        });
    })

});
