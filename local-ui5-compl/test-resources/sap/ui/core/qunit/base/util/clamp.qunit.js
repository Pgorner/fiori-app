/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
/*global QUnit */
sap.ui.define([
	'sap/base/util/clamp'
], function (
	clamp
) {
	"use strict";

	QUnit.module("sap.base.util.clamp");

	QUnit.test("basic functionality", function (assert) {
		assert.strictEqual(clamp(2, 1, 4), 2);
		assert.strictEqual(clamp(2, 3, 4), 3);
		assert.strictEqual(clamp(4, 1, 2), 2);
		assert.strictEqual(clamp(4, 3, 2), 3);
	});
});
