sap.ui.define([
	"sap/m/Button",
	"sap/m/Label",
	"sap/m/Text",
	"sap/ui/layout/form/SimpleForm"
], function (Button, Label, Text, SimpleForm) {
	"use strict";


	jQuery.sap.initMobile();

	var fnPress = function (oEvent) {
		sap.m.MessageToast.show("The Radial microchart is pressed.");
	};

	var oData = {
		sizes: {
			L: sap.m.Size.L,
			M: sap.m.Size.M,
			S: sap.m.Size.S,
			XS: sap.m.Size.XS,
			Auto: sap.m.Size.Auto,
			Responsive: sap.m.Size.Responsive
		},
		percentage: 45,
		valueColor: sap.m.ValueColor.Good,
		tooltip: null
	};

	var oModel = new sap.ui.model.json.JSONModel();
	oModel.setData(oData);

	var buildChart = function(sSize) {

		var oRMCTemplate = new sap.suite.ui.microchart.RadialMicroChart({
			percentage: "{/percentage}",
			valueColor: "{/valueColor}",
			size: sSize ? "{/sizes/" + sSize + "}" : null,
			tooltip: "{/tooltip}",
			press: fnPress
		});
        oRMCTemplate.setModel(oModel);
		return oRMCTemplate;
	};

	var oCCM = buildChart(sap.m.Size.M);
	var oCCS = buildChart(sap.m.Size.S);
	var oResponsiveRMC = buildChart(sap.m.Size.Responsive);
	oResponsiveRMC.placeAt("content");
	oCCS.placeAt("oldExampleS");
	oCCM.placeAt("oldExampleM");

	var oHeightSlider = new sap.m.Slider({
		value : 72,
		step : 0.0001,
		min : 20,
		max : 400,
		liveChange : function(oControlEvent) {
			var height = oControlEvent.getParameter("value");
			jQuery("#content").css("height", height + "px");
			oResponsiveRMC.invalidate();
		}
	});

	var oWidthSlider = new sap.m.Slider({
		value : 168,
		step : 0.0001,
		min : 10,
		max : 400,
		liveChange : function(oControlEvent) {
			var width = oControlEvent.getParameter("value");
			jQuery("#content").css("width", width + "px");
			oResponsiveRMC.invalidate();
		}
	});

	var oSimpleForm = new sap.ui.layout.form.SimpleForm("controls-cc", {
		maxContainerCols : 4,
		editable : true,
		content : [ oHeightSlider, oWidthSlider ]
	});

	oSimpleForm.placeAt("modifiers");

});