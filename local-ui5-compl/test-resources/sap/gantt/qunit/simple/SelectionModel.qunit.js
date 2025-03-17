/*global QUnit,sinon*/
sap.ui.define(["sap/gantt/simple/SelectionModel"], function (SelectionModel) {
	"use strict";

	QUnit.module("Basic", {
		beforeEach: function () {
			this.sut = new SelectionModel(sap.gantt.SelectionMode.Multiple);
			this.sutDefault = new SelectionModel();
		},
		afterEach: function () {
			this.sut.destroy();
			this.sutDefault.destroy();
		}
	});

	QUnit.test("Selection mode getter and setter", function (assert) {
		//Assert
		assert.strictEqual(this.sutDefault.getSelectionMode(), sap.gantt.SelectionMode.Single, "Default shape selection mode.");

		assert.strictEqual(this.sut.getSelectionMode(), sap.gantt.SelectionMode.Multiple, "Configured shape selection mode.");

		//Act
		this.sut.setSelectionMode();
		//Assert
		assert.strictEqual(this.sut.getSelectionMode(), sap.gantt.SelectionMode.Single, "Set shape selection mode to default.");
		//Act
		this.sut.setSelectionMode(sap.gantt.SelectionMode.Multiple);
		//Assert
		assert.strictEqual(this.sut.getSelectionMode(), sap.gantt.SelectionMode.Multiple, "Set shape selection mode to configured.");
	});

	QUnit.module("Selection", {
		beforeEach: function () {
			this.sut = new SelectionModel(sap.gantt.SelectionMode.Multiple);
		},
		afterEach: function () {
			this.sut.destroy();
		}
	});

	QUnit.test("Single shape selection and deselection", function (assert) {
		//Assert
		assert.ok(this.sut.allUid().length === 0, "Default selected shapes UIDs are empty.");
		assert.ok(this.sut.getSelectedShapeIDS().length === 0, "Default selected shape objectIds are empty.");
		assert.ok(this.sut.getDeSelectedShapeIDS().length === 0, "Default deselection model is empty.");
		//Act
		this.sut.updateShape("Fake_shape_uid_1", {selected: true});
		this.sut.setSelectionMode(sap.gantt.SelectionMode.MultiWithKeyboard);
		this.sut.updateShape("Fake_shape_uid_2", {selected: true, ctrl: true});
		this.sut.updateSelectedShapes([{ShapeId : "Shape_ObjectID_1", Selected: true}], false);
		this.sut.updateSelectedShapes([{ShapeId : "Shape_ObjectID_2", Selected: true}], false);
		//Assert
		assert.strictEqual(this.sut.allUid()[0], "Fake_shape_uid_1", "Add Shape uid 1.");
		assert.strictEqual(this.sut.allUid()[1], "Fake_shape_uid_2", "Add Shape uid 2.");
		assert.ok(this.sut.allUid().join("|") === "Fake_shape_uid_1|Fake_shape_uid_2", "Get all shape's uid.");

		assert.strictEqual(this.sut.getSelectedShapeIDS()[0], "Shape_ObjectID_1", "Add Shape objectId 1.");
		assert.strictEqual(this.sut.getSelectedShapeIDS()[1], "Shape_ObjectID_2", "Add Shape objectId 2.");
		assert.ok(this.sut.getSelectedShapeIDS().join("|") === "Shape_ObjectID_1|Shape_ObjectID_2", "Get all shape's objectId.");
		//Act
		this.sut.updateShape("Fake_shape_uid_1", {selected: false, ctrl: true});

		this.sut.updateSelectedShapes([{ShapeId : "Shape_ObjectID_1", Selected: false}], false);
		//Assert
		assert.strictEqual(this.sut.allUid()[0], "Fake_shape_uid_2", "Remove Shape uid 1.");
		assert.strictEqual(this.sut.getDeSelectedShapeIDS()[0], "Shape_ObjectID_1", "Shape_ObjectID_1 added in deSelection Model.");
		assert.strictEqual(this.sut.getSelectedShapeIDS()[0], "Shape_ObjectID_2", "Remove Shape objectId 1.");
		//Act
		this.sut.clearAllSelectedShapeIds();
		assert.ok(this.sut.getDeSelectedShapeIDS().length !== 0, "Removed Ids are added to deselection Model.");
		assert.ok(this.sut.getSelectedShapeIDS().length === 0, "Selected shapes objectId is cleared.");
		assert.ok(this.sut.allUid().length === 0, "Selected shapes uid is cleared.");
		//Act
		this.sut.clear();
		//Assert
		assert.ok(this.sut.allUid().length === 0, "Selected shapes uid is cleared.");
		//Act
		this.sut.updateShape("Fake_shape_uid_4", {selected: true, ctrl: false});
		//Assert
		assert.strictEqual(this.sut.allUid()[0], "Fake_shape_uid_4", "Add Shape uid 4.");
		//Act
		this.sut.setSelectionMode(sap.gantt.SelectionMode.Single);
		this.sut.updateShape("Fake_shape_uid_3", {selected: true, ctrl: false});
		//Assert
		assert.strictEqual(this.sut.allUid()[0], "Fake_shape_uid_3", "Add Shape uid in single mode.");
		assert.strictEqual(this.sut.existed("Fake_shape_uid_3"), true, "Shape uid existed.");
		//Act
		this.sut.clear(true);
		//Assert
		assert.ok(this.sut.allUid().length === 0, "Selected shapes uid is reset.");
		//Act
		this.sut.updateShape("Fake_shape_uid_5", {selected: true, ctrl: false});
		//Assert
		assert.strictEqual(this.sut.existed("Fake_shape_uid_5"), true, "Shape uid existed.");
		//Act
		this.sut.clearSelectionByUid("Fake_shape_uid_5");
		//Assert
		assert.strictEqual(this.sut.existed("Fake_shape_uid_5"), false, "Shape uid does not existed.");
	});

	QUnit.test("Multiple shape selection and deselection", function (assert) {
		//Assert 0
		assert.ok(this.sut.allUid().length === 0, "Default selected shapes UIDs are empty.");
		//Arrange 1
		this.sut.attachEventOnce("selectionChanged", function (oEvent) {
			//Assert 1
			assert.deepEqual(oEvent.getParameter("shapeUid"), ["Fake_shape_uid_1", "Fake_shape_uid_2", "Fake_shape_uid_3"], "Event should contain selected shape UIDs.");
			assert.deepEqual(oEvent.getParameter("deselectedUid"), [], "Event should not contain any deselected shape UIDs.");
			assert.notOk(oEvent.getParameter("silent"), "Event should not be silent when performing selection.");
		});

		//Act 1
		this.sut.updateShapes({
			"Fake_shape_uid_1": {
				selected: true
			},
			"Fake_shape_uid_2": {
				selected: true
			},
			"Fake_shape_uid_3": {
				selected: true
			}
		});

		this.sut.updateSelectedShapes([
				{ShapeId : "Shape_ObjectID_1", Selected: true},
				{ShapeId : "Shape_ObjectID_2", Selected: true},
				{ShapeId : "Shape_ObjectID_3", Selected: true}
			], false);

		assert.deepEqual(this.sut.getSelectedShapeIDS(), ["Shape_ObjectID_1", "Shape_ObjectID_2", "Shape_ObjectID_3"], "object SelectionModel should have all the selected shape objectId.");
		//Arrange 2
		this.sut.attachEventOnce("selectionChanged", function (oEvent) {
			//Assert 2
			assert.deepEqual(oEvent.getParameter("shapeUid"), ["Fake_shape_uid_1"], "Event should contain all currently selected shape UIDs.");
			assert.deepEqual(oEvent.getParameter("deselectedUid"), ["Fake_shape_uid_2", "Fake_shape_uid_3"], "Event should contain deselected shape UIDs.");
			assert.notOk(oEvent.getParameter("silent"), "Event should not be silent when performing deselection.");
		});

		//Act 2
		this.sut.updateShapes({
			"Fake_shape_uid_2": {
				selected: false
			},
			"Fake_shape_uid_3": {
				selected: false
			}
		});

		this.sut.updateSelectedShapes([
			{ShapeId : "Shape_ObjectID_2", Selected: false},
			{ShapeId : "Shape_ObjectID_3", Selected: false}
		], false);

		assert.deepEqual(this.sut.getSelectedShapeIDS(), ["Shape_ObjectID_1"], "object SelectionModel should have all currently selected shape objectId.");

		this.sut.updateSelectedShapes([], false);

		assert.deepEqual(this.sut.getSelectedShapeIDS(), [], "object SelectionModel should be cleared.");
		//Arrange 3
		this.sut.attachEventOnce("selectionChanged", function (oEvent) {
			//Assert 3
			assert.deepEqual(oEvent.getParameter("shapeUid"), ["Fake_shape_uid_1", "Fake_shape_uid_4"], "Event should contain all currently selected shape UIDs.");
			assert.deepEqual(oEvent.getParameter("deselectedUid"), [], "Event should not contain any deselected shape UIDs.");
			assert.notOk(oEvent.getParameter("silent"), "Event should not be silent when performing deselection.");
		});

		//Act 3
		this.sut.updateShapes({
			"Fake_shape_uid_4": {
				selected: true
			}
		});

		//Arrange 4
		var oFireSelectionChangedSpy = sinon.spy(this.sut, "fireSelectionChanged");

		//Act 4
		this.sut.updateShapes();

		//Assert 4
		assert.ok(oFireSelectionChangedSpy.notCalled, "The selectionChanged event should not be called on an empty parameter.");
		assert.deepEqual(this.sut.mSelected.uid, {
			// undefined values are there because the Shape was not rendered to SVG yet
			"Fake_shape_uid_1": {
				"draggable": undefined,
				"endTime": undefined,
				"shapeUid": "Fake_shape_uid_1",
				"time": undefined
			},
			"Fake_shape_uid_4": {
				"draggable": undefined,
				"endTime": undefined,
				"shapeUid": "Fake_shape_uid_4",
				"time": undefined
			}
		}, "The state of the SelectionModel should be correct.");

		//Act
		this.sut.updateSelectedShapes([], true);

		//Assert
		assert.deepEqual(this.sut.getSelectedShapeIDS(), [], "object SelectionModel should be cleared.");
		assert.deepEqual(this.sut.allUid(), [], "Selected Shape Uid are also cleared.");

		//Act
		this.sut.updateShapes({
			"Fake_shape_uid_1": {
				selected: true
			},
			"Fake_shape_uid_2": {
				selected: true
			},
			"Fake_shape_uid_3": {
				selected: true
			}
		});

		this.sut.clearSelectionByUid("Fake_shape_uid_2");

		//Assert
		assert.deepEqual(this.sut.mSelected.uid, {
			"Fake_shape_uid_1": {
				"draggable": undefined,
				"endTime": undefined,
				"shapeUid": "Fake_shape_uid_1",
				"time": undefined
			},
			"Fake_shape_uid_3": {
				"draggable": undefined,
				"endTime": undefined,
				"shapeUid": "Fake_shape_uid_3",
				"time": undefined
			}
		}, "Fake_shape_uid_2 removed from selection model.");

		//Cleanup
		oFireSelectionChangedSpy.restore();
	});

	QUnit.module("Clear selection on empty area",{
		beforeEach: function(){
			this.sut = new SelectionModel();
		},
		afterEach: function(){
			this.sut.destroy();
		},
		assertSelectionEventFired: function(assert, oEventSpy) {
			assert.ok(oEventSpy.calledWith("selectionChanged"), "selectionChanged event fired");
		},
		assertNumberOfSelectedEquals: function(assert, iNum) {
			assert.strictEqual(this.sut.allUid().length, iNum, "The number of selected objects matched");
		}
	});

	QUnit.test("Single", function(assert){
		this.sut.setSelectionMode(sap.gantt.SelectionMode.Single);
		var oSpyFireEvent = this.spy(this.sut, "fireEvent");

		this.sut.updateShape("uid1", {selected: true});
		this.assertNumberOfSelectedEquals(assert, 1);
		this.assertSelectionEventFired(assert, oSpyFireEvent);

		this.sut.updateShape(null);
		this.assertNumberOfSelectedEquals(assert, 0);
		this.assertSelectionEventFired(assert, oSpyFireEvent);
	});

	QUnit.test("MultiWithKeyboard", function(assert){
		var oSpyFireEvent = this.spy(this.sut, "fireEvent");
		this.sut.setSelectionMode(sap.gantt.SelectionMode.MultiWithKeyboard);

		this.sut.updateShape("uid1", {selected: true});
		this.sut.updateShape("uid2", {selected: true});
		this.assertNumberOfSelectedEquals(assert, 1);
		assert.ok(oSpyFireEvent.calledTwice, "fireEvent called Twice");

		this.sut.updateShape("uid3", {selected: true, ctrl: true});
		this.assertNumberOfSelectedEquals(assert, 2);
		this.assertSelectionEventFired(assert, oSpyFireEvent);
	});

	QUnit.test("MultiWithKeyboardAndLasso", function(assert){
		var oSpyFireEvent = this.spy(this.sut, "fireEvent");
		this.sut.setSelectionMode(sap.gantt.SelectionMode.MultiWithKeyboardAndLasso);

		this.sut.updateShape("uid1", {selected: true});
		this.sut.updateShape("uid2", {selected: true});
		this.assertNumberOfSelectedEquals(assert, 1);
		assert.ok(oSpyFireEvent.calledTwice, "fireEvent called Twice");

		this.sut.updateShape("uid3", {selected: true, ctrl: true});
		this.assertNumberOfSelectedEquals(assert, 2);
		this.assertSelectionEventFired(assert, oSpyFireEvent);
	});

	QUnit.test("Multiple", function(assert){
		var oSpyFireEvent = this.spy(this.sut, "fireEvent");
		this.sut.setSelectionMode(sap.gantt.SelectionMode.Multiple);

		this.sut.updateShape("uid1", {selected: true});
		this.sut.updateShape("uid2", {selected: true});
		this.sut.updateShape("uid3", {selected: true});
		this.assertNumberOfSelectedEquals(assert, 3);

		this.sut.updateShape("uid1", {selected: false});
		this.assertNumberOfSelectedEquals(assert, 2);

		this.sut.updateShape(null);

		// clear all selections
		this.assertNumberOfSelectedEquals(assert, 0);
		this.assertSelectionEventFired(assert, oSpyFireEvent);
	});

	QUnit.test("MultipleWithLasso", function(assert){
		var oSpyFireEvent = this.spy(this.sut, "fireEvent");
		this.sut.setSelectionMode(sap.gantt.SelectionMode.MultipleWithLasso);

		this.sut.updateShape("uid1", {selected: true});
		this.sut.updateShape("uid2", {selected: true});
		this.sut.updateShape("uid3", {selected: true});
		this.assertNumberOfSelectedEquals(assert, 3);

		this.sut.updateShape("uid1", {selected: false});
		this.assertNumberOfSelectedEquals(assert, 2);

		this.sut.updateShape(null);

		// clear all selections
		this.assertNumberOfSelectedEquals(assert, 0);
		this.assertSelectionEventFired(assert, oSpyFireEvent);
	});

	QUnit.test("Misc", function(assert){
		this.sut.setSelectionMode(sap.gantt.SelectionMode.Multiple);
		this.sut.updateShape("uid1", {selected: true});
		this.sut.updateShape(); // passing undefined also clear selection
		this.assertNumberOfSelectedEquals(assert, 0);

		var oSpyFireEvent = this.spy(this.sut, "fireEvent");
		this.sut.setSelectionMode(sap.gantt.SelectionMode.None);
		this.sut.updateShape("uid1", {selected: true});
		// None selection mode do nothing here
		this.assertNumberOfSelectedEquals(assert, 0);
		assert.ok(oSpyFireEvent.notCalled, "None selectionMode shouldn't fire any event");
	});

	QUnit.test("Update shape calls fireSelectionChanged event", function(assert){
		var oSpyFireEvent = this.spy(this.sut, "fireEvent");
		this.sut.updateShape("uid1", {selected: true},false);
		assert.equal(oSpyFireEvent.callCount,1, "SelectionChanged event fired when shape is selectable");
		oSpyFireEvent.restore();
	});

	QUnit.test("Update shape doesn't call fireSelectionChanged event", function(assert){
		var oSpyFireEvent = this.spy(this.sut, "fireEvent");
		this.sut.updateShape("uid1", {selected: true},true);
		assert.equal(oSpyFireEvent.callCount,0, "SelectionChanged event not fired when shape is not selectable");
		oSpyFireEvent.restore();
	});

});
