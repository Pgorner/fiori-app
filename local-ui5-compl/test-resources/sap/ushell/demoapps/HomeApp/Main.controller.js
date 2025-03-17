// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/EventHub",
    "sap/ushell/library",
    "sap/ushell/utils",
    "sap/ushell/utils/WindowUtils",
    "sap/ushell/Container"
], function (
    Controller,
    JSONModel,
    EventHub,
    ushellLibrary,
    ushellUtils,
    WindowUtils,
    Container
) {
    "use strict";

    // ===========================================================================================
    //       This app is only used for testing and shall not be used productively!
    // ===========================================================================================

    const ContentNodeType = ushellLibrary.ContentNodeType;

    return Controller.extend("sap.ushell.demo.HomeApp.Main", {
        onInit: async function () {
            var oI18nModel = this.getOwnerComponent().getModel("i18n");
            this.oView.setModel(oI18nModel, "i18n");

            const oModel = new JSONModel({
                header: {
                    navigation: `<h2>${oI18nModel.getProperty("navigation.title")}</h2>`,
                    pages: `<h2>${oI18nModel.getProperty("pages.title")}</h2>`,
                    recents: `<h2>${oI18nModel.getProperty("recents.title")}</h2>`
                },
                pages: [],
                recents: [],
                navigation: {
                    semanticObject: "Action",
                    action: "toappnavsample",
                    parameters: "foo=bar&key=value"
                }
            });
            this.getView().setModel(oModel);

            this._fetchPages();
            this._fetchRecents();
        },

        getModel: function () {
            return this.getView().getModel();
        },

        onAfterRendering: function () {
            if (!EventHub.last("CustomHomeRendered")) {
                ushellUtils.setPerformanceMark("FLP-TTI-Homepage-Custom");
                // Event is emitted only once
                EventHub.emit("CustomHomeRendered", true);
            } else {
                EventHub.emit("CloseFesrRecord", Date.now());
            }
        },

        _fetchPages: async function () {
            const MenuService = await Container.getServiceAsync("Menu");
            const aContentNodes = await MenuService.getContentNodes([ContentNodeType.Space, ContentNodeType.Page]);

            const aPages = aContentNodes.reduce((pages, spaces) => {
                spaces.children.forEach((page) => {
                    pages.push({
                        label: page.label,
                        spaceId: spaces.id,
                        pageId: page.id
                    });
                });
                return pages;
            }, []);

            this.getModel().setProperty("/pages", aPages);
        },

        navToPage: async function (oEvent) {
            const oPage = oEvent.getSource().getBindingContext().getObject();
            const CrossApplicationNavigationService = await Container.getServiceAsync("CrossApplicationNavigation");

            CrossApplicationNavigationService.toExternal({
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage"
                },
                params: {
                    pageId: oPage.pageId,
                    spaceId: oPage.spaceId
                }
            });
        },

        _fetchRecents: async function () {
            const UserRecentsService = await Container.getServiceAsync("UserRecents");
            const aActivity = await UserRecentsService.getRecentActivity();

            const aRecents = aActivity.map((oItem) => {
                return {
                    label: oItem.title,
                    url: oItem.url
                };
            });
            this.getModel().setProperty("/recents", aRecents);
        },

        navToRecents: async function (oEvent) {
            const oRecent = oEvent.getSource().getBindingContext().getObject();
            const CrossApplicationNavigationService = await Container.getServiceAsync("CrossApplicationNavigation");

            if (oRecent.url.startsWith("#")) {
                CrossApplicationNavigationService.toExternal({
                    target: {
                        shellHash: oRecent.url.substring(1)
                    }
                });
            } else {
                WindowUtils.openUrl(oRecent.url);
            }
        },

        navToTarget: async function () {
            const oModel = this.getModel();
            const CrossApplicationNavigationService = await Container.getServiceAsync("CrossApplicationNavigation");

            const oNavigationData = oModel.getProperty("/navigation");
            const sHash = `#${oNavigationData.semanticObject}-${oNavigationData.action}${oNavigationData.parameters ? "?" + oNavigationData.parameters : ""}`;

            CrossApplicationNavigationService.toExternal({
                target: {
                    shellHash: sHash
                }
            });
        }
    });
});
