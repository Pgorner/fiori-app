sap.ui.define([
    "sap/ui/model/odata/v2/Context",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/suite/ui/generic/template/lib/ContextBookkeeping"
], function (Context, ODataModel, ContextBookkeeping) {

    var oSandbox;
    var oContextBookkeeping;

    var mTreeNodes = {
        C_STTA_SalesOrder_WD_20: {
            level: 1,
            entitySet: "C_STTA_SalesOrder_WD_20",
            getPath: function (iMode, aKeys) {
                var sLastKey = aKeys[aKeys.length - 1];
                return "/C_STTA_SalesOrder_WD_20(" + sLastKey + ")";
            } 
        },
        C_STTA_SalesOrderItem_WD_20: {
            level: 2,
            entitySet: "C_STTA_SalesOrderItem_WD_20",
            getPath: function (iMode, aKeys) {
                var sLastKey = aKeys[aKeys.length - 1];
                return "/C_STTA_SalesOrderItem_WD_20(" + sLastKey + ")";
            }
        }
    };

    var oTemplateContract = {
        oAppComponent: {
            getTransactionController: function () {
                return {
                    getDraftController: function () {
                        return {
                            getDraftContext: function () {
                                return {
                                    hasDraft: sinon.stub().returns(true) // Stub for "isDraftSupported"
                                }
                            }
                        }
                    }
                }
            }
        },
        oApplicationProxy: {
            fillSiblingKeyPromise: function (oTreeNode, aKeysFromIdentity, aActiveKeys) {
                // Fill "aActiveKeys"
                aKeysFromIdentity.forEach(function (sKey) {
                    var sResult = sKey ? sKey.replace("false", "true"): "";
                    aActiveKeys.push(sResult);
                });
                return Promise.resolve(oTreeNode);
            },
            getAncestralNode: sinon.stub().returns(mTreeNodes["C_STTA_SalesOrder_WD_20"])
        },
        mEntityTree: mTreeNodes,
        oBusyHelper: {
            getUnbusy: function () {
                return Promise.resolve()
            }
        }    
    };

    var sActiveRootPath = "/C_STTA_SalesOrder_WD_20(SalesOrder='123',IsActiveEntity=true)";
    var sDraftRootPath = "/C_STTA_SalesOrder_WD_20(SalesOrder='123',IsActiveEntity=false)";
    var sActiveChildPath =  "/C_STTA_SalesOrderItem_WD_20(SalesOrder='123',SalesOrderItem='456',IsActiveEntity=true)";
    var sDraftChildPath = "/C_STTA_SalesOrderItem_WD_20(SalesOrder='123',SalesOrderItem='456',IsActiveEntity=false)";

    var mCtxObjects = {
        "/C_STTA_SalesOrder_WD_20(SalesOrder='123',IsActiveEntity=true)": {
            IsActiveEntity: true
        },
        "/C_STTA_SalesOrder_WD_20(SalesOrder='123',IsActiveEntity=false)": {
            IsActiveEntity: false,
            HasActiveEntity: true
        },
        "/C_STTA_SalesOrderItem_WD_20(SalesOrder='123',SalesOrderItem='456',IsActiveEntity=true)": {
            IsActiveEntity: true
        },
        "/C_STTA_SalesOrderItem_WD_20(SalesOrder='123',SalesOrderItem='456',IsActiveEntity=false)": {
            IsActiveEntity: false,
            HasActiveEntity: true
        }
    };
    // Creating models and contexts
    var oModel = new ODataModel("/SalesOrderSrv");

    var oMetaModel = {
        getODataEntitySet: sinon.stub().returns({entityType: ""}),
        getODataEntityType: sinon.stub().returns({})
    };

    var oActiveRootCtx = new Context(oModel, sActiveRootPath);
    var oDraftRootCtx = new Context(oModel, sDraftRootPath);
    var oActiveChildCtx = new Context(oModel, sActiveChildPath, (sActiveRootPath + sActiveChildPath.replace("C_STTA_SalesOrderItem_WD_20", "to_Item")));
    var oDraftChildCtx = new Context(oModel, sDraftChildPath, (sDraftRootPath + sDraftChildPath.replace("C_STTA_SalesOrderItem_WD_20", "to_Item")));

    oModel.mContexts = {
        "/C_STTA_SalesOrder_WD_20(SalesOrder='123',IsActiveEntity=true)": oActiveRootCtx,
        "/C_STTA_SalesOrder_WD_20(SalesOrder='123',IsActiveEntity=false)": oDraftRootCtx,
        "/C_STTA_SalesOrderItem_WD_20(SalesOrder='123',SalesOrderItem='456',IsActiveEntity=true)": oActiveChildCtx,
        "/C_STTA_SalesOrderItem_WD_20(SalesOrder='123',SalesOrderItem='456',IsActiveEntity=false)": oDraftChildCtx
    };

    QUnit.module("Tests for context bookkeeping", {
        beforeEach: () => {
            oSandbox = sinon.sandbox.create();

            // Stub for meta model
            oSandbox.stub(oModel, "getMetaModel").returns(oMetaModel);

            //Stubs for getObject methods
            oSandbox.stub(oActiveRootCtx, "getObject").returns(mCtxObjects[sActiveRootPath]);
            oSandbox.stub(oDraftRootCtx, "getObject").returns(mCtxObjects[sDraftRootPath]);
            oSandbox.stub(oActiveChildCtx, "getObject").returns(mCtxObjects[sActiveChildPath]);
            oSandbox.stub(oDraftChildCtx, "getObject").returns(mCtxObjects[sDraftChildPath]);
            // Instantiate context bookkeeping
            oContextBookkeeping = new ContextBookkeeping(oTemplateContract);
        },
        afterEach: () => { 
            oSandbox.restore();
            oContextBookkeeping = null;
        }
    });

    QUnit.test("Checking the context invalidations on activation", function (assert) {
        var done = assert.async();
        // User visits the active root node and it gets registered
        var aActiveRootKeys = [
            "", 
            "SalesOrder='123',IsActiveEntity=true"
        ];
        oContextBookkeeping.registerContext(oActiveRootCtx, 1, "C_STTA_SalesOrder_WD_20", aActiveRootKeys);
        // Prepare the editing promise which returns the draft root
        var oEditingPromise = Promise.resolve({
            context: oDraftRootCtx
        });
        // Edits the active root
        oContextBookkeeping.editingStarted(oActiveRootCtx, oEditingPromise);

        oEditingPromise.then(function () {
            // User is navigated to the draft root node and it gets registered
            var aDraftRootKeys = [
                "", 
                "SalesOrder='123',IsActiveEntity=false"
            ];
            oContextBookkeeping.registerContext(oDraftRootCtx, 1, "C_STTA_SalesOrder_WD_20", aDraftRootKeys);

            // User visits the draft child node
            var aDraftChildKeys = [
                "", 
                "SalesOrder='123',IsActiveEntity=false",
                "SalesOrder='123',SalesOrderItem='456',IsActiveEntity=false"
            ];
            oContextBookkeeping.registerContext(oDraftChildCtx, 2, "C_STTA_SalesOrderItem_WD_20", aDraftChildKeys);

            // Wait for the async operations on the above registrations get completed
            Promise.resolve().then(function () {
                var oInvalidateEntryStub = oSandbox.stub(oModel, "invalidateEntry");
                // User activates the draft root record
                var oActivationPromise = Promise.resolve({
                    context: oActiveRootCtx
                });
                oContextBookkeeping.activationStarted(oDraftRootCtx, oActivationPromise);
                // Wait for the activation gets completed
                Promise.all([oActivationPromise, oTemplateContract.oBusyHelper.getUnbusy()]).then(function () {
                    // Check the invalidation
                    assert.equal(oInvalidateEntryStub.callCount, 3, "Invalidate entry is called thrice");
                    assert.equal(oInvalidateEntryStub.args[0][0], sActiveChildPath, "First invalidation: active child node");
                    assert.equal(oInvalidateEntryStub.args[1][0].getPath(), sDraftRootPath, "Second invalidation: draft root node");
                    assert.equal(oInvalidateEntryStub.args[2][0].getPath(), sDraftChildPath, "Third invalidation: draft child node");
                    // Done with the test case
                    done();
                });
            });
        });
        // End of test case
    });

});