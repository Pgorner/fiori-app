// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/core/mvc/View",
    "sap/esh/search/ui/i18n",
    "sap/base/util/ObjectPath",
    "sap/ui/core/routing/Router",
    "sap/ushell/Container"
], function (UIComponent, View, i18n, ObjectPath, Router, Container) {
    "use strict";

    return UIComponent.extend("sap/ushell/renderer/search/searchComponent", {
        metadata: {
            manifest: "json",
            library: "sap.ushell",
            interfaces: ["sap.ui.core.IAsyncContentCreation"],
            config: {
                title: i18n.getText("searchAppTitle"),
                compactContentDensity: true,
                cozyContentDensity: true
            }
        },
        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            this.oRouter = new Router();
            this.oRouter.initialize();
        },
        getRouter: function () {
            return this.oRouter;
        },
        createContent: function () {
            var sViewName;
            var bIsSearchCEPEnabled = ObjectPath.get("sap-ushell-config.services.SearchCEP") !== undefined,
                sPlatform = Container.getFLPPlatform(true),
                bIsCEPStandard = bIsSearchCEPEnabled === true && sPlatform === "cFLP";

            if (bIsCEPStandard === true) {
                sViewName = "module:sap/ushell/renderer/search/searchComponent/view/CEPSearchApp.view";
            } else {
                sViewName = "module:sap/ushell/renderer/search/searchComponent/view/SearchApp.view";
            }
            return View.create({
                id: "searchContainerApp",
                viewName: sViewName
            });
        }
    });
});
