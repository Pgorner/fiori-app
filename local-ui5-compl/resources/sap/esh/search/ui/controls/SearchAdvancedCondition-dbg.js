/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../i18n", "sap/ui/layout/HorizontalLayout", "sap/m/Button", "sap/m/library", "sap/m/Input", "sap/m/Select", "sap/m/CheckBox", "sap/m/DateRangeSelection", "sap/ui/core/InvisibleText", "sap/ui/core/Item", "sap/m/Label", "../SearchFacetDialogHelper", "sap/ui/core/Element"], function (__i18n, HorizontalLayout, Button, sap_m_library, Input, Select, CheckBox, DateRangeSelection, InvisibleText, Item, Label, __SearchFacetDialogHelper, Element) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const i18n = _interopRequireDefault(__i18n);
  const ButtonType = sap_m_library["ButtonType"];
  const SearchFacetDialogHelper = _interopRequireDefault(__SearchFacetDialogHelper);
  /**
   * @namespace sap.esh.search.ui.controls
   */
  const SearchAdvancedCondition = HorizontalLayout.extend("sap.esh.search.ui.controls.SearchAdvancedCondition", {
    renderer: {
      apiVersion: 2
    },
    metadata: {
      properties: {
        type: {
          type: "string"
        }
      }
    },
    constructor: function _constructor(sId, settings) {
      HorizontalLayout.prototype.constructor.call(this, sId, settings);
      this.setAllowWrapping(settings?.allowWrapping);
      this.addStyleClass("sapUshellSearchFacetDialogDetailPageCondition");
      if (settings?.type) {
        const content = this.contentFactory(settings);
        for (const contentItem of content) {
          this.addContent(contentItem);
        }
      }
    },
    contentFactory: function _contentFactory(options) {
      const oAdvancedCheckBox = new CheckBox("", {
        select: oEvent => {
          SearchFacetDialogHelper.updateCountInfo(this.getDetailPage(oEvent.getSource()));
        }
      }).addStyleClass("sapUshellSearchFacetDialogDetailPageConditionCheckBox");
      let oAdvancedCheckBoxLabel = Element.getElementById("advancedCheckBoxLabel");
      if (!oAdvancedCheckBoxLabel) {
        oAdvancedCheckBoxLabel = new InvisibleText("advancedCheckBoxLabel", {
          text: i18n.getText("checkBox")
        });
      }
      oAdvancedCheckBox.addAriaLabelledBy("advancedCheckBoxLabel");
      let oOperatorLabel = Element.getElementById("operatorLabel");
      if (!oOperatorLabel) {
        oOperatorLabel = new InvisibleText("operatorLabel", {
          text: i18n.getText("operator")
        });
      }
      let oInputArea, oDeleteButton, oInputsingle, oSelect;
      switch (options.type) {
        case "timestamp":
        case "date":
          oInputArea = new DateRangeSelection({
            width: "86%",
            change: oEvent => {
              this.onDateRangeSelectionChange(oEvent);
            }
          }).addStyleClass("sapUshellSearchFacetDialogDetailPageConditionInput");
          oInputArea.onAfterRendering = function () {
            const $this = $(this.getDomRef());
            $("input", $this).attr("readonly", "readonly"); // ToDo: JQuery
          };
          break;
        case "string":
          oAdvancedCheckBox.setVisible(false);
          oInputsingle = new Input({
            width: "56%",
            placeholder: i18n.getText("filterCondition"),
            liveChange: oEvent => {
              this.onAdvancedInputChange(oEvent);
            }
          }).addStyleClass("sapUshellSearchFacetDialogDetailPageConditionInput");
          oSelect = new Select({
            width: "40%",
            tooltip: i18n.getText("operator"),
            items: [new Item({
              text: i18n.getText("equals"),
              key: "eq"
            }), new Item({
              text: i18n.getText("beginsWith"),
              key: "bw"
            }), new Item({
              text: i18n.getText("endsWith"),
              key: "ew"
            }), new Item({
              text: i18n.getText("contains"),
              key: "co"
            })]
          }).addStyleClass("sapUshellSearchFacetDialogDetailPageConditionSelect");
          oSelect.addAriaLabelledBy("operatorLabel");
          oInputArea = new HorizontalLayout({
            allowWrapping: true,
            content: [oSelect, oInputsingle]
          });
          oDeleteButton = new Button({
            icon: "sap-icon://sys-cancel",
            type: ButtonType.Transparent,
            tooltip: i18n.getText("removeButton"),
            press: (/*oEvent: Event*/
            ) => {
              this.onDeleteButtonPress(/*oEvent*/);
            }
          });
          break;
        case "text":
          oAdvancedCheckBox.setVisible(false);
          oInputsingle = new Input({
            width: "56%",
            placeholder: i18n.getText("filterCondition"),
            liveChange: oEvent => {
              this.onAdvancedInputChange(oEvent);
            }
          }).addStyleClass("sapUshellSearchFacetDialogDetailPageConditionInput");
          oSelect = new Select({
            width: "40%",
            tooltip: i18n.getText("operator"),
            items: [new Item({
              text: i18n.getText("containsWords"),
              key: "co"
            })]
          }).addStyleClass("sapUshellSearchFacetDialogDetailPageConditionSelect");
          oSelect.addAriaLabelledBy("operatorLabel");
          oInputArea = new HorizontalLayout({
            allowWrapping: true,
            content: [oSelect, oInputsingle]
          });
          oDeleteButton = new Button({
            icon: "sap-icon://sys-cancel",
            type: ButtonType.Transparent,
            tooltip: i18n.getText("removeButton"),
            press: (/*oEvent: Event*/
            ) => {
              this.onDeleteButtonPress(/*oEvent*/);
            }
          });
          break;
        case "integer":
        case "number":
          {
            const oInputRangeFrom = new Input("", {
              width: "46.5%",
              placeholder: i18n.getText("fromPlaceholder"),
              liveChange: oEvent => {
                this.onAdvancedNumberInputChange(oEvent);
              }
            }).addStyleClass("sapUshellSearchFacetDialogDetailPageConditionInput");
            const oInputRangeTo = new Input("", {
              width: "46.5%",
              placeholder: i18n.getText("toPlaceholder"),
              liveChange: oEvent => {
                this.onAdvancedNumberInputChange(oEvent);
              }
            }).addStyleClass("sapUshellSearchFacetDialogDetailPageConditionInput");
            const oLabelSeparator = new Label("", {
              text: i18n.getText("threeDots")
            }).addStyleClass("sapUshellSearchFacetDialogDetailPageConditionLabel");
            oInputArea = new HorizontalLayout("", {
              allowWrapping: true,
              content: [oInputRangeFrom, oLabelSeparator, oInputRangeTo]
            });
            oInputArea.addEventDelegate({
              // workaround to set focus at right end position
              onAfterRendering: oEvent => {
                const length = oEvent.srcControl.getParent().getParent().getContent().length;
                const index = oEvent.srcControl.getParent().getParent().indexOfAggregation("content", oEvent.srcControl.getParent());
                if (index === length - 2) {
                  const value = oEvent.srcControl.getContent()[2].getValue();
                  oEvent.srcControl.getContent()[2].setValue();
                  oEvent.srcControl.getContent()[2].setValue(value);
                }
              }
            });
            break;
          }
        default:
          break;
      }
      return [oAdvancedCheckBox, oInputArea, oDeleteButton];
    },
    getDetailPage: function _getDetailPage(oControl) {
      if (oControl.hasStyleClass && (oControl.hasStyleClass("sapUshellSearchFacetDialogDetailPageString") || oControl.hasStyleClass("sapUshellSearchFacetDialogDetailPage"))) {
        return oControl;
      } else {
        return this.getDetailPage(oControl.getParent()); // ToDo
      }
    },
    // event: date range selection box changed
    onDateRangeSelectionChange: function _onDateRangeSelectionChange(oEvent) {
      const oDateRangeSelection = oEvent.getSource(); // ToDo
      const oAdvancedCondition = oDateRangeSelection.getParent();
      const oAdvancedConditionCheckBox = oAdvancedCondition.getContent()[0];
      if (oDateRangeSelection.getDateValue() && oDateRangeSelection.getSecondDateValue()) {
        oAdvancedConditionCheckBox.setSelected(true);
        SearchFacetDialogHelper.insertNewAdvancedCondition(oAdvancedCondition, "date");
        SearchFacetDialogHelper.updateCountInfo(oAdvancedCondition.getParent().getParent());
      } else {
        oAdvancedConditionCheckBox.setSelected(false);
      }
    },
    // event: advanced string input box changed
    onAdvancedInputChange: function _onAdvancedInputChange(oEvent) {
      const oInput = oEvent.getSource();
      const oAdvancedCondition = oInput.getParent().getParent(); // ToDo
      const oAdvancedConditionCheckBox = oAdvancedCondition.getContent()[0];
      if (oInput.getValue()) {
        oAdvancedConditionCheckBox.setSelected(true);
        SearchFacetDialogHelper.updateCountInfo(this.getDetailPage(oAdvancedConditionCheckBox));
      } else {
        oAdvancedConditionCheckBox.setSelected(false);
      }
    },
    // event: advanced condition delete button pressed
    onDeleteButtonPress: function _onDeleteButtonPress() {
      SearchFacetDialogHelper.deleteAdvancedCondition(this);
    },
    // event: advanced number input box changed
    onAdvancedNumberInputChange: function _onAdvancedNumberInputChange(oEvent) {
      const oInput = oEvent.getSource();
      const oAdvancedCondition = oInput.getParent().getParent();
      const oAdvancedConditionCheckBox = oAdvancedCondition.getContent()[0];
      const oAdvancedConditionRange = oInput.getParent();
      const oAdvancedRangeFrom = oAdvancedConditionRange.getContent()[0];
      const oAdvancedRangeTo = oAdvancedConditionRange.getContent()[2];
      if (oAdvancedRangeFrom.getValue() && oAdvancedRangeTo.getValue()) {
        oAdvancedConditionCheckBox.setSelected(true);
        SearchFacetDialogHelper.insertNewAdvancedCondition(oAdvancedCondition, "number");
        SearchFacetDialogHelper.updateCountInfo(oAdvancedCondition.getParent().getParent());
      } else {
        oAdvancedConditionCheckBox.setSelected(false);
      }
    }
  });
  SearchAdvancedCondition.injectSearchFacetDialogHelper = function injectSearchFacetDialogHelper(_SearchFacetDialogHelper) {
    SearchAdvancedCondition.searchFacetDialogHelper = _SearchFacetDialogHelper;
  };
  return SearchAdvancedCondition;
});
})();