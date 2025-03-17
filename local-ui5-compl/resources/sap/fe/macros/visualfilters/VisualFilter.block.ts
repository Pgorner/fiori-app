import type { AnnotationPath, PathAnnotationExpression } from "@sap-ux/vocabularies-types";
import type { CustomAggregate } from "@sap-ux/vocabularies-types/vocabularies/Aggregation";
import type { AggregatedProperty, AggregatedPropertyType } from "@sap-ux/vocabularies-types/vocabularies/Analytics";
import type { PropertyAnnotations } from "@sap-ux/vocabularies-types/vocabularies/Edm_Types";
import type { PropertyAnnotations_Measures } from "@sap-ux/vocabularies-types/vocabularies/Measures_Edm";
import type { Chart, DataPoint, LineItem, PresentationVariant, SelectionVariant } from "@sap-ux/vocabularies-types/vocabularies/UI";
import Log from "sap/base/Log";
import type { PropertiesOf } from "sap/fe/base/ClassSupport";
import { blockAttribute, defineBuildingBlock } from "sap/fe/core/buildingBlocks/templating/BuildingBlockSupport";
import type { TemplateProcessorSettings } from "sap/fe/core/buildingBlocks/templating/BuildingBlockTemplateProcessor";
import { xml } from "sap/fe/core/buildingBlocks/templating/BuildingBlockTemplateProcessor";
import BuildingBlockTemplatingBase from "sap/fe/core/buildingBlocks/templating/BuildingBlockTemplatingBase";
import type ConverterContext from "sap/fe/core/converters/ConverterContext";
import { getInvolvedDataModelObjects } from "sap/fe/core/converters/MetaModelConverter";
import type { PageContextPathTarget } from "sap/fe/core/converters/TemplateConverter";
import { getDefaultSelectionVariant } from "sap/fe/core/converters/controls/Common/DataVisualization";
import type { ParameterType } from "sap/fe/core/converters/controls/ListReport/VisualFilters";
import { AggregationHelper } from "sap/fe/core/converters/helpers/Aggregation";
import ModelHelper from "sap/fe/core/helpers/ModelHelper";
import { generate } from "sap/fe/core/helpers/StableIdHelper";
import type Context from "sap/ui/model/odata/v4/Context";
import InteractiveChartHelper from "./InteractiveChartHelper";
import { getInteractiveBarChartTemplate } from "./fragments/InteractiveBarChart";
import { getInteractiveChartWithErrorTemplate } from "./fragments/InteractiveChartWithError";
import { getInteractiveLineChartTemplate } from "./fragments/InteractiveLineChart";

/**
 * Building block for creating a VisualFilter based on the metadata provided by OData V4.
 * <br>
 * A Chart annotation is required to bring up an interactive chart
 *
 *
 * Usage example:
 * <pre>
 * &lt;macros:VisualFilter
 * collection="{entitySet&gt;}"
 * chartAnnotation="{chartAnnotation&gt;}"
 * id="someID"
 * groupId="someGroupID"
 * title="some Title"
 * /&gt;
 * </pre>
 * @private
 * @experimental
 */
@defineBuildingBlock({
	name: "VisualFilter",
	namespace: "sap.fe.macros"
})
export default class VisualFilterBlock extends BuildingBlockTemplatingBase {
	@blockAttribute({
		type: "string",
		required: true
	})
	id!: string;

	@blockAttribute({
		type: "string"
	})
	title = "";

	@blockAttribute({
		type: "sap.ui.model.Context",
		required: true,
		expectedTypes: ["EntitySet", "NavigationProperty"]
	})
	contextPath!: Context;

	@blockAttribute({
		type: "sap.ui.model.Context",
		required: true
	})
	metaPath!: Context;

	@blockAttribute({
		type: "string"
	})
	outParameter?: string;

	@blockAttribute({
		type: "string"
	})
	valuelistProperty?: string;

	@blockAttribute({
		type: "sap.ui.model.Context"
	})
	selectionVariantAnnotation?: Context;

