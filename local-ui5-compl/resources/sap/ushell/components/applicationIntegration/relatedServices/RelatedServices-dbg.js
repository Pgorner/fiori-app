// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview handle all the services for the different applications.
 * @version 1.132.1
 */
sap.ui.define([
    "sap/ui/core/library",
    "sap/ui/core/routing/History",
    "sap/ushell/Container"
], (
    coreLibrary,
    Ui5History,
    Container
) => {
    "use strict";

    // shortcut for sap.ui.core.routing.HistoryDirection
    const Ui5HistoryDirection = coreLibrary.routing.HistoryDirection;

    function RelatedServices () {
        //handle the history service
        let bDefaultBrowserBack = false;
        let fnCustomBackNavigation;

        this.isBackNavigation = function () {
            return Ui5History.getInstance().getDirection() === Ui5HistoryDirection.Backwards;
        };

        this.navigateBack = async function () {
            if (bDefaultBrowserBack === true) {
                window.history.back();

            } else if (fnCustomBackNavigation) {
                fnCustomBackNavigation();

            } else {
                const Navigation = await Container.getServiceAsync("Navigation");
                const bIsInitialNavigation = await Navigation.isInitialNavigation();

                if (bIsInitialNavigation) {
                    // go back home
                    return Navigation.navigate({ target: { shellHash: "#" }, writeHistory: false });
                }

                window.history.back();
            }
        };

        this.setNavigateBack = function (inFnBKImp) {
            bDefaultBrowserBack = false;
            fnCustomBackNavigation = inFnBKImp;
        };

        this.resetNavigateBack = function () {
            bDefaultBrowserBack = true;
            fnCustomBackNavigation = undefined;
        };

        this.restore = function (oInServices) {
            bDefaultBrowserBack = oInServices.bDefaultBrowserBack;
            fnCustomBackNavigation = oInServices.fnCustomBackNavigation;
        };

        this.store = function (oServices) {
            oServices.bDefaultBrowserBack = bDefaultBrowserBack;
            oServices.fnCustomBackNavigation = fnCustomBackNavigation;
        };

        /**
         * ONLY FOR TESTING!
         * Resets the RelatedServices to its initial state.
         *
         * @since 1.132.0
         * @private
         */
        this.reset = function () {
            bDefaultBrowserBack = false;
            fnCustomBackNavigation = undefined;
        };
    }


    return new RelatedServices();
}, /* bExport= */ true);
