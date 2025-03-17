/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

// Provides helper sap.gantt.simple.GanttUtils
sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/base/Log",
	"sap/ui/base/Object",
	"sap/ui/core/CalendarType",
	"sap/gantt/misc/Utility",
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/Locale",
	"sap/m/OverflowToolbar",
	"sap/ui/core/theming/Parameters",
	"./CoordinateUtils",
	"./MarkerType",
	"sap/gantt/misc/Format",
	"sap/gantt/library",
	"sap/ui/table/rowmodes/Auto",
	"sap/ui/table/rowmodes/Fixed",
	"sap/ui/table/rowmodes/Interactive",
	"sap/gantt/utils/GanttChartConfigurationUtils",
	"sap/ui/core/Element",
	"sap/ui/core/RenderManager"
], function(jQuery, Log, BaseObject, CalendarType, Utility, DateFormat, Locale, OverflowToolbar, Parameters, CoordinateUtils, MarkerType, Format, library, AutoRowMode, FixedRowMode, InteractiveRowMode, GanttChartConfigurationUtils, Element, RenderManager) {
	"use strict";
	var oContextCache = {};
	var shapesWithRowLevels = {};
	var exitShapeTraversingLoop = false;
	var exitRowTraversingLoop = false;
	var GanttUtils = {

		SHAPE_ID_DATASET_KEY          : "data-sap-gantt-shape-id",
		ROW_ID_DATASET_KEY            : "data-sap-gantt-row-id",
		CONNECTABLE_DATASET_KEY       : "data-sap-gantt-connectable",
		SELECT_FOR_DATASET_KEY        : "sap-gantt-select-for",
		SHAPE_CONNECT_FOR_DATASET_KEY : "sap-gantt-shape-connect-for",
		SHAPE_CONNECT_INDICATOR_WIDTH : 10,

		oDateFormat : DateFormat.getDateInstance({pattern: 'yyyyMMddHHmmss', calendarType: CalendarType.Gregorian}),

		/**
		 * Try to find the in-row shape instance after rendering
		 */
		shapeElementById: function(sShapeId, sGanttSvgId) {
			var oGanttSvg = window.document.getElementById(sGanttSvgId),
				oShapeContainer = oGanttSvg.querySelector("g.sapGanttChartShapes");

			var aNodeList = oShapeContainer.querySelectorAll("[" + GanttUtils.SHAPE_ID_DATASET_KEY + "='" + sShapeId + "']");
			var oElementNode = aNodeList[0];
			if (oElementNode) {
				return jQuery(oElementNode).control(0);
			}

			return null;
		},

		isRelationshipConnectedToPseudoShapes: function(sShapeId, sGanttSvgId) {
			var oGantt = Element.getElementById(sGanttSvgId);
			var oTableRows = oGantt.getTable().getRows();
			var bFoundShapeForRelationship = false, oPseudoShapesForRelationship;
			oTableRows.forEach(function(oTableRow){
				if (!bFoundShapeForRelationship) {
					var oRowSetting = oTableRow.getAggregation("_settings");
					oPseudoShapesForRelationship = oRowSetting.getPseudoShapes && oRowSetting.getPseudoShapes().filter(function(oPseudoShape) {
						return (oPseudoShape.aShapeIds.indexOf(sShapeId) > -1);
					})[0];
					if (oPseudoShapesForRelationship) {
						bFoundShapeForRelationship = true;
					}
				}
			});
			if (bFoundShapeForRelationship && document.getElementById(oPseudoShapesForRelationship.getId())) {
				return oPseudoShapesForRelationship;
			}
		},

		getValueX: function(oShape) {
			var nTimeX;
			var oProp = oShape.getMetadata().getProperty("x");
			if (oProp) {
				nTimeX = oShape.getProperty(oProp.name);
				if (nTimeX !== null && nTimeX !== undefined) {
					return nTimeX;
				}
			}

			var bRTL = GanttChartConfigurationUtils.getRTL(),
				vTime = bRTL ? (oShape.getEndTime() || oShape.getTime()) : oShape.getTime();

			if (vTime) {
				nTimeX = oShape.getXByTime(vTime);
			}

			if (!Utility.isNumeric(nTimeX)) {
				Log.warning("couldn't convert timestamp to x with value: " + vTime);
			}

			return nTimeX;
		},

		/**
		 * get table row by background rect element
		 * @private
		 */
		getRowInstance: function(oEvent, oTable) {
			var iRowIndex = jQuery(oEvent.target).closest("rect.sapGanttBackgroundSVGRow").data("sapUiIndex");
			if (iRowIndex != null) {
				return oTable.getRows()[iRowIndex];
			}
		},

		/**
		 * get table row mode
		 * @private
		 */
		setTableRowMode: function(oTable) {
			if (oTable) {
				var oRowMode = oTable.getRowMode();

				/**
				 * @deprecated As of version 1.119
				 */
				if (!oRowMode && oTable.getVisibleRowCountMode()) {
					return;
				}

				if (oRowMode === null || oRowMode === "Fixed") {
					oTable.setRowMode(new FixedRowMode());
				} else if (oRowMode === "Auto") {
					oTable.setRowMode(new AutoRowMode());
				} else if (oRowMode === "Interactive") {
					oTable.setRowMode(new InteractiveRowMode());
				}
			}
		},

		/**
		 * get table row from Current Shape
		 * @private
		 */
		getRowInstancefromShape: function(oShape) {
			var oRowSettings = oShape.getParentRowSettings();
			if (oRowSettings != null) {
				return oRowSettings.getParentRow();
			}
		},

		/**
		 * Creates context for measuring size of the font and then the context is put
		 * in cache for later use. Every shape used to have its own 2d context,
		 * but IE11 could not handle that. That is why the 2d context is cached
		 * once for all shapes here.
		 * @param {number} iFontSize Size of font
		 * @param {string} sFontFamily Font family
		 * @param {string} sFontWeight Font weight
		 * @returns {CanvasRenderingContext2D} 2d context
		 * @private
		 */
		_get2dContext: function(iFontSize, sFontFamily, sFontWeight) {
			if (!oContextCache.context) {
				oContextCache.context
					= document.createElement('canvas').getContext("2d");
			}
			if (oContextCache.fontSize !== iFontSize
				|| oContextCache.fontFamily !== sFontFamily || oContextCache.fontWeight !== sFontWeight) {
				oContextCache.context.font = sFontWeight + " " + iFontSize + "px " + sFontFamily;
				oContextCache.fontSize = iFontSize;
				oContextCache.fontFamily = sFontFamily;
				oContextCache.fontWeight = sFontWeight;
			}
			return oContextCache.context;
		},

		/**
		 * Returns width of the shape text
		 * @param {string} sText Text in the shape
		 * @param {number} iFontSize font size
		 * @param {string} sFontFamily Font family
		 * @param {string} sFontWeight Font weight
		 * @returns {number} width of the shape text
		 * @private
		 */
		 getShapeTextWidth: function(sText, iFontSize, sFontFamily, sFontWeight) {
			return this._get2dContext(iFontSize, sFontFamily, sFontWeight)
				.measureText(sText).width;
		},

		getSelectedTableRowSettings: function(oTable, iSelectedIndex) {
			var aAllRows = oTable.getRows(),
				iFirstVisibleRow = oTable.getFirstVisibleRow();

			if (aAllRows.length === 0) {
				// prevent error in below
				return null;
			}
			var iFirstRowIndex = aAllRows[0].getIndex();

			var iIndex = iSelectedIndex - iFirstVisibleRow;
			if (iFirstRowIndex !== iFirstVisibleRow) {
				// Case that variableRowHeight is enabled and table scroll to the bottom
				iIndex += Math.abs(iFirstRowIndex - iFirstVisibleRow);
			}
			if (!aAllRows[iIndex]) {
				return null;
			}
			return aAllRows[iIndex].getAggregation("_settings");
		},

		updateGanttRows: function(oDelegator, aRowState, iIndex) {
			var oGantt = oDelegator.getParent().getParent();
			var $svg = jQuery(document.getElementById(oGantt.getId() + "-svg")),
			$bgRects = $svg.find("rect.sapGanttBackgroundSVGRow");
			if (oGantt.getEnableChartSelectionState()) {
				$bgRects.eq(iIndex).toggleClass("sapGanttBackgroundSVGRowSelected", !!aRowState[iIndex].selected);
			}
			if (oGantt.getEnableChartHoverState()) {
				$bgRects.eq(iIndex).toggleClass("sapGanttBackgroundSVGRowHovered",  !!aRowState[iIndex].hovered);
			}
		},

		/**
		 * Get shapes element with their Uids
		 *
		 * @param  {string} sContainerId        Gantt chart's dom id
		 * @param  {string[]} aShapeUid            Array of shape uid
		 * @return {object[]}                      Array of shape element
		 */
		getShapesWithUid : function (sContainerId, aShapeUid) {
			var fnElementFromShapeId = function (sShapeUid) {
				var oPart = Utility.parseUid(sShapeUid),
					sShapeId = oPart.shapeId;

				var selector = ["[id='", sContainerId, "']", " [" + GanttUtils.SHAPE_ID_DATASET_KEY + "='", sShapeId, "']"].join("");
				var sElm = document.querySelector(selector);
				if (sElm) {
					const oElement = Element.getElementById(sElm.id);
					if (oElement) {
						const oElmPart = Utility.parseUid(oElement.getShapeUid());
						if (oElmPart.shapeId === sShapeId  && oElmPart.rowId === oPart.rowId) {
							return oElement;
						}
					}
				}
			};
			return aShapeUid.map(fnElementFromShapeId);
		},

		/**
		 * Get visible shape element from objectId(shapeId)
		 * @param {string} sContainerId Gantt chart's dom id
		 * @param {string[]} shapeId Array of objectId(shapeId)
		 * @returns {object[]} Array of shape element
		 */
		getShapeByShapeId : function (sContainerId, shapeId) {
			var fnElements = [];
			shapeId.forEach(function(sShapeId){
				var selector = ["[id='", sContainerId, "']", " [" + GanttUtils.SHAPE_ID_DATASET_KEY + "='", sShapeId, "']"].join("");
				var sElm = document.querySelector(selector);
				if (sElm) {
					var oShape = Element.getElementById(sElm.id);
					if (oShape){
						fnElements.push(oShape);
					}
				}
			});
			return fnElements;
		},

		getShapesInRowsById : function(sGanttId, rowIds) {
			var oSvg = document.getElementById(sGanttId);
			var shapes = [];
			rowIds.forEach(function(sRowId) {
				if (oSvg) {
					var rowElm = oSvg.querySelector("[data-sap-gantt-row-id='" + sRowId + "']");
					if (rowElm) {
						shapes = Array.from(rowElm.children).filter(function(shape){
							return shape.id !== "";
						})
						.reduce(function(acc,item) {
							return acc.concat(Element.getElementById(item.id));
						},shapes);
					}
				}
			});
			return shapes;
		},

		/**
		 * gets objectId from shape UID.
		 * @param {string[]} ShapeUid Array of shape uids.
		 * @returns {string[]} Arrays of object Id.
		 */
		getShapeIdFromShapeUid : function (ShapeUid) {
			return ShapeUid.map(function (sShapeUid) {
				var oPart = Utility.parseUid(sShapeUid);
				return oPart.shapeId;
			});
		},

		/**
		 * Get time formater by lower level of time axis.
		 * Keep the time unit to date if lower level of the time axis is bigger than or equal to date
		 *
		 * @param {object} oGantt  Gantt chart instance
		 *
		 * @return {object} Time formater
		 */
		getTimeFormaterBySmallInterval : function(oGantt) {
			var oAxisTimeStrategy = oGantt.getAxisTimeStrategy(),
				oSmallInterval = oAxisTimeStrategy.getTimeLineOption().smallInterval,
				oUnit = oSmallInterval.unit;

			var oCalendarType = oAxisTimeStrategy.getCalendarType(),
				oCoreLocale = oAxisTimeStrategy.getLocale() ? oAxisTimeStrategy.getLocale() :
					new Locale(GanttChartConfigurationUtils.getLanguage().toLowerCase());

			// keep the time unit to date if lower level of the time axis is bigger than or equal to date.
			var sFormat = "yyyyMMMddhhms";
			if (!(oUnit === sap.gantt.config.TimeUnit.minute || oUnit === sap.gantt.config.TimeUnit.hour)) {
				sFormat = "yyyyMMMdd";
			}

			var oFormatLocale = oSmallInterval.locale ? new Locale(oSmallInterval.locale) : oCoreLocale;
			var oFormatOptions = {
				format: sFormat,
				style: oSmallInterval.style,
				calendarType: oCalendarType
			};

			return DateFormat.getDateTimeWithTimezoneInstance(oFormatOptions, oFormatLocale);
		},

		/**
		 * Converts date to FLP timeZone
		 * @param {object} oDate date to be parsed
		 * @returns converted date object
		 */
		getFormatedDateByTimeZone: function (oDate) {
			var sFormattedDate = this.oDateFormat.format(oDate);
			return Format.abapTimestampToDate(sFormattedDate);
		},

		/**
		 * Resets the StrokeDasharray for the Adhoc Lines
		 * @param {sap.gantt.simple.GanttChartWithTable} oGantt
		 */
		resetStrokeDasharray : function(oGantt){
			if (!oGantt) {
				return;
			}
			var aSelectedLine = oGantt.getSimpleAdhocLines().find(function(x){
				return x._getSelected();
			});
			if (aSelectedLine) {
				aSelectedLine._setSelected(false);
				var headerStroke = document.getElementById(aSelectedLine._getHeaderLine().sId);
				var stroke = document.getElementById(aSelectedLine._getLine().sId);
				var marker = document.getElementById(aSelectedLine._getMarker().getId());
				marker.style.cursor = "pointer";
				if (stroke && headerStroke){
					stroke.style.strokeDasharray = aSelectedLine.getStrokeDasharray();
					headerStroke.style.strokeDasharray = aSelectedLine.getStrokeDasharray();
					stroke.style.strokeWidth = aSelectedLine._getStrokeWidth();
					headerStroke.style.strokeWidth = aSelectedLine._getStrokeWidth();
				}
			}

			var aSelectedDeltaLine = oGantt.getDeltaLines().find(function (x) {
				return x._getIsSelected();
			});
			if (aSelectedDeltaLine) {
				var oChartDeltaArea = aSelectedDeltaLine._getChartDeltaArea();
				if (oChartDeltaArea) {
					var $chartdeltaArea = document.getElementById(oChartDeltaArea.sId);
					if (aSelectedDeltaLine._getEnableChartDeltaAreaHighlight() === true) {
						$chartdeltaArea.style.opacity = 0.0;
					}
				}
				var oForwardMarker = document.getElementById(
					aSelectedDeltaLine._getForwardMarker().sId
				);
				var oBackwardMarker = document.getElementById(
					aSelectedDeltaLine._getBackwardMarker().sId
				);
				var oHeaderDeltaArea = document.getElementById(
					aSelectedDeltaLine._getHeaderDeltaArea().sId
				);
				var markerStroke = Parameters.get("sapUiChartDataPointBorderColor");
				if (aSelectedDeltaLine.getVisibleDeltaStartEndLines()) {
					var oStartLine = document.getElementById(aSelectedDeltaLine._getStartLine().sId);
					var oEndLine = document.getElementById(aSelectedDeltaLine._getEndLine().sId);
					var oHeaderStartLine = document.getElementById(
						aSelectedDeltaLine._getHeaderStartLine().sId
					);
					var oHeaderEndLine = document.getElementById(
						aSelectedDeltaLine._getHeaderEndLine().sId
					);
					oStartLine.style.strokeDasharray = aSelectedDeltaLine.getStrokeDasharray();
					oEndLine.style.strokeDasharray = aSelectedDeltaLine.getStrokeDasharray();
					oHeaderStartLine.style.strokeDasharray = aSelectedDeltaLine.getStrokeDasharray();
					oHeaderEndLine.style.strokeDasharray = aSelectedDeltaLine.getStrokeDasharray();
					oStartLine.style.strokeWidth = aSelectedDeltaLine._getStrokeWidth();
					oEndLine.style.strokeWidth = aSelectedDeltaLine._getStrokeWidth();
					oHeaderStartLine.style.strokeWidth = aSelectedDeltaLine._getStrokeWidth();
					oHeaderEndLine.style.strokeWidth = aSelectedDeltaLine._getStrokeWidth();
				}
				oForwardMarker.style.fillOpacity = 0;
				oBackwardMarker.style.fillOpacity = 0;
				oHeaderDeltaArea.style.opacity = 1;
				oHeaderDeltaArea.style.cursor = "pointer";
				oForwardMarker.style.stroke = null;
				oBackwardMarker.style.stroke = null;
				if (aSelectedDeltaLine._getVisibleMarker() === true) {
					oForwardMarker.style.fillOpacity = 1;
					oBackwardMarker.style.fillOpacity = 1;
					oForwardMarker.style.stroke = markerStroke;
					oBackwardMarker.style.stroke = markerStroke;
				}
				var oResizeExtension = oGantt._getResizeExtension();
				oResizeExtension.clearAllDeltaOutline();
				aSelectedDeltaLine._setIsSelected(false);
			}
		},

		/**
		 * returns true if the adhoc lines are present for which the marker type is not none and if they are to be shown from the settings dialog
		 * @param {sap.gantt.simple.GanttChartWithTable} oGantt - Instance of Gantt Chart
		 *
		 * @returns {sap.gantt.simple.AdhocLine} returns adhoc lines are present for which the marker type is not none and if they are to be shown from the settings dialog
		 */
		adhocLinesPresentAndEnabled : function(oGantt){
			return oGantt.getSimpleAdhocLines().filter(function(oAdhocLine){return oAdhocLine.MarkerType != MarkerType.None; }).length > 0 && oGantt.getEnableAdhocLine();
		},

		/**
		 * Adds the toolbar considering the parameters on the gantt chart
		 * @param {object} oScope scope of the calling function
		 * @param {object} oTable table object of the Gantt Chart
		 * @param {boolean} isExportToExcel boolean to know where the function is called from
		 */
		addToolbarToTable: function (oScope, oTable, isExportToExcel){
			if (isExportToExcel){
				if (oTable.getExtension().length == 0) { //If Table.extension is not present, add a new extension and the Export button.
					var oOverFlowToolBar = new OverflowToolbar();
					oOverFlowToolBar.addContent(oScope.oExportTableToExcelButton);
					oTable.addExtension(oOverFlowToolBar);
				} else {
					oTable.getExtension()[0].addContent(oScope.oExportTableToExcelButton);//Add the Export button to the existing Table.extension.
				}
			}
		},

		findSpaceInLevel: function(level, shape, startTime, endTime, schemeRowSpanMap, oRowWithSpan) {
			//traverse shapesWithRowLevels object by levels
			// exitRowTraversingLoop = false;
			for (var j = 0; j < shapesWithRowLevels[level].length; j++) {
				//traverse shapes inside a level of shapesWithRowLevels object
				if (exitRowTraversingLoop) {
					return;
				}
				var ganttRowOverlay = shape.getParent().getParent();
				if (ganttRowOverlay && ganttRowOverlay.isA("sap.gantt.overlays.GanttRowOverlay")){
					return;
				}
				var currEndTime = endTime, prevEndTime = endTime, nextEndTime = endTime, iShapeRowSpan = schemeRowSpanMap && schemeRowSpanMap[shape.getScheme && shape.getScheme()];
				if (BaseObject.isA(shape, "sap.gantt.simple.AdhocLine")) {
					currEndTime = startTime;
				}
				if (BaseObject.isA(shapesWithRowLevels[level][j], "sap.gantt.simple.AdhocLine")) {
					prevEndTime = startTime;
				}
				if (BaseObject.isA(shapesWithRowLevels[level][j + 1], "sap.gantt.simple.AdhocLine")) {
					nextEndTime = startTime;
				}
				if (shapesWithRowLevels[level].length > 1) {
					//check if shapesWithRowLevels object has more than one shape in a level
					if (j === 0 && (shape[currEndTime]() <= shapesWithRowLevels[level][j][startTime]() ||
					(shape[currEndTime]() > shapesWithRowLevels[level][j][startTime]() && (shape[currEndTime]() - shapesWithRowLevels[level][j][startTime]()) <= 1000)) &&
					!(this._stringToDateObject(shape[startTime]()).getTime() === this._stringToDateObject(shapesWithRowLevels[level][j][startTime]()).getTime() && this._stringToDateObject(shape[currEndTime]()).getTime() === this._stringToDateObject(shapesWithRowLevels[level][j][prevEndTime]()).getTime())) {
						//check if incoming shape to be plotted can be plotted before the first shape of a level
						shapesWithRowLevels[level].push(shape);
						oRowWithSpan["level" + level] = (oRowWithSpan["level" + level] > iShapeRowSpan) ? oRowWithSpan["level" + level] : iShapeRowSpan;
						exitShapeTraversingLoop = true;
					} else if (shapesWithRowLevels[level][j + 1] !== undefined &&
						((shape[startTime]() >= shapesWithRowLevels[level][j][prevEndTime]() && shape[currEndTime]() <= shapesWithRowLevels[level][j + 1][startTime]()) ||
						(shape[startTime]() < shapesWithRowLevels[level][j][prevEndTime]() && ((shapesWithRowLevels[level][j][prevEndTime]() - shape[startTime]()) <= 1000) &&
						((shape[currEndTime]() > shapesWithRowLevels[level][j + 1][startTime]() && ((shape[currEndTime]() - shapesWithRowLevels[level][j + 1][startTime]()) <= 1000)) ||
						shape[currEndTime]() <= shapesWithRowLevels[level][j + 1][startTime]())) ||
						(shape[currEndTime]() > shapesWithRowLevels[level][j + 1][startTime]() && ((shape[currEndTime]() - shapesWithRowLevels[level][j + 1][startTime]()) <= 1000) &&
						(shape[startTime]() >= shapesWithRowLevels[level][j][prevEndTime]() ||
						(shape[startTime]() < shapesWithRowLevels[level][j][prevEndTime]() && ((shapesWithRowLevels[level][j][prevEndTime]() - shape[startTime]()) <= 1000))))) &&
						!((this._stringToDateObject(shape[startTime]()).getTime() === this._stringToDateObject(shapesWithRowLevels[level][j][startTime]()).getTime() && this._stringToDateObject(shape[currEndTime]()).getTime() === this._stringToDateObject(shapesWithRowLevels[level][j][prevEndTime]()).getTime()) ||
						(this._stringToDateObject(shape[startTime]()).getTime() === this._stringToDateObject(shapesWithRowLevels[level][j + 1][startTime]()).getTime() && this._stringToDateObject(shape[currEndTime]()).getTime() === this._stringToDateObject(shapesWithRowLevels[level][j + 1][nextEndTime]()).getTime()))) {
						//check if incoming shape to be plotted can be plotted in-between the shapes of a level
						shapesWithRowLevels[level].push(shape);
						oRowWithSpan["level" + level] = (oRowWithSpan["level" + level] > iShapeRowSpan) ? oRowWithSpan["level" + level] : iShapeRowSpan;
						exitShapeTraversingLoop = true;
					} else if (j === shapesWithRowLevels[level].length - 1 &&
						(shape[startTime]() >= shapesWithRowLevels[level][j][prevEndTime]() ||
						(shape[startTime]() < shapesWithRowLevels[level][j][prevEndTime]() && ((shapesWithRowLevels[level][j][prevEndTime]() - shape[startTime]()) <= 1000))) &&
						!(this._stringToDateObject(shape[startTime]()).getTime() === this._stringToDateObject(shapesWithRowLevels[level][j][startTime]()).getTime() && this._stringToDateObject(shape[currEndTime]()).getTime() === this._stringToDateObject(shapesWithRowLevels[level][j][prevEndTime]()).getTime())) {
						//check if incoming shape to be plotted can be plotted after the last shapes of a level
						shapesWithRowLevels[level].push(shape);
						oRowWithSpan["level" + level] = (oRowWithSpan["level" + level] > iShapeRowSpan) ? oRowWithSpan["level" + level] : iShapeRowSpan;
						exitShapeTraversingLoop = true;
					} else if (this._stringToDateObject(shape[startTime]()).getTime() === this._stringToDateObject(shapesWithRowLevels[level][j][startTime]()).getTime() && this._stringToDateObject(shape[currEndTime]()).getTime() === this._stringToDateObject(shapesWithRowLevels[level][j][prevEndTime]()).getTime()) {
						//check if incoming shape to be plotted has exactly the same start and end time of the existing shapes
						if (parseInt(level) === Object.keys(shapesWithRowLevels).length - 1) {
							shapesWithRowLevels[parseInt(level) + 1] = [shape];
							oRowWithSpan["level" + (parseInt(level) + 1)] = iShapeRowSpan;
							exitShapeTraversingLoop = true;
						} else {
							exitShapeTraversingLoop = false;
						}
					} else if (j === shapesWithRowLevels[level].length - 1 && parseInt(level) === Object.keys(shapesWithRowLevels).length - 1) {
							//plot shape in next level if no space has been found in all the levels
							shapesWithRowLevels[parseInt(level) + 1] = [shape];
							oRowWithSpan["level" + (parseInt(level) + 1)] = iShapeRowSpan;
							exitShapeTraversingLoop = true;
						} else {
							//continue traversing shapesWithRowLevels object to find space for incoming shape
							exitShapeTraversingLoop = false;
						}
				} else {
					//if shapesWithRowLevels object has only one shape in a level
					if (((shape[startTime]() >= shapesWithRowLevels[level][j][prevEndTime]()
					 || (shape[startTime]() < shapesWithRowLevels[level][j][prevEndTime]() && ((shapesWithRowLevels[level][j][prevEndTime]() - shape[startTime]()) <= 1000))) ||
					(shape[currEndTime]() <= shapesWithRowLevels[level][j][startTime]() || (shape[currEndTime]() > shapesWithRowLevels[level][j][startTime]() && ((shape[currEndTime]() - shapesWithRowLevels[level][j][startTime]()) <= 1000)))) &&
					!(this._stringToDateObject(shape[startTime]()).getTime() === this._stringToDateObject(shapesWithRowLevels[level][j][startTime]()).getTime() && this._stringToDateObject(shape[currEndTime]()).getTime() === this._stringToDateObject(shapesWithRowLevels[level][j][prevEndTime]()).getTime())) {
						//check if incoming shape to be plotted can be plotted before or after the shape of a level
						shapesWithRowLevels[level].push(shape);
						oRowWithSpan["level" + level] = (oRowWithSpan["level" + level] > iShapeRowSpan) ? oRowWithSpan["level" + level] : iShapeRowSpan;
						exitShapeTraversingLoop = true;
					} else if (this._stringToDateObject(shape[startTime]()).getTime() === this._stringToDateObject(shapesWithRowLevels[level][j][startTime]()).getTime() && this._stringToDateObject(shape[currEndTime]()).getTime() === this._stringToDateObject(shapesWithRowLevels[level][j][prevEndTime]()).getTime()) {
						//check if incoming shape to be plotted has exactly the same start and end time of the existing shapes
						if (parseInt(level) === Object.keys(shapesWithRowLevels).length - 1) {
							shapesWithRowLevels[parseInt(level) + 1] = [shape];
							oRowWithSpan["level" + (parseInt(level) + 1)] = iShapeRowSpan;
							exitShapeTraversingLoop = true;
						} else {
							exitShapeTraversingLoop = false;
						}
					} else if (parseInt(level) === Object.keys(shapesWithRowLevels).length - 1) {
							//plot shape in next level if no space is found in all the levels
							shapesWithRowLevels[parseInt(level) + 1] = [shape];
							oRowWithSpan["level" + (parseInt(level) + 1)] = iShapeRowSpan;
							exitShapeTraversingLoop = true;
						} else {
							//continue traversing shapesWithRowLevels object to find space for incoming shape
							exitShapeTraversingLoop = false;
						}
				}
				if (exitShapeTraversingLoop) {
					//exit traversing shapesWithRowLevels object when space is found
					j = shapesWithRowLevels[level].length;
					exitRowTraversingLoop = true;
					shapesWithRowLevels = this.sortShapesByTime(shapesWithRowLevels, level, startTime);		//sort shapes in a level by ascending time property
				}
			}
		},

		sortShapesByTime: function (sortedShapesWithRowLevels, level, startTime) {
			//sort shapes in a level by ascending time property
			var length = sortedShapesWithRowLevels[level].length;
			var swapped;
			do {
				swapped = false;
				for (var i = 0; i < length; i++) {
					if (sortedShapesWithRowLevels[level][i + 1] !== undefined) {
						if (sortedShapesWithRowLevels[level][i][startTime]() > sortedShapesWithRowLevels[level][i + 1][startTime]()) {
							var temp = sortedShapesWithRowLevels[level][i];
							sortedShapesWithRowLevels[level][i] = sortedShapesWithRowLevels[level][i + 1];
							sortedShapesWithRowLevels[level][i + 1] = temp;
							swapped = true;
						}
					}
				}
			} while (swapped);
			return sortedShapesWithRowLevels;
		},
		/**
		 * This method partitions the shapes into overlapping ranges
		 * @param {array} shapes array of shapes
		 * @param {string} startTimeProperty start time on Gantt chart
		 * @param {string} endTimeProperty end time on Gantt chart
		 * @returns {array} array of array of shapes
		 * @private
		 */
		_partitionShapesIntoOverlappingRanges: function (shapes, startTimeProperty, endTimeProperty, oGantt, oRowWithSpan) {
			shapesWithRowLevels = {};
			var sGetStartTime = "get" + startTimeProperty.charAt(0).toUpperCase() + startTimeProperty.slice(1);
			var sGetEndTime = "get" + endTimeProperty.charAt(0).toUpperCase() + endTimeProperty.slice(1);
			if (shapes.length > 0) {
				var ganttRowOverlay = shapes[0].getParent().getParent();
				if (!(ganttRowOverlay && ganttRowOverlay.isA("sap.gantt.overlays.GanttRowOverlay"))){
					shapesWithRowLevels[0] = [shapes[0]];
					if (!oRowWithSpan){
						oRowWithSpan = {};
					}
					if (shapes[0].getScheme){
						oRowWithSpan["level0"] = oGantt && oGantt.schemeRowSpanMap && oGantt.schemeRowSpanMap[shapes[0].getScheme()];
					}
				}
			}
			for (var i = 1, l = shapes.length; i < l; i++) {
				//traverse shapes to be plotted
				exitRowTraversingLoop = false;
				for (var level in shapesWithRowLevels) {
					this.findSpaceInLevel(level, shapes[i], sGetStartTime, sGetEndTime, oGantt && oGantt.schemeRowSpanMap, oRowWithSpan);
				}
			}
			return {
				shapesWithRowLevels:shapesWithRowLevels,
				internalRowWithSpan:oRowWithSpan
			};
		},
		_stringToDateObject: function (sString) {
			if (typeof (sString) === "string" && sString.length > 0) {
				return Format.abapTimestampToDate(sString);
			}
			return sString;
		},
		_getExpandedChildArray: function(aChild, oGantt, aShapeSchemeKeys, childArraay){
			var sStartDate, sEndDate;
			aChild.forEach(function(oChild) {
				//For BaseConditionalShape
				if (BaseObject.isA(oChild, "sap.gantt.simple.BaseConditionalShape")) {
					var oActiveShape = oChild._getActiveShapeElement();
					if (aShapeSchemeKeys.indexOf(oActiveShape.getScheme()) > -1 || oGantt.getEnablePseudoShapes()){
						if (BaseObject.isA(oActiveShape, "sap.gantt.simple.BaseGroup")) {
							sStartDate = null;
							sEndDate = null;
							oActiveShape.getShapes().forEach(function(oShape) {
								if (!sStartDate && !sEndDate) {
									sStartDate = oShape.getTime();
									sEndDate = oShape.getEndTime();
								} else {
									if (oShape.getTime() < sStartDate) {
										sStartDate = oShape.getTime();
									}
									if (oShape.getEndTime() >= sEndDate) {
										sEndDate = oShape.getEndTime();
									}
								}
							});
							oActiveShape.setProperty("time", sStartDate, true);
							oActiveShape.setProperty("endTime", sEndDate, true);
							childArraay = childArraay.concat(oActiveShape);
						} else if (oActiveShape) {
							childArraay = childArraay.concat(oActiveShape);
							}
					}
				} else if (BaseObject.isA(oChild, "sap.gantt.simple.BaseGroup")) {	//For BaseGroup
					sStartDate = null;
					sEndDate = null;
					oChild.getShapes().forEach(function(oShape) {
						if (!sStartDate && !sEndDate) {
							sStartDate = oShape.getTime();
							sEndDate = oShape.getEndTime();
						} else {
							if (oShape.getTime() < sStartDate) {
								sStartDate = oShape.getTime();
							}
							if (oShape.getEndTime() >= sEndDate) {
								sEndDate = oShape.getEndTime();
							}
						}
					});
					oChild.setProperty("time", sStartDate, true);
					oChild.setProperty("endTime", sEndDate, true);
					childArraay = childArraay.concat(oChild);
				} else {
					childArraay = childArraay.concat(oChild);
				}
			});
			return childArraay;
		},
		/**
		 * This method calculates the level of shapes based on start and end time
		 * @param {sap.gantt.simple.BaseShape} allShapes on Gantt chart
		 * @param {string} startTimeProperty start time on Gantt chart
		 * @param {string} endTimeProperty end time on Gantt chart
		 * @param {boolean} bLines boolean set to true if function is called for adhocLines or deltaLines
		 * @returns {object} oResult which contains shapes with the level assigned and maximum level of the shapes
		 */
		calculateLevelForShapes: function (allShapes, startTimeProperty, endTimeProperty, bLines, oGantt, oInternalRowWithSpan) {
			var fnFlatten = function (arr) {
				return arr.reduce(function (flat, toFlatten) {
					return flat.concat(
						Array.isArray(toFlatten) ? fnFlatten(toFlatten) : toFlatten
					);
				}, []);
			};

			var oShapesWithRowSpan = this._partitionShapesIntoOverlappingRanges(allShapes, startTimeProperty, endTimeProperty, oGantt, oInternalRowWithSpan);
			var aRanges = oShapesWithRowSpan.shapesWithRowLevels;
			oInternalRowWithSpan = oShapesWithRowSpan.internalRowWithSpan;
			var iMaxLevel = 0;
			var aRangesUpdated = Object.values(aRanges).map(function (shapeGroup, index) {
				shapeGroup.map(function (shape) {
					var iLevel = index + 1;
					if (shape._setLevel) {
						shape._setLevel(iLevel);
					}
					shape._level = iLevel;
					var oRowSettings = shape.getParentRowSettings && shape.getParentRowSettings(), shapeId = shape.getShapeId && shape.getShapeId();
					if (oRowSettings && oRowSettings._overlayShapeIdList && shapeId && oRowSettings._overlayShapeIdList[shapeId]){
						oRowSettings._overlayShapeIdList[shapeId] = shape._level;
					}

					if (iMaxLevel < iLevel) {
						iMaxLevel = iLevel;
					}
					return shape;
				});
				return shapeGroup;
			});

			var aShapes = fnFlatten(aRangesUpdated);
			var oResult = {};
			if (bLines) {
				oResult = {
					adhocLines: aShapes.filter(function (line) {
						return BaseObject.isA(line, "sap.gantt.simple.AdhocLine");
					}),
					deltaLines: aShapes.filter(function (line) {
						return BaseObject.isA(line, "sap.gantt.simple.DeltaLine");
					}),
					maxLevel: iMaxLevel
				};
			} else {
				oResult = {
					shapes: aShapes,
					maxLevel: iMaxLevel
				};
			}
			return {
				childWithLevels : oResult,
				internalRowWithSpan : oInternalRowWithSpan};
		},

			/**
			 * Gets all the immediate successor shapes
			 * @param {object} oShape shape's instance
			 * @param {sap.gantt.simple.GanttChartWithTable} oGantt Gantt's instance
			 * @returns {array} array of the successor shapes
			 */
			getShapeSuccessors: function(oShape, oGantt) {
				var aShapesToSelect = [];

				// Get successors only if chain selection is enabled for the shape
				if (oShape.getEnableChainSelection()) {
					var aVisibleRls = this._getVisibleRelationships(oGantt);
					var aAssociatedRls = aVisibleRls.filter(function(x){
						return  x.getPredecessor() === oShape.getShapeId();
					});

					aAssociatedRls.forEach(function(rel){
						var mShape = rel.getRelatedInRowShapes(oGantt.getId());
						if (mShape.successor) {
							aShapesToSelect.push(mShape.successor);
						}
					});
					aShapesToSelect = Array.from(new Set(aShapesToSelect));
				}
				return aShapesToSelect;
			},

			/**
			 * Gets all the immediate predecessor shapes
			 * @param {object} oShape shape's instance
			 * @param {sap.gantt.simple.GanttChartWithTable} oGantt Gantt's instance
			 * @returns {array} array of the predecessor shapes
			 */
			getShapePredeccessors: function(oShape, oGantt) {
				var aShapesToSelect = [];

				// Get predecessors only if chain selection is enabled for the shape
				if (oShape.getEnableChainSelection()) {
					var aVisibleRls = this._getVisibleRelationships(oGantt);
					var aAssociatedRls = aVisibleRls.filter(function(x){
						return  x.getSuccessor() === oShape.getShapeId();
					});

					aAssociatedRls.forEach(function(rel){
						var mShape = rel.getRelatedInRowShapes(oGantt.getId());
						if (mShape.predecessor) {
							aShapesToSelect.push(mShape.predecessor);
						}
					});
					aShapesToSelect = Array.from(new Set(aShapesToSelect));
				}

				return aShapesToSelect;
			},

			/**
			 * Selects a shape along with its successors and predecessors
			 * @param {object} mParam shape's instance and event parameters
			 * @param {sap.gantt.GanttChartWithTable} oGantt GanttChart's instance
			 * @returns {array} aShapes the array of shapes which got selected
			 */
			selectAssociatedShapes: function(mParam, oGantt) {
				var oSelectedShape = mParam.shape;
				var oDragDropExtension = oGantt._getDragDropExtension();
				var bNewSelected = !oSelectedShape.getSelected();

				// Check if primary shape is selected or deselected
				if (oDragDropExtension.shapeSelectedOnMouseDown && !oDragDropExtension.initiallySelected && !oGantt.getEnableSelectAndDrag()){
					bNewSelected = oDragDropExtension.shapeSelectedOnMouseDown;
				}

				// Fetch shapes that are required to be changed
				var aShapes = [oSelectedShape];
				if (oSelectedShape.getEnableChainSelection()) {
					aShapes = this._getShapesToSelect(oSelectedShape, oGantt);
					// Update them based on selected flag
					aShapes.forEach(function(shape){
						this.oSelection.updateShape(shape.getShapeUid(), {
							selected: bNewSelected,
							ctrl: true,
							draggable: shape.getDraggable(),
							time: shape.getTime(),
							endTime: shape.getEndTime()
						});
					}.bind(oGantt));
				}
				return aShapes;
			},

			/**
			 * Gets all the immediate shapes related to the shape to be selected
			 * @param {object} oSelectedShape shape's instance
			 * @param {sap.gantt.simple.GanttChartWithTable} oGantt Gantt's instance
			 * @returns {array} array of the successor shapes
			 * @private
			 */
			_getShapesToSelect: function(oSelectedShape, oGantt) {
				var aShapesToSelect = [oSelectedShape];
				var aVisibleRls = this._getVisibleRelationships(oGantt);

				// Getting the related first level relationships
				var aAssociatedRls = aVisibleRls.filter(function(x){
					return  x.getPredecessor() === oSelectedShape.getShapeId() || x.getSuccessor() === oSelectedShape.getShapeId();
				});

				// Extract shapes from associated relationships
				aAssociatedRls.forEach(function(rel){
					var mShape = rel.getRelatedInRowShapes(oGantt.getId());
					if (mShape.predecessor && mShape.predecessor.getSelectableInChainSelection()) {
						aShapesToSelect.push(mShape.predecessor);
					}
					if (mShape.successor && mShape.successor.getSelectableInChainSelection()) {
						aShapesToSelect.push(mShape.successor);
					}
				});

				// Remove duplicates, if any
				aShapesToSelect = Array.from(new Set(aShapesToSelect));
				return aShapesToSelect;
			},

			/**
			 * Gets all the visible relationships on the Gantt
			 * @param {sap.gantt.simple.GanttChartWithTable} oGantt Gantt's instance
			 * @returns {array} array of the all visible relatioships on the GanttChart
			 * @private
			 */
			_getVisibleRelationships: function(oGantt){
				var aRelationships = [];
				oGantt.getTable().getRows().forEach(function(row){
					var aRls = row.getAggregation('_settings').getRelationships();
					aRelationships = aRelationships.concat(aRls);
				});
				aRelationships = Array.from(new Set(aRelationships));
				return aRelationships;
			},

			/**
			 * Rerender all relationships associated with the shape
			 * @param {sap.gantt.simple.GanttChartWithTable} oGantt Gantt's instance
			 * @param {object} oShape shape's intance
			 */
			rerenderAssociatedRelationships: function (oGantt, oShape) {
				var oRm = new RenderManager();
				var allConnectedRelationships = [];
				var aVisibleRls = this._getVisibleRelationships(oGantt);
				aVisibleRls.forEach(function (x) {
					if (x.getSuccessor() === oShape.getShapeId() || x.getPredecessor() === oShape.getShapeId()) {
						allConnectedRelationships.push(x);
					}
				});
				allConnectedRelationships.forEach(function (oRlsInst) {
					oRlsInst.renderElement(oRm, oRlsInst, oGantt.getId());
				});
			},

			/**
			 * filter out Dulicate and 'None' Shape Types.
			 * @param {Array} shapeTypes list.
			 * @returns {Array} Filtered List.
			 */
			getFilteredShapeType: function (shapeTypes) {
				shapeTypes = Array.from(new Set(shapeTypes));
				return shapeTypes.filter(function (val) {
					return val !== "None";
				});

			},

			/**
		 	* Takes path with sharp corners and bends them using cubic curves.
		 	* @param {string} sPath path with sharp edges.
		 	* @param {number} fRadius arc radius of bent corners.
		 	* @returns {string} Path with bent corners.
		 	*/
			 getPathCorners: function (sPath, fRadius ) {
				var sTemp = sPath.replace(/([A-Z])/g, ' $1');
				var aResultSteps = [],
				sResult;
				var aPathParts = sTemp.split(/[,\s]/).reduce(function (aParts, sPart) {
				var a = sPart.match("([a-zA-Z])(.+)");
				if (a) {
					aParts.push(a[1]);
					aParts.push(a[2]);
				} else {
					aParts.push(sPart);
				}

				return aParts;
			}, []);

			//Spliting path to each steps
			var aSteps = aPathParts.reduce(function (aSteps, fPart) {
				if (parseFloat(fPart) == fPart && aSteps.length) {
					aSteps[aSteps.length - 1].push(fPart);
				} else {
					aSteps.push([fPart]);
				}

				return aSteps;
			}, []);

			//generates new coordinates for start and end points of curve
			function fnShiftInDirection(oPointFrom, oPointTo, fMagnitude) {
				var fDiffX = oPointTo.x - oPointFrom.x;
				var fDiffY = oPointTo.y - oPointFrom.y;
				var fDist = Math.sqrt(fDiffX * fDiffX + fDiffY * fDiffY);

				return fnPartialShiftInDirection(
					oPointFrom,
					oPointTo,
					Math.min(1, fMagnitude / fDist)
				);
			}

			function fnPartialShiftInDirection(oPointFrom, oPointTo, fPart) {
				return {
					x: oPointFrom.x + (oPointTo.x - oPointFrom.x) * fPart,
					y: oPointFrom.y + (oPointTo.y - oPointFrom.y) * fPart
				};
			}

			// adjusting steps array after adding curved coordinated
			function fnAdjustStep(aStep, oPoint) {
				if (aStep.length > 2) {
					aStep[aStep.length - 2] = oPoint.x;
					aStep[aStep.length - 1] = oPoint.y;
				}
			}

			function fnGetPointOfStep(aStep) {
				return {
					x: parseFloat(aStep[aStep.length - 2]),
					y: parseFloat(aStep[aStep.length - 1])
				};
			}

			if (aSteps.length > 1) {
				var oStartPoint = fnGetPointOfStep(aSteps[0]),
					aCloseLine = null;

				if (aSteps[aSteps.length - 1][0] == "Z" && aSteps[0].length > 2) {
					aCloseLine = ["L", oStartPoint.x, oStartPoint.y];
					aSteps[aSteps.length - 1] = aCloseLine;
				}

				aResultSteps.push(aSteps[0]);

				for (var iStep = 1; iStep < aSteps.length; iStep++) {
					var aPrevStep = aResultSteps[aResultSteps.length - 1],
						aCurrStep = aSteps[iStep],
						aNextStep = aCurrStep == aCloseLine ? aSteps[1] : aSteps[iStep + 1],
						fShiftedRadius = fRadius;
					if (
						aNextStep &&
						aPrevStep &&
						aPrevStep.length > 2 &&
						aCurrStep[0] == "L" &&
						aNextStep.length > 2 &&
						aNextStep[0] == "L"
					) {
						var oPrevPoint = fnGetPointOfStep(aPrevStep),
							oCurrPoint = fnGetPointOfStep(aCurrStep),
							oNextPoint = fnGetPointOfStep(aNextStep),
							oCurveStart,
							oCurveEnd,
							fPrevDistance = Math.abs(oPrevPoint.x - oCurrPoint.x) +
											Math.abs(oPrevPoint.y - oCurrPoint.y),
							fNextDistance = Math.abs(oNextPoint.x - oCurrPoint.x) +
											Math.abs(oNextPoint.y - oCurrPoint.y),
							fRadiusToUse = Math.max(Math.min(fShiftedRadius, fPrevDistance, fNextDistance / 2) , 1);

						oCurveStart = fnShiftInDirection(oCurrPoint, oPrevPoint, fRadiusToUse );
						oCurveEnd = fnShiftInDirection( oCurrPoint, oNextPoint, fRadiusToUse );

						fnAdjustStep(aCurrStep, oCurveStart);
						aCurrStep.origPoint = oCurrPoint;
						aResultSteps.push(aCurrStep);

						var oStartControl = fnPartialShiftInDirection(
								oCurveStart,
								oCurrPoint,
								0.5
							),
							oEndControl = fnPartialShiftInDirection(
								oCurrPoint,
								oCurveEnd,
								0.5
							),
							aCurveStep = [
								"C",
								oStartControl.x,
								oStartControl.y,
								oEndControl.x,
								oEndControl.y,
								oCurveEnd.x,
								oCurveEnd.y
							];

						aCurveStep.origPoint = oCurrPoint;
						aResultSteps.push(aCurveStep);
					} else {
						aResultSteps.push(aCurrStep);
					}
				}

				if (aCloseLine) {
					var oNewStartPoint = fnGetPointOfStep(
						aResultSteps[aResultSteps.length - 1]
					);
					aResultSteps.push(["Z"]);
					fnAdjustStep(aResultSteps[0], oNewStartPoint);
				}
			} else {
				aResultSteps = aSteps;
			}

			sResult = aResultSteps.reduce(function (s, c) {
				return s + c.join(" ") + " ";
			}, "");

			return sResult;
			 },

			 arrayMove: function(arr, oldIdx, newIdx){
				if (newIdx >= arr.length) {
					var k = newIdx - arr.length + 1;
					while (k--) {
						arr.push(undefined);
					}
				}
				arr.splice(newIdx, 0, arr.splice(oldIdx, 1)[0]);
				return arr;
			 },
			//Determines the length to have a bend.
			getEdgePoint: function (oGantt) {
				var edgePoint = 2;
				var existingShapes = ["Arrow", "None"];
				var aVisibleRls = this._getVisibleRelationships(oGantt);
				aVisibleRls.forEach(function (x) {
					if (x.getPredecessor() !== undefined && x.getSuccessor() !== undefined && (x.getShapeTypeStart() !== "None" || existingShapes.indexOf(x.getShapeTypeEnd()) == -1) || oGantt.getRelationshipShapeSize() ==  sap.gantt.simple.relationshipShapeSize.Large) {
						edgePoint = 3;
					}
				});
				return edgePoint;
			},
			/**
			 * get time label using x coordinate
			 * @param oEvent
			 * @param oAxisTime
			 * @param oLocale
			 * @param svg
			 */
			getTimeLabel : function (oEvent, oAxisTime, oLocale, svg) {
				var mPoint = CoordinateUtils.getEventSVGPoint(svg, oEvent);
				var oLocalTime, oZoomStrategy;

				oZoomStrategy = oAxisTime.getZoomStrategy();
				oLocalTime = oAxisTime.viewToTime(mPoint.x);

				return Utility.getLowerCaseLabel(oLocale.getFormattedDate(oZoomStrategy.getLowerRowFormatter(), oLocalTime));
			},

			/**
			 * Find and return all visual elements.
			 * i.e. shapes, adhoclines, deltalines, non-working time etc.
			 * @param {DOM} oSvg Dom refernce of ganttSvg.
			 * @param {string} parentSelector parent selector of visual element.
			 * @param {string} elementSelector selector of the element.
			 * @returns {array} list of visual elements.
			 */
			getVisibleElements: function(oSvg, parentSelector, elementSelector) {
				return Array.from(oSvg.querySelectorAll(parentSelector)).
						reduce(function(acc,item) {
							return acc.concat(Array.from(item.querySelectorAll(elementSelector)));
						},[]);
			},

			/**
			 * return true if horizontalTextAlignment for shape or calendar is dynamic
			 * @returns {boolean}
			 */
			isDynamicText : function () {
				var horizontalTextAlignment = library.simple.horizontalTextAlignment;
				var dynamicText = false;
				var aShapes = Array.from(document.querySelectorAll(".sapGanttChartSvg .sapGanttChartShapes .baseShapeSelection")).filter(function(shape){
					if (!shape.classList.contains("sapGanttTextNoPointerEvents") && shape.tagName != "text"){
						return shape;
					}
				});

				aShapes.forEach(function(oHtmlShape) {
					var iUid = oHtmlShape.closest("[data-sap-ui]").getAttribute("data-sap-ui");
					var oShape = Element.getElementById(iUid);
					if (oShape && !dynamicText) {
						if (BaseObject.isA(oShape, "sap.gantt.simple.BaseConditionalShape")) {
							var oActiveShape = oShape._getActiveShapeElement();

							if (BaseObject.isA(oActiveShape, "sap.gantt.simple.BaseGroup")) {
								oActiveShape.getShapes().forEach(function(oShape) {
									if (oShape.getHorizontalTextAlignment() === horizontalTextAlignment.Dynamic) {
										dynamicText = true;
									}
								});
							} else if (oShape.getHorizontalTextAlignment() === horizontalTextAlignment.Dynamic) {
									dynamicText = true;
								}
						} else if (BaseObject.isA(oShape, "sap.gantt.simple.MultiActivityGroup")) {
							if (oShape.getTask().getHorizontalTextAlignment() === horizontalTextAlignment.Dynamic) {
								dynamicText = true;
							}
						} else if (BaseObject.isA(oShape, "sap.gantt.simple.BaseGroup")) {
							oShape.getShapes().forEach(function(oShape) {
								if (oShape.getHorizontalTextAlignment() === horizontalTextAlignment.Dynamic) {
									dynamicText = true;
								}
							});
						} else if (oShape.getHorizontalTextAlignment() === horizontalTextAlignment.Dynamic) {
								dynamicText = true;
							}
					}
				});

				if (!dynamicText) {
					var aCalenders = Array.from(document.querySelectorAll(".sapGanttChartSvg .sapGanttChartCalendar .baseShapeSelection")).filter(function(calendar){
						if (!calendar.classList.contains("sapGanttTextNoPointerEvents") && calendar.tagName != "text"){
							return calendar;
						}
					});

					aCalenders.forEach(function(oHtmlCalendar) {
						if (!dynamicText) {
							var iUid = oHtmlCalendar.closest("[data-sap-ui]").getAttribute("data-sap-ui");
							var oCalendar = Element.getElementById(iUid);
							if (oCalendar.getHorizontalTextAlignment() === horizontalTextAlignment.Dynamic) {
								dynamicText = true;
							}
						}
					});
				}

				return dynamicText;
			},

			/**
			 * Sets Lmarker value for relationship instance
			 */
			setLmarker: function(oGantt,oRlsInst,bFlag) {
				var x1 = oRlsInst.mAnchors.predecessor.x, y1 = oRlsInst.mAnchors.predecessor.y;
				var x2 = oRlsInst.mAnchors.successor.x, y2 = oRlsInst.mAnchors.successor.y;
				oRlsInst.setProperty("_lMarker", "", true);
				var vType = oRlsInst.getProcessedType();
				var edgePoint = oGantt._edgePoint;
				if (vType === 1 && x1 <= x2 ) {
					if (GanttChartConfigurationUtils.getRTL() ? oRlsInst.getLShapeForTypeSF() : oRlsInst.getLShapeForTypeFS()) {
							if ((edgePoint == 2 && oRlsInst.getShapeTypeStart() == 'None') ||
								(edgePoint == 3 && Math.abs(x1 - x2) >= edgePoint * 6)) {
								// Determining up or down connection
								if (y1 > y2) {
									oRlsInst.setProperty("_lMarker", "rightUp", true);
								} else {
									oRlsInst.setProperty("_lMarker", "rightDown", true);
							}
						}
					 }
					} else 	if (vType === 2 && x1 >= x2 ) {
						if (GanttChartConfigurationUtils.getRTL() ? oRlsInst.getLShapeForTypeFS() : oRlsInst.getLShapeForTypeSF()) {
							if ((edgePoint == 2 && oRlsInst.getShapeTypeStart() == 'None') ||
								(edgePoint == 3 && Math.abs(x1 - x2) >= edgePoint * 6)) {
								// Determining up or down connection
								if (y1 > y2) {
									oRlsInst.setProperty("_lMarker", "leftUp", true);
								} else {
									oRlsInst.setProperty("_lMarker", "leftDown", true);
								}
							}
						}
					}
					if (bFlag){
						oGantt.relSet[oRlsInst.getShapeId()] = oRlsInst;
					} else {
						oGantt.relSetFake[oRlsInst.getShapeId()] = oRlsInst;
					}

			},
			/**
			 * Calculates shape groups after edit operations performed on shapes inside pseudo shape.
			 */
			pseudoShapeGroupAfterEdit: function(oGantt, trowIndex){
				var aShapeGroups = [], iGroupIndex = 0,  aExpandedShapeIds = oGantt.oOverlapShapeIds && oGantt.oOverlapShapeIds[trowIndex];
				if (aExpandedShapeIds){
					if (aExpandedShapeIds[0]){
						var oShape = GanttUtils.getShapeByShapeId(oGantt.getId(), [aExpandedShapeIds[0]])[0];
						oShape && aShapeGroups.push({
							iShapeCount: 1,
							startTime: oShape.getTime(),
							endTime: oShape.getEndTime()
						});
					}
					for (var i = 1; i < aExpandedShapeIds.length; i++) {
						var oOperation = GanttUtils.getShapeByShapeId(oGantt.getId(), [aExpandedShapeIds[i]])[0];
						if (oOperation){
							var dShapeStartTime = oOperation.getTime(),
							dShapeEndTime = oOperation.getEndTime(),
							oShapeGroup = aShapeGroups[iGroupIndex];
							if (oShapeGroup){
								var dExistingShapeStartTime = oShapeGroup.startTime,
								dExistingShapeEndTime = oShapeGroup.endTime;
								if (dShapeStartTime >= dExistingShapeStartTime && dShapeEndTime <= dExistingShapeEndTime) {
									//fully coinciding do nothing to pseudo shape's start and end time
									oShapeGroup.iShapeCount++;
								} else if (dShapeStartTime >= dExistingShapeStartTime && dShapeStartTime < dExistingShapeEndTime && dShapeEndTime > dExistingShapeEndTime) {
									//when incoming shape partially coincides with pseudo shape
									oShapeGroup.iShapeCount++;
									//update pseudo shape's end time as the incoming shape's end time
									oShapeGroup.endTime = dShapeEndTime;
								} else if (dShapeStartTime >= dExistingShapeEndTime && dShapeEndTime >= dExistingShapeEndTime) {
									//for new pseudo shape, add corresponding object
									iGroupIndex++;
									aShapeGroups.push({
										iShapeCount: 1,
										startTime: dShapeStartTime,
										endTime: dShapeEndTime
									});
								}
							}
						}
					}
				}
				return aShapeGroups;
			},

			/**
			 * Checks if relation instant is valid to be rendered
			 * @returns {boolean}
			 */
			relationexist: function(oGantt,oRlsInst){
				oRlsInst.mRelatedShapes = oRlsInst.getRelatedInRowShapes(oGantt.getId());
				var vType = oRlsInst.getProcessedType();
				oRlsInst.mAnchors = oRlsInst.getRlsAnchors(vType, oRlsInst.mRelatedShapes);
				if (!oRlsInst.getVisible()) { return false; }
				if (!oRlsInst.mRelatedShapes.predecessor && !oRlsInst.mRelatedShapes.successor) { return false; }
				var fnCheckAnchors = function(oAnchor) {
					return oAnchor && !isNaN(parseFloat(oAnchor.x)) && isFinite(oAnchor.x) &&  !isNaN(parseFloat(oAnchor.y)) && isFinite(oAnchor.y);
				};
				if (!fnCheckAnchors(oRlsInst.mAnchors.predecessor) || !fnCheckAnchors(oRlsInst.mAnchors.successor)) {
					return false;
				}
				return true;
			},

				/**
		 * Calculate the number of text letters that can fit in the target length.
		 *
		 * First do a estimation based on the pixels each letter takes in screen and the target length,
		 * And compare three potential values (example: estimatedCount -1, estimatedCount, estimatedCount + 1) with the target length,
		 * IF one of the estimated values fit, then return
		 * ELSE do a binary search to find the most suitable number of text letters that can fit in the target length
		 *
		 * @param {number} iTextTotalLength Total length of the text
		 * @param {number} iTargetLength Truncated width of the text
		 * @param {string} sText Text to display
		 * @param {object} oControl control which contains the "fnMeasureText" function
		 * @param {function} fnMeasureText function to measure width of the text
		 * @param {boolean} bPrint Boolean variable set to true when function is called by GanttPrinting
		 * @param {number} fJsPdfConstant Constant to handle text width for jsPDF
		 * @return {number} Number of characters that should be kept
		 * @private
		 */
		geNumberOfTruncatedCharacters: function (iTextTotalLength, iTargetLength, sText, oControl, fnMeasureText, bPrint, fJsPdfConstant) {
			var nCount = 0;
			fJsPdfConstant = fJsPdfConstant ? fJsPdfConstant : 1;
			if (iTextTotalLength > iTargetLength) {
				if (iTargetLength > 0 && sText.length > 0) {
					nCount = Math.round(iTargetLength / Math.ceil(iTextTotalLength / sText.length));
					while (true) { // eslint-disable-line no-constant-condition
						if (nCount < 0) { break; }

						var	nLen1 = fnMeasureText.apply(oControl, [sText.slice(0, nCount)]);
						var	nLen2 = fnMeasureText.apply(oControl, [sText.slice(0, nCount + 1)]);

						nLen1 = bPrint ? nLen1.width : nLen1 * fJsPdfConstant;
						nLen2 = bPrint ? nLen2.width : nLen2 * fJsPdfConstant;

						if (nLen1 > iTargetLength) { nCount--; continue; }
						if (nLen1 != nLen2 && nLen2 < iTargetLength) { nCount++; continue; }

						break;
					}
				}
			} else {
				return sText ? sText.length : 0;
			}
			return (nCount >= 0 && nCount <= sText.length) ? nCount : 0;
		},

		/**
		 * Calculates the selected shape with minimum start time among all the gantt charts in gantt container
		 * @param {object} oGanttContainer Gantt chart container control
		 * @private
		 */
		_calculateSelectedShapeMinTime: function(oGanttContainer) {
			var that = this;
			var _getShapeWithTime = function(oShape, oGantt) {
				if (!oShape || oShape.isA("sap.gantt.simple.Relationship")) {
					return;
				}
				if (oShape.isA("sap.gantt.simple.BaseConditionalShape")) {
					oShape = oShape._getActiveShapeElement();
				}
				if (oShape.getTime() || oShape.getEndTime()) {
					that._oFoundShape = oShape;
				} else if (oShape instanceof sap.gantt.simple.BaseGroup) {
					if (oGantt.getSelectOnlyGraphicalShape()) {
						oShape._eachChildOfGroup(oShape, function (labelGroup, nonLabelGroup) {
							nonLabelGroup.forEach(function(oChild) {
								if (!that._oFoundShape) {
									_getShapeWithTime(oChild, oGantt);
								}
							});
						});
					} else {
						oShape._eachChildOfGroup(oShape, function (oChild) {
							if (!that._oFoundShape) {
								_getShapeWithTime(oChild, oGantt);
							}
						});
					}
				}
			};

			var oMinGantt, oOverallMinTime, oOverallMinEndTime;
			var bSync = oGanttContainer.getEnableTimeScrollSync();
			var aGanttCharts = oGanttContainer.getGanttCharts();
			var oGanttChart = aGanttCharts[0];
			if (oGanttChart) {
				oOverallMinTime = Format.abapTimestampToDate(oGanttChart.getAxisTimeStrategy().getTotalHorizon().getEndTime());
			}
			aGanttCharts.forEach(function (oGantt) {
				var oMinTime = Format.abapTimestampToDate(oGantt.getAxisTimeStrategy().getTotalHorizon().getEndTime()), oMinEndTime;
				var aSelectedShapeUid = oGantt.getSelectedShapeUid();
				if (aSelectedShapeUid && aSelectedShapeUid.length > 0) {
					var aShapes = this.getShapesWithUid(oGantt.sId, aSelectedShapeUid);
					var oVisibleHorizon = oGantt.getAxisTimeStrategy().getVisibleHorizon();
					var iVisibleHorizonStartTime = Format.abapTimestampToDate(oVisibleHorizon.getStartTime()).getTime();
					var iVisibleHorizonEndTime = Format.abapTimestampToDate(oVisibleHorizon.getEndTime()).getTime();
					aShapes.forEach(function(oShape) {
						this._oFoundShape = null;
						_getShapeWithTime(oShape, oGantt);
						if (this._oFoundShape) {
							var oStartTime = this._oFoundShape.getTime() ? this._oFoundShape.getTime() : this._oFoundShape.getEndTime();
							var oEndTime = this._oFoundShape.getEndTime() ? this._oFoundShape.getEndTime() : this._oFoundShape.getTime();
							var iStartTime = oStartTime.getTime();
							var iEndTime = oEndTime.getTime();
							var bShapeInVisibleHorizon = (iStartTime >= iVisibleHorizonStartTime && iStartTime < iVisibleHorizonEndTime) || (iEndTime > iVisibleHorizonStartTime && iEndTime <= iVisibleHorizonEndTime) || (iStartTime < iVisibleHorizonStartTime && iEndTime > iVisibleHorizonEndTime);
							if (bShapeInVisibleHorizon) {
								if (bSync) {
									if (iStartTime < oOverallMinTime.getTime()) {
										oOverallMinTime = oStartTime;
										oOverallMinEndTime = oEndTime;
										oMinGantt = oGantt;
									}
								} else if (iStartTime < oMinTime.getTime()) {
									oMinTime = oStartTime;
									oMinEndTime = oEndTime;
								}
							}
						}
					}.bind(this));
				}
				if (!bSync && oMinEndTime) {
					oGantt._minTime = oMinTime;
					oGantt._minEndTime = oMinEndTime;
				}
			}.bind(this));
			if (bSync && oMinGantt) {
				oMinGantt._minTime = oOverallMinTime;
				oMinGantt._minEndTime = oOverallMinEndTime;
			}
		}
	};

	return GanttUtils;

}, /* bExport= */ true);