	@blockAttribute({
		type: "array"
	})
	inParameters?: ParameterType[];

	@blockAttribute({
		type: "boolean"
	})
	multipleSelectionAllowed?: boolean;

	@blockAttribute({
		type: "boolean"
	})
	required?: boolean;

	@blockAttribute({
		type: "boolean"
	})
	showOverlayInitially?: boolean;

	@blockAttribute({
		type: "string"
	})
	renderLineChart?: string;

	@blockAttribute({
		type: "string"
	})
	requiredProperties?: string;

	@blockAttribute({
		type: "sap.ui.model.Context"
	})
	filterBarEntityType?: Context;

	@blockAttribute({
		type: "boolean"
	})
	showError?: boolean;

	@blockAttribute({
		type: "string"
	})
	chartMeasure?: string;

	@blockAttribute({
		type: "boolean"
	})
	UoMHasCustomAggregate?: boolean;

	@blockAttribute({
		type: "boolean"
	})
	showValueHelp?: boolean;

	@blockAttribute({
		type: "boolean"
	})
	customAggregate = false;

	@blockAttribute({
		type: "string"
	})
	groupId = "$auto.visualFilters";

	@blockAttribute({
		type: "string"
	})
	errorMessageTitle?: string;

	@blockAttribute({
		type: "string"
	})
	errorMessage?: string;

	@blockAttribute({
		type: "boolean"
	})
	draftSupported?: boolean;

	@blockAttribute({
		type: "boolean"
	})
	isValueListWithFixedValues: boolean | undefined;

	/******************************************************
	 * Internal Properties
	 * ***************************************************/

	aggregateProperties: AggregatedPropertyType | undefined;

	chartType: string | undefined;

	path: string | undefined;

	measureDimensionTitle: string | undefined;

	toolTip: string | undefined;

	UoMVisibility: boolean | undefined;

	scaleUoMTitle: string | undefined;

	filterCountBinding: string | undefined;

	chartAnnotation?: Chart;

