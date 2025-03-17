/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/events/KeyCodes",
	"sap/gantt/library",
	"./GanttExtension",
	"./CoordinateUtils",
	"./GanttUtils",
	"sap/gantt/misc/Format",
	"./RenderUtils",
	"sap/gantt/misc/Utility",
	"sap/gantt/utils/GanttChartConfigurationUtils",
	"sap/ui/core/Element",
	"sap/ui/core/Lib"
], function(
	jQuery,
	KeyCodes,
	library,
	GanttExtension,
	CoordinateUtils,
	GanttUtils,
	Format,
	RenderUtils,
	Utility,
	GanttChartConfigurationUtils,
	Element,
	Lib
) {
	"use strict";

	var _sNamespace = ".sapGanttDragDrop";
	var aEvents = ["mousemove", "mouseup", "keydown"];
	var sMouseDown = "mousedown";
	var BrowserEvent = aEvents.reduce(function(events, name){
		events[name] = name;
		return events;
	}, {});
	BrowserEvent[sMouseDown] = sMouseDown;

	var aEventWithNamespace = aEvents.map(function(sEvent) { return sEvent + _sNamespace; });
	var sMouseDownWithNamespace = sMouseDown + _sNamespace;
	var I_DRAG_THRESHOLD_DISTANCE = 3;

	var GhostAlignment = library.dragdrop.GhostAlignment;
	var SnapMode = library.dragdrop.SnapMode;
	var DragOrientation = sap.gantt.DragOrientation;
	var shapeEventType = library.simple.shapeEventType;

	var DragDropHelper = {
		dispatchEvent: function(oEvent) {
			var oExtension = this._getDragDropExtension();
			if (oEvent.type === BrowserEvent.mousedown) {
				oExtension.onMouseDown(oEvent);
			} else if (oEvent.type === BrowserEvent.mousemove) {
				oExtension.onMouseMove(oEvent);
			} else if (oEvent.type === BrowserEvent.mouseup) {
				oExtension.onMouseUp(oEvent);
			} else if (oEvent.type === BrowserEvent.keydown) {
				oExtension.onKeydown(oEvent);
			}
		},

		addEventListeners: function(oGantt) {
			this.removeEventListeners(oGantt);
			var oSvg = jQuery(oGantt._getDragDropExtension().getDomRefs().ganttSvg);
			oSvg.on(sMouseDownWithNamespace, DragDropHelper.dispatchEvent.bind(oGantt) );
			var oHeaderSvg = jQuery(oGantt._getDragDropExtension().getDomRefs().headerSvg);
			oHeaderSvg.on(sMouseDownWithNamespace, DragDropHelper.dispatchEvent.bind(oGantt) );
		},
		removeEventListeners: function(oGantt) {
			var oSvg = jQuery(oGantt._getDragDropExtension().getDomRefs().ganttSvg);
			oSvg.off(_sNamespace);
			var oHeaderSvg = jQuery(oGantt._getDragDropExtension().getDomRefs().headerSvg);
			oHeaderSvg.off(_sNamespace);
		},
		addDragDropEventListeners: function(oGantt) {
			this.removeDragDropEventListeners(oGantt);
			aEventWithNamespace.forEach(function(sEventName) {
				jQuery(document).on(sEventName, DragDropHelper.dispatchEvent.bind(oGantt) );
			});
		},
		removeDragDropEventListeners: function(oGantt) {
			aEventWithNamespace.forEach(function(sEventName) {
				jQuery(document).off(sEventName);
			});
		}
	};

	/**
	 * GanttDragDropExtension responsible for the followings:
	 *  1. Attach and detach DOM events for D&D
	 *  2. Create dragging ghost
	 *  3. Auto scroll during dragging
	 *  4. Fire D&D events on GanttChartWithTable instance
	 *
	 * @extends sap.gantt.simple.GanttExtension
	 * @author SAP SE
	 * @version 1.132.0
	 * @constructor
	 * @private
	 * @alias sap.gantt.simple.GanttExtension
	 */
	var GanttDragDropExtension = GanttExtension.extend("sap.gantt.simple.GanttDragDropExtension", {
		/**
		 * @override
		 * @inheritDoc
		 * @returns {string} The name of this extension.
		 */
		_init: function(oGantt, mSettings) {
			this._initDragStates();
			this._oGhostStyleConfigs = this._getGhostStyleConfig();
			return "DragDropExtension";
		},

		/**
		 * @override
		 * @inheritDoc
		 */
		_attachEvents: function() {
			var oGantt = this.getGantt();
			DragDropHelper.addEventListeners(oGantt);
		},

		/**
		 * @override
		 * @inheritDoc
		 */
		_detachEvents: function() {
			var oGantt = this.getGantt();
			DragDropHelper.removeEventListeners(oGantt);
		}
	});

	GanttDragDropExtension.prototype._initDragStates = function() {
		this.bDragging = false;
		this.adhocLineDrag = false;
		this.deltaLineDrag = false;
		this.adhocLineDragStart = false;
		this.deltaLineDragStart = false;
		this.isCursorlineDisabled = false;
		this.bElementDraggable = false;
		this.oAdhocLineElmDraggable = false;
		this.oDeltaLineElmDraggable = false;
		this.oMouseDownTarget = null;
		this.oLastDraggedShapeData = null;
		// Used to determine whether or not to fire drag start event
		// mDragPoint stores 4 values
		// curosr X and y when mouse down; draggable shape x and width;
		this.mDragPoint = {};
		this.bDragging = false;
		this.dragGhost = null;
		this.prevDragPoint = {};
		this.snapTimer = null;
		this.snapVal = 0;
		this.isSnapping = false;
		this.cursorLineSnapPoint = null;
	};

	GanttDragDropExtension.prototype._getGhostStyleConfig = function () {
		var oGantt = this.getGantt();
		var oStyleConfigs = {};
		if (oGantt.getAggregation && oGantt.getAggregation("shapeStyles") && oGantt.getAggregation("shapeStyles").length > 0) {
			var aStyleConfigs = oGantt.getAggregation("shapeStyles");
			aStyleConfigs.forEach(function(oStyleConfig) {
				if (oStyleConfig.getEventState() === shapeEventType.DragDrop) {
					oStyleConfigs[oStyleConfig.getName()] = oStyleConfig;
				}
			});
		} else if (oGantt.sParentAggregationName === "ganttCharts" && oGantt.getParentGanttChartContainer()) {
			var oGanttChartContainer = oGantt.getParentGanttChartContainer();
			if (oGanttChartContainer.getAggregation("shapeStyles") && oGanttChartContainer.getAggregation("shapeStyles").length > 0) {
				var aStyleConfigs = oGanttChartContainer.getAggregation("shapeStyles");
				aStyleConfigs.forEach(function(oStyleConfig) {
					if (oStyleConfig.getEventState() === shapeEventType.DragDrop) {
						oStyleConfigs[oStyleConfig.getName()] = oStyleConfig;
					}
				});
			}
		}

		return oStyleConfigs;
	};

	//Triggers when mousedown event is fired at an adhoc marker.
	GanttDragDropExtension.prototype.onAdhocMarkerMouseDown = function(oEvent) {
		var mPoint = CoordinateUtils.getEventSVGPoint(this.getDomRefs().headerSvg, oEvent),
				oFrame = oEvent.target.getBBox();
		this.oMouseDownTarget = oEvent.target;
		var oShape = Element.getElementById(this.oMouseDownTarget.id),
			mBias = {x: 0, y: 0};
		if (oShape) {
			mBias = Utility.getShapeBias(oShape);
		}
		this.mDragPoint = {
			cursorX: mPoint.x,
			cursorY: mPoint.y,
			shapeX: oFrame.x,
			shapeY: oFrame.y,
			shapeWidth: oFrame.width,
			shapeBias: mBias
		};
		DragDropHelper.addDragDropEventListeners(this.getGantt());
		this.adhocLineDrag = true;
	};

	//Triggers when mousedown event is fired at a delta marker.
	GanttDragDropExtension.prototype.onDeltaAreaMouseDown = function (oEvent) {
		var mPoint = CoordinateUtils.getEventSVGPoint(this.getDomRefs().headerSvg, oEvent),
				oFrame = oEvent.target.getBBox();
		this.oMouseDownTarget = oEvent.target;
		var oShape = Element.getElementById(this.oMouseDownTarget.id),
			mBias = {x: 0, y: 0};
		if (oShape) {
			mBias = Utility.getShapeBias(oShape);
		}
		this.mDragPoint = {
			cursorX: mPoint.x,
			cursorY: mPoint.y,
			shapeX: oFrame.x,
			shapeY: oFrame.y,
			shapeWidth: oFrame.width,
			shapeBias: mBias
		};
		var oDraggedDelta = oShape.getParent();
		this.oLastDraggedShapeData = {
			timeStamp : oDraggedDelta.getTimeStamp(),
			endTimeStamp : oDraggedDelta.getEndTimeStamp()
		};
		DragDropHelper.addDragDropEventListeners(this.getGantt());
		this.deltaLineDrag = true;
	};

	//Triggers when an adhoc line is dropped.
	GanttDragDropExtension.prototype.onAdhocLineDrop = function(oEvent) {
		if (this.oMouseDownTarget) {
			var adhocLine = jQuery(this.oMouseDownTarget).control(0, true).getParent();
			// collect adhoc line drop event data
			var oEventData = this._getAdhocDropData(oEvent);
			if (oEventData) {
				adhocLine.fireAdhoclineDrop(oEventData);
			}
			if (this.isCursorlineDisabled) {
				this.getGantt().setEnableCursorLine(true);
			}
			this.stopDragging();
		}
	};

	//Triggers when a delta line is dropped.
	GanttDragDropExtension.prototype.onDeltaLineDrop = function (oEvent) {
		if (this.oMouseDownTarget) {
			var deltaLine = jQuery(this.oMouseDownTarget).control(0, true).getParent();
			var oEventData = this._getDeltaMarkerDropEvent(oEvent);
			if (oEventData) {
				deltaLine.fireDeltalineDrop(oEventData);
			}
			if (this.isCursorlineDisabled) {
				this.getGantt().setEnableCursorLine(true);
			}
			this.stopDragging();
		}
	};

	//Triggers when an adhoc line is moved.
	GanttDragDropExtension.prototype.onAdhocLineMove = function(oEvent) {
		if (!this.adhocLineDragStart) {
			this.dragGhost = this.createDragGhost(this.oMouseDownTarget);
			this._hideScrollBarOnBody(true);
			this.adhocLineDragStart = true;
			if (this.getGantt().getEnableCursorLine()) {
				this.getGantt().setEnableCursorLine(false);
				this.isCursorlineDisabled = true;
			}
		} else {
			this.onLineDrag(oEvent);
		}
	};

	//Triggers when a delta line is moved.
	GanttDragDropExtension.prototype.onDeltaLineMove = function(oEvent) {
		if (!this.deltaLineDragStart) {
			this.dragGhost = this.createDragGhost(this.oMouseDownTarget);
			this._hideScrollBarOnBody(true);
			this.deltaLineDragStart = true;
			if (this.getGantt().getEnableCursorLine()) {
				this.getGantt().setEnableCursorLine(false);
				this.isCursorlineDisabled = true;
			}
		} else {
			this.onLineDrag(oEvent);
		}
	};

	//Checks a valid drop zone for lines when mousemove event is triggered.
	GanttDragDropExtension.prototype.onLineDrag = function (oEvent) {
		if (this.isValidDropZoneForLines(oEvent)) {
			this.updateCursorStyle("Move");
			this.updateHeaderCursorStyle("Move");
		} else {
			this.updateCursorStyle("not-allowed");
			this.updateHeaderCursorStyle("not-allowed");
		}
		this.showGhost(oEvent);
	};

	GanttDragDropExtension.prototype.onMouseDown = function(oEvent) {
		if (oEvent.button !== 0) {	// Button other than left mouse button, as oEvent.button = 0 in case of left click
			return;
		}
		this._bGhostsPositioned = false;
		this.bMultipleGhosts = false;
		this._bEnableRowHighlight = false;
		var oDraggedShape;
		if (this.isEventTargetAdhocLine(oEvent) ) {
			this.oAdhocLineElmDraggable = this.isAdhocLineDraggable(oEvent);
			if (this.oAdhocLineElmDraggable) {
				this.onAdhocMarkerMouseDown(oEvent);
				return;
			}
		}
		if (this.isEventTargetDeltaLine(oEvent)) {
			this.oDeltaLineElmDraggable = this.isDeltaLineDraggable(oEvent);
			if (this.oDeltaLineElmDraggable) {
				this.onDeltaAreaMouseDown(oEvent);
				return;
			}
		}
		if (!this.getGantt().getEnableSelectAndDrag()){
			oDraggedShape = this.getShapeElementByTarget(oEvent.target);
			if (oDraggedShape) {
				this.shapeSelectedOnMouseDown = true;
				this.initiallySelected = oDraggedShape.getSelected();
				if (!(oDraggedShape.isA("sap.gantt.simple.Relationship") && this.getGantt().getIsConnectorDetailsVisible())) {
						var skipFireSelectionChange = !oDraggedShape.getSelectable();
						this.getGantt().getSelection().updateShape(oDraggedShape.getShapeUid(), {
							selected: true,
							ctrl: oEvent.ctrlKey || oEvent.metaKey,
							draggable: oDraggedShape.getDraggable(),
							time: oDraggedShape.getTime(),
							endTime: oDraggedShape.getEndTime()
						},skipFireSelectionChange);
				}
			}
		}

		this.bElementDraggable = this.isEventTargetDraggable(oEvent);
		if (this.bElementDraggable) {
			var mPoint = CoordinateUtils.getEventSVGPoint(this.getDomRefs().ganttSvg, oEvent);
			var oDraggedShapeDom = this.getDraggableDOMElement(oEvent.target),
			    oShape = Element.getElementById(oDraggedShapeDom.id),
				oMainShape = oShape.getTask ? oShape.getTask() : oShape;
				if (oMainShape instanceof sap.gantt.simple.BaseConditionalShape) {
					oMainShape = oMainShape._getActiveShapeElement();
				}
				var oFrame = oMainShape.getDomRef("nonLabelGroup") ?  oMainShape.getDomRef("nonLabelGroup").getBBox() : oDraggedShapeDom.getBBox(),
				mBias = {x: 0, y: 0};
			if (oShape) {
				mBias = Utility.getShapeBias(oShape);
			}
			this.mDragPoint = {
				cursorX: mPoint.x,
				cursorY: mPoint.y,
				shapeX: oFrame.x,
				shapeY: oFrame.y,
				shapeWidth: oFrame.width,
				shapeBias: mBias
			};

			oDraggedShape = this.getShapeElementByTarget(oDraggedShapeDom);

			this.oMouseDownTarget = oDraggedShapeDom;
			this.oLastDraggedShapeData = {
				shapeUid: oDraggedShape.getShapeUid(),
				startTime: oDraggedShape.getTime(),
				endTime: oDraggedShape.getEndTime()
			};

			if (this.oSourceRow) {
				this.oSourceRow.destroy();
			}

			//Set SourceRow = Row instance from where the shape is dragged
			this.oSourceRow = this.getRowByShape(oDraggedShape);

			//If DragOritentation = Horizontal, set CurrentRow = Row instance where the Shape is present.
			if (this.getGantt().getDragOrientation() === DragOrientation.Horizontal) {
				this.oCurrentRow = GanttUtils.getRowInstancefromShape(oDraggedShape);
			}

			var aSelectedShapes = GanttUtils.getShapesWithUid(this._gantt.getId(), this._gantt.getSelectedShapeUid());
			this._aVisibleDraggableShapes = [];
			aSelectedShapes.forEach(function(oShape) {
				if (oShape && oShape.getDraggable() && oShape.sParentAggregationName !== "relationships") {
					this._aVisibleDraggableShapes.push(oShape);
				}
			}.bind(this));
			this.bMultipleGhosts = this.getGantt().getEnableMultipleGhosts() && this._aVisibleDraggableShapes.length > 1;
			this.mGhostLabelStyle = {};
			this._bEnableRowHighlight = oDraggedShape.getDragHighlightRows().length > 0 && (this._aVisibleDraggableShapes.length == 1);

			DragDropHelper.addDragDropEventListeners(this.getGantt());
		} else if (this.oSourceRow) {
			this.oSourceRow.destroy();
			this.oSourceRow = undefined;
		}
	};

	GanttDragDropExtension.prototype.updateCursorStyle = function(sStyle, sPointerEvent) {
		document.body.style.cursor = sStyle;
		this.getDomRefs().ganttSvg.style.cursor = sStyle;
		if (sPointerEvent) {
			this.getDomRefs().ganttChart.style.pointerEvents = sPointerEvent;
			this.getDomRefs().gantt.style.pointerEvents = "auto";
			this._bArePointerEventsDisabled = true;
			if (this.getDomRefs().ganttChartContainerToolbar) {
				this.getDomRefs().ganttChartContainerToolbar.style.pointerEvents = sPointerEvent;
			}
		} else if (this._bArePointerEventsDisabled) {
				this.getDomRefs().ganttChart.style.removeProperty("pointer-Events");
				this.getDomRefs().gantt.style.removeProperty("pointer-Events");
				this._bArePointerEventsDisabled = false;
				if (this.getDomRefs().ganttChartContainerToolbar) {
					this.getDomRefs().ganttChartContainerToolbar.style.removeProperty("pointer-Events");
				}
			}
	};

	GanttDragDropExtension.prototype.updateHeaderCursorStyle = function(sStyle,sPointerEvent) {
		this.getDomRefs().headerSvg.style.cursor = sStyle;
		if (sPointerEvent) {
			this.getDomRefs().ganttChart.style.pointerEvents = sPointerEvent;
			this.getDomRefs().gantt.style.pointerEvents = "auto";
			this._bArePointerEventsDisabled = true;
			if (this.getDomRefs().ganttChartContainerToolbar) {
				this.getDomRefs().ganttChartContainerToolbar.style.pointerEvents = sPointerEvent;
			}
		} else if (this._bArePointerEventsDisabled) {
				this.getDomRefs().ganttChart.style.removeProperty("pointer-Events");
				this.getDomRefs().gantt.style.removeProperty("pointer-Events");
				this._bArePointerEventsDisabled = false;
				if (this.getDomRefs().ganttChartContainerToolbar) {
					this.getDomRefs().ganttChartContainerToolbar.style.removeProperty("pointer-Events");
				}
			}
	};

	GanttDragDropExtension.prototype.onMouseMove = function(oEvent) {
		if (this.skipEvent(oEvent)) { return; }
		if (this.adhocLineDrag && this.oMouseDownTarget) {
			this.onAdhocLineMove(oEvent);
			return;
		}
		if (this.deltaLineDrag && this.oMouseDownTarget) {
			this.onDeltaLineMove(oEvent);
			return;
		}
		if (this.bDragging === false) {
			var oGantt = this.getGantt(),
				oDraggedShape = this.getShapeElementByTarget(this.oMouseDownTarget);
			if (this._bEnableRowHighlight && oDraggedShape) {
				this.getShapeDndRowHighlightIndex(oGantt, oDraggedShape);
			}
			var oNewPoint = CoordinateUtils.getEventSVGPoint(this.getDomRefs().ganttSvg, oEvent),
				bExceedDraggingThreshold = this.isExceedDraggingThreshold(oNewPoint),
				bShouldDragStart = bExceedDraggingThreshold && this.isAllowedVerticalOrentationDrag();
			this.bDragging = bShouldDragStart;
			this._aShapeNodes = [];
			this._aGhostImages = [];

			if (bShouldDragStart && this.oMouseDownTarget) {
				this._hideScrollBarOnBody(true);
				var oTargetShape = Element.getElementById(this.oMouseDownTarget.id);
				var oMainTargetShape = oTargetShape.getTask ? oTargetShape.getTask() : oTargetShape;
				if (oMainTargetShape instanceof sap.gantt.simple.BaseConditionalShape) {
					oMainTargetShape = oMainTargetShape._getActiveShapeElement();
				}
                this.oTargetDom = oMainTargetShape.getDomRef("nonLabelGroup") ?  oMainTargetShape.getDomRef("nonLabelGroup") : this.oMouseDownTarget;
				this.dragGhost = this.createDragGhost(this.oTargetDom, true);
                var oTargetDomBBox = this.oTargetDom.getBBox();
				if (this.bMultipleGhosts) {
					var mBias = Utility.getShapeBias(oTargetShape);
					this._coordinateDiff = {};
					var bRtl = GanttChartConfigurationUtils.getRTL();
					var xMain = bRtl ? oTargetDomBBox.x + mBias.x + oTargetDomBBox.width : oTargetDomBBox.x + mBias.x;
					var yMain = oTargetDomBBox.y + mBias.y;
					this._aVisibleDraggableShapes.forEach(function(oShape) {
						if (oShape.getId() !== this.oMouseDownTarget.id) {
							var oMainShape = oShape, oShapeDom;
							if (oShape.getTask){
								oMainShape = oShape.getTask();
							}
							if (oMainShape instanceof sap.gantt.simple.BaseConditionalShape) {
								oMainShape = oMainShape._getActiveShapeElement();
							}
							if (oMainShape.getDomRef("nonLabelGroup")){
								oShapeDom = oMainShape.getDomRef("nonLabelGroup");
							} else {
								oShapeDom = document.getElementById(oShape.getId());
							}
							this.createDragGhost(oShapeDom, false);
							var fWidth = bRtl ? oShapeDom.getBBox().width : 0;
							mBias = Utility.getShapeBias(oShape);
							var oCoordinateDiff = {
								xDiff : oShapeDom.getBBox().x + mBias.x + fWidth - xMain,
								yDiff : oShapeDom.getBBox().y + mBias.y - yMain,
								shape : oShape
							};
							this._coordinateDiff[oShape.getId()] = oCoordinateDiff;
						}
					}.bind(this));
				}
				this._bFirstTimeDrag = true;

				var oEventData = this._getDragStartEventData(oEvent);
				if (oEventData) {
					this.getGantt().fireDragStart(oEventData);
				}
			} else if (bExceedDraggingThreshold) {
				this.updateCursorStyle("not-allowed", "none");
			}
		} else {
			var currDragPos = CoordinateUtils.getEventSVGPoint(this.getDomRefs().ganttSvg, oEvent);
			if (Object.keys(this.prevDragPoint).length === 0 ||
				this.prevDragPoint.cursorX !== currDragPos.x ||
				this.prevDragPoint.cursorY !== currDragPos.y) {
					this.prevDragPoint = {
						cursorX: currDragPos.x,
						cursorY: currDragPos.y
					};
					if (this.bMultipleGhosts && this._bFirstTimeDrag) {
						this.iGhostTimer = window.setTimeout(function(){	// using timeout to make sure the ghosts are rendered once before positioning them
							this._updateGhostShapesPosition();
						}.bind(this), 100);
						this._bGhostsPositioned = true;
					}
					this._bFirstTimeDrag = false;
					this.onDragging(oEvent);
			}
		}
	};

	GanttDragDropExtension.prototype.getShapeDndRowHighlightIndex = function(oGantt, oShape) {
		var oTable = oGantt.getTable(),
		aRows = oTable.getRows(),
		iFirstRow = aRows[0].getIndex();
		var aDraggedShapeHighlightRows = oShape ? oShape.getDragHighlightRows() : this.oLastDraggedShapeData._dragHighlightRows;
		this.oLastDraggedShapeData._highlightedRowIndex = [];
		if (aDraggedShapeHighlightRows) {
			aDraggedShapeHighlightRows.forEach(function(oInfo) {
				var oMatchingRow = aRows.filter(function(oRow) {
					return oRow.getAggregation("_settings").getRowId() === oInfo;
				})[0];
				if (oMatchingRow) {
					this.oLastDraggedShapeData._highlightedRowIndex.push(oMatchingRow.getIndex() - iFirstRow);
				}
			}.bind(this));
			this.oLastDraggedShapeData._dragHighlightRows = aDraggedShapeHighlightRows;
		}
	};

	GanttDragDropExtension.prototype._updateGhostShapesPosition = function() {
		var aShapeGhosts = document.getElementsByClassName("sapGanttDragGhost");
		var oGhostWrapperDom = document.getElementById("sapGanttDragGhostWrapper");
		if (oGhostWrapperDom) {
			var aGhostHeights = [], i;
			for (i = 0; i < aShapeGhosts.length; i++) {
				aGhostHeights.push(aShapeGhosts[i].offsetHeight);
			}

			while (document.getElementsByClassName("sapGanttDragGhost").length > 1) {
				oGhostWrapperDom.lastElementChild.remove();	// remove all ghosts except the target shape's
			}

			var yBuffer = aGhostHeights[0];
			for (i = 1; i < this._aShapeNodes.length; i++) {
				var oShapeNode = this._aShapeNodes[i];
				var x = this._coordinateDiff[oShapeNode.id].xDiff;
				var y = this._coordinateDiff[oShapeNode.id].yDiff;
				var mOffset = {	// ghost's position relative to the wrapper
					left: x + "px",
					top: y - yBuffer + "px"
				};
				var sLabel = this._getGhostLabel( this._coordinateDiff[oShapeNode.id].shape, oShapeNode);
				var sDragGhostDom = "<div class='sapGanttDragGhost'>" +
					"<img class='sapGanttDragGhostImg' src='" + this._aGhostImages[i] + "'>" + sLabel +
				"</div>";
				oGhostWrapperDom.insertAdjacentHTML('beforeend', sDragGhostDom);
				oGhostWrapperDom.lastElementChild.style.left = mOffset.left;
				oGhostWrapperDom.lastElementChild.style.top = mOffset.top;
				if (sLabel !== "") {
					this._updateGhostLabelStyle();
				}
				yBuffer += aGhostHeights[i];
			}
			oGhostWrapperDom.classList.remove("sapGanttDragElementHidden");
		}
	};

	GanttDragDropExtension.prototype._getGhostLabel = function(oShape, oShapeDom) {
		if (!this.getGantt().getShowTextOnGhost()) {
			return "";
		}
		var sLabelDom = "", sTextContent = "", sFontSize = "13px", sFill = "#000", sFontFamily = "Arial", sFontWeight = "normal";
		var sVerticalAlignment = oShape.getVerticalTextAlignment();
		var oTitleDom = oShapeDom.nextSibling;

		if (oTitleDom && oTitleDom.tagName === "text" && oShape.getShowTitle() && oShape.getTitle() && oShape.getTitle().length && oTitleDom.textContent && oTitleDom.textContent.length) {
			sTextContent = oTitleDom.textContent;
			sFontSize = oTitleDom.style.fontSize || sFontSize;
			sFill = oTitleDom.style.fill || sFill;
			sFontFamily = oTitleDom.style.fontFamily || sFontFamily;
			sFontWeight = oTitleDom.style.fontWeight || sFontWeight;
			if (oShape.mProperties.hasOwnProperty("styleName")) {
				var oGhostStyles = this._oGhostStyleConfigs[oShape.getStyleName()];
				if (oGhostStyles && oGhostStyles.mProperties.hasOwnProperty('textFill')) {
					sFill = oGhostStyles.getTextFill();
				}
			}
		} else {
			return sLabelDom;
		}

		var bRtl = GanttChartConfigurationUtils.getRTL();
		var sCssRight = "0px", sCssLeft = "0px";

		if (bRtl) {
			sCssRight = (oShapeDom.getBBox().x - oShape.getXBias() + oShapeDom.getBBox().width) - (oTitleDom.getBBox().x + oTitleDom.getBBox().width) + "px";
		} else {
			sCssLeft = oTitleDom.getBBox().x - (oShapeDom.getBBox().x + oShape.getXBias()) + "px";
		}

		var fVertical = oShapeDom.getBBox().height - oTitleDom.getBBox().height;

		if (sVerticalAlignment === "Top") {
			fVertical = 0;
		} else if (sVerticalAlignment === "Center") {
			fVertical = fVertical / 2;
		}

		this.mGhostLabelStyle = {
			fontSize: sFontSize,
			color: sFill,
			fontFamily: sFontFamily,
			fontWeight: sFontWeight,
			top: fVertical + "px",
			right: sCssRight,
			left: sCssLeft
		};

		sLabelDom = "<div class='sapGanttDragGhostLabel'>" + sTextContent + "</div>";
		return sLabelDom;
	};

	GanttDragDropExtension.prototype._updateGhostLabelStyle = function() {
		var aDragGhostLabels = document.getElementsByClassName("sapGanttDragGhostLabel");
		var oDragGhostLabel = aDragGhostLabels[aDragGhostLabels.length - 1];
		for (var sStyle in this.mGhostLabelStyle) {
			oDragGhostLabel.style[sStyle] = this.mGhostLabelStyle[sStyle];
		}
	};

	GanttDragDropExtension.prototype.onMouseUp = function(oEvent) {
		if (this.bElementDraggable === true && this.bDragging === false) {
			// When mouseup on a draggable shape but dragging is false; then cleanup everything and return
			this.stopDragging(oEvent);
			// set everything on initial state
			this._initDragStates();
			return;
		}

		if (this.adhocLineDragStart && this.oMouseDownTarget) {
			this.onAdhocLineDrop(oEvent);
			this._initDragStates();
			return;
		}

		if (this.deltaLineDragStart && this.oMouseDownTarget) {
			this.onDeltaLineDrop(oEvent);
			this._initDragStates();
			return;
		}

		// collect shape drop event data
		var oEventData = this._getShapeDropEventData(oEvent);

		this.stopDragging(oEvent);
		if (oEventData) {
			var oGantt = this.getGantt();
			if (oGantt.getEnablePseudoShapes()){
				var trowIndex = oEventData.targetRow && oEventData.targetRow.getIndex();
				var oDraggedShapeDates = oEventData.draggedShapeDates;
				oGantt.pseudoShapeSpecificData = oGantt.pseudoShapeSpecificData ? oGantt.pseudoShapeSpecificData : {};
				oGantt.pseudoShapeSpecificData.oDraggedShapeDates = oDraggedShapeDates;
				oDraggedShapeDates && Object.keys(oDraggedShapeDates).forEach(function (sShapeUid) {
					var oShape = GanttUtils.getShapesWithUid(oGantt.getId(), [sShapeUid])[0];
					var srowIndex = oShape.getParentRowSettings().getParentRow().getIndex && oShape.getParentRowSettings().getParentRow().getIndex();

					oGantt.pseudoShapeSpecificData.draggedShapeTRowIndex =  trowIndex == undefined ? srowIndex : trowIndex;
				});
				oGantt.pseudoShapeSpecificData.needUpdateForTasksInAggr = true;
			}
		// fire shapeDrop event
			this.getGantt().triggerShapeDrop(oEventData);
		}
		//Rerendering assiociated Relationships
		if (this.oMouseDownTarget) {
			var oDraggedShape = this.getShapeElementByTarget(this.oMouseDownTarget);
			if (oDraggedShape) {
				GanttUtils.rerenderAssociatedRelationships(this.getGantt(), oDraggedShape);
			}
		}
		// set everything on initial state
		this._initDragStates();
	};

	GanttDragDropExtension.prototype._getDragStartEventData = function (oEvent) {
		return {
			sourceGanttChart: this.getGantt(),
			draggedShapeDates: this._getDraggedShapeDates(),
			lastDraggedShapeUid: this.oLastDraggedShapeData.shapeUid,
			cursorDateTime: this._getGhostTime(oEvent).cursorTime
		};
	};

	GanttDragDropExtension.prototype._getShapeDropEventData = function(oEvent) {
		var oGantt = this.getGantt();
		var oPointerExtension = oGantt._getPointerExtension();
		if (this.isValidDropZone(oEvent) && oPointerExtension.isPointerInCorrectRow()) {
			var oDroppedRow;
			var aShapeDates = this._getDraggedShapeDates();
			var oTargetGantt = this.getGanttChartByTarget(oEvent.target);
			//If DragOritentation = Horizontal, set oDroppedRow = (this.oCurrentRow)Row instance where the Shape is present.
			if (this.getGantt().getDragOrientation() === DragOrientation.Horizontal){
				oDroppedRow = this.oCurrentRow;
			} else {
				oDroppedRow = GanttUtils.getRowInstance(oEvent, oTargetGantt.getTable());
			}
			var oTargetShape = this.getShapeElementByTarget(oEvent.target);
			var oGhostTime = this._getGhostTime(oEvent);
			return {
				dragged: true,
				sourceGanttChart: oGantt,
				targetGanttChart: oTargetGantt,
				draggedShapeDates: aShapeDates,
				lastDraggedShapeUid: this.oLastDraggedShapeData.shapeUid,
				targetRow: oDroppedRow,
				cursorDateTime: oGhostTime.cursorTime,
				newDateTime: oGhostTime.newDateTime,
				targetShape: oTargetShape,
				sourceRowData: this.oSourceRow
			};
		} else {
			return {
				dragged: false
			};
		}
	};

	//Returns event data when an adhoc line is dropped.
	GanttDragDropExtension.prototype._getAdhocDropData = function(oEvent) {
		if (this.isValidDropZoneForLines(oEvent)) {
			var oGantt = this.getGantt();
			var oAxisTimes = oGantt.getAxisTime();
			var mPoint = CoordinateUtils.getEventSVGPoint(this.getDomRefs().headerSvg, oEvent);
			var oldTimeStamp = Format.dateToAbapTimestamp(oAxisTimes.viewToTime(this.mDragPoint.cursorX));
			var droppedTimeStamp = Format.dateToAbapTimestamp(oAxisTimes.viewToTime(mPoint.x));
			return {
				newTimeStamp : droppedTimeStamp,
				oldTimeStamp : oldTimeStamp
			};
		}
	};

	GanttDragDropExtension.prototype._getGhostTime = function(oEvent, bPopover) {
		var oGantt = this.getGantt();
		var oTargetGantt = this.getGanttChartByTarget(oEvent.target);

		var bCrossGanttDrop = oTargetGantt != null ? (oTargetGantt.getId() !== oGantt.getId()) : false;
		var oAxisTime = bCrossGanttDrop ? oTargetGantt.getAxisTime() : oGantt.getAxisTime();
		var targetSvg = bCrossGanttDrop ? window.document.getElementById(oTargetGantt.getId() + "-svg") : window.document.getElementById(oGantt.getId() + "-svg");
		var iShapeBiasX = this.mDragPoint.shapeBias.x;

		var iDroppedCursorX = bPopover ? CoordinateUtils.getEventSVGPoint(targetSvg, oEvent).x : CoordinateUtils.getEventSVGPoint(targetSvg, oEvent).x - iShapeBiasX;
		if (oGantt.getSnapMode() !== SnapMode.None) {
			iDroppedCursorX = iDroppedCursorX - this.snapVal;
		}
		var oCursorTime = oAxisTime.viewToTime(iDroppedCursorX);
		var oNewDateTime = oCursorTime;
		var bRtl = GanttChartConfigurationUtils.getRTL();
		var iShapeX = this.mDragPoint.shapeX + iShapeBiasX,
			iShapeWidth = bRtl ? -this.mDragPoint.shapeWidth : this.mDragPoint.shapeWidth,
			iStartMouseX = this.mDragPoint.cursorX;

		var oGhostTime = oCursorTime;
		var oGhostEndTime = oCursorTime;
		var iShapeDuration = this.oLastDraggedShapeData.endTime - this.oLastDraggedShapeData.startTime;
		if (this.getGantt().getDragOrientation() === DragOrientation.Vertical) {
			oGhostTime = this.oLastDraggedShapeData.startTime;
			oGhostEndTime = this.oLastDraggedShapeData.endTime;
			oNewDateTime = oGhostTime;
		} else if (this.getGantt().getGhostAlignment() === GhostAlignment.Start) {
				oGhostEndTime = iShapeDuration ? new Date(oGhostTime.getTime() + iShapeDuration) : oAxisTime.viewToTime(iDroppedCursorX + iShapeWidth);
				oNewDateTime = oCursorTime;
			} else if (this.getGantt().getGhostAlignment() === GhostAlignment.End) {
				oGhostTime = iShapeDuration ? new Date(oGhostEndTime.getTime() - iShapeDuration) : oAxisTime.viewToTime(iDroppedCursorX - iShapeWidth);
				oNewDateTime = oCursorTime;
			} else if (this.getGantt().getGhostAlignment() === GhostAlignment.None) {
				// cursor postion minus the delta
				var iNewShapeStartTime = bRtl ? (iDroppedCursorX - iShapeWidth - (iStartMouseX - iShapeX)) : (iDroppedCursorX - (iStartMouseX - iShapeX));
				var sNewShapeStartTime = oAxisTime.viewToTime(iNewShapeStartTime);
				oGhostTime = sNewShapeStartTime;
				oGhostEndTime = iShapeDuration ? new Date(oGhostTime.getTime() + iShapeDuration) : oAxisTime.viewToTime(iNewShapeStartTime + iShapeWidth);
				oNewDateTime = sNewShapeStartTime;
			}

		return {
			newDateTime: oNewDateTime,
			cursorTime: oCursorTime,
			time: oGhostTime,
			endTime: oGhostEndTime
		};
	};

	//Returns event data when a delta line is dropped.
	GanttDragDropExtension.prototype._getDeltaMarkerDropEvent = function (oEvent) {
		if (this.isValidDropZoneForLines(oEvent)) {
			var deltaLine = jQuery(this.oMouseDownTarget).control(0, true).getParent();
			var bRtl = GanttChartConfigurationUtils.getRTL();
			var sAlignment = this.getGantt().getGhostAlignment();
			var oAxisTimes = this.getGantt().getAxisTime();
			var mPoint = CoordinateUtils.getEventSVGPoint(this.getDomRefs().headerSvg, oEvent);
			var startX,
				endX;
			var iShapeWidth = this.mDragPoint.shapeWidth,
				iShapeX = this.mDragPoint.shapeX,
				iStartMouseX = this.mDragPoint.cursorX;

			if (sAlignment === GhostAlignment.Start) {
				startX = bRtl ? (mPoint.x - iShapeWidth) : mPoint.x;
				endX = bRtl ? mPoint.x : mPoint.x + iShapeWidth;
			} else if (sAlignment === GhostAlignment.None) {
				startX = mPoint.x + (iShapeX - iStartMouseX);
				endX = startX + iShapeWidth;
			} else if (sAlignment === GhostAlignment.End) {
				startX = bRtl ? mPoint.x : (mPoint.x - iShapeWidth);
				endX = bRtl ? mPoint.x + iShapeWidth : mPoint.x;
			}
			return {
				newStartTime: Format.dateToAbapTimestamp(oAxisTimes.viewToTime(bRtl ? endX : startX)),
				newEndTime: Format.dateToAbapTimestamp(oAxisTimes.viewToTime(bRtl ? startX : endX)),
				oldStartTime: deltaLine.getTimeStamp(),
				oldEndTime: deltaLine.getEndTimeStamp()
			};
		}
	};

	GanttDragDropExtension.prototype._getDraggedShapeDates = function() {
		var oGanttChart = this.getGantt(), oSelection = oGanttChart.getSelection();
		var aSelectedDraggableShapeUid = oSelection.allSelectedDraggableUid();

		var oDragShapeDates = {};
		aSelectedDraggableShapeUid.forEach(function(sUid) {
			var oShapeData = oSelection.getSelectedShapeDataByUid(sUid), updatedShapeTime;
			if (!oShapeData.time || !oShapeData.endTime) {
				updatedShapeTime = oGanttChart.setTimeForGroupShape(GanttUtils.getShapesWithUid(oGanttChart.getId(), [sUid])[0]);
			}
			oDragShapeDates[sUid] = {
				time: oShapeData.time || updatedShapeTime && updatedShapeTime.getTime(),
				endTime: oShapeData.endTime || updatedShapeTime && updatedShapeTime.getEndTime()
			};
		});

		return oDragShapeDates;
	};

	/**
	 * +---------------------------------+
	 * |               / \               |
	 * |<    delta      |                |
	 * +----------------------------------+
	 *
	 * @param {*} iDroppedCursorX Dropped SVG point X
	 * @param {*} oAxisTime AxisTime
	 */
	GanttDragDropExtension.prototype.getDroppedShapeStartTime = function(iDroppedCursorX, oAxisTime, oCursorDate) {
		if (this.getGantt().getGhostAlignment() === GhostAlignment.None) {
			var iShapeX = this.mDragPoint.shapeX,
				iShapeWidth = this.mDragPoint.shapeWidth,
				iStartMouseX = this.mDragPoint.cursorX;
			var bRtl = GanttChartConfigurationUtils.getRTL();
			// cursor postion minus the delta
			var iNewShapeStartTime = bRtl ? (iDroppedCursorX + iShapeWidth - (iStartMouseX - iShapeX)) : (iDroppedCursorX - (iStartMouseX - iShapeX));
			var sNewShapeStartTime = oAxisTime.viewToTime(iNewShapeStartTime),
				oNewDateTime = Format.abapTimestampToDate(sNewShapeStartTime);
			return oNewDateTime;
		}

		return oCursorDate;
	};

	GanttDragDropExtension.prototype.isValidDropZone = function(oEvent) {
		return jQuery(oEvent.target).closest("svg.sapGanttChartSvg").length === 1;
	};

	GanttDragDropExtension.prototype.isValidDropZoneForLines = function(oEvent) {
		return (jQuery(oEvent.target).closest("svg.sapGanttChartHeaderSvg").length === 1 ||
				jQuery(oEvent.target).closest("svg.sapGanttChartSvg").length === 1);
	};


	GanttDragDropExtension.prototype._hideScrollBarOnBody = function(bHide) {
		jQuery(document.body).toggleClass("sapGanttDraggingOverflow", bHide);
	};

	GanttDragDropExtension.prototype.onKeydown = function(oEvent) {
		if (this.skipEvent(oEvent)) { return; }

		if (oEvent.keyCode === KeyCodes.ESCAPE) {
			this.stopDragging(oEvent);

			// trigger cancel event
			this.getGantt()._triggerCancelShapeDrop();

			// set everything on initial state
			this._initDragStates();
		}
	};

	GanttDragDropExtension.prototype.stopDragging = function(oEvent) {
		// enable text selection again
		this._enableTextSelection();

		// avoid shape selection
		this._avoidShapeSelectionAfterDragging();

		// remove ghost image regardless drop event fired or not
		this.removeGhost();


		// update mouse cursor to default again
		this.updateCursorStyle("default");

		// update mouse cursor to default on header
		this.updateHeaderCursorStyle("default");

		this._hideScrollBarOnBody(false);

		// stop auto scroll
		this._stopAutoScroll();

		DragDropHelper.removeDragDropEventListeners(this.getGantt());
	};

	GanttDragDropExtension.prototype._avoidShapeSelectionAfterDragging = function() {
		if (this.bDragging && this.oMouseDownTarget) {
			var oDraggedShape = this.getShapeElementByTarget(this.oMouseDownTarget);
			window.setTimeout(function() {
				if (oDraggedShape) {
					window.clearTimeout(oDraggedShape.iSingleClickTimer);
				}
			}, 100, this);
		}
	};

	GanttDragDropExtension.prototype.isEventTargetDraggable = function(oEvent) {
		var oShapeElement = this.getShapeElementByTarget(oEvent.target);
		if (oShapeElement) {
			return oShapeElement.getDraggable() && (oShapeElement.getSelected() || !this.getGantt().getEnableSelectAndDrag());
		}
		return false;
	};

	GanttDragDropExtension.prototype.getShapeElementByTarget = function(target) {
		return jQuery(this.getDraggableDOMElement(target)).control(0, true);
	};

	GanttDragDropExtension.prototype.getGanttChartByTarget = function(target) {
		return jQuery(target).closest("svg.sapGanttChartSvg").control(0, true);
	};

	GanttDragDropExtension.prototype.isEventTargetAdhocLine = function (oEvent) {
		return (jQuery(oEvent.target).control(0, true) &&
				jQuery(oEvent.target).control(0, true).sParentAggregationName === '_marker');
	};

	GanttDragDropExtension.prototype.isEventTargetDeltaLine = function (oEvent) {
		return (jQuery(oEvent.target).control(0, true) &&
				jQuery(oEvent.target).control(0, true).sParentAggregationName === '_headerDeltaArea');
	};

	GanttDragDropExtension.prototype.isAdhocLineDraggable = function (oEvent) {
		var oAdhocLineElement = jQuery(oEvent.target).control(0, true).getParent();
		return oAdhocLineElement.getDraggable() && oAdhocLineElement._getSelected();
	};

	GanttDragDropExtension.prototype.isDeltaLineDraggable = function (oEvent) {
		var oDeltaLineElement = jQuery(oEvent.target).control(0, true).getParent();
		return (oDeltaLineElement.getDraggable() && oDeltaLineElement._getIsSelected());
	};

	GanttDragDropExtension.prototype.getDraggableDOMElement = function(target) {
		return jQuery(target).closest("[" + GanttUtils.SHAPE_ID_DATASET_KEY + "]").get(0);
	};

	GanttDragDropExtension.prototype.isExceedDraggingThreshold = function(oPoint) {
		return Math.abs(oPoint.x - this.mDragPoint.cursorX) > I_DRAG_THRESHOLD_DISTANCE
			|| Math.abs(oPoint.y - this.mDragPoint.cursorY) > I_DRAG_THRESHOLD_DISTANCE;
	};

	GanttDragDropExtension.prototype.onDragging = function(oEvent) {
		if (this.dragGhost) {
			this.isSnapping = false;
			var oPointerExtension = this.getGantt()._getPointerExtension();
			if (oPointerExtension.isPointerInGanttChart() === true && oPointerExtension.isPointerInCorrectRow() === true) {
				this.updateCursorStyle("move");
			} else {
				this.updateCursorStyle("not-allowed", "none");
				this.updateHeaderCursorStyle("not-allowed", "none");
				if (oPointerExtension.isPointerInGanttChart() !== true){
					this._stopAutoScroll();
				}
			}
			this.showGhost(oEvent);
			this._disableTextSelection();
			if (this.getGantt().getSnapMode() !== SnapMode.None) {
				this.executeSnappingEffect(oEvent);
			}
		}
	};

	GanttDragDropExtension.prototype.executeSnappingEffect = function(oEvent) {
		if (this.snapTimer) {
				window.clearTimeout(this.snapTimer);
				this.snapTimer = null;
		}
		this.snapTimer = window.setTimeout(function() {
				this.showGhost(oEvent, true);
			}.bind(this),100);
	};

	GanttDragDropExtension.prototype._stopAutoScroll = function() {
		var oPointerExtension = this.getGantt()._getPointerExtension();
		oPointerExtension._bAutoScroll = false;
	};

	GanttDragDropExtension.prototype.isDragging = function() {
		return this.bDragging;
	};

	GanttDragDropExtension.prototype.isAdhocLineDragging = function () {
		return this.adhocLineDragStart;
	};

	GanttDragDropExtension.prototype.isDeltaLineDragging = function () {
		return this.deltaLineDragStart;
	};

	GanttDragDropExtension.prototype.skipEvent = function(oEvent) {
		return this.bElementDraggable === false &&
			   this.oAdhocLineElmDraggable === false &&
			   this.oDeltaLineElmDraggable === false;
	};


	/// =======================================================================
	//  Create/Update/Remove Ghost when dragging shapes
	//  Some places need improvement
	/// =======================================================================
	/**
	 * @protected
	 */
	GanttDragDropExtension.prototype.showGhost = function(oEvent, isSnapping) {
		var sAlignment = this.getGantt().getGhostAlignment();
		var oGhostWrapperDom = document.getElementById("sapGanttDragGhostWrapper");
		var mOffset = (this.adhocLineDragStart || this.deltaLineDragStart) ?
						this.calcGhostAligmentForLines(oEvent,sAlignment) :
						this.calcGhostOffsetByAlignment(oEvent, sAlignment, isSnapping);
		if (this.adhocLineDragStart || this.deltaLineDragStart) {
			var timeLabel = GanttUtils.getTimeLabel(oEvent, this.getGantt().getAxisTime(),
								this.getGantt().getLocale(), this.getDomRefs().headerSvg);
			document.getElementById("sapGanttDragText").innerText = timeLabel;
		}
		oGhostWrapperDom.style.left = mOffset.left;
		oGhostWrapperDom.style.top = mOffset.top;
		if (!this._bGhostsPositioned) {
			oGhostWrapperDom.classList.remove("sapGanttDragElementHidden");
		}
	};


	GanttDragDropExtension.prototype.calcGhostAligmentForLines = function(oEvent,sAlignment) {
		var bRtl = GanttChartConfigurationUtils.getRTL();
		var iCurrentPageX = CoordinateUtils.xPosOfEvent(oEvent);
		if (this.adhocLineDragStart) {
			iCurrentPageX -= (this.mDragPoint.shapeWidth / 2);
		}
		if (this.deltaLineDragStart) {
			var iShapeWidth = this.mDragPoint.shapeWidth,
			iShapeX = this.mDragPoint.shapeX,
			iStartMouseX = this.mDragPoint.cursorX;

			if (sAlignment === GhostAlignment.Start) {
				iCurrentPageX = bRtl ? (iCurrentPageX - iShapeWidth) : iCurrentPageX;
			} else if (sAlignment === GhostAlignment.None) {
				// mouse pageX push the delta from the shape start point and dragged position
				iCurrentPageX = iCurrentPageX + (iShapeX - iStartMouseX);
			} else if (sAlignment === GhostAlignment.End) {
				iCurrentPageX = bRtl ? iCurrentPageX : (iCurrentPageX - iShapeWidth);
			}
		}
		var oScreenPoint = CoordinateUtils.getSvgScreenPoint(this.getDomRefs().headerSvg, {
			pageX: this.mDragPoint.cursorX,
			clientX: this.mDragPoint.cursorX,
			pageY: this.mDragPoint.cursorY,
			clientY: this.mDragPoint.cursorY
		});
		return {
			left: iCurrentPageX + "px",
			top: oScreenPoint.y + "px"
		};
	};

	GanttDragDropExtension.prototype.calcGhostOffsetByAlignment = function(oEvent, sAlignment, isSnapped) {
		var bRtl = GanttChartConfigurationUtils.getRTL();

		var iShapeWidth = this.mDragPoint.shapeWidth,
			iShapeX = this.mDragPoint.shapeX + this.mDragPoint.shapeBias.x,
			iStartMouseX = this.mDragPoint.cursorX;

		var iFinalCursorX;
		var fExtraSpace = document.getElementById("sapGanttDragGhostWrapper").offsetWidth - document.getElementsByClassName("sapGanttDragGhostImg")[0].offsetWidth;

		var iCurrentPageX = CoordinateUtils.xPosOfEvent(oEvent);

		if (this.getGantt().getDragOrientation() === DragOrientation.Vertical) {
			var oScreenPoint1 = CoordinateUtils.getSvgScreenPoint(this.getDomRefs().ganttSvg, {
				pageX: this.mDragPoint.shapeX,
				clientX: this.mDragPoint.shapeX,
				pageY: this.mDragPoint.shapeY,
				clientY: this.mDragPoint.shapeY
			});
			iFinalCursorX = oScreenPoint1.x + this.mDragPoint.shapeBias.x;
		} else if (sAlignment === GhostAlignment.Start) {
				iFinalCursorX = bRtl ? (iCurrentPageX - iShapeWidth) : iCurrentPageX;
			} else if (sAlignment === GhostAlignment.None) {
				// mouse pageX push the delta from the shape start point and dragged position
				// Actually doesn't need to calculate everything, it's alway the same
				iFinalCursorX = iCurrentPageX + (iShapeX - iStartMouseX);
			} else if (sAlignment === GhostAlignment.End) {
				iFinalCursorX = bRtl ? iCurrentPageX : (iCurrentPageX - iShapeWidth);
			}

		// minus 2px to make the cursor a little bit lower on the shape
		var sTop = (CoordinateUtils.getEventPosition(oEvent).pageY - 2);
		if (this.getGantt().getDragOrientation() === DragOrientation.Horizontal) {
			var oScreenPoint = CoordinateUtils.getSvgScreenPoint(this.getDomRefs().ganttSvg, {
				pageX: this.mDragPoint.shapeX,
				clientX: this.mDragPoint.shapeX,
				pageY: this.mDragPoint.shapeY,
				clientY: this.mDragPoint.shapeY
			});
			sTop = oScreenPoint.y + this.mDragPoint.shapeBias.y;
		}
		if (isSnapped) {
			this._generateSnapvalue(oEvent, iShapeWidth);
			iFinalCursorX = iFinalCursorX - this.snapVal;
		}
		if (bRtl && this.bMultipleGhosts) {
			iFinalCursorX = iFinalCursorX - fExtraSpace;
		}
		return {
			left: iFinalCursorX + "px",
			top: sTop + "px"
		};
	};

	/**
	 * calculating the start/end position of shape based on Drag alingment
	 * @param {object} mpoints
	 * @param {string} sAlignment
	 * @returns {object}
	 * @private
	 */
	GanttDragDropExtension.prototype._getSnapOffsetByAligment = function(mpoints, sAlignment) {
		var snapOffset = {};
		var iShapeWidth = this.mDragPoint.shapeWidth;
		var isRtl = GanttChartConfigurationUtils.getRTL();
		if (sAlignment === GhostAlignment.Start) {
			snapOffset.xPosStart = mpoints.x;
			snapOffset.xPosEnd = isRtl ? (mpoints.x - iShapeWidth) : (mpoints.x + iShapeWidth);
		} else if (sAlignment === GhostAlignment.End) {
			snapOffset.xPosStart = isRtl ? (mpoints.x + iShapeWidth) : (mpoints.x - iShapeWidth);
			snapOffset.xPosEnd =  mpoints.x;
		} else if (sAlignment === GhostAlignment.None) {
			snapOffset.xPosStart = mpoints.x - (this.mDragPoint.cursorX - this.mDragPoint.shapeX - this.mDragPoint.shapeBias.x);
			snapOffset.xPosEnd = snapOffset.xPosStart + iShapeWidth;
		}
		return snapOffset;
	};

	/**
	 * Calculate Snap By Time
	 * @param mins current Cursor Minutes
	 * @param snapMin mins to Snap by.
	 * @param time current cursorTime
	 * @private
	 */
	GanttDragDropExtension.prototype._getSnappedTime = function(time, snapMin, date, ToMiliSec) {
		var snappedTime, timeDiff;
		var mod = time % snapMin;
		if (mod > (snapMin / 2)) {
			timeDiff = snapMin - mod;
			snappedTime = new Date(date.getTime() + (timeDiff * ToMiliSec));
		} else {
			timeDiff = mod;
			snappedTime = new Date(date.getTime() - (timeDiff * ToMiliSec));
		}
		return snappedTime;
	};

	/**
	 * calculating closed value to snap.
	 * @param leftDiff
	 * @param rightDiff
	 * @param mpoints
	 * @private
	 */
	GanttDragDropExtension.prototype._computeSnapping = function (leftDiff, rightDiff, mpoints) {
		var oGantt = this.getGantt();
		var isRtl = GanttChartConfigurationUtils.getRTL();
		var sAlignment = this.getGantt().getGhostAlignment();
		var iShapeWidth = this.mDragPoint.shapeWidth;
		var currentDiff,
			snapPoint;
		if (oGantt.getSnapMode() === SnapMode.Left) {
			currentDiff = isRtl ? rightDiff - 1 : leftDiff - 1;
			snapPoint = isRtl ? (mpoints.x - currentDiff - iShapeWidth) : (mpoints.x - currentDiff);
		} else if (oGantt.getSnapMode() === SnapMode.Right) {
			currentDiff = isRtl ? leftDiff + 1 : rightDiff + 1;
			snapPoint = isRtl ? (mpoints.x - currentDiff) : (mpoints.x - currentDiff + iShapeWidth);
		} else if (Math.abs(leftDiff) < Math.abs(rightDiff)) {
				currentDiff = isRtl ? leftDiff - 1 : leftDiff - 1;
				snapPoint = isRtl ? (mpoints.x - currentDiff) : (mpoints.x - currentDiff);
			} else {
				currentDiff = isRtl ? rightDiff - 1 : rightDiff + 1;
				snapPoint = isRtl ? (mpoints.x - currentDiff - iShapeWidth) : (mpoints.x - currentDiff + iShapeWidth);
			}
		if (Math.abs(currentDiff) < Math.abs(this.snapVal)) {
			this.snapVal = currentDiff;
			if (sAlignment === GhostAlignment.Start) {
				this.cursorLineSnapPoint = snapPoint;
			} else if (sAlignment === GhostAlignment.End) {
				this.cursorLineSnapPoint = isRtl ? (snapPoint + iShapeWidth) : (snapPoint - iShapeWidth);
			} else if (sAlignment === GhostAlignment.None) {
				this.cursorLineSnapPoint = isRtl ? (snapPoint - this.mDragPoint.cursorX) : (snapPoint - (this.mDragPoint.cursorX - this.mDragPoint.shapeX));
			}
		}
	};
	/**
	 * calculate Snap by Given time interval
	 * @param snapOffset
	 * @param mpoints
	 * @param currentTimeIntervalKey
	 * @param snapTimeInterval
	 * @private
	 */
	GanttDragDropExtension.prototype._computeSnapByTime = function(snapOffset, mpoints, currentTimeIntervalKey, snapTimeInterval) {
		var isRtl = GanttChartConfigurationUtils.getRTL();
		var oGantt = this.getGantt();
		var oAxisTime = oGantt.getAxisTime();
		var snapTime = (snapTimeInterval[currentTimeIntervalKey].timeInterval) / 60;
		var ToMiliSec = 60000;
		var aStartDate = oAxisTime.viewToTime(snapOffset.xPosStart);
		var aEndDate = oAxisTime.viewToTime(snapOffset.xPosEnd);
		var startTime = aStartDate.getMinutes();
		var endTime = aEndDate.getMinutes();
		if (snapTime > 60) {
			startTime = aStartDate.getHours();
			endTime = aEndDate.getHours();
			snapTime = snapTime / 60;
			if (startTime % snapTime === 0 || endTime % snapTime === 0) {
				startTime = aStartDate.getMinutes() % 30;
				endTime = aEndDate.getMinutes() % 30;
				aStartDate.setMinutes(startTime);
				aEndDate.setMinutes(endTime);
				snapTime = 60;
			} else {
				aStartDate.setMinutes(0);
				aEndDate.setMinutes(0);
				ToMiliSec = 3600000;
			}
		} else if (snapTime < 1) {
			startTime = aStartDate.getSeconds();
			endTime = aEndDate.getSeconds();
			ToMiliSec = 1000;
			snapTime = snapTime * 60;
		} else {
			aStartDate.setSeconds(0);
			aEndDate.setSeconds(0);
		}

		if (startTime % snapTime !== 0 || endTime % snapTime !== 0) {
			var leftSnapTime = isRtl ? this._getSnappedTime(endTime, snapTime, aEndDate, ToMiliSec) :
									this._getSnappedTime(startTime, snapTime, aStartDate, ToMiliSec);
			var rightnapTime = isRtl ? this._getSnappedTime(startTime, snapTime, aStartDate, ToMiliSec) :
									this._getSnappedTime(endTime, snapTime, aEndDate, ToMiliSec);
			var leftSnappedPos = oAxisTime.timeToView(leftSnapTime);
			var rightSnapPos = oAxisTime.timeToView(rightnapTime);
			if (isRtl) {
				this._computeSnapping(snapOffset.xPosEnd - leftSnappedPos - 1, snapOffset.xPosStart - rightSnapPos + 1, mpoints);
			} else {
				this._computeSnapping(snapOffset.xPosStart - leftSnappedPos + 1, snapOffset.xPosEnd - rightSnapPos - 1, mpoints);
			}
			mpoints.x = mpoints.x - this.snapVal;
			oGantt._getPointerExtension()._toggleCursorLine(true,mpoints);
			this.isSnapping = true;
		} else {
			this.snapVal = 0;
		}
	};

	/**
	 * generating snap value based on closed visual element
	 * i.e. adhocline, deltaline, non working time, dividerline
	 * and shapes or snap by Time.
	 * @param oEvent
	 * @param iShapeWidth
	 * @returns void
	 * @private
	 */
	GanttDragDropExtension.prototype._generateSnapvalue = function(oEvent) {
		var isRtl = GanttChartConfigurationUtils.getRTL();
		var sAlignment = this.getGantt().getGhostAlignment();
		var oSvg = this.getDomRefs().ganttSvg;
		var mpoints = CoordinateUtils.getEventSVGPoint(oSvg, oEvent);
		var snapOffset = this._getSnapOffsetByAligment(mpoints, sAlignment);
		var xPosStart = snapOffset.xPosStart;
		var xPosEnd = snapOffset.xPosEnd;
		var yPos = mpoints.y;
		var oGantt = this.getGantt();
		var GanttPointerExtension = oGantt._getPointerExtension();
		var oAxisTime = oGantt.getAxisTime();
		var currentTimeIntervalKey;
		var oTimeLineOption = oAxisTime.getZoomStrategy().getTimeLineOption(),
			oTimeLineOptions = oAxisTime.getZoomStrategy().getTimeLineOptions();
		var sAttr;
		var found = false;

		var keys = Object.keys(oTimeLineOptions);
		var currentIndex = 0;

		while (!found && currentIndex < keys.length) {
			sAttr = keys[currentIndex];
			if (oTimeLineOptions[sAttr] === oTimeLineOption) {
				currentTimeIntervalKey = sAttr;
				found = true;
			}
			currentIndex++;
		}



		var snapTimeInterval = oGantt.getSnapTimeInterval();
		var oZoomStrategy = oAxisTime.getZoomStrategy();
		this.snapVal = Number.MAX_SAFE_INTEGER / 2;
		//Snap By Time
		if (snapTimeInterval[currentTimeIntervalKey] && snapTimeInterval[currentTimeIntervalKey].timeInterval) {
			this._computeSnapByTime(snapOffset, mpoints, currentTimeIntervalKey, snapTimeInterval);
			return;
		}

		//get all ticks value
		var iRenderedWidth = RenderUtils.getGanttRenderWidth(oGantt);
		var aTickTimeIntervals = oAxisTime.getTickTimeIntervalLabel(oZoomStrategy.getTimeLineOption(), null, [0, iRenderedWidth]);
		// the second item have all the tick time info
		var aTicks = aTickTimeIntervals[1];
		aTicks.forEach(function(aTick) {
			this._computeSnapping(xPosStart - aTick.value, xPosEnd - aTick.value, mpoints);
		}.bind(this));

		//Get all visible DeltaLines elements
		var visibleDeltaLines = GanttUtils.getVisibleElements(oSvg, ".sapGanttChartDeltaLine", ".baseShapeSelection");
		visibleDeltaLines.forEach(function(deltaline) {
			var x = deltaline.getBBox().x;
			this._computeSnapping(xPosStart - x, xPosEnd - x, mpoints);
		}.bind(this));
		//Get all visible SimpleAdhocLines elements
		var visibleAdhocLines = GanttUtils.getVisibleElements(oSvg, ".sapGanttChartAdhocLine", ".baseShapeSelection");
		visibleAdhocLines.forEach(function(adhocline) {
			var x = adhocline.getBBox().x;
			this._computeSnapping(xPosStart - x, xPosEnd - x, mpoints);
		}.bind(this));

		//get All visible shape elements
		var visibleShapes = GanttUtils.getVisibleElements(oSvg, ".sapGanttChartShapes", ".baseShapeSelection");
		visibleShapes.forEach(function(oBaseShape ) {

			var iShapeX1 = oBaseShape.getBBox().x,
				iShapeX2 = iShapeX1 + oBaseShape.getBBox().width,
				iShapeY1 = oBaseShape.getBBox().y,
				iShapeY2 = iShapeY1 + oBaseShape.getBBox().height;

				var yPos2 = yPos + oBaseShape.getBBox().height;

				if ((yPos > iShapeY1 && yPos < iShapeY2) ||
					(yPos2 > iShapeY1 && yPos2 < iShapeY2)) {
					var leftDiff =  isRtl ? (xPosStart - iShapeX1) : (xPosStart - iShapeX2);
					var rightDiff = isRtl ? (xPosEnd - iShapeX2) : (xPosEnd - iShapeX1);
					this._computeSnapping(leftDiff, rightDiff, mpoints);
				}
		}.bind(this));

		//get all visible nonworkingtime rects
		var visibleNonWorkingTime = GanttUtils.getVisibleElements(oSvg, ".calendarPattern", "rect");
		visibleNonWorkingTime.forEach(function(timeRect) {
			var rectX1 = timeRect.getBBox().x,
				rectX2 = rectX1 + timeRect.getBBox().width;
			var leftDiff =  isRtl ? (xPosStart - rectX1) : (xPosStart - rectX2);
			var rightDiff = isRtl ? (xPosEnd - rectX2) : (xPosEnd - rectX1);
			this._computeSnapping(leftDiff, rightDiff, mpoints);
		}.bind(this));

		mpoints.x = this.cursorLineSnapPoint;
		GanttPointerExtension._toggleCursorLine(true,mpoints);
		this.isSnapping = true;
	};

	GanttDragDropExtension.prototype.removeGhost = function() {
		this.dragGhost = null;
		var oGhostWrapperDom = document.getElementById("sapGanttDragGhostWrapper");
		if (oGhostWrapperDom) {
			oGhostWrapperDom.parentNode.removeChild(oGhostWrapperDom);
		}
	};

	/**
	 * @protected
	 */
	GanttDragDropExtension.prototype.createDragGhost = function(oLastNode, bTargetShape) {
		var oContainer = jQuery("<div id='sapGanttDragGhostWrapper' class='sapGanttDragElementHidden'></div>");
		if (!this.bMultipleGhosts || bTargetShape) {
			jQuery(document.body).append(oContainer);
		}
		var canvas = document.createElement("canvas");
		var bbox = oLastNode.getBBox();

		canvas.width = this.normalizeGhostImageWidth(bbox.width);
		canvas.height = bbox.height;
		if (this.adhocLineDrag) {
			//creating canvas for adhoc line.
			var _line = jQuery(this.oMouseDownTarget).control(0, true).getParent()._getLine();
			var lineNode = document.getElementById(_line.sId);
			var _headerLine = jQuery(this.oMouseDownTarget).control(0, true).getParent()._getHeaderLine();
			var headerLineNode = document.getElementById(_headerLine.sId);
			var _lineBBox = lineNode.getBBox();
			var _headerBBox = headerLineNode.getBBox();
			canvas.height += _lineBBox.height + _headerBBox.height;
		}
		if (this.deltaLineDrag) {
			//creating canvas for delta Line.
			var deltaLine = jQuery(this.oMouseDownTarget).control(0, true).getParent();
			if (deltaLine.getVisibleDeltaStartEndLines()){
				var oStartLine = deltaLine._getStartLine();
				var oEndLine = deltaLine._getEndLine();
				var oHeaderStartLine = deltaLine._getHeaderStartLine();
				var oHeaderEndLine = deltaLine._getHeaderEndLine();
				var oStartLineDom = document.getElementById(oStartLine.sId);
				var oEndLineDom = document.getElementById(oEndLine.sId);
				var oHeaderStartLineDom = document.getElementById(oHeaderStartLine.sId);
				var oHeaderEndLineDom = document.getElementById(oHeaderEndLine.sId);
				var deltaLineElms = {
					headerStartLine : oHeaderStartLineDom,
					startLine : oStartLineDom,
					headerEndLine: oHeaderEndLineDom,
					endLine : oEndLineDom
				};
				var HeaderLineBBox = oHeaderStartLineDom.getBBox();
				var lineBbox = oStartLineDom.getBBox();
				canvas.height += lineBbox.height + HeaderLineBBox.height;
			}
		}

		this.createGhostImage(oLastNode, canvas, headerLineNode, lineNode, deltaLineElms, bTargetShape);
		return oContainer;
	};

	GanttDragDropExtension.prototype.normalizeGhostImageWidth = function (iWidth) {
		return iWidth;
	};

	GanttDragDropExtension.prototype.createGhostImage = function(oLastNode, canvas, _headerLine, _line, deltaLineElms, bTargetShape) {
		var sSvgString = this.serializeClonedSvg(canvas, oLastNode, _headerLine, _line, deltaLineElms);
		var sBase64 = this._b64EncodeUnicode(sSvgString);
		var fullImageUrl = "data:image/svg+xml;base64," + sBase64;
		this.appendGhostImageToWrapper(oLastNode, fullImageUrl, bTargetShape);
	};

	GanttDragDropExtension.prototype._b64EncodeUnicode = function (str) {
		// same as btoa(unescape(encodeURIComponent(sSvgString)))
		// see https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
		// first we use encodeURIComponent to get percent-encoded UTF-8,
		// then we convert the percent encodings into raw bytes which
		// can be fed into btoa.
		return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
			function toSolidBytes(match, p1) {
				return String.fromCharCode('0x' + p1);
		}));
	};

	GanttDragDropExtension.prototype.appendGhostImageToWrapper = function(oLastNode, cropedImg, bTargetShape) {
		var oGhostWrapperDom = document.getElementById("sapGanttDragGhostWrapper");
		var oStyle = this._getDragTextOverlayStyle(oLastNode);
		var sTextDom = bTargetShape ? "" : "<div id='sapGanttDragText' class='sapGanttDragTextOverlay " + oStyle.css + "'>" + "</div>";
		var oShape = Element.getElementById(oLastNode.id);
		var bLabelFlag = !oShape && oLastNode.parentNode && Element.getElementById(oLastNode.parentNode.id) instanceof sap.gantt.simple.BaseGroup;
		var bParentLabelFlag = !oShape && oLastNode.parentNode && oLastNode.parentNode.parentNode && Element.getElementById(oLastNode.parentNode.parentNode.id) instanceof sap.gantt.simple.BaseGroup;
		var bEnableMultipleGhosts = this.getGantt().getEnableMultipleGhosts();
		if (bLabelFlag){
            oShape = Element.getElementById(oLastNode.parentNode.id);
		} else if (bParentLabelFlag){
            oShape = Element.getElementById(oLastNode.parentNode.parentNode.id);
		}
		if (bEnableMultipleGhosts && bTargetShape && this.getGantt().getShowTextOnGhost()) {
			sTextDom = this._getGhostLabel(oShape, oLastNode);
		}
		if (!bEnableMultipleGhosts) {
			var sNumberOfObjects = this.getNumberOfDragObject(oLastNode);
			sTextDom = "<div id='sapGanttDragText' class='sapGanttDragTextOverlay " + oStyle.css + "'>" + sNumberOfObjects + "</div>";
		}

		if (this.bMultipleGhosts){
			var oNode;
			if (bLabelFlag) {
				oNode = oLastNode.parentNode;
			} else if (bParentLabelFlag) {
				oNode = oLastNode.parentNode.parentNode;
			} else {
				oNode = oLastNode;
			}
			this._aShapeNodes.push(oNode);
			this._aGhostImages.push(cropedImg);
			if (!bTargetShape) {
				sTextDom = "";
			}
		}
		var sDragGhostDom = "<div class='sapGanttDragGhost'>" +
			"<img class='sapGanttDragGhostImg' src='" + cropedImg + "'>" + sTextDom +
		"</div>";
		oGhostWrapperDom.insertAdjacentHTML('beforeend', sDragGhostDom);
		if (bEnableMultipleGhosts && bTargetShape && this.getGantt().getShowTextOnGhost() && sTextDom !== "") {
			this._updateGhostLabelStyle();
		}
	};

	GanttDragDropExtension.prototype._getDragTextOverlayStyle = function(oLastNode) {
		var bRtl = GanttChartConfigurationUtils.getRTL();
		var sAlignment = this.getGantt().getGhostAlignment();
		var iShapeWidth = this.mDragPoint.shapeWidth,
			iShapeX = this.mDragPoint.shapeX + this.mDragPoint.shapeBias.x,
			iStartMouseX = this.mDragPoint.cursorX;
		var iLeftCursorPart = iStartMouseX - iShapeX;
		var oContainer = document.getElementById("sapGanttDragGhostWrapper");
		var sCssClass = "";
		if (sAlignment === GhostAlignment.None) {
			if (bRtl) {
				oContainer.style.setProperty('--sapShapeDragTextOverlay-right-val', iShapeWidth - iLeftCursorPart + 'px');
			} else {
				oContainer.style.setProperty('--sapShapeDragTextOverlay-left-val', iLeftCursorPart + 'px');
			}
		} else if (sAlignment === GhostAlignment.End) {
			sCssClass = "sapGanttDragTextOverlayGhostAlignEnd";
		}
		oContainer.style.setProperty('--sapShapeDragTextOverlay-lineHeight', oLastNode.getBBox().height + 'px');
		return {
			css: sCssClass
		};
	};
	GanttDragDropExtension.prototype._updateShapeStyle = function(oNode) {
		var oShape = Element.getElementById(oNode.id);
		if (oShape && oShape.mProperties.hasOwnProperty("styleName")) {
				if (this._oGhostStyleConfigs[oShape.getStyleName()]) {
					this._updateStyle(oNode, this._oGhostStyleConfigs[oShape.getStyleName()]);
				}
		}
	};

	GanttDragDropExtension.prototype._updateStyle = function(oNode, oGhostConfig) {
		if (oGhostConfig.mProperties.hasOwnProperty('visible') && !oGhostConfig.getVisible()) {
			oNode.style.display = 'none';
		} else {
			if (oGhostConfig.mProperties.hasOwnProperty('fill')) {
				oNode.style.fill = oGhostConfig.getFill();
			}
			if (oGhostConfig.mProperties.hasOwnProperty('stroke')) {
				oNode.style.stroke = oGhostConfig.getStroke();
			}
			if (oGhostConfig.mProperties.hasOwnProperty('strokeWidth')) {
				oNode.style.strokeWidth = oGhostConfig.getStrokeWidth();
			}
			if (oGhostConfig.mProperties.hasOwnProperty('strokeDasharray')) {
				oNode.style.strokeDasharray = oGhostConfig.getStrokeDasharray();
			}
		}
	};

	GanttDragDropExtension.prototype._updateGhostShapeStyle = function(oClonedNode) {
		if (oClonedNode.tagName == 'g') {
			Array.from(oClonedNode.getElementsByClassName('baseShapeSelection')).forEach(function(oShapeNode) {
				this._updateShapeStyle(oShapeNode);
			}.bind(this));
		} else {
			this._updateShapeStyle(oClonedNode);
		}
	 };

	GanttDragDropExtension.prototype.serializeClonedSvg = function(canvas, oDragNode, headerNode, lineNode, deltaLineElms) {
		var svgNS = d3.ns.prefix.svg;
		var oFrame = oDragNode.getBBox();
		var bRtl = GanttChartConfigurationUtils.getRTL();

		// create a new SVG DOM element
		var oCopyedSvg = document.createElementNS(svgNS, "svg");

		// the cloned SVG has the exactly the same size as the canvas
		oCopyedSvg.setAttribute("width", canvas.width);
		oCopyedSvg.setAttribute("height", canvas.height);
		var oClonedNode = oDragNode.cloneNode(true);

		if (!this._oGhostStyleConfigs) {
			this._oGhostStyleConfigs = this._getGhostStyleConfig();
		}
		this._updateGhostShapeStyle(oClonedNode);
		oClonedNode.style.transform = "translate(0, 0)";

		// remove origial text node, otherwise the text overlay is hard to read
		if (!this.getGantt().getShowTextOnGhost()) {
			this.removeOriginalTextNode(oClonedNode);
		} else if (bRtl && (oClonedNode.tagName === "g" || oClonedNode.tagName === "text")) {
			this._aOriginalTextX = [];
			this._iCount = 0;
			this._populateTextNodeX(oDragNode);
			this._repositionTextNode(oClonedNode);
		}

		var gWrapper = document.createElementNS(svgNS, "g");
		// move the dragged the shape to the original point of the new SVG
		gWrapper.setAttribute("transform", "translate(" + -(oFrame.x) + ", " + -(oFrame.y) + ")");
		gWrapper.appendChild(oClonedNode);
		if (this.adhocLineDrag) {
			//creating adhoc line ghost image
			var oClonedHeaderNode = headerNode.cloneNode(true);
			var oClonedLineNode = lineNode.cloneNode(true);
			gWrapper.appendChild(oClonedHeaderNode);
			gWrapper.appendChild(oClonedLineNode);
		}
		if (this.deltaLineDrag) {
			//creating delta line ghost image.
			var oDeltaLine = Element.getElementById(this.oMouseDownTarget.id).getParent();
			if (oDeltaLine.getVisibleDeltaStartEndLines()){
				var oClonedHeaderStartLine = deltaLineElms.headerStartLine.cloneNode(true);
				var oClonedStartLine = deltaLineElms.startLine.cloneNode(true);
				var oClonedHeaderEndLine = deltaLineElms.headerEndLine.cloneNode(true);
				var oCLonedEndLine = deltaLineElms.endLine.cloneNode(true);
				gWrapper.appendChild(oClonedHeaderStartLine);
				gWrapper.appendChild(oClonedStartLine);
				gWrapper.appendChild(oClonedHeaderEndLine);
				gWrapper.appendChild(oCLonedEndLine);
			}
		}

		// append defs
		var oSvgDefs = this.getGantt().getSvgDefs();
		if (oSvgDefs) {
			var oClonedSvgDefsNode = jQuery(document.getElementById(oSvgDefs.getId())).get(0).cloneNode(true);
			oCopyedSvg.appendChild(oClonedSvgDefsNode);
		}

		oCopyedSvg.appendChild(gWrapper);
		return new XMLSerializer().serializeToString(oCopyedSvg);
	};

	GanttDragDropExtension.prototype.removeOriginalTextNode = function(oNode) {
		if (oNode.parentNode && oNode.tagName === "text") {
			oNode.parentNode.removeChild(oNode);
		}
		// for IE and Safari, oNode.children is undefined
		var children = oNode.children || oNode.childNodes;
		var aChildren = Array.prototype.slice.call(children);	// HtmlCollection to array
		aChildren.forEach(function(oNode) {
			this.removeOriginalTextNode(oNode);
		}.bind(this));
	};

	GanttDragDropExtension.prototype._repositionTextNode = function(oNode) {
		if (oNode.tagName === "text") {
			oNode.setAttribute("x", this._aOriginalTextX[this._iCount]);
			this._iCount++;
		}
		// for IE and Safari, oNode.children is undefined
		var children = oNode.children || oNode.childNodes;
		var aChildren = Array.prototype.slice.call(children);	// HtmlCollection to array
		aChildren.forEach(function(oNode) {
			this._repositionTextNode(oNode);
		}.bind(this));
	};

	GanttDragDropExtension.prototype._populateTextNodeX = function(oNode) {
		if (oNode.tagName === "text") {
			var fTextX = 0;
			var sTextAnchor = oNode.getAttribute("text-anchor");
			var oFrame = oNode.getBBox();
			if (sTextAnchor === "start") {
				fTextX = oFrame.x;
			} else if (sTextAnchor === "end") {
				fTextX = oFrame.x + oFrame.width;
			} else {
				fTextX = oFrame.x + (oFrame.width / 2);
			}
			this._aOriginalTextX.push(fTextX);
		}
		// for IE and Safari, oNode.children is undefined
		var children = oNode.children || oNode.childNodes;
		var aChildren = Array.prototype.slice.call(children);	// HtmlCollection to array
		aChildren.forEach(function(oNode) {
			this._populateTextNodeX(oNode);
		}.bind(this));
	};

	GanttDragDropExtension.prototype.getNumberOfDragObject =  function(oLastNode) {
		var oSelection = this.getGantt().getSelection();
		var iSelectedDraggableShapes = oSelection.numberOfSelectedDraggableShapes();

		var oRb = Lib.getResourceBundleFor("sap.gantt");
		var sObject = oRb.getText("GNT_DRAGGED_OBJECT");
		var sObjects = oRb.getText("GNT_DRAGGED_OBJECTS");
		var sDescr = iSelectedDraggableShapes > 1 ? sObjects : sObject;
		return iSelectedDraggableShapes + " " + sDescr;
	};

	/**
	 * disables text selection on the document (disabled fro Dnd)
	 * @private
	 */
	GanttDragDropExtension.prototype._disableTextSelection = function () {
		// prevent text selection
		jQuery(document.body).
			attr("unselectable", "on").
			css({
				"-moz-user-select": "none",
				"-webkit-user-select": "none",
				"user-select": "none"
			}).
			bind("selectstart", function(oEvent) {
				oEvent.preventDefault();
				return false;
			});
	};

	/**
	 * enables text selection on the document (disabled fro Dnd)
	 * @private
	 */
	GanttDragDropExtension.prototype._enableTextSelection = function () {
		jQuery(document.body).
			attr("unselectable", "off").
			css({
				"-moz-user-select": "",
				"-webkit-user-select": "",
				"user-select": ""
			}).
			unbind("selectstart");
	};

	GanttDragDropExtension.prototype.isAllowedVerticalOrentationDrag = function() {
		var oGantt = this.getGantt();
		if (oGantt.getDragOrientation() === DragOrientation.Vertical) {
			return oGantt.oSelection.numberOfSelectedDraggableShapes() < 2;
		}

		return true;
	};

	GanttDragDropExtension.prototype.getRowByShape = function(oShape) {
		var oOriginalRow = GanttUtils.getRowInstancefromShape(oShape);
		var oClonedRow = oOriginalRow.clone();
		oClonedRow = this._addBackOriginalGanttRowProperties(oOriginalRow, oClonedRow);
		return oClonedRow;
	};

	GanttDragDropExtension.prototype._addBackOriginalGanttRowProperties = function(oOriginalRow, oClonedRow) {
		oClonedRow.oPropagatedProperties = oOriginalRow._getPropertiesToPropagate();
		oClonedRow.propagateProperties(true);
		oClonedRow.oParent = oOriginalRow.getParent();
		return oClonedRow;
	};

	return GanttDragDropExtension;
});
