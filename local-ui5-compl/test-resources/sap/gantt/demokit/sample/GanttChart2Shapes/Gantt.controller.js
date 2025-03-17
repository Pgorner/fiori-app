sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/gantt/misc/Format"
], function (Controller, JSONModel, Format) {
	"use strict";

	return Controller.extend("sap.gantt.sample.GanttChart2Shapes.Gantt", {
		onInit: function () {
			var oModel = new JSONModel(sap.ui.require.toUrl("sap/gantt/sample/GanttChart2Shapes/data.json"));
			this.getView().setModel(oModel);
		},
		fnTimeConverter: function (sTimestamp) {
			return Format.abapTimestampToDate(sTimestamp);
		},
		fnPrefixImg: function (sSrc) {
			return  sap.ui.require.toUrl("sap/gantt/sample/GanttChart2Shapes") + "/" + sSrc;
		},
		fnBuildApiUrl: function (sSufix) {
			var aParts = window.location.href.split("#");
			if (aParts.length !== 2) {
				return "/" + sSufix;
			} else {
				return aParts[0] + "#/api/" + sSufix;
			}
		},
		onShapeAlignmentChange: function(oEvent) {
			var oSelectedKey = oEvent.getSource().getSelectedKey();
			this.byId("gantt").getTable().getRows().forEach(function(oRow) {
				oRow.getAggregation("_settings").getRectangles().forEach(function(oShape) {
					oShape.setAlignShape(oSelectedKey);
				});
				oRow.getAggregation("_settings").getChevrons().forEach(function(oShape) {
					oShape.setAlignShape(oSelectedKey);
				});
				oRow.getAggregation("_settings").getTexts().forEach(function(oShape) {
					oShape.setAlignShape(oSelectedKey);
				});
				oRow.getAggregation("_settings").getDiamonds().forEach(function(oShape) {
					oShape.setAlignShape(oSelectedKey);
				});
				oRow.getAggregation("_settings").getCursors().forEach(function(oShape) {
					oShape.setAlignShape(oSelectedKey);
				});
				oRow.getAggregation("_settings").getImages().forEach(function(oShape) {
					oShape.setAlignShape(oSelectedKey);
				});
				oRow.getAggregation("_settings").getCustomPaths().forEach(function(oShape) {
					oShape.setAlignShape(oSelectedKey);
				});
				oRow.getAggregation("_settings").getTriangles().forEach(function(oShape) {
					oShape.setAlignShape(oSelectedKey);
				});
				oRow.getAggregation("_settings").getGroups().forEach(function(oShape) {
					oShape.setAlignShape(oSelectedKey);
				});
				oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
					oShape.setAlignShape(oSelectedKey);
				});
				oRow.getAggregation("_settings").getShapes2().forEach(function(oShape) {
					oShape.setAlignShape(oSelectedKey);
				});
				oRow.getAggregation("_settings").getShapes3().forEach(function(oShape) {
					oShape.setAlignShape(oSelectedKey);
				});
			});
        }
	});
});
