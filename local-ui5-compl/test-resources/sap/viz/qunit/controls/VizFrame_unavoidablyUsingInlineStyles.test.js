/*global QUnit */
sap.ui.define([
	"sap/viz/ui5/controls/VizFrame",
	"sap/viz/ui5/controls/common/feeds/FeedItem",
	"sap/viz/ui5/data/FlattenedDataset", 
	"sap/ui/model/json/JSONModel",
	"./CommonUtil",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/thirdparty/jquery",
	"sap/viz/ui5/data/DimensionDefinition", // implicitly used when creating a FlattendDataset with shorthand notation
	"sap/viz/ui5/data/MeasureDefinition", // implicitly used when creating a FlattendDataset with shorthand notation
	"./Feeds.test",
	"./VizContainer.data"
], function(VizFrame, FeedItem, FlattenedDataset, JSONModel, CommonUtil, createAndAppendDiv, $) {

createAndAppendDiv('content').style = "width: 800px; height: 800px;";

QUnit.module("VizFrame");

//as the bullet chart is the most complex, the follwings use bullet chart to test the function
QUnit.test("exportToSVGString", function(assert) {
    var done = assert.async();
    var option = {
        viztype: 'bullet'
    };
    var vizFrame = CommonUtil.createVizFrame(option);
    vizFrame.setVizProperties({
        plotArea: {
          colorPalette: ['sapUiChartPaletteSemanticNeutralDark1'],
          gap: {
            visible: true,
            type: "negative",
            negativeColor: 'sapUiChartPaletteSemanticBad'
          }
        }
    });
    var oModel = new JSONModel({
        milk : bulletModelInfo.milk
    });
    var oDataset = new FlattenedDataset({
        // a Bar Chart requires exactly one dimension (x-axis)
        'dimensions' : [{
            'name' : 'Store Name',
            'value' : "{Store Name}"
        }],
        // it can show multiple measures, each results in a new set of bars in a new color
        'measures' : [
        {
           'name' : 'Revenue', // 'name' is used as label in the Legend
           'value' : '{Revenue}' // 'value' defines the binding for the displayed value
        },{
           'name' : 'Additional Revenue',
           'value' : '{Additional Revenue}'
        }, {
           'name' : 'Forecast',
           'value' : '{Forecast}'
        }, {
           'name': "Target",
           'value': "{Target}"
        }, {
           'name': 'Revenue2',
           'value': '{Revenue2}'
        }, {
           'name': 'Additional Revenue2',
           'value': '{Additional Revenue2}'
        }, {
           'name': "Forecast2",
           'value': "{Forecast2}"
        }, {
           'name': "Target2",
           'value': "{Target2}"
        }],
        // 'data' is used to bind the whole data collection that is to be displayed in the chart
        'data' : {
           'path' : "/milk"
        }
      });
      vizFrame.setDataset(oDataset)
      vizFrame.setModel(oModel);

      // set feeds
      var feedPrimaryValues = new FeedItem({
        'uid' : "actualValues",
        'type' : "Measure",
        'values' : ["Revenue"]
      }), feedAxisLabels = new FeedItem({
        'uid' : "categoryAxis",
        'type' : "Dimension",
        'values' : ["Store Name"]
      }),feedTargetValues = new FeedItem({
        'uid' : "targetValues",
        'type' :"Measure",
        'values' : ["Target"]
      });

      vizFrame.addFeed(feedPrimaryValues);
      vizFrame.addFeed(feedAxisLabels);
      vizFrame.addFeed(feedTargetValues);

      vizFrame.placeAt('content');
      var emptySVG = vizFrame.exportToSVGString();
      assert.equal(emptySVG,"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100%\" height=\"100%\"/>");
      vizFrame.attachEvent("renderComplete", function() {
        //an empty <defs>, v-m-action-layer-group, v-m-decoration-layer-group, v-m-backgroup
        //v-m-title, v-m-legendgroup, v-m-mian, defs-diagonalhatch.
        var svgResult = $($.parseHTML(vizFrame.exportToSVGString()));
        var svgResultLength = svgResult.children().length;
        var mainChild = svgResult.find(".v-m-main").children().length;
        assert.equal(svgResultLength,9);

        //hideTitleLegend = true,v-m-tile and v-m-legendgroup will be removed
        svgResultLength = $($.parseHTML(vizFrame.exportToSVGString({hideTitleLegend:true}))).children().length;
        assert.equal(svgResultLength,7);

        //hideAxis = true, v-m-main.v-m-yAxis, v-m-main.v-m-yAxis2, v-m-main.v-m-xAxis, v-m-main.v-m-xAxis2, v-m-main.v-m-zAxis
        //but in this case only move v-m-yAxis and v-m-xAxis2
        var svgResult = $($.parseHTML(vizFrame.exportToSVGString({width:400,height:400,hideTitleLegend:true,hideAxis:true})));
        var width = svgResult.attr("width");
        var height  = svgResult.attr("height");
        svgResultLength = svgResult.children().length;
        mainChild -= svgResult.find(".v-m-main").children().length;
        assert.equal(width,400);
        assert.equal(height,400);
        assert.equal(svgResultLength,7);
        assert.equal(mainChild,2);
        CommonUtil.destroyVizFrame(vizFrame);
        done();
      });
});

});

