sap.ui.define([
	"sap/apf/cloudFoundry/ui/sharedialog/showShareDialog",
	"sap/apf/cloudFoundry/ui/utils/ComponentCorrector",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (showShareDialog, ComponentCorrector, sinon) {
	'use strict';

	QUnit.module("Show sharedialog", {
		beforeEach: function () {
			this.stubCreateView = sinon.stub(ComponentCorrector, "createView");
		},
		afterEach: function () {
			this.stubCreateView.restore();
		}
	});
	QUnit.test("When showShareDialog is called", function (assert) {
		//build
		var oComponent = "oComponent";
		var oCoreApi = {
			getComponent: function () {
				return oComponent;
			}
		};
		var oController = "oController";
		//execute
		showShareDialog.show(oCoreApi, oController);
		//check
		assert.ok(this.stubCreateView.calledOnce, "exactly one view is created through the ComponentCorrector");
		assert.deepEqual(this.stubCreateView.firstCall.args, [
			oComponent, {
				viewName: "sap.apf.cloudFoundry.ui.sharedialog.view.ShareDialog",
				type: "XML",
				viewData: {
					oCoreApi: oCoreApi,
					oController: oController
				}
			}],
			"the view gets passed the correct arguments on creation"
		);
	});

});
