import type { PathAnnotationExpression, PropertyPath } from "@sap-ux/vocabularies-types/Edm";
import type { Measure } from "@sap-ux/vocabularies-types/vocabularies/Analytics";
import type { SortOrderType } from "@sap-ux/vocabularies-types/vocabularies/Common";
import { CommonAnnotationTerms } from "@sap-ux/vocabularies-types/vocabularies/Common";
import { MeasuresAnnotationTerms } from "@sap-ux/vocabularies-types/vocabularies/Measures";
import type { PropertyAnnotations_Measures } from "@sap-ux/vocabularies-types/vocabularies/Measures_Edm";
import type {
	Chart,
	ChartMeasureAttributeTypeTypes,
	CriticalityCalculationType,
	DataPointType
} from "@sap-ux/vocabularies-types/vocabularies/UI";
import { UIAnnotationTerms } from "@sap-ux/vocabularies-types/vocabularies/UI";
import Log from "sap/base/Log";
import type { MetaModelEntityTypeAnnotations, MetaModelPropertyAnnotations } from "sap/fe/core/converters/MetaModelConverter";
import type { DataModelObjectPath } from "sap/fe/core/templating/DataModelPathHelper";
import type { ComputedAnnotationInterface } from "sap/fe/core/templating/UIFormatters";
import CommonHelper from "sap/fe/macros/CommonHelper";
import type MicroChartBlock from "sap/fe/macros/microchart/MicroChart.block";
import { ValueColor } from "sap/m/library";
import DateFormat from "sap/ui/core/format/DateFormat";
import NumberFormat from "sap/ui/core/format/NumberFormat";
import type { MetaModelNavProperty, MetaModelType } from "types/metamodel_types";

type Property = {
	$kind?: string;
	$Type?: string;
	$Name?: string;
	$Nullable?: boolean;
	$MaxLength?: number;
	$Precision?: number;
	$Scale?: number | string;
};

const calendarPatternMap: { [key: string]: RegExp } = {
	yyyy: /[1-9][0-9]{3,}|0[0-9]{3}/,
	Q: /[1-4]/,
	MM: /0[1-9]|1[0-2]/,
	ww: /0[1-9]|[1-4][0-9]|5[0-3]/,
	yyyyMMdd: /([1-9][0-9]{3,}|0[0-9]{3})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])/,
	yyyyMM: /([1-9][0-9]{3,}|0[0-9]{3})(0[1-9]|1[0-2])/,
	"yyyy-MM-dd": /([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])/
};

/**
 * Helper class used by MDC_Controls to handle SAP Fiori elements for OData V4
 * @private
 * @experimental This module is only for internal/experimental use!
 */
