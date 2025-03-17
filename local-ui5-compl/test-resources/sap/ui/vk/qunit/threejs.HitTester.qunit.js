/* global QUnit*/

sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/vk/threejs/ViewStateManager",
	"sap/ui/vk/threejs/Viewport",
	"sap/ui/vk/threejs/HitTester",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector"
], function(
	nextUIUpdate,
	ViewStateManager,
	Viewport,
	HitTester,
	loader
) {
	"use strict";

	var viewStateManager = new ViewStateManager();
	var viewport = new Viewport({ viewStateManager: viewStateManager });
	viewport.placeAt("content");
	nextUIUpdate.runSync();

	QUnit.moduleWithContentConnector("threejs.HitTester", "test-resources/sap/ui/vk/qunit/media/model.three.json", "threejs.test.json", function(assert) {
		viewport.setContentConnector(this.contentConnector);
		viewStateManager.setContentConnector(this.contentConnector);
	});

	QUnit.test("Initialization", function(assert) {
		assert.ok(viewport, "The viewport is created.");
		assert.ok(viewport instanceof Viewport, "The viewport is sap.ui.vk.threejs.Viewport implementation.");
	});

	QUnit.test("Hit test results", function(assert) {
		var domRef = viewport.getDomRef();
		var renderer = viewport._renderer;
		var scene = viewport._getNativeScene();
		var camera = viewport._getNativeCamera();
		var hitTester = new HitTester();
		// assert.ok(renderer, "The renderer is created.");

		var maxDifference = 0.02;
		function assertClose(actual, expected, message) {
			var passes = (actual === expected) || Math.abs(actual - expected) <= maxDifference;
			assert.pushResult({ result: passes, actual: actual, expected: expected, message: message + " (" + actual + " ~ " + expected + ")" });
		}

		var cameraTestPositions = [[100, 0, 0], [0, 0, 100], [-70, -70, 0]];

		for (var i = 0; i < cameraTestPositions.length; i++) {
			camera.position.fromArray(cameraTestPositions[i]);
			camera.lookAt(0, 0, 0);
			camera.updateMatrixWorld(true);

			camera.near = 1;
			camera.far = 1000;
			camera.updateProjectionMatrix();

			for (var y = 0; y < domRef.clientHeight; y += 20) {
				for (var x = 0; x < domRef.clientWidth; x += 20) {
					var res = hitTester.hitTest(x, y, domRef.clientWidth, domRef.clientHeight, renderer, scene, camera, null);
					var resExpected = hitTester.hitTestPrecise(x, y, domRef.clientWidth, domRef.clientHeight, scene, camera, null);
					if (resExpected) {
						// console.log(resExpected.object.name, res.object.name, res.distance, res2.distance);
						assert.ok(res !== null, "hit at (" + x + ", " + y + ") " + i);
						assert.equal(res.object.uuid, resExpected.object.uuid, "hit object at (" + x + ", " + y + ")");
						assertClose(res.distance, resExpected.distance, "hit distance at (" + x + ", " + y + ") " + i);
						assertClose(res.point.x, resExpected.point.x, "hit point.x at (" + x + ", " + y + ") " + i);
						assertClose(res.point.y, resExpected.point.y, "hit point.y at (" + x + ", " + y + ") " + i);
						assertClose(res.point.z, resExpected.point.z, "hit point.z at (" + x + ", " + y + ") " + i);
					} else {
						assert.ok(res === null, "no hit at (" + x + ", " + y + ") " + i);
					}
				}
			}
		}
	});

	QUnit.moduleWithContentConnector("threejs.HitTester", "test-resources/sap/ui/vk/qunit/media/chair.json", "threejs.test.json", function(assert) {
		viewport.setContentConnector(this.contentConnector);
		viewStateManager.setContentConnector(this.contentConnector);
	});

	QUnit.test("Hit test for unselectable nodes", function(assert) {
		var domRef = viewport.getDomRef();
		var renderer = viewport._renderer;
		var scene = viewport._getNativeScene();
		var camera = viewport._getNativeCamera();
		var hitTester = new HitTester();
		var nh = this.contentConnector.getContent().getDefaultNodeHierarchy();

		camera.position.fromArray([15, 0, 2200]);
		camera.lookAt(0, 0, 0);
		camera.updateMatrixWorld(true);
		camera.near = 1;
		camera.far = 100000;
		camera.updateProjectionMatrix();

		var x = domRef.clientWidth / 2;
		var y = domRef.clientHeight / 2;

		var result = hitTester.hitTest(x, y, domRef.clientWidth, domRef.clientHeight, renderer, scene, camera, null);
		assert.strictEqual(result.object.parent.name, "seat_rest_86", "Seat assembly is hit");

		var seat = nh.findNodesByName({ value: "seat_assy" })[0];
		viewStateManager.setOpacity(seat, 0.25);
		viewStateManager.setSelectable(seat, false);
		result = hitTester.hitTest(x, y, domRef.clientWidth, domRef.clientHeight, renderer, scene, camera, null);
		assert.strictEqual(result.object.parent.name, "base_assy_80", "Base assembly is hit");

		viewStateManager.setSelectable(seat, null);
		result = hitTester.hitTest(x, y, domRef.clientWidth, domRef.clientHeight, renderer, scene, camera, null);
		assert.strictEqual(result.object.parent.name, "seat_rest_86", "Seat assembly is hit again");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
