/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"./BaseShape", "./RenderUtils", "./BaseText"
], function (BaseShape, RenderUtils, BaseText) {
	"use strict";

	/**
	 * Creates and initializes a new BasePath class.
	 *
	 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * BasePath is the generic element to define a shape. All the basic shapes can be created by BasePath
	 *
	 * @extends sap.gantt.simple.BaseShape
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.BasePath
	 */
	var BasePath = BaseShape.extend("sap.gantt.simple.BasePath", /** @lends sap.gantt.simple.BasePath.prototype */ {
		metadata: {
			library: "sap.gantt",
			properties: {
				/**
				 * The d property provides a path definition to be drawn.
				 */
				d: {type: "string"}
			}
		},
		renderer: {
			apiVersion: 2    // enable in-place DOM patching
		}
	});

	var mAttributes = ["d", "fill", "stroke-dasharray", "transform", "style", "opacity"];

	/**
	 * Renders the <path> DOM element by RenderManager
	 *
	 * @param {sap.ui.core.RenderManager} oRm A shared RenderManager for GanttChart control
	 * @param {sap.gantt.simple.BasePath} oElement Path to be rendered
	 * @public
	 */
	BasePath.prototype.renderElement = function(oRm, oElement) {
		this.writeElementData(oRm, "path", true);
		if (this.aCustomStyleClasses) {
			this.aCustomStyleClasses.forEach(function(sClass){
				oRm.class(sClass);
			});
		}
		RenderUtils.renderAttributes(oRm, oElement, mAttributes);
		oRm.attr("shape-rendering", "crispedges");
		oRm.openEnd();
		RenderUtils.renderTooltip(oRm, oElement);
		if (this.getShowAnimation()) {
			RenderUtils.renderElementAnimation(oRm, oElement);
		}
		oRm.close("path");

		RenderUtils.renderElementTitle(oRm, oElement, function (mTextSettings) {
			return new BaseText(mTextSettings);
		});
	};

	return BasePath;
}, true);
