sap.ui.define([], function () {
    "use strict";
	jQuery.sap.initMobile();
	var oData = {
		min: -10,
		max: 100,
		displayedBars: 6,
		selectionEnabled: true,
		bars: [
			{label : "January", value : 20.5, displayedValue : "20.5%", color : sap.m.ValueColor.Neutral },
			{label : "February", value : -5.2, displayedValue : "-5.2%", color : sap.m.ValueColor.Critical },
			{label : "March", value : 18.5, displayedValue : "18.5%", color : sap.m.ValueColor.Neutral },
			{label : "May", value : 91.4, displayedValue : "91.4%", color : sap.m.ValueColor.Good },
			{label : "June", value : 100, displayedValue : "100%", color : sap.m.ValueColor.Good },
			{label : "July", value : 20.1, displayedValue : "20.1%", color : sap.m.ValueColor.Neutral, selected : true}
		],
		barsNa: [
			{label : "January", value : 20.5, displayedValue : "", color : sap.m.ValueColor.Neutral },
			{label : "February", value : 35.2, displayedValue : " ", color : sap.m.ValueColor.Good },
			{label : "March", value : null, displayedValue : "", color : sap.m.ValueColor.Neutral },
			{label : "May", value : 1234.5, displayedValue : "1234.5%", color : sap.m.ValueColor.Critical } ,
			{label : "June", value : null, displayedValue : "N/A", color : sap.m.ValueColor.Neutral },
			{label : "July", value : 20.1, displayedValue : "20.1%", color : sap.m.ValueColor.Neutral, selected : true}
		],
		barsAutoScale: [
			{label : "January", value : -0.5, displayedValue : "-0.5", color : sap.m.ValueColor.Critical },
			{label : "February", value : 5.2, displayedValue : "5.2", color : sap.m.ValueColor.Critical },
			{label : "March", value : 18.5, displayedValue : "18.5", color : sap.m.ValueColor.Neutral },
			{label : "May", value : 91.4, displayedValue : "91.4", color : sap.m.ValueColor.Good },
			{label : "June", value : 100, displayedValue : "100", color : sap.m.ValueColor.Good },
			{label : "July", value : 20.1, displayedValue : "20.1", color : sap.m.ValueColor.Neutral, selected : true}
		]
	};
	var oModel = new sap.ui.model.json.JSONModel();
	oModel.setData(oData);

	var fnPress = function (oEvent) {
		sap.m.MessageToast.show("The chart is pressed.");
	};

	var oBarTempl = new sap.suite.ui.microchart.InteractiveBarChartBar({
		label : "{label}",
		value : "{value}",
		displayedValue : "{displayedValue}",
		selected : "{selected}",
		color: "{color}"
	});

	var oBarChart = new sap.suite.ui.microchart.InteractiveBarChart({
		min: "{/min}",
		max: "{/max}",
		displayedBars: "{/displayedBars}",
		bars: {
			path: "/bars",
			template: oBarTempl
		},
		selectionChanged: function(oEvent) {
			sap.m.MessageToast.show("The number of selected bars is: " + oEvent.getParameter("selectedBars").length);
		},
		press: fnPress
	});
    oBarChart.setModel(oModel);
	oBarChart.placeAt("content");
	var oBarChartNa = new sap.suite.ui.microchart.InteractiveBarChart({
		min: "{/min}",
		max: "{/max}",
		displayedBars: "{/displayedBars}",
		selectionEnabled: false,
		bars: {
			path: "/barsNa",
			template: oBarTempl
		},
		selectionChanged: function(oEvent) {
			sap.m.MessageToast.show("The number of selected bars is: " + oEvent.getParameter("selectedBars").length);
		},
		press: fnPress
	});
    oBarChartNa.setModel(oModel);
	oBarChartNa.placeAt("contentNa");

	var oBarChartAutoScale = new sap.suite.ui.microchart.InteractiveBarChart({
		displayedBars: "{/displayedBars}",
		selectionEnabled: false,
		bars: {
			path: "/barsAutoScale",
			template: oBarTempl
		},
		selectionChanged: function(oEvent) {
			sap.m.MessageToast.show("The number of selected bars is: " + oEvent.getParameter("selectedBars").length);
		},
		press: fnPress
	});
    oBarChartAutoScale.setModel(oModel);
	oBarChartAutoScale.placeAt("contentAutoScale");

	var oHeightSlider = new sap.m.Slider({
		showAdvancedTooltip: true,
		value : 350,
		step : 1,
		min : 40,
		max : 700,
		liveChange : function(oControlEvent) {
			var height = oControlEvent.getParameter("value");
			jQuery("#content").css("height", height + "px");
			jQuery("#contentNa").css("height", height + "px");
			jQuery("#contentAutoScale").css("height", height + "px");
		}
	});

	var oWidthSlider = new sap.m.Slider({
		showAdvancedTooltip: true,
		value : 350,
		step : 1,
		min : 40,
		max : 700,
		liveChange : function(oControlEvent) {
			var width = oControlEvent.getParameter("value");
			jQuery("#content").css("width", width + "px");
			jQuery("#contentNa").css("width", width + "px");
			jQuery("#contentAutoScale").css("width", width + "px");
		}
	});

	oHeightSlider.setLayoutData(new sap.m.FlexItemData({
		growFactor: 1
	}));
	oWidthSlider.setLayoutData(new sap.m.FlexItemData({
		growFactor: 1
	}));

	var oModifiersForm = new sap.m.HBox("modifiers-form", {
		width: "100%",
		height: "6rem",
		alignItems: "End",
		items: [
			oHeightSlider,
			oWidthSlider
		]
	});
	oModifiersForm.placeAt("modifiers");

	// compact switch
	var oCompactLbl = new sap.m.Label({
		text: "Compact Mode",
		labelFor: "compactMode"
	});
	var oCompactSwitch = new sap.m.Switch({
		id: "compactMode",
		state: false,
		name: "Compact Mode",
		change: function(oEvent) {
			var bState = oEvent.getParameter("state");
			oData.compact = bState;
			oModel.checkUpdate();

			jQuery(".sapSuiteIBC").each(function() {
				var oControl = sap.ui.getCore().byId(jQuery(this).data("sap-ui"));
				if (oControl) {
					if (bState) {
						oControl.addStyleClass("sapUiSizeCompact");
					} else {
						oControl.removeStyleClass("sapUiSizeCompact");
					}
					oControl.invalidate();
				}
			});
		}
	});
	var oCompactForm = new sap.ui.layout.form.SimpleForm("compact-form", {
		editable : true,
		content : [oCompactLbl, oCompactSwitch ]
	});
	oCompactForm.placeAt("compact");

});