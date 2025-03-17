/* global QUnit*/

sap.ui.define([
	"sap/ui/core/util/reflection/JsControlTreeModifier",
	"sap/ui/core/util/reflection/XmlTreeModifier",
	"sap/ui/core/util/MockServer",
	"sap/ui/core/UIComponent",
	"sap/ui/comp/smartfield/SmartField",
	"sap/ui/comp/smartform/flexibility/changes/RenameField",
	"sap/ui/comp/smartform/GroupElement",
	"sap/ui/comp/smartform/SmartForm",
	"sap/ui/fl/write/api/ChangesWriteAPI",
	"sap/ui/fl/Utils",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/rta/enablement/elementActionTest",
	"sap/ui/thirdparty/sinon-4"
], function(
	JsControlTreeModifier,
	XmlTreeModifier,
	MockServer,
	UIComponent,
	SmartField,
	RenameField,
	GroupElement,
	SmartForm,
	ChangesWriteAPI,
	FlUtils,
	ODataModel,
	elementActionTest,
	sinon
) {
	"use strict";
	var sandbox = sinon.createSandbox();

	//Mockserver
	var oMockServer = new MockServer({
		rootUri: "/smartFieldTest/"
	});

	MockServer.config({
		autoRespond: true,
		autoRespondAfter: 1000
	});

	oMockServer.simulate("test-resources/sap/ui/comp/qunit/smartform/flexibility/testResources/metadata.xml", {
		sMockdataBaseUrl: "test-resources/sap/ui/comp/qunit/smartform/flexibility/testResources",
		bGenerateMissingMockData: true
	});
	oMockServer.start();

	var oModel = new ODataModel("/smartFieldTest", {json: true, preliminaryContext: true});

	QUnit.done(function() {
		oModel.destroy();
		oMockServer.destroy();
	});

	//Rename GroupElement
	function confirmGroupElementIsRenamedWithNewValue(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual(
			oViewAfterAction.byId("groupelement").getLabel(),
			"newGroupElementLabel",
			"then the control has been renamed to the new value (newGroupElementLabel)"
		);
		assert.strictEqual(
			oViewAfterAction.byId("groupelement1").getLabel(),
			"newGroupElement1Label",
			"then the control has been renamed to the new value (newGroupElement1Label)"
		);
	}

	function confirmGroupElementIsRenamedWithOldValue(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual(
			oViewAfterAction.byId("groupelement").getLabel(),
			"groupElementLabel",
			"then the control has been renamed to the old value (groupElementLabel)"
		);
		assert.strictEqual(
			oViewAfterAction.byId("groupelement1").getLabel(),
			"groupElement1Label",
			"then the control has been renamed to the old value (groupElement1Label)"
		);
	}

	elementActionTest("Checking the rename action for a GroupElement", {
		xmlView:
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns="sap.ui.comp.smartform">' +
				'<SmartForm id="form">' +
					'<Group id="group" >' +
						'<GroupElement id="groupelement" label="groupElementLabel">' +
							'<m:Button text="click me" />' +
						'</GroupElement>' +
						'<GroupElement id="groupelement1" label="groupElement1Label">' +
							'<m:Button text="click me too" />' +
						'</GroupElement>' +
					'</Group>' +
				'</SmartForm>' +
			'</mvc:View>'
		,
		action: {
			name: "rename",
			controlId: "groupelement",
			parameter: function(oView) {
				return {
					newValue: "newGroupElementLabel",
					renamedElement: oView.byId("groupelement")
				};
			}
		},
		previousActions: [
			{
				name: "rename",
				controlId: "groupelement",
				parameter: function(oView) {
					return {
						newValue: "intermediateLabel",
						renamedElement: oView.byId("groupelement")
					};
				}
			},
			{
				name: "rename",
				controlId: "groupelement1",
				parameter: function(oView) {
					return {
						newValue: "intermediateLabel1",
						renamedElement: oView.byId("groupelement1")
					};
				}
			},
			{
				name: "rename",
				controlId: "groupelement1",
				parameter: function(oView) {
					return {
						newValue: "newGroupElement1Label",
						renamedElement: oView.byId("groupelement1")
					};
				}
			}
		],
		changesAfterCondensing: 2,
		afterAction: confirmGroupElementIsRenamedWithNewValue,
		afterUndo: confirmGroupElementIsRenamedWithOldValue,
		afterRedo: confirmGroupElementIsRenamedWithNewValue
	});

	//Rename GroupElement	with an empty string
	function confirmGroupElementIsRenamedWithEmptyStringValue(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual(oViewAfterAction.byId("groupelement1").getLabel(), "", "then the control has been renamed to the new value (empty string)");
	}

	function confirmGroupElementIsRenamedWithOldValue1(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual(oViewAfterAction.byId("groupelement1").getLabel(),"groupElementLabel1" , "then the control has been renamed to the old value (groupElementLabel1)");
	}

	elementActionTest("Checking the rename action with an empty string for a GroupElement", {
		xmlView:
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns="sap.ui.comp.smartform">' +
				'<SmartForm id="form1">' +
					'<Group id="group1" >' +
						'<GroupElement id="groupelement1" label="groupElementLabel1">' +
							'<m:Button text="click me" />' +
						'</GroupElement>' +
					'</Group>' +
				'</SmartForm>' +
			'</mvc:View>'
		,
		action: {
			name: "rename",
			controlId: "groupelement1",
			parameter: function(oView) {
				return {
					newValue: "",
					renamedElement: oView.byId("groupelement1")
				};
			}
		},
		afterAction: confirmGroupElementIsRenamedWithEmptyStringValue,
		afterUndo: confirmGroupElementIsRenamedWithOldValue1,
		afterRedo: confirmGroupElementIsRenamedWithEmptyStringValue
	});

	//Rename GroupElement with a label from a SmartField
	function confirmGroupElementIsRenamedWithNewValue2(oUiComponent, oViewAfterAction, assert) {
		var oControl = oViewAfterAction.byId("groupelement2");
		assert.strictEqual(oControl.getLabelText(), "newGroupElementLabel", "then the control has been renamed to the new value (newGroupElementLabel)");
	}

	function confirmGroupElementIsRenamedWithOldValue2(oUiComponent, oViewAfterAction, assert) {
		var oControl = oViewAfterAction.byId("groupelement2");
		assert.strictEqual(oControl.getLabelText(), "Product Type", "then the control has been renamed to the old value (Product Type)");
	}

	elementActionTest("Checking the rename action for a GroupElement containing a SmartField", {
		xmlView:
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns:sf="sap.ui.comp.smartfield" xmlns="sap.ui.comp.smartform">' +
				'<SmartForm id="form2" binding="{/mockProductData(1)}">' +
					'<Group id="group2" >' +
						'<GroupElement id="groupelement2">' +
							'<sf:SmartField editable="true" contextEditable="true" value="{ProductName}"/>' +
						'</GroupElement>' +
					'</Group>' +
				'</SmartForm>' +
			'</mvc:View>'
		,
		action: {
			name: "rename",
			controlId: "groupelement2",
			parameter: function(oView) {
				return {
					newValue: 'newGroupElementLabel',
					renamedElement: oView.byId("groupelement2")
				};
			}
		},
		model: oModel,
		afterAction: confirmGroupElementIsRenamedWithNewValue2,
		afterUndo: confirmGroupElementIsRenamedWithOldValue2,
		afterRedo: confirmGroupElementIsRenamedWithNewValue2
	});

	QUnit.module("RenameField with label property which is binding in change content", {
		beforeEach: function() {
			var oAppComponent = new UIComponent();
			this.mPropertyBag = {modifier: JsControlTreeModifier, appComponent: oAppComponent};
			this.oChangeHandler = RenameField;
			this.sNewValue = "{i18n>textKey}";
			this.oSmartForm = new SmartForm({
				id: "Smartform"
			});
			this.oGroupElement = new GroupElement({
				id: "group0",
				label: "old value"
			});
			sandbox.stub(FlUtils, "getAppComponentForControl").returns(oAppComponent);

			var oDOMParser = new DOMParser();
			this.oXmlDocument = oDOMParser.parseFromString("<mvc:view xmlns:mvc='sap.ui.core.mvc' xmlns='sap.ui.comp.smartform' id='view'><SmartForm id='form' title='OLD_VALUE' /><GroupElement id='GroupElement' label='OLD_VALUE' /></mvc:view>", "application/xml").documentElement;
			this.oXmlSmartForm = this.oXmlDocument.childNodes[0];
			this.oXmlGroupElement = this.oXmlDocument.childNodes[1];

			return ChangesWriteAPI.create({
				changeSpecificData: {
					value: this.sNewValue,
					changeType: "renameField"
				},
				selector: this.oGroupElement
			}).then(function(oChange) {
				this.oLabelChange = oChange;
			}.bind(this));
		},
		afterEach: function() {
			this.oSmartForm.destroy();
			this.oGroupElement.destroy();
			sandbox.restore();
		}
	}, function() {
		QUnit.test("applyChanges with XmlTreeModifier", function(assert) {
			return this.oChangeHandler.applyChange(this.oLabelChange, this.oXmlGroupElement, {modifier: XmlTreeModifier, view: this.oXmlDocument})
				.then(function () {
					assert.equal(this.oXmlGroupElement.getAttribute("label"), this.sNewValue);
				}.bind(this));
		});

		QUnit.test("applyChanges with JsControlTreeModifier", function(assert) {
			return this.oChangeHandler.applyChange(this.oLabelChange, this.oGroupElement, {modifier: JsControlTreeModifier})
				.then(function () {
					var oBindingInfo = this.oGroupElement.getBindingInfo("label");
					assert.equal(oBindingInfo.parts[0].path, "textKey", "property value binding path has changed as expected");
					assert.equal(oBindingInfo.parts[0].model, "i18n", "property value binding model has changed as expected");
				}.bind(this));
		});
	});
});
