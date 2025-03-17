/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import { getFormatters, NumberFormatterConfig, ValueColorFormatterConfig } from "sap/cards/ap/common/formatters/CardFormatters";
// load required calendar in advance
import "sap/ui/core/date/Gregorian";

describe("Card formatters", () => {
	const cardFormatters = getFormatters();
	enum CriticalityType {
		Negative = "UI.CriticalityType/Negative",
		Critical = "UI.CriticalityType/Critical",
		Positive = "UI.CriticalityType/Positive",
		Information = "UI.CriticalityType/Information"
	}
	test("formatCriticalityValueState: return value state based on criticality type", () => {
		// Negative criticality returns error value state
		expect(cardFormatters.formatCriticalityValueState(CriticalityType.Negative)).toEqual("Error");
		// Critical criticality returns warning value state
		expect(cardFormatters.formatCriticalityValueState(CriticalityType.Critical)).toEqual("Warning");
		// Positive criticality returns success value state
		expect(cardFormatters.formatCriticalityValueState(CriticalityType.Positive)).toEqual("Success");
		// Information criticality returns information value state
		expect(cardFormatters.formatCriticalityValueState(CriticalityType.Information)).toEqual("Information");
		// Empty returns none value state
		expect(cardFormatters.formatCriticalityValueState("")).toEqual("None");
	});

	enum CriticalityType_1 {
		Negative = "UI.CriticalityType/Negative",
		Critical = "UI.CriticalityType/Critical",
		Positive = "UI.CriticalityType/Positive"
	}
	test("formatCriticalityColorMicroChart: return value state based on criticality type", () => {
		// Negative criticality returns error value state
		expect(cardFormatters.formatCriticalityColorMicroChart(CriticalityType_1.Negative)).toEqual("Error");
		// Critical criticality returns critical value state
		expect(cardFormatters.formatCriticalityColorMicroChart(CriticalityType_1.Critical)).toEqual("Critical");
		// Positive criticality returns good value state
		expect(cardFormatters.formatCriticalityColorMicroChart(CriticalityType_1.Positive)).toEqual("Good");
		// Empty returns neutral value state
		expect(cardFormatters.formatCriticalityColorMicroChart("")).toEqual("Neutral");
	});

	test("kpiValueCriticality: returns criticality state based on criticality value", () => {
		expect(cardFormatters.kpiValueCriticality(1)).toEqual("Error");
		expect(cardFormatters.kpiValueCriticality(2)).toEqual("Critical");
		expect(cardFormatters.kpiValueCriticality(3)).toEqual("Good");
		expect(cardFormatters.kpiValueCriticality(4)).toEqual("Neutral");
	});

	test("formatHeaderCount: returns formatted header count value", () => {
		expect(cardFormatters.formatHeaderCount(111167.123)).toEqual("111.2K");
		expect(cardFormatters.formatHeaderCount("111167.123")).toEqual("111.2K");
	});

	test("formatCurrency: returns formatted currency value", () => {
		expect(
			cardFormatters
				.formatCurrency(1000.123, { numberOfFractionalDigits: 2, scaleFactor: 1000 }, true, "$", "USD")
				.replace(/\s+/g, "")
		).toEqual("$1.00K(USD)");
		expect(
			cardFormatters
				.formatCurrency(5631.08, { numberOfFractionalDigits: 1, scaleFactor: 1000 }, false, "$", "USD")
				.replace(/\s+/g, "")
		).toEqual("$5.6K");
	});

	test("returnPercentageChange: returns calculated percentage change", () => {
		expect(cardFormatters.returnPercentageChange("100", "95", { NumberOfFractionalDigits: 1, manifestTarget: 95 })).toEqual("5.3%");
	});

	test("formatToKeepWhitespace: returns formatted string value after replacing tab spaces with a white space & a non breaking whitespace", () => {
		expect(cardFormatters.formatToKeepWhitespace("\t \t Title")).toEqual("      Title");
	});

	enum CriticalityType_2 {
		Negative = "UI.CriticalityType/Negative",
		Positive = "UI.CriticalityType/Positive"
	}
	test("formatCriticalityButtonType: returns criticality button type based on the provided criticality state", () => {
		// Negative criticality returns reject value state
		expect(cardFormatters.formatCriticalityButtonType(CriticalityType_2.Negative)).toEqual("Reject");
		// Positive criticality returns accept value state
		expect(cardFormatters.formatCriticalityButtonType(CriticalityType_2.Positive)).toEqual("Accept");
		// Empty returns default value state
		expect(cardFormatters.formatCriticalityButtonType("4")).toEqual("Default");
	});

	enum CriticalityType_3 {
		Negative = "UI.CriticalityType/Negative",
		Critical = "UI.CriticalityType/Critical",
		Positive = "UI.CriticalityType/Positive",
		Information = "UI.CriticalityType/Information"
	}
	test("formatCriticalityIcon: returns criticality icon message based on the provided criticality state", () => {
		expect(cardFormatters.formatCriticalityIcon(CriticalityType_3.Negative)).toEqual("sap-icon://message-error");
		expect(cardFormatters.formatCriticalityIcon(CriticalityType_3.Critical)).toEqual("sap-icon://message-warning");
		expect(cardFormatters.formatCriticalityIcon(CriticalityType_3.Positive)).toEqual("sap-icon://message-success");
		expect(cardFormatters.formatCriticalityIcon(CriticalityType_3.Information)).toEqual("sap-icon://message-information");
		expect(cardFormatters.formatCriticalityIcon(6)).toEqual("");
	});

	test("computePercentage: returns percentage value computed", () => {
		expect(cardFormatters.computePercentage("95", "100")).toEqual("95");
		expect(cardFormatters.computePercentage(5631.08, 5000, "%")).toEqual("100");
	});

	test("formatWithPercentage: returns the string formatted with percentage", () => {
		expect(cardFormatters.formatWithPercentage("95")).toEqual("95 %");
	});

	test("formatCriticality: returns criticality values based on provided sCriticality, sType values", () => {
		const testCases = [
			{ sCriticality: "1", sType: "state", expected: "Error" },
			{ sCriticality: "2", sType: "state", expected: "Warning" },
			{ sCriticality: "3", sType: "state", expected: "Success" },
			{ sCriticality: "4", sType: "state", expected: "Information" },
			{ sCriticality: "5", sType: "state", expected: "None" },
			{ sCriticality: "1", sType: "color", expected: "Error" },
			{ sCriticality: "2", sType: "color", expected: "Critical" },
			{ sCriticality: "3", sType: "color", expected: "Good" },
			{ sCriticality: "4", sType: "color", expected: "Neutral" },
			{ sCriticality: "5", sType: "color", expected: "None" },
			{ sCriticality: "Error", sType: "state", expected: "Error" },
			{ sCriticality: "Critical", sType: "state", expected: "Warning" },
			{ sCriticality: "Good", sType: "state", expected: "Success" },
			{ sCriticality: "Neutral", sType: "state", expected: "None" },
			{ sCriticality: "None", sType: "state", expected: "None" },
			{ sCriticality: "FalseValue", sType: "NegativeCase", expected: undefined }
		];

		testCases.forEach(({ sCriticality, sType, expected }) => {
			expect(cardFormatters.formatCriticality(sCriticality, sType)).toEqual(expected);
		});
	});

	test("formatNumber: returns formatted values of value1 & value2 provided, depending on values of formatterProperties", () => {
		const formatterProperties: NumberFormatterConfig = {
			numberOfFractionalDigits: 0,
			style: "short",
			showScale: true,
			scaleFactor: 1000,
			maxFractionDigits: 0,
			minFractionDigits: 0,
			shortRefNumber: 1000
		};
		expect(cardFormatters.formatNumber("1000", "2000", formatterProperties, [1])).toEqual("2K");
		expect(cardFormatters.formatNumber("1000", "2000", formatterProperties, [0])).toEqual("1K");
		expect(cardFormatters.formatNumber("1000", "2000", formatterProperties, [1, 0])).toEqual("2K1K");
		expect(cardFormatters.formatNumber("1000", "2000", formatterProperties, [0, 1])).toEqual("1K2K");
	});

	test("formatTrendIcon: returns trend icon for the value provided", () => {
		expect(
			cardFormatters.formatTrendIcon(
				100,
				{
					bIsRefValBinding: false,
					bIsDownDiffBinding: false,
					bIsUpDiffBinding: false,
					referenceValue: 1,
					downDifference: 2,
					upDifference: 3
				},
				1
			)
		).toEqual("Up");
		expect(
			cardFormatters.formatTrendIcon(
				100,
				{
					bIsRefValBinding: false,
					bIsDownDiffBinding: false,
					bIsUpDiffBinding: false,
					referenceValue: 1,
					downDifference: 101,
					upDifference: 100
				},
				1
			)
		).toEqual("Down");
	});

	test("formatValueColor Minimize: returns criticality state for the value provided", () => {
		const formatterProperties: ValueColorFormatterConfig = {
			sImprovementDirection: "Minimize",
			bIsDeviationLowBinding: false,
			bIsDeviationHighBinding: false,
			bIsToleranceLowBinding: false,
			bIsToleranceHighBinding: false,
			deviationLow: 0,
			deviationHigh: 1,
			toleranceLow: 0,
			toleranceHigh: 101,
			oCriticalityConfigValues: { None: "Neutral", Negative: "Error", Critical: "Critical", Positive: "Good" }
		};
		expect(cardFormatters.formatValueColor(100, formatterProperties, 1)).toEqual("Good");
		const formatterProperties_1: ValueColorFormatterConfig = {
			sImprovementDirection: "Minimize",
			bIsDeviationLowBinding: false,
			bIsDeviationHighBinding: false,
			bIsToleranceLowBinding: false,
			bIsToleranceHighBinding: false,
			deviationLow: 0,
			deviationHigh: 1,
			toleranceLow: 0,
			toleranceHigh: 99,
			oCriticalityConfigValues: { None: "Neutral", Negative: "Error", Critical: "Critical", Positive: "Good" }
		};
		expect(cardFormatters.formatValueColor(100, formatterProperties_1, 1)).toEqual("Error");
		const formatterProperties_2: ValueColorFormatterConfig = {
			sImprovementDirection: "Minimize",
			bIsDeviationLowBinding: false,
			bIsDeviationHighBinding: false,
			bIsToleranceLowBinding: false,
			bIsToleranceHighBinding: false,
			deviationLow: 0,
			deviationHigh: 101,
			toleranceLow: 0,
			toleranceHigh: 99,
			oCriticalityConfigValues: { None: "Neutral", Negative: "Error", Critical: "Critical", Positive: "Good" }
		};
		expect(cardFormatters.formatValueColor(100, formatterProperties_2, 1)).toEqual("Critical");
	});

	test("formatValueColor Maximize: returns criticality state for the value provided", () => {
		const formatterProperties: ValueColorFormatterConfig = {
			sImprovementDirection: "Maximize",
			bIsDeviationLowBinding: false,
			bIsDeviationHighBinding: false,
			bIsToleranceLowBinding: false,
			bIsToleranceHighBinding: false,
			deviationLow: 0,
			deviationHigh: 1,
			toleranceLow: 0,
			toleranceHigh: 101,
			oCriticalityConfigValues: { None: "Neutral", Negative: "Error", Critical: "Critical", Positive: "Good" }
		};
		expect(cardFormatters.formatValueColor(100, formatterProperties, 1)).toEqual("Good");
		const formatterProperties_1: ValueColorFormatterConfig = {
			sImprovementDirection: "Maximize",
			bIsDeviationLowBinding: false,
			bIsDeviationHighBinding: false,
			bIsToleranceLowBinding: false,
			bIsToleranceHighBinding: false,
			deviationLow: 101,
			deviationHigh: 0,
			toleranceLow: 101,
			toleranceHigh: 0,
			oCriticalityConfigValues: { None: "Neutral", Negative: "Error", Critical: "Critical", Positive: "Good" }
		};
		expect(cardFormatters.formatValueColor(100, formatterProperties_1, 1)).toEqual("Error");
		const formatterProperties_2: ValueColorFormatterConfig = {
			sImprovementDirection: "Maximize",
			bIsDeviationLowBinding: false,
			bIsDeviationHighBinding: false,
			bIsToleranceLowBinding: false,
			bIsToleranceHighBinding: false,
			deviationLow: 0,
			deviationHigh: 0,
			toleranceLow: 101,
			toleranceHigh: 0,
			oCriticalityConfigValues: { None: "Neutral", Negative: "Error", Critical: "Critical", Positive: "Good" }
		};
		expect(cardFormatters.formatValueColor(100, formatterProperties_2, 1)).toEqual("Critical");
	});

	test("formatValueColor Target: returns criticality state for the value provided", () => {
		const formatterProperties: ValueColorFormatterConfig = {
			sImprovementDirection: "Target",
			bIsDeviationLowBinding: false,
			bIsDeviationHighBinding: false,
			bIsToleranceLowBinding: false,
			bIsToleranceHighBinding: false,
			deviationLow: 0,
			deviationHigh: 1,
			toleranceLow: 0,
			toleranceHigh: 101,
			oCriticalityConfigValues: { None: "Neutral", Negative: "Error", Critical: "Critical", Positive: "Good" }
		};
		expect(cardFormatters.formatValueColor(100, formatterProperties, 1)).toEqual("Good");
		const formatterProperties_1: ValueColorFormatterConfig = {
			sImprovementDirection: "Target",
			bIsDeviationLowBinding: false,
			bIsDeviationHighBinding: false,
			bIsToleranceLowBinding: false,
			bIsToleranceHighBinding: false,
			deviationLow: 101,
			deviationHigh: 0,
			toleranceLow: 101,
			toleranceHigh: 0,
			oCriticalityConfigValues: { None: "Neutral", Negative: "Error", Critical: "Critical", Positive: "Good" }
		};
		expect(cardFormatters.formatValueColor(100, formatterProperties_1, 1)).toEqual("Error");
		const formatterProperties_2: ValueColorFormatterConfig = {
			sImprovementDirection: "Target",
			bIsDeviationLowBinding: false,
			bIsDeviationHighBinding: false,
			bIsToleranceLowBinding: false,
			bIsToleranceHighBinding: false,
			deviationLow: 0,
			deviationHigh: 101,
			toleranceLow: 0,
			toleranceHigh: 99,
			oCriticalityConfigValues: { None: "Neutral", Negative: "Error", Critical: "Critical", Positive: "Good" }
		};
		expect(cardFormatters.formatValueColor(100, formatterProperties_2, 1)).toEqual("Critical");
	});

	test("targetValueFormatter: returns formatted target value based on provided kpi value and target value", () => {
		expect(cardFormatters.targetValueFormatter(0, 1000, { NumberOfFractionalDigits: 1, manifestTarget: 10000 })).toEqual("1.0K");
		expect(cardFormatters.targetValueFormatter(1000, 20000, { NumberOfFractionalDigits: 2, manifestTarget: 10000 })).toEqual("20.00K");
		//if number of fractional digits < 0, it will be passed as 0
		expect(cardFormatters.targetValueFormatter(1000, 20000, { NumberOfFractionalDigits: -1, manifestTarget: 10000 })).toEqual("20K");
		//if number if fractional digits > 0, it will be passed as 2
		expect(cardFormatters.targetValueFormatter(1000, 20000, { NumberOfFractionalDigits: 3, manifestTarget: 10000 })).toEqual("20.00K");
	});

	test("formatDateValue: returns formatted date value based on the provided pattern", () => {
		expect(JSON.stringify(cardFormatters.formatDateValue("199610", "yearquarter"))).toEqual('"1998-04-01T00:00:00.000Z"');
		expect(JSON.stringify(cardFormatters.formatDateValue("199610", "yearmonth"))).toEqual('"1996-10-01T00:00:00.000Z"');
		expect(JSON.stringify(cardFormatters.formatDateValue("199610", "yearweek"))).toEqual('"1996-03-04T00:00:00.000Z"');
	});

	test("formatKPIValue: returns formatted kpi value", () => {
		expect(cardFormatters.formatKPIValue("12", { NumberOfFractionalDigits: 2, percentageAvailable: false }, false)).toEqual("12.00");
		expect(cardFormatters.formatKPIValue("12", { NumberOfFractionalDigits: 2, percentageAvailable: true }, true)).toEqual("%");
		expect(cardFormatters.formatKPIValue("12", { NumberOfFractionalDigits: 2, percentageAvailable: false }, true)).toEqual("");
	});

	test("formatDate: returns formatted date value based on oLocale & UTC value provided", () => {
		expect(cardFormatters.formatDate("03/10/1997", { UTC: false })).toEqual("Mar 10, 1997");
		expect(cardFormatters.formatDate("03/10/1997", { UTC: true })).toEqual("Mar 9, 1997");
	});
});
