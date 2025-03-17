/* global QUnit, sinon */

sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/ContentResource",
	"sap/ui/vk/Viewer",
	"sap/ui/vk/measurements/Angle",
	"sap/ui/vk/measurements/Area",
	"sap/ui/vk/measurements/Distance",
	"sap/ui/vk/measurements/Vertex",
	"sap/ui/vk/measurements/Edge",
	"sap/ui/vk/measurements/Face",
	"sap/ui/vk/measurements/Surface",
	"sap/ui/vk/measurements/Utils",
	"sap/ui/vk/measurements/MeshAnalyzer"
], function(
	nextUIUpdate,
	jQuery,
	ContentResource,
	Viewer,
	Angle,
	Area,
	Distance,
	Vertex,
	Edge,
	Face,
	Surface,
	Utils,
	MeshAnalyzer
) {
	"use strict";

	var contentResource = new ContentResource({
		source: "test-resources/sap/ui/vk/qunit/media/Measurement.vds",
		sourceType: "vds4",
		sourceId: "abc"
	});

	var viewer = new Viewer({
		width: "100%",
		height: "400px",
		runtimeSettings: { totalMemory: 16777216 }
	});
	viewer.placeAt("content");
	nextUIUpdate.runSync();

	var compareArrayFirstElements = function(assert, got, expected, msg) {
		var arr = [];
		for (var i = 0; i < expected.length; i++) {
			arr.push(got[i]);
		}

		assert.deepEqual(arr, expected, msg);
	};

	/*
	 *
	 * Unit tests
	 *
	 */

	QUnit.test("VDS Measurements - load from file", function(assertMain) {
		// note: This test does not have anything to do with the dynamic measurements that a user may create on the fly.
		// note: This is purely a .vds legacy measurements loading test.
		var done = assertMain.async();

		viewer.addContentResource(contentResource);

		// VDS file load error handler
		viewer.attachSceneLoadingFailed(function(event) {
			assertMain.ok(false, "The scene has been loaded successfully.");
			done();
		});

		// VDS file load successfully handler
		viewer.attachSceneLoadingSucceeded(function(event) {
			assertMain.ok(true, "The scene has been loaded successfully.");

			var nh = this.getScene().getDefaultNodeHierarchy();
			var nodes = [];
			var rootNodes = nh.getChildren()[0].children;

			assertMain.ok(rootNodes.length === 2, "Loaded 2 top nodes");
			var dimNode = nh.createNodeProxy(rootNodes[1]);
			assertMain.ok(dimNode.getName() === "Dimensions", "Loaded measurement node");

			nh.enumerateChildren(rootNodes[1], function(child) {
				nodes.push(child.getNodeRef());
			});
			assertMain.ok(nodes.length === 3, "Found 3 measurements");

			done();
		});
	});

	QUnit.test("creation", function(assert) {
		var p1 = [10, 20, 2];
		var p2 = [11, 21, 7];
		var p3 = [12, 22, 13];
		var p4 = [13, 23, 55];
		var meshAnalyzer = new MeshAnalyzer(3, 3);

		// add triangles
		meshAnalyzer.addTriangle(p1, p1, p1);
		meshAnalyzer.addTriangle(p1, p1, p2);
		meshAnalyzer.addTriangle(p1, p3, p1);
		meshAnalyzer.addTriangle(p2, p3, p3);
		assert.equal(meshAnalyzer.getTriangleCount(), 0, "we ignore degenerate triangles");

		var t0 = meshAnalyzer.addTriangle(p1, p2, p3);
		assert.equal(meshAnalyzer.getTriangleCount(), 1, "add normal triangle");
		assert.equal(meshAnalyzer.getVertexCount(), 3);
		assert.equal(meshAnalyzer.isTriangleDoubleSided(t0), false);

		var t1 = meshAnalyzer.addTriangle(p1, p2, p3);
		assert.equal(meshAnalyzer.getTriangleCount(), 1, "add same triangle");
		assert.equal(meshAnalyzer.getVertexCount(), 3);
		assert.equal(t0, t1);
		assert.equal(meshAnalyzer.isTriangleDoubleSided(t0), false);

		t1 = meshAnalyzer.addTriangle(p2, p3, p1);
		assert.equal(meshAnalyzer.getTriangleCount(), 1, "add same triangle rotated1");
		assert.equal(meshAnalyzer.getVertexCount(), 3);
		assert.equal(t0, t1);
		assert.equal(meshAnalyzer.isTriangleDoubleSided(t0), false);

		t1 = meshAnalyzer.addTriangle(p3, p1, p2);
		assert.equal(meshAnalyzer.getTriangleCount(), 1, "add same triangle rotated2");
		assert.equal(meshAnalyzer.getVertexCount(), 3);
		assert.equal(t0, t1);
		assert.equal(meshAnalyzer.isTriangleDoubleSided(t0), false);

		t1 = meshAnalyzer.addTriangle(p3, p2, p1);
		assert.equal(meshAnalyzer.getTriangleCount(), 1, "add same triangle swapped");
		assert.equal(meshAnalyzer.getVertexCount(), 3);
		assert.equal(t0, t1);
		assert.equal(meshAnalyzer.isTriangleDoubleSided(t0), true);

		meshAnalyzer.addTriangle(p1, p2, p4);
		assert.equal(meshAnalyzer.getTriangleCount(), 2);
		assert.equal(meshAnalyzer.getVertexCount(), 4);

		meshAnalyzer.addTriangle(p1, p3, p4);
		assert.equal(meshAnalyzer.getTriangleCount(), 3);
		assert.equal(meshAnalyzer.getVertexCount(), 4);

		meshAnalyzer.addTriangle(p2, p3, p4);
		assert.equal(meshAnalyzer.getTriangleCount(), 3, "only 3 triangles are permitted in this instance of MeshAnalyzer");
		assert.equal(meshAnalyzer.getVertexCount(), 4);

		// add lines
		meshAnalyzer.addLine(p1, p1);
		assert.equal(meshAnalyzer.getLineCount(), 0, "we ignore degenerate lines");

		meshAnalyzer.addLine(p1, p2);
		assert.equal(meshAnalyzer.getLineCount(), 1, "add normal line");
		assert.equal(meshAnalyzer.getVertexCount(), 4);

		meshAnalyzer.addLine(p2, p3);
		assert.equal(meshAnalyzer.getLineCount(), 2, "add normal line");
		assert.equal(meshAnalyzer.getVertexCount(), 4);

		meshAnalyzer.addLine(p2, p3);
		assert.equal(meshAnalyzer.getLineCount(), 2, "add same line");
		assert.equal(meshAnalyzer.getVertexCount(), 4);

		meshAnalyzer.addLine(p2, p2);
		assert.equal(meshAnalyzer.getLineCount(), 2, "add inverted line");
		assert.equal(meshAnalyzer.getVertexCount(), 4);

		meshAnalyzer.addLine(p3, p4);
		assert.equal(meshAnalyzer.getLineCount(), 3, "add normal line");
		assert.equal(meshAnalyzer.getVertexCount(), 4);

		meshAnalyzer.addLine(p4, p1);
		assert.equal(meshAnalyzer.getLineCount(), 3, "only 3 lines are permitted in this instance of MeshAnalyzer");
		assert.equal(meshAnalyzer.getVertexCount(), 4);

		meshAnalyzer.finishMeshBuilding();
		assert.ok(!meshAnalyzer._vertexSearchMap, "_vertexSearchMap is released now");
		assert.ok(!meshAnalyzer._vertexNextIndexWithSameHash, "_vertexNextIndexWithSameHash is released now");
		assert.ok(!meshAnalyzer._indexSearchMap, "_indexSearchMap is released now");
	});

	QUnit.test("1 triangle", function(assert) {
		var p0 = [0.0, 0.0, 0.0];
		var p1 = [1.0, 1.0, 1.0];
		var p2 = [2.0, 2.0, -2.0];

		var meshAnalyzer = new MeshAnalyzer(1, 0);
		meshAnalyzer.addTriangle(p0, p1, p2);

		meshAnalyzer.finishMeshBuilding();

		assert.equal(meshAnalyzer.getEdgeId(0, 1), 1);
		assert.equal(meshAnalyzer.getEdgeId(0, 2), 2);
		assert.equal(meshAnalyzer.getEdgeId(1, 2), 3);

		assert.deepEqual(meshAnalyzer.buildEdgePath(1, true), [0, 0, 0, 1, 1, 1]);
		assert.deepEqual(meshAnalyzer.buildEdgePath(2, true), [0, 0, 0, 2, 2, -2]);
		assert.deepEqual(meshAnalyzer.buildEdgePath(3, true), [1, 1, 1, 2, 2, -2]);
		assert.deepEqual(meshAnalyzer.buildEdgePath(1, false), [0, 0, 0, 1, 1, 1]);
		assert.deepEqual(meshAnalyzer.buildEdgePath(2, false), [0, 0, 0, 2, 2, -2]);
		assert.deepEqual(meshAnalyzer.buildEdgePath(3, false), [1, 1, 1, 2, 2, -2]);
	});

	QUnit.test("connectivity", function(assert) {
		var p0 = [0.0, 0.0, 0.0]; // 0-1 0-2
		var p1 = [1.0, 0.0, 0.0]; // 1-0 1-2 1-3
		var p2 = [0.0, 1.0, 0.0]; // 2-0 2-1 2-3
		var p3 = [1.0, 1.0, 0.0]; // 3-1 3-2

		var meshAnalyzer = new MeshAnalyzer(2, 0);
		meshAnalyzer.addTriangle(p0, p1, p2);
		meshAnalyzer.addTriangle(p0, p2, p1); // double-sided
		meshAnalyzer.addTriangle(p1, p2, p3);
		assert.equal(meshAnalyzer.getTriangleCount(), 2, "we ignore degenerate triangles");

		var edgesCount = meshAnalyzer._finishMeshBuildingPart1();
		compareArrayFirstElements(assert, meshAnalyzer._vertexTriangleUsage, [0, 1, 1, 2, 3, 2, 5, 1], "_vertexTriangleUsage");
		compareArrayFirstElements(assert, meshAnalyzer._vertexTriangleIndices, [0, 0, 1, 0, 1, 1], "_vertexTriangleIndices");
		meshAnalyzer._finishMeshBuildingPart2(edgesCount);
		assert.equal(meshAnalyzer._vertexTriangleUsage, undefined);
		assert.equal(meshAnalyzer._vertexTriangleIndices, undefined);

		compareArrayFirstElements(assert, meshAnalyzer._vertexToVertexConnectivity, [0, 2, 2, 2, 4, 2, 6, 2], "_vertexToVertexConnectivity");
		compareArrayFirstElements(assert, meshAnalyzer._vertexToVertexIndices, [1, 2, 0, 3, 0, 3, 1, 2, 0, 0], "_vertexToVertexIndices");

		assert.equal(meshAnalyzer.getEdgeId(0, 1), 1);
		assert.equal(meshAnalyzer.getEdgeId(0, 2), 2);
		assert.equal(meshAnalyzer.getEdgeId(1, 2), null);
		assert.equal(meshAnalyzer.getEdgeId(3, 1), 3);
		assert.equal(meshAnalyzer.getEdgeId(3, 2), 4);

		assert.deepEqual(meshAnalyzer.buildEdgePath(1, false), [0, 0, 0, 1, 0, 0]);
		assert.deepEqual(meshAnalyzer.buildEdgePath(2, false), [0, 0, 0, 0, 1, 0]);
		assert.deepEqual(meshAnalyzer.buildEdgePath(3, false), [1, 0, 0, 1, 1, 0]);
		assert.deepEqual(meshAnalyzer.buildEdgePath(4, false), [0, 1, 0, 1, 1, 0]);
		assert.deepEqual(meshAnalyzer.buildEdgePath(3, true), [1, 0, 0, 1, 1, 0]);
		assert.deepEqual(meshAnalyzer.buildEdgePath(4, true), [0, 1, 0, 1, 1, 0]);
	});

	QUnit.test("triple faces per edge", function(assert) {
		var p0 = [0.0, 0.0, 0.0];
		var p1 = [1.0, 0.0, 0.0];
		var p2 = [0.0, 1.0, 0.0];
		var p3 = [0.0, -1.0, 0.0];
		var p4 = [0.0, 0.0, 1.0];

		var meshAnalyzer = new MeshAnalyzer(3, 0);
		meshAnalyzer.addTriangle(p0, p1, p2);
		meshAnalyzer.addTriangle(p0, p1, p3);
		meshAnalyzer.addTriangle(p1, p4, p0);
		assert.equal(meshAnalyzer.getTriangleCount(), 3);

		// meshAnalyzer.finishMeshBuilding(); -- calling _finishMeshBuildingPart1 / _finishMeshBuildingPart2 directly
		var edgesCount = meshAnalyzer._finishMeshBuildingPart1();
		compareArrayFirstElements(assert, meshAnalyzer._vertexTriangleUsage, [0, 3, 3, 3, 6, 1, 7, 1, 8, 1], "_vertexTriangleUsage");
		compareArrayFirstElements(assert, meshAnalyzer._vertexTriangleIndices, [0, 1, 2, 0, 1, 2, 0, 1, 2], "_vertexTriangleIndices");
		meshAnalyzer._finishMeshBuildingPart2(edgesCount);

		compareArrayFirstElements(assert, meshAnalyzer._vertexToVertexConnectivity, [0, 6, 6, 6, 12, 2, 14, 2, 16, 2], "_vertexToVertexConnectivity");
		// compareArrayFirstElements(assert, meshAnalyzer._vertexToVertexIndices, [1, 1, 1, 2, 3, 4, 0, 0, 0, 2, 3, 4, 0, 1], "_vertexToVertexIndices");
		compareArrayFirstElements(assert, meshAnalyzer._vertexToVertexIndices, [1, 2, 1, 3, 1, 4, 0, 2, 0, 3, 0, 4, 0, 1], "_vertexToVertexIndices");
	});

	QUnit.test("feature detection", function(assert) {
		var meshAnalyzer = new MeshAnalyzer(8, 0);

		// 00 - 01 - 02
		// |  / |  / |
		// 10 - 11 - 12
		// |  / |  / |
		// 20 - 21 - 22
		var p00 = [0.0, 0.0, 1.0];
		var p01 = [1.0, 0.0, 0.0];
		var p02 = [2.0, 0.0, 0.0];
		var p10 = [0.0, 1.0, 0.0];
		var p11 = [1.0, 1.0, 0.0];
		var p12 = [2.0, 1.0, 0.0];
		var p20 = [0.0, 2.0, 0.0];
		var p21 = [1.0, 2.0, 0.0];
		var p22 = [2.0, 2.0, 1.0];
		meshAnalyzer.addTriangle(p00, p01, p10);
		meshAnalyzer.addTriangle(p10, p01, p11);
		meshAnalyzer.addTriangle(p01, p02, p11);
		meshAnalyzer.addTriangle(p11, p12, p02);
		meshAnalyzer.addTriangle(p11, p02, p12);
		meshAnalyzer.addTriangle(p10, p11, p20);

		meshAnalyzer.addTriangle(p20, p11, p21);
		meshAnalyzer.addTriangle(p11, p12, p21);
		meshAnalyzer.addTriangle(p21, p12, p22);
		assert.equal(meshAnalyzer.getVertexCount(), 9);
		assert.equal(meshAnalyzer.getTriangleCount(), 8);

		var i00 = 0;
		var i01 = 1;
		var i10 = 2;
		var i11 = 3;
		var i02 = 4;
		var i12 = 5;
		var i20 = 6;
		var i21 = 7;
		var i22 = 8;
		assert.deepEqual(meshAnalyzer.getVertex(i00), p00);
		assert.deepEqual(meshAnalyzer.getVertex(i01), p01);
		assert.deepEqual(meshAnalyzer.getVertex(i02), p02);
		assert.deepEqual(meshAnalyzer.getVertex(i10), p10);
		assert.deepEqual(meshAnalyzer.getVertex(i11), p11);
		assert.deepEqual(meshAnalyzer.getVertex(i12), p12);
		assert.deepEqual(meshAnalyzer.getVertex(i20), p20);
		assert.deepEqual(meshAnalyzer.getVertex(i21), p21);
		assert.deepEqual(meshAnalyzer.getVertex(i22), p22);

		meshAnalyzer.finishMeshBuilding();
		assert.deepEqual(meshAnalyzer.computeTriangleNormal(0), [0.5773502691896258, 0.5773502691896258, 0.5773502691896258], "tri0");
		assert.equal(Utils.compareNormal(meshAnalyzer.computeTriangleNormal(1), [0, 0, 1]), true);
		assert.deepEqual(meshAnalyzer.computeTriangleNormal(1), [0, 0, 1], "tri1");
		assert.deepEqual(meshAnalyzer.computeTriangleNormal(2), [0, 0, 1], "tri2");
		assert.deepEqual(meshAnalyzer.computeTriangleNormal(3), [0, 0, -1], "tri3");
		assert.equal(Utils.compareNormal(meshAnalyzer.computeTriangleNormal(3), [0, 0, 1]), false);
		assert.equal(Utils.compareNormal(meshAnalyzer.computeTriangleNormal(3), [0, 0, 1], true), true);
		assert.equal(meshAnalyzer.isTriangleDoubleSided(3), true, "tri3 doublesided");
		assert.deepEqual(meshAnalyzer.computeTriangleNormal(4), [0, 0, 1], "tri4");
		assert.deepEqual(meshAnalyzer.computeTriangleNormal(5), [0, 0, 1], "tri5");
		assert.deepEqual(meshAnalyzer.computeTriangleNormal(6), [0, 0, 1], "tri6");
		assert.deepEqual(meshAnalyzer.computeTriangleNormal(7), [-0.5773502691896258, -0.5773502691896258, 0.5773502691896258], "tri7");

		compareArrayFirstElements(assert, meshAnalyzer._triangleFaceId, [0, 1, 1, 1, 1, 1, 1, 2], "face ids");
	});

	QUnit.test("line edges", function(assert) {
		var meshAnalyzer = new MeshAnalyzer(0, 5);

		// 00 - 01 - 02
		//    \      |
		//      \    12
		//        \  |
		//           13
		var p00 = [0.0, 0.0, 0.0];
		var p01 = [1.0, 0.0, 0.0];
		var p02 = [2.0, 0.0, 0.0];
		var p12 = [2.0, 1.0, 0.0];
		var p13 = [2.0, 2.0, 0.0];
		meshAnalyzer.addLine(p00, p01);
		meshAnalyzer.addLine(p01, p02);
		meshAnalyzer.addLine(p02, p12);
		meshAnalyzer.addLine(p12, p13);
		meshAnalyzer.addLine(p13, p00);
		assert.equal(meshAnalyzer.getVertexCount(), 5);
		assert.equal(meshAnalyzer.getLineCount(), 5);
		assert.deepEqual(meshAnalyzer.getVertex(0), p00);
		assert.deepEqual(meshAnalyzer.getVertex(1), p01);
		assert.deepEqual(meshAnalyzer.getVertex(2), p02);
		assert.deepEqual(meshAnalyzer.getVertex(3), p12);
		assert.deepEqual(meshAnalyzer.getVertex(4), p13);

		meshAnalyzer.finishMeshBuilding();
		assert.equal(meshAnalyzer.getEdgeId(0, 0), null);
		assert.equal(meshAnalyzer.getEdgeId(0, 2), null);
		assert.equal(meshAnalyzer.getEdgeId(0, 3), null);
		assert.equal(meshAnalyzer.getEdgeId(0, 555), null);

		assert.equal(meshAnalyzer.getEdgeId(0, 1), 1);
		assert.equal(meshAnalyzer.getEdgeId(1, 0), 1);

		assert.equal(meshAnalyzer.getEdgeId(1, 2), 1);
		assert.equal(meshAnalyzer.getEdgeId(2, 1), 1);

		assert.equal(meshAnalyzer.getEdgeId(2, 3), 3);
		assert.equal(meshAnalyzer.getEdgeId(3, 2), 3);

		assert.equal(meshAnalyzer.getEdgeId(3, 4), 3);
		assert.equal(meshAnalyzer.getEdgeId(4, 3), 3);

		assert.equal(meshAnalyzer.getEdgeId(0, 4), 2);
		assert.equal(meshAnalyzer.getEdgeId(4, 0), 2);
	});

	QUnit.test("edges with opposite directions going from one vertex", function(assert) {
		var meshAnalyzer = new MeshAnalyzer(0, 3);

		var p00 = [1.0, 0.0, 0.0]; // center
		var p01 = [0.0, 0.0, 0.0]; // left
		var p02 = [2.0, 0.0, 0.0]; // right
		meshAnalyzer.addLine(p00, p01); // line to the left
		meshAnalyzer.addLine(p00, p02); // line to the right
		meshAnalyzer.addLine(p02, p01); // connect leftmost and rightmost
		assert.equal(meshAnalyzer.getVertexCount(), 3);
		assert.equal(meshAnalyzer.getLineCount(), 3);
		assert.deepEqual(meshAnalyzer.getVertex(0), p00);
		assert.deepEqual(meshAnalyzer.getVertex(1), p01);
		assert.deepEqual(meshAnalyzer.getVertex(2), p02);
		meshAnalyzer.finishMeshBuilding();

		assert.equal(meshAnalyzer.getEdgeId(0, 1), 1);
		assert.equal(meshAnalyzer.getEdgeId(0, 2), 1);
		assert.equal(meshAnalyzer.getEdgeId(2, 1), 2);

		assert.deepEqual(meshAnalyzer.buildEdgePath(1, false), [2, 0, 0, 1, 0, 0, 0, 0, 0]);
		assert.deepEqual(meshAnalyzer.buildEdgePath(1, true), [2, 0, 0, 0, 0, 0]);
		assert.deepEqual(meshAnalyzer.buildEdgePath(2, false), [0, 0, 0, 2, 0, 0]);
	});

	QUnit.test("intersections", function(assert) {
		var p0 = [0.0, 0.0, 0.0];
		var p1 = [1.0, 0.0, 0.0];
		var p2 = [0.0, 1.0, 0.0];
		var p3 = [1.0, 1.0, 0.0];

		var meshAnalyzer = new MeshAnalyzer(2, 0);
		meshAnalyzer.addTriangle(p0, p1, p2);
		meshAnalyzer.addTriangle(p1, p2, p3);
		meshAnalyzer.finishMeshBuilding();
		var result1 = meshAnalyzer.intersectSphere([0.5, 0.5, 0.5], 0.5, true, true, true);
		assert.deepEqual(result1, {
			edgeDistance: 0.25,
			edgeId: 3,
			faceDistance: 0.25,
			faceId: 0,
			vertexDistance: null,
			vertexId: null
		});

		var result2 = meshAnalyzer.intersectSphere([1.0, 1.0, 0.0], 0.5, true, true, true);
		assert.deepEqual(result2, {
			edgeDistance: 0,
			edgeId: 5,
			faceDistance: 0,
			faceId: 1,
			vertexDistance: 0,
			vertexId: 3
		});
	});

	QUnit.test("hasSelfIntersections", function(assert) {
		var contour1 = [
			-71.42857142857144, 300, 0, // line1
			28.571428571428555, 300, 0, // line1
			28.571428571428555, 299.99999999999994, 0, // circle
			-165.39783350716226, 334.2020143325669, 0, // line2
			-71.42857142857144, 300, 0]; // line2

		var contour2 = [
			-71.42857142857144, 300, 0, // line1
			28.571428571428555, 300, 0, // line1
			28.571428571428555, 299.99999999999994, 0, // circle
			-54.06375366187834, 398.4807753012207, 0, // circle
			-165.39783350716226, 334.2020143325669, 0, // line2
			-71.42857142857144, 300, 0]; // line2

		var contour3 = [
			71.42857142857144, 300, 0, // line1
			171.42857142857144, 300, 0, // line1
			171.42857142857144, 299.99999999999994, 0, // circle
			54.06375366187844, 398.4807753012208, 0, // circle
			-22.5406906500194, 265.7979856674331, 0, // line2
			71.42857142857144, 300, 0]; // line2

		assert.equal(Utils.hasSelfIntersections(contour1), false);
		assert.equal(Utils.hasSelfIntersections(contour2), false);
		assert.equal(Utils.hasSelfIntersections(contour3), false);
	});

	QUnit.test("findClosedContour", function(assert) {
		var originalCoords = [184.4687, 160.3375, 184.4687, 163.5125,
			181.2937, 161.1312, 181.2937, 162.7187,
			181.2937, 161.1312, 184.4687, 160.3375,
			181.2937, 162.7187, 184.4687, 163.5125];

		var originalIds = [1, 1, 2, 2, 3, 3, 4, 4];

		var expected0 = [181.2937, 161.1312,
			184.4687, 160.3375,
			184.4687, 163.5125,
			181.2937, 162.7187,
			181.2937, 161.1312];
		var expected2 = [184.4687, 160.3375,
			181.2937, 161.1312,
			181.2937, 162.7187,
			184.4687, 163.5125,
			184.4687, 160.3375];
		var expected4 = [181.2937, 162.7187,
			181.2937, 161.1312,
			184.4687, 160.3375,
			184.4687, 163.5125,
			181.2937, 162.7187];
		var expected6 = [181.2937, 161.1312,
			181.2937, 162.7187,
			184.4687, 163.5125,
			184.4687, 160.3375,
			181.2937, 161.1312];

		assert.deepEqual(Utils.findClosedContour(originalCoords, originalIds, 0), expected0, "joined contour 1");
		assert.deepEqual(Utils.findClosedContour(originalCoords, originalIds, 2), expected2, "joined contour 2");
		assert.deepEqual(Utils.findClosedContour(originalCoords, originalIds, 4), expected4, "joined contour 4");
		assert.deepEqual(Utils.findClosedContour(originalCoords, originalIds, 6), expected6, "joined contour 6");
	});

	QUnit.test("clampAngle", function(assert) {
		var deg2rad = Math.PI / 180;

		assert.equal((Utils.clampAngle(-30 * deg2rad, -70 * deg2rad, 320 * deg2rad) / deg2rad).toFixed(1), 330.0); // -70..320

		assert.equal((Utils.clampAngle(10 * deg2rad, 20 * deg2rad, 30 * deg2rad) / deg2rad).toFixed(1), 20.0); // 20..50
		assert.equal((Utils.clampAngle((25 - 360) * deg2rad, 20 * deg2rad, 30 * deg2rad) / deg2rad).toFixed(1), 25.0); // 20..50
		assert.equal((Utils.clampAngle((60 + 720) * deg2rad, 20 * deg2rad, 30 * deg2rad) / deg2rad).toFixed(1), 50.0); // 20..50
		assert.equal((Utils.clampAngle(300 * deg2rad, 20 * deg2rad, (30 - 360) * deg2rad) / deg2rad).toFixed(1), 20.0); // -10..20
		assert.equal((Utils.clampAngle(10 * deg2rad, 20 * deg2rad, (30 - 360) * deg2rad) / deg2rad).toFixed(1), 10.0); // -10..20
		assert.equal((Utils.clampAngle(45 * deg2rad, 20 * deg2rad, (30 - 360) * deg2rad) / deg2rad).toFixed(1), 20.0); // -10..20
	});

	QUnit.test("feature cloning", function(assert) {
		var jsonVertex = {
			type: "Vertex",
			vertex: [-35000, -1000, 13000]
		};
		var jsonEdge = {
			type: "Edge",
			edge: [-25000, -1000, 13000, -25000, -1000, -3000]
		};
		var jsonFace = {
			type: "Face",
			face: {
				vertices: [-15000, 0, 13000, -15000, 0, -3000, -15000, -1000, -3000, -15000, -1000, 13000],
				triangles: [0, 1, 2, 0, 2, 3],
				boundingSpheres: [-15000, -500, 5000, 8015.609770940699, -15000, -500, 5000, 8015.609770940699],
				edges: [0, 1, 1, 2, 2, 3, 0, 3],
				planeEquation: [-1, 0, 0, -15000]
			}
		};

		var vertex = new Vertex(jsonVertex);
		assert.deepEqual(Array.from(vertex._vertex), jsonVertex.vertex, "vertex data");

		var vertex2 = vertex.clone();
		assert.ok(vertex2 !== vertex && vertex2 instanceof Vertex, "vertex2 created");
		assert.deepEqual(Array.from(vertex2._vertex), jsonVertex.vertex, "vertex2 data");

		var edge = new Edge(jsonEdge);
		assert.deepEqual(Array.from(edge._edge), jsonEdge.edge, "edge data");

		var edge2 = edge.clone();
		assert.ok(edge2 !== edge && edge2 instanceof Edge, "edge2 created");
		assert.deepEqual(Array.from(edge2._edge), jsonEdge.edge, "edge2 data");

		var face = new Face(jsonFace);
		assert.deepEqual(Array.from(face._face.vertices), jsonFace.face.vertices, "face.vertices data");
		assert.deepEqual(Array.from(face._face.triangles), jsonFace.face.triangles, "face.triangles data");
		assert.deepEqual(Array.from(face._face.boundingSpheres), jsonFace.face.boundingSpheres, "face.boundingSpheres data");
		assert.deepEqual(Array.from(face._face.edges), jsonFace.face.edges, "face.edges data");
		assert.deepEqual(Array.from(face._face.planeEquation), jsonFace.face.planeEquation, "face.planeEquation data");

		var face2 = face.clone();
		assert.ok(face2 !== face && face2 instanceof Face, "face2 created");
		assert.deepEqual(Array.from(face2._face.vertices), jsonFace.face.vertices, "face2.vertices data");
		assert.deepEqual(Array.from(face2._face.triangles), jsonFace.face.triangles, "face2.triangles data");
		assert.deepEqual(Array.from(face2._face.boundingSpheres), jsonFace.face.boundingSpheres, "face2.boundingSpheres data");
		assert.deepEqual(Array.from(face2._face.edges), jsonFace.face.edges, "face2.edges data");
		assert.deepEqual(Array.from(face2._face.planeEquation), jsonFace.face.planeEquation, "face2.planeEquation data");
	});

	QUnit.test("face reconstruction", function(assert) {
		var jsonFaceFull = {
			type: "Face",
			face: {
				vertices: [-15000, 0, 13000, -15000, 0, -3000, -15000, -1000, -3000, -15000, -1000, 13000],
				triangles: [0, 1, 2, 0, 2, 3],
				boundingSpheres: [-15000, -500, 5000, 8015.609770940699, -15000, -500, 5000, 8015.609770940699],
				edges: [0, 1, 1, 2, 2, 3, 0, 3],
				planeEquation: [-1, 0, 0, -15000]
			}
		};
		var jsonFaceIncomplete = {
			type: "Face",
			face: {
				vertices: [-15000, 0, 13000, -15000, 0, -3000, -15000, -1000, -3000, -15000, -1000, 13000],
				triangles: [0, 1, 2, 0, 2, 3]
			}
		};

		var face1 = new Face(jsonFaceFull);
		var face2 = new Face(jsonFaceIncomplete);
		assert.deepEqual(Array.from(face1._face.vertices), Array.from(face2._face.vertices), "face.vertices data");
		assert.deepEqual(Array.from(face1._face.triangles), Array.from(face2._face.triangles), "face.triangles data");
		assert.deepEqual(Array.from(face1._face.boundingSpheres), Array.from(face2._face.boundingSpheres), "face.boundingSpheres data");
		assert.deepEqual(Array.from(face1._face.edges), Array.from(face2._face.edges), "face.edges data");
		assert.deepEqual(Array.from(face1._face.planeEquation), Array.from(face2._face.planeEquation), "face.planeEquation data");
	});

	var json = {
		scale: 1,
		measurements: [
			{
				type: "Angle",
				id: "a",
				visible: true,
				angle: 1.23,
				state: 2,
				scale: 1.158439228975854,
				point1: [-4658.71074437959, 3836.0681346249476, 9298.226182484841],
				point2: [-4658.71074437959, 6202.22143866799, 5199.999853559327],
				point3: [-12400.522491936908, 6202.22143866799, 5199.999853559327],
				point4: [-12400.522491936907, 4966.70010362376, 3060.057641460344],
				features: [
					{
						type: "Face",
						face: {
							vertices: [
								500, 6317.69140625, 5000,
								-12500, 3142.2649726867676, 10500,
								500, 3142.2649726867676, 10500,
								-12500, 6317.69140625, 5000
							],
							triangles: [0, 1, 2, 3, 1, 0]
						}
					},
					{
						type: "Face",
						face: {
							vertices: [
								-12500, 6086.75146484375, 5000,
								-12500, 2911.3248596191406, -500,
								500, 2911.3248596191406, -500,
								500, 6086.75146484375, 5000
							],
							triangles: [0, 1, 2, 0, 2, 3]
						}
					}
				]
			},
			{
				type: "Distance",
				id: "b",
				visible: true,
				showArrows: true,
				point1: [-15000, 0, 0],
				point2: [-12000, 0, 0],
				features: [
					{
						type: "Face",
						face: {
							vertices: [
								-15000, 0, 13000,
								-15000, 0, -3000,
								-15000, -1000, -3000,
								-15000, -1000, 13000
							],
							triangles: [0, 1, 2, 0, 2, 3]
						}
					},
					{
						type: "Edge",
						edge: [-12000, 0, 10000, -12000, 0, 0]
					}
				]
			},
			{
				type: "Distance",
				id: "c",
				visible: true,
				showArrows: true,
				point1: [-12000, 0, 10000],
				point2: [-15000, 0, 13000],
				features: [
					{
						type: "Vertex",
						vertex: [-12000, 0, 10000]
					},
					{
						type: "Vertex",
						vertex: [-15000, 0, 13000]
					}
				]
			},
			{
				type: "Area",
				id: "d",
				visible: true,
				area: 100,
				position: [1, 2, 3],
				points: [],
				features: [
					{
						type: "Face",
						face: {
							vertices: [
								1, 2, 3,
								4, 5, 6,
								7, 8, 9
							],
							triangles: [0, 1, 2]
						}
					}]
			},
			{
				type: "Area",
				id: "e",
				visible: false,
				area: 100,
				position: [1, 2, 3],
				points: [1, 2, 0, 3, 4, 0, 5, 6, 0, 7, 8, 0],
				features: [
					{
						type: "Vertex",
						vertex: [1, 2, 0]
					},
					{
						type: "Vertex",
						vertex: [3, 4, 0]
					},
					{
						type: "Vertex",
						vertex: [5, 6, 0]
					},
					{
						type: "Vertex",
						vertex: [7, 8, 0]
					}
				]
			}
		]
	};

	var json2 = {
		scale: 1.5,
		measurements: [
			{
				// This is duplicate of a measurement from `json`.
				type: "Distance",
				id: "c",
				visible: true,
				showArrows: true,
				point1: [-12000, 0, 10000],
				point2: [-15000, 0, 13000],
				features: [
					{
						type: "Vertex",
						vertex: [-12000, 0, 10000]
					},
					{
						type: "Vertex",
						vertex: [-15000, 0, 13000]
					}
				]
			},
			{
				// This is a new measurement not found in `json`.
				type: "Distance",
				id: "z",
				visible: true,
				showArrows: true,
				point1: [-12000, 0, 10000],
				point2: [-15000, 0, 13000],
				features: [
					{
						type: "Vertex",
						vertex: [-12000, 0, 10000]
					},
					{
						type: "Vertex",
						vertex: [-15000, 0, 13000]
					}
				]
			}
		]
	};

	QUnit.test("serialization/deserialization", function(assert) {
		var surface = new Surface();

		assert.equal(surface._measurements.length, 0, "no measurements");

		surface.fromJSON(json);

		assert.equal(surface._measurements.length, 5, "5 measurements");
		assert.ok(surface._measurements[0] instanceof Angle, "Angle measurement");
		assert.equal(surface._measurements[0].getFeatures().length, 2, "2 features");
		assert.ok(surface._measurements[0].getFeatures()[0] instanceof Face, "feature1");
		assert.ok(surface._measurements[0].getFeatures()[1] instanceof Face, "feature2");
		assert.ok(surface._measurements[1] instanceof Distance, "Distance measurement");
		assert.equal(surface._measurements[1].getFeatures().length, 2, "2 features");
		assert.ok(surface._measurements[1].getFeatures()[0] instanceof Face, "feature1");
		assert.ok(surface._measurements[1].getFeatures()[1] instanceof Edge, "feature2");
		assert.ok(surface._measurements[2] instanceof Distance, "Distance measurement");
		assert.equal(surface._measurements[2].getFeatures().length, 2, "2 features");
		assert.ok(surface._measurements[2].getFeatures()[0] instanceof Vertex, "feature1");
		assert.ok(surface._measurements[2].getFeatures()[1] instanceof Vertex, "feature2");
		assert.ok(surface._measurements[3] instanceof Area, "Area measurement");
		assert.equal(surface._measurements[3].getFeatures().length, 1, "1 face feature");
		assert.ok(surface._measurements[3].getFeatures()[0] instanceof Face, "feature1");
		assert.ok(surface._measurements[4] instanceof Area, "Area measurement");
		assert.equal(surface._measurements[4].getFeatures().length, 4, "4 vertex features");
		assert.ok(surface._measurements[4].getFeatures()[0] instanceof Vertex, "feature1");
		assert.ok(surface._measurements[4].getFeatures()[1] instanceof Vertex, "feature2");
		assert.ok(surface._measurements[4].getFeatures()[2] instanceof Vertex, "feature3");
		assert.ok(surface._measurements[4].getFeatures()[3] instanceof Vertex, "feature4");

		assert.deepEqual(surface.toJSON(), json, "json after deserialization/serialization");

		surface.destroy();
		surface = null;
	});

	QUnit.test("deserialization with events 1", function(assert) {
		var surface = new Surface();

		surface.fromJSON(json);

		var onMeasurementsAdded = sinon.spy(function(event) {
			var measurements = event.getParameter("measurements");
			assert.strictEqual(measurements.length, 2, "Event 'measurementsAdded' called with 2 measurements");
		});

		var onMeasurementsRemoving = sinon.spy(function(event) {
			var measurements = event.getParameter("measurements");
			assert.strictEqual(measurements.length, 1, "Event 'measurementsRemoving' called with 1 measurement");
		});

		surface.attachMeasurementsAdded(onMeasurementsAdded);
		surface.attachMeasurementsRemoving(onMeasurementsRemoving);


		surface.fromJSON(json2, false);

		assert.ok(onMeasurementsAdded.calledOnce, "Event 'onMeasurementsAdded' is called once");
		assert.ok(onMeasurementsRemoving.calledOnce, "Event 'onMeasurementsRemoving' is called once");

		surface.destroy();
		surface = null;
	});

	QUnit.test("deserialization with events 2", function(assert) {
		var surface = new Surface();

		surface.fromJSON(json);

		var onMeasurementsAdded = sinon.spy(function(event) {
			var measurements = event.getParameter("measurements");
			assert.strictEqual(measurements.length, 2, "Event 'measurementsAdded' called with 2 measurements");
		});

		var onMeasurementsRemoving = sinon.spy(function(event) {
			var measurements = event.getParameter("measurements");
			assert.strictEqual(measurements.length, 5, "Event 'measurementsRemoving' called with 5 measurement");
		});

		surface.attachMeasurementsAdded(onMeasurementsAdded);
		surface.attachMeasurementsRemoving(onMeasurementsRemoving);

		surface.fromJSON(json2, true);

		assert.ok(onMeasurementsAdded.calledOnce, "Event 'onMeasurementsAdded' is called once");
		assert.ok(onMeasurementsRemoving.calledOnce, "Event 'onMeasurementsRemoving' is called once");

		surface.destroy();
		surface = null;
	});

	QUnit.test("setScale with event", function(assert) {
		var surface = new Surface();

		assert.strictEqual(surface.getScale(), 1, "Default scale is 1");

		var onScaleChanged = sinon.spy(function(event) {
			var oldScale = event.getParameter("oldScale");
			var newScale = event.getParameter("newScale");
			assert.strictEqual(oldScale, 1, "Old scale equals 1");
			assert.strictEqual(newScale, 2.5, "New scale equals 2.5");
		});

		surface.attachScaleChanged(onScaleChanged);

		surface.setScale(2.5);

		assert.ok(onScaleChanged.calledOnce, "Event 'onScaleChanged' is called once");

		surface.destroy();
		surface = null;
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
