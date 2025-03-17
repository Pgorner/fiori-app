/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./error/ErrorHandler", "./hierarchydynamic/SearchHierarchyDynamicFacetsFormatter", "./hierarchystatic/SearchHierarchyStaticFacetsFormatter", "./Facet", "./FacetItem", "./sinaNexTS/sina/ComparisonOperator", "./controls/facets/FacetTypeUI"], function (__ErrorHandler, __SearchHierarchyDynamicFacetsFormatter, __SearchHierarchyStaticFacetsFormatter, __Facet, __FacetItem, ___sinaNexTS_sina_ComparisonOperator, ___controls_facets_FacetTypeUI) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const ErrorHandler = _interopRequireDefault(__ErrorHandler);
  const SearchHierarchyDynamicFacetsFormatter = _interopRequireDefault(__SearchHierarchyDynamicFacetsFormatter);
  const SearchHierarchyStaticFacetsFormatter = _interopRequireDefault(__SearchHierarchyStaticFacetsFormatter);
  const Facet = _interopRequireDefault(__Facet);
  const FacetItem = _interopRequireDefault(__FacetItem);
  const ComparisonOperator = ___sinaNexTS_sina_ComparisonOperator["ComparisonOperator"];
  const FacetTypeUI = ___controls_facets_FacetTypeUI["FacetTypeUI"];
  class SearchFacetsFormatter {
    searchFacetDialogModel;
    errorHandler;
    hierarchyDynamicFacetsFormatter;
    hierarchyStaticFacetsFormatter;
    treeQuickSelectDataSourceFacet;
    constructor(searchModel) {
      this.searchFacetDialogModel = searchModel;
      this.errorHandler = ErrorHandler.getInstance();
      this.hierarchyDynamicFacetsFormatter = new SearchHierarchyDynamicFacetsFormatter(searchModel);
      this.hierarchyStaticFacetsFormatter = new SearchHierarchyStaticFacetsFormatter(searchModel);
    }
    _getAncestorDataSources(searchModel) {
      const aRecentDataSources = [];
      const oFilterDataSource = searchModel.dataSourceTree.findNode(searchModel.getProperty("/uiFilter/dataSource"));
      if (oFilterDataSource) {
        const aAncestorNodes = oFilterDataSource.getAncestors().reverse();
        for (let i = 0; i < aAncestorNodes.length; i++) {
          const ds = aAncestorNodes[i].dataSource;
          const dsFacetItem = new FacetItem({
            label: ds.labelPlural,
            icon: ds.icon || "sap-icon://none",
            filterCondition: ds,
            // ToDo !!!
            level: 0,
            value: aAncestorNodes[i].count ? aAncestorNodes[i].count.toString() : "" // ToDo 'toString'
          });
          aRecentDataSources.push(dsFacetItem);
        }
      }
      return aRecentDataSources;
    }
    _getSiblingDataSources(searchModel, level) {
      const aSiblingFacetItems = [];
      const currentDS = searchModel.getProperty("/uiFilter/dataSource");
      const currentNode = searchModel.dataSourceTree.findNode(currentDS);
      let aSiblingNodes;
      if (currentNode.parent && !currentNode.unsureWhetherNodeisBelowRoot) {
        aSiblingNodes = currentNode.parent.getChildren();
      } else {
        aSiblingNodes = [];
      }
      if (aSiblingNodes.length === 0) {
        aSiblingNodes.push(currentNode);
      }
      for (let j = 0, lenJ = aSiblingNodes.length; j < lenJ; j++) {
        const ds = aSiblingNodes[j].dataSource;
        const fi = new FacetItem({
          label: ds.labelPlural,
          icon: ds.icon || "sap-icon://none",
          value: aSiblingNodes[j].count,
          filterCondition: ds,
          selected: currentDS === ds,
          level: level
        });
        aSiblingFacetItems.push(fi);
        if (fi.selected) {
          aSiblingFacetItems.push(...this._getChildrenDataSources(searchModel, level + 1));
        }
      }
      return aSiblingFacetItems;
    }
    _getChildrenDataSources(searchModel, level) {
      // add children with data from the tree
      const aChildFacetItems = [];
      const currentDS = searchModel.getProperty("/uiFilter/dataSource");
      const aChildNodes = searchModel.dataSourceTree.findNode(currentDS).getChildren();
      for (let j = 0, lenJ = aChildNodes.length; j < lenJ; j++) {
        const ds = aChildNodes[j].dataSource;
        const fi = new FacetItem({
          label: ds.labelPlural,
          icon: ds.icon || "sap-icon://none",
          value: aChildNodes[j].count ? aChildNodes[j].count.toString() : "",
          // ToDo 'toString'
          filterCondition: ds,
          // ToDo!!!
          selected: false,
          level: level
        });
        aChildFacetItems.push(fi);
      }
      return aChildFacetItems;
    }
    getDataSourceFacetFromTree(searchModel) {
      const oDataSourceFacet = new Facet({
        facetType: FacetTypeUI.DataSource,
        title: "Search In"
      });
      const currentDS = searchModel.getProperty("/uiFilter/dataSource");
      const aAncestors = this._getAncestorDataSources(searchModel);
      oDataSourceFacet.items.push(...aAncestors);
      const aSiblings = this._getSiblingDataSources(searchModel, searchModel.allDataSource === currentDS ? 0 : 1);
      oDataSourceFacet.items.push(...aSiblings);
      return oDataSourceFacet;
    }
    _createFacetItemsFromConditionGroup(dataSource, rootCondition) {
      // ToDo 'any'
      const facetItems = [];
      for (let i = 0; i < rootCondition.conditions.length; i++) {
        const complexCondition = rootCondition.conditions[i];
        for (let j = 0; j < complexCondition.conditions.length; j++) {
          const condition = complexCondition.conditions[j];
          let facetAttribute;
          if (condition.type === this.searchFacetDialogModel.sinaNext.ConditionType.Simple) {
            facetAttribute = condition.attribute;
            if (dataSource.getAttributeMetadata(facetAttribute).isHierarchy) {
              continue;
            }
            facetItems.push(new FacetItem({
              facetAttribute: facetAttribute,
              label: this._formatLabel(condition.valueLabel, condition.operator),
              filterCondition: condition,
              selected: true
            }));
          } else {
            facetAttribute = condition.conditions[0].attribute;
            if (dataSource.getAttributeMetadata(facetAttribute).isHierarchy) {
              continue;
            }
            facetItems.push(new FacetItem({
              facetAttribute: facetAttribute,
              label: condition.valueLabel,
              filterCondition: condition,
              selected: true
            }));
          }
        }
      }
      return facetItems;
    }
    _formatLabel(label, operator) {
      let labelFormatted;
      switch (operator) {
        case ComparisonOperator.Bw /*"Bw"*/:
          labelFormatted = label + "*";
          break;
        case ComparisonOperator.Ew /*"Ew"*/:
          labelFormatted = "*" + label;
          break;
        case ComparisonOperator.Co /*"Co"*/:
          labelFormatted = "*" + label + "*";
          break;
        default:
          labelFormatted = label;
          break;
      }
      return labelFormatted;
    }
    getAttributeFacetsFromPerspective(resultSet, searchModel) {
      const oDataSource = searchModel.getDataSource();
      if (oDataSource.type === searchModel.sinaNext.DataSourceType.Category) {
        return Promise.resolve([]); // UI decision: with Category, common attributes should not be shown
      }

      // get chart facets from resultSet
      const aServerSideFacets = resultSet.facets.filter(function (element) {
        return element && element.type && element.type === searchModel.sinaNext.FacetType.Chart;
      });

      // create facets and facet items from server response
      const aClientSideFacets = [];
      const aClientSideFacetsByDimension = {};
      for (const oServerSideFacet of aServerSideFacets) {
        const oClientSideFacet = new Facet({
          title: oServerSideFacet.title,
          facetType: FacetTypeUI.Attribute,
          dimension: oServerSideFacet.query.dimension,
          totalCount: resultSet.totalCount
        });
        if (oServerSideFacet.items.length === 0) {
          continue;
        }
        for (let j = 0; j < oServerSideFacet.items.length; j++) {
          const oFacetListItem = oServerSideFacet.items[j];
          // DWC exit, add icon only for space facet
          let icon = "";
          if (typeof searchModel.config.checkAndSetSpaceIcon === "function") {
            icon = searchModel.config.checkAndSetSpaceIcon(oFacetListItem.icon, oServerSideFacet.query.dimension);
          } else {
            icon = oFacetListItem.icon;
          }
          const item = new FacetItem({
            facetAttribute: oServerSideFacet.query.dimension,
            // label: oFacetListItem.dimensionValueFormatted,
            label: this._formatLabel(oFacetListItem.dimensionValueFormatted, oFacetListItem.filterCondition.operator),
            value: oFacetListItem.measureValue,
            // ToDo: types do not match
            // value: oFacetListItem.measureValue.toString(),
            filterCondition: oFacetListItem.filterCondition,
            icon: icon
          });
          item.facetTitle = oServerSideFacet.title;
          item["serverSideItem"] = true; // ToDo: clean-code -> serverSideItem seems to be obsolete
          oClientSideFacet.items.push(item);
        }
        aClientSideFacetsByDimension[oServerSideFacet.query.dimension] = oClientSideFacet;
        aClientSideFacets.push(oClientSideFacet);
      }
      this.addDataTypeToClientSideFacets(aClientSideFacets, searchModel);

      // create facet items from global filter
      const oClientSideFacetsWithSelection = {};
      const aFacetItemsWithFilterConditions = this._createFacetItemsFromConditionGroup(oDataSource, searchModel.getProperty("/uiFilter/rootCondition"));

      // combine facets from global filter with facets from server
      for (let k = 0, lenK = aFacetItemsWithFilterConditions.length; k < lenK; k++) {
        const oSelectedFacetItem = aFacetItemsWithFilterConditions[k];
        const oClientSideFacetWithSelection = aClientSideFacetsByDimension[oSelectedFacetItem.facetAttribute];
        if (oClientSideFacetWithSelection) {
          // remove and insert selected facet on top, only in facet panel
          const indexOfClientSideFacetWithSelection = aClientSideFacets.indexOf(oClientSideFacetWithSelection);
          if (indexOfClientSideFacetWithSelection > 0) {
            aClientSideFacets.splice(indexOfClientSideFacetWithSelection, 1);
            aClientSideFacets.splice(0, 0, oClientSideFacetWithSelection);
          }
          // facet with the same title as a already selected facetitems facet was sent by the server
          // -> merge the item into this facet. If the same facet item already exists just select it
          // var facetItemFoundInFacet = false;
          for (let m = 0, lenM = oClientSideFacetWithSelection.items.length; m < lenM; m++) {
            const facetItem = oClientSideFacetWithSelection.items[m];
            if (oSelectedFacetItem.filterCondition.equals(facetItem.filterCondition)) {
              facetItem.selected = true;
            }
          }
        }
        oClientSideFacetsWithSelection[oSelectedFacetItem.facetAttribute] = oClientSideFacetWithSelection;
      }
      return Promise.resolve(aClientSideFacets);
    }
    addDataTypeToClientSideFacets(aClientSideFacets, searchModel) {
      const oDataSource = searchModel.getDataSource();
      for (let i = 0; i < aClientSideFacets.length; i++) {
        const oFacet = aClientSideFacets[i];
        try {
          const metadata = oDataSource.getAttributeMetadata(oFacet.dimension);
          oFacet.dataType = metadata.type;
        } catch (error) {
          this.errorHandler.onError(error);
        }
      }
    }
    addQuickSelectDataSourceFacet(searchModel, facets) {
      if (searchModel.config.quickSelectDataSources.length === 0) {
        return;
      }
      const dataSource = searchModel.config.quickSelectDataSources[0];
      let facet;
      if (dataSource.type === "quickSelectDataSourceTreeNode") {
        // tree of datasources (one catalog)
        facet = this.createTreeQuickSelectDataSourceFacet(searchModel);
      } else {
        // flat list of datasources (repository explorer)
        facet = this.createListQuickSelectDataSourceFacet(searchModel);
      }
      facets.push(facet);
    }
    createListQuickSelectDataSourceFacet(searchModel) {
      return {
        facetType: FacetTypeUI.QuickSelectDataSource,
        items: searchModel.config.quickSelectDataSources.map(ds => {
          return {
            type: "quickSelectDataSourceListItem",
            dataSource: ds
          };
        })
      };
    }
    createTreeQuickSelectDataSourceFacet(searchModel) {
      if (!this.treeQuickSelectDataSourceFacet) {
        // use same structure as for list display
        // root tree node is stored as first item
        this.treeQuickSelectDataSourceFacet = {
          facetType: FacetTypeUI.QuickSelectDataSource,
          items: [{
            type: "quickSelectDataSourceTreeNode",
            children: searchModel.config.quickSelectDataSources.map(treeNodeProps => this.createTreeNodeQuickSelectDataSource(treeNodeProps))
          }]
        };
      }
      const rootNode = this.treeQuickSelectDataSourceFacet.items[0];
      this.expandPathToSelectedDataSource(searchModel, rootNode);
      return this.treeQuickSelectDataSourceFacet;
    }
    expandPathToSelectedDataSource(searchModel, rootNode) {
      // helper function for collecting all tree paths to a datasource
      function collectPaths(rootNode, dataSource) {
        const paths = [];
        function findDataSource(path, node) {
          path = path.slice();
          path.push(node);
          if (node.getDataSource && node.getDataSource() === dataSource) {
            paths.push(path);
            return;
          }
          if (!node.children) {
            return;
          }
          for (const childNode of node.children) {
            findDataSource(path, childNode);
          }
        }
        findDataSource([], rootNode);
        return paths;
      }

      // collect all paths in the tree to the current datasource
      const paths = collectPaths(rootNode, searchModel.getDataSource());

      // expand paths
      for (const path of paths) {
        for (let i = 0; i < path.length - 1; ++i) {
          // i<path.length-1 because last path element is datasource itself and does not need expansion
          const node = path[i];
          node.expanded = true;
        }
      }
    }
    createTreeNodeQuickSelectDataSource(treeNodeProps) {
      let children = [];
      if (treeNodeProps.children) {
        children = treeNodeProps.children.map(childTreeNodeProps => {
          return this.createTreeNodeQuickSelectDataSource(childTreeNodeProps);
        });
      }
      return {
        expanded: false,
        type: "quickSelectDataSourceTreeNode",
        label: treeNodeProps.dataSource.labelPlural,
        icon: treeNodeProps.dataSource.icon,
        getDataSource: () => treeNodeProps.dataSource,
        dataSourceId: treeNodeProps.dataSource.id,
        children: children,
        toggleExpand: function () {
          this.expanded = !this.expanded;
        }
      };
    }
    async getFacets(oDataSource, oINAPerspective, searchModel) {
      const resultFacets = [];

      // add datasource facet
      resultFacets.push(this.getDataSourceFacetFromTree(searchModel));

      // add quick select datasource facet
      this.addQuickSelectDataSourceFacet(searchModel, resultFacets);

      // for ds=apps or ds=category -> no attribute facets, just return
      if (oDataSource === searchModel.appDataSource || oDataSource.type === searchModel.sinaNext.DataSourceType.Category) {
        this.sortFacets(resultFacets, searchModel);
        this.setFacetIndex(resultFacets);
        return resultFacets;
      }

      // return if we have no perspective
      if (!oINAPerspective) {
        this.sortFacets(resultFacets, searchModel);
        this.setFacetIndex(resultFacets);
        return resultFacets;
      }

      // add dynamic hierarchy facets
      const hierarchyDynamicFacets = await this.hierarchyDynamicFacetsFormatter.getFacets(oINAPerspective, searchModel);
      resultFacets.push(...hierarchyDynamicFacets);

      // add static hierarchy facets
      const hierarchyStaticFacets = await this.hierarchyStaticFacetsFormatter.getFacets(oINAPerspective);
      resultFacets.push(...hierarchyStaticFacets);

      // add attribute facets
      const attributeFacets = await this.getAttributeFacetsFromPerspective(oINAPerspective, searchModel);
      resultFacets.push(...attributeFacets);

      // sort
      this.sortFacets(resultFacets, searchModel);
      this.setFacetIndex(resultFacets);
      return resultFacets;
    }
    setFacetIndex(facets) {
      // facet index is needed in SearchHierarchyFacet and SearchHierarchyStaticFacet for updating facets in the UI
      // see method refreshUI
      for (let i = 0; i < facets.length; ++i) {
        const facet = facets[i];
        if (facet.setFacetIndex) {
          facet.setFacetIndex(i);
        } else {
          facet.facetIndex = i;
        }
      }
    }
    sortFacets(facets, searchModel) {
      const facetPosition = {
        [FacetTypeUI.DataSource]: -2000,
        // negative in order to not interfere with DWC exit
        [FacetTypeUI.QuickSelectDataSource]: -1000,
        // negative in order to not interfere with DWC exit
        [FacetTypeUI.HierarchyStatic]: 100,
        [FacetTypeUI.Hierarchy]: 1000,
        [FacetTypeUI.Attribute]: 1000
      };
      for (let index = 0; index < facets.length; ++index) {
        const facet = facets[index];

        // keep original position
        facet.position = index;

        // add offset according to type
        facet.position += facetPosition[facet.facetType];

        // DWC exit
        if (searchModel.config.searchInAttibuteFacetPostion && typeof searchModel.config.searchInAttibuteFacetPostion[facet.dimension] !== "undefined") {
          facet.position = searchModel.config.searchInAttibuteFacetPostion[facet.dimension];
          continue;
        }

        // move facets with filters up
        if (facet.facetType === FacetTypeUI.Attribute || facet.facetType === FacetTypeUI.Hierarchy) {
          if (searchModel.getFilterRootCondition().containsAttribute(facet.dimension)) {
            facet.position -= 500;
          }
        }
      }
      facets.sort((f1, f2) => f1.position - f2.position);
    }
    getDialogFacetsFromMetaData(dataSource, searchFacetDialogModel) {
      const facets = [];
      // attribute facets
      const attributeFacets = this.getAttributeDialogFacetsFromMetaData(dataSource, searchFacetDialogModel);
      facets.push(...attributeFacets);
      // dynamic hierarchy attribute facets
      const hierarchyDynamicFacets = this.hierarchyDynamicFacetsFormatter.getFacetsFromMetadata(dataSource, searchFacetDialogModel);
      facets.push(...hierarchyDynamicFacets);
      // sort
      facets.sort(function (a, b) {
        return a.title.localeCompare(b.title);
      });
      // set facet index
      this.setFacetIndex(facets);
      return facets;
    }
    getAttributeDialogFacetsFromMetaData(oMetaData, searchFacetDialogModel) {
      const aServerSideFacets = jQuery.map(oMetaData.attributeMetadataMap, function (el) {
        return el;
      });
      const aClientSideFacets = [];
      // extract facets from server response:
      for (const oServerSideFacet of aServerSideFacets) {
        if ((oServerSideFacet.usage.Facet || oServerSideFacet.usage.AdvancedSearch) && oServerSideFacet.isHierarchy !== true) {
          const oClientSideFacet = new Facet({
            title: oServerSideFacet.label,
            facetType: FacetTypeUI.Attribute,
            dimension: oServerSideFacet.id,
            dataType: oServerSideFacet.type,
            matchingStrategy: oServerSideFacet.matchingStrategy
          });

          // DWC exit
          if (searchFacetDialogModel.config.showSpaceFacetInShowMoreDialog) {
            if (searchFacetDialogModel.config.showSpaceFacetInShowMoreDialog(oServerSideFacet.id) === false) {
              oClientSideFacet.visible = false;
            }
          }
          const aFacetItemsWithFilterConditions = this._createFacetItemsFromConditionGroup(searchFacetDialogModel.getDataSource(), searchFacetDialogModel.getProperty("/uiFilter/rootCondition"));
          let count = 0;
          for (let k = 0, lenK = aFacetItemsWithFilterConditions.length; k < lenK; k++) {
            const oSelectedFacetItem = aFacetItemsWithFilterConditions[k];
            oSelectedFacetItem.visible = oClientSideFacet.visible;
            if (oSelectedFacetItem.facetAttribute === oClientSideFacet.dimension) {
              count++;
              oClientSideFacet.items.splice(0, 0, oSelectedFacetItem);
            }
          }
          oClientSideFacet["count"] = count; // ToDo, 'count does not exist ?!?'

          aClientSideFacets.push(oClientSideFacet);
        }
      }
      return aClientSideFacets;
    }
    getDialogFacetsFromChartQuery(resultSet, searchModel, dimension, filters) {
      const oClientSideFacet = new Facet({
        dimension: dimension
      });
      if (resultSet) {
        for (let j = 0; j < resultSet.items.length; j++) {
          const oFacetListItem = resultSet.items[j];
          const item = new FacetItem({
            value: oFacetListItem.measureValue,
            // value: oFacetListItem.measureValue.toString(),
            filterCondition: oFacetListItem.filterCondition,
            label: oFacetListItem.dimensionValueFormatted,
            facetAttribute: resultSet.query.dimension
          });
          oClientSideFacet.items.push(item);
        }

        // add filter conditions as facet items:
        let aFacetItemsWithFilterConditions;
        if (filters) {
          aFacetItemsWithFilterConditions = filters;
        } else {
          aFacetItemsWithFilterConditions = this._createFacetItemsFromConditionGroup(searchModel.getDataSource(), searchModel.getProperty("/uiFilter/rootCondition"));
        }
        for (let k = 0, lenK = aFacetItemsWithFilterConditions.length; k < lenK; k++) {
          const oSelectedFacetItem = aFacetItemsWithFilterConditions[k];
          if (oSelectedFacetItem.facetAttribute === oClientSideFacet.dimension) {
            let facetItemFoundInFacet = false;
            for (let m = 0, lenM = oClientSideFacet.items.length; m < lenM; m++) {
              const facetItem = oClientSideFacet.items[m];
              if (oSelectedFacetItem.filterCondition.equals(facetItem.filterCondition)) {
                facetItem.selected = true;
                facetItemFoundInFacet = true;
              }
            }
            if (!facetItemFoundInFacet) {
              // there is no such facet item -> add the facet item to the facet
              oClientSideFacet.items.splice(oClientSideFacet.items.length, 0, oSelectedFacetItem);
              if (oSelectedFacetItem.filterCondition.userDefined) {
                oSelectedFacetItem.advanced = true;
              } else {
                oSelectedFacetItem.listed = true;
                oSelectedFacetItem.value = "";
                oSelectedFacetItem.valueLabel = "";
              }
            } else {
              oSelectedFacetItem.listed = true;
            }
          }
        }
      }
      return oClientSideFacet;
    }
    hasDialogFacetsFromMetaData(searchModel) {
      const oMetaData = searchModel.getDataSource();
      const aServerSideFacets = jQuery.map(oMetaData.attributeMetadataMap, el => {
        return el;
      });
      let hasDialogFacets = false;

      // extract facets from server response:
      // for (let i = 0, len = aServerSideFacets.length; i < len; i++) {
      //   const oServerSideFacet = aServerSideFacets[i];
      for (const oServerSideFacet of aServerSideFacets) {
        // DWC exit
        // if (searchFacetDialogModel.config.showSpaceFacetInShowMoreDialog) {
        //     if (searchFacetDialogModel.config.showSpaceFacetInShowMoreDialog(oServerSideFacet.id) === false) {
        //         continue;
        //     }
        // }

        if (oServerSideFacet.usage) {
          if (oServerSideFacet.usage.Facet || oServerSideFacet.usage.AdvancedSearch) {
            // TODO: ||, show more displays facets + advanced search
            hasDialogFacets = true;
            break;
          }
        }
      }
      return hasDialogFacets;
    }
    handleDataSourceChanged() {
      this.hierarchyDynamicFacetsFormatter.handleDataSourceChanged();
      this.hierarchyStaticFacetsFormatter.handleDataSourceChanged();
    }
    destroy() {
      this.hierarchyDynamicFacetsFormatter.destroy();
      this.hierarchyDynamicFacetsFormatter = null;
      this.hierarchyStaticFacetsFormatter.destroy();
      this.hierarchyStaticFacetsFormatter = null;
    }
  }
  return SearchFacetsFormatter;
});
})();