	constructor(props: PropertiesOf<VisualFilterBlock>, configuration: unknown, mSettings: TemplateProcessorSettings) {
		super(props, configuration, mSettings);
		this.groupId = "$auto.visualFilters";
		this.path = this.metaPath?.getPath();
		const contextObjectPath = getInvolvedDataModelObjects<PresentationVariant>(this.metaPath, this.contextPath);
		const converterContext = this.getConverterContext(contextObjectPath, undefined, mSettings);
		const aggregationHelper = new AggregationHelper(converterContext.getEntityType(), converterContext);
		const customAggregates = aggregationHelper.getCustomAggregateDefinitions();
		const pvAnnotation = contextObjectPath.targetObject;
		let measure: string | undefined;
		const visualizations = pvAnnotation && pvAnnotation.Visualizations;
		this.getChartAnnotation(visualizations, converterContext);
		let aggregations: AggregatedPropertyType[] = [],
			custAggMeasure = [];

		if (this.chartAnnotation?.Measures?.length) {
			custAggMeasure = customAggregates.filter((custAgg) => {
				return custAgg.qualifier === this.chartAnnotation?.Measures[0].value;
			});
			measure = custAggMeasure.length > 0 ? custAggMeasure[0].qualifier : this.chartAnnotation.Measures[0].value;
			aggregations = aggregationHelper.getAggregatedProperties()[0];
		}
		// if there are AggregatedProperty objects but no dynamic measures, rather there are transformation aggregates found in measures
		if (
			aggregations &&
			aggregations.length > 0 &&
			!this.chartAnnotation?.DynamicMeasures &&
			custAggMeasure.length === 0 &&
			this.chartAnnotation?.Measures &&
			this.chartAnnotation?.Measures.length > 0
		) {
			Log.warning(
				"The transformational aggregate measures are configured as Chart.Measures but should be configured as Chart.DynamicMeasures instead. Please check the SAP Help documentation and correct the configuration accordingly."
			);
		}
		//if the chart has dynamic measures, but with no other custom aggregate measures then consider the dynamic measures
		if (this.chartAnnotation?.DynamicMeasures) {
			if (custAggMeasure.length === 0) {
				measure = converterContext
					.getConverterContextFor<AggregatedProperty>(
						converterContext.getAbsoluteAnnotationPath(this.chartAnnotation.DynamicMeasures[0].value)
					)
					.getDataModelObjectPath()
					.targetObject?.Name.toString();
				aggregations = aggregationHelper.getAggregatedProperty();
			} else {
				Log.warning(
					"The dynamic measures have been ignored as visual filters can deal with only 1 measure and the first (custom aggregate) measure defined under Chart.Measures is considered."
				);
			}
		}
		if (
			customAggregates.some(function (custAgg) {
				return custAgg.qualifier === measure;
			})
		) {
			this.customAggregate = true;
		}

		const defaultSelectionVariant = getDefaultSelectionVariant(converterContext.getEntityType());
		this.checkSelectionVariant(defaultSelectionVariant);
		const aggregation = this.getAggregateProperties(aggregations, measure);
		if (aggregation) {
			this.aggregateProperties = aggregation;
		}
		const propertyAnnotations =
			visualizations && this.chartAnnotation?.Measures && this.chartAnnotation?.Measures[0]?.$target?.annotations;
		const aggregatablePropertyAnnotations = aggregation?.AggregatableProperty?.$target?.annotations;
		this.checkIfUOMHasCustomAggregate(customAggregates, propertyAnnotations, aggregatablePropertyAnnotations);
		const propertyHidden = propertyAnnotations?.UI?.Hidden;
		const hiddenMeasure = propertyHidden?.valueOf();
		const chartType = this.chartAnnotation?.ChartType;
		this.chartType = chartType;
		this.showValueHelp = this.getShowValueHelp(chartType, hiddenMeasure);
		this.draftSupported = ModelHelper.isDraftSupported(mSettings.models.metaModel, this.contextPath?.getPath());
		/**
		 * If the measure of the chart is marked as 'hidden', or if the chart type is invalid, or if the data type for the line chart is invalid,
		 * the call is made to the InteractiveChartWithError fragment (using error-message related APIs, but avoiding batch calls)
		 */
		this.errorMessage = this.getErrorMessage(hiddenMeasure, measure);
		this.chartMeasure = measure;
		this.measureDimensionTitle = InteractiveChartHelper.getMeasureDimensionTitle(
			this.chartAnnotation,
			this.customAggregate,
			this.aggregateProperties
		);
		const collection = getInvolvedDataModelObjects<PageContextPathTarget>(this.contextPath);
		this.toolTip = InteractiveChartHelper.getToolTip(
			this.chartAnnotation,
			collection,
			this.path,
			this.customAggregate,
			this.aggregateProperties,
			this.renderLineChart
		);
		this.UoMVisibility = InteractiveChartHelper.getUoMVisiblity(this.chartAnnotation, this.showError);
		this.scaleUoMTitle = InteractiveChartHelper.getScaleUoMTitle(
			this.chartAnnotation,
			collection,
			this.path,
			this.customAggregate,
			this.aggregateProperties
		);
		this.filterCountBinding = InteractiveChartHelper.getfilterCountBinding(this.chartAnnotation);
	}

	checkIfUOMHasCustomAggregate(
		customAggregates: Array<CustomAggregate>,
		propertyAnnotations: PropertyAnnotations | undefined,
		aggregatablePropertyAnnotations?: PropertyAnnotations
	): void {
		const measures = propertyAnnotations?.Measures;
		const aggregatablePropertyMeasures = aggregatablePropertyAnnotations?.Measures;
		const UOM = this.getUoM(measures, aggregatablePropertyMeasures);
		if (
			UOM &&
			customAggregates.some(function (custAgg: CustomAggregate) {
				return custAgg.qualifier === UOM;
			})
		) {
			this.UoMHasCustomAggregate = true;
		} else {
			this.UoMHasCustomAggregate = false;
		}
	}

