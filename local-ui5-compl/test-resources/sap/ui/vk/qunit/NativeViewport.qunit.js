/* global QUnit*/

sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/NativeViewport",
	"sap/ui/vk/ContentConnector",
	"sap/ui/vk/ContentResource"
], function(
	nextUIUpdate,
	jQuery,
	NativeViewport,
	ContentConnector,
	ContentResource
) {
	"use strict";

	var connector = new ContentConnector();
	var nativeViewport = new NativeViewport();
	nativeViewport.setContentConnector(connector);
	nativeViewport.placeAt("content");
	nextUIUpdate.runSync();

	function loadImage(url, imageType) {
		return new Promise((resolve, reject) => {
			var handler = e => {
				var failure = e.getParameter("failureReason")
				if (failure != null) {
					reject(failure.errorMessage);
				} else {
					resolve(e.getParameter("content"));
				}
				connector.detachContentChangesFinished(handler);
			}
			connector.destroyContentResources();
			connector.attachContentChangesFinished(handler);
			connector.addContentResource(new ContentResource({
				source: url,
				sourceType: imageType
			}));
		});
	};

	var commandRun = false;
	var queueThisCommand = function() {
		commandRun = true;
	};

	QUnit.test("Load JPG", function(assert) {
		var done = assert.async();
		loadImage("test-resources/sap/ui/vk/qunit/media/cat.jpg", "jpg").then(
			() => assert.ok(true, "valid jpg should load"),
			() => assert.ok(false, "valid jpg should load")
		).finally(() =>
			done()
		);
	});

	QUnit.test("Missing image", function(assert) {
		var done = assert.async();
		loadImage("test-resources/sap/ui/vk/qunit/media/picture_does_not_exist.jpg", "jpg").then(
			() => assert.ok(false, "inexistent jpg should not load"),
			() => assert.ok(true, "inexistent jpg should not load")
		).finally(() => {
			done()
		});
	});

	QUnit.test("Cannot load non-images", function(assert) {
		var done = assert.async();
		loadImage("test-resources/sap/ui/vk/qunit/media/box.vds", "jpg").then(
			() => assert.ok(false, "invalid resource type should not load (for example, vds extension)"),
			() => assert.ok(true, "invalid resource type should not load (for example, vds extension)")
		).finally(() => {
			done()
		});
	});

	QUnit.test("Load SVG", function(assert) {
		var done = assert.async();
		loadImage("test-resources/sap/ui/vk/qunit/media/Che.svg", "svg").then(
			() => assert.ok(true, "valid svg, not interactive, should load"),
			() => assert.ok(false, "valid svg, not interactive, should load")
		).finally(() => {
			done()
		});
	});

	QUnit.test("Viewport gestures", function(assert) {
		var done = assert.async();
		loadImage("test-resources/sap/ui/vk/qunit/media/cat.jpg", "jpg").then(
			function() {
				this.queueCommand(queueThisCommand);
				assert.ok(commandRun, "The queued command was run.");

				var customViewInfo = {
					camera: [1, 0, 0, 1, 2, 2]
				};

				this.setViewInfo(customViewInfo);
				var retrievedViewInfo = this.getViewInfo();

				assert.propEqual(customViewInfo, retrievedViewInfo, "The retrieved view info is the same with the one that was used in setViewInfo.");

				var gestureCoordinates = {};
				gestureCoordinates.gxCoordBeforeBeginGesture = this._gx;
				gestureCoordinates.gyCoordBeforeBeginGesture = this._gy;
				this.beginGesture(10, 10);
				gestureCoordinates.gxCoordAfterBeginGesture = this._gx;
				gestureCoordinates.gyCoordAfterBeginGesture = this._gy;
				this.endGesture();
				gestureCoordinates.gxCoordAfterEndGesture = this._gx;
				gestureCoordinates.gyCoordAfterEndGesture = this._gy;

				assert.strictEqual(gestureCoordinates.gxCoordBeforeBeginGesture, 0, "Before beginning gesture, NativeViewport._gx is 0.");
				assert.strictEqual(gestureCoordinates.gyCoordBeforeBeginGesture, 0, "Before beginning gesture, NativeViewport._gy is 0.");
				assert.notStrictEqual(gestureCoordinates.gxCoordAfterBeginGesture, 0, "After beginning gesture, NativeViewport._gx is different than 0.");
				assert.notStrictEqual(gestureCoordinates.gyCoordAfterBeginGesture, 0, "After beginning gesture, NativeViewport._gy is different than 0.");
				assert.strictEqual(gestureCoordinates.gxCoordAfterEndGesture, 0, "After ending the gesture, NativeViewport._gx is 0.");
				assert.strictEqual(gestureCoordinates.gyCoordAfterEndGesture, 0, "After ending the gesture, NativeViewport._gy is 0.");

				var panFactor = {
					deltaX: 30,
					deltaY: 30
				};
				var viewInfoBeforePan = this.getViewInfo();
				this.pan(panFactor.deltaX, panFactor.deltaY);
				var viewInfoAfterPan = this.getViewInfo();

				assert.strictEqual(viewInfoBeforePan.camera[4] + panFactor.deltaX, viewInfoAfterPan.camera[4], "The native viewport has been panned with the right delta X factor.");
				assert.strictEqual(viewInfoBeforePan.camera[5] + panFactor.deltaY, viewInfoAfterPan.camera[5], "The native viewport has been panned with the right delta Y factor.");

				var zoomFactor = 2;
				var viewInfoBeforeZoom = this.getViewInfo();
				this.zoom(zoomFactor);
				var viewInfoAfterZoom = this.getViewInfo();

				assert.strictEqual(viewInfoBeforeZoom.camera[0] * zoomFactor, viewInfoAfterZoom.camera[0], "The native viewport has been zoomed in with the right zoom factor.");
			}.bind(nativeViewport),
			function() {
				assert.ok(false, "Failed to load test image");
			}).finally(() => {
				done()
			});
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
