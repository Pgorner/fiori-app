/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([], function () {
  "use strict";

  class NavigationTargetTemplate {
    sina;
    navigationTargetGenerator;
    label;
    sourceObjectType;
    targetObjectType;
    conditions;
    _condition;
    constructor(properties) {
      this.sina = properties.sina;
      this.navigationTargetGenerator = properties.navigationTargetGenerator;
      this.label = properties.label;
      this.sourceObjectType = properties.sourceObjectType;
      this.targetObjectType = properties.targetObjectType;
      this.conditions = properties.conditions;
    }
    generate(data) {
      const dataSource = this.sina.getDataSource(this.targetObjectType);
      const filter = this.sina.createFilter({
        dataSource: dataSource,
        searchTerm: "*"
      });
      for (let i = 0; i < this.conditions.length; ++i) {
        const condition = this.conditions[i];
        const filterCondition = this.sina.createSimpleCondition({
          attribute: condition.targetPropertyName,
          attributeLabel: dataSource.getAttributeMetadata(condition.targetPropertyName).label,
          operator: this.sina.ComparisonOperator.Eq,
          value: data[condition.sourcePropertyName].value,
          valueLabel: data[condition.sourcePropertyName].valueFormatted
        });
        filter.autoInsertCondition(filterCondition);
      }
      return this.sina.createNavigationTarget({
        text: this.label,
        targetUrl: this.navigationTargetGenerator.urlPrefix + encodeURIComponent(JSON.stringify(filter.toJson()))
      });
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.NavigationTargetTemplate = NavigationTargetTemplate;
  return __exports;
});
})();