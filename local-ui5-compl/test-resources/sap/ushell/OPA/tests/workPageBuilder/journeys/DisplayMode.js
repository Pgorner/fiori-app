// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * This OPA journey will test the WorkPageBuilder during runtime.
 */
sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/opa/testSiteData/WorkPageBuilder/WorkPageData",
    "sap/ushell/opa/testSiteData/WorkPageBuilder/vizTypes/StaticTile",
    "sap/ushell/opa/testSiteData/WorkPageBuilder/vizTypes/DynamicTile",
    "sap/ui/core/Component",
    "sap/ui/thirdparty/sinon-4",
    "sap/base/util/deepExtend",
    "sap/ui/integration/library",
    "sap/ui/integration/widgets/Card",
    "sap/ushell/Container",
    "sap/ushell/opa/tests/workPageBuilder/pages/DisplayMode"
], function (
    opaTest,
    WorkPageData,
    StaticAppLauncher,
    DynamicAppLauncher,
    Component,
    sinon,
    deepExtend,
    integrationLibrary,
    IntegrationWidgetsCard,
    Container
) {
    "use strict";

    // shortcut for sap.integration.CardDataMode
    const CardDataMode = integrationLibrary.CardDataMode;

    /* global QUnit */
    var sandbox = sinon.createSandbox({});

    IntegrationWidgetsCard.prototype.getDataMode = function () {
        return CardDataMode.Active;
    };

    QUnit.module("WorkPageBuilder", {
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

    opaTest("The first item is focused when opening the workpage.", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            name: "sap.ushell.components.workPageBuilder",
            componentConfig: {
                name: "sap.ushell.components.workPageBuilder",
                id: "workPageBuilderComponent",
                componentData: {}
            }
        }).then(function () {
            var oComponent = Component.getComponentById("workPageBuilderComponent");
            oComponent.setPageData(deepExtend({}, WorkPageData));
        });

        Then.onTheWorkPage.iSeeFocusedTileWithProperties({
            header: "Capital Projects",
            subheader: "All about Finance"
        });
        Then.iTeardownMyUIComponent();
    });

    QUnit.module("WorkPageBuilder - SAP Start Scenario", {
        beforeEach: function () {},
        afterEach: function () {}
    });

    opaTest("The work page builder is rendered in letterboxing mode.", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            name: "sap.ushell.components.workPageBuilder",
            componentConfig: {
                name: "sap.ushell.components.workPageBuilder",
                id: "workPageBuilderComponent",
                componentData: {}
            }
        }).then(function () {
            const oHead = document.getElementsByTagName("head")[0];
            const styleTag = document.createElement("style");

            styleTag.innerHTML = "div.workPageRow{ max-width: 1520px; margin: 0 auto; } div.workPageTitle{ max-width: 1520px; margin: 0 auto; padding-left: 0.5rem; padding-right: 0.5rem; }";
            oHead.appendChild(styleTag);

            const oComponent = Component.getComponentById("workPageBuilderComponent");
            oComponent.setPageData(deepExtend({}, WorkPageData));
        });

        Then.onTheWorkPage.iSeeTheRowsLetterBoxed();
        Then.iTeardownMyUIComponent();
    });
});
