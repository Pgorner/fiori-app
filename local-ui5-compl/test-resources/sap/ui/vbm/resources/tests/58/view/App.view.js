sap.ui.define(
  [
    "sap/m/FlexBox",
    "sap/m/Label",
    "sap/m/Panel",
    "sap/m/Text",
    "sap/m/Button",
    "sap/m/FlexItemData",
    "sap/ui/layout/VerticalLayout",
    "sap/ui/vbm/AnalyticMap",
    "sap/ui/vbm/Region",
    "sap/ui/vbm/Legend",
    "sap/ui/vbm/LegendItem",
    "sap/ui/core/mvc/View"
  ],
  function (FlexBox, Label, Panel, Text, Button, FlexItemData, VerticalLayout, AnalyticMap, Region, Legend, LegendItem, View) {
    "use strict";
    return View.extend("vbm-regression.tests.58.view.App", {
      getControllerName: function () {
        return "vbm-regression.tests.58.controller.App";
      },

      createContent: function (oController) {
        var fb = new FlexBox(this.createId("my-flex-box"), {
          direction: "Row",
          width: "100%",
          height: "100%",
          items: [
            new Panel({
              width: "100%",
              content: [
                new VerticalLayout({
                  width: "100%",
                  content: [
                    new Label({
                      text: "The aim: ",
                      design: "Bold",
                    }),
                    new Label({
                      text: "To test the Visual Business GeoMap Control",
                    }),
                    new Label({
                      text: "To test: ",
                      design: "Bold",
                      class: "voffset-25",
                    }),
                    new Text({
                      text: "1. Check that the grey countries are inactive. They do not react on hover, except pointer and tooltip, and can not be selected. They only raise click events.",
                    }),
                    new Text({
                      text: "2. Check that the colored countries are active. They react on hover and can be selected via click gestures.",
                    }),
                    new Text({
                      text: "3. Click on a colored country and then click on a grey country and check that the colored country is deselected.",
                    }),
                    new Text({
                      text: "4. Check that if any colored country is selected all other countries get a lighter color.",
                    }),
                    new Text({
                      text: "5. Click on a colored country and check that the selected country gets a dark grey border around it (as opposed to white border).",
                    }),
                    new Text({
                      text: "6. There are click and contextMenu events assigned to the map, regions, and legend entries. Click on the different areas and check that you receive a Message Toast.",
                    }),
                    new Text({
                      text: "7. Click Zoom Regions and check that the map zooms in on the regions.",
                    }),
                    new Button({
                      text: "Zoom Regions",
                      press: [oController.onZoomRegions, oController],
                    }),
                    new Text({
                      text: "8. Click on button Change Model and check that the color for country Italy changes from orange to red. Also, Spain and Portugal become inactive countries.",
                    }),
                    new Button({
                      text: "Change Model",
                      press: [oController.onChangeModel, oController],
                    }),
                    new Text({
                      text: "9. Click Remove all Regions and check that all regions are removed from the map.",
                    }),
                    new Button({
                      text: "Remove all Regions",
                      press: [oController.onPressRemoveRegions, oController],
                    }),
                  ],
                }),
              ],
            }),
            new AnalyticMap("jsviewtest_analyticMap", {
              width: "100%",
              height: "100%",
              layoutData: new FlexItemData({
                baseSize: "60%",
              }),
              regions: {
                path: "/data/regionProperties",
                template: new Region({
                  code: "{code}",
                  color: "{color}",
                  tooltip: "{tooltip}",
                  click: [oController.onRegionClick, oController],
                  contextMenu: [oController.onRegionContextMenu, oController],
                }),
              },

              legend: new Legend({
                caption: "Analytic Legend",
                click: [oController.onLegendClick, oController],
                items: {
                  path: "/data/regionProperties",
                  template: new LegendItem({
                    text: "{region}",
                    color: "{color}",
                    click: [oController.onLegendItemClick, oController],
                    tooltip: "{tooltip}",
                  }),
                },
              }),

              regionClick: [oController.onRegionClick, oController],
              regionContextMenu: [oController.onRegionContextMenu, oController],
              click: [oController.onMapClick, oController],
              contextMenu: [oController.onMapContextMenu, oController],
            }),
          ],
        });

        return fb;
      },
    });
  }
);
