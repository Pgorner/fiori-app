sap.ui.define([],
	function() {
		"use strict";

		/**
		 * RatingAndCount renderer.
		 * @namespace
		 */
		var RatingAndCountRenderer = {
			apiVersion: 2
		};

		/**
		 * Renders the HTML for the given control, using the provided
		 * {@link sap.ui.core.RenderManager}.
		 *
		 * @param {sap.ui.core.RenderManager}
		 *            oRm the RenderManager that can be used for writing to the render
		 *            output buffer
		 * @param {sap.ui.demoapps.rta.freestyle.control.RatingAndCount}
		 *            oControl an object representation of the control that should be
		 *            rendered
		 */
		RatingAndCountRenderer.render = function(oRm, oControl) {
			var oRatingCount = oControl.hasListeners("press")
				? oControl.getAggregation("_ratingCountLink")
				: oControl.getAggregation("_ratingCountLabel");

			// if (oControl.getVerticalAdjustment() && oControl.getVerticalAdjustment() !== 0) {
			//   oRm.style("-ms-transform", "translateY(" + oControl.getVerticalAdjustment() + "%)");
			//   oRm.style("-webkit-transform", "translateY(" + oControl.getVerticalAdjustment() + "%)");
			//   oRm.style("transform", "translateY(" + oControl.getVerticalAdjustment() + "%)");
			// }
			// if (oControl.getVerticalAlignContent()) {
			//   oRm.style("line-height", oControl.getIconSize());
			//   oRatingCount.addStyleClass("sapUiRtaTestDemoappControlRatingAndCountVAlign");
			// }

			oRm.openStart("div", oControl); // provides control ID and enables event handling
			oRm.class('sapUiDemoappsDemokitRtaFreestyleRatingAndCount');
			oRm.openEnd();
			oRm.renderControl(oControl.getAggregation("_ratingIndicator"));
			oRm.renderControl(oRatingCount);
			oRm.close("div");
		};
		return RatingAndCountRenderer;
	}
);
