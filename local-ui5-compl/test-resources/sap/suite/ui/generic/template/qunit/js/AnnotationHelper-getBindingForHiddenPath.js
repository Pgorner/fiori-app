sap.ui.define(["sap/suite/ui/generic/template/js/AnnotationHelper"],
	function (AnnotationHelper) {
		QUnit.module("Test methods to check function getBindingForHiddenPath", {

			beforeEach: function () {
				this.oAnnotationHelper = AnnotationHelper;
			},

			afterEach: function () {
				this.oAnnotationHelper = null;
			}
		});

		QUnit.test("Hidden annotation contains Path", function (assert) {
			var oAnnotationHelper = this.oAnnotationHelper;
			var oHidden = {
				"com.sap.vocabularies.UI.v1.Hidden": {
					"Path": "Edit_ac"
				}
			};

			var bExpectedExpression = "{= !${Edit_ac} }";
			var bExpression = oAnnotationHelper.getBindingForHiddenPath(oHidden);
			assert.equal(bExpression, bExpectedExpression, "Expected value is: " + bExpectedExpression);
		});

		QUnit.test("Hidden annotation contains Bool:false", function (assert) {
			var oAnnotationHelper = this.oAnnotationHelper;
			var oHidden = {
				"com.sap.vocabularies.UI.v1.Hidden": {
					"Bool": "false"
				}
			};

			var bExpectedExpression = true;
			var bExpression = oAnnotationHelper.getBindingForHiddenPath(oHidden);
			assert.equal(bExpression, bExpectedExpression, "Expected value is: " + bExpectedExpression);
		});

		QUnit.test("Hidden annotation contains Bool:true", function (assert) {
			var oAnnotationHelper = this.oAnnotationHelper;
			var oHidden = {
				"com.sap.vocabularies.UI.v1.Hidden": {
					"Bool": "true"
				}
			};

			var bExpectedExpression = false;
			var bExpression = oAnnotationHelper.getBindingForHiddenPath(oHidden);
			assert.equal(bExpression, bExpectedExpression, "Expected value is: " + bExpectedExpression);
		});

		QUnit.test("Hidden annotation does not contain Bool or Path", function (assert) {
			var oAnnotationHelper = this.oAnnotationHelper;
			var oHidden = {
				"com.sap.vocabularies.UI.v1.Hidden": {}
			};

			var bExpectedExpression = false;
			var bExpression = oAnnotationHelper.getBindingForHiddenPath(oHidden);
			assert.equal(bExpression, bExpectedExpression, "Expected value is: " + bExpectedExpression);
		});
});
