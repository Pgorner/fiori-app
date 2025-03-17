/* global QUnit */

sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/vk/Annotation",
	"sap/ui/vk/AnnotationStyle",
	"sap/ui/vk/View",
	"sap/ui/vk/NodeUtils",
	"sap/ui/vk/NodeContentType",
	"sap/ui/vk/threejs/Viewport",
	"sap/ui/vk/threejs/ViewStateManager",
	"sap/ui/vk/threejs/SceneBuilder",
	"sap/ui/vk/thirdparty/three",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector",
	"sap/base/util/uid"
], function(
	nextUIUpdate,
	Annotation,
	AnnotationStyle,
	View,
	NodeUtils,
	NodeContentType,
	Viewport,
	ViewStateManager,
	SceneBuilder,
	THREE,
	ModuleWithContentConnector,
	uid
) {
	"use strict";

	QUnit.moduleWithContentConnector("Viewport", "test-resources/sap/ui/vk/qunit/media/nodes_boxes.json", "threejs.test.json",
		function onLoadingSucceeded(assert) {
			this.scene = this.contentConnector.getContent();
			var root = this.scene.getDefaultNodeHierarchy().getChildren()[0];
			var sb = new SceneBuilder(root);
			sb._vkScene = this.scene;
			this.scene.setSceneBuilder(sb);
		},
		async function beforeEach(assert) {
			this.viewStateManager = new ViewStateManager({ contentConnector: this.contentConnector });
			this.viewport = new Viewport({ contentConnector: this.contentConnector, viewStateManager: this.viewStateManager });
			this.viewport.placeAt("content");
			await nextUIUpdate();
		},
		function afterEach(assert) {
			this.viewport.destroy();
			this.viewport = null;
			this.viewStateManager.destroy();
			this.viewStateManager = null;
		}
	);

	QUnit.test("Annotation Creation", function(assert) {
		var title = "this is a title";
		var annotation = new Annotation({ text: title, style: AnnotationStyle.Default });
		assert.equal(annotation.getText(), title, "title added");
		assert.equal(annotation.getStyle(), AnnotationStyle.Default, "style added");
		annotation.destroy();
	});

	function createAnnotation(scene, annotationInfo) {
		annotationInfo = annotationInfo || {};

		annotationInfo.type = "html";
		annotationInfo.name = annotationInfo.name || "2D Text test node";
		if (annotationInfo.text == null || annotationInfo.text.html == null) {
			annotationInfo.text = { html: annotationInfo.name + "-annotation" };
		}

		var nh = scene.getDefaultNodeHierarchy();
		var node = nh.createNode(null, annotationInfo.name, null, NodeContentType.Annotation, annotationInfo);

		return node;
	}

	QUnit.test("Annotation creation via NodeHierarchy", function(assert) {
		var annotations = this.viewport.getAnnotations();
		assert.equal(annotations.length, 0, "No annotations in new scene");

		var nodeName = "2D Text test node";
		var annotationText = nodeName + "-annotation";
		var node = createAnnotation(this.scene, { name: nodeName, text: { html: annotationText } });

		assert.ok(node, "Node created");
		assert.equal(node.name, nodeName, "Node name is correct");

		annotations = this.viewport.getAnnotations();
		assert.equal(annotations.length, 1, "One annotation added");
		assert.equal(annotations[0].getNodeRef(), node, "Annotation node assigned");
		assert.equal(annotations[0].getName(), nodeName, "Annotation name is correct");
		assert.equal(annotations[0].getText(), annotationText, "Annotation text is correct");
		assert.equal(annotations[0].getText(), annotationText, "Annotation text is set");
	});

	QUnit.test("Annotation synchronization with node", function(assert) {
		var node = createAnnotation(this.scene);

		var annotation = this.viewport.getAnnotations()[0];

		assert.equal(node.name, annotation.getName(), "Name is equal");

		// Check initial state
		assert.notOk(annotation.getSelected(), "Initial annotation selection is ok");
		assert.ok(annotation.getDisplay(), "Initial annotation visibility is ok");
		assert.notOk(this.viewStateManager.getSelectionState(node), "Initial node selection is ok");
		assert.ok(this.viewStateManager.getVisibilityState(node), "Initial node visibility is ok");

		this.viewStateManager.setVisibilityState(node, false);
		assert.notOk(annotation.getDisplay(), "Annotation hidden - sync with node");

		this.viewStateManager.setVisibilityState(node, true);
		assert.ok(annotation.getDisplay(), "Annotation visible - sync with node");

		// Check selection synchronization
		annotation.setSelected(true);
		assert.ok(this.viewStateManager.getSelectionState(node), "Node selected - sync with annotation");

		annotation.setSelected(false);
		assert.notOk(this.viewStateManager.getSelectionState(node), "Node not selected - sync with annotation");

		this.viewStateManager.setSelectionStates(node, []);
		assert.ok(annotation.getSelected(), "Annotation selected - sync with node");

		this.viewStateManager.setSelectionStates([], node);
		assert.notOk(annotation.getSelected(), "Annotation not selected - sync with node");

		// Name synchronization
		var newName = "New name";
		annotation.setName(newName);
		assert.equal(annotation.getName(), newName, "Annotation name changed");
		assert.equal(node.name, newName, "Node name changed");

		node.name = "New node name";
		assert.equal(annotation.getName(), node.name, "Annotation name changed - sync with node");
	});

	QUnit.test("Remove annotation", function(assert) {
		var node = createAnnotation(this.scene);

		var annotations = this.viewport.getAnnotations();
		assert.equal(annotations.length, 1, "Annotation created");

		this.viewStateManager.setSelectionStates(node, []);
		assert.equal(this.viewStateManager.getSelectionState(node), true, "Node selected");

		this.viewport.getScene().getDefaultNodeHierarchy().removeNode(node);

		annotations = this.viewport.getAnnotations();
		assert.equal(annotations.length, 0, "Annotation deleted");

		// Make sure it's also removed from view state manager
		assert.equal(this.viewStateManager.getSelectionState(node), false, "Node is not in list of selected nodes");
	});

	QUnit.test("Test target nodes", function(assert) {
		createAnnotation(this.scene);

		var annotations = this.viewport.getAnnotations();
		assert.equal(annotations[0].getTargetNodes().length, 0, "No target nodes");

		// Create a node to attach annotation to
		var node = this.viewport.getScene().getDefaultNodeHierarchy().createNode(null, "New node", null, NodeContentType.Regular);

		var nodeId = this.viewport.getScene().nodeRefToPersistentId(node);
		createAnnotation(this.scene, { leaderLines: [{ start: { sid: nodeId } }] });
		annotations = this.viewport.getAnnotations();
		assert.equal(annotations.length, 2, "Second annotation created");
		assert.equal(annotations[1].getTargetNodes().length, 1, "One target node");
		assert.equal(annotations[1].getTargetNodes()[0], node, "Correct target node");
	});

	QUnit.test("Update identifiers", function(assert) {
		createAnnotation(this.scene);

		var annotation = this.viewport.getAnnotations()[0];

		var scene = this.viewport.getScene();
		var nodeId = scene.nodeRefToPersistentId(annotation.getNodeRef());
		assert.ok(nodeId, "Default node id set");
		assert.ok(annotation.getAnnotationId(), "Default annotation id set");

		var newNodeId = "123";
		var newAnnotationId = "456";
		annotation.updateNodeId(newNodeId);
		annotation.setAnnotationId(newAnnotationId);
		nodeId = scene.nodeRefToPersistentId(annotation.getNodeRef());
		assert.equal(nodeId, newNodeId, "Node id updated");
		assert.equal(annotation.getAnnotationId(), newAnnotationId, "Annotation id updated");

		this.viewport._clearAnnotations();
		this.viewport._createAnnotations();

		var annotations = this.viewport.getAnnotations();
		assert.equal(annotations.length, 1, "Still only one annotation");

		annotation = annotations[0];
		nodeId = scene.nodeRefToPersistentId(annotation.getNodeRef());
		assert.equal(nodeId, newNodeId, "Node id updated");
		assert.equal(annotation.getAnnotationId(), newAnnotationId, "Annotation id updated");
	});

	QUnit.test("Preserve properties", function(assert) {
		// Check if annotation specific properties are preserved between two creation
		createAnnotation(this.scene);
		var annotation = this.viewport.getAnnotations()[0];

		assert.equal(annotation.getEditable(), false, "Initial editable state");
		assert.equal(annotation.getAnimate(), true, "Initial animate state");
		assert.equal(annotation.getStyle(), AnnotationStyle.Default, "Initial style");

		annotation.setEditable(true);
		annotation.setAnimate(false);
		var newText = "My new text";
		annotation.setText(newText);
		annotation.setStyle(AnnotationStyle.Random);

		assert.equal(annotation.getEditable(), true, "Updated editable state");
		assert.equal(annotation.getAnimate(), false, "Updated animate state");
		assert.equal(annotation.getText(), newText, "Updated text");
		assert.equal(annotation.getStyle(), AnnotationStyle.Random, "Updated style");

		this.viewport._clearAnnotations();
		this.viewport._createAnnotations();

		annotation = this.viewport.getAnnotations()[0];
		assert.equal(annotation.getEditable(), true, "Reloaded editable state");
		assert.equal(annotation.getAnimate(), false, "Reloaded animate state");
		assert.equal(annotation.getText(), newText, "Reloaded text");
		assert.equal(annotation.getStyle(), AnnotationStyle.Random, "Reloaded style");
	});

	QUnit.test("getNodeRefCenter Function", function(assert) {
		var nodeRef = new THREE.Object3D();
		nodeRef.matrixWorld = new THREE.Matrix4();
		nodeRef.matrixWorld.set(0, 0, 1, 0,
			1, 0, 0, 0,
			0, 1, 0, 7.887115478515625,
			0, 0, 0, 1);
		nodeRef.userData.boundingBox = {
			min: {
				x: -107.00257873535156,
				y: -11.392314910888672,
				z: -23.500080108642578
			},
			max: {
				x: 107.00257873535156,
				y: 102.88311004638672,
				z: 23.500080108642578
			}
		};
		var annotation = new Annotation({ nodeRef: nodeRef });
		var center = NodeUtils.centerOfNodes([nodeRef]);
		assert.equal(center[0], 0, "center x");
		assert.equal(center[1], 0, "center y");
		assert.equal(center[2], 53.63251304626465, "center z");
		annotation.destroy();
	});

	QUnit.test("getNodeRefScreenCenter Function", function(assert) {
		this.viewport.render();
		var nodeRef = new THREE.Object3D();
		nodeRef.matrixWorld = new THREE.Matrix4();
		nodeRef.matrixWorld.set(0, 0, 1, 0,
			1, 0, 0, 0,
			0, 1, 0, 7.887115478515625,
			0, 0, 0, 1);
		nodeRef.userData.boundingBox = {
			min: {
				x: -107.00257873535156,
				y: -11.392314910888672,
				z: -23.500080108642578
			},
			max: {
				x: 107.00257873535156,
				y: 102.88311004638672,
				z: 23.500080108642578
			}
		};
		var annotation = new Annotation({});
		annotation.getTargetNodes().push(nodeRef);
		var center = annotation._getNodeRefScreenCenter(this.viewport, nodeRef);
		assert.equal(center.x, 150, "center x");
		assert.equal(center.y, 150, "center y");
		assert.equal(center.depth, 0.45478040232648, "center z");
		annotation.destroy();
	});

	QUnit.test("Test multi annotations and nodes update", async function(assert) {
		var nodes = [];
		this.viewport._getNativeScene().traverse(function(child) {
			if (child.isMesh) {
				child.userData.treeNode = { sid: THREE.MathUtils.generateUUID().toLowerCase() };
				nodes.push(child);
			}
		});
		var styles = [AnnotationStyle.Default, AnnotationStyle.Explode, AnnotationStyle.Square, AnnotationStyle.Random];
		this.viewport._currentView = new View();
		this.viewport._currentView._nodeInfos = [];
		var scene = this.viewport._scene;
		var nodeHierarchy = scene.getDefaultNodeHierarchy();
		nodes.forEach(function(node) {
			var content = {
				sid: scene.nodeRefToPersistentId(node),
				type: "html",
				style: styles[Math.floor(Math.random() * Math.floor(4))],
				text: { html: node.name ? node.name : node.parent.name },
				leaderLines: [{ start: { sid: scene.nodeRefToPersistentId(node) } }]
			};
			var nodeRef = nodeHierarchy.createNode(null, node.name, null, sap.ui.vk.NodeContentType.Annotation, content);
			scene._addAnnotation(content.id, {
				annotation: content,
				node: nodeRef,
				targetNodes: [node]
			});
		});
		// Force rendering annotations into HTML.
		this.viewport.render();
		await nextUIUpdate();
		var ants = this.viewport.getAnnotations();
		var allSelected = true;
		ants.forEach(function(ant) {
			ant.setSelected(true);
			if (!ant.getSelected()) {
				allSelected = false;
			}
		});
		assert.equal(allSelected, true, "Select all annotations and its nodes");
		ants.forEach(function(ant) {
			ant.setSelected(false);
		});

		ants[0].setSelected(true);
		ants[0].setEditable(false);
		ants[0].setEditable(true);
		await nextUIUpdate();
		assert.equal(ants[0].getEditable(), true, "Set annotation[0] in edit mode");

		ants[0].openEditor();
		assert.notEqual(ants[0].getTextEditor(), null, "Open text editor on annotation[0]");

		ants[0].closeEditor();
		assert.equal(ants[0].getTextEditor(), null, "Close text editor on annotation[0]");

		ants[0].setHeight(0.1);
		assert.equal(ants[0].getHeight(), 0.1, "Set annotation[0] height 0.1");

		ants[0].setWidth(0.1);
		assert.equal(ants[0].getWidth(), 0.1, "Set annotation[0] width 0.1");

		ants[0].setXCoordinate(0.5);
		assert.equal(ants[0].getXCoordinate(), 0.5, "Set annotation[0] XCoordinate 0");

		ants[0].setYCoordinate(0.5);
		assert.equal(ants[0].getYCoordinate(), 0.5, "Set annotation[0] YCoordinate 0");

		ants[1].setSelected(true);
		ants[2].setSelected(true);
		await nextUIUpdate();
		assert.equal(ants[2].zIndex - ants[1].zIndex, 1, "Set selected annotation with max z-index");

		assert.notEqual(ants[1].getDomRef().className, "sapUiVizKitAnnotationHidden", "Display annotation when target node is not obscured");

		var id = this.viewport.getIdForLabel();
		var domobj = document.getElementById(id);
		var o = this.viewport._viewportGestureHandler._getOffset(domobj);
		var rect = {
			x: o.x,
			y: o.y,
			w: domobj.offsetWidth,
			h: domobj.offsetHeight
		};
		var event = {
			points: [
				{ x: rect.x + rect.w, y: rect.y + rect.h },
				{ x: rect.x + rect.w, y: rect.y + rect.h }
			],
			buttons: 2,
			timeStamp: 1587686558,
			n: 2,
			d: 0,
			x: rect.x + rect.w,
			y: rect.y + rect.h
		};
		this.viewport._viewportGestureHandler.beginGesture(event);
		this.viewport.rotate(0, 200);
		this.viewport._viewportGestureHandler.endGesture(event);
		this.viewport.render();
		await nextUIUpdate();

		ants[1]._updateBlocked();
		assert.equal(ants[1].getDomRef().style.visibility, "hidden", "Hide annotation when target node is obscured");
	});

	var waitForRender = function(annotation, callback) {
		var f = annotation.onAfterRendering;
		annotation.onAfterRendering = function() {
			// Call original function
			f.call(this);
			annotation.onAfterRendering = f;

			callback.call(this);
		}
	}

	QUnit.test("Fit to text", function(assert) {
		var done = assert.async();
		createAnnotation(this.scene);
		var annotation = this.viewport.getAnnotations()[0];
		waitForRender(annotation, function() {
			annotation.fitToText();
			var width1 = this.getWidth();
			var height1 = this.getHeight();
			assert.ok(width1 > 0.7, "Fit width of annotation to text");
			assert.ok(height1 > 0.1, "Fit height of annotation to text");
			var cssStr = this._textDiv.getDomRef().style.cssText;
			assert.equal(cssStr.includes("--overflow:auto"), false, "Overflow");

			annotation.fitToText(200, 30);
			var width2 = this.getWidth();
			var height2 = this.getHeight();
			assert.ok(width2 < width1, "Fit (with limit) width of annotation to text");
			assert.ok(height2 < height1, "Fit (with limit) height of annotation to text");

			annotation.setText("0");
			annotation.invalidate();
			waitForRender(annotation, function() {
				annotation.fitToText();
				var width3 = this.getWidth();
				var height3 = this.getHeight();
				assert.ok(width3 < width2, "Fit width of annotation to changed text");
				assert.equal(height1, height3, "Fit height of annotation to changed text");
				done();
			});
		});
	});

	function createLargeAnnotation(scene, annotationInfo) {
		annotationInfo = annotationInfo || {};

		annotationInfo.type = "html";
		annotationInfo.name = "Long String";
		if (annotationInfo.text == null || annotationInfo.text.html == null) {
			var testLongStr = "abc +\n";
			for (var i = 0; i < 100; i++) {
				testLongStr = testLongStr + "convertedLinksDefaultTarget \n";
			}
			annotationInfo.text = { html: testLongStr };
		}

		var nh = scene.getDefaultNodeHierarchy();
		var node = nh.createNode(null, null, null, NodeContentType.Annotation, annotationInfo);

		return node;
	}

	QUnit.test("Overflow Text", function(assert) {
		var done = assert.async();
		createLargeAnnotation(this.scene);
		var annotation = this.viewport.getAnnotations()[0];
		var f = annotation.onAfterRendering;
		annotation.onAfterRendering = function() {
			// Call original function
			f.call(this);
			annotation.onAfterRendering = f;

			annotation.fitToText(100, 100);
			var cssStr = this._textDiv.getDomRef().style.cssText;
			assert.ok(cssStr.includes("--overflow:auto") || cssStr.includes("--overflow: auto"), "Overflow");
			done();
		};
	});

	QUnit.test("Wheel Event", function(assert) {
		var done = assert.async();
		createLargeAnnotation(this.scene);
		var annotation = this.viewport.getAnnotations()[0];
		var f = annotation.onAfterRendering;
		annotation.onAfterRendering = function() {
			// Call original function
			f.call(this);
			annotation.onAfterRendering = f;

			annotation.fitToText(100, 100);
			var fireWheelEvent = function(val) {
				var event = new WheelEvent("wheel", { deltaY: val });
				annotation.getDomRef().dispatchEvent(event);
			};
			assert.equal(annotation._textDiv.getDomRef().scrollTop, 0, "Not scrolled");
			annotation.setSelected(true);
			fireWheelEvent(10);
			assert.equal(annotation._textDiv.getDomRef().scrollTop, 10, "Scroll selected");
			fireWheelEvent(10);
			assert.equal(annotation._textDiv.getDomRef().scrollTop, 20, "Additional scroll selected");

			annotation.setSelected(false);
			fireWheelEvent(100);
			assert.equal(annotation._textDiv.getDomRef().scrollTop, 20, "When not selected scroll is not changed");

			done();
		};
	});

	QUnit.test("Random text animation style", function(assert) {
		var done = assert.async();

		var inRange = function(value) {
			var float = parseFloat(value);
			return float > 0 && float < 1;
		};

		createAnnotation(this.scene);
		var annotation = this.viewport.getAnnotations()[0];
		annotation.setStyle(AnnotationStyle.Random);
		assert.equal(annotation.getStyle(), AnnotationStyle.Random, "Style applied");
		annotation.setText("this is test text");
		assert.equal(annotation.getText(), "this is test text", "Text applied");
		var f = annotation.onAfterRendering;
		annotation.onAfterRendering = function() {
			// Call original function
			f.call(this);
			annotation.onAfterRendering = f;

			var domRef = this._textDiv.getDomRef();
			var children = domRef.children;
			for (var i = 0; i < children.length; i++) {
				var style = children[i].style;
				assert.equal(style.animationDirection, "alternate", "Animation direction");
				assert.equal(style.animationDuration, "4s", "Animation duration");
				assert.equal(style.animationFillMode, "both", "Animation fill mode");
				assert.equal(style.animationIterationCount, "1", "Animation iteration count");
				assert.equal(style.animationName, "annotationRandomTextSpan", "Animation name");
				assert.equal(style.animationTimingFunction, "linear", "Animation timing function");
				assert.ok(inRange(style.animationDelay), "Animation delay");
			}

			done();
		};
	});

	QUnit.test("Expand text animation style", function(assert) {
		var done = assert.async();

		var testDuration = function(value, length, index) {
			var float = parseFloat(value);
			var compare = ((0.1 / length) * (index + 1));
			return float > compare - 0.0001 & float < compare + 0.0001;
		};

		createAnnotation(this.scene);
		var annotation = this.viewport.getAnnotations()[0];
		annotation.setStyle(AnnotationStyle.Expand);
		assert.equal(annotation.getStyle(), AnnotationStyle.Expand, "Style applied");
		annotation.setText("this is test text");
		assert.equal(annotation.getText(), "this is test text", "Text applied");
		var f = annotation.onAfterRendering;
		annotation.onAfterRendering = function() {
			// Call original function
			f.call(this);
			annotation.onAfterRendering = f;

			var domRef = this._textDiv.getDomRef();
			var children = domRef.children;
			for (var i = 0; i < children.length; i++) {
				var style = children[i].style;
				assert.ok(testDuration(style.animationDuration, children.length, i), "Animation duration");
				assert.equal(style.animationName, "annotationExpandTextSpan", "Animation name");
				assert.equal(style.animationTimingFunction, "linear", "Animation timing function");
				assert.equal(style.animationDelay, "0.5s", "Animation delay");
			}

			done();
		};
	});

	QUnit.test("SetHeight and setWidth", function(assert) {
		var done = assert.async();
		createLargeAnnotation(this.scene);
		var annotation = this.viewport.getAnnotations()[0];

		assert.ok(annotation._textDiv.getHeight() === "auto");
		assert.ok(annotation._textDiv.getWidth() === "auto");
		var f = annotation.onAfterRendering;
		annotation.onAfterRendering = function() {
			// Call original function
			f.call(this);
			annotation.onAfterRendering = f;
			assert.ok(annotation._textDiv.getHeight() !== "auto");
			assert.ok(annotation._textDiv.getWidth() !== "auto");
			done();
		};
	});

	QUnit.test("test _setSpanText function", function(assert) {
		var annotation = new Annotation({});
		var compareText = "<p><span class=\"sapThemeVITAnnotation\">t</span><span class=\"sapThemeVITAnnotation\">e</span><span class=\"sapThemeVITAnnotation\">s</span><span class=\"sapThemeVITAnnotation\">t</span></p>";
		annotation._textDiv = {
			setHtmlText: function(text) {
				assert.equal(text, compareText, "text updated correctly");
			}
		};
		annotation._setSpanText("<p>test</p>");
		compareText = "<p><span class=\"sapThemeVITAnnotation\">&amp;</span></p>";
		annotation._setSpanText("<p>&amp;</p>");
		compareText = "<p><span class=\"sapThemeVITAnnotation\">&nbsp;</span></p><p><span class=\"sapThemeVITAnnotation\">1</span><span class=\"sapThemeVITAnnotation\">&amp;</span><span class=\"sapThemeVITAnnotation\">2</span></p>";
		annotation._setSpanText("<p>&nbsp;</p><p>1&amp;2</p>");
	});

	QUnit.test("Transformation tests", function(assert) {
		var nodeName = "Test node";
		var annotationText = nodeName + "-annotation";
		var node = createAnnotation(this.scene, { name: nodeName, text: { html: annotationText } });

		var annotation = this.viewport.getAnnotations()[0];

		var transform = annotation.getTransform();
		assert.deepEqual(transform, [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], "Initial annotation transform")

		annotation.setTransform([2, 0, 0, 0, 3, 0, 0, 0, 4, 10, 20, 30]);
		transform = annotation.getTransform();
		assert.deepEqual(transform, [2, 0, 0, 0, 3, 0, 0, 0, 4, 10, 20, 30], "Updated annotation transform");

		assert.equal(node.position.x, "10", "Position X updated");
		assert.equal(node.position.y, "20", "Position Y updated");
		assert.equal(node.position.z, "30", "Position Z updated");
		assert.equal(node.scale.x, "2", "Scale X updated");
		assert.equal(node.scale.y, "3", "Scale Y updated");
		assert.equal(node.scale.z, "4", "Scale Z updated");
	});

	QUnit.test("test text creation", function(assert) {
		var annotationDiv = {
			annotation: {
				id: "123",
				style: AnnotationStyle.Default
			},
			node: {
				name: "123",
				position: {
					x: 0,
					y: 0,
					setX: function() { },
					setY: function() { }
				},
				scale: {
					x: 0,
					y: 0,
					setX: function() { },
					setY: function() { }
				}
			}
		};

		var annotation = Annotation.createAnnotation(annotationDiv, this.viewport);
		assert.equal(annotation.getText(), "", "empty string when no text set");

		annotationDiv.annotation.text = true;
		annotation = Annotation.createAnnotation(annotationDiv, this.viewport);
		assert.equal(annotation.getText(), "", "empty string when no html text set");

		annotationDiv.annotation.text = {
			html: "testHTMLText"
		};
		annotation = Annotation.createAnnotation(annotationDiv, this.viewport);
		assert.equal(annotation.getText(), "testHTMLText", "annotation text matches set HTML text");

		annotationDiv.annotation.text = {
			html: "{Test"
		};
		annotation = Annotation.createAnnotation(annotationDiv, this.viewport);
		assert.equal(annotation.getText(), "{Test", "annotation text matches set HTML text with left curly brace");

		annotationDiv.annotation.text = {
			html: "Test}"
		};
		annotation = Annotation.createAnnotation(annotationDiv, this.viewport);
		assert.equal(annotation.getText(), "Test}", "annotation text matches set HTML text with right curly brace");

		annotationDiv.annotation.text = {
			html: "{Test}"
		};
		annotation = Annotation.createAnnotation(annotationDiv, this.viewport);
		assert.equal(annotation.getText(), "{Test}", "annotation text matches set HTML text with both curly brace");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
