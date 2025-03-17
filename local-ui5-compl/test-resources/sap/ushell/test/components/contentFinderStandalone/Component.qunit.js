// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.contentFinder.Component
 */
sap.ui.define([
    "sap/ui/core/Component",
    "sap/ui/core/mvc/View"
], function (
    Component,
    View
) {
    "use strict";
    /* global QUnit, sinon */

    QUnit.dump.maxDepth = 10;
    const sandbox = sinon.createSandbox();

    const fnCreateComponent = async function (oSettings, oComponentData) {
        sandbox.stub(View, "create");

        return Component.create({
            name: "sap.ushell.components.contentFinderStandalone"
        });
    };

    QUnit.module("The ContentFinderStandalone Component", {
        beforeEach: async function () {
            this.oComponent = await fnCreateComponent();
        }
    });

    QUnit.test("Instantiation of the component works", function (assert) {
        const oExpectedManifestEntry = {
            settings: {
                id: "contentFinderAppSearch",
                enablePersonalization: false,
                noItemsInCatalogDescription: "When there are apps, you will see them here.",
                showAppBoxFieldsPlaceholder: false,
                showApplicationLaunchButton: true,
                showCategoryTreeWhenEmpty: false
            },
            componentData: {
                visualizationFilters: {
                    displayed: [
                        "tiles"
                    ],
                    selected: "tiles",
                    available: [
                        {
                            key: "tiles",
                            title: "Tiles",
                            types: [
                                "sap.ushell.StaticAppLauncher",
                                "sap.ushell.DynamicAppLauncher",
                                "ssuite.smartbusiness.tiles.dual",
                                "ssuite.smartbusiness.tiles.numeric",
                                "ssuite.smartbusiness.tiles.contribution",
                                "ssuite.smartbusiness.tiles.deviation",
                                "ssuite.smartbusiness.tiles.trend",
                                "ssuite.smartbusiness.tiles.comparison"
                            ]
                        }
                    ]
                }
            },
            name: "sap.ushell.components.contentFinder",
            lazy: true
        };

        assert.ok(this.oComponent, "The component was instantiated.");
        assert.deepEqual(this.oComponent.getManifestEntry("/sap.ui5/componentUsages/appSearch"), oExpectedManifestEntry, "The manifest entry was set correctly.");
    });
});
