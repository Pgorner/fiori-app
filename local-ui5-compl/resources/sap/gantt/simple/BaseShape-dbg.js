/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/base/Log",
	"sap/ui/Device",
	"sap/gantt/library",
	"sap/ui/core/Element",
	"sap/ui/core/CustomStyleClassSupport",
	"sap/ui/base/ManagedObjectMetadata",
	"./GanttUtils",
	"./CoordinateUtils",
	"./AggregationUtils",
	"../misc/Format",
	"sap/ui/core/date/UI5Date",
	"sap/gantt/utils/GanttChartConfigurationUtils",
	"sap/ui/core/Theming",
	"sap/gantt/misc/Utility"
], function (
	Log,
	Device,
	library,
	Element,
	CustomStyleClassSupport,
	ManagedObjectMetadata,
	GanttUtils,
	CoordinateUtils,
	AggregationUtils,
	Format,
	UI5Date,
	GanttChartConfigurationUtils,
	Theming,
	Utility
) {
	"use strict";

	var verticalTextAlignment = library.simple.verticalTextAlignment;
	var horizontalTextAlignment = library.simple.horizontalTextAlignment;
	var ShapeAlignment = library.simple.shapes.ShapeAlignment;
	// var TextDirection = coreLibrary.TextDirection;
	/**
	 * Creates and initializes a new Shape class
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * BaseShape is an abstract class. All other shapes must extend this class and provide implementation of method renderElement.
	 * It enables application developers to define it's own shapes.
	 *
	 * This class provides the common used properties and methods.
	 *
	 *
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 *
	 * @abstract
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.BaseShape
	 */
	var BaseShape = Element.extend("sap.gantt.simple.BaseShape", /** @lends sap.gantt.simple.BaseShape.prototype */ {
		metadata: {
			library: "sap.gantt",
			"abstract": true,

			properties: {

				/**
				 * ID of the shape.
				 * shapeId property represents a unique identifier for a business object.
				 * This property shall be bound to a property during initialization, it requires an unique non-empty value.
				 */
				shapeId: {type: "string"},

				/**
				 * Start time of the shape. This property is mandatory. You must bind this property to a model, or set a valid JavaScript Date object.
				 * The value will be converted to x coordination when rendering.
				 * If not set, the shape is not visible.
				 */
				time: {type: "object"},

				/**
				 * End time of the shape. This property is mandatory if the shape is a duration shape. You must bind this property to a model, or set a valid JavaScript Date object.
				 * The duration is determined by minusing the value of property <code>time</code>
				 */
				endTime: {type: "object"},

				/**
				 * Scheme key of the shape.
				 *
				 * The scheme is used by expand/collapse the main row shape. You can define the scheme together with <code>shapeSchemes</code> in <code>sap.gantt.simple.GanttChartWithTable</code>, the value
				 * defines here needse matchs the key value defines in <code>sap.gantt.simple.ShapeScheme</code>
				 */
				scheme: {type: "string", defaultValue: null},

				/**
				 * X offset in pixel. If the value is positive, in non-RTL mode, means to translate the visual object to the right in pixel unit.
				 * If the value is negative, the logic is inverted.
				 */
				xBias: {type: "float", defaultValue: 0},

				/**
				 * Y offset in pixel. If the value is positive, in non-RTL mode, it means translate the visual object to the bottom in pixel unit.
				 * If the value is negative, the logic is inverted.
				 */
				yBias: {type: "float", defaultValue: 0},

				/**
				 * The fill property enables you to define the fill color for shapes and texts.
				 *
				 * For shapes and text the fill property is a presentation attribute that lets define the color (or any SVG paint servers like gradients or patterns)
				 */
				fill: {type : "sap.gantt.ValueSVGPaintServer"},

				/**
				 * stroke opacity of the shape
				 */
				strokeOpacity: {type: "float", defaultValue: 1.0},

				/**
				 * The fillOpacity property is a presentation property defining the opacity of the paint server (color, gradient, pattern, etc) applied to a shape.
				 */
				fillOpacity: {type: "float", defaultValue: 1.0},

				/**
				 * The opacity attribute specifies the transparency of an object or of a group of objects, that is,
				 * the degree to which the background behind the element is overlaid.
				 *
				 * The minimum value is 0.0 and maximum value is 1.0
				 */
				opacity: {type: "float", defaultValue: 1.0},

				/**
				 * The stroke property is a presentation property defining the color (or any SVG paint servers like gradients or patterns) used to paint the outline of the shape;
				 */
				stroke: {type : "sap.gantt.ValueSVGPaintServer"},

				/**
				 * The strokeWidth property is a presentation property defining the width of the stroke to be applied to the shape.
				 */
				strokeWidth: {type: "float", defaultValue: 0},

				/**
				 * The strokeDasharray property is a presentation property defining the pattern of dashes and gaps used to paint the outline of the shape.
				 */
				strokeDasharray: {type: "string"},

				/**
				 * The transform property defines a list of transform definitions that are applied to an element and the element's children
				 * Right now in gantt library, only <code>translate()</code> method is supported. CSS methods like scale, skew, rotate and matrix doesn't support.
				 * And if you provide values for transform, the values will update xBias and yBias if translate the corresponding axis is matched.
				 */
				transform: {type: "string"},

				/**
				 * The filter property defines the filter effects defined by the <filter> element that shall be applied to its element
				 */
				filter: {type: "string"},

				/**
				 * Whether the shape is expandable
				 */
				expandable: {type: "boolean", defaultValue: false},

				/**
				 * Whether the shape is selectable
				 */
				selectable: {type: "boolean", defaultValue: false},

				/**
				 * Whether the shape is selected
				 */
				selected: {type: "boolean", defaultValue: false},

				/**
				 * Specifies whether the shape is draggable
				 * a draggble shape requires the shape is selectable set true as well.
				 */
				draggable: {type: "boolean", defaultValue: false},

				/**
				 * Specifies whether the shape is resizable.
				 * Resizing a shape requires the shape is selectable as well.
				 * @see setSelectable
				 */
				resizable: {type: "boolean", defaultValue: false},

				/**
				 * Specifies whether the shape is hoverable.
				 * hovering the mouse pointer over the shape fires the shapeMouseEnter event and moving the mouse pointer out of the shape fires the shapeMouseLeave event.
				 */
				hoverable: {type: "boolean", defaultValue: false},

				/**
				 * Specifies whether the shape is connectable.
				 * When this property is set to true, you can connect two different shapes to create a relationship
				 */
				connectable: {type: "boolean", defaultValue: false},

				/**
				 * rowYCenter of the shape
				 */
				rowYCenter: {type: "float"},

				/**
				 * Specifies whether or not the system takes this shape into account when performing a bird eye zooming.
				 * We suggest that you set this property to true only for shapes that really need to be considered into bird eye range.
				 */
				countInBirdEye: {type: "boolean", defaultValue: false},

				// child element is used to decide whether write element data to DOM
				childElement: {type: "boolean", defaultValue: false, visibility: "hidden"},

				// special property for unique appearence
				shapeUid: {type: "string", visibility: "hidden"},

				/**
				 * Shows or hides the shape.
				 */
				visible: {type: "boolean", defaultValue: true},

				/**
				* The title of the Shape.
				*/
				title : {type: "string", group: "Appearance", defaultValue: null},

				/**
				* Flag to show or hide the title of the Shape.
				*/
				showTitle : {type : "boolean", group : "Appearance", defaultValue : true},

				/** Enables selection of all shapes that are part of a shape chain in a Gantt chart
				 * @since 1.86
				 */
				enableChainSelection: {type: "boolean", defaultValue: false},

				/**
				 * Enables selection of a shape when it is part of the shape chain. By default, this property is set as True.
				 * @since 1.86
				 */
				selectableInChainSelection: {type : "boolean", defaultValue : true},
				/**
				* Vertical alignment for the title of the Shape.
				* @since 1.86
				*/
				verticalTextAlignment: {type: "sap.gantt.simple.verticalTextAlignment", defaultValue : verticalTextAlignment.Center},

				/**
				* Horizontal alignment for the title of the Shape.
				* @since 1.86
				*/
				horizontalTextAlignment: {type: "sap.gantt.simple.horizontalTextAlignment", defaultValue: horizontalTextAlignment.Start},

				/**
				* <code>animationSettings</code> - A JSON object used to apply animation to the color of the specified shape.
				* <ul>
				*	<li><code>"values": null</code> - A list of values defining the sequence of colors appearing during animation.</li>
				*	<li><code>"duration": "1s"</code> - Denotes the duration of the animation. The value must be greater than 0, and can be expressed in hours(h), minutes(m), seconds(s), or milliseconds(ms).</li>
				*	<li><code>"repeatCount": "indefinite"</code> - Denotes the number of times an animation repeats.</li>
				* </ul>
				* Restriction: Enter at least two colors in the values key for the animation to work.
				* If duration and repeatCount are unspecified, the default values (duration '1s' and repeatCount 'indefinite') are set.
				* <b>Note:</b> This is only applicable for animation of shapes in Gantt charts. This is not applicable for utilization charts.
				* <i>Refer to an example below:</i>
				* <pre><code>
				* {
				*	  "values": "#800;#f00;#800;#800",
				*	  "duration": "1s",
				*	  "repeatCount": "indefinite"
				* }
				* </code></pre>
				* @since 1.88
				*/
				animationSettings: {type: "object", defaultValue: null},

				/**
				* Flag to show or hide animation of an active shape.
				* @since 1.88
				*/
				showAnimation : {type : "boolean", defaultValue : false},
				/**
				 * The titleColor property defines the color (or any SVG paint servers like gradients or patterns) of the shape title;
				 * @since 1.90
				 */

				titleColor: { type: "sap.gantt.ValueSVGPaintServer"},

				/**
				 * The fontSize property refers to the size of the font
				 * @since 1.100
				 */
				fontSize: {type: "int", defaultValue: 13},

				/**
				 * The fontWeight property refers to the font weight that gets used to render the text in the shape.
				 * @since 1.100
				 */
				fontWeight: {type: "string", defaultValue: "normal"},

				/**
				 * Enables alignment of the shape. The shape can be aligned to the top, middle or bottom. By default, this property is set to Middle.
				 * <b>Note:</b> Alignment is not possible for BaseLine and BasePath. It will be set to BaseChevron, BaseRectangle, BaseCursor
				 * BaseDiamond, BaseText, BaseTriangle and BaseGroup.
				 */
				alignShape: {type: "sap.gantt.simple.shapes.ShapeAlignment", defaultValue: ShapeAlignment.Middle},
				/**
				 * This property indicates the font family that gets used to render the text in the shape.
				 * @since 1.94
				 */
				fontFamily: {type: "string", defaultValue: "Arial"},

				/**
				 * The titleSpacing property defines the space between the start of the shape and the shape title in pixels
				 * @since 1.96
				*/
				titleSpacing: {type: "int", defaultValue: 0},

				/**
				 * The selectedFill property defines the color (or any SVG paint servers like gradients or patterns) of the shape when it is selected.
				 * @since 1.99
				 */
				selectedFill: {type : "sap.gantt.ValueSVGPaintServer"},

				/**
				 * The selectedTitleColor property defines the color (or any SVG paint servers like gradients or patterns) of the shape's title when it is selected.
				 * @since 1.99
				 */
				selectedTitleColor: {type : "sap.gantt.ValueSVGPaintServer"},
				/** Whether the shape is highlightable
				 * @since 1.100
				 */
				highlightable: { type: "boolean", defaultValue: false },

				/** Whether the shape is highlighted
				 * @since 1.100
				 */
				highlighted: {type: "boolean", defaultValue: false},

				/** Comma-separated value of row IDs for the rows that are highlighted when the shape is being dragged.
				 * The highlighted rows are the ones where the shape drop is allowed.
				 * @since 1.108
				 */
				dragHighlightRows: {type: "string[]", defaultValue: []},
				/**
				 * Provides the style class name for the shape that can be mapped from shapeStyles aggregation in GanttChartWithTable or GanttChartContainer.
				 * @since 1.130
				 * */
				styleName: {type: "string", defaultValue: null},

				/** Postion of left anchor for a shape to connect with other shapes whose value ranges from 0-100
				 * @since 1.131
				 */
				leftAnchorPosition: { type: "int", defaultValue: 50 },

				/** Postion of right anchor for a shape to connect with other shapes whose value ranges from 0-100
				 * @since 1.131
				 */
				rightAnchorPosition: { type: "int", defaultValue: 50 }
			},
			designtime: "sap/ui/dt/designtime/notAdaptable.designtime"
		},
		renderer: {
			apiVersion: 2    // enable in-place DOM patching
		}
	});

	// default animation settings for the shape
	var mDefaultAnimationSettings = {
		values: null,
		duration: "1s",
		repeatCount: "indefinite"
	};

	CustomStyleClassSupport.apply(BaseShape.prototype);

	BaseShape.prototype.init = function () {
		// used to distinguish single/double click
		this.bPreventSingleClick = false;
		// Used to store the calculated level for a shape, if necessary
		this._level = null;
	};

	// used to cache LESS parameter colors
	var mValueColors = {};

	// theme change need reset colors
	Theming.attachApplied(function() {
		mValueColors = {};
	});

	/*
	 * Regular expression for extracting shape coordinate translate values
	 * The value will overwritten the xBias and yBias property values
	 */
	var RE_TRANSFORM = /translate\((-?\d{1,}),?\s?(-?\d{1,})?\)/gi;

	BaseShape.prototype.setShapeUid = function(sUid) {
		Log.error("The control manages the shapeUid generation. The method \"setShapeUid\" cannot be used programmatically!", this);
	};

	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	BaseShape.prototype.getTransform = function () {
		var sTransform = this.getProperty("transform");
		if (sTransform) {
			// respect the use defined transform value first
			return sTransform;
		}
		return this._buildTransformByXYBias();
	};

	BaseShape.prototype.setLeftAnchorPosition = function (iPosition, bSuppressInvalidate) {
		iPosition = Math.max(0, Math.min(iPosition, 100));
		this.setProperty("leftAnchorPosition", iPosition, bSuppressInvalidate);
	};

	BaseShape.prototype.setRightAnchorPosition = function (iPosition, bSuppressInvalidate) {
		iPosition = Math.max(0, Math.min(iPosition, 100));
		this.setProperty("rightAnchorPosition", iPosition, bSuppressInvalidate);
	};

	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	BaseShape.prototype.setTransform = function(sValue) {
		this.setProperty("transform", sValue);
		this._updateBiasFromTransform(sValue);
		return this;
	};

	/**
	 * Construct the value for svg attribute <code> transform </code>. This method leverages the properties xBias and yBias
	 *
	 * @returns {string} the translate command by x/y bias.
	 * @private
	 */
	BaseShape.prototype._buildTransformByXYBias = function () {
		var nXBias = this.getXBias(),
			nYBias = this.getYBias();

		if (nXBias || nYBias) {
			nXBias = nXBias ? nXBias : 0;
			// reverse the bias on RTL mode
			nXBias = GanttChartConfigurationUtils.getRTL() ? -nXBias : nXBias;
			nYBias = nYBias ? nYBias : 0;
			return "translate(" + nXBias + " " + nYBias + ")";
		}
		return null;
	};

	BaseShape.prototype._updateBiasFromTransform = function(sTransform){
		if (sTransform != null) {
			var aBias = this._parseBias(sTransform);
			if (aBias.length > 0) {
				var iNewBiasX = aBias[0] || 0,
					iNewBiasY = aBias[1] || 0;
				this.setProperty("xBias", iNewBiasX, true);
				this.setProperty("yBias", iNewBiasY, true);
			}
		}
	};

	BaseShape.prototype._parseBias = function(sTransform) {
		var aMatches = RE_TRANSFORM.exec(sTransform);
		var aBias = [];
		if (aMatches && aMatches.length > 0) {
			aMatches.forEach(function(vMatch, iIndex){
				if (iIndex !== 0 && vMatch) {
					// the frist match is the full string
					aBias.push(parseFloat(vMatch));
				}
			});
		}
		return aBias;
	};

	/**
	 * Get the shape style string
	 *
	 * @return {string} shape styles
	 * @protected
	 */
	BaseShape.prototype.getStyle = function() {
		var oStyles = {
			"stroke": this.determineValueColor(this.getStroke()),
			"stroke-width": this.getStrokeWidth()
		};

		// selectable, hoverable any of property is true mean the shape is interactive
		var bInteractive = this.getSelectable() || this.getHoverable() || this.getTooltip() !== null;
		if (this.getProperty("childElement") === false && bInteractive === false) {
			// set the shape is none interactive on the outer shape
			oStyles["pointer-events"] = "none";
		}
		return this.getInlineStyle(oStyles);
	};

	/**
	 * Convert Date to x coordinate position based on the zoom strategy setup in GanttChart
	 *
	 * @private
	 * @param {Date|string} vTime datetime object or timestamp string representive
	 * @returns {float} x position
	 */
	BaseShape.prototype.getXByTime = function(vTime) {
		var oAxisTime = this.getAxisTime();

		var nTimeX = oAxisTime && oAxisTime.timeToView(Format.abapTimestampToDate(vTime));
		if (!Utility.isNumeric(nTimeX)) {
			Log.warning("Cannot convert time:" + vTime + " to an valid coordinate. Invalid coordinate might not get rendered at all, check the property value!");
			return 0;
		}
		return nTimeX;
	};

	/**
	 * Get an instance of AxisTime which belongs to current GanttChart.
	 * This is a shortcut method for all shape instances to convert timestamp to coordinates or vise verse
	 *
	 * @see sap.gantt.misc.AxisTime#timeToView
	 * @see sap.gantt.misc.AxisTime#viewToTime
	 *
	 * @return {object} the AxisTime instance
	 * @public
	 */
	BaseShape.prototype.getAxisTime = function() {
		if (this.mAxisTime) {
			// traverse the inherit hierarchy to lookup the AxisTime is expensive.
			// So internally we set a private mAxisTime before rendering for the sake of performance
			return this.mAxisTime;
		} else {
			var oGantt = this.getGanttChartBase();
			return oGantt ? oGantt.getAxisTime() : null;
		}
	};

	/**
	 * Try to traverse the aggregation parents to find Gantt instance.
	 *
	 * @private
	 * @returns {sap.gantt.simple.GanttChartWithTable} GanttChartWithTable instance or null if not found.
	 */
	BaseShape.prototype.getGanttChartBase = function() {
		var oRowSettings = this.getParentRowSettings();
		return oRowSettings ? oRowSettings.getParentGantt() : null;
	};

	/**
	 * Try to find the parent Row instance.
	 *
	 * @private
	 * @returns {sap.ui.table.Row} Row instance or null if shape not bound to Row
	 */
	BaseShape.prototype.getParentRowSettings = function() {
		return AggregationUtils.getParentControlOf("sap.gantt.simple.GanttRowSettings", this);
	};

	/**
	 * Get Inline style string. Convert style object to string and remove invalid values.
	 *
	 * @param {object} oStyles an object with style attribute and value
	 * @return {string} inline style
	 * @private
	 */
	BaseShape.prototype.getInlineStyle = function(oStyles) {
		return Object.keys(oStyles).reduce(function(initial, attr){
			if (oStyles[attr] !== undefined && oStyles[attr] !== null && oStyles[attr] !== "") {
				initial += (attr + ":" + oStyles[attr] + "; ");
			}
			return initial;
		}, "");
	};

	/**
	 * Determine the actual value color of the less parameter.
	 *
	 * @param {string} sParameter LESS parameter "@sapUiChartSequence1" for instance
	 * @return {string} real color hex or color name
	 * @private
	 */
	BaseShape.prototype.determineValueColor = function(sParameter) {
		var sFoundColor = mValueColors[sParameter];
		if (!sFoundColor && sParameter) {
			// if attribute has value but no paint server value
			sFoundColor = library.ValueSVGPaintServer.normalize(sParameter);
			mValueColors[sParameter] = sFoundColor;
		}
		return sFoundColor;
	};

	BaseShape.prototype.destroy = function() {
		return Element.prototype.destroy.apply(this, ["KeepDom"]);
	};

	/**
	 * Determine whether the shape is visible or not based on the current zoom level and rate
	 *
	 * It's used for Row to decide whether render the shape in DOM hierarchy.
	 * Performance wise consideration
	 * @returns {boolean} ture visible
	 */
	BaseShape.prototype.isVisible = function() {
		// TODO : Check for refactoring as this method is not used to differentiate and create an alternative flow.
		return false;
	};

	/**
	 * Render the shape. Write the shape DOM into render manager buffer.
	 *
	 * All customized shape need to overwrite this method to provide it's own rendering logic
	 *
	 * @protected
	 *
	 * @param {sap.ui.core.RenderManager} oRm Render Manager
	 * @param {sap.gantt.simple.BaseShape} oElement Shape instance
	 */
	BaseShape.prototype.renderElement = function(oRm, oElement) {};

	/**
	 * If a group shape has child aggregation, only the grouped shape shall have sap-ui and sap-ui-id
	 * attribute at the SVG DOM element, thus when initializing the group shape, all child aggregation
	 * instance has a hidden property <code>childElement</code>, if it's true, skip write sap-ui-* attributes into the DOM.
	 *
	 * @private
	 * @param {sap.ui.core.RenderManager} oRm RenderManager
	 * @param {sap.gantt.simple.BaseShape} sElement Shape
	 */
	BaseShape.prototype.writeElementData = function(oRm, sElement, bAddSelectionClass) {
		// children element shouldn't have sap-ui attribute
		if (this.getProperty("childElement")) {
			var bGeneratedId = ManagedObjectMetadata.isGeneratedId(this.getId());
			if (!bGeneratedId || this.getStyleName()) {
				// but if it's provide an user-defind Id, then write it to DOM
				oRm.openStart(sElement, this.getId());
			} else {
				oRm.openStart(sElement);
			}
			if (bAddSelectionClass){
				oRm.class("baseShapeSelection");
			}
			return;
		}

		if (this._shallWriteElementData(this)) {
			oRm.openStart(sElement, this);
			if (this.getShapeId()) {
				oRm.attr(GanttUtils.SHAPE_ID_DATASET_KEY, this.getShapeId());
			}

			if (this.getConnectable()) {
				oRm.attr(GanttUtils.CONNECTABLE_DATASET_KEY, this.getConnectable());
			}
		} else {
			oRm.openStart(sElement);
		}
		if (bAddSelectionClass){
			oRm.class("baseShapeSelection");
		}
	};

	/**
	 * Determine whether or not to write shape-id to dom
	 * sap-gantt-shape-id is used for selection, drag & drop and DOM lookup for relationship.
	 *
	 * 1. If the shape is the root shape, which mean bound directly to Row
	 * 2. Shape is defined a lazy aggregation that will display in expand chart
	 * 3. Shape is defined as a standalone instance that doesn't associated to any controls
	 *
	 * @param {sap.gantt.simple.BaseShape} oShape shape instance
	 * @returns {bool} true: write the attribute, false: write nothing
	 */
	BaseShape.prototype._shallWriteElementData = function(oShape) {
		var bShallWrite = !oShape.getParent();
		if (bShallWrite === false) {
			//since the overlay shape is nested inside GanttRowOverlay and overlay control, move up two level for rowsettings.
			var oGanttRowOverlay = oShape.getParent().getParent();
			if (oGanttRowOverlay &&  oGanttRowOverlay.isA("sap.gantt.overlays.GanttRowOverlay")){
				bShallWrite =  AggregationUtils.isParentRowSetting(oGanttRowOverlay);
			} else  {
				bShallWrite = AggregationUtils.isParentRowSetting( oShape);
			}
		}
		if (bShallWrite === false){
			bShallWrite = AggregationUtils.isAdhocLine(oShape);
		}
		if (bShallWrite === false){
			bShallWrite = AggregationUtils.isDeltaLine(oShape);
		}
		if (bShallWrite === false) {
			bShallWrite = AggregationUtils.isLazyAggregation(oShape);
		}
		if (bShallWrite === false){
			bShallWrite = this.getGanttChartBase() && this.getGanttChartBase().getUseParentShapeOnExpand() && !AggregationUtils.isLazyAggregation(oShape);
		}
		return bShallWrite;
	};

	BaseShape.prototype.ensureGanttChart = function() {
		if (!this.mChartInstance) {
			this.mChartInstance = this.getGanttChartBase();
		}
	};

	BaseShape.prototype.setSelected = function(bSelected, bSuppressInvalidate) {
		var bPrevious = this.getSelected();
		this.setProperty("selected", bSelected, bSuppressInvalidate);

		var oGantt = this.getGanttChartBase(),
			sShapeUid = this.getShapeUid();
		if (bPrevious !== bSelected && oGantt && sShapeUid) {
			oGantt.getSelection().updateShape(sShapeUid, {
				selected: bSelected,
				ctrl: false,
				draggable:  this.getDraggable(),
				time: this.getTime(),
				endTime: this.getEndTime()
			});
		}
		return this;
	};

	BaseShape.prototype.setTime = function (oDate, bSuppressInvalidate) {
		this.setProperty("time", this._convertToJSDate(oDate), bSuppressInvalidate);
	};

	BaseShape.prototype.setEndTime = function (oDate, bSuppressInvalidate) {
		this.setProperty("endTime", this._convertToJSDate(oDate), bSuppressInvalidate);
	};

	/**
	 * Set highlight property and mark the shape highlighted in Highlight Model
	 * @param {Boolean} bHighlighted Flag to higlight shape.
	 * @param {Boolean} bSuppressInvalidate Flag to suppress re-rendering of the control.
	 * @public
	 * @since 1.100
	 */
	BaseShape.prototype.setHighlighted = function(bHighlighted, bSuppressInvalidate) {
		var bPrevious = this.getHighlighted();
		this.setProperty("highlighted", bHighlighted, bSuppressInvalidate);

		var oGantt = this.getGanttChartBase(),
			sShapeUid = this.getShapeUid();
		if (bPrevious !== bHighlighted && oGantt && sShapeUid) {
			oGantt.getHighlight().updateShape(sShapeUid, {
				highlighted: bHighlighted,
				time: this.getTime(),
				endTime: this.getEndTime()
			});
		}
		return this;
	};

	/**
	 * Function is called when Shape is clicked.
	 *
	 * @param {jQuery.Event} oEvent Mouse click event
	 * @private
	 */
	BaseShape.prototype.onclick = function(oEvent) {
		var fnClickEvent = function () {
			var oGanttChart;

			if (this.bPreventSingleClick === false) {
				oGanttChart = this.getGanttChartBase();

				//set the strokedasharray to default for all the adhoc lines
				GanttUtils.resetStrokeDasharray(oGanttChart);
				var mCursor = CoordinateUtils.getLatestCursorPosition();

				if (!oGanttChart.fireShapePress({popoverOffsetX: this._getPopoverOffsetX(oEvent), rowSettings: this.getParentRowSettings(), shape: this, ctrlOrMeta: oEvent.ctrlKey || oEvent.metaKey, pageX: mCursor.pageX, pageY: mCursor.pageY, originEvent: oEvent})) {
					return;
				}
				if (!this.getEnableChainSelection()) {
					oGanttChart.handleShapePress({
						shape: this,
						ctrlOrMeta: oEvent.ctrlKey || oEvent.metaKey
					});
				}

				// mark the event that it is handled by the control
				oEvent.setMarked();
			}
			this.bPreventSingleClick = false;
		}.bind(this);

		if (!this.getSelectable()) {
			return;
		}

		if (this._isDoubleClickEventDisabled()) {
			fnClickEvent();
			return;
		}
		this.iSingleClickTimer = window.setTimeout(fnClickEvent.bind(this), 300);
	};

	/**
	 * Function is called when Shape is double clicked.
	 *
	 * @param {jQuery.Event} oEvent Mouse dblclick event
	 * @private
	 */
	BaseShape.prototype.ondblclick = function(oEvent) {
		if (this._isDoubleClickEventDisabled()) {
			return;
		}

		window.clearTimeout(this.iSingleClickTimer);
		this.bPreventSingleClick = true;

		var mCursor = CoordinateUtils.getLatestCursorPosition();
		this.getGanttChartBase().fireShapeDoubleClick({
			popoverOffsetX: this._getPopoverOffsetX(oEvent),
			rowSettings: this.getParentRowSettings(),
			shape: this,
			pageX: mCursor.pageX,
			pageY: mCursor.pageY
		});
		oEvent.stopImmediatePropagation();
	};

	/**
	 * Function is called when Shape is right clicked.
	 *
	 * @param {jQuery.Event} oEvent context menu event
	 * @private
	 */
	BaseShape.prototype.oncontextmenu = function(oEvent) {
		oEvent.preventDefault();
		oEvent.stopImmediatePropagation();

		var mCursor = CoordinateUtils.getLatestCursorPosition();
		this.getGanttChartBase().fireShapeContextMenu({
			pageX: mCursor.pageX,
			pageY: mCursor.pageY,
			popoverOffsetX: this._getPopoverOffsetX(oEvent),
			rowSettings: this.getParentRowSettings(),
			shape: this,
			originEvent: oEvent
		});

	};

	/**
	 * Function is called when mouse leave the Shape.
	 *
	 * @param {jQuery.Event} oEvent Mouse leave event
	 * @private
	 */
	BaseShape.prototype.onmouseout = function(oEvent) {
		if (this.getHoverable() === false) { return; }

		if (this.isA("sap.gantt.simple.Relationship") && this.bRelationshipMouseEnter) {
			oEvent.currentTarget.style["stroke-width"] = this.getStrokeWidth() || 1;
			this.bRelationshipMouseEnter = false;
		}

		var oGanttChart = this.getGanttChartBase();

		// clear old timer before scheduling the next
		if (this.iMouseOutTimer) {
			window.clearTimeout(this.iMouseOutTimer);
		}

		if (!this.bShapeMouseEnterFired && this.iMouseOverTimer) {
			// cancel any pending mouse enter event as the mouse is moved out of the shape before entering the timeout
			window.clearTimeout(this.iMouseOverTimer);
		}

		this.iMouseOutTimer = window.setTimeout(function(){
			if (this.bShapeMouseEnterFired) {
				oGanttChart.fireShapeMouseLeave({
					shape: this
				});
				oGanttChart.handleShapeMouseLeave({
					shape: this
				});
				this.bShapeMouseEnterFired = false;
			}
		}.bind(this), oGanttChart.getShapeMouseLeaveDelay());
	};

	/**
	 * Function is called when mouse over the Shape.
	 *
	 * @param {jQuery.Event} oEvent Mouse over event
	 * @private
	 */
	BaseShape.prototype.onmouseover = function(oEvent) {
		if (this.getHoverable() === false) { return; }

		if (this.isA("sap.gantt.simple.Relationship") && !this.bRelationshipMouseEnter) {
			oEvent.currentTarget.style["stroke-width"] = this.getSelectedStrokeWidth();
			this.bRelationshipMouseEnter = true;
		}

		var oGanttChart = this.getGanttChartBase();

		// clear old timer before scheduling the next
		if (this.iMouseOverTimer) {
			window.clearTimeout(this.iMouseOverTimer);
		}

		this.iMouseOverTimer = window.setTimeout(function(){
			var oCursorElem = CoordinateUtils.getCursorElement();
			if (oCursorElem === this) {

				// cancel any pending mouse leave events before the mouse enter
				if (this.iMouseOutTimer) {
					window.clearTimeout(this.iMouseOutTimer);
				}

				var mCursor = CoordinateUtils.getLatestCursorPosition();
				oGanttChart.fireShapeMouseEnter({
					shape: this,
					pageX: mCursor.pageX,
					pageY: mCursor.pageY,
					isPinConnector: !!(this.mAnchors && this.mAnchors.prompter)
				});
				this.bShapeMouseEnterFired = true;

				oGanttChart.handleShapeMouseEnter({
					shape: this
				});
			}
		}.bind(this), oGanttChart.getShapeMouseEnterDelay());

	};

	/**
	 * Overwritten the getShapeUid because it's a hidden property
	 *
	 * @private
	 * @returns {string} shape UID
	 */
	BaseShape.prototype.getShapeUid = function() {
		return this.getProperty("shapeUid");
	};

	/**
	 * Calculates the <code>offsetX</code> property for {@link sap.m.Popover}.
	 * @param {jQuery.Event} oEvent Event which contains original event implementing <code>MouseEvent</code> Web API interface.
	 * @returns {int} Offset for an {@link sap.m.Popover} placement on the x axis, in pixels.
	 * @private
	 */
	BaseShape.prototype._getPopoverOffsetX = function (oEvent) {
		if (this.getTime()) {
			var fShapeWidth = this.getDomRef().getBoundingClientRect().width;
			var fShapeX = typeof this.getX === "function" ? this.getX() : GanttUtils.getValueX(this);
			var iEndTimeTime = this.getEndTime() ? this.getEndTime().getTime() : this.getAxisTime().viewToTime(fShapeX + fShapeWidth).getTime();
			var dMid = new Date((this.getTime().getTime() + iEndTimeTime) / 2);
			var iEventOffsetX = Device.browser.mozilla ? oEvent.originalEvent.layerX : oEvent.offsetX;
			var iResult = Math.round(iEventOffsetX - this.getAxisTime().timeToView(dMid));
			return Math.abs(iResult) > fShapeWidth ? 0 : iResult; // final check for short/non-duration shapes
		}
	};

	/**
	 * To check double click is disabled.
	 * @returns {boolean} status
	 * @private
	 */
	BaseShape.prototype._isDoubleClickEventDisabled = function () {
		var oGanttChart = this.getGanttChartBase();
		return oGanttChart && oGanttChart.getDisableShapeDoubleClickEvent();
	};

	/**
	 * get Animation Properties of the shape
	 * @param {object} oCustomAnimation custom animation properties to merge
	 * @returns {object} computed animation properties
	 * @private
	 */
	BaseShape.prototype.getAnimationProperties = function(oCustomAnimation) {
		if (!this.mAnimationProperties) {
			if (jQuery.isEmptyObject(oCustomAnimation) || !oCustomAnimation.values) {
				return false;
			}
			var mClonedDefaults = jQuery.extend(true, {}, mDefaultAnimationSettings);
			for (var sStyle in mClonedDefaults) {
				if (oCustomAnimation[sStyle]) {
					mClonedDefaults[sStyle] = oCustomAnimation[sStyle];
				}
			}
			this.mAnimationProperties = mClonedDefaults;
		}
		return this.mAnimationProperties;
	};

	/**
	 * To check double click is disabled.
	 * @param {Date} oDate date input to convert
	 * @returns {Date} converted date
	 * @private
	 */
	BaseShape.prototype._convertToJSDate = function (oDate) {
		if (oDate instanceof UI5Date) {
			return new Date(oDate.getTime());
		}

		return oDate;
	};

	return BaseShape;
}, true);
