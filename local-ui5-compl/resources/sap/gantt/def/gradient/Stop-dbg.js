/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"../DefBase"
], function (DefBase) {
	"use strict";

	/**
	 * Creates and initializes a gradient stop defined for later reuse.
	 *
	 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Gradient stop defined by SVG tag 'stop'.
	 *
	 * @extends sap.gantt.def.DefBase
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.def.gradient.Stop
	 */
	var Stop = DefBase.extend("sap.gantt.def.gradient.Stop", /** @lends sap.gantt.def.gradient.Stop.prototype */ {
		metadata : {
			library: "sap.gantt",
			properties: {

				/**
				 * Attribute 'offset' of SVG tag 'stop'.
				 */
				offSet: {type: "string", defaultValue: "5%"},

				/**
				 * Property 'stop-color' of SVG tag 'stop'.
				 */
				stopColor: {type: "sap.gantt.ValueSVGPaintServer", defaultValue: "#FFFFFF"},

				/**
				 * This is the 'stop-opacity' property of the scalable vector graphics' 'stop' tag.
				 * @since 1.121
				 */
				stopOpacity: {type: "float", defaultValue: 1}

			}
		}
	});

	Stop.prototype.getDefString = function () {
		return "<stop id='" + this.getId() +
			"' offset='" + this.getOffSet() +
			"' stop-color='" + this.getStopColor() +
			"' stop-opacity='" + this.getStopOpacity() + "' />";
	};

	return Stop;
}, true);
