/**
 * tests for the sap.suite.ui.generic.template.lib.routingHelper
 */
sap.ui.define(["testUtils/sinonEnhanced", "sap/ui/core/mvc/XMLView", "sap/ui/model/odata/ODataMetaModel", "sap/ui/model/odata/v2/ODataModel", "sap/suite/ui/generic/template/lib/navigation/routingHelper",
	"sap/suite/ui/generic/template/genericUtilities/FeError", "sap/base/util/isEmptyObject",
], function(sinon, XMLView, ODataMetaModel, ODataModel, routingHelper, FeError, isEmptyObject) {
	"use strict";

	var oSandbox;

	var oTemplateContract;
	var myAssert;
	var done;
	var mTargets;
	var mTargetDisplays;
	var mRoutes;
	var oRoutingStructureGenerated;
	var oFCLSettings;
	var oAppConfig;
	var oHostView = {};
	var mDraftEnabled;
	var oXMLViewCreated;
	var sNavigationHostId = {};
	var sTitle = {};
	var sDescription = {};
	var oIcons = {
		icon: {}
	}
	var rootEntitySet = "theRootEntitySetForTest";
	QUnit.module("lib.navigation.routingHelper.generateRoutingStructure", {
		beforeEach: function() {
			oSandbox = sinon.sandbox.create();
			var oModel = sinon.createStubInstance(ODataModel);
			var oMetaModel = sinon.createStubInstance(ODataMetaModel);
			oModel.getMetaModel.returns(oMetaModel);
			oMetaModel.loaded.returns(Promise.resolve());
			oXMLViewCreated = oSandbox.stub(XMLView, "create", function(oViewDef){
				myAssert.deepEqual(oViewDef, {
					viewName: "sap.suite.ui.generic.template.fragments.TemplateHost"
				}, "Only TemplateHost view must be created");
				return Promise.resolve(oHostView);
			});
			oAppConfig = { };
			mDraftEnabled = Object.create(null);
			mTargets = Object.create(null);
			mTargetDisplays = Object.create(null);
			mRoutes = Object.create(null);
			var oAppComponent = {
				getFlexibleColumnLayout: function(){
					return oFCLSettings;
				},
				getModel: function(sName){
					myAssert.strictEqual(sName, undefined, "Only unnamed model must be retrieved from appComponent");
					return oModel;
				},
				getConfig: function(){
					return oAppConfig;
				},
				getManifestEntry: function(sName){
					if (sName === "sap.app"){
						return {
							title: sTitle,
							description: sDescription
						};
					}
					myAssert.strictEqual(sName, "sap.ui", "Only manifest entry 'sap.app' and 'sap.ui' must be accessed");
					return {
						icons: oIcons
					};
				},
				getTransactionController: function(){
					return {
						getDraftController: function(){
							return {
								getDraftContext: function(){
									return {
										isDraftEnabled: function(sEntitySet){
											var iDraftInfo = mDraftEnabled[sEntitySet];
											myAssert.ok(!!iDraftInfo, "Requesting draft info for entity set " + sEntitySet);
											return iDraftInfo > 0;
										}
									};
								}
							};
						}
					};
				}
			};
			oTemplateContract = {
				oAppComponent: oAppComponent,
				oNavigationControllerProxy: {
					oAppComponent: oAppComponent,
					oRouter: {
						getTargets: function(){
							return {
								addTarget: function(sTargetName, oTarget){
									myAssert.ok(sTargetName, "No empty target name");
									myAssert.ok(!mTargets[sTargetName], "No duplicate definition for target " + sTargetName);
									mTargets[sTargetName] = oTarget;
								},
								getTarget: function(sTargetName){
									var oTargetDef = mTargets[sTargetName];
									return oTargetDef && {
										attachDisplay: function(fnDisplayed){
											mTargetDisplays.sTargetName = fnDisplayed;
										}
									};
								}
							};
						},
						addRoute: function(oRoute){
							var sRouteName = oRoute.name;
							myAssert.ok(!mRoutes[sRouteName], "No duplicate definition for route " + sRouteName);
							mRoutes[sRouteName] = oRoute;
						}
					}
				},
				oNavigationHost: {
					getId: function(){
						return sNavigationHostId;
					}
				}
			};
			oTemplateContract.oNavigationControllerProxy.oTemplateContract = oTemplateContract;
		},
		afterEach: function() {
			oFCLSettings = null;
			oSandbox.restore();
		}
	});

	var fnStartTest = function(assert, aPages){
		myAssert = assert;
		done = assert.async();
		oAppConfig.pages = aPages;
		oRoutingStructureGenerated = routingHelper.generateRoutingStructure(oTemplateContract);
	};

	QUnit.test("generateRoutingStructure fails without configuration", function(assert) {
		fnStartTest(assert);
		oRoutingStructureGenerated.catch(function(oError){
			assert.ok(oError instanceof FeError, "FeError must be thrown for config without pages");
			done();
		});
	});

	QUnit.test("generateRoutingStructure fails without pages", function(assert) {
		fnStartTest(assert, []);
		oRoutingStructureGenerated.catch(function(oError){
			assert.ok(oError instanceof FeError, "FeError must be thrown for config with empty pages");
			done();
		});
	});

	var fnTestHierarchy = function(assert){
		for (var sRoute in oTemplateContract.mRoutingTree){
			assert.ok(!!sRoute, "No empty routes allowed");
			var oTreeNode = oTemplateContract.mRoutingTree[sRoute];
			assert.strictEqual(oTreeNode.sRouteName, sRoute, "Route name of tree node must be correct");
			if (oTreeNode.level > 0){
				var oParentNode = oTemplateContract.mRoutingTree[oTreeNode.parentRoute];
				assert.strictEqual(oParentNode.level, oTreeNode.level - 1, "level of parent node must be 1 less then level of child node");
				assert.ok(oParentNode.children.indexOf(oTreeNode.entitySet) >= 0, "child node must be listed in the array of children of the parent node");
			} else {
				assert.strictEqual(sRoute, "root", "Only root node can have level 0");
			}
			var mChildren = Object.create(null);
			oTreeNode.children.forEach(function(sChildEntitySet){
				var oChildNode = oTemplateContract.mEntityTree[sChildEntitySet];
				assert.strictEqual(oChildNode.parentRoute, sRoute, "Child with entrity set " + sChildEntitySet + " must have been added to the hierarchy consistently");
				assert.ok(!mChildren[sChildEntitySet], "Child with name " + sChildEntitySet + " must not appear twice in tree node with route " + sRoute);
				mChildren[sChildEntitySet] = oChildNode;
			});
		}
	};

	var fnGeneralCheck = function(assert){
		fnTestHierarchy(assert);
		var mPages = Object.create(null);
		var fnAddPages = function(aPages){
			(aPages || []).forEach(function(oPage){
				mPages[oPage.entitySet] = oPage;
				fnAddPages(oPage.pages);
			});
		}
		fnAddPages(oAppConfig.pages[0].pages);
		for (var sEntitySet in mPages){
			var oPage = mPages[sEntitySet];
			var oEntityTreeNode = oTemplateContract.mEntityTree[sEntitySet];
			assert.strictEqual(oEntityTreeNode.page, oPage, "Tree node for entity set" + sEntityset + " must have correct page");
			assert.strictEqual(oEntityTreeNode.entitySet, sEntitySet, "entity set for tree node must be correct");
			delete oTemplateContract.mEntityTree[sEntitySet];
			assert.strictEqual(oTemplateContract.mRoutingTree[oEntityTreeNode.sRouteName], oEntityTreeNode, "Tree node for entity set" + sEntityset + " must be idenitical to tree node for route " + oEntityTreeNode.sRouteName);
			delete oTemplateContract.mRoutingTree[oEntityTreeNode.sRouteName];
		}
		assert.ok(isEmptyObject(oTemplateContract.mEntityTree), "No superfluous tree nodes in the entity tree");
		var oRootTreeNode = oTemplateContract.mRoutingTree.root;
		assert.strictEqual(oRootTreeNode.page, oAppConfig.pages[0], "Page for root node must be set correctly");
		assert.strictEqual(oRootTreeNode.entitySet, rootEntitySet, "entity set for root must be correct");
		assert.strictEqual(oRootTreeNode.level, 0, "level for root must be correct");
		assert.strictEqual(oRootTreeNode.headerTitle, sTitle, "title for root must be correct");
		assert.strictEqual(oRootTreeNode.text, sDescription, "text for root must be correct");
		assert.strictEqual(oRootTreeNode.titleIconUrl, oIcons.icon, "icon for root must be correct");
		assert.ok(!oRootTreeNode.parentRoute, "root node must not have a parent route");
		delete oTemplateContract.mRoutingTree.root;
		assert.ok(isEmptyObject(oTemplateContract.mRoutingTree), "No superfluous tree nodes in the routing tree");
		done();
	};

	QUnit.test("generateRoutingStructure for app with only root page", function(assert) {
		mDraftEnabled[rootEntitySet] = -1;
		fnStartTest(assert, [{
			entitySet: rootEntitySet,
			component: {
				name: "sap.suite.ui.generic.template.ListReport"
			}
		}]);
		oRoutingStructureGenerated.then(function(){
			assert.ok(isEmptyObject(oTemplateContract.mEntityTree), "No detail tree nodes created ");
			fnGeneralCheck(assert);
		});
	});
});
