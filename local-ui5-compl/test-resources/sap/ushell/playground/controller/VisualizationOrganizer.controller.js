// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/components/visualizationOrganizer/Component",
    "sap/ushell/playground/controller/BaseController",
    "sap/ushell/Container"
], (
    VOComponent,
    BaseController,
    Container
) => {
    "use strict";

    /* global sinon */
    var sandbox = sinon.createSandbox({});

    return BaseController.extend("sap.ushell.playground.controller.VisualizationOrganizer", {

        prepareMocks: function () {
            sandbox.restore(); // prepareMocks might be called multiple times

            sandbox.stub(Container, "getServiceAsync");

            Container.getServiceAsync.withArgs("CommonDataModel").resolves({
                getAllPages: sandbox.stub().resolves([{
                    identification: {
                        id: "page1"
                    },
                    payload: {
                        sections: {}
                    }
                }])
            });
            Container.getServiceAsync.withArgs("Pages").resolves({
                addVisualization: sandbox.stub().resolves()
            });
            Container.getServiceAsync.withArgs("Menu").resolves({
                getContentNodes: sandbox.stub().resolves([{
                    id: "space1",
                    label: "People",
                    type: "Space",
                    isContainer: false,
                    children: [
                        {
                            id: "page1",
                            label: "People Page",
                            type: "Page",
                            isContainer: true,
                            children: []
                        }
                    ]
                }])
            });
        },

        restoreMocks: function () {
            sandbox.restore();
        },

        onInit: function () {
            this.prepareMocks();

            this.vizOrg = new VOComponent();
            this.vizOrg.requestData();
        },

        buttonPress: function (oEvent) {
            const sId = oEvent.getSource().getId();
            this.vizOrg.toggle(oEvent.getSource(), { id: sId, title: sId.split("-")[2] });
        }
    });
});
