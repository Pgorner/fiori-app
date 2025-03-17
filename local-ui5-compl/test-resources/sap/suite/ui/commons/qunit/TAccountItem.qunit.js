sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/suite/ui/commons/taccount/TAccount",
	"sap/suite/ui/commons/taccount/TAccountItem",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/core/Core"
], function (nextUIUpdate, TAccount, TAccountItem, createAndAppendDiv, Core) {
	"use strict";

	createAndAppendDiv("content");

	async function render(oElement) {
		oElement.placeAt("content");
		await nextUIUpdate();
	}

	QUnit.test("TAccountItem test valid color values", async function (assert) {
		var aColor = [
			"Good",
			"Error",
			"Neutral",
			"Sequence1",
			"Sequence12"
		];

		for (var iIndex in aColor) {
			var oAccount = new TAccount({
				measureOfUnit: "EUR"
			});

			var oItem = new TAccountItem({
				value: 100,
				color: "Critical"
			});

			oAccount.addDebit(oItem);
			await render(oAccount);

			oItem.setColor(aColor[iIndex]);
			assert.equal(oItem.getColor(), aColor[iIndex]);
			oAccount.destroy();
		}
	});

	QUnit.test("TAccountItem test undefined/null color values", async function (assert) {
		var aColor = [
			undefined,
			null
		];

		for (var iIndex in aColor) {
			var oAccount = new TAccount({
				measureOfUnit: "EUR"
			});

			var oItem = new TAccountItem({
				value: 100,
				color: "Sequence3"
			});

			oAccount.addDebit(oItem);
			await render(oAccount);

			assert.equal(oItem.getDomRef().querySelector(".sapSuiteUiCommonsAccountColorBar").hasAttribute("class"), true);

			oItem.setColor(aColor[iIndex]);
			await render(oAccount);

			assert.equal(oItem.getDomRef().querySelector(".sapSuiteUiCommonsAccountColorBar").hasAttribute("style"), false);
			oAccount.destroy();
		}
	});

	// QUnit.test("TAccountItem test for BigNumber", async function (assert) {
	// 	var aValues = [
	// 		123.000000,
	// 		123.1146
	// 	];
	// 	var aResults = [123,123.11];

	// 	for (var iIndex in aValues) {
	// 		var oAccount = new TAccount({
	// 			measureOfUnit: "KRW"
	// 		});

	// 		var oItem = new TAccountItem({
	// 			value: aValues[iIndex]
	// 		});

	// 		oAccount.addDebit(oItem);
	// 		sinon.stub(oAccount,  '_getPanel').returns({
	// 			getMaxFractionDigits: function(){return 2;}
	// 		});
	// 		sinon.stub(oItem,  '_getPanel').returns({
	// 			getMaxFractionDigits: function(){return 2;}
	// 		});
	// 		await render(oAccount);

	// 		assert.equal(oItem.getDomRef().querySelector(".sapSuiteUiCommonsAccountItemTitle").innerText, aResults[iIndex] + ' KRW');
	// 	}
	// });
});
