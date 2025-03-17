/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([], function() {
	"use strict";

	/**
	 * Predefined orientations for the {@link sap.gantt.simple.LegendShapeGroup} control.
	 *
	 * @enum {string}
	 * @public
	 * @alias sap.gantt.simple.LegendShapeGroupOrientation
	 * @since 1.84
	 */
	var LegendShapeGroupOrientation = {
		/**
		 * Vertical orientation
		 * @public
		 */
		Vertical: "Vertical",

		/**
		 * Horizontal orientation
		 * @public
		 */
        Horizontal: "Horizontal",

        /**
		 * Overlap orientation
		 * @public
		 */
		Overlap: "Overlap"
	};

	return LegendShapeGroupOrientation;
});