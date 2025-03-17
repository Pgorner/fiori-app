sap.ui.define([
	"sap/ui/vbm/AnalyticMap",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"sap/m/MessageToast"
], function(AnalyticMap, Controller, JSONModel, Device, MessageToast) {
	"use strict";

	AnalyticMap.GeoJSONURL = "test-resources/sap/ui/vbm/demokit/media/analyticmap/L0.json";

	return Controller.extend("sap.ui.vbm.sample.AnalyticMapLabels.Main", {

		onInit: function() {
			var oModel = new JSONModel("test-resources/sap/ui/vbm/demokit/sample/AnalyticMapLabels/Data.json");
			this.getView().setModel(oModel);

			// set the device model
			var oDeviceModel = new JSONModel(Device);
			oDeviceModel.setDefaultBindingMode("OneWay");
			this.getView().setModel(oDeviceModel, "device");

// var oRttTextField = new sap.ui.commons.RichTooltip({
// title: "SAP SE Walldorf",
// imageSrc:"http://go.sap.com/_jcr_content/parHeader/header/image.adapt.tablet.png/1434558501057.png",
// text : "Dietmar-Hopp-Allee 16<br>Walldorf<br>06227 747474"
// });
// this.byId("wdfSpot").setTooltip(oRttTextField);
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

		onRegionClick: function(e) {
			MessageToast.show("onRegionClick " + e.getParameter("code"));
		},

		onRegionContextMenu: function(e) {
			MessageToast.show("onRegionContextMenu " + e.getParameter("code"));
		},

		onClickItem: function(evt) {
			MessageToast.show("onClick");
		},

		onContextMenuItem: function(evt) {
			MessageToast.show("onContextMenu");
		},

		onClickSpot: function(evt) {
			MessageToast.show("onClickSpot " + evt.getSource().getBindingContext().getProperty("tooltip"));
		},

		onContextMenuSpot: function(evt) {
			MessageToast.show("onContextMenuSpot " + evt.getSource().getBindingContext().getProperty("tooltip"));
		}
	});

});
