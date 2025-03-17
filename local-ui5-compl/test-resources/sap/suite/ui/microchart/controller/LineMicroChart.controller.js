sap.ui.require([
    "sap/ui/model/json/JSONModel",
    "sap/suite/ui/microchart/LineMicroChartEmphasizedPoint",
    "sap/suite/ui/microchart/LineMicroChartPoint",
    "sap/ui/base/ManagedObject",
    "sap/ui/base/BindingParser",
    "sap/m/MessageToast",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/mvc/XMLView"
], async function (JSONModel, LineMicroChartEmphasizedPoint, LineMicroChartPoint, ManagedObject, BindingParser,
             MessageToast, Controller, XMLView) {

    // dont know why i have to set this manually
    // probably something that is not used by default when instantiating xmlview manually
    // without this, complex binding in XML using object definition like {path:'lines'} doesn't work // TODO WHY
    ManagedObject.bindingParser = BindingParser.complexParser;

    Controller.extend("myController", {
        onInit: function () {
            var oSettings = {
                lines: [
                    {
                        points: [
                            {x: 0, y: 53, show: true, emphasized: false, color: "Neutral"},
                            {x: 8, y: 40, show: false, emphasized: false, color: "Neutral"},
                            {x: 20, y: 10, show: false, emphasized: false, color: "Neutral"},
                            {x: 30, y: 30, show: true, emphasized: false, color: "Neutral"},
                            {x: 40, y: 52, show: true, emphasized: false, color: "Neutral"},
                            {x: 100, y: 73, show: true, emphasized: false, color: "Neutral"}
                        ],
                        showPoints: false,
                        color: "Neutral",
                        type: "Solid"
                    }
                ],
                size: "Auto",
                threshold: 0,
                showThresholdLine: true,
                showThresholdValue: false,
                thresholdDisplayValue: "",
                leftTopLabel: "120 Mio",
                rightTopLabel: "140 Mio",
                leftBottomLabel: "Sept 2016",
                rightBottomLabel: "Oct 2016"
            };

            var oConfModel = new JSONModel();
            oConfModel.setData(oSettings);
            this.getView().setModel(oConfModel);
        },

        fnPointsFactory: function (sId, oContext) {
            var oPoint;

            if (oContext.getProperty("emphasized")) {
                oPoint = new LineMicroChartEmphasizedPoint({
                    x: oContext.getProperty("x"),
                    y: oContext.getProperty("y"),
                    show: oContext.getProperty("show"),
                    color: oContext.getProperty("color")
                });
            } else {
                oPoint = new LineMicroChartPoint({
                    x: oContext.getProperty("x"),
                    y: oContext.getProperty("y")
                });
            }

            return oPoint;
        },

        fnRefresh: function () {
            this.getView().getModel().refresh(true);
        },

        fnAddLine: function () {
            var oModel = this.getView().getModel();
            var oLine = {
                points: [],
                showPoints: false,
                color: "Neutral",
                type: "Solid"
            };

            oModel.getProperty("/").lines.push(oLine);
            oModel.refresh(true);
        },

        fnAddPoint: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext();

            var oPoint = {x: null, y: null, show: true, emphasized: false, color: "Neutral"};

            oContext.getModel().getProperty(oContext.getPath()).points.push(oPoint);
            oContext.getModel().refresh(true);
        },

        fnRemoveObject: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext();
            var sPath = oContext.getPath();
            var aSplit = sPath.split("/");
            var iPoint = aSplit.slice(-1);

            sPath = aSplit.slice(0, -1).join("/");
            oContext.getModel().getProperty(sPath).splice(iPoint, 1);
            this.getView().getModel().refresh(true);
        },

        fnPress: function (oEvent) {
            MessageToast.show("The chart is pressed.");
        }
    });

    var oView = await XMLView.create({definition:jQuery('#myXml').html()});
    oView.placeAt("content");

});
