/* global QUnit, sinon*/

sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/vk/threejs/Viewport",
	"sap/ui/vk/tools/RedlineTool",
	"sap/ui/vk/Redline",
	"sap/ui/vk/RedlineElementEllipse",
	"sap/ui/vk/RedlineElementRectangle",
	"sap/ui/vk/RedlineElementText",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector"
], function(
	nextUIUpdate,
	Viewport,
	RedlineTool,
	Redline,
	RedlineElementEllipse,
	RedlineElementRectangle,
	RedlineElementText,
	loader
) {
	"use strict";

	var viewport = new Viewport(); // width = 300px!, height = 300px!
	viewport.placeAt("content");
	nextUIUpdate.runSync();

	var redlineTool = new RedlineTool();
	viewport.addTool(redlineTool);

	QUnit.moduleWithContentConnector("RedlineTool", "test-resources/sap/ui/vk/qunit/media/boxes.three.json", "threejs.test.json", function(assert) {
		viewport.setContentConnector(this.contentConnector);
	});

	QUnit.test("Testing conversions", async function(assert) {
		redlineTool.setActive(true, viewport);
		assert.ok(redlineTool.getActive(), "RedlineTool should be activated");

		var gizmo = redlineTool.getGizmo();
		viewport.invalidate(); // required to immediately generate gizmo domRef
		await nextUIUpdate();
		assert.notEqual(gizmo.getDomRef(), null, "RedlineTool gizmo has domRef");

		var vp = gizmo._toVirtualSpace(150, 300);
		assert.strictEqual(vp.x, 0.5, "150px in virtual space is 0.5");
		assert.strictEqual(vp.y, 1, "300px in virtual space is 1");

		var pp = gizmo._toPixelSpace(0.5, 1);
		assert.strictEqual(pp.x, 150, "0.5 in pixel space is 150");
		assert.strictEqual(pp.y, 300, "1 in pixel space is 300");

		var topValueVirtual = 450,
			topValuePixels = gizmo._toPixelSpace(topValueVirtual),
			newTopValueVirtual = gizmo._toVirtualSpace(topValuePixels);
		assert.strictEqual(topValueVirtual, newTopValueVirtual, "You get the same value if you convert virtual => pixels => virtual");
	});

	QUnit.test("Testing importJSON & exportJSON", function(assert) {
		redlineTool.destroyRedlineElements();

		var ellipse = new RedlineElementEllipse({
			originX: 0.5,
			originY: 0.5,
			radiusX: 0.2,
			radiusY: 0.3,
			strokeColor: "rgba(0, 255, 0, 1)"
		});
		redlineTool.addRedlineElement(ellipse);

		var exportedJson = redlineTool.exportJSON();
		assert.strictEqual(ellipse.getOriginX(), exportedJson[0].originX, "The aggregation and the exported element have the same 'originX'.");
		assert.strictEqual(ellipse.getOriginY(), exportedJson[0].originY, "The aggregation and the exported element have the same 'originY'.");
		assert.strictEqual(ellipse.getRadiusX(), exportedJson[0].radiusX, "The aggregation and the exported element have the same 'radiusX'.");
		assert.strictEqual(ellipse.getRadiusY(), exportedJson[0].radiusY, "The aggregation and the exported element have the same 'radiusY'.");
		assert.strictEqual(ellipse.getOpacity(), exportedJson[0].opacity, "The aggregation and the exported element have the same 'opacity'.");
		assert.strictEqual(ellipse.getFillColor(), exportedJson[0].fillColor, "The aggregation and the exported element have the same fill color.");
		assert.strictEqual(ellipse.getStrokeColor(), exportedJson[0].strokeColor, "The aggregation and the exported element have the same stroke color.");
		assert.strictEqual(ellipse.getStrokeWidth(), exportedJson[0].strokeWidth, "The aggregation and the exported element have the same stroke width.");
		assert.strictEqual(Redline.ElementType.Ellipse, exportedJson[0].type, "The aggregation and the exported element are both ellipses.");

		redlineTool.destroyRedlineElements();

		var jsonEllipse = {
			originX: 0.4,
			originY: 0.6,
			opacity: 1,
			strokeColor: "rgba(255, 255, 0, 1)",
			strokeWidth: 5,
			type: "ellipse",
			version: 1,
			radiusX: 0.1,
			radiusY: 0.3,
			fillColor: "rgba(0, 0, 0, 0)"
		};
		redlineTool.importJSON(jsonEllipse);

		var importedEllipse = redlineTool.getRedlineElements()[0];

		assert.strictEqual(importedEllipse.getOriginX(), jsonEllipse.originX, "The imported aggregation and the json element have the same 'originX'.");
		assert.strictEqual(importedEllipse.getOriginY(), jsonEllipse.originY, "The imported aggregation and the json element have the same 'originY'.");
		assert.strictEqual(importedEllipse.getRadiusX(), jsonEllipse.radiusX, "The imported aggregation and the json element have the same 'radiusX'.");
		assert.strictEqual(importedEllipse.getRadiusY(), jsonEllipse.radiusY, "The imported aggregation and the json element have the same 'radiusY'.");
		assert.strictEqual(importedEllipse.getOpacity(), jsonEllipse.opacity, "The imported aggregation and the json element have the same 'opacity'.");
		assert.strictEqual(importedEllipse.getFillColor(), jsonEllipse.fillColor, "The imported aggregation and the json element have the same fill color.");
		assert.strictEqual(importedEllipse.getStrokeColor(), jsonEllipse.strokeColor, "The imported aggregation and the json element have the same stroke color.");
		assert.strictEqual(importedEllipse.getStrokeWidth(), jsonEllipse.strokeWidth, "The imported aggregation and the json element have the same stroke width.");
		assert.strictEqual(Redline.ElementType.Ellipse, jsonEllipse.type, "The imported aggregation and the json element are both ellipses.");
	});

	QUnit.test("Testing RedlineToolHandler", async function(assert) {
		redlineTool.setActive(true, viewport);
		assert.ok(redlineTool.getActive(), "RedlineTool should be activated");

		var gizmo = redlineTool.getGizmo();
		viewport.invalidate(); // required to immediately generate gizmo domRef
		await nextUIUpdate();
		assert.notEqual(gizmo.getDomRef(), null, "RedlineTool gizmo has domRef");
		assert.ok(gizmo.hasStyleClass("sapUiVizkitRedlineInteractionMode"), "By default the control has 'sapUiVizkitRedlineInteractionMode' class.");
		assert.notOk(gizmo.hasStyleClass("sapUiVizkitRedlineDesignMode"), "By default the control doesn't have 'sapUiVizkitRedlineDesignMode' class.");

		redlineTool.destroyRedlineElements();

		var element = new RedlineElementRectangle();

		redlineTool.startAdding(element);
		assert.deepEqual(gizmo.getAggregation("activeElement"), element, "The active element is the one that we've just added");
		assert.notOk(gizmo.hasStyleClass("sapUiVizkitRedlineInteractionMode"), "While in adding mode, the control doesn't have 'sapUiVizkitRedlineInteractionMode' class.");
		assert.ok(gizmo.hasStyleClass("sapUiVizkitRedlineDesignMode"), "While in adding mode, the control has 'sapUiVizkitRedlineDesignMode' class.");

		var rect = viewport.getDomRef().getBoundingClientRect();
		var ox = rect.left + window.pageXOffset;
		var oy = rect.top + window.pageYOffset;

		var toolHandler = redlineTool._handler;
		var viewportHandler = viewport._viewportGestureHandler;
		function applyGesture(event1, event2) {
			toolHandler.beginGesture(event1);
			if (!event1.handled) {
				viewportHandler.beginGesture(event1);
			}

			toolHandler.move(event2);
			if (!event2.handled) {
				viewportHandler.move(event2);
			}

			event2.handled = false;
			toolHandler.endGesture(event2);
			if (!event2.handled) {
				viewportHandler.endGesture(event2);
			}
		}

		var e1 = { x: 30 + ox, y: 60 + oy, d: 1, buttons: 1 }; // (0.1, 0.2)
		var e2 = { x: 180 + ox, y: 150 + oy, d: 1, buttons: 1 }; // (0.6, 0.5)
		applyGesture(e1, e2);

		var maxDifference = 1e-6;
		function assertClose(actual, expected, message) {
			var passes = (actual === expected) || Math.abs(actual - expected) <= maxDifference;
			assert.push(passes, actual, expected, message);
		}

		assertClose(element.getOriginX(), 0.1, "rectangle.originX");
		assertClose(element.getOriginY(), 0.2, "rectangle.originY");
		assertClose(element.getWidth(), 0.5, "rectangle.width");
		assertClose(element.getHeight(), 0.3, "rectangle.height");

		assert.strictEqual(gizmo.getAggregation("activeElement"), null, "After 'stopAdding', the active element is 'null'");
		assert.ok(redlineTool.getRedlineElements().length === 1 && redlineTool.getRedlineElements()[0] === element, "Rectangle element created");
		assert.ok(gizmo.hasStyleClass("sapUiVizkitRedlineInteractionMode"), "While in interaction mode, the control has 'sapUiVizkitRedlineInteractionMode' class.");
		assert.notOk(gizmo.hasStyleClass("sapUiVizkitRedlineDesignMode"), "While in interaction mode, the control doesn't have 'sapUiVizkitRedlineDesignMode' class.");

		// pan gesture
		e1 = { x: 150 + ox, y: 120 + oy, d: 1, n: 1 }; // (0.5, 0.4)
		e2 = { x: 180 + ox, y: 180 + oy, d: 1, n: 1 }; // (0.6, 0.6)
		applyGesture(e1, e2);

		assertClose(element.getOriginX(), 0.2, "rectangle.originX after pan");
		assertClose(element.getOriginY(), 0.4, "rectangle.originY after pan");
		assertClose(element.getWidth(), 0.5, "rectangle.width after pan");
		assertClose(element.getHeight(), 0.3, "rectangle.height after pan");

		// zoom in gesture
		e1 = { x: 210 + ox, y: 210 + oy, d: 1, n: 2 }; // (0.7, 0.7)
		e2 = { x: 210 + ox, y: 210 + oy, d: 1.1, n: 2 };
		applyGesture(e1, e2);

		assertClose(element.getOriginX(), 0.2 + 0.5 - 0.55, "rectangle.originX after zoom");
		assertClose(element.getOriginY(), 0.4 + 0.3 - 0.33, "rectangle.originY after zoom");
		assertClose(element.getWidth(), 0.55, "rectangle.width after zoom");
		assertClose(element.getHeight(), 0.33, "rectangle.height after zoom");
	});

	QUnit.test("Testing RedlineToolText", async function(assert) {
		redlineTool.setActive(true, viewport);
		assert.ok(redlineTool.getActive(), "RedlineTool should be activated");

		var gizmo = redlineTool.getGizmo();
		viewport.invalidate();
		await nextUIUpdate();
		redlineTool.destroyRedlineElements();
		var toolHandler = redlineTool._handler;

		var gizmo = redlineTool.getGizmo();
		var redlineText = new RedlineElementText();
		var domNode = document.createElement("foreignObject");
		var textArea = document.createElement("textArea");
		domNode.appendChild(textArea);
		sinon.stub(redlineText, "getDomRef").returns(domNode);
		gizmo._activeElement = redlineText;

		var addEventListenerSpy = sinon.spy(textArea, "addEventListener");
		gizmo.onAfterRendering();
		sinon.assert.calledOnce(addEventListenerSpy);

		gizmo.destroy();
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
