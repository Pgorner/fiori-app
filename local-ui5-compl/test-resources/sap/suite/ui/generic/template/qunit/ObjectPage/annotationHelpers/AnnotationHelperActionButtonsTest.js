/*
 * tests for the sap.suite.ui.generic.template.ObjectPage.annotationHelpers.AnnotationHelperActionButtons
 */

sap.ui.define([
	"sap/ui/core/util/MockServer",
	"sap/suite/ui/generic/template/ObjectPage/annotationHelpers/AnnotationHelperActionButtons"
], function(MockServer, AnnotationHelperActionButtons) {
	"use strict";
	
	function getMockModel() {

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
			// both annotations files are needed to have a suitable meta model
			annotationURI: [
				"test-resources/sap/suite/ui/generic/template/demokit/sample.manage.products/webapp/localService/annotations.xml",
				"test-resources/sap/suite/ui/generic/template/demokit/sample.manage.products/webapp/annotations/annotations.xml"
			]
		});

		oModel.setSizeLimit(10);
		return oModel;
	}	

	QUnit.module("Tests for isEditButtonRequired", {
	    beforeEach : function () {
	        var oModel = {
	            getODataProperty: function (oType, vName, bAsPath) {
	                var oODataProperty = null;
	                if (oType.name === "STTA_C_MP_ProductType" && vName === "CanUpdate") {
	                    oODataProperty = { name: "CanUpdate", type: "Edm.Boolean" };
	                } else if (oType.name === "STTA_C_MP_ProductRestrictionType" && vName === "CanUpdate"){
	                    oODataProperty = { name: "CanUpdate", type: "Edm.Boolean" };
	                }
	                return oODataProperty;
	            },
	            getODataEntityType: function (sQualifiedName, bAsPath) {
	                var oODataEntityType = null;
	                if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_ProductType") {
	                    oODataEntityType = { name: "STTA_C_MP_ProductType" };
	                } else if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_ProductRestrictionType") {
	                    oODataEntityType = { name: "STTA_C_MP_ProductRestrictionType" };
	                }
	                return oODataEntityType;
	            },
	            getODataAssociationEnd: function (oEntityType, sName) {
	                var oODataAssociationEnd = null;
	                if (sName === "to_ProductText") {
	                    oODataAssociationEnd = { type: "STTA_PROD_MAN.STTA_C_MP_ProductRestrictionType", multiplicity: "0..*" };
	                }
	                return oODataAssociationEnd;
	            }
	        };
	        this.oInterface = {
	        	getInterface: function(i){
	        		return (i === 0) && {
	        			getModel: function(){
	        				return oModel;
	        			}
	        		};
	        	}
	        };
	        this.oEntitySet = {
	        	entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType"
	        };
	        this.mRestrictions = undefined;

	        var Log = sap.ui.require("sap/base/Log");
	        this.stubLogError = sinon.stub(Log, "error");
	    },
	    afterEach : function() {
	        this.stubLogError.restore();
	    }
	});

	QUnit.test("Function isEditButtonRequired is available", function(assert) {
	    assert.ok(AnnotationHelperActionButtons.isEditButtonRequired);
	});

	QUnit.test("isEditButtonRequired returns true WHEN no update restrictions are there", function(assert) {
	    this.mRestrictions = undefined;

	    assert.ok(AnnotationHelperActionButtons.isEditButtonRequired(this.oInterface, this.mRestrictions, this.oEntitySet, false, [], true));
	    assert.ok(!this.stubLogError.called, "Error log should not called");
	});

	QUnit.test("isEditButtonRequired returns true WHEN Updatable is not  annotated", function(assert) {
	    this.mRestrictions = Object.create(null);

	    assert.ok(AnnotationHelperActionButtons.isEditButtonRequired(this.oInterface, this.mRestrictions, this.oEntitySet, false, [], true));
	    assert.ok(!this.stubLogError.called, "Error log should not called");
	});

	QUnit.test("isEditButtonRequired returns false WHEN Updatable is empty", function(assert) {
	    this.mRestrictions = {
	    	Updatable: Object.create(null)
	    };

	    assert.ok(!AnnotationHelperActionButtons.isEditButtonRequired(this.oInterface, this.mRestrictions, this.oEntitySet, false, [], true));
	    assert.ok(this.stubLogError.called, "Error log should be called once");
	});

	QUnit.test("isEditButtonRequired returns false WHEN both updatable and updatable-path are annotated", function(assert) {
	    this.mRestrictions = {
	        "Updatable": {
	            "Bool": "true",
	            "Path": "CanUpdate"
	        }
	    };

	    assert.ok(!AnnotationHelperActionButtons.isEditButtonRequired(this.oInterface, this.mRestrictions, this.oEntitySet, false, [], true));
	    assert.ok(this.stubLogError.called, "Error log should be called once");
	});

	QUnit.test("isEditButtonRequired returns true WHEN Updatable is set to true", function(assert) {
	    this.mRestrictions = {
	        "Updatable": {
	            "Bool": "true"
	        }
	    };

	    assert.ok(AnnotationHelperActionButtons.isEditButtonRequired(this.oInterface, this.mRestrictions, this.oEntitySet, false, [], true));
	    assert.ok(!this.stubLogError.called, "Error log should not called");
	});

	QUnit.test("isEditButtonRequired returns false WHEN Updatable is set to false", function(assert) {
	    this.mRestrictions = {
	        "Updatable": {
	            "Bool": "false"
	        }
	    };

	    assert.ok(!AnnotationHelperActionButtons.isEditButtonRequired(this.oInterface, this.mRestrictions, this.oEntitySet, false, [], true));
	    assert.ok(!this.stubLogError.called, "Error log should not called");
	});

	QUnit.test("isEditButtonRequired returns true WHEN updatable-path is set to a valid path", function(assert) {
	    this.mRestrictions = {
	        "Updatable": {
	            "Path": "CanUpdate"
	        }
	    };

	    assert.ok(AnnotationHelperActionButtons.isEditButtonRequired(this.oInterface, this.mRestrictions, this.oEntitySet, false, [], true));
	    assert.ok(!this.stubLogError.called, "Error log should not called");
	});

	QUnit.test("isEditButtonRequired returns false WHEN updatable-path is set to a property that is not Edm.Boolean", function(assert) {
	    this.mRestrictions = {
	        "Updatable": {
	            "Path": "CanUpdateBad"
	        }
	    };

	    assert.ok(!AnnotationHelperActionButtons.isEditButtonRequired(this.oInterface, this.mRestrictions, this.oEntitySet, false, [], true));
	    assert.ok(this.stubLogError.calledOnce, "Error log should be called once");
	});

	QUnit.test("isEditButtonRequired returns false WHEN updatable-path is set to a property that is not found", function(assert) {
	    this.mRestrictions = {
	        "Updatable": {
	            "Path": "CanUpdateDoesNotExist"
	        }
	    };

	    assert.ok(!AnnotationHelperActionButtons.isEditButtonRequired(this.oInterface, this.mRestrictions, this.oEntitySet, false, [], true));
	    assert.ok(this.stubLogError.calledOnce, "Error log should be called once");
	});


	QUnit.module("Tests for getDeleteActionButtonVisibility", {
	    beforeEach : function () {
	        this.oInterface = {
	            getInterface: function (iPart, sPath) {
	                return {
	                    getModel: function() {
	                        return this.oModel;
	                    }.bind(this)
	                }
	            }.bind(this)
	        };
	        this.oModel = {
	            getODataProperty: function (oType, vName, bAsPath) {
	                var oODataProperty = null;
	                if (oType.name === "STTA_C_MP_ProductType" && vName === "CanDelete") {
	                    oODataProperty = { name: "CanDelete", type: "Edm.Boolean" };
	                } else if (oType.name === "STTA_C_MP_ProductRestrictionType" && vName === "CanDelete"){
	                    oODataProperty = { name: "CanDelete", type: "Edm.Boolean" };
	                }
	                return oODataProperty;
	            },
	            getODataEntityType: function (sQualifiedName, bAsPath) {
	                var oODataEntityType = null;
	                if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_ProductType") {
	                    oODataEntityType = { name: "STTA_C_MP_ProductType" };
	                } else if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_ProductRestrictionType") {
	                    oODataEntityType = { name: "STTA_C_MP_ProductRestrictionType" };
	                }
	                return oODataEntityType;
	            },
	            getODataAssociationEnd: function (oEntityType, sName) {
	                var oODataAssociationEnd = null;
	                if (sName === "to_ProductText") {
	                    oODataAssociationEnd = { type: "STTA_PROD_MAN.STTA_C_MP_ProductRestrictionType", multiplicity: "0..*" };
	                }
	                return oODataAssociationEnd;
	            }
	        };
	        this.oEntitySet = {
	        	entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType"
	        };
	        this.mRestrictions = undefined;

	        var Log = sap.ui.require("sap/base/Log");
	        this.stubLogError = sinon.stub(Log,"error");
	    },
	    afterEach : function() {
	        this.stubLogError.restore();
	    }
	});

	QUnit.test("Function getDeleteActionButtonVisibility is available", function(assert) {
	    assert.ok(AnnotationHelperActionButtons.getDeleteActionButtonVisibility);
	});

	QUnit.test("Function getDeleteActionButtonVisibility returns '{= !${ui>/editable} }' WHEN the restriction annotations are undefined (not maintained) for a Draft Application", function(assert) {
	    var expected = "{= !${ui>/editable} }";
		var oTreeNode = {
			isDraft: true,
			level: 1
		};
	    this.mRestrictions = undefined;

	    assert.equal(AnnotationHelperActionButtons.getDeleteActionButtonVisibility(this.oInterface, this.mRestrictions, this.oEntitySet, {}, oTreeNode), expected, "Returned expression is correct");
	});

	QUnit.test("Function getDeleteActionButtonVisibility returns '{= !${ui>/createMode} }' WHEN the restriction annotations are undefined (not maintained) for a Non Draft Application", function(assert) {
	    var expected = "{= !${ui>/createMode} }";
		var oTreeNode = {
			isDraft: false,
			fCLLevel: 1,
			children: []
		};
	    this.mRestrictions = undefined;

		assert.equal(AnnotationHelperActionButtons.getDeleteActionButtonVisibility(this.oInterface, this.mRestrictions, this.oEntitySet, {}, oTreeNode), expected, "Returned expression is correct");
	});

	QUnit.test("Function getDeleteActionButtonVisibility returns '{= !${ui>/editable} }' WHEN the restriction annotations is set to true for a Draft Application", function(assert) {
	    var expected = "{= !${ui>/editable} }";
		var oTreeNode = {
			isDraft: true,
			fCLLevel: 1,
			level: 1,
			children: []
		};
	    this.mRestrictions = {
	        "Deletable": {
	            "Bool": "true"
	        }
	    };

	    assert.equal(AnnotationHelperActionButtons.getDeleteActionButtonVisibility(this.oInterface, this.mRestrictions, this.oEntitySet, {}, oTreeNode), expected, "Returned expression is correct");
	});

	QUnit.test("Function getDeleteActionButtonVisibility returns '{= !${ui>/createMode} }' WHEN the restriction annotations is set to true for a Non Draft Application", function(assert) {
	    var expected = "{= !${ui>/createMode} }";
		var oTreeNode = {
			isDraft: false,
			fCLLevel: 1,
			children: []
		};
	    this.mRestrictions = {
	        "Deletable": {
	            "Bool": "true"
	        }
	    };

	    assert.equal(AnnotationHelperActionButtons.getDeleteActionButtonVisibility(this.oInterface, this.mRestrictions, this.oEntitySet, {}, oTreeNode), expected, "Returned expression is correct");
	});

	QUnit.test("Function getDeleteActionButtonVisibility returns a complex binding WHEN the restriction annotations has a valid Path for a Draft Application", function(assert) {
	    var expected = "{= !${ui>/editable} && !!${CanDelete} }";
		var oTreeNode = {
			isDraft: true,
			fCLLevel: 1,
			level: 1,
			children: []
		};
	    this.mRestrictions = {
	        "Deletable": {
	            "Path": "CanDelete"
	        }
	    };

	    assert.equal(AnnotationHelperActionButtons.getDeleteActionButtonVisibility(this.oInterface, this.mRestrictions, this.oEntitySet, {}, oTreeNode), expected, "Returned expression is correct");
	});

	QUnit.test("Function getDeleteActionButtonVisibility returns a complex binding WHEN the restriction annotations has a valid Path for a Non Draft Application", function(assert) {
	    var expected = "{= !${ui>/createMode} && !!${CanDelete} }";
		var oTreeNode = {
			isDraft: false,
			fCLLevel: 1,
			children: []
		};
	    this.mRestrictions = {
	        "Deletable": {
	            "Path": "CanDelete"
	        }
	    };

	    assert.equal(AnnotationHelperActionButtons.getDeleteActionButtonVisibility(this.oInterface, this.mRestrictions, this.oEntitySet, {}, oTreeNode), expected, "Returned expression is correct");
	});

	QUnit.test("Function getDeleteActionButtonVisibility returns a complex binding WHEN the restriction annotations has a valid Path for a Non Draft FCL Application with 3rd Column Open", function(assert) {
	    var expected = "{= !${ui>/createMode} && ${_templPrivGlobal>/generic/FCL/highestViewLevel} === 1 && !!${CanDelete} }";
		var oAppComponent = {
			getFlexibleColumnLayout: function(){
				return {
					maxColumnsCount: 3
				};
			}
		};
		var oTreeNode = {
			isDraft: false,
			level: 1,
			fCLLevel: 1,
			children: ["Entity1"]
		};
	    this.mRestrictions = {
	        "Deletable": {
	            "Path": "CanDelete"
	        }
	    };

	    assert.equal(AnnotationHelperActionButtons.getDeleteActionButtonVisibility(this.oInterface, this.mRestrictions, this.oEntitySet, oAppComponent, oTreeNode), expected, "Returned expression is correct");
	});

	QUnit.module("Tests for getActionControlBreakoutVisibility");

	QUnit.test("Function getActionControlBreakoutVisibility true if no applicablePath is available", function(assert) {
		var sResult = AnnotationHelperActionButtons.getActionControlBreakoutVisibility();
		assert.strictEqual(sResult, true);
	});

	QUnit.test("Function getActionControlBreakoutVisibility true if applicablePath is empty string", function(assert) {
		var sResult = AnnotationHelperActionButtons.getActionControlBreakoutVisibility("");
		assert.strictEqual(sResult, true);
	});

	QUnit.test("Function getActionControlBreakoutVisibility provides the correct binding string for an applicable path", function(assert) {
		var sResult = AnnotationHelperActionButtons.getActionControlBreakoutVisibility("entity/field");
		assert.strictEqual(sResult, "{path: 'entity/field'}");
	});
	
	QUnit.test("check method getDatafieldForActionVisibility with Mock data in draft case", function (assert) {
		var sActionApplicablePath = "IsActiveEntity";
		var sEntityType = "SEPMRA_PROD_MAN.SEPMRA_C_PD_ProductType";
		var done = assert.async();
		var oModel = getMockModel();
		assert.ok(oModel, "oModel Initiated");
		var oDataField = {
			"RecordType": "com.sap.vocabularies.UI.v1.DataFieldForAction"
		};
		if (oModel) {
			oModel.getMetaModel().loaded().then(function () {
				var oMetaModel = oModel.getMetaModel();
				assert.ok(oMetaModel, "MetaModel is ok");
				var oInterface = {
					getInterface: function () {
						return {
							getModel: function () {
								return oMetaModel;
							},
							getPath: function () {
								return "/dataServices/schema/0/entityType/20/com.sap.vocabularies.UI.v1.SelectionFields/0";
							},
							getSetting: function () {}
						}
					}
				};
				var sResult = AnnotationHelperActionButtons.getDatafieldForActionVisibility(oInterface, sActionApplicablePath, sEntityType, oDataField, true);
				var ExpectedVal = "{IsActiveEntity}";
				assert.equal(sResult, ExpectedVal, "Function returned the expected value");

				//Make empty value
				sActionApplicablePath = "";
				sResult = AnnotationHelperActionButtons.getDatafieldForActionVisibility(oInterface, sActionApplicablePath, sEntityType, oDataField, true);
				ExpectedVal = "true";
				assert.equal(sResult, ExpectedVal, "With the empty parameter");

				//When oDataField contains Hidden annotation
				oDataField = {
					"com.sap.vocabularies.UI.v1.Hidden": {
						"Bool": "true"
					}
				}
				var oSpy = sinon.spy(sap.suite.ui.generic.template.js.AnnotationHelper, "getBindingForHiddenPath");
				AnnotationHelperActionButtons.getDatafieldForActionVisibility(oInterface, sActionApplicablePath, sEntityType, oDataField, true);
				assert.equal(oSpy.calledOnce, true, "getBindingForHiddenPath function called if UI.Hidden is used");
				oSpy.restore();
				done();
			});
		}
	});
	
	QUnit.test("check method getDatafieldForActionVisibility in simple scenario in non-draft case", function (assert) {
		var sResult = AnnotationHelperActionButtons.getDatafieldForActionVisibility(null, null, null, {}, false);
		var sExpectedVal = "{= !${ui>/createMode} }";
		assert.equal(sResult, sExpectedVal, "in non-draft case with no further restriction");
	});
});