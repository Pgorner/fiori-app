/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../sina/ComparisonOperator", "./typeConverter", "../../sina/ComplexCondition", "../../sina/SimpleCondition", "../../core/errors", "./ComparisonOperator", "../../sina/LogicalOperator"], function (____sina_ComparisonOperator, typeConverter, ____sina_ComplexCondition, ____sina_SimpleCondition, ____core_errors, ___ComparisonOperator, ____sina_LogicalOperator) {
  "use strict";

  const ComparisonOperator = ____sina_ComparisonOperator["ComparisonOperator"];
  const ComplexCondition = ____sina_ComplexCondition["ComplexCondition"];
  const SimpleCondition = ____sina_SimpleCondition["SimpleCondition"];
  const InBetweenConditionInConsistent = ____core_errors["InBetweenConditionInConsistent"];
  const UnknownComparisonOperatorError = ____core_errors["UnknownComparisonOperatorError"];
  const ABAPODataComparisonOperator = ___ComparisonOperator["ABAPODataComparisonOperator"];
  const LogicalOperator = ____sina_LogicalOperator["LogicalOperator"];
  class ConditionSerializer {
    dataSource;
    constructor(dataSource) {
      this.dataSource = dataSource;
    }
    convertSinaToOdataOperator(sinaOperator) {
      switch (sinaOperator) {
        case ComparisonOperator.Eq:
          return "EQ";
        case ComparisonOperator.Lt:
          return "LT";
        case ComparisonOperator.Gt:
          return "GT";
        case ComparisonOperator.Le:
          return "LE";
        case ComparisonOperator.Ge:
          return "GE";
        case ComparisonOperator.Co:
          return "EQ";
        case ComparisonOperator.Bw:
          return "EQ";
        case ComparisonOperator.Ew:
          return "EQ";
        case LogicalOperator.And:
          return "AND";
        case LogicalOperator.Or:
          return "OR";
        default:
          throw new UnknownComparisonOperatorError(sinaOperator);
      }
    }
    serializeComplexCondition(condition) {
      const result = {
        ActAsQueryPart: false,
        Id: 1,
        OperatorType: this.convertSinaToOdataOperator(condition.operator),
        SubFilters: []
      };
      const actAsQueryPartPath = "Schema[Namespace=ESH_SEARCH_SRV]>EntityType[Name=SearchFilter]>Property[Name=ActAsQueryPart]";
      if (condition.sina.provider.isQueryPropertySupported(actAsQueryPartPath)) {
        result.ActAsQueryPart = true;
      }
      const subConditions = condition.conditions;
      for (let i = 0; i < subConditions.length; ++i) {
        const subCondition = subConditions[i];
        result.SubFilters.push(this.serialize(subCondition));
      }
      return result;
    }
    serializeSimpleCondition(condition) {
      const metadata = this.dataSource.getAttributeMetadata(condition.attribute);
      const type = metadata.type;
      const conditionObj = {
        ConditionAttribute: condition.attribute,
        ConditionOperator: this.convertSinaToOdataOperator(condition.operator),
        ConditionValue: condition.isDynamicValue ? condition.value : typeConverter.sina2Odata(type, condition.value, {
          operator: condition.operator
        }),
        SubFilters: []
      };
      return conditionObj;
    }
    serializeBetweenCondition(condition) {
      let valueLow;
      let valueHigh;
      const rangeStartCondition = condition.conditions[0];
      const rangeEndCondition = condition.conditions[1];
      if (rangeStartCondition instanceof SimpleCondition && rangeEndCondition instanceof SimpleCondition) {
        const metadata = this.dataSource.getAttributeMetadata(rangeStartCondition.attribute);
        const type = metadata.type;
        if (rangeStartCondition.operator === ComparisonOperator.Ge) {
          valueLow = rangeStartCondition.value;
          valueHigh = rangeEndCondition.value;
        } else {
          valueLow = rangeEndCondition.value;
          valueHigh = rangeStartCondition.value;
        }
        const conditionObj = {
          ConditionAttribute: rangeStartCondition.attribute,
          ConditionOperator: ABAPODataComparisonOperator.Bt,
          ConditionValue: typeConverter.sina2Odata(type, valueLow),
          ConditionValueHigh: typeConverter.sina2Odata(type, valueHigh),
          SubFilters: []
        };
        return conditionObj;
      }
      throw new InBetweenConditionInConsistent();
    }
    serialize(condition) {
      if (condition instanceof ComplexCondition) {
        if (condition.operator === LogicalOperator.And && condition.conditions[0] && (condition.conditions[0].operator === ComparisonOperator.Ge || condition.conditions[0].operator === ComparisonOperator.Gt || condition.conditions[0].operator === ComparisonOperator.Le || condition.conditions[0].operator === ComparisonOperator.Lt)) {
          if (condition.conditions.length === 1) {
            // condition example: "" ... "100"
            return this.serializeSimpleCondition(condition.conditions[0]);
          }
          // condition example: "10" ... "100"
          return this.serializeBetweenCondition(condition);
        }
        return this.serializeComplexCondition(condition);
      }
      // condition example: "USA"
      if (condition instanceof SimpleCondition) {
        return this.serializeSimpleCondition(condition);
      }
    }
  }
  function serialize(dataSource, condition) {
    const serializer = new ConditionSerializer(dataSource);
    return serializer.serialize(condition);
  }
  var __exports = {
    __esModule: true
  };
  __exports.serialize = serialize;
  return __exports;
});
})();