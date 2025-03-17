/*global QUnit */
/* 
 * Note: although this test focuses on the legacy wrapper chart 'Bar', it still uses a VizFrame, too.
 * The wrapper charts provided no easy means to listen to the initialized event, making it difficult to
 * find the right point in time when texts have been loaded and can be checked in DOM.
 * Still using VizFrame just to get the point in time seemed the most robust approach.
 */ 
sap.ui.define([
  "sap/base/i18n/Localization",
  "sap/viz/ui5/Bar",
  "sap/viz/ui5/controls/VizFrame",
  "sap/viz/ui5/controls/common/feeds/FeedItem",
  "sap/viz/ui5/data/FlattenedDataset",
  "sap/ui/Device",
  "sap/ui/model/json/JSONModel",
  "sap/ui/qunit/utils/createAndAppendDiv",
  "sap/ui/thirdparty/jquery",
  "sap/viz/ui5/data/DimensionDefinition", // implicitly used when creating a FlattendDataset with shorthand notation
  "sap/viz/ui5/data/MeasureDefinition", // implicitly used when creating a FlattendDataset with shorthand notation
  "sap/viz/ui5/types/Axis", // implicitly used when creating a Bar chart with shorthand notation
  "sap/viz/ui5/types/Axis_label", // implicitly used when creating a Bar chart with shorthand notation
  "sap/viz/ui5/types/Bar", // implicitly used when creating a Bar chart with shorthand notation
  "sap/viz/ui5/types/Bar_animation", // implicitly used when creating a Bar chart with shorthand notation
  "sap/viz/ui5/types/legend/Common", // implicitly used when creating a Bar chart with shorthand notation
  "sap/viz/ui5/types/legend/Common_title", // implicitly used when creating a Bar chart with shorthand notation
  "sap/viz/ui5/types/Title", // implicitly used when creating a Bar chart with shorthand notation
  "../js/data"
], function(Localization, Bar, VizFrame, FeedItem, FlattenedDataset, Device, JSONModel, createAndAppendDiv, $) {

createAndAppendDiv("content").style = "width: 100%; height: 600px; display: inline;";

var oChart, oVizFrame;
QUnit.module("Check Chart Language.");
QUnit.test("a1a2m1m1 VizFrame Bar", function(assert){
      var done = assert.async();
      assert.ok(true, "a1a2m1m1 VizFrame Bar chart.");
      var oDataset = new FlattenedDataset(a1a2m1m1Data);
      var oModel = new JSONModel(a1a2m1m1Model);
      oDataset.setModel(oModel);
      oChart = new Bar('vizChart', {
        width : "800px",
        height : "600px",
        plotArea : {
          animation : {
            dataLoading : false,
            dataUpdating : false,
            resizing : false
          }
        },
        title : {
          visible : true
        },
        legend : {
          title : {
            visible : true
          }
        },
        dataset: oDataset
      });
      oChart.placeAt("content");
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
            assert.equal($('#vizChart .v-m-title text').text(), "Title of Chart", 'Title Default language is en in first loading.');
          //Legend title turn off in fiori template
          //equal($('#vizChart .v-m-legend .v-title').text(), "All Measures - YEAR", 'All Measures Default language is en.');
            assert.equal($('#vizframeChart .v-m-title text').text(), "Title of Chart", 'Title Default language is en in first loading.');
            assert.equal($('#vizframeChart .v-m-legend .v-title').text(), "YEAR / All Measures", 'All measures Default language is en in first loading.');
            oVizFrame.detachEvent("renderComplete", checkDefaultLanguageText);
            oVizFrame.attachEventOnce("renderComplete", null, checkLanguage_De);
            Localization.setLanguage("de_DE");
      }

      function checkLanguage_De() {
          //Disable the case as it is unstable in the server build. The case shouldn't be in maintenance.
          //assert.equal($('#vizChart .v-m-title text').text(), "Diagrammtitel", 'Title Default language is de in first setLocal.');
          //assert.equal($('#vizChart .v-m-legend .v-title').text(), "Alle Kennzahlen - YEAR", 'All Measures Default language is de in first setLocal.');
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
          //Disable the case as it is unstable in the server build.

          //assert.equal($('#vizChart .v-m-title text').text(), "Title of Chart", 'Title Default language is en.');
          // in case of too small screen size the text gets truncated and a
          // title sub tag with the full text has been created
          // if ($('#vizChart .v-m-legend .v-title title').length > 0) {
          //     assert.equal($('#vizChart .v-m-legend .v-title title').text(), "All Measures - YEAR", 'All Measures Default language is en when setLocal as en.');
          // } else {
          //     assert.equal($('#vizChart .v-m-legend .v-title').text(), "All Measures - YEAR", 'All Measures Default language is en when setLocal as en.');
          // }
          
          //assert.equal($('#vizframeChart .v-m-title text').text(), "Title of Chart", 'Title Default language is en when setLocal as en.');
          assert.equal($('#vizframeChart .v-m-legend .v-title').text(), "YEAR / All Measures", 'All measures Default language is en when setLocal as en.');
          oVizFrame.detachEvent('renderComplete', checkLanguage_En);
          oVizFrame.attachEventOnce("renderComplete", null, checkLanguage_De2);
          Localization.setLanguage("de_DE");
      }

      function checkLanguage_De2() {
          assert.equal($('#vizChart .v-m-title text').text(), "Diagrammtitel", 'Title Default language is de when setLocal as de.');
          assert.equal($('#vizChart .v-m-legend .v-title').text(), "Alle Kennzahlen - YEAR", 'All Measures Default language is de when setLocal as de.');
          
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
    oChart.getXAxis().getLabel().setFormatString('u1');
    oVizFrame.setVizProperties({"xAxis":{"label":{"formatString":"u1"}}});
    assert.ok(true, "Apply Customer Format.");
    oVizFrame.attachEventOnce('renderComplete', function() {
        assert.equal($('#vizChart .v-m-xAxis .v-label text')[0].textContent, "0-u1", 'viz format should work.');     
        assert.equal($('#vizframeChart .v-m-valueAxis .v-label text')[0].textContent, "0-u1", 'vizframe format should work.');
        cleanChart();
        done();
    });
});

var cleanChart = function() {
    if (oChart) {
      oChart.destroy();
    }
};

});
