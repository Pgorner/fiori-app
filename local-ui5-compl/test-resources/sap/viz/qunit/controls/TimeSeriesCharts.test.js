/*global QUnit */
sap.ui.define([
	"sap/base/i18n/Localization",
	"sap/viz/ui5/controls/common/feeds/FeedItem",
	"sap/viz/ui5/controls/VizFrame",
	"sap/viz/ui5/data/FlattenedDataset",
	"sap/ui/model/json/JSONModel",
	"./CommonUtil",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/viz/ui5/data/DimensionDefinition", // implicitly used when creating a FlattendDataset with shorthand notation
	"sap/viz/ui5/data/MeasureDefinition", // implicitly used when creating a FlattendDataset with shorthand notation
], function(Localization, FeedItem, VizFrame, FlattenedDataset, JSONModel, CommonUtil, createAndAppendDiv) {
    "use strict";

createAndAppendDiv("content").style = "width: 800px; height: 800px";

QUnit.module("Time Series Chart Types");

var oModel = new JSONModel({
    businessData1 : [{
        "Date": 1388505600000,
        "Country": "China",
        "Value": 131.7715651821345,
        "Value2": 12,
        "Time": "abc"
    }, {
        "Date": 1388505600000,
        "Country": "Japan",
        "Value": 732.2505286429077,
        "Value2": 123,
        "Time": 1388505600000
    }, {
        "Date": 1388505600000,
        "Country": "France",
        "Value": 301.2606957927346,
        "Value2": 12,
        "Time": 1388505600000
    }, {
        "Date": 1388505600000,
        "Country": "UK",
        "Value": 815.9925150685012,
        "Value2": 456,
        "Time": 1388505600000
    }, {
        "Date": 1391097600000,
        "Country": "China",
        "Value": 184.3122337013483,
        "Value2": 12,
        "Time": 1391097600000
    }, {
        "Date": 1391097600000,
        "Country": "Japan",
        "Value": 350.25157197378576,
        "Value2": 123,
        "Time": 1391097600000
    }, {
        "Date": 1391097600000,
        "Country": "France",
        "Value": 62.60869628749788,
        "Value2": 123,
        "Time": 1391097600000
    }, {
        "Date": 1391097600000,
        "Country": "UK",
        "Value": 897.1779812127352,
        "Value2": 123,
        "Time": 1391097600000
    }]
});

QUnit.test("Time Series Line Chart", function(assert) {
    assert.expect(1);
    var done = assert.async();
    var oDataset = new FlattenedDataset({
        dimensions: [{
            name: 'Date',
            value: "{Date}",
            dataType: 'date'
        }, {
            name: 'Country',
            value: "{Country}"
        }],
        measures: [{
            name: 'Value',
            value: '{Value}'
        }],
        data: {
            path: "/businessData1"
        }
    });
    var oVizFrame = CommonUtil.createVizFrame({
        viztype:"timeseries_line"
    });

    oVizFrame.setDataset(oDataset);
    oVizFrame.setModel(oModel);

    var feedValueAxis = new FeedItem({
            'uid': "valueAxis",
            'type': "Measure",
            'values': ["Value"]
        }),
        feedCategoryAxis = new FeedItem({
            'uid': "timeAxis",
            'type': "Dimension",
            'values': ["Date"]
        }),
        feedColor = new FeedItem({
            'uid': "color",
            'type': "Dimension",
            'values': ["Country"]
        });

    oVizFrame.addFeed(feedValueAxis);
    oVizFrame.addFeed(feedCategoryAxis);
    oVizFrame.addFeed(feedColor);
    oVizFrame.placeAt('content');
    oVizFrame.attachEventOnce('renderComplete', function(){
        var plot = document.querySelector("#content .v-plot-main");
        assert.ok(plot != null, "Time Series Line Plot exists.");
        CommonUtil.destroyVizFrame(oVizFrame);
        done();
    });
});

QUnit.test("Time Series Scatter Chart", function(assert) {
    assert.expect(1);
    var done = assert.async();
    var oDataset = new FlattenedDataset({
        dimensions: [{
            name: 'Date',
            value: "{Date}",
            dataType: 'date'
        }, {
            name: 'Country',
            value: "{Country}"
        }],
        measures: [{
            name: 'Value',
            value: '{Value}'
        }],
        data: {
            path: "/businessData1"
        }
    });
    var oVizFrame = CommonUtil.createVizFrame({
        viztype:"timeseries_scatter"
    });

    oVizFrame.setDataset(oDataset);
    oVizFrame.setModel(oModel);

    var feedValueAxis = new FeedItem({
            'uid': "valueAxis",
            'type': "Measure",
            'values': ["Value"]
        }),
        feedCategoryAxis = new FeedItem({
            'uid': "timeAxis",
            'type': "Dimension",
            'values': ["Date"]
        }),
        feedColor = new FeedItem({
            'uid': "color",
            'type': "Dimension",
            'values': ["Country"]
        });

    oVizFrame.addFeed(feedValueAxis);
    oVizFrame.addFeed(feedCategoryAxis);
    oVizFrame.addFeed(feedColor);
    oVizFrame.placeAt('content');
    oVizFrame.attachEventOnce('renderComplete', function(){
        var plot = document.querySelector("#content .v-plot-main");
        assert.ok(plot != null, "Time Series Scatter Plot exists.");
        CommonUtil.destroyVizFrame(oVizFrame);
        done();
    });
});

QUnit.test("Time Series Bubble Chart", function(assert) {
    assert.expect(1);
    var done = assert.async();
    var oDataset = new FlattenedDataset({
        dimensions: [{
            name: 'Date',
            value: "{Date}",
            dataType:'date'
        }, {
            name: 'Country',
            value: "{Country}"
        }],
        measures: [{
            name: 'Value',
            value: '{Value}'
        },{
            name: 'Value2',
            value: '{Value2}'
        }],
        data: {
            path: "/businessData1"
        }
    });
    var oVizFrame = CommonUtil.createVizFrame({
        viztype:"timeseries_bubble"
    });

    oVizFrame.setDataset(oDataset);
    oVizFrame.setModel(oModel);

    var feedValueAxis = new FeedItem({
            'uid': "valueAxis",
            'type': "Measure",
            'values': ["Value"]
        }),
        feedBubbleWidth = new FeedItem({
            'uid': "bubbleWidth",
            'type': "Measure",
            'values': ["Value2"]
        }),
        feedCategoryAxis = new FeedItem({
            'uid': "timeAxis",
            'type': "Dimension",
            'values': ["Date"]
        }),
        feedColor = new FeedItem({
            'uid': "color",
            'type': "Dimension",
            'values': ["Country"]
        });

    oVizFrame.addFeed(feedValueAxis);
    oVizFrame.addFeed(feedBubbleWidth);
    oVizFrame.addFeed(feedCategoryAxis);
    oVizFrame.addFeed(feedColor);
    oVizFrame.placeAt('content');
    oVizFrame.attachEventOnce('renderComplete', function(){
        var plot = document.querySelector("#content .v-plot-main");
        assert.ok(plot != null, "Time Series Bubble Plot exists.");
        CommonUtil.destroyVizFrame(oVizFrame);
        done();
    });
});
var oModel2 = new JSONModel({
    businessData1 : [{
        "Date": 1388505600000,
        "Country": "China",
        "Value": 131.7715651821345,
        "Value2": 12
    }, {
        "Date": 1398507600000,
        "Country": "Japan",
        "Value": 732.2505286429077,
        "Value2": 123
    }, {
        "Date": 1408505600000,
        "Country": "France",
        "Value": 301.2606957927346,
        "Value2": 12
    }, {
        "Date": 1418505800000,
        "Country": "UK",
        "Value": 815.9925150685012,
        "Value2": 456
    }, {
        "Date": 1421097600000,
        "Country": "China",
        "Value": 184.3122337013483,
        "Value2": 12
    }, {
        "Date": 1431097800000,
        "Country": "Japan",
        "Value": 350.25157197378576,
        "Value2": 123
    }, {
        "Date": 1441097900000,
        "Country": "France",
        "Value": 62.60869628749788,
        "Value2": 123
    }, {
        "Date": 1451097000000,
        "Country": "UK",
        "Value": 897.1779812127352,
        "Value2": 123
    }]
});
QUnit.test("Time Series Combination Chart", function(assert) {
    assert.expect(1);
    var done = assert.async();
    var oDataset = new FlattenedDataset({
        dimensions: [{
            name: 'Date',
            value: "{Date}",
            dataType: 'date'
        }],
        measures: [{
            name: 'Value',
            value: '{Value}'
        },
        {
            name: 'Value2',
            value: '{Value2}'
        }],
        data: {
            path: "/businessData1"
        }
    });
    var oVizFrame = CommonUtil.createVizFrame({
        viztype:"timeseries_combination"
    });

    oVizFrame.setDataset(oDataset);
    oVizFrame.setModel(oModel2);

    var feedValueAxis = new FeedItem({
            'uid': "valueAxis",
            'type': "Measure",
            'values': ["Value", "Value2"]
        }),

        feedCategoryAxis = new FeedItem({
            'uid': "timeAxis",
            'type': "Dimension",
            'values': ["Date"]
        }),
        feedColor = new FeedItem({
            'uid': "color",
            'type': "Dimension",
            'values': [{"measureNamesDimension": ["valueAxis"]}]
        });

    oVizFrame.addFeed(feedValueAxis);
    oVizFrame.addFeed(feedCategoryAxis);
    oVizFrame.addFeed(feedColor);
    oVizFrame.placeAt('content');
    oVizFrame.attachEventOnce('renderComplete', function(){
        var plot = document.querySelector("#content .v-plot-main");
        assert.ok(plot != null, "Time Series Combination Plot exists.");
        CommonUtil.destroyVizFrame(oVizFrame);
        done();
    });
});

QUnit.test("Dual Time Series Combination Chart", function(assert) {
    assert.expect(1);
    var done = assert.async();
    var oDataset = new FlattenedDataset({
        dimensions: [{
            name: 'Date',
            value: "{Date}",
            dataType: 'date'
        }],
        measures: [{
            name: 'Value',
            value: '{Value}'
        },
        {
            name: 'Value2',
            value: '{Value2}'
        }],
        data: {
            path: "/businessData1"
        }
    });
    var oVizFrame = CommonUtil.createVizFrame({
        viztype:"dual_timeseries_combination"
    });

    oVizFrame.setDataset(oDataset);
    oVizFrame.setModel(oModel2);

    var feedValueAxis = new FeedItem({
            'uid': "valueAxis",
            'type': "Measure",
            'values': ["Value"]
        }),
        feedValueAxis2 = new FeedItem({
            'uid': "valueAxis2",
            'type': "Measure",
            'values': ["Value2"]
        }),
        feedCategoryAxis = new FeedItem({
            'uid': "timeAxis",
            'type': "Dimension",
            'values': ["Date"]
        }),
        feedColor = new FeedItem({
            'uid': "color",
            'type': "Dimension",
            'values': [{"measureNamesDimension": ["valueAxis"]}]
        });

    oVizFrame.addFeed(feedValueAxis);
    oVizFrame.addFeed(feedCategoryAxis);
    oVizFrame.addFeed(feedColor);
    oVizFrame.addFeed(feedValueAxis2);
    oVizFrame.placeAt('content');
    oVizFrame.attachEventOnce('renderComplete', function(){
        var plot = document.querySelector("#content .v-plot-main");
        assert.ok(plot != null, "Dual Time Series Combination Plot exists.");
        CommonUtil.destroyVizFrame(oVizFrame);
        done();
    });
});

var oModel_ZeroData = new JSONModel({
    "chartData": [
            {"timestamp": "2015-11-01T11:00:36+0100", "localUsageValue": 0, "messageSize": 3},
            {"timestamp": "2015-11-02T21:40:16+0100", "globalUsageValue": 530.7857, "localUsageValue": 92.1469, "messageSize": 96.5160},
            {"timestamp": "2015-11-04T08:19:56+0100", "globalUsageValue": 262.7565, "localUsageValue": 89.9417, "messageSize": 45.8652},
            {"timestamp": "2015-11-05T18:59:36+0100", "globalUsageValue": 785.6333, "localUsageValue": 95.0000, "messageSize": 133.5788},
            {"timestamp": "2015-11-07T05:39:16+0100", "globalUsageValue": 517.6039, "localUsageValue": 92.8391, "messageSize": 89.1444},
            {"timestamp": "2015-11-08T16:18:56+0100", "globalUsageValue": 249.5747, "localUsageValue": 90.5696, "messageSize": 40.6065}
        ]
});

QUnit.test("Time Series Stacked Combination Chart", function(assert) {
    assert.expect(1);
    var done = assert.async();
    var oDataset = new FlattenedDataset({
        dimensions: [{
            name: 'date',
            value: "{timestamp}",
            dataType: 'date'
        }],
        measures: [
            {
                name: 'global data store usage',
                value: '{globalUsageValue}'
            },
            {
                name: 'local data store usage',
                value: '{localUsageValue}'
            },
            {
                name: 'message size',
                value: '{messageSize}'
            }],
        data: {
            path: "/chartData"
        }
    });
    var oVizFrame = CommonUtil.createVizFrame({
        viztype:"timeseries_stacked_combination"
    });

    oVizFrame.setDataset(oDataset);
    oVizFrame.setModel(oModel_ZeroData);

    var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
        'uid': "valueAxis",
        'type': "Measure",
        'values': ["global data store usage", "local data store usage", "message size"]
    }),
        feedTimeAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
            'uid': "timeAxis",
            'type': "Dimension",
            'values': ["date"]
        });
    oVizFrame.addFeed(feedValueAxis);
    oVizFrame.addFeed(feedTimeAxis);
    oVizFrame.setVizProperties({
        plotArea: {
            dataShape: {
                primaryAxis: ["bar", "bar", "line"]
            }
        },
        interaction: {
            selectability: {
                mode: "single"
            },
            syncValueAxis: true
        }
    });
    oVizFrame.placeAt('content');
    oVizFrame.attachEventOnce('renderComplete', function(){
        var plot = document.querySelector("#content .v-plot-main");
        assert.ok(plot != null, "Time Series Combination Plot exists.");
        CommonUtil.destroyVizFrame(oVizFrame);
        done();
    });
});

