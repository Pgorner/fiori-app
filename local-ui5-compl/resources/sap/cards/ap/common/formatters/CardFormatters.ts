/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import whitespaceReplacer from "sap/base/strings/whitespaceReplacer";
import { ValueColor } from "sap/m/library";
import UI5Date from "sap/ui/core/date/UI5Date";
import DateFormat from "sap/ui/core/format/DateFormat";
import NumberFormat from "sap/ui/core/format/NumberFormat";
import { ValueState } from "sap/ui/core/library";
import IntegrationUtils from "sap/ui/integration/util/Utils";

const CriticalityConstants = {
	StateValues: {
		None: "None",
		Negative: "Error",
		Critical: "Warning",
		Positive: "Success"
	},
	ColorValues: {
		None: "Neutral",
		Negative: "Error",
		Critical: "Critical",
		Positive: "Good"
	}
};

const CriticalityTypes = {
	Negative: "UI.CriticalityType/Negative",
	Critical: "UI.CriticalityType/Critical",
	Positive: "UI.CriticalityType/Positive",
	Information: "UI.CriticalityType/Information"
};

type Criticality = {
	EnumMember: string;
};

type CriticalityState = {
	None: string;
	Negative: string;
	Critical: string;
	Positive: string;
};

type KPIFormatterConfig = {
	NumberOfFractionalDigits: number;
	percentageAvailable: boolean;
};

type CurrencyFormatterConfig = {
	scaleFactor: number;
	numberOfFractionalDigits: number;
};

type TargetFormatterConfig = {
	NumberOfFractionalDigits: number;
	manifestTarget: number;
};

type TrendIconFormatterConfig = {
	bIsRefValBinding: boolean;
	bIsDownDiffBinding: boolean;
	bIsUpDiffBinding: boolean;
	referenceValue: number;
	downDifference: number;
	upDifference: number;
};

export type DateFormatterConfig = {
	UTC: boolean;
};

export type NumberFormatterConfig = {
	numberOfFractionalDigits: number;
	style: string;
	showScale: boolean;
	scaleFactor: number;
	maxFractionDigits: number;
	minFractionDigits: number;
	shortRefNumber: number;
};

export type ValueColorFormatterConfig = {
	sImprovementDirection: string;
	bIsDeviationLowBinding: boolean;
	bIsDeviationHighBinding: boolean;
	bIsToleranceLowBinding: boolean;
	bIsToleranceHighBinding: boolean;
	deviationLow: number;
	deviationHigh: number;
	toleranceLow: number;
	toleranceHigh: number;
	oCriticalityConfigValues: CriticalityState;
};

/**
 * Checks if the provided string ends with the specified suffix.
 *
 *  @param {string} value The string to check.
 *  @param {string} suffix The suffix to look for.
 *  @return {string | boolean} Returns true if the string ends with the suffix, otherwise false.
 *
 */
const endsWith = function (value: string, suffix: string): boolean {
	if (!value || !suffix) {
		return false;
	}

	return value.indexOf(suffix, value.length - suffix.length) !== -1;
};

/**
 * Returns the criticality state for the provided criticality value.
 *
 * @param {Criticality | undefined} criticality - The criticality value containing an EnumMember with criticality values.
 * @param {CriticalityState | undefined} criticalityState - The criticality state values for the criticality values.
 * @return {string} - The criticality state for the provided criticality value.
 */
const criticality2state = function (criticality: Criticality, criticalityState: CriticalityState | undefined): string {
	if (!criticalityState) {
		return "";
	}

	const val = criticality?.EnumMember || "";
	if (endsWith(val, "Negative")) {
		return criticalityState.Negative;
	} else if (endsWith(val, "Critical")) {
		return criticalityState.Critical;
	} else if (endsWith(val, "Positive")) {
		return criticalityState.Positive;
	}

	return criticalityState.None || "";
};

/**
 * Returns the trend icon for the provided aggregate value.
 *
 * @param {number | string} aggregateValue - The value provided to get the trend icon based on the values of referenceValue, downDifferenceValue, and upDifferenceValue.
 * @param {number} referenceValue - The reference value used to calculate the trend direction.
 * @param {number} downDifferenceValue - The threshold for determining a "Down" trend.
 * @param {number} upDifferenceValue - The threshold for determining an "Up" trend.
 * @return {string | undefined} - Returns the trend icon for the provided aggregate value.
 */
