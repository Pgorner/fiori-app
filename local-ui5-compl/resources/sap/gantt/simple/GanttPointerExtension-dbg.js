/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/core/Core",
	"sap/gantt/misc/Utility",
	"./GanttExtension",
	"../drawer/CursorLine",
	"./CoordinateUtils",
	"./GanttUtils",
	"sap/ui/core/format/DateFormat",
	"sap/m/Text",
	"sap/gantt/utils/GanttChartConfigurationUtils",
	"sap/gantt/library"
], function(
	jQuery,
	Core,
	Utility,
	GanttExtension,
	CursorLineDrawer,
	CoordinateUtils,
	GanttUtils,
	DateFormat,
	Text,
	GanttChartConfigurationUtils,
	library
) {
	"use strict";

	// Listen event on Gantt SVG only
	var sNamespace = ".sapGanttPointer";
	var ContextMenuEvent = "contextmenu" + sNamespace;
	var DragOrientation = sap.gantt.DragOrientation;
	var SelectionMode = library.SelectionMode;

	// Here mouseenter = mouseover; mouseleave = mouseout
	var aMouseEvents = ["mouseenter", "mouseleave", "click", "dblclick", "mouseup", "mousedown"],
		aMouseEventWithNS = aMouseEvents.map(function(sEvent) { return sEvent + sNamespace; });

	var sMousemoveEvent = "mousemove",
		sMousemoveEventWithNamespace = sMousemoveEvent + sNamespace,
		sMouseEventForAutoScrollWithNamespace = sMousemoveEventWithNamespace + " mouseup" + sNamespace;

	var BrowserEvent = aMouseEvents.reduce(function(events, name){
		events[name] = name;
		return events;
	}, {});
	BrowserEvent[sMousemoveEvent] = sMousemoveEvent;

	var Direction = {
		Forward: "forward",
		Backward: "backward",
		Bottom: "bottom",
		Top: "top"
	};

	//delay to trigger auto scroll and delay for each scroll
	var iDelayInMillis = 50;

	var isAdhocLinePresent = null;

	var GanttPointerHelper = {
		addEventListeners: function(oGantt) {
			var oExtension = oGantt._getPointerExtension(),
				$ganttSvg  = jQuery(oExtension.getDomRefs().ganttSvg),
				$headerSvg = jQuery(oExtension.getDomRefs().headerSvg);

			// To prevent duplicate binding, onBeforeRendering and onAfterRendering is not called in order
			// Sometimes onAfterRendering will be called twice one right after another
			GanttPointerHelper.removeEventListeners(oGantt);

			if (isAdhocLinePresent === null){
                isAdhocLinePresent = GanttUtils.adhocLinesPresentAndEnabled(oGantt);
			}

			aMouseEventWithNS.forEach(function(sEvent){
				$ganttSvg.on(sEvent, oExtension.onGanttChartMouseEvent.bind(oExtension));
				if (isAdhocLinePresent){
                    $headerSvg.on(sEvent, oExtension.onGanttChartMouseEvent.bind(oExtension));
                } else {
                    $headerSvg.off(sEvent, oExtension.onGanttChartMouseEvent.bind(oExtension));
                }
			});

			$ganttSvg.on(sMouseEventForAutoScrollWithNamespace, oExtension.onCrossSvgMouseEvent.bind(oExtension));

			$headerSvg.on(sMouseEventForAutoScrollWithNamespace, oExtension.onCrossSvgMouseEvent.bind(oExtension));

			// Show cursor line
			$ganttSvg.on(sMousemoveEventWithNamespace, oExtension.updateGanttCursorLine.bind(oExtension));

			// Event Delegation to bind contextmenu mouseover and mouseout event for each background row rectangle
			$ganttSvg.on("mouseover" + sNamespace, oExtension.onGanttChartRowHoverOn.bind(oExtension));
			$ganttSvg.on("mouseout" + sNamespace, oExtension.onGanttChartRowHoverOff.bind(oExtension));
			$ganttSvg.on(ContextMenuEvent, oExtension.onGanttChartContextMenu.bind(oExtension));
			oExtension._bIsMouseOnCorrectRow = true;
			oExtension._bMouseOnSvg = true;

            if (isAdhocLinePresent){
                this.bindBackgroundRowEventHeader($headerSvg, oExtension);
            } else {
                this.unbindBackgroundRowEventHeader($headerSvg);
			}

			// prevent mouse down event on Gantt chart header
			// default behavior is to reorder columns
			$headerSvg.on(BrowserEvent.mousedown + sNamespace, function(oEvent) {
				var oDragExtension = oGantt._getDragDropExtension();
				if (!oDragExtension.isEventTargetAdhocLine(oEvent) && !oDragExtension.isEventTargetDeltaLine(oEvent)) {
					oEvent.preventDefault();
					oEvent.stopPropagation();
					oEvent.stopImmediatePropagation();
					return false;
				}
			});

			// remember the cursor position whenever cursor moving inside the control
			jQuery(document.getElementById(oGantt.getId())).on(sMousemoveEventWithNamespace, CoordinateUtils.updateCursorPosition);
		},

		removeEventListeners: function(oGantt) {
			var oExtension = oGantt._getPointerExtension(),
				$ganttSvg  = jQuery(oExtension.getDomRefs().ganttSvg),
				$headerSvg = jQuery(oExtension.getDomRefs().headerSvg);
			// unbind all of the handlers in a namespace, regardless of event type
			$ganttSvg.off(sNamespace);
			if (isAdhocLinePresent === null){
                isAdhocLinePresent = GanttUtils.adhocLinesPresentAndEnabled(oGantt);
            }
            if (isAdhocLinePresent){
                $headerSvg.on(BrowserEvent.mousedown + sNamespace);
            } else {
                $headerSvg.off(BrowserEvent.mousedown + sNamespace);
            }
		},

		doGanttAutoScroll : function(oGantt, sDirection, oEvent, iLastScrollDistance) {
			var oExtension = oGantt._getPointerExtension();

			if (oExtension.iTableAutoScrollTimerId) {
				window.clearTimeout(oExtension.iTableAutoScrollTimerId);
				oExtension.iTableAutoScrollTimerId = null;
			}
			if (oExtension._bAutoScroll){
				// When extension triggers autoscroll and the cursor is stable, doGanttAutoScroll remembers the last event.
				// If the current position is out of gantt, the last event will trigger autoscroll time and time again.
				// So the extension should decide if to autoscroll by judging the current position.
				if (!oExtension.allowAutoScroll()) {
					return;
				}
				if (!oGantt._getDragDropExtension().isSnapping) {
					oExtension._toggleCursorLine(false);
				}
				var oResizer = oGantt._getResizeExtension();
				if (oResizer.isResizing()) {
					oResizer.onResizing(oEvent);
				}

				var oConnectExtension = oGantt._getConnectExtension();
				if (oConnectExtension.isShapeConnecting()) {
					oConnectExtension.onShapeConnecting(oEvent);
				}

				var oPopoverExtension = oGantt._getPopoverExtension();
				oPopoverExtension._updatePopoverWhenAutoScroll(oEvent);

				var oZoomExtention = oGantt._getZoomExtension();
				oZoomExtention._handleAutoScroll(oEvent);

				var bRtl = GanttChartConfigurationUtils.getRTL();
				var iStep = 30;
				if (Direction.Backward === sDirection || Direction.Top === sDirection) {
					iStep = (-1) * iStep;
				}

				if (Direction.Backward === sDirection || Direction.Forward === sDirection ) {
					oExtension._iStep = iStep;
				} else {
					oExtension._iStep = 0;
				}

				var $ScrollArea = this.getScrollArea(oGantt, sDirection);

				var sScrollFunction, bHorizontalScroll = false;
				if (sDirection === Direction.Forward || sDirection === Direction.Backward) {
					sScrollFunction = bRtl ? "scrollLeftRTL" : "scrollLeft";
					bHorizontalScroll = true;
				} else {
					sScrollFunction = "scrollTop";
					bHorizontalScroll = false;
				}

				oConnectExtension.storeScrollDistance(iStep, bHorizontalScroll);

				var iTargetScrollDistance = $ScrollArea[sScrollFunction]() + iStep;
				$ScrollArea[sScrollFunction](iTargetScrollDistance);

				var iScrollDistance = $ScrollArea[sScrollFunction]();

				// store real scroll distance for ConnectExtension
				if (iScrollDistance !== iTargetScrollDistance) {
					oConnectExtension.storeScrollDistance(iScrollDistance - iTargetScrollDistance, bHorizontalScroll);
				}

				// if not scroll to end, continue to scroll
				if (!(iLastScrollDistance !== undefined && iLastScrollDistance === iScrollDistance)) {
					oExtension.iTableAutoScrollTimerId = window.setTimeout(GanttPointerHelper.doGanttAutoScroll.bind(GanttPointerHelper),
						iDelayInMillis, oGantt, sDirection, oEvent, iScrollDistance);
				}
			}
		},

		getScrollArea: function(oGantt, sDirection) {
			var $ScrollArea;
			var oTable = oGantt.getTable();
			var	oTableVSB = jQuery(oTable.getDomRef(sap.ui.table.SharedDomRef.VerticalScrollBar));
			if (sDirection === Direction.Forward || sDirection === Direction.Backward) {
				$ScrollArea = jQuery(document.getElementById(oGantt.getId() + "-hsb"));
			} else {
				$ScrollArea = oTableVSB;
			}
			return $ScrollArea;
		},

        bindBackgroundRowEventHeader: function($headerSvg, oExtension) {
			jQuery($headerSvg[0]).on(BrowserEvent.click + sNamespace + " " + BrowserEvent.dblclick + sNamespace, function(oEvent) {
				oExtension.dispatchGanttClickHeader(oEvent);
			});
        },

        unbindBackgroundRowEventHeader: function($headerSvg) {
            jQuery($headerSvg[0]).off(sNamespace);
        }
	};

	/**
	 * For render/draw Now line ,vertical lines cursor lines
	 * Fire pointer events
	 *
	 * @extends sap.gantt.simple.GanttExtension
	 * @author SAP SE
	 * @version 1.132.0
	 * @constructor
	 * @private
	 * @alias sap.gantt.simple.GanttPointerExtension
	 */
	var GanttPointerExtension = GanttExtension.extend("sap.gantt.simple.GanttPointerExtension", /** @lends sap.gantt.simple.GanttPointerExtension.prototype */{
		/**
		 * @override
		 * @inheritDoc
		 * @returns {string} The name of this extension.
		 */
		_init: function(oGantt, mSettings) {
			// it's used to update gantt cursor line when mouse moving
			this._oCursorLineDrawer = new CursorLineDrawer();
			this.bPreventSingleClick = false;
			this.iTableAutoScrollTimerId = null;
			this._iStep = 0;
			this._iHoveredRowElement = null;

			return "PointerExtension";
		},

		/**
		 * @override
		 * @inheritDoc
		 */
		_attachEvents: function() {
			var oGantt = this.getGantt();
			GanttPointerHelper.addEventListeners(oGantt);
		},

		/**
		 * @override
		 * @inheritDoc
		 */
		_detachEvents: function() {
			var oGantt = this.getGantt();
			GanttPointerHelper.removeEventListeners(oGantt);
		},

		/**
		 * @override
		 * @inheritDoc
		 */
		destroy: function() {
			if (this._oCursorLineDrawer) {
				this._oCursorLineDrawer.destroy();
			}
			delete this.bPreventSingleClick;
		}
	});

	GanttPointerExtension.prototype.onGanttChartContextMenu = function(oEvent) {
		oEvent.preventDefault();
		//only fire contextMenu if and only if on gantt row rectangle
		if (this.isEventTargetOnGanttRow(oEvent) === false) { return; }

		var oGantt = this.getGantt();
		var iIndex = this._getRowIndexFromEvent(oEvent);
		var oRowSettings = oGantt.getTable().getRows()[iIndex].getAggregation("_settings");

		oGantt.fireShapeContextMenu({
			rowSettings: oRowSettings,
			pageX: oEvent.pageX,
			pageY: oEvent.pageY,
			originEvent: oEvent
		});
	};

	GanttPointerExtension.prototype.onGanttChartRowHoverOn = function(oEvent) {
		// only fire click/dblclick if and only if on gantt row rectangle
		if (this.isEventTargetOnGanttRow(oEvent) === false) { return; }
		// store the row being hovered
		this._iHoveredRowElement = oEvent.target;
		var iIndex = this._getRowIndexFromEvent(oEvent);
		var oGantt = this.getGantt();
		var oDragExtension = oGantt._getDragDropExtension();
		this._bIsMouseOnCorrectRow = true;
		if (oDragExtension._bEnableRowHighlight && oDragExtension.isDragging()) {
			this._bIsMouseOnCorrectRow = false;
			if (oDragExtension.oLastDraggedShapeData._highlightedRowIndex) {
				oDragExtension.oLastDraggedShapeData._highlightedRowIndex.forEach(function(index) {
					if (index === iIndex) {
						this._bIsMouseOnCorrectRow = true;
					}
				}.bind(this));
			}
		}
		this.onMouseHover(iIndex, true);
	};

	GanttPointerExtension.prototype.onGanttChartRowHoverOff = function(oEvent) {
		if (!this._iHoveredRowElement) {
			return;
		}
		// we're leaving the element – where to? Maybe to a descendant?
		var relatedTarget = oEvent.relatedTarget;
		while (relatedTarget) {
			// go up the parent chain and check – if we're still inside currentElem
			// then that's an internal transition – ignore it
			if (relatedTarget == this._iHoveredRowElement){
				return;
			}
			relatedTarget = relatedTarget.parentNode;
		}
		var iIndex = this._getRowIndexFromEvent(oEvent);
		this.onMouseHover(iIndex, false);
		this._iHoveredRowElement = null;
	};

	GanttPointerExtension.prototype.onGanttChartMouseEvent = function(oEvent) {
		// show cursor line
		this.updateGanttCursorLine(oEvent);

		if (oEvent.type === BrowserEvent.mousedown) {
			this.oMousedownTargetElement = oEvent.target;
		}

		if (oEvent.type === BrowserEvent.click || oEvent.type === BrowserEvent.dblclick) {
			//only fire click/dblclick if and only if on gantt row rectangle
			if (this.isEventTargetOnGanttRow(oEvent) === false) { return; }
			this.dispatchGanttClick(oEvent);
		}

		this.onMouseEnterLeaveEvent(oEvent);
	};

	// Handle mousemove and mouseup event on document for auto scroll
	GanttPointerExtension.prototype.onCrossSvgMouseEvent = function(oEvent) {
		var oGantt = this.getGantt();

		if (oEvent.type === BrowserEvent.mousemove) {

			if (this.needAutoscrollInContainerIfNecessary()) {
				this.updateCursorStyle("move");
				this.tableAutoScroll(oEvent);
			} else {
				var oDragExtension = oGantt._getDragDropExtension();
				var oConnectExtention = oGantt._getConnectExtension();
				var oResizer = oGantt._getResizeExtension();
				var oZoomExtention = oGantt._getZoomExtension();

				if ((oDragExtension.isDeltaLineDragging() || oDragExtension.isAdhocLineDragging() ||
					 oDragExtension.isDragging() || oResizer.isResizing() ||
					 oConnectExtention.isShapeConnecting() || oZoomExtention.isTimeZooming())) {
					this.tableAutoScroll(oEvent);
				}
			}
		}

		if (oEvent.type === BrowserEvent.mouseup) {
			this.oMouseupTargetElement = oEvent.target;
			this._bAutoScroll = false;
		}
	};

	GanttPointerExtension.prototype.needAutoscrollInContainerIfNecessary = function() {
		var oGanttContainer = this.getGantt().getParent();
		if (oGanttContainer && oGanttContainer.getGanttCharts) {
			var aCharts = oGanttContainer.getGanttCharts();
			var oCurrentChart = this.getGantt();
			return aCharts.some(function(oChart){
				return oChart !== oCurrentChart && oChart._getDragDropExtension().isDragging();
			});
		}
		return false;
	};

	GanttPointerExtension.prototype.updateCursorStyle = function(sStyle) {
		document.body.style.cursor = sStyle;
		this.getDomRefs().ganttSvg.style.cursor = sStyle;
	};

	GanttPointerExtension.prototype.isPointerInGanttChart = function(oEvent) {
		return this._bMouseOnSvg;
	};

	GanttPointerExtension.prototype.isPointerInCorrectRow = function(oEvent) {
		return this._bIsMouseOnCorrectRow;
	};

	GanttPointerExtension.prototype.onMouseEnterLeaveEvent = function(oEvent) {
		this.updateCursorStyle("default");
		if (oEvent.type === BrowserEvent.mouseenter) {
			this._bMouseOnSvg = true;
		} else if (oEvent.type === BrowserEvent.mouseleave) {
			this._bMouseOnSvg = false;
		}
	};

	GanttPointerExtension.prototype.dispatchGanttClick = function(oEvent) {
		if (oEvent.type === BrowserEvent.click) {
			if (this.oMousedownTargetElement === this.oMouseupTargetElement) {
				// only if mousedown and mouseup on the same element, should fire click
				this.onGanttSingleClick(oEvent);
				delete this.oMouseupTargetElement;
				delete this.oMousedownTargetElement;
			}
		} else if (oEvent.type === BrowserEvent.dblclick) {
			this.onGanttDoubleClick(oEvent);
		}
	};

	GanttPointerExtension.prototype.dispatchGanttClickHeader = function(oEvent) {
        if (oEvent.type === BrowserEvent.click) {
			this.onGanttSingleClick(oEvent);
			delete this.oMouseupTargetElement;
			delete this.oMousedownTargetElement;
        }
    };

	GanttPointerExtension.prototype.isEventTargetOnGanttRow = function(oEvent) {
		return jQuery(oEvent.target).hasClass("sapGanttBackgroundSVGRow");
	};

	GanttPointerExtension.prototype._getRowIndexFromEvent = function (oEvent) {
		return parseInt(oEvent.target.getAttribute("data-sap-ui-index"));
	};

	GanttPointerExtension.prototype._getRowIndexFromElement = function (oElem) {
		return parseInt(oElem.getAttribute("data-sap-ui-index"));
	};

	GanttPointerExtension.prototype.onGanttSingleClick = function(oEvent) {
		// update shape selection whenever empty area on Gantt chart is clicked
		if (!((oEvent.ctrlKey || oEvent.metaKey) && ([SelectionMode.MultiWithKeyboard, SelectionMode.MultiWithKeyboardAndLasso].indexOf(this.getGantt().getShapeSelectionMode()) > -1))){
			this.getGantt().getSelection().clearAllSelectedShapeIds();
		}
		this.getGantt().getSelection().updateShape(null, {
			selected: false,
			ctrl: oEvent.ctrlKey || oEvent.metaKey
		});

		var oGantt = this.getGantt();

		//set the strokedasharray to default for all the adhoc lines
		GanttUtils.resetStrokeDasharray(oGantt);

		// handle click event on svg, ensure row selection enabled
		var iIndex = this._getRowIndexFromEvent(oEvent);
		var oRow = oGantt.getTable().getRows()[iIndex];
		if (!oRow) { return; }

		var fnClickEvent = function () {
			if (this.bPreventSingleClick === false) {
				this._selectTableRow(oGantt, iIndex);
				var mCursor = CoordinateUtils.getLatestCursorPosition();
				oGantt.fireShapePress({
					shape: null, // explicitly set shape to null because event doesn't triggered on shapes
					row: oRow,
					ctrlOrMeta: oEvent.ctrlKey || oEvent.metaKey,
					pageX: mCursor.pageX,
					pageY: mCursor.pageY,
					originEvent: oEvent
				});
			}
			this.bPreventSingleClick = false;
		}.bind(this);

		if (oGantt.getDisableShapeDoubleClickEvent()) {
			this.bPreventSingleClick = false;
			fnClickEvent();
			return;
		}
		this.iSingleClickTimer = window.setTimeout(fnClickEvent.bind(this), 300);
	};

	GanttPointerExtension.prototype.onGanttDoubleClick = function(oEvent) {
		var oGantt = this.getGantt(),
			bIsDisabledDoubleClick = oGantt.getDisableShapeDoubleClickEvent(),
			iIndex, oRow;

		if (!bIsDisabledDoubleClick) {
			window.clearTimeout(this.iSingleClickTimer);
			this.bPreventSingleClick = true;
		}
		iIndex = this._getRowIndexFromEvent(oEvent);
		oRow = oGantt.getTable().getRows()[iIndex];

		this._selectTableRow(oGantt, iIndex);

		if (!bIsDisabledDoubleClick) {
			var mCursor = CoordinateUtils.getLatestCursorPosition();
			oGantt.fireShapeDoubleClick({
				shape: null, // explicitly set shape to null because event doesn't triggered on shapes
				row: oRow,
				pageX: mCursor.pageX,
				pageY: mCursor.pageY
			});
		}
	};

	GanttPointerExtension.prototype._selectTableRow = function(oGantt, iIndex) {
		var sTableRowSelectionBehavior = this.getGantt().getTable().getSelectionBehavior();
		var SelectionBehavior = sap.ui.table.SelectionBehavior;
		if (SelectionBehavior.Row === sTableRowSelectionBehavior || SelectionBehavior.RowOnly === sTableRowSelectionBehavior) {
			// Rows can be selected on the complete row.
			oGantt.getSyncedControl().syncRowSelection(iIndex);
		}
	};

	GanttPointerExtension.prototype.onMouseHover = function(iIndex, bHover) {
		this.getGantt().getSyncedControl().syncRowHover(iIndex, bHover);
	};

	GanttPointerExtension.prototype._getAutoScrollStep = function() {
		if (this._bAutoScroll) {
			return this._iStep;
		}
		return 0;
	};

	GanttPointerExtension.prototype.updateGanttCursorLine = function(oEvent) {
		if (this.getGantt().getEnableCursorLine() === false) { return; }
		if (this.getGantt()._getDragDropExtension().isSnapping) { return; }
		if (oEvent.type === BrowserEvent.mousemove) {
			var oSvgPoint = CoordinateUtils.getEventSVGPoint(this.getDomRefs().ganttSvg, oEvent);
			this._toggleCursorLine(true, oSvgPoint);
		} else if (oEvent.type === BrowserEvent.mouseleave) {
			this._toggleCursorLine(false);
		}
	};

	GanttPointerExtension.prototype._toggleCursorLine = function(bShow, oPosition) {
		var mDom = this._getCursorLineDOMs();
		var oGanttParent = this.getGantt().getParent();
		var isStatusBarVisible = oGanttParent.isA("sap.gantt.simple.GanttChartContainer") && oGanttParent.getEnableStatusBar();
		if (bShow) {
			// draw cursorLine. select svgs of all chart instances to impl synchronized cursorLine
			this._oCursorLineDrawer.drawSvg(mDom.allGanttSvg, mDom.allHeaderSvg, this.getGantt().getLocale(), oPosition);
			if (isStatusBarVisible) {
				this.customBar(oGanttParent,true,this.getGantt().getAxisTime().viewToTime(oPosition.x));
			}
			oGanttParent._bCalcTimeStamp = true;
			oGanttParent._timeStamp = false;
		} else {
			this._oCursorLineDrawer.destroySvg(mDom.allGanttSvg, mDom.allHeaderSvg);
			if (isStatusBarVisible) {
			    this.customBar(oGanttParent,false);
			}
		}
	};

	//Setting Date and Time on status bar of the container.
	GanttPointerExtension.prototype.customBar = function (oConatiner,val,timeValue) {
		var _oEmptyText = new Text({
            text: ""
		});
		var oLocale  = this.getGantt().getLocale();
		var oDateFormat = DateFormat.getDateTimeWithTimezoneInstance({ pattern: oConatiner.getStatusBarDatePattern(), calendarWeekNumbering: this.getGantt().getAxisTimeStrategy().getCalendarWeekNumbering(), showTimezone: false }); //Returns a DateFormat instance for date
	    var oTimeFormat = DateFormat.getDateTimeWithTimezoneInstance({ pattern: oConatiner.getStatusBarTimePattern(), showTimezone: false }); //Returns a DateFormat instance for time
		oConatiner.msgText.setWidth(val ? "70%" : "100%");
		oConatiner.dateTimeText.setWidth(val ? "30%" : "0%");
		oConatiner.dateTimeText.setText(val ? Utility.getLowerCaseLabel(oLocale.getFormattedDate(oDateFormat, timeValue) + " " + oLocale.getFormattedDate(oTimeFormat, timeValue)) : _oEmptyText.getText());
    };

	GanttPointerExtension.prototype._getCursorLineDOMs = function() {
		return {
			// add parent className to prevent sap-ui-perserve selection
			allHeaderSvg: d3.selectAll(".sapGanttChartWithSingleTable .sapGanttChartHeaderSvg"),
			allGanttSvg : d3.selectAll(".sapGanttChartWithSingleTable .sapGanttChartSvg")
		};
	};

	GanttPointerExtension.prototype.tableAutoScroll = function(oEvent) {
		this._bAutoScroll = false;
		var oGantt = this.getGantt();
		var oDragDropExtension = oGantt._getDragDropExtension();
		var bDragging = oDragDropExtension.isDragging();
		var bDragOrientation = oGantt.getDragOrientation();
		var bHorizontalDragging = bDragging && (bDragOrientation === DragOrientation.Horizontal);
		var bVerticalDragging = bDragging && (bDragOrientation === DragOrientation.Vertical);

		if (this.ifAutoScrollToRight() && !bVerticalDragging) {
			// in non-rtl mode, pointer is at the right edge of the gantt column
			window.setTimeout(function(){
				GanttPointerHelper.doGanttAutoScroll(this.getGantt(), Direction.Forward, oEvent);
			}.bind(this), iDelayInMillis);
		} else if (this.ifAutoScrollToLeft() && !bVerticalDragging) {
			// in non-rtl mode, pointer is at the left edge of the gantt column
			// scroll backward because bRtl is false
			window.setTimeout(function(){
				GanttPointerHelper.doGanttAutoScroll(this.getGantt(), Direction.Backward, oEvent);
			}.bind(this), iDelayInMillis);
		} else if (this.ifAutoScrollToDown() && !bHorizontalDragging) {
			// Scroll down
			window.setTimeout(function(){
				GanttPointerHelper.doGanttAutoScroll(this.getGantt(), Direction.Bottom, oEvent);
			}.bind(this), iDelayInMillis);
		} else if (this.ifAutoScrollToUp() && !bHorizontalDragging) {
			// Scroll up
			window.setTimeout(function(){
				GanttPointerHelper.doGanttAutoScroll(this.getGantt(), Direction.Top, oEvent);
			}.bind(this), iDelayInMillis);
		} else {
			this._bAutoScroll = false;
		}

	};

	GanttPointerExtension.prototype.ifAutoScrollToRight = function () {
		var oAutoScrollPosition = this.getAutoScrollPosition();
		this._bAutoScroll = oAutoScrollPosition.iLocationX > oAutoScrollPosition.oScrollAreaRect.left +
			oAutoScrollPosition.iScrollAreaWidth - oAutoScrollPosition.iScrollTriggerAreaWidth &&
			oAutoScrollPosition.iLocationX < oAutoScrollPosition.oScrollAreaRect.left + oAutoScrollPosition.iScrollAreaWidth &&
			oAutoScrollPosition.iScrollAreaScrollLeft + oAutoScrollPosition.iScrollAreaWidth < oAutoScrollPosition.oScrollArea.scrollWidth;
		return this._bAutoScroll;
	};

	GanttPointerExtension.prototype.ifAutoScrollToLeft = function () {
		var oAutoScrollPosition = this.getAutoScrollPosition();
		this._bAutoScroll = oAutoScrollPosition.iLocationX <
			oAutoScrollPosition.oScrollAreaRect.left + oAutoScrollPosition.iScrollTriggerAreaWidth &&
			oAutoScrollPosition.iLocationX > oAutoScrollPosition.oScrollAreaRect.left &&
			oAutoScrollPosition.iScrollAreaScrollLeft > 0;
		return this._bAutoScroll;
	};

	GanttPointerExtension.prototype.ifAutoScrollToDown = function () {
		var oAutoScrollPosition = this.getAutoScrollPosition();
		this._bAutoScroll = oAutoScrollPosition.iLocationY > oAutoScrollPosition.oVisibleScrollAreaRect.top +
			oAutoScrollPosition.iVisibleScrollAreaHeight - oAutoScrollPosition.iScrollTriggerAreaHeight &&
			oAutoScrollPosition.iLocationY < oAutoScrollPosition.oVisibleScrollAreaRect.top +
			oAutoScrollPosition.iVisibleScrollAreaHeight &&
			oAutoScrollPosition.iScrollAreaScrollTop + oAutoScrollPosition.iScrollAreaHeight -
			oAutoScrollPosition.iBaseRowHeight <= oAutoScrollPosition.iScrollHeight;
		return this._bAutoScroll;
	};

	GanttPointerExtension.prototype.ifAutoScrollToUp = function () {
		var oAutoScrollPosition = this.getAutoScrollPosition();
		this._bAutoScroll = oAutoScrollPosition.iLocationY < oAutoScrollPosition.oVisibleScrollAreaRect.top +
			oAutoScrollPosition.iScrollTriggerAreaHeight &&
			oAutoScrollPosition.iLocationY > oAutoScrollPosition.oVisibleScrollAreaRect.top;
		return this._bAutoScroll;
	};

	GanttPointerExtension.prototype.getAutoScrollPosition = function() {
		var bRtl = GanttChartConfigurationUtils.getRTL();
		var oTable = this.getGantt().getTable();
		var iCurrentScrollTriggerAreaWidth = 20,
			iCurrentScrollTriggerAreaHeight = 20,
			oCurrentScrollArea = document.getElementById(this.getGantt().getId() + "-gantt"),
			$ScrollArea = jQuery(oCurrentScrollArea),
			oCurrentScrollAreaRect = oCurrentScrollArea.getBoundingClientRect(),
			iCurrentScrollAreaWidth = $ScrollArea.outerWidth(),
			iCurrentScrollAreaHeight = $ScrollArea.outerHeight(),
			oCurrentVisibleScrollAreaRect = oCurrentScrollAreaRect,
			iCurrentVisibleScrollAreaHeight = iCurrentScrollAreaHeight,
			iCurrentBaseRowHeight = this.getGantt()._oExpandModel.getBaseRowHeight(),
			iCurrentScrollAreaScrollLeft = bRtl ? $ScrollArea.scrollLeftRTL() : $ScrollArea.scrollLeft();

		var $TableVSB = jQuery(oTable.getDomRef(sap.ui.table.SharedDomRef.VerticalScrollBar)),
			iCurrentScrollAreaScrollTop = $TableVSB.scrollTop(),
			iCurrentScrollHeight = $TableVSB.get(0).scrollHeight;

		var iCursorLocationX = CoordinateUtils.getLatestCursorPosition().pageX,
			iCursorLocationY = CoordinateUtils.getLatestCursorPosition().pageY;

		return {
			iLocationX: iCursorLocationX,
			iLocationY: iCursorLocationY,
			oScrollAreaRect: oCurrentScrollAreaRect,
			oScrollArea: oCurrentScrollArea,
			iScrollAreaWidth: iCurrentScrollAreaWidth,
			iScrollTriggerAreaWidth: iCurrentScrollTriggerAreaWidth,
			iScrollTriggerAreaHeight: iCurrentScrollTriggerAreaHeight,
			iScrollAreaScrollLeft: iCurrentScrollAreaScrollLeft,
			oVisibleScrollAreaRect: oCurrentVisibleScrollAreaRect,
			iVisibleScrollAreaHeight: iCurrentVisibleScrollAreaHeight,
			iScrollAreaScrollTop: iCurrentScrollAreaScrollTop,
			iBaseRowHeight: iCurrentBaseRowHeight,
			iScrollHeight: iCurrentScrollHeight,
			iScrollAreaHeight: iCurrentScrollAreaHeight
		};
	};

	GanttPointerExtension.prototype.allowAutoScroll = function() {
		return this.ifAutoScrollToRight() || this.ifAutoScrollToLeft() || this.ifAutoScrollToDown() || this.ifAutoScrollToUp();

	};

	return GanttPointerExtension;
});