QUnit.test("Show error message of invalid data format", function(assert) {
    assert.expect(1);
    var done = assert.async();
    var oDataset = new FlattenedDataset({
        dimensions: [{
            name: 'Time',
            value: "{Time}",
            dataType: 'date'
        }, {
            name: 'Country',
            value: "{Country}"
        }],
        measures: [{
            name: 'Value',
            value: '{Value}'
        }],
        data: {
            path: "/businessData1"
        }
    });
    var feedValueAxis = new FeedItem({
        'uid': "valueAxis",
        'type': "Measure",
        'values': ["Value"]
    }),
    feedCategoryAxis = new FeedItem({
        'uid': "timeAxis",
        'type': "Dimension",
        'values': ["Time"]
    }),
    feedColor = new FeedItem({
        'uid': "color",
        'type': "Dimension",
        'values': ["Country"]
    });
    var oVizFrame = CommonUtil.createVizFrame({
        viztype:"timeseries_line"
    });
    oVizFrame.setDataset(oDataset);
    oVizFrame.setModel(oModel);
    oVizFrame.addFeed(feedValueAxis);
    oVizFrame.addFeed(feedCategoryAxis);
    oVizFrame.addFeed(feedColor);
    oVizFrame.placeAt('content');
    oVizFrame.attachEvent("renderFail", function() {
        assert.equal(this.$().find(".ui5-viz-controls-viz-description-message").text(), "[50061] - Some dates do not have the correct format",
            "Invalid data message is correct shown");
        setTimeout(function(){
            CommonUtil.destroyVizFrame(oVizFrame);
        }, 0);
        done();
    });
});

