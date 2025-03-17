/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["sap/m/List", "sap/m/StandardListItem", "sap/m/library", "sap/ui/core/CustomData", "sap/m/Tree", "sap/m/CustomListItem", "./SearchFacetHierarchyStaticTreeItem", "sap/m/Label", "sap/ui/core/Icon", "../../../eventlogging/UserEvents", "sap/m/VBox", "sap/m/FlexBox", "../../../i18n"], function (List, StandardListItem, sap_m_library, CustomData, Tree, CustomListItem, __SearchFacetHierarchyStaticTreeItem, Label, Icon, _____eventlogging_UserEvents, VBox, FlexBox, __i18n) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const FlexAlignItems = sap_m_library["FlexAlignItems"];
  const FlexJustifyContent = sap_m_library["FlexJustifyContent"];
  const ListSeparators = sap_m_library["ListSeparators"];
  const ListMode = sap_m_library["ListMode"];
  const ListType = sap_m_library["ListType"];
  const SearchFacetHierarchyStaticTreeItem = _interopRequireDefault(__SearchFacetHierarchyStaticTreeItem);
  const UserEventType = _____eventlogging_UserEvents["UserEventType"];
  const i18n = _interopRequireDefault(__i18n);
  /**
   * Quick-select datasource facet
   */
  /**
   * @namespace sap.esh.search.ui.controls
   */
  const SearchFacetQuickSelectDataSource = VBox.extend("sap.esh.search.ui.controls.SearchFacetQuickSelectDataSource", {
    renderer: {
      apiVersion: 2
    },
    constructor: function _constructor(sId, options) {
      VBox.prototype.constructor.call(this, sId, options);
      this.addStyleClass("sapUshellSearchFacetContainer");
      const header = new FlexBox({
        justifyContent: FlexJustifyContent.SpaceBetween,
        alignItems: FlexAlignItems.Center,
        items: [new Label({
          text: i18n.getText("quickSelectDataSourcesHeader")
        })]
      });
      header.addStyleClass("sapUshellSearchFacetHeader");
      this.addItem(header);
      const dataSourcesList = new List({
        itemPress: event => {
          const itemControl = event.getParameter("srcControl");
          const item = itemControl.getBindingContext().getObject();
          this.handleSelectDataSource(item.dataSource);
          const oModel = this.getModel();
          const userEventQuickSelectSwitch = {
            type: UserEventType.QUICK_SELECT_SWITCH,
            dataSourceKey: item.dataSource.id
          };
          oModel.eventLogger.logEvent(userEventQuickSelectSwitch);
        },
        items: {
          path: "items",
          factory: (sId, oContext) => {
            const object = oContext.getObject();
            if (object.type === "quickSelectDataSourceTreeNode") {
              // tree display (one catalog)
              return this.createTree();
            } else {
              // flat list (repo explorer)
              return this.createListItem();
            }
          }
        }
      });
      dataSourcesList.setShowSeparators(ListSeparators.None);
      dataSourcesList.setMode(ListMode.SingleSelectMaster);
      this.addItem(dataSourcesList);

      // legacy: keep compatability for exit setQuickSelectDataSourceAllAppearsNotSelected
      this.getSelectedItem = dataSourcesList.getSelectedItem.bind(dataSourcesList);
    },
    handleSelectDataSource: function _handleSelectDataSource(dataSource) {
      const oModel = this.getModel();
      // reset search term (even if selected item gets pressed again)
      if (oModel.config.bResetSearchTermOnQuickSelectDataSourceItemPress) {
        oModel.setSearchBoxTerm("", false);
      }
      // DWC exit for handling SearchIn facets
      if (typeof oModel.config.cleanUpSpaceFilters === "function") {
        oModel.config.cleanUpSpaceFilters(oModel);
      }
      oModel.setDataSource(dataSource);
    },
    createTree: function _createTree() {
      this.tree = new Tree({
        mode: ListMode.None,
        includeItemInSelection: true,
        items: {
          path: "children",
          factory: this.createTreeItem.bind(this)
        },
        toggleOpenState: function (event) {
          event.getParameter("itemContext").getObject().toggleExpand();
        }
      });
      const delegate = {
        onAfterRendering: function () {
          this.expandTreeNodes();
        }.bind(this)
      };
      this.addEventDelegate(delegate, this);
      return new CustomListItem({
        content: this.tree
      });
    },
    expandTreeNodes: function _expandTreeNodes() {
      const facetModel = this.getBindingContext().getObject();
      const rootNode = facetModel.items[0]; // ToDo
      this.expandTreeNodeRecursively(rootNode, true);
    },
    expandTreeNodeRecursively: function _expandTreeNodeRecursively(node, isRootNode) {
      if (node.expanded && !isRootNode) {
        this.doExpandTreeNode(node);
      }
      if (!node.children) {
        return;
      }
      for (let i = 0; i < node.children.length; ++i) {
        const childNode = node.children[i];
        this.expandTreeNodeRecursively(childNode);
      }
    },
    doExpandTreeNode: function _doExpandTreeNode(node) {
      const items = this.tree.getItems();
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        const itemNode = item.getBindingContext().getObject();
        if (itemNode === node) {
          this.tree.expand(i);
          return;
        }
      }
    },
    createTreeItem: function _createTreeItem(sId, oContext) {
      const content = [];
      const iconUrl = oContext.getObject().icon;
      if (iconUrl) {
        const icon = new Icon("", {
          src: "{icon}"
        });
        icon.addStyleClass("sapUiTinyMarginEnd");
        content.push(icon);
      }
      const label = new Label({
        text: "{label}"
      });
      label.attachBrowserEvent("click", () => {
        this.handleSelectDataSource(oContext.getObject().getDataSource());
      });
      content.push(label);
      const treeItem = new SearchFacetHierarchyStaticTreeItem("", {
        content: content,
        selectLine: {
          parts: ["/queryFilter", "dataSourceId"],
          formatter: function (queryFilter, dataSourceId) {
            return queryFilter.dataSource.id === dataSourceId;
          }
        }
      });
      return treeItem;
    },
    createListItem: function _createListItem() {
      return new StandardListItem("", {
        type: ListType.Active,
        title: "{dataSource/label}",
        tooltip: "{dataSource/label}",
        icon: "{dataSource/icon}",
        customData: [new CustomData({
          key: "test-id-collection",
          value: "{dataSource/label}",
          writeToDom: true
        })],
        selected: {
          parts: [{
            path: "/queryFilter"
          }, {
            path: "dataSource"
          }],
          formatter: function (queryFilter, dataSource) {
            return queryFilter.dataSource === dataSource;
          }
        }
      });
    }
  });
  return SearchFacetQuickSelectDataSource;
});
})();