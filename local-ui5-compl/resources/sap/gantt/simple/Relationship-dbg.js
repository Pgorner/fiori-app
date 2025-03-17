/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/Device",
	"sap/ui/core/Core",
	"sap/ui/core/IconPool",
	"./GanttUtils",
	"./RenderUtils",
	"./BasePath",
	"sap/ui/core/theming/Parameters",
	"sap/gantt/library",
	"./CoordinateUtils",
	"./BaseShape",
	"sap/gantt/utils/GanttChartConfigurationUtils",
	"sap/ui/core/Element"
], function (
	Device,
	Core,
	IconPool,
	GanttUtils,
	RenderUtils,
	BasePath,
	Parameters,
	library,
	CoordinateUtils,
	BaseShape,
	GanttChartConfigurationUtils,
	Element
) {
	"use strict";

	var CONNECTOR_TYPE = library.simple.connectorType;
	var SHAPE_SIZE_RECT = 6, /* rectangle base size */
		LINE_LENGTH = 20, /* Line length when one shape is invisible */
		PROMPTER_ICON_SIZE = 15, /* Icon size when one shape is invisible */
		RELATION_TYPE = { "FinishToFinish": 0, "FinishToStart": 1, "StartToFinish": 2, "StartToStart": 3 };
	/**
	 * Creates and initializes a Relationship class
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSetting] Initial settings for the new control
	 *
	 * @class
	 * Enables users to visualize the relationship between visiable objects.
	 *
	 * @extends sap.gantt.simple.BasePath
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.Relationship
	 */
	var Relationship = BasePath.extend("sap.gantt.simple.Relationship", /** @lends sap.gantt.simple.Relationship.prototype */ {
		metadata: {
			library: "sap.gantt",
			properties: {
				/**
				 * Defines the <code>Relationship</code> type.
				 */
				type: { type: "sap.gantt.simple.RelationshipType", group: "Appearance" },

				/**
				 * predecessor of the <code>Relationship</code>
				 *
				 * This property specify where the relationship starts, <code>Relationship</code> lookup the shape instance based on the property value
				 */
				predecessor: { type: "string", group: "Data" },

				/**
				 * successor of the <code>Relationship</code>
				 *
				 * This property specify where the relationship ends, <code>Relationship</code> lookup the shape instance by the property value.
				 */
				successor: { type: "string", group: "Data" },

				/**
				 * Defines the stroke color when <code>Relationship</code> is selected
				 */
				selectedStroke: { type: "sap.gantt.ValueSVGPaintServer", defaultValue: "#FF0000" },

				/**
				 * Defines the stroke width when <code>Relationship</code> is selected
				 */
				selectedStrokeWidth: { type: "sap.gantt.SVGLength", defaultValue: 2 },

				/**
				* Flag to change shape from L-shaped lines to S-shaped lines for finish-to-start relationship type
				*/
				lShapeForTypeFS: { type: "boolean", defaultValue: true },

				/**
				* Flag to change shape from L-shaped lines to S-shaped lines for start-to-finish relationship type
				*/
				lShapeForTypeSF: { type: "boolean", defaultValue: true },
				/**
				* Defines the shape at the start of a relationship
				*/
				shapeTypeStart: { type: "sap.gantt.simple.connectorType", defaultValue: CONNECTOR_TYPE.None },

				/**
				* Defines the shape at the end of a relationship
				*/
				shapeTypeEnd: { type: "sap.gantt.simple.connectorType", defaultValue: CONNECTOR_TYPE.Arrow },
				/**
				* Defines the color of the shape at the start of a relationship
				*/
				startShapeColor: { type: "sap.gantt.ValueSVGPaintServer", group: "Appearance" },
				/**
				* Defines the color of the shape at the end of a relationship
				*/
				endShapeColor: { type: "sap.gantt.ValueSVGPaintServer", group: "Appearance" },
				/**
				* Defines the color of the shape at the start of the selected relationship
				*/
				selectedStartShapeColor: { type: "sap.gantt.ValueSVGPaintServer", group: "Appearance" },
				/**
				* Defines the color of the shape at the end of the selected relationship
				*/
				selectedEndShapeColor: { type: "sap.gantt.ValueSVGPaintServer", group: "Appearance" },
				/**
				 * Flag to enable or disable rounded corners on relationship
				 */
				enableCurvedEdge: {type: "boolean", defaultValue: false},
				/**
				 * Flag to have relationship pass over divider line
				 * @since 1.95
				 */
				relationshipOverDivider: {type: "boolean", defaultValue: false},
				/**
				 * _lMarker determines up/down relation of L type .
				 * @private
				 */
				_lMarker: { type: "string", visibility: "hidden"}
			}
		},
		renderer: {
			apiVersion: 2    // enable in-place DOM patching
		}
	});

	Relationship.prototype.applySettings = function (mSettings) {
		mSettings = mSettings || {};
		BasePath.prototype.applySettings.apply(this, arguments);
	};

	/**
	 * Returns the orientation of L connector.
	 * @returns {string} up or down.
	 * @private
	 */
	Relationship.prototype._getLMarker = function () {
		return this.getProperty("_lMarker");
	};

	Relationship.prototype.onclick = function (oEvent) {
		if (this.getGanttChartBase().getIsConnectorDetailsVisible()){
			var fetchConnectorData = function () {
				var mCursor = CoordinateUtils.getLatestCursorPosition();
				var iPageX = mCursor.pageX,
					iPageY = mCursor.pageY;
				var aElements = document.elementsFromPoint(iPageX, iPageY),
					aConnectorList = [],
					relationshipIdList = [];
				for (var i = 0; i < aElements.length; i++) {
					var relationshipNode = aElements[i].parentNode;
					if (aElements[i].tagName === "path" && Element.getElementById(relationshipNode.id).isA("sap.gantt.simple.Relationship") && relationshipIdList.indexOf(relationshipNode.id) === -1 ) {
						relationshipIdList.push(relationshipNode.id);
						var relInst = Element.getElementById(relationshipNode.id);
						aConnectorList.push(relInst);
					}
				}
				if (aConnectorList.length > 0) {
					this.getGanttChartBase().fireShapeConnectorList({
						pageX: iPageX,
						pageY: iPageY,
						connectorList: aConnectorList
					});
				}
			};
			window.setTimeout(fetchConnectorData.bind(this), 300);
		} else {
			BaseShape.prototype.onclick.call(this,oEvent);
		}

	};

	Relationship.prototype.renderElement = function (oRm, oElement, sGanttId) {
		this.oGantt = Element.getElementById(sGanttId);
		var vType = oElement.getProcessedType();
        if ((!oElement.mRelatedShapes && !oElement.mAnchors && !GanttUtils.relationexist(this.oGantt,oElement)) || (this.oGantt.getEnablePseudoShapes() && this.mRelatedShapes.predecessor === this.mRelatedShapes.successor)){
			return;
		}
		this.mRelatedShapes = oElement.mRelatedShapes;
		if (this.mRelatedShapes.predecessor){
			var predDomRef = this.mRelatedShapes.predecessor.getParentRowSettings().getParent().getDomRef();
			var predRowHeight = predDomRef.clientHeight;
			this.predYTop = predDomRef.offsetTop;
			this.predYBottom = this.predYTop + predRowHeight;
		}
       if (this.mRelatedShapes.successor){
		    var sucDomRef =  this.mRelatedShapes.successor.getParentRowSettings().getParent().getDomRef();
			var sucRowHeight = sucDomRef.clientHeight;
			this.sucYTop = sucDomRef.offsetTop;
			this.sucYBottom = this.sucYTop + sucRowHeight;
	   }

	   if (this.mRelatedShapes.predecessor && this.mRelatedShapes.successor && this.predYTop == this.sucYTop && this.predYBottom == this.sucYBottom){
		var rowUid = this.mRelatedShapes.successor.getParentRowSettings().getParent().getAggregation("_settings").getRowUid();
		var bExpanded = this.oGantt._oExpandModel.isRowExpanded(rowUid);
		var bshowParent = this.oGantt.getShowParentRowOnExpand()  && !this.oGantt.getUseParentShapeOnExpand();

		var pLevel = this.mRelatedShapes.predecessor._level;
		var sLevel = this.mRelatedShapes.successor._level;
		if (bExpanded && pLevel && sLevel){
           var parentRowHeight = this.oGantt._oExpandModel.getBaseRowHeight();
		   var levelHeight = this.oGantt.getExpandedRowHeight() ? this.oGantt.getExpandedRowHeight() : parentRowHeight;
		   var predYTop =  bshowParent ? this.predYTop + parentRowHeight + (pLevel - 1) * levelHeight : this.predYTop + (pLevel - 1) * levelHeight;
		   var predYBottom = bshowParent ? this.predYTop + parentRowHeight + (pLevel) * levelHeight : this.predYTop + (pLevel) * levelHeight;
		   var sucYTop = bshowParent ? this.sucYTop + parentRowHeight + (sLevel - 1) * levelHeight : this.sucYTop + (sLevel - 1) * levelHeight;
		   var sucYBottom = bshowParent ? this.sucYTop + parentRowHeight + (sLevel) * levelHeight : this.sucYTop + (sLevel) * levelHeight;
		   this.predYTop =  predYTop;  this.predYBottom = predYBottom;
		   this.sucYTop =  sucYTop;   this.sucYBottom = sucYBottom;
		}
	  }

	   switch (this.oGantt.getRelationshipShapeSize()){
		case library.simple.relationshipShapeSize.Small:
			this.SHAPE_SIZE = 6;
			break;
		case library.simple.relationshipShapeSize.Large:
			this.SHAPE_SIZE = 10;
			break;
		default:
			this.SHAPE_SIZE = 8;
			break;
		}
		this.calcLinePathD(oElement.mAnchors,vType);

		this.renderRelationship(oRm, oElement.mAnchors, vType, sGanttId);
	};

	Relationship.prototype.getRlsAnchors = function (vType, mRelatedShapes) {
		var oPredecessor, oSuccessor, oPrompter;

		var mAnchors = this.getShapeAnchors(mRelatedShapes);
		if (mRelatedShapes.predecessor && mRelatedShapes.successor) {
			// both predecessor and successor shapes are available and visible
			if (vType === RELATION_TYPE.FinishToFinish) {
				oPredecessor = mAnchors.predecessor.tail;
				oSuccessor = mAnchors.successor.tail;
			} else if (vType === RELATION_TYPE.FinishToStart) {
				oPredecessor = mAnchors.predecessor.tail;
				oSuccessor = mAnchors.successor.head;
			} else if (vType === RELATION_TYPE.StartToFinish) {
				oPredecessor = mAnchors.predecessor.head;
				oSuccessor = mAnchors.successor.tail;
			} else if (vType === RELATION_TYPE.StartToStart) {
				oPredecessor = mAnchors.predecessor.head;
				oSuccessor = mAnchors.successor.head;
			}
		} else if (mRelatedShapes.predecessor && !mRelatedShapes.successor) {
			// predecessor shape is visible but successor is missing
			if (vType === RELATION_TYPE.FinishToFinish || vType === RELATION_TYPE.FinishToStart) {
				oPredecessor = mAnchors.predecessor.tail;
				oSuccessor = {
					x: oPredecessor.x + LINE_LENGTH,
					y: oPredecessor.y
				};
				oPrompter = {
					x: oSuccessor.x,
					y: oSuccessor.y + PROMPTER_ICON_SIZE / 2
				};
			} else if (vType === RELATION_TYPE.StartToFinish || vType === RELATION_TYPE.StartToStart) {
				oPredecessor = mAnchors.predecessor.head;
				oSuccessor = {
					x: oPredecessor.x - LINE_LENGTH,
					y: oPredecessor.y
				};
				oPrompter = {
					x: oSuccessor.x - PROMPTER_ICON_SIZE,
					y: oSuccessor.y + PROMPTER_ICON_SIZE / 2
				};
			}
		} else if (!mRelatedShapes.predecessor && mRelatedShapes.successor) {
			if (vType === RELATION_TYPE.FinishToFinish || vType === RELATION_TYPE.StartToFinish) {
				oSuccessor = mAnchors.successor.tail;
				oPredecessor = {
					x: oSuccessor.x + LINE_LENGTH,
					y: oSuccessor.y
				};
				oPrompter = {
					x: oPredecessor.x,
					y: oPredecessor.y + PROMPTER_ICON_SIZE / 2
				};
			} else if (vType === RELATION_TYPE.FinishToStart || vType === RELATION_TYPE.StartToStart) {
				oSuccessor = mAnchors.successor.head;
				oPredecessor = {
					x: oSuccessor.x - LINE_LENGTH,
					y: oSuccessor.y
				};
				oPrompter = {
					x: oPredecessor.x - PROMPTER_ICON_SIZE,
					y: oPredecessor.y + PROMPTER_ICON_SIZE / 2
				};
			}
		}
		return {
			predecessor: oPredecessor,
			successor: oSuccessor,
			prompter: oPrompter
		};
	};

	/**
	 * Determine the relationship shape to be drawn (I, S, L, U)
	 * @param {Object} mAnchors relationship Anchor Points
	 * @param {Number} vType Relationship type
	 */
	Relationship.prototype.calcLinePathD = function (mAnchors,vType) {
		var x1 = mAnchors.predecessor.x, y1 = mAnchors.predecessor.y;
		var x2 = mAnchors.successor.x, y2 = mAnchors.successor.y;
		var fnCalculate, mArguments = [x1, y1, x2, y2];
		var edgePoint = this.oGantt._edgePoint;
		if (y1 === y2) { // predecessor and successor are on the same row
			if (vType == RELATION_TYPE.FinishToStart  && (x2 > x1)  ||
			  vType == RELATION_TYPE.StartToFinish && (x1 > x2) ||
			mAnchors.prompter) {
				fnCalculate = this.calcIRlsPathD;
			} else {
				fnCalculate = this.calcSRlsPathD; mArguments.push(vType,edgePoint);
			}
		} else if (y1 !== y2) { // not on the same row
			if (vType === RELATION_TYPE.FinishToFinish) {
				fnCalculate = this.calcURlsPathD; mArguments.push(false,edgePoint);
			} else if (vType === RELATION_TYPE.FinishToStart) {
				if (x1 <= x2) {
					if (GanttChartConfigurationUtils.getRTL() ? this.getLShapeForTypeSF() : this.getLShapeForTypeFS()) {
						if ((edgePoint == 2 && this.getShapeTypeStart() == 'None') ||
							(edgePoint == 3 && Math.abs(x1 - x2) >= edgePoint * SHAPE_SIZE_RECT)) {
							fnCalculate = this.calcLRlsPathD;
						} else {
							fnCalculate = this.calcSRlsPathD; mArguments.push(vType,edgePoint);
						}
					} else if (Math.abs(x1 - x2) >= 2 * edgePoint * SHAPE_SIZE_RECT) {
							fnCalculate = this.calcZRlsPathD; mArguments.push(edgePoint);
						} else {
							fnCalculate = this.calcSRlsPathD; mArguments.push(vType,edgePoint);
						}
				} else if (x1 > x2) {
					fnCalculate = this.calcSRlsPathD; mArguments.push(vType,edgePoint);
				}
			} else if (vType === RELATION_TYPE.StartToFinish) {
				if (x1 < x2) {
					fnCalculate = this.calcSRlsPathD; mArguments.push(vType,edgePoint);
				} else if (x1 >= x2) {
				if (GanttChartConfigurationUtils.getRTL() ? this.getLShapeForTypeFS() : this.getLShapeForTypeSF()) {
						if ((edgePoint == 2 && this.getShapeTypeStart() == 'None') ||
							(edgePoint == 3 && Math.abs(x1 - x2) >= edgePoint * SHAPE_SIZE_RECT)) {
							fnCalculate = this.calcLRlsPathD;
						} else {
							fnCalculate = this.calcSRlsPathD; mArguments.push(vType,edgePoint);
						}

					} else if (Math.abs(x1 - x2) >= 2 * edgePoint * SHAPE_SIZE_RECT) {
							fnCalculate = this.calcZRlsPathD; mArguments.push(edgePoint);
						} else {
							fnCalculate = this.calcSRlsPathD; mArguments.push(vType,edgePoint);
						}
				}
			} else if (vType === RELATION_TYPE.StartToStart) {
				fnCalculate = this.calcURlsPathD; mArguments.push(true,edgePoint);
			}
		}

		// special calculate for L relationship
		if (fnCalculate === this.calcLRlsPathD) {
			var yTop = mAnchors.successor.dyTop ?  mAnchors.successor.dyTop : mAnchors.successor.dy;
			var yBottom = mAnchors.successor.dyBottom ? mAnchors.successor.dyBottom : mAnchors.successor.dy;
			mArguments[2] = (x1 < x2) ? x2 + mAnchors.successor.dx : x2 - mAnchors.successor.dx;
			mArguments[3] = (y1 < y2) ? y2 - yTop : y2 + yBottom;
		}

		this.setProperty("d", fnCalculate.apply(this, mArguments), true);
	};

	/**
	 * +----------------------------+
	 * |   +-------------------->   |
	 * +----------------------------+
	 *
	 * @param {float} x1 start point of x-axis
	 * @param {float} y1 start point on y-axis
	 * @param {float} x2 end point of x-axis
	 * @param {float} y2 end point on y-axis
	 *
	 * @returns {string} concat <path> d to show I (straight line) style path
	 */
	Relationship.prototype.calcIRlsPathD = function (x1, y1, x2, y2) {
		return this.getLinePathD([[x1, y1], [x2, y2]]);
	};

	/**
	 * +----------------------------+
	 * |   +--------------------+   |
	 * |                        |   |
	 * |                        v   |
	 * +----------------------------+
	 * @param {float} x1 start point of x-axis
	 * @param {float} y1 start point on y-axis
	 * @param {float} x2 end point of x-axis
	 * @param {float} y2 end point on y-axis
	 *
	 * @returns {string} concat <path> d to show L style path
	 */
	Relationship.prototype.calcLRlsPathD = function (x1, y1, x2, y2) {
		return this.getLinePathD([[x1, y1], [x2, y1], [x2, y2]]);
	};

	/**
	 * +----------------------------+
	 * |   +--------------------+   |
	 * |                        |   |
	 * |              <---------+   |
	 * +----------------------------+
	 *
	 * @param {float} x1 start point of x-axis
	 * @param {float} y1 start point on y-axis
	 * @param {float} x2 end point of x-axis
	 * @param {float} y2 end point on y-axis
	 * @param {bool} bYFlip whether to flip the U style
	 *
	 * @returns {string} concat <path> d to show U style relationship
	 */
	Relationship.prototype.calcURlsPathD = function (x1, y1, x2, y2, bYFlip,edgePoint) {
		var x3 = (x1 < x2) ? x2 + edgePoint * SHAPE_SIZE_RECT : x1 + edgePoint * SHAPE_SIZE_RECT;
		var x4 = (x1 < x2) ? x1 - edgePoint * SHAPE_SIZE_RECT : x2 - edgePoint * SHAPE_SIZE_RECT;
		var x5 = (!bYFlip) ? x3 : x4;
		if (this.getRelationshipOverDivider()){
			var x6 = (x1 < x2) ? x1 + edgePoint * SHAPE_SIZE_RECT : x2 + edgePoint * SHAPE_SIZE_RECT;
			var x7 = (x1 < x2) ? x2 - edgePoint * SHAPE_SIZE_RECT : x1 - edgePoint * SHAPE_SIZE_RECT;
			var x8 = (!bYFlip) ? x6 : x7;
			var y3 = y1  > y2  ? this.predYTop : this.predYBottom;
			var y4 = y1  < y2  ? this.sucYTop : this.sucYBottom;

			if ((!bYFlip && x1  < x2) || (bYFlip && x1 > x2)){
				return this.getLinePathD([[x1, y1],[x8,y1],[x8,y3] ,[x5, y3], [x5, y2], [x2, y2]]);
			} else {
				return this.getLinePathD([[x1, y1],[x5,y1],[x5,y4] ,[x8,y4],[x8,y2],[x2, y2]]);
			}
		} else {
			return this.getLinePathD([[x1, y1], [x5, y1], [x5, y2], [x2, y2]]);
		}
	};

	/**
	 * +----------------------------+
	 * |                    +---+   |
	 * |                        |   |
	 * |   +--------------------+   |
	 * |   |                        |
	 * |   +--->                    |
	 * +----------------------------+
	 *
	 * @param {float} x1 start point of x-axis
	 * @param {float} y1 start point on y-axis
	 * @param {float} x2 end point of x-axis
	 * @param {float} y2 end point on y-axis
	 * @param {int} vType Type of relationship
	 * @returns {string} concat <path> d to show S relationship
	 */
	Relationship.prototype.calcSRlsPathD = function (x1, y1, x2, y2, vType,edgePoint) {
			var x3 = vType == 0 || vType == 1  ? x1 + edgePoint * SHAPE_SIZE_RECT : x1 - edgePoint * SHAPE_SIZE_RECT;
			var y3  = y1 > y2 ? this.predYTop : this.predYBottom;
			var x4 = vType == 0 || vType == 2 ? x2 + edgePoint * SHAPE_SIZE_RECT : x2 - edgePoint * SHAPE_SIZE_RECT;
			return this.getLinePathD([[x1, y1], [x3, y1], [x3, y3], [x4, y3], [x4, y2], [x2, y2]]);
	};

	/**
	 * +----------------------------+
	 * |  +-------                  |
	 * |         |                  |
	 * |         +------->          |
	 * -----------------------------+
	 *
	 * @param {float} x1 start point of x-axis
	 * @param {float} y1 start point on y-axis
	 * @param {float} x2 end point of x-axis
	 * @param {float} y2 end point on y-axis
	 * @param {float} x3 mid point on x axis to have bend
	 */

	Relationship.prototype.calcZRlsPathD = function (x1, y1, x2, y2,edgePoint) {
		var x3 = (x1 < x2) ? x1 + edgePoint * SHAPE_SIZE_RECT : x1 - edgePoint * SHAPE_SIZE_RECT;
		if (this.getRelationshipOverDivider()){
			var y3  = y1 < y2 ? this.sucYTop : this.sucYBottom;
			var x4 = (x1 < x2) ? x2 - edgePoint * SHAPE_SIZE_RECT : x2 + edgePoint * SHAPE_SIZE_RECT;
			return this.getLinePathD([[x1, y1], [x3, y1], [x3, y3], [x4, y3],[x4,y2],[x2,y2]]);
		} else {
			return this.getLinePathD([[x1, y1], [x3, y1], [x3, y2], [x2, y2]]);
		}
	};

	/**
	 * Setting the coordinates to Draw End Connector
	 * @param {String} sPath relationship Path
	 * @param {String} sGanttId Gantt instance id
	 * @param {Number} vType relationshipType
	 * @returns {any} relationship connector svg after drawing
	 */
	Relationship.prototype.getConnectorEndPath = function (sPath, sGanttId, vType) {
		var fnToNum = function (v) { return Number(v); };
		var aPoints = sPath.match(/-?\d+(\.\d+)?/g).map(fnToNum);
		var aCoordinates = [];
		var lShapeType;
		var x1 = this.getEnableCurvedEdge() ? aPoints[aPoints.length - 4] : aPoints[aPoints.length / 2 - 2];
		var y1 = this.getEnableCurvedEdge() ? aPoints[aPoints.length - 3] : aPoints[aPoints.length / 2 - 1];
		var x2 = this.getEnableCurvedEdge() ? aPoints[aPoints.length - 2] : aPoints[aPoints.length / 2 + 0];
		var y2 = this.getEnableCurvedEdge() ? aPoints[aPoints.length - 1] : aPoints[aPoints.length / 2 + 1];
		if (x1 == x2) {
			//getting coordinates for Up/down position of connector
			if (y1 > y2) {
				aCoordinates = this.getCoordinateUpDown(x2, y2, "up");
				lShapeType = aPoints[0] < x2 ? "rightUp" : "leftUp";
			} else {
				aCoordinates = this.getCoordinateUpDown(x2, y2, "down");
				lShapeType = aPoints[0] < x2 ? "rightDown" : "leftDown";
			}
		} else if (x1 != x2) {
			aCoordinates = x1 < x2 ? this.getCoordinate(x2, y2, "rightEnd") : this.getCoordinate(x2, y2, "leftEnd");
		}
		return this.renderSvg(aCoordinates, "end", sGanttId, vType, lShapeType);
	};
	/**
	 * Setting the coordinates to Draw Start Connector
	 * @param {String} sPath relationship path
	 * @param {String} sGanttId gantt instance id
	 * @param {Number} vType relationship type
	 * @returns {any} relationship connector svg after drawing
	 */
	Relationship.prototype.getConnectorStartPath = function (sPath, sGanttId, vType) {
		var fnToNum = function (v) { return Number(v); };
		var aPoints = sPath.match(/-?\d+(\.\d+)?/g).map(fnToNum);
		var x1 = aPoints[0], y1 = aPoints[1];
		var aCoordinates = vType == 0 || vType == 1 ? this.getCoordinate(x1, y1, "rightStart") : this.getCoordinate(x1, y1, "leftStart");
		return this.renderSvg(aCoordinates, "start", sGanttId, vType);
	};

	Relationship.prototype.renderSvg = function (aCoordinates, position, sGanttId, vType, upDown) {
		var coordinates = [];
		var shapeType = this._checkConnectorOverlap(sGanttId, vType, position, upDown);
		if (shapeType == CONNECTOR_TYPE.Arrow) {
			if (position == "start") {
				coordinates.push(aCoordinates[0], aCoordinates[1], aCoordinates[4], aCoordinates[7]);
			} else {
				coordinates.push(aCoordinates[0], aCoordinates[3], aCoordinates[5]);
			}
			return d3.svg.line().interpolate("linear-closed")(coordinates);
		} else if (shapeType == CONNECTOR_TYPE.Square) {
			coordinates.push(aCoordinates[0], aCoordinates[1], aCoordinates[3], aCoordinates[5], aCoordinates[7]);
			return d3.svg.line().interpolate("linear-closed")(coordinates);
		} else if (shapeType == CONNECTOR_TYPE.Diamond) {
			coordinates.push(aCoordinates[0], aCoordinates[2], aCoordinates[4], aCoordinates[6]);
			return d3.svg.line().interpolate("linear-closed")(coordinates);
		} else if (shapeType == CONNECTOR_TYPE.Circle) {
			coordinates.push(aCoordinates[0], aCoordinates[1], aCoordinates[3], aCoordinates[5], aCoordinates[7]);
			return d3.svg.line().interpolate("basis-closed")(coordinates);
		} else if (shapeType === CONNECTOR_TYPE.HorizontalRectangle) {
			coordinates.push(aCoordinates[0], aCoordinates[15], aCoordinates[9], aCoordinates[10], aCoordinates[16]);
			return d3.svg.line().interpolate("linear-closed")(coordinates);
		} else if (shapeType == CONNECTOR_TYPE.VerticalRectangle) {
			coordinates.push(aCoordinates[0], aCoordinates[11], aCoordinates[12], aCoordinates[13], aCoordinates[14]);
			return d3.svg.line().interpolate("linear-closed")(coordinates);
		} else if (shapeType == CONNECTOR_TYPE.None) {
			coordinates.push(aCoordinates[0]);
			return d3.svg.line().interpolate("linear")(coordinates);
		}
	};

	/**
	 * Checking if Start/End connects overlap or not.
	 * @param {String} sGanttId gantt instance id.
	 * @param {String} vType relationship type.
	 * @param {String} position determines if predesessor or successor connection.
	 * @param {String} upDown determines if L shape is connected from up or down.
	 * @returns {String} returns the operlapping Connector type for any overlap.
	 */
	Relationship.prototype._checkConnectorOverlap = function (sGanttId, vType, position, upDown) {
		var oGantt = Element.getElementById(sGanttId);
		var aVisibleRls = GanttUtils._getVisibleRelationships(oGantt);
		var mRelatedShapes = this.getRelatedInRowShapes(sGanttId);
		var isRTL = GanttChartConfigurationUtils.getRTL();
		var shapeType, vpossible, vpossibleI, temp = [];

		//checking OverLap for L shapes
		var checkLRslOverlaps = function (Pos) {
			vpossible = [1, 2];
			if (mRelatedShapes.predecessor && mRelatedShapes.successor) {
				aVisibleRls.forEach(function (x) {
					if (x.mProperties.successor && x.mProperties.predecessor) {
						if (mRelatedShapes.successor.mProperties.shapeId === x.getSuccessor() &&
							(vpossible.indexOf(RELATION_TYPE[x.getType()]) !== -1) && x._getLMarker() === Pos) {
							temp.push(x.getShapeTypeEnd());
						}
					}
				});
			}
			temp = GanttUtils.getFilteredShapeType(temp);
			var shapeType = temp.length > 1 ? CONNECTOR_TYPE.HorizontalRectangle : this.getShapeTypeEnd();
			if (shapeType == CONNECTOR_TYPE.VerticalRectangle || shapeType == CONNECTOR_TYPE.HorizontalRectangle) {
				shapeType = shapeType == CONNECTOR_TYPE.VerticalRectangle ? CONNECTOR_TYPE.HorizontalRectangle : CONNECTOR_TYPE.VerticalRectangle;
			}
			return shapeType;
		}.bind(this);

		//Checking overlap for inward/outward arrow.
		var checkArrowConnecterOverlap = function (shapeType, ArrowType) {
			return shapeType === CONNECTOR_TYPE.Arrow ? ArrowType : shapeType;
		};

		if (position == "start") {
			if (isRTL) {
				vpossible = vType == 0 || vType == 1 ? [2, 3] : [0, 1];
				vpossibleI = vType == 0 || vType == 1 ? [1, 3] : [0, 2];
			} else {
				vpossible = vType == 0 || vType == 1 ? [0, 1] : [2, 3];
				vpossibleI = vType == 0 || vType == 1 ? [0, 2] : [1, 3];
			}

			if (mRelatedShapes.predecessor && mRelatedShapes.successor) {
				aVisibleRls.forEach(function (x) {
					if (x.mProperties.successor && x.mProperties.predecessor) {
						if (mRelatedShapes.predecessor.mProperties.shapeId == x.getPredecessor() &&
							(vpossible.indexOf(RELATION_TYPE[x.getType()]) !== -1)) {
							temp.push(checkArrowConnecterOverlap(x.getShapeTypeStart(), "ArrowStart"));
						}
						if (mRelatedShapes.predecessor.mProperties.shapeId == x.getSuccessor() &&
							(vpossibleI.indexOf(RELATION_TYPE[x.getType()]) !== -1) && x._getLMarker() == "") {
							temp.push(checkArrowConnecterOverlap(x.getShapeTypeEnd(), "ArrowEnd"));
						}
					}
				});
			}
			temp = GanttUtils.getFilteredShapeType(temp);
			shapeType = temp.length > 1 ? CONNECTOR_TYPE.HorizontalRectangle : this.getShapeTypeStart();
		} else if (upDown == "rightUp" || upDown == "rightDown" || upDown == "leftUp" || upDown == "leftDown") {
				shapeType = checkLRslOverlaps(upDown);
			} else {
				if (isRTL) {
					vpossible = (vType == 1 || vType == 3) ? [0, 2] : [1, 3];
					vpossibleI = (vType == 1 || vType == 3) ? [0, 1] : [2, 3];
				} else {
					vpossible = (vType == 1 || vType == 3) ? [1, 3] : [0, 2];
					vpossibleI = (vType == 1 || vType == 3) ? [2, 3] : [0, 1];
				}
				if (mRelatedShapes.predecessor && mRelatedShapes.successor) {
					aVisibleRls.forEach(function (x) {
						if (x.mProperties.successor && x.mProperties.predecessor) {
							if (mRelatedShapes.successor.mProperties.shapeId == x.getSuccessor() &&
								(vpossible.indexOf(RELATION_TYPE[x.getType()]) !== -1) && x._getLMarker() == "") {
								temp.push(checkArrowConnecterOverlap(x.getShapeTypeEnd(), "ArrowEnd"));
							}
							if (mRelatedShapes.successor.mProperties.shapeId == x.getPredecessor() &&
								(vpossibleI.indexOf(RELATION_TYPE[x.getType()])) !== -1) {
								temp.push(checkArrowConnecterOverlap(x.getShapeTypeStart(), "ArrowStart"));
							}
						}
					});
				}
				temp = GanttUtils.getFilteredShapeType(temp);
				shapeType = temp.length > 1 ? CONNECTOR_TYPE.HorizontalRectangle : this.getShapeTypeEnd();
			}
		return shapeType;
	};

/** 11-----------12
 *   |           |
 *  1/15---2-----3----------9
 *   |           |          |
 *  0|     8     |4         |
 *   |           |          |
 *  7/16---6-----5---------10
 *   |           |
 *   14---------13
 * @param {number} x , x coordinate of start or end point.
 * @param {number} y , y coordinate of start or end point
 * @param {number} face , shape facing direction.
 * @returns { Array } array of coordinates to draw shape at start and end(when it's not L relation) of relation.
 */
	Relationship.prototype.getCoordinate = function (x, y, face) {
		var x1 = (face == "rightStart" || face == "leftEnd") ? x + this.SHAPE_SIZE / 2 : x - this.SHAPE_SIZE / 2;
		var x2 = (face == "rightStart" || face == "leftEnd") ? x + this.SHAPE_SIZE : x - this.SHAPE_SIZE;
		var x3 = (face == "rightStart" || face == "leftEnd") ? x + 2 * SHAPE_SIZE_RECT : x - 2 * SHAPE_SIZE_RECT;
		var x4 = (face == "rightStart" || face == "leftEnd") ? x + SHAPE_SIZE_RECT : x - SHAPE_SIZE_RECT;
		var temp = [[x, y], //0
		[x, y - this.SHAPE_SIZE / 2], //1
		[x1, y - this.SHAPE_SIZE / 2], //2
		[x2, y - this.SHAPE_SIZE / 2], //3
		[x2, y], //4
		[x2, y + this.SHAPE_SIZE / 2], //5
		[x1, y + this.SHAPE_SIZE / 2], //6
		[x, y + this.SHAPE_SIZE / 2],//7
		[x1, y], //8
		//coordintes used for HorizontalRectangle and VerticalRectangle won't be taking dynamic SHAPE_SIZE.
		[x3, y - SHAPE_SIZE_RECT / 2], //9
		[x3, y + SHAPE_SIZE_RECT / 2], //10
		[x, y - SHAPE_SIZE_RECT], //11
		[x4, y - SHAPE_SIZE_RECT], //12
		[x4, y + SHAPE_SIZE_RECT], //13
		[x, y + SHAPE_SIZE_RECT],//14
		[x, y - SHAPE_SIZE_RECT / 2], //15
		[x, y + SHAPE_SIZE_RECT / 2]//16
		];
		return temp;
	};

/**       10-----------9
 *         |           |
 *         |           |
 *         |           |
 *  13-----5-----4-----3-----12
 *   |     |           |     |
 *   |    6|     8     |2    |
 *   |     |           |     |
 *  14----7/16---0----1/15---11
 *
 * @param {number} x , x coordinate of start or end point.
 * @param {number} y , y coordinate of start or end point
 * @param {number} face , shape facing direction.
 * @returns { Array }  Return coordinates to draw shape at  end (when it's  L relation) of relation
 */
	Relationship.prototype.getCoordinateUpDown = function (x, y, face) {
		var y1 = face == "up" ? y + this.SHAPE_SIZE / 2 : y - this.SHAPE_SIZE / 2;
		var y2 = face == "up" ? y + this.SHAPE_SIZE : y - this.SHAPE_SIZE;
		var y3 = face == "up" ? y + 2 * SHAPE_SIZE_RECT : y - 2 * SHAPE_SIZE_RECT;
		var y4 = face == "up" ? y + SHAPE_SIZE_RECT : y - SHAPE_SIZE_RECT;
		var temp = [[x, y], //0
		[x + this.SHAPE_SIZE / 2, y], //1
		[x + this.SHAPE_SIZE / 2, y1],//2
		[x + this.SHAPE_SIZE / 2, y2],//3
		[x, y2],//4
		[x - this.SHAPE_SIZE / 2, y2],//5
		[x - this.SHAPE_SIZE / 2, y1],//6
		[x - this.SHAPE_SIZE / 2, y],//7
		[x, y1],//8
		//coordintes used for HorizontalRectangle and VerticalRectangle won't be taking dynamic SHAPE_SIZE.
		[x + SHAPE_SIZE_RECT / 2, y3],  //9
		[x - SHAPE_SIZE_RECT / 2, y3],//10
		[x + SHAPE_SIZE_RECT, y], //11
		[x + SHAPE_SIZE_RECT, y4],//12
		[x - SHAPE_SIZE_RECT, y4],//13
		[x - SHAPE_SIZE_RECT, y],//14
		[x + SHAPE_SIZE_RECT / 2, y], //15
		[x - SHAPE_SIZE_RECT / 2, y]//16
		];
		return temp;
	};
	Relationship.prototype.getShapeAnchors = function (mRelatedShapes) {
		var mAnchors = { predecessor: null, successor: null };
		Object.keys(mRelatedShapes).forEach(function (sKey) {
			var oShape = mRelatedShapes[sKey];
			if (oShape == null) { return; }
			if (oShape.getShapeAnchors) {
				mAnchors[sKey] = oShape.getShapeAnchors();
			} else {
				var oBBox, leftAnchorPosition, rightAnchorPosition;
				if (oShape.getDomRef("nonLabelGroup")) {
					 oBBox = oShape.getDomRef("nonLabelGroup").getBBox();
					 leftAnchorPosition = 3 / 4;
					 rightAnchorPosition = 3 / 4;
				} else {
					 oBBox = oShape.getDomRef().getBBox();
					 leftAnchorPosition = oShape.getLeftAnchorPosition() / 100;
					 rightAnchorPosition = oShape.getRightAnchorPosition() / 100;
				}
				var sTransform, iTranslateY = 0;
				sTransform = window.getComputedStyle(oShape.getDomRef()).transform.match(/matrix.*\((.+)\)/);

				if (sTransform) {
					iTranslateY = sTransform[1].split(', ')[5];
				}
				mAnchors[sKey] = {
					head: {
						x: oBBox.x,
						y: oBBox.y + oBBox.height * leftAnchorPosition + (parseFloat(iTranslateY)),
						dx: 0,
						dyTop: oBBox.height * leftAnchorPosition,
						dyBottom : oBBox.height * (1 - leftAnchorPosition)
					},
					tail: {
						x: oBBox.x + oBBox.width,
						y: oBBox.y + oBBox.height * rightAnchorPosition + (parseFloat(iTranslateY)),
						dx: 0,
						dyTop: oBBox.height * rightAnchorPosition,
						dyBottom : oBBox.height * (1 - rightAnchorPosition)
					}
				};
			}
		});
		return mAnchors;
	};

	Relationship.prototype.renderRelationship = function (oRm, mAnchors, vType, sGanttId) {
		this.writeElementData(oRm, "g", true);
		RenderUtils.renderAttributes(oRm, this, ["style"]);
		oRm.openEnd();
		RenderUtils.renderTooltip(oRm, this);
		oRm.openStart("path");
		if (!this.getEnableCurvedEdge() || mAnchors.prompter) {
			oRm.attr("d", this.getD());
		} else {
			oRm.style("fill", "none");
			oRm.attr("d", GanttUtils.getPathCorners(this.getD(), 5));
		}
		oRm.openEnd().close("path");

		//invisible Path to provide more space to hover on.
		oRm.openStart("path");
		if (!this.getEnableCurvedEdge() || mAnchors.prompter) {
			oRm.attr("d", this.getD());
			oRm.style("fill", "none");
		} else {
			oRm.style("fill", "none");
			oRm.attr("d", GanttUtils.getPathCorners(this.getD(), 5));
		}
		oRm.style("stroke-width", 8);
		oRm.style("stroke", "none");
		oRm.style("pointer-events", "stroke");
		oRm.openEnd().close("path");

		oRm.openStart("path");
		oRm.style("fill", this.getStartShapeColor());
		oRm.style("stroke-dasharray", "none");
		oRm.attr("d", this.getConnectorStartPath(this.getD(), sGanttId, vType));
		oRm.openEnd().close("path");
		oRm.openStart("path");
		oRm.style("fill", this.getEndShapeColor());
		oRm.style("stroke-dasharray", "none");
		oRm.attr("d", this.getConnectorEndPath(this.getD(), sGanttId, vType));
		oRm.openEnd().close("path");
		if (mAnchors.prompter) {
			oRm.openStart("text");
			oRm.attr("x", mAnchors.prompter.x);
			oRm.attr("y", mAnchors.prompter.y);
			oRm.attr("font-size", PROMPTER_ICON_SIZE);
			oRm.attr("font-family", "SAP-icons");
			oRm.attr("text-anchor", (GanttChartConfigurationUtils.getRTL() && !Device.browser.edge) ? "end" : "start");
			oRm.attr("stroke-width", 0);
			oRm.openEnd();
			oRm.text(IconPool.getIconInfo("chain-link").content);
			oRm.close("text");
		}
		oRm.close("g");
	};

	Relationship.prototype.getStyle = function () {
		return this.getInlineStyle({
			"fill": this.getStroke() || Parameters.get("sapUiBaseText"),
			"stroke": this.getStroke() || Parameters.get("sapUiBaseText"),
			"stroke-width": this.getStrokeWidth() || 1,
			"stroke-dasharray": this.getStrokeDasharray(),
			"opacity": this.getStrokeOpacity()
		});
	};

	Relationship.prototype.getLinePathD = function (aPoints) {
		if (this.getEnableCurvedEdge()) {
			return d3.svg.line().interpolate("linear")(aPoints);
		} else {
			aPoints = aPoints.concat(aPoints.slice(1, -1).reverse());
			return d3.svg.line().interpolate("linear-closed")(aPoints);
		}
	};

	Relationship.prototype.getSelectedStyle = function () {
		return this.getInlineStyle({
			"fill": this.getSelectedStroke(),
			"stroke": this.getSelectedStroke(),
			"stroke-width": this.getSelectedStrokeWidth(),
			"stroke-dasharray": this.getStrokeDasharray(),
			"pointer-events": "none"
		});
	};

	/**
	 * FIXME: evaluate if it's really needed
	 *
	 * @param {string} sGanttId GanttChart id
	 */
	Relationship.prototype.getBaseRowHeight = function (sGanttId) {
		return Element.getElementById(sGanttId).getTable()._getDefaultRowHeight();
	};

	Relationship.prototype.getProcessedType = function () {
		var sType = this.getProperty("type");
		var isRTL = GanttChartConfigurationUtils.getRTL();
		return isRTL ? 3 - RELATION_TYPE[sType] : RELATION_TYPE[sType];
	};

	/**
	 * Gets the predecessor and successor objects.
	 * @param {object} sGanttId The Gantt ID.
	 * @returns {object} An object which includes the predecessor and successor objects.
	 * {
	 *     predecessor: oShape1,
	 *     successor: oShape2
	 * }
	 * @private
	 */
	Relationship.prototype.getRelatedInRowShapes = function (sGanttId) {
		var aPredecessorSvg = GanttUtils.shapeElementById(this.getPredecessor(), sGanttId + "-svg");
		var aSuccessorSvg = GanttUtils.shapeElementById(this.getSuccessor(), sGanttId + "-svg");
		return {
			predecessor: aPredecessorSvg ? aPredecessorSvg : GanttUtils.isRelationshipConnectedToPseudoShapes(this.getPredecessor(), sGanttId),
			successor: aSuccessorSvg ? aSuccessorSvg : GanttUtils.isRelationshipConnectedToPseudoShapes(this.getSuccessor(), sGanttId)
		};
	};

	return Relationship;
}, true);