var oModel3 = new JSONModel({
    businessData1 : [{
        "Date": "2022 5 1 00:00:00",
        "Country": "China",
        "Value": 131.7715651821345
    }, {
        "Date": "2022 5 1 00:00:00",
        "Country": "Japan",
        "Value": 732.2505286429077
    }, {
        "Date": "2022 06 01 00:00:00",
        "Country": "China",
        "Value": 184.3122337013483
    }, {
        "Date": "2022 06 01 00:00:00",
        "Country": "Japan",
        "Value": 350.25157197378576
    }]
});

QUnit.test("Timezone settings test", function(assert) {
    var done = assert.async();
    var sRawTimeZone = Localization.getTimezone();
    Localization.setTimezone('Etc/GMT+12');
    var chartFormatter = sap.viz.ui5.format.ChartFormatter.getInstance();
    sap.viz.api.env.Format.numericFormatter(chartFormatter)
    var oDataset = new FlattenedDataset({
        dimensions: [{
            name: 'Date',
            value: "{Date}",
            dataType: 'date'
        }, {
            name: 'Country',
            value: "{Country}"
        }],
        measures: [{
            name: 'Value',
            value: '{Value}'
        }],
        data: {
            path: "/businessData1"
        }
    });
    var oVizFrame = CommonUtil.createVizFrame({
        viztype:"timeseries_line"
    });

    oVizFrame.setDataset(oDataset);
    oVizFrame.setModel(oModel3);

    var feedValueAxis = new FeedItem({
            'uid': "valueAxis",
            'type': "Measure",
            'values': ["Value"]
        }),
        feedCategoryAxis = new FeedItem({
            'uid': "timeAxis",
            'type': "Dimension",
            'values': ["Date"]
        }),
        feedColor = new FeedItem({
            'uid': "color",
            'type': "Dimension",
            'values': ["Country"]
        });

    oVizFrame.addFeed(feedValueAxis);
    oVizFrame.addFeed(feedCategoryAxis);
    oVizFrame.addFeed(feedColor);
    oVizFrame.setVizProperties({timeAxis: {levels: ['year', 'month', 'day', "hour", "minute"]}});
    oVizFrame.placeAt('content');
    oVizFrame.attachEventOnce('renderComplete', function checkDataPoint(){
        var plot = document.querySelector("#content .v-plot-main");
        assert.ok(plot != null, "Time Series Line Plot exists.");
        assert.equal(document.querySelector("#content .v-label.v-morphable-label.viz-axis-label .v-label-baseLevel").textContent, "00:00");
        assert.equal(document.querySelector("#content .v-label.v-morphable-label.viz-axis-label .v-label-upperLevel").textContent, "May 01, 2022");
        oVizFrame.detachRenderComplete(checkDataPoint);
        oVizFrame.setVizProperties({general: {showAsUTC: true}});
        oVizFrame.attachEventOnce('renderComplete', null, reSetUTC);
    });
    function reSetUTC() {
        assert.equal(document.querySelector("#content .v-label.v-morphable-label.viz-axis-label .v-label-baseLevel").textContent, "12:00");
        assert.equal(document.querySelector("#content .v-label.v-morphable-label.viz-axis-label .v-label-upperLevel").textContent, "May 01, 2022");
        oVizFrame.detachRenderComplete(reSetUTC);
        oVizFrame.setVizProperties({general: {showAsUTC: false}});
        oVizFrame.attachEventOnce('renderComplete', null, setUTCAsFalse);
    }
    function setUTCAsFalse() {
        assert.equal(document.querySelector("#content .v-label.v-morphable-label.viz-axis-label .v-label-baseLevel").textContent, "00:00");
        assert.equal(document.querySelector("#content .v-label.v-morphable-label.viz-axis-label .v-label-upperLevel").textContent, "May 01, 2022");
        oVizFrame.detachRenderComplete(setUTCAsFalse);
        Localization.setTimezone(sRawTimeZone);
        CommonUtil.destroyVizFrame(oVizFrame);
        done();
    }
});

