/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(
	[
		"sap/ui/core/Element",
		"./GanttUtils",
		"sap/ui/core/theming/Parameters"
	],
	function (Element, GanttUtils, Parameters) {
		"use strict";

		/**
		 * Creates and initializes a new DeltaLine class.
		 *
		 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
		 *
		 * @class
		 * The DeltaLine class contains properties to draw additional vertical lines which are connected by DeltaMarkers
		 * at specific time points in the chart area.
		 *
		 * @extends sap.ui.core.Element
		 *
		 * @author SAP SE
		 * @version 1.132.0
		 * @since 1.84
		 *
		 * @constructor
		 * @public
		 * @alias sap.gantt.simple.DeltaLine
		 */
		var DeltaLine = Element.extend(
			"sap.gantt.simple.DeltaLine",
			/** @lends sap.gantt.simple.DeltaLine.prototype */ {
				metadata: {
					library: "sap.gantt",
					properties: {
						/**
						 * Standard SVG 'stroke' attribute.
						 * You can provide the stroke attribute with HTML colors and URL reference to the paint server.
						 * Paint server definitions usually come from paint servers rendered by {@link sap.gantt.GanttChartContainer},
						 * {@link sap.gantt.GanttChartWithTable} or {@link sap.gantt.GanttChart}.
						 */
						stroke: { type: "sap.gantt.ValueSVGPaintServer" },

						/**
						 * Standard SVG 'stroke-width' attribute.
						 * @private
						 */
						_strokeWidth: { type: "float", defaultValue: 1, visibility: "hidden"},

						/**
						 * Standard SVG 'stroke-dasharray' attribute.
						 */
						strokeDasharray: { type: "string" },

						/**
						 * Standard SVG 'stroke-opacity' attribute.
						 */
						strokeOpacity: { type: "float", defaultValue: 1 },

						/**
						 * Start time stamp of the Delta Line
						 */
						timeStamp: { type: "string" },

						/**
						 * End time stamp of the Delta Line
						 */
						endTimeStamp: { type: "string" },

						/**
						 * Description of the Delta Line
						 */
						description: { type: "string" },

						/**
						 * Visibility of the Delta Line
						 */
						visible: { type: "boolean", defaultValue: true },

						/**
						 * Visibility of the Delta Start and End Lines
						 * @since 1.103
						 */
						visibleDeltaStartEndLines: { type: "boolean", defaultValue: true },

						/**
						 * Visibility of the Delta Line
						 * @deprecated Since version 1.97.
						 * <b>Note:</b>With the new implementation, this property won't have any effect.
						*/
					    timeDelay: { type: "int", defaultValue: 300 },

						/**
				 		* Specifies whether the delta line is draggable.
						* @since 1.88
				 		*/
						draggable: {type: "boolean", defaultValue: false},

						/**
				 		* Specifies whether the delta line is resizable.
						* @since 1.88
						*/
						resizable: {type: "boolean", defaultValue: false},

						/**
						 * Background area between Delta Lines
						 * @private
						 */
						_enableChartDeltaAreaHighlight: {
							type: "boolean",
							defaultValue: true,
							visibility: "hidden"
						},

						/**
						 * Selection property of the Delta Markers
						 * @private
						 */
						_isSelected: { type: "boolean", defaultValue: false, visibility: "hidden"},

						/**
						 * Level of markers in the header.
						 * @private
						 */
						_level: { type: "int", defaultValue: 1, visibility: "hidden"},

						/**
						 * Visibility of the Delta Markers
						 * @private
						 */
						_visibleMarker: { type: "boolean", defaultValue: false, visibility: "hidden"}
					},
					aggregations: {
						/**
						 * Start line of the Delta Line
						 * @private
						 */
						_startLine: { type: "sap.gantt.simple.BaseLine", multiple: false, visibility: "hidden"},

						/**
						 * End line of the Delta Line
						 * @private
						 */
						_endLine: { type: "sap.gantt.simple.BaseLine", multiple: false, visibility: "hidden"},

						/**
						 * Forward Delta Marker
						 * @private
						 */
						_forwardMarker: {
							type: "sap.gantt.simple.BaseTriangle",
							multiple: false,
							visibility: "hidden"
						},

						/**
						 * Backward Delta Marker
						 * @private
						 */
						_backwardMarker: {
							type: "sap.gantt.simple.BaseTriangle",
							multiple: false,
							visibility: "hidden"
						},

						/**
						 * Header area between the Delta Markers
						 * @private
						 */
						_headerDeltaArea: {
							type: "sap.gantt.simple.BaseDeltaRectangle",
							multiple: false,
							visibility: "hidden"
						},

						/**
						 * Header start line
						 * @private
						 */
						_headerStartLine: {
							type: "sap.gantt.simple.BaseLine",
							multiple: false,
							visibility: "hidden"
						},

						/**
						 * Header end line
						 * @private
						 */
						_headerEndLine: {
							type: "sap.gantt.simple.BaseLine",
							multiple: false,
							visibility: "hidden"
						},

						/**
						 * Chart area between Delta Lines
						 * @private
						 */
						_chartDeltaArea: {
							type: "sap.gantt.simple.BaseDeltaRectangle",
							multiple: false,
							visibility: "hidden"
						}
					},
					events: {
						press: {},
						mouseEnter: {},
						mouseLeave: {},
						/**
				 		* Fires during drag and drop of the delta line.
				 		* @since 1.88
				 		*/
						deltalineDrop: {
							parameters: {
								newStartTime: {type: "string"},
								newEndTime: {type: "string"},
								oldStartTime: {type: "string"},
								oldEndTime: {type: "string"}
							}
						},
						/**
						 * Fires during resize of delta line.
						 * @since 1.88
						 */
						deltalineResize: {
							parameters: {
								newTimeStamp: {type: "string"},
								newEndTimeStamp: {type: "string"},
								oldTimeStamp: {type: "string"},
								oldEndTimeStamp: {type: "string"},
								deltaline: {type: "sap.gantt.simple.DeltaLine"}
							}
						}
					},
					designtime: "sap/gantt/designtime/simple/DeltaLine.designtime"
				},
				renderer: {
					apiVersion: 2    // enable in-place DOM patching
				}
			}
		);

		/**
		 * Returns the strokeWidth property of the Delta line
		 * @returns {float} - Return the strokeWidth property value
		 * @private
		 */
		DeltaLine.prototype._getStrokeWidth = function () {
			return this.getProperty("_strokeWidth");
		};

		/**
		 * Sets the start line object
		 * @param {sap.gantt.simple.BaseLine} val - Instance of start line object to be set
		 * @private
		 */
		DeltaLine.prototype._setStartLine = function (val) {
			this.setAggregation("_startLine", val, true);
		};

		/**
		 * Returns the start line object
		 * @returns {sap.gantt.simple.BaseLine} - Return start line object
		 * @private
		 */
		DeltaLine.prototype._getStartLine = function () {
			return this.getAggregation("_startLine");
		};

		/**
		 * Sets the end line object
		 * @param {sap.gantt.simple.BaseLine} val - Instance of end line object to be set
		 * @private
		 */
		DeltaLine.prototype._setEndLine = function (val) {
			this.setAggregation("_endLine", val, true);
		};

		/**
		 * Returns the end line object
		 * @returns {sap.gantt.simple.BaseLine} - Return end line object
		 * @private
		 */
		DeltaLine.prototype._getEndLine = function () {
			return this.getAggregation("_endLine");
		};

		/**
		 * Sets the forwardMarker object
		 * @param {sap.gantt.simple.BaseTriangle} val - Instance of forwardMarker object to be set
		 * @private
		 */
		DeltaLine.prototype._setForwardMarker = function (val) {
			this.setAggregation("_forwardMarker", val, true);
		};

		/**
		 * Returns the ForwardMarker object
		 * @returns {sap.gantt.simple.BaseTriangle} - Return ForwardMarker object
		 * @private
		 */
		DeltaLine.prototype._getForwardMarker = function () {
			return this.getAggregation("_forwardMarker");
		};

		/**
		 * Sets the backwardMarker object
		 * @param {sap.gantt.simple.BaseTriangle} val - Instance of BackwardMarker object to be set
		 * @private
		 */
		DeltaLine.prototype._setBackwardMarker = function (val) {
			this.setAggregation("_backwardMarker", val, true);
		};

		/**
		 * Returns the BackwardMarker object
		 * @returns {sap.gantt.simple.BaseTriangle} - Return BackwardMarker object
		 * @private
		 */
		DeltaLine.prototype._getBackwardMarker = function () {
			return this.getAggregation("_backwardMarker");
		};

		/**
		 * Sets the headerDeltaArea object
		 * @param {sap.gantt.simple.BaseDeltaRectangle} val - Instance of headerDeltaArea object to be set
		 * @private
		 */
		DeltaLine.prototype._setHeaderDeltaArea = function (val) {
			this.setAggregation("_headerDeltaArea", val, true);
		};

		/**
		 * Returns the header delta area object
		 * @returns {sap.gantt.simple.BaseDeltaRectangle} - Return header delta area object
		 * @private
		 */
		DeltaLine.prototype._getHeaderDeltaArea = function () {
			return this.getAggregation("_headerDeltaArea");
		};

		/**
		 * Sets the headerStartline object
		 * @param {sap.gantt.simple.BaseLine} val - Instance of headerStartline object to be set
		 * @private
		 */
		DeltaLine.prototype._setHeaderStartLine = function (val) {
			this.setAggregation("_headerStartLine", val, true);
		};

		/**
		 * Returns the header start line object
		 * @returns {sap.gantt.simple.BaseLine} - Return header start line object
		 * @private
		 */
		DeltaLine.prototype._getHeaderStartLine = function () {
			return this.getAggregation("_headerStartLine");
		};

		/**
		 * Sets the headerEndLine object
		 * @param {sap.gantt.simple.BaseLine} val - Instance of header end line object to be set
		 * @private
		 */
		DeltaLine.prototype._setHeaderEndLine = function (val) {
			this.setAggregation("_headerEndLine", val, true);
		};

		/**
		 * Returns the header end line object
		 * @returns {sap.gantt.simple.BaseLine} - Return header end line object
		 * @private
		 */
		DeltaLine.prototype._getHeaderEndLine = function () {
			return this.getAggregation("_headerEndLine");
		};

		/**
		 * Sets the chartDeltaArea object
		 * @param {sap.gantt.simple.BaseDeltaRectangle} val - Instance of chartDeltaArea object to be set
		 * @private
		 */
		DeltaLine.prototype._setChartDeltaArea = function (val) {
			this.setAggregation("_chartDeltaArea", val, true);
		};

		/**
		 * Returns chartDeltaArea object
		 * @returns {sap.gantt.simple.BaseDeltaRectangle} - Return chartDeltaArea object
		 * @private
		 */
		DeltaLine.prototype._getChartDeltaArea = function () {
			return this.getAggregation("_chartDeltaArea");
		};

		/**
		 * Sets the boolean value
		 * @param {boolean} val - Instance of chartDeltaAreaHighlight object to be set
		 * @private
		 */
		DeltaLine.prototype._setEnableChartDeltaAreaHighlight = function (val) {
			this.setProperty("_enableChartDeltaAreaHighlight", val, true);
		};

		/**
		 * Returns the boolean object
		 * @returns {boolean} - Return boolean object
		 * @private
		 */
		DeltaLine.prototype._getEnableChartDeltaAreaHighlight = function () {
			return this.getProperty("_enableChartDeltaAreaHighlight");
		};

		/**
		 * Sets the boolean object
		 * @param {boolean} val - Instance of end boolean to be set
		 * @private
		 */
		DeltaLine.prototype._setIsSelected = function (val) {
			this.setProperty("_isSelected", val, true);
		};

		/**
		 * Returns the boolean value
		 * @returns {boolean} - Return boolean value
		 * @private
		 */
		DeltaLine.prototype._getIsSelected = function () {
			return this.getProperty("_isSelected");
		};

		/**
		 * Sets the level object
		 * @param {boolean} val - Instance of level to be set
		 * @private
		 */
		DeltaLine.prototype._setLevel = function (val) {
			this.setProperty("_level", val, true);
		};

		/**
		 * Returns the level object
		 * @returns {boolean} - Return level object
		 * @private
		 */
		DeltaLine.prototype._getLevel = function () {
			return this.getProperty("_level");
		};

		/**
		 * Sets the visibleMarker object
		 * @param {boolean} val - Instance of visibleMarker object to be set
		 * @private
		 */
		DeltaLine.prototype._setVisibleMarker = function (val) {
			this.setProperty("_visibleMarker", val, true);
		};

		/**
		 * Returns the marker visible object
		 * @returns {boolean} - Return marker visible object
		 * @private
		 */
		DeltaLine.prototype._getVisibleMarker = function () {
			return this.getProperty("_visibleMarker");
		};

		/**
		 * Toggle chart area opacity and chart styles on selecting Delta Markers
		 *
		 * @param {object} oEvent - holding event details of Delta Line
		 */
		DeltaLine.prototype.press = function (oEvent) {
			this.onMouseClick();
		};

		/**
		 * Toggle chart styles on mouse hover of Delta Markers
		 *
		 * @param {object} oEvent - holding event details of Delta Line
		 */
		DeltaLine.prototype.mouseEnter = function (oEvent) {
			this.onMouseEnter();
		};

		/**
		 * Toggle chart styles on mouseout of Delta Markers
		 *
		 * @param {object} oEvent - holding event details of Delta Line
		 */
		DeltaLine.prototype.mouseLeave = function (oEvent) {
			this.onMouseLeave();
		};

		/**
		 * Toggle chart styles on selecting Delta Markers
		 */
		DeltaLine.prototype.onMouseClick = function () {
			if (!this._getIsSelected()) {
				GanttUtils.resetStrokeDasharray(this.getParent());
				this._setIsSelected(true);
			}

			var oChartDeltaArea = this._getChartDeltaArea();
			var oHeaderDeltaArea = this._getHeaderDeltaArea();
			var oForwardMarker = this._getForwardMarker();
			var oBackwardMarker = this._getBackwardMarker();
			var markerStroke = Parameters.get("sapUiChartDataPointBorderColor");
			if (oChartDeltaArea) {
				var $chartdeltaArea = document.getElementById(oChartDeltaArea.sId);
				if (this._getEnableChartDeltaAreaHighlight() === true) {
					$chartdeltaArea.style.opacity = 1.0;
				}
				if (this.getVisibleDeltaStartEndLines()){
					var oStartLine = this._getStartLine();
					var oEndLine = this._getEndLine();
					var oHeaderStartLine = this._getHeaderStartLine();
					var oHeaderEndLine = this._getHeaderEndLine();
					if (oStartLine && oEndLine && oHeaderStartLine && oHeaderEndLine){
							var $startLine = document.getElementById(oStartLine.sId);
							var $endLine = document.getElementById(oEndLine.sId);
							var $headerStartLine = document.getElementById(oHeaderStartLine.sId);
							var $headerEndLine = document.getElementById(oHeaderEndLine.sId);
							$startLine.style.strokeDasharray = 0;
							$endLine.style.strokeDasharray = 0;
							$headerStartLine.style.strokeDasharray = 0;
							$headerEndLine.style.strokeDasharray = 0;
							$startLine.style.strokeWidth = this._getStrokeWidth() + 1;
							$endLine.style.strokeWidth = this._getStrokeWidth() + 1;
							$headerStartLine.style.strokeWidth =
								this._getStrokeWidth() + 1;
							$headerEndLine.style.strokeWidth =
								this._getStrokeWidth() + 1;
						}
				}
				if (
					oForwardMarker &&
					oBackwardMarker &&
					oHeaderDeltaArea
				) {
					var $forwardMarker = document.getElementById(oForwardMarker.sId);
					var $backwardMarker = document.getElementById(oBackwardMarker.sId);
					var $headerDeltaArea = document.getElementById(oHeaderDeltaArea.sId);
					$forwardMarker.style.fillOpacity = 1;
					$backwardMarker.style.fillOpacity = 1;
					$forwardMarker.style.stroke = markerStroke;
					$backwardMarker.style.stroke = markerStroke;
					$headerDeltaArea.style.opacity = 1;
				}
			}

			if (this._getIsSelected() && this.getDraggable()) {
				//Adding Move cursor to indicate Drag availability.
				$headerDeltaArea.style.cursor = "Move";
			}

			/**
			 * Adding Resize Handler on Delta Marker
			 * when resizable property is set to true
			 * and delta line is selected.
			 */
			if (this._getIsSelected() && this.getResizable()) {
				var oResizeExtension = this.getParent()._getResizeExtension();
				oResizeExtension.addDeltaLineResizer(this._getHeaderDeltaArea());
			}
		};

		/**
		 * Toggle chart styles on mouse enter of Delta Markers
		 */
		DeltaLine.prototype.onMouseEnter = function () {
			var oForwardMarker = this._getForwardMarker();
			var oBackwardMarker = this._getBackwardMarker();
			var oHeaderDeltaArea = this._getHeaderDeltaArea();
			if (this.getVisibleDeltaStartEndLines()) {
				var oStartLine = this._getStartLine();
				var oEndLine = this._getEndLine();
				var oHeaderStartLine = this._getHeaderStartLine();
				var oHeaderEndLine = this._getHeaderEndLine();
				if (oStartLine && oEndLine && oHeaderEndLine && oHeaderStartLine) {
					var $startLine = document.getElementById(oStartLine.sId);
					var $endLine = document.getElementById(oEndLine.sId);
					var $headerStartLine = document.getElementById(oHeaderStartLine.sId);
					var $headerEndLine = document.getElementById(oHeaderEndLine.sId);
					$startLine.style.strokeDasharray = 0;
					$endLine.style.strokeDasharray = 0;
					$headerStartLine.style.strokeDasharray = 0;
					$headerEndLine.style.strokeDasharray = 0;
					$startLine.style.strokeWidth = this._getStrokeWidth() + 1;
					$endLine.style.strokeWidth = this._getStrokeWidth() + 1;
					$headerStartLine.style.strokeWidth =
						this._getStrokeWidth() + 1;
					$headerEndLine.style.strokeWidth = this._getStrokeWidth() + 1;
				}
			}
			var $forwardMarker = document.getElementById(oForwardMarker.sId);
			var $backwardMarker = document.getElementById(oBackwardMarker.sId);
			var $headerDeltaArea = document.getElementById(oHeaderDeltaArea.sId);
			$forwardMarker.style.fillOpacity = 1;
			$backwardMarker.style.fillOpacity = 1;
			$forwardMarker.style.stroke = Parameters.get(
				"sapUiChartDataPointBorderColor"
			);
			$backwardMarker.style.stroke = Parameters.get(
				"sapUiChartDataPointBorderColor"
			);
			$headerDeltaArea.style.opacity = 1;
			if (this._getIsSelected() && this.getDraggable()) {
				//Adding Move cursor to indicate Drag availability.
				$headerDeltaArea.style.cursor = "move";
			}
		};

		/**
		 * Toggle chart line styles on mouseout of Delta Markers
		 */
		DeltaLine.prototype.onMouseLeave = function () {
			var isSelected = this._getIsSelected();
			var oForwardMarker = this._getForwardMarker();
			var oBackwardMarker = this._getBackwardMarker();
			var oHeaderDeltaArea = this._getHeaderDeltaArea();

			if (!isSelected) {
				if (this.getVisibleDeltaStartEndLines()) {
					var oStartLine = this._getStartLine();
					var oEndLine = this._getEndLine();
					var oHeaderStartLine = this._getHeaderStartLine();
					var oHeaderEndLine = this._getHeaderEndLine();
					if (oStartLine && oEndLine){
						var $startLine = document.getElementById(oStartLine.sId);
						var $endLine = document.getElementById(oEndLine.sId);
						var $headerStartLine = document.getElementById(oHeaderStartLine.sId);
						var $headerEndLine = document.getElementById(oHeaderEndLine.sId);
						$startLine.style.strokeDasharray = this.getStrokeDasharray();
						$endLine.style.strokeDasharray = this.getStrokeDasharray();
						$headerStartLine.style.strokeDasharray = this.getStrokeDasharray();
						$headerEndLine.style.strokeDasharray = this.getStrokeDasharray();
						$startLine.style.strokeWidth = this._getStrokeWidth();
						$endLine.style.strokeWidth = this._getStrokeWidth();
						$headerStartLine.style.strokeWidth = this._getStrokeWidth();
						$headerEndLine.style.strokeWidth = this._getStrokeWidth();
					}
				}
				if (oForwardMarker && oBackwardMarker){
					var $forwardMarker = document.getElementById(oForwardMarker.sId);
					var $backwardMarker = document.getElementById(oBackwardMarker.sId);
					var $headerDeltaArea = document.getElementById(oHeaderDeltaArea.sId);
					$headerDeltaArea.style.opacity = 1;
					var markerStroke = Parameters.get("sapUiChartDataPointBorderColor");
					if (this._getVisibleMarker() === true) {
						$forwardMarker.style.fillOpacity = 1;
						$backwardMarker.style.fillOpacity = 1;
						$forwardMarker.style.stroke = markerStroke;
						$backwardMarker.style.stroke = markerStroke;
					} else {
						$forwardMarker.style.fillOpacity = 0;
						$backwardMarker.style.fillOpacity = 0;
						$forwardMarker.style.stroke = null;
						$backwardMarker.style.stroke = null;
					}
				}
			}
		};
		return DeltaLine;
	},
	true
);
