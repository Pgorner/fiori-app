sap.ui.define([], function () {
    "use strict";

    jQuery.sap.initMobile();
    var oData = {
        columns: [{
            label: "Afghanistan",
            value: 40,
            color: "Error"
        }, {
            label: "Albania",
            value: 50,
            color: "Error"
        }, {
            label: "Algeria",
            value: 60,
            color: "Error"
        }, {
            label: "Andorra",
            value: 40,
            color: "Neutral"
        }, {
            label: "Angola",
            value: 35,
            color: "Neutral"
        }, {
            label: "Antigua and Barbuda",
            value: 10,
            color: "Neutral"
        }],
        tooltip: "Cumulative Totals\n((AltText))\ncalculated in EURO",
        leftTopLabel: {
            label: "June 1",
            color: "Good"
        },
        leftBottomLabel: {
            label: "0M",
            color: "Good"
        },
        rightTopLabel: {
            label: "June 30",
            color: "Critical"
        },
        rightBottomLabel: {
            label: "80M",
            color: "Critical"
        }
    };

    var oModel = new sap.ui.model.json.JSONModel(oData);

    function fnChartPress(oEvent) {
        sap.m.MessageToast.show("The chart is pressed.");
    }

    function fnBarPress(oEvent) {
        sap.m.MessageToast.show("The " + oEvent.getSource().getLabel() + " bar is pressed.");
    }

    var oClmnDataTmpl = new sap.suite.ui.microchart.ColumnMicroChartData({
        label: "{label}",
        value: "{value}",
        color: "{color}",
        press: fnBarPress
    });

    var buildLabel = function (sName) {
        return new sap.suite.ui.microchart.ColumnMicroChartLabel({
            label: "{/" + sName + "/label}",
            color: "{/" + sName + "/color}"
        });
    };

    var oCmc = new sap.suite.ui.microchart.ColumnMicroChart("cmc", {
        size: "Responsive",
        columns: {
            path: "/columns",
            template: oClmnDataTmpl
        },
        press: fnChartPress,
        tooltip: "{/tooltip}",
        leftBottomLabel: buildLabel("leftBottomLabel"),
        rightBottomLabel: buildLabel("rightBottomLabel"),
        leftTopLabel: buildLabel("leftTopLabel"),
        rightTopLabel: buildLabel("rightTopLabel")
    });
    oCmc.setModel(oModel);
    oCmc.placeAt("content");

    var chart1 = new sap.suite.ui.microchart.ColumnMicroChart("FixedCmcS", {
        width: "{/width}",
        height: "{/height}",
        size: "S",
        columns: {
            path: "/columns",
            template: oClmnDataTmpl
        },
        press: fnChartPress,
        tooltip: "{/tooltip}",
        leftBottomLabel: buildLabel("leftBottomLabel"),
        rightBottomLabel: buildLabel("rightBottomLabel"),
        leftTopLabel: buildLabel("leftTopLabel"),
        rightTopLabel: buildLabel("rightTopLabel")
    });
    chart1.setModel(oModel);
    chart1.placeAt("oldExampleS");

    var chart2 = new sap.suite.ui.microchart.ColumnMicroChart("FixedCmcM", {
        width: "{/width}",
        height: "{/height}",
        size: "L",
        columns: {
            path: "/columns",
            template: oClmnDataTmpl
        },
        press: fnChartPress,
        tooltip: "{/tooltip}",
        leftBottomLabel: buildLabel("leftBottomLabel"),
        rightBottomLabel: buildLabel("rightBottomLabel"),
        leftTopLabel: buildLabel("leftTopLabel"),
        rightTopLabel: buildLabel("rightTopLabel")
    });
    chart2.setModel(oModel);
    chart2.placeAt("oldExampleM");

    var oSlider6 = new sap.m.Slider({
        value: 200,
        step: 0.0001,
        min: 10,
        max: 400,
        liveChange: function (oControlEvent) {
            var height = oControlEvent.getParameter("value");
            jQuery("#content").css("height", height + "px");
            oCmc.invalidate();
        }
    });

    var oSlider7 = new sap.m.Slider({
        value: 200,
        step: 0.0001,
        min: 10,
        max: 400,
        liveChange: function (oControlEvent) {
            var width = oControlEvent.getParameter("value");
            jQuery("#content").css("width", width + "px");
            oCmc.invalidate();
        }
    });

    new sap.ui.layout.form.SimpleForm("cmc-sliders-form", {
        maxContainerCols: 4,
        editable: true,
        content: [oSlider6, oSlider7]
    }).placeAt("modifiers");
});