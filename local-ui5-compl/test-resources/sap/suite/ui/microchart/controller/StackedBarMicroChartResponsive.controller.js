sap.ui.define([
	"sap/m/Button",
	"sap/m/Label",
	"sap/m/Text",
	"sap/ui/layout/form/SimpleForm"
], function (Button, Label, Text, SimpleForm) {
	"use strict";

	jQuery.sap.initMobile();

	var oStackedBarData = {
		bars: [
			{ value: 10, displayValue:"10M" },
			{ value: 50, displayValue:"50M", valueColor: "sapUiChartPaletteSemanticGood" },
			{ value: 20, valueColor: "Critical" }
		]
	};

	var oModel = new sap.ui.model.json.JSONModel();
	oModel.setData(oStackedBarData);

	var fnPress = function (oEvent) {
		sap.m.MessageToast.show("The chart is pressed.");
	};

	var createStackedBarChart = function() {
		var oStackedBarItemTmpl = new sap.suite.ui.microchart.StackedBarMicroChartBar({
			value: "{value}",
			valueColor: "{valueColor}",
			displayValue: "{displayValue}"
		});
		var oStackedBarChartTmpl = new sap.suite.ui.microchart.StackedBarMicroChart({
			bars: {
				template : oStackedBarItemTmpl,
				path : "/bars"
			},
			press: fnPress,
			size: sap.m.Size.Responsive
		});
        oStackedBarChartTmpl.setModel(oModel);
		return (oStackedBarChartTmpl);
	};

	// creates the charts
	var oStackedBarChart1 = createStackedBarChart();
	var oStackedBarChart2 = createStackedBarChart();
	oStackedBarChart2.setMaxValue(110);

	oStackedBarChart1.placeAt("content1");
	oStackedBarChart2.placeAt("content2");

	// vertical slider
	var oHeightSlider = new sap.m.Slider({
		value : 200,
		step : 0.0001,
		min : 10,
		max : 600,
		liveChange : function(oControlEvent) {
			var height = oControlEvent.getParameter("value");
			jQuery("#content1").css("height", height + "px");
			jQuery("#content2").css("height", height + "px");
			oStackedBarChart1.invalidate();
			oStackedBarChart2.invalidate();
		}
	});

	// horizontal slider
	var oWidthSlider = new sap.m.Slider({
		value : 300,
		step : 0.0001,
		min : 10,
		max : 600,
		liveChange : function(oControlEvent) {
			var width = oControlEvent.getParameter("value");
			jQuery("#content1").css("width", width + "px");
			jQuery("#content2").css("width", width + "px");
			oStackedBarChart1.invalidate();
			oStackedBarChart2.invalidate();
		}
	});

	new sap.ui.layout.form.SimpleForm("controls-sbmc", {
		maxContainerCols : 4,
		editable : true,
		content : [ oHeightSlider, oWidthSlider ]
	}).placeAt("modifiers");
});