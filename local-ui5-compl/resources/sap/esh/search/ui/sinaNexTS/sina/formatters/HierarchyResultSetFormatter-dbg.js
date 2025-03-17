/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../SearchQuery", "./Formatter", "../util", "../FilteredDataSource"], function (___SearchQuery, ___Formatter, sinaUtil, ___FilteredDataSource) {
  "use strict";

  const SearchQuery = ___SearchQuery["SearchQuery"];
  const Formatter = ___Formatter["Formatter"];
  const FilteredDataSource = ___FilteredDataSource["FilteredDataSource"];
  class HierarchyResultSetFormatter extends Formatter {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    initAsync() {
      return Promise.resolve();
    }
    format(resultSet) {
      return resultSet;
    }
    async formatAsync(resultSet) {
      // check feature flag: title links, tooltips, attribute links are only generated in case the breadcrumb is switched on
      if (!resultSet.sina.configuration.FF_hierarchyBreadcrumbs) {
        return resultSet;
      }

      // Only reformat search results instead of facet items in show more dialog
      // The second condition is to exclude hierarchy facets which also send SearchQuery
      if (!(resultSet.query instanceof SearchQuery)) {
        return resultSet;
      }

      // check that there is a hierarchy datasource
      const dataSource = resultSet.query.filter.dataSource;
      const hierarchyDataSource = dataSource.getHierarchyDataSource();
      if (!hierarchyDataSource) {
        return resultSet;
      }
      const staticHierarchyAttributeMetadata = dataSource.getStaticHierarchyAttributeMetadata();
      if (!staticHierarchyAttributeMetadata) {
        return resultSet;
      }
      // process all items
      resultSet.items.forEach(resultSetItem => {
        this.processResultSetItem({
          resultSetItem: resultSetItem,
          dataSource: dataSource,
          hierarchyDataSource: hierarchyDataSource,
          staticHierarchyAttributeMetadata: staticHierarchyAttributeMetadata
        });
      });
      return resultSet;
    }
    getHierarchyNodePath(hierarchyNodePaths, hierarchyAttributeName) {
      if (!hierarchyNodePaths) {
        return;
      }
      for (const hierarchyNodePath of hierarchyNodePaths) {
        if (hierarchyNodePath.name === hierarchyAttributeName) {
          return hierarchyNodePath;
        }
      }
    }
    processResultSetItem(params) {
      this.assembleTitleNavigationTarget(params);
      this.assembleHierarchyAttributeNavigationTarget(params);
    }
    assembleTitleNavigationTarget(params) {
      // determine hierarchy node id of result list item (= folder in DWC) (needed for filter condition)
      const hierarchyNodePath = this.getHierarchyNodePath(params.resultSetItem.hierarchyNodePaths, params.staticHierarchyAttributeMetadata.id);
      if (!hierarchyNodePath || !hierarchyNodePath.path || hierarchyNodePath.path.length < 1) {
        return;
      }
      const lastNode = hierarchyNodePath.path[hierarchyNodePath.path.length - 1];

      // determine static hierarch attribute
      const staticHierarchyAttribute = params.resultSetItem.attributesMap[params.staticHierarchyAttributeMetadata.id];

      // assemble title
      const mergedTitleValues = sinaUtil.assembleTitle(params.resultSetItem);

      // assemble navigation target
      params.resultSetItem.setDefaultNavigationTarget(params.resultSetItem.sina.createStaticHierarchySearchNavigationTarget(lastNode.id, mergedTitleValues || staticHierarchyAttribute?.value || "", this.exchangeDataSourceForFilteredDataSource(params.dataSource), "", params.staticHierarchyAttributeMetadata.id));
    }
    assembleHierarchyAttributeNavigationTarget(params) {
      const staticHierarchyAttribute = params.resultSetItem.attributesMap[params.staticHierarchyAttributeMetadata.id];
      if (!staticHierarchyAttribute) {
        return;
      }
      const hierarchyAttributeNavigationTargetLabel = this.constructHierarchyAttributeNavigationTargetLabel(params);
      staticHierarchyAttribute.setDefaultNavigationTarget(params.resultSetItem.sina.createStaticHierarchySearchNavigationTarget(staticHierarchyAttribute.value, hierarchyAttributeNavigationTargetLabel,
      // for filter condition value label
      this.exchangeDataSourceForFilteredDataSource(params.dataSource), hierarchyAttributeNavigationTargetLabel,
      // for targetNavigation label
      params.staticHierarchyAttributeMetadata.id));
      staticHierarchyAttribute.tooltip = this._constructTooltip(params);
    }
    exchangeDataSourceForFilteredDataSource(dataSource) {
      if (dataSource.sina.configuration?.searchInAreaOverwriteMode === true && dataSource instanceof FilteredDataSource) {
        dataSource = dataSource.dataSource;
      }
      return dataSource;
    }
    _constructTooltip(params) {
      // get hierarchy node path
      const hierarchyNodePath = this.getHierarchyNodePath(params.resultSetItem.hierarchyNodePaths, params.staticHierarchyAttributeMetadata.id);
      if (!hierarchyNodePath || !hierarchyNodePath.path || hierarchyNodePath.path.length < 1) {
        return "";
      }
      const path = hierarchyNodePath.path;
      // get last part of path, in folder scenario, it should be the parent folder
      const lastNode = path[path.length - 1];
      // Specific case: if the result item is a folder object, the path includes also the item folder itself
      // then the second last part of the path is the parent folder, we remove the last part of the path
      if (lastNode.id !== params.resultSetItem.attributesMap[params.staticHierarchyAttributeMetadata.id].value) {
        path.splice(path.length - 1, 1);
      }
      // join path parts
      return path.map(path => path.label).join(" / ");
    }
    constructHierarchyAttributeNavigationTargetLabel(params) {
      // get hierarchy node path
      const hierarchyNodePath = this.getHierarchyNodePath(params.resultSetItem.hierarchyNodePaths, params.staticHierarchyAttributeMetadata.id);
      const staticHierarchyAttribute = params.resultSetItem.attributesMap[params.staticHierarchyAttributeMetadata.id];
      if (!hierarchyNodePath || !hierarchyNodePath.path || hierarchyNodePath.path.length < 1 || !staticHierarchyAttribute) {
        return "";
      }
      const path = hierarchyNodePath.path;
      // get last part of path, in folder scenario, it should be the parent folder
      let lastNode = path[path.length - 1];
      // Specific case: if the result item is a folder object, the path includes also the item folder itself
      // then the second last part of the path is the parent folder
      if (lastNode.id !== params.resultSetItem.attributesMap[params.staticHierarchyAttributeMetadata.id].value && path.length > 1) {
        lastNode = path[path.length - 2];
      }
      return lastNode.label || staticHierarchyAttribute.label || "";
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.HierarchyResultSetFormatter = HierarchyResultSetFormatter;
  return __exports;
});
})();