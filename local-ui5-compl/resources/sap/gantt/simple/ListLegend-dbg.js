/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define(["sap/ui/core/Control", "sap/gantt/library", 	"sap/ui/core/delegate/ItemNavigation"], function(Control, library, ItemNavigation) {
	"use strict";

	/**
	 * Constructor for a new List Legend.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class The Legend is a popup window in the GanttChart control wich can be used to display shape/icon-text pairs.
	 * @extends sap.ui.core.Control
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.ListLegend
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ListLegend = Control.extend("sap.gantt.simple.ListLegend", /** @lends sap.gantt.simple.ListLegend.prototype */
	{
		metadata: {
			library: "sap.gantt",
			properties: {
				/**
				 *  Title of Legend. The title is displayed on both the legend page and the legend navigation list. Null if not specified
				 */
				title: {type: "string", group: "Data", defaultValue: null}
			},
			defaultAggregation: "items",
			aggregations: {

				/**
				 * ListLegendItem object aggregation
				 */
				items: {
					type: "sap.gantt.simple.ListLegendItem",
					multiple: true,
					singularName: "item"
				}
			}
		}
	});
	ListLegend.prototype.forceInvalidation = ListLegend.prototype.invalidate;

	ListLegend.prototype.invalidate = function(oSource){
		if (oSource == this) {
			// This case does not happen because the source is only given when propagating to a parent
		} else if (!oSource) {
			// Direct invalidation of the ListLegend; this means a property has been modified
			this.forceInvalidation(); // let invalidation occur
		} else if (oSource instanceof sap.gantt.simple.ListLegendItem) {
			//Do not re-render LegendContainer immediately when dynamic change in ListLegendItem
		}
	};

	ListLegend.prototype.onAfterRendering = function() {
		if (!this._oItemNavigation) {
			this._oItemNavigation = new ItemNavigation(null, null);
			this.addEventDelegate(this._oItemNavigation);
		}
		this._oItemNavigation.setRootDomRef(this.getDomRef());
		var aItems = this.getItems();
		var aDomRefs = [];
		for (var i = 0; i < aItems.length; i++) {
			if (aItems[i].getVisible()) {
				aDomRefs.push(aItems[i].getDomRef());
			}
		}
		this._oItemNavigation.setItemDomRefs(aDomRefs);
		this._oItemNavigation.setFocusedIndex(0);
	};

	ListLegend.prototype.exit = function () {
		this._destroyItemNavigation();
	};

	ListLegend.prototype._destroyItemNavigation = function () {
		if (this._oItemNavigation) {
			this.removeEventDelegate(this._oItemNavigation);
			this._oItemNavigation.destroy();
			this._oItemNavigation = null;
		}
	};

	return ListLegend;

}, true);
