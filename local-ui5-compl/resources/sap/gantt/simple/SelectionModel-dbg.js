/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

// Provides class sap.gantt.ShapeSelectionModel
sap.ui.define([
	"sap/gantt/library",
	"sap/ui/base/EventProvider",
	"./GanttUtils",
	"sap/gantt/misc/Utility",
	"sap/ui/core/Element"
], function (library, EventProvider, GanttUtils, Utility, Element) {
	"use strict";

	var SelectionMode = library.SelectionMode;

	/**
	 * Constructs an instance of a sap.gantt.simple.SelectionModel.
	 *
	 * @class
	 * @extends sap.ui.base.EventProvider
	 *
	 * @author SAP SE
	 * @version {version}
	 *
	 * @param {sap.gantt.SelectionMode} [sSelectionMode=Single]
	 *
	 * @constructor
	 * @private
	 * @alias SelectionModel
	 */
	var SelectionModel = EventProvider.extend("sap.gantt.simple.SelectionModel", /** @lends sap.gantt.ShapeSelectionModel.prototype */ {

		constructor: function (sSelectionMode) {
			EventProvider.apply(this, arguments);

			this.sSelectionMode = sSelectionMode || SelectionMode.Single;

			this.mSelected = {
				"uid": {},
				"shapeId": {},
				"rowId": {},
				"deSelectShapeId":{},
				"deSelectRowId": {}
			};
		}
	});

	SelectionModel.prototype.getSelectionMode = function() {
		return this.sSelectionMode;
	};

	SelectionModel.prototype.setSelectionMode = function(sSelectionMode) {
		this.sSelectionMode = sSelectionMode || SelectionMode.Single;
		return this;
	};

	SelectionModel.prototype.updateShape = function (sUid, mParam,skipFireSelectionChange) {
		var sShapeSelectionMode = this.getSelectionMode();
		if (sShapeSelectionMode === "None") { return; }

		// 1. If sUid is not present, means user clicked on an empty area in the Gantt Chart
		if (!sUid) {
			if (sShapeSelectionMode === SelectionMode.Single ||
				sShapeSelectionMode === SelectionMode.Multiple ||
				sShapeSelectionMode === SelectionMode.MultiWithKeyboard && !mParam.ctrl ||
				sShapeSelectionMode === SelectionMode.MultipleWithLasso ||
				sShapeSelectionMode === SelectionMode.MultiWithKeyboardAndLasso && !mParam.ctrl) {
				// clear all selection and fire selection changed event on following cases
				// 1. Single selection
				// 2. MultiWithKeyboard but w/o ctrl/meta key
				// 3. Multiple
				// 4. MultipleWithLasso
				// 5. MultiWithKeyboardAndLasso but w/o ctrl/meta key
				this.clear(false);
			}
			return; // stop right here
		}

		// 2. Continue process if user clicked on an actual shape
		if (mParam.selected && !this.mSelected.uid[sUid]) {
			// Shall mark as selected but the UID haven't been stored
			var aDeselected = Object.keys(this.mSelected.uid);
			if (this.sSelectionMode === SelectionMode.Single) {
				this.mSelected.uid = {};
			} else if (this.sSelectionMode === SelectionMode.MultiWithKeyboard || this.sSelectionMode === SelectionMode.MultiWithKeyboardAndLasso) {
				// ctrl or meta key has to pressed
				if (mParam.ctrl) {
					aDeselected = [];
				} else {
					this.mSelected.uid = {};
				}
			} else if (this.sSelectionMode === SelectionMode.Multiple || this.sSelectionMode === SelectionMode.MultipleWithLasso) {
				aDeselected = [];
			}
			this._updateSelectedShape(sUid, mParam);
			if (!skipFireSelectionChange){
				this._fireSelectionChanged(aDeselected);
			}
		} else if (!mParam.selected && this.mSelected.uid[sUid]) {
			// click on the same shape to mark it as deselected
			delete this.mSelected.uid[sUid];
			this._updateShapeIdRowIdList(sUid, false);
			if (!skipFireSelectionChange){
				this._fireSelectionChanged([sUid]);
			}
		}
	};

	/**
	 * @private
	 * Updates shapeId and rowId list when deselection done using Uid
	 */
	SelectionModel.prototype._updateShapeIdRowIdList = function (sUid, isRowDeselection) {
		var shapeId = Utility.parseUid(sUid).shapeId,
			rowId = Utility.parseUid(sUid).rowId;
		if (this.mSelected.shapeId[shapeId]) {
			delete this.mSelected.shapeId[shapeId];
			this.mSelected.deSelectShapeId[shapeId] = {
				selected: false
			};
		}
		if (this.mSelected.rowId[rowId] ) {
			if (isRowDeselection) {
				delete this.mSelected.rowId[rowId];
				this.mSelected.deSelectRowId[rowId] = {
					selected: false
				};
			}
		}
	};


	SelectionModel.prototype.updateShapes = function (mShape) {
		if (!mShape) {
			return;
		}

		var aDeselectedShapeUids = [];
		var aKeys = Object.keys(mShape);

		for (var i = 0; i < aKeys.length; i++) {
			var sUid = aKeys[i];
			var mParam = mShape[aKeys[i]];

			if (mParam && mParam.selected && !this.mSelected.uid[sUid]) {
				this._updateSelectedShape(sUid, mParam);
			} else if (mParam && !mParam.selected && this.mSelected.uid[sUid]) {
				delete this.mSelected.uid[sUid];
				this._updateShapeIdRowIdList(sUid, false);
				aDeselectedShapeUids.push(sUid);
			}
		}

		this._fireSelectionChanged(aDeselectedShapeUids);
	};

	SelectionModel.prototype.updateProperties = function (sUid, mParam, newSelectShape) {
		if (this.mSelected.uid[sUid]) {
			this.mSelected.uid[sUid].draggable = mParam.draggable;
			this.mSelected.uid[sUid].time = mParam.time;
			this.mSelected.uid[sUid].endTime = mParam.endTime;
		} else if (newSelectShape) {
			this._updateSelectedShape(sUid, mParam);
		}
	};

	SelectionModel.prototype._updateSelectedShape = function (sUid, mParam) {
		this.mSelected.uid[sUid] = {
			shapeUid  : sUid,
			draggable : mParam.draggable,
			time      : mParam.time,
			endTime   : mParam.endTime
		};
	};

	SelectionModel.prototype._fireSelectionChanged = function (aDeselectedUid, bSilent, shapeIdChanged, deSelectAll) {
		var mParams = {
			shapeUid: Object.keys(this.mSelected.uid),
			deselectedUid: aDeselectedUid,
			silent: !!bSilent,
			deSelectAll: deSelectAll
		};

		if (mParams.shapeUid.length > 0 || mParams.deselectedUid.length > 0 || shapeIdChanged) {
			this.fireSelectionChanged( mParams );
		}
	};

	SelectionModel.prototype.clearSelectionByUid = function (sUid, isRowDeselection) {
		if (this.existed(sUid)) {
			this._updateShapeIdRowIdList(sUid, isRowDeselection);
			delete this.mSelected.uid[sUid];
		} else if (isRowDeselection) {
			this._updateShapeIdRowIdList(sUid, isRowDeselection);
		}
	};

	SelectionModel.prototype.isShapeSelected = function (sUid) {
		var oPart = Utility.parseUid(sUid),
			sShapeID = oPart.shapeId,
			sRowID = oPart.rowId;
		var bSelected = false;
		Object.keys(this.mSelected.uid).forEach(function (sShapeUid) {
			var oShapePart = Utility.parseUid(sShapeUid);
			if (sShapeID === oShapePart.shapeId && sRowID === oShapePart.rowId) {
				bSelected = true;
			}
		});
		return bSelected;
	};

	SelectionModel.prototype.existed = function (sUid) {
		return !!this.mSelected.uid[sUid];
	};

	/**
	 * Clears selected uids, but doesn't fire selectionChanged event to the Gantt chart.
	 *
	 * @param {boolean} bFireChangeEvent if true, the shapeSelectionChange event will be fired.
	 * @return {boolean} true if the shape selection has changed.
	 */
	SelectionModel.prototype.clear = function (bFireChangeEvent) {
		if (this.mSelected.uid.length === 0) {
			return false;
		}

		var aUid = this.allUid();
		this.mSelected.uid = {};
		this.mSelected.shapeId = {};
		this.mSelected.rowId = {};
		this._fireSelectionChanged(aUid, bFireChangeEvent);
		return true;
	};

	SelectionModel.prototype.allUid = function() {
		return Object.keys(this.mSelected.uid);
	};

	// number of selected and draggable shapes
	SelectionModel.prototype.numberOfSelectedDraggableShapes = function() {
		return this.allSelectedDraggableUid().length;
	};

	SelectionModel.prototype.allSelectedDraggableUid = function() {
		return Object.keys(this.mSelected.uid).filter(function (sUid) {
			return this.mSelected.uid[sUid].draggable;
		}.bind(this));
	};

	/**
	 * updates selection model and fires selection change event.
	 * @param {string[]} selectedObjectsId Array of shapeId.
	 * @param {boolean} overrideExisting flag to override existing selection by UID.
	 * @param {string} oGanttId Id of the Gantt.
	 */
	SelectionModel.prototype.updateSelectedShapes = function(selectedObjectsId, overrideExisting, oGanttId) {
		var aUid = [];
		this.mSelected.deSelectRowId = {};
		if (!selectedObjectsId || selectedObjectsId.length === 0) {
			this.mSelected.deSelectShapeId = this.mSelected.shapeId;
			this.mSelected.shapeId = {};
		}
		if (overrideExisting) {
			aUid = this.allUid();
			this.mSelected.uid = {};
			this.mSelected.shapeId = {};
		}
		selectedObjectsId.forEach(function(oShape) {
			if (oShape.Selected) {
				this.mSelected.deSelectShapeId = {};
				if (oShape.ShapeId && !this.mSelected.shapeId[oShape.ShapeId]) {
					this.mSelected.shapeId[oShape.ShapeId] = {
						selected: oShape.Selected
					};
				} else if (oShape.rowId && !this.mSelected.rowId[oShape.rowId]) {
					this.mSelected.rowId[oShape.rowId] = {
						selected: oShape.Selected
					};
				}
			} else if (oShape.ShapeId && this.mSelected.shapeId[oShape.ShapeId]) {
					delete this.mSelected.shapeId[oShape.ShapeId];
					this.mSelected.deSelectShapeId[oShape.ShapeId] = {
						selected: oShape.Selected
					};
				} else if (oShape.ShapeId && !this.mSelected.shapeId[oShape.ShapeId]) {
					this.mSelected.deSelectShapeId[oShape.ShapeId] = {
						selected: oShape.Selected
					};
				} else if (oShape.rowId && this.mSelected.rowId[oShape.rowId]) {
					delete this.mSelected.rowId[oShape.rowId];
					this.mSelected.deSelectRowId[oShape.rowId] = {
						selected: oShape.Selected
					};
				} else if (oShape.rowId && !this.mSelected.rowId[oShape.rowId]) {
					this.mSelected.deSelectRowId[oShape.rowId] = {
						selected: oShape.Selected
					};
				}
		}.bind(this));
		if (selectedObjectsId.length > 0) {
			var aUpdatedUid = [];
			Object.keys(this.mSelected.deSelectShapeId).forEach(function(shapeId){
				var shapeDomRef = document.querySelectorAll("[id='" + oGanttId + "'] [data-sap-gantt-shape-id='" + shapeId + "']")[0],
					shapeObj = Element.getElementById(shapeDomRef && shapeDomRef.id);
				aUpdatedUid.push(shapeObj && shapeObj.getShapeUid());
			});
			aUid = aUpdatedUid ? aUpdatedUid : aUid;
		}
		this._fireSelectionChanged(aUid, true, true, false );
	};

	/**
	 * Clear all shapeId and fires selection change event.
	 */
	SelectionModel.prototype.clearAllSelectedShapeIds = function() {
		this.mSelected.deSelectShapeId  = this.mSelected.shapeId;
		this.mSelected.deSelectRowId = this.mSelected.rowId;
		this.mSelected.shapeId = {};
		this.mSelected.rowId = {};
		var aUid = this.allUid();
		this.mSelected.uid = {};
		this._fireSelectionChanged(aUid, true, true, true  );
	};

	//Returns list of shape Ids to be selected.
	SelectionModel.prototype.getSelectedShapeIDS = function () {
		return Object.keys(this.mSelected.shapeId);
	};

	//Returns list of rowIds to be selected.
	SelectionModel.prototype.getSelectedRowIDS = function () {
		return Object.keys(this.mSelected.rowId);
	};

	//return list of shapeIds to be deselected
	SelectionModel.prototype.getDeSelectedShapeIDS = function () {
		return  Object.keys(this.mSelected.deSelectShapeId);
	};

	//returns list of rowIds to be deselected.
	SelectionModel.prototype.getDeSelectedRowIDS = function () {
		return Object.keys(this.mSelected.deSelectRowId);
	};

	//Add/Remove shapeId to shape selection model.
	SelectionModel.prototype.updateShapeId = function (shapeId, select) {
		if (select) {
			if (!this.mSelected.shapeId[shapeId]) {
				this.mSelected.shapeId[shapeId] = {
					selected: select
				};
			}
			if (this.mSelected.deSelectShapeId[shapeId]) {
				delete this.mSelected.deSelectShapeId[shapeId];
			}
		} else {
			if (this.mSelected.shapeId[shapeId]) {
				delete this.mSelected.shapeId[shapeId];
			}
			if (!this.mSelected.deSelectShapeId[shapeId]) {
				this.mSelected.deSelectShapeId[shapeId] = {
					selected: select
				};
			 }
		}

	};

	//Clear Deselection Model By shapeID. Requires while selection shape by UID
	SelectionModel.prototype.clearDeselectionModelById = function (shapeID) {
		if (this.mSelected.deSelectShapeId[shapeID]) {
			delete this.mSelected.deSelectShapeId[shapeID];
		}
	};

	SelectionModel.prototype.getSelectedShapeDataByUid = function(sUid) {
		return this.mSelected.uid[sUid];
	};

	SelectionModel.prototype.attachSelectionChanged = function(oData, fnFunction, oListener) {
		this.attachEvent("selectionChanged", oData, fnFunction, oListener);
	};

	SelectionModel.prototype.detachSelectionChanged = function(fnFunction, oListener) {
		this.detachEvent("selectionChanged", fnFunction, oListener);
	};

	SelectionModel.prototype.fireSelectionChanged = function(mArguments) {
		this.fireEvent("selectionChanged", mArguments);
		return this;
	};

	return SelectionModel;

}, true /**bExport*/);
