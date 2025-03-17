sap.ui.define([
    "sap/viz/ui5/controls/common/feeds/FeedItem",
    "sap/viz/ui5/data/FlattenedDataset",
    "sap/ui/model/json/JSONModel",
    "../controls/CommonUtil",
    "sap/viz/ui5/format/ChartFormatter",
    "sap/viz/ui5/api/env/Format",
    "sap/viz/ui5/controls/Popover",
    "sap/viz/ui5/controls/VizFrame",
    "sap/viz/ui5/controls/VizTooltip",
    "sap/viz/ui5/data/DimensionDefinition", // implicitly used when creating a FlattendDataset with shorthand notation
    "sap/viz/ui5/data/MeasureDefinition", // implicitly used when creating a FlattendDataset with shorthand notation
], function (FeedItem, FlattenedDataset, JSONModel, CommonUtil, ChartFormatter, Format) {

    function _setFormat() {
        var chartFormatter = ChartFormatter.getInstance();
        Format.numericFormatter(chartFormatter);
    }

    function _getDateset(dataset) {
        var dataset1 = new FlattenedDataset({
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
        var Dataset = {
            line: dataset1,
            column: dataset1,
        };

        return Dataset[dataset];
    }

    function _getModel(model) {
        var model1 = new JSONModel({
            businessData1: [
                {
                    "Date": '2020-12-26 00:00',
                    "Country": "China",
                    "Value": 131.7715651821345,
                    "Value2": 12,
                    "Time": "abc"
                },
                {
                    "Date": '2021-01-03 00:00',
                    "Country": "China",
                    "Value": 89.7715651821345,
                    "Value2": 12,
                    "Time": "abc"
                },
                {
                    "Date": '2021-01-09 00:00',
                    "Country": "China",
                    "Value": 10.7715651821345,
                    "Value2": 12,
                    "Time": "abc"
                }
            ]
        });
        var model2 = new JSONModel({
            businessData1: [
                {
                    "Date": '2020-12-30 00:00',
                    "Country": "China",
                    "Value": 131.7715651821345,
                    "Value2": 12,
                    "Time": "abc"
                },
                {
                    "Date": '2021-01-04 00:00',
                    "Country": "China",
                    "Value": 89.7715651821345,
                    "Value2": 12,
                    "Time": "abc"
                },
                {
                    "Date": '2021-01-11 00:00',
                    "Country": "China",
                    "Value": 10.7715651821345,
                    "Value2": 12,
                    "Time": "abc"
                }
            ]
        });
        var modelUTC = new JSONModel({
            businessData1: [
                {
                    "Date": '2021-01-04 00:00',
                    "Country": "China",
                    "Value": 131.7715651821345,
                    "Value2": 12,
                    "Time": "abc"
                },
            ]
        });
        
        var modelPattern = new JSONModel({
            businessData1: [
                {
                    "Date": '2021-01-04 20:15:50',
                    "Country": "China",
                    "Value": 131.7715651821345,
                    "Value2": 12,
                    "Time": "abc"
                },
            ]
        });

        var modelPopover = new JSONModel({
            businessData1: [
                {
                    "Date": '2021-01-04 20:15:50',
                    "Country": "China",
                    "Value": 131.7715651821345,
                    "Value2": 12,
                    "Time": "abc"
                },
            ]
        });

        var oModel = {
            line: model1,
            column: model2,
            utc: modelUTC,
            pattern: modelPattern,
            popover: modelPopover
        };
        return oModel[model];
    }

    var createTimeLineChart = function (options) {
        _setFormat();
        var oDataset, oModel;
        if(options.oModel) {
            oModel = _getModel(options.oModel);
        } else {
            oModel = _getModel('line');
        }
        oDataset = _getDateset('line');
        var oVizFrame = CommonUtil.createVizFrame({
            viztype: "timeseries_line"
        });
        oVizFrame.setDataset(oDataset);
        oVizFrame.setModel(oModel);
        var feedValueAxis = new FeedItem({
            'uid': "valueAxis",
            'type': "Measure",
            'values': ["Value"]
        });
        var feedCategoryAxis = new FeedItem({
            'uid': "timeAxis",
            'type': "Dimension",
            'values': ["Date"]
        });
        var feedColor = new FeedItem({
            'uid': "color",
            'type': "Dimension",
            'values': ["Country"]
        });
        oVizFrame.addFeed(feedValueAxis);
        oVizFrame.addFeed(feedCategoryAxis);
        oVizFrame.addFeed(feedColor);
        oVizFrame.setVizProperties({ timeAxis: { levels: ['year', 'week'] } });
        oVizFrame.placeAt('content');
        return oVizFrame;
    };

    var createTimeColumnChart = function (options) {
        _setFormat();
        var oDataset, oModel;
        if(options.oModel) {
            oModel = _getModel(options.oModel);
        } else {
            oModel = _getModel('column');
        }
        oDataset = _getDateset('column');
        var oVizFrame = CommonUtil.createVizFrame({
            viztype: "timeseries_column"
        });
        oVizFrame.setDataset(oDataset);
        oVizFrame.setModel(oModel);
        var feedValueAxis = new FeedItem({
            'uid': "valueAxis",
            'type': "Measure",
            'values': ["Value"]
        });
        var feedCategoryAxis = new FeedItem({
            'uid': "timeAxis",
            'type': "Dimension",
            'values': ["Date"]
        });
        var feedColor = new FeedItem({
            'uid': "color",
            'type': "Dimension",
            'values': ["Country"]
        });
        oVizFrame.addFeed(feedValueAxis);
        oVizFrame.addFeed(feedCategoryAxis);
        oVizFrame.addFeed(feedColor);
        oVizFrame.setVizProperties({ timeAxis: { levels: ['year', 'week'] } });
        oVizFrame.placeAt('content');
        return oVizFrame;
    };
    return {
        createTimeLineChart,
        createTimeColumnChart,
    };

});
