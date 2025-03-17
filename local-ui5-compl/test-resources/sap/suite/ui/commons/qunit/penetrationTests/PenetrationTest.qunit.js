sap.ui.define([
	"./PenetrationTester",
	"sap/suite/ui/commons/statusindicator/StatusIndicator",
	"sap/suite/ui/commons/statusindicator/Circle",
	"sap/suite/ui/commons/statusindicator/Path",
	"sap/suite/ui/commons/statusindicator/PropertyThreshold",
	"sap/suite/ui/commons/statusindicator/DiscreteThreshold",
	"sap/suite/ui/commons/statusindicator/ShapeGroup",
	"sap/suite/ui/commons/statusindicator/CustomShape",
	"sap/suite/ui/commons/statusindicator/FillingOption",
	"sap/suite/ui/commons/networkgraph/Graph",
	"sap/suite/ui/commons/networkgraph/Node",
	"sap/suite/ui/commons/networkgraph/Line",
	"sap/suite/ui/commons/networkgraph/NodeImage",
	"sap/suite/ui/commons/Timeline",
	"sap/suite/ui/commons/TimelineItem",
	"sap/suite/ui/commons/networkgraph/layout/NoopLayout",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/qunit/utils/nextUIUpdate"
], function (PenetrationTester, StatusIndicator, Circle, Path, PropertyThreshold, DiscreteThreshold, ShapeGroup, CustomShape,
			 FillingOption, NetworkGraph, Node, Line, NodeImage, Timeline, TimelineItem, NoopLayout, createAndAppendDiv, nextUIUpdate) {

	var styleElement = document.createElement("style");
	styleElement.textContent =
		"html, body" +
		"		height: 100%;" +
		"}" +
		".NetworkGraphQunitContentHeight {" +
		"		height : 100%;" +
		"}" +
		".NetworkGraphQunitResultHeight {" +
		"		height: 100%;" +
		"		overflow-y: hidden;" +
		"}";
	document.head.appendChild(styleElement);

	createAndAppendDiv("content").className = "NetworkGraphQunitContentHeight";
	createAndAppendDiv("qunit_results").className = "NetworkGraphQunitResultHeight";

	var aPromises = [];
	var tester = new PenetrationTester();
	aPromises.push(tester.testComponent(StatusIndicator));
	aPromises.push(tester.testComponent(Circle, function (oComponentClass, oElement, oString) {
		var oMetadata = {};
		oMetadata[oElement.name] = oString;
		var oCircle = new Circle(oMetadata);
		return new StatusIndicator({
			groups: new ShapeGroup({
				shapes: oCircle
			})
		});
	}));
	aPromises.push(tester.testComponent(Path, function (oComponentClass, oElement, oString) {
		var oMetadata = {};
		oMetadata[oElement.name] = oString;
		var oPath = new Path(oMetadata);
		return new StatusIndicator({
			groups: new ShapeGroup({
				shapes: oPath
			})
		});
	}));
	aPromises.push(tester.testComponent(PropertyThreshold, function (oComponentClass, oElement, oString) {
		var oMetadata = {};
		oMetadata[oElement.name] = oString;
		oMetadata.toValue = 20;
		var oThreshold = new PropertyThreshold(oMetadata);
		return new StatusIndicator({
			propertyThresholds: oThreshold
		});
	}));
	aPromises.push(tester.testComponent(DiscreteThreshold, function (oComponentClass, oElement, oString) {
		var oMetadata = {};
		oMetadata[oElement.name] = oString;
		oMetadata.value = 20;
		var oThreshold = new DiscreteThreshold(oMetadata);
		return new StatusIndicator({
			discreteThresholds: oThreshold,
			value: 30
		});
	}));
	aPromises.push(tester.testComponent(CustomShape, function (oComponentClass, oElement, oString) {
		var oMetadata = {};
		if (oElement.name === "definition") {
			oMetadata[oElement.name] = "<svg><path d =\"" + oString + "\" /></svg>";
		} else {
			oMetadata[oElement.name] = oString;
		}
		var oShape = new CustomShape(oMetadata);
		return new StatusIndicator({
			groups: new ShapeGroup({
				shapes: oShape
			})
		});
	}));
	aPromises.push(tester.testComponent(FillingOption, function (oComponentClass, oElement, oString) {
		var oMetadata = {};
		oMetadata[oElement.name] = oString;
		var oFillingOption = new FillingOption(oMetadata);
		return new StatusIndicator({
			groups: new ShapeGroup({
				shapes: new CustomShape({
					fillingOptions: oFillingOption,
					definition: "<svg><circle cx = '10' cy = '10' r = '5' /></svg>"
				})
			})
		});
	}));
	aPromises.push(tester.testComponent(Timeline));
	aPromises.push(tester.testComponent(TimelineItem, function (oComponentClass, oElement, oString) {
		var oMetadata = {};
		oMetadata[oElement.name] = oString;
		var oItem = new TimelineItem(oMetadata);
		return new Timeline({
			content: oItem
		});
	}));
	tester = new PenetrationTester();
	tester.buildTest = function (oComponentClass, oTestObject, sValue, fnConstructor) {
		QUnit.test("Test " + oTestObject.name + " = " + sValue, async function (assert) {
			var oGraph,
				fnDone = assert.async();
			try {
				oGraph = fnConstructor(oComponentClass, oTestObject, sValue);
			} catch (ex) {
				assert.ok("Penetration caught in setter.");
				return;
			}
			oGraph.attachGraphReady(function () {
				assert.notOk(window.penetrationError, "Injection test for property: " + oTestObject.name);
				fnDone();
				oGraph.destroy();
			});
			oGraph.placeAt("content");
			await nextUIUpdate();
		});
	};
	aPromises.push(tester.testComponent(NetworkGraph));
	aPromises.push(tester.testComponent(Node, function (oComponentClass, oElement, oString) {
		var oMetadata = {};
		oMetadata[oElement.name] = oString;
		if (oElement.name !== "key") {
			oMetadata.key = "0";
		}
		var oNode = new Node(oMetadata);
		return new NetworkGraph({
			nodes: oNode
		});
	}));
	aPromises.push(tester.testComponent(Line, function (oComponentClass, oElement, oString) {
		var oMetadata = {};
		oMetadata[oElement.name] = oString;
		var oNode1 = new Node({key: "0"}),
			oNode2 = new Node({key: "1"});
		oMetadata.from = "0";
		oMetadata.to = "0";
		var oLine = new Line(oMetadata);
		return new NetworkGraph({
			nodes: [oNode1, oNode2],
			lines: oLine
		});
	}));
	aPromises.push(tester.testComponent(NodeImage, function (oComponentClass, oElement, oString) {
		var oMetadata = {};
		oMetadata[oElement.name] = oString;

		var oNodeImage = new NodeImage(oMetadata);

		var oNode = new Node({
			image: [oNodeImage],
			key: "0"
		});
		return new NetworkGraph({
			nodes: oNode
		});
	}));


	tester = new PenetrationTester();
	tester.buildTestForObject = function (oTestObject) {
		QUnit.test(oTestObject.key, async function (assert) {
			var oGraph = oTestObject.object;
			var fnDone = assert.async();

			oGraph.attachGraphReady(function () {
				assert.notOk(window.penetrationError, "Injection test for property: " + oTestObject.name);
				fnDone();
				oGraph.destroy();
			});
			oGraph.placeAt("content");
			await nextUIUpdate();
		});
	};
	aPromises.push(tester.testComponentRecursive(NetworkGraph, {
		"sap.suite.ui.commons.networkgraph.Node": function (oComponentClass, oElement, vValue) {
			var oMetadata = {};
			oMetadata[oElement.name] = vValue;
			oMetadata.key = "0";
			return new oComponentClass(oMetadata);
		},
		"sap.suite.ui.commons.networkgraph.layout.LayoutAlgorithm": function (oComponentClass, oElement, vValue) {
			var oMetadata = {};
			oMetadata[oElement.name] = vValue;
			oMetadata.key = "0";
			// LayoutAlgorithm is abstract class, so some child of it has to be used instead
			return new NoopLayout(oMetadata);
		}
	}));

	return Promise.all([aPromises]);
});