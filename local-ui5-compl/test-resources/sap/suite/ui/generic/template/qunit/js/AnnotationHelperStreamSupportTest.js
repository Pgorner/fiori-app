/**
 * tests for the sap.suite.ui.generic.template.js.AnnotationHelperStreamSupport.js and in particular for the SmartChart in multi-tab mode
 */
 sap.ui.define([
    "sap/suite/ui/generic/template/js/AnnotationHelperStreamSupport",
    "sap/ui/core/util/MockServer"
    ], function(AnnotationHelperStreamSupport,MockServer){
"use strict";

        QUnit.module("test js/AnnotationHelperStreamSupport", {
        	beforeEach: function () {
                this.AnnotationHelperStreamSupport = AnnotationHelperStreamSupport;
            },
    
            afterEach: function () {
                this.AnnotationHelperStreamSupport = null;
            },
                getMockModel: function () {

                    var oModel, oMockServer;
                    // the mockservice to get a suitable MetadataModel

                    oMockServer = new MockServer({
                        rootUri: "/sap/opu/odata/sap/SEPMRA_PROD_MAN/"
                    });
                    // take the mock meta data file from the demokit product application
                    oMockServer.simulate("test-resources/sap/suite/ui/generic/template/demokit/sample.manage.products/webapp/localService/metadata.xml", {
                        sMockdataBaseUrl: "test-resources/sap/suite/ui/generic/template/demokit/sample.manage.products/webapp/localService/",
                        bGenerateMissingMockData: true
                    });
                    oMockServer.start();

                    // setting up model
                    oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/SEPMRA_PROD_MAN/", {
                        // both anntoations files are needed to have a suitabel meta model
                        annotationURI: [
                            "test-resources/sap/suite/ui/generic/template/demokit/sample.manage.products/webapp/localService/annotations.xml",
                            "test-resources/sap/suite/ui/generic/template/demokit/sample.manage.products/webapp/annotations/annotations.xml"
                        ]
                    });

                    oModel.setSizeLimit(10);
                    return oModel;
                }

        });


        QUnit.test("check checkIfEntityOrAssociationHasStreamEnabled", function (assert) {
    
            var done = assert.async();
            var oModel = this.getMockModel();
            assert.ok(oModel, "oModel Initiated");
    
            if (oModel) {
                oModel.getMetaModel().loaded().then(function () {
                    var oMetaModel = oModel.getMetaModel();
                    var oInterface = {
    
                        getModel: function () {
                            return oMetaModel;
                        },
                        getPath: function () {
                            return "/dataServices/schema/0/entityType/16/com.sap.vocabularies.UI.v1.DataPoint#ProductCategory/Value";
                        },
                        getSetting: function () {
                            return "";
                        }
                    };
                    var oEntitySet = {
                        name: "STTA_C_MP_ProductText",
                        entityType: "STTA_PROD_MAN.STTA_C_MP_ProductTextType"
                    };
                
                    var oDataField = {
                        RecordType: "com.sap.vocabularies.UI.v1.DataField",
                        Value: {
                            Path: "$value"
                        }
                        };
                    var bStreamEnablement = AnnotationHelperStreamSupport.checkIfEntityOrAssociationHasStreamEnabled(oInterface, oEntitySet, oDataField);
                    assert.equal(!bStreamEnablement, true, "Entity is not stream enabled");
                    done();
    
                });
            }
        });

        QUnit.test("check getStreamEntitySet", function (assert) {
    
            var oDataField = {
                RecordType: "com.sap.vocabularies.UI.v1.DataField",
                Value: {
                        Path: "to_UserImage/$value"
                    }
                };
                var sStreamEntitySet = AnnotationHelperStreamSupport.getStreamEntitySet(oDataField);
                assert.equal(sStreamEntitySet, "to_UserImage", "Stream Entity Set is Obtained");
        });

        QUnit.test("check getLinkTextForStream", function (assert) {
            
            var oEntitySet = {
                name: "STTA_C_MP_ProductText",
                entityType: "STTA_PROD_MAN.STTA_C_MP_ProductTextType"  
            };
            var oDataField = {
                RecordType: "com.sap.vocabularies.UI.v1.DataField",
                Value: {
                        Path: "$value"
                    }
                };
            var sLinkBinding = AnnotationHelperStreamSupport.getLinkTextForStream(oEntitySet, oDataField);
            assert.equal("{= ${_templPriv>/generic/controlProperties/fileUploader/" + oEntitySet.name + "/fileName}}", sLinkBinding, "Binding Text for link is updated correctly");
        });

        QUnit.test("check getURLForStream", function (assert) {
            
            var oEntitySet = {
                name: "STTA_C_MP_ProductText",
                entityType: "STTA_PROD_MAN.STTA_C_MP_ProductTextType"  
            };
            var oDataField = {
                RecordType: "com.sap.vocabularies.UI.v1.DataField",
                Value: {
                        Path: "$value"
                    }
                };
            var sUrlBinding = AnnotationHelperStreamSupport.getURLForStream(oEntitySet, oDataField);
            assert.equal("{= ${_templPriv>/generic/controlProperties/fileUploader/" + oEntitySet.name + "/url}}", sUrlBinding, "Binding Text for URL is updated correctly");
        });

        QUnit.test("check getIconForStream", function (assert) {
            
            var oEntitySet = {
                name: "STTA_C_MP_ProductText",
                entityType: "STTA_PROD_MAN.STTA_C_MP_ProductTextType"  
            };
            var oDataField = {
                RecordType: "com.sap.vocabularies.UI.v1.DataField",
                Value: {
                        Path: "$value"
                    }
                };
            var sIconBinding = AnnotationHelperStreamSupport.getIconForStream(oEntitySet, oDataField);
            assert.equal("{= ${_templPriv>/generic/controlProperties/fileUploader/" + oEntitySet.name + "/icon}}", sIconBinding, "Binding Text for Icon is updated correctly");
        });

});
