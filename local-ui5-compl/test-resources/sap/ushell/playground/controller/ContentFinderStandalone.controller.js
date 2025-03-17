// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/Container",
    "sap/ushell/playground/controller/BaseController",
    "sap/ushell/utils/workpage/WorkPageService",
    "sap/ushell/components/contentFinder/CatalogService",
    "sap/m/MessageToast",
    "../testData/WorkPageBuilder/data",
    "../testData/NewContentFinder/ContentFinderModel"
], function (
    Container,
    BaseController,
    WorkPageService,
    CatalogService,
    MessageToast,
    WorkPageBuilderData,
    ContentFinderModel
) {
    "use strict";

    /* global sinon */
    const sandbox = sinon.createSandbox({});

    return BaseController.extend("sap.ushell.playground.controller.ContentFinderStandalone", {

        prepareMocks: function () {
            BaseController.prototype.prepareMocks.call(this);

            if (Container.getRendererInternal.restore?.sinon) {
                Container.getRendererInternal.returns({
                    getRouter: sandbox.stub().returns({
                        getRoute: sandbox.stub().returns({
                            attachMatched: sandbox.stub()
                        })
                    })
                });
            } else {
                sandbox.stub(Container, "getRendererInternal").returns({
                    getRouter: sandbox.stub().returns({
                        getRoute: sandbox.stub().returns({
                            attachMatched: sandbox.stub()
                        })
                    })
                });
            }

            sandbox.stub(WorkPageService.prototype, "loadVisualizations").callsFake(this.loadVisualizations);
            sandbox.stub(CatalogService.prototype, "loadVisualizations").callsFake(this.loadVisualizations);
            sandbox.stub(CatalogService.prototype, "getCatalogs").resolves({
                catalogs: ContentFinderModel.getProperty("/categoryTree/1/nodes")
            });
        },

        restoreMocks: function () {
            BaseController.prototype.restoreMocks.call(this);
            sandbox.restore();
        },

        loadVisualizations: function (oParams) {
            const iSkip = oParams.skip || 0;
            const iTop = oParams.top || 100;
            const aVisualizations = WorkPageBuilderData.visualizations.nodes;
            let fnResolve;

            setTimeout(() => {
                fnResolve({
                    visualizations: {
                        totalCount: aVisualizations.length,
                        nodes: aVisualizations.slice(iSkip, iSkip + iTop)
                    }
                });
            }, 1600);
            return new Promise((resolve) => {
                fnResolve = resolve;
            });
        }
    });
});
