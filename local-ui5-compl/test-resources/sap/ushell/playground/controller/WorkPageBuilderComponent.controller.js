// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/playground/controller/BaseController",
    "sap/m/MessageToast",
    "../testData/WorkPageBuilder/data",
    "sap/ushell/Container",
    "sap/ui/core/util/MockServer"
], function (
    BaseController,
    MessageToast,
    WorkPageBuilderData,
    Container,
    MockServer
) {
    "use strict";

    /* global sinon */
    const sandbox = sinon.createSandbox({});

    var oMockServer = new MockServer({
        recordRequests: false
    });

    return BaseController.extend("sap.ushell.playground.controller.WorkPageBuilderComponent", {

        prepareMocks: function () {
            sandbox.restore(); // prepareMocks might be called multiple times

            // Container Usages in DynamicTileRequest

            sandbox.stub(Container, "getLogonSystem");

            sandbox.stub(Container, "getServiceAsync");

            Container.getServiceAsync.withArgs("ClientSideTargetResolution").resolves({
                getSystemContext: function () {}
            });

            Container.getServiceAsync.withArgs("ReferenceResolver").resolves({
                resolveSemanticDateRanges: async function () {
                    return {
                        url: "/mock/semanticDateRanges",
                        hasSemanticDateRanges: false,
                        invalidSemanticDates: [],
                        ignoredReferences: []
                    };
                },
                resolveUserDefaultParameters: async function () {
                    return {
                        url: "/mock/userDefaultParameters"
                    };
                }
            });

            oMockServer.setRequests([{
                method: "GET",
                path: ".*/mock/.*",
                response: (oXhr) => {
                    if (oXhr.readyState > 1) {
                        return; // request was already handled
                    }
                    oXhr.respond(200, undefined, "1234");
                }
            }]);
            oMockServer.start();
        },

        restoreMocks: function () {
            sandbox.restore();
            oMockServer.stop();
        },

        onInit: function () {
            this.prepareMocks();
        },

        workPageBuilderComponentCreated: function (oEvent) {
            this.oComponent = oEvent.getParameter("component");

            this.oComponent.setNavigationDisabled(true);

            this.oComponent.attachEvent("visualizationFilterApplied", this.getVisualizations, this);

            this.oComponent.setPageData(WorkPageBuilderData);
        },

        getVisualizations: function (oEvent) {
            var iSkip = oEvent.getParameter("pagination").skip;
            var iTop = oEvent.getParameter("pagination").top;
            var aTypes = oEvent.getParameter("types") || [];
            var sSearchTerm = oEvent.getParameter("search");

            MessageToast.show(JSON.stringify(oEvent.getParameters()));

            var aVisualizations = WorkPageBuilderData.visualizations.nodes;

            if (aTypes.length > 0) {
                aVisualizations = aVisualizations.filter(function (oViz) {
                    return aTypes.indexOf(oViz.type) > -1;
                });
            }

            if (sSearchTerm) {
                aVisualizations = aVisualizations.filter(function (oViz) {
                    return oViz.descriptor.value["sap.app"].title.indexOf(sSearchTerm) > -1;
                });
            }

            // Fake server call time
            setTimeout(function () {
                this.oComponent.setVisualizationData({
                    visualizations: {
                        totalCount: aVisualizations.length,
                        nodes: aVisualizations.slice(iSkip, iSkip + iTop)
                    }
                });
            }.bind(this), 2000);
        },

        toggleEditMode: function (oEvent) {
            var bEditMode = oEvent.getParameter("state");
            this.byId("toggleFooter").setEnabled(bEditMode);
            this.oComponent.setEditMode(oEvent.getParameter("state"));
        },
        togglePreviewMode: function (oEvent) {
            this.oComponent.setPreviewMode(oEvent.getParameter("state"));
        },
        togglePageTitle: function (oEvent) {
            this.oComponent.setShowPageTitle(oEvent.getParameter("state"));
        },
        toggleFooter: function (oEvent) {
            this.oComponent.setShowFooter(oEvent.getParameter("state"));
        }
    });
});