var oModel4 = new JSONModel({
    businessData1 : [{
        "Date": "2021-10-30T23:00:00Z",
        "Country": "China",
        "Value": 131.7715651821345
    }, {
        "Date": "2021-10-31T00:00:00Z",
        "Country": "Japan",
        "Value": 732.2505286429077
    }, {
        "Date": "2021-10-31T01:00:00Z",
        "Country": "China",
        "Value": 184.3122337013483
    }, {
        "Date": "2021-10-31T02:00:00Z",
        "Country": "Japan",
        "Value": 350.25157197378576
    }]
});
QUnit.test("DST Hours test in Column Chart", function(assert) {
    var done = assert.async();
    var sRawTimeZone = Localization.getTimezone();
    Localization.setTimezone('Europe/Berlin');
    var chartFormatter = sap.viz.ui5.format.ChartFormatter.getInstance();
    sap.viz.api.env.Format.numericFormatter(chartFormatter)
    var oDataset = new FlattenedDataset({
        dimensions: [{
            name: 'Date',
            value: "{Date}",
            dataType: 'date'
        }, {
            name: 'Country',
            value: "{Country}"
        }],
        measures: [{
            name: 'Value',
            value: '{Value}'
        }],
        data: {
            path: "/businessData1"
        }
    });
    var oVizFrame = CommonUtil.createVizFrame({
        viztype:"timeseries_column"
    });

    oVizFrame.setDataset(oDataset);
    oVizFrame.setModel(oModel4);

    var feedValueAxis = new FeedItem({
            'uid': "valueAxis",
            'type': "Measure",
            'values': ["Value"]
        }),
        feedCategoryAxis = new FeedItem({
            'uid': "timeAxis",
            'type': "Dimension",
            'values': ["Date"]
        }),
        feedColor = new FeedItem({
            'uid': "color",
            'type': "Dimension",
            'values': ["Country"]
        });

    oVizFrame.addFeed(feedValueAxis);
    oVizFrame.addFeed(feedCategoryAxis);
    oVizFrame.addFeed(feedColor);
    oVizFrame.setVizProperties({timeAxis: {levels: ['year', 'month', 'day', "hour"]}});
    oVizFrame.placeAt('content');
    oVizFrame.attachEventOnce('renderComplete', function checkDataPoint(){
        var plot = document.querySelector("#content .v-plot-main");
        assert.ok(plot != null, "Time Series Line Plot exists.");
        oVizFrame.detachRenderComplete(checkDataPoint);
        Localization.setTimezone(sRawTimeZone);
        CommonUtil.destroyVizFrame(oVizFrame);
        done();
    });
});

