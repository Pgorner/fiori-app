sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/gantt/misc/Format",
	"sap/gantt/misc/Utility",
	"sap/gantt/def/gradient/Stop",
	"sap/gantt/def/gradient/LinearGradient",
	"sap/gantt/def/SvgDefs",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Element"
], function (Controller, JSONModel, Format, Utility, Stop, LinearGradient, SvgDefs, Filter, FilterOperator, Element) {
	"use strict";

	var OrderTypes = {
		ACTIVE_SHAPE_INDEX: {
			RECT_CURSOR: 2,
			INVERTED_TRIANGLE: 1,
			LINE: 3,
			RECTANGLE: 0,
			DIAMOND: 3,
			CURSOR: 4,
			TRIANGLE_RECT: 5
		},
		ORDER_TYPES: {
			PLANNED_ORDER: "5",
			PRODUCTION_ORDER: "6",
			PURCHASE_REQUISTION: "1",
			PURCHASE_ORDER: "2",
			SALES_ORDER: "3",
			EXTERNAL_PROCUREMENT: "15",
			FORECAST: "33"
		}
	};
	return Controller.extend("sap.gantt.simple.test.JsonData", {
		onInit: function () {
			this.initFunction("large");
		},

		initFunction: function (size) {
			var oModel;
			if (size === "small") {
				oModel = new JSONModel(sap.ui.require.toUrl("sap/gantt/simple/test/JsonData/S_SuperOpt_New.json"));
			} else if (size === "medium") {
				oModel = new JSONModel(sap.ui.require.toUrl("sap/gantt/simple/test/JsonData/M_SuperOpt_New.json"));
			} else if (size === "large") {
				oModel = new JSONModel(sap.ui.require.toUrl("sap/gantt/simple/test/JsonData/L_SuperOpt_New.json"));
			}

			oModel.setSizeLimit(1000);
			this.getView().setModel(oModel);
			this.getView().byId("gantt").setLargeDataScrolling(true);
			this.getView().byId("gantt").getTable().getBinding().attachDataReceived(this._fnOnResourceTableDataReceived);
			oModel.attachRequestCompleted(function (oEvent) {
				this.fnSetGradientsForResourceChart(oEvent.getSource().getData().Resources, true);
				this.getView().byId("container").invalidate();
			}.bind(this));
		},
		fnOnExpand: function (oEvent) {
            var oVboxCol = oEvent.getSource().getParent().getParent();
            var oGanttChart = oVboxCol.getParent().getParent().getParent();
            var oToggleIcon = oEvent.getSource().getParent();
            var oCurrentRow = oToggleIcon.getParent().getParent();
            if (oToggleIcon.getItems()[0].getIcon().includes("right")) {
				oCurrentRow.getAggregation("_settings").getBinding("tasks").filter(null);
                oGanttChart.expand("main_row_shape", oCurrentRow.getIndex());
                oToggleIcon.getItems()[0].setIcon("sap-icon://navigation-down-arrow");
            } else {
                oCurrentRow.getAggregation("_settings").getBinding("tasks").filter(new Filter("bIsOverlapping", FilterOperator.EQ, false));
                oGanttChart.collapse("main_row_shape", oCurrentRow.getIndex());
                oToggleIcon.getItems()[0].setIcon("sap-icon://navigation-right-arrow");
            }
        },
		dataSetChange: function (oEvent) {
			var oSelectedKey = oEvent.getSource().getSelectedKey();
			this.initFunction(oSelectedKey);
		},
		fnTimeConverter: function (sTimestamp) {
			return Format.abapTimestampToDate(sTimestamp);
		},
		formatDateToUTC: function (sformatDate) {


			if (!sformatDate) {
				return null;
			} else {
				var oTempDate = this.converTime(sformatDate);
				oTempDate = new Date(oTempDate.getTime() + oTempDate.getTimezoneOffset() * (60000));
				return oTempDate;
			}
		},
		setFillColorOp: function (sOperationStatus) {
			if (sOperationStatus) {
				var aOperationStatus = sOperationStatus.split("");
				//Fixed Order -aOperationStatus[1]
				var sColor;
				if (aOperationStatus[1] === "X") {
					sColor = "sapUiChart4";
				} else if (aOperationStatus[0] === "X") {// Deallocated Order-aOperationStatus[0]
					sColor = "sapUiChartPaletteSequentialHue9Dark2";
				}
			}
			return sColor;
		},
		//Setting the Fill Height of the overlapping rectangle based on the Type of Order-Resource/Operation Chart
		setFillHeightOp: function (sOperationStatus) {
			if (sOperationStatus) {
				var aOperationStatus = sOperationStatus.split("");
				//Fixed Order-aOperationStatus[1]
				if (aOperationStatus[1] === "X") {
					return 2;
				} else if (aOperationStatus[0] === "X") {
					return 2;
				} else {
					return 0;
				}
			} else {
				return 0;
			}
		},
		formatYBiasOp: function (sOperationStatus) { //Specific for Resource/Operation Chart
			if (sOperationStatus) {
				var aOperationStatus = sOperationStatus.split("");
				//Fixed Order
				if (aOperationStatus[1] === "X") {
					return -9;
				} else if (aOperationStatus[0] === "X") {
					return 9;
				}
			}
		},
		formatConversionIndicator: function (sOperationStatus, OrderObject) {
			if (sOperationStatus && OrderObject === OrderTypes.ORDER_TYPES.PLANNED_ORDER) {
				var aOperationStatus = sOperationStatus.split("");
				if (aOperationStatus[9] === "X") {
					return true;
				}
			}
			return false;
		},
		formatConditionalShape: function (sOperationStatus) {
			if (sOperationStatus) {
				var aOperationStatus = sOperationStatus.split("");
				// Fully Confirmed Order
				var iKey = OrderTypes.ACTIVE_SHAPE_INDEX.RECTANGLE;
				if (aOperationStatus[2] === "X") {
					iKey = OrderTypes.ACTIVE_SHAPE_INDEX.CURSOR;
				} else if (aOperationStatus[3] === "X") { //Partially Confirmed Order
					iKey = OrderTypes.ACTIVE_SHAPE_INDEX.RECT_CURSOR;
				} else if (aOperationStatus[1] === "X" && aOperationStatus[0] === "X") {
					iKey = OrderTypes.ACTIVE_SHAPE_INDEX.LINE;
				} else if (aOperationStatus[7] === "X" || aOperationStatus[8] === "X") {
					iKey = OrderTypes.ACTIVE_SHAPE_INDEX.TRIANGLE_RECT;
				}
			}
			return iKey;
		},
		fnSetGradientsForResourceChart: function (data, bSuppressInvalidate) {
			if (data) {
				var oSvgDefs = new SvgDefs();
				data.forEach(function (oResourceRowData) {
					var aOperationsData = oResourceRowData.to_Operation;
					if (aOperationsData) {
						aOperationsData.forEach(function (oOperationData) {
							var aOperationStatus = oOperationData.AdvncdPlngOpStatus.split("");
							if (aOperationStatus[2] !== true) { //2-FullyConfirmed status
								var oDef = this.fnCreateLinearGradient(oOperationData, bSuppressInvalidate);

								if (oSvgDefs) {
									//add svgs
									// that._oController.oSvgDefs.addDef(oDef);
									oSvgDefs.addAggregation("defs", oDef, bSuppressInvalidate);
								}
							}
						}.bind(this));
					}
				}.bind(this));
				var oTableID = this.getView().byId("gantt");
				oTableID.setSvgDefs(oSvgDefs);
			}
		},
		converTime: function (time) {
			if (time) {
				return new Date(parseInt(time.replace('/Date(', '')));
			}
			return;
		},
		fnCreateLinearGradient: function (oOperationDetails, bSuppressInvalidate) {
			var oDef;
			var iOperationDuration = this.converTime(oOperationDetails.AdvncdPlngOpEndDateTime) - this.converTime(oOperationDetails.AdvncdPlngOpStartDateTime);
			var iSetupActDuration = this.converTime(oOperationDetails.AdvncdPlngSetpActEndDateTime) - this.converTime(oOperationDetails.AdvncdPlngSetpActStartDateTime);
			var iProcessActDuration = this.converTime(oOperationDetails.AdvncdPlngProcActEndDateTime) - this.converTime(oOperationDetails.AdvncdPlngProcActStartDateTime);
			var sOrderObj = oOperationDetails.AdvncdPlngOrderObjectType;
			var fSetupPercentage = (iSetupActDuration / iOperationDuration) * 100;
			var fProcessPercentage = (iProcessActDuration / iOperationDuration) * 100;
			fProcessPercentage = fProcessPercentage + fSetupPercentage;
			var aStops = [
				new Stop({
					offSet: "0%",
					stopColor: "@sapUiChartPaletteSequentialHue3Light3"
				}),
				new Stop({
					offSet: String(fSetupPercentage + "%"),
					stopColor: "@sapUiChartPaletteSequentialHue3Light3"
				}),

				new Stop({
					offSet: String((fSetupPercentage) + "%"),
					stopColor: this.formatColorProduceAct(sOrderObj)
				}),
				new Stop({
					offSet: String(fProcessPercentage + "%"),
					stopColor: this.formatColorProduceAct(sOrderObj)
				}),

				new Stop({
					offSet: String((fProcessPercentage) + "%"),
					stopColor: "@sapUiChartPaletteSequentialHue5Light3"
				}),
				new Stop({
					offSet: "100%",
					stopColor: "@sapUiChartPaletteSequentialHue5Light3"
				})
			];
			if (Element.getElementById(oOperationDetails.AdvncdPlngOperationGradientID)) {
				oDef = Element.getElementById(oOperationDetails.AdvncdPlngOperationGradientID);
				// oDef.removeAllStops();
				// oDef.oParent = null;
				oDef.setParent(null, "defs", true);
				oDef.removeAllAggregation("stops", bSuppressInvalidate);
				aStops.forEach(function (oStop) {
					// oDef.addStop(oStop);
					oDef.addAggregation("stops", oStop, bSuppressInvalidate);
				});
			} else {
				oDef = new LinearGradient(oOperationDetails.AdvncdPlngOperationGradientID, {
					x1: "0%",
					y1: "0%",
					x2: "100%",
					y2: "0%",
					stops: aStops
				});
			}
			return oDef;

		},
		formatColorProduceAct: function (sOrderObj) {
			if (sOrderObj === "6") {
				return "@sapUiChartPaletteSequentialHue7Light3";
			} else {
				return "@sapUiChartPaletteSequentialHue1Light3";
			}
		}
	});
});
