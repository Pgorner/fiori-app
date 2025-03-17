/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../../../../i18n", "sap/suite/ui/microchart/ComparisonMicroChart", "sap/suite/ui/microchart/ComparisonMicroChartData", "sap/ui/core/Control", "sap/m/library", "sap/ui/core/Element"], function (__i18n, ComparisonMicroChart, ComparisonMicroChartData, Control, sap_m_library, Element) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const i18n = _interopRequireDefault(__i18n);
  const ValueColor = sap_m_library["ValueColor"];
  /**
   * @namespace sap.esh.search.ui.controls
   */
  const SearchFacetBarChart = Control.extend("sap.esh.search.ui.controls.SearchFacetBarChart", {
    renderer: {
      apiVersion: 2,
      render(oRm, oControl) {
        // render start of tile container
        oRm.openStart("div", oControl);
        oRm.openEnd();
        const oComparisonMicroChart = new ComparisonMicroChart("", {
          width: "90%",
          colorPalette: [],
          // the colorPalette merely stops the evaluation of the bar with 'neutral', 'good' etc
          tooltip: "",
          shrinkable: true
        }); // ToDo: UI5 type files (d.ts) seem to be no complete (i.e. width), 2nd 'any' for functions like setwidth and setStyleClass

        if (oControl.options?.oSearchFacetDialog) {
          oComparisonMicroChart.setWidth("95%");
          oComparisonMicroChart.addStyleClass("sapUshellSearchFacetBarChartLarge");
        } else {
          oComparisonMicroChart.addStyleClass("sapUshellSearchFacetBarChart");
        }
        oComparisonMicroChart.addEventDelegate({
          onAfterRendering: function () {
            $("#" + this.getId()).has(".Good").addClass("sapUshellSearchFacetBarChartSelected");
            const selectedFacetItem = this.getBindingContext().getObject();
            oComparisonMicroChart.getDomRef().setAttribute("data-test-id-facet-dimension-value", `${selectedFacetItem.title}-${selectedFacetItem.dimension}`);
          }.bind(oControl)
        });
        let barItems = oControl.getAggregation("items");
        const barItems2 = oControl.getProperty("aItems");
        if (barItems.length === 0 && barItems2) {
          barItems = barItems2;
        }
        let iMissingCnt = 0;
        for (const barItem of barItems) {
          if (!oControl.options.oSearchFacetDialog) {
            if (barItem.getProperty("value")) {
              oComparisonMicroChart.addData(barItem);
            } else {
              iMissingCnt++;
            }
          } else {
            oComparisonMicroChart.addData(barItem);
          }
        }
        oControl.iMissingCnt = iMissingCnt;
        oRm.renderControl(oComparisonMicroChart);

        // render end of tile container
        oRm.close("div");
      }
    },
    metadata: {
      properties: {
        aItems: {
          type: "object"
        },
        oSearchFacetDialog: {
          type: "sap.esh.search.ui.controls.SearchFacetDialog"
        }
      },
      aggregations: {
        items: {
          type: "sap.suite.ui.microchart.ComparisonMicroChartData",
          multiple: true
        }
      }
    },
    constructor: function _constructor(sId, settings) {
      Control.prototype.constructor.call(this, sId, settings);
      this.options = settings || {};
      this.bindAggregation("items", {
        path: "items",
        factory: () => {
          const oComparisonMicroChartData = new ComparisonMicroChartData({
            title: {
              path: "label"
            },
            value: {
              path: "value"
            },
            color: {
              path: "selected",
              formatter: isSelected => {
                let res;
                if (isSelected) {
                  res = ValueColor.Good;
                } else {
                  res = ValueColor.Neutral;
                }
                return res;
              }
            },
            tooltip: {
              parts: [{
                path: "label"
              }, {
                path: "value"
              }],
              formatter: (label, value) => {
                return label + ": " + value;
              }
            },
            displayValue: {
              path: "valueLabel"
            },
            press: oEvent => {
              const context = oEvent.getSource().getBindingContext();
              const model = context.getModel();
              const data = context.getObject();
              const isSelected = data.selected;
              const filterCondition = data.filterCondition; // ToDo

              if (isSelected) {
                // deselect (remove filter)
                if (this.options.oSearchFacetDialog) {
                  this.options.oSearchFacetDialog.onDetailPageSelectionChangeCharts(oEvent);
                } else {
                  model.removeFilterCondition(filterCondition, true);
                }
              } else if (this.options.oSearchFacetDialog) {
                // select (set filter), first for searchFacetDialog
                this.options.oSearchFacetDialog.onDetailPageSelectionChangeCharts(oEvent);
              } else {
                // select (set filter), without searchFacetDialog / for small facets
                model.addFilterCondition(filterCondition, true);
              }
            }
          });
          return oComparisonMicroChartData;
        }
      });
    },
    onAfterRendering: function _onAfterRendering() {
      const infoZeile = $(this.getDomRef()).closest(".sapUshellSearchFacetIconTabBar").find(".sapUshellSearchFacetInfoZeile")[0];
      const oInfoZeile = Element.getElementById(infoZeile.id); // ToDo 'any cast'
      if (this.iMissingCnt > 0) {
        oInfoZeile.setVisible(true);
        const message = i18n.getText("infoZeileNumberMoreSelected", [this.iMissingCnt]);
        oInfoZeile.setText(message);
        oInfoZeile.rerender();
      } else {
        oInfoZeile.setVisible(false);
      }
    }
  });
  return SearchFacetBarChart;
});
})();