var oModel5 = new JSONModel({
    businessData1 : [{
            "Date": "2021-03-31T22:00:00Z",
            "count": "103",
            "endusertime": "2840"
        }, {
            "Date": "2021-03-31T23:00:00Z",
            "count": "15",
            "endusertime": "26664"
        }, {
            "Date": "2021-04-01T00:00:00Z",
            "count": "15",
            "endusertime": "26664"
            },
        {
            "Date": "2021-04-01T01:00:00Z",
            "count": "14",
            "endusertime": "4875"
        }, {
            "Date": "2021-04-01T02:00:00Z",
            "count": "5",
            "endusertime": "1816"
        }, {
            "Date": "2021-04-01T03:00:00Z",
            "count": "12",
            "endusertime": "5982"
        }]
});
QUnit.test("DST Hours test in Column Chart 2", function(assert) {
    var done = assert.async();
    var sRawTimeZone = Localization.getTimezone();
    Localization.setTimezone('Etc/GMT-8');
    var chartFormatter = sap.viz.ui5.format.ChartFormatter.getInstance();
    sap.viz.api.env.Format.numericFormatter(chartFormatter)
    var oDataset = new FlattenedDataset({
        dimensions: [{
            name: 'Date',
            value: "{Date}",
            dataType: 'date'
        }],
        measures: [{
            name: 'count',
            value: '{count}'
        }, {
            name: 'endusertime',
            value: '{endusertime}'
        }],
        data: {
            path: "/businessData1"
        }
    });
    var oVizFrame = CommonUtil.createVizFrame({
        viztype:"dual_timeseries_combination"
    });

    oVizFrame.setDataset(oDataset);
    oVizFrame.setModel(oModel5);

    var feedValueAxis = new FeedItem({
            'uid': "valueAxis",
            'type': "Measure",
            'values': ["count"]
        }),
        feedCategoryAxis = new FeedItem({
            'uid': "timeAxis",
            'type': "Dimension",
            'values': ["Date"]
        }),
        feedValueAxis2 = new FeedItem({
            'uid': "valueAxis2",
            'type': "Measure",
            'values': ["endusertime"]
        });

    oVizFrame.addFeed(feedValueAxis);
    oVizFrame.addFeed(feedCategoryAxis);
    oVizFrame.addFeed(feedValueAxis2);
    oVizFrame.setVizProperties({timeAxis: {levels: ['year', 'month', 'day', "hour"]}});
    oVizFrame.placeAt('content');
    oVizFrame.attachEventOnce('renderComplete', function checkDataPoint(){
        var plot = document.querySelector("#content .v-plot-main");
        assert.ok(plot != null, "Time Series Line Plot exists.");
        var items = document.querySelectorAll("#content .v-label.v-morphable-label.viz-axis-label .v-label-baseLevel");
        var i;
        var allLabels = [];
        for(i = 0; i < items.length; i++) {
            var str = items[i].textContent;
            if(str && str.length > 0) {
                allLabels.push(str);
            }
        }
        assert.equal(JSON.stringify(allLabels), '["06:00","07:00","08:00","09:00","10:00","11:00"]', "Time Series axis is right.");
        oVizFrame.detachRenderComplete(checkDataPoint);
        Localization.setTimezone(sRawTimeZone);         
        CommonUtil.destroyVizFrame(oVizFrame);
        done();
    });
});

