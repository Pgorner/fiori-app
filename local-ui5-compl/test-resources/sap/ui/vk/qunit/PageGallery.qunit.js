sap.ui.define([
	"sap/ui/vk/pdf/PageGallery"
], function(
	PageGallery
) {
	"use strict";

	QUnit.module("PageGallery");

	QUnit.test("Property thumbnailScale: default value", function(assert) {
		const pageGallery = new PageGallery();

		const thumbnailScale = pageGallery.getThumbnailScale();

		assert.ok(thumbnailScale > 0 && thumbnailScale <= 100, "The default value of the 'thumbnailScale' property is within the valid range.");

		assert.strictEqual(pageGallery.getThumbnailScale(), pageGallery.getAggregation("_slider").getValue(), "The 'thumbnailScale' property has the same value as the slider.");
	});

	QUnit.test("Property thumbnailScale: custom value", function(assert) {
		const SCALE = 42;

		const pageGallery = new PageGallery({
			thumbnailScale: SCALE
		});

		assert.strictEqual(pageGallery.getThumbnailScale(), pageGallery.getAggregation("_slider").getValue(), "The 'thumbnailScale' property has the same value as the slider.");
	});

	QUnit.test("Property thumbnailScale: setProperty() vs setThumbnailScale()", function(assert) {
		let done = assert.async();

		let scale = 42;

		const pageGallery = new PageGallery();

		const eventHandler = sinon.spy();
		pageGallery.attachThumbnailScaleChanged(eventHandler);

		pageGallery.attachEventOnce("thumbnailScaleChanged", function(event) {
			assert.strictEqual(event.getParameter("value"), scale, "The 'thumbnailScale' property has been changed via 'setThumbnailScale(...)'.");
			done();
		});

		pageGallery.setThumbnailScale(scale);

		assert.strictEqual(pageGallery.getThumbnailScale(), pageGallery.getAggregation("_slider").getValue(), "The 'thumbnailScale' property has the same value as the slider.");

		scale = 77;

		done = assert.async();

		pageGallery.attachEventOnce("thumbnailScaleChanged", function(event) {
			assert.strictEqual(event.getParameter("value"), scale, "The 'thumbnailScale' property has been changed via 'setProperty(\"thumbnailScale\", ...)'.");
			done();
		});

		pageGallery.setProperty("thumbnailScale", scale);

		assert.strictEqual(pageGallery.getThumbnailScale(), pageGallery.getAggregation("_slider").getValue(), "The 'thumbnailScale' property has the same value as the slider.");

		assert.strictEqual(eventHandler.callCount, 2, "The event handler has been called twice.");
	});

	QUnit.test("Property thumbnailScale: thumbnailSideLength calculation", function(assert) {
		const pageGallery = new PageGallery({ thumbnailScale: 10 });

		const length1 = pageGallery._thumbnailSideLength;

		pageGallery.setThumbnailScale(50);

		assert.ok(Math.abs(pageGallery._thumbnailSideLength - length1 * 5) < 0.000001, "The 'thumbnailSideLength' property has been recalculated.");
	});

	QUnit.test("Event thumbnailScaleChanged", function(assert) {
		const done = assert.async();

		const INITIAL_SCALE = 10;
		const SCALE = 42;

		const pageGallery = new PageGallery({
			thumbnailScale: INITIAL_SCALE
		});

		const eventHandler = sinon.spy();
		pageGallery.attachThumbnailScaleChanged(eventHandler);

		pageGallery.attachEventOnce("thumbnailScaleChanged", function(event) {
			assert.strictEqual(event.getParameter("value"), SCALE, "The 'thumbnailScale' property has been changed.");
			done();
		});

		pageGallery.setThumbnailScale(SCALE);

		assert.strictEqual(eventHandler.callCount, 1, "The event handler has been called once.");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
})