	getChartAnnotation(
		visualizations: Array<AnnotationPath<Chart | DataPoint | LineItem>> | undefined,
		converterContext: ConverterContext
	): void {
		if (visualizations) {
			for (let i = 0; i < visualizations.length; i++) {
				const sAnnotationPath = visualizations[i] && visualizations[i].value;
				this.chartAnnotation =
					converterContext.getEntityTypeAnnotation<Chart>(sAnnotationPath) &&
					converterContext.getEntityTypeAnnotation<Chart>(sAnnotationPath).annotation;
			}
		}
	}

	getErrorMessage(hiddenMeasure: Object | undefined, measure?: string): string | undefined {
		let validChartType;
		if (this.chartAnnotation) {
			if (this.chartAnnotation.ChartType === "UI.ChartType/Line" || this.chartAnnotation.ChartType === "UI.ChartType/Bar") {
				validChartType = true;
			} else {
				validChartType = false;
			}
		}
		if ((typeof hiddenMeasure === "boolean" && hiddenMeasure) || !validChartType || this.renderLineChart === "false") {
			this.showError = true;
			this.errorMessageTitle =
				hiddenMeasure || !validChartType
					? this.getTranslatedText("M_VISUAL_FILTERS_ERROR_MESSAGE_TITLE")
					: this.getTranslatedText("M_VISUAL_FILTER_LINE_CHART_INVALID_DATATYPE");
			if (hiddenMeasure) {
				return this.getTranslatedText("M_VISUAL_FILTER_HIDDEN_MEASURE", [measure]);
			} else if (!validChartType) {
				return this.getTranslatedText("M_VISUAL_FILTER_UNSUPPORTED_CHART_TYPE");
			} else {
				return this.getTranslatedText("M_VISUAL_FILTER_LINE_CHART_UNSUPPORTED_DIMENSION");
			}
		}
	}

	getShowValueHelp(chartType?: string, hiddenMeasure?: Object): boolean {
		const sDimensionType =
			this.chartAnnotation?.Dimensions[0] &&
			this.chartAnnotation?.Dimensions[0].$target &&
			this.chartAnnotation.Dimensions[0].$target.type;
		if (sDimensionType === "Edm.Date" || sDimensionType === "Edm.Time" || sDimensionType === "Edm.DateTimeOffset") {
			return false;
		} else if (typeof hiddenMeasure === "boolean" && hiddenMeasure) {
			return false;
		} else if (!(chartType === "UI.ChartType/Bar" || chartType === "UI.ChartType/Line")) {
			return false;
		} else if (this.renderLineChart === "false" && chartType === "UI.ChartType/Line") {
			return false;
		} else if (this.isValueListWithFixedValues === true) {
			return false;
		} else {
			return true;
		}
	}

	checkSelectionVariant(defaultSelectionVariant?: SelectionVariant): void {
		let selectionVariant;
		if (this.selectionVariantAnnotation) {
			const selectionVariantContext = this.metaPath?.getModel().createBindingContext(this.selectionVariantAnnotation.getPath());
			selectionVariant =
				selectionVariantContext &&
				getInvolvedDataModelObjects<SelectionVariant>(selectionVariantContext, this.contextPath).targetObject;
		}
		if (!selectionVariant && defaultSelectionVariant) {
			selectionVariant = defaultSelectionVariant;
		}
		if (selectionVariant && selectionVariant.SelectOptions && !this.multipleSelectionAllowed) {
			for (const selectOption of selectionVariant.SelectOptions) {
				if (selectOption.PropertyName?.value === this.chartAnnotation?.Dimensions[0].value) {
					if (selectOption.Ranges.length > 1) {
						Log.error("Multiple SelectOptions for FilterField having SingleValue Allowed Expression");
					}
				}
			}
		}
	}

	getAggregateProperties(aggregations: AggregatedPropertyType[], measure?: string): AggregatedPropertyType | undefined {
		let matchedAggregate: AggregatedPropertyType | undefined;
		if (!aggregations) {
			return;
		}
		aggregations.some(function (aggregate) {
			if (aggregate.Name === measure) {
				matchedAggregate = aggregate;
				return true;
			}
		});
		return matchedAggregate;
	}