const calculateTrendDirection = function (
	aggregateValue: number | string,
	referenceValue: number,
	downDifferenceValue: number,
	upDifferenceValue: number
): string | undefined {
	if (!aggregateValue || !referenceValue) {
		return undefined;
	}

	const value = Number(aggregateValue);
	if (!upDifferenceValue && value - referenceValue >= 0) {
		return "Up";
	}
	if (!downDifferenceValue && value - referenceValue <= 0) {
		return "Down";
	}
	if (referenceValue && upDifferenceValue && value - referenceValue >= upDifferenceValue) {
		return "Up";
	}
	if (referenceValue && downDifferenceValue && value - referenceValue <= downDifferenceValue) {
		return "Down";
	}

	return undefined;
};

/**
 * Returns the criticality state for the provided value.
 *
 *  @param  {number} value value provided for which criticality state is returned based on the improvement direction value provided
 *  @param  {string} improvementDirection If this value is Minimize/Minimizing, toleranceHigh/deviationHigh will be used for getting criticality state
									If this value is Maximize/Maximizing, toleranceLow/deviationLow will be used for getting criticality state
									If this value is Target, toleranceLow,toleranceHigh /deviationLow,deviationHigh will be used for getting criticality state
 *  @param  {string | number} deviationLowValue value provided used in getting criticality state when improvement direction is Maximize/Maximizing
 *  @param  {string | number} deviationHighValue value provided used in getting criticality state when improvement direction is Minimize/Minimizing
 *  @param  {string | number} toleranceLowValue  value provided used in getting criticality state when improvement direction is Maximize/Maximizing
 *  @param  {string | number} toleranceHighValue value provided used in getting criticality state when improvement direction is Minimize/Minimizing
 *  @param  {CriticalityState} criticalityState will have criticality state values for EnumMember of oCriticality provided to criticality2state()
 *  @return {string | undefined} returns criticality state for the value provided based on the improvement direction value provided
 *
 */
const calculateCriticalityState = function (
	value: number,
	improvementDirection: string,
	deviationLowValue: string | number,
	deviationHighValue: string | number,
	toleranceLowValue: string | number,
	toleranceHighValue: string | number,
	criticalityState: CriticalityState
): string {
	const criticality = {
		EnumMember: "None"
	};

	/*
	 * Consider fallback values for optional threshold values in criticality calculation
	 * after considering fallback values if all the values required for calculation are not present then the criticality will be neutral
	 * example - in case of maximizing
	 * if deviationLowValue is mentioned and toleranceLowValue not mentioned, then toleranceLowValue = deviationLowValue
	 * if toleranceLowValue is mentioned and deviationLowValue not mentioned, then deviationLowValue = Number.NEGATIVE_INFINITY
	 * if both values are not mentioned then there will not be any calculation and criticality will be neutral
	 *
	 */
	const minValue = Number.NEGATIVE_INFINITY;
	const maxValue = Number.POSITIVE_INFINITY;
	let toleranceHigh = typeof toleranceHighValue === "string" ? parseFloat(toleranceHighValue) : toleranceHighValue;
	let deviationHigh = typeof deviationHighValue === "string" ? parseFloat(deviationHighValue) : deviationHighValue;
	let toleranceLow = typeof toleranceLowValue === "string" ? parseFloat(toleranceLowValue) : toleranceLowValue;
	let deviationLow = typeof deviationLowValue === "string" ? parseFloat(deviationLowValue) : deviationLowValue;

	if (!toleranceLow && toleranceLow !== 0 && (deviationLow || deviationLow === 0)) {
		toleranceLow = deviationLow;
	}
	if (!toleranceHigh && toleranceHigh !== 0 && (deviationHigh || deviationHigh === 0)) {
		toleranceHigh = deviationHigh;
	}
	if (!deviationLow && deviationLow !== 0) {
		deviationLow = minValue;
	}
	if (!deviationHigh && deviationHigh !== 0) {
		deviationHigh = maxValue;
	}

	// number could be a zero number so check if it is not undefined
	/* eslint-disable  @typescript-eslint/no-unnecessary-condition */
	if (value !== undefined) {
		value = Number(value);
		if (endsWith(improvementDirection, "Minimize") || endsWith(improvementDirection, "Minimizing")) {
			if ((toleranceHigh || toleranceHigh === 0) && (deviationHigh || deviationHigh === 0)) {
				if (value <= toleranceHigh) {
					criticality.EnumMember = "Positive";
				} else if (value > deviationHigh) {
					criticality.EnumMember = "Negative";
				} else {
					criticality.EnumMember = "Critical";
				}
			}
		} else if (endsWith(improvementDirection, "Maximize") || endsWith(improvementDirection, "Maximizing")) {
			if ((toleranceLow || toleranceLow === 0) && (deviationLow || deviationLow === 0)) {
				if (value >= toleranceLow) {
					criticality.EnumMember = "Positive";
				} else if (value < deviationLow) {
					criticality.EnumMember = "Negative";
				} else {
					criticality.EnumMember = "Critical";
				}
			}
		} else if (endsWith(improvementDirection, "Target")) {
			if (
				(toleranceHigh || toleranceHigh === 0) &&
				(deviationHigh || deviationHigh === 0) &&
				(toleranceLow || toleranceLow === 0) &&
				(deviationLow || deviationLow === 0)
			) {
				if (value >= toleranceLow && value <= toleranceHigh) {
					criticality.EnumMember = "Positive";
				} else if (value < deviationLow || value > deviationHigh) {
					criticality.EnumMember = "Negative";
				} else {
					criticality.EnumMember = "Critical";
				}
			}
		}
	}
	return criticality2state(criticality, criticalityState);
};

