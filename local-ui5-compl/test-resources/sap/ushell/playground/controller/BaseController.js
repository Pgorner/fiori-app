// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/Element",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
], function (
    Element,
    Controller,
    UIComponent
) {
    "use strict";

    return Controller.extend("sap.ushell.playground.controller.BaseController", {
        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },
        navigateTo: function (routeName) {
            this._destroyControlsWithHardcodedIds();
            this.getRouter().navTo(routeName);
        },
        _destroyControlsWithHardcodedIds: function () {
            var aIds = [
                "sapUshellNavHierarchyItems",
                "navMenuInnerTitle",
                "sapUshellRelatedAppsLabel",
                "sapUshellNavRelatedAppsFlexBox",
                "sapUshellRelatedAppsItems",
                "allMyAppsView"
            ];
            var oControl;

            for (var i = 0; i < aIds.length; i++) {
                oControl = Element.getElementById(aIds[i]);
                if (oControl) {
                    oControl.destroy();
                }
            }
        },

        // to be overridden by the extending controller
        prepareMocks: function () {},

        // to be overridden by the extending controller
        restoreMocks: function () {}
    });
});
