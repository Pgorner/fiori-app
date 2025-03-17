/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2016 SAP SE. All rights reserved
 */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/mvc/View",
	"sap/ui/core/mvc/ViewType",
	"sap/apf/testhelper/modelerUIHelper"
], function(Controller, View, ViewType, modelerUIHelper) {
	'use strict';
	var oSFBView, smartFilterBarInstance, oModelerInstance;
	async function _instantiateView(assert) {
		var oSFBController = await Controller.create({
			name : "sap.apf.modeler.ui.controller.smartFilterBar"
		});
		var spyOnInit = sinon.spy(oSFBController, "onInit");
		var oView = await View.create({
			viewName : "sap.apf.modeler.ui.view.smartFilterBar",
			type : ViewType.XML,
			controller : oSFBController,
			viewData : {
				updateSelectedNode : oModelerInstance.updateSelectedNode,
				updateTitleAndBreadCrumb : oModelerInstance.updateTitleAndBreadCrumb,
				oConfigurationHandler : oModelerInstance.configurationHandler,
				oConfigurationEditor : oModelerInstance.configurationEditorForUnsavedConfig,
				getText : oModelerInstance.modelerCore.getText,
				oParams : {
					name : "smartFilterBar",
					arguments : {
						configId : oModelerInstance.tempUnsavedConfigId,
						smartFilterId : "SmartFilterBar-1"
					}
				}
			}
		});
		assert.strictEqual(spyOnInit.calledOnce, true, "then request options onInit function is called and view is initialized");
		return oView;
	}
	QUnit.module("For an existing smart filter", {
		beforeEach : function(assert) {
			var done = assert.async();
			modelerUIHelper.getModelerInstance(async function(modelerInstance) {
				oModelerInstance = modelerInstance;
				//create SFB
				oModelerInstance.configurationEditorForUnsavedConfig.setFilterOption({
					smartFilterBar : true
				});
				smartFilterBarInstance = oModelerInstance.configurationEditorForUnsavedConfig.getSmartFilterBar();
				smartFilterBarInstance.setService("testService1");
				smartFilterBarInstance.setEntitySet("entitySet1");
				oSFBView = await _instantiateView(assert);
				done();
			});
		},
		afterEach : function() {
			modelerUIHelper.destroyModelerInstance();
			oModelerInstance.reset();
			oSFBView.destroy();
		}
	});
	QUnit.test("When SFB view is initialized", function(assert) {
		//assert
		assert.ok(oSFBView, "then SFB Request view is available");
		assert.ok(oSFBView.byId("idSFBRequestView"), true, "then SFB Request view is inserted to the view");
	});
	QUnit.test("Fetching validation state while view is valid", function(assert) {
		//assert
		assert.strictEqual(oSFBView.getController().getValidationState(), true, "then SFB view is in valid state");
	});
	QUnit.test("Fetching validation state while view is not valid", function(assert) {
		//action
		oSFBView.byId("idSFBRequestView").byId("idEntity").clearSelection();
		//assert
		assert.strictEqual(oSFBView.getController().getValidationState(), false, "then SFB view is not in valid state");
	});
	QUnit.test("When SFB view is destroyed", function(assert) {
		//arrangement
		var spyDestroyOfSFBRequestView = sinon.spy(oSFBView.byId("idSFBRequestView"), "destroy");
		//action
		oSFBView.destroy();
		//assertion
		assert.strictEqual(spyDestroyOfSFBRequestView.calledOnce, true, "then destroy is called on SFB Request view");
	});
});
