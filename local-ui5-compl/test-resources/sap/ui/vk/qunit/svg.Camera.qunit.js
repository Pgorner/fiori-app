/* global QUnit*/

sap.ui.define([
	"sap/ui/core/Core",
	"sap/ui/vk/svg/OrthographicCamera",
	"sap/ui/vk/svg/ViewStateManager",
	"sap/ui/vk/svg/Viewport",
	"sap/ui/vk/svg/Scene",
	"sap/ui/vk/svg/Element",
	"sap/ui/vk/svg/Rectangle",
	"sap/ui/vk/NodeContentType",
	"sap/ui/vk/VisibilityMode",
	"sap/ui/vk/ZoomTo"
], function(
	core,
	OrthographicCamera,
	ViewStateManager,
	Viewport,
	Scene,
	Element,
	Rectangle,
	NodeContentType,
	VisibilityMode,
	ZoomTo
) {
	"use strict";

	QUnit.test("SVG Camera", function(assert) {
		var camera = new OrthographicCamera();
		assert.ok(camera, "Camera created");

		var viewBox = camera._getViewBox();
		assert.deepEqual(viewBox, [0, 0, 0, 0], "Initial view box");

		assert.equal(camera.getZoomFactor(), null, "Initial zoom factor is undefined");
		camera.update(300, 150, true);
		assert.equal(camera.getZoomFactor().toFixed(5), "0.01333", "Updated zoom factor");
		assert.equal(camera._width, 300, "Initial width");
		assert.equal(camera._height, 150, "Initial height");

		var pos = camera.getPosition();
		assert.deepEqual(pos, [150, -75, 0], "Initial position");

		viewBox = camera._getViewBox();
		assert.deepEqual(viewBox, [0, 0, 300, 150], "Updated view box");

		camera.update(300, 300, false);
		assert.equal(camera.getZoomFactor().toFixed(5), "0.01333", "New zoom factor");
		assert.equal(camera._width, 300, "Updated width");
		assert.equal(camera._height, 300, "Updated height");

		// Set zoom and position manually, make sure they are changed
		camera.setZoomFactor(0.2);
		assert.equal(camera.getZoomFactor(), "0.2", "Manually set zoom factor");

		camera.setPosition([10, 20]);
		pos = camera.getPosition();
		assert.deepEqual(pos, [10, 20, 0], "Manually set position");

		// Set zoom and position manually again, the reset should revert it to first manually set values
		camera.setZoomFactor(0.05);
		camera.setPosition([100, 200]);

		assert.equal(camera.getZoomFactor(), "0.05", "Second manually set zoom factor");
		pos = camera.getPosition();
		assert.deepEqual(pos, [100, 200, 0], "Second manually set position");

		camera.reset();
		assert.equal(camera.getZoomFactor(), "0.2", "After reset zoom factor");
		pos = camera.getPosition();
		assert.deepEqual(pos, [10, 20, 0], "Position after camera reset");

		viewBox = camera._getViewBox();
		assert.deepEqual(viewBox, [5, -25, 10, 10], "Updated view box");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
