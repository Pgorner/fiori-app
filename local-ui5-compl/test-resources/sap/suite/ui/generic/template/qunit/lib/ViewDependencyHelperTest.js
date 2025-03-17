/**
 * tests for the sap.suite.ui.generic.template.lib.ViewDependencyController
 */

sap.ui.define([ "testUtils/sinonEnhanced", "sap/suite/ui/generic/template/lib/ViewDependencyHelper", "sap/suite/ui/generic/template/js/AnnotationHelper", "sap/suite/ui/generic/template/genericUtilities/testableHelper"],
		function(sinon, ViewDependencyHelper, AnnotationHelper, testableHelper) {
	"use strict";

	var oViewDependencyHelper;

	var mComponentRegistry = Object.create(null);
	
	var mRoutingTree = Object.create(null);
	
	var mEntityTree = Object.create(null);

	var oTemplateContract = {
		componentRegistry : mComponentRegistry,
		mRoutingTree: mRoutingTree,
		mEntityTree: mEntityTree
	};

	QUnit.module("lib.ViewDependencyHelper.setAllPagesDirty()", {
		beforeEach : function() {
			oViewDependencyHelper = new ViewDependencyHelper(oTemplateContract);
		},
		afterEach : function() {
			for (var sId in mComponentRegistry) delete mComponentRegistry[sId];
		}
	});

	QUnit.test("Test with empty registry", function(assert) {
		oViewDependencyHelper.setAllPagesDirty();
		assert.ok(true, "Run without error");
	});

	QUnit.test("Test with 1 entry in registry", function(assert) {
		var oComponent = {
				setIsRefreshRequired : Function.prototype
		};
		mComponentRegistry.test = {
				oComponent : oComponent
		};

		var oRefreshRequiredSpy = sinon.spy(oComponent, "setIsRefreshRequired");

		oViewDependencyHelper.setAllPagesDirty();

		assert.ok(oRefreshRequiredSpy.calledOnce, "RefreshRequired was called");
		assert.ok(oRefreshRequiredSpy.calledWithExactly(true), "RefreshRequired with correct parameters");
	});

	QUnit.test("Test with 10 entries in registry", function(assert) {
		var oComponent = {
				setIsRefreshRequired : Function.prototype
		};

		var test = {};

		for (var i = 0; i < 10; i++) {
			mComponentRegistry[i] = {
					oComponent : oComponent
			};
		}

		var oRefreshRequiredSpy = sinon.spy(oComponent, "setIsRefreshRequired");
		oViewDependencyHelper.setAllPagesDirty();

		assert.ok(oRefreshRequiredSpy.callCount === 10, "RefreshRequired was called 10 times");
		assert.ok(oRefreshRequiredSpy.calledWithExactly(true), "RefreshRequired with correct parameters");
	});

	QUnit.test("Test with 10 entries in registry, 3 in exclude list", function(assert) {
		var oComponent = {
				setIsRefreshRequired : Function.prototype
		};

		var test = {};

		for (var i = 0; i < 10; i++) {
			mComponentRegistry[i] = {
					oComponent : oComponent
			};
		}

		var oRefreshRequiredSpy = sinon.spy(oComponent, "setIsRefreshRequired");

		oViewDependencyHelper.setAllPagesDirty(["0","1","5"]);

		assert.ok(oRefreshRequiredSpy.callCount === 7, "RefreshRequired was called 10 times");
		assert.ok(oRefreshRequiredSpy.calledWithExactly(true), "RefreshRequired with correct parameters");
	});

	var oComponentListReport, oComponentObjectPage1, oComponentObjectPage2, oTreeNodeListReport, oTreeNodeObjectPage1, oTreeNodeObjectPage2;
	QUnit.module("lib.ViewDependencyHelper.setParentToDirty()", {
		beforeEach : function() {
			oViewDependencyHelper = new ViewDependencyHelper(oTemplateContract);
		oComponentListReport = {
			getId : function(){ return "ListReport"; }
		};
		
		oTreeNodeListReport = {
			level: 0,
			componentId: "ListReport"	
		};

		oComponentObjectPage1 = {
			getId : function(){ return "ObjectPage1"; }
		};
		
		oTreeNodeObjectPage1 = {
			level: 1,
			parentRoute: "root",
			componentId: "ObjectPage1"
		};

		oComponentObjectPage2 = {
			getId : function(){ return "ObjectPage2"; },
		};
		
		oTreeNodeObjectPage2 = {
			level: 2,
			parentRoute: "route1",
			componentId: "ObjectPage2"
		};

		mComponentRegistry.ObjectPage2 = {
			oComponent : oComponentObjectPage2,
			route: "route2",
			routeConfig : {
				viewLevel : 2,
				entitySet : "ObjectPage2",
				parentEntitySet : "ObjectPage1"
			}
		};
		mRoutingTree.route2 = oTreeNodeObjectPage2;
		mComponentRegistry.ListReport = {
			oComponent : oComponentListReport,
			route: "root",
			routeConfig : {
				viewLevel : 0,
				entitySet : "root",
				parentEntitySet : ""
			}
		};
		mRoutingTree.root = oTreeNodeListReport;
		mComponentRegistry.ObjectPage1 = {
			oComponent : oComponentObjectPage1,
			route: "route1",
			routeConfig : {
				viewLevel : 1,
				entitySet : "ObjectPage1",
				parentEntitySet : "root"
			}
		};
		mRoutingTree.route1 = oTreeNodeObjectPage1;


		},
		afterEach : function() {
			for (var sId in mComponentRegistry) delete mComponentRegistry[sId];
			for (var sRoute in mRoutingTree) delete mRoutingTree[sRoute];
		}
	});

	QUnit.test("Test setParentToDirty", function(assert) {

		var oRefreshRequiredParentSpy = sinon.spy(oComponentObjectPage1, "setIsRefreshRequired");
		var oRefreshRequiredSelfSpy = sinon.spy(oComponentObjectPage2, "setIsRefreshRequired");
		oViewDependencyHelper.setParentToDirty(oComponentObjectPage2);

		assert.ok(oRefreshRequiredParentSpy.calledOnce, "RefreshRequired on parent was called");
		assert.ok(oRefreshRequiredParentSpy.calledWithExactly(true), "RefreshRequired on parent with correct parameters");
		assert.ok(oRefreshRequiredSelfSpy.notCalled, "RefreshRequired is not called on myself");
	});

	QUnit.test("Set all ancestors to dirty", function(assert) {


		var oRefreshRequiredParentSpy1 = sinon.spy(oComponentObjectPage1, "setIsRefreshRequired");
		var oRefreshRequiredParentSpy2 = sinon.spy(oComponentListReport, "setIsRefreshRequired");
		var oRefreshRequiredSelfSpy = sinon.spy(oComponentObjectPage2, "setIsRefreshRequired");

		var sNavigationProperty = "";
		oViewDependencyHelper.setParentToDirty(oComponentObjectPage2, sNavigationProperty, null);

		assert.ok(oRefreshRequiredParentSpy1.calledOnce, "RefreshRequired on parent1 was called");
		assert.ok(oRefreshRequiredParentSpy2.calledOnce, "RefreshRequired on parent2 was called");
		assert.ok(oRefreshRequiredParentSpy1.calledWithExactly(true), "RefreshRequired on parent1 with correct parameters");
		assert.ok(oRefreshRequiredParentSpy2.calledWithExactly(true), "RefreshRequired on parent2 with correct parameters");
		assert.ok(oRefreshRequiredSelfSpy.notCalled, "RefreshRequired is not called on myself");
	});

	QUnit.test("Set only the immediate parent to dirty", function(assert) {


		var oRefreshRequiredParentSpy1 = sinon.spy(oComponentObjectPage1, "setIsRefreshRequired");
		var oRefreshRequiredParentSpy2 = sinon.spy(oComponentListReport, "setIsRefreshRequired");
		var oRefreshRequiredSelfSpy = sinon.spy(oComponentObjectPage2, "setIsRefreshRequired");

		var sNavigationProperty = "";
		oViewDependencyHelper.setParentToDirty(oComponentObjectPage2, sNavigationProperty, 1);

		assert.ok(oRefreshRequiredParentSpy1.calledOnce, "RefreshRequired on parent1 was called");
		assert.ok(oRefreshRequiredParentSpy2.notCalled, "RefreshRequired on parent2 was not called");
		assert.ok(oRefreshRequiredSelfSpy.notCalled, "RefreshRequired is not called on self");
		assert.ok(oRefreshRequiredParentSpy1.calledWithExactly(true), "RefreshRequired with correct parameters");
	});

	var oTestStub;

	QUnit.module("lib.ViewDependencyHelper.setMeToDirty()", {
		beforeEach : function() {
			oTestStub = testableHelper.startTest();
			oViewDependencyHelper = new ViewDependencyHelper(oTemplateContract);
		},
		afterEach : function() {
			for (var sId in mComponentRegistry) delete mComponentRegistry[sId];
			for (var sRoute in mRoutingTree) delete mRoutingTree[sRoute];
			testableHelper.endTest();
		}
	});

	QUnit.test("Test setMeToDirty with 1 entry in registry", function(assert) {
		var oComponent = {
			getID : function () {
				return "test";
			},
			getComponentContainer : function() {
				return {
					getSettings : function () {
						return {
							routeConfig : {
								viewLevel : 0
							}
						};
					}
				};
			}
		};

		mComponentRegistry.test = {
				oComponent : oComponent
		};

		var oRefreshRequiredSpy = sinon.spy(oComponent, "setIsRefreshRequired");
		var oSetParentToDirtyStub = sinon.stub(oTestStub, "setParentToDirty");

		var sNavigationProperty = "";
		oViewDependencyHelper.setMeToDirty(oComponent, sNavigationProperty);

		assert.ok(oRefreshRequiredSpy.calledOnce, "RefreshRequired was called");
		assert.ok(oRefreshRequiredSpy.calledWithExactly(true), "RefreshRequired with correct parameters");

		assert.ok(oSetParentToDirtyStub.notCalled, "setParentToDirty was not called");
	});

	QUnit.module("lib.ViewDependencyHelper.unbindChildren()", {
		beforeEach : function() {
			oViewDependencyHelper = new ViewDependencyHelper(oTemplateContract);
		},
		afterEach : function() {
			for (var sId in mComponentRegistry) delete mComponentRegistry[sId];
			for (var sRoute in mRoutingTree) delete mRoutingTree[sRoute];
			for (var sEntitySet in mEntityTree) delete mEntityTree[sEntitySet];
		}
	});

	QUnit.test("Test unbindChildren", function(assert) {
		var oComponentListReport = {
			getId : function(){
				return "ListReport";
			}
		};
		var oTreeNodeListReport = {
			level: 0,
			componentId: "ListReport",
			children: ["entitySet1"]
		};

		var oComponentObjectPage1 = {
			getId : function(){
				return "ObjectPage1";
			}
		};
		
		var oTreeNodeObjectPage1 = {
			level: 1,
			parentRoute: "root",
			componentId: "ObjectPage1",
			children: ["entitySet2"]
		};

		var oComponentObjectPage2 = {
			getId : function(){
				return "ObjectPage2";
			}
		};
		
		var oTreeNodeObjectPage2 = {
			level: 2,
			parentRoute: "route1",
			componentId: "ObjectPage2",
			children: ["entitySet3"]
		};

		var oComponentObjectPage3 = {
			getId : function(){
				return "ObjectPage3";
			}
		};
		var oTreeNodeObjectPage3 = {
			level: 3,
			parentRoute: "route2",
			componentId: "ObjectPage3",
			children: ["entitySet3"]
		};

		var oUnbindElementSpyObjectPage2 = sinon.spy();
		mComponentRegistry.ObjectPage2 = {
			oComponent : oComponentObjectPage2,
			routeConfig : {
				viewLevel : 2,
				entitySet : "ObjectPage2",
				parentEntitySet : "ObjectPage1"
			},
			utils: {
				unbind: oUnbindElementSpyObjectPage2
			},
			route: "route2"
		};
		mRoutingTree.route2 = oTreeNodeObjectPage2;
		mEntityTree.entitySet2 = oTreeNodeObjectPage2; 
		
		var oUnbindElementSpyListReport = sinon.spy();
		mComponentRegistry.ListReport = {
			oComponent : oComponentListReport,
			routeConfig : {
				viewLevel : 0,
				entitySet : "root",
				parentEntitySet : ""
			},
			utils: {
				unbind: oUnbindElementSpyListReport
			},
			route: "root"
		};
		mRoutingTree.root = oTreeNodeListReport;
		
		var oUnbindElementSpyObjectPage1 = sinon.spy();
		mComponentRegistry.ObjectPage1 = {
			oComponent : oComponentObjectPage1,
			routeConfig : {
				viewLevel : 1,
				entitySet : "ObjectPage1",
				parentEntitySet : "root"
			},
			utils: {
				unbind: oUnbindElementSpyObjectPage1
			},
			route: "route1"
		};
		mRoutingTree.route1 = oTreeNodeObjectPage1;
		mEntityTree.entitySet1 = oTreeNodeObjectPage1;
		
		var oUnbindElementSpyObjectPage3 = sinon.spy();
		mComponentRegistry.ObjectPage3 = {
			oComponent : oComponentObjectPage3,
			routeConfig : {
				viewLevel : 3,
				entitySet : "ObjectPage3",
				parentEntitySet : "ObjectPage4"
			},
			utils: {
				unbind: oUnbindElementSpyObjectPage3
			},
			route: "route3"
		};
		mRoutingTree.route3 = oTreeNodeObjectPage3;
		mEntityTree.entitySet3 = oTreeNodeObjectPage3;

		oViewDependencyHelper.unbindChildren(oComponentListReport);

		assert.ok(oUnbindElementSpyObjectPage1.calledOnce, "unbindElement for ObjectPage1 was called");
		assert.ok(oUnbindElementSpyObjectPage2.calledOnce, "unbindElement for ObjectPage2 was called");
		assert.ok(oUnbindElementSpyObjectPage3.neverCalledWith, "unbindElement for ObjectPage3 was never called");
		assert.ok(oUnbindElementSpyListReport.neverCalledWith, "unbindElement for ListReport was never called");
	});
});
