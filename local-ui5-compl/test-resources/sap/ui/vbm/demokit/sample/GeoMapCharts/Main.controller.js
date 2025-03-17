sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"sap/m/MessageToast"
], function(Controller, JSONModel, Device, MessageToast) {
	"use strict";

	return Controller.extend("sap.ui.vbm.sample.GeoMapCharts.Main", {

		onInit: function() {
			var oModel = new JSONModel("test-resources/sap/ui/vbm/demokit/sample/GeoMapCharts/Data.json");
			this.getView().setModel(oModel);

			// set the device model
			var oDeviceModel = new JSONModel(Device);
			oDeviceModel.setDefaultBindingMode("OneWay");
			this.getView().setModel(oDeviceModel, "device");

			this.byId("vbi").setVisualFrame({
				"minLon": -15,
				"maxLon": 20,
				"minLat": 37.5,
				"maxLat": 57,
				"minLOD": 5
			});
		},

		onPressLegend: function() {
			if (this.byId("vbi").getLegendVisible() == true) {
				this.byId("vbi").setLegendVisible(false);
				this.byId("btnLegend").setTooltip("Show legend");
			} else {
				this.byId("vbi").setLegendVisible(true);
				this.byId("btnLegend").setTooltip("Hide legend");
			}
		},

		onPressResize: function() {
			if (this.byId("btnResize").getTooltip() == "Minimize") {
				if (Device.system.phone) {
					this.byId("vbi").minimize(132, 56, 1320, 560);// Height: 3,5 rem; Width: 8,25 rem
				} else {
					this.byId("vbi").minimize(168, 72, 1680, 720);// Height: 4,5 rem; Width: 10,5 rem
				}
				this.byId("btnResize").setTooltip("Maximize");
			} else {
				this.byId("vbi").maximize();
				this.byId("btnResize").setTooltip("Minimize");
			}
		},

		onClickItem: function(evt) {
			MessageToast.show("onClick");
		},

		onContextMenuItem: function(evt) {
			MessageToast.show("onContextMenu");
		},

		onChartpress: function(evt) {
			MessageToast.show("The chart was pressed.");
		},

		onImagePress: function(evt) {
			MessageToast.show("The image was pressed");
		},

		press: function(evt) {
			MessageToast.show("Something was pressed");
		}
	});

});
