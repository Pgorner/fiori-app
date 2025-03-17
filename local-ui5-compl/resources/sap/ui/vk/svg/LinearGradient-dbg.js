/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides the sap.ui.vk.svg.LinearGradient class.
sap.ui.define([
	"../TransformationMatrix",
	"./Element"
], function(
	TransformationMatrix,
	Element
) {
	"use strict";

	var LinearGradient = function(parameters) {
		parameters = parameters || {};
		Element.call(this, parameters);

		this.type = "LinearGradient";
		this.x1 = parameters.x1;
		this.y1 = parameters.y1;
		this.x2 = parameters.x2;
		this.y2 = parameters.y2;
		this.gradient = parameters.gradient || [];
		this.gradientTransform = parameters.gradientTransform ?
			// need to flip y axis in VIT.
			Element._multiplyMatrices([-1, 0, 0, -1, 0, 0], TransformationMatrix.convert4x3To3x2(parameters.gradientTransform))
			: parameters.gradientTransform;
		this.gradientUnits = "objectBoundingBox";
		// use the center of the object as the origin for linear gradient
		this.transformOrigin = "0.5 0.5";
	};

	LinearGradient.prototype = Object.assign(Object.create(Element.prototype), { constructor: LinearGradient });

	LinearGradient.prototype.tagName = function() {
		return "linearGradient";
	};

	LinearGradient.prototype._setBaseAttributes = function(setAttributeFunc, mask) {
		setAttributeFunc("id", this.uid);
	};

	LinearGradient.prototype._setSpecificAttributes = function(setAttributeFunc) {
		if (this.x1 !== undefined) {
			setAttributeFunc("x1", this.x1);
		}
		if (this.y1 !== undefined) {
			setAttributeFunc("y1", this.y1);
		}
		if (this.x2 !== undefined) {
			setAttributeFunc("x2", this.x2);
		}
		if (this.y2 !== undefined) {
			setAttributeFunc("y2", this.y2);
		}
		if (this.gradientTransform !== undefined) {
			setAttributeFunc("gradientTransform", "matrix(" + this.gradientTransform.join(",") + ")");
			setAttributeFunc("transform-origin", this.transformOrigin);
		}
		if (this.gradientUnits !== undefined) {
			setAttributeFunc("gradientUnits", this.gradientUnits);
		}
	};

	LinearGradient.prototype._renderContent = function(rm) {
		var gradient = this.gradient;
		for (var i = 0, l = gradient.length; i < l; i += 2) {
			rm.openStart("stop");
			rm.attr("offset", gradient[i]);
			rm.attr("stop-color", gradient[i + 1]);
			rm.openEnd();
			rm.close("stop");
		}
	};

	LinearGradient.prototype._createContent = function(domRef) {
		var gradient = this.gradient;
		for (var i = 0, l = gradient.length; i < l; i += 2) {
			var stopDomRef = document.createElementNS(Element._svgNamespace, "stop");
			stopDomRef.setAttribute("offset", gradient[i]);
			stopDomRef.setAttribute("stop-color", gradient[i + 1]);
			domRef.append(stopDomRef);
		}
	};

	LinearGradient.prototype.copy = function(source, recursive) {
		Element.prototype.copy.call(this, source, recursive);

		this.x1 = source.x1;
		this.y1 = source.y1;
		this.x2 = source.x2;
		this.y2 = source.y2;
		this.gradient = source.gradient.slice();
		if (this.gradientUnits !== undefined) {
			this.gradientUnits = source.gradientUnits;
		}
		if (source.gradientTransform !== undefined) {
			this.gradientTransform = source.gradientTransform.slice();
			this.transformOrigin = source.transformOrigin.slice();
		}

		return this;
	};

	return LinearGradient;
});
