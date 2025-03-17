/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */
sap.ui.define([
    "sap/ui/core/Placeholder"
], function (
    Placeholder
) {
    "use strict";
    var placeHolderHelper = {
        isPlaceHolderEnabled: function () {
            var bEnabledFromFLP =
                window["sap-ushell-config"] &&
                window["sap-ushell-config"].apps &&
                window["sap-ushell-config"].apps.placeholder &&
                window["sap-ushell-config"].apps.placeholder.enabled,
                bPlaceholderEnabled = new window.URLSearchParams(window.location.search).get("sap-ui-xx-placeholder");
            return bEnabledFromFLP === false || bPlaceholderEnabled === "false" ? false : true;
        },
        getPlaceholderInfo: function () {
            return new Placeholder({
                html: "sap/fe/placeholder/view/PlaceholderOVP.fragment.html",
                autoClose: true
            });
        },
        showPlaceholder: function (oNavContainer) {
            if (this.isPlaceHolderEnabled() && !this.bPlaceholderShown) {
                this.navContainer = oNavContainer;
                this.bPlaceholderShown = true;
                oNavContainer.showPlaceholder({ placeholder: this.getPlaceholderInfo() });
            }
        },
        hidePlaceholder: function () {
            if (this.bPlaceholderShown) {
                var oNavContainer = this.navContainer;
                oNavContainer && oNavContainer.hidePlaceholder();
                this.bPlaceholderShown = false;
            }
        },
        hidePlaceholderNeeded: function () {
            return this.bPlaceholderShown;
        }
    };
    return placeHolderHelper;
});
