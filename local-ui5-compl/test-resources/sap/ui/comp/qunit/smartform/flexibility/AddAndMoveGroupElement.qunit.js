/* global QUnit */

sap.ui.define([
	"sap/ui/comp/smartform/flexibility/changes/AddField",
	"sap/ui/comp/smartform/flexibility/changes/AddFields",
	"sap/ui/comp/smartform/SmartForm",
	"sap/ui/comp/smartform/Group",
	"sap/ui/core/Element",
	"sap/ui/core/util/reflection/JsControlTreeModifier",
	"sap/ui/core/util/reflection/XmlTreeModifier",
	"sap/ui/core/mvc/View",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/ui/fl/apply/api/DelegateMediatorAPI",
	"sap/ui/fl/changeHandler/Base",
	"sap/ui/fl/write/api/ChangesWriteAPI",
	"sap/ui/fl/Utils",
	"sap/ui/rta/enablement/elementActionTest",
	"sap/ui/thirdparty/sinon-4"
], function(
	AddFieldChangeHandler,
	AddFieldsChangeHandler,
	SmartForm,
	SmartFormGroup,
	Element,
	JsControlTreeModifier,
	XmlTreeModifier,
	View,
	UIComponent,
	JSONModel,
	DelegateMediatorAPI,
	ChangeHandlerBase,
	ChangesWriteAPI,
	FlUtils,
	elementActionTest,
	sinon
) {
	"use strict";
	var sandbox = sinon.createSandbox();

	var NEW_CONTROL_ID = "my_new_control";
	var TEST_DELEGATE_PATH = "sap/ui/rta/enablement/TestDelegate";
	//ensure a default delegate exists for a model not used anywhere else
	var SomeModel = JSONModel.extend("sap.ui.comp.smartform.qunit.test.Model");
	DelegateMediatorAPI.registerReadDelegate({
		modelType: SomeModel.getMetadata().getName(),
		delegate: TEST_DELEGATE_PATH
	});

	function confirmFieldIsAdded(oAppComponent, sBoundProperty, sIdSuffix, oView, assert) {
		var aGroupElements = oView.byId("group").getGroupElements();
		assert.equal(aGroupElements.length, 2, "then a new groupelement exists");
		var oNewGroupElement = oView.byId(NEW_CONTROL_ID);
		var oField = oNewGroupElement.getFields()[0];
		assert.equal(oField.getId(), oNewGroupElement.getId() + sIdSuffix, "then the smart field was assigned a stable id");
		assert.equal(oField.getBindingPath(sBoundProperty), "binding/path", "and the smart field inside is bound correctly");
		return oNewGroupElement;
	}

	function confirmFieldIsAddedNormally(oAppComponent, oView, assert) {
		var oNewGroupElement = confirmFieldIsAdded(oAppComponent, "value", "-element0", oView, assert);
		var oLabel = oNewGroupElement.getLabel();
		assert.notOk(oLabel, "no explicit label given");
	}

	function confirmFieldIsAddedViaDelegate(oAppComponent, oView, assert) {
		var oNewGroupElement = confirmFieldIsAdded(oAppComponent, "text", "-element0", oView, assert);
		var oLabel = oNewGroupElement.getLabel();
		assert.ok(oLabel, "explicit label given");
	}
	function confirmFieldIsAddedViaDelegateCreateLayout(oAppComponent, oView, assert) {
		var oNewGroupElement = confirmFieldIsAdded(oAppComponent, "text", "-field", oView, assert);
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
		return '<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.ui.comp.smartform" xmlns:fl="sap.ui.fl">' +
			'<SmartForm id="form" \
			' + sDelegateInfo + '\
			>' +
				'<Group id="group" >' +
					'<GroupElement id="groupelement">' +
					'</GroupElement>' +
				'</Group>' +
			'</SmartForm>' +
		'</mvc:View>';
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
		afterRedo: confirmFieldIsAddedViaDelegate,
		changeVisualization: function(oView) {
			return {
				displayElementId: oView.byId(NEW_CONTROL_ID).getId(),
				info: {
					displayControls: [oView.byId(NEW_CONTROL_ID).getId()],
					updateRequired: true
				}
			};
		}
	});

	function confirmNewFieldIsInvisible(oAppComponent, oViewAfterAction, assert) {
		var oGroupElement = oViewAfterAction.byId(NEW_CONTROL_ID);
		assert.strictEqual(oGroupElement.getVisible(), false, "then the control is invisible");
	}

	elementActionTest("Checking the add via delegate action followed by a remove with a explicit delegate", {
		xmlView: buildXMLForSmartForm(
			"fl:delegate='{" +
				'"name":"' + TEST_DELEGATE_PATH + '"' +
			"}'"
		),
		model : new SomeModel(),
		action: {
			name: "remove",
			controlId: NEW_CONTROL_ID,
			parameter: function(oView) {
				return {
					removedElement: oView.byId(NEW_CONTROL_ID)
				};
			}
		},
		previousActions: [{
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
		}],
		afterAction: confirmNewFieldIsInvisible,
		afterUndo: confirmFieldIsRemoved,
		afterRedo: confirmNewFieldIsInvisible,
		changeVisualization: function(oView) {
			return {
				displayElementId: oView.byId(NEW_CONTROL_ID).getParent().getId(),
				info: {
					displayControls: [oView.byId(NEW_CONTROL_ID).getParent().getId()],
					updateRequired: true
				}
			};
		}
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

	var confirmGroupelement1IsOn2ndPosition = function(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual( oViewAfterAction.byId("groupelement1").getId(),					// Id of element at first position in original view
							oViewAfterAction.byId("group1").getGroupElements() [1].getId(),	// Id of third element in group after change has been applied
							"then the control has been moved to the right position");
	};

	var confirmGroupelement1IsOn1stPosition = function(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual( oViewAfterAction.byId("groupelement1").getId(),					// Id of element at first position in original view
							oViewAfterAction.byId("group1").getGroupElements() [0].getId(),	// Id of third element in group after change has been applied
							"then the control has been moved to the previous position");
	};

	elementActionTest("Checking the move action for a group element", {
		xmlView:
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns="sap.ui.comp.smartform" xmlns:smartField="sap.ui.comp.smartfield">' +
				'<SmartForm id="form" >' +
					'<Group id="group1" >' +
						'<GroupElement id="groupelement1">' +
							'<smartField:SmartField value="smartfield value 1"/>' +
						'</GroupElement>' +
						'<GroupElement id="groupelement2">' +
							'<smartField:SmartField value="smartfield value 2"/>' +
						'</GroupElement>' +
						'<GroupElement id="groupelement3">' +
							'<smartField:SmartField value="smartfield value 3"/>' +
						'</GroupElement>' +
					'</Group>' +
					'<Group id="group2" >' +
						'<GroupElement id="groupelement4">' +
							'<smartField:SmartField value="smartfield value 4"/>' +
						'</GroupElement>' +
						'<GroupElement id="groupelement5">' +
							'<smartField:SmartField value="smartfield value 5"/>' +
						'</GroupElement>' +
					'</Group>' +
				'</SmartForm>' +
			'</mvc:View>'
		,
		action: {
			name: "move",
			controlId: "group1",
			parameter: function(oView) {
				return {
					movedElements: [{
						element: oView.byId("groupelement1"),
						sourceIndex: 0,
						targetIndex: 1
					}],
					source: {
						aggregation: "groupElements",
						parent: oView.byId("group1")
					},
					target: {
						aggregation: "groupElements",
						parent: oView.byId("group1")
					}
				};
			}
		},
		previousActions: [
			{
				name: "move",
				controlId: "group1",
				parameter: function(oView) {
					return {
						movedElements: [{
							element: oView.byId("groupelement1"),
							sourceIndex: 0,
							targetIndex: 2
						}],
						source: {
							aggregation: "groupElements",
							parent: oView.byId("group1")
						},
						target: {
							aggregation: "groupElements",
							parent: oView.byId("group1")
						}
					};
				}
			},
			{
				name: "move",
				controlId: "group1",
				parameter: function(oView) {
					return {
						movedElements: [{
							element: oView.byId("groupelement1"),
							sourceIndex: 2,
							targetIndex: 0
						}],
						source: {
							aggregation: "groupElements",
							parent: oView.byId("group1")
						},
						target: {
							aggregation: "groupElements",
							parent: oView.byId("group1")
						}
					};
				}
			}
		],
		changesAfterCondensing: 1,
		afterAction: confirmGroupelement1IsOn2ndPosition,
		afterUndo: confirmGroupelement1IsOn1stPosition,
		afterRedo: confirmGroupelement1IsOn2ndPosition
	});

	elementActionTest("Checking the move action after adding a new group element via delegate", {
		xmlView:
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns="sap.ui.comp.smartform" xmlns:smartField="sap.ui.comp.smartfield">' +
				'<SmartForm id="form" >' +
					'<Group id="group1" >' +
						'<GroupElement id="groupelement1">' +
							'<smartField:SmartField value="smartfield value 1"/>' +
						'</GroupElement>' +
					'</Group>' +
				'</SmartForm>' +
			'</mvc:View>'
		,
		action: {
			name: "move",
			controlId: "group1",
			parameter: function(oView) {
				return {
					movedElements: [{
						id: oView.createId(NEW_CONTROL_ID),
						sourceIndex: 1,
						targetIndex: 0
					}],
					source: {
						aggregation: "groupElements",
						parent: oView.byId("group1")
					},
					target: {
						aggregation: "groupElements",
						parent: oView.byId("group1")
					}
				};
			}
		},
		previousActions: [
			{
				name: ["add", "delegate"],
				controlId: "group1",
				parameter: function(oView) {
					return {
						index: 1,
						newControlId: oView.createId(NEW_CONTROL_ID),
						bindingString: "binding/path",
						relevantContainerId: oView.createId("form")
					};
				}
			}
		],
		changesAfterCondensing: 1,
		afterAction: confirmGroupelement1IsOn2ndPosition,
		afterUndo: confirmGroupelement1IsOn1stPosition,
		afterRedo: confirmGroupelement1IsOn2ndPosition
	});

	function confirmGroupelement2IsOn2ndPosition(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual( oViewAfterAction.byId("groupelement2").getId(),
							oViewAfterAction.byId("group1").getGroupElements()[1].getId(),
							"then the control has been moved to the right position");
	}

	function confirmGroupelement2IsOn1stPosition(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual( oViewAfterAction.byId("groupelement2").getId(),
							oViewAfterAction.byId("group1").getGroupElements()[0].getId(),
							"then the control has been moved to the previous position");
	}

	elementActionTest("Checking the move action for a group element between 2 groups", {
		xmlView:
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns="sap.ui.comp.smartform" xmlns:smartField="sap.ui.comp.smartfield">' +
				'<SmartForm id="form" >' +
					'<Group id="group1" >' +
						'<GroupElement id="groupelement1">' +
							'<smartField:SmartField value="smartfield value 1"/>' +
						'</GroupElement>' +
						'<GroupElement id="groupelement2">' +
							'<smartField:SmartField value="smartfield value 2"/>' +
						'</GroupElement>' +
						'<GroupElement id="groupelement3">' +
							'<smartField:SmartField value="smartfield value 3"/>' +
						'</GroupElement>' +
					'</Group>' +
					'<Group id="group2" >' +
						'<GroupElement id="groupelement4">' +
							'<smartField:SmartField value="smartfield value 4"/>' +
						'</GroupElement>' +
						'<GroupElement id="groupelement5">' +
							'<smartField:SmartField value="smartfield value 5"/>' +
						'</GroupElement>' +
					'</Group>' +
				'</SmartForm>' +
			'</mvc:View>'
		,
		action: {
			name: "move",
			controlId: "group1",
			parameter: function(oView) {
				return {
					movedElements: [{
						element: oView.byId("groupelement2"),
						sourceIndex: 2,
						targetIndex: 0
					}],
					source: {
						aggregation: "groupElements",
						parent: oView.byId("group1")
					},
					target: {
						aggregation: "groupElements",
						parent: oView.byId("group1")
					}
				};
			}
		},
		previousActions: [
			{
				name: "move",
				controlId: "group1",
				parameter: function(oView) {
					return {
						movedElements: [{
							element: oView.byId("groupelement2"),
							sourceIndex: 1,
							targetIndex: 0
						}],
						source: {
							aggregation: "groupElements",
							parent: oView.byId("group1")
						},
						target: {
							aggregation: "groupElements",
							parent: oView.byId("group2")
						}
					};
				}
			},
			{
				name: "move",
				controlId: "group2",
				parameter: function(oView) {
					return {
						movedElements: [{
							element: oView.byId("groupelement2"),
							sourceIndex: 0,
							targetIndex: 2
						}],
						source: {
							aggregation: "groupElements",
							parent: oView.byId("group2")
						},
						target: {
							aggregation: "groupElements",
							parent: oView.byId("group1")
						}
					};
				}
			}
		],
		changesAfterCondensing: 1,
		afterAction: confirmGroupelement2IsOn1stPosition,
		afterUndo: confirmGroupelement2IsOn2ndPosition,
		afterRedo: confirmGroupelement2IsOn1stPosition
	});

	QUnit.module("AddField (legacy) and AddFields edge case tests", {
		beforeEach: function() {
			this.oAppComponent = new UIComponent();
			sandbox.stub(FlUtils, "getAppComponentForControl").returns(this.oAppComponent);
			this.oGroup = new SmartFormGroup("group1");
			var oForm = new SmartForm({
				groups: [this.oGroup]
			});
			this.oView = new View({content: [
				oForm
			]});
			return Promise.all([
				ChangesWriteAPI.create({
					changeSpecificData: {
						changeType: "addField",
						index: 0,
						jsType: "sap.ui.comp.smartfield.SmartField",
						entitySet: "testEntitySet1",
						newControlId: "addedFieldId",
						valueProperty: "value",
						fieldLabel: "the field label",
						fieldValue: "BindingPath1"
					},
					selector: this.oGroup
				}),
				ChangesWriteAPI.create({
					changeSpecificData: {
						changeType: "addFields",
						index: 0,
						jsTypes: ["sap.ui.comp.smartfield.SmartField"],
						entitySet: ["testEntitySet1"],
						newControlId: "addedFieldId",
						valueProperty: ["value"],
						fieldValues: ["BindingPath1"]
					},
					selector: this.oGroup
				})
			]).then(function(aChanges) {
				this.oChangeAddField = aChanges[0];
				this.oChangeAddFields = aChanges[1];
			}.bind(this));
		},
		afterEach: function() {
			var oAddedControl = Element.getElementById("addedFieldId");
			if (oAddedControl) {
				oAddedControl.destroy();
			}
			this.oView.destroy();
			sandbox.restore();
		}
	}, function() {
		// Keep these tests to ensure that legacy changes are still valid
		QUnit.test("applyChange - positive test (legacy)", function(assert) {
			var oAddGroupElementSpy = sandbox.spy(this.oGroup, "insertGroupElement");
			var oNewContent = this.oChangeAddField.getContent();
			delete oNewContent.field.selector;
			oNewContent.field.id = "addedFieldId";
			this.oChangeAddField.setContent(oNewContent);

			return AddFieldChangeHandler.applyChange(this.oChangeAddField, this.oGroup, {modifier: JsControlTreeModifier, view: this.oView, appComponent: this.oAppComponent})
				.then(function () {
					assert.ok(oAddGroupElementSpy.calledOnce);
					assert.equal(this.oGroup.getGroupElements().length, 1);
					var oGroupElement = this.oGroup.getGroupElements()[0];
					assert.equal(oGroupElement.getLabelText(), "the field label");
					assert.equal(oGroupElement.getElements().length, 1);
					var oControl = oGroupElement.getElements()[0];
					assert.equal(oControl.getBindingPath("value"),"BindingPath1");
				}.bind(this));
		});

		QUnit.test("applyChange - positive test with field selector (legacy)", function(assert) {
			var oAddGroupElementSpy = sandbox.spy(this.oGroup, "insertGroupElement");
			var oChangeContent = this.oChangeAddField.getContent();
			assert.equal(this.oChangeAddField.getText("fieldLabel"), "the field label");
			assert.equal(oChangeContent.field.jsType, "sap.ui.comp.smartfield.SmartField");
			assert.equal(oChangeContent.field.value, "BindingPath1");
			assert.equal(oChangeContent.field.valueProperty, "value");
			assert.equal(oChangeContent.field.selector.id, "addedFieldId");
			assert.equal(oChangeContent.field.index, 0);
			assert.equal(oChangeContent.field.entitySet,"testEntitySet1");

			return AddFieldChangeHandler.applyChange(this.oChangeAddField, this.oGroup, {modifier: JsControlTreeModifier, appComponent: this.oAppComponent, view: this.oView})
				.then(function () {
					assert.ok(oAddGroupElementSpy.calledOnce);
					assert.equal(this.oGroup.getGroupElements().length, 1);
					var oGroupElement = this.oGroup.getGroupElements()[0];
					assert.equal(oGroupElement.getLabelText(), "the field label");
					assert.equal(oGroupElement.getElements().length, 1);
					var oControl = oGroupElement.getElements()[0];
					assert.equal(oControl.getBindingPath("value"),"BindingPath1");
				}.bind(this));
		});

		QUnit.test("applyChange- addFields - add smart field to js control tree with duplicated id", function(assert) {
			var oMarkAsNotApplicableSpy = sandbox.spy(ChangeHandlerBase, "markAsNotApplicable");
			var oAddGroupElementSpy = sandbox.spy(this.oGroup, "insertGroupElement");

			return AddFieldsChangeHandler.applyChange(this.oChangeAddFields, this.oGroup, {modifier: JsControlTreeModifier, appComponent: this.oAppComponent, view: this.oView})
				.then(function () {
					assert.ok(oAddGroupElementSpy.calledOnce);
					assert.equal(this.oGroup.getGroupElements().length, 1);
					var oGroupElement = this.oGroup.getGroupElements()[0];
					assert.equal(oGroupElement.getElements().length, 1);
					var oControl = oGroupElement.getElements()[0];
					assert.equal(oControl.getId(), oGroupElement.getId() + "-element0");
					assert.equal(oControl.getBindingPath("value"), "BindingPath1");
					assert.ok(oControl.getEntitySet);
					assert.equal(oControl.getEntitySet(),"testEntitySet1");
					/**
					 * @deprecated As of version 1.117
					 * @private
					 */
					(function() {
						assert.ok(oControl.getExpandNavigationProperties(), "auto expand internal navigation properties is set");
					})();
					return AddFieldsChangeHandler.applyChange(this.oChangeAddFields, this.oGroup, {modifier: JsControlTreeModifier, appComponent: this.oAppComponent, view: this.oView});
				}.bind(this))
				.catch(function (oError) {
					assert.ok(oError, "error is thrown when adding an element with duplicated id");
					assert.ok(oMarkAsNotApplicableSpy.calledOnce, "markAsNotApplicable function is called once");
				});
		});

		QUnit.test("applyChange - add smart field with duplicated id to xml tree", function(assert) {
			var sAddedFieldId = "addedFieldId";

			var oDOMParser = new DOMParser();
			var sGroupElementId1 = "groupId1";
			var sGroupElementId2 = "groupId2";
			var oXmlString =
				'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.ui.comp.smartform">' +
					'<Group label="GroupHeader" id="group1">' +
						'<GroupElement id="' + sGroupElementId1 + '">' +
							'<SmartField value="fieldValue1" id="sFieldId1" />' +
						'</GroupElement>' +
						'<GroupElement id="' + sGroupElementId2 + '">' +
							'<SmartField value="fieldValue2" id="sFieldId2" />' +
						'</GroupElement>' +
					'</Group>' +
				'</mvc:View>';
			var oXmlDocument = oDOMParser.parseFromString(oXmlString, "application/xml").documentElement;
			var oXmlSmartFormGroup = oXmlDocument.childNodes[0];
			return AddFieldsChangeHandler.applyChange(this.oChangeAddFields, oXmlSmartFormGroup, {modifier: XmlTreeModifier, view: oXmlDocument, appComponent: this.oAppComponent})
				.then(function () {
					assert.equal(oXmlSmartFormGroup.childElementCount, 3);
					var aChildNodes = oXmlSmartFormGroup.childNodes;
					assert.equal(aChildNodes[0].getAttribute("id"), sAddedFieldId);
					assert.equal(aChildNodes[1].getAttribute("id"), sGroupElementId1);
					assert.equal(aChildNodes[2].getAttribute("id"), sGroupElementId2);
					assert.equal(aChildNodes[0].childNodes[0].localName, "SmartField");
					assert.equal(aChildNodes[0].childNodes[0].getAttribute("id"), sAddedFieldId + "-element0");
					assert.equal(aChildNodes[0].childNodes[0].namespaceURI, "sap.ui.comp.smartfield");
					assert.equal(aChildNodes[0].childNodes[0].getAttribute("value"), "{BindingPath1}");
					/**
					 * @deprecated As of version 1.117
					 * @private
					 */
					(function() {
						assert.equal(aChildNodes[0].childNodes[0].getAttribute("expandNavigationProperties"), "true" , "auto expand internal navigation properties is set");
					})();
					return AddFieldsChangeHandler.applyChange(this.oChangeAddFields, oXmlSmartFormGroup, {modifier: XmlTreeModifier, view: oXmlDocument, appComponent: this.oAppComponent});
				}.bind(this))
				.catch(function (oError) {
					assert.ok(oError, "error is thrown when adding an element with duplicated id");
				})
				.finally(function () {
					assert.equal(oXmlSmartFormGroup.childElementCount, 3);
				});
		});
	});
});
