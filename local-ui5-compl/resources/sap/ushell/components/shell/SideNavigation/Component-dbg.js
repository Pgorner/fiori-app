// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/ComponentContainer",
    "sap/ui/core/mvc/XMLView",
    "sap/ui/core/UIComponent",
    "sap/ushell/Container"
], function (ComponentContainer, XMLView, UIComponent, Container) {
    "use strict";

    return UIComponent.extend("sap.ushell.components.shell.SideNavigation.Component", {
        metadata: {
            manifest: "json",
            library: "sap.ushell",
            interfaces: ["sap.ui.core.IAsyncContentCreation"]
        },
        init: function () {
            UIComponent.prototype.init.apply(this, arguments);

            this.oMenuModelPromise = Container.getServiceAsync("Menu")
                .then((oMenuService) => {
                    return Promise.all([
                        oMenuService.getMenuModel(),
                        oMenuService.isSideNavigationEnabled()
                    ]);
                })
                .then((aResults) => {
                    const oMenuModel = aResults[0];
                    const bSideNavigationEnabled = aResults[1];

                    this.setModel(oMenuModel, "sideNavigation");

                    if (bSideNavigationEnabled) {
                        return this.oViewPromise.then(() => {
                            const oSideNavigation = new ComponentContainer({
                                id: "SideNavigationComponentContainer",
                                height: "100%",
                                component: this
                            });
                            Container.getRendererInternal().setSideNavigation(oSideNavigation);
                        });
                    }
            });
        },

        getMenuModelPromise: function () {
            return this.oMenuModelPromise;
        },

        createContent: function () {
            this.oViewPromise = XMLView.create({
                viewName: "sap.ushell.components.shell.SideNavigation.view.SideNavigation"
            });

            return this.oViewPromise;
        }
    });
});
