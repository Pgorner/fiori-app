/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(["./Shape"], function (Shape) {
	"use strict";

	/**
	 *
	 * @constructor
	 */
	var Rect = Shape.extend();

	Rect.prototype.setPosition = function (sCoords) {
		var aCoords = sCoords.split(","),
			oPosition = {
				x: aCoords[0],
				y: aCoords[1],
				width: aCoords[2] - aCoords[0],
				height: aCoords[3] - aCoords[1]
			};

		this.oContainer.setAttribute("x", oPosition.x);
		this.oContainer.setAttribute("y", oPosition.y);
		this.oContainer.setAttribute("width", oPosition.width);
		this.oContainer.setAttribute("height", oPosition.height);
	};

	return Rect;
});