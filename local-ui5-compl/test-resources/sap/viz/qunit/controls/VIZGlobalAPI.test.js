/*global QUnit */
sap.ui.define([
  "sap/base/i18n/Localization",
  "sap/viz/ui5/controls/VizFrame",
  "sap/viz/ui5/controls/common/feeds/FeedItem",
  "sap/viz/ui5/data/FlattenedDataset",
  "sap/ui/Device",
  "sap/ui/model/json/JSONModel",
  "sap/ui/qunit/utils/createAndAppendDiv",
  "sap/ui/thirdparty/jquery",
  "sap/viz/ui5/data/DimensionDefinition", // implicitly used when creating a FlattendDataset with shorthand notation
  "sap/viz/ui5/data/MeasureDefinition", // implicitly used when creating a FlattendDataset with shorthand notation
  "../js/data"
], function(Localization, VizFrame, FeedItem, FlattenedDataset, Device, JSONModel, createAndAppendDiv, $) {

createAndAppendDiv("content").style = "width: 100%; height: 600px; display: inline;";

var oVizFrame;
QUnit.module("Check Chart Language.");
QUnit.skip("a1a2m1m1 VizFrame Bar", function(assert){
      var done = assert.async();
      assert.ok(true, "a1a2m1m1 VizFrame Bar chart.");
      var oDataset = new FlattenedDataset(a1a2m1m1Data);
      var oModel = new JSONModel(a1a2m1m1Model);
      oDataset.setModel(oModel);
      var oDataset = new FlattenedDataset(a1a2m1m1Data);
      var oModel = new JSONModel(a1a2m1m1Model);
      oDataset.setModel(oModel);
      oVizFrame = new VizFrame("vizframeChart", {
        'width': '800px',
        'height': '600px',
          'uiConfig' : {
            'applicationSet': 'fiori'
          },
          'vizType' : 'bar'
       });
      oVizFrame.setDataset(oDataset);
      var feedPrimaryValues = new FeedItem({
          'uid' : "primaryValues",
          'type' : "Measure",
          'values' : ["REVENUE1", "REVENUE2"]
        }), feedAxisLabels = new FeedItem({
          'uid' : "axisLabels",
          'type' : "Dimension",
          'values' : [ "COUNTRY"]
        }), feedRegionColor = new FeedItem({
          'uid' : "regionColor",
          'type' : "Dimension",
          'values' : [ "YEAR"]
        });
      oVizFrame.addFeed(feedPrimaryValues);
      oVizFrame.addFeed(feedAxisLabels);
      oVizFrame.addFeed(feedRegionColor);
      oVizFrame.placeAt('content');
      oVizFrame.setVizProperties({
          legend : {
              title : {
                visible : true
              }
            }
      });
      function checkDefaultLanguageText() {
            assert.equal($('#vizframeChart .v-m-title text').text(), "Title of Chart", 'Title Default language is en in first loading.');
            assert.equal($('#vizframeChart .v-m-legend .v-title').text(), "YEAR / All Measures", 'All measures Default language is en in first loading.');
            oVizFrame.detachEvent("renderComplete", checkDefaultLanguageText);
            oVizFrame.attachEventOnce("renderComplete", null, checkLanguage_De);
            Localization.setLanguage("de_DE");
      }

      function checkLanguage_De() {
            //TODO Chart's default title can't be customized. Vizframe needs to fix it.
            //SAP Jira BITSDC2-1603
            //equal($('#vizframeChart .v-m-title text').text(), "Diagrammtitel", 'Title Default language is de.');
          assert.equal($('#vizframeChart .v-m-legend .v-title').text(), "YEAR / Alle Kennzahlen", 'All Measures Default language is de in first setLocal.');
          oVizFrame.detachEvent('renderComplete', checkLanguage_De);
          //disable on mar chrome due to fail in mac chrome 45 and viz chart is deprecated now.
          if (!(Device.os.macintosh && Device.browser.chrome)) {
              oVizFrame.attachEventOnce("renderComplete", null, checkLanguage_En);
              Localization.setLanguage("en_US");
          } else {
              done();
          }
      }

      function checkLanguage_En() {
          assert.equal($('#vizframeChart .v-m-title text').text(), "Title of Chart", 'Title Default language is en when setLocal as en.');
          assert.equal($('#vizframeChart .v-m-legend .v-title').text(), "YEAR / All Measures", 'All measures Default language is en when setLocal as en.');
          oVizFrame.detachEvent('renderComplete', checkLanguage_En);
          oVizFrame.attachEventOnce("renderComplete", null, checkLanguage_De2);
          Localization.setLanguage("de_DE");
      }

      function checkLanguage_De2() {
          //TODO Chart's default title can't be customized. Vizframe needs to fix it.
          //SAP Jira BITSDC2-1603
          //equal($('#vizframeChart .v-m-title text').text(), "Diagrammtitel", 'Title Default language is de.');
          assert.equal($('#vizframeChart .v-m-legend .v-title').text(), "YEAR / Alle Kennzahlen", 'All Measures Default language is de when setLocal as de.');
          oVizFrame.detachEvent('renderComplete', checkLanguage_De2);
          done();
      }
      oVizFrame.attachEventOnce('renderComplete', checkDefaultLanguageText);
});

QUnit.test("Set numericformatter", function(assert){
  var oDataset = new FlattenedDataset(a1a2m1m1Data);
  var oModel = new JSONModel(a1a2m1m1Model);
  oDataset.setModel(oModel);
  var oDataset = new FlattenedDataset(a1a2m1m1Data);
  var oModel = new JSONModel(a1a2m1m1Model);
  oDataset.setModel(oModel);
    oVizFrame = new VizFrame("vizframeChart", {
      'width': '800px',
      'height': '600px',
        'uiConfig' : {
          'applicationSet': 'fiori'
        },
        'vizType' : 'bar'
    });
    oVizFrame.setDataset(oDataset);
    var feedPrimaryValues = new FeedItem({
        'uid' : "primaryValues",
        'type' : "Measure",
        'values' : ["REVENUE1", "REVENUE2"]
      }), feedAxisLabels = new FeedItem({
        'uid' : "axisLabels",
        'type' : "Dimension",
        'values' : [ "COUNTRY"]
      }), feedRegionColor = new FeedItem({
        'uid' : "regionColor",
        'type' : "Dimension",
        'values' : [ "YEAR"]
      });
    oVizFrame.addFeed(feedPrimaryValues);
    oVizFrame.addFeed(feedAxisLabels);
    oVizFrame.addFeed(feedRegionColor);
    oVizFrame.placeAt('content');
    oVizFrame.setVizProperties({
        legend : {
            title : {
              visible : true
            }
          }
    });
    var done = assert.async();
    sap.viz.api.env.Format.numericFormatter({
        format : function(value, pattern) {
            var result = value;
            switch(pattern){
                case 'u1' : 
                  result = result + "-" + pattern;
                  break;
            }
            return result;
        }
    });  
    oVizFrame.setVizProperties({"xAxis":{"label":{"formatString":"u1"}}});
    assert.ok(true, "Apply Customer Format.");
    oVizFrame.attachEventOnce('renderComplete', function() {
        assert.equal($('#vizframeChart .v-m-valueAxis .v-label text')[0].textContent, "0-u1", 'vizframe format should work.');
        cleanChart();
        done();
    });
});

var cleanChart = function() {
    if (oVizFrame) {
      oVizFrame.destroy();
    }
};

});
