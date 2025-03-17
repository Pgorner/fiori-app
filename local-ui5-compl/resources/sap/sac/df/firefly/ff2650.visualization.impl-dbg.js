/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff2610.visualization.internal"
],
function(oFF)
{
"use strict";

oFF.ChartVisualizationPointStyle = function() {};
oFF.ChartVisualizationPointStyle.prototype = new oFF.XObject();
oFF.ChartVisualizationPointStyle.prototype._ff_c = "ChartVisualizationPointStyle";

oFF.ChartVisualizationPointStyle.create = function()
{
	let instance = new oFF.ChartVisualizationPointStyle();
	return instance;
};
oFF.ChartVisualizationPointStyle.merge = function(stylesList)
{
	let instance = oFF.ChartVisualizationPointStyle.create();
	oFF.XCollectionUtils.forEach(stylesList, (s) => {
		instance.mergeIntoMe(s);
	});
	return instance;
};
oFF.ChartVisualizationPointStyle.prototype.m_color = null;
oFF.ChartVisualizationPointStyle.prototype.m_customPattern = null;
oFF.ChartVisualizationPointStyle.prototype.m_customShape = null;
oFF.ChartVisualizationPointStyle.prototype.m_lineStyle = null;
oFF.ChartVisualizationPointStyle.prototype.m_pattern = null;
oFF.ChartVisualizationPointStyle.prototype.m_shape = null;
oFF.ChartVisualizationPointStyle.prototype.copyFrom = function(other, flags)
{
	oFF.XObject.prototype.copyFrom.call( this , other, flags);
	let orig = other;
	this.m_customShape = orig.m_customShape;
	this.m_customPattern = orig.m_customPattern;
	this.m_color = orig.m_color;
	this.m_pattern = orig.m_pattern;
	this.m_shape = orig.m_shape;
	this.m_lineStyle = orig.m_lineStyle;
};
oFF.ChartVisualizationPointStyle.prototype.getColor = function()
{
	return this.m_color;
};
oFF.ChartVisualizationPointStyle.prototype.getCustomPattern = function()
{
	return this.m_customPattern;
};
oFF.ChartVisualizationPointStyle.prototype.getCustomShape = function()
{
	return this.m_customShape;
};
oFF.ChartVisualizationPointStyle.prototype.getLineStyle = function()
{
	return this.m_lineStyle;
};
oFF.ChartVisualizationPointStyle.prototype.getPattern = function()
{
	return this.m_pattern;
};
oFF.ChartVisualizationPointStyle.prototype.getShape = function()
{
	return this.m_shape;
};
oFF.ChartVisualizationPointStyle.prototype.mergeIntoMe = function(style)
{
	if (oFF.notNull(style))
	{
		if (oFF.isNull(this.m_color))
		{
			this.m_color = style.getColor();
		}
		if (oFF.isNull(this.m_pattern) && oFF.isNull(this.m_customPattern))
		{
			this.m_pattern = style.getPattern();
			this.m_customPattern = style.getCustomPattern();
		}
		if (oFF.isNull(this.m_shape) && oFF.isNull(this.m_customShape))
		{
			this.m_shape = style.getShape();
			this.m_customShape = style.getCustomShape();
		}
		if (oFF.isNull(this.m_lineStyle))
		{
			this.m_lineStyle = style.getLineStyle();
		}
	}
};
oFF.ChartVisualizationPointStyle.prototype.releaseObject = function()
{
	this.m_customPattern = null;
	this.m_customShape = null;
	this.m_color = null;
	this.m_shape = null;
	this.m_pattern = null;
	this.m_lineStyle = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.ChartVisualizationPointStyle.prototype.setColor = function(color)
{
	this.m_color = color;
};
oFF.ChartVisualizationPointStyle.prototype.setCustomPattern = function(pattern)
{
	this.m_customPattern = pattern;
};
oFF.ChartVisualizationPointStyle.prototype.setCustomShape = function(customShape)
{
	this.m_customShape = customShape;
};
oFF.ChartVisualizationPointStyle.prototype.setLineStyle = function(chartLineStyle)
{
	this.m_lineStyle = chartLineStyle;
};
oFF.ChartVisualizationPointStyle.prototype.setPattern = function(pattern)
{
	this.m_pattern = pattern;
};
oFF.ChartVisualizationPointStyle.prototype.setShape = function(shape)
{
	this.m_shape = shape;
};

oFF.GenericValChartRenderer = function() {};
oFF.GenericValChartRenderer.prototype = new oFF.XObject();
oFF.GenericValChartRenderer.prototype._ff_c = "GenericValChartRenderer";

oFF.GenericValChartRenderer.create = function(chartVisualization)
{
	let instance = new oFF.GenericValChartRenderer();
	instance.m_chartVisualization = chartVisualization;
	return instance;
};
oFF.GenericValChartRenderer.prototype.m_chartJson = null;
oFF.GenericValChartRenderer.prototype.m_chartVisualization = null;
oFF.GenericValChartRenderer.prototype.buildAxes = function(axes, kAxis, globalStructure, chartStructure)
{
	if (oFF.XCollectionUtils.hasElements(axes))
	{
		let axesSize = axes.size();
		let axisObject;
		let axesList = chartStructure.putNewList(kAxis);
		for (let i = 0; i < axesSize; i++)
		{
			axisObject = axesList.addNewStructure();
			this.buildAxis(axes.get(i), axisObject);
		}
	}
};
oFF.GenericValChartRenderer.prototype.buildAxis = function(chartAxis, axisObject)
{
	let domainObject = axisObject.putNewStructure(oFF.ValChartConstants.K_DOMAIN);
	if (chartAxis.getAxisDomain().getAxisDomainType().isTypeOf(oFF.ChartAxisDomainType.CATEGORIAL))
	{
		let categorialDomain = chartAxis.getAxisDomain().getAsCategorial();
		domainObject.putNewList(oFF.ValChartConstants.K_CATEGORIES).addAllStrings(oFF.XStream.of(categorialDomain.getCategories()).collect(oFF.XStreamCollector.toListOfString((cat) => {
			return cat.getText();
		})));
		domainObject.putBoolean(oFF.ValChartConstants.K_IS_ORDINAL, categorialDomain.isOrdinal());
	}
	else
	{
		let scalarDomain = chartAxis.getAxisDomain().getAsScalar();
		domainObject.putDouble(oFF.ValChartConstants.K_MIN, scalarDomain.getMin());
		domainObject.putDouble(oFF.ValChartConstants.K_MAX, scalarDomain.getMax());
	}
	axisObject.putNewStructure(oFF.ValChartConstants.K_TITLE).putString(oFF.ValChartConstants.K_TEXT, chartAxis.getText());
	axisObject.putInteger(oFF.ValChartConstants.K_FROM, chartAxis.getFrom());
	axisObject.putInteger(oFF.ValChartConstants.K_TO, chartAxis.getTo());
	axisObject.putInteger(oFF.ValChartConstants.K_ORDER, chartAxis.getOrder());
	axisObject.putString(oFF.ValChartConstants.K_ORIENTATION, oFF.ValChartValueConverter.convertPosition(chartAxis.getPosition()));
	axisObject.putString(oFF.ValChartConstants.K_GRID_LINE_COLOR, chartAxis.getGridLineColor());
	axisObject.putBoolean(oFF.ValChartConstants.K_FIT_LABELS_INSIDE_COORDINATES, chartAxis.isFitLabelsInsideCoordinates());
	axisObject.putString(oFF.ValChartConstants.K_ID, chartAxis.getName());
	let i;
	let plotBands = chartAxis.getPlotBands();
	if (oFF.XCollectionUtils.hasElements(plotBands))
	{
		let plotBandsList = axisObject.putNewList(oFF.ValChartConstants.K_PLOT_BANDS);
		for (i = 0; i < plotBands.size(); i++)
		{
			this.buildPlotBand(plotBandsList.addNewStructure(), plotBands.get(i));
		}
	}
	let plotLines = chartAxis.getPlotLines();
	if (oFF.XCollectionUtils.hasElements(plotLines))
	{
		let plotLinesList = axisObject.putNewList(oFF.ValChartConstants.K_PLOT_LINES);
		for (i = 0; i < plotLines.size(); i++)
		{
			this.buildPlotLine(plotLinesList.addNewStructure(), plotLines.get(i));
		}
	}
};
oFF.GenericValChartRenderer.prototype.buildChartVisualization = function(chartVisualization, globalStructure, chartStructure)
{
	this.buildGenericProperties(chartVisualization, chartStructure);
	chartStructure.putBoolean(oFF.ValChartConstants.K_INVERTED, chartVisualization.isInverted());
	chartStructure.putBoolean(oFF.ValChartConstants.K_POLAR, chartVisualization.isPolar());
	chartStructure.putString(oFF.ValChartConstants.K_TYPE, chartVisualization.getChartType().getName());
	chartStructure.putString(oFF.ValChartConstants.K_BACKGROUND_COLOR, chartVisualization.getBackgroundColor());
	chartStructure.putString(oFF.ValChartConstants.K_TITLE, chartVisualization.getTitle());
	chartStructure.putString(oFF.ValChartConstants.K_SUB_TITLE, chartVisualization.getSubtitle());
	this.buildAxes(chartVisualization.getXAxes(), oFF.ValChartConstants.K_X_AXIS, globalStructure, chartStructure);
	this.buildAxes(chartVisualization.getYAxes(), oFF.ValChartConstants.K_Y_AXIS, globalStructure, chartStructure);
	this.buildAxes(chartVisualization.getZAxes(), oFF.ValChartConstants.K_Z_AXIS, globalStructure, chartStructure);
	this.buildCoordinateSystems(chartVisualization, globalStructure, chartStructure);
};
oFF.GenericValChartRenderer.prototype.buildCoordinateSystem = function(chartCoordinateSystem, globalStructure, coordinateSystemStructure)
{
	this.buildGenericProperties(chartCoordinateSystem, coordinateSystemStructure);
	if (chartCoordinateSystem.getXAxisReference() !== null)
	{
		coordinateSystemStructure.putString(oFF.ValChartConstants.K_X_AXIS, chartCoordinateSystem.getXAxisReference().getName());
	}
	if (chartCoordinateSystem.getYAxisReference() !== null)
	{
		coordinateSystemStructure.putString(oFF.ValChartConstants.K_Y_AXIS, chartCoordinateSystem.getYAxisReference().getName());
	}
	if (chartCoordinateSystem.getZAxisReference() !== null)
	{
		coordinateSystemStructure.putString(oFF.ValChartConstants.K_Z_AXIS, chartCoordinateSystem.getZAxisReference().getName());
	}
	let seriesGroups = chartCoordinateSystem.getSeriesGroups();
	let seriesGroupList = coordinateSystemStructure.putNewList(oFF.ValChartConstants.K_SERIES_GROUPS);
	for (let i = 0; i < seriesGroups.size(); i++)
	{
		this.buildSeriesGroup(seriesGroups.get(i), globalStructure, seriesGroupList.addNewStructure());
	}
};
oFF.GenericValChartRenderer.prototype.buildCoordinateSystems = function(chartVisualization, globalStructure, chartStructure)
{
	let coordinateSystems = chartVisualization.getCoordinateSystems();
	let coordinateSystemsList = chartStructure.putNewList(oFF.ValChartConstants.K_COORDINATE_SYSTEMS);
	for (let i = 0; i < coordinateSystems.size(); i++)
	{
		this.buildCoordinateSystem(coordinateSystems.get(i), globalStructure, coordinateSystemsList.addNewStructure());
	}
};
oFF.GenericValChartRenderer.prototype.buildDataPoint = function(pointStructure, globalStructure, chartDataPoint)
{
	pointStructure.putString(oFF.ValChartConstants.K_NAME, chartDataPoint.getText());
	let subChart = chartDataPoint.getSubChart();
	if (oFF.notNull(subChart))
	{
		this.buildChartVisualization(subChart, globalStructure, pointStructure.putNewStructure(oFF.ValChartConstants.K_CHART));
	}
	let coordinates = chartDataPoint.getCoordinates();
	for (let i = 0; i < coordinates.size(); i++)
	{
		let coordinate = coordinates.get(i);
		let value = coordinate.getValue();
		if (value.getValueType().isNumber())
		{
			pointStructure.putDouble(coordinate.getName(), oFF.XValueUtil.getDouble(value, false, true));
		}
		else
		{
			pointStructure.putString(coordinate.getName(), oFF.XValueUtil.getString(value));
		}
	}
};
oFF.GenericValChartRenderer.prototype.buildGenericProperties = function(chartPart, chartPartStructure)
{
	chartPartStructure.putString(oFF.ValChartConstants.K_NAME, chartPart.getName());
	chartPartStructure.putString(oFF.ValChartConstants.K_TEXT, chartPart.getText());
};
oFF.GenericValChartRenderer.prototype.buildPlotBand = function(structure, plotBand)
{
	structure.putDouble(oFF.ValChartConstants.K_FROM, plotBand.getFrom());
	structure.putDouble(oFF.ValChartConstants.K_TO, plotBand.getTo());
	structure.putDouble(oFF.ValChartConstants.K_BORDER_WIDTH, plotBand.getBorderWidth());
	structure.putStringNotNullAndNotEmpty(oFF.ValChartConstants.K_COLOR, plotBand.getColor());
	structure.putStringNotNullAndNotEmpty(oFF.ValChartConstants.K_BORDER_COLOR, plotBand.getBorderColor());
	let label = structure.putNewStructure(oFF.ValChartConstants.K_LABEL);
	label.putStringNotNullAndNotEmpty(oFF.ValChartConstants.K_TEXT, plotBand.getText());
};
oFF.GenericValChartRenderer.prototype.buildPlotLine = function(structure, plotLine)
{
	structure.putDouble(oFF.ValChartConstants.K_VALUE, plotLine.getValue());
	structure.putDouble(oFF.ValChartConstants.K_WIDTH, plotLine.getWidth());
	structure.putStringNotNullAndNotEmpty(oFF.ValChartConstants.K_COLOR, plotLine.getColor());
	structure.putStringNotNullAndNotEmpty(oFF.ValChartConstants.K_DASH_STYLE, plotLine.getDashStyle());
	let label = structure.putNewStructure(oFF.ValChartConstants.K_LABEL);
	label.putStringNotNullAndNotEmpty(oFF.ValChartConstants.K_TEXT, plotLine.getText());
};
oFF.GenericValChartRenderer.prototype.buildSeries = function(series, globalStructure, seriesStructure)
{
	this.buildGenericProperties(series, seriesStructure);
	let chartDataPoints = series.getChartDataPoints();
	let data = seriesStructure.putNewList(oFF.ValChartConstants.K_DATA);
	for (let i = 0; i < chartDataPoints.size(); i++)
	{
		this.buildDataPoint(data.addNewStructure(), globalStructure, chartDataPoints.get(i));
	}
};
oFF.GenericValChartRenderer.prototype.buildSeriesGroup = function(seriesGroup, globalStructure, seriesGroupStructure)
{
	this.buildGenericProperties(seriesGroup, seriesGroupStructure);
	seriesGroupStructure.putString(oFF.ValChartConstants.K_TYPE, seriesGroup.getChartType().getName());
	seriesGroupStructure.putString(oFF.ValChartConstants.K_STACKING_TYPE, seriesGroup.getStackingType().getName());
	let series = seriesGroup.getSeries();
	let seriesList = seriesGroupStructure.putNewList(oFF.ValChartConstants.K_SERIES);
	for (let i = 0; i < series.size(); i++)
	{
		this.buildSeries(series.get(i), globalStructure, seriesList.addNewStructure());
	}
};
oFF.GenericValChartRenderer.prototype.getChartJson = function()
{
	return this.m_chartJson;
};
oFF.GenericValChartRenderer.prototype.render = function()
{
	this.m_chartJson = oFF.PrFactory.createStructure();
	this.buildChartVisualization(this.m_chartVisualization, this.m_chartJson, this.m_chartJson);
	return this.m_chartJson;
};
oFF.GenericValChartRenderer.prototype.setChartConfigration = function(chartConfig) {};

oFF.ValChartConstants = {

	K_ACCOUNT_ENTITY_ID:"accountEntityId",
	K_ACCOUNT_ID:"accountId",
	K_AGGREGATION_TYPE:"aggregationType",
	K_ALIGN:"align",
	K_ANALYTIC_OBJECTS:"analyticObjects",
	K_ANIMATION:"animation",
	K_ANSWERS:"answers",
	K_AREA:"area",
	K_ARGUMENTS:"arguments",
	K_ARGUMENT_KEY_INFO:"argumentKeyInfo",
	K_ATTRIBUTE_ID:"attributeId",
	K_AXIS:"axis",
	K_AXIS_LABEL:"axisLabel",
	K_AXIS_LINE:"axisLine",
	K_AXIS_TICK:"axisTick",
	K_BACKGROUND:"background",
	K_BACKGROUND_COLOR:"backgroundColor",
	K_BAR_COLUMN:"barcolumn",
	K_BBACKGROUND_COLOR:"BackgroundColor",
	K_BINDINGS:"bindings",
	K_BOLD:"bold",
	K_BOOST:"boost",
	K_BORDER_COLOR:"borderColor",
	K_BORDER_WIDTH:"borderWidth",
	K_BUBBLE_STYLE:"BubbleStyle",
	K_BUBBLE_STYLING:"bubbleStyling",
	K_BUBBLE_WIDTH:"bubbleWidth",
	K_CALCULATION:"calculation",
	K_CALCULATIONS:"calculations",
	K_CALCULATION_ID:"calculationId",
	K_CALCULATION_VARIABLE:"calculation.variable",
	K_CALCULATION_VARIABLE_ENTITY_ID:"calculationVariableEntityId",
	K_CALC_DAYS_BETWEEN:"CALCDAYSBETWEEN",
	K_CALC_DEF:"def",
	K_CALC_MONTHS_BETWEEN:"CALCMONTHSBETWEEN",
	K_CALC_YEARS_BETWEEN:"CALCYEARSBETWEEN",
	K_CATEGORIES:"categories",
	K_CATEGORY:"category",
	K_CATEGORY_AXIS:"categoryAxis",
	K_CATEGORY_AXIS2:"categoryAxis2",
	K_CATEGORY_FORM:"categoryForm",
	K_CATEGORY_NAME:"categoryName",
	K_CHART:"chart",
	K_CHART_OPTIONS:"chartOptions",
	K_CLUSTER_BUBBLE:"clusterbubble",
	K_COLLISION_DETECTION:"collisionDetection",
	K_COLOR:"color",
	K_COLORS:"colors",
	K_COLOR_AXIS:"colorAxis",
	K_COLOR_BY_POINT:"colorByPoint",
	K_COLOR_FORMATTING:"colorFormatting",
	K_COLOR_NAME:"colorName",
	K_COLOR_SCHEME:"colorScheme",
	K_COLOR_SYNC:"colorSync",
	K_COLOR_VALUE:"colorValue",
	K_COLOR_VALUE_FORMATTED:"colorValueFormatted",
	K_COMB_BCL:"combbcl",
	K_COMB_STACKED_BCL:"combstackedbcl",
	K_COMPARISON_MEASURE_ID:"comparisonMeasureId",
	K_CONDITION:"condition",
	K_CONNECTOR_WIDTH:"connectorWidth",
	K_CONSTANT:"constant",
	K_COORDINATE_SYSTEMS:"coordinateSystems",
	K_CREDITS:"credits",
	K_CROP_THRESHOLD:"cropThreshold",
	K_CUSTOM_COLOR_PALETTES:"custom.color.palettes",
	K_CUSTOM_FORMATTING:"customFormatting",
	K_CUSTOM_TITLE:"customTitle",
	K_DASH_STYLE:"dashStyle",
	K_DATA:"data",
	K_DATA_LABEL:"dataLabel",
	K_DATA_LABELS:"dataLabels",
	K_DATE_TIME:"datetime",
	K_DECIMAL_PLACES:"decimalPlaces",
	K_DECIMAL_POINT:"decimalPoint",
	K_DESCRIPTION:"description",
	K_DIMENSION:"dimension",
	K_DIRECTION:"direction",
	K_DISTANCE:"distance",
	K_DOMAIN:"domain",
	K_DP_NAME:"dpName",
	K_DP_NAMES:"dpNames",
	K_DRILL:"drill",
	K_DRILL_LEVEL:"drillLevel",
	K_DRILL_MODE:"drillMode",
	K_DYNAMIC_VALUE:"dynamicValue",
	K_ENABLED:"enabled",
	K_END:"end",
	K_END_ANGLE:"endAngle",
	K_END_DATE:"endDate",
	K_END_DATE_CURRENT_IF_NULL:"endDateCurrentIfNULL",
	K_ENTITIES:"entities",
	K_ENTITY_FORMAT_INFO:"entityFormatInfos",
	K_ENTITY_ID:"entityId",
	K_ERRORBAR:"errorbar",
	K_ERRORBARS:"errorbars",
	K_ERRORBAR_INFIX:".errorbar.",
	K_ERRORBAR_MAX:".errorbar.max",
	K_ERRORBAR_MIN:".errorbar.min",
	K_ERROR_RANGE:"errorRange",
	K_EXCEPTION_AGGREGATION:"exceptionAggregation",
	K_EXCEPTION_AGGREGATION_DIMENSIONS:"exceptionAggregationDimensions",
	K_EXCLUDE:"exclude",
	K_EXPLICIT_COLOR_ASSIGNMENTS:"explicitColorAssignments",
	K_FEED:"feed",
	K_FEED_MEMBERS:"feedMembers",
	K_FILL:"fill",
	K_FILL_COLOR:"fillColor",
	K_FILTERS:"filters",
	K_FIT_LABELS_INSIDE_COORDINATES:"fitLabelsInsideCoordinates",
	K_FLOATING:"floating",
	K_FONT_FAMILY:"fontFamily",
	K_FONT_SIZE:"fontSize",
	K_FONT_STYLE:"fontStyle",
	K_FONT_WEIGHT:"fontWeight",
	K_FORMAT:"format",
	K_FORMATTING_INFO:"formatingInfo",
	K_FORMAT_INFO:"formatInfo",
	K_FORMAT_STRING:"formatString",
	K_FORMULA:"formula",
	K_FORMULA_ALIASES:"formulaAliases",
	K_FORMULA_AST:"ast",
	K_FORMULA_JSON:"formulaJson",
	K_FROM:"from",
	K_FULL_SCREEN_ENABLED:"fullscreenEnabled",
	K_FULL_STACKING:"fullStacking",
	K_FUNCTION:"function",
	K_GAP:"gap",
	K_GENERAL:"general",
	K_GLOBAL_OBJECTS:"GlobalObjects",
	K_GLOBAL_OBJECT_CALCULATIONS:"Calculations",
	K_GLOBAL_OBJECT_CALCULATION_VARIABLES:"CalculationVariables",
	K_GLOBAL_OBJECT_FIELD_SELECTIONS:"FieldSelections",
	K_GLOBAL_OBJECT_PAGE_FILTER:"pageFilter",
	K_GLOBAL_OBJECT_PAGE_FILTERS:"PageFilters",
	K_GLOBAL_OBJECT_STORY_FILTERS:"StoryFilters",
	K_GRADIENT:"gradient",
	K_GRADIENT_KEYS:"gradientKeys",
	K_GRIDLINE:"gridline",
	K_GRIDLINE_WIDTH:"gridLineWidth",
	K_GRID_LINE_COLOR:"gridLineColor",
	K_GRID_LINE_WIDTH:"gridLineWidth",
	K_GROUP:"group",
	K_GROUPING:"grouping",
	K_HEADER_FORMAT:"headerFormat",
	K_HEATMAP:"heatmap",
	K_HEIGHT:"height",
	K_HIDDEN:"hidden",
	K_HIDE_WHEN_OVERLAP:"hideWhenOverlap",
	K_HIGH:"high",
	K_HIGH_INCLUSIVE:"highInclusive",
	K_ID:"id",
	K_INCLUDE_ONLY_CHILDREN:"includeOnlyChildren",
	K_INCOMPLETE_DATA_INFO:"incompleteDataInfo",
	K_INNER_GROUP_SPACING:"innerGroupSpacing",
	K_INNER_RADIUS:"innerRadius",
	K_INNER_SIZE:"innerSize",
	K_INSIDE:"inside",
	K_INTERVALS:"intervals",
	K_INVERTED:"inverted",
	K_IS_AUTO_TOP_N:"isAutoTopN",
	K_IS_EXCLUDE_COLOR_SYNC:"isExcludeColorSync",
	K_IS_HIDDEN_WHEN_OVERLAP:"isHideWhenOverlap",
	K_IS_INCOMPLETE:"isIncomplete",
	K_IS_ORDINAL:"isOrdinal",
	K_IS_TIME_SERIES:"istimeSeries",
	K_ITEM_STYLE:"itemStyle",
	K_KEY:"key",
	K_LABEL:"label",
	K_LABELS:"labels",
	K_LANG:"lang",
	K_LAYOUT:"layout",
	K_LAYOUT_ALGORITHM:"layoutAlgorithm",
	K_LEGEND:"legend",
	K_LEGEND_GROUP:"legendGroup",
	K_LEVEL:"level",
	K_LEVELS:"levels",
	K_LIMIT:"limit",
	K_LINE:"line",
	K_LINE_COLOR:"lineColor",
	K_LINE_WIDTH:"lineWidth",
	K_LOW:"low",
	K_LOW_INCLUSIVE:"lowInclusive",
	K_MAIN_VALUE:"mainValue",
	K_MARGIN_TOP:"marginTop",
	K_MARIMEKKO:"marimekko",
	K_MARKER:"marker",
	K_MARKERS:"markers",
	K_MAX:"max",
	K_MAXIMUM_FRACTION_DIGITS:"maximumFractionDigits",
	K_MAX_COLOR:"maxColor",
	K_MAX_ELEMENT:"maxElement",
	K_MAX_HEIGHT:"maxHeight",
	K_MAX_PADDING:"maxPadding",
	K_MAX_WIDTH:"maxWidth",
	K_MEASURE:"measure",
	K_MEASURE_ID:"measureId",
	K_MEASURE_SELECTIONS:"measureSelections",
	K_MEASURE_SYNC:"measureSync",
	K_MEMBER:"member",
	K_MEMBERS:"members",
	K_MEMBER_DEFINITIONS:"memberDefinitions",
	K_METRIC:"metric",
	K_MIN:"min",
	K_MINIMUM_FRACTION_DIGITS:"minimumFractionDigits",
	K_MIN_COLOR:"minColor",
	K_MIN_ELEMENT:"minElement",
	K_MIN_HEIGHT:"minHeight",
	K_MIN_PADDING:"minPadding",
	K_MIN_SIZE:"minSize",
	K_MULTIPLIER:"multiplier",
	K_NAME:"name",
	K_NNAME:"Name",
	K_NODEDEPTH:"nodedepth",
	K_NODE_FILTER:"nodeFilter",
	K_NO_DATA:"noData",
	K_NUMBER_FORMATTING:"numberFormatting",
	K_OPPOSITE:"opposite",
	K_OPTIONS:"options",
	K_ORDER:"order",
	K_ORIENTATION:"orientation",
	K_ORIGINAL_BINDINGS:"originalBindings",
	K_ORIGINAL_VALUES:"originalValues",
	K_OUTER_RADIUS:"outerRadius",
	K_PACKED_BUBBLE:"packedbubble",
	K_PADDING_BOTTOM:"paddingBottom",
	K_PAGE_ID:"pageId",
	K_PALETTE:"palette",
	K_PALETTE_COLORS:"paletteColors",
	K_PALETTE_DESC:"paletteDesc",
	K_PANE:"pane",
	K_PARENT:"parent",
	K_PARENT_KEY:"parentKey",
	K_PATH:"path",
	K_PATTERN:"pattern",
	K_PATTERN_FORMATTING:"patternFormatting",
	K_PATTERN_HATCHING1:"hatching1",
	K_PATTERN_HATCHING2:"hatching2",
	K_PATTERN_HATCHING3:"hatching3",
	K_PATTERN_HATCHING4:"hatching4",
	K_PATTERN_HATCHING5:"hatching5",
	K_PATTERN_HATCHING6:"hatching6",
	K_PATTERN_HATCHING7:"hatching7",
	K_PATTERN_HATCHING8:"hatching8",
	K_PATTERN_NON_FILL:"nonFill",
	K_PERCENT:"percent",
	K_PIE:"pie",
	K_PLACEHOLDER_2_ID:"placeholder2Id",
	K_PLACEMENT_STRATEGY:"placementStrategy",
	K_PLOT_AREA:"plotArea",
	K_PLOT_BANDS:"plotBands",
	K_PLOT_LINES:"plotLines",
	K_PLOT_OPTIONS:"plotOptions",
	K_POINT_FORMAT:"pointFormat",
	K_POINT_PADDING:"pointPadding",
	K_POLAR:"polar",
	K_POSITION:"position",
	K_PROPERTIES:"properties",
	K_RADAR:"radar",
	K_RANK:"ranking",
	K_RANK_BY:"rankBy",
	K_REFERENCELINES:"referenceLines",
	K_REFERENCE_MEASURE_ID:"referenceMeasureId",
	K_RESPONSIVE:"responsive",
	K_RESTRICTED_MEASURE:"restrictedMeasure",
	K_RESULT_GRANULARITY:"resultGranularity",
	K_REVERSED:"reversed",
	K_ROTATION:"rotation",
	K_ROW_LIMIT:"rowLimit",
	K_RULES:"rules",
	K_SCALE:"scale",
	K_SCATTER:"scatter",
	K_SCATTER_PLOT:"scatterplot",
	K_SCROLL_BAR:"scrollbar",
	K_SELECTED_DIMENSION_ID:"selectedDimensionId",
	K_SELECTED_MEASURE:"selectedMeasure",
	K_SELECTIONS:"selections",
	K_SELECTION_INFOS:"selectionInfos",
	K_SERIES:"series",
	K_SERIES_GROUPS:"seriesGroups",
	K_SERIES_X:"SeriesX",
	K_SERIES_Y:"SeriesY",
	K_SERIES_Z:"SeriesZ",
	K_SHAPE:"shape",
	K_SHAPE_OPTIONS:"shapeOptions",
	K_SHORT_DOT:"ShortDot",
	K_SHOW_FULL:"showFull",
	K_SHOW_FULL_LABEL:"showFullLabel",
	K_SHOW_IN_LEGEND:"showInLegend",
	K_SHOW_LABEL_GRIDS:"showLabelGrids",
	K_SHOW_LABEL_NAMES:"showLabelNames",
	K_SHOW_SIGN_AS:"showSignAs",
	K_SIGNED_DATA:"SignedData",
	K_SIZE:"size",
	K_SIZE_BY_ABSOLUTE_VALUE:"sizeByAbsoluteValue",
	K_SOLID_GAUGE:"solidgauge",
	K_SORT:"sort",
	K_SORT_BY:"sortBy",
	K_SOURCE:"source",
	K_SPACING_BOTTOM:"spacingBottom",
	K_SPACING_TOP:"spacingTop",
	K_SPLINE:"spline",
	K_SQUARE_SYMBOL:"squareSymbol",
	K_STACK:"stack",
	K_STACKED_BAR:"stackedbar",
	K_STACKED_COLUMN:"stackedcolumn",
	K_STACKING:"stacking",
	K_STACKING_TYPE:"stackingType",
	K_STACK_COLUMN_LABEL:"stackColumnLabel",
	K_STACK_LABELS:"stackLabels",
	K_START:"start",
	K_START_ANGLE:"startAngle",
	K_START_DATE:"startDate",
	K_START_DATE_CURRENT_IF_NULL:"startDateCurrentIfNULL",
	K_STOPS:"stops",
	K_STORY_WIDE_SETTINGS:"storyWideSettings",
	K_STROKE:"stroke",
	K_STYLE:"style",
	K_SUBTITLE:"subtitle",
	K_SUB_TITLE:"subTitle",
	K_SUGGESTED_SUB_TITLE:"suggestedSubTitle",
	K_SUGGESTED_TITLE:"suggestedTitle",
	K_SYMBOL:"symbol",
	K_SYMBOL_RADIUS:"symbolRadius",
	K_S_KEY:"sKey",
	K_TARGET_FORMATTED:"targetFormatted",
	K_TARGET_VALUE:"targetValue",
	K_TARGET_VALUES:"targetValues",
	K_TEXT:"text",
	K_TEXT_OUTLINE:"textOutline",
	K_THOUSANDS_SEP:"thousandsSep",
	K_THRESHOLD:"threshold",
	K_THRESHOLDS:"thresholds",
	K_THRESHOLD_REFERENCE:"thresholdReference",
	K_TICK_AMOUNT:"tickAmount",
	K_TICK_COLOR:"tickColor",
	K_TICK_LENGTH:"tickLength",
	K_TICK_WIDTH:"tickWidth",
	K_TIME_AXIS:"timeAxis",
	K_TIME_SERIES:"timeseries",
	K_TITLE:"title",
	K_TO:"to",
	K_TOOLTIP:"tooltip",
	K_TOOLTIP_VALUE_AXIS:"tooltipValueAxis",
	K_TRANSPARENT:"transparent",
	K_TREEMAP:"treemap",
	K_TYPE:"type",
	K_T_FORMATTED:"tFormatted",
	K_T_HEADER:"tHeader",
	K_UNIT:"unit",
	K_USER_DEFINED_DECIMAL_FORMAT:"userDefinedDecimalFormat",
	K_USER_DEFINED_NUMERIC_SCALES:"userDefinedNumberScales",
	K_USER_DEFINED_SHOW_SIGN_AS:"userDefinedShowSignAs",
	K_USER_GPU_TRANSLATIONS:"useGPUTranslations",
	K_USER_PREFERENCES:"userPreferences",
	K_VALUE:"value",
	K_VALUES:"values",
	K_VALUE_AXIS:"valueAxis",
	K_VALUE_AXIS2:"valueAxis2",
	K_VALUE_FORMATTED:"valueFormatted",
	K_VALUE_NAME:"valueName",
	K_VARIANCE:"variance",
	K_VARIANCES:"variances",
	K_VARIANCE_CHART:"varianceChart",
	K_VARIANCE_LABEL:"varianceLabel",
	K_VARIPIE:"variablepie",
	K_VARIWIDE:"variwide",
	K_VERTICAL_ALIGN:"verticalAlign",
	K_VISIBLE:"visible",
	K_VIZDEF_FILTERS:"VizdefFilters",
	K_WEIGHT:"weight",
	K_WEIGHT_FORMATTED:"weightFormatted",
	K_WIDGET_ID:"widgetId",
	K_WIDTH:"width",
	K_WORDCLOUD:"wordcloud",
	K_X:"x",
	K_X_AXIS:"xAxis",
	K_X_CATEGORY:"xCategory",
	K_X_FORMATTED:"xFormatted",
	K_X_NAME:"xName",
	K_Y:"y",
	K_Y_AXIS:"yAxis",
	K_Y_CATEGORY:"yCategory",
	K_Y_FORM:"yForm",
	K_Y_FORMATTED:"yFormatted",
	K_Y_NAME:"yName",
	K_Z:"z",
	K_Z_AXIS:"zAxis",
	K_Z_FORMATTED:"zFormatted",
	K_Z_INDEX:"zIndex",
	K_Z_NAME:"zName",
	V_ABSOLUTE:"absolute",
	V_ALL:"all",
	V_ARC:"arc",
	V_BAD:"Bad",
	V_BASE_PLOTLINE_ID:"BASE_PLOTLINE_ID",
	V_BILLION:"Billion",
	V_BLACK:"black",
	V_BOTTOM:"bottom",
	V_CENTER:"center",
	V_CHART_TYPE_BAR:"bar",
	V_CHART_TYPE_BELLCURVE:"bellcurve",
	V_CHART_TYPE_BOXPLOT:"boxplot",
	V_CHART_TYPE_BUBBLE:"bubble",
	V_CHART_TYPE_COLUMN:"column",
	V_CIRCLE:"circle",
	V_COLOR_1:"#9dc3e6",
	V_COLOR_10:"#dbdbdb",
	V_COLOR_11:"#c9c9c9",
	V_COLOR_12:"#7c7c7c",
	V_COLOR_13:"#6c6c6c",
	V_COLOR_14:"#222a35",
	V_COLOR_15:"#000000",
	V_COLOR_16:"#4a3f93",
	V_COLOR_17:"#c9024a",
	V_COLOR_18:"#37962d",
	V_COLOR_2:"#4EA3D6",
	V_COLOR_3:"#0f7daf",
	V_COLOR_4:"#0c648c",
	V_COLOR_5:"#094d6b",
	V_COLOR_6:"#ffe699",
	V_COLOR_7:"#ffd966",
	V_COLOR_8:"#bf9000",
	V_COLOR_9:"#7f6000",
	V_CRITICAL:"Critical",
	V_CURRENT_DATE:"CURRENT_DATE",
	V_DAY:"DAY",
	V_DIRECTION_ASC:"ascending",
	V_DIRECTION_DESC:"descending",
	V_ERROR:"Error",
	V_FEED_BUBBLE_WEIGHT:"bubbleWidth",
	V_FEED_CATEGORY_AXIS:"categoryAxis",
	V_FEED_CATEGORY_AXIS2:"categoryAxis2",
	V_FEED_COLOR:"color",
	V_FEED_DATA_CONTEXT:"dataContext",
	V_FEED_DATA_CONTEXT2:"dataContext2",
	V_FEED_PATTERN2:"pattern2",
	V_FEED_SIZE:"size",
	V_FEED_TIME_AXIS:"timeAxis",
	V_FEED_TITLE:"title",
	V_FEED_TOOLTIP_CATEGORY_AXIS:"tooltipCategoryAxis",
	V_FEED_TOOLTIP_VALUE_AXIS:"tooltipValueAxis",
	V_FEED_TRELLIS:"trellis",
	V_FEED_VALUE_AXIS:"valueAxis",
	V_FEED_VALUE_AXIS2:"valueAxis2",
	V_FEED_WEIGHT:"weight",
	V_FONT_WEIGHT_BOLD:"bold",
	V_FONT_WEIGHT_NORMAL:"normal",
	V_HORIZONTAL:"horizontal",
	V_ID:"id",
	V_ID_AND_DESCRIPTION:"idAndDescription",
	V_LEFT:"left",
	V_MIDDLE:"middle",
	V_MILLION:"Million",
	V_MONTH:"MONTH",
	V_NORMAL:"normal",
	V_OK:"OK",
	V_PATTERN_PATH_HATCHING1:"M 12 0 L 0 12 M -12 12 L 12 -12 M 24 0 L 0 24",
	V_PATTERN_PATH_HATCHING2:"M 12 0 L 0 12 M -12 12 L 12 -12 M 24 0 L 0 24 M 13 1 L 1 13 M -11 13 L 13 -11 M 25 1 L 1 25 M 1 -11 L -11 1",
	V_PATTERN_PATH_HATCHING3:"M 12 0 L 0 12 M -12 12 L 12 -12 M 24 0 L 0 24 M 13 1 L 1 13 M -11 13 L 13 -11 M 25 1 L 1 25 M 1 -11 L -11 1 M 14 2 L 2 14 M -10 14 L 14 -10 M 26 2 L 2 26 M 2 -10 L -10 2 M 11 -1 L -1 11 M -13 11 L 11 -13 M 23 -1 L -1 23 M 23 11 L 11 23",
	V_PATTERN_PATH_HATCHING4:"M 1 1 L 1 2 Z M 3 3 L 3 4 Z",
	V_PATTERN_PATH_HATCHING5:"M 1 1 L 1 2 Z M 4 4 L 4 5 Z",
	V_PATTERN_PATH_HATCHING6:"M 1 1 L 1 2 Z M 5 5 L 5 6 Z",
	V_PATTERN_PATH_HATCHING7:"M 1 1 L 1 2 Z M 5 5 L 7 6 L 6 6 L 6 5 L 5 5 Z",
	V_PATTERN_PATH_HATCHING8:"M 0 0 L 0 5 L 4 5 L 4 0 L 3 0 L 3 5 L 2 5 L 2 0 L 1 0 L 1 5 L 5 5 L 5 0 L 0 0 Z M 6 6 L 6 5 L 10 11 L 10 6 L 9 6 L 9 11 L 8 11 L 8 6 L 7 6 L 7 11 L 11 11 L 11 6 L 6 6 Z",
	V_PATTERN_SIZE_HATCHING1:12,
	V_PATTERN_SIZE_HATCHING2:12,
	V_PATTERN_SIZE_HATCHING3:12,
	V_PATTERN_SIZE_HATCHING4:5,
	V_PATTERN_SIZE_HATCHING5:7,
	V_PATTERN_SIZE_HATCHING6:9,
	V_PATTERN_SIZE_HATCHING7:9,
	V_PATTERN_SIZE_HATCHING8:12,
	V_PERCENT:"percent",
	V_PERCENTAGE:"percentage",
	V_RIGHT:"right",
	V_STACKED_BAR:"stackedbar",
	V_STACKED_COLUMN:"stackedcolumn",
	V_THOUSAND:"Thousand",
	V_TOP:"top",
	V_TREEMAP_LAYOUT_SQUARIFIED:"squarified",
	V_TREEMAP_LAYOUT_STRIP:"strip",
	V_TYPE_AXIS_MEMBER_CALCDIM:"calculatedDimension",
	V_TYPE_AXIS_MEMBER_CALCULATION:"calculation",
	V_TYPE_AXIS_MEMBER_DIM:"dimension",
	V_TYPE_AXIS_MEMBER_MEMBER:"member",
	V_TYPE_AXIS_MEMBER_RESTRICTED:"restrictedMeasure",
	V_TYPE_BARCOLUMN:"barcolumn",
	V_TYPE_CALCULATION:"calculation",
	V_TYPE_CHART_DONUT:"donut",
	V_TYPE_CHART_PIE:"pie",
	V_TYPE_DATASET:"dataset",
	V_TYPE_DIMENSION:"dimension",
	V_TYPE_DIMENSION_SELECTION:"dimension.selection",
	V_TYPE_FILTER_COMPLEX:"complex",
	V_TYPE_FILTER_FILTER:"filter",
	V_TYPE_FILTER_MEMBER:"member",
	V_TYPE_HIERCHY_PCH:"hierarchy.pch",
	V_TYPE_MEASURE_SELECTION:"measure.selection",
	V_TYPE_MEMBER:"member",
	V_TYPE_SORT_DIMENSION:"dimension",
	V_VERTICAL:"vertical",
	V_WARNING:"Warning",
	V_YEAR:"YEAR"
};

oFF.ValChartValueConverter = {

	convertPosition:function(position)
	{
			if (position === oFF.ChartVisualizationAxisPosition.Y_LEFT)
		{
			return oFF.ValChartConstants.V_LEFT;
		}
		if (position === oFF.ChartVisualizationAxisPosition.Y_RIGHT)
		{
			return oFF.ValChartConstants.V_RIGHT;
		}
		if (position === oFF.ChartVisualizationAxisPosition.Y)
		{
			return oFF.ValChartConstants.V_LEFT;
		}
		if (position === oFF.ChartVisualizationAxisPosition.X_TOP)
		{
			return oFF.ValChartConstants.V_TOP;
		}
		if (position === oFF.ChartVisualizationAxisPosition.X_BOTTOM)
		{
			return oFF.ValChartConstants.V_BOTTOM;
		}
		if (position === oFF.ChartVisualizationAxisPosition.X)
		{
			return oFF.ValChartConstants.V_BOTTOM;
		}
		if (position === oFF.ChartVisualizationAxisPosition.Z)
		{
			return oFF.ValChartConstants.V_LEFT;
		}
		return oFF.ValChartConstants.V_LEFT;
	}
};

oFF.VisualizationDataPointMatcher = function() {};
oFF.VisualizationDataPointMatcher.prototype = new oFF.XObject();
oFF.VisualizationDataPointMatcher.prototype._ff_c = "VisualizationDataPointMatcher";

oFF.VisualizationDataPointMatcher.create = function()
{
	let instance = new oFF.VisualizationDataPointMatcher();
	instance.setup();
	return instance;
};
oFF.VisualizationDataPointMatcher.matchesPath = function(pathReference, exceptionInfo)
{
	return oFF.XStream.of(pathReference).allMatch((dpr) => {
		return oFF.XStream.of(exceptionInfo.getDataSectionInfoTags()).anyMatch((dpt) => {
			return dpt.matches(dpr);
		});
	});
};
oFF.VisualizationDataPointMatcher.matchesTag = function(tags, exceptionInfo)
{
	return oFF.XStream.ofString(tags).allMatch((tag) => {
		return exceptionInfo.getTags().contains(tag.getString());
	});
};
oFF.VisualizationDataPointMatcher.prototype.m_matchedAlertLevels = null;
oFF.VisualizationDataPointMatcher.prototype.m_matchedAlertLevelsByException = null;
oFF.VisualizationDataPointMatcher.prototype.m_matchedExceptionNames = null;
oFF.VisualizationDataPointMatcher.prototype.m_matchedPathElements = null;
oFF.VisualizationDataPointMatcher.prototype.m_matchedValueSigns = null;
oFF.VisualizationDataPointMatcher.prototype.m_matchedValueSignsByPath = null;
oFF.VisualizationDataPointMatcher.prototype.complementMatchingAlertLevels = function(matchedAlertLevels, alertLevelMin, alertLevelMax)
{
	if (oFF.notNull(alertLevelMin) || oFF.notNull(alertLevelMax))
	{
		for (let i = oFF.isNull(alertLevelMin) ? 0 : alertLevelMin.getLevel(); i <= (oFF.isNull(alertLevelMax) ? 9 : alertLevelMax.getLevel()); i++)
		{
			matchedAlertLevels.add(oFF.SacAlertLevel.getByLevelValue(i));
		}
	}
};
oFF.VisualizationDataPointMatcher.prototype.matchesStyleCriterion = function(dataPointContext, exceptionInfo, elementSupplier)
{
	let exceptionName = exceptionInfo.getExceptionName();
	let valueSign = exceptionInfo.getValueSign();
	let alertLevel = exceptionInfo.getLevel();
	let exceptionNameReference = dataPointContext.getExceptionName();
	let valueSignReference = dataPointContext.getValueSign();
	let alertLevelMin = dataPointContext.getAlertLevelMin();
	let alertLevelMax = dataPointContext.getAlertLevelMax();
	let pathReference = dataPointContext.getPathElements();
	let hasPathElement = oFF.XCollectionUtils.hasElements(pathReference);
	let tags = dataPointContext.getTags();
	let hasTags = oFF.XCollectionUtils.hasElements(tags);
	let exceptionAlertLevels = oFF.isNull(exceptionNameReference) ? this.m_matchedAlertLevels : this.m_matchedAlertLevelsByException.getByKey(exceptionNameReference);
	let valueSigns = hasPathElement ? this.m_matchedValueSignsByPath.getByKey(pathReference) : this.m_matchedValueSigns;
	let matchesException = !dataPointContext.isUnmatchedExceptions() && oFF.XStringUtils.isNullOrEmpty(exceptionNameReference) || oFF.XString.isEqual(exceptionNameReference, exceptionName);
	let matchesRemainingExceptions = !hasPathElement && dataPointContext.isUnmatchedExceptions() && !this.m_matchedExceptionNames.contains(exceptionName) && oFF.isNull(valueSignReference);
	let fitsLowerBound = !dataPointContext.isUnmatchedAlertLevels() && oFF.isNull(alertLevelMin) || oFF.notNull(alertLevelMin) && alertLevelMin.getLevel() <= alertLevel.getLevel();
	let fitsUpperBound = !dataPointContext.isUnmatchedAlertLevels() && oFF.isNull(alertLevelMax) || oFF.notNull(alertLevelMax) && alertLevelMax.getLevel() >= alertLevel.getLevel();
	let fitsRemainingLevels = !hasPathElement && dataPointContext.isUnmatchedAlertLevels() && oFF.isNull(valueSignReference) && (oFF.isNull(exceptionAlertLevels) || !exceptionAlertLevels.contains(alertLevel));
	let matchesValueSign = !dataPointContext.isUnmatchedValueSigns() && oFF.isNull(valueSignReference) || valueSignReference === valueSign;
	let matchesRemainingValueSign = !hasPathElement && dataPointContext.isUnmatchedValueSigns() && !valueSigns.contains(valueSign) && oFF.isNull(exceptionName) && oFF.isNull(alertLevelMax) && oFF.isNull(alertLevelMin);
	let matchesPathReference = oFF.VisualizationDataPointMatcher.matchesPath(pathReference, exceptionInfo);
	let matchesPathElement = !dataPointContext.isUnmatchedPathElements() && !hasPathElement || matchesPathReference;
	let matchesRemainingPathElement = dataPointContext.isUnmatchedPathElements() && !matchesPathReference;
	let matchesTags = oFF.VisualizationDataPointMatcher.matchesTag(tags, exceptionInfo);
	let matchesTag = !dataPointContext.isUnmatchedTags() && !hasTags || matchesTags;
	let matchesRemainingTag = dataPointContext.isUnmatchedTags() && !matchesTags;
	return (matchesException || matchesRemainingExceptions) && (fitsLowerBound && fitsUpperBound || fitsRemainingLevels) && (matchesValueSign || matchesRemainingValueSign) && (matchesPathElement || matchesRemainingPathElement) && (matchesTag || matchesRemainingTag);
};
oFF.VisualizationDataPointMatcher.prototype.releaseObject = function()
{
	this.m_matchedValueSigns = oFF.XObjectExt.release(this.m_matchedValueSigns);
	this.m_matchedExceptionNames = oFF.XObjectExt.release(this.m_matchedExceptionNames);
	this.m_matchedAlertLevelsByException = oFF.XObjectExt.release(this.m_matchedAlertLevelsByException);
	this.m_matchedAlertLevels = oFF.XObjectExt.release(this.m_matchedAlertLevels);
	this.m_matchedPathElements = oFF.XObjectExt.release(this.m_matchedPathElements);
	this.m_matchedValueSignsByPath = oFF.XObjectExt.release(this.m_matchedValueSignsByPath);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.VisualizationDataPointMatcher.prototype.setup = function()
{
	oFF.XObject.prototype.setup.call( this );
	this.m_matchedValueSigns = oFF.XSetOfNameObject.create();
	this.m_matchedExceptionNames = oFF.XHashSetOfString.create();
	this.m_matchedAlertLevelsByException = oFF.XHashMapByString.create();
	this.m_matchedAlertLevels = oFF.XSetOfNameObject.create();
	this.m_matchedValueSignsByPath = oFF.XSimpleMap.create();
	this.m_matchedPathElements = oFF.XList.create();
};
oFF.VisualizationDataPointMatcher.prototype.tagMatchingStyleCriteria = function(dataPointContext)
{
	let valueSign = dataPointContext.getValueSign();
	let exceptionName = dataPointContext.getExceptionName();
	let alertLevelMin = dataPointContext.getAlertLevelMin();
	let alertLevelMax = dataPointContext.getAlertLevelMax();
	let pathElements = dataPointContext.getPathElements();
	let hasPathElements = oFF.XCollectionUtils.hasElements(pathElements);
	if (oFF.notNull(valueSign) && !hasPathElements && oFF.isNull(exceptionName) && oFF.isNull(alertLevelMax) && oFF.isNull(alertLevelMin))
	{
		oFF.XCollectionUtils.addIfNotPresent(this.m_matchedValueSigns, valueSign);
	}
	if (hasPathElements && oFF.isNull(exceptionName) && oFF.isNull(alertLevelMax) && oFF.isNull(alertLevelMin))
	{
		oFF.XCollectionUtils.addIfNotPresent(this.m_matchedPathElements, pathElements);
		if (oFF.notNull(valueSign))
		{
			if (!this.m_matchedValueSignsByPath.containsKey(pathElements))
			{
				this.m_matchedValueSignsByPath.put(pathElements, oFF.XSetOfNameObject.create());
			}
			this.m_matchedValueSignsByPath.getByKey(pathElements).add(valueSign);
		}
	}
	if (oFF.notNull(exceptionName) && oFF.isNull(valueSign) && !hasPathElements)
	{
		oFF.XCollectionUtils.addIfNotPresent(this.m_matchedExceptionNames, exceptionName);
		if (!this.m_matchedAlertLevelsByException.containsKey(exceptionName))
		{
			this.m_matchedAlertLevelsByException.put(exceptionName, oFF.XSetOfNameObject.create());
		}
		this.complementMatchingAlertLevels(this.m_matchedAlertLevelsByException.getByKey(exceptionName), alertLevelMin, alertLevelMax);
	}
	if (oFF.isNull(exceptionName) && oFF.isNull(valueSign) && !hasPathElements)
	{
		this.complementMatchingAlertLevels(this.m_matchedAlertLevels, alertLevelMin, alertLevelMax);
	}
};

oFF.TableClipboardHelperGeneric = function() {};
oFF.TableClipboardHelperGeneric.prototype = new oFF.XObject();
oFF.TableClipboardHelperGeneric.prototype._ff_c = "TableClipboardHelperGeneric";

oFF.TableClipboardHelperGeneric.NEW_LINE = "\n";
oFF.TableClipboardHelperGeneric.TAB = "\t";
oFF.TableClipboardHelperGeneric.prototype.m_clipboardBehaviour = null;
oFF.TableClipboardHelperGeneric.prototype.applyPadding = function(paddingStructure, padding, paddingKey)
{
	if (padding > -1)
	{
		paddingStructure.putDouble(paddingKey, padding);
	}
};
oFF.TableClipboardHelperGeneric.prototype.copyCellsToString = function(selection)
{
	let copyStructure = this.copyCells(selection);
	let colMin = copyStructure.getIntegerByKey(oFF.SacTable.SELECTION_COL_MIN);
	let oldRow = copyStructure.getIntegerByKey(oFF.SacTable.SELECTION_ROW_MIN);
	let oldCol = colMin;
	let cellList = copyStructure.getListByKey(oFF.SacTable.SELECTION_LIST);
	let sortedList = oFF.XList.create();
	sortedList.addAll(cellList);
	sortedList.sortByComparator(oFF.XComparatorLambda.create((first, second) => {
		let firstStruct = first.asStructure();
		let secondStruct = second.asStructure();
		let firstRow = firstStruct.getIntegerByKey(oFF.SacTableConstants.C_N_ROW);
		let secondRow = secondStruct.getIntegerByKey(oFF.SacTableConstants.C_N_ROW);
		let firstColumn = firstStruct.getIntegerByKey(oFF.SacTableConstants.C_N_COLUMN);
		let secondColumn = secondStruct.getIntegerByKey(oFF.SacTableConstants.C_N_COLUMN);
		return oFF.XIntegerValue.create(firstRow === secondRow ? firstColumn - secondColumn : firstRow - secondRow);
	}));
	let size = sortedList.size();
	let stringBuffer = oFF.XStringBuffer.create();
	for (let i = 0; i < size; i++)
	{
		let cellStructure = sortedList.get(i).asStructure();
		let column = cellStructure.getIntegerByKey(oFF.SacTableConstants.C_N_COLUMN);
		let row = cellStructure.getIntegerByKey(oFF.SacTableConstants.C_N_ROW);
		if (i > 0 && oldCol === column && oldRow === row)
		{
			continue;
		}
		while (oldRow < row)
		{
			stringBuffer.append(oFF.TableClipboardHelperGeneric.NEW_LINE);
			oldRow++;
			oldCol = colMin;
		}
		if (oldCol > column)
		{
			continue;
		}
		while (oldCol < column)
		{
			stringBuffer.append(oFF.TableClipboardHelperGeneric.TAB);
			oldCol++;
		}
		stringBuffer.append(this.csvEscape(cellStructure.getStringByKey(oFF.SacTableConstants.C_S_PASTABLE), oFF.TableClipboardHelperGeneric.TAB));
	}
	return stringBuffer.toString();
};
oFF.TableClipboardHelperGeneric.prototype.csvEscape = function(raw, sep)
{
	if (oFF.isNull(raw))
	{
		return "";
	}
	if (oFF.XString.containsString(raw, "\"") || oFF.XString.containsString(raw, sep) || oFF.XString.containsString(raw, "\n"))
	{
		return oFF.XStringUtils.concatenate3("\"", oFF.XString.replace(raw, "\"", "\"\""), "\"");
	}
	return raw;
};
oFF.TableClipboardHelperGeneric.prototype.getFont = function(structure)
{
	let style = this.getStyle(structure);
	let font = style.getStructureByKey(oFF.SacTableConstants.ST_M_FONT);
	if (oFF.isNull(font))
	{
		font = style.putNewStructure(oFF.SacTableConstants.ST_M_FONT);
	}
	return font;
};
oFF.TableClipboardHelperGeneric.prototype.getLineInternal = function(position, structure)
{
	let style = this.getStyle(structure);
	if (!style.containsKey(oFF.SacTableConstants.ST_L_LINES))
	{
		style.putNewList(oFF.SacTableConstants.ST_L_LINES);
	}
	let lines = style.getListByKey(oFF.SacTableConstants.ST_L_LINES);
	let line = null;
	for (let i = 0; i < lines.size(); i++)
	{
		if (lines.getStructureAt(i).getIntegerByKey(oFF.SacTableConstants.SL_N_POSITION) === position)
		{
			line = lines.getStructureAt(i);
		}
	}
	if (oFF.isNull(line))
	{
		line = lines.addNewStructure();
		line.putInteger(oFF.SacTableConstants.SL_N_SIZE, 1);
		line.putInteger(oFF.SacTableConstants.SL_N_STYLE, 1);
		line.putInteger(oFF.SacTableConstants.SL_N_POSITION, position);
		let padding = line.putNewStructure(oFF.SacTableConstants.SL_M_PADDING);
		if (position === oFF.SacTableConstants.LP_BOTTOM || position === oFF.SacTableConstants.LP_TOP)
		{
			padding.putInteger(oFF.SacTableConstants.SLP_N_RIGHT, oFF.SacTableConstants.LP_RIGHT);
			padding.putInteger(oFF.SacTableConstants.SLP_N_LEFT, oFF.SacTableConstants.LP_RIGHT);
		}
		else
		{
			padding.putInteger(oFF.SacTableConstants.SLP_N_BOTTOM, oFF.SacTableConstants.LP_BOTTOM);
			padding.putInteger(oFF.SacTableConstants.SLP_N_TOP, oFF.SacTableConstants.LP_TOP);
		}
	}
	return line;
};
oFF.TableClipboardHelperGeneric.prototype.getLocalizedNumber = function(plainValue)
{
	return plainValue.getStringRepresentation();
};
oFF.TableClipboardHelperGeneric.prototype.getStyle = function(structure)
{
	if (!structure.containsKey(oFF.SacTableConstants.C_M_STYLE))
	{
		structure.putBoolean(oFF.SacTableConstants.C_B_STYLE_UPDATED_BY_USER, true);
		structure.putNewStructure(oFF.SacTableConstants.C_M_STYLE);
	}
	return structure.getStructureByKey(oFF.SacTableConstants.C_M_STYLE);
};
oFF.TableClipboardHelperGeneric.prototype.isSuppressedMultiSelectAttempt = function(selection)
{
	return this.m_clipboardBehaviour === oFF.TableClipboardBehaviour.SINGLE_SELECT && oFF.notNull(selection) && selection.isList() && selection.asList().size() > 1;
};
oFF.TableClipboardHelperGeneric.prototype.pasteLine = function(cells, rowIndex, column, cellValues)
{
	for (let i = 0; i < cellValues.size(); i++)
	{
		let colIndex = column + i;
		let cellValue = cellValues.get(i);
		if (colIndex < cells.size())
		{
			let newCell = cells.get(colIndex);
			newCell.setFormatted(cellValue);
			newCell.setPlain(oFF.XStringValue.create(cellValue));
		}
	}
};
oFF.TableClipboardHelperGeneric.prototype.setup = function()
{
	this.m_clipboardBehaviour = oFF.TableClipboardBehaviour.SINGLE_SELECT;
};
oFF.TableClipboardHelperGeneric.prototype.transferStyledLineToJson = function(effectiveLineStyle, lpKey, structureToFormat)
{
	if (!oFF.SacStyleUtils.isStyleLineEmpty(effectiveLineStyle))
	{
		let line = this.getLineInternal(lpKey, structureToFormat);
		line.putStringNotNullAndNotEmpty(oFF.SacTableConstants.SL_S_COLOR, effectiveLineStyle.getColor());
		if (effectiveLineStyle.getWidth() > -1)
		{
			line.putDouble(oFF.SacTableConstants.SL_N_SIZE, effectiveLineStyle.getWidth());
		}
		if (effectiveLineStyle.hasPadding())
		{
			let paddingStructure = line.putNewStructure(oFF.SacTableConstants.SL_M_PADDING);
			this.applyPadding(paddingStructure, effectiveLineStyle.getLeftPadding(), oFF.SacTableConstants.SLP_N_LEFT);
			this.applyPadding(paddingStructure, effectiveLineStyle.getRightPadding(), oFF.SacTableConstants.SLP_N_RIGHT);
			this.applyPadding(paddingStructure, effectiveLineStyle.getTopPadding(), oFF.SacTableConstants.SLP_N_TOP);
			this.applyPadding(paddingStructure, effectiveLineStyle.getBottomPadding(), oFF.SacTableConstants.SLP_N_BOTTOM);
		}
		let lineStyle = effectiveLineStyle.getLineStyle();
		if (lineStyle === oFF.SacTableLineStyle.DASHED)
		{
			line.putInteger(oFF.SacTableConstants.SL_N_STYLE, oFF.SacTableConstants.LS_DASHED);
		}
		else if (lineStyle === oFF.SacTableLineStyle.DOTTED)
		{
			line.putInteger(oFF.SacTableConstants.SL_N_STYLE, oFF.SacTableConstants.LS_DOTTED);
		}
		else if (lineStyle === oFF.SacTableLineStyle.SOLID)
		{
			line.putInteger(oFF.SacTableConstants.SL_N_STYLE, oFF.SacTableConstants.LS_SOLID);
		}
		else if (lineStyle === oFF.SacTableLineStyle.NONE)
		{
			line.putInteger(oFF.SacTableConstants.SL_N_STYLE, oFF.SacTableConstants.LS_NONE);
		}
		let linePatternType = effectiveLineStyle.getPatternType();
		if (oFF.notNull(linePatternType))
		{
			let patternStructure = line.putNewStructure(oFF.SacTableConstants.SL_M_PATTERN);
			if (linePatternType === oFF.VisualizationBackgroundPatternType.WHITE_FILL)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_WHITE_FILL);
			}
			else if (linePatternType === oFF.VisualizationBackgroundPatternType.NOFILL)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_NON_FILL);
			}
			else if (linePatternType === oFF.VisualizationBackgroundPatternType.SOLID)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_SOLID);
			}
			else if (linePatternType === oFF.VisualizationBackgroundPatternType.BACKGROUND_IMAGE)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_BACKGROUND_IMAGE);
				patternStructure.putStringNotNullAndNotEmpty(oFF.SacTableConstants.LP_S_BACKGROUND, effectiveLineStyle.getPatternBackground());
			}
			else if (linePatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_1)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_BACKGROUND_IMAGE);
				patternStructure.putString(oFF.SacTableConstants.LP_S_BACKGROUND, oFF.XStringUtils.concatenate3(oFF.SacTableConstants.IMG_B64_PREFIX, oFF.SacTableConstants.BASE64_SVG_HATCHING_1, oFF.SacTableConstants.IMG_B64_SUFFIX));
			}
			else if (linePatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_2)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_BACKGROUND_IMAGE);
				patternStructure.putString(oFF.SacTableConstants.LP_S_BACKGROUND, oFF.XStringUtils.concatenate3(oFF.SacTableConstants.IMG_B64_PREFIX, oFF.SacTableConstants.BASE64_SVG_HATCHING_2, oFF.SacTableConstants.IMG_B64_SUFFIX));
			}
			else if (linePatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_3)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_BACKGROUND_IMAGE);
				patternStructure.putString(oFF.SacTableConstants.LP_S_BACKGROUND, oFF.XStringUtils.concatenate3(oFF.SacTableConstants.IMG_B64_PREFIX, oFF.SacTableConstants.BASE64_SVG_HATCHING_3, oFF.SacTableConstants.IMG_B64_SUFFIX));
			}
			else if (linePatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_4)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_BACKGROUND_IMAGE);
				patternStructure.putString(oFF.SacTableConstants.LP_S_BACKGROUND, oFF.XStringUtils.concatenate3(oFF.SacTableConstants.IMG_B64_PREFIX, oFF.SacTableConstants.BASE64_SVG_HATCHING_4, oFF.SacTableConstants.IMG_B64_SUFFIX));
			}
			else if (linePatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_5)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_BACKGROUND_IMAGE);
				patternStructure.putString(oFF.SacTableConstants.LP_S_BACKGROUND, oFF.XStringUtils.concatenate3(oFF.SacTableConstants.IMG_B64_PREFIX, oFF.SacTableConstants.BASE64_SVG_HATCHING_5, oFF.SacTableConstants.IMG_B64_SUFFIX));
			}
			else if (linePatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_6)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_BACKGROUND_IMAGE);
				patternStructure.putString(oFF.SacTableConstants.LP_S_BACKGROUND, oFF.XStringUtils.concatenate3(oFF.SacTableConstants.IMG_B64_PREFIX, oFF.SacTableConstants.BASE64_SVG_HATCHING_6, oFF.SacTableConstants.IMG_B64_SUFFIX));
			}
			else if (linePatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_7)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_BACKGROUND_IMAGE);
				patternStructure.putString(oFF.SacTableConstants.LP_S_BACKGROUND, oFF.XStringUtils.concatenate3(oFF.SacTableConstants.IMG_B64_PREFIX, oFF.SacTableConstants.BASE64_SVG_HATCHING_7, oFF.SacTableConstants.IMG_B64_SUFFIX));
			}
			else if (linePatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_8)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_BACKGROUND_IMAGE);
				patternStructure.putString(oFF.SacTableConstants.LP_S_BACKGROUND, oFF.XStringUtils.concatenate3(oFF.SacTableConstants.IMG_B64_PREFIX, oFF.SacTableConstants.BASE64_SVG_HATCHING_8, oFF.SacTableConstants.IMG_B64_SUFFIX));
			}
			if (effectiveLineStyle.getPatternWidth() > 0)
			{
				patternStructure.putDouble(oFF.SacTableConstants.LP_N_WIDTH, effectiveLineStyle.getPatternWidth());
			}
			patternStructure.putStringNotNullAndNotEmpty(oFF.SacTableConstants.LP_S_COLOR, effectiveLineStyle.getPatternColor());
			patternStructure.putStringNotNullAndNotEmpty(oFF.SacTableConstants.LP_S_BORDER_COLOR, effectiveLineStyle.getPatternBorderColor());
		}
	}
};

oFF.SacTableFactoryImpl = function() {};
oFF.SacTableFactoryImpl.prototype = new oFF.XObject();
oFF.SacTableFactoryImpl.prototype._ff_c = "SacTableFactoryImpl";

oFF.SacTableFactoryImpl.create = function()
{
	return new oFF.SacTableFactoryImpl();
};
oFF.SacTableFactoryImpl.prototype.newTableObject = function()
{
	return oFF.SacTable.create();
};

oFF.SacTableHighlightCoordinate = function() {};
oFF.SacTableHighlightCoordinate.prototype = new oFF.XObject();
oFF.SacTableHighlightCoordinate.prototype._ff_c = "SacTableHighlightCoordinate";

oFF.SacTableHighlightCoordinate.create = function(column, row, color)
{
	let instance = new oFF.SacTableHighlightCoordinate();
	instance.m_column = column;
	instance.m_row = row;
	instance.m_color = color;
	return instance;
};
oFF.SacTableHighlightCoordinate.prototype.m_color = null;
oFF.SacTableHighlightCoordinate.prototype.m_column = 0;
oFF.SacTableHighlightCoordinate.prototype.m_row = 0;
oFF.SacTableHighlightCoordinate.prototype.getColor = function()
{
	return this.m_color;
};
oFF.SacTableHighlightCoordinate.prototype.getColumn = function()
{
	return this.m_column;
};
oFF.SacTableHighlightCoordinate.prototype.getRow = function()
{
	return this.m_row;
};

oFF.SacCellTypeRestriction = function() {};
oFF.SacCellTypeRestriction.prototype = new oFF.XObject();
oFF.SacCellTypeRestriction.prototype._ff_c = "SacCellTypeRestriction";

oFF.SacCellTypeRestriction.create = function()
{
	let instance = new oFF.SacCellTypeRestriction();
	instance.setup();
	return instance;
};
oFF.SacCellTypeRestriction.prototype.m_cellTypes = null;
oFF.SacCellTypeRestriction.prototype.m_expanded = null;
oFF.SacCellTypeRestriction.prototype.m_inHierarchy = null;
oFF.SacCellTypeRestriction.prototype.m_inTotalsContext = null;
oFF.SacCellTypeRestriction.prototype.m_merged = null;
oFF.SacCellTypeRestriction.prototype.m_repeatedMemberName = null;
oFF.SacCellTypeRestriction.prototype.addCellType = function(cellType)
{
	this.m_cellTypes.add(cellType);
};
oFF.SacCellTypeRestriction.prototype.clearCellTypes = function()
{
	this.m_cellTypes.clear();
};
oFF.SacCellTypeRestriction.prototype.getMatchingCellTypes = function()
{
	return this.m_cellTypes;
};
oFF.SacCellTypeRestriction.prototype.isExpanded = function()
{
	return this.m_expanded;
};
oFF.SacCellTypeRestriction.prototype.isInHierarchy = function()
{
	return this.m_inHierarchy;
};
oFF.SacCellTypeRestriction.prototype.isInTotalsContext = function()
{
	return this.m_inTotalsContext;
};
oFF.SacCellTypeRestriction.prototype.isMerged = function()
{
	return this.m_merged;
};
oFF.SacCellTypeRestriction.prototype.isRepeatedMemberName = function()
{
	return this.m_repeatedMemberName;
};
oFF.SacCellTypeRestriction.prototype.matches = function(sacTableCell)
{
	let matches = !oFF.XCollectionUtils.hasElements(this.m_cellTypes) || oFF.XStream.of(this.m_cellTypes).anyMatch((ct) => {
		return ct.getInternalValue() === sacTableCell.getType();
	});
	if (matches && oFF.TriStateBool.isExplicitBooleanValue(this.m_expanded))
	{
		matches = sacTableCell.isExpanded() === this.m_expanded.getBoolean();
	}
	if (matches && oFF.TriStateBool.isExplicitBooleanValue(this.m_inHierarchy))
	{
		matches = sacTableCell.isInHierarchy() === this.m_inHierarchy.getBoolean();
	}
	if (matches && oFF.TriStateBool.isExplicitBooleanValue(this.m_inTotalsContext))
	{
		matches = sacTableCell.isTotalsContext() === this.m_inTotalsContext.getBoolean();
	}
	if (matches && oFF.TriStateBool.isExplicitBooleanValue(this.m_merged))
	{
		matches = sacTableCell.getMergedColumns() > 0 || sacTableCell.getMergedRows() > 0 === this.m_merged.getBoolean();
	}
	if (matches && oFF.TriStateBool.isExplicitBooleanValue(this.m_repeatedMemberName))
	{
		matches = sacTableCell.isRepeatedHeader() === this.m_repeatedMemberName.getBoolean();
	}
	return matches;
};
oFF.SacCellTypeRestriction.prototype.releaseObject = function()
{
	this.m_cellTypes = oFF.XObjectExt.release(this.m_cellTypes);
	this.m_inHierarchy = null;
	this.m_expanded = null;
	this.m_merged = null;
	this.m_repeatedMemberName = null;
	this.m_inTotalsContext = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.SacCellTypeRestriction.prototype.setExpanded = function(expanded)
{
	this.m_expanded = expanded;
};
oFF.SacCellTypeRestriction.prototype.setInHierarchy = function(inHierarchy)
{
	this.m_inHierarchy = inHierarchy;
};
oFF.SacCellTypeRestriction.prototype.setInTotalsContext = function(inTotalsContext)
{
	this.m_inTotalsContext = inTotalsContext;
};
oFF.SacCellTypeRestriction.prototype.setMerged = function(merged)
{
	this.m_merged = merged;
};
oFF.SacCellTypeRestriction.prototype.setRepeatedMemberName = function(repeatedMemberName)
{
	this.m_repeatedMemberName = repeatedMemberName;
};
oFF.SacCellTypeRestriction.prototype.setup = function()
{
	oFF.XObject.prototype.setup.call( this );
	this.m_cellTypes = oFF.XList.create();
};

oFF.SacDataPath = function() {};
oFF.SacDataPath.prototype = new oFF.XObject();
oFF.SacDataPath.prototype._ff_c = "SacDataPath";

oFF.SacDataPath.prototype.m_pathElementMapByLevels = null;
oFF.SacDataPath.prototype.m_pathElements = null;
oFF.SacDataPath.prototype.copyFrom = function(other, flags)
{
	oFF.XCollectionUtils.forEach(other.getPathElements(), (orig) => {
		this.addNewPathElement().copyFrom(orig, flags);
	});
	this.indexLevels();
};
oFF.SacDataPath.prototype.getPathElements = function()
{
	return this.m_pathElements;
};
oFF.SacDataPath.prototype.indexElement = function(pathElement)
{
	this.m_pathElementMapByLevels.clear();
	let level = oFF.XIntegerValue.create(pathElement.getGroupLevel());
	if (!this.m_pathElementMapByLevels.containsKey(level))
	{
		this.m_pathElementMapByLevels.put(level, oFF.XList.create());
	}
	this.m_pathElementMapByLevels.getByKey(level).add(pathElement);
};
oFF.SacDataPath.prototype.indexLevels = function()
{
	oFF.XCollectionUtils.forEach(this.m_pathElements, (pe) => {
		this.indexElement(pe);
	});
};
oFF.SacDataPath.prototype.releaseObject = function()
{
	this.m_pathElements = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_pathElements);
};
oFF.SacDataPath.prototype.setup = function()
{
	this.m_pathElements = oFF.XList.create();
	this.m_pathElementMapByLevels = oFF.XSimpleMap.create();
};

oFF.SacExceptionInfo = function() {};
oFF.SacExceptionInfo.prototype = new oFF.XObject();
oFF.SacExceptionInfo.prototype._ff_c = "SacExceptionInfo";

oFF.SacExceptionInfo.arePathsEqual = function(dataSectionInfoTags, dataSectionInfoTags1)
{
	let result = dataSectionInfoTags === dataSectionInfoTags1;
	let elementSize = oFF.XCollectionUtils.size(dataSectionInfoTags);
	if (!result && oFF.XCollectionUtils.size(dataSectionInfoTags1) === elementSize)
	{
		result = true;
		for (let i = 0; i < elementSize; i++)
		{
			let tag = dataSectionInfoTags.get(i);
			let tag1 = dataSectionInfoTags1.get(i);
			if (tag.getGroupLevel() !== tag1.getGroupLevel() || tag.getSectionLevel() !== tag1.getSectionLevel() || !oFF.XString.isEqual(tag.getSectionNodeName(), tag1.getSectionNodeName()) || !oFF.XString.isEqual(tag.getGroupName(), tag1.getGroupName()) || !oFF.XString.isEqual(tag.getSectionLevelName(), tag1.getSectionLevelName()))
			{
				result = false;
				break;
			}
		}
	}
	return result;
};
oFF.SacExceptionInfo.create = function()
{
	let instance = new oFF.SacExceptionInfo();
	instance.m_dataSectionInfoTags = oFF.XList.create();
	instance.m_tags = oFF.XList.create();
	return instance;
};
oFF.SacExceptionInfo.prototype.m_color = null;
oFF.SacExceptionInfo.prototype.m_dataSectionInfoTags = null;
oFF.SacExceptionInfo.prototype.m_exceptionName = null;
oFF.SacExceptionInfo.prototype.m_level = null;
oFF.SacExceptionInfo.prototype.m_tags = null;
oFF.SacExceptionInfo.prototype.m_thresholdName = null;
oFF.SacExceptionInfo.prototype.m_thresholdText = null;
oFF.SacExceptionInfo.prototype.m_valueSign = null;
oFF.SacExceptionInfo.prototype.addNewDataSectionInfoTag = function()
{
	let instance = oFF.SacDataSectionInfoTag.create();
	this.m_dataSectionInfoTags.add(instance);
	return instance;
};
oFF.SacExceptionInfo.prototype.addTag = function(tag)
{
	this.m_tags.add(tag);
};
oFF.SacExceptionInfo.prototype.getColor = function()
{
	return this.m_color;
};
oFF.SacExceptionInfo.prototype.getDataSectionInfoTags = function()
{
	return this.m_dataSectionInfoTags;
};
oFF.SacExceptionInfo.prototype.getExceptionName = function()
{
	return this.m_exceptionName;
};
oFF.SacExceptionInfo.prototype.getLevel = function()
{
	return this.m_level;
};
oFF.SacExceptionInfo.prototype.getTags = function()
{
	return this.m_tags;
};
oFF.SacExceptionInfo.prototype.getThresholdName = function()
{
	return this.m_thresholdName;
};
oFF.SacExceptionInfo.prototype.getThresholdText = function()
{
	return this.m_thresholdText;
};
oFF.SacExceptionInfo.prototype.getValueSign = function()
{
	return this.m_valueSign;
};
oFF.SacExceptionInfo.prototype.isEqualTo = function(other)
{
	if (oFF.isNull(other))
	{
		return false;
	}
	if (this === other)
	{
		return true;
	}
	let otherInfo;
	try
	{
		otherInfo = other;
	}
	catch (e)
	{
		return false;
	}
	return oFF.XString.isEqual(this.getColor(), otherInfo.getColor()) && oFF.XString.isEqual(this.getThresholdName(), otherInfo.getThresholdName()) && oFF.XString.isEqual(this.getThresholdText(), otherInfo.getThresholdText()) && oFF.XString.isEqual(this.getExceptionName(), otherInfo.getExceptionName()) && oFF.XObjectExt.areEqual(this.getValueSign(), otherInfo.getValueSign()) && oFF.XObjectExt.areEqual(this.getTags(), otherInfo.getTags()) && oFF.XObjectExt.areEqual(this.getLevel(), otherInfo.getLevel()) && oFF.SacExceptionInfo.arePathsEqual(this.getDataSectionInfoTags(), otherInfo.getDataSectionInfoTags());
};
oFF.SacExceptionInfo.prototype.setColor = function(color)
{
	this.m_color = color;
};
oFF.SacExceptionInfo.prototype.setExceptionName = function(exceptionName)
{
	this.m_exceptionName = exceptionName;
};
oFF.SacExceptionInfo.prototype.setLevel = function(level)
{
	this.m_level = level;
};
oFF.SacExceptionInfo.prototype.setThresholdName = function(thresholdName)
{
	this.m_thresholdName = thresholdName;
};
oFF.SacExceptionInfo.prototype.setThresholdText = function(thresholdText)
{
	this.m_thresholdText = thresholdText;
};
oFF.SacExceptionInfo.prototype.setValueSign = function(valueSign)
{
	this.m_valueSign = valueSign;
};

oFF.SacHeaderSectionInfo = function() {};
oFF.SacHeaderSectionInfo.prototype = new oFF.XObject();
oFF.SacHeaderSectionInfo.prototype._ff_c = "SacHeaderSectionInfo";

oFF.SacHeaderSectionInfo.create = function()
{
	let instance = new oFF.SacHeaderSectionInfo();
	instance.setup();
	return instance;
};
oFF.SacHeaderSectionInfo.prototype.m_axisLevel = 0;
oFF.SacHeaderSectionInfo.prototype.m_exactHeaderLevel = false;
oFF.SacHeaderSectionInfo.prototype.m_headerLevel = 0;
oFF.SacHeaderSectionInfo.prototype.m_headerName = null;
oFF.SacHeaderSectionInfo.prototype.getAxisLevel = function()
{
	return this.m_axisLevel;
};
oFF.SacHeaderSectionInfo.prototype.getHeaderLevel = function()
{
	return this.m_headerLevel;
};
oFF.SacHeaderSectionInfo.prototype.getHeaderName = function()
{
	return this.m_headerName;
};
oFF.SacHeaderSectionInfo.prototype.isExactHeaderLevel = function()
{
	return this.m_exactHeaderLevel;
};
oFF.SacHeaderSectionInfo.prototype.setAxisLevel = function(axisLevel)
{
	this.m_axisLevel = axisLevel;
};
oFF.SacHeaderSectionInfo.prototype.setExactHeaderLevel = function(exactLevel)
{
	this.m_exactHeaderLevel = exactLevel;
};
oFF.SacHeaderSectionInfo.prototype.setHeaderLevel = function(headerLevel)
{
	this.m_headerLevel = headerLevel;
};
oFF.SacHeaderSectionInfo.prototype.setHeaderName = function(headerName)
{
	this.m_headerName = headerName;
};
oFF.SacHeaderSectionInfo.prototype.setup = function()
{
	this.m_headerLevel = -1;
	this.m_axisLevel = -1;
};

oFF.SacInsertedTuple = function() {};
oFF.SacInsertedTuple.prototype = new oFF.XObject();
oFF.SacInsertedTuple.prototype._ff_c = "SacInsertedTuple";

oFF.SacInsertedTuple.create = function()
{
	let instance = new oFF.SacInsertedTuple();
	instance.setup();
	return instance;
};
oFF.SacInsertedTuple.prototype.m_cellHeight = 0;
oFF.SacInsertedTuple.prototype.m_cellWidth = 0;
oFF.SacInsertedTuple.prototype.m_formattedText = null;
oFF.SacInsertedTuple.prototype.m_merged = false;
oFF.SacInsertedTuple.prototype.m_scopedStyles = null;
oFF.SacInsertedTuple.prototype.addNewScopedStyle = function()
{
	let scopedStyle = oFF.SacScopedStyle.create();
	this.m_scopedStyles.add(scopedStyle);
	return scopedStyle;
};
oFF.SacInsertedTuple.prototype.getCellHeight = function()
{
	return this.m_cellHeight;
};
oFF.SacInsertedTuple.prototype.getCellWidth = function()
{
	return this.m_cellWidth;
};
oFF.SacInsertedTuple.prototype.getFormattedText = function()
{
	return this.m_formattedText;
};
oFF.SacInsertedTuple.prototype.getScopedStyles = function()
{
	return this.m_scopedStyles;
};
oFF.SacInsertedTuple.prototype.isMerged = function()
{
	return this.m_merged;
};
oFF.SacInsertedTuple.prototype.releaseObject = function()
{
	this.m_merged = false;
	this.m_formattedText = null;
	this.m_cellHeight = 0;
	this.m_cellWidth = 0;
	this.m_scopedStyles = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_scopedStyles);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.SacInsertedTuple.prototype.setCellHeight = function(cellHeight)
{
	this.m_cellHeight = cellHeight;
};
oFF.SacInsertedTuple.prototype.setCellWidth = function(cellWidth)
{
	this.m_cellWidth = cellWidth;
};
oFF.SacInsertedTuple.prototype.setFormattedText = function(formattedText)
{
	this.m_formattedText = formattedText;
};
oFF.SacInsertedTuple.prototype.setMerged = function(merged)
{
	this.m_merged = merged;
};
oFF.SacInsertedTuple.prototype.setup = function()
{
	oFF.XObject.prototype.setup.call( this );
	this.m_scopedStyles = oFF.XList.create();
};

oFF.SacLayeredRectangularStyle = function() {};
oFF.SacLayeredRectangularStyle.prototype = new oFF.XObject();
oFF.SacLayeredRectangularStyle.prototype._ff_c = "SacLayeredRectangularStyle";

oFF.SacLayeredRectangularStyle.create = function()
{
	let instance = new oFF.SacLayeredRectangularStyle();
	instance.setup();
	return instance;
};
oFF.SacLayeredRectangularStyle.prototype.m_columnsRestriction = null;
oFF.SacLayeredRectangularStyle.prototype.m_rowsRestriction = null;
oFF.SacLayeredRectangularStyle.prototype.m_style = null;
oFF.SacLayeredRectangularStyle.prototype.getColumnsRestriction = function()
{
	return this.m_columnsRestriction;
};
oFF.SacLayeredRectangularStyle.prototype.getPriority = function()
{
	return this.m_style.getPriority();
};
oFF.SacLayeredRectangularStyle.prototype.getRowsRestriction = function()
{
	return this.m_rowsRestriction;
};
oFF.SacLayeredRectangularStyle.prototype.getStyle = function()
{
	return this.m_style;
};
oFF.SacLayeredRectangularStyle.prototype.releaseObject = function()
{
	this.m_style = oFF.XObjectExt.release(this.m_style);
	this.m_rowsRestriction = oFF.XObjectExt.release(this.m_rowsRestriction);
	this.m_columnsRestriction = oFF.XObjectExt.release(this.m_columnsRestriction);
};
oFF.SacLayeredRectangularStyle.prototype.setPriority = function(priority)
{
	this.m_style.setPriority(priority);
};
oFF.SacLayeredRectangularStyle.prototype.setup = function()
{
	this.m_style = oFF.SacTableStyle.create();
	this.m_columnsRestriction = oFF.SacTableAxisSectionReference.create();
	this.m_rowsRestriction = oFF.SacTableAxisSectionReference.create();
};

oFF.SacScopedStyle = function() {};
oFF.SacScopedStyle.prototype = new oFF.XObject();
oFF.SacScopedStyle.prototype._ff_c = "SacScopedStyle";

oFF.SacScopedStyle.create = function()
{
	let instance = new oFF.SacScopedStyle();
	instance.setup();
	return instance;
};
oFF.SacScopedStyle.prototype.m_orthogonalColumnsRestriction = null;
oFF.SacScopedStyle.prototype.m_orthogonalRowsRestriction = null;
oFF.SacScopedStyle.prototype.m_style = null;
oFF.SacScopedStyle.prototype.getOrthogonalColumnsRestriction = function()
{
	return this.m_orthogonalColumnsRestriction;
};
oFF.SacScopedStyle.prototype.getOrthogonalRowsRestriction = function()
{
	return this.m_orthogonalRowsRestriction;
};
oFF.SacScopedStyle.prototype.getPriority = function()
{
	return this.m_style.getPriority();
};
oFF.SacScopedStyle.prototype.getStyle = function()
{
	return this.m_style;
};
oFF.SacScopedStyle.prototype.releaseObject = function()
{
	this.m_style = oFF.XObjectExt.release(this.m_style);
	this.m_orthogonalRowsRestriction = oFF.XObjectExt.release(this.m_orthogonalRowsRestriction);
	this.m_orthogonalColumnsRestriction = oFF.XObjectExt.release(this.m_orthogonalColumnsRestriction);
};
oFF.SacScopedStyle.prototype.setPriority = function(priority)
{
	this.m_style.setPriority(priority);
};
oFF.SacScopedStyle.prototype.setup = function()
{
	this.m_style = oFF.SacTableStyle.create();
	this.m_orthogonalColumnsRestriction = oFF.SacTableAxisSectionReference.create();
	this.m_orthogonalRowsRestriction = oFF.SacTableAxisSectionReference.create();
};

oFF.SacTableAxisSectionReference = function() {};
oFF.SacTableAxisSectionReference.prototype = new oFF.XObject();
oFF.SacTableAxisSectionReference.prototype._ff_c = "SacTableAxisSectionReference";

oFF.SacTableAxisSectionReference.create = function()
{
	let instance = new oFF.SacTableAxisSectionReference();
	instance.setup();
	return instance;
};
oFF.SacTableAxisSectionReference.prototype.m_dataPaths = null;
oFF.SacTableAxisSectionReference.prototype.m_headerSectionInfos = null;
oFF.SacTableAxisSectionReference.prototype.m_matchDataSectionEnd = false;
oFF.SacTableAxisSectionReference.prototype.m_matchDataSectionStart = false;
oFF.SacTableAxisSectionReference.prototype.m_matchFullDataSection = false;
oFF.SacTableAxisSectionReference.prototype.m_matchFullHeaderSection = false;
oFF.SacTableAxisSectionReference.prototype.m_matchHeaderFieldsSectionEnd = false;
oFF.SacTableAxisSectionReference.prototype.m_matchHeaderSectionEnd = false;
oFF.SacTableAxisSectionReference.prototype.m_matchHeaderSectionStart = false;
oFF.SacTableAxisSectionReference.prototype.m_matchModulo = 0;
oFF.SacTableAxisSectionReference.prototype.m_matchOrdinal = 0;
oFF.SacTableAxisSectionReference.prototype.m_matchRootContentIndices = false;
oFF.SacTableAxisSectionReference.prototype.m_matchSkipFirst = 0;
oFF.SacTableAxisSectionReference.prototype.m_matchSkipLast = 0;
oFF.SacTableAxisSectionReference.prototype.m_maxHeaderSectionInfo = null;
oFF.SacTableAxisSectionReference.prototype.m_minHeaderSectionInfo = null;
oFF.SacTableAxisSectionReference.prototype.addNewDataPath = function()
{
	let path = oFF.SacDataPathReference.createReference();
	this.m_dataPaths.add(path);
	return path;
};
oFF.SacTableAxisSectionReference.prototype.addNewHeaderSectionInfo = function()
{
	let info = oFF.SacHeaderSectionInfoReference.createReference();
	this.m_headerSectionInfos.add(info);
	return info;
};
oFF.SacTableAxisSectionReference.prototype.clearDataPaths = function()
{
	this.m_dataPaths.clear();
};
oFF.SacTableAxisSectionReference.prototype.clearHeaderSectionsInfos = function()
{
	this.m_headerSectionInfos.clear();
};
oFF.SacTableAxisSectionReference.prototype.getDataPaths = function()
{
	return this.m_dataPaths;
};
oFF.SacTableAxisSectionReference.prototype.getHeaderSectionInfos = function()
{
	return this.m_headerSectionInfos;
};
oFF.SacTableAxisSectionReference.prototype.getMatchModulo = function()
{
	return this.m_matchModulo;
};
oFF.SacTableAxisSectionReference.prototype.getMatchOrdinal = function()
{
	return this.m_matchOrdinal;
};
oFF.SacTableAxisSectionReference.prototype.getMatchSkipFirst = function()
{
	return this.m_matchSkipFirst;
};
oFF.SacTableAxisSectionReference.prototype.getMatchSkipLast = function()
{
	return this.m_matchSkipLast;
};
oFF.SacTableAxisSectionReference.prototype.getMaxHeaderSectionInfoOrCreate = function(createIfNotExists)
{
	if (oFF.isNull(this.m_maxHeaderSectionInfo) && createIfNotExists)
	{
		this.m_maxHeaderSectionInfo = oFF.SacHeaderSectionInfoReference.createReference();
	}
	return this.m_maxHeaderSectionInfo;
};
oFF.SacTableAxisSectionReference.prototype.getMinHeaderSectionInfoOrCreate = function(createIfNotExists)
{
	if (oFF.isNull(this.m_minHeaderSectionInfo) && createIfNotExists)
	{
		this.m_minHeaderSectionInfo = oFF.SacHeaderSectionInfoReference.createReference();
	}
	return this.m_minHeaderSectionInfo;
};
oFF.SacTableAxisSectionReference.prototype.isMatchDataSectionEnd = function()
{
	return this.m_matchDataSectionEnd;
};
oFF.SacTableAxisSectionReference.prototype.isMatchDataSectionStart = function()
{
	return this.m_matchDataSectionStart;
};
oFF.SacTableAxisSectionReference.prototype.isMatchFullDataSection = function()
{
	return this.m_matchFullDataSection;
};
oFF.SacTableAxisSectionReference.prototype.isMatchFullHeaderSection = function()
{
	return this.m_matchFullHeaderSection;
};
oFF.SacTableAxisSectionReference.prototype.isMatchHeaderFieldsSectionEnd = function()
{
	return this.m_matchHeaderFieldsSectionEnd;
};
oFF.SacTableAxisSectionReference.prototype.isMatchHeaderSectionEnd = function()
{
	return this.m_matchHeaderSectionEnd;
};
oFF.SacTableAxisSectionReference.prototype.isMatchHeaderSectionStart = function()
{
	return this.m_matchHeaderSectionStart;
};
oFF.SacTableAxisSectionReference.prototype.isMatchRootContentIndices = function()
{
	return this.m_matchRootContentIndices;
};
oFF.SacTableAxisSectionReference.prototype.matchesPosition = function(fullIndex, fullSize, semanticIndex, semanticSize)
{
	let result;
	if (this.m_matchRootContentIndices)
	{
		result = this.matchesPositionInternal(semanticIndex, semanticSize);
	}
	else
	{
		result = this.matchesPositionInternal(fullIndex, fullSize);
	}
	return result;
};
oFF.SacTableAxisSectionReference.prototype.matchesPositionInternal = function(index, size)
{
	if (this.m_matchSkipFirst > 0 && index < this.m_matchSkipFirst || this.m_matchSkipLast > 0 && size - index <= this.m_matchSkipLast)
	{
		return false;
	}
	if (this.m_matchModulo === -1)
	{
		return index === this.m_matchOrdinal || index === size + this.m_matchOrdinal;
	}
	if (this.m_matchModulo === -2)
	{
		return false;
	}
	if (this.m_matchModulo < 2)
	{
		return true;
	}
	if (this.m_matchOrdinal < 0)
	{
		return -1 - this.m_matchOrdinal === oFF.XMath.mod(size - index - 1, this.m_matchModulo);
	}
	return this.m_matchOrdinal === oFF.XMath.mod(index + 1, this.m_matchModulo);
};
oFF.SacTableAxisSectionReference.prototype.releaseObject = function()
{
	this.m_minHeaderSectionInfo = oFF.XObjectExt.release(this.m_minHeaderSectionInfo);
	this.m_maxHeaderSectionInfo = oFF.XObjectExt.release(this.m_maxHeaderSectionInfo);
	this.m_headerSectionInfos = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_headerSectionInfos);
	this.m_dataPaths = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_dataPaths);
	this.m_matchHeaderSectionStart = false;
	this.m_matchHeaderSectionEnd = false;
	this.m_matchHeaderFieldsSectionEnd = false;
	this.m_matchFullHeaderSection = false;
	this.m_matchDataSectionStart = false;
	this.m_matchDataSectionEnd = false;
	this.m_matchFullDataSection = false;
	this.m_matchModulo = 0;
	this.m_matchOrdinal = 0;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.SacTableAxisSectionReference.prototype.setMatchDataSectionEnd = function(matchDataSectionEnd)
{
	this.m_matchDataSectionEnd = matchDataSectionEnd;
};
oFF.SacTableAxisSectionReference.prototype.setMatchDataSectionStart = function(matchDataSectionStart)
{
	this.m_matchDataSectionStart = matchDataSectionStart;
};
oFF.SacTableAxisSectionReference.prototype.setMatchFullDataSection = function(matchFullDataSection)
{
	this.m_matchFullDataSection = matchFullDataSection;
};
oFF.SacTableAxisSectionReference.prototype.setMatchFullHeaderSection = function(matchFullHeaderSection)
{
	this.m_matchFullHeaderSection = matchFullHeaderSection;
};
oFF.SacTableAxisSectionReference.prototype.setMatchHeaderFieldsSectionEnd = function(matchHeaderFieldsSectionEnd)
{
	this.m_matchHeaderFieldsSectionEnd = matchHeaderFieldsSectionEnd;
};
oFF.SacTableAxisSectionReference.prototype.setMatchHeaderSectionEnd = function(matchHeaderSectionEnd)
{
	this.m_matchHeaderSectionEnd = matchHeaderSectionEnd;
};
oFF.SacTableAxisSectionReference.prototype.setMatchHeaderSectionStart = function(matchHeaderSectionStart)
{
	this.m_matchHeaderSectionStart = matchHeaderSectionStart;
};
oFF.SacTableAxisSectionReference.prototype.setMatchModulo = function(matchModulo)
{
	this.m_matchModulo = matchModulo;
};
oFF.SacTableAxisSectionReference.prototype.setMatchOrdinal = function(matchOrdinal)
{
	this.m_matchOrdinal = matchOrdinal;
};
oFF.SacTableAxisSectionReference.prototype.setMatchRootContentIndices = function(matchRootContentIndices)
{
	this.m_matchRootContentIndices = matchRootContentIndices;
};
oFF.SacTableAxisSectionReference.prototype.setMatchSkipFirst = function(matchSkipFirst)
{
	this.m_matchSkipFirst = matchSkipFirst;
};
oFF.SacTableAxisSectionReference.prototype.setMatchSkipLast = function(matchSkipLast)
{
	this.m_matchSkipLast = matchSkipLast;
};
oFF.SacTableAxisSectionReference.prototype.setup = function()
{
	this.m_headerSectionInfos = oFF.XList.create();
	this.m_dataPaths = oFF.XList.create();
};

oFF.SacTableHighlightArea = function() {};
oFF.SacTableHighlightArea.prototype = new oFF.XObject();
oFF.SacTableHighlightArea.prototype._ff_c = "SacTableHighlightArea";

oFF.SacTableHighlightArea.create = function()
{
	let instance = new oFF.SacTableHighlightArea();
	instance.setup();
	return instance;
};
oFF.SacTableHighlightArea.prototype.m_cellTypeRestriction = null;
oFF.SacTableHighlightArea.prototype.m_color = null;
oFF.SacTableHighlightArea.prototype.m_columnsReference = null;
oFF.SacTableHighlightArea.prototype.m_priority = 0;
oFF.SacTableHighlightArea.prototype.m_rowsReference = null;
oFF.SacTableHighlightArea.prototype.getCellTypeRestriction = function()
{
	return this.m_cellTypeRestriction;
};
oFF.SacTableHighlightArea.prototype.getColumnsReference = function()
{
	return this.m_columnsReference;
};
oFF.SacTableHighlightArea.prototype.getHighlightColor = function()
{
	return this.m_color;
};
oFF.SacTableHighlightArea.prototype.getPriority = function()
{
	return this.m_priority;
};
oFF.SacTableHighlightArea.prototype.getRowsReference = function()
{
	return this.m_rowsReference;
};
oFF.SacTableHighlightArea.prototype.releaseObject = function()
{
	this.m_rowsReference = oFF.XObjectExt.release(this.m_rowsReference);
	this.m_columnsReference = oFF.XObjectExt.release(this.m_columnsReference);
	this.m_cellTypeRestriction = oFF.XObjectExt.release(this.m_cellTypeRestriction);
	this.m_color = null;
	this.m_priority = -1;
};
oFF.SacTableHighlightArea.prototype.setHighlightColor = function(color)
{
	this.m_color = color;
};
oFF.SacTableHighlightArea.prototype.setPriority = function(priority)
{
	this.m_priority = priority;
};
oFF.SacTableHighlightArea.prototype.setup = function()
{
	this.m_rowsReference = oFF.SacTableAxisSectionReference.create();
	this.m_columnsReference = oFF.SacTableAxisSectionReference.create();
	this.m_cellTypeRestriction = oFF.SacCellTypeRestriction.create();
	this.m_priority = -1;
};

oFF.SacTableMarkup = function() {};
oFF.SacTableMarkup.prototype = new oFF.XObject();
oFF.SacTableMarkup.prototype._ff_c = "SacTableMarkup";

oFF.SacTableMarkup.create = function()
{
	let instance = new oFF.SacTableMarkup();
	instance.setup();
	return instance;
};
oFF.SacTableMarkup.prototype.m_cellHeight = 0;
oFF.SacTableMarkup.prototype.m_cellHeightAddition = 0;
oFF.SacTableMarkup.prototype.m_cellWidth = 0;
oFF.SacTableMarkup.prototype.m_cellWidthAddition = 0;
oFF.SacTableMarkup.prototype.m_columnsScope = null;
oFF.SacTableMarkup.prototype.m_hide = false;
oFF.SacTableMarkup.prototype.m_pageBreakHandling = null;
oFF.SacTableMarkup.prototype.m_priority = 0;
oFF.SacTableMarkup.prototype.m_rowsScope = null;
oFF.SacTableMarkup.prototype.m_scopedStyles = null;
oFF.SacTableMarkup.prototype.m_tuplesAfter = null;
oFF.SacTableMarkup.prototype.m_tuplesBefore = null;
oFF.SacTableMarkup.prototype.addNewScopedStyle = function()
{
	let scopedStyle = oFF.SacScopedStyle.create();
	this.m_scopedStyles.add(scopedStyle);
	return scopedStyle;
};
oFF.SacTableMarkup.prototype.addNewTupleAfter = function()
{
	let newTuple = oFF.SacInsertedTuple.create();
	this.m_tuplesAfter.add(newTuple);
	return newTuple;
};
oFF.SacTableMarkup.prototype.addNewTupleBefore = function()
{
	let newTuple = oFF.SacInsertedTuple.create();
	this.m_tuplesBefore.add(newTuple);
	return newTuple;
};
oFF.SacTableMarkup.prototype.getCellHeight = function()
{
	return this.m_cellHeight;
};
oFF.SacTableMarkup.prototype.getCellHeightAddition = function()
{
	return this.m_cellHeightAddition;
};
oFF.SacTableMarkup.prototype.getCellWidth = function()
{
	return this.m_cellWidth;
};
oFF.SacTableMarkup.prototype.getCellWidthAddition = function()
{
	return this.m_cellWidthAddition;
};
oFF.SacTableMarkup.prototype.getColumnsScope = function()
{
	return this.m_columnsScope;
};
oFF.SacTableMarkup.prototype.getPageBreakHandling = function()
{
	return this.m_pageBreakHandling;
};
oFF.SacTableMarkup.prototype.getPriority = function()
{
	return this.m_priority;
};
oFF.SacTableMarkup.prototype.getRowsScope = function()
{
	return this.m_rowsScope;
};
oFF.SacTableMarkup.prototype.getScopedStyles = function()
{
	return this.m_scopedStyles;
};
oFF.SacTableMarkup.prototype.getTuplesAfter = function()
{
	return this.m_tuplesAfter;
};
oFF.SacTableMarkup.prototype.getTuplesBefore = function()
{
	return this.m_tuplesBefore;
};
oFF.SacTableMarkup.prototype.isHide = function()
{
	return this.m_hide;
};
oFF.SacTableMarkup.prototype.releaseObject = function()
{
	this.m_rowsScope = oFF.XObjectExt.release(this.m_rowsScope);
	this.m_columnsScope = oFF.XObjectExt.release(this.m_columnsScope);
	this.m_cellHeight = 0;
	this.m_cellWidth = 0;
	this.m_cellHeightAddition = 0;
	this.m_cellWidthAddition = 0;
	this.m_hide = false;
	this.m_tuplesBefore = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_tuplesBefore);
	this.m_tuplesAfter = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_tuplesAfter);
	this.m_pageBreakHandling = oFF.XObjectExt.release(this.m_pageBreakHandling);
	this.m_scopedStyles = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_scopedStyles);
	this.m_priority = -1;
};
oFF.SacTableMarkup.prototype.setCellHeight = function(cellHeight)
{
	this.m_cellHeight = cellHeight;
};
oFF.SacTableMarkup.prototype.setCellHeightAddition = function(cellHeightAddition)
{
	this.m_cellHeightAddition = cellHeightAddition;
};
oFF.SacTableMarkup.prototype.setCellWidth = function(cellWidth)
{
	this.m_cellWidth = cellWidth;
};
oFF.SacTableMarkup.prototype.setCellWidthAddition = function(cellWidthAddition)
{
	this.m_cellWidthAddition = cellWidthAddition;
};
oFF.SacTableMarkup.prototype.setHide = function(hide)
{
	this.m_hide = hide;
};
oFF.SacTableMarkup.prototype.setPriority = function(priority)
{
	this.m_priority = priority;
};
oFF.SacTableMarkup.prototype.setup = function()
{
	this.m_rowsScope = oFF.SacTableAxisSectionReference.create();
	this.m_columnsScope = oFF.SacTableAxisSectionReference.create();
	this.m_pageBreakHandling = oFF.SacTablePageBreakHandling.create();
	this.m_tuplesBefore = oFF.XList.create();
	this.m_tuplesAfter = oFF.XList.create();
	this.m_scopedStyles = oFF.XList.create();
	this.m_priority = -1;
};

oFF.SacTableMarkupComparator = function() {};
oFF.SacTableMarkupComparator.prototype = new oFF.XObject();
oFF.SacTableMarkupComparator.prototype._ff_c = "SacTableMarkupComparator";

oFF.SacTableMarkupComparator.s_instance = null;
oFF.SacTableMarkupComparator.create = function()
{
	return new oFF.SacTableMarkupComparator();
};
oFF.SacTableMarkupComparator.getInstance = function()
{
	if (oFF.isNull(oFF.SacTableMarkupComparator.s_instance))
	{
		oFF.SacTableMarkupComparator.s_instance = oFF.SacTableMarkupComparator.create();
	}
	return oFF.SacTableMarkupComparator.s_instance;
};
oFF.SacTableMarkupComparator.prototype.compare = function(o1, o2)
{
	let s1 = o1.getPriority();
	let s2 = o2.getPriority();
	if (s1 === s2)
	{
		return 0;
	}
	else if (s1 > s2)
	{
		return 1;
	}
	else
	{
		return -1;
	}
};

oFF.SacTablePageBreakHandling = function() {};
oFF.SacTablePageBreakHandling.prototype = new oFF.XObject();
oFF.SacTablePageBreakHandling.prototype._ff_c = "SacTablePageBreakHandling";

oFF.SacTablePageBreakHandling.create = function()
{
	return new oFF.SacTablePageBreakHandling();
};
oFF.SacTablePageBreakHandling.prototype.m_breakAfter = false;
oFF.SacTablePageBreakHandling.prototype.m_breakBefore = false;
oFF.SacTablePageBreakHandling.prototype.m_keepTogether = false;
oFF.SacTablePageBreakHandling.prototype.copyFrom = function(other, flags)
{
	let orig = other;
	this.m_breakBefore = orig.m_breakBefore;
	this.m_breakAfter = orig.m_breakAfter;
	this.m_keepTogether = orig.m_keepTogether;
};
oFF.SacTablePageBreakHandling.prototype.isBreakAfter = function()
{
	return this.m_breakAfter;
};
oFF.SacTablePageBreakHandling.prototype.isBreakBefore = function()
{
	return this.m_breakBefore;
};
oFF.SacTablePageBreakHandling.prototype.isBreaking = function()
{
	return this.m_breakAfter || this.m_breakBefore || this.m_keepTogether;
};
oFF.SacTablePageBreakHandling.prototype.isKeepTogether = function()
{
	return this.m_keepTogether;
};
oFF.SacTablePageBreakHandling.prototype.isSet = function()
{
	return this.m_breakAfter || this.m_breakBefore || this.m_keepTogether;
};
oFF.SacTablePageBreakHandling.prototype.setBreakAfter = function(breakAfter)
{
	this.m_breakAfter = breakAfter;
};
oFF.SacTablePageBreakHandling.prototype.setBreakBefore = function(breakBefore)
{
	this.m_breakBefore = breakBefore;
};
oFF.SacTablePageBreakHandling.prototype.setKeepTogether = function(keepTogether)
{
	this.m_keepTogether = keepTogether;
};

oFF.TriStateMatchingUtil = {

	matchesTriStateNegative:function(triStateBool, booleanValue)
	{
			return oFF.isNull(triStateBool) || triStateBool === oFF.TriStateBool._DEFAULT || triStateBool === oFF.TriStateBool._FALSE && !booleanValue;
	},
	matchesTriStateStrictPositive:function(triStateBool, booleanValue)
	{
			return triStateBool === oFF.TriStateBool._TRUE && booleanValue;
	},
	mayIgnoreTriState:function(triStateBool)
	{
			return oFF.isNull(triStateBool) || triStateBool === oFF.TriStateBool._DEFAULT;
	}
};

oFF.SacTableClipboardHelper = function() {};
oFF.SacTableClipboardHelper.prototype = new oFF.TableClipboardHelperGeneric();
oFF.SacTableClipboardHelper.prototype._ff_c = "SacTableClipboardHelper";

oFF.SacTableClipboardHelper.prototype.m_tableInstance = null;
oFF.SacTableClipboardHelper.prototype.analyzeSelectionStructureInternal = function(selectionStructure, result)
{
	let colMin = result.getIntegerByKey(oFF.SacTable.SELECTION_COL_MIN);
	let rowMin = result.getIntegerByKey(oFF.SacTable.SELECTION_ROW_MIN);
	let resultList = result.getListByKey(oFF.SacTable.SELECTION_LIST);
	let startColOrig = selectionStructure.getIntegerByKey(oFF.SacTableConstants.CCD_N_START_COL);
	let endColOrig = selectionStructure.getIntegerByKey(oFF.SacTableConstants.CCD_N_END_COL);
	let startRowOrig = selectionStructure.getIntegerByKey(oFF.SacTableConstants.CCD_N_START_ROW);
	let endRowOrig = selectionStructure.getIntegerByKey(oFF.SacTableConstants.CCD_N_END_ROW);
	let startCol = oFF.XMath.min(startColOrig, endColOrig);
	let endCol = oFF.XMath.max(startColOrig, endColOrig);
	let startRow = oFF.XMath.min(startRowOrig, endRowOrig);
	let endRow = oFF.XMath.max(startRowOrig, endRowOrig);
	if (colMin === -1)
	{
		result.putInteger(oFF.SacTable.SELECTION_COL_MIN, startCol);
	}
	else
	{
		result.putInteger(oFF.SacTable.SELECTION_COL_MIN, oFF.XMath.min(colMin, startCol));
	}
	if (rowMin === -1)
	{
		result.putInteger(oFF.SacTable.SELECTION_ROW_MIN, startRow);
	}
	else
	{
		result.putInteger(oFF.SacTable.SELECTION_ROW_MIN, oFF.XMath.min(rowMin, startRow));
	}
	let i;
	let j;
	let cells;
	let headerRowList = this.m_tableInstance.getHeaderRowList();
	let headerRowListSize = headerRowList.size();
	let dataRowList = this.m_tableInstance.getRowList();
	let structure;
	let row;
	let cell;
	for (i = startRow; i <= endRow && i < headerRowListSize; i++)
	{
		row = headerRowList.get(i);
		cells = row.getCells();
		for (j = startCol; j <= endCol && j < cells.size(); j++)
		{
			cell = cells.get(j);
			structure = this.fillStructureOfCell(cell, resultList, i, j);
			this.formatCell(cell, structure);
		}
	}
	for (i = oFF.XMath.max(0, startRow - headerRowListSize); i <= endRow - headerRowListSize && i < dataRowList.size(); i++)
	{
		row = dataRowList.get(i);
		if (oFF.notNull(row))
		{
			cells = row.getCells();
			for (j = startCol; j <= endCol && j < cells.size(); j++)
			{
				cell = cells.get(j);
				structure = this.fillStructureOfCell(cell, resultList, i + headerRowListSize, j);
				this.formatCell(cell, structure);
			}
		}
	}
};
oFF.SacTableClipboardHelper.prototype.copyCells = function(selection)
{
	let result = oFF.PrFactory.createStructure();
	result.putNewList(oFF.SacTable.SELECTION_LIST);
	result.putInteger(oFF.SacTable.SELECTION_COL_MIN, -1);
	result.putInteger(oFF.SacTable.SELECTION_ROW_MIN, -1);
	if (this.m_clipboardBehaviour !== oFF.TableClipboardBehaviour.INACTIVE && this.m_tableInstance.getHeaderRowList() !== null && this.m_tableInstance.getRowList() !== null)
	{
		if (oFF.notNull(selection))
		{
			if (selection.isStructure())
			{
				this.analyzeSelectionStructureInternal(selection.asStructure(), result);
			}
			else if (selection.isList())
			{
				let selectionList = selection.asList();
				let sls = selectionList.size();
				if (oFF.XCollectionUtils.hasElements(selectionList))
				{
					if (this.m_clipboardBehaviour === oFF.TableClipboardBehaviour.MULTI_SELECT)
					{
						for (let i = 0; i < sls; i++)
						{
							this.analyzeSelectionStructureInternal(selectionList.getStructureAt(i), result);
						}
					}
					else if (this.m_clipboardBehaviour === oFF.TableClipboardBehaviour.LAST_SELECT || sls === 1)
					{
						this.analyzeSelectionStructureInternal(selectionList.getStructureAt(sls - 1), result);
					}
				}
			}
		}
	}
	return result;
};
oFF.SacTableClipboardHelper.prototype.fillStructureOfCell = function(tableCell, owningList, rowIndex, colIndex)
{
	let structure = owningList.addNewStructure();
	structure.putInteger(oFF.SacTableConstants.C_N_ROW, rowIndex);
	structure.putInteger(oFF.SacTableConstants.C_N_COLUMN, colIndex);
	let mergedColumns = tableCell.getMergedColumns();
	let mergedRows = tableCell.getMergedRows();
	if (mergedColumns !== 0 || mergedRows !== 0)
	{
		let mergerStructure = structure.putNewStructure(oFF.SacTableConstants.C_M_MERGED);
		if (mergedColumns >= 0 && mergedRows >= 0)
		{
			if (tableCell.getMergedColumns() > 0)
			{
				mergerStructure.putInteger(oFF.SacTableConstants.CM_N_COLUMNS, tableCell.getMergedColumns());
			}
			if (tableCell.getMergedRows() > 0)
			{
				mergerStructure.putInteger(oFF.SacTableConstants.CM_N_ROWS, tableCell.getMergedRows());
			}
		}
		else
		{
			mergerStructure.putInteger(oFF.SacTableConstants.CM_N_ORIGINAL_COLUMN, colIndex + tableCell.getMergedColumns());
			mergerStructure.putInteger(oFF.SacTableConstants.CM_N_ORIGINAL_ROW, rowIndex + tableCell.getMergedRows());
		}
	}
	if (tableCell.getCommentDocumentId() !== null)
	{
		structure.putInteger(oFF.SacTableConstants.C_N_COMMENT_TYPE, oFF.SacTableConstants.CT_SELF);
		structure.putString(oFF.SacTableConstants.CS_COMMENT_DOCUMENT_ID, tableCell.getCommentDocumentId());
	}
	let localId = tableCell.getId();
	if (oFF.isNull(localId))
	{
		localId = oFF.XStringUtils.concatenate2(oFF.XInteger.convertToHexString(rowIndex), oFF.XInteger.convertToHexString(colIndex));
	}
	structure.putString(oFF.SacTableConstants.C_S_ID, localId);
	let effectiveFormattedText = tableCell.getEffectiveFormattedText(tableCell.getPrioritizedStylesList());
	structure.putString(oFF.SacTableConstants.C_S_FORMATTED, effectiveFormattedText);
	structure.putBoolean(oFF.SacTableConstants.C_B_REPEATED_MEMBER_NAME, tableCell.isRepeatedHeader());
	let valuException = tableCell.getValueException();
	let plainValue = this.getCellValueAt(rowIndex, colIndex);
	if (oFF.notNull(plainValue))
	{
		let valueType = plainValue.getValueType();
		if (valueType === oFF.XValueType.BOOLEAN)
		{
			structure.putBoolean(oFF.SacTableConstants.C_SN_PLAIN, oFF.XValueUtil.getBoolean(plainValue, false, true));
			structure.putString(oFF.SacTableConstants.C_S_PASTABLE, effectiveFormattedText);
		}
		else if (valueType === oFF.XValueType.DECIMAL_FLOAT)
		{
			structure.putString(oFF.SacTableConstants.C_SN_PLAIN, plainValue.getStringRepresentation());
			structure.putString(oFF.SacTableConstants.C_S_PASTABLE, this.getLocalizedNumber(plainValue));
		}
		else if (valueType === oFF.XValueType.DOUBLE)
		{
			structure.putDouble(oFF.SacTableConstants.C_SN_PLAIN, oFF.XValueUtil.getDouble(plainValue, false, true));
			structure.putString(oFF.SacTableConstants.C_S_PASTABLE, this.getLocalizedNumber(plainValue));
		}
		else if (valueType === oFF.XValueType.LONG)
		{
			structure.putLong(oFF.SacTableConstants.C_SN_PLAIN, oFF.XValueUtil.getLong(plainValue, false, true));
			structure.putString(oFF.SacTableConstants.C_S_PASTABLE, this.getLocalizedNumber(plainValue));
		}
		else if (valueType === oFF.XValueType.INTEGER)
		{
			structure.putInteger(oFF.SacTableConstants.C_SN_PLAIN, oFF.XValueUtil.getInteger(plainValue, false, true));
			structure.putString(oFF.SacTableConstants.C_S_PASTABLE, this.getLocalizedNumber(plainValue));
		}
		else
		{
			structure.putString(oFF.SacTableConstants.C_SN_PLAIN, plainValue.getStringRepresentation());
			structure.putString(oFF.SacTableConstants.C_S_PASTABLE, effectiveFormattedText);
		}
	}
	if (oFF.isNull(plainValue) || (oFF.notNull(valuException) && valuException !== oFF.SacValueException.ZERO))
	{
		structure.putString(oFF.SacTableConstants.C_S_PASTABLE, effectiveFormattedText);
	}
	structure.putInteger(oFF.SacTableConstants.C_N_CELL_TYPE, tableCell.getEffectiveCellType());
	return structure;
};
oFF.SacTableClipboardHelper.prototype.formatCell = function(cell, structureToFormat)
{
	let styles = cell.getPrioritizedStylesList();
	if (cell.isEffectiveTotalsContext())
	{
		structureToFormat.putBoolean(oFF.SacTableConstants.C_B_IS_INA_TOTALS_CONTEXT, true);
	}
	structureToFormat.putBoolean(oFF.SacTableConstants.C_B_IS_IN_HIERARCHY, cell.isInHierarchy());
	structureToFormat.putBoolean(oFF.SacTableConstants.C_B_ALLOW_DRAG_DROP, cell.isAllowDragDrop());
	structureToFormat.putInteger(oFF.SacTableConstants.C_N_LEVEL, cell.getHierarchyLevel());
	structureToFormat.putInteger(cell.getHierarchyPaddingType(), cell.getHierarchyPaddingValue() * (1 + cell.getHierarchyLevel()));
	structureToFormat.putBoolean(oFF.SacTableConstants.C_B_SHOW_DRILL_ICON, cell.isShowDrillIcon());
	structureToFormat.putBoolean(oFF.SacTableConstants.C_B_EXPANDED, cell.isExpanded());
	let color = cell.getEffectiveFillColor(styles);
	if (oFF.notNull(color))
	{
		let style = this.getStyle(structureToFormat);
		style.putString(oFF.SacTableConstants.ST_S_FILL_COLOR, color);
	}
	this.transferStyledLineToJson(cell.getEffectiveStyledLineTop(styles), oFF.SacTableConstants.LP_TOP, structureToFormat);
	this.transferStyledLineToJson(cell.getEffectiveStyleLineBottom(styles), oFF.SacTableConstants.LP_BOTTOM, structureToFormat);
	this.transferStyledLineToJson(cell.getEffectiveStyledLineLeft(styles), oFF.SacTableConstants.LP_LEFT, structureToFormat);
	this.transferStyledLineToJson(cell.getEffectiveStyledLineRight(styles), oFF.SacTableConstants.LP_RIGHT, structureToFormat);
	if (cell.isEffectiveFontItalic(styles))
	{
		this.getFont(structureToFormat).putBoolean(oFF.SacTableConstants.FS_B_ITALIC, true);
	}
	if (cell.isEffectiveFontBold(styles))
	{
		this.getFont(structureToFormat).putBoolean(oFF.SacTableConstants.FS_B_BOLD, true);
	}
	if (cell.isEffectiveFontUnderline(styles))
	{
		this.getFont(structureToFormat).putBoolean(oFF.SacTableConstants.FS_B_UNDERLINE, true);
	}
	if (cell.isEffectiveFontStrikeThrough(styles))
	{
		this.getFont(structureToFormat).putBoolean(oFF.SacTableConstants.FS_B_STRIKETHROUGH, true);
	}
	let effectiveFontSize = cell.getEffectiveFontSize(styles);
	if (effectiveFontSize > 0)
	{
		this.getFont(structureToFormat).putDouble(oFF.SacTableConstants.FS_N_SIZE, effectiveFontSize);
	}
	let effectiveFontFamily = cell.getEffectiveFontFamily(styles);
	if (oFF.notNull(effectiveFontFamily))
	{
		this.getFont(structureToFormat).putString(oFF.SacTableConstants.FS_S_FAMILY, effectiveFontFamily);
	}
	color = cell.getEffectiveFontColor(styles);
	if (oFF.notNull(color))
	{
		this.getFont(structureToFormat).putString(oFF.SacTableConstants.FS_S_COLOR, color);
	}
	let effectiveThresholdColor = cell.getEffectiveThresholdColor(styles);
	if (oFF.notNull(effectiveThresholdColor))
	{
		this.getStyle(structureToFormat).putString(oFF.SacTableConstants.ST_S_THRESHOLD_COLOR, effectiveThresholdColor);
	}
	let effectiveSymbolStringConstant = oFF.SacTableConstantMapper.mapAlertSymbolToString(cell.getEffectiveThresholdType(styles));
	if (oFF.XStringUtils.isNotNullAndNotEmpty(effectiveSymbolStringConstant))
	{
		this.getStyle(structureToFormat).putString(oFF.SacTableConstants.ST_S_THRESHOLD_ICON_TYPE, effectiveSymbolStringConstant);
	}
	let hAlignment = cell.getEffectiveHorizontalAlignment(styles);
	let vAlignment = cell.getEffectiveVerticalAlignment(styles);
	if (oFF.notNull(hAlignment) || oFF.notNull(vAlignment))
	{
		let alignmentStructure = this.getStyle(structureToFormat).putNewStructure(oFF.SacTableConstants.ST_M_ALIGNMENT);
		if (hAlignment === oFF.SacVisualizationHorizontalAlignment.LEFT)
		{
			alignmentStructure.putInteger(oFF.SacTableConstants.STAL_N_HORIZONTAL, oFF.SacTableConstants.HA_LEFT);
		}
		else if (hAlignment === oFF.SacVisualizationHorizontalAlignment.CENTER)
		{
			alignmentStructure.putInteger(oFF.SacTableConstants.STAL_N_HORIZONTAL, oFF.SacTableConstants.HA_CENTER);
		}
		else if (hAlignment === oFF.SacVisualizationHorizontalAlignment.RIGHT)
		{
			alignmentStructure.putInteger(oFF.SacTableConstants.STAL_N_HORIZONTAL, oFF.SacTableConstants.HA_RIGHT);
		}
		if (vAlignment === oFF.SacVisualizationVerticalAlignment.TOP)
		{
			alignmentStructure.putInteger(oFF.SacTableConstants.STAL_N_VERTICAL, oFF.SacTableConstants.VA_TOP);
		}
		else if (vAlignment === oFF.SacVisualizationVerticalAlignment.MIDDLE)
		{
			alignmentStructure.putInteger(oFF.SacTableConstants.STAL_N_VERTICAL, oFF.SacTableConstants.VA_MIDDLE);
		}
		else if (vAlignment === oFF.SacVisualizationVerticalAlignment.BOTTOM)
		{
			alignmentStructure.putInteger(oFF.SacTableConstants.STAL_N_VERTICAL, oFF.SacTableConstants.VA_BOTTOM);
		}
	}
	let backgroundPatternType = cell.getEffectiveBackgroundPatternType(styles);
	if (backgroundPatternType === oFF.VisualizationBackgroundPatternType.BACKGROUND_IMAGE)
	{
		structureToFormat.putInteger(oFF.SacTableConstants.C_N_CELL_TYPE, oFF.SacTableConstants.CT_IMAGE);
		structureToFormat.putStringNotNullAndNotEmpty(oFF.SacTableConstants.C_S_FORMATTED, cell.getEffectiveBackgroundContent(styles));
	}
	else if (backgroundPatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_1)
	{
		structureToFormat.putInteger(oFF.SacTableConstants.C_N_CELL_TYPE, oFF.SacTableConstants.CT_IMAGE);
		structureToFormat.putString(oFF.SacTableConstants.C_S_FORMATTED, oFF.XStringUtils.concatenate2(oFF.SacTableConstants.IMG_B64_PREFIX_SHORT, oFF.SacTableConstants.BASE64_SVG_HATCHING_1));
	}
	else if (backgroundPatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_2)
	{
		structureToFormat.putInteger(oFF.SacTableConstants.C_N_CELL_TYPE, oFF.SacTableConstants.CT_IMAGE);
		structureToFormat.putString(oFF.SacTableConstants.C_S_FORMATTED, oFF.XStringUtils.concatenate2(oFF.SacTableConstants.IMG_B64_PREFIX_SHORT, oFF.SacTableConstants.BASE64_SVG_HATCHING_2));
	}
	else if (backgroundPatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_3)
	{
		structureToFormat.putInteger(oFF.SacTableConstants.C_N_CELL_TYPE, oFF.SacTableConstants.CT_IMAGE);
		structureToFormat.putString(oFF.SacTableConstants.C_S_FORMATTED, oFF.XStringUtils.concatenate2(oFF.SacTableConstants.IMG_B64_PREFIX_SHORT, oFF.SacTableConstants.BASE64_SVG_HATCHING_3));
	}
	else if (backgroundPatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_4)
	{
		structureToFormat.putInteger(oFF.SacTableConstants.C_N_CELL_TYPE, oFF.SacTableConstants.CT_IMAGE);
		structureToFormat.putString(oFF.SacTableConstants.C_S_FORMATTED, oFF.XStringUtils.concatenate2(oFF.SacTableConstants.IMG_B64_PREFIX_SHORT, oFF.SacTableConstants.BASE64_SVG_HATCHING_4));
	}
	else if (backgroundPatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_5)
	{
		structureToFormat.putInteger(oFF.SacTableConstants.C_N_CELL_TYPE, oFF.SacTableConstants.CT_IMAGE);
		structureToFormat.putString(oFF.SacTableConstants.C_S_FORMATTED, oFF.XStringUtils.concatenate2(oFF.SacTableConstants.IMG_B64_PREFIX_SHORT, oFF.SacTableConstants.BASE64_SVG_HATCHING_5));
	}
	else if (backgroundPatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_6)
	{
		structureToFormat.putInteger(oFF.SacTableConstants.C_N_CELL_TYPE, oFF.SacTableConstants.CT_IMAGE);
		structureToFormat.putString(oFF.SacTableConstants.C_S_FORMATTED, oFF.XStringUtils.concatenate2(oFF.SacTableConstants.IMG_B64_PREFIX_SHORT, oFF.SacTableConstants.BASE64_SVG_HATCHING_6));
	}
	else if (backgroundPatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_7)
	{
		structureToFormat.putInteger(oFF.SacTableConstants.C_N_CELL_TYPE, oFF.SacTableConstants.CT_IMAGE);
		structureToFormat.putString(oFF.SacTableConstants.C_S_FORMATTED, oFF.XStringUtils.concatenate2(oFF.SacTableConstants.IMG_B64_PREFIX_SHORT, oFF.SacTableConstants.BASE64_SVG_HATCHING_7));
	}
	else if (backgroundPatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_8)
	{
		structureToFormat.putInteger(oFF.SacTableConstants.C_N_CELL_TYPE, oFF.SacTableConstants.CT_IMAGE);
		structureToFormat.putString(oFF.SacTableConstants.C_S_FORMATTED, oFF.XStringUtils.concatenate2(oFF.SacTableConstants.IMG_B64_PREFIX_SHORT, oFF.SacTableConstants.BASE64_SVG_HATCHING_8));
	}
	return structureToFormat;
};
oFF.SacTableClipboardHelper.prototype.getCellValueAt = function(rowIndex, columnIndex)
{
	let headerRowList = this.m_tableInstance.getHeaderRowList();
	let dataRowList = this.m_tableInstance.getRowList();
	let headerRowListSize = headerRowList.size();
	let dataRowListSize = dataRowList.size();
	let row;
	if (rowIndex < headerRowListSize)
	{
		row = headerRowList.get(rowIndex);
	}
	else if (rowIndex < headerRowListSize + dataRowListSize)
	{
		row = dataRowList.get(rowIndex - headerRowListSize);
	}
	else
	{
		row = null;
	}
	let cell = null;
	if (oFF.notNull(row))
	{
		let cells = row.getCells();
		if (oFF.notNull(cells) && columnIndex < cells.size())
		{
			cell = cells.get(columnIndex);
		}
	}
	return oFF.isNull(cell) ? null : cell.getPlain();
};
oFF.SacTableClipboardHelper.prototype.getTable = function()
{
	return this.m_tableInstance;
};
oFF.SacTableClipboardHelper.prototype.indexOfFrom = function(src, strs, offset)
{
	let ret = oFF.XPair.create(oFF.XIntegerValue.create(-1), oFF.XIntegerValue.create(-1));
	for (let i = 0, l = strs.size(); i < l; i++)
	{
		let r = oFF.XString.indexOfFrom(src, strs.get(i), offset);
		if (r !== -1 && (ret.getFirstObject().getInteger() === -1 || r < ret.getFirstObject().getInteger()))
		{
			ret = oFF.XPair.create(oFF.XIntegerValue.create(r), oFF.XIntegerValue.create(i));
		}
	}
	return ret;
};
oFF.SacTableClipboardHelper.prototype.parseCsvContent = function(raw, comma)
{
	let csvTable = oFF.XList.create();
	let csvDel = oFF.XList.create();
	csvDel.add("\"");
	csvDel.add(comma);
	csvDel.add("\r\n");
	csvDel.add("\n");
	let inQuotes = false;
	let pushNewLine = true;
	let currentCell = null;
	for (let i = 0, l = oFF.XString.size(raw); i < l; )
	{
		let next = this.indexOfFrom(raw, csvDel, i);
		let end = next.getFirstObject().getInteger();
		let endSym = next.getSecondObject().getInteger();
		if (end === -1)
		{
			end = l;
		}
		if (i < end)
		{
			if (oFF.isNull(currentCell))
			{
				currentCell = oFF.XStringBuffer.create();
			}
			currentCell.append(oFF.XString.substring(raw, i, end));
		}
		if (endSym === 0)
		{
			if (oFF.isNull(currentCell))
			{
				inQuotes = true;
				currentCell = oFF.XStringBuffer.create();
			}
			else if (inQuotes && end + 1 < l && oFF.XString.getCharAt(raw, end + 1) === oFF.XString.getCharAt("\"", 0))
			{
				currentCell.append("\"");
				end++;
			}
			else if (inQuotes)
			{
				inQuotes = false;
			}
			else
			{
				currentCell.append("\"");
			}
		}
		i = end + (endSym !== -1 ? oFF.XString.size(csvDel.get(endSym)) : 0);
		if (endSym === 1 || endSym === 2 || endSym === 3 || i === l)
		{
			if (!inQuotes)
			{
				if (pushNewLine)
				{
					csvTable.add(oFF.XList.create());
					pushNewLine = false;
				}
				csvTable.get(csvTable.size() - 1).add(oFF.isNull(currentCell) ? "" : currentCell.toString());
				currentCell = null;
				if (endSym === 2 || endSym === 3)
				{
					pushNewLine = true;
				}
			}
			else
			{
				if (oFF.isNull(currentCell))
				{
					currentCell = oFF.XStringBuffer.create();
				}
				currentCell.append(csvDel.get(endSym));
			}
		}
		if (endSym === -1)
		{
			break;
		}
	}
	return csvTable;
};
oFF.SacTableClipboardHelper.prototype.pasteCells = function(pasting, column, row)
{
	let colMin = pasting.getIntegerByKey(oFF.SacTable.SELECTION_COL_MIN);
	let rowMin = pasting.getIntegerByKey(oFF.SacTable.SELECTION_ROW_MIN);
	let cellList = pasting.getListByKey(oFF.SacTable.SELECTION_LIST);
	for (let i = 0; i < cellList.size(); i++)
	{
		let cell = cellList.getStructureAt(i);
		let colIndex = cell.getIntegerByKey(oFF.SacTableConstants.C_N_COLUMN) - colMin + column;
		let rowIndex = cell.getIntegerByKey(oFF.SacTableConstants.C_N_ROW) - rowMin + row;
		let cells;
		let newCell;
		let headerRowList = this.m_tableInstance.getHeaderRowList();
		let dataRowList = this.m_tableInstance.getRowList();
		let headerRowListSize = headerRowList.size();
		if (rowIndex < headerRowListSize)
		{
			cells = headerRowList.get(rowIndex).getCells();
			if (colIndex < cells.size())
			{
				newCell = cells.get(colIndex);
				newCell.setFormatted(cell.getStringByKey(oFF.SacTableConstants.C_S_FORMATTED));
				newCell.setPlain(oFF.XStringValue.create(cell.getStringByKey(oFF.SacTableConstants.C_SN_PLAIN)));
			}
		}
		else if (rowIndex - headerRowListSize < dataRowList.size())
		{
			cells = dataRowList.get(rowIndex - headerRowListSize).getCells();
			if (colIndex < cells.size())
			{
				newCell = cells.get(colIndex);
				newCell.setFormatted(cell.getStringByKey(oFF.SacTableConstants.C_S_FORMATTED));
				newCell.setPlain(oFF.XStringValue.create(cell.getStringByKey(oFF.SacTableConstants.C_SN_PLAIN)));
			}
		}
	}
};
oFF.SacTableClipboardHelper.prototype.pasteString = function(pasting, column, row)
{
	let rows = this.parseCsvContent(pasting, oFF.TableClipboardHelperGeneric.TAB);
	for (let i = 0; i < rows.size(); i++)
	{
		let headerRowList = this.m_tableInstance.getHeaderRowList();
		let dataRowList = this.m_tableInstance.getRowList();
		let headerRowListSize = headerRowList.size();
		let rowIndex = row + i;
		let cells = null;
		if (rowIndex < headerRowListSize)
		{
			cells = headerRowList.get(rowIndex).getCells();
		}
		else if (rowIndex - headerRowListSize < dataRowList.size())
		{
			cells = dataRowList.get(rowIndex - headerRowListSize).getCells();
		}
		if (oFF.notNull(cells))
		{
			this.pasteLine(cells, rowIndex, column, rows.get(i));
		}
	}
};
oFF.SacTableClipboardHelper.prototype.setupWithTable = function(tableInstance)
{
	this.m_tableInstance = tableInstance;
	oFF.TableClipboardHelperGeneric.prototype.setup.call( this );
};

oFF.SacDataPathReference = function() {};
oFF.SacDataPathReference.prototype = new oFF.SacDataPath();
oFF.SacDataPathReference.prototype._ff_c = "SacDataPathReference";

oFF.SacDataPathReference.createReference = function()
{
	let instance = new oFF.SacDataPathReference();
	instance.setup();
	return instance;
};
oFF.SacDataPathReference.prototype.m_exactLevelEnd = null;
oFF.SacDataPathReference.prototype.m_exactLevelStart = null;
oFF.SacDataPathReference.prototype.m_sectionEnd = null;
oFF.SacDataPathReference.prototype.m_sectionStart = null;
oFF.SacDataPathReference.prototype.addNewPathElement = function()
{
	let element = oFF.SacDataSectionInfoReference.create();
	this.m_pathElements.add(element);
	return element;
};
oFF.SacDataPathReference.prototype.copyFrom = function(other, flags)
{
	let orig = other;
	oFF.SacDataPath.prototype.copyFrom.call( this , other, flags);
	this.m_sectionStart = orig.m_sectionStart;
	this.m_sectionEnd = orig.m_sectionEnd;
	this.m_exactLevelStart = orig.m_exactLevelStart;
	this.m_exactLevelEnd = orig.m_exactLevelEnd;
};
oFF.SacDataPathReference.prototype.getMatchingInfoReferenceForGroupLevel = function(groupLevelTag)
{
	let levelMatching = this.m_pathElementMapByLevels.getByKey(oFF.XIntegerValue.create(groupLevelTag.getGroupLevel()));
	if (!oFF.XCollectionUtils.hasElements(levelMatching))
	{
		levelMatching = this.m_pathElementMapByLevels.getByKey(oFF.XIntegerValue.create(groupLevelTag.getReversedGroupLevel()));
	}
	return oFF.XCollectionUtils.hasElements(levelMatching) ? levelMatching.get(0) : null;
};
oFF.SacDataPathReference.prototype.getMaxHeaderGroupLevel = function(headerGroupNames, headerGroupMap)
{
	return oFF.XStream.of(this.m_pathElements).map((pe) => {
		return oFF.XIntegerValue.create(pe.getEffectiveGroupLevel(headerGroupNames, headerGroupMap));
	}).reduce(oFF.XIntegerValue.create(-1), (a, b) => {
		return oFF.XIntegerValue.create(oFF.XMath.max(a.getInteger(), b.getInteger()));
	}).getInteger();
};
oFF.SacDataPathReference.prototype.isMatchingExactLevelEnd = function()
{
	return this.m_exactLevelEnd;
};
oFF.SacDataPathReference.prototype.isMatchingExactLevelStart = function()
{
	return this.m_exactLevelStart;
};
oFF.SacDataPathReference.prototype.isMatchingGroupSectionEnd = function()
{
	return this.m_sectionEnd;
};
oFF.SacDataPathReference.prototype.isMatchingGroupSectionStart = function()
{
	return this.m_sectionStart;
};
oFF.SacDataPathReference.prototype.setMatchingExactLevelEnd = function(exactLevelEnd)
{
	this.m_exactLevelEnd = exactLevelEnd;
};
oFF.SacDataPathReference.prototype.setMatchingExactLevelStart = function(exactLevelStart)
{
	this.m_exactLevelStart = exactLevelStart;
};
oFF.SacDataPathReference.prototype.setMatchingGroupSectionEnd = function(sectionEnd)
{
	this.m_sectionEnd = sectionEnd;
};
oFF.SacDataPathReference.prototype.setMatchingGroupSectionStart = function(sectionStart)
{
	this.m_sectionStart = sectionStart;
};

oFF.SacDataPathTag = function() {};
oFF.SacDataPathTag.prototype = new oFF.SacDataPath();
oFF.SacDataPathTag.prototype._ff_c = "SacDataPathTag";

oFF.SacDataPathTag.createTag = function()
{
	let instance = new oFF.SacDataPathTag();
	instance.setup();
	return instance;
};
oFF.SacDataPathTag.prototype.m_levels = null;
oFF.SacDataPathTag.prototype.m_maxLevel = 0;
oFF.SacDataPathTag.prototype.add = function(tag)
{
	this.m_pathElements.add(tag);
};
oFF.SacDataPathTag.prototype.addGroupLevelIndex = function(groupLevelIndex)
{
	let gli = oFF.XIntegerValue.create(groupLevelIndex);
	if (!this.m_levels.contains(gli))
	{
		this.m_levels.add(gli);
	}
};
oFF.SacDataPathTag.prototype.addNewPathElement = function()
{
	let element = oFF.SacDataSectionInfoTag.create();
	this.m_pathElements.add(element);
	return element;
};
oFF.SacDataPathTag.prototype.anyMatchPathElements = function(pathElement)
{
	return oFF.XStream.of(this.getPathElements()).anyMatch((subElement) => {
		return subElement.matches(pathElement);
	});
};
oFF.SacDataPathTag.prototype.applyBandInformation = function()
{
	let totalLevels = oFF.XStream.of(this.m_pathElements).filter((pe) => {
		return pe.isTotal();
	}).map((el) => {
		return oFF.XIntegerValue.create(el.getGroupLevel());
	}).collect(oFF.XStreamCollector.toList());
	oFF.XCollectionUtils.forEach(this.m_pathElements, (pael) => {
		let totalBand = totalLevels.contains(oFF.XIntegerValue.create(pael.getGroupLevel() + 1));
		pael.setTotalBand(totalBand);
		pael.setInnerBand(!totalBand);
	});
};
oFF.SacDataPathTag.prototype.containsLevel = function(groupLevelIndex)
{
	return groupLevelIndex === -1 || this.m_levels.contains(oFF.XIntegerValue.create(groupLevelIndex));
};
oFF.SacDataPathTag.prototype.copyElements = function(other)
{
	oFF.SacDataPath.prototype.copyFrom.call( this , other, null);
};
oFF.SacDataPathTag.prototype.copyFrom = function(other, flags)
{
	let orig = other;
	oFF.SacDataPath.prototype.copyFrom.call( this , other, flags);
	this.m_maxLevel = orig.m_maxLevel;
};
oFF.SacDataPathTag.prototype.getMatchingTags = function(groupLevel, reference)
{
	let groupLevelFilter = (pe) => {
		let peGl = pe.getGroupLevel();
		if (peGl <= groupLevel && pe.isExactSectionLevel() && peGl > -2)
		{
			let peR = reference.getMatchingInfoReferenceForGroupLevel(pe);
			return oFF.isNull(peR) || pe.matches(peR);
		}
		else
		{
			return false;
		}
	};
	return oFF.XStream.of(this.getPathElements()).filter(groupLevelFilter).collect(oFF.XStreamCollector.toList());
};
oFF.SacDataPathTag.prototype.getMaxLevel = function()
{
	return this.m_maxLevel;
};
oFF.SacDataPathTag.prototype.matches = function(element, maxReferenceLevel)
{
	let result = (oFF.XStream.of(this.getPathElements()).anyMatch((pe) => {
		return pe.getGroupLevel() === maxReferenceLevel && this.matchesSections(element, pe);
	}) || this.noSectionMatchNeeded(element)) && oFF.XStream.of(element.getPathElements()).allMatch((pathElement) => {
		return this.anyMatchPathElements(pathElement);
	});
	return result;
};
oFF.SacDataPathTag.prototype.matchesSectionReference = function(tableAxisSectionReference, headerGroupNames, headerGroupMap)
{
	let result = oFF.XStream.of(tableAxisSectionReference.getDataPaths()).anyMatch((element) => {
		return this.matches(element, element.getMaxHeaderGroupLevel(headerGroupNames, headerGroupMap));
	});
	return result;
};
oFF.SacDataPathTag.prototype.matchesSections = function(element, sectionInfoTag)
{
	return oFF.TriStateMatchingUtil.matchesTriStateStrictPositive(element.isMatchingGroupSectionStart(), sectionInfoTag.isGroupLevelStart()) || oFF.TriStateMatchingUtil.matchesTriStateStrictPositive(element.isMatchingGroupSectionEnd(), sectionInfoTag.isGroupLevelEnd()) || oFF.TriStateMatchingUtil.matchesTriStateStrictPositive(element.isMatchingExactLevelStart(), sectionInfoTag.isSectionLevelStart()) || oFF.TriStateMatchingUtil.matchesTriStateStrictPositive(element.isMatchingExactLevelEnd(), sectionInfoTag.isSectionLevelEnd()) || oFF.TriStateMatchingUtil.matchesTriStateNegative(element.isMatchingGroupSectionStart(), sectionInfoTag.isGroupLevelStart()) && oFF.TriStateMatchingUtil.matchesTriStateNegative(element.isMatchingGroupSectionEnd(), sectionInfoTag.isGroupLevelEnd()) && oFF.TriStateMatchingUtil.matchesTriStateNegative(element.isMatchingExactLevelStart(), sectionInfoTag.isSectionLevelStart()) && oFF.TriStateMatchingUtil.matchesTriStateNegative(element.isMatchingExactLevelEnd(), sectionInfoTag.isSectionLevelEnd());
};
oFF.SacDataPathTag.prototype.matchesSiblingWithGroupLevelFilter = function(pathElement, groupLevelFilter)
{
	return oFF.XStream.of(this.getPathElements()).filter(groupLevelFilter).anyMatch((subElement) => {
		return subElement.matchesSibling(pathElement);
	});
};
oFF.SacDataPathTag.prototype.matchesTag = function(tag, groupLevel, reference)
{
	let groupLevelFilter = (pe) => {
		let peGl = pe.getGroupLevel();
		if (peGl <= groupLevel && pe.isExactSectionLevel() && peGl > -1)
		{
			let peR = reference.getMatchingInfoReferenceForGroupLevel(pe);
			return oFF.isNull(peR) || pe.matches(peR);
		}
		else
		{
			return false;
		}
	};
	let result = oFF.XStream.of(tag.getPathElements()).filter(groupLevelFilter).allMatch((pathElement) => {
		return this.matchesSiblingWithGroupLevelFilter(pathElement, groupLevelFilter);
	});
	return result;
};
oFF.SacDataPathTag.prototype.noSectionMatchNeeded = function(element)
{
	return oFF.TriStateMatchingUtil.mayIgnoreTriState(element.isMatchingGroupSectionStart()) && oFF.TriStateMatchingUtil.mayIgnoreTriState(element.isMatchingGroupSectionEnd()) && oFF.TriStateMatchingUtil.mayIgnoreTriState(element.isMatchingExactLevelStart()) && oFF.TriStateMatchingUtil.mayIgnoreTriState(element.isMatchingExactLevelEnd());
};
oFF.SacDataPathTag.prototype.setup = function()
{
	oFF.SacDataPath.prototype.setup.call( this );
	this.m_levels = oFF.XList.create();
};
oFF.SacDataPathTag.prototype.updateMaxLevel = function(maxLevel)
{
	this.m_maxLevel = oFF.XMath.max(maxLevel, maxLevel);
};

oFF.SacDataPointStyle = function() {};
oFF.SacDataPointStyle.prototype = new oFF.XObject();
oFF.SacDataPointStyle.prototype._ff_c = "SacDataPointStyle";

oFF.SacDataPointStyle.create = function()
{
	let instance = new oFF.SacDataPointStyle();
	instance.setup();
	return instance;
};
oFF.SacDataPointStyle.prototype.m_alertLevelMax = null;
oFF.SacDataPointStyle.prototype.m_alertLevelMin = null;
oFF.SacDataPointStyle.prototype.m_axisPathElements = null;
oFF.SacDataPointStyle.prototype.m_dataPointCategoryName = null;
oFF.SacDataPointStyle.prototype.m_dataPointCategoryText = null;
oFF.SacDataPointStyle.prototype.m_exceptionName = null;
oFF.SacDataPointStyle.prototype.m_tableStyle = null;
oFF.SacDataPointStyle.prototype.m_tags = null;
oFF.SacDataPointStyle.prototype.m_unmatchedAlertLevels = false;
oFF.SacDataPointStyle.prototype.m_unmatchedExceptions = false;
oFF.SacDataPointStyle.prototype.m_unmatchedPathElements = false;
oFF.SacDataPointStyle.prototype.m_unmatchedTags = false;
oFF.SacDataPointStyle.prototype.m_unmatchedValueSigns = false;
oFF.SacDataPointStyle.prototype.m_valueSign = null;
oFF.SacDataPointStyle.prototype.addNewPathElement = function()
{
	let reference = oFF.SacDataSectionInfoReference.create();
	this.m_axisPathElements.add(reference);
	this.m_unmatchedPathElements = false;
	return reference;
};
oFF.SacDataPointStyle.prototype.addTag = function(tag)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(tag))
	{
		this.m_tags.add(tag);
		this.m_unmatchedTags = false;
	}
};
oFF.SacDataPointStyle.prototype.clearPathElements = function()
{
	this.m_axisPathElements.clear();
	this.m_unmatchedPathElements = false;
};
oFF.SacDataPointStyle.prototype.clearTags = function()
{
	this.m_tags.clear();
};
oFF.SacDataPointStyle.prototype.getAlertLevel = function()
{
	return this.m_alertLevelMin === this.m_alertLevelMax ? this.m_alertLevelMin : null;
};
oFF.SacDataPointStyle.prototype.getAlertLevelMax = function()
{
	return this.m_alertLevelMax;
};
oFF.SacDataPointStyle.prototype.getAlertLevelMin = function()
{
	return this.m_alertLevelMin;
};
oFF.SacDataPointStyle.prototype.getDataPointCategoryName = function()
{
	return this.m_dataPointCategoryName;
};
oFF.SacDataPointStyle.prototype.getDataPointCategoryText = function()
{
	return this.m_dataPointCategoryText;
};
oFF.SacDataPointStyle.prototype.getExceptionName = function()
{
	return this.m_exceptionName;
};
oFF.SacDataPointStyle.prototype.getPathElements = function()
{
	return this.m_axisPathElements;
};
oFF.SacDataPointStyle.prototype.getPriority = function()
{
	return this.m_tableStyle.getPriority();
};
oFF.SacDataPointStyle.prototype.getTableStyle = function()
{
	return this.m_tableStyle;
};
oFF.SacDataPointStyle.prototype.getTags = function()
{
	return this.m_tags;
};
oFF.SacDataPointStyle.prototype.getValueSign = function()
{
	return this.m_valueSign;
};
oFF.SacDataPointStyle.prototype.isUnmatchedAlertLevels = function()
{
	return this.m_unmatchedAlertLevels;
};
oFF.SacDataPointStyle.prototype.isUnmatchedExceptions = function()
{
	return this.m_unmatchedExceptions;
};
oFF.SacDataPointStyle.prototype.isUnmatchedPathElements = function()
{
	return this.m_unmatchedPathElements;
};
oFF.SacDataPointStyle.prototype.isUnmatchedTags = function()
{
	return this.m_unmatchedTags;
};
oFF.SacDataPointStyle.prototype.isUnmatchedValueSigns = function()
{
	return this.m_unmatchedValueSigns;
};
oFF.SacDataPointStyle.prototype.matchesExceptionInfo = function(exceptionInfo)
{
	let matchesException = oFF.XStringUtils.isNullOrEmpty(this.m_exceptionName) || oFF.XString.isEqual(this.m_exceptionName, exceptionInfo.getExceptionName());
	let fitsLowerBound = oFF.isNull(this.m_alertLevelMin) || this.m_alertLevelMin.getLevel() <= exceptionInfo.getLevel().getLevel();
	let fitsUpperBound = oFF.isNull(this.m_alertLevelMax) || this.m_alertLevelMax.getLevel() >= exceptionInfo.getLevel().getLevel();
	let matchesValueSign = oFF.isNull(this.m_valueSign) || this.getValueSign() === exceptionInfo.getValueSign();
	let matchesTags = !oFF.XCollectionUtils.hasElements(this.m_tags) || oFF.XStream.ofString(this.m_tags).allMatch((tag) => {
		return exceptionInfo.getTags().contains(tag.getString());
	});
	return matchesException && fitsLowerBound && fitsUpperBound && matchesValueSign && matchesTags;
};
oFF.SacDataPointStyle.prototype.matchesExceptionInfoExt = function(exceptionInfo, matchedExceptionNames, matchedAlertLevelsByException, matchedAlertLevels, matchedValueSigns)
{
	let exceptionName = exceptionInfo.getExceptionName();
	let valueSign = exceptionInfo.getValueSign();
	let alertLevel = exceptionInfo.getLevel();
	let hasColor = oFF.XStringUtils.isNotNullAndNotEmpty(exceptionInfo.getColor());
	let exceptionAlertLevels = oFF.isNull(this.m_exceptionName) ? matchedAlertLevels : matchedAlertLevelsByException.getByKey(this.m_exceptionName);
	let matchesException = !this.m_unmatchedExceptions && oFF.XStringUtils.isNullOrEmpty(this.m_exceptionName) || oFF.XString.isEqual(this.m_exceptionName, exceptionName);
	let matchesRemainingExceptions = !hasColor && this.m_unmatchedExceptions && !matchedExceptionNames.contains(exceptionName) && oFF.isNull(this.m_valueSign);
	let fitsLowerBound = !this.m_unmatchedAlertLevels && oFF.isNull(this.m_alertLevelMin) || oFF.notNull(this.m_alertLevelMin) && this.m_alertLevelMin.getLevel() <= alertLevel.getLevel();
	let fitsUpperBound = !this.m_unmatchedAlertLevels && oFF.isNull(this.m_alertLevelMax) || oFF.notNull(this.m_alertLevelMax) && this.m_alertLevelMax.getLevel() >= alertLevel.getLevel();
	let fitsRemainingLevels = !hasColor && this.m_unmatchedAlertLevels && oFF.isNull(this.m_valueSign) && (oFF.isNull(exceptionAlertLevels) || !exceptionAlertLevels.contains(alertLevel));
	let matchesValueSign = !this.m_unmatchedValueSigns && oFF.isNull(this.m_valueSign) || this.m_valueSign === valueSign;
	let matchesRemainingValueSign = !hasColor && this.m_unmatchedValueSigns && !matchedValueSigns.contains(valueSign) && oFF.isNull(this.m_exceptionName) && oFF.isNull(this.m_alertLevelMax) && oFF.isNull(this.m_alertLevelMin);
	return (matchesException || matchesRemainingExceptions) && (fitsLowerBound && fitsUpperBound || fitsRemainingLevels) && (matchesValueSign || matchesRemainingValueSign);
};
oFF.SacDataPointStyle.prototype.releaseObject = function()
{
	this.m_exceptionName = null;
	this.m_alertLevelMin = null;
	this.m_alertLevelMax = null;
	this.m_dataPointCategoryText = null;
	this.m_dataPointCategoryName = null;
	this.m_axisPathElements = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_axisPathElements);
	this.m_tableStyle = oFF.XObjectExt.release(this.m_tableStyle);
	this.m_unmatchedTags = false;
	this.m_tags = oFF.XObjectExt.release(this.m_tags);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.SacDataPointStyle.prototype.setAlertLevel = function(alertLevel)
{
	if (oFF.notNull(alertLevel))
	{
		this.m_unmatchedAlertLevels = false;
	}
	this.m_alertLevelMin = alertLevel;
	this.m_alertLevelMax = alertLevel;
};
oFF.SacDataPointStyle.prototype.setAlertLevelMax = function(alertLevelMax)
{
	if (oFF.notNull(alertLevelMax))
	{
		this.m_unmatchedAlertLevels = false;
	}
	this.m_alertLevelMax = alertLevelMax;
};
oFF.SacDataPointStyle.prototype.setAlertLevelMin = function(alertLevelMin)
{
	if (oFF.notNull(alertLevelMin))
	{
		this.m_unmatchedAlertLevels = false;
	}
	this.m_alertLevelMin = alertLevelMin;
};
oFF.SacDataPointStyle.prototype.setDataPointCategoryName = function(dataPointCategoryName)
{
	this.m_dataPointCategoryName = dataPointCategoryName;
};
oFF.SacDataPointStyle.prototype.setDataPointCategoryText = function(dataPointCategoryText)
{
	this.m_dataPointCategoryText = dataPointCategoryText;
};
oFF.SacDataPointStyle.prototype.setExceptionName = function(exceptionName)
{
	if (oFF.notNull(exceptionName))
	{
		this.m_unmatchedExceptions = false;
	}
	this.m_exceptionName = exceptionName;
};
oFF.SacDataPointStyle.prototype.setPriority = function(priority)
{
	this.m_tableStyle.setPriority(priority);
};
oFF.SacDataPointStyle.prototype.setUnmatchedAlertLevels = function()
{
	this.m_unmatchedAlertLevels = true;
	this.m_alertLevelMax = null;
	this.m_alertLevelMin = null;
};
oFF.SacDataPointStyle.prototype.setUnmatchedExceptions = function()
{
	this.m_unmatchedExceptions = true;
	this.m_exceptionName = null;
};
oFF.SacDataPointStyle.prototype.setUnmatchedPathElements = function()
{
	this.m_axisPathElements.clear();
	this.m_unmatchedPathElements = true;
};
oFF.SacDataPointStyle.prototype.setUnmatchedTags = function()
{
	this.m_unmatchedTags = true;
	this.m_tags.clear();
};
oFF.SacDataPointStyle.prototype.setUnmatchedValueSigns = function()
{
	this.m_valueSign = null;
	this.m_unmatchedValueSigns = true;
};
oFF.SacDataPointStyle.prototype.setValueSign = function(valueSign)
{
	if (oFF.notNull(valueSign))
	{
		this.m_unmatchedValueSigns = false;
	}
	this.m_valueSign = valueSign;
};
oFF.SacDataPointStyle.prototype.setup = function()
{
	oFF.XObject.prototype.setup.call( this );
	this.m_tableStyle = oFF.SacTableStyle.create();
	this.m_axisPathElements = oFF.XList.create();
	this.m_tags = oFF.XList.create();
};

oFF.SacDataSectionInfo = function() {};
oFF.SacDataSectionInfo.prototype = new oFF.XObject();
oFF.SacDataSectionInfo.prototype._ff_c = "SacDataSectionInfo";

oFF.SacDataSectionInfo.prototype.m_exactSectionLevel = false;
oFF.SacDataSectionInfo.prototype.m_groupLevel = 0;
oFF.SacDataSectionInfo.prototype.m_groupName = null;
oFF.SacDataSectionInfo.prototype.m_sectionLevel = 0;
oFF.SacDataSectionInfo.prototype.m_sectionLevelName = null;
oFF.SacDataSectionInfo.prototype.copyFrom = function(other, flags)
{
	let orig = other;
	this.m_groupName = orig.m_groupName;
	this.m_groupLevel = orig.m_groupLevel;
	this.m_sectionLevelName = orig.m_sectionLevelName;
	this.m_sectionLevel = orig.m_sectionLevel;
	this.m_exactSectionLevel = orig.m_exactSectionLevel;
};
oFF.SacDataSectionInfo.prototype.getGroupLevel = function()
{
	return this.m_groupLevel;
};
oFF.SacDataSectionInfo.prototype.getGroupName = function()
{
	return this.m_groupName;
};
oFF.SacDataSectionInfo.prototype.getSectionLevel = function()
{
	return this.m_sectionLevel;
};
oFF.SacDataSectionInfo.prototype.getSectionLevelName = function()
{
	return this.m_sectionLevelName;
};
oFF.SacDataSectionInfo.prototype.isEqualTo = function(other)
{
	if (oFF.isNull(other))
	{
		return false;
	}
	if (this === other)
	{
		return true;
	}
	if (!oFF.XString.isEqual(this.getClassName(), other.getClassName()))
	{
		return false;
	}
	let otherInfo = other;
	return this.m_sectionLevel === otherInfo.m_sectionLevel && this.m_groupLevel === otherInfo.m_groupLevel && this.m_exactSectionLevel === otherInfo.m_exactSectionLevel && oFF.XString.isEqual(this.m_groupName, otherInfo.m_groupName) && oFF.XString.isEqual(this.m_sectionLevelName, otherInfo.m_sectionLevelName);
};
oFF.SacDataSectionInfo.prototype.isExactSectionLevel = function()
{
	return this.m_exactSectionLevel;
};
oFF.SacDataSectionInfo.prototype.setExactSectionLevel = function(exactSectionLevel)
{
	this.m_exactSectionLevel = exactSectionLevel;
};
oFF.SacDataSectionInfo.prototype.setGroupLevel = function(groupLevel)
{
	this.m_groupLevel = groupLevel;
};
oFF.SacDataSectionInfo.prototype.setGroupName = function(groupName)
{
	this.m_groupName = groupName;
};
oFF.SacDataSectionInfo.prototype.setSectionLevel = function(sectionLevel)
{
	this.m_sectionLevel = sectionLevel;
};
oFF.SacDataSectionInfo.prototype.setSectionLevelName = function(sectionLevelName)
{
	this.m_sectionLevelName = sectionLevelName;
};
oFF.SacDataSectionInfo.prototype.setup = function()
{
	this.m_groupLevel = -1;
	this.m_sectionLevel = -1;
};

oFF.SacHeaderSectionInfoReference = function() {};
oFF.SacHeaderSectionInfoReference.prototype = new oFF.SacHeaderSectionInfo();
oFF.SacHeaderSectionInfoReference.prototype._ff_c = "SacHeaderSectionInfoReference";

oFF.SacHeaderSectionInfoReference.createReference = function()
{
	let instance = new oFF.SacHeaderSectionInfoReference();
	instance.setup();
	return instance;
};
oFF.SacHeaderSectionInfoReference.prototype.m_sectionEnd = null;
oFF.SacHeaderSectionInfoReference.prototype.m_sectionStart = null;
oFF.SacHeaderSectionInfoReference.prototype.isSectionEnd = function()
{
	return this.m_sectionEnd;
};
oFF.SacHeaderSectionInfoReference.prototype.isSectionStart = function()
{
	return this.m_sectionStart;
};
oFF.SacHeaderSectionInfoReference.prototype.setSectionEnd = function(sectionEnd)
{
	this.m_sectionEnd = sectionEnd;
};
oFF.SacHeaderSectionInfoReference.prototype.setSectionStart = function(sectionStart)
{
	this.m_sectionStart = sectionStart;
};

oFF.SacHeaderSectionInfoTag = function() {};
oFF.SacHeaderSectionInfoTag.prototype = new oFF.SacHeaderSectionInfo();
oFF.SacHeaderSectionInfoTag.prototype._ff_c = "SacHeaderSectionInfoTag";

oFF.SacHeaderSectionInfoTag.createTag = function(start, end)
{
	let instance = new oFF.SacHeaderSectionInfoTag();
	instance.setupTag(start, end);
	return instance;
};
oFF.SacHeaderSectionInfoTag.prototype.m_reversedAxisLevel = 0;
oFF.SacHeaderSectionInfoTag.prototype.m_sectionEnd = false;
oFF.SacHeaderSectionInfoTag.prototype.m_sectionStart = false;
oFF.SacHeaderSectionInfoTag.prototype.getReversedAxisLevel = function()
{
	return this.m_reversedAxisLevel;
};
oFF.SacHeaderSectionInfoTag.prototype.isSectionEnd = function()
{
	return this.m_sectionEnd;
};
oFF.SacHeaderSectionInfoTag.prototype.isSectionStart = function()
{
	return this.m_sectionStart;
};
oFF.SacHeaderSectionInfoTag.prototype.matches = function(element)
{
	let result = (!element.isExactHeaderLevel() || this.isExactHeaderLevel()) && this.matchesSections(element) && (element.getAxisLevel() === -1 || this.getAxisLevel() === element.getAxisLevel() || this.getReversedAxisLevel() === element.getAxisLevel()) && (element.getHeaderLevel() === -1 || this.getHeaderLevel() === element.getHeaderLevel()) && (oFF.XStringUtils.isNullOrEmpty(element.getHeaderName()) || oFF.XString.isEqual(element.getHeaderName(), this.getHeaderName()));
	return result;
};
oFF.SacHeaderSectionInfoTag.prototype.matchesSectionReference = function(tableAxisSectionReference)
{
	let result = oFF.XStream.of(tableAxisSectionReference.getHeaderSectionInfos()).anyMatch((element) => {
		return this.matches(element);
	});
	return result;
};
oFF.SacHeaderSectionInfoTag.prototype.matchesSections = function(element)
{
	return oFF.TriStateMatchingUtil.matchesTriStateStrictPositive(element.isSectionStart(), this.isSectionStart()) || oFF.TriStateMatchingUtil.matchesTriStateStrictPositive(element.isSectionEnd(), this.isSectionEnd()) || (oFF.TriStateMatchingUtil.matchesTriStateNegative(element.isSectionStart(), this.isSectionStart()) && oFF.TriStateMatchingUtil.matchesTriStateNegative(element.isSectionEnd(), this.isSectionEnd()));
};
oFF.SacHeaderSectionInfoTag.prototype.matchesTag = function(tag)
{
	let result = (!tag.isExactHeaderLevel() || this.isExactHeaderLevel()) && this.getAxisLevel() === tag.getAxisLevel() && this.getHeaderLevel() === tag.getHeaderLevel() && (oFF.XStringUtils.isNullOrEmpty(tag.getHeaderName()) || oFF.XString.isEqual(tag.getHeaderName(), this.getHeaderName()));
	return result;
};
oFF.SacHeaderSectionInfoTag.prototype.setReversedAxisLevel = function(reversedAxisLevel)
{
	this.m_reversedAxisLevel = reversedAxisLevel;
};
oFF.SacHeaderSectionInfoTag.prototype.setSectionEnd = function(sectionEnd)
{
	this.m_sectionEnd = sectionEnd;
};
oFF.SacHeaderSectionInfoTag.prototype.setSectionStart = function(sectionStart)
{
	this.m_sectionStart = sectionStart;
};
oFF.SacHeaderSectionInfoTag.prototype.setupTag = function(start, end)
{
	oFF.SacHeaderSectionInfo.prototype.setup.call( this );
	this.m_sectionEnd = end;
	this.m_sectionStart = start;
};

oFF.AbstractChartPart = function() {};
oFF.AbstractChartPart.prototype = new oFF.XObject();
oFF.AbstractChartPart.prototype._ff_c = "AbstractChartPart";

oFF.AbstractChartPart.prototype.m_name = null;
oFF.AbstractChartPart.prototype.m_text = null;
oFF.AbstractChartPart.prototype.getName = function()
{
	return this.m_name;
};
oFF.AbstractChartPart.prototype.getText = function()
{
	return this.m_text;
};
oFF.AbstractChartPart.prototype.initialize = function(name, text)
{
	this.m_name = name;
	this.m_text = text;
	this.setup();
};
oFF.AbstractChartPart.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.m_name = null;
	this.m_text = null;
};
oFF.AbstractChartPart.prototype.setText = function(text)
{
	this.m_text = text;
};

oFF.SacBasicTableClipboardHelper = function() {};
oFF.SacBasicTableClipboardHelper.prototype = new oFF.SacTableClipboardHelper();
oFF.SacBasicTableClipboardHelper.prototype._ff_c = "SacBasicTableClipboardHelper";

oFF.SacBasicTableClipboardHelper.create = function(tableInstance)
{
	let instance = new oFF.SacBasicTableClipboardHelper();
	instance.setupWithTable(tableInstance);
	return instance;
};

oFF.SacStyledLine = function() {};
oFF.SacStyledLine.prototype = new oFF.XObjectExt();
oFF.SacStyledLine.prototype._ff_c = "SacStyledLine";

oFF.SacStyledLine.create = function()
{
	let instance = new oFF.SacStyledLine();
	instance.setup();
	return instance;
};
oFF.SacStyledLine.prototype.m_bottomPadding = 0.0;
oFF.SacStyledLine.prototype.m_color = null;
oFF.SacStyledLine.prototype.m_leftPadding = 0.0;
oFF.SacStyledLine.prototype.m_lineStyle = null;
oFF.SacStyledLine.prototype.m_patternBackground = null;
oFF.SacStyledLine.prototype.m_patternBorderColor = null;
oFF.SacStyledLine.prototype.m_patternColor = null;
oFF.SacStyledLine.prototype.m_patternType = null;
oFF.SacStyledLine.prototype.m_patternWidth = 0.0;
oFF.SacStyledLine.prototype.m_rightPadding = 0.0;
oFF.SacStyledLine.prototype.m_topPadding = 0.0;
oFF.SacStyledLine.prototype.m_width = 0.0;
oFF.SacStyledLine.prototype.getBottomPadding = function()
{
	return this.m_bottomPadding;
};
oFF.SacStyledLine.prototype.getColor = function()
{
	return this.m_color;
};
oFF.SacStyledLine.prototype.getLeftPadding = function()
{
	return this.m_leftPadding;
};
oFF.SacStyledLine.prototype.getLineStyle = function()
{
	return this.m_lineStyle;
};
oFF.SacStyledLine.prototype.getPatternBackground = function()
{
	return this.m_patternBackground;
};
oFF.SacStyledLine.prototype.getPatternBorderColor = function()
{
	return this.m_patternBorderColor;
};
oFF.SacStyledLine.prototype.getPatternColor = function()
{
	return this.m_patternColor;
};
oFF.SacStyledLine.prototype.getPatternType = function()
{
	return this.m_patternType;
};
oFF.SacStyledLine.prototype.getPatternWidth = function()
{
	return this.m_patternWidth;
};
oFF.SacStyledLine.prototype.getRightPadding = function()
{
	return this.m_rightPadding;
};
oFF.SacStyledLine.prototype.getTopPadding = function()
{
	return this.m_topPadding;
};
oFF.SacStyledLine.prototype.getWidth = function()
{
	return this.m_width;
};
oFF.SacStyledLine.prototype.hasPadding = function()
{
	return this.m_leftPadding > -1 || this.m_rightPadding > -1 || this.m_topPadding > -1 || this.m_bottomPadding > -1;
};
oFF.SacStyledLine.prototype.isDefined = function()
{
	return this.m_width > -1 || this.m_patternWidth > 0 || this.m_bottomPadding > -1 || this.m_topPadding > -1 || this.m_leftPadding > -1 || this.m_rightPadding > -1 || oFF.XStringUtils.isNotNullAndNotEmpty(this.m_color) || oFF.XStringUtils.isNotNullAndNotEmpty(this.m_patternBackground) || oFF.XStringUtils.isNotNullAndNotEmpty(this.m_patternColor) || oFF.XStringUtils.isNotNullAndNotEmpty(this.m_patternBorderColor) || oFF.notNull(this.m_patternType) && this.m_patternType !== oFF.VisualizationBackgroundPatternType.INHERIT || oFF.notNull(this.m_lineStyle) && this.m_lineStyle !== oFF.SacTableLineStyle.INHERIT;
};
oFF.SacStyledLine.prototype.isEmpty = function()
{
	return this.m_width === -1 && oFF.isNull(this.m_color) && oFF.isNull(this.m_patternBackground) && oFF.isNull(this.m_patternBorderColor) && this.m_patternWidth === 0 && oFF.isNull(this.m_patternColor) && !this.hasPadding() && (oFF.isNull(this.m_patternType) || this.m_patternType === oFF.VisualizationBackgroundPatternType.INHERIT) && (oFF.isNull(this.m_lineStyle) || this.m_lineStyle === oFF.SacTableLineStyle.INHERIT);
};
oFF.SacStyledLine.prototype.mergeIntoMe = function(other)
{
	let mayBeIncomplete = false;
	if (oFF.isNull(other))
	{
		return true;
	}
	if (this.m_width === -1)
	{
		this.m_width = other.getWidth();
		mayBeIncomplete = true;
	}
	if (oFF.isNull(this.m_color))
	{
		this.m_color = other.getColor();
		mayBeIncomplete = true;
	}
	if (oFF.isNull(this.m_patternBackground))
	{
		this.m_patternBackground = other.getPatternBackground();
		mayBeIncomplete = true;
	}
	if (this.m_patternWidth === 0)
	{
		this.m_patternWidth = other.getPatternWidth();
		mayBeIncomplete = true;
	}
	if (oFF.isNull(this.m_patternColor))
	{
		this.m_patternColor = other.getPatternColor();
		mayBeIncomplete = true;
	}
	if (oFF.isNull(this.m_patternBorderColor))
	{
		this.m_patternBorderColor = other.getPatternBorderColor();
		mayBeIncomplete = true;
	}
	if (oFF.isNull(this.m_patternType) || this.m_patternType === oFF.VisualizationBackgroundPatternType.INHERIT)
	{
		this.m_patternType = other.getPatternType();
		mayBeIncomplete = true;
	}
	if (oFF.isNull(this.m_lineStyle) || this.m_lineStyle === oFF.SacTableLineStyle.INHERIT)
	{
		this.m_lineStyle = other.getLineStyle();
		mayBeIncomplete = true;
	}
	if (this.m_topPadding === -1)
	{
		this.m_topPadding = other.getTopPadding();
		mayBeIncomplete = true;
	}
	if (this.m_bottomPadding === -1)
	{
		this.m_bottomPadding = other.getBottomPadding();
		mayBeIncomplete = true;
	}
	if (this.m_leftPadding === -1)
	{
		this.m_leftPadding = other.getLeftPadding();
		mayBeIncomplete = true;
	}
	if (this.m_rightPadding === -1)
	{
		this.m_rightPadding = other.getRightPadding();
		mayBeIncomplete = true;
	}
	return mayBeIncomplete;
};
oFF.SacStyledLine.prototype.reduceToCommonSettings = function(other)
{
	if (oFF.notNull(other))
	{
		if (this.m_width !== other.getWidth())
		{
			this.m_width = -1;
		}
		if (this.m_patternWidth !== other.getPatternWidth())
		{
			this.m_patternWidth = 0;
		}
		if (this.m_bottomPadding !== other.getBottomPadding())
		{
			this.m_bottomPadding = -1;
		}
		if (this.m_topPadding !== other.getTopPadding())
		{
			this.m_topPadding = -1;
		}
		if (this.m_leftPadding !== other.getLeftPadding())
		{
			this.m_leftPadding = -1;
		}
		if (this.m_rightPadding !== other.getRightPadding())
		{
			this.m_rightPadding = -1;
		}
		if (!oFF.XString.isEqual(this.m_color, other.getColor()))
		{
			this.m_color = null;
		}
		if (!oFF.XString.isEqual(this.m_patternBackground, other.getPatternBackground()))
		{
			this.m_patternBackground = null;
		}
		if (!oFF.XString.isEqual(this.m_patternColor, other.getPatternColor()))
		{
			this.m_patternColor = null;
		}
		if (!oFF.XString.isEqual(this.m_patternBorderColor, other.getPatternBorderColor()))
		{
			this.m_patternBorderColor = null;
		}
		if (!oFF.XObject.areObjectsEqual(this.m_patternType, other.getPatternType()))
		{
			this.m_patternType = null;
		}
		if (!oFF.XObject.areObjectsEqual(this.m_lineStyle, other.getLineStyle()))
		{
			this.m_lineStyle = null;
		}
	}
};
oFF.SacStyledLine.prototype.releaseObject = function()
{
	this.m_width = -1;
	this.m_color = null;
	this.m_patternBackground = null;
	this.m_patternWidth = 0;
	this.m_patternColor = null;
	this.m_patternBorderColor = null;
	this.m_patternType = null;
	this.m_lineStyle = null;
	this.m_leftPadding = -1;
	this.m_rightPadding = -1;
	this.m_topPadding = -1;
	this.m_bottomPadding = -1;
};
oFF.SacStyledLine.prototype.setBottomPadding = function(bottomPadding)
{
	this.m_bottomPadding = bottomPadding;
};
oFF.SacStyledLine.prototype.setColor = function(color)
{
	this.m_color = color;
};
oFF.SacStyledLine.prototype.setLeftPadding = function(leftPadding)
{
	this.m_leftPadding = leftPadding;
};
oFF.SacStyledLine.prototype.setLineStyle = function(lineStyle)
{
	this.m_lineStyle = lineStyle;
};
oFF.SacStyledLine.prototype.setPatternBackground = function(patternBackground)
{
	this.m_patternBackground = patternBackground;
};
oFF.SacStyledLine.prototype.setPatternBorderColor = function(patternBorderColor)
{
	this.m_patternBorderColor = patternBorderColor;
};
oFF.SacStyledLine.prototype.setPatternColor = function(patternColor)
{
	this.m_patternColor = patternColor;
};
oFF.SacStyledLine.prototype.setPatternType = function(patternType)
{
	this.m_patternType = patternType;
};
oFF.SacStyledLine.prototype.setPatternWidth = function(patternWidth)
{
	this.m_patternWidth = patternWidth;
};
oFF.SacStyledLine.prototype.setRightPadding = function(rightPadding)
{
	this.m_rightPadding = rightPadding;
};
oFF.SacStyledLine.prototype.setTopPadding = function(topPadding)
{
	this.m_topPadding = topPadding;
};
oFF.SacStyledLine.prototype.setWidth = function(width)
{
	this.m_width = width;
};
oFF.SacStyledLine.prototype.setup = function()
{
	this.m_width = -1;
	this.m_leftPadding = -1;
	this.m_rightPadding = -1;
	this.m_topPadding = -1;
	this.m_bottomPadding = -1;
	this.m_patternWidth = 0;
};

oFF.SacTableFormattableElement = function() {};
oFF.SacTableFormattableElement.prototype = new oFF.XObjectExt();
oFF.SacTableFormattableElement.prototype._ff_c = "SacTableFormattableElement";

oFF.SacTableFormattableElement.prototype.m_cellChartMemberName = null;
oFF.SacTableFormattableElement.prototype.m_cellChartOrientation = null;
oFF.SacTableFormattableElement.prototype.m_cellChartType = null;
oFF.SacTableFormattableElement.prototype.m_hideNumberForCellChart = false;
oFF.SacTableFormattableElement.prototype.m_showCellChart = false;
oFF.SacTableFormattableElement.prototype.m_tableStyle = null;
oFF.SacTableFormattableElement.prototype.m_tableStylesSecondary = null;
oFF.SacTableFormattableElement.prototype.m_totalLevel = 0;
oFF.SacTableFormattableElement.prototype.m_totalsContext = false;
oFF.SacTableFormattableElement.prototype.getCellChartMemberName = function()
{
	return this.m_cellChartMemberName;
};
oFF.SacTableFormattableElement.prototype.getCellChartOrientation = function()
{
	return this.m_cellChartOrientation;
};
oFF.SacTableFormattableElement.prototype.getCellChartType = function()
{
	return this.m_cellChartType;
};
oFF.SacTableFormattableElement.prototype.getNewTableStyleWithPriority = function(priority)
{
	let newStyle = oFF.SacTableStyle.create();
	newStyle.setPriority(priority);
	this.m_tableStylesSecondary.add(newStyle);
	return newStyle;
};
oFF.SacTableFormattableElement.prototype.getSecondaryTableStyles = function()
{
	return this.m_tableStylesSecondary;
};
oFF.SacTableFormattableElement.prototype.getTableStyle = function()
{
	if (oFF.isNull(this.m_tableStyle))
	{
		this.setupTableStyle();
	}
	return this.m_tableStyle;
};
oFF.SacTableFormattableElement.prototype.getTotalLevel = function()
{
	return this.m_totalLevel;
};
oFF.SacTableFormattableElement.prototype.injectStyleToList = function(stylesList)
{
	if (oFF.notNull(this.m_tableStyle))
	{
		stylesList.add(this.m_tableStyle);
	}
};
oFF.SacTableFormattableElement.prototype.isHideNumberForCellChart = function()
{
	return this.m_hideNumberForCellChart;
};
oFF.SacTableFormattableElement.prototype.isShowCellChart = function()
{
	return this.m_showCellChart;
};
oFF.SacTableFormattableElement.prototype.isTotalsContext = function()
{
	return this.m_totalsContext;
};
oFF.SacTableFormattableElement.prototype.releaseObject = function()
{
	this.m_tableStyle = null;
	this.m_totalLevel = 0;
	this.m_totalsContext = false;
	this.m_showCellChart = false;
	this.m_hideNumberForCellChart = false;
	this.m_cellChartMemberName = null;
	this.m_cellChartType = null;
	this.m_cellChartOrientation = null;
	oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_tableStylesSecondary);
	oFF.XObjectExt.prototype.releaseObject.call( this );
};
oFF.SacTableFormattableElement.prototype.setCellChartMemberName = function(cellChartMemberName)
{
	this.m_cellChartMemberName = cellChartMemberName;
};
oFF.SacTableFormattableElement.prototype.setCellChartOrientation = function(cellChartOrientation)
{
	this.m_cellChartOrientation = cellChartOrientation;
};
oFF.SacTableFormattableElement.prototype.setCellChartType = function(cellChartType)
{
	this.m_cellChartType = cellChartType;
};
oFF.SacTableFormattableElement.prototype.setHideNumberForCellChart = function(hideNumberForCellChart)
{
	this.m_hideNumberForCellChart = hideNumberForCellChart;
};
oFF.SacTableFormattableElement.prototype.setShowCellChart = function(showCellChart)
{
	this.m_showCellChart = showCellChart;
};
oFF.SacTableFormattableElement.prototype.setTableStyle = function(tableStyle)
{
	this.m_tableStyle = tableStyle;
};
oFF.SacTableFormattableElement.prototype.setTotalLevel = function(totalLevel)
{
	this.m_totalLevel = totalLevel;
};
oFF.SacTableFormattableElement.prototype.setTotalsContext = function(totalsContext)
{
	this.m_totalsContext = totalsContext;
};
oFF.SacTableFormattableElement.prototype.setupTableStyle = function()
{
	this.m_tableStyle = oFF.SacTableStyle.create();
	this.m_tableStyle.setPriority(this.getStylePriority());
	this.m_tableStylesSecondary = oFF.XList.create();
};

oFF.SacTableStyle = function() {};
oFF.SacTableStyle.prototype = new oFF.XObjectExt();
oFF.SacTableStyle.prototype._ff_c = "SacTableStyle";

oFF.SacTableStyle.create = function()
{
	let obj = new oFF.SacTableStyle();
	obj.setup();
	return obj;
};
oFF.SacTableStyle.prototype.m_backgroundContent = null;
oFF.SacTableStyle.prototype.m_backgroundPatternType = null;
oFF.SacTableStyle.prototype.m_cellChartBarColor = null;
oFF.SacTableStyle.prototype.m_cellChartLineColor = null;
oFF.SacTableStyle.prototype.m_cellTypeRestrictions = null;
oFF.SacTableStyle.prototype.m_fillAlpha = 0.0;
oFF.SacTableStyle.prototype.m_fillColor = null;
oFF.SacTableStyle.prototype.m_fontBold = null;
oFF.SacTableStyle.prototype.m_fontColor = null;
oFF.SacTableStyle.prototype.m_fontFamily = null;
oFF.SacTableStyle.prototype.m_fontItalic = null;
oFF.SacTableStyle.prototype.m_fontSize = 0.0;
oFF.SacTableStyle.prototype.m_fontStrikeThrough = null;
oFF.SacTableStyle.prototype.m_fontUnderline = null;
oFF.SacTableStyle.prototype.m_horizontalAlignment = null;
oFF.SacTableStyle.prototype.m_overridePlaceholderForFormattedText = null;
oFF.SacTableStyle.prototype.m_overrideText = null;
oFF.SacTableStyle.prototype.m_priority = 0;
oFF.SacTableStyle.prototype.m_showFormattedText = null;
oFF.SacTableStyle.prototype.m_styledLineBottom = null;
oFF.SacTableStyle.prototype.m_styledLineLeft = null;
oFF.SacTableStyle.prototype.m_styledLineRight = null;
oFF.SacTableStyle.prototype.m_styledLineTop = null;
oFF.SacTableStyle.prototype.m_thresholdColor = null;
oFF.SacTableStyle.prototype.m_thresholdType = null;
oFF.SacTableStyle.prototype.m_verticalAlignment = null;
oFF.SacTableStyle.prototype.m_wrap = null;
oFF.SacTableStyle.prototype.addNewCellTypeRestriction = function()
{
	let cellTypeRestriction = oFF.SacCellTypeRestriction.create();
	this.m_cellTypeRestrictions.add(cellTypeRestriction);
	return cellTypeRestriction;
};
oFF.SacTableStyle.prototype.clearCellTypeRestrictions = function()
{
	this.m_cellTypeRestrictions.clear();
};
oFF.SacTableStyle.prototype.getBackgroundContent = function()
{
	return this.m_backgroundContent;
};
oFF.SacTableStyle.prototype.getBackgroundPatternType = function()
{
	return this.m_backgroundPatternType;
};
oFF.SacTableStyle.prototype.getCellChartBarColor = function()
{
	return this.m_cellChartBarColor;
};
oFF.SacTableStyle.prototype.getCellChartLineColor = function()
{
	return this.m_cellChartLineColor;
};
oFF.SacTableStyle.prototype.getCellTypeRestrictions = function()
{
	return this.m_cellTypeRestrictions;
};
oFF.SacTableStyle.prototype.getFillAlpha = function()
{
	return this.m_fillAlpha;
};
oFF.SacTableStyle.prototype.getFillColor = function()
{
	return this.m_fillColor;
};
oFF.SacTableStyle.prototype.getFontColor = function()
{
	return this.m_fontColor;
};
oFF.SacTableStyle.prototype.getFontFamily = function()
{
	return this.m_fontFamily;
};
oFF.SacTableStyle.prototype.getFontSize = function()
{
	return this.m_fontSize;
};
oFF.SacTableStyle.prototype.getHorizontalAlignment = function()
{
	return this.m_horizontalAlignment;
};
oFF.SacTableStyle.prototype.getOverridePlaceholderForFormattedText = function()
{
	return this.m_overridePlaceholderForFormattedText;
};
oFF.SacTableStyle.prototype.getOverrideText = function()
{
	return this.m_overrideText;
};
oFF.SacTableStyle.prototype.getPriority = function()
{
	return this.m_priority;
};
oFF.SacTableStyle.prototype.getStyledLineBottom = function()
{
	if (oFF.isNull(this.m_styledLineBottom))
	{
		this.m_styledLineBottom = oFF.SacStyledLine.create();
	}
	return this.m_styledLineBottom;
};
oFF.SacTableStyle.prototype.getStyledLineBottomIfExists = function()
{
	return this.m_styledLineBottom;
};
oFF.SacTableStyle.prototype.getStyledLineLeft = function()
{
	if (oFF.isNull(this.m_styledLineLeft))
	{
		this.m_styledLineLeft = oFF.SacStyledLine.create();
	}
	return this.m_styledLineLeft;
};
oFF.SacTableStyle.prototype.getStyledLineLeftIfExists = function()
{
	return this.m_styledLineLeft;
};
oFF.SacTableStyle.prototype.getStyledLineRight = function()
{
	if (oFF.isNull(this.m_styledLineRight))
	{
		this.m_styledLineRight = oFF.SacStyledLine.create();
	}
	return this.m_styledLineRight;
};
oFF.SacTableStyle.prototype.getStyledLineRightIfExists = function()
{
	return this.m_styledLineRight;
};
oFF.SacTableStyle.prototype.getStyledLineTop = function()
{
	if (oFF.isNull(this.m_styledLineTop))
	{
		this.m_styledLineTop = oFF.SacStyledLine.create();
	}
	return this.m_styledLineTop;
};
oFF.SacTableStyle.prototype.getStyledLineTopIfExists = function()
{
	return this.m_styledLineTop;
};
oFF.SacTableStyle.prototype.getThresholdColor = function()
{
	return this.m_thresholdColor;
};
oFF.SacTableStyle.prototype.getThresholdType = function()
{
	return this.m_thresholdType;
};
oFF.SacTableStyle.prototype.getVerticalAlignment = function()
{
	return this.m_verticalAlignment;
};
oFF.SacTableStyle.prototype.getWrapExt = function()
{
	return this.m_wrap;
};
oFF.SacTableStyle.prototype.isDefined = function()
{
	return oFF.notNull(this.m_backgroundContent) || oFF.notNull(this.m_backgroundPatternType) && this.m_backgroundPatternType !== oFF.VisualizationBackgroundPatternType.INHERIT || this.m_fillAlpha !== -1 || oFF.XStringUtils.isNotNullAndNotEmpty(this.m_fillColor) || oFF.XStringUtils.isNotNullAndNotEmpty(this.m_cellChartBarColor) || oFF.XStringUtils.isNotNullAndNotEmpty(this.m_cellChartLineColor) || oFF.XStringUtils.isNotNullAndNotEmpty(this.m_fontColor) || oFF.TriStateBool.isExplicitBooleanValue(this.m_fontBold) || oFF.TriStateBool.isExplicitBooleanValue(this.m_fontItalic) || oFF.TriStateBool.isExplicitBooleanValue(this.m_fontUnderline) || oFF.TriStateBool.isExplicitBooleanValue(this.m_fontStrikeThrough) || this.m_fontSize > 0 || oFF.XStringUtils.isNotNullAndNotEmpty(this.m_fontFamily) || oFF.notNull(this.m_horizontalAlignment) && this.m_horizontalAlignment !== oFF.SacVisualizationHorizontalAlignment.INHERIT || oFF.notNull(this.m_verticalAlignment) && this.m_verticalAlignment !== oFF.SacVisualizationVerticalAlignment.INHERIT || oFF.XStringUtils.isNotNullAndNotEmpty(this.m_overrideText) || oFF.XStringUtils.isNotNullAndNotEmpty(this.m_overridePlaceholderForFormattedText) || oFF.TriStateBool.isExplicitBooleanValue(this.m_showFormattedText) || oFF.notNull(this.m_thresholdType) && this.m_thresholdType !== oFF.SacAlertSymbol.GOOD || oFF.XStringUtils.isNotNullAndNotEmpty(this.m_thresholdColor) || oFF.notNull(this.m_styledLineTop) && this.m_styledLineTop.isDefined() || oFF.notNull(this.m_styledLineBottom) && this.m_styledLineBottom.isDefined() || oFF.notNull(this.m_styledLineLeft) && this.m_styledLineLeft.isDefined() || oFF.notNull(this.m_styledLineRight) && this.m_styledLineRight.isDefined();
};
oFF.SacTableStyle.prototype.isFontBold = function()
{
	return this.m_fontBold === oFF.TriStateBool._TRUE;
};
oFF.SacTableStyle.prototype.isFontBoldExt = function()
{
	return this.m_fontBold;
};
oFF.SacTableStyle.prototype.isFontItalic = function()
{
	return this.m_fontItalic === oFF.TriStateBool._TRUE;
};
oFF.SacTableStyle.prototype.isFontItalicExt = function()
{
	return this.m_fontItalic;
};
oFF.SacTableStyle.prototype.isFontStrikeThrough = function()
{
	return this.m_fontStrikeThrough === oFF.TriStateBool._TRUE;
};
oFF.SacTableStyle.prototype.isFontStrikeThroughExt = function()
{
	return this.m_fontStrikeThrough;
};
oFF.SacTableStyle.prototype.isFontUnderline = function()
{
	return this.m_fontUnderline === oFF.TriStateBool._TRUE;
};
oFF.SacTableStyle.prototype.isFontUnderlineExt = function()
{
	return this.m_fontUnderline;
};
oFF.SacTableStyle.prototype.isShowFormattedText = function()
{
	return this.m_showFormattedText;
};
oFF.SacTableStyle.prototype.reduceLineStyles = function(cellStyle, existence, forceCreation)
{
	if (existence(this) !== null && existence(cellStyle) !== null)
	{
		forceCreation(this).reduceToCommonSettings(forceCreation(cellStyle));
	}
};
oFF.SacTableStyle.prototype.reduceToCommonSettings = function(cellStyle)
{
	if (oFF.notNull(cellStyle))
	{
		if (!oFF.XString.isEqual(cellStyle.getBackgroundContent(), this.getBackgroundContent()))
		{
			this.m_backgroundContent = null;
		}
		if (!oFF.XObject.areObjectsEqual(cellStyle.getBackgroundPatternType(), this.getBackgroundPatternType()))
		{
			this.m_backgroundPatternType = null;
		}
		if (cellStyle.getFillAlpha() !== this.getFillAlpha())
		{
			this.m_fillAlpha = -1;
		}
		if (!oFF.XString.isEqual(cellStyle.getFillColor(), this.getFillColor()))
		{
			this.m_fillColor = null;
		}
		if (!oFF.XString.isEqual(cellStyle.getCellChartBarColor(), this.getCellChartBarColor()))
		{
			this.m_cellChartBarColor = null;
		}
		if (!oFF.XString.isEqual(cellStyle.getCellChartLineColor(), this.getCellChartLineColor()))
		{
			this.m_cellChartLineColor = null;
		}
		if (!oFF.XString.isEqual(cellStyle.getFontColor(), this.getFontColor()))
		{
			this.m_fontColor = null;
		}
		if (!oFF.XObject.areObjectsEqual(cellStyle.isFontBoldExt(), this.isFontBoldExt()))
		{
			this.m_fontBold = null;
		}
		if (!oFF.XObject.areObjectsEqual(cellStyle.isFontItalicExt(), this.isFontItalicExt()))
		{
			this.m_fontItalic = null;
		}
		if (!oFF.XObject.areObjectsEqual(cellStyle.isFontUnderlineExt(), this.isFontUnderlineExt()))
		{
			this.m_fontUnderline = null;
		}
		if (!oFF.XObject.areObjectsEqual(cellStyle.isFontStrikeThroughExt(), this.isFontStrikeThroughExt()))
		{
			this.m_fontStrikeThrough = null;
		}
		if (!oFF.XObject.areObjectsEqual(cellStyle.getWrapExt(), this.getWrapExt()))
		{
			this.m_wrap = null;
		}
		if (cellStyle.getFontSize() !== this.getFontSize())
		{
			this.m_fontSize = 0;
		}
		if (oFF.XString.isEqual(cellStyle.getFontFamily(), this.getFontFamily()))
		{
			this.m_fontFamily = null;
		}
		if (!oFF.XObject.areObjectsEqual(cellStyle.getHorizontalAlignment(), this.getHorizontalAlignment()))
		{
			this.m_horizontalAlignment = null;
		}
		if (!oFF.XObject.areObjectsEqual(cellStyle.getVerticalAlignment(), this.getVerticalAlignment()))
		{
			this.m_verticalAlignment = null;
		}
		if (!oFF.XString.isEqual(cellStyle.getOverrideText(), this.getOverrideText()))
		{
			this.m_overrideText = null;
		}
		if (!oFF.XString.isEqual(cellStyle.getOverridePlaceholderForFormattedText(), this.getOverridePlaceholderForFormattedText()))
		{
			this.m_overridePlaceholderForFormattedText = null;
		}
		if (!oFF.XObject.areObjectsEqual(cellStyle.isShowFormattedText(), this.isShowFormattedText()))
		{
			this.m_showFormattedText = null;
		}
		if (!oFF.XObject.areObjectsEqual(cellStyle.getThresholdType(), this.getThresholdType()))
		{
			this.m_thresholdType = null;
		}
		if (!oFF.XString.isEqual(cellStyle.getThresholdColor(), this.getThresholdColor()))
		{
			this.m_thresholdColor = null;
		}
		this.reduceLineStyles(cellStyle, (bc) => {
			return bc.getStyledLineBottomIfExists();
		}, (bf) => {
			return bf.getStyledLineBottom();
		});
		this.reduceLineStyles(cellStyle, (tc) => {
			return tc.getStyledLineTopIfExists();
		}, (tf) => {
			return tf.getStyledLineTop();
		});
		this.reduceLineStyles(cellStyle, (lc) => {
			return lc.getStyledLineLeftIfExists();
		}, (lf) => {
			return lf.getStyledLineLeft();
		});
		this.reduceLineStyles(cellStyle, (rc) => {
			return rc.getStyledLineRightIfExists();
		}, (rf) => {
			return rf.getStyledLineRight();
		});
	}
};
oFF.SacTableStyle.prototype.releaseObject = function()
{
	this.m_priority = -1;
	this.m_fillColor = null;
	this.m_fillAlpha = -1;
	this.m_styledLineBottom = oFF.XObjectExt.release(this.m_styledLineBottom);
	this.m_styledLineTop = oFF.XObjectExt.release(this.m_styledLineTop);
	this.m_styledLineLeft = oFF.XObjectExt.release(this.m_styledLineLeft);
	this.m_styledLineRight = oFF.XObjectExt.release(this.m_styledLineRight);
	this.m_fontItalic = null;
	this.m_fontBold = null;
	this.m_fontUnderline = null;
	this.m_fontStrikeThrough = null;
	this.m_fontSize = 0;
	this.m_fontFamily = null;
	this.m_fontColor = null;
	this.m_cellChartLineColor = null;
	this.m_cellChartBarColor = null;
	this.m_thresholdType = null;
	this.m_thresholdColor = null;
	this.m_verticalAlignment = null;
	this.m_horizontalAlignment = null;
	this.m_overridePlaceholderForFormattedText = null;
	this.m_overrideText = null;
	this.m_showFormattedText = null;
	this.m_wrap = null;
	this.m_cellTypeRestrictions = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_cellTypeRestrictions);
	oFF.XObjectExt.prototype.releaseObject.call( this );
};
oFF.SacTableStyle.prototype.setBackgroundContent = function(backgroundContent)
{
	this.m_backgroundContent = backgroundContent;
};
oFF.SacTableStyle.prototype.setBackgroundPatternType = function(patternType)
{
	this.m_backgroundPatternType = patternType;
};
oFF.SacTableStyle.prototype.setCellChartBarColor = function(cellChartBarColor)
{
	this.m_cellChartBarColor = cellChartBarColor;
};
oFF.SacTableStyle.prototype.setCellChartLineColor = function(cellChartLineColor)
{
	this.m_cellChartLineColor = cellChartLineColor;
};
oFF.SacTableStyle.prototype.setFillAlpha = function(alpha)
{
	this.m_fillAlpha = alpha;
};
oFF.SacTableStyle.prototype.setFillColor = function(color)
{
	this.m_fillColor = color;
};
oFF.SacTableStyle.prototype.setFontBold = function(set)
{
	this.m_fontBold = set ? oFF.TriStateBool._TRUE : oFF.TriStateBool._FALSE;
};
oFF.SacTableStyle.prototype.setFontBoldExt = function(set)
{
	this.m_fontBold = set;
};
oFF.SacTableStyle.prototype.setFontColor = function(color)
{
	this.m_fontColor = color;
};
oFF.SacTableStyle.prototype.setFontFamily = function(family)
{
	this.m_fontFamily = family;
};
oFF.SacTableStyle.prototype.setFontItalic = function(set)
{
	this.m_fontItalic = set ? oFF.TriStateBool._TRUE : oFF.TriStateBool._FALSE;
};
oFF.SacTableStyle.prototype.setFontItalicExt = function(set)
{
	this.m_fontItalic = set;
};
oFF.SacTableStyle.prototype.setFontSize = function(size)
{
	this.m_fontSize = size;
};
oFF.SacTableStyle.prototype.setFontStrikeThrough = function(set)
{
	this.m_fontStrikeThrough = set ? oFF.TriStateBool._TRUE : oFF.TriStateBool._FALSE;
};
oFF.SacTableStyle.prototype.setFontStrikeThroughExt = function(set)
{
	this.m_fontStrikeThrough = set;
};
oFF.SacTableStyle.prototype.setFontUnderline = function(set)
{
	this.m_fontUnderline = set ? oFF.TriStateBool._TRUE : oFF.TriStateBool._FALSE;
};
oFF.SacTableStyle.prototype.setFontUnderlineExt = function(set)
{
	this.m_fontUnderline = set;
};
oFF.SacTableStyle.prototype.setHorizontalAlignment = function(horizontalAlignment)
{
	this.m_horizontalAlignment = horizontalAlignment;
};
oFF.SacTableStyle.prototype.setOverridePlaceholderForFormattedText = function(overridePlaceholderForFormattedText)
{
	this.m_overridePlaceholderForFormattedText = overridePlaceholderForFormattedText;
};
oFF.SacTableStyle.prototype.setOverrideText = function(overrideText)
{
	this.m_overrideText = overrideText;
};
oFF.SacTableStyle.prototype.setPriority = function(priority)
{
	this.m_priority = oFF.XMath.max(priority, this.m_priority);
};
oFF.SacTableStyle.prototype.setShowFormattedText = function(showFormattedText)
{
	this.m_showFormattedText = showFormattedText;
};
oFF.SacTableStyle.prototype.setStyledLineBottom = function(style)
{
	this.m_styledLineBottom = style;
};
oFF.SacTableStyle.prototype.setStyledLineLeft = function(style)
{
	this.m_styledLineLeft = style;
};
oFF.SacTableStyle.prototype.setStyledLineRight = function(style)
{
	this.m_styledLineRight = style;
};
oFF.SacTableStyle.prototype.setStyledLineTop = function(style)
{
	this.m_styledLineTop = style;
};
oFF.SacTableStyle.prototype.setThresholdColor = function(thresholdColor)
{
	this.m_thresholdColor = thresholdColor;
};
oFF.SacTableStyle.prototype.setThresholdType = function(thresholdType)
{
	this.m_thresholdType = thresholdType;
};
oFF.SacTableStyle.prototype.setVerticalAlignment = function(verticalAlignment)
{
	this.m_verticalAlignment = verticalAlignment;
};
oFF.SacTableStyle.prototype.setWrap = function(wrap)
{
	this.m_wrap = oFF.TriStateBool.lookup(wrap);
};
oFF.SacTableStyle.prototype.setWrapExt = function(wrap)
{
	this.m_wrap = wrap;
};
oFF.SacTableStyle.prototype.setup = function()
{
	oFF.XObjectExt.prototype.setup.call( this );
	this.m_priority = -1;
	this.m_fillAlpha = -1;
	this.m_cellTypeRestrictions = oFF.XList.create();
};

oFF.SacDataSectionInfoReference = function() {};
oFF.SacDataSectionInfoReference.prototype = new oFF.SacDataSectionInfo();
oFF.SacDataSectionInfoReference.prototype._ff_c = "SacDataSectionInfoReference";

oFF.SacDataSectionInfoReference.create = function()
{
	let instance = new oFF.SacDataSectionInfoReference();
	instance.setup();
	return instance;
};
oFF.SacDataSectionInfoReference.prototype.m_includeHeaderBand = null;
oFF.SacDataSectionInfoReference.prototype.m_includeInnerBands = null;
oFF.SacDataSectionInfoReference.prototype.m_includeTotalsBand = null;
oFF.SacDataSectionInfoReference.prototype.m_matchesExpanded = null;
oFF.SacDataSectionInfoReference.prototype.m_matchesHierarchyBottomUp = null;
oFF.SacDataSectionInfoReference.prototype.m_matchesLeaves = null;
oFF.SacDataSectionInfoReference.prototype.m_matchesTotals = null;
oFF.SacDataSectionInfoReference.prototype.m_sectionNodeNames = null;
oFF.SacDataSectionInfoReference.prototype.addSectionNodeName = function(sectionName)
{
	this.m_sectionNodeNames.add(sectionName);
};
oFF.SacDataSectionInfoReference.prototype.clearSectionNodeNames = function()
{
	this.m_sectionNodeNames.clear();
};
oFF.SacDataSectionInfoReference.prototype.copyFrom = function(other, flags)
{
	let orig = other;
	oFF.SacDataSectionInfo.prototype.copyFrom.call( this , other, flags);
	this.m_sectionNodeNames.clear();
	this.m_sectionNodeNames.addAll(orig.m_sectionNodeNames);
	this.m_includeHeaderBand = orig.m_includeHeaderBand;
	this.m_includeTotalsBand = orig.m_includeTotalsBand;
	this.m_includeInnerBands = orig.m_includeInnerBands;
	this.m_matchesExpanded = orig.m_matchesExpanded;
	this.m_matchesLeaves = orig.m_matchesLeaves;
	this.m_matchesTotals = orig.m_matchesTotals;
};
oFF.SacDataSectionInfoReference.prototype.getEffectiveGroupLevel = function(groupLevelNames, headerGroupMap)
{
	let mappedGroupName = oFF.isNull(headerGroupMap) ? this.m_groupName : headerGroupMap.getByKey(this.m_groupName);
	let effectiveGroupLevel = -1;
	if (this.m_groupLevel === -1)
	{
		effectiveGroupLevel = groupLevelNames.getIndex(oFF.isNull(mappedGroupName) ? this.m_groupName : mappedGroupName);
	}
	else if (this.m_groupLevel < -1)
	{
		effectiveGroupLevel = groupLevelNames.size() + this.m_groupLevel + 1;
	}
	else
	{
		effectiveGroupLevel = this.m_groupLevel;
	}
	return effectiveGroupLevel;
};
oFF.SacDataSectionInfoReference.prototype.getSectionNodeNames = function()
{
	return this.m_sectionNodeNames;
};
oFF.SacDataSectionInfoReference.prototype.isEqualTo = function(other)
{
	if (!oFF.SacDataSectionInfo.prototype.isEqualTo.call( this , other))
	{
		return false;
	}
	if (this === other)
	{
		return true;
	}
	if (!oFF.XString.isEqual(this.getClassName(), other.getClassName()))
	{
		return false;
	}
	let otherInfo = other;
	return oFF.XObjectExt.areEqual(this.m_sectionNodeNames, otherInfo.m_sectionNodeNames) && this.m_includeHeaderBand === otherInfo.m_includeHeaderBand && this.m_includeTotalsBand === otherInfo.m_includeTotalsBand && this.m_includeInnerBands === otherInfo.m_includeInnerBands && this.m_matchesLeaves === otherInfo.m_matchesLeaves && this.m_matchesTotals === otherInfo.m_matchesTotals && this.m_matchesExpanded === otherInfo.m_matchesExpanded && this.m_matchesHierarchyBottomUp === otherInfo.m_matchesHierarchyBottomUp && oFF.XString.isEqual(this.m_groupName, otherInfo.m_groupName);
};
oFF.SacDataSectionInfoReference.prototype.isIncludeHeaderBand = function()
{
	return this.m_includeHeaderBand;
};
oFF.SacDataSectionInfoReference.prototype.isIncludeInnerBands = function()
{
	return this.m_includeInnerBands;
};
oFF.SacDataSectionInfoReference.prototype.isIncludeTotalsBand = function()
{
	return this.m_includeTotalsBand;
};
oFF.SacDataSectionInfoReference.prototype.isMatchesExpanded = function()
{
	return this.m_matchesExpanded;
};
oFF.SacDataSectionInfoReference.prototype.isMatchesHierarchyBottomUp = function()
{
	return this.m_matchesHierarchyBottomUp;
};
oFF.SacDataSectionInfoReference.prototype.isMatchesLeaves = function()
{
	return this.m_matchesLeaves;
};
oFF.SacDataSectionInfoReference.prototype.isMatchesTotals = function()
{
	return this.m_matchesTotals;
};
oFF.SacDataSectionInfoReference.prototype.setIncludeHeaderBand = function(includeHeaderBand)
{
	this.m_includeHeaderBand = includeHeaderBand;
};
oFF.SacDataSectionInfoReference.prototype.setIncludeInnerBands = function(includeInnerBands)
{
	this.m_includeInnerBands = includeInnerBands;
};
oFF.SacDataSectionInfoReference.prototype.setIncludeTotalsBand = function(includeTotalsBand)
{
	this.m_includeTotalsBand = includeTotalsBand;
};
oFF.SacDataSectionInfoReference.prototype.setMatchesExpanded = function(matchesExpanded)
{
	this.m_matchesExpanded = matchesExpanded;
};
oFF.SacDataSectionInfoReference.prototype.setMatchesHierarchyBottomUp = function(matchesHierarchyBottomUp)
{
	this.m_matchesHierarchyBottomUp = matchesHierarchyBottomUp;
};
oFF.SacDataSectionInfoReference.prototype.setMatchesLeaves = function(matchesLeaves)
{
	this.m_matchesLeaves = matchesLeaves;
};
oFF.SacDataSectionInfoReference.prototype.setMatchesTotals = function(matchesTotals)
{
	this.m_matchesTotals = matchesTotals;
};
oFF.SacDataSectionInfoReference.prototype.setup = function()
{
	oFF.SacDataSectionInfo.prototype.setup.call( this );
	this.m_sectionNodeNames = oFF.XList.create();
};

oFF.SacDataSectionInfoTag = function() {};
oFF.SacDataSectionInfoTag.prototype = new oFF.SacDataSectionInfo();
oFF.SacDataSectionInfoTag.prototype._ff_c = "SacDataSectionInfoTag";

oFF.SacDataSectionInfoTag.create = function()
{
	let instance = new oFF.SacDataSectionInfoTag();
	instance.setup();
	return instance;
};
oFF.SacDataSectionInfoTag.prototype.m_expanded = false;
oFF.SacDataSectionInfoTag.prototype.m_groupLevelEnd = false;
oFF.SacDataSectionInfoTag.prototype.m_groupLevelStart = false;
oFF.SacDataSectionInfoTag.prototype.m_headerBand = false;
oFF.SacDataSectionInfoTag.prototype.m_hierarchyBottomUp = false;
oFF.SacDataSectionInfoTag.prototype.m_innerBand = false;
oFF.SacDataSectionInfoTag.prototype.m_leaf = false;
oFF.SacDataSectionInfoTag.prototype.m_reversedGroupLevel = 0;
oFF.SacDataSectionInfoTag.prototype.m_sectionLevelEnd = false;
oFF.SacDataSectionInfoTag.prototype.m_sectionLevelStart = false;
oFF.SacDataSectionInfoTag.prototype.m_sectionNodeName = null;
oFF.SacDataSectionInfoTag.prototype.m_total = false;
oFF.SacDataSectionInfoTag.prototype.m_totalBand = false;
oFF.SacDataSectionInfoTag.prototype.copyFrom = function(other, flags)
{
	let orig = other;
	oFF.SacDataSectionInfo.prototype.copyFrom.call( this , other, flags);
	this.m_sectionNodeName = orig.m_sectionNodeName;
	this.m_headerBand = orig.m_headerBand;
	this.m_totalBand = orig.m_totalBand;
	this.m_innerBand = orig.m_innerBand;
	this.m_groupLevelStart = orig.m_groupLevelStart;
	this.m_groupLevelEnd = orig.m_groupLevelEnd;
	this.m_sectionLevelStart = orig.m_sectionLevelStart;
	this.m_sectionLevelEnd = orig.m_sectionLevelEnd;
	this.m_expanded = orig.m_expanded;
	this.m_leaf = orig.m_leaf;
	this.m_total = orig.m_total;
	this.m_reversedGroupLevel = orig.m_reversedGroupLevel;
	this.m_hierarchyBottomUp = orig.m_hierarchyBottomUp;
};
oFF.SacDataSectionInfoTag.prototype.createCopy = function()
{
	let newInstance = oFF.SacDataSectionInfoTag.create();
	newInstance.copyFrom(this, null);
	return newInstance;
};
oFF.SacDataSectionInfoTag.prototype.getReversedGroupLevel = function()
{
	return this.m_reversedGroupLevel;
};
oFF.SacDataSectionInfoTag.prototype.getSectionNodeName = function()
{
	return this.m_sectionNodeName;
};
oFF.SacDataSectionInfoTag.prototype.isEqualTo = function(other)
{
	if (!oFF.SacDataSectionInfo.prototype.isEqualTo.call( this , other))
	{
		return false;
	}
	if (this === other)
	{
		return true;
	}
	if (!oFF.XString.isEqual(this.getClassName(), other.getClassName()))
	{
		return false;
	}
	let otherInfo = other;
	return oFF.XString.isEqual(this.m_sectionNodeName, otherInfo.m_sectionNodeName) && this.m_total === otherInfo.m_total && this.m_headerBand === otherInfo.m_headerBand && this.m_totalBand === otherInfo.m_totalBand && this.m_innerBand === otherInfo.m_innerBand && this.m_groupLevelStart === otherInfo.m_groupLevelStart && this.m_groupLevelEnd === otherInfo.m_groupLevelEnd && this.m_sectionLevelStart === otherInfo.m_sectionLevelStart && this.m_sectionLevelEnd === otherInfo.m_sectionLevelEnd && this.m_leaf === otherInfo.m_leaf && this.m_expanded && otherInfo.m_expanded && this.m_hierarchyBottomUp === otherInfo.m_hierarchyBottomUp && this.m_reversedGroupLevel === otherInfo.m_reversedGroupLevel;
};
oFF.SacDataSectionInfoTag.prototype.isExpanded = function()
{
	return this.m_expanded;
};
oFF.SacDataSectionInfoTag.prototype.isGroupLevelEnd = function()
{
	return this.m_groupLevelEnd;
};
oFF.SacDataSectionInfoTag.prototype.isGroupLevelStart = function()
{
	return this.m_groupLevelStart;
};
oFF.SacDataSectionInfoTag.prototype.isHeaderBand = function()
{
	return this.m_headerBand;
};
oFF.SacDataSectionInfoTag.prototype.isHierarchyBottomUp = function()
{
	return this.m_hierarchyBottomUp;
};
oFF.SacDataSectionInfoTag.prototype.isInnerBand = function()
{
	return this.m_innerBand;
};
oFF.SacDataSectionInfoTag.prototype.isLeaf = function()
{
	return this.m_leaf;
};
oFF.SacDataSectionInfoTag.prototype.isSectionLevelEnd = function()
{
	return this.m_sectionLevelEnd;
};
oFF.SacDataSectionInfoTag.prototype.isSectionLevelStart = function()
{
	return this.m_sectionLevelStart;
};
oFF.SacDataSectionInfoTag.prototype.isTotal = function()
{
	return this.m_total;
};
oFF.SacDataSectionInfoTag.prototype.isTotalBand = function()
{
	return this.m_totalBand;
};
oFF.SacDataSectionInfoTag.prototype.matches = function(element)
{
	let result = this.matchesSections(element, this) && this.matchesDrillState(element, this) && this.matchesHierarchyAlignment(element, this) && (!element.isExactSectionLevel() || this.isExactSectionLevel()) && this.matchesTotal(element, this) && (element.getGroupLevel() === -1 && oFF.XStringUtils.isNotNullAndNotEmpty(element.getGroupName()) || this.getGroupLevel() === element.getGroupLevel() || this.getReversedGroupLevel() === element.getGroupLevel()) && (element.getSectionLevel() < 0 || this.getSectionLevel() === element.getSectionLevel()) && (oFF.XStringUtils.isNullOrEmpty(element.getGroupName()) || oFF.XString.isEqual(element.getGroupName(), this.getGroupName())) && (oFF.XStringUtils.isNullOrEmpty(element.getSectionLevelName()) || oFF.XString.isEqual(element.getSectionLevelName(), this.getSectionLevelName())) && (!oFF.XCollectionUtils.hasElements(element.getSectionNodeNames()) || element.getSectionNodeNames().contains(this.getSectionNodeName()));
	return result;
};
oFF.SacDataSectionInfoTag.prototype.matchesDrillState = function(element, sectionInfoTag)
{
	return oFF.TriStateMatchingUtil.matchesTriStateStrictPositive(element.isMatchesLeaves(), sectionInfoTag.isLeaf()) || oFF.TriStateMatchingUtil.matchesTriStateStrictPositive(element.isMatchesExpanded(), sectionInfoTag.isExpanded()) && sectionInfoTag.isExactSectionLevel() || oFF.TriStateMatchingUtil.matchesTriStateNegative(element.isMatchesLeaves(), sectionInfoTag.isLeaf()) && oFF.TriStateMatchingUtil.matchesTriStateNegative(element.isMatchesExpanded(), sectionInfoTag.isExpanded()) && sectionInfoTag.isExactSectionLevel();
};
oFF.SacDataSectionInfoTag.prototype.matchesHierarchyAlignment = function(element, sacDataSectionInfoTag)
{
	return oFF.TriStateMatchingUtil.matchesTriStateStrictPositive(element.isMatchesHierarchyBottomUp(), this.isHierarchyBottomUp()) || oFF.TriStateMatchingUtil.matchesTriStateNegative(element.isMatchesHierarchyBottomUp(), this.isHierarchyBottomUp());
};
oFF.SacDataSectionInfoTag.prototype.matchesSections = function(element, sectionInfoTag)
{
	return oFF.TriStateMatchingUtil.matchesTriStateStrictPositive(element.isIncludeHeaderBand(), sectionInfoTag.isHeaderBand()) || oFF.TriStateMatchingUtil.matchesTriStateStrictPositive(element.isIncludeTotalsBand(), sectionInfoTag.isTotalBand()) || oFF.TriStateMatchingUtil.matchesTriStateStrictPositive(element.isIncludeInnerBands(), sectionInfoTag.isInnerBand()) || oFF.TriStateMatchingUtil.matchesTriStateNegative(element.isIncludeHeaderBand(), sectionInfoTag.isHeaderBand()) && oFF.TriStateMatchingUtil.matchesTriStateNegative(element.isIncludeTotalsBand(), sectionInfoTag.isTotalBand()) && oFF.TriStateMatchingUtil.matchesTriStateNegative(element.isIncludeHeaderBand(), sectionInfoTag.isHeaderBand());
};
oFF.SacDataSectionInfoTag.prototype.matchesSibling = function(element)
{
	let result = this.isTotal() === element.isTotal() && this.isLeaf() === element.isLeaf() && this.isExpanded() === element.isExpanded() && (!element.isExactSectionLevel() || this.isExactSectionLevel()) && (element.getGroupLevel() === -1 || this.getGroupLevel() === element.getGroupLevel()) && (element.getSectionLevel() < 0 || this.getSectionLevel() === element.getSectionLevel()) && (oFF.XStringUtils.isNullOrEmpty(element.getGroupName()) || oFF.XString.isEqual(element.getGroupName(), this.getGroupName())) && (oFF.XStringUtils.isNullOrEmpty(element.getSectionLevelName()) || oFF.XString.isEqual(element.getSectionLevelName(), this.getSectionLevelName())) && (oFF.XStringUtils.isNullOrEmpty(element.getSectionNodeName()) || oFF.XString.isEqual(element.getSectionNodeName(), this.getSectionNodeName()));
	return result;
};
oFF.SacDataSectionInfoTag.prototype.matchesTotal = function(element, sacDataSectionInfoTag)
{
	return oFF.TriStateMatchingUtil.matchesTriStateStrictPositive(element.isMatchesTotals(), this.isTotal()) || oFF.TriStateMatchingUtil.matchesTriStateNegative(element.isMatchesTotals(), this.isTotal());
};
oFF.SacDataSectionInfoTag.prototype.setExpanded = function(expanded)
{
	this.m_expanded = expanded;
};
oFF.SacDataSectionInfoTag.prototype.setGroupLevelEnd = function(groupLevelEnd)
{
	this.m_groupLevelEnd = groupLevelEnd;
};
oFF.SacDataSectionInfoTag.prototype.setGroupLevelStart = function(groupLevelStart)
{
	this.m_groupLevelStart = groupLevelStart;
};
oFF.SacDataSectionInfoTag.prototype.setHeaderBand = function(headerBand)
{
	this.m_headerBand = headerBand;
};
oFF.SacDataSectionInfoTag.prototype.setHierarchyBottomUp = function(bottomUp)
{
	this.m_hierarchyBottomUp = bottomUp;
};
oFF.SacDataSectionInfoTag.prototype.setInnerBand = function(innerBand)
{
	this.m_innerBand = innerBand;
};
oFF.SacDataSectionInfoTag.prototype.setLeaf = function(leaf)
{
	this.m_leaf = leaf;
};
oFF.SacDataSectionInfoTag.prototype.setReversedGroupLevel = function(reversedGroupLevel)
{
	this.m_reversedGroupLevel = reversedGroupLevel;
};
oFF.SacDataSectionInfoTag.prototype.setSectionLevelEnd = function(sectionLevelEnd)
{
	this.m_sectionLevelEnd = sectionLevelEnd;
};
oFF.SacDataSectionInfoTag.prototype.setSectionLevelStart = function(sectionLevelStart)
{
	this.m_sectionLevelStart = sectionLevelStart;
};
oFF.SacDataSectionInfoTag.prototype.setSectionNodeName = function(sectionName)
{
	this.m_sectionNodeName = sectionName;
};
oFF.SacDataSectionInfoTag.prototype.setTotal = function(total)
{
	this.m_total = total;
};
oFF.SacDataSectionInfoTag.prototype.setTotalBand = function(totalBand)
{
	this.m_totalBand = totalBand;
};

oFF.ChartAxis = function() {};
oFF.ChartAxis.prototype = new oFF.AbstractChartPart();
oFF.ChartAxis.prototype._ff_c = "ChartAxis";

oFF.ChartAxis.create = function(name, text, axisDomainType)
{
	let instance = new oFF.ChartAxis();
	instance.initialize(name, text);
	instance.setupAxisDomain(axisDomainType);
	return instance;
};
oFF.ChartAxis.prototype.m_axisDomain = null;
oFF.ChartAxis.prototype.m_fitLabelsInsideCoordinates = false;
oFF.ChartAxis.prototype.m_from = 0;
oFF.ChartAxis.prototype.m_gridLineColor = null;
oFF.ChartAxis.prototype.m_gridLineWidth = 0;
oFF.ChartAxis.prototype.m_labelStyle = null;
oFF.ChartAxis.prototype.m_order = 0;
oFF.ChartAxis.prototype.m_plotBands = null;
oFF.ChartAxis.prototype.m_plotLines = null;
oFF.ChartAxis.prototype.m_position = null;
oFF.ChartAxis.prototype.m_reversed = false;
oFF.ChartAxis.prototype.m_tickSize = 0;
oFF.ChartAxis.prototype.m_titleStyle = null;
oFF.ChartAxis.prototype.m_to = 0;
oFF.ChartAxis.prototype.addPlotBand = function(name, text)
{
	let plotBand = oFF.ChartAxisPlotBand.create(name, text);
	this.m_plotBands.put(name, plotBand);
	return plotBand;
};
oFF.ChartAxis.prototype.addPlotLine = function(name, text)
{
	let plotLine = oFF.ChartAxisPlotLine.create(name, text);
	this.m_plotLines.put(name, plotLine);
	return plotLine;
};
oFF.ChartAxis.prototype.getAxisDomain = function()
{
	return this.m_axisDomain;
};
oFF.ChartAxis.prototype.getFrom = function()
{
	return this.m_from;
};
oFF.ChartAxis.prototype.getGridLineColor = function()
{
	return this.m_gridLineColor;
};
oFF.ChartAxis.prototype.getGridLineWidth = function()
{
	return this.m_gridLineWidth;
};
oFF.ChartAxis.prototype.getLabelStyle = function()
{
	return this.m_labelStyle;
};
oFF.ChartAxis.prototype.getOrder = function()
{
	return this.m_order;
};
oFF.ChartAxis.prototype.getPlotBandByName = function(name)
{
	return this.m_plotBands.getByKey(name);
};
oFF.ChartAxis.prototype.getPlotBands = function()
{
	return this.m_plotBands.getValuesAsReadOnlyList();
};
oFF.ChartAxis.prototype.getPlotLineByName = function(name)
{
	return this.m_plotLines.getByKey(name);
};
oFF.ChartAxis.prototype.getPlotLines = function()
{
	return this.m_plotLines.getValuesAsReadOnlyList();
};
oFF.ChartAxis.prototype.getPosition = function()
{
	return this.m_position;
};
oFF.ChartAxis.prototype.getTickSize = function()
{
	return this.m_tickSize;
};
oFF.ChartAxis.prototype.getTitleStyle = function()
{
	return this.m_titleStyle;
};
oFF.ChartAxis.prototype.getTo = function()
{
	return this.m_to;
};
oFF.ChartAxis.prototype.initialize = function(name, text)
{
	oFF.AbstractChartPart.prototype.initialize.call( this , name, text);
	this.m_plotBands = oFF.XHashMapByString.create();
	this.m_plotLines = oFF.XHashMapByString.create();
};
oFF.ChartAxis.prototype.isFitLabelsInsideCoordinates = function()
{
	return this.m_fitLabelsInsideCoordinates;
};
oFF.ChartAxis.prototype.isHidden = function()
{
	return oFF.isNull(this.m_position) || this.m_position.isTypeOf(oFF.ChartVisualizationAxisPosition.HIDDEN);
};
oFF.ChartAxis.prototype.isScaleOpposite = function()
{
	return oFF.notNull(this.m_position) && this.m_position.isOpposite();
};
oFF.ChartAxis.prototype.isScaleReversed = function()
{
	return this.m_reversed;
};
oFF.ChartAxis.prototype.releaseObject = function()
{
	oFF.AbstractChartPart.prototype.releaseObject.call( this );
	this.m_position = null;
	this.m_reversed = false;
	this.m_plotBands = oFF.XObjectExt.release(this.m_plotBands);
	this.m_plotLines = oFF.XObjectExt.release(this.m_plotLines);
	this.m_from = 0;
	this.m_to = 0;
	this.m_order = 0;
	oFF.XObjectExt.release(this.m_labelStyle);
	oFF.XObjectExt.release(this.m_titleStyle);
};
oFF.ChartAxis.prototype.setFitLabelsInsideCoordinates = function(fitLabelsInsideCoordinates)
{
	this.m_fitLabelsInsideCoordinates = fitLabelsInsideCoordinates;
};
oFF.ChartAxis.prototype.setFrom = function(from)
{
	this.m_from = from;
};
oFF.ChartAxis.prototype.setGridLineColor = function(gridLineColor)
{
	this.m_gridLineColor = gridLineColor;
};
oFF.ChartAxis.prototype.setGridLineWidth = function(gridLineWidth)
{
	this.m_gridLineWidth = gridLineWidth;
};
oFF.ChartAxis.prototype.setLabelStyle = function(labelStyle)
{
	this.m_labelStyle = labelStyle;
};
oFF.ChartAxis.prototype.setOrder = function(order)
{
	this.m_order = order;
};
oFF.ChartAxis.prototype.setPosition = function(position)
{
	this.m_position = position;
};
oFF.ChartAxis.prototype.setScaleOpposite = function(opposite)
{
	this.m_position = oFF.ChartVisualizationAxisPosition.getOpposite(this.m_position);
};
oFF.ChartAxis.prototype.setScaleReversed = function(reversed)
{
	this.m_reversed = reversed;
};
oFF.ChartAxis.prototype.setTickSize = function(tickSize)
{
	this.m_tickSize = tickSize;
};
oFF.ChartAxis.prototype.setTitleStyle = function(titleStyle)
{
	this.m_titleStyle = titleStyle;
};
oFF.ChartAxis.prototype.setTo = function(to)
{
	this.m_to = to;
};
oFF.ChartAxis.prototype.setupAxisDomain = function(axisDomainType)
{
	if (axisDomainType.isTypeOf(oFF.ChartAxisDomainType.CATEGORIAL))
	{
		this.m_axisDomain = oFF.ChartDomainCategorial.create(this, axisDomainType);
	}
	else if (axisDomainType.isTypeOf(oFF.ChartAxisDomainType.SCALAR))
	{
		this.m_axisDomain = oFF.ChartDomainScalar.create(this, axisDomainType);
	}
};

oFF.ChartAxisPlotLine = function() {};
oFF.ChartAxisPlotLine.prototype = new oFF.AbstractChartPart();
oFF.ChartAxisPlotLine.prototype._ff_c = "ChartAxisPlotLine";

oFF.ChartAxisPlotLine.create = function(name, text)
{
	let instance = new oFF.ChartAxisPlotLine();
	instance.initialize(name, text);
	return instance;
};
oFF.ChartAxisPlotLine.prototype.m_color = null;
oFF.ChartAxisPlotLine.prototype.m_dashStyle = null;
oFF.ChartAxisPlotLine.prototype.m_value = 0.0;
oFF.ChartAxisPlotLine.prototype.m_width = 0.0;
oFF.ChartAxisPlotLine.prototype.getColor = function()
{
	return this.m_color;
};
oFF.ChartAxisPlotLine.prototype.getDashStyle = function()
{
	return this.m_dashStyle;
};
oFF.ChartAxisPlotLine.prototype.getValue = function()
{
	return this.m_value;
};
oFF.ChartAxisPlotLine.prototype.getWidth = function()
{
	return this.m_width;
};
oFF.ChartAxisPlotLine.prototype.initialize = function(name, text)
{
	oFF.AbstractChartPart.prototype.initialize.call( this , name, text);
};
oFF.ChartAxisPlotLine.prototype.releaseObject = function()
{
	oFF.AbstractChartPart.prototype.releaseObject.call( this );
};
oFF.ChartAxisPlotLine.prototype.setColor = function(color)
{
	this.m_color = color;
};
oFF.ChartAxisPlotLine.prototype.setDashStyle = function(dashStyle)
{
	this.m_dashStyle = dashStyle;
};
oFF.ChartAxisPlotLine.prototype.setValue = function(value)
{
	this.m_value = value;
};
oFF.ChartAxisPlotLine.prototype.setWidth = function(borderWidth)
{
	this.m_width = borderWidth;
};

oFF.ChartCoordinate = function() {};
oFF.ChartCoordinate.prototype = new oFF.AbstractChartPart();
oFF.ChartCoordinate.prototype._ff_c = "ChartCoordinate";

oFF.ChartCoordinate.create = function(name, text, value, fullFormattedText, formattedText, scalingText, unitInformation, heading)
{
	let instance = new oFF.ChartCoordinate();
	instance.initializeWithValue(name, text, value, fullFormattedText, formattedText, scalingText, unitInformation, heading);
	return instance;
};
oFF.ChartCoordinate.prototype.m_formattedText = null;
oFF.ChartCoordinate.prototype.m_fullFormattedText = null;
oFF.ChartCoordinate.prototype.m_heading = null;
oFF.ChartCoordinate.prototype.m_scalingText = null;
oFF.ChartCoordinate.prototype.m_unitInformation = null;
oFF.ChartCoordinate.prototype.m_value = null;
oFF.ChartCoordinate.prototype.getFormattedText = function()
{
	return this.m_formattedText;
};
oFF.ChartCoordinate.prototype.getFullFormattedText = function()
{
	return this.m_fullFormattedText;
};
oFF.ChartCoordinate.prototype.getHeading = function()
{
	return this.m_heading;
};
oFF.ChartCoordinate.prototype.getScalingText = function()
{
	return this.m_scalingText;
};
oFF.ChartCoordinate.prototype.getUnitInformation = function()
{
	return this.m_unitInformation;
};
oFF.ChartCoordinate.prototype.getValue = function()
{
	return this.m_value;
};
oFF.ChartCoordinate.prototype.initializeWithValue = function(name, text, value, fullFormattedText, formattedText, scalingText, unitInformation, heading)
{
	oFF.AbstractChartPart.prototype.initialize.call( this , name, text);
	this.m_value = value;
	this.m_fullFormattedText = fullFormattedText;
	this.m_formattedText = formattedText;
	this.m_scalingText = scalingText;
	this.m_unitInformation = unitInformation;
	this.m_heading = heading;
};
oFF.ChartCoordinate.prototype.releaseObject = function()
{
	oFF.AbstractChartPart.prototype.releaseObject.call( this );
	this.m_value = null;
	this.m_formattedText = null;
	this.m_heading = null;
};
oFF.ChartCoordinate.prototype.setValue = function(value)
{
	this.m_value = value;
};

oFF.ChartCoordinateSystem = function() {};
oFF.ChartCoordinateSystem.prototype = new oFF.AbstractChartPart();
oFF.ChartCoordinateSystem.prototype._ff_c = "ChartCoordinateSystem";

oFF.ChartCoordinateSystem.create = function(name, text, chartVisualization)
{
	let instance = new oFF.ChartCoordinateSystem();
	instance.initializeCoordinateSystem(name, text, chartVisualization);
	return instance;
};
oFF.ChartCoordinateSystem.prototype.m_groupAxisReference = null;
oFF.ChartCoordinateSystem.prototype.m_parentChartVisualization = null;
oFF.ChartCoordinateSystem.prototype.m_seriesAxisReference = null;
oFF.ChartCoordinateSystem.prototype.m_seriesGroup = null;
oFF.ChartCoordinateSystem.prototype.m_xAxisReference = null;
oFF.ChartCoordinateSystem.prototype.m_yAxisReference = null;
oFF.ChartCoordinateSystem.prototype.m_zAxisReference = null;
oFF.ChartCoordinateSystem.prototype.addSeriesGroup = function(name, text)
{
	let series = oFF.ChartSeriesGroup.create(name, text, this);
	this.m_seriesGroup.put(name, series);
	return series;
};
oFF.ChartCoordinateSystem.prototype.clearSeriesGroup = function()
{
	this.m_seriesGroup.clear();
};
oFF.ChartCoordinateSystem.prototype.getGroupAxisReference = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_groupAxisReference);
};
oFF.ChartCoordinateSystem.prototype.getOrCreateSeriesGroup = function(name, text)
{
	if (this.m_seriesGroup.containsKey(name))
	{
		return this.m_seriesGroup.getByKey(name);
	}
	else
	{
		return this.addSeriesGroup(name, text);
	}
};
oFF.ChartCoordinateSystem.prototype.getParentChartVisualization = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_parentChartVisualization);
};
oFF.ChartCoordinateSystem.prototype.getSeriesAxisReference = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_seriesAxisReference);
};
oFF.ChartCoordinateSystem.prototype.getSeriesGroupByName = function(name)
{
	return this.m_seriesGroup.getByKey(name);
};
oFF.ChartCoordinateSystem.prototype.getSeriesGroups = function()
{
	return this.m_seriesGroup.getValuesAsReadOnlyList();
};
oFF.ChartCoordinateSystem.prototype.getXAxisReference = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_xAxisReference);
};
oFF.ChartCoordinateSystem.prototype.getYAxisReference = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_yAxisReference);
};
oFF.ChartCoordinateSystem.prototype.getZAxisReference = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_zAxisReference);
};
oFF.ChartCoordinateSystem.prototype.initializeCoordinateSystem = function(name, text, chartVisualization)
{
	oFF.AbstractChartPart.prototype.initialize.call( this , name, text);
	this.m_parentChartVisualization = oFF.XWeakReferenceUtil.getWeakRef(chartVisualization);
	this.m_seriesGroup = oFF.XLinkedHashMapByString.create();
};
oFF.ChartCoordinateSystem.prototype.releaseObject = function()
{
	oFF.AbstractChartPart.prototype.releaseObject.call( this );
	this.m_seriesGroup = oFF.XObjectExt.release(this.m_seriesGroup);
	this.m_xAxisReference = oFF.XObjectExt.release(this.m_xAxisReference);
	this.m_xAxisReference = oFF.XObjectExt.release(this.m_yAxisReference);
	this.m_xAxisReference = oFF.XObjectExt.release(this.m_zAxisReference);
	this.m_groupAxisReference = oFF.XObjectExt.release(this.m_seriesAxisReference);
	this.m_seriesAxisReference = oFF.XObjectExt.release(this.m_groupAxisReference);
};
oFF.ChartCoordinateSystem.prototype.removeSeriesGroup = function(seriesGroup)
{
	if (oFF.notNull(seriesGroup))
	{
		this.m_seriesGroup.remove(seriesGroup.getName());
	}
};
oFF.ChartCoordinateSystem.prototype.removeSeriesGroupByName = function(name)
{
	this.m_seriesGroup.remove(name);
};
oFF.ChartCoordinateSystem.prototype.setGroupAxisReference = function(groupAxis)
{
	this.m_groupAxisReference = oFF.XWeakReferenceUtil.getWeakRef(groupAxis);
};
oFF.ChartCoordinateSystem.prototype.setSeriesAxisReference = function(seriesAxis)
{
	this.m_seriesAxisReference = oFF.XWeakReferenceUtil.getWeakRef(seriesAxis);
};
oFF.ChartCoordinateSystem.prototype.setXAxisReference = function(xAxis)
{
	this.m_xAxisReference = oFF.XWeakReferenceUtil.getWeakRef(xAxis);
};
oFF.ChartCoordinateSystem.prototype.setYAxisReference = function(yAxis)
{
	this.m_yAxisReference = oFF.XWeakReferenceUtil.getWeakRef(yAxis);
};
oFF.ChartCoordinateSystem.prototype.setZAxisReference = function(zAxis)
{
	this.m_zAxisReference = oFF.XWeakReferenceUtil.getWeakRef(zAxis);
};

oFF.ChartDomainAbstract = function() {};
oFF.ChartDomainAbstract.prototype = new oFF.AbstractChartPart();
oFF.ChartDomainAbstract.prototype._ff_c = "ChartDomainAbstract";

oFF.ChartDomainAbstract.prototype.m_axisDomainType = null;
oFF.ChartDomainAbstract.prototype.m_chartAxis = null;
oFF.ChartDomainAbstract.prototype.getAsCategorial = function()
{
	return null;
};
oFF.ChartDomainAbstract.prototype.getAsScalar = function()
{
	return null;
};
oFF.ChartDomainAbstract.prototype.getAxisDomainType = function()
{
	return this.m_axisDomainType;
};
oFF.ChartDomainAbstract.prototype.getChartAxis = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_chartAxis);
};
oFF.ChartDomainAbstract.prototype.setupDomainType = function(chartAxis, axisDomainType)
{
	this.m_chartAxis = oFF.XWeakReferenceUtil.getWeakRef(chartAxis);
	this.m_axisDomainType = axisDomainType;
};

oFF.ChartFormattableElement = function() {};
oFF.ChartFormattableElement.prototype = new oFF.AbstractChartPart();
oFF.ChartFormattableElement.prototype._ff_c = "ChartFormattableElement";

oFF.ChartFormattableElement.prototype.m_chartPointStyle = null;
oFF.ChartFormattableElement.prototype.m_stylingCategories = null;
oFF.ChartFormattableElement.prototype.addStylingCategory = function(stylingCategory)
{
	if (oFF.notNull(stylingCategory) && !this.m_stylingCategories.contains(stylingCategory))
	{
		this.m_stylingCategories.add(stylingCategory);
	}
};
oFF.ChartFormattableElement.prototype.getEffectiveStyle = function()
{
	return this.getMergedStyle();
};
oFF.ChartFormattableElement.prototype.getEffectiveStyleWithCategories = function(stylingCategories)
{
	let effectiveStyle = this.getEffectiveStyle();
	if (oFF.XCollectionUtils.hasElements(stylingCategories))
	{
		let stylesList = oFF.XList.create();
		oFF.XCollectionUtils.forEach(stylingCategories, (sc) => {
			stylesList.add(sc.getEffectiveStyle());
		});
		stylesList.add(effectiveStyle);
		effectiveStyle = oFF.ChartVisualizationPointStyle.merge(stylesList);
	}
	return effectiveStyle;
};
oFF.ChartFormattableElement.prototype.getMergedStyle = function()
{
	let effectiveStyle = this.m_chartPointStyle;
	if (oFF.XCollectionUtils.hasElements(this.m_stylingCategories))
	{
		let stylesList = oFF.XList.create();
		stylesList.add(this.m_chartPointStyle);
		oFF.XCollectionUtils.forEach(this.m_stylingCategories, (sc) => {
			stylesList.add(sc.getEffectiveStyle());
		});
		effectiveStyle = oFF.ChartVisualizationPointStyle.merge(stylesList);
	}
	return effectiveStyle;
};
oFF.ChartFormattableElement.prototype.getStyle = function()
{
	return this.m_chartPointStyle;
};
oFF.ChartFormattableElement.prototype.getStylingCategories = function()
{
	return this.m_stylingCategories;
};
oFF.ChartFormattableElement.prototype.hasStylingCategories = function()
{
	return oFF.XCollectionUtils.hasElements(this.m_stylingCategories);
};
oFF.ChartFormattableElement.prototype.releaseObject = function()
{
	this.m_chartPointStyle = oFF.XObjectExt.release(this.m_chartPointStyle);
	this.m_stylingCategories = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_stylingCategories);
	oFF.AbstractChartPart.prototype.releaseObject.call( this );
};
oFF.ChartFormattableElement.prototype.setup = function()
{
	oFF.AbstractChartPart.prototype.setup.call( this );
	this.m_chartPointStyle = oFF.ChartVisualizationPointStyle.create();
	this.m_stylingCategories = oFF.XList.create();
};

oFF.ChartVisualization = function() {};
oFF.ChartVisualization.prototype = new oFF.AbstractChartPart();
oFF.ChartVisualization.prototype._ff_c = "ChartVisualization";

oFF.ChartVisualization.DISTRIBUTION_AXIS_NAME = "DISTRIBUTION_AXIS";
oFF.ChartVisualization.GROUPING_AXIS_NAME = "GROUPING_AXIS";
oFF.ChartVisualization.create = function(name, text)
{
	let instance = new oFF.ChartVisualization();
	instance.initialize(name, text);
	return instance;
};
oFF.ChartVisualization.prototype.m_axes = null;
oFF.ChartVisualization.prototype.m_backgroundColor = null;
oFF.ChartVisualization.prototype.m_chartType = null;
oFF.ChartVisualization.prototype.m_coordinateSystems = null;
oFF.ChartVisualization.prototype.m_dataPointContextMatcher = null;
oFF.ChartVisualization.prototype.m_dataPointStyles = null;
oFF.ChartVisualization.prototype.m_distributionAxis = null;
oFF.ChartVisualization.prototype.m_exceptionInformationList = null;
oFF.ChartVisualization.prototype.m_groupingAxis = null;
oFF.ChartVisualization.prototype.m_hiddenAxes = null;
oFF.ChartVisualization.prototype.m_inverted = false;
oFF.ChartVisualization.prototype.m_legend = null;
oFF.ChartVisualization.prototype.m_maxColor = null;
oFF.ChartVisualization.prototype.m_minColor = null;
oFF.ChartVisualization.prototype.m_plotArea = null;
oFF.ChartVisualization.prototype.m_polar = false;
oFF.ChartVisualization.prototype.m_relevantDataPathTags = null;
oFF.ChartVisualization.prototype.m_stylingAxes = null;
oFF.ChartVisualization.prototype.m_subtitle = null;
oFF.ChartVisualization.prototype.m_title = null;
oFF.ChartVisualization.prototype.m_titleStyle = null;
oFF.ChartVisualization.prototype.m_useColorAxis = false;
oFF.ChartVisualization.prototype.m_xAxes = null;
oFF.ChartVisualization.prototype.m_yAxes = null;
oFF.ChartVisualization.prototype.m_zAxes = null;
oFF.ChartVisualization.prototype.addCoordinateSystem = function(name, text, xAxisReference, yAxisReference, zAxisReference)
{
	let coordinateSystem = oFF.ChartCoordinateSystem.create(name, text, this);
	coordinateSystem.setXAxisReference(xAxisReference);
	coordinateSystem.setYAxisReference(yAxisReference);
	coordinateSystem.setZAxisReference(zAxisReference);
	this.m_coordinateSystems.add(coordinateSystem);
	return coordinateSystem;
};
oFF.ChartVisualization.prototype.addDataPointStyle = function(chartDataPointStyle)
{
	this.m_dataPointStyles.add(chartDataPointStyle);
};
oFF.ChartVisualization.prototype.addExceptionInformation = function(exceptionInformation)
{
	oFF.XCollectionUtils.addIfNotPresent(this.m_exceptionInformationList, exceptionInformation);
};
oFF.ChartVisualization.prototype.addHiddenAxis = function(name, text, domainType)
{
	let axis = oFF.ChartAxis.create(name, text, domainType);
	axis.setPosition(oFF.ChartVisualizationAxisPosition.HIDDEN);
	this.m_hiddenAxes.add(axis);
	this.m_axes.add(axis);
	return axis;
};
oFF.ChartVisualization.prototype.addNewDataPointStyle = function(name, text)
{
	let dataPointStyle = oFF.ChartVisualizationDataPointStyle.create(name, text);
	this.m_dataPointStyles.add(dataPointStyle);
	return dataPointStyle;
};
oFF.ChartVisualization.prototype.addRelevantDataPathTag = function(dataSectionInfoReference)
{
	this.m_relevantDataPathTags.add(dataSectionInfoReference);
};
oFF.ChartVisualization.prototype.addXAxis = function(name, text, domainType)
{
	let axis = oFF.ChartAxis.create(name, text, domainType);
	axis.setPosition(oFF.ChartVisualizationAxisPosition.X_BOTTOM);
	axis.setTickSize(0);
	this.m_xAxes.add(axis);
	this.m_axes.add(axis);
	return axis;
};
oFF.ChartVisualization.prototype.addYAxis = function(name, text, domainType)
{
	let axis = oFF.ChartAxis.create(name, text, domainType);
	axis.setPosition(oFF.ChartVisualizationAxisPosition.Y_LEFT);
	this.m_yAxes.add(axis);
	this.m_axes.add(axis);
	return axis;
};
oFF.ChartVisualization.prototype.addZAxis = function(name, text, domainType)
{
	let axis = oFF.ChartAxis.create(name, text, domainType);
	axis.setPosition(oFF.ChartVisualizationAxisPosition.Z);
	this.m_zAxes.add(axis);
	this.m_axes.add(axis);
	return axis;
};
oFF.ChartVisualization.prototype.analyzeAxisForUnitScaling = function(result, axis)
{
	let categoricalAxis = axis.getAxisDomain().getAsCategorial();
	if (oFF.notNull(categoricalAxis))
	{
		oFF.XCollectionUtils.forEach(categoricalAxis.getCategories(), (cat) => {
			let info = oFF.isNull(cat) ? null : cat.getUniqueUnitScaleInformation();
			if (oFF.XStringUtils.isNotNullAndNotEmpty(info))
			{
				if (!result.contains(info))
				{
					result.add(info);
				}
			}
		});
	}
};
oFF.ChartVisualization.prototype.clearDataPointStyles = function()
{
	this.m_dataPointStyles.clear();
};
oFF.ChartVisualization.prototype.clearRelevantDataPathTags = function()
{
	this.m_relevantDataPathTags.clear();
	this.m_exceptionInformationList.clear();
};
oFF.ChartVisualization.prototype.getAxisByName = function(name)
{
	return this.m_axes.getByKey(name);
};
oFF.ChartVisualization.prototype.getBackgroundColor = function()
{
	return this.m_backgroundColor;
};
oFF.ChartVisualization.prototype.getChartLegend = function()
{
	return this.m_legend;
};
oFF.ChartVisualization.prototype.getChartPlotArea = function()
{
	return this.m_plotArea;
};
oFF.ChartVisualization.prototype.getChartType = function()
{
	return this.m_chartType;
};
oFF.ChartVisualization.prototype.getCoordinateSystemByName = function(name)
{
	return this.m_coordinateSystems.getByKey(name);
};
oFF.ChartVisualization.prototype.getCoordinateSystems = function()
{
	return this.m_coordinateSystems.getValuesAsReadOnlyList();
};
oFF.ChartVisualization.prototype.getDataPointStyles = function()
{
	return this.m_dataPointStyles;
};
oFF.ChartVisualization.prototype.getDistributionAxis = function()
{
	return this.m_distributionAxis;
};
oFF.ChartVisualization.prototype.getExceptionInformation = function()
{
	return this.m_exceptionInformationList;
};
oFF.ChartVisualization.prototype.getGroupingAxis = function()
{
	return this.m_groupingAxis;
};
oFF.ChartVisualization.prototype.getHiddenAxes = function()
{
	return this.m_hiddenAxes.getValuesAsReadOnlyList();
};
oFF.ChartVisualization.prototype.getHiddenAxisByName = function(name)
{
	return this.m_hiddenAxes.getByKey(name);
};
oFF.ChartVisualization.prototype.getMaxColor = function()
{
	return this.m_maxColor;
};
oFF.ChartVisualization.prototype.getMinColor = function()
{
	return this.m_minColor;
};
oFF.ChartVisualization.prototype.getOrCreateStylingAxis = function(name)
{
	if (!this.m_stylingAxes.containsKey(name))
	{
		let axis = oFF.ChartAxis.create(name, name, oFF.ChartAxisDomainType.CATEGORIAL);
		this.m_stylingAxes.add(axis);
		this.m_axes.add(axis);
	}
	return this.m_stylingAxes.getByKey(name);
};
oFF.ChartVisualization.prototype.getRelevantDataPathTags = function()
{
	return this.m_relevantDataPathTags;
};
oFF.ChartVisualization.prototype.getSubtitle = function()
{
	return this.m_subtitle;
};
oFF.ChartVisualization.prototype.getTitle = function()
{
	return this.m_title;
};
oFF.ChartVisualization.prototype.getTitleStyle = function()
{
	return this.m_titleStyle;
};
oFF.ChartVisualization.prototype.getUnitScalingHeadings = function()
{
	let result = oFF.XList.create();
	this.analyzeAxisForUnitScaling(result, this.m_distributionAxis);
	this.analyzeAxisForUnitScaling(result, this.m_groupingAxis);
	oFF.XCollectionUtils.forEach(this.m_stylingAxes, (sta) => {
		this.analyzeAxisForUnitScaling(result, sta);
	});
	return result;
};
oFF.ChartVisualization.prototype.getXAxes = function()
{
	return this.m_xAxes.getValuesAsReadOnlyList();
};
oFF.ChartVisualization.prototype.getXAxisByName = function(name)
{
	return this.m_xAxes.getByKey(name);
};
oFF.ChartVisualization.prototype.getYAxes = function()
{
	return this.m_yAxes.getValuesAsReadOnlyList();
};
oFF.ChartVisualization.prototype.getYAxisByName = function(name)
{
	return this.m_yAxes.getByKey(name);
};
oFF.ChartVisualization.prototype.getZAxes = function()
{
	return this.m_zAxes.getValuesAsReadOnlyList();
};
oFF.ChartVisualization.prototype.getZAxisByName = function(name)
{
	return this.m_zAxes.getByKey(name);
};
oFF.ChartVisualization.prototype.initialize = function(name, text)
{
	oFF.AbstractChartPart.prototype.initialize.call( this , name, text);
	this.m_axes = oFF.XListOfNameObject.create();
	this.m_xAxes = oFF.XListOfNameObject.create();
	this.m_yAxes = oFF.XListOfNameObject.create();
	this.m_zAxes = oFF.XListOfNameObject.create();
	this.m_hiddenAxes = oFF.XListOfNameObject.create();
	this.m_stylingAxes = oFF.XListOfNameObject.create();
	this.m_groupingAxis = oFF.ChartAxis.create(oFF.ChartVisualization.GROUPING_AXIS_NAME, oFF.ChartVisualization.GROUPING_AXIS_NAME, oFF.ChartAxisDomainType.CATEGORIAL);
	this.m_distributionAxis = oFF.ChartAxis.create(oFF.ChartVisualization.DISTRIBUTION_AXIS_NAME, oFF.ChartVisualization.DISTRIBUTION_AXIS_NAME, oFF.ChartAxisDomainType.CATEGORIAL);
	this.m_axes.add(this.m_groupingAxis);
	this.m_axes.add(this.m_distributionAxis);
	this.m_coordinateSystems = oFF.XListOfNameObject.create();
	this.m_minColor = oFF.ChartVisualizationPointStyle.create();
	this.m_maxColor = oFF.ChartVisualizationPointStyle.create();
	this.m_dataPointStyles = oFF.XList.create();
	this.m_relevantDataPathTags = oFF.XList.create();
	this.m_exceptionInformationList = oFF.XList.create();
};
oFF.ChartVisualization.prototype.isInverted = function()
{
	return this.m_inverted;
};
oFF.ChartVisualization.prototype.isPolar = function()
{
	return this.m_polar;
};
oFF.ChartVisualization.prototype.isUseColorAxis = function()
{
	return this.m_useColorAxis;
};
oFF.ChartVisualization.prototype.matchesExceptionInfo = function(dataPointStyle, exceptionInfo)
{
	return oFF.notNull(this.m_dataPointContextMatcher) && this.m_dataPointContextMatcher.matchesStyleCriterion(dataPointStyle, exceptionInfo, null);
};
oFF.ChartVisualization.prototype.releaseObject = function()
{
	oFF.AbstractChartPart.prototype.releaseObject.call( this );
	this.m_axes = oFF.XObjectExt.release(this.m_axes);
	this.m_xAxes = oFF.XObjectExt.release(this.m_xAxes);
	this.m_yAxes = oFF.XObjectExt.release(this.m_yAxes);
	this.m_zAxes = oFF.XObjectExt.release(this.m_zAxes);
	this.m_hiddenAxes = oFF.XObjectExt.release(this.m_hiddenAxes);
	this.m_stylingAxes = oFF.XObjectExt.release(this.m_stylingAxes);
	this.m_distributionAxis = oFF.XObjectExt.release(this.m_distributionAxis);
	this.m_groupingAxis = oFF.XObjectExt.release(this.m_groupingAxis);
	this.m_coordinateSystems = oFF.XObjectExt.release(this.m_coordinateSystems);
	this.m_dataPointStyles = oFF.XObjectExt.release(this.m_dataPointStyles);
	this.m_relevantDataPathTags = oFF.XObjectExt.release(this.m_relevantDataPathTags);
	this.m_exceptionInformationList = oFF.XObjectExt.release(this.m_exceptionInformationList);
	this.m_legend = oFF.XObjectExt.release(this.m_legend);
	this.m_plotArea = oFF.XObjectExt.release(this.m_plotArea);
	this.m_titleStyle = oFF.XObjectExt.release(this.m_titleStyle);
};
oFF.ChartVisualization.prototype.setBackgroundColor = function(backgroundColor)
{
	this.m_backgroundColor = backgroundColor;
};
oFF.ChartVisualization.prototype.setChartLegend = function(chartLegend)
{
	this.m_legend = chartLegend;
};
oFF.ChartVisualization.prototype.setChartPlotArea = function(chartPlotArea)
{
	this.m_plotArea = chartPlotArea;
};
oFF.ChartVisualization.prototype.setChartTitleStyle = function(chartTitleStyle)
{
	this.m_titleStyle = chartTitleStyle;
};
oFF.ChartVisualization.prototype.setChartType = function(chartType)
{
	this.m_chartType = chartType;
};
oFF.ChartVisualization.prototype.setInverted = function(inverted)
{
	this.m_inverted = inverted;
};
oFF.ChartVisualization.prototype.setPolar = function(polar)
{
	this.m_polar = polar;
};
oFF.ChartVisualization.prototype.setSubtitle = function(subtitle)
{
	this.m_subtitle = subtitle;
};
oFF.ChartVisualization.prototype.setTitle = function(title)
{
	this.m_title = title;
};
oFF.ChartVisualization.prototype.setUseColorAxis = function(useColorAxis)
{
	this.m_useColorAxis = useColorAxis;
};
oFF.ChartVisualization.prototype.tagMatchedExceptions = function()
{
	oFF.XObjectExt.release(this.m_dataPointContextMatcher);
	this.m_dataPointContextMatcher = oFF.VisualizationDataPointMatcher.create();
	oFF.XCollectionUtils.forEach(this.m_dataPointStyles, (cdps) => {
		this.m_dataPointContextMatcher.tagMatchingStyleCriteria(cdps);
	});
};

oFF.ChartVisualizationDataPointStyle = function() {};
oFF.ChartVisualizationDataPointStyle.prototype = new oFF.AbstractChartPart();
oFF.ChartVisualizationDataPointStyle.prototype._ff_c = "ChartVisualizationDataPointStyle";

oFF.ChartVisualizationDataPointStyle.create = function(name, text)
{
	let instance = new oFF.ChartVisualizationDataPointStyle();
	instance.initialize(name, text);
	instance.setup();
	return instance;
};
oFF.ChartVisualizationDataPointStyle.prototype.m_alertLevelMax = null;
oFF.ChartVisualizationDataPointStyle.prototype.m_alertLevelMin = null;
oFF.ChartVisualizationDataPointStyle.prototype.m_axisPathElements = null;
oFF.ChartVisualizationDataPointStyle.prototype.m_chartPointStyle = null;
oFF.ChartVisualizationDataPointStyle.prototype.m_dataPointCategoryName = null;
oFF.ChartVisualizationDataPointStyle.prototype.m_dataPointCategoryText = null;
oFF.ChartVisualizationDataPointStyle.prototype.m_exceptionName = null;
oFF.ChartVisualizationDataPointStyle.prototype.m_priority = 0;
oFF.ChartVisualizationDataPointStyle.prototype.m_tags = null;
oFF.ChartVisualizationDataPointStyle.prototype.m_unmatchedAlertLevels = false;
oFF.ChartVisualizationDataPointStyle.prototype.m_unmatchedExceptions = false;
oFF.ChartVisualizationDataPointStyle.prototype.m_unmatchedPathElements = false;
oFF.ChartVisualizationDataPointStyle.prototype.m_unmatchedTags = false;
oFF.ChartVisualizationDataPointStyle.prototype.m_unmatchedValueSigns = false;
oFF.ChartVisualizationDataPointStyle.prototype.m_valueSign = null;
oFF.ChartVisualizationDataPointStyle.prototype.addNewPathElement = function()
{
	let reference = oFF.SacDataSectionInfoReference.create();
	this.m_axisPathElements.add(reference);
	this.m_unmatchedPathElements = false;
	return reference;
};
oFF.ChartVisualizationDataPointStyle.prototype.addTag = function(tag)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(tag))
	{
		this.m_tags.add(tag);
		this.m_unmatchedTags = false;
	}
};
oFF.ChartVisualizationDataPointStyle.prototype.clearPathElements = function()
{
	this.m_axisPathElements.clear();
	this.m_unmatchedPathElements = false;
};
oFF.ChartVisualizationDataPointStyle.prototype.clearTags = function()
{
	this.m_tags.clear();
};
oFF.ChartVisualizationDataPointStyle.prototype.getAlertLevel = function()
{
	return this.m_alertLevelMin === this.m_alertLevelMax ? this.m_alertLevelMin : null;
};
oFF.ChartVisualizationDataPointStyle.prototype.getAlertLevelMax = function()
{
	return this.m_alertLevelMax;
};
oFF.ChartVisualizationDataPointStyle.prototype.getAlertLevelMin = function()
{
	return this.m_alertLevelMin;
};
oFF.ChartVisualizationDataPointStyle.prototype.getChartPointStyle = function()
{
	return this.m_chartPointStyle;
};
oFF.ChartVisualizationDataPointStyle.prototype.getDataPointCategoryName = function()
{
	return this.m_dataPointCategoryName;
};
oFF.ChartVisualizationDataPointStyle.prototype.getDataPointCategoryText = function()
{
	return this.m_dataPointCategoryText;
};
oFF.ChartVisualizationDataPointStyle.prototype.getExceptionName = function()
{
	return this.m_exceptionName;
};
oFF.ChartVisualizationDataPointStyle.prototype.getPathElements = function()
{
	return this.m_axisPathElements;
};
oFF.ChartVisualizationDataPointStyle.prototype.getPriority = function()
{
	return this.m_priority;
};
oFF.ChartVisualizationDataPointStyle.prototype.getTags = function()
{
	return this.m_tags;
};
oFF.ChartVisualizationDataPointStyle.prototype.getValueSign = function()
{
	return this.m_valueSign;
};
oFF.ChartVisualizationDataPointStyle.prototype.isUnmatchedAlertLevels = function()
{
	return this.m_unmatchedAlertLevels;
};
oFF.ChartVisualizationDataPointStyle.prototype.isUnmatchedExceptions = function()
{
	return this.m_unmatchedExceptions;
};
oFF.ChartVisualizationDataPointStyle.prototype.isUnmatchedPathElements = function()
{
	return this.m_unmatchedPathElements;
};
oFF.ChartVisualizationDataPointStyle.prototype.isUnmatchedTags = function()
{
	return this.m_unmatchedTags;
};
oFF.ChartVisualizationDataPointStyle.prototype.isUnmatchedValueSigns = function()
{
	return this.m_unmatchedValueSigns;
};
oFF.ChartVisualizationDataPointStyle.prototype.releaseObject = function()
{
	this.m_chartPointStyle = oFF.XObjectExt.release(this.m_chartPointStyle);
	this.m_axisPathElements = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_axisPathElements);
	this.m_unmatchedTags = false;
	this.m_tags = oFF.XObjectExt.release(this.m_tags);
	oFF.AbstractChartPart.prototype.releaseObject.call( this );
};
oFF.ChartVisualizationDataPointStyle.prototype.setAlertLevel = function(alertLevel)
{
	if (oFF.notNull(alertLevel))
	{
		this.m_unmatchedAlertLevels = false;
	}
	this.m_alertLevelMin = alertLevel;
	this.m_alertLevelMax = alertLevel;
};
oFF.ChartVisualizationDataPointStyle.prototype.setAlertLevelMax = function(alertLevelMax)
{
	if (oFF.notNull(alertLevelMax))
	{
		this.m_unmatchedAlertLevels = false;
	}
	this.m_alertLevelMax = alertLevelMax;
};
oFF.ChartVisualizationDataPointStyle.prototype.setAlertLevelMin = function(alertLevelMin)
{
	if (oFF.notNull(alertLevelMin))
	{
		this.m_unmatchedAlertLevels = false;
	}
	this.m_alertLevelMin = alertLevelMin;
};
oFF.ChartVisualizationDataPointStyle.prototype.setDataPointCategoryName = function(dataPointCategoryName)
{
	this.m_dataPointCategoryName = dataPointCategoryName;
};
oFF.ChartVisualizationDataPointStyle.prototype.setDataPointCategoryText = function(dataPointCategoryText)
{
	this.m_dataPointCategoryText = dataPointCategoryText;
};
oFF.ChartVisualizationDataPointStyle.prototype.setExceptionName = function(exceptionName)
{
	if (oFF.notNull(exceptionName))
	{
		this.m_unmatchedExceptions = false;
	}
	this.m_exceptionName = exceptionName;
};
oFF.ChartVisualizationDataPointStyle.prototype.setPriority = function(priority)
{
	this.m_priority = priority;
};
oFF.ChartVisualizationDataPointStyle.prototype.setUnmatchedAlertLevels = function()
{
	this.m_unmatchedAlertLevels = true;
	this.m_alertLevelMax = null;
	this.m_alertLevelMin = null;
};
oFF.ChartVisualizationDataPointStyle.prototype.setUnmatchedExceptions = function()
{
	this.m_unmatchedExceptions = true;
	this.m_exceptionName = null;
};
oFF.ChartVisualizationDataPointStyle.prototype.setUnmatchedPathElements = function()
{
	this.m_axisPathElements.clear();
	this.m_unmatchedPathElements = true;
};
oFF.ChartVisualizationDataPointStyle.prototype.setUnmatchedTags = function()
{
	this.m_unmatchedTags = true;
	this.m_tags.clear();
};
oFF.ChartVisualizationDataPointStyle.prototype.setUnmatchedValueSigns = function()
{
	this.m_valueSign = null;
	this.m_unmatchedValueSigns = true;
};
oFF.ChartVisualizationDataPointStyle.prototype.setValueSign = function(valueSign)
{
	if (oFF.notNull(valueSign))
	{
		this.m_unmatchedValueSigns = false;
	}
	this.m_valueSign = valueSign;
};
oFF.ChartVisualizationDataPointStyle.prototype.setup = function()
{
	oFF.AbstractChartPart.prototype.setup.call( this );
	this.m_chartPointStyle = oFF.ChartVisualizationPointStyle.create();
	this.m_axisPathElements = oFF.XList.create();
	this.m_tags = oFF.XList.create();
};

oFF.SacFormattableTableFragment = function() {};
oFF.SacFormattableTableFragment.prototype = new oFF.SacTableFormattableElement();
oFF.SacFormattableTableFragment.prototype._ff_c = "SacFormattableTableFragment";

oFF.SacFormattableTableFragment.create = function(sacTableProxy, rowDataStartIndex, columnDataStartIndex, rowTupleStartIndex, columnTupleStartIndex)
{
	let instance = new oFF.SacFormattableTableFragment();
	instance.internalSetup(sacTableProxy, rowDataStartIndex, columnDataStartIndex, rowTupleStartIndex, columnTupleStartIndex);
	return instance;
};
oFF.SacFormattableTableFragment.prototype.m_columnAxisBundle = null;
oFF.SacFormattableTableFragment.prototype.m_layeredRectangularStyles = null;
oFF.SacFormattableTableFragment.prototype.m_rowAxisBundle = null;
oFF.SacFormattableTableFragment.prototype.m_sacTableProxy = null;
oFF.SacFormattableTableFragment.prototype.m_tableMarkups = null;
oFF.SacFormattableTableFragment.prototype.m_tableMemberHeaderHandling = null;
oFF.SacFormattableTableFragment.prototype.addNewLayeredRectangularStyle = function()
{
	let newStyle = oFF.SacLayeredRectangularStyle.create();
	this.m_layeredRectangularStyles.add(newStyle);
	return newStyle;
};
oFF.SacFormattableTableFragment.prototype.addNewTableMarkup = function()
{
	let newMarkup = oFF.SacTableMarkup.create();
	this.m_tableMarkups.add(newMarkup);
	return newMarkup;
};
oFF.SacFormattableTableFragment.prototype.addRectangularStyles = function(styles)
{
	this.m_layeredRectangularStyles.addAll(styles);
};
oFF.SacFormattableTableFragment.prototype.addTableMarkups = function(markups)
{
	this.m_tableMarkups.addAll(markups);
};
oFF.SacFormattableTableFragment.prototype.applyColumnAndRowSizes = function(heights, widths)
{
	let keys = heights.getKeysAsIterator();
	let index;
	let key;
	let bundle = this.getRowsBundle();
	let headers = bundle.getHeaderList();
	let dataList = bundle.getDataList();
	let dataStartIndex = bundle.getDataStartIndex();
	let size = headers.size();
	let dataAccessIndex;
	while (keys.hasNext())
	{
		key = keys.next();
		index = key.getInteger();
		let height = heights.getByKey(key).getInteger();
		dataAccessIndex = index - size - dataStartIndex;
		if (index < size)
		{
			headers.get(index).setHeight(height);
		}
		else if (dataAccessIndex > -1 && dataAccessIndex < dataList.size())
		{
			let row = dataList.get(dataAccessIndex);
			if (oFF.notNull(row))
			{
				row.setHeight(height);
			}
		}
	}
	keys = widths.getKeysAsIterator();
	bundle = this.getColumnsBundle();
	headers = bundle.getHeaderList();
	dataList = bundle.getDataList();
	dataStartIndex = bundle.getDataStartIndex();
	size = headers.size();
	while (keys.hasNext())
	{
		key = keys.next();
		index = key.getInteger();
		let width = widths.getByKey(key).getInteger();
		dataAccessIndex = index - size - dataStartIndex;
		if (index < size)
		{
			headers.get(index).setWidth(width);
		}
		else if (dataAccessIndex > -1 && dataAccessIndex < dataList.size())
		{
			let column = dataList.get(dataAccessIndex);
			if (oFF.notNull(column))
			{
				column.setWidth(width);
			}
		}
	}
};
oFF.SacFormattableTableFragment.prototype.clear = function()
{
	this.m_rowAxisBundle.clear();
	this.m_columnAxisBundle.clear();
};
oFF.SacFormattableTableFragment.prototype.clearLayeredRectangularStyles = function()
{
	this.m_layeredRectangularStyles.clear();
};
oFF.SacFormattableTableFragment.prototype.clearTableMarkups = function()
{
	this.m_tableMarkups.clear();
};
oFF.SacFormattableTableFragment.prototype.formatTable = function()
{
	this.m_columnAxisBundle.formatBundle();
	this.m_rowAxisBundle.formatBundle();
};
oFF.SacFormattableTableFragment.prototype.getColumnsBundle = function()
{
	return this.m_columnAxisBundle;
};
oFF.SacFormattableTableFragment.prototype.getLayeredRectangularStyles = function()
{
	return this.m_layeredRectangularStyles;
};
oFF.SacFormattableTableFragment.prototype.getRowsBundle = function()
{
	return this.m_rowAxisBundle;
};
oFF.SacFormattableTableFragment.prototype.getSacTableProxy = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_sacTableProxy);
};
oFF.SacFormattableTableFragment.prototype.getStylePriority = function()
{
	return 10;
};
oFF.SacFormattableTableFragment.prototype.getTableMarkups = function()
{
	return this.m_tableMarkups;
};
oFF.SacFormattableTableFragment.prototype.getTableMemberHeaderHandling = function()
{
	return this.m_tableMemberHeaderHandling;
};
oFF.SacFormattableTableFragment.prototype.internalSetup = function(sacTableProxy, rowDataStartIndex, columnDataStartIndex, rowTupleStartIndex, columnTupleStartIndex)
{
	this.m_sacTableProxy = oFF.XWeakReferenceUtil.getWeakRef(sacTableProxy);
	this.m_rowAxisBundle = oFF.SacFormattableTableFragmentAxisBundle.create(rowDataStartIndex, rowTupleStartIndex, this);
	this.m_columnAxisBundle = oFF.SacFormattableTableFragmentAxisBundle.create(columnDataStartIndex, columnTupleStartIndex, this);
	this.m_tableMarkups = oFF.XList.create();
	this.m_layeredRectangularStyles = oFF.XList.create();
	this.m_tableMemberHeaderHandling = oFF.SacTableMemberHeaderHandling.FIRST_MEMBER;
};
oFF.SacFormattableTableFragment.prototype.releaseObject = function()
{
	this.m_rowAxisBundle = oFF.XObjectExt.release(this.m_rowAxisBundle);
	this.m_columnAxisBundle = oFF.XObjectExt.release(this.m_columnAxisBundle);
	this.m_tableMarkups = oFF.XObjectExt.release(this.m_tableMarkups);
	this.m_layeredRectangularStyles = oFF.XObjectExt.release(this.m_layeredRectangularStyles);
	this.m_tableMemberHeaderHandling = null;
	oFF.SacTableFormattableElement.prototype.releaseObject.call( this );
};
oFF.SacFormattableTableFragment.prototype.setTableMemberHeaderHandling = function(tableMemberHeaderHandling)
{
	this.m_tableMemberHeaderHandling = tableMemberHeaderHandling;
};
oFF.SacFormattableTableFragment.prototype.swallow = function(other)
{
	this.m_columnAxisBundle.swallow(other.getColumnsBundle());
	this.m_rowAxisBundle.swallow(other.getRowsBundle());
	return null;
};

oFF.SacFormattableTableFragmentAxisBundle = function() {};
oFF.SacFormattableTableFragmentAxisBundle.prototype = new oFF.SacTableFormattableElement();
oFF.SacFormattableTableFragmentAxisBundle.prototype._ff_c = "SacFormattableTableFragmentAxisBundle";

oFF.SacFormattableTableFragmentAxisBundle.create = function(dataStartIndex, tupleStartIndex, parent)
{
	let instance = new oFF.SacFormattableTableFragmentAxisBundle();
	instance.internalSetup(dataStartIndex, tupleStartIndex, parent);
	return instance;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.m_dataList = null;
oFF.SacFormattableTableFragmentAxisBundle.prototype.m_dataStartIndex = 0;
oFF.SacFormattableTableFragmentAxisBundle.prototype.m_headerGroupNames = null;
oFF.SacFormattableTableFragmentAxisBundle.prototype.m_headerList = null;
oFF.SacFormattableTableFragmentAxisBundle.prototype.m_headerMap = null;
oFF.SacFormattableTableFragmentAxisBundle.prototype.m_insertOrHidePresent = false;
oFF.SacFormattableTableFragmentAxisBundle.prototype.m_localStartDataIndex = 0;
oFF.SacFormattableTableFragmentAxisBundle.prototype.m_maxElements = 0;
oFF.SacFormattableTableFragmentAxisBundle.prototype.m_maxRecommendedElements = 0;
oFF.SacFormattableTableFragmentAxisBundle.prototype.m_maxRecommendedSize = 0;
oFF.SacFormattableTableFragmentAxisBundle.prototype.m_maxSize = 0;
oFF.SacFormattableTableFragmentAxisBundle.prototype.m_memberHeaderHandling = null;
oFF.SacFormattableTableFragmentAxisBundle.prototype.m_pageBreakIsStylingBoundary = false;
oFF.SacFormattableTableFragmentAxisBundle.prototype.m_pageRanges = null;
oFF.SacFormattableTableFragmentAxisBundle.prototype.m_pageRangesComplete = false;
oFF.SacFormattableTableFragmentAxisBundle.prototype.m_parentTable = null;
oFF.SacFormattableTableFragmentAxisBundle.prototype.m_totalData = 0;
oFF.SacFormattableTableFragmentAxisBundle.prototype.m_totalTuples = 0;
oFF.SacFormattableTableFragmentAxisBundle.prototype.m_totalTuplesMayBeInaccurate = false;
oFF.SacFormattableTableFragmentAxisBundle.prototype.m_tupleList = null;
oFF.SacFormattableTableFragmentAxisBundle.prototype.m_tupleRanges = null;
oFF.SacFormattableTableFragmentAxisBundle.prototype.m_tupleStartIndex = 0;
oFF.SacFormattableTableFragmentAxisBundle.prototype.addData = function(data)
{
	this.m_dataList.add(data);
	this.setUpParentList(this.m_dataList, data);
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.addEmptyTuple = function()
{
	this.m_tupleList.add(null);
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.addHeader = function(header)
{
	this.m_headerList.add(header);
	this.setUpParentList(this.m_headerList, header);
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.addHeaderGroupName = function(sectionName)
{
	this.m_headerGroupNames.add(sectionName);
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.addPageRange = function(startIndex, endIndex)
{
	this.m_pageRanges.add(oFF.XPair.create(oFF.XIntegerValue.create(startIndex), oFF.XIntegerValue.create(endIndex)));
	this.updatePageRangeStyle(startIndex, endIndex);
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.addTuple = function(tuple)
{
	this.m_tupleList.add(tuple);
	this.setUpParentList(this.m_dataList, tuple);
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.addTupleRange = function(min, max)
{
	this.m_tupleRanges.add(oFF.XPair.create(oFF.XIntegerValue.create(min), oFF.XIntegerValue.create(max)));
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.applyRanges = function(localDataStartIndex, localTupleStartIndex, localTupleEndIndex)
{
	let optionalStartTuple = oFF.XCollectionUtils.getOptionalAtIndex(this.m_tupleList, localTupleStartIndex);
	let actualTupleEndIndex = localTupleEndIndex;
	let optionalEndTuple = oFF.XCollectionUtils.getOptionalAtIndex(this.m_tupleList, actualTupleEndIndex);
	while (!optionalEndTuple.isPresent() && actualTupleEndIndex > localTupleStartIndex)
	{
		actualTupleEndIndex--;
		optionalEndTuple = oFF.XCollectionUtils.getOptionalAtIndex(this.m_tupleList, actualTupleEndIndex);
	}
	if (optionalStartTuple.isPresent() && optionalEndTuple.isPresent())
	{
		let tupleStartIndex = optionalStartTuple.get().getTupleIndex();
		let tupleEndIndex = optionalEndTuple.get().getTupleIndex();
		let currentTupleIndex = tupleStartIndex;
		let rangeIndex = this.m_dataStartIndex + localDataStartIndex;
		let rangeStartIndex = rangeIndex;
		let oldDataTupleIndex = -1;
		let dataListSize = this.m_dataList.size();
		for (let i = localDataStartIndex; i < dataListSize; i++, rangeIndex++)
		{
			let element = this.m_dataList.get(i);
			let currentDataTupleIndex = oFF.isNull(element) ? -1 : element.getRootTupleIndex();
			let followIndex = i + 1;
			let elementFollow = followIndex === dataListSize ? null : this.m_dataList.get(followIndex);
			let followDataTupleIndex = oFF.isNull(elementFollow) ? -1 : elementFollow.getRootTupleIndex();
			while (currentDataTupleIndex > currentTupleIndex)
			{
				this.addTupleRange(rangeStartIndex, rangeStartIndex - 1);
				currentTupleIndex++;
			}
			if (currentDataTupleIndex !== oldDataTupleIndex && currentDataTupleIndex !== followDataTupleIndex)
			{
				this.addTupleRange(rangeStartIndex, rangeIndex);
				rangeStartIndex = rangeIndex + 1;
				oldDataTupleIndex = currentDataTupleIndex;
				currentTupleIndex++;
			}
		}
		while (oldDataTupleIndex < tupleEndIndex)
		{
			this.addTupleRange(rangeIndex, rangeIndex - 1);
			oldDataTupleIndex++;
		}
	}
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.clear = function()
{
	this.m_dataList.clear();
	this.m_tupleRanges.clear();
	this.m_tupleList.clear();
	this.m_headerList.clear();
	this.m_insertOrHidePresent = false;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.clearHeaderGroupNames = function()
{
	this.m_headerGroupNames.clear();
	this.m_headerMap.clear();
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.clearHeaders = function()
{
	this.m_headerGroupNames.clear();
	this.m_headerList.clear();
	this.m_headerMap.clear();
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.formatBundle = function()
{
	this.updateHeaderStyles();
	this.updateDataStyles();
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.getDataAt = function(position)
{
	return this.m_dataList.get(position);
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.getDataList = function()
{
	return this.m_dataList;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.getDataStartIndex = function()
{
	return this.m_dataStartIndex;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.getDataTotalCount = function()
{
	return this.m_totalData;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.getEstimatedPageCount = function()
{
	let result = 1;
	if (oFF.XCollectionUtils.hasElements(this.m_pageRanges))
	{
		let endTuple = this.m_pageRanges.get(this.m_pageRanges.size() - 1).getSecondObject().getInteger() + 1;
		let factor = this.m_pageRanges.size() * oFF.XMath.max(this.m_totalTuples, 1);
		let divisor = oFF.XMath.max(1, endTuple);
		let modulo = oFF.XMath.mod(factor, divisor);
		result = oFF.XMath.div(factor, divisor) + (modulo > 0 ? 1 : 0);
	}
	return result;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.getEstimatedPageInterval = function(page, startTuple, endTuple)
{
	let result;
	let tupleRange;
	if (endTuple > 0)
	{
		let totalTuples = this.getTotalTuples();
		let correctedEndTuple = totalTuples > 0 ? oFF.XMath.min(endTuple, totalTuples - 1) : endTuple;
		result = this.projectTupleToElementInterval(startTuple, correctedEndTuple);
	}
	else if (page < this.m_pageRanges.size())
	{
		tupleRange = this.m_pageRanges.get(page);
		result = this.projectTupleToElementInterval(tupleRange.getFirstObject().getInteger(), tupleRange.getSecondObject().getInteger());
	}
	else
	{
		if (this.m_pageRanges.isEmpty())
		{
			result = oFF.XPair.create(oFF.XIntegerValue.create(0), oFF.XIntegerValue.create(this.m_totalData));
		}
		else
		{
			let lastRange = this.m_pageRanges.get(this.m_pageRanges.size() - 1);
			let lastRangeEnd = lastRange.getSecondObject().getInteger();
			let counter = lastRangeEnd * (page + 2);
			result = this.projectTupleToElementInterval(lastRangeEnd + 1, oFF.XMath.div(counter, this.m_pageRanges.size()));
		}
	}
	return result;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.getEstimatedPageTupleInterval = function(page, startTuple, endTuple)
{
	let result;
	if (endTuple > 0)
	{
		result = oFF.XPair.create(oFF.XIntegerValue.create(startTuple), oFF.XIntegerValue.create(endTuple));
	}
	else if (page < this.m_pageRanges.size())
	{
		result = this.m_pageRanges.get(page);
	}
	else
	{
		if (this.m_pageRanges.isEmpty())
		{
			result = oFF.XPair.create(oFF.XIntegerValue.create(0), oFF.XIntegerValue.create(this.m_totalData));
		}
		else
		{
			let lastRange = this.m_pageRanges.get(this.m_pageRanges.size() - 1);
			let lastRangeEnd = lastRange.getSecondObject().getInteger();
			let counter = lastRangeEnd * (page + 2);
			result = oFF.XPair.create(oFF.XIntegerValue.create(lastRangeEnd + 1), oFF.XIntegerValue.create(oFF.XMath.div(counter, this.m_pageRanges.size())));
		}
	}
	return result;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.getFilledPageCount = function()
{
	return this.m_pageRanges.size() - (this.m_pageRangesComplete ? 0 : 1);
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.getFilledPageCountWithSecurePadding = function()
{
	return this.m_pageRanges.size() - (this.m_pageRangesComplete ? 0 : 2);
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.getHeaderAt = function(position)
{
	return this.m_headerList.get(position);
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.getHeaderEndIndex = function()
{
	let headerEndIndex = this.getHeaderList().size() - 1;
	while (headerEndIndex > -1 && this.getHeaderList().get(headerEndIndex).getRootComponentIndex() === -1)
	{
		headerEndIndex--;
	}
	return headerEndIndex;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.getHeaderGroupNames = function()
{
	return this.m_headerGroupNames;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.getHeaderList = function()
{
	return this.m_headerList;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.getHeaderMap = function()
{
	return this.m_headerMap;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.getLocalStartDataIndex = function()
{
	return this.m_localStartDataIndex;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.getMaxElements = function()
{
	return this.m_maxElements;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.getMaxRecommendedElements = function()
{
	return this.m_maxRecommendedElements;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.getMaxRecommendedSize = function()
{
	return this.m_maxRecommendedSize;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.getMaxSize = function()
{
	return this.m_maxSize;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.getMemberHeaderHandling = function()
{
	return this.m_memberHeaderHandling;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.getParent = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_parentTable);
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.getSacTableProxy = function()
{
	return this.getParent().getSacTableProxy();
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.getStylePriority = function()
{
	return 6;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.getTotalTuples = function()
{
	return this.m_totalTuples;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.getTupleAt = function(position)
{
	return this.m_tupleList.get(position);
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.getTupleRanges = function()
{
	return this.m_tupleRanges;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.getTupleStartIndex = function()
{
	return this.m_tupleStartIndex;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.getTuples = function()
{
	return this.m_tupleList;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.indexAndFormatTheTuples = function(startIndex, tupleList, consumer)
{
	let needsReIndex = false;
	this.indexTuples(startIndex, tupleList, consumer);
	let updatedTupleList = tupleList.createListCopy();
	let tuple;
	let partialSize = tupleList.size();
	let i;
	for (i = 0; i < partialSize; i++)
	{
		tuple = tupleList.get(i);
		if (oFF.notNull(tuple))
		{
			needsReIndex = tuple.applyHeaderHandling(updatedTupleList, this.m_pageBreakIsStylingBoundary, i) || needsReIndex;
		}
	}
	let newTupleList = tupleList;
	if (needsReIndex)
	{
		this.indexTuples(startIndex, updatedTupleList, consumer);
		newTupleList = updatedTupleList.createListCopy();
	}
	partialSize = newTupleList.size();
	for (i = 0; i < partialSize; i++)
	{
		tuple = newTupleList.get(i);
		if (oFF.notNull(tuple))
		{
			tuple.preIndexTableMarkups();
		}
	}
	for (i = 0; i < partialSize; i++)
	{
		tuple = newTupleList.get(i);
		if (oFF.notNull(tuple))
		{
			tuple.indexTableMarkups();
		}
	}
	for (i = 0; i < partialSize; i++)
	{
		tuple = newTupleList.get(i);
		if (oFF.notNull(tuple))
		{
			needsReIndex = tuple.applyTableMarkups(updatedTupleList) || needsReIndex;
		}
	}
	if (needsReIndex)
	{
		this.indexTuples(startIndex, updatedTupleList, consumer);
	}
	return updatedTupleList;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.indexTuples = function(globalIndexOrig, list, consumer)
{
	for (let localIndex = 0, globalIndex = globalIndexOrig; localIndex < list.size(); localIndex++, globalIndex++)
	{
		consumer(oFF.XIntegerValue.create(globalIndex), list.get(localIndex));
	}
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.insertData = function(position, data)
{
	this.m_dataList.insert(position, data);
	this.setUpParentList(this.m_dataList, data);
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.insertHeader = function(position, header)
{
	this.m_headerList.insert(position, header);
	this.setUpParentList(this.m_headerList, header);
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.insertTuple = function(position, tuple)
{
	this.m_tupleList.insert(position, tuple);
	this.setUpParentList(this.m_dataList, tuple);
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.internalSetup = function(dataStartIndex, tupleStartIndex, parent)
{
	this.m_headerGroupNames = oFF.XList.create();
	this.m_headerMap = oFF.XHashMapByString.create();
	this.m_dataList = oFF.XList.create();
	this.m_headerList = oFF.XList.create();
	this.m_tupleList = oFF.XList.create();
	this.m_tupleRanges = oFF.XList.create();
	this.m_pageRanges = oFF.XList.create();
	this.m_dataStartIndex = dataStartIndex;
	this.m_tupleStartIndex = tupleStartIndex;
	this.m_memberHeaderHandling = oFF.SacTableMemberHeaderHandling.FIRST_MEMBER;
	this.m_parentTable = oFF.XWeakReferenceUtil.getWeakRef(parent);
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.isInsertOrHidePresent = function()
{
	return this.m_insertOrHidePresent;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.isPageBreakIsStylingBoundary = function()
{
	return this.m_pageBreakIsStylingBoundary;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.isTotalTuplesMayBeInaccurate = function()
{
	return this.m_totalTuplesMayBeInaccurate;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.projectMinDataIndexFromTuple = function(minTupleIndex)
{
	let dataMin = minTupleIndex;
	let tupleRangesSize = this.m_tupleRanges.size();
	if (minTupleIndex === 0)
	{
		dataMin = 0;
	}
	else if (minTupleIndex <= tupleRangesSize && this.m_tupleRanges.get(minTupleIndex - 1) !== null)
	{
		dataMin = this.m_tupleRanges.get(minTupleIndex - 1).getSecondObject().getInteger() + 1;
	}
	else if (!this.m_tupleRanges.isEmpty())
	{
		let i;
		for (i = oFF.XMath.min(tupleRangesSize - 1, minTupleIndex); i > 0; i--)
		{
			if (this.m_tupleRanges.get(i) !== null)
			{
				break;
			}
		}
		if (this.m_tupleRanges.get(i) !== null)
		{
			let tupleSize = i + 1;
			let dataSize = this.m_tupleRanges.get(i).getSecondObject().getInteger() + 1;
			dataMin = dataSize;
			for (i = tupleSize + 1; i <= minTupleIndex; i++)
			{
				let max = oFF.XMath.div(i * dataSize, tupleSize);
				if (i < tupleRangesSize)
				{
					this.m_tupleRanges.set(i, oFF.XPair.create(oFF.XIntegerValue.create(dataMin), oFF.XIntegerValue.create(max - 1)));
				}
				else
				{
					this.addTupleRange(dataMin, max - 1);
				}
				dataMin = max;
			}
		}
	}
	return dataMin;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.projectTupleToElementInterval = function(min, max)
{
	let totalTuples = this.getTotalTuples();
	let correctedMax = totalTuples > 0 ? oFF.XMath.min(max, totalTuples - 1) : max;
	return oFF.XPair.create(oFF.XIntegerValue.create(this.projectMinDataIndexFromTuple(min)), oFF.XIntegerValue.create(this.projectMinDataIndexFromTuple(correctedMax + 1) - 1));
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.putHeaderGroupMapping = function(group, baseGroup)
{
	this.m_headerMap.put(group, baseGroup);
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.releaseObject = function()
{
	this.m_headerGroupNames = oFF.XObjectExt.release(this.m_headerGroupNames);
	this.m_headerMap = oFF.XObjectExt.release(this.m_headerMap);
	this.m_dataList = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_dataList);
	this.m_headerList = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_headerList);
	this.m_tupleList = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_tupleList);
	this.m_tupleRanges = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_tupleRanges);
	this.m_pageRanges = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_pageRanges);
	this.m_parentTable = oFF.XObjectExt.release(this.m_parentTable);
	this.m_dataStartIndex = -1;
	this.m_tupleStartIndex = -1;
	this.m_memberHeaderHandling = null;
	this.m_pageBreakIsStylingBoundary = false;
	this.m_localStartDataIndex = 0;
	oFF.SacTableFormattableElement.prototype.releaseObject.call( this );
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.removeDataAt = function(posiiton)
{
	this.m_dataList.removeAt(posiiton);
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.removeHeaderAt = function(position)
{
	this.m_headerList.removeAt(position);
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.removeTupleAt = function(position)
{
	this.m_tupleList.removeAt(position);
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.setData = function(position, data)
{
	this.m_dataList.set(position, data);
	this.setUpParentList(this.m_dataList, data);
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.setDataTotalCount = function(dataTotalCount)
{
	this.m_totalData = dataTotalCount;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.setHeader = function(position, header)
{
	this.m_headerList.set(position, header);
	this.setUpParentList(this.m_headerList, header);
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.setInsertOrHidePresent = function(insertOrHidePresent)
{
	this.m_insertOrHidePresent = insertOrHidePresent;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.setMaxElements = function(maxElements)
{
	this.m_maxElements = maxElements;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.setMaxRecommendedElements = function(maxRecommendedElements)
{
	this.m_maxRecommendedElements = maxRecommendedElements;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.setMaxRecommendedSize = function(maxRecommendedSize)
{
	this.m_maxRecommendedSize = maxRecommendedSize;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.setMaxSize = function(maxSize)
{
	this.m_maxSize = maxSize;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.setMemberHeaderHandling = function(memberHeaderHandling)
{
	this.m_memberHeaderHandling = memberHeaderHandling;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.setPageBreakIsStylingBoundary = function(pageBreakIsStylingBoundary)
{
	this.m_pageBreakIsStylingBoundary = pageBreakIsStylingBoundary;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.setTotalTuples = function(totalTuples)
{
	this.m_totalTuples = totalTuples;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.setTotalTuplesMayBeInaccurate = function(totalTuplesMayBeInaccurate)
{
	this.m_totalTuplesMayBeInaccurate = totalTuplesMayBeInaccurate;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.setTuple = function(position, tuple)
{
	this.m_tupleList.set(position, tuple);
	this.setUpParentList(this.m_dataList, tuple);
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.setUpParentList = function(owningList, axisFragment)
{
	axisFragment.setOwningList(owningList);
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.swallow = function(other)
{
	oFF.XObjectExt.assertInt(this.m_dataStartIndex, 0);
	oFF.XObjectExt.assertInt(this.m_tupleStartIndex, 0);
	this.m_headerList.clear();
	oFF.XCollectionUtils.forEach(other.getHeaderList(), (oh) => {
		this.addHeader(oh);
	});
	let tupleStartIndex = other.getTupleStartIndex();
	let dataStartIndex = other.getDataStartIndex();
	while (this.m_tupleList.size() < tupleStartIndex)
	{
		this.m_tupleList.add(null);
	}
	while (this.m_tupleRanges.size() < tupleStartIndex)
	{
		this.m_tupleRanges.add(null);
	}
	let swallowTuples = other.getTuples();
	let swallowRanges = other.getTupleRanges();
	let swallowRangeSize = swallowRanges.size();
	let swallowTupleSize = swallowTuples.size();
	oFF.XObjectExt.assertInt(swallowRangeSize, swallowTupleSize);
	let diffSize = 0;
	let i;
	for (i = 0; i < swallowRangeSize; i++)
	{
		diffSize = diffSize + this.swallowTuple(i + tupleStartIndex, swallowTuples.get(i), swallowRanges.get(i));
	}
	if (diffSize !== 0)
	{
		for (i = swallowRangeSize + other.getTupleStartIndex(); i < this.m_tupleRanges.size(); i++)
		{
			let currentRange = this.m_tupleRanges.get(i);
			if (oFF.notNull(currentRange))
			{
				currentRange.setFirstObject(oFF.XIntegerValue.create(currentRange.getFirstObject().getInteger() + diffSize));
				currentRange.setSecondObject(oFF.XIntegerValue.create(currentRange.getSecondObject().getInteger() + diffSize));
			}
		}
	}
	while (this.m_dataList.size() < dataStartIndex)
	{
		this.m_dataList.add(null);
	}
	while (diffSize > 0)
	{
		diffSize--;
		this.m_dataList.insert(dataStartIndex, null);
	}
	while (diffSize < 0)
	{
		diffSize++;
		this.m_dataList.removeAt(dataStartIndex);
	}
	let data = other.getDataList();
	let j = dataStartIndex;
	for (i = 0; i < data.size(); j++, i++)
	{
		if (j < this.m_dataList.size())
		{
			this.m_dataList.set(j, data.get(i));
		}
		else
		{
			this.m_dataList.add(data.get(i));
		}
	}
	let tupleEndIndex = tupleStartIndex + swallowTupleSize - 1;
	let filledPages = this.getFilledPageCount();
	let restIndex = 0;
	for (i = 0; i < filledPages; i++)
	{
		let currentPageRange = this.m_pageRanges.get(i);
		let startIndex = currentPageRange.getFirstObject().getInteger();
		let endIndex = currentPageRange.getSecondObject().getInteger();
		if (tupleStartIndex > endIndex)
		{
			continue;
		}
		if (tupleEndIndex < startIndex)
		{
			break;
		}
		this.updatePageRangeStyle(startIndex, endIndex);
		restIndex = endIndex + 1;
	}
	if (restIndex <= tupleEndIndex)
	{
		this.updatePageRangeStyle(restIndex, tupleEndIndex);
	}
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.swallowTuple = function(index, tuple, range)
{
	let diffSize = 0;
	let newRange = range.getSecondObject().getInteger() - range.getFirstObject().getInteger();
	if (this.m_tupleList.size() > index && this.m_tupleRanges.size() > index)
	{
		let ourRange = this.m_tupleRanges.get(index);
		if (oFF.notNull(ourRange))
		{
			diffSize = newRange - ourRange.getSecondObject().getInteger() + ourRange.getFirstObject().getInteger();
		}
		else
		{
			diffSize = newRange + 1;
		}
		this.m_tupleRanges.set(index, range);
		this.setTuple(index, tuple);
	}
	else
	{
		if (this.m_tupleRanges.size() > index)
		{
			this.m_tupleRanges.set(index, range);
		}
		else
		{
			this.m_tupleRanges.insert(index, range);
		}
		this.insertTuple(index, tuple);
		diffSize = newRange + 1;
	}
	return diffSize;
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.updateDataStyles = function()
{
	let consumer = (index, row) => {
		if (oFF.notNull(row))
		{
			row.setDataIndex(index.getInteger());
		}
	};
	this.m_localStartDataIndex = 0;
	this.m_dataList.clear();
	this.m_dataList.addAll(this.m_tupleList);
	let fragmentList = oFF.XList.create();
	oFF.XCollectionUtils.forEach(this.m_dataList, (hc) => {
		fragmentList.add(hc);
	});
	this.indexAndFormatTheTuples(this.m_dataStartIndex, fragmentList, consumer);
	this.m_tupleRanges.clear();
	this.applyRanges(0, 0, this.m_tupleList.size() - 1);
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.updateHeaderStyles = function()
{
	oFF.XCollectionUtils.forEach(this.m_headerList, (hr) => {
		hr.clearTableMarkups();
		hr.removePreviousChildren();
		hr.removeSubsequentChildren();
	});
	let consumer = (index, row) => {
		if (oFF.notNull(row))
		{
			row.setHeaderIndex(index.getInteger());
		}
	};
	let fragmentList = oFF.XList.create();
	oFF.XCollectionUtils.forEach(this.m_headerList, (hc) => {
		fragmentList.add(hc);
	});
	this.indexAndFormatTheTuples(0, fragmentList, consumer);
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.updatePageRangeStyle = function(startIndex, endIndex)
{
	let consumer = (index, row) => {
		if (oFF.notNull(row))
		{
			row.setDataIndex(index.getInteger());
		}
	};
	if (this.m_pageBreakIsStylingBoundary && this.m_tupleRanges.size() > endIndex)
	{
		this.m_localStartDataIndex = this.m_tupleRanges.get(startIndex).getFirstObject().getInteger();
		let i;
		for (i = this.m_dataList.size() - 1; i >= this.m_localStartDataIndex; i--)
		{
			this.m_dataList.removeAt(i);
		}
		for (i = this.m_tupleRanges.size() - 1; i >= startIndex; i--)
		{
			this.m_tupleRanges.removeAt(i);
		}
		let tupleSubList = this.m_tupleList.sublist(startIndex, -1);
		this.m_dataList.addAll(tupleSubList);
		let fragmentList = oFF.XList.create();
		fragmentList.addAll(tupleSubList);
		this.indexAndFormatTheTuples(this.m_localStartDataIndex, fragmentList, consumer);
		this.applyRanges(this.m_localStartDataIndex, startIndex, this.m_tupleList.size() - 1);
	}
};
oFF.SacFormattableTableFragmentAxisBundle.prototype.updatePageRanges = function()
{
	let startTupleIndex;
	if (this.m_pageRanges.size() === 0)
	{
		startTupleIndex = 0;
	}
	else
	{
		let lastIndex = this.m_pageRanges.size() - 1;
		startTupleIndex = this.m_pageRanges.get(lastIndex).getFirstObject().getInteger();
		this.m_pageRanges.removeAt(lastIndex);
	}
	if (this.m_maxRecommendedSize === 0 && this.m_maxSize === 0 && (this.m_maxElements > 0 || this.m_maxRecommendedElements > 0) && !oFF.XStream.of(this.getParent().getTableMarkups()).anyMatch((tm) => {
		return tm.getPageBreakHandling().isBreaking();
	}))
	{
		let pageSize;
		if (this.m_maxElements === 0)
		{
			pageSize = this.m_maxRecommendedElements;
		}
		else if (this.m_maxRecommendedElements === 0)
		{
			pageSize = this.m_maxElements;
		}
		else
		{
			pageSize = oFF.XMath.min(this.m_maxElements, this.m_maxRecommendedElements);
		}
		for (let startIndex = startTupleIndex; startIndex < this.m_totalTuples; startIndex = startIndex + pageSize)
		{
			let endIndex = startIndex + pageSize;
			if (!this.m_totalTuplesMayBeInaccurate && endIndex > this.m_totalTuples)
			{
				endIndex = this.m_totalTuples;
			}
			this.addPageRange(startIndex, endIndex - 1);
		}
		this.m_pageRangesComplete = !this.m_totalTuplesMayBeInaccurate;
	}
	else if (this.m_maxRecommendedElements > 0 || this.m_maxElements > 0 || this.m_maxSize > 0 || this.m_maxRecommendedSize > 0)
	{
		this.m_pageRangesComplete = false;
		let accumulatedTuples = 0;
		let accumulatedSize = 0;
		let pendingBreakBeforeIndex = -1;
		let i = startTupleIndex;
		for (; i < this.m_tupleList.size() + this.m_tupleStartIndex; i++)
		{
			let tupleItem = this.m_tupleList.get(i - this.m_tupleStartIndex);
			if (oFF.isNull(tupleItem))
			{
				break;
			}
			let bap = tupleItem.getBreakAfterPriority();
			let ktap = tupleItem.getKeepTogetherAfterPriority();
			let ktbp = tupleItem.getKeepTogetherBeforePriority();
			let bbp = tupleItem.getBreakBeforePriority();
			if (bbp > -2 && (bbp < ktbp || ktbp === -2))
			{
				if (i > startTupleIndex)
				{
					this.addPageRange(startTupleIndex, i - 1);
					accumulatedTuples = 0;
					accumulatedSize = 0;
					startTupleIndex = i;
					pendingBreakBeforeIndex = -2;
				}
			}
			let newDisplaySize = tupleItem.getDisplaysizeIncludingChildren();
			let hardLimitReached = this.m_maxElements > 0 && accumulatedTuples + 1 > this.m_maxElements || accumulatedTuples > 0 && this.m_maxSize > 0 && accumulatedSize + newDisplaySize > this.m_maxSize;
			if (hardLimitReached && pendingBreakBeforeIndex > -2 && pendingBreakBeforeIndex > startTupleIndex)
			{
				this.addPageRange(startTupleIndex, pendingBreakBeforeIndex - 1);
				accumulatedTuples = 0;
				accumulatedSize = 0;
				startTupleIndex = pendingBreakBeforeIndex;
				i = pendingBreakBeforeIndex - 1;
				pendingBreakBeforeIndex = -2;
				continue;
			}
			else if (hardLimitReached || ktbp === -2 && (this.m_maxRecommendedElements > 0 && accumulatedTuples + 1 > this.m_maxRecommendedElements || accumulatedTuples > 0 && this.m_maxRecommendedSize > 0 && accumulatedSize + newDisplaySize > this.m_maxRecommendedSize))
			{
				this.addPageRange(startTupleIndex, i - 1);
				accumulatedTuples = 0;
				accumulatedSize = newDisplaySize;
				startTupleIndex = i;
				pendingBreakBeforeIndex = -2;
			}
			else
			{
				accumulatedTuples = accumulatedTuples + 1;
				accumulatedSize = accumulatedSize + newDisplaySize;
			}
			if (bap > -2 && (bap < ktap || ktap === -2))
			{
				this.addPageRange(startTupleIndex, i);
				accumulatedTuples = 0;
				accumulatedSize = 0;
				startTupleIndex = i + 1;
				pendingBreakBeforeIndex = -2;
			}
			if (startTupleIndex <= i && ktap === -2)
			{
				pendingBreakBeforeIndex = i + 1;
			}
			else if (startTupleIndex < i && ktbp === -2)
			{
				pendingBreakBeforeIndex = i;
			}
		}
		if (this.getTotalTuples() === i && !this.isTotalTuplesMayBeInaccurate())
		{
			this.m_pageRangesComplete = true;
			if (startTupleIndex < i)
			{
				this.addPageRange(startTupleIndex, i - 1);
			}
		}
	}
};

oFF.SacTableAxisFragment = function() {};
oFF.SacTableAxisFragment.prototype = new oFF.SacTableFormattableElement();
oFF.SacTableAxisFragment.prototype._ff_c = "SacTableAxisFragment";

oFF.SacTableAxisFragment.getSiblingGraceful = function(list, index)
{
	return index < 0 || index >= list.size() ? null : list.get(index);
};
oFF.SacTableAxisFragment.prototype.m_breakAfterPriority = 0;
oFF.SacTableAxisFragment.prototype.m_breakBeforePriority = 0;
oFF.SacTableAxisFragment.prototype.m_bundle = null;
oFF.SacTableAxisFragment.prototype.m_childrenAfter = null;
oFF.SacTableAxisFragment.prototype.m_childrenBefore = null;
oFF.SacTableAxisFragment.prototype.m_componentIndex = 0;
oFF.SacTableAxisFragment.prototype.m_dataIndex = 0;
oFF.SacTableAxisFragment.prototype.m_dataPath = null;
oFF.SacTableAxisFragment.prototype.m_dataSectionGroupLevelIndex = null;
oFF.SacTableAxisFragment.prototype.m_dataSectionTags = null;
oFF.SacTableAxisFragment.prototype.m_header = false;
oFF.SacTableAxisFragment.prototype.m_headerBand = false;
oFF.SacTableAxisFragment.prototype.m_headerBoundary = false;
oFF.SacTableAxisFragment.prototype.m_headerIndex = 0;
oFF.SacTableAxisFragment.prototype.m_headerLevel = 0;
oFF.SacTableAxisFragment.prototype.m_id = null;
oFF.SacTableAxisFragment.prototype.m_irRelevantOrthogonalScopedStyles = null;
oFF.SacTableAxisFragment.prototype.m_keepTogetherAfterPriority = 0;
oFF.SacTableAxisFragment.prototype.m_keepTogetherBeforePriority = 0;
oFF.SacTableAxisFragment.prototype.m_needsReIndex = false;
oFF.SacTableAxisFragment.prototype.m_owningList = null;
oFF.SacTableAxisFragment.prototype.m_parent = null;
oFF.SacTableAxisFragment.prototype.m_partOfHeaderSection = null;
oFF.SacTableAxisFragment.prototype.m_relevantMarkups = null;
oFF.SacTableAxisFragment.prototype.m_relevantOrthogonalScopedStyles = null;
oFF.SacTableAxisFragment.prototype.m_relevantRectangularStyles = null;
oFF.SacTableAxisFragment.prototype.m_scopedStyles = null;
oFF.SacTableAxisFragment.prototype.m_sectionReferenceIndex = null;
oFF.SacTableAxisFragment.prototype.m_tupleIndex = 0;
oFF.SacTableAxisFragment.prototype.addChildAfter = function(childAfter, updatedTupleList)
{
	this.m_childrenAfter.add(childAfter);
	childAfter.setParent(this);
	this.insertIntoListWithOffset(this.getOwningList(), childAfter, 1);
	this.insertIntoListWithOffset(updatedTupleList, childAfter, 1);
};
oFF.SacTableAxisFragment.prototype.addChildBefore = function(childBefore, updatedTupleList)
{
	this.m_childrenBefore.add(childBefore);
	childBefore.setParent(this);
	this.insertIntoListWithOffset(this.getOwningList(), childBefore, 0);
	this.insertIntoListWithOffset(updatedTupleList, childBefore, 0);
};
oFF.SacTableAxisFragment.prototype.addFullMatchingReference = function(tableAxisSectionReference)
{
	if (!this.m_sectionReferenceIndex.contains(tableAxisSectionReference))
	{
		this.m_sectionReferenceIndex.add(tableAxisSectionReference);
	}
};
oFF.SacTableAxisFragment.prototype.addHeaderBandTuple = function(updatedTupleList)
{
	return this.addTupleBefore(null, updatedTupleList);
};
oFF.SacTableAxisFragment.prototype.addPartOfHeaderSectionInfo = function(start, end)
{
	let sectionInfo = oFF.SacHeaderSectionInfoTag.createTag(start, end);
	this.m_partOfHeaderSection.add(sectionInfo);
	return sectionInfo;
};
oFF.SacTableAxisFragment.prototype.addScopedStyle = function(scopedStyle)
{
	this.m_scopedStyles.add(scopedStyle);
};
oFF.SacTableAxisFragment.prototype.applyHeaderHandling = function(updatedTupleList, isPageBreakStylingBoundary, runningIndex)
{
	if (this.getEffectiveMemberHeaderHandling() === oFF.SacTableMemberHeaderHandling.BAND)
	{
		let maxLevel = this.getHeaderGroupNames().size() - 1;
		if (this.isTotalsContext())
		{
			this.handleTotalsBand(maxLevel);
		}
		else
		{
			let newTuples = oFF.XList.create();
			for (let i = 0; i < maxLevel; i++)
			{
				this.prependBandTuple(newTuples, i, updatedTupleList, isPageBreakStylingBoundary, runningIndex);
			}
			this.setHeaderLevel(maxLevel);
			if (newTuples.size() > 0)
			{
				this.m_needsReIndex = true;
			}
		}
	}
	return this.m_needsReIndex;
};
oFF.SacTableAxisFragment.prototype.applyHightAndWidth = function() {};
oFF.SacTableAxisFragment.prototype.applyInsertedTuples = function(tuplesBefore, tupleConsumer)
{
	if (oFF.XCollectionUtils.hasElements(tuplesBefore))
	{
		oFF.XStream.of(tuplesBefore).forEach(tupleConsumer);
		this.markIndexShift();
	}
};
oFF.SacTableAxisFragment.prototype.applyRectangularStyles = function()
{
	this.clearRectangularMarkups();
	this.m_relevantRectangularStyles = oFF.XStream.of(this.getParentTable().getLayeredRectangularStyles()).filter(this.geRectangularStyleMatchPredicate()).collect(oFF.XStreamCollector.toList());
};
oFF.SacTableAxisFragment.prototype.applyTableMarkups = function(updatedTupleList)
{
	let beforeAdder = (tupleDescription1) => {
		this.addTupleBefore(tupleDescription1, updatedTupleList);
	};
	let afterAdder = (tupleDescription2) => {
		this.addTupleAfter(tupleDescription2, updatedTupleList);
	};
	oFF.XStream.of(this.m_relevantMarkups).forEach((markup) => {
		this.applyInsertedTuples(markup.getTuplesBefore(), beforeAdder);
		this.applyInsertedTuples(markup.getTuplesAfter(), afterAdder);
	});
	if (this.isEffectivelyHidden())
	{
		if (oFF.notNull(updatedTupleList))
		{
			updatedTupleList.removeElement(this);
		}
		this.removeSingle();
		this.markIndexShift();
	}
	this.applyHightAndWidth();
	return this.m_needsReIndex;
};
oFF.SacTableAxisFragment.prototype.checkOrthogonalScopedStyle = function(style)
{
	let result;
	if (this.m_relevantOrthogonalScopedStyles.contains(style))
	{
		result = true;
	}
	else if (this.m_irRelevantOrthogonalScopedStyles.contains(style))
	{
		result = false;
	}
	else
	{
		result = this.matchesOrthogonal(style);
		if (result)
		{
			this.m_relevantOrthogonalScopedStyles.add(style);
		}
		else
		{
			this.m_irRelevantOrthogonalScopedStyles.add(style);
		}
	}
	return result;
};
oFF.SacTableAxisFragment.prototype.clearRectangularMarkups = function()
{
	this.m_relevantRectangularStyles = oFF.XObjectExt.release(this.m_relevantRectangularStyles);
};
oFF.SacTableAxisFragment.prototype.clearScopedStyles = function()
{
	this.m_scopedStyles.clear();
};
oFF.SacTableAxisFragment.prototype.clearTableMarkups = function()
{
	this.m_relevantMarkups = oFF.XObjectExt.release(this.m_relevantMarkups);
	this.m_relevantOrthogonalScopedStyles = oFF.XObjectExt.release(this.m_relevantOrthogonalScopedStyles);
	this.m_irRelevantOrthogonalScopedStyles = oFF.XObjectExt.release(this.m_irRelevantOrthogonalScopedStyles);
};
oFF.SacTableAxisFragment.prototype.ensureTableMarkups = function(createIfMissing)
{
	if (createIfMissing && oFF.isNull(this.m_relevantMarkups))
	{
		this.indexTableMarkups();
	}
};
oFF.SacTableAxisFragment.prototype.getBreakAfterPriority = function()
{
	this.ensureTableMarkups(true);
	return this.m_breakAfterPriority;
};
oFF.SacTableAxisFragment.prototype.getBreakBeforePriority = function()
{
	this.ensureTableMarkups(true);
	return this.m_breakBeforePriority;
};
oFF.SacTableAxisFragment.prototype.getBreakPriority = function(parentTableMarkups, matchPredicate, comparator)
{
	let list = oFF.XStream.of(parentTableMarkups).filter(matchPredicate).sorted(comparator).collect(oFF.XStreamCollector.toList());
	return oFF.XCollectionUtils.hasElements(list) ? list.get(0).getPriority() : -2;
};
oFF.SacTableAxisFragment.prototype.getComponentIndex = function()
{
	return this.m_componentIndex;
};
oFF.SacTableAxisFragment.prototype.getDataIndex = function()
{
	return this.m_dataIndex;
};
oFF.SacTableAxisFragment.prototype.getDataList = function()
{
	return this.getParentBundle().getDataList();
};
oFF.SacTableAxisFragment.prototype.getDataPath = function()
{
	return this.m_dataPath;
};
oFF.SacTableAxisFragment.prototype.getDataReferenceTags = function()
{
	let result;
	if (!oFF.XCollectionUtils.hasElements(this.m_dataSectionTags) && this.getParent() !== null)
	{
		result = this.getParent().getDataReferenceTags();
	}
	else
	{
		result = this.m_dataSectionTags;
	}
	return result;
};
oFF.SacTableAxisFragment.prototype.getDataSectionTags = function(element)
{
	return this.m_dataSectionTags.getByKey(element);
};
oFF.SacTableAxisFragment.prototype.getDataSiblingAt = function(index)
{
	return oFF.SacTableAxisFragment.getSiblingGraceful(this.getDataList(), index - this.getParentBundle().getDataStartIndex());
};
oFF.SacTableAxisFragment.prototype.getDataSize = function()
{
	return this.getParentBundle().getDataList().size() + this.getParentBundle().getDataStartIndex();
};
oFF.SacTableAxisFragment.prototype.getDataTupleRange = function(startHeader, endHeader)
{
	return this.getElementRange(startHeader, endHeader, (x) => {
		return oFF.XIntegerValue.create(x.getTupleIndex());
	}, (a) => {
		return this.getDataSiblingAt(a.getInteger());
	});
};
oFF.SacTableAxisFragment.prototype.getDisplaysizeIncludingChildren = function()
{
	return this.getDisplaysize() + oFF.XStream.of(this.m_childrenBefore).map((cb) => {
		return oFF.XIntegerValue.create(cb.getDisplaysize());
	}).reduce(oFF.XIntegerValue.create(0), (ba, bb) => {
		return oFF.XIntegerValue.create(ba.getInteger() + bb.getInteger());
	}).getInteger() + oFF.XStream.of(this.m_childrenAfter).map((ca) => {
		return oFF.XIntegerValue.create(ca.getDisplaysize());
	}).reduce(oFF.XIntegerValue.create(0), (aa, ab) => {
		return oFF.XIntegerValue.create(aa.getInteger() + ab.getInteger());
	}).getInteger();
};
oFF.SacTableAxisFragment.prototype.getEffectiveMemberHeaderHandling = function()
{
	let headerHandling = this.getTableMemberHeaderHandling();
	if (oFF.isNull(headerHandling))
	{
		headerHandling = this.getParentTable().getTableMemberHeaderHandling();
	}
	return headerHandling;
};
oFF.SacTableAxisFragment.prototype.getElementRange = function(start, end, indexGetter, siblingGetter)
{
	let startElement = siblingGetter(oFF.XIntegerValue.create(start));
	let currentStartIndex = start;
	while (currentStartIndex <= end && oFF.isNull(startElement))
	{
		currentStartIndex++;
		startElement = siblingGetter(oFF.XIntegerValue.create(currentStartIndex));
	}
	let endElement = siblingGetter(oFF.XIntegerValue.create(end));
	let currentEndIndex = end;
	while (currentEndIndex >= currentStartIndex && oFF.isNull(endElement))
	{
		currentEndIndex--;
		endElement = siblingGetter(oFF.XIntegerValue.create(currentEndIndex));
	}
	let startRange = start;
	if (oFF.notNull(startElement))
	{
		startRange = indexGetter(startElement).getInteger() + start - currentStartIndex;
	}
	let endRange = end;
	if (oFF.notNull(endElement))
	{
		endRange = indexGetter(endElement).getInteger() + end - currentEndIndex;
	}
	return oFF.XPair.create(oFF.XIntegerValue.create(startRange), oFF.XIntegerValue.create(endRange));
};
oFF.SacTableAxisFragment.prototype.getFullIndex = function()
{
	let headerIndex = this.m_headerIndex;
	return headerIndex === -1 ? this.getHeadersSize() + this.m_dataIndex : headerIndex;
};
oFF.SacTableAxisFragment.prototype.getFullSemanticIndex = function()
{
	let headerIndex = this.m_componentIndex;
	return headerIndex === -1 ? this.getHeaderComponentsSize() + this.m_tupleIndex : headerIndex;
};
oFF.SacTableAxisFragment.prototype.getFullSemanticSize = function()
{
	return this.getHeaderComponentsSize() + this.getTupleSize();
};
oFF.SacTableAxisFragment.prototype.getFullSize = function()
{
	return this.getHeadersSize() + this.getDataSize();
};
oFF.SacTableAxisFragment.prototype.getGroupLevelIndex = function()
{
	let result;
	if (!oFF.XCollectionUtils.hasElements(this.m_dataSectionGroupLevelIndex) && this.getParent() !== null)
	{
		result = this.getParent().getGroupLevelIndex();
	}
	else
	{
		result = this.m_dataSectionGroupLevelIndex;
	}
	return result;
};
oFF.SacTableAxisFragment.prototype.getHeaderComponentRange = function(startHeader, endHeader)
{
	return this.getElementRange(startHeader, endHeader, (x) => {
		return oFF.XIntegerValue.create(x.getComponentIndex());
	}, (a) => {
		return this.getHeaderSiblingAt(a.getInteger());
	});
};
oFF.SacTableAxisFragment.prototype.getHeaderComponentsSize = function()
{
	let hl = this.getParentBundle().getHeaderList();
	return oFF.XCollectionUtils.hasElements(hl) ? hl.get(hl.size() - 1).getRootComponentIndex() + 1 : 0;
};
oFF.SacTableAxisFragment.prototype.getHeaderFieldSize = function()
{
	return this.getParentBundle().getHeaderEndIndex() + 1;
};
oFF.SacTableAxisFragment.prototype.getHeaderGroupMap = function()
{
	return this.getParentBundle().getHeaderMap();
};
oFF.SacTableAxisFragment.prototype.getHeaderGroupNames = function()
{
	return this.getParentBundle().getHeaderGroupNames();
};
oFF.SacTableAxisFragment.prototype.getHeaderIndex = function()
{
	return this.m_headerIndex;
};
oFF.SacTableAxisFragment.prototype.getHeaderLevel = function()
{
	return this.m_headerLevel;
};
oFF.SacTableAxisFragment.prototype.getHeaderList = function()
{
	return this.getParentBundle().getHeaderList();
};
oFF.SacTableAxisFragment.prototype.getHeaderSiblingAt = function(index)
{
	return oFF.SacTableAxisFragment.getSiblingGraceful(this.getHeaderList(), index);
};
oFF.SacTableAxisFragment.prototype.getHeadersSize = function()
{
	return this.getParentBundle().getHeaderList().size();
};
oFF.SacTableAxisFragment.prototype.getId = function()
{
	return this.m_id;
};
oFF.SacTableAxisFragment.prototype.getKeepTogetherAfterPriority = function()
{
	this.ensureTableMarkups(true);
	return this.m_keepTogetherAfterPriority;
};
oFF.SacTableAxisFragment.prototype.getKeepTogetherBeforePriority = function()
{
	this.ensureTableMarkups(true);
	return this.m_keepTogetherBeforePriority;
};
oFF.SacTableAxisFragment.prototype.getMatchingOrthogonalStyles = function(tableMarkup)
{
	return this.getMatchingStyles(tableMarkup.getScopedStyles());
};
oFF.SacTableAxisFragment.prototype.getMatchingRectangularStyles = function(createIfMissing)
{
	if (createIfMissing && oFF.isNull(this.m_relevantRectangularStyles))
	{
		this.applyRectangularStyles();
	}
	return this.m_relevantRectangularStyles;
};
oFF.SacTableAxisFragment.prototype.getMatchingStyles = function(scopedStyles)
{
	if (oFF.isNull(this.m_relevantOrthogonalScopedStyles))
	{
		this.m_relevantOrthogonalScopedStyles = oFF.XList.create();
	}
	if (oFF.isNull(this.m_irRelevantOrthogonalScopedStyles))
	{
		this.m_irRelevantOrthogonalScopedStyles = oFF.XList.create();
	}
	return oFF.XStream.of(scopedStyles).filterNullValues().filter((style) => {
		return this.checkOrthogonalScopedStyle(style);
	}).map((scs) => {
		return scs.getStyle();
	}).collect(oFF.XStreamCollector.toList());
};
oFF.SacTableAxisFragment.prototype.getMatchingTableMarkups = function(createIfMissing)
{
	this.ensureTableMarkups(createIfMissing);
	return this.m_relevantMarkups;
};
oFF.SacTableAxisFragment.prototype.getOwningList = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_owningList);
};
oFF.SacTableAxisFragment.prototype.getParent = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_parent);
};
oFF.SacTableAxisFragment.prototype.getParentBundle = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_bundle);
};
oFF.SacTableAxisFragment.prototype.getParentTable = function()
{
	return this.getParentBundle().getParent();
};
oFF.SacTableAxisFragment.prototype.getPartOfHeaderSectionInfos = function()
{
	return this.m_partOfHeaderSection;
};
oFF.SacTableAxisFragment.prototype.getRootComponentIndex = function()
{
	let rootComponentIndex = -1;
	if (this.m_componentIndex > -1)
	{
		rootComponentIndex = this.m_componentIndex;
	}
	else if (this.getParent() !== null)
	{
		rootComponentIndex = this.getParent().getRootComponentIndex();
	}
	return rootComponentIndex;
};
oFF.SacTableAxisFragment.prototype.getRootTupleIndex = function()
{
	let rootTupleIndex = -1;
	if (this.m_tupleIndex > -1)
	{
		rootTupleIndex = this.m_tupleIndex;
	}
	else if (this.getParent() !== null)
	{
		rootTupleIndex = this.getParent().getRootTupleIndex();
	}
	return rootTupleIndex;
};
oFF.SacTableAxisFragment.prototype.getSacTableProxy = function()
{
	return this.getParentTable().getSacTableProxy();
};
oFF.SacTableAxisFragment.prototype.getScopedStyles = function()
{
	return this.m_scopedStyles;
};
oFF.SacTableAxisFragment.prototype.getStylePriority = function()
{
	return 7;
};
oFF.SacTableAxisFragment.prototype.getTableMarkupBreakAfterPredicate = function()
{
	return (tm) => {
		return tm.getPageBreakHandling().isBreakAfter() && this.matchesPageBreakInfo(this.getMatchScope(tm), oFF.TriStateBool._DEFAULT, oFF.TriStateBool._TRUE);
	};
};
oFF.SacTableAxisFragment.prototype.getTableMarkupBreakBeforePredicate = function()
{
	return (tm) => {
		return tm.getPageBreakHandling().isBreakBefore() && this.matchesPageBreakInfo(this.getMatchScope(tm), oFF.TriStateBool._TRUE, oFF.TriStateBool._DEFAULT);
	};
};
oFF.SacTableAxisFragment.prototype.getTableMarkupKeepTogetherAfterPredicate = function()
{
	return (tm) => {
		return tm.getPageBreakHandling().isKeepTogether() && this.matchesPageBreakInfo(this.getMatchScope(tm), oFF.TriStateBool._DEFAULT, oFF.TriStateBool._FALSE);
	};
};
oFF.SacTableAxisFragment.prototype.getTableMarkupKeepTogetherBeforePredicate = function()
{
	return (tm) => {
		return tm.getPageBreakHandling().isKeepTogether() && this.matchesPageBreakInfo(this.getMatchScope(tm), oFF.TriStateBool._FALSE, oFF.TriStateBool._DEFAULT);
	};
};
oFF.SacTableAxisFragment.prototype.getTableMarkupMatchPredicate = function()
{
	return (tm) => {
		return this.matchesSacTableSectionInfo(this.getMatchScope(tm));
	};
};
oFF.SacTableAxisFragment.prototype.getTableMemberHeaderHandling = function()
{
	return this.getParentBundle().getMemberHeaderHandling();
};
oFF.SacTableAxisFragment.prototype.getTupleIndex = function()
{
	return this.m_tupleIndex;
};
oFF.SacTableAxisFragment.prototype.getTupleSize = function()
{
	return this.getParentBundle().getTuples().size() + this.getParentBundle().getTupleStartIndex();
};
oFF.SacTableAxisFragment.prototype.handleTotalsBand = function(maxLevel) {};
oFF.SacTableAxisFragment.prototype.indexTableMarkups = function()
{
	let parentTableMarkups = this.getParentTable().getTableMarkups();
	let comparator = oFF.SacTableMarkupComparator.getInstance();
	this.m_relevantMarkups = oFF.XStream.of(parentTableMarkups).filter(this.getTableMarkupMatchPredicate()).sorted(comparator).collect(oFF.XStreamCollector.toList());
	this.setBreakAfterPriority(this.getBreakPriority(parentTableMarkups, this.getTableMarkupBreakAfterPredicate(), comparator));
	this.setBreakBeforePriority(this.getBreakPriority(parentTableMarkups, this.getTableMarkupBreakBeforePredicate(), comparator));
	this.setKeepTogetherBeforePriority(this.getBreakPriority(parentTableMarkups, this.getTableMarkupKeepTogetherBeforePredicate(), comparator));
	this.setKeepTogetherAfterPriority(this.getBreakPriority(parentTableMarkups, this.getTableMarkupKeepTogetherAfterPredicate(), comparator));
};
oFF.SacTableAxisFragment.prototype.insertIntoListWithOffset = function(owningList, child, offset)
{
	if (oFF.notNull(owningList))
	{
		let index = owningList.getIndex(this);
		if (index > -1)
		{
			owningList.insert(index + offset, child);
		}
	}
};
oFF.SacTableAxisFragment.prototype.isEffectivelyHidden = function()
{
	return this.isHiddenByMarkup();
};
oFF.SacTableAxisFragment.prototype.isFullMatching = function(tableAxisSectionReference)
{
	return this.m_sectionReferenceIndex.contains(tableAxisSectionReference) || this.getParent() !== null && this.getParent().isFullMatching(tableAxisSectionReference);
};
oFF.SacTableAxisFragment.prototype.isHeader = function()
{
	return this.m_header;
};
oFF.SacTableAxisFragment.prototype.isHeaderBand = function()
{
	return this.m_headerBand;
};
oFF.SacTableAxisFragment.prototype.isHeaderBoundary = function()
{
	return this.m_headerBoundary;
};
oFF.SacTableAxisFragment.prototype.isHiddenByMarkup = function()
{
	return oFF.XStream.of(this.m_relevantMarkups).anyMatch((rm) => {
		return rm.isHide();
	});
};
oFF.SacTableAxisFragment.prototype.markIndexShift = function()
{
	this.setNeedsReIndex();
	this.getParentBundle().setInsertOrHidePresent(true);
};
oFF.SacTableAxisFragment.prototype.matchesDataPathTag = function(infoTag, reference, groupLevelFilter)
{
	return oFF.XStream.of(this.getDataReferenceTags().getByKey(reference)).filter(groupLevelFilter).anyMatch((subElement) => {
		return subElement.matchesSibling(infoTag);
	});
};
oFF.SacTableAxisFragment.prototype.matchesElementForGroupLevel = function(element, groupLevel)
{
	let refGroupLevel = this.getGroupLevelIndex().getByKey(element);
	return oFF.notNull(refGroupLevel) && refGroupLevel.getInteger() === groupLevel || this.getParent() !== null && this.getParent().matchesElementForGroupLevel(element, groupLevel);
};
oFF.SacTableAxisFragment.prototype.matchesPageBreakInfo = function(tableAxisSectionReference, first, last)
{
	let matching = false;
	if (oFF.XCollectionUtils.hasElements(this.m_dataPath.getPathElements()))
	{
		let referencePaths = tableAxisSectionReference.getDataPaths();
		let startData2 = this.getDataSize();
		let endData2 = -1;
		let dataSize = this.getDataSize();
		for (let i = 0; i < referencePaths.size(); i++)
		{
			let element = referencePaths.get(i);
			let maxGroupLevel = element.getMaxHeaderGroupLevel(this.getHeaderGroupNames(), this.getHeaderGroupMap());
			let groupLevelFilter = (pe) => {
				let peGl = pe.getGroupLevel();
				if (peGl <= maxGroupLevel && pe.isExactSectionLevel() && peGl > -2)
				{
					let peR = element.getMatchingInfoReferenceForGroupLevel(pe);
					return oFF.isNull(peR) || pe.matches(peR);
				}
				else
				{
					return false;
				}
			};
			if (this.matchesElementForGroupLevel(element, maxGroupLevel))
			{
				let dataTags = this.getDataSectionTags(element);
				startData2 = oFF.XMath.min(startData2, this.searchBackDataReference(this.m_dataIndex, dataSize, maxGroupLevel, element, dataTags, groupLevelFilter));
				endData2 = oFF.XMath.max(endData2, this.searchForwardDataReference(this.m_dataIndex, dataSize, maxGroupLevel, element, dataTags, groupLevelFilter));
			}
		}
		matching = startData2 <= endData2 && (!oFF.TriStateBool.isExplicitBooleanValue(first) || first === oFF.TriStateBool._TRUE && startData2 === this.m_dataIndex || first === oFF.TriStateBool._FALSE && startData2 !== this.m_dataIndex) && (!oFF.TriStateBool.isExplicitBooleanValue(last) || last === oFF.TriStateBool._TRUE && endData2 === this.m_dataIndex || last === oFF.TriStateBool._FALSE && endData2 !== this.m_dataIndex);
	}
	return matching;
};
oFF.SacTableAxisFragment.prototype.matchesSacTableSectionInfo = function(tableAxisSectionReference)
{
	let headerSize = this.getHeadersSize();
	let headerFieldSize = this.getHeaderFieldSize();
	let dataSize = this.getDataSize();
	let matching = false;
	let matchModulo = tableAxisSectionReference.getMatchModulo();
	let neverMatch = matchModulo === -2;
	let matchRegardlessOfPosition = (matchModulo === 0 || matchModulo === 1) && tableAxisSectionReference.getMatchSkipFirst() === 0 && tableAxisSectionReference.getMatchSkipLast() === 0;
	if (!neverMatch && this.isFullMatching(tableAxisSectionReference))
	{
		matching = true;
	}
	else if (!neverMatch && tableAxisSectionReference.isMatchFullHeaderSection() && tableAxisSectionReference.isMatchFullDataSection())
	{
		matching = tableAxisSectionReference.matchesPosition(this.getFullIndex(), this.getFullSize(), this.getFullSemanticIndex(), this.getFullSemanticSize());
	}
	else if (!neverMatch && tableAxisSectionReference.isMatchFullHeaderSection() && oFF.XCollectionUtils.hasElements(this.m_partOfHeaderSection))
	{
		matching = tableAxisSectionReference.matchesPosition(this.m_headerIndex, this.getHeadersSize(), this.m_componentIndex, this.getHeaderComponentsSize());
	}
	else if (!neverMatch && tableAxisSectionReference.isMatchFullDataSection() && oFF.XCollectionUtils.hasElements(this.m_dataPath.getPathElements()))
	{
		matching = tableAxisSectionReference.matchesPosition(this.m_dataIndex, this.getDataSize(), this.m_tupleIndex, this.getTupleSize());
	}
	if (!neverMatch && !matching && tableAxisSectionReference.isMatchHeaderSectionStart() && this.m_headerIndex === 0)
	{
		matching = true;
	}
	if (!neverMatch && !matching && this.m_headerIndex > -1 && tableAxisSectionReference.isMatchHeaderFieldsSectionEnd() && this.m_headerIndex === headerFieldSize - 1)
	{
		matching = true;
	}
	if (!neverMatch && !matching && this.m_headerIndex > -1 && tableAxisSectionReference.isMatchHeaderSectionEnd() && this.m_headerIndex === headerSize - 1)
	{
		matching = true;
	}
	if (!neverMatch && !matching && tableAxisSectionReference.isMatchDataSectionStart() && this.m_dataIndex === 0)
	{
		matching = true;
	}
	if (!neverMatch && !matching && this.m_dataIndex > -1 && tableAxisSectionReference.isMatchDataSectionEnd() && this.m_dataIndex === dataSize - 1)
	{
		matching = true;
	}
	if (!neverMatch && !matching && oFF.XCollectionUtils.hasElements(this.m_partOfHeaderSection))
	{
		matching = oFF.XStream.of(this.m_partOfHeaderSection).filter((poh) => {
			return poh.matchesSectionReference(tableAxisSectionReference);
		}).anyMatch((ppoohh) => {
			let subResultHeader = matchRegardlessOfPosition;
			if (!subResultHeader)
			{
				let startHeader1 = this.searchBackHeaderReference(ppoohh, this.m_headerIndex);
				let endHeader1 = this.searchForwardHeaderReference(ppoohh, this.m_headerIndex, headerSize);
				let compRange1 = this.getHeaderComponentRange(startHeader1, endHeader1);
				let headerLocalIndex = this.m_headerIndex - startHeader1;
				let headerLocalSize = endHeader1 - startHeader1 + 1;
				let componentLocalIndex = this.m_componentIndex - compRange1.getFirstObject().getInteger();
				let componentLocalSize = compRange1.getSecondObject().getInteger() - compRange1.getFirstObject().getInteger() + 1;
				subResultHeader = tableAxisSectionReference.matchesPosition(headerLocalIndex, headerLocalSize, componentLocalIndex, componentLocalSize);
			}
			return subResultHeader;
		});
	}
	if (!neverMatch && !matching && oFF.XCollectionUtils.hasElements(this.m_dataPath.getPathElements()))
	{
		let referencePaths = tableAxisSectionReference.getDataPaths();
		let startData2 = dataSize;
		let endData2 = -1;
		for (let i = 0; i < referencePaths.size(); i++)
		{
			let element = referencePaths.get(i);
			let maxGroupLevel = element.getMaxHeaderGroupLevel(this.getHeaderGroupNames(), this.getHeaderGroupMap());
			let groupLevelFilter = (pe) => {
				let peGl = pe.getGroupLevel();
				if (peGl <= maxGroupLevel && pe.isExactSectionLevel() && peGl > -2)
				{
					let peR = element.getMatchingInfoReferenceForGroupLevel(pe);
					return oFF.isNull(peR) || pe.matches(peR);
				}
				else
				{
					return false;
				}
			};
			if (this.matchesElementForGroupLevel(element, maxGroupLevel))
			{
				if (matchRegardlessOfPosition)
				{
					matching = true;
					break;
				}
				let dataTags = this.getDataSectionTags(element);
				startData2 = oFF.XMath.min(startData2, this.searchBackDataReference(this.m_dataIndex, dataSize, maxGroupLevel, element, dataTags, groupLevelFilter));
				endData2 = oFF.XMath.max(endData2, this.searchForwardDataReference(this.m_dataIndex, dataSize, maxGroupLevel, element, dataTags, groupLevelFilter));
			}
		}
		if (!matching)
		{
			let tupleRange1 = this.getDataTupleRange(startData2, endData2);
			let dataLocalIndex = this.m_dataIndex - startData2;
			let dataLocalSize = endData2 - startData2 + 1;
			let tupleLocalIndex = this.m_tupleIndex - tupleRange1.getFirstObject().getInteger();
			let tupleLocalSize = tupleRange1.getSecondObject().getInteger() - tupleRange1.getFirstObject().getInteger() + 1;
			matching = startData2 <= endData2 && tableAxisSectionReference.matchesPosition(dataLocalIndex, dataLocalSize, tupleLocalIndex, tupleLocalSize);
		}
	}
	return matching;
};
oFF.SacTableAxisFragment.prototype.matchesUntaggedReference = function(tableAxisSectionReference)
{
	let headerSize = this.getHeadersSize();
	let headerFieldSize = this.getHeaderFieldSize();
	let dataSize = this.getDataSize();
	let matching = false;
	let matchModulo = tableAxisSectionReference.getMatchModulo();
	let neverMatch = matchModulo === -2;
	let matchRegardlessOfPosition = (matchModulo === 0 || matchModulo === 1) && tableAxisSectionReference.getMatchSkipFirst() === 0 && tableAxisSectionReference.getMatchSkipLast() === 0;
	if (!neverMatch && tableAxisSectionReference.isMatchFullHeaderSection() && tableAxisSectionReference.isMatchFullDataSection())
	{
		matching = tableAxisSectionReference.matchesPosition(this.getFullIndex(), this.getFullSize(), this.getFullSemanticIndex(), this.getFullSemanticSize());
	}
	else if (!neverMatch && tableAxisSectionReference.isMatchFullHeaderSection() && oFF.XCollectionUtils.hasElements(this.m_partOfHeaderSection))
	{
		matching = tableAxisSectionReference.matchesPosition(this.m_headerIndex, this.getHeadersSize(), this.m_componentIndex, this.getHeaderComponentsSize());
	}
	else if (!neverMatch && tableAxisSectionReference.isMatchFullDataSection() && oFF.XCollectionUtils.hasElements(this.m_dataPath.getPathElements()))
	{
		matching = tableAxisSectionReference.matchesPosition(this.m_dataIndex, this.getDataSize(), this.m_tupleIndex, this.getTupleSize());
	}
	if (!neverMatch && !matching && tableAxisSectionReference.isMatchHeaderSectionStart() && this.m_headerIndex === 0)
	{
		matching = true;
	}
	if (!neverMatch && !matching && this.m_headerIndex > -1 && tableAxisSectionReference.isMatchHeaderFieldsSectionEnd() && this.m_headerIndex === headerFieldSize - 1)
	{
		matching = true;
	}
	if (!neverMatch && !matching && this.m_headerIndex > -1 && tableAxisSectionReference.isMatchHeaderSectionEnd() && this.m_headerIndex === headerSize - 1)
	{
		matching = true;
	}
	if (!neverMatch && !matching && tableAxisSectionReference.isMatchDataSectionStart() && this.m_dataIndex === 0)
	{
		matching = true;
	}
	if (!neverMatch && !matching && this.m_dataIndex > -1 && tableAxisSectionReference.isMatchDataSectionEnd() && this.m_dataIndex === dataSize - 1)
	{
		matching = true;
	}
	if (!neverMatch && !matching && oFF.XCollectionUtils.hasElements(this.m_partOfHeaderSection))
	{
		matching = oFF.XStream.of(this.m_partOfHeaderSection).filter((poh) => {
			return poh.matchesSectionReference(tableAxisSectionReference);
		}).anyMatch((ppoohh) => {
			let subResultHeader = matchRegardlessOfPosition;
			if (!subResultHeader)
			{
				let startHeader1 = this.searchBackHeaderReference(ppoohh, this.m_headerIndex);
				let endHeader1 = this.searchForwardHeaderReference(ppoohh, this.m_headerIndex, headerSize);
				let compRange1 = this.getHeaderComponentRange(startHeader1, endHeader1);
				let headerLocalIndex = this.m_headerIndex - startHeader1;
				let headerLocalSize = endHeader1 - startHeader1 + 1;
				let componentLocalIndex = this.m_componentIndex - compRange1.getFirstObject().getInteger();
				let componentLocalSize = compRange1.getSecondObject().getInteger() - compRange1.getFirstObject().getInteger() + 1;
				subResultHeader = tableAxisSectionReference.matchesPosition(headerLocalIndex, headerLocalSize, componentLocalIndex, componentLocalSize);
			}
			return subResultHeader;
		});
	}
	if (!neverMatch && !matching && oFF.XCollectionUtils.hasElements(this.m_dataPath.getPathElements()))
	{
		let referencePaths = tableAxisSectionReference.getDataPaths();
		let startData2 = dataSize;
		let endData2 = -1;
		for (let i = 0; i < referencePaths.size(); i++)
		{
			let element = referencePaths.get(i);
			let maxGroupLevel = element.getMaxHeaderGroupLevel(this.getHeaderGroupNames(), this.getHeaderGroupMap());
			if (this.m_dataPath.matches(element, maxGroupLevel))
			{
				if (matchRegardlessOfPosition)
				{
					matching = true;
					break;
				}
				startData2 = oFF.XMath.min(startData2, this.searchBackDataReferenceWithoutTagging(this.m_dataPath, this.m_dataIndex, dataSize, maxGroupLevel, element));
				endData2 = oFF.XMath.max(endData2, this.searchForwardDataReferenceWithoutTagging(this.m_dataPath, this.m_dataIndex, dataSize, maxGroupLevel, element));
			}
		}
		if (!matching)
		{
			let tupleRange1 = this.getDataTupleRange(startData2, endData2);
			let dataLocalIndex = this.m_dataIndex - startData2;
			let dataLocalSize = endData2 - startData2 + 1;
			let tupleLocalIndex = this.m_tupleIndex - tupleRange1.getFirstObject().getInteger();
			let tupleLocalSize = tupleRange1.getSecondObject().getInteger() - tupleRange1.getFirstObject().getInteger() + 1;
			matching = startData2 <= endData2 && tableAxisSectionReference.matchesPosition(dataLocalIndex, dataLocalSize, tupleLocalIndex, tupleLocalSize);
		}
	}
	return matching;
};
oFF.SacTableAxisFragment.prototype.preIndexTableMarkups = function()
{
	oFF.XCollectionUtils.forEach(this.getParentTable().getTableMarkups(), (tm) => {
		this.preTagReferences(this.getMarkupScope(tm));
		oFF.XCollectionUtils.forEach(tm.getScopedStyles(), (sc) => {
			this.preTagReferences(this.getOrthogonalStyleScope(sc));
		});
	});
	oFF.XCollectionUtils.forEach(this.getParentTable().getLayeredRectangularStyles(), (rs) => {
		this.preTagReferences(this.getRectangularStyleScope(rs));
	});
};
oFF.SacTableAxisFragment.prototype.preTagReferences = function(tableAxisSectionReference)
{
	let matching = false;
	let matchModulo = tableAxisSectionReference.getMatchModulo();
	let neverMatch = matchModulo === -2;
	let matchRegardlessOfPosition = (matchModulo === 0 || matchModulo === 1) && tableAxisSectionReference.getMatchSkipFirst() === 0 && tableAxisSectionReference.getMatchSkipLast() === 0;
	if (!neverMatch && matchRegardlessOfPosition)
	{
		if (tableAxisSectionReference.isMatchFullHeaderSection() && tableAxisSectionReference.isMatchFullDataSection())
		{
			matching = true;
		}
		else if (tableAxisSectionReference.isMatchFullHeaderSection() && oFF.XCollectionUtils.hasElements(this.m_partOfHeaderSection))
		{
			matching = true;
		}
		else if (tableAxisSectionReference.isMatchFullDataSection() && oFF.XCollectionUtils.hasElements(this.m_dataPath.getPathElements()))
		{
			matching = true;
		}
	}
	let i;
	if (!neverMatch && !matching && oFF.XCollectionUtils.hasElements(this.m_partOfHeaderSection))
	{
		for (i = 0; i < this.m_partOfHeaderSection.size(); i++)
		{
			let poh = this.m_partOfHeaderSection.get(i);
			if (poh.matchesSectionReference(tableAxisSectionReference))
			{
				if (matchRegardlessOfPosition)
				{
					matching = true;
				}
			}
		}
	}
	if (!neverMatch && !matching && oFF.XCollectionUtils.hasElements(this.m_dataPath.getPathElements()))
	{
		let referencePaths = tableAxisSectionReference.getDataPaths();
		for (i = 0; i < referencePaths.size(); i++)
		{
			let element = referencePaths.get(i);
			let maxGroupLevel = element.getMaxHeaderGroupLevel(this.getHeaderGroupNames(), this.getHeaderGroupMap());
			if (this.m_dataPath.matches(element, maxGroupLevel))
			{
				if (matchRegardlessOfPosition)
				{
					matching = true;
				}
				if (this.m_dataPath.containsLevel(maxGroupLevel) && this.m_dataPath.matchesTag(this.m_dataPath, maxGroupLevel, element))
				{
					this.putElementForGroupLevel(element, maxGroupLevel);
				}
			}
		}
	}
	if (matching)
	{
		this.addFullMatchingReference(tableAxisSectionReference);
	}
};
oFF.SacTableAxisFragment.prototype.prependBandTuple = function(newTuples, maxLevel, updatedTupleList, isPageBreakStylingBoundary, runningIndex) {};
oFF.SacTableAxisFragment.prototype.putElementForGroupLevel = function(element, maxGroupLevel)
{
	this.m_dataSectionGroupLevelIndex.put(element, oFF.XIntegerValue.create(maxGroupLevel));
	this.m_dataSectionTags.put(element, this.m_dataPath.getMatchingTags(maxGroupLevel, element));
};
oFF.SacTableAxisFragment.prototype.releaseObject = function()
{
	this.m_bundle = null;
	this.m_id = null;
	this.m_header = false;
	this.m_partOfHeaderSection = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_partOfHeaderSection);
	this.m_dataPath = oFF.XObjectExt.release(this.m_dataPath);
	this.m_relevantMarkups = oFF.XObjectExt.release(this.m_relevantMarkups);
	this.m_breakBeforePriority = -2;
	this.m_breakAfterPriority = -2;
	this.m_keepTogetherBeforePriority = -2;
	this.m_keepTogetherAfterPriority = -2;
	this.m_relevantRectangularStyles = oFF.XObjectExt.release(this.m_relevantRectangularStyles);
	this.m_relevantOrthogonalScopedStyles = oFF.XObjectExt.release(this.m_relevantOrthogonalScopedStyles);
	this.m_irRelevantOrthogonalScopedStyles = oFF.XObjectExt.release(this.m_irRelevantOrthogonalScopedStyles);
	this.m_scopedStyles = oFF.XObjectExt.release(this.m_scopedStyles);
	this.m_headerIndex = -1;
	this.m_dataIndex = -1;
	this.m_headerLevel = -1;
	this.m_childrenBefore = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_childrenBefore);
	this.m_childrenAfter = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_childrenAfter);
	this.m_dataSectionGroupLevelIndex = oFF.XObjectExt.release(this.m_dataSectionGroupLevelIndex);
	this.m_sectionReferenceIndex = oFF.XObjectExt.release(this.m_sectionReferenceIndex);
	this.m_dataSectionTags = oFF.XObjectExt.release(this.m_dataSectionTags);
	oFF.SacTableFormattableElement.prototype.releaseObject.call( this );
};
oFF.SacTableAxisFragment.prototype.remove = function()
{
	this.removePreviousChildren();
	this.removeSubsequentChildren();
	this.removeSingle();
};
oFF.SacTableAxisFragment.prototype.removePreviousChildren = function()
{
	oFF.XCollectionUtils.forEach(this.m_childrenAfter, (ca) => {
		ca.remove();
	});
	this.m_childrenBefore.clear();
};
oFF.SacTableAxisFragment.prototype.removeSingle = function()
{
	this.getOwningList().removeElement(this);
};
oFF.SacTableAxisFragment.prototype.removeSubsequentChildren = function()
{
	oFF.XCollectionUtils.forEach(this.m_childrenBefore, (cb) => {
		cb.remove();
	});
	this.m_childrenAfter.clear();
};
oFF.SacTableAxisFragment.prototype.searchBackDataReference = function(index, size, groupLevel, reference, infoTags, groupLevelFilter)
{
	let result;
	if (this.m_dataPath.containsLevel(groupLevel) && oFF.XCollectionUtils.hasElements(infoTags) && oFF.XStream.of(infoTags).allMatch((it) => {
		return this.matchesDataPathTag(it, reference, groupLevelFilter);
	}))
	{
		if (index === 0)
		{
			result = index;
		}
		else
		{
			let sibling = this.getDataSiblingAt(index - 1);
			if (oFF.isNull(sibling))
			{
				return oFF.XMath.max(index - 1, 0);
			}
			else
			{
				result = sibling.searchBackDataReference(index - 1, size, groupLevel, reference, infoTags, groupLevelFilter);
			}
		}
	}
	else
	{
		result = oFF.XMath.min(index + 1, size - 1);
	}
	return result;
};
oFF.SacTableAxisFragment.prototype.searchBackDataReferenceWithoutTagging = function(info, index, size, groupLevel, reference)
{
	let result;
	if (this.m_dataPath.containsLevel(groupLevel) && this.m_dataPath.matchesTag(info, groupLevel, reference))
	{
		if (index === 0)
		{
			result = index;
		}
		else
		{
			let sibling = this.getDataSiblingAt(index - 1);
			if (oFF.isNull(sibling))
			{
				return oFF.XMath.max(index - 1, 0);
			}
			else
			{
				result = sibling.searchBackDataReferenceWithoutTagging(info, index - 1, size, groupLevel, reference);
			}
		}
	}
	else
	{
		result = oFF.XMath.min(index + 1, size - 1);
	}
	return result;
};
oFF.SacTableAxisFragment.prototype.searchBackHeaderReference = function(info, index)
{
	let result;
	if (index === 0 || oFF.XStream.of(this.m_partOfHeaderSection).anyMatch((hsi) => {
		return hsi.isSectionStart() && hsi.matchesTag(info);
	}))
	{
		result = index;
	}
	else
	{
		let sibling = this.getHeaderSiblingAt(index - 1);
		if (oFF.isNull(sibling))
		{
			result = index - 1;
		}
		else
		{
			result = sibling.searchBackHeaderReference(info, index - 1);
		}
	}
	return result;
};
oFF.SacTableAxisFragment.prototype.searchForwardDataReference = function(index, size, groupLevel, reference, infoTags, groupLevelFilter)
{
	let result;
	if (this.m_dataPath.containsLevel(groupLevel) && oFF.XCollectionUtils.hasElements(infoTags) && oFF.XStream.of(infoTags).allMatch((it) => {
		return this.matchesDataPathTag(it, reference, groupLevelFilter);
	}))
	{
		if (index === size - 1)
		{
			result = index;
		}
		else
		{
			let sibling = this.getDataSiblingAt(index + 1);
			if (oFF.isNull(sibling))
			{
				result = oFF.XMath.min(index + 1, size);
			}
			else
			{
				result = sibling.searchForwardDataReference(index + 1, size, groupLevel, reference, infoTags, groupLevelFilter);
			}
		}
	}
	else
	{
		result = oFF.XMath.max(0, index - 1);
	}
	return result;
};
oFF.SacTableAxisFragment.prototype.searchForwardDataReferenceWithoutTagging = function(info, index, size, groupLevel, reference)
{
	let result;
	if (this.m_dataPath.containsLevel(groupLevel) && this.m_dataPath.matchesTag(info, groupLevel, reference))
	{
		if (index === size - 1)
		{
			result = index;
		}
		else
		{
			let sibling = this.getDataSiblingAt(index + 1);
			if (oFF.isNull(sibling))
			{
				result = oFF.XMath.min(index + 1, size);
			}
			else
			{
				result = sibling.searchForwardDataReferenceWithoutTagging(info, index + 1, size, groupLevel, reference);
			}
		}
	}
	else
	{
		result = oFF.XMath.max(0, index - 1);
	}
	return result;
};
oFF.SacTableAxisFragment.prototype.searchForwardHeaderReference = function(info, index, size)
{
	let result;
	if (index === size - 1 || oFF.XStream.of(this.m_partOfHeaderSection).anyMatch((hsi) => {
		return hsi.isSectionEnd() && hsi.matchesTag(info);
	}))
	{
		result = index;
	}
	else
	{
		let sibling = this.getHeaderSiblingAt(index + 1);
		if (oFF.isNull(sibling))
		{
			result = index + 1;
		}
		else
		{
			result = sibling.searchForwardHeaderReference(info, index + 1, size);
		}
	}
	return result;
};
oFF.SacTableAxisFragment.prototype.setBreakAfterPriority = function(priority)
{
	this.m_breakAfterPriority = priority;
	if (this.getParent() !== null)
	{
		this.getParent().setBreakAfterPriority(priority);
	}
};
oFF.SacTableAxisFragment.prototype.setBreakBeforePriority = function(priority)
{
	this.m_breakBeforePriority = priority;
	if (this.getParent() !== null)
	{
		this.getParent().setBreakBeforePriority(priority);
	}
};
oFF.SacTableAxisFragment.prototype.setComponentIndex = function(componentIndex)
{
	this.m_componentIndex = componentIndex;
};
oFF.SacTableAxisFragment.prototype.setDataIndex = function(m_dataIndex)
{
	this.m_needsReIndex = false;
	this.m_dataIndex = m_dataIndex;
	this.clearTableMarkups();
};
oFF.SacTableAxisFragment.prototype.setHeader = function(header)
{
	this.m_header = header;
};
oFF.SacTableAxisFragment.prototype.setHeaderBand = function(headerBand)
{
	this.m_headerBand = headerBand;
};
oFF.SacTableAxisFragment.prototype.setHeaderBoundary = function(boundary)
{
	this.m_headerBoundary = boundary;
};
oFF.SacTableAxisFragment.prototype.setHeaderIndex = function(m_headerIndex)
{
	this.m_needsReIndex = false;
	this.m_headerIndex = m_headerIndex;
	this.clearTableMarkups();
};
oFF.SacTableAxisFragment.prototype.setHeaderLevel = function(headerLevel)
{
	this.m_headerLevel = headerLevel;
};
oFF.SacTableAxisFragment.prototype.setId = function(id)
{
	if (!oFF.XString.isEqual(id, this.m_id))
	{
		this.m_id = id;
	}
};
oFF.SacTableAxisFragment.prototype.setKeepTogetherAfterPriority = function(priority)
{
	this.m_keepTogetherAfterPriority = priority;
	if (this.getParent() !== null)
	{
		this.getParent().setKeepTogetherAfterPriority(priority);
	}
};
oFF.SacTableAxisFragment.prototype.setKeepTogetherBeforePriority = function(priority)
{
	this.m_keepTogetherBeforePriority = priority;
	if (this.getParent() !== null)
	{
		this.getParent().setKeepTogetherBeforePriority(priority);
	}
};
oFF.SacTableAxisFragment.prototype.setNeedsReIndex = function()
{
	this.m_needsReIndex = true;
};
oFF.SacTableAxisFragment.prototype.setOwningList = function(owningList)
{
	this.m_owningList = oFF.XWeakReferenceUtil.getWeakRef(owningList);
};
oFF.SacTableAxisFragment.prototype.setParent = function(parent)
{
	this.m_parent = oFF.XWeakReferenceUtil.getWeakRef(parent);
};
oFF.SacTableAxisFragment.prototype.setTupleIndex = function(tupleIndex)
{
	this.m_tupleIndex = tupleIndex;
};
oFF.SacTableAxisFragment.prototype.setupInternal = function(bundle)
{
	this.m_bundle = oFF.XWeakReferenceUtil.getWeakRef(bundle);
	this.m_dataSectionGroupLevelIndex = oFF.XSimpleMap.create();
	this.m_sectionReferenceIndex = oFF.XList.create();
	this.m_dataSectionTags = oFF.XSimpleMap.create();
	this.m_partOfHeaderSection = oFF.XList.create();
	this.m_dataPath = oFF.SacDataPathTag.createTag();
	this.m_scopedStyles = oFF.XList.create();
	this.m_childrenBefore = oFF.XList.create();
	this.m_childrenAfter = oFF.XList.create();
	this.m_headerIndex = -1;
	this.m_dataIndex = -1;
	this.m_tupleIndex = -1;
	this.m_componentIndex = -1;
	this.m_headerLevel = -1;
	this.m_breakBeforePriority = -2;
	this.m_breakAfterPriority = -2;
	this.m_keepTogetherBeforePriority = -2;
	this.m_keepTogetherAfterPriority = -2;
};

oFF.SacTable = function() {};
oFF.SacTable.prototype = new oFF.SacTableFormattableElement();
oFF.SacTable.prototype._ff_c = "SacTable";

oFF.SacTable.DEFAULT_CELL_WIDTH = 8;
oFF.SacTable.SELECTION_COL_MIN = "colMin";
oFF.SacTable.SELECTION_LIST = "list";
oFF.SacTable.SELECTION_ROW_MIN = "rowMin";
oFF.SacTable.create = function()
{
	let instance = new oFF.SacTable();
	instance.internalSetup();
	return instance;
};
oFF.SacTable.prototype.m_cellChartInfo = null;
oFF.SacTable.prototype.m_colEnd = 0;
oFF.SacTable.prototype.m_colStart = 0;
oFF.SacTable.prototype.m_columnHeaderMap = null;
oFF.SacTable.prototype.m_columnHeaderNames = null;
oFF.SacTable.prototype.m_columnInsertOrHidePresent = false;
oFF.SacTable.prototype.m_columnList = null;
oFF.SacTable.prototype.m_columnsMemberHeaderHandling = null;
oFF.SacTable.prototype.m_dataColumnsAmount = 0;
oFF.SacTable.prototype.m_dataPointStyles = null;
oFF.SacTable.prototype.m_dataRowAmount = 0;
oFF.SacTable.prototype.m_defaultRowHeight = 0;
oFF.SacTable.prototype.m_freezeHeaderColumns = false;
oFF.SacTable.prototype.m_freezeHeaderRows = false;
oFF.SacTable.prototype.m_freezeUpToColumn = 0;
oFF.SacTable.prototype.m_freezeUpToRow = 0;
oFF.SacTable.prototype.m_hasHierarchyActive = false;
oFF.SacTable.prototype.m_headerColor = null;
oFF.SacTable.prototype.m_headerColumnList = null;
oFF.SacTable.prototype.m_headerRowList = null;
oFF.SacTable.prototype.m_height = 0;
oFF.SacTable.prototype.m_highlightAreas = null;
oFF.SacTable.prototype.m_layeredRectangularStyles = null;
oFF.SacTable.prototype.m_maxCellWidth = 0;
oFF.SacTable.prototype.m_maxColumns = 0;
oFF.SacTable.prototype.m_maxRecommendedCellWidth = 0;
oFF.SacTable.prototype.m_maxRows = 0;
oFF.SacTable.prototype.m_minCellWidth = 0;
oFF.SacTable.prototype.m_preColumnsAmount = 0;
oFF.SacTable.prototype.m_preRowsAmount = 0;
oFF.SacTable.prototype.m_reversedHierarchy = false;
oFF.SacTable.prototype.m_rowEnd = 0;
oFF.SacTable.prototype.m_rowHeaderGroupNames = null;
oFF.SacTable.prototype.m_rowHeaderMap = null;
oFF.SacTable.prototype.m_rowInsertOrHidePresent = false;
oFF.SacTable.prototype.m_rowList = null;
oFF.SacTable.prototype.m_rowStart = 0;
oFF.SacTable.prototype.m_rowsMemberHeaderHandling = null;
oFF.SacTable.prototype.m_showCoordinateHeader = false;
oFF.SacTable.prototype.m_showFreezeLines = false;
oFF.SacTable.prototype.m_showGrid = false;
oFF.SacTable.prototype.m_showSubTitle = false;
oFF.SacTable.prototype.m_showTableDetails = false;
oFF.SacTable.prototype.m_showTableTitle = false;
oFF.SacTable.prototype.m_stripeDataColumns = false;
oFF.SacTable.prototype.m_stripeDataRows = false;
oFF.SacTable.prototype.m_tableMarkups = null;
oFF.SacTable.prototype.m_tableMemberHeaderHandling = null;
oFF.SacTable.prototype.m_title = null;
oFF.SacTable.prototype.m_totalLevel0Color = null;
oFF.SacTable.prototype.m_totalLevel1Color = null;
oFF.SacTable.prototype.m_totalLevel2Color = null;
oFF.SacTable.prototype.m_totalLevel3Color = null;
oFF.SacTable.prototype.m_totalLevel4Color = null;
oFF.SacTable.prototype.m_totalLevel5Color = null;
oFF.SacTable.prototype.m_totalLevel6Color = null;
oFF.SacTable.prototype.m_width = 0;
oFF.SacTable.prototype.adaptCells = function(columnIndex, mergedColums, cells, rowsOffset)
{
	let cell;
	let columnOffset;
	for (columnOffset = 0; columnOffset < mergedColums && columnIndex + columnOffset + 1 < cells.size(); columnOffset++)
	{
		cell = cells.get(columnIndex + columnOffset + 1);
		cell.setMergedColumnsInternal(-columnOffset - 1);
		cell.setMergedRowsInternal(-rowsOffset);
	}
};
oFF.SacTable.prototype.adaptMergedCells = function(mergedCell)
{
	let mergedColumns = mergedCell.getMergedColumns();
	let mergedRows = mergedCell.getMergedRows();
	let parentRow = mergedCell.getParentRow();
	let cells = parentRow.getCells();
	let columnIndex = cells.getIndex(mergedCell);
	let headerRowIndex = this.m_headerRowList.getIndex(parentRow);
	let dataRowIndex = this.m_rowList.getIndex(parentRow);
	this.adaptCells(columnIndex, mergedColumns, cells, 0);
	this.resetCellMerger(columnIndex + mergedColumns + 1, cells);
	if (headerRowIndex > -1)
	{
		this.adaptRows(this.m_headerRowList, headerRowIndex, mergedRows, columnIndex, mergedColumns);
	}
	if (dataRowIndex > -1)
	{
		this.adaptRows(this.m_rowList, dataRowIndex, mergedRows, columnIndex, mergedColumns);
	}
};
oFF.SacTable.prototype.adaptMergedColumns = function(index, rowList)
{
	let cells;
	let cell;
	for (let i = 0; i < rowList.size(); i++)
	{
		let row = rowList.get(i);
		cells = oFF.isNull(row) ? null : row.getCells();
		if (oFF.notNull(row) && cells.size() > index + 1 && cells.get(index + 1) !== null && cells.get(index + 1).getMergedColumns() < 0)
		{
			for (let j = index - 1; j > 0; j--)
			{
				cell = cells.get(j);
				if (oFF.notNull(cell) && cell.getMergedColumns() > 0)
				{
					cell.setMergedColumns(cell.getMergedColumns() + 1);
					break;
				}
			}
		}
	}
};
oFF.SacTable.prototype.adaptMergedRows = function(index, rowList)
{
	if (index > 0 && index + 1 < rowList.size() && rowList.get(index + 1) !== null)
	{
		let successorRow = rowList.get(index + 1);
		let srcList = successorRow.getCells();
		for (let i = 0; i < srcList.size(); i++)
		{
			let src = srcList.get(i);
			if (oFF.notNull(src) && src.getMergedRows() < 0)
			{
				for (let j = index - 1; j >= 0; j--)
				{
					let cell = rowList.get(j).getCells().get(i);
					if (cell.getMergedRows() > 0)
					{
						cell.setMergedRows(cell.getMergedRows() + 1);
						break;
					}
				}
			}
		}
	}
};
oFF.SacTable.prototype.adaptRows = function(rowList, rowIndex, mergedRows, columnIndex, mergedColumns)
{
	let cell;
	let subCells;
	let rowObj;
	let row;
	for (row = rowIndex + 1; row < rowList.size() && row < rowIndex + mergedRows + 1; row++)
	{
		rowObj = rowList.get(row);
		if (oFF.isNull(rowObj))
		{
			continue;
		}
		subCells = rowObj.getCells();
		cell = subCells.get(columnIndex);
		cell.setMergedRowsInternal(rowIndex - row);
		cell.setMergedColumnsInternal(0);
		this.adaptCells(columnIndex, mergedColumns, subCells, row - rowIndex);
		this.resetCellMerger(columnIndex + mergedColumns + 1, subCells);
	}
	for (; row < rowList.size(); row++)
	{
		rowObj = rowList.get(row);
		if (oFF.isNull(rowObj))
		{
			continue;
		}
		subCells = rowObj.getCells();
		cell = subCells.get(columnIndex);
		if (cell.getMergedRows() < 0)
		{
			cell.setMergedRowsInternal(0);
			cell.setMergedColumnsInternal(0);
			this.resetCellMerger(columnIndex + 1, subCells);
		}
		else
		{
			break;
		}
	}
};
oFF.SacTable.prototype.addColumnHeaderGroupName = function(sectionName)
{
	this.m_columnHeaderNames.add(sectionName);
	this.m_columnHeaderMap.put(sectionName, sectionName);
};
oFF.SacTable.prototype.addDataColumn = function(tableColumn)
{
	let columnIndex = this.m_headerColumnList.size() + this.m_columnList.size();
	this.m_columnList.add(tableColumn);
	if (this.m_columnList.size() > this.m_dataColumnsAmount)
	{
		this.m_dataColumnsAmount = this.m_columnList.size();
	}
	this.populateWithRowCells(columnIndex, tableColumn, false);
};
oFF.SacTable.prototype.addDataColumnAt = function(dataIndex, tableColumn, overwriteAtPosition)
{
	let i = this.m_columnList.size();
	for (; i < dataIndex; i++)
	{
		this.m_columnList.add(null);
	}
	if (overwriteAtPosition && i === dataIndex)
	{
		this.m_columnList.add(null);
	}
	if (overwriteAtPosition)
	{
		let oldColumn = this.m_columnList.get(dataIndex);
		if (oFF.notNull(oldColumn))
		{
			oFF.XLogger.println(oFF.XStringUtils.concatenate2("WARNING: Overwriting existing column at position: ", oFF.XInteger.convertToString(dataIndex)));
		}
		this.m_columnList.set(dataIndex, tableColumn);
	}
	else
	{
		this.m_columnList.insert(dataIndex, tableColumn);
	}
	if (this.m_columnList.size() > this.m_dataColumnsAmount)
	{
		this.m_dataColumnsAmount = this.m_columnList.size();
	}
	this.populateWithRowCells(dataIndex + this.m_headerColumnList.size(), tableColumn, overwriteAtPosition);
};
oFF.SacTable.prototype.addDataRow = function(rowIndex, tableRow)
{
	this.m_rowList.add(tableRow);
	if (this.m_rowList.size() > this.m_dataRowAmount)
	{
		this.m_dataRowAmount = this.m_rowList.size();
	}
	this.populateWithColumnCells(rowIndex, tableRow);
};
oFF.SacTable.prototype.addDataRowAt = function(dataIndex, tableRow, overwriteAtPosition)
{
	let i = this.m_rowList.size();
	for (; i < dataIndex; i++)
	{
		this.m_rowList.add(null);
	}
	if (overwriteAtPosition && i === dataIndex)
	{
		this.m_rowList.add(null);
	}
	if (overwriteAtPosition)
	{
		let oldRow = this.m_rowList.get(dataIndex);
		if (oFF.notNull(oldRow))
		{
			oFF.XLogger.println(oFF.XStringUtils.concatenate2("WARNING: Overwriting existing row at position: ", oFF.XInteger.convertToString(dataIndex)));
		}
		this.m_rowList.set(dataIndex, tableRow);
	}
	else
	{
		this.m_rowList.insert(dataIndex, tableRow);
	}
	if (this.m_rowList.size() > this.m_dataRowAmount)
	{
		this.m_dataRowAmount = this.m_rowList.size();
	}
	this.populateWithColumnCells(dataIndex + this.m_headerRowList.size(), tableRow);
};
oFF.SacTable.prototype.addHeaderColumn = function(tableColumn)
{
	tableColumn.setHeader(true);
	let columnIndex = this.m_headerColumnList.size();
	this.m_headerColumnList.add(tableColumn);
	this.populateWithRowCells(columnIndex, tableColumn, false);
};
oFF.SacTable.prototype.addHeaderColumnAt = function(tableColumn, index)
{
	tableColumn.setHeader(true);
	this.m_headerColumnList.insert(index, tableColumn);
	this.populateWithRowCells(index, tableColumn, false);
};
oFF.SacTable.prototype.addHeaderRow = function(tableRow)
{
	let rowIndex = this.m_headerRowList.size();
	tableRow.setHeader(true);
	this.m_headerRowList.add(tableRow);
	this.populateWithColumnCells(rowIndex, tableRow);
};
oFF.SacTable.prototype.addHeaderRowAt = function(tableRow, index)
{
	let rowIndex = this.m_headerRowList.size();
	tableRow.setHeader(true);
	this.m_headerRowList.insert(index, tableRow);
	this.populateWithColumnCells(rowIndex, tableRow);
};
oFF.SacTable.prototype.addNewDataPointStyle = function()
{
	let newStyle = oFF.SacDataPointStyle.create();
	this.m_dataPointStyles.add(newStyle);
	return newStyle;
};
oFF.SacTable.prototype.addNewHighlightArea = function()
{
	let highlightArea = oFF.SacTableHighlightArea.create();
	this.m_highlightAreas.add(highlightArea);
	return highlightArea;
};
oFF.SacTable.prototype.addNewLayeredRectangularStyle = function()
{
	let newStyle = oFF.SacLayeredRectangularStyle.create();
	this.m_layeredRectangularStyles.add(newStyle);
	return newStyle;
};
oFF.SacTable.prototype.addNewTableMarkup = function()
{
	let newMarkup = oFF.SacTableMarkup.create();
	this.m_tableMarkups.add(newMarkup);
	return newMarkup;
};
oFF.SacTable.prototype.addNullColumnAt = function(columnIndex)
{
	this.m_columnList.insert(columnIndex, null);
	let nullAdder = (row) => {
		row.addNullCellAt(this.m_preColumnsAmount + columnIndex);
	};
	oFF.XCollectionUtils.forEach(this.m_headerRowList, nullAdder);
	oFF.XCollectionUtils.forEach(this.m_rowList, nullAdder);
};
oFF.SacTable.prototype.addNullRowAt = function(rowIndex)
{
	this.m_rowList.insert(rowIndex, null);
};
oFF.SacTable.prototype.addRowHeaderGroupName = function(sectionName)
{
	this.m_rowHeaderGroupNames.add(sectionName);
	this.m_rowHeaderMap.put(sectionName, sectionName);
};
oFF.SacTable.prototype.applyHighlighting = function() {};
oFF.SacTable.prototype.clear = function()
{
	this.m_rowList.clear();
	this.m_headerRowList.clear();
	this.m_columnList.clear();
	this.m_headerColumnList.clear();
	this.m_rowInsertOrHidePresent = false;
	this.m_columnInsertOrHidePresent = false;
};
oFF.SacTable.prototype.clearColumnHeaderGroupNames = function()
{
	this.m_columnHeaderNames.clear();
	this.m_columnHeaderMap.clear();
};
oFF.SacTable.prototype.clearDataPointStyles = function()
{
	this.m_dataPointStyles.clear();
};
oFF.SacTable.prototype.clearHeaderColumnList = function()
{
	let columnsToRemove = this.m_headerColumnList.size();
	let h;
	let rowObject;
	let i;
	for (h = 0; h < this.m_headerRowList.size(); h++)
	{
		rowObject = this.m_headerRowList.get(h);
		for (i = 0; i < columnsToRemove; i++)
		{
			rowObject.removeCellAt(0);
		}
	}
	for (h = 0; h < this.m_rowList.size(); h++)
	{
		rowObject = this.m_rowList.get(h);
		if (oFF.notNull(rowObject))
		{
			for (i = 0; i < columnsToRemove; i++)
			{
				rowObject.removeCellAt(0);
			}
		}
	}
	this.m_headerColumnList.clear();
};
oFF.SacTable.prototype.clearHeaderRowList = function()
{
	this.m_headerRowList.clear();
};
oFF.SacTable.prototype.clearHighlightAreas = function()
{
	this.m_highlightAreas.clear();
};
oFF.SacTable.prototype.clearLayeredRectangularStyles = function()
{
	this.m_layeredRectangularStyles.clear();
};
oFF.SacTable.prototype.clearRowHeaderGroupNames = function()
{
	this.m_rowHeaderGroupNames.clear();
	this.m_rowHeaderMap.clear();
};
oFF.SacTable.prototype.clearTableMarkups = function()
{
	this.m_tableMarkups.clear();
};
oFF.SacTable.prototype.completeHighlightCoordinate = function(cell, highlightCoordinates, highlightArea, column, columnIndex, rowIndex)
{
	if (oFF.notNull(cell) && oFF.notNull(column) && highlightArea.getCellTypeRestriction().matches(cell) && column.matchesSacTableSectionInfo(highlightArea.getColumnsReference()))
	{
		highlightCoordinates.add(oFF.SacTableHighlightCoordinate.create(columnIndex, rowIndex, highlightArea.getHighlightColor()));
	}
};
oFF.SacTable.prototype.createHighlightCoordinate = function(highlightCoordinates, highlightArea, row, rowIndex)
{
	if (oFF.notNull(row) && row.matchesSacTableSectionInfo(highlightArea.getRowsReference()))
	{
		let i;
		for (i = 0; i < this.m_preColumnsAmount; i++)
		{
			this.completeHighlightCoordinate(row.getCells().get(i), highlightCoordinates, highlightArea, this.getHeaderColumnList().get(i), i, rowIndex);
		}
		let colListSize = this.getColumnList().size();
		let start = this.m_colStart < 0 ? 0 : oFF.XMath.min(colListSize, this.m_colStart);
		let end = this.m_rowEnd < 0 ? colListSize : oFF.XMath.min(colListSize, this.m_colEnd + 1);
		for (i = start; i < end; i++)
		{
			this.completeHighlightCoordinate(row.getCells().get(this.m_preColumnsAmount + i), highlightCoordinates, highlightArea, this.getColumnList().get(i), this.m_preColumnsAmount + i, rowIndex);
		}
	}
};
oFF.SacTable.prototype.createNewDataColumn = function()
{
	let newColumn = oFF.SacTableColumn._create(this);
	this.addDataColumn(newColumn);
	return newColumn;
};
oFF.SacTable.prototype.createNewDataColumnAt = function(index)
{
	let newColumn = oFF.SacTableColumn._create(this);
	this.addDataColumnAt(index, newColumn, false);
	return newColumn;
};
oFF.SacTable.prototype.createNewHeaderColumn = function()
{
	let newColumn = oFF.SacTableColumn._create(this);
	this.addHeaderColumn(newColumn);
	return newColumn;
};
oFF.SacTable.prototype.createNewHeaderColumnAt = function(index)
{
	let newColumn = oFF.SacTableColumn._create(this);
	this.addHeaderColumnAt(newColumn, index);
	return newColumn;
};
oFF.SacTable.prototype.exceptionInfoMatchesDataPointStyle = function(exceptionInfo, dps)
{
	return oFF.XStream.of(exceptionInfo).anyMatch((ei) => {
		return dps.matchesExceptionInfo(ei);
	});
};
oFF.SacTable.prototype.formatDataColumnWidths = function()
{
	this.formatWidthList(this.m_rowList);
};
oFF.SacTable.prototype.formatHeaderColumnWidths = function()
{
	this.formatWidthList(this.m_headerRowList);
};
oFF.SacTable.prototype.formatWidthList = function(list)
{
	let iterator = list.getIterator();
	while (iterator.hasNext())
	{
		this.formatWidths(iterator.next());
	}
};
oFF.SacTable.prototype.formatWidths = function(row)
{
	if (oFF.notNull(row))
	{
		let cells = row.getCells();
		if (row.isShowCellChart() && row.getCellChartOrientation() !== oFF.SacCellChartOrientation.HORIZONTAL)
		{
			row.setHeight(oFF.SacTableConstants.DF_R_N_HEIGHT_VERTICAL_CHARTS);
		}
		else
		{
			row.setHeight(this.getDefaultRowHeight());
		}
		for (let i = 0; i < cells.size(); i++)
		{
			let cell = cells.get(i);
			if (oFF.notNull(cell))
			{
				if (row.isHeader() && cell.isInHierarchy())
				{
					let newHeight = oFF.SacTableConstants.DF_C_N_HIERARCHY_PADDING_TOP + this.getDefaultRowHeight() + oFF.XMath.div(this.getDefaultRowHeight() * 2 * cell.getHierarchyLevel(), 3) + cell.getHierarchyLevel() * 3;
					row.setHeight(oFF.XMath.max(row.getHeight(), newHeight));
				}
				if (!cell.isHeaderCell() || !cell.isRepeatedHeader() || cell.isEffectiveRepetitiveHeaderCells())
				{
					let formatted = cell.getFormatted();
					let tokenized = oFF.isNull(formatted) || cell.isUnbooked() ? oFF.XList.create() : oFF.XStringTokenizer.splitString(formatted, "\r\n");
					let length = oFF.XStream.ofString(tokenized).map((str) => {
						return oFF.XIntegerValue.create(oFF.XString.size(str.getString()));
					}).reduce(oFF.XIntegerValue.create(0), (a, b) => {
						return oFF.XIntegerValue.create(oFF.XMath.max(a.getInteger(), b.getInteger()));
					}).getInteger();
					let factor = cell.isEffectiveShowCellChart() && cell.getEffectiveCellChartOrientation() === oFF.SacCellChartOrientation.HORIZONTAL ? 3 : 1;
					let heightFactor = cell.isEffectiveShowCellChart() && cell.getEffectiveCellChartOrientation() !== oFF.SacCellChartOrientation.HORIZONTAL ? 4 : 1;
					let column = cell.getParentColumn();
					if (tokenized.size() > 1 || heightFactor > 1)
					{
						row.setHeight(oFF.XMath.max(row.getHeight(), tokenized.size() * oFF.SacTableConstants.DF_R_N_HEIGHT_REDUCED * heightFactor));
						cell.setWrap(true);
					}
					if (cell.isDimensionHeader() || cell.isTotalsContext())
					{
						length = oFF.XMath.div(length * 11, 10) + 1;
					}
					column.setDefaultEmWidth(oFF.XMath.max((length + cell.getLengthAddition()), column.getDefaultEmWidth()) * factor);
				}
			}
		}
	}
};
oFF.SacTable.prototype.getCellChartInfo = function()
{
	return this.m_cellChartInfo;
};
oFF.SacTable.prototype.getColumnEmWidthsInternal = function()
{
	let columnWidths = oFF.XList.create();
	let i;
	let size = this.m_headerColumnList.size();
	for (i = 0; i < size; i++)
	{
		columnWidths.add(oFF.XIntegerValue.create(this.m_headerColumnList.get(i).getDefaultEmWidth()));
	}
	size = this.m_columnList.size();
	for (i = 0; i < size; i++)
	{
		columnWidths.add(oFF.XIntegerValue.create(this.m_columnList.get(i).getDefaultEmWidth()));
	}
	return columnWidths;
};
oFF.SacTable.prototype.getColumnEmWidthsSubList = function(start, end)
{
	let internalList = this.getColumnEmWidthsInternal();
	let internalListSize = internalList.size();
	return internalList.sublist(start, end === -1 || end > internalListSize ? internalListSize : end);
};
oFF.SacTable.prototype.getColumnHeaderGroupNames = function()
{
	return this.m_columnHeaderNames;
};
oFF.SacTable.prototype.getColumnHeaderMap = function()
{
	return this.m_columnHeaderMap;
};
oFF.SacTable.prototype.getColumnList = function()
{
	return this.m_columnList;
};
oFF.SacTable.prototype.getColumnWidth = function(index)
{
	let hcs = this.m_headerColumnList.size();
	if (index < hcs)
	{
		return this.m_headerColumnList.get(index).getWidth();
	}
	else if (index < hcs + this.m_columnList.size())
	{
		return this.m_columnList.get(index - hcs).getWidth();
	}
	else
	{
		return oFF.SacTable.DEFAULT_CELL_WIDTH;
	}
};
oFF.SacTable.prototype.getColumnsMemberHeaderHandling = function()
{
	return this.m_columnsMemberHeaderHandling;
};
oFF.SacTable.prototype.getDataColumnsAmount = function()
{
	return this.m_dataColumnsAmount;
};
oFF.SacTable.prototype.getDataPointStyles = function()
{
	return this.m_dataPointStyles;
};
oFF.SacTable.prototype.getDataPointStylesMatchingExceptionInformation = function(exceptionInfo)
{
	return oFF.XStream.of(this.m_dataPointStyles).filter((dps) => {
		return this.exceptionInfoMatchesDataPointStyle(exceptionInfo, dps);
	}).collect(oFF.XStreamCollector.toList());
};
oFF.SacTable.prototype.getDataRowAmount = function()
{
	return this.m_dataRowAmount;
};
oFF.SacTable.prototype.getDefaultRowHeight = function()
{
	return this.m_defaultRowHeight;
};
oFF.SacTable.prototype.getEffectiveHighlightedCells = function()
{
	this.applyHighlighting();
	let highlightCoordinates = oFF.XList.create();
	oFF.XCollectionUtils.forEach(this.m_highlightAreas, (highlightArea) => {
		let i;
		for (i = 0; i < this.m_preRowsAmount; i++)
		{
			this.createHighlightCoordinate(highlightCoordinates, highlightArea, this.getHeaderRowList().get(i), i);
		}
		let rowListSize = this.getRowList().size();
		let start = this.m_rowStart < 0 ? 0 : oFF.XMath.min(rowListSize, this.m_rowStart);
		let end = this.m_rowEnd < 0 ? rowListSize : oFF.XMath.min(rowListSize, this.m_rowEnd + 1);
		for (i = start; i < end; i++)
		{
			this.createHighlightCoordinate(highlightCoordinates, highlightArea, this.getRowList().get(i), this.m_preRowsAmount + i);
		}
	});
	return highlightCoordinates;
};
oFF.SacTable.prototype.getFreezeUpToColumn = function()
{
	return this.m_freezeUpToColumn;
};
oFF.SacTable.prototype.getFreezeUpToRow = function()
{
	return this.m_freezeUpToRow;
};
oFF.SacTable.prototype.getHeaderColor = function()
{
	return this.m_headerColor;
};
oFF.SacTable.prototype.getHeaderColumnList = function()
{
	return this.m_headerColumnList;
};
oFF.SacTable.prototype.getHeaderRowList = function()
{
	return this.m_headerRowList;
};
oFF.SacTable.prototype.getHeight = function()
{
	return this.m_height;
};
oFF.SacTable.prototype.getLayeredRectangularStyles = function()
{
	return this.m_layeredRectangularStyles;
};
oFF.SacTable.prototype.getLocalColumnsAmount = function()
{
	return this.getDataColumnsAmount();
};
oFF.SacTable.prototype.getLocalColumnsOffset = function()
{
	return 0;
};
oFF.SacTable.prototype.getLocalRowsAmount = function()
{
	return this.getDataRowAmount();
};
oFF.SacTable.prototype.getLocalRowsOffset = function()
{
	return 0;
};
oFF.SacTable.prototype.getMaxCellWidth = function()
{
	return this.m_maxCellWidth;
};
oFF.SacTable.prototype.getMaxColumns = function()
{
	return this.m_maxColumns;
};
oFF.SacTable.prototype.getMaxRecommendedCellWith = function()
{
	return this.m_maxRecommendedCellWidth;
};
oFF.SacTable.prototype.getMaxRows = function()
{
	return this.m_maxRows;
};
oFF.SacTable.prototype.getMinCellWidth = function()
{
	return this.m_minCellWidth;
};
oFF.SacTable.prototype.getOverallHeight = function()
{
	let overallHeight;
	let overallRowsAmount = this.getPreRowsAmount() + this.getDataRowAmount();
	if (oFF.XCollectionUtils.hasElements(this.getRowList()))
	{
		let ehp = (r) => {
			return oFF.notNull(r) && r.heightDiffersFromDefault();
		};
		let explicitHeightHeaderRows = oFF.XStream.of(this.getHeaderRowList()).filter(ehp).collect(oFF.XStreamCollector.toList());
		let explicitHeightDataRows = oFF.XStream.of(this.getRowList()).filter(ehp).collect(oFF.XStreamCollector.toList());
		let sumReducer = (a, b) => {
			return oFF.XIntegerValue.create(a.getInteger() + b.getHeight());
		};
		let collectedRowHeight = oFF.XStream.of(explicitHeightHeaderRows).reduce(oFF.XIntegerValue.create(0), sumReducer).getInteger() + oFF.XStream.of(explicitHeightDataRows).reduce(oFF.XIntegerValue.create(0), sumReducer).getInteger();
		overallHeight = (overallRowsAmount - explicitHeightHeaderRows.size() - explicitHeightDataRows.size()) * this.getDefaultRowHeight() + collectedRowHeight;
	}
	else
	{
		overallHeight = overallRowsAmount * this.getDefaultRowHeight();
	}
	return overallHeight;
};
oFF.SacTable.prototype.getPagedColumnsAmount = function()
{
	return this.getDataColumnsAmount();
};
oFF.SacTable.prototype.getPagedColumnsOffset = function()
{
	return 0;
};
oFF.SacTable.prototype.getPagedRowsAmount = function()
{
	return this.getDataRowAmount();
};
oFF.SacTable.prototype.getPagedRowsOffset = function()
{
	return 0;
};
oFF.SacTable.prototype.getPreColumnsAmount = function()
{
	return this.m_preColumnsAmount;
};
oFF.SacTable.prototype.getPreRowsAmount = function()
{
	return this.m_preRowsAmount;
};
oFF.SacTable.prototype.getRowHeaderGroupNames = function()
{
	return this.m_rowHeaderGroupNames;
};
oFF.SacTable.prototype.getRowHeaderMap = function()
{
	return this.m_rowHeaderMap;
};
oFF.SacTable.prototype.getRowList = function()
{
	return this.m_rowList;
};
oFF.SacTable.prototype.getRowsMemberHeaderHandling = function()
{
	return this.m_rowsMemberHeaderHandling;
};
oFF.SacTable.prototype.getStylePriority = function()
{
	return 10;
};
oFF.SacTable.prototype.getTableMarkups = function()
{
	return this.m_tableMarkups;
};
oFF.SacTable.prototype.getTableMemberHeaderHandling = function()
{
	return this.m_tableMemberHeaderHandling;
};
oFF.SacTable.prototype.getTitle = function()
{
	return this.m_title;
};
oFF.SacTable.prototype.getTotalLevel0Color = function()
{
	return this.m_totalLevel0Color;
};
oFF.SacTable.prototype.getTotalLevel1Color = function()
{
	return this.m_totalLevel1Color;
};
oFF.SacTable.prototype.getTotalLevel2Color = function()
{
	return this.m_totalLevel2Color;
};
oFF.SacTable.prototype.getTotalLevel3Color = function()
{
	return this.m_totalLevel3Color;
};
oFF.SacTable.prototype.getTotalLevel4Color = function()
{
	return this.m_totalLevel4Color;
};
oFF.SacTable.prototype.getTotalLevel5Color = function()
{
	return this.m_totalLevel5Color;
};
oFF.SacTable.prototype.getTotalLevel6Color = function()
{
	return this.m_totalLevel6Color;
};
oFF.SacTable.prototype.getWidth = function()
{
	return this.m_width;
};
oFF.SacTable.prototype.hasHierarchy = function()
{
	return this.m_hasHierarchyActive;
};
oFF.SacTable.prototype.indexAndFormatTheTuples = function(startIndex, tupleList, consumer)
{
	let needsReIndex = false;
	this.indexTuples(startIndex, tupleList, consumer);
	let updatedTupleList = tupleList.createListCopy();
	let tuple;
	let partialRowSize = tupleList.size();
	for (let i = 0; i < partialRowSize; i++)
	{
		tuple = tupleList.get(i);
		if (oFF.notNull(tuple))
		{
			needsReIndex = tuple.applyHeaderHandling(updatedTupleList);
		}
	}
	let newTupleList = tupleList;
	if (needsReIndex)
	{
		this.indexTuples(startIndex, updatedTupleList, consumer);
		newTupleList = updatedTupleList.createListCopy();
	}
	partialRowSize = newTupleList.size();
	for (let i = 0; i < partialRowSize; i++)
	{
		tuple = newTupleList.get(i);
		if (oFF.notNull(tuple))
		{
			tuple.indexTableMarkups();
		}
	}
	for (let i = 0; i < partialRowSize; i++)
	{
		tuple = newTupleList.get(i);
		if (oFF.notNull(tuple))
		{
			needsReIndex = tuple.applyTableMarkups(updatedTupleList);
		}
	}
	if (needsReIndex)
	{
		this.indexTuples(startIndex, updatedTupleList, consumer);
	}
	return updatedTupleList;
};
oFF.SacTable.prototype.indexTuples = function(globalIndexOrig, list, consumer)
{
	for (let localIndex = 0, globalIndex = globalIndexOrig; localIndex < list.size(); localIndex++, globalIndex++)
	{
		consumer(oFF.XIntegerValue.create(globalIndex), list.get(localIndex));
	}
};
oFF.SacTable.prototype.internalSetup = function()
{
	this.m_rowHeaderGroupNames = oFF.XList.create();
	this.m_columnHeaderNames = oFF.XList.create();
	this.m_rowHeaderMap = oFF.XHashMapByString.create();
	this.m_columnHeaderMap = oFF.XHashMapByString.create();
	this.m_rowList = oFF.XList.create();
	this.m_headerRowList = oFF.XList.create();
	this.m_headerColumnList = oFF.XList.create();
	this.m_columnList = oFF.XList.create();
	this.m_dataPointStyles = oFF.XList.create();
	this.m_tableMarkups = oFF.XList.create();
	this.m_layeredRectangularStyles = oFF.XList.create();
	this.m_highlightAreas = oFF.XList.create();
	this.m_defaultRowHeight = oFF.SacTableConstants.DF_R_N_HEIGHT;
	this.m_height = 451;
	this.m_width = 1257;
	this.m_showGrid = true;
	this.m_showCoordinateHeader = true;
	this.m_minCellWidth = 40;
	this.m_maxCellWidth = 300;
	this.m_tableMemberHeaderHandling = oFF.SacTableMemberHeaderHandling.FIRST_MEMBER;
	this.m_cellChartInfo = oFF.XHashMapByString.create();
	this.m_freezeUpToRow = -1;
	this.m_freezeUpToColumn = -1;
	this.m_rowStart = -1;
	this.m_rowEnd = -1;
	this.m_colStart = -1;
	this.m_colEnd = -1;
};
oFF.SacTable.prototype.isColorateHeaderCells = function()
{
	return oFF.XStringUtils.isNotNullAndNotEmpty(this.m_headerColor);
};
oFF.SacTable.prototype.isColorateTotals = function()
{
	return oFF.XStringUtils.isNotNullAndNotEmpty(this.m_totalLevel0Color) && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_totalLevel1Color) && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_totalLevel2Color) && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_totalLevel3Color) && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_totalLevel4Color) && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_totalLevel5Color);
};
oFF.SacTable.prototype.isColumnInsertOrHidePresent = function()
{
	return this.m_columnInsertOrHidePresent;
};
oFF.SacTable.prototype.isColumnPaginated = function()
{
	return false;
};
oFF.SacTable.prototype.isFreezeHeaderColumns = function()
{
	return this.m_freezeHeaderColumns;
};
oFF.SacTable.prototype.isFreezeHeaderRows = function()
{
	return this.m_freezeHeaderRows;
};
oFF.SacTable.prototype.isMergeRepetitiveHeaderCells = function()
{
	return this.m_tableMemberHeaderHandling === oFF.SacTableMemberHeaderHandling.MERGE;
};
oFF.SacTable.prototype.isRepetitiveHeaderNames = function()
{
	return this.m_tableMemberHeaderHandling === oFF.SacTableMemberHeaderHandling.REPETITIVE;
};
oFF.SacTable.prototype.isReversedHierarchy = function()
{
	return this.m_reversedHierarchy;
};
oFF.SacTable.prototype.isRowInsertOrHidePresent = function()
{
	return this.m_rowInsertOrHidePresent;
};
oFF.SacTable.prototype.isRowPaginated = function()
{
	return false;
};
oFF.SacTable.prototype.isShowCoordinateHeader = function()
{
	return this.m_showCoordinateHeader;
};
oFF.SacTable.prototype.isShowFreezeLines = function()
{
	return this.m_showFreezeLines;
};
oFF.SacTable.prototype.isShowGrid = function()
{
	return this.m_showGrid;
};
oFF.SacTable.prototype.isShowSubTitle = function()
{
	return this.m_showSubTitle;
};
oFF.SacTable.prototype.isShowTableDetails = function()
{
	return this.m_showTableDetails;
};
oFF.SacTable.prototype.isShowTableTitle = function()
{
	return this.m_showTableTitle;
};
oFF.SacTable.prototype.isStripeDataColumns = function()
{
	return this.m_stripeDataColumns;
};
oFF.SacTable.prototype.isStripeDataRows = function()
{
	return this.m_stripeDataRows;
};
oFF.SacTable.prototype.newDataRow = function()
{
	let newRow = oFF.SacTableRow._create(this);
	let index = this.m_headerRowList.size() + this.m_rowList.size();
	this.addDataRow(index, newRow);
	return newRow;
};
oFF.SacTable.prototype.newDataRowAt = function(dataIndex, overwriteAtPosition)
{
	let newRow = oFF.SacTableRow._create(this);
	this.addDataRowAt(dataIndex, newRow, overwriteAtPosition);
	return newRow;
};
oFF.SacTable.prototype.newHeaderRow = function()
{
	let newRow = oFF.SacTableRow._create(this);
	this.addHeaderRow(newRow);
	return newRow;
};
oFF.SacTable.prototype.newHeaderRowAt = function(index)
{
	let newRow = oFF.SacTableRow._create(this);
	this.addHeaderRowAt(newRow, index);
	return newRow;
};
oFF.SacTable.prototype.populateWithColumnCells = function(index, newRow)
{
	let headerSize = this.m_headerColumnList.size();
	for (let i = 0; i < headerSize; i++)
	{
		newRow.insertNewCellAtWithColumn(i, this.m_headerColumnList.get(i), false);
	}
	for (let j = 0; j < this.m_columnList.size(); j++)
	{
		let column = this.m_columnList.get(j);
		if (oFF.notNull(column))
		{
			newRow.insertNewCellAtWithColumn(j + headerSize, column, false);
		}
	}
	if (index >= this.m_headerRowList.size())
	{
		this.adaptMergedRows(index - this.m_headerRowList.size(), this.m_rowList);
	}
	else
	{
		this.adaptMergedRows(index, this.m_headerRowList);
	}
};
oFF.SacTable.prototype.populateWithRowCells = function(index, newColumn, overwriteAtPosition)
{
	let row;
	let i;
	for (i = 0; i < this.m_headerRowList.size(); i++)
	{
		row = this.m_headerRowList.get(i);
		row.insertNewCellAtWithColumn(index, newColumn, overwriteAtPosition);
	}
	for (i = 0; i < this.m_rowList.size(); i++)
	{
		row = this.m_rowList.get(i);
		if (oFF.notNull(row))
		{
			row.insertNewCellAtWithColumn(index, newColumn, overwriteAtPosition);
		}
	}
	if (index > 0)
	{
		this.adaptMergedColumns(index, this.m_headerRowList);
		this.adaptMergedColumns(index, this.m_rowList);
	}
};
oFF.SacTable.prototype.putColumnHeaderGroupMapping = function(group, baseGroup)
{
	this.m_columnHeaderMap.put(group, baseGroup);
};
oFF.SacTable.prototype.putRowHeaderGroupMapping = function(group, baseGroup)
{
	this.m_rowHeaderMap.put(group, baseGroup);
};
oFF.SacTable.prototype.releaseObject = function()
{
	this.m_rowList = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_rowList);
	this.m_headerRowList = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_headerRowList);
	this.m_columnList = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_columnList);
	this.m_headerColumnList = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_headerColumnList);
	this.m_dataPointStyles = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_dataPointStyles);
	this.m_tableMarkups = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_tableMarkups);
	this.m_layeredRectangularStyles = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_layeredRectangularStyles);
	this.m_preColumnsAmount = -1;
	this.m_dataColumnsAmount = -1;
	this.m_dataRowAmount = -1;
	this.m_freezeHeaderRows = false;
	this.m_freezeHeaderColumns = false;
	this.m_showGrid = false;
	this.m_showTableTitle = false;
	this.m_showFreezeLines = false;
	this.m_showSubTitle = false;
	this.m_showTableDetails = false;
	this.m_stripeDataRows = false;
	this.m_stripeDataColumns = false;
	this.m_tableMemberHeaderHandling = null;
	this.m_rowsMemberHeaderHandling = null;
	this.m_columnsMemberHeaderHandling = null;
	this.m_reversedHierarchy = false;
	this.m_title = null;
	this.m_headerColor = null;
	this.m_showCoordinateHeader = false;
	this.m_width = -1;
	this.m_height = -1;
	this.m_minCellWidth = -1;
	this.m_maxCellWidth = -1;
	this.m_maxRecommendedCellWidth = -1;
	this.m_cellChartInfo = oFF.XObjectExt.release(this.m_cellChartInfo);
	this.m_totalLevel6Color = null;
	this.m_totalLevel5Color = null;
	this.m_totalLevel4Color = null;
	this.m_totalLevel3Color = null;
	this.m_totalLevel2Color = null;
	this.m_totalLevel1Color = null;
	this.m_totalLevel0Color = null;
	this.m_rowStart = -1;
	this.m_rowEnd = -1;
	this.m_colStart = -1;
	this.m_colEnd = -1;
	oFF.SacTableFormattableElement.prototype.releaseObject.call( this );
};
oFF.SacTable.prototype.removeColumnCells = function(index)
{
	let h;
	let rowObject;
	for (h = 0; h < this.m_headerRowList.size(); h++)
	{
		rowObject = this.m_headerRowList.get(h);
		rowObject.removeCellAt(index);
	}
	for (h = 0; h < this.m_rowList.size(); h++)
	{
		rowObject = this.m_rowList.get(h);
		if (oFF.notNull(rowObject))
		{
			rowObject.removeCellAt(index);
		}
	}
};
oFF.SacTable.prototype.removeDataColumnAt = function(index)
{
	this.m_columnList.removeAt(index);
	this.removeColumnCells(index + this.m_headerColumnList.size());
};
oFF.SacTable.prototype.removeDataRowAt = function(index)
{
	this.removeRow(this.m_rowList, index);
	this.adaptMergedRows(index, this.m_rowList);
};
oFF.SacTable.prototype.removeHeaderColumnAt = function(index)
{
	this.m_headerColumnList.removeAt(index);
	this.removeColumnCells(index);
};
oFF.SacTable.prototype.removeRow = function(rowList, index)
{
	let row = rowList.get(index);
	if (oFF.notNull(row))
	{
		row.remove();
	}
};
oFF.SacTable.prototype.resetCellMerger = function(columnIndex, cells)
{
	for (let nci = columnIndex; nci < cells.size(); nci++)
	{
		let cell = cells.get(nci);
		if (cell.getMergedColumns() < 0)
		{
			cell.setMergedColumnsInternal(0);
			cell.setMergedRowsInternal(0);
		}
		else
		{
			break;
		}
	}
};
oFF.SacTable.prototype.resetRenderingScope = function()
{
	this.m_rowStart = -1;
	this.m_rowEnd = -1;
	this.m_colStart = -1;
	this.m_colEnd = -1;
};
oFF.SacTable.prototype.setColorateHeaderCells = function(colorateHeaderCells)
{
	this.m_headerColor = colorateHeaderCells ? "rgba(173, 212, 216, 1)" : null;
};
oFF.SacTable.prototype.setColorateTotals = function(colorateTotals)
{
	this.m_totalLevel5Color = colorateTotals ? "rgba(220,220,150,0.3)" : null;
	this.m_totalLevel4Color = colorateTotals ? "rgba(230,230,150,0.4)" : null;
	this.m_totalLevel3Color = colorateTotals ? "rgba(220,220,135,0.4)" : null;
	this.m_totalLevel2Color = colorateTotals ? "rgba(220,220,135,0.5)" : null;
	this.m_totalLevel1Color = colorateTotals ? "rgba(220,220,220,1)" : null;
	this.m_totalLevel0Color = colorateTotals ? "rgba(204,204,204,1)" : null;
};
oFF.SacTable.prototype.setColumnInsertOrHidePresent = function()
{
	this.m_columnInsertOrHidePresent = true;
};
oFF.SacTable.prototype.setColumnsMemberHeaderHandling = function(tableMemberHeaderHandling)
{
	this.m_columnsMemberHeaderHandling = tableMemberHeaderHandling;
};
oFF.SacTable.prototype.setDataColumnsAmount = function(dataColumnsAmount)
{
	this.m_dataColumnsAmount = dataColumnsAmount;
};
oFF.SacTable.prototype.setDataRowAmount = function(dataRowAmount)
{
	this.m_dataRowAmount = dataRowAmount;
};
oFF.SacTable.prototype.setDefaultRowHeight = function(defaultRowHeight)
{
	this.m_defaultRowHeight = defaultRowHeight;
};
oFF.SacTable.prototype.setFreezeHeaderColumns = function(freezeColumns)
{
	this.m_freezeHeaderColumns = freezeColumns;
};
oFF.SacTable.prototype.setFreezeHeaderRows = function(freezeRows)
{
	this.m_freezeHeaderRows = freezeRows;
};
oFF.SacTable.prototype.setFreezeUpToColumn = function(freezeUpToColumns)
{
	this.m_freezeUpToColumn = freezeUpToColumns;
};
oFF.SacTable.prototype.setFreezeUpToRow = function(freezeUpToRows)
{
	this.m_freezeUpToRow = freezeUpToRows;
};
oFF.SacTable.prototype.setHasHierarchy = function(hasHierarchy)
{
	this.m_hasHierarchyActive = hasHierarchy;
};
oFF.SacTable.prototype.setHeaderColor = function(headerColor)
{
	this.m_headerColor = headerColor;
};
oFF.SacTable.prototype.setHeight = function(height)
{
	this.m_height = height;
};
oFF.SacTable.prototype.setMaxCellWidth = function(maxCellWidth)
{
	this.m_maxCellWidth = maxCellWidth;
};
oFF.SacTable.prototype.setMaxColumns = function(maxColumns)
{
	this.m_maxColumns = maxColumns;
};
oFF.SacTable.prototype.setMaxRecommendedCellWidth = function(maxRecommendedCellWidth)
{
	this.m_maxRecommendedCellWidth = maxRecommendedCellWidth;
};
oFF.SacTable.prototype.setMaxRows = function(maxRows)
{
	this.m_maxRows = maxRows;
};
oFF.SacTable.prototype.setMergeRepetitiveHeaderCells = function(mergeRepetitiveHeaderCells)
{
	this.m_tableMemberHeaderHandling = oFF.SacTableMemberHeaderHandling.MERGE;
};
oFF.SacTable.prototype.setMinCellWidth = function(minCellWidth)
{
	this.m_minCellWidth = minCellWidth;
};
oFF.SacTable.prototype.setPreColumnsAmount = function(preColumnsAmount)
{
	this.m_preColumnsAmount = preColumnsAmount;
};
oFF.SacTable.prototype.setPreRowsAmount = function(preRowsAmount)
{
	this.m_preRowsAmount = preRowsAmount;
};
oFF.SacTable.prototype.setRenderingScope = function(rowStart, rowEnd, colStart, colEnd)
{
	this.m_rowStart = rowStart;
	this.m_rowEnd = rowEnd;
	this.m_colStart = colStart;
	this.m_colEnd = colEnd;
};
oFF.SacTable.prototype.setRepetitiveHeaderNames = function(repetitiveHeaderNames)
{
	this.m_tableMemberHeaderHandling = oFF.SacTableMemberHeaderHandling.REPETITIVE;
	this.formatHeaderColumnWidths();
	this.formatDataColumnWidths();
};
oFF.SacTable.prototype.setReversedHierarchy = function(reversedHierarchy)
{
	this.m_reversedHierarchy = reversedHierarchy;
};
oFF.SacTable.prototype.setRowInsertOrHidePresent = function()
{
	this.m_rowInsertOrHidePresent = true;
};
oFF.SacTable.prototype.setRowsMemberHeaderHandling = function(tableMemberHeaderHandling)
{
	this.m_rowsMemberHeaderHandling = tableMemberHeaderHandling;
};
oFF.SacTable.prototype.setShowCoordinateHeader = function(showCoordinateHeader)
{
	this.m_showCoordinateHeader = showCoordinateHeader;
};
oFF.SacTable.prototype.setShowFreezeLines = function(showFreezeLines)
{
	this.m_showFreezeLines = showFreezeLines;
};
oFF.SacTable.prototype.setShowGrid = function(showGrid)
{
	this.m_showGrid = showGrid;
};
oFF.SacTable.prototype.setShowSubTitle = function(showSubTitle)
{
	this.m_showSubTitle = showSubTitle;
};
oFF.SacTable.prototype.setShowTableDetails = function(showTableDetails)
{
	this.m_showTableDetails = showTableDetails;
};
oFF.SacTable.prototype.setShowTableTitle = function(showTableTitle)
{
	this.m_showTableTitle = showTableTitle;
};
oFF.SacTable.prototype.setStripeDataColumns = function(stripeDataColumns)
{
	this.m_stripeDataColumns = stripeDataColumns;
};
oFF.SacTable.prototype.setStripeDataRows = function(stripeDataRows)
{
	this.m_stripeDataRows = stripeDataRows;
};
oFF.SacTable.prototype.setTableMemberHeaderHandling = function(tableMemberHeaderHandling)
{
	this.m_tableMemberHeaderHandling = tableMemberHeaderHandling;
};
oFF.SacTable.prototype.setTitle = function(title)
{
	this.m_title = title;
};
oFF.SacTable.prototype.setTotalLevel0Color = function(totalLevel0Color)
{
	this.m_totalLevel0Color = totalLevel0Color;
};
oFF.SacTable.prototype.setTotalLevel1Color = function(totalLevel1Color)
{
	this.m_totalLevel1Color = totalLevel1Color;
};
oFF.SacTable.prototype.setTotalLevel2Color = function(totalLevel2Color)
{
	this.m_totalLevel2Color = totalLevel2Color;
};
oFF.SacTable.prototype.setTotalLevel3Color = function(totalLevel3Color)
{
	this.m_totalLevel3Color = totalLevel3Color;
};
oFF.SacTable.prototype.setTotalLevel4Color = function(totalLevel4Color)
{
	this.m_totalLevel4Color = totalLevel4Color;
};
oFF.SacTable.prototype.setTotalLevel5Color = function(totalLevel5Color)
{
	this.m_totalLevel5Color = totalLevel5Color;
};
oFF.SacTable.prototype.setTotalLevel6Color = function(totalLevel6Color)
{
	this.m_totalLevel6Color = totalLevel6Color;
};
oFF.SacTable.prototype.setWidth = function(width)
{
	this.m_width = width;
};
oFF.SacTable.prototype.tryDeleteNullColumnAt = function(columnIndex)
{
	let deletionCondition = columnIndex < this.m_columnList.size() && this.m_columnList.get(columnIndex) === null;
	if (deletionCondition)
	{
		this.m_columnList.removeAt(columnIndex);
		let nullRemover = (row) => {
			row.removeCellAt(this.m_preColumnsAmount + columnIndex);
		};
		oFF.XCollectionUtils.forEach(this.m_headerRowList, nullRemover);
		oFF.XCollectionUtils.forEach(this.m_rowList, nullRemover);
	}
	return deletionCondition;
};
oFF.SacTable.prototype.tryDeleteNullRowAt = function(rowIndex)
{
	let deletionCondition = rowIndex < this.m_rowList.size() && this.m_rowList.get(rowIndex) === null;
	if (deletionCondition)
	{
		this.removeRow(this.m_rowList, rowIndex);
	}
	return deletionCondition;
};
oFF.SacTable.prototype.updateHeaderColumnStyles = function()
{
	oFF.XCollectionUtils.forEach(this.m_headerColumnList, (hc) => {
		hc.clearTableMarkups();
		hc.removePreviousChildren();
		hc.removeSubsequentChildren();
	});
	let columnList = oFF.XList.create();
	oFF.XCollectionUtils.forEach(this.m_headerColumnList, (hc) => {
		columnList.add(hc);
	});
	let consumer = (index, column) => {
		if (oFF.notNull(column))
		{
			column.setHeaderIndex(index.getInteger());
		}
	};
	let newColumnList = this.indexAndFormatTheTuples(0, columnList, consumer);
	this.m_preColumnsAmount = this.m_preColumnsAmount + newColumnList.size() - columnList.size();
};
oFF.SacTable.prototype.updateHeaderRowStyles = function()
{
	oFF.XCollectionUtils.forEach(this.m_headerRowList, (hr) => {
		hr.clearTableMarkups();
		hr.removePreviousChildren();
		hr.removeSubsequentChildren();
	});
	let consumer = (index, row) => {
		if (oFF.notNull(row))
		{
			row.setHeaderIndex(index.getInteger());
		}
	};
	let rowList = oFF.XList.create();
	oFF.XCollectionUtils.forEach(this.m_headerRowList, (hc) => {
		rowList.add(hc);
	});
	let newRowList = this.indexAndFormatTheTuples(0, rowList, consumer);
	this.m_preRowsAmount = this.m_preRowsAmount + newRowList.size() - rowList.size();
};
oFF.SacTable.prototype.updateStylesForColumns = function(columnList)
{
	let endIndex = -1;
	if (oFF.XCollectionUtils.hasElements(columnList))
	{
		let startIndex = this.m_columnList.getIndex(columnList.get(0));
		let consumer = (index, column) => {
			if (oFF.notNull(column))
			{
				column.setDataIndex(index.getInteger());
			}
		};
		let newColumnList = this.indexAndFormatTheTuples(startIndex, columnList, consumer);
		endIndex = startIndex + newColumnList.size() - 1;
		this.m_dataColumnsAmount = this.m_dataColumnsAmount + newColumnList.size() - columnList.size();
	}
	return endIndex;
};
oFF.SacTable.prototype.updateStylesForRows = function(rowList)
{
	let endIndex = -1;
	if (oFF.XCollectionUtils.hasElements(rowList))
	{
		let startIndex = this.m_rowList.getIndex(rowList.get(0));
		let consumer = (index, row) => {
			if (oFF.notNull(row))
			{
				row.setDataIndex(index.getInteger());
			}
		};
		let newRowList = this.indexAndFormatTheTuples(startIndex, rowList, consumer);
		this.m_dataRowAmount = this.m_dataRowAmount + newRowList.size() - rowList.size();
		endIndex = startIndex + newRowList.size() - 1;
		let rowListForWidth = oFF.XList.create();
		oFF.XCollectionUtils.forEach(newRowList, (r) => {
			rowListForWidth.add(r);
		});
		this.formatWidthList(rowListForWidth);
	}
	return endIndex;
};

oFF.SacTableAxis = function() {};
oFF.SacTableAxis.prototype = new oFF.SacTableFormattableElement();
oFF.SacTableAxis.prototype._ff_c = "SacTableAxis";

oFF.SacTableAxis.getSiblingGraceful = function(list, index)
{
	return index < 0 || index >= list.size() ? null : list.get(index);
};
oFF.SacTableAxis.prototype.m_childrenAfter = null;
oFF.SacTableAxis.prototype.m_childrenBefore = null;
oFF.SacTableAxis.prototype.m_dataIndex = 0;
oFF.SacTableAxis.prototype.m_dataPath = null;
oFF.SacTableAxis.prototype.m_header = false;
oFF.SacTableAxis.prototype.m_headerBand = false;
oFF.SacTableAxis.prototype.m_headerIndex = 0;
oFF.SacTableAxis.prototype.m_id = null;
oFF.SacTableAxis.prototype.m_irRelevantOrthogonalScopedStyles = null;
oFF.SacTableAxis.prototype.m_needsReIndex = false;
oFF.SacTableAxis.prototype.m_parent = null;
oFF.SacTableAxis.prototype.m_partOfHeaderSection = null;
oFF.SacTableAxis.prototype.m_relevantMarkups = null;
oFF.SacTableAxis.prototype.m_relevantOrthogonalScopedStyles = null;
oFF.SacTableAxis.prototype.m_relevantRectangularStyles = null;
oFF.SacTableAxis.prototype.m_scopedStyles = null;
oFF.SacTableAxis.prototype.m_table = null;
oFF.SacTableAxis.prototype.addChildAfter = function(childAfter, owningList)
{
	this.m_childrenAfter.add(childAfter);
	this.insertToOwningList(owningList, childAfter, 1);
};
oFF.SacTableAxis.prototype.addChildBefore = function(childBefore, owningList)
{
	this.m_childrenBefore.add(childBefore);
	this.insertToOwningList(owningList, childBefore, 0);
};
oFF.SacTableAxis.prototype.addPartOfHeaderSectionInfo = function(start, end)
{
	let sectionInfo = oFF.SacHeaderSectionInfoTag.createTag(start, end);
	this.m_partOfHeaderSection.add(sectionInfo);
	return sectionInfo;
};
oFF.SacTableAxis.prototype.addScopedStyle = function(scopedStyle)
{
	this.m_scopedStyles.add(scopedStyle);
};
oFF.SacTableAxis.prototype.addToLocalTupleList = function(updatedTupleList, tuple, index)
{
	if (oFF.notNull(updatedTupleList))
	{
		let localIndex = updatedTupleList.getIndex(this);
		if (localIndex > -1)
		{
			updatedTupleList.insert(localIndex + index, tuple);
		}
	}
};
oFF.SacTableAxis.prototype.applyHeaderHandling = function(updatedTupleList)
{
	if (this.getEffectiveMemberHeaderHandling() === oFF.SacTableMemberHeaderHandling.BAND)
	{
		let maxLevel = this.getHeaderGroupNames().size() - 1;
		if (this.isTotalsContext())
		{
			this.handleTotalsBand(maxLevel);
		}
		else
		{
			let newTuples = oFF.XList.create();
			for (let i = 0; i < maxLevel; i++)
			{
				this.prependBandTuple(newTuples, i, updatedTupleList);
			}
			if (newTuples.size() > 0)
			{
				this.m_needsReIndex = true;
			}
		}
	}
	return this.m_needsReIndex;
};
oFF.SacTableAxis.prototype.applyHightAndWidth = function() {};
oFF.SacTableAxis.prototype.applyInsertedTuples = function(tuplesBefore, tupleConsumer)
{
	if (oFF.XCollectionUtils.hasElements(tuplesBefore))
	{
		oFF.XStream.of(tuplesBefore).forEach(tupleConsumer);
	}
};
oFF.SacTableAxis.prototype.applyRectangularStyles = function()
{
	this.clearRectangularMarkups();
	this.m_relevantRectangularStyles = oFF.XStream.of(this.getParentTable().getLayeredRectangularStyles()).filter(this.geRectangularStyleMatchPredicate()).collect(oFF.XStreamCollector.toList());
};
oFF.SacTableAxis.prototype.applyTableMarkups = function(updatedTupleList)
{
	let beforeAdder = (tupleDescription1) => {
		this.addTupleBefore(tupleDescription1, updatedTupleList);
	};
	let afterAdder = (tupleDescription2) => {
		this.addTupleAfter(tupleDescription2, updatedTupleList);
	};
	oFF.XStream.of(this.m_relevantMarkups).forEach((markup) => {
		this.applyInsertedTuples(markup.getTuplesBefore(), beforeAdder);
		this.applyInsertedTuples(markup.getTuplesAfter(), afterAdder);
		this.markIndexShift();
	});
	if (this.isEffectivelyHidden())
	{
		if (oFF.notNull(updatedTupleList))
		{
			updatedTupleList.removeElement(this);
		}
		this.removeSingle();
		this.markIndexShift();
	}
	this.applyHightAndWidth();
	return this.m_needsReIndex;
};
oFF.SacTableAxis.prototype.checkOrthogonalScopedStyle = function(style)
{
	let result;
	if (this.m_relevantOrthogonalScopedStyles.contains(style))
	{
		result = true;
	}
	else if (this.m_irRelevantOrthogonalScopedStyles.contains(style))
	{
		result = false;
	}
	else
	{
		result = this.matchesOrthogonal(style);
		if (result)
		{
			this.m_relevantOrthogonalScopedStyles.add(style);
		}
		else
		{
			this.m_irRelevantOrthogonalScopedStyles.add(style);
		}
	}
	return result;
};
oFF.SacTableAxis.prototype.clearRectangularMarkups = function()
{
	this.m_relevantRectangularStyles = oFF.XObjectExt.release(this.m_relevantRectangularStyles);
};
oFF.SacTableAxis.prototype.clearScopedStyles = function()
{
	this.m_scopedStyles.clear();
};
oFF.SacTableAxis.prototype.clearTableMarkups = function()
{
	this.m_relevantMarkups = oFF.XObjectExt.release(this.m_relevantMarkups);
	this.m_relevantOrthogonalScopedStyles = oFF.XObjectExt.release(this.m_relevantOrthogonalScopedStyles);
	this.m_irRelevantOrthogonalScopedStyles = oFF.XObjectExt.release(this.m_irRelevantOrthogonalScopedStyles);
};
oFF.SacTableAxis.prototype.getDataPath = function()
{
	return this.m_dataPath;
};
oFF.SacTableAxis.prototype.getEffectiveMemberHeaderHandling = function()
{
	let headerHandling = this.getTableMemberHeaderHandling();
	if (oFF.isNull(headerHandling))
	{
		headerHandling = this.getParentTable().getTableMemberHeaderHandling();
	}
	return headerHandling;
};
oFF.SacTableAxis.prototype.getFullIndex = function()
{
	let headerIndex = this.m_headerIndex;
	return headerIndex === -1 ? this.m_headerIndex + this.m_dataIndex : headerIndex;
};
oFF.SacTableAxis.prototype.getFullSize = function()
{
	return this.getHeadersSize() + this.getDataSize();
};
oFF.SacTableAxis.prototype.getHeaderFieldSize = function()
{
	return this.getHeadersSize();
};
oFF.SacTableAxis.prototype.getId = function()
{
	return this.m_id;
};
oFF.SacTableAxis.prototype.getMatchingOrthogonalStyles = function(tableMarkup)
{
	return this.getMatchingStyles(tableMarkup.getScopedStyles());
};
oFF.SacTableAxis.prototype.getMatchingRectangularStyles = function(createIfMissing)
{
	if (createIfMissing && oFF.isNull(this.m_relevantRectangularStyles))
	{
		this.applyRectangularStyles();
	}
	return this.m_relevantRectangularStyles;
};
oFF.SacTableAxis.prototype.getMatchingStyles = function(scopedStyles)
{
	if (oFF.isNull(this.m_relevantOrthogonalScopedStyles))
	{
		this.m_relevantOrthogonalScopedStyles = oFF.XList.create();
	}
	if (oFF.isNull(this.m_irRelevantOrthogonalScopedStyles))
	{
		this.m_irRelevantOrthogonalScopedStyles = oFF.XList.create();
	}
	return oFF.XStream.of(scopedStyles).filterNullValues().filter((style) => {
		return this.checkOrthogonalScopedStyle(style);
	}).map((scs) => {
		return scs.getStyle();
	}).collect(oFF.XStreamCollector.toList());
};
oFF.SacTableAxis.prototype.getMatchingTableMarkups = function(createIfMissing)
{
	if (createIfMissing && oFF.isNull(this.m_relevantMarkups))
	{
		this.indexTableMarkups();
	}
	return this.m_relevantMarkups;
};
oFF.SacTableAxis.prototype.getParent = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_parent);
};
oFF.SacTableAxis.prototype.getParentTable = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_table);
};
oFF.SacTableAxis.prototype.getPartOfHeaderSectionInfos = function()
{
	return this.m_partOfHeaderSection;
};
oFF.SacTableAxis.prototype.getScopedStyles = function()
{
	return this.m_scopedStyles;
};
oFF.SacTableAxis.prototype.handleTotalsBand = function(maxLevel) {};
oFF.SacTableAxis.prototype.indexTableMarkups = function()
{
	this.m_relevantMarkups = oFF.XStream.of(this.getParentTable().getTableMarkups()).filter(this.getTableMarkupMatchPredicate()).sorted(oFF.SacTableMarkupComparator.getInstance()).collect(oFF.XStreamCollector.toList());
};
oFF.SacTableAxis.prototype.insertToOwningList = function(owningList, childBefore, offset)
{
	if (oFF.notNull(owningList))
	{
		let index = owningList.getIndex(childBefore);
		if (index > -1)
		{
			owningList.insert(index + offset, childBefore);
		}
	}
};
oFF.SacTableAxis.prototype.isBaseElement = function()
{
	return this.getParent() === null;
};
oFF.SacTableAxis.prototype.isHeader = function()
{
	return this.m_header;
};
oFF.SacTableAxis.prototype.isHeaderBand = function()
{
	return this.m_headerBand;
};
oFF.SacTableAxis.prototype.isHiddenByMarkup = function()
{
	return oFF.XStream.of(this.m_relevantMarkups).anyMatch((rm) => {
		return rm.isHide();
	});
};
oFF.SacTableAxis.prototype.matchesSacTableSectionInfo = function(tableAxisSectionReference)
{
	let headerSize = this.getHeadersSize();
	let headerFieldSize = this.getHeaderFieldSize();
	let dataSize = this.getDataSize();
	let matching = false;
	let matchModulo = tableAxisSectionReference.getMatchModulo();
	let neverMatch = matchModulo === -2;
	let matchRegardlessOfPosition = (matchModulo === 0 || matchModulo === 1) && tableAxisSectionReference.getMatchSkipFirst() === 0 && tableAxisSectionReference.getMatchSkipLast() === 0;
	if (!neverMatch && tableAxisSectionReference.isMatchFullHeaderSection() && tableAxisSectionReference.isMatchFullDataSection())
	{
		matching = tableAxisSectionReference.matchesPosition(this.getFullIndex(), this.getFullSize(), 0, 0);
	}
	else if (!neverMatch && tableAxisSectionReference.isMatchFullHeaderSection() && oFF.XCollectionUtils.hasElements(this.m_partOfHeaderSection))
	{
		matching = tableAxisSectionReference.matchesPosition(this.m_headerIndex, this.getHeadersSize(), 0, 0);
	}
	else if (!neverMatch && tableAxisSectionReference.isMatchFullDataSection() && oFF.XCollectionUtils.hasElements(this.m_dataPath.getPathElements()))
	{
		matching = tableAxisSectionReference.matchesPosition(this.m_dataIndex, this.getDataSize(), 0, 0);
	}
	if (!neverMatch && !matching && tableAxisSectionReference.isMatchHeaderSectionStart() && this.m_headerIndex === 0)
	{
		matching = true;
	}
	if (!neverMatch && !matching && this.m_headerIndex > -1 && tableAxisSectionReference.isMatchHeaderFieldsSectionEnd() && this.m_headerIndex === headerFieldSize - 1)
	{
		matching = true;
	}
	if (!neverMatch && !matching && this.m_headerIndex > -1 && tableAxisSectionReference.isMatchHeaderSectionEnd() && this.m_headerIndex === headerSize - 1)
	{
		matching = true;
	}
	if (!neverMatch && !matching && tableAxisSectionReference.isMatchDataSectionStart() && this.m_dataIndex === 0)
	{
		matching = true;
	}
	if (!neverMatch && !matching && this.m_dataIndex > -1 && tableAxisSectionReference.isMatchDataSectionEnd() && this.m_dataIndex === dataSize - 1)
	{
		matching = true;
	}
	if (!neverMatch && !matching && oFF.XCollectionUtils.hasElements(this.m_partOfHeaderSection))
	{
		matching = oFF.XStream.of(this.m_partOfHeaderSection).filter((poh) => {
			return poh.matchesSectionReference(tableAxisSectionReference);
		}).anyMatch((ppoohh) => {
			let subResultHeader = matchRegardlessOfPosition;
			if (!subResultHeader)
			{
				let startHeader1 = this.searchBackHeaderReference(ppoohh, this.m_headerIndex);
				let endHeader1 = this.searchForwardHeaderReference(ppoohh, this.m_headerIndex, headerSize);
				subResultHeader = tableAxisSectionReference.matchesPosition(this.m_headerIndex - startHeader1, endHeader1 - startHeader1 + 1, 0, 0);
			}
			return subResultHeader;
		});
	}
	if (!neverMatch && !matching && oFF.XCollectionUtils.hasElements(this.m_dataPath.getPathElements()))
	{
		let referencePaths = tableAxisSectionReference.getDataPaths();
		let startData2 = dataSize;
		let endData2 = -1;
		for (let i = 0; i < referencePaths.size(); i++)
		{
			let element = referencePaths.get(i);
			let maxGroupLevel = element.getMaxHeaderGroupLevel(this.getHeaderGroupNames(), this.getHeaderGroupMap());
			if (this.m_dataPath.matches(element, maxGroupLevel))
			{
				if (matchRegardlessOfPosition)
				{
					matching = true;
					break;
				}
				startData2 = oFF.XMath.min(startData2, this.searchBackDataReference(this.m_dataPath, this.m_dataIndex, dataSize, maxGroupLevel, element));
				endData2 = oFF.XMath.max(endData2, this.searchForwardDataReference(this.m_dataPath, this.m_dataIndex, dataSize, maxGroupLevel, element));
			}
		}
		if (!matching)
		{
			matching = startData2 <= endData2 && tableAxisSectionReference.matchesPosition(this.m_dataIndex - startData2, endData2 - startData2 + 1, 0, 0);
		}
	}
	return matching;
};
oFF.SacTableAxis.prototype.prependBandTuple = function(newTuples, maxLevel, updatedTupleList) {};
oFF.SacTableAxis.prototype.releaseObject = function()
{
	this.m_table = null;
	this.m_id = null;
	this.m_header = false;
	this.m_partOfHeaderSection = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_partOfHeaderSection);
	this.m_dataPath = oFF.XObjectExt.release(this.m_dataPath);
	this.m_relevantMarkups = oFF.XObjectExt.release(this.m_relevantMarkups);
	this.m_relevantRectangularStyles = oFF.XObjectExt.release(this.m_relevantRectangularStyles);
	this.m_relevantOrthogonalScopedStyles = oFF.XObjectExt.release(this.m_relevantOrthogonalScopedStyles);
	this.m_irRelevantOrthogonalScopedStyles = oFF.XObjectExt.release(this.m_irRelevantOrthogonalScopedStyles);
	this.m_scopedStyles = oFF.XObjectExt.release(this.m_scopedStyles);
	this.m_headerIndex = -1;
	this.m_dataIndex = -1;
	this.m_childrenBefore = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_childrenBefore);
	this.m_childrenAfter = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_childrenAfter);
	oFF.SacTableFormattableElement.prototype.releaseObject.call( this );
};
oFF.SacTableAxis.prototype.searchBackDataReference = function(info, index, size, groupLevel, reference)
{
	let result;
	if (this.m_dataPath.containsLevel(groupLevel) && this.m_dataPath.matchesTag(info, groupLevel, reference))
	{
		if (index === 0)
		{
			result = index;
		}
		else
		{
			let sibling = this.getDataSiblingAt(index - 1);
			if (oFF.isNull(sibling))
			{
				return oFF.XMath.max(index - 1, 0);
			}
			else
			{
				result = sibling.searchBackDataReference(info, index - 1, size, groupLevel, reference);
			}
		}
	}
	else
	{
		result = oFF.XMath.min(index + 1, size - 1);
	}
	return result;
};
oFF.SacTableAxis.prototype.searchBackHeaderReference = function(info, index)
{
	let result;
	if (index === 0 || oFF.XStream.of(this.m_partOfHeaderSection).anyMatch((hsi) => {
		return hsi.isSectionStart() && hsi.matchesTag(info);
	}))
	{
		result = index;
	}
	else
	{
		let sibling = this.getHeaderSiblingAt(index - 1);
		if (oFF.isNull(sibling))
		{
			result = index - 1;
		}
		else
		{
			result = sibling.searchBackHeaderReference(info, index - 1);
		}
	}
	return result;
};
oFF.SacTableAxis.prototype.searchForwardDataReference = function(info, index, size, groupLevel, reference)
{
	let result;
	if (this.m_dataPath.containsLevel(groupLevel) && this.m_dataPath.matchesTag(info, groupLevel, reference))
	{
		if (index === size - 1)
		{
			result = index;
		}
		else
		{
			let sibling = this.getDataSiblingAt(index + 1);
			if (oFF.isNull(sibling))
			{
				result = oFF.XMath.min(index + 1, size);
			}
			else
			{
				result = sibling.searchForwardDataReference(info, index + 1, size, groupLevel, reference);
			}
		}
	}
	else
	{
		result = oFF.XMath.max(0, index - 1);
	}
	return result;
};
oFF.SacTableAxis.prototype.searchForwardHeaderReference = function(info, index, size)
{
	let result;
	if (index === size - 1 || oFF.XStream.of(this.m_partOfHeaderSection).anyMatch((hsi) => {
		return hsi.isSectionEnd() && hsi.matchesTag(info);
	}))
	{
		result = index;
	}
	else
	{
		let sibling = this.getHeaderSiblingAt(index + 1);
		if (oFF.isNull(sibling))
		{
			result = index + 1;
		}
		else
		{
			result = sibling.searchForwardHeaderReference(info, index + 1, size);
		}
	}
	return result;
};
oFF.SacTableAxis.prototype.setDataIndex = function(dataIndex)
{
	this.m_needsReIndex = false;
	this.m_dataIndex = dataIndex;
	this.clearTableMarkups();
};
oFF.SacTableAxis.prototype.setHeader = function(header)
{
	this.m_header = header;
};
oFF.SacTableAxis.prototype.setHeaderBand = function(headerBand)
{
	this.m_headerBand = headerBand;
};
oFF.SacTableAxis.prototype.setHeaderIndex = function(headerIndex)
{
	this.m_needsReIndex = false;
	this.m_headerIndex = headerIndex;
	this.clearTableMarkups();
};
oFF.SacTableAxis.prototype.setId = function(id)
{
	if (!oFF.XString.isEqual(id, this.m_id))
	{
		this.m_id = id;
	}
};
oFF.SacTableAxis.prototype.setNeedsReIndex = function()
{
	this.m_needsReIndex = true;
};
oFF.SacTableAxis.prototype.setupInternal = function(sacTable)
{
	this.m_table = oFF.XWeakReferenceUtil.getWeakRef(sacTable);
	this.m_partOfHeaderSection = oFF.XList.create();
	this.m_dataPath = oFF.SacDataPathTag.createTag();
	this.m_scopedStyles = oFF.XList.create();
	this.m_childrenBefore = oFF.XList.create();
	this.m_childrenAfter = oFF.XList.create();
	this.m_headerIndex = -1;
	this.m_dataIndex = -1;
};

oFF.SacTableCellAbstract = function() {};
oFF.SacTableCellAbstract.prototype = new oFF.SacTableFormattableElement();
oFF.SacTableCellAbstract.prototype._ff_c = "SacTableCellAbstract";

oFF.SacTableCellAbstract.prototype.m_allowDragDrop = false;
oFF.SacTableCellAbstract.prototype.m_commentDocumentId = null;
oFF.SacTableCellAbstract.prototype.m_exceptionInformations = null;
oFF.SacTableCellAbstract.prototype.m_expanded = false;
oFF.SacTableCellAbstract.prototype.m_formatted = null;
oFF.SacTableCellAbstract.prototype.m_formattingPattern = null;
oFF.SacTableCellAbstract.prototype.m_hierarchyLevel = 0;
oFF.SacTableCellAbstract.prototype.m_hierarchyPaddingType = null;
oFF.SacTableCellAbstract.prototype.m_hierarchyPaddingValue = 0;
oFF.SacTableCellAbstract.prototype.m_id = null;
oFF.SacTableCellAbstract.prototype.m_inHierarchy = false;
oFF.SacTableCellAbstract.prototype.m_inStructureContext = false;
oFF.SacTableCellAbstract.prototype.m_inUdhContext = false;
oFF.SacTableCellAbstract.prototype.m_initialHeader = false;
oFF.SacTableCellAbstract.prototype.m_lengthAddition = 0;
oFF.SacTableCellAbstract.prototype.m_mergedColumns = 0;
oFF.SacTableCellAbstract.prototype.m_mergedRows = 0;
oFF.SacTableCellAbstract.prototype.m_parentColumn = null;
oFF.SacTableCellAbstract.prototype.m_parentRow = null;
oFF.SacTableCellAbstract.prototype.m_plain = null;
oFF.SacTableCellAbstract.prototype.m_repeatedHeader = false;
oFF.SacTableCellAbstract.prototype.m_scaling = 0;
oFF.SacTableCellAbstract.prototype.m_scalingText = null;
oFF.SacTableCellAbstract.prototype.m_showDrillIcon = false;
oFF.SacTableCellAbstract.prototype.m_showHyperlink = false;
oFF.SacTableCellAbstract.prototype.m_type = 0;
oFF.SacTableCellAbstract.prototype.m_unitInformation = null;
oFF.SacTableCellAbstract.prototype.m_valueException = null;
oFF.SacTableCellAbstract.prototype.m_wrap = false;
oFF.SacTableCellAbstract.prototype.m_wrappedText = null;
oFF.SacTableCellAbstract.prototype.addNewExceptionInformation = function()
{
	let exceptionInfo = oFF.SacExceptionInfo.create();
	this.m_exceptionInformations.add(exceptionInfo);
	return exceptionInfo;
};
oFF.SacTableCellAbstract.prototype.clearExceptionInformations = function()
{
	this.m_exceptionInformations.clear();
};
oFF.SacTableCellAbstract.prototype.getCommentDocumentId = function()
{
	return this.m_commentDocumentId;
};
oFF.SacTableCellAbstract.prototype.getEffectiveBackgroundContent = function(styles)
{
	return this.getEffectiveStringProperty(styles, (ts) => {
		return ts.getBackgroundContent();
	});
};
oFF.SacTableCellAbstract.prototype.getEffectiveBackgroundPatternType = function(styles)
{
	let type = null;
	let size = oFF.XCollectionUtils.size(styles);
	for (let i = 0; i < size; i++)
	{
		let style = styles.get(i);
		type = style.getBackgroundPatternType();
		if (oFF.notNull(type) && type !== oFF.VisualizationBackgroundPatternType.INHERIT)
		{
			break;
		}
	}
	return type;
};
oFF.SacTableCellAbstract.prototype.getEffectiveCellChartBarColor = function(styles)
{
	return this.getEffectiveStringProperty(styles, (ts) => {
		return ts.getCellChartBarColor();
	});
};
oFF.SacTableCellAbstract.prototype.getEffectiveCellChartLineColor = function(styles)
{
	return this.getEffectiveStringProperty(styles, (ts) => {
		return ts.getCellChartLineColor();
	});
};
oFF.SacTableCellAbstract.prototype.getEffectiveCellChartMemberName = function(styles)
{
	let name = this.getCellChartMemberName();
	if (oFF.isNull(name))
	{
		name = this.getParentRow().getCellChartMemberName();
	}
	if (oFF.isNull(name))
	{
		name = this.getParentColumn().getCellChartMemberName();
	}
	return name;
};
oFF.SacTableCellAbstract.prototype.getEffectiveCellChartOrientation = function()
{
	let orientation = this.getCellChartOrientation();
	if (oFF.isNull(orientation))
	{
		orientation = this.getParentRow().getCellChartOrientation();
	}
	if (oFF.isNull(orientation))
	{
		orientation = this.getParentColumn().getCellChartOrientation();
	}
	return orientation;
};
oFF.SacTableCellAbstract.prototype.getEffectiveCellChartType = function()
{
	let type = this.getCellChartType();
	if (oFF.isNull(type))
	{
		type = this.getParentRow().getCellChartType();
	}
	if (oFF.isNull(type))
	{
		type = this.getParentColumn().getCellChartType();
	}
	return type;
};
oFF.SacTableCellAbstract.prototype.getEffectiveCellType = function()
{
	let cellType = this.m_type;
	if (this.getMergedColumns() < 0 || this.getMergedRows() < 0)
	{
		cellType = oFF.SacTableConstants.CT_MERGED_DUMMY_CELL;
	}
	else if (this.m_type === -1 && this.getParentRow().isHeader())
	{
		cellType = oFF.SacTableConstants.CT_HEADER;
	}
	return cellType;
};
oFF.SacTableCellAbstract.prototype.getEffectiveFillAlphaOverwrite = function(styles)
{
	let size = oFF.XCollectionUtils.size(styles);
	let alpha = -1;
	for (let i = 0; i < size; i++)
	{
		if (oFF.XStringUtils.isNotNullAndNotEmpty(styles.get(i).getFillColor()))
		{
			alpha = styles.get(i).getFillAlpha();
		}
	}
	return alpha;
};
oFF.SacTableCellAbstract.prototype.getEffectiveFillColor = function(styles)
{
	let size = oFF.XCollectionUtils.size(styles);
	let color = null;
	for (let i = 0; i < size && oFF.isNull(color); i++)
	{
		color = styles.get(i).getFillColor();
	}
	if (oFF.isNull(color) && this.isHeaderCell())
	{
		color = this.getParentRow().getParentTable().getHeaderColor();
	}
	if (oFF.isNull(color) && !this.isHeaderCell() && this.isEffectiveTotalsContext() && this.getEffectiveTotalLevel() > -1)
	{
		let parentTable = this.getParentRow().getParentTable();
		switch (this.getEffectiveTotalLevel())
		{
			case 0:
				color = parentTable.getTotalLevel0Color();
				break;

			case 1:
				color = parentTable.getTotalLevel1Color();
				break;

			case 2:
				color = parentTable.getTotalLevel2Color();
				break;

			case 3:
				color = parentTable.getTotalLevel3Color();
				break;

			case 4:
				color = parentTable.getTotalLevel4Color();
				break;

			case 5:
				color = parentTable.getTotalLevel5Color();
				break;

			case 6:
				color = parentTable.getTotalLevel6Color();
				break;
		}
	}
	return color;
};
oFF.SacTableCellAbstract.prototype.getEffectiveFontColor = function(styles)
{
	return this.getEffectiveStringProperty(styles, (ts) => {
		return ts.getFontColor();
	});
};
oFF.SacTableCellAbstract.prototype.getEffectiveFontFamily = function(styles)
{
	return this.getEffectiveStringProperty(styles, (ts) => {
		return ts.getFontFamily();
	});
};
oFF.SacTableCellAbstract.prototype.getEffectiveFontSize = function(styles)
{
	let collectionSize = oFF.XCollectionUtils.size(styles);
	let size = 0;
	for (let i = 0; i < collectionSize && size === 0; i++)
	{
		size = styles.get(i).getFontSize();
	}
	return size;
};
oFF.SacTableCellAbstract.prototype.getEffectiveFormattedText = function(styles)
{
	let overrideText = null;
	let overridePlaceholder = null;
	let showFormattedText = null;
	let i;
	let size = oFF.XCollectionUtils.size(styles);
	for (i = 0; i < size && oFF.isNull(overrideText); i++)
	{
		overrideText = styles.get(i).getOverrideText();
	}
	for (i = 0; i < size && oFF.isNull(overridePlaceholder); i++)
	{
		overridePlaceholder = styles.get(i).getOverridePlaceholderForFormattedText();
	}
	for (i = 0; i < size && !oFF.TriStateBool.isExplicitBooleanValue(showFormattedText); i++)
	{
		showFormattedText = styles.get(i).isShowFormattedText();
	}
	let parentColumn = this.getParentColumn();
	let parentRow = this.getParentRow();
	let parentTable = parentColumn.getParentTable();
	let isParentColumnHeader = parentColumn.isHeader();
	let isParentRowHeader = parentRow.isHeader();
	let isColumnFirstOnPage = parentTable.isColumnPaginated() && isParentRowHeader && !isParentColumnHeader && parentTable.getColumnList().getIndex(parentColumn) === 0;
	let isRowFirstOnPage = parentTable.isRowPaginated() && isParentColumnHeader && !isParentRowHeader && parentTable.getRowList().getIndex(parentRow) === 0;
	let effectivelyShow = oFF.TriStateBool.getBooleanWithFallback(showFormattedText, !(this.getEffectiveMemberHeaderHandling() === oFF.SacTableMemberHeaderHandling.BAND && isParentColumnHeader && this.isInitialHeader()) && !this.isRepeatedHeader() || isColumnFirstOnPage || isRowFirstOnPage || this.isEffectiveRepetitiveHeaderCells());
	let result = "";
	if (effectivelyShow)
	{
		if (oFF.XStringUtils.isNullOrEmpty(overrideText))
		{
			result = this.getFormatted();
		}
		else if (oFF.XStringUtils.isNullOrEmpty(overridePlaceholder))
		{
			result = overrideText;
		}
		else
		{
			result = oFF.XString.replace(overrideText, overridePlaceholder, this.getFormatted());
		}
	}
	return result;
};
oFF.SacTableCellAbstract.prototype.getEffectiveFormattingPattern = function(styles)
{
	let showFormattedText = null;
	let size = oFF.XCollectionUtils.size(styles);
	for (let i = 0; i < size && !oFF.TriStateBool.isExplicitBooleanValue(showFormattedText); i++)
	{
		showFormattedText = styles.get(i).isShowFormattedText();
	}
	let effectivelyShow = oFF.TriStateBool.getBooleanWithFallback(showFormattedText, !(this.getEffectiveMemberHeaderHandling() === oFF.SacTableMemberHeaderHandling.BAND && this.getParentRow().isHeader() && this.isInitialHeader()) && !this.isRepeatedHeader() || this.isEffectiveRepetitiveHeaderCells());
	return effectivelyShow ? this.getFormattingPattern() : "";
};
oFF.SacTableCellAbstract.prototype.getEffectiveHorizontalAlignment = function(styles)
{
	let collectionSize = oFF.XCollectionUtils.size(styles);
	let alignment = null;
	for (let i = 0; i < collectionSize && oFF.isNull(alignment) || alignment === oFF.SacVisualizationHorizontalAlignment.INHERIT; i++)
	{
		alignment = styles.get(i).getHorizontalAlignment();
	}
	return alignment;
};
oFF.SacTableCellAbstract.prototype.getEffectiveMemberHeaderHandling = function()
{
	let tableMemberHeaderHandling = null;
	if (this.getParentRow().isHeader())
	{
		tableMemberHeaderHandling = this.getParentRow().getEffectiveMemberHeaderHandling();
		if (oFF.isNull(tableMemberHeaderHandling))
		{
			tableMemberHeaderHandling = this.getParentRow().getParentTable().getRowsMemberHeaderHandling();
		}
	}
	if (oFF.isNull(tableMemberHeaderHandling) && this.getParentColumn().isHeader())
	{
		tableMemberHeaderHandling = this.getParentColumn().getEffectiveMemberHeaderHandling();
		if (oFF.isNull(tableMemberHeaderHandling))
		{
			tableMemberHeaderHandling = this.getParentColumn().getParentTable().getColumnsMemberHeaderHandling();
		}
	}
	if (oFF.isNull(tableMemberHeaderHandling))
	{
		tableMemberHeaderHandling = this.getParentColumn().getParentTable().getTableMemberHeaderHandling();
	}
	return tableMemberHeaderHandling;
};
oFF.SacTableCellAbstract.prototype.getEffectiveStringProperty = function(styles, accessFunction)
{
	let collectionSize = oFF.XCollectionUtils.size(styles);
	let stringProperty = null;
	for (let i = 0; i < collectionSize && oFF.isNull(stringProperty); i++)
	{
		stringProperty = accessFunction(styles.get(i));
	}
	return stringProperty;
};
oFF.SacTableCellAbstract.prototype.getEffectiveStyle = function()
{
	let prioritizedStylesList = this.getPrioritizedStylesList();
	let mergedStyle = oFF.SacTableStyle.create();
	mergedStyle.setBackgroundContent(this.getEffectiveBackgroundContent(prioritizedStylesList));
	mergedStyle.setBackgroundPatternType(this.getEffectiveBackgroundPatternType(prioritizedStylesList));
	mergedStyle.setCellChartBarColor(this.getEffectiveCellChartBarColor(prioritizedStylesList));
	mergedStyle.setCellChartLineColor(this.getEffectiveCellChartLineColor(prioritizedStylesList));
	mergedStyle.setFillColor(this.getEffectiveFillColor(prioritizedStylesList));
	mergedStyle.setFillAlpha(this.getEffectiveFillAlphaOverwrite(prioritizedStylesList));
	mergedStyle.setFontColor(this.getEffectiveFontColor(prioritizedStylesList));
	mergedStyle.setFontBold(this.isEffectiveFontBold(prioritizedStylesList));
	mergedStyle.setFontItalic(this.isEffectiveFontItalic(prioritizedStylesList));
	mergedStyle.setFontSize(this.getEffectiveFontSize(prioritizedStylesList));
	mergedStyle.setFontFamily(this.getEffectiveFontFamily(prioritizedStylesList));
	mergedStyle.setFontStrikeThrough(this.isEffectiveFontStrikeThrough(prioritizedStylesList));
	mergedStyle.setFontUnderline(this.isEffectiveFontUnderline(prioritizedStylesList));
	mergedStyle.setWrap(this.isEffectiveWrap(prioritizedStylesList));
	mergedStyle.setHorizontalAlignment(this.getEffectiveHorizontalAlignment(prioritizedStylesList));
	mergedStyle.setVerticalAlignment(this.getEffectiveVerticalAlignment(prioritizedStylesList));
	let i = 0;
	let overrideText = null;
	let overridePlaceholder = null;
	let showFormattedText = null;
	for (i = 0; i < prioritizedStylesList.size() && oFF.isNull(overrideText); i++)
	{
		overrideText = prioritizedStylesList.get(i).getOverrideText();
	}
	for (i = 0; i < prioritizedStylesList.size() && oFF.isNull(overridePlaceholder); i++)
	{
		overridePlaceholder = prioritizedStylesList.get(i).getOverridePlaceholderForFormattedText();
	}
	for (i = 0; i < prioritizedStylesList.size() && !oFF.TriStateBool.isExplicitBooleanValue(showFormattedText); i++)
	{
		showFormattedText = prioritizedStylesList.get(i).isShowFormattedText();
	}
	mergedStyle.setOverrideText(overrideText);
	mergedStyle.setOverridePlaceholderForFormattedText(overridePlaceholder);
	mergedStyle.setShowFormattedText(showFormattedText);
	mergedStyle.setStyledLineBottom(this.getEffectiveStyleLineBottom(prioritizedStylesList));
	mergedStyle.setStyledLineTop(this.getEffectiveStyledLineTop(prioritizedStylesList));
	mergedStyle.setStyledLineLeft(this.getEffectiveStyledLineLeft(prioritizedStylesList));
	mergedStyle.setStyledLineRight(this.getEffectiveStyledLineRight(prioritizedStylesList));
	mergedStyle.setThresholdColor(this.getEffectiveThresholdColor(prioritizedStylesList));
	mergedStyle.setThresholdType(this.getEffectiveThresholdType(prioritizedStylesList));
	return mergedStyle;
};
oFF.SacTableCellAbstract.prototype.getEffectiveStyleLineBottom = function(styles)
{
	return this.getEffectiveStyledLine(styles, (sl) => {
		return sl.getStyledLineBottomIfExists();
	});
};
oFF.SacTableCellAbstract.prototype.getEffectiveStyledLine = function(styles, existence)
{
	let lineStyle = null;
	let mayBeIncomplete = true;
	let size = oFF.XCollectionUtils.size(styles);
	for (let i = 0; mayBeIncomplete && i < size; i++)
	{
		let newLineStyle = existence(styles.get(i));
		if (oFF.notNull(newLineStyle))
		{
			if (oFF.isNull(lineStyle))
			{
				lineStyle = oFF.SacStyledLine.create();
			}
			mayBeIncomplete = lineStyle.mergeIntoMe(newLineStyle);
		}
	}
	return lineStyle;
};
oFF.SacTableCellAbstract.prototype.getEffectiveStyledLineLeft = function(styles)
{
	return this.getEffectiveStyledLine(styles, (sl) => {
		return sl.getStyledLineLeftIfExists();
	});
};
oFF.SacTableCellAbstract.prototype.getEffectiveStyledLineRight = function(styles)
{
	return this.getEffectiveStyledLine(styles, (sl) => {
		return sl.getStyledLineRightIfExists();
	});
};
oFF.SacTableCellAbstract.prototype.getEffectiveStyledLineTop = function(styles)
{
	return this.getEffectiveStyledLine(styles, (sl) => {
		return sl.getStyledLineTopIfExists();
	});
};
oFF.SacTableCellAbstract.prototype.getEffectiveThresholdColor = function(styles)
{
	return this.getEffectiveStringProperty(styles, (ts) => {
		return ts.getThresholdColor();
	});
};
oFF.SacTableCellAbstract.prototype.getEffectiveThresholdType = function(styles)
{
	let thresholdType = null;
	let size = oFF.XCollectionUtils.size(styles);
	for (let i = 0; i < size && oFF.isNull(thresholdType); i++)
	{
		thresholdType = styles.get(i).getThresholdType();
	}
	return thresholdType;
};
oFF.SacTableCellAbstract.prototype.getEffectiveTotalLevel = function()
{
	let totalLevel = -1;
	if (this.getParentRow().isTotalsContext())
	{
		totalLevel = this.getParentRow().getTotalLevel();
	}
	if (this.getParentColumn().isTotalsContext())
	{
		totalLevel = oFF.XMath.min(this.getParentColumn().getTotalLevel(), totalLevel);
	}
	return totalLevel;
};
oFF.SacTableCellAbstract.prototype.getEffectiveVerticalAlignment = function(styles)
{
	let collectionSize = oFF.XCollectionUtils.size(styles);
	let alignment = null;
	for (let i = 0; i < collectionSize && oFF.isNull(alignment) || alignment === oFF.SacVisualizationVerticalAlignment.INHERIT; i++)
	{
		alignment = styles.get(i).getVerticalAlignment();
	}
	return alignment;
};
oFF.SacTableCellAbstract.prototype.getEffectiveWrappedFormattedText = function(styles)
{
	let result = this.getWrapped();
	if (oFF.XStringUtils.isNullOrEmpty(result))
	{
		result = this.getEffectiveFormattedText(styles);
	}
	return result;
};
oFF.SacTableCellAbstract.prototype.getExceptionInformations = function()
{
	return this.m_exceptionInformations;
};
oFF.SacTableCellAbstract.prototype.getFormatted = function()
{
	return this.m_formatted;
};
oFF.SacTableCellAbstract.prototype.getFormattingPattern = function()
{
	return this.m_formattingPattern;
};
oFF.SacTableCellAbstract.prototype.getHierarchyLevel = function()
{
	return this.m_hierarchyLevel;
};
oFF.SacTableCellAbstract.prototype.getHierarchyPaddingType = function()
{
	return this.m_hierarchyPaddingType;
};
oFF.SacTableCellAbstract.prototype.getHierarchyPaddingValue = function()
{
	return this.m_hierarchyPaddingValue;
};
oFF.SacTableCellAbstract.prototype.getId = function()
{
	return this.m_id;
};
oFF.SacTableCellAbstract.prototype.getLengthAddition = function()
{
	return this.m_lengthAddition;
};
oFF.SacTableCellAbstract.prototype.getMergedColumns = function()
{
	return this.m_mergedColumns;
};
oFF.SacTableCellAbstract.prototype.getMergedRows = function()
{
	return this.m_mergedRows;
};
oFF.SacTableCellAbstract.prototype.getParentColumn = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_parentColumn);
};
oFF.SacTableCellAbstract.prototype.getParentRow = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_parentRow);
};
oFF.SacTableCellAbstract.prototype.getPlain = function()
{
	return this.m_plain;
};
oFF.SacTableCellAbstract.prototype.getScaling = function()
{
	return this.m_scaling;
};
oFF.SacTableCellAbstract.prototype.getScalingText = function()
{
	return this.m_scalingText;
};
oFF.SacTableCellAbstract.prototype.getStylePriority = function()
{
	return 1;
};
oFF.SacTableCellAbstract.prototype.getType = function()
{
	return this.m_type;
};
oFF.SacTableCellAbstract.prototype.getUnitInformation = function()
{
	return this.m_unitInformation;
};
oFF.SacTableCellAbstract.prototype.getValueException = function()
{
	return this.m_valueException;
};
oFF.SacTableCellAbstract.prototype.getWrapped = function()
{
	return this.m_wrappedText;
};
oFF.SacTableCellAbstract.prototype.isAllowDragDrop = function()
{
	return this.m_allowDragDrop;
};
oFF.SacTableCellAbstract.prototype.isDimensionHeader = function()
{
	return this.getType() === oFF.SacTableConstants.CT_COL_DIM_HEADER || this.getType() === oFF.SacTableConstants.CT_ROW_DIM_HEADER;
};
oFF.SacTableCellAbstract.prototype.isEffectiveFontBold = function(styles)
{
	return this.isEffectiveFontFace(styles, (ts) => {
		return ts.isFontBoldExt();
	}, this.isEffectiveTotalsContext());
};
oFF.SacTableCellAbstract.prototype.isEffectiveFontFace = function(styles, accessor, defaultTrue)
{
	let size = oFF.XCollectionUtils.size(styles);
	let face = null;
	for (let i = 0; i < size && (oFF.isNull(face) || face === oFF.TriStateBool._DEFAULT); i++)
	{
		face = accessor(styles.get(i));
	}
	if ((oFF.isNull(face) || face === oFF.TriStateBool._DEFAULT) && defaultTrue)
	{
		face = oFF.TriStateBool._TRUE;
	}
	return face === oFF.TriStateBool._TRUE;
};
oFF.SacTableCellAbstract.prototype.isEffectiveFontItalic = function(styles)
{
	return this.isEffectiveFontFace(styles, (ts) => {
		return ts.isFontItalicExt();
	}, false);
};
oFF.SacTableCellAbstract.prototype.isEffectiveFontStrikeThrough = function(styles)
{
	return this.isEffectiveFontFace(styles, (ts) => {
		return ts.isFontStrikeThroughExt();
	}, false);
};
oFF.SacTableCellAbstract.prototype.isEffectiveFontUnderline = function(styles)
{
	return this.isEffectiveFontFace(styles, (ts) => {
		return ts.isFontUnderlineExt();
	}, false);
};
oFF.SacTableCellAbstract.prototype.isEffectiveHideNumberForCellChart = function()
{
	return this.isHideNumberForCellChart() || this.getParentRow().isHideNumberForCellChart() || this.getParentColumn().isHideNumberForCellChart();
};
oFF.SacTableCellAbstract.prototype.isEffectiveMergeRepetitiveHeaderCells = function()
{
	return this.getEffectiveMemberHeaderHandling() === oFF.SacTableMemberHeaderHandling.MERGE || this.getEffectiveMemberHeaderHandling() === oFF.SacTableMemberHeaderHandling.BAND && this.getParentRow().isHeader();
};
oFF.SacTableCellAbstract.prototype.isEffectiveRepetitiveHeaderCells = function()
{
	return this.getEffectiveMemberHeaderHandling() === oFF.SacTableMemberHeaderHandling.REPETITIVE;
};
oFF.SacTableCellAbstract.prototype.isEffectiveShowCellChart = function()
{
	return !this.isHeaderCell() && (this.isShowCellChart() || this.getParentRow().isShowCellChart() || this.getParentColumn().isShowCellChart());
};
oFF.SacTableCellAbstract.prototype.isEffectiveTotalsContext = function()
{
	return this.isTotalsContext() || !this.isHeaderCell() && (this.getParentRow().isTotalsContext() || this.getParentColumn().isTotalsContext());
};
oFF.SacTableCellAbstract.prototype.isEffectiveWrap = function(styles)
{
	return this.isEffectiveFontFace(styles, (ts) => {
		return ts.getWrapExt();
	}, false);
};
oFF.SacTableCellAbstract.prototype.isExpanded = function()
{
	return this.m_expanded;
};
oFF.SacTableCellAbstract.prototype.isHeaderCell = function()
{
	return this.getParentColumn().isHeader() || this.getParentRow().isHeader();
};
oFF.SacTableCellAbstract.prototype.isInHierarchy = function()
{
	return this.m_inHierarchy;
};
oFF.SacTableCellAbstract.prototype.isInStructureContext = function()
{
	return this.m_inStructureContext;
};
oFF.SacTableCellAbstract.prototype.isInitialHeader = function()
{
	return this.m_initialHeader;
};
oFF.SacTableCellAbstract.prototype.isLastHeaderRow = function()
{
	let parentRow = this.getParentRow();
	let headerRowList = parentRow.getParentTable().getHeaderRowList();
	let headerRowsSize = headerRowList.size();
	return headerRowsSize > 0 && this.getParentRow() === headerRowList.get(headerRowsSize - 1);
};
oFF.SacTableCellAbstract.prototype.isRepeatedHeader = function()
{
	return this.m_repeatedHeader;
};
oFF.SacTableCellAbstract.prototype.isShowDrillIcon = function()
{
	return this.m_showDrillIcon;
};
oFF.SacTableCellAbstract.prototype.isShowHyperLink = function()
{
	return this.m_showHyperlink;
};
oFF.SacTableCellAbstract.prototype.isStyleApplicable = function(st)
{
	return !oFF.XCollectionUtils.hasElements(st.getCellTypeRestrictions()) || oFF.XStream.of(st.getCellTypeRestrictions()).anyMatch((ctr) => {
		return ctr.matches(this);
	});
};
oFF.SacTableCellAbstract.prototype.isUdhContext = function()
{
	return this.m_inUdhContext;
};
oFF.SacTableCellAbstract.prototype.isUnbooked = function()
{
	return this.m_type === oFF.SacTableConstants.CT_UNBOOKED;
};
oFF.SacTableCellAbstract.prototype.isWrap = function()
{
	return this.m_wrap;
};
oFF.SacTableCellAbstract.prototype.releaseObject = function()
{
	this.m_parentRow = null;
	this.m_parentColumn = null;
	this.m_lengthAddition = 0;
	this.m_id = null;
	this.m_type = -1;
	this.m_formatted = null;
	this.m_plain = null;
	this.m_allowDragDrop = false;
	this.m_repeatedHeader = false;
	this.m_initialHeader = false;
	this.m_inHierarchy = false;
	this.m_inStructureContext = false;
	this.m_inUdhContext = false;
	this.m_hierarchyLevel = 0;
	this.m_showDrillIcon = false;
	this.m_hierarchyPaddingType = null;
	this.m_hierarchyPaddingValue = 0;
	this.m_expanded = false;
	this.m_commentDocumentId = null;
	this.m_mergedColumns = 0;
	this.m_mergedRows = 0;
	this.m_exceptionInformations = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_exceptionInformations);
	oFF.SacTableFormattableElement.prototype.releaseObject.call( this );
};
oFF.SacTableCellAbstract.prototype.setAllowDragDrop = function(allowDragDrop)
{
	this.m_allowDragDrop = allowDragDrop;
};
oFF.SacTableCellAbstract.prototype.setCommentDocumentId = function(commentDocumentId)
{
	this.m_commentDocumentId = commentDocumentId;
};
oFF.SacTableCellAbstract.prototype.setExpanded = function(expanded)
{
	this.m_expanded = expanded;
};
oFF.SacTableCellAbstract.prototype.setFormatted = function(formatted)
{
	this.m_formatted = formatted;
};
oFF.SacTableCellAbstract.prototype.setFormattingPattern = function(formattingPattern)
{
	this.m_formattingPattern = formattingPattern;
};
oFF.SacTableCellAbstract.prototype.setHierarchyLevel = function(hierarchyLevel)
{
	this.m_hierarchyLevel = hierarchyLevel;
};
oFF.SacTableCellAbstract.prototype.setHierarchyPaddingType = function(hierarchyPaddingType)
{
	this.m_hierarchyPaddingType = hierarchyPaddingType;
};
oFF.SacTableCellAbstract.prototype.setHierarchyPaddingValue = function(hierarchyPaddingValue)
{
	this.m_hierarchyPaddingValue = hierarchyPaddingValue;
};
oFF.SacTableCellAbstract.prototype.setId = function(id)
{
	this.m_id = id;
};
oFF.SacTableCellAbstract.prototype.setInHierarchy = function(inHierarchy)
{
	this.m_inHierarchy = inHierarchy;
};
oFF.SacTableCellAbstract.prototype.setInStructureContext = function(inStructureContext)
{
	this.m_inStructureContext = inStructureContext;
};
oFF.SacTableCellAbstract.prototype.setInitialHeader = function(initialHeader)
{
	this.m_initialHeader = initialHeader;
};
oFF.SacTableCellAbstract.prototype.setLengthAddition = function(lengthAddition)
{
	this.m_lengthAddition = lengthAddition;
};
oFF.SacTableCellAbstract.prototype.setMergedColumns = function(mergedColumns)
{
	this.m_mergedColumns = mergedColumns;
	this.getParentRow().getParentTable().adaptMergedCells(this);
};
oFF.SacTableCellAbstract.prototype.setMergedColumnsInternal = function(mergedColumns)
{
	this.m_mergedColumns = mergedColumns;
};
oFF.SacTableCellAbstract.prototype.setMergedRows = function(mergedRows)
{
	this.m_mergedRows = mergedRows;
	this.getParentRow().getParentTable().adaptMergedCells(this);
};
oFF.SacTableCellAbstract.prototype.setMergedRowsInternal = function(mergedRows)
{
	this.m_mergedRows = mergedRows;
};
oFF.SacTableCellAbstract.prototype.setPlain = function(plain)
{
	this.m_plain = plain;
};
oFF.SacTableCellAbstract.prototype.setPlainString = function(plainString)
{
	this.m_plain = oFF.XStringValue.create(plainString);
};
oFF.SacTableCellAbstract.prototype.setRepeatedHeader = function(repeatedHeader)
{
	this.m_repeatedHeader = repeatedHeader;
};
oFF.SacTableCellAbstract.prototype.setScaling = function(scaling)
{
	this.m_scaling = scaling;
};
oFF.SacTableCellAbstract.prototype.setScalingText = function(scaling)
{
	this.m_scalingText = scaling;
};
oFF.SacTableCellAbstract.prototype.setShowDrillIcon = function(showDrillIcon)
{
	this.m_showDrillIcon = showDrillIcon;
};
oFF.SacTableCellAbstract.prototype.setShowHyperLink = function(showHyperLink)
{
	this.m_showHyperlink = showHyperLink;
};
oFF.SacTableCellAbstract.prototype.setType = function(type)
{
	this.m_type = type;
};
oFF.SacTableCellAbstract.prototype.setUdhContext = function(udhContext)
{
	this.m_inUdhContext = udhContext;
};
oFF.SacTableCellAbstract.prototype.setUnitInformation = function(unitInformation)
{
	this.m_unitInformation = unitInformation;
};
oFF.SacTableCellAbstract.prototype.setValueException = function(valueException)
{
	this.m_valueException = valueException;
};
oFF.SacTableCellAbstract.prototype.setWrap = function(wrap)
{
	this.m_wrap = wrap;
};
oFF.SacTableCellAbstract.prototype.setWrapped = function(wrappedText)
{
	this.m_wrappedText = wrappedText;
};
oFF.SacTableCellAbstract.prototype.setupInternal = function(row, column)
{
	this.m_parentRow = oFF.XWeakReferenceUtil.getWeakRef(row);
	this.m_parentColumn = oFF.XWeakReferenceUtil.getWeakRef(column);
	this.m_exceptionInformations = oFF.XList.create();
	this.m_type = -1;
};

oFF.ChartAxisCategoryElement = function() {};
oFF.ChartAxisCategoryElement.prototype = new oFF.AbstractChartPart();
oFF.ChartAxisCategoryElement.prototype._ff_c = "ChartAxisCategoryElement";

oFF.ChartAxisCategoryElement.create = function(name, text, headerText, parentCategory, repeated, finalElement)
{
	let instance = new oFF.ChartAxisCategoryElement();
	instance.initializeAxis(name, text, headerText, parentCategory, repeated, finalElement);
	return instance;
};
oFF.ChartAxisCategoryElement.prototype.m_expanded = false;
oFF.ChartAxisCategoryElement.prototype.m_finalElement = false;
oFF.ChartAxisCategoryElement.prototype.m_headerText = null;
oFF.ChartAxisCategoryElement.prototype.m_hierarchyLevel = 0;
oFF.ChartAxisCategoryElement.prototype.m_inHierarchy = false;
oFF.ChartAxisCategoryElement.prototype.m_node = false;
oFF.ChartAxisCategoryElement.prototype.m_parentCategory = null;
oFF.ChartAxisCategoryElement.prototype.m_repeated = false;
oFF.ChartAxisCategoryElement.prototype.m_total = false;
oFF.ChartAxisCategoryElement.prototype.m_totalLevel = 0;
oFF.ChartAxisCategoryElement.prototype.getHeaderText = function()
{
	return this.m_headerText;
};
oFF.ChartAxisCategoryElement.prototype.getHierarchyLevel = function()
{
	return this.m_hierarchyLevel;
};
oFF.ChartAxisCategoryElement.prototype.getParentCategory = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_parentCategory);
};
oFF.ChartAxisCategoryElement.prototype.getTotalLevel = function()
{
	return this.m_totalLevel;
};
oFF.ChartAxisCategoryElement.prototype.initializeAxis = function(name, text, headerText, parentCategory, repeated, finalElement)
{
	this.initialize(name, text);
	this.m_headerText = headerText;
	this.m_parentCategory = oFF.XWeakReferenceUtil.getWeakRef(parentCategory);
	this.m_repeated = repeated;
	this.m_finalElement = finalElement;
};
oFF.ChartAxisCategoryElement.prototype.isExpanded = function()
{
	return this.m_expanded;
};
oFF.ChartAxisCategoryElement.prototype.isFinalElement = function()
{
	return this.m_finalElement;
};
oFF.ChartAxisCategoryElement.prototype.isInHierarchy = function()
{
	return this.m_inHierarchy;
};
oFF.ChartAxisCategoryElement.prototype.isNode = function()
{
	return this.m_node;
};
oFF.ChartAxisCategoryElement.prototype.isRepeatedElement = function()
{
	return this.m_repeated;
};
oFF.ChartAxisCategoryElement.prototype.isTotal = function()
{
	return this.m_total;
};
oFF.ChartAxisCategoryElement.prototype.releaseObject = function()
{
	this.m_parentCategory = null;
	this.m_repeated = false;
	this.m_finalElement = false;
	this.m_inHierarchy = false;
	this.m_hierarchyLevel = 0;
	this.m_expanded = false;
	this.m_node = false;
	this.m_total = false;
	this.m_totalLevel = 0;
	oFF.AbstractChartPart.prototype.releaseObject.call( this );
};
oFF.ChartAxisCategoryElement.prototype.setExpanded = function(expanded)
{
	this.m_expanded = expanded;
};
oFF.ChartAxisCategoryElement.prototype.setHeaderText = function(headerText)
{
	this.m_headerText = headerText;
};
oFF.ChartAxisCategoryElement.prototype.setHierarchyLevel = function(hierarchyLevel)
{
	this.m_hierarchyLevel = hierarchyLevel;
};
oFF.ChartAxisCategoryElement.prototype.setInHierarchy = function(inHierarchy)
{
	this.m_inHierarchy = inHierarchy;
};
oFF.ChartAxisCategoryElement.prototype.setIsFinalElement = function(finalElement)
{
	this.m_finalElement = finalElement;
};
oFF.ChartAxisCategoryElement.prototype.setIsRepeatedElement = function(repeatedElement)
{
	this.m_repeated = repeatedElement;
};
oFF.ChartAxisCategoryElement.prototype.setNode = function(node)
{
	this.m_node = node;
};
oFF.ChartAxisCategoryElement.prototype.setTotal = function(total)
{
	this.m_total = total;
};
oFF.ChartAxisCategoryElement.prototype.setTotalLevel = function(totalLevel)
{
	this.m_totalLevel = totalLevel;
};

oFF.ChartAxisPlotBand = function() {};
oFF.ChartAxisPlotBand.prototype = new oFF.ChartFormattableElement();
oFF.ChartAxisPlotBand.prototype._ff_c = "ChartAxisPlotBand";

oFF.ChartAxisPlotBand.create = function(name, text)
{
	let instance = new oFF.ChartAxisPlotBand();
	instance.initialize(name, text);
	return instance;
};
oFF.ChartAxisPlotBand.prototype.m_borderColor = null;
oFF.ChartAxisPlotBand.prototype.m_borderWidth = 0.0;
oFF.ChartAxisPlotBand.prototype.m_color = null;
oFF.ChartAxisPlotBand.prototype.m_from = 0.0;
oFF.ChartAxisPlotBand.prototype.m_to = 0.0;
oFF.ChartAxisPlotBand.prototype.getBorderColor = function()
{
	return this.m_borderColor;
};
oFF.ChartAxisPlotBand.prototype.getBorderWidth = function()
{
	return this.m_borderWidth;
};
oFF.ChartAxisPlotBand.prototype.getColor = function()
{
	return this.m_color;
};
oFF.ChartAxisPlotBand.prototype.getFrom = function()
{
	return this.m_from;
};
oFF.ChartAxisPlotBand.prototype.getTo = function()
{
	return this.m_to;
};
oFF.ChartAxisPlotBand.prototype.initialize = function(name, text)
{
	oFF.ChartFormattableElement.prototype.initialize.call( this , name, text);
};
oFF.ChartAxisPlotBand.prototype.releaseObject = function()
{
	oFF.ChartFormattableElement.prototype.releaseObject.call( this );
};
oFF.ChartAxisPlotBand.prototype.setBorderColor = function(borderColor)
{
	this.m_borderColor = borderColor;
};
oFF.ChartAxisPlotBand.prototype.setBorderWidth = function(borderWidth)
{
	this.m_borderWidth = borderWidth;
};
oFF.ChartAxisPlotBand.prototype.setColor = function(color)
{
	this.m_color = color;
};
oFF.ChartAxisPlotBand.prototype.setFrom = function(from)
{
	this.m_from = from;
};
oFF.ChartAxisPlotBand.prototype.setTo = function(to)
{
	this.m_to = to;
};

oFF.ChartDomainCategorial = function() {};
oFF.ChartDomainCategorial.prototype = new oFF.ChartDomainAbstract();
oFF.ChartDomainCategorial.prototype._ff_c = "ChartDomainCategorial";

oFF.ChartDomainCategorial.create = function(chartAxis, axisDomainType)
{
	let instance = new oFF.ChartDomainCategorial();
	instance.initialize("", "");
	instance.setupDomainType(chartAxis, axisDomainType);
	return instance;
};
oFF.ChartDomainCategorial.prototype.m_categories = null;
oFF.ChartDomainCategorial.prototype.m_colors = null;
oFF.ChartDomainCategorial.prototype.m_lineStyles = null;
oFF.ChartDomainCategorial.prototype.m_patterns = null;
oFF.ChartDomainCategorial.prototype.m_shapes = null;
oFF.ChartDomainCategorial.prototype.addAxisCategory = function(category)
{
	this.assignCategoryStyle(category);
	if (this.m_categories.size() > 0 && this.m_categories.get(this.m_categories.size() - 1) !== null)
	{
		this.m_categories.get(this.m_categories.size() - 1).obtainAdjacientProperties(category);
	}
	this.m_categories.add(category);
};
oFF.ChartDomainCategorial.prototype.addCategory = function(name, text)
{
	let category = oFF.ChartAxisCategory.create(name, text, this);
	this.assignCategoryStyle(category);
	this.m_categories.add(category);
	return category;
};
oFF.ChartDomainCategorial.prototype.addColor = function(color)
{
	this.m_colors.add(color);
};
oFF.ChartDomainCategorial.prototype.addLineStyle = function(lineStyle)
{
	this.m_lineStyles.add(lineStyle);
};
oFF.ChartDomainCategorial.prototype.addPattern = function(pattern)
{
	this.m_patterns.add(pattern);
};
oFF.ChartDomainCategorial.prototype.addShape = function(shape)
{
	this.m_shapes.add(shape);
};
oFF.ChartDomainCategorial.prototype.assignCategoryStyle = function(category)
{
	let newIndex = this.m_categories.size();
	let categoryStyle = category.getStyle();
	if (oFF.XCollectionUtils.hasElements(this.m_colors) && categoryStyle.getColor() === null)
	{
		categoryStyle.setColor(this.m_colors.get(oFF.XMath.mod(newIndex, this.m_colors.size())));
	}
	if (oFF.XCollectionUtils.hasElements(this.m_patterns) && categoryStyle.getPattern() === null && categoryStyle.getCustomPattern() === null)
	{
		categoryStyle.setPattern(this.m_patterns.get(oFF.XMath.mod(newIndex, this.m_patterns.size())));
	}
	if (oFF.XCollectionUtils.hasElements(this.m_shapes) && categoryStyle.getShape() === null && categoryStyle.getCustomShape() === null)
	{
		categoryStyle.setShape(this.m_shapes.get(oFF.XMath.mod(newIndex, this.m_shapes.size())));
	}
	if (oFF.XCollectionUtils.hasElements(this.m_lineStyles) && categoryStyle.getLineStyle() === null)
	{
		categoryStyle.setLineStyle(this.m_lineStyles.get(oFF.XMath.mod(newIndex, this.m_lineStyles.size())));
	}
};
oFF.ChartDomainCategorial.prototype.clearCategories = function()
{
	this.m_categories.clear();
};
oFF.ChartDomainCategorial.prototype.clearColors = function()
{
	this.m_colors.clear();
};
oFF.ChartDomainCategorial.prototype.clearLineStyles = function()
{
	this.m_lineStyles.clear();
};
oFF.ChartDomainCategorial.prototype.clearPatterns = function()
{
	this.m_patterns.clear();
};
oFF.ChartDomainCategorial.prototype.clearShapes = function()
{
	this.m_shapes.clear();
};
oFF.ChartDomainCategorial.prototype.getAsCategorial = function()
{
	return this;
};
oFF.ChartDomainCategorial.prototype.getCategories = function()
{
	return this.m_categories.getValuesAsReadOnlyList();
};
oFF.ChartDomainCategorial.prototype.getCategoryByName = function(name)
{
	return this.m_categories.getByKey(name);
};
oFF.ChartDomainCategorial.prototype.getCategoryIndex = function(category)
{
	return this.m_categories.getIndex(category);
};
oFF.ChartDomainCategorial.prototype.getCategoryIndexByName = function(name)
{
	return this.m_categories.getIndex(this.m_categories.getByKey(name));
};
oFF.ChartDomainCategorial.prototype.getColors = function()
{
	return this.m_colors;
};
oFF.ChartDomainCategorial.prototype.getLineStyles = function()
{
	return this.m_lineStyles;
};
oFF.ChartDomainCategorial.prototype.getPatterns = function()
{
	return this.m_patterns;
};
oFF.ChartDomainCategorial.prototype.getShapes = function()
{
	return this.m_shapes;
};
oFF.ChartDomainCategorial.prototype.initialize = function(name, text)
{
	oFF.ChartDomainAbstract.prototype.initialize.call( this , name, text);
	this.m_patterns = oFF.XList.create();
	this.m_shapes = oFF.XList.create();
	this.m_lineStyles = oFF.XList.create();
	this.m_colors = oFF.XList.create();
	this.m_categories = oFF.XListOfNameObject.create();
};
oFF.ChartDomainCategorial.prototype.isOrdinal = function()
{
	return this.getAxisDomainType() === oFF.ChartAxisDomainType.ORDINAL;
};
oFF.ChartDomainCategorial.prototype.putAllColors = function(colors)
{
	this.m_colors.addAll(colors);
};
oFF.ChartDomainCategorial.prototype.putAllLineStyles = function(lineStyles)
{
	this.m_lineStyles.addAll(lineStyles);
};
oFF.ChartDomainCategorial.prototype.putAllPatterns = function(patterns)
{
	this.m_patterns.addAll(patterns);
};
oFF.ChartDomainCategorial.prototype.putAllShapes = function(shapes)
{
	this.m_shapes.addAll(shapes);
};
oFF.ChartDomainCategorial.prototype.releaseObject = function()
{
	oFF.ChartDomainAbstract.prototype.releaseObject.call( this );
	this.m_categories = oFF.XObjectExt.release(this.m_categories);
	this.m_colors = oFF.XObjectExt.release(this.m_colors);
	this.m_patterns = oFF.XObjectExt.release(this.m_patterns);
	this.m_shapes = oFF.XObjectExt.release(this.m_shapes);
	this.m_lineStyles = oFF.XObjectExt.release(this.m_lineStyles);
};
oFF.ChartDomainCategorial.prototype.removeCategory = function(category)
{
	if (oFF.notNull(category))
	{
		this.m_categories.removeElement(category);
	}
};
oFF.ChartDomainCategorial.prototype.removeCategoryByName = function(name)
{
	this.removeCategory(this.m_categories.getByKey(name));
};

oFF.ChartDomainScalar = function() {};
oFF.ChartDomainScalar.prototype = new oFF.ChartDomainAbstract();
oFF.ChartDomainScalar.prototype._ff_c = "ChartDomainScalar";

oFF.ChartDomainScalar.create = function(chartAxis, axisDomainType)
{
	let instance = new oFF.ChartDomainScalar();
	instance.setupDomainType(chartAxis, axisDomainType);
	return instance;
};
oFF.ChartDomainScalar.prototype.m_max = 0.0;
oFF.ChartDomainScalar.prototype.m_min = 0.0;
oFF.ChartDomainScalar.prototype.getAsScalar = function()
{
	return this;
};
oFF.ChartDomainScalar.prototype.getMax = function()
{
	return this.m_max;
};
oFF.ChartDomainScalar.prototype.getMin = function()
{
	return this.m_min;
};
oFF.ChartDomainScalar.prototype.initialize = function(name, text)
{
	oFF.ChartDomainAbstract.prototype.initialize.call( this , name, text);
};
oFF.ChartDomainScalar.prototype.isRelational = function()
{
	return this.getAxisDomainType() === oFF.ChartAxisDomainType.RELATIONAL;
};
oFF.ChartDomainScalar.prototype.releaseObject = function()
{
	oFF.ChartDomainAbstract.prototype.releaseObject.call( this );
	this.m_min = 0;
	this.m_max = 0;
};
oFF.ChartDomainScalar.prototype.setMax = function(max)
{
	this.m_max = max;
};
oFF.ChartDomainScalar.prototype.setMin = function(min)
{
	this.m_min = min;
};

oFF.ChartLabelStyle = function() {};
oFF.ChartLabelStyle.prototype = new oFF.AbstractChartPart();
oFF.ChartLabelStyle.prototype._ff_c = "ChartLabelStyle";

oFF.ChartLabelStyle.create = function(name, text)
{
	let instance = new oFF.ChartLabelStyle();
	instance.initializeChartLabelStyle(name, text);
	return instance;
};
oFF.ChartLabelStyle.prototype.m_enabled = false;
oFF.ChartLabelStyle.prototype.m_fontColor = null;
oFF.ChartLabelStyle.prototype.m_fontFamily = null;
oFF.ChartLabelStyle.prototype.m_fontSize = null;
oFF.ChartLabelStyle.prototype.m_fontStyle = null;
oFF.ChartLabelStyle.prototype.m_fontWeight = null;
oFF.ChartLabelStyle.prototype.m_textAlign = null;
oFF.ChartLabelStyle.prototype.getFontColor = function()
{
	return this.m_fontColor;
};
oFF.ChartLabelStyle.prototype.getFontFamily = function()
{
	return this.m_fontFamily;
};
oFF.ChartLabelStyle.prototype.getFontSize = function()
{
	return this.m_fontSize;
};
oFF.ChartLabelStyle.prototype.getFontStyle = function()
{
	return this.m_fontStyle;
};
oFF.ChartLabelStyle.prototype.getFontWeight = function()
{
	return this.m_fontWeight;
};
oFF.ChartLabelStyle.prototype.getTextAlign = function()
{
	return this.m_textAlign;
};
oFF.ChartLabelStyle.prototype.initializeChartLabelStyle = function(name, text)
{
	oFF.AbstractChartPart.prototype.initialize.call( this , name, text);
};
oFF.ChartLabelStyle.prototype.isEnabled = function()
{
	return this.m_enabled;
};
oFF.ChartLabelStyle.prototype.releaseObject = function()
{
	oFF.AbstractChartPart.prototype.releaseObject.call( this );
};
oFF.ChartLabelStyle.prototype.setEnabled = function(enabled)
{
	this.m_enabled = enabled;
};
oFF.ChartLabelStyle.prototype.setFontColor = function(fontColor)
{
	this.m_fontColor = fontColor;
};
oFF.ChartLabelStyle.prototype.setFontFamily = function(fontFamily)
{
	this.m_fontFamily = fontFamily;
};
oFF.ChartLabelStyle.prototype.setFontSize = function(fontSize)
{
	this.m_fontSize = fontSize;
};
oFF.ChartLabelStyle.prototype.setFontStyle = function(fontStyle)
{
	this.m_fontStyle = fontStyle;
};
oFF.ChartLabelStyle.prototype.setFontWeight = function(fontWeight)
{
	this.m_fontWeight = fontWeight;
};
oFF.ChartLabelStyle.prototype.setTextAlign = function(textAlign)
{
	this.m_textAlign = textAlign;
};

oFF.ChartLegend = function() {};
oFF.ChartLegend.prototype = new oFF.AbstractChartPart();
oFF.ChartLegend.prototype._ff_c = "ChartLegend";

oFF.ChartLegend.create = function(name, text)
{
	let instance = new oFF.ChartLegend();
	instance.initializeChartLegend(name, text);
	return instance;
};
oFF.ChartLegend.prototype.m_horizontalAlignment = null;
oFF.ChartLegend.prototype.m_isEnabled = false;
oFF.ChartLegend.prototype.m_labelStyle = null;
oFF.ChartLegend.prototype.m_layoutDirection = null;
oFF.ChartLegend.prototype.m_verticalAlignment = null;
oFF.ChartLegend.prototype.getHorizontalAlignment = function()
{
	return this.m_horizontalAlignment;
};
oFF.ChartLegend.prototype.getLabelStyle = function()
{
	return this.m_labelStyle;
};
oFF.ChartLegend.prototype.getLayoutDirection = function()
{
	return this.m_layoutDirection;
};
oFF.ChartLegend.prototype.getVerticalAlignment = function()
{
	return this.m_verticalAlignment;
};
oFF.ChartLegend.prototype.initializeChartLegend = function(name, text)
{
	oFF.AbstractChartPart.prototype.initialize.call( this , name, text);
};
oFF.ChartLegend.prototype.isEnabled = function()
{
	return this.m_isEnabled;
};
oFF.ChartLegend.prototype.releaseObject = function()
{
	oFF.AbstractChartPart.prototype.releaseObject.call( this );
	oFF.XObjectExt.release(this.m_labelStyle);
};
oFF.ChartLegend.prototype.setEnabled = function(isEnabled)
{
	this.m_isEnabled = isEnabled;
};
oFF.ChartLegend.prototype.setHorizontalAlignment = function(horizontalAlignment)
{
	this.m_horizontalAlignment = horizontalAlignment;
};
oFF.ChartLegend.prototype.setLabelStyle = function(labelStyle)
{
	this.m_labelStyle = labelStyle;
};
oFF.ChartLegend.prototype.setLayoutDirection = function(layoutDirection)
{
	this.m_layoutDirection = layoutDirection;
};
oFF.ChartLegend.prototype.setVerticalAlignment = function(verticalAlignment)
{
	this.m_verticalAlignment = verticalAlignment;
};

oFF.ChartPlotArea = function() {};
oFF.ChartPlotArea.prototype = new oFF.AbstractChartPart();
oFF.ChartPlotArea.prototype._ff_c = "ChartPlotArea";

oFF.ChartPlotArea.create = function(name, text)
{
	let instance = new oFF.ChartPlotArea();
	instance.initializeChartPlotArea(name, text);
	return instance;
};
oFF.ChartPlotArea.prototype.m_labelStyle = null;
oFF.ChartPlotArea.prototype.getLabelStyle = function()
{
	return this.m_labelStyle;
};
oFF.ChartPlotArea.prototype.initializeChartPlotArea = function(name, text)
{
	oFF.AbstractChartPart.prototype.initialize.call( this , name, text);
};
oFF.ChartPlotArea.prototype.releaseObject = function()
{
	oFF.AbstractChartPart.prototype.releaseObject.call( this );
	oFF.XObjectExt.release(this.m_labelStyle);
};
oFF.ChartPlotArea.prototype.setLabelStyle = function(labelStyle)
{
	this.m_labelStyle = labelStyle;
};

oFF.SacTableFragmentColumn = function() {};
oFF.SacTableFragmentColumn.prototype = new oFF.SacTableAxisFragment();
oFF.SacTableFragmentColumn.prototype._ff_c = "SacTableFragmentColumn";

oFF.SacTableFragmentColumn._create = function(bundle)
{
	let instance = new oFF.SacTableFragmentColumn();
	instance.setupInternal(bundle);
	return instance;
};
oFF.SacTableFragmentColumn.prototype.m_width = 0;
oFF.SacTableFragmentColumn.prototype.addTupleAfter = function(tupleDescription, updatedTupleList)
{
	let child = oFF.SacTableFragmentColumn._create(this.getParentBundle());
	if (oFF.notNull(tupleDescription))
	{
		oFF.XStream.of(tupleDescription.getScopedStyles()).forEach((sc) => {
			child.addScopedStyle(sc);
		});
		child.setWidth(tupleDescription.getCellWidth());
	}
	this.addChildAfter(child, updatedTupleList);
	return child;
};
oFF.SacTableFragmentColumn.prototype.addTupleBefore = function(tupleDescription, updatedTupleList)
{
	let child = oFF.SacTableFragmentColumn._create(this.getParentBundle());
	if (oFF.notNull(tupleDescription))
	{
		oFF.XStream.of(tupleDescription.getScopedStyles()).forEach((sc) => {
			child.addScopedStyle(sc);
		});
		child.setWidth(tupleDescription.getCellWidth());
	}
	this.addChildBefore(child, updatedTupleList);
	return child;
};
oFF.SacTableFragmentColumn.prototype.geRectangularStyleMatchPredicate = function()
{
	return (rs) => {
		return this.matchesSacTableSectionInfo(rs.getColumnsRestriction());
	};
};
oFF.SacTableFragmentColumn.prototype.getDisplaysize = function()
{
	return this.getWidth();
};
oFF.SacTableFragmentColumn.prototype.getMarkupScope = function(tableMarkup)
{
	return tableMarkup.getColumnsScope();
};
oFF.SacTableFragmentColumn.prototype.getMatchScope = function(tm)
{
	return tm.getColumnsScope();
};
oFF.SacTableFragmentColumn.prototype.getOrthogonalStyleScope = function(style)
{
	return style.getOrthogonalColumnsRestriction();
};
oFF.SacTableFragmentColumn.prototype.getRectangularStyleScope = function(style)
{
	return style.getColumnsRestriction();
};
oFF.SacTableFragmentColumn.prototype.getWidth = function()
{
	return this.m_width;
};
oFF.SacTableFragmentColumn.prototype.matchesOrthogonal = function(style)
{
	return this.matchesSacTableSectionInfo(style.getOrthogonalColumnsRestriction());
};
oFF.SacTableFragmentColumn.prototype.releaseObject = function()
{
	oFF.SacTableAxisFragment.prototype.releaseObject.call( this );
};
oFF.SacTableFragmentColumn.prototype.setWidth = function(width)
{
	this.m_width = width;
};
oFF.SacTableFragmentColumn.prototype.setupInternal = function(bundle)
{
	oFF.SacTableAxisFragment.prototype.setupInternal.call( this , bundle);
};

oFF.SacTableFragmentRow = function() {};
oFF.SacTableFragmentRow.prototype = new oFF.SacTableAxisFragment();
oFF.SacTableFragmentRow.prototype._ff_c = "SacTableFragmentRow";

oFF.SacTableFragmentRow._create = function(bundle)
{
	let instance = new oFF.SacTableFragmentRow();
	instance.setupInternal(bundle);
	return instance;
};
oFF.SacTableFragmentRow.prototype.m_defaultHeightAddition = 0;
oFF.SacTableFragmentRow.prototype.m_height = 0;
oFF.SacTableFragmentRow.prototype.m_heightDiffersFromDefault = false;
oFF.SacTableFragmentRow.prototype.m_textBasedHeight = 0;
oFF.SacTableFragmentRow.prototype.addTupleAfter = function(tupleDescription, updatedTupleList)
{
	let child = oFF.SacTableFragmentRow._create(this.getParentBundle());
	if (oFF.notNull(tupleDescription))
	{
		oFF.XStream.of(tupleDescription.getScopedStyles()).forEach((sc) => {
			child.addScopedStyle(sc);
		});
		child.setHeight(tupleDescription.getCellHeight());
	}
	this.addChildAfter(child, updatedTupleList);
	return child;
};
oFF.SacTableFragmentRow.prototype.addTupleBefore = function(tupleDescription, updatedTupleList)
{
	let child = oFF.SacTableFragmentRow._create(this.getParentBundle());
	if (oFF.notNull(tupleDescription))
	{
		oFF.XStream.of(tupleDescription.getScopedStyles()).forEach((sc) => {
			child.addScopedStyle(sc);
		});
		child.setHeight(tupleDescription.getCellHeight());
	}
	this.addChildBefore(child, updatedTupleList);
	return child;
};
oFF.SacTableFragmentRow.prototype.applyHightAndWidth = function()
{
	let tableMarkups = this.getMatchingTableMarkups(false);
	let pathHeight = 0;
	let pathHeightAddition = 0;
	if (oFF.XCollectionUtils.hasElements(tableMarkups))
	{
		pathHeight = oFF.XStream.of(tableMarkups).map((m) => {
			return oFF.XIntegerValue.create(m.getCellHeight());
		}).reduce(oFF.XIntegerValue.create(0), (a, b) => {
			return oFF.XIntegerValue.create(oFF.XMath.max(a.getInteger(), b.getInteger()));
		}).getInteger();
		pathHeightAddition = oFF.XStream.of(tableMarkups).map((ma) => {
			return oFF.XIntegerValue.create(ma.getCellHeightAddition());
		}).reduce(oFF.XIntegerValue.create(0), (e, f) => {
			return oFF.XIntegerValue.create(oFF.XMath.max(e.getInteger(), f.getInteger()));
		}).getInteger();
	}
	this.m_height = oFF.XMath.max(pathHeight, this.m_height);
	this.m_defaultHeightAddition = pathHeightAddition;
	this.m_heightDiffersFromDefault = this.m_height !== this.getParentTable().getSacTableProxy().getDefaultRowHeight() || this.m_defaultHeightAddition !== 0;
};
oFF.SacTableFragmentRow.prototype.checkDefaultHeight = function()
{
	this.m_heightDiffersFromDefault = this.getHeight() !== this.getSacTableProxy().getDefaultRowHeight() || this.m_defaultHeightAddition !== 0;
};
oFF.SacTableFragmentRow.prototype.geRectangularStyleMatchPredicate = function()
{
	return (rs) => {
		return this.matchesSacTableSectionInfo(rs.getRowsRestriction());
	};
};
oFF.SacTableFragmentRow.prototype.getDefaultHeightAddition = function()
{
	return this.m_defaultHeightAddition;
};
oFF.SacTableFragmentRow.prototype.getDisplaysize = function()
{
	return this.getHeight() + this.getDefaultHeightAddition();
};
oFF.SacTableFragmentRow.prototype.getHeight = function()
{
	return oFF.XMath.max(this.m_height, this.m_textBasedHeight);
};
oFF.SacTableFragmentRow.prototype.getMarkupScope = function(tableMarkup)
{
	return tableMarkup.getRowsScope();
};
oFF.SacTableFragmentRow.prototype.getMatchScope = function(tm)
{
	return tm.getRowsScope();
};
oFF.SacTableFragmentRow.prototype.getOrthogonalStyleScope = function(style)
{
	return style.getOrthogonalRowsRestriction();
};
oFF.SacTableFragmentRow.prototype.getRectangularStyleScope = function(style)
{
	return style.getRowsRestriction();
};
oFF.SacTableFragmentRow.prototype.heightDiffersFromDefault = function()
{
	return this.m_heightDiffersFromDefault;
};
oFF.SacTableFragmentRow.prototype.matchesOrthogonal = function(style)
{
	return this.matchesSacTableSectionInfo(style.getOrthogonalRowsRestriction());
};
oFF.SacTableFragmentRow.prototype.prependBandTuple = function(newTuples, maxLevel, updatedTupleList, isPageBreakStylingBoundary, runningIndex)
{
	if (!this.isHeader() && (isPageBreakStylingBoundary && runningIndex === 0 || oFF.XStream.of(this.getDataPath().getPathElements()).anyMatch((pe) => {
		return pe.getGroupLevel() === maxLevel && pe.isGroupLevelStart();
	})))
	{
		let newTuple = this.addHeaderBandTuple(updatedTupleList);
		newTuple.setHeaderBand(true);
		newTuple.setHeaderLevel(maxLevel);
		let newDataPath = newTuple.getDataPath();
		oFF.XStream.of(this.getDataPath().getPathElements()).filter((dpe) => {
			return isPageBreakStylingBoundary && runningIndex === 0 || dpe.getGroupLevel() <= maxLevel;
		}).forEach((dpel) => {
			let npel = dpel.createCopy();
			newDataPath.add(npel);
			if (npel.getGroupLevel() === maxLevel)
			{
				npel.setHeaderBand(true);
				npel.setInnerBand(false);
			}
			newDataPath.addGroupLevelIndex(npel.getGroupLevel());
			newDataPath.updateMaxLevel(npel.getGroupLevel());
		});
		newTuples.add(newTuple);
		this.markIndexShift();
	}
};
oFF.SacTableFragmentRow.prototype.releaseObject = function()
{
	oFF.SacTableAxisFragment.prototype.releaseObject.call( this );
};
oFF.SacTableFragmentRow.prototype.resetTextHeight = function()
{
	this.m_textBasedHeight = 0;
	this.checkDefaultHeight();
};
oFF.SacTableFragmentRow.prototype.setDefaultHeightAddition = function(defaultHeightAddition)
{
	this.m_defaultHeightAddition = defaultHeightAddition;
};
oFF.SacTableFragmentRow.prototype.setHeight = function(height)
{
	this.m_height = height;
	this.checkDefaultHeight();
};
oFF.SacTableFragmentRow.prototype.setTextBaseHeight = function(height)
{
	this.m_textBasedHeight = height;
	this.checkDefaultHeight();
};
oFF.SacTableFragmentRow.prototype.setupInternal = function(bundle)
{
	oFF.SacTableAxisFragment.prototype.setupInternal.call( this , bundle);
	this.m_height = this.getParentTable().getSacTableProxy().getDefaultRowHeight();
};

oFF.SacTableCell = function() {};
oFF.SacTableCell.prototype = new oFF.SacTableCellAbstract();
oFF.SacTableCell.prototype._ff_c = "SacTableCell";

oFF.SacTableCell._create = function(row, column)
{
	let instance = new oFF.SacTableCell();
	instance.setupInternal(row, column);
	return instance;
};
oFF.SacTableCell.prototype.getPrioritizedStylesList = function()
{
	let stylesList = oFF.XList.create();
	this.injectStyleToList(stylesList);
	let parentColumn = this.getParentColumn();
	let parentRow = this.getParentRow();
	let parentTable = parentColumn.getParentTable();
	oFF.XStream.of(parentTable.getDataPointStylesMatchingExceptionInformation(this.getExceptionInformations())).forEach((dps) => {
		stylesList.add(dps.getTableStyle());
	});
	oFF.XStream.of(parentRow.getMatchingTableMarkups(false)).filterNullValues().forEach((tableMarkup1) => {
		stylesList.addAll(parentColumn.getMatchingOrthogonalStyles(tableMarkup1));
	});
	oFF.XStream.of(parentColumn.getMatchingTableMarkups(false)).filterNullValues().forEach((tableMarkup2) => {
		stylesList.addAll(parentRow.getMatchingOrthogonalStyles(tableMarkup2));
	});
	stylesList.addAll(parentColumn.getMatchingStyles(parentRow.getScopedStyles()));
	stylesList.addAll(parentRow.getMatchingStyles(parentColumn.getScopedStyles()));
	stylesList.addAll(this.getSecondaryTableStyles());
	stylesList.addAll(parentColumn.getSecondaryTableStyles());
	stylesList.addAll(parentRow.getSecondaryTableStyles());
	stylesList.addAll(parentTable.getSecondaryTableStyles());
	parentRow.injectStyleToList(stylesList);
	parentColumn.injectStyleToList(stylesList);
	parentTable.injectStyleToList(stylesList);
	let stylesListFiltered = oFF.XStream.of(stylesList).filter((st) => {
		return this.isStyleApplicable(st);
	}).collect(oFF.XStreamCollector.toList());
	let compareFunction = (a, b) => {
		return oFF.XIntegerValue.create(a.getPriority() - b.getPriority());
	};
	stylesListFiltered.sortByComparator(oFF.XComparatorLambda.create(compareFunction));
	oFF.XStream.of(parentColumn.getMatchingRectangularStyles(true)).filter((rt) => {
		return parentRow.getMatchingRectangularStyles(true).contains(rt);
	}).filterNullValues().forEach((rti) => {
		stylesListFiltered.insert(0, rti.getStyle());
	});
	return stylesListFiltered;
};

oFF.ChartAxisCategory = function() {};
oFF.ChartAxisCategory.prototype = new oFF.ChartFormattableElement();
oFF.ChartAxisCategory.prototype._ff_c = "ChartAxisCategory";

oFF.ChartAxisCategory.create = function(name, text, parentDomain)
{
	let instance = new oFF.ChartAxisCategory();
	instance.initializeAxis(name, text, parentDomain);
	return instance;
};
oFF.ChartAxisCategory.prototype.m_categoryElements = null;
oFF.ChartAxisCategory.prototype.m_parentPart = null;
oFF.ChartAxisCategory.prototype.m_total = false;
oFF.ChartAxisCategory.prototype.m_totalLevel = 0;
oFF.ChartAxisCategory.prototype.m_uniqueDecimalPlaces = 0;
oFF.ChartAxisCategory.prototype.m_uniqueNumericShift = null;
oFF.ChartAxisCategory.prototype.m_uniqueScalingText = null;
oFF.ChartAxisCategory.prototype.m_uniqueUnitInfo = null;
oFF.ChartAxisCategory.prototype.m_uniqueUnitScaleInformation = null;
oFF.ChartAxisCategory.prototype.addCategoryElement = function(name, text, headerText, repeated, finalElement)
{
	let newElement = oFF.ChartAxisCategoryElement.create(name, text, headerText, this, repeated, finalElement);
	this.m_categoryElements.add(newElement);
	return newElement;
};
oFF.ChartAxisCategory.prototype.addElement = function(element)
{
	this.m_categoryElements.add(element);
};
oFF.ChartAxisCategory.prototype.clearCategoryElements = function()
{
	this.m_categoryElements.clear();
};
oFF.ChartAxisCategory.prototype.getCategoryElementByName = function(name)
{
	return this.m_categoryElements.getByKey(name);
};
oFF.ChartAxisCategory.prototype.getCategoryElements = function()
{
	return this.m_categoryElements;
};
oFF.ChartAxisCategory.prototype.getCategoryIndex = function()
{
	return this.getParentChartDomain().getCategoryIndex(this);
};
oFF.ChartAxisCategory.prototype.getParentChartDomain = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_parentPart);
};
oFF.ChartAxisCategory.prototype.getTotalLevel = function()
{
	return this.m_totalLevel;
};
oFF.ChartAxisCategory.prototype.getUniqueDecimalPlaces = function()
{
	return this.m_uniqueDecimalPlaces;
};
oFF.ChartAxisCategory.prototype.getUniqueNumericShift = function()
{
	return this.m_uniqueNumericShift;
};
oFF.ChartAxisCategory.prototype.getUniqueScalingText = function()
{
	return this.m_uniqueScalingText;
};
oFF.ChartAxisCategory.prototype.getUniqueUnitInfo = function()
{
	return this.m_uniqueUnitInfo;
};
oFF.ChartAxisCategory.prototype.getUniqueUnitScaleInformation = function()
{
	return this.m_uniqueUnitScaleInformation;
};
oFF.ChartAxisCategory.prototype.initializeAxis = function(name, text, parentDomain)
{
	this.initialize(name, text);
	this.m_parentPart = oFF.XWeakReferenceUtil.getWeakRef(parentDomain);
	this.m_totalLevel = -1;
	this.m_categoryElements = oFF.XListOfNameObject.create();
};
oFF.ChartAxisCategory.prototype.isTotal = function()
{
	return this.m_total;
};
oFF.ChartAxisCategory.prototype.obtainAdjacientProperties = function(category)
{
	for (let i = 0; i < oFF.XMath.min(this.m_categoryElements.size(), category.getCategoryElements().size()); i++)
	{
		let thisElement = this.getCategoryElements().get(i);
		let thatElement = category.getCategoryElements().get(i);
		if (!oFF.XString.isEqual(thisElement.getName(), thatElement.getName()))
		{
			thisElement.setIsFinalElement(true);
			thatElement.setIsRepeatedElement(false);
		}
	}
};
oFF.ChartAxisCategory.prototype.releaseObject = function()
{
	this.m_parentPart = null;
	this.m_total = false;
	this.m_totalLevel = 0;
	this.m_categoryElements = oFF.XObjectExt.release(this.m_categoryElements);
	oFF.ChartFormattableElement.prototype.releaseObject.call( this );
};
oFF.ChartAxisCategory.prototype.removeCategoryElement = function(categoryElement)
{
	this.m_categoryElements.removeElement(categoryElement);
};
oFF.ChartAxisCategory.prototype.removeCategoryElementByName = function(name)
{
	this.removeCategoryElement(this.m_categoryElements.getByKey(name));
};
oFF.ChartAxisCategory.prototype.setTotal = function(total)
{
	this.m_total = total;
};
oFF.ChartAxisCategory.prototype.setTotalLevel = function(totalLevel)
{
	this.m_totalLevel = totalLevel;
};
oFF.ChartAxisCategory.prototype.setUniqueDecimalPlaces = function(decimalPlaces)
{
	this.m_uniqueDecimalPlaces = decimalPlaces;
};
oFF.ChartAxisCategory.prototype.setUniqueNumericShift = function(numericShift)
{
	this.m_uniqueNumericShift = numericShift;
};
oFF.ChartAxisCategory.prototype.setUniqueScalingText = function(uniqueScalingText)
{
	this.m_uniqueScalingText = uniqueScalingText;
};
oFF.ChartAxisCategory.prototype.setUniqueUnitInfo = function(uniqueUnitInfo)
{
	this.m_uniqueUnitInfo = uniqueUnitInfo;
};
oFF.ChartAxisCategory.prototype.setUniqueUnitScaleInformation = function(uniqueUnitScaleInformation)
{
	this.m_uniqueUnitScaleInformation = uniqueUnitScaleInformation;
};

oFF.ChartDataPoint = function() {};
oFF.ChartDataPoint.prototype = new oFF.ChartFormattableElement();
oFF.ChartDataPoint.prototype._ff_c = "ChartDataPoint";

oFF.ChartDataPoint.create = function(name, text, series)
{
	let instance = new oFF.ChartDataPoint();
	instance.initializeDataPoint(name, text, series);
	return instance;
};
oFF.ChartDataPoint.prototype.m_category = null;
oFF.ChartDataPoint.prototype.m_coordinates = null;
oFF.ChartDataPoint.prototype.m_emptyValue = false;
oFF.ChartDataPoint.prototype.m_exceptionInformation = null;
oFF.ChartDataPoint.prototype.m_parentSeries = null;
oFF.ChartDataPoint.prototype.m_subChart = null;
oFF.ChartDataPoint.prototype.addCoordinate = function(name, text, value, fullFormattedText, formattedText, scalingText, unitInformation, heading)
{
	let coordinate = oFF.ChartCoordinate.create(name, text, value, fullFormattedText, formattedText, scalingText, unitInformation, heading);
	this.m_coordinates.put(name, coordinate);
	return coordinate;
};
oFF.ChartDataPoint.prototype.addExceptionInformation = function()
{
	let exceptionInfo = oFF.SacExceptionInfo.create();
	this.m_exceptionInformation.add(exceptionInfo);
	return exceptionInfo;
};
oFF.ChartDataPoint.prototype.clearCoordinates = function()
{
	this.m_coordinates.clear();
};
oFF.ChartDataPoint.prototype.createSubChart = function(name, text)
{
	this.m_subChart = oFF.ChartVisualization.create(name, text);
	return this.m_subChart;
};
oFF.ChartDataPoint.prototype.getCategory = function()
{
	return this.m_category;
};
oFF.ChartDataPoint.prototype.getCoordinateByName = function(name)
{
	return this.m_coordinates.getByKey(name);
};
oFF.ChartDataPoint.prototype.getCoordinates = function()
{
	return this.m_coordinates.getValuesAsReadOnlyList();
};
oFF.ChartDataPoint.prototype.getEffectiveStyle = function()
{
	let stylesList = oFF.XList.create();
	stylesList.add(this.getMergedStyle());
	if (this.getParentSeries() !== null)
	{
		stylesList.add(this.getParentSeries().getEffectiveStyle());
	}
	if (this.getCategory() !== null)
	{
		stylesList.add(this.getCategory().getEffectiveStyle());
	}
	return oFF.ChartVisualizationPointStyle.merge(stylesList);
};
oFF.ChartDataPoint.prototype.getExceptionInformation = function()
{
	return this.m_exceptionInformation;
};
oFF.ChartDataPoint.prototype.getParentSeries = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_parentSeries);
};
oFF.ChartDataPoint.prototype.getSubChart = function()
{
	return this.m_subChart;
};
oFF.ChartDataPoint.prototype.initializeDataPoint = function(name, text, series)
{
	this.initialize(name, text);
	this.m_parentSeries = oFF.XWeakReferenceUtil.getWeakRef(series);
	this.m_coordinates = oFF.XLinkedHashMapByString.create();
	this.m_exceptionInformation = oFF.XList.create();
};
oFF.ChartDataPoint.prototype.isEmptyValue = function()
{
	return this.m_emptyValue;
};
oFF.ChartDataPoint.prototype.releaseObject = function()
{
	oFF.ChartFormattableElement.prototype.releaseObject.call( this );
	this.m_coordinates = oFF.XObjectExt.release(this.m_coordinates);
	this.m_subChart = oFF.XObjectExt.release(this.m_subChart);
	this.m_parentSeries = oFF.XObjectExt.release(this.m_parentSeries);
	this.m_emptyValue = false;
	this.m_category = null;
	this.m_exceptionInformation = oFF.XObjectExt.release(this.m_exceptionInformation);
};
oFF.ChartDataPoint.prototype.removeCoordinate = function(coordinate)
{
	if (oFF.notNull(coordinate))
	{
		this.m_coordinates.remove(coordinate.getName());
	}
};
oFF.ChartDataPoint.prototype.removeCoordinateByName = function(name)
{
	this.m_coordinates.remove(name);
};
oFF.ChartDataPoint.prototype.setCategory = function(category)
{
	this.m_category = category;
};
oFF.ChartDataPoint.prototype.setIsEmptyValue = function(emptyValue)
{
	this.m_emptyValue = emptyValue;
};
oFF.ChartDataPoint.prototype.setSubChart = function(subChart)
{
	this.m_subChart = subChart;
};

oFF.ChartSeries = function() {};
oFF.ChartSeries.prototype = new oFF.ChartFormattableElement();
oFF.ChartSeries.prototype._ff_c = "ChartSeries";

oFF.ChartSeries.create = function(name, text, seriesGroup)
{
	let instance = new oFF.ChartSeries();
	instance.initializeSeries(name, text, seriesGroup);
	return instance;
};
oFF.ChartSeries.prototype.m_category = null;
oFF.ChartSeries.prototype.m_dataPoints = null;
oFF.ChartSeries.prototype.m_seriesGroup = null;
oFF.ChartSeries.prototype.addChartDataPoint = function(name, text)
{
	let dataPoint = oFF.ChartDataPoint.create(name, text, this);
	this.m_dataPoints.put(name, dataPoint);
	return dataPoint;
};
oFF.ChartSeries.prototype.clearChartDataPoints = function()
{
	this.m_dataPoints.clear();
};
oFF.ChartSeries.prototype.doesCoordinateHavePositiveAndNegativeValues = function(coordinateName)
{
	let previousValue = 0;
	let dataPointsList = this.m_dataPoints.getValuesAsReadOnlyList();
	for (let i = 0; i < this.m_dataPoints.size(); i++)
	{
		let dataPoint = dataPointsList.get(i);
		let dataPointCoordinates = dataPoint.getCoordinates();
		for (let j = 0; j < dataPointCoordinates.size(); j++)
		{
			let coordinate = dataPointCoordinates.get(j);
			if (oFF.XString.isEqual(coordinate.getName(), coordinateName))
			{
				let value = coordinate.getValue();
				if (value.getValueType().isNumber())
				{
					if (i > 0)
					{
						if ((previousValue * oFF.XValueUtil.getDouble(value, false, false)) < 0)
						{
							return true;
						}
					}
					previousValue = oFF.XValueUtil.getDouble(value, false, false);
				}
			}
		}
	}
	return false;
};
oFF.ChartSeries.prototype.getCategory = function()
{
	return this.m_category;
};
oFF.ChartSeries.prototype.getChartDataPointByName = function(name)
{
	return this.m_dataPoints.getByKey(name);
};
oFF.ChartSeries.prototype.getChartDataPoints = function()
{
	return this.m_dataPoints.getValuesAsReadOnlyList();
};
oFF.ChartSeries.prototype.getEffectiveStyle = function()
{
	let stylesList = oFF.XList.create();
	stylesList.add(this.getMergedStyle());
	if (this.getCategory() !== null)
	{
		stylesList.add(this.getCategory().getEffectiveStyle());
	}
	if (this.getParentSeriesGroup() !== null)
	{
		stylesList.add(this.getParentSeriesGroup().getEffectiveStyle());
	}
	return oFF.ChartVisualizationPointStyle.merge(stylesList);
};
oFF.ChartSeries.prototype.getParentSeriesGroup = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_seriesGroup);
};
oFF.ChartSeries.prototype.initializeSeries = function(name, text, seriesGroup)
{
	oFF.ChartFormattableElement.prototype.initialize.call( this , name, text);
	this.m_seriesGroup = oFF.XWeakReferenceUtil.getWeakRef(seriesGroup);
	this.m_dataPoints = oFF.XLinkedHashMapByString.create();
};
oFF.ChartSeries.prototype.releaseObject = function()
{
	oFF.ChartFormattableElement.prototype.releaseObject.call( this );
	this.m_dataPoints = oFF.XObjectExt.release(this.m_dataPoints);
	this.m_category = oFF.XObjectExt.release(this.m_category);
	this.m_seriesGroup = oFF.XObjectExt.release(this.m_seriesGroup);
};
oFF.ChartSeries.prototype.removeChartDataPoint = function(chartDataPoint)
{
	if (oFF.notNull(chartDataPoint))
	{
		this.m_dataPoints.remove(chartDataPoint.getName());
	}
};
oFF.ChartSeries.prototype.removeChartDataPointByName = function(name)
{
	this.m_dataPoints.remove(name);
};
oFF.ChartSeries.prototype.setCategory = function(category)
{
	this.m_category = category;
};

oFF.ChartSeriesGroup = function() {};
oFF.ChartSeriesGroup.prototype = new oFF.ChartFormattableElement();
oFF.ChartSeriesGroup.prototype._ff_c = "ChartSeriesGroup";

oFF.ChartSeriesGroup.create = function(name, text, chartCoordinateSystem)
{
	let instance = new oFF.ChartSeriesGroup();
	instance.initializeSeriezGroup(name, text, chartCoordinateSystem);
	return instance;
};
oFF.ChartSeriesGroup.prototype.m_category = null;
oFF.ChartSeriesGroup.prototype.m_chartType = null;
oFF.ChartSeriesGroup.prototype.m_parentCoordinateSystem = null;
oFF.ChartSeriesGroup.prototype.m_series = null;
oFF.ChartSeriesGroup.prototype.m_stackingType = null;
oFF.ChartSeriesGroup.prototype.addSeries = function(name, text)
{
	let series = oFF.ChartSeries.create(name, text, this);
	this.m_series.put(name, series);
	return series;
};
oFF.ChartSeriesGroup.prototype.clearSeries = function()
{
	this.m_series.clear();
};
oFF.ChartSeriesGroup.prototype.getCategory = function()
{
	return this.m_category;
};
oFF.ChartSeriesGroup.prototype.getChartType = function()
{
	return this.m_chartType;
};
oFF.ChartSeriesGroup.prototype.getEffectiveStyle = function()
{
	let stylesList = oFF.XList.create();
	stylesList.add(this.getMergedStyle());
	if (this.getCategory() !== null)
	{
		stylesList.add(this.getCategory().getEffectiveStyle());
	}
	return oFF.ChartVisualizationPointStyle.merge(stylesList);
};
oFF.ChartSeriesGroup.prototype.getOrCreateSeries = function(name, text)
{
	if (this.m_series.containsKey(name))
	{
		return this.m_series.getByKey(name);
	}
	else
	{
		return this.addSeries(name, text);
	}
};
oFF.ChartSeriesGroup.prototype.getParentCoordinateSystem = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_parentCoordinateSystem);
};
oFF.ChartSeriesGroup.prototype.getSeries = function()
{
	return this.m_series.getValuesAsReadOnlyList();
};
oFF.ChartSeriesGroup.prototype.getSeriesByName = function(name)
{
	return this.m_series.getByKey(name);
};
oFF.ChartSeriesGroup.prototype.getStackingType = function()
{
	return this.m_stackingType;
};
oFF.ChartSeriesGroup.prototype.initializeSeriezGroup = function(name, text, chartCoordinateSystem)
{
	oFF.ChartFormattableElement.prototype.initialize.call( this , name, text);
	this.m_series = oFF.XLinkedHashMapByString.create();
	this.m_category = oFF.XObjectExt.release(this.m_category);
	this.m_parentCoordinateSystem = oFF.XWeakReferenceUtil.getWeakRef(chartCoordinateSystem);
};
oFF.ChartSeriesGroup.prototype.releaseObject = function()
{
	oFF.ChartFormattableElement.prototype.releaseObject.call( this );
	this.m_series = oFF.XObjectExt.release(this.m_series);
	this.m_parentCoordinateSystem = oFF.XObjectExt.release(this.m_parentCoordinateSystem);
};
oFF.ChartSeriesGroup.prototype.removeSeries = function(series)
{
	if (oFF.notNull(series))
	{
		this.m_series.remove(series.getName());
	}
};
oFF.ChartSeriesGroup.prototype.removeSeriesByName = function(name)
{
	this.m_series.remove(name);
};
oFF.ChartSeriesGroup.prototype.setCategory = function(category)
{
	this.m_category = category;
};
oFF.ChartSeriesGroup.prototype.setChartType = function(chartType)
{
	this.m_chartType = chartType;
};
oFF.ChartSeriesGroup.prototype.setStackingType = function(stackingType)
{
	this.m_stackingType = stackingType;
};

oFF.SacTableColumn = function() {};
oFF.SacTableColumn.prototype = new oFF.SacTableAxis();
oFF.SacTableColumn.prototype._ff_c = "SacTableColumn";

oFF.SacTableColumn._create = function(sacTable)
{
	let instance = new oFF.SacTableColumn();
	instance.setupInternal(sacTable);
	return instance;
};
oFF.SacTableColumn.prototype.m_columnsAfter = null;
oFF.SacTableColumn.prototype.m_columnsBefore = null;
oFF.SacTableColumn.prototype.m_defaultEmWith = 0;
oFF.SacTableColumn.prototype.m_defaultWidth = 0;
oFF.SacTableColumn.prototype.m_idealWidth = 0;
oFF.SacTableColumn.prototype.m_width = 0;
oFF.SacTableColumn.prototype.addHeaderBandTuple = function(updatedTupleList)
{
	let column = this.addNewChildColumnBefore(updatedTupleList);
	column.setParentColumn(this);
	return column;
};
oFF.SacTableColumn.prototype.addNewChildColumnAfter = function(updatedTupleList)
{
	let newSibling = this.createNewChildColumn(this.getOwningList().getIndex(this) + 1);
	this.addToLocalTupleList(updatedTupleList, newSibling, 1);
	this.m_columnsAfter.add(newSibling);
	this.setNeedsReIndex();
	return newSibling;
};
oFF.SacTableColumn.prototype.addNewChildColumnBefore = function(updatedTupleList)
{
	let newSibling = this.createNewChildColumn(this.getOwningList().getIndex(this));
	this.addToLocalTupleList(updatedTupleList, newSibling, 0);
	this.m_columnsBefore.add(newSibling);
	this.setNeedsReIndex();
	return newSibling;
};
oFF.SacTableColumn.prototype.addTupleAfter = function(tupleDescription, updatedTupleList)
{
	let column = this.addNewChildColumnAfter(updatedTupleList);
	oFF.XStream.of(tupleDescription.getScopedStyles()).forEach((sc) => {
		column.addScopedStyle(sc);
	});
	column.setWidth(tupleDescription.getCellWidth());
	column.setParentColumn(this);
};
oFF.SacTableColumn.prototype.addTupleBefore = function(tupleDescription, updatedTupleList)
{
	let column = this.addNewChildColumnBefore(updatedTupleList);
	oFF.XStream.of(tupleDescription.getScopedStyles()).forEach((sc) => {
		column.addScopedStyle(sc);
	});
	column.setWidth(tupleDescription.getCellWidth());
	column.setParentColumn(this);
};
oFF.SacTableColumn.prototype.createNewChildColumn = function(index)
{
	let newSibling;
	if (this.isHeader())
	{
		newSibling = this.getParentTable().createNewHeaderColumnAt(index);
	}
	else
	{
		newSibling = this.getParentTable().createNewDataColumnAt(index);
		this.getParentTable().setColumnInsertOrHidePresent();
	}
	return newSibling;
};
oFF.SacTableColumn.prototype.geRectangularStyleMatchPredicate = function()
{
	return (rs) => {
		return this.matchesSacTableSectionInfo(rs.getColumnsRestriction());
	};
};
oFF.SacTableColumn.prototype.getColumnsAfter = function()
{
	return this.m_columnsAfter;
};
oFF.SacTableColumn.prototype.getColumnsBefore = function()
{
	return this.m_columnsBefore;
};
oFF.SacTableColumn.prototype.getDataSiblingAt = function(index)
{
	return oFF.SacTableAxis.getSiblingGraceful(this.getParentTable().getColumnList(), index);
};
oFF.SacTableColumn.prototype.getDataSize = function()
{
	return this.getParentTable().getColumnList().size();
};
oFF.SacTableColumn.prototype.getDefaultEmWidth = function()
{
	return this.m_defaultEmWith;
};
oFF.SacTableColumn.prototype.getHeaderGroupMap = function()
{
	return this.getParentTable().getColumnHeaderMap();
};
oFF.SacTableColumn.prototype.getHeaderGroupNames = function()
{
	return this.getParentTable().getColumnHeaderGroupNames();
};
oFF.SacTableColumn.prototype.getHeaderSiblingAt = function(index)
{
	return oFF.SacTableAxis.getSiblingGraceful(this.getParentTable().getHeaderColumnList(), index);
};
oFF.SacTableColumn.prototype.getHeadersSize = function()
{
	return this.getParentTable().getHeaderColumnList().size();
};
oFF.SacTableColumn.prototype.getIdealWidth = function()
{
	return this.m_idealWidth;
};
oFF.SacTableColumn.prototype.getOwningList = function()
{
	let list;
	if (this.isHeader())
	{
		list = this.getParentTable().getHeaderColumnList();
	}
	else
	{
		list = this.getParentTable().getColumnList();
	}
	return list;
};
oFF.SacTableColumn.prototype.getParentColumn = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_parent);
};
oFF.SacTableColumn.prototype.getStylePriority = function()
{
	return 7;
};
oFF.SacTableColumn.prototype.getTableMarkupMatchPredicate = function()
{
	return (tm) => {
		return this.matchesSacTableSectionInfo(tm.getColumnsScope());
	};
};
oFF.SacTableColumn.prototype.getTableMemberHeaderHandling = function()
{
	return this.getParentTable().getColumnsMemberHeaderHandling();
};
oFF.SacTableColumn.prototype.getWidth = function()
{
	let tableMarkups = this.getMatchingTableMarkups(false);
	let pathWidth = 0;
	let pathWidthAddition = 0;
	if (oFF.XCollectionUtils.hasElements(tableMarkups))
	{
		pathWidth = oFF.XStream.of(tableMarkups).map((m) => {
			return oFF.XIntegerValue.create(m.getCellWidth());
		}).reduce(oFF.XIntegerValue.create(0), (a, b) => {
			return oFF.XIntegerValue.create(oFF.XMath.max(a.getInteger(), b.getInteger()));
		}).getInteger();
		pathWidthAddition = oFF.XStream.of(tableMarkups).map((n) => {
			return oFF.XIntegerValue.create(n.getCellWidthAddition());
		}).reduce(oFF.XIntegerValue.create(0), (e, f) => {
			return oFF.XIntegerValue.create(oFF.XMath.max(e.getInteger(), f.getInteger()));
		}).getInteger();
	}
	let newWidth = oFF.XMath.max(pathWidth, this.m_width);
	return newWidth > 0 ? newWidth : this.m_defaultWidth + pathWidthAddition;
};
oFF.SacTableColumn.prototype.isEffectivelyHidden = function()
{
	return this.isHiddenByMarkup();
};
oFF.SacTableColumn.prototype.isWidthOverwritten = function()
{
	return this.m_width > 0;
};
oFF.SacTableColumn.prototype.markIndexShift = function()
{
	this.getParentTable().setColumnInsertOrHidePresent();
};
oFF.SacTableColumn.prototype.matchesOrthogonal = function(style)
{
	return this.matchesSacTableSectionInfo(style.getOrthogonalColumnsRestriction());
};
oFF.SacTableColumn.prototype.releaseObject = function()
{
	this.m_width = 0;
	this.m_defaultWidth = 0;
	this.m_columnsBefore = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_columnsBefore);
	this.m_columnsAfter = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_columnsAfter);
	oFF.SacTableAxis.prototype.releaseObject.call( this );
};
oFF.SacTableColumn.prototype.remove = function()
{
	this.removeSingle();
	this.removePreviousChildren();
	this.removeSubsequentChildren();
};
oFF.SacTableColumn.prototype.removePreviousChildren = function()
{
	oFF.XStream.of(this.m_columnsBefore).forEach((element) => {
		element.remove();
	});
	this.m_columnsBefore.clear();
};
oFF.SacTableColumn.prototype.removeSingle = function()
{
	let list = this.getOwningList();
	let index = list.getIndex(this);
	if (index > -1)
	{
		if (this.isHeader())
		{
			this.getParentTable().removeHeaderColumnAt(index);
		}
		else
		{
			this.getParentTable().removeDataColumnAt(index);
		}
	}
};
oFF.SacTableColumn.prototype.removeSubsequentChildren = function()
{
	oFF.XStream.of(this.m_columnsAfter).forEach((element) => {
		element.remove();
	});
	this.m_columnsAfter.clear();
};
oFF.SacTableColumn.prototype.setDefaultEmWidth = function(width)
{
	this.m_defaultEmWith = width;
};
oFF.SacTableColumn.prototype.setDefaultWidth = function(width)
{
	this.m_defaultWidth = width;
};
oFF.SacTableColumn.prototype.setIdealWidth = function(width)
{
	this.m_idealWidth = width;
};
oFF.SacTableColumn.prototype.setParentColumn = function(sacTableColumn)
{
	this.m_parent = oFF.XWeakReferenceUtil.getWeakRef(sacTableColumn);
};
oFF.SacTableColumn.prototype.setWidth = function(width)
{
	this.m_width = width;
};
oFF.SacTableColumn.prototype.setupInternal = function(sacTable)
{
	oFF.SacTableAxis.prototype.setupInternal.call( this , sacTable);
	this.m_columnsBefore = oFF.XList.create();
	this.m_columnsAfter = oFF.XList.create();
};

oFF.SacTableRow = function() {};
oFF.SacTableRow.prototype = new oFF.SacTableAxis();
oFF.SacTableRow.prototype._ff_c = "SacTableRow";

oFF.SacTableRow._create = function(sacTable)
{
	let instance = new oFF.SacTableRow();
	instance.setupInternal(sacTable);
	return instance;
};
oFF.SacTableRow.prototype.m_cells = null;
oFF.SacTableRow.prototype.m_changedOnTheFlyUnresponsive = false;
oFF.SacTableRow.prototype.m_defaultHeightAddition = 0;
oFF.SacTableRow.prototype.m_fixed = false;
oFF.SacTableRow.prototype.m_height = 0;
oFF.SacTableRow.prototype.m_heightDiffersFromDefault = false;
oFF.SacTableRow.prototype.m_rowsAfter = null;
oFF.SacTableRow.prototype.m_rowsBefore = null;
oFF.SacTableRow.prototype.addCell = function(newCell)
{
	this.m_cells.add(newCell);
};
oFF.SacTableRow.prototype.addHeaderBandTuple = function(updatedTupleList)
{
	let row = this.addNewChildRowBefore(updatedTupleList);
	row.setParentRow(this);
	return row;
};
oFF.SacTableRow.prototype.addNewCell = function()
{
	let newCell = oFF.SacTableCell._create(this, this.getReferenceColumn(this.m_cells.size()));
	this.addCell(newCell);
	return newCell;
};
oFF.SacTableRow.prototype.addNewChildRowAfter = function(updatedTupleList)
{
	let newSibling = this.createNewChildRow(this.getOwningList().getIndex(this) + 1);
	this.addToLocalTupleList(updatedTupleList, newSibling, 1);
	this.m_rowsAfter.add(newSibling);
	this.setNeedsReIndex();
	return newSibling;
};
oFF.SacTableRow.prototype.addNewChildRowBefore = function(updatedTupleList)
{
	let newSibling = this.createNewChildRow(this.getOwningList().getIndex(this));
	this.addToLocalTupleList(updatedTupleList, newSibling, 0);
	this.m_rowsBefore.add(newSibling);
	this.setNeedsReIndex();
	return newSibling;
};
oFF.SacTableRow.prototype.addNullCellAt = function(index)
{
	this.m_cells.insert(index, null);
};
oFF.SacTableRow.prototype.addTupleAfter = function(tupleDescription, updatedTupleList)
{
	let row = this.addNewChildRowAfter(updatedTupleList);
	oFF.XStream.of(tupleDescription.getScopedStyles()).forEach((sc) => {
		row.addScopedStyle(sc);
	});
	row.setHeight(tupleDescription.getCellHeight());
	row.setParentRow(this);
};
oFF.SacTableRow.prototype.addTupleBefore = function(tupleDescription, updatedTupleList)
{
	let row = this.addNewChildRowBefore(updatedTupleList);
	oFF.XStream.of(tupleDescription.getScopedStyles()).forEach((sc) => {
		row.addScopedStyle(sc);
	});
	row.setHeight(tupleDescription.getCellHeight());
	row.setParentRow(this);
};
oFF.SacTableRow.prototype.applyHightAndWidth = function()
{
	let tableMarkups = this.getMatchingTableMarkups(false);
	let pathHeight = 0;
	let pathHeightAddition = 0;
	if (oFF.XCollectionUtils.hasElements(tableMarkups))
	{
		pathHeight = oFF.XStream.of(tableMarkups).map((m) => {
			return oFF.XIntegerValue.create(m.getCellHeight());
		}).reduce(oFF.XIntegerValue.create(0), (a, b) => {
			return oFF.XIntegerValue.create(oFF.XMath.max(a.getInteger(), b.getInteger()));
		}).getInteger();
		pathHeightAddition = oFF.XStream.of(tableMarkups).map((ma) => {
			return oFF.XIntegerValue.create(ma.getCellHeightAddition());
		}).reduce(oFF.XIntegerValue.create(0), (e, f) => {
			return oFF.XIntegerValue.create(oFF.XMath.max(e.getInteger(), f.getInteger()));
		}).getInteger();
	}
	this.m_height = oFF.XMath.max(pathHeight, this.m_height);
	this.m_defaultHeightAddition = pathHeightAddition;
	this.m_heightDiffersFromDefault = this.m_height !== this.getParentTable().getDefaultRowHeight() || this.m_defaultHeightAddition !== 0;
};
oFF.SacTableRow.prototype.createNewChildRow = function(index)
{
	let newSibling;
	if (this.isHeader())
	{
		newSibling = this.getParentTable().newHeaderRowAt(index);
	}
	else
	{
		newSibling = this.getParentTable().newDataRowAt(index, false);
		this.getParentTable().setRowInsertOrHidePresent();
	}
	return newSibling;
};
oFF.SacTableRow.prototype.geRectangularStyleMatchPredicate = function()
{
	return (rs) => {
		return this.matchesSacTableSectionInfo(rs.getRowsRestriction());
	};
};
oFF.SacTableRow.prototype.getCells = function()
{
	return this.m_cells;
};
oFF.SacTableRow.prototype.getDataSiblingAt = function(index)
{
	return oFF.SacTableAxis.getSiblingGraceful(this.getParentTable().getRowList(), index);
};
oFF.SacTableRow.prototype.getDataSize = function()
{
	return this.getParentTable().getRowList().size();
};
oFF.SacTableRow.prototype.getEffectiveHeight = function()
{
	return this.m_height + this.m_defaultHeightAddition;
};
oFF.SacTableRow.prototype.getHeaderGroupMap = function()
{
	return this.getParentTable().getColumnHeaderMap();
};
oFF.SacTableRow.prototype.getHeaderGroupNames = function()
{
	return this.getParentTable().getRowHeaderGroupNames();
};
oFF.SacTableRow.prototype.getHeaderSiblingAt = function(index)
{
	return oFF.SacTableAxis.getSiblingGraceful(this.getParentTable().getHeaderRowList(), index);
};
oFF.SacTableRow.prototype.getHeadersSize = function()
{
	return this.getParentTable().getHeaderRowList().size();
};
oFF.SacTableRow.prototype.getHeight = function()
{
	return this.m_height + this.m_defaultHeightAddition;
};
oFF.SacTableRow.prototype.getOwningList = function()
{
	let list;
	if (this.isHeader())
	{
		list = this.getParentTable().getHeaderRowList();
	}
	else
	{
		list = this.getParentTable().getRowList();
	}
	return list;
};
oFF.SacTableRow.prototype.getParentRow = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_parent);
};
oFF.SacTableRow.prototype.getReferenceColumn = function(newIndex)
{
	let parentTable = this.getParentTable();
	let hcl = parentTable.getHeaderColumnList();
	let dcl = parentTable.getColumnList();
	let headerSize = hcl.size();
	let dataSize = dcl.size();
	let referenceColumn;
	if (newIndex < headerSize)
	{
		referenceColumn = hcl.get(newIndex);
	}
	else if (newIndex < headerSize + dataSize)
	{
		referenceColumn = dcl.get(newIndex - headerSize);
	}
	else
	{
		referenceColumn = parentTable.createNewDataColumn();
	}
	return referenceColumn;
};
oFF.SacTableRow.prototype.getRowsAfter = function()
{
	return this.m_rowsAfter;
};
oFF.SacTableRow.prototype.getRowsBefore = function()
{
	return this.m_rowsBefore;
};
oFF.SacTableRow.prototype.getStylePriority = function()
{
	return 4;
};
oFF.SacTableRow.prototype.getTableMarkupMatchPredicate = function()
{
	return (tm) => {
		return this.matchesSacTableSectionInfo(tm.getRowsScope());
	};
};
oFF.SacTableRow.prototype.getTableMemberHeaderHandling = function()
{
	return this.getParentTable().getRowsMemberHeaderHandling();
};
oFF.SacTableRow.prototype.heightDiffersFromDefault = function()
{
	return this.m_heightDiffersFromDefault;
};
oFF.SacTableRow.prototype.insertCellAt = function(index, newCell)
{
	this.m_cells.insert(index, newCell);
};
oFF.SacTableRow.prototype.insertNewCellAtWithColumn = function(index, column, overwriteAtPosition)
{
	let newCell = oFF.SacTableCell._create(this, column);
	this.insertCellAt(index, newCell);
	return newCell;
};
oFF.SacTableRow.prototype.isChangedOnTheFlyUnresponsive = function()
{
	return this.m_changedOnTheFlyUnresponsive;
};
oFF.SacTableRow.prototype.isEffectivelyHidden = function()
{
	return this.isHiddenByMarkup();
};
oFF.SacTableRow.prototype.isFixed = function()
{
	return this.m_fixed;
};
oFF.SacTableRow.prototype.markIndexShift = function()
{
	this.getParentTable().setRowInsertOrHidePresent();
};
oFF.SacTableRow.prototype.matchesOrthogonal = function(style)
{
	return this.matchesSacTableSectionInfo(style.getOrthogonalRowsRestriction());
};
oFF.SacTableRow.prototype.releaseObject = function()
{
	this.m_cells = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_cells);
	this.m_height = 0;
	this.m_fixed = false;
	this.m_changedOnTheFlyUnresponsive = false;
	this.m_rowsBefore = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_rowsBefore);
	this.m_rowsAfter = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_rowsAfter);
	oFF.SacTableAxis.prototype.releaseObject.call( this );
};
oFF.SacTableRow.prototype.remove = function()
{
	this.removeInternal(this.getOwningList());
};
oFF.SacTableRow.prototype.removeCellAt = function(index)
{
	this.m_cells.removeAt(index);
};
oFF.SacTableRow.prototype.removeInternal = function(owningList)
{
	this.removeInternalSingle(owningList);
	this.removePreviousChildrenInternal(owningList);
	this.removeSubsequentChildrenInternal(owningList);
};
oFF.SacTableRow.prototype.removeInternalSingle = function(owningList)
{
	owningList.removeElement(this);
};
oFF.SacTableRow.prototype.removePreviousChildren = function()
{
	this.removePreviousChildrenInternal(this.getOwningList());
};
oFF.SacTableRow.prototype.removePreviousChildrenInternal = function(owningList)
{
	oFF.XStream.of(this.m_rowsBefore).forEach((element) => {
		element.remove();
	});
	this.m_rowsBefore.clear();
};
oFF.SacTableRow.prototype.removeSingle = function()
{
	this.removeInternalSingle(this.getOwningList());
};
oFF.SacTableRow.prototype.removeSubsequentChildren = function()
{
	this.removeSubsequentChildrenInternal(this.getOwningList());
};
oFF.SacTableRow.prototype.removeSubsequentChildrenInternal = function(owningList)
{
	oFF.XStream.of(this.m_rowsAfter).forEach((element) => {
		element.remove();
	});
	this.m_rowsAfter.clear();
};
oFF.SacTableRow.prototype.setCellAt = function(index, newCell)
{
	this.m_cells.set(index, newCell);
};
oFF.SacTableRow.prototype.setChangedOnTheFlyUnresponsive = function(changedOnTheFlyUnresponsive)
{
	if (changedOnTheFlyUnresponsive !== this.m_changedOnTheFlyUnresponsive)
	{
		this.m_changedOnTheFlyUnresponsive = changedOnTheFlyUnresponsive;
	}
};
oFF.SacTableRow.prototype.setFixed = function(fixed)
{
	if (fixed !== this.m_fixed)
	{
		this.m_fixed = fixed;
	}
};
oFF.SacTableRow.prototype.setHeight = function(height)
{
	this.m_height = height;
	this.m_heightDiffersFromDefault = this.m_height !== this.getParentTable().getDefaultRowHeight() || this.m_defaultHeightAddition !== 0;
};
oFF.SacTableRow.prototype.setParentRow = function(sacTableRow)
{
	this.m_parent = oFF.XWeakReferenceUtil.getWeakRef(sacTableRow);
};
oFF.SacTableRow.prototype.setupInternal = function(sacTable)
{
	oFF.SacTableAxis.prototype.setupInternal.call( this , sacTable);
	this.m_cells = oFF.XList.create();
	this.m_height = sacTable.getDefaultRowHeight();
	this.m_rowsBefore = oFF.XList.create();
	this.m_rowsAfter = oFF.XList.create();
	this.m_defaultHeightAddition = 0;
};

oFF.VisualizationImplModule = function() {};
oFF.VisualizationImplModule.prototype = new oFF.DfModule();
oFF.VisualizationImplModule.prototype._ff_c = "VisualizationImplModule";

oFF.VisualizationImplModule.s_module = null;
oFF.VisualizationImplModule.getInstance = function()
{
	if (oFF.isNull(oFF.VisualizationImplModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.VisualizationInternalModule.getInstance());
		oFF.VisualizationImplModule.s_module = oFF.DfModule.startExt(new oFF.VisualizationImplModule());
		oFF.SacTableFactory.setInstance(oFF.SacTableFactoryImpl.create());
		oFF.DfModule.stopExt(oFF.VisualizationImplModule.s_module);
	}
	return oFF.VisualizationImplModule.s_module;
};
oFF.VisualizationImplModule.prototype.getName = function()
{
	return "ff2650.visualization.impl";
};

oFF.VisualizationImplModule.getInstance();

return oFF;
} );