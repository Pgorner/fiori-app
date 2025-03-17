/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./MdcFieldBuilder", "sap/fe/test/Utils"], function (FieldBuilder, Utils) {
	"use strict";

	var FilterFieldBuilder = function () {
		return FieldBuilder.apply(this, arguments);
	};

	FilterFieldBuilder.create = function (oOpaInstance) {
		return new FilterFieldBuilder(oOpaInstance);
	};

	FilterFieldBuilder.prototype = Object.create(FieldBuilder.prototype);
	FilterFieldBuilder.prototype.constructor = FilterFieldBuilder;

	/**
	 * Checks for certain condition value(s).
	 * @param {string|Array} [vValue] The expected value(s)
	 * @param {string} [sOperator] The expected operator
	 * @returns {sap.fe.test.builder.FilterFieldBuilder} `this`
	 * @public
	 * @ui5-restricted
	 */
	FilterFieldBuilder.prototype.hasValue = function (vValue, sOperator) {
		return FieldBuilder.prototype.hasConditionValues.apply(this, arguments);
	};

	/**
	 * Changes the value of the filter field.
	 * @param {string} vValue The new value
	 * @param {boolean} bClearFirst
	 * @returns {sap.fe.test.builder.FilterFieldBuilder} `this`
	 * @public
	 * @ui5-restricted
	 */
	FilterFieldBuilder.prototype.doChangeValue = function (vValue, bClearFirst) {
		if (bClearFirst) {
			this.do(function (oFilterField) {
				oFilterField.setConditions([]);
			});
		}
		return FieldBuilder.prototype.doChangeValue.call(this, vValue);
	};

	FilterFieldBuilder.Matchers = {};

	FilterFieldBuilder.Actions = {};

	return FilterFieldBuilder;
});
