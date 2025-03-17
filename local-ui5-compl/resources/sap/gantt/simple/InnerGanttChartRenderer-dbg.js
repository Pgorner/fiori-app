/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/Device",
	"sap/ui/core/Core",
	"sap/gantt/simple/BaseLine",
	"sap/gantt/simple/RenderUtils",
	"sap/gantt/simple/GanttExtension",
	"sap/gantt/simple/Relationship",
	"sap/gantt/misc/Format",
	"sap/gantt/misc/Utility",
	"sap/gantt/library",
	"sap/m/Toolbar",
	'./GanttUtils',
	"./AdhocLineRenderer",
	"sap/gantt/simple/DeltaLineRenderer",
	"sap/gantt/simple/AggregationUtils",
	"./BaseText",
	"sap/ui/core/Lib",
	"sap/ui/core/RenderManager"
], function (
	Device,
	Core,
	BaseLine,
	RenderUtils,
	GanttExtension,
	Relationship,
	Format,
	Utility,
	library,
	Toolbar,
	GanttUtils,
	AdhocLineRenderer,
	DeltaLineRenderer,
	AggregationUtils,
	BaseText,
	Lib,
	RenderManager
) {
	"use strict";

	var InnerGanttChartRenderer = {
		apiVersion: 2    // enable in-place DOM patching
	};
	var oAdhocLineLayer = library.AdhocLineLayer;
	var oDeltaLineLayer = library.DeltaLineLayer;

	InnerGanttChartRenderer.render = function (oRm, oControl) {
		performance.mark("InnerGanttChartRenderer.render--start");
		var oGantt = oControl.getParent(),
			bToolbarSettingsItemChanged = oGantt.getParent()._bToolbarSettingsItemChanged;

		if (bToolbarSettingsItemChanged) {
			oGantt.getParent()._bToolbarSettingsItemChanged = false;
			/**
			 * This is required to adjust horizontal scroll bar.
			 * Beacuse whenever zoom In or out event occurs, it add buffer to horizontal scroll bar and adjust it to make the behaviour smooth.
			 * Same should happen whenever any of the toolbar settings item state changes
			 */
			oGantt._getScrollExtension().needRerenderGantt(function(){
				this.renderImmediately(oGantt);
			}.bind(this), 'initialRender', bToolbarSettingsItemChanged);
		} else {
			var aRows = oGantt.getTable().getRows(), bTableUpdateRequired = false;
			oGantt.schemeRowSpanMap = oGantt.schemeRowSpanMap ? oGantt.schemeRowSpanMap : {};
			oGantt.getShapeSchemes().forEach(function(oShapeScheme){
				oGantt.schemeRowSpanMap[oShapeScheme.getKey()] = oShapeScheme.getRowSpan();
			});
			if (aRows.length > 0){
				var iFirstRow = aRows[0].getIndex(), oPrimaryScheme, aVisibleExpandedRows = [];
				oPrimaryScheme = oGantt.getPrimaryShapeScheme();

				oGantt._aExpandedIndices.forEach(function(index){
					var iNewIndex = index - iFirstRow;
					if (iNewIndex >= 0 && (aRows.length - 1) >= iNewIndex){
						aVisibleExpandedRows.push(iNewIndex);
					}
				});
				aVisibleExpandedRows.forEach(function(i){
					var iExpandedIndex = iFirstRow + i;
					var sUid =  aRows[i].getAggregation("_settings").getRowUid();
					var aExpandedData = oGantt._oExpandModel.mExpanded[sUid];
					if (aExpandedData){
						var aExpandSchemes, aShapeSchemes = [], oMain;
						if (aExpandedData[(aExpandedData.length) - 1]){
							for (var index = 1; index < (aExpandedData.length); index++){
								aShapeSchemes.push(aExpandedData[index].scheme);
							}
						}
						aExpandSchemes = oGantt.getShapeSchemes().filter(function(oScheme){
							return aShapeSchemes.indexOf(oScheme.getKey()) > -1;
						});
						if (aExpandSchemes[0] !== undefined || (oGantt.getEnablePseudoShapes() && aExpandedData[(aExpandedData.length) - 1].expandSchemeShape)){
							oGantt._oExpandModel.isTableRowHeightNeedChange(true, oGantt.getTable(), [iExpandedIndex], oPrimaryScheme, aExpandSchemes);
							oMain = oGantt._oExpandModel.getMainRowScheme(sUid);
							if (oGantt._oExpandModel.rowMaxLevelMap && oGantt._oExpandModel.rowMaxLevelMap["row" + iExpandedIndex] !== undefined && oMain !== undefined && oMain.value.numberOfRows !== undefined && oMain.value.numberOfRows !== oGantt._oExpandModel.rowMaxLevelMap["row" + iExpandedIndex] ) {
								oMain.value.numberOfRows = oGantt._oExpandModel.rowMaxLevelMap["row" + iExpandedIndex];
								bTableUpdateRequired = true;
							}
						}
					}
				});
			}
			if (!oGantt.pseudoShapeSpecificData){
				oGantt.pseudoShapeSpecificData = {};
			}
			if (oGantt.getEnablePseudoShapes() == false && oGantt.oOverlapShapeIds){
				var aRowIndex = Object.keys(oGantt.oOverlapShapeIds);
				delete oGantt.oOverlapShapeIds;
				var expandedRowUids = Object.keys(oGantt._oExpandModel.mExpanded);
				aRowIndex.forEach(function(index){
					expandedRowUids.forEach(function(rowUid){
						if (rowUid.endsWith("[" + index + "]")){
							delete oGantt._oExpandModel.mExpanded[rowUid];
						}
					});
				});
				oGantt._aExpandedIndices = oGantt._aExpandedIndices.filter(function(value){
					return aRowIndex.indexOf(value.toString()) == -1;
				});
			}
			oGantt.oExpandedShapesMap = {};
			if (bTableUpdateRequired === true || oGantt.pseudoShapeSpecificData && oGantt.pseudoShapeSpecificData.needUpdateForTasksInAggr){
				bTableUpdateRequired = false;
				if (oGantt.pseudoShapeSpecificData && oGantt.pseudoShapeSpecificData.needUpdateForTasksInAggr){
					oGantt.pseudoShapeSpecificData.isPseudoShapesEnabled = true;
					oGantt._addBackTasksToRows();
					oGantt.pseudoShapeSpecificData.needUpdateForTasksInAggr = false;
				}
				oGantt.getTable().invalidate();
			} else {
				this.renderGanttChart(oRm, oGantt);
				var oGanttScrollExtension = oGantt._getScrollExtension();
				if (!oGanttScrollExtension.mOffsetWidth) {
					oGanttScrollExtension.updateSvgOffsetWidth();
				}
				oGantt._getScrollExtension().scrollGanttChartToVisibleHorizon();
				oGantt.getSyncedControl().scrollContentIfNecessary();
			}
		}

		performance.mark("InnerGanttChartRenderer.render--end");
	};

	InnerGanttChartRenderer.renderGanttChart = function(oRm, oGantt) {
		oRm.openStart("div", oGantt.getId() + "-cnt");
		oRm.class("sapGanttChartCnt");
		oRm.style("height", "100%");
		oRm.style("width", "100%");
		oRm.openEnd();
		this.rerenderAllShapes(oRm, oGantt);
		oRm.close("div");
	};

	InnerGanttChartRenderer.renderImmediately = function(oGantt) {
		var oRm = new RenderManager();
		this.renderGanttChart(oRm, oGantt);

		var oGntCnt = window.document.getElementById(oGantt.getId() + "-gantt");
		if (oGntCnt) {
			oRm.flush(oGntCnt, true /**bDoNotPreserve*/, false/**vInsert*/);
		}
		this.renderRelationships(oRm, oGantt);
		oGantt._updateShapeSelections(oGantt.getSelectedShapeUid(), []);
		oGantt.updateShapeHighlights(oGantt.getHighlightedShapeUid(), []);
		GanttExtension.attachEvents(oGantt);
		if (oGantt.getParent().isA("sap.gantt.simple.GanttChartContainer") && oGantt.getParent().getShowSearchSidePanel()) {
			oGantt.getParent().getSearchSidePanel().setContainerHeight();
		}
		oRm.destroy();
		oGantt.getInnerGantt().fireGanttReady({
			supressEvent: true
		});
	};

	InnerGanttChartRenderer.rerenderAllShapes =  function(oRm, oGantt) {
		var aRowStates = oGantt.getSyncedControl().getRowStates();

		var _oRb = Lib.getResourceBundleFor("sap.gantt");
		if (aRowStates.length === 0) {
			// row state is not synchronized, skip rendering.
			return;
		}

		oGantt.getAggregation("_header").renderElement();
		// Align chart with header when new variant is selected
		if (oGantt._getScrollExtension && oGantt._getScrollExtension.mOffsetWidth) {
			oGantt._getScrollExtension().scrollGanttChartToVisibleHorizon();
		}


		// Adds the toolbar in the tableheader when the overflow toolbar is not available
		// and the marker type is not none
		var aSimpleAdhocLines = oGantt.getSimpleAdhocLines().filter(function(oAdhocLine){
			return oAdhocLine.MarkerType != sap.gantt.simple.MarkerType.None;
		});

		var aDeltaLines = oGantt.getDeltaLines();
		if ((aSimpleAdhocLines.length > 0 || aDeltaLines.length > 0) && oGantt.getShowGanttHeader()) {
			var oTable = oGantt.getAggregation("table");
			GanttUtils.addToolbarToTable(this, oTable, false);
		}

		var iAllRowHeight = aRowStates.reduce(function(height, rowState){
			return height + rowState.height;
		}, 0);

		// 0. render body svg
		oRm.openStart("svg", oGantt.getId() + "-svg");
		oRm.class("sapGanttChartSvg");
		oRm.attr("height", iAllRowHeight + "px");
		oRm.attr("aria-label", _oRb.getText("ARIA_GANTT_CHART"));
		var iRenderWidth = RenderUtils.getGanttRenderWidth(oGantt);

		oRm.attr("width", iRenderWidth + "px");
		oRm.openEnd();

		performance.mark("InnerGanttChartRenderer.rerenderAllShapes-other--start");
		//Rendering of DeltaLines Chart Area if DeltaLines are present
		if (oGantt.getEnableDeltaLine()) {
			this.renderChartAreaOfDeltaLines(oRm,oGantt);
		}

		// Rendering GanttBackGround
		this.renderGanttBackgrounds(oRm, oGantt, aRowStates);

		// Rendering Row Borders
		this.renderGanttRowBorders(oRm, oGantt, aRowStates);

		// Render Calrendar Shapes
		this.renderCalendarShapes(oRm, oGantt);

		// render expanded background if has row expandnation
		this.renderExpandedRowBackground(oRm, oGantt);

		// Render vertical lines
		this.renderVerticalLines(oRm, oGantt, iAllRowHeight);

		// Render Now line body
		this.renderNowLineBody(oRm, oGantt);
		performance.mark("InnerGanttChartRenderer.rerenderAllShapes-other--end");

		performance.mark("InnerGanttChartRenderer.rerenderAllShapes-shape--start");
		// render in-row shapes
		var aFnRenderOrdered = RenderUtils.createOrderedListOfRenderFunctionsFromTemplate(
			this.createTemplateForOrderedListOfRenderFunctions(oGantt));

		aFnRenderOrdered.forEach(function(fnRenderer) {
			fnRenderer.apply(InnerGanttChartRenderer, [oRm, oGantt]);
		});

		performance.mark("InnerGanttChartRenderer.rerenderAllShapes-shape--end");

		performance.mark("InnerGanttChartRenderer.rerenderAllShapes-svgDefs--start");
		// Create the SVGDefs
		oRm.openStart("svg", oGantt.getId() + "-svgDefs");
		oRm.attr("width", 0);
		oRm.attr("height", 0);
		oRm.style("position", "absolute");
		oRm.attr("aria-label", _oRb.getText("ARIA_GANTT_CALENDARS"));
		oRm.class("sapGanttChartSvgDefs");
		oRm.openEnd();
		// render all Gantt releated helpers into <defs>
		this.renderHelperDefs(oRm, oGantt.getId(), oGantt);
		// render calendar pattern into <defs>
		this.renderCalendarPattern(oRm, oGantt);
		oRm.close("svg");
		oRm.close("svg");

		performance.mark("InnerGanttChartRenderer.rerenderAllShapes-svgDefs--end");

		if (!oGantt._bPreventInitialRender) {
			oGantt._bPreventInitialRender = true; // this is a performance optimization
		}
	};

	InnerGanttChartRenderer.createTemplateForOrderedListOfRenderFunctions = function (oGantt) {
		var aTemplate = [
			{fnCallback: this.renderAllShapesInRows},
			{fnCallback: this.renderRlsContainer, bUnshift: oGantt.getShapeOverRelationship()},
			{fnCallback: this.renderAssistedContainer}
		];
		// Rendering AdhocLines if AdhocLines are present
		if (oGantt.getEnableAdhocLine()) {
			aTemplate.push({
				fnCallback: this.renderAdhocLines,
				bUnshift: oGantt.getAdhocLineLayer() === oAdhocLineLayer.Bottom
			});
		}
		// Rendering DeltaLines if DeltaLines are present
		if (oGantt.getEnableDeltaLine()) {
			aTemplate.push({
				fnCallback: this.renderDeltaLines,
				bUnshift: oGantt.getDeltaLineLayer() === oDeltaLineLayer.Bottom
			});
		}
		return aTemplate;
	};

	InnerGanttChartRenderer.renderHelperDefs = function (oRm, sIdPrefix, oGantt) {
		oRm.openStart("defs").openEnd();

		var sLinePatternId = sIdPrefix + "-helperDef-linePattern";

		oRm.openStart("pattern", sLinePatternId);
		oRm.attr("width", 2);
		oRm.attr("height", 2);
		oRm.attr("x", 0);
		oRm.attr("y", 0);
		oRm.attr("patternUnits", "userSpaceOnUse");
		oRm.openEnd();
		oRm.openStart("line");
		oRm.attr("x1", 1);
		oRm.attr("x2", 1);
		oRm.attr("y1", 0);
		oRm.attr("y2", 2);
		oRm.attr("stroke-width", 1);
		oRm.attr("stroke", "white");
		oRm.attr("shape-rendering", "crispEdges");
		oRm.openEnd();
		oRm.close("line");
		oRm.close("pattern");
		oRm.close("defs");

		//Create the SVGDefs

		var oSvgDefs = oGantt ? oGantt.getSvgDefs() : null;
		var oPseudoSvgDefs = oGantt ? oGantt.getAggregation("_pseudoSvgDefs") : null;
		if (oPseudoSvgDefs) {
			oRm.unsafeHtml(oPseudoSvgDefs._getDefString());
		}
		if (oSvgDefs) {
			oRm.unsafeHtml(oSvgDefs._getDefString(oGantt._bClonedGantt));
		}

	};

	InnerGanttChartRenderer.renderGanttRowBorders = function(oRm, oGantt, aRowStates) {
		oRm.openStart("g", oGantt.getId() + "-ganttRowBorder");
		oRm.openEnd();
		this.renderRowBorders(oRm, oGantt, aRowStates);
		oRm.close("g");
	};

	InnerGanttChartRenderer.renderGanttBackgrounds = function(oRm, oGantt, aRowStates) {
		oRm.openStart("g", oGantt.getId() + "-bg");
		oRm.openEnd();
		this.renderRowBackgrounds(oRm, oGantt, aRowStates);
		oRm.close("g");
	};

	InnerGanttChartRenderer.renderRowBackgrounds = function(oRm, oGantt, aRowStates) {
		var nHeightOfPreviousRows = 0;
		var aTableRows = oGantt.getTable().getRows();
		var visibleRowCount = aTableRows.length - 1;
		oRm.openStart("g", oGantt.getId() + "-rowBackgrounds");
		oRm.class("rowBackgrounds");
		oRm.openEnd();

		aRowStates.forEach(function(oRowState, iIndex){
			oRm.openStart("rect", oGantt.getId() + "-bgRow-" + iIndex);
			oRm.attr("y", nHeightOfPreviousRows);
			oRm.attr("width", "100%");
			oRm.attr("height", oRowState.height);
			oRm.attr("data-sap-ui-index", iIndex);
			var oRow = aTableRows[iIndex];
			if (oRow) {
				oRm.attr("data-sap-ui-related", oRow.getId());
			}
			oRm.class("sapGanttBackgroundSVGRow");
			if (oRowState.selected && oGantt.getEnableChartSelectionState()) {
				oRm.class("sapGanttBackgroundSVGRowSelected");
			}
			if (oRowState.hovered && oGantt.getEnableChartHoverState()) {
				oRm.class("sapGanttBackgroundSVGRowHovered");
			}
			oRm.openEnd().close("rect");
			if (iIndex < visibleRowCount) {
				nHeightOfPreviousRows += oRowState.height;
			}
		});
		oRm.close("g");
	};

	InnerGanttChartRenderer.renderRowBorders = function(oRm, oGantt, aRowStates) {
		oRm.openStart("g", oGantt.getId() + "-rowBorders");
		oRm.class("rowBorders");
		oRm.openEnd();

		var nHeightOfPreviousRows = 0;
		aRowStates.forEach(function(oRowState, iIndex) {
			var nBorderY = (nHeightOfPreviousRows + oRowState.height) - 0.5;

			oRm.openStart("line", oGantt.getId() + "-bgRowBorder-" + iIndex);
			oRm.attr("x1", 0);
			oRm.attr("x2", "100%");
			oRm.attr("y1", nBorderY);
			oRm.attr("y2", nBorderY);
			oRm.style("pointer-events", "none");
			oRm.class("sapGanttBackgroundSVGRowBorder");
			oRm.openEnd().close("line");

			nHeightOfPreviousRows += oRowState.height;
		});
		oRm.close("g");
	};

	InnerGanttChartRenderer.renderAdhocLines = function(oRm, oGantt) {
		var aAdhocLinesSimple = oGantt.getSimpleAdhocLines();
		var mTimeRange = oGantt.getRenderedTimeRange(),
			oMinTime = mTimeRange[0],
			oMaxTime = mTimeRange[1];

		aAdhocLinesSimple = aAdhocLinesSimple.filter(function(oValue) {
			var oDate = Format.abapTimestampToDate(oValue.getTimeStamp());
			return oDate >= oMinTime && oDate <= oMaxTime && oValue.getProperty("visible");
		});

		if (aAdhocLinesSimple.length === 0) { return; }
		oRm.openStart("g");
		oRm.class("sapGanttChartAdhocLine");
		oRm.openEnd();

		// render simple adhoc lines
		aAdhocLinesSimple.forEach(function(oAdhocLine) {
			AdhocLineRenderer.renderLine(oRm, oAdhocLine, oGantt);
		});

		oRm.close("g");
	};

	/**
		 * Renders the Delta Line in Gantt Chart
		 *
		 * @param {object} oRm - reference of rendering manager
		 * @param {*} oGantt - reference of Gantt Chart
		 */
		InnerGanttChartRenderer.renderDeltaLines = function (oRm, oGantt) {
			var aDeltaLines = oGantt.getDeltaLines();

			aDeltaLines = aDeltaLines.filter(function (oValue) {
				return oValue.getVisible();
			});
			if (aDeltaLines.length === 0) {
				return;
			}

			oRm.openStart("g");
			oRm.class("sapGanttChartDeltaLine");
			oRm.openEnd();
			aDeltaLines.forEach(function (oDeltaLine) {
				DeltaLineRenderer.renderDeltaLines(oRm, oDeltaLine, oGantt);
			});
			oRm.close("g");
		};
		InnerGanttChartRenderer.renderChartAreaOfDeltaLines = function (oRm, oGantt) {
			var aDeltaLines = oGantt.getDeltaLines();

			aDeltaLines = aDeltaLines.filter(function (oValue) {
				return oValue.getVisible();
			});
			if (aDeltaLines.length === 0) {
				return;
			}

			oRm.openStart("g");
			oRm.class("sapGanttChartAreaDeltaLine");
			oRm.openEnd();
			aDeltaLines.forEach(function (oDeltaLine) {
				DeltaLineRenderer.renderChartAreaOfDeltaLines(oRm, oDeltaLine, oGantt);
			});
			oRm.close("g");
		};

	InnerGanttChartRenderer.renderVerticalLines = function(oRm, oGantt, iChartHeight) {
		if (oGantt.getEnableVerticalLine()) {
			// var iRenderedWidth = oGantt.iGanttRenderedWidth
			var iRenderedWidth = RenderUtils.getGanttRenderWidth(oGantt),
				oAxisTime = oGantt.getAxisTime();

			var oZoomStrategy = oAxisTime.getZoomStrategy();
			var aTickTimeIntervals = oAxisTime.getTickTimeIntervalLabel(oZoomStrategy.getTimeLineOption(), null, [0, iRenderedWidth]);

			// the second item have all the tick time info
			var aTicks = aTickTimeIntervals[1];

			var sPathContent = "";
			// By Default line width is 1, is need to minus the half width of line
			for (var i = 0; i < aTicks.length; i++) {
				sPathContent += " M" +
					" " + (aTicks[i].value - 1 / 2) +
					" 0" +
					" v " + iChartHeight;
			}
			if (sPathContent) {
				oRm.openStart("path");
				oRm.class("sapGanttChartVerticalLine");
				oRm.attr("d", sPathContent);
				oRm.openEnd().close("path");
			}
		}
	};

	InnerGanttChartRenderer.renderAssistedContainer = function (oRm, oGantt) {
		// for selection
		oRm.openStart("g");
		oRm.class("sapGanttChartSelection");
		oRm.openEnd().close("g");
		// for highlight
		oRm.openStart("g");
		oRm.class("sapGanttChartHighlight");
		oRm.openEnd().close("g");
		// for shape connect
		oRm.openStart("g");
		oRm.class("sapGanttChartShapeConnect");
		oRm.openEnd().close("g");
		// for lasso Selection
		oRm.openStart("g");
		oRm.class("sapGanttChartLasso");
		oRm.openEnd().close("g");
	};

	InnerGanttChartRenderer.renderNowLineBody = function(oRm, oGantt) {
		var iNowLineAxisX = oGantt.getAxisTime().getNowLabel(oGantt.getNowLineInUTC())[0].value;
		if (oGantt.getEnableNowLine() === false || isNaN(iNowLineAxisX)) { return; }

		oRm.openStart("g");
		oRm.class("sapGanttNowLineBodySvgLine");
		oRm.openEnd();
		var oStraightLine = new BaseLine({
			x1: iNowLineAxisX, y1: 0,
			x2: iNowLineAxisX, y2: "100%",
			strokeWidth: 1
		}).setProperty("childElement", true);

		oStraightLine.renderElement(oRm, oStraightLine);
		oRm.close("g");
	};

	InnerGanttChartRenderer.renderRlsContainer = function (oRm, oGantt) {
		oRm.openStart("g");
		oRm.class("sapGanttChartRls");
		oRm.openEnd().close("g");
	};

	InnerGanttChartRenderer.renderAllShapesInRows = function(oRm, oGantt) {
		if (!jQuery(document.getElementById(oGantt.getId() + "-gantt"))) { return; }

		oRm.openStart("g", oGantt.getId() + "-shapes");
		oRm.class("sapGanttChartShapes");
		oRm.openEnd();

		this._eachVisibleRowSettings(oGantt, function(oRowSettings) {
			oRowSettings.renderElement(oRm, oGantt);
		});
		oRm.close("g");
	};

	InnerGanttChartRenderer._eachVisibleRowSettings = function(oGantt, fnCallback) {
		var aAllRows = oGantt.getTable().getRows();
		var oBindingInfo = oGantt.getTable().getBindingInfo("rows"),
			sModelName = oBindingInfo && oBindingInfo.model;

		for (var iIndex = 0; iIndex < aAllRows.length; iIndex++) {
			var oRow = aAllRows[iIndex];
			var oRowContext = oRow.getBindingContext(sModelName);
			if (oRowContext && oRow.getIndex() !== -1) {
				var oRowSettings = oRow.getAggregation("_settings");
				if (fnCallback) {
					fnCallback(oRowSettings);
				}
			}
		}
	};

	InnerGanttChartRenderer.renderRelationships = function (oRm, oGantt) {
		oGantt.relSet = {};
		oGantt.relSetFake = {};
		oGantt._edgePoint = GanttUtils.getEdgePoint(oGantt);
		var oGntSvg = window.document.getElementById(oGantt.getId() + "-svg");
		var oRlsCnt = jQuery(oGntSvg).children("g.sapGanttChartRls").get(0);

		if (oGntSvg == null || oRlsCnt == null) { return; }

		var mShapeIdFilterMap = Object.create(null);
		this._eachVisibleRowSettings(oGantt, this._renderVisibleRowRelationships.bind(this, oRm, oGantt, mShapeIdFilterMap));
		this._renderNonVisibleRowRelationships(oRm, oGantt, mShapeIdFilterMap);
		for (var x in oGantt.relSet){
			if (oGantt.relSet[x].mAnchors.predecessor || oGantt.relSet[x].mAnchors.successor){
				oGantt.relSet[x].renderElement(oRm, oGantt.relSet[x], oGantt.getId());
			}
		}
		for (var y in oGantt.relSetFake){
			if (oGantt.relSetFake[y].mAnchors.predecessor || oGantt.relSetFake[y].mAnchors.successor){
				oGantt.relSetFake[y].renderElement(oRm, oGantt.relSetFake[y], oGantt.getId());
				oGantt.relSetFake[y].destroy();
			}
		}
		oRm.flush(oRlsCnt, true, false);
	};

	InnerGanttChartRenderer._renderVisibleRowRelationships = function (oRm, oGantt, mShapeIdFilterMap, oRowSettings) {
		oRowSettings.getRelationships().forEach(function (oRlsInst) {
			var sShapeId = oRlsInst.getShapeId();
			var sShapeUid = oRowSettings.getShapeUid(oRlsInst);
			if (!mShapeIdFilterMap[sShapeId]) {
				mShapeIdFilterMap[sShapeId] = true;
				oRlsInst.setProperty("shapeUid", sShapeUid, true);
				if (GanttUtils.relationexist(oGantt,oRlsInst)){
					GanttUtils.setLmarker(oGantt,oRlsInst,true);
				}
			}
		});
	};

	InnerGanttChartRenderer._renderNonVisibleRowRelationships = function (oRm, oGantt, mShapeIdFilterMap) {
		var oRelationshipsBindingInfo = Utility.safeCall(oGantt, ["getTable", "getRowSettingsTemplate", "getBindingInfo"], null, ["relationships"]);
		if (!oRelationshipsBindingInfo) { return; }
		var oShapeIdBindingInfo = oRelationshipsBindingInfo.template.getBindingInfo("shapeId");
		if (!oShapeIdBindingInfo) { return; }
		var sRelationshipShapeIdPath = oShapeIdBindingInfo.parts[0].path,
			oModel = oGantt.getTable().getModel(oRelationshipsBindingInfo.model);

		var fnRenderFakeRls = function (sShapeId, sBindingPath) {
			if (!mShapeIdFilterMap[sShapeId]) {
				mShapeIdFilterMap[sShapeId] = true;
				var oFakeRlsInstance = oRelationshipsBindingInfo.factory();
				oFakeRlsInstance.setModel(oModel, oRelationshipsBindingInfo.model);
				oFakeRlsInstance.bindObject({path: sBindingPath, model: oRelationshipsBindingInfo.model});
				if (GanttUtils.relationexist(oGantt,oFakeRlsInstance)){
					GanttUtils.setLmarker(oGantt,oFakeRlsInstance,false);
				} else {
					oFakeRlsInstance.destroy();
				}
			}
		};

		if (oModel.isA("sap.ui.model.json.JSONModel")) {
			var mEntities = oModel.mContexts;
			Object.keys(mEntities).forEach(function (sEntityKey) {
				if (sEntityKey.indexOf(oRelationshipsBindingInfo.path) > 0) {
					fnRenderFakeRls(mEntities[sEntityKey].getProperty(sRelationshipShapeIdPath), sEntityKey[0] === "/" ? sEntityKey : "/" + sEntityKey);
				}
			});
		} else if (oModel.isA("sap.ui.model.odata.v2.ODataModel")) { // ODataModel v2
			var mEntities = oModel.getProperty("/"); // OData entities are in the root (even expanded ones)
			Object.keys(mEntities).forEach(function (sEntityKey) {
				if (sEntityKey.startsWith(oRelationshipsBindingInfo.path)) {
					fnRenderFakeRls(mEntities[sEntityKey][sRelationshipShapeIdPath], sEntityKey[0] === "/" ? sEntityKey : "/" + sEntityKey);
				}
			});
		}
	};

	InnerGanttChartRenderer.renderSvgDefs = function (oRm, oGantt) {
		var oSvgDefs = oGantt.getSvgDefs();
		if (oSvgDefs) {
			oRm.openStart("svg", oGantt.getId() + "-svg-psdef");
			oRm.attr("aria-hidden", "true");
			oRm.style("float", "left");
			oRm.style("width", "0px");
			oRm.style("height", "0px");
			oRm.openEnd();
			oRm.unsafeHtml(oSvgDefs.getDefString());
			oRm.close("svg");
		}
	};

	InnerGanttChartRenderer.renderCalendarPattern = function(oRm, oGantt) {
		if (oGantt.getEnableNonWorkingTime() === false) { return; }
		//Take pattern for different defs aggregations
		var oPatternDef = oGantt.getCalendarDef(),
			sGanttId = oGantt.getId(),
			iRenderedWidth = oGantt.iGanttRenderedWidth;

		var aRowStates = oGantt.getSyncedControl().getRowStates();
		if (oPatternDef) {
			var mAggregations = AggregationUtils.getAllNonLazyAggregations(oPatternDef);
			var aCalendarInRow = Object.keys(mAggregations).filter(function(sName){ // eslint-disable-line
				// get all binding aggregation instances (defs, defs1, defs2, defs3, defs4, defs5) and default to empty array
				return (sName.indexOf("defs") === 0);
			}).map(function(sName){ // eslint-disable-line
				// get all binding aggregation instances and default to empty array
				return oPatternDef.getAggregation(sName) || [];
			});

			// creator of base text for rendering title
			var fTitleCreator = function (mTextSettings) {
				return new BaseText(mTextSettings);
			};

			aCalendarInRow.forEach(function(aCalDef, index) {
				if (aCalDef.length > 0) {
					var defNode = oPatternDef.getDefNode(aCalDef);
					if (defNode && defNode.defNodes && iRenderedWidth > 0) {
						var defId = sGanttId + "-calendardefs-" + index;
						oRm.openStart("defs", defId);
						oRm.openEnd();
						for (var iIndex = 0; iIndex < defNode.defNodes.length; iIndex++) {
							var oNode = defNode.defNodes[iIndex];
							oRm.openStart("pattern", oNode.id);
							oRm.class("calendarPattern");
							oRm.attr("patternUnits", "userSpaceOnUse");
							oRm.attr("x", 0);
							oRm.attr("y", 0);
							oRm.attr("width", iRenderedWidth);
							oRm.attr("height", aRowStates[0].height);
							oRm.openEnd();
							for (var iIndex2 = 0; iIndex2 < oNode.timeIntervals.length; iIndex2++) {
								var ti = oNode.timeIntervals[iIndex2];
								ti.height = aRowStates[0].height;
								oRm.openStart("rect");
								oRm.attr("x", ti.x);
								oRm.attr("y", ti.y);
								oRm.attr("width", ti.width);
								oRm.attr("height", aRowStates[0].height);
								oRm.attr("fill", ti.fill);
								oRm.openEnd().close("rect");
								if (oNode.title !== null) {
									RenderUtils.renderCalenderTitle(oRm, oNode, ti, fTitleCreator);
								}
							}
							oRm.close("pattern");
						}
						oRm.close("defs");
					}
				}
			});
		}
	};


	InnerGanttChartRenderer.renderCalendarShapes = function(oRm, oGantt) {
		oRm.openStart("g");
		oRm.class("sapGanttChartCalendar");
		oRm.openEnd();

		var aRowStates = oGantt.getSyncedControl().getRowStates();
		this._eachVisibleRowSettings(oGantt, function(oRowSetting) {
			var mPosition = RenderUtils.calcRowDomPosition(oRowSetting, aRowStates);
			var mAggregations = AggregationUtils.getAllNonLazyAggregations(oRowSetting);
			var aBaseCalendarsInRow = Object.keys(mAggregations).filter(function(sName){
				// skip all but calendars
				return (sName.indexOf("calendars") === 0);
			}).map(function(sName){ // eslint-disable-line
				// get all binding aggregation instances and default to empty array
				return oRowSetting.getAggregation(sName) || [];
			});
			aBaseCalendarsInRow.forEach(function(aCalendars){
				aCalendars.forEach(function(oCalendar) {
					if (oGantt.isShapeVisible(oCalendar)) {
						oCalendar.setProperty("rowYCenter", mPosition.rowYCenter, true);
						oCalendar._iBaseRowHeight = mPosition.rowHeight;
							//Add the BaseCalendar based on visiblility property.
							if (oCalendar.getVisible()) {
								oCalendar.renderElement(oRm, oCalendar);
							}
					}
				});
			});
		});

		oRm.close("g");
	};

	InnerGanttChartRenderer.renderExpandedRowBackground = function(oRm, oGantt) {
		var aData = oGantt.getExpandedBackgroundData();
		if (jQuery.isEmptyObject(aData)) { return; }

		var iBaseRowHeight = oGantt._oExpandModel.refreshRowYAxis(oGantt.getTable());

		var aExpandedData = Array.prototype.concat.apply([], aData);

		var iWidth = oGantt.iGanttRenderedWidth;

		oRm.openStart("g");
		oRm.class("sapGanttChartRowBackground");
		oRm.openEnd();

		for (var iIndex = 0; iIndex < aExpandedData.length; iIndex++) {
			var d = aExpandedData[iIndex];
			var sExpandedRowStyleClass;
			var fRectHeight;

			// Show or hide the expanded row background colour
			if (oGantt.getEnableExpandedRowBackground() === true){
				sExpandedRowStyleClass = "sapGanttExpandChartCntBG";
			} else {
				sExpandedRowStyleClass = "sapGanttExpandedRowBackground";
			}

			// Show or hide the expanded row borders
			fRectHeight = d.rowHeight;

			oRm.openStart("g");
			oRm.class("expandedRow");
			oRm.openEnd();

			var yValue;
			if ((oGantt.getShowParentRowOnExpand() && !oGantt.getUseParentShapeOnExpand())) {
					yValue = d.y;
			} else {
				yValue = d.y - (iBaseRowHeight);
			}

			oRm.openStart("rect");
			oRm.attr("x", d.x);
			oRm.attr("y", yValue);
			oRm.attr("height", fRectHeight);
			oRm.attr("width", "100%");
			oRm.class(sExpandedRowStyleClass);
			oRm.openEnd();
			oRm.close("rect");
			oRm.openStart("path");
			// Show or hide the borders of the expanded row
			if (oGantt.getEnableExpandedRowBorders() === true){
				oRm.class("sapGanttExpandChartLine");
			}
			oRm.attr("d", "M0 " + (yValue) + " H" + (iWidth - 1));
			oRm.openEnd().close("path");

			oRm.close("g");
		}

		oRm.close("g");
	};

	return InnerGanttChartRenderer;

}, /* bExport= */ true);
