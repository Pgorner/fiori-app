sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/suite/ui/generic/template/genericUtilities/AjaxHelper",
    "sap/suite/ui/generic/template/manifestMerger/AddNewObjectPage",
    "sap/ui/fl/write/api/ChangesWriteAPI",
    "sap/ui/fl/Layer"
],  function (UIComponent, AjaxHelper, AddNewObjectPage, ChangesWriteAPI, Layer) {
    "use strict";

    /**
    * This class contains the QUnit test functions for the sap.suite.ui.generic.template.manifestMerger.AddNewObjectPage function
    * @namespace sap.suite.ui.generic.template.qunit.manifestMerger.AddNewObjectPageTest
    * @private
    */

    var sManifestUrl = "test-resources/sap/suite/ui/generic/template/qunit/manifestMerger/testData/manifestExtend.json",
    oManifest1 = AjaxHelper.syncGetJSON(sManifestUrl).data;

    var sRawManifestCase1Url = "test-resources/sap/suite/ui/generic/template/qunit/manifestMerger/testData/rawManifestNoSubObjectPage.json",
    oRawManifestCase1 = AjaxHelper.syncGetJSON(sRawManifestCase1Url).data;

    var sRawManifestCase2Url = "test-resources/sap/suite/ui/generic/template/qunit/manifestMerger/testData/rawManifestWithSubObjectPage.json",
    oRawManifestCase2 = AjaxHelper.syncGetJSON(sRawManifestCase2Url).data;

    var sRawManifestWithEmbeddedComponent = "test-resources/sap/suite/ui/generic/template/qunit/manifestMerger/testData/rawManifestWithEmbeddedComponent.json",
    oRawManifestWithEmbeddedComponent = AjaxHelper.syncGetJSON(sRawManifestWithEmbeddedComponent).data;

    var Component = UIComponent.extend("component", {});
    var oComponent = new Component("dummyComponent");

    // ***MAIN OP ADD NEW NODES*** //
    QUnit.test("Case1:Add new sub object page when mainOP has no sub-ObjectPages", function (assert) {
        var oManifest = oRawManifestCase1["sap.ui.generic.app"];
        return Promise.resolve(ChangesWriteAPI.create({
            changeSpecificData: {
                "changeType": "appdescr_ui_generic_app_addNewObjectPage",
                "layer": Layer.CUSTOMER,
                "content": {
                    "parentPage" : {
                        "component": "sap.suite.ui.generic.template.ObjectPage",
                        "entitySet": "C_STTA_SalesOrder_WD_20"
                    },
                    "childPage": {
                        "id": "customer.ObjectPage|to_extendedNode",
                        "definition": {
                            "navigationProperty": "to_extendedNode",
                            "entitySet": "C_STTA_ExtendedNode"
                        }
                    }
                }
            },
            selector: oComponent
        })).then(function(oChange) {
            var oChangeContent = oChange.store().getContent();
            var oModifiedManifest = AddNewObjectPage.applyChange(oRawManifestCase1, oChange.store());

            console.log("Modified Manifest case 1", oModifiedManifest);
            var oMainOP_Pages = oManifest["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["pages"]["ObjectPage|C_STTA_SalesOrder_WD_20"];
            assert.deepEqual(oMainOP_Pages.pages.hasOwnProperty("customer.ObjectPage|to_extendedNode"), true,
                "customer.ObjectPage|to_extendedNode_C_STTA_ExtendedNode Node added as Expected");
            assert.deepEqual(oMainOP_Pages.pages["customer.ObjectPage|to_extendedNode"], oChangeContent.childPage.definition,
                "Extended Node added as Expected");
            assert.deepEqual(oMainOP_Pages.pages["customer.ObjectPage|to_extendedNode"].hasOwnProperty("component"), true,
            "Component property added");
        });
    });

    QUnit.test("Case2:Add subObjectpage at level 2 when mainOP has other sub-ObjectPages", function (assert) {
        oManifest1 = AjaxHelper.syncGetJSON(sManifestUrl).data;
        var oNewPageSet = oManifest1["sap.ui.generic.app"];
        return Promise.resolve(ChangesWriteAPI.create({
            changeSpecificData: {
                "changeType": "appdescr_ui_generic_app_addNewObjectPage",
                "layer": Layer.CUSTOMER,
                "content": {
                    "parentPage" : {
                        "component": "sap.suite.ui.generic.template.ObjectPage",
                        "entitySet": "STTA_C_MP_Product"
                    },
                    "childPage": {
                        "id": "customer.ObjectPage|to_extendedNode",
                        "definition": {
                            "navigationProperty": "to_extendedNode",
                            "entitySet": "C_STTA_ExtendedNode"
                        }
                    }
                }
            },
            selector: oComponent
        })).then(function(oChangewithPageLevel2) {
            var oChangewithPageLevel2Content = oChangewithPageLevel2.store().getContent();
            var oModifiedManifest = AddNewObjectPage.applyChange(oManifest1, oChangewithPageLevel2.store());

            console.log("FinalManifest after adding extendedNode", oModifiedManifest);
            var oMainOP_Pages = oNewPageSet["pages"]["ListReport|STTA_C_MP_Product"]["pages"]["ObjectPage|STTA_C_MP_Product"];
            assert.deepEqual(oMainOP_Pages["pages"]["customer.ObjectPage|to_extendedNode"], oChangewithPageLevel2Content.childPage.definition,
                "Extended Node added as Expected");
                assert.deepEqual(oMainOP_Pages.pages["customer.ObjectPage|to_extendedNode"]["component"].hasOwnProperty("name"), true,
                "Component property added");
        });
    });

    // *** ADD NEW NODE with SUBOP as parent, new node at LEVEL >= 3 *** //
    QUnit.test("Case3:Add subObjectpage at level 3 when subOP doesn't have child pages", function (assert) {
        oManifest1 = AjaxHelper.syncGetJSON(sManifestUrl).data;
        var oNewPageSet = oManifest1["sap.ui.generic.app"];

        return Promise.resolve(ChangesWriteAPI.create({
            changeSpecificData: {
                "changeType": "appdescr_ui_generic_app_addNewObjectPage",
                "layer": Layer.CUSTOMER,
                "content": {
                    "parentPage" : {
                        "component": "sap.suite.ui.generic.template.ObjectPage",
                        "entitySet": "STTA_C_MP_ProductSalesData"
                    },
                    "childPage": {
                        "id": "customer.ObjectPage|to_extendedNode",
                        "definition": {
                            "navigationProperty": "to_extendedNode",
                            "entitySet": "C_STTA_ExtendedNode"
                        }
                    }
                }
            },
            selector: oComponent
        })).then(function(oChangewithoutPageLevel3) {
            var oChangePageLevel3Content = oChangewithoutPageLevel3.store().getContent();
            var oModifiedManifest = AddNewObjectPage.applyChange(oManifest1, oChangewithoutPageLevel3.store());
            console.log("FinalManifest after adding a new subOP extendedNode at level 3", oModifiedManifest);
            var oMainOP_Pages = oNewPageSet["pages"]["ListReport|STTA_C_MP_Product"]["pages"]["ObjectPage|STTA_C_MP_Product"]["pages"]["ObjectPage|to_ProductSalesData"];
            assert.deepEqual(oMainOP_Pages["pages"]["customer.ObjectPage|to_extendedNode"], oChangePageLevel3Content.childPage.definition,
                "Extended Node added as Expected");
        });
    });

    QUnit.test("Case 4: Add subObjectpage at level 3 when subOP have child pages", function (assert) {
        oManifest1 = AjaxHelper.syncGetJSON(sManifestUrl).data;
        var oNewPageSet = oManifest1["sap.ui.generic.app"];
        return Promise.resolve(ChangesWriteAPI.create({
            changeSpecificData: {
                "changeType": "appdescr_ui_generic_app_addNewObjectPage",
                "layer": Layer.CUSTOMER,
                "content": {
                    "parentPage" : {
                        "component": "sap.suite.ui.generic.template.ObjectPage",
                        "entitySet": "STTA_C_MP_ProductText"
                    },
                    "childPage": {
                        "id": "customer.ObjectPage|to_extendedNode",
                        "definition": {
                            "navigationProperty": "to_extendedNode",
                            "entitySet": "C_STTA_ExtendedNode"
                        }
                    }
                }
            },
            selector: oComponent
        })).then(function(oChangewithoutPageLevel3) {
            var oChangePageLevel3Content = oChangewithoutPageLevel3.store().getContent();
            var oModifiedManifest = AddNewObjectPage.applyChange(oManifest1, oChangewithoutPageLevel3.store());
            console.log("FinalManifest after adding a new subOP extendedNode at level 3 along with other subobject pages", oModifiedManifest);
            var oMainOP_Pages = oNewPageSet["pages"]["ListReport|STTA_C_MP_Product"]["pages"]["ObjectPage|STTA_C_MP_Product"]["pages"]["ObjectPage|to_ProductText"];
            assert.deepEqual(oMainOP_Pages["pages"]["customer.ObjectPage|to_extendedNode"], oChangePageLevel3Content.childPage.definition,
                "Extended Node added as Expected");
        });
    });

    QUnit.test("Case 5: Add subObjectpage at level > 3", function (assert) {
        oManifest1 = AjaxHelper.syncGetJSON(sManifestUrl).data;
        var oNewPageSet = oManifest1["sap.ui.generic.app"];
        return Promise.resolve(ChangesWriteAPI.create({
            changeSpecificData: {
                "changeType": "appdescr_ui_generic_app_addNewObjectPage",
                "layer": Layer.CUSTOMER,
                "content": {
                    "parentPage" : {
                        "component": "sap.suite.ui.generic.template.ObjectPage",
                        "entitySet": "C_STTA_SalesOrderItem_WD_20"
                    },
                    "childPage": {
                        "id": "customer.ObjectPage|to_extendedNode",
                        "definition": {
                            "navigationProperty": "to_extendedNode",
                            "entitySet": "C_STTA_ExtendedNode"
                        }
                    }
                }
            },
            selector: oComponent
        })).then(function(oChangewithoutPageLevel3) {
            var oChangePageLevel3Content = oChangewithoutPageLevel3.store().getContent();
            var oModifiedManifest = AddNewObjectPage.applyChange(oManifest1, oChangewithoutPageLevel3.store());
            console.log("FinalManifest after adding a new subOP extendedNode at level > 3", oModifiedManifest);
            var oMainOP_Pages = oNewPageSet["pages"]["ListReport|STTA_C_MP_Product"]["pages"]["ObjectPage|STTA_C_MP_Product"]["pages"]["ObjectPage|to_ProductText"]["pages"]["ObjectPage|to_Item"];
            assert.deepEqual(oMainOP_Pages["pages"]["customer.ObjectPage|to_extendedNode"], oChangePageLevel3Content.childPage.definition,
                "Extended Node added as Expected");
        });
    });

    QUnit.test("Case 6: Failure scenario - Add subObjectpage and subsub object page", function (assert) {
        return Promise.resolve(ChangesWriteAPI.create({
            changeSpecificData: {
                "changeType": "appdescr_ui_generic_app_addNewObjectPage",
                "layer": Layer.CUSTOMER,
                "content": {
                    "parentPage" : {
                        "component": "sap.suite.ui.generic.template.ObjectPage",
                        "entitySet": "C_STTA_SalesOrderItem_WD_20"
                    },
                    "childPage": {
                        "id": "customer.ObjectPage|to_extendedNode",
                        "definition": {
                            "navigationProperty": " to_extendedNode ",
                            "entitySet": " C_STTA_ExtendedNode ",

                            "pages": {
                                "customer.ObjectPage|to_extendedSubNode": {
                                        "navigationProperty": " to_extendedSubNode ",
                                        "entitySet": "C_STTA_SubExtendedNode"
                                }
                            }
                        }
                    }
                }
            },
            selector: oComponent
        })).then(function(oChangewithoutPageLevel3) {
            assert.throws(function () {
                AddNewObjectPage.applyChange(oRawManifestCase2, oChangewithoutPageLevel3.store());
            }, Error("Changing pages is not supported. The supported 'propertyPath' is: navigationProperty,entitySet"), "throws an error");
        });
    });

    QUnit.test("Case 7: Failure scenario - Adding same node key again ", function (assert) {
        oManifest1 = AjaxHelper.syncGetJSON(sManifestUrl).data;
        return Promise.resolve(ChangesWriteAPI.create({
            changeSpecificData: {
                "changeType": "appdescr_ui_generic_app_addNewObjectPage",
                "layer": Layer.VENDOR,
                "content": {
                    "parentPage" : {
                        "component": "sap.suite.ui.generic.template.ObjectPage",
                        "entitySet": "C_STTA_SalesOrderItem_WD_20"
                    },
                    "childPage": {
                        "id": "ObjectPage|to_ItemScheduleLine",
                        "definition": {
                            "navigationProperty": "to_ItemScheduleLine",
                            "entitySet": "C_STTA_SalesOrderItemSL_WD_20"
                        }
                    }
                }
            },
            selector: oComponent
        })).then(function(oChangewithoutPageLevel3) {
            assert.throws(function () {
                 AddNewObjectPage.applyChange(oManifest1, oChangewithoutPageLevel3.store());
             }, Error("Adding duplicate pageKey ObjectPage|to_ItemScheduleLine is not supported."), "throws an error");
        });
    });

    QUnit.test("Case 8: Failure scenario - Adding unsupported property ", function (assert) {
        oManifest1 = AjaxHelper.syncGetJSON(sManifestUrl).data;
        return Promise.resolve(ChangesWriteAPI.create({
            changeSpecificData: {
                "changeType": "appdescr_ui_generic_app_addNewObjectPage",
                "layer": Layer.CUSTOMER,
                "content": {
                    "parentPage" : {
                        "component": "sap.suite.ui.generic.template.ObjectPage",
                        "entitySet": "C_STTA_SalesOrderItem_WD_20"
                    },
                    "childPage": {
                        "id": "customer.ObjectPage|to_extendedNode",
                        "definition": {
                            "navigationProperty": "to_extendedNode",
                            "entitySet": "C_STTA_ExtendedNode",
                            "component": {
                                "name": "sap.suite.ui.generic.template.ObjectPage"
                            }
                        }
                    }
                }
            },
            selector: oComponent
        })).then(function(oChangewithoutPageLevel3) {
            assert.throws(function () {
                AddNewObjectPage.applyChange(oManifest1, oChangewithoutPageLevel3.store());
            }, Error("Changing component is not supported. The supported 'propertyPath' is: navigationProperty,entitySet"), "throws an error");
        });
    });

    QUnit.test("Case 9: Failure scenario - Wrong pages type ", function (assert) {
        return Promise.resolve(ChangesWriteAPI.create({
            changeSpecificData: {
                "changeType": "appdescr_ui_generic_app_addNewObjectPage",
                "layer": Layer.CUSTOMER,
                "content": {
                    "parentPage" : {
                        "component": "sap.suite.ui.generic.template.ObjectPage",
                        "entitySet": "TestEntity"
                    },
                    "childPage": {
                        "id": "customer.ObjectPage|to_extendedNode",
                        "definition": {
                            "navigationProperty": " to_extendedNode ",
                            "entitySet": " C_STTA_ExtendedNode "
                        }
                    }
                }
            },
            selector: oComponent
        })).then(function(oChangewithoutPageLevel3) {
            assert.throws(function () {
                AddNewObjectPage.applyChange(oRawManifestCase2, oChangewithoutPageLevel3.store());
            }, Error("Manifest should have sap.ui.generic.app.pages as Object structure and not array "), "throws an error");
        });
    });

    QUnit.test("Case 10: Add subObjectpage at level > 3 when embedded components are present in the raw manifest", function (assert) {
        oRawManifestWithEmbeddedComponent = AjaxHelper.syncGetJSON(sRawManifestWithEmbeddedComponent).data;
        var oNewPageSet = oRawManifestWithEmbeddedComponent["sap.ui.generic.app"];
        return Promise.resolve(ChangesWriteAPI.create({
            changeSpecificData: {
                "changeType": "appdescr_ui_generic_app_addNewObjectPage",
                "layer": Layer.CUSTOMER,
                "content": {
                    "parentPage" : {
                        "component": "sap.suite.ui.generic.template.ObjectPage",
                        "entitySet": "C_STTA_SalesOrderItemSL_WD_20"
                    },
                    "childPage": {
                        "id": "customer.ObjectPage|to_extendedNode",
                        "definition": {
                            "navigationProperty": "to_extendedNode",
                            "entitySet": "C_STTA_ExtendedNode"
                        }
                    }
                }
            },
            selector: oComponent
        })).then(function(oChangewithoutPageLevel3) {
            var oChangePageLevel3Content = oChangewithoutPageLevel3.store().getContent();
            var oModifiedManifest = AddNewObjectPage.applyChange(oRawManifestWithEmbeddedComponent, oChangewithoutPageLevel3.store());
            console.log("FinalManifest after adding a new subOP extendedNode at level > 3", oModifiedManifest);
            var oMainOP_Pages = oNewPageSet["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["pages"]["ObjectPage|C_STTA_SalesOrder_WD_20"]["pages"]["ObjectPage|to_Item"]["pages"]["ObjectPage|to_ItemScheduleLine"];
            assert.deepEqual(oMainOP_Pages["pages"]["customer.ObjectPage|to_extendedNode"], oChangePageLevel3Content.childPage.definition,
                "Extended Node added as Expected");
        });
    });

    QUnit.test("Case 11: Failure scenario adding a new node to the structure of pages which is of Array", function (assert) {
        return Promise.resolve(ChangesWriteAPI.create({
            changeSpecificData: {
                "changeType": "appdescr_ui_generic_app_addNewObjectPage",
                "layer": Layer.CUSTOMER,
                "content": {
                    "parentPage" : {
                        "component": "sap.suite.ui.generic.template.ObjectPage",
                        "entitySet": "C_STTA_SalesOrderItem_WD_20"
                    },
                    "childPage": {
                        "id": "customer.ObjectPage|to_extendedNode",
                        "definition": {
                            "navigationProperty": "to_extendedNode",
                            "entitySet": "C_STTA_ExtendedNode "
                        }
                    }
                }
            },
            selector: oComponent
        })).then(function(oChangewithoutPageLevel3) {
            assert.throws(function () {
                AddNewObjectPage.applyChange(oRawManifestCase2, oChangewithoutPageLevel3.store());
            }, Error("Manifest should have sap.ui.generic.app.pages as Object structure and not array"), "throws an error");
        });
    });
});