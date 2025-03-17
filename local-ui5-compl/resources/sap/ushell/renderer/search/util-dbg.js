// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/Element",
    "sap/ushell/Container"
], function (Element, Container) {
    "use strict";

    return {
        isSearchFieldExpandedByDefault: function () {
            var shellHeader = Element.getElementById("shell-header") || { isExtraLargeState: function () { return false; } };
            var shellCtrl = Container.getRendererInternal("fiori2").getShellController();
            var shellView = shellCtrl.getView();
            var shellConfig = (shellView.getViewData() ? shellView.getViewData().config : {}) || {};
            return shellConfig.openSearchAsDefault || shellHeader.isExtraLargeState();
        }
    };

});
