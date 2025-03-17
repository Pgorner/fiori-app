sap.ui.define([], function () {
    "use strict";

    jQuery.sap.initMobile();

    var oLMCData = {
        size: "Responsive",
        points: [
            { x: 0, y: 53, show: true },
            { x: 8, y: 40 },
            { x: 20, y: 10 },
            { x: 30, y: 30, show: true },
            { x: 40, y: 52, show: true },
            { x: 100, y: 73, show: true }
        ],
        pointsNoLabels: [
            { x: 0, y: 53 },
            { x: 8, y: 40 },
            { x: 20, y: 10 },
            { x: 30, y: 30 },
            { x: 40, y: 52 },
            { x: 100, y: 73, color: "Good", show: true }
        ],
        threshold: 40,
        color: "Neutral",
        leftTopLabel: "120 Mio",
        rightTopLabel: "140 Mio",
        leftBottomLabel: "Sept 2016",
        rightBottomLabel: "Oct 2016",
        showPoints: true
    };
    var oConfModel = new sap.ui.model.json.JSONModel();
    oConfModel.setData(oLMCData);
    // sap.ui.getCore().setModel(oConfModel);

    function fnPointsFactory() {
        return new sap.suite.ui.microchart.LineMicroChartPoint({
            x: "{x}",
            y: "{y}"
        });
    }
    function fnEmphasizedPointsFactory() {
        return new sap.suite.ui.microchart.LineMicroChartEmphasizedPoint({
            x: "{x}",
            y: "{y}",
            show: "{show}",
            color: "{color}"
        });
    }

    var fnPress = function (oEvent) {
        sap.m.MessageToast.show("The chart '" + oEvent.getParameter("id") + "' is pressed.");
    };

    function buildChart(chartName, pointsFactory) {
        var chart =  new sap.suite.ui.microchart.LineMicroChart("lmc-" + chartName, {
            size: "{/size}",
            points: {
                path: "/points",
                factory: pointsFactory
            },
            press: fnPress,
            threshold: "{/threshold}",
            color: "{/color}",
            leftTopLabel: "{/leftTopLabel}",
            rightTopLabel: "{/rightTopLabel}",
            leftBottomLabel: "{/leftBottomLabel}",
            rightBottomLabel: "{/rightBottomLabel}",
            tooltip: "{/tooltip}",
            showPoints: "{/showPoints}"
        });
        chart.setModel(oConfModel);
        return chart;
    }

    function buildChartWithoutLabels(chartName, pointsFactory) {
        var chart =  new sap.suite.ui.microchart.LineMicroChart("lmc-" + chartName, {
            size: "{/size}",
            points: {
                path: "/pointsNoLabels",
                factory: pointsFactory
            },
            press: fnPress,
            threshold: "{/threshold}",
            color: "{/color}"
        });
        chart.setModel(oConfModel);
        return chart;
    }

    var oPointsChart = buildChart("points", fnPointsFactory);
    oPointsChart.placeAt("contentPoints");
    var oEmphasizedPointsChart = buildChart("emphasizedpoints", fnEmphasizedPointsFactory);
    oEmphasizedPointsChart.placeAt("contentEmphasizedPoints");
    var oEmphasizedPointsChartNoLabels = buildChartWithoutLabels("emphasizedpointsnolabels", fnEmphasizedPointsFactory);
    oEmphasizedPointsChartNoLabels.placeAt("contentEmphasizedPointsNoLabels");

    var oHeightSlider = new sap.m.Slider({
        value: 172,
        step: 1,
        min: 10,
        max: 800,
        liveChange: function (oControlEvent) {
            var fHeight = oControlEvent.getParameter("value");
            jQuery("#contentPoints").css("height", fHeight + "px");
            jQuery("#contentEmphasizedPoints").css("height", fHeight + "px");
            jQuery("#contentEmphasizedPointsNoLabels").css("height", fHeight + "px");
            oPointsChart.invalidate();
            oEmphasizedPointsChart.invalidate();
            oEmphasizedPointsChartNoLabels.invalidate();
        }
    });

    var oWidthSlider = new sap.m.Slider({
        value: 368,
        step: 1,
        min: 10,
        max: 800,
        liveChange: function (oControlEvent) {
            var fWidth = oControlEvent.getParameter("value");
            jQuery("#contentPoints").css("width", fWidth + "px");
            jQuery("#contentEmphasizedPoints").css("width", fWidth + "px");
            jQuery("#contentEmphasizedPointsNoLabels").css("width", fWidth + "px");
            oPointsChart.invalidate();
            oEmphasizedPointsChart.invalidate();
            oEmphasizedPointsChartNoLabels.invalidate();
        }
    });

    var oLMCSimpleForm = new sap.ui.layout.form.SimpleForm("controls-lmc", {
        maxContainerCols: 4,
        editable: true,
        content: [oHeightSlider, oWidthSlider]
    });

    oLMCSimpleForm.placeAt("modifiers");
    window.setTimeout(function () {
        oPointsChart.invalidate();
        oEmphasizedPointsChart.invalidate();
        oEmphasizedPointsChartNoLabels.invalidate();
    }, 300);


});