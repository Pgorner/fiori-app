/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function (
	Opa5,
	opaTest
) {
	"use strict";

	Opa5.extendConfig({
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/qunit/smartfield/opa/ModelPropagation/applicationUnderTest/MixOfModelsAndContexts.html"
			}
		},
		viewName: "mainView",
		viewNamespace: "",
		autoWait: true,
		async: true,
		timeout: 120,
		assertions: new Opa5({
			iShouldSeeAValue: function (sValue, sErrorMessage) {
				return this.waitFor({
					id: "Name",
					success: function (oSmartField) {
						Opa5.assert.strictEqual(
							oSmartField.getValue(),
							sValue,
							sErrorMessage ? sErrorMessage : "SmartField value should match"
						);
					}
				});
			}
		})
	});

	QUnit.module("Defaults");

	opaTest("BCP: 2070437664. Control is rendered when mixed models are propagated and URL property value is provided", function(Given, When, Then) {
		// Arrange
		Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

		// Assert
		Then.waitFor({
			id: "Name",
			success: function (oSmartField) {
				var oNamedModel = oSmartField.getModel("MyNamedModel"),
					oUndefinedModel = oSmartField.getModel(),
					oNamedBindingContext = oSmartField.getBindingContext("MyNamedModel"),
					oBindingContext = oSmartField.getBindingContext();

				// Scenario
				Opa5.assert.ok(!!oSmartField.getDomRef(), "SmartField is rendered");
				Opa5.assert.ok(!!oSmartField.getFirstInnerControl(), "SmartField created internal control");
				Opa5.assert.ok(!!oSmartField.getFirstInnerControl().getDomRef(), "SmartField rendered internal control");
				Opa5.assert.ok(
					oSmartField.getFirstInnerControl().isA("sap.m.Input"),
					"SmartField rendered internal input control"
				);

				// Verifying some test prerequisites to be sure we are testing the right scenario
				Opa5.assert.strictEqual(
					oSmartField.getBinding("url").getValue(),
					"Local Text",
					"URL property is bound and has a value"
				);
				Opa5.assert.ok(!!oNamedModel, "There is a named model propagated");
				Opa5.assert.ok(!!oUndefinedModel, "There is a undefined model propagated");
				Opa5.assert.ok(!!oNamedBindingContext, "There is a named binding context propagated");
				Opa5.assert.ok(!!oBindingContext, "There is a undefined binding context propagated");
				Opa5.assert.strictEqual(oNamedBindingContext.getModel(), oNamedModel,
					"Named binding context points to the named model");
				Opa5.assert.strictEqual(oBindingContext.getModel(), oUndefinedModel,
					"Undefined binding context points to the undefined model");
			}
		});
		Then.iShouldSeeAValue("1");

		// Shutdown
		Given.onTheCompTestLibrary.iStopMyApp();
	});
});