var oModel6 = new JSONModel({
    businessData1 : [{
        "Date": "Thu Feb 06 2025 08:00:00 GMT+0530 (India Standard Time)",
        "Country": "China",
        "Value": 131.7715651821345
    }, {
        "Date": "Thu Feb 06 2025 09:00:00 GMT+0530 (India Standard Time)",
        "Country": "Japan",
        "Value": 732.2505286429077
    }]
});
QUnit.test("half Hours test in timeseries_combination Chart", function(assert) {
    var done = assert.async();
    var sRawTimeZone = Localization.getTimezone();
    Localization.setTimezone('Asia/Colombo');
    var chartFormatter = sap.viz.ui5.format.ChartFormatter.getInstance();
    sap.viz.api.env.Format.numericFormatter(chartFormatter)
    var oDataset = new FlattenedDataset({
        dimensions: [{
            name: 'Date',
            value: "{Date}",
            dataType: 'date'
        }, {
            name: 'Country',
            value: "{Country}"
        }],
        measures: [{
            name: 'Value',
            value: '{Value}'
        }],
        data: {
            path: "/businessData1"
        }
    });
    var oVizFrame = CommonUtil.createVizFrame({
        viztype:"timeseries_column"
    });

    oVizFrame.setDataset(oDataset);
    oVizFrame.setModel(oModel6);

    var feedValueAxis = new FeedItem({
            'uid': "valueAxis",
            'type': "Measure",
            'values': ["Value"]
        }),
        feedCategoryAxis = new FeedItem({
            'uid': "timeAxis",
            'type': "Dimension",
            'values': ["Date"]
        }),
        feedColor = new FeedItem({
            'uid': "color",
            'type': "Dimension",
            'values': ["Country"]
        });

    oVizFrame.addFeed(feedValueAxis);
    oVizFrame.addFeed(feedCategoryAxis);
    oVizFrame.addFeed(feedColor);
    oVizFrame.setVizProperties({timeAxis: {levels: ['year', 'month', 'day', "hour"]}});
    oVizFrame.placeAt('content');
    oVizFrame.attachEventOnce('renderComplete', function checkDataPoint(){
        var Label = document.querySelectorAll("#content .v-label-baseLevel");
        assert.ok(Label.length === 2, "Time axis label shows correctly.");
        oVizFrame.detachRenderComplete(checkDataPoint);
        Localization.setTimezone(sRawTimeZone);
        CommonUtil.destroyVizFrame(oVizFrame);
        done();
    });
});

});