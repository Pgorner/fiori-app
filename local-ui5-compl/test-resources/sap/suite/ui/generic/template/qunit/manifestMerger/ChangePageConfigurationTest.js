sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/suite/ui/generic/template/genericUtilities/AjaxHelper",
    "sap/suite/ui/generic/template/manifestMerger/ChangePageConfiguration",
    "sap/ui/fl/write/api/ChangesWriteAPI",
    "sap/ui/fl/Layer",
    "sap/base/util/ObjectPath"
], function (UIComponent, AjaxHelper, ChangePageConfiguration, ChangesWriteAPI, Layer, ObjectPath) {
    "use strict";
    /**
     * This class contains the QUnit test functions for the sap.suite.ui.generic.template.manifestMerger.ChangePageConfiguration function
     * @namespace sap.suite.ui.generic.template.qunit.manifestMerger.changePageConfigurationTest
     * @private
     */

    var sRawManifestCase1Url = "test-resources/sap/suite/ui/generic/template/qunit/manifestMerger/testData/rawManifestNoSubObjectPage.json",
    oRawManifestCase1 = AjaxHelper.syncGetJSON(sRawManifestCase1Url).data;

    var sRawManifestCase2Url = "test-resources/sap/suite/ui/generic/template/qunit/manifestMerger/testData/rawManifestWithSubObjectPage.json",
    oRawManifestCase2 = AjaxHelper.syncGetJSON(sRawManifestCase2Url).data;

    var sRawManifestWithEmbeddedComponent = "test-resources/sap/suite/ui/generic/template/qunit/manifestMerger/testData/rawManifestWithEmbeddedComponent.json",
    oRawManifestWithEmbeddedComponent = AjaxHelper.syncGetJSON(sRawManifestWithEmbeddedComponent).data;

    var Component = UIComponent.extend("component", {});
    var oComponent = new Component("dummyComponent");

    // *** MODIFY USE CASES *** //
    QUnit.test("Case1:Modify use case: Add createMode=inline and also table settings", function (assert) {
        var oManifest = oRawManifestCase1["sap.ui.generic.app"];
        return Promise.resolve(ChangesWriteAPI.create({
            changeSpecificData: {
                "changeType": "appdescr_ui_generic_app_changePageConfiguration",
                "layer": Layer.CUSTOMER,
                "content": {
                    "parentPage" : {
                        "component": "sap.suite.ui.generic.template.ObjectPage",
                        "entitySet": "C_STTA_SalesOrder_WD_20"
                    },
                    "entityPropertyChange": {
                        "propertyPath": "component/settings/sections/extendedFacetId",
                        "operation": "UPSERT",
                        "propertyValue": {
                            "createMode": "inline",
                            "tableSettings": {
                                "type": "GridTable"
                            }
                        }
                    }
                }
            },
            selector: oComponent
        })).then(function(oChange) {
            var oChangeContent = oChange.store().getContent();
            var oModifiedManifest = ChangePageConfiguration.applyChange(oRawManifestCase1, oChange.store());
            console.log("Modify use case 1", oModifiedManifest);

            var oMainOP_Pages = oManifest["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["pages"]["ObjectPage|C_STTA_SalesOrder_WD_20"]["component"]["settings"]["sections"]["extendedFacetId"];
            assert.deepEqual(oMainOP_Pages["createMode"], oChangeContent["entityPropertyChange"]["propertyValue"]["createMode"],
            "Modified Node has createMode=inline as Expected");

            var oMainOP_Pages = oManifest["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["pages"]["ObjectPage|C_STTA_SalesOrder_WD_20"]["component"]["settings"]["sections"]["extendedFacetId"];
            assert.deepEqual(oMainOP_Pages["tableSettings"]["type"], oChangeContent["entityPropertyChange"]["propertyValue"]["tableSettings"]["type"],
            "Modified Node has tableType as Expected");
        });
    });

    QUnit.test("Case2:Modify use case: modify existing table settings and add new loading behavior and createMode inline", function (assert) {
        var oManifest = oRawManifestCase2["sap.ui.generic.app"];
        return Promise.resolve(ChangesWriteAPI.create({
            changeSpecificData: {
                "changeType": "appdescr_ui_generic_app_changePageConfiguration",
                "layer":    Layer.CUSTOMER,
                "content": {
                    "parentPage" : {
                        "component": "sap.suite.ui.generic.template.ObjectPage",
                        "entitySet": "C_STTA_SalesOrder_WD_20"
                    },

                    "entityPropertyChange": {
                        "propertyPath": "component/settings/sections/SalesOrderItemsID",
                        "operation": "UPSERT",
                        "propertyValue": {
                            "createMode": "inline",
                            "tableSettings": {
                                "type": "GridTable",
                                "multiSelect": false,
                                "selectAll": false
                            },
                            "loadingBehavior": {
                                "waitForHeaderData": true,
                                "waitForViewportEnter": false
                            }
                        }
                    }
                }
            },
            selector: oComponent
        })).then(function(oChange) {
            var oChangeContent = oChange.store().getContent();
            var oModifiedManifest = ChangePageConfiguration.applyChange(oRawManifestCase2, oChange.store());
            console.log("Modify use case 2", oModifiedManifest);

            var oMainOP_Pages = oManifest["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["pages"]["ObjectPage|C_STTA_SalesOrder_WD_20"]["component"]["settings"]["sections"]["SalesOrderItemsID"];
            assert.deepEqual(oMainOP_Pages["tableSettings"]["type"], oChangeContent["entityPropertyChange"]["propertyValue"]["tableSettings"]["type"],
            "Modified Node has table type as Expected");

            var oMainOP_Pages = oManifest["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["pages"]["ObjectPage|C_STTA_SalesOrder_WD_20"]["component"]["settings"]["sections"]["SalesOrderItemsID"];
            assert.deepEqual(oMainOP_Pages["tableSettings"]["multiSelect"], false,
            "Modified Node has multiselect as Expected");

            var oMainOP_Pages = oManifest["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["pages"]["ObjectPage|C_STTA_SalesOrder_WD_20"]["component"]["settings"]["sections"]["SalesOrderItemsID"];
            assert.deepEqual(oMainOP_Pages["tableSettings"]["selectAll"], false,
            "Modified Node has selectAll as Expected");

            var oMainOP_Pages = oManifest["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["pages"]["ObjectPage|C_STTA_SalesOrder_WD_20"]["component"]["settings"]["sections"]["SalesOrderItemsID"];
            assert.deepEqual(oMainOP_Pages["loadingBehavior"], oChangeContent["entityPropertyChange"]["propertyValue"]["loadingBehavior"],
            "Modified Node has loading behavior as Expected");

            var oMainOP_Pages = oManifest["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["pages"]["ObjectPage|C_STTA_SalesOrder_WD_20"]["component"]["settings"]["sections"]["SalesOrderItemsID"];
            assert.deepEqual(oMainOP_Pages["tableSettings"]["selectionLimit"], 200,
            "Modified Node has existing tableSettings intact");

            var oMainOP_Pages = oManifest["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["pages"]["ObjectPage|C_STTA_SalesOrder_WD_20"]["component"]["settings"]["sections"]["SalesOrderItemsID"];
            assert.deepEqual(oMainOP_Pages["tableSettings"]["inlineDelete"], true,
            "Modified Node has existing tableSettings intact");
        });
    });

    QUnit.test("Case3:Modify use case: modify existing table settings and add new value change for inline delete and multiselect", function (assert) {
        var oRawManifestCase2 = AjaxHelper.syncGetJSON(sRawManifestCase2Url).data;
        var oManifest = oRawManifestCase2["sap.ui.generic.app"];
        return Promise.resolve(ChangesWriteAPI.create({
            changeSpecificData: {
                "changeType": "appdescr_ui_generic_app_changePageConfiguration",
                "layer": Layer.CUSTOMER,
                "content": {
                    "parentPage" : {
                        "component": "sap.suite.ui.generic.template.ObjectPage",
                        "entitySet": "C_STTA_SalesOrder_WD_20"
                    },
                    "entityPropertyChange": {
                        "propertyPath": "component/settings/sections/SalesOrderItemsID",
                        "operation": "UPSERT",
                        "propertyValue": {
                            "multiSelect": false, // value change from true->false
                            "tableSettings": {
                                "inlineDelete": false, // value change from true->false
                                "selectionLimit": 300
                            }
                        }
                    }
                }
            },
            selector: oComponent
        })).then(function(oChange) {
            var oModifiedManifest = ChangePageConfiguration.applyChange(oRawManifestCase2, oChange.store());
            console.log("Modify use case 3", oModifiedManifest);

            var oMainOP_Pages = oManifest["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["pages"]["ObjectPage|C_STTA_SalesOrder_WD_20"]["component"]["settings"]["sections"]["SalesOrderItemsID"];
            assert.deepEqual(oMainOP_Pages["multiSelect"], false,
            "Modified Node has multiSelect as expected");

            var oMainOP_Pages = oManifest["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["pages"]["ObjectPage|C_STTA_SalesOrder_WD_20"]["component"]["settings"]["sections"]["SalesOrderItemsID"];
            assert.deepEqual(oMainOP_Pages["tableSettings"]["inlineDelete"], false,
            "Modified Node has inlineDelete as expected");

            var oMainOP_Pages = oManifest["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["pages"]["ObjectPage|C_STTA_SalesOrder_WD_20"]["component"]["settings"]["sections"]["SalesOrderItemsID"];
            assert.deepEqual(oMainOP_Pages["tableSettings"]["selectionLimit"], 300,
            "Modified Node has selectionLimit as expected");
        });
    });

    QUnit.test("Case4:Modify use case: add showRelatedApps and relatedAppsSettings to settings", function (assert) {
        var oRawManifestCase2 = AjaxHelper.syncGetJSON(sRawManifestCase2Url).data;
        var oManifest = oRawManifestCase2["sap.ui.generic.app"];
        return Promise.resolve(ChangesWriteAPI.create({
            changeSpecificData: {
                "changeType": "appdescr_ui_generic_app_changePageConfiguration",
                "layer": Layer.CUSTOMER,
                "content": {
                    "parentPage" : {
                        "component": "sap.suite.ui.generic.template.ObjectPage",
                        "entitySet": "C_STTA_SalesOrder_WD_20"
                    },
                    "entityPropertyChange": {
                        "propertyPath": "component/settings",
                        "operation": "UPSERT",
                        "propertyValue": {
                            "showRelatedApps": true,
                            "relatedAppsSettings": {
                                "0": {
                                    "semanticObject": "EPMProduct"
                                }
                            }
                        }
                    }
                }
            },
            selector: oComponent
        })).then(function(oChange) {
            var oChangeContent = oChange.store().getContent();
            var oModifiedManifest = ChangePageConfiguration.applyChange(oRawManifestCase2, oChange.store());
            console.log("Modify use case 4", oModifiedManifest);

            var oMainOP_Pages = oManifest["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["pages"]["ObjectPage|C_STTA_SalesOrder_WD_20"]["component"]["settings"];
            assert.deepEqual(oMainOP_Pages["showRelatedApps"], true,
            "Modified Node has showRelatedApps as expected");

            var oMainOP_Pages = oManifest["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["pages"]["ObjectPage|C_STTA_SalesOrder_WD_20"]["component"]["settings"];
            assert.deepEqual(oMainOP_Pages["relatedAppsSettings"], oChangeContent["entityPropertyChange"]["propertyValue"]["relatedAppsSettings"],
            "Modified Node has relatedAppsSettings as expected");
        });
    });

    QUnit.test("Case5: Modify use case: change setting in ListReport", function (assert) {
        var oRawManifestCase2 = AjaxHelper.syncGetJSON(sRawManifestCase2Url).data;
        var oManifest = oRawManifestCase2["sap.ui.generic.app"];
        return Promise.resolve(ChangesWriteAPI.create({
            changeSpecificData: {
                "changeType": "appdescr_ui_generic_app_changePageConfiguration",
                "layer": Layer.CUSTOMER,
                "content": {
                    "parentPage" : {
                        "component": "sap.suite.ui.generic.template.ListReport",
                        "entitySet": "C_STTA_SalesOrder_WD_20"
                    },
                    "entityPropertyChange": {
                        "propertyPath": "component/settings",
                        "operation": "UPSERT",
                        "propertyValue": {
                            "multiSelect": false,
                            "condensedTableLayout":true,
                            "enableTableFilterInPageVariant":true,
                            "dataLoadSettings":{
                                "loadDataOnAppLaunch" : "always"
                            },
                            "tableSettings":{
                                "multiEdit": {
                                    "enabled": true
                                }
                            }
                        }
                    }
                }
            },
            selector: oComponent
        })).then(function(oChange) {
            var oModifiedManifest = ChangePageConfiguration.applyChange(oRawManifestCase2, oChange.store());
            console.log("Modify use case 5 changing LR multiselect setting to false", oModifiedManifest);

            var oMainOP_Pages = oManifest["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["component"]["settings"];
            assert.deepEqual(oMainOP_Pages["multiSelect"], false,
            "Modified Node has multiSelect value as expected");

            var oMainOP_Pages = oManifest["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["component"]["settings"];
            assert.deepEqual(oMainOP_Pages["condensedTableLayout"], true,
            "Modified Node has condensedTableLayout value as expected");

            var oMainOP_Pages = oManifest["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["component"]["settings"];
            assert.deepEqual(oMainOP_Pages["enableTableFilterInPageVariant"], true,
            "Modified Node has enableTableFilterInPageVariant value as expected");

            var oMainOP_Pages = oManifest["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["component"]["settings"];
            assert.deepEqual(oMainOP_Pages["dataLoadSettings"]["loadDataOnAppLaunch"], "always",
            "Modified Node has loadDataOnAppLaunch value as expected");

            var oMainOP_Pages = oManifest["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["component"]["settings"];
            assert.deepEqual(oMainOP_Pages["tableSettings"]["multiEdit"], {"enabled":true},
            "Modified Node has multiEdit value as expected");
        });
    });

    QUnit.test("Case6: Modify use case: change setting in ListReport createWithFilters and tabletype", function (assert) {
        var oRawManifestCase2 = AjaxHelper.syncGetJSON(sRawManifestCase2Url).data;
        var oManifest = oRawManifestCase2["sap.ui.generic.app"];
        return Promise.resolve(ChangesWriteAPI.create({
            changeSpecificData: {
                "changeType": "appdescr_ui_generic_app_changePageConfiguration",
                "layer": Layer.CUSTOMER,
                "content": {
                    "parentPage" : {
                        "component": "sap.suite.ui.generic.template.ListReport",
                        "entitySet": "C_STTA_SalesOrder_WD_20"
                    },
                    "entityPropertyChange": {
                        "propertyPath": "component/settings",
                        "operation": "UPSERT",
                        "propertyValue": {
                            "tableType": "ResponsiveTable",
                            "createWithFilters": {
                                "strategy": "extension"
                            }
                        }
                    }
                }
            },
            selector: oComponent
        })).then(function(oChange) {
            var oChangeContent = oChange.store().getContent();
            var oModifiedManifest = ChangePageConfiguration.applyChange(oRawManifestCase2, oChange.store());
            console.log("Modify use case 6 adding LR createWithFilters and tabletype settings", oModifiedManifest);

            var oMainOP_Pages = oManifest["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["component"]["settings"];
            assert.deepEqual(oMainOP_Pages["tableType"], oChangeContent["entityPropertyChange"]["propertyValue"]["tableType"],
            "Modified Node has tableType as expected");
            assert.deepEqual(oMainOP_Pages["createWithFilters"], oChangeContent["entityPropertyChange"]["propertyValue"]["createWithFilters"],
            "Modified Node has createWithFilters as expected");
        });
    });

    QUnit.test("Case 7: Modify use case: change tableSettings of the node when embedded components are present in the raw manifest", function (assert) {
        oRawManifestWithEmbeddedComponent = AjaxHelper.syncGetJSON(sRawManifestWithEmbeddedComponent).data;
        var oManifest = oRawManifestWithEmbeddedComponent["sap.ui.generic.app"];
        return Promise.resolve(ChangesWriteAPI.create({
            changeSpecificData: {
                "changeType": "appdescr_ui_generic_app_changePageConfiguration",
                "layer": Layer.CUSTOMER,
                "content": {
                    "parentPage" : {
                        "component": "sap.suite.ui.generic.template.ObjectPage",
                        "entitySet": "C_STTA_SalesOrderItem_WD_20"
                    },
                    "entityPropertyChange": {
                        "propertyPath": "component/settings/sections/SalesOrderItemsSLID",
                        "operation": "UPSERT",
                        "propertyValue": {
                            "tableSettings":{
                            "type": "GridTable"
                            }
                        }
                    }
                }
            },
            selector: oComponent
        })).then(function(oChange) {
            var oChangeContent = oChange.store().getContent();
            var oModifiedManifest = ChangePageConfiguration.applyChange(oRawManifestWithEmbeddedComponent, oChange.store());
            console.log("Modify use case 7 adding tabletype settings", oModifiedManifest);

            var oMainOP_Pages = oManifest["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["pages"]["ObjectPage|C_STTA_SalesOrder_WD_20"]["pages"]["ObjectPage|to_Item"]["component"]["settings"]["sections"]["SalesOrderItemsSLID"];
            assert.deepEqual(oMainOP_Pages["tableSettings"]["type"], oChangeContent["entityPropertyChange"]["propertyValue"]["tableSettings"]["type"],
            "Modified Node has tableType as expected");
        });
    });

    QUnit.test("Case 8: Modify use case: add/modify condensedTableLayout configuration", function (assert) {
        // case 1: add condensedTableLayout configuration
        var oManifest = oRawManifestCase2["sap.ui.generic.app"];
        var oModifiedManifest;
        return Promise.resolve(ChangesWriteAPI.create({
            changeSpecificData: {
                "changeType": "appdescr_ui_generic_app_changePageConfiguration",
                "layer": Layer.CUSTOMER,
                "content": {
                    "parentPage": {
                        "component": "sap.suite.ui.generic.template.ObjectPage",
                        "entitySet": "C_STTA_SalesOrder_WD_20"
                    },

                    "entityPropertyChange": {
                        "propertyPath": "component/settings/sections/SalesOrderItemsID",
                        "operation": "UPSERT",
                        "propertyValue": {
                            "condensedTableLayout": true,
                            "tableSettings": {
                                "type": "GridTable"
                            }
                        }
                    }
                }
            },
            selector: oComponent
        })).then(function(oChange) {
            var oChangeContent = oChange.store().getContent();
            oModifiedManifest = ChangePageConfiguration.applyChange(oRawManifestCase2, oChange.store());
            console.log("Modify use case 8 - set condensedTableLayout to true ", oModifiedManifest);

            var oMainOP_Pages = oManifest["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["pages"]["ObjectPage|C_STTA_SalesOrder_WD_20"]["component"]["settings"]["sections"]["SalesOrderItemsID"];
            assert.deepEqual(oMainOP_Pages["tableSettings"]["type"], oChangeContent["entityPropertyChange"]["propertyValue"]["tableSettings"]["type"],
                "Modified Node has tableType as Expected");

            var oMainOP_Pages = oManifest["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["pages"]["ObjectPage|C_STTA_SalesOrder_WD_20"]["component"]["settings"]["sections"]["SalesOrderItemsID"];
            assert.deepEqual(oMainOP_Pages["condensedTableLayout"], oChangeContent["entityPropertyChange"]["propertyValue"]["condensedTableLayout"],
                "Modified Node has condensedTableLayout as Expected");

            // case 2: modify condensedTableLayout configuration
            return ChangesWriteAPI.create({
                changeSpecificData: {
                    "changeType": "appdescr_ui_generic_app_changePageConfiguration",
                    "layer": Layer.CUSTOMER,
                    "content": {
                        "parentPage": {
                            "component": "sap.suite.ui.generic.template.ObjectPage",
                            "entitySet": "C_STTA_SalesOrder_WD_20"
                        },

                        "entityPropertyChange": {
                            "propertyPath": "component/settings/sections/SalesOrderItemsID",
                            "operation": "UPSERT",
                            "propertyValue": {
                                "condensedTableLayout": false
                            }
                        }
                    }
                },
                selector: oComponent
            });
        }).then(function(oChange) {
            var oChangeContent = oChange.store().getContent();

            oModifiedManifest = ChangePageConfiguration.applyChange(oModifiedManifest, oChange.store());
            console.log("Modify use case 8 - set condensedTableLayout to false ", oModifiedManifest);

            var oMainOP_Pages = oManifest["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["pages"]["ObjectPage|C_STTA_SalesOrder_WD_20"]["component"]["settings"]["sections"]["SalesOrderItemsID"];
            assert.deepEqual(oMainOP_Pages["condensedTableLayout"], oChangeContent["entityPropertyChange"]["propertyValue"]["condensedTableLayout"],
                "Modified Node has condensedTableLayout as Expected");
        });
    });

    QUnit.test("Case9:Modify use case for createWithParameterDialog as part of tableSettings", function (assert) {
        // case 1 - user wants to change the path for a given field. Validate if remaining fields are intact
        var oModifiedManifest;
        return Promise.resolve(ChangesWriteAPI.create({
            changeSpecificData: {
                "changeType": "appdescr_ui_generic_app_changePageConfiguration",
                "layer": Layer.CUSTOMER,
                "content": {
                    "parentPage" : {
                        "component": "sap.suite.ui.generic.template.ObjectPage",
                        "entitySet": "C_STTA_SalesOrder_WD_20"
                    },
                    "entityPropertyChange": {
                        "propertyPath": "component/settings/sections/SalesOrderItemsID/tableSettings/createWithParameterDialog/fields/SalesOrder",
                        "operation": "UPSERT",
                        "propertyValue": {
                            "path":"SalesOrder2"
                        }
                    }

                }
            },
            selector: oComponent
        })).then(function(oChange) {
            var oChangeContent = oChange.store().getContent();
            oModifiedManifest = ChangePageConfiguration.applyChange(oRawManifestCase2, oChange.store());

            var oMainOP_Pages = oRawManifestCase2["sap.ui.generic.app"]["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["pages"]["ObjectPage|C_STTA_SalesOrder_WD_20"]["component"]["settings"]["sections"]["SalesOrderItemsID"];
            assert.deepEqual(oMainOP_Pages["tableSettings"]["createWithParameterDialog"]["fields"]["SalesOrder"]["path"], oChangeContent["entityPropertyChange"]["propertyValue"]["path"],
              "Modified Node has the path updated for a field in createWithParameterDialog as Expected");

            var oMainOP_Pages = oRawManifestCase2["sap.ui.generic.app"]["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["pages"]["ObjectPage|C_STTA_SalesOrder_WD_20"]["component"]["settings"]["sections"]["SalesOrderItemsID"];
            assert.deepEqual(oMainOP_Pages["tableSettings"]["createWithParameterDialog"]["fields"]["CurrencyCode"], {"path":"CurrencyCode"},
               "Modified Node has remaining fields in createWithParameterDialog intact");

            // case 2 - user wants to add more fields to createWithParameterDialog
            return ChangesWriteAPI.create({
                changeSpecificData: {
                    "changeType": "appdescr_ui_generic_app_changePageConfiguration",
                    "layer": Layer.CUSTOMER,
                    "content": {
                        "parentPage" : {
                            "component": "sap.suite.ui.generic.template.ObjectPage",
                            "entitySet": "C_STTA_SalesOrder_WD_20"
                        },
                        "entityPropertyChange": {
                            "propertyPath": "component/settings/sections/SalesOrderItemsID/tableSettings/createWithParameterDialog/fields",
                            "operation": "UPSERT",
                            "propertyValue": {
                                "Key1":{"path":"Value1"},
                                "Key2":{"path":"Value2"}
                            }
                        }

                    }
                },
                selector: oComponent
            });
        }).then(function(oChange) {
            oModifiedManifest = ChangePageConfiguration.applyChange(oRawManifestCase2, oChange.store());
            console.log("Modify use case 9", oModifiedManifest);

            var oMainOP_Pages = oRawManifestCase2["sap.ui.generic.app"]["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["pages"]["ObjectPage|C_STTA_SalesOrder_WD_20"]["component"]["settings"]["sections"]["SalesOrderItemsID"];
            assert.deepEqual(oMainOP_Pages["tableSettings"]["createWithParameterDialog"]["fields"]["Key1"], {"path":"Value1"},
            "Modified Node has newly added field as part of createWithParameterDialog as Expected");

            var oMainOP_Pages = oRawManifestCase2["sap.ui.generic.app"]["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["pages"]["ObjectPage|C_STTA_SalesOrder_WD_20"]["component"]["settings"]["sections"]["SalesOrderItemsID"];
            assert.deepEqual(oMainOP_Pages["tableSettings"]["createWithParameterDialog"]["fields"]["CurrencyCode"], {"path":"CurrencyCode"},
            "Modified Node has existing field as part of createWithParameterDialog as Expected");

            var oMainOP_Pages = oRawManifestCase2["sap.ui.generic.app"]["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["pages"]["ObjectPage|C_STTA_SalesOrder_WD_20"]["component"]["settings"]["sections"]["SalesOrderItemsID"];
            assert.deepEqual(Object.keys(oMainOP_Pages["tableSettings"]["createWithParameterDialog"]["fields"]).length, 5,
            "Modified Node has existing and new fields as part of createWithParameterDialog as Expected");

            // Case 3- user wants to configure createWithParameterDialog for a section(SalesOrderItemsSLID)
            return ChangesWriteAPI.create({
                changeSpecificData: {
                    "changeType": "appdescr_ui_generic_app_changePageConfiguration",
                    "layer": Layer.CUSTOMER,
                    "content": {
                        "parentPage" : {
                            "component": "sap.suite.ui.generic.template.ObjectPage",
                            "entitySet": "C_STTA_SalesOrderItem_WD_20"
                        },
                        "entityPropertyChange": {
                            "propertyPath": "component/settings/sections/SalesOrderItemsSLID/tableSettings",
                            "operation": "UPSERT",
                            "propertyValue": {
                                "createWithParameterDialog" : {
                                    "fields" : {
                                        "SalesOrder": {"path":"SalesOrder"},
                                        "CurrencyCode" : {"path":"CurrencyCode"},
                                        "GrossAmount" : {"path":"GrossAmount"}
                                    }
                                }
                            }
                        }
                    }
                },
                selector: oComponent
            });
        }).then(function(oChange) {
            var oChangeContent = oChange.store().getContent();
            oModifiedManifest = ChangePageConfiguration.applyChange(oRawManifestCase2, oChange.store());

            var oMainOP_Pages = oRawManifestCase2["sap.ui.generic.app"]["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["pages"]["ObjectPage|C_STTA_SalesOrder_WD_20"]["pages"]["ObjectPage|to_Item"]["component"]["settings"]["sections"]["SalesOrderItemsSLID"];
            assert.deepEqual(oMainOP_Pages["tableSettings"]["createWithParameterDialog"]["fields"]["SalesOrder"], {"path":"SalesOrder"},
              "Modified Node has newly added fields as part of createWithParameterDialog as Expected");

            var oMainOP_Pages = oRawManifestCase2["sap.ui.generic.app"]["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["pages"]["ObjectPage|C_STTA_SalesOrder_WD_20"]["pages"]["ObjectPage|to_Item"]["component"]["settings"]["sections"]["SalesOrderItemsSLID"];
            assert.deepEqual(Object.keys(oMainOP_Pages["tableSettings"]["createWithParameterDialog"]["fields"]).length, 3,
               "Modified Node has newly added fields as part of createWithParameterDialog as Expected");
        });
    });

    QUnit.test("Case10:Modify use case to change tableSettings when used in quickVariantSelectionX", function (assert) {
        // case 1 - user wants to add few tableSettings for a variant
        var oManifest = oRawManifestCase2["sap.ui.generic.app"];
        return Promise.resolve(ChangesWriteAPI.create({
            changeSpecificData: {
                "changeType": "appdescr_ui_generic_app_changePageConfiguration",
                "layer": Layer.CUSTOMER,
                "content": {
                    "parentPage" : {
                        "component": "sap.suite.ui.generic.template.ListReport",
                        "entitySet": "C_STTA_SalesOrder_WD_20"
                    },
                    "entityPropertyChange": {
                        "propertyPath": "component/settings/quickVariantSelectionX/variants/1",
                        "operation": "UPSERT",
                        "propertyValue": {
                            "tableSettings": {
                                "type": "GridTable",
                                "multiSelect": true,
                                "selectAll": false,
                                "selectionLimit": 150
                            }
                        }
                    }

                }
            },
            selector: oComponent
        })).then(function(oChange) {
            var oChangeContent = oChange.store().getContent();
            var oModifiedManifest = ChangePageConfiguration.applyChange(oRawManifestCase2, oChange.store());
            console.log("Modify use case 10", oModifiedManifest);

            var oMainOP_Pages = oManifest["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["component"]["settings"]["quickVariantSelectionX"]["variants"]["1"];
            assert.deepEqual(oMainOP_Pages["tableSettings"], oChangeContent["entityPropertyChange"]["propertyValue"]["tableSettings"],
            "Modified Node has tableSettings applied to the variant as Expected");

            // case 2 - user wants to modify the table.type for a variant
            return ChangesWriteAPI.create({
                changeSpecificData: {
                    "changeType": "appdescr_ui_generic_app_changePageConfiguration",
                    "layer": Layer.CUSTOMER,
                    "content": {
                        "parentPage" : {
                            "component": "sap.suite.ui.generic.template.ListReport",
                            "entitySet": "C_STTA_SalesOrder_WD_20"
                        },
                        "entityPropertyChange": {
                            "propertyPath": "component/settings/quickVariantSelectionX/variants/1",
                            "operation": "UPSERT",
                            "propertyValue": {
                                "tableSettings": {
                                    "type": "ResponsiveTable"
                                }
                            }
                        }

                    }
                },
                selector: oComponent
            });
        }).then(function(oChange) {
            var oChangeContent = oChange.store().getContent();
            var oModifiedManifest = ChangePageConfiguration.applyChange(oRawManifestCase2, oChange.store());

            var oMainOP_Pages = oManifest["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["component"]["settings"]["quickVariantSelectionX"]["variants"]["1"];
            assert.deepEqual(oMainOP_Pages["tableSettings"]["type"], oChangeContent["entityPropertyChange"]["propertyValue"]["tableSettings"]["type"],
                "Modified Node has tableSettings applied to the variant as Expected");

            var oMainOP_Pages = oManifest["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["component"]["settings"]["quickVariantSelectionX"]["variants"]["1"];
            assert.deepEqual(Object.keys(oMainOP_Pages["tableSettings"]).length, 4,
                "Modified Node has existing tableSettings as Expected");
        });
    });

    QUnit.test("Case11:Modify use case for editableHeaderContent", function (assert) {
        var oManifest = oRawManifestCase2["sap.ui.generic.app"];
        return Promise.resolve(ChangesWriteAPI.create({
            changeSpecificData: {
                "changeType": "appdescr_ui_generic_app_changePageConfiguration",
                "content": {
                    "parentPage" : {
                        "component": "sap.suite.ui.generic.template.ObjectPage",
                        "entitySet": "C_STTA_SalesOrder_WD_20"
                    },
                    "entityPropertyChange": {
                        "propertyPath": "component/settings",
                        "operation": "UPSERT",
                        "propertyValue": {
                            "editableHeaderContent":false
                        }
                    }

                }
            },
            selector: oComponent
        })).then(function(oChange) {
            ChangePageConfiguration.applyChange(oRawManifestCase2, oChange.store());

            var oMainOP_Pages = oManifest["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["pages"]["ObjectPage|C_STTA_SalesOrder_WD_20"]["component"]["settings"];
            assert.deepEqual(oMainOP_Pages["editableHeaderContent"], false,
            "Modified Node has editableHeaderContent value as Expected");
        });
    });

    QUnit.test("Case12:Modify use case for filterSetting with useDateRange", function (assert) {
        var oManifest = oRawManifestCase2["sap.ui.generic.app"];
        return Promise.resolve(ChangesWriteAPI.create({
            changeSpecificData: {
                "changeType": "appdescr_ui_generic_app_changePageConfiguration",
                "content": {
                    "parentPage" : {
                        "component": "sap.suite.ui.generic.template.ListReport",
                        "entitySet": "C_STTA_SalesOrder_WD_20"
                    },
                    "entityPropertyChange": {
                        "propertyPath": "component/settings",
                        "operation": "UPSERT",
                        "propertyValue": {
                            "filterSettings":{
                            "dateSettings":{
                                "useDateRange": true
                            }
                            }
                        }
                    }

                }
            },
            selector: oComponent
        })).then(function(oChange) {
            ChangePageConfiguration.applyChange(oRawManifestCase2, oChange.store());

            var oMainOP_Pages = oManifest["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["component"]["settings"];
            assert.deepEqual(oMainOP_Pages["filterSettings"], oChange.store().getContent()["entityPropertyChange"]["propertyValue"]["filterSettings"],
            "Modified Node has filterSettings with useDateRange value as Expected");
        });
    });

    QUnit.test("Case13:Modify use case filterSettings without default date range option", function (assert) {
        // Case 1: user wants to include dateSettings
        var oManifest = oRawManifestCase2["sap.ui.generic.app"];
        return Promise.resolve(ChangesWriteAPI.create({
            changeSpecificData: {
            "changeType": "appdescr_ui_generic_app_changePageConfiguration",
            "content": {
                "parentPage" : {
                    "component": "sap.suite.ui.generic.template.ListReport",
                    "entitySet": "C_STTA_SalesOrder_WD_20"
                },
                "entityPropertyChange": {
                    "propertyPath": "component/settings",
                    "operation": "UPSERT",
                    "propertyValue": {
                        "filterSettings": {
                            "dateSettings": {
                                "useDateRange": false,
                                "selectedValues": "DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR",
                                "fields": {
                                    "SemanticDate1": {
                                        "selectedValues": "TOMORROW",
                                        "exclude": true
                                    },
                                    "SemanticDate2": {
                                        "defaultValue": {
                                            "operation": "LASTYEAR"
                                        },
                                        "filter":[
                                            {
                                                "path": "key",
                                                "equals": "TODAY,NEXTYEAR",
                                                "exclude": true
                                            },
                                            {
                                                "path": "category",
                                                "contains": "MONTH",
                                                "exclude": true
                                            },
                                            {
                                                "path": "key",
                                                "contains": "QUARTER",
                                                "exclude": true
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }

            }
        },
        selector: oComponent
        })).then(function(oChange) {
            ChangePageConfiguration.applyChange(oRawManifestCase2, oChange.store());

            var oMainOP_Pages = oManifest["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["component"]["settings"];
            assert.deepEqual(oMainOP_Pages["filterSettings"], oChange.store().getContent()["entityPropertyChange"]["propertyValue"]["filterSettings"],
            "Modified Node has filterSettings:dateSettings value as Expected");

            // case 2: to include history settings
            return ChangesWriteAPI.create({
                changeSpecificData: {
                    "changeType": "appdescr_ui_generic_app_changePageConfiguration",
                    "content": {
                        "parentPage" : {
                            "component": "sap.suite.ui.generic.template.ListReport",
                            "entitySet": "C_STTA_SalesOrder_WD_20"
                        },
                        "entityPropertyChange": {
                            "propertyPath": "component/settings",
                            "operation": "UPSERT",
                            "propertyValue": {
                                "filterSettings": {
                                    "historySettings": {
                                        "historyEnabled": "enabled",
                                        "fields": {
                                            "SemanticDate1": {
                                                "historyEnabled": "disabled"
                                            },
                                            "SemanticDate2": {
                                                "historyEnabled": "disabled"
                                            }
                                        }
                                    }
                                }
                            }
                        }

                    }
                },
                selector: oComponent
            });
        }).then(function(oChange) {
            ChangePageConfiguration.applyChange(oRawManifestCase2, oChange.store());

            var oMainOP_Pages = oManifest["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["component"]["settings"];
            assert.deepEqual(oMainOP_Pages["filterSettings"]["historySettings"], oChange.store().getContent()["entityPropertyChange"]["propertyValue"]["filterSettings"]["historySettings"],
                "Modified Node has historySettings along with filterSettings:dateSettings");
        });
    });

    QUnit.test("Case 15:To include SPV for a ListReport page", function (assert) {
        var oRawManifestCase2 = AjaxHelper.syncGetJSON(sRawManifestCase2Url).data;
        var oManifest = oRawManifestCase2["sap.ui.generic.app"];
        return Promise.resolve(ChangesWriteAPI.create({
            changeSpecificData: {
                "changeType": "appdescr_ui_generic_app_changePageConfiguration",
                "layer": Layer.CUSTOMER,
                "content": {
                    "parentPage" : {
                        "component": "sap.suite.ui.generic.template.ListReport",
                        "entitySet": "C_STTA_SalesOrder_WD_20"
                    },
                    "entityPropertyChange": {
                        "propertyPath": "component/settings",
                        "operation": "UPSERT",
                        "propertyValue": {
                            "annotationPath": "com.sap.vocabularies.UI.v1.SelectionPresentationVariant#DefaultSPV"
                        }
                    }
                }
            },
            selector: oComponent
        })).then(function(oChange) {
            ChangePageConfiguration.applyChange(oRawManifestCase2, oChange.store());

            var oMainOP_Pages = oManifest["pages"]["ListReport|C_STTA_SalesOrder_WD_20"]["component"]["settings"];
            assert.deepEqual(oMainOP_Pages["annotationPath"], "com.sap.vocabularies.UI.v1.SelectionPresentationVariant#DefaultSPV",
            "Modified Node has annotationPath value as expected");
        });
    });
    
    QUnit.test("Case 16: Global settings", function (assert) {
        var oManifest = oRawManifestCase2["sap.ui.generic.app"];
        const change1 = {
            changeSpecificData: {
                "changeType": "appdescr_ui_generic_app_changePageConfiguration",
                "layer": Layer.CUSTOMER,
                "content": {
                    "parentPage": {
                        "component": "sap.suite.ui.generic.template"
                    },
                    "entityPropertyChange": {
                        "propertyPath": "settings",
                        "operation": "UPSERT",
                        "propertyValue": {
                            "statePreservationMode": "Test"
                        }
                    }
                }
            },
            selector: oComponent
        };

        const change2 = {
            changeSpecificData: {
                "changeType": "appdescr_ui_generic_app_changePageConfiguration",
                "layer": Layer.CUSTOMER,
                "content": {
                    "parentPage": {
                        "component": "sap.suite.ui.generic.template"
                    },
                    "entityPropertyChange": {
                        "propertyPath": "settings",
                        "operation": "UPSERT",
                        "propertyValue": {
                            "flexibleColumnLayout": {
                                "defaultTwoColumnLayoutType": "Test",
                                "defaultThreeColumnLayoutType": "Test"
                            }
                        }
                    }
                }
            },
            selector: oComponent
        };
        const change3 = {
            changeSpecificData: {
                "changeType": "appdescr_ui_generic_app_changePageConfiguration",
                "layer": Layer.CUSTOMER,
                "content": {
                    "parentPage": {
                        "component": "sap.suite.ui.generic.template.somethingElse"
                    },
                    "entityPropertyChange": {
                        "propertyPath": "settings",
                        "operation": "UPSERT",
                        "propertyValue": {
                            "flexibleColumnLayout": {
                                "defaultTwoColumnLayoutType": "Test",
                                "defaultThreeColumnLayoutType": "Test"
                            }
                        }
                    }
                }
            },
            selector: oComponent
        };

        
        return Promise.all([ChangesWriteAPI.create(change1), ChangesWriteAPI.create(change2)])
        .then(function (changes) {
            changes.forEach(function (change) {
                ChangePageConfiguration.applyChange(oRawManifestCase2, change.store());
            });
            assert.deepEqual(oManifest.settings["statePreservationMode"], "Test",
                "Modified Node has statePreservationMode value as expected");
            assert.deepEqual(oManifest.settings["flexibleColumnLayout"], {
                "defaultTwoColumnLayoutType": "Test",
                "defaultThreeColumnLayoutType": "Test"
            },
                "Modified Node has flexibleColumnLayout value as expected");
            return oManifest;
        }).then(function (manifest) {
            return Promise.resolve(ChangesWriteAPI.create(change3)).then(function (change) {
                assert.throws(function() {
                    ChangePageConfiguration.applyChange(manifest, change.store());
                }, Error, "Error thrown for invalid component");
            });
        });
    });


    const aPrimitiveTypesTestCases = [
        {
            testName: "Case 17: Primitive type - String",
            propertyBag: {
            changeSpecificData: {
                    changeType: "appdescr_ui_generic_app_changePageConfiguration",
                    layer: Layer.CUSTOMER,
                    content: {
                        parentPage: {
                            component: "sap.suite.ui.generic.template.ListReport",
                            entitySet: "C_STTA_SalesOrder_WD_20"
                    },
                        entityPropertyChange: {
                            propertyPath: "component/settings/tableSettings/type",
                            operation: "UPSERT",
                            propertyValue: "ResponsiveTable"
                        }
                    }
                }
            },
            expectedValue: "ResponsiveTable",
            message: "Modified Node has type as Expected"
        },
        {
            testName: "Case 18: Primitive type - Boolean",
            propertyBag: {
                changeSpecificData: {
                    changeType: "appdescr_ui_generic_app_changePageConfiguration",
                    layer: Layer.CUSTOMER,
                    content: {
                        parentPage: {
                            component: "sap.suite.ui.generic.template.ListReport",
                            entitySet: "C_STTA_SalesOrder_WD_20"
                        },
                        entityPropertyChange: {
                            propertyPath: "component/settings/tableSettings/selectAll",
                            operation: "UPSERT",
                            propertyValue: false
                        }
                    }
                }
            },
            expectedValue: false,
            message: "Modified Node has selectAll as Expected"
        },
        {
            testName: "Case 19: Primitive type - Null",
            propertyBag: {
                changeSpecificData: {
                    changeType: "appdescr_ui_generic_app_changePageConfiguration",
                    layer: Layer.CUSTOMER,
                    content: {
                        parentPage: {
                            component: "sap.suite.ui.generic.template.ListReport",
                            entitySet: "C_STTA_SalesOrder_WD_20"
                        },
                        entityPropertyChange: {
                            propertyPath: "component/settings/tableSettings",
                            operation: "UPSERT",
                            propertyValue: null
                        }
                    }
                }
            },
            expectedValue: null,
            message: "Modified Node has tableSettings as Expected"
        },
        {
            testName: "Case 20: Primitive type - Null for quickVariantSelectionX",
            propertyBag: {
                changeSpecificData: {
                    changeType: "appdescr_ui_generic_app_changePageConfiguration",
                    layer: Layer.CUSTOMER,
                    content: {
                        parentPage: {
                            component: "sap.suite.ui.generic.template.ListReport",
                            entitySet: "C_STTA_SalesOrder_WD_20"
                        },
                        entityPropertyChange: {
                            propertyPath: "component/settings/quickVariantSelectionX",
                            operation: "UPSERT",
                            propertyValue: null
                        }
                    }
                }
            },
            expectedValue: null,
            message: "Modified quickVariantSelectionX has null as Expected"
        }
    ];

    aPrimitiveTypesTestCases.forEach((oTestCase) => {
        QUnit.test(oTestCase.testName, async (assert) => {
            const done = assert.async();
            try {
                const oPageManifest = oRawManifestCase2["sap.ui.generic.app"]["pages"]["ListReport|C_STTA_SalesOrder_WD_20"];
                const oChange = await ChangesWriteAPI.create(Object.assign(oTestCase.propertyBag, { selector: oComponent }));
            ChangePageConfiguration.applyChange(oRawManifestCase2, oChange.store());
                const actualValue = ObjectPath.get((oTestCase.propertyBag.changeSpecificData.content.entityPropertyChange.propertyPath).split("/"), oPageManifest);

                assert.deepEqual(actualValue, oTestCase.expectedValue, oTestCase.message);
            } finally {
                done();
            }
        });
    });
});