/**
 * Returns formatted KPI value.
 *
 * @param {string} value
 * @param {KPIFormatterConfig} formatterOptions
 * @param {boolean} isUnit - Determines the formatting style based on percentage availability.
 * @return {string} - Returns formatted KPI value.
 */
const formatKPIValue = function (value: string, formatterOptions: KPIFormatterConfig, isUnit: boolean): string {
	const kpiValue = Number(value);
	const floatFormatterInstance = NumberFormat.getFloatInstance({
		minFractionDigits: formatterOptions.NumberOfFractionalDigits,
		maxFractionDigits: formatterOptions.NumberOfFractionalDigits,
		style: "short",
		showScale: true,
		shortRefNumber: kpiValue
	});
	const formattedValue = floatFormatterInstance.format(kpiValue),
		numberScale = floatFormatterInstance.getScale() || "";

	if (!isUnit && formattedValue) {
		const sLastNumber = formattedValue[formattedValue.length - 1];
		return sLastNumber === numberScale ? formattedValue.slice(0, formattedValue.length - 1) : formattedValue;
	}

	if (isUnit) {
		return formatterOptions.percentageAvailable ? `${numberScale}%` : numberScale;
	}

	return "";
};

/**
 * Returns formatted date value based on the provided pattern.
 *
 * @param {string} value - The value to be formatted. If 'YYYYM', pattern is 'yearmonth', <M> no of months will be added to the <YYYY> in the date formatted.
 *                                   If 'YYYYQ', pattern is 'yearquarter', <Q> no of quarters will be added to the <YYYY> in the date formatted.
 *                                   If 'YYYYW', pattern is 'yearweek', <W> no of weeks will be added to the <YYYY> in the date formatted.
 * @param {string} pattern - The pattern provided which can be 'yearmonth', 'yearquarter', or 'yearweek'.
 * @return {UI5Date | Date | undefined} - Returns formatted date value based on the provided pattern.
 */
const formatDateValue = function (value: string, pattern: string): UI5Date | Date | undefined {
	let result;
	let year: number, month: number;

	switch (pattern) {
		case "yearmonth":
			year = parseInt(value.substring(0, 4), 10);
			month = parseInt(value.substring(4), 10) - 1; // month attribute in Date constructor is 0-based
			result = UI5Date.getInstance(Date.UTC(year, month));
			break;
		case "yearquarter":
			year = parseInt(value.substring(0, 4), 10);
			month = parseInt(value.substring(4), 10) * 3 - 3; // month attribute in Date constructor is 0-based
			result = UI5Date.getInstance(Date.UTC(year, month));
			break;
		case "yearweek":
			year = parseInt(value.substring(0, 4), 10);
			const startofWeekDay = 1 + (parseInt(value.substring(4), 10) - 1) * 7; // 1st of January + 7 days for each week
			result = UI5Date.getInstance(Date.UTC(year, 0, startofWeekDay));
			break;
		default:
			result = undefined;
			break;
	}

	return result;
};

