/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../core/util", "./ComparisonOperator", "./Condition", "./ConditionType"], function (util, ___ComparisonOperator, ___Condition, ___ConditionType) {
  "use strict";

  const ComparisonOperator = ___ComparisonOperator["ComparisonOperator"];
  const Condition = ___Condition["Condition"];
  const ConditionType = ___ConditionType["ConditionType"]; // _meta: {
  //     properties: {
  //         operator: {
  //             required: false,
  //             default: function () {
  //                 return this.sina.ComparisonOperator.Eq;
  //             }
  //         },
  //         attribute: {
  //             required: true
  //         },
  //         value: {
  //             required: true
  //         }
  //     }
  // },
  class SimpleCondition extends Condition {
    type = (() => ConditionType.Simple)();
    operator = (() => ComparisonOperator.Eq)();
    attribute;
    isDynamicValue;
    value;
    constructor(properties) {
      super(properties);
      this.operator = properties.operator ?? this.operator;
      this.attribute = properties.attribute ?? this.attribute;
      this.userDefined = properties.userDefined ?? this.userDefined;
      this.isDynamicValue = properties.isDynamicValue ?? false;
      this.value = properties.value ?? this.value;
    }
    clone() {
      return new SimpleCondition({
        operator: this.operator,
        attribute: this.attribute,
        attributeLabel: this.attributeLabel,
        value: this.value,
        valueLabel: this.valueLabel,
        userDefined: this.userDefined,
        isDynamicValue: this.isDynamicValue
      });
    }
    equals(other) {
      if (!(other instanceof SimpleCondition)) {
        return false;
      }
      if (this.attribute !== other.attribute || this.operator !== other.operator) {
        return false;
      }
      if (this.isDynamicValue !== other.isDynamicValue) {
        return false;
      }
      if (this.value instanceof Date && other.value instanceof Date) {
        return this.value.getTime() === other.value.getTime();
      }
      return this.value === other.value;
    }
    containsAttribute(attribute) {
      return this.attribute === attribute;
    }
    _collectAttributes(attributeMap) {
      attributeMap[this.attribute] = true;
    }
    getFirstAttribute() {
      return this.attribute;
    }
    _collectFilterConditions(attribute, filterConditions) {
      if (this.attribute === attribute) {
        filterConditions.push(this);
      }
    }
    removeAttributeConditions(attribute) {
      if (this.attribute === attribute) {
        throw "program error";
      }
      return {
        deleted: false,
        attribute: "",
        value: ""
      };
    }
    toJson() {
      let jsonValue;
      if (this.value instanceof Date) {
        jsonValue = util.dateToJson(this.value);
      } else {
        jsonValue = this.value;
      }
      const result = {
        type: ConditionType.Simple,
        operator: this.operator,
        attribute: this.attribute,
        value: jsonValue,
        valueLabel: this.valueLabel,
        attributeLabel: this.attributeLabel
      };
      if (this.userDefined) {
        result.userDefined = true;
      }
      if (this.isDynamicValue) {
        result.dynamic = this.isDynamicValue;
      }
      return result;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.SimpleCondition = SimpleCondition;
  return __exports;
});
})();