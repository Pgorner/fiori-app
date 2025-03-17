// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/Component",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Container"
], function (
    Component,
    Controller,
    JSONModel,
    Container
) {
    "use strict";

    return Controller.extend("sap.ushell.demo.NavigationSample.controller.GetLinks", {

        oApplication: null,

        onInit: function () {
            this.oInputModel = new JSONModel({
                SO: "Action",
                action: "toNavigation",
                paramsExtended: "",
                compactIntents: false,
                ignoreFormFactor: false
            });

            this.oModel = new JSONModel({
                SO: "Action",
                action: "toNavigation",
                supported: false,
                supportedColor: "red",
                navSupportedColor: "red",
                compactIntents: false,
                treatTechHintAsFilter: false,
                withAtLeastOneUsedParam: false,
                hashFragment: "",
                hashFragmentLength: 0,
                callMethod: "getLinks",
                callCount: 0,
                sortResultsBy: "intent",
                links: [],
                json: "empty"
            });

            this.getView().setModel(this.oInputModel, "mdlInput");
            this.getView().setModel(this.oModel, "v1");

            this.updateFromInputModel();

            // register an event handler on the model, to track future changes
            this.oInputModel.bindTree("/").attachChange(function () {
                this.updateFromInputModel();
            }.bind(this));

            this._initCodeEditor();
        },

        _initCodeEditor: function () {
            var oCodeEditor = this.getView().byId("callInfo");
            var sCallMethod = this.oModel.getProperty("/callMethod") || "";
            var sCallArgs = this.oModel.getProperty("/callArgs") || "";
            var sCodeEditorValue = "sap.ushell.Container.getServiceAsync(\"CrossApplicationNavigation\")\n"
                + "\t .then(function (CrossApplicationNavigation) {\n"
                + "\t\tCrossApplicationNavigation." + sCallMethod + "(" + sCallArgs + ");\n"
                + "\t});";

            oCodeEditor.setValue(sCodeEditorValue);
        },

        onSortResultsByChanged: function (oEvent) {
            var sSortResultsBy = oEvent.getParameters().newValue;
            this.oModel.setProperty("/sortResultsBy", sSortResultsBy);
        },
        handleTextLiveChange: function (oEvent) {
            var oMdlV1 = this.getView().getModel("v1"),
                sSemanticObject = this.byId("f2").getValue() || "",
                sAction = this.byId("f3").getValue() || "",
                // sParams = this.byId("f4").getValue() || "",
                sIntent = "#" + sSemanticObject + "-" + sAction;

            oMdlV1.setProperty("/hashFragment", sIntent);
            oMdlV1.setProperty("/hashFragmentLength", sIntent.length);
        },
        updateFromInputModel: function () {
            var sSemanticObject = this.getView().getModel("mdlInput").getProperty("/SO"),
                sAction = this.getView().getModel("mdlInput").getProperty("/action"),
                bCompactIntents = this.getView().getModel("mdlInput").getProperty("/compactIntents"),
                bIgnoreFormFactor = this.getView().getModel("mdlInput").getProperty("/ignoreFormFactor"),
                sSortResultsBy = this.getView().getModel("v1").getProperty("/sortResultsBy"),
                bTreatTechHintAsFilter = this.getView().getModel("mdlInput").getProperty("/treatTechHintAsFilter"),
                oRootComponent = this.getRootComponent();

            Promise.all([
                Container.getServiceAsync("URLParsing"),
                Container.getServiceAsync("CrossApplicationNavigation")
            ]).then(function (aServices) {
                var oURLParsingService = aServices[0];
                var oCANService = aServices[1];

                // --- call hrefForExternal ---

                this.args = {
                    target: {
                        semanticObject: sSemanticObject,
                        action: sAction
                    }
                };

                var href = oCANService.hrefForExternal(this.args, this.getRootComponent());
                if (this.getView() && this.getView().getModel()) {
                    this.getView().getModel().setProperty("/toGeneratedLink", href);
                }

                // --- call getLinks or getSemanticObjectLinks ---

                var sCallMethod = this.oModel.getProperty("/callMethod", sCallMethod);

                var sCallArgsType,
                    vCallArgs;


                sCallArgsType = "nominal";
                vCallArgs = {
                    semanticObject: sSemanticObject.length > 0 ? sSemanticObject : undefined,
                    action: sAction.length > 0 ? sAction : undefined,
                    treatTechHintAsFilter: !!bTreatTechHintAsFilter,
                    ui5Component: oRootComponent,
                    compactIntents: !!bCompactIntents,
                    ignoreFormFactor: !!bIgnoreFormFactor,
                    sortResultsBy: sSortResultsBy
                };


                function fnCallDoneHandler (aResult) {
                    this.oModel.setProperty("/links", aResult.map(function (oEntry) {
                        return {
                            name: oEntry.text,
                            link: oEntry.intent,
                            linkData: JSON.stringify(oEntry, null, 4),
                            json: JSON.stringify(oEntry),
                            escapedLink: oCANService.hrefForExternal({
                                target: {
                                    shellHash: oEntry.intent
                                }
                            }, oRootComponent)
                        };
                    }));
                }

                if (sCallArgsType === "positional") {
                    oCANService[sCallMethod].apply(oCANService, vCallArgs)
                        .done(fnCallDoneHandler.bind(this));
                } else if (sCallArgsType === "nominal") {
                    oCANService[sCallMethod](vCallArgs)
                        .done(fnCallDoneHandler.bind(this));
                } else {
                    throw new Error("Unknown call argument type '" + sCallArgsType + "'");
                }

                this.oModel.setProperty("/callArgsType", sCallArgsType);

                // Remove the app root component before saving the arguments
                var sRootComponentName = "<AppRootComponent " + oRootComponent.getId() + ">";
                if (Object.prototype.toString.apply(vCallArgs) === "[object Array]") {
                    vCallArgs = vCallArgs.map(function (vArg) {
                        return vArg === oRootComponent
                            ? sRootComponentName
                            : vArg;
                    });
                    var sCallArgs = JSON.stringify(vCallArgs, null, 3);

                    // remove square brackets
                    sCallArgs = sCallArgs.slice(1, sCallArgs.length - 1);
                    this.oModel.setProperty("/callArgs", sCallArgs);
                } else {
                    vCallArgs.ui5Component = sRootComponentName;
                    this.oModel.setProperty("/callArgs", JSON.stringify(vCallArgs, null, 3));
                }

                this.oModel.setProperty("/callCount", this.oModel.getProperty("/callCount") + 1);

                var sShellHash = "#" + oURLParsingService.constructShellHash(this.args);
                oCANService.isIntentSupported([sShellHash]).done(function (oResult) {
                    if (oResult && oResult[sShellHash].supported === true) {
                        this.oModel.setProperty("/supported", "supported");
                        this.oModel.setProperty("/supportedColor", "green");
                    } else {
                        this.oModel.setProperty("/supported", "not supported");
                        this.oModel.setProperty("/supportedColor", "red");
                    }
                }.bind(this));
                oCANService.isNavigationSupported([this.args]).done(function (oResult) {
                    if (oResult && oResult[0].supported === true) {
                        this.oModel.setProperty("/navSupported", "supported");
                        this.oModel.setProperty("/navSupportedColor", "green");
                    } else {
                        this.oModel.setProperty("/navSupported", "not supported");
                        this.oModel.setProperty("/navSupportedColor", "red");
                    }
                }.bind(this));
            }.bind(this));

        },

        getMyComponent: function () {
            return this.getOwnerComponent();
        },

        handleBtnGSOPress: function () {
            this.updateFromInputModel();
        },

        handleListLinkPress: function (ev) {
            var sLink = ev.getSource().getSelectedItem().data("navigateTo");
            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCANService) {
                oCANService.toExternal({ target: { shellHash: sLink } });
            });
        },

        handleBtnExpandPress: function (oEvent) {
            // get link text
            var oButton = oEvent.getSource();
            var oModel = new JSONModel();

            oModel.setData({
                linkText: oButton.data("linkText")
            });

            // create popover
            if (!this._oPopoverPromise) {
                this._oPopoverPromise = new Promise(function (resolve, reject) {
                    sap.ui.require(["/sap/ui/core/Fragment"], function (Fragment) {
                        Fragment.load({
                            name: "sap.ushell.demo.NavigationSample.view.GetLinksPopover",
                            type: "XML",
                            controller: this
                        }).then(function (popover) {
                            this._oPopover = popover;
                            this.getView().addDependent(this._oPopover);
                            resolve(popover);
                        }.bind(this));
                    }.bind(this), reject);
                }.bind(this));
            }

            this._oPopoverPromise.then(function () {
                this._oPopover.setModel(oModel);
                // delay because addDependent will do a async rerendering and the
                // actionSheet will immediately close without it.
                setTimeout(function () {
                    this._oPopover.openBy(oButton);
                }.bind(this), 0);
            }.bind(this));
        },

        getRootComponent: function () {
            return Component.getOwnerComponentFor(this.getView());
        }
    });
});
