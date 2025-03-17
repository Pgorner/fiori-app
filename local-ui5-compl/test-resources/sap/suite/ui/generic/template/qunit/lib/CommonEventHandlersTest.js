/**
 * tests for the sap.suite.ui.generic.template.lib.CommonEventHandlers
 */

sap.ui.define(
		[
			"sap/ui/comp/smarttable/SmartTable",
			"sap/m/Table",
			"sap/ui/table/AnalyticalTable",
			"sap/m/MessageBox",
			"sap/ui/base/Event",
			"sap/ui/model/json/JSONModel",
		 	"testUtils/sinonEnhanced",
			"sap/suite/ui/generic/template/genericUtilities/expressionHelper",
			"sap/suite/ui/generic/template/genericUtilities/controlHelper",
			"sap/suite/ui/generic/template/lib/CommonEventHandlers",
			"sap/ui/model/Context",
		 	"sap/ui/model/odata/v2/ODataModel",
			"sap/suite/ui/generic/template/genericUtilities/testableHelper",
			"sap/base/util/extend",
			"sap/ui/core/Fragment",
			"sap/suite/ui/generic/template/lib/CommonUtils"
		],
		 function(
			SmartTable,
			MTable,
			ATable,
			MessageBox,
			Event,
			JSONModel,
			sinon,
			expressionHelper,
			controlHelper,
			CommonEventHandlers,
			Context,
			ODataModel,
			testableHelper,
			extend,
			Fragment,
			CommonUtils
		) {
			"use strict";

			// sut
			var oCommonEventHandlers;

			var oComponentRefreshBehaviourParameterNotCalled = {}; // init of arguments of ComponentRefreshBehaviour

			// variables for spies
			var oNavigateFromListItemArguments;
			var bCRUDManagerCallActionCalled;
			var oNavigationHandlerNavigateArguments;
			var oNavigationHandlerMixAttributesArguments;
			var sNavigationParameters;
			var oNavigationHandler = {
					navigate: function() {
						oNavigationHandlerNavigateArguments = arguments;
					},
					mixAttributesAndSelectionVariant: function() {
						oNavigationHandlerMixAttributesArguments = arguments;
						return {
							toJSONString: function(){
								return sNavigationParameters;
							},
							getSelectOptionsPropertyNames: function(){return [];}
						};
					}
			};
			var oGetManifestEntryArguments;
			var oCommonUtilsGetTextArguments;

			// configuration of stubs
			var oOutbound; // outbound defined in manifest
			var sCrossNavigationOutbound; // Outbound defined in Manifest
			var aSelectedContexts = []; // selected context
			var oHeaderBindingContext = {
				getObject: function() { return [] },	 // header context for object page
				getPath: Function.prototype
			};
			var mModels;
			// preperation for all tests the same
			var oAppComponent = {
				getManifestEntry: function() {
					oGetManifestEntryArguments = arguments;
					var oOutbounds = {};
					oOutbounds[sCrossNavigationOutbound] = oOutbound;
					return {
						crossNavigation: {
							outbounds: oOutbounds
						}
					};
				},
				getConfig: function() {
					return {};
				}
			};
			var oController = {
					getMetadata: function () {
						return {
							getName :  function () { return ""; }
						};
					},
					getOwnerComponent: function() {
						return {
							getAppComponent: function() {
								return oAppComponent;
							},
							getModel: function(sName){
								var oModel = mModels[sName];
								if (!oModel){
									oModel = new JSONModel();
									mModels[sName] = oModel;
								}
								return oModel;
							},
							getEntitySet: function() {
								return "CDN_C_STTA_SO_WD_20";
							}
						};
					},
					getView: function() {
						return {
								getBindingContext: function() {
									return oHeaderBindingContext;
								},
								getModel: function(sModelName) {
									if(!sModelName) {
										return {
											hasPendingChanges: function() {
												return false;
											},
											getMetaModel: function() {
												return {
													getODataEntityType: function() {
														return {
															"com.sap.vocabularies.UI.v1.HeaderInfo": {
																Title: {
																	Value: {
																		Path: "SalesOrderItem"
																	}
																}
															},
															key: {
																propertyRef: ""
															}
														};
													},
													getODataEntitySet: function() {
														return {
															"Org.OData.Capabilities.V1.DeleteRestrictions": {
																Deletable: {
																	Path: "Delete_mc"
																}
															},
															entityType: "ProductType"
														};
													},
													getODataFunctionImport: function() {
														return {
															"sap:applicable-path":"Multimsg_ac"
														};
													}
												};
											},
											getObject: function(sPath) {
												var aObject = [
													{ Multimsg_ac: true, SalesOrder: "500000126", SalesOrderItem: "10" },
													{ Multimsg_ac: false, SalesOrder: "500000126", SalesOrderItem: "20" }
												];
												var oEntity = [{Delete_mc:true,HasActiveEntity:true,HasDraftEntity:false,IsActiveEntity:false}, {Delete_mc:true,HasActiveEntity:false,HasDraftEntity:false,IsActiveEntity:true}];
												var sItem = sPath.slice(sPath.indexOf("'") + 1 , sPath.lastIndexOf("'"));
												for (var key in aObject) {
													if (aObject[key].SalesOrderItem === sItem) {
														return aObject[key];
													}
												}
												var sActiveValue = sPath.slice(sPath.indexOf(",") + 1 , sPath.lastIndexOf(")"));
												if (sActiveValue === "IsActiveEntity=false") {
													return oEntity[0];
												} else if (sActiveValue === "IsActiveEntity=true") {
													return oEntity[1];
												}
											},
											read: function(path, mParameters) {
												return mParameters.success({sPath: "C_STTA_SalesOrder_WD_20(node_key=guid'00505691-2ec5-1eda-b3b0-8533c06215e8',IsActiveEntity=true)"});
											},
											getKey: function(oActiveData) {
												return oActiveData.sPath;
											},
											getProperty: function(sDeletablePath, selectedItem) {
												if (selectedItem.getPath().indexOf("IsActiveEntity=false") !== -1 &&  sDeletablePath) {
													return true;
												} else if (selectedItem.getPath().indexOf("IsActiveEntity=true") !== -1 && sDeletablePath) {
													if (selectedItem.sPath === "/C_STTA_SalesOrder_WD_20(node_key=guid'00505691-2ec5-1eea-ad8f-cd82cbcf4d66',IsActiveEntity=true)") {
														return true;
													}
													return false;
												}
												return true;
											},
											getContext: function(sPath) {
												return {
													sPath: sPath,
													sDeepPath: sPath,
													getPath: function() {
														return sPath;
													}
												};
											}
										};
									} else if(sModelName == "@i18n") {
										return {
											getResourceBundle: function() {
												return {};
											}
										}
									}
								},
								getId: function() {
									return "";
								}
						};
					},
					adaptNavigationParameterExtension: Function.prototype
			};

			// the smart table will have a sap.m.Table or a sap.ui.table.AnalyticalTable
			var oMTable = sinon.createStubInstance(MTable);
			oMTable.getMetadata.returns({
				getName: function () {
					return "sap.m.Table";
				}
			});

			var oATable = sinon.createStubInstance(ATable);
			oATable.getMetadata.returns({
				getName: function () {
					return "sap.ui.table.AnalyticalTable";
				}
			});
			oATable.getColumns.returns([]);
			oATable.getGroupedColumns.returns([]);

			var oSmartTable = sinon.createStubInstance(SmartTable);
			oSmartTable.getMetadata.returns({
				getName: function () {
					return "sap.ui.comp.smarttable.SmartTable";
				}
			});
			oSmartTable.data = function (sName) {
				if (sName) {
					return this.mTest.mCustomData[sName];
				}
				return this.mTest.mCustomData;
			};
			oSmartTable.getModel = function () {
				return {
					getMetaModel: function () {
						return {
							getODataEntitySet: function (sEntitySet) {
								return {
									entityType: "entityType"
								};
							},
							getODataEntityType: function () {
								return { };
							},
							getODataProperty: function (oEntityType, sProperty) {
								return oSmartTable.mTest.mMetadata[sProperty] || "";
							}
						};
					},
					getResourceBundle: function () {
						return {
							getText: function (sKey) {
								return (sKey === "YES") ? "Yes" : (sKey === "NO") ? "No" : null;
							}
						};
					}
				};
			};
			oSmartTable.getTable.returns(oMTable); // table of type sap.m.Table or sap.ui.AnalyticalTable
			oSmartTable.getCustomData.returns([]);
			oSmartTable.getEntitySet.returns("entityset");
			oSmartTable.mTest = {
				mMetadata: { },
				mCustomData: {
					dateFormatSettings: '{"UTC":true,"style":"medium"}' //or: '{"style":"medium"}'
				}
			};

			var sExternalChevronNavigationParameter, oComponentRefreshBehaviourParameter;

			var oPresentationControlHandler = {
				getBindingInfo: Function.prototype,
				getSelectedContexts: function() {
					return [];
				},
				getCurrentContexts: Function.prototype
			};

			 var oTemplateUtils = {
				 oCommonUtils: {
					 getDialogFragmentAsync: function (sName, oFragmentController, sModel, fnOnFragmentCreated) {
						 return new Promise(function (resolve, reject) {
							 Fragment.load({ id: oController.getView().getId(), name: sName, controller: oFragmentController, type: "XML" }).then(function name(oFragment) {
								 var oModel;
								 if (sModel) {
									 oModel = new JSONModel();
									 oFragment.setModel(oModel, sModel);
								 }
								 return oFragment;

							 });
						 });
					 },
					 getSelectedContexts: function (oControl) {
						 return aSelectedContexts;
					 },
					 getElementCustomData: function () {
						 return {
							 Action: "Test_Action",
							 SemanticObject: "Test_Semantic_Object"
						 };
					 },
					 getContentDensityClass: Function.prototype,
					 removePropertiesFromNavigationContext: function (oSelectionVariant) {
						 return oSelectionVariant;
					 },
					 setComponentRefreshBehaviour: function() {
						 oComponentRefreshBehaviourParameter = arguments;
					 },
					 setExternalChevronRefreshBehaviour: function (sEntitySet) {
						sExternalChevronNavigationParameter = sEntitySet;
					 },
					 getOwnerPresentationControl: Function.prototype,
					 getCustomDataFromEvent: Function.prototype,
					 handleError: Function.prototype
				 },
				 oComponentUtils: {
					 getViewLevel: function () {
						 return 1;
					 },
					 isDraftEnabled: function () {
						 return false;
					 }
				 },
				 oServices: {
					 oApplication: {
						 getBusyHelper: function () {
							 return {
								 isBusy: function () {
									 return false;
								 }
							 };
						 },
						 getNavigationProperty: function (sProperty) {
							 return null;
						 },
						 performAfterSideEffectExecution: function (fnFunction) {
							 fnFunction();
						 },
						 getCurrentKeys: function (iViewLevel) {
							 return [""];
						 },
						 getNavigationHandler: function () {
							 return oNavigationHandler;
						 },
						 getLeaveAppPromise: function () {
							 return new Promise(function () { });
						 },
						 navigateExternal: function(){
						 	oNavigationHandlerNavigateArguments = arguments;
						 }
					 },
					 oDraftController: {
						 getDraftContext: function () {
							 return {
								 isDraftEnabled: function () {
									 return false;
								 }
							 };
						 }
					 },
					 oDataLossHandler: {},
					 oViewDependencyHelper: {
						 setMeToDirty: Function.prototype
					 },
					 oPresentationControlHandlerFactory: {
						getPresentationControlHandler: function() {
							return oPresentationControlHandler;
						}
					}
				 }
			 };

			var sandbox;
			var oStubForPrivate;

			QUnit.module("lib.CommonEventHandlers", {
				beforeEach: function() {
					oStubForPrivate = testableHelper.startTest();
					sandbox = sinon.sandbox.create();
					oComponentRefreshBehaviourParameter = oComponentRefreshBehaviourParameterNotCalled;
					sandbox.stub(expressionHelper, "getAnnotationFormatter", function(oModel, sEntitySet, sAnnotation){
						return {
							format: function(oContext) {
								return "expression";
							},
							done: function() {
							}
						};
					});
					sandbox.stub(controlHelper, "isAnalyticalTable", function(oControl){
						return oControl === oATable;
					});
					mModels = Object.create(null);
					sandbox.stub(MessageBox, "error", function() {
						var Log = sap.ui.require("sap/base/Log");
						Log.debug("sap.m.MessageBox.error called... (replaced for test with Sinon Stub)");
					});

					oTemplateUtils.oCommonUtils.getText = function(sKey) {
						if (sKey === "ST_GENERIC_UNSAVED_CHANGES_CHECKBOX") {
							return "Also delete objects with unsaved changes.";
						} else if (sKey === "ST_GENERIC_NOT_DELETABLE") {
							return "This object cannot be deleted."
						} else if (sKey === "WARNING") {
							return "Warning";
						} else if (sKey === "ST_GENERIC_DELETE_UNDELETABLE") {
							return "1 of 2 objects cannot be deleted.";
						} else if (sKey === "ST_GENERIC_DELETE_REMAINING") {
							return "Do you still want to delete the remaining object?";
						} else if (sKey === "ST_STREAM_TYPE_MISMATCH") {
							return "Selected file type is not supported.";
						} else {
							oCommonUtilsGetTextArguments = arguments;
						}
					};
					oTemplateUtils.oCommonUtils.getOwnerControl = function(oSourceControl, bGetSmartControl) {
						var oCurrentControl = oSourceControl;
						while (oCurrentControl) {
							// Test for sap.m.Table
							if (!bGetSmartControl && oCurrentControl instanceof MTable) {
								return oCurrentControl;
							}
							// Get parent control until sap.m.Table is found
							if (oCurrentControl.getParent){
								oCurrentControl = oCurrentControl.getParent();
							} else {
								oSmartTable.getTable().getMode = function() {
									return "MultiSelect";
								};
								oSmartTable.getTable().getSelectionMode = function() {
									return "MultiToggle";
								};
								oSmartTable.getParent = function() {
									return {
										getEntitySet: function() {
											return "EntitySet";
										}
									};
								};


								return oSmartTable;
							}
						}
						return oSmartTable;
					};
					oTemplateUtils.oCommonUtils.fnProcessDataLossOrDraftDiscardConfirmation = function(resolve) {
						resolve();
					};
					oTemplateUtils.oServices.oDataLossHandler.performIfNoDataLoss = function(resolve) {
						resolve();
					};
					oTemplateUtils.oCommonUtils.navigateFromListItem = function() {
						oNavigateFromListItemArguments = arguments;
					};
					oTemplateUtils.oServices.oNavigationController = {};
					oTemplateUtils.oServices.oCRUDManager = {
						callAction: function() {
							bCRUDManagerCallActionCalled = true;

							return {
								then : Function.prototype
							};
						}
					};

					oCommonEventHandlers = new CommonEventHandlers(oController, oTemplateUtils.oComponentUtils,
							oTemplateUtils.oServices, oTemplateUtils.oCommonUtils);

					oController.getOwnerComponent().getModel().getMetaModel = function() {
						return {
							getMetaContext: function() {
								return {
									getObject: function() {
										return {
											property: []
										};
									}
								}
							}
						}
					};
				},
				afterEach: function() {
//					oMessageBoxStub.restore();
					sandbox.restore();
					testableHelper.endTest();
				}
			});

			QUnit.test("Dummy", function(assert) {
				assert.ok(true, "Test - Always Good!");
			});

			QUnit.test("Function onCallActionFromToolBar", function(assert) {
				var oEvent = sinon.createStubInstance(Event);

				oEvent.getSource.returns({
					getParent: function() {
						return {
							getParent: function() {
								return {
									getTable: Function.prototype
								};
							}
						};
					},
					data: function() {
						return { Action: "Entities/ProductTypeMultimsg", Label:"Transient Message" };
					}
				});
				sandbox.stub(controlHelper, "isButton", function(){
					return true;
				});
				sandbox.stub(oTemplateUtils.oCommonUtils, "getCustomDataFromEvent").returns(oEvent.getSource().data);

				/* ACTIONS THAT CALL FUNCTION IMPORT (UI.DataFieldForAction) */
				// NO ITEM SELECTED: supported
				bCRUDManagerCallActionCalled = false;
				aSelectedContexts = [];
				var oState = {};
				oCommonEventHandlers.onCallActionFromToolBar(oEvent, oState);

				assert.strictEqual(bCRUDManagerCallActionCalled, true, "NO ITEM SELECTED: supported; check that processing is allowed");

				// ONE ITEM SELECTED: supported
				bCRUDManagerCallActionCalled = false;
				aSelectedContexts.push({ getPath: function() { return "/ProductType(SalesOrderItem = '10')"; }, sPath:"/ProductType()", getProperty: function() { return "10"; }});
				var oState = {};
				oCommonEventHandlers.onCallActionFromToolBar(oEvent, oState);

				assert.strictEqual(bCRUDManagerCallActionCalled, true, "ONE ITEM SELECTED: supported; check that processing is allowed");

				// MULTIPLE ITEMS SELECTED: supported
				bCRUDManagerCallActionCalled = false;
				aSelectedContexts.push({ getPath: function() { return "/ProductType(SalesOrderItem = '20')"; }, sPath:"/ProductType()", getProperty: function() { return "20"; }});
				oCommonEventHandlers.onCallActionFromToolBar(oEvent, oState);

				assert.strictEqual(bCRUDManagerCallActionCalled, true, "MULTIPLE ITEMS SELECTED: function import actions on multiple instances --> not supported; check that processing is not allowed");

				/* ACTIONS THAT PERFORM NAVIGATION (UI.DataFieldForIntentBasedNavigation) */
				// NO ITEM SELECTED: supported
				oNavigationHandlerNavigateArguments = undefined;
				aSelectedContexts = [];
				oState = {
					oSmartFilterbar : {
						getEntitySet: function() {
							return "EntitySet";
						},
						getUiState: function() {
							return {
								getSelectionVariant: function() {
									return "selectionvariant";
								}
							};
						},
					},
					oSmartTable: {
						getEntitySet: function() {
							return "EntitySet";
						},
						getModel: function() {
							return "";
						}
					}
				};
				oCommonEventHandlers.onDataFieldForIntentBasedNavigation(oEvent, oState);

				assert.ok(oNavigationHandlerNavigateArguments, "NO ITEM SELECTED: supported; check that processing is allowed");

				// ONE ITEM SELECTED: supported
				oNavigationHandlerNavigateArguments = undefined;
				var oContext = new Context();
				oContext.oModel = new ODataModel("abc", {});
				oContext.sPath = "abc";
				aSelectedContexts.push(oContext);
				oCommonEventHandlers.onDataFieldForIntentBasedNavigation(oEvent, oState);

				assert.ok(oNavigationHandlerNavigateArguments, "ONE ITEM SELECTED: supported; check that processing is allowed");

				// MULTIPLE ITEMS SELECTED: navigation to multiple instances
				oNavigationHandlerNavigateArguments = undefined;
				aSelectedContexts.push(oContext);
				oState = {};
				oCommonEventHandlers.onDataFieldForIntentBasedNavigation(oEvent, oState);

				assert.ok(oNavigationHandlerNavigateArguments, "MULTIPLE ITEMS SELECTED: supported; check that processing is allowed");
			});

			QUnit.test("onListNavigate (chevron) -> Navigation to object page", function(assert) {
				// configure stubs
				aSelectedContexts = [];
				// prepare input
				var oContext = {};
				var oEventSource = {
						getParent: function() {
							return oMTable;
						},
						getBindingContext: function() {
							return oContext;
						},
						getId: Function.prototype,
						data: Function.prototype,
						getMetadata: function() {
							return {
								getName: Function.prototype
							}
						}
				};
				// initialize spies
				oNavigateFromListItemArguments = undefined;
				// execute
				var oState = {};
				sandbox.stub(oTemplateUtils.oComponentUtils, "setPaginatorInfo");
				oCommonEventHandlers.onListNavigate(oEventSource, oState);
				// check
				assert.equal(oNavigateFromListItemArguments.length, 2,
				"onListNavigate (chevron) -> navigate called with two parameters");
				assert.equal(oNavigateFromListItemArguments[0], oContext, "parameter is the given context");
			});

			QUnit.test("onListNavigate (Intent) (generic checks)", function(assert) {
				// configure stubs
				oOutbound = {
						semanticObject: "Test Semantic Object",
						action: "Test Action"
				};
				sCrossNavigationOutbound = "Test Outbound";
				// prepare input
				var oEventSource = {
						data: function() {
							return sCrossNavigationOutbound;
						},
						getBindingContext: function() {
							return {
								getObject: Function.prototype,
								getPath: Function.prototype
							};
						},
					    getParent: function() {
					    	return {
					    		getParent: function() {
					    			return {
					    				getTable: Function.prototype
					    			};
					    		}
					    	};
					    },
						getId: Function.prototype,
						getMetadata: function() {
							return {
								getName: Function.prototype
							}
						}
				};
				// initialize spies
				oNavigationHandlerNavigateArguments = undefined;
				oGetManifestEntryArguments = undefined;
				// execute
				var oState = {
				    oSmartFilterbar : {
				        getEntitySet: function() {
				        	return "EntitySet";
				        },
						getUiState: function() {
							return {
								getSelectionVariant: function() {
									return "selectionvariant";
								}
							};
						},
				    },
				    oSmartTable: {
				        getEntitySet: function() {
				        	return "EntitySet";
				        },
						getModel: function() {
							return "";
						}
				    }
				};
				oCommonEventHandlers.onListNavigate(oEventSource, oState);
				// check
				assert.equal(oNavigationHandlerNavigateArguments.length, 5,
				"onListNavigate -> navigation handler called with five parameters");

				assert.equal(oGetManifestEntryArguments.length, 1, "Get Manifest Entry called with one parameter");
				assert.equal(oGetManifestEntryArguments[0], "sap.app", "to read the manifest entry for sap.app");

				assert.equal(oNavigationHandlerNavigateArguments[0], oOutbound.semanticObject,
				"First parameter: semantic object defined in manifest");
				assert.equal(oNavigationHandlerNavigateArguments[1], oOutbound.action,
				"Second parameter: Action defined in manifest");

				assert.equal(typeof oNavigationHandlerNavigateArguments[4], "function",
				"Fifth parameter: A function to handle errors");
			});

			QUnit.test("onListNavigate (Intent) (ListReport specific)", function(assert) {
				// configure stubs
				oController.getOwnerComponent().getModel().getMetaModel = function() {
					return {
						getMetaContext: function() {
							return {
								getObject: function() {
									return {
										property: [{name: "lineAttribute"}]
									};
								}
							}
						}
					}
				};
				oOutbound = {
						semanticObject: "Test Semantic Object",
						action: "Test Action"
				};
				sCrossNavigationOutbound = "Test Outbound";
				sNavigationParameters = "test";
				// prepare input
				var oContextObject = {
						lineAttribute: "lineXYZ"
				};
				var sTableVariantId = "TableVariantID_4711";
				var oEventSource = {
						data: function() {
							return sCrossNavigationOutbound;
						},
						getBindingContext: function() {
							return {
								getObject: function() {
									return oContextObject;
								},
								getPath: Function.prototype
							};
						},
						getParent: function() {
							return {
								getParent: function() {
									return {
										getCurrentVariantId: function() {
											return sTableVariantId;
										}
									};
								}
							};
						},
						getId: Function.prototype,
						getMetadata: function() {
							return {
								getName: Function.prototype
							}
						}
				};
				var sSelectionVariant = "test";

				// initialize spies
				oNavigationHandlerNavigateArguments = undefined;
				oNavigationHandlerMixAttributesArguments = undefined;
				// execute
				var oState = {
					oSmartFilterbar : {
				        getEntitySet: function() {
				        	return "EntitySet";
				        },
						getUiState: function() {
							return {
								getSelectionVariant: function() {
									return "test";
								}
							};
						},
				    },
				    oSmartTable: {
				        getEntitySet: function() {
				        	return "EntitySet";
				        },
						getModel: function() {
							return "";
						}
				    }
				};

				oCommonEventHandlers.onListNavigate(oEventSource, oState);
				// check
				assert.equal(oNavigationHandlerMixAttributesArguments.length, 2, "MixAttributes called with 2 parameters");
				assert.deepEqual(oNavigationHandlerMixAttributesArguments[0], [oContextObject], "First parameter is equal to the context object");
				assert.equal(oNavigationHandlerMixAttributesArguments[1], sSelectionVariant, "Second is the selection variant");
				assert.equal(oNavigationHandlerNavigateArguments[2], sNavigationParameters, "Third parameter: Parameters for the target app - currently filled according to 'Gießkanne'");
				assert.equal(oNavigationHandlerNavigateArguments[3], null, "Forth parameter has a null object");
			});

			QUnit.test("onListNavigate (Intent) (ObjectPage specific)", function(assert) {
				// configure stubs
				oController.getOwnerComponent().getModel().getMetaModel = function() {
					return {
						getMetaContext: function() {
							return {
								getObject: function() {
									return {
										property: [{name: "lineAttribute"}, {name: "headerAttribute"}]
									};
								}
							}
						}
					}
				};
				oOutbound = {
						semanticObject: "Test Semantic Object",
						action: "Test Action"
				};
				sCrossNavigationOutbound = "Test Outbound";
				sandbox.stub(oHeaderBindingContext, "getObject", function(){return Object.freeze({headerAttribute: "headerABC"});}); // make sure, header context is not changed by sut!
				sNavigationParameters = "test";
				// prepare input
				var oContextObject = Object.freeze({lineAttribute: "lineXYZ"}); // make sure, context is not changed by sut!
				var oEventSource = {
						data: function() {
							return sCrossNavigationOutbound;
						},
						getBindingContext: function() {
							return {
								getObject: function() {
									return oContextObject;
								},
								getPath: Function.prototype
							};
						},
						getParent: function() {
							return {
								getParent: function() {
									return {
										getTable: Function.prototype
									};
								}
							};
						},
						getId: Function.prototype,
						getMetadata: function() {
							return {
								getName: Function.prototype
							}
						}
				};
				// initialize spies
				oNavigationHandlerNavigateArguments = undefined;
				oNavigationHandlerMixAttributesArguments = undefined;
				// execute
				var oState = {
					oSmartFilterbar : {
				        getEntitySet: function() {
				        	return "EntitySet";
				        },
						getUiState: function() {
							return {
								getSelectionVariant: function() {
									return "test";
								}
							};
						},
				    },
				    oSmartTable: {
				        getEntitySet: function() {
				        	return "EntitySet";
				        },
						getModel: function() {
							return "";
						}
				    }
				};
				oCommonEventHandlers.onListNavigate(oEventSource, oState);
				// check
				assert.equal(oNavigationHandlerNavigateArguments[2], sNavigationParameters, "Third parameter: Parameters for the target app");
				assert.deepEqual(oNavigationHandlerNavigateArguments[3], null, "Fourth parameter has to be a null object");
				assert.equal(oNavigationHandlerMixAttributesArguments.length, 2, "MixAttributes called with three parameters");
				var oMixedContextObject = {};
				extend(oMixedContextObject, oContextObject);
				extend(oMixedContextObject, oHeaderBindingContext.getObject());
				assert.deepEqual(oNavigationHandlerMixAttributesArguments[0], [oMixedContextObject], "First parameter: Context Object with properties of both, header and line");
				assert.equal(oNavigationHandlerMixAttributesArguments[1], "test", "Second parameter undefined");
			});

			QUnit.test("onListNavigate (Intent) (sap-keep-alive)", function(assert) {
				// configure stubs
				sExternalChevronNavigationParameter = "";
				oOutbound = {
						semanticObject: "Test Semantic Object",
						action: "Test Action"
				};
				sCrossNavigationOutbound = "Test Outbound";
				// prepare input
				var oEventSource = {
						data: function() {
							return sCrossNavigationOutbound;
						},
						getBindingContext: function() {
							return {
								getObject: Function.prototype,
								getPath: Function.prototype
							};
						},
					    getParent: function() {
					    	return {
					    		getParent: function() {
					    			return {
					    				getTable: Function.prototype
					    			};
					    		}
					    	};
					    },
						getId: Function.prototype,
						getMetadata: function() {
							return {
								getName: Function.prototype
							}
						}
				};
				// initialize spies
				oNavigationHandlerNavigateArguments = undefined;
				oGetManifestEntryArguments = undefined;
				// execute
				var oState = {
				    oSmartFilterbar : {
				        getEntitySet: function() {
				        	return "EntitySet";
				        },
						getUiState: function() {
							return {
								getSelectionVariant: function() {
									return "selectionvariant";
								}
							};
						},
				    },
				    oSmartTable: {
				        getEntitySet: function() {
				        	return "EntitySet";
				        },
						getModel: function() {
							return "";
						}
				    }
				};
				oCommonEventHandlers.onListNavigate(oEventSource, oState);
				assert.equal(sExternalChevronNavigationParameter, "entityset", "setExternalChevronRefreshBehaviour called with correct parameter");
				assert.strictEqual(oComponentRefreshBehaviourParameter, oComponentRefreshBehaviourParameterNotCalled, "setComponentRefreshBehaviour method is not called");
			});

			QUnit.test("addEntry (Intent)", function(assert) {
				// configure stubs
				aSelectedContexts = [];
				oOutbound = {
						semanticObject: "Test Semantic Object",
						action: "Test Action"
				};
				sCrossNavigationOutbound = "Test Outbound";
				sNavigationParameters = undefined;
				// prepare input
				var oEventSource = {
						getParent: function() {
							return {
								getParent: function() {
									return {
										getTable: Function.prototype
									};
								}
							};
						},
						getBindingContext: Function.prototype,
						data: function() {
							return sCrossNavigationOutbound;
						}
				};
				var oControls = {
					oSmartFilterbar : {
				    getEntitySet: function() {
				        return "EntitySet";
				    },
					getUiState: function() {
						return {
							getSelectionVariant: function() {
								return "test";
							}
						};
					},
				},
				    oSmartTable: {
				        getEntitySet: function() {
				        	return "EntitySet";
				        },
						getModel: function() {
							return "";
						}
				    }
				};

				// initialize spies
				oNavigationHandlerNavigateArguments = undefined;
				// execute
				var result = oCommonEventHandlers.addEntry(oEventSource, undefined, oControls.oSmartFilterbar);
				// check
				assert.ok(result instanceof Promise, "AddEntry has to return a promise");
				var done = assert.async();
				setTimeout(function() {
					result.then(function() {
						assert.ok("the promise should be resolved");
						done();
					}, function() {
						assert.notOk("the promise should be resolved but was rejected");
						done();
					});
				});
				assert.equal(oNavigationHandlerNavigateArguments[2], undefined, "Third parameter: Parameters for the target app - undefined");
				assert.deepEqual(oNavigationHandlerNavigateArguments[3], null, "Fourth parameter has to be a null object");

				assert.strictEqual(oComponentRefreshBehaviourParameter, oComponentRefreshBehaviourParameterNotCalled, "setComponentRefreshBehaviour method is not called");
			});

			QUnit.test("Build Selection Variant for Navigation", function(assert){
				// prepare parameters
				// prio of values:
				// 1. manifest (if not {})
				// 2. LineContext
				// 2b. actually, an empty value should be denoted as {value: {}} in outbound section of manifest
				// 3. PageContext
				// 4. FilterBar
				// 5. manifest (only if {})
				oController.getOwnerComponent().getModel().getMetaModel = function() {
					return {
						getMetaContext: function() {
							return {
								getObject: function() {
									return {
										property: [{name: "a"}, {name: "b"}, {name: "b1"}, {name: "c"}, {name: "d"}, {name: "e"}, {name: "e1"}]
									};
								}
							}
						}
					}
				};
				var oOutbound = {parameters: {a: "manifest", b:{}, b1:{value:{}}, c:{}, d:{}, e: {}, e1: {value: {}}}};
				var aLineContext = [
					{
						getObject: function() {return {a:"LineContext", b:"LineContext", b1:"LineContext"};},
						getPath: Function.prototype
					}
				];
				var oPageContext = {
					getObject: function(){return {b:"PageContext", b1:"PageContext", c:"PageContext"};},
					getPath: Function.prototype
				};

				// Set up selectionVariant for FilterBar
				var aRanges = [{
					High: null,
					Low: "SelectionVariant",
					Option: "EQ",
					Sign: "I"
				}];
				var sFilterBarSelectionVariant = JSON.stringify({
					SelectionVariantID: "",
					SelectOptions: [{
						PropertyName: "c",
						Ranges: aRanges
					},{
						PropertyName: "d",
						Ranges: aRanges
					}]
				});

				sandbox.stub(oNavigationHandler, "mixAttributesAndSelectionVariant", function() {
					return {
						getSelectOptionsPropertyNames: function() {
							return ["c", "d"];
						},
						toJSONString: Function.prototype
					};
				});

				// execution
				oStubForPrivate.fnBuildSelectionVariantForNavigation(oOutbound, aLineContext, oPageContext, sFilterBarSelectionVariant);
				// check
				assert.ok(oNavigationHandler.mixAttributesAndSelectionVariant.calledTwice, "Mix Attributes called twice");
				assert.ok(oNavigationHandler.mixAttributesAndSelectionVariant.getCall(0).calledWith({},sFilterBarSelectionVariant), "First with empty object");

				var aExpectedInputForMixAttributes = [{a:"manifest", b:"LineContext", b1:"LineContext", c:"PageContext", e: {}, e1:{}}];
				assert.ok(oNavigationHandler.mixAttributesAndSelectionVariant.getCall(1).calledWith(aExpectedInputForMixAttributes, sFilterBarSelectionVariant),
						"Second call with object containing all properties with higer prio or not existent in Selection Variant");
			});

			QUnit.test("Evaluate Outbound Parameters", function(assert){
				// prepare parameters
				var oOutbound1 = {
					"Name": {
						"semanticObject": "Product",
						"action": "manage",
						"parameters": {
							"mode": "create"
						}
					}
				};
				var oOutbound1Multi = {
					"Name": {
						"semanticObject": "Product",
						"action": "manage",
						"parameters": {
							"mode": "create",
							"b"   : "bValue",
							"c"   : {}
						}
					}
				};
				var oOutbound2 = {
					"Name": {
						"semanticObject": "Product",
						"action": "manage",
						"parameters": {
							"mode": {
								"value": "create"
							}
						}
					}
				};
				var oOutbound2Multi = {
					"Name": {
						"semanticObject": "Product",
						"action": "manage",
						"parameters": {
							"mode": {
								"value": "create"
							},
							"b": {
								"value": "bValue"
							},
							"c": {}
						}
					}
				};
				var oOutbound3 = {
					"Name": {
						"semanticObject": "Product",
						"action": "manage",
						"parameters": {
							"mode": {
								"value": {
									"value": "create",
									"format": "plain"
								}
							}
						}
					}
				};
				var oOutbound3Multi = {
					"Name": {
						"semanticObject": "Product",
						"action": "manage",
						"parameters": {
							"mode": {
								"value": {
									"value": "create",
									"format": "plain"
								}
							},
							"b": {
								"value": {
									"value": "bValue",
									"format": "plain"
								}
							},
							"c": {
								"value": {
									"value": {},
									"format": "plain"
								}
							}
						}
					}
				};

				var oExpected = {};
				oExpected.mode = "create";

				// execution
				var oResult1 = oStubForPrivate.fnEvaluateParameters(oOutbound1.Name.parameters);
				var oResult2 = oStubForPrivate.fnEvaluateParameters(oOutbound2.Name.parameters);
				var oResult3 = oStubForPrivate.fnEvaluateParameters(oOutbound3.Name.parameters);

				assert.deepEqual(oResult1, oExpected, "Simple Parameter Result correct");
				assert.deepEqual(oResult2, oExpected, "Object Parameter Result correct");
				assert.deepEqual(oResult3, oExpected, "Value Parameter Result correct");

				var oExpectedMulti = {};
				oExpectedMulti.mode = "create";
				oExpectedMulti.b = "bValue";
				oExpectedMulti.c = {};

				// execution
				var oResult1Multi = oStubForPrivate.fnEvaluateParameters(oOutbound1Multi.Name.parameters);
				var oResult2Multi = oStubForPrivate.fnEvaluateParameters(oOutbound2Multi.Name.parameters);
				var oResult3Multi = oStubForPrivate.fnEvaluateParameters(oOutbound3Multi.Name.parameters);

				assert.deepEqual(oResult1Multi, oExpectedMulti, "Simple Multi Parameter Result correct");
				assert.deepEqual(oResult2Multi, oExpectedMulti, "Object Multi Parameter Result correct");
				assert.deepEqual(oResult3Multi, oExpectedMulti, "Value Multi Parameter Result correct");
			});

			QUnit.test("Function fnNavigateIntentSmartLink", function(assert) {
				var oOutbound = {
					semanticObject: "Semantic Object",
					action: "action"
				};
				var oEventSource = {
					data: function() {
						return sCrossNavigationOutbound;
					},
					getBindingContext: function() {
						return {
							getObject: Function.prototype
						};
					},
					getParent: function() {
						return {
							getParent: function() {
								return {
									getTable: Function.prototype
								};
							}
						};
					},
					getId: Function.prototype
				};
				oStubForPrivate.CommonEventHandlers_fnNavigateIntentSmartLink(oOutbound, oEventSource);
				assert.deepEqual(oComponentRefreshBehaviourParameter[0], oOutbound, "setComponentRefreshBehaviour method is called with correct parameter");
			});

			QUnit.test("Function onRelatedAppNavigation", function(assert) {
				var oOutbound = {
					semanticObject: "Semantic Object",
					action: "action"
				};
				oCommonEventHandlers.onRelatedAppNavigation(oOutbound, { getObject: Function.prototype, getPath: Function.prototype });
				assert.deepEqual(oComponentRefreshBehaviourParameter[0], oOutbound, "setComponentRefreshBehaviour method is called with correct parameter");
			});

			QUnit.test("Function handleTypeMismatch", function(assert) {
				var oMessageToastSpy = sinon.spy(oTemplateUtils.oServices.oApplication, "showMessageToast");

				oCommonEventHandlers.handleTypeMismatch();

				assert.ok(oMessageToastSpy.calledOnce, "Message toast have been called");
			});

			QUnit.module("lib.CommonEventHandlers.fnNavigateIntent", {
				beforeEach: function() {
					oStubForPrivate = testableHelper.startTest();
					sandbox = sinon.sandbox.create();
					mModels = Object.create(null);
					oCommonEventHandlers = new CommonEventHandlers(oController, oTemplateUtils.oComponentUtils,
							oTemplateUtils.oServices, oTemplateUtils.oCommonUtils);
					oController.getOwnerComponent().getModel().getMetaModel = function() {
						return {
							getMetaContext: function() {
								return {
									getObject: function() {
										return {
											property: []
										};
									}
								}
							}
						}
					};
				},
				afterEach: function() {
					sandbox.restore();
					testableHelper.endTest();
				}
			});

			QUnit.test("Function fnNavigateIntent", function(assert) {
				var oTemplateUtils = {
					oServices: {
						oPresentationControlHandlerFactory: {
							getPresentationControlHandler: function() {
								return {
									getSelectedContexts: function() {
										return aSelectedContexts;
									}
								}
							}
						}
					}
				};
				var sSelectionVariant = "test";
				var oSmartFilterBar = {
						getUiState: function() {
							return {
								getSelectionVariant: function() {
									return sSelectionVariant;
								}
							};
						},
					getEntitySet: function() {
				        return "EntitySet";
				    }
				};
				var oSmartControl = {
				        getEntitySet: function() {
				        	return "EntitySet";
				        }
				};
				var oOutbound = {
						semanticObject: "Semantic Object",
						action: "action",
						parameters: {
							a: "a",
							b: "b"
						}
					};
				var oObjectInfo = {
						semanticObject : "Semantic Object",
						action: "action"
				};
				var oSelectionVariant = {
						toJSONString: function() {},
						_mSelectOptions: {
							Currency: [{High: null, Low: "EUR", "Option": "EQ", "Sign": "I"}],
							Price: [{High: null, Low: "120", "Option": "EQ", "Sign": "I"}]
						}
				};
				sandbox.stub(oStubForPrivate, "fnBuildSelectionVariantForNavigation", function() {
					return oSelectionVariant;
				});
				var oNavigationExtensionStub = sandbox.stub(oController, "adaptNavigationParameterExtension", function(oSelectionVariant, oObjectInfo) {
					delete oSelectionVariant._mSelectOptions.Price;
				});
				sandbox.stub(oNavigationHandler, "navigate", function() {});
				var oContext = oTemplateUtils.oServices.oPresentationControlHandlerFactory.getPresentationControlHandler(oSmartTable).getSelectedContexts();
				oStubForPrivate.fnNavigateIntent(oOutbound, oContext, oSmartFilterBar, oSmartControl);

				assert.ok(oNavigationExtensionStub.calledWith(oSelectionVariant, oObjectInfo),
				"Navigation extension called with the SelectionVariant and the ObjectInfo");
				assert.ok(!oSelectionVariant._mSelectOptions.Price,
				"Property Price was removed from SelectionOptions");
				assert.ok(oSelectionVariant._mSelectOptions.Currency,
				"Property Currency is still available in SelectionOptions");
			});

			QUnit.test("Function fnNavigateIntent (sap-keep-alive)", function(assert) {
				var sSelectionVariant = "test";
				var oSmartFilterBar = {
					getUiState: function() {
						return {
							getSelectionVariant: function() {
								return sSelectionVariant;
							}
						};
					},
					getEntitySet: function() {
				        return "EntitySet";
				    }
				};
				var oSmartControl = {
				        getEntitySet: function() {
				        	return "EntitySet";
				        }
				};
				var oOutbound = {
					semanticObject: "Semantic Object",
					action: "action"
				};
				var oContext = oTemplateUtils.oServices.oPresentationControlHandlerFactory.getPresentationControlHandler(oSmartControl).getSelectedContexts();
				oStubForPrivate.fnNavigateIntent(oOutbound, oContext, oSmartFilterBar);
				assert.deepEqual(oComponentRefreshBehaviourParameter[0], oOutbound, "setComponentRefreshBehaviour method called with correct parameter");
			});


			 QUnit.module("lib.CommonEventHandlers.fnHideTitleArea", {
				 beforeEach: function() {
					 oStubForPrivate = testableHelper.startTest();
					 sandbox = sinon.sandbox.create();

					 oCommonEventHandlers = new CommonEventHandlers(oController, oTemplateUtils.oComponentUtils,
						 oTemplateUtils.oServices, oTemplateUtils.oCommonUtils);
				 },
				 afterEach: function() {
					 sandbox.restore();
					 testableHelper.endTest();
				 }
			 });

			 QUnit.test("Function fnHideTitleArea", function(assert) {
				 var aAllControls = [];

				 //********Test 1
				 //ownTitleArea
				 var oOwnTitleAreaIcon = new sap.ui.core.Icon("icon");
				 oOwnTitleAreaIcon.setSrc("picABC");
				 aAllControls.push(oOwnTitleAreaIcon);

				 var oOwnTitleAreaTitle = new sap.m.Text("title");
				 oOwnTitleAreaTitle.setText("titleABC");
				 aAllControls.push(oOwnTitleAreaTitle);

				 var oOwnTitleAreaDescription = new sap.m.Text("description");
				 oOwnTitleAreaDescription.setText("descriptionABC");
				 aAllControls.push(oOwnTitleAreaDescription);

				 //contactTitleArea
				 var aContactTitleArea = [];
				 aContactTitleArea[0] = {
					 Label : { String : "Label: Contact 1"},
					 RecordType : "com.sap.vocabularies.UI.v1.ReferenceFacet",
					 Target : { AnnotationPath : "@com.sap.vocabularies.Communication.v1.Contact#WeightUnitContact1"}
				 };

				 var oContactTitleAreaIcon = new sap.ui.core.Icon("com.sap.vocabularies.Communication.v1.Contact::WeightUnitContact1::contactTitleAreaIcon");
				 oContactTitleAreaIcon.setSrc("picABC");
				 aAllControls.push(oContactTitleAreaIcon);

				 var oContactTitleAreaTitle = new sap.m.Text("com.sap.vocabularies.Communication.v1.Contact::WeightUnitContact1::contactTitleAreaTitle");
				 oContactTitleAreaTitle.setText("titleABC");
				 aAllControls.push(oContactTitleAreaTitle);

				 var oContactTitleAreaDescription = new sap.m.Text("com.sap.vocabularies.Communication.v1.Contact::WeightUnitContact1::contactTitleAreaDescription");
				 oContactTitleAreaDescription.setText("descriptionABC");
				 aAllControls.push(oContactTitleAreaDescription);

				 var oContactTitleArea =  new sap.ui.layout.HorizontalLayout("com.sap.vocabularies.Communication.v1.Contact::WeightUnitContact1::contactTitleArea");
				 aAllControls.push(oContactTitleArea);

				 var oSmLiContent = sinon.createStubInstance(sap.ui.core.mvc.XMLView);
				 oSmLiContent.byId = function(sId) {
					 var oFoundControl;
					 for (var j = 0; j < aAllControls.length; j++) {
						 var oControl = aAllControls[j];
						 if (sId === oControl.getId()){
							 oFoundControl = oControl;
							 break;
						 }
					 }
					 return oFoundControl;
				 };
				 var oContactTitleAreaStub = sandbox.stub(oContactTitleArea, "setVisible");
				 oStubForPrivate.fnHideTitleArea(oSmLiContent, aContactTitleArea);

				 assert.ok(oContactTitleAreaStub.calledOnce, "TitleArea identical - visible set on false");

				 //********Test 2
				 oContactTitleAreaStub.reset();
				 oOwnTitleAreaIcon.setSrc("XXXXXpicABC");

				 oStubForPrivate.fnHideTitleArea(oSmLiContent, aContactTitleArea);

				 assert.ok(oContactTitleAreaStub.notCalled, "TitleArea are NOT identical due to OwnTitleAreaIcon - visible is not set");
				 oOwnTitleAreaIcon.setSrc("picABC");

				 //********Test 3
				 oContactTitleAreaStub.reset();
				 oContactTitleAreaTitle.setText("XXXXXXtitleABC");

				 oStubForPrivate.fnHideTitleArea(oSmLiContent, aContactTitleArea);

				 assert.ok(oContactTitleAreaStub.notCalled, "TitleArea are NOT identical due to ContactTitleAreaTitle - visible is not set");
				 oContactTitleAreaTitle.setText("titleABC");

				 //********Test 4
				 oContactTitleAreaStub.reset();
				 oContactTitleAreaDescription.setText("XXXXXXdescriptionABC");

				 oStubForPrivate.fnHideTitleArea(oSmLiContent, aContactTitleArea);

				 assert.ok(oContactTitleAreaStub.notCalled, "TitleArea are NOT identical due to ContactTitleAreaDescription - visible is not set");
				 oContactTitleAreaDescription.setText("descriptionABC");

				 //********Test 5
				 oContactTitleAreaStub.reset();
				 var aAllControls = [];
				 //aAllControls.push(oOwnTitleAreaIcon);
				 aAllControls.push(oOwnTitleAreaTitle);
				 aAllControls.push(oOwnTitleAreaDescription);
				 aAllControls.push(oContactTitleAreaIcon);
				 aAllControls.push(oContactTitleAreaTitle);
				 aAllControls.push(oContactTitleAreaDescription);
				 aAllControls.push(oContactTitleArea);

				 oStubForPrivate.fnHideTitleArea(oSmLiContent, aContactTitleArea);

				 assert.ok(oContactTitleAreaStub.notCalled, "TitleArea are NOT identical due to OwnTitleAreaIcon empty - visible is not set");

				 //only hide the title area in case of filled fields - issue with timing of the hide check, therefore only checking if filled
				 /*
				 //********Test 6
				 oContactTitleAreaStub.reset();
				 var aAllControls = [];
				 //aAllControls.push(oOwnTitleAreaIcon);
				 aAllControls.push(oOwnTitleAreaTitle);
				 aAllControls.push(oOwnTitleAreaDescription);
				 //aAllControls.push(oContactTitleAreaIcon);
				 aAllControls.push(oContactTitleAreaTitle);
				 aAllControls.push(oContactTitleAreaDescription);
				 aAllControls.push(oContactTitleArea);

				 oStubForPrivate.fnHideTitleArea(oSmLiContent, aContactTitleArea);

				 assert.ok(oContactTitleAreaStub.calledOnce, "TitleArea identical - visible set on false");

				 //********Test 7
				 oContactTitleAreaStub.reset();
				 var aAllControls = [];
				 oOwnTitleAreaIcon.setSrc("");
				 aAllControls.push(oOwnTitleAreaIcon);
				 aAllControls.push(oOwnTitleAreaTitle);
				 aAllControls.push(oOwnTitleAreaDescription);
				 //aAllControls.push(oContactTitleAreaIcon);
				 aAllControls.push(oContactTitleAreaTitle);
				 aAllControls.push(oContactTitleAreaDescription);
				 aAllControls.push(oContactTitleArea);

				 oStubForPrivate.fnHideTitleArea(oSmLiContent, aContactTitleArea);

				 assert.ok(oContactTitleAreaStub.calledOnce, "TitleArea identical - visible set on false");
				 oOwnTitleAreaIcon.setSrc("picABC");

				 //********Test 8
				 oContactTitleAreaStub.reset();
				 var aAllControls = [];
				 //aAllControls.push(oOwnTitleAreaIcon);
				 aAllControls.push(oOwnTitleAreaTitle);
				 aAllControls.push(oOwnTitleAreaDescription);
				 aAllControls.push(oContactTitleAreaIcon);
				 oContactTitleAreaIcon.setSrc("");
				 aAllControls.push(oContactTitleAreaTitle);
				 aAllControls.push(oContactTitleAreaDescription);
				 aAllControls.push(oContactTitleArea);

				 oStubForPrivate.fnHideTitleArea(oSmLiContent, aContactTitleArea);

				 assert.ok(oContactTitleAreaStub.calledOnce, "TitleArea identical - visible set on false");
				 oContactTitleAreaIcon.setSrc("picABC");

				 //********Test 9
				 oContactTitleAreaStub.reset();
				 var aAllControls = [];
				 aAllControls.push(oOwnTitleAreaIcon);
				 aAllControls.push(oOwnTitleAreaTitle);
				 oOwnTitleAreaDescription.setText("");
				 aAllControls.push(oOwnTitleAreaDescription);
				 aAllControls.push(oContactTitleAreaIcon);
				 aAllControls.push(oContactTitleAreaTitle);
				 //aAllControls.push(oContactTitleAreaDescription);
				 aAllControls.push(oContactTitleArea);

				 oStubForPrivate.fnHideTitleArea(oSmLiContent, aContactTitleArea);

				 assert.ok(oContactTitleAreaStub.calledOnce, "TitleArea identical - visible set on false");
				 oOwnTitleAreaDescription.setText("descriptionABC");

				 //********Test 10
				 oContactTitleAreaStub.reset();
				 var aAllControls = [];
				 aAllControls.push(oOwnTitleAreaIcon);
				 aAllControls.push(oOwnTitleAreaTitle);
				 aAllControls.push(oOwnTitleAreaDescription);
				 //aAllControls.push(oContactTitleAreaIcon);
				 aAllControls.push(oContactTitleAreaTitle);
				 aAllControls.push(oContactTitleAreaDescription);
				 aAllControls.push(oContactTitleArea);

				 oStubForPrivate.fnHideTitleArea(oSmLiContent, aContactTitleArea);

				 assert.ok(oContactTitleAreaStub.calledOnce, "TitleArea identical - visible set on false");

				 //********Test 11
				 oContactTitleAreaStub.reset();
				 var aAllControls = [];
				 aAllControls.push(oOwnTitleAreaIcon);
				 aAllControls.push(oOwnTitleAreaTitle);
				 aAllControls.push(oOwnTitleAreaDescription);
				 aAllControls.push(oContactTitleAreaIcon);
				 //aAllControls.push(oContactTitleAreaTitle);
				 aAllControls.push(oContactTitleAreaDescription);
				 aAllControls.push(oContactTitleArea);

				 oStubForPrivate.fnHideTitleArea(oSmLiContent, aContactTitleArea);

				 assert.ok(oContactTitleAreaStub.calledOnce, "TitleArea identical - visible set on false");

				 //********Test 12
				 oContactTitleAreaStub.reset();
				 var aAllControls = [];
				 aAllControls.push(oOwnTitleAreaIcon);
				 aAllControls.push(oOwnTitleAreaTitle);
				 aAllControls.push(oOwnTitleAreaDescription);
				 aAllControls.push(oContactTitleAreaIcon);
				 aAllControls.push(oContactTitleAreaTitle);
				 //aAllControls.push(oContactTitleAreaDescription);
				 aAllControls.push(oContactTitleArea);

				 oStubForPrivate.fnHideTitleArea(oSmLiContent, aContactTitleArea);

				 assert.ok(oContactTitleAreaStub.calledOnce, "TitleArea identical - visible set on false");*/
			 });

				QUnit.module("lib.CommonEventHandlers.onDataFieldWithNavigationPath", {
					beforeEach: function() {
						sandbox = sinon.sandbox.create();
						oStubForPrivate = testableHelper.startTest();
					},
					afterEach: function() {
						testableHelper.endTest();
						sandbox.restore();
					}
				});

				QUnit.test("onDataFieldWithNavigationPath", function(assert){
					//prepare data
					var oEvent = sinon.createStubInstance(Event);
					var oContext = {
						getPath: function () {
							return "/CDN_C_STTA_SO_WD_20(SalesOrder='500000001',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)";
						}
					};
					oEvent.getSource = function () {
						return {
							getCustomData: function () {
								return [{
									getProperty: function (sPropertyName) {
										if (sPropertyName === "key") {
											return "Target";
										}
										return "to_nav";
									}
								}];
							},
							getBindingContext: function () {
								return oContext;
							},
							data: Function.prototype
						}
					};
					var oController = {}, oCommonUtils = {}, oComponentUtils = {}, oServices = { oApplicationController: {}, oDraftController : {}}, oModel = {}, oNavigationController = {}, oMetaModel = {}, oApplication = {};
					var sPath = "/CDN_C_STTA_SO_WD_20(SalesOrder='500000001',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)" + "/" + "to_nav";
					var oNavigationKeyProperties = [{
						aKeys: [
							{ name: "SalesOrder", type: "Edm.String" },
							{ name: "DraftUUID", type: "Edm.Guid" },
							{ name: "IsActiveEntity", type: "Edm.Boolean" }
						],
						entitySet: "CDN_C_STTA_SO_WD_20",
						navigationProperty: undefined
					}];
					var sODataEntitySet = {
						entityType: "CDN_C_STTA_SO_WD_20_CDS.CDN_C_STTA_SO_WD_20Type",
						name: "CDN_C_STTA_SO_WD_20"
					};
					var sODataEntityType = {
						name: "CDN_C_STTA_SO_WD_20Type",
						namespace: "CDN_C_STTA_SO_WD_20_CDS",
						key: {
							propertyRef: [
								{ name: "SalesOrder", type: "Edm.String" },
								{ name: "DraftUUID", type: "Edm.Guid" },
								{ name: "IsActiveEntity", type: "Edm.Boolean" }
							]
						},
						navigationProperty: [
							{ name: "to_SO" },
							{ name: "to_nav" }
						]
					};
					var oODataEntityContainer = {
						entitySet: []
					};
					oODataEntityContainer.entitySet[0] = sODataEntitySet;
					var sEntitySet = "CDN_C_STTA_SO_WD_20";
					var oAssociationEnd = {type: "CDN_C_STTA_SO_WD_20_CDS.CDN_C_STTA_SO_WD_20Type"};
					//sandbox stubs
					sandbox.stub(oMetaModel, "getODataEntitySet", function() {
						return sODataEntitySet;
					});

					sandbox.stub(oMetaModel, "getODataEntityType", function() {
						return sODataEntityType;
					});

					sandbox.stub(oMetaModel, "getODataAssociationEnd", function() {
						return oAssociationEnd;
					});

					sandbox.stub(oMetaModel, "getODataEntityContainer", function() {
						return oODataEntityContainer;
					});

					sandbox.stub(oModel, "getMetaModel", function() {
						return oMetaModel;
					});

					sandbox.stub(oModel, "read", function(sPath, mParameters) {
						mParameters.success({});
					});

					sandbox.stub(oController, "getOwnerComponent", function() {
						return {
							getModel: function() {
								return oModel;
							},
							getEntitySet: function() {
								return sEntitySet;
							},
							getAppComponent: function() {
								return {
									getConfig: function() {
										return {
											settings : {

											}
										};
									}
								};
							}
						};
					});

					sandbox.stub(oCommonUtils, "getNavigationKeyProperties", function() {
						return oNavigationKeyProperties;
					});

					sandbox.stub(oCommonUtils, "mergeNavigationKeyPropertiesWithValues", function() {
						return "NavigationPath!";
					});

					sandbox.stub(oComponentUtils, "isDraftEnabled", function() {
						return true;
					});

					sandbox.stub(oComponentUtils, "getBusyHelper", function() {
						return {
							setBusy: function() {
								return;
							}
						};
					});

					sandbox.stub(oApplication, "setStoredTargetLayoutToFullscreen", function() {
						return;
					});

					sandbox.stub(oApplication, "invalidatePaginatorInfo", function() {
						return;
					});
					oServices.oApplication = oApplication;

					sandbox.stub(oNavigationController, "navigateToContext", function() {
						return;
					});
					oServices.oNavigationController = oNavigationController;

					sandbox.stub(oServices.oApplicationController, "synchronizeDraftAsync", function() {
						return Promise.resolve();
					});

					sandbox.stub(oServices.oDraftController, "getDraftContext", function() {
						return {
							isDraftEnabled : function(){
								return true;
							},
							hasDraftAdministrativeData : function() {
								return true;
							}
						}
					});

					//execute code to test
					var oCommonEventHandlers = new CommonEventHandlers(oController, oComponentUtils,
							oServices, oCommonUtils);
					oCommonEventHandlers.onDataFieldWithNavigationPath(oEvent);

					//Tests
					var done = assert.async()
					assert.ok(oModel.read.calledOnce, "Model read called (once!)");
					assert.ok(oModel.read.calledWith(sPath), "Model.read was called with sPath");
					assert.ok(oModel.getMetaModel.calledOnce, "Model getMetaModel called (once!)");

					assert.ok(oCommonUtils.getNavigationKeyProperties.calledOnce, "getNavigationKeyProperties read called (once!)");
					assert.ok(oCommonUtils.getNavigationKeyProperties.calledWith(sEntitySet), "getNavigationKeyProperties was called with " + sEntitySet);

					assert.ok(oMetaModel.getODataEntitySet.calledOnce, "MetaModel getODataEntitySet called (once!)");
					assert.ok(oMetaModel.getODataEntitySet.calledWith(sEntitySet), "getODataEntitySet was called with " + sEntitySet);
					assert.ok(oMetaModel.getODataEntityType.calledTwice, "MetaModel getODataEntityType called (twice!)");
					assert.ok(oMetaModel.getODataEntityType.calledWith(oAssociationEnd.type), "getODataEntityType was called with " + oAssociationEnd.type);
					assert.ok(oMetaModel.getODataEntityType.calledWith(sODataEntitySet.entityType), "getODataEntityType was called with " + sODataEntitySet.entityType);
					assert.ok(oMetaModel.getODataAssociationEnd.calledOnce, "MetaModel getODataAssociationEnd called (once!)");
					assert.ok(oMetaModel.getODataAssociationEnd.calledWith(sODataEntityType, "to_nav"), "getODataAssociationEnd was called with " + sEntitySet + " and " + "NavigationProperty 'to_nav'");
					assert.ok(oMetaModel.getODataEntityContainer.calledOnce, "MetaModel getODataEntityContainer called (once!)");

					assert.ok(oServices.oDraftController.getDraftContext.calledOnce, "oServices.oDraftController.getDraftContext called (once!)");

					oServices.oApplicationController.synchronizeDraftAsync().then(function () {
						assert.ok(oCommonUtils.mergeNavigationKeyPropertiesWithValues.calledOnce, "mergeNavigationKeyPropertiesWithValues called (once!)");
						assert.ok(oCommonUtils.mergeNavigationKeyPropertiesWithValues.calledWith(oNavigationKeyProperties), "mergeNavigationKeyPropertiesWithValues was called with oNavigationKeyProperties");
						assert.ok(oNavigationController.navigateToContext.calledOnce, "oNavigationController navigateToContext called (once!)");
						assert.ok(oNavigationController.navigateToContext.calledWith("NavigationPath!"), "oNavigationController navigateToContext was called with 'NavigationPath!'");
						done();
					});
				});


			QUnit.module("lib.CommonEventHandlers.fnGetSelectedItemContextForDeleteMessage", {
				beforeEach: function() {
					oStubForPrivate = testableHelper.startTest();
					sandbox = sinon.sandbox.create();
					sandbox.stub(oPresentationControlHandler, "getTitleInfoForItem", function(oItem){
						if (oItem.getPath() === "/dummyContextPath"){
							return {
								title: "Dummy Title",
								subTitle: "Dummy SubTitle"
							};
						}
					});
					sandbox.stub(oAppComponent, "getFlexibleColumnLayout", function(){
						return null;
					});
					oCommonEventHandlers = new CommonEventHandlers(oController, oTemplateUtils.oComponentUtils,
							oTemplateUtils.oServices, oTemplateUtils.oCommonUtils);
				},
				afterEach: function() {
					sandbox.restore();
					testableHelper.endTest();
				}
			});

			QUnit.test("Function fnGetSelectedItemContextForDeleteMessage", function(assert) {
				var oSelectedItem = {
					getPath: function() {
						return "/dummyContextPath";
					},
					getModel: function() {
						return {
							"oData": {
								"dummyContextPath": {
									"dummyPropertyPath": "dummyValue"
								}
							}
						};
					}
				};
				var aCustomData = [{
					getKey: function() {
						return "headerInfo";
					},
					getValue: function() {
						return {
							"headerTitle": "Dummy Title",
							"isHeaderTitlePath": false,
							"headerSubTitle": "Dummy SubTitle",
							"isHeaderSubTitlePath": false
						};
					}
				}];

				var getTextStub = sandbox.stub(oTemplateUtils.oCommonUtils, "getText", function() {
					return;
				});

				oSmartTable.getCustomData.returns(aCustomData);
				var fnGetSelectedItemContextForDeleteMessageStub = oStubForPrivate.fnGetSelectedItemContextForDeleteMessage(oSmartTable, oSelectedItem);

				assert.ok(getTextStub.calledWith("DELETE_WITH_OBJECTTITLE", ["Dummy Title", "Dummy SubTitle"]), "getText called with correct arguments");
			});

			QUnit.module("lib.CommonEventHandlers.getDataForDeleteDialog", {
				beforeEach: function() {
					oStubForPrivate = testableHelper.startTest();
					sandbox = sinon.sandbox.create();
					oCommonEventHandlers = new CommonEventHandlers(oController, oTemplateUtils.oComponentUtils,
							oTemplateUtils.oServices, oTemplateUtils.oCommonUtils);
				},
				afterEach: function() {
					sandbox.restore();
					testableHelper.endTest();
				}
			});

			QUnit.test("Function getDataForDeleteDialog", function(assert) {
				var selectedItems = [{
					sPath: "/C_STTA_SalesOrder_WD_20(node_key=guid'00505691-2ec5-1eda-b3b0-8533c06215e8',IsActiveEntity=false)",
					getPath: function() {
						return "/C_STTA_SalesOrder_WD_20(node_key=guid'00505691-2ec5-1eda-b3b0-8533c06215e8',IsActiveEntity=false)";
					},
					getModel: function() {
						return {
							"oData": {
								"dummyContextPath": {
									"dummyPropertyPath": "dummyValue"
								}
							}
						};
					}
				},
				{
					sPath: "/C_STTA_SalesOrder_WD_20(node_key=guid'00505691-2ec5-1eea-ad8f-cd82cbcf4d66',IsActiveEntity=true)",
					getPath: function() {
						return "/C_STTA_SalesOrder_WD_20(node_key=guid'00505691-2ec5-1eea-ad8f-cd82cbcf4d66',IsActiveEntity=true)";
					},
					getModel: function() {
						return {
							"oData": {
								"dummyContextPath": {
									"dummyPropertyPath": "dummyValue"
								}
							}
						};
					}
				}];
				// Test for draft with non-deletable active entity
				var getDataForDeleteDialog = oStubForPrivate.getDataForDeleteDialog([selectedItems[0]], oSmartTable);
				assert.ok(getDataForDeleteDialog instanceof Promise, "getDataForDeleteDialog returned promise");
				// Test for multiple items: selected items include one draft with non-deletable active entity and one deletale active entity
				var getDataForDeleteDialogMultipleItem = oStubForPrivate.getDataForDeleteDialog(selectedItems, oSmartTable);
				var done = assert.async();
				setTimeout(function() {
					getDataForDeleteDialog.then(function(statusJSON) {
						if (statusJSON.text.text) {
							assert.equal(statusJSON.text.text, "This object cannot be deleted.", "The delete message is correct");
							assert.equal(statusJSON.text.title, "Warning", "Delete Dialog title is Warning");
							assert.equal(statusJSON.text.unsavedChanges, "Also delete objects with unsaved changes.", "UnsavedChanges Text available");
						}
						done();
					},function() {
						assert.notOk("the promise was rejected");
						done();
					});
				},10);
				var done2 = assert.async();
				setTimeout(function() {
					getDataForDeleteDialogMultipleItem.then(function(statusJSON) {
						if (statusJSON.itemsCount) {
							assert.equal(statusJSON.text.unsavedChanges, "Also delete objects with unsaved changes.", "UnsavedChanges Text available");
							assert.equal(statusJSON.undeletableCount, 1, "UndeletableCount is 1");
							assert.equal(statusJSON.itemsCount, 2, "Total number of selected items is 2");
							assert.equal(statusJSON.text.text, "1 of 2 objects cannot be deleted.\nDo you still want to delete the remaining object?", "The delete message is correct");
						}
						done2();
					},function() {
						assert.notOk("the promise was rejected");
						done2();
					});
				},10);
			});

			QUnit.module("lib.CommonEventHandlers.getPaginatorInfo", {
				beforeEach: function() {
					oStubForPrivate = testableHelper.startTest();
					sandbox = sinon.sandbox.create();
				},
				afterEach: function() {
					sandbox.restore();
					testableHelper.endTest();
				}
			});

			QUnit.test("if there is no current contexts -> getPaginatorInfo return null", function(assert) {
				var params = getParams();
				// var aCurrContexts = [getContext("path01"), getContext("path02", true)];
				var aCurrContexts = null;

				params.oServices.oPresentationControlHandler.getCurrentContexts.returns(aCurrContexts);

				var oTable = new SmartTable(),
					oRow = getRow(),
					oState = {};

				var paginatorInfo = oStubForPrivate.getPaginatorInfo(oTable, oRow, oState);
				assert.ok(paginatorInfo === null, "no paging object");
				assert.ok(params.oServices.oPresentationControlHandler.getBinding.notCalled, "oServices.oPresentationControlHandler.getBinding() not called");
			});

			QUnit.test("if there is no current contexts for row -> getPaginatorInfo return null", function(assert) {
				var params = getParams();
				var aCurrContexts = [getContext("path01"), getContext("path02", true)];

				params.oServices.oPresentationControlHandler.getCurrentContexts.returns(aCurrContexts);

				var oTable = new SmartTable(),
					oRow = getRow(),
					oState = {};

				oRow.oBindingContext.getPath.returns("path03");

				var paginatorInfo = oStubForPrivate.getPaginatorInfo(oTable, oRow, oState);
				assert.ok(paginatorInfo === null, "no paging object");
				assert.ok(params.oServices.oPresentationControlHandler.getBinding.calledOnce, "oServices.oPresentationControlHandler.getBinding() has been called");
			});

			QUnit.test("get paging object", function(assert) {
				var params = getParams();
				var aCurrContexts = [getContext("path01"), getContext("path02", true)];

				params.oServices.oPresentationControlHandler.getCurrentContexts.returns(aCurrContexts);
				params.oComponentUtils.isDraftEnabled.returns(false);

				var oTable = new SmartTable(),
					oRow = getRow(),
					oState = {};

				oRow.oBindingContext.getPath.returns("path01");
				oRow.getParent.returns({
					getParent: sinon.stub().returns(oTable),
				});

				var paginatorInfo = oStubForPrivate.getPaginatorInfo(oTable, oRow, oState);
				assert.ok(!!paginatorInfo, "paging object obtained");
				assert.ok(paginatorInfo.listBinding === "binding", "paginatorInfo.listBinding is correct");
				assert.ok(paginatorInfo.growingThreshold === "threshold", "paginatorInfo.growingThreshold is correct");
				assert.ok(paginatorInfo.selectedRelativeIndex === 0, "paginatorInfo.selectedRelativeIndex is correct");
				assert.deepEqual(paginatorInfo.objectPageNavigationContexts, aCurrContexts, "paginatorInfo.objectPageNavigationContexts is correct");
				assert.ok(!!paginatorInfo.paginate, "paginatorInfo.paginate is present");
			});

			QUnit.test("execute paginate function", function(assert) {
				var params = getParams();
				var aCurrContexts = [getContext("path01"), getContext("path02", true)];

				params.oServices.oPresentationControlHandler.getCurrentContexts.returns(aCurrContexts);
				params.oComponentUtils.isDraftEnabled.returns(false);
				params.oController.onListNavigationExtension.returns(false);
				params.oController.oOwnerComponent.getEditFlow.returns("notDirect");
				params.oController.oOwnerComponent.oModel.getProperty.returns(true);

				var oTable = new SmartTable(),
					oRow = getRow(),
					oState = {},
					oRowClone = getRow();

				oRow.oBindingContext.getPath.returns("path01");
				oRow.getParent.returns({
					getParent: sinon.stub().returns(oTable),
				});
				oRow.getSelected.returns(false);
				oRow.clone.returns(oRowClone);

				oRowClone.oMetadata.getName.returns("sap.ui.base.SomeCustomStub");
				oRowClone.data.withArgs("CrossNavigation").returns(false);
				oRowClone.getParent.returns({
					getParent: sinon.stub().returns(oTable),
				});

				var paginatorInfo = oStubForPrivate.getPaginatorInfo(oTable, oRow, oState);
				assert.ok(!!paginatorInfo, "paging object obtained");
				paginatorInfo.paginate(aCurrContexts[0], {}, false);
				assert.ok(oRow.clone.calledOnce, "oRow.clone has been called");
				assert.ok(oRowClone.setParent.calledOnce, "oRowClone.setParent has been called");
				assert.ok(oRowClone.setParent.firstCall.calledWithExactly(oTable), "oRowClone.setParent has been called with correct parameters");
				assert.ok(oRowClone.setBindingContext.calledOnce, "oRowClone.setBindingContext has been called");
				assert.ok(oRowClone.setBindingContext.firstCall.calledWithExactly(aCurrContexts[0]), "oRowClone.setBindingContext has been called with correct parameters");
				assert.ok(params.oController.onListNavigationExtension.calledOnce, "oController.onListNavigationExtension has been called");
				assert.ok(params.oComponentUtils.setPaginatorInfo.calledOnce, "oComponentUtils.setPaginatorInfo has been called");
				assert.ok(params.oComponentUtils.navigateAccordingToContext.calledOnce, "oComponentUtils.navigateAccordingToContext has been called");
				assert.ok(params.oComponentUtils.navigateAccordingToContext.firstCall.calledWithExactly(aCurrContexts[0], 6, true), "oComponentUtils.navigateAccordingToContext has been called with correct parameters");
			});

			QUnit.test("Testing 'fnNavigateIntentOnNewTab' method", function (assert) {
				var oParams = getParams();
				// Setup
				var oOutbound = {
					semanticObject: "SalesOrder",
					action: "manage"
				};

				var oSmartFilterBar = {
					getUiState: function () {
						return {
							getSelectionVariant: function () {
								return {
									SelectOptions: [
										{"PropertyName": "ProductCategory","Ranges": [{"Sign": "I", "Option": "EQ", "Low": "Accessories", "High": null}]}
									]	
								};
							}
						};
					}
				};

				var sPageContextPath = "/SalesOrder('1001')";
				var sLineItemContextPath = "/SalesOrderItem('2001')";
				var oPageEntityType = {
					property: [{name: "SalesOrderId"}]
				};
				var oLineItemEntityType = {
					property: [{name: "SalesOrderItemId"}]
				};
				var oPageContext = {
					getPath: sinon.stub().returns(sPageContextPath),
					getObject: sinon.stub().returns({"SalesOrderId": "1001"})
				};
				var oLineItemContext = {
					getPath: sinon.stub().returns(sLineItemContextPath),
					getObject: sinon.stub().returns({"SalesOrderItemId": "2001"})
				};
				var oView = {
					getBindingContext: sinon.stub().returns(oPageContext)
				};
				
				// Stubs
				oParams.oController.getView.returns(oView);
				oParams.oController.oOwnerComponent.oModel.oMetaModel.getMetaContext.withArgs(sPageContextPath).returns({getObject: sinon.stub().returns(oPageEntityType)});
				oParams.oController.oOwnerComponent.oModel.oMetaModel.getMetaContext.withArgs(sLineItemContextPath).returns({getObject: sinon.stub().returns(oLineItemEntityType)});
				// Creating a stub for NavigationHandler#navigate
				var oNavigateStub = oParams.oServices.oApplication.oNavigationHandler.navigate;

				// Action: invoke the method
				oParams.oCommonEventHandlers.navigateIntentOnNewTab(oOutbound, oLineItemContext, oSmartFilterBar, null);
				
				// Assertions
				assert.equal(oNavigateStub.calledOnce, true, "NavigationHandler#navigate called once");
				// Checking the arguments of "navigate" method
				var aArguments = oNavigateStub.args[0];
				var oSelectionVariant = JSON.parse(aArguments[2]);
				var aSelectionVariantProps = oSelectionVariant.SelectOptions.map(function (oSelectOption) {
					return oSelectOption.PropertyName;
				});
				assert.ok(aSelectionVariantProps.includes("ProductCategory") && aSelectionVariantProps.includes("SalesOrderId") && aSelectionVariantProps.includes("SalesOrderItemId"),
					"The selection variant should include the props 'ProductCategory', 'SalesOrderId' and 'SalesOrderItemId' ");
				assert.equal(aArguments[0], "SalesOrder", "First argument should be the semantic object");
				assert.equal(aArguments[1], "manage", "Second argument should be the semantic action");
				assert.equal(aArguments[6], "explace", "Last argument should be the 'explace' navigation mode");
			});

			function getParams() {
				var oController = getController(),
					oComponentUtils = getComponentUtils(),
					oServices = getServices(),
					oCommonUtils = new CommonUtils(oController, oServices, oComponentUtils),
					oCommonEventHandlers = new CommonEventHandlers(oController, oComponentUtils, oServices, oCommonUtils);
				return {
					oController: oController,
					oComponentUtils: oComponentUtils,
					oServices: oServices,
					oCommonEventHandlers: oCommonEventHandlers,
				};
			}

			function getRow() {
				var oBindingContext = getBindingContext(),
					oParent = {},
					oMetadata = getMetadata();
				return {
					oBindingContext: oBindingContext,
					oParent: oParent,
					oMetadata: oMetadata,
					getBindingContext: sinon.stub().returns(oBindingContext),
					setBindingContext: sinon.stub(),
					getParent: sinon.stub().returns(oParent),
					setParent: sinon.stub(),
					getSelected: sinon.stub(),
					clone: sinon.stub(),
					getMetadata: sinon.stub().returns(oMetadata),
					data: sinon.stub(),
				}
			}

			function getBindingContext() {
				return {
					getPath: sinon.stub(),
				};
			};

			function getMetadata() {
				return {
					getName: sinon.stub(),
				};
			};

			function getController() {
				var oOwnerComponent = getComponent();
				return {
					oOwnerComponent: oOwnerComponent,
					getOwnerComponent: sinon.stub().returns(oOwnerComponent),
					onListNavigationExtension: sinon.stub(),
					getView: sinon.stub(),
					adaptNavigationParameterExtension: sinon.stub().returns(null)
				};
			};

			function getComponent() {
				var oModel = getModel()
				return {
					oModel: oModel,
					getEditFlow: sinon.stub(),
					getModel: sinon.stub().returns(oModel),
				};
			};

			function getModel() {
				var oMetaModel = getMetaModel()
				return {
					getProperty: sinon.stub(),
					oMetaModel: oMetaModel,
					getMetaModel: sinon.stub().returns(oMetaModel)
				};
			};

			function getMetaModel() {
				return {
					getMetaContext: sinon.stub()
				}
			}

			function getComponentUtils() {
				return {
					isDraftEnabled: sinon.stub(),
					setPaginatorInfo: sinon.stub(),
					navigateAccordingToContext: sinon.stub(),
				};
			};

			function getServices() {
				var oPresentationControlHandler = getPresentationControlHandler();
				var oNavigationHandler = getNavigationHandler();
				return {
					oPresentationControlHandler: oPresentationControlHandler,
					oPresentationControlHandlerFactory: {
						getPresentationControlHandler: sinon.stub().returns(oPresentationControlHandler),
					},
					oApplication: {
						oNavigationHandler: oNavigationHandler,
						getNavigationHandler: sinon.stub().returns(oNavigationHandler)
					}	
				}
			};

			function getPresentationControlHandler() {
				return {
					getCurrentContexts: sinon.stub(),
					isMTable: sinon.stub().returns(false),
					getBinding: sinon.stub().returns("binding"),
					getThreshold: sinon.stub().returns("threshold"),
				};
			};

			function getNavigationHandler() {
				return {
					mixAttributesAndSelectionVariant: function (aObjects, sSelectionVariant) {
						var oSelectionVariant = JSON.parse(sSelectionVariant);
						Array.isArray(aObjects) && aObjects.forEach(function (oObject) {
							var aKeys = Object.keys(oObject);
							aKeys.forEach(function (sKey) {
								if (!oObject.hasOwnProperty(sKey)) {
									return;
								}
								var vValue = oObject[sKey];
								// Add the key value pair to the select option
								oSelectionVariant.SelectOptions.push({"PropertyName": sKey, "Ranges": [{"Sign": "I", "Option": "EQ", "Low": vValue, "High": null}]})
							});
						});
						return {
							toJSONString: function () {
								return JSON.stringify(oSelectionVariant);
							},
							getSelectOptionsPropertyNames: sinon.stub().returns([])
						}
					},
					navigate: sinon.stub()
				};
			}

			function getContext(sPath, isTransient) {
				return {
					getPath: sinon.stub().returns(sPath),
					isTransient: sinon.stub().returns(isTransient ? false : isTransient),
				}
			}
		});
