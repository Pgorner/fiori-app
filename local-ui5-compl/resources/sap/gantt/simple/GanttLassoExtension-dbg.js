/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/events/KeyCodes",
	"./GanttExtension",
	"./CoordinateUtils",
	"sap/gantt/misc/Utility"
], function(jQuery, KeyCodes, GanttExtension, CoordinateUtils, Utility) {
	"use strict";

	var _sNamespace = ".sapGanttLasso";

	/**
	 * LassoHelper to provide de/attach DOM elements
	 */
	var LassoHelper = {
		addEventListeners: function(oGantt) {
			this.removeEventListeners(oGantt);
			var oExtension = oGantt._getLassoExtension();
			oExtension.lassoDoms().rowArea.on("mousedown" + _sNamespace, oExtension.beforeLasso.bind(oExtension));
		},
		removeEventListeners: function(oGantt) {
			var oExtension = oGantt._getLassoExtension();
			oExtension.lassoDoms().rowArea.off(_sNamespace);
		},
		addLassoEventListeners: function(oGantt) {
			this.removeLassoEventListeners(oGantt);
			var oExtension = oGantt._getLassoExtension();
			var $gantt = jQuery(oExtension.getDomRefs().gantt);
			$gantt.on("mousemove" + _sNamespace, oExtension.onMousemove.bind(oExtension));
			$gantt.on("mouseup" + _sNamespace, oExtension.endLasso.bind(oExtension));
			$gantt.on("mouseleave" + _sNamespace, oExtension.endLasso.bind(oExtension));
			$gantt.on("keydown" + _sNamespace, oExtension.onKeydown.bind(oExtension));
		},
		removeLassoEventListeners: function(oGantt) {
			var oExtension = oGantt._getLassoExtension();
			jQuery(oExtension.getDomRefs().gantt).off(_sNamespace);
		}

	};

	/**
	 * GanttLassoExtension class
	 *
	 * @class
	 * The GanttLassoExtension aim to provide support for Lasso creation.
	 * @private
	 * @alias sap.gantt.simple.GanttLassoExtension
	 * @extends sap.gantt.simple.GanttExtension
	 */
	var GanttLassoExtension = GanttExtension.extend("sap.gantt.simple.GanttLassoExtension", {
		/**
		 * @override
		 * @inheritDoc
		 * @returns {string} The name of this extension.
		 */
		_init: function(oGantt, mSettings) {
			this._initLassoStates();
			return "LassoExtension";
        },

		/**
		 * @override
		 * @inheritDoc
		 */
		_attachEvents: function() {
			var oGantt = this.getGantt();
			LassoHelper.addEventListeners(oGantt);
		},

		/**
		 * @override
		 * @inheritDoc
		 */
		_detachEvents: function() {
			var oGantt = this.getGantt();
			LassoHelper.removeEventListeners(oGantt);
		}
	});

	GanttLassoExtension.prototype._initLassoStates = function() {
		this.mDom = {};
        this._oLassoStartPoint = {};
		this._bLassoDrawing = false;
	};

	GanttLassoExtension.prototype.getSvgElement = function() {
		return this.getDomRefs().ganttSvg;
	};

	GanttLassoExtension.prototype._getShapeConnectRootNode = function() {
		var $lassoContainer = this.lassoDoms().lasso;
		return d3.select($lassoContainer.get(0));
	};

	GanttLassoExtension.prototype.rect = function(x, y, w, h) {
        return "M" + [x,y] + " l" + [w,0] + " l" + [0,h] + " l" + [-w,0] + "z";
	};

	GanttLassoExtension.prototype._getLassoData = function(oSvgPoint) {
		var iLassoX1 = this._oLassoStartPoint.x < oSvgPoint.x ? this._oLassoStartPoint.x : oSvgPoint.x;
		var iLassoX2 = this._oLassoStartPoint.x > oSvgPoint.x ? this._oLassoStartPoint.x : oSvgPoint.x;
		var iLassoY1 = this._oLassoStartPoint.y < oSvgPoint.y ? this._oLassoStartPoint.y : oSvgPoint.y;
		var iLassoY2 = this._oLassoStartPoint.y > oSvgPoint.y ? this._oLassoStartPoint.y : oSvgPoint.y;
		var oLassoData = {
			"class": "lassoRect",
			d: this.rect(iLassoX1, iLassoY1, iLassoX2 - iLassoX1, iLassoY2 - iLassoY1),
			fill: "#9bdaff",
			stroke: "#4da5ff",
			"fill-opacity": 0.5,
            "stroke-width": 2
		};
		return oLassoData;
	};

	GanttLassoExtension.prototype.createLasso = function(oSvgPoint) {
		var oLassoData = this._getLassoData(oSvgPoint);

		if (this.getD3Doms().lassoRect.empty()) {
			var oShapeConnectRootNode = this._getShapeConnectRootNode();
			oShapeConnectRootNode.append("path").attr(oLassoData);
		}
    };

	GanttLassoExtension.prototype.isLassoDrawing = function() {
		return this._bLassoDrawing;
	};

	GanttLassoExtension.prototype.beforeLasso = function(oEvent) {
		var oGantt = this.getGantt();
		if ((oEvent.button !== 0) || ((oGantt.getSelection().sSelectionMode !== sap.gantt.SelectionMode.MultiWithKeyboardAndLasso) && (oGantt.getSelection().sSelectionMode !== sap.gantt.SelectionMode.MultipleWithLasso))) {
			return;
		}

        var oSvg = this.getSvgElement();
		var oSvgPoint = CoordinateUtils.getEventSVGPoint(oSvg, oEvent);
        this._oLassoStartPoint = {
            x: oSvgPoint.x,
            y: oSvgPoint.y
		};

		if ((oGantt.getSelection().sSelectionMode === sap.gantt.SelectionMode.MultiWithKeyboardAndLasso) && !(oEvent.ctrlKey || oEvent.metaKey)) {
			oGantt._bDeselectShapes = true;
			oGantt.setSelectedShapeUid([]);
		} else {
			oGantt._bDeselectShapes = false;
		}

		LassoHelper.addLassoEventListeners(oGantt);
	};

	GanttLassoExtension.prototype.onMousemove = function(oEvent) {
		if (!this.isLassoDrawing()) {
			this._bLassoDrawing = true;
			var oSvg = this.getSvgElement();
			var oSvgPoint = CoordinateUtils.getEventSVGPoint(oSvg, oEvent);
			this.createLasso(oSvgPoint);
			this.mDom.lassoRect = this.lassoDoms().lassoRect;
		} else {
			this.onLassoDrawing(oEvent);
		}
	};

	GanttLassoExtension.prototype.onLassoDrawing = function(oEvent) {
		var oSvg = this.getSvgElement();
		var oSvgPoint = CoordinateUtils.getEventSVGPoint(oSvg, oEvent);
		var oLassoData = this._getLassoData(oSvgPoint);
		this.mDom.lassoRect.attr(oLassoData);
	};

	//Function to check whether shape is partially inside lasso
	GanttLassoExtension.prototype.shapeInLasso = function(iShapeX1, iShapeX2, iShapeY1, iShapeY2, iLassoX1, iLassoX2, iLassoY1, iLassoY2) {
		if ( (iShapeX1 >= iLassoX1 && iShapeX1 <= iLassoX2 && iShapeY1 >= iLassoY1 && iShapeY1 <= iLassoY2)
					 || (iShapeX2 >= iLassoX1 && iShapeX2 <= iLassoX2 && iShapeY1 >= iLassoY1 && iShapeY1 <= iLassoY2)
					 || (iShapeX1 >= iLassoX1 && iShapeX1 <= iLassoX2 && iShapeY2 >= iLassoY1 && iShapeY2 <= iLassoY2)
					 || (iShapeX2 >= iLassoX1 && iShapeX2 <= iLassoX2 && iShapeY2 >= iLassoY1 && iShapeY2 <= iLassoY2)
					 || (iShapeX1 <= iLassoX1 && iShapeX2 >= iLassoX2 && iShapeY1 >= iLassoY1 && iShapeY1 <= iLassoY2)
					 || (iShapeX1 <= iLassoX1 && iShapeX2 >= iLassoX2 && iShapeY2 >= iLassoY1 && iShapeY2 <= iLassoY2)
					 || (iShapeX1 >= iLassoX1 && iShapeX1 <= iLassoX2 && iShapeY2 >= iLassoY2 && iShapeY1 <= iLassoY1)
					 || (iShapeX2 >= iLassoX1 && iShapeX2 <= iLassoX2 && iShapeY2 >= iLassoY2 && iShapeY1 <= iLassoY1) ) {
						 return true;
					 }
					 return false;
	};

	GanttLassoExtension.prototype.getShapeElementByTarget = function(target, oExtension) {
		return jQuery(oExtension.getDraggableDOMElement(target)).control(0, true);
	};

	GanttLassoExtension.prototype.getDraggableDOMElement = function(target) {
		return jQuery(target).closest("[data-sap-gantt-shape-id]").get(0);
	};

	GanttLassoExtension.prototype.endLasso = function(oEvent) {
		var oGantt = this.getGantt();
		var oExtension = oGantt._getLassoExtension();
		if (this.isLassoDrawing()) {
			var oShapeConnectRootNode = this._getShapeConnectRootNode();
			oShapeConnectRootNode.selectAll("*").remove();
		}
		LassoHelper.removeLassoEventListeners(this.getGantt());

		var oSvg = this.getSvgElement();
		var oSvgPoint = CoordinateUtils.getEventSVGPoint(oSvg, oEvent);
		var oStartPoint = oGantt._getLassoExtension()._oLassoStartPoint;

		var iLassoX1 = oStartPoint.x < oSvgPoint.x ? oStartPoint.x : oSvgPoint.x;
		var iLassoX2 = oStartPoint.x > oSvgPoint.x ? oStartPoint.x : oSvgPoint.x;
		var iLassoY1 = oStartPoint.y < oSvgPoint.y ? oStartPoint.y : oSvgPoint.y;
		var iLassoY2 = oStartPoint.y > oSvgPoint.y ? oStartPoint.y : oSvgPoint.y;

		var iShapeX1, iShapeX2, iShapeY1, iShapeY2, oCurrentShape, sShapeUid, mBias = {x: 0, y: 0};
		var bInvert = oGantt.getEnableLassoInvert();

		var aSelectedShapes = oGantt.getSelectedShapeUid();
		var aAllShapesInLasso = bInvert ? [] : aSelectedShapes;
		var aAlreadySelectedVisibleShapesInLasso = [];
		var $oSvg = jQuery(oSvg);
		var aVisibleShapes = jQuery($oSvg.find(".sapGanttChartShapes")).find(".baseShapeSelection").toArray();
		var aVisibleRelations = jQuery($oSvg.find(".sapGanttChartRls")).find(".baseShapeSelection").toArray();
		var bIsShapeSelectable = false;

		aVisibleShapes.forEach(function(oBaseShape, i) {
			if (!oBaseShape.classList.contains("sapGanttTextNoPointerEvents")){
				oCurrentShape =  oExtension.getShapeElementByTarget(oBaseShape, oExtension);
				if (oCurrentShape) {
					bIsShapeSelectable = oCurrentShape.getSelectable();
					mBias = Utility.getShapeBias(oCurrentShape);
					var sTransform = oBaseShape.getAttribute("transform");
					if (sTransform) {
						var aBias = sTransform.slice(sTransform.indexOf("(") + 1, -1).split(" ");
						mBias = aBias && aBias.length ? {x: parseFloat(aBias[0]), y: parseFloat(aBias[1])} : mBias;
					}
					sShapeUid = oCurrentShape.getShapeUid() ? oCurrentShape.getShapeUid() : oCurrentShape.getParentRowSettings().getShapeUid(oCurrentShape);
				}
				iShapeX1 = oBaseShape.getBBox().x + mBias.x;
				iShapeX2 = iShapeX1 + oBaseShape.getBBox().width;
				iShapeY1 = oBaseShape.getBBox().y + mBias.y;
				iShapeY2 = iShapeY1 + oBaseShape.getBBox().height;

				var bShapeInLasso = oExtension.shapeInLasso(iShapeX1, iShapeX2, iShapeY1, iShapeY2, iLassoX1, iLassoX2, iLassoY1, iLassoY2);
				var iShapeAlreadySelected = oCurrentShape ? aSelectedShapes.indexOf(sShapeUid) : 0;
				var bShapeAlreadySelected = iShapeAlreadySelected === -1 ? false : true;
				if (bShapeInLasso) {
					if (oCurrentShape && bIsShapeSelectable && !bShapeAlreadySelected && (aAllShapesInLasso.indexOf(sShapeUid) === -1)){
						aAllShapesInLasso.push(sShapeUid);
					} else if (bInvert && oCurrentShape && bIsShapeSelectable && bShapeAlreadySelected) {
						aAlreadySelectedVisibleShapesInLasso.push(sShapeUid);
					}
				} else if (bInvert && oCurrentShape && bIsShapeSelectable && bShapeAlreadySelected) {
					aAllShapesInLasso.push(sShapeUid);
				}

				if (oCurrentShape) {
					aVisibleShapes[i] = sShapeUid;
				}
			}
		});

		aVisibleRelations.forEach(function(oBaseShape, i) {
			oCurrentShape =  oExtension.getShapeElementByTarget(oBaseShape, oExtension);
			if (oCurrentShape) {
				bIsShapeSelectable = oCurrentShape.getSelectable();
				sShapeUid = oCurrentShape.getShapeUid() ? oCurrentShape.getShapeUid() : oCurrentShape.getParentRowSettings().getShapeUid(oCurrentShape);
			}
			if (bInvert && oCurrentShape && bIsShapeSelectable && (aSelectedShapes.indexOf(sShapeUid) !== -1)) {
				aAllShapesInLasso.push(sShapeUid);
			}
			if (oCurrentShape) {
				aVisibleRelations[i] = sShapeUid;
			}
		});

		if (bInvert) {
			aSelectedShapes.forEach(function(oBaseShape) {
				if ((aVisibleShapes.indexOf(oBaseShape) === -1) && (aVisibleRelations.indexOf(oBaseShape) === -1)) {
					aAllShapesInLasso.push(oBaseShape);
				}
			});
		}

		var aShapeUids = [];
		aAllShapesInLasso.forEach(function(oBaseShape) {
			if ((aShapeUids.indexOf(oBaseShape) === -1) && (aAlreadySelectedVisibleShapesInLasso.indexOf(oBaseShape) === -1)) {
				aShapeUids.push(oBaseShape);
			}
		});

		this._initLassoStates();
		if (oGantt.getSelectedShapeUid().toString() === aShapeUids.toString()) {
			oGantt._bSupressShapeChangeEvent = true;
		} else {
			oGantt._bSupressShapeChangeEvent = false;
		}
		oGantt.setSelectedShapeUid(aShapeUids);
	};

	GanttLassoExtension.prototype.onKeydown = function(oEvent) {
		if (this.isLassoDrawing() && oEvent.keyCode === KeyCodes.ESCAPE) {
			this.endLasso(oEvent);
		}
	};

	GanttLassoExtension.prototype.lassoDoms = function() {
		var $svg = jQuery(this.getSvgElement());
        var $lassoArea = $svg.find("g.sapGanttChartLasso");
        var $rowArea = $svg.find("rect.sapGanttBackgroundSVGRow");
		return {
            lassoRect:           $lassoArea.find(".lassoRect"),
            rowArea:             $rowArea,
            lasso:               $lassoArea
		};
	};

	GanttLassoExtension.prototype.getD3Doms = function() {
		var oNode = this._getShapeConnectRootNode();
		return {
            lassoRect: oNode.selectAll(".lassoRect")
		};
	};

	return GanttLassoExtension;
});
