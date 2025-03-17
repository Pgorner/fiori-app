/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import { ColorIndicator, CriticalityValue } from "../types/CommonTypes";
/**
 *
 * @param sPropertyValue
 * @returns true if the property value is a binding
 */
export function isBinding(sPropertyValue: string) {
	return sPropertyValue && sPropertyValue.startsWith("{") && sPropertyValue.endsWith("}");
}

/**
 * To determine if the given value is a activation `CriticalityValue`.
 *
 * @param {CriticalityValue | string} value - The value to check.
 * @returns {value is CriticalityValue} True if the value is a `CriticalityValue`, false otherwise.
 */
function isActiveCalculation(value: CriticalityValue | string): value is CriticalityValue {
	return (value as CriticalityValue).activeCalculation === true;
}

/**
 * Retrieves the color representation for a given criticality value or string.
 *
 * @param {CriticalityValue | string} criticalityValue - The criticality value or string to evaluate.
 * @returns {string | undefined} The formatted string representing the color, or undefined if the input is not valid.
 */
export function getColorForGroup(criticalityValue: CriticalityValue | string): string | undefined {
	if (criticalityValue) {
		if (isActiveCalculation(criticalityValue)) {
			const staticValues = {
				deviationLow: criticalityValue.deviationRangeLowValue,
				deviationHigh: criticalityValue.deviationRangeHighValue,
				toleranceLow: criticalityValue.toleranceRangeLowValue,
				toleranceHigh: criticalityValue.toleranceRangeHighValue,
				sImprovementDirection: criticalityValue.improvementDirection,
				oCriticalityConfigValues: { None: "None", Negative: "Error", Critical: "Warning", Positive: "Success" }
			};
			return "{= extension.formatters.formatValueColor(${" + criticalityValue.name + "}," + JSON.stringify(staticValues) + ") }";
		} else if (criticalityValue.includes("extension.formatters.formatCriticality")) {
			return criticalityValue;
		} else if (isBinding(criticalityValue)) {
			return "{= extension.formatters.formatCriticality($" + criticalityValue + ", 'state') }";
		}
		return ColorIndicator[criticalityValue as keyof typeof ColorIndicator];
	}
}
