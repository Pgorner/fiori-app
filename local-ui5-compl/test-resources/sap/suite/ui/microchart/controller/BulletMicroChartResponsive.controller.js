sap.ui.define([], function () {
    "use strict";

    jQuery.sap.initMobile();
    var oData = {
        sizes: {
            L: sap.m.Size.L,
            M: sap.m.Size.M,
            S: sap.m.Size.S,
            XS: sap.m.Size.XS,
            Auto: sap.m.Size.Auto
        },
        scale: "M",
        actual: {
            value: 120,
            color: sap.m.ValueColor.Good
        },
        forecastValue: 110,
        targetValue: 100,
        thresholds: [
            { value: 0, color: sap.m.ValueColor.Error },
            { value: 50, color: sap.m.ValueColor.Critical },
            { value: 150, color: sap.m.ValueColor.Critical },
            { value: 200, color: sap.m.ValueColor.Error }
        ],
        showActualValue: true,
        showTargetValue: true,
        showDeltaValue: true,
        showValueMarker: true,
        mode: sap.suite.ui.microchart.BulletMicroChartModeType.Actual,
        tooltip: "Cumulative Totals\n((AltText))\ncalculated in EURO"
    };

    var oConfModel = new sap.ui.model.json.JSONModel();
    oConfModel.setData(oData);

    var buildChart = function (sSize) {
        var chart = new sap.suite.ui.microchart.BulletMicroChart({
            size: sSize ? "{/sizes/" + sSize + "}" : null,
            scale: "{/scale}",
            width: "{/width}",
            targetValue: "{/targetValue}",
            forecastValue: "{/forecastValue}",
            minValue: "{/minValue}",
            maxValue: "{/maxValue}",
            showActualValue: "{/showActualValue}",
            showTargetValue: "{/showTargetValue}",
            showDeltaValue: "{/showDeltaValue}",
            showValueMarker: "{/showValueMarker}",
            mode: "{/mode}",
            actualValueLabel: "{/actualValueLabel}",
            deltaValueLabel: "{/deltaValueLabel}",
            targetValueLabel: "{/targetValueLabel}",
            tooltip: "{/tooltip}",
            scaleColor: "{/scaleColor}",
            actual: {
                value: "{/actual/value}",
                color: "{/actual/color}"
            },
            thresholds: {
                template: new sap.suite.ui.microchart.BulletMicroChartData({
                    value: "{value}",
                    color: "{color}"
                }),
                path: "/thresholds"
            }
        });
        chart.setModel(oConfModel);
        return chart;
    };
    var oResponsiveBulletChart = buildChart();

    oResponsiveBulletChart.placeAt("content");

    var oHeightSlider = new sap.m.Slider({
        value: 72,
        step: 1,
        min: 10,
        max: 400,
        liveChange: function (oControlEvent) {
            var height = oControlEvent.getParameter("value");
            jQuery("#content").css("height", height + "px");
            oResponsiveBulletChart.invalidate();
        }
    });

    var oWidthSlider = new sap.m.Slider({
        value: 168,
        step: 1,
        min: 10,
        max: 600,
        liveChange: function (oControlEvent) {
            var width = oControlEvent.getParameter("value");
            jQuery("#content").css("width", width + "px");
            oResponsiveBulletChart.invalidate();
        }
    });

    var oSimpleForm = new sap.ui.layout.form.SimpleForm("controls-cc", {
        maxContainerCols: 4,
        editable: true,
        content: [oHeightSlider, oWidthSlider]
    });

    oSimpleForm.placeAt("modifiers");
});