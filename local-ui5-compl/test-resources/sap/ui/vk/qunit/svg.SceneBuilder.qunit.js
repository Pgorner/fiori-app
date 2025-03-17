/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/svg/SceneBuilder",
	"sap/ui/vk/svg/Scene",
	"sap/ui/vk/svg/Element",
	"sap/ui/vk/svg/Line",
	"sap/ui/vk/svg/Rectangle",
	"sap/ui/vk/svg/Polyline",
	"sap/ui/vk/svg/Ellipse",
	"sap/ui/vk/svg/Path",
	"sap/ui/vk/svg/Text",
	"sap/ui/vk/svg/SvgImage",
	"sap/ui/vk/svg/LinearGradient"
], function(
	jQuery,
	SceneBuilder,
	Scene,
	Element,
	Line,
	Rectangle,
	Polyline,
	Ellipse,
	Path,
	Text,
	SvgImage,
	LinearGradient
) {
	"use strict";

	QUnit.test("SceneBuilder", function(assert) {
		var done = assert.async();

		var nativeScene = new Scene();
		var sceneRoot = nativeScene.getRootElement();

		var root = new Element();
		sceneRoot.add(root);

		var sceneBuilder = new SceneBuilder();

		var sceneId = "scene123";
		sceneBuilder.setRootNode(root, "id-root", sceneId, nativeScene);

		// node creation test

		var node1 = sceneBuilder.createNode({
			parentId: "id-root",
			sid: "id-1",
			name: "node1"
		}, sceneId);

		assert.ok(node1, "node1 created");
		assert.ok(node1.parent === root, "node1 parent");
		assert.ok(sceneRoot.getElementByProperty("sid", "id-1") === node1, "node1 sid");
		assert.ok(sceneRoot.getElementByProperty("name", "node1") === node1, "node1 name");

		var node2 = sceneBuilder.createNode({
			parentId: "id-1",
			sid: "id-2",
			name: "node2"
		}, sceneId);

		assert.ok(node2, "node2 created");
		assert.ok(node2.parent === node1, "node2 parent");
		assert.ok(sceneRoot.getElementByProperty("sid", "id-2") === node2, "node2 sid");
		assert.ok(sceneRoot.getElementByProperty("name", "node2") === node2, "node2 name");
		assert.strictEqual(node2.children.length, 0, "node2 children");

		// material creation test

		var material1Info = {
			id: "id-material1",
			lineColour: [1, 0.5, 0.25, 0.75],
			emissiveColour: [0.125, 0.5, 1, 0.25],
			opacity: 0.987,
			lineWidth: 1.123,
			lineHaloWidth: 0.567,
			lineEndRound: 1,
			lineDashPattern: [1, 2, 3, 4]
		};
		sceneBuilder.createMaterial(material1Info);
		var material1 = sceneBuilder._getMaterial(material1Info.id);

		assert.ok(material1, "material1 created");
		assert.deepEqual(material1.lineColor, material1Info.lineColour, "material1 lineColor");
		assert.strictEqual(material1.lineWidth, material1Info.lineWidth, "material1 lineWidth");
		assert.deepEqual(material1.color, material1Info.emissiveColour, "material1 color");
		assert.strictEqual(material1.opacity, material1Info.opacity, "material1 opacity");
		assert.ok(material1.lineStyle, "material1 lineStyle");
		assert.strictEqual(material1.lineStyle.haloWidth, material1Info.lineHaloWidth, "material1 lineHaloWidth");
		assert.strictEqual(material1.lineStyle.endCapStyle, 1, "material1 lineEndRound");
		assert.deepEqual(material1.lineStyle.dashPattern, material1Info.lineDashPattern, "material1 lineDashPattern");

		var stroke1 = {
			veid: "stroke1",
			colour: [0, 0.125, 0.25, 0.75],
			width: 1.23,
			dashes: [0, 1, -2]
		};
		var stroke2 = {
			veid: "stroke2",
			colour: [0.25, 0.375, 0.75, 0.5],
			width: 2.34,
			dashes: [-1, 0, 2]
		};
		var stroke1DashArray = Element._convertDashes(stroke1.dashes, stroke1.width);
		var stroke2DashArray = Element._convertDashes(stroke2.dashes, stroke2.width);
		var fill1 = {
			veid: "fill1",
			colour: [0.75, 0.5, 0.25, 0.125]
		};
		var fill2 = {
			veid: "fill2",
			colour: [0.375, 0.5, 0.625, 0.75]
		};

		const fill3 = {
			veid: "fill3",
			colour: [0.75, 0.5, 0.25, 0.125],
			gradient: [0, 0.25, 0.5, 0.75],
			x1: 0,
			y1: 0,
			x2: 1,
			y2: 1,
			//4X3 matrix
			gradientTransform: [-1, 0, 0, 0, -1, 0, 0, 0, 1, 0, 0, 0],
		};

		sceneBuilder.insertLineStyle(stroke1);
		sceneBuilder.insertLineStyle(stroke2);
		sceneBuilder.insertFillStyle(fill1);
		sceneBuilder.insertFillStyle(fill2);
		sceneBuilder.insertFillStyle(fill3);

		// parametric line test

		var lineInfo = {
			type: "line",
			stroke_id: stroke2.veid,
			x1: 11,
			y1: 22,
			x2: 33,
			y2: 44
		};
		sceneBuilder.setParametricContent("id-2", lineInfo, sceneId);
		assert.strictEqual(node2.children.length, 1, "parametric line added");
		var line = node2.children[node2.children.length - 1];

		assert.ok(line instanceof Line, "line class");
		assert.deepEqual(Array.from(line.stroke), stroke2.colour, "line color");
		assert.strictEqual(line.strokeWidth, stroke2.width, "line width");
		assert.deepEqual(line.strokeDashArray, stroke2DashArray, "line strokeDashArray");
		assert.strictEqual(line.x1, lineInfo.x1, "line x1");
		assert.strictEqual(line.y1, lineInfo.y1, "line y1");
		assert.strictEqual(line.x2, lineInfo.x2, "line x2");
		assert.strictEqual(line.y2, lineInfo.y2, "line y2");

		// parametric polyline test

		var polylineInfo = {
			type: "polyline",
			stroke_id: stroke1.veid,
			points: [11, 22, 33, 44, 55, 66]
		};
		sceneBuilder.setParametricContent("id-2", polylineInfo, sceneId);
		assert.strictEqual(node2.children.length, 2, "parametric polyline added");
		var polyline = node2.children[node2.children.length - 1];

		assert.ok(polyline instanceof Polyline, "polyline class");
		assert.deepEqual(Array.from(polyline.stroke), stroke1.colour, "polyline stroke");
		assert.strictEqual(polyline.strokeWidth, stroke1.width, "polyline strokeWidth");
		assert.deepEqual(polyline.strokeDashArray, stroke1DashArray, "polyline strokeDashArray");
		assert.deepEqual(Array.from(polyline.points), polylineInfo.points, "polyline points");

		// parametric ellipse test

		var ellipseInfo = {
			type: "ellipse",
			stroke_id: stroke2.veid,
			cx: 11,
			cy: 22,
			major: 33,
			minor: 44
		};
		sceneBuilder.setParametricContent("id-2", ellipseInfo, sceneId);
		assert.strictEqual(node2.children.length, 3, "parametric ellipse added");
		var ellipse = node2.children[node2.children.length - 1];

		assert.ok(ellipse instanceof Ellipse, "ellipse class");
		assert.deepEqual(Array.from(ellipse.fill), [0, 0, 0, 0], "ellipse default fill");
		assert.deepEqual(Array.from(ellipse.stroke), stroke2.colour, "ellipse stroke");
		assert.strictEqual(ellipse.strokeWidth, stroke2.width, "ellipse strokeWidth");
		assert.deepEqual(ellipse.strokeDashArray, stroke2DashArray, "ellipse strokeDashArray");
		assert.strictEqual(ellipse.cx, ellipseInfo.cx, "ellipse cx");
		assert.strictEqual(ellipse.cy, ellipseInfo.cy, "ellipse cy");
		assert.strictEqual(ellipse.rx, ellipseInfo.major, "ellipse rx");
		assert.strictEqual(ellipse.ry, ellipseInfo.minor, "ellipse ry");

		// parametric arc test

		var maxDifference = 1e-3;
		function assertClose(actual, expected, message) {
			var passes = (actual === expected) || Math.abs(actual - expected) <= maxDifference;
			assert.pushResult({ result: passes, actual: actual, expected: expected, message: message + " (" + actual + " ~ " + expected + ")" });
		}

		function testArray(a, b, message) {
			a.forEach(function(v, i) {
				assertClose(v, b[i], message + ":" + i);
			});
		}

		var arcInfo = {
			type: "arc",
			fill_id: fill2.veid,
			cx: 12,
			cy: 23,
			major: 34,
			minor: 45,
			start: Math.PI / 2,
			end: Math.PI
		};
		sceneBuilder.setParametricContent("id-2", arcInfo, sceneId);
		assert.strictEqual(node2.children.length, 4, "parametric arc added");
		var arc = node2.children[node2.children.length - 1];

		assert.ok(arc instanceof Path, "arc class");
		assert.deepEqual(Array.from(arc.fill), fill2.colour, "arc fill");
		assert.deepEqual(Array.from(arc.stroke), [0, 0, 0, 0], "arc default stroke");
		assert.strictEqual(arc.strokeWidth, 1, "arc default strokeWidth");
		assert.deepEqual(arc.strokeDashArray, [], "arc default strokeDashArray");
		assert.ok(arc.segments && arc.segments.length === 2, "arc path segments");
		var moveSegment = arc.segments[0];
		assert.strictEqual(moveSegment.type, "move", "arc 1st segment type");
		testArray(moveSegment.points, [12, 68], "arc start point");
		var arcSegment = arc.segments[1];
		assert.strictEqual(arcSegment.type, "arc", "arc 2nd segment type");
		assert.strictEqual(arcSegment.major, arcInfo.major, "arc major");
		assert.strictEqual(arcSegment.minor, arcInfo.minor, "arc minor");
		testArray(arcSegment.points, [-22, 23], "arc end point");

		// parametric path test

		var pathInfo = {
			type: "path",
			stroke_id: stroke2.veid,
			fill_id: fill1.veid,
			segments: [
				{
					type: "move",
					points: [11, 22]
				}, {
					type: "line",
					points: [33, 44]
				}, {
					type: "arc",
					major: 15,
					minor: 20,
					followLargeArc: "0",
					clockwise: "1",
					points: [55, 66]
				}, {
					type: "close"
				}, {
					type: "bezier",
					degree: 3,
					points: [10, 11, 12, 13, 14, 15, 16, 17]
				}
			]
		};
		sceneBuilder.setParametricContent("id-2", pathInfo, sceneId);
		assert.strictEqual(node2.children.length, 5, "parametric path added");
		var path = node2.children[node2.children.length - 1];

		assert.ok(path instanceof Path, "path class");
		assert.strictEqual(path.segments.length, 5, "path segments");
		assert.deepEqual(Array.from(path.fill), fill1.colour, "path fill");
		assert.deepEqual(Array.from(path.stroke), stroke2.colour, "path stroke");
		assert.strictEqual(path.strokeWidth, stroke2.width, "path lineWidth");
		assert.deepEqual(path.strokeDashArray, stroke2DashArray, "path dashPattern");

		moveSegment = path.segments[0];
		assert.strictEqual(moveSegment.type, "move", "move path segment type");
		assert.deepEqual(moveSegment.points, pathInfo.segments[0].points, "move points");

		var lineSegment = path.segments[1];
		assert.strictEqual(lineSegment.type, "line", "line path segment type");
		assert.deepEqual(lineSegment.points, pathInfo.segments[1].points, "line points");

		arcSegment = path.segments[2];
		assert.strictEqual(arcSegment.type, "arc", "arc path segment type");
		assert.strictEqual(arcSegment.major, pathInfo.segments[2].major, "arc rx");
		assert.strictEqual(arcSegment.minor, pathInfo.segments[2].minor, "arc ry");
		assert.strictEqual(arcSegment.followLargeArc, pathInfo.segments[2].followLargeArc, "arc followLargeArc");
		assert.strictEqual(arcSegment.clockwise, pathInfo.segments[2].clockwise, "arc clockwise");
		assert.deepEqual(arcSegment.points, pathInfo.segments[2].points, "arc points");

		var closeSegment = path.segments[3];
		assert.strictEqual(closeSegment.type, "close", "close path segment type");

		var bezierSegment = path.segments[4];
		assert.strictEqual(bezierSegment.type, "bezier", "bezier path segment type");
		assert.strictEqual(bezierSegment.degree, pathInfo.segments[4].degree, "bezier degree");
		assert.deepEqual(bezierSegment.points, pathInfo.segments[4].points, "bezier points");

		// parametric rectangle test

		var rectInfo = {
			type: "rectangle",
			fill_id: fill1.veid,
			stroke_id: stroke1.veid,
			x: 30,
			y: 40,
			width: 150,
			height: 160
		};
		sceneBuilder.setParametricContent("id-2", rectInfo, sceneId);
		assert.strictEqual(node2.children.length, 6, "parametric rectangle added");
		var rectangle = node2.children[node2.children.length - 1];

		assert.ok(rectangle instanceof Rectangle, "rectangle class");
		assert.deepEqual(Array.from(rectangle.fill), fill1.colour, "rectangle fill");
		assert.deepEqual(Array.from(rectangle.stroke), stroke1.colour, "rectangle stroke");
		assert.strictEqual(rectangle.strokeWidth, stroke1.width, "rectangle lineWidth");
		assert.deepEqual(rectangle.strokeDashArray, stroke1DashArray, "rectangle dashPattern");
		assert.strictEqual(rectangle.x, rectInfo.x, "rectangle x");
		assert.strictEqual(rectangle.y, rectInfo.y, "rectangle y");
		assert.strictEqual(rectangle.width, rectInfo.width, "rectangle width");
		assert.strictEqual(rectangle.height, rectInfo.height, "rectangle height");

		// parametric text test
		var textStyle1 = {
			veid: "text-style-1",
			fontFamily: "Comic Sans MS",
			size: "1.2em"
		};
		sceneBuilder.insertTextStyle(textStyle1);

		var textInfo = {
			type: "text",
			fill_id: fill2.veid,
			stroke_id: stroke1.veid,
			style_id: textStyle1.veid,
			x: 36,
			y: 47,
			dx: 1.1,
			dy: 2.2,
			content: [{
				type: 10,
				text: "ABC123"
			}]
		};
		sceneBuilder.setParametricContent("id-2", textInfo, sceneId);
		assert.strictEqual(node2.children.length, 7, "parametric text added");
		var text = node2.children[node2.children.length - 1];

		assert.ok(text instanceof Text, "text class");
		assert.deepEqual(Array.from(text.fill), fill2.colour, "rectangle fill");
		assert.deepEqual(Array.from(text.stroke), stroke1.colour, "rectangle stroke");
		assert.strictEqual(text.strokeWidth, stroke1.width, "rectangle strokeWidth");
		assert.deepEqual(text.strokeDashArray, stroke1DashArray, "rectangle strokeDashArray");
		assert.strictEqual(text.x, textInfo.x, "text x");
		assert.strictEqual(text.y, textInfo.y, "text y");
		assert.strictEqual(text.dx, textInfo.dx, "text dx");
		assert.strictEqual(text.dy, textInfo.dy, "text dy");
		assert.deepEqual(text.style, textStyle1, "text style");
		assert.deepEqual(text.content, textInfo.content, "text content");

		// parametric shapes test

		var shapes = [
			{
				type: "ellipticalArc",
				stroke_id: stroke2.veid,
				cx: 11,
				cy: 21,
				major: 31,
				minor: 41,
				start: 0,
				end: Math.PI / 2
			}, {
				type: "circle",
				stroke_id: stroke1.veid,
				cx: 61,
				cy: 71,
				radius: 55
			}
		];

		sceneBuilder.setParametricContent("id-2", { shapes: shapes }, sceneId);
		assert.strictEqual(node2.children.length, 9, "parametric shapes added");

		var ellipticalArc = node2.children[node2.children.length - 2];
		assert.ok(ellipticalArc instanceof Path, "ellipticalArc class");
		assert.deepEqual(Array.from(ellipticalArc.stroke), stroke2.colour, "ellipticalArc stroke");
		assert.strictEqual(ellipticalArc.strokeWidth, stroke2.width, "ellipticalArc strokeWidth");
		assert.deepEqual(ellipticalArc.strokeDashArray, stroke2DashArray, "ellipticalArc strokeDashArray");
		assert.ok(ellipticalArc.segments && ellipticalArc.segments.length === 2, "ellipticalArc path segments");
		moveSegment = ellipticalArc.segments[0];
		arcSegment = ellipticalArc.segments[1];
		assert.strictEqual(moveSegment.type, "move", "ellipticalArc 1st segment type");
		testArray(moveSegment.points, [42, 21], "ellipticalArc start point");
		assert.strictEqual(arcSegment.type, "arc", "ellipticalArc 2nd segment type");
		assert.strictEqual(arcSegment.major, shapes[0].major, "ellipticalArc major");
		assert.strictEqual(arcSegment.minor, shapes[0].minor, "ellipticalArc minor");
		testArray(arcSegment.points, [11, 62], "ellipticalArc end point");

		var circle = node2.children[node2.children.length - 1];
		assert.ok(circle instanceof Ellipse, "circle class");
		assert.deepEqual(Array.from(circle.stroke), stroke1.colour, "circle stroke");
		assert.strictEqual(circle.strokeWidth, stroke1.width, "circle strokeWidth");
		assert.deepEqual(circle.strokeDashArray, stroke1DashArray, "circle strokeDashArray");
		assert.strictEqual(circle.cx, shapes[1].cx, "circle cx");
		assert.strictEqual(circle.cy, shapes[1].cy, "circle cy");
		assert.strictEqual(circle.rx, shapes[1].radius, "circle rx");
		assert.strictEqual(circle.ry, shapes[1].radius, "circle ry");


		// parametric rectangle with gradient test
		const rectInfo2 = {
			type: "rectangle",
			fill_id: fill3.veid,
			stroke_id: stroke1.veid,
			x: 30,
			y: 40,
			width: 150,
			height: 160
		};
		sceneBuilder.setParametricContent("id-2", rectInfo2, sceneId);
		assert.strictEqual(node2.children.length, 11, "parametric rectangle added");

		const linearGradient = node2.children[node2.children.length - 2];
		assert.ok(linearGradient instanceof LinearGradient, "lineargradient class");
		// converted from 4x3 to 3x2
		const expectedGradientTransform = new Float32Array([1, 0, 0, 1, 0, 0]);
		assert.deepEqual(linearGradient.gradientTransform, expectedGradientTransform, "lineargradient transform");

		const rectangle2 = node2.children[node2.children.length - 1];
		assert.ok(rectangle2 instanceof Rectangle, "rectangle class");
		assert.deepEqual(Array.from(rectangle2.stroke), stroke1.colour, "rectangle stroke");
		assert.strictEqual(rectangle2.strokeWidth, stroke1.width, "rectangle lineWidth");
		assert.deepEqual(rectangle2.strokeDashArray, stroke1DashArray, "rectangle dashPattern");
		assert.strictEqual(rectangle2.x, rectInfo.x, "rectangle x");
		assert.strictEqual(rectangle2.y, rectInfo.y, "rectangle y");
		assert.strictEqual(rectangle2.width, rectInfo.width, "rectangle width");
		assert.strictEqual(rectangle2.height, rectInfo.height, "rectangle height");


		// triangle geometry test

		var node3 = sceneBuilder.createNode({
			parentId: "id-1",
			sid: "id-3",
			name: "node3",
			meshId: "mesh-id-1"
		}, sceneId);

		assert.ok(node3, "node3 created");
		assert.ok(node3.parent === node1, "node3 parent");
		assert.ok(sceneRoot.getElementByProperty("sid", "id-3") === node3, "node3 sid");
		assert.ok(sceneRoot.getElementByProperty("name", "node3") === node3, "node3 name");

		assert.strictEqual(node3.children.length, 0, "node3 no children");

		sceneBuilder.insertSubmesh({
			id: "submesh-id-1",
			materialId: material1Info.id,
			meshId: "mesh-id-1",
			lods: [{
				id: "geom-id-1"
			}]
		});

		sceneBuilder.setGeometry({
			id: "geom-id-1",
			isPolyline: false,
			isPositionQuantized: false,
			data: {
				indices: [0, 1, 2, 0, 2, 3],
				points: [
					0, 0, 0,
					100, 0, 0,
					100, 100, 0,
					0, 100, 0
				]
			}
		});

		assert.strictEqual(node3.children.length, 1, "node3 submesh added");

		var tmesh = node3.children[0];
		assert.ok(tmesh instanceof Path, "triangle mesh class");

		assert.strictEqual(tmesh.segments.length, 6, "triangle mesh path segments");
		assert.deepEqual(Array.from(tmesh.fill), material1.color, "triangle mesh fill");
		assert.deepEqual(Array.from(tmesh.stroke), [0, 0, 0, 0], "triangle mesh stroke");
		assert.strictEqual(tmesh.strokeWidth, 0, "triangle mesh strokeWidth");
		assert.deepEqual(tmesh.strokeDashArray, material1.lineStyle.dashPattern, "triangle mesh dashPattern");
		assert.strictEqual(tmesh.segments[0].type, "move", "triangle mesh segment[0].type");
		assert.strictEqual(tmesh.segments[1].type, "line", "triangle mesh segment[1].type");
		assert.strictEqual(tmesh.segments[2].type, "close", "triangle mesh segment[2].type");
		assert.strictEqual(tmesh.segments[3].type, "move", "triangle mesh segment[3].type");
		assert.strictEqual(tmesh.segments[4].type, "line", "triangle mesh segment[4].type");
		assert.strictEqual(tmesh.segments[5].type, "close", "triangle mesh segment[5].type");
		assert.deepEqual(tmesh.segments[0].points, [0, 0], "triangle mesh segment[0].points");
		assert.deepEqual(tmesh.segments[1].points, [100, 0, 100, 100], "triangle mesh segment[1].points");
		assert.deepEqual(tmesh.segments[3].points, [0, 0], "triangle mesh segment[3].points");
		assert.deepEqual(tmesh.segments[4].points, [100, 100, 0, 100], "triangle mesh segment[4].points");

		// polyline geometry test

		sceneBuilder.setGeometry({
			id: "geom-id-2",
			isPolyline: true,
			isPositionQuantized: false,
			data: {
				indices: [0, 1, 1, 2],
				points: [
					10, 20, 0,
					20, 30, 0,
					30, 40, 0
				]
			}
		});

		sceneBuilder.insertSubmesh({
			id: "submesh-id-2",
			materialId: material1Info.id,
			meshId: "mesh-id-2",
			lods: [{
				id: "geom-id-2"
			}]
		});

		var node4 = sceneBuilder.createNode({
			parentId: "id-1",
			sid: "id-4",
			name: "node4",
			meshId: "mesh-id-2"
		}, sceneId);

		assert.ok(node4, "node4 created");
		assert.ok(node4.parent === node1, "node4 parent");
		assert.ok(sceneRoot.getElementByProperty("sid", "id-4") === node4, "node4 sid");
		assert.ok(sceneRoot.getElementByProperty("name", "node4") === node4, "node4 name");

		assert.strictEqual(node4.children.length, 1, "node4 submesh added");

		var pmesh = node4.children[0];
		assert.ok(pmesh instanceof Path, "polyline mesh class");

		assert.strictEqual(pmesh.segments.length, 2, "polyline mesh segments");
		assert.deepEqual(Array.from(pmesh.fill), [0, 0, 0, 0], "polyline mesh fill");
		assert.deepEqual(Array.from(pmesh.stroke), material1.lineColor, "polyline mesh stroke");
		assert.strictEqual(pmesh.strokeWidth, material1.lineWidth, "polyline mesh strokeWidth");
		assert.deepEqual(pmesh.strokeDashArray, material1.lineStyle.dashPattern, "polyline mesh dashPattern");
		assert.strictEqual(pmesh.segments[0].type, "move", "polyline mesh segment[0].type");
		assert.strictEqual(pmesh.segments[1].type, "line", "polyline mesh segment[1].type");
		assert.deepEqual(pmesh.segments[0].points, [10, 20], "polyline mesh segment[0].points");
		assert.deepEqual(pmesh.segments[1].points, [20, 30, 30, 40], "polyline mesh segment[0].points");

		done();
	});

	QUnit.test("Scene Builder Viewports", function(assert) {

		var done = assert.async();
		var nativeScene = new Scene();
		var sceneRoot = nativeScene.getRootElement();
		var root = new Element();
		sceneRoot.add(root);

		var sceneBuilder = new SceneBuilder();
		var sceneId = "166";

		var vkScene = new Scene(nativeScene);
		sceneBuilder.setRootNode(root, "1", sceneId, vkScene);
		assert.equal(sceneBuilder._nodes.size, 1, "Number of nodes");

		var viewId = "9923";
		var viewInfo = {
			name: "testView",
			viewId: viewId
		};

		localStorage.removeItem("color.backgroundTop");
		localStorage.removeItem("color.backgroundBottom");

		assert.equal(sceneBuilder._views.size, 0, "number of views before insert");
		sceneBuilder.insertView(viewInfo, sceneId);
		assert.equal(sceneBuilder._views.size, 1, "number of views after insert");
		assert.equal(sceneBuilder._views.get(viewId).getTopColor(), "rgba(238, 238, 238, 1)", "default view top background color");
		assert.equal(sceneBuilder._views.get(viewId).getBottomColor(), "rgba(255, 255, 255, 1)", "default view bottom background color");

		var viewId2 = "12345";
		var viewInfo2 = {
			name: "testView 2",
			viewId: viewId2
		};

		var view2TopColor = "#666666";
		var view2BottomColor = "#666666";
		localStorage.setItem("color.backgroundTop", view2TopColor);
		localStorage.setItem("color.backgroundBottom", view2BottomColor);
		sceneBuilder.insertView(viewInfo2, sceneId);

		assert.equal(sceneBuilder._views.get(viewId2).getTopColor(), view2TopColor, "Top background color saved in settings");
		assert.equal(sceneBuilder._views.get(viewId2).getBottomColor(), view2BottomColor, "Bottom background color saved in settings");

		localStorage.removeItem("color.backgroundTop");
		localStorage.removeItem("color.backgroundBottom");

		var viewId3 = "123456";
		var viewInfo3 = {
			name: "testView 3",
			topColour: [1.0, 1.0, 1.0, 1.0],
			bottomColour: [0.1, 0.2, 0.3, 0.4],
			viewId: viewId3
		};

		sceneBuilder.insertView(viewInfo3, sceneId);
		assert.equal(sceneBuilder._views.get(viewId3).getTopColor(), "rgba(255,255,255,1)", "View top background color from info");
		assert.equal(sceneBuilder._views.get(viewId3).getBottomColor(), "rgba(25,51,76,0.4)", "View bottom background color from info");


		done();
	});

	QUnit.test("Create and delete nodes", function(assert) {
		var done = assert.async();

		var nativeScene = new Scene();
		var sceneRoot = nativeScene.getRootElement();
		var root = new Element();
		sceneRoot.add(root);

		var sceneBuilder = new SceneBuilder();
		var sceneId = "166";

		var vkScene = new Scene(nativeScene);
		sceneBuilder.setRootNode(root, "1", sceneId, vkScene);
		assert.equal(sceneBuilder._nodes.size, 1);

		var nodeInfo1 = {
			name: "toplevel",
			parentId: "1",
			sid: "2"
		};
		var node1 = sceneBuilder.createNode(nodeInfo1, sceneId);
		assert.ok(node1.parent === root, "node1 parent");
		assert.ok(sceneRoot.getElementByProperty("sid", "2") === node1, "node1 sid");
		assert.ok(sceneRoot.getElementByProperty("name", "toplevel") === node1, "node1 name");

		var nodeInfo2 = {
			name: "group",
			parentId: "2",
			sid: "3"
		};
		var node2 = sceneBuilder.createNode(nodeInfo2, sceneId);

		var nodeInfo3 = {
			name: "node",
			parentId: "3",
			sid: "4"
		};
		var node3 = sceneBuilder.createNode(nodeInfo3, sceneId);
		assert.equal(sceneBuilder._nodes.size, 4);

		sceneBuilder.removeNode(node2);
		assert.ok(sceneBuilder.getNode(nodeInfo1.sid) != null, "first node");
		assert.ok(sceneBuilder.getNode(nodeInfo2.sid) == null, "deleted node");
		assert.ok(sceneBuilder.getNode(nodeInfo3.sid) == null, "child of deleted node");
		assert.equal(sceneBuilder._nodes.size, 2);

		var node1again = sceneBuilder.createNode(nodeInfo1, sceneId);
		assert.equal(sceneBuilder._nodes.size, 2);

		sceneBuilder.removeNode(node1again);
		assert.equal(sceneBuilder._nodes.size, 1);
		sceneBuilder.removeNode(node1);
		sceneBuilder.removeNode(node2);
		sceneBuilder.removeNode(node3);
		assert.equal(sceneBuilder._nodes.size, 1);
		done();
	});

	QUnit.test("Create and delete svgImage", function(assert) {
		var done = assert.async();

		var nativeScene = new Scene();
		var sceneRoot = nativeScene.getRootElement();
		var root = new Element();
		sceneRoot.add(root);

		var sceneBuilder = new SceneBuilder();
		var sceneId = "166";

		var vkScene = new Scene(nativeScene);
		sceneBuilder.setRootNode(root, "1", sceneId, vkScene);
		assert.equal(sceneBuilder._nodes.size, 1);

		var nodeInfo1 = {
			name: "svg image",
			parentId: "1",
			sid: "2",
			contentType: "SVG",
			imageId: "3212",
			width: 400,
			height: 540
		};

		var node1 = sceneBuilder.createNode(nodeInfo1, sceneId);
		assert.ok(node1.parent === root, "node1 parent");
		assert.ok(sceneRoot.getElementByProperty("sid", "2") === node1, "node1 sid");
		assert.ok(sceneRoot.getElementByProperty("name", "svg image") === node1, "node1 name");
		assert.ok(node1 instanceof SvgImage);

		assert.equal(node1.sid, "2");
		assert.equal(node1.nodeContentType, "SvgImage");
		assert.equal(node1.imageId, "3212");
		assert.equal(node1.width, 400);
		assert.equal(node1.height, 540);

		assert.equal(sceneBuilder._nodes.size, 2);
		sceneBuilder.removeNode(node1);
		assert.equal(sceneBuilder._nodes.size, 1);

		done();
	});

	QUnit.test("Test color conversion function", function(assert) {
		var done = assert.async();

		var sceneBuilder = new SceneBuilder();
		var result = sceneBuilder._getSavedColor(undefined, undefined);
		assert.strictEqual(result, undefined, "Both colors are empty");
		result = sceneBuilder._getSavedColor([1, 2], undefined);
		assert.strictEqual(result, undefined, "Invalid first colors and empty second color");
		result = sceneBuilder._getSavedColor([0.5, 0.5, 0.5], undefined);
		assert.strictEqual(result, "rgba(127,127,127,1)", "Valid first color no alpha with empty second color");
		result = sceneBuilder._getSavedColor([0.5, 0.5, 0.5, 0.5], undefined);
		assert.strictEqual(result, "rgba(127,127,127,0.5)", "Valid first color with alpha with empty second color");
		result = sceneBuilder._getSavedColor(undefined, "rgb(100, 100, 100, 1)");
		assert.strictEqual(result, "rgb(100, 100, 100, 1)", "Empty first color with valid second color");
		result = sceneBuilder._getSavedColor(undefined, "#666666");
		assert.strictEqual(result, "#666666", "Empty first color with valid second color");

		done();
	});


	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
