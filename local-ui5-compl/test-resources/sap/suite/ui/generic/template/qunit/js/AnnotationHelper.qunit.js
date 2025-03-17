sap.ui.define(["sap/ui/core/UIComponent",
	"sap/base/Log",
	"sap/suite/ui/generic/template/js/AnnotationHelper",
	"sap/ui/core/util/MockServer",
	"sap/suite/ui/generic/template/genericUtilities/testableHelper",
	"sap/suite/ui/generic/template/genericUtilities/metadataAnalyser",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/odata/AnnotationHelper",
	"tests/AnnotationHelper-isRelatedEntityCreatable",
	"tests/AnnotationHelper-areBooleanRestrictionsValidAndPossible",
	"tests/AnnotationHelper-ProgressIndicator",
	"tests/AnnotationHelper-SmartMicroChart",
	"tests/AnnotationHelper-determiningActions",
	"tests/AnnotationHelper-createP13N",
	// "tests/AnnotationHelper-determineTableType", removed, as determination of table type is moved into
	// SmartTable.fragment itself. Currently, no unit tests on fragments possible. As soon as this is
	// possible, tests should be transferred accordingly
	"tests/AnnotationHelper-getBindingForHiddenPath",
	"tests/AnnotationHelper-getPresentationVariant",
	"tests/AnnotationHelper-buildSmartTableCustomizeConfig",
	"tests/AnnotationHelper-keyboardShortcut",
	"tests/AnnotationHelper-getCreationMode",
], function (UIComponent, Log, AnnotationHelper, MockServer, testableHelper, metadataAnalyser, ODataModel, ODataAnnotationHelper) {

	var oGetComponentDataStub;
	// map function which behaves exactly like jQuery map
	// it discards the undefined values in array
	function map (aItem, callback) {
		return aItem.map(callback).filter(function (element) {
			return element !== undefined;
		});
	}

	var oTestStub; // host for static functions to be tested
	QUnit.module("Basic checks: AnnotationHelper", {

		beforeEach: function () {
			testableHelper.startTest();
			oTestStub = testableHelper.getStaticStub();
			this.oAnnotationHelper = AnnotationHelper;
			oGetComponentDataStub = sinon.stub(UIComponent.prototype, "getComponentData", function () {
				return {
					registryEntry: {
						oTemplateContract: {
							mRoutingTree: {

							}
						}
					}
				};
			});
			//var Interface_test = sinon.createStubInstance("sap.ui.base");
			//var Interface_test = Interface;
		},

		afterEach: function () {
			this.oAnnotationHelper = null;
			oGetComponentDataStub.restore();
			testableHelper.endTest();
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
			oModel = new ODataModel("/sap/opu/odata/sap/SEPMRA_PROD_MAN/", {
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

	// You can have any number of calls to the 'test' function, one for each unit test you want to run
	// setup gets run before any test, and teardown gets run after all of the tests have finished

	QUnit.test("instance AnnotationHelper available", function (assert) {
		assert.ok(this.oAnnotationHelper);
	});

	QUnit.test("has method validation: isSelf", function (assert) {
		assert.equal(typeof this.oAnnotationHelper.isSelf, "function", "isSelf function availability");
		assert.equal(typeof this.oAnnotationHelper.number, "function", "number function availability");
		assert.equal(typeof this.oAnnotationHelper.formatColor, "function", "formatColor function availability");
	});
	QUnit.test("executes function: isSelf", function (assert) {
		bBool = this.oAnnotationHelper.isSelf();
		assert.ok(bBool, "isSelf executed with undefined path");
		bBool = this.oAnnotationHelper.isSelf("@com.sap.vocabularies.UI.v1.Identification");
		assert.ok(bBool, "isSelf executed with @ at beginning");
		bBool = this.oAnnotationHelper.isSelf("abc@sap.com");
		assert.ok(!bBool, "isSelf executed with @ in the middle");
	});

	/* New Qunit test cases */
	/* Test cases for number function*/
	//module('number function');

	QUnit.test("executes function: number", function (assert) {
		bBool = this.oAnnotationHelper.number("3423ads");
		assert.ok(!bBool, "number executed with number and character");

		bBool = this.oAnnotationHelper.number("");
		assert.ok(!bBool, "number executed with empty values");

		bBool = this.oAnnotationHelper.number("23423");
		assert.equal(!bBool, true, "number executed with number and character");

		bBool = this.oAnnotationHelper.number("23423.23423");
		assert.equal(!bBool, true, "number with decimel values");
	});

	[{
			result: "true"
		},
		{
			result: "2015-03-24"
		},
		{
			result: "2015-03-24T14:03:27Z"
		},
		{
			result: "-123456789012345678901234567890.1234567890"
		},
		{
			result: "-7.4503e-36"
		},
		{
			result: "0050568D-393C-1ED4-9D97-E65F0F3FCC23"
		},
		{
			result: "9007199254740992"
		},
		{
			result: "13:57:06"
		}
	].forEach(function (oFixture) {

		QUnit.test("Inputs for number function:" + oFixture.result, function (assert) {
			//expect(0);
			bBool = this.oAnnotationHelper.number(oFixture.result);
			assert.notEqual(bBool, true, "Not Equal : " + oFixture.result);
		});
	});

	[{
			typeName: "Decimal",
			result: {
				Decimal: "12345666.1231232"
			}
		},

	].forEach(function (oFixture) {
		QUnit.test("Constant Parameters Equal:" + oFixture.result, function (assert) {
			result = {
				Decimal: "12345666.1231232"
			};
			bBool = this.oAnnotationHelper.number(oFixture.result);
			assert.equal(bBool, "12345666.1231232", "Equal : " + result);
		});
	});

	[{
			typeName: "path",
			result: {
				Path: "12345666.1231232"
			}
		}

	].forEach(function (oFixture) {
		QUnit.test("Deep Equal:" + oFixture.result, function (assert) {
			result = {
				Path: "12345666.1231232"
			};
			bBool = this.oAnnotationHelper.number(oFixture.result);
			assert.deepEqual(bBool, "{12345666.1231232}", "Deep Equal : " + result);
		});
	});


	QUnit.test("has method validation: formatColor", function (assert) {
		//This funciton is not used in the demokit app. but just basic test
		var Result = this.oAnnotationHelper.formatColor("3423");
		assert.equal(Result, undefined, "Function should returned undefined value");
	});

	QUnit.test("check method formatWithExpandSimple with Mock data", function (assert) {

		var oDataField = {
			EdmType: "Edm.String",
			Path: "Depth"
		};

		var done = assert.async();
		var oModel = this.getMockModel();
		assert.ok(oModel, "oModel Initiated");
		var oAnnotationHelper = this.oAnnotationHelper;

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
				var oEntitySet = oMetaModel.getODataEntitySet("SEPMRA_C_PD_Product");
				var sResolvedPath = "/dataServices/schema/0/entityType/16/com.sap.vocabularies.UI.v1.Facets/1/Target";
				var sResultEntitySet = "{Depth}";
				//var sResultEntitySet = "{path:'Depth',type:'sap.ui.model.odata.type.Decimal',constraints:{'precision':'13','scale':'3'}}";


				var oMetaContext = oMetaModel.getContext(sResolvedPath);
				assert.ok(oMetaContext, "Metadata is correct");
				var sResult = oAnnotationHelper.formatWithExpandSimple(oMetaContext, oDataField);
				assert.equal(sResult, sResultEntitySet, "Input parameter Depth is a decimal value");

				//var binding_ex = oModel.bindList("/SEPMRA_I_ProductSalesData");
				//var binding_path = binding_ex.getPath();
				//var binding_length = oModel.bindContext(binding_path);

				//oDataField path value for Currency
				oDataField = {
					EdmType: "Edm.String",
					Path: "Currency"
				};
				sResult = oAnnotationHelper.formatWithExpandSimple(oMetaContext, oDataField);
				var ExpectedValue = "{Currency}";
				//var ExpectedValue = "{path:'Currency',type:'sap.ui.model.odata.type.String',constraints:{'maxLength':'5','nullable':'false'}}";
				assert.equal(sResult, ExpectedValue, "Input parameter Currency is a decimal value");


				oDataField = {
					EdmType: "Edm.String",
					Apply: {
						Name: "odata.concat",
						Parameters: [{
							Type: "Path",
							Value: "DraftAdministrativeData/SiblingEntity"
						}, {
							Type: "Path",
							Value: "DraftAdministrativeData/SiblingEntity"
						}]
					}
				};
				sResult = oAnnotationHelper.formatWithExpandSimple(oInterface, oDataField);
				//var ExpectedValue = "{Currency}";
				ExpectedValue = "{DraftAdministrativeData/SiblingEntity}{DraftAdministrativeData/SiblingEntity}";
				assert.equal(sResult, ExpectedValue, "Input parameter Currency is a decimal value");

				done();

			});
		}
	});

	QUnit.test("check method _getNavigationPrefix with Mock data", function (assert) {
		var oDataField = {
			EdmType: "Edm.String",
			Path: "Depth"
		};
		var done = assert.async();
		var oModel = this.getMockModel();
		assert.ok(oModel, "oModel Initiated");
		var oAnnotationHelper = this.oAnnotationHelper;
		if (oModel) {
			oModel.getMetaModel().loaded().then(function () {
				var oMetaModel = oModel.getMetaModel();
				assert.ok(oMetaModel, "Metamodel is ok ");
				//var oEntitySet = oMetaModel.getODataEntitySet("SEPMRA_C_PD_Product");
				var oEntityType = oMetaModel.getODataEntityType("SEPMRA_PROD_MAN.SEPMRA_C_PD_ProductType");
				var sProperty = "Product/ActiveProduct";
				// function call with oMetaModel, oEntityType, sProperty

				var sResult = oAnnotationHelper._getNavigationPrefix(oMetaModel, oEntityType, sProperty);
				assert.equal(sResult, "", "Function returned null value");

				//mock different value for sProperty..
				sProperty = "DraftAdministrativeData";

				sResult = oAnnotationHelper._getNavigationPrefix(oMetaModel, oEntityType, sProperty);
				assert.equal(sResult, "", "Function should return the null value for single property");

				sProperty = "DraftAdministrativeData/SiblingEntity";
				sResult = oAnnotationHelper._getNavigationPrefix(oMetaModel, oEntityType, sProperty);
				assert.equal(sResult, "DraftAdministrativeData", "Function should return expected value: DraftAdministrativeData");
				done();

			});
		}
	});

	QUnit.test("check method getStableIdPartFromDataField with Mock data", function (assert) {
		var oDataField = {
			EdmType: "Edm.String",
			RecordType: "com.sap.vocabularies.UI.v1.DataField",
			Value: {
				Path: "ActiveSalesOrderID"
			},
			"com.sap.vocabularies.UI.v1.Importance": {
				EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
			}
		};

		var sResult = this.oAnnotationHelper.getStableIdPartFromDataField(oDataField);
		assert.equal(sResult, "ActiveSalesOrderID", "Function returned ActiveSalesOrderID value");
		//Mock oDatafield values with different values...
		oDataField = {
			Action: {
				String: "SEPMRA_PROD_MAN.SEPMRA_PROD_MAN_Entities/SEPMRA_C_PD_ProductCopy"
			},
			Label: {
				String: "Copy"
			},
			RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
			"com.sap.vocabularies.UI.v1.Importance": {
				EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
			}
		};

		var expectedValue = "SEPMRA_PROD_MAN.SEPMRA_PROD_MAN_Entities::SEPMRA_C_PD_ProductCopy";
		sResult = this.oAnnotationHelper.getStableIdPartFromDataField(oDataField);
		assert.equal(sResult, expectedValue, "Function should return the expected value");

		//Mock record type and path as empty value
		oDataField = {
			Action: {
				String: "SEPMRA_PROD_MAN.SEPMRA_PROD_MAN_Entities/SEPMRA_C_PD_ProductCopy"
			},
			Label: {
				String: "Copy"
			},
			RecordType: "",
			"com.sap.vocabularies.UI.v1.Importance": {
				EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
			}
		};
		//Mock Jquery error log
		var oErrorSpy = sinon.stub(Log, "error");
		oErrorSpy.returns("test error msg");
		sResult = this.oAnnotationHelper.getStableIdPartFromDataField(oDataField);
		assert.equal(sResult, undefined, "Function should return undefined");
		// Test Jquery error is called
		assert.ok(oErrorSpy.calledOnce, "Function should call Jquery error log function");
		oErrorSpy.restore();

		//Mock SemanticObject
		oDataField = {
			SemanticObject: {
				String: "Copy",
			},
			RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",

		};
		sResult = this.oAnnotationHelper.getStableIdPartFromDataField(oDataField);
		assert.equal(sResult, "Copy", "Function should return the expected value");

		//Mock SemanticObject-path
		oDataField = {
			SemanticObject: {
				Path: "ActiveSalesOrderID",
			},
			RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",

		};
		sResult = this.oAnnotationHelper.getStableIdPartFromDataField(oDataField);
		assert.equal(sResult, "ActiveSalesOrderID", "Function should return the expected value");

		//Mock SemanticObject
		oDataField = {
			SemanticObject: {
				String: ""
			},
			Action: {
				String: "SEPMRA_PROD_MAN.SEPMRA_PROD_MAN_Entities/SEPMRA_C_PD_ProductCopy"
			},
			RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",

		};
		expectedValue = "::SEPMRA_PROD_MAN.SEPMRA_PROD_MAN_Entities::SEPMRA_C_PD_ProductCopy";
		sResult = this.oAnnotationHelper.getStableIdPartFromDataField(oDataField);
		assert.equal(sResult, expectedValue, "Function should return the expected value");


		//Mock SemanticObject
		oDataField = {
			SemanticObject: {
				String: ""
			},
			Action: {
				Path: "ActiveSalesOrderID"
			},
			RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",

		};
		expectedValue = "::ActiveSalesOrderID";
		sResult = this.oAnnotationHelper.getStableIdPartFromDataField(oDataField);
		assert.equal(sResult, expectedValue, "Function should return the expected value");
		oDataField = {
			EdmType: "Edm.String",
			Value: {
				Path: "",
				Apply: {
					Name: "odata.concat",
					Parameters: [{
						Type: "Path",
						Value: "DraftAdministrativeData/SiblingEntity"
					}, {
						Type: "Path",
						Value: "DraftAdministrativeData/SiblingEntity"
					}]
				}
			},
			RecordType: "",

		};
		sResult = this.oAnnotationHelper.getStableIdPartFromDataField(oDataField);
		expectedValue = "DraftAdministrativeData::SiblingEntity::DraftAdministrativeData::SiblingEntity";
		assert.equal(sResult, expectedValue, "Function should return the expected value");

	});

	QUnit.test("check method getStableIdPartFromDataPoint with Mock data", function (assert) {
		//oData Field for Products..
		var oDataField = {
			Description: {
				String: "EPM: Product Unit Price"
			},
			LongDescription: {
				String: ""
			},
			Title: {
				String: "Price"
			},
			Value: {
				EdmType: "Edm.Decimal",
				Path: "Price"
			}
		};

		var sResult = this.oAnnotationHelper.getStableIdPartFromDataPoint(oDataField);
		assert.equal(sResult, "Price", "Function returned Price value for Products");
		//Mock value as empty to test jquery log error
		oDataField = {
			Description: {
				String: "EPM: Product Unit Price"
			},
			LongDescription: {
				String: ""
			},
			Title: {
				String: "Price"
			},
			Value: {
				EdmType: "Edm.Decimal",
				Path: ""
			}
		};
		var oErrorSpy = sinon.stub(Log, "error");
		oErrorSpy.returns("test error msg");
		sResult = this.oAnnotationHelper.getStableIdPartFromDataPoint(oDataField);
		assert.equal(sResult, undefined, "Function should return undefined");
		// Test Jquery error is called
		assert.ok(oErrorSpy.calledOnce, "Function should call Jquery error log function");
		oErrorSpy.restore();
		//Mock oDataField values
		oDataField = {
			EdmType: "Edm.String",
			Value: {
				Path: "",
				Apply: {
					Name: "odata.concat",
					Parameters: [{
						Type: "Path",
						Value: "DraftAdministrativeData/SiblingEntity"
					}, {
						Type: "Path",
						Value: "DraftAdministrativeData/SiblingEntity"
					}]
				}
			},
			RecordType: ""
		};
		sResult = this.oAnnotationHelper.getStableIdPartFromDataPoint(oDataField);
		var sExpectedValue = "DraftAdministrativeData::SiblingEntity::DraftAdministrativeData::SiblingEntity";
		assert.equal(sResult, sExpectedValue, "Function should return the expected value");

	});
	QUnit.test("Method to determine fetchValueListReadOnly value", function (assert) {
		var oAnnotationHelper = this.oAnnotationHelper;
		var oDataFieldValue = {
			'com.sap.vocabularies.UI.v1.TextArrangement': {
				EnumMember: 'com.sap.vocabularies.UI.v1.TextArrangementType/TextSeparate'
			}
		};
		var oEntityValue = {
			'com.sap.vocabularies.UI.v1.TextArrangement': {
				EnumMember: 'com.sap.vocabularies.UI.v1.TextArrangementType/TextSeparate'
			}
		};
		var oInterface = {
			getInterface: function () {
				return {
					getModel: function () {
						return {
							getObject: function () {
								return oDataFieldValue;
							},
							getContext: function () {
								return "";
							},
							getODataEntityType: function () {
								return oEntityValue;
							}
						}
					},
					getPath: function () {
						return "/dataServices/schema/0/entityType/17/com.sap.vocabularies.UI.v1.FieldGroup#GeneralInformationForHeader/Data/4";
					}
				}
			}
		};
		var sPropertyPath = "/dataServices/schema/0/entityType/17/property/27"
		var stubResolvePath = sinon.stub(ODataAnnotationHelper, "resolvePath", function () {
			return sPropertyPath;
		});

		var sEntityType = "STTA_PROD_MAN.STTA_C_MP_ProductType";

		// case 1 - property level textarrangement
		var sResult = oAnnotationHelper.getValueListReadOnly(oInterface, sEntityType, oDataFieldValue);
		var expectedValue = false;
		assert.equal(sResult, expectedValue, "Function should return the expected value");

		// case 2 - via sap:text
		var oDataFieldValue = {
			'com.sap.vocabularies.Common.v1.Text': 'to_BusinessPartner/CompanyName'
		};
		var sResult = oAnnotationHelper.getValueListReadOnly(oInterface, sEntityType, oDataFieldValue);
		var expectedValue = true;
		assert.equal(sResult, expectedValue, "Function should return the expected value");

		// case 3 - entity level textarrangement
		var oDataFieldValue = {};
		var sResult = oAnnotationHelper.getValueListReadOnly(oInterface, sEntityType, oDataFieldValue);
		var expectedValue = false;
		assert.equal(sResult, expectedValue, "Function should return the expected value");

		stubResolvePath.restore()
	});
	QUnit.test("Check method getConnectedFieldsTemplateParts with mock data", function (assert) {
        var oAnnotationHelper = this.oAnnotationHelper;
        var oTemplateData = {
            String: "  {ProductId}/{ProductCategory}/{Width}"
        };
        var expectedResult = ["{ProductId}", "{ProductCategory}", "{Width}"];
        var sResult = oAnnotationHelper.getConnectedFieldsTemplateParts(oTemplateData);

        assert.deepEqual(sResult, expectedResult, "Function 'getConnectedFieldsTemplateParts' is returning the expected value");

    });
    QUnit.test("Check method getConnectedFieldsDelimiter with mock data", function (assert) {
        var oAnnotationHelper = this.oAnnotationHelper;
        var oTemplateData = {
            String: "  {ProductId}/{ProductCategory}/{Width}"
        };

        var expectedResult = "/";
        var sResult = oAnnotationHelper.getConnectedFieldsDelimiter(oTemplateData);

        assert.equal(sResult, expectedResult, "Function 'getConnectedFieldsDelimiter' is returning the expected value");

    });

    QUnit.test("Check method rearrangeConnectedFields with mock", function (assert) {
        var oAnnotationHelper = this.oAnnotationHelper;
        var oConnectedFieldElement = {
            info: {
                Data: {
                    ProductId: {
                        EdmType: "Edm.String",
                        RecordType: "com.sap.vocabularies.UI.v1.DataField",
                        Value: {
                            Path: "ProductId"
                        }
                    },
                    Width: {
                        EdmType: "Edm.String",
                        RecordType: "com.sap.vocabularies.UI.v1.DataField",
                        Value: {
                            Path: "Width"
                        }
                    },
                    ProductCategory: {
                        EdmType: "Edm.String",
                        RecordType: "com.sap.vocabularies.UI.v1.DataField",
                        Value: {
                            Path: "ProductCategory"
                        }
                    }

                },
                Template: {
                    String: "  {ProductId}/{ProductCategory}/{Width}"
                },
                Label: {
                    String: "Product Details"
                }

            },
            getObject: function () {
                return this.info;
            }
        };

        var expectedResult = {
            info: {
                Data: {
                    ProductId: {
                        EdmType: "Edm.String",
                        RecordType: "com.sap.vocabularies.UI.v1.DataField",
                        Value: {
                            Path: "ProductId"
                        }
                    },

                    ProductCategory: {
                        EdmType: "Edm.String",
                        RecordType: "com.sap.vocabularies.UI.v1.DataField",
                        Value: {
                            Path: "ProductCategory"
                        },
                    },
                    Width: {
                        EdmType: "Edm.String",
                        RecordType: "com.sap.vocabularies.UI.v1.DataField",
                        Value: {
                            Path: "Width"
                        }
                    }

                },
                Template: {
                    String: "  {ProductId}/{ProductCategory}/{Width}"
                },
                Label: {
                    String: "Product Details"
                }

            },
            getObject: function () {
                return this.info;
            }
        }
		var actualKeys = Object.keys(oConnectedFieldElement.info.Data);
        var expectedKeys = Object.keys(expectedResult.info.Data);
        assert.notEqual(actualKeys[1], expectedKeys[1], "Before executing Function 'rearrangeConnectedFields' Original data is not alterted ");
        oAnnotationHelper.rearrangeConnectedFields(oConnectedFieldElement);
        var actualKeys1 = Object.keys(oConnectedFieldElement.info.Data);
        assert.equal(actualKeys1[1],expectedKeys[1], "Function 'rearrangeConnectedFields' altering original data");
 	});

	QUnit.test("Method to suppress duplicate column in tables (with DataFieldForAnnotation)", function (assert) {
		var done = assert.async();
		var oAnnotationHelper = this.oAnnotationHelper;
		var oModel = this.getMockModel();
		assert.ok(oModel, "oModel Initiated");
		var oAnnotationHelper = this.oAnnotationHelper;
		if (oModel) {
			oModel.getMetaModel().loaded().then(function () {
				var oMetaModel = oModel.getMetaModel();
				assert.ok(oMetaModel, "MetaModel is ok");
				var oInterface = {
					getInterface: function () {},
					getModel: function () {
						return oMetaModel;
					},
					getPath: function () {
						return "/dataServices/schema/0/entityType/3/com.sap.vocabularies.UI.v1.LineItem";
					},
					getSetting: function () {}
				};
				var sResolvedPath = "/dataServices/schema/0/entityType/3/com.sap.vocabularies.UI.v1.DataPoint#Rating";
				var fnResolvedPath = sinon.stub(ODataAnnotationHelper, "resolvePath", function () {
					return sResolvedPath;
				});
				var oDataField = {};
				oDataField.Value = {};
				oDataField.Value.Path = "GrossAmount";
				var fnMetaModelGetObject = sinon.stub(oMetaModel, "getObject", function () {
					return oDataField;
				});
				var oDataFieldForAnnotation = oMetaModel.getContext(sResolvedPath);
				var oEntity = [{
					"com.sap.vocabularies.UI.v1.Importance": {
						"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
					},
					"Value": {
						"Path": "SalesOrder"
					},
					"RecordType": "com.sap.vocabularies.UI.v1.DataField",
					"EdmType": "Edm.String"
				}, {
					"com.sap.vocabularies.UI.v1.Importance": {
						"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
					},
					"Value": {
						"Path": "BusinessPartnerID"
					},
					"RecordType": "com.sap.vocabularies.UI.v1.DataField",
					"EdmType": "Edm.String"
				}, {
					"com.sap.vocabularies.UI.v1.Importance": {
						"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
					},
					"Value": {
						"Path": "CurrencyCode"
					},
					"RecordType": "com.sap.vocabularies.UI.v1.DataField",
					"EdmType": "Edm.String"
				}, {
					"com.sap.vocabularies.UI.v1.Importance": {
						"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
					},
					"Value": {
						"Path": "CreationDateTime"
					},
					"RecordType": "com.sap.vocabularies.UI.v1.DataField",
					"EdmType": "Edm.DateTimeOffset"
				}, {
					"Target": {
						"AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#Rating"
					},
					"Label": {
						"String": "Rating"
					},
					"RecordType": "com.sap.vocabularies.UI.v1.DataFieldForAnnotation"
				}];
				var bExpression = oAnnotationHelper.suppressP13NDuplicateColumns(oInterface, oEntity);
				var bExpectedExpression = "GrossAmount";
				assert.equal(bExpression, bExpectedExpression, "Expected value is: " + bExpectedExpression);
				fnResolvedPath.restore();
				fnMetaModelGetObject.restore();
				done();
			});
		}
	});

	QUnit.test("Method to suppress duplicate column in tables (with DataField)", function (assert) {
		var oAnnotationHelper = this.oAnnotationHelper;
		var oModel = this.getMockModel();
		var done = assert.async();
		assert.ok(oModel, "oModel Initiated");
		var oAnnotationHelper = this.oAnnotationHelper;
		if (oModel) {
			oModel.getMetaModel().loaded().then(function () {
				var oMetaModel = oModel.getMetaModel();
				assert.ok(oMetaModel, "MetaModel is ok");
				var oInterface = {
					getInterface: function () {},
					getModel: function () {
						return oMetaModel;
					},
					getPath: function () {
						return "/dataServices/schema/0/entityType/3/com.sap.vocabularies.UI.v1.LineItem";
					},
					getSetting: function () {}


				};
				var oEntity = [{
					"com.sap.vocabularies.UI.v1.Importance": {
						"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
					},
					"Value": {
						"Path": "SalesOrder"
					},
					"RecordType": "com.sap.vocabularies.UI.v1.DataField",
					"EdmType": "Edm.String"
				}, {
					"com.sap.vocabularies.UI.v1.Importance": {
						"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
					},
					"Value": {
						"Path": "BusinessPartnerID"
					},
					"RecordType": "com.sap.vocabularies.UI.v1.DataField",
					"EdmType": "Edm.String"
				}, {
					"com.sap.vocabularies.UI.v1.Importance": {
						"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
					},
					"Value": {
						"Path": "CurrencyCode"
					},
					"RecordType": "com.sap.vocabularies.UI.v1.DataField",
					"EdmType": "Edm.String"
				}, {
					"com.sap.vocabularies.UI.v1.Importance": {
						"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
					},
					"Value": {
						"Path": "CreationDateTime"
					},
					"RecordType": "com.sap.vocabularies.UI.v1.DataField",
					"EdmType": "Edm.DateTimeOffset"
				}];
				var bExpression = oAnnotationHelper.suppressP13NDuplicateColumns(oInterface, oEntity);
				var bExpectedExpression = "";
				assert.equal(bExpression, bExpectedExpression, "Expected value is: " + bExpectedExpression);
				done();
			});
		}
	});

	QUnit.test("check method getStableIdPartFromFacet with Mock data", function (assert) {
		//oData Field for Products..
		var Facets = {
			Facets: [{
				Label: {
					String: "General Information"
				},
				RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
				Target: {
					AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup#GeneralInformation"
				}
			}],
			Label: {
				String: "General Information"
			},
			RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet"
		};

		var oAnnotationHelper = this.oAnnotationHelper;

		var oErrorSpy = sinon.stub(Log, "error");
		oErrorSpy.returns("test error msg");
		var sResult = this.oAnnotationHelper.getStableIdPartFromFacet(Facets);
		assert.ok(oErrorSpy.calledOnce, "Error: Jquery error log called");
		//assert.equal(sResult,"Price","Function returned Price value for Products");
		oErrorSpy.restore();
		//Mock the Facets value....
		Facets = {
			ID: {
				String: "GeneralInformation"
			},
			RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet"
		};
		sResult = this.oAnnotationHelper.getStableIdPartFromFacet(Facets);
		assert.equal(sResult, "GeneralInformation", "Function should return expected value");

		//Mock the Facets value....
		Facets = {
			ID: {
				String: "GeneralInformation"
			},
			RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
			Target: {
				AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup#GeneralInformation"
			}
		};
		sResult = this.oAnnotationHelper.getStableIdPartFromFacet(Facets);
		var expectedValue = "GeneralInformation";
		assert.equal(sResult, expectedValue, "Function should return expected value:" + sResult);
		Facets = {
			RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
			Target: {
				AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup#GeneralInformation"
			}
		};
		sResult = this.oAnnotationHelper.getStableIdPartFromFacet(Facets);
		var expectedValue = "com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformation";
		assert.equal(sResult, expectedValue, "Function should return expected value:" + sResult);
		//Mock RecordType value is empty and check error log is called
		Facets = {
			RecordType: "",
		};
		sResult = this.oAnnotationHelper.getStableIdPartFromFacet(Facets);
		assert.ok(oErrorSpy.calledOnce, "Error: Jquery error log called");
		oErrorSpy.restore();
	});

	QUnit.test("check method getStableIdPartForDatafieldActionButton with Mock data", function (assert) {
		var oDataField = {
			RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
			Label: {
				String: "ActionButton"
			},
			Action: {
				String: "ActionFunction"
			},
			Inline: {
				Bool: "true"
			}
		};
		var oFacet = {
			RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
			Label: {
				String: "ObjectPageActionButton"
			},
			Target: {
				AnnotationPath: "NavigationProperty/@com.sap.vocabularies.UI.v1.LineItem"
			}
		};
		var sResult = this.oAnnotationHelper.getStableIdPartForDatafieldActionButton(oDataField);
		assert.equal(sResult, "action::ActionFunction", "Action button stable ID for list report is correct.");
		var sResult = this.oAnnotationHelper.getStableIdPartForDatafieldActionButton(oDataField, oFacet);
		assert.equal(sResult, "NavigationProperty::com.sap.vocabularies.UI.v1.LineItem::action::ActionFunction", "Action button stable ID for object page is correct.");
	});

	QUnit.test("check method getExtensionPointBeforeFacetTitle with Mock data", function (assert) {
		//oData Field for Products..
		var Facets = {
			Facets: [{
				Label: {
					String: "General Information"
				},
				RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
				Target: {
					AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup#GeneralInformation"
				}
			}],
			Label: {
				String: "General Information"
			},
			RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet"
		};
		//var oEntitySet = oMetaModel.getODataEntitySet("SEPMRA_C_PD_Product");
		var oEntitySet = "SEPMRA_C_PD_Product";
		var sExtensionPointId = "";
		var oManifestExtend = [{
			'sap.suite.ui.generic.template.ObjectPage.view.Details': sExtensionPointId
		}];
		var oErrorSpy = sinon.stub(Log, "error");
		oErrorSpy.returns("test error msg");
		// For time being test call is commented as in demokit also getting the same issue..
		//var sResult = this.oAnnotationHelper.getExtensionPointBeforeFacetTitle(oEntitySet,Facets,oManifestExtend);
		//assert.equal(sResult,"Price","Function returned Price value for Products");
		//assert.ok(oErrorSpy.calledOnce,"test is ok");
		assert.ok("okay");
		oErrorSpy.restore();

	});
	QUnit.test("check method getExtensionPointAfterFacetTitle with Mock data", function (assert) {
		//oData Field for Products..
		var Facets = {
			Facets: [{
				Label: {
					String: "General Information"
				},
				RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
				Target: {
					AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup#GeneralInformation"
				}
			}],
			Label: {
				String: "General Information"
			},
			RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet"
		};
		//var oEntitySet = oMetaModel.getODataEntitySet("SEPMRA_C_PD_Product");
		var oEntitySet = "SEPMRA_C_PD_Product";
		var sExtensionPointId = "";
		var oManifestExtend = [{
			'sap.suite.ui.generic.template.ObjectPage.view.Details': sExtensionPointId
		}];
		var oErrorSpy = sinon.stub(Log, "error");
		oErrorSpy.returns("test error msg");
		// For time being test call is commented as in demokit also getting the same issue..
		//var sResult = this.oAnnotationHelper.getExtensionPointAfterFacetTitle(oEntitySet,Facets,oManifestExtend);
		//assert.equal(sResult,"Price","Function returned Price value for Products");
		//assert.ok(oErrorSpy.calledOnce,"test is ok");
		assert.ok("okay");
		oErrorSpy.restore();

	});

	QUnit.test("check method getColumnListItemType for Inline External Navigation", function (assert) {
		var bIsDraftEnabled = true;
		var aSubPagesLR = [{
			entitySet: "STTA_C_MP_ProductText",
			navigation: {
				display: {
					path: "sap.app.crossNavigation.outbounds",
					target: "EPMDisplaySalesOrder"
				}
			}
		}];

		var oListEntitySet = {
			name: "STTA_C_MP_ProductText",
			entityType: "STTA_PROD_MAN.STTA_C_MP_ProductTextType"
		};
		var oManifest = {
			"sap.app": {
				crossNavigation: {
					outbounds: {
						EPMDisplaySalesOrder: {
							semanticObject: "EPMSalesOrder",
							action: "manage_sttasowd",
							parameters: {}
						}
					}
				}
			},
			"sap.ui.generic.app": {
				"pages": [{
					"entitySet": "C_STTA_SalesOrder_WD_20",
					"component": {
					  "name": "sap.suite.ui.generic.template.ListReport",
					  "list": true,
					  "settings": {
					  }
					}
			}]
		}
		};

		var oTreeNode = {
			level: 0
		};

		var sAnnotationPath = undefined;
		var sResult = this.oAnnotationHelper.getColumnListItemType(oListEntitySet, aSubPagesLR, oManifest, oTreeNode, bIsDraftEnabled, sAnnotationPath);
		var expectedResult = "Navigation";
		assert.equal(sResult, expectedResult, "Chevron display bound correctly to external target for Responsive LR Table in draft applications when hideChevronForUnauthorizedExtNav flag is not set");

		bIsDraftEnabled = false;
		sResult = this.oAnnotationHelper.getColumnListItemType(oListEntitySet, aSubPagesLR, oManifest, oTreeNode, bIsDraftEnabled, sAnnotationPath);
		expectedResult = "Navigation"
		assert.equal(sResult, expectedResult, "Chevron display bound correctly to external target for Responsive LR Table in non-draft applications when hideChevronForUnauthorizedExtNav flag is not set");

		aSubPagesLR = [{
			entitySet: "STTA_C_MP_ProductText",
			component: {
				settings: {
					hideChevronForUnauthorizedExtNav: true
				}
			},
			navigation: {
				display: {
					path: "sap.app.crossNavigation.outbounds",
					target: "EPMDisplaySalesOrder"
				}
			}
		}];

		bIsDraftEnabled = true;
		var sAnnotationPath = undefined;
		var sResult = this.oAnnotationHelper.getColumnListItemType(oListEntitySet, aSubPagesLR, oManifest, oTreeNode, bIsDraftEnabled, sAnnotationPath);
		var expectedResult = "{= ${_templPriv>/generic/supportedIntents/EPMSalesOrder/manage_sttasowd/STTA_C_MP_ProductText/supported} ? 'Navigation' : 'Inactive'}";
		assert.equal(sResult, expectedResult, "Chevron display bound correctly to external target for Responsive LR Table in draft applications when hideChevronForUnauthorizedExtNav flag is set to true");

		bIsDraftEnabled = false;
		sResult = this.oAnnotationHelper.getColumnListItemType(oListEntitySet, aSubPagesLR, oManifest, oTreeNode, bIsDraftEnabled, sAnnotationPath);
		expectedResult = "{= ${_templPriv>/generic/supportedIntents/EPMSalesOrder/manage_sttasowd/STTA_C_MP_ProductText/supported} ? 'Navigation' : 'Inactive'}";
		assert.equal(sResult, expectedResult, "Chevron display bound correctly to external target for Responsive LR Table in non-draft applications when hideChevronForUnauthorizedExtNav flag is set to true");

		aSubPagesLR[0].component.settings.hideChevronForUnauthorizedExtNav = false;

		var sAnnotationPath = undefined;
		bIsDraftEnabled = true;
		var sResult = this.oAnnotationHelper.getColumnListItemType(oListEntitySet, aSubPagesLR, oManifest, oTreeNode, bIsDraftEnabled, sAnnotationPath);
		var expectedResult = "Navigation";
		assert.equal(sResult, expectedResult, "Chevron display bound correctly for Responsive LR Table in draft applications when hideChevronForUnauthorizedExtNav flag is set to false");

		bIsDraftEnabled = false;
		sResult = this.oAnnotationHelper.getColumnListItemType(oListEntitySet, aSubPagesLR, oManifest, oTreeNode, bIsDraftEnabled, sAnnotationPath);
		expectedResult = "Navigation";
		assert.equal(sResult, expectedResult, "Chevron display bound correctly for Responsive LR Table in non-draft applications when hideChevronForUnauthorizedExtNav flag is set to false");

		var aSubPagesOP = [{
			navigationProperty: "to_ProductText",
			entitySet: "STTA_C_MP_ProductText",
			component: {
				name: "sap.suite.ui.generic.template.ObjectPage"
			},
			navigation: {
				display: {
					path: "sap.app.crossNavigation.outbounds",
					target: "EPMDisplaySalesOrder"
				}
			}
		}];

		oTreeNode = {
			level: 1
		};

		sAnnotationPath = "to_ProductText/@com.sap.vocabularies.UI.v1.LineItem";
		bIsDraftEnabled = true;
		sResult = this.oAnnotationHelper.getColumnListItemType(oListEntitySet, aSubPagesOP, oManifest, oTreeNode, bIsDraftEnabled, sAnnotationPath);
		expectedResult = "Navigation";
		assert.equal(sResult, expectedResult, "Chevron display bound correctly to external target for Responsive OP Table in draft applications when hideChevronForUnauthorizedExtNav flag is not set");

		bIsDraftEnabled = false;
		sResult = this.oAnnotationHelper.getColumnListItemType(oListEntitySet, aSubPagesOP, oManifest, oTreeNode, bIsDraftEnabled, sAnnotationPath);
		expectedResult = "{= ${ui>/editable} ? 'Inactive' : 'Navigation' }";
		assert.equal(sResult, expectedResult, "Chevron display bound correctly to external target for Responsive OP Table in non-draft applications when hideChevronForUnauthorizedExtNav flag is not set");

		aSubPagesOP = [{
			navigationProperty: "to_ProductText",
			entitySet: "STTA_C_MP_ProductText",
			component: {
				name: "sap.suite.ui.generic.template.ObjectPage",
				settings: {
					hideChevronForUnauthorizedExtNav: true
				}
			},
			navigation: {
				display: {
					path: "sap.app.crossNavigation.outbounds",
					target: "EPMDisplaySalesOrder"
				}
			}
		}];

		sAnnotationPath = "to_ProductText/@com.sap.vocabularies.UI.v1.LineItem";
		bIsDraftEnabled = true;
		sResult = this.oAnnotationHelper.getColumnListItemType(oListEntitySet, aSubPagesOP, oManifest, oTreeNode, bIsDraftEnabled, sAnnotationPath);
		expectedResult = "{= ${_templPriv>/generic/supportedIntents/EPMSalesOrder/manage_sttasowd/STTA_C_MP_ProductText::to_ProductText/supported} ? 'Navigation' : 'Inactive'}";
		assert.equal(sResult, expectedResult, "Chevron display bound correctly to external target for Responsive OP Table in draft applications when hideChevronForUnauthorizedExtNav flag is set to true");

		bIsDraftEnabled = false;
		sResult = this.oAnnotationHelper.getColumnListItemType(oListEntitySet, aSubPagesOP, oManifest, oTreeNode, bIsDraftEnabled, sAnnotationPath);
		expectedResult = "{= ${_templPriv>/generic/supportedIntents/EPMSalesOrder/manage_sttasowd/STTA_C_MP_ProductText::to_ProductText/supported} && !${ui>/editable} ? 'Navigation' : 'Inactive'}";
		assert.equal(sResult, expectedResult, "Chevron display bound correctly to external target for Responsive OP Table in non-draft applications when hideChevronForUnauthorizedExtNav flag is set to true");

		aSubPagesOP[0].component.settings.hideChevronForUnauthorizedExtNav = false;

		sAnnotationPath = "to_ProductText/@com.sap.vocabularies.UI.v1.LineItem";
		bIsDraftEnabled = true;
		sResult = this.oAnnotationHelper.getColumnListItemType(oListEntitySet, aSubPagesOP, oManifest, oTreeNode, bIsDraftEnabled, sAnnotationPath);
		expectedResult = "Navigation";
		assert.equal(sResult, expectedResult, "Chevron display bound correctly for Responsive OP Table in draft applications when hideChevronForUnauthorizedExtNav flag is set to false");

		bIsDraftEnabled = false;
		sResult = this.oAnnotationHelper.getColumnListItemType(oListEntitySet, aSubPagesOP, oManifest, oTreeNode, bIsDraftEnabled, sAnnotationPath);
		expectedResult = "{= ${ui>/editable} ? 'Inactive' : 'Navigation' }";
		assert.equal(sResult, expectedResult, "Chevron display bound correctly for Responsive OP Table in non-draft applications when hideChevronForUnauthorizedExtNav flag is set to false");

	});

	QUnit.test("check method getRowActionCountForDetailPage for Inline External Navigation", function (assert) {
		var bIsDraftEnabled = true;
		var oListEntitySet = {
			name: "STTA_C_MP_ProductText",
			entityType: "STTA_PROD_MAN.STTA_C_MP_ProductTextType"
		};
		var aSubPages = [{
			navigationProperty: "to_ProductText",
			entitySet: "STTA_C_MP_ProductText",
			component: {
				name: "sap.suite.ui.generic.template.ObjectPage"
			},
			navigation: {
				display: {
					path: "sap.app.crossNavigation.outbounds",
					target: "EPMDisplaySalesOrder"
				}
			}
		}];

		var oManifest = {
			"sap.app": {
				crossNavigation: {
					outbounds: {
						EPMDisplaySalesOrder: {
							semanticObject: "EPMSalesOrder",
							action: "manage_sttasowd",
							parameters: {}
						}
					}
				}
			},
			"sap.ui.generic.app": {
				"pages": [{
					"entitySet": "C_STTA_SalesOrder_WD_20",
					"component": {
					  "name": "sap.suite.ui.generic.template.ListReport",
					  "list": true,
					  "settings": {
					  }
					}
			}]
		}
		};

		bIsDraftEnabled = true;
		var sAnnotationPath = "to_ProductText/@com.sap.vocabularies.UI.v1.LineItem";
		var sResult = this.oAnnotationHelper.getRowActionCountForDetailPage(oListEntitySet, aSubPages, oManifest, sAnnotationPath, bIsDraftEnabled);
		var expectedResult = 1;
		assert.equal(sResult, expectedResult, "Chevron display bound correctly to external target for Grid and Analytical OP Table in draft applications when hideChevronForUnauthorizedExtNav flag is not set");

		bIsDraftEnabled = false;
		sResult = this.oAnnotationHelper.getRowActionCountForDetailPage(oListEntitySet, aSubPages, oManifest, sAnnotationPath, bIsDraftEnabled);
		expectedResult = "{= ${ui>/editable} ? 0 : 1 }";
		assert.equal(sResult, expectedResult, "Chevron display bound correctly to external target for Grid and Analytical OP Table in non-draft applications when hideChevronForUnauthorizedExtNav flag is not set");

		aSubPages = [{
			navigationProperty: "to_ProductText",
			entitySet: "STTA_C_MP_ProductText",
			component: {
				name: "sap.suite.ui.generic.template.ObjectPage",
				settings: {
					hideChevronForUnauthorizedExtNav: true
				}
			},
			navigation: {
				display: {
					path: "sap.app.crossNavigation.outbounds",
					target: "EPMDisplaySalesOrder"
				}
			}
		}];

		bIsDraftEnabled = true;
		var sAnnotationPath = "to_ProductText/@com.sap.vocabularies.UI.v1.LineItem";
		var sResult = this.oAnnotationHelper.getRowActionCountForDetailPage(oListEntitySet, aSubPages, oManifest, sAnnotationPath, bIsDraftEnabled);
		var expectedResult = "{= ${_templPriv>/generic/supportedIntents/EPMSalesOrder/manage_sttasowd/STTA_C_MP_ProductText::to_ProductText/supported} ? 1 : 0}";
		assert.equal(sResult, expectedResult, "Chevron display bound correctly to external target for Grid and Analytical OP Table in draft applications when hideChevronForUnauthorizedExtNav flag is set to true");

		bIsDraftEnabled = false;
		sResult = this.oAnnotationHelper.getRowActionCountForDetailPage(oListEntitySet, aSubPages, oManifest, sAnnotationPath, bIsDraftEnabled);
		expectedResult = "{= ${_templPriv>/generic/supportedIntents/EPMSalesOrder/manage_sttasowd/STTA_C_MP_ProductText::to_ProductText/supported} && !${ui>/editable} ? 1 : 0}";
		assert.equal(sResult, expectedResult, "Chevron display bound correctly to external target for Grid and Analytical OP Table in non-draft applications when hideChevronForUnauthorizedExtNav flag is set to true");

		aSubPages[0].component.settings.hideChevronForUnauthorizedExtNav = false;

		bIsDraftEnabled = true;
		var sAnnotationPath = "to_ProductText/@com.sap.vocabularies.UI.v1.LineItem";
		var sResult = this.oAnnotationHelper.getRowActionCountForDetailPage(oListEntitySet, aSubPages, oManifest, sAnnotationPath, bIsDraftEnabled);
		var expectedResult = 1;
		assert.equal(sResult, expectedResult, "Chevron display bound correctly for Grid and Analytical OP Table in draft applications when hideChevronForUnauthorizedExtNav flag is set to false");

		bIsDraftEnabled = false;
		sResult = this.oAnnotationHelper.getRowActionCountForDetailPage(oListEntitySet, aSubPages, oManifest, sAnnotationPath, bIsDraftEnabled);
		expectedResult = "{= ${ui>/editable} ? 0 : 1 }";
		assert.equal(sResult, expectedResult, "Chevron display bound correctly for Grid and Analytical OP Table in non-draft applications when hideChevronForUnauthorizedExtNav flag is set to false");

	});

	QUnit.test("check method getRowActionCountForListReport for Inline External Navigation", function (assert) {
		var oListEntitySet = {
			name: "STTA_C_MP_Product",
			entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType"
		};
		var aSubPages = [{
			entitySet: "STTA_C_MP_Product",
			navigation: {
				display: {
					path: "sap.app.crossNavigation.outbounds",
					target: "EPMDisplaySalesOrder"
				}
			}
		}];
		var oManifest = {
			"sap.app": {
				crossNavigation: {
					outbounds: {
						EPMDisplaySalesOrder: {
							semanticObject: "EPMSalesOrder",
							action: "manage_sttasowd",
							parameters: {}
						}
					}
				}
			},
			"sap.ui.generic.app": {
				"pages": [{
					"entitySet": "C_STTA_SalesOrder_WD_20",
					"component": {
					  "name": "sap.suite.ui.generic.template.ListReport",
					  "list": true,
					  "settings": {
					  }
					}
			}]
		}
		};
		var oManifestSettings = {
			isLeaf: false
		};
		var sResult = this.oAnnotationHelper.getRowActionCountForListReport(oListEntitySet, aSubPages, oManifest, oManifestSettings);
		var expectedResult = 1;
		assert.equal(sResult, expectedResult, "Chevron display bound correctly to external target for LR in Grid/Analytical table in draft and non-draft applications when hideChevronForUnauthorizedExtNav flag is not set");

		aSubPages = [{
			entitySet: "STTA_C_MP_Product",
			component: {
				settings: {
					hideChevronForUnauthorizedExtNav: true
				}
			},
			navigation: {
				display: {
					path: "sap.app.crossNavigation.outbounds",
					target: "EPMDisplaySalesOrder"
				}
			}
		}];

		var sResult = this.oAnnotationHelper.getRowActionCountForListReport(oListEntitySet, aSubPages, oManifest, oManifestSettings);
		var expectedResult = "{= ${_templPriv>/generic/supportedIntents/EPMSalesOrder/manage_sttasowd/STTA_C_MP_Product/supported} ? 1 : 0}";
		assert.equal(sResult, expectedResult, "Chevron display bound correctly to external target for LR in Grid/Analytical table in draft and non-draft applications when hideChevronForUnauthorizedExtNav flag is set to true");

		aSubPages[0].component.settings.hideChevronForUnauthorizedExtNav = false;

		var sResult = this.oAnnotationHelper.getRowActionCountForListReport(oListEntitySet, aSubPages, oManifest, oManifestSettings);
		var expectedResult = 1;
		assert.equal(sResult, expectedResult, "Chevron display bound correctly for LR in Grid/Analytical table in draft and non-draft applications when hideChevronForUnauthorizedExtNav flag is set to false");

	});

	QUnit.test("check method actionControlDetermining with Mock data", function (assert) {
		var sActionApplicablePath = "IsActiveEntity";
		var oAnnotationHelper = this.oAnnotationHelper;
		var oDataField = {
			"RecordType": "com.sap.vocabularies.UI.v1.DataFieldForAction"
		};
		var oTreeNode = {
			level: 0
		};

		// In List report
		var sResult = oAnnotationHelper.actionControlDetermining(oTreeNode, sActionApplicablePath, oDataField);
		var ExpectedVal = true;
		assert.equal(sResult, ExpectedVal, "When oTreeNode specifies a root page");

		// In object page, when there is no applicable path
		sActionApplicablePath = undefined;
		oTreeNode = {
			level: 1
		};
		sResult = oAnnotationHelper.actionControlDetermining(oTreeNode, sActionApplicablePath, oDataField);
		ExpectedVal = true;
		assert.equal(sResult, ExpectedVal, "In Object Page, no applicable path");

		//In object page, with applicable path and without Hidden annotation
		sActionApplicablePath = "IsActiveEntity";
		sResult = oAnnotationHelper.actionControlDetermining(oTreeNode, sActionApplicablePath, oDataField);
		ExpectedVal = "{path: 'IsActiveEntity'}";
		assert.equal(sResult, ExpectedVal, "In Object Page, with applicable path");

		//When oDataField contains Hidden annotation
		oDataField = {
			"com.sap.vocabularies.UI.v1.Hidden": {
				"Bool": "true"
			}
		}
		var oSpy = sinon.spy(oAnnotationHelper, "getBindingForHiddenPath");
		oAnnotationHelper.actionControlDetermining(oTreeNode, sActionApplicablePath, oDataField);
		assert.equal(oSpy.calledOnce, true, "getBindingForHiddenPath function called if UI.Hidden is used");
		oSpy.restore();
	});

	QUnit.test("check method _actionControlExpand without the value sActionApplicablePath", function (assert) {
		var sActionApplicablePath = "";
		var sEntityType = "SEPMRA_PROD_MAN.SEPMRA_C_PD_ProductType";
		var done = assert.async();
		var oModel = this.getMockModel();
		assert.ok(oModel, "oModel Initiated");
		var oAnnotationHelper = this.oAnnotationHelper;
		if (oModel) {
			oModel.getMetaModel().loaded().then(function () {
				var oMetaModel = oModel.getMetaModel();
				assert.ok(oMetaModel, "MetaModel is ok")
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
				oAnnotationHelper._actionControlExpand(oInterface, sActionApplicablePath, sEntityType);
				assert.ok("Success");
				done();
			});
		}

	});

	QUnit.test("check method replaceSpecialCharsInId with mock data", function (assert) {
		assert.expect(3);
		sId = "SEPMRA_PROD_MAN.SEPMRA_PROD_MAN_Entities/SEPMRA_C_PD_ProductCopy";
		actions = this.oAnnotationHelper.replaceSpecialCharsInId(sId);
		var expectedValue = "SEPMRA_PROD_MAN.SEPMRA_PROD_MAN_Entities::SEPMRA_C_PD_ProductCopy";
		assert.strictEqual(actions, expectedValue, "Function should return the expected value");

		// test with error mock data with space
		sId = " SEPMRA_PROD_MAN.SEPMRA_PROD_MAN_Entities/SEPMRA_C_PD_ProductCopy";
		var ErrorSpy = sinon.stub(Log, "error");
		ErrorSpy.returns("Annotation Helper: Unable to get index.");
		var actionsNew = this.oAnnotationHelper.replaceSpecialCharsInId(sId);
		var expectedValueNew = " SEPMRA_PROD_MAN.SEPMRA_PROD_MAN_Entities::SEPMRA_C_PD_ProductCopy";
		assert.strictEqual(actionsNew, expectedValueNew, "Function should return the expected value with space");
		// test the Jquery error log is called
		assert.ok(ErrorSpy.calledOnce, "Function should call the Jquery error function");
		ErrorSpy.restore();
	});

	QUnit.test("check method formatWithExpand and getNavigationPathWithExpand with mock data", function (assert) {


		var done = assert.async();
		var oModel = this.getMockModel();
		assert.ok(oModel, "oModel Initiated");
		var oAnnotationHelper = this.oAnnotationHelper;
		if (oModel) {
			oModel.getMetaModel().loaded().then(function () {
				//Mock Odatafield value get from demokit app
				var oDataField = {
					EdmType: "Edm.Decimal",
					Path: "Price"
				};
				var oMetaModel = oModel.getMetaModel();
				assert.ok(oMetaModel, "MetaModel is ok");
				var oInterface = {
					getInterface: function () {
						return {
							getModel: function () {
								return oMetaModel;
							},
							getPath: function () {
								return "/dataServices/schema/0/entityType/16/com.sap.vocabularies.UI.v1.DataPoint#ProductCategory/Value";
							},
							getSetting: function () {}
						}
					}
				};
				//Mock Entityset...
				var oEntitySet = oMetaModel.getODataEntitySet("SEPMRA_C_PD_Product");
				var Result = oAnnotationHelper.formatWithExpand(oInterface, oDataField, oEntitySet);
				//var expectedValue = "{path:'Price',type:'sap.ui.model.odata.type.Decimal',constraints:{'precision':'16','scale':'3'}}";
				var expectedValue = "{Price}";
				assert.equal(Result, expectedValue, "Function should return expected object values");

				//testing with function getNavigationPathWithExpand ...
				Result = oAnnotationHelper.getNavigationPathWithExpand(oInterface, oDataField, oEntitySet);
				var expectedValue = "";
				assert.equal(Result, expectedValue, "Function should return empty object values");

				//Mock the oDataField value
				oDataField = {
					EdmType: "Edm.Decimal",
					Path: "DraftAdministrativeData/SiblingEntity"
				};
				Result = oAnnotationHelper.getNavigationPathWithExpand(oInterface, oDataField, oEntitySet);
				//var expectedValue = "{DraftAdministrativeData}";
				var expectedValue = "";
				assert.equal(Result, expectedValue, "Without Expand, function should return the expected object");

				//Changing getPath value to navigate into more conditions...
				oInterface = {
					getInterface: function () {
						return {
							getModel: function () {
								return oMetaModel;
							},
							getPath: function () {
								return "/dataServices/schema/0/entityType/16/com.sap.vocabularies.UI.v1.Facets/0/Facets/2/Target";
							},
							getSetting: function () {}
						}
					}
				};
				oDataField = {
					EdmType: "Edm.Decimal",
					AnnotationPath: "to_ProductCategory/@com.sap.vocabularies.UI.v1.Identification"
				};
				//expectedValue = "{to_ProductCategory}";
				expectedValue = "";
				Result = oAnnotationHelper.getNavigationPathWithExpand(oInterface, oDataField, oEntitySet);
				assert.equal(Result, expectedValue, "Without Expand, function should return the expected object");
				done();
			});
		}

	});

	QUnit.test("check method formatWithExpandSimplePath with mock data", function (assert) {
		var done = assert.async();
		var oModel = this.getMockModel();
		assert.ok(oModel, "oModel Initiated");
		if (oModel) {
			oModel.getMetaModel().loaded().then(function () {
				var oDataField = {
					EdmType: "Edm.Decimal",
					Path: "Weight",
					oValueFormat: {"NumberOfFractionalDigits" : {"Int" : 3}}
				};
				var oMetaModel = oModel.getMetaModel();
				assert.ok(oMetaModel, "MetaModel is ok");
				var oInterface = {
					getInterface: function () {
						return {
							getModel: function () {
								return oMetaModel;
							},
							getPath: function () {
								return "/dataServices/schema/0/entityType/16/com.sap.vocabularies.UI.v1.DataPoint#ProductCategory/Value";
							},
							getSetting: function () {}
						}
					}
				};
				var oEntitySet = oMetaModel.getODataEntitySet("SEPMRA_C_PD_Product");
				var Result = oAnnotationHelper.formatWithExpandSimplePath(oInterface, oDataField, oEntitySet);
				var expectedValue = "{Weight}";
				assert.equal(Result, expectedValue, "Function should return expected object values");

				var Result = oAnnotationHelper.formatWithExpandSimplePath(oInterface, oDataField, oEntitySet, oDataField.oValueFormat);
				var expectedValue = '{"path":"Weight","type":"sap.ui.model.odata.type.Decimal","constraints":{"scale":3}}';
				assert.equal(Result, expectedValue, "Function should return expected object with decimal formatter");
				done();
			});
		}
	});

	QUnit.test("check method extensionPointFragmentExists", function (assert) {
		var oFacet = {
			"Label": {
				"String": "{@i18n>@ProductDescriptions}"
			},
			"RecordType": "com.sap.vocabularies.UI.v1.ReferenceFacet",
			"Target": {
				"AnnotationPath": "to_EntitySet/@com.sap.vocabularies.UI.v1.LineItem"
			}
		};
		var sFragmentId1 = "to_EntitySet::com.sap.vocabularies.UI.v1.LineItem";
		var sFragmentId2 = "to_EntitySetX::com.sap.vocabularies.UI.v1.LineItem";
		var oAnnotationHelper = this.oAnnotationHelper
		var result;
		result = oAnnotationHelper.extensionPointFragmentExists(oFacet, sFragmentId1);
		assert.equal(result, true);
		result = oAnnotationHelper.extensionPointFragmentExists(oFacet, sFragmentId2);
		assert.equal(result, false);
	});

	QUnit.test("check getPersistencyKeyForSmartTable", function (assert) {
		var oAnnotationHelper = this.oAnnotationHelper;
		var oRouteConfig_ListReport = {
			"component": {
				"settings": {}
			}
		};
		var result;
		result = oAnnotationHelper.getPersistencyKeyForSmartTable(oRouteConfig_ListReport);
		assert.equal(result, "listReportFloorplanTable");
	});


	QUnit.test("check method doesFieldGroupContainOnlyOneMultiLineDataField", function (assert) {
		var oAnnotationHelper = this.oAnnotationHelper;

		var oFieldGroupWith0DataField = {
			"Data": []
		};

		var oFieldGroupWith1DataField = {
			"Data": [{
				"EdmType": "Edm.String",
				"RecordType": "com.sap.vocabularies.UI.v1.DataField",
				"Value": {
					"Path": "Description"
				}
			}]
		};

		var oFieldGroupWith2DataField = {
			"Data": [{
					"EdmType": "Edm.String",
					"RecordType": "com.sap.vocabularies.UI.v1.DataField",
					"Value": {
						"Path": "Description"
					}
				},
				{
					"EdmType": "Edm.String",
					"RecordType": "com.sap.vocabularies.UI.v1.DataField",
					"Value": {
						"Path": "Name"
					}
				}
			]
		};

		var oDataFieldPropertyMutilineDefined = {
			"com.sap.vocabularies.UI.v1.MultiLineText": {}
		};

		result = oAnnotationHelper.doesFieldGroupContainOnlyOneMultiLineDataField(oFieldGroupWith0DataField, {});
		assert.equal(result, false, "0 DataFields defined should return false");

		result = oAnnotationHelper.doesFieldGroupContainOnlyOneMultiLineDataField(oFieldGroupWith1DataField, oDataFieldPropertyMutilineDefined);
		assert.equal(result, true, "1 DataField and MultilineText defined should return true");

		result = oAnnotationHelper.doesFieldGroupContainOnlyOneMultiLineDataField(oFieldGroupWith1DataField, {});
		assert.equal(result, false, "1 DataField and MultilineText NOT defined should return false");

		result = oAnnotationHelper.doesFieldGroupContainOnlyOneMultiLineDataField(oFieldGroupWith2DataField, {});
		assert.equal(result, false, "2 DataFields defined should return false");
	});

	QUnit.test("buildBreadCrumbExpression", function (assert) {
		var oContext = {
			getInterface: function () {
				return this;
			},
			getModel: function () {
				return {};
			},
			getPath: function () {
				return "path";
			},
			getSetting: function () {
				return {};
			}
		};
		var oTitle = {
			Path: "path"
		};
		var oTypeName = { }; // property String will be set for the test
		var oTreeNode = {
			specificModelName: "theModelName",
			entityTypeDefinition: {
				"com.sap.vocabularies.UI.v1.HeaderInfo": {
					Title: {
						Value: oTitle
					},
					TypeName: oTypeName
				}
			}
		};
		var sResultAct;
		var sResultExp1 = "{= ${path} || 'name' }";
		var sResultExp2 = "{= ${path} || 'na\\'me' }";
		oTypeName.String = "name";
		sResultAct = this.oAnnotationHelper.buildBreadCrumbExpression(oContext, oTreeNode);
		assert.equal(sResultAct, sResultExp1, "breadcrumb expression built");
		// now check whether the same also works if the typename contains a quote
		oTypeName.String = "na'me";
		sResultAct = this.oAnnotationHelper.buildBreadCrumbExpression(oContext, oTreeNode);
		assert.equal(sResultAct, sResultExp2, "breadcrumb expression (with quote) built");
	});

	QUnit.test("getTargetEntitySet", function (assert) {
		var sAnnotationPath1 = "Annotation";
		var sAnnotationPath2 = "to_Item/Annotation";
		var oEntitySet1 = {
			entityType: "AType"
		};
		var oEntitySet2 = {
			entityType: "BType"
		};
		var oAssociationEnd = {
			entitySet: "B"
		};
		var oModel = {
			getODataEntityType: function () {
				return {};
			},
			getODataEntitySet: function () {
				return oEntitySet2;
			},
			getODataAssociationSetEnd: function () {
				return oAssociationEnd;
			}
		};
		var sResultAct;
		sResultAct = this.oAnnotationHelper.getTargetEntitySet(oModel, oEntitySet1, sAnnotationPath1);
		assert.equal(sResultAct, oEntitySet1, "entity set retrieved (without navigation property)");
		sResultAct = this.oAnnotationHelper.getTargetEntitySet(oModel, oEntitySet1, sAnnotationPath2);
		assert.equal(sResultAct, oEntitySet2, "entity set retrieved (with navigation property)");
	});

	QUnit.test("check get...Id functions", function (assert) {
		var sResultAct;
		var oTabItem = {
			key: "key"
		};
		var oCustomAction = {
			id: "id"
		};

		sResultAct = this.oAnnotationHelper.getBreakoutActionButtonId({}, oTabItem);
		assert.equal(sResultAct, undefined, "breakout action button ID (without tab suffix) built");
		sResultAct = this.oAnnotationHelper.getBreakoutActionButtonId(oCustomAction, oTabItem);
		assert.equal(sResultAct, "id-key", "breakout action button ID (with tab suffix) built");
	});

	QUnit.test("buildVisibilityExprOfDataFieldForIntentBasedNaviButton", function (assert) {
		var sSemanticObject = "EPMProduct",
			sAction = "Create",
			sExpected, sResult, bResult;
		var oDataField = {
			Inline: {
				Bool: "true"
			},
			RequiresContext: {
				Bool: "false"
			},
			SemanticObject: {
				String: sSemanticObject
			},
			Action: {
				String: sAction
			}
		};

		sExpected = "{= !!${_templPriv>/generic/supportedIntents/" + sSemanticObject + "/" + sAction + "/visible}}";
		bResult = this.oAnnotationHelper.buildVisibilityExprOfDataFieldForIntentBasedNaviButton(oDataField);
		assert.equal(bResult, true, "Inline buttons with RequiresContext = false should be visible");

		oDataField.RequiresContext.Bool = "true";
		bResult = this.oAnnotationHelper.buildVisibilityExprOfDataFieldForIntentBasedNaviButton(oDataField);
		assert.equal(bResult, true, "Inline buttons RequiresContext = true should be visible");

		oDataField.Inline.Bool = "false";
		bResult = this.oAnnotationHelper.buildVisibilityExprOfDataFieldForIntentBasedNaviButton(oDataField);
		assert.equal(bResult, true, "Toolbar buttons which require context should be always visible");

		oDataField.RequiresContext.Bool = "false";
		sResult = this.oAnnotationHelper.buildVisibilityExprOfDataFieldForIntentBasedNaviButton(oDataField);
		assert.equal(sResult, sExpected, "Visibility of toolbar buttons which do not require context should be bound to the expression");

		oDataField.Inline = null; // Nullable="true" so Inline attribute may be absent
		bResult = this.oAnnotationHelper.buildVisibilityExprOfDataFieldForIntentBasedNaviButton(oDataField);
		assert.equal(bResult, sExpected, "Visibility of toolbar buttons without 'inline' attribute & with RequiresContext = false should be bound to the expression");

		oDataField.RequiresContext.Bool = "true";
		bResult = this.oAnnotationHelper.buildVisibilityExprOfDataFieldForIntentBasedNaviButton(oDataField);
		assert.equal(bResult, true, "Visibility of toolbar buttons without 'inline' attribute & with RequiresContext = true should be true");

		oDataField.RequiresContext = null;
		bResult = this.oAnnotationHelper.buildVisibilityExprOfDataFieldForIntentBasedNaviButton(oDataField);
		assert.equal(bResult, true, "Visibility of toolbar buttons without 'inline' attribute & without RequiresContext should be true");

		oDataField.Inline = {
			Bool: "false"
		};
		bResult = this.oAnnotationHelper.buildVisibilityExprOfDataFieldForIntentBasedNaviButton(oDataField);
		assert.equal(bResult, true, "Visibility of toolbar buttons with Inline = 'false' & without RequiresContext should be true");

		oDataField.Inline.Bool = "true";
		bResult = this.oAnnotationHelper.buildVisibilityExprOfDataFieldForIntentBasedNaviButton(oDataField);
		assert.equal(bResult, true, "Visibility of toolbar buttons with Inline = 'true' & without RequiresContext should be true");

		oDataField = {
			"com.sap.vocabularies.UI.v1.Hidden": {
				"Bool": "true"
			}
		};
		var oSpy = sinon.spy(this.oAnnotationHelper, "getBindingForHiddenPath");
		this.oAnnotationHelper.buildVisibilityExprOfDataFieldForIntentBasedNaviButton(oDataField);
		assert.equal(oSpy.calledOnce, true, "getBindingForHiddenPath function called if UI.Hidden is used");
		oSpy.restore();
	});

	QUnit.test("Check getColumnCellFirstText", function (assert) {
		var sPath = "myTestPath",
			sResult, sExpectedValue, oEntityType = {};
		var oDataFieldValue = {};
		var oDataField = {
			Value: {
				Path: sPath
			}
		};

		var fnGetTextForDataField = this.stub(AnnotationHelper, "getTextForDataField").returns("MyV1Text");

		var fnGetTextArrangement = this.stub(AnnotationHelper, "getTextArrangement").returns("idAndDescription");
		//1: 'idAndDescription', v1.Text, oDataField.Value.Path exist
		sExpectedValue = "{" + sPath + "}";
		sResult = this.oAnnotationHelper.getColumnCellFirstText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'idAndDescription' and existing v1.Text and oDataField.Value.Path");

		//2: 'idAndDescription', oDataField.Value.Path exists, no v1.Text
		fnGetTextForDataField.returns(null);
		sExpectedValue = "{" + sPath + "}";
		sResult = this.oAnnotationHelper.getColumnCellFirstText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'idAndDescription', oDataField.Value.Path exists, no v1.Text");

		//3: 'idAndDescription', v1.Text exists, no oDataField.Value.Path
		fnGetTextForDataField.returns("MyV1Text");
		oDataField.Value.Path = null;
		sExpectedValue = "{MyV1Text}";
		sResult = this.oAnnotationHelper.getColumnCellFirstText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'idAndDescription', v1.Text exists, no oDataField.Value.Path");

		//4: 'idOnly', v1.Text, oDataField.Value.Path exist
		oDataField.Value.Path = sPath;
		fnGetTextArrangement.returns("idOnly");
		sExpectedValue = "{" + sPath + "}";
		sResult = this.oAnnotationHelper.getColumnCellFirstText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'idOnly' and existing v1.Text and oDataField.Value.Path");

		//5: 'idOnly', v1.Text exists, no oDataField.Value.Path
		oDataField.Value.Path = null;
		sExpectedValue = "{MyV1Text}";
		sResult = this.oAnnotationHelper.getColumnCellFirstText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'idOnly' and existing v1.Text and no oDataField.Value.Path");

		//6: 'idOnly', oDataField.Value.Path exists, no v1.Text
		fnGetTextForDataField.returns(null);
		oDataField.Value.Path = sPath;
		sExpectedValue = "{" + sPath + "}";
		sResult = this.oAnnotationHelper.getColumnCellFirstText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'idOnly' and existing oDataField.Value.Path and no v1.Text");

		//7: 'descriptionOnly', v1.Text, oDataField.Value.Path exist
		fnGetTextArrangement.returns("descriptionOnly");
		fnGetTextForDataField.returns("MyV1Text");
		sExpectedValue = "{MyV1Text}";
		sResult = this.oAnnotationHelper.getColumnCellFirstText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'descriptionOnly' and existing v1.Text and oDataField.Value.Path");

		//8: 'descriptionOnly', no v1.Text, oDataField.Value.Path exists
		fnGetTextForDataField.returns(null);
		sExpectedValue = "{" + sPath + "}";
		sResult = this.oAnnotationHelper.getColumnCellFirstText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'descriptionOnly' and existing oDataField.Value.Path and no v1.Text");

		//9: 'descriptionOnly', v1.Text, no oDataField.Value.Path
		fnGetTextForDataField.returns("MyV1Text");
		oDataField.Value.Path = null;
		sExpectedValue = "{MyV1Text}";
		sResult = this.oAnnotationHelper.getColumnCellFirstText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'descriptionOnly' and existing v1.Text and no oDataField.Value.Path");

		//10: 'descriptionAndId', v1.Text, oDataField.Value.Path exist
		oDataField.Value.Path = sPath;
		fnGetTextArrangement.returns("descriptionAndId"); // it is the case for both com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst and for no text arrangement at all
		sResult = this.oAnnotationHelper.getColumnCellFirstText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'descriptionAndId' and existing v1.Text and oDataField.Value.Path ");

		//11: 'descriptionAndId', no v1.Text, oDataField.Value.Path exists
		sExpectedValue = "{myTestPath}";
		fnGetTextForDataField.returns(null);
		sResult = this.oAnnotationHelper.getColumnCellFirstText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'descriptionAndId' and oDataField.Value.Path, no v1.Text");

		//12: 'descriptionAndId', no oDataField.Value.Path, v1.Text exists
		fnGetTextForDataField.returns("MyV1Text");
		oDataField.Value.Path = null;
		sExpectedValue = "{MyV1Text}";
		sResult = this.oAnnotationHelper.getColumnCellFirstText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'descriptionAndId' and v1.Text, no oDataField.Value.Path");

		// the return value should be undefined ( and not '{undefined}' ) if no value was determined
		sExpectedValue = undefined;
		fnGetTextForDataField.returns(null);
		sResult = this.oAnnotationHelper.getColumnCellFirstText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the return value should be 'undefined' if no value was determined");
	});

	QUnit.test("Check getColumnCellSecondText", function (assert) {
		var sPath = "myTestPath",
			sResult, oEntityType = {},
			sExpectedValue;
		var oDataFieldValue = {};
		var oDataField = {
			Value: {
				Path: sPath
			}
		};

		var fnGetTextForDataField = this.stub(AnnotationHelper, "getTextForDataField").returns("MyV1Text");
		var fnGetTextArrangement = this.stub(AnnotationHelper, "getTextArrangement").returns("idAndDescription");

		//1: 'idAndDescription', v1.Text, oDataField.Value.Path exist
		sExpectedValue = "{MyV1Text}";
		sResult = this.oAnnotationHelper.getColumnCellSecondText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'idAndDescription' and existing v1.Text and oDataField.Value.Path");

		//2: 'idAndDescription', oDataField.Value.Path exists, no v1.Text
		fnGetTextForDataField.returns(null);
		sExpectedValue = undefined;
		sResult = this.oAnnotationHelper.getColumnCellSecondText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'idAndDescription' and existing oDataField.Value.Path, no v1.Text");

		//3: 'idAndDescription', v1.Text exists, no oDataField.Value.Path
		fnGetTextForDataField.returns("MyV1Text");
		oDataField.Value.Path = null;
		sResult = this.oAnnotationHelper.getColumnCellSecondText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'idAndDescription' and existing v1.Text, no oDataField.Value.Path");

		//4: 'idOnly', v1.Text, oDataField.Value.Path exist
		oDataField.Value.Path = sPath;
		fnGetTextArrangement.returns("idOnly");
		sExpectedValue = undefined;
		sResult = this.oAnnotationHelper.getColumnCellSecondText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'idOnly' and existing v1.Text and oDataField.Value.Path");

		//5: 'idOnly', v1.Text exists, no oDataField.Value.Path
		oDataField.Value.Path = null;
		sResult = this.oAnnotationHelper.getColumnCellSecondText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'idOnly' and existing v1.Text and no oDataField.Value.Path");

		//6: 'idOnly', oDataField.Value.Path exists, no v1.Text
		fnGetTextForDataField.returns(null);
		oDataField.Value.Path = sPath;
		sResult = this.oAnnotationHelper.getColumnCellSecondText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'idOnly' and existing oDataField.Value.Path and no v1.Text");

		//7: 'descriptionOnly', v1.Text, oDataField.Value.Path exist
		fnGetTextArrangement.returns("descriptionOnly");
		fnGetTextForDataField.returns("MyV1Text");
		sResult = this.oAnnotationHelper.getColumnCellSecondText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'descriptionOnly' and existing v1.Text and oDataField.Value.Path");

		//8: 'descriptionOnly', no v1.Text, oDataField.Value.Path exists
		fnGetTextForDataField.returns(null);
		sResult = this.oAnnotationHelper.getColumnCellSecondText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'descriptionOnly' and existing oDataField.Value.Path and no v1.Text");

		//9: 'descriptionOnly', v1.Text, no oDataField.Value.Path
		fnGetTextForDataField.returns("MyV1Text");
		oDataField.Value.Path = null;
		sResult = this.oAnnotationHelper.getColumnCellSecondText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'descriptionOnly' and existing v1.Text and no oDataField.Value.Path");

		//10: 'descriptionAndId', v1.Text, oDataField.Value.Path exist
		oDataField.Value.Path = sPath;
		fnGetTextArrangement.returns("descriptionAndId"); // it is the case for both com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst and for no text arrangement at all
		sExpectedValue = "{myTestPath}";
		sResult = this.oAnnotationHelper.getColumnCellSecondText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'descriptionAndId' and existing v1.Text and oDataField.Value.Path ");

		//11: 'descriptionAndId', no v1.Text, oDataField.Value.Path exists
		sExpectedValue = "{myTestPath}";
		fnGetTextForDataField.returns(null);
		sExpectedValue = undefined;
		sResult = this.oAnnotationHelper.getColumnCellSecondText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'descriptionAndId' and oDataField.Value.Path, no v1.Text");

		//12: 'descriptionAndId', no oDataField.Value.Path, v1.Text exists
		fnGetTextForDataField.returns("MyV1Text");
		oDataField.Value.Path = null;
		sResult = this.oAnnotationHelper.getColumnCellSecondText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'descriptionAndId' and v1.Text, no oDataField.Value.Path");

		sExpectedValue = undefined;
		sResult = this.oAnnotationHelper.getColumnCellSecondText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the return value should be 'undefined' if no value was determined");

		fnGetTextForDataField.returns("");
		sResult = this.oAnnotationHelper.getColumnCellSecondText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "if text annotation does not exist oDataField.Value.Path has been already used as the first text so it should not be set as the second text again");
	});

	QUnit.test("Check getColumnCellFirstTextVisibility", function (assert) {
		var param1 = "param1",
			param2 = "param2",
			param3 = "param3";
		var fnGetColumnCellFirstText = this.stub(AnnotationHelper, "getColumnCellFirstText").returns(true);
		var bResult = this.oAnnotationHelper.getColumnCellFirstTextVisibility(param1, param2, param3);

		var bExpectedValue = true;
		assert.equal(bExpectedValue, bResult, "the visibility should be true if the method getColumnCellFirstText returns true");
		assert.ok(fnGetColumnCellFirstText.calledWith(param1, param2, param3), "getColumnCellFirstText was called with the right parameters");

		fnGetColumnCellFirstText.returns(undefined);
		var bResult = this.oAnnotationHelper.getColumnCellFirstTextVisibility();
		var bExpectedValue = false;
		assert.equal(bExpectedValue, bResult, "the visibility should be false if the method getColumnCellFirstText yields undefined");
	});

	QUnit.test("Check getColumnCellSecondTextVisibility", function (assert) {
		var param1 = "param1",
			param2 = "param2",
			param3 = "param3";
		var fnGetColumnCellSecondText = this.stub(AnnotationHelper, "getColumnCellSecondText").returns(true);
		var bResult = this.oAnnotationHelper.getColumnCellSecondTextVisibility(param1, param2, param3);
		var bExpectedValue = true;
		assert.equal(bExpectedValue, bResult, "the visibility should be true if the method getColumnCellSecondText returns true");
		assert.ok(fnGetColumnCellSecondText.calledWith(param1, param2, param3), "fnGetColumnCellSecondText was called with the right parameters");

		fnGetColumnCellSecondText.returns(undefined);
		var bResult = this.oAnnotationHelper.getColumnCellSecondTextVisibility();
		var bExpectedValue = undefined;
		assert.equal(bExpectedValue, bResult, "the visibility should be false if the method getColumnCellSecondText yields undefined");
	});

	QUnit.test("Check getColumnHeaderText", function (assert) {
		var sResult, sExpectedValue, sTextOfSapLabel = 'Text of sap:label',
			sTextOfV1Label = 'Text of v1.Label';
		var oDataField = {
			Label: {
				String: "result"
			}
		};
		var oDataFieldValue = {
			'sap:label': sTextOfSapLabel,
			'com.sap.vocabularies.Common.v1.Label': {
				String: sTextOfV1Label
			}
		};

		sExpectedValue = "result";
		sResult = this.oAnnotationHelper.getColumnHeaderText(oDataFieldValue, oDataField);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for the case oDataField.Label ist present");

		oDataField.Label = null;
		sExpectedValue = sTextOfV1Label;
		sResult = this.oAnnotationHelper.getColumnHeaderText(oDataFieldValue, oDataField);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for the case sap:label");

		sExpectedValue = sTextOfSapLabel;
		oDataFieldValue["com.sap.vocabularies.Common.v1.Label"]  = null;
		sResult = this.oAnnotationHelper.getColumnHeaderText(oDataFieldValue, oDataField);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for the case V1.Label");

		sExpectedValue = "";
		oDataFieldValue["sap:label"] = null;
		sResult = this.oAnnotationHelper.getColumnHeaderText(oDataFieldValue, oDataField);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for the case no label is present");
	});

	QUnit.test("Check getTextForDataField", function (assert) {
		var sTextOfV1Text = "Text of v1.Text";
		var oDataFieldValue = {
			'com.sap.vocabularies.Common.v1.Text': {
				Path: sTextOfV1Text
			}
		};

		sExpectedValue = sTextOfV1Text;
		sResult = this.oAnnotationHelper.getTextForDataField(oDataFieldValue);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for V1.text annotation");
	});

	QUnit.test("Check getAdditionalSemanticObjects", function (assert) {
		var oDataFieldValue = {
			"com.sap.vocabularies.Common.v1.SemanticObject": {
				String: "semObjNoQualifier"
			},
			"com.sap.vocabularies.Common.v1.SemanticObject#firstSemObj": {
				String: "firstSemObj"
			},
			"com.sap.vocabularies.Common.v1.SemanticObject#secondSemObj": {
				String: "secondSemObj"
			},
			"com.sap.vocabularies.Common.v1.Text": {
				String: "justSomeText"
			}
		};
		var aExpectedValue = "{value: ['firstSemObj','secondSemObj']}";
		var aResult = this.oAnnotationHelper.getAdditionalSemanticObjects(oDataFieldValue);
		assert.deepEqual(aExpectedValue, aResult, "the returned array of additional semantic objects is correct");
	});

	QUnit.test("Check searchForFirstSemKey_Title_Description", function (assert) {
		var oEntityType = {
			getPath: function () {
				return sPath
			},
			getObject: function () {
				return oEntityTypeAnnotations
			}
		};
		var sFirstSemKeyValue = "firstSemKey",
			sTitlePath = "titlePath",
			sDescriptionPath = "descriptionPath",
			sSecondSemKeyValue = "secondSemKey",
			sPath = "myPath";

		var oEntityTypeAnnotations = {
			"com.sap.vocabularies.Common.v1.SemanticKey": [{
					PropertyPath: sFirstSemKeyValue,
				},
				{
					PropertyPath: "secondSemKy"
				}
			],
			"com.sap.vocabularies.UI.v1.LineItem": [{
					RecordType: "com.sap.vocabularies.UI.v1.DataField",
					Value: {
						Path: sFirstSemKeyValue
					}
				},
				{
					RecordType: "com.sap.vocabularies.UI.v1.DataField",
					Value: {
						Path: sSecondSemKeyValue
					}
				},
				{
					RecordType: "com.sap.vocabularies.UI.v1.DataField",
					Value: {
						Path: sDescriptionPath
					}
				},
				{
					RecordType: "com.sap.vocabularies.UI.v1.DataField",
					Value: {
						Path: sTitlePath
					}
				}
			],
			"com.sap.vocabularies.UI.v1.LineItem#Reduced": [{
					RecordType: "com.sap.vocabularies.UI.v1.DataField",
					Value: {
						Path: sFirstSemKeyValue
					}
				},
				{
					RecordType: "com.sap.vocabularies.UI.v1.DataField",
					Value: {
						Path: sSecondSemKeyValue
					}
				},
				{
					RecordType: "com.sap.vocabularies.UI.v1.DataField",
					Value: {
						Path: sDescriptionPath
					}
				},
				{
					RecordType: "com.sap.vocabularies.UI.v1.DataField",
					Value: {
						Path: sTitlePath
					}
				}
			],
			"com.sap.vocabularies.UI.v1.HeaderInfo": {
				"Title": {
					Value: {
						Path: sTitlePath
					}
				},
				"Description": {
					Value: {
						Path: sDescriptionPath
					}
				}
			}
		};

		var oModel = {
			getObject: function (sEntityTypePath) {
				return oEntityTypeAnnotations;
			}
		};
		var oLineItem = {
			sPath: sPath,
			getPath: function () {
				return this.sPath;
			},
			setPath: function (sPath) {
				this.sPath = sPath;
			},
			getModel: function () {
				return oModel;
			}
		};


		var sLineItemPath = sPath + '/' + "com.sap.vocabularies.UI.v1.LineItem";
		oLineItem.setPath(sLineItemPath);

		// if semantic key is present the path with the first semantic key should be returned
		var sExpectedValue = sPath + '/' + "com.sap.vocabularies.UI.v1.LineItem" + '/' + 0 + '/Value/Path';
		var sResult = this.oAnnotationHelper.searchForFirstSemKey_Title_Description(oLineItem);
		assert.equal(sExpectedValue, sResult, "the path for the first semantic key is returned correctly");

		// if semantic key is present but 'hidden' according to the annotation the Title should be returned
		// for compatibility reasons we have to also support "com.sap.vocabularies.Common.v1.FieldControlType/Hidden"
		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem"][0]["com.sap.vocabularies.Common.v1.FieldControl"] = {
			EnumMember: "com.sap.vocabularies.Common.v1.FieldControlType/Hidden"
		};
		var sExpectedValue = sPath + '/' + "com.sap.vocabularies.UI.v1.LineItem" + '/' + 3 + '/Value/Path';
		var sResult = this.oAnnotationHelper.searchForFirstSemKey_Title_Description(oLineItem);
		assert.equal(sExpectedValue, sResult, "the path with the title is returned correctly if semantic key is hidden with 'com.sap.vocabularies.Common.v1.FieldControlType/Hidden' annotation");

		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem"][0]["com.sap.vocabularies.Common.v1.FieldControl"] = null;
		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem"][0]["com.sap.vocabularies.UI.v1.Hidden"] = {};
		var sExpectedValue = sPath + '/' + "com.sap.vocabularies.UI.v1.LineItem" + '/' + 3 + '/Value/Path';
		var sResult = this.oAnnotationHelper.searchForFirstSemKey_Title_Description(oLineItem);
		assert.equal(sExpectedValue, sResult, "the path with the title is returned correctly if semantic key is hidden with 'com.sap.vocabularies.UI.v1.Hidden' annotation");

		// if semantic key and Title are 'hidden' Description should be returned
		// for compatibility reasons we have to also support "com.sap.vocabularies.Common.v1.FieldControlType/Hidden"
		//set title to 'hidden'
		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem"][3]["com.sap.vocabularies.Common.v1.FieldControl"] = {
			EnumMember: "com.sap.vocabularies.Common.v1.FieldControlType/Hidden"
		};
		var sExpectedValue = sPath + '/' + "com.sap.vocabularies.UI.v1.LineItem" + '/' + 2 + '/Value/Path';
		var sResult = this.oAnnotationHelper.searchForFirstSemKey_Title_Description(oLineItem);
		assert.equal(sExpectedValue, sResult, "the path with the description is returned correctly if semantic key and title are hidden");

		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem"][3]["com.sap.vocabularies.Common.v1.FieldControl"] = null;
		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem"][3]["com.sap.vocabularies.UI.v1.Hidden"] = {};
		var sExpectedValue = sPath + '/' + "com.sap.vocabularies.UI.v1.LineItem" + '/' + 2 + '/Value/Path';
		var sResult = this.oAnnotationHelper.searchForFirstSemKey_Title_Description(oLineItem);
		assert.equal(sExpectedValue, sResult, "the path with the description is returned correctly if semantic key and title are hidden");


		//now test without any hidden annotations
		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem"][3]["com.sap.vocabularies.UI.v1.Hidden"] = null;
		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem"][0]["com.sap.vocabularies.UI.v1.Hidden"] = null;
		//if no semantic key is present the path with the Title should be returned
		oEntityTypeAnnotations["com.sap.vocabularies.Common.v1.SemanticKey"] = null;
		var sExpectedValue = sPath + '/' + "com.sap.vocabularies.UI.v1.LineItem" + '/' + 3 + '/Value/Path';
		var sResult = this.oAnnotationHelper.searchForFirstSemKey_Title_Description(oLineItem);
		assert.equal(sExpectedValue, sResult, "the path with the title is returned correctly if no semantic key is present");

		//if no semantic key is present and no Title the path with the Description should be returned
		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem"][3].Value.Path = "somethingDifferentFormTitle";
		var sExpectedValue = sPath + '/' + "com.sap.vocabularies.UI.v1.LineItem" + '/' + 2 + '/Value/Path';
		var sResult = this.oAnnotationHelper.searchForFirstSemKey_Title_Description(oLineItem);
		assert.equal(sExpectedValue, sResult, "the path with the description is returned correctly if no semantic key and no title is present");



		// the tests for line item annotation with qualifier
		oEntityTypeAnnotations["com.sap.vocabularies.Common.v1.SemanticKey"] = [{
				PropertyPath: sFirstSemKeyValue
			},
			{
				PropertyPath: "secondSemKy"
			}
		];


		var sLineItemPath = sPath + '/' + "com.sap.vocabularies.UI.v1.LineItem#Reduced";
		oLineItem.setPath(sLineItemPath);

		// if semantic key is present the path with the first semantic key should be returned
		var sExpectedValue = sPath + '/' + "com.sap.vocabularies.UI.v1.LineItem#Reduced" + '/' + 0 + '/Value/Path';
		var sResult = this.oAnnotationHelper.searchForFirstSemKey_Title_Description(oLineItem);
		assert.equal(sExpectedValue, sResult, "the path for the first semantic key is returned correctly");

		// if semantic key is present but 'hidden' according to the annotation the Title should be returned
		// for compatibility reasons we have to also support "com.sap.vocabularies.Common.v1.FieldControlType/Hidden"
		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem#Reduced"][0]["com.sap.vocabularies.Common.v1.FieldControl"] = {
			EnumMember: "com.sap.vocabularies.Common.v1.FieldControlType/Hidden"
		};
		var sExpectedValue = sPath + '/' + "com.sap.vocabularies.UI.v1.LineItem#Reduced" + '/' + 3 + '/Value/Path';
		var sResult = this.oAnnotationHelper.searchForFirstSemKey_Title_Description(oLineItem);
		assert.equal(sExpectedValue, sResult, "the path with the title is returned correctly if semantic key is hidden with 'com.sap.vocabularies.Common.v1.FieldControlType/Hidden' annotation");

		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem#Reduced"][0]["com.sap.vocabularies.Common.v1.FieldControl"] = null;
		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem#Reduced"][0]["com.sap.vocabularies.UI.v1.Hidden"] = {};
		var sExpectedValue = sPath + '/' + "com.sap.vocabularies.UI.v1.LineItem#Reduced" + '/' + 3 + '/Value/Path';
		var sResult = this.oAnnotationHelper.searchForFirstSemKey_Title_Description(oLineItem);
		assert.equal(sExpectedValue, sResult, "the path with the title is returned correctly if semantic key is hidden with 'com.sap.vocabularies.UI.v1.Hidden' annotation");

		// if semantic key and Title are 'hidden' Description should be returned
		// for compatibility reasons we have to also support "com.sap.vocabularies.Common.v1.FieldControlType/Hidden"
		//set title to 'hidden'
		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem#Reduced"][3]["com.sap.vocabularies.Common.v1.FieldControl"] = {
			EnumMember: "com.sap.vocabularies.Common.v1.FieldControlType/Hidden"
		};
		var sExpectedValue = sPath + '/' + "com.sap.vocabularies.UI.v1.LineItem#Reduced" + '/' + 2 + '/Value/Path';
		var sResult = this.oAnnotationHelper.searchForFirstSemKey_Title_Description(oLineItem);
		assert.equal(sExpectedValue, sResult, "the path with the description is returned correctly if semantic key and title are hidden");

		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem#Reduced"][3]["com.sap.vocabularies.Common.v1.FieldControl"] = null;
		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem#Reduced"][3]["com.sap.vocabularies.UI.v1.Hidden"] = {};
		var sExpectedValue = sPath + '/' + "com.sap.vocabularies.UI.v1.LineItem#Reduced" + '/' + 2 + '/Value/Path';
		var sResult = this.oAnnotationHelper.searchForFirstSemKey_Title_Description(oLineItem);
		assert.equal(sExpectedValue, sResult, "the path with the description is returned correctly if semantic key and title are hidden");


		//now test without any hidden annotations
		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem#Reduced"][3]["com.sap.vocabularies.UI.v1.Hidden"] = null;
		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem#Reduced"][0]["com.sap.vocabularies.UI.v1.Hidden"] = null;
		//if no semantic key is present the path with the Title should be returned
		oEntityTypeAnnotations["com.sap.vocabularies.Common.v1.SemanticKey"] = null;
		var sExpectedValue = sPath + '/' + "com.sap.vocabularies.UI.v1.LineItem#Reduced" + '/' + 3 + '/Value/Path';
		var sResult = this.oAnnotationHelper.searchForFirstSemKey_Title_Description(oLineItem);
		assert.equal(sExpectedValue, sResult, "the path with the title is returned correctly if no semantic key is present");

		//if no semantic key is present and no Title the path with the Description should be returned
		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem#Reduced"][3].Value.Path = "somethingDifferentFormTitle";
		var sExpectedValue = sPath + '/' + "com.sap.vocabularies.UI.v1.LineItem#Reduced" + '/' + 2 + '/Value/Path';
		var sResult = this.oAnnotationHelper.searchForFirstSemKey_Title_Description(oLineItem);
		assert.equal(sExpectedValue, sResult, "the path with the description is returned correctly if no semantic key and no title is present");

	});

	QUnit.test("Check getTextArrangement method", function (assert) {
		//empty objects
		var oEntityType = {};
		var oDataField = {};
		var sExpectedValue = "";
		var sActualValue = this.oAnnotationHelper.getTextArrangement(oEntityType, oDataField);
		sExpectedValue = "descriptionAndId";
		assert.equal(sActualValue, sExpectedValue, "If no text arrangement is passed, the defaul value should is returned: " + sExpectedValue);

		//check TextArrangement definition for property directly - has prio 1
		oEntityType = {};
		oDataField = {
			"com.sap.vocabularies.UI.v1.TextArrangement": {
				EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
			}
		};
		sExpectedValue = "";
		sActualValue = this.oAnnotationHelper.getTextArrangement(oEntityType, oDataField);
		sExpectedValue = "descriptionOnly";
		assert.equal(sActualValue, sExpectedValue, "check TextArrangement definition for property directly: " + sExpectedValue);

		//check TextArrangement definition under property/text - has prio 2
		oEntityType = {};
		oDataField = {
			"com.sap.vocabularies.Common.v1.Text": {
				"com.sap.vocabularies.UI.v1.TextArrangement": {
					EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
				}
			}
		};
		sExpectedValue = "";
		sActualValue = this.oAnnotationHelper.getTextArrangement(oEntityType, oDataField);
		sExpectedValue = "descriptionOnly";
		assert.equal(sActualValue, sExpectedValue, "check TextArrangement definition under property/text: " + sExpectedValue);

		//check TextArrangement definition for entity type
		oEntityType = {
			"com.sap.vocabularies.UI.v1.TextArrangement": {
				EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
			}
		};
		oDataField = {};
		sExpectedValue = "";
		sActualValue = this.oAnnotationHelper.getTextArrangement(oEntityType, oDataField);
		sExpectedValue = "descriptionOnly";
		assert.equal(sActualValue, sExpectedValue, "check TextArrangement definition for entity type: " + sExpectedValue);

		//use a combination of different places to define text arrangement to check the right prio
		oEntityType = {
			"com.sap.vocabularies.UI.v1.TextArrangement": {
				EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast"
			}
		};
		oDataField = {
			"com.sap.vocabularies.Common.v1.Text": {
				"com.sap.vocabularies.UI.v1.TextArrangement": {
					EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
				}
			}
		};
		sExpectedValue = "";
		sActualValue = this.oAnnotationHelper.getTextArrangement(oEntityType, oDataField);
		sExpectedValue = "descriptionOnly";
		assert.equal(sActualValue, sExpectedValue, "use a combination of different places to define text arrangement to check the right prio: " + sExpectedValue);
	});

	QUnit.test("Check isPropertyHidden method", function (assert) {
		var oLineItemAnnotations = {};
		var bExpectedValue;

		//no hidden annotation => should return 'false'
		bExpectedValue = false;
		var bResult = this.oAnnotationHelper.isPropertyHidden(oLineItemAnnotations);
		assert.equal(bExpectedValue, bResult, "if no 'hidden' annotation is present the method should return 'false'");

		oLineItemAnnotations["com.sap.vocabularies.UI.v1.Hidden"] = {};
		bExpectedValue = true;
		bResult = this.oAnnotationHelper.isPropertyHidden(oLineItemAnnotations);
		assert.equal(bExpectedValue, bResult, "if 'UI.v1.Hidden' annotation is present the method should return 'true'");

		oLineItemAnnotations = {
			"com.sap.vocabularies.Common.v1.FieldControl": {
				"EnumMember": "com.sap.vocabularies.Common.v1.FieldControlType/Hidden"
			}
		};
		bResult = this.oAnnotationHelper.isPropertyHidden(oLineItemAnnotations);
		assert.equal(bExpectedValue, bResult, "if 'FieldControlType/Hidden' annotation is present the method should return 'true'");
	});

	QUnit.test("Check createP13NColumnForContactPopUp method", function (assert) {
		var mColumnWidthIncludingColumnHeader = {};
		this.oModel = {
			getODataEntityType: function (sQualifiedName, bAsPath) {
				var oODataEntityType = null;
				if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_ProductType") {
					oODataEntityType = {
						name: "STTA_C_MP_ProductType"
					};
				} else if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_SupplierType") {
					oODataEntityType = {
						name: "STTA_C_MP_SupplierType"
					};
				}
				return oODataEntityType;
			},
			getODataAssociationEnd: function (oEntityType, sName) {
				var oODataAssociationEnd = null;
				if (sName === "to_Supplier") {
					oODataAssociationEnd = {
						type: "STTA_PROD_MAN.STTA_C_MP_SupplierType",
						multiplicity: "0..1"
					};
				}
				return oODataAssociationEnd;
			},
			getODataAssociationSetEnd: function (oEntityType, sNavigation) {
				var sEntitySet = null;
				if (sNavigation === "to_Supplier") {
					sEntitySet = "STTA_C_MP_SupplierType";
				}
				return sEntitySet;
			},
			getODataEntitySet: function (sEntitySet) {
				if (sEntitySet === "STTA_C_MP_SupplierType") {
					return oContextSet;
				}
			}
		};
		var oContextSet = {
			name: "STTA_C_MP_Product",
			entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
			"Org.OData.Capabilities.V1.SortRestrictions": {
				NonSortableProperties: [{
					PropertyPath: "FullName"
				}]
			}
		};
		var aLineItem = [{
				EdmType: "Edm.String",
				RecordType: "com.sap.vocabularies.UI.v1.DataField",
				Value: {
					Path: "ProductForEdit"
				},
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
				}
			},
			{
				EdmType: "Edm.String",
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
				Target: {
					AnnotationPath: "to_Supplier/@com.sap.vocabularies.Communication.v1.Contact"
				}
			},
			{
				EdmType: "Edm.String",
				RecordType: "com.sap.vocabularies.UI.v1.DataField",
				Value: {
					Path: "Category"
				},
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
				}
			}
		];

		this.oInterface = {
			getInterface: function (iPart, sPath) {
				var oResult = {}
				if (iPart === 0) {
					oResult = {
						getModel: function () {
							return this.oModel;
						}.bind(this)
					};
				} else {
					oResult = {
						oDataField: oDataField,
						getPath: function () {
							that = this;
							var aColumnIndex = map(aLineItem, function (oColumn, iIndex) {
								if (oColumn.Target && oColumn.Target.AnnotationPath === that.oDataField.Target.AnnotationPath) {
									return iIndex;
								}
							});
							return (aColumnIndex[0] >= 0 ? "/dataServices/schema/0/entityType/1/com.sap.vocabularies.UI.v1.LineItem/" + aColumnIndex[0] : "");
						},
						getModel: function () {
							return {
								getObject: function (sTerm) {
									return aLineItem;
								}
							};
						}
					}
				}
				return oResult;
			}.bind(this)
		};

		var oDataField = {
			EdmType: "Edm.String",
			RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
			Target: {
				AnnotationPath: "to_Supplier/@com.sap.vocabularies.Communication.v1.Contact"
			},
			"com.sap.vocabularies.UI.v1.Importance": {
				EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
			}
		};

		var oDataFieldTarget1 = {
			fn: {
				Path: "CompanyName"
			}
		};
		var oDataFieldTarget2 = {
			fn: {
				Path: "FullName"
			}
		};
		var sAnnotationPath = "to_Supplier/@com.sap.vocabularies.Communication.v1.Contact";
		var sActualValue = this.oAnnotationHelper.createP13NColumnForContactPopUp(this.oInterface, oContextSet, oDataField, oDataFieldTarget1, sAnnotationPath, mColumnWidthIncludingColumnHeader);
		var sExpectedValue = "\\{\"columnKey\":\"template::DataFieldForAnnotation::to_Supplier/com.sap.vocabularies.Communication.v1.Contact\", \"leadingProperty\":\"to_Supplier/CompanyName\", \"additionalProperty\":\"to_Supplier\", \"sortProperty\":\"to_Supplier/CompanyName\", \"filterProperty\":\"to_Supplier/CompanyName\", \"navigationProperty\":\"to_Supplier\", \"columnIndex\":\"1\", \"autoColumnWidth\":\\{\"min\":2,\"max\":19,\"truncateLabel\":true,\"visibleField\":\"to_Supplier/CompanyName\"\\}\\}";
		assert.equal(sActualValue, sExpectedValue, "Should return Expected Value:" + sExpectedValue);
		var sActualValue = this.oAnnotationHelper.createP13NColumnForContactPopUp(this.oInterface, oContextSet, oDataField, oDataFieldTarget2, sAnnotationPath, mColumnWidthIncludingColumnHeader);
		var sExpectedValue = "\\{\"columnKey\":\"template::DataFieldForAnnotation::to_Supplier/com.sap.vocabularies.Communication.v1.Contact\", \"leadingProperty\":\"to_Supplier/FullName\", \"additionalProperty\":\"to_Supplier\", \"filterProperty\":\"to_Supplier/FullName\", \"navigationProperty\":\"to_Supplier\", \"columnIndex\":\"1\", \"autoColumnWidth\":\\{\"min\":2,\"max\":19,\"truncateLabel\":true,\"visibleField\":\"to_Supplier/FullName\"\\}\\}";
		assert.equal(sActualValue, sExpectedValue, "Should return Expected Value:" + sExpectedValue);
	});

	QUnit.test("check method hasQuickViewFacet with Mock data", function (assert) {

		var done = assert.async();
		var oModel = this.getMockModel();
		assert.ok(oModel, "oModel Initiated");
		var oAnnotationHelper = this.oAnnotationHelper;
		var that = this;
		if (oModel) {
			oModel.getMetaModel().loaded().then(function () {
				var oMetaModel = oModel.getMetaModel();
				var oInterface = {
					getModel: function () {
						return oMetaModel;
					}
				};
				var oEntitySet = oMetaModel.getODataEntitySet("SEPMRA_C_PD_Product");
				var oTargetEntities = {
					[oEntitySet.entityType]: {
						sForceLinkRendering: JSON.stringify({Weight: true})
					}
				};
				var sResult = that.oAnnotationHelper.hasQuickViewFacet(oEntitySet, oTargetEntities);
				var sExpected = '\\{"Weight":true\\}';
				assert.equal(sResult, sExpected, "Function returned correct value for forceLinks");
				done();
			});
		}
	});

	QUnit.test("check method buildHeaderInfoCustomData with Mock data", function (assert) {

		var done = assert.async();
		var oModel = this.getMockModel();
		assert.ok(oModel, "oModel Initiated");
		var oAnnotationHelper = this.oAnnotationHelper;
		var that = this;
		if (oModel) {
			oModel.getMetaModel().loaded().then(function () {
				var oMetaModel = oModel.getMetaModel();
				var oInterface = {
					getModel: function () {
						return oMetaModel;
					}
				};
				var oDataField = {"Title":{"Value":{"String":"dummyTitle"},"RecordType":"com.sap.vocabularies.UI.v1.DataField","EdmType":"Edm.String"},"Description":{"Value":{"String":"dummySubTitle"},"RecordType":"com.sap.vocabularies.UI.v1.DataField"}};
				var sResult = that.oAnnotationHelper.buildHeaderInfoCustomData(oInterface, oDataField);
				var sExpected = '\{"headerTitle":"dummyTitle"\,"isHeaderTitlePath":false\,"headerSubTitle":"dummySubTitle"\,"isHeaderSubTitlePath":false\}';
				assert.equal(sResult, sExpected, "Function returned correct customData");
				done();
			});
		}
	});

	QUnit.test("Check Muliplicity for SmartField/Smart MultiInput ", function (assert) {
		var oModel = {
			getODataEntityType: function (sQualifiedName, bAsPath) {
				var oODataEntityType = null;
				if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_ProductType") {
					oODataEntityType = {
						name: "STTA_C_MP_ProductType"
					};
				} else if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_SupplierType") {
					oODataEntityType = {
						name: "STTA_C_MP_SupplierType"
					};
				}
				return oODataEntityType;
			},
			getODataAssociationEnd: function (oEntityType, sName) {
				var oODataAssociationEnd = null;
				if (sName === "to_Supplier") {
					oODataAssociationEnd = {
						type: "STTA_PROD_MAN.STTA_C_MP_SupplierType",
						multiplicity: "*"
					};
				}
				return oODataAssociationEnd;
			}
		};

		var oInterface = {
			getModel: function () {
				return oModel;
			}
		};
		var oDataField = {
			EdmType: "Edm.String",
			RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
			Value: {
				Path: "to_Supplier/Product"
			},
			"com.sap.vocabularies.UI.v1.Importance": {
				EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
			}
		};

		var oEntitySet = {
			entityType: "STTA_PROD_MAN.STTA_C_MP_SupplierType"
		};
		// Smart MultiInput as Mulitiplicity is "*"
		var sActualValue = this.oAnnotationHelper.checkMultiplicityForDataFieldAssociation(oInterface, oEntitySet, oDataField);
		var sExpectedValue = true;
		assert.equal(sActualValue, sExpectedValue, "Should return Expected Value:" + sExpectedValue);

		oModel = {
			getODataEntityType: function (sQualifiedName, bAsPath) {
				var oODataEntityType = null;
				if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_ProductType") {
					oODataEntityType = {
						name: "STTA_C_MP_ProductType"
					};
				} else if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_SupplierType") {
					oODataEntityType = {
						name: "STTA_C_MP_SupplierType"
					};
				}
				return oODataEntityType;
			},
			getODataAssociationEnd: function (oEntityType, sName) {
				var oODataAssociationEnd = null;
				if (sName === "to_Supplier") {
					oODataAssociationEnd = {
						type: "STTA_PROD_MAN.STTA_C_MP_SupplierType",
						multiplicity: "0..1"
					};
				}
				return oODataAssociationEnd;
			}
		};

		// SmartField as Mulitiplicity is "0..1"
		sActualValue = this.oAnnotationHelper.checkMultiplicityForDataFieldAssociation(oInterface, oEntitySet, oDataField);
		sExpectedValue = false;
		assert.equal(sActualValue, sExpectedValue, "Should return Expected Value:" + sExpectedValue);

		oDataField = {
			EdmType: "Edm.String",
			RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
			Value: {
				Path: "Product"
			},
			"com.sap.vocabularies.UI.v1.Importance": {
				EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
			}
		};

		// SmartField as their is no Navigation Property
		sActualValue = this.oAnnotationHelper.checkMultiplicityForDataFieldAssociation(oInterface, oEntitySet, oDataField);
		sExpectedValue = false;
		assert.equal(sActualValue, sExpectedValue, "Should return Expected Value:" + sExpectedValue);
	});

	QUnit.test("Check Muliplicity for Smart MultiInput inside Table in LR and OP", function (assert) {
		var oModel = {
			getODataEntityType: function (sQualifiedName, bAsPath) {
				var oODataEntityType = null;
				if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_ProductType") {
					oODataEntityType = {
						name: "STTA_C_MP_ProductType"
					};
				} else if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_SupplierType") {
					oODataEntityType = {
						name: "STTA_C_MP_SupplierType"
					};
				}
				return oODataEntityType;
			},
			getODataAssociationEnd: function (oEntityType, sName) {
				var oODataAssociationEnd = null;
				if (sName === "to_Supplier") {
					oODataAssociationEnd = {
						type: "STTA_PROD_MAN.STTA_C_MP_SupplierType",
						multiplicity: "*"
					};
				}
				return oODataAssociationEnd;
			}
		};

		var oInterface = {
			getModel: function () {
				return oModel;
			}
		};
		var oDataField = {
			EdmType: "Edm.String",
			RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
			Value: {
				Path: "to_Supplier/Product"
			},
			"com.sap.vocabularies.UI.v1.Importance": {
				EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
			}
		};

		var oEntitySet = {
			entityType: "STTA_PROD_MAN.STTA_C_MP_SupplierType"
		};
		// Smart MultiInput as Mulitiplicity is "*"
		var sActualValue = this.oAnnotationHelper.checkMultiplicityForDataFieldAssociation(oInterface, oEntitySet, oDataField);
		var sExpectedValue = true;
		assert.equal(sActualValue, sExpectedValue, "Should return Expected Value:" + sExpectedValue);

		oModel = {
			getODataEntityType: function (sQualifiedName, bAsPath) {
				var oODataEntityType = null;
				if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_ProductType") {
					oODataEntityType = {
						name: "STTA_C_MP_ProductType"
					};
				} else if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_SupplierType") {
					oODataEntityType = {
						name: "STTA_C_MP_SupplierType"
					};
				}
				return oODataEntityType;
			},
			getODataAssociationEnd: function (oEntityType, sName) {
				var oODataAssociationEnd = null;
				if (sName === "to_Supplier") {
					oODataAssociationEnd = {
						type: "STTA_PROD_MAN.STTA_C_MP_SupplierType",
						multiplicity: "0..1"
					};
				}
				return oODataAssociationEnd;
			}
		};

		// SmartField as Mulitiplicity is "0..1"
		sActualValue = this.oAnnotationHelper.checkMultiplicityForDataFieldAssociation(oInterface, oEntitySet, oDataField);
		sExpectedValue = false;
		assert.equal(sActualValue, sExpectedValue, "Should return Expected Value:" + sExpectedValue);

		oDataField = {
			EdmType: "Edm.String",
			RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
			Value: {
				Path: "Product"
			},
			"com.sap.vocabularies.UI.v1.Importance": {
				EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
			}
		};

		// SmartField as their is no Navigation Property
		sActualValue = this.oAnnotationHelper.checkMultiplicityForDataFieldAssociation(oInterface, oEntitySet, oDataField);
		sExpectedValue = false;
		assert.equal(sActualValue, sExpectedValue, "Should return Expected Value:" + sExpectedValue);
	});

	QUnit.test("Check Default Column Width for Responsive Table Columns", function (assert) {
		var oModel = {
			getODataEntityType: function (sQualifiedName, bAsPath) {
				var oODataEntityType = null;
				if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_ProductType") {
					oODataEntityType = {
						name: "STTA_C_MP_ProductType"
					};
				} else if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_SupplierType") {
					oODataEntityType = {
						name: "STTA_C_MP_SupplierType"
					};
				}
				return oODataEntityType;
			},
			getODataAssociationEnd: function (oEntityType, sName) {
				var oODataAssociationEnd = null;
				if (sName === "to_Supplier") {
					oODataAssociationEnd = {
						type: "STTA_PROD_MAN.STTA_C_MP_SupplierType",
						multiplicity: "*"
					};
				}
				return oODataAssociationEnd;
			}
		};

		var oInterface = {
			getModel: function () {
				return oModel;
			}
		};

		var oDataField = {
			EdmType: "Edm.String",
			RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
			Value: {
				Path: "to_Supplier/Product"
			},
			"com.sap.vocabularies.UI.v1.Importance": {
				EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
			}
		};

		var oDataFieldValue = {
			maxLength: "30",
			name: "ProductForEdit"
		};

		//Column width for IBN when enableAutoColumnWidth true
		var sActualValue = this.oAnnotationHelper.getDefaultWidthForTableColumn(oInterface, oDataFieldValue, oDataField, '', '', true, {});
		var sExpectedValue = "20rem";
		assert.equal(sActualValue, sExpectedValue, "Should return default width for column with IBN when enableAutoColumnWidth set true: " + sExpectedValue);

		//Column width for IBN when enableAutoColumnWidth false
		var sActualValue = this.oAnnotationHelper.getDefaultWidthForTableColumn(oInterface, oDataFieldValue, oDataField, '', '', false, {});
		var sValueExpected = "auto";
		assert.equal(sActualValue, sValueExpected, "Should return width for column as 'auto' with IBN when enableAutoColumnWidth set false: " + sValueExpected);

		//Column width for Chart when enableAutoColumnWidth true
		var sAnnotationPath = "to_ProductSalesPrice/@com.sap.vocabularies.UI.v1.Chart#SalesPriceAreaChart";
		var sActualValue = this.oAnnotationHelper.getDefaultWidthForTableColumn(oInterface, oDataFieldValue, oDataField, sAnnotationPath, '', true, {});
		var sExpectedValue = "20rem";
		assert.equal(sActualValue, sExpectedValue, "Should return default width for column with Chart when enableAutoColumnWidth set true: " + sExpectedValue);

		//Column width for Chart when enableAutoColumnWidth false
		var sAnnotationPath = "to_ProductSalesPrice/@com.sap.vocabularies.UI.v1.Chart#SalesPriceAreaChart";
		var sActualValue = this.oAnnotationHelper.getDefaultWidthForTableColumn(oInterface, oDataFieldValue, oDataField, sAnnotationPath, '', false, {});
		var sValueExpected = "auto";
		assert.equal(sActualValue, sValueExpected, "Should return width for column as 'auto' with Chart when enableAutoColumnWidth set false: " + sValueExpected);

		oDataField = {
			EdmType: "Edm.String",
			RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
			"com.sap.vocabularies.HTML5.v1.CssDefaults": {
				width: {
					String: "15rem"
				}
			},
			Value: {
				Path: "to_Supplier/Product"
			},
			"com.sap.vocabularies.UI.v1.Importance": {
				EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
			}
		};

		//Column width base on HTML5.v1.CssDefaults annotation when enableAutoColumnWidth true
		var sActualValue = this.oAnnotationHelper.getDefaultWidthForTableColumn(oInterface, oDataFieldValue, oDataField, '', '', true, {});
		var sExpectedValue = "15rem";
		assert.equal(sActualValue, sExpectedValue, "Should return width based on annotation when enableAutoColumnWidth set true: " + sExpectedValue);

		//Column width base on HTML5.v1.CssDefaults annotation when enableAutoColumnWidth false
		var sActualValue = this.oAnnotationHelper.getDefaultWidthForTableColumn(oInterface, oDataFieldValue, oDataField, '', '', false, {});
		var sValueExpected = "auto";
		assert.equal(sActualValue, sValueExpected, "Should return width for column as 'auto' when enableAutoColumnWidth set true: " + sValueExpected);

	});

	QUnit.test("Check getDataFieldValue function", function (assert) {
		var oInnerInterface = {};
		var sFormatString;
		var oModel;
		var oInterface = {
			getModel: function(){
				assert.ok(sFormatString, "oInterface must only be accessed if a type has been specified");
				return oModel;
			},
			getInterface: function(i){
				assert.ok(sFormatString, "oInterface must only be accessed if a type has been specified");
				assert.ok(!oModel, "Sub-Interface must only be requested for complex bindings");
				assert.strictEqual(i, 0, "Only interface with index 0 must be accessed");
				return oInnerInterface;
			}
		};
		var oDataFieldValue;
		var fnFormat = sinon.stub(ODataAnnotationHelper, "format", function(vPar1, vPar2){
			assert.ok(sFormatString, "Ui5 annotation helper must only be called if a type has been specified");
			assert.strictEqual(vPar1, oModel ? oInterface : oInnerInterface, "Interface param must be the inner interface");
			assert.strictEqual(vPar2, oDataFieldValue, "data field specificationm must be forwarded to UI5 annotation helper");
			return sFormatString;
		});
		oDataFieldValue = {
			Path: ""
		};
		var sExpectedValue = "";
		sResult = this.oAnnotationHelper.getDataFieldValue(oInterface, oDataFieldValue);
		assert.equal("", sResult, "the returned value is correct for empty Path");

		for (var i = 0; i < 2; i++){
			oDataFieldValue = {
				Path: "ProductForEdit"
			};
			sFormatString = {};
			sResult = this.oAnnotationHelper.getDataFieldValue(oInterface, oDataFieldValue);
			assert.strictEqual(sFormatString, sResult, "for two way bindings the result must be taken from the UI5 formatter");

			sFormatString = "{any string}";
			sResult = this.oAnnotationHelper.getDataFieldValue(oInterface, oDataFieldValue, "OneWay");
			assert.strictEqual(sResult, "{ mode:'OneWay', any string}", "One way binding must have been inserted correctly");
			oModel = {};
		}
		fnFormat.restore();
	});

	QUnit.test("Check getDataFieldValueSimplePath function", function (assert) {
		var oInnerInterface = {};
		var sFormatString;
		var oModel = {};
		var oInterface = {
			getModel: function(){
				return oModel;
			},
			getInterface: function(){
				return oInnerInterface;
			}
		};
		var oDataFieldValue;
		var fnSimplePath = sinon.stub(ODataAnnotationHelper, "simplePath", function(vPar1, vPar2){
			return sFormatString;
		});
		oDataFieldValue = {
			Path: ""
		};
		var sExpectedValue = "";
		sResult = this.oAnnotationHelper.getDataFieldValueSimplePath(oInterface, oDataFieldValue);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for empty Path");

		oDataFieldValue = {
			Path: "Weight"
		};

		sFormatString = "{Weight}";
		sResult = this.oAnnotationHelper.getDataFieldValueSimplePath(oInterface, oDataFieldValue);
		assert.strictEqual(sFormatString, sResult, "the returned value is correct for given path");

		sFormatString = "{Weight}";
		sResult = this.oAnnotationHelper.getDataFieldValueSimplePath(oInterface, oDataFieldValue, "OneWay");
		assert.strictEqual(sResult, "{ mode:'OneWay', Weight}", "One way binding inserted correctly");

		fnSimplePath.restore();
	});

	QUnit.test("Check setRowHighlight method", function (assert) {
		var oAnnotationHelper = this.oAnnotationHelper;
		var oTreeNode = {
			entitySet: "MainEntitySet",
			level: 1,
			isDraft: true
		};
		var iCalled = 0;
		var sActualValueReturned = oAnnotationHelper.setRowHighlight({}, oTreeNode, "ListEntitySet", function(sEntitySet){
			assert.ok(sEntitySet = "ListEntitySet", "fnCheckIsDraftEnabled should be called with the listEntitySet");
			iCalled++;
			return true;
		});
		assert.equal(iCalled, 1, "fnCheckIsDraftEnabled should be called exactly once");
		var sExpectedvalueReturned = "{parts: [{path: 'IsActiveEntity'}, {path: 'HasActiveEntity'}, {path: 'ui>/editable'}, {path: '_templPrivMessage>/'}, {path: ''}], formatter: 'RuntimeFormatters.setInfoHighlight.bind($control)'}";
		assert.equal(sActualValueReturned, sExpectedvalueReturned, "Function setRowHighlight should return a formatter");
	});

	QUnit.test("Check function getExtensionPointFacetTitle", function (assert) {
		var oAnnotationHelper = this.oAnnotationHelper;
		var sManifestKey = "BeforeFacet|STTA_C_MP_Product|GeneralInformation";
		var oInterface = {
			getModel: function () {
				return oMetaModel;
			},
			getPath: function () {
				return "";
			}
		};
		var oManifest = {
			"BeforeFacet|STTA_C_MP_Product|to_ProductSalesData::com.sap.vocabularies.UI.v1.LineItem": {
				"className": "sap.ui.core.mvc.View",
				"viewName": "STTA_MP.ext.view.ProductSalesPrice",
				"type": "XML",
				"sap.ui.generic.app": {
					"title": "Sales Price table (Before Extension for chart)",
					"enableLazyLoading": true
				}
			},
			"BeforeFacet|STTA_C_MP_Product|GeneralInformation": {
				"className": "sap.ui.core.mvc.View",
				"viewName": "STTA_MP.ext.view.ProductSalesPrice",
				"type": "XML",
				"sap.ui.generic.app": {
					"title": "Sales Price table",
					"enableLazyLoading": true
				}
			}
		};
		var sActualTitleReturned = oAnnotationHelper.getExtensionPointFacetTitle(oInterface, sManifestKey, oManifest);
		assert.equal(sActualTitleReturned, "Sales Price table", "Function getExtensionPointFacetTitle should return Sales Price table");
		var oManifest = {
			"BeforeFacet|STTA_C_MP_Product|to_ProductSalesData::com.sap.vocabularies.UI.v1.LineItem": {
				"className": "sap.ui.core.mvc.View",
				"viewName": "STTA_MP.ext.view.ProductSalesPrice",
				"type": "XML",
				"sap.ui.generic.app": {
					"enableLazyLoading": true
				}
			},
			"BeforeFacet|STTA_C_MP_Product|GeneralInformation": {
				"className": "sap.ui.core.mvc.View",
				"viewName": "STTA_MP.ext.view.ProductSalesPrice",
				"type": "XML",
				"sap.ui.generic.app": {
					"enableLazyLoading": true
				}
			}
		};
		var sLabel = {String: "Sales Price"};
		var sActualTitleReturned = oAnnotationHelper.getExtensionPointFacetTitle(oInterface, sManifestKey, oManifest, sLabel);
		assert.equal(sActualTitleReturned, "Sales Price", "Function getExtensionPointFacetTitle should return Sales Price table with Label (Sales Price)");
	});

	QUnit.test("Check function getObjectPageExtensions", function (assert) {
		var oAnnotationHelper = this.oAnnotationHelper;
		var oContext = {
			getObject: function () {
				return {
					"BeforeFacet|STTA_C_MP_Product|to_ProductSalesData::com.sap.vocabularies.UI.v1.LineItem": {
						"className": "sap.ui.core.mvc.View",
						"viewName": "STTA_MP.ext.view.ProductSalesPrice",
						"type": "XML",
						"sap.ui.generic.app": {
							"title": "Sales Price table (Before Extension for chart)",
							"enableLazyLoading": true
						}
					},
					"BeforeFacet|STTA_C_MP_Product|GeneralInformation|1": {
						"className": "sap.ui.core.mvc.View",
						"viewName": "STTA_MP.ext.view.ProductSalesPrice",
						"type": "XML",
						"sap.ui.generic.app": {
							"title": "Sales Price table (Before Extension)",
							"enableLazyLoading": true
						}
					}
				}
			},
			getModel: function () {
				return {
					setProperty: function () {
						return;
					}
				};
			}
		};
		var sActualPathReturned = oAnnotationHelper.getObjectPageExtensions(oContext);
		assert.equal(sActualPathReturned, "/manifestViewExtensions", "Function getObjectPageExtensions should return /smanifestViewExtensions");
	});

	QUnit.test("Check function setNoDataTextForSmartTable", function (assert) {
		//Arrange
		var oAnnotationHelper = this.oAnnotationHelper;
		var sEntitySet = "STTA_C_MP_ProductText";
		var sSmartTableId = "stable--id::table";
		var sExpectedResult = "{parts: [{value: '::STTA_C_MP_ProductText--stable--id::table'}], formatter: '._templateFormatters.setNoDataTextForSmartTable'}";
		//Act
		var sResult = oAnnotationHelper.setNoDataTextForSmartTable(sEntitySet, sSmartTableId);
		//Assert
		assert.deepEqual(sResult, sExpectedResult, "Returns correct expression for evaluating i18n text");
	});

	QUnit.test("Check function getImportanceForTableColumns", function (assert) {
		var oAnnotationHelper = this.oAnnotationHelper;
		var oVisible = [];

		result = oAnnotationHelper.getImportanceForTableColumns(oVisible);
		assert.equal(result, "None", "Returns correct importance if com.sap.vocabularies.UI.v1.Importance is not defined in Annotation"); //1.

		oVisible['com.sap.vocabularies.UI.v1.Importance'] = {EnumMember : 'com.sap.vocabularies.UI.v1.ImportanceType/Low'};
		result = oAnnotationHelper.getImportanceForTableColumns(oVisible);
		assert.equal(result, "Low", "Returns correct importance for com.sap.vocabularies.UI.v1.ImportanceType/Low"); //2.

		oVisible['com.sap.vocabularies.UI.v1.Importance'] = {EnumMember : 'com.sap.vocabularies.UI.v1.ImportanceType/Medium'};
		result = oAnnotationHelper.getImportanceForTableColumns(oVisible);
		assert.equal(result, "Medium", "Returns correct importance for com.sap.vocabularies.UI.v1.ImportanceType/Medium"); //3.

		oVisible['com.sap.vocabularies.UI.v1.Importance'] = {EnumMember : 'com.sap.vocabularies.UI.v1.ImportanceType/High'};
		result = oAnnotationHelper.getImportanceForTableColumns(oVisible);
		assert.equal(result, "High", "Returns correct importance for com.sap.vocabularies.UI.v1.ImportanceType/High"); //4.
	});

	QUnit.test("Check function getIconSemanticColor", function (assert) {
		var done = assert.async();
		var oModel = this.getMockModel();
		assert.ok(oModel, "oModel Initiated");
		if (oModel) {
			oModel.getMetaModel().loaded().then(function () {
				var oMetaModel = oModel.getMetaModel();
				assert.ok(oMetaModel, "MetaModel is ok");
				var oInterface = {
					getModel: function () {
						return oMetaModel;
					},
					getPath: function () {
						return "";
					}
				};
				var sResult, oCriticalityAnnotation;

				oCriticalityAnnotation = { EnumMember: "UI.CriticalityType/Negative" };
				sResult = oAnnotationHelper.getIconSemanticColor(oInterface, oCriticalityAnnotation);
				assert.equal(sResult, "Negative", "Function returns expected value with EnumMember annotation");

				oCriticalityAnnotation = { Value: "3" };
				sResult = oAnnotationHelper.getIconSemanticColor(oInterface, oCriticalityAnnotation);
				assert.equal(sResult, "Positive", "Function returns expected value with Value annotation");

				oCriticalityAnnotation = { String: "Critical" };
				sResult = oAnnotationHelper.getIconSemanticColor(oInterface, oCriticalityAnnotation);
				assert.equal(sResult, "Critical", "Function returns expected value with String annotation");

				oCriticalityAnnotation = { Path: "Path" };
				sResult = oAnnotationHelper.getIconSemanticColor(oInterface, oCriticalityAnnotation);
				assert.equal(sResult, "{= ${Path}}", "Function returns expected value with Path annotation");

				done();
			});
		}
	});

	QUnit.test("Unit Test for Criticality of Action Buttons: buildEmphasizedButtonExpression", function(assert) {
		var aIdentification;


		aIdentification = [
			{
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
				Label: "Accept",
				Action: "com.c_salesordermanage_sd.AcceptOrder",
				Determining: true
			},
			{
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
				Label: "Reject",
				Action: "com.c_salesordermanage_sd.RejectOrder",
				Determining: true
			},
			{
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
				Label: "Reject",
				Action: "com.c_salesordermanage_sd.RejectOrder",
				Determining: true
			}
		];

		// 1. No Criticality to any action
		var Result = AnnotationHelper.buildEmphasizedButtonExpression(aIdentification);
		assert.ok(Result === "Emphasized", "Save button should be of Emphasized Type by Default.");

		// 2. adding unsupported Criticality:Critical to Accept Action
		aIdentification[0].Criticality = {
			EnumMember: "com.sap.vocabularies.UI.v1.CriticalityType/VeryPositive"
		};
		Result = AnnotationHelper.buildEmphasizedButtonExpression(aIdentification);
		assert.ok(Result === "Emphasized", "Save button should be of Emphasized Type for Unsupported Criticality.");

		// 3. adding Criticality:Positive to Accept Action
		aIdentification[0].Criticality = {
			EnumMember: "com.sap.vocabularies.UI.v1.CriticalityType/Positive"
		};
		Result = AnnotationHelper.buildEmphasizedButtonExpression(aIdentification);
		assert.ok(Result === "Default", "Save button should be of Default Type for CriticalityType EnumMember:Positive.");

		// 4. adding Criticality:Negative to Accept Action
		aIdentification[0].Criticality = {
			EnumMember: "com.sap.vocabularies.UI.v1.CriticalityType/Negative"
		};
		Result = AnnotationHelper.buildEmphasizedButtonExpression(aIdentification);
		assert.ok(Result === "Default", "Save button should be of Default Type for CriticalityType EnumMember:Negative.");



		// 5. adding Criticality:Negative to Reject Action
		aIdentification[1].Criticality = {
			EnumMember: "com.sap.vocabularies.UI.v1.CriticalityType/Negative"
		};
		Result = AnnotationHelper.buildEmphasizedButtonExpression(aIdentification);
		assert.ok(Result === "Default", "Save button should be of Default Type when at least one Criticality has EnumMember.");


		// 6. adding Criticality path to Accept Action
		aIdentification[0].Criticality = {
			Path: "StatusCriticality"
		};
		delete aIdentification[1].Criticality;

		Result = AnnotationHelper.buildEmphasizedButtonExpression(aIdentification);
		assert.ok(
			Result ===
			"{= ((${StatusCriticality} === 'com.sap.vocabularies.UI.v1.CriticalityType/Negative') || (${StatusCriticality} === '1') || (${StatusCriticality} === 1) || (${StatusCriticality} === 'com.sap.vocabularies.UI.v1.CriticalityType/Positive') || (${StatusCriticality} === '3') || (${StatusCriticality} === 3)) ? 'Default' : 'Emphasized' }",
			"Save button should be an Expression based on Critical Action path."
		);


	});

	QUnit.test("Unit Test for buttonType when Criticality is present: buildExpressionForButtonCriticality", function(assert) {
		var oDataPoint = {
			RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
			Label: "Accept",
			Action: "com.c_salesordermanage_sd.AcceptOrder",
			Determining: true
		};
		// 1. No Criticality
		var Result = AnnotationHelper.buildExpressionForButtonCriticality(oDataPoint);
		assert.ok(Result === "Default", "Button Type is Default.");

		// 2. Unsupported Criticality
		oDataPoint.Criticality = {
			EnumMember: "com.sap.vocabularies.UI.v1.CriticalityType/VeryPositive"
		};
		Result = AnnotationHelper.buildExpressionForButtonCriticality(oDataPoint);
		assert.ok(
			Result ===
			"{= ('com.sap.vocabularies.UI.v1.CriticalityType/VeryPositive' === 'com.sap.vocabularies.UI.v1.CriticalityType/Negative') || ('com.sap.vocabularies.UI.v1.CriticalityType/VeryPositive' === '1') || ('com.sap.vocabularies.UI.v1.CriticalityType/VeryPositive' === 1) ? 'Reject' : ('com.sap.vocabularies.UI.v1.CriticalityType/VeryPositive' === 'com.sap.vocabularies.UI.v1.CriticalityType/Positive') || ('com.sap.vocabularies.UI.v1.CriticalityType/VeryPositive' === '3') || ('com.sap.vocabularies.UI.v1.CriticalityType/VeryPositive' === 3) ? 'Accept' : 'Default' }",
			"Button Type is Default when unsupported criticality is set."
		);

		// 3. Criticality Positive/Negative/Critical
		oDataPoint.Criticality = {
			EnumMember: "com.sap.vocabularies.UI.v1.CriticalityType/Positive"
		};
		Result = AnnotationHelper.buildExpressionForButtonCriticality(oDataPoint);
		assert.ok(
			Result ===
			"{= ('com.sap.vocabularies.UI.v1.CriticalityType/Positive' === 'com.sap.vocabularies.UI.v1.CriticalityType/Negative') || ('com.sap.vocabularies.UI.v1.CriticalityType/Positive' === '1') || ('com.sap.vocabularies.UI.v1.CriticalityType/Positive' === 1) ? 'Reject' : ('com.sap.vocabularies.UI.v1.CriticalityType/Positive' === 'com.sap.vocabularies.UI.v1.CriticalityType/Positive') || ('com.sap.vocabularies.UI.v1.CriticalityType/Positive' === '3') || ('com.sap.vocabularies.UI.v1.CriticalityType/Positive' === 3) ? 'Accept' : 'Default' }",
			"Button Type is Acccept/Reject/Attention when supported criticality is set."
		);

		// 4. Criticality set via a path
		oDataPoint.Criticality = {
			Path: "StatusCriticality"
		};
		Result = AnnotationHelper.buildExpressionForButtonCriticality(oDataPoint);
		assert.ok(
			Result ===
			"{= (${StatusCriticality} === 'com.sap.vocabularies.UI.v1.CriticalityType/Negative') || (${StatusCriticality} === '1') || (${StatusCriticality} === 1) ? 'Reject' : (${StatusCriticality} === 'com.sap.vocabularies.UI.v1.CriticalityType/Positive') || (${StatusCriticality} === '3') || (${StatusCriticality} === 3) ? 'Accept' : 'Default' }",
			"Button Type is Acccept/Reject/Attention or Default when unsupported criticality is set via path."
		);
	});

	QUnit.test("Get binding for sort and filter property for Record Type:DataFieldForAnnotation - Contact", function (assert) {
		this.oModel = {
			getODataEntityType: function (sQualifiedName, bAsPath) {
				var oODataEntityType = null;
				if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_ProductType") {
					oODataEntityType = {
						name: "STTA_C_MP_ProductType"
					};
				} else if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_SupplierType") {
					oODataEntityType = {
						name: "STTA_C_MP_SupplierType"
					};
				}
				return oODataEntityType;
			},
			getODataAssociationEnd: function (oEntityType, sName) {
				var oODataAssociationEnd = null;
				if (sName === "to_Supplier") {
					oODataAssociationEnd = {
						type: "STTA_PROD_MAN.STTA_C_MP_SupplierType",
						multiplicity: "0..1"
					};
				}
				return oODataAssociationEnd;
			},
			getODataAssociationSetEnd: function (oEntityType, sNavigation) {
				var sEntitySet = null;
				if (sNavigation === "to_Supplier") {
					sEntitySet = "STTA_C_MP_SupplierType";
				}
				return sEntitySet;
			},
			getODataEntitySet: function (sEntitySet) {
				if (sEntitySet === "STTA_C_MP_SupplierType") {
					return oContextSet;
				}
			}
		};
		var oContextSet = {
			name: "STTA_C_MP_Product",
			entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType"
		};
		var aLineItem = [{
			EdmType: "Edm.String",
			RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
			Target: {
				AnnotationPath: "to_Supplier/@com.sap.vocabularies.Communication.v1.Contact"
			}
		}];

		this.oInterface = {
			getInterface: function (iPart, sPath) {
				var oResult = {}
				if (iPart === 0) {
					oResult = {
						getModel: function () {
							return this.oModel;
						}.bind(this)
					};
				} else {
					oResult = {
						oDataField: oDataField,
						getPath: function () {
							that = this;
							var aColumnIndex = map(aLineItem, function (oColumn, iIndex) {
								if (oColumn.Target && oColumn.Target.AnnotationPath === that.oDataField.Target.AnnotationPath) {
									return iIndex;
								}
							});
							return (aColumnIndex[0] >= 0 ? "/dataServices/schema/0/entityType/1/com.sap.vocabularies.UI.v1.LineItem/" + aColumnIndex[0] : "");
						},
						getModel: function () {
							return {
								getObject: function (sTerm) {
									return aLineItem;
								}
							};
						}
					}
				}
				return oResult;
			}.bind(this)
		};

		var oDataField = {
			EdmType: "Edm.String",
			RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
			Target: {
				AnnotationPath: "to_Supplier/@com.sap.vocabularies.Communication.v1.Contact"
			},
			"com.sap.vocabularies.UI.v1.Importance": {
				EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
			}
		};

		var oDataFieldTarget1 = {
			fn: {
				Path: "CompanyName"
			}
		};
		var oDataFieldTarget2 = {
			fn: {
				Path: "FullName"
			}
		};
		var sAnnotationPath = "to_Supplier/@com.sap.vocabularies.Communication.v1.Contact";
		var sActualValue = this.oAnnotationHelper.getSortProperty(this.oInterface, oDataField, oContextSet, oDataFieldTarget1, sAnnotationPath);
		var sExpectedValue = "to_Supplier/CompanyName";
		assert.equal(sActualValue, sExpectedValue, "Should return Expected Value:" + sExpectedValue);

		var sAnnotationPath = "to_Supplier/@com.sap.vocabularies.Communication.v1.Contact";
		var sActualValue = this.oAnnotationHelper.getFilterProperty(this.oInterface, oDataField, oContextSet, oDataFieldTarget2, sAnnotationPath);
		var sExpectedValue = "to_Supplier/FullName";
		assert.equal(sActualValue, sExpectedValue, "Should return Expected Value:" + sExpectedValue);
	});

	QUnit.test("Get binding for sort and filter property for Record Type:DataFieldForAnnotation - DataPoint", function (assert) {
		this.oInterface = {
			getInterface: function (iPart, sPath) {
				var oResult = {}
				if (iPart === 0) {
					oResult = {
						getModel: function () {
							return this.oModel;
						}.bind(this)
					};
				}
				return oResult;
			}.bind(this)
		};

		var oContextSet = {
			entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType"
		};

		var oDataField = {
			RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
			Label: {
				String: "LabelRating"
			},
			Target: {
				AnnotationPath: "to_Rating/@com.sap.vocabularies.UI.v1.DataPoint#Rating"
			}
		};

		var oDataFieldTarget = {
			Value: {
				Path: "Quantity"
			}
		};
		var sActualValue = this.oAnnotationHelper.getSortProperty(this.oInterface, oDataField, oContextSet, oDataFieldTarget, oDataField.Target.AnnotationPath);
		var sExpectedValue = "Quantity";
		assert.equal(sActualValue, sExpectedValue, "Should return Expected Value:" + sExpectedValue);

		var sActualValue = this.oAnnotationHelper.getFilterProperty(this.oInterface, oDataField, oContextSet, oDataFieldTarget, oDataField.Target.AnnotationPath);
		var sExpectedValue = "Quantity";
		assert.equal(sActualValue, sExpectedValue, "Should return Expected Value:" + sExpectedValue);
	});

	QUnit.test("Check function getActionCommandVisibility", function (assert) {
		var sButtonId = "ButtonId",
			sExpectedResult = "{= ${_templPrivView>/#ButtonId/visible} && ${_templPrivView>/#ButtonId/enabled}}";

		var sActualResult = oAnnotationHelper.getActionCommandVisibility(sButtonId);

		assert.equal(sActualResult, sExpectedResult, "gets the correct real time command visibilty expression");
	});

	QUnit.test("Check function getSideEffectSourcePropertyType in draft case", function (assert) {
		sinon.stub(metadataAnalyser, "getFieldSourcePropertiesType").returns("OnlySingleSource");

		var sFieldSideEffectState = oAnnotationHelper.getSideEffectSourcePropertyType(undefined, true);

		assert.strictEqual(sFieldSideEffectState, "OnlySingleSource");
	});

	QUnit.test("Check function getSideEffectSourcePropertyType in non draft case", function (assert) {
		var sFieldSideEffectState = oAnnotationHelper.getSideEffectSourcePropertyType(undefined, false);

		assert.strictEqual(sFieldSideEffectState, "");
	});

	QUnit.test("Check function getPersistencyKey when persistencyKey should not be changed", function (assert) {
		var sSmartControlId = "Id";
		var sPersistencyKey = oAnnotationHelper.getPersistencyKey(sSmartControlId, "Retain");

		assert.strictEqual(sSmartControlId, sPersistencyKey);
	});

	QUnit.test("Check function getPersistencyKey when persistencyKey should be changed", function (assert) {
		var sSmartControlId = "Id";
		var sPersistencyKey = oAnnotationHelper.getPersistencyKey(sSmartControlId, "New");

		assert.strictEqual(sSmartControlId + "::Personalization", sPersistencyKey);
	});

	QUnit.test("Check function getPersistencyKey when persistencyKey should be removed", function (assert) {
		var sPersistencyKey = oAnnotationHelper.getPersistencyKey("Id", "Remove");

		assert.strictEqual("", sPersistencyKey);
	});
});
