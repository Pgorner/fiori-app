/* global QUnit*/

sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/vk/svg/ViewStateManager",
	"sap/ui/vk/svg/Viewport",
	"sap/ui/vk/svg/Scene",
	"sap/ui/vk/svg/Element",
	"sap/ui/vk/svg/Rectangle",
	"sap/ui/vk/svg/Line",
	"sap/ui/vk/svg/Ellipse",
	"sap/ui/vk/svg/Path",
	"sap/ui/vk/svg/Polyline",
	"sap/ui/vk/svg/Text",
	"sap/ui/vk/svg/Image",
	"sap/ui/vk/svg/SvgImage"
], function(
	nextUIUpdate,
	ViewStateManager,
	Viewport,
	Scene,
	Element,
	Rectangle,
	Line,
	Ellipse,
	Path,
	Polyline,
	Text,
	Image,
	SvgImage
) {
	"use strict";

	var viewStateManager = new ViewStateManager();
	var viewport = new Viewport({ viewStateManager: viewStateManager });
	viewport.placeAt("content");
	nextUIUpdate.runSync();

	var scene = new Scene();
	var root = scene.getRootElement();
	var group1Params = {
		name: "group",
		sid: "00-00",
		matrix: new Float32Array([1.01, 0.011, -0.022, 1.02, 1, 2])
	};
	var group = new Element(group1Params);
	root.add(group);

	var rectParams = {
		name: "rect",
		sid: "11-11",
		x: 12,
		y: 23,
		width: 123,
		height: 234,
		rx: 2,
		ry: 3,
		matrix: new Float32Array([0.5, 0.1, -0.05, 0.6, 3, 4]),
		lineStyle: {
			veid: "ls-rect-1",
			// colour: new Float32Array([ 0.1, 0.2, 0.3, 0.4 ]),
			colour: new Float32Array([0.2, 0.3, 0.4, 0.5]),
			width: 3,
			dashes: [6, -2, -9, 3]
		},
		fillStyle: {
			veid: "fs-rect-1",
			colour: new Float32Array([0.1, 0.2, 0.3, 0.4])
		}
	};
	group.add(new Rectangle(rectParams));

	var lineParams = {
		name: "line",
		sid: "22-22",
		x1: -12,
		y1: 23,
		x2: 345,
		y2: 456,
		matrix: new Float32Array([0.6, 0.03, -0.06, 0.7, -5, -6]),
		lineStyle: {
			colour: new Float32Array([0.2, 0.9, 0.4, 0.8]),
			width: 5,
			dashes: [10, 5, -15, 5]
		}
	};
	group.add(new Line(lineParams));

	var ellipseParams = {
		name: "ellipse",
		sid: "33-33",
		cx: 213,
		cy: 332,
		major: 133,
		minor: 244,
		matrix: new Float32Array([0.5, -0.04, 0.05, 0.4, 7, -8]),
		lineStyle: {
			// colour: new Float32Array([ 0.5, 0.4, 0.3, 0.2 ]),
			colour: new Float32Array([0.3, 0.4, 0.5, 0.6]),
			width: 3,
			dashes: [10, -2, 15, 3]
		},
		fillStyle: {
			colour: new Float32Array([0.5, 0.4, 0.3, 0.2])
		}
	};
	group.add(new Ellipse(ellipseParams));

	var polylineParams = {
		name: "polyline",
		sid: "44-44",
		points: [100, 100, 200, 100, 300, 200, 300, 300],
		matrix: new Float32Array([0.75, 0.04, -0.05, 0.85, 9, 10]),
		lineStyle: {
			// colour: new Float32Array([ 0.4, 0.5, 0.6, 0.7 ]),
			colour: new Float32Array([0.7, 0.7, 0.1, 0.7]),
			width: 3,
			dashes: [9, 0, 6, -3]
		},
		fillStyle: {
			colour: new Float32Array([0.4, 0.5, 0.6, 0.7])
		}
	};
	group.add(new Polyline(polylineParams));

	var pathParams = {
		name: "path",
		sid: "55-55",
		segments: [{
			type: "move",
			points: [400, 100]
		}, {
			type: "arc",
			major: 180,
			minor: 170,
			clockwise: true,
			points: [400, 400]
		}, {
			type: "close"
		}, {
			type: "move",
			points: [100, 100]
		}, {
			type: "bezier",
			degree: 3,
			smooth: true,
			points: [200, 100, 300, 200, 300, 300]
		}, {
			type: "bezier",
			degree: 3,
			smooth: true,
			relative: true,
			points: [201, 101, 301, 201, 301, 301]
		}, {
			type: "bezier",
			degree: 3,
			smooth: true,
			points: [205, 105, 305, 205]
		}, {
			type: "bezier",
			degree: 3,
			relative: true,
			points: [208, 108, 308, 208]
		}, {
			type: "move",
			points: [50, 50]
		}, {
			type: "line",
			points: [250, 50, 250, 250, 50, 250]
		}, {
			type: "close"
		}],
		matrix: new Float32Array([1.1, 0.1, -0.2, 1.2, -11, 12]),
		lineStyle: {
			// colour: new Float32Array([ 0.5, 0.9, 0.8, 0.7 ]),
			colour: new Float32Array([0.1, 0.5, 0.9, 0.9]),
			width: 2,
			dashes: [4, 2, 6, 2]
		},
		fillStyle: {
			colour: new Float32Array([0.5, 0.9, 0.8, 0.7])
		}
	};
	group.add(new Path(pathParams));

	var textParams = {
		name: "text",
		x: 11,
		y: 22,
		dx: 3,
		dy: 4,
		style: {
			size: "4em",
			fontFace: "Comic Sans MS"
		},
		content: [{
			type: 10,
			text: "ABC.123"
		}, {
			type: 12,
			style: {
				size: 44.4,
				fontFace: "Impact"
			},
			pathSegments: [{
				type: "move",
				points: [10, 290]
			}, {
				type: "arc",
				clockwise: true,
				major: 120,
				minor: 120,
				points: [150, 150]
			}, {
				type: "arc",
				clockwise: false,
				major: 120,
				minor: 120,
				points: [290, 10]
			}],
			content: [{
				type: 10,
				text: "DEF.456"
			}, {
				type: 11,
				style: {
					size: 33.3,
					fontFace: "Courier"
				},
				content: [{
					type: 10,
					text: "-abcdef-"
				}]
			}, {
				type: 10,
				text: "XYZ.789"
			}]
		}],
		sid: "66-66",
		matrix: new Float32Array([1.04, 0.01, 0.02, 1.05, -13, 14]),
		lineStyle: {
			colour: new Float32Array([0.9, 0.9, 0.3, 0.8]),
			width: 2,
			dashes: [4, 2]
		},
		fillStyle: {
			colour: new Float32Array([0.8, 0.4, 0.2, 0.7])
		}
	};
	group.add(new Text(textParams));

	var imageParams = {
		name: "image",
		sid: "77-77",
		x: -13,
		y: -14,
		width: 135,
		height: 246,
		data: "data:image/png;base64,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",
		matrix: new Float32Array([0.6, 0.1, -0.05, 0.7, 5, 6])
	};
	group.add(new Image(imageParams));

	viewport._setScene(scene);
	viewStateManager._setScene(scene);

	// set node fake veid
	var nodeHierarchy = viewport.getScene().getDefaultNodeHierarchy();
	var allNodeRefs = nodeHierarchy.findNodesByName();
	allNodeRefs.forEach(function(node) {
		node.userData.treeNode = { sid: node.uid };
	});

	// var maxDifference = 1e-3;
	// function assertClose(assert, actual, expected, message) {
	// 	var passes = (actual === expected) || Math.abs(actual - expected) <= maxDifference;
	// 	assert.pushResult({ result: passes, actual: actual, expected: expected, message: message + " (" + actual + " ~ " + expected + ")" });
	// }

	QUnit.test("SVG Element", function(assert) {
		var done = assert.async();

		function hexColor(color) {
			if (color[3] === 0) {
				return "none";
			}
			var hex = (((color[0] * 255) << 24) | ((color[1] * 255) << 16) | ((color[2] * 255) << 8) | (color[3] * 255)) >>> 0;
			return "#" + ("00000000" + hex.toString(16)).slice(-8);
		}

		function testDomRef(element) {
			var name = element.name;
			var domRef = element.domRef;
			assert.ok(domRef, name + " dom element");
			assert.strictEqual(domRef.tagName, element.tagName(), name + " tag name");
			assert.strictEqual(domRef.id, element.uid, name + " unique id");
			assert.strictEqual(domRef.getAttribute("transform"), "matrix(" + element.matrix.join() + ")", name + " matrix");
			// if (element.fill) {
			// 	assert.strictEqual(domRef.getAttribute("fill"), hexColor(element.fill), name + " fill");
			// }
			// if (element.stroke) {
			// 	assert.strictEqual(domRef.getAttribute("stroke"), hexColor(element.stroke), name + " stroke");
			// 	assert.strictEqual(domRef.getAttribute("stroke-width"), element.strokeWidth.toString(), name + " stroke-width");
			// 	if (element.strokeDashArray) {
			// 		assert.strictEqual(domRef.getAttribute("stroke-dasharray"), element.strokeDashArray.join(" "), name + " stroke-dasharray");
			// 	}
			// }

			switch (domRef.tagName) {
				case "rect":
					assert.strictEqual(domRef.getAttribute("x"), element.x.toString(), name + " x");
					assert.strictEqual(domRef.getAttribute("y"), element.y.toString(), name + " y");
					assert.strictEqual(domRef.getAttribute("width"), element.width.toString(), name + " width");
					assert.strictEqual(domRef.getAttribute("height"), element.height.toString(), name + " height");
					assert.strictEqual(domRef.getAttribute("rx"), element.rx.toString(), name + " rx");
					assert.strictEqual(domRef.getAttribute("ry"), element.ry.toString(), name + " ry");
					break;
				case "line":
					assert.strictEqual(domRef.getAttribute("x1"), element.x1.toString(), name + " x1");
					assert.strictEqual(domRef.getAttribute("y1"), element.y1.toString(), name + " y1");
					assert.strictEqual(domRef.getAttribute("x2"), element.x2.toString(), name + " x2");
					assert.strictEqual(domRef.getAttribute("y2"), element.y2.toString(), name + " y2");
					break;
				case "ellipse":
					assert.strictEqual(domRef.getAttribute("cx"), element.cx.toString(), name + " cx");
					assert.strictEqual(domRef.getAttribute("cy"), element.cy.toString(), name + " cy");
					assert.strictEqual(domRef.getAttribute("rx"), element.rx.toString(), name + " rx");
					assert.strictEqual(domRef.getAttribute("ry"), element.ry.toString(), name + " ry");
					break;
				case "polyline":
					assert.strictEqual(domRef.getAttribute("points"), element.points.join(" "), name + " points");
					break;
				case "path":
					assert.strictEqual(domRef.getAttribute("d"), "M 400 100 A 180 170 0 0 1 400 400 Z M 100 100 S 200 100 300 200 s 201 101 301 201 S 205 105 305 205 M 50 50 L 250 50 L 250 250 L 50 250 Z", " path.d");
					break;
				case "text":
					var textPathContent = element.content[1];
					var tspanContent = textPathContent.content[1];
					assert.strictEqual(domRef.textContent, element.content[0].text + textPathContent.content[0].text + tspanContent.content[0].text + textPathContent.content[2].text, name + " textContent");
					assert.strictEqual(domRef.getAttribute("font-family"), element.style.fontFace, name + " fontFamily");
					assert.strictEqual(domRef.getAttribute("font-size"), element.style.size.toString(), name + " fontSize");

					assert.strictEqual(domRef.childNodes.length, 2, name + " childNodes");
					assert.strictEqual(domRef.children.length, 1, name + " children");
					assert.strictEqual(domRef.childNodes[0].nodeName, "#text", name + " text1 nodeName");
					assert.strictEqual(domRef.childNodes[0].textContent, element.content[0].text, name + " text1");

					var textPath = domRef.childNodes[1];
					assert.strictEqual(textPath.getAttribute("font-family"), textPathContent.style.fontFace, name + " textPath fontFamily");
					assert.strictEqual(textPath.getAttribute("font-size"), textPathContent.style.size.toString(), name + " textPath fontSize");
					assert.strictEqual(textPath.childNodes.length, 4, name + " textPath childNodes");
					assert.strictEqual(textPath.children.length, 2, name + " textPath children");
					assert.strictEqual(textPath.getAttribute("href"), "#" + textPath.childNodes[0].getAttribute("id"), name + " textPath href");
					assert.strictEqual(textPath.childNodes[0].nodeName, "path", name + " textPath path nodeName");
					assert.strictEqual(textPath.childNodes[0].getAttribute("d"), "M 10 290 A 120 120 0 0 1 150 150 A 120 120 0 0 0 290 10", name + " textPath path");
					assert.strictEqual(textPath.childNodes[1].nodeName, "#text", name + " textPath text1 nodeName");
					assert.strictEqual(textPath.childNodes[1].textContent, textPathContent.content[0].text, name + " textPath text1");
					assert.strictEqual(textPath.childNodes[3].nodeName, "#text", name + " textPath text2 nodeName");
					assert.strictEqual(textPath.childNodes[3].textContent, textPathContent.content[2].text, name + " textPath text2");

					var tspan = textPath.childNodes[2];
					assert.strictEqual(tspan.nodeName, "tspan", name + " tspan nodeName");
					assert.strictEqual(tspan.getAttribute("font-family"), tspanContent.style.fontFace, name + " tspan fontFamily");
					assert.strictEqual(tspan.getAttribute("font-size"), tspanContent.style.size.toString(), name + " tspan fontSize");
					assert.strictEqual(tspan.childNodes.length, 1, name + " tspan childNodes");
					assert.strictEqual(tspan.children.length, 0, name + " tspan children");
					assert.strictEqual(tspan.childNodes[0].nodeName, "#text", name + " tspan text1 nodeName");
					assert.strictEqual(tspan.childNodes[0].textContent, tspanContent.content[0].text, name + " tspan text1");
					break;
				case "image":
					assert.strictEqual(domRef.getAttribute("x"), element.x.toString(), name + " x");
					assert.strictEqual(domRef.getAttribute("y"), element.y.toString(), name + " y");
					assert.strictEqual(domRef.getAttribute("width"), element.width.toString(), name + " width");
					assert.strictEqual(domRef.getAttribute("height"), element.height.toString(), name + " height");
					assert.strictEqual(domRef.getAttribute("href"), element.data, name + " href");
					break;
				default:
					break;
			}
		}

		function testElement(params) {
			var name = params.name;
			var nodes = nodeHierarchy.findNodesByName({ value: name });
			assert.ok(nodes && nodes.length === 1 && nodes[0].name === name, name + " found");
			var element = nodes[0];
			assert.strictEqual(element.sid, params.sid, name + " element sid");
			testElementContent(element, params);

			var clone = element.clone();
			assert.notEqual(clone, element, name + " cloned");
			testElementContent(clone, params);

			testDomRef(element);

			var domRef = element.domRef;
			element.invalidate();
			assert.notEqual(element.domRef, domRef, name + " invalidate()");
			testDomRef(element);

			domRef = element.domRef;
			element.invalidate();
			assert.notEqual(element.domRef, domRef, name + " rerender()");
			testDomRef(element);
		}

		function rgbaToCSS(r, g, b, a) {
			var hex = ((r << 24) | (g << 16) | (b << 8) | (a * 255)) >>> 0;
			return "#" + ("00000000" + hex.toString(16)).slice(-8);
		}

		function colorToCSS(c) {
			return rgbaToCSS(c[0] * 255, c[1] * 255, c[2] * 255, c[3]);
		}

		function testElementContent(element, params) {
			var name = element.name;
			assert.strictEqual(element.name, params.name, name + " element name");
			assert.deepEqual(element.matrix, params.matrix, name + " element matrix");
			var lineStyle = params.lineStyle;
			if (lineStyle) {
				assert.deepEqual(element.stroke, lineStyle.colour, name + " element stroke color");
				assert.strictEqual(element.strokeWidth, lineStyle.width, name + " element stroke width");
				assert.deepEqual(element.strokeDashArray, Element._convertDashes(lineStyle.dashes, element.strokeWidth), name + " element strokeDashArray");
				assert.deepEqual(Element._convertToDashes(element.strokeDashArray, element.strokeWidth), lineStyle.dashes, name + " element dashes");
			}
			var fillStyle = params.fillStyle;
			if (element.fill !== undefined && fillStyle !== undefined) {
				assert.deepEqual(element.fill, fillStyle.colour, name + " element fill color");
			}

			var fillStyles = [], lineStyles = [], textStyles = [];
			var content = element._getParametricShape(fillStyles, lineStyles, textStyles);
			if (element.fill !== undefined) {
				assert.strictEqual(fillStyles.length, 1, "content fillStyles");
				assert.strictEqual(content.fill, 0, "content fill");
				assert.deepEqual(fillStyles[0].colour, colorToCSS(element.fill), name + " content fillStyle colour");
			}
			if (element.stroke !== undefined) {
				assert.strictEqual(lineStyles.length, 1, "content lineStyles");
				assert.strictEqual(content.stroke, 0, "content stroke");
				assert.deepEqual(lineStyles[0].colour, colorToCSS(element.stroke), name + " content lineStyle colour");
				assert.strictEqual(lineStyles[0].width, element.strokeWidth + "px", "content lineStyle width");
				assert.deepEqual(lineStyles[0].dashes, lineStyle.dashes, "content lineStyle dashes");
			}

			switch (element.tagName()) {
				case "rect":
					assert.strictEqual(element.x, params.x, name + " element x");
					assert.strictEqual(element.y, params.y, name + " element y");
					assert.strictEqual(element.width, params.width, name + " element width");
					assert.strictEqual(element.height, params.height, name + " element height");
					assert.strictEqual(element.rx, params.rx, name + " element rx");
					assert.strictEqual(element.ry, params.ry, name + " element ry");
					assert.strictEqual(content.type, "rectangle", "content type");
					assert.strictEqual(content.width, element.width, "content width");
					assert.strictEqual(content.length, element.height, "content length");
					assert.strictEqual(content.radius, Math.min(element.rx, element.ry), "content radius");
					break;
				case "line":
					assert.strictEqual(element.x1, params.x1, name + " element x1");
					assert.strictEqual(element.y1, params.y1, name + " element y1");
					assert.strictEqual(element.x2, params.x2, name + " element x2");
					assert.strictEqual(element.y2, params.y2, name + " element y2");
					assert.strictEqual(content.type, "line", "content type");
					assert.strictEqual(content.x1, element.x1, "content x1");
					assert.strictEqual(content.y1, element.y1, "content y1");
					assert.strictEqual(content.x2, element.x2, "content x2");
					assert.strictEqual(content.y2, element.y2, "content y2");
					break;
				case "ellipse":
					assert.strictEqual(element.cx, params.cx, name + " element cx");
					assert.strictEqual(element.cy, params.cy, name + " element cy");
					assert.strictEqual(element.rx, params.major, name + " element rx");
					assert.strictEqual(element.ry, params.minor, name + " element ry");
					assert.strictEqual(content.type, "ellipse", "content type");
					assert.strictEqual(content.major, element.rx, "content rx");
					assert.strictEqual(content.minor, element.ry, "content ry");
					break;
				case "path":
					assert.deepEqual(element.segments, params.segments, name + " element segments");
					assert.strictEqual(content.type, "path", "content type");
					assert.strictEqual(content.segments, element.segments, "content segments");
					break;
				case "polyline":
					assert.deepEqual(element.points, new Float32Array(params.points), name + " element points");
					assert.strictEqual(content.type, "polyline", "content type");
					assert.deepEqual(content.points, Array.from(element.points), "content points");
					assert.strictEqual(content.closed, element.closed, "content closed");
					assert.strictEqual(content.dim, 2, "content dim");
					break;
				case "text":
					assert.deepEqual(element.content, params.content, name + " element content");
					assert.deepEqual(element.style, params.style, name + " element style");
					assert.strictEqual(content.type, "text", "content type");
					assert.strictEqual(content.x, element.x, "content x");
					assert.strictEqual(content.y, element.y, "content y");
					assert.strictEqual(content.dx, element.dx, "content dx");
					assert.strictEqual(content.dy, element.dy, "content dy");
					assert.ok(content.children && content.children.length === 2, "content children");
					assert.strictEqual(content.children[0].text, element.content[0].text, "content children[0].text");
					var c1 = content.children[1];
					assert.strictEqual(c1.type, "span", "c1.type");
					assert.ok(c1.children && c1.children.length === 3, "content c1.children");
					assert.strictEqual(c1.children[0].text, element.content[1].content[0].text, "content c1.children[0].text");
					assert.strictEqual(c1.children[2].text, element.content[1].content[2].text, "content c1.children[2].text");
					var c2 = content.children[1].children[1];
					assert.strictEqual(c2.type, "span", "c2.type");
					assert.ok(c2.children && c2.children.length === 1, "content c2.children");
					assert.strictEqual(c2.children[0].text, element.content[1].content[1].content[0].text, "content c2.children[0].text");
					assert.strictEqual(textStyles.length, 3, "textStyles count");
					assert.deepEqual(textStyles[0], element.style, "textStyles[0]");
					assert.deepEqual(textStyles[1], element.content[1].style, "textStyles[1]");
					assert.deepEqual(textStyles[2], element.content[1].content[1].style, "textStyles[2]");
					break;
				case "image":
					assert.strictEqual(element.x, params.x, name + " element x");
					assert.strictEqual(element.y, params.y, name + " element y");
					assert.strictEqual(element.width, params.width, name + " element width");
					assert.strictEqual(element.height, params.height, name + " element height");
					assert.strictEqual(element.data, params.data, name + " element data");
					assert.strictEqual(content.type, "rectangle", "content type");
					assert.strictEqual(content.width, element.width, "content width");
					assert.strictEqual(content.length, element.height, "content length");
					break;
				default:
					break;
			}
		}

		testElement(group1Params);
		testElement(rectParams);
		testElement(lineParams);
		testElement(ellipseParams);
		testElement(polylineParams);
		testElement(pathParams);
		testElement(textParams);
		testElement(imageParams);

		rectParams.lineStyle = {
			colour: new Float32Array([0.5, 0.4, 0.3, 0.2]),
			width: 2,
			dashes: [5, -1, -8, 2]
		};
		rectParams.fillStyle = {
			colour: new Float32Array([0.4, 0.3, 0.2, 0.1])
		};
		var rectNodes = nodeHierarchy.findNodesByName({ value: rectParams.name });
		assert.ok(rectNodes && rectNodes.length === 1 && rectNodes[0].name === rectParams.name, rectParams.name + " found");
		rectNodes[0].setLineStyle(rectParams.lineStyle);
		rectNodes[0].setFillStyle(rectParams.fillStyle);
		testElement(rectParams);

		var matrix1 = new Float32Array([1, 2, 3, 4, 5, 6]);
		var matrix2 = new Float32Array([7, 8, 9, 10, 11, 12]);
		var m1x2 = Element._multiplyMatrices(matrix1, matrix2);
		assert.deepEqual(m1x2, new Float32Array([31, 46, 39, 58, 52, 76]), "Element._multiplyMatrices");
		var m1Inv = Element._invertMatrix(matrix1);
		assert.deepEqual(m1Inv, new Float32Array([-2, 1, 1.5, -0.5, 1, -2]), "Element._invertMatrix");
		var m1x2xi1 = Element._multiplyMatrices(m1Inv, m1x2);
		assert.deepEqual(m1x2xi1, matrix2, "Element inverted matrix multiply");

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

		var sx = 2;
		var sy = 3;
		var px = 4;
		var py = 5;
		for (var i = 0; i < 360; i += 15) {
			var angle = i * Math.PI / 180;
			var sa = Math.sin(angle), ca = Math.cos(angle);
			var qz = Math.sin(angle / 2), qw = Math.cos(angle / 2);

			// var q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);
			// var m = new THREE.Matrix4().makeRotationFromQuaternion(q);
			// var q2 = new THREE.Quaternion();
			// m.decompose(new THREE.Vector3(), q2, new THREE.Vector3());

			var m1 = new Float32Array([sx * ca, sx * -sa, sy * sa, sy * ca, px, py]);
			var res = Element._decompose(m1);
			var m2 = Element._compose(res.position, res.quaternion, res.scale);

			assert.deepEqual(res.position, [px, py, 0], "Element._decompose position " + i);
			testArray(res.quaternion, res.quaternion[2] * qz >= 0 ? [0, 0, qz, qw] : [0, 0, -qz, -qw], "Element._decompose quaternion " + i);
			testArray(res.scale, [sx, sy, 1], "Element._decompose scale " + i);
			testArray(m2, m1, "Element decompose & compose " + i);

			// invert y-axis and test again
			m1[2] *= -1;
			m1[3] *= -1;
			res = Element._decompose(m1);
			m2 = Element._compose(res.position, res.quaternion, res.scale);

			assert.deepEqual(res.position, [px, py, 0], "Element._decompose position " + i);
			testArray(res.quaternion, res.quaternion[2] * qz >= 0 ? [0, 0, qz, qw] : [0, 0, -qz, -qw], "Element._decompose quaternion " + i);
			testArray(res.scale, [sx, -sy, 1], "Element._decompose scale " + i);
			testArray(m2, m1, "Element decompose & compose " + i);
		}

		function testStyles(params) {
			var name = params.name;
			var nodes = nodeHierarchy.findNodesByName({ value: name });
			assert.ok(nodes && nodes.length === 1 && nodes[0].name === name, name + " found");
			var element = nodes[0];

			assert.ok(!element.hasClass("testStyle"), "no test style set");

			element.addClass("testStyle");
			assert.ok(element.hasClass("testStyle"), "test style added");

			element.removeClass("testStyle");
			assert.ok(!element.hasClass("testStyle"), "test style removed");

			element.toggleClass("testStyle");
			assert.ok(element.hasClass("testStyle"), "test style toggled on");

			element.toggleClass("testStyle");
			assert.ok(!element.hasClass("testStyle"), "test style toggled off");
		}

		testStyles(group1Params);

		var text1 = new Text({
			content: [{
				type: 10,
				text: " \t XYZ 123 \t "
			}, {
				type: 11,
				x: 12.3,
				y: 20,
				style: {
					fill: "#123", // "rgb(17, 34, 51)""
					size: 12.5,
					fontFace: "comic sans ms",
					fontWeight: "bold",
					fontStyle: "italic",
					textDecoration: "line-through"
				},
				content: [{
					type: 10,
					text: " \t ABC 456 \t "
				}]
			}, {
				type: 10,
				text: " \t UVW 789 \t "
			}]
		});

		function testHtmlText(htmlText) {
			var htmlElem = document.createElement("html");
			htmlElem.innerHTML = htmlText;
			// console.log("!!!", htmlText);
			// console.log(">>>", htmlElem.innerHTML);
			var textNodes = htmlElem.getElementsByTagName("body")[0].childNodes;
			assert.strictEqual(textNodes.length, 3, "Text nodes count");
			// console.log(textNodes);

			assert.strictEqual(textNodes[0].nodeName, "#text", "text1 nodeName");
			assert.strictEqual(textNodes[0].childNodes.length, 0, "text1 child nodes");
			assert.strictEqual(textNodes[0].data, "XYZ 123 \t ", "text1 data");

			assert.strictEqual(textNodes[1].nodeName, "P", "p nodeName");
			assert.strictEqual(textNodes[1].childNodes.length, 1, "p node child nodes");

			assert.strictEqual(textNodes[2].nodeName, "#text", "text1 nodeName");
			assert.strictEqual(textNodes[2].childNodes.length, 0, "text1 child nodes");
			assert.strictEqual(textNodes[2].data, " \t UVW 789 \t ", "text1 data");

			var span = textNodes[1].childNodes[0];
			assert.strictEqual(span.nodeName, "SPAN", "span nodeName");
			assert.strictEqual(span.childNodes.length, 1, "span child nodes");

			var spanStyle = span.style;
			assert.notEqual(spanStyle, undefined, "span style exists");
			assert.strictEqual(spanStyle.fontSize, (text1.content[1].style.size * 0.75) + "pt", "span fontSize");
			assert.strictEqual(spanStyle.fontFamily.replaceAll("\"", ""), text1.content[1].style.fontFace, "span fontFamily");
			assert.strictEqual(spanStyle.textDecoration, text1.content[1].style.textDecoration, "span textDecoration");
			assert.strictEqual(spanStyle.color, "rgb(17, 34, 51)", "span color"); // "#123"

			var em = span.childNodes[0]; // italic
			assert.strictEqual(em.nodeName, "EM", "em nodeName");
			assert.strictEqual(em.childNodes.length, 1, "em child nodes");

			var strong = em.childNodes[0]; // bold
			assert.strictEqual(strong.nodeName, "STRONG", "strong nodeName");
			assert.strictEqual(strong.childNodes.length, 1, "strong child nodes");

			var text2 = strong.childNodes[0];
			assert.strictEqual(text2.nodeName, "#text", "text2 nodeName");
			assert.strictEqual(text2.data, " \t ABC 456 \t ", "text2 data");
			assert.strictEqual(text2.childNodes.length, 0, "text2 child nodes");
		}

		var htmlText1 = text1.getHtmlTextContent();
		testHtmlText(htmlText1);

		var text2 = new Text();
		text2.setHtmlTextContent(htmlText1);
		testHtmlText(text2.getHtmlTextContent());

		done();
	});

	QUnit.test("Element _updateHotspotDescendants", function(assert) {
		var element = new Rectangle(rectParams);
		element._updateHotspotDescendants();
		assert.ok(element.userData.skipIt);
		assert.deepEqual(element.fill[0], 1);
	});

	QUnit.test("SvgImage testCreation", function(assert) {
		var element = new SvgImage({
			sid: "nodeSid",
			name: "nodeName",
			matrix: [1, 0, 0, -1, 0, 0],
			sceneId: "123",
			imageId: "11",
			width: 500,
			height: 700
		});

		assert.equal("11", element.getImageId());

		const paramsAdded = [];
		const paramsAddedFunc = function(name, value) {
			paramsAdded[name] = value;
		}

		element._setSpecificAttributes(paramsAddedFunc, null);

		assert.equal(paramsAdded.width, 500);
		assert.equal(paramsAdded.height, 700);
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
