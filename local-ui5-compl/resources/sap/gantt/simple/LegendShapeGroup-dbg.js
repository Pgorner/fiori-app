/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"./BaseGroup", "sap/gantt/simple/LegendShapeGroupOrientation"
], function (BaseGroup, LegendShapeGroupOrientation) {
	"use strict";

	/**
	 * Creates and initializes a new Legend Shape Group class.
	 *
	 * @param {string} [sId] ID of the new control. This is generated automatically, if ID is not provided.
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Legend Shape Group class for accommodating multiple shapes in ListLegendItem.
	 * Only following shapes are allowed: BaseRectangle, BaseDiamod, BaseChevron, BaseCursor, BaseLine, BasePath and BaseImage.
	 *
	 * @extends sap.gantt.simple.BaseShape
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 * @since 1.84
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.LegendShapeGroup
	 */
	var LegendShapeGroup = BaseGroup.extend("sap.gantt.simple.LegendShapeGroup", /** @lends sap.gantt.simple.BaseGroup.prototype */{
		metadata: {
			library: "sap.gantt",
			properties: {
				/**
				 * The orientation on the legend
				 */
				orientation: {type: "sap.gantt.simple.LegendShapeGroupOrientation", defaultValue: LegendShapeGroupOrientation.Vertical},

				/**
				 * The title for multiple shapes rendering
				 */
				title: {type: "string" }
			},
			aggregations: {
				/**
				 * To accommodate multiple shapes
				 */
				shapes: {type: "sap.gantt.simple.BaseShape", multiple: true, singularName: "shape"}
			}
		}
	});

	return LegendShapeGroup;
}, true);
