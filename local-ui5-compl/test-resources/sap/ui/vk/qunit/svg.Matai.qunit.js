/* global QUnit*/

sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/svg/Viewport",
	"sap/ui/vk/ContentConnector",
	"sap/ui/vk/ContentResource",
	"sap/ui/vk/svg/Scene",
	"sap/ui/vk/svg/Element",
	"sap/ui/vk/svg/Ellipse",
	"sap/ui/vk/svg/Path"
], function(
	nextUIUpdate,
	jQuery,
	Viewport,
	ContentConnector,
	ContentResource,
	SvgScene,
	Element,
	Ellipse,
	Path
) {
	"use strict";

	var contentConnector = new ContentConnector();

	var viewport = new Viewport({
		contentConnector: contentConnector
	});
	viewport.placeAt("content");
	nextUIUpdate.runSync();

	QUnit.test("Loading scene", function(assert) {
		var done = assert.async();

		contentConnector.attachContentChangesFinished(function(event) {
			var content = event.getParameter("content");
			assert.ok(content && content instanceof SvgScene, "SVG VDS4 file is loaded");
			if (content) {
				var scene = content.getRootElement();
				assert.ok(scene instanceof Element, "root element");
				assert.ok(scene.children.length > 0, "root.children");
				assert.equal(scene.children[0].name, "VDS4-parametric_objects", "model name");

				var model = scene.getElementByProperty("name", "Viewport #7");

				["AcDbArc", "AcDbCircle", "AcDbLine", "AcDbPolyline", "AcDbPolyline", "AcDbSpline", "AcDbXline", "AcDbMText"].forEach(function(name, index) {
					assert.equal(model.children[index].name, name, name);
				});

				var arc = model.children[0];
				assert.strictEqual(arc.children.length, 12, "arc.children");
				arc.children.forEach(function(child, index) {
					assert.ok(child instanceof Path, "arc element");
					assert.strictEqual(child.segments.length, 2, "arc.child[" + index + "].segments.length");
					assert.strictEqual(child.segments[0].type, "move", "arc.child[" + index + "].segments[0].type");
					assert.strictEqual(child.segments[1].type, "arc", "arc.child[" + index + "].segments[1].type");
				});
				assert.ok(arc.userData.treeNode, "arc userData.treeNode");

				var nodeHierarchy = content.getDefaultNodeHierarchy();
				var veidsNodes = nodeHierarchy.findNodesById({
					source: "SAP",
					type: "VE_ELEMENT",
					fields: [{
						name: "ID",
						value: "384dc3e5-4281-42c6-5ac7-6da30fbd6129_14",
						predicate: "equals",
						caseSensitive: false
					}]
				});
				assert.ok(veidsNodes.length === 1 && veidsNodes[0] === model.children[0], "arc veid");

				var circle = model.children[1];
				assert.strictEqual(circle.children.length, 1, "circle.children");
				assert.ok(circle.children[0] instanceof Ellipse, "circle element");
				assert.strictEqual(circle.children[0].rx, 250, "circle.rx");
				assert.strictEqual(circle.children[0].ry, 250, "circle.ry");
				assert.strictEqual(circle.children[0].cx, 0, "circle.cx");
				assert.strictEqual(circle.children[0].cy, 0, "circle.cy");

				var spline = model.children[5];
				assert.strictEqual(spline.children.length, 2, "spline.children");
				assert.ok(spline.children[0] instanceof Path, "spline[0] element");
				assert.strictEqual(spline.children[0].segments.length, 3, "spline[0].segments");
				spline.children[0].segments.forEach(function(segment, index) {
					assert.strictEqual(segment.type, "bezier", "spline[0].segment[" + index + "].type");
					assert.strictEqual(segment.degree, 3, "spline[0].segment[" + index + "].degree");
					assert.strictEqual(segment.points.length, 8, "spline[0].segment[" + index + "].points");
				});
				assert.ok(spline.children[1] instanceof Path, "spline[1] element");
				assert.strictEqual(spline.children[1].segments.length, 7, "spline[1].segments");
				spline.children[1].segments.forEach(function(segment, index) {
					assert.strictEqual(segment.type, "bezier", "spline[1].segment[" + index + "] type");
					assert.strictEqual(segment.degree, 3, "spline[1].segment[" + index + "].degree");
					assert.strictEqual(segment.points.length, 8, "spline[1].segment[" + index + "].points");
				});
			} else {
				var failureReason = event.getParameter("failureReason");
				assert.ok(false, "Unable to load VDS4 file: " + (Array.isArray(failureReason) ? failureReason[0].errorMessage : "unknown error"));
			}
			done();
		});

		contentConnector.addContentResource(new ContentResource({
			source: "test-resources/sap/ui/vk/qunit/media/parametric_objects.vds",
			sourceType: "vds4-2d",
			name: "VDS4-parametric_objects"
		}));
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
