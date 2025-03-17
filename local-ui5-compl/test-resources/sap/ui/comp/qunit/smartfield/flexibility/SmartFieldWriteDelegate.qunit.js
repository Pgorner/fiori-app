/*global QUnit, sinon*/

sap.ui.define([
	"sap/ui/core/mvc/XMLView",
	"sap/ui/core/util/reflection/JsControlTreeModifier",
	"sap/ui/comp/smartfield/flexibility/SmartFieldWriteDelegate",
	"sap/ui/qunit/utils/nextUIUpdate"
],
function(
	XMLView,
	JsControlTreeModifier,
	SmartFieldWriteDelegate,
	nextUIUpdate
) {
	"use strict";

	const sandbox = sinon.sandbox.create();

	const oMockedAppComponent = {
		getId: function () {
			return 'testcomponent';
		},
		createId : function(sId) {
			return 'testcomponent---' + sId;
		}
	};


	/**
	 * Asynchronously renders a complex view and checks if the data is ready.
	 *
	 * @param {Object} scope - The scope object containing information about the view.
	 * @returns {boolean} - Indicates if the data is ready in the view.
	 */
	async function _renderComplexView(scope) {
		const oViewInstance = await XMLView.create({
			id: "idMain1",
			viewName: "sap.ui.comp.test.flexibility.SmartFormGroup"
		});
		scope.oView = oViewInstance;
		oViewInstance.placeAt("qunit-fixture");
		await nextUIUpdate();
		return oViewInstance.getController().isDataReady();
	}

	QUnit.module("Given a test view", {
		before : function() {
			return _renderComplexView(this);
		},
		afterEach: function() {
			sandbox.restore();
		},
		after : function () {
			this.oView.destroy();
		}
	});

	QUnit.test("when calling 'createLabel' function", function(assert) {
		const mPropertyBag = {
			modifier: JsControlTreeModifier,
			appComponent: oMockedAppComponent,
			view: this.oView,
			labelFor: "TestFieldId"
		};
		return SmartFieldWriteDelegate.createLabel(mPropertyBag)
			.then(function (oLabel) {
				assert.ok(oLabel.isA("sap.ui.comp.smartfield.SmartLabel"), "then the created control is a 'sap.ui.comp.smartfield.SmartLabel'");
				assert.strictEqual(oLabel.getId(), mPropertyBag.labelFor + "-label", "then the created label is returned");
				assert.strictEqual(oLabel.getLabelFor(), mPropertyBag.labelFor, "then the labelFor property is set");
			});
	});

	QUnit.test("when calling 'createControlForProperty' function", function(assert) {
		const mPropertyBag = {
			modifier: JsControlTreeModifier,
			appComponent: oMockedAppComponent,
			view: this.oView,
			bindingPath: "Property01",
			fieldSelector: {
				id: "TestFieldId",
				idIsLocal: true
			}
		};
		return SmartFieldWriteDelegate.createControlForProperty(mPropertyBag)
			.then(function (mSpecificControlInfo) {
				assert.ok(mSpecificControlInfo.control.isA("sap.ui.comp.smartfield.SmartField"), "then the created control is a 'sap.ui.comp.smartfield.SmartField'");
				assert.strictEqual(mSpecificControlInfo.control.getId(), "testcomponent---TestFieldId", "then the created SmartField is returned");
			});
	});

	QUnit.done(function () {
		document.getElementById("qunit-fixture").style.display = "none";
	});
});
