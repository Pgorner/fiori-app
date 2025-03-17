/*
 * tests for the sap.suite.ui.generic.template.ObjectPage.controller.InlineCreationRowsHelper
 */

sap.ui.define([
    "testUtils/sinonEnhanced",
    "sap/suite/ui/generic/template/ObjectPage/controller/inlineCreationRows/InlineCreationRowsHelper",
    "sap/suite/ui/generic/template/genericUtilities/controlHelper",
    "sap/ui/comp/smarttable/SmartTable",
    "sap/ui/model/odata/v2/Context",
    "sap/m/Table",
	"sap/m/Column",
    "sap/ui/core/CustomData",
    "sap/ui/base/Event",
    "sap/ui/model/json/JSONModel"
], function (sinon, InlineCreationRowsHelper, controlHelper, SmartTable, Context, 
    ResponsiveTable, ResponsiveTableColumn, CustomData, Event, JSONModel) {
    "use strict";

    //Emulating table row item
    function TableRowItem(sPath, bInactive, bTransient, sInitialType) {
        this.sPath = sPath;
        this.bInactive = bInactive;
        this.bTransient = bTransient;
        this.sType = sInitialType;
        var self = this;

        this.setType = function (sType) {
            this.sType = sType;
        }

        this.getProperty = function (propName) {
            if (propName === 'type') {
                return this.sType;
            }
            return '';
        }

        this.getBindingContext = function () {
            return oContext
        }
        this.getCells = function () {
            return [];
        }
        this.getBinding = function(sType) {
            return {
                getPath : function() {
                    self.getProperty(sType);
                }
            }
        },
        this.getDomRef = function () {
            return {};
        },
        this.getSelected = function () {
            return false;
        },
        this.getDeleteControl = function () {},
        this.bindProperty = function() {}
    };

    function fnGetSmartTableCreationMode(oSmartTable) {
		return oSmartTable.data("creationMode");
	}

    var oContext = {
        getPath: function () {
            return self.sPath;
        },
        isInactive: function () {
            return self.bInactive;
        },
        isTransient: function () {
            return self.bTransient;
        },
        created : function() {
            return Promise.resolve();
        }
    }

    var inactiveRow1 = new TableRowItem('Item-1', true, false, 'Navigation');
    var inactiveRow2 = new TableRowItem('Item-2', true, false, 'Navigation');
    var transientRow1 = new TableRowItem('Item-2', true, true, "@$ui5.context.isTransient");
    var tableItems = [inactiveRow1, inactiveRow2, transientRow1];

    //oController
    var oController = {
        byId: function() {
            return oObjectPage;
        }
    }

    var oObjectPageModel = new JSONModel({
        "Create_ac": false
    });

    var oUIModel = new JSONModel({
        "editable": true
    });

    var oObjectPageContext = new Context(oObjectPageModel, "/objectPagePath");
    var oObjectPage = {
        getBindingContext: function () {
            return oObjectPageContext;
        },
        getModel: function(sName) {
            if (sName === "ui") {
                return oUIModel;
            }
            return oObjectPageModel;
        }
    }

    var oTemplateUtils = {
        oComponentUtils: {
            getTemplatePrivateModel: function() {
                return {
                    getProperty: function() {
                        return 2;
                    }
                }
            },
            isDraftEnabled: function() {
                return true;
            }
        },
        oServices: {
            oApplication: {
                getDraftInfoForContext: function() {
                    return {
                        bIsDraft: true
                    }
                },
                getBusyHelper: function () {
                    return {
                        getUnbusy: function () {
                            return {
                                then: function (callback) {
                                    callback.call(null);
                                }
                            }
                        }
                    }
                }
            },
            oCRUDManager: {
                getDefaultValues: function () {
                    return null;
                },
                getUnfilledProperties: function () {
                    return [];
                }
            },
            oPresentationControlHandlerFactory: {
                getPresentationControlHandler: function () {
                    return {
                        isMTable: function () {
                            return true;
                        },
                        isLengthFinal: function () {
                            return true;
                        },
                        getBinding: function () {
                            return oResponsiveTableItemsBinding;
                        }
                    }
                }
            },
            oApplicationController: {
                executeSideEffects: function() {
                    return true;
                }
            }
        }
    }

    var oMTable = {
        getItems: function () {
            return tableItems;
        }
    }
    
    //Smart table
    var oSmartTable = {
        getId: function () {
            return 'SmartTable-ProductText';
        },
        getToolbar: function () {
            return {
                getContent: function () {
                    return [];
                } 
            }
        },
        getItems: function () {
            return [oMTable];
        },
        data: function (sPath) {
            if (sPath === "isEntityCreatableUsingBooleanRestrictions") {
                return "true";
            } else if (sPath === "isEntityCreatableUsingPathRestrictions") {
                return true;
            } else if (sPath === "creationMode") {
                return "creationRows";
            } else if (sPath === "inlineCreationRowsConfig") {
                return {
                    requiredProps: "",
                    nonInsertableProperties: []
                };
            }
            return true;
        },
        getTable: Function.prototype,
        getBindingContext: function() {
            return oContext;
        },
        getTableBindingPath: function() {
            return "to_Item";
        },
        attachUiStateChange: Function.prototype
    };

    //Responsive table
    var oResponsiveTable = {
        isA: function (tableType) {
            return tableType === 'sap.m.Table';
        },
        getId: function () {
            return 'responsiveTable';
        },
        getBinding: Function.prototype,
        getAggregation: Function.prototype,
        getItems: function() {
            return tableItems;
        },
        addEventDelegate: function (oDelegate){
            for (var sEventType in oDelegate) {
                var fnEventListener = oDelegate[sEventType];
                //Immediately invoke the event listeners
                fnEventListener.call(undefined);
            }
        },
        getDomRef: function () {
            return {};
        },
        getParent: function () {
            return oSmartTable;
        },
        getColumns: function () {
            return [];
        },
        
        removeEventDelegate: Function.prototype
    }

    var createActivateHandler;
    var oActivateEvent = {
        getParameter : function(sParam) {
            if (sParam === "context") {
                return oContext;
            } 
        }
    };
    //Items binding of responsive table
    var oResponsiveTableItemsBinding = {
        isLengthFinal: Function.prototype,
        isFirstCreateAtEnd: function () { return; },
        getContext: function () { return {}; },
        attachCreateActivate: function (fnHandler) { 
            createActivateHandler = fnHandler;
            return; 
        },
        fireCreateActivate: function () {
            createActivateHandler && createActivateHandler(oActivateEvent);
        },
        create: Function.prototype,
        getAllCurrentContexts: function () {return []; },
        isResolved: function () {return true;}
    };

    //UIModel
    var oUIModelEditable = {
        getProperty: function (prop) {
            if (prop === '/editable') {
                return true;
            }
        },
        bindProperty: function (prop) {
            return {
                attachChange: function () {
                    return;
                }
            }
        }
    };

    var oInlineCreationRowsHelper = new InlineCreationRowsHelper(oObjectPage, oTemplateUtils, fnGetSmartTableCreationMode);
    oInlineCreationRowsHelper.onBeforeRebindObjectPage();

    var oSandbox;
    QUnit.module("Inline Creation Rows", {
        beforeEach: function () {
            oSandbox = sinon.sandbox.create();
            oSandbox.stub(controlHelper, "isMTable").returns(true);
            oSandbox.stub(oSmartTable, "getTable").returns(oResponsiveTable);
            oSandbox.stub(oResponsiveTable, "getAggregation").returns([]);
            oSandbox.stub(oResponsiveTable, "getBinding").withArgs("items").returns(oResponsiveTableItemsBinding);
        },
        afterEach: function () {
            oSandbox.restore();
        }
    });

    QUnit.test("When responsive table is in edit mode, 1 inline row should be created", function (assert) {
        //Setup
        var done = assert.async();
        oSandbox.stub(oResponsiveTable, "getItems").returns([]);

        var oTableBindingCreateSpy = sinon.spy(oResponsiveTableItemsBinding, 'create');
        //Action
        oInlineCreationRowsHelper.addCreationRows(oSmartTable, null).then(function() {
            //Validation
            assert.equal(oTableBindingCreateSpy.callCount, 1, "The 'create' method of table's item binding should be called once");
            //Cleanup
            oTableBindingCreateSpy.restore();
            done();
        });
    });

    QUnit.test("One inline row should be created on user input", function (assert) {
        //Setup
        var done = assert.async();
        oSandbox.stub(oResponsiveTable, "getItems").returns([]);

        var oTableBindingCreateSpy = sinon.spy(oResponsiveTableItemsBinding, 'create');
        //Action
        oInlineCreationRowsHelper.addCreationRows(oSmartTable, true).then(function() {
            //Validation
            assert.equal(oTableBindingCreateSpy.callCount, 1, "The 'create' method of table's item binding should be called once");
            //Cleanup
            oTableBindingCreateSpy.restore();
            done();
        });
    });

    QUnit.test("When the current inline creation row is edited, it should trigger the structural side effects", function (assert){
        // Setup
        var done = assert.async();
        var oExecuteSideEffectsSpy = sinon.spy(oTemplateUtils.oServices.oApplicationController, "executeSideEffects");

        oInlineCreationRowsHelper.addCreationRows(oSmartTable, false).then(function() {
            // Action (fire "createActivate" event)
            oResponsiveTableItemsBinding.fireCreateActivate();
            // Validation
            assert.equal(oExecuteSideEffectsSpy.callCount, 1, "ApplicationController.executeSideEffects is called once");
            // Cleanup
            oExecuteSideEffectsSpy.restore();
            done();
        });
    });

    QUnit.test("When table is configured with creatable path, a new binding should be created for creatable path", function (assert) {
        // Setup
        var oResponsiveColumn = new ResponsiveTableColumn();
	    var oResponsiveTable = new ResponsiveTable({
			columns: [oResponsiveColumn]
		});
		var oSmartTable2 = new SmartTable({
            entitySet: "foo",
            tableType: "ResponsiveTable",
            items: oResponsiveTable
        });

        oSmartTable2.setBindingContext(oObjectPageContext);
        // Add custom data related to "inlineCreationRows"
        oSmartTable2.addCustomData(new CustomData({
            key: "creationMode",
            value: "creationRows"
        }));
        //Custom data for "creatable path"
        oSmartTable2.addCustomData(new CustomData({
            key: "inlineCreationRowsConfig",
            value: {
                creatablePath: {
                    creatable: "Create_ac"
                }
            }
        }));
        oSmartTable2.addCustomData(new CustomData({
            key: "isCreationAllowedByBoolAndPathRestrictions",
            value: "true"
        }));
        
        var oBindingParams = {
            events: {}
        };
        // Register and fire "beforeRebindTable" event
        oSmartTable2.attachBeforeRebindTable(oInlineCreationRowsHelper.onBeforeRebindControl);
        oSmartTable2.fireBeforeRebindTable({
            bindingParams: oBindingParams
        });
        // Act
        // Fire "dataReceived" event
        oBindingParams.events.dataReceived(new Event("dataReceived", oSmartTable2, {}));
            
        //Assert
        //Check whether a new binding is created on object page with "creatable path"
        var oCreatablePathBinding = oObjectPageModel.getBindings().find(function (oBinding) {
            return oBinding.getPath() === "Create_ac"
        });

        assert.ok(oCreatablePathBinding, "Creatable path binding is created");

    });

    QUnit.test("When the dataRequested event of the table is fired the default value promise should be created", function (assert) {
        var oResponsiveColumn = new ResponsiveTableColumn();
        var oResponsiveTable = new ResponsiveTable({
            columns: [oResponsiveColumn]
        });
        var oNewSmartTable = new SmartTable("newSmartTable1", {
            entitySet: "foo",
            tableType: "ResponsiveTable",
            items: oResponsiveTable
        });
        // Add custom data related to "inlineCreationRows"
        oNewSmartTable.addCustomData(new CustomData({
            key: "creationMode",
            value: "creationRows"
        }));
        var oBindingParams = {
            events: {}
        }
        var oEvent = {
            getSource: function () {
                return oNewSmartTable
            },
            getParameters: function () {
                return {
                    bindingParams: oBindingParams
                }
            }
        }
        oSandbox.stub(oNewSmartTable, "getBindingContext", function () {
            return {
                getObject: function () {
                    return {}
                }
            }
        });
        var oGetIdSpy = oSandbox.spy(oNewSmartTable, "getId");
        oInlineCreationRowsHelper.onBeforeRebindControl(oEvent);
        oBindingParams.events.dataRequested(oEvent);
        assert.ok(oGetIdSpy.calledOnce, "The DVF promise should be created during the dataRequested event of the table");
    });
});