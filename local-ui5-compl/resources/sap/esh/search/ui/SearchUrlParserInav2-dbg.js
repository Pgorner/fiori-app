/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["sap/m/MessageBox", "./error/errors", "./i18n"], function (MessageBox, __errors, __i18n) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const errors = _interopRequireDefault(__errors);
  const i18n = _interopRequireDefault(__i18n);
  function isComplexConditionJSON(conditionJSON) {
    if (conditionJSON && conditionJSON.conditions) {
      return true;
    }
    return false;
  }
  class SearchUrlParserInav2 {
    model;
    constructor(properties) {
      this.model = properties.model;
    }
    async parseUrlParameters(oParametersLowerCased) {
      // top
      if (oParametersLowerCased.top) {
        const top = parseInt(oParametersLowerCased.top, 10);
        this.model.setTop(top, false);
      }

      // datasource
      let dataSource = this.model.sinaNext.allDataSource;
      if (oParametersLowerCased.datasource) {
        const dataSourceJson = JSON.parse(oParametersLowerCased.datasource);
        const dataSourceId = dataSourceJson.ObjectName.value;
        switch (dataSourceJson.Type) {
          case "Category":
            if (dataSourceId === "$$ALL$$") {
              dataSource = this.model.sinaNext.allDataSource;
            } else {
              dataSource = this.model.sinaNext.getDataSource(dataSourceId);
              if (!dataSource) {
                dataSource = this.model.sinaNext.createDataSource({
                  type: this.model.sinaNext.DataSourceType.Category,
                  id: dataSourceId,
                  label: dataSourceJson.label,
                  labelPlural: dataSourceJson.labelPlural
                });
              }
            }
            break;
          case "BusinessObject":
            dataSource = this.model.sinaNext.getDataSource(dataSourceId);
            if (!dataSource) {
              dataSource = this.model.sinaNext.allDataSource;
              delete oParametersLowerCased.filter;
              MessageBox.show(i18n.getText("searchUrlParsingErrorLong") + "\n(Unknow datasource " + dataSourceId + ")", {
                icon: MessageBox.Icon.ERROR,
                title: i18n.getText("searchUrlParsingError"),
                actions: [MessageBox.Action.OK]
              });
            }
            break;
          default:
            {
              const internalError = new Error("Unknown datasource type " + dataSourceJson.Type);
              throw new errors.UnknownDataSourceType(internalError);
            }
        }
      }
      await this.model.sinaNext.loadMetadata(dataSource);

      // root condition
      const context = {
        dataSource: dataSource
      };
      let rootCondition;
      if (oParametersLowerCased.filter) {
        try {
          const filterJson = JSON.parse(oParametersLowerCased.filter);
          rootCondition = this.parseCondition(context, filterJson);
        } catch (e) {
          // fallback-filter + send error message
          rootCondition = this.model.sinaNext.createComplexCondition();
          MessageBox.show(i18n.getText("searchUrlParsingErrorLong") + "\n(" + e.toString() + ")", {
            icon: MessageBox.Icon.ERROR,
            title: i18n.getText("searchUrlParsingError"),
            actions: [MessageBox.Action.OK]
          });
        }
      } else {
        rootCondition = this.model.sinaNext.createComplexCondition();
      }

      // filter
      const filter = this.model.sinaNext.createFilter({
        dataSource: dataSource,
        searchTerm: oParametersLowerCased.searchterm,
        rootCondition: rootCondition
      });
      this.model.setProperty("/uiFilter", filter);
      this.model.setDataSource(filter.dataSource, false); // explicitely updata datasource (for categories: update ds list in model)
    }
    parseCondition(context, conditionJson) {
      if (isComplexConditionJSON(conditionJson)) {
        return this.parseComplexCondition(context, conditionJson);
      }
      return this.parseSimpleCondition(context, conditionJson);
    }
    parseComplexCondition(context, conditionJson) {
      const subConditions = [];
      for (let i = 0; i < conditionJson.conditions.length; ++i) {
        const subConditionJson = conditionJson.conditions[i];
        subConditions.push(this.parseCondition(context, subConditionJson));
      }
      return this.model.sinaNext.createComplexCondition({
        operator: conditionJson.operator,
        conditions: subConditions,
        valueLabel: conditionJson.label
      });
    }
    parseSimpleCondition(context, conditionJson) {
      context.attribute = conditionJson.attribute;
      return this.model.sinaNext.createSimpleCondition({
        attribute: conditionJson.attribute,
        attributeLabel: conditionJson.attributeLabel,
        value: this.parseValue(context, conditionJson.value),
        valueLabel: conditionJson.valueLabel || conditionJson.label,
        operator: this.parseOperator(context, conditionJson.operator)
      });
    }
    parseValue(context, value) {
      const metadata = context.dataSource.getAttributeMetadata(context.attribute);
      return this.model.sinaNext.inav2TypeConverter.ina2Sina(metadata.type, value);
    }
    parseOperator(context, operator) {
      switch (operator) {
        case "=":
          return this.model.sinaNext.ComparisonOperator.Eq;
        case ">":
          return this.model.sinaNext.ComparisonOperator.Gt;
        case ">=":
          return this.model.sinaNext.ComparisonOperator.Ge;
        case "<":
          return this.model.sinaNext.ComparisonOperator.Lt;
        case "<=":
          return this.model.sinaNext.ComparisonOperator.Le;
        default:
          throw "Unknown operator " + operator;
      }
    }
  }
  return SearchUrlParserInav2;
});
})();