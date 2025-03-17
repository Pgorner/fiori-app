sap.ui.define([
	"sap/ui/rta/enablement/elementActionTest"
], function(
	elementActionTest
) {
	"use strict";

	var NEW_CONTROL_ID = "my_new_group";

	var confirmGroup1IsOn1stPosition = function(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual( oViewAfterAction.byId("group1").getId(), // Id of group at first position in original view
			oViewAfterAction.byId("form").getGroups()[0].getId(),	// Id of first group after change has been applied
			"then the group1 has been moved to the first position");
	};

	var confirmGroup1IsOn2ndPosition = function(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual( oViewAfterAction.byId("group1").getId(), // Id of group at second position in original view
			oViewAfterAction.byId("form").getGroups()[1].getId(),	// Id of second group after change has been applied
			"then the group1 has been moved to the second position");
	};

	var confirmNewGroupIsOn2ndPosition = function(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual( oViewAfterAction.byId(NEW_CONTROL_ID).getId(), // Id of group at second position in original view
			oViewAfterAction.byId("form").getGroups()[1].getId(),	// Id of second group after change has been applied
			"then the new created group has been moved to the second position");
	};

	elementActionTest("Checking the move action for a group", {
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
					'<Group id="group3" >' +
						'<GroupElement id="groupelement6">' +
							'<smartField:SmartField value="smartfield value 6"/>' +
						'</GroupElement>' +
						'<GroupElement id="groupelement7">' +
							'<smartField:SmartField value="smartfield value 7"/>' +
						'</GroupElement>' +
					'</Group>' +
				'</SmartForm>' +
			'</mvc:View>'
		,
		action: {
			name: "move",
			controlId: "form",
			parameter: function(oView) {
				return {
					movedElements: [{
						element: oView.byId("group1"),
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

		changesAfterCondensing: 1,
		afterAction: confirmGroup1IsOn2ndPosition,
		afterUndo: confirmGroup1IsOn1stPosition,
		afterRedo: confirmGroup1IsOn2ndPosition
	});

	elementActionTest("Checking two move actions on same group", {
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
			'<Group id="group3" >' +
			'<GroupElement id="groupelement6">' +
			'<smartField:SmartField value="smartfield value 6"/>' +
			'</GroupElement>' +
			'<GroupElement id="groupelement7">' +
			'<smartField:SmartField value="smartfield value 7"/>' +
			'</GroupElement>' +
			'</Group>' +
			'</SmartForm>' +
			'</mvc:View>'
		,
		action: {
			name: "move",
			controlId: "form",
			parameter: function(oView) {
				return {
					movedElements: [{
						element: oView.byId("group1"),
						sourceIndex: 2,
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
		previousActions: [
			{
				name: "move",
				controlId: "form",
				parameter: function(oView) {
					return {
						movedElements: [{
							element: oView.byId("group1"),
							sourceIndex: 0,
							targetIndex: 2
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
			}
		],

		changesAfterCondensing: 1,
		afterAction: confirmGroup1IsOn2ndPosition,
		afterUndo: confirmGroup1IsOn1stPosition,
		afterRedo: confirmGroup1IsOn2ndPosition
	});

	elementActionTest("Checking the add action of a new group", {
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
			name: "createContainer",
			controlId: "form",
			parameter: function(oView) {
				return {
					label : 'New Group',
					index: 0,
					newControlId: oView.createId(NEW_CONTROL_ID),
					relevantContainerId: oView.byId("form")
				};
			}
		},

		changesAfterCondensing: 1,
		afterAction: confirmGroup1IsOn2ndPosition,
		afterUndo: confirmGroup1IsOn1stPosition,
		afterRedo: confirmGroup1IsOn2ndPosition
	});

	elementActionTest("Checking the add and move action of a new group", {
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
			controlId: "form",
			parameter: function(oView) {
				return {
					movedElements: [{
						element: oView.byId(oView.createId(NEW_CONTROL_ID)),
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
		previousActions: [
			{
				name: "createContainer",
				controlId: "form",
				parameter: function(oView) {
					return {
						label : 'New Group',
						index: 0,
						newControlId: oView.createId(NEW_CONTROL_ID),
						relevantContainerId: oView.byId("form")
					};
				}
			}
		],

		changesAfterCondensing: 1,
		afterAction: confirmNewGroupIsOn2ndPosition,
		afterUndo: confirmGroup1IsOn1stPosition,
		afterRedo: confirmNewGroupIsOn2ndPosition
	});
});
