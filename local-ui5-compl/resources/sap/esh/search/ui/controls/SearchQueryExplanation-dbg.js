/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["sap/ui/core/Control", "./TypeGuardForControls", "sap/m/Tree", "sap/m/StandardTreeItem", "sap/ui/model/json/JSONModel", "sap/ui/codeeditor/CodeEditor", "sap/ui/layout/VerticalLayout", "sap/m/Label", "sap/m/Input", "../i18n", "sap/ui/layout/form/SimpleForm", "sap/m/Title", "sap/m/Bar", "sap/m/ToggleButton"], function (Control, ___TypeGuardForControls, Tree, StandardTreeItem, JSONModel, CodeEditor, VerticalLayout, Label, Input, __i18n, SimpleForm, Title, Bar, ToggleButton) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const typesafeRender = ___TypeGuardForControls["typesafeRender"];
  const i18n = _interopRequireDefault(__i18n);
  /**
   * @namespace sap.esh.search.ui.controls
   */
  const SearchQueryExplanation = Control.extend("sap.esh.search.ui.controls.SearchQueryExplanation", {
    renderer: {
      apiVersion: 2,
      render(oRm, oControl) {
        const conditionBuilderId = `${oControl.getId()}-filterConditions`;
        const oData = oControl.getProperty("data");
        const mainView = oControl.getAggregation("mainView");
        // toolbar
        // =======
        const toolbar = oControl.getAggregation("toolbar");
        // NLQ raw response data
        const nlqRawDataButton = new ToggleButton(`${oControl.getId()}-nlqRawDataToggleButton`, {
          text: i18n.getText("showNlqRawData"),
          press: () => {
            const showRawData = nlqRawDataButton.getPressed();
            conditionEditor.setVisible(showRawData);
            nlqRawDataTitle.setVisible(showRawData);
            if (showRawData) {
              nlqRawDataButton.setText(i18n.getText("hideNlqRawData"));
              conditionTree.collapseAll();
            } else {
              nlqRawDataButton.setText(i18n.getText("showNlqRawData"));
              conditionTree.expandToLevel(1);
            }
          }
        }).addStyleClass("sapUiLargeMarginBegin");
        toolbar.addContentRight(nlqRawDataButton);
        const oNlqDataModel = new JSONModel({
          dataSource: oData.scope,
          searchTerm: oData.query,
          query: JSON.stringify(oControl.getProperty("data"))
        });
        const nlqRawDataTitle = new Title(`${oControl.getId()}-nlqRawDataTitle`, {
          text: i18n.getText("nlqRawData"),
          visible: false
        }).addStyleClass("sapUiSmallMarginBegin").addStyleClass("sapUiSmallMarginTop");

        // filter conditions
        // =================
        const filterConditionsTitle = new Title(`${oControl.getId()}-filterConditionsTitle`, {
          text: i18n.getText("filterConditions")
        }).addStyleClass("sapUiSmallMarginBegin");

        // tree
        const oItems = {
          dataSource: oData.scope,
          searchTerm: oData.query,
          items: SearchQueryExplanation.convertFilterForTree(oData?.filter)
        };
        oNlqDataModel.setProperty("/items", oItems);
        let treeItemCounter = 0;
        const treeSettings = {
          items: {
            path: "nlqData>/items",
            template: new StandardTreeItem(`${conditionBuilderId}-${treeItemCounter++}`, {
              title: "{nlqData>text}"
              // icon: "{nlqData>icon}",
            })
          }
        };
        const conditionTree = new Tree(`${conditionBuilderId}-tree`, treeSettings);
        setTimeout(() => {
          conditionTree.expandToLevel(1);
        }, 0);
        oControl.setAggregation("conditionTree", conditionTree);
        // editor
        const editorType = "text";
        const codeEditorSettings = {
          type: editorType,
          value: "{nlqData>/query}",
          height: "100rem",
          visible: false
        };
        const conditionEditor = new CodeEditor(`${conditionBuilderId}-editor`, codeEditorSettings).addStyleClass("sapUiSmallMarginBegin");
        oControl.setAggregation("conditionEditor", conditionEditor);

        // form
        const form = oControl.getAggregation("form");
        mainView.addContent(form);

        // if (oData?.filter) {
        mainView.addContent(filterConditionsTitle);
        mainView.addContent(conditionTree);
        mainView.addContent(nlqRawDataTitle);
        mainView.addContent(conditionEditor);
        // }

        oControl.setModel(oNlqDataModel, "nlqData");

        // render control
        // ==============
        // - toolbar
        typesafeRender(oControl.getAggregation("toolbar"), oRm);
        // - form and filter conditions
        typesafeRender(mainView, oRm);
      }
    },
    metadata: {
      properties: {
        data: {
          type: "object"
        }
      },
      aggregations: {
        mainView: {
          type: "sap.ui.layout.VerticalLayout",
          multiple: false,
          visibility: "hidden"
        },
        toolbar: {
          type: "sap.m.Bar",
          multiple: false,
          visibility: "hidden"
        },
        form: {
          type: "sap.ui.layout.form.SimpleForm",
          multiple: false,
          visibility: "hidden"
        },
        conditionEditor: {
          type: "sap.ui.codeeditor.CodeEditor",
          multiple: false,
          visibility: "hidden"
        },
        conditionTree: {
          type: "sap.m.Tree",
          multiple: false,
          visibility: "hidden"
        }
      }
    },
    constructor: function _constructor(sId, settings) {
      Control.prototype.constructor.call(this, sId, settings);
      const mainView = new VerticalLayout(`${this.getId()}-container`, {
        width: "100%"
      });
      // toolbar
      const toolbar = new Bar(`${this.getId()}-toolbar`);
      mainView.addContent(toolbar);
      // form
      const formSettings = {
        editable: false,
        layout: "ResponsiveGridLayout",
        // ToDo: SimpleFormLayout.ResponsiveGridLayout,
        singleContainerFullSize: true
      };
      const form = new SimpleForm(`${this.getId()}-form`, formSettings);
      // data source
      form.addContent(new Label(`${this.getId()}-dsLabel`, {
        text: i18n.getText("dataSource")
      }));
      form.addContent(new Input(`${this.getId()}-dsValue`, {
        value: "{nlqData>/dataSource}",
        editable: false
      }));
      // search term
      form.addContent(new Label(`${this.getId()}-searchTermLabel`, {
        text: i18n.getText("searchTerm")
      }));
      form.addContent(new Input(`${this.getId()}-searchTermValue`, {
        value: "{nlqData>/searchTerm}",
        editable: false
      }));
      this.setAggregation("toolbar", toolbar);
      this.setAggregation("form", form);
      this.setAggregation("mainView", mainView);
    }
  });
  SearchQueryExplanation.convertFilterForTree = function convertFilterForTree(filterSubTree) {
    const items = [];
    if (filterSubTree?.length > 0) {
      // child node
      for (const conditionItem of filterSubTree) {
        if (conditionItem?.OperatorType) {
          items.push({
            text: conditionItem.OperatorType,
            nodes: SearchQueryExplanation.convertFilterForTree(conditionItem?.SubFilters)
          });
        } else {
          const text = `${conditionItem.ConditionAttribute} ${conditionItem.ConditionOperator} ${conditionItem.ConditionValue}`;
          items.push({
            text: text,
            nodes: []
          });
        }
      }
    } else if (filterSubTree?.OperatorType) {
      // composite node (AND/OR)
      items.push({
        text: filterSubTree.OperatorType,
        nodes: SearchQueryExplanation.convertFilterForTree(filterSubTree?.SubFilters)
      });
    } else if (filterSubTree?.ConditionOperator) {
      const text = `${filterSubTree.ConditionAttribute} ${filterSubTree.ConditionOperator} ${filterSubTree.ConditionValue}`;
      items.push({
        text: text,
        nodes: []
      });
    } else {
      items.push({
        text: i18n.getText("noFilterConditions"),
        nodes: []
      });
    }
    return items;
  };
  return SearchQueryExplanation;
});
})();