/**
 * Returns formatted target value.
 *
 * @param {number} kpiValue - The KPI value provided which will be taken as scale factor when it is not zero.
 * @param {number} targetValue - The target value provided which will be formatted based on the number of fractional digits & scale factor.
 *                                If this is undefined, manifestTarget of formatterOptions will be used as value to be formatted.
 *                                This will be taken as scale factor when KPI value provided is zero.
 * @param {TargetFormatterConfig} formatterOptions - Can have manifestTarget and will have NumberOfFractionalDigits.
 * @return {string | undefined} - Returns formatted target value based on provided KPI value and target value.
 */
const targetValueFormatter = function (kpiValue: number, targetValue: number, formatterOptions: TargetFormatterConfig): string | undefined {
	if (isNaN(Number(kpiValue))) {
		return "";
	}

	const scaleFactor = kpiValue === 0 ? targetValue : kpiValue;
	const value = targetValue ?? formatterOptions.manifestTarget;
	let fractionalDigits = Number(formatterOptions.NumberOfFractionalDigits) ?? 0;

	fractionalDigits = Math.max(0, Math.min(fractionalDigits, 2));

	if (value) {
		const numberFormatter = NumberFormat.getFloatInstance({
			minFractionDigits: fractionalDigits,
			maxFractionDigits: fractionalDigits,
			style: "short",
			showScale: true,
			shortRefNumber: scaleFactor
		});
		return numberFormatter.format(+value);
	}

	return undefined;
};

/**
 *  Returns the criticality state for the provided value.
 *
 *  @param  {number} value value provided to get the criticality state based on properties of staticValues provided
 *  @param  {ValueColorFormatterConfig} formatterOptions will have values of improvement direction, bIsDeviationLowBinding, bIsDeviationHighBinding, bIsToleranceLowBinding, bIsToleranceHighBinding, deviationLow, deviationHigh, toleranceLow, toleranceHigh, oCriticalityConfigValues
 *  @param  {number} defaultValue value for deviationLow, deviationHigh, toleranceLow, toleranceHigh which will be provided to calculateCriticalityState(), when bIsDeviationLowBinding, bIsDeviationHighBinding, bIsToleranceLowBinding, bIsToleranceHighBinding informatterOptions is true
 *  @return {string | undefined} returns criticality state for the value provided
 *
 */
const formatValueColor = function (value: number, formatterOptions: ValueColorFormatterConfig, defaultValue: number): string {
	return calculateCriticalityState(
		value,
		formatterOptions.sImprovementDirection,
		formatterOptions.bIsDeviationLowBinding ? defaultValue : formatterOptions.deviationLow,
		formatterOptions.bIsDeviationHighBinding ? defaultValue : formatterOptions.deviationHigh,
		formatterOptions.bIsToleranceLowBinding ? defaultValue : formatterOptions.toleranceLow,
		formatterOptions.bIsToleranceHighBinding ? defaultValue : formatterOptions.toleranceHigh,
		formatterOptions.oCriticalityConfigValues
	);
};

/**
 * Returns the trend icon for the provided value.
 *
 * @param {number | string} value - The value provided which will be passed to calculateTrendDirection() to get trend icon based on properties of formatterOptions provided.
 * @param {TrendIconFormatterConfig} formatterOptions - Contains properties referenceValue, downDifference, upDifference which will be provided for formatTrendIcon() to get trend icon.
 * @param {number} defaultValue - The default value for referenceValue, downDifference, upDifference in calculateTrendDirection(), when their respective bindings in formatterOptions are true.
 * @return {string | undefined} - Returns trend icon for the value provided.
 */
const formatTrendIcon = function (
	value: number | string,
	formatterOptions: TrendIconFormatterConfig,
	defaultValue: number
): string | undefined {
	return calculateTrendDirection(
		value,
		formatterOptions.bIsRefValBinding ? defaultValue : formatterOptions.referenceValue,
		formatterOptions.bIsDownDiffBinding ? defaultValue : formatterOptions.downDifference,
		formatterOptions.bIsUpDiffBinding ? defaultValue : formatterOptions.upDifference
	);
};

