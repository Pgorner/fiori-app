/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["../types/CommonTypes"], function (___types_CommonTypes) {
  "use strict";

  const ColorIndicator = ___types_CommonTypes["ColorIndicator"];
  /**
   *
   * @param sPropertyValue
   * @returns true if the property value is a binding
   */
  function isBinding(sPropertyValue) {
    return sPropertyValue && sPropertyValue.startsWith("{") && sPropertyValue.endsWith("}");
  }

  /**
   * To determine if the given value is a activation `CriticalityValue`.
   *
   * @param {CriticalityValue | string} value - The value to check.
   * @returns {value is CriticalityValue} True if the value is a `CriticalityValue`, false otherwise.
   */
  function isActiveCalculation(value) {
    return value.activeCalculation === true;
  }

  /**
   * Retrieves the color representation for a given criticality value or string.
   *
   * @param {CriticalityValue | string} criticalityValue - The criticality value or string to evaluate.
   * @returns {string | undefined} The formatted string representing the color, or undefined if the input is not valid.
   */
  function getColorForGroup(criticalityValue) {
    if (criticalityValue) {
      if (isActiveCalculation(criticalityValue)) {
        const staticValues = {
          deviationLow: criticalityValue.deviationRangeLowValue,
          deviationHigh: criticalityValue.deviationRangeHighValue,
          toleranceLow: criticalityValue.toleranceRangeLowValue,
          toleranceHigh: criticalityValue.toleranceRangeHighValue,
          sImprovementDirection: criticalityValue.improvementDirection,
          oCriticalityConfigValues: {
            None: "None",
            Negative: "Error",
            Critical: "Warning",
            Positive: "Success"
          }
        };
        return "{= extension.formatters.formatValueColor(${" + criticalityValue.name + "}," + JSON.stringify(staticValues) + ") }";
      } else if (criticalityValue.includes("extension.formatters.formatCriticality")) {
        return criticalityValue;
      } else if (isBinding(criticalityValue)) {
        return "{= extension.formatters.formatCriticality($" + criticalityValue + ", 'state') }";
      }
      return ColorIndicator[criticalityValue];
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.isBinding = isBinding;
  __exports.getColorForGroup = getColorForGroup;
  return __exports;
});
//# sourceMappingURL=CommonUtils-dbg-dbg.js.map
