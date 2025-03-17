/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(
	[
		"sap/ui/core/Element",
        "sap/gantt/simple/BaseShape"
	],
	function (Element,BaseShape) {
		"use strict";
		/**
		 * Creates and initializes a new Overlay class.
		 *
		 * @param {string} [sId] ID of the new control, generated automatically if an ID is not provided.
		 *
		 * @class
		 * The Overlay class contains a shape aggregation to draw any Gantt 2.0 supported shapes as an overlay
		 * at specific time points in the chart area.
		 *
		 * @extends sap.ui.core.Element
		 *
		 * @author SAP SE
		 * @version 1.132.0
		 * @since 1.120
		 *
		 * @constructor
		 * @public
		 * @alias sap.gantt.overlays.Overlay
		 */
		var Overlay = BaseShape.extend(
			"sap.gantt.overlays.Overlay",
			/** @lends sap.gantt.overlays.Overlay.prototype */ {
				metadata: {
					library: "sap.gantt",
					aggregations: {
						/**
						* @since 1.120
						* The control for the shape defined within the overlay.
						*/
						shape: { type: "sap.gantt.simple.BaseShape", multiple: false }
					},
					properties: {
						/**
						* @since 1.120
						* level defined for an overlay shape that is to be added on the expansion of a row.
						*/
						overlayLevel: { type: "int", defaultValue: 1 },
						/**
						* @since 1.120
						* shape id for an overlay shape that is to be added on the expansion of a row, this is valid for the shape bound overlay.
						* this id should match with the shape id that must be associated.
						* this property has precedence over "overlayLevel" property incase of shape bound overlay.
						*/
						overlayShapeId: {type: "string"}
					},
					defaultAggregation: "shape"
				},
				renderer: {
					apiVersion: 2    // enable in-place DOM patching
				}
			}
		);
		return Overlay;
	},
	true
);