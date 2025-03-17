/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/* global sap */
sap.ui.define(
  "sap/sac/df/fa/FinStyle", ["sap/sac/df/types/DimensionType","sap/sac/df/firefly/library"], function (DimensionType, FF) {

    var template = {
      "TableDefinition": {
        "CType": "VisualizationTableDefinition",
        "ScopedStyle": [
          {
            "Name": "middle-alignment",
            "Text": "middle-alignment",
            "ColumnsScope": {
              "CType": "VisualizationCellReferenceScope",
              "MatchDataSectionFull": true
            },
            "Style": "middle-alignment"
          },
          {
            "Name": "Actual",
            "Text": "Actual",
            "ColumnsScope": {
              "CType": "VisualizationCellReferenceScope",
              "ReferencePaths": []
            },
            "Style": "ActualStyle"
          },
          {
            "Name": "Previous",
            "Text": "Previous",
            "ColumnsScope": {              "CType": "VisualizationCellReferenceScope",
              "ReferencePaths": []
            },
            "Style": "PreviousStyle"
          },
          {
            "Name": "Budget",
            "Text": "Budget",
            "ColumnsScope": {
              "CType": "VisualizationCellReferenceScope",
              "ReferencePaths": []
            },
            "Style": "BudgetStyle"
          },
          {
            "Name": "Forecast",
            "Text": "Forecast",
            "ColumnsScope": {
              "CType": "VisualizationCellReferenceScope",
              "ReferencePaths": []
            },
            "Style": "ForecastStyle"
          },
          {
            "Name": "PercentageVariance",
            "Text": "PercentageVariance",
            "ColumnsScope": {
              "CType": "VisualizationCellReferenceScope",
              "ReferencePaths": []
            },
            "Style": "PercentageVarianceStyle"
          },
          {
            "Name": "AbsoluteVariance",
            "Text": "AbsoluteVariance",
            "ColumnsScope": {
              "CType": "VisualizationCellReferenceScope",
              "ReferencePaths": []
            },
            "Style": "AbsoluteVarianceStyle"
          },
          {
            "Name": "bold",
            "RowsScope": {
              "CType": "VisualizationCellReferenceScope",
              "ReferencePaths": [
                {
                  "ReferencePathElements": [
                    {
                      "AxisLevel": 0,
                      "Leaves": false
                    }
                  ]
                }
              ]
            },
            "Style": "bold",
            "Text": "bold"
          },
          {
            "Name": "leaves",
            "RowsScope": {
              "CType": "VisualizationCellReferenceScope",
              "ReferencePaths": [
                {
                  "ReferencePathElements": [
                    {
                      "AxisLevel": 0,

                      "Leaves": true
                    }
                  ]
                }
              ]
            },
            "Style": "leaves",
            "Text": "leaves"
          },
          {
            "Name": "hl0_td",
            "RowsScope": {
              "CType": "VisualizationCellReferenceScope",
              "MatchModulo": -1,
              "MatchOrdinal": -1,
              "ReferencePaths": [
                {
                  "ReferencePathElements": [
                    {
                      "AxisLevel": 0,
                      "HierarchyLevel": 0,
                      "IncludeHeaderBand": false,
                      "HierarchyLevelExact": true,
                      "Leaves": false,
                      "Expanded": true,
                      "LowerLevelNodeAlignment": "Below"
                    }
                  ]
                }
              ]
            },
            "Style": "hl0_td",
            "Text": "hl0_td"
          },
          {
            "Name": "hl1_td",
            "RowsScope": {
              "CType": "VisualizationCellReferenceScope",
              "MatchModulo": -1,
              "MatchOrdinal": -1,
              "ReferencePaths": [
                {
                  "ReferencePathElements": [
                    {
                      "AxisLevel": 0,
                      "HierarchyLevel": 1,
                      "IncludeHeaderBand": false,
                      "HierarchyLevelExact": true,
                      "Leaves": false,
                      "Expanded": true,
                      "LowerLevelNodeAlignment": "Below"
                    }
                  ]
                }
              ]
            },
            "Style": "hl1_td",
            "Text": "hl1_td"
          },
          {
            "Name": "hl2_td",
            "RowsScope": {
              "CType": "VisualizationCellReferenceScope",
              "MatchModulo": -1,
              "MatchOrdinal": -1,
              "ReferencePaths": [
                {
                  "ReferencePathElements": [
                    {
                      "AxisLevel": 0,
                      "HierarchyLevel": 2,
                      "HierarchyLevelExact": true,
                      "IncludeHeaderBand": false,
                      "Leaves": false,
                      "Expanded": true,
                      "LowerLevelNodeAlignment": "Below"
                    }
                  ]
                }
              ]
            },
            "Style": "hl2_td",
            "Text": "hl2_td"
          },
          {
            "Name": "hl0_bu",
            "RowsScope": {
              "CType": "VisualizationCellReferenceScope",
              "MatchModulo": -1,
              "MatchOrdinal": 0,
              "ReferencePaths": [
                {
                  "ReferencePathElements": [
                    {
                      "AxisLevel": 0,
                      "HierarchyLevel": 0,
                      "IncludeHeaderBand": false,
                      "HierarchyLevelExact": true,
                      "Leaves": false,
                      "Expanded": true,
                      "LowerLevelNodeAlignment": "Above"
                    }
                  ]
                }
              ]
            },
            "Style": "hl0_bu",
            "Text": "hl0_bu"
          },
          {
            "Name": "hl1_bu",
            "RowsScope": {
              "CType": "VisualizationCellReferenceScope",
              "MatchModulo": -1,
              "MatchOrdinal": 0,
              "ReferencePaths": [
                {
                  "ReferencePathElements": [
                    {
                      "AxisLevel": 0,
                      "HierarchyLevel": 1,
                      "IncludeHeaderBand": false,
                      "HierarchyLevelExact": true,
                      "Leaves": false,
                      "Expanded": true,
                      "LowerLevelNodeAlignment": "Above"
                    }
                  ]
                }
              ]
            },
            "Style": "hl1_bu",
            "Text": "hl1_bu"
          },
          {
            "Name": "hl2_bu",
            "RowsScope": {
              "CType": "VisualizationCellReferenceScope",
              "MatchModulo": -1,
              "MatchOrdinal": 0,
              "ReferencePaths": [
                {
                  "ReferencePathElements": [
                    {
                      "AxisLevel": 0,
                      "HierarchyLevel": 2,
                      "HierarchyLevelExact": true,
                      "IncludeHeaderBand": false,
                      "Leaves": false,
                      "Expanded": true,
                      "LowerLevelNodeAlignment": "Above"
                    }
                  ]
                }
              ]
            },
            "Style": "hl2_bu",
            "Text": "hl2_bu"
          }
        ],
        "Styles": [
          {
            "VerticalAlignment": "Middle",
            "Name": "middle-alignment",
            "Priority": 0,
            "Text": "middle-alignment"
          },
          {
            "FontBold": true,
            "Name": "bold",

            "Priority": 0,
            "Text": "bold"
          },
          {
            "FontBold": false,
            "Name": "leaves",

            "BottomLine": {
              "LineColor": "sapUiWhite",
              "LineStyle": "Solid",
              "LineWidth": 1
            },

            "Priority": 0,
            "Text": "leaves"
          },
          {
            "BottomLine": {
              "LineColor": "sapUiBrand",
              "LineStyle": "Solid",
              "LineWidth": 2
            },
            "Name": "hl0_td",
            "Priority": 0,
            "Text": "hl0_td"
          },
          {
            "BottomLine": {
              "LineColor": "sapUiBlackBorder",
              "LineStyle": "Solid",
              "LineWidth": 2
            },
            "Name": "hl1_td",
            "Priority": 0,
            "Text": "hl1_td"
          },
          {
            "BottomLine": {
              "LineColor": "sapUiBlackBorder",
              "LineStyle": "Solid",
              "LineWidth": 1
            },
            "Name": "hl2_td",
            "Priority": 0,
            "Text": "hl2_td"
          },
          {
            "BottomLine": {
              "LineColor": "sapUiBrand",
              "LineStyle": "Solid",
              "LineWidth": 2
            },
            "Name": "hl0_bu",
            "Priority": 0,
            "Text": "hl0_bu"
          },
          {
            "BottomLine": {
              "LineColor": "sapUiBlackBorder",
              "LineStyle": "Solid",
              "LineWidth": 2
            },
            "Name": "hl1_bu",
            "Priority": 0,
            "Text": "hl1_bu"
          },
          {
            "BottomLine": {
              "LineColor": "sapUiBlackBorder",
              "LineStyle": "Solid",
              "LineWidth": 1
            },
            "Name": "hl2_bu",
            "Priority": 0,
            "Text": "hl2_bu"
          },
          {

            "BottomLine": {
              "PatternType": "Solid",
              "PatternColor": "sapUiBlackBorder",
              "PatternWidth": 4,
              "PatternBorderColor": "sapUiBlackBorder"
            },
            "Name": "ActualStyle",
            "Text": "ActualStyle",
            "Priority": 0
          },
          {
            "BottomLine": {
              "PatternType": "Solid",
              "PatternColor": "sapUiContentUnratedColor",
              "PatternWidth": 4,
              "PatternBorderColor": "sapUiContentUnratedColor"
            },
            "Name": "PreviousStyle",
            "Text": "PreviousStyle",
            "Priority": 0
          },
          {
            "BottomLine": {
              "PatternType": "Nofill",
              "PatternColor": "sapUiBlackBorder",
              "PatternWidth": 4,
              "PatternBorderColor": "sapUiBlackBorder"
            },
            "Name": "BudgetStyle",
            "Text": "BudgetStyle",
            "Priority": 0
          },
          {
            "BottomLine": {
              "PatternType": "Hatching1",
              "PatternColor": "sapUiContentImagePlaceholderBackground",
              "LineWidth": 1,
              "PatternWidth": 4,
              "PatternBorderColor": "sapUiContentImagePlaceholderBackground"
            },
            "Name": "ForecastStyle",
            "Text": "ForecastStyle",
            "Priority": 0
          },
          {
            "BottomLine": {
              "PatternType": "Nofill",
              "PatternColor": "sapUiBrand",
              "PatternWidth": 4,
              "PatternBorderColor": "sapUiBrand"
            },
            "Name": "AbsoluteVarianceStyle",
            "Text": "AbsoluteVarianceStyle",
            "Priority": 0
          },
          {
            "BottomLine": {
              "PatternType": "Hatching1",
              "PatternColor": "sapUiBrand",
              "PatternWidth": 4,
              "PatternBorderColor": "sapUiBrand"
            },
            "Name": "PercentageVarianceStyle",
            "Text": "PercentageVarianceStyle",
            "Priority": 0
          }
        ],
        "TableHeaderCompactionType": "PreferablyColumn",
        "TableMarkup": [
          {
            "ColumnsScope": {
              "CType": "VisualizationCellReferenceScope",
              "MatchDataSectionEnd": false,
              "MatchDataSectionFull": true,
              "MatchDataSectionStart": false,
              "MatchHeaderSectionEnd": false,
              "MatchHeaderSectionFull": true,
              "MatchHeaderSectionStart": false,
              "MatchModulo": 0,
              "MatchOrdinal": 0
            },
            "Name": "tm",
            "Priority": 0,
            "ScopedStyle": [
              "hl0_td",
              "hl1_td",
              "hl2_td",
              "hl0_bu",
              "hl1_bu",
              "hl2_bu",
              "leaves",
              "bold"
            ],
            "Text": "tm",
            "Width": 0
          },
          {
            "RowsScope": {
              "CType": "VisualizationCellReferenceScope",
              "MatchHeaderSectionEnd": true
            },
            "HeightAddition": 3,
            "Name": "semantic",
            "Priority": 0,
            "ScopedStyle": [
              "middle-alignment",
              "Actual",
              "Previous",
              "Budget",
              "Forecast",
              "AbsoluteVariance",
              "PercentageVariance"
            ],
            "Text": "semantic",
            "Width": 0
          }
        ],
        "TableMemberHeaderHandling": "FirstMember"
      },
      "Name": "FIN",
      "Text": "S4-Fin Style"
    };

    /**
     * Json in form
     * {
     *   "MeasureStructure"{
     *     "MeasureMember1":[
     *       "style1", "style2"
     *     ]
     *   },
     *   "NonMeasureStructure":{
     *     "StructureMember":["style1","style2"]
     *   }
     * }
     * @param memberMapping
     */
    function FinStyle(memberMapping) {
      this.memberMapping = memberMapping;
      this.ACTUAL = "Actual";
      this.BUDGET = "Budget";
      this.VARIANCE = "Variance";


      this.getStyleForDataProvider = function (dataProvider) {
        var resultStyle = JSON.parse(JSON.stringify(template));
        if (!this.memberMapping) {
          return resultStyle;
        }

        var updateDimension = function (dimName) {
          if (this.memberMapping[dimName]) {
            var memberNames = Object.keys(this.memberMapping[dimName]);
            for (var i = 0; i < memberNames.length; i++) {
              var memberName = memberNames[i];
              var member = dataProvider.Dimensions[dimName].Members.find(function (it) {
                return it.Name === memberName;
              });
              if (member) {
                var memberStyles = this.memberMapping[dimName][memberName];
                for (var j = 0; j < memberStyles.length; j++) {
                  var scopedStyle = resultStyle.TableDefinition.ScopedStyle.find(function (it) {
                    return it.Name === memberStyles[j];
                  });
                  if (scopedStyle) {
                    var styleDimType = dimName === DimensionType.MeasureStructure ? FF.DimensionType.MEASURE_STRUCTURE.getName() : FF.DimensionType.SECONDARY_STRUCTURE.getName();
                    var refPath;
                    if (scopedStyle.ColumnsScope.ReferencePaths.length === 1 && scopedStyle.ColumnsScope.ReferencePaths[0].DimensionType === styleDimType) {
                      refPath = scopedStyle.ColumnsScope.ReferencePaths[0];
                    } else if (scopedStyle.ColumnsScope.ReferencePaths.length === 2 && scopedStyle.ColumnsScope.ReferencePaths[0].DimensionType === styleDimType) {
                      refPath = scopedStyle.ColumnsScope.ReferencePaths[1];
                    } else {
                      refPath = {
                        "ReferencePathElements": [
                          {
                            "DimensionType": styleDimType,
                            "MemberNames": []
                          }
                        ]
                      };
                      scopedStyle.ColumnsScope.ReferencePaths.push(refPath);
                    }
                    refPath.ReferencePathElements[0].MemberNames.push(member.Key);
                  }
                }
              }
            }
          }
        }.bind(this);
        updateDimension(DimensionType.MeasureStructure);
        updateDimension(DimensionType.StructureDimension);
        return resultStyle;

      };
    }

    return FinStyle;
  })
;


