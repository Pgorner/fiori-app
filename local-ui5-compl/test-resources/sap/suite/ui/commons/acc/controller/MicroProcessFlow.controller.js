sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/suite/ui/commons/MicroProcessFlow",
    "sap/suite/ui/commons/MicroProcessFlowItem"
], function (JSONModel, MicroProcessFlow, MicroProcessFlowItem) {

    var oMicroProcessFlow = new MicroProcessFlow({
        content: [new MicroProcessFlowItem({
            state: "Error",
            showIntermediary: true
        }), new MicroProcessFlowItem(), new MicroProcessFlowItem()]
    });

    oMicroProcessFlow.placeAt("content");
});