/**
 * tests for the sap.suite.ui.generic.template.lib.CRUDManager
 */

sap.ui.define(["testUtils/sinonEnhanced",
	"sap/suite/ui/generic/template/genericUtilities/CacheHelper",
	"sap/suite/ui/generic/template/genericUtilities/testableHelper",
	"sap/suite/ui/generic/template/lib/MessageUtils",
	"sap/suite/ui/generic/template/lib/CRUDHelper",
	"sap/suite/ui/generic/template/lib/CRUDManager",
	"sap/ui/generic/app/util/ActionUtil",
	"sap/ui/model/odata/v2/ODataModel"],
	function(sinon, CacheHelper, testableHelper, MessageUtils, CRUDHelper, CRUDManager, ActionUtil, ODataModel) {
	"use strict";

	var oController = {};
	var oCommonUtils = {
		getText: function() {
			return "";
		}
	};
	var oComponentUtils = {
		isDraftEnabled: function() {
			return true;
		},
		getCurrentKeys: function() {
			return [""];
		},
		preloadComponent: function() {
			return Promise.resolve();
		},
		getViewLevel: function(){
			return 0;
		}
	};
	var oBusyHelper = {
		setBusy: Function.prototype,
		isBusy: function(){
			return false;
		}
	};
	var oServices = {
		oDraftController: {},
		oApplication: {
			mustRequireRequestsCanonical: function(){
				return true;
			},
			registerContext: function() {
				return true;
			},
			setNextFocus: Function.prototype,
			getComponentUtilsIfLoaded: Function.prototype,
			preloadComponent: function () {
				return Promise.resolve();
			}
		}
	};
	var sandbox, oStubForPrivate;
	var oCRUDManager;
	var oModel = sinon.createStubInstance(ODataModel);
	this.oMetaModel = {
		loaded: function () {
			return {
				then: function (fnThen) {}
			};
		}
	};
	oModel.getMetaModel.returns(this.oMetaModel);

	QUnit.module("lib.CRUDManager-addEntry", {
		beforeEach: function() {
			sandbox = sinon.sandbox.create();
			oStubForPrivate = testableHelper.startTest();
			oCRUDManager = new CRUDManager(oController, oComponentUtils, oServices, oCommonUtils, oBusyHelper);
		},
		afterEach: function() {
			testableHelper.endTest();
			sandbox.restore();
		}
	});

	QUnit.test("Add Entry - draft case", function(assert) {
		// preparation
		var oTable = {
			getEntitySet: Function.prototype,
			getModel: function() {
				return { };
			}
		};
		sandbox.stub(oController, "getOwnerComponent", function() {
			return {
				getEntitySet: Function.prototype,
				getCreationEntitySet: function() {
					return false;
				},
				getMetadata:function(){
					return {
						getName: function() {
							return "sap.suite.ui.generic.template.ListReport.Component"
						}
					}
				},
				getAppComponent: function(){
					return {
						getId: function() {
							return "";
						} 
					}
				}
			};
		});
		sandbox.stub(oController, "getView", function() {
			return {
				getBindingContext: Function.prototype,
				getModel: function(){
					return {
					 	metadataLoaded: function() {
							return Promise.resolve();
						},
						annotationsLoaded: function() {
							return Promise.resolve();
						},
						getMetaModel: function() {
							return {
								getODataEntityContainer : function() {
									return Promise.resolve()
								}
							}
						}   
					}
				}
			};
		});
		sandbox.stub(oServices.oDraftController, "getDraftContext", function() {
			return {
				isDraftEnabled: function() {
					return true;
				},
				getODataDraftFunctionImportName: function(){
					return undefined;
				}
			};
		});
		sandbox.stub(oServices.oApplication, "getBusyHelper", function(){
			return {setBusy: Function.prototype};
		});
		sandbox.stub(oServices.oApplication, "markCurrentDraftAsModified", function(){
			return true;
		});
		var sPath = "/SalesOrder(123)";
		var oContext = {
			getPath: function () {
				return sPath;
			},
			getModel: function () {
				return oModel;
			}
		};
		sandbox.stub(oServices.oDraftController, "createNewDraftEntity", function() {
			return new Promise(function(resolve) {
				resolve({
					context: oContext
				});
			});
		});
		sandbox.stub(oComponentUtils, "getSettings", function(){
			return {};
		});

		var done = assert.async(); // provides a done function to signal the test framework, that all checks are done
		setTimeout(function() {

			// execution
			var oResult = oCRUDManager.addEntry(oTable);

			// check
			assert.ok(oResult instanceof Promise, "returned a Promise");

			oResult.then(function(result) {
				assert.ok(true, "...that is resolved");
				assert.equal(result, oContext, "providing new Context...");
				done();
			}, function() {
				assert.notOk(true, "...that is rejected");
				done();
			});
		});
	});

	QUnit.test("Add Entry - draft case - Content-ID referencing", function (assert) {
		// preparation
		var oTable = {
			getEntitySet: Function.prototype,
			getModel: function () {
				return {};
			}
		};

		sandbox.stub(oController, "getOwnerComponent", function () {
			return {
				getEntitySet: Function.prototype,
				getCreationEntitySet: function () {
					return false;
				},
				getMetadata: function () {
					return {
						getName: function () {
							return "sap.suite.ui.generic.template.ListReport.Component"
						}
					}
				},
				getAppComponent: function () {
					return {
						getId: function () {
							return "";
						}
					}
				}
			};
		});
		sandbox.stub(oController, "getView", function () {
			return {
				getBindingContext: Function.prototype,
				getModel: function () {
					return {
						metadataLoaded: function () {
							return Promise.resolve();
						},
						annotationsLoaded: function () {
							return Promise.resolve();
						},
						getMetaModel: function () {
							return {
								getODataEntityContainer: function () {
									return ({
										"Org.OData.Capabilities.V1.BatchSupport": {
											"ReferencesAcrossChangeSetsSupported": {
												"Bool": "true"
											}
										}
									})
								}
							}
						}
					}
				}
			};
		});
		sandbox.stub(oServices.oDraftController, "getDraftContext", function () {
			return {
				isDraftEnabled: function () {
					return true;
				},
				getODataDraftFunctionImportName: function () {
					return undefined;
				}
			};
		});
		sandbox.stub(oServices.oApplication, "getBusyHelper", function () {
			return { setBusy: Function.prototype };
		});
		sandbox.stub(oServices.oApplication, "markCurrentDraftAsModified", function () {
			return true;
		});

		var sPath = "/SalesOrderItem(12345)";
		var oContext = {
			getPath: function () {
				return sPath;
			},
			getModel: function () {
				return oModel;
			}
		};
		sandbox.stub(oServices.oDraftController, "createNewDraftEntity", function () {
			return new Promise(function (resolve) {
				resolve({
					context: oContext
				});
			});
		});
		sandbox.stub(oComponentUtils, "getSettings", function () {
			return {};
		});

		sandbox.stub(CacheHelper, "getInfoForContentIdPromise", function() {
			return Promise.resolve({
				contentIdRequestPossible: true,
                parametersForContentIdRequest: {
                	sRootExpand : "to_dummyContext1,to_dummyContext2"
				}
			});
		});

		var oSpy_CRUDHelper_edit = sandbox.spy(CRUDHelper, "create");

		var done = assert.async(); // provides a done function to signal the test framework, that all checks are done
		var oResult = oCRUDManager.addEntry(oTable);

		oResult.then(function (result) {
			assert.equal("to_dummyContext1,to_dummyContext2",oSpy_CRUDHelper_edit.getCall(0).args[6].sRootExpand, "Expand params are passed");
			done();
		}, function (result) {
			assert.notOk(true, "...that is rejected");
			done();
		});
	});


	QUnit.test("Add Entry - draft case - negativ test", function(assert) {
		// preparation
		var oTable = {
			getEntitySet: Function.prototype,
			getModel: function() {
				return {};
			}
		};
		sandbox.stub(oController, "getOwnerComponent", function() {
			return {
				getEntitySet: Function.prototype,
				getCreationEntitySet: function() {
					return false;
				},
				getMetadata:function(){
					return {
						getName: function() {
							return "sap.suite.ui.generic.template.ListReport.Component"
						}
					}
				},
				getAppComponent: function(){
					return {
						getId: function() {
							return "";
						} 
					}
				}
			};
		});
		sandbox.stub(oController, "getView", function() {
			return {
				getBindingContext: Function.prototype,
				getModel: function(){
					return {
					 	metadataLoaded: function() {
							return Promise.resolve();
						},
						annotationsLoaded: function() {
							return Promise.resolve();
					    },
					   getMetaModel: function() {
						   return {
							   getODataEntityContainer : function() {
								   return Promise.resolve()
							   }
						   }
					   }
					}
				}
			};
		});
		sandbox.stub(oServices.oDraftController, "getDraftContext", function() {
			return {
				isDraftEnabled: function() {
					return true;
				},
				getODataDraftFunctionImportName: function(){
					return undefined;
				}
			};
		});
		var oErrorFromDC = {};
		sandbox.stub(oServices.oDraftController, "createNewDraftEntity", function() {
			return new Promise(function(resolve, reject) {
//			negativ test: backend returns unsuccessful
				reject(oErrorFromDC);
			});
		});
		sandbox.stub(oServices.oApplication, "getBusyHelper", function(){
			return {setBusy: Function.prototype};
		});
		sandbox.stub(oComponentUtils, "getSettings", function(){
			return {};
		})
		var oErrorFromHandleError = {};
		sandbox.stub(oStubForPrivate, "handleError", function(sOperation, reject){
			reject(oErrorFromHandleError);
		});

		var done = assert.async(); // provides a done function to signal the test framework, that all checks are done
		setTimeout(function() {

			// execution
			var oResult = oCRUDManager.addEntry(oTable);

			// check
			assert.ok(oResult instanceof Promise, "returned a Promise");

			oResult.then(function(result) {
				assert.notOk(true, "...that is resolved");
				done();
			}, function() {
				assert.ok(true, "...that is rejected");
				assert.ok(oStubForPrivate.handleError.calledOnce, "handleError was called");
				assert.equal(oStubForPrivate.handleError.args[0][0],MessageUtils.operations.addEntry, "with operation addEntry");
				assert.equal(oStubForPrivate.handleError.args[0][2],oErrorFromDC, "and the error as returned from DraftController");
				done();
			});
		});
	});

	QUnit.test("Add Entry - draft case - negativ test 2", function(assert) {
		// stubbing only MessageUtils.handleError, but not (private) CRUDManager.handleError
		// preparation
		var oTable = {
			getEntitySet: Function.prototype,
			getModel: function() {
				return {};
			}
		};
		sandbox.stub(oController, "getOwnerComponent", function() {
			return {
				getEntitySet: Function.prototype,
				getCreationEntitySet: function() {
					return false;
				},
				getMetadata:function(){
					return {
						getName: function() {
							return "sap.suite.ui.generic.template.ListReport.Component"
						}
					}
				},
				getAppComponent: function(){
					return {
						getId: function() {
							return "";
						} 
					}
				}
			};
		});
		sandbox.stub(oController, "getView", function() {
			return {
				getBindingContext: Function.prototype,
				getModel: function(){
					return {
					 	metadataLoaded: function() {
							return Promise.resolve();	 
						},
						annotationsLoaded: function() {
							return Promise.resolve();
					    },
					   getMetaModel: function() {
						   return {
							   getODataEntityContainer : function() {
								   return Promise.resolve()
							   }
						   }
					   }
					}
				}
			};
		});
		var oErrorFromCRUDHelper = undefined;
		sandbox.stub(CRUDHelper, "create", function() {
//			negativ test: backend returns unsuccessful
			return Promise.reject(oErrorFromCRUDHelper);
		});

		sandbox.stub(MessageUtils, "handleError", Function.prototype);
		sandbox.stub(oServices.oApplication, "getBusyHelper", function(){
			return {setBusy: Function.prototype};
		});
		sandbox.stub(oServices.oDraftController, "getDraftContext", function() {
			return {
				getODataDraftFunctionImportName: function(){
					return undefined;
				}
			};
		});
		sandbox.stub(oComponentUtils, "getSettings", function(){
			return {};
		});
		var done = assert.async(); // provides a done function to signal the test framework, that all checks are done
		setTimeout(function() {

			// execution
			var oResult = oCRUDManager.addEntry(oTable);

			// check
			assert.ok(oResult instanceof Promise, "returned a Promise");

			oResult.then(function() {
				assert.notOk(true, "...that is resolved");
				done();
			}, function(error) {
				assert.ok(true, "...that is rejected");
				assert.equal(error, oErrorFromCRUDHelper, "...and the error as returned from CRUDHelper");
				done();
			});
		});
	});
});
