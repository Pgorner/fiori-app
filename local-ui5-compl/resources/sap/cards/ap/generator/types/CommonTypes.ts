/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
export enum ColorIndicator {
	Error = "Error",
	Success = "Good",
	None = "Neutral",
	Warning = "Critical",
	Critical = "Warning",
	Good = "Success",
	Neutral = "None"
}

export type CriticalityValue = {
	activeCalculation?: boolean;
	name?: string;
	deviationRangeLowValue?: string;
	deviationRangeHighValue?: string;
	toleranceRangeLowValue?: string;
	toleranceRangeHighValue?: string;
	improvementDirection?: string;
};
