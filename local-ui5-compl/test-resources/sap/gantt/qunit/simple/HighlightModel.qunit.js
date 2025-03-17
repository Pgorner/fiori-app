/*global QUnit*/
sap.ui.define(["sap/gantt/simple/HighlightModel"], function (HighlightModel) {
	"use strict";

	QUnit.module("Basic", {
		beforeEach: function () {
			this.sut = new HighlightModel("Single");
			this.sutDefault = new HighlightModel();
		},
		afterEach: function () {
			this.sut.destroy();
			this.sutDefault.destroy();
		}
	});

	QUnit.test("Highlight mode getter", function (assert) {
		//Assert
		assert.strictEqual(this.sutDefault.getHighlightMode(), "Single", "Default shape highlight mode.");
	});

	QUnit.module("Highlight", {
		beforeEach: function () {
			this.sut = new HighlightModel("Single");
		},
		afterEach: function () {
			this.sut.destroy();
		}
	});

	QUnit.test("Single shape highlight and de-emphasize", function (assert) {
		//Assert
		assert.ok(this.sut.allUid().length === 0, "Default highlighted shapes UIDs are empty.");
		assert.ok(this.sut.getHighlightedShapeID().length === 0, "Default highlighted shape objectIds are empty.");
		assert.ok(this.sut.getDeEmphasizedShapeID().length === 0, "Default de-emphasized model is empty.");
		//Act
		this.sut.updateShape("Fake_shape_uid_1", {highlighted: true});
		this.sut.updateHighlightedShapes([{ShapeId : "Shape_ObjectID_1", Highlighted: true}], false);
		//Assert
		assert.strictEqual(this.sut.allUid()[0], "Fake_shape_uid_1", "Add Shape uid 1.");
		assert.ok(this.sut.allUid().join() === "Fake_shape_uid_1", "Get all shape's uid.");
		assert.strictEqual(this.sut.getHighlightedShapeID()[0], "Shape_ObjectID_1", "Add Shape objectId 1.");
		assert.ok(this.sut.getHighlightedShapeID().join() === "Shape_ObjectID_1", "Get all shape's objectId.");
		//Act
		this.sut.updateShape("Fake_shape_uid_1", {highlighted: false});
		this.sut.updateHighlightedShapes([{ShapeId : "Shape_ObjectID_1", Highlighted: false}], false);
		//Assert
		assert.strictEqual(this.sut.allUid().join(), "", "Remove Shape uid 1.");
		assert.strictEqual(this.sut.getDeEmphasizedShapeID()[0], "Shape_ObjectID_1", "Shape_ObjectID_1 added in de-emphasized Model.");
		assert.strictEqual(this.sut.getHighlightedShapeID().join(), "", "Remove Shape objectId 1.");
		//Act
		this.sut.clear();
		this.sut.clearAllHighlightedShapeIds();
		//Assert
		assert.ok(this.sut.allUid().length === 0, "Highlighted shapes uid is cleared.");
		assert.ok(this.sut.getHighlightedShapeID().length === 0, "Highlighted shapes objectId is cleared.");
		assert.ok(this.sut.getDeEmphasizedShapeID().length === 0, "Removed Ids are added to de-emphasized Model.");
		//Act
		this.sut.updateShape("Fake_shape_uid_4", {highlighted: true});
		//Assert
		assert.strictEqual(this.sut.allUid()[0], "Fake_shape_uid_4", "Add Shape uid 4.");
		//Act
		this.sut.updateShape("Fake_shape_uid_3", {highlighted: true});
		//Assert
		assert.strictEqual(this.sut.allUid()[0], "Fake_shape_uid_3", "Add Shape uid in single mode.");
		assert.strictEqual(this.sut.existed("Fake_shape_uid_3"), true, "Shape uid existed.");
		//Act
		this.sut.clear(true);
		//Assert
		assert.ok(this.sut.allUid().length === 0, "Highlighted shapes uid is reset.");
		//Act
		this.sut.updateShape("Fake_shape_uid_5", {highlighted: true});
		//Assert
		assert.strictEqual(this.sut.existed("Fake_shape_uid_5"), true, "Shape uid existed.");
		//Act
		this.sut.clearHighlightByUid("Fake_shape_uid_5");
		//Assert
		assert.strictEqual(this.sut.existed("Fake_shape_uid_5"), false, "Shape uid does not existed.");
	});

	QUnit.module("Clear highlight on empty area",{
		beforeEach: function(){
			this.sut = new HighlightModel("Single");
		},
		afterEach: function(){
			this.sut.destroy();
		},
		assertHighlightEventFired: function(assert, oEventSpy) {
			assert.ok(oEventSpy.calledWith("highlightChanged"), "highlightChanged event fired");
		},
		assertNumberOfHighlightedEquals: function(assert, iNum) {
			assert.strictEqual(this.sut.allUid().length, iNum, "The number of highlighted objects matched");
		}
	});

	QUnit.test("Single", function(assert){
		var oSpyFireEvent = this.spy(this.sut, "fireEvent");
		this.sut.updateShape("uid1", {highlighted: true});
		this.assertNumberOfHighlightedEquals(assert, 1);
		this.assertHighlightEventFired(assert, oSpyFireEvent);
		this.sut.updateShape(null);
		this.assertNumberOfHighlightedEquals(assert, 0);
		this.assertHighlightEventFired(assert, oSpyFireEvent);
	});

	QUnit.test("Misc", function(assert){
		this.sut.updateShape("uid1", {highlighted: true});
		this.sut.updateShape(); // passing undefined also clear highlight
		this.assertNumberOfHighlightedEquals(assert, 0);
	});
});
