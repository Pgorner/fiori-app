sap.ui.define([
    'sap/viz/ui5/controls/Popover',
    'sap/viz/ui5/controls/VizFrame',
    'sap/m/Button',
    'sap/m/SegmentedButton',
    'sap/m/SegmentedButtonItem',
    'sap/ui/core/HTML',
    'sap/ui/thirdparty/jquery',
    '../data/VizFrameDS'
], function (Popover, VizFrame, Button, SegmentedButton, SegmentedButtonItem, HTML, jQuery, VizFrameDS) {
    /******* Create Viz Frame and Popover ************/
    var createVizFrameWithPopover = function (popoverProps, chartType) {
        if (oVizFrame) {
            oVizFrame.destroy();
        }
        chartPopover = new Popover(popoverProps);

        // create a VizFrame
        oVizFrame = new VizFrame({
            'width': '100%',
            'height': '600px',
            'uiConfig': {
                'applicationSet': 'fiori'
            },
            'vizType': chartType ? chartType : 'bar'
        });

        switch (chartType) {
            case 'bubble':
                VizFrameDS.setBubbleDataset(oVizFrame);
                break;
            case 'stacked_column':
            case 'stacked_bar':
            case 'combination':
            case 'stacked_combination':
                VizFrameDS.setStackedDataset(oVizFrame);
                break;
            case 'donut':
                VizFrameDS.setPieDataset(oVizFrame);
                break;
            case 'bullet':
                VizFrameDS.setBulletDataset(oVizFrame);
                break;
            case 'dual_bar':
            case 'dual_column':
            case 'dual_line':
                VizFrameDS.setDualDataset(oVizFrame);
                break;
            case 'waterfall':
            case 'horizontal_waterfall':
                VizFrameDS.setWaterfallDataset(oVizFrame);
                break;
            case 'timeseries_combination':
                VizFrameDS.setTimeDataset(oVizFrame);
                break;
            case 'dual_timeseries_combination':
                VizFrameDS.setDualTimeDataset(oVizFrame);
                break;
            default:
                VizFrameDS.setDefaultDataset(oVizFrame);
        }

        oVizFrame.placeAt("content");

        chartPopover.connect(oVizFrame.getVizUid());
    };
    /******* End of Creating ***************/

    /********* Set up Popover's Options Bar ***************/
    var popoverOptionGroups = new SegmentedButton({
        items: [
            new SegmentedButtonItem({
                text: 'Default',
                press: function () {
                    createVizFrameWithPopover({});
                }
            }),
            new SegmentedButtonItem({
                text: 'With Action Items',
                press: function () {
                    createVizFrameWithPopover({
                        'actionItems': [
                            {
                                type: 'action', text: 'Action Item 1', press: function () {
                                    console.log('Action Item 1');
                                    chartPopover.close();
                                }
                            },
                            {
                                type: 'navigation', text: 'Action Item 2',
                                children: [
                                    { text: 'subActionItem 2 - 1', press: function () { console.log('Action Item 2 - 1'); } }
                                ]
                            },
                            {
                                type: 'navigation', text: 'Action Item 3',
                                children: [
                                    { text: 'subActionItem 3-1', press: function () { console.log('Action Item 3 - 1'); } },
                                    { text: 'subActionItem 3-2', press: function () { console.log('Action Item 3 - 2'); } }
                                ]
                            }
                        ]
                    })
                }
            }),
            new SegmentedButtonItem({
                text: 'Custome Content Panel',
                press: function () {
                    createVizFrameWithPopover({
                        'customDataControl': function (data) {
                            var values = data.data.val, divStr = "";
                            if (values && values.length) {
                                for (var i = 0, len = values.length; i < len; i++) {
                                    divStr = divStr + "<div>" + values[i].name + " : " + values[i].value + "</div>";
                                }
                                return new HTML({ content: divStr });
                            }
                        }
                    });
                }
            }),
            new SegmentedButtonItem({
                text: 'Both',
                press: function () {
                    createVizFrameWithPopover({
                        'customDataControl': function (data) {
                            var values = data.data.val, divStr = "";
                            if (values && values.length) {
                                for (var i = 0, len = values.length; i < len; i++) {
                                    divStr = divStr + "<div>" + values[i].name + " : " + values[i].value + "</div>";
                                }
                                return new HTML({ content: divStr });
                            }
                        },
                        'actionItems': [
                            // {type: 'action', text: 'Action Item 1', press: function(){console.log('Action Item 1');}},
                            {
                                type: 'navigation', text: 'Action Item 2',
                                children: [
                                    { text: 'subActionItem 2 - 1', press: function () { console.log('Action Item 2 - 1'); } }
                                ]
                            },
                            {
                                type: 'navigation', text: 'Action Item 3',
                                children: [
                                    { text: 'subActionItem 3-1', press: function () { console.log('Action Item 3 - 1'); } },
                                    { text: 'subActionItem 3-2', press: function () { console.log('Action Item 3 - 2'); } }
                                ]
                            }
                        ]
                    });
                }
            })
        ]
    });
    popoverOptionGroups.placeAt('actionBar');
    /****** End of Setup Popover's Bar **************/

    /****** Setup Chart Type Bar*****************/
    var createChartTypeButtons = function () {
        var charts = ['bar', 'dual_bar', 'column', 'dual_column', 'stacked_bar', 'stacked_column', 'line', 'dual_line', 'combination',
            'bubble', 'bullet', 'stacked_combination', 'donut', 'waterfall',
            'horizontal_waterfall', 'timeseries_combination', 'dual_timeseries_combination'], results = [];
        for (var i = 0, len = charts.length; i < len; i++) {
            results.push(new SegmentedButtonItem({
                text: charts[i],
                press: function () {
                    createVizFrameWithPopover({}, this.getText());
                }
            }));
        }
        return results;
    };
    var popoverOptionGroups = new SegmentedButton({
        items: createChartTypeButtons()
    });
    popoverOptionGroups.placeAt('chartTypeBar');
    //Init
    var oVizFrame = undefined;
    createVizFrameWithPopover({});

    //Create show button
    var showButton = new Button({
        text: 'showSVG',
        press: show
    })
    showButton.placeAt('toSVG')

    //exportToSVGString
    function show() {
        var svgString = oVizFrame.exportToSVGString();
        document.getElementById("chartSVGString").innerHTML = svgString;
    }
    jQuery(document).ready(function () {
        jQuery('#showHideLegend').click(function () {
            oVizFrame.setLegendVisible(!oVizFrame.getLegendVisible());
        });
    });
});
