/* global QUnit */

sap.ui.define([
	"sap/ui/comp/smartform/SmartForm",
	"sap/ui/comp/smartform/flexibility/changes/MoveGroups",
	"sap/ui/core/util/reflection/JsControlTreeModifier",
	"sap/ui/core/UIComponent",
	"sap/ui/fl/write/api/ChangesWriteAPI",
	"sap/ui/fl/Utils",
	"sap/ui/rta/enablement/elementActionTest",
	"sap/ui/thirdparty/sinon-4"
], function(
	SmartForm,
	MoveGroupsChangeHandler,
	JsControlTreeModifier,
	UIComponent,
	ChangesWriteAPI,
	FlUtils,
	elementActionTest,
	sinon
) {
	"use strict";
	var sandbox = sinon.createSandbox();

	//Remove Group
	function confirmGroupElementIsInvisible(oUiComponent, oViewAfterAction, assert) {
		assert.ok(oViewAfterAction.byId("group").getVisible() === false, "then the Group is invisible");
	}

	function confirmGroupElementIsVisible(oUiComponent, oViewAfterAction, assert) {
		assert.ok(oViewAfterAction.byId("group").getVisible() === true, "then the Group is visible");
	}

	elementActionTest("Checking the remove action for a group element", {
		xmlView:
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns="sap.ui.comp.smartform">' +
				'<SmartForm id="form" >' +
					'<Group id="group" title="groupLabel">' +
					'</Group>' +
				'</SmartForm>' +
			'</mvc:View>'
		,
		action: {
			name: "remove",
			controlId: "group",
			parameter: function(oView) {
				return {
					removedElement: oView.byId("group")
				};
			}
		},
		afterAction: confirmGroupElementIsInvisible,
		afterUndo: confirmGroupElementIsVisible,
		afterRedo: confirmGroupElementIsInvisible
	});

	//Move Group
	var confirmGroupElementIsMoved = function(oUiComponent, oViewAfterAction, assert) {
		assert.equal(oViewAfterAction.byId("form").getGroups()[1], oViewAfterAction.byId("group0"), "the group was moved");
	};

	var confirmGroupElementIsMovedBack = function(oUiComponent, oViewAfterAction, assert) {
		assert.equal(oViewAfterAction.byId("form").getGroups()[0], oViewAfterAction.byId("group0"), "the group was moved back");
	};

	elementActionTest("Checking the move action for a group element", {
		xmlView:
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns="sap.ui.comp.smartform">' +
				'<SmartForm id="form" >' +
					'<Group id="group0" title="groupLabel0">' +
					'</Group>' +
					'<Group id="group1" title="groupLabel1">' +
					'</Group>' +
				'</SmartForm>' +
			'</mvc:View>'
		,
		action: {
			name: "move",
			controlId: "group0",
			parameter: function(oView) {
				return {
					movedElements: [{
						element: oView.byId("group0"),
						sourceIndex: 0,
						targetIndex: 1
					}],
					source: {
						aggregation: "groups",
						parent: oView.byId("form")
					},
					target: {
						aggregation: "groups",
						parent: oView.byId("form")
					}
				};
			}
		},
		afterAction: confirmGroupElementIsMoved,
		afterUndo: confirmGroupElementIsMovedBack,
		afterRedo: confirmGroupElementIsMoved
	});

	function createAndApplyChange(oSelector, oChangeSpecificData, sPropertyName, vPropertyValue) {
		return ChangesWriteAPI.create({
			changeSpecificData: oChangeSpecificData,
			selector: oSelector
		}).then(function(oChange) {
			if (sPropertyName) {
				if (vPropertyValue) {
					oChange.getContent()[sPropertyName] = vPropertyValue;
				} else {
					delete oChange.getContent()[sPropertyName];
				}
			}
			return MoveGroupsChangeHandler.applyChange(oChange, oSelector, { modifier: JsControlTreeModifier });
		});
	}

	QUnit.module("sap.ui.comp.smartform.flexibility.changes.MoveGroups - Invalid change supplied to applyChange", {
		beforeEach: function() {
			this.oSmartForm = new SmartForm("smartForm");
			this.oAppComponent = new UIComponent();
			sandbox.stub(FlUtils, "getAppComponentForControl").returns(this.oAppComponent);
		},
		afterEach: function() {
			this.oSmartForm.destroy();
			sandbox.restore();
		}
	}, function() {
		QUnit.test("corrupt change content during apply", function(assert) {
			var oChangeSpecificData = {
				changeType: "moveGroups",
				movedElements: [{
					id: "dummy",
					targetIndex: 1
				}],
				source: {
					id: "dummy"
				},
				target: {
					id: "dummy"
				}
			};

			return createAndApplyChange(this.oSmartForm, oChangeSpecificData, "moveGroups")
			.catch(function(oError) {
				assert.equal(oError.message, "Change format invalid");

				return createAndApplyChange(this.oSmartForm, oChangeSpecificData, "moveGroups", []);
			}.bind(this))
			.catch(function(oError) {
				assert.equal(oError.message, "Change format invalid");

				return createAndApplyChange(this.oSmartForm, oChangeSpecificData, "moveGroups", [{
					key: "key", id: "id"
				}]);
			}.bind(this))
			.catch(function(oError) {
				assert.equal(oError.message, "Change format invalid - moveGroups element index attribute is no number");

				return createAndApplyChange(this.oSmartForm, oChangeSpecificData, "moveGroups", [{
					key: "key", index: "1"
				}]);
			}.bind(this))
			.catch(function(oError) {
				assert.equal(oError.message, "Change format invalid - moveGroups element has no id attribute");

				return createAndApplyChange(this.oSmartForm, oChangeSpecificData, "moveGroups", [{
					key: "key", index: "1"
				}]);
			}.bind(this))
			.catch(function(oError) {
				assert.equal(oError.message, "Change format invalid - moveGroups element has no id attribute");
			});
		});

		QUnit.test("missing information for completeChangeContent", function(assert) {
			return ChangesWriteAPI.create({
				changeSpecificData: {
					changeType: "moveGroups",
					source: {
						id: "dummy"
					},
					target: {
						id: "dummy"
					}
				},
				selector: this.oSmartForm
			})
			.catch(function(oError) {
				assert.equal(oError.message, "oSpecificChangeInfo.movedElements attribute required", "the correct error message is returned");

				return ChangesWriteAPI.create({
					changeSpecificData: {
						changeType: "moveGroups",
						movedElements: [],
						source: {
							id: "dummy"
						},
						target: {
							id: "dummy"
						}
					},
					selector: this.oSmartForm
				});
			}.bind(this))
			.catch(function(oError) {
				assert.equal(oError.message, "MovedElements array is empty", "the correct error message is returned");

				return ChangesWriteAPI.create({
					changeSpecificData: {
						changeType: "moveGroups",
						movedElements: [{
							targetIndex: 1
						}],
						source: {
							id: "dummy"
						},
						target: {
							id: "dummy"
						}
					},
					selector: this.oSmartForm
				});
			}.bind(this))
			.catch(function(oError) {
				assert.equal(oError.message, "MovedElements element has no id attribute", "the correct error message is returned");

				return ChangesWriteAPI.create({
					changeSpecificData: {
						changeType: "moveGroups",
						movedElements: [{
							id: "dummy"
						}],
						source: {
							id: "dummy"
						},
						target: {
							id: "dummy"
						}
					},
					selector: this.oSmartForm
				});
			}.bind(this))
			.catch(function(oError) {
				assert.equal(oError.message, "Index attribute at MovedElements element is no number", "the correct error message is returned");

				return ChangesWriteAPI.create({
					changeSpecificData: {
						changeType: "moveGroups",
						movedElements: [{
							id: "dummy",
							targetIndex: "1"
						}],
						source: {
							id: "dummy"
						},
						target: {
							id: "dummy"
						}
					},
					selector: this.oSmartForm
				});
			}.bind(this))
			.catch(function(oError) {
				assert.equal(oError.message, "Index attribute at MovedElements element is no number", "the correct error message is returned");
			});
		});
	});
});
