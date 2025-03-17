/* global QUnit */

sap.ui.define([
	"sap/base/util/uid",
	"sap/ui/comp/smartform/flexibility/changes/RenameGroup",
	"sap/ui/comp/smartform/Group",
	"sap/ui/core/util/reflection/JsControlTreeModifier",
	"sap/ui/core/util/reflection/XmlTreeModifier",
	"sap/ui/core/UIComponent",
	"sap/ui/fl/write/api/ChangesWriteAPI",
	"sap/ui/fl/Utils",
	"sap/ui/rta/enablement/elementActionTest",
	"sap/ui/thirdparty/sinon-4"
], function(
	uid,
	RenameGroupChangeHandler,
	SmartFormGroup,
	JsControlTreeModifier,
	XmlTreeModifier,
	UIComponent,
	ChangesWriteAPI,
	FlUtils,
	elementActionTest,
	sinon
) {
	"use strict";
	var sandbox = sinon.createSandbox();

	// Create Group (Create Container in Smartform)
	function confirmChildControlIsAddedWithNewLabel(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual(oViewAfterAction.byId("form").getGroups().length, 1, "then the new child control has been added");
		var oFirstGroup = oViewAfterAction.byId("form").getGroups()[0];
		assert.strictEqual(oFirstGroup.getTitle(), "New Group", "then the new added control has been renamed to the new value (New Group)");
	}

	function confirmChildControlIsRemoved(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual(oViewAfterAction.byId("form").getGroups().length, 0, "then the new added child control has been removed");
	}

	elementActionTest("Checking the createContainer action for a simple control", {
		xmlView:
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns="sap.ui.comp.smartform">' +
				'<SmartForm id="form" >' +
				'</SmartForm>' +
			'</mvc:View>'
		,
		action: {
			name: "createContainer",
			controlId: "form",
			parameter: function(oView) {
				return {
					label: 'New Group',
					newControlId: oView.createId(uid()),
					index: 0
				};
			}
		},
		afterAction: confirmChildControlIsAddedWithNewLabel,
		afterUndo: confirmChildControlIsRemoved,
		afterRedo: confirmChildControlIsAddedWithNewLabel
	});

	//Rename Group using label aggregation
	function confirmGroupIsRenamedWithNewValue(oUiComponent, oViewAfterAction, assert) {
		/**
		 * @deprecated As of version 1.88, replaced by <code>title</code> aggregation.
		 * @private
		 */
		(function() {
			assert.strictEqual(oViewAfterAction.byId("group").getTitle(), "newGroupLabel", "then the control has been renamed to the new value (newGroupLabel)");
		})();
	}

	function confirmGroupIsRenamedWithOldValue(oUiComponent, oViewAfterAction, assert) {
		/**
		 * @deprecated As of version 1.88, replaced by <code>title</code> aggregation.
		 * @private
		 */
		(function() {
			assert.strictEqual(oViewAfterAction.byId("group").getTitle(), "groupLabel", "then the control has been renamed to the old value (groupLabel)");
		})();
	}

	elementActionTest("Checking the rename action for a simple control", {
		xmlView:
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns="sap.ui.comp.smartform">' +
				'<SmartForm id="form" >' +
					'<Group id="group" title="groupLabel">' +
					'</Group>' +
				'</SmartForm>' +
			'</mvc:View>'
		,
		action: {
			name: "rename",
			controlId: "group",
			parameter: function(oView) {
				return {
					newValue: 'newGroupLabel',
					renamedElement: oView.byId("group")
				};
			}
		},
		afterAction: confirmGroupIsRenamedWithNewValue,
		afterUndo: confirmGroupIsRenamedWithOldValue,
		afterRedo: confirmGroupIsRenamedWithNewValue
	});

	function confirmGroupIsRenamedWithNewEmptyValue(oUiComponent, oViewAfterAction, assert) {
		/**
		 * @deprecated As of version 1.88, replaced by <code>title</code> aggregation.
		 * @private
		 */
		(function() {
			assert.strictEqual(oViewAfterAction.byId("group").getLabel(), "", "then the control has been renamed to the new empty value");
		})();
	}

	function confirmGroupIsRenamedWithOldValue1(oUiComponent, oViewAfterAction, assert) {
		/**
		 * @deprecated As of version 1.88, replaced by <code>title</code> aggregation.
		 * @private
		 */
		(function() {
			assert.strictEqual(oViewAfterAction.byId("group").getLabel(), "groupLabel", "then the control has been renamed to the old value (groupLabel)");
		})();
	}

	elementActionTest("Checking the rename action for a simple control with empty value", {
		xmlView:
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns="sap.ui.comp.smartform">' +
				'<SmartForm id="form" >' +
					'<Group id="group" title="groupLabel">' +
					'</Group>' +
				'</SmartForm>' +
			'</mvc:View>'
		,
		action: {
			name: "rename",
			controlId: "group",
			parameter: function(oView) {
				return {
					newValue: '',
					renamedElement: oView.byId("group")
				};
			}
		},
		afterAction: confirmGroupIsRenamedWithNewEmptyValue,
		afterUndo: confirmGroupIsRenamedWithOldValue1,
		afterRedo: confirmGroupIsRenamedWithNewEmptyValue
	});

	// Rename Group using a string in title aggregation
	function confirmGroupIsRenamed(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual(oViewAfterAction.byId("group").getTitle(), "new title", "then the control has been renamed to the new empty value");
	}

	function confirmGroupRenameIsReverted(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual(oViewAfterAction.byId("group").getTitle(), "groupLabel", "then the control has been renamed to the old value (groupLabel)");
	}

	elementActionTest("Checking the rename action using a string in title aggregation", {
		xmlView:
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns="sap.ui.comp.smartform">' +
				'<SmartForm id="form" >' +
					'<Group id="group" title="groupLabel">' +
					'</Group>' +
				'</SmartForm>' +
			'</mvc:View>'
		,
		action: {
			name: "rename",
			controlId: "group",
			parameter: function(oView) {
				return {
					newValue: "new title",
					renamedElement: oView.byId("group")
				};
			}
		},
		afterAction: confirmGroupIsRenamed,
		afterUndo: confirmGroupRenameIsReverted,
		afterRedo: confirmGroupIsRenamed
	});

	// Rename Group using a sap.ui.core.Title in title aggregation
	function confirmGroupIsRenamed2(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual(oViewAfterAction.byId("group").getTitle().getText(), "new title", "then the control has been renamed to the new empty value");
	}

	function confirmGroupRenameIsReverted2(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual(oViewAfterAction.byId("group").getTitle().getText(), "old title", "then the control has been renamed to the old value (groupLabel)");
	}

	elementActionTest("Checking the rename action using a sap.ui.core.Title in title aggregation", {
		xmlView:
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:core="sap.ui.core" xmlns="sap.ui.comp.smartform">' +
				'<SmartForm id="form" >' +
					'<Group id="group">' +
						'<title>' +
							'<core:Title text="old title" />' +
						'</title>' +
					'</Group>' +
				'</SmartForm>' +
			'</mvc:View>'
		,
		action: {
			name: "rename",
			controlId: "group",
			parameter: function(oView) {
				return {
					newValue: "new title",
					renamedElement: oView.byId("group")
				};
			}
		},
		afterAction: confirmGroupIsRenamed2,
		afterUndo: confirmGroupRenameIsReverted2,
		afterRedo: confirmGroupIsRenamed2
	});

	/**
	 * @deprecated As of version 1.88, replaced by <code>title</code> aggregation.
	 * @private
	 */
	QUnit.module("sap.ui.comp.smartform.flexibility.changes.RenameGroup edge test", {
		beforeEach: function() {
			this.oGroup = new SmartFormGroup({
				id: "group0",
				label: "old value"
			});
			this.oAppComponent = new UIComponent();
			sandbox.stub(FlUtils, "getAppComponentForControl").returns(this.oAppComponent);
			this.sNewValue = "{i18n>textKey}";
			return ChangesWriteAPI.create({
				changeSpecificData: {
					changeType: "renameGroup",
					value: this.sNewValue
				},
				selector: this.oGroup
			}).then(function(oChange) {
				this.oChange = oChange;
			}.bind(this));
		},
		afterEach: function() {
			this.oGroup.destroy();
			sandbox.restore();
		}
	}, function() {
		QUnit.test("when calling applyChange on xmlTree with a binding as new value", function(assert) {
			var oDOMParser = new DOMParser();
			var oXmlDocument = oDOMParser.parseFromString("<Group xmlns='sap.ui.comp.smartform' id='group01' label='OLD_VALUE' />", "application/xml");
			var oGroup = oXmlDocument.childNodes[0];

			return RenameGroupChangeHandler.applyChange(this.oChange, oGroup, {modifier: XmlTreeModifier, view: oXmlDocument})
				.then(function () {
					assert.equal(oGroup.getAttribute("label"), this.sNewValue, "the title of the group has been changed");
				}.bind(this));
		});

		QUnit.test("when calling applyChange on jsControlTree with a binding as new value", function(assert) {
			return RenameGroupChangeHandler.applyChange(this.oChange, this.oGroup, {modifier: JsControlTreeModifier})
				.then(function () {
					var oBindingInfo = this.oGroup.getBindingInfo("label");
					assert.equal(oBindingInfo.parts[0].path, "textKey", "property value binding path has changed as expected");
					assert.equal(oBindingInfo.parts[0].model, "i18n", "property value binding model has changed as expected");
				}.bind(this));
		});
	});
});
