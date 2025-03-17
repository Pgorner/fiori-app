/*global QUnit */
sap.ui.define([
	"sap/ui/comp/p13n/P13nOperationsHelper"
], function(
	P13nOperationsHelper
) {
	"use strict";

	QUnit.module("Properties", {
		beforeEach: function() {
			this.oOH = new P13nOperationsHelper();
		},
		afterEach: function() {
			this.oOH = null;
		}
	});

	QUnit.test("getIncludeTypes", function (assert) {
		// Assert
		assert.strictEqual(
			this.oOH.getIncludeTypes().join(","),
			"default,string,date,time,datetime,numeric,numc,boolean,numcFiscal,stringdate",
			"Types should match"
		);
	});

	QUnit.test("getExcludeTypes", function (assert) {
		// Assert
		assert.strictEqual(
			this.oOH.getExcludeTypes().join(","),
			"default",
			"Types should match"
		);

		// Act
		this.oOH.setUseExcludeOperationsExtended();

		// Assert
		assert.strictEqual(
			this.oOH.getExcludeTypes().join(","),
			"default,string,date,stringdate,time,datetime,numeric,numc,numcFiscal,boolean",
			"Types should match"
		);
	});

	QUnit.test("getIncludeOperationsByType", function (assert) {
		// Assert
		assert.strictEqual(
			this.oOH.getIncludeOperationsByType().join(","),
			"EQ,BT,LT,LE,GT,GE",
			"Default operations should match"
		);

		assert.strictEqual(
			this.oOH.getIncludeOperationsByType("string").join(","),
			"Contains,EQ,BT,StartsWith,EndsWith,LT,LE,GT,GE",
			"Operations should match"
		);

		assert.strictEqual(
			this.oOH.getIncludeOperationsByType("date").join(","),
			"EQ,BT,LT,LE,GT,GE",
			"Operations should match"
		);

		assert.strictEqual(
			this.oOH.getIncludeOperationsByType("time").join(","),
			"EQ,BT,LT,LE,GT,GE",
			"Operations should match"
		);

		assert.strictEqual(
			this.oOH.getIncludeOperationsByType("datetime").join(","),
			"EQ,BT,LT,LE,GT,GE",
			"Operations should match"
		);

		assert.strictEqual(
			this.oOH.getIncludeOperationsByType("numeric").join(","),
			"EQ,BT,LT,LE,GT,GE",
			"Operations should match"
		);

		assert.strictEqual(
			this.oOH.getIncludeOperationsByType("numc").join(","),
			"Contains,EQ,BT,EndsWith,LT,LE,GT,GE,Empty",
			"Operations should match"
		);

		assert.strictEqual(
			this.oOH.getIncludeOperationsByType("boolean").join(","),
			"EQ",
			"Operations should match"
		);
	});

	QUnit.test("getExcludeOperationsByType", function (assert) {
		// Assert
		assert.strictEqual(
			this.oOH.getExcludeOperationsByType().join(","),
			"NotEQ",
			"Default operations should match"
		);

		// Act
		this.oOH.setUseExcludeOperationsExtended();

		// Assert
		assert.strictEqual(
			this.oOH.getExcludeOperationsByType().join(","),
			"NotEQ,NotBT,NotLT,NotLE,NotGT,NotGE",
			"Default operations should match"
		);

		assert.strictEqual(
			this.oOH.getExcludeOperationsByType("string").join(","),
			"NotContains,NotEQ,NotBT,NotStartsWith,NotEndsWith,NotLT,NotLE,NotGT,NotGE",
			"Operations should match"
		);

		assert.strictEqual(
			this.oOH.getExcludeOperationsByType("date").join(","),
			"NotEQ,NotBT,NotLT,NotLE,NotGT,NotGE",
			"Operations should match"
		);

		assert.strictEqual(
			this.oOH.getExcludeOperationsByType("time").join(","),
			"NotEQ,NotBT,NotLT,NotLE,NotGT,NotGE",
			"Operations should match"
		);

		assert.strictEqual(
			this.oOH.getExcludeOperationsByType("datetime").join(","),
			"NotEQ,NotBT,NotLT,NotLE,NotGT,NotGE",
			"Operations should match"
		);

		assert.strictEqual(
			this.oOH.getExcludeOperationsByType("numeric").join(","),
			"NotEQ,NotBT,NotLT,NotLE,NotGT,NotGE",
			"Operations should match"
		);

		assert.strictEqual(
			this.oOH.getExcludeOperationsByType("numc").join(","),
			"NotContains,NotEQ,NotBT,NotEndsWith,NotLT,NotLE,NotGT,NotGE,NotEmpty",
			"Operations should match"
		);

		assert.strictEqual(
			this.oOH.getExcludeOperationsByType("boolean").join(","),
			"NotEQ",
			"Operations should match"
		);
	});

	QUnit.start();
});
