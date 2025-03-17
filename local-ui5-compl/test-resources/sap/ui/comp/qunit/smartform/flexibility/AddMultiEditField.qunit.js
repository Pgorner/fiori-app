sap.ui.define([
	"sap/ui/rta/enablement/elementActionTest",
	"sap/ui/model/json/JSONModel",
	"sap/ui/fl/apply/api/DelegateMediatorAPI"
], function(
	elementActionTest,
	JSONModel,
	DelegateMediatorAPI
) {
	"use strict";


	var NEW_CONTROL_ID = "my_new_control";
	var TEST_DELEGATE_PATH = "sap/ui/rta/enablement/TestDelegate";
	//ensure a default delegate exists for a model not used anywhere else
	var SomeModel = JSONModel.extend("sap.ui.comp.smartform.qunit.test.Model");
	DelegateMediatorAPI.registerReadDelegate({
		modelType: SomeModel.getMetadata().getName(),
		delegate: TEST_DELEGATE_PATH
	});

	function confirmFieldIsAdded(oAppComponent, oView, assert) {
		var aGroupElements = oView.byId("group").getGroupElements();
		assert.equal(aGroupElements.length, 2, "then a new group element exists");
		var oNewGroupElement = oView.byId(NEW_CONTROL_ID);
		return oNewGroupElement;
	}

	function confirmFieldIsAddedNormally(oAppComponent, oView, assert) {
		var oNewGroupElement = confirmFieldIsAdded(oAppComponent, oView, assert);
		var oField = oNewGroupElement.getFields()[0];
		assert.equal(oField.getPropertyName(), "binding/path", "and the smart field inside is bound correctly");
	}

	function confirmFieldIsAddedViaDelegate(oAppComponent, oView, assert) {
		var oNewGroupElement = confirmFieldIsAdded(oAppComponent,oView, assert);
		var oField = oNewGroupElement.getFields()[0];
		assert.equal(oField.getId(), oNewGroupElement.getId() + "-element0", "then the smart field was assigned a stable id");
		assert.equal(oField.getBindingPath("text"), "binding/path", "and the smart field inside is bound correctly");
		var oLabel = oNewGroupElement.getLabel();
		assert.ok(oLabel, "explicit label given");
	}
	function confirmFieldIsAddedViaDelegateCreateLayout(oAppComponent, oView, assert) {
		var oNewGroupElement = confirmFieldIsAdded(oAppComponent, oView, assert);
		var oField = oNewGroupElement.getFields()[0];
		assert.equal(oField.getId(), oNewGroupElement.getId() + "-field", "then the smart field was assigned a stable id");
		assert.equal(oField.getBindingPath("text"), "binding/path", "and the smart field inside is bound correctly");
		var oLabel = oNewGroupElement.getLabel();
		assert.ok(oLabel, "explicit label given");
	}
	function confirmFieldIsRemoved(oAppComponent, oView, assert) {
		var aGroupElements = oView.byId("group").getGroupElements();
		assert.equal(aGroupElements.length, 1, "then only the old groupelement exists");
		var oNewGroupElement = oView.byId(NEW_CONTROL_ID);
		assert.notOk(oNewGroupElement, "and new control is removed");
	}

	function buildXMLForSmartForm(sDelegate) {
		var sDelegateInfo = sDelegate || "";
		return '<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:sme="sap.ui.comp.smartmultiedit" xmlns="sap.ui.comp.smartform" xmlns:fl="sap.ui.fl">' +
			'<sme:Container id="multiEditContainer"> \
				<SmartForm id="form" \
				' + sDelegateInfo + '\
				>' +
					'<Group id="group" >' +
						'<GroupElement id="groupelement">' +
						'</GroupElement>' +
					'</Group> \
				</SmartForm> \
			</sme:Container> \
		</mvc:View>';
	}

	elementActionTest("Checking the add via delegate action and legacy changes not having the relevantContainerId", {
		xmlView: buildXMLForSmartForm(),
		action: {
			name: ["add", "delegate"],
			controlId: "group",
			parameter: function(oView) {
				return {
					index: 0,
					newControlId: oView.createId(NEW_CONTROL_ID),
					bindingString: "binding/path"
				};
			}
		},
		afterAction: confirmFieldIsAddedNormally,
		afterUndo: confirmFieldIsRemoved,
		afterRedo: confirmFieldIsAddedNormally
	});

	elementActionTest("Checking the add via delegate action with a default delegate (that is only evaluated at design time)", {
		xmlView: buildXMLForSmartForm(),
		action: {
			name: ["add", "delegate"],
			controlId: "group",
			parameter: function(oView) {
				return {
					index: 0,
					newControlId: oView.createId(NEW_CONTROL_ID),
					bindingString: "binding/path",
					relevantContainerId: oView.createId("form")
				};
			}
		},
		afterAction: confirmFieldIsAddedNormally,
		afterUndo: confirmFieldIsRemoved,
		afterRedo: confirmFieldIsAddedNormally
	});

	elementActionTest("Checking the add via delegate action with a explicit delegate", {
		xmlView: buildXMLForSmartForm(
			"fl:delegate='{" +
				'"name":"' + TEST_DELEGATE_PATH + '"' +
			"}'"
		),
		model : new SomeModel(),
		action: {
			name: ["add", "delegate"],
			controlId: "group",
			parameter: function(oView) {
				return {
					index: 0,
					newControlId: oView.createId(NEW_CONTROL_ID),
					bindingString: "binding/path",
					relevantContainerId: oView.createId("form")
				};
			}
		},
		afterAction: confirmFieldIsAddedViaDelegate,
		afterUndo: confirmFieldIsRemoved,
		afterRedo: confirmFieldIsAddedViaDelegate
	});

	elementActionTest("Checking the add via delegate action with a explicit delegate that has createLayout implemented", {
		xmlView: buildXMLForSmartForm(
			"fl:delegate='{" +
				'"name":"' + TEST_DELEGATE_PATH + '",' +
				'"payload":{' +
					'"useCreateLayout":"true",' + //enforce availability of createLayout in the test delegate
					'"valueHelpId":"valueHelp",' + //enforce creation of valueHelp in the test delegate
					'"layoutType":"sap.ui.comp.smartform.GroupElement",' + //specify createLayout details in the test delegate
					'"labelAggregation": "label",' + //specify createLayout details in the test delegate
					'"aggregation": "fields"' + //specify createLayout details in the test delegate
				'}' +
			"}'"
		),
		model : new SomeModel(),
		action: {
			name: ["add", "delegate"],
			controlId: "group",
			parameter: function(oView) {
				return {
					index: 0,
					newControlId: oView.createId(NEW_CONTROL_ID),
					bindingString: "binding/path",
					relevantContainerId: oView.createId("form")
				};
			}
		},
		afterAction: confirmFieldIsAddedViaDelegateCreateLayout,
		afterUndo: confirmFieldIsRemoved,
		afterRedo: confirmFieldIsAddedViaDelegateCreateLayout
	});
});
