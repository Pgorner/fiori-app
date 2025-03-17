/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"./BaseShape", "./AggregationUtils", "./RenderUtils" , "sap/gantt/library"
], function (BaseShape, AggregationUtils, RenderUtils, library) {
	"use strict";
	var ShapeAlignment = library.simple.shapes.ShapeAlignment;
	/**
	 * Creates and initializes a new Group class.
	 *
	 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Group shape class using SVG tag 'g'. It is a shape container. Any other shapes can be aggregated under a group.
	 *
	 * @extends sap.gantt.simple.BaseShape
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.BaseGroup
	 */
	var BaseGroup = BaseShape.extend("sap.gantt.simple.BaseGroup", /** @lends sap.gantt.simple.BaseGroup.prototype */{
		metadata: {
			library: "sap.gantt",
			aggregations: {
				/**
				 * The shapes of the group
				 */
				shapes: {type: "sap.gantt.simple.BaseShape", multiple: true, singularName: "shape"}
			}
		},
		renderer: {
			apiVersion: 2    // enable in-place DOM patching
		}
	});

	var mAttributes = ["filter", "opacity", "transform"];

	/**
	 * Renders the container with RenderManager recursively
	 *
	 * @param {sap.ui.core.RenderManager} oRm A shared RenderManager for GanttChart control
	 * @param {sap.gantt.simple.BaseGroup} oGroup Group to be rendered
	 * @protected
	 */
	BaseGroup.prototype.renderElement = function(oRm, oGroup) {
		this.writeElementData(oRm, "g", false);
		var oGantt = this.getGanttChartBase();
		var y = 0,
			iRowStrokeDensity = 1;
		if (this.aCustomStyleClasses) {
			this.aCustomStyleClasses.forEach(function(sClass){
				oRm.class(sClass);
			});
		}
		RenderUtils.renderAttributes(oRm, oGroup, mAttributes);
		//Alignment of Shape on the Y Axis based on AlignShape. Use Transform to set YCord as x/y not supported on g Tag
		if (oGroup.getParent() && oGroup.getParent().isA("sap.gantt.simple.GanttRowSettings")) {
			oGroup.getParent().getParentGantt().getInnerGantt().attachEvent("_afterGanttRendered", function () {
				var oGroupDomRef = document.getElementById(this.getId());
				if (oGroupDomRef) {
					if (this.getAlignShape() == ShapeAlignment.Top) {
						y = -((this._iBaseRowHeight - oGroupDomRef.getBBox().height) / 2) + iRowStrokeDensity;
					} else if ( this.getAlignShape() == ShapeAlignment.Bottom) {
						y = (this._iBaseRowHeight - oGroupDomRef.getBBox().height) / 2 - iRowStrokeDensity;
					}
					if (y) {
						y = parseInt(y);
						oGroupDomRef.style.transform = "translate(0, " + y + "px)";
					} else {
						oGroupDomRef.style.transform = "none";
					}
				}
			}.bind(oGroup));
		}

		oRm.openEnd();

		RenderUtils.renderTooltip(oRm, oGroup);
		if (oGantt && oGantt.getSelectOnlyGraphicalShape()) {
			this.renderChildElementsInGroups(oRm, oGroup);
		} else {
			this.renderChildElements(oRm, oGroup);
		}

		if (this.getShowAnimation()) {
			RenderUtils.renderElementAnimation(oRm, oGroup);
		}
		oRm.close("g");

		// this is a must have for expand shapes
		BaseShape.prototype.renderElement.apply(this, arguments);
	};

	/**
	 * Render oGroup's all non lazy aggregations with RenderManager, ignore lazy aggregations, all the non lazy aggregation hould not have it's own sap-ui-id,
	 * and have the same rowYCenter with it's parent.
	 *
	 * @param {sap.ui.core.RenderManager} oRm A shared RenderManager for GanttChart control
	 * @param {sap.gantt.simple.BaseGroup} oGroup Group to be rendered
	 * @private
	 */
	BaseGroup.prototype.renderChildElements = function (oRm, oGroup) {
        this._eachChildOfGroup(oGroup, function (oChild) {
            // Check for childElement visibility
            // all non lazy aggregation defined in Group should not have it's own sap-ui-id
            // set childElement to true to supress when write element data
            if (oChild instanceof sap.gantt.simple.BaseConditionalShape && oChild.getVisible()) {
                oChild = oChild._getActiveShapeElement();
            }

            if (oChild && oChild.renderElement && oChild.getVisible()) {
                oChild.setProperty("childElement", true, true);

                // non lazy aggregation has the same rowYCenter with it's parent
                oChild.setProperty("rowYCenter", oGroup.getRowYCenter(), true);
                oChild._iBaseRowHeight = oGroup._iBaseRowHeight;
                oChild.renderElement(oRm, oChild);
            }
        });
    };

	BaseGroup.prototype.renderChildElementsInGroups = function (oRm, oGroup) {
		this._eachChildOfGroup(oGroup, function (labelGroup,nonLabelGroup) {
			if (nonLabelGroup && nonLabelGroup.length > 0){
				if (labelGroup && labelGroup.length > 0){
					oRm.openStart("g", this.getId() + "-nonLabelGroup");
					oRm.openEnd();
				}
				this._renderGroups(nonLabelGroup, oGroup,oRm);
				if (labelGroup && labelGroup.length > 0){
					oRm.close("g");
				}
			}
			if (labelGroup && labelGroup.length > 0){
				this._renderGroups(labelGroup, oGroup,oRm);
			}
		}.bind(this));
	};

	BaseGroup.prototype._eachChildOfGroup = function(oGroup, fnCallback) {
		AggregationUtils.eachNonLazyAggregation(oGroup, fnCallback);
	};

	BaseGroup.prototype._renderGroups = function (groupElements, oGroup, oRm) {
        var lent = groupElements.length;
        for (var i = 0; i < lent; i++) {
            var obj = groupElements[i];
            if (obj instanceof sap.gantt.simple.BaseConditionalShape && obj.getVisible()) {
                obj = obj._getActiveShapeElement();
            }

            if (obj && obj.renderElement && obj.getVisible()) {
                obj.setProperty("childElement", true, true);
                obj.setProperty("rowYCenter", oGroup.getRowYCenter(), true);
                obj._iBaseRowHeight = oGroup._iBaseRowHeight;
                obj.renderElement(oRm, obj);
            }
        }
    };

	return BaseGroup;
}, true);
