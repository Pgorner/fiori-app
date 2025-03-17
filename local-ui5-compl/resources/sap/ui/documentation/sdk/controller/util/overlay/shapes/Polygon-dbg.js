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
	var Polygon = Shape.extend();

	Polygon.prototype.setPosition = function (sCoords) {
		this.oContainer.setAttribute("points", sCoords);
	};

	return Polygon;

});