/*global QUnit, sinon */
/*eslint no-unused-vars: 1 */
sap.ui.define([
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/generic/app/transaction/TransactionController",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/odata/v2/Context"
], function(
	ODataModelV2,
	TransactionController,
	MockServer,
	ContextV2
) {
	"use strict";

	var sServiceUri = "/SalesOrderSrv/";
	var sDataRootPath = "test-resources/sap/ui/generic/app/qunit/testdata/SalesOrder/";

	MockServer.config({
		autoRespondAfter: 100
	});
	var oMockServer = new MockServer({
		rootUri: sServiceUri
	});

	function initServer() {
		oMockServer.simulate("test-resources/sap/ui/generic/app/qunit/testdata/SalesOrder/metadata.xml", sDataRootPath);
		oMockServer.start();
	}

	function stopServer() {
		oMockServer.stop();
	}

	function initModel(mParameters) {
		return new ODataModelV2(sServiceUri, mParameters);
	}

	function removeSharedMetadata() {
		var sURI = sServiceUri.replace(/\/$/, "");
		if (ODataModelV2.mServiceData &&
			ODataModelV2.mServiceData[sURI]) {
			delete ODataModelV2.mServiceData[sURI].oMetadata;
		}
	}

	/*  TESTS */
	QUnit.module("sap.ui.generic.app.transaction.TransactionController w v2 Model", {
		beforeEach: function () {
			initServer();
		},
		afterEach: function () {
			this.oModel.destroy();
			this.oModel = undefined;
			removeSharedMetadata();
			stopServer();
		}
	});


	QUnit.test("deleteEntity with Context -> real Entity (no Draft)", function (assert) {
		var done = assert.async();
		var oModel = this.oModel = initModel();

		oModel.getObject = function () {
			var oEntity = {};
			oEntity.IsActiveEntity = true
			return oEntity;
		}


		var oTransactionController = new TransactionController(oModel);
		var oContext;

		oModel.read("/ProductSet('AD-1000')", {
			success: function () {
				//Create a Binding Context
				oContext = oModel.createBindingContext("/ProductSet('AD-1000')");

				oTransactionController.deleteEntity(oContext, null).then(function (oResult) {
					assert.ok(oResult.httpResponse.statusCode == "204", "HTTP Result Code as expected");
					oModel.read("/ProductSet('AD-1000')", {
						success: function (data) {
							assert.ok(false, "Entity still can be read from model. Shouldn't be there.");
							oTransactionController.destroy();
							done();
						},
						error: function (err) {
							assert.ok(true, "Entity cannot be read from model anymore - as expected.");
							oTransactionController.destroy();
							done();
						}
					});
				}, function (oResponse) {
					assert.ok(false, "Error Handler of TransactionController called - deletion error.");
					oTransactionController.destroy();
					done();
				});
			},
			error: function () {
				assert.ok(false, "Error Handler of Model.read() called - reading entity failed.");
				done();
			}
		});
	});

	QUnit.test("deleteEntity with Path -> real Entity (no Draft)", function (assert) {
		var done = assert.async();
		var oModel = this.oModel = initModel();
		oModel.getObject = function () {
			var oEntity = {};
			oEntity.IsActiveEntity = true
			return oEntity;
		}
		var oTransactionController = new TransactionController(oModel);
		var sPath = "/ProductSet('AD-1000')";

		oTransactionController.deleteEntity(sPath, null).then(function (oResult) {
			//assert.ok(oResult.context, "Context is there in oResult");
			assert.ok(oResult.httpResponse.statusCode == "204", "HTTP Result Code as expected");
			oModel.read("/ProductSet('AD-1000')", {
				success: function (data) {
					assert.ok(false, "Entity still can be read from model. Shouldn't be there.");
					oTransactionController.destroy();
					done();
				},
				error: function (err) {
					assert.ok(true, "Entity cannot be read from model anymore - as expected.");
					oTransactionController.destroy();
					done();
				}
			});
		}, function (oResponse) {
			assert.ok(false, "Error Handler of TransactionController called - deletion error.");
			oTransactionController.destroy();
			done();
		});
	});


	QUnit.test("deleteEntities with Contexts -> real Entities (no Draft)", function (assert) {
		var done = assert.async();
		var oModel = this.oModel = initModel();
		oModel.callFunction = function (p1, p2) {
			return p2.success({
				"mockresponse": false
			});
		};

		oModel.getMetaModel = function () {
			return {
				getODataEntitySet: sinon.stub().returns({
					entityType: "namespace.EntityTypeName",
					name: "MockSet",
					"com.sap.vocabularies.Common.v1.DraftNode": {
						"EditAction": {
							"String": "DiscardAction"
						}
					}
				}),
				getODataFunctionImport: function () {
					return {
						parameter: {}
					};
				},
				getODataEntityType: function () {
					return {
						key: {
							propertyRef: []
						}
					};
				}
			};
		};

		var oTransactionController = new TransactionController(oModel);
		var nDoneCounter = 0;
		var nReadCounter = 0;
		var aContexts = [];

		var fnDoneCountUp = function () {
			nDoneCounter++;
			if (nDoneCounter >= aContexts.length) {
				done();
			}
		};

		var fnReadData = function () {
			oModel.read("/ProductSet('HT-1002')", {
				success: fnGoWest
			});
			oModel.read("/ProductSet('HT-1010')", {
				success: fnGoWest
			});
			oModel.read("/ProductSet('HT-1020')", {
				success: fnGoWest
			});
		};

		var fnGoWest = function () {
			nReadCounter++;
			if (nReadCounter >= 3) {
				aContexts.push(oModel.createBindingContext("/ProductSet('HT-1002')"));
				aContexts.push(oModel.createBindingContext("/ProductSet('HT-1010')"));
				aContexts.push(oModel.createBindingContext("/ProductSet('HT-1020')"));
				//GO GO GO
				fnTestLogic();
			}
		};

		var fnTestLogic = function () {
			oTransactionController.deleteEntities(aContexts, null).then(function (aResults) {
				assert.ok(aResults[0].context && aResults[1].context && aResults[2].context, "Contexts are there in aResults");
				assert.ok(aResults[0].response.statusCode == "204" &&
					aResults[1].response.statusCode == "204" &&
					aResults[2].response.statusCode == "204", "HTTP Result Codes as expected");
				oModel.read("/ProductSet('HT-1002')", {
					success: function (data) {
						assert.ok(false, "Entity HT-1002 still can be read from model. Shouldn't be there.");
						oTransactionController.destroy();
						fnDoneCountUp();
					},
					error: function (err) {
						assert.ok(true, "Entity HT-1002 cannot be read from model anymore - as expected.");
						oTransactionController.destroy();
						fnDoneCountUp();
					}
				});
				oModel.read("/ProductSet('HT-1010')", {
					success: function (data) {
						assert.ok(false, "Entity HT-1010 still can be read from model. Shouldn't be there.");
						oTransactionController.destroy();
						fnDoneCountUp();
					},
					error: function (err) {
						assert.ok(true, "Entity HT-1010 cannot be read from model anymore - as expected.");
						oTransactionController.destroy();
						fnDoneCountUp();
					}
				});
				oModel.read("/ProductSet('HT-1020')", {
					success: function (data) {
						assert.ok(false, "Entity HT-1020 still can be read from model. Shouldn't be there.");
						oTransactionController.destroy();
						fnDoneCountUp();
					},
					error: function (err) {
						assert.ok(true, "Entity HT-1020 cannot be read from model anymore - as expected.");
						oTransactionController.destroy();
						fnDoneCountUp();
					}
				});
			}, function (oResponse) {
				assert.ok(false, "Error Handler of TransactionController called - deletion error.");
				oTransactionController.destroy();
				done();
			});
		};
		oModel.metadataLoaded().then(fnReadData);
	});


	QUnit.test("deleteEntities with Paths -> real Entities (no Draft)", function (assert) {
		var done = assert.async();
		var oModel = this.oModel = initModel();
		var oTransactionController = new TransactionController(oModel);
		var nDoneCounter = 0;
		var aPaths = [];

		var fnDoneCountUp = function () {
			nDoneCounter++;
			if (nDoneCounter >= aPaths.length) {
				done();
			}
		};

		aPaths.push("/ProductSet('HT-1002')");
		aPaths.push("/ProductSet('HT-1010')");
		aPaths.push("/ProductSet('HT-1020')");

		var fnTestLogic = function () {
			oTransactionController.deleteEntities(aPaths, null).then(function (aResults) {
				assert.ok(aResults[0].context && aResults[1].context && aResults[2].context, "Contexts are there in aResults");
				assert.ok(aResults[0].response.statusCode == "204" &&
					aResults[1].response.statusCode == "204" &&
					aResults[2].response.statusCode == "204", "HTTP Result Codes as expected");
				oModel.read("/ProductSet('HT-1002')", {
					success: function (data) {
						assert.ok(false, "Entity HT-1002 still can be read from model. Shouldn't be there.");
						oTransactionController.destroy();
						fnDoneCountUp();
					},
					error: function (err) {
						assert.ok(true, "Entity HT-1002 cannot be read from model anymore - as expected.");
						oTransactionController.destroy();
						fnDoneCountUp();
					}
				});
				oModel.read("/ProductSet('HT-1010')", {
					success: function (data) {
						assert.ok(false, "Entity HT-1010 still can be read from model. Shouldn't be there.");
						oTransactionController.destroy();
						fnDoneCountUp();
					},
					error: function (err) {
						assert.ok(true, "Entity HT-1010 cannot be read from model anymore - as expected.");
						oTransactionController.destroy();
						fnDoneCountUp();
					}
				});
				oModel.read("/ProductSet('HT-1020')", {
					success: function (data) {
						assert.ok(false, "Entity HT-1020 still can be read from model. Shouldn't be there.");
						oTransactionController.destroy();
						fnDoneCountUp();
					},
					error: function (err) {
						assert.ok(true, "Entity HT-1020 cannot be read from model anymore - as expected.");
						oTransactionController.destroy();
						fnDoneCountUp();
					}
				});
			}, function (oResponse) {
				assert.ok(false, "Error Handler of TransactionController called - deletion error.");
				oTransactionController.destroy();
				done();
			});
		};
		oModel.metadataLoaded().then(fnTestLogic);
	});

	QUnit.test("deleteEntities running into Error - 1 of 2 is failing", function (assert) {
		var done = assert.async();
		var oModel = this.oModel = initModel();
		var oTransactionController = new TransactionController(oModel);
		var nDoneCounter = 0;
		var aPaths = [];

		var fnDoneCountUp = function () {
			nDoneCounter++;
			if (nDoneCounter >= aPaths.length) {
				done();
			}
		};

		aPaths.push("/ProductSet('XX-1002')");
		aPaths.push("/ProductSet('XX-1000')");

		var fnTestLogic = function () {
			oTransactionController.deleteEntities(aPaths, null).then(function (aResults) {
				assert.ok(false);
				oTransactionController.destroy();
				done();
			}, function (oResponse) {
				assert.ok(true);
				oTransactionController.destroy();
				done();
			});
		};
		oModel.metadataLoaded().then(fnTestLogic);
	});


	QUnit.test("deleteEntity with wrong Path -> real Entity (no Draft)", function (assert) {
		var done = assert.async();
		var oModel = this.oModel = initModel();
		var oTransactionController = new TransactionController(oModel);
		var sPath = "/ProductSet('AD-10004711')";

		oTransactionController.deleteEntity(sPath, null).then(function (oResult) {
			assert.ok(false, "SuccessHandler call is not expected; deleteEntity should fail.");
			done();
		}, function (oResponse) {
			assert.ok(true, "Error Handler of TransactionController called - as expected.");
			//assert.ok(oResult.response.statusCode == "204", "HTTP Result Code as expected");
			oTransactionController.destroy();
			done();
		});

	});

	QUnit.module("sap.ui.generic.app.transaction.TransactionController", {
		beforeEach: function () {
			this.oModel = sinon.createStubInstance(ODataModelV2);
			this.oModel.getMetaModel = sinon.stub().returns({});
			this.oModel.setDeferredGroups = function () {};
			this.oModel.setChangeGroups = function () {};
			this.oTransactionController = new TransactionController(this.oModel);
		},
		afterEach: function () {
			this.oTransactionController.destroy();
		}
	});

	QUnit.test("Shall be instantiable", function (assert) {
		assert.ok(this.oTransactionController);
	});

	QUnit.test("resetChanges shall invoke odata model resetChanges", function (assert) {
		var bReset = false;

		this.oModel.resetChanges = function () {
			bReset = true;
		};
		this.oTransactionController.resetChanges(["/MockSet(1)"]);
		assert.ok(bReset);
	});

	QUnit.test("editEntity on active document", function (assert) {
		var done = assert.async();
		var oTransactionController, oModel, oContext;

		oModel = sinon.createStubInstance(ODataModelV2);
		oModel.setDeferredGroups = function () {};
		oModel.hasPendingChanges = sinon.stub().returns(false);
		oModel.setChangeGroups = function () {};
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType: "namespace.EntityTypeName",
				name: "MockSet",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"PreparationAction": {
						"String": true
					},
					"EditAction": {
						"String": "/MockEditAction"
					}
				}
			}),
			getODataEntityType: sinon.stub().returns({
				key: {
					propertyRef: []
				}
			}),
			getODataFunctionImport: sinon.stub().returns({
				"entitySet": "dummySet",
				"parameter": []
			})
		});
		oModel.bUseBatch = true;
		oModel.callFunction = function (p1, p2) {
			this.mDeferredRequests = {
				"Changes": {
					"requests": [],
					"changes": []
				}
			};
			p2.success({
				"mockdata": true
			}, {
				"mockresponse": true
			});
		};
		oModel.submitChanges = function (p1, p2) {
			return p1.success({
				"mockdata": true
			}, {
				"mockresponse": true
			});
		};
		oModel.submitChangesWithChangeHeaders = function (p1, p2) {
			return p1.success({
				"mockdata": true
			}, {
				"mockresponse": true
			});
		};
		oModel.getKey = function () {
			return "/MockKey(1)";
		};
		oModel.getContext = function () {
			return {
				"path": "/MockKey(1)",
				getObject: function () {
					return {
						IsActiveEntity: false,
						HasActiveEntity: false,
						HasDraftEntity: false
					};
				}
			};
		};

		oTransactionController = new TransactionController(oModel);
		oContext = {
			name: "mockContext",
			getObject: function () {
				return {
					IsActiveEntity: true
				};
			},
			getPath: function () {
				return "/MockSet(1)";
			},
			getModel: function () {
				return oModel;
			}
		};

		oTransactionController.editEntity(oContext).then(function (oResult) {
			assert.ok(oResult.context);
			oTransactionController.destroy();
			done();
		}, function (oResult) {
			assert.ok(false);
			oTransactionController.destroy();
			done();
		});
	});

	QUnit.test("editEntity shall fail", function (assert) {
		var done = assert.async();
		var oTransactionController, oModel, oContext, bAction = false,
			bSubmit = false;

		oModel = sinon.createStubInstance(ODataModelV2);
		oModel.setDeferredGroups = function () {};
		oModel.setChangeGroups = function () {};
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType: "namespace.EntityTypeName",
				name: "MockSet",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"EditAction": {
						"String": "/dummyFunc"
					}
				}
			}),
			getODataEntityType: sinon.stub().returns({
				key: {
					propertyRef: []
				}
			}),
			getODataFunctionImport: sinon.stub().returns({
				"entitySet": "dummySet",
				"parameter": []
			})
		});
		oModel.callFunction = function (p1, p2) {
			bAction = true;
			return p2.error({
				"message": true
			});
		};
		oModel.submitChanges = function (p1, p2) {
			bSubmit = true;
			return p2.error({
				"message": true
			});
		};
		oTransactionController = new TransactionController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function () {
				return {
					IsActiveEntity: true
				};
			},
			getPath: function () {
				return "/MockSet(1)";
			},
			getModel: function () {
				return oModel;
			}
		};

		oTransactionController.editEntity(oContext).then(function (oResult) {
			assert.ok(false);
			oTransactionController.destroy();
			done();
		}, function (oResult) {
			assert.ok(oResult.response.message);
			oTransactionController.destroy();
			done();
		});
	});

	QUnit.test("editEntity on active document", function (assert) {
		var done = assert.async();
		var oTransactionController, oModel, oContext;

		oModel = sinon.createStubInstance(ODataModelV2);
		oModel.setDeferredGroups = function () {};
		oModel.setChangeGroups = function () {};
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			name: "MockKey",
			getODataEntitySet: sinon.stub().returns({
				entityType: "namespace.EntityTypeName",
				name: "MockKey",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"EditAction": {
						"String": "/MockEditAction"
					}
				}
			}),
			getODataEntityType: sinon.stub().returns({
				key: {
					propertyRef: []
				}
			}),
			getODataFunctionImport: sinon.stub().returns({
				"entitySet": "dummySet",
				"parameter": []
			})
		});
		oModel.bUseBatch = true;
		oModel.callFunction = function (p1, p2) {
			this.mDeferredRequests = {
				"Changes": {
					"requests": [],
					"changes": []
				}
			};
			p2.success({
				"mockdata": true
			}, {
				"mockresponse": true
			});
		};
		oModel.submitChanges = function (p1, p2) {
			return p1.success({
				"mockdata": true
			}, {
				"mockresponse": true
			});
		};
		oModel.submitChangesWithChangeHeaders = function (p1, p2) {
			return p1.success({
				"mockdata": true
			}, {
				"mockresponse": true
			});
		};
		oModel.getKey = function () {
			return "/MockKey(1)";
		};
		oModel.getContext = function () {
			return {
				"path": "/MockKey(1)",
				getObject: function () {
					return {
						IsActiveEntity: false,
						HasActiveEntity: false,
						HasDraftEntity: false
					};
				}
			};
		};

		oTransactionController = new TransactionController(oModel);
		oContext = {
			name: "mockContext",
			getObject: function () {
				return {
					IsActiveEntity: true
				};
			},
			getPath: function () {
				return "/MockSet(1)";
			},
			getModel: function () {
				return oModel;
			}
		};

		oTransactionController.editEntity(oContext).then(function (oResult) {
			assert.ok(oResult.context);
			oTransactionController.destroy();
			done();
		}, function (oResult) {
			assert.ok(false);
			oTransactionController.destroy();
			done();
		});
	});

	QUnit.test("editEntity on non-active document", function (assert) {
		var done = assert.async();
		var oTransactionController, oModel, oContext;

		oModel = sinon.createStubInstance(ODataModelV2);
		oModel.setDeferredGroups = function () {};
		oModel.setChangeGroups = function () {};
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType: "namespace.EntityTypeName",
				name: "MockSet",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"EditAction": {
						"String": "/MockEditAction"
					}
				}
			}),
			getODataEntityType: sinon.stub().returns({
				key: {
					propertyRef: []
				}
			}),
			getODataFunctionImport: sinon.stub().returns({
				"entitySet": "dummySet",
				"parameter": []
			})
		});
		oModel.callFunction = function (p1, p2) {
			p2.success({
				"mockdata": true
			}, {
				"mockresponse": true
			});
		};
		oModel.submitChanges = function (p1, p2) {
			return p1.success({
				"mockdata": true
			}, {
				"mockresponse": true
			});
		};
		oModel.submitChangesWithChangeHeaders = function (p1, p2) {
			return p1.success({
				"mockdata": true
			}, {
				"mockresponse": true
			});
		};
		oModel.getKey = function () {
			return "/MockKey(1)";
		};
		oModel.getContext = function () {
			return {
				"path": "/MockKey(1)",
				getObject: function () {
					return {
						IsActiveEntity: false,
						HasActiveEntity: false,
						HasDraftEntity: false
					};
				}
			};
		};

		oTransactionController = new TransactionController(oModel);
		oContext = {
			name: "mockContext",
			getObject: function () {
				return {
					IsActiveEntity: false
				};
			},
			getPath: function () {
				return "/MockSet(1)";
			},
			getModel: function () {
				return oModel;
			}
		};

		oTransactionController.editEntity(oContext).then(function (oResult) {
			assert.ok(oResult.context);
			oTransactionController.destroy();
			done();
		}, function (oResult) {
			assert.ok(false);
			oTransactionController.destroy();
			done();
		});
	});

	var prepareModelForTestDeleteEntity = function () {
		window._bRemove = false;
		window._bSubmit = false;
		var oModel;
		oModel = sinon.createStubInstance(ODataModelV2);
		oModel.bUseBatch = true;
		oModel.setDeferredGroups = function () {};
		oModel.setChangeGroups = function () {};
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType: "namespace.EntityTypeName",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"PreparationAction": {
						"String": "/dummyFunc"
					}
				}
			}),
			getODataEntityType: sinon.stub().returns({
				key: {
					propertyRef: []
				}
			}),
			getODataFunctionImport: sinon.stub().returns({
				"entitySet": "dummySet",
				"parameter": []
			})
		});
		oModel.remove = function (p1, p2) {
			this.mDeferredRequests = {
				"Changes": {
					"requests": [],
					"changes": {
						"Changes": [{
							request: {
								"Foo": "Bar"
							}
						}]
					}
				}
			};
			window._bRemove = true;
			return p2.success({
				"mockresponse": true
			});
		};
		oModel.submitChanges = function (p1, p2) {
			window._bSubmit = true;
			return p1.success({
				"mockresponse": true
			});
		};
		oModel.submitChangesWithChangeHeaders = function (p1, p2) {
			window._bSubmit = true;
			return p1.success({
				"mockresponse": true
			});
		};
		oModel.getKey = function () {
			return "/MockKey(1)";
		};
		oModel.getContext = function () {
			return {
				"path": "/MockKey(1)",
				getObject: function () {
					return {
						IsActiveEntity: false,
						HasActiveEntity: false,
						HasDraftEntity: false
					};
				}
			};
		};

		oModel.getObject = function () {
			var oEntity = {};
			oEntity.IsActiveEntity = true
			return oEntity;
		};

		return oModel;
	};

	QUnit.test("deleteEntity with Context", function (assert) {
		var done = assert.async();
		var oTransactionController, oContext;

		var oModel = prepareModelForTestDeleteEntity();



		oTransactionController = new TransactionController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function () {
				return {
					IsActiveEntity: true
				};
			},
			getPath: function () {
				return "/MockSet(1)";
			}
		};

		oTransactionController.deleteEntity(oContext, null).then(function (oResult) {
			//assert.ok(oResult.context);
			assert.ok(oResult.responseData);
			assert.ok(window._bSubmit);
			assert.ok(window._bRemove);
			oTransactionController.destroy();
			done();
		}, function (oResponse) {
			assert.ok(false);
			oTransactionController.destroy();
			done();
		});
	});

	QUnit.test("deleteEntity with Path", function (assert) {
		var done = assert.async();
		var oTransactionController, oContext;

		var oModel = prepareModelForTestDeleteEntity();

		oTransactionController = new TransactionController(oModel);

		var path = "/MockSet(1)";

		oTransactionController.deleteEntity(path, null).then(function (oResult) {
			//assert.ok(oResult.context);
			assert.ok(oResult.responseData);
			assert.ok(window._bSubmit);
			assert.ok(window._bRemove);
			oTransactionController.destroy();
			done();
		}, function (oResponse) {
			assert.ok(false);
			oTransactionController.destroy();
			done();
		});
	});

	QUnit.test("deleteEntity shall fail", function (assert) {
		var done = assert.async();
		var oTransactionController, oModel, oContext, bRemove = false,
			bSubmit = false;

		oModel = sinon.createStubInstance(ODataModelV2);
		oModel.setDeferredGroups = function () {};
		oModel.setChangeGroups = function () {};
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType: "namespace.EntityTypeName",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"PreparationAction": {
						"String": "/dummyFunc"
					}
				}
			}),
			getODataEntityType: sinon.stub().returns({
				key: {
					propertyRef: []
				}
			}),
			getODataFunctionImport: sinon.stub().returns({
				"entitySet": "dummySet",
				"parameter": []
			})
		});
		oModel.remove = function (p1, p2) {
			bRemove = true;
			return p2.error({
				"message": true
			});
		};
		oModel.submitChanges = function (p1, p2) {
			bSubmit = true;
			return p1.error({
				"message": true
			});
		};
		oModel.submitChangesWithChangeHeaders = function (p1, p2) {
			bSubmit = true;
			return p1.error({
				"message": true
			});
		};
		oModel.getKey = function () {
			return "/MockKey(1)";
		};
		oModel.getContext = function () {
			return {
				"path": "/MockKey(1)",
				getObject: function () {
					return {
						IsActiveEntity: false,
						HasActiveEntity: false,
						HasDraftEntity: false
					};
				}
			};
		};

		oTransactionController = new TransactionController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function () {
				return {
					IsActiveEntity: true
				};
			},
			getPath: function () {
				return "/MockSet(1)";
			}
		};

		oTransactionController.deleteEntity(oContext, null).then(function (oResult) {
			assert.ok(false);
			oTransactionController.destroy();
			done();
		}, function (oResponse) {
			assert.ok(oResponse.message);
			oTransactionController.destroy();
			done();
		});
	});

	QUnit.test("Function getDefaultValues - with no oContext", function (assert) {
		var oTransactionController, oContext = null,
			oPredefinedValue = null;
		var oModel = sinon.createStubInstance(ODataModelV2);
		oTransactionController = new TransactionController(oModel);
		assert.throws(
			function () {
				oTransactionController.getDefaultValues(oContext, oPredefinedValue)
			},
			'Error no context'
		);
	});

	QUnit.test("Function getDefaultValues - with no sEntitySet", function (assert) {
		var oTransactionController, oContext = null,
			oPredefinedValue = null;
		var oModel = sinon.createStubInstance(ODataModelV2);
		oTransactionController = new TransactionController(oModel);
		assert.throws(
			function () {
				oTransactionController.getDefaultValues(oContext, oPredefinedValue)
			},
			'Error no entityset'
		);
	});

	QUnit.test("Function getDefaultValues - with oContext and with sEntitySet", function (assert) {
		var oTransactionController, oPredefinedValue = {
			id: "1"
		};
		var oContext = {
			sPath: "/MockPath(1)",
			getModel: function () {}
		};
		var oModel = sinon.createStubInstance(ODataModelV2);
		oTransactionController = new TransactionController(oModel);
		var oResult = {
			id: "1",
			name: "test"
		};
		var stubGetDefaultValues = sinon.stub(oTransactionController, "getDefaultValues");
		stubGetDefaultValues.withArgs(oContext, oPredefinedValue).returns(oResult);
		var oActualResult = oTransactionController.getDefaultValues(oContext, oPredefinedValue);
		assert.deepEqual(oActualResult, oResult);
	});

	QUnit.test("Function getDefaultValues - with navigation property", function (assert) {
		var oRootEntitySet = {
			name: "SalesOrder",
			entityType: "namespace.SalesOrderType"
		};

		var oRootEntityType = {
			name: "namespace.SalesOrderType",
			key: {
				propertyRef: []
			},
			property: [
				{name: "SalesOrderId"}
			],
			navigationProperty: [
				{
					name: "to_SalesOrderItem",
					"com.sap.vocabularies.Common.v1.DefaultValuesFunction": {
						String: "GetDefaultSalesOrderItemValues"
					}
				}
			]
		};

		var oSalesOrderItemEntitySet = {
			name: "SalesOrderItem",
			entityType: "namespace.SalesOrderItemType"
		}

		var oSalesOrderItemEntityType = {
			name: "namespace.SalesOrderItemType",
			property: [
				{name: "SalesOrderItemId"}
			],
			navigationProperty: [
				{
					name: "to_ScheduleLine",
					"com.sap.vocabularies.Common.v1.DefaultValuesFunction": {
						String: "GetDefaultScheduleLineValues"
					}
				}
			]
		};

		var oFunctionImport = {
			name: "GetDefaultSalesOrderItemValues"
		};

		var oModel = initModel();
		var oMetaModel = oModel.getMetaModel();
		var sPath = "/SalesOrder('10001')";
		var oContext = new ContextV2(sPath);
		var aContexts = [oContext];
		var oTransactionController = new TransactionController(oModel);
		
		// Stubs on model
		var oStubCallFunction = sinon.stub(oModel, "callFunction").returns(Promise.resolve({}));
		var oStubGetETag = sinon.stub(oModel, "getETag").returns(null);
		// Stubs on context
		var oStubGetContextModel = sinon.stub(oContext, "getModel").returns(oModel);
		var oStubGetContextPath = sinon.stub(oContext, "getPath").returns(sPath);
		var oStubGetContextObject = sinon.stub(oContext, "getObject").returns({});
		// Stubs on MetaModel
		var oStubGetODataEntitySet = sinon.stub(oMetaModel, "getODataEntitySet");
		oStubGetODataEntitySet.withArgs(oRootEntitySet.name).returns(oRootEntitySet);
		oStubGetODataEntitySet.withArgs(oSalesOrderItemEntitySet.name).returns(oSalesOrderItemEntitySet);

		var oStubGetODataEntityType = sinon.stub(oMetaModel, "getODataEntityType");
		oStubGetODataEntityType.withArgs(oRootEntityType.name).returns(oRootEntityType);
		oStubGetODataEntityType.withArgs(oSalesOrderItemEntityType.name).returns(oSalesOrderItemEntityType);

		var oStubGetODataAssociationEnd = sinon.stub(oMetaModel, "getODataAssociationEnd");
		oStubGetODataAssociationEnd.withArgs(oRootEntityType, "to_SalesOrderItem").returns({type: "namespace.SalesOrderItemType"});

		var oStubGetODataFunctionImport = sinon.stub(oMetaModel, "getODataFunctionImport").returns(oFunctionImport);
		//Invoke 'getDefaultValues' with correct navigation property and making sure that the function import is called
		var sNavigationProperty = "to_SalesOrderItem";
		oTransactionController.getDefaultValues(aContexts, null, sNavigationProperty);

		assert.ok(oStubCallFunction.calledOnce, "Model.callFunction is invoked once");
		assert.equal(oStubCallFunction.firstCall.args[0], "/GetDefaultSalesOrderItemValues", "The function import is invoked");

		oStubCallFunction.restore();
		oStubGetETag.restore();
		oStubGetContextModel.restore();
		oStubGetContextPath.restore();
		oStubGetContextObject.restore();
		oStubGetODataEntitySet.restore();
		oStubGetODataEntityType.restore();
		oStubGetODataAssociationEnd.restore();
		oStubGetODataFunctionImport.restore();
	});

	QUnit.test("Function getDefaultValues - with nested navigation property (to_SalesOrderItem/to_ScheduleLine)", function (assert) {
		// Root entity type (Level 1)
		var oRootEntitySet = {
			name: "SalesOrder",
			entityType: "namespace.SalesOrderType"
		};

		var oRootEntityType = {
			name: "namespace.SalesOrderType",
			key: {
				propertyRef: []
			},
			property: [
				{name: "SalesOrderId"}
			],
			navigationProperty: [
				{
					name: "to_SalesOrderItem"
				}
			]
		};

		// Intermediate entity type (Level 2)
		var oSalesOrderItemEntitySet = {
			name: "SalesOrderItem",
			entityType: "namespace.SalesOrderItemType"
		}

		var oSalesOrderItemEntityType = {
			name: "namespace.SalesOrderItemType",
			key: {
				propertyRef: []
			},
			property: [
				{name: "SalesOrderItemId"}
			],
			navigationProperty: [
				{
					name: "to_ScheduleLine",
					"com.sap.vocabularies.Common.v1.DefaultValuesFunction": {
						String: "GetDefaultScheduleLineValues"
					}
				}
			]
		};

		// Leaf entity type (Level 3)
		var oScheduleLineEntitySet = {
			name: "ScheduleLine",
			entityType: "namespace.ScheduleLineType"
		};

		var oScheduleLineEntityType = {
			name: "namespace.ScheduleLineType",
			key: {
				propertyRef: []
			},
			property: [
				{name: "ScheduleLineId"}
			],
			navigationProperty: []
		}

		var oFunctionImport = {
			name: "GetDefaultScheduleLineValues"
		};

		var oModel = initModel();
		var oMetaModel = oModel.getMetaModel();
		var sSalesOrderPath = "/SalesOrder('10001')";
		var oSalesOrderContext = new ContextV2(sSalesOrderPath);
		var aContexts = [oSalesOrderContext];

		var sSalesOrderItemPath = "/SalesOrderItem('20001')";
		var oSalesOrderItemContext = new ContextV2(sSalesOrderItemPath);
		var oTransactionController = new TransactionController(oModel);
		
		// Stubs on model
		var oStubCallFunction = sinon.stub(oModel, "callFunction").returns(Promise.resolve({}));
		var oStubGetETag = sinon.stub(oModel, "getETag").returns(null);
		var oStubCreateBindingContext = sinon.stub(oModel, "createBindingContext").withArgs("to_SalesOrderItem", oSalesOrderContext).returns(oSalesOrderItemContext);
		// Stubs on sales order context
		var oStubSalesOrderContextGetModel = sinon.stub(oSalesOrderContext, "getModel").returns(oModel);
		var oStubSalesOrderContextGetPath = sinon.stub(oSalesOrderContext, "getPath").returns(sSalesOrderPath);
		var oStubSalesOrderContextGetObject = sinon.stub(oSalesOrderContext, "getObject").returns({});
		// Stubs on sales order item context
		var oStubSalesOrderItemContextGetModel = sinon.stub(oSalesOrderItemContext, "getModel").returns(oModel);
		var oStubSalesOrderItemContextGetPath = sinon.stub(oSalesOrderItemContext, "getPath").returns(sSalesOrderItemPath);
		var oStubSalesOrderItemContextGetObject = sinon.stub(oSalesOrderItemContext, "getObject").returns({});

		// Stubs for "getODataEntitySet"
		var oStubGetODataEntitySet = sinon.stub(oMetaModel, "getODataEntitySet");
		oStubGetODataEntitySet.withArgs(oRootEntitySet.name).returns(oRootEntitySet);
		oStubGetODataEntitySet.withArgs(oSalesOrderItemEntitySet.name).returns(oSalesOrderItemEntitySet);
		oStubGetODataEntitySet.withArgs(oScheduleLineEntitySet.name).returns(oScheduleLineEntitySet);
		// Stubs for "getODataEntityType"
		var oStubGetODataEntityType = sinon.stub(oMetaModel, "getODataEntityType");
		oStubGetODataEntityType.withArgs(oRootEntityType.name).returns(oRootEntityType);
		oStubGetODataEntityType.withArgs(oSalesOrderItemEntityType.name).returns(oSalesOrderItemEntityType);
		oStubGetODataEntityType.withArgs(oScheduleLineEntityType.name).returns(oScheduleLineEntityType);
		// Stubs for "getODataAssociationEnd"
		var oStubGetODataAssociationEnd = sinon.stub(oMetaModel, "getODataAssociationEnd");
		oStubGetODataAssociationEnd.withArgs(oRootEntityType, "to_SalesOrderItem").returns({type: "namespace.SalesOrderItemType", multiplicity: "1"});
		oStubGetODataAssociationEnd.withArgs(oSalesOrderItemEntityType, "to_ScheduleLine").returns({type: "namespace.ScheduleLineType"});

		var oStubGetODataFunctionImport = sinon.stub(oMetaModel, "getODataFunctionImport").returns(oFunctionImport);
		//Invoke 'getDefaultValues' with the nested navigation property and making sure that the function import is called
		var sNavigationProperty = "to_SalesOrderItem/to_ScheduleLine";
		oTransactionController.getDefaultValues(aContexts, null, sNavigationProperty);

		assert.ok(oStubCallFunction.calledOnce, "Model.callFunction is invoked once");
		assert.equal(oStubCallFunction.firstCall.args[0], "/GetDefaultScheduleLineValues", "The function import is invoked");

		oStubCallFunction.restore();
		oStubGetETag.restore();
		oStubSalesOrderContextGetModel.restore();
		oStubSalesOrderContextGetPath.restore();
		oStubSalesOrderContextGetObject.restore();
		oStubSalesOrderItemContextGetModel.restore();
		oStubSalesOrderItemContextGetPath.restore();
		oStubSalesOrderItemContextGetObject.restore();
		oStubGetODataEntitySet.restore();
		oStubGetODataEntityType.restore();
		oStubGetODataAssociationEnd.restore();
		oStubGetODataFunctionImport.restore();
	});

	QUnit.test("Function getDefaultValues - after _callAction execute triggerSubmitChanges", function(assert) {
    // prepare
    var done = assert.async();
    var oModel = initModel(),
		  oMetaModel = oModel.getMetaModel(),
		  sPath = "/SalesOrder('10001')",
		  oContext = new ContextV2(sPath),
		  aContexts = [oContext],
		  oTransactionController = new TransactionController(oModel);

    var oRootEntitySet = {
        name: "SalesOrder",
        entityType: "namespace.SalesOrderType",
        "com.sap.vocabularies.Common.v1.DefaultValuesFunction": {
          String: "GetDefaultValuesFunction"
        }
      },
      oRootEntityType = {
        name: "namespace.SalesOrderType",
        property: [{name: "value01"}, {name: "value02"}],
        key: {
          propertyRef: []
        }
      },
      oFunctionImport = {
        name: "GetDefaultSalesOrderItemValues"
      };
    // Stubs on model
		var oStubCallFunction = sinon.stub(oModel, "callFunction").returns(Promise.resolve({})),
      oStubHasPendingChanges = sinon.stub(oModel, "hasPendingChanges").returns(false)
    
    // Stubs on context
		var oStubGetContextModel = sinon.stub(oContext, "getModel").returns(oModel),
		  oStubGetContextPath = sinon.stub(oContext, "getPath").returns(sPath),
      oStubGetContextObject = sinon.stub(oContext, "getObject").returns({});

    // Stubs on MetaModel
		var oStubGetODataEntitySet = sinon.stub(oMetaModel, "getODataEntitySet");
		oStubGetODataEntitySet.withArgs(oRootEntitySet.name).returns(oRootEntitySet);
		// oStubGetODataEntitySet.withArgs(oSalesOrderItemEntitySet.name).returns(oSalesOrderItemEntitySet);

    var oStubGetODataEntityType = sinon.stub(oMetaModel, "getODataEntityType");
		oStubGetODataEntityType.withArgs(oRootEntityType.name).returns(oRootEntityType);

    var oStubGetODataFunctionImport = sinon.stub(oMetaModel, "getODataFunctionImport").returns(oFunctionImport);

    // execute
    var oPromise = oTransactionController.getDefaultValues(aContexts, {});

    // assert
    assert.ok(oStubCallFunction.calledOnce, "Model.callFunction is invoked once");
    assert.equal(oStubCallFunction.firstCall.args[0], "/GetDefaultSalesOrderItemValues", "The function import is invoked");

    // trigger mCallBacks.success to execute code, that await promise release
    oStubCallFunction.firstCall.args[1].success({value01: "aaa", value02: "bbb"}, {statusCode: "200"});

    oPromise.then(function (oResult) {
      assert.deepEqual(oResult, {value01: "aaa", value02: "bbb"}, "successfully retrieved default data");
      assert.ok(oStubHasPendingChanges.calledOnce, "triggerSubmitChanges._submitChanges._checkSubmit.hasPendingChanges has been called");
      done();
      oTransactionController.destroy();
    });

    // restore stubs
    oStubCallFunction.restore();
    oStubGetContextModel.restore();
    oStubGetContextPath.restore();
    oStubGetContextObject.restore();
    oStubGetODataEntitySet.restore();
    oStubGetODataEntityType.restore();
    oStubGetODataFunctionImport.restore();
  });

	QUnit.test("Function getDefaultValuesFunction - send oEntitySet with default annotation ", function (assert) {
		var oTransactionController, oModel;
		oModel = sinon.createStubInstance(ODataModelV2);
		var oEntitySet = {
			name: "Root",
			"com.sap.vocabularies.Common.v1.DefaultValuesFunction": {
				String: "GetDefaultsForRoot"
			}
		};
		oTransactionController = new TransactionController(oModel);
		var sActualResult = oTransactionController.getDefaultValuesFunction(oEntitySet);
		var sExpectedResult = "GetDefaultsForRoot";
		assert.equal(sExpectedResult, sActualResult);
	});

	QUnit.test("Function getDefaultValuesFunction - send oEntitySet value having no default annotation ", function (assert) {
		var oTransactionController, oModel;
		oModel = sinon.createStubInstance(ODataModelV2);
		var oEntitySet = {
			name: "Root"
		};
		oTransactionController = new TransactionController(oModel);
		var sActualResult = oTransactionController.getDefaultValuesFunction(oEntitySet);
		var sExpectedResult = null;
		assert.equal(sExpectedResult, sActualResult);
	});

	QUnit.test("Shall be destructible", function (assert) {
		this.oTransactionController.destroy();
		assert.ok(this.oTransactionController);
		assert.equal(this.oTransactionController._oModel, null);
	});
});