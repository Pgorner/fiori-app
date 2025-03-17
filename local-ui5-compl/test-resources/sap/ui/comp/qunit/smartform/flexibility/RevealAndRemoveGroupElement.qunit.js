sap.ui.define([
	"sap/ui/rta/enablement/elementActionTest"
], function(
	elementActionTest
) {
	"use strict";

	function confirmFieldIsRevealed(oAppComponent, oView, assert) {
		var oNewGroupElement = oView.byId("groupelement");
		var oNewButton = oView.byId("button");
		var oNewButton2 = oView.byId("button2");
		assert.ok(oNewGroupElement.getVisible(), "then the groupelement is visible");
		assert.ok(oNewButton.getVisible(), "then the button is visible");
		assert.ok(oNewButton2.getVisible(), "then the 2nd button is visible");
	}

	function confirmFieldIsHidden(oAppComponent, oView, assert) {
		var oNewGroupElement = oView.byId("groupelement");
		var oNewButton = oView.byId("button");
		var oNewButton2 = oView.byId("button2");
		assert.notOk(oNewGroupElement.getVisible(), "then the groupelement is hidden");
		assert.notOk(oNewButton.getVisible(), "then the button is hidden");
		assert.notOk(oNewButton2.getVisible(), "then the 2nd button is hidden");
	}

	elementActionTest("Checking the reveal action for a smart form group element with two hidden buttons", {
		xmlView:
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns="sap.ui.comp.smartform">' +
				'<SmartForm id="form" >' +
					'<Group id="group" >' +
						'<GroupElement id="groupelement" visible="false">' +
							'<m:Button id="button" text="button" visible="false"/>' +
							'<m:Button id="button2" text="button" visible="false"/>' +
						'</GroupElement>' +
					'</Group>' +
				'</SmartForm>' +
			'</mvc:View>'
		,
		action: {
			name: "reveal",
			controlId: "groupelement",
			parameter: function() {
				return {};
			}
		},
		afterAction: confirmFieldIsRevealed,
		afterUndo: confirmFieldIsHidden,
		afterRedo: confirmFieldIsRevealed
	});

	function confirmFieldIsRevealed2(oAppComponent, oView, assert) {
		var oNewGroupElement = oView.byId("groupelement");
		var oNewButton = oView.byId("button");
		var oNewButton2 = oView.byId("button2");
		assert.ok(oNewGroupElement.getVisible(), "then the groupelement is visible");
		assert.ok(oNewButton.getVisible(), "then the button is visible");
		assert.notOk(oNewButton2.getVisible(), "then the 2nd button is hidden");
	}

	function confirmFieldIsHidden2(oAppComponent, oView, assert) {
		var oNewGroupElement = oView.byId("groupelement");
		var oNewButton = oView.byId("button");
		var oNewButton2 = oView.byId("button2");
		assert.notOk(oNewGroupElement.getVisible(), "then the groupelement is hidden");
		assert.ok(oNewButton.getVisible(), "then the button is visible");
		assert.notOk(oNewButton2.getVisible(), "then the 2nd button is hidden");
	}

	elementActionTest("Checking the reveal action for a smart form group element with a hidden button and a visible button", {
		xmlView:
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns="sap.ui.comp.smartform">' +
				'<SmartForm id="form" >' +
					'<Group id="group" >' +
						'<GroupElement id="groupelement" visible="false">' +
							'<m:Button id="button" text="button" visible="true"/>' +
							'<m:Button id="button2" text="button" visible="false"/>' +
						'</GroupElement>' +
					'</Group>' +
				'</SmartForm>' +
			'</mvc:View>'
		,
		action: {
			name: "reveal",
			controlId: "groupelement",
			parameter: function() {
				return {
				};
			}
		},
		afterAction: confirmFieldIsRevealed2,
		afterUndo: confirmFieldIsHidden2,
		afterRedo: confirmFieldIsRevealed2
	});

	function confirmLabelAndFieldAreRevealed(oAppComponent, oView, assert) {
		var oGroupElement = oView.byId("groupelement");
		var oLabel = oGroupElement.getLabel();
		assert.ok(oLabel.getVisible(), "then the label is visible");
		confirmFieldIsRevealed2(oAppComponent, oView, assert);
	}

	function confirmLabelAndFieldAreHidden(oAppComponent, oView, assert) {
		var oGroupElement = oView.byId("groupelement");
		var oLabel = oGroupElement.getLabel();
		assert.notOk(oLabel.getVisible(), "then the label is visible");
		confirmFieldIsHidden2(oAppComponent, oView, assert);
	}

	elementActionTest("Checking the reveal action for a smart form group element with a label", {
		xmlView:
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns="sap.ui.comp.smartform">' +
				'<SmartForm id="form" >' +
					'<Group id="group" >' +
						'<GroupElement id="groupelement" visible="false">' +
							'<label>' +
								'<m:Label text="mylabelwithoutID" visible="false"/>' +
							'</label>' +
							'<m:Button id="button" text="button" visible="true"/>' +
							'<m:Button id="button2" text="button" visible="false"/>' +
						'</GroupElement>' +
					'</Group>' +
				'</SmartForm>' +
			'</mvc:View>'
		,
		action: {
			name: "reveal",
			controlId: "groupelement",
			parameter: function() {
				return {};
			}
		},
		afterAction: confirmLabelAndFieldAreRevealed,
		afterUndo: confirmLabelAndFieldAreHidden,
		afterRedo: confirmLabelAndFieldAreRevealed
	});

	function confirmGroupElementIsInvisible(oUiComponent, oViewAfterAction, assert) {
		assert.ok(oViewAfterAction.byId("groupelement").getVisible() === false, "then the GroupElement is invisible");
	}

	function confirmGroupElementIsVisible(oUiComponent, oViewAfterAction, assert) {
		assert.ok(oViewAfterAction.byId("groupelement").getVisible() === true, "then the GroupElement is visible");
	}

	elementActionTest("Checking the remove action for a group element", {
		xmlView:
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns="sap.ui.comp.smartform">' +
				'<SmartForm id="form" >' +
					'<Group id="group" >' +
						'<GroupElement id="groupelement">' +
							'<m:Button text="click me" />' +
						'</GroupElement>' +
					'</Group>' +
				'</SmartForm>' +
			'</mvc:View>'
		,
		action: {
			name: "remove",
			controlId: "groupelement",
			parameter: function(oView) {
				return {
					removedElement: oView.byId("groupelement")
				};
			}
		},
		afterAction: confirmGroupElementIsInvisible,
		afterUndo: confirmGroupElementIsVisible,
		afterRedo: confirmGroupElementIsInvisible
	});

	elementActionTest("Checking the remove and reveal action together for a group element", {
		xmlView:
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns="sap.ui.comp.smartform">' +
				'<SmartForm id="form" >' +
					'<Group id="group" >' +
						'<GroupElement id="groupelement">' +
							'<m:Button text="click me" />' +
						'</GroupElement>' +
					'</Group>' +
				'</SmartForm>' +
			'</mvc:View>'
		,
		action: {
			name: "reveal",
			controlId: "groupelement",
			parameter: function(oView) {
				return {};
			}
		},
		previousActions: [
			{
				name: "remove",
				controlId: "groupelement",
				parameter: function(oView) {
					return {
						removedElement: oView.byId("groupelement")
					};
				}
			}
		],
		changesAfterCondensing: 0,
		afterAction: confirmGroupElementIsVisible,
		afterUndo: confirmGroupElementIsVisible,
		afterRedo: confirmGroupElementIsVisible,
		changeVisualization: function(oView) {
			return {
				displayElementId: oView.byId("groupelement").getId(),
				info: {
					displayControls: [oView.byId("groupelement").getId()],
					updateRequired: true
				}
			};
		}
	});

	elementActionTest("Checking the remove, reveal, remove combination for a group element", {
		xmlView:
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns="sap.ui.comp.smartform">' +
				'<SmartForm id="form" >' +
					'<Group id="group" >' +
						'<GroupElement id="groupelement">' +
							'<m:Button text="click me" />' +
						'</GroupElement>' +
					'</Group>' +
				'</SmartForm>' +
			'</mvc:View>'
		,
		action: {
			name: "remove",
			controlId: "groupelement",
			parameter: function(oView) {
				return {
					removedElement: oView.byId("groupelement")
				};
			}
		},
		previousActions: [
			{
				name: "remove",
				controlId: "groupelement",
				parameter: function(oView) {
					return {
						removedElement: oView.byId("groupelement")
					};
				}
			},
			{
				name: "reveal",
				controlId: "groupelement",
				parameter: function() {
					return {
					};
				}
			}
		],
		changesAfterCondensing: 1,
		afterAction: confirmGroupElementIsInvisible,
		afterUndo: confirmGroupElementIsVisible,
		afterRedo: confirmGroupElementIsInvisible,
		changeVisualization: function(oView) {
			return {
				displayElementId: oView.byId("group").getId(),
				info: {
					displayControls: [oView.byId("group").getId()],
					updateRequired: true
				}
			};
		}
	});
});
