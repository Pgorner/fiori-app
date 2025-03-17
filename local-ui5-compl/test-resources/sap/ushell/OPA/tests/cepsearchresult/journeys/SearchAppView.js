// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * This OPA journey will test the WorkPageBuilder via edit mode.
 */
sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ui/core/Component",
    "sap/ui/thirdparty/sinon-4",
    "sap/base/util/deepExtend",
    "sap/ushell/test/components/cepsearchresult/app/data/GetAppsResult",
    "sap/ushell/adapters/cep/SearchCEPAdapter",
    "sap/ushell/Container",
    "sap/ui/core/library",
    "sap/ushell/opa/tests/cepsearchresult/pages/SearchResultApp"
], function (
    opaTest,
    Component,
    sinon,
    deepExtend,
    GetAppsResult,
    SearchCEPAdapter,
    Container,
    library
) {
    "use strict";

    /* global QUnit */
    var sandbox = sinon.createSandbox({});

    QUnit.module("SearchApplication", {
        beforeEach: function () {
            return Container.init("local")
                .then(function () {
                    this.oCDMService = {
                        getApplications: sandbox.stub().resolves({})
                    };
                    var oServiceWrapper = sandbox.stub(Container, "getServiceAsync");
                    oServiceWrapper.callThrough().withArgs("CommonDataModel").resolves(this.oCDMService);
                    oServiceWrapper.callThrough().withArgs("SearchCEP").resolves(
                        new SearchCEPAdapter()
                    );
                    oServiceWrapper.callThrough().withArgs("SearchableContent").resolves({
                        getApps: function () {
                            return GetAppsResult;
                        }
                    });
                }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    opaTest("The SearchResultApp is loaded, searched and highlighted", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            name: "sap.ushell.components.cepsearchresult.app",
            componentConfig: {
                name: "sap.ushell.components.cepsearchresult.app",
                id: "cepsearchresultAppComponent",
                componentData: {}
            }
        });
        Then.inSearchApplication.iSeeThePageTitle("Search Results for:  (28)");
        Then.inSearchApplication.iSeeNoHighlighting();
        Given.inSearchApplication.iSearchFor("application", "a");
        Then.inSearchApplication.iSeeThePageTitle("Search Results for: a (26)");
        Then.inSearchApplication.iSeeHighlightingFor("a");
        Then.iTeardownMyUIComponent();
    });

    opaTest("The SearchResultApp can search", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            name: "sap.ushell.components.cepsearchresult.app",
            componentConfig: {
                name: "sap.ushell.components.cepsearchresult.app",
                id: "cepsearchresultAppComponent",
                componentData: {}
            }
        }).then(function () {
        });
        Given.inSearchApplication.iSearchFor("application", "parameter");
        Then.inSearchApplication.iSeeHighlightingFor("parameter");
        Then.inSearchApplication.iSeeTextInTileAtPos("Action parameter Rename Case 1", 0);
        Then.inSearchApplication.iSeeTextInTileAtPos("App State form sample", 1);
        Then.inSearchApplication.iSeeTextInTileAtPos("Tile with parameters", 2);
        Then.iTeardownMyUIComponent();
    });

    opaTest("The SearchResultApp can page", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            name: "sap.ushell.components.cepsearchresult.app",
            componentConfig: {
                name: "sap.ushell.components.cepsearchresult.app",
                id: "cepsearchresultAppComponent",
                componentData: {}
            }
        });

        Given.inSearchApplication.iSearchFor("application", "a");
        Then.inSearchApplication.iSeeTextInTileAtPos("Action parameter Rename Case 1", 0);
        Then.inSearchApplication.iSeeTextInTileAtPos("Display only on Desktop", 9);
        Then.inSearchApplication.iSeePaginator({
            beginArrow: "disabled",
            _1: "selected",
            _2: "enabled",
            _3: "enabled",
            endArrow: "enabled"
        });

        Given.inSearchApplication.iPressPagingButton(1);
        Then.inSearchApplication.iSeeTextInTileAtPos("Action parameter Rename Case 1", 0);
        Then.inSearchApplication.iSeeTextInTileAtPos("Display only on Desktop", 9);
        Then.inSearchApplication.iSeePaginator({
            beginArrow: "disabled",
            _1: "selected",
            _2: "enabled",
            _3: "enabled",
            endArrow: "enabled"
        });

        Given.inSearchApplication.iPressPagingButton(2);
        Then.inSearchApplication.iSeeTextInTileAtPos("Dynamic Tile", 0);
        Then.inSearchApplication.iSeeTextInTileAtPos("Dynamic Tile with User Defaults", 9);
        Then.inSearchApplication.iSeePaginator({
            beginArrow: "enabled",
            _1: "enabled",
            _2: "selected",
            _3: "enabled",
            endArrow: "enabled"
        });

        Given.inSearchApplication.iPressPagingButton(3);
        Then.inSearchApplication.iSeeTextInTileAtPos("Example Page...", 0);
        Then.inSearchApplication.iSeeTextInTileAtPos("Tile with parameters from user defaults", 3);
        Then.inSearchApplication.iSeePaginator({
            beginArrow: "enabled",
            _1: "enabled",
            _2: "enabled",
            _3: "selected",
            endArrow: "disabled"
        });
        Then.iTeardownMyUIComponent();
    });
});
