/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Element",
	"sap/gantt/library"], function(Element){
	"use strict";

	/**
	 * Constructor for a new <code>ShapeStyle</code>
	 *
	 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * <p>
	 * class handles style properties for shapes.
	 * Different styles can be defined for different event states.
	 * </p>
	 *
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 * @since 1.130
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.ShapeStyle
	 */
	var ShapeStyle = Element.extend("sap.gantt.simple.ShapeStyle", {
		metadata: {
			library: "sap.gantt",
			properties: {
                /**
                 * The name of the Shape style.
				 * This is a mandatory field.
				 * The name should be unique.
				 * @since 1.130
                 */
                name: {type: "string"},
				/**
				*	This property defines the event for which the style should be applied. This is a mandatory field.
				*	For example, if the eventState is "dragDrop", the style is applied to ghost image of shape on drag.
				*	@since 1.130
				*/
				eventState: {type: "sap.gantt.simple.shapeEventType"},
				/**
				 * The stroke property is a presentation property defining the color (or any SVG paint servers like gradients or patterns) used to paint the outline of the shape.
				 * @since 1.130
				 */
				stroke: {type : "sap.gantt.ValueSVGPaintServer"},

				/**
				 * The strokeWidth property is a presentation property defining the width of the stroke to be applied to the shape.
				 * @since 1.130
				 */
				strokeWidth: {type: "float", defaultValue: 1},

				/**
				 * The strokeDasharray property is a presentation property defining the pattern of dashes and gaps used to paint the outline of the shape.
				 * @since 1.130
				 */
				strokeDasharray: {type: "string"},
                /**
				 * For shapes and text, the fill property is a presentation attribute that defines the color (or any SVG paint server like gradients or patterns)
				 * @since 1.130
				 */
				fill: {type : "sap.gantt.ValueSVGPaintServer"},
				/**
				 * Text color property.
				 * @since 1.130
				 */
                textFill: {type : "sap.gantt.ValueSVGPaintServer"},
				/**
				 * Visibility of the shape.
				 * @since 1.130
				 */
                visible: {type: "boolean", defaultValue: true}
			}
		}
	});

	return ShapeStyle;

}, /**bExport*/true);
