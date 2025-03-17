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
    "sap/ui/vbm/GeoMap",
    "sap/ui/vbm/Region",
    "sap/ui/vbm/Legend",
    "sap/ui/vbm/LegendItem",
    "sap/ui/vbm/Pie",
    "sap/ui/vbm/Pies",
    "sap/ui/vbm/PieItem",
    "sap/ui/vbm/Spots",
    "sap/ui/vbm/Spot",
    "sap/ui/vbm/Boxes",
    "sap/ui/vbm/Box",
    "sap/ui/vbm/Areas",
    "sap/ui/vbm/Area",
    "sap/ui/vbm/Routes",
    "sap/ui/vbm/Route",
    "sap/ui/vbm/GeoCircles",
    "sap/ui/vbm/GeoCircle",
    "sap/ui/vbm/Circles",
    "sap/ui/vbm/Circle",
    "sap/ui/vbm/Containers",
    "sap/ui/vbm/Container",
    "sap/ui/vbm/Resource",
    "sap/ui/vbm/SemanticType",
    "sap/suite/ui/microchart/ColumnMicroChartLabel",
    "sap/suite/ui/microchart/ColumnMicroChartData",
    "sap/suite/ui/microchart/ColumnMicroChart",
    "sap/ui/core/mvc/View"
  ],
  function (
    FlexBox,
    Label,
    Panel,
    Text,
    Button,
    FlexItemData,
    VerticalLayout,
    AnalyticMap,
    GeoMap,
    Region,
    Legend,
    LegendItem,
    Pie,
    Pies,
    PieItem,
    Spots,
    Spot, 
    Boxes,
    Box,
    Areas,
    Area,
    Routes,
    Route,
    GeoCircles,
    GeoCircle,
    Circles,
    Circle,
    Containers,
    Container,
    Resource,
    SemanticType,
    ColumnMicroChartLabel,
    ColumnMicroChartData,
    ColumnMicroChart,
    View
    
  ) {
    "use strict";
    return View.extend("vbm-regression.tests.38.view.App", {
      getControllerName: function () {
        return "vbm-regression.tests.38.controller.App";
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
                      text: "1. Check that the map loads and you can see various visual objects.",
                    }),
                    new Text({
                      text: "2. Click 'Remove a chart(change model data) and check that a chart is removed by changing model data. Charts are removed one by one.",
                    }),
                    new Button({
                      text: "Remove a chart (change model data)",
                      press: [
                        oController.onPressRemoveChartChangeModel,
                        oController,
                      ],
                    }),
                    new Text({
                      text: "3. Click on Remove charts (remove VO) and check that all charts are removed from the map.",
                    }),
                    new Button({
                      text: "Remove charts (remove VO)",
                      press: [oController.onPressRemoveChartVO, oController],
                    }),
                    new Text({
                      text: "4. Click on Remove spots (remove VO) and check that spots with keys 1, 2 and 3 are removed from the map.",
                    }),
                    new Button({
                      text: "Remove spots (remove VO)",
                      press: [oController.onPressRemoveSpotVO, oController],
                    }),
                    new Text({
                      text: "5. Click on Add spots (add VO) and check that 6 new spots are added to the map.",
                    }),
                    new Button({
                      text: "Add spots (add VO)",
                      press: [oController.onPressAddSpotVO, oController],
                    }),
                    new Text({
                      text: "6. Click on Hide Legend and verify that the legend is not visible any more.",
                    }),
                    new Button({
                      id: this.createId("btnHide"),
                      text: "Hide Legend",
                      press: [oController.onLegendVisible, oController],
                    }),
                    new Text({
                      text: "7. Click on Destroy Legend and then click on Show Legend to verify that the legend does not appear back.",
                    }),
                    new Button({
                      text: "Destroy Legend",
                      press: [oController.onDestroyLegend, oController],
                    }),
                    new Text({
                      text: "Note: Destroying the legend without hiding it first, does not make it invisible but it does destroy it internally from the Geomap. This is a known problem.",
                    }),
                  ],
                }),
              ],
            }),
            new GeoMap("jsviewtest_geoMap", {
              width: "100%",
              height: "100%",
              mapConfiguration: GLOBAL_MAP_CONFIG,
              layoutData: new FlexItemData({
                baseSize: "60%",
              }),
              legend: new Legend({
                caption: "Geomap Legend",
                items: {
                  path: "/legendItems",
                  template: new LegendItem({
                    text: "{text}",
                    color: "{color}",
                  }),
                },
              }),
              resources: [
                new Resource({
                  name: "smiley",
                  src: "media/images/smiley.png",
                }),
              ],
              vos: [
                new Containers("containers", {
                  items: {
                    path: "/Containers",
                    template: new Container({
                      position: "{pos}",
                      tooltip: "{tooltip}",
                      item: new ColumnMicroChart({
                        size: "S",
                        columns: {
                          path: "ChartCols",
                          template:
                            new ColumnMicroChartData({
                              value: "{value}",
                              color: "{color}",
                            }),
                          templateShareable: true,
                        },
                        rightTopLabel:
                          new ColumnMicroChartLabel({
                            label: "{i18n>/Label1}",
                          }),
                      }).addStyleClass("chart-bg"),
                    }),
                  },
                }),
                new Spots("spots", {
                  items: {
                    path: "/Spots",
                    template: new Spot({
                      text: "{key}",
                      position: "{pos}",
                      tooltip: "{tooltip}",
                      type: "{type}",
                      labelText: "{labeltext}",
                    }),
                  },
                }),
                new Spots({
                  items: {
                    path: "/OtherSpots",
                    template: new Spot({
                      type: SemanticType.Default,
                      position: "{pos}",
                      tooltip: "{tooltip}",
                      labelText: "{labeltext}",
                    }),
                  },
                }),
                new Circles({
                  items: {
                    path: "/Circles",
                    template: new Circle({
                      position: "{pos}",
                      tooltip: "{tooltip}",
                      color: "RGB(0,0,120)",
                      colorBorder: "RGB(0,0,255)",
                    }),
                  },
                }),
                // single instance
                new GeoCircles({
                  items: [
                    new GeoCircle({
                      radius: "1000000",
                      slices: "40",
                      position: "-10;0;0",
                      tooltip: "This is a GeoCircle",
                      color: "RGB(100,0,120)",
                      colorBorder: "RGB(0,0,255)",
                    }),
                  ],
                }),
                // single instance item
                new Routes({
                  // explicitly specify
                  items: [
                    new Route({
                      position: "-30;0;0;-30;-20;0;0;-20;0",
                      tooltip: "This is a Route",
                      end: "1",
                      start: "0",
                      color: "RGB(0,10,255)",
                    }),
                  ],
                }),
                // single instance item
                new Areas({
                  items: [
                    new Area({
                      position: "-30;50;0;-30;30;0;0;30;0",
                      tooltip: "This is an Area",
                      color: "RGB(0,10,255)",
                    }),
                  ],
                }),
                // single instance item
                new Boxes({
                  items: [
                    new Box({
                      scale: "0.1;0.1;0.1",
                      position: "-40;50;0",
                      tooltip: "This is a Box",
                      color: "RGB(0,255,0)",
                    }),
                  ],
                }),

                new Spots({
                  items: [
                    new Spot({
                      image: "smiley",
                      text: "",
                      position: "-60;0;0",
                      tooltip: "{i18n>/Label1}",
                      labelText: "Hello Smiley",
                    }),
                  ],
                }),

                // single instance item
                new Pies({
                  items: [
                    new Pie({
                      scale: "1;1;1",
                      position: "-40;-50;0",
                      tooltip: "This is a Pie",
                      items: {
                        path: "/PieSeries",
                        template: new PieItem({
                          value: "{value}",
                          tooltip: "{tooltip}",
                        }),
                      },
                    }),
                  ],
                }),
              ],
            }),
          ],
        });

        return fb;
      },
    });
  }
);
