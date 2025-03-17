/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./Condition", "./ConditionType", "./LogicalOperator", "./SimpleCondition"], function (___Condition, ___ConditionType, ___LogicalOperator, ___SimpleCondition) {
  "use strict";

  const Condition = ___Condition["Condition"];
  const ConditionType = ___ConditionType["ConditionType"];
  const LogicalOperator = ___LogicalOperator["LogicalOperator"];
  const SimpleCondition = ___SimpleCondition["SimpleCondition"];
  class ComplexCondition extends Condition {
    // _meta: {
    //     properties: {
    //         operator: {
    //             required: false,
    //             default: function () {
    //                 return this.sina.LogicalOperator.And;
    //             }
    //         },
    //         conditions: {
    //             required: false,
    //             default: function () {
    //                 return [];
    //             }
    //         }
    //     }
    // },

    type = (() => ConditionType.Complex)();
    operator = (() => LogicalOperator.And)();
    conditions = [];
    constructor(properties) {
      super(properties);
      this.operator = properties.operator ?? this.operator;
      this.conditions = properties.conditions ?? this.conditions;
    }
    clone() {
      const clonedConditions = [];
      for (let i = 0; i < this.conditions.length; ++i) {
        clonedConditions.push(this.conditions[i].clone());
      }
      return new ComplexCondition({
        sina: this.sina,
        operator: this.operator,
        conditions: clonedConditions,
        valueLabel: this.valueLabel,
        attributeLabel: this.attributeLabel
      });
    }
    equals(other) {
      if (!(other instanceof ComplexCondition)) {
        return false;
      }
      if (this.operator !== other.operator) {
        return false;
      }
      if (this.conditions.length !== other.conditions.length) {
        return false;
      }
      const matchedOtherConditions = {};
      for (let i = 0; i < this.conditions.length; ++i) {
        const condition = this.conditions[i];
        let match = false;
        for (let j = 0; j < other.conditions.length; ++j) {
          if (matchedOtherConditions[j]) {
            continue;
          }
          const otherCondition = other.conditions[j];
          if (condition.equals(otherCondition)) {
            match = true;
            matchedOtherConditions[j] = true;
            break;
          }
        }
        if (!match) {
          return false;
        }
      }
      return true;
    }
    containsAttribute(attribute) {
      for (const condition of this.conditions) {
        if (condition.containsAttribute(attribute)) {
          return true;
        }
      }
      return false;
    }
    _collectAttributes(attributeMap) {
      for (const condition of this.conditions) {
        condition._collectAttributes(attributeMap);
      }
    }
    addCondition(condition) {
      if (!(condition instanceof Condition)) {
        condition = this.sina.createSimpleCondition(condition);
      }
      this.conditions.push(condition);
    }
    removeConditionAt(index) {
      this.conditions.splice(index, 1);
    }
    hasFilters() {
      return this.conditions.length >= 1;
    }
    removeAttributeConditions(attribute) {
      let result = {
        deleted: false,
        attribute: "",
        value: ""
      };
      for (let i = 0; i < this.conditions.length; ++i) {
        const subCondition = this.conditions[i];
        switch (subCondition.type) {
          case ConditionType.Complex:
            result = subCondition.removeAttributeConditions(attribute);
            break;
          case ConditionType.Simple:
            if (subCondition.attribute === attribute) {
              result = {
                deleted: true,
                attribute: subCondition.attribute,
                value: subCondition.value
              };
              this.removeConditionAt(i);
              i--;
            }
            break;
        }
      }
      this.cleanup();
      return result;
    }
    getAttributeConditions(attribute) {
      const results = [];
      const doGetAttributeConditions = function (condition, attributeName) {
        switch (condition.type) {
          case ConditionType.Complex:
            for (let i = 0; i < condition.conditions.length; i++) {
              doGetAttributeConditions(condition.conditions[i], attributeName);
            }
            break;
          case ConditionType.Simple:
            if (condition.attribute === attributeName) {
              results.push(condition);
            }
            break;
        }
      };
      doGetAttributeConditions(this, attribute);
      return results;
    }
    cleanup() {
      let removed = false;
      const doCleanup = function (condition) {
        for (let i = 0; i < condition.conditions.length; ++i) {
          const subCondition = condition.conditions[i];
          switch (subCondition.type) {
            case ConditionType.Complex:
              doCleanup(subCondition);
              if (subCondition.conditions.length === 0) {
                removed = true;
                condition.removeConditionAt(i);
                i--;
              }
              break;
            case ConditionType.Simple:
              break;
          }
        }
      };
      do {
        removed = false;
        doCleanup(this);
      } while (removed);
    }
    resetConditions() {
      this.conditions.splice(0, this.conditions.length);
    }
    getFirstAttribute() {
      if (this.conditions.length === 0) {
        return null;
      }
      // just use first condition
      if (this.conditions[0] instanceof ComplexCondition) {
        return this.conditions[0].getFirstAttribute();
      }
      if (this.conditions[0] instanceof SimpleCondition) {
        return this.conditions[0].getFirstAttribute();
      }
      throw new Error("Condition is neither simple nor complex");
    }
    _collectFilterConditions(attribute, filterConditions) {
      for (const condition of this.conditions) {
        condition._collectFilterConditions(attribute, filterConditions);
      }
    }
    toJson() {
      const result = {
        type: ConditionType.Complex,
        operator: this.operator,
        conditions: [],
        valueLabel: this.valueLabel,
        attributeLabel: this.attributeLabel
      };
      for (let i = 0; i < this.conditions.length; ++i) {
        const condition = this.conditions[i];
        if (condition instanceof ComplexCondition) {
          result.conditions.push(condition.toJson());
        }
        if (condition instanceof SimpleCondition) {
          result.conditions.push(condition.toJson());
        }
      }
      if (this.userDefined) {
        result.userDefined = true;
      }
      return result;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.ComplexCondition = ComplexCondition;
  return __exports;
});
})();