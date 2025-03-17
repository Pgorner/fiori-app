/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import CoreLib from "sap/ui/core/Lib";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import type { FormatterConfigurationMap } from "../helpers/Formatter";

export const getFormatterConfiguration = function (): FormatterConfigurationMap {
	const oResourceBundle = CoreLib.getResourceBundleFor("sap.cards.ap.generator.i18n");
	const i18nModel = new ResourceModel({
		bundleUrl: oResourceBundle.oUrlInfo.url,
		bundle: oResourceBundle //Reuse created bundle to stop extra network calls
	});

	return [
		{
			formatterName: "format.date",
			displayName: i18nModel.getObject("FORMAT_DATE"),
			parameters: [
				{
					name: "options",
					displayName: "Options",
					type: "object",
					defaultValue: "",
					properties: [{ name: "UTC", displayName: i18nModel.getObject("UTC"), type: "boolean", defaultValue: false }]
				}
			],
			type: "Date",
			visible: true
		},
		{
			formatterName: "format.dateTime",
			displayName: i18nModel.getObject("FORMAT_DATETIME"),
			parameters: [
				{
					name: "options",
					displayName: "Options",
					type: "object",
					defaultValue: "",
					properties: [
						{
							name: "relative",
							displayName: i18nModel.getObject("RELATIVE"),
							type: "boolean",
							defaultValue: false
						},
						{ name: "UTC", displayName: i18nModel.getObject("UTC"), type: "boolean", defaultValue: false }
					]
				}
			],
			type: "Date",
			visible: true
		},
		{
			formatterName: "format.float",
			displayName: i18nModel.getObject("FORMAT_FLOAT"),
			parameters: [
				{
					name: "options",
					displayName: "Options",
					type: "object",
					defaultValue: "",
					properties: [
						{
							name: "decimals",
							displayName: i18nModel.getObject("DECIMALS"),
							type: "number",
							defaultValue: 2
						},
						{
							name: "style",
							displayName: i18nModel.getObject("STYLE"),
							type: "enum",
							defaultSelectedKey: "short",
							selectedKey: "short",
							options: [
								{ value: "short", name: i18nModel.getObject("SHORT") },
								{ value: "long", name: i18nModel.getObject("LONG") }
							]
						}
					]
				}
			],
			type: "numeric",
			visible: true
		},
		{
			formatterName: "format.currency",
			displayName: i18nModel.getObject("FORMAT_CURRENCY"),
			parameters: [
				{ name: "currency", displayName: i18nModel.getObject("CURRENCY"), type: "string", defaultValue: "" },
				{
					name: "options",
					displayName: "Options",
					type: "object",
					defaultValue: "",
					properties: [
						{
							name: "currencyCode",
							displayName: i18nModel.getObject("CURRENCY_CODE"),
							type: "boolean",
							defaultValue: false
						}
					]
				}
			],
			type: "numeric",
			visible: true
		},
		{
			formatterName: "format.percent",
			displayName: i18nModel.getObject("FORMAT_PERCENT"),
			parameters: [],
			type: "numeric",
			visible: true
		},
		{
			formatterName: "format.integer",
			displayName: i18nModel.getObject("FORMAT_INTEGER"),
			parameters: [],
			type: "numeric",
			visible: true
		},
		{
			formatterName: "format.unit",
			displayName: "",
			parameters: [
				{ name: "type", displayName: "", type: "string", defaultValue: "" },
				{
					name: "options",
					displayName: "Options",
					type: "object",
					defaultValue: "",
					properties: [
						{
							name: "decimals",
							displayName: i18nModel.getObject("DECIMALS"),
							type: "number",
							defaultValue: 2
						},
						{
							name: "style",
							displayName: i18nModel.getObject("STYLE"),
							type: "enum",
							defaultSelectedKey: "short",
							options: [
								{ value: "short", name: i18nModel.getObject("SHORT") },
								{ value: "long", name: i18nModel.getObject("LONG") }
							]
						}
					]
				}
			],
			type: "numeric",
			visible: false
		},
		{
			formatterName: "extension.formatters.targetValueFormatter",
			displayName: i18nModel.getObject("FORMAT_TARGET_VALUE"),
			parameters: [
				{ name: "iTargetValue", displayName: i18nModel.getObject("TARGET_VALUE"), type: "number", defaultValue: "" },
				{
					name: "mStaticValues",
					displayName: "Formatter configuration",
					type: "object",
					defaultValue: "",
					properties: [
						{
							name: "NumberOfFractionalDigits",
							displayName: i18nModel.getObject("NUMBER_OF_FRACTIONAL_DIGITS"),
							type: "number",
							defaultValue: 2
						},
						{
							name: "manifestTarget",
							displayName: i18nModel.getObject("MANIFEST_TARGET"),
							type: "number",
							defaultValue: 0
						}
					]
				}
			],
			type: "numeric",
			visible: false
		},
		{
			formatterName: "extension.formatters.formatValueColor",
			displayName: i18nModel.getObject("FORMAT_COLOR_VALUE"),
			parameters: [
				{
					name: "mStaticValues",
					displayName: "Formatter configuration",
					type: "object",
					defaultValue: "",
					properties: [
						{
							name: "sImprovementDirection",
							displayName: i18nModel.getObject("IMPROVEMENT_DIRECTION"),
							type: "string",
							defaultValue: "",
							bIsProperty: true
						},
						{
							name: "bIsDeviationLowBinding",
							displayName: i18nModel.getObject("DEVIATION_LOW_BINDING"),
							type: "boolean",
							defaultValue: false
						},
						{
							name: "bIsDeviationHighBinding",
							displayName: i18nModel.getObject("DEVIATION_HIGH_BINDING"),
							type: "boolean",
							defaultValue: false
						},
						{
							name: "bIsToleranceLowBinding",
							displayName: i18nModel.getObject("TOLERANCE_LOW_BINDING"),
							type: "boolean",
							defaultValue: false
						},
						{
							name: "bIsToleranceHighBinding",
							displayName: i18nModel.getObject("TOLERANCE_HIGH_BINDING"),
							type: "boolean",
							defaultValue: false
						},
						{
							name: "deviationLow",
							displayName: i18nModel.getObject("LOW_DEVIATION"),
							type: "number",
							defaultValue: 0
						},
						{
							name: "deviationHigh",
							displayName: i18nModel.getObject("HIGH_DEVIATION"),
							type: "number",
							defaultValue: 0
						},
						{
							name: "toleranceLow",
							displayName: i18nModel.getObject("LOW_TOLERANCE"),
							type: "number",
							defaultValue: 0
						},
						{
							name: "toleranceHigh",
							displayName: i18nModel.getObject("HIGH_TOLERANCE"),
							type: "number",
							defaultValue: 0
						},
						{
							name: "oCriticalityConfigValues",
							displayName: "Criticality States",
							type: "object",
							value: { None: "Neutral", Negative: "Error", Critical: "Critical", Positive: "Good" }
						}
					]
				},
				{ name: "nDefaultValue", displayName: i18nModel.getObject("DEFAULT_VALUE"), type: "number", defaultValue: "" }
			],
			type: "numeric",
			visible: false
		},
		{
			formatterName: "extension.formatters.formatNumber",
			displayName: i18nModel.getObject("FORMAT_NUMBER"),
			parameters: [
				{ name: "value2", displayName: i18nModel.getObject("VALUE"), type: "number", defaultValue: "" },
				{
					name: "mStaticValues",
					displayName: "Formatter configuration",
					type: "object",
					defaultValue: "",
					properties: [
						{
							name: "numberOfFractionalDigits",
							displayName: i18nModel.getObject("NUMBER_OF_FRACTIONAL_DIGITS"),
							type: "number",
							defaultValue: 0
						},
						{
							name: "style",
							displayName: i18nModel.getObject("STYLE"),
							type: "enum",
							defaultSelectedKey: "short",
							selectedKey: "short",
							options: [
								{ value: "short", name: i18nModel.getObject("SHORT") },
								{ value: "long", name: i18nModel.getObject("LONG") }
							]
						},
						{ name: "showScale", displayName: i18nModel.getObject("SCALE"), type: "boolean", defaultValue: true },
						{ name: "scaleFactor", displayName: i18nModel.getObject("SCALE_FACTOR"), type: "number", defaultValue: 0 }
					]
				},
				{
					name: "textFragments",
					displayName: i18nModel.getObject("DEFAULT_VALUE"),
					type: "enum",
					defaultSelectedKey: [0],
					selectedKey: [0],
					options: [
						{ name: i18nModel.getObject("INDEX_ZERO"), value: "[0]" },
						{ name: i18nModel.getObject("INDEX_ONE"), value: "[1]" },
						{ name: i18nModel.getObject("INDEX_ZERO_ONE"), value: "[0, 1]" },
						{ name: i18nModel.getObject("INDEX_ONE_ZERO"), value: "[1, 0]" }
					]
				}
			],
			type: "string | numeric",
			visible: false
		},
		{
			formatterName: "extension.formatters.formatWithPercentage",
			displayName: i18nModel.getObject("FORMAT_VALUE_WITH_PERCENTAGE"),
			parameters: [],
			type: "string",
			visible: false
		},
		{
			formatterName: "extension.formatters.computePercentage",
			displayName: i18nModel.getObject("FORMAT_COMPUTE_PERCENTAGE"),
			parameters: [
				{ name: "target", displayName: i18nModel.getObject("TARGET_INDICATORS_TEXT"), type: "string", defaultValue: "" },
				{
					name: "sUnit",
					displayName: i18nModel.getObject("UNIT"),
					type: "enum",
					defaultSelectedKey: "",
					selectedKey: "",
					options: [
						{ value: "", name: i18nModel.getObject("NO_UNIT") },
						{ value: "%", name: i18nModel.getObject("PERCENT") }
					]
				}
			],
			type: "string | numeric",
			visible: false
		},
		{
			formatterName: "extension.formatters.returnPercentageChange",
			displayName: i18nModel.getObject("FORMAT_PERCENTAGE"),
			parameters: [
				{ name: "iTargetValue", displayName: i18nModel.getObject("TARGET_VALUE"), type: "number", defaultValue: "" },
				{
					name: "mStaticValues",
					displayName: "Formatter configuration",
					type: "object",
					defaultValue: "",
					properties: [
						{
							name: "NumberOfFractionalDigits",
							displayName: i18nModel.getObject("NUMBER_OF_FRACTIONAL_DIGITS"),
							type: "number",
							defaultValue: 2
						},
						{
							name: "manifestTarget",
							displayName: i18nModel.getObject("MANIFEST_TARGET"),
							type: "number",
							defaultValue: 0
						}
					]
				}
			],
			type: "string | numeric",
			visible: false
		},
		{
			formatterName: "extension.formatters.formatCurrency",
			displayName: i18nModel.getObject("FORMAT_CURRENCY_INTEGRATION"),
			parameters: [
				{
					name: "oFormatterProperties",
					displayName: "Formatter configuration",
					type: "object",
					defaultValue: "",
					properties: [
						{
							name: "NumberOfFractionalDigits",
							displayName: i18nModel.getObject("NUMBER_OF_FRACTIONAL_DIGITS"),
							type: "number",
							defaultValue: 2
						},
						{ name: "scaleFactor", displayName: i18nModel.getObject("SCALE_FACTOR"), type: "number", defaultValue: 0 }
					]
				},
				{ name: "bIncludeText", displayName: i18nModel.getObject("INCLUDE_TEXT"), type: "boolean", defaultValue: false },
				{ name: "sCurrency", displayName: i18nModel.getObject("CURRENCY"), type: "string", defaultValue: "" },
				{ name: "sCurrencyCodeText", displayName: i18nModel.getObject("CURRENCY_CODE"), type: "string", defaultValue: "" }
			],
			type: "numeric",
			visible: false
		},
		{
			formatterName: "extension.formatters.formatHeaderCount",
			displayName: i18nModel.getObject("FORMAT_HEADER_COUNT"),
			parameters: [],
			type: "string | numeric",
			visible: false
		},
		{
			formatterName: "extension.formatters.formatDate",
			displayName: i18nModel.getObject("FORMAT_DATE"),
			parameters: [
				{
					name: "options",
					displayName: "Options",
					type: "object",
					defaultValue: "",
					properties: [{ name: "UTC", displayName: i18nModel.getObject("UTC"), type: "boolean", defaultValue: false }]
				}
			],
			type: "string",
			visible: false
		},
		{
			formatterName: "extension.formatters.formatKPIValue",
			displayName: i18nModel.getObject("FORMAT_KPI_VALUE"),
			parameters: [
				{
					name: "mStaticValues",
					displayName: "Formatter configuration",
					type: "object",
					defaultValue: "",
					properties: [
						{
							name: "NumberOfFractionalDigits",
							displayName: i18nModel.getObject("NUMBER_OF_FRACTIONAL_DIGITS"),
							type: "number",
							defaultValue: 2
						},
						{
							name: "percentageAvailable",
							displayName: i18nModel.getObject("PERCENTAGE"),
							type: "boolean",
							defaultValue: false
						}
					]
				},
				{ name: "bUnit", displayName: i18nModel.getObject("UNIT"), type: "boolean", defaultValue: false }
			],
			type: "string",
			visible: false
		},
		{
			formatterName: "extension.formatters.formatTrendIcon",
			displayName: i18nModel.getObject("FORMAT_TREND_ICON"),
			parameters: [
				{
					name: "mStaticValues",
					displayName: "Formatter configuration",
					type: "object",
					defaultValue: "",
					properties: [
						{
							name: "bIsRefValBinding",
							displayName: i18nModel.getObject("REFERENCE_VALUE_BINDING"),
							type: "boolean",
							defaultValue: false
						},
						{
							name: "bIsDownDiffBinding",
							displayName: i18nModel.getObject("DOWN_DIFFERENCE_BINDING"),
							type: "boolean",
							defaultValue: false
						},
						{
							name: "bIsUpDiffBinding",
							displayName: i18nModel.getObject("UP_DIFFERENCE_BINDING"),
							type: "boolean",
							defaultValue: false
						},
						{
							name: "referenceValue",
							displayName: i18nModel.getObject("REFERENCE_VALUE"),
							type: "number",
							defaultValue: 0
						},
						{
							name: "downDifference",
							displayName: i18nModel.getObject("DOWN_DIFFERENCE_VALUE"),
							type: "number",
							defaultValue: 0
						},
						{
							name: "upDifference",
							displayName: i18nModel.getObject("UP_DIFFERENCE_VALUE"),
							type: "number",
							defaultValue: 0
						}
					]
				},
				{ name: "nDefaultValue", displayName: i18nModel.getObject("DEFAULT_VALUE"), type: "number", defaultValue: "" }
			],
			type: "string | numeric",
			visible: false
		},
		{
			formatterName: "extension.formatters.formatCriticality",
			displayName: i18nModel.getObject("FORMAT_CRITICALITY_STATE_OR_VALUE"),
			parameters: [{ name: "sType", displayName: i18nModel.getObject("Criticality_States"), type: "string", defaultValue: "" }],
			type: "string | numeric",
			visible: false
		},
		{
			formatterName: "extension.formatters.formatCriticalityIcon",
			displayName: i18nModel.getObject("FORMAT_CRITICALITY_ICON"),
			parameters: [],
			type: "string | numeric",
			visible: false
		},
		{
			formatterName: "extension.formatters.formatCriticalityButtonType",
			displayName: i18nModel.getObject("FORMAT_CRITICALITY_BUTTON_TYPE"),
			parameters: [],
			type: "string | numeric",
			visible: false
		},
		{
			formatterName: "extension.formatters.formatToKeepWhitespace",
			displayName: i18nModel.getObject("FORMAT_TO_KEEP_WHITESPACE"),
			parameters: [],
			type: "string | numeric",
			visible: false
		},
		{
			formatterName: "extension.formatters.formatDateValue",
			displayName: i18nModel.getObject("FORMAT_DATE_VALUE"),
			parameters: [
				{
					name: "sPattern",
					displayName: "Format options",
					type: "enum",
					defaultSelectedKey: "yearmonth",
					selectedKey: "yearmonth",
					options: [
						{ name: i18nModel.getObject("YEAR_MONTH"), value: "yearmonth" },
						{ name: i18nModel.getObject("YEAR_WEEK"), value: "yearweek" },
						{ name: i18nModel.getObject("YEAR_QUARTER"), value: "yearquarter" }
					]
				}
			],
			type: "string",
			visible: false
		},
		{
			formatterName: "extension.formatters.kpiValueCriticality",
			displayName: i18nModel.getObject("FORMAT_KPI_VALUE_CRITICALITY"),
			parameters: [],
			type: "string | numeric",
			visible: false
		},
		{
			formatterName: "extension.formatters.formatCriticalityValueState",
			displayName: i18nModel.getObject("FORMAT_CRITICALITY_VALUE_STATE"),
			parameters: [],
			type: "string | numeric",
			visible: false
		},
		{
			formatterName: "extension.formatters.formatCriticalityColorMicroChart",
			displayName: i18nModel.getObject("FORMAT_MICRO_CHART"),
			parameters: [],
			type: "string | numeric",
			visible: false
		}
	];
};
