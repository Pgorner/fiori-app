/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides the sap.ui.vk.svg.SvgImage class.
sap.ui.define([
	"./Element"
], function(
	Element
) {
	"use strict";

	var SvgImage = function(parameters) {
		parameters = parameters ?? {};
		Element.call(this, parameters);

		this.type = "SvgImage";
		this.x = parameters.x ?? 0;
		this.y = parameters.y ?? 0;
		this.width = parameters.width ?? 0;
		this.height = parameters.height ?? 0;
		this.sceneId = parameters.sceneId;
		this.imageId = parameters.imageId;
		this.data = parameters.data || "";
	};

	SvgImage.prototype = Object.assign(Object.create(Element.prototype), { constructor: SvgImage });

	SvgImage.prototype.tagName = function() {
		return "image";
	};

	SvgImage.prototype.getImageId = function() {
		return this.imageId;
	};

	SvgImage.prototype.setImageData = function(data) {
		this.data = data;
		this.invalidate();
	};

	SvgImage.prototype.render = function(rm, mask, viewport) {
		const renderForView = viewport.getCurrentView() != null;

		if (this.width == 0 || this.height == 0) {
			return;
		}

		if (this.isVisible(mask) && (this.parent == null || this.parent.isVisible(renderForView ? this.parent.vMask : this.parent.sMask))) {
			Element.prototype.render.call(this, rm, mask, viewport);
		}
	};

	SvgImage.prototype._setSpecificAttributes = function(setAttributeFunc, domRef) {
		if (this.x) {
			setAttributeFunc("x", this.x);
		}
		if (this.y) {
			setAttributeFunc("y", this.y);
		}
		if (this.width) {
			setAttributeFunc("width", this.width);
		}
		if (this.height) {
			setAttributeFunc("height", this.height);
		}

		if (domRef) {
			domRef.setAttribute("href", this.data || "");
		} else {
			setAttributeFunc("href", this.data || "");
		}
	};

	SvgImage.prototype.setDimensions = function(width, height) {
		const invalidate = width !== this.width || height !== this.height;
		this.width = width;
		this.height = height;
		if (invalidate) {
			this.invalidate();
		}
	};

	SvgImage.prototype.setMatrix = function(matrix) {
		Element.prototype.setMatrix.call(this, Element._multiplyMatrices(matrix, [1, 0, 0, -1, 0, 0]));
	};

	SvgImage.prototype._expandBoundingBox = function(boundingBox, matrixWorld) {
		const hw = this.width * 0.5;
		const hh = this.height * 0.5;
		this._expandBoundingBoxCE(boundingBox, matrixWorld, this.x + hw, this.y + hh, hw, hh);
	};

	SvgImage.prototype._getParametricShape = function(fillStyles, lineStyles, textStyles) {
		var parametric = Element.prototype._getParametricShape.call(this, fillStyles, lineStyles, textStyles);
		parametric.type = "rectangle";
		parametric.width = this.width;
		parametric.length = this.height;
		return parametric;
	};

	SvgImage.prototype.copy = function(source, recursive) {
		Element.prototype.copy.call(this, source, recursive);

		this.type = source.type;
		this.x = source.x;
		this.y = source.y;
		this.width = source.width;
		this.height = source.height;
		this.data = source.data;
		this.sceneId = source.sceneId;
		this.imageId = source.imageId;

		return this;
	};

	return SvgImage;
});
