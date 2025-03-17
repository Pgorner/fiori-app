sap.ui.define([], function () {
    "use strict";

	jQuery.sap.initMobile();
	var oData = {
		points: [
			{label : "May", value : 91.4, unit : "", color: sap.m.ValueColor.Good},
			{label : "June", value : 29.8, unit : "", color: sap.m.ValueColor.Neutral},
			{label : "July", value : 91.4, unit : "", color: sap.m.ValueColor.Good, selected : true},
			{label : "Aug", value : 29.8, unit : "", color: sap.m.ValueColor.Neutral},
			{label : "Sep", value :91.4, unit : "", color: sap.m.ValueColor.Good, selected : true},
			{label : "Oct", value : 29.8, unit : "", color: sap.m.ValueColor.Neutral, selected : true}
		],
		pointsNorm: [
			{label : "May", value :29.890, unit : "", color: sap.m.ValueColor.Neutral},
			{label : "June", value : 29.9, unit : "", color: sap.m.ValueColor.Neutral},
			{label : "July", value : 29.8505, unit : "", color: sap.m.ValueColor.Neutral, selected : true},
			{label : "Aug", value : 29.8405, unit : "", color: sap.m.ValueColor.Neutral},
			{label : "Sep", value : 29.8505, unit : "", color: sap.m.ValueColor.Neutral, selected : true},
			{label : "Oct", value : 29.9, unit : "", color: sap.m.ValueColor.Neutral, selected : true}
		],
		pointsNa: [
			{label : "May", value : 0, unit : "", color: sap.m.ValueColor.Critical},
			{label : "June", value : null, color: sap.m.ValueColor.Error},
			{label : "July", value : 20.1, unit : "", color: sap.m.ValueColor.Neutral, selected : true},
			{label : "Aug", value : 29.8, unit : "", color: sap.m.ValueColor.Neutral},
			{label : "Sep", value : null, color: sap.m.ValueColor.Neutral, selected : true},
			{label : "Oct", value : null, color: sap.m.ValueColor.Critical, selected : true}
		]
	};
	var oModel = new sap.ui.model.json.JSONModel();
	oModel.setData(oData);

	var fnPress = function (oEvent) {
		sap.m.MessageToast.show("The chart is pressed.");
	};

	var oLineTempl = new sap.suite.ui.microchart.InteractiveLineChartPoint({
		label : "{label}",
		value : "{value}",
		displayedValue: {
			parts: [
				"value",
				"unit"
				],
			formatter: function(value, unit) {
				return value + unit;
			}
		},
		color : "{color}",
		selected : "{selected}"
	});

	var oLineChart = new sap.suite.ui.microchart.InteractiveLineChart({
		points: {
			path: "/points",
			template: oLineTempl
		},
		selectionChanged: function(oEvent) {
			sap.m.MessageToast.show("The number of selected points is: " + oEvent.getParameter("selectedPoints").length);
		},
		press: fnPress
	});
    oLineChart.setModel(oModel);
	oLineChart.placeAt("content");

	var oLineChartNorm = new sap.suite.ui.microchart.InteractiveLineChart({
		selectionEnabled: false,
		points: {
			path: "/pointsNorm",
			template: oLineTempl
		},
		selectionChanged: function(oEvent) {
			sap.m.MessageToast.show("The number of selected points is: " + oEvent.getParameter("selectedPoints").length);
		},
		press: fnPress
	});
    oLineChartNorm.setModel(oModel);
	oLineChartNorm.placeAt("contentNorm");

	var oLineChartNa = new sap.suite.ui.microchart.InteractiveLineChart({
		selectionEnabled: false,
		points: {
			path: "/pointsNa",
			template: oLineTempl
		},
		selectionChanged: function(oEvent) {
			sap.m.MessageToast.show("The number of selected points is: " + oEvent.getParameter("selectedPoints").length);
		},
		press: fnPress
	});
    oLineChartNa.setModel(oModel);
	oLineChartNa.placeAt("contentNa");

	var oHeightSlider = new sap.m.Slider({
		showAdvancedTooltip: true,
		value : 160,
		step : 1,
		min : 40,
		max : 700,
		liveChange : function(oControlEvent) {
			var height = oControlEvent.getParameter("value");
			jQuery("#content").css("height", height + "px");
			jQuery("#contentNorm").css("height", height + "px");
			jQuery("#contentNa").css("height", height + "px");
		}
	});

	var oWidthSlider = new sap.m.Slider({
		showAdvancedTooltip: true,
		value : 320,
		step : 1,
		min : 40,
		max : 700,
		liveChange : function(oControlEvent) {
			var width = oControlEvent.getParameter("value");
			jQuery("#content").css("width", width + "px");
			jQuery("#contentNorm").css("width", width + "px");
			jQuery("#contentNa").css("width", width + "px");
		}
	});

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

			if (bState) {
				jQuery(".sapSuiteILC").each(function() {
					var oControl = sap.ui.getCore().byId(jQuery(this).data("sap-ui"));
					if (oControl) {
						oControl.addStyleClass("sapUiSizeCompact");
						oControl.rerender();
					}
				});
			} else {
				jQuery(".sapSuiteILC").each(function() {
					var oControl = sap.ui.getCore().byId(jQuery(this).data("sap-ui"));
					if (oControl) {
						oControl.removeStyleClass("sapUiSizeCompact");
						oControl.rerender();
					}
				});
			}
		}
	});
	var oCompactForm = new sap.ui.layout.form.SimpleForm("compact-form", {
		editable : true,
		content : [oCompactLbl, oCompactSwitch ]
	});
	oCompactForm.placeAt("compact");


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
});