// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/MessageToast",
    "sap/ushell/playground/controller/BaseController",
    "sap/ushell/resources",
    "sap/ui/core/Component",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "../testData/NewContentFinder/ContentFinderModel"
], function (
    MessageToast,
    BaseController,
    resources,
    Component,
    Filter,
    FilterOperator,
    JSONModel,
    ContentFinderModel
) {
    "use strict";

    return BaseController.extend("sap.ushell.playground.controller.ContentFinder", {

        onInit: function () {
            const oModel = new JSONModel();
            oModel.setData({
                settings: {
                    enablePersonalization: true,
                    noItemsInCatalogDescription: "",
                    showAppBoxFieldsPlaceholder: true,
                    showCategoryTreeWhenEmpty: false,
                    showApplicationLaunchButton: false
                }
            });
            this.getView().setModel(oModel, "component");
            this.getView().setModel(ContentFinderModel);
            this.oVisualizations = ContentFinderModel.getProperty("/vizData");
            this.oContextData = ContentFinderModel.getProperty("/contextData");
            this.aCategoryTree = ContentFinderModel.getProperty("/categoryTree");
        },

        _createContentFinder: function (oSettings) {
            const oContentFinderPromise = Component.create({
                name: "sap.ushell.components.contentFinder.dialog",
                settings: oSettings,
                componentData: {
                    visualizationFilters: {
                        displayed: ["tiles", "cards"],
                        selected: "tiles",
                        available: [
                            {
                                key: "tiles",
                                title: "Tiles",
                                types: ["sap.ushell.StaticAppLauncher", "sap.ushell.DynamicAppLauncher"]
                            },
                            {
                                key: "cards",
                                title: "Cards",
                                types: ["sap.card"]
                            }
                        ]
                    }
                }
            });

            oContentFinderPromise.then((oContentFinder) => {
                oContentFinder.attachVisualizationFilterApplied(null, this._setVisualizations, oContentFinder);
                oContentFinder.attachVisualizationsAdded(null, this._showEventData, this);
                oContentFinder.attachWidgetSelected(null, this._showEventData, this);
            });

            return oContentFinderPromise;
        },

        _setVisualizations: function (oEvent) {
            const aVizTypes = oEvent.getParameter("types");
            const sSearchTerm = oEvent.getParameter("search") || "";

            const oVizListBinding = ContentFinderModel.bindList("/vizData/visualizations/nodes");
            const fnNewFilter = function (sPath) {
                return new Filter({
                    path: sPath,
                    operator: FilterOperator.Contains,
                    value1: sSearchTerm
                });
            };

            oVizListBinding.filter(
                new Filter({
                    filters: [
                        new Filter({
                            filters: [
                                fnNewFilter("descriptor/value/sap.app/title"),
                                fnNewFilter("descriptor/value/sap.app/subTitle")
                            ],
                            and: false
                        }),
                        new Filter({
                            filters: aVizTypes.map(function (sType) {
                                return new Filter({
                                    path: "type",
                                    operator: FilterOperator.EQ,
                                    value1: sType
                                });
                            }),
                            and: false
                        })
                    ],
                    and: true
                })

            );

            const oViz = {
                visualizations: {
                    nodes: oVizListBinding.getCurrentContexts().map(function (oContext) {
                        return oContext.getObject();
                    }),
                    totalCount: oVizListBinding.getCurrentContexts().length
                }
            };

            this.setVisualizationData(oViz);
        },

        openTilesAppSearch: function () {
            const oSettings = this.getView().getModel("component").getProperty("/settings");
            this.oContentFinderTilesPromise = this.oContentFinderTilesPromise || this._createContentFinder(oSettings);
            this.oContentFinderTilesPromise.then((oContentFinder) => {
                oContentFinder.applySettings(oSettings);
                oContentFinder.show();
            });
        },

        openTilesAppSearchWithContextData: function () {
            const oSettings = this.getView().getModel("component").getProperty("/settings");
            this.oContentFinderTilesWithContextPromise = this.oContentFinderTilesWithContextPromise || this._createContentFinder(oSettings);
            this.oContentFinderTilesWithContextPromise.then((oContentFinder) => {
                oContentFinder.applySettings(oSettings);
                oContentFinder.setContextData(this?.oContextData);
                oContentFinder.show();
            });
        },

        openTilesAppSearchWithCategoryTree: function () {
            const oSettings = this.getView().getModel("component").getProperty("/settings");
            this.oContentFinderTilesWithCategoryTreePromise = this.oContentFinderTilesWithCategoryTreePromise || this._createContentFinder(oSettings);
            this.oContentFinderTilesWithCategoryTreePromise.then((oContentFinder) => {
                oContentFinder.applySettings(oSettings);
                oContentFinder.setCategoryTree(this?.aCategoryTree);
                oContentFinder.show();
            });
        },

        _showEventData: function (oEvent) {
            var oEventIdText = this.byId("eventId");
            var sEventId = oEvent.getId();
            oEventIdText.setText(sEventId);

            var oCodeEditor = this.byId("eventData");
            oCodeEditor.setValue(JSON.stringify(oEvent.getParameters(), null, 4));
            oCodeEditor.prettyPrint();

            MessageToast.show("Event \"" + sEventId + "\" fired and handled.", {
                duration: 3000,
                of: this.byId("eventForm"),
                my: "center center",
                at: "center center",
                closeOnBrowserNavigation: false
            });
        },

        onPressClear: function () {
            this.byId("eventId").setText("-");
            this.byId("eventData").setValue("");
        }
    });
});


// Type for the CodeEditor ("Two-Way-Formatter")
sap.ui.require([
    "sap/ui/model/SimpleType"
], function (SimpleType) {
    "use strict";
    return SimpleType.extend("sap.ushell.playground.contentFinder.JSONType", {
        formatValue: function (sValue) {
            return JSON.stringify(sValue, null, 4);
        },
        parseValue: JSON.parse,
        validateValue: function () {
            return true;
        }
    });
});
