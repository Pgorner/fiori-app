/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
// Provides class sap.gantt.HighlightModel
sap.ui.define([
	"sap/ui/base/EventProvider"
], function (EventProvider) {
	"use strict";

	/**
	 * Constructs an instance of a sap.gantt.simple.HighlightModel.
	 *
	 * @class
	 * @extends sap.ui.base.EventProvider
	 *
	 * @author SAP SE
	 * @version {version}
	 *
	 * @param {sap.gantt.HighlightMode} [sHighlightMode=Single]
	 *
	 * @constructor
	 * @private
	 * @alias HighlightModel
	 */
	var HighlightModel = EventProvider.extend("sap.gantt.simple.HighlightModel", {

		constructor: function () {
			EventProvider.apply(this, arguments);

			this.sHighlightMode = "Single";

			this.mHighlighted = {
				"uid": {},
				"shapeId": {},
				"deEmphasizedShapeId": {}
			};
		}
	});

	HighlightModel.prototype.getHighlightMode = function() {
		return this.sHighlightMode;
	};

	/**
	 * Updates the highlight model and fires the highlight change event
	 * @param {String} sUid Shape UID.
	 * @param {Object} mParam Paramters to change highlight of the shape
	 */
	HighlightModel.prototype.updateShape = function (sUid, mParam) {
		var deEmphasized = Object.keys(this.mHighlighted.uid);
		if (!sUid) {
			this.clear(false);
			return;
		}
		if (mParam.highlighted && !this.mHighlighted.uid[sUid]) {
			this.mHighlighted.uid = {};
			this._updateHighlightedShape(sUid, mParam);
			this._fireHighlightChanged(deEmphasized);
		} else if (!mParam.highlighted && this.mHighlighted.uid[sUid]) {
			delete this.mHighlighted.uid[sUid];
			this._fireHighlightChanged([sUid]);
		}
	};

	HighlightModel.prototype.updateProperties = function (sUid, mParam, newHighlightedShape) {
		if (this.mHighlighted.uid[sUid]) {
			this.mHighlighted.uid[sUid].time = mParam.time;
			this.mHighlighted.uid[sUid].endTime = mParam.endTime;
		} else if (newHighlightedShape) {
			this._updateHighlightedShape(sUid, mParam);
		}
	};

	HighlightModel.prototype._updateHighlightedShape = function (sUid, mParam) {
		this.mHighlighted.uid[sUid] = {
			shapeUid  : sUid,
			time      : mParam.time,
			endTime   : mParam.endTime
		};
	};

	HighlightModel.prototype.clear = function (bFireChangeEvent) {
		if (this.mHighlighted.uid.length === 0) {
			return false;
		}
		var aUid = this.allUid();
		this.mHighlighted.uid = {};
		this._fireHighlightChanged(aUid, bFireChangeEvent);
		return true;
	};

	HighlightModel.prototype.clearAllHighlightedShapeIds = function() {
        this.mHighlighted.deEmphasizedShapeId  = this.mHighlighted.shapeId;
        this.mHighlighted.shapeId = {};
        var aUid = this.allUid();
        this._fireHighlightChanged(aUid, true, true, true);
    };

	/**
	 * updates Highlight model and fires Highlight change event.
	 * @param {string[]} highlightShapeIds Array of shapeId.
	 * @param {boolean} overrideExisting flag to override existing selection by UID.
	 */
	 HighlightModel.prototype.updateHighlightedShapes = function(highlightShapeIds, overrideExisting) {
		if (!highlightShapeIds || highlightShapeIds.length === 0) {
			this.mHighlighted.shapeId = {};
		}
		if (overrideExisting) {
			this.mHighlighted.uid = {};
			this.mHighlighted.shapeId = {};
		}
		highlightShapeIds.forEach(function(oShape) {
			if (oShape.Highlighted) {
				this.mHighlighted.deEmphasizedShapeId = {};
				if (oShape.ShapeId && !this.mHighlighted.shapeId[oShape.ShapeId]) {
					this.mHighlighted.shapeId[oShape.ShapeId] = {
						highlighted: oShape.Highlighted
					};
				}
			} else if (oShape.ShapeId && this.mHighlighted.shapeId[oShape.ShapeId]) {
					delete this.mHighlighted.shapeId[oShape.ShapeId];
					this.mHighlighted.deEmphasizedShapeId[oShape.ShapeId] = {
						highlighted: oShape.Highlighted
					};
				} else if (oShape.ShapeId && !this.mHighlighted.shapeId[oShape.ShapeId]) {
					this.mHighlighted.deEmphasizedShapeId[oShape.ShapeId] = {
						highlighted: oShape.Highlighted
					};
				}
		}.bind(this));
		this._fireHighlightChanged([], true, true, false);
	};

	//Returns shape Id to be highlighted.
	HighlightModel.prototype.getHighlightedShapeID = function () {
		return Object.keys(this.mHighlighted.shapeId);
	};

	//return shape Id to be de-emphasized
	HighlightModel.prototype.getDeEmphasizedShapeID = function () {
		return  Object.keys(this.mHighlighted.deEmphasizedShapeId);
	};

	HighlightModel.prototype._fireHighlightChanged = function (aDeEmphasizedUid, bSilent, shapeIdChanged, deEmphasizeAll) {
		var mParams = {
			shapeUid: Object.keys(this.mHighlighted.uid),
			deEmphasizedUid: aDeEmphasizedUid,
			silent: !!bSilent,
			deEmphasizeAll: deEmphasizeAll
		};

		if (mParams.shapeUid.length > 0 || mParams.deEmphasizedUid.length > 0 || shapeIdChanged) {
			this.fireHighlightChanged(mParams);
		}
	};

	HighlightModel.prototype.clearHighlightByUid = function (sUid) {
		if (this.existed(sUid)) {
			delete this.mHighlighted.uid[sUid];
		}
	};

	HighlightModel.prototype.existed = function (sUid) {
		return !!this.mHighlighted.uid[sUid];
	};

	HighlightModel.prototype.allUid = function() {
		return Object.keys(this.mHighlighted.uid);
	};

	HighlightModel.prototype.attachHighlightChanged = function(oData, fnFunction, oListener) {
		this.attachEvent("highlightChanged", oData, fnFunction, oListener);
	};

	HighlightModel.prototype.detachHighlightChanged = function(fnFunction, oListener) {
		this.detachEvent("highlightChanged", fnFunction, oListener);
	};

	HighlightModel.prototype.fireHighlightChanged = function(mArguments) {
		this.fireEvent("highlightChanged", mArguments);
		return this;
	};

	return HighlightModel;
}, true /**bExport*/);
