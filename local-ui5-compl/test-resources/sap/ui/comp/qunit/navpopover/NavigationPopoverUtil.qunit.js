/* global QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/navpopover/FakeFlpConnector",
	"sap/ui/comp/navpopover/SemanticObjectController",
	"sap/ui/comp/navpopover/Util",
	"sap/ui/core/Lib",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/json/JSONModel",
	"sap/base/Log"
], function(
	FakeFlpConnector,
	SemanticObjectController,
	Util,
	Library,
	MockServer,
	ODataModel,
	JSONModel,
	Log
) {
	"use strict";

	var oMockServer;
	function setUpMockServer() {
		oMockServer = new MockServer({
			rootUri: "/odataFake/"
		});
		// configure
		MockServer.config({
			autoRespond: true,
			autoRespondAfter: 1000
		});
		oMockServer.simulate(
			"test-resources/sap/ui/comp/qunit/navpopover/mockserverQunit/metadata.xml",
			"test-resources/sap/ui/comp/qunit/navpopover/mockserverQunit/"
		);
		oMockServer.start();
	}

	function stopMockServer() {
		oMockServer.stop();
		oMockServer.destroy();
	}

	QUnit.module("sap.ui.comp.navpopover.Util: retrieveNavigationTargets", {
		beforeEach: function() {
			FakeFlpConnector.enableFakeConnector({
				TestObjectEmpty: {
					links: []
				},
				TestObjectDisplayFactSheet: {
					links: [
						{
							action: "displayFactSheet",
							intent: "?TestObjectDisplayFactSheet#/dummyLink",
							text: "Fact Sheet"
						}
					]
				},
				TestObjectAnyAction: {
					links: [
						{
							action: "anyAction",
							intent: "?TestObjectAnyAction#/dummyLink",
							text: "Fact Sheet"
						}
					]
				},
				TestObjectTwoIntents: {
					links: [
						{
							action: "anyAction",
							intent: "?TestObjectTwoIntents#/dummyLink1",
							text: "Fact Sheet 1"
						}, {
							action: "anyAction",
							intent: "?TestObjectTwoIntents#/dummyLink2",
							text: "Fact Sheet 2"
						}
					]
				},
				TestObjectPrimaryActionTags: {
					links: [
						{
							action: "anyAction",
							intent: "?TestObjectPrimaryActionTags#/dummyLink1",
							text: "Fact Sheet 1",
							tags: ["primaryAction"]
						},
						{
							action: "displayFactSheet",
							intent: "?TestObjectPrimaryActionTags#/dummyLink2",
							text: "Fact Sheet 2"
						}
					]
				},
				TestObjectPrimaryActionDFS: {
					links: [
						{
							action: "anyAction",
							intent: "?TestObjectPrimaryActionDFS#/dummyLink1",
							text: "Fact Sheet 1"
						},
						{
							action: "displayFactSheet",
							intent: "?TestObjectPrimaryActionDFS#/dummyLink2",
							text: "Fact Sheet 2"
						}
					]
				}
			});
		},
		afterEach: function() {
			FakeFlpConnector.disableFakeConnector();
			SemanticObjectController.destroyDistinctSemanticObjects();
		}
	});

	QUnit.test("Navigation service not available", function(assert) {
		var fnSapLogErrorSpy = sinon.spy(Log, "error").withArgs("Service 'Navigation' or 'URLParsing' could not be obtained");

		FakeFlpConnector.disableFakeConnector();

		var done = assert.async();
		Util.retrieveNavigationTargets("TestObjectDummy", []).then(function(oNavigationTargets) {
			assert.ok(fnSapLogErrorSpy.withArgs("Service 'Navigation' or 'URLParsing' could not be obtained").called);
			assert.equal(oNavigationTargets.mainNavigation, null);
			assert.equal(oNavigationTargets.ownNavigation, null);
			assert.deepEqual(oNavigationTargets.availableActions, []);

			done();
			Log.error.restore();
		});
	});

	QUnit.test("Navigation service returns empty links", function(assert) {
		var fnSapLogErrorSpy = sinon.spy(Log, "error");

		var done = assert.async();
		Util.retrieveNavigationTargets("TestObjectEmpty", []).then(function(oNavigationTargets) {
			assert.ok(!fnSapLogErrorSpy.called);
			assert.equal(oNavigationTargets.mainNavigation, null);
			assert.equal(oNavigationTargets.ownNavigation, null);
			assert.deepEqual(oNavigationTargets.availableActions, []);

			done();
			Log.error.restore();
		});
	});

	QUnit.test("Navigation service returns one link with action 'displayFactSheet'", function(assert) {
		// system under test

		// arrange
		var done = assert.async();
		var fnSapLogErrorSpy = sinon.spy(Log, "error");

		// act
		Util.retrieveNavigationTargets("TestObjectDisplayFactSheet", [], null, null, null, null).then(function(oNavigationTargets) {

			// assert
			assert.ok(!fnSapLogErrorSpy.called);
			assert.equal(oNavigationTargets.mainNavigation.getHref(), "?TestObjectDisplayFactSheet#/dummyLink");
			assert.equal(oNavigationTargets.mainNavigation.getText(), Library.getResourceBundleFor("sap.ui.comp").getText("POPOVER_FACTSHEET"));
			assert.equal(oNavigationTargets.ownNavigation, null);
			assert.deepEqual(oNavigationTargets.availableActions, []);

			done();

			// cleanup
			Log.error.restore();
		});
	});

	QUnit.test("Navigation service returns one link with any action", function(assert) {
		// system under test

		// arrange
		var done = assert.async();
		var fnSapLogErrorSpy = sinon.spy(Log, "error");

		// act
		Util.retrieveNavigationTargets("TestObjectAnyAction", [], null, null, null, "Label").then(function(oNavigationTargets) {

			// assert
			assert.ok(!fnSapLogErrorSpy.called);
			assert.equal(oNavigationTargets.mainNavigation.getHref(), "");
			assert.equal(oNavigationTargets.mainNavigation.getText(), "Label");
			assert.equal(oNavigationTargets.ownNavigation, null);
			assert.deepEqual(oNavigationTargets.availableActions.length, 1);
			assert.deepEqual(oNavigationTargets.availableActions[0].getHref(), "?TestObjectAnyAction#/dummyLink");
			assert.deepEqual(oNavigationTargets.availableActions[0].getText(), "Fact Sheet");

			done();

			// cleanup
			Log.error.restore();
		});
	});

	QUnit.test("Navigation service returns two links with any actions", function(assert) {
		// system under test

		// arrange
		var done = assert.async();
		var fnSapLogErrorSpy = sinon.spy(Log, "error");

		// act
		Util.retrieveNavigationTargets("TestObjectTwoIntents", [], null, null, null, "Label").then(function(oNavigationTargets) {

			// assert
			assert.ok(!fnSapLogErrorSpy.called);
			assert.equal(oNavigationTargets.mainNavigation.getHref(), "");
			assert.equal(oNavigationTargets.mainNavigation.getText(), "Label");
			assert.equal(oNavigationTargets.ownNavigation, null);
			assert.deepEqual(oNavigationTargets.availableActions.length, 2);
			assert.deepEqual(oNavigationTargets.availableActions[0].getHref(), "?TestObjectTwoIntents#/dummyLink1");
			assert.deepEqual(oNavigationTargets.availableActions[0].getText(), "Fact Sheet 1");
			assert.deepEqual(oNavigationTargets.availableActions[1].getHref(), "?TestObjectTwoIntents#/dummyLink2");
			assert.deepEqual(oNavigationTargets.availableActions[1].getText(), "Fact Sheet 2");

			done();

			// cleanup
			Log.error.restore();
		});
	});

	QUnit.test("different SemanticObjects", function(assert) {
		// system under test

		// arrange
		var done = assert.async();

		// act
		Util.retrieveNavigationTargets("TestObjectDisplayFactSheet", [
			"TestObjectAnyAction", "TestObjectTwoIntents"
		], null, null, null, null).then(function(oNavigationTargets) {

			// assert
			assert.equal(oNavigationTargets.mainNavigation.getHref(), "?TestObjectDisplayFactSheet#/dummyLink");
			assert.equal(oNavigationTargets.mainNavigation.getText(), Library.getResourceBundleFor("sap.ui.comp").getText("POPOVER_FACTSHEET"));
			assert.equal(oNavigationTargets.ownNavigation, null);
			assert.deepEqual(oNavigationTargets.availableActions.length, 3);
			assert.deepEqual(oNavigationTargets.availableActions[0].getHref(), "?TestObjectAnyAction#/dummyLink");
			assert.deepEqual(oNavigationTargets.availableActions[0].getText(), "Fact Sheet");
			assert.deepEqual(oNavigationTargets.availableActions[1].getHref(), "?TestObjectTwoIntents#/dummyLink1");
			assert.deepEqual(oNavigationTargets.availableActions[1].getText(), "Fact Sheet 1");
			assert.deepEqual(oNavigationTargets.availableActions[2].getHref(), "?TestObjectTwoIntents#/dummyLink2");
			assert.deepEqual(oNavigationTargets.availableActions[2].getText(), "Fact Sheet 2");

			done();

			// cleanup
		});
	});

	QUnit.test("Navigation service returns correct primaryAction with tags", function(assert) {
		// system under test

		// arrange
		var done = assert.async();
		var fnSapLogErrorSpy = sinon.spy(Log, "error");

		// act
		Util.retrieveNavigationTargets("TestObjectPrimaryActionTags", [], null, null, null, null).then(function(oNavigationTargets) {

			// assert
			assert.ok(!fnSapLogErrorSpy.called);
			assert.equal(oNavigationTargets.mainNavigation.getHref(), "?TestObjectPrimaryActionTags#/dummyLink1");
			assert.equal(oNavigationTargets.mainNavigation.getText(), Library.getResourceBundleFor("sap.ui.comp").getText("POPOVER_FACTSHEET"));
			assert.equal(oNavigationTargets.ownNavigation, null);
			assert.deepEqual(oNavigationTargets.availableActions.length, 1);
			assert.deepEqual(oNavigationTargets.availableActions[0].getHref(), "?TestObjectPrimaryActionTags#/dummyLink2");
			assert.deepEqual(oNavigationTargets.availableActions[0].getText(), "Fact Sheet 2");

			done();

			// cleanup
			Log.error.restore();
		});
	});

	QUnit.test("Navigation service returns correct primaryAction without tags", function(assert) {
		// system under test

		// arrange
		var done = assert.async();
		var fnSapLogErrorSpy = sinon.spy(Log, "error");

		// act
		Util.retrieveNavigationTargets("TestObjectPrimaryActionDFS", [], null, null, null, null).then(function(oNavigationTargets) {

			// assert
			assert.ok(!fnSapLogErrorSpy.called);
			assert.equal(oNavigationTargets.mainNavigation.getHref(), "?TestObjectPrimaryActionDFS#/dummyLink2");
			assert.equal(oNavigationTargets.mainNavigation.getText(), Library.getResourceBundleFor("sap.ui.comp").getText("POPOVER_FACTSHEET"));
			assert.equal(oNavigationTargets.ownNavigation, null);
			assert.deepEqual(oNavigationTargets.availableActions.length, 1);
			assert.deepEqual(oNavigationTargets.availableActions[0].getHref(), "?TestObjectPrimaryActionDFS#/dummyLink1");
			assert.deepEqual(oNavigationTargets.availableActions[0].getText(), "Fact Sheet 1");

			done();

			// cleanup
			Log.error.restore();
		});
	});

	QUnit.test("Navigation service returns correct primaryAction without tags or displayFactSheet", function(assert) {
		// system under test

		// arrange
		var done = assert.async();
		var fnSapLogErrorSpy = sinon.spy(Log, "error");

		// act
		Util.retrieveNavigationTargets("TestObjectTwoIntents", [], null, null, null, null).then(function(oNavigationTargets) {

			// assert
			assert.ok(!fnSapLogErrorSpy.called);
			assert.equal(oNavigationTargets.mainNavigation, null);
			assert.equal(oNavigationTargets.ownNavigation, null);
			assert.deepEqual(oNavigationTargets.availableActions.length, 2);
			assert.deepEqual(oNavigationTargets.availableActions[0].getHref(), "?TestObjectTwoIntents#/dummyLink1");
			assert.deepEqual(oNavigationTargets.availableActions[0].getText(), "Fact Sheet 1");
			assert.deepEqual(oNavigationTargets.availableActions[1].getHref(), "?TestObjectTwoIntents#/dummyLink2");
			assert.deepEqual(oNavigationTargets.availableActions[1].getText(), "Fact Sheet 2");

			done();

			// cleanup
			Log.error.restore();
		});
	});

	QUnit.test("should only resolve SemanticObject once when including the same SemanticObject in additionalSemanticObjects", function(assert) {
		var done = assert.async();
		// act
		Util.retrieveNavigationTargets("TestObjectTwoIntents", ["TestObjectTwoIntents", "TestObjectTwoIntents", "TestObjectTwoIntents"], null, null, null, null).then(function(oNavigationTargets) {

			// assert
			assert.equal(oNavigationTargets.mainNavigation, null);
			assert.equal(oNavigationTargets.ownNavigation, null);
			assert.deepEqual(oNavigationTargets.availableActions.length, 2);
			assert.deepEqual(oNavigationTargets.availableActions[0].getHref(), "?TestObjectTwoIntents#/dummyLink1");
			assert.deepEqual(oNavigationTargets.availableActions[0].getText(), "Fact Sheet 1");
			assert.deepEqual(oNavigationTargets.availableActions[1].getHref(), "?TestObjectTwoIntents#/dummyLink2");
			assert.deepEqual(oNavigationTargets.availableActions[1].getText(), "Fact Sheet 2");

			done();

			// cleanup
			Log.error.restore();
		});
	});

	QUnit.module("sap.ui.comp.navpopover.Util: retrieveSemanticObjectMapping", {
		beforeEach: function() {
			setUpMockServer();
			this.oODataModel = new ODataModel("/odataFake");
		},
		afterEach: function() {
			stopMockServer();
			this.oODataModel.destroy();
		}
	});

	QUnit.test("invalid parameters", function(assert) {
		var done = assert.async();
		var done2 = assert.async();
		var done3 = assert.async();
		var done4 = assert.async();
		var done5 = assert.async();
		var done6 = assert.async();
		Util.retrieveSemanticObjectMapping("", this.oODataModel, "/ProductCollection()").then(function(oSemanticObjects) {
			assert.deepEqual(oSemanticObjects, null);
			done();
		});
		Util.retrieveSemanticObjectMapping("Dummy", this.oODataModel, "/ProductCollection()").then(function(oSemanticObjects) {
			assert.deepEqual(oSemanticObjects, null);
			done5();
		});
		Util.retrieveSemanticObjectMapping("Name", new JSONModel({
			ProductCollection: {
				id: "38094020.0"
			}
		}), "/ProductCollection()").then(function(oSemanticObjects) {
			assert.deepEqual(oSemanticObjects, null);
			done2();
		});
		Util.retrieveSemanticObjectMapping("Name", this.oODataModel, "/DummyCollection()").then(function(oSemanticObjects) {
			assert.deepEqual(oSemanticObjects, null);
			done3();
		});
		Util.retrieveSemanticObjectMapping("Name", this.oODataModel, null).then(function(oSemanticObjects) {
			assert.deepEqual(oSemanticObjects, null);
			done6();
		});
		Util.retrieveSemanticObjectMapping("Name", this.oODataModel, "/EmptyCollection()").then(function(oSemanticObjects) {
			assert.deepEqual(oSemanticObjects, null);
			done4();
		});
	});

	QUnit.test("with existing mapping annotation attributes", function(assert) {
		var done = assert.async();
		Util.retrieveSemanticObjectMapping("Name", this.oODataModel, "/ProductCollection()").then(function(oSemanticObjects) {
			assert.deepEqual(oSemanticObjects, {
				SemanticObjectName: {
					ProductId: "ProductId_NEW"
				}
			});
			done();
		});
	});

	QUnit.test("with empty mapping annotation array", function(assert) {
		var done = assert.async();
		Util.retrieveSemanticObjectMapping("Category", this.oODataModel, "/ProductCollection()").then(function(oSemanticObjects) {
			assert.deepEqual(oSemanticObjects, {
				SemanticObjectName: {}
			});
			done();
		});
	});

	QUnit.test("with empty mapping annotation", function(assert) {
		var done = assert.async();
		Util.retrieveSemanticObjectMapping("ProductPicUrl", this.oODataModel, "/ProductCollection()").then(function(oSemanticObjects) {
			assert.deepEqual(oSemanticObjects, {
				SemanticObjectName: {}
			});
			done();
		});
	});

	QUnit.module("Basic methods", {

	});

	QUnit.test("getContactAnnotationPath", function(assert) {

		var oControlMock = {
			getContactAnnotationPath: function() {
				return undefined;
			},
			getFieldName: function() {
				return "MockFieldName";
			}
		};

		var oSemanticObjectControllerMock = {
			getContactAnnotationPaths: function() {
				return {
					"MockFieldName": "MockedContactAnnotationPath"
				};
			}
		};

		// Returns undefined when called withour parameters
		assert.equal(Util.getContactAnnotationPath(), undefined, "undefined returned when called without parameters");

		// Returns undefined when no SemanticObject
		assert.equal(Util.getContactAnnotationPath(oControlMock), undefined, "Correct contactAnnotationPath returned");

		// Shall return contactAnnotationPath of SemanticObjectController when control has no contactAnnotationPath
		assert.equal(Util.getContactAnnotationPath(oControlMock, oSemanticObjectControllerMock), "MockedContactAnnotationPath", "Correct contactAnnotationPath returned");

		// Shall return contactAnnotationPath of control when control has a contactAnnotationPath
		oControlMock.getContactAnnotationPath = function() {
			return "NewContactAnnotationPath";
		};

		assert.equal(Util.getContactAnnotationPath(oControlMock, oSemanticObjectControllerMock), "NewContactAnnotationPath", "Correct contactAnnotationPath returned");
	});

	QUnit.test("getForceLinkRendering", function(assert) {
		var oControlMock = {
			getForceLinkRendering: function() {
				return false;
			},
			getFieldName: function() {
				return "MockFieldName";
			}
		};

		var oSemanticObjectControllerMock = {
			getForceLinkRendering: function() {
				return {
					"MockFieldName": true
				};
			}
		};

		// Returns undefined when called without parameters
		assert.equal(Util.getForceLinkRendering(), undefined, "undefined returned when called without parameters");

		// Returns false when called without SemanticObjectController
		assert.equal(Util.getForceLinkRendering(oControlMock), false, "false returned when called with ControlMock");

		// Returns value of SemanticObjectController when control has no value
		assert.equal(Util.getForceLinkRendering(oControlMock, oSemanticObjectControllerMock), true, "true returned when called with SemanticObjectControllerMock");
	});

	QUnit.test("getStorableAvailableActions", function(assert) {
		var aMAvailableActions = [
			{
				name: "Action1",
				key: null
			},
			{
				name: "Action2"
			},
			{
				key: "key",
				name: "Action3"
			}
		];

		var aExpectedActions = [aMAvailableActions[0], aMAvailableActions[2]];

		// Returns empty array when called without parameters
		assert.deepEqual(Util.getStorableAvailableActions(), [], "empty array returned when called withour parameters");

		// Returns empty array when called with an array containing undefined as parameter
		assert.deepEqual(Util.getStorableAvailableActions([undefined]), [], "empty array returned when called with array containing undefined");

		// Returns correct array when called with an array containing actions
		assert.deepEqual(Util.getStorableAvailableActions(aMAvailableActions), aExpectedActions, "correct array returned");
	});

	QUnit.test("sortArrayAlphabetical", function(assert) {
		var aArrayToSort = [
			undefined, "789", "123", "abc", "xyz", null, ""
		];

		var aExpectedArray = [
			"", "123", "789", "abc", null, "xyz", undefined
		];

		Util.sortArrayAlphabetical(aArrayToSort);

		assert.deepEqual(aArrayToSort, aExpectedArray, "Array sorted correctly");
	});

	QUnit.test("retrieveSemanticObjectMapping", function(assert) {
		var done = assert.async(3);

		// Arrange
		var sPropertyName = "Category";
		var oODataModelMock = {
			getMetaModel: function() {
				return {
					loaded: function() {
						return Promise.resolve();
					},
					getMetaContext: function(sBindingPath) {
						return {
							getProperty: function(sPath) {
								return {
									property: undefined
								};
							},
							getPath: function() {
								return "MetaContextPath";
							}
						};
					}
				};
			}
		};

		// Action
		Util.retrieveSemanticObjectMapping(sPropertyName, oODataModelMock, undefined).then(function(oResult) {
			// Assert
			assert.equal(oResult, null, "Null returned when there are no properties");
			done();
		});

		// Arrange
		oODataModelMock = {
			getMetaModel: function() {
				return {
					loaded: function() {
						return Promise.resolve();
					},
					getMetaContext: function(sBindingPath) {
						return {
							getProperty: function(sPath) {
								return {
									property: [
										{
											name: sPropertyName,
											"com.sap.vocabularies.Common.v1.SemanticObjectMapping": undefined
										}
									]
								};
							},
							getPath: function() {
								return "MetaContextPath";
							}
						};
					}
				};
			}
		};

		// Action
		Util.retrieveSemanticObjectMapping(sPropertyName, oODataModelMock, "ViableBindingPath").then(function(oResult) {
			// Assert
			assert.equal(oResult, null, "Null returned when there are no SemanticObjectMappings");
			done();
		});

		// Arrange
		oODataModelMock = {
			getMetaModel: function() {
				return {
					loaded: function() {
						return Promise.resolve();
					},
					getMetaContext: function(sBindingPath) {
						return {
							getProperty: function(sPath) {
								return {
									property: [
										{
											name: sPropertyName,
											"com.sap.vocabularies.Common.v1.SemanticObject": {String: 'SemanticObject'},
											"com.sap.vocabularies.Common.v1.SemanticObject#TestSemanticObject1": {String: 'TestSemanticObject'},
											"com.sap.vocabularies.Common.v1.SemanticObjectMapping": [
												{
													LocalProperty: {
														PropertyPath: "LocalPropertyPath"
													},
													SemanticObjectProperty: {
														String: "SemanticObjectPropertyString"
													}
												}
											],
											"com.sap.vocabularies.Common.v1.SemanticObjectMapping#TestSemanticObject1": []
										}
									]
								};
							},
							getPath: function() {
								return "MetaContextPath";
							}
						};
					}
				};
			}
		};
		var oExpectedSemanticObjects = {
			"SemanticObject": { "LocalPropertyPath": "SemanticObjectPropertyString" },
			"TestSemanticObject": {}
		};

		// Action
		Util.retrieveSemanticObjectMapping(sPropertyName, oODataModelMock, "ViableBindingPath").then(function(oResult) {
			// Assert
			assert.deepEqual(oResult, oExpectedSemanticObjects, "Correct Object returned when there are SemanticObjectMappings");
			done();
		});
	});

	QUnit.test("retrieveSemanticObjectUnavailableActions", function(assert) {
		var done = assert.async(3);
		// Arrange
		var sPropertyName = "Category";
		var oODataModelMock = {
			getMetaModel: function() {
				return {
					loaded: function() {
						return Promise.resolve();
					},
					getMetaContext: function(sBindingPath) {
						return {
							getProperty: function(sPath) {
								return {
									property: undefined
								};
							},
							getPath: function() {
								return "MetaContextPath";
							}
						};
					}
				};
			}
		};

		// Action
		Util.retrieveSemanticObjectUnavailableActions(sPropertyName, oODataModelMock, undefined).then(function(oResult) {
			// Assert
			assert.equal(oResult, null, "Null returned when there are no properties");
			done();
		});

		// Arrange
		oODataModelMock = {
			getMetaModel: function() {
				return {
					loaded: function() {
						return Promise.resolve();
					},
					getMetaContext: function(sBindingPath) {
						return {
							getProperty: function(sPath) {
								return {
									property: [
										{
											name: sPropertyName,
											"com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions": undefined
										}
									]
								};
							},
							getPath: function() {
								return "MetaContextPath";
							}
						};
					}
				};
			}
		};

		// Action
		Util.retrieveSemanticObjectUnavailableActions(sPropertyName, oODataModelMock, undefined).then(function(oResult) {
			// Assert
			assert.equal(oResult, null, "Null returned when there are no SemanticObjectUnavailableActions");
			done();
		});

		// Arrange
		oODataModelMock = {
			getMetaModel: function() {
				return {
					loaded: function() {
						return Promise.resolve();
					},
					getMetaContext: function(sBindingPath) {
						return {
							getProperty: function(sPath) {
								return {
									property: [
										{
											name: sPropertyName,
											"com.sap.vocabularies.Common.v1.SemanticObject": {String: 'SemanticObject'},
											"com.sap.vocabularies.Common.v1.SemanticObject#TestSemanticObject1": {String: 'TestSemanticObject'},
											"com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions": [{String: "TestAction1"}, {String: "TestAction2"}],
											"com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions#TestSemanticObject1": []
										}
									]
								};
							},
							getPath: function() {
								return "MetaContextPath";
							}
						};
					}
				};
			}
		};
		var oExpectedSemanticObjects = {
			"SemanticObject": ["TestAction1", "TestAction2"],
			"TestSemanticObject": []
		};

		// Action
		Util.retrieveSemanticObjectUnavailableActions(sPropertyName, oODataModelMock, undefined).then(function(oResult) {
			// Assert
			assert.deepEqual(oResult, oExpectedSemanticObjects, "Correct Object returned when there are SemanticObjectUnavailableActions");
			done();
		});

	});

	QUnit.test("navigate", function(assert) {
		var done = assert.async();
		var sBaseUrl = window.location.href;

		var fnCheckWindowUrl = function() {
			window.removeEventListener('hashchange', fnCheckWindowUrl);
			var oResultUrl = window.location.href;
			assert.equal(oResultUrl, sBaseUrl + "#DummyLink", "Navigation happened without FLP");
			done();
		};

		window.addEventListener('hashchange', fnCheckWindowUrl);
		Util.navigate(sBaseUrl + "#DummyLink");
	});

	QUnit.test("_getEntityTypeAnnotationOfProperty", function(assert) {
		var done = assert.async(13);

		var fnCheckFunction = function(sPropertyName, oODataModel, sBindingPath, vExpectedResult, sMessage) {
			Util._getEntityTypeAnnotationOfProperty(sPropertyName, oODataModel, sBindingPath).then(function(vResult) {
				// Assert
				assert.deepEqual(vResult, vExpectedResult, sMessage);
				done();
			});
		};

		// Action
		fnCheckFunction(undefined, undefined, undefined, null, "Null returned when sPropertyName = undefined");
		fnCheckFunction(null, undefined, undefined, null, "Null returned when sPropertyName = null");
		fnCheckFunction("", undefined, undefined, null, "Null returned when sPropertyName = ''");

		// Arrange
		var sPropertyName = "Category";

		// Action
		fnCheckFunction(sPropertyName, undefined, undefined, null, "Null returned when oODataModel = undefined");
		fnCheckFunction(sPropertyName, null, undefined, null, "Null returned when oODataModel = null");
		fnCheckFunction(sPropertyName, "", undefined, null, "Null returned when oODataModel = ''");

		// Arrange
		var oODataModelMock = {
			getMetaModel: function() {
				return undefined;
			}
		};

		// Action
		fnCheckFunction(sPropertyName, oODataModelMock, undefined, null, "Null returned when oODataModel#getMetaModel returns undefined");

		// Arrange
		oODataModelMock = {
			getMetaModel: function() {
				return {
					loaded: function() {
						return Promise.resolve();
					},
					getMetaContext: function() {
						throw new Error("This is an intended QUnit test error!");
					}
				};
			}
		};

		// Action
		fnCheckFunction(sPropertyName, oODataModelMock, undefined, null, "Null returned when oODataModel#getMetaModel#getMetaContext throws an error");

		// Arrange
		oODataModelMock = {
			getMetaModel: function() {
				return {
					loaded: function() {
						return Promise.resolve();
					},
					getMetaContext: function() {
						return undefined;
					}
				};
			}
		};

		// Action
		fnCheckFunction(sPropertyName, oODataModelMock, undefined, null, "Null returned when oODataModel#getMetaModel#getMetaContext returns undefined");

		// Arrange
		oODataModelMock = {
			getMetaModel: function() {
				return {
					loaded: function() {
						return Promise.resolve();
					},
					getMetaContext: function() {
						return null;
					}
				};
			}
		};

		// Action
		fnCheckFunction(sPropertyName, oODataModelMock, undefined, null, "Null returned when oODataModel#getMetaModel#getMetaContext returns null");

		// Arrange
		oODataModelMock = {
			getMetaModel: function() {
				return {
					loaded: function() {
						return Promise.resolve();
					},
					getMetaContext: function(sBindingPath) {
						if (sBindingPath == "NoFittingPropertyBindingPath") {
							return {
								getProperty: function(sPath) {
									return {
										property: [
											{ name: "PropertyName" }
										]
									};
								},
								getPath: function() {
									return "MetaContextPath";
								}
							};
						} else if (sBindingPath == "ViableBindingPath") {
							return {
								getProperty: function(sPath) {
									return {
										property: [
											{ name: sPropertyName }
										]
									};
								},
								getPath: function() {
									return "MetaContextPath";
								}
							};
						}
						return {
							getProperty: function(sPath) {
								return {
									property: undefined
								};
							},
							getPath: function() {
								return "MetaContextPath";
							}
						};
					}
				};
			}
		};

		// Action
		fnCheckFunction(sPropertyName, oODataModelMock, "", null, "Null returned when oMetaContext#getProperty returns undefined property value");

		// Action
		fnCheckFunction(sPropertyName, oODataModelMock, "NoFittingPropertyBindingPath", null, "Null returned when oMetaContext#getProperty returns no fitting property values");

		// Action
		fnCheckFunction(sPropertyName, oODataModelMock, "ViableBindingPath", [{ name: sPropertyName }], "Null returned when oMetaContext#getProperty returns no fitting property values");
	});

	QUnit.test("_getSemanticObjectsOfProperty", function(assert) {
		var oProperty = {};
		var oExpectedSemanticObjects = {};

		assert.deepEqual(Util._getSemanticObjectsOfProperty(null), oExpectedSemanticObjects, "Correct SemanticObjects returned when oProperty = null");
		assert.deepEqual(Util._getSemanticObjectsOfProperty(""), oExpectedSemanticObjects, "Correct SemanticObjects returned when oProperty = ''");
		assert.deepEqual(Util._getSemanticObjectsOfProperty(undefined), oExpectedSemanticObjects, "Correct SemanticObjects returned when oProperty = undefined");
		assert.deepEqual(Util._getSemanticObjectsOfProperty(oProperty), oExpectedSemanticObjects, "Correct SemanticObjects returned when there are no SemanticObjects in oProperty");

		oProperty = {
			"com.sap.vocabularies.Common.v1.SemanticObject": {String: 'SemanticObject'},
			"com.sap.vocabularies.Common.v1.SemanticObject#TestSemanticObject1": {String: 'TestSemanticObject'},
			"com.sap.vocabularies.Common.v1.SemanticObject#TestSemanticObject2": {String: ''},
			"com.sap.vocabularies.Common.v1.SemanticObject#TestSemanticObject3": {String: undefined},
			"com.sap.vocabularies.Common.v1.SemanticObject#TestSemanticObject4": {String: null}
		};
		oExpectedSemanticObjects = {
			"": {
				name: "SemanticObject",
				mapping: undefined
			},
			"TestSemanticObject1": {
				name: "TestSemanticObject",
				mapping: undefined
			},
			"TestSemanticObject2": {
				name: "",
				mapping: undefined
			},
			"TestSemanticObject3": {
				name: undefined,
				mapping: undefined
			},
			"TestSemanticObject4": {
				name: null,
				mapping: undefined
			}
		};

		assert.deepEqual(Util._getSemanticObjectsOfProperty(oProperty), oExpectedSemanticObjects, "Correct SemanticObjects returned when there are SemanticObjects in oProperty");
	});

	QUnit.test("_getSemanticObjectMappingsOfProperty", function(assert) {
		var oProperty = {};
		var oExpectedSemanticObjects = {
			"": {
				mapping: undefined,
				name: "applicationUnderTest_SemanticObjectCategory"
			},
			"TestSemanticObject": {
				mapping: undefined,
				name: "TestSemanticObject"
			}
		};
		var oSemanticObjects = {
			"": {
				mapping: undefined,
				name: "applicationUnderTest_SemanticObjectCategory"
			},
			"TestSemanticObject": {
				mapping: undefined,
				name: "TestSemanticObject"
			}
		};

		// Check for false / default oProperty values
		assert.deepEqual(Util._getSemanticObjectMappingsOfProperty(null, oSemanticObjects), oExpectedSemanticObjects, "Correct SemanticObjects returned when oProperty = null");
		assert.deepEqual(Util._getSemanticObjectMappingsOfProperty("", oSemanticObjects), oExpectedSemanticObjects, "Correct SemanticObjects returned when oProperty = ''");
		assert.deepEqual(Util._getSemanticObjectMappingsOfProperty(undefined, oSemanticObjects), oExpectedSemanticObjects, "Correct SemanticObjects returned when oProperty = undefined");
		assert.deepEqual(Util._getSemanticObjectMappingsOfProperty(oProperty, oSemanticObjects), oExpectedSemanticObjects, "Correct SemanticObjects returned when there are no mappings in oProperty");


		oExpectedSemanticObjects[""].mapping = {};
		oExpectedSemanticObjects["TestSemanticObject"].mapping = {};
		oProperty = {
			"com.sap.vocabularies.Common.v1.SemanticObjectMapping": null,
			"com.sap.vocabularies.Common.v1.SemanticObjectMapping#TestSemanticObject": undefined
		};
		assert.deepEqual(Util._getSemanticObjectMappingsOfProperty(oProperty, oSemanticObjects), oExpectedSemanticObjects, "Correct SemanticObjects returned when there are no mappings in oProperty");

		oProperty = {
			"com.sap.vocabularies.Common.v1.SemanticObjectMapping": [
				{
					LocalProperty: {
						PropertyPath: "LocalPropertyPath"
					},
					SemanticObjectProperty: {
						String: "SemanticObjectPropertyString"
					}
				}
			],
			"com.sap.vocabularies.Common.v1.SemanticObjectMapping#TestSemanticObject": []
		};
		oExpectedSemanticObjects[""].mapping = {
			"LocalPropertyPath": "SemanticObjectPropertyString"
		};

		assert.deepEqual(Util._getSemanticObjectMappingsOfProperty(oProperty, oSemanticObjects), oExpectedSemanticObjects, "Correct SemanticObjects returned when there are mappings in oProperty");
	});

	QUnit.test("_getSemanticObjectUnavailableActionsOfProperty", function(assert) {
		var oProperty = {};
		var oExpectedSemanticObjects = {
			"": {
				mapping: undefined,
				name: "applicationUnderTest_SemanticObjectCategory"
			},
			"TestSemanticObject": {
				mapping: undefined,
				name: "TestSemanticObject"
			}
		};
		var oSemanticObjects = {
			"": {
				mapping: undefined,
				name: "applicationUnderTest_SemanticObjectCategory"
			},
			"TestSemanticObject": {
				mapping: undefined,
				name: "TestSemanticObject"
			}
		};

		// Check for false / default oProperty values
		assert.deepEqual(Util._getSemanticObjectUnavailableActionsOfProperty(null, oSemanticObjects), oExpectedSemanticObjects, "Correct SemanticObjects returned when oProperty = null");
		assert.deepEqual(Util._getSemanticObjectUnavailableActionsOfProperty("", oSemanticObjects), oExpectedSemanticObjects, "Correct SemanticObjects returned when oProperty = ''");
		assert.deepEqual(Util._getSemanticObjectUnavailableActionsOfProperty(undefined, oSemanticObjects), oExpectedSemanticObjects, "Correct SemanticObjects returned when oProperty = undefined");
		assert.deepEqual(Util._getSemanticObjectUnavailableActionsOfProperty(oProperty, oSemanticObjects), oExpectedSemanticObjects, "Correct SemanticObjects returned when there are no unavailable actions in oProperty");

		oProperty = {
			"com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions": [{String: "TestAction1"}, {String: "TestAction2"}],
			"com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions#TestSemanticObject": []
		};

		oExpectedSemanticObjects[""].unavailableActions = [ "TestAction1", "TestAction2" ];
		oExpectedSemanticObjects["TestSemanticObject"].unavailableActions = [];

		assert.deepEqual(Util._getSemanticObjectUnavailableActionsOfProperty(oProperty, oSemanticObjects), oExpectedSemanticObjects, "Correct SemanticObjects returned when there are unavailable actions in oProperty");

		oExpectedSemanticObjects[""].unavailableActions = [];
		oProperty["com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions"] = null;
		oProperty["com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions#TestSemanticObject"] = undefined;

		assert.deepEqual(Util._getSemanticObjectUnavailableActionsOfProperty(oProperty, oSemanticObjects), oExpectedSemanticObjects, "Correct SemanticObjects returned when there is a SemanticObjectUnavailableActions annotation with null and undefined as value");
	});

	QUnit.start();
});
