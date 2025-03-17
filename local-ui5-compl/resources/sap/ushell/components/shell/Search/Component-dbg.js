// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/EventBus",
    "sap/ushell/components/shell/Search/ESearch",
    "sap/ui/core/UIComponent",
    "sap/ui/core/Component",
    "sap/ushell/utils",
    "sap/base/util/ObjectPath",
    "sap/ushell/Container"
], function (EventBus, ESearch, UIComponent, Component, Utils, ObjectPath, Container) {
    "use strict";

    return UIComponent.extend("sap.ushell.components.shell.Search.Component", {
        metadata: {
            manifest: "json",
            library: "sap.ushell"
        },

        createContent: function () {
            var that = this;
            var bIsSearchCEPEnabled = ObjectPath.get("sap-ushell-config.services.SearchCEP") !== undefined;
            // check that search is enabled
            var oShellCtrl = Container.getRendererInternal("fiori2").getShellController(),
                oShellView = oShellCtrl.getView(),
                oShellConfig = (oShellView.getViewData() ? oShellView.getViewData().config : {}) || {};
            var bSearchEnable = (oShellConfig.enableSearch !== false);
            if (!bSearchEnable) {
                EventBus.getInstance().publish("shell", "searchCompLoaded", { delay: 0 });
                return;
            }

            Container.getFLPPlatform().then(function (sPlatform) {
                if (sPlatform === "MYHOME" || (sPlatform === "cFLP" && bIsSearchCEPEnabled === true)) {
                    Component.create({
                        manifest: false,
                        name: "sap.ushell.components.shell.SearchCEP"
                    });
                } else {
                    ESearch.createContent(that);
                    EventBus.getInstance().publish("shell", "searchCompLoaded", { delay: 0 });
                }
                Utils.setPerformanceMark("FLP -- search component is loaded");
            });
        },

        exit: function () {
            ESearch.exit();
        }
    });
});
