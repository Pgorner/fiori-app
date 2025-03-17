sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/gantt/def/gradient/LinearGradient",
	"sap/gantt/def/gradient/Stop",
	"sap/ui/core/Element"
], function(Controller, JSONModel, MockServer, ODataModel, LinearGradient, Stop, Element) {
	"use strict";

	return Controller.extend("sap.gantt.simple.test.StockChart", {

		onInit : function() {
			var sServiceUrl = "http://my.test.service.com/";
			var oMockServer = new MockServer({
				rootUri : sServiceUrl
			});

			oMockServer.simulate("odata/stockChartData/metadata.xml", {
				sMockdataBaseUrl : "odata/stockChartData/",
				bGenerateMissingMockData : false
			});

			oMockServer.start();
			var oDataModel = new ODataModel(sServiceUrl, {
				useBatch: true,
				refreshAfterChange: false
			});

			oDataModel.setDefaultBindingMode("TwoWay");
			oDataModel.setSizeLimit(5000);
			this.getView().setModel(oDataModel, "data");
			this.getView().byId("sc").setEnableVerticalLine(false);
			this.oFormatter = sap.ui.core.format.DateFormat.getDateInstance();
		},
		remainingCapacityColorFormatter : function (sColor, sResId) {
			if (sResId !== "res_015") {
				return sColor;
			}
			var sDefId = sResId + sColor.replace('#','');
			return this.createLinearGradient(sDefId, sColor);
		},
		remainingCapacityColorNegativeFormatter : function (sResId) {
			if (sResId !== "res_015") {
				return "#ed6766";
			}
			var sDefId = sResId + "ed6766";
			return this.createLinearGradient(sDefId, "#ed6766");
		},

		createLinearGradient : function (sDefId, sColor) {
			if (Element.getElementById(sDefId)) {
				return 'url("#' + sDefId + '")';
			}
			var colorOffSet, grayOffset;
			if (sColor == "#8ed1ba"){
				colorOffSet = "20%";
				grayOffset = "60%";
			} else if (sColor == "#ed6766"){
				colorOffSet = "10%";
				grayOffset = "100%";
			} else {
				colorOffSet = "40%";
				grayOffset = "50%";
			}
			var oGantt = Element.getElementById("myView--sc");
			var oGanttSvgDefs = oGantt.getSvgDefs();
			var aStops = [
				new Stop({
					offSet: colorOffSet,
					stopColor: sColor,
					stopOpacity: 1
				}),
				new Stop({
					offSet: grayOffset,
					stopColor: "#f7f7f7",
					stopOpacity: 1
				})
			];

			var oDef = new LinearGradient(sDefId, {
				x1: "0%",
				y1: "0%",
				x2: "0%",
				y2: "100%",
				stops: aStops
			});
			if (!oGanttSvgDefs) {
				var oSvgDefs = new sap.gantt.def.SvgDefs({});
				oSvgDefs.addAggregation("defs", oDef, true);
				oGantt.setAggregation("svgDefs", oSvgDefs, true);
			} else {
				oGanttSvgDefs.addAggregation("defs",oDef, true);
			}
			return 'url("#' + sDefId + '")';
		}
	});
});
