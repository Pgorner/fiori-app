/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

// Provides control sap.gantt.simple.GanttRowSettings
sap.ui.define([
	"sap/base/util/uid",
	"sap/ui/table/RowSettings",
	"./AggregationUtils",
	"./RenderUtils",
	"sap/gantt/misc/Utility"
], function(uid, TableRowSettings, AggregationUtils, RenderUtils, Utility) {
	"use strict";

	/**
	 * Creates and initializes a new GanttRowSettings class
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSetting] Initial settings for the new control
	 *
	 * @class
	 * Enables users to define a shape aggregation name of their own.
	 *
	 * @extends sap.ui.table.RowSettings
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.GanttRowSettings
	 */
	var GanttRowSettings = TableRowSettings.extend("sap.gantt.simple.GanttRowSettings", /** @lends sap.gantt.simple.GanttRowSettings.prototype */{
		metadata: {
			library: "sap.gantt",
			properties: {
				rowId: {type: "string"}
			},
			defaultAggregation : "shapes1",
			aggregations: {

				/**
				 * The controls for the calendars.
				 */
				calendars: {type : "sap.gantt.simple.BaseCalendar", multiple : true, singularName : "calendars"},
				/**
				 * @since 1.91
				 * The controls for the calendars.
				 */
				 calendars1: {type : "sap.gantt.simple.BaseCalendar", multiple : true, singularName : "calendar1"},
				 /**
				  * @since 1.91
				 * The controls for the calendars.
				 */
				calendars2: {type : "sap.gantt.simple.BaseCalendar", multiple : true, singularName : "calendar2"},
				/**
				 * @since 1.91
				 * The controls for the calendars.
				 */
				 calendars3: {type : "sap.gantt.simple.BaseCalendar", multiple : true, singularName : "calendar3"},
				 /**
				  * @since 1.91
				 * The controls for the calendars.
				 */
				calendars4: {type : "sap.gantt.simple.BaseCalendar", multiple : true, singularName : "calendar4"},
				/**
				 * @since 1.91
				 * The controls for the calendars.
				 */
				 calendars5: {type : "sap.gantt.simple.BaseCalendar", multiple : true, singularName : "calendar5"},

				/**
				 * The controls for the relationships.
				 */
				relationships: {type: "sap.gantt.simple.Relationship", multiple: true, singularName: "relationship"},

				/**
				 * The controls for the shapes.
				 */
				shapes1 : {type : "sap.gantt.simple.BaseShape", multiple : true, singularName : "shape1"},

				/**
				 * The controls for the shapes.
				 */
				shapes2 : {type : "sap.gantt.simple.BaseShape", multiple : true, singularName : "shape2"},

				/**
				 * The controls for the shapes.
				 */
				shapes3 : {type : "sap.gantt.simple.BaseShape", multiple : true, singularName : "shape3"},

				/**
				 * The controls for the shapes.
				 */
				shapes4 : {type : "sap.gantt.simple.BaseShape", multiple : true, singularName : "shape4"},

				/**
				 * The controls for the shapes.
				 */
				shapes5 : {type : "sap.gantt.simple.BaseShape", multiple : true, singularName : "shape5"},
				/**
				 * The control for the pseudo shapes.
				 * @private since 1.120
				 */
				pseudoShapes : {type : "sap.gantt.simple.BasePseudoShape", multiple : true, singularName : "pseudoShape", visibility: "hidden"},
				/**
				 * Pseudo shape template
				 * @private since 1.120
				 */
				pseudoShapeTemplate : {type : "sap.gantt.simple.MultiActivityGroup", multiple : false, visibility: "hidden"},
				/**
				 * @since 1.120
				 * The control for the gantt overlay.
				*/
				overlays1: {type : "sap.gantt.overlays.GanttRowOverlay", sapGanttLazy: true},

				/**
				 * @since 1.120
			     * The control for the gantt overlay.
				*/
				overlays2: {type : "sap.gantt.overlays.GanttRowOverlay", sapGanttLazy: true},
				/**
				 * @since 1.120
				 * The control for the gantt overlay.
				*/
				overlays3: {type : "sap.gantt.overlays.GanttRowOverlay", sapGanttLazy: true},
				/**
				 * @since 1.120
				 * The control for the gantty overlay.
				*/
				overlays4: {type : "sap.gantt.overlays.GanttRowOverlay", sapGanttLazy: true},
				/**
				 * @since 1.120
				 * The control for the gantt overlay.
				*/
				overlays5: {type : "sap.gantt.overlays.GanttRowOverlay", sapGanttLazy: true}
			},
			designtime: "sap/ui/dt/designtime/notAdaptable.designtime"
		}
	});
	/**
	 * @private
	 */
	GanttRowSettings.prototype.getPseudoShapes = function() {
		return this.getAggregation("pseudoShapes") ? this.getAggregation("pseudoShapes") : [];
	};
	/**
	 * @private
	 */
	GanttRowSettings.prototype.getPseudoShapeTemplate = function() {
		return this.getAggregation("pseudoShapeTemplate");
	};
	GanttRowSettings.prototype.getAllExpandableShapes = function(oGantt) {
		var rowIndex =  this.getParent() && this.getParent().getIndex();
		var aAllShapes = [], bPseudoShapesDisplayed = oGantt && oGantt.oOverlapShapeIds && oGantt.oOverlapShapeIds[rowIndex] && oGantt.oOverlapShapeIds[rowIndex].length > 0;
		this._mapAllShapes(function(aShapes){
			if (bPseudoShapesDisplayed){
				if (aShapes != null  && aShapes.length > 0 ) {
					aShapes.forEach(function(shape){
						if (oGantt.oOverlapShapeIds[rowIndex].indexOf(shape.getShapeId()) > -1 && shape.getExpandable()){
							aAllShapes.push(shape);
						}
					});
				}
			} else if (aShapes != null  && aShapes.length > 0 && aShapes[0].getExpandable()) {
				aAllShapes.push(aShapes);
			}
		}, oGantt);
		return [].concat.apply([], aAllShapes);
	};

	GanttRowSettings.prototype._mapAllShapes = function(fnTransformer, oGantt) {
		var mAggregations = AggregationUtils.getAllNonLazyAggregations(this);
		var aShapeRenderOrder = oGantt && oGantt._aShapeRenderOrder ? oGantt._aShapeRenderOrder : Object.keys(mAggregations);
		aShapeRenderOrder.map(function(sName){
			if (mAggregations.hasOwnProperty(sName)) {
				var oAggregation = mAggregations[sName];
				fnTransformer(this[oAggregation._sGetter]());
			}
		}.bind(this));
	};

	GanttRowSettings.prototype.getParentGantt = function() {
		return AggregationUtils.getParentControlOf("sap.gantt.simple.GanttChartWithTable", this);
	};

	//Function to return the Table Row Instance from the GanttRowSettings.
	GanttRowSettings.prototype.getParentRow = function() {
		return AggregationUtils.getParentControlOf("sap.ui.table.Row", this);
	};

	GanttRowSettings.prototype.getShapeUid = function(oShape) {
		// if can't find property binding, then calculated it
		var sShapeId = oShape.getShapeId();
		if (!sShapeId) {
			sShapeId = uid();
			oShape.setProperty("shapeId", sShapeId, true);
		}
		var sSchemeKey = oShape.getScheme(),
			sRowUid = this.getRowUid(sSchemeKey);

		var sBindingContextPath = this.getShapeBindingContextPath(oShape);

		var shapeUid = sRowUid + "|DATA:" + sBindingContextPath + "[" + sShapeId + "]";
		return shapeUid;
	};

	/**
	 * Try to find the binding path from shape instance
	 *
	 * @private
	 * @param {object} oShape any shape
	 * @return {string} binding path
	 */
	GanttRowSettings.prototype.getShapeBindingContextPath = function(oShape) {
		var sModelName = this.getBindingModelName();

		var oBindingContext = oShape.getBindingContext(sModelName);
		if (oBindingContext == null) {
			// try again to find parent binding context
			oBindingContext = this.getBindingContextFromParent(oShape);
		}

		if (oBindingContext) {
			return oBindingContext.getPath();
		}

		return "";
	};

	GanttRowSettings.prototype.getBindingModelName = function(){
		var oBindingInfo = this._getRow().getParent().getBindingInfo("rows");
		return oBindingInfo.model;
	};

	GanttRowSettings.prototype.getBindingContextFromParent = function(oShape, sModelName) {
		var oParent = oShape.getParent();
		var oBindingContext;
		while (oParent) {
			oBindingContext = oParent.getBindingContext(sModelName);
			if (oBindingContext) {
				return oBindingContext;
			} else {
				oParent = oParent.getParent();
			}
		}
		return oBindingContext;
	};

	GanttRowSettings.prototype.getRowUid = function(sSchemeKey, iIndex) {
		var sRowId = this.getRowId();
		if (sRowId == null) {
			return null;
		}
		if (!sSchemeKey) {
			sSchemeKey = this.getParentGantt().getPrimaryShapeScheme().getKey();
		}
		if (iIndex === undefined) {
			iIndex = this.getParentRow() ? this.getParentRow().getIndex() : 0;
		}
		return "PATH:" + sRowId + "|SCHEME:" + sSchemeKey + "[" + iIndex + "]";
	};

	GanttRowSettings.prototype.renderElement = function(oRm, oGantt) {
		RenderUtils.renderInlineShapes(oRm, this, oGantt);
	};

	GanttRowSettings.prototype.invalidate = function(oOrigin) {
		// whenever RowSettings is invalidate, it must be caused by the binding context on the row or
		// binding property value has changed, obviousely the Gantt need to rerender to reflect the changes
		return this._invalidateInnerGanttIfNeeded();
	};

	GanttRowSettings.prototype._invalidateInnerGanttIfNeeded = function() {
		var oRow = this._getRow();
		// Row --(parent)-> Table --(parent)-> GanttChartWithTable --(child aggre)--> InnerGantt
		Utility.safeCall(oRow, ["getParent", "getParent", "getInnerGantt", "invalidate"]);
		return this;
	};

	GanttRowSettings.prototype._onRowExpandToggle = function(oExpandInfo) {
		if (!oExpandInfo) {
			return;
		}

		if (this._oRowExpandInfo && (this._oRowExpandInfo.expanded === oExpandInfo.expanded && this._oRowExpandInfo.pseudoShapeExpand === oExpandInfo.pseudoShapeExpand)) {
			return;
		}

		this._oRowExpandInfo = oExpandInfo;

		if (this._isExpanded()) {
			this._handleEvent(new jQuery.Event("RowExpanded"));
		} else {
			this._handleEvent(new jQuery.Event("RowCollapsed"));
		}
	};

	GanttRowSettings.prototype._isExpanded = function() {
		return this._oRowExpandInfo && (this._oRowExpandInfo.expanded && !this._oRowExpandInfo.pseudoShapeExpand);
	};

	GanttRowSettings.prototype.clone = function () {
		var oClone = TableRowSettings.prototype.clone.call(this);
		oClone._oRowExpandInfo = this._oRowExpandInfo;

		return oClone;
	};

	return GanttRowSettings;
});