/**
 * Returns formatted values of value1 & value2 provided, depending on values of formatterOptions.
 *
 * @param {string} value1 - Will be formatted based on values of formatterOptions & displayed if 0 is included in textFragments array.
 * @param {string} value2 - Will be formatted based on values of formatterOptions & displayed if 1 is included in textFragments array.
 * @param {NumberFormatterConfig | undefined} formatterOptions - Will have properties numberOfFractionalDigits, style, showScale, scaleFactor.
 * @param {Array<number>} textFragments - If provided array includes [1, 0] formatted values of value2, value1 will be displayed in that order.
 * @return {string} - Returns formatted values of value1 & value2 provided, depending on values of formatterOptions.
 */
const formatNumber = function (
	value1: string,
	value2: string,
	formatterOptions: NumberFormatterConfig | undefined,
	textFragments: Array<number>
): string {
	let formatterInstance;

	if (formatterOptions) {
		const { numberOfFractionalDigits = 0, style = "short", showScale = true, scaleFactor } = formatterOptions;

		formatterInstance = NumberFormat.getFloatInstance({
			minFractionDigits: numberOfFractionalDigits,
			maxFractionDigits: numberOfFractionalDigits,
			style,
			showScale,
			shortRefNumber: scaleFactor
		});
	}

	const parts: Array<string> = [
		!isNaN(parseFloat(value1)) && formatterInstance ? formatterInstance.format(parseFloat(value1)) : value1,
		!isNaN(parseFloat(value2)) && formatterInstance ? formatterInstance.format(parseFloat(value2)) : value2
	];

	return textFragments.reduce(function (value, textFragment) {
		return value + (typeof textFragment === "number" ? parts[textFragment] : textFragment);
	}, "");
};

/**
 * Returns criticality values depending on provided sCriticality and type values.
 *
 * @param {string | number} criticalityValue - The value provided to get the criticality state.
 * @param {string} type - State criticality values will be returned if this value is 'state', color criticality values will be returned if this value is 'color'.
 * @return {string | undefined} - Returns criticality values based on provided criticality and type values.
 */
const formatCriticality = function (criticalityValue: string | number, type: string): string | undefined {
	const criticality = String(criticalityValue);

	if (type === "state") {
		switch (criticality) {
			case "1":
			case "Error":
				return ValueState.Error;
			case "2":
			case "Warning":
			case "Critical":
				return ValueState.Warning;
			case "3":
			case "Success":
			case "Good":
				return ValueState.Success;
			case "4":
			case "Information":
				return ValueState.Information;
			default:
				return ValueState.None;
		}
	}

	if (type === "color") {
		switch (criticality) {
			case "1":
			case "Error":
				return ValueColor.Error;
			case "2":
			case "Critical":
				return ValueColor.Critical;
			case "3":
			case "Good":
				return ValueColor.Good;
			case "4":
			case "Neutral":
				return ValueColor.Neutral;
			default:
				return ValueColor.None;
		}
	}

	return undefined;
};

/**
 * Returns formatted percentage value.
 *
 * @param {string} value - The string value provided which will be appended with a percentage symbol.
 * @return {string} - Returns the string formatted with a percentage symbol.
 */
const formatWithPercentage = function (value?: string): string {
	return value ? `${value} %` : "";
};

/**
 * Returns computed percentage value.
 *
 * @param {string | number} value - Value to be divided by the target provided.
 * @param {string | number} target - Target provided to divide the value provided to compute percentage.
 * @param {string} [isUnit] - Optional parameter, when '%' is provided target is not used to calculate percentage.
 * @return {string} - Returns percentage value computed.
 */
const computePercentage = function (value: string | number, target: string | number, isUnit?: string): string | undefined {
	let percentValue: string;

	if (value === undefined) {
		return "0";
	}

	const numerator: number = typeof value === "string" ? parseFloat(value) : value;
	const denominator: number = typeof target === "string" ? parseFloat(target) : target;
	if (isUnit === "%") {
		if (numerator > 100) {
			percentValue = "100";
		} else if (numerator <= 0) {
			percentValue = "0";
		} else {
			percentValue = typeof value === "string" ? value : value.toString();
		}
	} else if (numerator > denominator) {
		percentValue = "100";
	} else if (numerator <= 0) {
		percentValue = "0";
	} else {
		percentValue = numerator && denominator ? ((numerator / denominator) * 100).toString() : "0";
	}

	return percentValue;
};

/**
 * Returns message for the provided criticality state.
 *
 * @param {string | number} value - Criticality state provided.
 * @return {string | undefined} - Returns criticality icon message based on the provided criticality state.
 */
