/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/RedlineElement"
], function(
	jQuery,
	RedlineElement
) {
	"use strict";

	var redlineElement = new RedlineElement();

	QUnit.test("Testing generic RedlineElement", function(assert) {

		// Testing defaults
		assert.strictEqual(redlineElement.getHalo(), false, "Default 'halo' value is False");
		assert.strictEqual(redlineElement.getOriginX(), 0, "Default 'originX' is 0.");
		assert.strictEqual(redlineElement.getOriginY(), 0, "Default 'originY' is 0.");
		assert.strictEqual(redlineElement.getOpacity(), 1, "Default opacity is 1.");
		assert.strictEqual(redlineElement.getStrokeWidth(), 2, "Default stroke width is 2.");
		assert.strictEqual(redlineElement.getStrokeColor(), "#e6600d", "Default stroke color is '#e6600d'.");

		redlineElement.setOriginX(0.9);
		assert.strictEqual(redlineElement.getOriginX(), 0.9, "Set originX to  0.9 => it retrieves 0.9");

		redlineElement.setOriginY(0.8);
		assert.strictEqual(redlineElement.getOriginY(), 0.8, "Set originY to 0.8 => it retrieves 0.8");

		var jsonSettings = {
			halo: true,
			haloColor: "rgba(255, 244, 233, 0.6)",
			elementId: "34fbbdc1-a421-014f-8a5f-1f4f5a98538d",
			originX: 0.3,
			originY: 0.2,
			opacity: 0.7,
			strokeColor: "rgba(0, 0, 255, 1)",
			strokeWidth: 4,
			createTimestamp: 88,
			createdByUser: "testuser123",
			deleteTimestamp: 99,
			deletedByUser: "testuser123",
			suppress: false
		};

		redlineElement.importJSON(jsonSettings);
		assert.strictEqual(redlineElement.getHalo(), jsonSettings.halo, "Element settings and json settings have the same 'halo'.");
		assert.strictEqual(redlineElement.getHaloColor(), jsonSettings.haloColor, "Element settings and json settings have the same 'haloColor'.");
		assert.strictEqual(redlineElement.getElementId(), jsonSettings.elementId, "Element settings and json settings have the same 'elementId'.");
		assert.strictEqual(redlineElement.getOriginX(), jsonSettings.originX, "Element settings and json settings have the same 'originX'.");
		assert.strictEqual(redlineElement.getOriginY(), jsonSettings.originY, "Element settings and json settings have the same 'originY'.");
		assert.strictEqual(redlineElement.getOpacity(), jsonSettings.opacity, "Element settings and json settings have the same opacity.");
		assert.strictEqual(redlineElement.getStrokeWidth(), jsonSettings.strokeWidth, "Element settings and json settings have the same stroke width.");
		assert.strictEqual(redlineElement.getStrokeColor(), jsonSettings.strokeColor, "Element settings and json settings have the same stroke color.");
		assert.strictEqual(redlineElement.getCreateTimestamp(), jsonSettings.createTimestamp, "Element settings and json settings have the same create timestamp.");
		assert.strictEqual(redlineElement.getCreatedByUser(), jsonSettings.createdByUser, "Element settings and json settings have the same created by user.");
		assert.strictEqual(redlineElement.getDeleteTimestamp(), jsonSettings.deleteTimestamp, "Element settings and json settings have the same delete timestamp.");
		assert.strictEqual(redlineElement.getDeletedByUser(), jsonSettings.deletedByUser, "Element settings and json settings have the same deleted by user.");
		assert.strictEqual(redlineElement.getSuppress(), jsonSettings.suppress, "Element settings and json settings have the same suppress value.");

		var exportedJson = redlineElement.exportJSON();
		assert.deepEqual(jsonSettings, exportedJson, "The exported JSON object has the same properties and values as the imported JSON object.");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
