/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define(
	[
		"sap/gantt/misc/Format",
		"./AdhocDiamond",
		"./BaseLine"
	],
	function (Format, AdhocDiamond, BaseLine) {
		"use strict";

		/**
		 * AdhocLine renderer.
		 *
		 * @namespace
		 */
		var AdhocLineRenderer = {};

		/**
		 * Renders the marker on the header if the MarkerType is not none
		 *  @param {sap.ui.core.RenderManager} oRm Render manager
		 * @param {sap.gantt.simple.GanttChartWithTable} oGantt // Gantt instance
		 * @param {int} iHeaderHeight // Height of the header area
		 */
		AdhocLineRenderer.renderMarker = function (
            oRm,
            oAdhocLine,
			oGantt,
			iHeaderHeight,
			iMarkerHeight
		) {
			// if Show Adhoc line setting is set to false then return
			if (oGantt.getEnableAdhocLine() === false) {
				return;
			}

			// creates the new instance of the marker
			// changing the x-axis value on every re-rendering
			var oAxisTimes = oGantt.getAxisTime();
			var iX = oAxisTimes.timeToView(
				Format.abapTimestampToDate(oAdhocLine.getTimeStamp())
			);
			var iHeightOftheDiamond = 8;
			var sStrokeDasharray = oAdhocLine.getStrokeDasharray();
			var fStrokeWidth = oAdhocLine._getStrokeWidth();
			var bSelected = oAdhocLine._getSelected();
			if (bSelected === true){
				sStrokeDasharray = "solid";
				fStrokeWidth = oAdhocLine._getStrokeWidth() + 1;
			}
			var tempHeaderHeight = iHeaderHeight - iMarkerHeight;
			var iMarkerPosition = tempHeaderHeight + (iHeightOftheDiamond / 2) + (oAdhocLine._getLevel() - 1) * 7;
			var oAdhocDiamond = oAdhocLine._getMarker();
			var oHeaderStartLine = oAdhocLine._getHeaderLine();
			var sDescription = oAdhocLine.getProperty("description");
			if (!oAdhocDiamond && !oHeaderStartLine) {
				oAdhocDiamond = new AdhocDiamond({
					id: oAdhocLine.getId() + "-marker",
					x: iX,
					y: 0.0,
					height: iHeightOftheDiamond,
					width: 10,
					hoverable: true,
					selectable: true,
					rowYCenter: iMarkerPosition,
					fill: oAdhocLine.getStroke(),
					press: function (oEvent) {
						oAdhocLine.markerPress(oEvent);
						oAdhocLine.fireMarkerPress(oEvent); // markerPress event is exposed to the end-user
					},
					mouseEnter: function (oEvent) {
						oAdhocLine.markerMouseEnter(oEvent);
						oAdhocLine.fireMarkerMouseEnter(oEvent); // markerMouseEnter event is exposed to the end-user
					},
					mouseLeave: function (oEvent) {
						oAdhocLine.markerMouseLeave(oEvent);
						oAdhocLine.fireMarkerMouseLeave(oEvent); // markerMouseLeave event is exposed to the end-user
					}
				}).addStyleClass("sapGanntChartMarkerCursorPointer");
				if (sDescription) {
					oAdhocDiamond.setTooltip(sDescription);
				}
				oAdhocLine._setMarker(oAdhocDiamond);
				oHeaderStartLine = new BaseLine({
					id: oAdhocLine.getId() + "-headerline",
					x1: iX,
					y1: iMarkerPosition,
					x2: iX,
					y2: iMarkerPosition + iMarkerHeight,
					stroke: oAdhocLine.getStroke(),
					strokeWidth: fStrokeWidth,
					strokeDasharray: sStrokeDasharray,
					strokeOpacity: oAdhocLine.getStrokeOpacity(),
					tooltip: oAdhocLine.getDescription()
				});
				oAdhocLine._setHeaderLine(oHeaderStartLine);
			} else {
				oAdhocDiamond.setProperty("x", iX, true);
				oAdhocDiamond.setProperty("rowYCenter", iMarkerPosition, true);
				oAdhocDiamond.setProperty("fill", oAdhocLine.getStroke(), true);
				oHeaderStartLine.setProperty("x1", iX, true);
				oHeaderStartLine.setProperty("x2", iX, true);
				oHeaderStartLine.setProperty("y1", iMarkerPosition, true);
				oHeaderStartLine.setProperty("y2", iMarkerPosition + iMarkerHeight, true);
				oHeaderStartLine.setProperty("strokeDasharray", sStrokeDasharray, true);
				oHeaderStartLine.setProperty("strokeWidth", fStrokeWidth, true);
				oHeaderStartLine.setProperty("stroke", oAdhocLine.getStroke(), true);
			}

			oAdhocDiamond.renderElement(oRm, oAdhocDiamond);
			oHeaderStartLine.renderElement(oRm, oHeaderStartLine);
		};

		/**
		 * Renders the line on the gantt chart
		 *  @param {sap.ui.core.RenderManager} oRm Render manager
		 * @param {sap.gantt.simple.GanttChartWithTable} oGantt // Gantt instance
		 */
		AdhocLineRenderer.renderLine = function (oRm, oAdhocLine, oGantt) {
			// creates the new instance of the base line
			// changing the x-axis value on every re-rendering
			var oAxisTime = oGantt.getAxisTime();
			var iX = oAxisTime.timeToView(
				Format.abapTimestampToDate(oAdhocLine.getTimeStamp())
			);

			var sStrokeDasharray = oAdhocLine.getStrokeDasharray();
			var fStrokeWidth = oAdhocLine._getStrokeWidth();
			var bSelected = oAdhocLine._getSelected();
			if (bSelected === true){
				sStrokeDasharray = "solid";
				fStrokeWidth = oAdhocLine._getStrokeWidth() + 1;
			}

			var oBaseLine = oAdhocLine._getLine();
			if (!oBaseLine) {
				oBaseLine = new BaseLine({
					id: oAdhocLine.getId() + "-mainline",
					x1: iX,
					y1: 0,
					x2: iX,
					y2: "100%",
					stroke: oAdhocLine.getStroke(),
					strokeWidth: fStrokeWidth,
					strokeDasharray: sStrokeDasharray,
					strokeOpacity: oAdhocLine.getStrokeOpacity(),
					tooltip: oAdhocLine.getDescription()
				});
				oAdhocLine._setLine(oBaseLine);
			} else {
				oBaseLine.setProperty("x1", iX, true);
				oBaseLine.setProperty("x2", iX, true);
				oBaseLine.setProperty("strokeDasharray", sStrokeDasharray, true);
				oBaseLine.setProperty("strokeWidth", fStrokeWidth, true);
				oBaseLine.setProperty("stroke", oAdhocLine.getStroke(), true);
			}

			oBaseLine.renderElement(oRm, oBaseLine);
		};

		return AdhocLineRenderer;
	},
	/* bExport= */ true
);