const formatCriticalityIcon = function (value?: string | number): string {
	switch (value) {
		case CriticalityTypes.Negative:
		case "1":
		case 1:
			return "sap-icon://message-error";
		case CriticalityTypes.Critical:
		case "2":
		case 2:
			return "sap-icon://message-warning";
		case CriticalityTypes.Positive:
		case "3":
		case 3:
			return "sap-icon://message-success";
		case CriticalityTypes.Information:
		case "5":
		case 5:
			return "sap-icon://message-information";
		default:
			return "";
	}
};

/**
 * Returns criticality button type based on the criticality state provided.
 *
 * @param {string | number} val - Criticality state provided.
 * @return {string} - Returns criticality button type based on the provided criticality state.
 */
const formatCriticalityButtonType = function (val?: string | number): string {
	switch (val) {
		case CriticalityTypes.Negative:
		case "1":
		case 1:
			return "Reject";
		case CriticalityTypes.Positive:
		case "3":
		case 3:
			return "Accept";
		default:
			return "Default";
	}
};

/**
 * Returns formatted string value after replacing tab space \t with a white space & a non-breaking whitespace.
 *
 * @param {string | boolean | number} value - Value provided to be formatted if it's a string; otherwise, the provided value will be returned.
 * @return {string} - Returns formatted string value after replacing tab spaces with a white space & a non-breaking whitespace.
 */
const formatToKeepWhitespace = function (value: string | boolean | number): string {
	return value === null || value === undefined ? "" : whitespaceReplacer(String(value));
};

/**
 * Returns percentage change based on provided kpiValue & targetValue.
 *
 * @param {number | string} kpiValue - The value provided from which target value provided will be subtracted to calculate percentage change.
 * @param {number | string} targetValue - The value provided which will be subtracted from the kpi value provided to calculate percentage change.
 * @param {TargetFormatterConfig} formatterOptions - Contains number of fractional digits to be displayed with percentage change.
 * @return {string | undefined} - Returns calculated percentage change.
 */
const returnPercentageChange = function (
	kpiValue: number | string,
	targetValue: number | string,
	formatterOptions: TargetFormatterConfig
): string | undefined {
	if (isNaN(Number(kpiValue))) {
		return "";
	}

	const kpi = Number(kpiValue);
	let referenceValue;
	if (targetValue) {
		referenceValue = Number(targetValue);
	} else if (formatterOptions.manifestTarget) {
		referenceValue = Number(formatterOptions.manifestTarget);
	} else {
		referenceValue = undefined;
	}

	let fractionalDigits = formatterOptions.NumberOfFractionalDigits ? Number(formatterOptions.NumberOfFractionalDigits) : 0;
	fractionalDigits = Math.max(0, Math.min(fractionalDigits, 2));

	if (referenceValue) {
		const percentNumber = (kpi - referenceValue) / referenceValue;
		const percentFormatterInstance = NumberFormat.getPercentInstance({
			style: "short",
			minFractionDigits: fractionalDigits,
			maxFractionDigits: fractionalDigits,
			showScale: true
		});
		return percentFormatterInstance.format(percentNumber);
	}

	return undefined;
};

/**
 * Returns formatted currency value based on the number of fractional digits, scale factor, currency code text, and currency unit.
 *
 * @param {number} value - Value provided which will be formatted with currency unit and type based on the number of fractional digits & scale factor.
 * @param {CurrencyFormatterConfig} formatterOptions - Contains number of fractional digits & scale factor.
 * @param {boolean} bIncludeText - Determines if the currency type should be appended.
 * @param {string} sCurrency - Currency unit provided, currency value will be prefixed with this currency unit.
 * @param {string} sCurrencyCodeText - Currency type provided, currency value will be suffixed with this currency type if bIncludeText is true.
 * @return {string} - Returns formatted currency value.
 */
const formatCurrency = function (
	value: float,
	formatterOptions: CurrencyFormatterConfig,
	includeText: boolean,
	currency: string,
	currencyCodeText: string
): string {
	value = Number(value);
	const currencyFormatterInstance = NumberFormat.getCurrencyInstance({
		style: "short",
		showMeasure: true,
		shortRefNumber: formatterOptions.scaleFactor,
		minFractionDigits: formatterOptions.numberOfFractionalDigits,
		maxFractionDigits: formatterOptions.numberOfFractionalDigits
	});

	const formattedValue = currencyFormatterInstance.format(value, currency);
	return includeText ? formattedValue + " (" + currencyCodeText + ")" : formattedValue;
};

