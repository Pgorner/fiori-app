/* globals QUnit, sinon */
sap.ui.define([
	"sap/ui/comp/smartfilterbar/SFBMultiComboBox",
	"sap/ui/core/Item",
    "sap/base/util/Deferred"
], function(
	SFBMultiComboBox,
	Item,
    Deferred
) {
	"use strict";
	QUnit.module("Generic", {
		beforeEach: function() {
			this.oControl = new SFBMultiComboBox();
		},
		afterEach: function() {
			this.oControl.destroy();
			this.oControl = null;
		}
	});

	QUnit.test("CS20240007935809: Ensures the model is updated with the already added keys when the items are loaded on init without firing change event", function (assert) {
		// Arrange
		var fnSpyFireSelectionChange = sinon.spy(this.oControl, "fireSelectionChange"),
		fnSpyFireChange = sinon.spy(this.oControl, "fireChange"),
		oDataRecievedPromise = new Deferred();

		//Act
		this.oControl.data("__dataReceivedPromise", oDataRecievedPromise.promise);
		this.oControl.addItem(new Item({key: "B", text: "Bus"}));

		//Assert
		assert.strictEqual(this.oControl.getItems().length, 1, "fireChange is not called thus not propagated to the SmartFilterBar");

		oDataRecievedPromise.promise.then(function() {
			//Assert
			assert.strictEqual(fnSpyFireSelectionChange.callCount, 1, "fireSelectionChange is fired"); //The model is updated on fireSelectionChange
			assert.strictEqual(fnSpyFireChange.callCount, 0, "fireChange is not called thus not propagated to the SmartFilterBar");
		});

		// Act
		oDataRecievedPromise.resolve();
	});
});
