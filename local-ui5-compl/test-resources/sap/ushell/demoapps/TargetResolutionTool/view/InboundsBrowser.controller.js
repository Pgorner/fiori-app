// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/* eslint-disable block-scoped-var */

sap.ui.define([
    "sap/base/util/isPlainObject",
    "sap/m/MessageToast",
    "sap/ui/core/Element",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Container"
], function (
    isPlainObject,
    MessageToast,
    Element,
    Controller,
    JSONModel,
    Container
) {
    "use strict";

    return Controller.extend("sap.ushell.demo.TargetResolutionTool.view.InboundsBrowser", {
        onInit: function () {
            Container.getServiceAsync("ClientSideTargetResolution").then((oClientSideTargetResolution) => {
                oClientSideTargetResolution._oInboundProvider.getInbounds()
                    .then((aInbounds) => {
                        this.oModel = new JSONModel({
                            inbounds: [],
                            inboundsCount: 0
                        });

                        this.filterAndSetModel({
                            inbounds: aInbounds,
                            inboundsCount: aInbounds.length
                        });

                        this.getView().setModel(this.oModel);

                        this.oModel.bindTree("/").attachChange(this._onModelChanged);
                    })
                    .catch(function (sError) {
                        MessageToast.show("An error occurred while retrieving the inbounds: " + sError);
                    });
            });
        },
        onBtnSearchPress: function (oEvent) {
            oEvent.preventDefault();
            const sQuery = (Element.getElementById(this.createId("txtQuery")).getValue() || "").toLowerCase();

            if (this.sPreviousQuery === sQuery) {
                return;
            }

            this.sPreviousQuery = sQuery;

            const oList = Element.getElementById(this.createId("lstInboundList"));
            oList.setBusy(true);

            try {
                Container.getServiceAsync("ClientSideTargetResolution").then((oClientSideTargetResolutionService) => {
                    oClientSideTargetResolutionService._oInboundProvider.getInbounds()
                        .then((aInbounds) => {
                            const iTotalInbounds = aInbounds.length;
                            let aResults = [];

                            if (sQuery !== "") {
                                // Try to find semanticObject action matches exact matches first
                                const aDashSplitQuery = sQuery.toLowerCase().split("-");

                                // Likely to be a "#SemanticObject-action" query
                                if (aDashSplitQuery.length === 2) {
                                    const sQuerySemanticObject = aDashSplitQuery[0].replace("#", "");
                                    const sQuerySemanticAction = aDashSplitQuery[1] || "";
                                    const aExactMatches = aInbounds.filter(function (oInbound) {
                                        return oInbound.semanticObject.toLowerCase() === sQuerySemanticObject &&
                                            oInbound.action.toLowerCase() === sQuerySemanticAction;
                                    });
                                    if (aExactMatches.length > 0) {
                                        // we are done
                                        this.filterAndSetModel({
                                            inboundsCount: iTotalInbounds,
                                            inbounds: aExactMatches
                                        });
                                        oList.setBusy(false);
                                        return;
                                    }
                                }

                                // Use fuzzy matching
                                const oKeywordSet = {};

                                aInbounds.forEach(function (oInbound) {
                                    let sApplicationDependencies = oInbound.resolutionResult.applicationDependencies;
                                    if (isPlainObject(sApplicationDependencies)) {
                                        sApplicationDependencies = JSON.stringify(sApplicationDependencies);
                                    }

                                    // split into keywords
                                    const aKeywords = [
                                        oInbound.semanticObject,
                                        oInbound.action,
                                        (oInbound.id || "" ).split("~")[1] || "",
                                        sApplicationDependencies,
                                        oInbound.resolutionResult.additionalInformation,
                                        oInbound.resolutionResult.applicationType,
                                        oInbound.resolutionResult.ui5ComponentName,
                                        oInbound.resolutionResult.url,
                                        oInbound.resolutionResult.systemAlias,
                                        ""
                                    ].filter(function (sKey) { return sKey !== undefined; });
                                    if (oInbound.title === "string" && oInbound.title.length > 0) {
                                        Array.prototype.push.apply(
                                            aKeywords,
                                            oInbound.title.split(/\s*|[.]|/).map(function(sTitlePart) {
                                                return sTitlePart.toLowerCase();
                                            })
                                        );
                                    }

                                    // index keyword -> inbound(s)
                                    aKeywords.forEach(function (sKeyword) {
                                        var sFixedKeyword = (sKeyword || "").toLowerCase();
                                        if (!oKeywordSet.hasOwnProperty(sFixedKeyword)) {
                                            oKeywordSet[sFixedKeyword] = [];
                                        }
                                        oKeywordSet[sFixedKeyword].push(oInbound);
                                    });
                                });

                                // Try to match the whole query first
                                if (oKeywordSet.hasOwnProperty(sQuery)) {
                                    Array.prototype.push.apply(aResults, oKeywordSet[sQuery]);
                                }

                                // Match sub-query keys
                                sQuery.split(/\s*/).forEach(function (sQueryKeyword) {
                                    if (oKeywordSet.hasOwnProperty(sQueryKeyword)) {
                                        Array.prototype.push.apply(aResults, oKeywordSet[sQuery]);
                                    }
                                });

                                // Todo - sort result by significance
                            } else {
                                aResults = aInbounds;
                            }

                            this.filterAndSetModel({
                                inboundsCount: iTotalInbounds,
                                inbounds: aResults
                            });

                            oList.setBusy(false);
                        })
                        .catch(function (sMsg) {
                            MessageToast.show("An error occurred while retrieving the inbounds: " + sMsg);
                            oList.setBusy(false);
                        });
                });
            } catch (oError) {
                MessageToast.show("An exception occurred while retrieving the inbounds: " + oError);
                oList.setBusy(false);
            }
        },
        filterAndSetModel: function (oViewData) {
            Container.getServiceAsync("ClientSideTargetResolution").then((oClientSideTargetResolution) => {
                oViewData.inbounds = oViewData.inbounds.map(function (oInbound) {
                    oInbound.compactSignature = oClientSideTargetResolution._compactSignatureNotation(oInbound.signature);
                    return oInbound;
                });
                this.oModel.setData(oViewData);
            });
        },
        roundFloat: function (iNum) {
            return Number(Math.round(iNum + "e3") + "e-3")
                .toFixed(3);
        },
        onInboundListItemSelected: function (oEvent) {
            const oSelectedInbound = oEvent.getSource().getBindingContext().getObject();

            const oViewData = {
                intent: oSelectedInbound.semanticObject + "-" + oSelectedInbound.action,
                rawInbound: JSON.stringify(oSelectedInbound, null, "   ")
            };

            this.oApplication.navigate("toView", "ShowInbound", oViewData);
        },
        _onModelChanged: function () {
            // read from the model and update internal state
        },
        onExit: function () { }
    });
});
