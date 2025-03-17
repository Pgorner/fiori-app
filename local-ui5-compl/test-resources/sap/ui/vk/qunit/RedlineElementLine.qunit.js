/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/RedlineElementLine",
	"sap/ui/vk/RedlineSurface",
	"sap/ui/vk/Redline"
], function(
	jQuery,
	RedlineElementLine,
	RedlineSurface,
	Redline
) {
	"use strict";

	var line = new RedlineElementLine({
		originX: 0.5,
		originY: 0.5
	});
	var arrowLine = new RedlineElementLine({
		originX: 0.5,
		originY: 0.5,
		endArrowHead: true
	});
	var surface = new RedlineSurface({
		virtualTop: 0,
		virtualLeft: 0,
		virtualSideLength: 500,
		redlineElements: [line, arrowLine]
	});
	surface.getVirtualLeft();

	var DummyRenderManager = function() {
		this._text = "";
	};

	DummyRenderManager.prototype.getRenderedContent = function() {
		return this._text;
	};

	DummyRenderManager.prototype.openStart = function(tag) {
		tag = "<" + tag;
		this._text += tag;
	};

	DummyRenderManager.prototype.openEnd = function() {
		this._text += ">";
	};

	DummyRenderManager.prototype.close = function(tag) {
		tag = "</" + tag + ">";
		this._text += tag;
	};

	DummyRenderManager.prototype.attr = function(attribute, data) {
		this._text += " " + attribute + "='" + data + "'";
	};

	QUnit.test("Testing RedlineElementLine", function(assert) {

		line.setDeltaX(0.1);
		assert.strictEqual(line.getDeltaX(), 0.1, "'deltaX' is 0.1");

		line.setDeltaY(0.1);
		assert.strictEqual(line.getDeltaY(), 0.1, "'deltaY' is 0.1");

		line.edit(125, 375);
		assert.strictEqual(line.getDeltaX(), -0.25, "After editing by (125, 375), 'deltaX' becomes -0.25");
		assert.strictEqual(line.getDeltaY(), 0.25, "After editing by (125, 375), 'deltaY' becomes 0.25");


		var jsonLine = {
			halo: false,
			elementId: "39222103-fa2b-ed5d-0561-76caaa0112da",
			originX: 0.5,
			originY: 0.2,
			deltaX: -0.1,
			deltaY: 0.3,
			opacity: 0.7,
			strokeColor: "rgba(12,34,45,0.6)",
			strokeWidth: 5,
			strokeDashArray: [1, 2, 3, 4],
			type: Redline.ElementType.Line,
			version: 1
		};

		line.importJSON(jsonLine);

		var dummyRenderManager = new DummyRenderManager();
		line.render(dummyRenderManager);

		var expectedRenderedContent =
			"<line x1='250' y1='100' x2='200' y2='250' stroke='rgba(12,34,45,0.6)' stroke-width='5' stroke-dasharray='1,2,3,4' opacity='0.7'></line>";
		var renderedContent = dummyRenderManager.getRenderedContent();
		assert.strictEqual(renderedContent, expectedRenderedContent, "The rendered content matches the expect result.");

		var exportedJson = line.exportJSON();
		assert.strictEqual(exportedJson.halo, jsonLine.halo, "Export and import 'halo' match.");
		assert.strictEqual(exportedJson.elementId, jsonLine.elementId, "Export and import 'elementId' match.");
		assert.strictEqual(exportedJson.originX, jsonLine.originX, "Export and import 'originX' match.");
		assert.strictEqual(exportedJson.originY, jsonLine.originY, "Export and import 'originY' match");
		assert.strictEqual(exportedJson.deltaX, jsonLine.deltaX, "Export and import 'deltaX' match.");
		assert.strictEqual(exportedJson.deltaY, jsonLine.deltaY, "Export and import 'deltaY' match.");
		assert.strictEqual(exportedJson.strokeColor, jsonLine.strokeColor, "Export and import 'strokeColor' match.");
		assert.strictEqual(exportedJson.strokeWidth, jsonLine.strokeWidth, "Export and import 'strokeWidth' match.");
		assert.deepEqual(exportedJson.strokeDashArray, jsonLine.strokeDashArray, "Export and import 'strokeDashArray' match.");
		assert.strictEqual(exportedJson.opacity, jsonLine.opacity, "Export and import 'opacity' match.");
		assert.strictEqual(exportedJson.type, jsonLine.type, "Exported and import 'type' match.");
		assert.strictEqual(exportedJson.version, jsonLine.version, "Export and import 'version' match.");
	});

	QUnit.test("Testing Arrow RedlineElementLine", function(assert) {

		arrowLine.setDeltaX(0.1);
		assert.strictEqual(arrowLine.getDeltaX(), 0.1, "'deltaX' is 0.1");

		arrowLine.setDeltaY(0.1);
		assert.strictEqual(arrowLine.getDeltaY(), 0.1, "'deltaY' is 0.1");

		arrowLine.edit(125, 375);
		assert.strictEqual(arrowLine.getDeltaX(), -0.25, "After editing by (125, 375), 'deltaX' becomes -0.25");
		assert.strictEqual(arrowLine.getDeltaY(), 0.25, "After editing by (125, 375), 'deltaY' becomes 0.25");

		var jsonArrowLine = {
			halo: false,
			elementId: "39222103-fa2b-ed5d-0561-76caaa0112da",
			originX: 0.5,
			originY: 0.2,
			deltaX: -0.1,
			deltaY: 0.3,
			opacity: 0.7,
			strokeColor: "rgba(12,34,45,0.6)",
			strokeWidth: 5,
			strokeDashArray: [1, 2, 3, 4],
			type: Redline.ElementType.Line,
			version: 1,
			endArrowHead: true
		};

		arrowLine.importJSON(jsonArrowLine);

		var dummyRenderManager = new DummyRenderManager();
		arrowLine.render(dummyRenderManager);

		var expectedRenderedContent =
			"<line x1='250' y1='100' x2='200' y2='250' stroke='rgba(12,34,45,0.6)' stroke-width='5' stroke-dasharray='1,2,3,4' opacity='0.7' marker-end='url(#endArrowHead1234450.6)'></line>";
		var renderedContent = dummyRenderManager.getRenderedContent();
		assert.strictEqual(renderedContent, expectedRenderedContent, "The rendered content matches the expect result.");

		var exportedJson = arrowLine.exportJSON();
		assert.strictEqual(exportedJson.halo, jsonArrowLine.halo, "Export and import 'halo' match.");
		assert.strictEqual(exportedJson.elementId, jsonArrowLine.elementId, "Export and import 'elementId' match.");
		assert.strictEqual(exportedJson.originX, jsonArrowLine.originX, "Export and import 'originX' match.");
		assert.strictEqual(exportedJson.originY, jsonArrowLine.originY, "Export and import 'originY' match");
		assert.strictEqual(exportedJson.deltaX, jsonArrowLine.deltaX, "Export and import 'deltaX' match.");
		assert.strictEqual(exportedJson.deltaY, jsonArrowLine.deltaY, "Export and import 'deltaY' match.");
		assert.strictEqual(exportedJson.strokeColor, jsonArrowLine.strokeColor, "Export and import 'strokeColor' match.");
		assert.strictEqual(exportedJson.strokeWidth, jsonArrowLine.strokeWidth, "Export and import 'strokeWidth' match.");
		assert.deepEqual(exportedJson.strokeDashArray, jsonArrowLine.strokeDashArray, "Export and import 'strokeDashArray' match.");
		assert.strictEqual(exportedJson.opacity, jsonArrowLine.opacity, "Export and import 'opacity' match.");
		assert.strictEqual(exportedJson.type, jsonArrowLine.type, "Exported and import 'type' match.");
		assert.strictEqual(exportedJson.version, jsonArrowLine.version, "Export and import 'version' match.");
		assert.strictEqual(exportedJson.endArrowHead, jsonArrowLine.endArrowHead, "Export and import 'endArrowHead' match.");

	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
