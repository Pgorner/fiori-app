// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * This OPA journey will test the WorkPageBuilder via edit mode.
 */
sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/opa/testSiteData/ContentFinder/ContentFinderVisualizations",
    "sap/ushell/opa/testSiteData/ContentFinder/ContentFinderVisualizationsFiltered",
    "sap/ushell/opa/testSiteData/WorkPageBuilder/WorkPageData",
    "sap/ushell/opa/testSiteData/WorkPageBuilder/vizTypes/StaticTile",
    "sap/ushell/opa/testSiteData/WorkPageBuilder/vizTypes/DynamicTile",
    "sap/ui/core/Component",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/thirdparty/sinon-4",
    "sap/base/util/deepExtend",
    "sap/ushell/opa/utils/ContentFinder/VisualizationFiltering",
    "sap/ui/integration/library",
    "sap/ui/integration/widgets/Card",
    "sap/ushell/Container",
    "sap/ui/core/library",
    "sap/ushell/opa/tests/workPageBuilder/pages/EditMode"
], function (
    opaTest,
    oVisualizationData,
    aFilteredVisualizationData,
    WorkPageData,
    StaticAppLauncher,
    DynamicAppLauncher,
    Component,
    ResourceModel,
    sinon,
    deepExtend,
    VisualizationFiltering,
    integrationLibrary,
    IntegrationWidgetsCard,
    Container,
    library
) {
    "use strict";

    // shortcut for sap.ui.core.MessageType
    const MessageType = library.MessageType;

    // shortcut for sap.integration.CardDataMode
    const CardDataMode = integrationLibrary.CardDataMode;

    /* global QUnit */
    var sandbox = sinon.createSandbox({});

    IntegrationWidgetsCard.prototype.getDataMode = function () {
        return CardDataMode.Active;
    };

    const oResourceBundleContentFinder = new ResourceModel({
        bundleUrl: sap.ui.require.toUrl("sap/ushell/components/contentFinder/resources/resources.properties")
    }).getResourceBundle();

    QUnit.module("WorkPageBuilder", {
        beforeEach: function () {
            return Container.init("local").then(function () {
                this.oCDMService = {
                    getApplications: sandbox.stub().resolves({}),
                    getVizTypes: sandbox.stub().resolves({
                        "sap.ushell.StaticAppLauncher": StaticAppLauncher,
                        "sap.ushell.DynamicAppLauncher": DynamicAppLauncher
                    })
                };
                sandbox.stub(Container, "getServiceAsync").callThrough().withArgs("CommonDataModel").resolves(this.oCDMService);
            }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    opaTest("The WorkPage is loaded in previewMode", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.workPageBuilder",
                id: "workPageBuilderComponent",
                componentData: {}
            }
        }).then(function () {
            var oComponent = Component.getComponentById("workPageBuilderComponent");
            oComponent.setPreviewMode(true);
            oComponent.setPageData(deepExtend({}, WorkPageData));
        });

        Then.inEditMode.iSeeCardsInPreviewMode();

        Then.iTeardownMyUIComponent();
    });

    opaTest("The WorkPage is loaded in edit mode and displays the IllustrationMessage if empty", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.workPageBuilder",
                id: "workPageBuilderComponent",
                componentData: {}
            }
        }).then(function () {
            var oComponent = Component.getComponentById("workPageBuilderComponent");
            oComponent.setEditMode(true);
            oComponent.setPageData({
                workPage: {
                    id: "wp0001",
                    contents: {
                        id: "wp0001",
                        rows: []
                    }
                }
            });
        });
        Then.inEditMode.iSeeTheEmptyIllustration("Empty Page", "This page does not contain any sections yet.");
        Then.iTeardownMyUIComponent();
    });

    opaTest("The WorkPage is loaded in edit mode and does not display the footer bar", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.workPageBuilder",
                id: "workPageBuilderComponent",
                componentData: {}
            }
        }).then(function () {
            var oComponent = Component.getComponentById("workPageBuilderComponent");
            oComponent.setEditMode(true);
        });
        Then.inEditMode.iSeeTheFooterBar(false);
        Then.iTeardownMyUIComponent();
    });

    opaTest("The WorkPage is loaded in edit mode and displays the given rows and the footer bar", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.workPageBuilder",
                id: "workPageBuilderComponent",
                componentData: {}
            }
        }).then(function () {
            var oComponent = Component.getComponentById("workPageBuilderComponent");
            oComponent.setEditMode(true);
            oComponent.setPageData({
                workPage: {
                    id: "wp0001",
                    contents: {
                        id: "wp0001",
                        rows: [{
                            id: "row0",
                            descriptor: { value: { title: "Section" } },
                            columns: []
                        }]
                    }
                }
            });
        });
        When.inEditMode.iToggleTheFooterBar(true);
        Then.inEditMode.iSeeTheRowWithProperties(
            { editMode: true },
            { value: "Section", editable: true, visible: true }
        );
        Then.inEditMode.iSeeTheFooterBar(true);
        Then.inEditMode.iSeeTheFooterBarAndSaveButton();
        Then.inEditMode.iSeeTheRowToolbarButton(/workPageDeleteButton/);
        Then.inEditMode.iSeeTheRowAddButtons(2);
        Then.iTeardownMyUIComponent();
    });

    opaTest("The WorkPage is loaded in edit mode and displays the given visualizations", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.workPageBuilder",
                id: "workPageBuilderComponent",
                componentData: {}
            }
        }).then(function () {
            var oComponent = Component.getComponentById("workPageBuilderComponent");
            oComponent.setEditMode(true);
            oComponent.setPageData(deepExtend({}, WorkPageData));
        });
        Then.inEditMode.iSeeTileWithProperties({
            header: "Capital Projects",
            subheader: "All about Finance"
        });
        Then.inEditMode.iSeeTileWithProperties({
            header: "I am hungry",
            subheader: "lets eat"
        });
        Then.inEditMode.iSeeTileWithProperties({
            header: "Translate Evaluation Templates",
            subheader: "Evaluation"
        });
        Then.inEditMode.iSeeTileWithProperties({
            header: "Monitor Purchase Requisition Items"
        });

        Then.iTeardownMyUIComponent();
    });

    /**
     * Tests all available Page builder interaction options:
     * - Add row
     * - Delete row
     * - Add column
     * - Resize column
     * - Delete column
     * - Add Content
     */
    opaTest("The WorkPage is loaded in edit mode and its UI is manipulated", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.workPageBuilder",
                id: "workPageBuilderComponent",
                componentData: {}
            }
        }).then(() => {
            var oComponent = Component.getComponentById("workPageBuilderComponent");
            // Set zoom level to 0.5 to make resizing of WorkPageColumns work
            oComponent.getRootControl().getDomRef().style.zoom = 0.5;
            oComponent.setEditMode(true);
            oComponent.setPageData({
                workPage: {
                    id: "wp0001",
                    contents: {
                        id: "wp0001",
                        descriptor: { value: { title: "TEST PAGE" } },
                        rows: []
                    }
                }
            });

            oComponent.attachEvent("visualizationFilterApplied", (event) => {
                let oParameters = event.getParameters();
                oComponent.setVisualizationData(VisualizationFiltering.filterVisualizations(oVisualizationData, oParameters.types, oParameters.search));
            });
        });

        //Add First Row
        When.inEditMode.iPressTheAddFirstRowButton();
        Then.inEditMode.iSeeANumberOfRows(1);
        Then.inEditMode.iSeeThePageTitle("TEST PAGE");
        Then.inEditMode.iSeeANumberOfColumns(0, 1);

        //Content Finder
        When.inEditMode.iPressAddWidgetButton(0, 0);
        Then.inEditMode.iSeeTheContentFinderDialog();
        Then.inEditMode.iSeeContentFinderTitle(oResourceBundleContentFinder.getText("ContentFinder.Dialog.Title"));

        When.inEditMode.iEnterTextinAppBoxSearch("My Leave Request");
        Then.inEditMode.iSeeTheAppBoxTitle(oResourceBundleContentFinder.getText("ContentFinder.AppSearch.Title.SearchResult", ["My Leave Request", 3]));

        When.inEditMode.iEnterTextinAppBoxSearch("");
        Then.inEditMode.iSeeTheAppBoxTitle(oResourceBundleContentFinder.getText("ContentFinder.AppSearch.Title.AllFromCategory", ["Tiles", 12]));

        // hiding the Select All button for performance reasons until we get to FIORITECHP1-24685
        // When.inEditMode.iToggleSelectAllButton();
        // Then.inEditMode.iSeeTheAppBoxTitle("Tiles (11)");
        // Then.inEditMode.iSeeTheAddButtonAppCount(11);
        // Then.inEditMode.iSeeTheSelectAllButtonTextChange("Deselect All");
        // When.inEditMode.iToggleShowSelectedButton();
        // Then.inEditMode.iSeeTheAppBoxTitle("Selected Apps (11)");
        // When.inEditMode.iToggleShowSelectedButton();
        // When.inEditMode.iToggleSelectAllButton();

        When.inEditMode.iSelectTileInContentFinder(0);
        Then.inEditMode.iSeeTheAddButtonAppCount(1);

        When.inEditMode.iToggleShowSelectedButton();
        Then.inEditMode.iSeeTheAppBoxTitle(oResourceBundleContentFinder.getText("ContentFinder.AppSearch.Title.SelectedApp", [1]));

        When.inEditMode.iToggleShowSelectedButton();
        When.inEditMode.iPressOnConfirmInAddContentDialog();
        Then.inEditMode.iSeeTheAddedWidget(0, 0);

        //Add Row
        When.inEditMode.iPressTheAddRowButton(0);
        Then.inEditMode.iSeeANumberOfRows(2);

        //Add Column
        When.inEditMode.iAddAColumnToRow(1, 0);
        Then.inEditMode.iSeeANumberOfColumns(1, 2);

        //Resize Column
        Then.inEditMode.iSeeColumnWidthInRow(1, [12, 12]);
        When.inEditMode.iResizeAColumnFromRow(1, 1, "right");
        Then.inEditMode.iSeeColumnWidthInRow(1, [14, 10]);
        When.inEditMode.iResizeAColumnFromRow(1, 1, "left");
        Then.inEditMode.iSeeColumnWidthInRow(1, [12, 12]);
        When.inEditMode.iResizeAColumnFromRow(1, 1, "left");
        Then.inEditMode.iSeeColumnWidthInRow(1, [10, 14]);
        When.inEditMode.iResizeAColumnFromRow(1, 1, "right");
        Then.inEditMode.iSeeColumnWidthInRow(1, [12, 12]);

        //Delete Column
        When.inEditMode.iDeleteAColumnFromRow(1, 0);
        Then.inEditMode.iSeeANumberOfColumns(1, 1);

        //Delete Row
        When.inEditMode.iPressTheRowToolbarButton(1, /workPageDeleteButton/);
        When.onTheDeleteConfirmModal.iPressTheConfirmButton();
        Then.inEditMode.iSeeANumberOfRows(1);

        Then.iTeardownMyUIComponent();
    });

    opaTest("The WorkPage is loaded in edit mode and displays the correct aria-labels for WorkPageRows", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.workPageBuilder",
                id: "workPageBuilderComponent",
                componentData: {}
            }
        }).then(function () {
            var oComponent = Component.getComponentById("workPageBuilderComponent");
            oComponent.setEditMode(true);
            oComponent.setPageData({
                workPage: {
                    id: "wp0001",
                    contents: {
                        id: "wp0001",
                        descriptor: { value: { title: "TEST PAGE" } },
                        rows: [{
                            id: "my-row-0",
                            columns: [{}],
                            descriptor: {
                                value: {
                                    title: "My Row 0"
                                }
                            }
                        }, {
                            id: "my-row-1",
                            columns: [{}],
                            descriptor: {
                                value: {
                                    title: ""
                                }
                            }
                        }, {
                            id: "my-row-2",
                            columns: [{}],
                            descriptor: {
                                value: {
                                    title: "My Row 2"
                                }
                            }
                        }]
                    }
                }
            });
        });

        Then.inEditMode.iSeeANumberOfRows(3);
        When.inEditMode.iPressTheAddRowButton(0, false);

        Then.inEditMode.iSeeANumberOfRows(4);
        When.inEditMode.iPressTheAddRowButton(1, true);
        When.inEditMode.iPressTheAddRowButton(4, false);
        Then.inEditMode.iSeeANumberOfRows(6);

        Then.inEditMode.iSeeAnAriaLabelForRow(0, "My Row 0");
        Then.inEditMode.iSeeAnAriaLabelForRow(1);
        Then.inEditMode.iSeeAnAriaLabelForRow(2);
        Then.inEditMode.iSeeAnAriaLabelForRow(3);
        Then.inEditMode.iSeeAnAriaLabelForRow(4, "My Row 2");
        Then.inEditMode.iSeeAnAriaLabelForRow(5);

        When.inEditMode.iPressTheRowToolbarButton(1, /workPageDeleteButton/);
        When.onTheDeleteConfirmModal.iPressTheConfirmButton();
        Then.inEditMode.iSeeANumberOfRows(5);

        Then.inEditMode.iSeeAnAriaLabelForRow(0, "My Row 0");
        Then.inEditMode.iSeeAnAriaLabelForRow(1);
        Then.inEditMode.iSeeAnAriaLabelForRow(2);
        Then.inEditMode.iSeeAnAriaLabelForRow(3, "My Row 2");
        Then.inEditMode.iSeeAnAriaLabelForRow(4);

        Then.iTeardownMyUIComponent();
    });

    opaTest("The WorkPage is loaded in edit mode and 4 columns can be resized", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.workPageBuilder",
                id: "workPageBuilderComponent",
                componentData: {}
            }
        }).then(function () {
            var oComponent = Component.getComponentById("workPageBuilderComponent");
            oComponent.getRootControl().getDomRef().style.width = "1920px";
            oComponent.setEditMode(true);
            oComponent.setPageData({
                workPage: {
                    id: "wp0001",
                    contents: {
                        id: "wp0001",
                        descriptor: { value: { title: "TEST PAGE" } },
                        rows: []
                    }
                }
            });
            // Set zoom level to 0.5 to make resizing of WorkPageColumns work

            oComponent.attachEvent("visualizationFilterApplied", function (event) {
                let oParameters = event.getParameters();
                oComponent.setVisualizationData(VisualizationFiltering.filterVisualizations(oVisualizationData, oParameters.types, oParameters.search));
            });
        });

        //Add First Row
        When.inEditMode.iPressTheAddFirstRowButton();

        //Add Column
        When.inEditMode.iAddAColumnToRow(0, 0);
        When.inEditMode.iAddAColumnToRow(0, 1);
        When.inEditMode.iAddAColumnToRow(0, 2);
        Then.inEditMode.iSeeANumberOfColumns(0, 4);

        //Resize Column
        Then.inEditMode.iSeeColumnWidthInRow(0, [6, 6, 6, 6]);
        When.inEditMode.iResizeAColumnFromRow(0, 1, "right");
        Then.inEditMode.iSeeColumnWidthInRow(0, [8, 4, 6, 6]);
        When.inEditMode.iResizeAColumnFromRow(0, 3, "left");
        Then.inEditMode.iSeeColumnWidthInRow(0, [8, 4, 4, 8]);

        Then.iTeardownMyUIComponent();
    });

    opaTest("The WorkPage is loaded in edit mode and drag and drop is performed on some VizInstances", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.workPageBuilder",
                id: "workPageBuilderComponent",
                componentData: {}
            }
        }).then(function () {
            var oComponent = Component.getComponentById("workPageBuilderComponent");
            oComponent.setEditMode(true);
            oComponent.setPageData(deepExtend({}, WorkPageData));
            oComponent.attachEvent("visualizationFilterApplied", function (oEvent) {
                oComponent.setVisualizationData(VisualizationFiltering.filterVisualizations(oVisualizationData, oEvent.getParameter("types"), oEvent.getParameter("search")));
            });
        });

        When.inEditMode.iDragAndDropAVisualizationOnToACell(0, 0, 0, 0, 0, 0, 0);
        Then.inEditMode.iSeeTheMovedWidgetAtPosition(0, 0, 0, 3, "Capital Projects");

        When.inEditMode.iAddAColumnToRow(0, 0);
        When.inEditMode.iPressAddWidgetButton(0, 1);
        Then.inEditMode.iSeeTheContentFinderDialog();

        Then.inEditMode.iSeeContentFinderTitle(oResourceBundleContentFinder.getText("ContentFinder.Dialog.Title"));

        When.inEditMode.iSelectVisualizationsFilterInContentFinder("cards");
        When.inEditMode.iSelectCardInContentFinder(0);
        Then.inEditMode.iSeeTheAddedWidget(0, 0);

        When.inEditMode.iDragAndDropAVisualizationOnToACell(0, 0, 0, 0, 0, 1, 0);
        Then.inEditMode.iSeeTheMovedWidgetAtPosition(0, 1, 0, 0, "Translate Evaluation Templates");

        When.inEditMode.iPressTheAddRowButton(0, true);
        When.inEditMode.iDragAndDropAVisualizationOnToAColumn(1, 0, 0, 0, 0, 0);
        Then.inEditMode.iSeeTheMovedWidgetAtPosition(0, 0, 0, 0, "I am hungry");

        When.inEditMode.iDragAndDropAVisualizationNextToACard(0, 0, 0, 0, 1, 1, 1, "Before");
        Then.inEditMode.iSeeTheMovedWidgetAtPosition(1, 1, 1, 0, "I am hungry");

        When.inEditMode.iDragAndDropAVisualizationNextToACard(1, 1, 1, 0, 1, 1, 2, "After");
        Then.inEditMode.iSeeTheMovedWidgetAtPosition(1, 1, 3, 0, "I am hungry");

        When.inEditMode.iDragAndDropAVisualizationOnToACell(1, 1, 3, 0, 0, 0, 0);
        Then.inEditMode.iSeeTheMovedWidgetAtPosition(0, 0, 0, 0, "I am hungry");

        Then.iTeardownMyUIComponent();
    });

    opaTest("The WorkPage is loaded in edit mode and drag and drop is performed on some Cells", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.workPageBuilder",
                id: "workPageBuilderComponent",
                componentData: {}
            }
        }).then(function () {
            var oComponent = Component.getComponentById("workPageBuilderComponent");
            oComponent.setEditMode(true);
            oComponent.setPageData(deepExtend({}, WorkPageData));
            oComponent.attachEvent("visualizationFilterApplied", function () {
                oComponent.setVisualizationData(oVisualizationData);
            });
        });

        When.inEditMode.iDragAndDropACellOnToAColumn(0, 0, 0, 1, 0, 0, "Before");
        Then.inEditMode.iSeeTheMovedWidgetAtPosition(1, 0, 0, 0, "Capital Projects");

        When.inEditMode.iDragAndDropACellOnToAColumn(1, 0, 0, 1, 0, 1, "After");
        Then.inEditMode.iSeeTheMovedWidgetAtPosition(1, 0, 1, 0, "Capital Projects");

        When.inEditMode.iDragAndDropACellOnToAColumn(1, 0, 1, 1, 0, 0, "Before");
        Then.inEditMode.iSeeTheMovedWidgetAtPosition(1, 0, 0, 0, "Capital Projects");

        When.inEditMode.iDragAndDropACellOnToAColumn(1, 0, 0, 0, 0, 0, "On");
        Then.inEditMode.iSeeTheMovedWidgetAtPosition(0, 0, 0, 0, "Capital Projects");

        When.inEditMode.iDragAndDropACellOnToAColumn(1, 0, 0, 0, 0, 0, "After");
        Then.inEditMode.iSeeCardWithHeaderProperty(0, 0, 1, 0, "title", "Sample title (Widget - PG)");

        When.inEditMode.iAddAColumnToRow(0, 0);
        When.inEditMode.iDragAndDropACellOnToAColumn(0, 0, 0, 0, 1, 0, "On");
        Then.inEditMode.iSeeTheMovedWidgetAtPosition(0, 1, 0, 0, "Capital Projects");

        Then.iTeardownMyUIComponent();
    });

    opaTest("The WorkPage is loaded in edit mode and the cards show the correct configuration values", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.workPageBuilder",
                id: "workPageBuilderComponent",
                componentData: {}
            }
        }).then(function () {
            var oComponent = Component.getComponentById("workPageBuilderComponent");
            oComponent.setEditMode(true);
            oComponent.setPageData(deepExtend({}, WorkPageData));
        });

        Then.inEditMode.iSeeCardWithHeaderProperty(1, 0, 0, 0, "title", "Sample title (Widget - PG)");
        Then.inEditMode.iSeeCardWithHeaderProperty(1, 0, 0, 0, "subtitle", "Sample subtitle (Widget - CO)");
        Then.inEditMode.iSeeCardWithHeaderProperty(1, 0, 0, 0, "details", "Sample details (Widget - PR)");

        Then.inEditMode.iSeeCardWithHeaderProperty(1, 1, 0, 0, "title", "Sample title (Widget - PG)");
        Then.inEditMode.iSeeCardWithHeaderProperty(1, 1, 0, 0, "subtitle", "Sample subtitle (Viz - PG)");
        Then.inEditMode.iSeeCardWithHeaderProperty(1, 1, 0, 0, "titleMaxLines", 3);

        Then.iTeardownMyUIComponent();
    });

    opaTest("The WorkPage is loaded in edit mode and a cell with a card can be deleted", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.workPageBuilder",
                id: "workPageBuilderComponent",
                componentData: {}
            }
        }).then(function () {
            var oComponent = Component.getComponentById("workPageBuilderComponent");
            oComponent.setEditMode(true);
            oComponent.setPageData(deepExtend({}, WorkPageData));
        });


        When.inEditMode.iPressTheDeleteCardButton(1, 0, 0);
        Then.inEditMode.iCanSeeEmptyCellWithAddWidgetButton();

        Then.iTeardownMyUIComponent();
    });


    opaTest("The WorkPage is loaded in edit mode and a card can be configured", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.workPageBuilder",
                id: "workPageBuilderComponent",
                componentData: {}
            }
        }).then(function () {
            var oComponent = Component.getComponentById("workPageBuilderComponent");
            oComponent.setEditMode(true);
            oComponent.setPageData(deepExtend({}, WorkPageData));
        });


        When.inEditMode.iPressCardActionDefinition(1, 0, 0, 0, 0);
        Then.inEditMode.iSeeTheCardEditorDialog();

        When.inEditMode.iChangeCardSettingsTitle("Digital Practice - TEST");
        When.inEditMode.iChangeCardSettingsSubtitle("Current and Forecasted Utilization - TEST");
        When.inEditMode.iPressSaveInCardEditorDialog();

        Then.inEditMode.iSeeCardWithHeaderProperty(1, 0, 0, 0, "title", "Digital Practice - TEST");
        Then.inEditMode.iSeeCardWithHeaderProperty(1, 0, 0, 0, "subtitle", "Current and Forecasted Utilization - TEST");


        Then.iTeardownMyUIComponent();
    });

    opaTest("The WorkPage is loaded in edit mode and a card configuration can be reset", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.workPageBuilder",
                id: "workPageBuilderComponent",
                componentData: {}
            }
        }).then(function () {
            var oComponent = Component.getComponentById("workPageBuilderComponent");
            oComponent.setEditMode(true);
            oComponent.setPageData(deepExtend({}, WorkPageData));
        });

        When.inEditMode.iPressCardActionDefinition(1, 0, 0, 0, 1);
        Then.inEditMode.iSeeTheCardResetDialog();
        When.inEditMode.iPressDeleteInCardResetDialog();

        Then.inEditMode.iSeeCardWithHeaderProperty(1, 0, 0, 0, "title", "Sample title (Widget - CO)");
        Then.inEditMode.iSeeCardWithHeaderProperty(1, 0, 0, 0, "subtitle", "Sample subtitle (Widget - CO)");
        Then.inEditMode.iSeeCardWithHeaderProperty(1, 0, 0, 0, "details", "Sample details (Widget - PR)");


        Then.iTeardownMyUIComponent();
    });

    opaTest("The WorkPage is loaded in edit mode and only 4 columns can be added to a row", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.workPageBuilder",
                id: "workPageBuilderComponent",
                componentData: {}
            }
        }).then(function () {
            var oComponent = Component.getComponentById("workPageBuilderComponent");
            oComponent.setPageData({
                workPage: {
                    id: "wp0001",
                    contents: {
                        id: "wp0001",
                        descriptor: { value: { title: "TEST PAGE" } },
                        rows: []
                    }
                }
            });
            oComponent.setEditMode(true);
        });

        When.inEditMode.iPressTheAddFirstRowButton();
        When.inEditMode.iAddAColumnToRow(0, 0, true);
        When.inEditMode.iAddAColumnToRow(0, 0, true);
        When.inEditMode.iAddAColumnToRow(0, 0, true);
        Then.inEditMode.iSeeTheAmountOfAddColumnButtons(0, 0);

        When.inEditMode.iDeleteAColumnFromRow(0, 0);
        Then.inEditMode.iSeeTheAmountOfAddColumnButtons(0, 4);


        Then.iTeardownMyUIComponent();
    });


    opaTest("The WorkPage is loaded in edit mode and a MessageStrip is displayed if the amount of columns is > 4", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.workPageBuilder",
                id: "workPageBuilderComponent",
                componentData: {}
            }
        }).then(function () {
            var oComponent = Component.getComponentById("workPageBuilderComponent");
            oComponent.setEditMode(true);
            oComponent.setPageData(deepExtend({}, WorkPageData));
        });

        Then.inEditMode.iSeeANumberOfColumns(3, 6);
        Then.inEditMode.iSeeAMessageStripInRow(3, {
            type: MessageType.Warning,
            showIcon: true
        });

        When.inEditMode.iDeleteAColumnFromRow(3, 5);
        Then.inEditMode.iSeeANumberOfColumns(3, 5);
        Then.inEditMode.iSeeAMessageStripInRow(3, {
            type: MessageType.Warning,
            showIcon: true
        });

        When.inEditMode.iDeleteAColumnFromRow(3, 4);
        Then.inEditMode.iSeeANumberOfColumns(3, 4);
        Then.inEditMode.iDoNotSeeAMessageStripInRow(3);

        Then.iTeardownMyUIComponent();
    });

    opaTest("The WorkPage is loaded in edit mode and a title in the card configuration is shown.", function (Given, When, Then) {
        // Arrange
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.workPageBuilder",
                id: "workPageBuilderComponent",
                componentData: {}
            }
        }).then(function () {
            var oComponent = Component.getComponentById("workPageBuilderComponent");
            oComponent.setEditMode(true);
            oComponent.setPageData(deepExtend({}, WorkPageData));
        });

        // Act
        When.inEditMode.iPressCardActionDefinition(1, 0, 0, 0, 0);

        // Assert
        Then.inEditMode.iSeeTheCardEditorTitle("Configure \"Sample title (Widget - PG)\"");

        When.inEditMode.iPressCancelInCardEditorDialog();
        Then.iTeardownMyUIComponent();
    });

    QUnit.module("WorkPageBuilder - Toolbar with add and delete buttons", {
        beforeEach: function () {
            return Container.init("local").then(function () {
                this.oCDMService = {
                    getApplications: sandbox.stub().resolves({}),
                    getVizTypes: sandbox.stub().resolves({
                        "sap.ushell.StaticAppLauncher": StaticAppLauncher,
                        "sap.ushell.DynamicAppLauncher": DynamicAppLauncher
                    })
                };
                sandbox.stub(Container, "getServiceAsync").callThrough().withArgs("CommonDataModel").resolves(this.oCDMService);
            }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    opaTest("The business application widget shows the empty illustration when it is empty.", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.workPageBuilder",
                id: "workPageBuilderComponent",
                componentData: {}
            }
        }).then(function () {
            var oComponent = Component.getComponentById("workPageBuilderComponent");
            oComponent.setEditMode(true);
            oComponent.setPageData({
                workPage: {
                    id: "wp0001",
                    contents: {
                        id: "wp0001",
                        descriptor: { value: { title: "TEST PAGE" } },
                        rows: [{
                            id: "row0",
                            descriptor: { value: { title: "Section" } },
                            columns: [{
                                id: "column0",
                                descriptor: { value: { title: "Column" } },
                                cells: [{
                                    id: "row0_col0_cell0",
                                    tenantId: "a12ff5b4-f542-4fd0-ae52-319bddd789a5",
                                    instanceId: "1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a",
                                    descriptor: {
                                        value: {
                                            mode: "Section"
                                        },
                                        schemaVersion: "3.2.0"
                                    },
                                    configurations: [],
                                    widgets: [
                                        {
                                            id: "dynamic_tile_0",
                                            tenantId: "a12ff5b4-f542-4fd0-ae52-319bddd789a5",
                                            instanceId: "1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a",
                                            descriptor: {
                                                value: {},
                                                schemaVersion: "3.2.0"
                                            },
                                            configurations: [],
                                            visualization: {
                                                id: "provider2_97176e7f-b2ea-4e31-842a-3efa5086b329#Default-VizId",
                                                type: "sap.ushell.DynamicAppLauncher"
                                            }
                                        }
                                    ]
                                }]
                            }]
                        }]
                    }
                }
            });
        });
        When.inEditMode.iRemoveTileFromCell();
        Then.inEditMode.iSeeTheEmptyIllustration("Search for Apps", "Add apps to the widget, or remove the widget if you don't need it.");
        Then.inEditMode.iCanSeeTheAddWidgetButton();

        Then.iTeardownMyUIComponent();
    });

    opaTest("The business application widget shows the add and delete button in the toolbar.", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.workPageBuilder",
                id: "workPageBuilderComponent",
                componentData: {}
            }
        }).then(function () {
            var oComponent = Component.getComponentById("workPageBuilderComponent");
            oComponent.setEditMode(true);
            oComponent.setPageData(deepExtend({}, WorkPageData));
        });

        Then.inEditMode.iCanSeeTheBusinessApplicationWidgetToolbar();
        Then.inEditMode.iCanSeeTheAddAndDeleteBusinessApplicationWidgetButtons(0, 0, 0);
        Then.iTeardownMyUIComponent();
    });

    opaTest("A tile is added to the business application widget.", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.workPageBuilder",
                id: "workPageBuilderComponent",
                componentData: {}
            }
        }).then(function () {
            var oComponent = Component.getComponentById("workPageBuilderComponent");
            oComponent.setEditMode(true);
            oComponent.setPageData(deepExtend({}, WorkPageData));

            oComponent.attachEvent("visualizationFilterApplied", function () {
                oComponent.setVisualizationData(oVisualizationData);
            });
        });


        When.inEditMode.iPressTheAddBusinessApplicationWidgetButton(0, 0, 0);
        Then.inEditMode.iSeeContentFinderTitle(oResourceBundleContentFinder.getText("ContentFinder.Dialog.Title"));
        Then.inEditMode.iSeeTheContentFinderDialog();

        When.inEditMode.iPressOnCloseInAddContentDialog();

        Then.iTeardownMyUIComponent();
    });

    opaTest("A cell is deleted from the page and shows an empty cell with the add widget button.", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.workPageBuilder",
                id: "workPageBuilderComponent",
                componentData: {}
            }
        }).then(function () {
            var oComponent = Component.getComponentById("workPageBuilderComponent");
            oComponent.setEditMode(true);
            oComponent.setPageData({
                workPage: {
                    id: "wp0001",
                    contents: {
                        id: "wp0001",
                        descriptor: { value: { title: "TEST PAGE" } },
                        rows: [{
                            id: "row0",
                            descriptor: { value: { title: "Section" } },
                            columns: [{
                                id: "column0",
                                descriptor: { value: { title: "Column" } },
                                cells: [{
                                    id: "row0_col0_cell0",
                                    tenantId: "a12ff5b4-f542-4fd0-ae52-319bddd789a5",
                                    instanceId: "1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a",
                                    descriptor: {
                                        value: {
                                            mode: "Section"
                                        },
                                        schemaVersion: "3.2.0"
                                    },
                                    configurations: [],
                                    widgets: [
                                        {
                                            id: "dynamic_tile_0",
                                            tenantId: "a12ff5b4-f542-4fd0-ae52-319bddd789a5",
                                            instanceId: "1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a",
                                            descriptor: {
                                                value: {},
                                                schemaVersion: "3.2.0"
                                            },
                                            configurations: [],
                                            visualization: {
                                                id: "provider2_97176e7f-b2ea-4e31-842a-3efa5086b329#Default-VizId",
                                                type: "sap.ushell.DynamicAppLauncher"
                                            }
                                        }
                                    ]
                                }]
                            }]
                        }]
                    }
                }
            });
        });

        When.inEditMode.iPressTheDeleteBusinessApplicationWidgetButton(0, 0, 0);
        When.onTheDeleteConfirmModal.iPressTheConfirmButton();
        Then.inEditMode.iCanSeeEmptyCellWithAddWidgetButton();
        Then.iTeardownMyUIComponent();
    });

    QUnit.module("WorkPageBuilder - Content Finder", {
        beforeEach: function () {
            return Container.init("local")
                .then(function () {
                    this.oCDMService = {
                        getApplications: sandbox.stub().resolves({}),
                        getVizTypes: sandbox.stub().resolves({
                            "sap.ushell.StaticAppLauncher": StaticAppLauncher,
                            "sap.ushell.DynamicAppLauncher": DynamicAppLauncher
                        })
                    };
                    sandbox.stub(Container, "getServiceAsync").callThrough().withArgs("CommonDataModel").resolves(this.oCDMService);
                }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    opaTest("Shows the illustrated message when no tile is found after searching.", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.workPageBuilder",
                id: "workPageBuilderComponent",
                componentData: {}
            }
        }).then(() => {
            var oComponent = Component.getComponentById("workPageBuilderComponent");
            oComponent.setEditMode(true);
            oComponent.setPageData({
                workPage: {
                    id: "wp0001",
                    contents: {
                        id: "wp0001",
                        descriptor: { value: { title: "TEST PAGE" } },
                        rows: [{
                            id: "row0",
                            descriptor: { value: { title: "Section" } },
                            columns: [{
                                id: "column0",
                                descriptor: { value: { title: "Column" } },
                                cells: [{
                                    id: "row0_col0_cell0",
                                    tenantId: "a12ff5b4-f542-4fd0-ae52-319bddd789a5",
                                    instanceId: "1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a",
                                    descriptor: {
                                        value: {
                                            mode: "Section"
                                        },
                                        schemaVersion: "3.2.0"
                                    },
                                    configurations: [],
                                    widgets: [
                                        {
                                            id: "dynamic_tile_0",
                                            tenantId: "a12ff5b4-f542-4fd0-ae52-319bddd789a5",
                                            instanceId: "1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a",
                                            descriptor: {
                                                value: {},
                                                schemaVersion: "3.2.0"
                                            },
                                            configurations: [],
                                            visualization: {
                                                id: "provider2_97176e7f-b2ea-4e31-842a-3efa5086b329#Default-VizId",
                                                type: "sap.ushell.DynamicAppLauncher"
                                            }
                                        }
                                    ]
                                }]
                            }]
                        }]
                    }
                }
            });

            oComponent.attachEvent("visualizationFilterApplied", (event) => {
                let oParameters = event.getParameters();
                oComponent.setVisualizationData(VisualizationFiltering.filterVisualizations(oVisualizationData, oParameters.types, oParameters.search));
            });
        });

        //Content Finder
        When.inEditMode.iPressAddWidgetButton(0, 0);
        Then.inEditMode.iSeeTheContentFinderDialog();

        When.inEditMode.iSelectWidgetFromWidgetGallery(0);

        When.inEditMode.iEnterTextinAppBoxSearch("asdf");

        Then.inEditMode.iSeeTheEmptyIllustrationNoData();
        Then.inEditMode.iSeeTheEmptyIllustrationTitle();
        Then.inEditMode.iSeeTheEmptyIllustrationDescription();

        Then.iTeardownMyUIComponent();
    });
});
