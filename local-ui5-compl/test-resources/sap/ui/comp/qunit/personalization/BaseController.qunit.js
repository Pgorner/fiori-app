/* global QUnit, sinon */
sap.ui.define([
	'sap/ui/comp/personalization/BaseController',
	'sap/m/p13n/BasePanel',
	'sap/m/MessageStrip'
], function(
	BaseController,
	MDCBasePanel,
	MessageStrip
) {
	'use strict';

	QUnit.module("BaseController API tests", {
		beforeEach: function() {

			var TestController = BaseController.extend("UnitTestController", {
				metadata: {},
				getPanel: function() {
					this.oPanel = new MDCBasePanel();
					this.oPanel.destroy();
					return Promise.resolve(this.oPanel);
				}
			});

			this.oBaseController = new TestController();
		},
		afterEach: function() {
			this.oBaseController.destroy();
		}
	});

	QUnit.test("constructor", function(assert) {
		assert.ok(this.oBaseController, "Subcontroller instantiated");
	});

	QUnit.test("_extendData should not throw error when data is already present", function(assert) {
		// Arrange
		const sPropertyName = "variantDataInitial",
			oJson = {
				columns: {
					columnsItems: [{
						columnKey: "Delivery",
						index: 0,
						visible: true,
						width: "7rem"
					}]
				}
			};

		sinon.stub(this.oBaseController, "_getInternalModelData").returns(oJson);
		sinon.stub(this.oBaseController, "getType").returns("columns");

		// Act
		this.oBaseController._extendData(sPropertyName, oJson);

		// Assert
		assert.ok(true, "No error thrown");

	});

	QUnit.test("test messageStrip aggregation", function(assert) {
		// Arrange
		const oMessageStrip = new MessageStrip();

		// Act
		this.oBaseController.setMessageStrip(oMessageStrip);

		// Assert
		assert.equal(this.oBaseController.getAggregation("messageStrip"), oMessageStrip, "MessageStrip is correctly added as aggregation");
	});

	QUnit.test("check 'retrieveAdaptationUI' --> should return the 'getPanel' promise", function(assert) {
		var pAdaptationUI = this.oBaseController.retrieveAdaptationUI();
		assert.ok(pAdaptationUI instanceof Promise, "Panel promise returned");
	});

	QUnit.test("check 'getAdaptationUI' --> should not return the panel as it is being destroyed", function(assert) {
		var oPanel = this.oBaseController.getAdaptationUI();
		assert.notOk(oPanel, "No panel returned as it is being destroyed");
	});
});
