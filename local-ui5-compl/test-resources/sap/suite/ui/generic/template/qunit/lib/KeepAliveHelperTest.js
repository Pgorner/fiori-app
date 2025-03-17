/**
 * tests for the sap.suite.ui.generic.template.lib.KeepAliveHelper
 */

sap.ui.define(["testUtils/sinonEnhanced",
	"sap/suite/ui/generic/template/lib/KeepAliveHelper",
	"sap/suite/ui/generic/template/genericUtilities/testableHelper"],
	function (sinon, KeepAliveHelper, testableHelper) {
		"use strict";

		var oKeepAliveHelper, oStubForPrivate, sandbox;
		var oTemplateContract = {
			componentRegistry: Object.create(null),
			mRoutingTree: Object.create(null),
			mEntityTree: Object.create(null),
			oAppComponent: Object.create(null)
		};

		QUnit.module("lib.KeepAliveHelper (refresh feature on app restore)", {
			beforeEach: function () {
				sandbox = sinon.sandbox.create();
				testableHelper.startTest();
				oKeepAliveHelper = new KeepAliveHelper(oTemplateContract);
				oStubForPrivate = testableHelper.getStaticStub();
			},
			afterEach: function () {
				sandbox.restore();
				testableHelper.endTest();
				oKeepAliveHelper = null;
				oStubForPrivate = null;
			}
		});

		QUnit.test("Function getChevronNavigationRefreshBehaviour", function (assert) {
			var sTableEntitySet = "EntitySet";
			oTemplateContract.mEntityTree = { EntitySet: { page: { navigation: { display: { refreshStrategyOnAppRestore: { entitySets: {}} } } } } };
			var oResult = oKeepAliveHelper.getChevronNavigationRefreshBehaviour(sTableEntitySet);
			assert.deepEqual(oResult, Object.create(null), "returns empty object");

			var oRefreshStrategyParams;
			oTemplateContract.mEntityTree.EntitySet.page.navigation.display.refreshStrategyOnAppRestore.entitySets.EntitySet = "self";
			sandbox.stub(oStubForPrivate, "KeepAliveHelper_fnComputeRefreshBehaviour", function (oRefreshStrategyEntitySets) { oRefreshStrategyParams = oRefreshStrategyEntitySets; });
			oKeepAliveHelper.getChevronNavigationRefreshBehaviour(sTableEntitySet);
			assert.deepEqual(oRefreshStrategyParams, { EntitySet: "self" }, "computeRefreshBehaviour is called with correct parameters");
		});

		QUnit.test("Function computeRefreshBehaviour", function (assert) {
			var oRefreshStrategyEntitySets = {
				EntitySet1: "self",
				EntitySet2: "includingDependents"
			};
			oTemplateContract.componentRegistry = {
				component0: {
					oComponent: {
						getEntitySet: function () {
							return "EntitySet1";
						}
					},
					viewLevel: 0
				},
				component1: {
					oComponent: {
						getEntitySet: function () {
							return "EntitySet1";
						}
					},
					viewLevel: 1
				},
				component2: {
					oComponent: {
						getEntitySet: function () {
							return "EntitySet2";
						}
					},
					viewLevel: 2
				}
			};
			var oResult = oStubForPrivate.KeepAliveHelper_fnComputeRefreshBehaviour(oRefreshStrategyEntitySets);
			assert.ok(oResult.component0.entitySets, ["EntitySet1", "EntitySet2"]);
			assert.ok(oResult.component1.entitySets, ["EntitySet2"]);
			assert.ok(oResult.component1.withoutAssociationsRefresh, true);
			assert.ok(oResult.component2.entitySets, ["EntitySet1", "EntitySet2"]);
			assert.ok(oResult.component2.isRefreshRequired, true);
		});

		QUnit.test("Function getComponentRefreshBehaviour", function (assert) {
			var oStubForPrivate = testableHelper.getStaticStub();
			var oIntentNavigation = {
				semanticObject: "SO1",
				action: "A1"
			};
			var oOutbounds = {
				Intent: {
					action: "A1",
					semanticObject: "SO1"
				},
				SemObj: {
					semanticObject: "SO2"
				}
			};
			var oExternalNavigationSettings = {
				defaultOutboundSettings: {
					refreshStrategyOnAppRestore: {
						entitySets: {
							EntitySet1: "self"
						}
					}
				},
				outbounds: {
					Intent: {
						refreshStrategyOnAppRestore: {
							entitySets: {
								EntitySet2: "self"
							}
						}
					},
					SemObj: {
						refreshStrategyOnAppRestore: {
							entitySets: {
								EntitySet2: "includingDependents"
							}
						}
					}
				}
			};
			oTemplateContract.oAppComponent = {
				getInternalManifest: function () {
					return {
						"sap.app": {
							crossNavigation: {
								outbounds: oOutbounds
							}
						}
					};
				},
				getConfig: function () {
					return {
						settings: {
							externalNavigationSettings: oExternalNavigationSettings
						}
					};
				}
			};
			var oRefreshStrategyParams;
			sandbox.stub(oStubForPrivate, "KeepAliveHelper_fnComputeRefreshBehaviour", function (oRefreshStrategyEntitySets) { oRefreshStrategyParams = oRefreshStrategyEntitySets; });
			oKeepAliveHelper.getComponentRefreshBehaviour(oIntentNavigation);
			assert.deepEqual(oRefreshStrategyParams, { EntitySet2: "self" }, "computeRefreshBehaviour is called with an exact match on intent");

			sandbox.restore();
			oOutbounds = Object.create(null);
			sandbox.stub(oStubForPrivate, "KeepAliveHelper_fnComputeRefreshBehaviour", function (oRefreshStrategyEntitySets) { oRefreshStrategyParams = oRefreshStrategyEntitySets; });
			oKeepAliveHelper.getComponentRefreshBehaviour(oIntentNavigation);
			assert.deepEqual(oRefreshStrategyParams, { EntitySet1: "self" }, "computeRefreshBehaviour is called with default navigation refresh strategies");

			sandbox.restore();
			oIntentNavigation.key = "key";
			oExternalNavigationSettings.outbounds.key = {
				refreshStrategyOnAppRestore: {
					entitySets: {
						KeyEntitySet: "self"
					}
				}
			};
			sandbox.stub(oStubForPrivate, "KeepAliveHelper_fnComputeRefreshBehaviour", function (oRefreshStrategyEntitySets) { oRefreshStrategyParams = oRefreshStrategyEntitySets; });
			oKeepAliveHelper.getComponentRefreshBehaviour(oIntentNavigation);
			assert.deepEqual(oRefreshStrategyParams, { KeyEntitySet: "self" }, "computeRefreshBehaviour is called with navigation match of the intent navigation key");
		});

		QUnit.test("Function getComponentRefreshBehaviour (fallback to default settings)", function (assert) {
			var oStubForPrivate = testableHelper.getStaticStub();
			var oRefreshStrategyParams;
			var oOutbounds = {
				SemObj: {
					semanticObject: "SO2"
				}
			};
			var oIntentNavigation = {
				semanticObject: "SO2"
			};
			var oExternalNavigationSettings = {
				defaultOutboundSettings: {
					refreshStrategyOnAppRestore: {
						entitySets: {
							EntitySet1: "self"
						}
					}
				},
				outbounds: {
					Intent: {},
					SemObj: {}
				}
			};
			oTemplateContract.oAppComponent = {
				getInternalManifest: function () {
					return {
						"sap.app": {
							crossNavigation: {
								outbounds: { oOutbounds }
							}
						}
					};
				},
				getConfig: function () {
					return {
						settings: {
							externalNavigationSettings: oExternalNavigationSettings
						}
					};
				}
			};
			sandbox.stub(oStubForPrivate, "KeepAliveHelper_fnComputeRefreshBehaviour", function (oRefreshStrategyEntitySets) { oRefreshStrategyParams = oRefreshStrategyEntitySets; });
			oKeepAliveHelper.getComponentRefreshBehaviour(oIntentNavigation);
			assert.deepEqual(oRefreshStrategyParams, { EntitySet1: "self" }, "computeRefreshBehaviour is called with a navigation match of default settings");
		});

	});