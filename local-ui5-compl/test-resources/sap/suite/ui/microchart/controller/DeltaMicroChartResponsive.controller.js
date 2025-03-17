sap.ui.define([], function () {
    "use strict";

    jQuery.sap.initMobile();

    var fnPress = function (oEvent) {
        sap.m.MessageToast.show("The Delta microchart is pressed.");
    };

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
        color: sap.m.ValueColor.Good,
        deltaDisplayValue: "5555 Mio",
        tooltip: "Cumulative Totals\n((AltText))\ncalculated in EURO"
    };

    var oConfModel = new sap.ui.model.json.JSONModel();
    oConfModel.setData(oConfDMCData);

    var buildChart = function (sSize) {
        var chart = new sap.suite.ui.microchart.DeltaMicroChart({
            size: sSize ? "{/sizes/" + sSize + "}" : null,
            value1: "{/value1}",
            value2: "{/value2}",
            title1: "{/title1}",
            title2: "{/title2}",
            displayValue1: "{/displayValue1}",
            displayValue2: "{/displayValue2}",
            deltaDisplayValue: "{/deltaDisplayValue}",
            color: "{/color}",
            press: fnPress,
            tooltip: "{/tooltip}"
        });
        chart.setModel(oConfModel);
        return chart;
    };

    var oMediumSizeChart = buildChart(sap.m.Size.M);
    var oSmallSizeChart = buildChart(sap.m.Size.S);
    var oResponsiveChart = buildChart();

    oResponsiveChart.placeAt("content");
    oSmallSizeChart.placeAt("oldExampleS");
    oMediumSizeChart.placeAt("oldExampleM");

    var oHeightSlider = new sap.m.Slider({
        value: 72,
        step: 1,
        min: 10,
        max: 400,
        liveChange: function (oControlEvent) {
            var height = oControlEvent.getParameter("value");
            jQuery("#content").css("height", height + "px");
            oResponsiveChart.invalidate();
        }
    });

    var oWidthSlider = new sap.m.Slider({
        value: 168,
        step: 1,
        min: 10,
        max: 400,
        liveChange: function (oControlEvent) {
            var width = oControlEvent.getParameter("value");
            jQuery("#content").css("width", width + "px");
            oResponsiveChart.invalidate();
        }
    });

    var oCCSimpleForm = new sap.ui.layout.form.SimpleForm("controls-cc", {
        maxContainerCols: 4,
        editable: true,
        content: [oHeightSlider, oWidthSlider]
    });
    oCCSimpleForm.placeAt("modifiers");


});