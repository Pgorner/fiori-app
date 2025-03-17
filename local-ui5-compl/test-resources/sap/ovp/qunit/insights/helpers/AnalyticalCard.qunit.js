sap.ui.define([
    "sap/ovp/insights/helpers/AnalyticalCard",
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/mockservers",
    "sap/ovp/insights/helpers/Batch",
    "test-resources/sap/ovp/qunit/cards/charts/utils",
    "sap/ovp/cards/charts/VizAnnotationManager",
    "sap/ovp/helpers/ODataAnnotationHelper",
], function (
    AnalyticalCard,
    Utils,
    mockservers,
    BatchHelper,
    ChartUtils,
    OvpVizAnnotationManager,
    ODataAnnotationHelper,
) {
    "use strict";
    QUnit.module("sap.ovp.insights.helpers.AnalyticalCard", {
        beforeEach: function () {
            mockservers.loadMockServer(Utils.odataBaseUrl_salesShare, Utils.odataRootUrl_salesShare);
        },
        afterEach: function () {
            mockservers.close();
        },
    });

    QUnit.test("AnalyticalCardHelper - createChartContent - validate created chart content.", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_28",
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

            var oSapCard = {
                configuration: {
                    parameters: {}
                }
            };
            var getRequestUrlAndEntityInfoStub = sinon.stub(BatchHelper, "_getRequestUrlAndEntityInfo").returns({
                sPath: "SalesShareColumnStacked?$orderby=Region%20asc",
                _entitySet: {
                    value: "SalesShareColumnStacked"
                },
                _urlSuffix: {
                    value: ""
                }
            });
            var oEntityModel = oView.getModel();
            var oSettings = oCardDefinition.cardComponentData.settings;

            var oChartAnnotation = ODataAnnotationHelper.getRecords(oCardDefinition.entityType, oSettings.chartAnnotationPath, oEntityModel);
            var sTitle = oChartAnnotation.Title && oChartAnnotation.Title.String;

            var oChartContent = AnalyticalCard.createChartContent(oCardDefinition, oSettings.chartAnnotationPath, oSapCard);

            assert.deepEqual(oChartContent.chartType, oCardViz.getVizType(), "checking chart-type value");
            assert.deepEqual(oChartContent.title.text, sTitle, "checking for chart title value");
            assert.ok(
                oChartContent.title.visible == true,
                "Check if title is visible"
            );
            assert.deepEqual(oChartContent.dimensions.length, 1, "chart is having dimension as per configuration");

            assert.deepEqual(oChartContent.measures.length, oCardViz.getDataset().getMeasures().length, "chart is having measures as per configuration");
            assert.deepEqual(oChartContent.feeds.length, oCardViz.getFeeds().length, "chart is having feeds as per configuration");

            assert.deepEqual(oChartContent.dimensions[0].label, oCardViz.getDataset().getDimensions()[0].getName(), "checking dimensions value according to the entityset");
            assert.ok(
                oChartContent.measures[2].label === oCardViz.getDataset().getMeasures()[2].getName(),
                "Check if measure is being considered"
            );
            assert.ok(
                oCardViz.getVizProperties()["legend"].itemMargin === 1.25,
                "legends are set with the correct item margin"
            );
            getRequestUrlAndEntityInfoStub.restore();

            fnDone();
        });
    })
});
