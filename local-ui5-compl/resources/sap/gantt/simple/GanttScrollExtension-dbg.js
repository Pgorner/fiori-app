/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/core/Core",
	"sap/ui/Device",
	"../misc/Format",
	"../config/TimeHorizon",
	"./GanttExtension",
	"./RenderUtils",
	"./GanttUtils",
	"sap/gantt/simple/AggregationUtils",
	"sap/gantt/utils/GanttChartConfigurationUtils"
],
	function(
		jQuery,
		Core,
		Device,
		Format,
		TimeHorizon,
		GanttExtension,
		RenderUtils,
		GanttUtils,
		AggregationUtils,
		GanttChartConfigurationUtils
	) {
	"use strict";

	var fnScrollLeft = function($elem, fValue) {
		var bRTL = GanttChartConfigurationUtils.getRTL();
		// scroll the wrapper of div element
		var sScrollLeftFn = bRTL ? "scrollLeftRTL" : "scrollLeft";
		if (typeof fValue === "number") {
			$elem[sScrollLeftFn](fValue);
		}
		return $elem[sScrollLeftFn]();
	};

	var sNamespace = ".sapGanttScroll";
	var sScrollEvent = "scroll" + sNamespace;
	var HorizontalScrollingHelper = {
		onHSBScroll: function(oEvent) {
			if (this.getHorizontalLazyLoadingEnabled() || this._isLazyLoadingEnabledForSyncedChart()) {
				if (this._iScrollTimer !== null) {
					clearTimeout(this._iScrollTimer);
				}
				this._iScrollTimer = setTimeout(function() {
					this._getScrollExtension().updateVisibleHorizonIfNecessary();
				}.bind(this), 150);
			} else {
				this._getScrollExtension().updateVisibleHorizonIfNecessary();
			}
		},

		/**
		 * Support shiftKey + mousewheel horizontal scroll on Gantt header & Body.
		 *
		 * @param {Event} oEvent MouseWheel Event
		 */
		 onMouseWheelScrolling: function(oEvent) {
			// scroll with shift and control key will handled by the zoom extension
			if (oEvent.shiftKey && oEvent.ctrlKey) {
				return;
			}

			var iSpinY = 0;
            if ('detail' in oEvent) {
                iSpinY = oEvent.detail;
            }

            if ('wheelDelta' in oEvent) {
                iSpinY = oEvent.wheelDelta / 120;
            }
            if ('wheelDeltaY' in oEvent) {
                iSpinY = oEvent.wheelDeltaY / 120;
            }
			var bSpinY = Math.abs(iSpinY) >= 1;

            var iHorizontalDelta = oEvent.deltaX;
            var iVerticalDelta = oEvent.deltaY;

            if (bSpinY) {
				iHorizontalDelta = oEvent.deltaY;
				iVerticalDelta = oEvent.deltaX;
            }

            var bHorizontalDelta = Math.abs(iHorizontalDelta) > Math.abs(iVerticalDelta);
			var oScrollExtension = this._getScrollExtension(),
				bHorizontalScrolling = bHorizontalDelta && oEvent.shiftKey;

			var iScrollDelta = bHorizontalDelta ? iHorizontalDelta : iVerticalDelta,
				bScrollingForward = iScrollDelta > 0,
				bScrolledToEnd = false;
			if (iScrollDelta === 0) {
				return;
			}

			if (bHorizontalScrolling) {
				var oHSb = oScrollExtension.getGanttHsb();

				if (bScrollingForward) {
					bScrolledToEnd = oHSb.scrollLeft === oHSb.scrollWidth - oHSb.offsetWidth;
				} else {
					bScrolledToEnd = oHSb.scrollLeft === 0;
				}
				if (!bScrolledToEnd) {
					oHSb.scrollLeft = oHSb.scrollLeft + iScrollDelta;
				}

				oEvent.preventDefault();
				oEvent.stopPropagation();
			}
		},

		getEventListenerTargets: function(oGantt) {
			var aEventListenerTargets = [
				oGantt.getDomRef("svg"),
				oGantt.getDomRef("header-svg")
			];

			return aEventListenerTargets.filter(function(oEventListenerTarget) {
				return oEventListenerTarget != null;
			});
		},

		onTouchStart: function(oEvent) {
			if (oEvent.type === "touchstart" || oEvent.pointerType === "touch") {

				var oScrollExtension = this._getScrollExtension(),
					oHSb = oScrollExtension.getGanttHsb();

				var oTouchObject = oEvent.touches ? oEvent.touches[0] : oEvent;

				oScrollExtension._mTouchSessionData = {
					initialPageX: oTouchObject.pageX,
					initialPageY: oTouchObject.pageY,
					initialScrollLeft: oHSb ? oHSb.scrollLeft : 0,
					initialScrolledToEnd: null
				};

			}
		},

		/**
		 * It only handle the horizontal scrolling on Gantt chart content. Vertical scroll is controlled by Table
		 *
		 * @param {Event} oEvent
		 */
		onTouchMoveHorizontalScrolling: function(oEvent){
			if (oEvent.type === "touchmove" || oEvent.pointerType === "touch") {

				var oScrollExtension = this._getScrollExtension();
				var mTouchSessionData = oScrollExtension._mTouchSessionData;

				var oTouchObject = oEvent.touches ? oEvent.touches[0] : oEvent;

				var iTouchDistanceX = (oTouchObject.pageX - mTouchSessionData.initialPageX);
				var iTouchDistanceY = (oTouchObject.pageY - mTouchSessionData.initialPageY);

				var bScrolledToEnd = false;
				var bScrollingPerformed = false;

				var bHorizontalScroll = Math.abs(iTouchDistanceX) > Math.abs(iTouchDistanceY);

				if (!mTouchSessionData || !bHorizontalScroll) {
					// return if no touch session or not horizontal scroll
					return;
				}

				var oHSb = oScrollExtension.getGanttHsb();

				if (iTouchDistanceX < 0) { // Scrolling to the right.
					bScrolledToEnd = oHSb.scrollLeft === oHSb.scrollWidth - oHSb.offsetWidth;
				} else { // Scrolling to the left.
					bScrolledToEnd = oHSb.scrollLeft === 0;
				}

				if (!mTouchSessionData.initialScrolledToEnd) {
					mTouchSessionData.initialScrolledToEnd = bScrolledToEnd;
				}

				if (!bScrolledToEnd && !mTouchSessionData.initialScrolledToEnd) {
					oHSb.scrollLeft = mTouchSessionData.initialScrollLeft - iTouchDistanceX;
					bScrollingPerformed = true;
				}


				if (bScrollingPerformed) {
					oEvent.preventDefault();
				}
			}
		},

		addEventListeners: function(oGantt) {
			var oExtension = oGantt._getScrollExtension();

			// remove scroll event to prevent duplications
			this.removeEventListeners(oGantt);

			jQuery(oExtension.getGanttHsb()).on(sScrollEvent, this.onHSBScroll.bind(oGantt));

			var aEventListenerTargets = this.getEventListenerTargets(oGantt);

			oExtension._mTouchEventListener = this.addTouchEventListener(aEventListenerTargets, oGantt);
			oExtension._mMouseWheelEventListener = this.addMouseWheelEventListener(aEventListenerTargets, oGantt);
		},


		removeEventListeners: function(oGantt) {
			var oExtension = oGantt._getScrollExtension();
			jQuery(oExtension.getGanttHsb()).off(sNamespace);

			HorizontalScrollingHelper.removeScrollEventListeners(oGantt);
		},

		addMouseWheelEventListener: function(aEventListenerTargets, oGantt) {
			var fnOnMouseWheelEventHandler = HorizontalScrollingHelper.onMouseWheelScrolling.bind(oGantt);
			for (var i = 0; i < aEventListenerTargets.length; i++) {
				aEventListenerTargets[i].addEventListener("wheel", fnOnMouseWheelEventHandler);
			}
			return {wheel: fnOnMouseWheelEventHandler};
		},


		addTouchEventListener: function(aEventListenerTargets, oGantt) {
			var fnOnTouchStartEventHandler = HorizontalScrollingHelper.onTouchStart.bind(oGantt);
			var fnOnTouchMoveEventHandler = HorizontalScrollingHelper.onTouchMoveHorizontalScrolling.bind(oGantt);
			var mListeners = {};

			for (var i = 0; i < aEventListenerTargets.length; i++) {
				/* Touch events */
				// Edge and Chrome on desktops and windows tablets - pointer events;
				// other browsers and tablets - touch events.
				if (Device.support.pointer && Device.system.desktop) {
					aEventListenerTargets[i].addEventListener("pointerdown", fnOnTouchStartEventHandler);
					aEventListenerTargets[i].addEventListener("pointermove", fnOnTouchMoveEventHandler,
						Device.browser.chrome ? {passive: true} : false);
				} else if (Device.support.touch) {
					aEventListenerTargets[i].addEventListener("touchstart", fnOnTouchStartEventHandler);
					aEventListenerTargets[i].addEventListener("touchmove", fnOnTouchMoveEventHandler);
				}
			}

			if (Device.support.pointer && Device.system.desktop) {
				mListeners = {pointerdown: fnOnTouchStartEventHandler, pointermove: fnOnTouchMoveEventHandler};
			} else if (Device.support.touch) {
				mListeners = {touchstart: fnOnTouchStartEventHandler, touchmove: fnOnTouchMoveEventHandler};
			}

			return mListeners;
		},

		removeScrollEventListeners: function(oGantt) {
			var oScrollExtension = oGantt._getScrollExtension();
			var aEventTargets = HorizontalScrollingHelper.getEventListenerTargets(oGantt);

			function removeEventListener(oTarget, mEventListenerMap) {
				for (var sEventName in mEventListenerMap) {
					var fnListener = mEventListenerMap[sEventName];
					if (fnListener) {
						oTarget.removeEventListener(sEventName, fnListener);
					}
				}
			}

			for (var i = 0; i < aEventTargets.length; i++) {
				removeEventListener(aEventTargets[i], oScrollExtension._mTouchEventListener);
				removeEventListener(aEventTargets[i], oScrollExtension._mMouseWheelEventListener);
			}

			delete oScrollExtension._mTouchEventListener;
			delete oScrollExtension._mMouseWheelEventListener;
		}
	};


	var GanttScrollExtension = GanttExtension.extend("sap.gantt.GanttScrollExtension", /** @lends sap.gantt.GanttScrollExtension.prototype */ {
		/**
		 * @override
		 * @inheritDoc
		 * @returns {string} The name of this extension.
		 */
		_init: function(oGantt, mSettings) {

			this.oGanttHsb = null;

			// This is to supress update visible horizon cyclic
			this._bSuppressSetVisibleHorizon = false;
			this.mOffsetWidth = null;

			return "ScrollExtension";
		},

		_attachEvents: function() {
			var oGantt = this.getGantt();
			HorizontalScrollingHelper.addEventListeners(oGantt);
		},

		/**
		 * @override
		 * @inheritDoc
		 */
		_detachEvents: function() {
			var oGantt = this.getGantt();
			HorizontalScrollingHelper.removeEventListeners(oGantt);
		},

		/**
		 * @override
		 * @inheritDoc
		 */
		destroy: function() {
			this._detachEvents();

			this._delegate = null;

			this.oGanttHsb = null;

			this.mOffsetWidth = null;

			GanttExtension.prototype.destroy.apply(this, arguments);
		}
	});

	/**
	 * Whenever table hsb scrolls, update the Gantt chart visible horizon then
	 * fire an internal event to update the container for horizontal scrolling sync.
	 * _bSuppressSetVisibleHorizon is used to break the cyclic calling
	 */
	GanttScrollExtension.prototype.updateVisibleHorizonIfNecessary = function() {
		performance.mark("GanttScrollExtension-updateVisibleHorizonIfNecessary--start");
		var oGantt = this.getGantt();
		if (oGantt) {
			if (!this._bSuppressSetVisibleHorizon){
				this._updateVisibleHorizonForce();
			}
			this._bSuppressSetVisibleHorizon = false;
			if (oGantt.getHorizontalLazyLoadingEnabled()){
				if (oGantt._isAllDataLoadedPromiseResolved){
					oGantt.getAggregation("_header").renderElement();
				}
			 } else {
				oGantt.getAggregation("_header").renderElement();
			 }
			if (!this.scrollTimer) {
				this.scrollTimer = window.setTimeout(function() {
					if (GanttUtils.isDynamicText()) {
						if (oGantt.getEnablePseudoShapes()){
							oGantt._bUpdateTriggeredDueToExpandCollapse = true;
						}
						oGantt.getTable().rerender();
					}
					var oDragExtension = oGantt._getDragDropExtension();
					if (oDragExtension._bEnableRowHighlight && oDragExtension.isDragging()) {
						oDragExtension.getShapeDndRowHighlightIndex(oGantt);
						oGantt.toggleDnDRowHighlight(true);
					}
					this.scrollTimer = null;
				}.bind(this),500);
			}
		}
		performance.mark("GanttScrollExtension-updateVisibleHorizonIfNecessary--end");
	};

	GanttScrollExtension.prototype._updateVisibleHorizonForce = function() {
		var oTimeHorizon = this._scrollLeftToVisibleHorizon();
		// var oTable = this.getGantt().getTable();
		this.getGantt()._updateVisibleHorizon(oTimeHorizon, "horizontalScroll", this.getVisibleWidth());
	};

	GanttScrollExtension.prototype.jumpToVisibleHorizon = function (sReasonCode) {
		// This is to ensure Gantt chart showing visible area
		this.getGantt()._updateVisibleHorizon(this.getGantt().getAxisTimeStrategy().getVisibleHorizon(), sReasonCode || "horizontalScroll", this.getVisibleWidth());
	};

	GanttScrollExtension.prototype._getGanttHsbScrollLeft = function() {
		return fnScrollLeft(jQuery(this.getGanttHsb()));
	};

	GanttScrollExtension.prototype.getContentWidth = function() {
		var oGantt = this.getGantt();

		var oAxisTime = oGantt.getAxisTime(),
			oRange = oAxisTime.getViewRange();
		return Math.abs(Math.ceil(oRange[1]) - Math.ceil(oRange[0]));
	};

	GanttScrollExtension.prototype.updateGanttScrollWidth = function() {
		var oGantt = this.getGantt();
		oGantt.getSyncedControl().setInnerWidth(oGantt.getContentWidth() + "px");
	};

	/**
	 * Visible width is what the user can see from the last column
	 * Need minus the vertical scroll bar with on RTL mode
	 *
	 * @returns {float} the visible width
	 */
	GanttScrollExtension.prototype.getVisibleWidth = function () {
		return jQuery(document.getElementById(this.getGantt().getId() + "-gantt")).width();
	};

	GanttScrollExtension.prototype.scrollGanttChartToVisibleHorizon = function() {
		var nScrollLeft = this._visibleHorizonToScrollLeft();
		var nScrollPosition = nScrollLeft - this.mOffsetWidth.svgOffset;
		var mDom = this.getDomRefs(),
			$gantt = jQuery(mDom.gantt),
			$header = jQuery(mDom.header),
			oGantt = this.getGantt();

		if (Math.abs(fnScrollLeft($gantt) - nScrollPosition) > (oGantt._iDiff || 0)) {

			var oHsb = this.getGanttHsb();
			if (oHsb) {
				if (fnScrollLeft(jQuery(oHsb)) === 0) {
					fnScrollLeft($gantt, 0);
					fnScrollLeft($header, 0);
				} else {
					fnScrollLeft($gantt, nScrollPosition);
					fnScrollLeft($header, nScrollPosition);
				}
				if (fnScrollLeft($gantt) !== 0){
					oGantt._iDiff = Math.abs(fnScrollLeft($gantt) - nScrollPosition);
				}
			}
		}

		// update shape connect effect after scroll
		this.getGantt()._getConnectExtension().updateShapeConnectEffect(this);
	};

	GanttScrollExtension.prototype.clearOffsetWidth = function() {
		this.mOffsetWidth = null;
		this.getGantt().getAxisTime().setViewOffset(0);
	};

	/**
	 * This is to ensure that the gantt chart show visible horizon on initial load (onAfterRendering)
	 *
	 * |<     content scroll left    >|
	 *                         _______|____________________________
	 *                        |                                    |
	 *                        |                                    |
	 *  ______________________|____________________________________|____________________
	 * |                      |       |                    |       |                    |
	 * |                      |       |                    |       |                    |
	 * |                      |       |<   visible area   >|       |                    |
	 * |                      |       |                    |       |                    |
	 * |                      |       |                    |       |                    |
	 * |                      |       |                    |       |                    |
	 * |______________________|_______|____________________|_______|____________________|
	 * |<   view offset      >|                                    |
	 *                        |<           svg area               >|
	 *                        |____________________________________|
	 *
	 * |<                                   total scroll area                          >|
	 *
	 */

	GanttScrollExtension.prototype.needRerenderGantt = function(fnRedrawGanttChart, sReasonCode, bToolbarSettingsItemChanged) {

		if (this.mOffsetWidth === null && !bToolbarSettingsItemChanged) {
			// usually the visible horizon or zoom rate changed
			this.updateGanttScrollWidth();
		}
		var oGantt = this.getGantt();
		if (!bToolbarSettingsItemChanged && sReasonCode !== "initialRender" && this.mOffsetWidth && this.doesSvgScrollWithinBuffer() && !this.getGantt().getSyncedControl().getRowsHeightChanged()) {
			this._scrollTableToVisibleHorizon(true);
			this.scrollGanttChartToVisibleHorizon();
			oGantt.getSyncedControl().scrollContentIfNecessary();
			return false;
		}

		this._scrollTableToVisibleHorizon(true);

		// exceed buffer, need rerender whole gantt in visible area with buffer
		// first need pull gantt to it's original scroll left
		this.updateSvgOffsetWidth();

		if ((sReasonCode !== "initialRender" || (sReasonCode === "initialRender" && bToolbarSettingsItemChanged)) && fnRedrawGanttChart) {
			fnRedrawGanttChart.apply(oGantt);
			// It has to be called after fnRedrawGanttChart because of svg width is set over there.
			this.scrollGanttChartToVisibleHorizon();
			oGantt.getSyncedControl().scrollContentIfNecessary();
		}
		if (oGantt._minTime && oGantt._minEndTime) {
			var iMinTime = oGantt._minTime.getTime();
			var iMinEndTime = oGantt._minEndTime.getTime();
			delete oGantt._minTime;
			delete oGantt._minEndTime;
			var oVisibleHorizon = oGantt.getAxisTimeStrategy().getVisibleHorizon();
			var iVisibleHorizonStartTime = Format.abapTimestampToDate(oVisibleHorizon.getStartTime()).getTime();
			var iVisibleHorizonEndTime = Format.abapTimestampToDate(oVisibleHorizon.getEndTime()).getTime();
			if ((iMinEndTime <= iVisibleHorizonStartTime) || (iMinTime >= iVisibleHorizonEndTime)) {
				var nVisibleWidth = oGantt.getVisibleWidth();
				var timeRangePerPixel = (iVisibleHorizonEndTime - iVisibleHorizonStartTime) / nVisibleWidth;
				var oMinTime = new Date(iMinTime - timeRangePerPixel * 5);	// buffer of 5px before the start time, similar to bird eye
				oGantt.jumpToPosition(oMinTime);
			}
		}

		return true;
	};

	GanttScrollExtension.prototype._scrollTableToVisibleHorizon = function (bSuppress) {
		var $hsb = jQuery(this.getGanttHsb()),
			iCurrentScrollLeft = this._getGanttHsbScrollLeft();

		var iExpectScrollLeft = this._visibleHorizonToScrollLeft();
		var oAxisTime = this.getGantt().getAxisTime();
		var iExpectedTimestamp = Format.dateToAbapTimestamp(oAxisTime.viewToTime(iExpectScrollLeft, true));
		var iCurrentTimeStamp = Format.dateToAbapTimestamp(oAxisTime.viewToTime(iCurrentScrollLeft, true));
		if (iExpectedTimestamp != iCurrentTimeStamp && Math.abs(iCurrentScrollLeft - iExpectScrollLeft) > 1 ) {
			this._bSuppressSetVisibleHorizon = bSuppress;
			fnScrollLeft($hsb, iExpectScrollLeft);
		}
	};

	GanttScrollExtension.prototype.updateSvgOffsetWidth = function() {
		var mOffsetWidth = this.calcSvgLatestOffsetWidth();
		this.getGantt().getAxisTime().setViewOffset(mOffsetWidth.svgOffset);
		this.getGantt().iGanttRenderedWidth = mOffsetWidth.svgWidth;

		this.mOffsetWidth = {
			svgWidth: mOffsetWidth.svgWidth,
			svgOffset: mOffsetWidth.svgOffset
		};
	};

	GanttScrollExtension.prototype.doesSvgScrollWithinBuffer = function() {
		var iVisibleWidth = this.getVisibleWidth(),
			iContentWidth = this.getContentWidth(),
			iContentScrollLeft = this._visibleHorizonToScrollLeft();

		if (this.mOffsetWidth === null) {
			return false;
		}

		var iSvgOffset = this.mOffsetWidth.svgOffset,
			iSvgWidth  = this.mOffsetWidth.svgWidth;

		var bInBuffer = (iVisibleWidth >= iContentWidth) ||
			(iContentScrollLeft - iSvgOffset >= 0 &&
			 iSvgWidth >= iContentScrollLeft - iSvgOffset + iVisibleWidth);

		return bInBuffer;
	};

	GanttScrollExtension.prototype.calcSvgLatestOffsetWidth = function() {
		var iContentWidth = this.getContentWidth(),
			iVisibleWidth = this.getVisibleWidth(),
			oGantt = this.getGantt();
		var iContentScrollLeft = this._getGanttHsbScrollLeft() || 0; // in case there is no HSB, fallback to 0
		var iSVGWidth = RenderUtils.getGanttRenderWidth(oGantt); //iVisibleWidth * (1 + fExtendFactor * 2);

		var iOffset = oGantt.getHorizontalLazyLoadingEnabled()  && !oGantt._isAllDataLoadedPromiseResolved ? iContentScrollLeft : iContentScrollLeft - (iVisibleWidth * RenderUtils.RENDER_EXTEND_FACTOR);

		if (iOffset < 0) {
			iSVGWidth += iOffset;
			iOffset = 0;
		}

		if (iOffset + iSVGWidth > iContentWidth) {
			iSVGWidth = iContentWidth - iOffset;
		}

		return {
			svgWidth: iSVGWidth,
			svgOffset: iOffset
		};
	};

	GanttScrollExtension.prototype._visibleHorizonToScrollLeft = function() {
		var oTimeHorizon = this.getGantt().getAxisTimeStrategy().getVisibleHorizon();

		var bRTL = GanttChartConfigurationUtils.getRTL(),
			sTime = oTimeHorizon.getStartTime();
		var iScrollLeft = this.getGantt().getAxisTime().timeToView(Format.abapTimestampToDate(sTime), true /**bIgnoreOffset*/);
		if (bRTL) {
			iScrollLeft =  iScrollLeft - this.getVisibleWidth();
		}
		if (iScrollLeft < 0) {
			iScrollLeft = 0;
		}
		return iScrollLeft;
	};

	GanttScrollExtension.prototype._scrollLeftToVisibleHorizon = function() {
		var bRTL = GanttChartConfigurationUtils.getRTL(),
			oAxisTime = this.getGantt().getAxisTime();
		var iScrollLeft = this._getGanttHsbScrollLeft();

		var oStartTime = oAxisTime.viewToTime(iScrollLeft, true),
			oEndTime;
		if (bRTL) {
			oEndTime = oAxisTime.viewToTime(iScrollLeft, true);
			oStartTime = undefined;
		}

		return new TimeHorizon({
			startTime: oStartTime,
			endTime: oEndTime
		});
	};

	GanttScrollExtension.prototype.getGanttHsb = function() {
		var oGantt = this.getGantt();
		if (oGantt) {
			this.oGanttHsb = oGantt.getDomRef("hsb");
		}
		return this.oGanttHsb;
	};

	return GanttScrollExtension;
});
