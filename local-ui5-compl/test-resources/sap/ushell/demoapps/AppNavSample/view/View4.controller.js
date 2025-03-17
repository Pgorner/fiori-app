// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/Component",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Container"
], function (Log, Component, Controller, JSONModel, Container) {
    "use strict";

    function convertParametersToSimpleSyntax (oExtendedParameters) {
        try {
            return Object.keys(oExtendedParameters).map(function (sParameterName) {
                var vParameterValue = oExtendedParameters[sParameterName].value;

                if (Object.prototype.toString.apply(vParameterValue) === "[object Array]") {
                    return vParameterValue.map(function (sValue) {
                        return sParameterName + "=" + sValue;
                    }).join("&");
                }

                var sParameterValue = "" + vParameterValue;
                return sParameterName + "=" + sParameterValue;
            }).join("&");
        } catch (e) {
            return "cannot convert: check format";
        }
    }

    function convertParametersToExtendedSyntax (sParamsSimple) {
        var oParamsExtended = sParamsSimple.split("&").map(function (sNameValue) {
            var aNameValue = sNameValue.split("=");
            return {
                name: aNameValue[0],
                value: aNameValue[1]
            };
        }).reduce(function (oExtendedParams, oParamParsed) {
            if (oExtendedParams[oParamParsed.name]) {
                var vExistingValue = oExtendedParams[oParamParsed.name].value;

                if (Object.prototype.toString.apply(vExistingValue) === "[object Array]") {
                    vExistingValue.push(oParamParsed.value);
                } else { // assume existing value is a string
                    oExtendedParams[oParamParsed.name].value = [
                        vExistingValue, oParamParsed.value
                    ];
                }

                return oExtendedParams;
            }

            oExtendedParams[oParamParsed.name] = { value: oParamParsed.value };
            return oExtendedParams;
        }, {});

        return JSON.stringify(oParamsExtended, null, 3);
    }

    return Controller.extend("sap.ushell.demo.AppNavSample.view.View4", {
        oApplication: null,
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberof view.Detail
         */
        onInit: function () {
            this.oInputModel = new JSONModel({
                SO: "Action",
                action: "toappnavsample",
                params: "A=B&C=D",
                paramsExtended: "",
                compactIntents: false,
                ignoreFormFactor: false,
                useExtendedParamSyntax: false
            });

            this.oModel = new JSONModel({
                SO: "Action",
                action: "toappnavsample",
                params: "A=B&C=D",
                supported: false,
                supportedColor: "red",
                navSupportedColor: "red",
                compactIntents: false,
                treatTechHintAsFilter: false,
                withAtLeastOneUsedParam: false,
                hashFragment: "",
                hashFragmentLength: 0,
                callMethod: "getSemanticObjectLinks",
                callCount: 0,
                sortResultsBy: "intent",
                links: []
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
        onParamSyntaxChanged: function (oEvent) {
            var sExtendedParameters,
                sSimpleParameters,
                oExtendedParameters;

            if (oEvent.getSource().getState() === true) {
                sSimpleParameters = this.oInputModel.getProperty("/params");
                sExtendedParameters = convertParametersToExtendedSyntax(sSimpleParameters);
                this.oInputModel.setProperty("/paramsExtended", sExtendedParameters);
            } else {
                try {
                    oExtendedParameters = JSON.parse(this.oInputModel.getProperty("/paramsExtended"));
                } catch (e) {
                    oExtendedParameters = {};
                }
                sSimpleParameters = convertParametersToSimpleSyntax(oExtendedParameters);
                this.oInputModel.setProperty("/params", sSimpleParameters);
            }
        },
        onMethodSelected: function (oEvent) {
            var sMethod = oEvent.getSource().getSelectedButton().getText();
            this.oModel.setProperty("/callMethod", sMethod);
            if (sMethod === "getSemanticObjectLinks") {
                this.oInputModel.setProperty("/useExtendedParamSyntax", false);
            }
            this.updateFromInputModel();
        },
        onSortResultsByChanged: function (oEvent) {
            var sSortResultsBy = oEvent.getParameters().newValue;
            this.oModel.setProperty("/sortResultsBy", sSortResultsBy);
        },
        handleTextLiveChange: function (oEvent) {
            var oMdlV1 = this.getView().getModel("v1"),
                sSemanticObject = this.byId("f2").getValue() || "",
                sAction = this.byId("f3").getValue() || "",
                sParams = this.byId("f4").getValue() || "",
                sIntent = "#" + sSemanticObject + "-" + sAction + (sParams.length > 0 ? "?" + sParams : "");

            oMdlV1.setProperty("/hashFragment", sIntent);
            oMdlV1.setProperty("/hashFragmentLength", sIntent.length);
        },
        updateFromInputModel: function () {
            var sSemanticObject = this.getView().getModel("mdlInput").getProperty("/SO"),
                sAction = this.getView().getModel("mdlInput").getProperty("/action"),
                bUseExtended = this.getView().getModel("mdlInput").getProperty("/useExtendedParamSyntax"),
                sExtendedParams = this.getView().getModel("mdlInput").getProperty("/paramsExtended"),
                sSimpleParams = this.getView().getModel("mdlInput").getProperty("/params"),
                bCompactIntents = this.getView().getModel("mdlInput").getProperty("/compactIntents"),
                bWithAtLeastOneUsedParam = this.getView().getModel("mdlInput").getProperty("/withAtLeastOneUsedParam"),
                bIgnoreFormFactor = this.getView().getModel("mdlInput").getProperty("/ignoreFormFactor"),
                sSortResultsBy = this.getView().getModel("v1").getProperty("/sortResultsBy"),
                bTreatTechHintAsFilter = this.getView().getModel("mdlInput").getProperty("/treatTechHintAsFilter"),
                oRootComponent = this.getRootComponent();

            Promise.all([
                Container.getServiceAsync("URLParsing"),
                Container.getServiceAsync("CrossApplicationNavigation")
            ], function (aServices) {
                var oURLParsingService = aServices[0];
                var oCANService = aServices[1];
                var oExtendedParams;
                if (bUseExtended) {
                    try {
                        oExtendedParams = JSON.parse(sExtendedParams);
                    } catch (oError) {
                        Log.error(oError);
                        oExtendedParams = {};
                    }
                }

                var oSimpleParams = oURLParsingService.parseParameters("?" + sSimpleParams || "");

                // --- call hrefForExternal ---

                this.args = {
                    target: {
                        semanticObject: sSemanticObject,
                        action: sAction
                    },
                    params: bUseExtended
                        ? convertParametersToSimpleSyntax(sSimpleParams) // extended syntax not supported in this case
                        : sSimpleParams
                };

                var href = oCANService.hrefForExternal(this.args, this.getRootComponent());
                if (this.getView() && this.getView().getModel()) {
                    this.getView().getModel().setProperty("/toGeneratedLink", href);
                }

                // --- call getLinks or getSemanticObjectLinks ---

                var sCallMethod = this.oModel.getProperty("/callMethod", sCallMethod);

                var sCallArgsType,
                    vCallArgs;

                if (sCallMethod === "getLinks") {
                    sCallArgsType = "nominal";
                    vCallArgs = {
                        semanticObject: sSemanticObject.length > 0 ? sSemanticObject : undefined,
                        action: sAction.length > 0 ? sAction : undefined,
                        params: bUseExtended ? oExtendedParams : oSimpleParams,
                        withAtLeastOneUsedParam: bWithAtLeastOneUsedParam,
                        treatTechHintAsFilter: bTreatTechHintAsFilter,
                        ui5Component: oRootComponent,
                        compactIntents: bCompactIntents,
                        ignoreFormFactor: bIgnoreFormFactor,
                        sortResultsBy: sSortResultsBy
                    };
                } else {
                    sCallArgsType = "positional";
                    vCallArgs = [
                        sSemanticObject,

                        bUseExtended // oParams
                            ? oExtendedParams
                            : oSimpleParams,

                        bIgnoreFormFactor, // bIgnoreFormFactor
                        oRootComponent,
                        undefined, // sAppStateKey
                        bCompactIntents
                    ];
                }

                function fnCallDoneHandler (aResult) {
                    this.oModel.setProperty("/links", aResult.map(function (oEntry) {
                        return {
                            name: oEntry.text,
                            link: oEntry.intent,
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
                    oCANService[sCallMethod](oCANService, vCallArgs)
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

            this.handleTextLiveChange();
        },

        getMyComponent: function () {
            return this.getOwnerComponent();
        },

        handleBtn1Press: function () {
            this.oApplication.navigate("toView", "View2");
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

        handleBtnAddParamsPress: function (oEvent) {
            var sCurrentParams = this.getView().getModel("mdlInput").getProperty("/params");
            var iNumParamsCurrent = sCurrentParams.split("&").length;
            var iNumParams = iNumParamsCurrent * 2;
            var iLastNum = parseInt(sCurrentParams.split(/[a-zA-Z]/).pop(), 10);

            var iStartFrom = (iLastNum || 0) + 1;
            var aParams = [];

            if (sCurrentParams) {
                aParams.push(sCurrentParams);
            }

            for (var i = iStartFrom; i <= iStartFrom + iNumParams; i++) {
                aParams.push("p" + i + "=v" + i);
            }

            this.getView().getModel("mdlInput").setProperty("/params", aParams.join("&"));
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
                            name: "sap.ushell.demo.AppNavSample.view.View4Popover",
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
        },

        /**
         * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
         * @memberof view.Detail
         */
        onExit: function () {
            Log.info("sap.ushell.demo.AppNavSample: onExit of View4");
        }
    });
});
