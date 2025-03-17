sap.ui.define([
	"sap/ui/core/mvc/XMLView",
	"sap/ui/core/mvc/View",
    "sap/ui/core/mvc/Controller"
], function (XMLView, View, Controller) {
	"use strict";

	jQuery.sap.initMobile();
	// define a new (simple) Controller type
	Controller.extend("test", {
		onInit: function () {
			var data = {
				items: [{
					value1: 20,
					value2: 200,
					title1: "May 2014",
					title2: "Apr 2014",
					displayValue1: "8833 Mio",
					displayValue2: "8888 Mio",
					deltaDisplayValue: "5555 Mio",
					tooltip: "Cumulative Totals\n((AltText))\ncalculated in EURO"
				}]
			};
			var oModel = new sap.ui.model.json.JSONModel(data);
			this.getView().setModel(oModel);
		},
		press: fnPress
	});

	// instantiate the View
	var oView = new XMLView({
		viewContent: jQuery('#view1').html()
	});

	function _fnParseFloat(fValue) {
		if (!fValue || fValue.length === 0 || fValue === "-") {
			return undefined;
		} if (/[.,]$/.test(fValue)) {
			return sap.ui.core.format.NumberFormat.getFloatInstance().parse(fValue.slice(0, -1));
		} else {
			return sap.ui.core.format.NumberFormat.getFloatInstance().parse(fValue);
		}
	}

	var oConfDMCData = {
		sizes: {
			M: sap.m.Size.M,
			S: sap.m.Size.S,
			Auto: sap.m.Size.Auto
		},
		value1: 20,
		value2: 200,
		title1: "May 2014",
		title2: "Apr 2014",
		displayValue1: "8833 Mio",
		displayValue2: "8888 Mio",
		deltaDisplayValue: "5555 Mio",
		tooltip: "Cumulative Totals\n((AltText))\ncalculated in EURO"
	};

	var oConfModel = new sap.ui.model.json.JSONModel();
	oConfModel.setData(oConfDMCData);

	function fnPress(oEvent) {
		sap.m.MessageToast.show("The Delta micro chart is pressed.");
	};

	var aDMCs = [];
	var buildDMC = function (sSize, sText) {
		var bFixedSizeGiven = sSize && sSize in sap.m.Size;
		var sIdSuffix, sWidth, sHeight;
		if (bFixedSizeGiven) {
			sIdSuffix = sSize;
			sWidth = "210px";
			sHeight = "110px";
		} else {
			sIdSuffix = sText + sHeight + sWidth;
			sWidth = sSize.width;
			sHeight = sSize.height;
		}
		var oDMCTmpl = new sap.suite.ui.microchart.DeltaMicroChart("delta-chart-" + sText + sHeight + sWidth, {
			size: bFixedSizeGiven ? "{/sizes/" + sSize + "}" : null,
			value1: "{/value1}",
			value2: "{/value2}",
			title1: "{/title1}",
			title2: "{/title2}",
			displayValue1: "{/displayValue1}",
			displayValue2: "{/displayValue2}",
			deltaDisplayValue: "{/deltaDisplayValue}",
			color: "{/color}",
			width: "{/width}",
			press: fnPress,
			tooltip: "{/tooltip}"
		});
		oDMCTmpl.setModel(oConfModel);
		aDMCs.push(oDMCTmpl);

		return new sap.m.FlexBox("dmc-fb-" + sIdSuffix, {
			items: [oDMCTmpl],
			layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({ minWidth: 200 }),
			height: sHeight,
			width: sWidth
		});
	};
	var oFixedSizeFormLabel = new sap.m.Label({
		text: "Fixed sizes:",
		labelFor: "dmc-form"
	});
	var oDMCForm = new sap.ui.layout.form.SimpleForm("dmc-form", {
		content: [
			buildDMC(sap.m.Size.L, "large"),
			buildDMC(sap.m.Size.M, "medium"),
			buildDMC(sap.m.Size.S, "small"),
			buildDMC(sap.m.Size.XS, "extrasmall")
		]
	});
	var oResponsiveFormLabel = new sap.m.Label({
		text: "Responsive controls in FlexBox:",
		labelFor: "dmc-responsive-form"
	});

	var oBCResponsiveForm = new sap.ui.layout.form.SimpleForm("dmc-responsive-form", {
		content: [
			buildDMC({ width: "190px", height: "140px" }, "largeResponsive"),
			buildDMC({ width: "178px", height: "82px" }, "mediumResponsive"),
			buildDMC({ width: "132px", height: "56px" }, "smallResponsive"),
			buildDMC({ width: "128px", height: "36px" }, "extrasmallResponsive")
		]
	});
	var oSettingsPanelLabel = new sap.m.Label({
		text: "Settings:",
		labelFor: "controls-bc"
	});
	var oTooltipLbl = new sap.m.Label({
		text: "Tooltip",
		labelFor: "tooltip"
	});

	var oTooltipInput = new sap.m.TextArea("tooltip", {
		rows: 3,
		placeholder: 'Enter tooltip (use ((AltText)) for inserting the default text) ...',
		value: "{/tooltip}"
	});

	var oTooltipSwtchLbl = new sap.m.Label({
		text: "QuickView Tooltip",
		labelFor: "tooltip-swtch"
	});

	var oTooltipSwtch = new sap.m.Switch({
		id: "tooltip-swtch",
		state: false,
		name: "QuickView tooltip",
		change: function (oE) {
			var bState = oE.getParameter("state");
			for (var i = 0; i < aDMCs.length; i++) {
				aDMCs[i].setTooltip(bState ?
					new View({ content: new sap.m.Text({ text: oTooltipInput.getValue().split("((AltText))").join(aDMCs[i].getAltText()) }) })
					: oTooltipInput.getValue());
			}
		}
	});

	var oFirstValueLbl = new sap.m.Label({
		text: "value1",
		labelFor: "first-value"
	});

	var oFirstValueInput = new sap.m.Input("first-value", {
		placeholder: 'Enter the first value ...',
		value: {
			path: "/value1",
			type: new sap.ui.model.type.Float({ groupingEnabled: false })
		},
		liveChange: function (oControlEvent) {
			var fValue = _fnParseFloat(oControlEvent.getParameter("newValue"));
			if (typeof fValue == "undefined" || !isNaN(fValue)) {
				oConfDMCData.value1 = fValue;
				oConfModel.checkUpdate();
			}
		}
	});

	var oSecondValueLbl = new sap.m.Label({
		text: "value2",
		labelFor: "second-value"
	});

	var oSecondValueInput = new sap.m.Input("second-value", {
		placeholder: 'Enter the second value ...',
		value: {
			path: "/value2",
			type: new sap.ui.model.type.Float({ groupingEnabled: false })
		},
		liveChange: function (oControlEvent) {
			var fValue = _fnParseFloat(oControlEvent.getParameter("newValue"));
			if (typeof fValue == "undefined" || !isNaN(fValue)) {
				oConfDMCData.value2 = fValue;
				oConfModel.checkUpdate();
			}
		}
	});

	var oDisplayValue1Lbl = new sap.m.Label({
		text: "Display Value 1",
		labelFor: "display-value-1"
	});

	var oDisplayValue1Input = new sap.m.Input("display-value-1", {
		placeholder: 'Enter display value 1...',
		value: "{/displayValue1}"
	});

	var oDisplayValue2Lbl = new sap.m.Label({
		text: "Display Value 2",
		labelFor: "display-value-2"
	});

	var oDisplayValue2Input = new sap.m.Input("display-value-2", {
		placeholder: 'Enter display value 2...',
		value: "{/displayValue2}"
	});

	var oDeltaDisplayValueLbl = new sap.m.Label({
		text: "Delta Display Value",
		labelFor: "delta-display-value"
	});

	var oDeltaDisplayValueInput = new sap.m.Input("delta-display-value", {
		placeholder: 'Enter delta display value...',
		value: "{/deltaDisplayValue}"
	});

	var oTitle1Lbl = new sap.m.Label({
		text: "Title 1",
		labelFor: "title-1"
	});

	var oTitle1Input = new sap.m.Input("title-1", {
		placeholder: 'Enter title 1 ...',
		value: "{/title1}"
	});

	var oTitle2Lbl = new sap.m.Label({
		text: "Title 2",
		labelFor: "title-2"
	});

	var oTitle2Input = new sap.m.Input("title-2", {
		placeholder: 'Enter title 2 ...',
		value: "{/title2}"
	});

	var oSColorLabel = new sap.m.Label("color-label", { text: "Color", labelFor: "color-select" });

	var buildColorItem = function (sId, sColor) {
		return new sap.ui.core.Item(sId + "-" + sColor, { key: sColor, text: sColor });
	};

	var oSColorSelect = new sap.m.Select("color-select", {
		width: "10rem",
		items: [
			buildColorItem("color-select", sap.m.ValueColor.Neutral),
			buildColorItem("color-select", sap.m.ValueColor.Good),
			buildColorItem("color-select", sap.m.ValueColor.Error),
			buildColorItem("color-select", sap.m.ValueColor.Critical)
		],
		selectedItemId: "color-select-" + oConfDMCData.color,
		change: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			oConfDMCData.color = oSelectedItem.getKey();
			oConfModel.checkUpdate();
		}
	});

	var oPressLbl = new sap.m.Label({ text: "Press Action", labelFor: "press-action" });

	var oPressSwtch = new sap.m.Switch({
		id: "press-action",
		state: true,
		change: function (oE) {
			var bState = oE.getParameter("state");
			for (var i = 0; i < aDMCs.length; i++) {
				if (bState) {
					aDMCs[i].attachPress(fnPress);
				} else {
					aDMCs[i].detachPress(fnPress);
				}
			}
		}
	});

	var oDMCSimpleForm = new sap.ui.layout.form.SimpleForm("controls-bc", {
		maxContainerCols: 2,
		editable: true,
		content: [
			oTooltipLbl, oTooltipInput, oTooltipSwtchLbl, oTooltipSwtch, oFirstValueLbl, oFirstValueInput,
			oSecondValueLbl, oSecondValueInput, oDisplayValue1Lbl, oDisplayValue1Input,
			oDisplayValue2Lbl, oDisplayValue2Input, oDeltaDisplayValueLbl,
			oDeltaDisplayValueInput, oSColorLabel, oSColorSelect, oTitle1Lbl, oTitle1Input,
			oTitle2Lbl, oTitle2Input, oPressLbl, oPressSwtch
		]
	});

	var oPage = new sap.m.Page("initial-page", {
		showHeader: false,
		content: [
			oFixedSizeFormLabel,
			oDMCForm,
			oResponsiveFormLabel,
			oBCResponsiveForm,
			oSettingsPanelLabel,
			oDMCSimpleForm,
			oView
		]
	});

	var oApp = new sap.m.App({
		pages: [
			oPage
		]
	});
	oApp.setModel(oConfModel);
	oApp.placeAt("content");


});