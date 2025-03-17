// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/Component",
    "sap/m/MessageToast",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/mvc/XMLView",
    "sap/ui/model/json/JSONModel"
], function (Log, Component, MessageToast, Controller, XMLView, JSONModel) {
    "use strict";

    const S_DEFAULT_VIEW_NAME = "Detail";
    const O_ALLOWED_VIEW_NAMES = {
        IntentResolution: true,
        ShowInbound: true,
        ShowResolvedTarget: true,
        Detail: true,
        Settings: true,
        InboundsBrowser: true,
        GetEasyAccessSystems: true
    };

    return Controller.extend("sap.ushell.demo.TargetResolutionTool.Main", {
        oInnerAppRouter: null,
        oApp: null, // the SplitApp Control instance of this view

        getMyComponent: function () {
            const sComponentId = Component.getOwnerIdFor(this.getView());
            const myComponent = Component.getComponentById(sComponentId);
            return myComponent;
        },

        /*
         * Callback for hash changes, this is registered with the navigation framework
         *
         * our route has one argument, which is passed as the first argument
         *
         *  (for the _home route, sViewName is undefined)
         */
        _handleNavEvent: function (oEvent) {
            const sRouteName = oEvent.getParameter("name");

            if (sRouteName === "toaView") {
                this.doNavigate("toView", oEvent.getParameter("arguments").viewName);
            }

            if (sRouteName === "_home") {
                // we have an unrecognizable route,
                // use the startup parameterif we have a viewname prameter
                const oStartupParameters = this.getMyComponent().getComponentData().startupParameters;
                const sStartupParameterView = oStartupParameters && oStartupParameters.View && oStartupParameters.View[0];
                const sViewName = O_ALLOWED_VIEW_NAMES[sStartupParameterView];

                if (sStartupParameterView && !sViewName) {
                    Log.error("Unknown startup parameter value for View, legal values are "
                        + Object.keys(O_ALLOWED_VIEW_NAMES).join(", "));

                    return;
                }

                this.doNavigate("toView", sViewName || S_DEFAULT_VIEW_NAME);
            }
        },

        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberof Main
         */
        onInit: function () {
            // var that = this;
            this.mViewNamesToViews = {};
            this.oApp = this.byId("app");

            this.oViewDataModel = new JSONModel({});

            this.oComponent = this.getMyComponent();

            XMLView.create({
                viewName: "sap.ushell.demo.TargetResolutionTool.view.Side",
                id: this.createId("List")
            }).then(function (sideView) {
                sideView.getController().oApplication = this;
                this.oApp.addMasterPage(sideView);
            });

            XMLView.create({
                viewName: "sap.ushell.demo.TargetResolutionTool.view." + S_DEFAULT_VIEW_NAME
            }).then(function (detailView) {
                this.mViewNamesToViews.Detail = detailView;
                detailView.getController().oApplication = this;
                this.oApp.addDetailPage(detailView);
                this.oApp.setInitialDetail(detailView); // use the object, not the (generated) id!
            });

            /* obtain the (Controller) Navigator instance */
            this.oInnerAppRouter = this.getMyComponent().getInnerAppRouter();

            this.oInnerAppRouter.attachRouteMatched(this._handleNavEvent, this);
        },

        // construct and register a view if not yet present
        makeViewUilib: function (sViewName) {
            if (this.mViewNamesToViews[sViewName]) {
                return Promise.resolve(this.mViewNamesToViews[sViewName]);
            }

            // construct
            Log.info("sap.ushell.demo.AppNavSample: Creating view + " + sViewName + "... ");

            /* create View */
            return XMLView.create({
                viewName: "sap.ushell.demo.TargetResolutionTool.view." + sViewName,
                viewData: this.oViewDataModel
            }).then((view) => {
                Log.info("sap.ushell.demo.AppNavSample:  Creating view + " + sViewName + " assigned id : " + view.getId());
                this.mViewNamesToViews[sViewName] = view;
                return view;
            });
        },

        navigate: function (sEvent, sNavTarget, oViewData) {
            this.oViewDataModel.setData(oViewData || {});

            if (sEvent === "toHome") {
                // use external navigation to navigate to homepage
                if (this.oCrossAppNavigator) {
                    this.oCrossAppNavigator.toExternal({ target: { shellHash: "#" } });
                }
            } else if (sEvent === "toView") {
                const sView = sNavTarget; // navtarget;
                if (sView === "" || !this.isLegalViewName(sView)) {
                    this.oApp.toDetail(this.mViewNamesToViews.Detail);
                } else {
                    /* *Nav* (7) Trigger inner app navigation */
                    this.oInnerAppRouter.navTo("toaView", { viewName: sView }, true);
                }
            } else if (sEvent === "back") {
                this.oApp.back();
            } else if (sEvent === "backDetail") {
                this.oApp.backDetail();
            } else {
                Log.info("sap.ushell.demo.AppNavSample: Unknown navigation");
            }
        },

        isLegalViewName: function (sViewNameUnderTest) {
            return !!O_ALLOWED_VIEW_NAMES[sViewNameUnderTest];
        },

        doNavigate: function (sEvent, sNavTarget) {
            if (sEvent === "toView") {
                const sView = sNavTarget; // navtarget
                if (sView === "" || !this.isLegalViewName(sView)) {
                    this.oApp.toDetail(this.mViewNamesToViews.Detail);
                } else {
                    this.makeViewUilib(sView).then((view) => {
                        if (!this.mViewNamesToViews[sView]) {
                            this.oApp.addPage(view);
                        }

                        this.oApp.toDetail(view);
                        if (view.getControllerName()) {
                            view.getController().oApplication = this;
                        } else {
                            MessageToast.show("Target view has no controller associated");
                        }
                    });
                }
            } else if (sEvent === "back") {
                this.oApp.back();
            } else if (sEvent === "backDetail") {
                this.oApp.backDetail();
            } else {
                Log.info("sap.ushell.demo.AppNavSample: Unknown navigation");
            }
        },

        /**
         * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
         * @memberof Main
         */
        onExit: function () {
            this.mViewNamesToViews = {};
            if (this.oInnerAppRouter) {
                this.oInnerAppRouter.destroy();
            }
        }
    });
});
