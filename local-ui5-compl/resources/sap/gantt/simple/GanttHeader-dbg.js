/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/core/Element",
	"sap/ui/Device",
	"./RenderUtils",
	"../misc/Utility",
	"sap/gantt/misc/Format",
	"sap/ui/core/theming/Parameters",
	"./BaseRectangle",
	"./AdhocLineRenderer",
	"./GanttUtils",
	"./DeltaLineRenderer",
	"./BaseLine",
	"sap/gantt/simple/GanttExtension",
	"sap/gantt/utils/GanttChartConfigurationUtils",
	"sap/ui/core/Lib",
	"sap/ui/core/RenderManager"
], function (Element, Device, RenderUtils, Utility, Format, Parameters, BaseRectangle, AdhocLineRenderer, GanttUtils, DeltaLineRenderer, BaseLine, GanttExtension, GanttChartConfigurationUtils, Lib, RenderManager) {
	"use strict";

	/**
	 * Creates and initializes a new GanttHeader class
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSetting] Initial settings for the new control
	 *
	 * @class
	 * Enables users to adjust Gantt Chart header height
	 *
	 * @extend sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 *
	 * @constructor
	 * @private
	 * @alias sap.gantt.simple.GanttHeader
	 */
	var GanttHeader = Element.extend("sap.gantt.simple.GanttHeader", {
		metadata: {
			library: "sap.gantt",
			properties: {
				iHeaderMinheight: { type: "int", defaultValue: 33 },

				/**
				* Header Area Height
				* @private
				*/
				_iHeaderHeight: { type: "int", defaultValue: 0 },

				/**
        		 * Initial Header height
        		 * @private
        		 */
				_iHeaderHeightInitial: { type: "int", defaultValue: 0 }
			},
			aggregations: {
				/**
				 * Chart overflow Toolbar.
				 * @private
				 */
				_overflowToolbar: {type: "sap.m.Toolbar", multiple: false}
			},
			renderer: {
				apiVersion: 2    // enable in-place DOM patching
			}
		}
	});

	/**
		 * Sets the Header height
		 * @param {int} val // Instance of header height to be set
		 * @private
		 */
		GanttHeader.prototype._setIHeaderHeight = function (val) {
			this.setProperty("_iHeaderHeight", Math.floor(val), true);
		};

		/**
		 * Returns the Header height
		 * @returns {int} - Returns the Header height
		 * @private
		 */
		GanttHeader.prototype._getIHeaderHeight = function () {
			return this.getProperty("_iHeaderHeight");
		};
		/**
         * Sets the Initial Header height
         * @param {int} val // Instance of Initial header height to be set
         * @private
         */
        GanttHeader.prototype._setIHeaderHeightInitial = function (val) {
            this.setProperty("_iHeaderHeightInitial", Math.floor(val), true);
		};

		/**
         * Returns the Initial Header height
         * @returns {int} - Returns the Initial Header height
         * @private
         */
        GanttHeader.prototype._getIHeaderHeightInitial = function () {
            return this.getProperty("_iHeaderHeightInitial");
		};

	var iHeaderHeightFixed = 0;

	GanttHeader.prototype.renderElement =  function() {
		performance.mark("GanttHeader.renderElement--start");
		var oRm = new RenderManager(),
			oGantt = this.getParent(),
			oTableOverflowToolbar;

		if (!oGantt.getShowGanttHeader()) {
			return;
		}
		var sGanttId = oGantt.getId();
		var $HeaderPlaceHolder = jQuery(
			"div.sapGanttChartWithTableHeader[data-sap-ui-related=" +
			sGanttId.replace(/([:.\[\],=@])/g, "\\$1") + "]" // escape CSS notation characters for jQuery
		);
		var oTable = this.getParent().getTable(),
			aTableExtensions = oTable.getAggregation("extension");

		oTableOverflowToolbar = aTableExtensions.filter(function(oExtension) {
			if (oExtension instanceof sap.m.OverflowToolbar) {
				return oExtension;
			}
		});
		this.iOverflowToolbarHeight = 0;

		if (oGantt.getEnableChartOverflowToolbar()) {
			this.renderOverflowToolbar(oRm, oGantt);
			var oGanttOverflowToolbarDom = Element.getElementById(sGanttId + "-ganttHeaderOverflowToolbar").getDomRef();

			if (oTableOverflowToolbar[0]) {
				var oTableOverflowToolbarDom = Element.getElementById(oTableOverflowToolbar[0].sId).getDomRef();
				if (oTableOverflowToolbarDom) {
					this.iOverflowToolbarHeight = oTableOverflowToolbarDom.clientHeight;
				}
			} else if (oGanttOverflowToolbarDom){
				this.iOverflowToolbarHeight = oGanttOverflowToolbarDom.clientHeight;
			}
		}

		if ($HeaderPlaceHolder && $HeaderPlaceHolder.length > 0) {
			iHeaderHeightFixed = $HeaderPlaceHolder[0].offsetHeight;
			if (this.iOverflowToolbarHeight && oGantt.getEnableChartOverflowToolbar()) {
				iHeaderHeightFixed -= this.iOverflowToolbarHeight;
			}
		}
		this._setIHeaderHeight(iHeaderHeightFixed);

		var iHeaderWidth = RenderUtils.getGanttRenderWidth(oGantt);
		var iMarkerAreaHeight = 0;

		var aAdhocLines = oGantt.getSimpleAdhocLines().filter(function(oAdhocLine){
			return oAdhocLine.MarkerType != sap.gantt.simple.MarkerType.None;
		});

		var aDeltaLines = oGantt.getDeltaLines().filter(function (oValue) {
			return oValue.getVisible();
		});

		//Adjusting header height based on marker availability
		// Split the total SVG height as 3 parts for drawing
		// label0 (MM YYYY), label1 (DD) and vertical line (|)
		var nHalfHeaderHeight, nFirstRowYOffset, nSmallIntervalTextY;
			nHalfHeaderHeight = this._getIHeaderHeight() / 4;
			nFirstRowYOffset = (this._getIHeaderHeight() / 5) * 2;
			nSmallIntervalTextY = (this._getIHeaderHeight() / 5) * 4;

			if (
				(aAdhocLines.length > 0 && oGantt.getEnableAdhocLine() === true ) ||
				(
					aDeltaLines.length > 0 &&
					oGantt.getEnableDeltaLine() === true
				)
			) {
				aDeltaLines = aDeltaLines.filter(function (oValue) {
					return oValue.getVisible();
				});
				aAdhocLines = aAdhocLines.filter(function (oValue) {
					return oValue;
				});
				var maxLevelDeltaLines = 0;
				var maxLevelAdhocLines = 0;
				var aLines;

				if (
					(aAdhocLines.length > 0 && oGantt.getEnableAdhocLine() === true ) &&
					(
						aDeltaLines.length > 0 &&
						oGantt.getEnableDeltaLine() === true
					)
				){
				aLines = GanttUtils.calculateLevelForShapes(aDeltaLines.concat(aAdhocLines), "timeStamp", "endTimeStamp", true, oGantt).childWithLevels;

				//getting the maximum level of the visible Adhoclines
				maxLevelAdhocLines = Math.max.apply(
                    Math,
                    aLines.adhocLines.map(function (oAdhocLines) {
                        return oAdhocLines.mProperties._level;
                    })
				);

				//getting the maximum level of the visible DeltaLines
				maxLevelDeltaLines = Math.max.apply(
                    Math,
                    aLines.deltaLines.map(function (oDeltaLlines) {
                        return oDeltaLlines.mProperties._level;
                    })
				);
				if (maxLevelAdhocLines >= maxLevelDeltaLines ) {
					iMarkerAreaHeight = ( maxLevelDeltaLines * 4 )  + ((maxLevelAdhocLines - maxLevelDeltaLines) * 8) + ( ( maxLevelDeltaLines ) * 3 ) + 3;
				} else {
					iMarkerAreaHeight = ( maxLevelDeltaLines * 4 )  + (maxLevelDeltaLines * 3);
				}

				} else if ( aAdhocLines.length > 0 && oGantt.getEnableAdhocLine() === true ) {
				aLines = GanttUtils.calculateLevelForShapes(aAdhocLines, "timeStamp", "endTimeStamp", true, oGantt).childWithLevels;

				maxLevelAdhocLines = Math.max.apply(
                    Math,
                    aLines.adhocLines.map(function (oAdhocLines) {
                        return oAdhocLines.mProperties._level;
                    })
				);
					iMarkerAreaHeight = maxLevelAdhocLines * 8;
				} else if ( aDeltaLines.length > 0 &&
					oGantt.getEnableDeltaLine() === true ) {
					aLines = GanttUtils.calculateLevelForShapes(aDeltaLines, "timeStamp", "endTimeStamp", true, oGantt).childWithLevels;

				maxLevelDeltaLines = Math.max.apply(
                    Math,
                    aLines.deltaLines.map(function (oDeltaLlines) {
                        return oDeltaLlines.mProperties._level;
                    })
				);
					iMarkerAreaHeight = (maxLevelDeltaLines * 4) + ( ( maxLevelDeltaLines + 1 ) * 3 );
				}

				 /* eslint-disable no-extra-boolean-cast */
				//Calculating column header height after Calculating  marker header area
				if ((this.iOverflowToolbarHeight && !!oTableOverflowToolbar[0] && oGantt.getEnableChartOverflowToolbar())) {
					oGantt.getTable().setColumnHeaderHeight(this.getIHeaderMinheight() + iMarkerAreaHeight);
				} else if ((this.iOverflowToolbarHeight) && (!oTableOverflowToolbar[0] || oGantt.getEnableChartOverflowToolbar())) {
					oGantt.getTable().setColumnHeaderHeight(this.getIHeaderMinheight() + iMarkerAreaHeight + this.iOverflowToolbarHeight);
				} else {
					oGantt.getTable().setColumnHeaderHeight(this.getIHeaderMinheight() + iMarkerAreaHeight);
				}
				 /* eslint-enable no-extra-boolean-cast*/
				nHalfHeaderHeight = (this._getIHeaderHeight() - iMarkerAreaHeight) / 4;
				nFirstRowYOffset = ((this._getIHeaderHeight() - iMarkerAreaHeight) / 5) * 2;
				nSmallIntervalTextY = ((this._getIHeaderHeight() - iMarkerAreaHeight) / 5) * 4;
			} else {
				 /* eslint-disable no-extra-boolean-cast*/
				if ((this.iOverflowToolbarHeight && !!oTableOverflowToolbar[0] && oGantt.getEnableChartOverflowToolbar())) {
					oGantt.getTable().setColumnHeaderHeight(this.getIHeaderMinheight());
				} else if ((this.iOverflowToolbarHeight) && (!oTableOverflowToolbar[0] || oGantt.getEnableChartOverflowToolbar())) {
					oGantt.getTable().setColumnHeaderHeight(this.getIHeaderMinheight() + this.iOverflowToolbarHeight);
				} else {
					oGantt.getTable().setColumnHeaderHeight(this.getIHeaderMinheight());
				}
				 /* eslint-enable no-extra-boolean-cast*/
			}

		var oAxisTimeStrategy = oGantt.getAxisTimeStrategy(),
			oTimelineOption   = oAxisTimeStrategy.getTimeLineOption(),
			oAxisTime = oGantt.getAxisTime();

		var aLabelList = oAxisTime.getTickTimeIntervalLabel(oTimelineOption, null, [0, iHeaderWidth]);

		var _oRb = Lib.getResourceBundleFor("sap.gantt");
		oRm.openStart("svg", sGanttId + "-header-svg");
		oRm.class("sapGanttChartHeaderSvg");
		oRm.attr("height", this._getIHeaderHeight() + "px");
		oRm.attr("width", iHeaderWidth);
		oRm.attr("aria-label", _oRb.getText("ARIA_GANTT_HEADER"));
		if (this.iOverflowToolbarHeight && oGantt.getEnableChartOverflowToolbar()) {
			oRm.style("transform", "translate(0," + this.iOverflowToolbarHeight + "px)");
		}
		oRm.openEnd();
		oRm.openStart("rect");
		oRm.attr("height","100%");
		oRm.attr("width", "100%");
		oRm.attr("fill", "transparent");
		oRm.openEnd();
		oRm.close("rect");
		oRm.openStart("g").openEnd();
		// append text for labels on first row for rendering larger interval texts
		this.renderHeaderLabel(oRm, aLabelList[0], {
			y: nFirstRowYOffset,
			className: "sapGanttTimeHeaderSvgText"
		});

		// append text for labels on second row for rendering small interval texts
		this.renderHeaderLabel(oRm, aLabelList[1],  {
			y: nSmallIntervalTextY,
			className: "sapGanttTimeHeaderSvgTextMedium"
		});

		// remove first large interval label before creating paths
		if (oAxisTime.largeIntervalLabel && !oAxisTime.largeIntervalPath) {
			for (var i = 0; i < aLabelList[0].length; i++) {
				if (aLabelList[0][i].value === oAxisTime.firstTickPosition) {
					aLabelList[0].splice(i, 1);
					break;
				}
			}
		}

		// larger interval path
		this.renderIntervalLine(oRm, aLabelList[0], {
			start: 0,
			end: nHalfHeaderHeight,
			className: "sapGanttTimeHeaderLargeIntervalSvgPath"
		});

		// small interval path
		this.renderIntervalLine(oRm, aLabelList[1], {
			start: nSmallIntervalTextY,
			end: this._getIHeaderHeight(),
			className: "sapGanttTimeHeaderSvgPath"
		});

		oRm.close("g");

		if (oGantt._bClonedGantt) {
			var oPrintHeaderBottomBorder = new BaseRectangle({
				x: 0,
				y: this._getIHeaderHeight() - 1,
				height: "1px",
				width: "100%",
				fill: Parameters.get("sapUiListVerticalBorderColor")
			});
			oPrintHeaderBottomBorder.renderElement(oRm, oPrintHeaderBottomBorder);
		}

		//adding marker header area based on adhoc and deltaline visibality
		if (
			(oGantt.getEnableAdhocLine() === true && aAdhocLines.length > 0) ||
			( oGantt.getEnableDeltaLine() === true && aDeltaLines.length > 0)) {
			oRm.openStart("svg", "inner-header-svg");
			oRm.attr("aria-label", _oRb.getText("ARIA_GANTT_INNER_HEADER"));
			oRm.openEnd();
			oRm.openStart("g", "inner-header-g");
			oRm.style("height", iMarkerAreaHeight + "px");
			oRm.openEnd();
			var oRectArea = new BaseRectangle({
				x: 0,
				y: this._getIHeaderHeight() - iMarkerAreaHeight,
				height: "1px",
				width: "100%",
				fill: Parameters.get("sapUiListVerticalBorderColor")
			});
			var that = this;
			oRectArea.renderElement(oRm, oRectArea);
			var mTimeRange = oGantt.getRenderedTimeRange(),
				oMinTime = mTimeRange[0],
				oMaxTime = mTimeRange[1];

			aAdhocLines = aAdhocLines.filter(function (oValue) {
				var oDate = Format.abapTimestampToDate(oValue.getTimeStamp());
				return oDate >= oMinTime && oDate <= oMaxTime && oValue.getVisible() && oValue.getMarkerType() === sap.gantt.simple.MarkerType.Diamond;
			});

			if (aAdhocLines.length > 0) {
				aAdhocLines.forEach(function (oAdhocLine) {
					AdhocLineRenderer.renderMarker(oRm, oAdhocLine, oGantt, that._getIHeaderHeight(), iMarkerAreaHeight);
			});
		}

		if (aDeltaLines.length !== 0) {
			aDeltaLines.forEach(function (oDeltaLine) {
				DeltaLineRenderer.renderDeltaLineHeader(oRm, oDeltaLine, oGantt, that._getIHeaderHeight(), iMarkerAreaHeight);
			});
		}
			oRm.close("g");
			oRm.close("svg");
		}

		var iNowLineAxisX = oAxisTime.getNowLabel(oGantt.getNowLineInUTC())[0].value;
		this.renderNowLineHeader(oRm, oGantt, {
			headerHeight: this._getIHeaderHeight(),
			nowLineX: iNowLineAxisX,
			iMarkerArea: iMarkerAreaHeight
		});
		// for selection
		oRm.openStart("g");
		oRm.class("sapGanttChartHeaderSelection");
		oRm.openEnd().close("g");
		oRm.close("svg");
		if ($HeaderPlaceHolder && $HeaderPlaceHolder.length > 0) {
			oRm.flush($HeaderPlaceHolder.get(0));
		}
		oRm.destroy();
		GanttExtension.attachEvents(oGantt);
		performance.mark("GanttHeader.renderElement--end");
	};

	GanttHeader.prototype.renderHeaderLabel = function(oRm, aLabel, mAttr) {
		var bRTL = GanttChartConfigurationUtils.getRTL();
		var bIEinRTLMode = Device.browser.edge && bRTL;

		aLabel.forEach(function(d) {
			oRm.openStart("text");
			oRm.class(mAttr.className);
			oRm.attr("text-anchor", "start");
			oRm.attr("x", d.value + (bRTL ? -5 : 5));
			oRm.attr("y", mAttr.y);

			if (bIEinRTLMode) {
				var iOffset = Utility.calculateStringLength(d.label) * (mAttr.fontSize / 2);
				oRm.attr("transform", "translate(" + (-iOffset) + ")");
			}

			oRm.openEnd();
			oRm.text(d.label);
			if (mAttr.className === "sapGanttTimeHeaderSvgTextMedium" && d.largeLabel) {
				// tooltip
				oRm.openStart("title").openEnd();
				oRm.text(d.largeLabel);
				oRm.close("title");
			}


			oRm.close("text");
		});
	};

	GanttHeader.prototype.renderIntervalLine = function(oRm, aLabel, mAttr) {
		// append path for scales on both rows
		var sPathD = "";
		for (var i = 0; i < aLabel.length; i++) {
			var oLabel = aLabel[i];
			if (oLabel) {
				sPathD +=
					" M" +
					" " + (oLabel.value - 1 / 2) +
					" " + mAttr.start +
					" L" +
					" " + (oLabel.value - 1 / 2 ) +
					" " + mAttr.end;
			}
		}

		oRm.openStart("path");
		oRm.attr("d", sPathD);
		oRm.class(mAttr.className);
		oRm.openEnd();
		oRm.close("path");
	};

	GanttHeader.prototype.renderNowLineHeader = function(oRm, oGantt, mAttr) {
		var aAdhocLines = oGantt.getSimpleAdhocLines();
		var aDeltaLines = oGantt.getDeltaLines();
		var nHeaderHeight = mAttr.headerHeight;
		var iMarkerArea = mAttr.iMarkerArea;
		var iHeight = nHeaderHeight;
		if (
			(oGantt.getEnableAdhocLine() === true && aAdhocLines.length > 0) ||
			( oGantt.getEnableDeltaLine() === true && aDeltaLines.length > 0)) {
			iHeight = nHeaderHeight - iMarkerArea;
		}
		var iHeaderHeight = iHeight,
			iNowlineX = mAttr.nowLineX;

		if (oGantt.getEnableNowLine() === false || isNaN(iNowlineX)) {
			return;
		}

		var mLengthOfSide = 8;
		var halfTriangleWidth = mLengthOfSide / 2,
			tringleHeight = Math.sqrt(
				mLengthOfSide * mLengthOfSide - halfTriangleWidth * halfTriangleWidth
			);
		var sPathD = [
			[iNowlineX, iHeaderHeight],
			[iNowlineX - halfTriangleWidth, iHeaderHeight - tringleHeight],
			[iNowlineX + halfTriangleWidth, iHeaderHeight - tringleHeight],
			[iNowlineX, iHeaderHeight]
		].reduce(function (sInit, point, i) {
			var sPoint = point.join(",");
			return i === 0 ? "M" + sPoint : sInit + "L" + sPoint;
		}, "");
		oRm.openStart("g");
		oRm.class("sapGanttNowLineHeaderSvgPath");
		oRm.openEnd();
		oRm.openStart("path");
		oRm.attr("d", sPathD);
		oRm.openEnd();
		oRm.close("path");

		oRm.close("g");
		if (
			(oGantt.getEnableAdhocLine() === true && aAdhocLines.length > 0) ||
			( oGantt.getEnableDeltaLine() === true && aDeltaLines.length > 0)) {
			oRm.openStart("g");
			oRm.class("sapGanttNowLineBodySvgLine");
			oRm.openEnd();
			var oStraightLine = new BaseLine({
				x1: iNowlineX,
				y1: iHeight,
				x2: iNowlineX,
				y2: "100%",
				strokeWidth: 1
			}).setProperty("childElement", true);

			oStraightLine.renderElement(oRm, oStraightLine);
			oRm.close("g");
		}
	};

	GanttHeader.prototype.renderOverflowToolbar = function(oRm, oGantt) {
		var sGanttId = oGantt.getId();
		if (!this._oOverflowToolbar) {
			this.setAggregation("_overflowToolbar", new sap.m.OverflowToolbar(sGanttId + "-ganttHeaderOverflowToolbar", {
				design: "Solid"
			}).addStyleClass("sapGanttHeaderOverflowToolbar"));
			this.getAggregation("_overflowToolbar").addContent(new sap.m.ToolbarSpacer());
			this._oOverflowToolbar = true;
		}
		var aOverflowToolbarItems = oGantt.getOverflowToolbarItems();
		if (aOverflowToolbarItems.length > 0) {
			aOverflowToolbarItems.forEach(function(overflowToolbarItem) {
				this.getAggregation("_overflowToolbar").addContent(overflowToolbarItem);
			}.bind(this));
		}
		this.getAggregation("_overflowToolbar").setWidth("100%");
		oRm.openStart("div", sGanttId + "-ganttHeaderOverflowToolbarContainer");
		oRm.style("width", "100%");
		oRm.style("position", "absolute");
		oRm.openEnd();
		oRm.renderControl(this.getAggregation("_overflowToolbar"));
		oRm.close("div");
	};

	GanttHeader.prototype.exit = function() {
		if (this._oOverflowToolbar) {
			this._oOverflowToolbar = false;
		}
	};

	return GanttHeader;
	},
	true
);
