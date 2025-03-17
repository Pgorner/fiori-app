// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/library",
    "sap/ui/core/UIComponent",
    "sap/ushell/Container"
], function (ushellLibrary, UIComponent, Container) {
    "use strict";

    // shortcut for sap.ushell.NavigationState
    var NavigationState = ushellLibrary.NavigationState;

    return UIComponent.extend("sap.ushell.demo.AppDirtyStateProvider.Component", {
        metadata: {
            manifest: "json"
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);

            var oRouter = this.getRouter();

            // Keep the current view when it's displayed
            oRouter.getTargets().attachDisplay(this._storeCurrentView, this);
            // Initialize the application router for route-based view creation
            oRouter.initialize();

            this.fnGetDirtyStateProvider = this.getDirtyState.bind(this);
            Container.registerDirtyStateProvider(this.fnGetDirtyStateProvider);
        },

        exit: function () {
            this.getRouter().getTargets().detachDisplay(this._storeCurrentView, this);
            Container.deregisterDirtyStateProvider(this.fnGetDirtyStateProvider);
        },

        /**
         * Determine if a view of the application is in dirty state.
         *
         * @param {sap.ui.core.mvc.View} oView The view to check
         *
         * @returns {boolean} Whether the view is dirty
         */
        _isViewDirty: function (oView) {
            var oModel = oView.getModel();
            var bIsViewDirty = oModel && oModel.getProperty("/dirtyState");

            return bIsViewDirty;
        },

        /**
         * The dirty state provider is called every time the navigation is about
         * to happen. Dirty flag providers normally take decisions on the app
         * dirty state based on the current navigation context, which is provided
         * to them as the first argument.
         *
         * @param {object} oNavigationContext The context to determine the dirty state
         * @returns {boolean} Whether the dirty flag can be shown or not.
         */
        getDirtyState: function (oNavigationContext) {
            var bIsDirty = this._isViewDirty(this._oCurrentView);

            /*
             * Dirty flag providers are normally called while the navigation is
             * ongoing. However, they can also be called after the navigation
             * occurred by any consumer via the public API
             * sap.ushell.Container#getDirtyFlag
             */
            if (oNavigationContext.status === NavigationState.Finished) {
                return bIsDirty;
            }

            /*
             * On external navigation the application will unload and the data
             * may be lost in that case. So here we return based on the view
             * dirty state.
             */
            if (oNavigationContext.isCrossAppNavigation) {
                return bIsDirty;
            }

            /*
             * There might be some views of the application that retain the data
             * entered in the current view. This knowledge must be available
             * to the current application.
             */
            var sCurrentInnerAppRoute = oNavigationContext.innerAppRoute;
            var oRouteInfo = this.getRouter().getRouteInfoByHash(sCurrentInnerAppRoute);
            switch (oRouteInfo.name) {
                case "employeeOverview":
                    return bIsDirty;
                default:
                    return false;
            }
        },

        /**
         * Stores the current view (navigated via the router) in the application
         * component.
         *
         * @param {sap.ui.base.Event} oTargetDisplayEvent The UI5 event object
         */
        _storeCurrentView: function (oTargetDisplayEvent) {
            this._oCurrentView = oTargetDisplayEvent.getParameter("view");
        }
    });
});