	getUoM(measures?: PropertyAnnotations_Measures, aggregatablePropertyMeasures?: PropertyAnnotations_Measures): string {
		let ISOCurrency = measures?.ISOCurrency;
		let unit = measures?.Unit;
		if (!ISOCurrency && !unit && aggregatablePropertyMeasures) {
			ISOCurrency = aggregatablePropertyMeasures.ISOCurrency;
			unit = aggregatablePropertyMeasures.Unit;
		}
		return (ISOCurrency as PathAnnotationExpression<String>)?.path || (unit as PathAnnotationExpression<String>)?.path;
	}

	getRequired(): string {
		if (this.required) {
			return xml`<Label text="" width="0.5rem" required="true">
							<layoutData>
								<OverflowToolbarLayoutData priority="Never" />
							</layoutData>
						</Label>`;
		} else {
			return "";
		}
	}

	getUoMTitle(showErrorExpression: string): string {
		if (this.UoMVisibility) {
			return xml`<Title
							id="${generate([this.id, "ScaleUoMTitle"])}"
							visible="{= !${showErrorExpression}}"
							text="${this.scaleUoMTitle}"
							titleStyle="H6"
							level="H3"
							width="4.15rem"
						/>`;
		} else {
			return "";
		}
	}

	getValueHelp(showErrorExpression: string): string {
		if (this.showValueHelp) {
			return xml`<ToolbarSpacer />
						<Button
							id="${generate([this.id, "VisualFilterValueHelpButton"])}"
							type="Transparent"
							ariaHasPopup="Dialog"
							text="${this.filterCountBinding}"
							press="VisualFilterRuntime.fireValueHelp"
							enabled="{= !${showErrorExpression}}"
							customData:multipleSelectionAllowed="${this.multipleSelectionAllowed}"
						>
							<layoutData>
								<OverflowToolbarLayoutData priority="Never" />
							</layoutData>
						</Button>`;
		} else {
			return "";
		}
	}

	getInteractiveChartFragment(): string {
		if (this.showError) {
			return getInteractiveChartWithErrorTemplate(this);
		} else if (this.chartType === "UI.ChartType/Bar") {
			return getInteractiveBarChartTemplate(this);
		} else if (this.chartType === "UI.ChartType/Line") {
			return getInteractiveLineChartTemplate(this);
		}
		return "";
	}

	getTemplate(): string {
		const id = generate([this.path]);
		const showErrorExpression = "${internal>" + id + "/showError}";
		const cozyMode = document.body.classList.contains("sapUiSizeCozy");
		const overallHeight = cozyMode ? "13rem" : "100%";
		const chartHeight = cozyMode ? "100%" : "7.5rem";
		return xml`
		<fbControls:VisualFilter
		core:require="{VisualFilterRuntime: 'sap/fe/macros/visualfilters/VisualFilterRuntime'}"
		xmlns="sap.m"
		xmlns:fbControls="sap.fe.macros.controls.filterbar"
		xmlns:customData="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1"
		xmlns:core="sap.ui.core"
		id="${this.id}"
		height="${overallHeight}"
		width="20.5rem"
		class="sapUiSmallMarginBeginEnd"
		customData:infoPath="${generate([this.path])}"
	>
		<VBox height="2rem" class="sapUiTinyMarginTopBottom">
			<OverflowToolbar style="Clear">
				${this.getRequired()}
				<Title
					id="${generate([this.id, "MeasureDimensionTitle"])}"
					text="${this.measureDimensionTitle}"
					tooltip="${this.toolTip}"
					titleStyle="H6"
					level="H3"
					class="sapUiTinyMarginEnd sapUiNoMarginBegin"
				/>
				${this.getUoMTitle(showErrorExpression)}
				${this.getValueHelp(showErrorExpression)}
			</OverflowToolbar>
		</VBox>
		<VBox height="${chartHeight}" width="100%">
			${this.getInteractiveChartFragment()}
		</VBox>
	</fbControls:VisualFilter>`;
	}
}
