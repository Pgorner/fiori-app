sap.ui.define([
	"sap/apf/cloudFoundry/ui/valuehelp/showValueHelp",
	"sap/apf/cloudFoundry/ui/utils/ComponentCorrector",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (showValueHelp, ComponentCorrector, sinon) {
	"use strict";

	QUnit.module("showValueHelp", {
		beforeEach: function() {
			this.createViewStub = sinon.stub(ComponentCorrector, "createView");
		},
		afterEach: function() {
			this.createViewStub.restore();
		}
	});
	QUnit.test("When showValueHelp is called", function (assert) {
		var oEventData = "oEventData";
		var oComponent = "oComponent";
		var oCoreApi = {
			getComponent: function() {
				return oComponent;
			}
		};
		showValueHelp.show(oEventData, oCoreApi);
		assert.ok(this.createViewStub.calledOnce, "exactly one view is created through the ComponentCorrector");
		assert.deepEqual(this.createViewStub.firstCall.args, [oComponent, {
			viewName : "sap.apf.cloudFoundry.ui.valuehelp.view.CatalogBrowser",
			type : "XML",
			viewData : oEventData
		}], "the view gets passed the correct arguments on creation");
	});

});