const MicroChartHelper = {
	/**
	 * This function returns the Threshold Color for bullet micro chart.
	 * @param value Threshold value provided in the annotations
	 * @param iContext InterfaceContext with path to the threshold
	 * @returns The indicator for Threshold Color
	 */
	getThresholdColor: function (value: string, iContext: ComputedAnnotationInterface): ValueColor {
		const path = iContext.context.getPath();
		if (path.includes("DeviationRange")) {
			return ValueColor.Error;
		} else if (path.includes("ToleranceRange")) {
			return ValueColor.Critical;
		}
		return ValueColor.Neutral;
	},

	/**
	 * To fetch measures from DataPoints.
	 * @param chartAnnotations Chart Annotations
	 * @param entityTypeAnnotations EntityType Annotations
	 * @param chartType Chart Type used
	 * @returns Containing all measures.
	 * @private
	 */
	getMeasurePropertyPaths: function (
		chartAnnotations: MetaModelType<Chart>,
		entityTypeAnnotations: MetaModelEntityTypeAnnotations | undefined,
		chartType: string
	): string | undefined {
		const propertyPath: string[] = [];

		if (!entityTypeAnnotations) {
			Log.warning("FE:Macro:MicroChart : Couldn't find annotations for the DataPoint.");
			return undefined;
		}

		for (const measureIndex in chartAnnotations.Measures) {
			const iMeasureAttribute = CommonHelper.getMeasureAttributeIndex(measureIndex as unknown as number, chartAnnotations),
				measureAttribute =
					iMeasureAttribute > -1 && chartAnnotations.MeasureAttributes && chartAnnotations.MeasureAttributes[iMeasureAttribute],
				dataPoint = (measureAttribute &&
					entityTypeAnnotations &&
					entityTypeAnnotations[measureAttribute.DataPoint?.$AnnotationPath as keyof MetaModelEntityTypeAnnotations]) as
					| MetaModelType<DataPointType>
					| undefined;
			if (dataPoint?.Value?.$Path) {
				propertyPath.push(dataPoint.Value.$Path);
			} else {
				Log.warning(
					`FE:Macro:MicroChart : Couldn't find DataPoint(Value) measure for the measureAttribute ${chartType} MicroChart.`
				);
			}
		}

		return propertyPath.join(",");
	},

	/**
	 * This function returns the visible expression path.
	 * @param args
	 * @returns Expression Binding for the visible.
	 */
	getHiddenPathExpression: function (...args: unknown[]): string | boolean {
		if (!args[0] && !args[1]) {
			return true;
		}
		if (args[0] === true || args[1] === true) {
			return false;
		}

		const hiddenPaths: string[] = [];
		[].forEach.call(args, function (hiddenProperty: unknown) {
			if (hiddenProperty && (hiddenProperty as { $Path: string }).$Path) {
				hiddenPaths.push("%{" + (hiddenProperty as { $Path: string }).$Path + "}");
			}
		});

		return hiddenPaths.length ? "{= " + hiddenPaths.join(" || ") + " === true ? false : true }" : false;
	},

	/**
	 * This function returns the true/false to display chart.
	 * @param chartType The chart type
	 * @param value Data point value of Value
	 * @param value.$Path
	 * @param maxValue Data point value of MaximumValue
	 * @param maxValue.$Path
	 * @param valueHidden Hidden path object/boolean value for the referenced property of value
	 * @param valueHidden.$Path
	 * @param maxValueHidden Hidden path object/boolean value for the referenced property of MaxValue
	 * @param maxValueHidden.$Path
	 * @returns `true` or `false` to hide/show chart
	 */
	isNotAlwaysHidden: function (
		chartType: string,
		value: { $Path: string },
		maxValue: { $Path: string } | undefined,
		valueHidden?: boolean | { $Path: string },
		maxValueHidden?: boolean | { $Path: string }
	): boolean {
		if (valueHidden === true) {
			this.logError(chartType, value);
		}
		if (maxValueHidden === true) {
			this.logError(chartType, maxValue);
		}
		if (valueHidden === undefined && maxValueHidden === undefined) {
			return true;
		} else {
			return ((!valueHidden || (valueHidden as { $Path: string }).$Path) && valueHidden !== undefined) ||
				((!maxValueHidden || (maxValueHidden as { $Path: string }).$Path) && maxValueHidden !== undefined)
				? true
				: false;
		}
	},

	/**
	 * This function is to log errors for missing data point properties.
	 * @param chartType The chart type.
	 * @param value Dynamic hidden property name.
	 * @param value.$Path Dynamic hidden property name.
	 */
	logError: function (chartType: string, value?: { $Path: string }): void {
		Log.error(`Measure Property ${value?.$Path} is hidden for the ${chartType} Micro Chart`);
	},

	/**
	 * This function returns the formatted value with scale factor for the value displayed.
	 * @param path Property path for the value
	 * @param property The Property for constraints
	 * @param fractionDigits No. of fraction digits specified from annotations
	 * @param value Static value of the property
	 * @returns Expression Binding for the value with scale.
	 */
	formatDecimal: function (path: string, property: Property, fractionDigits: number | undefined, value?: number): string | undefined {
		if (path) {
			const constraints = [],
				formatOptions = ["style: 'short'"];
			const scale = typeof fractionDigits === "number" ? fractionDigits : (property && property?.$Scale) || 1;

			if (property.$Nullable != undefined) {
				constraints.push("nullable: " + property.$Nullable);
			}
			if (property.$Precision != undefined) {
				formatOptions.push("precision: " + (property.$Precision ? property.$Precision : "1"));
			}
			constraints.push("scale: " + (scale === "variable" ? "'" + scale + "'" : scale));

			return (
				"{ path: '" +
				path +
				"'" +
				", type: 'sap.ui.model.odata.type.Decimal', constraints: { " +
				constraints.join(",") +
				" }, formatOptions: { " +
				formatOptions.join(",") +
				" } }"
			);
		} else if (value) {
			const decimals = typeof fractionDigits === "number" ? fractionDigits : 1;
			return NumberFormat.getFloatInstance({ style: "short", preserveDecimals: true, decimals: decimals }).format(value);
		}
	},

	/**
	 * To fetch, the $select parameters from annotations to add to the list binding.
	 * @param groupId GroupId to be used
	 * @param sortOrder Sort order to be used
	 * @param criticalityCalculation Criticality calculation object property path
	 * @param criticality Criticality for the chart
	 * @param otherPaths All other paths
	 * @returns String containing all the property paths needed to be added to the $select query of the list binding.
	 * @private
	 */
	getSelectParameters: function (
		groupId: string,
		sortOrder?: SortOrderType[],
		criticalityCalculation?: CriticalityCalculationType,
		criticality?: string,
		otherPaths?: string[]
	): string {
		const propertyPath: string[] = [],
			sorters: string[] = [],
			parameters: string[] = [];

		if (groupId) {
			parameters.push(`$$groupId : '${groupId}'`);
		}
		if (sortOrder) {
			sortOrder.forEach((sorter: SortOrderType) => {
				sorters.push(`${sorter.Property}${sorter.Descending ? " desc" : ""}`);
			});
		}

		if (criticality) {
			propertyPath.push(criticality);
		} else if (criticalityCalculation) {
			const cricticalityCalculationKeys = [
				"ImprovementDirection",
				"DeviationRangeLowValue",
				"ToleranceRangeLowValue",
				"AcceptanceRangeLowValue",
				"AcceptanceRangeHighValue",
				"ToleranceRangeHighValue",
				"DeviationRangeHighValue"
			];
			Object.keys(criticalityCalculation).forEach((key: string) => {
				if (
					cricticalityCalculationKeys.includes(key) &&
					((criticalityCalculation as unknown as Record<string, string>)[key] as unknown as PathAnnotationExpression<string>).path
				) {
					propertyPath.push(
						((criticalityCalculation as unknown as Record<string, string>)[key] as unknown as PathAnnotationExpression<string>)
							.path
					);
				}
			});
		}

		otherPaths?.forEach((path) => {
			if (path) {
				propertyPath.push(path);
			}
		});

		if (propertyPath.length) {
			parameters.push(`$select : '${propertyPath.join(",")}'`);
		}
		if (sorters.length) {
			parameters.push(`$orderby : '${sorters.join(",")}'`);
		}

		return parameters.join(",");
	},

	/**
	 * To fetch DataPoint qualifiers of measures.
	 * @param chartAnnotations Chart annotations
	 * @param entityTypeAnnotations EntityType annotations
	 * @param chartType Chart type used
	 * @returns Containing all data point qualifiers.
	 * @private
	 */
	getDataPointQualifiersForMeasures: function (
		chartAnnotations: MetaModelType<Chart>,
		entityTypeAnnotations: MetaModelEntityTypeAnnotations | undefined,
		chartType: string
	): string {
		const qualifiers: string[] = [],
			measureAttributes = chartAnnotations.MeasureAttributes,
			fnAddDataPointQualifier = function (chartMeasure: { $PropertyPath: string }): void {
				const measure = chartMeasure.$PropertyPath;
				let qualifier: string | undefined;
				if (entityTypeAnnotations) {
					measureAttributes?.forEach(function (measureAttribute: MetaModelType<ChartMeasureAttributeTypeTypes>) {
						if (measureAttribute.Measure?.$PropertyPath === measure && measureAttribute.DataPoint?.$AnnotationPath) {
							const annotationPath = measureAttribute.DataPoint.$AnnotationPath;
							if (entityTypeAnnotations[annotationPath as keyof MetaModelEntityTypeAnnotations]) {
								qualifier = annotationPath.split("#")[1];
								if (qualifier) {
									qualifiers.push(qualifier);
								}
							}
						}
					});
				}
				if (qualifier === undefined) {
					Log.warning(
						`FE:Macro:MicroChart : Couldn't find DataPoint(Value) measure for the measureAttribute for ${chartType} MicroChart.`
					);
				}
			};

		if (!entityTypeAnnotations) {
			Log.warning(`FE:Macro:MicroChart : Couldn't find annotations for the DataPoint ${chartType} MicroChart.`);
		}
		chartAnnotations.Measures?.forEach(fnAddDataPointQualifier);
		return qualifiers.join(",");
	},

	/**
	 * This function is to log warnings for missing datapoint properties.
	 * @param chartType The Chart type.
	 * @param error Object with properties from DataPoint.
	 */
	logWarning: function (chartType: string, error: object): void {
		for (const key in error) {
			if (!error[key as keyof typeof error]) {
				Log.warning(`${key} parameter is missing for the ${chartType} Micro Chart`);
			}
		}
	},

	/**
	 * This function is used to get DisplayValue for comparison micro chart data aggregation.
	 * @param dataPoint Data point object.
	 * @param pathText Object after evaluating @com.sap.vocabularies.Common.v1.Text annotation
	 * @param pathText.$Path The target path
	 * @param valueTextPath Evaluation of @com.sap.vocabularies.Common.v1.Text/$Path/$ value of the annotation
	 * @param valueDataPointPath DataPoint>Value/$Path/$ value after evaluating annotation
	 * @returns Expression binding for Display Value for comparison micro chart's aggregation data.
	 */
	getDisplayValueForMicroChart: function (
		dataPoint: MetaModelType<DataPointType>,
		pathText: { $Path: string } | undefined,
		valueTextPath: object,
		valueDataPointPath: object
	): string | undefined {
		const valueFormat = dataPoint.ValueFormat && dataPoint.ValueFormat.NumberOfFractionalDigits;
		if (pathText) {
			return MicroChartHelper.formatDecimal(pathText["$Path"], valueTextPath as Property, valueFormat);
		}
		return MicroChartHelper.formatDecimal(dataPoint.Value["$Path"], valueDataPointPath as Property, valueFormat);
	},

	/**
	 * This function is used to check whether micro chart is enabled or not by checking properties, chart annotations, hidden properties.
	 * @param chartType MicroChart Type,such as Bullet.
	 * @param dataPoint Data point object.
	 * @param dataPointValueHidden Object with $Path annotation to get the hidden value path
	 * @param targetAnnotations ChartAnnotation object
	 * @param dataPointMaxValue Object with $Path annotation to get hidden max value path
	 * @returns `true` if the chart has all values and properties and also it is not always hidden sFinalDataPointValue && bMicrochartVisible.
	 */
	shouldMicroChartRender: function (
		chartType: string,
		dataPoint: DataPointType,
		dataPointValueHidden: Record<string, boolean>,
		targetAnnotations: Chart,
		dataPointMaxValue: Record<string, boolean>
	): boolean {
		const availableChartTypes = ["Area", "Column", "Comparison"],
			dataPointValue = dataPoint && dataPoint.Value,
			hiddenPath = dataPointValueHidden && dataPointValueHidden[UIAnnotationTerms.Hidden],
			chartAnnotationDimension = targetAnnotations && targetAnnotations.Dimensions && targetAnnotations.Dimensions[0],
			finalDataPointValue = availableChartTypes.includes(chartType) ? dataPointValue && chartAnnotationDimension : dataPointValue; // only for three charts in array
		if (chartType === "Harvey") {
			const dataPointMaximumValue = dataPoint && dataPoint.MaximumValue,
				maxValueHiddenPath = dataPointMaxValue && dataPointMaxValue[UIAnnotationTerms.Hidden];
			return (
				dataPointValue &&
				dataPointMaximumValue &&
				MicroChartHelper.isNotAlwaysHidden(
					"Bullet",
					dataPointValue,
					dataPointMaximumValue as unknown as { $Path: string },
					hiddenPath,
					maxValueHiddenPath
				)
			);
		}
		return finalDataPointValue && MicroChartHelper.isNotAlwaysHidden(chartType, dataPointValue, undefined, hiddenPath);
	},

	/**
	 * This function is used to get dataPointQualifiers for Column, Comparison and StackedBar micro charts.
	 * @param annotationPath
	 * @returns Result string or undefined.
	 */
	getDataPointQualifiersForMicroChart: function (annotationPath: string): string | undefined {
		if (!annotationPath.includes(UIAnnotationTerms.DataPoint)) {
			return undefined;
		}
		return annotationPath.split("#")[1] ?? "";
	},

	/**
	 * This function is used to get colorPalette for comparison and HarveyBall Microcharts.
	 * @param dataPoint Data point object.
	 * @returns Result string for colorPalette or undefined.
	 */
	getColorPaletteForMicroChart: function (dataPoint: DataPointType): string | undefined {
		return dataPoint.Criticality
			? undefined
			: "sapUiChartPaletteQualitativeHue1, sapUiChartPaletteQualitativeHue2, sapUiChartPaletteQualitativeHue3,          sapUiChartPaletteQualitativeHue4, sapUiChartPaletteQualitativeHue5, sapUiChartPaletteQualitativeHue6, sapUiChartPaletteQualitativeHue7,          sapUiChartPaletteQualitativeHue8, sapUiChartPaletteQualitativeHue9, sapUiChartPaletteQualitativeHue10, sapUiChartPaletteQualitativeHue11";
	},

	/**
	 * This function is used to get MeasureScale for Area, Column and Line micro charts.
	 * @param dataPoint Data point object.
	 * @returns Data point value format fractional digits or data point scale or 1.
	 */
	getMeasureScaleForMicroChart: function (dataPoint: DataPointType): number {
		if (dataPoint.ValueFormat && dataPoint.ValueFormat.NumberOfFractionalDigits) {
			return dataPoint.ValueFormat.NumberOfFractionalDigits.valueOf();
		}
		if (dataPoint.Value && dataPoint.Value["$Path"] && dataPoint.Value["$Path"]["$Scale"]) {
			return dataPoint.Value["$Path"]["$Scale"];
		}
		return 1;
	},

	/**
	 * This function is to return the binding expression of microchart.
	 * @param chartType The type of micro chart (Bullet, Radial etc.)
	 * @param measure Measure value for micro chart.
	 * @param microChart `this`/current model for micro chart.
	 * @param collection Collection object.
	 * @param uiName The @sapui.name in collection model is not accessible here from model hence need to pass it.
	 * @param dataPoint Data point object used in case of Harvey Ball micro chart
	 * @returns The binding expression for micro chart.
	 * @private
	 */
	getBindingExpressionForMicrochart: function (
		chartType: string,
		measure: DataModelObjectPath<Measure>,
		microChart: MicroChartBlock,
		collection: MetaModelNavProperty,
		uiName: string,
		dataPoint: DataModelObjectPath<DataPointType>
	): string {
		const condition = collection["$isCollection"] || collection["$kind"] === "EntitySet";
		const path = condition ? "" : uiName;
		let currencyOrUnit = MicroChartHelper.getUOMPathForMicrochart(microChart.showOnlyChart as boolean, measure);
		let dataPointCriticallity = "";
		switch (chartType) {
			case "Radial":
				currencyOrUnit = "";
				break;
			case "Harvey":
				dataPointCriticallity = dataPoint?.targetObject?.Criticality
					? (dataPoint.targetObject?.Criticality as PathAnnotationExpression<string>)?.path
					: "";
				break;
		}
		const functionValue = MicroChartHelper.getSelectParameters(microChart.batchGroupId, undefined, undefined, dataPointCriticallity, [
			currencyOrUnit
		]);

		return `{ path: '${path}'` + `, parameters : {${functionValue}} }`;
	},

	/**
	 * This function is to return the UOMPath expression of the micro chart.
	 * @param showOnlyChart Whether only chart should be rendered or not.
	 * @param measure Measures for the micro chart.
	 * @returns UOMPath String for the micro chart.
	 * @private
	 */
	getUOMPathForMicrochart: function (showOnlyChart: boolean, measure?: DataModelObjectPath<Measure>): string {
		return measure && !showOnlyChart
			? (
					(measure.targetObject?.annotations?.Measures as PropertyAnnotations_Measures)
						?.ISOCurrency as unknown as PathAnnotationExpression<string>
			  )?.path ||
					(
						(measure.targetObject?.annotations?.Measures as PropertyAnnotations_Measures)
							?.Unit as unknown as PathAnnotationExpression<string>
					)?.path ||
					""
			: "";
	},

	/**
	 * This function is to return the aggregation binding expression of micro chart.
	 * @param aggregationType Aggregation type of chart (for example, Point for AreaMicrochart)
	 * @param collection Collection object.
	 * @param dataPoint Data point info for micro chart.
	 * @param uiName The @sapui.name in collection model is not accessible here from model hence need to pass it.
	 * @param dimension Micro chart Dimensions.
	 * @param measure Measure value for micro chart.
	 * @param sortOrder SortOrder for micro chart.
	 * @param measureOrDimensionBar The measure or dimension passed specifically in the case of bar chart.
	 * @returns Aggregation binding expression for micro chart.
	 * @private
	 */
	getAggregationForMicrochart: function (
		aggregationType: string,
		collection: MetaModelNavProperty,
		dataPoint: DataModelObjectPath<DataPointType>,
		uiName: string,
		dimension: DataModelObjectPath<PropertyPath> | undefined,
		measure: DataModelObjectPath<Measure>,
		sortOrder: SortOrderType[],
		measureOrDimensionBar: string
	): string {
		let path = collection["$kind"] === "EntitySet" ? "/" : "";
		path = path + uiName;
		const groupId = "";
		let dataPointCriticallityCalc;
		let dataPointCriticallity = dataPoint.targetObject?.Criticality
			? (dataPoint.targetObject?.Criticality as PathAnnotationExpression<string>)?.path
			: "";
		const currencyOrUnit = MicroChartHelper.getUOMPathForMicrochart(false, measure);
		let targetValuePath = "";
		let dimensionPropertyPath = "";
		if (dimension?.targetObject?.$target?.annotations?.Common?.Text) {
			dimensionPropertyPath = (
				dimension?.targetObject?.$target?.annotations?.Common?.Text as unknown as PathAnnotationExpression<string>
			)?.path;
		} else if (dimension) {
			dimensionPropertyPath = dimension.targetObject?.value as string;
		}
		switch (aggregationType) {
			case "Points":
				dataPointCriticallityCalc = dataPoint?.targetObject?.CriticalityCalculation;
				targetValuePath = dataPoint?.targetObject?.TargetValue?.path;
				dataPointCriticallity = "";
				break;
			case "Columns":
				dataPointCriticallityCalc = dataPoint?.targetObject?.CriticalityCalculation;
				break;
			case "LinePoints":
				dataPointCriticallity = "";
				break;
			case "Bars":
				dimensionPropertyPath = "";
				break;
		}
		const functionValue = MicroChartHelper.getSelectParameters(groupId, sortOrder, dataPointCriticallityCalc, dataPointCriticallity, [
			currencyOrUnit,
			targetValuePath,
			dimensionPropertyPath,
			measureOrDimensionBar
		]);

		return `{path:'${path}'` + `, parameters : {${functionValue}} }`;
	},

	getCurrencyOrUnit: function (measure: MetaModelPropertyAnnotations): string | undefined {
		if (measure[`@${MeasuresAnnotationTerms.ISOCurrency}`]) {
			return (
				(measure[`@${MeasuresAnnotationTerms.ISOCurrency}`] as { $Path: string }).$Path ||
				(measure[`@${MeasuresAnnotationTerms.ISOCurrency}`] as string)
			);
		}
		if (measure[`@${MeasuresAnnotationTerms.Unit}`]) {
			return (
				(measure[`@${MeasuresAnnotationTerms.Unit}`] as { $Path: string }).$Path ||
				(measure[`@${MeasuresAnnotationTerms.Unit}`] as string)
			);
		}
		return "";
	},

	getCalendarPattern: function (propertyType: string, annotations: Record<string, unknown>): {} | undefined {
		return (
			(annotations[`@${CommonAnnotationTerms.IsCalendarYear}`] && "yyyy") ||
			(annotations[`@${CommonAnnotationTerms.IsCalendarQuarter}`] && "Q") ||
			(annotations[`@${CommonAnnotationTerms.IsCalendarMonth}`] && "MM") ||
			(annotations[`@${CommonAnnotationTerms.IsCalendarWeek}`] && "ww") ||
			(annotations[`@${CommonAnnotationTerms.IsCalendarDate}`] && "yyyyMMdd") ||
			(annotations[`@${CommonAnnotationTerms.IsCalendarYearMonth}`] && "yyyyMM") ||
			(propertyType === "Edm.Date" && "yyyy-MM-dd") ||
			undefined
		);
	},

	formatDimension: function (date: string, pattern: string, propertyPath: string): number {
		const value = DateFormat.getDateInstance({ pattern }).parse(date, false, true);
		if (value instanceof Date) {
			return value.getTime();
		} else {
			Log.warning("Date value could not be determined for " + propertyPath);
		}
		return 0;
	},

	formatStringDimension: function (value: unknown, pattern: string, propertyPath: string): number {
		if (pattern in calendarPatternMap) {
			const matchedValue = value?.toString().match(calendarPatternMap[pattern]);
			if (matchedValue && matchedValue?.length) {
				return MicroChartHelper.formatDimension(matchedValue[0], pattern, propertyPath);
			}
		}
		Log.warning("Pattern not supported for " + propertyPath);
		return 0;
	},

	getX: function (propertyPath: string, propertyType: string, annotations?: Record<string, unknown>): string | undefined {
		const pattern = annotations && MicroChartHelper.getCalendarPattern(propertyType, annotations);
		if (pattern && ["Edm.Date", "Edm.String"].some((type) => type === propertyType)) {
			return `{parts: [{path: '${propertyPath}', targetType: 'any'}, {value: '${pattern}'}, {value: '${propertyPath}'}], formatter: 'MICROCHARTR.formatStringDimension'}`;
		}
	}
};

export default MicroChartHelper;
