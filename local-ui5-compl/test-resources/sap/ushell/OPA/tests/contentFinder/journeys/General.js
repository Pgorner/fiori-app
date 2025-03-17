// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * This OPA journey will test the ContentFinder component.
 */
sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ui/thirdparty/sinon-4",
    "sap/ushell/opa/testSiteData/ContentFinder/ContentFinderVisualizations",
    "sap/ui/core/Component",
    "sap/ui/model/resource/ResourceModel",
    "sap/ushell/opa/utils/ContentFinder/VisualizationFiltering",
    "sap/ushell/opa/tests/contentFinder/pages/General",
    "sap/ushell/Container"
], function (
    opaTest,
    sinon,
    oVisualizationData,
    Component,
    ResourceModel,
    VisualizationFiltering
) {
    "use strict";

    const sandbox = sinon.createSandbox();
    const oResourceBundle = new ResourceModel({
        bundleUrl: sap.ui.require.toUrl("sap/ushell/components/contentFinder/resources/resources.properties")
    }).getResourceBundle();

    const oComponentData = {
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
    };

    const fnResizeSapUiComponentContainerToDesktop = function () {
        const aComponentContainers = document.querySelectorAll(".sapUiComponentContainer");
        if (aComponentContainers.length) {
            aComponentContainers.forEach(function (oComponentContainer) {
                oComponentContainer.style.width = "1920px";
                oComponentContainer.style.height = "1080px";
            });
        }
    };

    /* global QUnit */
    QUnit.module("ContentFinder", {
        beforeEach: function () {
            this.oVisualizationsEmpty = { visualizations: { nodes: [], totalCount: 0 }};
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    opaTest("Open the dialog", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.contentFinder.dialog",
                id: "contentFinderComponent",
                componentData: oComponentData
            }
        }).then(function () {
            fnResizeSapUiComponentContainerToDesktop();
            const oComponent = Component.getComponentById("contentFinderComponent");
            oComponent.attachEvent("visualizationFilterApplied", function (oEvent) {
                const oParameters = oEvent.getParameters();
                oComponent.setVisualizationData(VisualizationFiltering.filterVisualizations(oVisualizationData, oParameters.types, oParameters.search));
            });
            oComponent.show();
        });
        Then.inTheContentFinderDialog.iSeeTheDialog(true);
        Then.inTheContentFinderDialog.iSeeTheSearchField();
        Then.inTheContentFinderDialog.iSeeTheSelectionToggleButton({pressed: false, enabled: false, visible: true});

        Then.inTheContentFinderDialog.iSeeTheGridList();
        Then.inTheContentFinderDialog.iSeeTheDialogTitle(oResourceBundle.getText("ContentFinder.Dialog.Title"));
        Then.inTheContentFinderDialog.iSeeTheCategoryTree(true);
        Then.inTheContentFinderDialog.iSeeTheCategoryTreeToggleButton({pressed: true});
        Then.inTheContentFinderDialog.iSeeANumberOfAppBoxes(12);
        Then.inTheContentFinderDialog.iSeeTheAppSearchTitle("Tiles (12)");

        When.inTheContentFinderDialog.iToggleListView();
        Then.inTheContentFinderDialog.iSeeTheTable();
        Then.inTheContentFinderDialog.iSeeTheDialogTitle(oResourceBundle.getText("ContentFinder.Dialog.Title"));
        Then.inTheContentFinderDialog.iSeeTheCategoryTree(true);
        Then.inTheContentFinderDialog.iSeeTheCategoryTreeToggleButton({pressed: true});
        Then.inTheContentFinderDialog.iSeeANumberOfAppListItems(12);
        Then.inTheContentFinderDialog.iSeeTheAppSearchTitle("Tiles (12)");

        Then.iTeardownMyUIComponent();
    });

    opaTest("Open the dialog and check the category tree visibility", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.contentFinder.dialog",
                id: "contentFinderComponent",
                componentData: oComponentData
            }
        }).then(function () {
            fnResizeSapUiComponentContainerToDesktop();
            const oComponent = Component.getComponentById("contentFinderComponent");
            oComponent.attachEvent("visualizationFilterApplied", function (oEvent) {
                const oParameters = oEvent.getParameters();
                oComponent.setVisualizationData(VisualizationFiltering.filterVisualizations(oVisualizationData, oParameters.types, oParameters.search));
            });
            oComponent.show();
        });
        Then.inTheContentFinderDialog.iSeeTheCategoryTree(true);
        Then.inTheContentFinderDialog.iSeeTheCategoryTreeToggleButton({pressed: true});

        When.inTheContentFinderDialog.iPressCategoryTreeToggleButton();
        Then.inTheContentFinderDialog.iSeeTheCategoryTree(false);
        Then.inTheContentFinderDialog.iSeeTheCategoryTreeToggleButton({pressed: false});

        When.inTheContentFinderDialog.iPressCategoryTreeToggleButton();
        Then.inTheContentFinderDialog.iSeeTheCategoryTree(true);
        Then.inTheContentFinderDialog.iSeeTheCategoryTreeToggleButton({pressed: true});

        Then.iTeardownMyUIComponent();
    });

    opaTest("Open the dialog and check the category tree visibility showCategoryTreeWhenEmpty is false ", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.contentFinder.dialog",
                id: "contentFinderComponent",
                settings: {
                    showCategoryTreeWhenEmpty: false
                },
                componentData: oComponentData
            }
        }).then(function () {
            fnResizeSapUiComponentContainerToDesktop();
            const oComponent = Component.getComponentById("contentFinderComponent");
            oComponent.attachEvent("visualizationFilterApplied", function (oEvent) {
                const oParameters = oEvent.getParameters();
                oComponent.setVisualizationData(VisualizationFiltering.filterVisualizations(oVisualizationData, oParameters.types, oParameters.search));
            });
            oComponent.show();
        });

        Then.inTheContentFinderDialog.iSeeTheCategoryTree(false);
        Then.inTheContentFinderDialog.iSeeTheCategoryTreeToggleButton({pressed: false});

        Then.iTeardownMyUIComponent();
    });

    opaTest("Open the dialog and check the category tree visibility when dialog is reopened and state is preserved", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.contentFinder.dialog",
                id: "contentFinderComponent",
                componentData: oComponentData
            }
        }).then(function () {
            fnResizeSapUiComponentContainerToDesktop();
            const oComponent = Component.getComponentById("contentFinderComponent");
            oComponent.attachEvent("visualizationFilterApplied", function (oEvent) {
                const oParameters = oEvent.getParameters();
                oComponent.setVisualizationData(VisualizationFiltering.filterVisualizations(oVisualizationData, oParameters.types, oParameters.search));
            });
            oComponent.show();
        });

        // Initial state
        Then.inTheContentFinderDialog.iSeeTheDialog(true);
        Then.inTheContentFinderDialog.iSeeTheCategoryTree(true);
        Then.inTheContentFinderDialog.iSeeTheCategoryTreeToggleButton({pressed: true});

        // Close the dialog and reopen it when category tree was closed
        When.inTheContentFinderDialog.iPressCategoryTreeToggleButton();
        Then.inTheContentFinderDialog.iSeeTheCategoryTree(false);
        Then.inTheContentFinderDialog.iSeeTheCategoryTreeToggleButton({pressed: false});
        When.inTheContentFinderDialog.iPressTheDialogCloseButton();
        Then.inTheContentFinderDialog.iSeeTheDialog(false);
        When.inTheContentFinderDialog.iOpenTheDialog();
        Then.inTheContentFinderDialog.iSeeTheDialog(true);
        Then.inTheContentFinderDialog.iSeeTheCategoryTree(false);
        Then.inTheContentFinderDialog.iSeeTheCategoryTreeToggleButton({pressed: false});

        // Close the dialog and reopen it when category tree is closed
        When.inTheContentFinderDialog.iPressCategoryTreeToggleButton();
        Then.inTheContentFinderDialog.iSeeTheCategoryTree(true);
        Then.inTheContentFinderDialog.iSeeTheCategoryTreeToggleButton({pressed: true});
        When.inTheContentFinderDialog.iPressTheDialogCloseButton();
        Then.inTheContentFinderDialog.iSeeTheDialog(false);
        When.inTheContentFinderDialog.iOpenTheDialog();
        Then.inTheContentFinderDialog.iSeeTheDialog(true);
        Then.inTheContentFinderDialog.iSeeTheCategoryTree(true);
        Then.inTheContentFinderDialog.iSeeTheCategoryTreeToggleButton({pressed: true});

        Then.iTeardownMyUIComponent();
    });

    opaTest("Open the dialog and check the category tree visibility when dialog is small", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.contentFinder.dialog",
                id: "contentFinderComponent",
                componentData: oComponentData
            }
        }).then(function () {
            fnResizeSapUiComponentContainerToDesktop();
            const oComponent = Component.getComponentById("contentFinderComponent");
            oComponent.attachEvent("visualizationFilterApplied", function (oEvent) {
                const oParameters = oEvent.getParameters();
                oComponent.setVisualizationData(VisualizationFiltering.filterVisualizations(oVisualizationData, oParameters.types, oParameters.search));
            });
            oComponent.show();
        });

        When.inTheContentFinderDialog.iResizeDialogToSmall();
        Then.inTheContentFinderDialog.iSeeTheCategoryTree(false);
        Then.inTheContentFinderDialog.iSeeTheCategoryTreeToggleButton({pressed: false});

        When.inTheContentFinderDialog.iPressCategoryTreeToggleButton();
        Then.inTheContentFinderDialog.iSeeTheCategoryTree(true);
        Then.inTheContentFinderDialog.iSeeTheCategoryTreeCloseButton(true);
        Then.inTheContentFinderDialog.iSeeTheCategoryTreeToggleButton({pressed: true});

        When.inTheContentFinderDialog.iPressCategoryTreeCloseButton();
        Then.inTheContentFinderDialog.iSeeTheCategoryTreeCloseButton(false);
        Then.inTheContentFinderDialog.iSeeTheCategoryTree(false);
        Then.inTheContentFinderDialog.iSeeTheCategoryTreeToggleButton({pressed: false});


        Then.iTeardownMyUIComponent();
    });

    opaTest("Open the dialog and check the category tree visibility when dialog is small and a catalog tree item is pressed", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.contentFinder.dialog",
                id: "contentFinderComponent",
                componentData: oComponentData
            }
        }).then(function () {
            fnResizeSapUiComponentContainerToDesktop();
            const oComponent = Component.getComponentById("contentFinderComponent");
            oComponent.attachEvent("visualizationFilterApplied", function (oEvent) {
                const oParameters = oEvent.getParameters();
                oComponent.setVisualizationData(VisualizationFiltering.filterVisualizations(oVisualizationData, oParameters.types, oParameters.search));
            });

            oComponent.setCategoryTree([
                { title: "All Tiles" },
                {
                    title: "Catalog",
                    nodes: [
                        { title: "MyCatalog 1" },
                        { title: "MyCatalog 2" },
                        { title: "MyCatalog 3" }
                    ]
                }
            ]);

            oComponent.show();
        });

        When.inTheContentFinderDialog.iResizeDialogToSmall();
        Then.inTheContentFinderDialog.iSeeTheCategoryTree(false);
        Then.inTheContentFinderDialog.iSeeTheCategoryTreeToggleButton({pressed: false});

        When.inTheContentFinderDialog.iPressCategoryTreeToggleButton();
        Then.inTheContentFinderDialog.iSeeTheCategoryTree(true);
        Then.inTheContentFinderDialog.iSeeTheCategoryTreeCloseButton(true);

        When.inTheContentFinderDialog.iPressOnACatalog("MyCatalog 2");
        Then.inTheContentFinderDialog.iSeeTheCategoryTreeCloseButton(false);
        Then.inTheContentFinderDialog.iSeeTheCategoryTree(false);
        Then.inTheContentFinderDialog.iSeeTheCategoryTreeToggleButton({pressed: false});

        Then.iTeardownMyUIComponent();
    });

    opaTest("Open the dialog with restricted visualizations", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.contentFinder.dialog",
                id: "contentFinderComponent",
                componentData: oComponentData
            }
        }).then(function () {
            fnResizeSapUiComponentContainerToDesktop();
            const oComponent = Component.getComponentById("contentFinderComponent");
            oComponent.attachEvent("visualizationFilterApplied", function (oEvent) {
                const oParameters = oEvent.getParameters();
                oComponent.setVisualizationData(VisualizationFiltering.filterVisualizations(oVisualizationData, oParameters.types, oParameters.search));
            });
            oComponent.setContextData({
                restrictedVisualizations: [
                    "8adf91e9-b17a-425e-8053-f39b62f0c31e5",
                    "8adf91e9-b17a-425e-8053-f39b62f0c31e2"
                ]
            });
            oComponent.show();
        });

        Then.inTheContentFinderDialog.iSeeANumberOfAppBoxes(12);
        Then.inTheContentFinderDialog.iSeeTheHighlightedAppBoxWithHelpId("8adf91e9-b17a-425e-8053-f39b62f0c31e5");
        Then.inTheContentFinderDialog.iSeeTheHighlightedAppBoxWithHelpId("8adf91e9-b17a-425e-8053-f39b62f0c31e2");
        Then.inTheContentFinderDialog.iSeeTheAppBoxWithHelpIdAndIcon("8adf91e9-b17a-425e-8053-f39b62f0c31e5", "sap-icon://create-leave-request");
        Then.inTheContentFinderDialog.iSeeTheAppBoxWithHelpIdAndIcon("8adf91e9-b17a-425e-8053-f39b62f0c31e3", "sap-icon://product");

        Then.iTeardownMyUIComponent();
    });

    opaTest("No categories, empty grid and list view", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.contentFinder.dialog",
                id: "contentFinderComponent",
                componentData: oComponentData
            }
        }).then(function () {
            fnResizeSapUiComponentContainerToDesktop();
            const oComponent = Component.getComponentById("contentFinderComponent");
            oComponent.attachEvent("visualizationFilterApplied", function () {
                oComponent.setVisualizationData(this.oVisualizationsEmpty);
            }.bind(this));
            oComponent.show();
        });

        Then.inTheContentFinderDialog.iSeeTheCategoryTree(true);

        Then.inTheContentFinderDialog.iSeeTheAppSearchTitle(oResourceBundle.getText("ContentFinder.AppSearch.Title.NoVisualization", "Tiles"));
        Then.inTheContentFinderDialog.iSeeTheGridList();
        Then.inTheContentFinderDialog.iSeeTheAppSearchNoDataMessage();

        When.inTheContentFinderDialog.iToggleListView();
        Then.inTheContentFinderDialog.iSeeTheTable();
        Then.inTheContentFinderDialog.iSeeTheAppSearchNoDataMessage();

        Then.iTeardownMyUIComponent();
    });


    opaTest("The AppSearch can be switched between selection view and search results view and keeps the selection", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.contentFinder.dialog",
                id: "contentFinderComponent",
                componentData: oComponentData
            }
        }).then(function () {
            fnResizeSapUiComponentContainerToDesktop();
            const oComponent = Component.getComponentById("contentFinderComponent");
            oComponent.attachEvent("visualizationFilterApplied", function (oEvent) {
                const oParameters = oEvent.getParameters();
                oComponent.setVisualizationData(VisualizationFiltering.filterVisualizations(oVisualizationData, oParameters.types, oParameters.search));
            });
            oComponent.show();
        });

        Then.inTheContentFinderDialog.iSeeTheDialog(true);
        Then.inTheContentFinderDialog.iSeeTheAppSearchTitle("Tiles (12)");
        Then.inTheContentFinderDialog.iSeeANumberOfAppBoxes(12);
        When.inTheContentFinderDialog.iSelectAppBoxWithTitle("SAP Minutes");
        When.inTheContentFinderDialog.iSelectAppBoxWithTitle("Drown Employees");
        Then.inTheContentFinderDialog.iSeeTheAddButton({ text: oResourceBundle.getText("ContentFinder.Button.Add", [2]) });
        Then.inTheContentFinderDialog.iSeeTheAppBoxWithTitleSelected("SAP Minutes");
        Then.inTheContentFinderDialog.iSeeTheAppBoxWithTitleSelected("Drown Employees");
        When.inTheContentFinderDialog.iToggleSelectionView();
        Then.inTheContentFinderDialog.iSeeTheSelectionToggleButton({ pressed: true, enabled: true });
        Then.inTheContentFinderDialog.iSeeANumberOfAppBoxes(2);
        Then.inTheContentFinderDialog.iSeeTheAppBoxWithTitleSelected("SAP Minutes");
        Then.inTheContentFinderDialog.iSeeTheAppBoxWithTitleSelected("Drown Employees");
        Then.inTheContentFinderDialog.iSeeTheAppSearchTitle(oResourceBundle.getText("ContentFinder.AppSearch.Title.SelectedApp", [2]));
        When.inTheContentFinderDialog.iToggleSelectionView();
        Then.inTheContentFinderDialog.iSeeTheSelectionToggleButton({ pressed: false, enabled: true });
        Then.inTheContentFinderDialog.iSeeANumberOfAppBoxes(12);
        Then.inTheContentFinderDialog.iSeeTheAppBoxWithTitleSelected("SAP Minutes");
        Then.inTheContentFinderDialog.iSeeTheAppBoxWithTitleSelected("Drown Employees");
        When.inTheContentFinderDialog.iToggleSelectionView();
        Then.inTheContentFinderDialog.iSeeTheSelectionToggleButton({ pressed: true, enabled: true });
        When.inTheContentFinderDialog.iSelectAppBoxWithTitle("SAP Minutes");
        Then.inTheContentFinderDialog.iSeeTheAppSearchTitle(oResourceBundle.getText("ContentFinder.AppSearch.Title.SelectedApp", [1]));
        When.inTheContentFinderDialog.iSelectAppBoxWithTitle("Drown Employees");
        Then.inTheContentFinderDialog.iSeeTheAppSearchTitle("Tiles (12)");
        Then.inTheContentFinderDialog.iSeeANumberOfAppBoxes(12);

        Then.iTeardownMyUIComponent();
    });


    opaTest("The AppSearch can be switched to selection view - a search then returns to results view", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.contentFinder.dialog",
                id: "contentFinderComponent",
                componentData: oComponentData
            }
        }).then(function () {
            fnResizeSapUiComponentContainerToDesktop();
            const oComponent = Component.getComponentById("contentFinderComponent");
            oComponent.attachEvent("visualizationFilterApplied", function (oEvent) {
                let oParameters = oEvent.getParameters();
                oComponent.setVisualizationData(VisualizationFiltering.filterVisualizations(oVisualizationData, oParameters.types, oParameters.search));
            });
            oComponent.show();

        });
        Then.inTheContentFinderDialog.iSeeTheDialog(true);
        When.inTheContentFinderDialog.iSelectAppBoxWithTitle("SAP Minutes");
        Then.inTheContentFinderDialog.iSeeTheAddButton({ text: oResourceBundle.getText("ContentFinder.Button.Add", [1]) });
        When.inTheContentFinderDialog.iToggleSelectionView();
        Then.inTheContentFinderDialog.iSeeTheSelectionToggleButton({ pressed: true, enabled: true });
        When.inTheContentFinderDialog.iSearchForAnApplication("My Leave");
        Then.inTheContentFinderDialog.iSeeTheSelectionToggleButton({ pressed: false, enabled: true });
        Then.inTheContentFinderDialog.iSeeTheAppSearchTitle(oResourceBundle.getText("ContentFinder.AppSearch.Title.SearchResult", ["My Leave", 3]));

        Then.iTeardownMyUIComponent();
    });

    opaTest("Empty catalog in category tree is selected", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.contentFinder.dialog",
                id: "contentFinderComponent",
                settings: {
                    noItemsInCatalogDescription: "some description"
                },
                componentData: oComponentData
            }
        }).then(function () {
            fnResizeSapUiComponentContainerToDesktop();
            const oComponent = Component.getComponentById("contentFinderComponent");
            oComponent.setCategoryTree([
                { title: "All Tiles" },
                {
                    title: "Catalog",
                    nodes: [
                        { title: "MyCatalog 1" },
                        { title: "MyCatalog 2" }
                    ]
                }
            ]);

            oComponent.attachEvent("visualizationFilterApplied", function () {
                oComponent.setVisualizationData(this.oVisualizationsEmpty);
            }.bind(this));
            oComponent.show();
        });

        Then.inTheContentFinderDialog.iSeeTheCategoryTree(true);
        When.inTheContentFinderDialog.iPressOnACatalog("MyCatalog 1");
        Then.inTheContentFinderDialog.iSeeNoDataMessageWithCategoryTree("some description");
        Then.inTheContentFinderDialog.iSeeTheAppSearchTitle(oResourceBundle.getText("ContentFinder.AppSearch.Title.NoVisualization", "Tiles"));

        Then.iTeardownMyUIComponent();
    });

    opaTest("The ContentFinder doesn't show undefined properties on the AppBoxes", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.contentFinder.dialog",
                id: "contentFinderComponent",
                componentData: oComponentData
            }
        }).then(function () {
            fnResizeSapUiComponentContainerToDesktop();
            const oComponent = Component.getComponentById("contentFinderComponent");
            oComponent.attachEvent("visualizationFilterApplied", function (oEvent) {
                const oParameters = oEvent.getParameters();
                oComponent.setVisualizationData(VisualizationFiltering.filterVisualizations(oVisualizationData, oParameters.types, oParameters.search));
            });
            oComponent.show();
        });
        Then.inTheContentFinderDialog.iDontSeeTheAvatarIfNoIconIsDefinedOnAppBox();

        Then.iTeardownMyUIComponent();
    });

    opaTest("The ContentFinder doesn't show undefined properties in the list", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.contentFinder.dialog",
                id: "contentFinderComponent",
                componentData: oComponentData
            }
        }).then(function () {
            fnResizeSapUiComponentContainerToDesktop();
            const oComponent = Component.getComponentById("contentFinderComponent");
            oComponent.attachEvent("visualizationFilterApplied", function (oEvent) {
                const oParameters = oEvent.getParameters();
                oComponent.setVisualizationData(VisualizationFiltering.filterVisualizations(oVisualizationData, oParameters.types, oParameters.search));
            });
            oComponent.getModel().setProperty("/visualizations/listView", true);
            oComponent.show();
        });
        Then.inTheContentFinderDialog.iDontSeeTheAvatarIfNoIconIsDefinedInList();

        Then.iTeardownMyUIComponent();
    });
});