/**
 * Returns formatted value of provided header count.
 *
 * @param {string | number} sValue - Part of the value provided before separator. Will be rounded off with no of fractional digits 1 & 1000 as scale factor.
 * @return {string | undefined} - Returns formatted header count value.
 */
const formatHeaderCount = function (value: string | number): string | undefined {
	if (value) {
		const integerFormatterInstance = NumberFormat.getIntegerInstance({
			minFractionDigits: 0,
			maxFractionDigits: 1,
			decimalSeparator: ".",
			style: "short"
		});
		return integerFormatterInstance.format(Number(value));
	}

	return undefined;
};

/**
 * Returns formatted value of provided date string.
 *
 * @param {string} dateValue - Date string provided which will be taken & formatted in pattern 'M/d/yy', if no locale value is provided to getInstance() of DateFormat.
 * @param {DateFormatterConfig} formatterOptions - Object having a boolean value which is used to format provided date string with respect to UTC if it is true.
 * @return {string | undefined} - Returns formatted date value based on oLocale & UTC value provided, default oLocale value is "en-US".
 */
const formatDate = function (dateValue: string, formatterOptions: DateFormatterConfig): string | undefined {
	if (dateValue) {
		const oDate = IntegrationUtils.parseJsonDateTime(dateValue);
		return DateFormat.getDateInstance(formatterOptions).format(UI5Date.getInstance(oDate), formatterOptions.UTC);
	}
};

/**
 * Returns criticality state for the provided criticality value.
 *
 * @param {string | number} value - Provided value based on which EnumMember of criticality is selected. This is provided to criticality2state() further to get criticality state.
 * @return {string | undefined} - Returns criticality state for the provided criticality value.
 */
const kpiValueCriticality = function (value: string | number): string {
	const criticality = {
		EnumMember: "None"
	};

	switch (Number(value)) {
		case 1:
			criticality.EnumMember = "Negative";
			break;
		case 2:
			criticality.EnumMember = "Critical";
			break;
		case 3:
			criticality.EnumMember = "Positive";
			break;
		default:
			criticality.EnumMember = "None";
			break;
	}

	return criticality2state(criticality, CriticalityConstants.ColorValues);
};

/**
 * Returns criticality value state for the provided criticality value.
 *
 * @param {string | number} value - Provided value which is used to get criticality value state.
 * @return {string | undefined} - Returns criticality value state for the provided criticality value.
 */
const formatCriticalityValueState = function (value?: string | number): string | undefined {
	switch (value) {
		case CriticalityTypes.Negative:
		case "1":
		case 1:
			return "Error";
		case CriticalityTypes.Critical:
		case "2":
		case 2:
			return "Warning";
		case CriticalityTypes.Positive:
		case "3":
		case 3:
			return "Success";
		case CriticalityTypes.Information:
		case "5":
		case 5:
			return "Information";
		default:
			return "None";
	}
};

/**
 * Returns criticality color value for the provided criticality value.
 *
 * @param {string | number} value - Provided value which is used to get criticality color value.
 * @return {string} - Returns criticality color value for the provided criticality value.
 */
const formatCriticalityColorMicroChart = function (value?: string | number): string {
	switch (value) {
		case CriticalityTypes.Negative:
		case "1":
		case 1:
			return "Error";
		case CriticalityTypes.Critical:
		case "2":
		case 2:
			return "Critical";
		case CriticalityTypes.Positive:
		case "3":
		case 3:
			return "Good";
		default:
			return "Neutral";
	}
};

export const getFormatters = function () {
	return {
		formatKPIValue,
		formatDateValue,
		targetValueFormatter,
		formatValueColor,
		formatTrendIcon,
		formatNumber,
		formatCriticality,
		formatWithPercentage,
		computePercentage,
		formatCriticalityIcon,
		formatCriticalityButtonType,
		formatToKeepWhitespace,
		returnPercentageChange,
		formatCurrency,
		formatHeaderCount,
		formatDate,
		kpiValueCriticality,
		formatCriticalityValueState,
		formatCriticalityColorMicroChart
	};
};
