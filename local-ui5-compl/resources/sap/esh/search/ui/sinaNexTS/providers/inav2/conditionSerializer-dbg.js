/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../core/errors", "../../sina/AttributeType", "../../sina/ComparisonOperator", "../../sina/ComplexCondition", "./typeConverter"], function (____core_errors, ____sina_AttributeType, ____sina_ComparisonOperator, ____sina_ComplexCondition, typeConverter) {
  "use strict";

  const UnknownComparisonOperatorError = ____core_errors["UnknownComparisonOperatorError"];
  const AttributeType = ____sina_AttributeType["AttributeType"];
  const ComparisonOperator = ____sina_ComparisonOperator["ComparisonOperator"];
  const ComplexCondition = ____sina_ComplexCondition["ComplexCondition"];
  class ConditionSerializer {
    dataSource;
    constructor(dataSource) {
      this.dataSource = dataSource;
    }
    convertSinaToInaOperator(sinaOperator) {
      switch (sinaOperator) {
        case ComparisonOperator.Eq:
          return "=";
        case ComparisonOperator.Lt:
          return "<";
        case ComparisonOperator.Gt:
          return ">";
        case ComparisonOperator.Le:
          return "<=";
        case ComparisonOperator.Ge:
          return ">=";
        case ComparisonOperator.Co:
          return "=";
        case ComparisonOperator.Bw:
          return "=";
        case ComparisonOperator.Ew:
          return "=";
        default:
          throw new UnknownComparisonOperatorError(sinaOperator);
      }
    }
    serializeComplexCondition(condition) {
      const result = {
        Selection: {
          Operator: {
            Code: condition.operator,
            SubSelections: []
          }
        }
      };
      const subConditions = condition.conditions;
      for (let i = 0; i < subConditions.length; ++i) {
        const subCondition = subConditions[i];
        result.Selection.Operator.SubSelections.push(this.serialize(subCondition));
      }
      return result;
    }
    serializeSimpleCondition(condition) {
      if (!condition.value) {
        return undefined;
      }

      // get type of attribute in condition
      const attributeId = condition.attribute;
      let type;
      if (attributeId.slice(0, 2) === "$$") {
        type = AttributeType.String;
      } else {
        const metadata = this.dataSource.getAttributeMetadata(attributeId);
        type = metadata.type;
      }

      // set operand
      let operand = "MemberOperand";
      if (attributeId === "$$SuggestionTerms$$" || attributeId === "$$SearchTerms$$") {
        operand = "SearchOperand";
      }

      // assemble condition
      const result = {};
      result[operand] = {
        AttributeName: attributeId,
        Comparison: this.convertSinaToInaOperator(condition.operator),
        Value: typeConverter.sina2Ina(type, condition.value, {
          operator: condition.operator
        })
      };
      return result;
    }
    serialize(condition) {
      if (condition instanceof ComplexCondition) {
        return this.serializeComplexCondition(condition);
      }
      return this.serializeSimpleCondition(condition);
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