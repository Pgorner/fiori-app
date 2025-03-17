/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../sina/DataSource", "../../sina/ComparisonOperator", "../../sina/LogicalOperator", "../../sina/ComplexCondition", "../../sina/AttributeType", "./typeConverter", "./eshObjects/src/index", "../../core/errors", "../../sina/NullValue"], function (____sina_DataSource, ____sina_ComparisonOperator, ____sina_LogicalOperator, ____sina_ComplexCondition, ____sina_AttributeType, typeConverter, ___eshObjects_src_index, ____core_errors, ____sina_NullValue) {
  "use strict";

  const DataSource = ____sina_DataSource["DataSource"];
  const ComparisonOperator = ____sina_ComparisonOperator["ComparisonOperator"];
  const LogicalOperator = ____sina_LogicalOperator["LogicalOperator"];
  const ComplexCondition = ____sina_ComplexCondition["ComplexCondition"];
  const AttributeType = ____sina_AttributeType["AttributeType"];
  const EshObjSearchQueryComparisonOperator = ___eshObjects_src_index["SearchQueryComparisonOperator"];
  const EshObjComparisonOperator = ___eshObjects_src_index["ComparisonOperator"];
  const EshObjNullValue = ___eshObjects_src_index["NullValue"];
  const SearchQueryLogicalOperator = ___eshObjects_src_index["SearchQueryLogicalOperator"];
  const Expression = ___eshObjects_src_index["Expression"];
  const Comparison = ___eshObjects_src_index["Comparison"];
  const Phrase = ___eshObjects_src_index["Phrase"];
  const StringValue = ___eshObjects_src_index["StringValue"];
  // import * as eshObjectsQL from "./eshObjects/src/index";
  const UnknownComparisonOperatorError = ____core_errors["UnknownComparisonOperatorError"];
  const UnknownLogicalOperatorError = ____core_errors["UnknownLogicalOperatorError"];
  const NullValue = ____sina_NullValue["NullValue"];
  class ConditionSerializer {
    dataSource;
    constructor(dataSource) {
      this.dataSource = dataSource;
    }
    convertSinaToOdataOperator(sinaOperator) {
      switch (sinaOperator) {
        case ComparisonOperator.Search:
          return EshObjSearchQueryComparisonOperator.Search;
        case ComparisonOperator.Eq:
          return EshObjSearchQueryComparisonOperator.EqualCaseSensitive;
        case ComparisonOperator.Ne:
          return EshObjSearchQueryComparisonOperator.NotEqualCaseSensitive;
        case ComparisonOperator.Lt:
          return EshObjSearchQueryComparisonOperator.LessThanCaseInsensitive;
        case ComparisonOperator.Gt:
          return EshObjSearchQueryComparisonOperator.GreaterThanCaseInsensitive;
        case ComparisonOperator.Le:
          return EshObjSearchQueryComparisonOperator.LessThanOrEqualCaseInsensitive;
        case ComparisonOperator.Ge:
          return EshObjSearchQueryComparisonOperator.GreaterThanOrEqualCaseInsensitive;
        case ComparisonOperator.Co:
          // Contains only
          return EshObjSearchQueryComparisonOperator.EqualCaseInsensitive;
        case ComparisonOperator.Bw:
          // Begin with
          return EshObjSearchQueryComparisonOperator.EqualCaseInsensitive;
        case ComparisonOperator.Ew:
          // End with
          return EshObjSearchQueryComparisonOperator.EqualCaseInsensitive;
        case ComparisonOperator.DescendantOf:
          return EshObjSearchQueryComparisonOperator.DescendantOf;
        case ComparisonOperator.ChildOf:
          return EshObjSearchQueryComparisonOperator.ChildOf;
        default:
          throw new UnknownComparisonOperatorError(sinaOperator);
      }
    }
    convertSinaToOdataLogicalOperator(sinaOperator) {
      switch (sinaOperator) {
        case LogicalOperator.And:
          return SearchQueryLogicalOperator.AND;
        case LogicalOperator.Or:
          return SearchQueryLogicalOperator.OR;
        case LogicalOperator.Not:
          return SearchQueryLogicalOperator.NOT;
        case LogicalOperator.Row:
          return SearchQueryLogicalOperator.ROW;
        default:
          throw new UnknownLogicalOperatorError(sinaOperator);
      }
    }
    serializeComplexCondition(condition) {
      const result = new Expression({
        operator: this.convertSinaToOdataLogicalOperator(condition.operator),
        items: []
      });
      const subConditions = condition.conditions;
      for (let i = 0; i < subConditions.length; ++i) {
        const subCondition = subConditions[i];
        result.items.push(this.serialize(subCondition));
      }
      return result;
    }
    serializeSimpleCondition(condition) {
      // special handling for null value
      if (condition.value instanceof NullValue && condition.operator === ComparisonOperator.Eq) {
        return new Comparison({
          property: condition.attribute,
          operator: EshObjComparisonOperator.Is,
          value: new EshObjNullValue()
        });
      }
      let type = AttributeType.String;
      let metadata;
      if (this.dataSource instanceof DataSource) {
        metadata = this.dataSource.getAttributeMetadata(condition.attribute);
        if (metadata && metadata.type) {
          type = metadata.type;
        }
      }
      const conditionValue = typeConverter.sina2Odata(type, condition.value, {
        operator: condition.operator
      });
      const conditionOperator = this.convertSinaToOdataOperator(condition.operator);
      return new Comparison({
        property: condition.attribute,
        operator: conditionOperator,
        value: new Phrase({
          phrase: conditionValue
        })
      });
    }
    serializeBetweenCondition(condition) {
      const lowCondition = condition.conditions[0];
      const highCondition = condition.conditions[1];
      let type = AttributeType.String;
      if (this.dataSource instanceof DataSource) {
        const metadata = this.dataSource.getAttributeMetadata(lowCondition.attribute);
        type = metadata.type || AttributeType.String;
      }
      const lowValue = typeConverter.sina2Odata(type, lowCondition.value, {
        operator: lowCondition.operator
      });
      const highValue = typeConverter.sina2Odata(type, highCondition.value, {
        operator: highCondition.operator
      });
      return new Expression({
        operator: SearchQueryLogicalOperator.AND,
        items: [new Comparison({
          property: lowCondition.attribute,
          operator: EshObjSearchQueryComparisonOperator.GreaterThanOrEqualCaseInsensitive,
          value: new StringValue({
            value: lowValue,
            isQuoted: true
          })
        }), new Comparison({
          property: lowCondition.attribute,
          operator: EshObjSearchQueryComparisonOperator.LessThanOrEqualCaseInsensitive,
          value: new StringValue({
            value: highValue,
            isQuoted: true
          })
        })]
      });

      // return new Comparison({
      //     property: lowCondition.attribute,
      //     operator: EshObjComparisonOperator.BetweenCaseInsensitive,
      //     value: new RangeValues({
      //         start: lowValue, // currently only support simple types of string and number, will be improved
      //         end: highValue,
      //     }),
      // });
    }
    serialize(condition) {
      if (condition instanceof ComplexCondition) {
        if (condition.operator === LogicalOperator.And && condition.conditions.length > 1 &&
        // TODO: Enum
        condition.conditions[0] && (condition.conditions[0].operator === ComparisonOperator.Ge || condition.conditions[0].operator === ComparisonOperator.Gt || condition.conditions[0].operator === ComparisonOperator.Le || condition.conditions[0].operator === ComparisonOperator.Lt)) {
          return this.serializeBetweenCondition(condition);
        }
        return this.serializeComplexCondition(condition);
      }
      return this.serializeSimpleCondition(condition);
    }
  }
  function serialize(dataSource, condition) {
    const serializer = new ConditionSerializer(dataSource);
    let result = serializer.serialize(condition);
    if (result instanceof Comparison) {
      result = new Expression({
        operator: SearchQueryLogicalOperator.TIGHT_AND,
        items: [result]
      });
    }
    return result;
  }
  var __exports = {
    __esModule: true
  };
  __exports.ConditionSerializer = ConditionSerializer;
  __exports.serialize = serialize;
  return __exports;
});
})();