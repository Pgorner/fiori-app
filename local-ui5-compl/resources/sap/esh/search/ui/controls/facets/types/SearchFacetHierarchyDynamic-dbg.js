/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../../../i18n", "sap/m/Label", "sap/m/CheckBox", "sap/m/library", "sap/ui/model/BindingMode", "../../../tree/TreeView", "sap/m/Link", "sap/m/VBox", "../../../tree/TreeViewItem", "sap/m/FlexBox"], function (__i18n, Label, CheckBox, sap_m_library, BindingMode, __TreeView, Link, VBox, __TreeViewItem, FlexBox) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const i18n = _interopRequireDefault(__i18n);
  const FlexAlignItems = sap_m_library["FlexAlignItems"];
  const FlexJustifyContent = sap_m_library["FlexJustifyContent"];
  const ListType = sap_m_library["ListType"];
  const TreeView = _interopRequireDefault(__TreeView);
  const TreeViewItem = _interopRequireDefault(__TreeViewItem);
  /**
   * Hierarchy facet (dynamic)
   *
   * The SearchFacetHierarchyDynamic control is used for displaying dynamic hierarchy facets.
   * Corresponding model objects:
   * - hierarchydynamic/SearchHierarchyDynamicFacet.js : facet with pointer to root hierarchy node
   * - hierarchydynamic/SearchHierarchyDynamicNode.js  : hierarchy node
   */
  /**
   * @namespace sap.esh.search.ui.controls
   */
  const SearchFacetHierarchyDynamic = VBox.extend("sap.esh.search.ui.controls.SearchFacetHierarchyDynamic", {
    renderer: {
      apiVersion: 2
    },
    metadata: {
      properties: {
        showTitle: {
          type: "boolean",
          defaultValue: true
        },
        openShowMoreDialogFunction: {
          type: "function"
        }
      }
    },
    constructor: function _constructor(sId, options) {
      VBox.prototype.constructor.call(this, sId, options);
      this.addStyleClass("sapUshellSearchFacetContainer");

      // heading
      if (this.getShowTitle()) {
        const header = new FlexBox({
          justifyContent: FlexJustifyContent.SpaceBetween,
          alignItems: FlexAlignItems.Center,
          items: [new Label({
            text: "{title}"
          })]
        });
        header.addStyleClass("sapUshellSearchFacetHeader");
        this.addItem(header);
      }

      // tree
      const treeView = new TreeView("", {
        treeNodeFactory: "{treeNodeFactory}",
        items: {
          path: "rootTreeNode/childTreeNodes",
          factory: (sId, oContext) => {
            return this.createTreeItem(sId, oContext);
          }
        }
      });
      // define group for F6 handling (tree)
      treeView.data("sap-ui-fastnavgroup", "false", true /* write into DOM */);
      this.addItem(treeView);

      // show more link
      this.createShowMoreLink();
    },
    getOpenShowMoreDialogFunction: function _getOpenShowMoreDialogFunction() {
      return this.getProperty("openShowMoreDialogFunction");
    },
    createShowMoreLink: function _createShowMoreLink() {
      const oShowMoreLink = new Link("", {
        text: i18n.getText("showMore"),
        press: () => {
          const facet = this.getBindingContext().getObject();
          const openShowMoreDialog = this.getOpenShowMoreDialogFunction();
          openShowMoreDialog({
            searchModel: this.getModel(),
            dimension: facet.attributeId,
            selectedTabBarIndex: 0,
            tabBarItems: undefined,
            sourceControl: this
          });
        }
      });
      const oInfoZeile = new Label("", {
        text: ""
      });
      oShowMoreLink.addStyleClass("sapUshellSearchFacetShowMoreLink");
      const oShowMoreSlot = new VBox("", {
        items: [oInfoZeile, oShowMoreLink],
        visible: {
          parts: [{
            path: "isShowMoreDialog"
          }],
          formatter: function (isShowMoreDialog) {
            return !isShowMoreDialog;
          }
        }
      });
      oShowMoreSlot.addStyleClass("sapUshellSearchFacetShowMore");
      this.addItem(oShowMoreSlot);
    },
    getShowTitle: function _getShowTitle() {
      return this.getProperty("showTitle");
    },
    createTreeItem: function _createTreeItem(sId, oContext) {
      const treeNode = oContext.getObject();
      const checkBox = new CheckBox({
        selected: {
          path: "selected",
          mode: BindingMode.OneWay
        },
        partiallySelected: {
          path: "partiallySelected",
          mode: BindingMode.OneWay
        },
        select: function (event) {
          const treeNode = event.getSource().getBindingContext().getObject();
          treeNode.toggleFilter();
        }
      });
      const label = new Label({
        text: {
          parts: [{
            path: "label"
          }, {
            path: "count"
          }],
          formatter: function (label, count) {
            return count ? label + " (" + count + ")" : label;
          }
        }
      });
      /* label.attachBrowserEvent("click", function () {
          treeNode.toggleFilter();
      });*/
      const treeItem = new TreeViewItem("", {
        content: [checkBox, label]
      });
      treeItem.attachPress(() => {
        treeNode.toggleFilter();
      });
      treeItem.setType(ListType.Active);
      return treeItem;
    }
  });
  return SearchFacetHierarchyDynamic;
});
})();