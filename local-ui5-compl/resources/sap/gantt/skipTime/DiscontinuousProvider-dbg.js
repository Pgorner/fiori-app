/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
], function () {
	'use strict';
	/**
	 * Creates and initializes a new class for DiscontinuousProvider.
	 * Enables the user to define custom discontinuous provider.
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 * @since 1.126
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.skipTime.DiscontinuousProvider
	 */
	function DiscontinuousProvider () {}

	// Returns whether the discontinuous provider is to be used or not. This method can be overriden to define custom conditions.
	DiscontinuousProvider.prototype.useDiscontinuousScale = function(){
		return true;
	};

	// If the given date falls within a discontinuity (i.e. an excluded domain range), it must be moved forward to the discontinuity boundary. Otherwise, it should be returned unchanged.
	DiscontinuousProvider.prototype.clampUp = function (oDate) {
		return oDate;
	};

	// If the given date falls within a discontinuity, it must be shifted backwards to the discontinuity boundary. Otherwise, it should be returned unchanged.
	DiscontinuousProvider.prototype.clampDown = function (oDate) {
		return oDate;
	};

	// returns the number of milliseconds between the start and end dates after removing the discontinuities in between.
	DiscontinuousProvider.prototype.distance = function (start, end) {
		return end - start;
	};

	// When given a date and an offset in milliseconds, the date should be advanced by the offset value, skipping any discontinuities, to return the final value.
	DiscontinuousProvider.prototype.offset = function (oDate, offset) {
		return new Date(oDate.getTime() + offset);
	};

	DiscontinuousProvider.prototype.tickFilter = function (aTicks) {
		return aTicks;
	};

	return DiscontinuousProvider;
});
