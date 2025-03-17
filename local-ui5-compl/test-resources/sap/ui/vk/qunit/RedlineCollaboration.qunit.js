/* global QUnit*/

sap.ui.define([
	"sap/ui/core/Element",
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/vk/threejs/Viewport",
	"sap/ui/vk/RedlineElementRectangle",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector",
	"sap/ui/vk/RedlineCollaboration",
	"sap/ui/vk/RedlineElementComment",
	"sap/ui/vk/ViewStateManager",
	"sap/ui/vk/ViewManager",
	"sap/ui/vk/AnimationPlayer",
	"sap/ui/vk/measurements/Measurement",
	"sap/ui/vk/measurements/Area",
	"sap/ui/vk/measurements/Distance",
	"sap/ui/vk/measurements/Face",
	"sap/ui/vk/measurements/Vertex"
], function(
	Element,
	nextUIUpdate,
	Viewport,
	RedlineElementRectangle,
	loader,
	RedlineCollaboration,
	RedlineElementComment,
	ViewStateManager,
	ViewManager,
	AnimationPlayer,
	Measurement,
	Area,
	Distance,
	Face,
	Vertex
) {
	"use strict";

	var viewport = new Viewport();
	var viewStateManager, viewManager, animationPlayer;

	viewport.placeAt("content");
	nextUIUpdate.runSync();

	QUnit.moduleWithContentConnector("RedlineCollaboration", "test-resources/sap/ui/vk/qunit/media/cooper.vds", "vds4", function(assert) {
		viewStateManager = new ViewStateManager({ contentConnector: this.contentConnector });
		animationPlayer = new AnimationPlayer({ viewStateManager: viewStateManager });
		viewManager = new ViewManager({
			contentConnector: this.contentConnector,
			animationPlayer: animationPlayer
		});
		viewStateManager.setViewManager(viewManager);
		viewport.setViewStateManager(viewStateManager);
		viewport.setContentConnector(this.contentConnector);
	});

	QUnit.test("Test setting viewport and tool creation", function(assert) {
		var collaboration = new RedlineCollaboration();
		collaboration.setViewport(viewport);
		assert.strictEqual(collaboration.getViewport(), viewport.getId(), "correct viewport is set");
		assert.ok(collaboration._tool, "tool created");
	});

	QUnit.test("Test set and get header property", function(assert) {
		var collaboration = new RedlineCollaboration();
		collaboration.setHeaderProperty("testproperty", "testvalue");
		assert.strictEqual(collaboration.getHeaderProperty("testproperty"), "testvalue", "set property and get property are equivalent");
	});

	QUnit.test("Test conversation creation and content functions", function(assert) {
		var collaboration = new RedlineCollaboration();
		collaboration.setViewport(viewport);
		var conversation = collaboration.createConversation("test conversation");
		assert.strictEqual(collaboration.getConversations()[0], conversation, "conversation added to aggregation");
		assert.strictEqual(collaboration.getActiveConversation(), conversation.getId(), "conversation set as active");

		var element = {
			originX: -0.11717612809315867,
			originY: 0.2081513828238719,
			opacity: 1,
			strokeColor: "rgba(230,96,13, 1)",
			strokeWidth: 1,
			elementId: "e0754ce5-8497-4658-8280-5499bdb5ea93",
			halo: false,
			type: "line",
			version: 1,
			deltaX: 0.5502183406113537,
			deltaY: 0.2285298398835517
		};

		var rect = new RedlineElementRectangle();
		conversation.addContent(rect).addContent(element);
		var content = conversation.getContent();
		assert.ok(content, "content added");
		assert.deepEqual(content[0], rect.exportJSON(), "Rectangle equivalent");
		assert.deepEqual(content[1], element, "Element equivalent");

		conversation.removeContent(rect);
		assert.equal(conversation.getContent().length, 1, "Rect removed by element");

		conversation.removeContent(element);
		assert.equal(conversation.getContent().length, 0, "Content removed by JSON");

		conversation.addContent(rect);
		assert.deepEqual(conversation.getContent()[0], rect.exportJSON(), "Rect added to content");

		conversation.removeContent(rect.getElementId());
		assert.equal(conversation.getContent().length, 0, "Rect removed by elementId");

		conversation.addContent(rect);
		assert.deepEqual(conversation.getContent()[0], rect.exportJSON(), "Rect added to content");

		collaboration.removeElement(rect);
		assert.equal(conversation.getContent().length, 0, "Rect removed by collaboration");
	});

	QUnit.test("Test comment creation and content functions", function(assert) {
		var collaboration = new RedlineCollaboration();
		var comment = new RedlineElementComment();
		collaboration.setActiveComment(comment);
		assert.strictEqual(collaboration.getActiveComment(), comment.getId(), "Comment set as active");
		var rect = new RedlineElementRectangle();

		var element = {
			elementId: "e0754ce5-8497-4658-8280-5499bdb5ea93"
		};

		comment.addContent(rect).addContent(element.elementId);
		assert.equal(comment.getContent().length, 2, "Content added");
		assert.ok(comment.getContent().includes(rect.getElementId()), "Rect id equivalent");
		assert.ok(comment.getContent().includes(element.elementId), "Element id equivalent");

		comment.removeContent(rect);
		assert.equal(comment.getContent().length, 1, "Content removed by element");

		comment.removeContent(element.elementId);
		assert.equal(comment.getContent().length, 0, "Content removed by id");

		comment.addContent(rect).addContent(element.elementId);
		assert.equal(comment.getContent().length, 2, "Content added");

		comment.clearContent();
		assert.equal(comment.getContent().length, 0, "Content cleared");
	});

	QUnit.test("Test create element and viewInfo", function(assert) {
		var collaboration = new RedlineCollaboration();
		collaboration.setViewport(viewport);
		var contentConnector = Element.getElementById(viewport.getContentConnector());
		var scene = contentConnector.getContent();
		var view = scene.getViews()[2];
		viewport.activateView(view);
		var rect = new RedlineElementRectangle();
		var conversation = collaboration.createConversation("test conversation");

		collaboration.createElement(rect);
		assert.ok(collaboration._tool.getActive(), "Tool activated");

		collaboration._tool.setActive(false);
		assert.strictEqual(conversation.getViewId(), view.getViewId(), "View id equivalent");

		var query = {
			camera: {
				matrices: true
			},
			visibility: true,
			selection: true
		};
		assert.deepEqual(conversation.getViewInfo(), viewport.getViewInfo(query), "ViewInfo equivalent");
	});

	QUnit.test("Test set active conversation and get active elements", function(assert) {
		var collaboration = new RedlineCollaboration();
		collaboration.setViewport(viewport);

		var conversation = collaboration.createConversation("test conversation");
		assert.strictEqual(collaboration.getActiveConversation(), conversation.getId(), "Conversation activated");

		collaboration.setActiveConversation(null);
		assert.strictEqual(collaboration.getActiveConversation(), null, "Conversation set to null");

		var element = {
			originX: -0.11717612809315867,
			originY: 0.2081513828238719,
			opacity: 1,
			strokeColor: "rgba(230,96,13, 1)",
			strokeWidth: 1,
			elementId: "e0754ce5-8497-4658-8280-5499bdb5ea93",
			halo: false,
			type: "line",
			version: 1,
			deltaX: 0.5502183406113537,
			deltaY: 0.2285298398835517
		};
		conversation.addContent(element);
		collaboration.setActiveConversation(conversation);

		assert.strictEqual(collaboration._tool.getRedlineElements().length, 1, "element imported to tool");
		assert.strictEqual(collaboration.getActiveRedlineElements().length, 1, "Element retrieved by collaboration");
	});

	QUnit.test("Test export and import json", function(assert) {
		var collaboration = new RedlineCollaboration();
		collaboration.setViewport(viewport);
		var conversation = collaboration.createConversation("test conversation");
		var conversation2 = collaboration.createConversation("test conversation2");
		var comment = new RedlineElementComment();
		conversation.addComment(comment);
		var element = {
			originX: -0.11717612809315867,
			originY: 0.2081513828238719,
			opacity: 1,
			strokeColor: "rgba(230,96,13, 1)",
			strokeWidth: 1,
			elementId: "e0754ce5-8497-4658-8280-5499bdb5ea93",
			halo: false,
			type: "line",
			version: 1,
			deltaX: 0.5502183406113537,
			deltaY: 0.2285298398835517
		};
		var measurementJSON = {
			features: [
				{ type: "Vertex", vertex: [1, 2, 3] },
				{ type: "Vertex", vertex: [4, 5, 6] }
			],
			id: "distanceId",
			point1: [1, 2, 3],
			point2: [4, 5, 6],
			showArrows: true,
			type: "Distance",
			visible: true
		};
		conversation.addContent(element);
		conversation.addMeasurement(measurementJSON);
		comment.addContent(element.elementId);
		var contentConnector = Element.getElementById(viewport.getContentConnector());
		var scene = contentConnector.getContent();
		var view = scene.getViews()[2];
		viewport.activateView(view);
		collaboration.freezeView();
		var query = {
			camera: {
				matrices: true
			},
			visibility: true,
			selection: true
		};

		assert.deepEqual(conversation2.getViewInfo(), viewport.getViewInfo(query), "Viewinfo Equivalent");
		collaboration._tool.setActive(false);

		var json = collaboration.exportJSON();
		var collaboration2 = new RedlineCollaboration();
		collaboration2.setViewport(viewport);
		collaboration2.importJSON(json);
		assert.strictEqual(collaboration2.getConversations().length, 2, "2 conversations imported");

		var importedConversation1 = collaboration2.getConversations()[0];
		assert.strictEqual(importedConversation1.getElementId(), conversation.getElementId(), "Element id match");
		assert.deepEqual(importedConversation1.getContent(), conversation.getContent(), "conversation content match");
		assert.strictEqual(importedConversation1.getComments()[0].getElementId(), conversation.getComments()[0].getElementId(), "Comments match");
		assert.deepEqual(importedConversation1.getMeasurements(), conversation.getMeasurements(), "Measurements match");

		var importedConversation2 = collaboration2.getConversations()[1];
		assert.strictEqual(importedConversation2.getElementId(), conversation2.getElementId(), "Element id match");
		assert.deepEqual(importedConversation2.getViewInfo(), conversation2.getViewInfo(), "Viewinfo match");
	});

	QUnit.test("Test conversation measurement functions", function(assert) {
		var collaboration = new RedlineCollaboration();
		collaboration.setViewport(viewport);
		var conversation = collaboration.createConversation("test conversation");

		var measurementJSON = {
			features: [
				{ type: "Vertex", vertex: [1, 2, 3] },
				{ type: "Vertex", vertex: [4, 5, 6] }
			],
			id: "distanceId",
			point1: [1, 2, 3],
			point2: [4, 5, 6],
			showArrows: true,
			type: "Distance",
			visible: true
		};

		var measurementJSON2 = {
			area: 1000,
			features: [
				{ type: "Face", face: { triangles: [1, 2, 3], vertices: [4, 5, 6] } }
			],
			id: "areaId",
			points: [],
			position: [7, 8, 9],
			type: "Area",
			visible: true
		};

		var measurement = Measurement.createFromJSON(measurementJSON);
		var measurement2 = Measurement.createFromJSON(measurementJSON2);
		conversation.addMeasurement(measurementJSON).addMeasurement(measurementJSON2);
		var measurements = conversation.getMeasurements();
		assert.ok(measurements, "measurements added");
		assert.deepEqual(measurements[0], measurement.toJSON(), "Distance measurement equivalent");
		assert.deepEqual(measurements[1], measurement2.toJSON(), "Area measurement equivalent");

		conversation.removeMeasurement(measurementJSON);
		assert.equal(conversation.getMeasurements().length, 1, "Measurement removed by JSON");

		conversation.removeMeasurement("areaId");
		assert.equal(conversation.getMeasurements().length, 0, "Measurement removed by id");
	});

	QUnit.test("Test comment measurement functions", function(assert) {
		var collaboration = new RedlineCollaboration();
		var comment = new RedlineElementComment();
		collaboration.setActiveComment(comment);

		var measurement = {
			id: "123"
		};

		var measurement2 = {
			id: "456"
		};

		comment.addMeasurement(measurement.id).addMeasurement(measurement2.id);
		assert.equal(comment.getMeasurements().length, 2, "Content added");

		comment.removeMeasurement(measurement.id);
		assert.equal(comment.getMeasurements().length, 1, "Measurement removed by id");
		assert.equal(comment.getMeasurements()[0], measurement2.id, "Correct measurement remaining");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
