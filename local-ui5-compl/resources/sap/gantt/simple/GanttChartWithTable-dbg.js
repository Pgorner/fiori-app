/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/gantt/library",
	"sap/ui/thirdparty/jquery",
	"sap/base/assert",
	"sap/base/Log",
	"sap/ui/core/Control",
	"sap/ui/model/ChangeReason",
	"sap/base/util/values",
	"sap/ui/layout/Splitter",
	"sap/ui/layout/SplitterLayoutData",
	"sap/ui/core/ResizeHandler",
	"./FullScreenUtil",
	"./InnerGanttChart",
	"./GanttHeader",
	"./GanttSyncedControl",
	"../control/AssociateContainer",
	"../axistime/ProportionZoomStrategy",
	"./SelectionModel",
	"./ExpandModel",
	"./ShapeScheme",
	"./GanttExtension",
	"./GanttScrollExtension",
	"./GanttZoomExtension",
	"./GanttPointerExtension",
	"./GanttDragDropExtension",
	"./GanttPopoverExtension",
	"./GanttConnectExtension",
	"./GanttResizeExtension",
	"./GanttLassoExtension",
	"./GanttUtils",
	"./RenderUtils",
	"../misc/Format",
	"../misc/Utility",
	"../config/TimeHorizon",
	"sap/ui/export/Spreadsheet",
	'sap/base/util/uid',
	'sap/m/Dialog',
	'sap/m/Input',
	'sap/m/Label',
	'sap/m/VBox',
	'sap/m/Button',
	'sap/ui/model/json/JSONModel',
	'sap/m/Menu',
	'sap/m/MenuButton',
	'sap/m/MenuItem',
	"sap/base/util/deepEqual",
	"sap/ui/core/CustomData",
	"sap/gantt/simple/GanttAdaptationData",
	"sap/ui/fl/write/api/ControlPersonalizationWriteAPI",
	"./HighlightModel",
	"sap/gantt/simple/AggregationUtils",
	"sap/gantt/simple/BasePseudoShape",
    "sap/gantt/def/SvgDefs",
	"sap/base/util/UriParameters",
	"sap/ui/table/rowmodes/Auto",
	"sap/ui/core/Element",
	"sap/ui/core/Lib"
],  function (
	library,
	jQuery,
	assert,
	Log,
	Control,
	ChangeReason,
	values,
	Splitter,
	SplitterLayoutData,
	ResizeHandler,
	FullScreenUtil,
	InnerGanttChart,
	GanttHeader,
	GanttSyncedControl,
	AssociateContainer,
	ProportionZoomStrategy,
	SelectionModel,
	ExpandModel,
	ShapeScheme,
	GanttExtension,
	GanttScrollExtension,
	GanttZoomExtension,
	GanttPointerExtension,
	GanttDragDropExtension,
	GanttPopoverExtension,
	GanttConnectExtension,
	GanttResizeExtension,
	GanttLassoExtension,
	GanttUtils,
	RenderUtils,
	Format,
	Utility,
	TimeHorizon,
	Spreadsheet,
	uid,
	Dialog,
	Input,
	Label,
	VBox,
	Button,
	JSONModel,
	Menu,
	MenuButton,
	MenuItem,
	deepEqual,
	CustomData,
	GanttAdaptationData,
	ControlPersonalizationWriteAPI,
	HighlightModel,
	AggregationUtils,
	BasePseudoShape,
	SvgDefs,
	UriParameters,
	AutoRowMode,
	Element,
	Lib
) {
	"use strict";

	var GanttChartWithTableDisplayType = library.simple.GanttChartWithTableDisplayType,
		VisibleHorizonUpdateType = library.simple.VisibleHorizonUpdateType,
		VisibleHorizonUpdateSubType = library.simple.VisibleHorizonUpdateSubType,
		ExportTableCustomDataType = library.simple.exportTableCustomDataType;

	var VISIBLE_HORIZON_UPDATE_TYPE_MAP = Object.freeze({
		"totalHorizonUpdated": VisibleHorizonUpdateType.TotalHorizonUpdated,
		"mouseWheelZoom": VisibleHorizonUpdateType.MouseWheelZoom,
		"syncVisibleHorizon": VisibleHorizonUpdateType.SyncVisibleHorizon,
		"initialRender": VisibleHorizonUpdateType.InitialRender,
		"horizontalScroll": VisibleHorizonUpdateType.HorizontalScroll,
		"zoomLevelChanged": VisibleHorizonUpdateType.ZoomLevelChanged,
		"timePeriodZooming": VisibleHorizonUpdateType.TimePeriodZooming
	});


    var oResourceBundle = Lib.getResourceBundleFor("sap.gantt");//Get Resource Bundle to fetch text/ tooltip info
	var MARGIN_OF_ERROR = 10;
	var MIN_AREA_WIDTH = 60;

	// whenever model changed, need invalidate gantt as well
	var aModelChangeReason = values(ChangeReason).slice();

	// All reasons that need to invalidate the control which allows render manager to rerender it
	// Each UI interaction shall only render once
	var aInvalidateReasons = aModelChangeReason.concat(["Render", "FirstVisibleRowChange", "Resize"]);

	function add(a, b) {
		return a + b;
	}

	function almostEqual(a, b) {
		return Math.abs(a - b) < MARGIN_OF_ERROR;
	}

	/**
	 * Creates and initializes a new Gantt Chart
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSetting] Initial settings for the new control
	 *
	 * @class
	 * The Gantt Chart control provides a comprehensive set of features to display hierarchical data and visualized shapes together.
	 * It's designed to fully support OData binding, declaring hierarchical data and shapes bindings in XML view.
	 * It's the recommended control for new applications.
	 *
	 * @extend sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 * @since 1.60
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.GanttChartWithTable
	 */

	var GanttChartWithTable = Control.extend("sap.gantt.simple.GanttChartWithTable", /** @lends sap.ui.core.Control.prototype */ {
		metadata: {
			library: "sap.gantt",
			properties: {

				/**
				 * Width of the control.
				 */
				width: {type: "sap.ui.core.CSSSize", defaultValue: "100%"},

				/**
				 * Height of the control.
				 */
				height: {type: "sap.ui.core.CSSSize", defaultValue: "100%"},

				/**
				 * Shape selection mode of the Gantt Chart. This property controls whether single or multiple shapes can be selected.
				 * When the selection mode is changed, the current selection is removed.
				 *
				 * The shapeSelectionMode only works if <code>selectable</code> property on the defined Shape is set to true.
				 */
				shapeSelectionMode: {type : "sap.gantt.SelectionMode", defaultValue : library.SelectionMode.MultiWithKeyboard},

				/**
				 * Specifies whether shape is rendered over relationship or relationship over shape when
				 * relationship leads through shape.
				 *
				 * If enabled, shapes are rendered over relationships. If disabled, relationships are rendered over
				 * shapes.
				 *
				 * @since 1.76
				 */
				shapeOverRelationship: {type: "boolean", defaultValue: true},

				/**
				 * A JSON object containing the shapeSelectionSettings which will be used to configure shape selection
				 * styles. If nothing is specified, then the default selection styles (2px dashed red border) is set.
				 * New properties 'shapeColor' and 'fillOpacity' are introduced as of SAPUI5 1.85 release. Using these,
                                 * you can configure color and opacity of highlighted shapes in a gantt chart.
				 * <i>Below you can find a brief example</i>
				 * <pre><code>
				 * {
				 *    color: "#808080",
				 *    strokeWidth: 2,
				 *    strokeDasharray: "5,1"
				 *    shapeColor: null,
				 *    fillOpacity: 0
				 * }
				 * </code></pre>
				 */
				shapeSelectionSettings: {type: "object", defaultValue: null},

				/**
				 * A JSON object containing the shapeHighlightSettings that is used to configure shape highlight
				 * styles. If nothing is specified, then the default highlight styles (2px dashed black border) is set.
				 * <i>Below you can find a brief example</i>
				 * <pre><code>
				 * {
				 *    color: "#808080",
				 *    strokeWidth: 2,
				 *    strokeDasharray: "5,1"
				 *    shapeColor: null,
				 *    fillOpacity: 0
				 * }
				 * </code></pre>
				 * @since 1.100
				 */
				shapeHighlightSettings: {type: "object", defaultValue: null},

				/**
				 * Flag whether to show or hide the cursor line when moving your mouse cursor
				 */
				enableCursorLine: {type: "boolean", defaultValue: true},

				/**
				 * Flag whether to show or hide the present time indicator.
				 */
				enableNowLine: {type: "boolean", defaultValue: true},

				/**
				 * Flag whether to show the <code>nowLine</code> in UTC or in FLP time.
				 *
				 * @since 1.68
				 */
				nowLineInUTC: {type: "boolean", defaultValue: true},

				/**
				 * Flag to show or hide vertical lines representing intervals along the time axis
				 */
				enableVerticalLine: {type: "boolean", defaultValue: true},

				/**
				 * Flag to show or hide adhoc lines representing milestones and events along the time axis
				 */
				enableAdhocLine: {type: "boolean", defaultValue: true},

				/**
				 * Specifies on which layer adhoc lines reside. By default, adhoc lines are on top of all other shapes and patterns.
				 */
				adhocLineLayer: {type: "string", defaultValue: library.AdhocLineLayer.Top},

				/**
				* Flag to show or hide Delta Lines
				* @since 1.84
				*/
				enableDeltaLine: { type: "boolean", defaultValue: true },

				/**
				* Flag to show or hide non-working time
				* @since 1.86
				*/
				enableNonWorkingTime: { type: "boolean", defaultValue: true },

				/**
				* Flag to show or hide Chart Delta Area highlighting
				* @since 1.84
				*/
				enableChartDeltaAreaHighlight: { type: "boolean", defaultValue: true },

				/**
				* Specifies the layer on which Delta Lines reside. By default, Delta Lines are above all shapes and patterns.
				* @since 1.84
				*/
				deltaLineLayer: { type: "string", defaultValue: library.DeltaLineLayer.Bottom },

				/**
				* Specifies how the application's date is displayed in the gantt chart. For example: "dd.MM.yyyy" (31.01.2018)
				* @since 1.86
				*/
				datePattern: { type: "string", defaultValue: library.config.DEFAULT_DATE_PATTERN },

				/**
				* Specifies how the application's time is displayed in the gantt chart. For example: "hh:mm a" (12:05 PM)
				* @since 1.86
				*/
				timePattern: { type: "string", defaultValue: library.config.DEFAULT_TIME_PATTERN },

				/** Property to enable borders for expanded rows. By default, only row borders are enabled.
				 * @since 1.84
				 */
				enableExpandedRowBorders: { type: "boolean", defaultValue: true },

				/**
				 * Property to enable the background color for expanded rows. By default, this would show the row background
				 * @since 1.84
				 */
				enableExpandedRowBackground: { type: "boolean", defaultValue: true },

				/** Property to define the height of an expanded row in pixels.
				 * * @since 1.85
				 */
				expandedRowHeight: { type: "int" },

				/**
				 * Drag orientation of Gantt Chart.
				 *
				 * This property doesn't limit the mouse cursor position but the dragging ghost position when dragging it around. This property has 3 values:
				 * <ul>
				 *   <li>Free: The dragging ghost moves along with your mouse cursor.</li>
				 *   <li>Horizontal: The dragged ghost only moves horizontally, cross row dragging is restricted. You can use this mode if you only need to change the times of the dragging shape</li>
				 *   <li>Vertical: <em>Notice</em> Vertical works if only one shape is selected (regardless shapeSelectionMode), it's showing forbidden cursor style on multiple shape selections when you are dragging.
				 *       You can use this vertical mode if you only want to change the assignment without changing shape times.</li>
				 * </ul>
				 */
				dragOrientation: {type: "sap.gantt.DragOrientation", defaultValue: library.DragOrientation.Free},

				/**
				 * The dragging ghost alignment of Gantt Chart. This property define the visual effect of ghost position on dragging, it also effect the parameter value
				 * in event <code>shapeDragEnd</code>
				 *
				 * @see {sap.gantt.dragdrop.GhostAlignment}
				 */
				ghostAlignment: {type: "string", defaultValue: library.dragdrop.GhostAlignment.None},

				/**
				 * Flag to show or hide the start time and end time of a shape when you drag it along the time line. The property takes effect if only one shape is selected or <code>enableMultipleGhosts</code> is set to false.
				 */
				showShapeTimeOnDrag: {type: "boolean", defaultValue: false},

				/**
				 * The width of selection panel.
				 *
				 * In <code>sap.gantt.simple.GanttChartWithTable</code>, the selectionPanelSize is the Table/TreeTable width in
				 * the embedded Splitter.
				 */
				selectionPanelSize: {type: "sap.ui.core.CSSSize", defaultValue: "30%"},

				/**
				 * Defines how the Gantt chart is displayed.
				 * <ul>
				 * <li>If set to <code>Both</code>, both the table and the chart are displayed.</li>
				 * <li>If set to <code>Chart</code>, only the chart is displayed.</li>
				 * <li>If set to <code>Table</code>, only the table is displayed.</li>
				 * </ul>
				 * When the parent element of the Gantt chart is the {@link sap.gantt.simple.GanttChartContainer}, this
				 * property overrides the <code>displayType</code> property of {@link sap.gantt.simple.GanttChartContainer}.
				 */
				displayType: {type: "sap.gantt.simple.GanttChartWithTableDisplayType", defaultValue: GanttChartWithTableDisplayType.Both},

				/**
				 * Disables or enables the <code>shapeDoubleClick</code> event.
				 * If set to <code>true</code>, the <code>shapeDoubleClick</code> event is disabled.
				 */
				disableShapeDoubleClickEvent: {type: "boolean", defaultValue: false},

				/**
				 * Flag to show or hide the Export Button for a Table.
				 * <b>Note:</b>CustomData - Mandatory field for Export table to Excel functionality. It contains properties that can be configured based on the column configuration, where the key name is restricted to exportTableColumnConfig.
				 * The custom data is created for aggregation of columns in a table.
				 * Export to excel feature is supported for both OData and JSON models, with a restriction that the tree structure converts to a flat array for a JSON model.
				 * The fields supported in the custom data are:
				 * <ul>
				 *  <li>leadingProperty - DataSource field for a column. This is a mandatory field.</li>
				 *  <li>columnKey - Identifier for individual columns.</li>
				 *  <li>dataType - Data type for the given column element. The supported data types are dateTime, stringDate, date, time, boolean, string and numeric.</li>
				 *  <li>isCurrency - Boolean value to determine if the column type contains Currency.</li>
				 *  <li>unit - Text to display as the unit of measurement of a numeric value.</li>
				 *  <li>unitProperty - Name of the DataSource field that contains the unit/currency texts.</li>
				 *  <li>scale - Number of digits after the decimal point of numeric values.</li>
				 *  <li>precision - Precision for numeric values.</li>
				 *  <li>displayFormat - Date format to be displayed. The default for dateTime is DD-MM-YY HH:MM, and the default for date is DD-MM-YY.</li>
				 *  <li>hierarchyNodeLevel - DataSource field which contains the hierarchy level. This is currently supported only for OData models.</li>
				 *  <li>wrap - Boolean value to determine whether the contents of the table should be wrapped.</li>
				 * </ul>
				 * Example:
				 * <pre>
				 * 	<code>
				 * 		&lt;Column sortProperty="ObjectName" filterProperty="ObjectName"&gt;
				 * 			&lt;customData&gt;
				 * 				&lt;core:CustomData key="exportTableColumnConfig"
				 * 					value='{"columnKey": "ObjectName",
				 *	 				"leadingProperty":"ObjectName",
				 * 					"dataType": "string",
				 * 					"hierarchyNodeLevel": "HierarchyNodeLevel",
				 * 					"wrap": true}' /&gt;
				 * 			&lt;/customData&gt;
				 * 			&lt;m:Text text="Object Name"/&gt;
				 * 			&lt;template&gt;
				 * 				&lt;m:Label text="{data>ObjectName}"/&gt;
				 * 			&lt;/template&gt;
				 * 		&lt;/Column&gt;
				 * 	</code>
				 * </pre>
				 */
				showExportTableToExcel: {type: "boolean", defaultValue: false},

				/**
				 * Allows to drag, drop, and resize a shape on explicitly selecting the shape.
				 * @since 1.85
				 */
				enableSelectAndDrag: {type: "boolean", defaultValue: true},

				/**
				 * Property to add custom color to the highlighted area between delta lines. This would default to Fiori standard color
				 * @since 1.86
				 */
				deltaAreaHighlightColor: {type: "string", defaultValue: "@sapUiListSelectionBackgroundColor"},

				/**
				 * Enables inversion on shape selection while drawing lasso
				 */
				enableLassoInvert: {type: "boolean", defaultValue: false},

				/**
				 * Option to show or hide the parent row on expand. This is applicable only for multi-activity row settings.
				 * @since 1.86
				 */
				showParentRowOnExpand: {type: "boolean", defaultValue: true},

				/**
				 * Defines the batch size, that is the number of rows, to be printed per iteration.
				 * If set to 0, batching is disabled and the entire Gantt chart is printed. This could slow the performance and make the browser non-responsive.
				 * Note: Relationship lines can be interrupted if the start and end points are in different canvases. To minimize this effect, choose a bigger batch size, ensuring that the browser is responsive during printing.
				 * @since 1.90
				 */
				printingBatchSize: {type: "int", defaultValue: 100},

				/**
				 * Option to show or hide the header of the Gantt chart
				 * @since 1.90
				 */
				showGanttHeader: {type: "boolean", defaultValue: true},

				/**
				 * Flag to indicate if the app is running in Runtime Adaptation (RTA) mode.
				 * @since 1.91
				 * @private
				 */
				_isAppRunningInRTA: { type: 'boolean', defaultValue: false, visibility: "hidden"},
				/**
				 * Enables snapping of shapes to attach to the nearest visual element while dragging.
				 * @since 1.91
				 */
				snapMode: {type: "sap.gantt.dragdrop.SnapMode", defaultValue: library.dragdrop.SnapMode.None},
				/**
				 * Defines the least time taken in seconds for a shape to snap while in a particular zoom level.
				 * eg.
				 * {
				 * "4hour":{timeInterval:1800}, ---> 30mins Snap
				 * "1hour":{timeInterval:900} ---> 15mins Snap
				 * }
				 * @since 1.91
				 */
				snapTimeInterval: {type: "object", defaultValue: {}},

				/**
				 * Option to show or hide the chart overflow toolbar.
				 * @since 1.92
				*/
				enableChartOverflowToolbar: {type: "boolean", defaultValue: false},

				/**
				 * Option to disable or enable the chart row's selection state.
				 * @since 1.93
				*/
				enableChartSelectionState: {type: "boolean", defaultValue: true},

				/**
				 * Option to disable or enable the chart row's hover state.
				 * @since 1.93
				*/
				enableChartHoverState: {type: "boolean", defaultValue: true},
				/**
				 * Enables selection of only graphical shapes excluding labels.
				 * @since 1.93
				 */
				selectOnlyGraphicalShape: { type: "boolean", defaultValue: false },

				/**
				 * Option to show or hide shape labels on ghost while dragging. The property takes effect only when <code>enableMultipleGhosts</code> is set to true.
				 * @since 1.94
				*/
				showTextOnGhost: {type: "boolean", defaultValue: true},
				/**
				* Specifies the size of the relationship's shape.
				* Applicable to triangles, square, diamond, and circle shapes; excluding horizontal rectangle and vertical rectangle shapes.
				* @since 1.96
				*/
				relationshipShapeSize: { type:"sap.gantt.simple.relationshipShapeSize", defaultValue: library.simple.relationshipShapeSize.Medium },
				/**
				* Determines if only tasks need to be used for rendering the expanded shapes.
				* Subtasks are not required.
				* @since 1.98
				*/
				useParentShapeOnExpand: { type: "boolean", defaultValue: false},

				/**
				 * Defines the property names for which findAll method should search in different entities
				 * @since 1.100
				 */
				findBy: { type: 'string[]', defaultValue: []},

				/**
				 * Defines relationship between the operator and the property names using the findAll method
				 * @since 1.100
				 */
				findByOperator: { type: 'string', defaultValue: library.simple.findByOperator.OR},

				/**
				 * Defines whether shapeConnectorList is displayed upon the click of connector/relationship or not
				 * @since 1.102
				 */
				isConnectorDetailsVisible: { type: "boolean", defaultValue: false},

				/**
				*The rowHighlightFill property defines the color that is filled for the highlighted rows when a shape is being dragged
				* The highlighted rows are the ones where the shape drop is allowed
				* @since 1.108
				*/
				rowHighlightFill: {type : "sap.gantt.ValueSVGPaintServer"},

				/**
				* The rowHighlightAndHoverFill property defines the color that is filled for the highlighted and hovered rows when a shape is being dragged
				* The highlighted rows are the ones where the shape drop is allowed
				* @since 1.108
				*/
				rowHighlightAndHoverFill: {type : "sap.gantt.ValueSVGPaintServer"},

				/**
				* Set to true if Gantt chart is configured to be lazy loaded horizontally.  Application should fetch the data only for the visible horizon.
				* Application also should make sure to fetch the relevant data on user interactions like horizontal scroll, zoom out, bird eye which changes the visible horizon until the time when all the data is fetched.
				* This property has to be used with <code>setAllDataLoadedPromise()</code>.
				* @since 1.109
				*/
				horizontalLazyLoadingEnabled: {type : "boolean", defaultValue: false},

				/**
				 * Optimizes the rendering of overlapping shapes
				 * @since 1.110
				 */
				enablePseudoShapes: { type: "boolean", defaultValue: false},
				/**
				 * Time in milliseconds where the mouse has to be on the same shape for the specified time before triggering the <code>shapeMouseEnter</code> event
				 * @since 1.112
				 */
				shapeMouseEnterDelay: {type:"int", defaultValue: 500},
				/**
				 * Time in milliseconds where the mouse has moved out of the hovered shape for the specified time before triggering the <code>shapeMouseLeave</code> event
				 * @since 1.112
				 */
				shapeMouseLeaveDelay: {type:"int", defaultValue: 500},
				/** Comma-separated value of shape aggregations to decide the rendering order
				 * The aggregations first in the array are rendered first. Aggregations not mentioned in the array will be rendered at the very first
				 * Example: "shapes3,shapes2,shapes1" means shapes3 will be rendered at the bottom, and shapes1 will be rendered at the top
				 * @since 1.113
				 */
				shapeRenderOrder: {type: "string[]", defaultValue: []},

				/**
				 * Flag to enable displaying multiple ghosts when multiple shapes are selected and dragged.
				 * @since 1.127
				 */
				enableMultipleGhosts: {type: "boolean", defaultValue: true}
			},
			aggregations: {
				/**
				 * Table of the Gantt Chart
				 *
				 * You can use {sap.ui.table.Table} if you have a flat list data or {sap.ui.table.TreeTable} if you have hierarchical data.
				 */
				table: {type: "sap.ui.table.Table", multiple: false},

				/**
				 * The aggregation is used to store configuration of adhoc lines, adhoc lines represent milestones and events in axis time.
				 * @deprecated Since version 1.84, use {@link sap.gantt.simple.AdhocLine} instead.
				 */
				adhocLines: {type: "sap.gantt.AdhocLine", multiple: true, singularName: "adhocLine", bindable: "bindable", visibility: "public"},

				/**
				 * The aggregation is used to store configuration of adhoc lines, adhoc lines represent milestones and events in axis time.
				 * @since 1.84
				 */
				simpleAdhocLines: {type: "sap.gantt.simple.AdhocLine", multiple: true, singularName: "simpleAdhocLine", bindable: "bindable", visibility: "public"},

				/**
				* The aggregation is used to store configuration of Delta Lines
				* @since 1.84
				*/
				deltaLines: { type: "sap.gantt.simple.DeltaLine", multiple: true, singularName: "deltaLine", bindable: "bindable", visibility: "public"
				},

				/**
				 * SVG reusable element definitions.
				 *
				 * If this property is provided, the paint server definition of the SVG is rendered. Method <code>getDefString()</code> should be
				 * implemented by all paint server classes that are passed in in this property.
				 * We recommend that you set the type of this argument to <code>sap.gantt.def.SvgDefs</code>. Otherwise some properties you set may not function properly.
				 */
				svgDefs: {type: "sap.gantt.def.SvgDefs", multiple: false, singularName: "svgDef"},
				/**
				 * SVG reusable element definitions for pseudo shapes.
				 * @private
				 */
				_pseudoSvgDefs: {type: "sap.gantt.def.SvgDefs", multiple: false, singularName: "pseudoSvgDef", visibility: "hidden"},
				/**
				 * Shape schemes of Gantt Chart.
				 *
				 * Defines all the possible shape schemes in the Gantt chart control.
				 * <b>Note:</b>If you don't use expand chart, you can omit this aggregations.
				 * If not set, a default <code>sap.gantt.simple.ShapeScheme</code> is provided automatically.
				 */
				shapeSchemes: {type: "sap.gantt.simple.ShapeScheme", multiple: true, singularName: "shapeScheme"},

				/**
				 * Paint servers consumed by special shape <code>sap.gantt.shape.cal.Calendar</code>.
				 *
				 * This aggregation is designed to improve performance of calendar shapes. Rows usually share a similar definition with calendar shapes.
				 * It is possible to define a Calendar paint server to draw only one rectangle for each row. Notes for classes extended from
				 * <code>sap.gantt.def.cal.CalendarDef</code>: Different from property <code>paintServerDefs</code>, paint servers defined here must
				 * implement method <code>getDefNode()</code> instead of method <code>getDefString()</code>.
				 */
				calendarDef: {type: "sap.gantt.def.cal.CalendarDefs", multiple: false, bindable: "bindable"},

				/**
				 * This aggregation controls the zoom strategies and zoom rate in Gantt Chart.
				 */
				axisTimeStrategy: {type: "sap.gantt.axistime.AxisTimeStrategyBase", multiple: false, bindable: "bindable"},

				/**
				 * Configuration of locale settings.
				 *
				 * Most locale settings can be configured in sap.ui.configuration objects. Only the time zone and day-light-saving time options
				 * are provided by locale settings.
				 * We recommend that you set the type of this argument to <code>sap.gantt.config.Locale</code>. Otherwise some properties you set may not function properly.
				 */
				locale: {type: "sap.gantt.config.Locale", multiple: false},

				/**
				 * private aggregation for resizing the selection panel
				 * @private
				 */
				_splitter: {type: "sap.ui.layout.Splitter", multiple: false, visibility:"hidden"},

				/**
				 * Header of the Gantt Chart
				 * @private
				 */
				_header: {type: "sap.gantt.simple.GanttHeader", multiple : false, defaultValue: null, visibility:"hidden"},

				/**
				 * Inner Gantt chart
				 * @private
				 */
				_innerGantt: {type: "sap.gantt.simple.InnerGanttChart", multiple: false, visibility:"hidden"},

				/**
				* Specifies a data structure with arbitrary key value pairs to support customization of Gantt charts with tables.
				* @since 1.90
				*/
				ganttAdaptationData: { type: "sap.gantt.simple.GanttAdaptationData", multiple: true},

				/**
				 * Items can be added in chart overflow toolbar using this aggregation.
				 * @since 1.102
				 */
				overflowToolbarItems: {type: "sap.ui.core.Control", multiple: true},
				/**
				 * Configuration for the Gantt chart styles.
				 * This Aggregation will override shapeStyles aggregation of ganttChartContainer.
				 * @since 1.130
				 */
				shapeStyles: {type: "sap.gantt.simple.ShapeStyle", multiple: true }
			},
			events: {
				/**
				 * Fired when the shape selection of the gantt chart has been changed.
				 */
				shapeSelectionChange: {
					parameters: {
						/**
						 * all selected shape UID.
						 */
						shapeUids: {type: "string[]"}
					}
				},
				/**
				 * Fired when the shape's highlight has been changed
				 * @since 1.100
				 */
				shapeHighlightChange: {
					parameters: {
						/**
						 * all highlighted shape UID.
						 */
						shapeUids: {type: "string[]"}
					}
				},

				/**
				 * Fired when a shape is resized.
				 */
				shapeResize: {
					parameters: {
						/**
						 * UID of the resized shape.
						 */
						shapeUid: {type: "string"},

						/**
						 * Shape instance of the resized shape
						 */
						shape: {type: "sap.gantt.simple.BaseShape"},

						/**
						 * Row object of the resizing shape.
						 */
						rowObject: {type: "object"},

						/**
						 * Original shape time array, including the start time and end time.
						 */
						oldTime: {type: "string[]"},

						/**
						 * New shape time array, including the start time and end time.
						 */
						newTime: {type: "string[]"}
					}
				},

				/**
				 * Event fired when a shape is hovered over.
				 */
				shapeMouseEnter: {
					parameters: {
						/**
						 * The data of the shape which fires this event.
						 */
						shape: {type: "sap.gantt.simple.BaseShape"},

						/**
						 * The mouse position relative to the left edge of the document.
						 */
						pageX: {type: "int"},

						/**
						 * The mouse position relative to the top edge of the document.
						 */
						pageY: {type: "int"}
					}
				},

				/**
				 * Fired when the mouse pointer leaves the shape.
				 */
				shapeMouseLeave: {
					parameters: {
						/**
						 * which shape element trigger the event.
						 */
						shape: {type: "sap.gantt.simple.BaseShape"},

						/**
						 * Original JQuery event object.
						 */
						originEvent: {type: "object"}

					}
				},

				/**
				 * This event is fired when a shape is clicked or tapped.
				 */
				shapePress: {
					parameters:{
						/**
						 * Offset for an {@link sap.m.Popover} placement on the x axis, in pixels.
						 */
						popoverOffsetX: {type: "int"},

						/**
						 * Row settings of the row that has been clicked or tapped.
						 */
						rowSettings: {type: "sap.gantt.simple.GanttRowSettings"},

						/**
						 * Instance of the shape that has been clicked or tapped.
						 */
						shape: {type: "sap.gantt.simple.BaseShape"},
						/**
						 * Ctrl or Meta key is pressed.
						 */
						ctrlOrMeta: {type: "boolean"},
						/**
						 * The mouse position relative to the left edge of the document.
						 */
						pageX: {type: "int"},

						/**
						 * The mouse position relative to the top edge of the document.
						 */
						pageY: {type: "int"},

						/**
						 * Original JQuery event object.
						 */
						originEvent: {type: "object"}

					},
					allowPreventDefault: true
				},

				/**
				 * This event is fired when a shape is double-clicked or double-tapped.
				 */
				shapeDoubleClick: {
					parameters:{
						/**
						 * Offset for an {@link sap.m.Popover} placement on the x axis, in pixels.
						 */
						popoverOffsetX: {type: "int"},

						/**
						 * Row settings of the double-clicked row.
						 */
						rowSettings: {type: "sap.gantt.simple.GanttRowSettings"},

						/**
						 * Instance of the double-clicked shape.
						 */
						shape: {type: "sap.gantt.simple.BaseShape"},
						/**
						 * The mouse position relative to the left edge of the document.
						 */
						pageX: {type: "int"},

						/**
						 * The mouse position relative to the top edge of the document.
						 */
						pageY: {type: "int"}
					}
				},

				/**
				 * This event is fired when you right-click the shape.
				 */
				shapeContextMenu: {
					parameters:{
						/**
						 * The mouse position relative to the left edge of the document.
						 */
						pageX: {type: "int"},

						/**
						 * The mouse position relative to the top edge of the document.
						 */
						pageY: {type: "int"},

						/**
						 * Offset for an {@link sap.m.Popover} placement on the x axis, in pixels.
						 */
						popoverOffsetX: {type: "int"},

						/**
						 * Row settings of the right-clicked row.
						 */
						rowSettings: {type: "sap.gantt.simple.GanttRowSettings"},

						/**
						 * Instance of the right-clicked shape.
						 */
						shape: {type: "sap.gantt.simple.BaseShape"},

						/**
						 * Original JQuery event object.
						 */
						originEvent: {type: "object"}
					}
				},

				/**
				 * Event fired when a drag-and-drop begins
				 */
				dragStart: {
					parameters: {
						/** The source Gantt chart */
						sourceGanttChart: {type: "sap.gantt.simple.GanttChartWithTable"},

						/**
						 * Object of dragged shapes dates, it's structured as follows:
						 * <pre>
						 * {
						 *     "shapeUid1": {
						 *          "time": date1,
						 *          "endTime": date2,
						 *     },
						 *     "shapeUid2": {
						 *          "time": date3,
						 *          "endTime": date4,
						 *     },
						 * }
						 * </pre>
						 *
						 * You can't get all selected shape instances because scrolling might destroy shapes on the invisible rows.
						 */
						draggedShapeDates: {type: "object"},

						/** The last shape out of those being dragged. */
						lastDraggedShapeUid: {type: "string"},

						/**
						 * Represents the mouse pointer's date & time when the <code>dragStart</code> event was fired.
						 */
						cursorDateTime: {type: "object"}
					}
				},

				/**
				 * Event fired when a drag-and-drop occurs on one or more selected shapes.
				 */
				shapeDrop: {
					parameters: {

						/** The source gantt chart */
						sourceGanttChart: { type: "sap.gantt.simple.GanttChartWithTable" },

						/** The target gantt chart */
						targetGanttChart: { type: "sap.gantt.simple.GanttChartWithTable" },

						/**
						 * Object of dragged shapes date, it's structure is:
						 * <pre>
						 * {
						 *     "shapeUid1": {
						 *          "time": date1,
						 *          "endTime": date2,
						 *     },
						 *     "shapeUid2": {
						 *          "time": date3,
						 *          "endTime": date4,
						 *     },
						 * }
						 * </pre>
						 *
						 * It's impossible to get all selected shape instances because of scrolling might destroy shapes on the invisible rows
						 */
						draggedShapeDates: { type: "object" },

						/** The last dragged shape */
						lastDraggedShapeUid: {type: "string"},

						/**
						 * The target row of gantt chart.
						 * No source row because of user might drag multiple shapes on different rows.
						 */
						targetRow: { type: "sap.ui.table.Row"},

						/**
						 * Represent the cursor date & time when drop event fired
						 */
						cursorDateTime: {type: "object"},

						/**
						 * The startTime or endTime of a dropped shape.
						 * In Free or Horizontal drag orientation, the value depends on the ghost alignment:
						 * <ul>
						 * <li>Start: newDateTime is the shape new start time, newDateTime is equal with cursorDateTime</li>
						 * <li>None: newDateTime is the shape new start time</li>
						 * <li>End: newDateTime is the shape new end time, newDateTime is equal with cursorDateTime</li>
						 * </ul>
						 *
						 * In Veritcal drag orientation, newDateTime is the shape new start time, and not equal with cursorDateTime in usual.
						 *
						 * @see sap.gantt.dragdrop.GhostAlignment
						 * @see sap.gantt.DragOrientation
						 */
						newDateTime: {type: "object"},

						/**
						 * Represents the shape which the dragged shape dropped on.
						 */
						targetShape: {type: "sap.gantt.simple.BaseShape"}
					}
				},

				/**
				 * Event fired when one shape dragged and connected to another shape.
				 */
				shapeConnect: {
					parameters: {
						/**
						 * The source shape's shapeUid
						 */
						fromShapeUid: {type: "string"},
						/**
						 * The target shape's shapeUid
						 */
						toShapeUid: {type: "string"},
						/**
						 * The value comes from <code>sap.gantt.simple.RelationshipType</code>, which represents type of relationship
						 */
						type: {type: "sap.gantt.simple.RelationshipType"}
					}
				},

				/**
				 * This event is fired when the visible horizon is changed.
				 *
				 * @since 1.68
				 */
				visibleHorizonUpdate: {
					parameters: {
						/**
						 * Specifies how the update was initiated.
						 */
						type: {type: "sap.gantt.simple.VisibleHorizonUpdateType"},

						/**
						 * Provides subType information about the type.
						 * @since 1.100
						 */
						subType: {type: "sap.gantt.simple.VisibleHorizonUpdateSubType"},

						/**
						 * Value of the visible horizon before the current update. Some types of this event don't have this value.
						 */
						lastVisibleHorizon: {type: "sap.gantt.config.TimeHorizon"},

						/**
						 * Value of the visible horizon after the current update.
						 */
						currentVisibleHorizon: {type: "sap.gantt.config.TimeHorizon"},
						/**
						 * Value of the visible horizon with buffer before the current update.
						 * @since 1.102
						 */
						lastRenderedVisibleHorizon: {type: "sap.gantt.config.TimeHorizon"},
						/**
						 * Value of the visible horizon with buffer after the current update.
						 * @since 1.102
						 */
						currentRenderedVisibleHorizon: {type: "sap.gantt.config.TimeHorizon"}
					}
				},
				/**
				 * This event is fired when you click the connector/relationship.
				 * @since 1.102
				 */
				 shapeConnectorList: {
					parameters:{
						/**
						 * The mouse position relative to the left edge of the document.
						 */
						pageX: {type: "int"},

						/**
						 * The mouse position relative to the top edge of the document.
						 */
						pageY: {type: "int"},

						/**
						 * Array of connectors list at the cursor point
						 */
						connectorList: {type: "object"}
					}
				},
				/**
				 * This event is fired when Gantt chart is rendered completely.
				 * @since 1.100
				 */
				renderingComplete: {}
			},
			designtime: "sap/gantt/designtime/simple/GanttChartWithTable.designtime"
		}
	});

	GanttChartWithTable.prototype.getEnablePseudoShapes = function() {
		if (this._bEnablePseudoShapes === undefined) {
			this._bEnablePseudoShapes = UriParameters.fromQuery(window.location.search).get("sap-gantt-xx-EnablePseudoShapes") === "true";
		}

		return this._bEnablePseudoShapes ||  this.getProperty("enablePseudoShapes");
	};

	GanttChartWithTable.prototype.init = function () {
		// this is the svg width with some buffer on both left and right sides.
		this.iGanttRenderedWidth = -1;
		this._bExtensionsInitialized = false;
		this._bSupressShapeChangeEvent = false;

		this._bRowActionInitialRender = false;

		this._oExpandModel = new ExpandModel();
		this._aExpandedIndices = []; //store expanded row indices to be used in printing

		this._oSplitter = new Splitter({
			id: this.getId() + "-ganttChartSplitter"
		});
		this.setAggregation("_splitter", this._oSplitter);

		this._oSyncedControl = new GanttSyncedControl();
		var oInnerGanttChart = new InnerGanttChart();
		this.setAggregation("_innerGantt",oInnerGanttChart);
		this.setAggregation("_header", new GanttHeader());
		oInnerGanttChart.attachEvent("ganttReady",function(oEvent){
			var bSupressEvent = oEvent.getParameter("supressEvent");
			if (!bSupressEvent) {
				this.fireRenderingComplete();
			}
		}.bind(this));

		// Indicates previous display type
		this._sPreviousDisplayType = this.getDisplayType();

		this.searchTxt = [];
		this.searchProperty = [];
		this._createInnerGanttRenderPromise();
	};

	/**
	 * sap.gantt library internal use only
	 *
	 * @private
	 * @returns {sap.gantt.simple.InnerGanttChart} Embedded Gantt instance
	 */
	GanttChartWithTable.prototype.getInnerGantt = function() {
		return this.getAggregation("_innerGantt");
	};

	GanttChartWithTable.prototype.onSplitterResize = function(oEvent){
		var aOldSizes = oEvent.getParameter("oldSizes"),
			aNewSizes = oEvent.getParameter("newSizes"),
			bResizedX = aOldSizes.length > 0 && aNewSizes.length > 0 && (aOldSizes[0] !== aNewSizes[0] || aOldSizes[1] !== aNewSizes[1]),
			sDisplayType = this.getDisplayType(),
			iNewSizeX = aNewSizes[0],
            bTempDisplayType = false;

		if (this._sPreviousDisplayType !== sDisplayType) {
            bTempDisplayType = true;
			this._isDisplayTypeChanged = true;
		} else {
			this._isDisplayTypeChanged = false;
		}

		if (bResizedX) {
			if (sDisplayType === GanttChartWithTableDisplayType.Both) {
				this._onResize(bResizedX);
			}

			var fnIsValidZeroValue = function (aSizes) {
				// Sometimes during rerendering phase, splitter fires resize with first value being zero
				// even though selectionPanelSize is not set to zero. SelectionPanelSize is then set to wrong value
				// and this causes wrong overlap on the table (see BCP 1970349825).
				return this.getSelectionPanelSize().startsWith("0") || aSizes[0] !== 0;
			}.bind(this);

			// We need to determine if the resize happened by user resizing splitter or if the entire container changed size.
			// We cannot use exact equal, as sometimes rounding errors cause few pixels error
			if (almostEqual(aOldSizes.reduce(add), aNewSizes.reduce(add)) && aOldSizes[0] !== aNewSizes[0] && fnIsValidZeroValue(aOldSizes)) {
				this.setProperty("selectionPanelSize", this._oSplitter._getContentAreas()[0].getLayoutData().getSize(), true);
				this.fireEvent("_selectionPanelResize", {
					newWidth: iNewSizeX,
					displayType: sDisplayType
				});
			}
			if (bTempDisplayType) {
				this._isDisplayTypeChanged = true;
			} else {
				this._isDisplayTypeChanged = false;
			}
			this._draw();
		}
	};

	/**
	 * Sets the {@link sap.ui.core.LayoutData} defining the layout constraints
	 * for this control when it is used inside a layout.
	 *
	 * @param {sap.ui.core.LayoutData} oLayoutData which should be set
	 * @returns {this} Returns <code>this</code> to allow method chaining
	 * @public
	 */
	GanttChartWithTable.prototype.setLayoutData = function(oLayoutData) {
		this.setAggregation("layoutData", oLayoutData, true);
		this.fireEvent("_layoutDataChange");
		return this;
	};

	GanttChartWithTable.prototype.setDisplayType = function (sDisplayType) {
		this._sPreviousDisplayType = this.getDisplayType();
		if (this._sPreviousDisplayType === GanttChartWithTableDisplayType.Both && sDisplayType !== GanttChartWithTableDisplayType.Both) {
			// if exiting Both display type, save its table sizeX (it's used when going back to Both display type in the future)
			//this._iLastTableAreaSize = this.getAggregation("_splitter").getCalculatedSizes()[0];
			this._iLastTableAreaSize = this.getAggregation("_splitter").getContentAreas()[0] &&  this.getAggregation("_splitter").getContentAreas()[0].getLayoutData().getSize();
		}

		this._isDisplayTypeChanged = true;
		this.setProperty("displayType", sDisplayType, false); // needs to be called before this._setupDisplayType()

		if (sDisplayType === GanttChartWithTableDisplayType.Table) {
			this._iLastVisibleWidth = this.getVisibleWidth();
			this.setProperty("selectionPanelSize", "auto", true);
			// no jump to visible horizon needed for gantt since it won't be rendered
		} else {
			delete this._bPreventInitialRender; // might need to jump to visible horizon before rendering
		}
		this._setupDisplayType();
		return this;
	};

	/**
	 * Performs shape selection settings
	 * @param {object} oShapeSelectionSettings used to configure shape selection styles
	 * @since 1.90
	 */
	GanttChartWithTable.prototype.setShapeSelectionSettings = function(oShapeSelectionSettings) {
		this.setProperty("shapeSelectionSettings", oShapeSelectionSettings, true);
		if (this._getResizeExtension) {
			this._getResizeExtension().updatemSelectionSettings();
		}
	};

	/**
	 * Performs the setting for a highlighted shape
	 * @param {object} oShapeHighlightSettings used to configure shape highlight styles
	 * @since 1.100
	 */
	GanttChartWithTable.prototype.setShapeHighlightSettings = function(oShapeHighlightSettings) {
		this.setProperty("shapeHighlightSettings", oShapeHighlightSettings, true);
		if (this._getResizeExtension) {
			this._getResizeExtension().updatemHighlightSettings();
		}
	};

	GanttChartWithTable.prototype.setSelectionPanelSize = function (sSelectionPanelSize) {
		this.setProperty("selectionPanelSize", sSelectionPanelSize, false);
		delete this._iLastTableAreaSize; // because selectionPanelSize will take precedence now
		this._setSplitterLayoutData(sSelectionPanelSize, "auto");
		return this;
	};

	GanttChartWithTable.prototype.applySettings = function(mSettings, oScope) {
		mSettings = mSettings || {};
		this._applyMissingSettings(mSettings);
		Control.prototype.applySettings.call(this, mSettings, oScope);
		// init the selection model with shape selection mode
		this._initSelectionModel(this.getProperty("shapeSelectionMode"));
		// init the highlight model with shape highlight mode
		this._initHighlightModel("Single");
	};

	/**
	 * Sets the shape rendering order for gantt chart
	 * @param {Array.<string>} aShapeRenderOrder array of shape aggregations in rendering order
	 * @param {Boolean} bSuppressInvalidate Flag to suppress re-rendering of the control
	 * @since 1.113
	 */
	GanttChartWithTable.prototype.setShapeRenderOrder = function(aShapeRenderOrder, bSuppressInvalidate) {
		if (typeof bSuppressInvalidate === "undefined") {
			bSuppressInvalidate = true;
		}
		aShapeRenderOrder = Array.from(new Set(aShapeRenderOrder));
		this._aShapeRenderOrder = null;
		this.setProperty("shapeRenderOrder", aShapeRenderOrder, bSuppressInvalidate);
	};

	/**
	 * Sets the locale for the gantt chart timeline
	 * @param {sap.gantt.config.Locale} oLocale value to set as the locale
	 * @since version 1.119
	 */
	GanttChartWithTable.prototype.setLocale = function (oLocale) {
		var oCurrentLocale = this.getLocale();
		var sCurrentTimezone = oCurrentLocale ? oCurrentLocale.getTimeZone() : null;
		var sNewTimezone = oLocale.getTimeZone();

		if (sCurrentTimezone !== sNewTimezone) {
			this.setAggregation("locale", oLocale);

			var oAxisTimeStrategy = this.getAxisTimeStrategy();

			if (oAxisTimeStrategy) {
				var oAxisTime = oAxisTimeStrategy.getAxisTime();
				var oSkipTimePattern = oAxisTimeStrategy.getSkipTimePattern();

				if (oAxisTime) {
					oAxisTime.setLocale(oLocale);
				}

				if (oSkipTimePattern) {
					oSkipTimePattern.setLocale(oLocale);
				}
			}
		}
	};

	/**
	 * Apply the missing settings.
	 *
	 * GanttChartWithTable requires axisTimeStrategy, locale and shapeScheme aggregations when initializing.
	 * If user didn't apply those settings, fallback to the default ones.
	 * @private
	 * @param {object} mSettings The constructor settings
	 */
	GanttChartWithTable.prototype._applyMissingSettings = function(mSettings) {
		if (!mSettings.axisTimeStrategy) {
			mSettings.axisTimeStrategy = new ProportionZoomStrategy();
		}

		if (!mSettings.locale) {
			// use cloned locale just in case it's destroyed by the framework
			mSettings.locale = library.config.DEFAULT_LOCALE.clone();
		}

		if (!mSettings.shapeSchemes) {
			mSettings.shapeSchemes = [ new ShapeScheme({key : "default", primary: true}) ];
		} else {
			var bHasPrimaryScheme = mSettings.shapeSchemes.some(function(oScheme) {
				return oScheme.getPrimary();
			});
			if (!bHasPrimaryScheme) {
				Log.warning("you need set a ShapeSheme with primary:true");
			}
		}
	};

	/**
	 * Return the first primary shape scheme
	 *
	 * @private
	 * @returns {sap.gantt.simple.ShapeScheme} the primary shape scheme
	 */
	GanttChartWithTable.prototype.getPrimaryShapeScheme = function() {
		return this.getShapeSchemes().filter(function(oScheme){
			return oScheme.getPrimary();
		})[0];
	};

	/**
	 * Return the internal control which used for table & gantt synchronization
	 * This method shall be used only inside the library
	 *
	 * @private
	 * @returns {sap.gantt.simple.GanttSyncedControl} the replica control for synchronization
	 */
	GanttChartWithTable.prototype.getSyncedControl = function() {
		return this._oSyncedControl;
	};

	/**
	 * return the table row heights
	 * This method shall be used only inside the library
	 * @private
	 * @returns {int[]} all visible row heights
	 */
	GanttChartWithTable.prototype.getTableRowHeights = function() {
		return this.getSyncedControl().getRowHeights();
	};

	GanttChartWithTable.prototype.setTable = function (oTable) {
		this.setAggregation("table", oTable);

		//add designtime for table

		oTable.addCustomData(
			new CustomData({
				key : "sap-ui-custom-settings",
				value : {
					"sap.ui.dt" : {
						"designtime": "sap/gantt/designtime/simple/Table.designtime" // || "not-adaptable" || "not-adaptable-visibility" || "not-adaptable-tree"
					}
				}
			})
		);

		// Enable the variable row height feature (half row scrolling)
		oTable._bVariableRowHeightEnabled = true;

		// Try to remove the first content in splitter, just in case it's already there
		var oOldTableWrapper = this._oSplitter.removeContentArea(0);

		// add the wrapped table as the first splitter content
		this._oSplitter.insertContentArea(new AssociateContainer({
			content: oTable,
			enableRootDiv: true,
			layoutData: oTable.getLayoutData() ? oTable.getLayoutData().clone() : new SplitterLayoutData({size: this.getSelectionPanelSize()})
		}), 0);

		var oRowActionTemplate = oTable.getRowActionTemplate();
		if (oRowActionTemplate && oRowActionTemplate.isA("sap.gantt.simple.GanttRowAction") &&
			oRowActionTemplate.getControlTemplate()) {
			GanttUtils.setTableRowMode(oTable);
			if (oTable.getRowMode()) {
				oTable.getRowMode().setRowContentHeight(80);
			} else {
				/**
				 * @deprecated As of version 1.119
				 */
				oTable.setRowHeight(80);
			}
		}

		if (oOldTableWrapper == null) {
			// first time the table is set as aggregation, the syncWith shall be called only once
			this._oSyncedControl.syncWith(oTable);

			// the GanttSyncControl as the second content
			this._oSplitter.addContentArea(this._oSyncedControl);
		} else if (oOldTableWrapper && oOldTableWrapper.getContent() !== oTable.getId()) {
			// the table instance is replaced
			this._oSyncedControl.syncWith(oTable);
		}

		oTable.detachEvent("_rowsUpdated", this._onTableRowsUpdated, this);
		oTable.attachEvent("_rowsUpdated", this._onTableRowsUpdated, this);
		oTable.attachEvent("columnMove", this._onTableColumnMove, this);
		oTable.attachEvent("filter", this._onTableFilter, this);
		oTable.attachEvent("sort", this._onTableSorter, this);
		oTable.attachEvent("columnVisibility", this._onColumnVisible, this);
		oTable.attachEvent("settingsChange", this._onTableSettingsChanged, this); // this event is fired once table setting is changed from personalization dailog.

	};

	/**
	 * Sets Gantt adaptation data to customize Gantt chart aggregations.
	 * @param {string} sId unique ID
	 * @param {object} oAdaptationData A data structure containing arbitrary key value pairs.
	 * <i>Refer to the sample code below:</i>
	 * <pre><code>
	 * 	new GanttAdaptationData("ganttChartShapeID",{"key": "shapeData",
	 * 			"value": {
	 * 				"shapeProperties": {
	 * 					"verticalAlign": "Center",
	 * 					"strokeDasharray": "5,1",
	 * 					"strokeWidth": 2
	 * 				}
	 * 			}
	 * }); </code></pre>
	 * @since 1.90
	 */
	GanttChartWithTable.prototype.setGanttAdaptationData = function(sId, oAdaptationData) {
		this.addAggregation("ganttAdaptationData", new GanttAdaptationData(sId, oAdaptationData), true);
	};

	/**
	 * Enable or disable table's variable row height feature
	 * @param {boolean} bEnabled The flag to control it
	 * @protected
	 */
	GanttChartWithTable.prototype.setEnableVariableRowHeight = function(bEnabled) {
		if (this.getTable()) {
			this.getTable()._bVariableRowHeightEnabled = bEnabled;
		} else {
			Log.warning("you need to set table aggregation first");
		}
	};

	/**
	 * Implementation of sap.gantt.simple.GanttChartWithTable.setLargeDataScrolling method.
	 * @param {boolean} bEnabled The flag to control it
	 * @protected
	 */
	GanttChartWithTable.prototype.setLargeDataScrolling = function(bEnabled) {
		if (this.getTable()) {
			this.getTable()._setLargeDataScrolling(bEnabled);
		} else {
			Log.warning("you need to set table aggregation first");
		}
	};

	GanttChartWithTable.prototype.getRenderedTimeRange = function() {
		return this.getAxisTime().getTimeRangeSlice(0, this.iGanttRenderedWidth);
	};

	GanttChartWithTable.prototype._initSelectionModel = function(sSelectionMode) {
		if (this.oSelection) {
			this.oSelection.detachSelectionChanged(this._onSelectionChanged, this);
		}
		this.oSelection = new SelectionModel(sSelectionMode);
		this.oSelection.attachSelectionChanged(this._onSelectionChanged, this);
		return this;
	};

	GanttChartWithTable.prototype.setShapeSelectionMode = function(sSelectionMode) {
		this.setProperty("shapeSelectionMode", sSelectionMode, true);
		if (this.oSelection) {
			this.oSelection.setSelectionMode(sSelectionMode);
		}
		return this;
	};

	GanttChartWithTable.prototype._initHighlightModel = function(sHighlightMode) {
		if (this.oHighlight) {
			this.oHighlight.detachHighlightChanged(this._onHighlightChanged, this);
		}
		this.oHighlight = new HighlightModel(sHighlightMode);
		this.oHighlight.attachHighlightChanged(this._onHighlightChanged, this);
		return this;
	};

	/**
	 * Get selected shapes in gantt chart.
	 *
	 * @public
	 *
	 * @return {Object[]} Array of shape object
	 */
	GanttChartWithTable.prototype.getSelectedShapeUid = function () {
		return this.oSelection.allUid();
	};

	/**
	 * Get the shape IDs for selected shapes in the gantt chart.
	 *
	 * @public
	 *
	 * @return {Object[]} Array of shape IDs
	 */
	GanttChartWithTable.prototype.getSelectedShapeId = function () {
		return this.oSelection.getSelectedShapeIDS();
	};

	/**
	 * Get the highlighted shape in gantt chart
	 *
	 * @public
	 *
	 * @return {Object[]} Array of shape object
	 */
	GanttChartWithTable.prototype.getHighlightedShapeUid = function () {
		return this.oHighlight.allUid();
	};

	/**
	 * Selects a group of shapes specified by the <code>aShapeUids</code> array. Alternatively, this method
	 * deselects all selected shapes when no shape UIDs are provided.
	 * @param {Array.<string>} aShapeUids An array of shape UIDs to select.
	 * @returns {this} a reference to the {@link sap.gantt.simple.GanttChartWithTable} control, can be used for chaining.
	 * @public
	 * @since 1.84
	 */
	GanttChartWithTable.prototype.setSelectedShapeUid = function (aShapeUids) {
		return this.selectShapes(aShapeUids,true);
	};

	/**
	 * Selects a group of shapes specified by the <code>aShapeUids</code> array. Alternatively, this method
	 * deselects all selected shapes when no shape UIDs are provided and the <code>bExclusive</code> parameter is <code>true</code>.
	 *
	 * @param {Array.<string>} aShapeUids An array of shape UIDs to select.
	 * @param {boolean} bExclusive Optional, whether or not to deselect all previously selected shapes.
	 * @returns {this} a reference to the {@link sap.gantt.simple.GanttChartWithTable} control, can be used for chaining.
	 * @public
	 * @since 1.75
	 */
	GanttChartWithTable.prototype.selectShapes = function (aShapeUids, bExclusive) {
		if (!this.oSelection) {
			return this;
		}
		if ((!aShapeUids || aShapeUids.length === 0) && bExclusive) {
			this._bSupressShapeChangeEvent = false;
			this.oSelection.clear(true);
			return this;
		}
		var bSupressShapeEvent = this._bSupressShapeChangeEvent;
		this._bSupressShapeChangeEvent = true;
		if (bExclusive) {
			this.oSelection.clear(false);
			this.getSelection().clearAllSelectedShapeIds();
		} else {
			var oShapeIDs = GanttUtils.getShapeIdFromShapeUid(aShapeUids);
			if (oShapeIDs && oShapeIDs.length > 0) {
				oShapeIDs.forEach(function(aShapeID) {
					this.getSelection().clearDeselectionModelById(aShapeID);
				}.bind(this));
			}
		}
		this._bSupressShapeChangeEvent = bSupressShapeEvent;
		this._updateShapes(aShapeUids, true);
		return this;
	};

	/**
	 * Finds the binding for rowId
	 * @returns rowId Path
	 * @since 1.100
	 * @private
	 */
	GanttChartWithTable.prototype._getRowIdPath = function() {
		return this.getTable().getRowSettingsTemplate().mBindingInfos.rowId.parts[0].path;
	};

	/**
	 * finds binding for shapeId
	 * @returns shapeId Path
	 * @private
	 */
	 GanttChartWithTable.prototype._getShapeIdPath = function() {
		var path;
		if (this.getSelectedShapeUid() && this.getSelectedShapeUid().length > 0) {
			var sShapes = GanttUtils.getShapesWithUid(this.sId, this.getSelectedShapeUid());
			sShapes.forEach(function(sShape) {
				if (!path && sShape) {
					path = sShape.getBindingPath("shapeId");
				}
			});
		} else {
			var aAllRows = this.getTable().getRows();
			aAllRows.forEach(function(aRow){
				if (!path) {
					var oRowSetting = aRow.getAggregation("_settings");
					if (oRowSetting) {
						var mAggregations = AggregationUtils.getAllNonLazyAggregations(oRowSetting);
						var aShapesInRow = Object.keys(mAggregations).filter(function(sName){
							return (sName.indexOf("shapes") === 0);
						}).map(function(sName){
							return oRowSetting.getAggregation(sName) || [];
						});

						aShapesInRow.forEach(function(aShapes) {
							if (aShapes && aShapes.length > 0 && !path) {
								path = aShapes[0].getBinding('shapeId') && aShapes[0].getBinding('shapeId').getPath();
							}
						});
					 }
				}
			});
		}
		return path;
	};

	/**
	 *	Select a group of shapes which matched the search value/property.
	 *	Selects all the shapes matched the find result irrespective of visible area.
	 *  selection based on ObjectId(shapeId)
	 * @param {string} propertyValue value to search for
	 * @param {string} propertyName	property to search the value in. Optional parameter
	 * @param {boolean} overrideExisting flag to override existing selection by UID.
	 * @param {boolean} rowSelection flag to execute row selection. If set as true all matched shapes in the row can be selected.
	 * @public
	 * @since 1.89
	 */
	GanttChartWithTable.prototype.findAndSelect = function (propertyValue, propertyName, overrideExisting, rowSelection) {
		var data = this.findAll(propertyValue,propertyName);
		if (rowSelection) {
			if (overrideExisting) {
				this.searchTxt = [];
				this.searchProperty = [];
			}
			if (this.searchTxt.indexOf(propertyValue) === -1) {
				this.searchTxt.push(propertyValue);
			}
			if (Array.isArray(propertyName)) {
				this.searchProperty.concat(propertyName);
			} else if (this.searchProperty.indexOf(propertyName) === -1){
				this.searchProperty.push(propertyName);
			}
		}
		var selectedShapeIDs = [];
		this._bDeselectShapes = false;
		data.forEach(function(item) {
			if (item.rowID || item.shapeID.length > 0) {
				if (rowSelection) {
					selectedShapeIDs.push({rowId: item.rowID, Selected: true});
				} else {
					item.shapeID.forEach(function(sShapeID) {
						selectedShapeIDs.push({ShapeId: sShapeID, Selected: true});
					});
				}
				item.selected = true;
			}
		});
		if (overrideExisting) {
			this.getSelection().clearAllSelectedShapeIds();
			this.getSelection().updateShape(null, {
				selected: false,
				ctrl: false
			});
		}
		if (selectedShapeIDs.length > 0) {
			this.oSelection.updateSelectedShapes(selectedShapeIDs, overrideExisting, this.getId());
		}
	};

	/**
	 * 	deselect a group of shapes which matched the search value/property.
	 *	deselects all the shapes matched the find result irrespective of visible area.
	 *  deselection based on ObjectId(shapeId)
	 * @param {string} propertyValue value to search for
	 * @param {string} propertyName property to search the value in. Optional parameter.
	 * @param {boolean} rowSelection flag to execute row selection. If set as true all matched shapes in the row can be deselected.
	 * @public
	 * @since 1.89
	 */
	GanttChartWithTable.prototype.findAndDeselect = function (propertyValue, propertyName, rowSelection) {
		var deSelectedShapeIDs = [];
		if (propertyValue === undefined) {
			return;
		}
		if (propertyValue === "") {
			this.getSelection().clearAllSelectedShapeIds();
			this.getSelection().updateShape(null, {
				selected: false,
				ctrl: false
			});
			return;
		}
		var data = this.findAll(propertyValue,propertyName);
		if (rowSelection) {
			this.deSelectTxt = propertyValue;
			this.deSelectProperty = propertyName;
			if (this.searchTxt.indexOf(propertyValue) !== -1) {
				this.searchTxt.splice(this.searchTxt.indexOf(propertyValue), 1);
			}
			if (this.searchProperty.indexOf(propertyName) !== -1) {
				this.searchProperty.splice(this.searchTxt.indexOf(propertyValue), 1);
			}
		}

		data.forEach(function(item) {
			if (item.rowID || item.shapeID.length > 0) {
				if (rowSelection) {
					deSelectedShapeIDs.push({rowId: item.rowID, Selected: false});
				} else {
					item.shapeID.forEach(function(sShapeID) {
						deSelectedShapeIDs.push({ShapeId: sShapeID, Selected: false});
					});
				}
				item.selected = false;
			}
		});
		if (deSelectedShapeIDs.length > 0) {
			this.oSelection.updateSelectedShapes(deSelectedShapeIDs, false, this.getId());
		}
	};

	/**
	 * look for all the objects which matches the search criteria.
	 * @param {string} propertyValue value to search with
	 * @param {string[]|string} aPropertyNames property names or name to search in (optional parameter)
	 * @returns {Object[]} list of search results
	 * @public
	 * @since 1.89
	 */
	 GanttChartWithTable.prototype.findAll = function (propertyValue, aPropertyNames) {
		var selectedData = [],
			oTableModelData = this.getTable().getBinding().getModel().oData,
			sFindByOperator = this.getFindByOperator(),
			oFormattedTextList = {},
			sPath = this.getTable().getBinding().sPath.split("/")[1],
			arrayNames = this.getTable().getBinding().mParameters ? this.getTable().getBinding().mParameters.arrayNames : null,
			aRowData = [],
			flatJsonData = [],
			newRowIdPath,
			rowIDPath = this.getTable().getRowSettingsTemplate().mBindingInfos.rowId.parts[0].path,
			shapeIDPath = this._getShapeIdPath(),
			uniqueRowIDList = {},
			isDataCollectedByFormtter = false;

		this.pathList = {};
		this.pathList[sPath] = {};
		this._iNodesLength = 0;

		/**
		 * Extract shapeId/Binding paths from the shapes plotted.
		 */
		this._getAllBindingPaths(this.pathList[sPath], this.getTable().getRowSettingsTemplate());
		/**
		 * Find all shapes formatters and remove duplicate formatters if any
		*/
		if (!this._aAllShapesFormatters) {
			this._aAllShapesFormatters = [];
			var oRowSettingsTemplate = this.getTable().getRowSettingsTemplate();
			this._getAllFormatters(oRowSettingsTemplate);
			this._aAllShapesFormatters.forEach(function(oFirst, iFirstIndex) {
				this._aAllShapesFormatters.forEach(function(oSecond, iSecondIndex){
					if (iFirstIndex !== iSecondIndex) {
						var oFirstParts = JSON.stringify(oFirst.parts);
						var oSecondParts = JSON.stringify(oSecond.parts);
						if (oFirst.formatter.name === oSecond.formatter.name && oFirstParts === oSecondParts) {
							this._aAllShapesFormatters.splice(iSecondIndex,1);
						}
					}
				}.bind(this));
			}.bind(this));
		}

		/**
		 * Clone row related data
		 */
		Object.keys(oTableModelData).filter(function(item) {
			if (item.startsWith(sPath)){
				return true;
			}
		}).forEach(function(item) {
			var oCloneData = Object.assign({}, oTableModelData[item]);

			this._iNodesLength++;

			if (arrayNames && arrayNames.length > 0) {
				// Support JSON Model
				arrayNames.forEach(function(arrayName){
					if (oCloneData[arrayName]) {
						flattenJson.call(this, oCloneData[arrayName],arrayName);
					}
				}.bind(this));
			} else if (Array.isArray(oCloneData)) {
				oCloneData.forEach(function(aData) {
					this._iNodesLength++;
					aData.ganttShapeRelated = [];
					aRowData.push(aData);
				}.bind(this));
			} else {
				oCloneData.ganttShapeRelated = [];
				aRowData.push(oCloneData);
			}
		}.bind(this));

		if (arrayNames && arrayNames.length > 0) {
			var shapeBindingPaths = this.pathList[sPath];
			Object.keys(shapeBindingPaths).forEach(function(path){
				flatJsonData.forEach(function(data) {
					if (data[path] && data[path].length > 0) {
						var rowId = data[rowIDPath];
						attachRowId(data[path],rowId, shapeBindingPaths[path]);
						aRowData = aRowData.concat(data[path]);
					}
				});
			});
			rowIDPath = newRowIdPath;

		} else {
			updateClonedODataByPathList(aRowData, this.pathList);
		}

		/**
		 * Update @Object oFormattedTextList using all collected formatters.
		 * Key is a string formed using the formatter and value is the table model data which helped to create the key.
		 */
		createOFormattedTextList.call(this, aRowData);
		/**
		 * Check if the search value is part of any of the oFormattedTextList object key.
		 * if found use the oFormattedTextList object value to get rowID and shapeID
		 */
		Object.keys(oFormattedTextList).forEach(function(sItem) {
			if (sItem.toLowerCase().includes(propertyValue.toString().toLowerCase())) {
				oFormattedTextList[sItem].forEach(function(oData){
					if (oData.findAndSelectData.rowID && oData.findAndSelectData.shapeID.length > 0) {
						var oFindAndSelectData = JSON.parse(JSON.stringify(oData.findAndSelectData));
						oFindAndSelectData.isExpandable = oData.isExpandable;
						oFindAndSelectData.isParent = oData.showParentRowOnExpand;
						selectedData.push(oFindAndSelectData);
						isDataCollectedByFormtter = true;
					}
				});
			}
		});

		/**
		 * If not able to find the required data using oFormattedTextList, go through each key of the table model data.
		 */
		if (selectedData.length === 0){
			getFindAndSelectData(this);
		}

		/**
		 * Due to multiple formatters, selectedData might contain duplicates.
		 * Removing duplicates if any.
		 */
		if (isDataCollectedByFormtter) {
			selectedData = selectedData.filter(function(oFindAndSelectData) {
				var previous;
				if (uniqueRowIDList.hasOwnProperty(oFindAndSelectData.shapeID[0])) {
					previous = uniqueRowIDList[oFindAndSelectData.shapeID[0]];
					previous.sMatchedValue = previous.sMatchedValue + ", " + oFindAndSelectData.sMatchedValue;
					return false;
				}
				uniqueRowIDList[oFindAndSelectData.shapeID[0]] = oFindAndSelectData;
				return true;
			});
		}
		return selectedData;

		function flattenJson (data, arrayName) {
			data.forEach(function(childData) {
				this._iNodesLength++;
				if (childData.hasOwnProperty(arrayName)) {
					flattenJson.call(this, childData[arrayName], arrayName);

				}
				flatJsonData.push(childData);
			}.bind(this));
		}

		function attachRowId (shapes, rowId, oShapeBindingPath) {
			shapes.forEach(function(aShape) {
				newRowIdPath = 'row_' + shapeIDPath;
				aShape[newRowIdPath] = rowId;
				aShape["shapeIDPath"] = aShape[oShapeBindingPath['shapeIDPath']];
				if (oShapeBindingPath.expandable) {
					aShape.isExpandable = oShapeBindingPath.expandable;
				}
				if (oShapeBindingPath.showParentRowOnExpand !== undefined && typeof oShapeBindingPath.showParentRowOnExpand === "boolean") {
					aShape.showParentRowOnExpand = oShapeBindingPath.showParentRowOnExpand;
				}
			});

		}

		/**
		 * Go through property names and look for the search value
		 * @param {object} obj tabel model data
		 * @param {string} sPropertyName property name which application passed to findAll method
		 * @returns {boolean} if the search value is part of table model data
		 */
		function isPropertyExist(obj, sPropertyName) {
			return obj[sPropertyName] !== undefined &&
			obj[sPropertyName] !== null &&
			obj[sPropertyName].toString().toLowerCase().indexOf(propertyValue.toString().toLowerCase()) !== -1;
		}

		/**
		 * Go through each model data and collect it's children if any into ganttShapeRelated array based on path list
		 * @param {object} item table model data
		 * @param {object} oPathList path list
		 * @param {string} sKey entity key
		 */
		function getShapeDataByPathList(item, oPathList, sKey) {
			var oCloneData = JSON.parse(JSON.stringify(oTableModelData[sKey]));
			oPathList.shapeIDPath.forEach(function(item) {
				if (oCloneData[item]) {
					oCloneData.shapeIDPath = oCloneData[item];
				}
			});
			if (oPathList.expandable) {
				oCloneData.isExpandable = oPathList.expandable;
			}
			if (oPathList.showParentRowOnExpand !== undefined && typeof oPathList.showParentRowOnExpand === "boolean") {
				oCloneData.showParentRowOnExpand = oPathList.showParentRowOnExpand;
			}
			if (!item.ganttShapeRelated) {
				item.ganttShapeRelated = [];
			}
			item.ganttShapeRelated.push(oCloneData);
		}

		/**
		 * Updates cloned OData using path list and form a data which contains how parent and child nodes are connected
		 * @param {array} aMainPathData All rows data
		 * @param {object} oPathList contains the information about how shapes are connected using entities
		 */
		function updateClonedODataByPathList(aMainPathData, oPathList) {
			aMainPathData.forEach(function(item) {
				var oTempPathList = JSON.parse(JSON.stringify(oPathList)),
					aPathListKeys = Object.keys(oTempPathList);
				if (!aPathListKeys.includes("expandable") && !aPathListKeys.includes("showParentRowOnExpand")) {
					item.showParentRowOnExpand = false;
				}
				while (oTempPathList && aPathListKeys.length > 0) {
					var isOtherValue = true,
						aNotRequiredFields = ["shapeIDPath", "showParentRowOnExpand", "expandable"];
					for (var i = 0; i < aPathListKeys.length; i++) {
						if (!aNotRequiredFields.includes(aPathListKeys[i])) {
							isOtherValue = false;

							if (item[oTempPathList[aPathListKeys[i]].shapeIDPath]) {
								item.shapeIDPath = item[oTempPathList[aPathListKeys[i]].shapeIDPath];
							}

							if (item[aPathListKeys[i]] && item[aPathListKeys[i]].__list) {
								item[aPathListKeys[i]].__list.forEach(getShapeDataByPathList.bind(null, item, oTempPathList[aPathListKeys[i]]));
							}

							oTempPathList = JSON.parse(JSON.stringify(oTempPathList[aPathListKeys[i]]));
							aPathListKeys = Object.keys(oTempPathList);
							i = -1;

							if (oTempPathList && Object.keys(oTempPathList).length > 0 && item.ganttShapeRelated && item.ganttShapeRelated.length > 0) {
								updateClonedODataByPathList(item.ganttShapeRelated, oTempPathList);
							}
						}
					}
					if (isOtherValue) {
						oTempPathList = {};
						aPathListKeys = Object.keys(oTempPathList);
					}
				}
			});
		}

		function propertyNamesAsArray(oItem, findAndSelectData){
			var isExist = false;
			findAndSelectData.sMatchedValue = "";
			findAndSelectData.oMatchedValue = {};
			if (sFindByOperator === library.simple.findByOperator.AND) {
				isExist = true;
				aPropertyNames.forEach(function(sPropertyName) {
					/**
					 * Check all property names exist in any of the oData objects
					 */
					if (!isExist) { return;}
					if (!isPropertyExist(oItem, sPropertyName)) {
						isExist = false;
					} else {
						findAndSelectData.sMatchedValue = findAndSelectData.sMatchedValue.concat(oItem[sPropertyName] + " ");
						findAndSelectData.oMatchedValue[sPropertyName] = oItem[sPropertyName];
					}
				});
			} else if (sFindByOperator === library.simple.findByOperator.OR) {
				aPropertyNames.forEach(function(sPropertyName) {
					/**
					 * Check atleast one property name exists in any of the oData objects
					 */
					if (isPropertyExist(oItem, sPropertyName)) {
						isExist = true;
						findAndSelectData.sMatchedValue = findAndSelectData.sMatchedValue.concat(oItem[sPropertyName] + " ");
						findAndSelectData.oMatchedValue[sPropertyName] = oItem[sPropertyName];
					}
				});
			}

			if (isExist){
				return oItem;
			}
		}

		function propertyNamesAsString(oItem, findAndSelectData){
			var isExist = false;
			findAndSelectData.sMatchedValue = "";
			findAndSelectData.oMatchedValue = {};
			/**
			 * Check atleast one property name exists in any of the oData objects
			 */
			if (isPropertyExist(oItem, aPropertyNames)) {
				isExist = true;
				findAndSelectData.sMatchedValue = findAndSelectData.sMatchedValue.concat(oItem[aPropertyNames] + " ");
				findAndSelectData.oMatchedValue[aPropertyNames] = oItem[aPropertyNames];
			}

			if (isExist){
				return oItem;
			}
		}

		function checkAllPropertyNames(aMainPathData, findAndSelectData, oGantt) {
			aMainPathData.forEach(function(oItem){
				updateFindAndSelectDataForAllPropertyNames(oItem, findAndSelectData, oGantt);
			});
			return findAndSelectData;
		}

		/**
		 * Update selected find and select data if search value is part any of the property names
		 * @param {object} oItem table model data
		 * @param {object} findAndSelectData contains rowID, shapeID and etc, which helps how to navigate between search results
		 * @returns {object} findAndSelectData
		 */
		function updateFindAndSelectDataForAllPropertyNames(oItem, findAndSelectData, oGantt) {
			if (oItem[rowIDPath]) {
				findAndSelectData.rowID = oItem[rowIDPath];
			}
			Object.keys(oItem).forEach(function(oSecond){
				if (oSecond === "ganttShapeRelated") {
					findAndSelectData = checkAllPropertyNames(oItem[oSecond], findAndSelectData, oGantt);
				} else if (isPropertyExist(oItem, oSecond)) {
					if ((oItem[shapeIDPath] || oItem.shapeIDPath) && !findAndSelectData.shapeID.includes(oItem[shapeIDPath] || oItem.shapeIDPath)) {
						findAndSelectData.shapeID.push(oItem[shapeIDPath] || oItem.shapeIDPath);
						findAndSelectData.startTime = oItem[oGantt._startTimePath];
						findAndSelectData.sMatchedValue = findAndSelectData.sMatchedValue.concat(oItem[oSecond] + " ");
						findAndSelectData.oMatchedValue[oSecond] = oItem[oSecond];
						var temp = JSON.parse(JSON.stringify(findAndSelectData));
						if (oItem.isExpandable) {
							temp.isExpandable = oItem.isExpandable;
						}
						if (oItem.showParentRowOnExpand !== undefined && typeof oItem.showParentRowOnExpand === "boolean") {
							temp.isParent = oItem.showParentRowOnExpand;
						}
						temp.shapeID = [oItem[shapeIDPath] || oItem.shapeIDPath];
						temp.sMatchedValue = oItem[oSecond];
						temp.data = oItem;
						selectedData.push(temp);
					}
				}
			});

			return findAndSelectData;
		}

		/**
		 * Update selected find and select data if search value is part of array of property names which passed by application
		 * @param {object} oItem table model data
		 * @param {object} findAndSelectData contains rowID, shapeID and etc, which helps how to navigate between search results
		 * @returns {object} findAndSelectData
		 */
		function updateFindAndSelectDataForArrayPropertyNames(oItem, findAndSelectData, oGantt) {
			if (oItem[rowIDPath]) {
				findAndSelectData.rowID = oItem[rowIDPath];
			}
			var oSelectedObj = propertyNamesAsArray(oItem, findAndSelectData);
			if (oSelectedObj && (oSelectedObj[shapeIDPath] || oSelectedObj.shapeIDPath) && !findAndSelectData.shapeID.includes(oSelectedObj[shapeIDPath] || oSelectedObj.shapeIDPath)) {
				findAndSelectData.shapeID.push(oSelectedObj[shapeIDPath] || oSelectedObj.shapeIDPath);
				findAndSelectData.startTime = oSelectedObj[oGantt._startTimePath];
				var temp = JSON.parse(JSON.stringify(findAndSelectData));
				if (oSelectedObj.isExpandable) {
					temp.isExpandable = oSelectedObj.isExpandable;
				}
				if (oSelectedObj.showParentRowOnExpand !== undefined && typeof oSelectedObj.showParentRowOnExpand === "boolean") {
					temp.isParent = oSelectedObj.showParentRowOnExpand;
				}
				temp.shapeID = [oSelectedObj[shapeIDPath] || oSelectedObj.shapeIDPath];
				temp.data = oSelectedObj;
				selectedData.push(temp);
			}
			if (oItem.ganttShapeRelated && oItem.ganttShapeRelated.length > 0) {
				oItem.ganttShapeRelated.forEach(function(oShapeData){
					findAndSelectData = updateFindAndSelectDataForArrayPropertyNames(oShapeData, findAndSelectData, oGantt);
				});
			}

			return findAndSelectData;
		}

		/**
		 * Update selected find and select data if search value is part of the property name which passed by application
		 * @param {object} oItem table model data
		 * @param {object} findAndSelectData contains rowID, shapeID and etc, which helps how to navigate between search results
		 * @returns {object} findAndSelectData
		 */
		function updateFindAndSelectDataForSinglePropertyNames(oItem, findAndSelectData, oGantt) {
			if (oItem[rowIDPath]) {
				findAndSelectData.rowID = oItem[rowIDPath];
			}
			var oSelectedObj = propertyNamesAsString(oItem, findAndSelectData);
			if (oSelectedObj && (oSelectedObj[shapeIDPath] || oSelectedObj.shapeIDPath) && !findAndSelectData.shapeID.includes(oSelectedObj[shapeIDPath] || oSelectedObj.shapeIDPath)) {
				findAndSelectData.shapeID.push(oSelectedObj[shapeIDPath] || oSelectedObj.shapeIDPath);
				findAndSelectData.startTime = oSelectedObj[oGantt._startTimePath];
				if (oSelectedObj.isExpandable) {
					findAndSelectData.isExpandable = oSelectedObj.isExpandable;
				}
				if (oSelectedObj.showParentRowOnExpand !== undefined && typeof oSelectedObj.showParentRowOnExpand === "boolean") {
					findAndSelectData.isParent = oSelectedObj.showParentRowOnExpand;
				}
				findAndSelectData.data = oSelectedObj;
				selectedData.push(findAndSelectData);
			}
			if (oItem.ganttShapeRelated && oItem.ganttShapeRelated.length > 0) {
				oItem.ganttShapeRelated.forEach(function(oShapeData){
					findAndSelectData = updateFindAndSelectDataForSinglePropertyNames(oShapeData, findAndSelectData, oGantt);
				});
			}

			return findAndSelectData;
		}

		function getFindAndSelectData(oGantt){
			aRowData.forEach(function(oItem){
				var findAndSelectData = {
					rowID: "",
					shapeID: [],
					sMatchedValue: "",
					startTime: null,
					isExpandable: false,
					oMatchedValue: {}
				};
				if (Array.isArray(aPropertyNames) && aPropertyNames.length > 0) {
					updateFindAndSelectDataForArrayPropertyNames(oItem, findAndSelectData, oGantt);
				} else if (typeof aPropertyNames === "string" && aPropertyNames !== "") {
					updateFindAndSelectDataForSinglePropertyNames(oItem, findAndSelectData, oGantt);
				} else {
					updateFindAndSelectDataForAllPropertyNames(oItem, findAndSelectData, oGantt);
				}
			});
		}

		/**
		 * Go through every updated row data and update findAndSelectData with formatter list if exists.
		 * @param {array} aRowOData All rows data
		 */
		function createOFormattedTextList(aRowOData) {
			aRowOData.forEach(function(oRowData){
				var oCloneRowData = JSON.parse(JSON.stringify(oRowData)),
					findAndSelectData = {
					rowID: "",
					shapeID: [],
					sMatchedValue: "",
					startTime: null,
					isExpandable: false,
					data: oRowData
				};
				if (oCloneRowData[rowIDPath]) {
					findAndSelectData.rowID = oCloneRowData[rowIDPath];
				}

				if (oCloneRowData[this._startTimePath]) {
					findAndSelectData.startTime = oCloneRowData[this._startTimePath];
				}

				if (oCloneRowData.shapeIDPath) {
					findAndSelectData.shapeID.push(oCloneRowData.shapeIDPath);
				}
				this._aAllShapesFormatters.forEach(function(oItem) {
					var isAllExist = true,
						aFormatParts = [];

					oItem.parts.forEach(function(item) {
						var sPath = item.path.split("/")[0];
						if (aPropertyNames &&  aPropertyNames.length > 0 && aPropertyNames.indexOf(sPath) === -1) {
							isAllExist = false;
						} else if (item.model !== "i18n" && !oCloneRowData[sPath]) {
							isAllExist = false;
						} else if (item.model === "i18n"){
							aFormatParts.push(this.getModel("i18n").getResourceBundle().getText(sPath));
						} else {
							var date = new Date(oCloneRowData[sPath]);
							if (date.toString() !== "Invalid Date" && date.toISOString() === oCloneRowData[sPath]) {
								oCloneRowData[sPath] = date;
								aFormatParts.push(oCloneRowData[sPath]);
							} else {
								aFormatParts.push(oCloneRowData[sPath]);
							}
						}
					}.bind(this));

					if (isAllExist) {
						var formattedString = oItem.formatter.apply(null, aFormatParts);
						if (formattedString !== undefined) {
							if (!oFormattedTextList[formattedString.toString()]) {
								oFormattedTextList[formattedString.toString()] = [];
							}
							findAndSelectData.sMatchedValue = findAndSelectData.sMatchedValue.concat(formattedString.toString() + " ");
							oCloneRowData.findAndSelectData = findAndSelectData;
							oFormattedTextList[formattedString.toString()].push(oCloneRowData);
						}
					}
				}.bind(this));
				if (oCloneRowData.ganttShapeRelated && oCloneRowData.ganttShapeRelated.length > 0) {
					createOFormattedTextList.call(this, oCloneRowData.ganttShapeRelated, findAndSelectData);
				}
			}.bind(this));
		}
	};

	GanttChartWithTable.prototype._getAllBindingPaths = function(oPathList, oTemplate, isExpandable) {
		var oBindingInfo = oTemplate.mBindingInfos,
		oAggregationList = oTemplate.mAggregations;

		if (oBindingInfo) {
			for (var sBindingKey in oBindingInfo) {
				if ((sBindingKey.toLowerCase().indexOf("calendars") === -1) && sBindingKey.toLowerCase() !== "relationships") {
					var oTemplateObj = oBindingInfo[sBindingKey];
					if (sBindingKey === "shapeId") {
						if (oPathList.shapeIDPath) {
							if (!oPathList.shapeIDPath.includes(oTemplateObj.parts[0].path)) {
								oPathList.shapeIDPath.push(oTemplateObj.parts[0].path);
							}
						} else {
							oPathList.shapeIDPath = [oTemplateObj.parts[0].path];
						}
					}

					if (oTemplateObj.path) {
						var shapeIDPath = oTemplateObj.template.mBindingInfos.shapeId && oTemplateObj.template.mBindingInfos.shapeId.parts[0].path;
						if (!oPathList[oTemplateObj.path]) {
							oPathList[oTemplateObj.path] = {
								shapeIDPath : []
							};
						}
						if (shapeIDPath && !oPathList[oTemplateObj.path].shapeIDPath.includes(shapeIDPath)) {
							oPathList[oTemplateObj.path].shapeIDPath.push(shapeIDPath);
						}
						if (oTemplateObj.template && oTemplateObj.template.getExpandable && oTemplateObj.template.getExpandable()) {
							oPathList[oTemplateObj.path].expandable = oTemplateObj.template && oTemplateObj.template.getExpandable();
						}
						if (isExpandable) {
							oPathList[oTemplateObj.path].expandable = isExpandable;
						} else {
							oPathList[oTemplateObj.path].showParentRowOnExpand = this.getShowParentRowOnExpand();
						}
						this._getAllBindingPaths(oPathList[oTemplateObj.path], oTemplateObj.template, oTemplateObj.template.getExpandable && oTemplateObj.template.getExpandable());
					}
				}
			}
		}

		if (oAggregationList) {
			var getAllBindingPathsCBHandler = function(oItem){
				if (!oItem.isA || (oItem.isA("sap.gantt.simple.BaseShape") && !oItem.isA("sap.gantt.simple.UtilizationChart"))) {
					this._getAllBindingPaths(oPathList, oItem);
				}
			};
			for (var sAggregationName in oAggregationList) {
				var oAggregation = oAggregationList[sAggregationName];
				if (Array.isArray(oAggregation)) {
					oAggregation.forEach(getAllBindingPathsCBHandler.bind(this));
				} else if (oAggregation && oAggregation.isA && oAggregation.isA("sap.gantt.simple.BaseShape") && !oAggregation.isA("sap.gantt.simple.UtilizationChart")) {
					this._getAllBindingPaths(oPathList, oAggregation);
				}
			}
		}

		if (!oAggregationList && !oBindingInfo) {
			return false;
		}

		return true;
	};

	/**
	 * Checks whether the gantt chart has time continuous shapes i.e, stock chart, utilization chart shapes
	 * @param {Object} oTemplate is reference to the {@link sap.ui.table.RowSettings}
	 * @private
	 */
	GanttChartWithTable.prototype._hasTimeContinuousShapes = function(oTemplate) {
		var oBindingInfo = oTemplate.mBindingInfos,
		oAggregationList = oTemplate.mAggregations;

		if (oBindingInfo) {
			for (var sBindingKey in oBindingInfo) {
				if ((sBindingKey.toLowerCase().indexOf("calendars") === -1) && sBindingKey.toLowerCase() !== "relationships") {
					var oTemplateObj = oBindingInfo[sBindingKey], oShapeTemplate = oTemplateObj.template;
					if (oShapeTemplate) {
						if (oShapeTemplate.isA && oShapeTemplate.isA("sap.gantt.simple.BaseShape") && oShapeTemplate.isA("sap.gantt.simple.UtilizationChart")) {
							this._bTimeContinuousShapes = true;
							return;
					}
						if (!this._bTimeContinuousShapes) {
							this._hasTimeContinuousShapes(oShapeTemplate);
						}
					}
				}
			}
		}

		if (oAggregationList) {
			var hasTimeContinuousShapesHandler = function(oItem){
				if (oItem.isA && oItem.isA("sap.gantt.simple.BaseShape") && oItem.isA("sap.gantt.simple.UtilizationChart")) {
					this._bTimeContinuousShapes = true;
					return;
				}
				if (!this._bTimeContinuousShapes) {
					this._hasTimeContinuousShapes(oItem);
				}
			};
			for (var sAggregationName in oAggregationList) {
				var oAggregation = oAggregationList[sAggregationName];
				if (Array.isArray(oAggregation)) {
					oAggregation.forEach(hasTimeContinuousShapesHandler.bind(this));
				} else if (oAggregation && oAggregation.isA && oAggregation.isA("sap.gantt.simple.BaseShape") && oAggregation.isA("sap.gantt.simple.UtilizationChart")) {
					this._bTimeContinuousShapes = true;
					return;
				} else if (!this._bTimeContinuousShapes && oAggregation && oAggregation.isA && oAggregation.isA("sap.gantt.simple.BaseShape") && !oAggregation.isA("sap.gantt.simple.UtilizationChart")) {
					this._hasTimeContinuousShapes(oAggregation);
				}
			}
		}
	};

	/**
	 * Looks for row and shape IDs and returns an object
	 * @param {Object} oTemplate is reference to the {@link sap.ui.table.RowSettings}
	 * @returns {Boolean} true of false
	 * @private
	 * @since 1.100
	 */
	GanttChartWithTable.prototype._getAllFormatters = function(oTemplate) {
		var oBindingInfo = oTemplate.mBindingInfos,
			oAggregationList = oTemplate.mAggregations;

		if (oBindingInfo) {
			for (var sBindingKey in oBindingInfo) {
				if ((sBindingKey.toLowerCase().indexOf("calendars") === -1) && sBindingKey.toLowerCase() !== "relationships") {
					var oTemplateObj = oBindingInfo[sBindingKey];
					if (sBindingKey === "time") {
						this._startTimePath = oTemplateObj.parts[0].path;
					}
					if (oTemplateObj.template) {
						this._getAllFormatters(oTemplateObj.template);
					} else {
						var isCheckEmpty = this._getAllFormatters(oTemplateObj);
						if (!isCheckEmpty && oTemplateObj.formatter) {
							this._aAllShapesFormatters.push({
								"formatter": oTemplateObj.formatter,
								"parts": oTemplateObj.parts
							});
						}
					}
				}
			}
		}

		if (oAggregationList) {
			for (var sAggregationName in oAggregationList) {
				var oAggregation = oAggregationList[sAggregationName];
				if (Array.isArray(oAggregation)) {
					oAggregation.forEach(function(oItem){
						this._getAllFormatters(oItem);
					}.bind(this));
				} else if (oAggregation && oAggregation.isA && oAggregation.isA("sap.gantt.simple.BaseShape")) {
					this._getAllFormatters(oAggregation);
				}
			}
		}

		if (!oAggregationList && !oBindingInfo) {
			return false;
		}

		return true;
	};

	/**
	 * Deselects a group of shapes specified by the <code>aShapeUids</code> array.
	 *
	 * @param {Array.<string>} aShapeUids An array of shape UIDs to deselect.
	 * @returns {this} a reference to the {@link sap.gantt.simple.GanttChartWithTable} control, can be used for chaining.
	 * @public
	 * @since 1.75
	 */
	GanttChartWithTable.prototype.deselectShapes = function (aShapeUids) {
		if (!this.oSelection || !aShapeUids || aShapeUids.length === 0) {
			return this;
		}

		this._updateShapes(aShapeUids, false);
		return this;
	};

	GanttChartWithTable.prototype._updateShapes = function (aShapeUids, bSelect) {
		var mShapesToUpdate = {};
		var aShapes = GanttUtils.getShapesWithUid(this.getId(), aShapeUids);
		for (var i = 0; i < aShapeUids.length; i++) {
			mShapesToUpdate[aShapeUids[i]] = {
				selected: bSelect,
				ctrl: false // since there is no user interaction
			};
			if (aShapes[i]) {
				mShapesToUpdate.draggable = aShapes[i].getDraggable();
				mShapesToUpdate.time = aShapes[i].getTime();
				mShapesToUpdate.endTime = aShapes[i].getEndTime();
			}
		}
		this.oSelection.updateShapes(mShapesToUpdate);
	};

	GanttChartWithTable.prototype._onSelectionChanged = function (oEvent) {
		var aShapeUid = oEvent.getParameter("shapeUid"),
			aDeselectedUid = oEvent.getParameter("deselectedUid"),
			bSilent = oEvent.getParameter("silent"),
			aDeSelectAll = oEvent.getParameter("deSelectAll");

		this._updateShapeSelections(aShapeUid, aDeselectedUid, aDeSelectAll);

		if ((!bSilent || this._bDeselectShapes) && !this._bSupressShapeChangeEvent) {
			this.fireShapeSelectionChange({
				shapeUids: aShapeUid
			});
		}
	};

	/**
	 * fireShapeHighlightChange event is fired if there is change in highlighted shape.
	 *
	 * @param {Event} oEvent fired on the highlighted shape by navigation
	 * @public
	 * @since 1.100
	 */
	GanttChartWithTable.prototype._onHighlightChanged = function (oEvent) {
		var aShapeUid = oEvent.getParameter("shapeUid"),
			deEmphasizedUid = oEvent.getParameter("deEmphasizedUid"),
			bSilent = oEvent.getParameter("silent"),
			deEmphasizeAll = oEvent.getParameter("deEmphasizeAll");

		this.updateShapeHighlights(aShapeUid, deEmphasizedUid, deEmphasizeAll);

		if ((!bSilent || this._bDeselectShapes) && !this._bSupressShapeChangeEvent) {
			this.fireShapeHighlightChange({
				shapeUids: aShapeUid
			});
		}
	};

	/**
	 * Setting start and end time for selected BaseGroup shape.
	 * @param {object} mParam shape selected parameters
	 * @private
	 * Return selected shape object with updated start and end time.
	 */
	 GanttChartWithTable.prototype.setTimeForGroupShape = function(oShape) {
		var sStartDate, sEndDate;
		function getTimeFromChildShape(oChildShape) {
			if (!sStartDate && !sEndDate) {
				sStartDate = oChildShape.getTime();
				sEndDate = oChildShape.getEndTime();
			} else {
				if (oChildShape.getTime() < sStartDate) {
					sStartDate = oChildShape.getTime();
				}
				if (oChildShape.getEndTime() >= sEndDate) {
					sEndDate = oChildShape.getEndTime();
				}
			}
		}
		//case for base conditional shapes and base groups
		if (oShape instanceof sap.gantt.simple.BaseConditionalShape) {
			var oActiveShape = oShape._getActiveShapeElement();
			//when oShape is BaseConditional and shapes aggregation has baseGroup
			if (oActiveShape instanceof sap.gantt.simple.BaseGroup) {
				oActiveShape.getShapes().forEach(function (oChildShape) {
					getTimeFromChildShape(oChildShape);
				});
				oShape.setTime(sStartDate);
				oShape.setEndTime(sEndDate);
			} else if (oActiveShape) {
				//when oShape is BaseConditional and shapes aggregation has simple baseShape
				sStartDate = oActiveShape.getTime();
				sEndDate = oActiveShape.getEndTime();
				oShape.setTime(sStartDate);
				oShape.setEndTime(sEndDate);
			}
		} else if (oShape instanceof sap.gantt.simple.BaseGroup && !(oShape.getTime() && oShape.getEndTime())) {
			//When oShape is BaseGroup
			oShape.getShapes().forEach(function (oChildShape) {
				getTimeFromChildShape(oChildShape);
			});
			oShape.setTime(sStartDate);
			oShape.setEndTime(sEndDate);
		}
		return oShape;
	};


	/**
	 * Update the shape selection `metadata` into the SelectionModel.
	 *
	 * @param {object} mParam shape selected parameters
	 * @private
	 */
	GanttChartWithTable.prototype.handleShapePress = function(mParam) {
		var oShape = mParam.shape,
			sShapeUid = oShape.getShapeUid(),
			bCtrl = mParam.ctrlOrMeta,
			oDragDropExtension = this._getDragDropExtension();

		var bNewSelected = !oShape.getSelected();
		if (oDragDropExtension.shapeSelectedOnMouseDown && !oDragDropExtension.initiallySelected && !this.getEnableSelectAndDrag()){
            bNewSelected = oDragDropExtension.shapeSelectedOnMouseDown;
        }

		this.setTimeForGroupShape(oShape);
		var sShapeSelectionMode = this.getShapeSelectionMode();
		if ((sShapeSelectionMode !== library.SelectionMode.Multiple) && (sShapeSelectionMode !== library.SelectionMode.MultipleWithLasso) && !bCtrl) {
			this.oSelection.clearAllSelectedShapeIds();
			this.searchTxt = [];
			this.searchProperty = [];
		} else {
			var oShapeIDs = GanttUtils.getShapeIdFromShapeUid([sShapeUid]);
			if (oShapeIDs && oShapeIDs.length > 0) {
				oShapeIDs.forEach(function(aShapeID) {
					this.getSelection().clearDeselectionModelById(aShapeID);
				}.bind(this));
			}
		}
		this.oSelection.updateShape(sShapeUid, {
			selected: bNewSelected,
			ctrl: bCtrl,
			draggable: oShape.getDraggable(),
			time: oShape.getTime(),
			endTime: oShape.getEndTime()
		});
		oDragDropExtension.shapeSelectedOnMouseDown = false;
	};

	/**
	 * Allows to resize a shape without explicitly selecting the shape.
	 *
	 * @param {object} mParam shape selected parameters
	 * @private
	 */
	GanttChartWithTable.prototype.handleShapeMouseEnter = function(mParam) {
		if (!this.getEnableSelectAndDrag()) {
			var oShape = mParam.shape,

			// Handle resize cursor
			oResizeExtension = this._getResizeExtension();
			if (!oShape.getSelected()){
				oResizeExtension.addResizerOnMouseOver(oShape);
			}

			// Handle drag cursor
			var oDragDropExtension = this._getDragDropExtension();
			if (oShape.getDraggable()) {
				oDragDropExtension.updateCursorStyle("move");
			}
		}
	};

	/**
	 * Handler for mouse leave of shapes.
	 *
	 * @param {object} mParam shape selected parameters
	 * @private
	 */
	GanttChartWithTable.prototype.handleShapeMouseLeave = function(mParam) {
		if (!this.getEnableSelectAndDrag()) {
			// Handle drag cursor
			var oDragDropExtension = this._getDragDropExtension();
			oDragDropExtension.updateCursorStyle("default");
		}
	};

	GanttChartWithTable.prototype._updateShapeSelections = function(aShapeUid, aDeselectedUid, deSelectAll) {
		var oSelMode = this.getShapeSelectionMode();
		if (oSelMode === library.SelectionMode.None) {
			// there is no selection which needs to be updated. With the switch of the
			// selection mode the selection was cleared (and updated within that step)
			return;
		}
		if (this.oSelection.getSelectedShapeIDS().length > 0 ||
			this.oSelection.getSelectedRowIDS().length > 0	||
			this.oSelection.getDeSelectedShapeIDS().length > 0 ||
			this.oSelection.getDeSelectedRowIDS().length > 0) {
			RenderUtils.updateShapeSelectionByShapeID(this, deSelectAll);
		}
		RenderUtils.updateShapeSelections(this, this.getSelection().allUid(), aDeselectedUid);
	};

	/**
	 * De-Emphasize shapes based on the de-emphasized shape Uid
	 *
	 * @param {String} deEmphasizedUid Shape Uid of the shape to be de-emphasized.
	 * @param {Boolean} deEmphasizeAll flag to de-emphasize all highlighted shapes.
	 * @public
	 * @since 1.100
	 */
	GanttChartWithTable.prototype.updateShapeHighlights = function(deEmphasizedUid, deEmphasizeAll) {
		if (this.oHighlight.getHighlightedShapeID().length > 0 ||
			this.oHighlight.getDeEmphasizedShapeID().length > 0) {
			RenderUtils.updateShapeHighlightByShapeID(this, deEmphasizeAll);
		}
		RenderUtils.updateShapeHighlights(this, this.getHighlight().allUid(), deEmphasizedUid);
	};

	/**
	 * Adds vertical scrollbar container to the gantt charts having no vertical scrollbar, if any gantt chart in the container has a vertical scrollbar
	 *
	 * @private
	 */
	GanttChartWithTable.prototype._updateVsbContainers = function() {
		if (this.getParent().isA("sap.gantt.simple.GanttChartContainer") && this.getParent().getGanttCharts().length > 1) {
			var oGanttCharts = this.getParent().getGanttCharts();
			var bVsbContainer = false;
			var i, oGantt, oVScrollBar;
			for (i = 0; i < oGanttCharts.length; i++) {
				oGantt = oGanttCharts[i];
				oVScrollBar = oGantt.getTable()._getScrollExtension().getVerticalScrollbar();
				if (oVScrollBar && !oVScrollBar.parentElement.classList.contains("sapUiTableHidden")) {
					bVsbContainer = true;
					break;
				}
			}

			if (bVsbContainer) {
				for (i = 0; i < oGanttCharts.length; i++) {
					oGantt = oGanttCharts[i];
					oVScrollBar = oGantt.getTable()._getScrollExtension().getVerticalScrollbar();
					if (oVScrollBar) {
						var aVSBParentClassList = oVScrollBar.parentElement.classList,
						aVSBClassList = oVScrollBar.classList;
						if (aVSBParentClassList.contains("sapUiTableHidden")) {
							aVSBParentClassList.add("sapGanttTableVerticalScrollBarContainer");
							aVSBClassList.add("sapGanttTableVerticalScrollBar");
						} else {
							aVSBParentClassList.remove("sapGanttTableVerticalScrollBarContainer");
							aVSBClassList.remove("sapGanttTableVerticalScrollBar");
						}
					}
				}
			} else {
				for (i = 0; i < oGanttCharts.length; i++) {
					oGantt = oGanttCharts[i];
					oVScrollBar = oGantt.getTable()._getScrollExtension().getVerticalScrollbar();
					var aVSBParentClassList = oVScrollBar.parentElement.classList,
					aVSBClassList = oVScrollBar.classList;
					if (oVScrollBar) {
						aVSBParentClassList.remove("sapGanttTableVerticalScrollBarContainer");
						aVSBClassList.remove("sapGanttTableVerticalScrollBar");
					}
				}
			}
		}
	};

	/**
	 * Return the shape selection model.
	 *
	 * @private
	 * @returns {sap.gantt.simple.SelectionModel} the selection model
	 */
	GanttChartWithTable.prototype.getSelection = function() {
		return this.oSelection;
	};

	GanttChartWithTable.prototype.getHighlight = function() {
		return this.oHighlight;
	};

	GanttChartWithTable.prototype.getExpandedBackgroundData = function () {
		if (this._oExpandModel.hasExpandedRows()) {
			var aRows = this.getTable().getRows();
			var iRowCount = aRows.length;

			var iFirstVisibleRow = this.getTable().getFirstVisibleRow();
			var aRowUid = [];

			for (var i = 0; i < iRowCount; i++){
				if (aRows[i].getIndex() >= iFirstVisibleRow){
					var oRowSettings = aRows[i].getAggregation("_settings");
					aRowUid.push(oRowSettings.getRowUid());
				}
			}
			return this._oExpandModel.collectExpandedBgData(aRowUid, this.getExpandedRowHeight(), (this.getShowParentRowOnExpand() && !this.getUseParentShapeOnExpand()));
		}
	};

	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	GanttChartWithTable.prototype.setAxisTimeStrategy = function (oAxisTimeStrategy) {
		oAxisTimeStrategy.attachEvent("_redrawRequest", this._onRedrawRequest, this);
		delete this._bPreventInitialRender; // we will need to jump to visible horizon
		return this.setAggregation("axisTimeStrategy", oAxisTimeStrategy, false);
	};

	/**
	 * Checks Variant management, RTA enable properties and application preventing to execute event then Creates personalization changes,
	 * adds them to the flex persistence (not yet saved) and applies them to the control.
	 *
	 * @param {object} oEvent Event object
	 * @param {sap.ui.fl.write.api.ControlPersonalizationWriteAPI.PersonalizationChange[]} aChanges - Array of control changes of type {@link sap.ui.fl.write.api.ControlPersonalizationWriteAPI.PersonalizationChange}
	 * @since 1.91
	 * @private
	 */
	GanttChartWithTable.prototype._addChangesToControlPersonalizationWriteAPI = function(oEvent, aChanges) {
		var oParent = this.getParent();
		var isGanttChartContainer = oParent.isA("sap.gantt.simple.GanttChartContainer");
		var isVariantEnabled = (isGanttChartContainer && oParent.getEnableVariantManagement()) || this.getProperty("_isAppRunningInRTA");
		if (this.getEnablePseudoShapes()){
			this._tableDataUpdated = true;
		}
		if (!oEvent.bPreventDefault && isVariantEnabled) {
			ControlPersonalizationWriteAPI.add({
				changes: aChanges
			});
		}
	};

	GanttChartWithTable.prototype._onTableFilter = function (oEvent) {
		var aChanges = [{
			"selectorElement": oEvent.mParameters.column,
			"changeSpecificData": {
				"changeType": "TableColumnFilterValue",
				"content": {
					propertyName: "filterValue",
					newValue: oEvent.mParameters.value,
					oldValue: ""
				}
			}
		}];
		//once changes are complete, write them
		this._addChangesToControlPersonalizationWriteAPI(oEvent, aChanges);
	};
	GanttChartWithTable.prototype._onTableSorter = function (oEvent) {
		var oSortedColumn = oEvent.getParameter("column");
		var oParentTable = oSortedColumn.getParent();
		var aDependentControls = [];
		oParentTable.getColumns().forEach(function(oColumn) {
			if (oColumn !== oSortedColumn) {
				aDependentControls.push(oColumn.getId());
			}
		});
		var aChanges = [{
			"selectorElement": oSortedColumn,
			"changeSpecificData": {
				"changeType": "TableColumnSortOrder",
				"content": {
					propertyName: "sortOrder",
					newValue: oEvent.getParameter("sortOrder"),
					oldValue: oSortedColumn.getSortOrder(),
					affectedControls: aDependentControls
				}
			}
		}];
		//once changes are complete, write them
		this._addChangesToControlPersonalizationWriteAPI(oEvent, aChanges);
	};

	GanttChartWithTable.prototype._onColumnVisible = function (oEvent) {
		var visible = oEvent.mParameters.newVisible;
		var aChanges = [{
			"selectorElement": oEvent.mParameters.column,
			"changeSpecificData": {
				"changeType": "TableColumnVisibility",
				"content": {
					propertyName: "visible",
					newValue: visible,
					oldValue: !visible
				}
			}
		}];
		//once changes are complete, write them
		this._addChangesToControlPersonalizationWriteAPI(oEvent, aChanges);
	};
	GanttChartWithTable.prototype._onTableColumnMove = function (oEvent) {

		var aOldListOfColumnIds = oEvent.getSource().getAggregation('columns').map(function(x){
			return x.getId();
		});
		var iOldIdx = oEvent.getParameter('column').getIndex();
		var iNewIdx = oEvent.getParameter('newPos');
		var aTempOldArr = Array.from(new Set(aOldListOfColumnIds));
		var aNewArr = GanttUtils.arrayMove(aTempOldArr, iOldIdx, iNewIdx);
		var aUpdatedListOfColumnIds = [];
		aNewArr.forEach(function(id, idx){
			var oTempColumn = oEvent.getSource().getAggregation('columns').find(function(y){
				return y.getId() === id;
			});
			aUpdatedListOfColumnIds.push(oTempColumn.getId());
		});

		var aChanges = [];
		aChanges.push({
			"selectorElement": this.getTable(),
			"changeSpecificData": {
				"changeType": "GanttTableColumnOrder",
				"content": {
					"aggregationName": "columns",
					"newValue":  aUpdatedListOfColumnIds,
					"oldValue": aOldListOfColumnIds
				}
			}
		});

		//once changes are complete, write them
		this._addChangesToControlPersonalizationWriteAPI(oEvent, aChanges);
	};

	GanttChartWithTable.prototype._onTableSettingsChanged = function (oEvent) {
		this._bRowActionInitialRender = false;
		if (this.getEnablePseudoShapes()){
			this._tableDataUpdated = true;
		}
	};

	GanttChartWithTable.prototype._onTableRowsUpdated = function (oEvent) {
		performance.mark("GanttChartWithTable._onTableRowsUpdated--start");
		if (!this.getVisible()) {
			performance.mark("GanttChartWithTable._onTableRowsUpdated--end");
			return;
		}

		var sReason = oEvent.getParameter("reason"),
			oInnerGantt = this.getInnerGantt(),
			oTable = oEvent.getSource();

		this._invalidateRowActionTemplate(oTable, sReason);

		// Each UI interaction shall only render once
		if (this.getEnablePseudoShapes() && this.pseudoShapeSpecificData && ((this.pseudoShapeSpecificData.oDraggedShapeDates && this.pseudoShapeSpecificData.draggedShapeTRowIndex != null) || (this.pseudoShapeSpecificData.resizedShape && this.pseudoShapeSpecificData.resizedShapeRowIndex != null))){
			var oDraggedShapeDates = this.pseudoShapeSpecificData.oDraggedShapeDates,
			aRows = this.getTable().getRows(), aTRowIndexArr;
			if (this.pseudoShapeSpecificData.draggedShapeTRowIndex != undefined){
				aTRowIndexArr = [];
				Object.keys(oDraggedShapeDates).forEach(function (sShapeUid) {
					var oShape = GanttUtils.getShapesWithUid(this.getId(), [sShapeUid])[0];
						var iTargetRowIndex = oShape ? GanttUtils.getRowInstancefromShape(oShape).getIndex() : this.pseudoShapeSpecificData.draggedShapeTRowIndex;
						if (aTRowIndexArr.indexOf(iTargetRowIndex) == -1){
							aTRowIndexArr.push(iTargetRowIndex);
						}
						var pseudostartTime, pseudoEndTime;
						aRows[iTargetRowIndex] && aRows[iTargetRowIndex].getAggregation("_settings").getTasks && aRows[iTargetRowIndex].getAggregation("_settings").getTasks().forEach(function(obj){
							if (oShape && obj.aShapeIds && obj.aShapeIds.length > 1 && obj.aShapeIds.indexOf(this.oOverlapShapeIds && this.oOverlapShapeIds[iTargetRowIndex] && this.oOverlapShapeIds[iTargetRowIndex][0]) > -1 ){
								pseudostartTime = obj.getTask().getTime();
								pseudoEndTime = obj.getTask().getEndTime();
								if ((pseudostartTime > oShape.getTime() && oShape.getEndTime() > pseudostartTime) ||
								(pseudoEndTime > oShape.getTime() && oShape.getEndTime() > pseudoEndTime) ||
								(pseudostartTime > oShape.getTime() && pseudoEndTime < oShape.getEndTime()) ||
								(oShape.getTime() > pseudostartTime  && oShape.getEndTime() < pseudoEndTime)){
									this.oOverlapShapeIds && this.oOverlapShapeIds[iTargetRowIndex].push(oShape.getShapeId());
								}
							}
						}.bind(this));
				}.bind(this));
			}
			aTRowIndexArr = aTRowIndexArr ? aTRowIndexArr : [this.pseudoShapeSpecificData.resizedShapeRowIndex];
			aTRowIndexArr.forEach(function(index){
				index = Number(index);
				var firstRowIndex = aRows[0].getIndex();
				var aShapeGroups = GanttUtils.pseudoShapeGroupAfterEdit(this, index);
				var needForCollapseRow = true;
				if (aShapeGroups){
					for (var i = 0; i < aShapeGroups.length; i++){
						if (aShapeGroups[i].iShapeCount > 1){
							needForCollapseRow = false;
						}
					}
				}
				var isRowPseudoExpanded = this._oExpandModel.mExpanded[aRows[index - firstRowIndex].getAggregation("_settings").getRowUid()];
				this._bUpdateTriggeredDueToExpandCollapse = true;

				if (this._aExpandedIndices.indexOf(index) > -1 && needForCollapseRow && isRowPseudoExpanded && isRowPseudoExpanded[1] && isRowPseudoExpanded[1].expandSchemeShape){
					this._collapse(null, index, true);
				}
			}.bind(this));
			this.pseudoShapeSpecificData.oDraggedShapeDates = null; this.pseudoShapeSpecificData.draggedShapeTRowIndex = null;
			this.pseudoShapeSpecificData.resizedShape = null; this.pseudoShapeSpecificData.resizedShapeRowIndex = null;
		}
		if (!this.pseudoShapeSpecificData){
			this.pseudoShapeSpecificData = {};
		}
		if (this.getEnablePseudoShapes()){
			this.pseudoShapeSpecificData.isPseudoShapesEnabled = true;
			if (!this._bUpdateTriggeredDueToExpandCollapse || this._tableDataUpdated) {
				if (this._bUpdateTriggeredDueToExpandCollapse){
					this._bUpdateTriggeredDueToExpandCollapse = false;
				}
				this._addBackTasksToRows();
				this._tableDataUpdated = false;
			} else {
				this._bUpdateTriggeredDueToExpandCollapse = false;
			}
		} else if (this.pseudoShapeSpecificData.isPseudoShapesEnabled || this.bModifiedAggrTasks){
			this.pseudoShapeSpecificData.isPseudoShapesEnabled = false;
			this._addBackTasksToRows();
		}

		var bIsValidReason = aInvalidateReasons.indexOf(sReason) !== -1;

		if ((!bIsValidReason && sReason !== "VerticalScroll") || this._createInnerGanttRenderPromise()) {
			this.getInnerGantt().invalidate();
		}

		if (bIsValidReason) {
			// do not scrolling while invalidating control
			this.getSyncedControl().setAllowContentScroll(false);
			this._oInnerGanttRenderPromiseResolve();
		} else if (sReason === "VerticalScroll") {
			var oDragExtension = this._getDragDropExtension();
			if (oDragExtension._bEnableRowHighlight && oDragExtension.isDragging()) {
				oDragExtension.getShapeDndRowHighlightIndex(this);
				this.toggleDnDRowHighlight(true);
			}
			this._oInnerGanttRenderPromiseResolve();
		} else {
			oInnerGantt.getRenderer().renderImmediately(this);
		}

		performance.mark("GanttChartWithTable._onTableRowsUpdated--end");
	};
	/**
	 * @private
	 */
	GanttChartWithTable.prototype._getPossibleShapesInGantt = function() {
		return Object.keys(this.getTable().getRowSettingsTemplate().getMetadata().getAllAggregations()).filter(function(aggr){
			return ['tooltip', 'customData', 'layoutData', 'dependents', 'dragDropConfig', 'relationships', 'pseudoShapeTemplate'].indexOf(aggr) == -1 &&
			aggr.indexOf("overlay") == -1 && aggr.indexOf("calendars") == -1;
		});
	};
	/**
	 * @param {object} oParams , information about index and expand state
	 * @private
	 */
	GanttChartWithTable.prototype._addBackTasksToRows = function(oParams) {
		//Get Binding information
		var oTable = this.getTable();
		var oRowBindingInfo = oTable.getBindingInfo("rows");
		var sModelName = oRowBindingInfo && oRowBindingInfo.model;
		var oModel = oTable.getModel(sModelName);
		var oRowSettingsTemplate = oTable.getRowSettingsTemplate();
		var aPossibleShapes = this._getPossibleShapesInGantt();
		var aBindingInfos = [], bIsValid = false;
		aPossibleShapes.forEach(function(shape){
			var oBindingInfo = oRowSettingsTemplate.getBindingInfo(shape);
			aBindingInfos.push(oBindingInfo);
			if (oBindingInfo){
				bIsValid = true;
			}
		});
		// Getting the task binding info because we get the template to clone and the path to fetch data from here
		// Get visible rows
		var aRows = oTable.getRows();
		var oBasePseudoShape =  new BasePseudoShape();
		if (bIsValid) {
			var getContextArray = function(oRowBindingContext){
				//Get the list of shape's context paths
				var aContext = [], oContext, aContextPaths = [];
				aBindingInfos.forEach(function(oBindingInfo){
					if (oBindingInfo){
						aContextPaths.push(oRowBindingContext.getProperty(oBindingInfo.path));
					} else {
						aContextPaths.push([]);
					}
				});
				aContextPaths.forEach(function(aShapeContextPaths, shapeTypeIndex) {
					aShapeContextPaths.forEach(function(sShapeContextPath, index) {
						// loop through the shape's context paths and get the context objects for each
						if (oModel.isA("sap.ui.model.json.JSONModel")){
							var sContextPath = oRowBindingContext + "/" + aBindingInfos[shapeTypeIndex].path + "/" + index;
							// loop through the shape's context paths and get the context objects for each
							oContext = oModel.getContext(sContextPath);
						} else {
							oContext = oModel.getContext("/" + sShapeContextPath);
						}
						oContext.aggrType = aPossibleShapes[shapeTypeIndex];
						var oTime = aBindingInfos[shapeTypeIndex].template.getBindingInfo("time"),
						oEndTime = aBindingInfos[shapeTypeIndex].template.getBindingInfo("endTime"),
						aShapes = aBindingInfos[shapeTypeIndex].template.getAggregation("shapes"),
						oTask = aBindingInfos[shapeTypeIndex].template.getAggregation("task");
						oContext.timeFormatter = oTime && oTime.formatter ||
							aShapes && aShapes[index].getBindingInfo("time") && aShapes[index].getBindingInfo("time").formatter ||
							oTask && oTask.getBindingInfo("time") && oTask.getBindingInfo("time").formatter;
						oContext.endTimeFormatter = oEndTime && oEndTime.formatter ||
							aShapes && aShapes[index].getBindingInfo("endTime") && aShapes[index].getBindingInfo("endTime").formatter ||
							oTask && oTask.getBindingInfo("endTime") && oTask.getBindingInfo("endTime").formatter;
						aContext.push(oContext);
					});
				});
				return {
					aContext:aContext
				};
			};
			var pseudoShapeTemplate;
			if (oRowSettingsTemplate.getPseudoShapeTemplate){
			  pseudoShapeTemplate = oRowSettingsTemplate.getPseudoShapeTemplate();
			}
			var needGradientCalculations = this.getEnablePseudoShapes() && ((pseudoShapeTemplate ? pseudoShapeTemplate.getTypeOfOverlapIndicator() : oBasePseudoShape.getTypeOfOverlapIndicator()) != "Indicator");
				if (!oParams) {
					//when called on Go / or any other event that causes row update
					var aExpandedIndices = this._aExpandedIndices, bIncludePseudoShape;
					//Now, for all rows optimisation is done
					if (needGradientCalculations){
						this.destroyAggregation("_pseudoSvgDefs", true);
						this._oSvgDefs = new SvgDefs({id: this.getId() + "_GradientColorForPseudoShape"});
					}
					aRows.forEach(function(oRow) {
						// loop through each row's settings
						var oSettings = oRow.getAggregation("_settings");
						aPossibleShapes.forEach(function(oShape){
							var aAggrShapes = oSettings.removeAllAggregation(oShape, true);
							Array.isArray(aAggrShapes) && aAggrShapes.forEach(function(oShape){
								oShape.destroy();
							});
						});
						this.bModifiedAggrTasks = true;
						// Get each rows binding context to get data for the shape's paths
						var oRowBindingContext = oRow.getBindingContext(sModelName), aContext = [];
						if (oRowBindingContext) {
							//Get the list of shape's context paths
							aContext = getContextArray(oRowBindingContext).aContext;
							//sort data based on start date, ascending
							bIncludePseudoShape = this.oOverlapShapeIds && this.oOverlapShapeIds[oRow.getIndex()] && this.oOverlapShapeIds[oRow.getIndex()].length > 0;
							if ((aExpandedIndices.indexOf(oRow.getIndex()) > -1 && !(bIncludePseudoShape)) || !this.getEnablePseudoShapes()) {
							//for expanded rows, add all shapes
							//collapse with pseudo shape display disabled
								aContext.forEach(function(oContext) {
									var oBindingInfo = aBindingInfos[aPossibleShapes.indexOf(oContext.aggrType)];
									if (oBindingInfo){
										var oClone = oBindingInfo.template.clone();
										oClone.setBindingContext(oContext, sModelName);
										// add back to the rows aggregation
										oSettings.addAggregation(oContext.aggrType, oClone, true);
									}
								});
							} else {
								oBasePseudoShape._createShapesFromContext(aContext, oRow,aBindingInfos,this,true, -1, needGradientCalculations);
							}
						}
					}.bind(this));
				} else {
					//when called from expand / collapse functions
					if (typeof oParams.aIndices === 'number') {
						oParams.aIndices = [oParams.aIndices];
					}
					oParams.aIndices.forEach(function(index) {
						var oRow = aRows[index - this.getTable().getRows()[0].getIndex()];
						var oSettings = oRow.getAggregation("_settings");
						aPossibleShapes.forEach(function(oShape){
							var aAggrShapes = oSettings.removeAllAggregation(oShape, true);
							Array.isArray(aAggrShapes) && aAggrShapes.forEach(function(oShape){
								oShape.destroy();
							});
						});
						// Get each rows binding context to get data for the shape's paths
						var oRowBindingContext = oRow.getBindingContext(sModelName), aContext = [];
						if (oRowBindingContext) {
							aContext = getContextArray(oRowBindingContext).aContext;
						}
						if ((oParams.bExpanded && (!oParams.bPseudoExpand)) || !this.getEnablePseudoShapes()) {
							// Normal row collapse with disabled pseudoshape display
							//for expanded rows, add all shapes
							aContext.forEach(function(oContext) {
								var oBindingInfo = aBindingInfos[aPossibleShapes.indexOf(oContext.aggrType)];
								if (oBindingInfo){
									var oClone = oBindingInfo.template.clone();
									oClone.setBindingContext(oContext, sModelName);
									// add back to the rows aggregation
									oSettings.addAggregation(oContext.aggrType, oClone, true);
								}
							});
						} else {
							var expanded  = oParams.bExpanded;
							oBasePseudoShape._createShapesFromContext(aContext, oRow,aBindingInfos,this,expanded,index, needGradientCalculations);
						}
					}.bind(this));
				}
				if (needGradientCalculations) {
					this.setAggregation("_pseudoSvgDefs", this._oSvgDefs, true);
				}
		}
	};

	/**
	 * @private
	 * this function is designed for all sync operation, in this function will remove the scroll event deadlock
	 * @private
	 */
	GanttChartWithTable.prototype.syncVisibleHorizon = function (oTimeHorizon, iVisibleWidth, bKeepStartTime, sReason){
		var oGanttAxisTimeStrategy = this.getAxisTimeStrategy();
		var oTotalHorizon = oGanttAxisTimeStrategy.getTotalHorizon();

		var oTargetVisibleHorizon;
		var iCurrentVisibleWidth = this.getVisibleWidth();
		if (iVisibleWidth !== undefined) {
			if (iCurrentVisibleWidth === undefined){
				return;
			}
			if (bKeepStartTime){
				var oCurrentVisibleHorizon = oGanttAxisTimeStrategy.getVisibleHorizon();
				var oCurrentStartTime = Format.abapTimestampToDate(oCurrentVisibleHorizon.getStartTime());
				oTargetVisibleHorizon = Utility.calculateHorizonByWidth(oTimeHorizon, iVisibleWidth, iCurrentVisibleWidth, oCurrentStartTime);
			} else {
				oTargetVisibleHorizon = Utility.calculateHorizonByWidth(oTimeHorizon, iVisibleWidth, iCurrentVisibleWidth);
			}

		} else {
			oTargetVisibleHorizon = oTimeHorizon;
		}

		if (oTotalHorizon.getEndTime() < oTargetVisibleHorizon.getEndTime()){
			var iTargetTimeSpan = Format.abapTimestampToDate(oTargetVisibleHorizon.getEndTime()).getTime() - Format.abapTimestampToDate(oTargetVisibleHorizon.getStartTime()).getTime();
			var oTotalHorizonEndTime = Format.abapTimestampToDate(oTotalHorizon.getEndTime());
			var oStartTime = new Date();
			oStartTime.setTime(oTotalHorizonEndTime.getTime() - iTargetTimeSpan);

			oTargetVisibleHorizon = new TimeHorizon({
				startTime: oStartTime,
				endTime: oTotalHorizonEndTime
			});
		}

		this._updateVisibleHorizon(oTargetVisibleHorizon, sReason || "syncVisibleHorizon", iCurrentVisibleWidth);
	};

	/**
	 * Method updates timehorizon depending on bird eye horizon range
	 * @private
	 */
	GanttChartWithTable.prototype._syncBirdEyeHorizon = function (oTimeHorizon){
		var oGanttAxisTimeStrategy = this.getAxisTimeStrategy();
		var oTotalHorizon = oGanttAxisTimeStrategy.getTotalHorizon();
		var iCurrentVisibleWidth = this.getVisibleWidth(),
		  oTargetVisibleHorizon = oTimeHorizon;
		  //when shapes are partially outside of total horizon
		  oTargetVisibleHorizon = new TimeHorizon({
			startTime: oTargetVisibleHorizon.getStartTime() < oTotalHorizon.getStartTime() ? oTotalHorizon.getStartTime() :  oTargetVisibleHorizon.getStartTime() ,
			endTime:  oTargetVisibleHorizon.getEndTime() > oTotalHorizon.getEndTime() ? oTotalHorizon.getEndTime() :  oTargetVisibleHorizon.getEndTime()
		  });
		this._updateVisibleHorizon(oTargetVisibleHorizon, "syncVisibleHorizon", iCurrentVisibleWidth);
	};

	GanttChartWithTable.prototype._updateVisibleHorizon = function (oTimeHorizon, sReasonCode, nVisibleWidth) {
		var oAxisTimeStrategy = this.getAxisTimeStrategy();
		oAxisTimeStrategy.updateGanttVisibleWidth(nVisibleWidth);

		var oPrevTimelineOptionInterval = oAxisTimeStrategy._oZoom.base.timeLineOption.innerInterval,
			oCurrentTimelineOptionInterval = oAxisTimeStrategy.getTimeLineOption().innerInterval;
		var bChangeInInterval = (oPrevTimelineOptionInterval.unit != oCurrentTimelineOptionInterval.unit ||
			oAxisTimeStrategy._getTimeLineRange(oAxisTimeStrategy._oZoom.base.timeLineOption) != oAxisTimeStrategy._getTimeLineRange(oAxisTimeStrategy.getTimeLineOption()) ||
			oPrevTimelineOptionInterval.span != oCurrentTimelineOptionInterval.span) && sReasonCode != "horizontalScroll" &&  sReasonCode != "jumpToPosition" &&  sReasonCode != "syncVisibleHorizon";
		if (sReasonCode === "initialRender" || bChangeInInterval ){
			if (!oAxisTimeStrategy.isA("sap.gantt.axistime.StepwiseZoomStrategy")) {
				oAxisTimeStrategy.calZoomBase();
			}
            if (sReasonCode === "initialRender" || (!oAxisTimeStrategy.isA("sap.gantt.axistime.StepwiseZoomStrategy") && bChangeInInterval)){
				oAxisTimeStrategy.createAxisTime(this.getLocale());
			}
		}
		if (oTimeHorizon && (oTimeHorizon.getStartTime() || oTimeHorizon.getEndTime())) {
			oAxisTimeStrategy.setVisibleHorizonWithReason(oTimeHorizon, sReasonCode);
		}
	};


	/**
	 * this function should only be triggered by sync mouse wheel zoom from ganttchart container, in this function will remove the scroll event deadlock
	 *
	 * @private
	 */
	GanttChartWithTable.prototype.syncMouseWheelZoom = function (oEvent){
		this._getZoomExtension().performMouseWheelZooming(oEvent.originEvent, true);
	};

	GanttChartWithTable.prototype.syncTimePeriodZoomOperation = function (oEvent, bTimeScrollSync, sOrientation){
		this._getZoomExtension().syncTimePeriodZoomOperation(oEvent, bTimeScrollSync, sOrientation);
	};

	GanttChartWithTable.prototype._onRedrawRequest = function (oEvent) {
		var oValueBeforeChange = oEvent.getParameter("valueBeforeChange");
		var sReasonCode = oEvent.getParameter("reasonCode");
		var subReasonCode =  oEvent.getParameter("subReasonCode");

		if (oValueBeforeChange && sReasonCode !== "totalHorizonUpdated" && sReasonCode !== "initialRender" && sReasonCode !== "syncVisibleHorizon") {
			if (sReasonCode == "horizontalScroll" && this.getHorizontalLazyLoadingEnabled()){
				if (this._isAllDataLoadedPromiseResolved){
					this._syncContainerGanttCharts(sReasonCode, oEvent.getParameter("originEvent"));
				}
			 } else {
				this._syncContainerGanttCharts(sReasonCode, oEvent.getParameter("originEvent"));
			 }
		}

		if (this._sPreviousDisplayType !== this.getDisplayType()) {
			this._isDisplayTypeChanged = true;
		} else {
			this._isDisplayTypeChanged = false;
		}
		// Get the last visible horizon with buffer before updating the timeline
		var oLastRenderedVisibleHorizon, oLastRenderedTimeRange, oCurrentRenderedVisibleHorizon, oCurrentRenderedTimeRange;
		if (sReasonCode !== "initialRender") {
			oLastRenderedTimeRange = this.getRenderedTimeRange();
			oLastRenderedVisibleHorizon = new TimeHorizon({
				startTime: oLastRenderedTimeRange[0],
				endTime: oLastRenderedTimeRange[1]
			});
		}
		 if (sReasonCode == "horizontalScroll" && this.getHorizontalLazyLoadingEnabled()){
			if (this._isAllDataLoadedPromiseResolved){
				this.redraw(sReasonCode);
			}
		 } else {
			this.redraw(sReasonCode);
		 }
		oCurrentRenderedTimeRange = this.getRenderedTimeRange();
		oCurrentRenderedVisibleHorizon = new TimeHorizon({
			startTime: oCurrentRenderedTimeRange[0],
			endTime: oCurrentRenderedTimeRange[1]
		});
		this.fireVisibleHorizonUpdate({
			type: VISIBLE_HORIZON_UPDATE_TYPE_MAP[sReasonCode],
			subType: subReasonCode ? VisibleHorizonUpdateSubType[subReasonCode] : VisibleHorizonUpdateSubType.NotApplicable,
			lastVisibleHorizon: oValueBeforeChange,
			currentVisibleHorizon: this.getAxisTimeStrategy().getVisibleHorizon(),
			lastRenderedVisibleHorizon: oLastRenderedVisibleHorizon ? oLastRenderedVisibleHorizon : oCurrentRenderedVisibleHorizon,
			currentRenderedVisibleHorizon: oCurrentRenderedVisibleHorizon
		});
	};

	/**
	 * Redraw the chart svg if the surrounding conditions change, e.g zoom strategy updated, row binding context changed
	 * or while scrolling out of the buffer etc.
	 * @param {string} sReasonCode Reason code for calling redraw.
	 * @private
	 */
	GanttChartWithTable.prototype.redraw = function (sReasonCode) {
		this._draw(sReasonCode);
	};

	GanttChartWithTable.prototype._draw = function (sReasonCode) {
		if (this.getDisplayType() === GanttChartWithTableDisplayType.Table && !this.isPrint) {
			// Adjust zoom level to support multiple variants with different zoom levels
			var mAggregations = AggregationUtils.getAllNonLazyAggregations(this.getParent());
			if (this.getParent().isA("sap.gantt.simple.GanttChartContainer") && mAggregations.toolbar) {
				this.getParent().getToolbar().updateZoomLevel(this.getAxisTimeStrategy().getZoomLevel());
			}
		} else {
			var iVisibleWidth = this._iLastVisibleWidth ? this._iLastVisibleWidth : this.getVisibleWidth();
			if (!iVisibleWidth) {
				return;
			}
			//Changes to set ZoomLevel during the Initial Rendering of the GanttChart
			var oAxisTimeStrategy = this.getAxisTimeStrategy();
			var oSyncZoomStrategyResult = oAxisTimeStrategy.syncContext(iVisibleWidth);
			if (oAxisTimeStrategy.initialSettings != null && oAxisTimeStrategy.initialSettings.zoomLevel != null
				&& oAxisTimeStrategy.initialSettings.zoomLevel != 0 && sReasonCode == "initialRender"
				&& !oAxisTimeStrategy.isA("sap.gantt.axistime.FullScreenStrategy")
				&& !this.isPrint && this.getParent().isA("sap.gantt.simple.GanttChartContainer") && !this.getParent().isZoomLevelUpdated) {
					var binitialZoomLevel = oAxisTimeStrategy.initialSettings.zoomLevel;
					oAxisTimeStrategy.setProperty("zoomLevel", binitialZoomLevel, true);
					oSyncZoomStrategyResult.zoomLevel = binitialZoomLevel;
					var visibleHorizon = oAxisTimeStrategy.calVisibleHorizonByRate(oAxisTimeStrategy._aZoomRate[binitialZoomLevel]);
					oAxisTimeStrategy.updateInitialVisibleHorizon(visibleHorizon, binitialZoomLevel);
					this.getParent().isZoomLevelUpdated = true;
			}
			if (sReasonCode == "initialRender" && oAxisTimeStrategy.isA("sap.gantt.axistime.StepwiseZoomStrategy")) {
				var oHorizon = oAxisTimeStrategy._completeTimeHorizon(new TimeHorizon({
					startTime: oAxisTimeStrategy.getVisibleHorizon().getStartTime()
				}));
				oAxisTimeStrategy.getVisibleHorizon().setProperty("endTime", oHorizon.getEndTime(), true);
			}
			this.fireEvent("_zoomInfoUpdated", oSyncZoomStrategyResult);
			this._iLastVisibleWidth = null;

			var oScrollExtension = this._getScrollExtension();
			if (oSyncZoomStrategyResult.axisTimeChanged) {
				// clear SVG offset to ensure rerender
				oScrollExtension.clearOffsetWidth();
			}

			oScrollExtension.needRerenderGantt(function () {
				// This is need render fast. otherwise UI has flicker
				this.oExpandedShapesMap = {};
				this.getInnerGantt().getRenderer().renderImmediately(this);
			}.bind(this), sReasonCode);
		}
	};

	GanttChartWithTable.prototype._syncContainerGanttCharts = function (sReasonCode, oOriginEvent) {
		var oGanttParent = this.getParent();
		if (oGanttParent && oGanttParent.isA("sap.gantt.simple.GanttChartContainer") && oGanttParent.getGanttCharts().length > 1) {
			this.fireEvent("_initialRenderGanttChartsSync", {
				reasonCode: sReasonCode, visibleHorizon: this.getAxisTimeStrategy().getVisibleHorizon(), visibleWidth: this.getVisibleWidth(), originEvent: oOriginEvent
			});
		}
	};

	/**
	 * Function is called before the control is rendered.
	 * @private
	 * @override
	 */
	GanttChartWithTable.prototype.onBeforeRendering = function(oEvent) {
		performance.mark("GanttChartWithTable--start");

		this._updateRowHeightInExpandModel(this.getTable());
		GanttExtension.detachEvents(this);

		this._oSplitter.detachResize(this.onSplitterResize, this);

		if (this._sResizeHandlerId) {
			ResizeHandler.deregister(this._sResizeHandlerId);
		}

		if (this.getDisplayType() !== GanttChartWithTableDisplayType.Table) {
			// make sure InnerGantt is invalidated because it's not in some cases like GanttChartWithTable's managed property update
			if (this._bPreventInitialRender) {
				delete this._bPreventInitialRender; // Might Needs to jump to visible Horizon
			}
			if (this.getEnablePseudoShapes()){
				this._createInnerGanttRenderPromise();
			}
			this.getInnerGantt().invalidate();
		}

		var oTable = this.getTable();
		//Add Export button to the Table if the showExportTableToExcel property is set to True
		if (this.getShowExportTableToExcel() && !this._enableOptimisation && this.getShowGanttHeader()) {
			if (this.oExportTableToExcelButton == null) { //Check for availability of export button.
				this.oExportTableToExcelButton = new MenuButton(this.getId() + "-exportTableToExcelButton", {
					icon:  "sap-icon://excel-attachment",
					tooltip: oResourceBundle.getText("EXPORT_BUTTON_TEXT"),
					type: sap.m.ButtonType.Transparent,
					buttonMode: sap.m.MenuButtonMode.Split,
					useDefaultActionOnly: true,
					defaultAction: [
						function() {
							this._exportTableToExcel();
						}, this
					],
					menu: [
						new Menu({
							items: [
								new MenuItem({
									text: oResourceBundle.getText("QUICK_EXPORT"),
									press: [
										function() {
											this._exportTableToExcel();
										}, this
									]
								}),
								new MenuItem({
									text: oResourceBundle.getText("EXPORT_WITH_SETTINGS"),
									press: [
										function() {
											this._createExportDialogBox();
										}, this
									]
								})
							]
						})
					]
				});
			}
			GanttUtils.addToolbarToTable(this, oTable, true);
		} else if (!this.getShowExportTableToExcel() && (oTable.getExtension().length > 0 && !(oTable.getExtension()[0].getContent().indexOf(this.oExportTableToExcelButton) === -1))) {//Check to remove the Export button when ShowExportTableToExcel = false
			if (oTable.getExtension()[0].getContent().length == 1) { //If only single content is present, remove the entire Table.extension.
				oTable.removeExtension(oTable.getExtension()[0]);
			} else if (oTable.getExtension()[0].getContent().length > 1) {
				oTable.getExtension()[0].removeContent(this.oExportTableToExcelButton); //If multiple contents are present, remove only the Export button.
			}
		}
		this._invalidateRowActionTemplate(oTable);
	};

	/**
	 *	Function to trigger invalidate on rowActionTemplate when Table Binding is updated, applicable only if rowActionTemplate = sap.gantt.simple.GanttRowAction
	 *  @private
	 */
	 GanttChartWithTable.prototype._invalidateRowActionTemplate = function(oTable, sReason) {
		var oRowActionTemplate = oTable.getRowActionTemplate();
		if (oRowActionTemplate && oRowActionTemplate.isA("sap.gantt.simple.GanttRowAction") && oRowActionTemplate.getControlTemplate()) {
			if (!this._bRowActionInitialRender && sReason === "Render") {
				this._bRowActionInitialRender = true;
				oRowActionTemplate.invalidate();
			} else if (sReason === "Unbind") {
				this._bRowActionInitialRender = false;
			} else if (sReason !== "Render" && sReason !== "Unbind") {
				oRowActionTemplate.invalidate();
			}
		}
	};

	/**
	 * Determines whether gantt chart is in fullscreen mode.
	 * @returns {boolean} return true if gantt chart is in fullscreen mode.
	 * @public
	 * @since 1.97
	 */
	GanttChartWithTable.prototype.fullScreenMode = function() {
		if (this._bFullScreen) {
			return true;
		} else {
			return false;
		}
	};

	/**
	 * Toggles the gantt chart from normal to fullscreen mode and vice versa. Works only if gantt chart is inside a gantt container.
	 * In the fullscreen mode, gantt container can hold only 1 gantt chart. The {@link sap.gantt.simple.GanttChartContainer#insertGanttChart} and {@link sap.gantt.simple.GanttChartContainer#addGanttChart} functionality of gantt chart container won't work in fullscreen mode.
	 * @param {boolean} bShowToolbar Whether gantt container's toolbar is to be shown in the fullscreen mode along with the gantt chart.
	 * @param {object} oButton Button clicked to toggle the fullscreen mode.
	 * @public
	 * @since 1.97
	 */
	GanttChartWithTable.prototype.toggleFullScreen = function(bShowToolbar, oButton) {
		var oGanttCharts;
		var oContainer = this.getParent();
		if (!oContainer.isA("sap.gantt.simple.GanttChartContainer")) {
			return null;
		}
		if (!oContainer._oFullScreenUtil) {
			oContainer._oFullScreenUtil = FullScreenUtil;
		}
		if (this._bFullScreen) {
			this._bFullScreen = false;
			oContainer._bHideToolbar = false;
			oContainer._bHideVariant = false;
			oContainer.setHeight(this._fContainerHeight);
			oContainer._bNoResize = true;
			for (var key in this._mGanttCharts){
				oContainer.insertGanttChart(this._mGanttCharts[key], key);
			}
			oContainer._bNoResize = false;
			oGanttCharts = oContainer.getGanttCharts();
			var bSync = oContainer.getEnableTimeScrollSync();
			var oNewVisibleHorizon = this.getAxisTimeStrategy().getVisibleHorizon();
			var iZoomLevel  = this.getAxisTimeStrategy().getZoomLevel();
			oGanttCharts.forEach(function(oGantt, index){
				if (bSync) {
					oGantt.getAxisTimeStrategy().getVisibleHorizon().setStartTime(oNewVisibleHorizon.getStartTime());
					oGantt.getAxisTimeStrategy().getVisibleHorizon().setEndTime(oNewVisibleHorizon.getEndTime());
					oGantt.getAxisTimeStrategy().setProperty("zoomLevel", iZoomLevel, true);
				} else if (oGantt.getId() !== this.getId()) {
					oGantt.getAxisTimeStrategy().getVisibleHorizon().setStartTime(this._aVisibleHorizons[index].startTime);
					oGantt.getAxisTimeStrategy().getVisibleHorizon().setEndTime(this._aVisibleHorizons[index].endTime);
				}
				oContainer._oSplitter.getContentAreas()[index].getLayoutData().setSize(this._aSplitterLayoutSizes[index]);
			}.bind(this));
			this._bRenderFullScreenGantt = true;
			oContainer._oFullScreenUtil.toggleFullScreen(oContainer, false, oButton, this.toggleFullScreen);
		} else {
			this._bFullScreen = true;
			oGanttCharts = oContainer.getGanttCharts();
			this._aSplitterLayoutSizes = [];
			this._mGanttCharts = {};
			this._aVisibleHorizons = [];
			oGanttCharts.forEach(function(oGantt, index){
				this._aSplitterLayoutSizes.push(oContainer._oSplitter.getContentAreas()[index].getLayoutData().getSize());
				this._aVisibleHorizons.push({
					startTime: oGantt.getAxisTimeStrategy().getVisibleHorizon().getStartTime(),
					endTime: oGantt.getAxisTimeStrategy().getVisibleHorizon().getEndTime()
				});
				if (oGantt.getId() !== this.getId()) {
					this._mGanttCharts[index] = oGantt;
				}
			}.bind(this));
			oContainer._bNoResize = true;
			oGanttCharts.forEach(function(oGantt){
				if (oGantt.getId() !== this.getId()) {
					oContainer.removeGanttChart(oGantt);
				}
			}.bind(this));
			oContainer._bNoResize = false;
			oContainer._bHideToolbar = !bShowToolbar;
			oContainer._bHideVariant = true;
			this._fContainerHeight = oContainer.getHeight();
			oContainer.setHeight(window.innerHeight + "px");
			this._bRenderFullScreenGantt = true;
			oContainer._oFullScreenUtil.toggleFullScreen(oContainer, true, oButton, this.toggleFullScreen);
		}
		oContainer.updateSearch();
	};

	/**
	 * Function is called after the control is rendered.
	 * @private
	 * @override
	 */
	GanttChartWithTable.prototype.onAfterRendering = function (oEvent) {
		this._attachExtensions();
		GanttExtension.attachEvents(this);

		this._oSplitter.attachResize(this.onSplitterResize, this);

		this._sResizeHandlerId = ResizeHandler.register(this, this._onResize.bind(this));

		var aShapeRenderOrder = this.getShapeRenderOrder();
		if (!this._aShapeRenderOrder && aShapeRenderOrder && aShapeRenderOrder.length > 0) {
			var aAggregations =  Object.keys(this.getTable().getRowSettingsTemplate().getMetadata().getAllAggregations());
			this._aShapeRenderOrder = aAggregations.filter(function(sName){
				return (aShapeRenderOrder.indexOf(sName) === -1 &&  (sName.indexOf("overlay") == -1));
			}).concat(aShapeRenderOrder);
			if (this._aShapeRenderOrder.indexOf("pseudoShapes") == -1){
                this._aShapeRenderOrder.push("pseudoShapes");
            }
		}

		// at this point, there are no shapes rendered at all, so GanttScrollExtension.jumpToVisibleHorizon("initialRender")
		// will change the zoomRate then trigger redraw (this is executed in InnerGanttChart.prototype.onBeforeRendering)

		//If a fixed height has been specified to GanttChartWithTable/GanttChartContainer
		//set the VisibleRowCountMode=Auto which makes the table calculate number of rows to be displayed within the given height and make the GanttChart displays the HorizontalScrollBar
		if ((this.mProperties.hasOwnProperty("height") || (this.getParent() && this.getParent().mProperties.hasOwnProperty("height"))) && !this._enableOptimisation) {
			var oTable = this.getTable();
			var oRowMode = oTable.getRowMode();
			if (oRowMode){
				if (oRowMode.isA("sap.ui.table.rowmodes.Auto")){
					oRowMode.setMinRowCount(1);
				} else if (oRowMode.isA("sap.ui.table.rowmodes.RowMode")){
						oTable.setRowMode(
							new AutoRowMode({
							rowContentHeight:oRowMode.getRowContentHeight(),
							fixedBottomRowCount:oRowMode.getFixedBottomRowCount(),
							fixedTopRowCount:oRowMode.getFixedTopRowCount(),
							minRowCount: 1
							})
						);
					} else {
						//safe block
						oTable.setRowMode(
							new AutoRowMode({
							minRowCount: 1
							})
						);
					}
			}

			/**
			 * @deprecated As of version 1.119
			 */
			if (!oRowMode) {
				oTable.setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Auto);
				oTable.setMinAutoRowCount(1);//Change the default value of minAutoRowCount to 1 form the default vlue of 5 for GanttChart with minimal height.
			}
		}

		performance.mark("GanttChartWithTable--end");
	};

	/**
	 * Keep both parts of the splitter always visible in case splitter or browser is resized
	 *
	 * @private
	 */
	GanttChartWithTable.prototype._onResize = function (isSplitterResized) {
		if (this.getDisplayType() !== GanttChartWithTableDisplayType.Both) {
			return;
		}
		var oSplitter = this.getAggregation("_splitter");
		this._sPreviousDisplayType = this.getDisplayType();
		if (this._sPreviousDisplayType === GanttChartWithTableDisplayType.Both) {
			this._iLastTableAreaSize = this.getAggregation("_splitter").getContentAreas()[0] &&  this.getAggregation("_splitter").getContentAreas()[0].getLayoutData().getSize();
		}
		if (oSplitter.getContentAreas()[0] && oSplitter.getContentAreas()[0].getLayoutData()) {
			var oLeftPart = oSplitter.getContentAreas()[0],
				oLayoutData = oLeftPart.getLayoutData(),
				iFullWidth = this.getDomRef().offsetWidth,
				iNewSize;
			if ((iFullWidth > 0) && (iFullWidth < MIN_AREA_WIDTH * 2)) {
				iNewSize = iFullWidth / 2;
				iNewSize = iNewSize + "px";
			} else {
				var iLeftWidth = oLeftPart.getDomRef().offsetWidth;
				if (iLeftWidth > MIN_AREA_WIDTH) {
					return;
				}
				//Check if iLeftWidth is 0 and the resize is not trigerred from the method onSplitterResize then take the value form selectionPanelSize
				//If the splitter is resized and the _onResize is trigerred from onSplitterResize check if the table width is set to to 0px then set the maximum between 30% of full width and default width of 60 px to the table from the else condition.
				if (this.getSelectionPanelSize() != null && iLeftWidth == 0 && isSplitterResized != true) {
					iNewSize = this.getSelectionPanelSize();
				} else {
					iNewSize = Math.max(Math.min(iLeftWidth, iFullWidth - MIN_AREA_WIDTH), Math.max((0.3 * iFullWidth), MIN_AREA_WIDTH));
					iNewSize = iNewSize + "px";
				}
			}
			oLayoutData.setSize(iNewSize);
		}
	};

	GanttChartWithTable.prototype._setupDisplayType = function () {
		var sDisplayType = this.getDisplayType();
		this._isDisplayTypeChanged = true;
		if (sDisplayType === GanttChartWithTableDisplayType.Table) {
			var iVSbWidth = this.getSyncedControl().$().find(".sapGanttBackgroundVScrollContentArea").width();
			if (iVSbWidth !== null) {
				this._setSplitterLayoutData("auto", iVSbWidth + "px");
			}
		} else if (sDisplayType === GanttChartWithTableDisplayType.Chart) {
			this._setSplitterLayoutData("0px", "auto");
		} else if (sDisplayType !== this._sPreviousDisplayType) {
			this._setSplitterLayoutData(this._iLastTableAreaSize ? this._iLastTableAreaSize : this.getSelectionPanelSize(), "auto");
		}
	};

	GanttChartWithTable.prototype._setSplitterLayoutData = function (sTableSize, sChartSize) {
		var aSplitterContentAreas = this._oSplitter.getContentAreas();
		if (aSplitterContentAreas.length > 1) {
			var oTableAreaLayoutData = aSplitterContentAreas[0].getLayoutData(),
				oChartAreaLayoutData = aSplitterContentAreas[1].getLayoutData(),
				bResizable = this.getDisplayType() === GanttChartWithTableDisplayType.Both;

			oTableAreaLayoutData.setSize(sTableSize).setResizable(bResizable);
			oChartAreaLayoutData.setSize(sChartSize).setResizable(bResizable);
		}
	};

	GanttChartWithTable.prototype._updateRowHeightInExpandModel = function(oTable) {
		GanttUtils.setTableRowMode(oTable);
		var oRowMode = oTable.getRowMode(), iTableRowHeight = 0;
		if (oRowMode) {
			iTableRowHeight = Math.ceil(oRowMode.getRowContentHeight());
		} else {
			/**
			 * @deprecated As of version 1.119
			 */
			iTableRowHeight = Math.ceil(oTable.getRowHeight());
		}
		if (iTableRowHeight === 0) {
			iTableRowHeight =  Math.ceil(oTable._getDefaultRowHeight());
		}
		this._oExpandModel.setBaseRowHeight(iTableRowHeight);
	};

	/**
	 * Jumps to a given position on the time axis by updating the visible horizon.
	 *
	 * Can be used to implement the function of 'Jump To First', 'Jump To Last' and 'Jump To Current'.
	 *
	 * @param {(Date|string|Array)} vValue A date object or a 14-digit timestamp string in this format: YYYYMMDDHHMMSS.
	 * An array can also be passed where the two values determine the start time and end time of the visible horizon.
	 * @public
	 * @since 1.75
	 */
	GanttChartWithTable.prototype.jumpToPosition = function (vValue) {
		if (Object.prototype.toString.call(vValue) === "[object Date]" || typeof vValue === "string") {
			this._updateVisibleHorizon(new TimeHorizon({
				startTime: vValue
			}), "jumpToPosition", this.getVisibleWidth());
		} else if (Array.isArray(vValue)) {
			this._updateVisibleHorizon(new TimeHorizon({
				startTime: vValue[0],
				endTime: vValue[1]
			}), "jumpToPosition", this.getVisibleWidth());
		} else if (vValue === undefined) {
			this._updateVisibleHorizon(this.getAxisTimeStrategy().getTotalHorizon(), "jumpToPosition", this.getVisibleWidth());
		}
	};

	GanttChartWithTable.prototype.exit = function() {
		if (this._sResizeHandlerId) {
			ResizeHandler.deregister(this._sResizeHandlerId);
		}
		this._detachExtensions();
		delete this._bPreventInitialRender;
	};

	GanttChartWithTable.prototype._attachExtensions = function() {
		if (this._bExtensionsInitialized) {
			return;
		}
		GanttExtension.enrich(this, GanttScrollExtension);
		GanttExtension.enrich(this, GanttZoomExtension);
		GanttExtension.enrich(this, GanttPointerExtension);
		GanttExtension.enrich(this, GanttDragDropExtension);
		GanttExtension.enrich(this, GanttPopoverExtension);
		GanttExtension.enrich(this, GanttConnectExtension);
		GanttExtension.enrich(this, GanttResizeExtension);
		GanttExtension.enrich(this, GanttLassoExtension);

		this._bExtensionsInitialized = true;
	};

	GanttChartWithTable.prototype._detachExtensions = function(){
		GanttExtension.cleanup(this);
	};

	/**
	 * This is a shortcut method for GanttChart instance to get the AxisTime.
	 *
	 * @protected
	 * @returns {sap.gantt.misc.AxisTime} the AxisTime instance
	 */
	GanttChartWithTable.prototype.getAxisTime = function () {
		var oAxisTimeStrategy = this.getAxisTimeStrategy();
		if (oAxisTimeStrategy) {
			var oAxisTime = oAxisTimeStrategy.getAxisTime();
			if (!oAxisTime) {
				oAxisTimeStrategy.createAxisTime(this.getLocale());
				oAxisTime = oAxisTimeStrategy.getAxisTime();
			}

			return oAxisTime;
		}
	};

	/**
	 * Return the Chart Content width by calculating the Axistime zoom strategy
	 * timeline distances, the unit is in pixel.
	 *
	 * @private
	 * @returns {int} the cnt width in pixel
	 */
	GanttChartWithTable.prototype.getContentWidth = function() {
		var oAxisTime = this.getAxisTime(),
			oRange = oAxisTime.getViewRange();
		return (Math.abs(Math.ceil(oRange[1]) - Math.ceil(oRange[0])) - 1);
	};

	/**
	 * Visible SVG width
	 * @private
	 * @returns {int} the visible width in chart area
	 */
	GanttChartWithTable.prototype.getVisibleWidth = function() {
		return this._getScrollExtension ? this._getScrollExtension().getVisibleWidth() : undefined;
	};

	/**
	 * expand one or more rows indices by the shape scheme key.
	 * This function takes effect only after the control is fully rendered, otherwise it's doing nothing.
	 *
	 * @param {string|string[]}  vSchemeKey A single key or an array of  scheme keys defined in <code>sap.gantt.simple.ShapeScheme</code>
	 * @param {int|int[]} vRowIndex A single index or an array of indices of the rows to be collapsed
	 * @public
	 */
	GanttChartWithTable.prototype.expand = function(aSchemeKeys, vRowIndex) {
		if (typeof aSchemeKeys === "string"){
			aSchemeKeys = [aSchemeKeys];
		}
		if (this.oOverlapShapeIds && this.oOverlapShapeIds[vRowIndex] && this.oOverlapShapeIds[vRowIndex].length > 0){
			delete this.oOverlapShapeIds[vRowIndex];
			var aRows = this.getTable().getRows();
			delete this._oExpandModel.mExpanded[aRows[vRowIndex - aRows[0].getIndex()].getAggregation("_settings").getRowUid()];
		}
		this._expand(aSchemeKeys, vRowIndex);
	};

	/**
	 * Performs the expand action considering if there is a pseudo shape or a normal scenario
	 * @private
	 */
	GanttChartWithTable.prototype._expand = function(aSchemeKeys, vRowIndex,bPseudoShapeExpand) {
		if (this.getEnablePseudoShapes()){
			this._addBackTasksToRows({
				aIndices : vRowIndex,
				bExpanded: true,
				bPseudoExpand: bPseudoShapeExpand
			});
		}
		if (bPseudoShapeExpand) {
			this.toggleShapeScheme(true, aSchemeKeys, vRowIndex,bPseudoShapeExpand);
		} else  {
			this.toggleShapeScheme(true, aSchemeKeys, vRowIndex);
		}
		// Append the expanded indices
		this._aExpandedIndices = this._aExpandedIndices.concat(vRowIndex);
		// Remove duplicates as the Expand button can be selected multiple times
		this._aExpandedIndices = Array.from(new Set(this._aExpandedIndices));
	};

	/**
	 * Collapse the selected row indices by the shape scheme key.
	 * This function takes effect only after the control is fully rendered, otherwise it's doing nothing.
	 *
	 * @param {string|string[]} vSchemeKey A single key or an array of  scheme keys defined in <code>sap.gantt.simple.ShapeScheme</code>
	 * @param {int|int[]} vRowIndex A single index or an array of indices of the rows to be collapsed
	 * @public
	 */
	GanttChartWithTable.prototype.collapse = function(aSchemeKeys, vRowIndex) {
		if (typeof aSchemeKey === "string"){
			aSchemeKeys = [aSchemeKeys];
		}
		this._collapse(aSchemeKeys,vRowIndex);
	};

	/**
	 * Performs the collapse action considering if there is a pseudo shape or a normal scenario
	 * @private
	 */
	GanttChartWithTable.prototype._collapse = function(aSchemeKeys, vRowIndex,bPseudoShapeExpand) {
		var aRowIndex = [];
		aRowIndex = aRowIndex.concat(vRowIndex);
		if (this.getEnablePseudoShapes()){
			this._addBackTasksToRows({
				aIndices : vRowIndex,
				bExpanded: false
			});
		}
		if (bPseudoShapeExpand){
			this.toggleShapeScheme(false, aSchemeKeys, vRowIndex,bPseudoShapeExpand);
		} else {
			this.toggleShapeScheme(false, aSchemeKeys, vRowIndex);
		}
		// Remove collapsed row index/indices
		this._aExpandedIndices = this._aExpandedIndices.filter(function(value){
			return aRowIndex.indexOf(value) == -1;
		});
		if (aRowIndex.indexOf(vRowIndex) > -1 && this.oOverlapShapeIds){
			delete this.oOverlapShapeIds[aRowIndex];
		}
	};

	/**
	 * @private
	 */
	GanttChartWithTable.prototype.toggleShapeScheme = function(bExpanded, aSchemeKeys, vRowIndex,bPseudoShapeExpand) {
		var aIndices = [];
		if (typeof vRowIndex === "number") {
			aIndices = [vRowIndex];
		} else if (Array.isArray(vRowIndex)) {
			aIndices = vRowIndex;
		}

		if (aIndices.length === 0 || ((!aSchemeKeys || aSchemeKeys && !aSchemeKeys.length) && !bPseudoShapeExpand)) { return; }

		var aExpandScheme = aSchemeKeys && this.getShapeSchemes().filter(function(oScheme){
			return aSchemeKeys.indexOf(oScheme.getKey()) > -1;
		});

		if (!bPseudoShapeExpand && (aExpandScheme == null || aExpandScheme.length === 0) ){
			assert(false, "shape scheme must not be null or not found in shapeSchemes");
			return;
		}

		var oPrimaryScheme = this.getPrimaryShapeScheme();

		this._syncRowExpandState(vRowIndex, bExpanded, bPseudoShapeExpand);
		this._bExpandToggled = this._oExpandModel.isTableRowHeightNeedChange(bExpanded, this.getTable(), aIndices, oPrimaryScheme, aExpandScheme);
		if (this._bExpandToggled) {
			if (this.getEnablePseudoShapes()){
				this._bUpdateTriggeredDueToExpandCollapse = true;
			}
			this._createInnerGanttRenderPromise();
			this.getTable().invalidate();
		} else {
			this._syncRowExpandState(vRowIndex, !bExpanded, bPseudoShapeExpand);
		}
	};

	/**
	 * Determine whether the shape times fit into the visible horizon.
	 *
	 * @param {sap.gantt.simple.BaseShape} oShape any shape inherits from BaseShape
	 * @returns {boolean} return true if shape time range fit into visible area
	 */
	GanttChartWithTable.prototype.isShapeVisible = function(oShape) {
		if (oShape && oShape.isVisible()) {
			return true;
		}

		if (!oShape.getVisible()) {
			return false;
		}

		var mTimeRange = this.getRenderedTimeRange(),
			oMinTime = mTimeRange[0],
			oMaxTime = mTimeRange[1];

		var oStartTime = Format.abapTimestampToDate(oShape.getTime()),
			oEndTime = Format.abapTimestampToDate(oShape.getEndTime());

		var fnFallInRange = function(oTime) {
			return (oTime >= oMinTime && oTime <= oMaxTime);
		};
		if (oShape.getSelected() || !oStartTime || !oEndTime) {
			//time not set
			return true;
		} else if (oStartTime && oEndTime) {
			// both has value
			//     start time fall in range  OR end time fall in range  OR start time and end time cross the range
			return fnFallInRange(oStartTime) || fnFallInRange(oEndTime) || (oStartTime <= oMinTime && oEndTime >= oMaxTime);
		}
	};

	/**
	 * Determine whether the calendar time interval fit into the visible horizon.
	 *
	 * @param {sap.gantt.def.cal.TimeInterval} oTimeInterval Time interval of the calendar def
	 * @returns {boolean} return true if time interval time range fit into visible area
	 */
	 GanttChartWithTable.prototype.isCalendarTimeIntervalVisible = function(oTimeInterval) {
		var mTimeRange = this.getRenderedTimeRange(),
			oMinTime = mTimeRange[0],
			oMaxTime = mTimeRange[1];

		var oStartTime = Format.abapTimestampToDate(oTimeInterval.getStartTime()),
			oEndTime = Format.abapTimestampToDate(oTimeInterval.getEndTime());

		var fnFallInRange = function(oTime) {
			return (oTime >= oMinTime && oTime <= oMaxTime);
		};
		if (oStartTime && oEndTime) {
			// both has value
			// start time fall in range  OR end time fall in range  OR start time and end time cross the range
			return fnFallInRange(oStartTime) || fnFallInRange(oEndTime) || (oStartTime <= oMinTime && oEndTime >= oMaxTime);
		}
	};

	/**
	 * The Gantt Chart performs Bird Eye on all visible rows or on a specific row depending on the setting of iRowIndex.
	 * @param {int} iRowIndex zero-based index indicating which row to perform Bird Eye on. If you do not specify iRowIndex, the Gantt chart performs Bird Eye on all visible rows.
	 *
	 * @public
	 */
	GanttChartWithTable.prototype.doBirdEye = function(iRowIndex) {
		var oZoomExtension = this._getZoomExtension();
		oZoomExtension.doBirdEye(iRowIndex);
	};

	/**
	 *	Function to handle Export to Excel feature of a table within a GanttChart
	 *  @private
	 */
	GanttChartWithTable.prototype._exportTableToExcel = function(exportExcelConfig) {
		var aCols, oSettings, oSheet, bJSONModel, oTable, oRowBinding;

		oTable = this.getTable();

		if (oTable) {
			oRowBinding = oTable.getBinding(oTable._sAggregation);
		}

		//For JSON model, set the flag bJSONModel to True
		if (oRowBinding.getModel().isA('sap.ui.model.json.JSONModel')) {
			bJSONModel = true;
		}

		//Create column definition from the CustomData to export.
		aCols = this._createColumnConfig();

		var oModel = oRowBinding.getModel();

		//Create the settings parameter for Export.
		oSettings = {
			workbook: { columns: aCols },
			fileName: exportExcelConfig && exportExcelConfig.fileName ?  exportExcelConfig.fileName  : "GanttTableExport.xlsx",
			worker: false
		};

		//Create DataSource based on current DataModel.
		if (bJSONModel) { //JSONModel
			oSettings.dataSource = this._createJSONDataSource(oTable);
		} else { //ODATA Model
			oSettings.dataSource = {
				type: "odata",
				dataUrl: oRowBinding.getDownloadUrl ? oRowBinding.getDownloadUrl() : null,
				serviceUrl: this._sServiceUrl,
				headers: oModel.getHeaders ? oModel.getHeaders() : null,
				count: oRowBinding.getLength ? oRowBinding.getLength() : null
			};
		}

		//Set hierarchy level for a GanttChart.
		if (oTable.getColumns()[0].data("exportTableColumnConfig") && oTable.getColumns()[0].data("exportTableColumnConfig").hierarchyNodeLevel) {
			oSettings.workbook.hierarchyLevel =  oTable.getColumns()[0].data("exportTableColumnConfig").hierarchyNodeLevel;
		}

		//Create a new instance of spreadsheet for download.
		oSheet = new Spreadsheet(oSettings);
		oSheet.build().finally(function() {
			oSheet.destroy();
		});
	};

	/**
	 *	Function to create a dialog box for Save.
	 *  @private
	 */
	GanttChartWithTable.prototype._createExportDialogBox = function() {
		//Function to create a dialog box for Save.
		this._getExportSettingsViaDialog().then(function(exportExcelConfig) {
			this._exportTableToExcel(exportExcelConfig);
		}.bind(this));

	};

	//Function to create a dialog box for Save.
	GanttChartWithTable.prototype._getExportSettingsViaDialog = function(fnCallback) {
		return new Promise(function (fnResolve, fnReject) {
			var oExportSettingsDialog;
			var oExportConfigModel = new JSONModel();
			var oDefaultConfig = {
				fileName: "GanttTableExport",
				fileType: [
					{key: "xlsx"}
				],
				selectedFileType: "xlsx"
			};
			oExportConfigModel.setData(oDefaultConfig);

			var sDialogId = uid();

			oExportSettingsDialog = new Dialog({
				id: sDialogId,
				title: oResourceBundle.getText("EXPORT_SETTINGS_TITLE"),
				content: [
					new VBox({
						renderType: "Bare",
						width: "100%",
						items: [
							new Label({
								text: oResourceBundle.getText("FILE_NAME"),
								labelFor: sDialogId + "-fileName"
							}),
							new Input({
								id: sDialogId + "-fileName",
								value: "{/fileName}",
								liveChange: function (oEvent) {
									//Validate user inputs for a file name.
									var oInput = oEvent.getSource();
									var sFileName = oEvent.getParameter("value");
									var oRegEx = /[\\/:|?"*<>]/;
									var oExportBtn = Element.getElementById(sDialogId + "-export");
									var bValidate = oRegEx.test(sFileName);
									if (bValidate) {
										oInput.setValueState(sap.ui.core.ValueState.Error);
										oInput.setValueStateText(oResourceBundle.getText("FILENAME_ERROR"));
									} else if (sFileName.length > 100) {
										oInput.setValueState(sap.ui.core.ValueState.Warning);
										oInput.setValueStateText(oResourceBundle.getText("FILENAME_WARNING"));
									} else {
										oInput.setValueState(sap.ui.core.ValueState.None);
										oInput.setValueStateText(null);
									}
									oExportBtn.setEnabled(!bValidate);
								}
							}).addStyleClass("sapUiTinyMarginBottom")
						]
					//Use the style class from the Form layout to render colon after a label.
					}).addStyleClass("sapUiExportSettingsLabel")
				],
				endButton: new Button({
					id: sDialogId + "-cancel",
					text: oResourceBundle.getText("CANCEL_BUTTON"),
					press: function () {
						oExportSettingsDialog.close();
					}
				}),
				beginButton: new Button({
					id: sDialogId + "-export",
					text: oResourceBundle.getText("QUICK_EXPORT"),
					type:  sap.m.ButtonType.Emphasized,
					press: function () {
						if (oExportSettingsDialog) {
							oExportSettingsDialog._bSuccess = true;
							oExportSettingsDialog.close();
							fnResolve(oExportConfigModel.getData());
						}
					}
				}),
				afterClose: function () {
					if (!oExportSettingsDialog._bSuccess) {
						//Select Cancel after Close when Export button is not selected
						//because Close can also be triggered via ESC button on the keyboard.
						Log.warning("sap.gantt.simple.GanttChartWithTable ", "Cancel Click on Export to Excel PopOver", this);
						fnReject(null);
					}
					oExportSettingsDialog.destroy();
					oExportSettingsDialog = null;
				}
			});
			//Use the style class from the Form layout to render colon after a label.
			oExportSettingsDialog.addStyleClass("sapUiContentPadding sapUiExportSettings");
			oExportSettingsDialog.setModel(oExportConfigModel);
			oExportSettingsDialog.open();
			if (fnCallback) {
				fnCallback(oExportSettingsDialog);
			}

		});

	};

	//Function to create ColumnData from the CustomData
	GanttChartWithTable.prototype._createColumnConfig = function() {
		var aColumns, i, iLen, oColumn, oColumnData, sLabel, sPath, nWidth, sType, aSheetColumns = [], falseValue, trueValue, format;

		this._oTable = this.getTable();
		//Get all the columns of the Table.
		aColumns = this._oTable.getColumns();
		iLen = aColumns.length;

		for (i = 0; i < iLen; i++) {
			sPath = null;
			falseValue = null;
			trueValue = null;
			format = null;
			sType = null;
			oColumn = aColumns[i];

			if (oColumn.getVisible()) {
				oColumnData = oColumn.data("exportTableColumnConfig");//Get customData based on the constant key.

				if (!sPath && oColumnData) {
					sPath = oColumnData["leadingProperty"];
				}

				if (Array.isArray(sPath)) {
					sPath = sPath[0];
				}

				if (sPath) {
					sLabel = this._getColumnLabel(oColumn);//Function to return the label for a column.
					nWidth = oColumn.getWidth().toLowerCase() || oColumnData.width || "";
					nWidth = this._getColumnWidthNumber(nWidth); //Function to get the width of the column.

					//Checks to handle setting of sType.
					if (oColumnData.unitProperty) {
						sType = oColumnData.isCurrency ? sap.ui.export.EdmType.Currency : sap.ui.export.EdmType.Number;
					} else if (oColumnData.isDigitSequence) {
						sType = sap.ui.export.EdmType.Number;
					}
					if (!sType) {
						switch (oColumnData.dataType){
							case ExportTableCustomDataType.Numeric:  sType = sap.ui.export.EdmType.Number; break;
							case ExportTableCustomDataType.DateTime: sType = sap.ui.export.EdmType.DateTime; format = oColumnData.displayFormat; break;
							case ExportTableCustomDataType.StringDate:
							case ExportTableCustomDataType.Date: sType = sap.ui.export.EdmType.Date; format = oColumnData.displayFormat; break;
							case ExportTableCustomDataType.Boolean: sType = sap.ui.export.EdmType.Boolean; falseValue = "false"; trueValue = "true"; break;
							case ExportTableCustomDataType.String: sType = sap.ui.export.EdmType.String; break;
							case ExportTableCustomDataType.Time: sType = sap.ui.export.EdmType.Time; break;
							default: sType = sap.ui.export.EdmType.String; break;
						}
					}
					//Create column structure.
					aSheetColumns.push({
						columnId: oColumn.getId(),
						property: sPath,
						type: sType,
						format: format ? format : undefined,
						label: sLabel ? sLabel : sPath,
						width: nWidth,
						textAlign: oColumn.getHAlign(),
						trueValue: (sType === sap.ui.export.EdmType.Boolean && trueValue) ? trueValue : undefined,
						falseValue: (sType === sap.ui.export.EdmType.Boolean && falseValue) ? falseValue : undefined,
						unitProperty: (sType === sap.ui.export.EdmType.Currency || (sType === sap.ui.export.EdmType.Number)) ? oColumnData.unitProperty : undefined,
						displayUnit: sType === sap.ui.export.EdmType.Currency,
						unit: oColumnData.unit ? oColumnData.unit : undefined,
						precision: oColumnData.precision ? oColumnData.precision : undefined,
						scale: oColumnData.scale ? oColumnData.scale : undefined,
						wrap: oColumnData.wrap ? oColumnData.wrap : false
					});
				}
			}
		}

		return aSheetColumns;
	};

	//Function to get column label.
	GanttChartWithTable.prototype._getColumnLabel = function(oColumn) {
		var oLabel;

		if (!oColumn) {
			return null;
		}

		if (oColumn.getLabel) {
			oLabel = oColumn.getLabel();
		}

		if (oColumn.getHeader) {
			oLabel = oColumn.getHeader();
		}

		return (oLabel && oLabel.getText) ? oLabel.getText() : null;
	};

	//Funtion to return the column width as number
	GanttChartWithTable.prototype._getColumnWidthNumber = function(sWidth) {
		if (sWidth.indexOf("em") > 0) {
			return Math.round(parseFloat(sWidth));
		}
		if (sWidth.indexOf("px") > 0) {
			return Math.round(parseInt(sWidth) / 16);
		}
		return "";
	};

	//Function to create DataSource for JSON Model.
	GanttChartWithTable.prototype._createJSONDataSource = function(oTable){
		var aAttributeName, sPath, aData, aFinalArray = [];
		aAttributeName = oTable.getBinding(oTable._sAggregation).mParameters.arrayNames[0];
		sPath = oTable.getBinding().sPath;
		aData = oTable.getModel().getProperty(sPath);
		aFinalArray = this._generateJSONRowData(aData[aAttributeName],aAttributeName,aFinalArray);
		return aFinalArray;
	};

	//Function to generate data from JSON model recursively.
	GanttChartWithTable.prototype._generateJSONRowData = function(aData,aAttributeName,aFinalArray) {
		if (!aData) {
			return [];
		}
		if (!aFinalArray) {
			aFinalArray = [];
		}
		for ( var i = 0; i < aData.length; i++) {
			aFinalArray.push(aData[i]);
			if ( aData[i][aAttributeName] ) {
				this._generateJSONRowData(aData[i][aAttributeName],aAttributeName,aFinalArray);
			}
		}
		return aFinalArray;
	};

	/**
	 * Provides a custom row height based on the application logic.
	 * @param {object} oRowsCustomHeight A key-value pair of a row ID and its custom height.
	 * The key is the ID that is mapped to the rowID property of the rowSettings.
	 * The value is the custom height of the row.
	 *
	 * @public
	 * @since 1.88
	 */
	GanttChartWithTable.prototype.setRowsHeight = function (oRowsCustomHeight) {
		this.oRowsCustomHeight = oRowsCustomHeight;
		this.getTable().invalidate();
	};

	/**
	 * Returns a list of shape UIDs containing a given set of properties.
	 * @param {object} oFilter A key-value pair of a shape property, for example, title: {string} or shapeId: {string}.
	 * @returns {array} Returns a list of shape UIDs containing a given set of properties.
	 *
	 * @since 1.89
	 * @public
	*/

	GanttChartWithTable.prototype.getShapeUids = function (oFilter) {
		var aAllShapes = [],
			aShapeUids = [];
		var aRows = this.getTable().getRows();
		//loop through the visible rows to get the shapes that are a match
		for (var iIndex = 0; iIndex < aRows.length; iIndex++) {
			var oRowSettings = aRows[iIndex].getAggregation("_settings");
			aAllShapes = aAllShapes.concat(this._getAllMatchedShapeInRow(oRowSettings, [], oFilter));
		}
		//loop through the matched shapes in the visible area to get the shapeUid
		aAllShapes.forEach(function(oShape){
			if (oShape.getShapeUid()) {
				aShapeUids.push(oShape.getShapeUid());
			}
		});
		aShapeUids = Array.from(new Set(aShapeUids));
		return aShapeUids;
	};

	/**
	 * Returns all the shapes in a row with the given properties.
	 * @param {object} oElement Row Instance
	 * @param {array} aShapesInRow List of all the shapes in a given element.
	 * @param {object} oFilter A key-value pair of shape property and its value.
	 * @returns {array} Returns a list of shapes containing a given set of properties.
	 *
	 * @private
	*/

	GanttChartWithTable.prototype._getAllMatchedShapeInRow = function(oElement, aShapesInRow, oFilter){
		var oMetadata = oElement.getMetadata(),
			mAggregations = oMetadata.getAllAggregations(),
			bFlag = false;
		// Loop through the aggregations list of the element to look for the matching shapes
		Object.keys(mAggregations).forEach(function(sName){ // eslint-disable-line
			if (sName === "calendars") {
				return;
			}
			var aAggregations = oElement.getAggregation(sName);
			if (aAggregations){
				aAggregations = jQuery.isArray(aAggregations) ? aAggregations : [aAggregations];
				if (aAggregations.length > 0) {
					aAggregations.forEach(function(oShape){
						if (oShape instanceof sap.gantt.simple.BaseConditionalShape) {
							oShape = oShape._getActiveShapeElement();
							if (oShape instanceof sap.gantt.simple.BaseGroup) {
								//when oShape is BaseConditional and active shpae is a BaseGroup
								bFlag = this._checkBaseGroup(oShape, "shapes", oFilter);
								if (bFlag && oShape.getShapeUid()) {
									aShapesInRow = aShapesInRow.concat(oShape);
								}
							} else if (this._isShapeMatched(oShape, oFilter) && oShape.getShapeUid()){
								//when oShape is BaseConditional and active shape is a simple BaseShape
								aShapesInRow = aShapesInRow.concat(oShape);
							}
						} else if (oShape instanceof sap.gantt.simple.MultiActivityGroup) {
							//when oShape is MultiActivityGroup
							var bRowExpanded = this._oExpandModel.isRowExpanded(oShape.getParent().getRowUid());
							bFlag = this._checkBaseGroup(oShape, "task", oFilter);
							if (bFlag && oShape.getShapeUid()) {
								//avoid main task if row is expanded and showParentRowOnExpand is false
								if (!(bRowExpanded && !(this.getShowParentRowOnExpand() && !this.getUseParentShapeOnExpand()))) {
										aShapesInRow = aShapesInRow.concat(oShape);
								}
							}
							//if the row is expanded loop through the subtasks also
							if (bRowExpanded) {
								aShapesInRow = aShapesInRow.concat(this._getAllMatchedShapeInRow(oShape, [], oFilter));
							}
						} else if (oShape instanceof sap.gantt.simple.BaseGroup) {
							//when oShape is a BaseGroup
							bFlag = this._checkBaseGroup(oShape, "shapes", oFilter);
							if (bFlag && oShape.getShapeUid()) {
								aShapesInRow = aShapesInRow.concat(oShape);
							}
						} else if (this._isShapeMatched(oShape, oFilter) && oShape.getShapeUid()){
							//when oShape is a simple BaseShape
							aShapesInRow = aShapesInRow.concat(oShape);
						}
					}.bind(this));
				}
			}
		}.bind(this));
		return aShapesInRow;
	};

	/**
	 * Checks whether basegroup or shapes within it contains given properties or not
	 * @param {sap.gantt.simple.BaseGroup} oGroup An instance of BaseGroup
	 * @param {string} sAggregationName Basegroup shapes aggregation name
	 * @param {object} oFilter A key-value pair of a shape property and its value
	 * @returns {boolean} Returns a boolean value indicating this basegroup shape is a match or not
	 *
	 * @private
	*/

	GanttChartWithTable.prototype._checkBaseGroup = function(oGroup, sAggregationName, oFilter) {
		var bFlag = false;
		//check if basegroup shape is a match
		if (this._isShapeMatched(oGroup, oFilter) && oGroup.getShapeUid()) {
			bFlag = true;
			return bFlag;
		}
		var aAggregations = oGroup.getAggregation(sAggregationName);
		aAggregations = jQuery.isArray(aAggregations) ? aAggregations : [aAggregations];
		aAggregations.forEach(function(oShape){
			if (oShape instanceof sap.gantt.simple.BaseGroup) {
				//if oShape is a BaseGroup
				bFlag = this._checkBaseGroup(oShape, "shapes", oFilter);
			} else if (this._isShapeMatched(oShape, oFilter)) {
				//if oShape is a simple BaseShape
				bFlag = true;
				return bFlag;
			}
		}.bind(this));
		return bFlag;
	};

	/**
	 * Checks whether the given shape contains given properties or not
	 * @param {sap.gantt.simple.BaseShape} oShape An instance of baseshape
	 * @param {object} oFilter A key-value pair of a shape property and its value.
	 * @returns {boolean} Returns a boolean value indicating the shape is a match or not
	 *
	 * @private
	*/

	GanttChartWithTable.prototype._isShapeMatched = function(oShape, oFilter) {
		if (oFilter && (oShape instanceof sap.gantt.simple.BaseShape)) {
			var bFlag = true;
			for (var property in oFilter) {
				var oShapeMetaData = oShape.getMetadata(),
					oAllProperties = oShapeMetaData.getAllProperties();
				if (oAllProperties && oAllProperties.hasOwnProperty(property) && bFlag) {
					var sOriginalValue = oShape.getProperty(property);
					if (sOriginalValue instanceof Date) {
						sOriginalValue = sOriginalValue.getTime();
						if (oFilter[property] instanceof Date) {
							oFilter[property] = oFilter[property].getTime();
						}
					} else if (typeof (sOriginalValue) === "string") {
						sOriginalValue = sOriginalValue.toLowerCase();
						oFilter[property] = oFilter[property].toLowerCase();
					}
					// check if the given property and oShape property are a match
					if (typeof (sOriginalValue) === "object") {
						bFlag = deepEqual(sOriginalValue,oFilter[property]);
					} else if (sOriginalValue !== oFilter[property]) {
						bFlag = false;
					}
				} else {
					bFlag = false;
				}
			}
			return bFlag;
		} else {
			return false;
		}
	};

	/**
	 * Returns the gantt chart overflow toolbar instance.
	 * @returns {sap.m.OverflowToolbar}
	 *
	 * @since 1.92
	 * @public
	*/

	GanttChartWithTable.prototype.getChartOverflowToolbar = function () {
		var oOverflowToolbar;
		if (this.getEnableChartOverflowToolbar()) {
			oOverflowToolbar = Element.getElementById(this.getId() + "-ganttHeaderOverflowToolbar");
		}
		return oOverflowToolbar;
	};

	/**
	 * Bind rows of the table aggregtion with given parameters
	 * Also, create the promise to wait for inner gantt rendering
	 * @param {object} mParameters Table Rebind parameters
	 * Example:
	 * <pre>
	 * 	<code>
	 * 		rebindTableRows({
	 * 			path: "pathToMyTableEntity",
	 *			filters: filters, //"filters" refer to the list all filters that need to be passed to filter my data
	 *			sorter: sorters, //"sorters" refer to the list all sorters that need to be passed to sort my data
	 *			parameters: params // "params" any additional parameters to be passed like select / expand / tree binding parameters
	 *		})
	 * 	</code>
	 * </pre>
	 *
	 * @since 1.99
	 * @public
	*/

	GanttChartWithTable.prototype.rebindTableRows = function (mParameters) {
		this._createInnerGanttRenderPromise();
		var oTable = this.getTable();
		oTable.bindRows(mParameters);
		if (this.getHorizontalLazyLoadingEnabled()) {
			//This is to avoid the updating of existing shapes
			//Table stores the rows and reuses them when the data comes back by updating the bindings. This ensures they don't have to re-create and re-draw the rows again
			//Since shapes have to be redrawn anyways, this improvement of retaining rows is actually an overhead as updating the bindings take time and then they have to be redrawn
			oTable.destroyAggregation("rows", true);
		}
		if (this.getEnablePseudoShapes()){
			this._tableDataUpdated = true;
		}
	};

	/**
	 * Call for 'setRowSettingsTemplate' method of table is made with invalidate
	 * Also, create the promise to wait for inner gantt rendering
	 * @param {object} oRowSettings Table RowSettings template
	 * @since 1.105
	 * @public
	 */
	GanttChartWithTable.prototype.setRowSettingsTempWithInvalid = function (oRowSettings) {
		this._createInnerGanttRenderPromise();
		this.getTable().invalidate();
		var oTable = this.getTable();
		if (this.getEnablePseudoShapes()){
			this._tableDataUpdated = true;
		}
		oTable.setRowSettingsTemplate(oRowSettings);
	};

	/**
	 * create the Inner Gantt renderer promise.
	*/

	GanttChartWithTable.prototype._createInnerGanttRenderPromise = function (mParameters) {
		if (!this._oInnerGanttRenderPromise || (this._oInnerGanttRenderPromise && this._bInnerGanttRenderPromiseResolved)) {
			this._bInnerGanttRenderPromiseResolved = false;
			this._oInnerGanttRenderPromise = new Promise( function(resolve) {
				this._oInnerGanttRenderPromiseResolve = resolve;
			}.bind(this));
			return true;
		}
		return false;
	};

	GanttChartWithTable.prototype.toggleDnDRowHighlight = function (bToggleOn) {
		var oDragDropExtension = this._getDragDropExtension();
		var oSvgDom = document.getElementById(this.getId() + "-svg"),
		aBgRowRects = oSvgDom.querySelectorAll("rect.sapGanttBackgroundSVGRow");
		if (oDragDropExtension.oLastDraggedShapeData && oDragDropExtension.oLastDraggedShapeData._highlightedRowIndex) {
			oDragDropExtension.oLastDraggedShapeData._highlightedRowIndex.forEach(function(index) {
				aBgRowRects[index].classList.toggle("sapGanttBackgroundSVGRowHighlighted", bToggleOn);
				if (this.getRowHighlightFill()) {
					aBgRowRects[index].style.setProperty('--sapGanttBackgroundSVGRowHighlighted-fill', this.getRowHighlightFill());
				}
				if (this.getRowHighlightAndHoverFill()) {
					aBgRowRects[index].style.setProperty('--sapGanttBackgroundSVGRowHighlighted-sapGanttBackgroundSVGRowHovered-fill', this.getRowHighlightAndHoverFill());
				}
			}.bind(this));
		}
	};

	GanttChartWithTable.prototype.fireDragStart = function (oEventData) {
		var oDragDropExtension = this._getDragDropExtension();
		if (oDragDropExtension._bEnableRowHighlight) {
			this.toggleDnDRowHighlight(true);
		}
		this.fireEvent("dragStart", oEventData);
	};

	GanttChartWithTable.prototype.triggerShapeDrop = function (oEventData) {
		var oDragDropExtension = this._getDragDropExtension();
		if (oDragDropExtension._bEnableRowHighlight) {
			this.toggleDnDRowHighlight(false);
		}
		if (oEventData.dragged) {
			this.fireEvent("shapeDrop", oEventData);
		}
	};

	/**
	 * Handle DND cancelled drop event
	 * @private
	*/
	GanttChartWithTable.prototype._triggerCancelShapeDrop = function () {
		var oDragDropExtension = this._getDragDropExtension();
		if (oDragDropExtension._bEnableRowHighlight) {
			this.toggleDnDRowHighlight(false);
		}
	};

	/**
	 * Get the parent container if GanttChart is an aggregation of GanttChartContainer
	 * @return {sap.gantt.simple.GanttChartContainer} The parent container of the gantt chart if present
	 * @private
	*/
	GanttChartWithTable.prototype.getParentGanttChartContainer = function () {
		var oParent = this.getParent();
		if (oParent instanceof sap.gantt.simple.GanttChartContainer) {
			return oParent;
		}
		return undefined;
	};

	/**
	 * Application should call this method passing the promise that is resolved when data for the whole total horizon is fetched.
	 * This Promise can be resolved by the application after fetching the complete data on user interactions like  zoom out to level 0 or bird's eye view.
	 * @param {object} oAllDataLoadedPromise Promise which is resolved by the application when the complete data is fetched
	 * @private
	 */
	GanttChartWithTable.prototype.setAllDataLoadedPromise = function (oAllDataLoadedPromise) {
		if (this.getHorizontalLazyLoadingEnabled()) {
			var oParentContainer = this.getParentGanttChartContainer();
			if (oParentContainer) {
				this._isAllDataLoadedPromiseResolved = false;
				oParentContainer._mGanttChartAllDataLoadedPromise.set(this.getId(), oAllDataLoadedPromise);
				oAllDataLoadedPromise.then(function(){
					this._isAllDataLoadedPromiseResolved = true;
				}.bind(this));
			}
		} else {
			Log.Error("This method should be called only if the Gantt chart is horizontally lazy loaded");
		}
	};

	/**
	 * sync the row expand state with the row settings
	 * @param {number} vRowIndex  row indices
	 * @param {boolean} bExpanded whether is to expand or not
	 * @param {boolean} bPseudoShapeExpand whether pseudo shape is enabled or not
	 * @private
	 */
	GanttChartWithTable.prototype._syncRowExpandState = function(vRowIndex, bExpanded, bPseudoShapeExpand) {
		var aRows = this.getTable().getRows(), aRowIndices = [];

		if (typeof vRowIndex === "number") {
			aRowIndices = [vRowIndex];
		} else if (Array.isArray(vRowIndex)) {
			aRowIndices = vRowIndex;
		}

		const iStartIndex = aRows[0].getIndex();

		for (const iIndex of aRowIndices) {
			var oRow = aRows[iIndex - iStartIndex];
			var oRowSettings = oRow && oRow.getAggregation("_settings");

			if (oRowSettings) {
				oRowSettings._onRowExpandToggle({
					expanded: bExpanded,
					pseudoShapeExpand: bPseudoShapeExpand
				});
			}
		}
	};

	/**
	 * Checks if lazy loading is enabled for time synced chart
	 * @returns {boolean} true if lazy loading is enabled for any chart in the container with timeScrollSync enabled
	 * @private
	 */
	GanttChartWithTable.prototype._isLazyLoadingEnabledForSyncedChart = function () {
		var oGanttContainer = this.getParentGanttChartContainer();
		var bLazyLoadingEnabled = false;
		if (oGanttContainer && oGanttContainer.getGanttCharts().length > 1 && oGanttContainer.getEnableTimeScrollSync()) {
			oGanttContainer.getGanttCharts().forEach(function(oGanttChart) {
				if (oGanttChart.getHorizontalLazyLoadingEnabled()) {
					bLazyLoadingEnabled = true;
				}
			});
		}
		return bLazyLoadingEnabled;
	};

	return GanttChartWithTable;

}, true);
