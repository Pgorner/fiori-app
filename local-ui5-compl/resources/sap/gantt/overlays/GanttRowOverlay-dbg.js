/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(
	[
		"sap/ui/core/Element"
	],
	function (Element) {
		"use strict";
		/**
		 * Creates and initializes a new GanttRowOverlay class.
		 *
		 * @param {string} [sId] ID of the new control, generated automatically if an ID is not provided.
		 *
		 * @class
		 * The GanttRowOverlay class contains staticOverlay and expanded aggregations that are of type Overlay.
		 *
		 * @extends sap.ui.core.Element
		 *
		 * @author SAP SE
		 * @version 1.132.0
		 * @since 1.120
		 *
		 * @constructor
		 * @public
		 * @alias sap.gantt.overlays.GanttRowOverlay
		 */
		var GanttRowOverlay = Element.extend(
			"sap.gantt.overlays.GanttRowOverlay",
			/** @lends sap.gantt.overlays.GanttRowOverlay.prototype */ {
				metadata: {
					library: "sap.gantt",
					aggregations: {
						/**
						* @since 1.120
						* Aggregation to define overlay(s) when a row is collapsed or does not have expand scenario.
						*/
						staticOverlay: { type: "sap.gantt.overlays.Overlay", multiple: true, singularName: "staticOverlay"},

						/**
						* @since 1.120
						* Aggregation to define overlay(s) when a row is expanded.
						*/
						expandedOverlay: { type: "sap.gantt.overlays.Overlay", multiple: true, singularName: "expandedOverlay" }

					},
					defaultAggregation: "staticOverlay"
				},
				renderer: {
					apiVersion: 2    // enable in-place DOM patching
				}
			}
		);

		GanttRowOverlay.prototype.init = function () {
			if (!this._oLocalBindingInfo) {
				this._oLocalBindingInfo = {};
			}

			Element.prototype.init.apply(this, arguments);
		};

		GanttRowOverlay.prototype.setParent = function (oParent) {
			if (oParent) {
				oParent.addEventDelegate({
					onRowExpanded: () => this.setExpanded(true),
					onRowCollapsed: () => this.setExpanded(false)
				}, this);

				this.setExpanded(oParent._isExpanded());
			}

			Element.prototype.setParent.apply(this, arguments);
		};

		GanttRowOverlay.prototype.setExpanded = function (bExpanded) {
			this._bExpanded = bExpanded;

			if (this._bExpanded) {
				this.unbindAggregation("staticOverlay");
				this.bindAggregation("expandedOverlay");
			} else {
				this.unbindAggregation("expandedOverlay");
				this.bindAggregation("staticOverlay");
			}
		};

		GanttRowOverlay.prototype.getActiveOverlays = function () {
			if (this._bExpanded) {
				return this.getAggregation("expandedOverlay");
			} else {
				return this.getAggregation("staticOverlay");
			}
		};

		GanttRowOverlay.prototype.unbindAggregation = function (sName) {
			var oBindingInfo = this.getBindingInfo(sName);

			if (oBindingInfo && this._oLocalBindingInfo) {
				this._oLocalBindingInfo[sName] = oBindingInfo;
			}

			Element.prototype.unbindAggregation.apply(this, [sName]);
		};

		GanttRowOverlay.prototype.bindAggregation = function (sName, oBindingInfo) {
			if (!oBindingInfo && this._oLocalBindingInfo) {
				oBindingInfo = this._oLocalBindingInfo[sName];
			}

			if (oBindingInfo) {
				Element.prototype.bindAggregation.apply(this, [sName, oBindingInfo]);
			}
		};

		GanttRowOverlay.prototype.clone = function () {
			var oClone = Element.prototype.clone.call(this);

			oClone._oLocalBindingInfo = {};

			if (this._oLocalBindingInfo !== undefined) {
				const staticInfo = this._oLocalBindingInfo["staticOverlay"];
				const expandedInfo = this._oLocalBindingInfo["expandedOverlay"];

				if (staticInfo) {
					oClone._oLocalBindingInfo["staticOverlay"] = Object.assign({}, staticInfo);
				}

				if (expandedInfo) {
					oClone._oLocalBindingInfo["expandedOverlay"] = Object.assign({}, expandedInfo);
				}
			}

			oClone._bExpanded = this._bExpanded;

			oClone.unbindAggregation("staticOverlay");
			oClone.unbindAggregation("expandedOverlay");

			return oClone;
		};


		return GanttRowOverlay;
	},
	true
);