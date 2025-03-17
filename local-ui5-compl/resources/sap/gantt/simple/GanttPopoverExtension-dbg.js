/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/events/KeyCodes",
	"sap/ui/core/Core",
	"sap/gantt/misc/Utility",
	"./GanttExtension",
	"./GanttUtils",
	"./CoordinateUtils",
	"sap/gantt/library",
	"sap/gantt/utils/GanttChartConfigurationUtils",
	"sap/ui/core/Lib"
],
function(
	jQuery,
	KeyCodes,
	Core,
	Utility,
	GanttExtension,
	GanttUtils,
	CoordinateUtils,
	library,
	GanttChartConfigurationUtils,
	Lib
) {
	"use strict";

	var _sNamespace = ".sapGanttPopover";
	var sMouseDown = "mousedown";
	var sMouseDownWithNamespace = sMouseDown + _sNamespace;
	var aEvents = ["mousemove", "mouseup", "keydown"];
	var BrowserEvent = aEvents.reduce(function(events, name){
		events[name] = name;
		return events;
	}, {});

	var aEventWithNamespace = aEvents.map(function(sEvent) { return sEvent + _sNamespace; });

	var PopoverHelper = {
		dispatchEvent: function(oEvent) {
			var oExtension = this._getPopoverExtension();
			if (oEvent.type === BrowserEvent.mousemove) {
				oExtension.onMouseMove(oEvent);
			} else if (oEvent.type === BrowserEvent.mouseup) {
				oExtension.onMouseUp(oEvent);
			} else if (oEvent.type === BrowserEvent.keydown) {
				oExtension.onKeydown(oEvent);
			}
		},
		entry: function(oEvent) {
			var oExtension = this._getPopoverExtension();
			oExtension.onMouseDown(oEvent);
		},
		addEventListeners: function(oGantt) {
			this.removeEventListeners(oGantt);
			var oSvg = jQuery(oGantt._getPopoverExtension().getDomRefs().ganttSvg);
			oSvg.on(sMouseDownWithNamespace, PopoverHelper.entry.bind(oGantt) );
		},
		removeEventListeners: function(oGantt) {
			var oSvg = jQuery(oGantt._getPopoverExtension().getDomRefs().ganttSvg);
			oSvg.off(sMouseDownWithNamespace);
		},
		addPopoverEventListeners: function(oGantt) {
			this.removePopoverEventListeners(oGantt);
			aEventWithNamespace.forEach(function(sEventName) {
				jQuery(document).on(sEventName, PopoverHelper.dispatchEvent.bind(oGantt) );
			});
		},
		removePopoverEventListeners: function(oGantt) {
			jQuery(document).off(_sNamespace);
		}
	};

	var SnapMode = library.dragdrop.SnapMode;

	/**
	 * For time popover on ganttchart.
	 *
	 * @extends sap.gantt.simple.GanttExtension
	 * @author SAP SE
	 * @version 1.132.0
	 * @constructor
	 * @private
	 * @alias sap.gantt.simple.GanttPopoverExtension
	 */
	var GanttPopoverExtension = GanttExtension.extend("sap.gantt.simple.GanttPopoverExtension", {
		/**
		 * @override
		 * @inheritDoc
		 * @returns {string} The name of this extension.
		 */
		_init: function(oGantt, mSettings) {
			this._initPopoverStates();
			return "PopoverExtension";
		},

		/**
		 * @override
		 * @inheritDoc
		 */
		_attachEvents: function() {
			var oGantt = this.getGantt();
			PopoverHelper.addEventListeners(oGantt);
		},

		/**
		 * @override
		 * @inheritDoc
		 */
		_detachEvents: function() {
			var oGantt = this.getGantt();
			PopoverHelper.removeEventListeners(oGantt);
		}
	});

	GanttPopoverExtension.prototype._initPopoverStates = function() {
		this._iOffsetX = 10;
		this._iOffsetY = 32;
		this._bNeedReverse = false;
		this.snapTimer = null;
	};

	GanttPopoverExtension.prototype.onMouseMove = function(oEvent) {
		var oDragExtension = this.getGantt()._getDragDropExtension();
		if (this.getGantt().getShowShapeTimeOnDrag() && this.isDraggingOrResizing(oEvent)) {
			if (this.getGantt().getSnapMode() !== SnapMode.None) {
				this._showPopoverOnSnap(oEvent, true);
			} else {
				this._showPopover(oEvent, true);
			}
		} else if (oDragExtension.isDragging() && this.bMultipleShapes) {
			if (this.getGantt().getSnapMode() !== SnapMode.None) {
				this._showPopoverOnSnap(oEvent);
			} else {
				this._showPopover(oEvent);
			}
		}
	};

	/**
	 * Showing PopOver with a debounce when snapMode is on to keep it sync with snapping.
	 */
	GanttPopoverExtension.prototype._showPopoverOnSnap = function(oEvent, bTimePopover) {
		if (this.snapTimer) {
			window.clearTimeout(this.snapTimer);
			this.snapTimer = null;
		}
		this.snapTimer = window.setTimeout(function() {
			this._showPopover(oEvent, bTimePopover);
		}.bind(this),100);
	};

	GanttPopoverExtension.prototype.onMouseDown = function(oEvent) {
		var oSelection = this.getGantt().getSelection();
		var iSelectedDraggableShapes = oSelection.numberOfSelectedDraggableShapes();
		this.bMultipleShapes = this.getGantt().getEnableMultipleGhosts() && iSelectedDraggableShapes > 1;
		this.pageWidth = window.innerWidth;
		this.pageHeight = window.innerHeight;
		PopoverHelper.addPopoverEventListeners(this.getGantt());
	};


	GanttPopoverExtension.prototype.onMouseUp = function(oEvent) {
		PopoverHelper.removePopoverEventListeners(this.getGantt());
		this._hidePopover(oEvent);
		this._initPopoverStates();
	};

	GanttPopoverExtension.prototype.onKeydown = function(oEvent) {
		if (oEvent.keyCode === KeyCodes.ESCAPE) {
			PopoverHelper.removePopoverEventListeners(this.getGantt());
			this._hidePopover(oEvent);
			this._initPopoverStates();
		}
	};

	GanttPopoverExtension.prototype.isDraggingOrResizing = function(oEvent) {
		var oDragExtension = this.getGantt()._getDragDropExtension();
		var oResizer = this.getGantt()._getResizeExtension();
		return (oDragExtension.isDragging() && !this.bMultipleShapes) || oResizer.isResizing();
	};

	GanttPopoverExtension.prototype._buildPopover =  function(oEvent, bTimePopover) {

		var _oRb = Lib.getResourceBundleFor("sap.gantt");
		var sStart = _oRb.getText("GNT_CURRENT_START");
		var sEnd = _oRb.getText("GNT_CURRENT_END");
		var oDragExtension = this.getGantt()._getDragDropExtension();
		var sNumberOfObjects = oDragExtension.getNumberOfDragObject();

		var createTimeDiv = function(sLabel, sClass) {
			var sContent = "<span class='sapUiTinyMarginEnd sapMLabel'>" + sLabel + "</span>"
				+ "<span class='sapMLabel " + sClass + "'></span>";
			return "<div class='sapUiTinyMargin'>" + sContent + "</div>";
		};

		var createCountDiv = function(sLabel, sClass) {
			var sContent = "<span class='sapMLabel " + sClass + "'>" + sLabel + "</span>";
			return "<div class='sapUiTinyMargin sapGanttPopoverCountText'>" + sContent + "</div>";
		};
		if (bTimePopover) {
			this.oTimePopover = jQuery("<div id='sapGanttPopoverWrapper' class='sapGanttDragElementHidden'>"
				+ createTimeDiv(sStart, "sapGanttPopoverStartTime")
				+ createTimeDiv(sEnd, "sapGanttPopoverEndTime")
				+ "</div>");
		} else {
			this.oCountPopover = jQuery("<div id='sapGanttPopoverWrapper' class='sapGanttDragElementHidden'>"
			+ createCountDiv(sNumberOfObjects, "sapGanttPopoverObjectCount")
			+ "</div>");
		}

		this.createAnchor();
		this._calcPopoverOffset();

		var oAnchor = jQuery(document.getElementById("sapGanttPopoverAnchor"));
		if (bTimePopover) {
			oAnchor.append(this.oTimePopover);
		} else {
			oAnchor.append(this.oCountPopover);
		}

		var oPositionData = this._getPopoverData(oEvent, bTimePopover);
		this._updateTime(oPositionData, bTimePopover);
	};

	GanttPopoverExtension.prototype._updateTime = function(oPositionData, bTimePopover) {
		var bRtl = GanttChartConfigurationUtils.getRTL();
		var sMarginDirction = bRtl ? "marginRight" : "marginLeft";
		var oStyle = { marginTop: oPositionData.offsetY + "px"};
		oStyle[sMarginDirction] = oPositionData.offsetX + "px";
		var oWrapper = jQuery(document.getElementById("sapGanttPopoverWrapper")).css(oStyle);
		if (bTimePopover) {
			oWrapper.find(".sapGanttPopoverStartTime").text(oPositionData.startNewDate);
			oWrapper.find(".sapGanttPopoverEndTime").text(oPositionData.endNewDate);
		}
	};

	GanttPopoverExtension.prototype._getDragDropOrResizingDom = function() {
		var oDragExtension = this.getGantt()._getDragDropExtension();
		var oResizer = this.getGantt()._getResizeExtension();
		if (oDragExtension.isDragging()) {
			return oDragExtension.dragGhost.get(0).children[0];
		} else if (oResizer.isResizing()) {
			var aShapes = GanttUtils.getShapesWithUid(this.getGantt().getId(), [oResizer.origin.resizeFor]);
			if (aShapes.length === 1 && aShapes[0]) {
				return document.getElementById(aShapes[0].getShapeUid() + "-selected");
			}
		}
	};

	GanttPopoverExtension.prototype.createAnchor = function(oEvent) {
		var oAnchor = jQuery(document.getElementById("sapGanttPopoverAnchor"));
		if (oAnchor.length === 0) {
			oAnchor = jQuery("<div id='sapGanttPopoverAnchor'></div>");
			jQuery(document.body).append(oAnchor);
		}
		this._oTargetDom = oAnchor.get(0);
	};

	GanttPopoverExtension.prototype.moveAnchor = function(oEvent, bTimePopover) {
		var oPoint = CoordinateUtils.getEventPosition(oEvent),
			iPageX = oPoint.pageX,
			iPageY = oPoint.pageY,
			iScreenWidth = this.pageWidth,
			iScreenHeight = this.pageHeight;

		if (iPageX < -this._iOffsetX) {
			iPageX = -this._iOffsetX;
		} else if (iPageX > iScreenWidth + this._iOffsetX) {
			iPageX = iScreenWidth + this._iOffsetX;
		}

		var iSpaceY = this._iOffsetY;
		if (bTimePopover && this.oTimePopover) {
			iSpaceY += this.oTimePopover.height();
		} else if (!bTimePopover && this.oCountPopover) {
			iSpaceY += this.oCountPopover.height();
		}

		if (iPageY < -this._iOffsetY) {
			iPageY = -this._iOffsetY;
		} else if (iPageY > iScreenHeight - iSpaceY) {
			iPageY = iScreenHeight - iSpaceY;
		}

		var oAnchorDom = document.getElementById("sapGanttPopoverAnchor");
		if (oAnchorDom) {
			oAnchorDom.style.left = iPageX + "px";
			oAnchorDom.style.top = iPageY + "px";
		}
	};

	GanttPopoverExtension.prototype.checkIfNeedReverse = function(oEvent, bTimePopover) {
		var bRtl = GanttChartConfigurationUtils.getRTL();
		var oPoint = CoordinateUtils.getEventPosition(oEvent);
		var iWidth = bTimePopover ? this.oTimePopover.width() + 10 : this.oCountPopover.width() + 10;
		if (bRtl && oPoint.pageX < iWidth || !bRtl && oPoint.pageX + iWidth >= this.pageWidth || (this.getGantt().getGhostAlignment() !== "End" && this.bMultipleShapes)) {
			this._bNeedReverse = true;
		} else {
			this._bNeedReverse = false;
		}
	};

	GanttPopoverExtension.prototype._showPopover = function(oEvent, bTimePopover) {
		this.moveAnchor(oEvent, bTimePopover);
		if ((bTimePopover && this.oTimePopover) || (!bTimePopover && this.oCountPopover)) {
			document.getElementById("sapGanttPopoverWrapper").classList.remove("sapGanttDragElementHidden");
			this.checkIfNeedReverse(oEvent, bTimePopover);
			this._calcPopoverOffset();
			var oPositionData = this._getPopoverData(oEvent, bTimePopover);
			this._updateTime(oPositionData, bTimePopover);
		} else {
			this._buildPopover(oEvent, bTimePopover);
		}
	};

	GanttPopoverExtension.prototype._hidePopover = function() {
		var oPopoverAnchorDom = document.getElementById("sapGanttPopoverAnchor");
		if (oPopoverAnchorDom) {
			oPopoverAnchorDom.parentNode.removeChild(oPopoverAnchorDom);
		}
		this.oTimePopover = null;
		this.oCountPopover = null;
	};

	GanttPopoverExtension.prototype._getPopoverData = function(oEvent, bTimePopover) {
		var iOffsetX = this._iOffsetX;
		if (this._bNeedReverse) {
			iOffsetX = bTimePopover ? -iOffsetX - this.oTimePopover.width() : -iOffsetX - this.oCountPopover.width();
		}

		var oPopoverData = {
			offsetX: iOffsetX,
			offsetY: this._iOffsetY
		};

		if (bTimePopover) {
			var oCurrentTime = this._getCurrentTime(oEvent);
			if (oCurrentTime) {
				var oLocale = this.getGantt().getLocale();
				var oFormater = GanttUtils.getTimeFormaterBySmallInterval(this.getGantt());
				oPopoverData.startNewDate = Utility.getLowerCaseLabel(oLocale.getFormattedDate(oFormater, oCurrentTime.time));
				oPopoverData.endNewDate = Utility.getLowerCaseLabel(oLocale.getFormattedDate(oFormater, oCurrentTime.endTime));
			}
		}
		return oPopoverData;
	};

	GanttPopoverExtension.prototype._getCurrentTime = function(oEvent) {
		var oDragExtension = this.getGantt()._getDragDropExtension();
		var oResizer = this.getGantt()._getResizeExtension();
		if (oDragExtension.isDragging()) {
			return oDragExtension._getGhostTime(oEvent, true);
		} else if (oResizer.isResizing()) {
			return oResizer._getResizeTime(oEvent);
		}
	};

	GanttPopoverExtension.prototype._calcPopoverOffset = function() {
		this._iOffsetY = this._getOffsetY();
	};

	GanttPopoverExtension.prototype._getOffsetY = function() {
		var _oDraggedDom = this._getDragDropOrResizingDom();
		var oDragClientRect = _oDraggedDom && _oDraggedDom.getBoundingClientRect();
		var iOffsetY = 32;
		if (oDragClientRect) {
			iOffsetY = oDragClientRect.height + 2;
		}
		return Math.ceil(iOffsetY);
	};

	GanttPopoverExtension.prototype._updatePopoverWhenAutoScroll = function(oEvent) {
		if (this.getGantt().getShowShapeTimeOnDrag() && this.isDraggingOrResizing()) {
			this._showPopover(oEvent, true);
		}
	};

	return GanttPopoverExtension;
});
