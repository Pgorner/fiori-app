/*global QUnit*/

sap.ui.define([
    "test-resources/sap/ovp/Mockserver/MockServerHelper",
    "sap/ui/model/json/JSONModel",
    "sap/ovp/cards/v4/V4AnnotationHelper"
], function (MockServerHelper, JSONModel, V4AnnotationHelper) {
    "use strict";

    var oConfig, oConfig1;
    var oUIModel = new JSONModel();
    var oData = {
        showDateInRelativeFormat: true,
        disableTableCardFlexibility: false,
    };
    oUIModel.setData(oData);
    var errorReason = {
        mParameters: {
            response: {
                errorStatusCode: "404",
                errorStatusText: "Not found",
                responseText: "",
            },
        },
    };
    var oMainComponent = {
        _getCardFromManifest: function () {
            return {
                template: "sap.ovp.cards.v4.charts.analytical",
            };
        },
        getOwnerComponent: function() {
            return {
                getComponentData: function() {
                    return {
                        "ovpCardsAsApi": false
                    }
                }
            }
        },
        getGlobalFilter: function() {},
        getMacroFilterBar: function() {}
    };

    QUnit.module("sap.ovp.qunit.cards.v4.generic.component", {
      beforeEach: function () {
            oConfig = {
                model: "CATALOG_MODEL_V4",
                template: "sap.ovp.cards.v4.charts.analytical",
                settings: {
                    title: "Most Popular Products V4",
                    description: "In the last six months",
                    entitySet: "Books",
                    chartAnnotationPath: "@com.sap.vocabularies.UI.v1.Chart#donutchart",
                    kpiAnnotationPath: "@com.sap.vocabularies.UI.v1.KPI#AllActualCosts",
                    selectionPresentationAnnotationPath:
                        "com.sap.vocabularies.UI.v1.SelectionPresentationVariant#BothSelectionAndPresentation",
                },
                id: "card010",
                showDateInRelativeFormat: false,
                disableTableCardFlexibility: true,
            };
            oConfig1 = {
                model: "CATALOG_MODEL_V4",
                template: "sap.ovp.cards.v4.charts.analytical",
                containerLayout: "resizable",
                settings: {
                    title: "Most Popular Products V4",
                    description: "In the last six months",
                    entitySet: "Books",
                    chartAnnotationPath: "@com.sap.vocabularies.UI.v1.Chart#donutchart",
                    kpiAnnotationPath: "@com.sap.vocabularies.UI.v1.KPI#AllActualCosts",
                    selectionPresentationAnnotationPath:
                        "@com.sap.vocabularies.UI.v1.SelectionPresentationVariant#BothSelectionAndPresentation",
                },
                id: "card010",
                showDateInRelativeFormat: false,
                disableTableCardFlexibility: true,
            };
        },
        afterEach: function () {
            MockServerHelper.closeServer();
        },
    });

    QUnit.test("function setSelectionVariant, setPresentationVariant, setDataPointAnnotationPath, getPreprocessors  - v4GenericComponent", function (assert) {
        var fnDone = assert.async()
        MockServerHelper.startServer().then(function (oModel) {
            MockServerHelper.createXMLView(oConfig, oModel).then(function (oView) {
                var oComponent = oView.getController().oCardComponent;
                var oResult = {};
                oComponent.setSelectionVariant(undefined, oResult);
                assert.ok(oResult.selectionAnnotationPath === undefined, "sele");

                var sPath = "@com.sap.vocabularies.UI.v1.SelectionVariant#View1";
                oComponent.setSelectionVariant(sPath, oResult, true);
                assert.ok(
                    oResult.selectionAnnotationPath === sPath.slice(1),
                    "function setSelectionVariant called for v4GenericComponent"
                );

                sPath = "@com.sap.vocabularies.UI.v1.PresentationVariant#amount";
                var oSettings = {};
                var oEntityType = oView.getModel().getMetaModel().getData()["$Annotations"]["CatalogService.Books"];
                oEntityType["$Type"] = oEntityType;
                oEntityType[
                    "@com.sap.vocabularies.UI.v1.PresentationVariant#amount"
                ].Visualizations[0].AnnotationPath = "@com.sap.vocabularies.UI.v1.Chart#Eval_by_Combination";
                oComponent.setPresentationVariant(sPath, oSettings, oEntityType, true);
                assert.ok(
                    oSettings.chartAnnotationPath === "com.sap.vocabularies.UI.v1.Chart#Eval_by_Combination",
                    "chart annotation path formed correctly"
                );
                assert.ok(
                    oSettings.presentationAnnotationPath ===
                    "@com.sap.vocabularies.UI.v1.PresentationVariant#amount",
                    "presentation annotation path formed correctly"
                );

                sPath = "@com.sap.vocabularies.UI.v1.DataPoint#View1";
                oComponent.setDataPointAnnotationPath(sPath, oResult);
                assert.ok(
                    oResult.dataPointAnnotationPath === sPath.slice(1),
                    "function setSelectionVariant called for v4GenericComponent"
                );

                oComponent.oComponentData.errorReason = errorReason;
                oComponent.oComponentData.mainComponent = oMainComponent;
                oComponent.oComponentData.appComponent.getModel = function () {
                    return oUIModel;
                };
                // Need to change / handle the oSettings && oSettings.kpiAnnotationPath in component for now adding entity type directly for v4 cards, also need to take care of @
                // Default annotations are not considered
                oComponent.oComponentData.settings.entitySet = "CatalogService.Books/@";
                var oEntityAnnotation = oView.getModel().getMetaModel().getObject("/CatalogService.Books/@");
                oEntityAnnotation["com.sap.vocabularies.UI.v1.KPI#AllActualCosts"] =
                    oEntityAnnotation["@com.sap.vocabularies.UI.v1.KPI#AllActualCosts"];
                oEntityAnnotation["com.sap.vocabularies.UI.v1.KPI#AllActualCosts"]["Detail"][
                    "DefaultPresentationVariant"
                ].Visualizations = [{ AnnotationPath: "@UI.Chart#Eval_by_Combination" }];
                oComponent.getPreprocessors(oComponent);
                assert.ok(
                    oSettings.chartAnnotationPath === "com.sap.vocabularies.UI.v1.Chart#Eval_by_Combination",
                    "chart annotation path formed correctly"
                );
                assert.ok(
                    oSettings.presentationAnnotationPath ===
                    "@com.sap.vocabularies.UI.v1.PresentationVariant#amount",
                    "presentation annotation path formed correctly"
                );

                oComponent.oComponentData.appComponent.getModel = function (sPath) {
                    return {
                        getProperty: function () {
                            return [];
                        },
                    };
                };

                assert.ok(
                    oComponent.oComponentData.settings.idForExternalFilters === undefined,
                    "Id for external filters not available"
                );
                //Commenting the below as kpiAnnotationPath needs to be handled for V4 as the below wouldn't be valid until handled correctly.
                // oComponent.oComponentData.ovpCardsAsApi = false;
                // oComponent.oComponentData.settings.selectionAnnotationPath = "test";
                // oEntityAnnotation["test"] = {
                //     SelectOptions: [{}, {}],
                // };
                // oComponent.getPreprocessors(oComponent);
                
                // assert.ok(
                //     oEntityAnnotation["test"].SelectOptions[0].id === "headerFilterText--1",
                //     "Id for header filter text formed"
                // );
                oComponent.oComponentData.settings.kpiAnnotationPath = false;
                oComponent.oComponentData.showDateInRelativeFormat = true;
                oComponent.oComponentData.disableTableCardFlexibility = true;
                oComponent.oComponentData.ovpCardsAsApi = true;
                oComponent.oComponentData.settings.filters = [{}, {}];
                oComponent.oComponentData.settings.ignoreSelectionVariant = true;
                oComponent.oComponentData.settings.entitySet = "Books";
                var oEntityAnnotation = oView.getModel().getMetaModel().getObject("Books");
                oComponent.getPreprocessors(oComponent);
                assert.ok(
                    oComponent.oComponentData.settings.idForExternalFilters.length === 2,
                    "Id for external filters available"
                );
                fnDone();
            });
        });
    });

    QUnit.test("function _completeLayoutDefaults  - v4GenericComponent", function (assert) {
        var fnDone = assert.async();
        MockServerHelper.startServer().then(function (oModel) {
            MockServerHelper.createXMLView(oConfig1, oModel).then(function (oView) {
                var oComponent = oView.getController().oCardComponent;
                var ocardProps = oView.getModel("ovpCardProperties").getData();
                oComponent.oComponentData.appComponent.getOvpConfig = function () {
                    return {
                        containerLayout: "resizable",
                    };
                };
                oComponent.oComponentData.appComponent.getDashboardLayoutUtil = function () {
                    return {
                        aCards: [
                            {
                                id: "card010",
                                dashboardLayout: {
                                    containerLayout: "",
                                    iRowHeightPx: "",
                                    iCardBorderPx: "",
                                    headerHeight: 2,
                                },
                            },
                        ],
                        ROW_HEIGHT_PX: 2,
                        CARD_BORDER_PX: 3,
                        headerHeight: 2,
                    };
                };
                var output = oComponent._completeLayoutDefaults(ocardProps, oComponent.oComponentData.settings);
                output = output.cardLayout;
                assert.ok(output.containerLayout === "resizable", "Contaiiner layout is set resizable");
                assert.ok(output.iRowHeightPx === 2, "row height is set to 2 px");
                assert.ok(output.iCardBorderPx === 3, "card border is 3 px");
                assert.ok(output.headerHeight === 2, "header height is set to 2 px");

                // oComponent.oComponentData = "CATALOG_MODEL_V4";
                oComponent.oComponentData.cardId = "card011";
                oView.getModel().bUseBatch = true;
                oComponent._getCacheKeys = function () {
                    return [{}];
                };
                oComponent.oComponentData.appComponent.getOvpConfig = function () {
                    return undefined;
                };
                oComponent.createContent();
                fnDone();
            });
        });
    });
});
