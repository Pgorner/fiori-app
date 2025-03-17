// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * This OPA journey will test the ContentFinder component.
 */
sap.ui.define([
    "sap/ushell/Container",
    "sap/ui/test/opaQunit",
    "sap/ui/thirdparty/sinon-4",
    "sap/ushell/opa/testSiteData/ContentFinder/ContentFinderVisualizations",
    "sap/ui/core/Component",
    "sap/ui/model/resource/ResourceModel",
    "sap/ushell/opa/utils/ContentFinder/VisualizationFiltering",
    "sap/ushell/utils/workpage/WorkPageService",
    "sap/ushell/components/contentFinder/CatalogService",
    "sap/ushell/opa/tests/contentFinderStandalone/pages/General"
], function (
    Container,
    opaTest,
    sinon,
    oVisualizationData,
    Component,
    ResourceModel,
    VisualizationFiltering,
    WorkPageService,
    CatalogService
) {
    "use strict";

    const sandbox = sinon.createSandbox();

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
    QUnit.module("ContentFinderStandalone", {
        before: function () {
            this.oVisualizationTypes = {
                tiles: ["sap.ushell.StaticAppLauncher", "sap.ushell.DynamicAppLauncher"]
            };
            this.oResourceBundle = new ResourceModel({
                bundleUrl: sap.ui.require.toUrl("sap/ushell/components/contentFinder/resources/resources.properties")
            }).getResourceBundle();
            this.oResourceBundleStandalone = new ResourceModel({
                bundleUrl: sap.ui.require.toUrl("sap/ushell/components/contentFinderStandalone/resources/resources.properties")
            }).getResourceBundle();
        },
        beforeEach: function () {
            sandbox.stub(Container, "getRendererInternal").returns({
                getRouter: sandbox.stub().returns({
                    getRoute: sandbox.stub().withArgs("appfinder").returns({
                        attachMatched: sandbox.stub()
                    })
                })
            });
            this.oWorkPageLoadVisualizationsStub = sandbox.stub(WorkPageService.prototype, "loadVisualizations");

            this.oFilteredData = VisualizationFiltering.filterVisualizations(oVisualizationData, this.oVisualizationTypes.tiles);
            sandbox.stub(CatalogService.prototype, "getCatalogs").resolves(({ catalogs: [], totalCount: 0 }));
            this.oVisualizationsEmpty = { visualizations: { nodes: [], totalCount: 0 } };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    opaTest("No categories (fullscreen)", function (Given, When, Then) {
        this.oWorkPageLoadVisualizationsStub.withArgs({}).resolves(this.oFilteredData);

        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.contentFinderStandalone",
                id: "contentFinderStandaloneComponent"
            }
        });

        When.onTheContentFinderStandaloneView.iSetContextData({
            restrictedVisualizations: [
                "8adf91e9-b17a-425e-8053-f39b62f0c31e5",
                "8adf91e9-b17a-425e-8053-f39b62f0c31e2"
            ]
        });

        Then.onTheContentFinderStandaloneView.iSeeTheCategoryTree(false);
        Then.onTheContentFinderStandaloneView.iSeeTheCategoryTreeToggleButton({pressed: false});
        Then.onTheContentFinderStandaloneView.iSeeTheSearchField();
        Then.onTheContentFinderStandaloneView.iSeeTheGridList();
        Then.onTheContentFinderStandaloneView.iSeeANumberOfAppBoxes(12);
        Then.onTheContentFinderStandaloneView.iSeeTheSelectionToggleButton({ pressed: false, enabled: false, visible: false });
        Then.onTheContentFinderStandaloneView.iSeeTheHighlightedAppBoxWithHelpId("8adf91e9-b17a-425e-8053-f39b62f0c31e5");
        Then.onTheContentFinderStandaloneView.iSeeTheHighlightedAppBoxWithHelpId("8adf91e9-b17a-425e-8053-f39b62f0c31e2");
        Then.onTheContentFinderStandaloneView.iSeeTheAppBoxWithHelpIdAndIcon("8adf91e9-b17a-425e-8053-f39b62f0c31e5", "sap-icon://create-leave-request");
        Then.onTheContentFinderStandaloneView.iSeeTheAppBoxWithHelpIdAndIcon("8adf91e9-b17a-425e-8053-f39b62f0c31e3", "sap-icon://product");
        Then.onTheContentFinderStandaloneView.iSeeTheOpenAppButton();

        When.onTheContentFinderStandaloneView.iToggleListView();
        Then.onTheContentFinderStandaloneView.iSeeTheTable();
        Then.onTheContentFinderStandaloneView.iSeeANumberOfAppListItems(12);
        Then.onTheContentFinderStandaloneView.iSeeTheHighlightedListItemWithHelpId("8adf91e9-b17a-425e-8053-f39b62f0c31e5");
        Then.onTheContentFinderStandaloneView.iSeeTheHighlightedListItemWithHelpId("8adf91e9-b17a-425e-8053-f39b62f0c31e2");

        Then.iTeardownMyUIComponent();
    });

    opaTest("No categories (fullscreen), empty visualizations", function (Given, When, Then) {
        this.oWorkPageLoadVisualizationsStub.withArgs({}).resolves({});

        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.contentFinderStandalone",
                id: "contentFinderStandaloneComponent"
            }
        }).then(() => {
            fnResizeSapUiComponentContainerToDesktop();
        });

        Then.onTheContentFinderStandaloneView.iSeeTheCategoryTree(false);
        Then.onTheContentFinderStandaloneView.iSeeTheCategoryTreeToggleButton({pressed: false});
        Then.onTheContentFinderStandaloneView.iSeeTheGridList();
        Then.onTheContentFinderStandaloneView.iSeeNoDataMessageWithoutCategoryTree();

        When.onTheContentFinderStandaloneView.iToggleListView();
        Then.onTheContentFinderStandaloneView.iSeeTheTable();
        Then.onTheContentFinderStandaloneView.iSeeNoDataMessageWithoutCategoryTree();

        Then.iTeardownMyUIComponent();
    });

    opaTest("Empty catalog is selected", function (Given, When, Then) {
        this.oWorkPageLoadVisualizationsStub.withArgs({}).resolves({});

        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.contentFinderStandalone",
                id: "contentFinderStandaloneComponent"
            }
        }).then(() => {
            fnResizeSapUiComponentContainerToDesktop();
            const oComponentStandalone = Component.getComponentById("contentFinderStandaloneComponent");
            const oComponent = oComponentStandalone.getRootControl().byId("contentFinderStandaloneComponentContainer").getComponentInstance();
            oComponent.setCategoryTree([
                { title: "All Tiles" },
                {
                    title: "Catalog",
                    nodes: [
                        { title: "MyCatalog 1" },
                        { title: "MyCatalog 2" }
                    ]
                }]);
        });

        Then.onTheContentFinderStandaloneView.iSeeTheCategoryTreeToggleButton({pressed: true});
        Then.onTheContentFinderStandaloneView.iSeeTheCategoryTree(true);
        When.onTheContentFinderStandaloneView.iPressOnACatalog("MyCatalog 1");
        Then.onTheContentFinderStandaloneView.iSeeNoDataMessageWithCategoryTree(
            this.oResourceBundleStandalone.getText("ContentFinderStandalone.AppSearch.IllustratedMessage.NoItems.InCatalog.Description")
        );
        Then.iTeardownMyUIComponent();
    });

    opaTest("The AppSearch can be toggled to a list view and back to a grid view", function (Given, When, Then) {
        this.oWorkPageLoadVisualizationsStub.withArgs({}).resolves(this.oFilteredData);

        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.contentFinderStandalone",
                id: "contentFinderStandaloneComponent"
            }
        }).then(() => {
            fnResizeSapUiComponentContainerToDesktop();
        });

        When.onTheContentFinderStandaloneView.iToggleListView();
        Then.onTheContentFinderStandaloneView.iSeeTheTable();
        Then.onTheContentFinderStandaloneView.iSeeANumberOfAppListItems(12);

        When.onTheContentFinderStandaloneView.iToggleGridView();
        Then.onTheContentFinderStandaloneView.iSeeTheGridList();
        Then.onTheContentFinderStandaloneView.iSeeANumberOfAppBoxes(12);

        Then.iTeardownMyUIComponent();
    });

    opaTest("The AppSearch can be toggled to a list view and search returns result", function (Given, When, Then) {
        const sSearchTerm = "My Leave";
        this.oWorkPageLoadVisualizationsStub.callsFake((oFilter) => {
            if (oFilter.filter) {
                const oResult = VisualizationFiltering.filterVisualizations(
                    oVisualizationData,
                    this.oVisualizationTypes.tiles,
                    sSearchTerm
                );
                return Promise.resolve(oResult);
            }
            return Promise.resolve(this.oFilteredData);
        });

        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.contentFinderStandalone",
                id: "contentFinderStandaloneComponent"
            }
        }).then(() => {
            fnResizeSapUiComponentContainerToDesktop();
        });

        When.onTheContentFinderStandaloneView.iToggleListView();
        When.onTheContentFinderStandaloneView.iSearchForAnApplication(sSearchTerm);
        Then.onTheContentFinderStandaloneView.iSeeANumberOfAppListItems(3);
        Then.onTheContentFinderStandaloneView.iSeeTheAppSearchTitle(this.oResourceBundle.getText("ContentFinder.AppSearch.Title.SearchResult", [sSearchTerm, 3]));

        Then.iTeardownMyUIComponent();
    });

    opaTest("Search catalog by title, providerId and providerLabel", function (Given, When, Then) {
        this.oWorkPageLoadVisualizationsStub.withArgs({}).resolves(this.oFilteredData);
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "sap.ushell.components.contentFinderStandalone",
                id: "contentFinderStandaloneComponent"
            }
        }).then(() => {
            fnResizeSapUiComponentContainerToDesktop();
            const oComponentStandalone = Component.getComponentById("contentFinderStandaloneComponent");
            const oComponent = oComponentStandalone.getRootControl().byId("contentFinderStandaloneComponentContainer").getComponentInstance();
            oComponent.setCategoryTree([
                { title: "All Tiles" },
                {
                    title: "Catalog",
                    nodes: [
                        { title: "MyCatalog 1", contentProviderId: "provider one id", contentProviderLabel: "label one" },
                        { title: "MyCatalog 2", contentProviderId: "provider two id", contentProviderLabel: "label two" },
                        { title: "MyCatalog 3", contentProviderId: "provider three id", contentProviderLabel: "label three" }
                    ]
                }]);
        });

        When.onTheContentFinderStandaloneView.iSearchForACatalog("MyCatalog 1");
        Then.onTheContentFinderStandaloneView.iSeeTheSearchedCatalogsByTitle("MyCatalog 1");

        When.onTheContentFinderStandaloneView.iSearchForACatalog("provider two id");
        Then.onTheContentFinderStandaloneView.iSeeTheSearchedCatalogsByTitle("MyCatalog 2");

        When.onTheContentFinderStandaloneView.iSearchForACatalog("label three");
        Then.onTheContentFinderStandaloneView.iSeeTheSearchedCatalogsByTitle("MyCatalog 3");

        Then.iTeardownMyUIComponent();
    });
});
