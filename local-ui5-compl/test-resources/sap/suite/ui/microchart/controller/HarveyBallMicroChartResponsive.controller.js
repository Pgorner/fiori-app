sap.ui.define([], function () {
    "use strict";

	jQuery.sap.initMobile();

	var fnPress = function (oEvent) {
		sap.m.MessageToast.show("The Harvey ball microchart is pressed.");
	};

	var oData = {
		sizes: {
			L: sap.m.Size.L,
			M: sap.m.Size.M,
			S: sap.m.Size.S,
			XS: sap.m.Size.XS,
			Auto: sap.m.Size.Auto
		},
		total: 360,
		totalLabel: "360",
		totalScale: "Mrd",
		formattedLabel: false,
		showTotal: true,
		showFractions: true,
		items: [{
			fraction: 130,
			color: sap.m.ValueColor.Good,
			fractionLabel: "130",
			fractionScale: "Mln",
			formattedLabel: false
		}],
		tooltip: "Cumulative Totals\n((AltText))\ncalculated in EURO"
	};

	var oModel = new sap.ui.model.json.JSONModel();
	oModel.setData(oData);

	var buildChart = function(sSize) {
		var oRMCItemTemplate = new sap.suite.ui.microchart.HarveyBallMicroChartItem({
			fraction: "{fraction}",
			color: "{color}",
			fractionLabel: "{fractionLabel}",
			fractionScale: "{fractionScale}",
			formattedLabel: "{formattedLabel}"
		});

		var oRMCTemplate = new sap.suite.ui.microchart.HarveyBallMicroChart({
			formattedLabel: "{/formattedLabel}",
			showTotal: "{/showTotal}",
			showFractions: "{/showFractions}",
			colorPalette: "{/colorPalette}",
			size: sSize ? "{/sizes/" + sSize + "}" : null,
			total: "{/total}",
			totalLabel: "{/totalLabel}",
			totalScale: "{/totalScale}",
			width: "{/width}",
			items: {
				template: oRMCItemTemplate,
				path: "/items"
			},
			tooltip: "{/tooltip}",
			press: fnPress
		});
        oRMCTemplate.setModel(oModel);
		return oRMCTemplate;
	};

	var oCCM = buildChart(sap.m.Size.M);
	var oCCS = buildChart(sap.m.Size.S);
	var oResponsiveCMC = buildChart();
	oResponsiveCMC.placeAt("content");
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
			oResponsiveCMC.invalidate();
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
			oResponsiveCMC.invalidate();
		}
	});

	var oSimpleForm = new sap.ui.layout.form.SimpleForm("controls-cc", {
		maxContainerCols : 4,
		editable : true,
		content : [ oHeightSlider, oWidthSlider ]
	});

	oSimpleForm.placeAt("modifiers");
});