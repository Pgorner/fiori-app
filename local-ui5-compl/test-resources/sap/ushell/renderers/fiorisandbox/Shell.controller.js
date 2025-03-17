/* Copyright (c) 2009-2023 SAP SE, All Rights Reserved */
/* eslint-disable valid-jsdoc */

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/dom/includeStylesheet",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/components/container/ApplicationContainer",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ushell/services/Message",
    "sap/ushell/resources",
    "sap/ushell/services/AppConfiguration",
    "sap/ushell/Container"
], function (
    Controller,
    includeStylesheet,
    jQuery,
    ApplicationContainer,
    MessageToast,
    MessageBox,
    MessageService,
    ushellResources,
    AppConfiguration,
    Container
) {
    "use strict";

    return Controller.extend("sap.ushell.renderers.fiorisandbox.Shell", {
        /**
         * Set application container based on information in URL hash.
         */
        doHashChange: function (sShellHash) {
            var oPage = this.getView().byId("ShellViewPage");
            if (!sShellHash) {
                sShellHash = "";
            }
            if (sShellHash.charAt(0) !== "#") {
                sShellHash = "#" + sShellHash;
            }
            // Remove old and add new ApplicationContainer
            oPage.removeContent();
            var oAppContainerInstance = new ApplicationContainer("application-toBeTested");

            if (this.oDefaultApp && sShellHash === "#") {
                // resolve empty hash directly to default app, if specified in config
                oAppContainerInstance.setAdditionalInformation(this.oDefaultApp.additionalInformation);
                oAppContainerInstance.setApplicationType(this.oDefaultApp.applicationType);
                oAppContainerInstance.setUrl(this.oDefaultApp.url);
                oAppContainerInstance.setVisible(true);
                oPage.addContent(oAppContainerInstance);
            } else {
                // resolve via target resolution service
                Container.getServiceAsync("NavTargetResolutionInternal")
                    .then(function (NavTargetResolutionInternal) {
                        NavTargetResolutionInternal.resolveHashFragment(sShellHash)
                            .done(function (oApplication, sParameters) {
                                // set current application before initializing the application
                                AppConfiguration.setCurrentApplication(oApplication);

                                if (oApplication) {
                                    var url = oApplication.url;
                                    if (url && sParameters) {
                                        if (url.indexOf("?") > 0) {
                                            url += "&" + sParameters;
                                        } else {
                                            url += "?" + sParameters;
                                        }
                                    }

                                    oAppContainerInstance.setAdditionalInformation(oApplication.additionalInformation);
                                    oAppContainerInstance.setApplicationType(oApplication.applicationType);
                                    oAppContainerInstance.setUrl(url);
                                }
                                oPage.addContent(oAppContainerInstance);
                            });
                    });
            }
        },

        /**
         * SAPUI5 lifecycle hook.
         */
        onInit: function () {
            var oViewData = this.getView().getViewData();

            // set default app as member if specified in config; is read in doHashChange
            this.oDefaultApp = oViewData && oViewData.config && oViewData.config.defaultApp;

            // dynamically load additional style sheet
            includeStylesheet(sap.ui.require.toUrl("sap.ushell.renderers.fiorisandbox.styles.minimal", ".css"));

            Promise.all([
                Container.getServiceAsync("ShellNavigationInternal"),
                Container.getServiceAsync("MessageInternal")
            ])
                .then(function (aResult) {
                    var oShellNavigationInternal = aResult[0];
                    var oMessage = aResult[1];

                    // initialize the shell navigation service; also triggers the doHashChange callback for the initial load (or an empty hash)
                    oShellNavigationInternal.init(jQuery.proxy(this.doHashChange, this));
                    oMessage.init(jQuery.proxy(this.doShowMessage, this));
                }.bind(this));
        },

        /**
         * Callback registered with Message service. Triggered on message show request.
         *
         * @private
         */
        doShowMessage: function (iType, sMessage, oParameters) {
            if (iType === MessageService.Type.ERROR) {
                MessageBox.show(sMessage, MessageBox.Icon.ERROR,
                    oParameters.title || ushellResources.i18n.getText("error"));
            } else if (iType === MessageService.Type.CONFIRM) {
                if (oParameters.actions) {
                    MessageBox.show(sMessage, MessageBox.Icon.QUESTION, oParameters.title, oParameters.actions, oParameters.callback);
                } else {
                    MessageBox.confirm(sMessage, oParameters.callback, oParameters.title);
                }
            } else {
                MessageToast.show(sMessage, { duration: oParameters.duration || 3000 });
            }
        }
    });
});
