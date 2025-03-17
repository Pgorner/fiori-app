/**
 * tests for the sap.suite.ui.generic.template.lib.CreateWithDialogHandler
 */
sap.ui.define([ "testUtils/sinonEnhanced", "sap/ui/model/json/JSONModel",
				"sap/suite/ui/generic/template/genericUtilities/controlHelper",
                 "sap/suite/ui/generic/template/genericUtilities/testableHelper",
                    "sap/suite/ui/generic/template/lib/CreateWithDialogHandler",
                    "sap/suite/ui/generic/template/lib/CRUDHelper"
	], function(sinon, JSONModel, controlHelper, testableHelper, CreateWithDialogHandlerInstance, CRUDHelper) {
	"use strict";

	var sandbox;
	var sRequestedModelId;
	var sRequestedTextId;
	var sPath;
	var sGlobFunctionName;
	var oEntityType = {
			entityType: "testEntityType",
			"com.sap.vocabularies.UI.v1.Identification": [],
			"com.sap.vocabularies.UI.v1.LineItem": []
    };
    var oEntitySet = {
		name: "STTA_C_MP_Product",
		entityType: oEntityType
	};
	var mPrivateModelData = {
		generic: {
			listCommons : {
				breakoutActionsEnabled: {}
			},
			controlProperties: {}
		}
	};
	var oPrivateModel = new JSONModel(mPrivateModelData);
	oPrivateModel.getPendingChanges = function(){return null};
	oPrivateModel.resetChanges = function(){};
	var oModelObject = {};
	var oMetaModelObject = {};
    var aPages = [];
    CRUDHelper= {
        createNonDraft: function() {}
    };
	var oController = {
		getOwnerComponent : function() {
			return {
				getModel : function(sId) {},
				getEntitySet: function() {
					return oEntitySet.name;
				}
			};
		},
		getInnerAppState: Function.prototype,
		getView: function() {
			return {
				getModel: function(sModelName) {
					return oPrivateModel;
                },
                byId: function(sId) {
                }
			};
		},
		byId: function(sId) {
            if (sId === 'template:::ListReportAction:::CreateWithDialog') {
                var dialog = {
                   open: Function.prototype,
                   close: Function.prototype,
                   getVisible: Function.prototype,
                   setVisible: Function.prototype,
                   setModel: Function.prototype,
                   sId: "ListReport",
                   setEscapeHandler: Function.prototype,
                   getBindingContext: function() {
                       return {
                           getPath: Function.prototype
                       };
                   },
		getModel: function() {
			return {
				createEntry: Function.prototype
			}
		},
                   setBindingContext : Function.prototype,
                   getId: function() {return sId;},
                   getContent: Function.prototype
               };
               dialog.getBindingContext.getPath = Function.prototype;
               return dialog;
           } else if (sId === 'template:::ObjectPageAction:::CreateWithDialog') {
            var dialog = {
               open: Function.prototype,
               close: Function.prototype,
               getVisible: Function.prototype,
               setModel: Function.prototype,
               setEscapeHandler: Function.prototype,
               getModel: function() {
                   return {
                        createEntry: Function.prototype
                   }
               },
               sId: "ObjectPage",
               getBindingContext: function() {
                   return {
                       getPath: Function.prototype
                   };
               },
               setBindingContext : Function.prototype,
               getId: function() {return sId;},
               getContent: Function.prototype
           };
           dialog.getBindingContext.getPath = Function.prototype;
           return dialog;
       }
		}
    };
    var oTemplateUtils = {
        oCommonUtils: {
            getOwnerControl: function() {
                return {
                        type: "sap.ui.comp.smarttable.SmartTable",
                        getEntitySet : Function.prototype,
                        getId: Function.prototype,
                        getModel : Function.prototype,
                        getParent: function() {
                            return {
                                getBindingContext: Function.prototype
                            };
                        },
                        getTableBindingPath: Function.prototype
                        };
            },
            getContextText: function(){
            },
            refreshModel: Function.prototype,
            refreshSmartTable: Function.prototype
        },
        oComponentUtils: {
            isDraftEnabled: function () {
                return false;
			},
            fire: function(){}
        },
        oServices: {
            oApplication: {
                createNonDraft : function() {}
            },
            oTransactionController :{
                getDefaultValues : function(){}
            },
			oCRUDManager: {
				saveEntity : function(filter){
					return new Promise(function (resolve, reject) {
						resolve({});
					});
                },
                discardDraft: function() {

                },
                getDefaultValues: function(){
					return new Promise(function (resolve, reject) {
						resolve({});
					});
                }
			}
		},
		oCommonEventHandlers: {
			submitChangesForSmartMultiInput : function() {}
		}
};

var oTemplateUtilsDraft = {
    oCommonUtils: {
        getOwnerControl: function() {
            return {
                    type: "sap.ui.comp.smarttable.SmartTable",
                    getEntitySet : Function.prototype,
                    getId: Function.prototype,
                    getModel : Function.prototype, 
                    getParent: function() {
                        return {
                            getBindingContext: Function.prototype
                        };
                    }
                    };
        },
        getContextText: function(){
        }
    },
    oComponentUtils: {
        getViewLevel: function(){
            return 1;
        },
        isDraftEnabled: function () {
            return true;
        },
        getCRUDActionHandler : function(){
            return {
                handleCRUDScenario: Function.prototype
            };
        },
        fire: function(){}
    },
    oServices: {
        oApplication: {
            getBusyHelper: function() {
                return {
                    isBusy: function() {
                        return false;
                    },
                    setBusy: function() {
                    }
                };
            },
            getNavigationProperty: function(sProperty){
                return null;
            },
            performAfterSideEffectExecution : function(fnFunction){
                fnFunction();
            },
            getCurrentKeys: function(iViewLevel){
                return [""];
            },
            createNonDraft : function() {},
            registerContext: Function.prototype
        },
        oDraftController: {
            getDraftContext: function() {
                return {
                    isDraftEnabled: function () {
                        return false;
                    }
                };
            }
        }, 
        oTransactionController: {
        	getDefaultValues: function () {}
        },
        oDataLossHandler: {},
        oCRUDManager: {
            saveEntity : function(filter){
                return new Promise(function (resolve, reject) {
                    resolve({});
                });
            },
            activateDraftEntity : function(){
                return new Promise(function (resolve, reject) {
                    resolve({});
                });
            },
            deleteEntities : function(){},
            discardDraft : function(){},
            getDefaultValues: function(){
                return new Promise(function (resolve, reject) {
                    resolve({});
                });
            }
        }
    },
    oCommonEventHandlers: {
        submitChangesForSmartMultiInput : function() {},
        addEntry : function() {
            return new Promise(function (resolve, reject) {
                resolve();
            });
        }
    }
};

    var oState ={};
    var oEvent = {
        getSource : function() {
			return {
				getId:Function.prototype
			}
		}
    };

    var aResultFilters = {
        "aFilters": [
          {
            "oValue1": undefined,
            "sOperator": "StartsWith",
            "sPath": "fullTarget"
          },
          {
            "oValue1": "/STTA_C_MP_Product",
            "sOperator": "EQ",
            "sPath": "target"
          }
        ]
      };
    
    var CreateWithDialogHandler;
    var CreateWithDialogHandlerDraft = new CreateWithDialogHandlerInstance(oState, oController, oTemplateUtilsDraft);
	
	var oStubForPrivate;

	QUnit.module("CreateWithDialogHandler", {
		beforeEach : function() {
		    oStubForPrivate = testableHelper.startTest();
		    CreateWithDialogHandler = new CreateWithDialogHandlerInstance(oState, oController, oTemplateUtils);
			sandbox = sinon.sandbox.create();
			sandbox.stub(controlHelper, "isSmartTable", function(oTable){
            	return oTable.type === "sap.ui.comp.smarttable.SmartTable";
        	});
		},
		afterEach : function() {
			testableHelper.endTest();
			sandbox.restore();
		}
    });

    
    QUnit.test("Function fnActivateImpl", function(assert) {
        var oDialog = oController.byId("template:::ListReportAction:::CreateWithDialog");
        var Result = sandbox.stub(oStubForPrivate, "fnActivateImpl", function(){
            return oTemplateUtils.oServices.oCRUDManager.activateDraftEntity(oState.oCRUDActionHandler, oDialog.getBindingContext());
        });
        assert.equal(oDialog.getId(), "template:::ListReportAction:::CreateWithDialog", "Funciton should return dialog id");
    });

    QUnit.test("Function fnRemoveOldMessageFromModel", function(assert) {
        var Result = sandbox.stub(oStubForPrivate, "fnRemoveOldMessageFromModel", function(){
            var oMessageModel = sap.ui.getCore().getMessageManager().getMessageModel();
            var oContextFilter = aResultFilters;
            if (oContextFilter) {
                var oMessageBinding = oMessageModel.bindList("/", null, null, [oContextFilter]); // Note: It is necessary to create  binding each time, since UI5 does not update it (because there is no change handler)
                var aContexts = oMessageBinding.getContexts();
                if (aContexts.length) {
                    var aErrorToBeRemoved = [];
                    for (var oContext in aContexts) {
                        aErrorToBeRemoved.push(aContexts[oContext].getObject());
                    }
                    sap.ui.getCore().getMessageManager().removeMessages(aErrorToBeRemoved); //to remove error state from field
                }
            }
        });
        assert.equal(Result(), undefined, "Funciton does not return anything hence return undefined");
    });

    QUnit.test("Function fnGetFilterForCurrentState", function(assert) {
        var Result = sandbox.stub(oStubForPrivate, "fnGetFilterForCurrentState", function(){
            return aResultFilters;
        });
        assert.deepEqual(Result(), aResultFilters, "Funciton should return Filter");
    });

    
   /*  QUnit.test("Function onCancelPopUpDialog - Non draft app", function(assert) {
        var Result = CreateWithDialogHandler.onCancelPopUpDialog();
        assert.equal(Result, undefined, "function does not return anything");
    }); */


    QUnit.test("Function createWithDialog - List Report - Non draft app", function(assert) {
        var oDialog = oController.byId("template:::ListReportAction:::CreateWithDialog");
        var Result = CreateWithDialogHandler.createWithDialog(oDialog, "addEntry");
        assert.equal(Result, undefined, "function does not return anything");
    });

    QUnit.test("Function openDialog - List Report - Non draft app", function(assert) {
        var oDialog = oController.byId("template:::ListReportAction:::CreateWithDialog");
        var oTableSample = {
            type: "sap.ui.comp.smarttable.SmartTable",
            getEntitySet : Function.prototype,
            getId: Function.prototype,
            getModel : Function.prototype,
            getParent: function() {
                return {
                    getBindingContext: Function.prototype
                };
            },
            getTableBindingPath: Function.prototype
        };
        var Result = oStubForPrivate.openDialog(oDialog, "addEntry", undefined, oTableSample);
        assert.equal(Result, undefined, "function does not return anything");
    });

    QUnit.test("Function createWithDialog in case of Create with filters - List Report - Non draft app", function(assert) {
        var oDialog = oController.byId("template:::ListReportAction:::CreateWithDialog");
        var oPredefinedValues = {Supplier: "SAP"};
        var Result = CreateWithDialogHandler.createWithDialog(oDialog, "addEntry", oPredefinedValues );
        assert.equal(Result, undefined, "function does not return anything");
    });


    QUnit.test("Function onSavePopUpDialog - List Report - Non draft app", function(assert) {
        var Result = CreateWithDialogHandler.onSavePopUpDialog(oEvent);
        assert.equal(Result, undefined, "function does not return anything");
    });

    
    QUnit.test("Function createWithDialog - Object Page - Non draft app", function(assert) {
        var oDialog = oController.byId("template:::ObjectPageAction:::CreateWithDialog");
        var Result = CreateWithDialogHandler.createWithDialog(oDialog, "addEntry");
        assert.equal(Result, undefined, "function does not return anything");
    });


    QUnit.test("Function onSavePopUpDialog - Object Page - Non draft app", function(assert) {
        var Result = CreateWithDialogHandler.onSavePopUpDialog(oEvent);
        assert.equal(Result, undefined, "function does not return anything");
    });


    oTemplateUtils.oCommonUtils.isDraftEnabled = function() {
        return true;
    }

	/* QUnit.test("Function onCancelPopUpDialog - Draft app", function(assert) {
        var Result = CreateWithDialogHandlerDraft.onCancelPopUpDialog();
        assert.equal(Result, undefined, "function does not return anything");
	}); */
	
	QUnit.test("Function createWithDialog - List Report - Draft app", function(assert) {
        var oDialog = oController.byId("template:::ListReportAction:::CreateWithDialog");
        var Result = CreateWithDialogHandlerDraft.createWithDialog(oDialog, "addEntry");
        assert.equal(Result, undefined, "function does not return anything");
    });
    
    QUnit.test("Function createWithDialog in case of Create with filters - List Report - Draft app", function(assert) {
        var oDialog = oController.byId("template:::ListReportAction:::CreateWithDialog");
        var oPredefinedValues = {Supplier: "SAP"};
        var Result = CreateWithDialogHandler.createWithDialog(oDialog, "addEntry", oPredefinedValues );
        assert.equal(Result, undefined, "function does not return anything");
    });
	
	QUnit.test("Function onSavePopUpDialog - List Report - Draft app", function(assert) {
        var Result = CreateWithDialogHandlerDraft.onSavePopUpDialog(oEvent);
        assert.equal(Result, undefined, "function does not return anything");
	});
});
